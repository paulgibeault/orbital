const {load}=require('./stub');
const {api,fr,key}=load(process.argv[2],'?level=2','P,hidePanel,LOG,get chroma(){return chroma},get warp(){return warp}');const {P}=api;api.hidePanel();fr(2);
key('keydown','Space');fr(48);key('keyup','Space');fr(30);
for(let i=0;i<8;i++){key('keydown','KeyW');key('keydown','Space');fr(6);key('keyup','Space');key('keyup','KeyW');fr(2);}
console.log('kicks fired:',api.LOG.events.filter(e=>e.type==='kick').length,'of 8 · kicks left',P.kicks);
key('keydown','KeyF');let mx=0;for(let i=0;i<60*6;i++){fr(1);mx=Math.max(mx,api.chroma);}console.log('peak chroma at warp:',mx.toFixed(2),'(warp',api.warp.toFixed(1)+')');
