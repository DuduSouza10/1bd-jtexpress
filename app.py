from __future__ import annotations

import os
import re
import shutil
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, render_template, request
from openpyxl import load_workbook

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))
DATA_DIR.mkdir(parents=True, exist_ok=True)
BACKUP_DIR = DATA_DIR / "backups"
BACKUP_DIR.mkdir(parents=True, exist_ok=True)
DATA_FILE = Path(os.getenv("DATA_FILE", str(DATA_DIR / "1B_GERAL.xlsx")))
SEED_FILE = BASE_DIR / "data" / "1B_GERAL.xlsx"
if not DATA_FILE.exists() and SEED_FILE.exists() and DATA_FILE.resolve() != SEED_FILE.resolve():
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SEED_FILE, DATA_FILE)
UPDATE_PASSWORD = os.getenv("UPDATE_PASSWORD", "3264542")
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "30"))

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024

REQUIRED = {
    "pedido": ["pedido"],
    "remessa": ["remessa"],
    "status": ["status de chamado"],
    "registro": ["data de registro"],
    "base": ["base de entrega"],
    "regional": ["regional"],
    "assinatura": ["tempo de assinatura"],
    "assinado": ["se foi assinado"],
    "rm": ["rm"],
}


def norm(text: Any) -> str:
    text = "" if text is None else str(text)
    text = text.replace("\n", " ").replace("\r", " ")
    return re.sub(r"\s+", " ", text).strip().lower()


def clean_value(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value).strip()


def parse_dt(value: Any) -> datetime | None:
    if value in (None, "", 0, "0"):
        return None
    if isinstance(value, datetime):
        return value
    text = clean_value(value)
    if not text or text == "0":
        return None
    formats = (
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d %H:%M",
        "%d/%m/%Y %H:%M:%S",
        "%d/%m/%Y %H:%M",
        "%Y-%m-%d",
        "%d/%m/%Y",
    )
    for fmt in formats:
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def dt_iso(value: Any) -> str | None:
    dt = parse_dt(value)
    return dt.strftime("%Y-%m-%dT%H:%M:%S") if dt else None


def find_sheet(wb) -> Any:
    for name in wb.sheetnames:
        if norm(name) == "detalhes":
            return wb[name]
    raise ValueError("A planilha precisa conter uma aba chamada 'detalhes'.")


def header_map(ws) -> dict[str, int]:
    raw = [cell.value for cell in ws[1]]
    normalized = [norm(v) for v in raw]
    result: dict[str, int] = {}
    for key, needles in REQUIRED.items():
        if key == "rm":
            matches = [i for i, v in enumerate(normalized, start=1) if v == "rm"]
        else:
            matches = [
                i for i, v in enumerate(normalized, start=1)
                if all(needle in v for needle in needles)
            ]
        if not matches:
            raise ValueError(f"Coluna obrigatória não encontrada: {needles[0]}")
        result[key] = matches[0]
    return result


def short_status(value: str) -> str:
    return value.split("|", 1)[0].strip() if value else "Sem status"


def is_open_status(value: str) -> bool:
    s = norm(short_status(value))
    return s not in {"fechado", "processamento concluído", "processamento concluido"}


def load_data(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Arquivo de dados não encontrado: {path}")

    wb = load_workbook(path, read_only=True, data_only=True)
    ws = find_sheet(wb)
    cols = header_map(ws)
    rows: list[dict[str, Any]] = []

    min_reg: datetime | None = None
    max_reg: datetime | None = None

    for r_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        def cell(key: str) -> Any:
            idx = cols[key] - 1
            return row[idx] if idx < len(row) else None

        pedido = clean_value(cell("pedido"))
        remessa = clean_value(cell("remessa"))
        if not pedido and not remessa:
            continue

        status = clean_value(cell("status"))
        registro_raw = cell("registro")
        assinatura_raw = cell("assinatura")
        registro_dt = parse_dt(registro_raw)
        assinatura_dt = parse_dt(assinatura_raw)
        tempo_horas = None
        if registro_dt and assinatura_dt:
            delta = (assinatura_dt - registro_dt).total_seconds() / 3600
            if delta >= 0:
                tempo_horas = round(delta, 2)

        if registro_dt:
            min_reg = registro_dt if min_reg is None or registro_dt < min_reg else min_reg
            max_reg = registro_dt if max_reg is None or registro_dt > max_reg else max_reg

        rows.append({
            "id": r_idx,
            "pedido": pedido,
            "remessa": remessa,
            "status": status,
            "statusCurto": short_status(status),
            "registro": dt_iso(registro_raw),
            "base": clean_value(cell("base")) or "Sem base",
            "regional": clean_value(cell("regional")) or "Sem regional",
            "assinatura": dt_iso(assinatura_raw),
            "assinado": clean_value(cell("assinado")) or "Não",
            "rm": clean_value(cell("rm")) or "Sem RM",
            "tempoAssinaturaHoras": tempo_horas,
            "aberto": is_open_status(status),
        })

    wb.close()
    mtime = datetime.fromtimestamp(path.stat().st_mtime).astimezone()
    return {
        "rows": rows,
        "meta": {
            "source": path.name,
            "totalRows": len(rows),
            "updatedAt": mtime.isoformat(timespec="seconds"),
            "dateMin": min_reg.strftime("%Y-%m-%d") if min_reg else None,
            "dateMax": max_reg.strftime("%Y-%m-%d") if max_reg else None,
        },
    }


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/health")
def health():
    return jsonify({"status": "ok", "data_file": DATA_FILE.name})


@app.get("/api/data")
def api_data():
    try:
        return jsonify(load_data(DATA_FILE))
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.post("/api/update")
def api_update():
    password = request.form.get("password", "")
    upload = request.files.get("file")

    if password != UPDATE_PASSWORD:
        return jsonify({"error": "Senha incorreta. Os dados não foram alterados."}), 403
    if not upload or not upload.filename:
        return jsonify({"error": "Selecione a planilha .xlsx antes de atualizar."}), 400
    if not upload.filename.lower().endswith(".xlsx"):
        return jsonify({"error": "Formato inválido. Envie um arquivo .xlsx."}), 400

    tmp_path: Path | None = None
    try:
        fd, tmp_name = tempfile.mkstemp(prefix="upload_1bd_", suffix=".xlsx", dir=DATA_DIR)
        os.close(fd)
        tmp_path = Path(tmp_name)
        upload.save(tmp_path)

        # Valida completamente antes de tocar no arquivo atual.
        validated = load_data(tmp_path)
        if validated["meta"]["totalRows"] == 0:
            raise ValueError("A aba 'detalhes' não possui registros válidos.")

        if DATA_FILE.exists():
            stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            shutil.copy2(DATA_FILE, BACKUP_DIR / f"1B_GERAL_{stamp}.xlsx")

        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        os.replace(tmp_path, DATA_FILE)
        tmp_path = None

        fresh = load_data(DATA_FILE)
        return jsonify({
            "ok": True,
            "message": "Dados atualizados com sucesso.",
            "meta": fresh["meta"],
        })
    except Exception as exc:
        return jsonify({"error": f"Não foi possível atualizar: {exc}"}), 400
    finally:
        if tmp_path and tmp_path.exists():
            tmp_path.unlink(missing_ok=True)


@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": f"Arquivo maior que o limite de {MAX_UPLOAD_MB} MB."}), 413


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG") == "1")
