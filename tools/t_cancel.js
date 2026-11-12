const {load}=require('./stub');
const {api,fr,key}=load(process.argv[2],'?level=2','P,LOG,hidePanel,keysHTML,bname');const {P}=api;api.hidePanel();fr(5);
// jump cancel
key('keydown','Space');fr(30);const ch=P.charge.toFixed(2);console.log('controls show cancel while charging:',/cancel jump/.test(api.keysHTML()));
key('keydown','Escape');key('keyup','Space');fr(30);console.log(`jump: charged ${ch} → Esc → still on ${api.bname(P.on)} (charging ${P.charging})`);
// kick cancel
key('keydown','Space');fr(48);key('keyup','Space');fr(60);const k0=P.kicks,v0=[P.vx,P.vy];
key('keydown','KeyS');key('keydown','Space');fr(20);key('keydown','Backspace');key('keyup','Space');key('keyup','KeyS');fr(1);
console.log(`kick: kicks ${k0} → ${P.kicks} after Backspace-cancel (should be unchanged); in flight ${!P.on}`);
key('keydown','Space');fr(10);key('keyup','Space');fr(1);console.log(`real kick afterwards: kicks → ${P.kicks}`);
console.log('cancel events:',JSON.stringify(api.LOG.events.filter(e=>e.type==='cancel')));
