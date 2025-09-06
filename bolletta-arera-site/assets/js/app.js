// Basic data (demo)
const data = {
  pun: {
    current: 0.09495,
    previous: 0.11112,
    monthly: [
      { m:'Set 24', v:0.117 },{ m:'Ott 24', v:0.112 },{ m:'Nov 24', v:0.125 },{ m:'Dic 24', v:0.135 },
      { m:'Gen 25', v:0.142 },{ m:'Feb 25', v:0.128 },{ m:'Mar 25', v:0.115 },{ m:'Apr 25', v:0.108 },
      { m:'Mag 25', v:0.112 },{ m:'Giu 25', v:0.118 },{ m:'Lug 25', v:0.126 },{ m:'Ago 25', v:0.119 },{ m:'Set 25', v:0.1065 }
    ]
  }
};

// On load
window.addEventListener('DOMContentLoaded', () => {
  updatePUN();
  setInterval(updatePUN, 60000);
  initCharts();
  initSimulator();
  initGlossary();
  initOpenData();
});

function updatePUN() {
  const variation = (Math.random()-0.5) * 0.002;
  const cur = +(data.pun.current + variation).toFixed(5);
  const change = ((cur - data.pun.previous)/data.pun.previous*100).toFixed(2);
  document.getElementById('punValue').textContent = cur.toFixed(5);
  const chEl = document.getElementById('punChange');
  chEl.textContent = `${change>0?'+':''}${change}%`;
  chEl.style.background = change>0 ? 'rgba(220,53,69,.2)' : 'rgba(0,166,81,.2)';
  document.getElementById('updateTime').textContent = new Date().toLocaleTimeString('it-IT');
  // Component demo values already in HTML
}

// Charts
function initCharts(){
  const ctx1 = document.getElementById('punChart');
  if (ctx1) {
    new Chart(ctx1.getContext('2d'), {
      type: 'line',
      data: {
        labels: data.pun.monthly.map(d=>d.m),
        datasets: [{
          label:'PUN Index GME (€/kWh)',
          data: data.pun.monthly.map(d=>d.v),
          borderColor:'#004c93', backgroundColor:'rgba(0,76,147,0.12)',
          borderWidth:3, tension:.35, fill:true,
          pointRadius:4, pointHoverRadius:6, pointBackgroundColor:'#0072ce'
        }]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:true}, tooltip:{callbacks:{label:(c)=>` ${c.parsed.y.toFixed(3)} €/kWh`}}},
        scales:{ x:{title:{display:true,text:'Mese'}, grid:{display:false}}, y:{title:{display:true,text:'€/kWh'}, grid:{color:'rgba(0,0,0,0.08)'}, ticks:{callback:v=>v.toFixed? v.toFixed(2):v}}}
      }
    });
  }
  const ctx2 = document.getElementById('billChart');
  if (ctx2) {
    new Chart(ctx2.getContext('2d'), {
      type:'doughnut',
      data:{ labels:['Materia Energia','Trasporto','Oneri Sistema','Imposte'], datasets:[{data:[45,20,20,15], backgroundColor:['#004c93','#0072ce','#00a651','#ffc107']}]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
  }
  const ctx3 = document.getElementById('fasceChart');
  if (ctx3) {
    new Chart(ctx3.getContext('2d'), {
      type:'bar',
      data:{ labels:['F1 (Peak)','F2 (Intermedia)','F3 (Off-Peak)'], datasets:[{label:'Prezzo medio (€/kWh)', data:[0.18,0.16,0.14], backgroundColor:['#dc3545','#ffc107','#28a745']}]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}, tooltip:{callbacks:{label:(c)=>` ${c.raw.toFixed(3)} €/kWh`}}}, scales:{y:{title:{display:true,text:'€/kWh'}}}}
    });
  }
}

// Simulator
function initSimulator(){
  document.getElementById('btnCalc').addEventListener('click', ()=>{
    const consumo = +document.getElementById('sConsumo').value || 0;
    const potenza = +document.getElementById('sPotenza').value || 0;
    const tipo = document.getElementById('sTipo').value;
    const energia  = consumo * 0.16053;
    const pcv      = 41.32/12;
    const trasporto= (23.20/12) + (21.22*potenza/12) + (consumo*0.00787);
    const oneri    = consumo * (0.029677 + 0.001645);
    const accisa   = consumo * 0.0227; // semplificato
    const imponibile = energia + pcv + trasporto + oneri + accisa;
    const iva = imponibile * 0.10;
    const totale = imponibile + iva;
    const out = document.getElementById('sOut');
    out.style.display='block';
    out.innerHTML = [`Materia energia: € ${energia.toFixed(2)}`,`PCV: € ${pcv.toFixed(2)}`,`Trasporto: € ${trasporto.toFixed(2)}`,`Oneri: € ${oneri.toFixed(2)}`,`Accisa: € ${accisa.toFixed(2)}`,`IVA (10%): € ${iva.toFixed(2)}`,`<strong>Totale: € ${totale.toFixed(2)}</strong>`].map(x=>`<div class="row space-between"><span>${x.split(':')[0]}:</span><span>${x.split(': ')[1]||''}</span></div>`).join('');
  });
}

// Glossary (50+ items, shortened here for size)
const glossary = [
  {t:"PUN",d:"Prezzo Unico Nazionale: media ponderata dei prezzi zonali del MGP."},
  {t:"PE",d:"Prezzo Energia: costo all’ingrosso dell’energia (€/kWh)."},
  {t:"PCV",d:"Prezzo Commercializzazione Vendita: quota fissa annua."},
  {t:"PD",d:"Dispacciamento: equilibrio tra energia immessa e prelevata."},
  {t:"PPE",d:"Perequazione Energia: conguagli del sistema tutela."},
  {t:"ASOS",d:"Oneri per rinnovabili e cogenerazione."},
  {t:"ARIM",d:"Rimanenti oneri generali (ex nucleare, bonus, ecc.)."},
  {t:"τ1",d:"Quota fissa rete (€/POD/anno)."},
  {t:"τ2",d:"Quota per kW impegnato (€/kW/anno)."},
  {t:"τ3",d:"Quota per kWh trasportato (€/kWh)."},
  {t:"F1/F2/F3",d:"Fasce orarie: peak/intermedia/off‑peak."},
  {t:"F23",d:"Fascia domestici: accorpamento F2+F3."},
  {t:"POD",d:"Codice del punto di prelievo."},
  {t:"DSO",d:"Distributore locale (es. e‑distribuzione)."},
  {t:"TSO",d:"Gestore trasmissione (Terna)."},
  {t:"MGP/MI/MSD",d:"Mercati elettrici (giorno prima, intraday, servizi)."},
  {t:"Sbilanciamento",d:"Differenza tra programmato e misurato."},
  {t:"Open Meter",d:"Contatore elettronico telegestito."},
  {t:"Potenza impegnata",d:"Potenza massima contrattuale (kW)."},
  {t:"Autoconsumo",d:"Consumo dell’energia prodotta in sito."},
  {t:"CER",d:"Comunità Energetiche Rinnovabili."},
  {t:"Rid",d:"Ritiro dedicato (GSE)."},
  {t:"PPA",d:"Contratto di lungo termine per l’energia."},
  {t:"Capacity Market",d:"Remunerazione capacità disponibile."},
  {t:"ETS",d:"Sistema europeo quote CO₂."},
  {t:"Profilo di carico",d:"Andamento orario dei consumi."},
  {t:"Telelettura",d:"Lettura remota dei contatori."},
  {t:"Telegestione",d:"Gestione remota delle forniture."},
  {t:"Cabina primaria/secondaria",d:"Nodi di trasformazione AT‑MT e MT‑BT."},
  {t:"Perdite di rete",d:"Dispersioni su linee e trasformatori."},
  {t:"IVA/Accisa",d:"Imposte in bolletta."}
];
function initGlossary(){
  const grid = document.getElementById('gGrid');
  const input = document.getElementById('gSearch');
  const render = (q='')=>{
    const ql = q.toLowerCase();
    grid.innerHTML = glossary
      .filter(x => x.t.toLowerCase().includes(ql) || x.d.toLowerCase().includes(ql))
      .map(x => `<div class="card"><div><strong>${x.t}</strong></div><div class="muted small">${x.d}</div></div>`)
      .join('');
  };
  input.addEventListener('input', e=>render(e.target.value));
  render();
}

// Open Data robust handling
function initOpenData(){
  document.getElementById('btnAuto').addEventListener('click', autoFetch);
  document.getElementById('fileInput').addEventListener('change', onFileUpload);
  document.getElementById('btnParsePaste').addEventListener('click', onPasteLoad);
}

async function autoFetch(){
  const comm = document.getElementById('odComm').value || 'E';
  const dateStr = document.getElementById('odDate').value;
  const status = (msg)=> document.getElementById('odStatus').textContent = msg;
  const src = document.getElementById('odSource');
  src.innerHTML='';
  try{
    status('Cerco l’ultimo CSV disponibile…');
    let foundUrl = null;
    if (dateStr){
      const d = new Date(dateStr+'T12:00:00');
      foundUrl = buildUrl(d, comm);
      status('Download CSV selezionato…');
      await fetchAndShow(foundUrl);
    } else {
      const ok = await findLatest(comm, 7);
      if (!ok){ status('Nessun file trovato negli ultimi 7 giorni. Usa upload o incolla.'); return; }
      foundUrl = ok.url;
    }
    if (foundUrl){
      await fetchAndShow(foundUrl);
      src.innerHTML = `<a href="${foundUrl}" target="_blank" rel="noopener">🔗 Apri CSV sorgente</a>`;
      status('CSV caricato con successo.');
    }
  } catch (e){
    console.error(e);
    status('Errore nel download/parsing. Suggerimento: prova “Carica CSV locale” o “Incolla CSV”.');
  }
}

function buildUrl(d, comm='E'){
  const y = d.getFullYear(); const m = d.getMonth()+1; const dd = String(d.getDate()).padStart(2,'0'); const mm = String(m).padStart(2,'0');
  const yyyymmdd = `${y}${mm}${dd}`;
  return `https://www.ilportaleofferte.it/portaleOfferte/resources/opendata/csv/parametriML/${y}_${m}/PO_Parametri_Mercato_Libero_${comm}_${yyyymmdd}.csv`;
}

async function findLatest(comm='E', lookback=7){
  for (let i=0;i<lookback;i++){
    const d = new Date(); d.setDate(d.getDate()-i);
    const url = buildUrl(d, comm);
    try{
      const r = await fetch(url, {cache:'no-store', mode:'cors'});
      if (r.ok){
        const txt = await r.clone().text();
        if (txt && txt.length>100) return {date:d, url};
      }
    } catch(_){/* ignore */}
  }
  return null;
}

async function fetchAndShow(url){
  const res = await fetch(url, {cache:'no-store', mode:'cors'});
  if (!res.ok) throw new Error('HTTP '+res.status);
  const csv = await res.text();
  const parsed = Papa.parse(csv, {header:true, skipEmptyLines:true});
  if (parsed.errors && parsed.errors.length>0) console.warn(parsed.errors.slice(0,3));
  renderTable(parsed.data);
}

function onFileUpload(ev){
  const f = ev.target.files?.[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    const parsed = Papa.parse(reader.result, {header:true, skipEmptyLines:true});
    renderTable(parsed.data);
    document.getElementById('odStatus').textContent = 'CSV locale caricato.';
    document.getElementById('odSource').innerHTML = '';
  };
  reader.readAsText(f);
}

function onPasteLoad(){
  const txt = document.getElementById('pasteArea').value.trim();
  if (!txt){ document.getElementById('odStatus').textContent = 'Incolla del testo CSV prima.'; return; }
  const parsed = Papa.parse(txt, {header:true, skipEmptyLines:true});
  renderTable(parsed.data);
  document.getElementById('odStatus').textContent = 'CSV da testo caricato.';
  document.getElementById('odSource').innerHTML = '';
}

function renderTable(rows){
  const wrap = document.getElementById('tableWrap');
  const table = document.getElementById('odTable');
  if (!rows || rows.length===0){ wrap.style.display='none'; table.innerHTML=''; return; }
  const fields = Object.keys(rows[0]||{});
  const thead = `<thead><tr>${fields.map(f=>`<th>${escapeHtml(f)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map(r=>`<tr>${fields.map(f=>`<td>${escapeHtml(r[f]??'')}</td>`).join('')}</tr>`).join('')}</tbody>`;
  table.innerHTML = thead + tbody;
  wrap.style.display='block';
}

function escapeHtml(v){
  return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
}
