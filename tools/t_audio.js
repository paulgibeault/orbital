// fake WebAudio to make sure every sound path runs without errors
const {load}=require('./stub');
const node=()=>new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='connect'?(()=>node()):(['frequency','gain','Q'].includes(k)?(t[k]={value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}}):()=>{})),set:(t,k,v)=>(t[k]=v,true)});
let made=0;class AC{constructor(){this.currentTime=0;this.sampleRate=8000;this.state='running';this.destination=node();}createGain(){made++;return node()}createOscillator(){made++;return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}createBuffer(c,n){return{getChannelData:()=>new Float32Array(n)}}resume(){}}
const {api,fr,key}=load(process.argv[2],'?level=2','P,hidePanel,SND');global.window.AudioContext=AC;
api.hidePanel();key('keydown','KeyN');key('keydown','KeyN');fr(2);key('keydown','Space');fr(45);key('keyup','Space');fr(30);key('keydown','Space');fr(10);key('keyup','Space');key('keydown','KeyF');fr(300);key('keyup','KeyF');fr(5);
console.log('audio ctx:',!!api.SND.ctx,'sound on:',api.SND.on,'nodes created:',made,'NaN?',isNaN(api.P.x));
