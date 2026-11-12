const {load}=require('./stub');const {performance:pf}=require('perf_hooks');
const {api,fr,key}=load(process.argv[2],'?level=2','P,LOG,hidePanel,nextEvent,cam,get warp(){return warp},get simT(){return simT},bname');
const {P}=api;api.hidePanel();fr(3);
key('keydown','Space');fr(48);key('keyup','Space');fr(20);
key('keydown','KeyF');const rows=[];let realT=0;const t0=api.simT;const ft=[];
for(let i=0;i<60*60&&!(P.on);i++){const a=pf.now();fr(1);ft.push(pf.now()-a);realT+=1/60;
  if(i%30===0){const ne=api.nextEvent();rows.push(`real ${realT.toFixed(1).padStart(5)}s sim ${(api.simT-t0).toFixed(1).padStart(6)}s  warp ×${api.warp.toFixed(1)}  rip ${api.cam.rip.toFixed(2)}  zoom ${api.cam.zoom.toFixed(2)}  next: ${ne?ne.label+' in '+ne.t.toFixed(1)+'s sim / '+(ne.t/Math.max(1,api.warp)).toFixed(1)+'s real':'—'}`);}}
key('keyup','KeyF');
console.log(rows.filter((_,i)=>i%2===0).slice(0,40).join('\n'));
console.log(`\n${api.P.on?'landed on '+api.bname(P.on):'still flying'} after ${realT.toFixed(0)}s real = ${(api.simT-t0).toFixed(0)}s sim (×${((api.simT-t0)/realT).toFixed(1)} average)`);
console.log('auto-brake callouts:',api.LOG.events.filter(e=>e.type==='warp_slow').map(e=>e.label).join(' | '));
ft.sort((a,b)=>a-b);console.log('frame CPU at warp: median',ft[ft.length>>1].toFixed(1),'ms p95',ft[Math.floor(ft.length*.95)].toFixed(1),'ms');
