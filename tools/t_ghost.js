const {load}=require('./stub');
const store={};
const {api,fr}=load(process.argv[2],'?level=1','P,hidePanel,land,LOG,GHOSTS:()=>GHOSTS,ghostNow,newJob,setCount:v=>lvlCount=v,setJob:j=>job=j,get job(){return job},get credits(){return credits},bodies:()=>bodies,step,T,get simT(){return simT}');
global.localStorage.setItem=(k,v)=>store[k]=v;
const {P}=api;fr(3);const B=api.bodies(),kettle=B.find(b=>b.name==='Kettle'),pip=B.find(b=>b.name==='Pip');
// run 1: pick up on Kettle, fly ~3s, deliver to Pip
const runOnce=(secs)=>{api.setJob({from:kettle,to:pip,ang:P.ang,state:'wait',value:20,t0:0,style:0,tNew:api.simT});P.on=kettle;fr(3);
  P.on=null;P.vx+=50;for(let i=0;i<secs*60;i++)fr(1);const g=api.ghostNow();P.on=null;api.land(pip);return g;};
runOnce(3);console.log('after run 1: ghosts saved',Object.keys(api.GHOSTS()),'t',api.GHOSTS()['L1:Kettle>Pip'].t.toFixed(1),'pts',api.GHOSTS()['L1:Kettle>Pip'].pts.length);
const g2=runOnce(5);console.log('run 2 (slower): ghost visible during run:',!!g2,'ghost done:',g2&&g2.done,' best kept:',api.GHOSTS()['L1:Kettle>Pip'].t.toFixed(1));
runOnce(1.5);console.log('run 3 (faster): new best:',api.GHOSTS()['L1:Kettle>Pip'].t.toFixed(1),' events:',api.LOG.events.filter(e=>e.type==='ghost_best').length,' persisted:',!!store['oc-ghosts']);
// express: free-play job generation alternates
api.setCount(5);const ex=[];for(let i=0;i<4;i++){api.newJob();ex.push(api.job.express);}console.log('free-play express pattern:',ex.join(','));
api.newJob();const j=api.job;j.express=true;j.state='carry';j.t0=api.simT;j.rec=[[0,0,0],[1,1,1],[2,2,2]];j.ang0=0;const c0=api.credits;P.on=null;api.land(j.to);console.log('express delivery pay:',api.credits-c0,'(value',j.value,')');
