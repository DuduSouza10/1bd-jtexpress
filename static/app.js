const state = {
  all: [], filtered: [], meta: {}, ranking: [], lang: 'pt',
  filters: { regional:'', rm:'', base:'', status:'', assinado:'', time:'', from:'', to:'' },
  editor: {loaded:false, page:1, perPage:50, pages:1, total:0, query:'', headers:[], rows:[], pending:new Map(), searchTimer:null}
};

const I18N = {
  pt: {
    pageTitle: 'Relatório 1BD',
    logosAria: 'J&T Express e TikTok',
    operationEyebrow: 'OPERAÇÃO • 1BD',
    title: 'Relatório 1BD',
    subtitle: 'Assinatura, chamados e desempenho por RM e base de entrega.',
    loadingData: 'Carregando dados...',
    updateData: 'Atualizar dados',
    mainNavAria: 'Navegação principal',
    dashboard: 'Dashboard',
    editData: 'Editar dados',
    spreadsheetEditorUpper: 'EDIÇÃO DA PLANILHA',
    spreadsheetEditorTitle: 'Editar dados sem importar outro arquivo',
    spreadsheetEditorDescription: 'Altere as células da aba detalhes diretamente por aqui. O dashboard é atualizado assim que as alterações forem salvas.',
    noPendingChanges: 'Nenhuma alteração pendente',
    pendingChanges: '{count} alteração(ões) pendente(s)',
    searchSpreadsheet: 'Buscar na planilha',
    searchSpreadsheetPlaceholder: 'Buscar pedido, base, RM...',
    rowsPerPage: 'Linhas por página',
    reloadSpreadsheet: 'Recarregar',
    loadingSpreadsheet: 'Carregando planilha...',
    previousPage: 'Anterior',
    nextPage: 'Próxima',
    pageInfo: 'Página {page} de {pages}',
    totalRowsEditor: '{count} linhas encontradas',
    saveDirectChanges: 'Salvar alterações na planilha atual',
    saveDirectHint: 'A mesma senha de atualização é obrigatória. Um backup é criado antes de salvar.',
    discardChanges: 'Descartar alterações',
    saveChanges: 'Salvar alterações',
    savingChanges: 'Salvando...',
    editorNoRows: 'Nenhuma linha encontrada.',
    editorLoadError: 'Não foi possível carregar a planilha para edição.',
    editorPasswordRequired: 'Digite a senha para salvar as alterações.',
    editorNothingToSave: 'Não há alterações para salvar.',
    editorSaveSuccess: '{count} alteração(ões) salva(s) com sucesso.',
    editorSaveError: 'Não foi possível salvar as alterações.',
    filters: 'FILTROS',
    refineAnalysis: 'Refine a análise',
    clearFilters: 'Limpar filtros',
    regional: 'Regional',
    deliveryBase: 'Base de Entrega',
    ticketStatus: 'Status do Chamado',
    signature: 'Assinatura',
    signatureTime: 'Tempo de Assinatura',
    allFeminine: 'Todas',
    allMasculine: 'Todos',
    signed: 'Assinado',
    unsigned: 'Não assinado',
    allRanges: 'Todas as faixas',
    noSignature: 'Sem assinatura',
    upTo6h: 'Até 6h',
    range6to12: '6–12h',
    range12to24: '12–24h',
    range24to48: '24–48h',
    over48h: 'Acima de 48h',
    startDate: 'Data inicial',
    endDate: 'Data final',
    showingAllBase: 'Exibindo toda a base.',
    quantity1bd: 'Quantidade de 1BD',
    recordsFilteredPeriod: 'registros no período filtrado',
    deliveredPackages: 'Pacotes Entregues',
    uniqueSignedShipments: 'remessas únicas assinadas',
    openTickets: 'Chamados em Aberto',
    pendingProcessing: 'pendentes ou em processamento',
    signatureRate: 'Taxa de assinatura',
    avgSignatureTime: 'Tempo médio até assinatura',
    basesInFilter: 'Bases no filtro',
    rmsInFilter: 'RMs no filtro',
    performance: 'DESEMPENHO',
    signatureRateByRM: 'Taxa de assinatura por RM',
    clickBarToFilter: 'Clique em uma barra para filtrar',
    rmBreakdownAria: 'Detalhamento de volume por RM',
    rmBreakdownKicker: 'VOLUME',
    rmBreakdownTitle: 'Dados por RM',
    rmBreakdownHint: '1BD, assinados e não assinados',
    status: 'STATUS',
    tickets: 'Chamados',
    bases: 'BASES',
    top10By1bd: 'Top 10 por quantidade de 1BD',
    clickToFilter: 'Clique para filtrar',
    signatureUpper: 'ASSINATURA',
    timeUntilSignature: 'Tempo até assinatura',
    evolution: 'EVOLUÇÃO',
    trendTitle: '1BD e assinaturas por data de registro',
    basedOnRegistrationDate: 'Baseado na data de registro do chamado',
    details: 'DETALHAMENTO',
    rankingByRM: 'Ranking por RM',
    searchRMOrRegional: 'Buscar RM ou Regional...',
    baseCount: 'Bases',
    exportCsv: 'Exportar CSV',
    base: 'Base',
    signedPlural: 'Assinados',
    unsignedPlural: 'Não assinados',
    rate: 'Taxa',
    openShort: 'Em aberto',
    avgTime: 'Tempo médio',
    updateUpper: 'ATUALIZAÇÃO',
    updateBaseTitle: 'Atualizar base do Relatório 1BD',
    updateBaseDescription: 'Envie a nova planilha <strong>.xlsx</strong>. A troca só é aplicada após validação da estrutura e confirmação da senha.',
    selectSpreadsheet: 'Selecionar planilha',
    dragFileHere: 'ou arraste o arquivo para esta área',
    noFileSelected: 'Nenhum arquivo selecionado',
    passwordToApply: 'Senha para aplicar a atualização',
    enterPassword: 'Digite a senha',
    validateAndUpdate: 'Validar e atualizar dados',
    currentSource: 'FONTE ATUAL',
    records: 'Registros',
    period: 'Período',
    lastUpdate: 'Última atualização',
    importRules: 'REGRAS DE IMPORTAÇÃO',
    beforeApply: 'Antes de aplicar',
    ruleDetailsSheet: 'A aba <strong>detalhes</strong> é obrigatória.',
    ruleColumns: 'RM, Base de Entrega, Tempo de Assinatura e Se foi assinado precisam existir.',
    rulePassword: 'A senha é obrigatória; sem ela nenhuma alteração é salva.',
    ruleBackup: 'O arquivo atual é copiado automaticamente para backup antes da troca.',
    close: 'Fechar',
    updateDataUpper: 'ATUALIZAR DADOS',
    importNewSpreadsheet: 'Importar nova planilha 1BD',
    spreadsheetValidated: 'A planilha será validada antes de substituir os dados atuais.',
    addSpreadsheet: 'Adicionar planilha',
    xlsxRequired: 'Arquivo .xlsx obrigatório',
    password: 'Senha',
    applyUpdate: 'Aplicar atualização',
    loadingFailed: 'Falha ao carregar os dados',
    loadError: 'Erro ao carregar dados',
    dataReloaded: 'Dados recarregados com sucesso.',
    uniqueShipmentsFilter: '{count} remessas únicas no filtro',
    signedRecords: '{count} registros marcados como assinados',
    openShare: '{percent} dos chamados filtrados',
    noTicketsFilter: 'sem chamados no filtro',
    filterRegional: 'Regional: {value}',
    filterRM: 'RM: {value}',
    filterBase: 'Base: {value}',
    filterStatus: 'Status: {value}',
    filterSignature: 'Assinatura: {value}',
    filterTime: 'Tempo: {value}',
    filterFrom: 'Desde {value}',
    filterTo: 'Até {value}',
    filteredRecords: '{count} registros',
    showingAllRecords: 'Exibindo toda a base • {count} registros',
    noInfo: 'Sem informação',
    chartSignatureRate: 'Taxa de assinatura',
    chartSigned: 'assinados',
    chartSignatures: 'Assinaturas',
    chartSignedPlural: 'Assinados',
    noRecordsFound: 'Nenhum registro encontrado.',
    tableFooter: '{count} RMs exibidos • ranking por quantidade de 1BD',
    csvPosition: 'Posição',
    csvNotSigned: 'Não assinados',
    csvSignatureRate: 'Taxa de assinatura',
    csvOpen: 'Em aberto',
    csvAvgHours: 'Tempo médio (h)',
    lastUpdateValue: 'Última atualização: {value}',
    selectXlsx: 'Selecione a planilha .xlsx.',
    sendXlsx: 'Envie um arquivo .xlsx.',
    enterPasswordError: 'Digite a senha para aplicar a atualização.',
    updating: 'Atualizando...',
    updateFailed: 'Falha na atualização',
    updateSuccess: 'Dados atualizados com sucesso.',
    baseUpdatedToast: 'Base 1BD atualizada com sucesso.',
    updateGenericError: 'Erro ao atualizar dados.',
    languageSwitchAria: '切换到简体中文',
    languageSwitchTitle: '切换到简体中文',
    statusNoStatus: 'Sem status',
    statusClosed: 'Fechado',
    statusProcessingComplete: 'Processamento concluído',
    statusOpen: 'Em aberto',
    statusPending: 'Pendente',
    statusProcessing: 'Em processamento',
    statusCompleted: 'Concluído',
    statusFinished: 'Finalizado'
  },
  zh: {
    pageTitle: '1BD 报表',
    logosAria: 'J&T Express 与 TikTok',
    operationEyebrow: '运营 • 1BD',
    title: '1BD 报表',
    subtitle: '按 RM 和派送网点分析签收、工单及运营表现。',
    loadingData: '正在加载数据...',
    updateData: '更新数据',
    mainNavAria: '主导航',
    dashboard: '仪表板',
    editData: '编辑数据',
    spreadsheetEditorUpper: '表格编辑',
    spreadsheetEditorTitle: '无需导入新文件即可编辑数据',
    spreadsheetEditorDescription: '可直接在此修改 detalhes 工作表中的单元格。保存后仪表板会立即刷新。',
    noPendingChanges: '没有待保存的更改',
    pendingChanges: '有 {count} 项待保存更改',
    searchSpreadsheet: '搜索表格',
    searchSpreadsheetPlaceholder: '搜索工单、网点、RM...',
    rowsPerPage: '每页行数',
    reloadSpreadsheet: '重新加载',
    loadingSpreadsheet: '正在加载表格...',
    previousPage: '上一页',
    nextPage: '下一页',
    pageInfo: '第 {page} / {pages} 页',
    totalRowsEditor: '找到 {count} 行',
    saveDirectChanges: '保存到当前表格',
    saveDirectHint: '必须使用相同的更新密码。保存前会自动创建备份。',
    discardChanges: '放弃更改',
    saveChanges: '保存更改',
    savingChanges: '正在保存...',
    editorNoRows: '未找到任何行。',
    editorLoadError: '无法加载表格进行编辑。',
    editorPasswordRequired: '请输入密码以保存更改。',
    editorNothingToSave: '没有需要保存的更改。',
    editorSaveSuccess: '已成功保存 {count} 项更改。',
    editorSaveError: '无法保存更改。',
    filters: '筛选',
    refineAnalysis: '筛选分析范围',
    clearFilters: '清除筛选',
    regional: '区域',
    deliveryBase: '派送网点',
    ticketStatus: '工单状态',
    signature: '签收',
    signatureTime: '签收时间',
    allFeminine: '全部',
    allMasculine: '全部',
    signed: '已签收',
    unsigned: '未签收',
    allRanges: '全部时段',
    noSignature: '未签收',
    upTo6h: '6小时以内',
    range6to12: '6–12小时',
    range12to24: '12–24小时',
    range24to48: '24–48小时',
    over48h: '48小时以上',
    startDate: '开始日期',
    endDate: '结束日期',
    showingAllBase: '正在显示全部数据。',
    quantity1bd: '1BD 数量',
    recordsFilteredPeriod: '筛选期间内的记录数',
    deliveredPackages: '已送达包裹',
    uniqueSignedShipments: '已签收的唯一运单',
    openTickets: '未关闭工单',
    pendingProcessing: '待处理或处理中',
    signatureRate: '签收率',
    avgSignatureTime: '平均签收用时',
    basesInFilter: '筛选中的网点数',
    rmsInFilter: '筛选中的 RM 数',
    performance: '表现',
    signatureRateByRM: '各 RM 签收率',
    clickBarToFilter: '点击柱状图进行筛选',
    rmBreakdownAria: '按 RM 查看数量明细',
    rmBreakdownKicker: '数量',
    rmBreakdownTitle: 'RM 数据',
    rmBreakdownHint: '1BD、已签收和未签收',
    status: '状态',
    tickets: '工单',
    bases: '网点',
    top10By1bd: '1BD 数量 Top 10',
    clickToFilter: '点击进行筛选',
    signatureUpper: '签收',
    timeUntilSignature: '签收用时',
    evolution: '趋势',
    trendTitle: '按登记日期统计 1BD 与签收',
    basedOnRegistrationDate: '基于工单登记日期',
    details: '明细',
    rankingByRM: 'RM 排名',
    searchRMOrRegional: '搜索 RM 或区域...',
    baseCount: '网点数',
    exportCsv: '导出 CSV',
    base: '网点',
    signedPlural: '已签收',
    unsignedPlural: '未签收',
    rate: '签收率',
    openShort: '未关闭',
    avgTime: '平均用时',
    updateUpper: '数据更新',
    updateBaseTitle: '更新 1BD 报表数据源',
    updateBaseDescription: '上传新的 <strong>.xlsx</strong> 文件。仅在结构验证通过并确认密码后才会替换当前数据。',
    selectSpreadsheet: '选择表格文件',
    dragFileHere: '或将文件拖放到此区域',
    noFileSelected: '尚未选择文件',
    passwordToApply: '输入密码以应用更新',
    enterPassword: '请输入密码',
    validateAndUpdate: '验证并更新数据',
    currentSource: '当前数据源',
    records: '记录数',
    period: '日期范围',
    lastUpdate: '最后更新时间',
    importRules: '导入规则',
    beforeApply: '应用前请确认',
    ruleDetailsSheet: '必须包含名为 <strong>detalhes</strong> 的工作表。',
    ruleColumns: '必须存在 RM、派送网点、签收时间以及是否签收等字段。',
    rulePassword: '必须输入密码；没有密码不会保存任何更改。',
    ruleBackup: '替换前会自动备份当前文件。',
    close: '关闭',
    updateDataUpper: '更新数据',
    importNewSpreadsheet: '导入新的 1BD 表格',
    spreadsheetValidated: '替换当前数据前会先验证表格结构。',
    addSpreadsheet: '添加表格文件',
    xlsxRequired: '必须上传 .xlsx 文件',
    password: '密码',
    applyUpdate: '应用更新',
    loadingFailed: '数据加载失败',
    loadError: '加载数据时出错',
    dataReloaded: '数据重新加载成功。',
    uniqueShipmentsFilter: '筛选范围内 {count} 个唯一运单',
    signedRecords: '{count} 条记录标记为已签收',
    openShare: '占筛选工单的 {percent}',
    noTicketsFilter: '筛选范围内无工单',
    filterRegional: '区域：{value}',
    filterRM: 'RM：{value}',
    filterBase: '网点：{value}',
    filterStatus: '状态：{value}',
    filterSignature: '签收：{value}',
    filterTime: '时间：{value}',
    filterFrom: '自 {value}',
    filterTo: '至 {value}',
    filteredRecords: '{count} 条记录',
    showingAllRecords: '正在显示全部数据 • {count} 条记录',
    noInfo: '无信息',
    chartSignatureRate: '签收率',
    chartSigned: '已签收',
    chartSignatures: '签收数量',
    chartSignedPlural: '已签收',
    noRecordsFound: '未找到记录。',
    tableFooter: '显示 {count} 个 RM • 按 1BD 数量排名',
    csvPosition: '排名',
    csvNotSigned: '未签收',
    csvSignatureRate: '签收率',
    csvOpen: '未关闭',
    csvAvgHours: '平均用时（小时）',
    lastUpdateValue: '最后更新时间：{value}',
    selectXlsx: '请选择 .xlsx 文件。',
    sendXlsx: '请上传 .xlsx 文件。',
    enterPasswordError: '请输入密码以应用更新。',
    updating: '正在更新...',
    updateFailed: '更新失败',
    updateSuccess: '数据更新成功。',
    baseUpdatedToast: '1BD 数据源更新成功。',
    updateGenericError: '更新数据时出错。',
    languageSwitchAria: '切换到葡萄牙语',
    languageSwitchTitle: '切换到葡萄牙语',
    statusNoStatus: '无状态',
    statusClosed: '已关闭',
    statusProcessingComplete: '处理完成',
    statusOpen: '未关闭',
    statusPending: '待处理',
    statusProcessing: '处理中',
    statusCompleted: '已完成',
    statusFinished: '已完成'
  }
};

const $ = (id) => document.getElementById(id);
const locale = () => state.lang === 'zh' ? 'zh-CN' : 'pt-BR';
const formatNumber = (value) => new Intl.NumberFormat(locale()).format(value ?? 0);
const formatDecimal = (value, digits=1) => new Intl.NumberFormat(locale(), {minimumFractionDigits:digits, maximumFractionDigits:digits}).format(value ?? 0);
const t = (key, vars={}) => {
  let text = (I18N[state.lang] && I18N[state.lang][key]) ?? I18N.pt[key] ?? key;
  Object.entries(vars).forEach(([k,v]) => { text = text.replaceAll(`{${k}}`, String(v)); });
  return text;
};
const setButtonLabel = (btn, key) => {
  const label = btn?.querySelector('[data-i18n]');
  if (label) label.textContent = t(key);
  else if (btn) btn.textContent = t(key);
};
const pct = (n) => `${formatDecimal(Number.isFinite(n) ? n : 0, 1)}%`;
const hours = (n) => {
  if (!Number.isFinite(n)) return '—';
  if (state.lang === 'zh') {
    if (n < 1) return `${Math.round(n*60)} 分钟`;
    if (n < 24) return `${formatDecimal(n,1)} 小时`;
    return `${formatDecimal(n/24,1)} 天`;
  }
  if (n < 1) return `${Math.round(n*60)} min`;
  if (n < 24) return `${formatDecimal(n,1)} h`;
  return `${formatDecimal(n/24,1)} d`;
};
const dateBR = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale(), {dateStyle:'short', timeStyle:'short'}).format(d);
};
const dateOnlyBR = (ymd) => {
  if (!ymd) return '—';
  const [y,m,d] = ymd.split('-');
  return state.lang === 'zh' ? `${y}/${Number(m)}/${Number(d)}` : `${d}/${m}/${y}`;
};
const normalize = (s) => (s ?? '').toString().trim().toLowerCase();
const normalizePlain = (s) => normalize(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const uniqueSorted = (arr) => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b, locale()));

function applyTranslations(){
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'pt-BR';
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel)); });
  const toggle = $('languageToggle');
  toggle.textContent = state.lang === 'zh' ? 'PT' : '中文';
  toggle.setAttribute('aria-label', t('languageSwitchAria'));
  toggle.title = t('languageSwitchTitle');
  refreshSelectedFileLabels();
  updateEditorDirtyUI();
  updateEditorPageMeta();
}

function setLanguage(lang, save=true){
  state.lang = lang === 'zh' ? 'zh' : 'pt';
  if(save) localStorage.setItem('relatorio1bd_lang', state.lang);
  applyTranslations();
  if(state.all.length){
    populateFilters(false);
    applyFilters();
    updateSourceInfo();
  }
  if(state.editor.loaded) renderEditor();
}

function toggleLanguage(){ setLanguage(state.lang === 'pt' ? 'zh' : 'pt'); }

function translateStatus(value){
  if(state.lang !== 'zh') return value || t('statusNoStatus');
  const key = normalizePlain(value);
  const map = {
    'sem status': 'statusNoStatus',
    'fechado': 'statusClosed',
    'encerrado': 'statusClosed',
    'processamento concluido': 'statusProcessingComplete',
    'em aberto': 'statusOpen',
    'aberto': 'statusOpen',
    'pendente': 'statusPending',
    'processamento': 'statusProcessing',
    'em processamento': 'statusProcessing',
    'concluido': 'statusCompleted',
    'concluida': 'statusCompleted',
    'finalizado': 'statusFinished',
    'finalizada': 'statusFinished'
  };
  return map[key] ? t(map[key]) : (value || t('statusNoStatus'));
}

function translateSignatureValue(value){
  const v = normalizePlain(value);
  if(v === 'sim') return t('signed');
  if(v === 'nao') return t('unsigned');
  return value;
}

function translateServerMessage(message){
  if(state.lang !== 'zh' || !message) return message;
  const exact = {
    'Dados atualizados com sucesso.': '数据更新成功。',
    'Senha incorreta. Os dados não foram alterados.': '密码错误，数据未被修改。',
    'Selecione a planilha .xlsx antes de atualizar.': '更新前请选择 .xlsx 文件。',
    'Formato inválido. Envie um arquivo .xlsx.': '文件格式无效，请上传 .xlsx 文件。'
  };
  if(exact[message]) return exact[message];
  if(message.startsWith('Não foi possível atualizar:')) return `无法更新：${message.replace('Não foi possível atualizar:','').trim()}`;
  if(message.startsWith('Não foi possível salvar as alterações:')) return `无法保存更改：${message.replace('Não foi possível salvar as alterações:','').trim()}`;
  if(message === 'Nenhuma alteração para salvar.') return '没有需要保存的更改。';
  if(message === 'Muitas alterações de uma vez. Salve em blocos menores.') return '一次更改过多，请分批保存。';
  if(message.startsWith('Arquivo maior que o limite de')) return message.replace('Arquivo maior que o limite de','文件大小超过限制').replace('MB.','MB。');
  if(message.startsWith('Coluna obrigatória não encontrada:')) return `未找到必填列：${message.split(':').slice(1).join(':').trim()}`;
  if(message.includes("A planilha precisa conter uma aba chamada 'detalhes'.")) return "表格必须包含名为 'detalhes' 的工作表。";
  if(message.includes("A aba 'detalhes' não possui registros válidos.")) return "'detalhes' 工作表中没有有效记录。";
  return message;
}

async function loadData(showToast=false){
  try{
    const res = await fetch('/api/data', {cache:'no-store'});
    const payload = await res.json();
    if(!res.ok) throw new Error(payload.error || t('loadError'));
    state.all = payload.rows || [];
    state.meta = payload.meta || {};
    populateFilters(true);
    applyFilters();
    updateSourceInfo();
    if(showToast) toast(t('dataReloaded'));
  }catch(err){
    console.error(err);
    $('lastUpdate').textContent = t('loadingFailed');
    toast(translateServerMessage(err.message) || t('loadError'), true);
  }
}

function populateSelect(el, values, keepValue='', formatter=(v)=>v){
  const first = el.options[0]?.outerHTML || `<option value="">${t('allMasculine')}</option>`;
  el.innerHTML = first + values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(formatter(v))}</option>`).join('');
  if(values.includes(keepValue)) el.value = keepValue;
}

function populateFilters(initial=false){
  const current = initial ? state.filters : {
    regional:$('filterRegional').value, rm:$('filterRM').value, base:$('filterBase').value,
    status:$('filterStatus').value, assinado:$('filterAssinado').value, time:$('filterTime').value,
    from:$('filterDateFrom').value, to:$('filterDateTo').value
  };
  populateSelect($('filterRegional'), uniqueSorted(state.all.map(r=>r.regional)), current.regional);
  populateSelect($('filterRM'), uniqueSorted(state.all.map(r=>r.rm)), current.rm);
  populateSelect($('filterBase'), uniqueSorted(state.all.map(r=>r.base)), current.base);
  populateSelect($('filterStatus'), uniqueSorted(state.all.map(r=>r.statusCurto)), current.status, translateStatus);
  if(initial){
    $('filterDateFrom').min = state.meta.dateMin || '';
    $('filterDateFrom').max = state.meta.dateMax || '';
    $('filterDateTo').min = state.meta.dateMin || '';
    $('filterDateTo').max = state.meta.dateMax || '';
    state.filters = current;
  }
}

function rowDate(r){ return r.registro ? r.registro.slice(0,10) : ''; }
function matchTimeFilter(r, filter){
  if(!filter) return true;
  const h=r.tempoAssinaturaHoras;
  if(filter==='sem') return !Number.isFinite(h);
  if(!Number.isFinite(h)) return false;
  if(filter==='0-6') return h < 6;
  if(filter==='6-12') return h >= 6 && h < 12;
  if(filter==='12-24') return h >= 12 && h < 24;
  if(filter==='24-48') return h >= 24 && h < 48;
  if(filter==='48+') return h >= 48;
  return true;
}
function applyFilters(){
  state.filters = {
    regional:$('filterRegional').value, rm:$('filterRM').value, base:$('filterBase').value,
    status:$('filterStatus').value, assinado:$('filterAssinado').value, time:$('filterTime').value,
    from:$('filterDateFrom').value, to:$('filterDateTo').value
  };
  const f = state.filters;
  state.filtered = state.all.filter(r =>
    (!f.regional || r.regional===f.regional) &&
    (!f.rm || r.rm===f.rm) &&
    (!f.base || r.base===f.base) &&
    (!f.status || r.statusCurto===f.status) &&
    (!f.assinado || r.assinado===f.assinado) &&
    matchTimeFilter(r, f.time) &&
    (!f.from || rowDate(r) >= f.from) &&
    (!f.to || rowDate(r) <= f.to)
  );
  renderAll();
}

function renderAll(){
  renderKPIs(); renderInsights(); renderFilterNote(); renderRanking();
}

function renderKPIs(){
  const rows = state.filtered;
  const signedRows = rows.filter(r=>normalizePlain(r.assinado)==='sim');
  const uniqueDelivered = new Set(signedRows.map(r=>r.remessa).filter(Boolean)).size;
  const open = rows.filter(r=>r.aberto).length;
  $('kpi1bd').textContent = formatNumber(rows.length);
  $('kpiDelivered').textContent = formatNumber(uniqueDelivered);
  $('kpiOpen').textContent = formatNumber(open);
  $('kpi1bdFoot').textContent = t('uniqueShipmentsFilter',{count:formatNumber(new Set(rows.map(r=>r.remessa).filter(Boolean)).size)});
  $('kpiDeliveredFoot').textContent = t('signedRecords',{count:formatNumber(signedRows.length)});
  $('kpiOpenFoot').textContent = rows.length ? t('openShare',{percent:pct(open/rows.length*100)}) : t('noTicketsFilter');
}

function renderInsights(){
  const rows=state.filtered;
  const signed=rows.filter(r=>normalizePlain(r.assinado)==='sim');
  const validTimes=signed.map(r=>r.tempoAssinaturaHoras).filter(Number.isFinite);
  const avg=validTimes.length ? validTimes.reduce((a,b)=>a+b,0)/validTimes.length : NaN;
  $('insightSignedRate').textContent = rows.length ? pct(signed.length/rows.length*100) : pct(0);
  $('insightAvgTime').textContent = hours(avg);
  $('insightBases').textContent = formatNumber(new Set(rows.map(r=>r.base)).size);
  $('insightRMs').textContent = formatNumber(new Set(rows.map(r=>r.rm)).size);
}

function renderFilterNote(){
  const labels=[]; const f=state.filters;
  if(f.regional) labels.push(t('filterRegional',{value:f.regional}));
  if(f.rm) labels.push(t('filterRM',{value:f.rm}));
  if(f.base) labels.push(t('filterBase',{value:f.base}));
  if(f.status) labels.push(t('filterStatus',{value:translateStatus(f.status)}));
  if(f.assinado) labels.push(t('filterSignature',{value:translateSignatureValue(f.assinado)}));
  if(f.time) labels.push(t('filterTime',{value:$('filterTime').selectedOptions[0]?.textContent || f.time}));
  if(f.from) labels.push(t('filterFrom',{value:dateOnlyBR(f.from)}));
  if(f.to) labels.push(t('filterTo',{value:dateOnlyBR(f.to)}));
  $('activeFilterNote').textContent = labels.length
    ? `${t('filteredRecords',{count:formatNumber(state.filtered.length)})} • ${labels.join(' • ')}`
    : t('showingAllRecords',{count:formatNumber(state.filtered.length)});
}

function groupBy(rows,key){
  const m=new Map(); rows.forEach(r=>{const k=r[key]||t('noInfo'); if(!m.has(k)) m.set(k,[]); m.get(k).push(r)}); return m;
}
function buildRanking(){
  const groups=groupBy(state.filtered,'rm');
  return [...groups].map(([rm,rs])=>{
    const signed=rs.filter(r=>normalizePlain(r.assinado)==='sim');
    const valid=signed.map(r=>r.tempoAssinaturaHoras).filter(Number.isFinite);
    return {
      rm,
      regional:mode(rs.map(r=>r.regional)),
      bases:new Set(rs.map(r=>r.base).filter(Boolean)).size,
      total:rs.length,
      signed:signed.length,
      unsigned:rs.length-signed.length,
      rate:rs.length?signed.length/rs.length*100:0,
      open:rs.filter(r=>r.aberto).length,
      avg:valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:NaN
    };
  }).sort((a,b)=>b.total-a.total || a.rm.localeCompare(b.rm,locale()));
}
function mode(values){ const c=new Map();values.forEach(v=>c.set(v,(c.get(v)||0)+1));return [...c].sort((a,b)=>b[1]-a[1])[0]?.[0]||'—'; }
function rateClass(v){return v>=80?'high':v>=50?'mid':'low'}
function renderRanking(){
  state.ranking=buildRanking();
  const q=normalize($('tableSearch').value);
  const rows=q?state.ranking.filter(r=>normalize(`${r.rm} ${r.regional}`).includes(q)):state.ranking;
  $('rankingBody').innerHTML=rows.map((r,i)=>`<tr><td><span class="rank-badge">${i+1}</span></td><td><strong>${escapeHtml(r.rm)}</strong></td><td>${escapeHtml(r.regional)}</td><td>${formatNumber(r.bases)}</td><td><strong>${formatNumber(r.total)}</strong></td><td>${formatNumber(r.signed)}</td><td>${formatNumber(r.unsigned)}</td><td><span class="rate ${rateClass(r.rate)}">${pct(r.rate)}</span></td><td>${formatNumber(r.open)}</td><td class="muted-cell">${hours(r.avg)}</td></tr>`).join('') || `<tr><td colspan="10" style="text-align:center;padding:28px;color:#858a94">${t('noRecordsFound')}</td></tr>`;
  $('tableFooter').textContent=t('tableFooter',{count:formatNumber(rows.length)});
}

function exportCSV(){
  const rows=[[t('csvPosition'),'RM',t('regional'),t('baseCount'),'1BD',t('signedPlural'),t('csvNotSigned'),t('csvSignatureRate'),t('csvOpen'),t('csvAvgHours')]];
  state.ranking.forEach((r,i)=>rows.push([i+1,r.rm,r.regional,r.bases,r.total,r.signed,r.unsigned,r.rate.toFixed(2),r.open,Number.isFinite(r.avg)?r.avg.toFixed(2):'']));
  const csv='\ufeff'+rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(';')).join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=`ranking_rm_1bd_${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);a.remove();
}

function updateSourceInfo(){
  const m=state.meta;
  $('lastUpdate').textContent = t('lastUpdateValue',{value:dateBR(m.updatedAt)});
  $('sourceFile').textContent = m.source || '1B_GERAL.xlsx';
  $('sourceRows').textContent = formatNumber(m.totalRows || 0);
  $('sourceRange').textContent = m.dateMin && m.dateMax ? `${dateOnlyBR(m.dateMin)} ${state.lang==='zh'?'至':'a'} ${dateOnlyBR(m.dateMax)}` : '—';
  $('sourceUpdated').textContent = dateBR(m.updatedAt);
}

function escapeHtml(str){return String(str??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
function toast(message,error=false){const el=$('toast');el.textContent=message;el.style.background=error?'#b20e22':'#111318';el.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}


function editorKey(row,col){ return `${row}:${col}`; }
function updateEditorDirtyUI(){
  const badge=$('editorDirtyBadge'); const save=$('editorSave');
  if(!badge || !save) return;
  const count=state.editor.pending.size;
  badge.textContent=count ? t('pendingChanges',{count:formatNumber(count)}) : t('noPendingChanges');
  badge.classList.toggle('dirty',count>0);
  save.disabled=count===0;
}
function updateEditorPageMeta(){
  if(!$('editorPageInfo')) return;
  $('editorPageInfo').textContent=t('pageInfo',{page:state.editor.page,pages:state.editor.pages});
  $('editorTotal').textContent=t('totalRowsEditor',{count:formatNumber(state.editor.total)});
  $('editorPrev').disabled=state.editor.page<=1;
  $('editorNext').disabled=state.editor.page>=state.editor.pages;
}
function renderEditor(){
  const head=$('editorHeadRow'), body=$('editorBody');
  if(!head || !body) return;
  head.innerHTML=`<tr><th class="editor-row-number">#</th>${state.editor.headers.map(h=>`<th>${escapeHtml(h).replaceAll('\n','<br>')}</th>`).join('')}</tr>`;
  if(!state.editor.rows.length){
    body.innerHTML=`<tr><td class="editor-empty" colspan="${state.editor.headers.length+1}">${t('editorNoRows')}</td></tr>`;
    updateEditorPageMeta(); updateEditorDirtyUI(); return;
  }
  body.innerHTML=state.editor.rows.map(row=>{
    const cells=row.values.map((raw,i)=>{
      const col=i+1, key=editorKey(row.row,col), has=state.editor.pending.has(key);
      const value=has ? state.editor.pending.get(key).value : raw;
      return `<td class="${has?'editor-cell-changed':''}"><input class="editor-cell" data-row="${row.row}" data-col="${col}" value="${escapeHtml(value)}" title="${escapeHtml(value)}" /></td>`;
    }).join('');
    return `<tr><th class="editor-row-number">${row.row}</th>${cells}</tr>`;
  }).join('');
  body.querySelectorAll('.editor-cell').forEach(input=>input.addEventListener('input',()=>{
    const row=Number(input.dataset.row), col=Number(input.dataset.col), key=editorKey(row,col);
    const source=state.editor.rows.find(r=>r.row===row)?.values?.[col-1] ?? '';
    if(input.value===String(source??'')) state.editor.pending.delete(key);
    else state.editor.pending.set(key,{row,col,value:input.value});
    input.closest('td').classList.toggle('editor-cell-changed',state.editor.pending.has(key));
    updateEditorDirtyUI();
  }));
  updateEditorPageMeta(); updateEditorDirtyUI();
}
async function loadEditor(page=state.editor.page){
  const body=$('editorBody');
  if(body) body.innerHTML=`<tr><td class="editor-empty">${t('loadingSpreadsheet')}</td></tr>`;
  const params=new URLSearchParams({page:String(page),per_page:String(state.editor.perPage),q:state.editor.query});
  try{
    const res=await fetch(`/api/editor?${params.toString()}`,{cache:'no-store'}); const data=await res.json();
    if(!res.ok) throw new Error(data.error||t('editorLoadError'));
    state.editor.headers=data.headers||[]; state.editor.rows=data.rows||[];
    state.editor.page=data.pagination?.page||1; state.editor.pages=data.pagination?.pages||1; state.editor.total=data.pagination?.total||0; state.editor.loaded=true;
    renderEditor();
  }catch(err){
    console.error(err); if(body) body.innerHTML=`<tr><td class="editor-empty">${escapeHtml(translateServerMessage(err.message)||t('editorLoadError'))}</td></tr>`; toast(translateServerMessage(err.message)||t('editorLoadError'),true);
  }
}
async function saveEditorChanges(){
  const msg=$('editorMessage'), password=$('editorPassword').value;
  if(!state.editor.pending.size){showFormMessage(msg,t('editorNothingToSave'),true);return;}
  if(!password){showFormMessage(msg,t('editorPasswordRequired'),true);return;}
  const btn=$('editorSave'); btn.disabled=true; setButtonLabel(btn,'savingChanges'); btn.classList.add('loading');
  try{
    const res=await fetch('/api/editor/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password,changes:[...state.editor.pending.values()]})});
    const data=await res.json(); if(!res.ok) throw new Error(data.error||t('editorSaveError'));
    const count=data.saved||state.editor.pending.size; state.editor.pending.clear(); $('editorPassword').value='';
    showFormMessage(msg,t('editorSaveSuccess',{count:formatNumber(count)}),false); updateEditorDirtyUI();
    await Promise.all([loadData(),loadEditor(state.editor.page)]); toast(t('editorSaveSuccess',{count:formatNumber(count)}));
  }catch(err){showFormMessage(msg,translateServerMessage(err.message)||t('editorSaveError'),true);}
  finally{setButtonLabel(btn,'saveChanges');btn.classList.remove('loading');updateEditorDirtyUI();}
}
function bindEditor(){
  if(!$('editorSearch')) return;
  $('editorSearch').addEventListener('input',()=>{clearTimeout(state.editor.searchTimer);state.editor.searchTimer=setTimeout(()=>{state.editor.query=$('editorSearch').value.trim();loadEditor(1);},300);});
  $('editorPerPage').addEventListener('change',()=>{state.editor.perPage=Number($('editorPerPage').value)||50;loadEditor(1);});
  $('editorPrev').addEventListener('click',()=>{if(state.editor.page>1)loadEditor(state.editor.page-1);});
  $('editorNext').addEventListener('click',()=>{if(state.editor.page<state.editor.pages)loadEditor(state.editor.page+1);});
  $('editorReload').addEventListener('click',()=>loadEditor(state.editor.page));
  $('editorDiscard').addEventListener('click',()=>{state.editor.pending.clear();showFormMessage($('editorMessage'),' ',false);$('editorMessage').className='form-message';loadEditor(state.editor.page);});
  $('editorSave').addEventListener('click',saveEditorChanges);
}
function bindTabs(){document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');$(`tab-${btn.dataset.tab}`).classList.add('active');if(btn.dataset.tab==='editor'&&!state.editor.loaded)loadEditor(1);}))}

function openModal(){ $('updateModal').classList.add('show'); $('updateModal').setAttribute('aria-hidden','false'); }
function closeModal(){ $('updateModal').classList.remove('show'); $('updateModal').setAttribute('aria-hidden','true'); }

function refreshSelectedFileLabels(){
  document.querySelectorAll('.drop-zone').forEach(zone=>{
    const input=zone.querySelector('input[type=file]'); const name=zone.querySelector('[data-file-name]');
    if(name) name.textContent = input?.files?.[0]?.name || t('noFileSelected');
  });
}

function setupDropZone(zone){
  const input=zone.querySelector('input[type=file]'); const name=zone.querySelector('[data-file-name]');
  input.addEventListener('change',()=>{name.textContent=input.files[0]?.name||t('noFileSelected')});
  ['dragenter','dragover'].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.add('dragging')}));
  ['dragleave','drop'].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.remove('dragging')}));
  zone.addEventListener('drop',e=>{const files=e.dataTransfer.files;if(files?.length){input.files=files;name.textContent=files[0].name}});
}

function setupUpdateForm(form){
  const msg=form.parentElement.querySelector('[data-form-message]');
  form.addEventListener('submit',async e=>{
    e.preventDefault(); msg.className='form-message';msg.textContent='';
    const file=form.querySelector('input[type=file]').files[0]; const password=form.querySelector('input[type=password]').value;
    if(!file){showFormMessage(msg,t('selectXlsx'),true);return}
    if(!file.name.toLowerCase().endsWith('.xlsx')){showFormMessage(msg,t('sendXlsx'),true);return}
    if(!password){showFormMessage(msg,t('enterPasswordError'),true);return}
    const btn=form.querySelector('button[type=submit]');btn.disabled=true;setButtonLabel(btn,'updating');btn.classList.add('loading');
    const fd=new FormData();fd.append('file',file);fd.append('password',password);
    try{
      const res=await fetch('/api/update',{method:'POST',body:fd});const data=await res.json();if(!res.ok)throw new Error(data.error||t('updateFailed'));
      showFormMessage(msg,translateServerMessage(data.message)||t('updateSuccess'),false);form.reset();form.querySelector('[data-file-name]').textContent=t('noFileSelected');await loadData();toast(t('baseUpdatedToast'));
      if(form.id==='updateFormModal') setTimeout(closeModal,900);
    }catch(err){showFormMessage(msg,translateServerMessage(err.message)||t('updateGenericError'),true)}finally{btn.disabled=false;setButtonLabel(btn,form.id==='updateFormModal'?'applyUpdate':'validateAndUpdate');btn.classList.remove('loading')}
  });
}
function showFormMessage(el,text,error){el.textContent=text;el.className=`form-message show ${error?'error':'success'}`}

function clearFilters(){
  ['filterRegional','filterRM','filterBase','filterStatus','filterAssinado','filterTime','filterDateFrom','filterDateTo'].forEach(id=>$(id).value='');
  applyFilters();
}

function init(){
  const stored = localStorage.getItem('relatorio1bd_lang');
  setLanguage(stored === 'zh' ? 'zh' : 'pt', false);
  bindTabs();
  bindEditor();
  ['filterRegional','filterRM','filterBase','filterStatus','filterAssinado','filterTime','filterDateFrom','filterDateTo'].forEach(id=>$(id).addEventListener('change',applyFilters));
  $('clearFilters').addEventListener('click',clearFilters); $('tableSearch').addEventListener('input',renderRanking); $('exportCsv').addEventListener('click',exportCSV);
  $('languageToggle').addEventListener('click',toggleLanguage);
  $('openUpdateModal').addEventListener('click',openModal); $('closeUpdateModal').addEventListener('click',closeModal); $('updateModal').addEventListener('click',e=>{if(e.target===$('updateModal'))closeModal()}); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  setupDropZone($('dropZonePage')); setupDropZone($('dropZoneModal')); setupUpdateForm($('updateFormPage')); setupUpdateForm($('updateFormModal'));
  loadData();
}

document.addEventListener('DOMContentLoaded',init);
