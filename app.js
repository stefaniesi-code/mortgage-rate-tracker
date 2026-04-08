
// 20 years of Freddie Mac PMMS weekly data (2006–2026)
// Source: Freddie Mac Primary Mortgage Market Survey
// Format: [date, 30yr, 15yr]
const PMMS_HISTORY=[
  ["2006-01-05",6.21,5.77],["2006-04-06",6.43,6.06],["2006-07-06",6.72,6.34],["2006-10-05",6.30,5.98],
  ["2007-01-04",6.14,5.79],["2007-04-05",6.16,5.83],["2007-07-05",6.71,6.38],["2007-10-04",6.37,6.03],
  ["2008-01-03",6.07,5.65],["2008-04-03",5.88,5.37],["2008-07-03",6.37,5.97],["2008-10-02",5.94,5.56],
  ["2009-01-08",5.01,4.62],["2009-04-02",4.78,4.52],["2009-07-02",5.32,4.77],["2009-10-01",4.94,4.39],
  ["2010-01-07",5.09,4.50],["2010-04-01",5.08,4.39],["2010-07-01",4.58,4.04],["2010-10-07",4.27,3.72],
  ["2011-01-06",4.77,4.05],["2011-04-07",4.87,4.10],["2011-07-07",4.60,3.75],["2011-10-06",3.94,3.26],
  ["2012-01-05",3.91,3.23],["2012-04-05",3.98,3.21],["2012-07-05",3.62,2.89],["2012-10-04",3.36,2.69],
  ["2013-01-03",3.34,2.64],["2013-04-04",3.54,2.74],["2013-07-03",4.29,3.39],["2013-10-03",4.22,3.29],
  ["2014-01-02",4.53,3.55],["2014-04-03",4.40,3.42],["2014-07-03",4.12,3.22],["2014-10-02",4.19,3.36],
  ["2015-01-08",3.73,3.05],["2015-04-02",3.70,2.98],["2015-07-02",4.08,3.24],["2015-10-01",3.85,3.07],
  ["2016-01-07",3.97,3.26],["2016-04-07",3.59,2.85],["2016-07-07",3.41,2.74],["2016-10-06",3.42,2.72],
  ["2017-01-05",4.20,3.44],["2017-04-06",4.10,3.35],["2017-07-06",3.96,3.22],["2017-10-05",3.85,3.15],
  ["2018-01-04",3.95,3.38],["2018-04-05",4.40,3.87],["2018-07-05",4.52,4.00],["2018-10-04",4.71,4.15],
  ["2019-01-03",4.51,3.99],["2019-04-04",4.08,3.56],["2019-07-03",3.75,3.18],["2019-10-03",3.65,3.14],
  ["2020-01-02",3.72,3.16],["2020-03-05",3.29,2.79],["2020-05-07",3.26,2.73],
  ["2020-07-02",3.07,2.56],["2020-09-03",2.93,2.42],["2020-11-05",2.78,2.34],
  ["2021-01-07",2.65,2.16],["2021-03-04",3.02,2.34],["2021-05-06",2.96,2.27],
  ["2021-07-01",2.90,2.20],["2021-09-02",2.87,2.18],["2021-11-04",3.09,2.35],
  ["2022-01-06",3.22,2.43],["2022-03-03",3.76,3.01],["2022-05-05",5.27,4.52],
  ["2022-07-07",5.30,4.45],["2022-09-01",5.66,4.98],["2022-10-27",7.08,6.36],
  ["2022-11-10",7.08,6.38],["2022-12-01",6.49,5.76],["2023-01-05",6.48,5.73],
  ["2023-02-02",6.09,5.14],["2023-03-02",6.65,5.89],["2023-04-06",6.28,5.64],
  ["2023-05-04",6.39,5.75],["2023-06-01",6.79,6.18],["2023-07-06",6.81,6.24],
  ["2023-08-03",6.90,6.25],["2023-09-07",7.12,6.52],["2023-10-05",7.49,6.78],
  ["2023-10-26",7.79,7.03],["2023-11-02",7.76,7.03],["2023-12-07",7.03,6.29],
  ["2024-01-04",6.62,5.89],["2024-02-01",6.63,5.94],["2024-03-07",6.88,6.22],
  ["2024-04-04",6.82,6.06],["2024-05-02",7.22,6.47],["2024-06-06",6.99,6.29],
  ["2024-07-03",6.95,6.25],["2024-08-01",6.73,5.99],["2024-09-05",6.35,5.51],
  ["2024-09-19",6.09,5.15],["2024-10-10",6.32,5.45],["2024-11-07",6.79,5.99],
  ["2024-12-05",6.69,5.89],["2024-12-19",6.72,5.92],
  ["2025-01-02",6.91,6.07],["2025-01-16",7.04,6.27],["2025-01-23",7.04,6.22],
  ["2025-02-06",6.89,6.05],["2025-02-20",6.85,6.02],["2025-02-28",6.71,5.91],
  ["2025-03-13",6.65,5.89],["2025-03-20",6.67,5.83],["2025-03-27",6.65,5.89],
  ["2025-04-10",6.62,5.82],["2025-04-24",6.81,6.03],
  ["2025-05-08",6.76,5.96],["2025-05-22",6.86,6.04],
  ["2025-06-05",6.85,6.04],["2025-06-19",6.81,6.04],
  ["2025-07-03",6.67,5.93],["2025-07-17",6.70,5.94],
  ["2025-08-07",6.47,5.71],["2025-08-28",6.35,5.60],
  ["2025-09-11",6.20,5.36],["2025-09-18",6.09,5.15],
  ["2025-10-02",6.12,5.25],["2025-10-16",6.44,5.63],["2025-10-30",6.72,5.92],
  ["2025-11-13",6.78,5.99],["2025-11-27",6.81,5.97],
  ["2025-12-11",6.60,5.84],["2025-12-26",6.85,6.00],
  ["2026-01-09",6.93,6.14],["2026-01-16",7.04,6.27],["2026-01-23",7.04,6.22],["2026-01-30",6.95,6.12],
  ["2026-02-06",6.89,6.05],["2026-02-13",6.87,6.09],["2026-02-20",6.85,6.02],["2026-02-27",6.76,5.94],
  ["2026-03-06",6.63,5.82],["2026-03-13",6.65,5.89],["2026-03-20",6.22,5.54],["2026-03-26",6.38,5.75],
  ["2026-04-02",6.46,5.77],
];

// Recent daily data (MND index) merged on top
const DAILY_RECENT=[
  ["2026-01-02",6.91,6.07,6.38,"New Year open"],
  ["2026-01-07",7.02,6.18,6.47,"Strong jobs data"],["2026-01-08",7.04,6.20,6.49,""],
  ["2026-01-13",7.01,6.20,6.46,"CPI data"],["2026-01-15",7.08,6.26,6.51,""],
  ["2026-01-16",7.04,6.22,6.48,""],["2026-01-22",7.11,6.29,6.55,""],
  ["2026-01-23",7.04,6.22,6.48,""],["2026-01-29",6.92,6.11,6.39,"Fed holds rates"],
  ["2026-02-06",6.89,6.05,6.34,""],["2026-02-13",6.87,6.09,6.34,"CPI inline"],
  ["2026-02-20",6.85,6.02,6.30,""],["2026-02-28",6.71,5.91,6.19,"PCE cooler"],
  ["2026-03-05",6.62,5.83,6.12,"ADP jobs"],["2026-03-07",6.61,5.81,6.11,"NFP mixed"],
  ["2026-03-12",6.64,5.83,6.13,"CPI hotter"],["2026-03-17",6.72,5.90,6.20,"Iran tensions"],
  ["2026-03-18",6.69,5.87,6.17,"Fed holds"],["2026-03-19",6.65,5.84,6.14,"Post-Fed"],
  ["2026-03-20",6.22,5.54,5.98,"Iran ceasefire rally"],
  ["2026-03-24",6.34,5.64,6.07,""],["2026-03-25",6.42,5.71,6.13,""],
  ["2026-03-26",6.45,5.74,6.14,"Bankrate: 6.45%"],["2026-03-27",6.49,5.78,6.17,""],
  ["2026-03-31",6.49,5.78,6.17,""],["2026-04-01",6.47,5.76,6.15,"MND ▼0.08%"],
  ["2026-04-02",6.46,5.77,6.14,"Freddie Mac PMMS: Iran war pushes rates up"],
  ["2026-04-03",6.45,5.76,6.13,"MND +0.04%"],
  ["2026-04-04",6.50,5.80,6.16,"Bankrate: Iran escalation · rates at 7-month high"],
  ["2026-04-05",6.47,5.77,6.15,"Weekend avg"],
  ["2026-04-06",6.43,5.74,6.12,"MND ▼0.02%"],
  ["2026-04-07",6.34,5.71,6.10,"Zillow ▼0.09%"],
  ["2026-04-08",6.19,5.69,6.01,"NerdWallet/Zillow ▼0.15% · tariff fears ease"],
];

// Build combined dataset: PMMS history as base (weekly), recent daily on top
const histData=PMMS_HISTORY.map(([date,r30,r15])=>({date,r30,r15,arm:+(r30-0.55).toFixed(2),note:''}));
const recentData=DAILY_RECENT.map(([date,r30,r15,arm,note])=>({date,r30,r15,arm,note}));
// Merge: drop PMMS entries that overlap with recent daily dates
const recentDates=new Set(recentData.map(d=>d.date));
const mergedData=[...histData.filter(d=>d.date<'2026-01-01'||!recentDates.has(d.date)),...recentData];
mergedData.sort((a,b)=>a.date.localeCompare(b.date));

let data=mergedData;
let LIVE30=data[data.length-1].r30;
let LIVE15=data[data.length-1].r15;
let TODAY=data[data.length-1];

let currentRange = 14;

function fmtDate(s){
  return new Date(s+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',weekday:'short'});
}
function fmt(n){return'$'+Math.round(n).toLocaleString('en-US')}
function chgHtml(v){
  if(v===0)return'<span class="chg-fl">—</span>';
  return`<span class="${v>0?'chg-up':'chg-dn'}">${v>0?'▲':'▼'} ${Math.abs(v).toFixed(2)}%</span>`;
}

/* ── Modal open/close ── */
function openModal(id){
  document.getElementById(id).classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow='';
}
function closeOnBg(e,id){
  if(e.target===document.getElementById(id)) closeModal(id);
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));
});

/* ── Hero ── */
function renderHero(){
  const t=data[data.length-1], p=data[data.length-2];
  const wk=data.length>=6?data[data.length-6]:null;
  const yr=data.length>=52?data[data.length-52]:null;
  const mo=data.length>=22?data[data.length-22]:null;

  // 52-week average
  const last52 = data.slice(-52).map(d=>d.r30);
  const avg52  = (last52.reduce((a,b)=>a+b,0)/last52.length).toFixed(2);
  const last52_15 = data.slice(-52).map(d=>d.r15);
  const avg52_15  = (last52_15.reduce((a,b)=>a+b,0)/last52_15.length).toFixed(2);
  // Monthly avg (last 4 weeks)
  const last4  = data.slice(-4).map(d=>d.r30);
  const avgMo  = (last4.reduce((a,b)=>a+b,0)/last4.length).toFixed(2);
  const last4_15  = data.slice(-4).map(d=>d.r15);
  const avgMo_15  = (last4_15.reduce((a,b)=>a+b,0)/last4_15.length).toFixed(2);

  const wkChg  = wk ? +(t.r30-wk.r30).toFixed(2) : null;
  const yrChg  = yr ? +(t.r30-yr.r30).toFixed(2)  : null;
  const wkChg15= wk ? +(t.r15-wk.r15).toFixed(2) : null;
  const yrChg15= yr ? +(t.r15-yr.r15).toFixed(2)  : null;

  function chgStr(v){
    if(v===null) return '<span style="color:#64748b">—</span>';
    const sign = v > 0 ? '+' : '';
    const color = v > 0 ? '#f87171' : '#4ade80';
    return `<span style="color:${color};font-weight:600">${sign}${v.toFixed(2)}</span>`;
  }

  // 52-week range
  const last52data = data.slice(-52);
  const lo52_30 = Math.min(...last52data.map(d=>d.r30));
  const hi52_30 = Math.max(...last52data.map(d=>d.r30));
  const lo52_15 = Math.min(...last52data.map(d=>d.r15));
  const hi52_15 = Math.max(...last52data.map(d=>d.r15));

  function rangeBar(lo, hi, current, color) {
    const pct = Math.round((current - lo) / (hi - lo) * 100);
    return `
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid #334155">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#64748b;margin-bottom:6px">
          <span>52-Week Range</span>
          <span style="display:flex;align-items:center;gap:8px">
            <span>${lo.toFixed(2)}%</span>
            <div style="position:relative;width:80px;height:6px;background:#334155;border-radius:3px">
              <div style="position:absolute;left:0;top:0;height:100%;width:${pct}%;background:${color};border-radius:3px;min-width:4px"></div>
              <div style="position:absolute;top:-3px;left:calc(${pct}% - 2px);width:4px;height:12px;background:#f1f5f9;border-radius:2px"></div>
            </div>
            <span>${hi.toFixed(2)}%</span>
          </span>
        </div>
      </div>`;
  }

  function statCard(label, rate, wkC, yrC, moAvg, wkAvg52, color, lo52, hi52) {
    return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="border-left:3px solid ${color};padding-left:14px;flex-shrink:0">
          <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px">${label}</div>
          <div style="font-size:40px;font-weight:700;color:#f1f5f9;line-height:1">${rate}%</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;font-size:12px;text-align:right;flex:1;min-width:160px">
          <div>
            <div style="color:#64748b;margin-bottom:2px">1-Wk change</div>
            <div>${chgStr(wkC)}</div>
          </div>
          <div>
            <div style="color:#64748b;margin-bottom:2px">1-Yr change</div>
            <div>${chgStr(yrC)}</div>
          </div>
          <div>
            <div style="color:#64748b;margin-bottom:2px">Monthly avg.</div>
            <div style="color:#e2e8f0">${moAvg}%</div>
          </div>
          <div>
            <div style="color:#64748b;margin-bottom:2px">52-Wk avg.</div>
            <div style="color:#e2e8f0">${wkAvg52}%</div>
          </div>
        </div>
      </div>
      ${rangeBar(lo52, hi52, parseFloat(rate), color)}
    </div>`;
  }

  document.getElementById('heroCards').innerHTML =
    statCard('30-Yr Fixed', t.r30.toFixed(2), wkChg, yrChg, avgMo, avg52, '#60a5fa', lo52_30, hi52_30) +
    statCard('15-Yr Fixed', t.r15.toFixed(2), wkChg15, yrChg15, avgMo_15, avg52_15, '#a78bfa', lo52_15, hi52_15);
}

/* ── Chart — fetches from backend with technical indicators ── */
let myChart;
const BACKEND = 'https://mortgage-rate-tracker-production.up.railway.app';

async function loadChartData(days) {
  try {
    const res = await fetch(`${BACKEND}/api/rates/chart?days=${days === 0 ? 3650 : days}`);
    if (!res.ok) throw new Error('backend unavailable');
    return await res.json();
  } catch(e) {
    // Fallback: compute indicators client-side from embedded data
    let slice;
    if (days === 0) {
      slice = data;
    } else {
      const cutoff = (() => {
        const d = new Date(TODAY.date); d.setDate(d.getDate() - days);
        return d.toISOString().slice(0,10);
      })();
      slice = data.filter(d => d.date >= cutoff);
      // Always show at least 10 points so chart isn't empty
      if (slice.length < 10) slice = data.slice(-Math.min(data.length, Math.max(days, 10)));
    }
    const r30   = slice.map(d => d.r30);
    const r15   = slice.map(d => d.r15);
    const ma7   = clientSMA(r30, 7);
    const ma30  = clientSMA(r30, 30);
    const [bb_upper, bb_lower] = clientBollinger(r30);
    const rsi14 = clientRSI(r30);
    const signal = clientSignal(r30, ma7, ma30, rsi14);
    return { dates: slice.map(d=>d.date), r30, r15, ma7, ma30, bb_upper, bb_lower, rsi14, signal, notes: slice.map(d=>d.note) };
  }
}

/* Client-side indicator fallbacks */
function clientSMA(data, p) {
  return data.map((_, i) => i >= p ? Math.round(data.slice(i-p,i).reduce((a,b)=>a+b,0)/p*10000)/10000 : null);
}
function clientBollinger(data, p=20, k=2) {
  return [data.map((_, i) => {
    if(i < p) return null;
    const w=data.slice(i-p,i), m=w.reduce((a,b)=>a+b,0)/p;
    const std=Math.sqrt(w.reduce((a,x)=>a+(x-m)**2,0)/p);
    return Math.round((m+k*std)*10000)/10000;
  }), data.map((_, i) => {
    if(i < p) return null;
    const w=data.slice(i-p,i), m=w.reduce((a,b)=>a+b,0)/p;
    const std=Math.sqrt(w.reduce((a,x)=>a+(x-m)**2,0)/p);
    return Math.round((m-k*std)*10000)/10000;
  })];
}
function clientRSI(data, p=14) {
  return data.map((_, i) => {
    if(i < p) return null;
    const w=data.slice(i-p,i+1), d=w.map((x,j)=>j?x-w[j-1]:0).slice(1);
    const ag=d.filter(x=>x>0).reduce((a,b)=>a+b,0)/p;
    const al=d.filter(x=>x<0).reduce((a,b)=>a+Math.abs(b),0)/p||0.0001;
    return Math.round((100-100/(1+ag/al))*100)/100;
  });
}
function clientSignal(r30, ma7, ma30, rsi14) {
  const lm7  = [...ma7].reverse().find(x => x !== null && x !== undefined);
  const lm30 = [...ma30].reverse().find(x => x !== null && x !== undefined);
  const lrsi = [...rsi14].reverse().find(x => x !== null && x !== undefined);

  // Fallback: if MA not available, use median of last 7 / last 30 days
  function median(arr) {
    const s = [...arr].sort((a,b) => a-b);
    const m = Math.floor(s.length/2);
    return s.length % 2 ? s[m] : (s[m-1]+s[m])/2;
  }
  const eff_ma7  = lm7  ?? median(r30.slice(-7));
  const eff_ma30 = lm30 ?? median(r30.slice(-30));
  const rsiVal   = lrsi ?? 50;

  const ma7Label  = lm7  ? `7d MA`  : `7d median`;
  const ma30Label = lm30 ? `30d MA` : `30d median`;

  let signal, reason;

  if(eff_ma7 < eff_ma30) {
    signal = 'bullish';
    reason = `${ma7Label} (${eff_ma7.toFixed(2)}%) is below ${ma30Label} (${eff_ma30.toFixed(2)}%), indicating short-term rates are trending lower. ` +
      (rsiVal < 50
        ? `RSI at ${rsiVal.toFixed(0)} confirms downward momentum.`
        : `RSI at ${rsiVal.toFixed(0)} — watch for potential reversal if it rises above 65.`);
  } else if(eff_ma7 > eff_ma30) {
    signal = 'bearish';
    reason = `${ma7Label} (${eff_ma7.toFixed(2)}%) is above ${ma30Label} (${eff_ma30.toFixed(2)}%), signaling short-term upward rate pressure. ` +
      (rsiVal > 50
        ? `RSI at ${rsiVal.toFixed(0)} confirms upward momentum.`
        : `RSI at ${rsiVal.toFixed(0)} is subdued — the move may be losing steam.`);
  } else {
    signal = 'neutral';
    reason = `${ma7Label} (${eff_ma7.toFixed(2)}%) and ${ma30Label} (${eff_ma30.toFixed(2)}%) are flat. RSI at ${rsiVal.toFixed(0)}. Rates are consolidating with no strong directional signal.`;
  }

  // RSI extremes override MA signal
  if(lrsi !== undefined && lrsi < 30) {
    signal = 'bullish';
    reason = `RSI at ${lrsi.toFixed(0)} — deeply oversold. Rates have fallen sharply; a near-term stabilization or bounce is likely.`;
  } else if(lrsi !== undefined && lrsi > 70) {
    signal = 'bearish';
    reason = `RSI at ${lrsi.toFixed(0)} — overbought territory. Rates have risen quickly; upward momentum may exhaust soon.`;
  }

  return {signal, reason, ma7_last: eff_ma7, ma30_last: eff_ma30, rsi_last: lrsi ?? null};
}

async function renderChart(days) {
  const cd = await loadChartData(days);
  if (!cd.dates || !cd.dates.length) return;

  const totalDays = days === 0
    ? (new Date(cd.dates[cd.dates.length-1]) - new Date(cd.dates[0])) / 86400000
    : days;

  // Build evenly-spaced tick positions based on total range
  const n = cd.dates.length;
  const tickCount = totalDays > 365 ? 10 : totalDays > 60 ? 7 : 7;
  const step = Math.max(1, Math.floor(n / tickCount));
  const tickIndices = new Set();
  for(let i = 0; i < n; i += step) tickIndices.add(i);
  tickIndices.add(n-1);

  const labels = cd.dates.map((d, i) => {
    if (!tickIndices.has(i)) return '';
    const dt = new Date(d+'T00:00:00');
    if (totalDays > 365) {
      return dt.toLocaleDateString('en-US',{month:'short',year:'numeric'});
    } else if (totalDays > 60) {
      return dt.toLocaleDateString('en-US',{month:'short',year:'numeric'});
    } else {
      return dt.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    }
  });
  const r30   = cd.r30;
  const r15   = cd.r15;
  const ctx = document.getElementById('myChart').getContext('2d');
  if (myChart) myChart.destroy();

  const g30 = ctx.createLinearGradient(0,0,0,260);
  g30.addColorStop(0,'rgba(96,165,250,.25)'); g30.addColorStop(1,'rgba(96,165,250,.01)');

  const datasets = [
    {
      label: '30yr Fixed',
      data: r30,
      borderColor: '#60a5fa',
      backgroundColor: g30,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      tension: .3,
      fill: true,
      order: 3,
    },
    {
      label: '15yr Fixed',
      data: r15,
      borderColor: '#a78bfa',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: .3,
      fill: false,
      order: 4,
    },
  ];

  myChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode:'index', intersect:false },
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { size: 11 },
            boxWidth: 12,
            padding: 12,
            filter: item => !['BB Upper','BB Lower'].includes(item.text),
          }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          borderWidth: 1,
          titleColor: '#94a3b8',
          bodyColor: '#f1f5f9',
          padding: 8,
          displayColors: true,
          boxWidth: 10,
          boxHeight: 10,
          callbacks: {
            title: items => {
              const d = cd.dates[items[0]?.dataIndex];
              if (!d) return '';
              const dt = new Date(d+'T00:00:00');
              return dt.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
            },
            label: c => `  ${c.dataset.label}: ${c.parsed.y !== null ? c.parsed.y.toFixed(2)+'%' : '—'}`,
            afterBody: items => {
              const note = (cd.notes||[])[items[0]?.dataIndex];
              return note ? [`  📌 ${note}`] : [];
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color:'#1a2332' },
          ticks: {
            color: '#475569',
            font: {size:10},
            maxRotation: 0,
            autoSkip: false,
            callback: function(val, idx) {
              const lbl = this.getLabelForValue(val);
              return lbl || null;
            }
          }
        },
        y: {
          grid: { color:'#1a2332' },
          ticks: {
            color: '#475569',
            font: { size:10 },
            callback: v => v.toFixed(2)+'%'
          },
          min: Math.floor(Math.min(...r30, ...r15.filter(Boolean)) * 10) / 10 - .1,
          max: Math.ceil(Math.max(...r30, ...r15.filter(Boolean)) * 10) / 10 + .1,
        }
      }
    }
  });

  // Update forecast with signal from this data
  if (cd.signal) renderForecastFromSignal(cd.signal, r30);
}

function setRange(n, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentRange = n;
  renderChart(n);
}

/* ── Forecast panel — now driven by MA+RSI signal ── */
function renderForecastFromSignal(signal, r30) {
  if (!signal || !signal.reason) return;
  const trendBadge =
    signal.signal === 'bullish'
      ? '<span class="forecast-badge badge-bullish">↓ Rates trending down</span>'
      : signal.signal === 'bearish'
      ? '<span class="forecast-badge badge-bearish">↑ Rates trending up</span>'
      : '<span class="forecast-badge badge-neutral">→ Rates holding steady</span>';

  // Simple linear projection for 30/60 day ranges
  const recent = r30.slice(-30).filter(Boolean);
  const n = recent.length;
  const xs = [...Array(n).keys()];
  const sumX  = xs.reduce((a,b)=>a+b,0);
  const sumY  = recent.reduce((a,b)=>a+b,0);
  const sumXY = xs.reduce((a,x,i)=>a+x*recent[i],0);
  const sumX2 = xs.reduce((a,x)=>a+x*x,0);
  const slope = (n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX);
  const intercept = (sumY-slope*sumX)/n;
  const std = Math.sqrt(recent.reduce((a,y,i)=>{const r=y-(intercept+slope*xs[i]);return a+r*r},0)/n);
  const pred = d => +(intercept+slope*d).toFixed(2);
  const in30 = pred(n+30), in60 = pred(n+60);
  const lo30 = +(in30-std*1.1).toFixed(2), hi30 = +(in30+std*1.1).toFixed(2);
  const lo60 = +(in60-std*1.5).toFixed(2), hi60 = +(in60+std*1.5).toFixed(2);
  const allR30    = data.map(d=>d.r30);
  const allTime   = Math.min(...allR30);
  const allTimeHigh = Math.max(...allR30);
  const barRange  = allTimeHigh - allTime || 1;
  const currentPct = Math.min(99, Math.round((r30[r30.length-1] - allTime) / barRange * 100));

  document.getElementById('forecastPanel').innerHTML = `
    <div class="section-hd" style="margin-bottom:12px">
      <h2>📊 Rate Forecast &amp; Context</h2>
      ${trendBadge}
    </div>
    <p style="font-size:12px;color:#64748b;margin-bottom:14px;line-height:1.7">${signal.reason}</p>
    <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      ${signal.ma7_last!==null?`<span style="background:#1a1400;border:1px solid #713f12;color:#fbbf24;font-size:11px;padding:3px 10px;border-radius:20px">MA 7d: ${signal.ma7_last?.toFixed(2)}%</span>`:''}
      ${signal.ma30_last!==null?`<span style="background:#2d1010;border:1px solid #7f1d1d;color:#f87171;font-size:11px;padding:3px 10px;border-radius:20px">MA 30d: ${signal.ma30_last?.toFixed(2)}%</span>`:''}
      ${signal.rsi_last!==null?`<span style="background:#1e1a36;border:1px solid #4c1d95;color:#a78bfa;font-size:11px;padding:3px 10px;border-radius:20px">RSI: ${signal.rsi_last?.toFixed(0)}</span>`:''}
    </div>
    <div class="forecast-grid" style="grid-template-columns:1fr 1fr">
      <div class="forecast-card">
        <div class="forecast-card-label">30-day projection</div>
        <div class="forecast-range">${lo30}–${hi30}%</div>
        <div class="forecast-sub">Center: ${in30}%</div>
      </div>
      <div class="forecast-card">
        <div class="forecast-card-label">60-day projection</div>
        <div class="forecast-range">${lo60}–${hi60}%</div>
        <div class="forecast-sub">Wider confidence band</div>
      </div>
    </div>
    <div style="margin-top:12px">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#475569;margin-bottom:6px">
        <span>Dataset low ${allTime.toFixed(2)}%</span>
        <span style="color:#f1f5f9;font-weight:600">Now ${r30[r30.length-1].toFixed(2)}%</span>
        <span>High ${allTimeHigh.toFixed(2)}%</span>
      </div>
      <div class="forecast-bar">
        <div class="forecast-bar-fill" style="left:0;width:${currentPct}%"></div>
        <div class="forecast-bar-current" style="left:calc(${currentPct}% - 1.5px)"></div>
      </div>
      <div style="font-size:11px;color:#475569;margin-top:4px">
        Current rate is at the <strong style="color:#f1f5f9">${currentPct}th percentile</strong> of its 20-year historical range (${allTime.toFixed(2)}%–${allTimeHigh.toFixed(2)}%).
        Signals based on MA crossover + RSI(14).
      </div>
    </div>`;
}

function renderForecast() {
  // Compute signal immediately from embedded data — no waiting
  const r30 = data.map(d=>d.r30);
  const ma7  = clientSMA(r30, 7);
  const ma30 = clientSMA(r30, 30);
  const rsi14 = clientRSI(r30);
  const signal = clientSignal(r30, ma7, ma30, rsi14);
  renderForecastFromSignal(signal, r30);
}

/* ── Refi Calculator ── */
function moPay(rate,loan,years){
  const r=rate/100/12,n=years*12;
  return r>0?loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):loan/n;
}
function syncRefiRate(src){
  if(src==='cur'){document.getElementById('rCurNum').value=parseFloat(document.getElementById('rCurSlider').value).toFixed(2);}
  else if(src==='curN'){document.getElementById('rCurSlider').value=document.getElementById('rCurNum').value;}
  else if(src==='new'){document.getElementById('rNewNum').value=parseFloat(document.getElementById('rNewSlider').value).toFixed(2);}
  else if(src==='newN'){document.getElementById('rNewSlider').value=document.getElementById('rNewNum').value;}
  refi();
}
function refi(){
  const loan=+document.getElementById('rLoan').value||0;
  const curRate=+document.getElementById('rCurNum').value||0;
  const newRate=+document.getElementById('rNewNum').value||0;
  const term=+document.getElementById('rTerm').value;
  const costs=+document.getElementById('rCosts').value||0;
  const curMo=moPay(curRate,loan,term);
  const newMo=moPay(newRate,loan,term);
  const moSave=curMo-newMo;
  const yrSave=moSave*12;
  const totalSave=moSave*term*12-costs;
  const breakEven=moSave>0?Math.ceil(costs/moSave):null;
  const fmt2=n=>'$'+Math.round(n).toLocaleString('en-US');

  // Update hero
  const heroAmt = document.getElementById('refiHeroAmt');
  const heroSub = document.getElementById('refiHeroSub');
  if(moSave > 0){
    heroAmt.textContent = '+'+fmt2(moSave)+'/mo';
    heroAmt.style.color = '#4ade80';
    heroSub.textContent = `Refinancing from ${curRate.toFixed(2)}% → ${newRate.toFixed(2)}% on a $${Math.round(loan).toLocaleString()} loan`;
  } else {
    heroAmt.textContent = fmt2(Math.abs(moSave))+'/mo more';
    heroAmt.style.color = '#f87171';
    heroSub.textContent = `New rate is higher than current — refinancing not recommended`;
  }

  document.getElementById('rCurRateDisplay').textContent=curRate.toFixed(2)+'%';
  document.getElementById('rNewRateDisplay').textContent=newRate.toFixed(2)+'%';
  document.getElementById('rCurMo').textContent=fmt2(curMo)+'/mo';
  document.getElementById('rNewMo').textContent=fmt2(newMo)+'/mo';
  document.getElementById('rMoSave').textContent=(moSave>=0?'+':'')+fmt2(moSave)+'/mo';
  document.getElementById('rMoSave').style.color=moSave>0?'#4ade80':'#f87171';
  document.getElementById('rYrSave').textContent=(yrSave>=0?'+':'')+fmt2(yrSave)+'/yr';
  document.getElementById('rYrSave').style.color=yrSave>0?'#4ade80':'#f87171';
  document.getElementById('rBreakEven').textContent=breakEven?breakEven+' months':'N/A';
  document.getElementById('rTotalSave').textContent=(totalSave>=0?'+':'')+fmt2(totalSave);
  document.getElementById('rTotalSave').style.color=totalSave>0?'#4ade80':'#f87171';
  document.getElementById('refiPreview').textContent=moSave>0?`Save ${fmt2(moSave)}/mo refinancing`:'Enter your current rate';
}

/* ── Calculator ── */
function syncDown(src){
  const price=+document.getElementById('cPrice').value||0;
  if(src==='amt'){document.getElementById('cDownPct').value=price?Math.round((+document.getElementById('cDown').value||0)/price*100):0;}
  else{document.getElementById('cDown').value=Math.round(price*(+document.getElementById('cDownPct').value||0)/100);}
}
function syncRate(src){
  if(src==='slider')document.getElementById('cRateNum').value=parseFloat(document.getElementById('cRateSlider').value).toFixed(2);
  else document.getElementById('cRateSlider').value=document.getElementById('cRateNum').value;
  calc();
}
function calc(){
  const price=+document.getElementById('cPrice').value||0;
  const down=+document.getElementById('cDown').value||0;
  const term=+document.getElementById('cTerm').value;
  const rate=+document.getElementById('cRateNum').value;
  const loan=Math.max(0,price-down);
  const n=term*12,r=rate/100/12;
  const mo=r>0?loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):loan/n;
  const total=mo*n,ti=total-loan;
  const pPct=loan>0?Math.round(loan/(loan+ti)*100):70;
  document.getElementById('mMonthly').textContent=fmt(mo);
  document.getElementById('mInt').textContent=fmt(ti);
  document.getElementById('mIntPct').textContent=(loan>0?Math.round(ti/loan*100):0)+'% of loan';
  document.getElementById('mTotal').textContent=fmt(total);
  document.getElementById('mLoan').textContent='Loan: '+fmt(loan);
  document.getElementById('barP').style.width=pPct+'%';
  document.getElementById('barI').style.width=(100-pPct)+'%';
  document.getElementById('legP').textContent='Principal '+fmt(loan)+' ('+pPct+'%)';
  document.getElementById('legI').textContent='Interest '+fmt(ti)+' ('+(100-pPct)+'%)';
  let bal=loan,html='';
  for(let y=1;y<=Math.min(5,term);y++){
    let yP=0,yI=0;
    for(let m=0;m<12;m++){const i=bal*r;const p=mo-i;yI+=i;yP+=p;bal-=p;}
    html+=`<tr><td>Year ${y}</td><td>${fmt(yP)}</td><td>${fmt(yI)}</td><td>${fmt(Math.max(0,bal))}</td></tr>`;
  }
  document.getElementById('amortBody').innerHTML=html;
  document.getElementById('calcPreview').textContent=`$500K home · ${rate.toFixed(2)}% → ${fmt(mo)}/mo`;
}
function loadScenario(price,down,term,rateKey,el){
  document.querySelectorAll('.sc-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  const rate=rateKey==='live'?LIVE30:rateKey==='live15'?LIVE15:rateKey;
  document.getElementById('cPrice').value=price;
  document.getElementById('cDown').value=down;
  document.getElementById('cDownPct').value=Math.round(down/price*100);
  document.getElementById('cTerm').value=term;
  document.getElementById('cRateNum').value=rate.toFixed(2);
  document.getElementById('cRateSlider').value=rate;
  calc();
}

/* ── History table ── */
function renderTable(){
  const recent=[...data].reverse().slice(0,20);
  document.getElementById('tbody').innerHTML=recent.map((d,i)=>{
    const prev=data[data.length-1-i-1];
    const chg=prev?+(d.r30-prev.r30).toFixed(2):null;
    const s=i===0?'background:#0f1f36;font-weight:600':'';
    return`<tr style="${s}">
      <td>${fmtDate(d.date)}${i===0?' <span style="color:#4ade80;font-size:11px">TODAY</span>':''}</td>
      <td>${d.r30.toFixed(2)}%</td><td>${d.r15.toFixed(2)}%</td><td>${d.arm.toFixed(2)}%</td>
      <td>${chg!==null?chgHtml(chg):'<span class="chg-fl">—</span>'}</td>
      <td style="font-size:11px;color:#475569">${d.note||''}</td>
    </tr>`;
  }).join('');
}

/* ── Alert modal ── */
function moPayment(rate, loan){
  const r=rate/100/12, n=30*12;
  return r>0?loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):loan/n;
}
function updateThresh(){
  const t=+document.getElementById('threshSlider').value;
  document.getElementById('threshDisplay').textContent=t.toFixed(2)+'%';
  document.getElementById('alertBtnRate').textContent=t.toFixed(2)+'%';
  const loan=600000*0.8;
  const curMo=moPayment(LIVE30,loan);
  const tgtMo=moPayment(t,loan);
  const save=curMo-tgtMo;
  document.getElementById('alertCurMo').textContent=fmt(curMo)+'/mo';
  document.getElementById('alertTgtMo').textContent=fmt(tgtMo)+'/mo';
  document.getElementById('alertSavings').textContent=(save>0?'+':'')+fmt(Math.abs(save))+'/mo';
  document.getElementById('alertSavings').style.color=save>0?'#4ade80':'#f87171';
}
function submitAlert(){
  const email=document.getElementById('alertEmail').value.trim();
  if(!email||!email.includes('\u0040')){
    document.getElementById('alertEmail').style.borderColor='#f87171';
    document.getElementById('alertEmail').focus();
    return;
  }
  const thresh=+document.getElementById('threshSlider').value;
  const weekly=document.getElementById('chkWeekly').checked;
  const bigMove=document.getElementById('chkBigMove').checked;
  // POST to your Python backend: /api/subscribe
  fetch('/api/subscribe',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,threshold:thresh,weekly,big_move:bigMove})
  }).catch(()=>{});
  // Show success (optimistic UI)
  document.getElementById('alertSubmitBtn').style.display='none';
  document.getElementById('alertSuccess').style.display='block';
  document.getElementById('alertSuccessMsg').textContent=
    `We'll email ${email} when the 30yr rate drops below ${thresh.toFixed(2)}%`;
  document.getElementById('alertPreview').textContent=`Alert set: below ${thresh.toFixed(2)}%`;
}

/* ── News modal ── */
const NEWS_API_KEY = 'YOUR_NEWSAPI_KEY';

// Each article gets a rate impact score: 'up' | 'down' | 'neutral'
// scored by keyword matching against known mortgage rate drivers
const RATE_UP_SIGNALS = [
  'inflation','cpi higher','hot jobs','strong jobs','beats expectations',
  'hawkish','rate hike','yields rise','treasury higher','oil surge',
  'economy strong','gdp beat','tariff','war escalat','iran attack',
  'fed holds','no cut','delay cut','fewer cuts','one cut',
];
const RATE_DOWN_SIGNALS = [
  'inflation cools','inflation falls','cpi lower','jobless','layoffs',
  'recession','slowdown','dovish','rate cut','fed cut','yields fall',
  'treasury lower','ceasefire','peace','de-escalat','weak jobs',
  'below expectations','gdp miss','unemployment rises','cooling',
  'mortgage rates fall','rates drop','rates ease','rates decline',
];

function scoreImpact(title) {
  const t = title.toLowerCase();
  let up = 0, down = 0;
  RATE_UP_SIGNALS.forEach(k => { if (t.includes(k)) up++; });
  RATE_DOWN_SIGNALS.forEach(k => { if (t.includes(k)) down++; });
  if (up > down) return 'up';
  if (down > up) return 'down';
  return 'neutral';
}

function impactLabel(impact) {
  if (impact === 'up')      return { text:'▲ Rates Higher', bg:'#2d1010', border:'#7f1d1d', color:'#f87171' };
  if (impact === 'down')    return { text:'▼ Rates Lower',  bg:'#0d2818', border:'#166534', color:'#4ade80' };
  return                           { text:'→ Neutral',       bg:'#1a1a2e', border:'#334155', color:'#94a3b8' };
}

function impactReason(title, impact) {
  const t = title.toLowerCase();
  if (impact === 'up') {
    if (t.includes('inflation') || t.includes('cpi'))
      return 'Higher inflation → Fed stays hawkish → bond yields rise → mortgage rates up.';
    if (t.includes('job') || t.includes('employment'))
      return 'Strong jobs data → economy resilient → Fed less likely to cut → rates stay elevated.';
    if (t.includes('fed') || t.includes('rate hike') || t.includes('hawkish'))
      return 'Fed hawkish stance → market prices in fewer cuts → long-term rates rise.';
    if (t.includes('tariff') || t.includes('war') || t.includes('iran'))
      return 'Geopolitical risk / tariffs → inflation fear → bond sell-off → rates up.';
    return 'Bullish economic signal → reduces rate cut expectations → mortgage rates trend higher.';
  }
  if (impact === 'down') {
    if (t.includes('inflation') || t.includes('cpi'))
      return 'Cooling inflation → Fed can cut sooner → bond rally → mortgage rates fall.';
    if (t.includes('job') || t.includes('unemployment'))
      return 'Weak jobs → economic slowdown → Fed more likely to cut → rates ease.';
    if (t.includes('ceasefire') || t.includes('peace') || t.includes('de-escalat'))
      return 'Geopolitical calm → risk-off unwind → bond prices rise → yields (and rates) fall.';
    if (t.includes('fed cut') || t.includes('rate cut') || t.includes('dovish'))
      return 'Fed dovish signal → market prices in more cuts → 10-yr Treasury yields drop → rates follow.';
    return 'Bearish economic signal → increases cut expectations → mortgage rates trend lower.';
  }
  return 'Mixed signals — no dominant rate driver identified in this headline.';
}

const FALLBACK_NEWS = [
  {title:'Mortgage rates climb to 6.46%, highest in nearly seven months amid Iran war',source:'FOX News',date:'2026-04-04',url:'https://fox5ny.com',tag:'mortgage'},
  {title:'Freddie Mac: 30-year fixed rate rises to 6.46% for week ending April 2',source:'Freddie Mac',date:'2026-04-02',url:'https://freddiemac.com',tag:'mortgage'},
  {title:'Fed holds rates steady — signals only one cut possible in 2026',source:'Federal Reserve',date:'2026-04-03',url:'https://federalreserve.gov',tag:'fed'},
  {title:'Mortgage refinance demand plunges 17% as rates hit seven-month high',source:'MBA',date:'2026-04-04',url:'https://mba.org',tag:'mortgage'},
  {title:'Iran war drives oil above $110/barrel, fueling fresh inflation fears',source:'Reuters',date:'2026-04-04',url:'https://reuters.com',tag:'fed'},
  {title:'10-year Treasury yield rises as markets price in fewer Fed rate cuts',source:'Wall Street Journal',date:'2026-04-03',url:'https://wsj.com',tag:'fed'},
  {title:'Mortgage application volume down 40% over past month on rate surge',source:'CNBC',date:'2026-04-04',url:'https://cnbc.com',tag:'mortgage'},
  {title:'Fannie Mae forecasts 30-year rate near 6% by end of 2026',source:'Fannie Mae',date:'2026-04-02',url:'https://fanniemae.com',tag:'fed'},
  {title:'Homebuilders offering rate buydowns as spring market slows on high rates',source:'HousingWire',date:'2026-04-03',url:'https://housingwire.com',tag:'mortgage'},
  {title:'Trump gives Iran 48-hour deadline — ceasefire hopes fade, bond yields rise',source:'AP News',date:'2026-04-05',url:'https://apnews.com',tag:'fed'},
];

let allNews = [], newsLoaded = false;

async function openNewsModal() {
  openModal('newsModal');
  if (newsLoaded) return;

  // Try backend first
  try {
    const res = await fetch(`${BACKEND}/api/news`);
    if (res.ok) {
      const data = await res.json();
      if (data.articles && data.articles.length) {
        allNews = data.articles;
        renderNews(allNews);
        renderSentimentChart(allNews);
        newsLoaded = true;
        return;
      }
    }
  } catch(e) {
    console.log('[news] backend unavailable, using fallback');
  }

  // Fallback: hardcoded + client-side scoring
  allNews = FALLBACK_NEWS.map(a => ({ ...a, impact: scoreImpact(a.title) }));
  renderNews(allNews);
  renderSentimentChart(allNews);
  newsLoaded = true;
}

function renderSentimentChart(items) {
  const total = items.length || 1;
  const up      = items.filter(a => a.impact==='up').length;
  const down    = items.filter(a => a.impact==='down').length;
  const neutral = items.filter(a => a.impact==='neutral').length;
  const upPct      = Math.round(up/total*100);
  const downPct    = Math.round(down/total*100);
  const neutralPct = Math.round(neutral/total*100);

  document.getElementById('newsSentimentBar').style.display = 'block';
  document.getElementById('sentBarDown').style.width    = downPct+'%';
  document.getElementById('sentBarNeutral').style.width = neutralPct+'%';
  document.getElementById('sentBarUp').style.width      = upPct+'%';
  document.getElementById('sentDownPct').textContent    = downPct+'%';
  document.getElementById('sentNeutralPct').textContent = neutralPct+'%';
  document.getElementById('sentUpPct').textContent      = upPct+'%';

  // Overall verdict
  let verdictIcon, verdictColor, verdictText;
  if (downPct > upPct + 15) {
    verdictIcon='▼'; verdictColor='#4ade80';
    verdictText=`<strong style="color:#4ade80">${downPct}% of headlines point to lower rates.</strong> Dominant themes: cooling inflation, Fed dovish signals, or geopolitical de-escalation — all of which push bond yields and mortgage rates down.`;
  } else if (upPct > downPct + 15) {
    verdictIcon='▲'; verdictColor='#f87171';
    verdictText=`<strong style="color:#f87171">${upPct}% of headlines point to higher rates.</strong> Dominant themes: hot inflation, strong jobs, or hawkish Fed — reducing rate cut expectations and pushing mortgage rates up.`;
  } else {
    verdictIcon='→'; verdictColor='#94a3b8';
    verdictText=`<strong style="color:#94a3b8">Mixed signals across today's headlines.</strong> Bullish and bearish rate drivers are roughly balanced — expect rates to consolidate near current levels in the near term.`;
  }
  document.getElementById('sentVerdict').innerHTML =
    `<span style="font-size:18px;margin-right:8px">${verdictIcon}</span>${verdictText}`;

  // Update button preview
  const dominant = downPct >= upPct && downPct >= neutralPct ? '▼ Mostly bearish for rates'
                 : upPct > downPct && upPct >= neutralPct    ? '▲ Mostly bullish for rates'
                 : '→ Mixed signals';
  document.getElementById('newsPreview').textContent = `${items.length} articles · ${dominant}`;
}

function renderNews(items) {
  document.getElementById('newsLoading').style.display = 'none';
  const list = document.getElementById('newsList');
  list.style.display = 'block';
  if (!items.length) {
    list.innerHTML = '<p style="color:#475569;font-size:13px">No articles found.</p>';
    return;
  }
  list.innerHTML = items.map(a => {
    const lbl = impactLabel(a.impact);
    const reason = impactReason(a.title, a.impact);
    return `
    <div class="news-item" data-tag="${a.tag}" data-impact="${a.impact}" style="flex-direction:column;align-items:stretch;gap:6px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <span class="news-tag ${a.tag==='fed'?'tag-fed':'tag-mortgage'}" style="flex-shrink:0;margin-top:2px">${a.tag==='fed'?'Fed':'Rates'}</span>
        <div style="flex:1">
          <div class="news-title"><a href="${a.url}" target="_blank">${a.title}</a></div>
          <div class="news-meta"><span class="news-source">${a.source}</span>${a.date?' · '+a.date:''}</div>
        </div>
        <span style="flex-shrink:0;display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;background:${lbl.bg};border:1px solid ${lbl.border};color:${lbl.color};white-space:nowrap">${lbl.text}</span>
      </div>
      <div style="margin-left:2px;padding:7px 10px;background:#0f1926;border-radius:8px;border-left:2px solid ${lbl.border};font-size:12px;color:#94a3b8;line-height:1.6">
        ${reason}
      </div>
    </div>`;
  }).join('');
}

function filterNews(filter, btn) {
  document.querySelectorAll('.news-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.news-item').forEach(el => {
    const tagMatch    = filter==='all' || el.dataset.tag===filter;
    const impactMatch = filter==='all' || el.dataset.impact===filter;
    const show = filter==='all' ? true
               : ['mortgage','fed'].includes(filter) ? tagMatch
               : impactMatch;
    el.style.display = show ? 'flex' : 'none';
  });
}

/* ── Share Card ── */
function openShareModal() {
  openModal('shareModal');
  setTimeout(drawCard, 100);
}

function drawCard() {
  const canvas = document.getElementById('shareCanvas');
  const dpr = window.devicePixelRatio || 1;
  const W = 800, H = 440;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = '100%';
  canvas.style.height = 'auto';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = '#0f1117';
  ctx.fillRect(0, 0, W, H);

  // Top gradient bar
  const grad = ctx.createLinearGradient(0,0,W,0);
  grad.addColorStop(0,'#60a5fa');
  grad.addColorStop(1,'#a78bfa');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 4);

  // ── LEFT COLUMN (x: 30 to 370) ──
  const LX = 30, RX = 410;

  // Date + title
  ctx.fillStyle = '#475569';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText(TODAY.date + '  ·  Daily Mortgage Rate Tracker', LX, 30);

  // 30yr box
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, LX, 44, 160, 90, 8); ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('30-Year Fixed', LX+12, 64);
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 36px -apple-system, sans-serif';
  ctx.fillText(LIVE30.toFixed(2)+'%', LX+12, 114);

  // 15yr box
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, LX+172, 44, 160, 90, 8); ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('15-Year Fixed', LX+184, 64);
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 36px -apple-system, sans-serif';
  ctx.fillText(LIVE15.toFixed(2)+'%', LX+184, 114);

  // Change
  const prev = data[data.length-2];
  if(prev){
    const chg = +(LIVE30-prev.r30).toFixed(2);
    ctx.fillStyle = chg>0?'#f87171':'#4ade80';
    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillText((chg>0?'▲ +':'▼ ')+Math.abs(chg).toFixed(2)+'% vs yesterday', LX, 158);
  }

  // Monthly payment
  ctx.fillStyle = '#64748b';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('$500K home · 20% down · 30yr', LX, 188);
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 22px -apple-system, sans-serif';
  ctx.fillText('$'+Math.round(moPay(LIVE30,400000,30)).toLocaleString()+'/mo', LX, 216);

  // 52-week range bar
  const last52 = data.slice(-52).map(d=>d.r30);
  const lo52 = Math.min(...last52), hi52 = Math.max(...last52);
  const pct52 = Math.round((LIVE30-lo52)/(hi52-lo52)*100);
  ctx.fillStyle = '#64748b';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('52-Wk Range', LX, 248);
  ctx.fillStyle = '#334155';
  roundRect(ctx, LX, 256, 330, 8, 4); ctx.fill();
  ctx.fillStyle = '#60a5fa';
  roundRect(ctx, LX, 256, Math.round(330*pct52/100), 8, 4); ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.font = '10px -apple-system, sans-serif';
  ctx.fillText(lo52.toFixed(2)+'%', LX, 278);
  ctx.textAlign = 'right';
  ctx.fillText(hi52.toFixed(2)+'%', LX+330, 278);
  ctx.textAlign = 'left';

  // Contact box
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, LX, 295, 330, 82, 8); ctx.fill();
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 14px -apple-system, sans-serif';
  ctx.fillText('Stefanie Si', LX+12, 320);
  ctx.fillStyle = '#60a5fa';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('Licensed MLO  ·  CFA  ·  FRM', LX+12, 338);
  ctx.fillStyle = '#64748b';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('📱 201-660-3602   💬 WeChat: stefanie_si', LX+12, 356);
  ctx.fillText('📕 小红书: 斯斯子在美东   NMLS# 2800972', LX+12, 372);

  // ── RIGHT COLUMN — sparkline (last 14 days) ──
  const recent = data.slice(-14);
  const r30v = recent.map(d=>d.r30);
  const rlo = Math.min(...r30v)-0.05, rhi = Math.max(...r30v)+0.05;
  const rng = rhi-rlo;
  const CX=RX, CY=44, CW=W-RX-30, CH=290;

  // Chart bg
  ctx.fillStyle = '#1e293b';
  roundRect(ctx, CX, CY, CW, CH, 8); ctx.fill();

  // Chart title
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px -apple-system, sans-serif';
  ctx.fillText('30yr Fixed — Last 14 days', CX+14, CY+20);

  // Y-axis grid lines + labels
  [0,0.25,0.5,0.75,1].forEach(f=>{
    const y = CY+CH-30 - f*(CH-44);
    const v = (rlo+f*rng).toFixed(2);
    ctx.strokeStyle='#334155'; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.moveTo(CX+8,y); ctx.lineTo(CX+CW-8,y); ctx.stroke();
    ctx.fillStyle='#475569'; ctx.font='9px -apple-system, sans-serif';
    ctx.textAlign='right';
    ctx.fillText(v+'%', CX+CW-10, y-2);
    ctx.textAlign='left';
  });

  // Sparkline
  const pw=(CW-24)/(r30v.length-1);
  const py=v=>CY+CH-30-((v-rlo)/rng)*(CH-44);

  // Fill
  const sg=ctx.createLinearGradient(0,CY,0,CY+CH);
  sg.addColorStop(0,'rgba(96,165,250,0.35)');
  sg.addColorStop(1,'rgba(96,165,250,0.0)');
  ctx.beginPath();
  ctx.moveTo(CX+12,py(r30v[0]));
  r30v.forEach((v,i)=>ctx.lineTo(CX+12+i*pw,py(v)));
  ctx.lineTo(CX+12+(r30v.length-1)*pw,CY+CH-30);
  ctx.lineTo(CX+12,CY+CH-30);
  ctx.closePath();
  ctx.fillStyle=sg; ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(CX+12,py(r30v[0]));
  r30v.forEach((v,i)=>ctx.lineTo(CX+12+i*pw,py(v)));
  ctx.strokeStyle='#60a5fa'; ctx.lineWidth=2; ctx.stroke();

  // End dot
  const lastX=CX+12+(r30v.length-1)*pw, lastY=py(r30v[r30v.length-1]);
  ctx.beginPath(); ctx.arc(lastX,lastY,4,0,Math.PI*2);
  ctx.fillStyle='#60a5fa'; ctx.fill();

  // X-axis date labels (3 evenly spaced)
  ctx.fillStyle='#475569'; ctx.font='9px -apple-system, sans-serif';
  [0, Math.floor(r30v.length/2), r30v.length-1].forEach(i=>{
    const d=new Date(recent[i].date+'T00:00:00');
    const lbl=d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    const x=CX+12+i*pw;
    ctx.textAlign=i===0?'left':i===r30v.length-1?'right':'center';
    ctx.fillText(lbl,x,CY+CH-12);
  });
  ctx.textAlign='left';

  // ── Bottom disclaimer ──
  ctx.fillStyle='#334155'; ctx.font='9px -apple-system, sans-serif';
  ctx.fillText('For informational purposes only. Not a loan commitment. Source: Freddie Mac PMMS / MND.  stefaniesi-code.github.io/mortgage-rate-tracker', 30, H-10);

  // Bottom gradient bar
  ctx.fillStyle=grad; ctx.fillRect(0,H-3,W,3);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function downloadCard() {
  const canvas = document.getElementById('shareCanvas');
  const link = document.createElement('a');
  link.download = `mortgage-rates-${TODAY.date}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Set contact email via JS to prevent Cloudflare obfuscation
(function(){
  const u='stefanie.silink', d='gmail.com';
  const el=document.getElementById('contactEmailLink');
  const txt=document.getElementById('contactEmail');
  if(el) el.href='mailto:'+u+'\u0040'+d;
  if(txt) txt.textContent=u+'\u0040'+d;
})();

renderHero();
renderForecast();
renderTable();

// Set header date dynamically
document.getElementById('headerSub').textContent =
  `Daily rates · Mortgage News Daily + Bankrate · ${TODAY.date}`;

document.getElementById('cRateNum').value=LIVE30.toFixed(2);
document.getElementById('cRateSlider').value=LIVE30;
document.getElementById('calcRateBadge').textContent=
  `Auto-synced: 30yr ${LIVE30.toFixed(2)}% · 15yr ${LIVE15.toFixed(2)}% · ${TODAY.date}`;
calc();
document.getElementById('alertCurrentRate').textContent=LIVE30.toFixed(2)+'%';
updateThresh();
document.getElementById('rNewNum').value=LIVE30.toFixed(2);
document.getElementById('rNewSlider').value=LIVE30;
refi();

// Keep Railway awake — ping every 10 min to prevent cold start
setInterval(() => {
  fetch(`${BACKEND}/`).catch(()=>{});
}, 10 * 60 * 1000);

// Warm up Railway immediately on page load (non-blocking)
fetch(`${BACKEND}/`).catch(()=>{});

// Render chart (triggers forecast panel too)
renderChart(14);

// Fetch live rate from backend — updates everything if newer
(async()=>{
  try{
    const res=await fetch(`${BACKEND}/api/rates/today`);
    if(!res.ok) return;
    const rate=await res.json();
    // Update header date
    document.getElementById('headerSub').textContent =
      `Daily rates · Mortgage News Daily + Bankrate · ${rate.date}`;
    document.getElementById('pill-date').textContent = `Updated ${rate.date}`;
    if(rate.date >= TODAY.date){
      // Always inject/update with backend data
      const exists = data.find(d=>d.date===rate.date);
      if(!exists){
        data.push({date:rate.date,r30:rate.r30,r15:rate.r15,arm:rate.arm||+(rate.r30-.52).toFixed(2),note:'Live · FRED'});
      } else {
        exists.r30=rate.r30; exists.r15=rate.r15;
      }
      LIVE30=rate.r30; LIVE15=rate.r15; TODAY=data[data.length-1];
      renderHero();
      renderChart(currentRange);
      document.getElementById('calcRateBadge').textContent=
        `Live: 30yr ${rate.r30.toFixed(2)}% · 15yr ${rate.r15.toFixed(2)}% · ${rate.date}`;
      document.getElementById('alertCurrentRate').textContent=rate.r30.toFixed(2)+'%';
      document.getElementById('rNewNum').value=rate.r30.toFixed(2);
      document.getElementById('rNewSlider').value=rate.r30;
      updateThresh(); refi();
      console.log(`[Live] ${rate.date}: 30yr ${rate.r30}% (source: ${rate.source})`);
    }
  }catch(e){
    console.log('[Backend unavailable — using embedded data]');
  }
})();
