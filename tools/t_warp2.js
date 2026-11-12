const {load}=require('./stub');
for (const assistOn of [false,true]) {
 const {api,fr,key}=load(process.argv[2],'?level=2','P,LOG,hidePanel,nextEvent,cam,w2s,get warp(){return warp},get simT(){return simT},get assist(){return assist}');
 const {P}=api;api.hidePanel();fr(3);if(assistOn)key('keydown','KeyG');
 key('keydown','Space');fr(48);key('keyup','Space');fr(20);key('keydown','KeyF');
 let maxW=0,warpAtEvent=[],shipY=[],upErr=[];const t0=api.simT;
 for(let i=0;i<60*25&&!P.on;i++){fr(1);maxW=Math.max(maxW,api.warp);const ne=api.nextEvent();if(ne&&ne.t<0.3)warpAtEvent.push(api.warp.toFixed(1));
  if(api.cam.rip>0.9){const [sx,sy]=api.w2s(P.x,P.y);shipY.push(sy/800);
   // where does the line of travel point on screen? (look vector rotated into screen space)
   const c=Math.cos(-api.cam.rot),s=Math.sin(-api.cam.rot),lx=api.cam.look[0]*c-api.cam.look[1]*s,ly=api.cam.look[0]*s+api.cam.look[1]*c;upErr.push(Math.abs(Math.atan2(lx,-ly))*180/Math.PI);}}
 key('keyup','KeyF');const ev=api.LOG.events;const med=a=>a.length?a.slice().sort((x,y)=>x-y)[a.length>>1]:NaN;
 console.log(`assist ${assistOn?'ON ':'OFF'}: max warp ×${maxW.toFixed(1)} · warp when events arrived [${[...new Set(warpAtEvent)].slice(0,6).join(', ')}] · warnings ${ev.filter(e=>e.type==='warp_warn').length} · auto-brakes ${ev.filter(e=>e.type==='warp_slow').length}`);
 console.log(`   chase cam: ship at ${(100*med(shipY)).toFixed(0)}% of screen height (median) · line of travel within ${med(upErr).toFixed(0)}° of straight up`);
}
// chase cam without warp: a fast slingshot at raw speed
{ const {api,fr}=load(process.argv[2],'?level=2','P,hidePanel,cam,bodies:()=>bodies');const {P}=api;api.hidePanel();fr(2);
  const an=api.bodies().find(b=>b.name==='Anvil');P.on=null;P.x=an.x-700;P.y=an.y-an.r-80;P.vx=an.vx+520;P.vy=an.vy;P.pass=null;P.skipBody=null;
  let mx=0;for(let i=0;i<120;i++){fr(1);mx=Math.max(mx,api.cam.rip);}console.log('no warp, 520 px/s flyby → chase cam engaged:',mx.toFixed(2)); }
