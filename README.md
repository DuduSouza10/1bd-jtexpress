# Relatório 1BD — Dashboard

Dashboard Flask criado a partir da aba `detalhes` da planilha 1BD.

## Executar localmente

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Abra `http://127.0.0.1:5000`.

## Atualização de dados

- Use o botão **Atualizar dados** ou a aba **Atualizar dados**.
- Envie um arquivo `.xlsx` com a aba `detalhes`.
- A senha padrão é definida pela variável `UPDATE_PASSWORD`. Se ela não existir, o app usa `3264542`.
- O arquivo é validado antes da troca.
- O arquivo anterior recebe um backup em `data/backups/`.

## Railway

O projeto já inclui `Procfile` e `railway.json`.

Variáveis recomendadas:

- `UPDATE_PASSWORD`: senha de atualização.
- `DATA_DIR`: diretório persistente dos dados, caso use Railway Volume (ex.: `/data`).
- `MAX_UPLOAD_MB`: limite do arquivo, padrão `30`.

> Em deploy sem volume persistente, uma atualização enviada pela interface pode ser perdida em um novo deploy/restart. Para preservar uploads, monte um Railway Volume e configure `DATA_DIR=/data`.

## Regras dos indicadores

- **Quantidade de 1BD:** quantidade de registros/chamados no filtro.
- **Pacotes Entregues:** remessas únicas com `Se foi assinado = Sim`; o subtítulo também mostra a quantidade de registros assinados.
- **Chamados em Aberto:** todos os status exceto `Fechado` e `Processamento concluído`.
- **Tempo até assinatura:** diferença entre `data de registro` e `Tempo de assinatura`, quando as duas datas são válidas.
