const state = {
  all: [], filtered: [], meta: {}, charts: {}, ranking: [],
  filters: { regional:'', rm:'', base:'', status:'', assinado:'', time:'', from:'', to:'' }
};

const $ = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('pt-BR');
const pct = (n) => `${(Number.isFinite(n) ? n : 0).toFixed(1).replace('.', ',')}%`;
const hours = (n) => {
  if (!Number.isFinite(n)) return '—';
  if (n < 1) return `${Math.round(n*60)} min`;
  if (n < 24) return `${n.toFixed(1).replace('.', ',')} h`;
  return `${(n/24).toFixed(1).replace('.', ',')} d`;
};
const dateBR = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short', timeStyle:'short'}).format(d);
};
const dateOnlyBR = (ymd) => {
  if (!ymd) return '—';
  const [y,m,d] = ymd.split('-'); return `${d}/${m}/${y}`;
};
const normalize = (s) => (s ?? '').toString().trim().toLowerCase();
const uniqueSorted = (arr) => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));

async function loadData(showToast=false){
  try{
    const res = await fetch('/api/data', {cache:'no-store'});
    const payload = await res.json();
    if(!res.ok) throw new Error(payload.error || 'Erro ao carregar dados');
    state.all = payload.rows || [];
    state.meta = payload.meta || {};
    populateFilters(true);
    applyFilters();
    updateSourceInfo();
    if(showToast) toast('Dados recarregados com sucesso.');
  }catch(err){
    console.error(err);
    $('lastUpdate').textContent = 'Falha ao carregar os dados';
    toast(err.message || 'Erro ao carregar dados', true);
  }
}

function populateSelect(el, values, keepValue=''){
  const first = el.options[0]?.outerHTML || '<option value="">Todos</option>';
  el.innerHTML = first + values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
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
  populateSelect($('filterStatus'), uniqueSorted(state.all.map(r=>r.statusCurto)), current.status);
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
  renderKPIs(); renderInsights(); renderFilterNote(); renderCharts(); renderRanking();
}

function renderKPIs(){
  const rows = state.filtered;
  const signedRows = rows.filter(r=>normalize(r.assinado)==='sim');
  const uniqueDelivered = new Set(signedRows.map(r=>r.remessa).filter(Boolean)).size;
  const open = rows.filter(r=>r.aberto).length;
  $('kpi1bd').textContent = fmt.format(rows.length);
  $('kpiDelivered').textContent = fmt.format(uniqueDelivered);
  $('kpiOpen').textContent = fmt.format(open);
  $('kpi1bdFoot').textContent = `${fmt.format(new Set(rows.map(r=>r.remessa).filter(Boolean)).size)} remessas únicas no filtro`;
  $('kpiDeliveredFoot').textContent = `${fmt.format(signedRows.length)} registros marcados como assinados`;
  $('kpiOpenFoot').textContent = rows.length ? `${pct(open/rows.length*100)} dos chamados filtrados` : 'sem chamados no filtro';
}

function renderInsights(){
  const rows=state.filtered;
  const signed=rows.filter(r=>normalize(r.assinado)==='sim');
  const validTimes=signed.map(r=>r.tempoAssinaturaHoras).filter(Number.isFinite);
  const avg=validTimes.length ? validTimes.reduce((a,b)=>a+b,0)/validTimes.length : NaN;
  $('insightSignedRate').textContent = rows.length ? pct(signed.length/rows.length*100) : '0,0%';
  $('insightAvgTime').textContent = hours(avg);
  $('insightBases').textContent = fmt.format(new Set(rows.map(r=>r.base)).size);
  $('insightRMs').textContent = fmt.format(new Set(rows.map(r=>r.rm)).size);
}

function renderFilterNote(){
  const labels=[]; const f=state.filters;
  if(f.regional) labels.push(`Regional: ${f.regional}`); if(f.rm) labels.push(`RM: ${f.rm}`);
  if(f.base) labels.push(`Base: ${f.base}`); if(f.status) labels.push(`Status: ${f.status}`);
  if(f.assinado) labels.push(`Assinatura: ${f.assinado}`); if(f.time) labels.push(`Tempo: ${$('filterTime').selectedOptions[0]?.textContent || f.time}`); if(f.from) labels.push(`Desde ${dateOnlyBR(f.from)}`); if(f.to) labels.push(`Até ${dateOnlyBR(f.to)}`);
  $('activeFilterNote').textContent = labels.length ? `${fmt.format(state.filtered.length)} registros • ${labels.join(' • ')}` : `Exibindo toda a base • ${fmt.format(state.filtered.length)} registros`;
}

function groupBy(rows,key){
  const m=new Map(); rows.forEach(r=>{const k=r[key]||'Sem informação'; if(!m.has(k)) m.set(k,[]); m.get(k).push(r)}); return m;
}
function destroyChart(name){ if(state.charts[name]){state.charts[name].destroy(); delete state.charts[name];} }
function commonTooltip(){ return {backgroundColor:'#111318',padding:11,titleFont:{weight:'700'},bodyFont:{size:12},displayColors:true}; }

function renderCharts(){
  const rows=state.filtered;
  renderRMChart(rows); renderStatusChart(rows); renderBaseChart(rows); renderTimeChart(rows); renderTrendChart(rows);
}

function renderRMChart(rows){
  destroyChart('rm');
  const g=groupBy(rows,'rm');
  const items=[...g].map(([name,rs])=>({name,total:rs.length,signed:rs.filter(r=>normalize(r.assinado)==='sim').length})).sort((a,b)=>(b.signed/b.total)-(a.signed/a.total));
  const ctx=$('rmChart');
  state.charts.rm=new Chart(ctx,{type:'bar',data:{labels:items.map(x=>x.name),datasets:[{label:'Taxa de assinatura',data:items.map(x=>x.total?x.signed/x.total*100:0),backgroundColor:'#e60012',borderRadius:7,borderSkipped:false,barThickness:18}]},options:{indexAxis:'y',maintainAspectRatio:false,responsive:true,plugins:{legend:{display:false},tooltip:{...commonTooltip(),callbacks:{label:c=>`${pct(c.raw)} • ${items[c.dataIndex].signed}/${items[c.dataIndex].total} assinados`}}},scales:{x:{beginAtZero:true,max:100,grid:{color:'#f0f1f4'},ticks:{callback:v=>`${v}%`}},y:{grid:{display:false},ticks:{font:{size:11}}}},onClick:(_,els)=>{if(els.length){$('filterRM').value=items[els[0].index].name;applyFilters();}}}});
}

function renderStatusChart(rows){
  destroyChart('status');
  const counts=[...groupBy(rows,'statusCurto')].map(([name,rs])=>({name,value:rs.length})).sort((a,b)=>b.value-a.value);
  const colors=['#111318','#e60012','#25f4ee','#fe2c55','#8f95a3','#d4d7dd'];
  state.charts.status=new Chart($('statusChart'),{type:'doughnut',data:{labels:counts.map(x=>x.name),datasets:[{data:counts.map(x=>x.value),backgroundColor:colors.slice(0,counts.length),borderWidth:0,hoverOffset:4}]},options:{maintainAspectRatio:false,cutout:'70%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,pointStyle:'circle',boxWidth:7,font:{size:10},padding:14}},tooltip:{...commonTooltip(),callbacks:{label:c=>`${c.label}: ${fmt.format(c.raw)} (${rows.length?pct(c.raw/rows.length*100):'0,0%'})`}}},onClick:(_,els)=>{if(els.length){$('filterStatus').value=counts[els[0].index].name;applyFilters();}}}});
}

function renderBaseChart(rows){
  destroyChart('base');
  const items=[...groupBy(rows,'base')].map(([name,rs])=>({name,value:rs.length})).sort((a,b)=>b.value-a.value).slice(0,10);
  state.charts.base=new Chart($('baseChart'),{type:'bar',data:{labels:items.map(x=>x.name),datasets:[{label:'1BD',data:items.map(x=>x.value),backgroundColor:'#111318',borderRadius:7,borderSkipped:false,barThickness:18}]},options:{indexAxis:'y',maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:commonTooltip()},scales:{x:{beginAtZero:true,grid:{color:'#f0f1f4'},ticks:{precision:0}},y:{grid:{display:false},ticks:{font:{size:10}}}},onClick:(_,els)=>{if(els.length){$('filterBase').value=items[els[0].index].name;applyFilters();}}}});
}

function renderTimeChart(rows){
  destroyChart('time');
  const signed=rows.filter(r=>normalize(r.assinado)==='sim' && Number.isFinite(r.tempoAssinaturaHoras));
  const buckets=[{label:'Até 6h',min:0,max:6},{label:'6–12h',min:6,max:12},{label:'12–24h',min:12,max:24},{label:'24–48h',min:24,max:48},{label:'Acima de 48h',min:48,max:Infinity}];
  const values=buckets.map(b=>signed.filter(r=>r.tempoAssinaturaHoras>=b.min && r.tempoAssinaturaHoras<b.max).length);
  state.charts.time=new Chart($('timeChart'),{type:'bar',data:{labels:buckets.map(b=>b.label),datasets:[{label:'Assinaturas',data:values,backgroundColor:['#25f4ee','#58ddd9','#111318','#fe2c55','#e60012'],borderRadius:7,borderSkipped:false}]},options:{maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:commonTooltip()},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:'#f0f1f4'},ticks:{precision:0}}}}});
}

function renderTrendChart(rows){
  destroyChart('trend');
  const m=new Map();
  rows.forEach(r=>{const d=rowDate(r); if(!d)return; if(!m.has(d))m.set(d,{total:0,signed:0}); const o=m.get(d);o.total++;if(normalize(r.assinado)==='sim')o.signed++;});
  const dates=[...m.keys()].sort();
  const labels=dates.map(d=>dateOnlyBR(d));
  state.charts.trend=new Chart($('trendChart'),{type:'line',data:{labels,datasets:[{label:'1BD',data:dates.map(d=>m.get(d).total),borderColor:'#111318',backgroundColor:'rgba(17,19,24,.06)',fill:true,tension:.3,pointRadius:3,pointHoverRadius:5},{label:'Assinados',data:dates.map(d=>m.get(d).signed),borderColor:'#e60012',backgroundColor:'rgba(230,0,18,.06)',fill:true,tension:.3,pointRadius:3,pointHoverRadius:5}]},options:{maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top',align:'end',labels:{usePointStyle:true,boxWidth:7}},tooltip:commonTooltip()},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:'#f0f1f4'},ticks:{precision:0}}}}});
}

function buildRanking(){
  const groups=groupBy(state.filtered,'base');
  return [...groups].map(([base,rs])=>{
    const signed=rs.filter(r=>normalize(r.assinado)==='sim');
    const valid=signed.map(r=>r.tempoAssinaturaHoras).filter(Number.isFinite);
    return {base,regional:mode(rs.map(r=>r.regional)),rm:mode(rs.map(r=>r.rm)),total:rs.length,signed:signed.length,unsigned:rs.length-signed.length,rate:rs.length?signed.length/rs.length*100:0,open:rs.filter(r=>r.aberto).length,avg:valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:NaN};
  }).sort((a,b)=>b.total-a.total || a.base.localeCompare(b.base,'pt-BR'));
}
function mode(values){ const c=new Map();values.forEach(v=>c.set(v,(c.get(v)||0)+1));return [...c].sort((a,b)=>b[1]-a[1])[0]?.[0]||'—'; }
function rateClass(v){return v>=80?'high':v>=50?'mid':'low'}
function renderRanking(){
  state.ranking=buildRanking();
  const q=normalize($('tableSearch').value);
  const rows=q?state.ranking.filter(r=>normalize(`${r.base} ${r.rm} ${r.regional}`).includes(q)):state.ranking;
  $('rankingBody').innerHTML=rows.map((r,i)=>`<tr><td><span class="rank-badge">${i+1}</span></td><td><strong>${escapeHtml(r.base)}</strong></td><td>${escapeHtml(r.regional)}</td><td>${escapeHtml(r.rm)}</td><td><strong>${fmt.format(r.total)}</strong></td><td>${fmt.format(r.signed)}</td><td>${fmt.format(r.unsigned)}</td><td><span class="rate ${rateClass(r.rate)}">${pct(r.rate)}</span></td><td>${fmt.format(r.open)}</td><td class="muted-cell">${hours(r.avg)}</td></tr>`).join('') || '<tr><td colspan="10" style="text-align:center;padding:28px;color:#858a94">Nenhum registro encontrado.</td></tr>';
  $('tableFooter').textContent=`${fmt.format(rows.length)} bases exibidas • ranking por quantidade de 1BD`;
}

function exportCSV(){
  const rows=[['Posição','Base','Regional','RM','1BD','Assinados','Não assinados','Taxa de assinatura','Em aberto','Tempo médio (h)']];
  state.ranking.forEach((r,i)=>rows.push([i+1,r.base,r.regional,r.rm,r.total,r.signed,r.unsigned,r.rate.toFixed(2),r.open,Number.isFinite(r.avg)?r.avg.toFixed(2):'']));
  const csv='\ufeff'+rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(';')).join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=`ranking_1bd_${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(a);a.click();a.remove();
}

function updateSourceInfo(){
  const m=state.meta;
  $('lastUpdate').textContent = `Última atualização: ${dateBR(m.updatedAt)}`;
  $('sourceFile').textContent = m.source || '1B_GERAL.xlsx';
  $('sourceRows').textContent = fmt.format(m.totalRows || 0);
  $('sourceRange').textContent = m.dateMin && m.dateMax ? `${dateOnlyBR(m.dateMin)} a ${dateOnlyBR(m.dateMax)}` : '—';
  $('sourceUpdated').textContent = dateBR(m.updatedAt);
}

function escapeHtml(str){return String(str??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}
function toast(message,error=false){const el=$('toast');el.textContent=message;el.style.background=error?'#b20e22':'#111318';el.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}

function bindTabs(){document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');$(`tab-${btn.dataset.tab}`).classList.add('active');}))}
function openModal(){ $('updateModal').classList.add('show'); $('updateModal').setAttribute('aria-hidden','false'); }
function closeModal(){ $('updateModal').classList.remove('show'); $('updateModal').setAttribute('aria-hidden','true'); }

function setupDropZone(zone){
  const input=zone.querySelector('input[type=file]'); const name=zone.querySelector('[data-file-name]');
  input.addEventListener('change',()=>{name.textContent=input.files[0]?.name||'Nenhum arquivo selecionado'});
  ['dragenter','dragover'].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.add('dragging')}));
  ['dragleave','drop'].forEach(evt=>zone.addEventListener(evt,e=>{e.preventDefault();zone.classList.remove('dragging')}));
  zone.addEventListener('drop',e=>{const files=e.dataTransfer.files;if(files?.length){input.files=files;name.textContent=files[0].name}});
}

function setupUpdateForm(form){
  const msg=form.parentElement.querySelector('[data-form-message]');
  form.addEventListener('submit',async e=>{
    e.preventDefault(); msg.className='form-message';msg.textContent='';
    const file=form.querySelector('input[type=file]').files[0]; const password=form.querySelector('input[type=password]').value;
    if(!file){showFormMessage(msg,'Selecione a planilha .xlsx.',true);return}
    if(!file.name.toLowerCase().endsWith('.xlsx')){showFormMessage(msg,'Envie um arquivo .xlsx.',true);return}
    if(!password){showFormMessage(msg,'Digite a senha para aplicar a atualização.',true);return}
    const btn=form.querySelector('button[type=submit]');const original=btn.textContent;btn.disabled=true;btn.textContent='Atualizando...';btn.classList.add('loading');
    const fd=new FormData();fd.append('file',file);fd.append('password',password);
    try{
      const res=await fetch('/api/update',{method:'POST',body:fd});const data=await res.json();if(!res.ok)throw new Error(data.error||'Falha na atualização');
      showFormMessage(msg,data.message||'Dados atualizados com sucesso.',false);form.reset();form.querySelector('[data-file-name]').textContent='Nenhum arquivo selecionado';await loadData();toast('Base 1BD atualizada com sucesso.');
      if(form.id==='updateFormModal') setTimeout(closeModal,900);
    }catch(err){showFormMessage(msg,err.message||'Erro ao atualizar dados.',true)}finally{btn.disabled=false;btn.textContent=original;btn.classList.remove('loading')}
  });
}
function showFormMessage(el,text,error){el.textContent=text;el.className=`form-message show ${error?'error':'success'}`}

function clearFilters(){
  ['filterRegional','filterRM','filterBase','filterStatus','filterAssinado','filterTime','filterDateFrom','filterDateTo'].forEach(id=>$(id).value='');
  applyFilters();
}

function init(){
  bindTabs();
  ['filterRegional','filterRM','filterBase','filterStatus','filterAssinado','filterTime','filterDateFrom','filterDateTo'].forEach(id=>$(id).addEventListener('change',applyFilters));
  $('clearFilters').addEventListener('click',clearFilters); $('tableSearch').addEventListener('input',renderRanking); $('exportCsv').addEventListener('click',exportCSV);
  $('openUpdateModal').addEventListener('click',openModal); $('closeUpdateModal').addEventListener('click',closeModal); $('updateModal').addEventListener('click',e=>{if(e.target===$('updateModal'))closeModal()}); document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  setupDropZone($('dropZonePage')); setupDropZone($('dropZoneModal')); setupUpdateForm($('updateFormPage')); setupUpdateForm($('updateFormModal'));
  loadData();
}

document.addEventListener('DOMContentLoaded',init);
