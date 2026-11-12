const {load}=require('./stub');
const cases=[['?level=2','Ferry'],['?level=2','Lantern'],['?level=2','Tern'],['?level=1','Brindle'],['?level=1','Outpost']];
for (const [lvl,name] of cases) { const row=[];
 for (const lead of [30,60,90,120,-30,-60,-90]) {
  const {api,fr}=load(process.argv[2],lvl,'P,hidePanel,bodies:()=>bodies,hub:()=>hub,T,step,kick,keys,forecast,oscOrbit,phaseInfo,anchorCandidates,anchorPress,setJob:j=>job=j,get simT(){return simT}');
  const {P,T}=api;api.hidePanel();fr(2);const tb=api.bodies().find(b=>b.name===name),hub=api.hub();
  api.setJob({from:tb,to:tb,state:'carry',ang:0,t0:0,tNew:0,style:0,value:0});
  const th=tb.phase+tb.w*api.simT-lead*Math.PI/180,R=tb.R,v=R*tb.w;
  P.on=null;P.x=hub.x+R*Math.cos(th);P.y=hub.y+R*Math.sin(th);P.vx=-v*Math.sin(th);P.vy=v*Math.cos(th);P.kicks=T.kickMax;P.anchorLock=false;
  const ph=api.phaseInfo(tb,api.oscOrbit());const H=ph?Math.min(130,Math.max(T.forecastH,1.25*Math.max(ph.Ty,ph.Tt))):T.forecastH;
  // charge like a player: power climbs 20%→100%; release at the first power whose preview is green
  api.keys[ph&&ph.ahead?'s':'w']=true;let pow=null;
  for(let p=T.kickMinPow;p<=1.0001;p+=0.025){const k=[0,0];const ax=(()=>{const rx=P.vx-hub.vx,ry=P.vy-hub.vy,L=Math.hypot(rx,ry);return [rx/L,ry/L];})();const sgn=ph&&ph.ahead?-1:1;
    const fc=api.forecast(P.x,P.y,P.vx+sgn*ax[0]*T.kick*p,P.vy+sgn*ax[1]*T.kick*p,H,false,null);if(fc.ca&&fc.ca.d<=T.anchorRange){pow=p;break;}}
  if(pow!==null)api.kick(pow);api.keys.s=api.keys.w=false;
  let t=0;while(t<300&&!P.on){if(!api.keys.heavy&&api.anchorCandidates().some(x=>x[0]===tb)){P.anchorPick=tb;P.anchor=tb;api.keys.heavy=true;api.anchorPress();}api.step(T.step);t+=T.step;}
  row.push(`${lead>0?'+':''}${lead}°:${P.on===tb?'✓'+t.toFixed(0)+'s':(pow===null?'no-green':'✗')}${pow!==null?'('+Math.round(pow*100)+'%)':''}`);
 }
 console.log(name.padEnd(8),row.join('  '));
}
