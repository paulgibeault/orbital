const {load}=require('./stub');const P0=process.argv[2];const {performance:pf}=require('perf_hooks');
// 1) L1 → L2 flow via deliveries
{ const {api,fr,key}=load(P0,'','P,land,LOG,hidePanel,setCount:v=>lvlCount=v,get job(){return job},get level(){return level},get paused(){return paused},get guideIdx(){return guideIdx}');
  fr(5);api.setCount(4);const j=api.job;j.state='carry';api.P.on=null;api.land(j.to);fr(2);
  console.log('L1 complete → panel paused:',api.paused);key('keydown','Enter');fr(2);
  console.log('Enter → level',api.level,'Flight School page',api.guideIdx);key('keydown','Escape');fr(2);console.log('Esc → paused',api.paused,'job',api.job.from.name+'→'+api.job.to.name);
  const d=api.LOG.events.find(e=>e.type==='deliver');console.log('delivery event stars:',d.stars,'kicks',d.kicks,'slings',d.slings); }
// 2) forecast exactness still holds in L2
{ const {api,fr,key}=load(P0,'?level=2','P,FC,hidePanel,get simT(){return simT}');api.hidePanel();const {P}=api;
  key('keydown','Space');fr(48);key('keyup','Space');fr(30);const fc=api.FC.main,t0=api.simT;let worst=0;
  for(let i=0;i<60*15;i++){fr(1);const t=api.simT-t0;let best=null;for(const p of fc.pts)if(!best||Math.abs(p[2]-t)<Math.abs(best[2]-t))best=p;if(best&&Math.abs(best[2]-t)<0.02)worst=Math.max(worst,Math.hypot(best[0]-P.x,best[1]-P.y));}
  console.log('forecast vs actual over 15s, worst gap (sampling-limited):',worst.toFixed(1),'px'); }
// 3) frame cost + texture gen
{ const t=pf.now();const {api,fr,key}=load(P0,'?level=2','P,hidePanel,bodies:()=>bodies');api.hidePanel();fr(1);const tex=pf.now()-t;
  key('keydown','Space');fr(45);key('keyup','Space');const ts=[];for(let i=0;i<300;i++){const a=pf.now();fr(1);ts.push(pf.now()-a);}ts.sort((a,b)=>a-b);
  console.log('L2 boot incl. textures:',tex.toFixed(0),'ms · frame CPU median',ts[150].toFixed(1),'ms p95',ts[285].toFixed(1),'ms (canvas stubbed)'); }
