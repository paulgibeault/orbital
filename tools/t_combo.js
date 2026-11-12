const {load}=require('./stub');
const {api,fr}=load(process.argv[2],'?level=2','P,hidePanel,addStyle,comboHit,COMBO,LOG,get credits(){return credits},step,T,land,bodies:()=>bodies');
const {P}=api;api.hidePanel();fr(2);P.on=null;P.vx=300;
const c0=api.credits;api.addStyle(5,'graze ✦','#fff');api.addStyle(10,'Slingshot! Anvil +80','#fff');api.comboHit('stardust',0.5);api.comboHit('stardust',0.5);api.addStyle(20,'PERFECT KICK at Anvil','#fff');
console.log(`after graze+sling+2 motes+perfect: hits ${api.COMBO.hits}, mult ×${api.COMBO.mult.toFixed(1)}, combo pts ${api.COMBO.pts}, credits +${api.credits-c0} (unmultiplied would be 35)`);
for(let i=0;i<240*11;i++)api.step(api.T.step);
console.log('after 11 s idle → combo ended:',api.COMBO.hits===0,' event',JSON.stringify(api.LOG.events.filter(e=>e.type==='combo_end').pop()));
api.addStyle(5,'graze ✦','#fff');api.addStyle(5,'graze ✦','#fff');api.addStyle(5,'graze ✦','#fff');api.land(api.bodies().find(b=>b.name==='Ferry'));
console.log('landing ends combo:',api.COMBO.hits===0,JSON.stringify(api.LOG.events.filter(e=>e.type==='combo_end').pop()));
