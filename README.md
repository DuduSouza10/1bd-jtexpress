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

## Atualização e edição de dados

- Use o botão **Atualizar dados** ou a aba **Atualizar dados** para substituir a base por outro arquivo `.xlsx`.
- Use a aba **Editar dados** para alterar diretamente as células da aba `detalhes`, sem precisar importar outro arquivo.
- O editor possui busca, paginação, quantidade de linhas por página, controle de alterações pendentes e salvamento em lote.
- A mesma senha de atualização é exigida para salvar alterações diretas. A senha padrão é definida por `UPDATE_PASSWORD`; se a variável não existir, o app usa `3264542`.
- Antes de qualquer edição direta ou troca de arquivo, o app cria um backup em `data/backups/`.
- A edição direta altera somente as células modificadas dentro do XLSX, preservando as demais fórmulas e valores em cache do arquivo.

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

## Idiomas

- Interface completa em **Português** e **Chinês Simplificado (简体中文)**.
- O botão `中文 / PT` no cabeçalho troca o idioma de toda a interface, incluindo filtros, cards, gráficos, tabelas, editor da planilha, mensagens de atualização e datas.
- A preferência de idioma fica salva no navegador (`localStorage`).
