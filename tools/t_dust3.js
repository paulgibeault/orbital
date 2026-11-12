const {load}=require('./stub');
// a player who aims: try small launch tweaks (like nudging the charge/angle) and take the one whose FORECAST sweeps the most motes,
// then fly it for real and count — checks both achievable yield and that the forecast count matches reality
for (const lvl of ['?level=1','?level=2']) for (const si of [0,1,2]) {
  const {api,fr}=load(process.argv[2],lvl,'P,hidePanel,STREAMS:()=>STREAMS,hub:()=>hub,moteAng,forecast,get stardust(){return stardust},get simT(){return simT},get level(){return level},step,T');
  const {P,T}=api;api.hidePanel();fr(2);const st=api.STREAMS()[si],hub=api.hub(),R=st.R,am=api.moteAng(st,st.n>>1,api.simT);
  let best=null;
  for(const ang of [70,45,30,20]) for(const lead of [-0.06,-0.03,0,0.03,0.06]) for(const t0 of [2,4]) {
    const th=ang*Math.PI/180,rel=150,vr=rel*Math.sin(th),va=rel*Math.cos(th),vt=R*st.w,r0=R-vr*t0,a0=am+lead-(va*t0)/R;
    const s={x:hub.x+r0*Math.cos(a0),y:hub.y+r0*Math.sin(a0),vx:-(vt+va)*Math.sin(a0)+vr*Math.cos(a0),vy:(vt+va)*Math.cos(a0)+vr*Math.sin(a0)};
    const fc=api.forecast(s.x,s.y,s.vx,s.vy,10,false,null);const n=fc.motes.filter(m=>m[0]===si).length;if(!best||n>best.n)best={n,s};}
  Object.assign(P,best.s);P.on=null;P.pass=null;const c0=api.stardust;let t=0;while(t<10&&!P.on){api.step(T.step);t+=T.step;}
  console.log(`${lvl.slice(1)} stream ${si} (R=${R}): forecast said ${best.n}, actually collected ${api.stardust-c0} of 14`);
}
