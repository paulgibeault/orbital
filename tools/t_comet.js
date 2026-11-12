const {load}=require('./stub');
for (const lvl of ['?level=1','?level=2']) {
 const {api,fr}=load(process.argv[2],lvl,'P,hidePanel,bodies:()=>bodies,hub:()=>hub,placeBodies,cometState,forecast,get simT(){return simT},get level(){return level},pull,T');
 api.hidePanel();fr(2);const c=api.bodies().find(b=>b.comet),hub=api.hub();
 // orbit sanity over one period: min/max distance and speed
 const per=2*Math.PI/c.ell.n;let rmin=1e9,rmax=0,vmax=0;const st=[0,0,0,0];
 for(let t=0;t<per;t+=0.05){api.cometState(c,t,st);const r=Math.hypot(st[0]-hub.x,st[1]-hub.y);rmin=Math.min(rmin,r);rmax=Math.max(rmax,r);vmax=Math.max(vmax,Math.hypot(st[2],st[3]));}
 // velocity consistency: numeric derivative vs analytic
 api.cometState(c,10,st);const a=[...st];api.cometState(c,10.001,st);const nd=Math.hypot((st[0]-a[0])/0.001-a[2],(st[1]-a[1])/0.001-a[3]);
 // closest approach of comet to any planet over a period (visual overlap check)
 let closest=1e9,who='';for(let t=0;t<per;t+=0.1){api.placeBodies(t);for(const b of api.bodies()){if(b===c||b.ghost||b===hub)continue;const d=Math.hypot(b.x-c.x,b.y-c.y)-b.r-c.r;if(d<closest){closest=d;who=b.name||'rock';}}}
 console.log(`L${api.level} ${c.name}: period ${per.toFixed(0)}s · r ${rmin|0}–${rmax|0} · top speed ${vmax|0} px/s · velocity check err ${nd.toFixed(2)} · closest to a world ${closest|0}px (${who}) · mass ${c.M}`);
}
