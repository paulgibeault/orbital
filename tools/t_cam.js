const {load}=require('./stub');
const {api,fr,key}=load(process.argv[2],'?level=2','P,hidePanel,cam,FC,get warp(){return warp}');const {P}=api;api.hidePanel();fr(3);
key('keydown','Space');fr(48);key('keyup','Space');fr(20);key('keydown','KeyF');
for(let i=0;i<60*8;i++){fr(1);if(i%40===0&&api.cam.rip>0.4){const tgt=Math.atan2(api.cam.look[1],api.cam.look[0])+Math.PI/2;let d=(tgt-api.cam.rot)%(2*Math.PI);if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;
 const vel=Math.atan2(P.vy,P.vx),look=Math.atan2(api.cam.look[1],api.cam.look[0]);let dl=(look-vel)%(2*Math.PI);if(dl>Math.PI)dl-=2*Math.PI;if(dl<-Math.PI)dl+=2*Math.PI;
 console.log(`warp ${api.warp.toFixed(1)} rip ${api.cam.rip.toFixed(2)} spin ${api.cam.spin} · cam lag vs target ${(d*180/Math.PI).toFixed(0)}° · look vs velocity ${(dl*180/Math.PI).toFixed(0)}°`);}}
