const {load}=require('./stub');
// fly a fast pass by Anvil and check bullet-time engages, the perfect window opens, and a kick there is boosted
const {api,fr,key}=load(process.argv[2],'?level=2','P,LOG,hidePanel,bodies:()=>bodies,bulletTime,get btAmt(){return btAmt},get simT(){return simT},T');
const {P}=api;api.hidePanel();fr(2);const an=api.bodies().find(b=>b.name==='Anvil');
// aim a straight shot that grazes Anvil at ~60 px altitude, 300 px/s relative
const R=an.r+60;P.on=null;P.x=an.x-600;P.y=an.y-R;P.vx=an.vx+300;P.vy=an.vy;P.kicks=1;P.pass=null;P.skipBody=null;
let sawBT=false,sawPerfect=false,kicked=false,realT=0,simStart=api.simT,minScale=1;
for(let i=0;i<60*8;i++){const s0=api.simT;fr(1);realT+=1/60;const bt=api.bulletTime();if(bt){sawBT=true;minScale=Math.min(minScale,(api.simT-s0)*60);}
 if(bt&&bt.perfect){sawPerfect=true;if(!kicked){key('keydown','KeyW');key('keydown','Space');key('keyup','Space');key('keyup','KeyW');kicked=true;}}}
const pk=api.LOG.events.find(e=>e.type==='perfect_kick'),k=api.LOG.events.find(e=>e.type==='kick');
console.log('bullet-time engaged:',sawBT,' slowest time scale:',minScale.toFixed(2),' perfect window:',sawPerfect,' perfect kick:',!!pk,pk?'pow '+pk.pow:'', ' kick pow logged',k&&k.pow);
console.log('flyby result:',JSON.stringify(api.LOG.events.filter(e=>e.type==='flyby').map(e=>e.body+' '+e.dv)));
