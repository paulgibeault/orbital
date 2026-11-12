const {load}=require('./stub');const P0=process.argv[2];
for(const lvl of ['','?level=2']){
 const {api,fr,key,els}=load(P0,lvl,'P,FC,LOG,hidePanel,showGuide,coachText,missionHTML,instrHTML,keysHTML,GUIDE,get guideIdx(){return guideIdx},get paused(){return paused},get level(){return level},get themeName(){return themeName}');
 const {P}=api;fr(3);
 console.log(`L${api.level}: guide open=${api.guideIdx} paused=${api.paused}`);
 if(api.guideIdx!==null){for(let i=0;i<9;i++){key('keydown','ArrowRight');}console.log('  after 9× →: page',api.guideIdx);key('keydown','Enter');console.log('  Enter on last page → closed:',api.guideIdx===null,'paused',api.paused);}
 fr(20);console.log('  coach (ground):',api.coachText().replace(/<[^>]+>/g,''));
 key('keydown','Space');fr(45);console.log('  coach (charging):',api.coachText().replace(/<[^>]+>/g,''));
 console.log('  instr (charging):',api.instrHTML().replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,200));
 key('keyup','Space');fr(240);console.log('  coach (flight):',api.coachText().replace(/<[^>]+>/g,''));
 console.log('  mission:',api.missionHTML().replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,160));
 key('keydown','KeyT');console.log('  theme →',api.themeName);key('keydown','KeyB');console.log('  B → guide',api.guideIdx);key('keydown','Escape');
 key('keydown','KeyW');key('keydown','Space');key('keyup','Space');key('keyup','KeyW');fr(5);
 const ev=api.LOG.events;console.log('  events:',[...new Set(ev.map(e=>e.type))].join(','),' NaN?',isNaN(P.x));
}
