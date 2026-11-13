var h={};h.BRAND={game:"STAFF ASSAULT",sub:"Killer Row",alarm:"Body Alarm"};h.CREW={bernardo:"Bernardo",dustin:"Dustin Davis",caleb:"Caleb Alaniz",halley:"Sgt. Halley Munoz",halleyShort:"Sgt. Munoz",ricardo:"Counselor Ricardo Alaniz",caughren:"C/O Caughren",bingham:"Counselor Bingham"};h.TAU=Math.PI*2;h.rand=(i,e)=>i+Math.random()*(e-i);h.randi=(i,e)=>Math.floor(i+Math.random()*(e-i+1));h.pick=i=>i[Math.random()*i.length|0];h.clamp=(i,e,t)=>i<e?e:i>t?t:i;h.lerp=(i,e,t)=>i+(e-i)*t;h.angDiff=(i,e)=>{let t=(e-i)%h.TAU;return t>Math.PI&&(t-=h.TAU),t<-Math.PI&&(t+=h.TAU),t};h.store={get(i,e){try{let t=localStorage.getItem(i);return t==null?e:JSON.parse(t)}catch{return e}},set(i,e){try{localStorage.setItem(i,JSON.stringify(e))}catch{}}};var xp=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches;h.settings=Object.assign({quality:xp?"medium":"high",gore:!0,cuss:!0,muted:!1,pace:.8},h.store.get("mo_settings",{}));h.censor=i=>h.settings.cuss?i:i.replace(/\b(f)uck|\b(s)hit|\b(b)itch|\b(a)ss\b/gi,e=>e[0]+"*".repeat(e.length-1));h.PACE=()=>h.settings.pace||.8;h.board={list(){let i=h.store.get("sa_board",[]);return Array.isArray(i)?i:[]},record(i){let e=this.list(),t=String(i.name).toLowerCase(),n=e.findIndex(r=>String(r.name).toLowerCase()===t),s=(r,a)=>r.area>a.area||r.area===a.area&&r.score>a.score;n<0?e.push(i):s(i,e[n])&&(e[n]=i),e.sort((r,a)=>a.area-r.area||a.score-r.score),h.store.set("sa_board",e.slice(0,15))}};h.saveSettings=()=>h.store.set("mo_settings",h.settings);h.cleanName=i=>String(i||"").replace(/[\u0000-\u001f\u007f{}<>]/g,"").trim().slice(0,14)||"Rookie";h.t=(i,e)=>String(i).replace(/\{hero\}/g,e||"Rookie").replace(/\{HERO\}/g,(e||"Rookie").toUpperCase()).replace(/\{(bernardo|dustin|caleb|halley|halleyShort)\}/g,(t,n)=>h.CREW[n]);h.grid={cell:2,map:new Map,used:[],clear(){for(let i of this.used)i.length=0;this.used.length=0},key(i,e){return(i+2048)*8192+(e+2048)},insert(i){let e=this.key(Math.floor(i.x/this.cell),Math.floor(i.z/this.cell)),t=this.map.get(e);t||(t=[],this.map.set(e,t)),t.length===0&&this.used.push(t),t.push(i)},query(i,e,t,n){n.length=0;let s=this.cell,r=Math.floor((i-t)/s),a=Math.floor((i+t)/s),o=Math.floor((e-t)/s),l=Math.floor((e+t)/s);for(let c=r;c<=a;c++)for(let u=o;u<=l;u++){let f=this.map.get(this.key(c,u));if(f)for(let d=0;d<f.length;d++)n.push(f[d])}return n}};h.QUALITY={low:{pixel:.75,shadows:!1,shadowMap:0,bloom:!1,ao:!1,grade:!1,dust:0,particles:500,decals:150},medium:{pixel:1,shadows:!0,shadowMap:1024,bloom:!1,ao:!1,grade:!0,dust:120,particles:900,decals:250},high:{pixel:1,shadows:!0,shadowMap:2048,bloom:!0,ao:!1,grade:!0,dust:250,particles:1500,decals:400},ultra:{pixel:1.25,shadows:!0,shadowMap:4096,bloom:!0,ao:!0,grade:!0,dust:400,particles:2500,decals:600}};h.QUALITY_ORDER=["low","medium","high","ultra"];h.pads=function(){try{return navigator.getGamepads&&navigator.getGamepads()||[]}catch{return[]}};var ee={ctx:null,master:null,sfx:null,mus:null,noiseBuf:null,last:{}};h.audio=ee;var ra=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,yp=.55,fu=.34,Zo=()=>h.settings.audio||(h.settings.muted?"off":"all");ee.init=function(){if(ee.ctx){ee.wake();return}let i=window.AudioContext||window.webkitAudioContext;if(!i)return;try{ee.ctx=new i({latencyHint:"interactive"})}catch{try{ee.ctx=new i}catch{return}}try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}let e=ee.ctx,t=e.createDynamicsCompressor();t.threshold.value=-14,t.ratio.value=5,t.attack.value=.004,t.release.value=.2,ee.master=e.createGain(),ee.master.gain.value=1,ee.sfx=e.createGain(),ee.mus=e.createGain(),ee.sfx.connect(ee.master),ee.mus.connect(ee.master),ee.master.connect(t),t.connect(e.destination),ee.echo=e.createDelay(1.5),ee.echoFb=e.createGain(),ee.echoFb.gain.value=.28;let n=e.createBiquadFilter();n.type="lowpass",n.frequency.value=2400,ee.echoIn=e.createGain(),ee.echoIn.gain.value=.35,ee.echoIn.connect(ee.echo),ee.echo.connect(n),n.connect(ee.echoFb),ee.echoFb.connect(ee.echo),n.connect(ee.mus);let s=e.sampleRate*2;ee.noiseBuf=e.createBuffer(1,s,e.sampleRate);let r=ee.noiseBuf.getChannelData(0);for(let a=0;a<s;a++)r[a]=Math.random()*2-1;try{let a=e.createBufferSource();a.buffer=e.createBuffer(1,1,22050),a.connect(e.destination),a.start(0)}catch{}ee.applyMode(),qe.timer=setInterval(Ep,25),qe.want&&ee.music(qe.want,!0)};ee.wake=function(){ee.ctx&&ee.ctx.state!=="running"&&!document.hidden&&ee.ctx.resume().catch(()=>{})};var vp=()=>ee.init();["pointerdown","touchend","keydown","mousedown"].forEach(i=>addEventListener(i,vp,{passive:!0}));document.addEventListener("visibilitychange",()=>{ee.ctx&&(document.hidden?ee.ctx.suspend().catch(()=>{}):ee.wake())});ee.applyMode=function(){if(!ee.ctx)return;let i=Zo(),e=ee.ctx.currentTime;ee.sfx.gain.setTargetAtTime(i==="off"?0:yp,e,.05),ee.mus.gain.setTargetAtTime(i==="all"?qe.ducked?fu*.35:fu:0,e,.08)};ee.setMode=function(i){h.settings.audio=i,h.settings.muted=i==="off",h.saveSettings(),ee.applyMode()};ee.setMuted=function(i){ee.setMode(i?"off":"all")};ee.duck=function(i){qe.ducked=!!i,ee.applyMode()};function du(i,e,t,n,s,r){i.gain.setValueAtTime(1e-4,e),i.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),e+s),r&&i.gain.setValueAtTime(Math.max(2e-4,n),e+Math.max(s,t-r)),i.gain.exponentialRampToValueAtTime(1e-4,e+t)}function tt(i,e,t,n=ee.sfx){let s=ee.ctx,r=s.createBufferSource();r.buffer=ee.noiseBuf,r.playbackRate.value=t.rate||1;let a=s.createBiquadFilter();a.type=t.type||"bandpass",a.frequency.setValueAtTime(t.freq||1e3,i),t.freqEnd&&a.frequency.exponentialRampToValueAtTime(t.freqEnd,i+e),a.Q.value=t.q||1;let o=s.createGain();du(o,i,e,t.gain||.3,t.attack||.002),r.connect(a),a.connect(o),o.connect(n),r.start(i,Math.random()*1.5),r.stop(i+e+.05)}function Ue(i,e,t,n=ee.sfx){let s=ee.ctx,r=s.createOscillator();if(r.type=t.type||"sine",r.frequency.setValueAtTime(t.freq||440,i),t.freqEnd&&r.frequency.exponentialRampToValueAtTime(t.freqEnd,i+(t.glide||e)),t.detune&&(r.detune.value=t.detune),t.vib){let l=s.createOscillator(),c=s.createGain();l.frequency.value=t.vib,c.gain.value=t.vibAmt||12,l.connect(c),c.connect(r.detune),l.start(i+.15),l.stop(i+e+.05)}let a=s.createGain();du(a,i,e,t.gain||.2,t.attack||.004,t.release);let o=r;if(t.lp){let l=s.createBiquadFilter();l.type="lowpass",l.Q.value=t.q||1,l.frequency.setValueAtTime(t.lp,i),t.lpEnd&&l.frequency.exponentialRampToValueAtTime(t.lpEnd,i+(t.lpTime||e)),r.connect(l),o=l}o.connect(a),a.connect(n),t.echo&&ee.echoIn&&a.connect(ee.echoIn),r.start(i),r.stop(i+e+.05)}var aa=i=>440*Math.pow(2,(i-69)/12),pu={pop:{gap:45,f:(i,e)=>{tt(i,.05,{freq:2600,q:1.5,gain:.28*e}),Ue(i,.07,{type:"square",freq:520,freqEnd:150,gain:.1*e,lp:2e3}),tt(i+.01,.09,{type:"highpass",freq:5e3,gain:.08*e})}},thoomp:{gap:120,f:(i,e)=>{Ue(i,.3,{freq:120,freqEnd:40,gain:.75*e}),tt(i,.22,{type:"lowpass",freq:900,freqEnd:150,gain:.45*e}),tt(i,.03,{type:"highpass",freq:3e3,gain:.3*e})}},shotgun:{gap:150,f:(i,e)=>{tt(i,.4,{type:"lowpass",freq:3800,freqEnd:260,gain:.85*e}),Ue(i,.18,{freq:85,freqEnd:32,gain:.7*e}),tt(i,.025,{type:"highpass",freq:2500,gain:.5*e}),tt(i+.3,.035,{type:"highpass",freq:3200,q:2,gain:.22*e}),tt(i+.38,.05,{freq:1500,q:3,gain:.25*e})}},rifle:{gap:60,f:(i,e)=>{tt(i,.05,{type:"highpass",freq:1800,gain:.55*e}),tt(i,.16,{freq:700,freqEnd:250,q:.8,gain:.3*e}),Ue(i,.07,{freq:150,freqEnd:55,gain:.4*e})}},beam:{gap:110,f:(i,e)=>{Ue(i,.12,{type:"sawtooth",freq:1400,freqEnd:2200,gain:.04*e,lp:3e3}),tt(i,.1,{type:"highpass",freq:6e3,gain:.07*e})}},swing:{gap:60,f:(i,e)=>tt(i,.17,{freq:1100,freqEnd:260,q:.9,gain:.28*e})},crack:{gap:55,f:(i,e)=>{tt(i,.05,{type:"highpass",freq:1800,gain:.55*e}),Ue(i,.13,{freq:110,freqEnd:42,gain:.5*e}),tt(i,.09,{freq:450,q:1.2,gain:.3*e})}},clock:{gap:90,f:(i,e)=>{[1568,2349,3136].forEach((t,n)=>Ue(i,.9-n*.2,{freq:t,gain:(.16-n*.04)*e,attack:.002})),Ue(i,.25,{freq:90,freqEnd:40,gain:.7*e}),tt(i,.12,{freq:900,q:2,gain:.4*e})}},slam:{gap:300,f:(i,e)=>{Ue(i,.6,{freq:70,freqEnd:28,gain:.9*e}),tt(i,.5,{type:"lowpass",freq:1500,freqEnd:120,gain:.6*e})}},spray:{gap:90,f:(i,e)=>tt(i,.16,{type:"highpass",freq:2800,gain:.13*e,attack:.02})},splat:{gap:50,f:(i,e)=>tt(i,.18,{freq:400,freqEnd:120,q:2,gain:.35*e})},thud:{gap:35,f:(i,e)=>{Ue(i,.12,{freq:140,freqEnd:50,gain:.45*e}),tt(i,.08,{freq:500,gain:.25*e})}},hurt:{gap:180,f:(i,e)=>{Ue(i,.18,{type:"sawtooth",freq:230,freqEnd:110,gain:.13*e,lp:1400}),tt(i,.08,{freq:800,gain:.2*e})}},dash:{gap:100,f:(i,e)=>tt(i,.22,{freq:1600,freqEnd:400,gain:.22*e})},boom:{gap:80,f:(i,e)=>{tt(i,.7,{type:"lowpass",freq:1600,freqEnd:90,gain:.8*e}),Ue(i,.45,{freq:95,freqEnd:28,gain:.8*e}),tt(i+.05,.9,{type:"lowpass",freq:500,freqEnd:60,gain:.3*e})}},zap:{gap:90,f:(i,e)=>{Ue(i,.18,{type:"sawtooth",freq:1800,freqEnd:600,gain:.12*e}),tt(i,.15,{type:"highpass",freq:4e3,gain:.25*e})}},pickup:{gap:60,f:(i,e)=>{Ue(i,.08,{type:"triangle",freq:660,gain:.2*e}),Ue(i+.07,.14,{type:"triangle",freq:990,gain:.2*e})}},zyn:{gap:100,f:(i,e)=>{tt(i,.03,{type:"highpass",freq:4e3,gain:.3*e}),tt(i+.06,.5,{type:"highpass",freq:5e3,gain:.1*e,attack:.05}),Ue(i+.04,.2,{type:"triangle",freq:880,freqEnd:1320,gain:.15*e})}},chew:{gap:100,f:(i,e)=>{tt(i,.05,{freq:600,q:2,gain:.3*e}),tt(i+.18,.14,{freq:1800,freqEnd:600,q:1.5,gain:.35*e})}},gold:{gap:300,f:(i,e)=>[1047,1319,1568,2093,2637].forEach((t,n)=>Ue(i+n*.06,.4,{type:"triangle",freq:t,gain:.14*e,echo:!0}))},siren:{gap:2500,f:(i,e)=>{for(let t=0;t<4;t++)Ue(i+t*.5,.25,{type:"square",freq:980,gain:.08*e,lp:3e3}),Ue(i+t*.5+.25,.25,{type:"square",freq:740,gain:.08*e,lp:3e3})}},radio:{gap:300,f:(i,e)=>{tt(i,.09,{freq:1800,q:4,gain:.08*e}),Ue(i,.05,{type:"square",freq:1400,gain:.04*e})}},alarm:{gap:900,f:(i,e)=>{for(let t=0;t<3;t++)Ue(i+t*.28,.24,{type:"square",freq:880,freqEnd:660,gain:.07*e,lp:2500})}},scare:{gap:600,f:(i,e)=>{[1180,1250,1325,1405].forEach(t=>Ue(i,.9,{type:"sawtooth",freq:t,freqEnd:t*.7,gain:.05*e,lp:4e3})),Ue(i,.5,{freq:55,gain:.7*e}),tt(i,.4,{freq:3e3,freqEnd:900,q:3,gain:.25*e})}},count:{gap:400,f:(i,e)=>[784,1047,1319].forEach((t,n)=>Ue(i+n*.08,.3,{type:"triangle",freq:t,gain:.16*e}))},win:{gap:900,f:(i,e)=>[523,659,784,1046].forEach((t,n)=>Ue(i+n*.12,.3,{type:"triangle",freq:t,gain:.2*e}))}};ee.play=function(i,e=1){if(!ee.ctx||Zo()==="off"||ee.ctx.state!=="running")return;let t=pu[i];if(!t)return;let n=performance.now();ee.last[i]&&n-ee.last[i]<t.gap||(ee.last[i]=n,t.f(ee.ctx.currentTime+.005,e))};var bn={kick:(i,e,t,n)=>{Ue(i,.32,{freq:165,freqEnd:42,glide:.12,gain:.95*n},ee.mus),tt(i,.02,{type:"highpass",freq:2500,gain:.12*n},ee.mus)},heart:(i,e,t,n)=>{Ue(i,.25,{freq:80,freqEnd:38,gain:.85*n,lp:300},ee.mus)},snare:(i,e,t,n)=>{tt(i,.2,{freq:1900,q:.7,gain:.5*n},ee.mus),Ue(i,.1,{type:"triangle",freq:200,freqEnd:150,gain:.3*n},ee.mus)},clap:(i,e,t,n)=>{for(let s=0;s<3;s++)tt(i+s*.011,.12-s*.02,{freq:1300,q:1.1,gain:.42*n},ee.mus)},hat:(i,e,t,n)=>tt(i,.045,{type:"highpass",freq:7600,gain:.17*n},ee.mus),ohat:(i,e,t,n)=>tt(i,.26,{type:"highpass",freq:7e3,gain:.13*n},ee.mus),crash:(i,e,t,n)=>tt(i,1.6,{type:"highpass",freq:4500,gain:.16*n,attack:.003},ee.mus),tom:(i,e,t,n)=>{Ue(i,.4,{freq:e||110,freqEnd:(e||110)*.55,gain:.75*n},ee.mus),tt(i,.05,{freq:600,gain:.15*n},ee.mus)},bass:(i,e,t,n)=>{Ue(i,t,{type:"sawtooth",freq:e,gain:.32*n,lp:1400,lpEnd:220,lpTime:t*.8,q:5},ee.mus),ra||Ue(i,t,{type:"square",freq:e/2,gain:.12*n,lp:400},ee.mus)},sub:(i,e,t,n)=>{Ue(i,t,{freq:e*1.5,freqEnd:e,glide:.06,gain:.7*n,release:.12},ee.mus),Ue(i,t,{type:"triangle",freq:e*2,gain:.08*n,lp:600},ee.mus)},chipb:(i,e,t,n)=>Ue(i,t*.8,{type:"square",freq:e,gain:.13*n,lp:2500},ee.mus),stab:(i,e,t,n)=>[1,1.5,2].forEach(s=>Ue(i,Math.min(t,.22),{type:"sawtooth",freq:e*s,gain:.08*n,lp:2600,lpEnd:500,q:2},ee.mus)),pluck:(i,e,t,n)=>Ue(i,.3,{type:"triangle",freq:e,gain:.13*n,lp:3e3,lpEnd:600,echo:!0},ee.mus),brass:(i,e,t,n)=>{let s={type:"sawtooth",freq:e,gain:.11*n,attack:.03,lp:600,lpEnd:2600,lpTime:.08,q:2,vib:5.5,vibAmt:8,echo:!0};Ue(i,t,s,ee.mus),ra||Ue(i,t,Object.assign({},s,{detune:9,gain:.07*n}),ee.mus)},chip:(i,e,t,n)=>Ue(i,t*.9,{type:"square",freq:e,gain:.09*n,vib:6,vibAmt:10,echo:!0,lp:5e3},ee.mus),lead:(i,e,t,n)=>Ue(i,t,{type:"sawtooth",freq:e,gain:.08*n,lp:3500,q:3,vib:5,vibAmt:6,echo:!0},ee.mus),bell:(i,e,t,n)=>{Ue(i,2.2,{freq:e,gain:.12*n,echo:!0},ee.mus),Ue(i,1.2,{freq:e*2.76,gain:.04*n},ee.mus)},pad:(i,e,t,n)=>e.forEach(s=>{Ue(i,t,{type:"sawtooth",freq:s,gain:.035*n,attack:t*.3,release:t*.3,lp:900,echo:!0,detune:-6},ee.mus),ra||Ue(i,t,{type:"sawtooth",freq:s,gain:.03*n,attack:t*.3,release:t*.3,lp:900,detune:7},ee.mus)}),choir:(i,e,t,n)=>e.forEach(s=>{Ue(i,t,{type:"triangle",freq:s,gain:.07*n,attack:t*.35,release:t*.35,vib:4.5,vibAmt:14,echo:!0},ee.mus),ra||Ue(i,t,{type:"triangle",freq:s*2,gain:.02*n,attack:t*.4,release:t*.3,vib:4,vibAmt:10},ee.mus)}),drone:(i,e,t,n)=>{Ue(i,t,{type:"sawtooth",freq:e[0]/2,gain:.08*n,attack:t*.4,release:t*.4,lp:260},ee.mus),Ue(i,t,{freq:e[0],gain:.08*n,attack:t*.3,release:t*.4,vib:.3,vibAmt:25},ee.mus)},scrape:(i,e,t,n)=>tt(i,1.4,{freq:2600,freqEnd:700,q:9,gain:.08*n,attack:.4},ee.mus)},_p={minor:[0,2,3,5,7,8,10],harm:[0,2,3,5,7,8,11],major:[0,2,4,5,7,9,11],phryg:[0,1,3,5,7,8,10]},$o={menu:{bpm:86,root:45,scale:"minor",swing:.14,chords:[0,5,2,6],layers:[{i:"kick",p:"x.....x...x.....",v:.8},{i:"snare",p:"....x.......x...",v:.55},{i:"hat",p:"x.x.x.x.x.x.x.xx",v:.6},{i:"bass",bass:"x.....x...5....."},{i:"pad",chord:!0,v:.9},{i:"pluck",arp:"..x...x...x...x.",oct:2,v:.8}]},lot:{bpm:124,root:40,scale:"minor",chords:[0,0,5,6],layers:[{i:"kick",p:"x...x...x...x..."},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.7},{i:"bass",bass:"x.x.x.x.x.x.o.x."},{i:"pad",chord:!0,v:.6},{i:"snare",p:"....x.......x...",min:1},{i:"stab",p:"x......x..x.....",oct:1,min:1},{i:"hat",p:".x.x.x.x.x.x.x.x",v:.4,min:2},{i:"crash",p:"x...............",every:4,min:2},{i:"brass",mel:["7...6...4...6...","7...9...7.6.4...","7...6...4...6...","a...9...7...6..."],oct:1,min:2}]},tier:{bpm:140,root:36,scale:"phryg",chords:[0,0,5,4],layers:[{i:"kick",p:"x......x..x....."},{i:"clap",p:"........x......."},{i:"sub",bass:"x......x..x.....",len:3},{i:"bell",mel:["4.......3.......","4.......5...4..."],oct:2,v:.8},{i:"hat",p:"x.x.x.x.x.x.xxxx",min:1},{i:"pad",chord:!0,v:.5,min:1},{i:"hat",p:"xxxxxxx.x.xxxxxx",v:.5,min:2},{i:"ohat",p:"......o.......o.",min:2},{i:"lead",mel:["0.0.3.0.5.4.3.2.","0.0.3.0.7.5.4..."],oct:2,min:2}]},yard:{bpm:128,root:43,scale:"minor",chords:[0,5,2,6],layers:[{i:"kick",p:"x...x...x...x..."},{i:"ohat",p:"..o...o...o...o."},{i:"bass",bass:"..x...x...x...o."},{i:"pad",chord:!0,v:.7},{i:"clap",p:"....x.......x...",min:1},{i:"pluck",arp:"xxxxxxxxxxxxxxxx",oct:2,v:.7,min:1},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.6,min:2},{i:"crash",p:"x...............",every:4,min:2},{i:"brass",mel:["4...4...3.4.6...","4...4...3.2.0...","4...4...3.4.6...","7...6...4...6..."],oct:1,min:2}]},night:{bpm:60,root:38,scale:"phryg",chords:[0,1,0,6],night:!0,layers:[{i:"drone",chord:!0,v:1},{i:"heart",p:"x..x............",v:.8},{i:"bell",mel:["........1.......","................",".......4........","..............2."],oct:3,v:.7},{i:"heart",p:"........x..x....",v:.8,min:1},{i:"hat",p:"..x...x...x...x.",v:.25,min:1},{i:"tom",p:"x..x..x...x.x...",f:70,v:.6,min:2},{i:"bass",bass:"x.x.x.x.x.x.x.x.",v:.6,min:2}]},row:{bpm:96,root:38,scale:"harm",chords:[0,5,3,4],layers:[{i:"tom",p:"x..x..x...x.x...",f:95},{i:"choir",chord:!0},{i:"bass",bass:"x..x..x.x..x..x."},{i:"kick",p:"x.......x.......",min:1},{i:"snare",p:"....x.......x...",min:1},{i:"brass",mel:["7.7.7.9.a.9.7.6.","7.7.7.9.a.c.a.9."],oct:0,v:.8,min:1},{i:"tom",p:"..........xxx.xx",f:140,v:.7,min:2},{i:"crash",p:"x...............",every:2,min:2},{i:"lead",mel:["e---d---c---b---","c---b---a---b---"],oct:1,min:2}]},boss:{bpm:152,root:38,scale:"harm",chords:[0,0,5,4],layers:[{i:"kick",p:"x...x...x...x.x."},{i:"snare",p:"....x.......x..."},{i:"hat",p:"xxxxxxxxxxxxxxxx",v:.5},{i:"bass",bass:"xxxxxxxxxxxxoxox",v:.8},{i:"choir",chord:!0},{i:"tom",p:"x.....x.....x.xx",f:90},{i:"brass",mel:["7.7.6.7.9.7.6.4.","7.7.6.7.a.9.7..."],oct:1},{i:"crash",p:"x...............",every:4}]},overtime:{bpm:168,root:48,scale:"major",chords:[0,3,4,0],layers:[{i:"kick",p:"x...x...x...x..."},{i:"snare",p:"....x.......x..."},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.7},{i:"chipb",bass:"x.o.x.o.x.o.x.o."},{i:"pluck",arp:"x.x.x.x.x.x.x.x.",oct:2,v:.6},{i:"chip",mel:["0.2.4.7.4.2.4...","3.5.7.a.7.5.3...","4.6.8.b.8.6.4...","7.6.5.4.2.1.0..."],oct:2},{i:"crash",p:"x...............",every:4}]}},qe={track:null,name:"",step:0,next:0,timer:0,int:0,want:"",pending:null,ducked:!1};function oa(i,e,t=0){let n=_p[i.scale],s=n.length,r=Math.floor(e/s),a=(e%s+s)%s;return i.root+n[a]+12*(r+t)}function Mp(i,e,t){return[0,2,4].map(n=>aa(oa(i,e+n,t)))}function bp(i,e,t){let n=e%16,s=Math.floor(e/16),r=60/i.bpm/4,a=n%2?(i.swing||0)*r:0,o=t+a,l=i.chords[s%i.chords.length];for(let c of i.layers){if((c.min||0)>qe.int)continue;let u=c.v??1,f=bn[c.i];if(c.p){if(c.every&&s%c.every)continue;let d=c.p[n];(d==="x"||d==="o")&&f(o,c.f,r,(d==="o"?1.2:1)*u)}else if(c.bass){let d=c.bass[n];if(d==="."||!d)continue;f(o,aa(oa(i,l+(d==="o"?7:d==="5"?4:0),c.oct||0)),r*(c.len||1.6),u)}else if(c.chord)n===0&&f(o,Mp(i,l,1+(c.oct||0)),r*16*1.05,u);else if(c.arp){if(c.arp[n]!=="x")continue;let d=[0,2,4,7][n%4];f(o,aa(oa(i,l+d,c.oct||2)),r,u)}else if(c.mel){let d=c.mel[s%c.mel.length],p=d[n];if(!p||p==="."||p==="-")continue;let y=1;for(;d[n+y]==="-";)y++;f(o,aa(oa(i,parseInt(p,36),c.oct||0)),r*(y+.6),u)}}i.night&&n===0&&Math.random()<.3+qe.int*.2&&bn.scrape(t+Math.random()*r*8,0,0,.7+qe.int*.3)}function Ep(){if(!ee.ctx||ee.ctx.state!=="running")return;let i=ee.ctx.currentTime;if(qe.track)for(qe.next<i&&(qe.next=i+.05);qe.next<i+.12&&(qe.pending&&(qe.step%16===0||qe.pending.now)&&(qe.track=$o[qe.pending.name],qe.name=qe.pending.name,qe.step=0,qe.pending=null),!!qe.track);)bp(qe.track,qe.step,qe.next),qe.next+=60/qe.track.bpm/4,qe.step++}ee.music=function(i,e){if(qe.want=i,!!ee.ctx){if(!i||!$o[i]){qe.track=null,qe.name="";return}if(!(qe.name===i&&!qe.pending)){if(!qe.track){qe.track=$o[i],qe.name=i,qe.step=0,qe.next=ee.ctx.currentTime+.06;return}qe.pending={name:i,now:!!e}}}};ee.musicName=()=>qe.pending?qe.pending.name:qe.name;ee.intensity=function(i){qe.int=i};ee.sting=function(i){if(!ee.ctx||Zo()!=="all"||ee.ctx.state!=="running")return;let e=ee.ctx.currentTime+.02,t=ee.mus;i==="clear"?([[0,523],[.14,659],[.28,784],[.42,1047]].forEach(([n,s])=>bn.brass(e+n,s,.5,1.3)),bn.pad(e+.42,[523,659,784],1.6,2),bn.crash(e+.42,0,0,1.2),bn.kick(e+.42,0,0,1)):i==="over"?([[0,233],[.45,220],[.9,208]].forEach(([n,s])=>Ue(e+n,.42,{type:"sawtooth",freq:s,gain:.14,lp:1200,attack:.04},t)),Ue(e+1.35,1.3,{type:"sawtooth",freq:196,gain:.14,lp:1200,attack:.04,vib:6,vibAmt:40},t)):i==="assault"?(bn.kick(e,0,0,1.3),bn.crash(e,0,0,1.3),bn.stab(e,82,.4,1.6),bn.tom(e+.18,90,0,1),bn.tom(e+.3,70,0,1)):i==="overtime"?(pu.clock.f(e,1.2),Ue(e,.9,{type:"sawtooth",freq:200,freqEnd:1600,gain:.08,lp:3e3},t)):i==="boss"&&(Ue(e,2.2,{type:"sawtooth",freq:55,freqEnd:110,gain:.2,lp:500,lpEnd:2400},t),bn.crash(e+2,0,0,1.4),bn.kick(e+2,0,0,1.3))};var ih="170";var wp=0,mu=1,Sp=2;var Af=1,sh=2,xi=3,Ui=0,nn=1,Xt=2,Bt=0,Us=1,Tn=2,gu=3,xu=4,rh=5,Un=100,Tp=101,Ap=102,Rp=103,Cp=104,Js=200,Ip=201,Pp=202,Lp=203,Pl=204,Ll=205,fo=206,Dp=207,po=208,Np=209,Up=210,Op=211,kp=212,zp=213,Fp=214,Dl=0,Nl=1,Ul=2,Fs=3,Ol=4,kl=5,zl=6,Fl=7,Rf=0,Bp=1,Hp=2,Ni=0,ah=1,oh=2,lh=3,Ur=4,Gp=5,ch=6,hh=7;var Cf=300,Bs=301,Hs=302,Sr=303,Bl=304,mo=306,An=1e3,Sn=1001,Hl=1002,sn=1003,Vp=1004;var la=1005;var Ft=1006,Ko=1007;var Di=1008;var Xn=1009,If=1010,Pf=1011,Tr=1012,uh=1013,rs=1014,gn=1015,Nt=1016,fh=1017,dh=1018,Oi=1020,Lf=35902,Df=1021,Nf=1022,on=1023,Uf=1024,Of=1025,Os=1026,ki=1027,ph=1028,mh=1029,kf=1030,gh=1031;var xh=1033,Na=33776,Ua=33777,Oa=33778,ka=33779,Gl=35840,Vl=35841,Wl=35842,Xl=35843,ql=36196,Yl=37492,$l=37496,Zl=37808,Kl=37809,Jl=37810,jl=37811,Ql=37812,ec=37813,tc=37814,nc=37815,ic=37816,sc=37817,rc=37818,ac=37819,oc=37820,lc=37821,za=36492,cc=36494,hc=36495,zf=36283,uc=36284,fc=36285,dc=36286;var Fa=2300,pc=2301,Jo=2302,yu=2400,vu=2401,_u=2402;var Wp=3200,Xp=3201;var yh=0,qp=1,Li="",Kt="srgb",ei="srgb-linear",go="linear",mt="srgb";var vs=7680;var Mu=519,Yp=512,$p=513,Zp=514,Ff=515,Kp=516,Jp=517,jp=518,Qp=519,bu=35044,js=35048;var Eu="300 es",vi=2e3,Ba=2001,zi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var jo=Math.PI/180,Ha=180/Math.PI;function Or(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[i&255]+en[i>>8&255]+en[i>>16&255]+en[i>>24&255]+"-"+en[e&255]+en[e>>8&255]+"-"+en[e>>16&15|64]+en[e>>24&255]+"-"+en[t&63|128]+en[t>>8&255]+"-"+en[t>>16&255]+en[t>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function Wt(i,e,t){return Math.max(e,Math.min(t,i))}function em(i,e){return(i%e+e)%e}function Qo(i,e,t){return(1-t)*i+t*e}function fr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function mn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var oe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ke=class i{constructor(e,t,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],d=n[2],p=n[5],y=n[8],x=s[0],g=s[3],m=s[6],v=s[1],M=s[4],b=s[7],L=s[2],T=s[5],C=s[8];return r[0]=a*x+o*v+l*L,r[3]=a*g+o*M+l*T,r[6]=a*m+o*b+l*C,r[1]=c*x+u*v+f*L,r[4]=c*g+u*M+f*T,r[7]=c*m+u*b+f*C,r[2]=d*x+p*v+y*L,r[5]=d*g+p*M+y*T,r[8]=d*m+p*b+y*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,d=o*l-u*r,p=c*r-a*l,y=t*f+n*d+s*p;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/y;return e[0]=f*x,e[1]=(s*c-u*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=p*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(el.makeScale(e,t)),this}rotate(e){return this.premultiply(el.makeRotation(-e)),this}translate(e,t){return this.premultiply(el.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},el=new Ke;function Bf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ar(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function tm(){let i=Ar("canvas");return i.style.display="block",i}var wu={};function _r(i){i in wu||(wu[i]=!0,console.warn(i))}function nm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function im(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function sm(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var st={enabled:!0,workingColorSpace:ei,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===mt&&(i.r=_i(i.r),i.g=_i(i.g),i.b=_i(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===mt&&(i.r=ks(i.r),i.g=ks(i.g),i.b=ks(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Li?go:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function _i(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ks(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Su=[.64,.33,.3,.6,.15,.06],Tu=[.2126,.7152,.0722],Au=[.3127,.329],Ru=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Cu=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);st.define({[ei]:{primaries:Su,whitePoint:Au,transfer:go,toXYZ:Ru,fromXYZ:Cu,luminanceCoefficients:Tu,workingColorSpaceConfig:{unpackColorSpace:Kt},outputColorSpaceConfig:{drawingBufferColorSpace:Kt}},[Kt]:{primaries:Su,whitePoint:Au,transfer:mt,toXYZ:Ru,fromXYZ:Cu,luminanceCoefficients:Tu,outputColorSpaceConfig:{drawingBufferColorSpace:Kt}}});var _s,mc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{_s===void 0&&(_s=Ar("canvas")),_s.width=e.width,_s.height=e.height;let n=_s.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=_s}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ar("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=_i(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(_i(t[n]/255)*255):t[n]=_i(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},rm=0,Ga=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=Or(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(tl(s[a].image)):r.push(tl(s[a]))}else r=tl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function tl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var am=0,ln=class i extends zi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Sn,s=Sn,r=Ft,a=Di,o=on,l=Xn,c=i.DEFAULT_ANISOTROPY,u=Li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:am++}),this.uuid=Or(),this.name="",this.source=new Ga(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case An:e.x=e.x-Math.floor(e.x);break;case Sn:e.x=e.x<0?0:1;break;case Hl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case An:e.y=e.y-Math.floor(e.y);break;case Sn:e.y=e.y<0?0:1;break;case Hl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Cf;ln.DEFAULT_ANISOTROPY=1;var vt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],f=l[8],d=l[1],p=l[5],y=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-x)<.01&&Math.abs(y-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+x)<.1&&Math.abs(y+g)<.1&&Math.abs(c+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,b=(p+1)/2,L=(m+1)/2,T=(u+d)/4,C=(f+x)/4,A=(y+g)/4;return M>b&&M>L?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=C/n):b>L?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=T/s,r=A/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=C/r,s=A/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-y)*(g-y)+(f-x)*(f-x)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(g-y)/v,this.y=(f-x)/v,this.z=(d-u)/v,this.w=Math.acos((c+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},gc=class extends zi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ft,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new ln(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ga(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},kt=class extends gc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Va=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=sn,this.minFilter=sn,this.wrapR=Sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var xc=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=sn,this.minFilter=sn,this.wrapR=Sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],f=n[s+3],d=r[a+0],p=r[a+1],y=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o===1){e[t+0]=d,e[t+1]=p,e[t+2]=y,e[t+3]=x;return}if(f!==x||l!==d||c!==p||u!==y){let g=1-o,m=l*d+c*p+u*y+f*x,v=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){let L=Math.sqrt(M),T=Math.atan2(L,m*v);g=Math.sin(g*T)/L,o=Math.sin(o*T)/L}let b=o*v;if(l=l*g+d*b,c=c*g+p*b,u=u*g+y*b,f=f*g+x*b,g===1-o){let L=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=L,c*=L,u*=L,f*=L}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],f=r[a],d=r[a+1],p=r[a+2],y=r[a+3];return e[t]=o*y+u*f+l*p-c*d,e[t+1]=l*y+u*d+c*f-o*p,e[t+2]=c*y+u*p+o*d-l*f,e[t+3]=u*y-o*f-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),f=o(r/2),d=l(n/2),p=l(s/2),y=l(r/2);switch(a){case"XYZ":this._x=d*u*f+c*p*y,this._y=c*p*f-d*u*y,this._z=c*u*y+d*p*f,this._w=c*u*f-d*p*y;break;case"YXZ":this._x=d*u*f+c*p*y,this._y=c*p*f-d*u*y,this._z=c*u*y-d*p*f,this._w=c*u*f+d*p*y;break;case"ZXY":this._x=d*u*f-c*p*y,this._y=c*p*f+d*u*y,this._z=c*u*y+d*p*f,this._w=c*u*f-d*p*y;break;case"ZYX":this._x=d*u*f-c*p*y,this._y=c*p*f+d*u*y,this._z=c*u*y-d*p*f,this._w=c*u*f+d*p*y;break;case"YZX":this._x=d*u*f+c*p*y,this._y=c*p*f+d*u*y,this._z=c*u*y-d*p*f,this._w=c*u*f-d*p*y;break;case"XZY":this._x=d*u*f-c*p*y,this._y=c*p*f-d*u*y,this._z=c*u*y+d*p*f,this._w=c*u*f+d*p*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],d=n+o+f;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>f){let p=2*Math.sqrt(1+n-o-f);this._w=(u-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>f){let p=2*Math.sqrt(1+o-n-f);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+u)/p}else{let p=2*Math.sqrt(1+f-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Wt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*f+this._w*d,this._x=n*f+this._x*d,this._y=s*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Iu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Iu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*u,this.y=n+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return nl.copy(this).projectOnVector(e),this.sub(nl)}reflect(e){return this.sub(nl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Wt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},nl=new P,Iu=new qt,Mi=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Hn):Hn.fromBufferAttribute(r,a),Hn.applyMatrix4(e.matrixWorld),this.expandByPoint(Hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ca.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ca.copy(n.boundingBox)),ca.applyMatrix4(e.matrixWorld),this.union(ca)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hn),Hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(dr),ha.subVectors(this.max,dr),Ms.subVectors(e.a,dr),bs.subVectors(e.b,dr),Es.subVectors(e.c,dr),Ti.subVectors(bs,Ms),Ai.subVectors(Es,bs),Ki.subVectors(Ms,Es);let t=[0,-Ti.z,Ti.y,0,-Ai.z,Ai.y,0,-Ki.z,Ki.y,Ti.z,0,-Ti.x,Ai.z,0,-Ai.x,Ki.z,0,-Ki.x,-Ti.y,Ti.x,0,-Ai.y,Ai.x,0,-Ki.y,Ki.x,0];return!il(t,Ms,bs,Es,ha)||(t=[1,0,0,0,1,0,0,0,1],!il(t,Ms,bs,Es,ha))?!1:(ua.crossVectors(Ti,Ai),t=[ua.x,ua.y,ua.z],il(t,Ms,bs,Es,ha))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},ui=[new P,new P,new P,new P,new P,new P,new P,new P],Hn=new P,ca=new Mi,Ms=new P,bs=new P,Es=new P,Ti=new P,Ai=new P,Ki=new P,dr=new P,ha=new P,ua=new P,Ji=new P;function il(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ji.fromArray(i,r);let o=s.x*Math.abs(Ji.x)+s.y*Math.abs(Ji.y)+s.z*Math.abs(Ji.z),l=e.dot(Ji),c=t.dot(Ji),u=n.dot(Ji);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var om=new Mi,pr=new P,sl=new P,Fi=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):om.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;pr.subVectors(e,this.center);let t=pr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(pr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(pr.copy(e.center).add(sl)),this.expandByPoint(pr.copy(e.center).sub(sl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},fi=new P,rl=new P,fa=new P,Ri=new P,al=new P,da=new P,ol=new P,Rr=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,fi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=fi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(fi.copy(this.origin).addScaledVector(this.direction,t),fi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){rl.copy(e).add(t).multiplyScalar(.5),fa.copy(t).sub(e).normalize(),Ri.copy(this.origin).sub(rl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(fa),o=Ri.dot(this.direction),l=-Ri.dot(fa),c=Ri.lengthSq(),u=Math.abs(1-a*a),f,d,p,y;if(u>0)if(f=a*l-o,d=a*o-l,y=r*u,f>=0)if(d>=-y)if(d<=y){let x=1/u;f*=x,d*=x,p=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=r,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;else d<=-y?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-l),r),p=-f*f+d*(d+2*l)+c):d<=y?(f=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-l),r),p=-f*f+d*(d+2*l)+c);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(rl).addScaledVector(fa,d),p}intersectSphere(e,t){fi.subVectors(e.center,this.origin);let n=fi.dot(this.direction),s=fi.dot(fi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,fi)!==null}intersectTriangle(e,t,n,s,r){al.subVectors(t,e),da.subVectors(n,e),ol.crossVectors(al,da);let a=this.direction.dot(ol),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ri.subVectors(this.origin,e);let l=o*this.direction.dot(da.crossVectors(Ri,da));if(l<0)return null;let c=o*this.direction.dot(al.cross(Ri));if(c<0||l+c>a)return null;let u=-o*Ri.dot(ol);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Be=class i{constructor(e,t,n,s,r,a,o,l,c,u,f,d,p,y,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,f,d,p,y,x,g)}set(e,t,n,s,r,a,o,l,c,u,f,d,p,y,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=f,m[14]=d,m[3]=p,m[7]=y,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/ws.setFromMatrixColumn(e,0).length(),r=1/ws.setFromMatrixColumn(e,1).length(),a=1/ws.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let d=a*u,p=a*f,y=o*u,x=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=p+y*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=y+p*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*u,p=l*f,y=c*u,x=c*f;t[0]=d+x*o,t[4]=y*o-p,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=p*o-y,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*u,p=l*f,y=c*u,x=c*f;t[0]=d-x*o,t[4]=-a*f,t[8]=y+p*o,t[1]=p+y*o,t[5]=a*u,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*u,p=a*f,y=o*u,x=o*f;t[0]=l*u,t[4]=y*c-p,t[8]=d*c+x,t[1]=l*f,t[5]=x*c+d,t[9]=p*c-y,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,p=a*c,y=o*l,x=o*c;t[0]=l*u,t[4]=x-d*f,t[8]=y*f+p,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=p*f+y,t[10]=d-x*f}else if(e.order==="XZY"){let d=a*l,p=a*c,y=o*l,x=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=d*f+x,t[5]=a*u,t[9]=p*f-y,t[2]=y*f-p,t[6]=o*u,t[10]=x*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(lm,e,cm)}lookAt(e,t,n){let s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),Ci.crossVectors(n,En),Ci.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),Ci.crossVectors(n,En)),Ci.normalize(),pa.crossVectors(En,Ci),s[0]=Ci.x,s[4]=pa.x,s[8]=En.x,s[1]=Ci.y,s[5]=pa.y,s[9]=En.y,s[2]=Ci.z,s[6]=pa.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],d=n[9],p=n[13],y=n[2],x=n[6],g=n[10],m=n[14],v=n[3],M=n[7],b=n[11],L=n[15],T=s[0],C=s[4],A=s[8],E=s[12],_=s[1],I=s[5],z=s[9],k=s[13],O=s[2],W=s[6],F=s[10],J=s[14],X=s[3],ie=s[7],ce=s[11],be=s[15];return r[0]=a*T+o*_+l*O+c*X,r[4]=a*C+o*I+l*W+c*ie,r[8]=a*A+o*z+l*F+c*ce,r[12]=a*E+o*k+l*J+c*be,r[1]=u*T+f*_+d*O+p*X,r[5]=u*C+f*I+d*W+p*ie,r[9]=u*A+f*z+d*F+p*ce,r[13]=u*E+f*k+d*J+p*be,r[2]=y*T+x*_+g*O+m*X,r[6]=y*C+x*I+g*W+m*ie,r[10]=y*A+x*z+g*F+m*ce,r[14]=y*E+x*k+g*J+m*be,r[3]=v*T+M*_+b*O+L*X,r[7]=v*C+M*I+b*W+L*ie,r[11]=v*A+M*z+b*F+L*ce,r[15]=v*E+M*k+b*J+L*be,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],d=e[10],p=e[14],y=e[3],x=e[7],g=e[11],m=e[15];return y*(+r*l*f-s*c*f-r*o*d+n*c*d+s*o*p-n*l*p)+x*(+t*l*p-t*c*d+r*a*d-s*a*p+s*c*u-r*l*u)+g*(+t*c*f-t*o*p-r*a*f+n*a*p+r*o*u-n*c*u)+m*(-s*o*u-t*l*f+t*o*d+s*a*f-n*a*d+n*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],d=e[10],p=e[11],y=e[12],x=e[13],g=e[14],m=e[15],v=f*g*c-x*d*c+x*l*p-o*g*p-f*l*m+o*d*m,M=y*d*c-u*g*c-y*l*p+a*g*p+u*l*m-a*d*m,b=u*x*c-y*f*c+y*o*p-a*x*p-u*o*m+a*f*m,L=y*f*l-u*x*l-y*o*d+a*x*d+u*o*g-a*f*g,T=t*v+n*M+s*b+r*L;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/T;return e[0]=v*C,e[1]=(x*d*r-f*g*r-x*s*p+n*g*p+f*s*m-n*d*m)*C,e[2]=(o*g*r-x*l*r+x*s*c-n*g*c-o*s*m+n*l*m)*C,e[3]=(f*l*r-o*d*r-f*s*c+n*d*c+o*s*p-n*l*p)*C,e[4]=M*C,e[5]=(u*g*r-y*d*r+y*s*p-t*g*p-u*s*m+t*d*m)*C,e[6]=(y*l*r-a*g*r-y*s*c+t*g*c+a*s*m-t*l*m)*C,e[7]=(a*d*r-u*l*r+u*s*c-t*d*c-a*s*p+t*l*p)*C,e[8]=b*C,e[9]=(y*f*r-u*x*r-y*n*p+t*x*p+u*n*m-t*f*m)*C,e[10]=(a*x*r-y*o*r+y*n*c-t*x*c-a*n*m+t*o*m)*C,e[11]=(u*o*r-a*f*r-u*n*c+t*f*c+a*n*p-t*o*p)*C,e[12]=L*C,e[13]=(u*x*s-y*f*s+y*n*d-t*x*d-u*n*g+t*f*g)*C,e[14]=(y*o*s-a*x*s-y*n*l+t*x*l+a*n*g-t*o*g)*C,e[15]=(a*f*s-u*o*s+u*n*l-t*f*l-a*n*d+t*o*d)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,d=r*c,p=r*u,y=r*f,x=a*u,g=a*f,m=o*f,v=l*c,M=l*u,b=l*f,L=n.x,T=n.y,C=n.z;return s[0]=(1-(x+m))*L,s[1]=(p+b)*L,s[2]=(y-M)*L,s[3]=0,s[4]=(p-b)*T,s[5]=(1-(d+m))*T,s[6]=(g+v)*T,s[7]=0,s[8]=(y+M)*C,s[9]=(g-v)*C,s[10]=(1-(d+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=ws.set(s[0],s[1],s[2]).length(),a=ws.set(s[4],s[5],s[6]).length(),o=ws.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Gn.copy(this);let c=1/r,u=1/a,f=1/o;return Gn.elements[0]*=c,Gn.elements[1]*=c,Gn.elements[2]*=c,Gn.elements[4]*=u,Gn.elements[5]*=u,Gn.elements[6]*=u,Gn.elements[8]*=f,Gn.elements[9]*=f,Gn.elements[10]*=f,t.setFromRotationMatrix(Gn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=vi){let l=this.elements,c=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),d=(n+s)/(n-s),p,y;if(o===vi)p=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===Ba)p=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=vi){let l=this.elements,c=1/(t-e),u=1/(n-s),f=1/(a-r),d=(t+e)*c,p=(n+s)*u,y,x;if(o===vi)y=(a+r)*f,x=-2*f;else if(o===Ba)y=r*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ws=new P,Gn=new Be,lm=new P(0,0,0),cm=new P(1,1,1),Ci=new P,pa=new P,En=new P,Pu=new Be,Lu=new qt,Yt=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Wt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Pu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lu.setFromEuler(this),this.setFromQuaternion(Lu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yt.DEFAULT_ORDER="XYZ";var Cr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},hm=0,Du=new P,Ss=new qt,di=new Be,ma=new P,mr=new P,um=new P,fm=new qt,Nu=new P(1,0,0),Uu=new P(0,1,0),Ou=new P(0,0,1),ku={type:"added"},dm={type:"removed"},Ts={type:"childadded",child:null},ll={type:"childremoved",child:null},$t=class i extends zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=Or(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new Yt,n=new qt,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Be},normalMatrix:{value:new Ke}}),this.matrix=new Be,this.matrixWorld=new Be,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ss.setFromAxisAngle(e,t),this.quaternion.multiply(Ss),this}rotateOnWorldAxis(e,t){return Ss.setFromAxisAngle(e,t),this.quaternion.premultiply(Ss),this}rotateX(e){return this.rotateOnAxis(Nu,e)}rotateY(e){return this.rotateOnAxis(Uu,e)}rotateZ(e){return this.rotateOnAxis(Ou,e)}translateOnAxis(e,t){return Du.copy(e).applyQuaternion(this.quaternion),this.position.add(Du.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nu,e)}translateY(e){return this.translateOnAxis(Uu,e)}translateZ(e){return this.translateOnAxis(Ou,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ma.copy(e):ma.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(mr,ma,this.up):di.lookAt(ma,mr,this.up),this.quaternion.setFromRotationMatrix(di),s&&(di.extractRotation(s.matrixWorld),Ss.setFromRotationMatrix(di),this.quaternion.premultiply(Ss.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ku),Ts.child=e,this.dispatchEvent(Ts),Ts.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dm),ll.child=e,this.dispatchEvent(ll),ll.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ku),Ts.child=e,this.dispatchEvent(Ts),Ts.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,e,um),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,fm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),d=a(e.skeletons),p=a(e.animations),y=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};$t.DEFAULT_UP=new P(0,1,0);$t.DEFAULT_MATRIX_AUTO_UPDATE=!0;$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Vn=new P,pi=new P,cl=new P,mi=new P,As=new P,Rs=new P,zu=new P,hl=new P,ul=new P,fl=new P,dl=new vt,pl=new vt,ml=new vt,is=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Vn.subVectors(e,t),s.cross(Vn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Vn.subVectors(s,t),pi.subVectors(n,t),cl.subVectors(e,t);let a=Vn.dot(Vn),o=Vn.dot(pi),l=Vn.dot(cl),c=pi.dot(pi),u=pi.dot(cl),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;let d=1/f,p=(c*l-o*u)*d,y=(a*u-o*l)*d;return r.set(1-p-y,y,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,mi)===null?!1:mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,mi.x),l.addScaledVector(a,mi.y),l.addScaledVector(o,mi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return dl.setScalar(0),pl.setScalar(0),ml.setScalar(0),dl.fromBufferAttribute(e,t),pl.fromBufferAttribute(e,n),ml.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(dl,r.x),a.addScaledVector(pl,r.y),a.addScaledVector(ml,r.z),a}static isFrontFacing(e,t,n,s){return Vn.subVectors(n,t),pi.subVectors(e,t),Vn.cross(pi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),pi.subVectors(this.a,this.b),Vn.cross(pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;As.subVectors(s,n),Rs.subVectors(r,n),hl.subVectors(e,n);let l=As.dot(hl),c=Rs.dot(hl);if(l<=0&&c<=0)return t.copy(n);ul.subVectors(e,s);let u=As.dot(ul),f=Rs.dot(ul);if(u>=0&&f<=u)return t.copy(s);let d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(As,a);fl.subVectors(e,r);let p=As.dot(fl),y=Rs.dot(fl);if(y>=0&&p<=y)return t.copy(r);let x=p*c-l*y;if(x<=0&&c>=0&&y<=0)return o=c/(c-y),t.copy(n).addScaledVector(Rs,o);let g=u*y-p*f;if(g<=0&&f-u>=0&&p-y>=0)return zu.subVectors(r,s),o=(f-u)/(f-u+(p-y)),t.copy(s).addScaledVector(zu,o);let m=1/(g+x+d);return a=x*m,o=d*m,t.copy(n).addScaledVector(As,a).addScaledVector(Rs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Hf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ii={h:0,s:0,l:0},ga={h:0,s:0,l:0};function gl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ye=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=st.workingColorSpace){return this.r=e,this.g=t,this.b=n,st.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=st.workingColorSpace){if(e=em(e,1),t=Wt(t,0,1),n=Wt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=gl(a,r,e+1/3),this.g=gl(a,r,e),this.b=gl(a,r,e-1/3)}return st.toWorkingColorSpace(this,s),this}setStyle(e,t=Kt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Kt){let n=Hf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_i(e.r),this.g=_i(e.g),this.b=_i(e.b),this}copyLinearToSRGB(e){return this.r=ks(e.r),this.g=ks(e.g),this.b=ks(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kt){return st.fromWorkingColorSpace(tn.copy(this),e),Math.round(Wt(tn.r*255,0,255))*65536+Math.round(Wt(tn.g*255,0,255))*256+Math.round(Wt(tn.b*255,0,255))}getHexString(e=Kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.fromWorkingColorSpace(tn.copy(this),t);let n=tn.r,s=tn.g,r=tn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=st.workingColorSpace){return st.fromWorkingColorSpace(tn.copy(this),t),e.r=tn.r,e.g=tn.g,e.b=tn.b,e}getStyle(e=Kt){st.fromWorkingColorSpace(tn.copy(this),e);let t=tn.r,n=tn.g,s=tn.b;return e!==Kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ii),this.setHSL(Ii.h+e,Ii.s+t,Ii.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ii),e.getHSL(ga);let n=Qo(Ii.h,ga.h,t),s=Qo(Ii.s,ga.s,t),r=Qo(Ii.l,ga.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},tn=new ye;ye.NAMES=Hf;var pm=0,bi=class extends zi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=Or(),this.name="",this.blending=Us,this.side=Ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pl,this.blendDst=Ll,this.blendEquation=Un,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ye(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=vs,this.stencilZFail=vs,this.stencilZPass=vs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Us&&(n.blending=this.blending),this.side!==Ui&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Pl&&(n.blendSrc=this.blendSrc),this.blendDst!==Ll&&(n.blendDst=this.blendDst),this.blendEquation!==Un&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Fs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==vs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==vs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==vs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},yt=class extends bi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yt,this.combine=Rf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},yi=mm();function mm(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;!(c&8388608);)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function gm(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Wt(i,-65504,65504),yi.floatView[0]=i;let e=yi.uint32View[0],t=e>>23&511;return yi.baseTable[t]+((e&8388607)>>yi.shiftTable[t])}function xm(i){let e=i>>10;return yi.uint32View[0]=yi.mantissaTable[yi.offsetTable[e]+(i&1023)]+yi.exponentTable[e],yi.floatView[0]}var kr={toHalfFloat:gm,fromHalfFloat:xm},Ut=new P,xa=new oe,Ot=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=bu,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xa.fromBufferAttribute(this,t),xa.applyMatrix3(e),this.setXY(t,xa.x,xa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix3(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=fr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=fr(t,this.array)),t}setX(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=fr(t,this.array)),t}setY(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=fr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=fr(t,this.array)),t}setW(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),n=mn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),n=mn(n,this.array),s=mn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),n=mn(n,this.array),s=mn(s,this.array),r=mn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==bu&&(e.usage=this.usage),e}};var Wa=class extends Ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Xa=class extends Ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ft=class extends Ot{constructor(e,t,n){super(new Float32Array(e),t,n)}},ym=0,Nn=new Be,xl=new $t,Cs=new P,wn=new Mi,gr=new Mi,Vt=new P,zt=class i extends zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ym++}),this.uuid=Or(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bf(e)?Xa:Wa)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,t,n){return Nn.makeTranslation(e,t,n),this.applyMatrix4(Nn),this}scale(e,t,n){return Nn.makeScale(e,t,n),this.applyMatrix4(Nn),this}lookAt(e){return xl.lookAt(e),xl.updateMatrix(),this.applyMatrix4(xl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cs).negate(),this.translate(Cs.x,Cs.y,Cs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ft(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];wn.setFromBufferAttribute(r),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,wn.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,wn.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(wn.min),this.boundingBox.expandByPoint(wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(wn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];gr.setFromBufferAttribute(o),this.morphTargetsRelative?(Vt.addVectors(wn.min,gr.min),wn.expandByPoint(Vt),Vt.addVectors(wn.max,gr.max),wn.expandByPoint(Vt)):(wn.expandByPoint(gr.min),wn.expandByPoint(gr.max))}wn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Vt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Vt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Vt.fromBufferAttribute(o,c),l&&(Cs.fromBufferAttribute(e,c),Vt.add(Cs)),s=Math.max(s,n.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ot(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let A=0;A<n.count;A++)o[A]=new P,l[A]=new P;let c=new P,u=new P,f=new P,d=new oe,p=new oe,y=new oe,x=new P,g=new P;function m(A,E,_){c.fromBufferAttribute(n,A),u.fromBufferAttribute(n,E),f.fromBufferAttribute(n,_),d.fromBufferAttribute(r,A),p.fromBufferAttribute(r,E),y.fromBufferAttribute(r,_),u.sub(c),f.sub(c),p.sub(d),y.sub(d);let I=1/(p.x*y.y-y.x*p.y);isFinite(I)&&(x.copy(u).multiplyScalar(y.y).addScaledVector(f,-p.y).multiplyScalar(I),g.copy(f).multiplyScalar(p.x).addScaledVector(u,-y.x).multiplyScalar(I),o[A].add(x),o[E].add(x),o[_].add(x),l[A].add(g),l[E].add(g),l[_].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let A=0,E=v.length;A<E;++A){let _=v[A],I=_.start,z=_.count;for(let k=I,O=I+z;k<O;k+=3)m(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let M=new P,b=new P,L=new P,T=new P;function C(A){L.fromBufferAttribute(s,A),T.copy(L);let E=o[A];M.copy(E),M.sub(L.multiplyScalar(L.dot(E))).normalize(),b.crossVectors(T,E);let I=b.dot(l[A])<0?-1:1;a.setXYZW(A,M.x,M.y,M.z,I)}for(let A=0,E=v.length;A<E;++A){let _=v[A],I=_.start,z=_.count;for(let k=I,O=I+z;k<O;k+=3)C(e.getX(k+0)),C(e.getX(k+1)),C(e.getX(k+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ot(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,f=new P;if(e)for(let d=0,p=e.count;d<p;d+=3){let y=e.getX(d+0),x=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,y),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,y),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Vt.fromBufferAttribute(e,t),Vt.normalize(),e.setXYZ(t,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,f=o.normalized,d=new c.constructor(l.length*u),p=0,y=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?p=l[x]*o.data.stride+o.offset:p=l[x]*u;for(let m=0;m<u;m++)d[y++]=c[p++]}return new Ot(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){let d=c[u],p=e(d,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){let p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],f=r[c];for(let d=0,p=f.length;d<p;d++)u.push(f[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fu=new Be,ji=new Rr,ya=new Fi,Bu=new P,va=new P,_a=new P,Ma=new P,yl=new P,ba=new P,Hu=new P,Ea=new P,pe=class extends $t{constructor(e=new zt,t=new yt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){ba.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],f=r[l];u!==0&&(yl.fromBufferAttribute(f,e),a?ba.addScaledVector(yl,u):ba.addScaledVector(yl.sub(t),u))}t.add(ba)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(r),ji.copy(e.ray).recast(e.near),!(ya.containsPoint(ji.origin)===!1&&(ji.intersectSphere(ya,Bu)===null||ji.origin.distanceToSquared(Bu)>(e.far-e.near)**2))&&(Fu.copy(r).invert(),ji.copy(e.ray).applyMatrix4(Fu),!(n.boundingBox!==null&&ji.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ji)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,x=d.length;y<x;y++){let g=d[y],m=a[g.materialIndex],v=Math.max(g.start,p.start),M=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let b=v,L=M;b<L;b+=3){let T=o.getX(b),C=o.getX(b+1),A=o.getX(b+2);s=wa(this,m,e,n,c,u,f,T,C,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=o.getX(g),M=o.getX(g+1),b=o.getX(g+2);s=wa(this,a,e,n,c,u,f,v,M,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let y=0,x=d.length;y<x;y++){let g=d[y],m=a[g.materialIndex],v=Math.max(g.start,p.start),M=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let b=v,L=M;b<L;b+=3){let T=b,C=b+1,A=b+2;s=wa(this,m,e,n,c,u,f,T,C,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=g,M=g+1,b=g+2;s=wa(this,a,e,n,c,u,f,v,M,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function vm(i,e,t,n,s,r,a,o){let l;if(e.side===nn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Ui,o),l===null)return null;Ea.copy(o),Ea.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ea);return c<t.near||c>t.far?null:{distance:c,point:Ea.clone(),object:i}}function wa(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,va),i.getVertexPosition(l,_a),i.getVertexPosition(c,Ma);let u=vm(i,e,t,n,va,_a,Ma,Hu);if(u){let f=new P;is.getBarycoord(Hu,va,_a,Ma,f),s&&(u.uv=is.getInterpolatedAttribute(s,o,l,c,f,new oe)),r&&(u.uv1=is.getInterpolatedAttribute(r,o,l,c,f,new oe)),a&&(u.normal=is.getInterpolatedAttribute(a,o,l,c,f,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new P,materialIndex:0};is.getNormal(va,_a,Ma,d.normal),u.face=d,u.barycoord=f}return u}var Pe=class i extends zt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],f=[],d=0,p=0;y("z","y","x",-1,-1,n,t,e,a,r,0),y("z","y","x",1,-1,n,t,-e,a,r,1),y("x","z","y",1,1,e,n,t,s,a,2),y("x","z","y",1,-1,e,n,-t,s,a,3),y("x","y","z",1,-1,e,t,n,s,r,4),y("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(u,3)),this.setAttribute("uv",new ft(f,2));function y(x,g,m,v,M,b,L,T,C,A,E){let _=b/C,I=L/A,z=b/2,k=L/2,O=T/2,W=C+1,F=A+1,J=0,X=0,ie=new P;for(let ce=0;ce<F;ce++){let be=ce*I-k;for(let Ie=0;Ie<W;Ie++){let Ye=Ie*_-z;ie[x]=Ye*v,ie[g]=be*M,ie[m]=O,c.push(ie.x,ie.y,ie.z),ie[x]=0,ie[g]=0,ie[m]=T>0?1:-1,u.push(ie.x,ie.y,ie.z),f.push(Ie/C),f.push(1-ce/A),J+=1}}for(let ce=0;ce<A;ce++)for(let be=0;be<C;be++){let Ie=d+be+W*ce,Ye=d+be+W*(ce+1),Z=d+(be+1)+W*(ce+1),ae=d+(be+1)+W*ce;l.push(Ie,Ye,ae),l.push(Ye,Z,ae),X+=6}o.addGroup(p,X,E),p+=X,d+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Gs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function an(i){let e={};for(let t=0;t<i.length;t++){let n=Gs(i[t]);for(let s in n)e[s]=n[s]}return e}function _m(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Gf(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}var yn={clone:Gs,merge:an},Mm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Tt=class extends bi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Mm,this.fragmentShader=bm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gs(e.uniforms),this.uniformsGroups=_m(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},qa=class extends $t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Be,this.projectionMatrix=new Be,this.projectionMatrixInverse=new Be,this.coordinateSystem=vi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Pi=new P,Gu=new oe,Vu=new oe,Jt=class extends qa{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ha*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(jo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ha*2*Math.atan(Math.tan(jo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z),Pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pi.x,Pi.y).multiplyScalar(-e/Pi.z)}getViewSize(e,t){return this.getViewBounds(e,Gu,Vu),t.subVectors(Vu,Gu)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(jo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Is=-90,Ps=1,yc=class extends $t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Jt(Is,Ps,e,t);s.layers=this.layers,this.add(s);let r=new Jt(Is,Ps,e,t);r.layers=this.layers,this.add(r);let a=new Jt(Is,Ps,e,t);a.layers=this.layers,this.add(a);let o=new Jt(Is,Ps,e,t);o.layers=this.layers,this.add(o);let l=new Jt(Is,Ps,e,t);l.layers=this.layers,this.add(l);let c=new Jt(Is,Ps,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===vi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ba)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(f,d,p),e.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},Ya=class extends ln{constructor(e,t,n,s,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Bs,super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},vc=class extends kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ya(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ft}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Pe(5,5,5),r=new Tt({name:"CubemapFromEquirect",uniforms:Gs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:nn,blending:Bt});r.uniforms.tEquirect.value=t;let a=new pe(s,r),o=t.minFilter;return t.minFilter===Di&&(t.minFilter=Ft),new yc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},vl=new P,Em=new P,wm=new Ke,Wn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=vl.subVectors(n,t).cross(Em.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(vl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||wm.getNormalMatrix(e),s=this.coplanarPoint(vl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Qi=new Fi,Sa=new P,Ir=class{constructor(e=new Wn,t=new Wn,n=new Wn,s=new Wn,r=new Wn,a=new Wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vi){let n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],f=s[6],d=s[7],p=s[8],y=s[9],x=s[10],g=s[11],m=s[12],v=s[13],M=s[14],b=s[15];if(n[0].setComponents(l-r,d-c,g-p,b-m).normalize(),n[1].setComponents(l+r,d+c,g+p,b+m).normalize(),n[2].setComponents(l+a,d+u,g+y,b+v).normalize(),n[3].setComponents(l-a,d-u,g-y,b-v).normalize(),n[4].setComponents(l-o,d-f,g-x,b-M).normalize(),t===vi)n[5].setComponents(l+o,d+f,g+x,b+M).normalize();else if(t===Ba)n[5].setComponents(o,f,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qi)}intersectsSprite(e){return Qi.center.set(0,0,0),Qi.radius=.7071067811865476,Qi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Sa.x=s.normal.x>0?e.max.x:e.min.x,Sa.y=s.normal.y>0?e.max.y:e.min.y,Sa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Sa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Vf(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Sm(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,f=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){let u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((p,y)=>p.start-y.start);let d=0;for(let p=1;p<f.length;p++){let y=f[d],x=f[p];x.start<=y.start+y.count+1?y.count=Math.max(y.count,x.start+x.count-y.start):(++d,f[d]=x)}f.length=d+1;for(let p=0,y=f.length;p<y;p++){let x=f[p];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Dt=class i extends zt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,f=e/o,d=t/l,p=[],y=[],x=[],g=[];for(let m=0;m<u;m++){let v=m*d-a;for(let M=0;M<c;M++){let b=M*f-r;y.push(b,-v,0),x.push(0,0,1),g.push(M/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<o;v++){let M=v+c*m,b=v+c*(m+1),L=v+1+c*(m+1),T=v+1+c*m;p.push(M,b,T),p.push(b,L,T)}this.setIndex(p),this.setAttribute("position",new ft(y,3)),this.setAttribute("normal",new ft(x,3)),this.setAttribute("uv",new ft(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Tm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Am=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Rm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Cm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Im=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Pm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Lm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Dm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Um=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Om=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,km=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Fm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Bm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Hm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Gm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Vm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ym=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,$m=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Zm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Km=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Jm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,jm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Qm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,e0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,t0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,n0="gl_FragColor = linearToOutputTexel( gl_FragColor );",i0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,s0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,r0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,a0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,o0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,l0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,c0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,h0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,u0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,f0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,d0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,p0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,m0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,g0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,x0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,y0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,v0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,M0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,b0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,E0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,w0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,S0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,T0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,A0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,R0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,C0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,I0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,P0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,L0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,D0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,N0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,U0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,O0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,k0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,z0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,F0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,B0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,H0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,G0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,V0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,W0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,X0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,q0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Y0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Z0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,K0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,J0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,j0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Q0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,eg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,tg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ng=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ig=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ag=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,og=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,lg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,cg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,hg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ug=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,dg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,mg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,_g=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Sg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ig=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Lg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Dg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ng=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Og=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Bg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Wg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Yg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$g=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Kg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ex=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ix=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Je={alphahash_fragment:Tm,alphahash_pars_fragment:Am,alphamap_fragment:Rm,alphamap_pars_fragment:Cm,alphatest_fragment:Im,alphatest_pars_fragment:Pm,aomap_fragment:Lm,aomap_pars_fragment:Dm,batching_pars_vertex:Nm,batching_vertex:Um,begin_vertex:Om,beginnormal_vertex:km,bsdfs:zm,iridescence_fragment:Fm,bumpmap_pars_fragment:Bm,clipping_planes_fragment:Hm,clipping_planes_pars_fragment:Gm,clipping_planes_pars_vertex:Vm,clipping_planes_vertex:Wm,color_fragment:Xm,color_pars_fragment:qm,color_pars_vertex:Ym,color_vertex:$m,common:Zm,cube_uv_reflection_fragment:Km,defaultnormal_vertex:Jm,displacementmap_pars_vertex:jm,displacementmap_vertex:Qm,emissivemap_fragment:e0,emissivemap_pars_fragment:t0,colorspace_fragment:n0,colorspace_pars_fragment:i0,envmap_fragment:s0,envmap_common_pars_fragment:r0,envmap_pars_fragment:a0,envmap_pars_vertex:o0,envmap_physical_pars_fragment:y0,envmap_vertex:l0,fog_vertex:c0,fog_pars_vertex:h0,fog_fragment:u0,fog_pars_fragment:f0,gradientmap_pars_fragment:d0,lightmap_pars_fragment:p0,lights_lambert_fragment:m0,lights_lambert_pars_fragment:g0,lights_pars_begin:x0,lights_toon_fragment:v0,lights_toon_pars_fragment:_0,lights_phong_fragment:M0,lights_phong_pars_fragment:b0,lights_physical_fragment:E0,lights_physical_pars_fragment:w0,lights_fragment_begin:S0,lights_fragment_maps:T0,lights_fragment_end:A0,logdepthbuf_fragment:R0,logdepthbuf_pars_fragment:C0,logdepthbuf_pars_vertex:I0,logdepthbuf_vertex:P0,map_fragment:L0,map_pars_fragment:D0,map_particle_fragment:N0,map_particle_pars_fragment:U0,metalnessmap_fragment:O0,metalnessmap_pars_fragment:k0,morphinstance_vertex:z0,morphcolor_vertex:F0,morphnormal_vertex:B0,morphtarget_pars_vertex:H0,morphtarget_vertex:G0,normal_fragment_begin:V0,normal_fragment_maps:W0,normal_pars_fragment:X0,normal_pars_vertex:q0,normal_vertex:Y0,normalmap_pars_fragment:$0,clearcoat_normal_fragment_begin:Z0,clearcoat_normal_fragment_maps:K0,clearcoat_pars_fragment:J0,iridescence_pars_fragment:j0,opaque_fragment:Q0,packing:eg,premultiplied_alpha_fragment:tg,project_vertex:ng,dithering_fragment:ig,dithering_pars_fragment:sg,roughnessmap_fragment:rg,roughnessmap_pars_fragment:ag,shadowmap_pars_fragment:og,shadowmap_pars_vertex:lg,shadowmap_vertex:cg,shadowmask_pars_fragment:hg,skinbase_vertex:ug,skinning_pars_vertex:fg,skinning_vertex:dg,skinnormal_vertex:pg,specularmap_fragment:mg,specularmap_pars_fragment:gg,tonemapping_fragment:xg,tonemapping_pars_fragment:yg,transmission_fragment:vg,transmission_pars_fragment:_g,uv_pars_fragment:Mg,uv_pars_vertex:bg,uv_vertex:Eg,worldpos_vertex:wg,background_vert:Sg,background_frag:Tg,backgroundCube_vert:Ag,backgroundCube_frag:Rg,cube_vert:Cg,cube_frag:Ig,depth_vert:Pg,depth_frag:Lg,distanceRGBA_vert:Dg,distanceRGBA_frag:Ng,equirect_vert:Ug,equirect_frag:Og,linedashed_vert:kg,linedashed_frag:zg,meshbasic_vert:Fg,meshbasic_frag:Bg,meshlambert_vert:Hg,meshlambert_frag:Gg,meshmatcap_vert:Vg,meshmatcap_frag:Wg,meshnormal_vert:Xg,meshnormal_frag:qg,meshphong_vert:Yg,meshphong_frag:$g,meshphysical_vert:Zg,meshphysical_frag:Kg,meshtoon_vert:Jg,meshtoon_frag:jg,points_vert:Qg,points_frag:ex,shadow_vert:tx,shadow_frag:nx,sprite_vert:ix,sprite_frag:sx},de={common:{diffuse:{value:new ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new ye(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},Jn={basic:{uniforms:an([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:an([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ye(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:an([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ye(0)},specular:{value:new ye(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:an([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:an([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new ye(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:an([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:an([de.points,de.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:an([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:an([de.common,de.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:an([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:an([de.sprite,de.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:an([de.common,de.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:an([de.lights,de.fog,{color:{value:new ye(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};Jn.physical={uniforms:an([Jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new ye(0)},specularColor:{value:new ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};var Ta={r:0,b:0,g:0},es=new Yt,rx=new Be;function ax(i,e,t,n,s,r,a){let o=new ye(0),l=r===!0?0:1,c,u,f=null,d=0,p=null;function y(v){let M=v.isScene===!0?v.background:null;return M&&M.isTexture&&(M=(v.backgroundBlurriness>0?t:e).get(M)),M}function x(v){let M=!1,b=y(v);b===null?m(o,l):b&&b.isColor&&(m(b,1),M=!0);let L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,a):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,M){let b=y(M);b&&(b.isCubeTexture||b.mapping===mo)?(u===void 0&&(u=new pe(new Pe(1,1,1),new Tt({name:"BackgroundCubeMaterial",uniforms:Gs(Jn.backgroundCube.uniforms),vertexShader:Jn.backgroundCube.vertexShader,fragmentShader:Jn.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(L,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),es.copy(M.backgroundRotation),es.x*=-1,es.y*=-1,es.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(es.y*=-1,es.z*=-1),u.material.uniforms.envMap.value=b,u.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(rx.makeRotationFromEuler(es)),u.material.toneMapped=st.getTransfer(b.colorSpace)!==mt,(f!==b||d!==b.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,f=b,d=b.version,p=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new pe(new Dt(2,2),new Tt({name:"BackgroundMaterial",uniforms:Gs(Jn.background.uniforms),vertexShader:Jn.background.vertexShader,fragmentShader:Jn.background.fragmentShader,side:Ui,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=st.getTransfer(b.colorSpace)!==mt,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(f!==b||d!==b.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,f=b,d=b.version,p=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,M){v.getRGB(Ta,Gf(i)),n.buffers.color.setClear(Ta.r,Ta.g,Ta.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(v,M=1){o.set(v),l=M,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,m(o,l)},render:x,addToRenderList:g}}function ox(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(_,I,z,k,O){let W=!1,F=f(k,z,I);r!==F&&(r=F,c(r.object)),W=p(_,k,z,O),W&&y(_,k,z,O),O!==null&&e.update(O,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,b(_,I,z,k),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function u(_){return i.deleteVertexArray(_)}function f(_,I,z){let k=z.wireframe===!0,O=n[_.id];O===void 0&&(O={},n[_.id]=O);let W=O[I.id];W===void 0&&(W={},O[I.id]=W);let F=W[k];return F===void 0&&(F=d(l()),W[k]=F),F}function d(_){let I=[],z=[],k=[];for(let O=0;O<t;O++)I[O]=0,z[O]=0,k[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:z,attributeDivisors:k,object:_,attributes:{},index:null}}function p(_,I,z,k){let O=r.attributes,W=I.attributes,F=0,J=z.getAttributes();for(let X in J)if(J[X].location>=0){let ce=O[X],be=W[X];if(be===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(be=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(be=_.instanceColor)),ce===void 0||ce.attribute!==be||be&&ce.data!==be.data)return!0;F++}return r.attributesNum!==F||r.index!==k}function y(_,I,z,k){let O={},W=I.attributes,F=0,J=z.getAttributes();for(let X in J)if(J[X].location>=0){let ce=W[X];ce===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(ce=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(ce=_.instanceColor));let be={};be.attribute=ce,ce&&ce.data&&(be.data=ce.data),O[X]=be,F++}r.attributes=O,r.attributesNum=F,r.index=k}function x(){let _=r.newAttributes;for(let I=0,z=_.length;I<z;I++)_[I]=0}function g(_){m(_,0)}function m(_,I){let z=r.newAttributes,k=r.enabledAttributes,O=r.attributeDivisors;z[_]=1,k[_]===0&&(i.enableVertexAttribArray(_),k[_]=1),O[_]!==I&&(i.vertexAttribDivisor(_,I),O[_]=I)}function v(){let _=r.newAttributes,I=r.enabledAttributes;for(let z=0,k=I.length;z<k;z++)I[z]!==_[z]&&(i.disableVertexAttribArray(z),I[z]=0)}function M(_,I,z,k,O,W,F){F===!0?i.vertexAttribIPointer(_,I,z,O,W):i.vertexAttribPointer(_,I,z,k,O,W)}function b(_,I,z,k){x();let O=k.attributes,W=z.getAttributes(),F=I.defaultAttributeValues;for(let J in W){let X=W[J];if(X.location>=0){let ie=O[J];if(ie===void 0&&(J==="instanceMatrix"&&_.instanceMatrix&&(ie=_.instanceMatrix),J==="instanceColor"&&_.instanceColor&&(ie=_.instanceColor)),ie!==void 0){let ce=ie.normalized,be=ie.itemSize,Ie=e.get(ie);if(Ie===void 0)continue;let Ye=Ie.buffer,Z=Ie.type,ae=Ie.bytesPerElement,Ee=Z===i.INT||Z===i.UNSIGNED_INT||ie.gpuType===uh;if(ie.isInterleavedBufferAttribute){let he=ie.data,Re=he.stride,ke=ie.offset;if(he.isInstancedInterleavedBuffer){for(let Ve=0;Ve<X.locationSize;Ve++)m(X.location+Ve,he.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Ve=0;Ve<X.locationSize;Ve++)g(X.location+Ve);i.bindBuffer(i.ARRAY_BUFFER,Ye);for(let Ve=0;Ve<X.locationSize;Ve++)M(X.location+Ve,be/X.locationSize,Z,ce,Re*ae,(ke+be/X.locationSize*Ve)*ae,Ee)}else{if(ie.isInstancedBufferAttribute){for(let he=0;he<X.locationSize;he++)m(X.location+he,ie.meshPerAttribute);_.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let he=0;he<X.locationSize;he++)g(X.location+he);i.bindBuffer(i.ARRAY_BUFFER,Ye);for(let he=0;he<X.locationSize;he++)M(X.location+he,be/X.locationSize,Z,ce,be*ae,be/X.locationSize*he*ae,Ee)}}else if(F!==void 0){let ce=F[J];if(ce!==void 0)switch(ce.length){case 2:i.vertexAttrib2fv(X.location,ce);break;case 3:i.vertexAttrib3fv(X.location,ce);break;case 4:i.vertexAttrib4fv(X.location,ce);break;default:i.vertexAttrib1fv(X.location,ce)}}}}v()}function L(){A();for(let _ in n){let I=n[_];for(let z in I){let k=I[z];for(let O in k)u(k[O].object),delete k[O];delete I[z]}delete n[_]}}function T(_){if(n[_.id]===void 0)return;let I=n[_.id];for(let z in I){let k=I[z];for(let O in k)u(k[O].object),delete k[O];delete I[z]}delete n[_.id]}function C(_){for(let I in n){let z=n[I];if(z[_.id]===void 0)continue;let k=z[_.id];for(let O in k)u(k[O].object),delete k[O];delete z[_.id]}}function A(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:E,dispose:L,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function lx(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,f){f!==0&&(i.drawArraysInstanced(n,c,u,f),t.update(u,n,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,f);let p=0;for(let y=0;y<f;y++)p+=u[y];t.update(p,n,1)}function l(c,u,f,d){if(f===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let y=0;y<c.length;y++)a(c[y],u[y],d[y]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,f);let y=0;for(let x=0;x<f;x++)y+=u[x]*d[x];t.update(y,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function cx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==on&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let A=C===Nt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Xn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==gn&&!A)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=y>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:y,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:b,vertexTextures:L,maxSamples:T}}function hx(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Wn,o=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){let p=f.length!==0||d||n!==0||s;return s=d,n=f.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=u(f,d,0)},this.setState=function(f,d,p){let y=f.clippingPlanes,x=f.clipIntersection,g=f.clipShadows,m=i.get(f);if(!s||y===null||y.length===0||r&&!g)r?u(null):c();else{let v=r?0:n,M=v*4,b=m.clippingState||null;l.value=b,b=u(y,d,M,p);for(let L=0;L!==M;++L)b[L]=t[L];m.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,d,p,y){let x=f!==null?f.length:0,g=null;if(x!==0){if(g=l.value,y!==!0||g===null){let m=p+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<m)&&(g=new Float32Array(m));for(let M=0,b=p;M!==x;++M,b+=4)a.copy(f[M]).applyMatrix4(v,o),a.normal.toArray(g,b),g[b+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function ux(i){let e=new WeakMap;function t(a,o){return o===Sr?a.mapping=Bs:o===Bl&&(a.mapping=Hs),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Sr||o===Bl)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new vc(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Vs=class extends qa{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ns=4,Wu=[.125,.215,.35,.446,.526,.582],ss=20,_l=new Vs,Xu=new ye,Ml=null,bl=0,El=0,wl=!1,ns=(1+Math.sqrt(5))/2,Ls=1/ns,qu=[new P(-ns,Ls,0),new P(ns,Ls,0),new P(-Ls,0,ns),new P(Ls,0,ns),new P(0,ns,-Ls),new P(0,ns,Ls),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],Ws=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Ml=this._renderer.getRenderTarget(),bl=this._renderer.getActiveCubeFace(),El=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$u(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ml,bl,El),this._renderer.xr.enabled=wl,e.scissorTest=!1,Aa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Bs||e.mapping===Hs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ml=this._renderer.getRenderTarget(),bl=this._renderer.getActiveCubeFace(),El=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ft,minFilter:Ft,generateMipmaps:!1,type:Nt,format:on,colorSpace:ei,depthBuffer:!1},s=Yu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Yu(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=fx(r)),this._blurMaterial=dx(r,e,t)}return s}_compileMaterial(e){let t=new pe(this._lodPlanes[0],e);this._renderer.compile(t,_l)}_sceneToCubeUV(e,t,n,s){let o=new Jt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Xu),u.toneMapping=Ni,u.autoClear=!1;let p=new yt({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1}),y=new pe(new Pe,p),x=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,x=!0):(p.color.copy(Xu),x=!0);for(let m=0;m<6;m++){let v=m%3;v===0?(o.up.set(0,l[m],0),o.lookAt(c[m],0,0)):v===1?(o.up.set(0,0,l[m]),o.lookAt(0,c[m],0)):(o.up.set(0,l[m],0),o.lookAt(0,0,c[m]));let M=this._cubeSize;Aa(s,v*M,m>2?M:0,M,M),u.setRenderTarget(s),x&&u.render(y,o),u.render(e,o)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Bs||e.mapping===Hs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$u());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new pe(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Aa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,_l)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=qu[(s-r-1)%qu.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,f=new pe(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ss-1),x=r/y,g=isFinite(r)?1+Math.floor(u*x):ss;g>ss&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ss}`);let m=[],v=0;for(let C=0;C<ss;++C){let A=C/x,E=Math.exp(-A*A/2);m.push(E),C===0?v+=E:C<g&&(v+=2*E)}for(let C=0;C<m.length;C++)m[C]=m[C]/v;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:M}=this;d.dTheta.value=y,d.mipInt.value=M-n;let b=this._sizeLods[s],L=3*b*(s>M-Ns?s-M+Ns:0),T=4*(this._cubeSize-b);Aa(t,L,T,3*b,2*b),l.setRenderTarget(t),l.render(f,_l)}};function fx(i){let e=[],t=[],n=[],s=i,r=i-Ns+1+Wu.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Ns?l=Wu[a-i+Ns-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,y=6,x=3,g=2,m=1,v=new Float32Array(x*y*p),M=new Float32Array(g*y*p),b=new Float32Array(m*y*p);for(let T=0;T<p;T++){let C=T%3*2/3-1,A=T>2?0:-1,E=[C,A,0,C+2/3,A,0,C+2/3,A+1,0,C,A,0,C+2/3,A+1,0,C,A+1,0];v.set(E,x*y*T),M.set(d,g*y*T);let _=[T,T,T,T,T,T];b.set(_,m*y*T)}let L=new zt;L.setAttribute("position",new Ot(v,x)),L.setAttribute("uv",new Ot(M,g)),L.setAttribute("faceIndex",new Ot(b,m)),e.push(L),s>Ns&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Yu(i,e,t){let n=new kt(i,e,t);return n.texture.mapping=mo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Aa(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function dx(i,e,t){let n=new Float32Array(ss),s=new P(0,1,0);return new Tt({name:"SphericalGaussianBlur",defines:{n:ss,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:vh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bt,depthTest:!1,depthWrite:!1})}function $u(){return new Tt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bt,depthTest:!1,depthWrite:!1})}function Zu(){return new Tt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bt,depthTest:!1,depthWrite:!1})}function vh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function px(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===Sr||l===Bl,u=l===Bs||l===Hs;if(c||u){let f=e.get(o),d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Ws(i)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{let p=o.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new Ws(i)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0,c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function mx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&_r("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function gx(i,e,t,n){let s={},r=new WeakMap;function a(f){let d=f.target;d.index!==null&&e.remove(d.index);for(let y in d.attributes)e.remove(d.attributes[y]);for(let y in d.morphAttributes){let x=d.morphAttributes[y];for(let g=0,m=x.length;g<m;g++)e.remove(x[g])}d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(f){let d=f.attributes;for(let y in d)e.update(d[y],i.ARRAY_BUFFER);let p=f.morphAttributes;for(let y in p){let x=p[y];for(let g=0,m=x.length;g<m;g++)e.update(x[g],i.ARRAY_BUFFER)}}function c(f){let d=[],p=f.index,y=f.attributes.position,x=0;if(p!==null){let v=p.array;x=p.version;for(let M=0,b=v.length;M<b;M+=3){let L=v[M+0],T=v[M+1],C=v[M+2];d.push(L,T,T,C,C,L)}}else if(y!==void 0){let v=y.array;x=y.version;for(let M=0,b=v.length/3-1;M<b;M+=3){let L=M+0,T=M+1,C=M+2;d.push(L,T,T,C,C,L)}}else return;let g=new(Bf(d)?Xa:Wa)(d,1);g.version=x;let m=r.get(f);m&&e.remove(m),r.set(f,g)}function u(f){let d=r.get(f);if(d){let p=f.index;p!==null&&d.version<p.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function xx(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*a),t.update(p,n,1)}function c(d,p,y){y!==0&&(i.drawElementsInstanced(n,p,r,d*a,y),t.update(p,n,y))}function u(d,p,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,y);let g=0;for(let m=0;m<y;m++)g+=p[m];t.update(g,n,1)}function f(d,p,y,x){if(y===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)c(d[m]/a,p[m],x[m]);else{g.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,x,0,y);let m=0;for(let v=0;v<y;v++)m+=p[v]*x[v];t.update(m,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function yx(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function vx(i,e,t){let n=new WeakMap,s=new vt;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0,d=n.get(o);if(d===void 0||d.count!==f){let E=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();let p=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],M=0;p===!0&&(M=1),y===!0&&(M=2),x===!0&&(M=3);let b=o.attributes.position.count*M,L=1;b>e.maxTextureSize&&(L=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let T=new Float32Array(b*L*4*f),C=new Va(T,b,L,f);C.type=gn,C.needsUpdate=!0;let A=M*4;for(let _=0;_<f;_++){let I=g[_],z=m[_],k=v[_],O=b*L*4*_;for(let W=0;W<I.count;W++){let F=W*A;p===!0&&(s.fromBufferAttribute(I,W),T[O+F+0]=s.x,T[O+F+1]=s.y,T[O+F+2]=s.z,T[O+F+3]=0),y===!0&&(s.fromBufferAttribute(z,W),T[O+F+4]=s.x,T[O+F+5]=s.y,T[O+F+6]=s.z,T[O+F+7]=0),x===!0&&(s.fromBufferAttribute(k,W),T[O+F+8]=s.x,T[O+F+9]=s.y,T[O+F+10]=s.z,T[O+F+11]=k.itemSize===4?s.w:1)}}d={count:f,texture:C,size:new oe(b,L)},n.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];let y=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",y),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function _x(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,f=e.get(l,u);if(s.get(f)!==c&&(e.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}var Xs=class extends ln{constructor(e,t,n,s,r,a,o,l,c,u=Os){if(u!==Os&&u!==ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Os&&(n=rs),n===void 0&&u===ki&&(n=Oi),super(null,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:sn,this.minFilter=l!==void 0?l:sn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Wf=new ln,Ku=new Xs(1,1),Xf=new Va,qf=new xc,Yf=new Ya,Ju=[],ju=[],Qu=new Float32Array(16),ef=new Float32Array(9),tf=new Float32Array(4);function Qs(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Ju[s];if(r===void 0&&(r=new Float32Array(s),Ju[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ht(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Gt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function xo(i,e){let t=ju[e];t===void 0&&(t=new Int32Array(e),ju[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Mx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function bx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2fv(this.addr,e),Gt(t,e)}}function Ex(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ht(t,e))return;i.uniform3fv(this.addr,e),Gt(t,e)}}function wx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4fv(this.addr,e),Gt(t,e)}}function Sx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Gt(t,e)}else{if(Ht(t,n))return;tf.set(n),i.uniformMatrix2fv(this.addr,!1,tf),Gt(t,n)}}function Tx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Gt(t,e)}else{if(Ht(t,n))return;ef.set(n),i.uniformMatrix3fv(this.addr,!1,ef),Gt(t,n)}}function Ax(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Gt(t,e)}else{if(Ht(t,n))return;Qu.set(n),i.uniformMatrix4fv(this.addr,!1,Qu),Gt(t,n)}}function Rx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Cx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2iv(this.addr,e),Gt(t,e)}}function Ix(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3iv(this.addr,e),Gt(t,e)}}function Px(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4iv(this.addr,e),Gt(t,e)}}function Lx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Dx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2uiv(this.addr,e),Gt(t,e)}}function Nx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3uiv(this.addr,e),Gt(t,e)}}function Ux(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4uiv(this.addr,e),Gt(t,e)}}function Ox(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ku.compareFunction=Ff,r=Ku):r=Wf,t.setTexture2D(e||r,s)}function kx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||qf,s)}function zx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Yf,s)}function Fx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Xf,s)}function Bx(i){switch(i){case 5126:return Mx;case 35664:return bx;case 35665:return Ex;case 35666:return wx;case 35674:return Sx;case 35675:return Tx;case 35676:return Ax;case 5124:case 35670:return Rx;case 35667:case 35671:return Cx;case 35668:case 35672:return Ix;case 35669:case 35673:return Px;case 5125:return Lx;case 36294:return Dx;case 36295:return Nx;case 36296:return Ux;case 35678:case 36198:case 36298:case 36306:case 35682:return Ox;case 35679:case 36299:case 36307:return kx;case 35680:case 36300:case 36308:case 36293:return zx;case 36289:case 36303:case 36311:case 36292:return Fx}}function Hx(i,e){i.uniform1fv(this.addr,e)}function Gx(i,e){let t=Qs(e,this.size,2);i.uniform2fv(this.addr,t)}function Vx(i,e){let t=Qs(e,this.size,3);i.uniform3fv(this.addr,t)}function Wx(i,e){let t=Qs(e,this.size,4);i.uniform4fv(this.addr,t)}function Xx(i,e){let t=Qs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function qx(i,e){let t=Qs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Yx(i,e){let t=Qs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function $x(i,e){i.uniform1iv(this.addr,e)}function Zx(i,e){i.uniform2iv(this.addr,e)}function Kx(i,e){i.uniform3iv(this.addr,e)}function Jx(i,e){i.uniform4iv(this.addr,e)}function jx(i,e){i.uniform1uiv(this.addr,e)}function Qx(i,e){i.uniform2uiv(this.addr,e)}function ey(i,e){i.uniform3uiv(this.addr,e)}function ty(i,e){i.uniform4uiv(this.addr,e)}function ny(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Wf,r[a])}function iy(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||qf,r[a])}function sy(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Yf,r[a])}function ry(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Xf,r[a])}function ay(i){switch(i){case 5126:return Hx;case 35664:return Gx;case 35665:return Vx;case 35666:return Wx;case 35674:return Xx;case 35675:return qx;case 35676:return Yx;case 5124:case 35670:return $x;case 35667:case 35671:return Zx;case 35668:case 35672:return Kx;case 35669:case 35673:return Jx;case 5125:return jx;case 36294:return Qx;case 36295:return ey;case 36296:return ty;case 35678:case 36198:case 36298:case 36306:case 35682:return ny;case 35679:case 36299:case 36307:return iy;case 35680:case 36300:case 36308:case 36293:return sy;case 36289:case 36303:case 36311:case 36292:return ry}}var _c=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Bx(t.type)}},Mc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ay(t.type)}},bc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Sl=/(\w+)(\])?(\[|\.)?/g;function nf(i,e){i.seq.push(e),i.map[e.id]=e}function oy(i,e,t){let n=i.name,s=n.length;for(Sl.lastIndex=0;;){let r=Sl.exec(n),a=Sl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){nf(t,c===void 0?new _c(o,i,e):new Mc(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new bc(o),nf(t,f)),t=f}}}var zs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);oy(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function sf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var ly=37297,cy=0;function hy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var rf=new Ke;function uy(i){st._getMatrix(rf,st.workingColorSpace,i);let e=`mat3( ${rf.elements.map(t=>t.toFixed(4))} )`;switch(st.getTransfer(i)){case go:return[e,"LinearTransferOETF"];case mt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function af(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+hy(i.getShaderSource(e),a)}else return s}function fy(i,e){let t=uy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function dy(i,e){let t;switch(e){case ah:t="Linear";break;case oh:t="Reinhard";break;case lh:t="Cineon";break;case Ur:t="ACESFilmic";break;case ch:t="AgX";break;case hh:t="Neutral";break;case Gp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ra=new P;function py(){st.getLuminanceCoefficients(Ra);let i=Ra.x.toFixed(4),e=Ra.y.toFixed(4),t=Ra.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function my(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mr).join(`
`)}function gy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function xy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Mr(i){return i!==""}function of(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var yy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ec(i){return i.replace(yy,_y)}var vy=new Map;function _y(i,e){let t=Je[e];if(t===void 0){let n=vy.get(e);if(n!==void 0)t=Je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ec(t)}var My=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cf(i){return i.replace(My,by)}function by(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function hf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ey(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Af?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===sh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===xi&&(e="SHADOWMAP_TYPE_VSM"),e}function wy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Bs:case Hs:e="ENVMAP_TYPE_CUBE";break;case mo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Sy(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Hs:e="ENVMAP_MODE_REFRACTION";break}return e}function Ty(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Rf:e="ENVMAP_BLENDING_MULTIPLY";break;case Bp:e="ENVMAP_BLENDING_MIX";break;case Hp:e="ENVMAP_BLENDING_ADD";break}return e}function Ay(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Ry(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Ey(t),c=wy(t),u=Sy(t),f=Ty(t),d=Ay(t),p=my(t),y=gy(r),x=s.createProgram(),g,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Mr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Mr).join(`
`),m.length>0&&(m+=`
`)):(g=[hf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mr).join(`
`),m=[hf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ni?"#define TONE_MAPPING":"",t.toneMapping!==Ni?Je.tonemapping_pars_fragment:"",t.toneMapping!==Ni?dy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,fy("linearToOutputTexel",t.outputColorSpace),py(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Mr).join(`
`)),a=Ec(a),a=of(a,t),a=lf(a,t),o=Ec(o),o=of(o,t),o=lf(o,t),a=cf(a),o=cf(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Eu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Eu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let M=v+g+a,b=v+m+o,L=sf(s,s.VERTEX_SHADER,M),T=sf(s,s.FRAGMENT_SHADER,b);s.attachShader(x,L),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(I){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(x).trim(),k=s.getShaderInfoLog(L).trim(),O=s.getShaderInfoLog(T).trim(),W=!0,F=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,L,T);else{let J=af(s,L,"vertex"),X=af(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+z+`
`+J+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(k===""||O==="")&&(F=!1);F&&(I.diagnostics={runnable:W,programLog:z,vertexShader:{log:k,prefix:g},fragmentShader:{log:O,prefix:m}})}s.deleteShader(L),s.deleteShader(T),A=new zs(s,x),E=xy(s,x)}let A;this.getUniforms=function(){return A===void 0&&C(this),A};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(x,ly)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cy++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=L,this.fragmentShader=T,this}var Cy=0,wc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Sc(e),t.set(e,n)),n}},Sc=class{constructor(e){this.id=Cy++,this.code=e,this.usedTimes=0}};function Iy(i,e,t,n,s,r,a){let o=new Cr,l=new wc,c=new Set,u=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(E){return c.add(E),E===0?"uv":`uv${E}`}function g(E,_,I,z,k){let O=z.fog,W=k.geometry,F=E.isMeshStandardMaterial?z.environment:null,J=(E.isMeshStandardMaterial?t:e).get(E.envMap||F),X=J&&J.mapping===mo?J.image.height:null,ie=y[E.type];E.precision!==null&&(p=s.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));let ce=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,be=ce!==void 0?ce.length:0,Ie=0;W.morphAttributes.position!==void 0&&(Ie=1),W.morphAttributes.normal!==void 0&&(Ie=2),W.morphAttributes.color!==void 0&&(Ie=3);let Ye,Z,ae,Ee;if(ie){let xt=Jn[ie];Ye=xt.vertexShader,Z=xt.fragmentShader}else Ye=E.vertexShader,Z=E.fragmentShader,l.update(E),ae=l.getVertexShaderID(E),Ee=l.getFragmentShaderID(E);let he=i.getRenderTarget(),Re=i.state.buffers.depth.getReversed(),ke=k.isInstancedMesh===!0,Ve=k.isBatchedMesh===!0,Mt=!!E.map,nt=!!E.matcap,Et=!!J,B=!!E.aoMap,jt=!!E.lightMap,Qe=!!E.bumpMap,et=!!E.normalMap,De=!!E.displacementMap,gt=!!E.emissiveMap,Le=!!E.metalnessMap,R=!!E.roughnessMap,w=E.anisotropy>0,V=E.clearcoat>0,Q=E.dispersion>0,se=E.iridescence>0,K=E.sheen>0,we=E.transmission>0,fe=w&&!!E.anisotropyMap,me=V&&!!E.clearcoatMap,je=V&&!!E.clearcoatNormalMap,re=V&&!!E.clearcoatRoughnessMap,_e=se&&!!E.iridescenceMap,Fe=se&&!!E.iridescenceThicknessMap,Ge=K&&!!E.sheenColorMap,Me=K&&!!E.sheenRoughnessMap,it=!!E.specularMap,We=!!E.specularColorMap,ct=!!E.specularIntensityMap,U=we&&!!E.transmissionMap,ue=we&&!!E.thicknessMap,$=!!E.gradientMap,te=!!E.alphaMap,ve=E.alphaTest>0,ge=!!E.alphaHash,$e=!!E.extensions,Ct=Ni;E.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(Ct=i.toneMapping);let Qt={shaderID:ie,shaderType:E.type,shaderName:E.name,vertexShader:Ye,fragmentShader:Z,defines:E.defines,customVertexShaderID:ae,customFragmentShaderID:Ee,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Ve,batchingColor:Ve&&k._colorsTexture!==null,instancing:ke,instancingColor:ke&&k.instanceColor!==null,instancingMorph:ke&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:he===null?i.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:ei,alphaToCoverage:!!E.alphaToCoverage,map:Mt,matcap:nt,envMap:Et,envMapMode:Et&&J.mapping,envMapCubeUVHeight:X,aoMap:B,lightMap:jt,bumpMap:Qe,normalMap:et,displacementMap:d&&De,emissiveMap:gt,normalMapObjectSpace:et&&E.normalMapType===qp,normalMapTangentSpace:et&&E.normalMapType===yh,metalnessMap:Le,roughnessMap:R,anisotropy:w,anisotropyMap:fe,clearcoat:V,clearcoatMap:me,clearcoatNormalMap:je,clearcoatRoughnessMap:re,dispersion:Q,iridescence:se,iridescenceMap:_e,iridescenceThicknessMap:Fe,sheen:K,sheenColorMap:Ge,sheenRoughnessMap:Me,specularMap:it,specularColorMap:We,specularIntensityMap:ct,transmission:we,transmissionMap:U,thicknessMap:ue,gradientMap:$,opaque:E.transparent===!1&&E.blending===Us&&E.alphaToCoverage===!1,alphaMap:te,alphaTest:ve,alphaHash:ge,combine:E.combine,mapUv:Mt&&x(E.map.channel),aoMapUv:B&&x(E.aoMap.channel),lightMapUv:jt&&x(E.lightMap.channel),bumpMapUv:Qe&&x(E.bumpMap.channel),normalMapUv:et&&x(E.normalMap.channel),displacementMapUv:De&&x(E.displacementMap.channel),emissiveMapUv:gt&&x(E.emissiveMap.channel),metalnessMapUv:Le&&x(E.metalnessMap.channel),roughnessMapUv:R&&x(E.roughnessMap.channel),anisotropyMapUv:fe&&x(E.anisotropyMap.channel),clearcoatMapUv:me&&x(E.clearcoatMap.channel),clearcoatNormalMapUv:je&&x(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&x(E.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&x(E.iridescenceMap.channel),iridescenceThicknessMapUv:Fe&&x(E.iridescenceThicknessMap.channel),sheenColorMapUv:Ge&&x(E.sheenColorMap.channel),sheenRoughnessMapUv:Me&&x(E.sheenRoughnessMap.channel),specularMapUv:it&&x(E.specularMap.channel),specularColorMapUv:We&&x(E.specularColorMap.channel),specularIntensityMapUv:ct&&x(E.specularIntensityMap.channel),transmissionMapUv:U&&x(E.transmissionMap.channel),thicknessMapUv:ue&&x(E.thicknessMap.channel),alphaMapUv:te&&x(E.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(et||w),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!W.attributes.uv&&(Mt||te),fog:!!O,useFog:E.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Re,skinning:k.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Ie,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ct,decodeVideoTexture:Mt&&E.map.isVideoTexture===!0&&st.getTransfer(E.map.colorSpace)===mt,decodeVideoTextureEmissive:gt&&E.emissiveMap.isVideoTexture===!0&&st.getTransfer(E.emissiveMap.colorSpace)===mt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Xt,flipSided:E.side===nn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:$e&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:($e&&E.extensions.multiDraw===!0||Ve)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Qt.vertexUv1s=c.has(1),Qt.vertexUv2s=c.has(2),Qt.vertexUv3s=c.has(3),c.clear(),Qt}function m(E){let _=[];if(E.shaderID?_.push(E.shaderID):(_.push(E.customVertexShaderID),_.push(E.customFragmentShaderID)),E.defines!==void 0)for(let I in E.defines)_.push(I),_.push(E.defines[I]);return E.isRawShaderMaterial===!1&&(v(_,E),M(_,E),_.push(i.outputColorSpace)),_.push(E.customProgramCacheKey),_.join()}function v(E,_){E.push(_.precision),E.push(_.outputColorSpace),E.push(_.envMapMode),E.push(_.envMapCubeUVHeight),E.push(_.mapUv),E.push(_.alphaMapUv),E.push(_.lightMapUv),E.push(_.aoMapUv),E.push(_.bumpMapUv),E.push(_.normalMapUv),E.push(_.displacementMapUv),E.push(_.emissiveMapUv),E.push(_.metalnessMapUv),E.push(_.roughnessMapUv),E.push(_.anisotropyMapUv),E.push(_.clearcoatMapUv),E.push(_.clearcoatNormalMapUv),E.push(_.clearcoatRoughnessMapUv),E.push(_.iridescenceMapUv),E.push(_.iridescenceThicknessMapUv),E.push(_.sheenColorMapUv),E.push(_.sheenRoughnessMapUv),E.push(_.specularMapUv),E.push(_.specularColorMapUv),E.push(_.specularIntensityMapUv),E.push(_.transmissionMapUv),E.push(_.thicknessMapUv),E.push(_.combine),E.push(_.fogExp2),E.push(_.sizeAttenuation),E.push(_.morphTargetsCount),E.push(_.morphAttributeCount),E.push(_.numDirLights),E.push(_.numPointLights),E.push(_.numSpotLights),E.push(_.numSpotLightMaps),E.push(_.numHemiLights),E.push(_.numRectAreaLights),E.push(_.numDirLightShadows),E.push(_.numPointLightShadows),E.push(_.numSpotLightShadows),E.push(_.numSpotLightShadowsWithMaps),E.push(_.numLightProbes),E.push(_.shadowMapType),E.push(_.toneMapping),E.push(_.numClippingPlanes),E.push(_.numClipIntersection),E.push(_.depthPacking)}function M(E,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reverseDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),E.push(o.mask)}function b(E){let _=y[E.type],I;if(_){let z=Jn[_];I=yn.clone(z.uniforms)}else I=E.uniforms;return I}function L(E,_){let I;for(let z=0,k=u.length;z<k;z++){let O=u[z];if(O.cacheKey===_){I=O,++I.usedTimes;break}}return I===void 0&&(I=new Ry(i,_,E,r),u.push(I)),I}function T(E){if(--E.usedTimes===0){let _=u.indexOf(E);u[_]=u[u.length-1],u.pop(),E.destroy()}}function C(E){l.remove(E)}function A(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:b,acquireProgram:L,releaseProgram:T,releaseShaderCache:C,programs:u,dispose:A}}function Py(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ly(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function uf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ff(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(f,d,p,y,x,g){let m=i[e];return m===void 0?(m={id:f.id,object:f,geometry:d,material:p,groupOrder:y,renderOrder:f.renderOrder,z:x,group:g},i[e]=m):(m.id=f.id,m.object=f,m.geometry=d,m.material=p,m.groupOrder=y,m.renderOrder=f.renderOrder,m.z=x,m.group=g),e++,m}function o(f,d,p,y,x,g){let m=a(f,d,p,y,x,g);p.transmission>0?n.push(m):p.transparent===!0?s.push(m):t.push(m)}function l(f,d,p,y,x,g){let m=a(f,d,p,y,x,g);p.transmission>0?n.unshift(m):p.transparent===!0?s.unshift(m):t.unshift(m)}function c(f,d){t.length>1&&t.sort(f||Ly),n.length>1&&n.sort(d||uf),s.length>1&&s.sort(d||uf)}function u(){for(let f=e,d=i.length;f<d;f++){let p=i[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function Dy(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new ff,i.set(n,[a])):s>=r.length?(a=new ff,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ny(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new ye};break;case"SpotLight":t={position:new P,direction:new P,color:new ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new ye,groundColor:new ye};break;case"RectAreaLight":t={color:new ye,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Uy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Oy=0;function ky(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function zy(i){let e=new Ny,t=Uy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new Be,a=new Be;function o(c){let u=0,f=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let p=0,y=0,x=0,g=0,m=0,v=0,M=0,b=0,L=0,T=0,C=0;c.sort(ky);for(let E=0,_=c.length;E<_;E++){let I=c[E],z=I.color,k=I.intensity,O=I.distance,W=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=z.r*k,f+=z.g*k,d+=z.b*k;else if(I.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(I.sh.coefficients[F],k);C++}else if(I.isDirectionalLight){let F=e.get(I);if(F.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let J=I.shadow,X=t.get(I);X.shadowIntensity=J.intensity,X.shadowBias=J.bias,X.shadowNormalBias=J.normalBias,X.shadowRadius=J.radius,X.shadowMapSize=J.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=W,n.directionalShadowMatrix[p]=I.shadow.matrix,v++}n.directional[p]=F,p++}else if(I.isSpotLight){let F=e.get(I);F.position.setFromMatrixPosition(I.matrixWorld),F.color.copy(z).multiplyScalar(k),F.distance=O,F.coneCos=Math.cos(I.angle),F.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),F.decay=I.decay,n.spot[x]=F;let J=I.shadow;if(I.map&&(n.spotLightMap[L]=I.map,L++,J.updateMatrices(I),I.castShadow&&T++),n.spotLightMatrix[x]=J.matrix,I.castShadow){let X=t.get(I);X.shadowIntensity=J.intensity,X.shadowBias=J.bias,X.shadowNormalBias=J.normalBias,X.shadowRadius=J.radius,X.shadowMapSize=J.mapSize,n.spotShadow[x]=X,n.spotShadowMap[x]=W,b++}x++}else if(I.isRectAreaLight){let F=e.get(I);F.color.copy(z).multiplyScalar(k),F.halfWidth.set(I.width*.5,0,0),F.halfHeight.set(0,I.height*.5,0),n.rectArea[g]=F,g++}else if(I.isPointLight){let F=e.get(I);if(F.color.copy(I.color).multiplyScalar(I.intensity),F.distance=I.distance,F.decay=I.decay,I.castShadow){let J=I.shadow,X=t.get(I);X.shadowIntensity=J.intensity,X.shadowBias=J.bias,X.shadowNormalBias=J.normalBias,X.shadowRadius=J.radius,X.shadowMapSize=J.mapSize,X.shadowCameraNear=J.camera.near,X.shadowCameraFar=J.camera.far,n.pointShadow[y]=X,n.pointShadowMap[y]=W,n.pointShadowMatrix[y]=I.shadow.matrix,M++}n.point[y]=F,y++}else if(I.isHemisphereLight){let F=e.get(I);F.skyColor.copy(I.color).multiplyScalar(k),F.groundColor.copy(I.groundColor).multiplyScalar(k),n.hemi[m]=F,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=d;let A=n.hash;(A.directionalLength!==p||A.pointLength!==y||A.spotLength!==x||A.rectAreaLength!==g||A.hemiLength!==m||A.numDirectionalShadows!==v||A.numPointShadows!==M||A.numSpotShadows!==b||A.numSpotMaps!==L||A.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=g,n.point.length=y,n.hemi.length=m,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=b+L-T,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=C,A.directionalLength=p,A.pointLength=y,A.spotLength=x,A.rectAreaLength=g,A.hemiLength=m,A.numDirectionalShadows=v,A.numPointShadows=M,A.numSpotShadows=b,A.numSpotMaps=L,A.numLightProbes=C,n.version=Oy++)}function l(c,u){let f=0,d=0,p=0,y=0,x=0,g=u.matrixWorldInverse;for(let m=0,v=c.length;m<v;m++){let M=c[m];if(M.isDirectionalLight){let b=n.directional[f];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),f++}else if(M.isSpotLight){let b=n.spot[p];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),p++}else if(M.isRectAreaLight){let b=n.rectArea[y];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),y++}else if(M.isPointLight){let b=n.point[d];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),d++}else if(M.isHemisphereLight){let b=n.hemi[x];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:n}}function df(i){let e=new zy(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Fy(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new df(i),e.set(s,[o])):r>=a.length?(o=new df(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Tc=class extends bi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Wp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ac=class extends bi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},By=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Gy(i,e,t){let n=new Ir,s=new oe,r=new oe,a=new vt,o=new Tc({depthPacking:Xp}),l=new Ac,c={},u=t.maxTextureSize,f={[Ui]:nn,[nn]:Ui,[Xt]:Xt},d=new Tt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:By,fragmentShader:Hy}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let y=new zt;y.setAttribute("position",new Ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new pe(y,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Af;let m=this.type;this.render=function(T,C,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let E=i.getRenderTarget(),_=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Bt),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let k=m!==xi&&this.type===xi,O=m===xi&&this.type!==xi;for(let W=0,F=T.length;W<F;W++){let J=T[W],X=J.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let ie=X.getFrameExtents();if(s.multiply(ie),r.copy(X.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ie.x),s.x=r.x*ie.x,X.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ie.y),s.y=r.y*ie.y,X.mapSize.y=r.y)),X.map===null||k===!0||O===!0){let be=this.type!==xi?{minFilter:sn,magFilter:sn}:{};X.map!==null&&X.map.dispose(),X.map=new kt(s.x,s.y,be),X.map.texture.name=J.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();let ce=X.getViewportCount();for(let be=0;be<ce;be++){let Ie=X.getViewport(be);a.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),z.viewport(a),X.updateMatrices(J,be),n=X.getFrustum(),b(C,A,X.camera,J,this.type)}X.isPointLightShadow!==!0&&this.type===xi&&v(X,A),X.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(E,_,I)};function v(T,C){let A=e.update(x);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new kt(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(C,null,A,d,x,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(C,null,A,p,x,null)}function M(T,C,A,E){let _=null,I=A.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)_=I;else if(_=A.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let z=_.uuid,k=C.uuid,O=c[z];O===void 0&&(O={},c[z]=O);let W=O[k];W===void 0&&(W=_.clone(),O[k]=W,C.addEventListener("dispose",L)),_=W}if(_.visible=C.visible,_.wireframe=C.wireframe,E===xi?_.side=C.shadowSide!==null?C.shadowSide:C.side:_.side=C.shadowSide!==null?C.shadowSide:f[C.side],_.alphaMap=C.alphaMap,_.alphaTest=C.alphaTest,_.map=C.map,_.clipShadows=C.clipShadows,_.clippingPlanes=C.clippingPlanes,_.clipIntersection=C.clipIntersection,_.displacementMap=C.displacementMap,_.displacementScale=C.displacementScale,_.displacementBias=C.displacementBias,_.wireframeLinewidth=C.wireframeLinewidth,_.linewidth=C.linewidth,A.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let z=i.properties.get(_);z.light=A}return _}function b(T,C,A,E,_){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&_===xi)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,T.matrixWorld);let k=e.update(T),O=T.material;if(Array.isArray(O)){let W=k.groups;for(let F=0,J=W.length;F<J;F++){let X=W[F],ie=O[X.materialIndex];if(ie&&ie.visible){let ce=M(T,ie,E,_);T.onBeforeShadow(i,T,C,A,k,ce,X),i.renderBufferDirect(A,null,k,ce,T,X),T.onAfterShadow(i,T,C,A,k,ce,X)}}}else if(O.visible){let W=M(T,O,E,_);T.onBeforeShadow(i,T,C,A,k,W,null),i.renderBufferDirect(A,null,k,W,T,null),T.onAfterShadow(i,T,C,A,k,W,null)}}let z=T.children;for(let k=0,O=z.length;k<O;k++)b(z[k],C,A,E,_)}function L(T){T.target.removeEventListener("dispose",L);for(let A in c){let E=c[A],_=T.target.uuid;_ in E&&(E[_].dispose(),delete E[_])}}}var Vy={[Dl]:Nl,[Ul]:zl,[Ol]:Fl,[Fs]:kl,[Nl]:Dl,[zl]:Ul,[Fl]:Ol,[kl]:Fs};function Wy(i,e){function t(){let U=!1,ue=new vt,$=null,te=new vt(0,0,0,0);return{setMask:function(ve){$!==ve&&!U&&(i.colorMask(ve,ve,ve,ve),$=ve)},setLocked:function(ve){U=ve},setClear:function(ve,ge,$e,Ct,Qt){Qt===!0&&(ve*=Ct,ge*=Ct,$e*=Ct),ue.set(ve,ge,$e,Ct),te.equals(ue)===!1&&(i.clearColor(ve,ge,$e,Ct),te.copy(ue))},reset:function(){U=!1,$=null,te.set(-1,0,0,0)}}}function n(){let U=!1,ue=!1,$=null,te=null,ve=null;return{setReversed:function(ge){if(ue!==ge){let $e=e.get("EXT_clip_control");ue?$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.ZERO_TO_ONE_EXT):$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.NEGATIVE_ONE_TO_ONE_EXT);let Ct=ve;ve=null,this.setClear(Ct)}ue=ge},getReversed:function(){return ue},setTest:function(ge){ge?he(i.DEPTH_TEST):Re(i.DEPTH_TEST)},setMask:function(ge){$!==ge&&!U&&(i.depthMask(ge),$=ge)},setFunc:function(ge){if(ue&&(ge=Vy[ge]),te!==ge){switch(ge){case Dl:i.depthFunc(i.NEVER);break;case Nl:i.depthFunc(i.ALWAYS);break;case Ul:i.depthFunc(i.LESS);break;case Fs:i.depthFunc(i.LEQUAL);break;case Ol:i.depthFunc(i.EQUAL);break;case kl:i.depthFunc(i.GEQUAL);break;case zl:i.depthFunc(i.GREATER);break;case Fl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}te=ge}},setLocked:function(ge){U=ge},setClear:function(ge){ve!==ge&&(ue&&(ge=1-ge),i.clearDepth(ge),ve=ge)},reset:function(){U=!1,$=null,te=null,ve=null,ue=!1}}}function s(){let U=!1,ue=null,$=null,te=null,ve=null,ge=null,$e=null,Ct=null,Qt=null;return{setTest:function(xt){U||(xt?he(i.STENCIL_TEST):Re(i.STENCIL_TEST))},setMask:function(xt){ue!==xt&&!U&&(i.stencilMask(xt),ue=xt)},setFunc:function(xt,Fn,ci){($!==xt||te!==Fn||ve!==ci)&&(i.stencilFunc(xt,Fn,ci),$=xt,te=Fn,ve=ci)},setOp:function(xt,Fn,ci){(ge!==xt||$e!==Fn||Ct!==ci)&&(i.stencilOp(xt,Fn,ci),ge=xt,$e=Fn,Ct=ci)},setLocked:function(xt){U=xt},setClear:function(xt){Qt!==xt&&(i.clearStencil(xt),Qt=xt)},reset:function(){U=!1,ue=null,$=null,te=null,ve=null,ge=null,$e=null,Ct=null,Qt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,u={},f={},d=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,M=null,b=null,L=null,T=null,C=new ye(0,0,0),A=0,E=!1,_=null,I=null,z=null,k=null,O=null,W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),F=!1,J=0,X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(X)[1]),F=J>=1):X.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),F=J>=2);let ie=null,ce={},be=i.getParameter(i.SCISSOR_BOX),Ie=i.getParameter(i.VIEWPORT),Ye=new vt().fromArray(be),Z=new vt().fromArray(Ie);function ae(U,ue,$,te){let ve=new Uint8Array(4),ge=i.createTexture();i.bindTexture(U,ge),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let $e=0;$e<$;$e++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(ue,0,i.RGBA,1,1,te,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(ue+$e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return ge}let Ee={};Ee[i.TEXTURE_2D]=ae(i.TEXTURE_2D,i.TEXTURE_2D,1),Ee[i.TEXTURE_CUBE_MAP]=ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ee[i.TEXTURE_2D_ARRAY]=ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ee[i.TEXTURE_3D]=ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),he(i.DEPTH_TEST),a.setFunc(Fs),Qe(!1),et(mu),he(i.CULL_FACE),B(Bt);function he(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function Re(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function ke(U,ue){return f[U]!==ue?(i.bindFramebuffer(U,ue),f[U]=ue,U===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ue),U===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ue),!0):!1}function Ve(U,ue){let $=p,te=!1;if(U){$=d.get(ue),$===void 0&&($=[],d.set(ue,$));let ve=U.textures;if($.length!==ve.length||$[0]!==i.COLOR_ATTACHMENT0){for(let ge=0,$e=ve.length;ge<$e;ge++)$[ge]=i.COLOR_ATTACHMENT0+ge;$.length=ve.length,te=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,te=!0);te&&i.drawBuffers($)}function Mt(U){return y!==U?(i.useProgram(U),y=U,!0):!1}let nt={[Un]:i.FUNC_ADD,[Tp]:i.FUNC_SUBTRACT,[Ap]:i.FUNC_REVERSE_SUBTRACT};nt[Rp]=i.MIN,nt[Cp]=i.MAX;let Et={[Js]:i.ZERO,[Ip]:i.ONE,[Pp]:i.SRC_COLOR,[Pl]:i.SRC_ALPHA,[Up]:i.SRC_ALPHA_SATURATE,[po]:i.DST_COLOR,[fo]:i.DST_ALPHA,[Lp]:i.ONE_MINUS_SRC_COLOR,[Ll]:i.ONE_MINUS_SRC_ALPHA,[Np]:i.ONE_MINUS_DST_COLOR,[Dp]:i.ONE_MINUS_DST_ALPHA,[Op]:i.CONSTANT_COLOR,[kp]:i.ONE_MINUS_CONSTANT_COLOR,[zp]:i.CONSTANT_ALPHA,[Fp]:i.ONE_MINUS_CONSTANT_ALPHA};function B(U,ue,$,te,ve,ge,$e,Ct,Qt,xt){if(U===Bt){x===!0&&(Re(i.BLEND),x=!1);return}if(x===!1&&(he(i.BLEND),x=!0),U!==rh){if(U!==g||xt!==E){if((m!==Un||b!==Un)&&(i.blendEquation(i.FUNC_ADD),m=Un,b=Un),xt)switch(U){case Us:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tn:i.blendFunc(i.ONE,i.ONE);break;case gu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Us:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case gu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}v=null,M=null,L=null,T=null,C.set(0,0,0),A=0,g=U,E=xt}return}ve=ve||ue,ge=ge||$,$e=$e||te,(ue!==m||ve!==b)&&(i.blendEquationSeparate(nt[ue],nt[ve]),m=ue,b=ve),($!==v||te!==M||ge!==L||$e!==T)&&(i.blendFuncSeparate(Et[$],Et[te],Et[ge],Et[$e]),v=$,M=te,L=ge,T=$e),(Ct.equals(C)===!1||Qt!==A)&&(i.blendColor(Ct.r,Ct.g,Ct.b,Qt),C.copy(Ct),A=Qt),g=U,E=!1}function jt(U,ue){U.side===Xt?Re(i.CULL_FACE):he(i.CULL_FACE);let $=U.side===nn;ue&&($=!$),Qe($),U.blending===Us&&U.transparent===!1?B(Bt):B(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);let te=U.stencilWrite;o.setTest(te),te&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),gt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?he(i.SAMPLE_ALPHA_TO_COVERAGE):Re(i.SAMPLE_ALPHA_TO_COVERAGE)}function Qe(U){_!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),_=U)}function et(U){U!==wp?(he(i.CULL_FACE),U!==I&&(U===mu?i.cullFace(i.BACK):U===Sp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Re(i.CULL_FACE),I=U}function De(U){U!==z&&(F&&i.lineWidth(U),z=U)}function gt(U,ue,$){U?(he(i.POLYGON_OFFSET_FILL),(k!==ue||O!==$)&&(i.polygonOffset(ue,$),k=ue,O=$)):Re(i.POLYGON_OFFSET_FILL)}function Le(U){U?he(i.SCISSOR_TEST):Re(i.SCISSOR_TEST)}function R(U){U===void 0&&(U=i.TEXTURE0+W-1),ie!==U&&(i.activeTexture(U),ie=U)}function w(U,ue,$){$===void 0&&(ie===null?$=i.TEXTURE0+W-1:$=ie);let te=ce[$];te===void 0&&(te={type:void 0,texture:void 0},ce[$]=te),(te.type!==U||te.texture!==ue)&&(ie!==$&&(i.activeTexture($),ie=$),i.bindTexture(U,ue||Ee[U]),te.type=U,te.texture=ue)}function V(){let U=ce[ie];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function we(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function fe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function je(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function re(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _e(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Fe(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ge(U){Ye.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ye.copy(U))}function Me(U){Z.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Z.copy(U))}function it(U,ue){let $=c.get(ue);$===void 0&&($=new WeakMap,c.set(ue,$));let te=$.get(U);te===void 0&&(te=i.getUniformBlockIndex(ue,U.name),$.set(U,te))}function We(U,ue){let te=c.get(ue).get(U);l.get(ue)!==te&&(i.uniformBlockBinding(ue,te,U.__bindingPointIndex),l.set(ue,te))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ie=null,ce={},f={},d=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,M=null,b=null,L=null,T=null,C=new ye(0,0,0),A=0,E=!1,_=null,I=null,z=null,k=null,O=null,Ye.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:he,disable:Re,bindFramebuffer:ke,drawBuffers:Ve,useProgram:Mt,setBlending:B,setMaterial:jt,setFlipSided:Qe,setCullFace:et,setLineWidth:De,setPolygonOffset:gt,setScissorTest:Le,activeTexture:R,bindTexture:w,unbindTexture:V,compressedTexImage2D:Q,compressedTexImage3D:se,texImage2D:_e,texImage3D:Fe,updateUBOMapping:it,uniformBlockBinding:We,texStorage2D:je,texStorage3D:re,texSubImage2D:K,texSubImage3D:we,compressedTexSubImage2D:fe,compressedTexSubImage3D:me,scissor:Ge,viewport:Me,reset:ct}}function pf(i,e,t,n){let s=Xy(n);switch(t){case Df:return i*e;case Uf:return i*e;case Of:return i*e*2;case ph:return i*e/s.components*s.byteLength;case mh:return i*e/s.components*s.byteLength;case kf:return i*e*2/s.components*s.byteLength;case gh:return i*e*2/s.components*s.byteLength;case Nf:return i*e*3/s.components*s.byteLength;case on:return i*e*4/s.components*s.byteLength;case xh:return i*e*4/s.components*s.byteLength;case Na:case Ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Oa:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Vl:case Xl:return Math.max(i,16)*Math.max(e,8)/4;case Gl:case Wl:return Math.max(i,8)*Math.max(e,8)/2;case ql:case Yl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case $l:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Kl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Jl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case jl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ql:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ec:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case tc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case nc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ic:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case sc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case rc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ac:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case oc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case lc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case za:case cc:case hc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case zf:case uc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case fc:case dc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Xy(i){switch(i){case Xn:case If:return{byteLength:1,components:1};case Tr:case Pf:case Nt:return{byteLength:2,components:1};case fh:case dh:return{byteLength:2,components:4};case rs:case uh:case gn:return{byteLength:4,components:1};case Lf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function qy(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,u=new WeakMap,f,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,w){return p?new OffscreenCanvas(R,w):Ar("canvas")}function x(R,w,V){let Q=1,se=Le(R);if((se.width>V||se.height>V)&&(Q=V/Math.max(se.width,se.height)),Q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let K=Math.floor(Q*se.width),we=Math.floor(Q*se.height);f===void 0&&(f=y(K,we));let fe=w?y(K,we):f;return fe.width=K,fe.height=we,fe.getContext("2d").drawImage(R,0,0,K,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+K+"x"+we+")."),fe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),R;return R}function g(R){return R.generateMipmaps}function m(R){i.generateMipmap(R)}function v(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(R,w,V,Q,se=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let K=w;if(w===i.RED&&(V===i.FLOAT&&(K=i.R32F),V===i.HALF_FLOAT&&(K=i.R16F),V===i.UNSIGNED_BYTE&&(K=i.R8)),w===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(K=i.R8UI),V===i.UNSIGNED_SHORT&&(K=i.R16UI),V===i.UNSIGNED_INT&&(K=i.R32UI),V===i.BYTE&&(K=i.R8I),V===i.SHORT&&(K=i.R16I),V===i.INT&&(K=i.R32I)),w===i.RG&&(V===i.FLOAT&&(K=i.RG32F),V===i.HALF_FLOAT&&(K=i.RG16F),V===i.UNSIGNED_BYTE&&(K=i.RG8)),w===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(K=i.RG8UI),V===i.UNSIGNED_SHORT&&(K=i.RG16UI),V===i.UNSIGNED_INT&&(K=i.RG32UI),V===i.BYTE&&(K=i.RG8I),V===i.SHORT&&(K=i.RG16I),V===i.INT&&(K=i.RG32I)),w===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(K=i.RGB8UI),V===i.UNSIGNED_SHORT&&(K=i.RGB16UI),V===i.UNSIGNED_INT&&(K=i.RGB32UI),V===i.BYTE&&(K=i.RGB8I),V===i.SHORT&&(K=i.RGB16I),V===i.INT&&(K=i.RGB32I)),w===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),V===i.UNSIGNED_INT&&(K=i.RGBA32UI),V===i.BYTE&&(K=i.RGBA8I),V===i.SHORT&&(K=i.RGBA16I),V===i.INT&&(K=i.RGBA32I)),w===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),w===i.RGBA){let we=se?go:st.getTransfer(Q);V===i.FLOAT&&(K=i.RGBA32F),V===i.HALF_FLOAT&&(K=i.RGBA16F),V===i.UNSIGNED_BYTE&&(K=we===mt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function b(R,w){let V;return R?w===null||w===rs||w===Oi?V=i.DEPTH24_STENCIL8:w===gn?V=i.DEPTH32F_STENCIL8:w===Tr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===rs||w===Oi?V=i.DEPTH_COMPONENT24:w===gn?V=i.DEPTH_COMPONENT32F:w===Tr&&(V=i.DEPTH_COMPONENT16),V}function L(R,w){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==sn&&R.minFilter!==Ft?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function T(R){let w=R.target;w.removeEventListener("dispose",T),A(w),w.isVideoTexture&&u.delete(w)}function C(R){let w=R.target;w.removeEventListener("dispose",C),_(w)}function A(R){let w=n.get(R);if(w.__webglInit===void 0)return;let V=R.source,Q=d.get(V);if(Q){let se=Q[w.__cacheKey];se.usedTimes--,se.usedTimes===0&&E(R),Object.keys(Q).length===0&&d.delete(V)}n.remove(R)}function E(R){let w=n.get(R);i.deleteTexture(w.__webglTexture);let V=R.source,Q=d.get(V);delete Q[w.__cacheKey],a.memory.textures--}function _(R){let w=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(w.__webglFramebuffer[Q]))for(let se=0;se<w.__webglFramebuffer[Q].length;se++)i.deleteFramebuffer(w.__webglFramebuffer[Q][se]);else i.deleteFramebuffer(w.__webglFramebuffer[Q]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[Q])}else{if(Array.isArray(w.__webglFramebuffer))for(let Q=0;Q<w.__webglFramebuffer.length;Q++)i.deleteFramebuffer(w.__webglFramebuffer[Q]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Q=0;Q<w.__webglColorRenderbuffer.length;Q++)w.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[Q]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let V=R.textures;for(let Q=0,se=V.length;Q<se;Q++){let K=n.get(V[Q]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(V[Q])}n.remove(R)}let I=0;function z(){I=0}function k(){let R=I;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function O(R){let w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function W(R,w){let V=n.get(R);if(R.isVideoTexture&&De(R),R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){let Q=R.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(V,R,w);return}}t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+w)}function F(R,w){let V=n.get(R);if(R.version>0&&V.__version!==R.version){Z(V,R,w);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+w)}function J(R,w){let V=n.get(R);if(R.version>0&&V.__version!==R.version){Z(V,R,w);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+w)}function X(R,w){let V=n.get(R);if(R.version>0&&V.__version!==R.version){ae(V,R,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+w)}let ie={[An]:i.REPEAT,[Sn]:i.CLAMP_TO_EDGE,[Hl]:i.MIRRORED_REPEAT},ce={[sn]:i.NEAREST,[Vp]:i.NEAREST_MIPMAP_NEAREST,[la]:i.NEAREST_MIPMAP_LINEAR,[Ft]:i.LINEAR,[Ko]:i.LINEAR_MIPMAP_NEAREST,[Di]:i.LINEAR_MIPMAP_LINEAR},be={[Yp]:i.NEVER,[Qp]:i.ALWAYS,[$p]:i.LESS,[Ff]:i.LEQUAL,[Zp]:i.EQUAL,[jp]:i.GEQUAL,[Kp]:i.GREATER,[Jp]:i.NOTEQUAL};function Ie(R,w){if(w.type===gn&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Ft||w.magFilter===Ko||w.magFilter===la||w.magFilter===Di||w.minFilter===Ft||w.minFilter===Ko||w.minFilter===la||w.minFilter===Di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ie[w.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ie[w.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ie[w.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ce[w.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ce[w.minFilter]),w.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,be[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===sn||w.minFilter!==la&&w.minFilter!==Di||w.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Ye(R,w){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",T));let Q=w.source,se=d.get(Q);se===void 0&&(se={},d.set(Q,se));let K=O(w);if(K!==R.__cacheKey){se[K]===void 0&&(se[K]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),se[K].usedTimes++;let we=se[R.__cacheKey];we!==void 0&&(se[R.__cacheKey].usedTimes--,we.usedTimes===0&&E(w)),R.__cacheKey=K,R.__webglTexture=se[K].texture}return V}function Z(R,w,V){let Q=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Q=i.TEXTURE_3D);let se=Ye(R,w),K=w.source;t.bindTexture(Q,R.__webglTexture,i.TEXTURE0+V);let we=n.get(K);if(K.version!==we.__version||se===!0){t.activeTexture(i.TEXTURE0+V);let fe=st.getPrimaries(st.workingColorSpace),me=w.colorSpace===Li?null:st.getPrimaries(w.colorSpace),je=w.colorSpace===Li||fe===me?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let re=x(w.image,!1,s.maxTextureSize);re=gt(w,re);let _e=r.convert(w.format,w.colorSpace),Fe=r.convert(w.type),Ge=M(w.internalFormat,_e,Fe,w.colorSpace,w.isVideoTexture);Ie(Q,w);let Me,it=w.mipmaps,We=w.isVideoTexture!==!0,ct=we.__version===void 0||se===!0,U=K.dataReady,ue=L(w,re);if(w.isDepthTexture)Ge=b(w.format===ki,w.type),ct&&(We?t.texStorage2D(i.TEXTURE_2D,1,Ge,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,Ge,re.width,re.height,0,_e,Fe,null));else if(w.isDataTexture)if(it.length>0){We&&ct&&t.texStorage2D(i.TEXTURE_2D,ue,Ge,it[0].width,it[0].height);for(let $=0,te=it.length;$<te;$++)Me=it[$],We?U&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,_e,Fe,Me.data):t.texImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,_e,Fe,Me.data);w.generateMipmaps=!1}else We?(ct&&t.texStorage2D(i.TEXTURE_2D,ue,Ge,re.width,re.height),U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re.width,re.height,_e,Fe,re.data)):t.texImage2D(i.TEXTURE_2D,0,Ge,re.width,re.height,0,_e,Fe,re.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){We&&ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,Ge,it[0].width,it[0].height,re.depth);for(let $=0,te=it.length;$<te;$++)if(Me=it[$],w.format!==on)if(_e!==null)if(We){if(U)if(w.layerUpdates.size>0){let ve=pf(Me.width,Me.height,w.format,w.type);for(let ge of w.layerUpdates){let $e=Me.data.subarray(ge*ve/Me.data.BYTES_PER_ELEMENT,(ge+1)*ve/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,ge,Me.width,Me.height,1,_e,$e)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Me.width,Me.height,re.depth,_e,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Ge,Me.width,Me.height,re.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Me.width,Me.height,re.depth,_e,Fe,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,$,Ge,Me.width,Me.height,re.depth,0,_e,Fe,Me.data)}else{We&&ct&&t.texStorage2D(i.TEXTURE_2D,ue,Ge,it[0].width,it[0].height);for(let $=0,te=it.length;$<te;$++)Me=it[$],w.format!==on?_e!==null?We?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,_e,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?U&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,_e,Fe,Me.data):t.texImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,_e,Fe,Me.data)}else if(w.isDataArrayTexture)if(We){if(ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,Ge,re.width,re.height,re.depth),U)if(w.layerUpdates.size>0){let $=pf(re.width,re.height,w.format,w.type);for(let te of w.layerUpdates){let ve=re.data.subarray(te*$/re.data.BYTES_PER_ELEMENT,(te+1)*$/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,te,re.width,re.height,1,_e,Fe,ve)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,_e,Fe,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ge,re.width,re.height,re.depth,0,_e,Fe,re.data);else if(w.isData3DTexture)We?(ct&&t.texStorage3D(i.TEXTURE_3D,ue,Ge,re.width,re.height,re.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,_e,Fe,re.data)):t.texImage3D(i.TEXTURE_3D,0,Ge,re.width,re.height,re.depth,0,_e,Fe,re.data);else if(w.isFramebufferTexture){if(ct)if(We)t.texStorage2D(i.TEXTURE_2D,ue,Ge,re.width,re.height);else{let $=re.width,te=re.height;for(let ve=0;ve<ue;ve++)t.texImage2D(i.TEXTURE_2D,ve,Ge,$,te,0,_e,Fe,null),$>>=1,te>>=1}}else if(it.length>0){if(We&&ct){let $=Le(it[0]);t.texStorage2D(i.TEXTURE_2D,ue,Ge,$.width,$.height)}for(let $=0,te=it.length;$<te;$++)Me=it[$],We?U&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,_e,Fe,Me):t.texImage2D(i.TEXTURE_2D,$,Ge,_e,Fe,Me);w.generateMipmaps=!1}else if(We){if(ct){let $=Le(re);t.texStorage2D(i.TEXTURE_2D,ue,Ge,$.width,$.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,_e,Fe,re)}else t.texImage2D(i.TEXTURE_2D,0,Ge,_e,Fe,re);g(w)&&m(Q),we.__version=K.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function ae(R,w,V){if(w.image.length!==6)return;let Q=Ye(R,w),se=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+V);let K=n.get(se);if(se.version!==K.__version||Q===!0){t.activeTexture(i.TEXTURE0+V);let we=st.getPrimaries(st.workingColorSpace),fe=w.colorSpace===Li?null:st.getPrimaries(w.colorSpace),me=w.colorSpace===Li||we===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);let je=w.isCompressedTexture||w.image[0].isCompressedTexture,re=w.image[0]&&w.image[0].isDataTexture,_e=[];for(let te=0;te<6;te++)!je&&!re?_e[te]=x(w.image[te],!0,s.maxCubemapSize):_e[te]=re?w.image[te].image:w.image[te],_e[te]=gt(w,_e[te]);let Fe=_e[0],Ge=r.convert(w.format,w.colorSpace),Me=r.convert(w.type),it=M(w.internalFormat,Ge,Me,w.colorSpace),We=w.isVideoTexture!==!0,ct=K.__version===void 0||Q===!0,U=se.dataReady,ue=L(w,Fe);Ie(i.TEXTURE_CUBE_MAP,w);let $;if(je){We&&ct&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,it,Fe.width,Fe.height);for(let te=0;te<6;te++){$=_e[te].mipmaps;for(let ve=0;ve<$.length;ve++){let ge=$[ve];w.format!==on?Ge!==null?We?U&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,0,0,ge.width,ge.height,Ge,ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,it,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,0,0,ge.width,ge.height,Ge,Me,ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,it,ge.width,ge.height,0,Ge,Me,ge.data)}}}else{if($=w.mipmaps,We&&ct){$.length>0&&ue++;let te=Le(_e[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,it,te.width,te.height)}for(let te=0;te<6;te++)if(re){We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,_e[te].width,_e[te].height,Ge,Me,_e[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,it,_e[te].width,_e[te].height,0,Ge,Me,_e[te].data);for(let ve=0;ve<$.length;ve++){let $e=$[ve].image[te].image;We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,0,0,$e.width,$e.height,Ge,Me,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,it,$e.width,$e.height,0,Ge,Me,$e.data)}}else{We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ge,Me,_e[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,it,Ge,Me,_e[te]);for(let ve=0;ve<$.length;ve++){let ge=$[ve];We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,0,0,Ge,Me,ge.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,it,Ge,Me,ge.image[te])}}}g(w)&&m(i.TEXTURE_CUBE_MAP),K.__version=se.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function Ee(R,w,V,Q,se,K){let we=r.convert(V.format,V.colorSpace),fe=r.convert(V.type),me=M(V.internalFormat,we,fe,V.colorSpace),je=n.get(w),re=n.get(V);if(re.__renderTarget=w,!je.__hasExternalTextures){let _e=Math.max(1,w.width>>K),Fe=Math.max(1,w.height>>K);se===i.TEXTURE_3D||se===i.TEXTURE_2D_ARRAY?t.texImage3D(se,K,me,_e,Fe,w.depth,0,we,fe,null):t.texImage2D(se,K,me,_e,Fe,0,we,fe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),et(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,se,re.__webglTexture,0,Qe(w)):(se===i.TEXTURE_2D||se>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,se,re.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function he(R,w,V){if(i.bindRenderbuffer(i.RENDERBUFFER,R),w.depthBuffer){let Q=w.depthTexture,se=Q&&Q.isDepthTexture?Q.type:null,K=b(w.stencilBuffer,se),we=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=Qe(w);et(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe,K,w.width,w.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,K,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,K,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,we,i.RENDERBUFFER,R)}else{let Q=w.textures;for(let se=0;se<Q.length;se++){let K=Q[se],we=r.convert(K.format,K.colorSpace),fe=r.convert(K.type),me=M(K.internalFormat,we,fe,K.colorSpace),je=Qe(w);V&&et(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,je,me,w.width,w.height):et(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,je,me,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,me,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Re(R,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Q=n.get(w.depthTexture);Q.__renderTarget=w,(!Q.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),W(w.depthTexture,0);let se=Q.__webglTexture,K=Qe(w);if(w.depthTexture.format===Os)et(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,se,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,se,0);else if(w.depthTexture.format===ki)et(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,se,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,se,0);else throw new Error("Unknown depthTexture format")}function ke(R){let w=n.get(R),V=R.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==R.depthTexture){let Q=R.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Q){let se=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Q.removeEventListener("dispose",se)};Q.addEventListener("dispose",se),w.__depthDisposeCallback=se}w.__boundDepthTexture=Q}if(R.depthTexture&&!w.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");Re(w.__webglFramebuffer,R)}else if(V){w.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[Q]),w.__webglDepthbuffer[Q]===void 0)w.__webglDepthbuffer[Q]=i.createRenderbuffer(),he(w.__webglDepthbuffer[Q],R,!1);else{let se=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=w.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,K)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),he(w.__webglDepthbuffer,R,!1);else{let Q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,se)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(R,w,V){let Q=n.get(R);w!==void 0&&Ee(Q.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&ke(R)}function Mt(R){let w=R.texture,V=n.get(R),Q=n.get(w);R.addEventListener("dispose",C);let se=R.textures,K=R.isWebGLCubeRenderTarget===!0,we=se.length>1;if(we||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=w.version,a.memory.textures++),K){V.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer[fe]=[];for(let me=0;me<w.mipmaps.length;me++)V.__webglFramebuffer[fe][me]=i.createFramebuffer()}else V.__webglFramebuffer[fe]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer=[];for(let fe=0;fe<w.mipmaps.length;fe++)V.__webglFramebuffer[fe]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(we)for(let fe=0,me=se.length;fe<me;fe++){let je=n.get(se[fe]);je.__webglTexture===void 0&&(je.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&et(R)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let fe=0;fe<se.length;fe++){let me=se[fe];V.__webglColorRenderbuffer[fe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[fe]);let je=r.convert(me.format,me.colorSpace),re=r.convert(me.type),_e=M(me.internalFormat,je,re,me.colorSpace,R.isXRRenderTarget===!0),Fe=Qe(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Fe,_e,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,V.__webglColorRenderbuffer[fe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),he(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),Ie(i.TEXTURE_CUBE_MAP,w);for(let fe=0;fe<6;fe++)if(w.mipmaps&&w.mipmaps.length>0)for(let me=0;me<w.mipmaps.length;me++)Ee(V.__webglFramebuffer[fe][me],R,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,me);else Ee(V.__webglFramebuffer[fe],R,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);g(w)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let fe=0,me=se.length;fe<me;fe++){let je=se[fe],re=n.get(je);t.bindTexture(i.TEXTURE_2D,re.__webglTexture),Ie(i.TEXTURE_2D,je),Ee(V.__webglFramebuffer,R,je,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,0),g(je)&&m(i.TEXTURE_2D)}t.unbindTexture()}else{let fe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,Q.__webglTexture),Ie(fe,w),w.mipmaps&&w.mipmaps.length>0)for(let me=0;me<w.mipmaps.length;me++)Ee(V.__webglFramebuffer[me],R,w,i.COLOR_ATTACHMENT0,fe,me);else Ee(V.__webglFramebuffer,R,w,i.COLOR_ATTACHMENT0,fe,0);g(w)&&m(fe),t.unbindTexture()}R.depthBuffer&&ke(R)}function nt(R){let w=R.textures;for(let V=0,Q=w.length;V<Q;V++){let se=w[V];if(g(se)){let K=v(R),we=n.get(se).__webglTexture;t.bindTexture(K,we),m(K),t.unbindTexture()}}}let Et=[],B=[];function jt(R){if(R.samples>0){if(et(R)===!1){let w=R.textures,V=R.width,Q=R.height,se=i.COLOR_BUFFER_BIT,K=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=n.get(R),fe=w.length>1;if(fe)for(let me=0;me<w.length;me++)t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let me=0;me<w.length;me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(se|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(se|=i.STENCIL_BUFFER_BIT)),fe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,we.__webglColorRenderbuffer[me]);let je=n.get(w[me]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,je,0)}i.blitFramebuffer(0,0,V,Q,0,0,V,Q,se,i.NEAREST),l===!0&&(Et.length=0,B.length=0,Et.push(i.COLOR_ATTACHMENT0+me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Et.push(K),B.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,B)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Et))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),fe)for(let me=0;me<w.length;me++){t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.RENDERBUFFER,we.__webglColorRenderbuffer[me]);let je=n.get(w[me]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.TEXTURE_2D,je,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let w=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Qe(R){return Math.min(s.maxSamples,R.samples)}function et(R){let w=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function De(R){let w=a.render.frame;u.get(R)!==w&&(u.set(R,w),R.update())}function gt(R,w){let V=R.colorSpace,Q=R.format,se=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==ei&&V!==Li&&(st.getTransfer(V)===mt?(Q!==on||se!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),w}function Le(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=z,this.setTexture2D=W,this.setTexture2DArray=F,this.setTexture3D=J,this.setTextureCube=X,this.rebindTextures=Ve,this.setupRenderTarget=Mt,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=jt,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=et}function Yy(i,e){function t(n,s=Li){let r,a=st.getTransfer(s);if(n===Xn)return i.UNSIGNED_BYTE;if(n===fh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===dh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Lf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===If)return i.BYTE;if(n===Pf)return i.SHORT;if(n===Tr)return i.UNSIGNED_SHORT;if(n===uh)return i.INT;if(n===rs)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===Nt)return i.HALF_FLOAT;if(n===Df)return i.ALPHA;if(n===Nf)return i.RGB;if(n===on)return i.RGBA;if(n===Uf)return i.LUMINANCE;if(n===Of)return i.LUMINANCE_ALPHA;if(n===Os)return i.DEPTH_COMPONENT;if(n===ki)return i.DEPTH_STENCIL;if(n===ph)return i.RED;if(n===mh)return i.RED_INTEGER;if(n===kf)return i.RG;if(n===gh)return i.RG_INTEGER;if(n===xh)return i.RGBA_INTEGER;if(n===Na||n===Ua||n===Oa||n===ka)if(a===mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Na)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Na)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ua)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Gl||n===Vl||n===Wl||n===Xl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Gl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Vl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Xl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ql||n===Yl||n===$l)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ql||n===Yl)return a===mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===$l)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Zl||n===Kl||n===Jl||n===jl||n===Ql||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===lc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Zl)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Kl)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Jl)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===jl)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ql)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ec)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===tc)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===nc)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ic)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===sc)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===rc)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ac)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===oc)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===lc)return a===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===za||n===cc||n===hc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===za)return a===mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===cc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===hc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===zf||n===uc||n===fc||n===dc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===za)return r.COMPRESSED_RED_RGTC1_EXT;if(n===uc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===fc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===dc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Oi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Rc=class extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},ut=class extends $t{constructor(){super(),this.isGroup=!0,this.type="Group"}},$y={type:"move"},br=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ut,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ut,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ut,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),p=.02,y=.005;c.inputState.pinching&&d>p+y?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-y&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($y)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ut;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Zy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ky=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Cc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new ln,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Tt({vertexShader:Zy,fragmentShader:Ky,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new pe(new Dt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ic=class extends zi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,d=null,p=null,y=null,x=new Cc,g=t.getContextAttributes(),m=null,v=null,M=[],b=[],L=new oe,T=null,C=new Jt;C.viewport=new vt;let A=new Jt;A.viewport=new vt;let E=[C,A],_=new Rc,I=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ae=M[Z];return ae===void 0&&(ae=new br,M[Z]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Z){let ae=M[Z];return ae===void 0&&(ae=new br,M[Z]=ae),ae.getGripSpace()},this.getHand=function(Z){let ae=M[Z];return ae===void 0&&(ae=new br,M[Z]=ae),ae.getHandSpace()};function k(Z){let ae=b.indexOf(Z.inputSource);if(ae===-1)return;let Ee=M[ae];Ee!==void 0&&(Ee.update(Z.inputSource,Z.frame,c||a),Ee.dispatchEvent({type:Z.type,data:Z.inputSource}))}function O(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",W);for(let Z=0;Z<M.length;Z++){let ae=b[Z];ae!==null&&(b[Z]=null,M[Z].disconnect(ae))}I=null,z=null,x.reset(),e.setRenderTarget(m),p=null,d=null,f=null,s=null,v=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(m=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",O),s.addEventListener("inputsourceschange",W),g.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(L),s.renderState.layers===void 0){let ae={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new kt(p.framebufferWidth,p.framebufferHeight,{format:on,type:Xn,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ae=null,Ee=null,he=null;g.depth&&(he=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=g.stencil?ki:Os,Ee=g.stencil?Oi:rs);let Re={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:r};f=new XRWebGLBinding(s,t),d=f.createProjectionLayer(Re),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new kt(d.textureWidth,d.textureHeight,{format:on,type:Xn,depthTexture:new Xs(d.textureWidth,d.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ye.setContext(s),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function W(Z){for(let ae=0;ae<Z.removed.length;ae++){let Ee=Z.removed[ae],he=b.indexOf(Ee);he>=0&&(b[he]=null,M[he].disconnect(Ee))}for(let ae=0;ae<Z.added.length;ae++){let Ee=Z.added[ae],he=b.indexOf(Ee);if(he===-1){for(let ke=0;ke<M.length;ke++)if(ke>=b.length){b.push(Ee),he=ke;break}else if(b[ke]===null){b[ke]=Ee,he=ke;break}if(he===-1)break}let Re=M[he];Re&&Re.connect(Ee)}}let F=new P,J=new P;function X(Z,ae,Ee){F.setFromMatrixPosition(ae.matrixWorld),J.setFromMatrixPosition(Ee.matrixWorld);let he=F.distanceTo(J),Re=ae.projectionMatrix.elements,ke=Ee.projectionMatrix.elements,Ve=Re[14]/(Re[10]-1),Mt=Re[14]/(Re[10]+1),nt=(Re[9]+1)/Re[5],Et=(Re[9]-1)/Re[5],B=(Re[8]-1)/Re[0],jt=(ke[8]+1)/ke[0],Qe=Ve*B,et=Ve*jt,De=he/(-B+jt),gt=De*-B;if(ae.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(gt),Z.translateZ(De),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Re[10]===-1)Z.projectionMatrix.copy(ae.projectionMatrix),Z.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{let Le=Ve+De,R=Mt+De,w=Qe-gt,V=et+(he-gt),Q=nt*Mt/R*Le,se=Et*Mt/R*Le;Z.projectionMatrix.makePerspective(w,V,Q,se,Le,R),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ie(Z,ae){ae===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ae.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ae=Z.near,Ee=Z.far;x.texture!==null&&(x.depthNear>0&&(ae=x.depthNear),x.depthFar>0&&(Ee=x.depthFar)),_.near=A.near=C.near=ae,_.far=A.far=C.far=Ee,(I!==_.near||z!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),I=_.near,z=_.far),C.layers.mask=Z.layers.mask|2,A.layers.mask=Z.layers.mask|4,_.layers.mask=C.layers.mask|A.layers.mask;let he=Z.parent,Re=_.cameras;ie(_,he);for(let ke=0;ke<Re.length;ke++)ie(Re[ke],he);Re.length===2?X(_,C,A):_.projectionMatrix.copy(C.projectionMatrix),ce(Z,_,he)};function ce(Z,ae,Ee){Ee===null?Z.matrix.copy(ae.matrixWorld):(Z.matrix.copy(Ee.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ae.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ae.projectionMatrix),Z.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ha*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(_)};let be=null;function Ie(Z,ae){if(u=ae.getViewerPose(c||a),y=ae,u!==null){let Ee=u.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let he=!1;Ee.length!==_.cameras.length&&(_.cameras.length=0,he=!0);for(let ke=0;ke<Ee.length;ke++){let Ve=Ee[ke],Mt=null;if(p!==null)Mt=p.getViewport(Ve);else{let Et=f.getViewSubImage(d,Ve);Mt=Et.viewport,ke===0&&(e.setRenderTargetTextures(v,Et.colorTexture,d.ignoreDepthValues?void 0:Et.depthStencilTexture),e.setRenderTarget(v))}let nt=E[ke];nt===void 0&&(nt=new Jt,nt.layers.enable(ke),nt.viewport=new vt,E[ke]=nt),nt.matrix.fromArray(Ve.transform.matrix),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.projectionMatrix.fromArray(Ve.projectionMatrix),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert(),nt.viewport.set(Mt.x,Mt.y,Mt.width,Mt.height),ke===0&&(_.matrix.copy(nt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),he===!0&&_.cameras.push(nt)}let Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")){let ke=f.getDepthInformation(Ee[0]);ke&&ke.isValid&&ke.texture&&x.init(e,ke,s.renderState)}}for(let Ee=0;Ee<M.length;Ee++){let he=b[Ee],Re=M[Ee];he!==null&&Re!==void 0&&Re.update(he,ae,c||a)}be&&be(Z,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),y=null}let Ye=new Vf;Ye.setAnimationLoop(Ie),this.setAnimationLoop=function(Z){be=Z},this.dispose=function(){}}},ts=new Yt,Jy=new Be;function jy(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Gf(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,v,M,b){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),f(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&p(g,m,b)):m.isMeshMatcapMaterial?(r(g,m),y(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,v,M):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===nn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===nn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let v=e.get(m),M=v.envMap,b=v.envMapRotation;M&&(g.envMap.value=M,ts.copy(b),ts.x*=-1,ts.y*=-1,ts.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ts.y*=-1,ts.z*=-1),g.envMapRotation.value.setFromMatrix4(Jy.makeRotationFromEuler(ts)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,v,M){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*v,g.scale.value=M*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function p(g,m,v){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===nn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function y(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let v=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Qy(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){let b=M.program;n.uniformBlockBinding(v,b)}function c(v,M){let b=s[v.id];b===void 0&&(y(v),b=u(v),s[v.id]=b,v.addEventListener("dispose",g));let L=M.program;n.updateUBOMapping(v,L);let T=e.render.frame;r[v.id]!==T&&(d(v),r[v.id]=T)}function u(v){let M=f();v.__bindingPointIndex=M;let b=i.createBuffer(),L=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,L,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let M=s[v.id],b=v.uniforms,L=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,C=b.length;T<C;T++){let A=Array.isArray(b[T])?b[T]:[b[T]];for(let E=0,_=A.length;E<_;E++){let I=A[E];if(p(I,T,E,L)===!0){let z=I.__offset,k=Array.isArray(I.value)?I.value:[I.value],O=0;for(let W=0;W<k.length;W++){let F=k[W],J=x(F);typeof F=="number"||typeof F=="boolean"?(I.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,z+O,I.__data)):F.isMatrix3?(I.__data[0]=F.elements[0],I.__data[1]=F.elements[1],I.__data[2]=F.elements[2],I.__data[3]=0,I.__data[4]=F.elements[3],I.__data[5]=F.elements[4],I.__data[6]=F.elements[5],I.__data[7]=0,I.__data[8]=F.elements[6],I.__data[9]=F.elements[7],I.__data[10]=F.elements[8],I.__data[11]=0):(F.toArray(I.__data,O),O+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,M,b,L){let T=v.value,C=M+"_"+b;if(L[C]===void 0)return typeof T=="number"||typeof T=="boolean"?L[C]=T:L[C]=T.clone(),!0;{let A=L[C];if(typeof T=="number"||typeof T=="boolean"){if(A!==T)return L[C]=T,!0}else if(A.equals(T)===!1)return A.copy(T),!0}return!1}function y(v){let M=v.uniforms,b=0,L=16;for(let C=0,A=M.length;C<A;C++){let E=Array.isArray(M[C])?M[C]:[M[C]];for(let _=0,I=E.length;_<I;_++){let z=E[_],k=Array.isArray(z.value)?z.value:[z.value];for(let O=0,W=k.length;O<W;O++){let F=k[O],J=x(F),X=b%L,ie=X%J.boundary,ce=X+ie;b+=ie,ce!==0&&L-ce<J.storage&&(b+=L-ce),z.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=b,b+=J.storage}}}let T=b%L;return T>0&&(b+=L-T),v.__size=b,v.__cache={},this}function x(v){let M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function g(v){let M=v.target;M.removeEventListener("dispose",g);let b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function m(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:m}}var $a=class{constructor(e={}){let{canvas:t=tm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let y=new Uint32Array(4),x=new Int32Array(4),g=null,m=null,v=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Kt,this.toneMapping=Ni,this.toneMappingExposure=1;let b=this,L=!1,T=0,C=0,A=null,E=-1,_=null,I=new vt,z=new vt,k=null,O=new ye(0),W=0,F=t.width,J=t.height,X=1,ie=null,ce=null,be=new vt(0,0,F,J),Ie=new vt(0,0,F,J),Ye=!1,Z=new Ir,ae=!1,Ee=!1,he=new Be,Re=new Be,ke=new P,Ve=new vt,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},nt=!1;function Et(){return A===null?X:1}let B=n;function jt(S,H){return t.getContext(S,H)}try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ih}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",ve,!1),t.addEventListener("webglcontextcreationerror",ge,!1),B===null){let H="webgl2";if(B=jt(H,S),B===null)throw jt(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Qe,et,De,gt,Le,R,w,V,Q,se,K,we,fe,me,je,re,_e,Fe,Ge,Me,it,We,ct,U;function ue(){Qe=new mx(B),Qe.init(),We=new Yy(B,Qe),et=new cx(B,Qe,e,We),De=new Wy(B,Qe),et.reverseDepthBuffer&&d&&De.buffers.depth.setReversed(!0),gt=new yx(B),Le=new Py,R=new qy(B,Qe,De,Le,et,We,gt),w=new ux(b),V=new px(b),Q=new Sm(B),ct=new ox(B,Q),se=new gx(B,Q,gt,ct),K=new _x(B,se,Q,gt),Ge=new vx(B,et,R),re=new hx(Le),we=new Iy(b,w,V,Qe,et,ct,re),fe=new jy(b,Le),me=new Dy,je=new Fy(Qe),Fe=new ax(b,w,V,De,K,p,l),_e=new Gy(b,K,et),U=new Qy(B,gt,et,De),Me=new lx(B,Qe,gt),it=new xx(B,Qe,gt),gt.programs=we.programs,b.capabilities=et,b.extensions=Qe,b.properties=Le,b.renderLists=me,b.shadowMap=_e,b.state=De,b.info=gt}ue();let $=new Ic(b,B);this.xr=$,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let S=Qe.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=Qe.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(S){S!==void 0&&(X=S,this.setSize(F,J,!1))},this.getSize=function(S){return S.set(F,J)},this.setSize=function(S,H,q=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=S,J=H,t.width=Math.floor(S*X),t.height=Math.floor(H*X),q===!0&&(t.style.width=S+"px",t.style.height=H+"px"),this.setViewport(0,0,S,H)},this.getDrawingBufferSize=function(S){return S.set(F*X,J*X).floor()},this.setDrawingBufferSize=function(S,H,q){F=S,J=H,X=q,t.width=Math.floor(S*q),t.height=Math.floor(H*q),this.setViewport(0,0,S,H)},this.getCurrentViewport=function(S){return S.copy(I)},this.getViewport=function(S){return S.copy(be)},this.setViewport=function(S,H,q,Y){S.isVector4?be.set(S.x,S.y,S.z,S.w):be.set(S,H,q,Y),De.viewport(I.copy(be).multiplyScalar(X).round())},this.getScissor=function(S){return S.copy(Ie)},this.setScissor=function(S,H,q,Y){S.isVector4?Ie.set(S.x,S.y,S.z,S.w):Ie.set(S,H,q,Y),De.scissor(z.copy(Ie).multiplyScalar(X).round())},this.getScissorTest=function(){return Ye},this.setScissorTest=function(S){De.setScissorTest(Ye=S)},this.setOpaqueSort=function(S){ie=S},this.setTransparentSort=function(S){ce=S},this.getClearColor=function(S){return S.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor.apply(Fe,arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha.apply(Fe,arguments)},this.clear=function(S=!0,H=!0,q=!0){let Y=0;if(S){let G=!1;if(A!==null){let le=A.texture.format;G=le===xh||le===gh||le===mh}if(G){let le=A.texture.type,xe=le===Xn||le===rs||le===Tr||le===Oi||le===fh||le===dh,Se=Fe.getClearColor(),Te=Fe.getClearAlpha(),Xe=Se.r,Ze=Se.g,Ae=Se.b;xe?(y[0]=Xe,y[1]=Ze,y[2]=Ae,y[3]=Te,B.clearBufferuiv(B.COLOR,0,y)):(x[0]=Xe,x[1]=Ze,x[2]=Ae,x[3]=Te,B.clearBufferiv(B.COLOR,0,x))}else Y|=B.COLOR_BUFFER_BIT}H&&(Y|=B.DEPTH_BUFFER_BIT),q&&(Y|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",ve,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),me.dispose(),je.dispose(),Le.dispose(),w.dispose(),V.dispose(),K.dispose(),ct.dispose(),U.dispose(),we.dispose(),$.dispose(),$.removeEventListener("sessionstart",su),$.removeEventListener("sessionend",ru),Zi.stop()};function te(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;let S=gt.autoReset,H=_e.enabled,q=_e.autoUpdate,Y=_e.needsUpdate,G=_e.type;ue(),gt.autoReset=S,_e.enabled=H,_e.autoUpdate=q,_e.needsUpdate=Y,_e.type=G}function ge(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function $e(S){let H=S.target;H.removeEventListener("dispose",$e),Ct(H)}function Ct(S){Qt(S),Le.remove(S)}function Qt(S){let H=Le.get(S).programs;H!==void 0&&(H.forEach(function(q){we.releaseProgram(q)}),S.isShaderMaterial&&we.releaseShaderCache(S))}this.renderBufferDirect=function(S,H,q,Y,G,le){H===null&&(H=Mt);let xe=G.isMesh&&G.matrixWorld.determinant()<0,Se=pp(S,H,q,Y,G);De.setMaterial(Y,xe);let Te=q.index,Xe=1;if(Y.wireframe===!0){if(Te=se.getWireframeAttribute(q),Te===void 0)return;Xe=2}let Ze=q.drawRange,Ae=q.attributes.position,ht=Ze.start*Xe,bt=(Ze.start+Ze.count)*Xe;le!==null&&(ht=Math.max(ht,le.start*Xe),bt=Math.min(bt,(le.start+le.count)*Xe)),Te!==null?(ht=Math.max(ht,0),bt=Math.min(bt,Te.count)):Ae!=null&&(ht=Math.max(ht,0),bt=Math.min(bt,Ae.count));let wt=bt-ht;if(wt<0||wt===1/0)return;ct.setup(G,Y,Se,q,Te);let pn,dt=Me;if(Te!==null&&(pn=Q.get(Te),dt=it,dt.setIndex(pn)),G.isMesh)Y.wireframe===!0?(De.setLineWidth(Y.wireframeLinewidth*Et()),dt.setMode(B.LINES)):dt.setMode(B.TRIANGLES);else if(G.isLine){let Ce=Y.linewidth;Ce===void 0&&(Ce=1),De.setLineWidth(Ce*Et()),G.isLineSegments?dt.setMode(B.LINES):G.isLineLoop?dt.setMode(B.LINE_LOOP):dt.setMode(B.LINE_STRIP)}else G.isPoints?dt.setMode(B.POINTS):G.isSprite&&dt.setMode(B.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)dt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(Qe.get("WEBGL_multi_draw"))dt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Ce=G._multiDrawStarts,hi=G._multiDrawCounts,pt=G._multiDrawCount,Bn=Te?Q.get(Te).bytesPerElement:1,ys=Le.get(Y).currentProgram.getUniforms();for(let Mn=0;Mn<pt;Mn++)ys.setValue(B,"_gl_DrawID",Mn),dt.render(Ce[Mn]/Bn,hi[Mn])}else if(G.isInstancedMesh)dt.renderInstances(ht,wt,G.count);else if(q.isInstancedBufferGeometry){let Ce=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,hi=Math.min(q.instanceCount,Ce);dt.renderInstances(ht,wt,hi)}else dt.render(ht,wt)};function xt(S,H,q){S.transparent===!0&&S.side===Xt&&S.forceSinglePass===!1?(S.side=nn,S.needsUpdate=!0,sa(S,H,q),S.side=Ui,S.needsUpdate=!0,sa(S,H,q),S.side=Xt):sa(S,H,q)}this.compile=function(S,H,q=null){q===null&&(q=S),m=je.get(q),m.init(H),M.push(m),q.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(m.pushLight(G),G.castShadow&&m.pushShadow(G))}),S!==q&&S.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(m.pushLight(G),G.castShadow&&m.pushShadow(G))}),m.setupLights();let Y=new Set;return S.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let le=G.material;if(le)if(Array.isArray(le))for(let xe=0;xe<le.length;xe++){let Se=le[xe];xt(Se,q,G),Y.add(Se)}else xt(le,q,G),Y.add(le)}),M.pop(),m=null,Y},this.compileAsync=function(S,H,q=null){let Y=this.compile(S,H,q);return new Promise(G=>{function le(){if(Y.forEach(function(xe){Le.get(xe).currentProgram.isReady()&&Y.delete(xe)}),Y.size===0){G(S);return}setTimeout(le,10)}Qe.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let Fn=null;function ci(S){Fn&&Fn(S)}function su(){Zi.stop()}function ru(){Zi.start()}let Zi=new Vf;Zi.setAnimationLoop(ci),typeof self<"u"&&Zi.setContext(self),this.setAnimationLoop=function(S){Fn=S,$.setAnimationLoop(S),S===null?Zi.stop():Zi.start()},$.addEventListener("sessionstart",su),$.addEventListener("sessionend",ru),this.render=function(S,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(H),H=$.getCamera()),S.isScene===!0&&S.onBeforeRender(b,S,H,A),m=je.get(S,M.length),m.init(H),M.push(m),Re.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),Z.setFromProjectionMatrix(Re),Ee=this.localClippingEnabled,ae=re.init(this.clippingPlanes,Ee),g=me.get(S,v.length),g.init(),v.push(g),$.enabled===!0&&$.isPresenting===!0){let le=b.xr.getDepthSensingMesh();le!==null&&Yo(le,H,-1/0,b.sortObjects)}Yo(S,H,0,b.sortObjects),g.finish(),b.sortObjects===!0&&g.sort(ie,ce),nt=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,nt&&Fe.addToRenderList(g,S),this.info.render.frame++,ae===!0&&re.beginShadows();let q=m.state.shadowsArray;_e.render(q,S,H),ae===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=g.opaque,G=g.transmissive;if(m.setupLights(),H.isArrayCamera){let le=H.cameras;if(G.length>0)for(let xe=0,Se=le.length;xe<Se;xe++){let Te=le[xe];ou(Y,G,S,Te)}nt&&Fe.render(S);for(let xe=0,Se=le.length;xe<Se;xe++){let Te=le[xe];au(g,S,Te,Te.viewport)}}else G.length>0&&ou(Y,G,S,H),nt&&Fe.render(S),au(g,S,H);A!==null&&(R.updateMultisampleRenderTarget(A),R.updateRenderTargetMipmap(A)),S.isScene===!0&&S.onAfterRender(b,S,H),ct.resetDefaultState(),E=-1,_=null,M.pop(),M.length>0?(m=M[M.length-1],ae===!0&&re.setGlobalState(b.clippingPlanes,m.state.camera)):m=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Yo(S,H,q,Y){if(S.visible===!1)return;if(S.layers.test(H.layers)){if(S.isGroup)q=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(H);else if(S.isLight)m.pushLight(S),S.castShadow&&m.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Z.intersectsSprite(S)){Y&&Ve.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Re);let xe=K.update(S),Se=S.material;Se.visible&&g.push(S,xe,Se,q,Ve.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Z.intersectsObject(S))){let xe=K.update(S),Se=S.material;if(Y&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ve.copy(S.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),Ve.copy(xe.boundingSphere.center)),Ve.applyMatrix4(S.matrixWorld).applyMatrix4(Re)),Array.isArray(Se)){let Te=xe.groups;for(let Xe=0,Ze=Te.length;Xe<Ze;Xe++){let Ae=Te[Xe],ht=Se[Ae.materialIndex];ht&&ht.visible&&g.push(S,xe,ht,q,Ve.z,Ae)}}else Se.visible&&g.push(S,xe,Se,q,Ve.z,null)}}let le=S.children;for(let xe=0,Se=le.length;xe<Se;xe++)Yo(le[xe],H,q,Y)}function au(S,H,q,Y){let G=S.opaque,le=S.transmissive,xe=S.transparent;m.setupLightsView(q),ae===!0&&re.setGlobalState(b.clippingPlanes,q),Y&&De.viewport(I.copy(Y)),G.length>0&&ia(G,H,q),le.length>0&&ia(le,H,q),xe.length>0&&ia(xe,H,q),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function ou(S,H,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[Y.id]===void 0&&(m.state.transmissionRenderTarget[Y.id]=new kt(1,1,{generateMipmaps:!0,type:Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float")?Nt:Xn,minFilter:Di,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:st.workingColorSpace}));let le=m.state.transmissionRenderTarget[Y.id],xe=Y.viewport||I;le.setSize(xe.z,xe.w);let Se=b.getRenderTarget();b.setRenderTarget(le),b.getClearColor(O),W=b.getClearAlpha(),W<1&&b.setClearColor(16777215,.5),b.clear(),nt&&Fe.render(q);let Te=b.toneMapping;b.toneMapping=Ni;let Xe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),m.setupLightsView(Y),ae===!0&&re.setGlobalState(b.clippingPlanes,Y),ia(S,q,Y),R.updateMultisampleRenderTarget(le),R.updateRenderTargetMipmap(le),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let Ae=0,ht=H.length;Ae<ht;Ae++){let bt=H[Ae],wt=bt.object,pn=bt.geometry,dt=bt.material,Ce=bt.group;if(dt.side===Xt&&wt.layers.test(Y.layers)){let hi=dt.side;dt.side=nn,dt.needsUpdate=!0,lu(wt,q,Y,pn,dt,Ce),dt.side=hi,dt.needsUpdate=!0,Ze=!0}}Ze===!0&&(R.updateMultisampleRenderTarget(le),R.updateRenderTargetMipmap(le))}b.setRenderTarget(Se),b.setClearColor(O,W),Xe!==void 0&&(Y.viewport=Xe),b.toneMapping=Te}function ia(S,H,q){let Y=H.isScene===!0?H.overrideMaterial:null;for(let G=0,le=S.length;G<le;G++){let xe=S[G],Se=xe.object,Te=xe.geometry,Xe=Y===null?xe.material:Y,Ze=xe.group;Se.layers.test(q.layers)&&lu(Se,H,q,Te,Xe,Ze)}}function lu(S,H,q,Y,G,le){S.onBeforeRender(b,H,q,Y,G,le),S.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),G.onBeforeRender(b,H,q,Y,S,le),G.transparent===!0&&G.side===Xt&&G.forceSinglePass===!1?(G.side=nn,G.needsUpdate=!0,b.renderBufferDirect(q,H,Y,G,S,le),G.side=Ui,G.needsUpdate=!0,b.renderBufferDirect(q,H,Y,G,S,le),G.side=Xt):b.renderBufferDirect(q,H,Y,G,S,le),S.onAfterRender(b,H,q,Y,G,le)}function sa(S,H,q){H.isScene!==!0&&(H=Mt);let Y=Le.get(S),G=m.state.lights,le=m.state.shadowsArray,xe=G.state.version,Se=we.getParameters(S,G.state,le,H,q),Te=we.getProgramCacheKey(Se),Xe=Y.programs;Y.environment=S.isMeshStandardMaterial?H.environment:null,Y.fog=H.fog,Y.envMap=(S.isMeshStandardMaterial?V:w).get(S.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&S.envMap===null?H.environmentRotation:S.envMapRotation,Xe===void 0&&(S.addEventListener("dispose",$e),Xe=new Map,Y.programs=Xe);let Ze=Xe.get(Te);if(Ze!==void 0){if(Y.currentProgram===Ze&&Y.lightsStateVersion===xe)return hu(S,Se),Ze}else Se.uniforms=we.getUniforms(S),S.onBeforeCompile(Se,b),Ze=we.acquireProgram(Se,Te),Xe.set(Te,Ze),Y.uniforms=Se.uniforms;let Ae=Y.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ae.clippingPlanes=re.uniform),hu(S,Se),Y.needsLights=gp(S),Y.lightsStateVersion=xe,Y.needsLights&&(Ae.ambientLightColor.value=G.state.ambient,Ae.lightProbe.value=G.state.probe,Ae.directionalLights.value=G.state.directional,Ae.directionalLightShadows.value=G.state.directionalShadow,Ae.spotLights.value=G.state.spot,Ae.spotLightShadows.value=G.state.spotShadow,Ae.rectAreaLights.value=G.state.rectArea,Ae.ltc_1.value=G.state.rectAreaLTC1,Ae.ltc_2.value=G.state.rectAreaLTC2,Ae.pointLights.value=G.state.point,Ae.pointLightShadows.value=G.state.pointShadow,Ae.hemisphereLights.value=G.state.hemi,Ae.directionalShadowMap.value=G.state.directionalShadowMap,Ae.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ae.spotShadowMap.value=G.state.spotShadowMap,Ae.spotLightMatrix.value=G.state.spotLightMatrix,Ae.spotLightMap.value=G.state.spotLightMap,Ae.pointShadowMap.value=G.state.pointShadowMap,Ae.pointShadowMatrix.value=G.state.pointShadowMatrix),Y.currentProgram=Ze,Y.uniformsList=null,Ze}function cu(S){if(S.uniformsList===null){let H=S.currentProgram.getUniforms();S.uniformsList=zs.seqWithValue(H.seq,S.uniforms)}return S.uniformsList}function hu(S,H){let q=Le.get(S);q.outputColorSpace=H.outputColorSpace,q.batching=H.batching,q.batchingColor=H.batchingColor,q.instancing=H.instancing,q.instancingColor=H.instancingColor,q.instancingMorph=H.instancingMorph,q.skinning=H.skinning,q.morphTargets=H.morphTargets,q.morphNormals=H.morphNormals,q.morphColors=H.morphColors,q.morphTargetsCount=H.morphTargetsCount,q.numClippingPlanes=H.numClippingPlanes,q.numIntersection=H.numClipIntersection,q.vertexAlphas=H.vertexAlphas,q.vertexTangents=H.vertexTangents,q.toneMapping=H.toneMapping}function pp(S,H,q,Y,G){H.isScene!==!0&&(H=Mt),R.resetTextureUnits();let le=H.fog,xe=Y.isMeshStandardMaterial?H.environment:null,Se=A===null?b.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ei,Te=(Y.isMeshStandardMaterial?V:w).get(Y.envMap||xe),Xe=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ze=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ae=!!q.morphAttributes.position,ht=!!q.morphAttributes.normal,bt=!!q.morphAttributes.color,wt=Ni;Y.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(wt=b.toneMapping);let pn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,dt=pn!==void 0?pn.length:0,Ce=Le.get(Y),hi=m.state.lights;if(ae===!0&&(Ee===!0||S!==_)){let Dn=S===_&&Y.id===E;re.setState(Y,S,Dn)}let pt=!1;Y.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==hi.state.version||Ce.outputColorSpace!==Se||G.isBatchedMesh&&Ce.batching===!1||!G.isBatchedMesh&&Ce.batching===!0||G.isBatchedMesh&&Ce.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ce.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ce.instancing===!1||!G.isInstancedMesh&&Ce.instancing===!0||G.isSkinnedMesh&&Ce.skinning===!1||!G.isSkinnedMesh&&Ce.skinning===!0||G.isInstancedMesh&&Ce.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ce.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ce.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ce.instancingMorph===!1&&G.morphTexture!==null||Ce.envMap!==Te||Y.fog===!0&&Ce.fog!==le||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==re.numPlanes||Ce.numIntersection!==re.numIntersection)||Ce.vertexAlphas!==Xe||Ce.vertexTangents!==Ze||Ce.morphTargets!==Ae||Ce.morphNormals!==ht||Ce.morphColors!==bt||Ce.toneMapping!==wt||Ce.morphTargetsCount!==dt)&&(pt=!0):(pt=!0,Ce.__version=Y.version);let Bn=Ce.currentProgram;pt===!0&&(Bn=sa(Y,H,G));let ys=!1,Mn=!1,hr=!1,St=Bn.getUniforms(),Kn=Ce.uniforms;if(De.useProgram(Bn.program)&&(ys=!0,Mn=!0,hr=!0),Y.id!==E&&(E=Y.id,Mn=!0),ys||_!==S){De.buffers.depth.getReversed()?(he.copy(S.projectionMatrix),im(he),sm(he),St.setValue(B,"projectionMatrix",he)):St.setValue(B,"projectionMatrix",S.projectionMatrix),St.setValue(B,"viewMatrix",S.matrixWorldInverse);let wi=St.map.cameraPosition;wi!==void 0&&wi.setValue(B,ke.setFromMatrixPosition(S.matrixWorld)),et.logarithmicDepthBuffer&&St.setValue(B,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&St.setValue(B,"isOrthographic",S.isOrthographicCamera===!0),_!==S&&(_=S,Mn=!0,hr=!0)}if(G.isSkinnedMesh){St.setOptional(B,G,"bindMatrix"),St.setOptional(B,G,"bindMatrixInverse");let Dn=G.skeleton;Dn&&(Dn.boneTexture===null&&Dn.computeBoneTexture(),St.setValue(B,"boneTexture",Dn.boneTexture,R))}G.isBatchedMesh&&(St.setOptional(B,G,"batchingTexture"),St.setValue(B,"batchingTexture",G._matricesTexture,R),St.setOptional(B,G,"batchingIdTexture"),St.setValue(B,"batchingIdTexture",G._indirectTexture,R),St.setOptional(B,G,"batchingColorTexture"),G._colorsTexture!==null&&St.setValue(B,"batchingColorTexture",G._colorsTexture,R));let ur=q.morphAttributes;if((ur.position!==void 0||ur.normal!==void 0||ur.color!==void 0)&&Ge.update(G,q,Bn),(Mn||Ce.receiveShadow!==G.receiveShadow)&&(Ce.receiveShadow=G.receiveShadow,St.setValue(B,"receiveShadow",G.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Kn.envMap.value=Te,Kn.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&H.environment!==null&&(Kn.envMapIntensity.value=H.environmentIntensity),Mn&&(St.setValue(B,"toneMappingExposure",b.toneMappingExposure),Ce.needsLights&&mp(Kn,hr),le&&Y.fog===!0&&fe.refreshFogUniforms(Kn,le),fe.refreshMaterialUniforms(Kn,Y,X,J,m.state.transmissionRenderTarget[S.id]),zs.upload(B,cu(Ce),Kn,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(zs.upload(B,cu(Ce),Kn,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&St.setValue(B,"center",G.center),St.setValue(B,"modelViewMatrix",G.modelViewMatrix),St.setValue(B,"normalMatrix",G.normalMatrix),St.setValue(B,"modelMatrix",G.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Dn=Y.uniformsGroups;for(let wi=0,Si=Dn.length;wi<Si;wi++){let uu=Dn[wi];U.update(uu,Bn),U.bind(uu,Bn)}}return Bn}function mp(S,H){S.ambientLightColor.needsUpdate=H,S.lightProbe.needsUpdate=H,S.directionalLights.needsUpdate=H,S.directionalLightShadows.needsUpdate=H,S.pointLights.needsUpdate=H,S.pointLightShadows.needsUpdate=H,S.spotLights.needsUpdate=H,S.spotLightShadows.needsUpdate=H,S.rectAreaLights.needsUpdate=H,S.hemisphereLights.needsUpdate=H}function gp(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(S,H,q){Le.get(S.texture).__webglTexture=H,Le.get(S.depthTexture).__webglTexture=q;let Y=Le.get(S);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||Qe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,H){let q=Le.get(S);q.__webglFramebuffer=H,q.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(S,H=0,q=0){A=S,T=H,C=q;let Y=!0,G=null,le=!1,xe=!1;if(S){let Te=Le.get(S);if(Te.__useDefaultFramebuffer!==void 0)De.bindFramebuffer(B.FRAMEBUFFER,null),Y=!1;else if(Te.__webglFramebuffer===void 0)R.setupRenderTarget(S);else if(Te.__hasExternalTextures)R.rebindTextures(S,Le.get(S.texture).__webglTexture,Le.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Ae=S.depthTexture;if(Te.__boundDepthTexture!==Ae){if(Ae!==null&&Le.has(Ae)&&(S.width!==Ae.image.width||S.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(S)}}let Xe=S.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(xe=!0);let Ze=Le.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ze[H])?G=Ze[H][q]:G=Ze[H],le=!0):S.samples>0&&R.useMultisampledRTT(S)===!1?G=Le.get(S).__webglMultisampledFramebuffer:Array.isArray(Ze)?G=Ze[q]:G=Ze,I.copy(S.viewport),z.copy(S.scissor),k=S.scissorTest}else I.copy(be).multiplyScalar(X).floor(),z.copy(Ie).multiplyScalar(X).floor(),k=Ye;if(De.bindFramebuffer(B.FRAMEBUFFER,G)&&Y&&De.drawBuffers(S,G),De.viewport(I),De.scissor(z),De.setScissorTest(k),le){let Te=Le.get(S.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+H,Te.__webglTexture,q)}else if(xe){let Te=Le.get(S.texture),Xe=H||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Te.__webglTexture,q||0,Xe)}E=-1},this.readRenderTargetPixels=function(S,H,q,Y,G,le,xe){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Le.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){De.bindFramebuffer(B.FRAMEBUFFER,Se);try{let Te=S.texture,Xe=Te.format,Ze=Te.type;if(!et.textureFormatReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=S.width-Y&&q>=0&&q<=S.height-G&&B.readPixels(H,q,Y,G,We.convert(Xe),We.convert(Ze),le)}finally{let Te=A!==null?Le.get(A).__webglFramebuffer:null;De.bindFramebuffer(B.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(S,H,q,Y,G,le,xe){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Le.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){let Te=S.texture,Xe=Te.format,Ze=Te.type;if(!et.textureFormatReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=S.width-Y&&q>=0&&q<=S.height-G){De.bindFramebuffer(B.FRAMEBUFFER,Se);let Ae=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ae),B.bufferData(B.PIXEL_PACK_BUFFER,le.byteLength,B.STREAM_READ),B.readPixels(H,q,Y,G,We.convert(Xe),We.convert(Ze),0);let ht=A!==null?Le.get(A).__webglFramebuffer:null;De.bindFramebuffer(B.FRAMEBUFFER,ht);let bt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await nm(B,bt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ae),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,le),B.deleteBuffer(Ae),B.deleteSync(bt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,H=null,q=0){S.isTexture!==!0&&(_r("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,S=arguments[1]);let Y=Math.pow(2,-q),G=Math.floor(S.image.width*Y),le=Math.floor(S.image.height*Y),xe=H!==null?H.x:0,Se=H!==null?H.y:0;R.setTexture2D(S,0),B.copyTexSubImage2D(B.TEXTURE_2D,q,0,0,xe,Se,G,le),De.unbindTexture()},this.copyTextureToTexture=function(S,H,q=null,Y=null,G=0){S.isTexture!==!0&&(_r("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,S=arguments[1],H=arguments[2],G=arguments[3]||0,q=null);let le,xe,Se,Te,Xe,Ze,Ae,ht,bt,wt=S.isCompressedTexture?S.mipmaps[G]:S.image;q!==null?(le=q.max.x-q.min.x,xe=q.max.y-q.min.y,Se=q.isBox3?q.max.z-q.min.z:1,Te=q.min.x,Xe=q.min.y,Ze=q.isBox3?q.min.z:0):(le=wt.width,xe=wt.height,Se=wt.depth||1,Te=0,Xe=0,Ze=0),Y!==null?(Ae=Y.x,ht=Y.y,bt=Y.z):(Ae=0,ht=0,bt=0);let pn=We.convert(H.format),dt=We.convert(H.type),Ce;H.isData3DTexture?(R.setTexture3D(H,0),Ce=B.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(R.setTexture2DArray(H,0),Ce=B.TEXTURE_2D_ARRAY):(R.setTexture2D(H,0),Ce=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,H.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,H.unpackAlignment);let hi=B.getParameter(B.UNPACK_ROW_LENGTH),pt=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Bn=B.getParameter(B.UNPACK_SKIP_PIXELS),ys=B.getParameter(B.UNPACK_SKIP_ROWS),Mn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,wt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,wt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Te),B.pixelStorei(B.UNPACK_SKIP_ROWS,Xe),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Ze);let hr=S.isDataArrayTexture||S.isData3DTexture,St=H.isDataArrayTexture||H.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){let Kn=Le.get(S),ur=Le.get(H),Dn=Le.get(Kn.__renderTarget),wi=Le.get(ur.__renderTarget);De.bindFramebuffer(B.READ_FRAMEBUFFER,Dn.__webglFramebuffer),De.bindFramebuffer(B.DRAW_FRAMEBUFFER,wi.__webglFramebuffer);for(let Si=0;Si<Se;Si++)hr&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Le.get(S).__webglTexture,G,Ze+Si),S.isDepthTexture?(St&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Le.get(H).__webglTexture,G,bt+Si),B.blitFramebuffer(Te,Xe,le,xe,Ae,ht,le,xe,B.DEPTH_BUFFER_BIT,B.NEAREST)):St?B.copyTexSubImage3D(Ce,G,Ae,ht,bt+Si,Te,Xe,le,xe):B.copyTexSubImage2D(Ce,G,Ae,ht,bt+Si,Te,Xe,le,xe);De.bindFramebuffer(B.READ_FRAMEBUFFER,null),De.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else St?S.isDataTexture||S.isData3DTexture?B.texSubImage3D(Ce,G,Ae,ht,bt,le,xe,Se,pn,dt,wt.data):H.isCompressedArrayTexture?B.compressedTexSubImage3D(Ce,G,Ae,ht,bt,le,xe,Se,pn,wt.data):B.texSubImage3D(Ce,G,Ae,ht,bt,le,xe,Se,pn,dt,wt):S.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,G,Ae,ht,le,xe,pn,dt,wt.data):S.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,G,Ae,ht,wt.width,wt.height,pn,wt.data):B.texSubImage2D(B.TEXTURE_2D,G,Ae,ht,le,xe,pn,dt,wt);B.pixelStorei(B.UNPACK_ROW_LENGTH,hi),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,pt),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Bn),B.pixelStorei(B.UNPACK_SKIP_ROWS,ys),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Mn),G===0&&H.generateMipmaps&&B.generateMipmap(Ce),De.unbindTexture()},this.copyTextureToTexture3D=function(S,H,q=null,Y=null,G=0){return S.isTexture!==!0&&(_r("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Y=arguments[1]||null,S=arguments[2],H=arguments[3],G=arguments[4]||0),_r('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,H,q,Y,G)},this.initRenderTarget=function(S){Le.get(S).__webglFramebuffer===void 0&&R.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?R.setTextureCube(S,0):S.isData3DTexture?R.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?R.setTexture2DArray(S,0):R.setTexture2D(S,0),De.unbindTexture()},this.resetState=function(){T=0,C=0,A=null,De.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=st._getDrawingBufferColorSpace(e),t.unpackColorSpace=st._getUnpackColorSpace()}};var Bi=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ye(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},qs=class extends $t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yt,this.environmentIntensity=1,this.environmentRotation=new Yt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var jn=class extends ln{constructor(e=null,t=1,n=1,s,r,a,o,l,c=sn,u=sn,f,d){super(null,a,o,l,c,u,s,r,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var as=class extends Ot{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ds=new Be,mf=new Be,Ca=[],gf=new Mi,ev=new Be,xr=new pe,yr=new Fi,cn=class extends pe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new as(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ev)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Mi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ds),gf.copy(e.boundingBox).applyMatrix4(Ds),this.boundingBox.union(gf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ds),yr.copy(e.boundingSphere).applyMatrix4(Ds),this.boundingSphere.union(yr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(xr.geometry=this.geometry,xr.material=this.material,xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yr.copy(this.boundingSphere),yr.applyMatrix4(n),e.ray.intersectsSphere(yr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ds),mf.multiplyMatrices(n,Ds),xr.matrixWorld=mf,xr.raycast(e,Ca);for(let a=0,o=Ca.length;a<o;a++){let l=Ca[a];l.instanceId=r,l.object=this,t.push(l)}Ca.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new as(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new jn(new Float32Array(s*this.count),s,this.count,ph,gn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Pr=class extends bi{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ye(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},xf=new Be,Pc=new Rr,Ia=new Fi,Pa=new P,Za=class extends $t{constructor(e=new zt,t=new Pr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ia.copy(n.boundingSphere),Ia.applyMatrix4(s),Ia.radius+=r,e.ray.intersectsSphere(Ia)===!1)return;xf.copy(s).invert(),Pc.copy(e.ray).applyMatrix4(xf);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let y=d,x=p;y<x;y++){let g=c.getX(y);Pa.fromBufferAttribute(f,g),yf(Pa,g,l,s,e,t,this)}}else{let d=Math.max(0,a.start),p=Math.min(f.count,a.start+a.count);for(let y=d,x=p;y<x;y++)Pa.fromBufferAttribute(f,y),yf(Pa,y,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function yf(i,e,t,n,s,r,a){let o=Pc.distanceSqToPoint(i);if(o<t){let l=new P;Pc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Ys=class extends ln{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},On=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],d=n[s+1]-u,p=(a-u)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new oe:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new P,s=[],r=[],a=[],o=new P,l=new Be;for(let p=0;p<=e;p++){let y=p/e;s[p]=this.getTangentAt(y,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let y=Math.acos(Wt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,y))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Wt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let y=1;y<=e;y++)r[y].applyMatrix4(l.makeRotationAxis(s[y],p*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Lr=class extends On{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new oe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*u-p*f+this.aX,c=d*f+p*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Lc=class extends Lr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function _h(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,f){let d=(a-r)/c-(o-r)/(c+u)+(o-a)/u,p=(o-a)/u-(l-a)/(u+f)+(l-o)/f;d*=u,p*=u,s(a,o,d,p)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var La=new P,Tl=new _h,Al=new _h,Rl=new _h,Dc=class extends On{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(La.subVectors(s[0],s[1]).add(s[0]),c=La);let f=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(La.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=La),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,y=Math.pow(c.distanceToSquared(f),p),x=Math.pow(f.distanceToSquared(d),p),g=Math.pow(d.distanceToSquared(u),p);x<1e-4&&(x=1),y<1e-4&&(y=x),g<1e-4&&(g=x),Tl.initNonuniformCatmullRom(c.x,f.x,d.x,u.x,y,x,g),Al.initNonuniformCatmullRom(c.y,f.y,d.y,u.y,y,x,g),Rl.initNonuniformCatmullRom(c.z,f.z,d.z,u.z,y,x,g)}else this.curveType==="catmullrom"&&(Tl.initCatmullRom(c.x,f.x,d.x,u.x,this.tension),Al.initCatmullRom(c.y,f.y,d.y,u.y,this.tension),Rl.initCatmullRom(c.z,f.z,d.z,u.z,this.tension));return n.set(Tl.calc(l),Al.calc(l),Rl.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function vf(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function tv(i,e){let t=1-i;return t*t*e}function nv(i,e){return 2*(1-i)*i*e}function iv(i,e){return i*i*e}function Er(i,e,t,n){return tv(i,e)+nv(i,t)+iv(i,n)}function sv(i,e){let t=1-i;return t*t*t*e}function rv(i,e){let t=1-i;return 3*t*t*i*e}function av(i,e){return 3*(1-i)*i*i*e}function ov(i,e){return i*i*i*e}function wr(i,e,t,n,s){return sv(i,e)+rv(i,t)+av(i,n)+ov(i,s)}var Ka=class extends On{constructor(e=new oe,t=new oe,n=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new oe){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(wr(e,s.x,r.x,a.x,o.x),wr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Nc=class extends On{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(wr(e,s.x,r.x,a.x,o.x),wr(e,s.y,r.y,a.y,o.y),wr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ja=class extends On{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Uc=class extends On{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ja=class extends On{constructor(e=new oe,t=new oe,n=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new oe){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Er(e,s.x,r.x,a.x),Er(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Oc=class extends On{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Er(e,s.x,r.x,a.x),Er(e,s.y,r.y,a.y),Er(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qa=class extends On{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(vf(o,l.x,c.x,u.x,f.x),vf(o,l.y,c.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new oe().fromArray(s))}return this}},_f=Object.freeze({__proto__:null,ArcCurve:Lc,CatmullRomCurve3:Dc,CubicBezierCurve:Ka,CubicBezierCurve3:Nc,EllipseCurve:Lr,LineCurve:Ja,LineCurve3:Uc,QuadraticBezierCurve:ja,QuadraticBezierCurve3:Oc,SplineCurve:Qa}),kc=class extends On{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _f[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new _f[s.type]().fromJSON(s))}return this}},zc=class extends kc{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ja(this.currentPoint.clone(),new oe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new ja(this.currentPoint.clone(),new oe(e,t),new oe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new Ka(this.currentPoint.clone(),new oe(e,t),new oe(n,s),new oe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Qa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Lr(e,t,n,s,r,a,o,l);if(this.curves.length>0){let f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Fc=class i extends zt{constructor(e=[new oe(0,-.5),new oe(.5,0),new oe(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=Wt(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],u=1/t,f=new P,d=new oe,p=new P,y=new P,x=new P,g=0,m=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,x.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,y.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),l.push(p.x,p.y,p.z),x.copy(y)}for(let v=0;v<=t;v++){let M=n+v*u*s,b=Math.sin(M),L=Math.cos(M);for(let T=0;T<=e.length-1;T++){f.x=e[T].x*b,f.y=e[T].y,f.z=e[T].x*L,a.push(f.x,f.y,f.z),d.x=v/t,d.y=T/(e.length-1),o.push(d.x,d.y);let C=l[3*T+0]*b,A=l[3*T+1],E=l[3*T+0]*L;c.push(C,A,E)}}for(let v=0;v<t;v++)for(let M=0;M<e.length-1;M++){let b=M+v*e.length,L=b,T=b+e.length,C=b+e.length+1,A=b+1;r.push(L,T,A),r.push(C,A,T)}this.setIndex(r),this.setAttribute("position",new ft(a,3)),this.setAttribute("uv",new ft(o,2)),this.setAttribute("normal",new ft(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Rn=class i extends Fc{constructor(e=1,t=1,n=4,s=8){let r=new zc;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}};var rt=class i extends zt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],d=[],p=[],y=0,x=[],g=n/2,m=0;v(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new ft(f,3)),this.setAttribute("normal",new ft(d,3)),this.setAttribute("uv",new ft(p,2));function v(){let b=new P,L=new P,T=0,C=(t-e)/n;for(let A=0;A<=r;A++){let E=[],_=A/r,I=_*(t-e)+e;for(let z=0;z<=s;z++){let k=z/s,O=k*l+o,W=Math.sin(O),F=Math.cos(O);L.x=I*W,L.y=-_*n+g,L.z=I*F,f.push(L.x,L.y,L.z),b.set(W,C,F).normalize(),d.push(b.x,b.y,b.z),p.push(k,1-_),E.push(y++)}x.push(E)}for(let A=0;A<s;A++)for(let E=0;E<r;E++){let _=x[E][A],I=x[E+1][A],z=x[E+1][A+1],k=x[E][A+1];(e>0||E!==0)&&(u.push(_,I,k),T+=3),(t>0||E!==r-1)&&(u.push(I,z,k),T+=3)}c.addGroup(m,T,0),m+=T}function M(b){let L=y,T=new oe,C=new P,A=0,E=b===!0?e:t,_=b===!0?1:-1;for(let z=1;z<=s;z++)f.push(0,g*_,0),d.push(0,_,0),p.push(.5,.5),y++;let I=y;for(let z=0;z<=s;z++){let O=z/s*l+o,W=Math.cos(O),F=Math.sin(O);C.x=E*F,C.y=g*_,C.z=E*W,f.push(C.x,C.y,C.z),d.push(0,_,0),T.x=W*.5+.5,T.y=F*.5*_+.5,p.push(T.x,T.y),y++}for(let z=0;z<s;z++){let k=L+z,O=I+z;b===!0?u.push(O,O+1,k):u.push(O+1,O,k),A+=3}c.addGroup(m,A,b===!0?1:2),m+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},eo=class i extends rt{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Bc=class i extends zt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),u(),this.setAttribute("position",new ft(r,3)),this.setAttribute("normal",new ft(r.slice(),3)),this.setAttribute("uv",new ft(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){let M=new P,b=new P,L=new P;for(let T=0;T<t.length;T+=3)p(t[T+0],M),p(t[T+1],b),p(t[T+2],L),l(M,b,L,v)}function l(v,M,b,L){let T=L+1,C=[];for(let A=0;A<=T;A++){C[A]=[];let E=v.clone().lerp(b,A/T),_=M.clone().lerp(b,A/T),I=T-A;for(let z=0;z<=I;z++)z===0&&A===T?C[A][z]=E:C[A][z]=E.clone().lerp(_,z/I)}for(let A=0;A<T;A++)for(let E=0;E<2*(T-A)-1;E++){let _=Math.floor(E/2);E%2===0?(d(C[A][_+1]),d(C[A+1][_]),d(C[A][_])):(d(C[A][_+1]),d(C[A+1][_+1]),d(C[A+1][_]))}}function c(v){let M=new P;for(let b=0;b<r.length;b+=3)M.x=r[b+0],M.y=r[b+1],M.z=r[b+2],M.normalize().multiplyScalar(v),r[b+0]=M.x,r[b+1]=M.y,r[b+2]=M.z}function u(){let v=new P;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];let b=g(v)/2/Math.PI+.5,L=m(v)/Math.PI+.5;a.push(b,1-L)}y(),f()}function f(){for(let v=0;v<a.length;v+=6){let M=a[v+0],b=a[v+2],L=a[v+4],T=Math.max(M,b,L),C=Math.min(M,b,L);T>.9&&C<.1&&(M<.2&&(a[v+0]+=1),b<.2&&(a[v+2]+=1),L<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function p(v,M){let b=v*3;M.x=e[b+0],M.y=e[b+1],M.z=e[b+2]}function y(){let v=new P,M=new P,b=new P,L=new P,T=new oe,C=new oe,A=new oe;for(let E=0,_=0;E<r.length;E+=9,_+=6){v.set(r[E+0],r[E+1],r[E+2]),M.set(r[E+3],r[E+4],r[E+5]),b.set(r[E+6],r[E+7],r[E+8]),T.set(a[_+0],a[_+1]),C.set(a[_+2],a[_+3]),A.set(a[_+4],a[_+5]),L.copy(v).add(M).add(b).divideScalar(3);let I=g(L);x(T,_+0,v,I),x(C,_+2,M,I),x(A,_+4,b,I)}}function x(v,M,b,L){L<0&&v.x===1&&(a[M]=v.x-1),b.x===0&&b.z===0&&(a[M]=L/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Dr=class i extends Bc{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Qn=class i extends zt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],u=[],f=e,d=(t-e)/s,p=new P,y=new oe;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let m=r+g/n*a;p.x=f*Math.cos(m),p.y=f*Math.sin(m),l.push(p.x,p.y,p.z),c.push(0,0,1),y.x=(p.x/t+1)/2,y.y=(p.y/t+1)/2,u.push(y.x,y.y)}f+=d}for(let x=0;x<s;x++){let g=x*(n+1);for(let m=0;m<n;m++){let v=m+g,M=v,b=v+n+1,L=v+n+2,T=v+1;o.push(M,b,T),o.push(b,L,T)}}this.setIndex(o),this.setAttribute("position",new ft(l,3)),this.setAttribute("normal",new ft(c,3)),this.setAttribute("uv",new ft(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var At=class i extends zt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,u=[],f=new P,d=new P,p=[],y=[],x=[],g=[];for(let m=0;m<=n;m++){let v=[],M=m/n,b=0;m===0&&a===0?b=.5/t:m===n&&l===Math.PI&&(b=-.5/t);for(let L=0;L<=t;L++){let T=L/t;f.x=-e*Math.cos(s+T*r)*Math.sin(a+M*o),f.y=e*Math.cos(a+M*o),f.z=e*Math.sin(s+T*r)*Math.sin(a+M*o),y.push(f.x,f.y,f.z),d.copy(f).normalize(),x.push(d.x,d.y,d.z),g.push(T+b,1-M),v.push(c++)}u.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){let M=u[m][v+1],b=u[m][v],L=u[m+1][v],T=u[m+1][v+1];(m!==0||a>0)&&p.push(M,b,T),(m!==n-1||l<Math.PI)&&p.push(b,L,T)}this.setIndex(p),this.setAttribute("position",new ft(y,3)),this.setAttribute("normal",new ft(x,3)),this.setAttribute("uv",new ft(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var xn=class i extends zt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],l=[],c=[],u=new P,f=new P,d=new P;for(let p=0;p<=n;p++)for(let y=0;y<=s;y++){let x=y/s*r,g=p/n*Math.PI*2;f.x=(e+t*Math.cos(g))*Math.cos(x),f.y=(e+t*Math.cos(g))*Math.sin(x),f.z=t*Math.sin(g),o.push(f.x,f.y,f.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),d.subVectors(f,u).normalize(),l.push(d.x,d.y,d.z),c.push(y/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let y=1;y<=s;y++){let x=(s+1)*p+y-1,g=(s+1)*(p-1)+y-1,m=(s+1)*(p-1)+y,v=(s+1)*p+y;a.push(x,g,v),a.push(g,m,v)}this.setIndex(a),this.setAttribute("position",new ft(o,3)),this.setAttribute("normal",new ft(l,3)),this.setAttribute("uv",new ft(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var to=class extends Tt{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}},ze=class extends bi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yh,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var no=class extends bi{static get type(){return"MeshNormalMaterial"}constructor(e){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yh,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};function Da(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function lv(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var $s=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Hc=class extends $s{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:yu,endingEnd:yu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case vu:r=e,o=2*t-n;break;case _u:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case vu:a=e,l=2*n-t;break;case _u:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,f=this._offsetNext,d=this._weightPrev,p=this._weightNext,y=(n-t)/(s-t),x=y*y,g=x*y,m=-d*g+2*d*x-d*y,v=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*y+1,M=(-1-p)*g+(1.5+p)*x+.5*y,b=p*g-p*x;for(let L=0;L!==o;++L)r[L]=m*a[u+L]+v*a[c+L]+M*a[l+L]+b*a[f+L];return r}},Gc=class extends $s{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),f=1-u;for(let d=0;d!==o;++d)r[d]=a[c+d]*f+a[l+d]*u;return r}},Vc=class extends $s{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},qn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Da(t,this.TimeBufferType),this.values=Da(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Da(e.times,Array),values:Da(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Vc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Gc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Hc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Fa:t=this.InterpolantFactoryMethodDiscrete;break;case pc:t=this.InterpolantFactoryMethodLinear;break;case Jo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Fa;case this.InterpolantFactoryMethodLinear:return pc;case this.InterpolantFactoryMethodSmooth:return Jo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&lv(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Jo,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{let f=o*n,d=f-n,p=f+n;for(let y=0;y!==n;++y){let x=t[f+y];if(x!==t[d+y]||x!==t[p+y]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let f=o*n,d=a*n;for(let p=0;p!==n;++p)t[d+p]=t[f+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};qn.prototype.TimeBufferType=Float32Array;qn.prototype.ValueBufferType=Float32Array;qn.prototype.DefaultInterpolation=pc;var os=class extends qn{constructor(e,t,n){super(e,t,n)}};os.prototype.ValueTypeName="bool";os.prototype.ValueBufferType=Array;os.prototype.DefaultInterpolation=Fa;os.prototype.InterpolantFactoryMethodLinear=void 0;os.prototype.InterpolantFactoryMethodSmooth=void 0;var Wc=class extends qn{};Wc.prototype.ValueTypeName="color";var Xc=class extends qn{};Xc.prototype.ValueTypeName="number";var qc=class extends $s{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let u=c+o;c!==u;c+=4)qt.slerpFlat(r,0,a,c-o,a,c,l);return r}},io=class extends qn{InterpolantFactoryMethodLinear(e){return new qc(this.times,this.values,this.getValueSize(),e)}};io.prototype.ValueTypeName="quaternion";io.prototype.InterpolantFactoryMethodSmooth=void 0;var ls=class extends qn{constructor(e,t,n){super(e,t,n)}};ls.prototype.ValueTypeName="string";ls.prototype.ValueBufferType=Array;ls.prototype.DefaultInterpolation=Fa;ls.prototype.InterpolantFactoryMethodLinear=void 0;ls.prototype.InterpolantFactoryMethodSmooth=void 0;var Yc=class extends qn{};Yc.prototype.ValueTypeName="vector";var so={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},$c=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,d=c.length;f<d;f+=2){let p=c[f],y=c[f+1];if(p.global&&(p.lastIndex=0),p.test(u))return y}return null}}},cv=new $c,cs=class{constructor(e){this.manager=e!==void 0?e:cv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};cs.DEFAULT_MATERIAL_NAME="__DEFAULT";var gi={},Zc=class extends Error{constructor(e,t){super(e),this.response=t}},Kc=class extends cs{constructor(e){super(e)}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=so.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(gi[e]!==void 0){gi[e].push({onLoad:t,onProgress:n,onError:s});return}gi[e]=[],gi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=gi[e],f=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=d?parseInt(d):0,y=p!==0,x=0,g=new ReadableStream({start(m){v();function v(){f.read().then(({done:M,value:b})=>{if(M)m.close();else{x+=b.byteLength;let L=new ProgressEvent("progress",{lengthComputable:y,loaded:x,total:p});for(let T=0,C=u.length;T<C;T++){let A=u[T];A.onProgress&&A.onProgress(L)}m.enqueue(b),v()}},M=>{m.error(M)})}}});return new Response(g)}else throw new Zc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o===void 0)return c.text();{let f=/charset="?([^;"\s]*)"?/i.exec(o),d=f&&f[1]?f[1].toLowerCase():void 0,p=new TextDecoder(d);return c.arrayBuffer().then(y=>p.decode(y))}}}).then(c=>{so.add(e,c);let u=gi[e];delete gi[e];for(let f=0,d=u.length;f<d;f++){let p=u[f];p.onLoad&&p.onLoad(c)}}).catch(c=>{let u=gi[e];if(u===void 0)throw this.manager.itemError(e),c;delete gi[e];for(let f=0,d=u.length;f<d;f++){let p=u[f];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}};var Jc=class extends cs{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=so.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;let o=Ar("img");function l(){u(),so.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(f){u(),s&&s(f),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}};var ro=class extends cs{constructor(e){super(e)}load(e,t,n,s){let r=this,a=new jn,o=new Kc(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(u){if(s!==void 0)s(u);else{console.error(u);return}}c.image!==void 0?a.image=c.image:c.data!==void 0&&(a.image.width=c.width,a.image.height=c.height,a.image.data=c.data),a.wrapS=c.wrapS!==void 0?c.wrapS:Sn,a.wrapT=c.wrapT!==void 0?c.wrapT:Sn,a.magFilter=c.magFilter!==void 0?c.magFilter:Ft,a.minFilter=c.minFilter!==void 0?c.minFilter:Ft,a.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(a.colorSpace=c.colorSpace),c.flipY!==void 0&&(a.flipY=c.flipY),c.format!==void 0&&(a.format=c.format),c.type!==void 0&&(a.type=c.type),c.mipmaps!==void 0&&(a.mipmaps=c.mipmaps,a.minFilter=Di),c.mipmapCount===1&&(a.minFilter=Ft),c.generateMipmaps!==void 0&&(a.generateMipmaps=c.generateMipmaps),a.needsUpdate=!0,t&&t(a,c)},n,s),a}},ao=class extends cs{constructor(e){super(e)}load(e,t,n,s){let r=new ln,a=new Jc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Zs=class extends $t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ye(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},oo=class extends Zs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy($t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ye(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Cl=new Be,Mf=new P,bf=new P,Nr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.map=null,this.mapPass=null,this.matrix=new Be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ir,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Mf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Mf),bf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(bf),t.updateMatrixWorld(),Cl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Cl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},jc=class extends Nr{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=Ha*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},lo=class extends Zs{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy($t.DEFAULT_UP),this.updateMatrix(),this.target=new $t,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new jc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Ef=new Be,vr=new P,Il=new P,Qc=class extends Nr{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new oe(4,2),this._viewportCount=6,this._viewports=[new vt(2,1,1,1),new vt(0,1,1,1),new vt(3,1,1,1),new vt(1,1,1,1),new vt(3,0,1,1),new vt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),vr.setFromMatrixPosition(e.matrixWorld),n.position.copy(vr),Il.copy(n.position),Il.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Il),n.updateMatrixWorld(),s.makeTranslation(-vr.x,-vr.y,-vr.z),Ef.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ef)}},Ks=class extends Zs{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Qc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},eh=class extends Nr{constructor(){super(new Vs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},co=class extends Zs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy($t.DEFAULT_UP),this.updateMatrix(),this.target=new $t,this.shadow=new eh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ho=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=wf(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=wf();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function wf(){return performance.now()}var Mh="\\[\\]\\.:\\/",hv=new RegExp("["+Mh+"]","g"),bh="[^"+Mh+"]",uv="[^"+Mh.replace("\\.","")+"]",fv=/((?:WC+[\/:])*)/.source.replace("WC",bh),dv=/(WCOD+)?/.source.replace("WCOD",uv),pv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",bh),mv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",bh),gv=new RegExp("^"+fv+dv+pv+mv+"$"),xv=["material","materials","bones","map"],th=class{constructor(e,t,n){let s=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(hv,"")}static parseTrackName(e){let t=gv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);xv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=th;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var k_=new Float32Array(1);var Sf=new Be,uo=class{constructor(e,t,n=0,s=1/0){this.ray=new Rr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Cr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Sf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Sf),this}intersectObject(e,t=!0,n=[]){return nh(e,this,n,t),n.sort(Tf),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)nh(e[s],this,n,t);return n.sort(Tf),n}};function Tf(i,e){return i.distance-e.distance}function nh(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)nh(r[a],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ih}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ih);var Hi={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var hn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},yv=new Vs(-1,1,1,-1,0,1),Eh=class extends zt{constructor(){super(),this.setAttribute("position",new ft([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ft([0,2,0,0,2,0],2))}},vv=new Eh,ni=class{constructor(e){this._mesh=new pe(vv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,yv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var er=class extends hn{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Tt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=yn.clone(e.uniforms),this.material=new Tt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ni(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var zr=class extends hn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},yo=class extends hn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var vo=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new oe);this._width=n.width,this._height=n.height,t=new kt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Nt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new er(Hi),this.copyPass.material.blending=Bt,this.clock=new ho}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}zr!==void 0&&(a instanceof zr?n=!0:a instanceof yo&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new oe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var _o=class extends hn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ye}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var $f={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ye(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var tr=class i extends hn{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new oe(e.x,e.y):new oe(256,256),this.clearColor=new ye(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new kt(r,a,{type:Nt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){let d=new kt(r,a,{type:Nt});d.texture.name="UnrealBloomPass.h"+f,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let p=new kt(r,a,{type:Nt});p.texture.name="UnrealBloomPass.v"+f,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}let o=$f;this.highPassUniforms=yn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Tt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new oe(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let u=Hi;this.copyUniforms=yn.clone(u.uniforms),this.blendMaterial=new Tt({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:Tn,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ye,this.oldClearAlpha=1,this.basic=new yt,this.fsQuad=new ni(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new oe(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Tt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new oe(.5,.5)},direction:{value:new oe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new Tt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};tr.BlurDirectionX=new oe(1,0);tr.BlurDirectionY=new oe(0,1);var Fr={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new oe},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Be},cameraProjectionMatrixInverse:{value:new Be},cameraWorldMatrix:{value:new Be},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new P(-1,-1,-1)},sceneBoxMax:{value:new P(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;		
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif
		
		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {  
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {   
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}
		
		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif
			
			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {
				
				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w); 
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));
				
				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));
				
				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);	

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}		

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);		
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Br={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Mo={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function Zf(i=5){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=_v(e),n=t.length,s=new Uint8Array(n*4);for(let a=0;a<n;++a){let o=t[a],l=2*Math.PI*o/n,c=new P(Math.cos(l),Math.sin(l),0).normalize();s[a*4]=(c.x*.5+.5)*255,s[a*4+1]=(c.y*.5+.5)*255,s[a*4+2]=127,s[a*4+3]=255}let r=new jn(s,e,e);return r.wrapS=An,r.wrapT=An,r.needsUpdate=!0,r}function _v(i){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=e*e,n=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),n[s*e+r]!==0){r-=2,s++;continue}else n[s*e+r]=a++;r++,s--}return n}var Hr={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:wh(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new oe},cameraProjectionMatrixInverse:{value:new Be},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;
		
		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}
		
		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1    
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1    
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);
			
			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;
		
			denoised += w * neighborColor;
			totalWeight += w;
		}
		
		void main() {
			float depth = getDepth(vUv.xy);	
			vec3 viewNormal = getViewNormal(vUv);	
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);
		
			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}
		
			if (totalWeight > 0.) { 
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function wh(i,e,t){let n=Mv(i,e,t),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let a=n[r];s+=`vec3(${a.x}, ${a.y}, ${a.z})${r<i-1?",":")"}`}return s}function Mv(i,e,t){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*e*s/i,a=Math.pow(s/(i-1),t);n.push(new P(Math.cos(r),Math.sin(r),a))}return n}var bo=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,n){return e[0]*t+e[1]*n}dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}noise(e,t){let n,s,r,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),c=Math.floor(t+o),u=(3-Math.sqrt(3))/6,f=(l+c)*u,d=l-f,p=c-f,y=e-d,x=t-p,g,m;y>x?(g=1,m=0):(g=0,m=1);let v=y-g+u,M=x-m+u,b=y-1+2*u,L=x-1+2*u,T=l&255,C=c&255,A=this.perm[T+this.perm[C]]%12,E=this.perm[T+g+this.perm[C+m]]%12,_=this.perm[T+1+this.perm[C+1]]%12,I=.5-y*y-x*x;I<0?n=0:(I*=I,n=I*I*this.dot(this.grad3[A],y,x));let z=.5-v*v-M*M;z<0?s=0:(z*=z,s=z*z*this.dot(this.grad3[E],v,M));let k=.5-b*b-L*L;return k<0?r=0:(k*=k,r=k*k*this.dot(this.grad3[_],b,L)),70*(n+s+r)}noise3d(e,t,n){let s,r,a,o,c=(e+t+n)*.3333333333333333,u=Math.floor(e+c),f=Math.floor(t+c),d=Math.floor(n+c),p=1/6,y=(u+f+d)*p,x=u-y,g=f-y,m=d-y,v=e-x,M=t-g,b=n-m,L,T,C,A,E,_;v>=M?M>=b?(L=1,T=0,C=0,A=1,E=1,_=0):v>=b?(L=1,T=0,C=0,A=1,E=0,_=1):(L=0,T=0,C=1,A=1,E=0,_=1):M<b?(L=0,T=0,C=1,A=0,E=1,_=1):v<b?(L=0,T=1,C=0,A=0,E=1,_=1):(L=0,T=1,C=0,A=1,E=1,_=0);let I=v-L+p,z=M-T+p,k=b-C+p,O=v-A+2*p,W=M-E+2*p,F=b-_+2*p,J=v-1+3*p,X=M-1+3*p,ie=b-1+3*p,ce=u&255,be=f&255,Ie=d&255,Ye=this.perm[ce+this.perm[be+this.perm[Ie]]]%12,Z=this.perm[ce+L+this.perm[be+T+this.perm[Ie+C]]]%12,ae=this.perm[ce+A+this.perm[be+E+this.perm[Ie+_]]]%12,Ee=this.perm[ce+1+this.perm[be+1+this.perm[Ie+1]]]%12,he=.6-v*v-M*M-b*b;he<0?s=0:(he*=he,s=he*he*this.dot3(this.grad3[Ye],v,M,b));let Re=.6-I*I-z*z-k*k;Re<0?r=0:(Re*=Re,r=Re*Re*this.dot3(this.grad3[Z],I,z,k));let ke=.6-O*O-W*W-F*F;ke<0?a=0:(ke*=ke,a=ke*ke*this.dot3(this.grad3[ae],O,W,F));let Ve=.6-J*J-X*X-ie*ie;return Ve<0?o=0:(Ve*=Ve,o=Ve*Ve*this.dot3(this.grad3[Ee],J,X,ie)),32*(s+r+a+o)}noise4d(e,t,n,s){let r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,u,f,d,p,y,x=(e+t+n+s)*l,g=Math.floor(e+x),m=Math.floor(t+x),v=Math.floor(n+x),M=Math.floor(s+x),b=(g+m+v+M)*c,L=g-b,T=m-b,C=v-b,A=M-b,E=e-L,_=t-T,I=n-C,z=s-A,k=E>_?32:0,O=E>I?16:0,W=_>I?8:0,F=E>z?4:0,J=_>z?2:0,X=I>z?1:0,ie=k+O+W+F+J+X,ce=a[ie][0]>=3?1:0,be=a[ie][1]>=3?1:0,Ie=a[ie][2]>=3?1:0,Ye=a[ie][3]>=3?1:0,Z=a[ie][0]>=2?1:0,ae=a[ie][1]>=2?1:0,Ee=a[ie][2]>=2?1:0,he=a[ie][3]>=2?1:0,Re=a[ie][0]>=1?1:0,ke=a[ie][1]>=1?1:0,Ve=a[ie][2]>=1?1:0,Mt=a[ie][3]>=1?1:0,nt=E-ce+c,Et=_-be+c,B=I-Ie+c,jt=z-Ye+c,Qe=E-Z+2*c,et=_-ae+2*c,De=I-Ee+2*c,gt=z-he+2*c,Le=E-Re+3*c,R=_-ke+3*c,w=I-Ve+3*c,V=z-Mt+3*c,Q=E-1+4*c,se=_-1+4*c,K=I-1+4*c,we=z-1+4*c,fe=g&255,me=m&255,je=v&255,re=M&255,_e=o[fe+o[me+o[je+o[re]]]]%32,Fe=o[fe+ce+o[me+be+o[je+Ie+o[re+Ye]]]]%32,Ge=o[fe+Z+o[me+ae+o[je+Ee+o[re+he]]]]%32,Me=o[fe+Re+o[me+ke+o[je+Ve+o[re+Mt]]]]%32,it=o[fe+1+o[me+1+o[je+1+o[re+1]]]]%32,We=.6-E*E-_*_-I*I-z*z;We<0?u=0:(We*=We,u=We*We*this.dot4(r[_e],E,_,I,z));let ct=.6-nt*nt-Et*Et-B*B-jt*jt;ct<0?f=0:(ct*=ct,f=ct*ct*this.dot4(r[Fe],nt,Et,B,jt));let U=.6-Qe*Qe-et*et-De*De-gt*gt;U<0?d=0:(U*=U,d=U*U*this.dot4(r[Ge],Qe,et,De,gt));let ue=.6-Le*Le-R*R-w*w-V*V;ue<0?p=0:(ue*=ue,p=ue*ue*this.dot4(r[Me],Le,R,w,V));let $=.6-Q*Q-se*se-K*K-we*we;return $<0?y=0:($*=$,y=$*$*this.dot4(r[it],Q,se,K,we)),27*(u+f+d+p+y)}};var Gr=class i extends hn{constructor(e,t,n,s,r,a,o){super(),this.width=n!==void 0?n:512,this.height=s!==void 0?s:512,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Zf(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new kt(this.width,this.height,{type:Nt}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Tt({defines:Object.assign({},Fr.defines),uniforms:yn.clone(Fr.uniforms),vertexShader:Fr.vertexShader,fragmentShader:Fr.fragmentShader,blending:Bt,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new no,this.normalMaterial.blending=Bt,this.pdMaterial=new Tt({defines:Object.assign({},Hr.defines),uniforms:yn.clone(Hr.uniforms),vertexShader:Hr.vertexShader,fragmentShader:Hr.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Tt({defines:Object.assign({},Br.defines),uniforms:yn.clone(Br.uniforms),vertexShader:Br.vertexShader,fragmentShader:Br.fragmentShader,blending:Bt}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Tt({uniforms:yn.clone(Hi.uniforms),vertexShader:Hi.vertexShader,fragmentShader:Hi.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:po,blendDst:Js,blendEquation:Un,blendSrcAlpha:fo,blendDstAlpha:Js,blendEquationAlpha:Un}),this.blendMaterial=new Tt({uniforms:yn.clone(Mo.uniforms),vertexShader:Mo.vertexShader,fragmentShader:Mo.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:rh,blendSrc:po,blendDst:Js,blendEquation:Un,blendSrcAlpha:fo,blendDstAlpha:Js,blendEquationAlpha:Un}),this.fsQuad=new ni(null),this.originalClearColor=new ye,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new Xs,this.depthTexture.format=ki,this.depthTexture.type=Oi,this.normalRenderTarget=new kt(this.width,this.height,{minFilter:sn,magFilter:sn,type:Nt,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=wh(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,n){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Bt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Bt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Bt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Bt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Bt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(e,t,n,s,r){e.getClearColor(this.originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(a)}renderOverride(e,t,n,s,r){e.getClearColor(this.originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(a)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){t.set(n,n.visible),(n.isPoints||n.isLine)&&(n.visible=!1)})}restoreVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){let s=t.get(n);n.visible=s}),t.clear()}generateNoise(e=64){let t=new bo,n=e*e*4,s=new Uint8Array(n);for(let a=0;a<e;a++)for(let o=0;o<e;o++){let l=a,c=o;s[(a*e+o)*4]=(t.noise(l,c)*.5+.5)*255,s[(a*e+o)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(a*e+o)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(a*e+o)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new jn(s,e,e,on,Xn);return r.wrapS=An,r.wrapT=An,r.needsUpdate=!0,r}};Gr.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Kf={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Eo=class extends hn{constructor(){super();let e=Kf;this.uniforms=yn.clone(e.uniforms),this.material=new to({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ni(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},st.getTransfer(this._outputColorSpace)===mt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ah?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===oh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===lh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ur?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ch?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===hh&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var wo=class extends qs{constructor(){super();let e=new Pe;e.deleteAttribute("uv");let t=new ze({side:nn}),n=new ze,s=new Ks(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new pe(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new pe(e,n);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);let o=new pe(e,n);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);let l=new pe(e,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let c=new pe(e,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);let u=new pe(e,n);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);let f=new pe(e,n);f.position.set(-2.193,-.369,-5.547),f.rotation.set(0,.516,0),f.scale.set(3.875,3.487,2.986),this.add(f);let d=new pe(e,nr(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);let p=new pe(e,nr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let y=new pe(e,nr(17));y.position.set(14.904,12.198,-1.832),y.scale.set(.15,4.265,6.331),this.add(y);let x=new pe(e,nr(43));x.position.set(-.462,8.89,14.52),x.scale.set(4.38,5.441,.088),this.add(x);let g=new pe(e,nr(20));g.position.set(3.235,11.486,-12.541),g.scale.set(2.5,2,.1),this.add(g);let m=new pe(e,nr(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function nr(i){let e=new yt;return e.color.setScalar(i),e}var So=class extends ro{constructor(e){super(e),this.type=Nt}parse(e){let a=function(A,E){switch(A){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(E||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(E||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(E||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(E||""))}},u=`
`,f=function(A,E,_){E=E||1024;let z=A.pos,k=-1,O=0,W="",F=String.fromCharCode.apply(null,new Uint16Array(A.subarray(z,z+128)));for(;0>(k=F.indexOf(u))&&O<E&&z<A.byteLength;)W+=F,O+=F.length,z+=128,F+=String.fromCharCode.apply(null,new Uint16Array(A.subarray(z,z+128)));return-1<k?(_!==!1&&(A.pos+=O+k+1),W+F.slice(0,k)):!1},d=function(A){let E=/^#\?(\S+)/,_=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,I=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,z=/^\s*FORMAT=(\S+)\s*$/,k=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,O={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},W,F;for((A.pos>=A.byteLength||!(W=f(A)))&&a(1,"no header found"),(F=W.match(E))||a(3,"bad initial token"),O.valid|=1,O.programtype=F[1],O.string+=W+`
`;W=f(A),W!==!1;){if(O.string+=W+`
`,W.charAt(0)==="#"){O.comments+=W+`
`;continue}if((F=W.match(_))&&(O.gamma=parseFloat(F[1])),(F=W.match(I))&&(O.exposure=parseFloat(F[1])),(F=W.match(z))&&(O.valid|=2,O.format=F[1]),(F=W.match(k))&&(O.valid|=4,O.height=parseInt(F[1],10),O.width=parseInt(F[2],10)),O.valid&2&&O.valid&4)break}return O.valid&2||a(3,"missing format specifier"),O.valid&4||a(3,"missing image size specifier"),O},p=function(A,E,_){let I=E;if(I<8||I>32767||A[0]!==2||A[1]!==2||A[2]&128)return new Uint8Array(A);I!==(A[2]<<8|A[3])&&a(3,"wrong scanline width");let z=new Uint8Array(4*E*_);z.length||a(4,"unable to allocate buffer space");let k=0,O=0,W=4*I,F=new Uint8Array(4),J=new Uint8Array(W),X=_;for(;X>0&&O<A.byteLength;){O+4>A.byteLength&&a(1),F[0]=A[O++],F[1]=A[O++],F[2]=A[O++],F[3]=A[O++],(F[0]!=2||F[1]!=2||(F[2]<<8|F[3])!=I)&&a(3,"bad rgbe scanline format");let ie=0,ce;for(;ie<W&&O<A.byteLength;){ce=A[O++];let Ie=ce>128;if(Ie&&(ce-=128),(ce===0||ie+ce>W)&&a(3,"bad scanline data"),Ie){let Ye=A[O++];for(let Z=0;Z<ce;Z++)J[ie++]=Ye}else J.set(A.subarray(O,O+ce),ie),ie+=ce,O+=ce}let be=I;for(let Ie=0;Ie<be;Ie++){let Ye=0;z[k]=J[Ie+Ye],Ye+=I,z[k+1]=J[Ie+Ye],Ye+=I,z[k+2]=J[Ie+Ye],Ye+=I,z[k+3]=J[Ie+Ye],k+=4}X--}return z},y=function(A,E,_,I){let z=A[E+3],k=Math.pow(2,z-128)/255;_[I+0]=A[E+0]*k,_[I+1]=A[E+1]*k,_[I+2]=A[E+2]*k,_[I+3]=1},x=function(A,E,_,I){let z=A[E+3],k=Math.pow(2,z-128)/255;_[I+0]=kr.toHalfFloat(Math.min(A[E+0]*k,65504)),_[I+1]=kr.toHalfFloat(Math.min(A[E+1]*k,65504)),_[I+2]=kr.toHalfFloat(Math.min(A[E+2]*k,65504)),_[I+3]=kr.toHalfFloat(1)},g=new Uint8Array(e);g.pos=0;let m=d(g),v=m.width,M=m.height,b=p(g.subarray(g.pos),v,M),L,T,C;switch(this.type){case gn:C=b.length/4;let A=new Float32Array(C*4);for(let _=0;_<C;_++)y(b,_*4,A,_*4);L=A,T=gn;break;case Nt:C=b.length/4;let E=new Uint16Array(C*4);for(let _=0;_<C;_++)x(b,_*4,E,_*4);L=E,T=Nt;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:v,height:M,data:L,header:m.string,gamma:m.gamma,exposure:m.exposure,type:T}}setDataType(e){return this.type=e,this}load(e,t,n,s){function r(a,o){switch(a.type){case gn:case Nt:a.colorSpace=ei,a.minFilter=Ft,a.magFilter=Ft,a.generateMipmaps=!1,a.flipY=!0;break}t&&t(a,o)}return super.load(e,r,n,s)}};var D={};h.R=D;var bv={uniforms:{tDiffuse:{value:null},uTime:{value:0},uContrast:{value:1.08},uSat:{value:1.12},uTint:{value:new P(1,1,1)},uVignette:{value:.32},uGrain:{value:.035},uSplit:{value:0},uTexel:{value:new oe(1/1280,1/720)},uSharp:{value:.2}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uTime, uContrast, uSat, uVignette, uGrain, uSplit, uSharp; uniform vec3 uTint; uniform vec2 uTexel; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
    void main(){
      vec2 d = (vUv - 0.5);
      vec3 c;
      if (uSplit > 0.001) { // chromatic split on hits
        vec2 o = d * uSplit * 0.03;
        c = vec3(texture2D(tDiffuse, vUv + o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - o).b);
      } else c = texture2D(tDiffuse, vUv).rgb;
      // Sharpen: push each pixel away from the blur of its 4 neighbors (crisper edges after TAA-ish softness).
      vec3 nb = texture2D(tDiffuse, vUv + vec2(uTexel.x, 0.0)).rgb + texture2D(tDiffuse, vUv - vec2(uTexel.x, 0.0)).rgb
              + texture2D(tDiffuse, vUv + vec2(0.0, uTexel.y)).rgb + texture2D(tDiffuse, vUv - vec2(0.0, uTexel.y)).rgb;
      c = max(c + (c - nb * 0.25) * uSharp, 0.0);
      c = (c - 0.5) * uContrast + 0.5;
      c = mix(c, c * c * (3.0 - 2.0 * c), 0.25); // gentle filmic S-curve: deeper shadows, punchier highlights
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, uSat) * uTint;
      c *= 1.0 - uVignette * smoothstep(0.25, 0.85, length(d) * 1.35);
      c += (hash(vUv * 900.0) - 0.5) * uGrain;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`};D.init=function(i){try{D.renderer=new $a({canvas:i,antialias:!0,powerPreference:"high-performance"})}catch(t){throw document.body.insertAdjacentHTML("beforeend",'<div style="position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:#07080b;color:#fff;font:600 17px system-ui;text-align:center;padding:24px">This browser could not start 3D graphics.<br><br>Try closing other tabs, turning off Low Power Mode, or opening the link in Chrome or Safari.</div>'),t}i.addEventListener("webglcontextlost",t=>{t.preventDefault(),h.settings.quality="low",h.saveSettings(),setTimeout(()=>location.reload(),1500)}),D.renderer.toneMapping=Ur,D.renderer.toneMappingExposure=1.05,D.renderer.shadowMap.type=sh,D.scene=new qs,D.pmrem=new Ws(D.renderer),D.studioEnv=D.pmrem.fromScene(new wo,.04).texture,D.scene.environment=D.studioEnv,D.scene.environmentIntensity=.35,D.envCache={},D.camera=new Jt(38,1,.5,300),D.camOffset=new P(0,19,12),D.camTarget=new P,D.shake=0,D.split=0,D.dyn=1,D.dynT=0,D.hemi=new oo(13624319,3813928,.7),D.scene.add(D.hemi),D.sun=new co(16773590,2.2),D.sun.position.set(12,30,8),Object.assign(D.sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:80}),D.sun.shadow.bias=-4e-4,D.sun.shadow.normalBias=.03,D.scene.add(D.sun,D.sun.target),D.lights=[];for(let t=0;t<8;t++){let n=new Ks(16777215,0,20,1.2);n.position.set(0,-50,0),D.scene.add(n),D.lights.push(n)}D.lightNext=0,D.flash=new lo(16773848,0,26,.42,.45,1),D.flash.position.set(0,-50,0),D.scene.add(D.flash,D.flash.target),D.flashOn=!1,D.flashBoost=0,D.muzzleT=0;let e=new eo(2.6,11,24,1,!0).translate(0,-5.5,0).rotateX(-Math.PI/2);D.beam=new pe(e,new yt({color:16773328,transparent:!0,opacity:.07,blending:Tn,depthWrite:!1,side:Xt,toneMapped:!1})),D.beam.visible=!1,D.beam.renderOrder=4,D.scene.add(D.beam),D.applyQuality(h.settings.quality),addEventListener("resize",D.resize)};D.setEnv=function(i){if(D.envWant=i,D.envCache[i]){D.scene.environment=D.envCache[i];return}fetch(`assets/hdri/${i}_1k.b64.txt`).then(e=>{if(!e.ok)throw new Error(e.status);return e.text()}).then(e=>{let t=atob(e.trim()),n=new Uint8Array(t.length);for(let o=0;o<t.length;o++)n[o]=t.charCodeAt(o);let s=new So().parse(n.buffer),r=new jn(s.data,s.width,s.height,on,s.type);Object.assign(r,{colorSpace:ei,mapping:Sr,minFilter:Ft,magFilter:Ft,generateMipmaps:!1,flipY:!0}),r.needsUpdate=!0;let a=D.pmrem.fromEquirectangular(r).texture;r.dispose(),D.envCache[i]=a,D.envWant===i&&(D.scene.environment=a)}).catch(()=>{D.scene.environment=D.studioEnv})};D.muzzle=function(i,e,t=1){let n=h.W.muzzle;n&&(D.muzzleT=Math.max(D.muzzleT,t),n.position.set(i,1.6,e))};D.updateFlash=function(i){let e=h.officers&&h.officers.find(t=>!t.down);if(h.W.muzzle&&(D.muzzleT=Math.max(0,D.muzzleT-i*9),h.W.muzzle.intensity=D.muzzleT*40),!D.flashOn||!e){D.flash.intensity=0,D.flash.position.set(0,-50,0),D.beam.visible=!1;return}D.flashBoost=Math.max(0,D.flashBoost-i*4),D.flash.intensity=90+D.flashBoost*160,D.flash.distance=32,D.flash.angle=.5-D.flashBoost*.08,D.beam.visible=!0,D.beam.position.set(e.x+e.ax*.5,1.5,e.z+e.az*.5),D.beam.lookAt(e.x+e.ax*11,.2,e.z+e.az*11),D.beam.material.opacity=.06+D.flashBoost*.08,D.flash.position.set(e.x-e.ax*.3,1.9,e.z-e.az*.3),D.flash.target.position.set(e.x+e.ax*9,0,e.z+e.az*9),h.W.halo&&h.W.halo.position.set(e.x,2.6,e.z)};D.takeLight=function(i,e,t){let n=D.lights[D.lightNext++%D.lights.length];return n.color.set(i),n.intensity=e,n.distance=t,n};D.resetLights=function(){for(let i of D.lights)i.intensity=0,i.position.set(0,-50,0);D.lightNext=0};D.precompile=function(){D.renderer.compile(D.scene,D.camera)};D.applyQuality=function(i){let e=h.QUALITY[i]||h.QUALITY.high,t=D.q?D.q.shadows!==e.shadows:!0;D.q=e,D.qName=i,D.dyn=1,D.renderer.shadowMap.enabled=e.shadows,D.sun.castShadow=e.shadows,e.shadows&&(D.sun.shadow.mapSize.set(e.shadowMap,e.shadowMap),D.sun.shadow.map&&(D.sun.shadow.map.dispose(),D.sun.shadow.map=null)),t&&D.scene.traverse(n=>{n.material&&(n.material.needsUpdate=!0)}),D.buildComposer(),D.resize()};D.buildComposer=function(){D.composer&&D.composer.dispose(),D.composer=null,D.ao=null,D.grade=null;let i=D.q;if(!i.grade)return;let e=new kt(1,1,{type:Nt,samples:4});if(D.composer=new vo(D.renderer,e),D.composer.addPass(new _o(D.scene,D.camera)),i.ao){D.ao=new Gr(D.scene,D.camera,1,1),D.ao.blendIntensity=.9;let n=D.ao.setSize.bind(D.ao);D.ao.setSize=(s,r)=>n(Math.max(1,s>>1),Math.max(1,r>>1)),D.composer.addPass(D.ao)}i.bloom&&D.composer.addPass(D.bloom=new tr(new oe(1,1),.6,.5,.82)),D.composer.addPass(new Eo),D.composer.addPass(D.grade=new er(bv)),D.setGrade(D.gradeLook||{});let t=D.renderer.getDrawingBufferSize(new oe);D.grade.uniforms.uTexel.value.set(1/Math.max(1,t.x),1/Math.max(1,t.y))};D.setGrade=function(i){if(D.gradeLook=i,!D.grade)return;let e=D.grade.uniforms;e.uContrast.value=i.contrast??1.08,e.uSat.value=i.sat??1.12,e.uVignette.value=i.vignette??.32,e.uTint.value.set(...i.tint||[1,1,1])};D.resize=function(){let i=innerWidth,e=innerHeight,t=matchMedia("(pointer: coarse)").matches,n=Math.min(devicePixelRatio||1,t?1.5:2)*D.q.pixel*D.dyn;D.renderer.setPixelRatio(n),D.renderer.setSize(i,e,!1),D.camera.aspect=i/e,D.zoom=i<e?1.55:e<560?1.25:1.12,D.camera.updateProjectionMatrix(),D.composer&&(D.composer.setPixelRatio(n),D.composer.setSize(i,e)),D.grade&&D.grade.uniforms.uTexel.value.set(1/Math.max(1,i*n),1/Math.max(1,e*n))};D.tuneResolution=function(i,e){if(D.dynT-=e,D.dynT>0)return;let t=D.dyn;i<52&&D.dyn>.6?t=Math.max(.6,D.dyn-.1):i>58&&D.dyn<1&&(t=Math.min(1,D.dyn+.05)),t!==D.dyn?(D.dyn=t,D.resize(),D.dynT=2):D.dynT=1};D.follow=function(i,e,t,n=1){let s=1-Math.exp(-t*6);D.camTarget.x+=(i-D.camTarget.x)*s,D.camTarget.z+=(e-D.camTarget.z)*s;let r=(D.zoom||1)*n,a=0,o=0;D.shake>0&&(a=(Math.random()-.5)*D.shake,o=(Math.random()-.5)*D.shake,D.shake=Math.max(0,D.shake-t*3)),D.camera.position.set(D.camTarget.x+D.camOffset.x*r+a,D.camOffset.y*r,D.camTarget.z+D.camOffset.z*r+o),D.camera.lookAt(D.camTarget.x+a,0,D.camTarget.z+o),D.sun.position.set(D.camTarget.x+12,30,D.camTarget.z+8),D.sun.target.position.set(D.camTarget.x,0,D.camTarget.z),D.split=Math.max(0,D.split-t*2.5)};D.render=function(i){D.grade&&(D.grade.uniforms.uTime.value=i%100,D.grade.uniforms.uSplit.value=D.split),D.composer?D.composer.render():D.renderer.render(D.scene,D.camera)};var Jf=new uo,jf=new oe,Qf=new Wn(new P(0,1,0),0),ed=new P;D.screenToGround=function(i,e,t=1){return jf.set(i/innerWidth*2-1,-(e/innerHeight)*2+1),Jf.setFromCamera(jf,D.camera),Qf.constant=-t,Jf.ray.intersectPlane(Qf,ed)?ed:null};var To=new P;D.worldToScreen=function(i,e,t){return To.set(i,e,t).project(D.camera),[(To.x+1)*.5*innerWidth,(1-To.y)*.5*innerHeight,To.z<1]};function Vr(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new zt,c=0;for(let u=0;u<i.length;++u){let f=i[u],d=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in f.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(f.attributes[p]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in f.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(f.morphAttributes[p])}if(e){let p;if(t)p=f.index.count;else if(f.attributes.position!==void 0)p=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,u),c+=p}}if(t){let u=0,f=[];for(let d=0;d<i.length;++d){let p=i[d].index;for(let y=0;y<p.count;++y)f.push(p.getX(y)+u);u+=i[d].attributes.position.count}l.setIndex(f)}for(let u in r){let f=td(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(let u in a){let f=a[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let d=0;d<f;++d){let p=[];for(let x=0;x<a[u].length;++x)p.push(a[u][x][d]);let y=td(p);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(y)}}return l}function td(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let u=i[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let a=new e(r),o=new Ot(a,t,n),l=0;for(let c=0;c<i.length;++c){let u=i[c];if(u.isInterleavedBufferAttribute){let f=l/t;for(let d=0,p=u.count;d<p;d++)for(let y=0;y<t;y++){let x=u.getComponent(d,y);o.setComponent(d+f,y,x)}}else a.set(u.array,l);l+=u.count*t}return s!==void 0&&(o.gpuType=s),o}function Sh(i,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),l={},c={},u=[],f=["getX","getY","getZ","getW"],d=["setX","setY","setZ","setW"];for(let v=0,M=o.length;v<M;v++){let b=o[v],L=i.attributes[b];l[b]=new L.constructor(new L.array.constructor(L.count*L.itemSize),L.itemSize,L.normalized);let T=i.morphAttributes[b];T&&(c[b]||(c[b]=[]),T.forEach((C,A)=>{let E=new C.array.constructor(C.count*C.itemSize);c[b][A]=new C.constructor(E,C.itemSize,C.normalized)}))}let p=e*.5,y=Math.log10(1/e),x=Math.pow(10,y),g=p*x;for(let v=0;v<r;v++){let M=n?n.getX(v):v,b="";for(let L=0,T=o.length;L<T;L++){let C=o[L],A=i.getAttribute(C),E=A.itemSize;for(let _=0;_<E;_++)b+=`${~~(A[f[_]](M)*x+g)},`}if(b in t)u.push(t[b]);else{for(let L=0,T=o.length;L<T;L++){let C=o[L],A=i.getAttribute(C),E=i.morphAttributes[C],_=A.itemSize,I=l[C],z=c[C];for(let k=0;k<_;k++){let O=f[k],W=d[k];if(I[W](a,A[O](M)),E)for(let F=0,J=E.length;F<J;F++)z[F][W](a,E[F][O](M))}}t[b]=a,u.push(a),a++}}let m=i.clone();for(let v in i.attributes){let M=l[v];if(m.setAttribute(v,new M.constructor(M.array.slice(0,a*M.itemSize),M.itemSize,M.normalized)),v in c)for(let b=0;b<c[v].length;b++){let L=c[v][b];m.morphAttributes[v][b]=new L.constructor(L.array.slice(0,a*L.itemSize),L.itemSize,L.normalized)}}return m.setIndex(u),m}function hs(i,e){let t=document.createElement("canvas");return t.width=i,t.height=e,[t,t.getContext("2d")]}function Wr(i,e=1){let t=new Ys(i);return t.colorSpace=Kt,t.wrapS=t.wrapT=An,t.repeat.set(e,e),t.anisotropy=8,t}function Ev(i,e,t,n,s,r=2){for(let a=0;a<n;a++){i.fillStyle=s[Math.random()*s.length|0],i.globalAlpha=Math.random()*.5+.1;let o=Math.random()*r+.5;i.fillRect(Math.random()*e,Math.random()*t,o,o)}i.globalAlpha=1}function nd(){let[i,e]=hs(128,128);e.clearRect(0,0,128,128),e.strokeStyle="#c9ccd0",e.lineWidth=3;for(let t=-128;t<256;t+=16)e.beginPath(),e.moveTo(t,0),e.lineTo(t+128,128),e.stroke(),e.beginPath(),e.moveTo(t+128,0),e.lineTo(t,128),e.stroke();return Wr(i)}function Xr(i,e={}){let t=e.w||512,n=e.h||128,[s,r]=hs(t,n);e.bg&&(r.fillStyle=e.bg,r.fillRect(0,0,t,n)),r.fillStyle=e.color||"#f2f2f2",r.font=`900 ${e.size||64}px Impact, "Arial Black", sans-serif`,r.textAlign="center",r.textBaseline="middle";let a=String(i).split(`
`),o=(e.size||64)*1.1;a.forEach((c,u)=>r.fillText(c,t/2,n/2+(u-(a.length-1)/2)*o)),e.worn&&(r.globalCompositeOperation="destination-out",Ev(r,t,n,1800,["#000"],4),r.globalCompositeOperation="source-over");let l=Wr(s);return l.wrapS=l.wrapT=Sn,l}function id(){let[i,e]=hs(256,340);return e.fillStyle="#f7f3e8",e.fillRect(0,0,256,340),e.fillStyle="#b3121b",e.fillRect(0,0,256,70),e.fillStyle="#fff",e.font="900 46px Impact, sans-serif",e.textAlign="center",e.fillText("PREA",128,52),e.fillStyle="#111",e.font="700 22px Arial, sans-serif",["ZERO TOLERANCE","For real this time.","","Training Module","2 of 47","","Initial here: ____"].forEach((t,n)=>e.fillText(t,128,110+n*30)),Wr(i)}var ir=8;function sd(){let[t,n]=hs(256*ir,256);n.fillStyle="#fff",n.fillRect(0,0,256*ir,256);for(let r=0;r<ir;r++){let a=r*256+64,o=256*.44,l=(d,p=7)=>{n.fillStyle="#1a1210",n.beginPath(),n.ellipse(a+d,o,p*.8,p,0,0,6.28),n.fill()},c=d=>{n.strokeStyle="#2a1a12",n.lineWidth=6,n.lineCap="round",[-1,1].forEach(p=>{n.beginPath(),n.moveTo(a+p*30,o-18-d*p*-1),n.lineTo(a+p*9,o-16+d),n.stroke()})},u=(d,p)=>{n.strokeStyle="#4a2018",n.lineWidth=5,n.beginPath(),n.moveTo(a-d,256*.62),n.quadraticCurveTo(a,256*.62+p,a+d,256*.62),n.stroke()},f=d=>`rgba(25,18,14,${d})`;r===7?(l(-18,11),l(18,11),n.fillStyle="#fff",n.fillRect(a-20,o-3,4,4),n.fillRect(a+16,o-3,4,4),u(22,14)):(l(-17),l(17)),(r===1||r===4||r===5)&&c(8),r===0||r===3?u(14,-4):r!==7&&u(16,6),r===2&&(n.fillStyle=f(.75),n.beginPath(),n.ellipse(a,256*.68,46,34,0,0,3.14),n.fill()),r===3&&(n.fillStyle=f(.8),n.fillRect(a-10,256*.66,20,24)),r===4&&(n.fillStyle=f(.85),n.fillRect(a-24,256*.57,48,9)),r===5&&(n.fillStyle=f(.9),n.beginPath(),n.ellipse(a+22,o+20,4,7,0,0,6.28),n.fill(),n.font="900 16px Arial",n.textAlign="center",n.fillText("13",a,256*.3)),r===6&&(n.strokeStyle="rgba(120,40,40,0.8)",n.lineWidth=4,n.beginPath(),n.moveTo(a-34,o-22),n.lineTo(a-12,o+26),n.stroke(),c(4))}let s=Wr(t);return s.wrapS=s.wrapT=Sn,s}function rd(){let[i,e]=hs(512,128);e.fillStyle="#fff",e.fillRect(0,0,512,128),e.fillStyle="rgba(15,15,15,0.9)",e.textAlign="center",e.textBaseline="middle",e.font="900 96px Impact, Arial Black, sans-serif",e.fillText("DOC",256,66),e.font="900 44px Impact, Arial Black, sans-serif",e.fillText("DOC",451,52),e.font="900 15px Arial Black, sans-serif",e.fillText("#"+(4e3+Math.floor(Math.random()*999)),451,92);let t=Wr(i);return t.wrapS=t.wrapT=Sn,t}function ad(i){return Xr(i,{w:512,h:128,size:i.length>8?58:80,color:"#e8e2cf",bg:"#1b1f29"})}function od(){let[i,e]=hs(4,128),t=e.createLinearGradient(0,0,0,128);return t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.2,"rgba(255,255,255,0.5)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,4,128),new Ys(i)}function ld(){let[i,e]=hs(128,128),t=e.createRadialGradient(64,64,4,64,64,62);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.6,"rgba(255,255,255,0.85)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t;for(let s=0;s<7;s++){let r=Math.random()*6.28,a=Math.random()*22;e.beginPath(),e.arc(64+Math.cos(r)*a,64+Math.sin(r)*a,26+Math.random()*18,0,6.28),e.fill()}let n=new Ys(i);return n.colorSpace=Kt,n}var j={T:2,w:0,h:0,solid:null,rects:[],spawns:[],doors:[],lights:[],group:null};h.W=j;var He=j.T,cd=new Be,wv=new qt,Sv=new Yt,Tv=new P,Av=new P(1,1,1),kn=class{constructor(){this.geos=[]}add(e,t,n,s,r,a=0,o=0,l=0){let c=(e.index,e.clone());cd.compose(Tv.set(t,n,s),wv.setFromEuler(Sv.set(o,a,l)),Av),c.applyMatrix4(cd);let u=new ye(r),f=c.attributes.position.count,d=new Float32Array(f*3);for(let p=0;p<f;p++)d[p*3]=u.r,d[p*3+1]=u.g,d[p*3+2]=u.b;return c.setAttribute("color",new Ot(d,3)),this.geos.push(c),this}box(e,t,n,s,r,a,o,l=0){return this.add(new Pe(e,t,n),s,r,a,o,l)}cyl(e,t,n,s,r,a,o=0,l=0,c=0,u=12,f=e){return this.add(new rt(e,f,t,u),n,s,r,a,l,o,c)}build(e,t=!0){if(!this.geos.length)return null;let n=new pe(Vr(this.geos,!1),e);return n.castShadow=t,n.receiveShadow=!0,this.geos.forEach(s=>s.dispose()),n}};j.Batch=kn;var Rv=new ao,Ah={};function Rh(i,e){if(!Ah[i]){let t=Rv.load(`assets/tex/${i}.jpg`);t.wrapS=t.wrapT=An,t.anisotropy=8,e&&(t.colorSpace=Kt),Ah[i]=t}return Ah[i]}function Ih(i,e,t=16777215,n={}){let s=r=>{let a=r.clone();return a.repeat.set(e[0],e[1]),a.needsUpdate=!0,a};return new ze(Object.assign({map:s(Rh(i+"_diff",!0)),normalMap:s(Rh(i+"_nor")),roughnessMap:s(Rh(i+"_rough")),color:t,normalScale:new oe(1.2,1.2)},n))}j.pbrMat=Ih;var Zt={};function Cv(){Zt.ready||(Zt.paint=new ze({vertexColors:!0,roughness:.55,metalness:.25}),Zt.matte=new ze({vertexColors:!0,roughness:.9}),Zt.metal=new ze({vertexColors:!0,roughness:.35,metalness:.8}),Zt.glow=new yt({vertexColors:!0,toneMapped:!1}),Zt.shaft=new yt({map:od(),transparent:!0,opacity:.22,blending:Tn,depthWrite:!1,side:Xt,toneMapped:!1}),Zt.fence=new ze({map:nd(),alphaTest:.5,side:Xt,metalness:.6,roughness:.4}),Zt.ready=!0)}function Iv(i,e,t,n,s,r=0){let a=Math.cos(r),o=Math.sin(r),l=(f,d)=>[t+f*a+d*o,n-f*o+d*a],c=(f,d,p,y,x,g=0,m=0)=>{let[v,M]=l(d,y);i.add(f,v,p,M,x,r,g,m)},u=.55;[-1,1].forEach(f=>[-1.9,1.9].forEach(d=>c(new rt(.62,.62,.5,16),f,.62,d,1447446,0,Math.PI/2))),[-1,1].forEach(f=>[-1.9,1.9].forEach(d=>c(new rt(.32,.32,.52,10),f,.62,d,10133670,0,Math.PI/2))),c(new Pe(1.6,.25,4.6),0,.7+u*.4,0,2236962),c(new Pe(2.1,.75,5.6),0,1.25+u,0,s),c(new Pe(2,.85,2),0,2.05+u,-.45,s),c(new Pe(1.9,.6,1.9),0,2.08+u,-.45,1779507),c(new Pe(1.8,.12,2.1),0,1.7+u,1.6,2763306),c(new Pe(2.3,.3,.25),0,1+u,-2.85,14212579),[-.7,-.25,.25,.7].forEach(f=>{let[d,p]=l(f,-1.1);e.box(.32,.12,.14,d,2.6+u,p,16774348,r)}),[-.8,.8].forEach(f=>{let[d,p]=l(f,-2.82);e.box(.35,.18,.06,d,1.38+u,p,16776166,r)}),[-.85,.85].forEach(f=>{let[d,p]=l(f,2.82);e.box(.3,.2,.06,d,1.4+u,p,16722458,r)})}function Pv(i,e,t,n,s,r=0){let a=Math.cos(r),o=Math.sin(r),l=(u,f)=>[t+u*a+f*o,n-u*o+f*a],c=(u,f,d,p,y,x=0,g=0)=>{let[m,v]=l(f,p);i.add(u,m,d,v,y,r,x,g)};[-.8,.8].forEach(u=>[-1.4,1.4].forEach(f=>c(new rt(.34,.34,.25,12),u,.34,f,1315860,0,Math.PI/2))),c(new Pe(1.75,.6,4.3),0,.65,0,s),c(new Pe(1.55,.5,2.1),0,1.18,.2,s),c(new Pe(1.5,.42,2),0,1.2,.2,1779507),[-.6,.6].forEach(u=>{let[f,d]=l(u,-2.16);e.box(.3,.12,.05,f,.75,d,16776166,r)})}function Ao(i,e,t="."){return Array.from({length:e},()=>Array(i).fill(t))}var Ne=i=>i*He+He/2,Oe=i=>i*He+He/2;function In(i,e,t,n,s,r,a){let o=new pe(new Dt(s,r),new ze({map:Xr(e,a),transparent:!0,roughness:.8,depthWrite:!1}));o.rotation.x=-Math.PI/2,o.position.set(t,.02,n),o.receiveShadow=!0,i.add(o)}function Cn(i,e,t,n,s,r,a){let o=h.R.takeLight(i,e,t);return o.position.set(n,s,r),j.lights.push({L:o,base:e,kind:a,t:Math.random()*10}),o}function Lv(i){let n=Ao(44,32);for(let a=0;a<44;a++)n[0][a]=n[1][a]=n[2][a]="#",n[31][a]="F";for(let a=0;a<32;a++)n[a][0]=n[a][43]="F";[10,22,34].forEach(a=>{n[2][a]="S",n[2][a+1]="S"}),[12,22].forEach(a=>{n[a][0]="S",n[a][43]="S"});let s={w:44,h:32,g:n,start:[Ne(22),Oe(28)],vehicles:[],outdoor:!0,theme:{floor:"asphalt_02",floorScale:6,wall:"precast_concrete_wall",hdri:"suburban_parking_area",envI:.75,grade:{tint:[1.07,1,.92],sat:1.12,contrast:1.08}}},r=[9379101,2047887,1118481,15263976,7040885,3104047,13214247,5910150];return[8,15,22].forEach((a,o)=>{for(let l=3;l<41;l+=3){if(Math.random()<.18)continue;let c=Math.random()<.5;s.vehicles.push({truck:c,x:Ne(l),z:Oe(a+1),color:h.pick(r),ry:o===1?Math.PI:0})}}),s.vehicles.push({truck:!0,x:Ne(30),z:Oe(28),color:1920959,ry:Math.PI/2,mine:!0}),s.vehicles.push({truck:!0,x:Ne(38),z:Oe(28),color:1118481,ry:Math.PI/2}),s.decor=a=>{In(a,`COMPACT
CARS ONLY`,Ne(9),Oe(12),5,2.5,{size:70,color:"#f5f5f5",worn:!0}),In(a,"RESERVED: SGT",Ne(18),Oe(19),6,1.6,{size:72,color:"#ffd23a",worn:!0}),In(a,`${i.toUpperCase()}'S TRUCK
(BOTH SPOTS)`,Ne(30),Oe(25.3),7,2.6,{size:60,color:"#9fd0ff",worn:!0}),In(a,`RESERVED: C. ALANIZ
BIG BRO PARKING`,Ne(38),Oe(25.3),7,2.6,{size:56,color:"#ffd34d",worn:!0}),In(a,"FIRE LANE",Ne(22),Oe(5),7,1.8,{size:90,color:"#e33",worn:!0});let o=new pe(new Dt(14,1.4),new ze({map:Xr("BIG TRUCK STATE CORRECTIONAL",{w:1024,h:102,size:76,color:"#f3efe2",bg:"#24324a"}),roughness:.6}));o.position.set(34,1.6,3*He+.03),a.add(o)},s}function pd(){let t=Ao(38,26);for(let a=0;a<38;a++)t[0][a]=t[25][a]="#";for(let a=0;a<26;a++)t[a][0]=t[a][37]="#";let n=[],s=(a,o,l,c)=>{for(let u=1;u<37;u++)for(let f=a;f<=o;f++)t[f][u]=(u-1)%3===0?"#":".";for(let u=1;u<37;u++)t[l][u]=(u-1)%3===0?"#":"C";for(let u=2;u<37;u+=3)n.push({i:u,j:c?a+1:o-1,door:l,top:c})};s(1,3,4,!0),s(22,24,21,!1),[12,13].forEach(a=>{t[a][1]="S",t[a][36]="S"});let r={w:38,h:26,g:t,start:[Ne(19),Oe(13)],cells:n,tables:[],outdoor:!1,theme:{floor:"concrete_floor_worn_001",floorScale:5,wall:"concrete_block_wall",wallTint:15392710,stripe:3104680,hdri:"empty_warehouse_01",envI:.45,grade:{tint:[.95,1.02,.96],sat:1.05,contrast:1.18,vignette:.45}}};return[8,13,18].forEach(a=>[7,13,25,31].forEach(o=>r.tables.push([Ne(o),Oe(a)]))),r.decor=a=>{In(a,"IMU NORTH",Ne(19),Oe(9.5),6,2,{size:100,color:"#d8c79a",worn:!0}),In(a,`NO LOITERING
(YOU ARE LOITERING)`,Ne(19),Oe(17.5),7,2.2,{size:54,color:"#d8c79a",worn:!0}),[5,20].forEach(c=>{let u=new pe(new Dt(36*He,.25),new ze({color:12591130,roughness:.7}));u.rotation.x=-Math.PI/2,u.position.set(38*He/2,.015,Oe(c)+(c===5?-.6:.6)),a.add(u)});let o=id(),l=new ze({map:o,roughness:.8});[4,13,22,31].forEach(c=>{let u=new pe(new Dt(.9,1.2),l);u.position.set(Ne(c),1.3,5*He+.03),a.add(u)})},r}function Dv(){let t=Ao(36,24);for(let a=0;a<36;a++)t[0][a]=t[23][a]="#";for(let a=0;a<24;a++)t[a][0]=t[a][35]="#";let n=[],s=[];for(let a=1;a<35;a++)for(let o=1;o<=3;o++)t[o][a]=(a-1)%3===0?"#":".";for(let a=1;a<35;a++)t[4][a]=(a-1)%3===0?"#":"C";for(let a=2;a<35;a+=3)s.push({i:a,j:2,door:4,top:!0,locked:!0});for(let a=1;a<35;a++)for(let o=20;o<=22;o++)t[o][a]=(a-1)%3===0?"#":".";for(let a=1;a<35;a++)t[19][a]=(a-1)%3===0?"#":"C";for(let a=2;a<35;a+=3)n.push({i:a,j:21,door:19,top:!1});[11,12].forEach(a=>{t[a][1]="S",t[a][34]="S"});let r={w:36,h:24,g:t,start:[Ne(18),Oe(14)],cells:s.concat(n),caged:s,tables:[],mode:"row",outdoor:!1,water:[[Ne(10),Oe(12),14,6],[Ne(25),Oe(11),10,5],[Ne(18),Oe(16),8,3]],theme:{floor:"damaged_concrete_floor",floorScale:5,wall:"concrete_wall_006",wallTint:12174536,stripe:7017492,hdri:"sepulchral_chapel_basement",envI:.6,grade:{tint:[.86,.98,1.08],sat:.85,contrast:1.25,vignette:.6}}};return r.decor=a=>{In(a,"KILLER ROW",Ne(18),Oe(8),9,2.4,{size:100,color:"#b8c6cc",worn:!0}),In(a,`DO NOT FEED
DO NOT CHAT
DO NOT BUY THE PAINTINGS`,Ne(18),Oe(18.5),8,3,{size:46,color:"#c43a3a",worn:!0})},r}var _t=2830133,ii=14212579,qr=1381653,Ph=[1118481,11739162,1851294,14198048,3112242];function Lh(i,e,t,n,s,r,a=!1){i.cyl(.025,s,e,t,n,ii,a?Math.PI/2:0,0,a?0:Math.PI/2,8);for(let o=-1;o<=1;o+=2)for(let l=0;l<r;l++){let c=(s/2-.25-l*.07)*o,u=.23-l*.025;i.cyl(u,.06,a?e:e+c,t,a?n+c:n,Ph[l%Ph.length],a?Math.PI/2:0,0,a?0:Math.PI/2,16)}}function hd(i,e,t,n,s){e.box(.34,.1,1.25,t,.46,n,qr),i.box(.08,.42,.08,t,.21,n-.5,_t).box(.08,.42,.08,t,.21,n+.45,_t).box(.6,.05,.08,t,.03,n-.5,_t).box(.6,.05,.08,t,.03,n+.45,_t);for(let r of[-.55,.55])i.box(.08,1.15,.08,t+r,.58,n-.62,_t),i.box(.12,.05,.12,t+r,1.05,n-.55,ii);Lh(i,t,1.1,n-.55,2.2,s),j.rects.push({x:t,z:n-.1,hw:1,hd:.8})}function Nv(i,e,t,n,s){e.box(.34,.1,.5,t,.46,n+.35,qr),e.add(new Pe(.34,.1,.95),t,.75,n-.15,qr,0,-.62,0),i.box(.08,.45,.08,t,.22,n+.45,_t).box(.08,.95,.08,t,.47,n-.45,_t);for(let r of[-.55,.55])i.box(.08,1.5,.08,t+r,.75,n-.6,_t);Lh(i,t,1.42,n-.55,2.2,s),j.rects.push({x:t,z:n,hw:1,hd:.8})}function ud(i,e,t,n){for(let s of[-.65,.65])for(let r of[-.55,.55])i.box(.09,2.4,.09,t+s,1.2,n+r,_t);for(let s of[-.55,.55])i.box(1.4,.09,.09,t,2.38,n+s,_t);for(let s of[-.65,.65])i.box(.09,.09,1.2,t+s,2.38,n,_t),i.box(.09,.09,1.2,t+s,.05,n,_t),i.box(.06,.06,1.1,t+s,.75,n,ii);i.cyl(.02,1.4,t,2.45,n+.62,ii,0,0,Math.PI/2,8),e.box(1.6,.03,1.6,t,.015,n,2760726),Lh(i,t,1.42,n-.5,2.3,4),j.rects.push({x:t,z:n,hw:.85,hd:.75})}function Uv(i,e,t,n){i.box(3.4,.08,.5,t,.55,n,_t).box(3.4,.08,.5,t,.9,n-.05,_t);for(let s of[-1.6,0,1.6])i.box(.08,.9,.5,t+s,.45,n,_t);for(let s=0;s<8;s++)for(let[r,a]of[[.65,.08],[1,.03]]){let o=t-1.45+s*.41,l=.06+s*.008;i.cyl(.018,.3,o,r,n+a-.08,ii,0,0,Math.PI/2,6);for(let c of[-.14,.14])i.cyl(l,.06,o+c,r,n+a-.08,1579034,0,0,Math.PI/2,6)}j.rects.push({x:t,z:n,hw:1.8,hd:.4})}function Ov(i,e,t,n){i.box(1.1,.08,1.7,t,.04,n,_t),i.box(.1,.42,.1,t,.25,n+.35,_t),e.box(.5,.1,.45,t,.5,n+.35,qr),i.box(.1,1.3,.1,t,.68,n+.7,_t),e.box(.5,.75,.1,t,1,n+.62,qr);for(let s of[-1,1])i.box(.07,.07,.75,t+s*.38,1,n+.25,_t),i.box(.07,.3,.07,t+s*.38,.88,n-.12,_t),i.cyl(.03,.22,t+s*.3,.75,n-.12,2236962,0,0,Math.PI/2,8);i.box(.1,1.9,.1,t-.25,.95,n-.65,_t).box(.1,1.9,.1,t+.25,.95,n-.65,_t).box(.6,.1,.12,t,1.9,n-.65,_t);for(let s=0;s<14;s++)i.box(.38,.05,.2,t,.12+s*.058,n-.65,s===9?11739162:7172986);i.cyl(.012,1.5,t-.08,.85,n-.65,ii,0,0,0,6).cyl(.012,1.5,t+.08,.85,n-.65,ii,0,0,0,6),j.rects.push({x:t,z:n,hw:.65,hd:.95})}function kv(i,e,t,n){for(let a=0;a<=3;a++)i.box(.1,2.7,.1,t-3*1.3/2+a*1.3,1.35,n,_t);i.box(3*1.3+.1,.1,.1,t,2.7,n,_t);for(let a=0;a<3;a++)i.cyl(.025,1.3-.1,t-3*1.3/2+(a+.5)*1.3,2.45,n+.15,ii,0,0,Math.PI/2,8);for(let a of[-.28,.28])i.box(.06,.06,.6,t+3*1.3/2+.5+a,1.2,n,ii).box(.08,1.2,.08,t+3*1.3/2+.5+a,.6,n-.28,_t);j.rects.push({x:t+.3,z:n,hw:3*1.3/2+.7,hd:.3})}function fd(i,e,t){i.box(.1,1.4,.1,e,.7,t,_t).box(.8,.06,.8,e,.03,t,_t);for(let n=0;n<6;n++){let s=n*Math.PI/3;i.cyl(.03,.3,e+Math.cos(s)*.15,.3+n%3*.4,t+Math.sin(s)*.15,ii,0,-s,Math.PI/2,6),i.cyl(.23,.06,e+Math.cos(s)*.3,.3+n%3*.4,t+Math.sin(s)*.3,Ph[n%4],0,-s,Math.PI/2,16)}j.rects.push({x:e,z:t,hw:.5,hd:.5})}function zv(i){let n=Ao(44,30);for(let r=0;r<44;r++)n[0][r]=n[1][r]=n[2][r]="#",n[29][r]="F";for(let r=0;r<30;r++)n[r][0]=n[r][43]="F";[8,20,32].forEach(r=>{n[2][r]="S",n[2][r+1]="S"}),[14,15].forEach(r=>{n[r][0]="S",n[r][43]="S"});let s={w:44,h:30,g:n,start:[Ne(20),Oe(24)],outdoor:!0,mode:"yard",tables:[],theme:{floor:"asphalt_02",floorScale:7,floorTint:14209732,wall:"precast_concrete_wall",wallTint:14274488,stripe:3104680,hdri:"suburban_parking_area",envI:.9,grade:{tint:[1.04,1,.95],sat:1.12,contrast:1.08}},lifters:[],gym:{x0:52,x1:84,z0:9,z1:31}};return s.lifters=[[57,15],[63.5,15],[70,15],[58,23.5],[66,23.5],[76,24.5],[80,15]],[[14,20],[26,20]].forEach(([r,a])=>s.tables.push([Ne(r),Oe(a)])),s.decor=r=>{let a=new kn,o=new kn,l=new kn,c=new pe(new Dt(32,22),new ze({color:1776671,roughness:.95}));c.rotation.x=-Math.PI/2,c.position.set(68,.012,20),c.receiveShadow=!0,r.add(c);for(let[f,d,p,y]of[[68,9,32,.15],[68,31,32,.15],[52,20,.15,22],[84,20,.15,22]])l.box(p,.02,y,f,.02,d,16765498);hd(a,o,57,15,3),hd(a,o,63.5,15,4),Nv(a,o,70,15,2),Ov(a,o,79,15),ud(a,o,58,23.5),ud(a,o,65,23.5),Uv(a,o,73,28.5),kv(a,o,74,21),fd(a,83,26),fd(a,53.5,28);for(let[f,d,p,y]of[[24,13,28,.12],[10,27,.12,28],[38,27,.12,28],[24,19,8,.12],[20,16,.12,6],[28,16,.12,6]])l.box(p,.02,y,f,.02,d,15921906);a.box(.15,3,.15,24,1.5,9.6,2767466).box(1.8,1.05,.06,24,3.05,10,15921906),a.add(new xn(.23,.02,6,16),24,2.75,10.35,16734746,0,Math.PI/2,0),j.rects.push({x:24,z:9.6,hw:.3,hd:.3}),o.box(6,.45,.7,44,.22,7,9077880),j.rects.push({x:44,z:7,hw:3,hd:.4}),r.add(a.build(Zt.metal),o.build(Zt.paint),l.build(Zt.matte,!1)),In(r,"WEIGHT PIT",68,11,7,1.6,{size:90,color:"#ffd23a",worn:!0}),In(r,`NO SPOTTING
WITHOUT CONSENT FORM`,68,32.5,8,2.4,{size:54,color:"#d8c79a",worn:!0}),In(r,"REC YARD",24,34,7,2,{size:90,color:"#d8c79a",worn:!0});let u=new pe(new Dt(6.4,2),new ze({map:Xr(`YARD RECORDS
BENCH 405 . C. ALANIZ
SQUAT 585 . C. ALANIZ
CURLS . C. ALANIZ (IN THE SQUAT RACK)`,{w:1024,h:320,size:46,color:"#f3efe2",bg:"#1d2a40"}),roughness:.6}));u.position.set(68,1.5,3*He+.03),r.add(u)},s}function Fv(i){let e=pd();e.mode="night",e.theme=Object.assign({},e.theme,{hdri:"sepulchral_chapel_basement",envI:.08,grade:{tint:[.85,.95,1.12],sat:.7,contrast:1.3,vignette:.75}}),e.scares=[[10,12],[19,9],[28,15],[33,11],[6,16],[24,18],[15,14]].map(([n,s])=>({x:Ne(n),z:Oe(s),done:!1}));let t=e.decor;return e.decor=n=>{t(n),In(n,`LIGHTS OUT
2300 - 0600`,Ne(19),Oe(13),6,2.4,{size:70,color:"#7fb0ff",worn:!0})},e}j.BUILDERS={lot:Lv,tier:pd,yard:zv,night:Fv,row:Dv};j.load=function(i,e){j.alarmT=0,j.hemiBase=null,j.halo=null,j.muzzle=null,Cv(),j.group&&(h.R.scene.remove(j.group),j.group.traverse(x=>{x.geometry&&x.geometry.dispose()})),j.group=new ut,j.lights=[],j.rects=[],j.spawns=[],j.doors=[],h.R.resetLights(),h.R.scene.add(j.group);let t=j.BUILDERS[i](e);j.def=t,j.w=t.w,j.h=t.h,j.outdoor=t.outdoor,j.solid=new Uint8Array(t.w*t.h);let n=2.4,s=t.h,r=t.theme,a=r.floorScale,o=new pe(new Dt(t.w*He,t.h*He),Ih(r.floor,[t.w*He/a,t.h*He/a],r.floorTint||16777215));o.rotation.x=-Math.PI/2,o.position.set(t.w*He/2,0,t.h*He/2),o.receiveShadow=!0,j.group.add(o);let l=new pe(new Dt(400,400),new ze({color:t.outdoor?4872754:1118740,roughness:1}));l.rotation.x=-Math.PI/2,l.position.set(t.w*He/2,-.02,t.h*He/2),l.receiveShadow=!0,j.group.add(l);let c=new kn,u=new kn,f=new kn,d=new kn,p=new kn,y=[];for(let x=0;x<t.h;x++)for(let g=0;g<t.w;g++){let m=t.g[x][g],v=Ne(g),M=Oe(x);if(m==="#")j.solid[x*t.w+g]=1,c.box(He,n,He,v,n/2,M,16777215),u.box(He+.02,.08,He+.02,v,n+.04,M,3882306),r.stripe&&u.box(He+.02,.16,He+.02,v,1.15,M,r.stripe);else if(m==="F"){j.solid[x*t.w+g]=1;let b=x===0||x===t.h-1,L=new Dt(He,n);L.rotateY(b?0:Math.PI/2),L.translate(v,n/2,M),y.push(L),f.cyl(.06,n+.3,v-(b?He/2:0),(n+.3)/2,M-(b?0:He/2),9080726);for(let T=0;T<3;T++)f.add(new xn(.28,.025,4,10),v,n+.25,M+(b?0:(T-1)*.6),13620184,b?0:Math.PI/2,0,0)}else m==="S"?j.spawns.push({x:v,z:M,kind:"gate"}):m==="C"&&(j.solid[x*t.w+g]=1)}if(t.vehicles)for(let x of t.vehicles){(x.truck?Iv:Pv)(d,p,x.x,x.z,x.color,x.ry);let g=Math.abs(Math.sin(x.ry))>.5,m=x.truck?1.15:.95,v=x.truck?2.9:2.3;j.rects.push({x:x.x,z:x.z,hw:g?v:m,hd:g?m:v}),x.mine&&Cn(16774096,6,10,x.x,3.2,x.z)}if(t.tables)for(let[x,g]of t.tables){f.cyl(.95,.08,x,.78,g,10134443,0,0,0,20),f.cyl(.12,.78,x,.39,g,7173243);for(let m=0;m<4;m++){let v=m*Math.PI/2+Math.PI/4;f.cyl(.24,.06,x+Math.cos(v)*1.25,.46,g+Math.sin(v)*1.25,10134443,0,0,0,12),f.cyl(.06,.46,x+Math.cos(v)*1.25,.23,g+Math.sin(v)*1.25,7173243)}j.rects.push({x,z:g,hw:.9,hd:.9})}if(t.cells)for(let x of t.cells){let g=new kn;for(let M=0;M<12;M++)g.cyl(.035,n,-He+.17+M*.33,n/2,0,6120555,0,0,0,6);g.box(He*2,.08,.08,0,n-.15,0,6120555).box(He*2,.08,.08,0,.9,0,6120555);let m=g.build(Zt.metal),v=(Ne(x.i)+Ne(x.i+1))/2;m.position.set(v,0,Oe(x.door)),j.group.add(m),d.box(1,.45,1.9,Ne(x.i)-.5,.22,Oe(x.top?2:t.h-3),8023901),f.cyl(.25,.45,Ne(x.i+1)+.4,.22,Oe(x.top?1:t.h-2)+(x.top?.2:-.2),12107976,0,0,0,10),x.locked||j.doors.push({mesh:m,x0:v,cell:x,open:0,opening:!1,spawn:{x:Ne(x.i+1),z:Oe(x.j),kind:"cell"}})}if(t.water)for(let[x,g,m,v]of t.water){let M=new pe(new Dt(m,v),new ze({color:4875888,roughness:.03,metalness:.85,transparent:!0,opacity:.5,envMapIntensity:2.2}));M.rotation.x=-Math.PI/2,M.position.set(x,.03,g),M.receiveShadow=!0,j.group.add(M)}h.R.flashOn=t.mode==="night",h.FX.mistIM&&(h.FX.mistIM.material.opacity=t.mode==="night"?.075:.032),t.mode==="yard"?(h.R.hemi.color.set(13624063),h.R.hemi.groundColor.set(6969924),h.R.hemi.intensity=1.35,h.R.sun.color.set(16773592),h.R.sun.intensity=3.6,h.R.scene.background=new ye(8038104),h.R.scene.fog=new Bi(10271712,70,160),[[24,8],[44,8]].forEach(([x,g])=>{f.cyl(.14,8,Ne(x),4,Oe(g),6054248),p.box(1.6,.25,.6,Ne(x),8,Oe(g),16773312)}),f.box(3,7,3,Ne(2.5),3.5,Oe(s-3.5),7040885).box(4,.3,4,Ne(2.5),7.2,Oe(s-3.5),3882306),p.box(3.2,.9,3.2,Ne(2.5),6.4,Oe(s-3.5),10473727)):t.mode==="night"?(h.R.hemi.color.set(5925530),h.R.hemi.groundColor.set(789524),h.R.hemi.intensity=.16,h.R.sun.color.set(9086207),h.R.sun.intensity=.3,j.halo=Cn(11058431,9,11,0,2.8,0,"halo"),j.muzzle=Cn(16767392,0,12,0,-50,0,"muzzle"),h.R.scene.background=new ye(131846),h.R.scene.fog=new Bi(131846,16,42),Cn(2162528,2.2,9,Ne(2),2.6,Oe(12.5),"flicker"),Cn(2162528,2.2,9,Ne(t.w-3),2.6,Oe(12.5),"flicker"),Cn(16767136,3,7,Ne(29),2.2,Oe(2),"flicker"),[1,t.w-2].forEach(x=>{p.box(.6,.25,.08,Ne(x)+(x===1?.95:-.95),2.6,Oe(12.5),2162528),Cn(16718362,0,16,Ne(x)+(x===1?2:-2),3,Oe(12.5),"alarm")})):t.mode==="row"?(h.R.hemi.color.set(12113128),h.R.hemi.groundColor.set(2765366),h.R.hemi.intensity=.75,h.R.sun.color.set(11850988),h.R.sun.intensity=1.5,h.R.scene.background=new ye(1845808),h.R.scene.fog=new Bi(3820628,22,70),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,Ne(g),n+.1,Oe(x)+(x===4?.8:-.8),13625087)}),[[8,9],[27,9],[8,15],[27,15],[18,12]].forEach(([x,g],m)=>Cn(12573951,22,24,Ne(x),4,Oe(g),m===1?"flicker":"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,Ne(x),n+.3,Oe(12),16719904),Cn(16718362,0,16,Ne(x)+(x===1?2:-2),3,Oe(12),"alarm")})):t.outdoor?(h.R.hemi.color.set(12374783),h.R.hemi.groundColor.set(5917242),h.R.hemi.intensity=1.25,h.R.sun.color.set(16762250),h.R.sun.intensity=3.4,h.R.scene.background=new ye(2831696),h.R.scene.fog=new Bi(2831696,60,140),[[8,13],[36,13],[8,20],[36,20]].forEach(([x,g])=>{let m=Ne(x),v=Oe(g);f.cyl(.12,6,m,3,v,6054248),p.box(1.2,.2,.5,m,6,v,16757594)}),Cn(16752704,10,20,Ne(8),5.5,Oe(16.5),"sodium"),Cn(16752704,10,20,Ne(36),5.5,Oe(16.5),"sodium")):(h.R.hemi.color.set(14542591),h.R.hemi.groundColor.set(2762274),h.R.hemi.intensity=.3,h.R.sun.color.set(13623551),h.R.sun.intensity=.8,h.R.scene.background=new ye(723983),h.R.scene.fog=new Bi(723983,200,400),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,Ne(g),n+.1,Oe(x)+(x===4?.8:-.8),15266047)}),[[9,9],[28,9],[9,17],[28,17]].forEach(([x,g])=>Cn(14937343,12,22,Ne(x),4,Oe(g),"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,Ne(x),n+.3,Oe(12.5),16719904),Cn(16718362,0,16,Ne(x)+(x===1?2:-2),3,Oe(12.5),"alarm")})),h.R.setEnv(r.hdri),h.R.scene.environmentIntensity=r.envI,h.R.setGrade(r.grade);for(let x of j.lights){if(x.kind!=="fluoro"&&x.kind!=="sodium"&&x.kind!=="flicker")continue;let g=x.L.position.y,m=new pe(new rt(.5,2.6,g,20,1,!0),Zt.shaft.clone());m.material.color.set(x.L.color).multiplyScalar(.6),m.position.set(x.L.position.x,g/2,x.L.position.z),j.group.add(m)}if(Bv(t),[c.build(Ih(r.wall,[1,1.2],r.wallTint||16777215)),u.build(Zt.matte),f.build(Zt.metal),d.build(Zt.paint),p.build(Zt.glow,!1)].forEach(x=>x&&j.group.add(x)),y.length){let x=new pe(Vr(y),Zt.fence);x.castShadow=!0,j.group.add(x)}t.decor&&t.decor(j.group);for(let x of j.rects)for(let g=0;g<t.h;g++)for(let m=0;m<t.w;m++)Math.abs(Ne(m)-x.x)<x.hw+.2&&Math.abs(Oe(g)-x.z)<x.hd+.2&&(j.solid[g*t.w+m]=1);return j.dist=new Int16Array(t.w*t.h),j.flowT=0,h.R.precompile(),t};j.openDoor=function(i){if(i.opening)return;i.opening=!0;let e=i.cell.door,t=i.cell.i;j.solid[e*j.w+t+1]=0,h.audio.play("alarm",.6)};function Bv(i){let e=h.R.q.dust;if(j.dust=null,!e)return;let t=new Float32Array(e*3);for(let r=0;r<e;r++)t[r*3]=h.rand(-20,20),t[r*3+1]=h.rand(.2,4),t[r*3+2]=h.rand(-14,14);let n=new zt;n.setAttribute("position",new Ot(t,3));let s=new Za(n,new Pr({size:.07,color:i.outdoor?16767392:14214399,transparent:!0,opacity:.55,blending:Tn,depthWrite:!1}));s.frustumCulled=!1,j.group.add(s),j.dust=s}var Hv=new ye(16715792);j.update=function(i,e){if(j.alarmT>0){j.alarmT-=i,j.hemiBase||(j.hemiBase=h.R.hemi.color.clone());let t=.5+.5*Math.sin(e*9);h.R.hemi.color.copy(j.hemiBase).lerp(Hv,t*.6)}else j.hemiBase&&(h.R.hemi.color.copy(j.hemiBase),j.hemiBase=null);if(j.dust){let t=j.dust.geometry.attributes.position,n=t.array,s=h.R.camTarget.x,r=h.R.camTarget.z;for(let a=0;a<n.length;a+=3)n[a]+=Math.sin(e*.3+a)*i*.25,n[a+1]+=Math.sin(e*.5+a*.7)*i*.08,n[a+2]+=i*.15,n[a]-s>20?n[a]-=40:n[a]-s<-20&&(n[a]+=40),n[a+2]-r>14?n[a+2]-=28:n[a+2]-r<-14&&(n[a+2]+=28);t.needsUpdate=!0}for(let t of j.doors)t.opening&&t.open<1&&(t.open=Math.min(1,t.open+i*1.4),t.mesh.position.x=t.x0-t.open*He);for(let t of j.lights)t.t+=i,t.kind==="fluoro"?t.L.intensity=t.base*(Math.random()<.01?.2:1):t.kind==="flicker"?t.L.intensity=t.base*(Math.sin(e*23)>.6||Math.random()<.08?.1:1):t.kind==="alarm"&&(t.L.intensity=Math.max(j.alarm||0,j.alarmT>0?3:0)*(.5+.5*Math.sin(e*8))*6)};j.tileSolid=(i,e)=>i<0||e<0||i>=j.w||e>=j.h||j.solid[e*j.w+i]===1;j.wallAt=(i,e)=>{let t=Math.floor(i/He),n=Math.floor(e/He);if(t<0||n<0||t>=j.w||n>=j.h)return!0;let s=j.def.g[n][t];return(s==="#"||s==="F"||s==="C")&&j.solid[n*j.w+t]===1};j.rectAt=(i,e)=>{for(let t of j.rects)if(Math.abs(i-t.x)<t.hw&&Math.abs(e-t.z)<t.hd)return!0;return!1};j.blocked=(i,e)=>j.wallAt(i,e)||j.rectAt(i,e);j.collide=function(i){let e=i.r,t=Math.floor((i.x-e)/He),n=Math.floor((i.x+e)/He),s=Math.floor((i.z-e)/He),r=Math.floor((i.z+e)/He);for(let a=s;a<=r;a++)for(let o=t;o<=n;o++)j.wallAt(o*He+1,a*He+1)&&dd(i,o*He+He/2,a*He+He/2,He/2,He/2);for(let a of j.rects)Math.abs(i.x-a.x)<a.hw+e&&Math.abs(i.z-a.z)<a.hd+e&&dd(i,a.x,a.z,a.hw,a.hd)};function dd(i,e,t,n,s){let r=h.clamp(i.x,e-n,e+n),a=h.clamp(i.z,t-s,t+s),o=i.x-r,l=i.z-a,c=o*o+l*l;if(c>=i.r*i.r)return;if(c<1e-6){let d=n-Math.abs(i.x-e),p=s-Math.abs(i.z-t);d<p?i.x+=Math.sign(i.x-e||1)*(d+i.r):i.z+=Math.sign(i.z-t||1)*(p+i.r);return}let u=Math.sqrt(c),f=i.r-u;i.x+=o/u*f,i.z+=l/u*f}j.los=function(i,e,t,n){let s=t-i,r=n-e,a=Math.ceil(Math.hypot(s,r)/.5);for(let o=1;o<a;o++)if(j.blocked(i+s*o/a,e+r*o/a))return!1;return!0};var Ch=new Int32Array(64*64);j.buildFlow=function(i){let e=j.w,t=j.h,n=j.dist;n.fill(-1);let s=0,r=0;for(let a of i){let o=h.clamp(Math.floor(a.x/He),0,e-1),l=h.clamp(Math.floor(a.z/He),0,t-1),c=l*e+o;n[c]!==0&&(n[c]=0,Ch[r++]=c)}for(;s<r;){let a=Ch[s++],o=a%e,l=a/e|0,c=n[a]+1;for(let u=-1;u<=1;u++)for(let f=-1;f<=1;f++){if(!f&&!u)continue;let d=o+f,p=l+u;if(j.tileSolid(d,p)||f&&u&&(j.tileSolid(o+f,l)||j.tileSolid(o,l+u)))continue;let y=p*e+d;n[y]===-1&&(n[y]=c,Ch[r++]=y)}}};j.flowDir=function(i,e,t){let n=j.w,s=Math.floor(i/He),r=Math.floor(e/He);if(s<0||r<0||s>=n||r>=j.h)return!1;let a=j.dist[r*n+s];if(a<=0)return!1;let o=a,l=0,c=0;for(let f=-1;f<=1;f++)for(let d=-1;d<=1;d++){let p=s+d,y=r+f;if(j.tileSolid(p,y)||d&&f&&(j.tileSolid(s+d,r)||j.tileSolid(s,r+f)))continue;let x=j.dist[y*n+p];x>=0&&x<o&&(o=x,l=d,c=f)}if(o===a)return!1;t.x=Ne(s+l)-i,t.z=Oe(r+c)-e;let u=Math.hypot(t.x,t.z)||1;return t.x/=u,t.z/=u,!0};var ne={};h.FX=ne;var Gi=new Be,Ro=new qt,Co=new P,Io=new P,us=new ye,Dh=new Yt,Po=class{constructor(e,t,n,s){this.max=t,this.n=0,this.p=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.size=new Float32Array(t),this.col=new Uint32Array(t),this.grav=new Float32Array(t),this.im=new cn(s,n,t),this.im.instanceMatrix.setUsage(js),this.im.setColorAt(0,us.set(1,1,1)),this.im.frustumCulled=!1,this.im.count=0,e.add(this.im)}spawn(e,t,n,s,r,a,o,l,c,u=1){let f=this.n;return f>=this.max?f=Math.random()*this.max|0:this.n++,this.p[f*3]=e,this.p[f*3+1]=t,this.p[f*3+2]=n,this.vel[f*3]=s,this.vel[f*3+1]=r,this.vel[f*3+2]=a,this.life[f]=this.maxLife[f]=o,this.size[f]=l,this.col[f]=c,this.grav[f]=u,f}update(e,t){let n=0;for(;n<this.n;){if(this.life[n]-=e,this.life[n]<=0){this.kill(n);continue}let s=n*3;this.vel[s+1]-=18*this.grav[n]*e,this.p[s]+=this.vel[s]*e,this.p[s+1]+=this.vel[s+1]*e,this.p[s+2]+=this.vel[s+2]*e,this.p[s+1]<.02&&(t&&this.vel[s+1]<-2&&t(this.p[s],this.p[s+2],this.col[n],this.size[n]),this.p[s+1]=.02,this.vel[s+1]*=-.25,this.vel[s]*=.5,this.vel[s+2]*=.5);let r=this.life[n]/this.maxLife[n],a=this.size[n]*(.4+.6*r);Gi.compose(Co.set(this.p[s],this.p[s+1],this.p[s+2]),Ro.identity(),Io.set(a,a,a)),this.im.setMatrixAt(n,Gi),this.im.setColorAt(n,us.setHex(this.col[n])),n++}this.im.count=this.n,this.im.instanceMatrix.needsUpdate=!0,this.im.instanceColor&&(this.im.instanceColor.needsUpdate=!0)}kill(e){let t=--this.n;if(e!==t){for(let n=0;n<3;n++)this.p[e*3+n]=this.p[t*3+n],this.vel[e*3+n]=this.vel[t*3+n];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.size[e]=this.size[t],this.col[e]=this.col[t],this.grav[e]=this.grav[t]}}clear(){this.n=0,this.im.count=0}};ne.init=function(i){let e=h.R.q;ne.solid=new Po(i,e.particles,new ze({roughness:.4}),new Pe(1,1,1)),ne.glow=new Po(i,Math.floor(e.particles/2),new yt({toneMapped:!1}),new Pe(1,1,1)),ne.cloudMax=160,ne.clouds=[],ne.cloudIM=new cn(new Dr(1,1),new yt({color:16777215,transparent:!0,opacity:.22,depthWrite:!1}),ne.cloudMax),ne.cloudIM.frustumCulled=!1,ne.cloudIM.count=0,ne.cloudIM.setColorAt(0,us.set(1,1,1)),i.add(ne.cloudIM),ne.mistMax=220,ne.mists=[],ne.mistIM=new cn(new Dr(1,2),new yt({color:14676735,transparent:!0,opacity:.032,depthWrite:!1}),ne.mistMax),ne.mistIM.frustumCulled=!1,ne.mistIM.count=0,ne.mistIM.setColorAt(0,us.set(1,1,1)),i.add(ne.mistIM),ne.decalMax=e.decals,ne.decalN=0,ne.decalHead=0,ne.decalIM=new cn(new Dt(1,1).rotateX(-Math.PI/2),new ze({map:ld(),transparent:!0,depthWrite:!1,roughness:.15,metalness:.1,polygonOffset:!0,polygonOffsetFactor:-2}),ne.decalMax),ne.decalIM.frustumCulled=!1,ne.decalIM.count=0,ne.decalIM.receiveShadow=!0,ne.decalIM.setColorAt(0,us.set(1,1,1)),i.add(ne.decalIM),ne.floatEl=document.getElementById("floaters"),ne.floaters=[]};ne.reset=function(){ne.solid.clear(),ne.glow.clear(),ne.clouds.length=0,ne.cloudIM.count=0,ne.mists.length=0,ne.mistIM.count=0,ne.decalN=0,ne.decalHead=0,ne.decalIM.count=0;for(let i of ne.floaters)i.el.remove();ne.floaters.length=0};ne.decal=function(i,e,t,n){let s=ne.decalHead;ne.decalHead=(ne.decalHead+1)%ne.decalMax,ne.decalN=Math.min(ne.decalN+1,ne.decalMax),Gi.compose(Co.set(i,.012+s%50*4e-4,e),Ro.setFromEuler(Dh.set(0,Math.random()*6.28,0)),Io.set(t,1,t*h.rand(.7,1.2))),ne.decalIM.setMatrixAt(s,Gi),ne.decalIM.setColorAt(s,us.setHex(n)),ne.decalIM.count=ne.decalN,ne.decalIM.instanceMatrix.needsUpdate=!0,ne.decalIM.instanceColor.needsUpdate=!0};var Gv=(i,e,t,n)=>{h.settings.gore&&Math.random()<.35&&ne.decal(i,e,n*6+.2,t)};ne.blood=function(i,e,t,n,s,r=10){h.settings.gore||(r=Math.ceil(r/4));let a=h.settings.gore?9046538:14538440;for(let o=0;o<r;o++)ne.solid.spawn(i,e,t,n*h.rand(2,6)+h.rand(-2,2),h.rand(2,6),s*h.rand(2,6)+h.rand(-2,2),h.rand(.5,1.1),h.rand(.05,.12),a)};ne.teeth=function(i,e,t){if(h.settings.gore)for(let n=0;n<2;n++)ne.solid.spawn(i,e,t,h.rand(-3,3),h.rand(4,7),h.rand(-3,3),1.5,.05,16775400)};ne.sparks=function(i,e,t,n=8,s=16765562){for(let r=0;r<n;r++)ne.glow.spawn(i,e,t,h.rand(-6,6),h.rand(1,7),h.rand(-6,6),h.rand(.15,.4),h.rand(.04,.08),s,.6)};ne.spit=function(i,e,t,n,s){for(let r=0;r<6;r++)ne.solid.spawn(i,e,t,n*h.rand(5,9)+h.rand(-1,1),h.rand(1,3),s*h.rand(5,9)+h.rand(-1,1),.7,.05,14279861)};ne.splash=function(i,e,t,n=14){for(let s=0;s<n;s++)ne.solid.spawn(i,.3,e,h.rand(-4,4),h.rand(2,5),h.rand(-4,4),.6,h.rand(.05,.1),t);ne.decal(i,e,1.6,t)};ne.cloud=function(i,e,t,n,s,r=.5,a=16742960){ne.clouds.length>=ne.cloudMax&&ne.clouds.shift(),ne.clouds.push({x:i,y:e,z:t,vx:n,vz:s,s:r,t:0,max:h.rand(1,1.6),col:a})};ne.mist=function(i,e,t,n,s,r=.5){ne.mists.length>=ne.mistMax&&ne.mists.shift(),ne.mists.push({x:i,y:e,z:t,vx:n,vz:s,s:r*1.5,t:0,max:h.rand(1.6,2.4),seed:Math.random()*6.28,spin:h.rand(-2,2)})};ne.float=function(i,e,t,n,s="#fff",r=15,a=1.6){ne.floaters.length>=14&&ne.floaters.shift().el.remove();let o=document.createElement("div");o.className="floater",o.textContent=n,o.style.color=s,o.style.fontSize=Math.round(r*(innerHeight<560?.72:.85))+"px",ne.floatEl.appendChild(o),ne.floaters.push({el:o,x:i,y:e,z:t,t:a,max:a,w:o.offsetWidth})};ne.update=function(i){ne.solid.update(i,Gv),ne.glow.update(i);let e=0;for(let t=ne.clouds.length-1;t>=0;t--){let n=ne.clouds[t];if(n.t+=i,n.t>=n.max){ne.clouds.splice(t,1);continue}n.x+=n.vx*i,n.z+=n.vz*i,n.vx*=.9,n.vz*=.9,n.y+=i*.3;let s=n.s*(1+n.t*2.2)*(1-Math.pow(n.t/n.max,3));Gi.compose(Co.set(n.x,n.y,n.z),Ro.identity(),Io.set(s,s*.7,s)),ne.cloudIM.setColorAt(e,us.setHex(n.col)),ne.cloudIM.setMatrixAt(e++,Gi)}ne.cloudIM.count=e,ne.cloudIM.instanceMatrix.needsUpdate=!0,ne.cloudIM.instanceColor&&(ne.cloudIM.instanceColor.needsUpdate=!0),e=0;for(let t=ne.mists.length-1;t>=0;t--){let n=ne.mists[t];if(n.t+=i,n.t>=n.max){ne.mists.splice(t,1);continue}let s=Math.sin(n.t*5+n.seed)*2.2;n.x+=(n.vx-n.vz*s*.12)*i,n.z+=(n.vz+n.vx*s*.12)*i,n.vx*=.93,n.vz*=.93,n.y+=i*.25;let r=n.t/n.max,a=n.s*(1+r*2.6)*(1-r*r);Dh.set(0,n.seed+n.t*n.spin,0),Gi.compose(Co.set(n.x,n.y,n.z),Ro.setFromEuler(Dh),Io.set(a*2.2,a*.3,a*.7)),ne.mistIM.setMatrixAt(e++,Gi)}ne.mistIM.count=e,ne.mistIM.instanceMatrix.needsUpdate=!0;for(let t=ne.floaters.length-1;t>=0;t--){let n=ne.floaters[t];if(n.t-=i,n.y+=i*.9,n.t<=0){n.el.remove(),ne.floaters.splice(t,1);continue}let[s,r,a]=h.R.worldToScreen(n.x,n.y,n.z),o=n.w/2+8;s=o*2>innerWidth?innerWidth/2:Math.max(o,Math.min(innerWidth-o,s)),n.el.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%)`,n.el.style.opacity=a?Math.min(1,n.t/(n.max*.3)):0}};var md=[["{bernardo}","Hey, you wanna see how big my truck is? No? Too bad, it is parked across three spots."],["{bernardo}","Six-inch lift, 37s, and a payment bigger than my mortgage. Worth it."],["{bernardo}","{hero}, you owe me twenty on Sunday's game. Do not die before you pay me."],["{bernardo}","That linebacker they drafted hits softer than this whole tier."],["{bernardo}","If I go down, somebody move my truck. It is in the fire lane. Again."],["{bernardo}","My shield has seen more action than my fantasy team."],["{dustin}","Fourth taco of the shift. Pray for whoever is downwind."],["{dustin}","My truck is lifted so high the inmates need a step stool to key it."],["{dustin}","Our offensive line blocks worse than this door, and this door is gone."],["{dustin}","I sprayed one dude so hard his grandkids are gonna cough."],["{dustin}","Three energy drinks in. I can hear colors. Let's GO."],["{dustin}","Somebody tell the guy in cell 9 his mama called. Collect. She wants her shoes back."],["{caleb}","What's up bro. Did you see the game last night? Ref was a bum."],["{caleb}","{hero}, if you die, I am taking your parking spot AND your taco."],["{caleb}","That dude's breath is a use of force all by itself."],["{caleb}","You call that a takedown, {hero}? My little cousin tackles better at flag football."],["{caleb}","I am six foot four of pure overtime, baby."],["{caleb}","Tell Sarge his mustache has been written up for loitering."],["{HERO}","I have been awake so long my energy drink needs an energy drink."],["{HERO}","Somebody tell the warden my truck payment is due Friday."],["{HERO}","I swear to God, if I miss kickoff for this."],["{HERO}","Three hundred inmates and not one of them can pick a winner on Sunday."],["{HERO}","I am one bad taco away from a chemical incident."],["SERGEANT","{hero}, that is the ugliest takedown I have ever signed off on."],["SERGEANT","Whoever parked the lifted truck in the fire lane: nice truck. Move it."],["SERGEANT","I played college ball, you know. Nobody asked. But I did."],["SERGEANT","Hydrate, people. And no, Monster does not count as water. It counts as courage."],["RADIO","Reminder: the betting pool on this riot is closed. {bernardo} took the over."],["RADIO","Taco truck is at the sally port. Officers only. Inmates, that means you, Delgado."],["RADIO","Score update for those of you not currently bleeding: we are losing by 14."],["RADIO","Lost and found: one dentures, one shank, one dignity. Please claim at Central."],["COMPLIANCE","Friendly reminder: PREA training is due by end of shift. Your shift does not end."],["COMPLIANCE","PREA Module 2 of 47 will now autoplay over your radio."],["COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one still standing."],["COMPLIANCE","Great news! The PREA auditor is on site today. Please stop bleeding on the paperwork."],["COMPLIANCE","PREA Zero Tolerance includes zero tolerance for late paperwork."]],gd=["Sit DOWN, sweetheart.","That all you got?","File a grievance, tough guy.","Who wants some? Form a line!","I eat tacos tougher than you.","Next!","Back in your cell, princess.","You swing like a Cowboys fan.","Count that, chief.","That's a write-up.","Not on my overtime!","You want to see my truck? Too bad.","Lockdown, baby!","Tell it to the law library.","My ex hits harder.","Touchdown!","Flag on the play!","Stay down!","Chow's cancelled.","Somebody call medical. Not for me."],xd=["Fuck you, CO!","Bitch-ass cop!","I got your plate number!","Your truck is compensating, bro!","You can't even read, boss!","I know where you park!","I'm gonna gas your ass!","Pig!","I'm telling my lawyer!","Your wife writes me letters!","Come in here, tough guy!","This my house!","You ain't shit without that spray!","Bring the Sarge, punk!","Chow was cold AGAIN!","Where my commissary at?!","I want a grievance form!","You smell like tacos and fear!","I'll beat your ass!","PREA! PREA! He looked at me!","Get off my tier!","Y'all can't count!","Lift your truck? Lift THIS!","Your mama on my visitor list!","Shoot me, I dare you!","I'm on psych meds, I don't give a fuck!","Your football team trash!","I'll spit on you!"],Nh=["MY EYES!","Ahh shit!","Medical! MEDICAL!","I'm filing on you!","That's excessive!","I can't breathe... jk","My tooth!","Ow! My commissary!","Okay okay okay!","I'm calling my mama!","That's a lawsuit!","Not the face!"],Uh=["Hey cutie!","Officer, you work out?","Ooh, cuff me, daddy!","Is that a baton or are you happy to see me?","Hey big truck!","Girl, those boots? No.","You can pat ME down anytime.","Call me, officer!","I did my makeup for THIS?!","Watch the hair!","Honey, I'm the shot caller now.","You're cute when you're scared.","Don't make me take my earrings off!","This jumpsuit is a crime. So am I."],yd={cup:["Taste this!","Fresh batch!","Gassed!"],tray:["Chow time!","Catch!"],shoe:["Shoe check!","Size 12, bitch!"]},vd={taco:["TACO POWER!","Carne asada mode!","Extra hot sauce!","Al pastor, baby!"],gold:["GOLDEN TACO!","Caleb hid this. Respect.","Big bro approved."],zyn:["ZYN! LIP ON FIRE!","Hot pouch! HOT POUCH!","Ooh that burns. Good.","Zyn in. Brain on.","Top lip is MELTING."],chew:["Dip check!","Fat lip. Full health.","Old school, baby.","Pinch between cheek and gum!"],drink:["ENERGY DRINK!","Zero sugar, all rage!","Heart rate: yes.","Monster mode!"]},Oh=["THE TV TOLD ME TO!","I'm the warden now!","AWOOOOOO!","Who took my left sock?!","I can see sounds!","Officer, are you real?","I'm naked and I'm FAST!","The pruno speaks to me!","BEEP BEEP, I'm a truck!","Count me! COUNT ME!","I live in the vents now.","My lawyer is a pigeon."],kh=["You lost, homie?","Wrong tier, jefe.","This is OUR dayroom.","\xD3rale, here comes the cop.","Don't look at me, CO.","We run this block.","Tell your sergeant we said what's up.","Big truck, small heart, homie.","Ey, nice boots... NOT.","Call your backup, we'll wait.","Jump him!","Get the CO!"],_d=["Hey CO... real quick... what does PREA stand for?","Wait wait wait. What's PREA mean though?","Is PREA like a Prius? For real, what is it?"],Md=["Prison Rape Elimination Act. There are 47 modules. Want the binder?","It's federal law, buddy. Here's the hotline. It's also on every wall.","P-R-E-A. Zero tolerance. Now get on the ground."],bd=["*confused silence*","...huh.","Forty-seven modules?!","Bro, that's a lot of paperwork.","I just wanted commissary."],Ed=["Your mama's commissary is overdrawn!","Nice tattoo. Did you do it with a staple?","You swing like your parole officer.","Your release date called. It laughed.","You got that face only a cellie could love.","Even your shank is disappointed in you."],wd=["SHIELD UP!","Behind me, family!","This shield cost more than my truck. No it didn't. Nothing does.","Hey, you wanna see how big my truck is? After the riot."],Sd=[{name:"The Charmer",suit:3107642,skin:15254176,hair:3810582,style:1,face:0,item:16053492,lines:["Officer, could you help me carry this box? My arm's in a cast.","I was my own lawyer, you know. Nailed it.","You seem trustworthy. That's my favorite thing about people.","Is that a lifted truck? I love a big vehicle."]},{name:"Pogo the Painter",suit:3107642,skin:15921906,hair:16726554,style:1,face:3,lines:["Commissary special: one clown painting, forty soups.","Smile, officer! Pogo's watching.","I paint what I see. I see YOU.","Want a portrait? It comes with a free balloon."]},{name:"Sam's Neighbor",suit:3107642,skin:14724229,hair:1709072,style:1,face:7,lines:["The dog says you're doing great, officer.","Harvey says hi. Harvey's the dog.","Don't look at me. Talk to the dog.","The dog wants a lawyer."]},{name:"The Night Prowler",suit:1780512,skin:13011550,hair:1118481,style:1,face:1,lines:["Turn. That light. OFF.","I hate fluorescents. I hate you more.","It's too bright in here, CO.","Hail the dark. Also, where's chow?"]},{name:"The Cipher",suit:3107642,skin:15845285,hair:7031338,style:2,face:4,lines:["I mailed the warden a puzzle. He hasn't solved it.","Check your kites, officer. Every 13th letter.","You'll never crack me. Nobody does.",'Crossword, officer? Seven letters: "overtime."']}],Yr={intro:"The Riverbank Ripper is OUT of his cell! All staff, watch the mist!",taunts:["Nobody checks the river, officer.","The mist is my friend.","Took them twenty years to catch me. You've got two minutes.","Gone fishing.","You can't cuff fog."],callouts:["Movement by the water!","He's behind you!","I lost him in the mist!","Cell 7! No, cell 9! I don't know!"],death:"Riverbank Ripper is DOWN. Somebody get the paperwork. All of it."},Td=["PREA!!!","PREA! PREA! PREA!","PREAAAAAAA!","PREA! He looked at me with his EYES!","PREA! That pepperball was flirting with me!","I'm calling the PREA hotline!","PREA! He breathed in my direction!","PREA! He sprayed me without a consent form!","Somebody get me a PREA form!","I know my PREA rights! I read the poster!","PREA! His baton winked at me!",'PREA! He said "good morning" aggressively!',"PREA! He stood within six feet of my feelings!","PREA! PREA! Get my lawyer!","PREA! He touched my commissary!","PREA! That taco smelled at me!","PREA! He made eye contact through his sunglasses!","This is a PREA violation and a Tuesday!"],Ad=["That's not what PREA means.","Hotline's on the wall. Next to the hole you punched.","Write it up, buddy.","Spell PREA. I'll wait.","Form's in the box. Box is on fire.","Noted. Filed. Shredded.","Bro, you yelled PREA at a vending machine yesterday.","Tell it to the Auditor."],Rd=["The Bar is loose. Somebody is naked again.","Bar units: one of them says he is the warden now. He is not the warden.","Heads up, the dings in the Bar are howling at the fluorescent lights again.","Bar units report an inmate wearing a mattress as armor. Respect, honestly.","Control to all staff: the Bar ding is painting the dayroom. With what? Do not ask.","Bar units: he says the TV told him to. The TV has been unplugged since 2009."],Cd=["Twelve years of push-ups with my ARMS, CO.","I got four-wheel drive, you got flat feet.","Move. I got the right of way.","I'm faster sitting down than you are standing up.","This chair got more miles than your truck.","Handicap parking? I park wherever I want."],Id=["BEEP BEEP, BITCH!","Speed bump!","Wide load coming through!","RAMMING SPEED!","Ankles, CO! I want ANKLES!"],Pd=["One leg, still whooping you.","Medical gave me these. Bad idea.","You know how long this crutch is? Long enough.","I hop faster than you run, CO."],Ld=["CATCH!","Medical can bill me!","Here, you need this more than me!","I got another one in my cell!"],Dd=["No I wasn't in his cell by myself.","I don't love offenders.","I am NOT an inmate lover.","I do not like anal.","ASK BINGHAM. I am innocent.","My mom got my ass beat for acting exactly like this."],Nd=["He's not my boyfriend. He's my pen pal. With benefits. No benefits. Forget I said benefits.","Boyfriend? Please. He's my emotional support offender.","I'm not his girlfriend, I'm one of his girlfriends. WAIT.","Why does he have my name tattooed on his neck? Ask HIM.","I don't take it in the butt. Exit only. That's facility policy AND my policy.","Nothing's going in the back door. The back door is LOCKED. Sally port rules.","Why would I keister a phone? I keep it in my bra like a professional.","I've only been in four cells today. That's below the unit average.","I'm not a slut, I'm a rehabilitation specialist.","I'm not easy, I'm accessible. ADA compliant.","Those are NOT my panties on his bunk. Those are evidence panties.","Twelve years in. Zero write-ups. Forty-one 'friends'.","This belly? Commissary. I've been eating a LOT of honey buns.","The baby's father is... the State. Technically.","It's not his. It's not HIS either. Stop lining them up, Sarge.","I'm due in March. Same as his parole hearing. Coincidence."],Ud=["I was providing COUNSELING. Very close counseling.","I'm not compromised, I'm emotionally available.","He's not my boyfriend, he's my CASELOAD.","I don't love offenders. I just love... helping them. Personally. After hours."],Od=["That's not his DNA, that's a treatment plan.","Ask Caughren. She'll tell you I'm innocent. ...Don't ask Caughren.","This belly is a stress belly. From all the paperwork. And the visits.","The baby's name? We were thinking 'Inmate.' It's gender neutral.","Rehabilitation starts at home. My home. On weekends.","I don't do it in the butt. I'm a licensed professional.","My office door was locked for CONFIDENTIALITY.","That was not a conjugal visit. It was a... wellness check.","I'm not his baby mama, I'm his case manager. Same thing in here."],kd="My mom got MY ass beat for this too. It runs in the family.",zd=["Caughren AND Bingham pregnant at the same time? That's a pod party.","Heard both babies already got a release date.","The baby shower's in the dayroom. BYO commissary.","Bro the kids gonna be born with an inmate number.","Bingham's baby already got a gang tattoo, I swear.","Who's the daddy? Whole B-pod raising their hand.","Ayy she been in MY cell too!","Line forms on the left, homie!"],zh=["Bro... not again.","Somebody check. I'm not checking.","Is it the pregnant one or the OTHER pregnant one?","Copy. Bringing a pregnancy test and a write-up.","Control, do we have a form for this? We need a form for this."],Fh=["BABY TELL 'EM ABOUT US!","THAT'S MY WIFE!","That's MY baby, CO!","Wifey, you said it was SPECIAL!","Girl you smell like commissary.","We're in LOVE, CO!"],sr="You wanna fuck on me?",Fd=["You wanna fuck on me? Then square up.","You built like a commissary receipt.","Your hands are slower than medical.","I've seen better fighting in the chow line.","You wanna fuck on me? Nah, you wanna fuck AROUND.","Who's next? Line up. I'll roast all of y'all.","Your mama called. She said keep me out of this.","Bro you swing like you got a write-up pending.","Sit down before I make you sit down. Twice.","Fourth taco of the shift, baby."],Bd=["Counselor Alaniz on the floor. Case CLOSED.","Y'all called a counselor? Bad idea.","Ricardo Alaniz in the building. Somebody about to get counseled.","Legend of the community, reporting for duty. Ask about me."],Hd=["Did you see that Combo Rombo?","Did you SEE that Combo Rombo?!","That's a COMBO, ROMBO!","I don't do treatment plans. I do treatment PAIN.","Your release date just got pushed back, homie.","I counsel with my hands.","Group therapy is in session. You're the group.","Y'all thought counselors just did paperwork?","Legend of the community. Ask about me.","I cleaned house AND did your annual review.","Combo Rombo, baby! Write THAT in your file!","That's a program violation. And a beatdown."],Gd=["House is clean. I got a caseload to get back to.","Alaniz out. Did y'all see that Combo Rombo though?","Session over. Y'all are rehabilitated."],Vd=["{name}? In MY building? Pack your desk.","{name}, I KNEW it. Badge. Keys. Now.","Nah. Not on my watch, {name}. Not in my house."];var at={list:[],proj:[]};h.AI=at;var Do={rat:{hp:55,speed:4.3,dmg:8,scale:[.9,1.1],suit:[16742938,16747050,15887122],score:10},gasser:{hp:45,speed:3.9,dmg:6,scale:[.85,1],suit:[15765562],item:16053492,ranged:!0,score:15},shank:{hp:50,speed:5.3,dmg:15,scale:[.9,1.05],suit:[13119514],item:12634320,lunge:!0,score:20},big:{hp:240,speed:3.1,dmg:22,scale:[1.35,1.5],suit:[16742938],knock:10,score:40},diva:{hp:75,speed:4.9,dmg:10,scale:[.95,1.05],suit:[16747114,16751226],item:16732088,hair:[16732088,16244810,10181887,16722474],diva:!0,score:25},ding:{hp:60,speed:6,dmg:9,scale:[.9,1.05],suit:[16742938],shirtless:!0,face:7,style:0,ding:!0,score:15},cholo:{hp:85,speed:4.7,dmg:13,scale:[1,1.15],suit:[15759914,15232800],style:3,hats:[1315868,2763306,15263976],face:3,item:12634320,score:25},prea:{hp:50,speed:3.6,dmg:6,scale:[.95,1],suit:[16747050],style:1,face:0,prea:!0,score:30},wheel:{hp:140,speed:6.4,dmg:16,scale:[1,1.1],suit:[16742938,15887122],wheel:!0,turn:1.8,knock:11,score:30},crutch:{hp:90,speed:3.8,dmg:14,scale:[.95,1.1],suit:[16747050,15765562],crutch:!0,reach:.9,knock:6,score:25},killer:{hp:9999,speed:0,dmg:0,scale:[1,1.05],suit:[3107642],score:0},ripper:{hp:3200,speed:5.4,dmg:20,scale:[1.3,1.3],suit:[3107642],knockMul:.08,score:1e3,boss:!0}};h.TYPES=Do;for(let i in Do){let e=Do[i];i!=="killer"&&(e.hp=Math.round(e.hp*(e.boss?1.2:1.6)))}h.MAX_SWINGERS=4;var Wd=[],Bh={x:0,z:0},No=0;at.reset=function(){at.list.length=0,at.proj.length=0,at.projIM.count=0};at.init=function(i){at.projIM=new cn(new Pe(1,1,1),new ze({roughness:.6}),200),at.projIM.frustumCulled=!1,at.projIM.count=0,at.projIM.castShadow=!0,at.projIM.setColorAt(0,new ye(1,1,1)),i.add(at.projIM)};at.spawn=function(i,e,t){let n=Do[i],s=n.scale[0]+Math.random()*(n.scale[1]-n.scale[0]),r={type:i,def:n,x:e+h.rand(-.4,.4),z:t+h.rand(-.4,.4),vx:0,vz:0,r:.38*s,scale:s,yaw:Math.random()*h.TAU,hp:n.hp*(h.S.hpMul||1),maxHp:n.hp*(h.S.hpMul||1),speed:n.speed*h.rand(.9,1.1),suit:h.pick(n.suit),skin:h.pick(h.SKIN),hair:n.hair?h.pick(n.hair):h.pick(h.HAIR),hairOn:n.diva||Math.random()<.55,itemCol:n.item||0,phase:Math.random()*6,move:0,swing:0,swingCD:h.rand(.3,1),flash:0,ocT:0,fall:0,dead:!1,deadT:0,thinkT:Math.random()*.3,seen:!1,throwT:h.rand(3,8),spitT:h.rand(2,6),lungeT:0,combo:0,hop:0,vy:0,spin:0,flail:0,windup:0,style:n.style??h.pick([0,0,1,1,1,2,3,3]),hat:h.pick(n.hats||[2039583,9051164,1850506,7171437,15263976]),face:n.face??h.randi(0,6),shirtless:!!n.shirtless,wide:n.wide||1};return n.diva&&(r.style=4),n.boss&&(r.boss=!0,r.noRender=!0),at.list.push(r),r};at.liveCount=()=>{let i=0;for(let e of at.list)!e.dead&&!e.caged&&i++;return i};var Vv=0;at.spawnCrew=function(i,e,t=4){let n=++Vv;for(let s=0;s<t;s++){let r=at.spawn("cholo",i+Math.cos(s*1.6)*1.3,e+Math.sin(s*1.6)*1.3);r.posted=!0,r.crew=n,r.yaw=Math.atan2(i-r.x,e-r.z)}};function Vh(i){for(let e of at.list)e.crew===i&&e.posted&&(e.posted=!1,e.flex=0)}at.wakeCrew=Vh;function Wv(i){let e=null,t=1e9;for(let n of h.targets){if(n.down)continue;let s=(n.x-i.x)**2+(n.z-i.z)**2;s<t&&(t=s,e=n)}return[e,Math.sqrt(t)]}function un(i,e,t="#ffb37a"){No<=0||h.FX.floaters.length>8||(No-=1,h.FX.float(i.x,2.3*i.scale,i.z,h.censor(h.pick(e)),t,14,1.8))}var Gh=0;function Lo(i,e){if(!(Gh>0||Math.random()>e||h.FX.floaters.length>10)&&(Gh=h.rand(.7,1.6),h.S.prea=(h.S.prea||0)+1,h.FX.float(i.x,2.6*i.scale,i.z,h.pick(Td),"#ffe24a",22,2.2),Math.random()<.3)){let t=h.officers.find(n=>!n.down&&(n.x-i.x)**2+(n.z-i.z)**2<200);t&&setTimeout(()=>h.FX.float(t.x,2.6,t.z,h.pick(Ad),"#9fd0ff",16,2),700)}}function Hh(i,e,t,n){let s=t-i.x,r=n-i.z,a=Math.hypot(s,r)||1,o=a/13;at.proj.push({kind:e,x:i.x,y:1.5*i.scale,z:i.z,vx:s/o,vz:r/o,vy:9*o*.5+.2,spin:0,dmg:e==="cup"?6:e==="tray"?9:5,life:3}),i.windup=1,Math.random()<.45&&un(i,yd[e])}at.update=function(i){let e=h.W,t=at.list;No=Math.min(2,No+i*.6),Gh-=i,h.grid.clear();for(let n of t)!n.dead&&!n.caged&&h.grid.insert(n);for(let n of h.targets)n.slots=0;for(let n=t.length-1;n>=0;n--){let s=t[n];if(s.flash=Math.max(0,s.flash-i),s.flashedT>0&&(s.flashedT-=i),!s.dead&&s.hop>0&&!s.def.crutch&&(s.vy-=20*i,s.hop=Math.max(0,s.hop+s.vy*i),s.hop===0&&(s.vy=0,h.FX.blood(s.x,.2,s.z,0,0,2),h.audio.play("thud",.6))),s.windup=Math.max(0,s.windup-i*3),s.vx||s.vz){s.x+=s.vx*i,s.z+=s.vz*i;let M=Math.exp(-i*7);s.vx*=M,s.vz*=M,Math.abs(s.vx)+Math.abs(s.vz)<.05&&(s.vx=s.vz=0),e.collide(s)}if(s.dead){s.fall=Math.min(1,s.fall+i*3.5),s.move=0,s.swing=0,(s.vy||s.hop>0)&&(s.hop+=s.vy*i,s.vy-=20*i,s.yaw+=s.spin*i,s.tumble=(s.tumble||0)+s.spin*.4*i,s.hop<=0&&(s.hop=0,s.vy=0,s.spin=0,s.tumble=0,h.FX.blood(s.x,.2,s.z,0,0,4),h.audio.play("thud",.5))),s.deadT+=i,s.deadT>9&&t.splice(n,1);continue}let[r,a]=Wv(s);if(s.caged){r&&(s.yaw+=h.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*3)),s.phase+=i,s.move=0,s.flex=Math.max(0,Math.sin(s.phase*.7))*.3;continue}if(s.boss){h.Boss&&h.Boss.think(s,i,r,a);continue}if(s.freezeT>0){s.freezeT-=i,s.move=h.lerp(s.move,0,i*8),s.flex=1;continue}if(s.posted){s.move=0,s.phase+=i*.5,s.flex=.5+Math.sin(s.phase*2)*.3,Math.random()<i*.06&&un(s,kh,"#ffd27a"),r&&a<9&&(Vh(s.crew),un(s,["Get the CO!","Jump him!","\xD3rale, let's go!"],"#ffd27a"));continue}if(s.flex=Math.max(0,(s.flex||0)-i*2),s.def.prea&&!s.asked&&r&&a<8){if(s.asking||(s.asking=!0,s.askT=0,h.FX.float(s.x,2.6,s.z,h.pick(_d),"#ffe27a",16,3.5)),s.askT+=i,s.move=h.lerp(s.move,0,i*8),r.yaw!==void 0&&(s.yaw+=h.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*6)),a<2.8&&(s.answerT=(s.answerT||0)+i),s.answerT>1){s.asked=!0,h.say(r.name||"OFFICER",h.pick(Md),4);for(let M of t)!M.dead&&!M.caged&&!M.boss&&(M.x-s.x)**2+(M.z-s.z)**2<140&&(M.freezeT=4,M.swing=0);h.FX.float(s.x,3,s.z,h.pick(bd),"#ffe27a",18,3),r.score=(r.score||0)+100}else s.askT>7&&(s.asked=!0);continue}if(s.ocT=Math.max(0,s.ocT-i),s.swingCD-=i,s.throwT-=i,s.spitT-=i,s.lungeT=Math.max(0,s.lungeT-i),!r){s.move=h.lerp(s.move,0,i*5);continue}s.thinkT-=i,s.thinkT<=0&&(s.thinkT=h.rand(.2,.35),s.seen=a<16&&e.los(s.x,s.z,r.x,r.z));let o=0,l=0,c=s.speed,u=r.x-s.x,f=r.z-s.z,d=1/(a||1);if(s.ocT>0)s.flail=1,o=Math.sin(s.phase*.7+n),l=Math.cos(s.phase*.5+n),c*=.35,Math.random()<i*.6&&un(s,["*cough cough*","MY EYES!","I can't see!","Water! WATER!"],"#ff9a6a");else{s.flail=Math.max(0,s.flail-i*2),s.seen||a<2.5?(o=u*d,l=f*d):e.flowDir(s.x,s.z,Bh)?(o=Bh.x,l=Bh.z):(o=u*d,l=f*d);let M=s.def;M.ranged&&s.seen?(a<6?(o=-o,l=-l):a<10&&(o*=.15,l*=.15),s.throwT<=0&&a<13&&(s.throwT=h.rand(1.8,2.8),Hh(s,"cup",r.x,r.z))):s.seen&&s.throwT<=0&&a>5&&a<12&&(s.throwT=h.rand(6,11),Hh(s,Math.random()<.5?"tray":"shoe",r.x,r.z)),M.lunge&&s.seen&&a>2&&a<4.5&&s.lungeT<=0&&s.swingCD<=0&&(s.lungeT=2.5,s.vx+=u*d*13,s.vz+=f*d*13,s.swingCD=0,Math.random()<.5&&un(s,["Shank time!","Poke poke, bitch!","Hold still, CO!"])),a<3.2&&s.spitT<=0&&Math.random()<.5&&(s.spitT=h.rand(5,9),h.FX.spit(s.x,1.5*s.scale,s.z,u*d,f*d),r.hurt(2,s.x,s.z,"spit"),un(s,["*hocks loogie*","PTOO!","Got you, CO!"],"#d9e4b5")),M.ding&&(s.dingT=(s.dingT||0)-i,s.dingT<=0&&(s.dingT=h.rand(1.5,4),s.dingDir=Math.random()<.45?Math.random()*h.TAU:null,Math.random()<.4&&un(s,Oh,"#c6ff7a")),s.dingDir!=null&&a>2.5&&(o=Math.sin(s.dingDir),l=Math.cos(s.dingDir),c*=1.3,s.flail=1)),M.crutch&&!s.noCrutch&&s.seen&&a>5&&a<11&&Math.random()<i*.4&&(s.noCrutch=!0,Hh(s,"shoe",r.x,r.z),un(s,Ld,"#ffb37a")),M.crutch&&(s.noCrutch?(c*=.75,s.hop=Math.abs(Math.sin(s.phase*.6))*.14):Math.random()<i*.04&&un(s,Pd,"#ffb37a")),M.wheel&&(s.ramT=(s.ramT||0)-i,a<s.r+r.r+.5&&s.ramT<=0&&s.move>.6?(s.ramT=2.2,r.hurt(M.dmg*(h.S.dmgMul||1),s.x,s.z,"ram",M.knock),s.vx-=u*d*7,s.vz-=f*d*7,h.audio.play("thud",.8),un(s,Id,"#ffd27a")):Math.random()<i*.04&&un(s,Cd,"#ffb37a")),Math.random()<i*.012&&Lo(s,1),Math.random()<i*.05&&un(s,M.diva?Uh:M.ding?Oh:s.type==="cholo"?kh:xd,M.diva?"#ff8fd0":M.ding?"#c6ff7a":"#ffb37a")}let p=s.r+r.r+(.6+(s.def.crutch&&!s.noCrutch?s.def.reach:0))*s.scale;if(a<p+1.6&&s.ocT<=0){if(r.slots<h.MAX_SWINGERS)r.slots++;else if(s.swing<=0){let M=n&1?1:-1,b=a<2.6?-.6:.3;o=-f*d*M+u*d*b,l=u*d*M+f*d*b,c*=.55,s.swingCD=Math.max(s.swingCD,.3)}}if(s.swing>0){let M=s.swing;s.swing+=i*(s.def.diva?4.2:2.9),M<.5&&s.swing>=.5&&a<p+.4&&s.ocT<=0&&(r.hurt(s.def.dmg*(h.S.dmgMul||1),s.x,s.z,s.type,s.def.knock||3),s.def.diva&&Math.random()<.4&&un(s,Uh,"#ff8fd0")),s.swing>=1&&(s.swing=0,s.def.diva&&s.combo<1?(s.combo++,s.swing=.01):(s.combo=0,s.swingCD=h.rand(.7,1.1))),c*=.4}else a<p&&s.swingCD<=0&&s.ocT<=0&&!s.def.wheel&&(s.swing=.01);a<p*.85&&(o*=.1,l*=.1),h.grid.query(s.x,s.z,1.2,Wd);let y=0,x=0;for(let M of Wd){if(M===s)continue;let b=s.x-M.x,L=s.z-M.z,T=b*b+L*L,C=s.r+M.r;if(T<C*C&&T>1e-5){let A=Math.sqrt(T),E=(C-A)/A;y+=b*E,x+=L*E}}let g=Math.min(1,i*(s.def.turn||6));s.hx=h.lerp(s.hx??o,o,g),s.hz=h.lerp(s.hz??l,l,g),s.x+=s.hx*c*i+y*.5,s.z+=s.hz*c*i+x*.5,e.collide(s);let m=Math.min(1,Math.hypot(s.hx,s.hz));s.move=h.lerp(s.move,m,i*8),s.phase+=i*10*s.move*(c/4.3);let v=s.ocT>0||s.def.wheel?Math.atan2(s.hx,s.hz):Math.atan2(u,f);s.yaw+=h.angDiff(s.yaw,v)*Math.min(1,i*10)}Jv(i)};var Xd=new Be,Xv=new qt,qv=new Yt,Yv=new P,$v=new P,Zv=new ye,Kv={cup:[.16,.22,.16,15921906],tray:[.5,.05,.36,10134443],shoe:[.14,.12,.3,1776411]};function Jv(i){let e=at.proj,t=0;for(let n=e.length-1;n>=0;n--){let s=e[n];s.vy-=18*i*.5,s.x+=s.vx*i,s.y+=s.vy*i,s.z+=s.vz*i,s.spin+=i*12,s.life-=i;let r=!1;for(let o of h.targets)if(!o.down&&(o.x-s.x)**2+(o.z-s.z)**2<.6&&s.y<2){o.hurt(s.dmg,s.x-s.vx,s.z-s.vz,s.kind,2),s.kind==="cup"?(h.FX.splash(o.x,o.z,7035434,18),h.FX.float(o.x,2.4,o.z,"GASSED!","#c9b45a",18,1.4),o.slowT=2):h.FX.sparks(s.x,s.y,s.z,6,16777215),h.audio.play(s.kind==="cup"?"splat":"thud",.7),r=!0;break}if(!r&&(s.y<=.05||s.life<=0||h.W.blocked(s.x,s.z))&&(s.kind==="cup"&&h.FX.splash(s.x,s.z,7035434,10),r=!0),r){e.splice(n,1);continue}let a=Kv[s.kind];Xd.compose(Yv.set(s.x,s.y,s.z),Xv.setFromEuler(qv.set(s.spin,s.spin*.6,0)),$v.set(a[0],a[1],a[2])),at.projIM.setMatrixAt(t,Xd),at.projIM.setColorAt(t,Zv.setHex(a[3])),t++}at.projIM.count=t,at.projIM.instanceMatrix.needsUpdate=!0,at.projIM.instanceColor&&(at.projIM.instanceColor.needsUpdate=!0)}at.damage=function(i,e,t,n,s=4,r="hit",a=null){if(i.dead)return!1;i.hp-=e,i.flash=.25;let o=i.x-t,l=i.z-n,c=Math.hypot(o,l)||1,u=s/Math.sqrt(i.scale)*(i.def.knockMul??1);if(i.posted&&Vh(i.crew),i.freezeT>0&&(i.freezeT=0),i.boss&&h.Boss&&h.Boss.onHit(i,e),i.vx+=o/c*u,i.vz+=l/c*u,r!=="oc"&&h.FX.blood(i.x,1.2*i.scale,i.z,o/c,l/c,i.hp<=0?16:5),i.hp<=0){i.dead=!0,i.swing=0,i.vx*=1.8,i.vz*=1.8,s>=8&&!i.boss&&(i.vy=h.rand(3.5,6.5)/Math.sqrt(i.scale),i.spin=h.rand(-9,9)),i.boss?h.Boss&&h.Boss.onDeath(i):h.Loot&&h.Loot.maybeDrop(i.x,i.z,i.type==="big"||i.type==="cholo"?.03:.012),i.yaw=Math.atan2(-o,-l),Math.random()<.3&&h.FX.teeth(i.x,1.5,i.z),Math.random()<.5?Lo(i,.6):Math.random()<.35&&un(i,Nh,"#ffd0a0"),h.S.kills++,h.onKill&&h.onKill(),a&&(a.kills++,a.score+=i.def.score,a.ot!==void 0&&!(a.otT>0)&&(a.ot=Math.min(100,a.ot+3.5))),h.dropLoot&&h.dropLoot(i.x,i.z),i.bf&&(a&&(a.score+=250),h.FX.float(i.x,3,i.z,"LOVE IS DEAD +250","#ff5ab0",24,2));let f=0;for(let d of at.list)d.dead&&f++;if(f>80){let d=at.list.findIndex(p=>p.dead);d>=0&&at.list.splice(d,1)}return!0}return r==="oc"?Lo(i,.02):Math.random()<.12&&Lo(i,.6),r!=="oc"&&Math.random()<.08&&un(i,i.def.diva?["Not the FACE!","You chipped my nail!","Rude!"]:Nh,"#ffd0a0"),!1};var Zr=new P;function zn(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Zr.copy(e),Zr[n]=0,Zr.normalize();let c=.5*a/(a+o),u=1-Zr.angleTo(i)/l;return Math.sign(Zr[t])===1?u*c:o/(a+o)+c+c*(1-u)}var vn=class extends Pe{constructor(e=1,t=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let o=new P,l=new P,c=new P(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,p=u.length/6,y=new P,x=.5/s;for(let g=0,m=0;g<u.length;g+=3,m+=2)switch(o.fromArray(u,g),l.copy(o),l.x-=Math.sign(l.x)*x,l.y-=Math.sign(l.y)*x,l.z-=Math.sign(l.z)*x,l.normalize(),u[g+0]=c.x*Math.sign(o.x)+l.x*r,u[g+1]=c.y*Math.sign(o.y)+l.y*r,u[g+2]=c.z*Math.sign(o.z)+l.z*r,f[g+0]=l.x,f[g+1]=l.y,f[g+2]=l.z,Math.floor(g/p)){case 0:y.set(1,0,0),d[m+0]=zn(y,l,"z","y",r,n),d[m+1]=1-zn(y,l,"y","z",r,t);break;case 1:y.set(-1,0,0),d[m+0]=1-zn(y,l,"z","y",r,n),d[m+1]=1-zn(y,l,"y","z",r,t);break;case 2:y.set(0,1,0),d[m+0]=1-zn(y,l,"x","z",r,e),d[m+1]=zn(y,l,"z","x",r,n);break;case 3:y.set(0,-1,0),d[m+0]=1-zn(y,l,"x","z",r,e),d[m+1]=1-zn(y,l,"z","x",r,n);break;case 4:y.set(0,0,1),d[m+0]=1-zn(y,l,"x","y",r,e),d[m+1]=1-zn(y,l,"y","x",r,t);break;case 5:y.set(0,0,-1),d[m+0]=zn(y,l,"x","y",r,e),d[m+1]=1-zn(y,l,"y","x",r,t);break}}};var qd=[15845285,14724229,13011550,11037509,9065782,7028519,5188892],Yd=[1709072,2825492,4861984,1118481,7031338,9079434];h.SKIN=qd;h.HAIR=Yd;function Xh(i,e){let t=i.attributes.position,n=t.count,s=new Float32Array(n*3);i.computeBoundingBox();let{min:r,max:a}=i.boundingBox;for(let o=0;o<n;o++){let l=(t.getY(o)-r.y)/(a.y-r.y||1),[c,u,f]=e(l,t.getX(o),t.getZ(o));s[o*3]=c,s[o*3+1]=u,s[o*3+2]=f}return i.setAttribute("color",new Ot(s,3)),i}var Kr=i=>Sh(Vr(i.map(e=>e.index?e.toNonIndexed():e))),Jr=(i,e=1)=>Xh(i,()=>[e,e,e]),fs=(i,e=.82)=>Xh(i,t=>{let n=e+t*(1-e);return[n,n,n]}),Wh=(i,e,t=10)=>new Rn(i,e-i*2,t>8?4:2,t).translate(0,-e/2,0),jv=(i,e,t)=>{let n=i.attributes.uv;for(let s=0;s<n.count;s++)n.setXY(s,e,t);return i},$d=[4033535,16731469,4054148,16763197];h.PCOLORS=$d;function Oo(i={}){let e=i.gender==="female",t=i.gender==="they",n=i.rank==="sgt",s=i.uniform??2376318,r=1518162,a=i.skin??h.pick(qd),o=i.hair??h.pick(Yd),l=(O,W=.7,F=0)=>new ze({color:O,roughness:W,metalness:F}),c={uni:l(s,.75),dark:l(r),skin:l(a,.55),hair:l(o,.7),black:l(1118481,.35,.2),gold:new ze({color:16765773,emissive:5913600,roughness:.25,metalness:1}),steel:l(13225684,.25,1),vest:l(1777449,.8),red:l(13116444,.4),boots:l(1118481,.35,.2),pants:l(s,.75),print:new ze({map:ad(i.back||"CORRECTIONS"),roughness:.8})};for(let O of["uni","dark","skin","hair","vest","pants","boots"])qh(c[O]);let u=(O,W,F=0,J=0,X=0)=>{let ie=new pe(O,W);return ie.position.set(F,J,X),ie.castShadow=!0,ie.receiveShadow=!0,ie},f=e?.9:t?.95:1,d=new ut,p=new ut;d.add(p),p.add(u(new vn(.52*f,.64,.3,2,.08),c.uni,0,1.08,0)),p.add(u(new vn(.57*f,.46,.35,2,.06),c.vest,0,1.12,0));let y=u(new Dt(.5*f,.13),c.print,0,1.2,-.178);y.rotation.y=Math.PI,p.add(y),p.add(u(new vn(.52*(e?1.04:1),.11,.33,2,.03),c.black,0,.8,0)),p.add(u(new Pe(.09,.07,.02),c.gold,0,.8,.17)),p.add(u(new rt(.045,.045,.012,6),c.gold,-.14*f,1.27,.18).rotateX(Math.PI/2)),p.add(u(new Pe(.08,.15,.07),c.black,.27,.8,.05)),p.add(u(new Pe(.06,.08,.04),c.black,.16*f,1.34,.17)),p.add(u(new rt(.04,.04,.17,10),c.red,-.27,.8,.05)),p.add(u(new xn(.05,.012,6,12),c.steel,.2,.72,.12)),i.belly&&(p.add(u(new At(.24,22,16).scale(1,.95,1.15),c.uni,0,.96,.15)),p.add(u(new At(.02,8,6),c.uni,0,.97,.43))),i.lanyard&&(p.add(u(new xn(.15,.008,4,20,Math.PI).rotateZ(Math.PI),c.red,0,1.4,.18)),p.add(u(new Pe(.08,.11,.01),c.steel,0,1.2,i.belly?.36:.19))),p.add(u(new rt(.075,.08,.12,10),c.skin,0,1.43,0));let x=new ut;x.position.set(0,1.58,0),p.add(x),x.add(u(new At(.165,20,16),c.skin)),x.add(u(new vn(.24,.055,.04,1,.015),c.black,0,.02,.15)),e?(x.add(u(new At(.175,16,10,0,Math.PI*2,0,Math.PI/1.9),c.hair,0,.02,-.01)),x.add(u(new At(.085,12,8),c.hair,0,.04,-.19)),x.add(u(new Rn(.045,.2,4,8),c.hair,0,-.14,-.2))):(t&&(x.add(u(new At(.178,16,10,0,Math.PI*2,0,Math.PI/1.65),c.hair,0,0,-.01)),[-.15,.15].forEach(O=>x.add(u(new Rn(.04,.12,3,8),c.hair,O,-.08,-.02)))),x.add(u(new rt(.175,.18,.1,18),c.dark,0,.12,0)),x.add(u(new vn(.26,.03,.17,1,.012),c.dark,0,.08,.16)));let g=(O,W,F,J)=>{let X=new ut;return X.add(u(new rt(O,W,F,14,1).translate(0,-F/2,0),J)),X.add(u(new At(O,14,10),J)),X.add(u(new At(W,12,8),J,0,-F,0)),X},m=O=>{let W=new ut;W.position.set(O*.33*f,1.33,0),W.add(u(new At(.105*f+.01,16,12).scale(1,.85,1),c.uni,0,.01,0));let F=g(.088,.074,.29,c.uni);W.add(F);let J=new ut;J.position.y=-.29,F.add(J);let X=g(.068,.054,.26,c.skin);J.add(X);let ie=new ut;return ie.position.y=-.27,X.add(ie),ie.add(u(new vn(.09,.12,.06,2,.025),c.skin,0,-.05,.005)),ie.add(u(new Rn(.022,.05,2,6),c.skin,O*-.045,-.03,.03).rotateZ(O*.6)),p.add(W),{shoulder:W,elbow:J,hand:ie,upper:F}},v=m(-1),M=m(1),b=v.shoulder,L=M.shoulder;n&&[v.upper,M.upper].forEach(O=>[0,1,2].forEach(W=>{let F=u(new Pe(.19,.02,.19),c.gold,0,-.08-W*.04,0);F.rotation.z=.25,O.add(F)}));let T=u(new rt(.028,.034,.64,10),c.black,0,-.07,.25);T.rotation.x=Math.PI/2,M.hand.add(T);let C=new ut;C.visible=!1,C.rotation.x=Math.PI/2,C.position.set(0,-.06,.02),M.hand.add(C),C.add(u(new vn(.07,.11,.42,1,.02),c.black,0,-.05,.16)),C.add(u(new rt(.018,.018,.3,8).rotateX(Math.PI/2),c.steel,0,-.03,.5)),C.add(u(new vn(.05,.14,.05,1,.015),c.black,0,-.14,.1));let A=O=>{let W=new ut;W.position.set(O*.13,.8,0);let F=g(.105,.088,.4,c.pants);W.add(F);let J=new ut;J.position.y=-.4,F.add(J);let X=g(.085,.072,.31,c.pants);return J.add(X),X.add(u(new vn(.19,.13,.31,2,.045),c.boots,0,-.35,.05)),p.add(W),{hip:W,knee:J}},E=A(-1),_=A(1),I=E.hip,z=_.hip,k=new pe(new Qn(.5,.62,32),new yt({color:i.ringColor??$d[i.slot||0],transparent:!0,opacity:.85,toneMapped:!1}));return k.rotation.x=-Math.PI/2,k.position.y=.03,d.add(k),i.scale&&d.scale.setScalar(i.scale),{root:d,body:p,head:x,armL:b,armR:L,legL:I,legR:z,elbowL:v.elbow,elbowR:M.elbow,kneeL:E.knee,kneeR:_.knee,baton:T,gun:C,ring:k,M:c,phase:0,j:{}}}function si(i,e,t,n,s,r){i.phase+=e*10*Math.max(t,1e-4),i.t=(i.t||0)+e;let a=i.j||(i.j={}),o=(d,p,y,x,g=14)=>{let m=a[d]??x,v=m+(x-m)*Math.min(1,e*g);a[d]=v,p.rotation[y]=v},l=i.phase,c=Math.sin(l)*t,u=Math.cos(l);o("hL",i.legL,"x",c*.65),o("hR",i.legR,"x",-c*.65),i.kneeL&&(o("kL",i.kneeL,"x",(.15+Math.max(0,-Math.sin(l-.6))*1)*t,18),o("kR",i.kneeR,"x",(.15+Math.max(0,Math.sin(l-.6))*1)*t,18));let f=Math.sin(i.t*2.2)*.03;if(n>0){let d=Math.sin(n*Math.PI);o("aR",i.armR,"x",-2.5+n*3.1,30),o("aRz",i.armR,"z",-.35,30),i.elbowR&&o("eR",i.elbowR,"x",-.9*(1-n)-.1*d,30)}else s?(o("aR",i.armR,"x",-1.45,18),o("aRz",i.armR,"z",-.12,18),i.elbowR&&o("eR",i.elbowR,"x",-.15,18)):(o("aR",i.armR,"x",-c*.55+.05+f,10),o("aRz",i.armR,"z",.1,10),i.elbowR&&o("eR",i.elbowR,"x",-.25-Math.max(0,-c)*.6-t*.15,10));i.holdL?(o("aL",i.armL,"x",-1.1,12),o("aLz",i.armL,"z",.25,12),i.elbowL&&o("eL",i.elbowL,"x",-1.2,12)):s&&n<=0?(o("aL",i.armL,"x",-1.3,18),o("aLz",i.armL,"z",.45,18),i.elbowL&&o("eL",i.elbowL,"x",-.55,18)):(o("aL",i.armL,"x",c*.55+.05+f,10),o("aLz",i.armL,"z",-.1,10),i.elbowL&&o("eL",i.elbowL,"x",-.25-Math.max(0,c)*.6-t*.15,10)),i.gun&&(i.gun.visible=!!s&&n<=0,i.baton.visible=!i.gun.visible),i.body.position.y=Math.abs(Math.sin(l))*.045*t+(r?.2*r:0),o("bx",i.body,"x",r?-Math.PI/2*r:t*.1+(s?.04:0),10),o("by",i.body,"y",u*.07*t,10),i.head&&o("hy",i.head,"y",-u*.05*t,10)}function Qv(i){let e=i.attributes.uv,t=i.attributes.normal;for(let n=0;n<e.count;n++){let s=t.getZ(n),r=e.getX(n),a=e.getY(n);s<-.6?e.setXY(n,.27+r*.46,.1+a*.8):s>.6?e.setXY(n,.79+r*.18,.12+a*.8):e.setXY(n,.05,.5)}return i}function e_(){let i=Xh(Wh(.1,.8,7),x=>x<.14?[.12,.12,.12]:[.95,.95,.95]),e=fs(Kr([Wh(.068,.54,6),new At(.072,6,4).translate(0,-.56,0)])),t=fs(Wh(.082,.24,6)),n=fs(Qv(Sh(new vn(.5,.64,.3,1,.08))),.85),s=jv(new rt(.075,.08,.14,6,1,!0).translate(0,-.17,0),.75/ir,.3),r=fs(Kr([new At(.165,12,9),s]),.9),a=Jr(new At(.175,10,5,0,Math.PI*2,0,Math.PI/2.2)),o=fs(new At(.18,10,5,0,Math.PI*2,0,Math.PI/2).scale(1,1.25,1),.7),l=Jr(Kr([new At(.178,10,5,0,Math.PI*2,0,Math.PI/2.1),new vn(.08,.06,.12,1,.02).translate(0,.02,-.19)])),c=Jr(new Rn(.05,.28,2,6).translate(0,-.18,-.17)),u=Jr(new Pe(.045,.34,.06).translate(0,-.12,0)),f=x=>new xn(.3,.035,6,18).rotateY(Math.PI/2).translate(x,.3,-.05),d=fs(Kr([new Pe(.48,.06,.46).translate(0,.46,0),new Pe(.48,.46,.05).translate(0,.72,-.24),f(-.3),f(.3),new xn(.25,.015,4,14).rotateY(Math.PI/2).translate(-.34,.3,-.05),new xn(.25,.015,4,14).rotateY(Math.PI/2).translate(.34,.3,-.05),new rt(.07,.07,.04,8).rotateZ(Math.PI/2).translate(-.2,.07,.3),new rt(.07,.07,.04,8).rotateZ(Math.PI/2).translate(.2,.07,.3),new Pe(.03,.42,.03).translate(-.2,.26,.26),new Pe(.03,.42,.03).translate(.2,.26,.26),new Pe(.4,.03,.12).translate(0,.1,.42)]),.6),p=fs(Kr([new Pe(.04,1.15,.04).translate(0,-.2,0),new Pe(.06,.05,.2).translate(0,.38,0),new Pe(.05,.04,.12).translate(0,0,.04)]),.7),y=Jr(new rt(.125,.135,.42,8).translate(0,-.55,0),1);return[{key:"torso",geo:n,piv:[0,1.08,0],col:"suit",map:"suit"},{key:"head",geo:r,piv:[0,1.57,0],col:"skin",map:"face"},{key:"hair",geo:a,piv:[0,1.59,0],col:"hair",show:x=>x.style===1||x.style===4},{key:"beanie",geo:o,piv:[0,1.6,0],col:"hat",show:x=>x.style===2},{key:"bandana",geo:l,piv:[0,1.59,0],col:"hat",show:x=>x.style===3},{key:"tail",geo:c,piv:[0,1.6,0],col:"hair",show:x=>x.style===4},{key:"armL",geo:e,piv:[-.33,1.34,0],col:"skin",joint:"armL"},{key:"armR",geo:e,piv:[.33,1.34,0],col:"skin",joint:"armR"},{key:"sleeveL",geo:t,piv:[-.33,1.36,0],col:"suit",joint:"armL",show:x=>!x.shirtless},{key:"sleeveR",geo:t,piv:[.33,1.36,0],col:"suit",joint:"armR",show:x=>!x.shirtless},{key:"legL",geo:i,piv:[-.12,.8,0],col:"suit",joint:"legL"},{key:"legR",geo:i,piv:[.12,.8,0],col:"suit",joint:"legR"},{key:"chair",geo:d,piv:[0,.32,0],fixed:4212302,show:x=>!!x.def.wheel,sit:!0},{key:"crutch",geo:p,piv:[.33,1.34,0],fixed:12041927,joint:"armR",hand:[0,-.58,.06],show:x=>!!x.def.crutch&&!x.noCrutch},{key:"cast",geo:y,piv:[-.12,.8,0],fixed:15987178,joint:"legL",show:x=>!!x.def.crutch},{key:"item",geo:u,piv:[.33,1.34,0],col:"item",joint:"armR",hand:[0,-.58,.06],show:x=>!!x.itemCol}]}var t_=`#include <emissivemap_fragment>
  { float fr = 1.0 - saturate(dot(normal, normalize(vViewPosition)));
    totalEmissiveRadiance += vec3(0.62, 0.72, 0.9) * pow(fr, 3.0) * 0.42; }`;function qh(i){let e=i.onBeforeCompile;i.onBeforeCompile=(n,s)=>{e&&e.call(i,n,s),n.fragmentShader=n.fragmentShader.replace("#include <emissivemap_fragment>",t_)};let t=e?"rim+"+e.toString():"rim";return i.customProgramCacheKey=()=>t,i}h.rim=qh;function n_(i){let e=new ze({vertexColors:!0,roughness:.6,map:i});return e.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute float aFace;`).replace("#include <uv_vertex>",`#include <uv_vertex>
 vMapUv.x = (vMapUv.x + aFace) / ${ir}.0;`)},e}var Uo=class{constructor(e,t){this.max=t;let n=sd(),s=rd();this.parts=e_().map(a=>{let o;a.map==="face"?(a.geo.setAttribute("aFace",new as(new Float32Array(t),1)),o=n_(n)):o=new ze({vertexColors:!0,roughness:a.col==="skin"?.55:.78,map:a.map==="suit"?s:null}),qh(o);let l=new cn(a.geo,o,t);return l.instanceMatrix.setUsage(js),l.setColorAt(0,new ye(1,1,1)),l.instanceColor.setUsage(js),l.castShadow=["torso","head","legL","legR"].includes(a.key),l.receiveShadow=!0,l.frustumCulled=!1,l.count=0,e.add(l),{...a,im:l,face:a.map==="face"?a.geo.attributes.aFace:null}}),this.base=new Be,this.joint=new Be,this.out=new Be,this.q=new qt,this.e=new Yt(0,0,0,"YXZ"),this.v=new P,this.s=new P,this.c=new ye,this.white=new ye(1,1,1),this.red=new ye(16726826),this.zero=new Be().makeScale(0,0,0);let r=(a,o)=>new yt({color:a,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1});this.barBg=new cn(new Dt(1,.11),r(0,.6),t),this.barFill=new cn(new Dt(1,.08).translate(.5,0,0),r(16777215,.95),t);for(let a of[this.barBg,this.barFill])a.frustumCulled=!1,a.count=0,a.renderOrder=5,a.instanceMatrix.setUsage(js),e.add(a);this.barFill.setColorAt(0,this.c),this.tmp=new Be,this.tmp2=new Be,this.one=new P(1,1,1),this.barPos=new P,this.hpHi=new ye(5431386),this.hpLo=new ye(16724e3)}syncBars(e){let t=h.R&&h.R.camera;if(!t)return;let n=0;for(let s=0;s<e.length&&n<this.max;s++){let r=e[s];if(r.dead||r.caged||r.noRender||r.hp>=r.maxHp)continue;let a=Math.max(0,r.hp/r.maxHp);this.barPos.set(r.x,2.05*r.scale+(r.hop||0)-(r.def.wheel?.32:0),r.z),this.out.compose(this.barPos,t.quaternion,this.one),this.tmp.makeScale(.9*r.scale,1,1),this.barBg.setMatrixAt(n,this.tmp.premultiply(this.out)),this.tmp.makeTranslation(-.45*r.scale,0,.01),this.tmp.multiply(this.tmp2.makeScale(Math.max(.001,.9*r.scale*a),1,1)),this.barFill.setMatrixAt(n,this.tmp.premultiply(this.out)),this.c.copy(this.hpLo).lerp(this.hpHi,a),this.barFill.setColorAt(n,this.c),n++}this.barBg.count=this.barFill.count=n,this.barBg.instanceMatrix.needsUpdate=this.barFill.instanceMatrix.needsUpdate=!0,this.barFill.instanceColor&&(this.barFill.instanceColor.needsUpdate=!0)}sync(e){let t=Math.min(e.length,this.max),{base:n,joint:s,out:r,q:a,e:o,v:l,s:c,c:u}=this;for(let f=0;f<t;f++){let d=e[f];if(d.noRender){for(let g of this.parts)g.im.setMatrixAt(f,this.zero);continue}o.set(-(d.fall||0)*Math.PI/2+(d.tumble||0),d.yaw,0,"YXZ"),a.setFromEuler(o);let p=d.def.wheel&&!d.dead?.32:0;l.set(d.x,(d.fall||0)*.17*d.scale+(d.hop||0)-p*d.scale,d.z),c.set(d.scale*(d.wide||1),d.scale,d.scale*(d.wide||1)),n.compose(l,a,c);let y=Math.sin(d.phase)*.8*d.move,x=d.swing>0?Math.sin(d.swing*Math.PI):0;for(let g of this.parts){if(g.show&&!g.show(d)){g.im.setMatrixAt(f,this.zero);continue}let m=0,v=0;if(p&&(g.joint==="legL"||g.joint==="legR")?m=-1.35:g.joint==="legL"?m=d.def.crutch?-.5:y:g.joint==="legR"?m=-y:g.joint==="armL"?(m=-y*.9-(d.flail||0)*2.5,v=-(d.flex||0)*1.2):g.joint==="armR"&&(m=y*.9-x*2.6-(d.windup||0)*2.8,v=x*.5+(d.flex||0)*1.2),o.set(m,0,v,"XYZ"),a.setFromEuler(o),g.sit&&!p){g.im.setMatrixAt(f,this.zero);continue}s.compose(l.set(g.piv[0],g.piv[1],g.piv[2]),a,c.setScalar(1)),g.hand&&(r.makeTranslation(g.hand[0],g.hand[1],g.hand[2]),s.multiply(r)),r.multiplyMatrices(n,s),g.im.setMatrixAt(f,r);let M=g.fixed?g.fixed:g.col==="suit"?d.suit:g.col==="skin"?d.skin:g.col==="hair"?d.hair:g.col==="hat"?d.hat:d.itemCol;u.setHex(M),d.flash>0&&u.lerp(this.white,Math.min(1,d.flash*3)),d.ocT>0&&g.col==="skin"&&u.lerp(this.red,.45),g.im.setColorAt(f,u),g.face&&(g.face.array[f]=d.face)}}this.syncBars(e);for(let f of this.parts)f.im.count=t,f.im.instanceMatrix.needsUpdate=!0,f.im.instanceColor.needsUpdate=!0,f.face&&(f.face.needsUpdate=!0)}};var fn=[{key:"green",label:"Uncommon",color:4054106,css:"#3ddc5a",weight:55,mult:1},{key:"blue",label:"Rare",color:4033535,css:"#5aa0ff",weight:28,mult:1.6},{key:"purple",label:"Epic",color:10898943,css:"#b973ff",weight:13,mult:2.3},{key:"orange",label:"Legendary",color:16747034,css:"#ff9a3a",weight:4,mult:3.2}],ri={boots:{label:"Boots",stat:i=>({speed:.04*i}),text:i=>`+${Math.round(i.speed*100)}% speed`,names:[["Payless Patrol Shoes","Velcro Night-Shift Sneakers"],["Steel-Toe Snitch Kickers","Orthopedic Overtime Boots"],["Crocs (Sport Mode)","Tactical Jordans"],["Air Max Overtime","Six-Inch-Lift Boots"]],perk:{text:"Dashing is free",id:"freeDash"}},pants:{label:"Pants",stat:i=>({hp:Math.round(12*i)}),text:i=>`+${i.hp} max health`,names:[["Cargo Pants (17 Pockets)","Hand-Me-Down Slacks"],["Stretchy Taco Pants","Kevlar Khakis"],["Sweatpants of Command","Riot Joggers"],["The Pants of Seniority","Sergeant's Wedding Slacks"]],perk:{text:"Slowly heal over time",id:"regen"}},vest:{label:"Tactical Vest",stat:i=>({armor:.05*i}),text:i=>`-${Math.round(i.armor*100)}% damage taken`,names:[["Expired Stab Vest","Duct-Tape Armor"],["Gas-Proof Poncho","Hi-Vis Mesh of Authority"],["Tactical Fanny Pack Rig","PREA-Compliant Plate Carrier"],["DOC Family Heirloom Vest","Triple-Time Plate Carrier"]],perk:{text:"Anyone who hits you gets pepper-sprayed",id:"spiky"}}};function zo(i=0){let e=0;for(let a=i;a<fn.length;a++)e+=fn[a].weight;let t=Math.random()*e,n=i;for(let a=i;a<fn.length;a++)if(t-=fn[a].weight,t<=0){n=a;break}let s=h.pick(Object.keys(ri)),r=ri[s];return{slot:s,rarity:n,name:h.pick(r.names[n]),stat:r.stat(fn[n].mult),perk:n===3?r.perk.id:null}}h.rollItem=zo;var Yh=i=>ri[i.slot].text(i.stat)+(i.perk?` \xB7 ${ri[i.slot].perk.text}`:"");function Zd(i){let e=i.gear;i.speedMul=1+(e.boots?e.boots.stat.speed:0),i.armor=e.vest?e.vest.stat.armor:0;let t=e.pants?e.pants.stat.hp:0,n=i.maxHp;i.maxHp=100+t,i.hp=Math.min(i.maxHp,i.hp+Math.max(0,i.maxHp-n)),i.perks=new Set(Object.values(e).filter(a=>a&&a.perk).map(a=>a.perk));let s=i.model.M,r=(a,o,l)=>{a.color.setHex(o?h.lerpHex(l,fn[o.rarity].color,.25):l),a.emissive.setHex(o?fn[o.rarity].color:0),a.emissiveIntensity=o?.25+o.rarity*.15:0};r(s.boots,e.boots,1118481),r(s.pants,e.pants,2376318),r(s.vest,e.vest,1777449)}h.lerpHex=(i,e,t)=>new ye(i).lerp(new ye(e),t).getHex();function Kd(i){let e=h.store.get("mo_gear_"+i.name.toLowerCase(),{});i.gear={boots:e.boots||null,pants:e.pants||null,vest:e.vest||null},Zd(i)}var i_=i=>h.store.set("mo_gear_"+i.name.toLowerCase(),i.gear),Ei=[],ko={};function s_(i){let e=fn[i.rarity];ko[e.key]||(ko[e.key]=new yt({color:e.color,transparent:!0,opacity:.32,blending:Tn,depthWrite:!1,toneMapped:!1,side:Xt}));let t=new ut,n=new pe(new rt(.22,.45,7,14,1,!0),ko[e.key]);n.position.y=3.5,t.add(n);let s=new pe(new Qn(.5,.75,28),ko[e.key]);s.rotation.x=-Math.PI/2,s.position.y=.04,t.add(s);let r=new ze({color:e.color,emissive:e.color,emissiveIntensity:.9,roughness:.3,metalness:.4}),a=new ut;if(i.slot==="boots")[-.12,.12].forEach(o=>{let l=new pe(new Pe(.18,.22,.36),r);l.position.set(o,0,.05),a.add(l)});else if(i.slot==="pants"){[-.1,.1].forEach(l=>{let c=new pe(new Rn(.08,.45,2,8),r);c.position.set(l,-.1,0),a.add(c)});let o=new pe(new Pe(.38,.12,.18),r);o.position.y=.22,a.add(o)}else{let o=new pe(new Pe(.44,.5,.2),r);a.add(o)}return a.position.y=.9,t.add(a),t.userData.item=a,t}var Yn={drops:Ei,reset(){for(let i of Ei)h.R.scene.remove(i.mesh);Ei.length=0},spawn(i,e,t){if(Ei.length>=5)return;let n=s_(i);n.position.set(e,0,t),h.R.scene.add(n),Ei.push({it:i,x:e,z:t,mesh:n,t:0});let s=fn[i.rarity];h.FX.float(e,2.6,t,`${s.label.toUpperCase()}: ${i.name}`,s.css,16,2.4),h.audio.play("pickup",.6)},maybeDrop(i,e,t=.012,n=0){Math.random()<t&&Yn.spawn(zo(n),i,e)},update(i,e){for(let t=Ei.length-1;t>=0;t--){let n=Ei[t];n.t+=i,n.mesh.userData.item.rotation.y+=i*1.8,n.mesh.userData.item.position.y=.9+Math.sin(e*2.5+n.x)*.12;for(let s of h.officers)if(!(s.down||(s.x-n.x)**2+(s.z-n.z)**2>1.7)){Yn.pickUp(s,n.it),h.R.scene.remove(n.mesh),Ei.splice(t,1);break}}},collectAll(){for(let i of Ei.splice(0)){h.R.scene.remove(i.mesh);let e=h.officers.filter(t=>!t.down).sort((t,n)=>(t.x-i.x)**2+(t.z-i.z)**2-((n.x-i.x)**2+(n.z-i.z)**2))[0]||h.officers[0];e&&Yn.pickUp(e,i.it)}},pickUp(i,e){let t=i.gear[e.slot],n=fn[e.rarity];if(!t||e.rarity>t.rarity||e.rarity===t.rarity&&JSON.stringify(e.stat)>JSON.stringify(t.stat))i.gear[e.slot]=e,Zd(i),i_(i),h.FX.float(i.x,2.8,i.z,`EQUIPPED: ${e.name}`,n.css,18,2.2),h.toast(`${i.name} equipped ${n.label} ${ri[e.slot].label}: ${e.name} (${Yh(e)})`),h.FX.sparks(i.x,1,i.z,24,n.color),h.audio.play("win",.5);else{let r=25*(e.rarity+1);i.score+=r,h.FX.float(i.x,2.6,i.z,`Sold to commissary +${r}`,"#cfcfcf",14,1.6),h.audio.play("pickup",.6)}}};h.Loot=Yn;var ot={balls:[],pickups:[],hazards:[],nades:[]};h.C=ot;h.officers=[];var Pt=[],rr={launcher:{label:"40mm Less-Lethal",rate:2.2,dmg:60,speed:30,knock:17,sting:.8,pellets:1,spread:.02,life:.9,color:10477823,size:.2,sound:"thoomp",kick:.2},pepperball:{label:"Pepperball",rate:8,dmg:21,speed:34,knock:3,sting:.35,pellets:1,spread:.04,life:.9,color:16751146,size:.11,sound:"pop"},shotgun:{label:"Shotgun",rate:1.7,dmg:17,speed:38,knock:9,sting:0,pellets:8,spread:.32,life:.32,color:16769162,size:.07,sound:"shotgun",kick:.35},ar:{label:"AR-15",rate:11,dmg:34,speed:55,knock:4,sting:0,pellets:1,spread:.035,life:.7,color:16773808,size:.07,sound:"rifle",kick:.08}},Wi={oc:{label:"Orange OC",range:6.5,cone:.45,dps:30,blind:3.2,drain:22,puff:.25},vapor:{label:"OC Vapor",range:8.5,cone:.7,dps:34,blind:4.5,drain:26,puff:.5,linger:!0}},ds=[{at:0,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"oc",nades:!1},{at:20,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"vapor",nades:!1,news:"OC Vapor issued. It hangs in the air. Do NOT walk into your own cloud."},{at:45,rank:"SGT.",title:"Sergeant",gun:"launcher",spray:"vapor",nades:!1,news:"Congrats, Sgt. {hero}. Here is a 40mm less-lethal launcher. Still no raise."},{at:85,rank:"SGT.",title:"Sergeant",gun:"shotgun",spray:"vapor",nades:!1,news:"Armory approved the shotgun. Sign here, here, and here."},{at:130,rank:"LT.",title:"Lieutenant",gun:"ar",spray:"vapor",nades:!0,news:"Lieutenant {hero}! AR-15 and grenades approved. Please do not grenade the PREA poster."}],ai={time:12,hurtGain:.6,swing:.32,range:3.4,dmg:9999,bossDmg:260,knock:19,sprint:1.4,sprintDrain:16};h.coPower=h.coPower||function(i){};var Vi={cd:5,fuse:.8,radius:4.6,dmg:140,knock:15},oi={gun:rr.pepperball,spray:Wi.oc,baton:{range:2.4,arc:1.15,dmg:48,knock:11,time:.28,cd:.42},dash:{speed:21,time:.18,cost:22,dmg:10,knock:9},move:6.2},jr=class{constructor(e,t,n,s){this.slot=e,this.name=h.cleanName(t),this.gender=n,this.device=s,this.model=Oo({gender:n,slot:e}),h.R.scene.add(this.model.root),this.x=0,this.z=0,this.r=.42,this.yaw=0,this.ax=0,this.az=1,this.reset(),Kd(this)}reset(){this.hp=this.maxHp=100+(this.gear&&this.gear.pants?this.gear.pants.stat.hp:0),this.energy=100,this.down=!1,this.reviveT=0,this.fireCD=0,this.swingT=0,this.swingCD=0,this.dashT=0,this.iframes=0,this.slowT=0,this.tacoT=0,this.drinkT=0,this.hurtT=0,this.tauntT=3,this.sprayT=0,this.spraying=!1,this.kills=0,this.score=0,this.move=0,this.kvx=0,this.kvz=0,this.ot=this.ot||0,this.otT=0,this.otSwingT=0,this.sprinting=!1,this.hammer&&(this.hammer.visible=!1,this.model.root.scale.setScalar(1))}remove(){h.R.scene.remove(this.model.root)}hurt(e,t,n,s,r=3){if(this.down||this.iframes>0)return;if(e*=1-(this.armor||0),this.perks&&this.perks.has("spiky")){h.grid.query(t,n,1.2,Pt);for(let c of Pt)c.dead||(c.ocT=Math.max(c.ocT,2.5))}this.otT>0?e*=.4:this.ot=Math.min(100,(this.ot||0)+e*ai.hurtGain),this.hp-=e,this.hurtT=.35;let a=this.x-t,o=this.z-n,l=Math.hypot(a,o)||1;this.kvx+=a/l*r,this.kvz+=o/l*r,h.R.shake=Math.min(.6,h.R.shake+e*.02),h.R.split=Math.min(1,h.R.split+e*.06),h.audio.play("hurt",.7),s!=="spit"&&s!=="cup"&&h.FX.blood(this.x,1.3,this.z,a/l,o/l,4),this.hp<=0&&(this.hp=0,this.down=!0,h.FX.float(this.x,2.5,this.z,`${this.name} IS DOWN!`,"#ff5050",20,2.5),h.audio.play("alarm",1))}update(e){let t=this.model,n=this.device.read(this);if(this.iframes=Math.max(0,this.iframes-e),this.hurtT=Math.max(0,this.hurtT-e),this.tacoT=Math.max(0,this.tacoT-e),this.drinkT=Math.max(0,this.drinkT-e),this.zynT=Math.max(0,(this.zynT||0)-e),this.slowT=Math.max(0,this.slowT-e),this.rallyT=Math.max(0,(this.rallyT||0)-e),this.fireCD-=e,this.swingCD-=e,this.tauntT-=e,this.nadeCD=(this.nadeCD||0)-e,this.down){si(t,e,0,0,!1,1),t.root.position.set(this.x,0,this.z);return}this.perks&&this.perks.has("regen")&&(this.hp=Math.min(this.maxHp,this.hp+2*e)),this.sprinting=!!n.sprint&&this.energy>1&&Math.hypot(n.mx,n.mz)>.2&&!(this.otT>0),this.sprinting&&(this.energy=Math.max(0,this.energy-ai.sprintDrain*e)),n.ot&&this.ot>=100&&!(this.otT>0)&&this.startOT(),this.otT>0&&(this.otT-=e,this.otSwingT-=e,this.otSwingT<=0&&(this.otSwingT=ai.swing,this.swingT=.001,this.hitDone=!1,h.audio.play("swing",1)),this.otT<=0&&this.endOT());let s=oi.move*(this.speedMul||1)*(this.sprinting?ai.sprint:1)*(this.otT>0?1.15:1)*(this.drinkT>0?1.3:1)*(this.slowT>0?.6:1)*(this.spraying?.75:1),r=n.mx,a=n.mz,o=Math.hypot(r,a);if(o>1&&(r/=o,a/=o),this.dashT>0){this.dashT-=e,r=this.dashX,a=this.dashZ,s=oi.dash.speed,h.grid.query(this.x,this.z,1.3,Pt);for(let c of Pt)!c.dead&&!c.dashHit&&(c.dashHit=!0,h.AI.damage(c,oi.dash.dmg*this.dmgMul(),this.x,this.z,oi.dash.knock,"dash",this))}else if(n.dash&&this.energy>=oi.dash.cost&&o>.2){this.perks&&this.perks.has("freeDash")||(this.energy-=oi.dash.cost),this.dashT=oi.dash.time,this.iframes=.28,this.dashX=r/(o>1?1:o||1),this.dashZ=a/(o>1?1:o||1);for(let c of h.AI.list)c.dashHit=!1;h.audio.play("dash")}this.x+=(r*s+this.kvx)*e,this.z+=(a*s+this.kvz)*e;let l=Math.exp(-e*8);if(this.kvx*=l,this.kvz*=l,h.W.collide(this),this.move=h.lerp(this.move,Math.min(1,Math.hypot(r,a)),e*10),n.ax||n.az){let c=Math.hypot(n.ax,n.az);this.ax=n.ax/c,this.az=n.az/c}this.yaw=Math.atan2(this.ax,this.az),this.spraying=n.spray&&this.energy>0,!this.spraying&&!this.sprinting&&(this.energy=Math.min(100,this.energy+e*(this.drinkT>0?30:9))),n.fire&&this.fireCD<=0&&this.swingT<=0&&!this.sprinting&&!(this.otT>0)&&this.shoot(),this.spraying&&this.spray(e),n.nade&&h.S.nades&&this.nadeCD<=0&&this.throwNade(n),n.melee&&this.swingCD<=0&&(this.swingT=.001,this.swingCD=oi.baton.cd,this.hitDone=!1,h.audio.play("swing")),this.swingT>0&&(this.swingT+=e/oi.baton.time,!this.hitDone&&this.swingT>.4&&(this.hitDone=!0,this.baton()),this.swingT>=1&&(this.swingT=0)),si(t,e,this.move,this.swingT,n.fire&&!this.sprinting&&!(this.otT>0)||this.spraying,0),this.otT>0&&(t.baton.visible=!1,t.gun.visible=!1,this.hammer.visible=!0),t.root.position.set(this.x,0,this.z),t.root.rotation.y=this.yaw,t.ring.material.opacity=this.iframes>0?.3:.85}startOT(){this.ot=0,this.otT=ai.time,this.otSwingT=0,this.hammer||(this.hammer=u_(this.model)),this.model.root.scale.setScalar(1.3),h.showCard&&h.showCard("MANDATORY OVERTIME",h.pick(h_),!0,2600),h.say&&h.say("SUPERVISOR",h.pick(["You are mandated. Sixteen hours. Have fun.","Congratulations, you just got mandated. Go nuts.","Overtime approved. Payroll is crying. Clean house."]),3.5),h.audio.sting("overtime"),h.audio.music("overtime",!0),h.R.shake=.8,document.body.classList.add("assault","overtime"),h.coPower(this)}endOT(){this.otT=0,this.model.root.scale.setScalar(1),this.hammer&&(this.hammer.visible=!1),h.officers.some(e=>e.otT>0)||(document.body.classList.remove("assault","overtime"),h.levelMusic&&h.levelMusic()),h.FX.float(this.x,3,this.z,h.pick(["Clocked out.","Shift over. Back to normal pay.","OT done. Knees hurt."]),"#ffd24a",18,2)}dmgMul(){return(this.zynT>0?1.35:1)*(this.tacoT>0?1.5:1)*(this.rallyT>0?1.3:1)}flashShoot(){h.R.flashBoost=1;let e=13,t=.3;h.grid.query(this.x,this.z,e,Pt);for(let n of Pt){if(n.dead||n.caged)continue;let s=n.x-this.x,r=n.z-this.z,a=Math.hypot(s,r);a>e||a<.01||Math.acos(h.clamp((s*this.ax+r*this.az)/a,-1,1))>t||h.W.los(this.x,this.z,n.x,n.z)&&(n.ocT=Math.max(n.ocT,1.2),n.flashedT=.3,h.AI.damage(n,(a<5?6:3)*this.dmgMul(),this.x,this.z,.5,"flash",this))}Math.random()<.6&&h.FX.glow.spawn(this.x+this.ax*h.rand(1,9),1.3,this.z+this.az*h.rand(1,9),0,0,0,.12,.3,16773832,0),h.audio.play("beam",.6)}shoot(){let e=rr[h.S.gun]||rr.pepperball;h.S.def&&h.S.def.night&&(this.flashShoot(),h.R.muzzle(this.x+this.ax*1.2,this.z+this.az*1.2,e.pellets>1||e.sound==="boom"?1:.6));let n=e.rate*(this.drinkT>0?1.5:1);this.fireCD=1/n;let s=this.ax,r=this.az,a=.985;h.grid.query(this.x,this.z,16,Pt);for(let o of Pt){if(o.dead)continue;let l=o.x-this.x,c=o.z-this.z,u=Math.hypot(l,c)||1,f=(l*this.ax+c*this.az)/u;f>a&&(a=f,s=l/u,r=c/u)}for(let o=0;o<e.pellets;o++){let l=h.rand(-e.spread,e.spread),c=Math.cos(l),u=Math.sin(l),f=s*c-r*u,d=s*u+r*c,p=e.speed*h.rand(.9,1.1);ot.balls.push({x:this.x+f*.6,z:this.z+d*.6,y:1.3,vx:f*p,vz:d*p,life:e.life,owner:this,gun:e})}e.kick&&(this.kvx-=s*e.kick*10,this.kvz-=r*e.kick*10,h.R.shake=Math.min(.5,h.R.shake+e.kick*.5)),h.FX.glow.spawn(this.x+s*.9,1.3,this.z+r*.9,0,0,0,.05,e.pellets>1?.35:.22,16770976,0),h.audio.play(e.sound,.6)}spray(e){if(this.energy=Math.max(0,this.energy-(Wi[h.S.spray]||Wi.oc).drain*e),this.sprayT-=e,this.sprayT>0)return;this.sprayT=.07;let t=Wi[h.S.spray]||Wi.oc,n=t.cone*3;(t.linger?h.FX.mist:h.FX.cloud)(this.x+this.ax*.8,1.35,this.z+this.az*.8,this.ax*t.range*2.2+h.rand(-n,n),this.az*t.range*2.2+h.rand(-n,n),t.puff),t.linger&&Math.random()<.35&&ot.hazards.push({x:this.x+this.ax*t.range*.7,z:this.z+this.az*t.range*.7,r:2.4,t:5,owner:this}),h.audio.play("spray",.6),h.grid.query(this.x,this.z,t.range,Pt);for(let r of Pt){if(r.dead)continue;let a=r.x-this.x,o=r.z-this.z,l=Math.hypot(a,o);l>t.range||l<.01||Math.acos(h.clamp((a*this.ax+o*this.az)/l,-1,1))>t.cone||h.W.los(this.x,this.z,r.x,r.z)&&(r.ocT=t.blind,h.AI.damage(r,t.dps*.07*this.dmgMul(),this.x,this.z,.6,"oc",this))}}throwNade(e){this.nadeCD=Vi.cd;let t=Math.hypot(e.ax||0,e.az||0),n=t>2.5?h.clamp(t,3,12):9,s=Vi.fuse;ot.nades.push({x:this.x+this.ax*.6,z:this.z+this.az*.6,y:1.6,vx:this.ax*n/s,vz:this.az*n/s,vy:4.5,t:s,owner:this,mesh:null}),h.audio.play("swing",1),h.FX.float(this.x,2.6,this.z,h.pick(["FRAG OUT!","GRENADE!","Fire in the hole!"]),"#ffcf4a",17,1.2)}baton(){if(this.otT>0)return this.hammerHit();let e=oi.baton;h.grid.query(this.x,this.z,e.range+.6,Pt);let t=0;for(let n of Pt){if(n.dead)continue;let s=n.x-this.x,r=n.z-this.z,a=Math.hypot(s,r);if(a>e.range+n.r||a>.5&&Math.acos(h.clamp((s*this.ax+r*this.az)/a,-1,1))>e.arc)continue;let o=n.ocT>0?2:1,l=h.AI.damage(n,e.dmg*o*this.dmgMul(),this.x,this.z,e.knock*(o>1?1.4:1),"baton",this);h.FX.sparks(n.x,1.3*n.scale,n.z,5,16777215),t++,o>1&&t===1&&h.FX.float(n.x,2.6,n.z,"BLIND SIDE!","#ffdd55",16,1),l&&this.taunt()}t&&(h.audio.play("crack"),h.R.shake=Math.min(.7,h.R.shake+.12+t*.03),h.S.hitStop=.04,h.R.flashOn&&h.R.muzzle(this.x+this.ax*1.5,this.z+this.az*1.5,.5))}hammerHit(){h.grid.query(this.x,this.z,ai.range+.6,Pt);let e=0;for(let t of Pt){if(t.dead||t.caged)continue;let n=t.x-this.x,s=t.z-this.z;Math.hypot(n,s)>ai.range+t.r||(h.AI.damage(t,t.boss?ai.bossDmg:ai.dmg,this.x,this.z,ai.knock,"hammer",this),h.FX.sparks(t.x,1.3*t.scale,t.z,8,16765514),e++)}e&&Math.random()<.5&&h.FX.float(this.x+this.ax*2,.8,this.z+this.az*2,h.pick(["*CLOCK IN*","DING!","*PUNCH*","BONK","OT!"]),"#ffd24a",15,.6),e&&(h.audio.play("clock",1),h.R.shake=Math.min(.9,h.R.shake+.25),h.S.hitStop=.05,h.R.flashOn&&h.R.muzzle(this.x,this.z,1.2))}taunt(){this.tauntT>0||Math.random()>.3||(this.tauntT=h.rand(4,7),h.FX.float(this.x,2.5,this.z,h.pick(gd),"#9fd0ff",16,1.8))}},li,r_=new P(0,0,1),Jd=new Be,jd=new qt,Qd=new P,a_=new P,ep=new ye;ot.init=function(i){li=new cn(new At(1,8,6),new yt({toneMapped:!1}),400),li.frustumCulled=!1,li.count=0,li.setColorAt(0,ep.set(1,1,1)),i.add(li);for(let e=0;e<4;e++){let t=new pe(new At(1,20,14),new yt({color:16756816,transparent:!0,opacity:0,depthWrite:!1,blending:Tn,toneMapped:!1}));t.visible=!1,i.add(t),Fo.push({mesh:t,t:0,x:0,z:0})}};var Fo=[],o_=new At(.13,10,8),$h=null;ot.reset=function(){for(let i of ot.nades)i.mesh&&h.R.scene.remove(i.mesh);ot.balls.length=0,ot.hazards.length=0,ot.nades.length=0;for(let i of ot.pickups)h.R.scene.remove(i.mesh);ot.pickups.length=0};ot.update=function(i,e){let t=0;for(let n=ot.balls.length-1;n>=0;n--){let s=ot.balls[n];s.life-=i;let r=2,a=s.life<=0;for(let u=0;u<r&&!a;u++){if(s.x+=s.vx*i/r,s.z+=s.vz*i/r,h.W.blocked(s.x,s.z)){h.FX.sparks(s.x,s.y,s.z,4,16751146),a=!0;break}h.grid.query(s.x,s.z,.8,Pt);for(let f of Pt)if(!f.dead&&(f.x-s.x)**2+(f.z-s.z)**2<(f.r+.12)**2){let d=h.AI.damage(f,s.gun.dmg*s.owner.dmgMul(),s.x-s.vx,s.z-s.vz,s.gun.knock,"ball",s.owner);s.gun.sting&&(f.ocT=Math.max(f.ocT,s.gun.sting)),h.FX.sparks(s.x,s.y,s.z,h.R.flashOn?8:3,h.R.flashOn?16765066:16751146),h.FX.cloud(s.x,s.y,s.z,0,0,.15),h.R.flashOn&&h.R.muzzle(s.x,s.z,.35),h.audio.play("thud",.4),d&&s.owner.taunt(),a=!0;break}}if(a){ot.balls.splice(n,1);continue}let o=h.R.flashOn,l=s.gun.size*(o?1.8:1),c=s.gun.speed>40?5:o?2.5:1;o&&Math.random()<.5&&h.FX.glow.spawn(s.x,s.y,s.z,0,0,0,.12,l*.8,s.gun.color,0),jd.setFromUnitVectors(r_,Qd.set(s.vx,0,s.vz).normalize()),Jd.compose(Qd.set(s.x,s.y,s.z),jd,a_.set(l,l,l*c)),li.setMatrixAt(t,Jd),li.setColorAt(t,ep.setHex(s.gun.color)),t++}li.count=t,li.instanceMatrix.needsUpdate=!0,li.instanceColor.needsUpdate=!0;for(let n=ot.nades.length-1;n>=0;n--){let s=ot.nades[n];s.mesh||($h=$h||new ze({color:4016682,roughness:.6,metalness:.3}),s.mesh=new pe(o_,$h),s.mesh.castShadow=!0,h.R.scene.add(s.mesh)),s.t-=i,s.vy-=12*i;let r=s.x+s.vx*i,a=s.z+s.vz*i;if(h.W.blocked(r,a)?(s.vx*=-.4,s.vz*=-.4):(s.x=r,s.z=a),s.y+=s.vy*i,s.y<.15&&(s.y=.15,s.vy=Math.abs(s.vy)*.35,s.vx*=.6,s.vz*=.6),s.mesh.position.set(s.x,s.y,s.z),s.mesh.rotation.x+=i*12,Math.random()<.5&&h.FX.glow.spawn(s.x,s.y+.1,s.z,0,.3,0,.1,.06,16764006,0),s.t>0)continue;h.R.scene.remove(s.mesh),ot.nades.splice(n,1);let o=Fo.find(l=>l.t<=0)||Fo[0];o.t=.45,o.x=s.x,o.z=s.z,h.FX.sparks(s.x,.8,s.z,40,16760928),h.R.flashOn&&h.R.muzzle(s.x,s.z,2.5);for(let l=0;l<10;l++)h.FX.cloud(s.x+h.rand(-1.5,1.5),.8,s.z+h.rand(-1.5,1.5),h.rand(-3,3),h.rand(-3,3),.9,7236196);h.audio.play("boom",1.4),setTimeout(()=>h.audio.play("boom",.8),90),h.R.shake=Math.min(1,h.R.shake+.7),h.S.hitStop=.06,h.grid.query(s.x,s.z,Vi.radius+1,Pt);for(let l of Pt.slice()){if(l.dead||l.caged)continue;let c=Math.hypot(l.x-s.x,l.z-s.z);c>Vi.radius+l.r||h.AI.damage(l,Vi.dmg*(1-.6*c/Vi.radius)*s.owner.dmgMul(),s.x,s.z,Vi.knock,"nade",s.owner)}}for(let n of Fo){if(n.t<=0){n.mesh.visible=!1;continue}n.t-=i;let s=1-n.t/.45;n.mesh.visible=!0,n.mesh.position.set(n.x,.8,n.z),n.mesh.scale.setScalar(.6+Vi.radius*Math.sqrt(s)),n.mesh.material.opacity=(1-s)*.9,n.mesh.material.color.setHex(s<.25?16773312:16742944)}for(let n=ot.hazards.length-1;n>=0;n--){let s=ot.hazards[n];if(s.t-=i,s.t<=0){ot.hazards.splice(n,1);continue}Math.random()<i*2.5&&h.FX.mist(s.x+h.rand(-1.2,1.2),.7,s.z+h.rand(-1.2,1.2),h.rand(-1.5,1.5),h.rand(-1.5,1.5),.6),h.grid.query(s.x,s.z,s.r,Pt);for(let r of Pt)!r.dead&&(r.x-s.x)**2+(r.z-s.z)**2<s.r*s.r&&(r.ocT=Math.max(r.ocT,1.5),Math.random()<i*3&&h.AI.damage(r,2,s.x,s.z,.2,"oc",s.owner))}for(let n=ot.pickups.length-1;n>=0;n--){let s=ot.pickups[n];s.t+=i,s.mesh.position.y=.55+Math.sin(e*3+s.x)*.12,s.mesh.rotation.y+=i*2;for(let r of h.officers)if(!(r.down||(r.x-s.x)**2+(r.z-s.z)**2>.9)){if(s.kind==="taco")r.hp=Math.min(r.maxHp,r.hp+30),r.tacoT=12;else if(s.kind==="gold"){let a=new Set(h.store.get("sa_gold",[]));a.add(h.S.def.key),h.store.set("sa_gold",[...a]),r.hp=r.maxHp,r.tacoT=20,a.size>=3&&!h.store.get("sa_bigbro",!1)?(h.store.set("sa_bigbro",!0),h.showCard("BIG BRO MODE UNLOCKED","Caleb Alaniz now rides the whole shift with you. I got you bro.",!0,4200)):h.FX.float(r.x,3,r.z,`GOLDEN TACO ${a.size}/3`,"#ffd34d",24,2.2)}else if(s.kind==="zyn")r.hp=Math.min(r.maxHp,r.hp+35),r.zynT=10,h.FX.sparks(r.x,1.6,r.z,14,16738842);else if(s.kind==="chew"){r.hp=Math.min(r.maxHp,r.hp+55),h.grid.query(r.x,r.z,5,Pt);let a=null,o=26;for(let l of Pt){if(l.dead)continue;let c=(l.x-r.x)**2+(l.z-r.z)**2;c<o&&(o=c,a=l)}a&&(a.ocT=4,h.FX.spit(r.x,1.5,r.z,a.x-r.x,a.z-r.z),h.FX.float(a.x,2.4,a.z,"TOBACCO IN THE EYE!","#c79a5a",16,1.4))}else r.energy=100,r.drinkT=10;h.FX.float(r.x,2.6,r.z,h.pick(vd[s.kind]),l_[s.kind],20,1.6),h.audio.play(s.kind==="zyn"||s.kind==="chew"||s.kind==="gold"?s.kind:"pickup"),h.R.scene.remove(s.mesh),ot.pickups.splice(n,1);break}s.t>30&&s.kind!=="gold"&&ot.pickups[n]===s&&(h.R.scene.remove(s.mesh),ot.pickups.splice(n,1))}};var l_={gold:"#ffd34d",taco:"#ffcf4a",drink:"#7dff6a",zyn:"#ff7a2a",chew:"#c79a5a"},It={};function c_(i){It.ready||(It.shell=new ze({color:15909198,roughness:.6}),It.meat=new ze({color:7027486,roughness:.8}),It.lettuce=new ze({color:6275642,roughness:.8}),It.can=new ze({color:1118481,roughness:.25,metalness:.8}),It.logo=new yt({color:7012154,toneMapped:!1}),It.zynLid=new ze({color:16054008,roughness:.35,metalness:.2}),It.zynBand=new ze({color:2060246,emissive:16730640,emissiveIntensity:.9,roughness:.4}),It.chewLid=new ze({color:2759954,roughness:.5,metalness:.3}),It.chewBand=new ze({color:13214282,roughness:.35,metalness:.7}),It.ring=new yt({color:16777215,transparent:!0,opacity:.5,toneMapped:!1}),It.ready=!0);let e=new ut;if(i==="taco"||i==="gold"){let n=new pe(new rt(.34,.34,.2,18,1,!0,0,Math.PI),It.shell);n.rotation.z=Math.PI/2,n.material.side=Xt;let s=new pe(new Pe(.16,.12,.55),It.meat);s.position.y=.06;let r=new pe(new Pe(.2,.06,.5),It.lettuce);if(r.position.y=.14,e.add(n,s,r),e.scale.setScalar(1.3),i==="gold"){let a=new ze({color:16765773,emissive:9067008,emissiveIntensity:1.4,metalness:1,roughness:.2});e.traverse(o=>{o.isMesh&&(o.material=a)})}}else if(i==="zyn"||i==="chew"){let n=i==="zyn",s=new pe(new rt(.3,.3,.12,24),n?It.zynBand:It.chewBand),r=new pe(new rt(.31,.31,.05,24),n?It.zynLid:It.chewLid);r.position.y=.08,e.add(s,r),e.rotation.x=.5}else{let n=new pe(new rt(.13,.13,.48,16),It.can),s=new pe(new rt(.135,.135,.22,16,1,!0),It.logo);e.add(n,s)}e.traverse(n=>{n.castShadow=!0});let t=new pe(new Qn(.45,.55,24),It.ring);return t.rotation.x=-Math.PI/2,t.position.y=-.5,e.add(t),e}ot.spawnPickup=function(i,e,t){if(ot.pickups.length>14)return;let n=c_(i);n.position.set(e,.55,t),h.R.scene.add(n),ot.pickups.push({kind:i,x:e,z:t,mesh:n,t:0})};h.dropLoot=function(i,e){let t=Math.random();t<.05?ot.spawnPickup("taco",i,e):t<.09?ot.spawnPickup("drink",i,e):t<.125?ot.spawnPickup("zyn",i,e):t<.15&&ot.spawnPickup("chew",i,e)};var h_=["Sixteen hours. No breaks. No mercy.","Payroll is about to cry.","The time clock is a WEAPON now.","You have been mandated. They have been warned."];function u_(i){let e=new ze({color:16765773,emissive:8014336,emissiveIntensity:1.2,roughness:.3,metalness:1}),t=new ze({color:5922920,roughness:.45,metalness:.6}),n=new ze({color:16777215,emissive:16774080,emissiveIntensity:.6}),s=new ze({color:16722458,emissive:16722458,emissiveIntensity:1.5}),r=new ut,a=new pe(new rt(.05,.06,1.3,10),e);a.position.y=.55,r.add(a);let o=new pe(new Pe(.62,.5,.42),t);o.position.y=1.3,r.add(o);let l=new pe(new rt(.17,.17,.03,20),n);l.rotation.x=Math.PI/2,l.position.set(0,1.36,.22),r.add(l);let c=new pe(new Pe(.3,.05,.04),s);c.position.set(0,1.12,.22),r.add(c);for(let u of[-1,1]){let f=new pe(new Pe(.06,.56,.48),e);f.position.set(u*.34,1.3,0),r.add(f)}return r.traverse(u=>{u.isMesh&&(u.castShadow=!0)}),r.rotation.x=Math.PI/2,r.position.set(0,-.07,.05),i.baton.parent.add(r),r}var Lt=[];h.allies=[];var f_={halley:{name:()=>h.CREW.halley,gender:"female",rank:"sgt",back:"SGT. MUNOZ",scale:1.02,title:"The Sergeant. The fianc\xE9e. The legend.",hp:400,time:30,speed:7.2,uniform:1914736,enter:["Sgt. Munoz on scene. Who touched my officers?","Move. Sergeant Munoz coming through.","Get up, {hero}. We are not dying on Sgt. Munoz's shift."],barks:["Sit DOWN.","That is a write-up AND a beatdown.","You wanna PREA me? Fill out the form.","Who trained you, {hero}? Oh right. Me.","Somebody get these men a timeout.","I did not do my hair for this.","Tase first, paperwork later."],leave:["Clean this up, family. I have a wedding to plan.","Sgt. Munoz out. Proud of every one of you.","Good work, family. Go home safe tonight. That is an order."]},caleb:{name:()=>h.CREW.caleb,gender:"male",back:"ALANIZ",scale:1.15,title:"Six-four of pure overtime. A real one.",hp:300,time:20,speed:6.8,uniform:2376318,enter:["I got you bro.","I got you bro. Caleb Alaniz on scene.","I got you bro. Get behind me.","Bro. BRO. I got you."],barks:["I got you bro.","Nobody touches my brother.","Bro, I got this side.","Six-four of pure overtime, baby!","Bro, that was a flag on the play.","Hold my energy drink.","You good, {hero}? Eat a taco, bro.","Ref! REF!","Touchdown, baby!"],leave:["Gotta bounce, bro. My truck is double-parked.","Alaniz out. Love y'all. Stay up, family.","Caleb out. Proud to work with y'all, for real."]},bernardo:{name:()=>h.CREW.bernardo,gender:"male",back:"CORRECTIONS",scale:1.08,hp:500,time:22,speed:6.2,uniform:2376318,enter:["Bernardo on scene. Hey, you wanna see how big my truck is? After this.","SHIELD UP! Bernardo\u2019s here!","Who called for the big shield and the bigger truck?"],barks:wd,leave:["Shield\u2019s going back in the truck. The BIG truck.","Bernardo out. Somebody owes me twenty on Sunday."]},dustin:{name:()=>h.CREW.dustin,gender:"male",back:"DAVIS",scale:1,title:'"YOU WANNA FUCK ON ME?"',hp:300,time:22,speed:7,uniform:2376318,enter:["You wanna fuck on me? Dustin Davis on scene.","YOU WANNA FUCK ON ME?! Officer Davis is here.","You wanna fuck on me? Come on then. Dustin Davis in the building."],barks:[sr,sr,sr,sr,sr,...Fd],barkGap:[2.5,4.5],barkSize:18,leave:["Davis out. You still wanna fuck on me? Didn't think so.","Roast complete. Dustin Davis out. Love you, family."]},ricardo:{name:()=>h.CREW.ricardo,gender:"male",back:"ALANIZ",scale:1.1,title:"One of the good ones. A legend. He cleans house.",hp:450,time:22,speed:7.6,uniform:11569749,lanyard:!0,gold:!0,enter:Bd,barks:Hd,leave:Gd,barkGap:[3,5],barkSize:17},caughren:{name:()=>h.CREW.caughren,gender:"female",back:"CAUGHREN",scale:1,hp:1,time:1e9,speed:3,uniform:2771594,passive:!0,belly:!0,deny:Dd,extra:Nd,close:"ASK BINGHAM.",col:"#ff8ad8",leave:["It was ONE phone!","I want my union rep!","He said he LOVED me!","I was never here."]},bingham:{name:()=>h.CREW.bingham,gender:"female",back:"COUNSELOR",scale:1,hp:1,time:1e9,speed:3,uniform:12098154,passive:!0,belly:!0,lanyard:!0,deny:Ud,extra:Od,close:kd,col:"#ffb37a",leave:["My caseload NEEDS me!","I am calling my therapist. He is in C-pod.","This is a hostile work environment!","I was never here."]}},Zh=class{constructor(e,t,n){let s=this.d=f_[e];if(this.key=e,this.name=s.name(),this.model=Oo({gender:s.gender,rank:s.rank,back:s.back,ringColor:e==="halley"||s.gold?16765773:s.passive?16734896:16777215,uniform:s.uniform,scale:s.scale,skin:e==="halley"?13011550:void 0,hair:e==="halley"?1709072:void 0,belly:s.belly,lanyard:s.lanyard}),h.R.scene.add(this.model.root),e==="bernardo"){let r=new pe(new Pe(.06,.95,.62),new ze({color:11063536,roughness:.08,metalness:.1,transparent:!0,opacity:.45}));r.position.set(-.05,-.38,.28),r.rotation.y=Math.PI/2,this.model.armL.add(r),this.model.holdL=!0}if(Object.assign(this,{x:t,z:n,r:.45,yaw:0,hp:s.hp,t:s.time,down:!1,isAlly:!0,move:0,swingT:0,cd:.5,tazeCD:0,slamCD:2,sprayT:0,barkT:h.rand(4,7),leaving:!1}),s.passive){Object.assign(this,{passive:!0,state:"cuddle",lines:[],lineT:0,heartT:.5,walkT:0}),this.model.baton.visible=!1,this.tag=document.createElement("div"),this.tag.className="nametag",this.tag.style.color=s.col,this.tag.textContent="\u26A0 "+this.name+" \u26A0",document.getElementById("floaters").appendChild(this.tag);return}h.FX.sparks(t,1,n,20,16765773),h.FX.float(t,2.8,n,`${this.name.toUpperCase()} ON SCENE`,e==="halley"||s.gold?"#ffd34d":"#9fd0ff",22,2.2),e==="dustin"&&h.FX.float(t,3.4,n,'"YOU WANNA FUCK ON ME?"',"#ffd27a",30,2.8),e==="ricardo"&&(h.FX.sparks(t,1,n,40,16765773),h.R.shake=.5,h.audio.play("slam",.8)),h.showCard&&h.showCard(`${this.name.toUpperCase()}`,`ON SCENE \xB7 ${s.title||""}`,!1,2800),this.tag=document.createElement("div"),this.tag.className="nametag"+(e==="halley"||s.gold?" gold":""),this.tag.textContent=this.name,document.getElementById("floaters").appendChild(this.tag),h.say(this.name,h.pick(s.enter))}hurt(e){this.hp-=e*.5,this.model.root.children[0]&&(this.flash=.2),this.hp<=0&&(this.t=0)}remove(){h.R.scene.remove(this.model.root),this.tag&&this.tag.remove()}bust(){if(this.state!=="cuddle")return;let e=this.d;this.state="busted",this.lineT=.4,this.lines=e.deny.concat(e.extra.slice().sort(()=>Math.random()-.5).slice(0,4),[e.close]),h.showCard("COMPROMISED",`${this.name.toUpperCase()} \xB7 CAUGHT IN 4K`,!0,3e3),h.audio.play("scare",.8),this.bf&&!this.bf.dead&&h.FX.float(this.bf.x,2.9,this.bf.z,h.pick(Fh),"#ff8a3a",18,2)}walkOut(e){this.state!=="walk"&&(this.state="walk",this.walkT=3.5,h.FX.float(this.x,3,this.z,e||h.pick(this.d.leave),this.d.col,20,2.4),this.bf&&!this.bf.dead&&(this.bf.freezeT=0,this.bf.loveSick=!1))}passiveUpdate(e){let t=this.d,n=this.bf;if(this.state==="cuddle")n&&!n.dead&&(this.yaw=Math.atan2(n.x-this.x,n.z-this.z),n.freezeT=Math.max(n.freezeT,1),n.yaw=Math.atan2(this.x-n.x,this.z-n.z)),this.heartT-=e,this.heartT<=0&&(this.heartT=h.rand(.7,1.3),h.FX.float(this.x+h.rand(-.4,.4),2.3,this.z+h.rand(-.4,.4),h.pick(["\u2665","\u2665\u2665","\u2665","mwah","\u2665 \u2665 \u2665"]),"#ff5ab0",20,1.4),Math.random()<.3&&n&&!n.dead&&h.FX.float(n.x,2.8,n.z,h.pick(Fh),"#ff8a3a",15,1.8)),h.officers.some(s=>!s.down&&(s.x-this.x)**2+(s.z-this.z)**2<9)&&this.bust(),this.model.root.rotation.z=Math.sin(performance.now()/300)*.06;else if(this.state==="busted"){let s=h.officers.find(r=>!r.down)||h.officers[0];if(this.yaw=Math.atan2(s.x-this.x,s.z-this.z),this.model.root.rotation.z=0,this.lineT-=e,this.lineT<=0){let r=this.lines.shift();if(r)this.lineT=2.3,h.FX.float(this.x,3.1,this.z,r,t.col,17,2.4),h.say(this.name,r,2.3);else{h.S.compromised=(h.S.compromised||0)+1,(h.S.compNames=h.S.compNames||[]).push(this.name),h.say("CONTROL",`${this.name}, turn in your keys. Your radio. And your dignity.`,3.2);for(let a=0;a<2;a++)h.C.spawnPickup("zyn",this.x+h.rand(-1,1),this.z+h.rand(-1,1));h.FX.float(this.x,2.2,this.z,"CONTRABAND: 2 TINS, 1 PHONE, 1 SONOGRAM","#ff7a2a",15,2.5),this.walkOut()}}}else if(this.state==="walk"&&(this.walkT-=e,this.x+=Math.sin(this.yaw+Math.PI)*2*e,this.z+=Math.cos(this.yaw+Math.PI)*2*e,h.W.collide(this),this.move=h.lerp(this.move,.6,e*6),this.walkT<=0))return h.FX.sparks(this.x,1,this.z,16,16734896),this.leaving=!0,!1;if(si(this.model,e,this.state==="walk"?this.move:0,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.state==="walk"?this.yaw+Math.PI:this.yaw,this.tag){let[s,r,a]=h.R.worldToScreen(this.x,2.7,this.z);this.tag.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%) scale(${1+.12*Math.sin(performance.now()/150)})`,this.tag.style.opacity=a?1:0}return!0}update(e){if(this.passive)return this.passiveUpdate(e);let t=this.d;if(this.t-=e,this.cd-=e,this.tazeCD-=e,this.slamCD-=e,this.barkT-=e,this.t<=0&&!this.leaving)return this.leaving=!0,h.say(this.name,h.pick(t.leave)),h.FX.sparks(this.x,1,this.z,16,16777215),!1;if(this.leaving)return!1;if(this.barkT<=0&&(this.barkT=h.rand(...t.barkGap||[5,9]),h.FX.float(this.x,2.7,this.z,h.t(h.pick(t.barks),d_()),this.key==="halley"||t.gold?"#ffd34d":this.key==="dustin"?"#ffd27a":"#9fd0ff",t.barkSize||15,2)),this.key==="ricardo"){let l=h.allies.find(c=>c.passive&&c.state==="cuddle");if(l){let c=l.x-this.x,u=l.z-this.z,f=Math.hypot(c,u)||1;if(f<2.2){let d=h.pick(Vd).replace("{name}",l.name.replace(/^(C\/O|Counselor) /,""));h.FX.float(this.x,3.3,this.z,d,"#ffd34d",22,2.6),l.bust(),l.lineT=2.4,h.say(this.name,d,2.4)}else return this.stuckT=(this.bestL??1e9)-f<.05?(this.stuckT||0)+e:0,this.bestL=Math.min(this.bestL??1e9,f),this.stuckT>1.2&&(h.FX.sparks(this.x,1,this.z,16,16765773),this.x=l.x-1.5,this.z=l.z+.5,this.stuckT=0,h.W.blocked(this.x,this.z)&&(this.x=l.x,this.z=l.z+1.2),h.FX.sparks(this.x,1,this.z,24,16765773),h.FX.float(this.x,2.9,this.z,"I know a shortcut.","#ffd34d",18,1.6)),this.walkTo(c/f,u/f,e)}}if(this.key==="caleb"){let l=h.officers.find(c=>c.down);if(l){let c=l.x-this.x,u=l.z-this.z,f=Math.hypot(c,u)||1;if(f<1.4)l.down=!1,l.hp=Math.max(l.hp,55),l.iframes=2,h.FX.float(l.x,2.6,l.z,"GET UP BRO. I GOT YOU.","#9fd0ff",20,2),this.bigBroSlam();else{if(this.yaw=Math.atan2(c,u),this.x+=c/f*this.d.speed*1.2*e,this.z+=u/f*this.d.speed*1.2*e,h.W.collide(this),this.move=h.lerp(this.move,1,e*8),si(this.model,e,this.move,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[d,p,y]=h.R.worldToScreen(this.x,2.6*(this.d.scale||1),this.z);this.tag.style.transform=`translate(${d|0}px, ${p|0}px) translate(-50%, -50%)`,this.tag.style.opacity=y?1:0}return!0}}}if(this.key==="caleb")for(let l of h.officers)!l.down&&(l.x-this.x)**2+(l.z-this.z)**2<16&&(l.hp=Math.min(l.maxHp,l.hp+6*e));let n=h.officers.find(l=>!l.down)||h.officers[0],s=null,r=1e9;h.grid.query(n.x,n.z,16,Lt);for(let l of Lt){if(l.dead)continue;let c=(l.x-this.x)**2+(l.z-this.z)**2;c<r&&(r=c,s=l)}let a=0,o=0;if(s){let l=Math.sqrt(r),c=(s.x-this.x)/l,u=(s.z-this.z)/l;this.yaw=Math.atan2(c,u),l>1.6&&(a=c,o=u),this.key==="halley"?this.halleyMoves(s,l,c,u):this.key==="bernardo"?this.bernardoMoves(s,l):this.key==="dustin"?this.dustinMoves(s,l,c,u):this.key==="ricardo"?this.ricardoMoves(s,l,c,u,e):this.calebMoves(s,l,c,u,e)}else if((n.x-this.x)**2+(n.z-this.z)**2>9){let l=n.x-this.x,c=n.z-this.z,u=Math.hypot(l,c);a=l/u,o=c/u,this.yaw=Math.atan2(a,o)}if(this.x+=a*t.speed*e,this.z+=o*t.speed*e,h.W.collide(this),this.move=h.lerp(this.move,Math.hypot(a,o),e*8),this.swingT>0&&(this.swingT+=e/.3,this.swingT>=1&&(this.swingT=0)),si(this.model,e,this.move,this.swingT,!1,0),this.model.root.position.set(this.x,0,this.z),this.spin>0&&(this.spin-=e),this.model.root.rotation.y=this.yaw+(this.spin>0?(.5-this.spin)*h.TAU*4:0),this.tag){let[l,c,u]=h.R.worldToScreen(this.x,2.6*(t.scale||1),this.z);this.tag.style.transform=`translate(${l|0}px, ${c|0}px) translate(-50%, -50%)`,this.tag.style.opacity=u?1:0}return!0}baton(e,t,n){this.swingT=.001,h.grid.query(this.x,this.z,t+.5,Lt);let s=0;for(let r of Lt)r.dead||(r.x-this.x)**2+(r.z-this.z)**2>t*t||(h.AI.damage(r,e,this.x,this.z,n,"baton",null),s++);return s&&(h.audio.play("crack"),h.R.shake=Math.min(.6,h.R.shake+.1)),s}halleyMoves(e,t){let n=0;h.grid.query(this.x,this.z,2.8,Lt);for(let s of Lt)s.dead||n++;if(n>=3&&this.slamCD<=0)this.slamCD=4.5,this.cd=.6,this.baton(70,3.2,14),h.FX.sparks(this.x,.3,this.z,30,16765773),h.FX.float(this.x,2.9,this.z,"TAKEDOWN!","#ffd34d",20,1.2),h.R.shake=.7,h.S.hitStop=.08;else if(t>2.5&&t<9&&this.tazeCD<=0){this.tazeCD=1.4;let s=this,r=e,a=new Set;for(let o=0;o<4&&r;o++)a.add(r),p_(s.x,s.z,r.x,r.z),r.ocT=Math.max(r.ocT,2.2),h.AI.damage(r,28,s.x,s.z,3,"taser",null),s=r,h.grid.query(r.x,r.z,4,Lt),r=Lt.find(l=>!l.dead&&!a.has(l))||null;h.audio.play("zap",.9),Math.random()<.25&&h.FX.float(e.x,2.5,e.z,h.pick(["RIDE THE LIGHTNING!","TASER TASER TASER!","Don't tase me, sis!"]),"#9fe8ff",16,1.2)}else t<1.9&&this.cd<=0&&(this.cd=.45,this.baton(55,2.2,9))}bernardoMoves(e,t){for(let n=h.AI.proj.length-1;n>=0;n--){let s=h.AI.proj[n];(s.x-this.x)**2+(s.z-this.z)**2<7&&(h.FX.sparks(s.x,s.y,s.z,6,11063536),h.AI.proj.splice(n,1))}t<2.3&&this.cd<=0&&(this.cd=.8,this.baton(40,2.6,16)&&(h.FX.float(this.x,2.7,this.z,"SHIELD BASH!","#a8d0f0",16,1),h.S.hitStop=.05))}dustinMoves(e,t,n,s){if(this.tazeCD<=0&&t<7){this.tazeCD=2.8,h.FX.float(e.x,2.6,e.z,h.pick(Ed),"#ffd27a",16,2.2),h.grid.query(this.x,this.z,7,Lt);for(let r of Lt){if(r.dead||r.boss)continue;let a=r.x-this.x,o=r.z-this.z,l=Math.hypot(a,o)||1;(a*n+o*s)/l>.6&&(r.freezeT=2,r.swing=0)}h.FX.float(this.x+n*3,2.2,this.z+s*3,"ROASTED!","#ff8a3a",20,1.2)}else t<1.9&&this.cd<=0&&(this.cd=.5,this.baton(45,2.2,9))}walkTo(e,t,n){if(this.yaw=Math.atan2(e,t),this.x+=e*this.d.speed*n,this.z+=t*this.d.speed*n,h.W.collide(this),this.move=h.lerp(this.move,1,n*8),si(this.model,n,this.move,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[s,r,a]=h.R.worldToScreen(this.x,2.6*(this.d.scale||1),this.z);this.tag.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%)`,this.tag.style.opacity=a?1:0}return!0}ricardoMoves(e,t,n,s,r){if(this.comboCD=(this.comboCD??1)-r,this.houseCD=(this.houseCD??2)-r,this.chain&&this.chain.length){if(this.chainT-=r,this.chainT<=0){this.chainT=.13;let o=this.chain.shift();if(o&&!o.dead){let l=o.x-this.x,c=o.z-this.z,u=Math.hypot(l,c)||1;this.x=o.x-l/u*.9,this.z=o.z-c/u*.9,h.W.collide(this),this.yaw=Math.atan2(l,c),this.swingT=.001,this.combo++,h.AI.damage(o,55+this.combo*8,this.x,this.z,8+this.combo,"baton",null),h.FX.sparks(o.x,1.2,o.z,10,16765773),h.FX.float(o.x,2.6,o.z,`COMBO x${this.combo}`,"#ffd34d",16+this.combo*2,.9),h.audio.play("crack"),h.R.shake=Math.min(.7,h.R.shake+.12),h.S.hitStop=.03}this.chain.length||(h.FX.float(this.x,3.2,this.z,`COMBO x${this.combo} ROMBO!`,"#ffd34d",28,2),setTimeout(()=>h.FX.float(this.x,3,this.z,"Did you see that Combo Rombo?","#ffd34d",18,2.2),500),this.barkT=4)}return}let a=0;h.grid.query(this.x,this.z,3,Lt);for(let o of Lt)o.dead||a++;if(a>=5&&this.houseCD<=0){this.houseCD=6,this.cd=.8,this.spin=.5,h.grid.query(this.x,this.z,4,Lt);for(let o of Lt)!o.dead&&!o.boss&&h.AI.damage(o,95,this.x,this.z,18,"baton",null);for(let o=0;o<24;o++){let l=o/24*h.TAU;h.FX.sparks(this.x+Math.cos(l)*2.5,.3,this.z+Math.sin(l)*2.5,2,16765773)}h.FX.float(this.x,3.3,this.z,"HOUSE. CLEANED.","#ffd34d",30,2),h.R.shake=.8,h.S.hitStop=.1,h.audio.play("slam",1);return}if(this.comboCD<=0&&t<9){h.grid.query(this.x,this.z,9,Lt);let o=Lt.filter(l=>!l.dead).sort((l,c)=>(l.x-this.x)**2+(l.z-this.z)**2-((c.x-this.x)**2+(c.z-this.z)**2)).slice(0,6);if(o.length>=2){this.chain=o,this.chainT=0,this.combo=0,this.comboCD=h.rand(4,6),h.FX.float(this.x,2.9,this.z,"COMBO ROMBO!","#ffd34d",22,1),h.audio.play("dash");return}}t<2.1&&this.cd<=0&&(this.cd=.4,this.baton(60,2.4,11))}bigBroSlam(){h.grid.query(this.x,this.z,4.5,Lt);for(let e of Lt)!e.dead&&!e.boss&&h.AI.damage(e,70,this.x,this.z,16,"baton",null);h.FX.sparks(this.x,.4,this.z,30,10473727),h.R.shake=.7,h.audio.play("slam",1),h.FX.float(this.x,3,this.z,"BIG BRO SLAM!","#9fd0ff",24,1.6)}calebMoves(e,t,n,s,r){if(this.slammed||(this.slammed=!0,this.bigBroSlam()),this.tackleCD=(this.tackleCD||3)-r,this.tackleT>0){this.tackleT-=r,this.x+=this.tx*17*r,this.z+=this.tz*17*r,h.grid.query(this.x,this.z,1.4,Lt);for(let a of Lt)!a.dead&&!a.tackled&&(a.tackled=!0,h.AI.damage(a,60,this.x,this.z,13,"dash",null));return}if(this.tackleCD<=0&&t>2.5&&t<9){this.tackleCD=h.rand(3.5,5),this.tackleT=.35,this.tx=n,this.tz=s;for(let a of h.AI.list)a.tackled=!1;h.audio.play("dash"),h.FX.float(this.x,2.8,this.z,h.pick(["SHOULDER CHECK!","MOVE!","Tackle, bro!"]),"#9fd0ff",18,1);return}if(t<2.1&&this.cd<=0)this.cd=.5,this.baton(50,2.4,10);else if(t<6&&(this.sprayT-=r,this.sprayT<=0)){this.sprayT=.1,h.FX.cloud(this.x+n,1.4,this.z+s,n*12,s*12,.25),h.grid.query(this.x,this.z,6,Lt);for(let a of Lt){if(a.dead)continue;let o=a.x-this.x,l=a.z-this.z,c=Math.hypot(o,l)||1;(o*n+l*s)/c>.85&&c<6&&(a.ocT=3,h.AI.damage(a,2,this.x,this.z,.5,"oc",null))}}}};function d_(){return h.officers[0]&&h.officers[0].name||"Rookie"}function p_(i,e,t,n){for(let r=0;r<=8;r++){let a=r/8;h.FX.glow.spawn(h.lerp(i,t,a)+h.rand(-.15,.15),1.2+h.rand(-.2,.2),h.lerp(e,n,a)+h.rand(-.15,.15),0,0,0,.18,.09,10479871,0)}}var $n={reset(){for(let i of h.allies)i.remove();h.allies.length=0},call(i,e,t){if(h.allies.some(l=>l.key===i))return!1;let n=h.officers.find(l=>!l.down)||h.officers[0],s=Math.random()*h.TAU,r=n.x+Math.cos(s)*3,a=n.z+Math.sin(s)*3;h.W.blocked(r,a)&&(r=n.x,a=n.z),e!==void 0&&(r=e,a=t);let o=new Zh(i,r,a);if(h.allies.push(o),i==="halley"){for(let l of h.officers)l.down&&(l.down=!1,l.hp=60,l.iframes=2,h.FX.float(l.x,2.6,l.z,"BACK UP!","#7dff6a",18,1.4)),l.rallyT=10;h.R.shake=.5}return o},update(i){for(let e=h.allies.length-1;e>=0;e--)h.allies[e].update(i)||(h.allies[e].remove(),h.allies.splice(e,1))}};h.Allies=$n;var Pn={active:null};h.Boss=Pn;function m_(){let i=(p,y=.7,x=0)=>new ze({color:p,roughness:y,metalness:x}),e={suit:i(3107642,.8),waders:i(3885610,.45,.1),skin:i(14266508,.6),hair:i(3811868,.9),black:i(921102,.3,.4),steel:i(12107976,.2,1)},t=(p,y,x=0,g=0,m=0)=>{let v=new pe(p,y);return v.position.set(x,g,m),v.castShadow=!0,v},n=new ut,s=new ut;n.add(s),s.add(t(new Rn(.27,.42,4,12),e.suit,0,1.1,0)),s.add(t(new rt(.07,.08,.14,8),e.skin,0,1.45,0));let r=new ut;r.position.set(0,1.6,0),s.add(r),r.add(t(new At(.16,18,14),e.skin));for(let p=0;p<9;p++){let y=Math.PI*.55+p/8*Math.PI*.9;r.add(t(new rt(.018,.01,.34,4),e.hair,Math.cos(y)*.15,-.08,Math.sin(y)*.15-.02))}r.add(t(new At(.17,14,8,0,Math.PI*2,0,Math.PI/2.4),e.hair,0,.02,0)),[-.065,.065].forEach(p=>{let y=t(new xn(.05,.012,6,16),e.black,p,.02,.155);r.add(y)}),r.add(t(new Pe(.13,.025,.02),e.hair,0,-.06,.16));let a=(p,y,x,g,m,v)=>{let M=new ut;return M.position.set(p,y,0),M.add(t(new Rn(g,x-g*2,3,8).translate(0,-x/2,0),m)),v&&M.add(t(new At(g*1.05,8,6),v,0,-x,0)),s.add(M),M},o=a(-.34,1.36,.62,.07,e.suit,e.skin),l=a(.34,1.36,.62,.07,e.suit,e.skin),c=a(-.13,.82,.82,.1,e.waders,e.black),u=a(.13,.82,.82,.1,e.waders,e.black),f=new ut;f.position.set(0,-.66,.1),l.add(f),f.add(t(new rt(.015,.015,.5,4),e.steel,0,-.2,0)),f.add(t(new xn(.11,.022,6,14,Math.PI*1.4),e.steel,0,-.5,0));let d=new pe(new Qn(.75,.9,32),new yt({color:8257434,transparent:!0,opacity:.6,toneMapped:!1}));return d.rotation.x=-Math.PI/2,d.position.y=.03,n.add(d),n.scale.setScalar(1.3),{root:n,body:s,head:r,armL:o,armR:l,legL:c,legR:u,ring:d,phase:0}}var Qr=[];Pn.spawn=function(i,e){let t=h.AI.spawn("ripper",i,e);return t.model=m_(),h.R.scene.add(t.model.root),Object.assign(t,{swingT:0,hookT:3,mistT:9,hiddenT:0,calloutT:6,tauntT:4,enraged:!1}),Pn.active=t,h.say("CONTROL",Yr.intro,4),h.audio.play("siren"),h.audio.sting("boss"),h.audio.music("boss",!0),h.R.shake=.6,t};Pn.reset=function(){Pn.active&&Pn.active.model&&h.R.scene.remove(Pn.active.model.root),Pn.active=null,Qr.length=0};Pn.think=function(i,e,t,n){let s=i.hp/i.maxHp,r=s>.66?1:s>.33?2:3;if(i.hookT-=e,i.mistT-=e,i.calloutT-=e,i.tauntT-=e,i.swingCD-=e,i.tauntT<=0&&(i.tauntT=h.rand(6,10),h.FX.float(i.x,3.2,i.z,h.pick(Yr.taunts),"#7dff9a",17,2.4)),r>=2&&h.R.scene.fog.far>34&&(h.R.scene.fog.near=8,h.R.scene.fog.far=32,h.say("CONTROL","Visibility is dropping on Killer Row! Stay together!",3)),r===3&&!i.enraged){i.enraged=!0,i.speed*=1.3;for(let c of h.W.doors)if(!c.opening){h.W.openDoor(c);for(let u=0;u<2;u++)h.AI.spawn("ding",c.spawn.x,c.spawn.z)}h.say("CONTROL","He popped the whole row! Dings everywhere!",3.5)}if(!t)return;if(i.hiddenT>0){if(i.hiddenT-=e,i.hiddenT<=0){let c=h.pick(h.targets);if(c){let u=Math.atan2(c.ax||0,c.az||1)+Math.PI;i.x=c.x+Math.sin(u)*1.8,i.z=c.z+Math.cos(u)*1.8,h.W.collide(i),i.swingT=.001,i.swingCD=0,h.FX.cloud(i.x,1.2,i.z,0,0,1.2,10467496),h.FX.float(i.x,3,i.z,"BEHIND YOU!","#ff5050",22,1.4)}}return}if(r>=2&&i.mistT<=0){i.mistT=h.rand(7,10),i.hiddenT=2.2;for(let c=0;c<8;c++)h.FX.cloud(i.x+h.rand(-1,1),1,i.z+h.rand(-1,1),h.rand(-2,2),h.rand(-2,2),.9,10467496);h.say("RADIO",h.pick(Yr.callouts),2.5);return}let a=t.x-i.x,o=t.z-i.z,l=1/(n||1);if(i.yaw+=h.angDiff(i.yaw,Math.atan2(a,o))*Math.min(1,e*8),i.hookT<=0&&n>4&&n<13&&(i.hookT=r===3?3:5,Qr.push({x:i.x,z:i.z,vx:a*l*20,vz:o*l*20,life:.8,owner:i}),h.audio.play("swing",1)),i.swingT>0){let c=i.swingT;if(i.swingT+=e*(r===3?3.2:2.6),c<.5&&i.swingT>=.5){for(let u of h.targets)(u.x-i.x)**2+(u.z-i.z)**2<7.3&&u.hurt(i.def.dmg*(r===3?1.3:1),i.x,i.z,"ripper",8);h.FX.sparks(i.x+a*l*1.5,1.2,i.z+o*l*1.5,8,10485696)}i.swingT>=1&&(i.swingT=0,i.swingCD=r===3?.5:.9)}else n<2.4&&i.swingCD<=0?i.swingT=.001:n>1.8&&(i.x+=a*l*i.speed*e,i.z+=o*l*i.speed*e,h.W.collide(i));i.move=h.lerp(i.move,n>1.8&&i.swingT===0?1:0,e*8)};Pn.onHit=function(i){i.hiddenT>0&&(i.hiddenT=Math.min(i.hiddenT,.3))};Pn.onDeath=function(i){h.S.slowmo=2.5,h.say("CONTROL",Yr.death,4.5),h.FX.float(i.x,3.4,i.z,"RIVERBANK RIPPER: DOWN","#7dff9a",26,3),h.FX.sparks(i.x,1.2,i.z,60,8257434),h.R.shake=.9,h.Loot.spawn(h.rollItem(3),i.x+1.2,i.z),h.R.scene.fog.near=22,h.R.scene.fog.far=70,h.S.bossDead=!0};Pn.update=function(i){for(let n=Qr.length-1;n>=0;n--){let s=Qr[n];s.life-=i,s.x+=s.vx*i,s.z+=s.vz*i,h.FX.glow.spawn(s.x,1.3,s.z,0,0,0,.12,.07,14217471,0);let r=null;for(let a of h.targets)if((a.x-s.x)**2+(a.z-s.z)**2<.8){r=a;break}if(r){r.hurt(10,s.x,s.z,"hook",0);let a=s.owner.x-r.x,o=s.owner.z-r.z,l=Math.hypot(a,o)||1;r.kvx!==void 0&&(r.kvx+=a/l*16,r.kvz+=o/l*16),h.FX.float(r.x,2.6,r.z,"HOOKED!","#d8f0ff",18,1.2)}(r||s.life<=0||h.W.blocked(s.x,s.z))&&Qr.splice(n,1)}let e=Pn.active;if(!e||!e.model)return;let t=e.model;t.root.visible=!(e.hiddenT>0),si(t,i,e.move||0,e.swingT||0,!1,e.dead?Math.min(1,e.fall):0),t.root.position.set(e.x,0,e.z),t.root.rotation.y=e.yaw,e.flash>0?t.body.children[0].material.emissive.setHex(5583667):t.body.children[0].material.emissive.setHex(0)};var ea=new Set,Ln={x:innerWidth/2,y:innerHeight/2,l:!1,r:!1};addEventListener("keydown",i=>{ea.add(i.code),["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.code)&&!(i.target instanceof HTMLInputElement)&&i.preventDefault()});addEventListener("keyup",i=>ea.delete(i.code));addEventListener("blur",()=>{ea.clear(),Ln.l=Ln.r=!1});addEventListener("mousemove",i=>{Ln.x=i.clientX,Ln.y=i.clientY});addEventListener("mousedown",i=>{i.button===0&&(Ln.l=!0),i.button===2&&(Ln.r=!0)});addEventListener("mouseup",i=>{i.button===0&&(Ln.l=!1),i.button===2&&(Ln.r=!1)});addEventListener("contextmenu",i=>i.preventDefault());var g_={keys:ea,mouse:Ln};h.Input=g_;function tp(){let i=!1;return{kind:"kbm",label:"Keyboard + Mouse",read(e){let t=ea,n=(t.has("KeyD")?1:0)-(t.has("KeyA")?1:0),s=(t.has("KeyS")?1:0)-(t.has("KeyW")?1:0),r=h.R.screenToGround(Ln.x,Ln.y,1.2),a=t.has("ShiftLeft")||t.has("ShiftRight"),o=a&&!i;return i=a,{mx:n,mz:s,ax:r?r.x-e.x:0,az:r?r.z-e.z:0,fire:Ln.l,spray:Ln.r,melee:t.has("Space"),dash:o,sprint:a,ot:t.has("KeyF"),nade:t.has("KeyQ")||t.has("KeyG")}}}}function Kh(i){let e=!1,t=n=>Math.abs(n)<.2?0:n;return{kind:"pad",index:i,label:`Controller ${i+1}`,read(n){let s=h.pads()[i];if(!s)return{mx:0,mz:0,ax:0,az:0};let r=d=>!!(s.buttons[d]&&(s.buttons[d].pressed||s.buttons[d].value>.4)),a=t(s.axes[0]),o=t(s.axes[1]),l=s.axes[2]||0,c=s.axes[3]||0;Math.hypot(l,c)<.3&&(l=a,c=o);let u=r(0)||r(4),f=u&&!e;return e=u,{mx:a,mz:o,ax:l,az:c,fire:r(7),spray:r(6),melee:r(2)||r(5),dash:f,sprint:u,ot:r(1),nade:r(3)}}}}function np(){let i=[],e=h.pads();for(let t=0;t<e.length;t++)e[t]&&i.push(t);return i}var rp=matchMedia("(pointer: coarse)").matches||navigator.maxTouchPoints>0,Bo={enabled:rp,active:!1};h.Touch=Bo;var qi=60,dn={move:null,aim:null},_n={spray:!1,melee:!1,dash:!1,nade:!1,ot:!1},ip=!1,x_=`
#touch { position: fixed; inset: 0; z-index: 5; touch-action: none; user-select: none; -webkit-user-select: none; display: none; }
#touch .base { position: absolute; width: ${qi*2}px; height: ${qi*2}px; margin: -${qi}px 0 0 -${qi}px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); background: rgba(0,0,0,0.18); pointer-events: none; }
#touch .knob { position: absolute; width: 56px; height: 56px; margin: -28px 0 0 -28px; border-radius: 50%; background: rgba(255,255,255,0.55); pointer-events: none; }
#touch .knob.aim { background: rgba(255,90,60,0.7); }
#touch .hint { position: absolute; bottom: 22px; font: 700 12px system-ui, sans-serif; color: rgba(255,255,255,0.45); letter-spacing: 1px; pointer-events: none; }
#touch .btn { position: absolute; width: 74px; height: 74px; border-radius: 50%; display: grid; place-items: center; font: 800 13px system-ui, sans-serif; letter-spacing: 0.5px; color: #fff; border: 2px solid rgba(255,255,255,0.5); background: rgba(20,24,32,0.55); }
#touch .btn.on { background: rgba(255,255,255,0.35); transform: scale(0.94); }
#touch .btn.spray { background: rgba(255,122,26,0.55); }
#touch .btn.nade { background: rgba(80,110,40,0.65); }
#touch .btn.ot { opacity: 0.45; } #touch .btn.ot.ready { opacity: 1; background: rgba(255,200,40,0.75); color: #1a1200; box-shadow: 0 0 18px #ffd24a; }
#touch .btn.pause { width: 46px; height: 46px; top: 10px; right: 12px; font-size: 16px; }
/* Phones: smaller HUD, radio moved up out from under your thumbs. */
@media (max-height: 560px) {
  .pcard { width: 150px !important; padding: 5px 8px !important; }
  .pcard .nm { font-size: 14px !important; }
  .pcard .gear, #joinHint, #toast { display: none !important; }
  #objective { padding: 3px 10px !important; } #objective .t { font-size: 13px !important; } #objective .c { font-size: 10px !important; }
  #fps { display: none; }
  #radio { bottom: auto !important; top: 80px; left: 10px !important; width: min(250px, 32%) !important; padding: 4px 8px !important; }
  #radio .who { font-size: 10px !important; } #radio .txt { font-size: 11px !important; }
  #levelcard { top: 110px !important; } #levelcard .lt { font-size: 26px !important; } #levelcard .lt.alarm { font-size: 30px !important; } #levelcard .ls { font-size: 12px !important; } #bossbar { top: 50px !important; }
  #touch .btn { width: 62px; height: 62px; font-size: 11px; }
  #touch .hint { display: none; }
}
#rotateHint { position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 6; background: rgba(10,12,16,0.9); color: #fff; padding: 14px 18px; border-radius: 10px; font: 700 15px system-ui, sans-serif; text-align: center; display: none; pointer-events: none; }
`;function Xi(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n&&(s.textContent=n),t.appendChild(s),s}function y_(){let i=document.createElement("style");i.textContent=x_,document.head.appendChild(i);let e=Xi("div",null,document.body);e.id="touch";let t=Xi("div","hint",e,"MOVE");t.style.left="18%";let n=Xi("div","hint",e,"AIM + SHOOT");n.style.right="30%";let s=Xi("div",null,document.body,"\u{1F4F1}\u21BB Turn your phone sideways");s.id="rotateHint";let r=(f,d,p,y,x)=>{let g=Xi("div","btn "+f,e,d);g.style.right=y+"px",g.style.bottom=x+"px",g.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),Bo.active=!0,_n[p]=!0,g.classList.add("on");try{g.setPointerCapture(v.pointerId)}catch{}});let m=v=>{v.preventDefault(),_n[p]=!1,g.classList.remove("on")};return g.addEventListener("pointerup",m),g.addEventListener("pointercancel",m),g};r("spray","SPRAY","spray",18,108),r("","BATON","melee",96,30),r("","DASH","dash",18,30);let a=r("ot","OT","ot",174,30),o=r("nade","NADE","nade",96,108);Xi("div","btn pause",e,"II").addEventListener("pointerdown",f=>{f.preventDefault(),f.stopPropagation(),dispatchEvent(new KeyboardEvent("keydown",{code:"Escape"}))}),e.addEventListener("pointerdown",f=>{f.preventDefault(),Bo.active=!0;let d=f.clientX<innerWidth*.45?"move":"aim";if(dn[d])return;let p=Xi("div","base",e),y=Xi("div","knob"+(d==="aim"?" aim":""),e);dn[d]={id:f.pointerId,ox:f.clientX,oy:f.clientY,x:f.clientX,y:f.clientY,base:p,knob:y};try{e.setPointerCapture(f.pointerId)}catch{}sp(dn[d])}),e.addEventListener("pointermove",f=>{for(let d in dn){let p=dn[d];p&&p.id===f.pointerId&&(p.x=f.clientX,p.y=f.clientY,sp(p))}});let c=f=>{for(let d in dn){let p=dn[d];p&&p.id===f.pointerId&&(p.base.remove(),p.knob.remove(),dn[d]=null)}};e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c);let u=()=>{requestAnimationFrame(u);let f=h.S&&h.S.state==="play";if(e.style.display=f?"block":"none",o.style.display=h.S&&h.S.nades?"grid":"none",a.classList.toggle("ready",!!(h.officers&&h.officers.some(d=>d.ot>=100))),s.style.display=f&&innerHeight>innerWidth*1.1?"block":"none",!f){for(let d in dn)dn[d]&&(dn[d].base.remove(),dn[d].knob.remove(),dn[d]=null);_n.spray=_n.melee=_n.dash=_n.nade=_n.ot=!1}};u()}function Jh(i){if(!i)return{x:0,y:0,m:0};let e=(i.x-i.ox)/qi,t=(i.y-i.oy)/qi,n=Math.hypot(e,t);return n>1&&(e/=n,t/=n),{x:e,y:t,m:Math.min(1,n)}}function sp(i){let e=Jh(i);i.base.style.left=i.ox+"px",i.base.style.top=i.oy+"px",i.knob.style.left=i.ox+e.x*qi+"px",i.knob.style.top=i.oy+e.y*qi+"px"}Bo.read=function(){let i=Jh(dn.move),e=Jh(dn.aim),n=(a=>a.m<.15?{x:0,y:0}:a)(i),s=e.m>.25,r=_n.dash&&!ip;return ip=_n.dash,{mx:n.x,mz:n.y,ax:s?e.x:n.x,az:s?e.y:n.y,fire:s,spray:_n.spray,melee:_n.melee,dash:r,sprint:_n.dash,ot:_n.ot,nade:_n.nade}};rp&&y_();var ps=[{key:"lot",title:"Parking Lot, Shift Change",sub:"{hero} parks the lifted truck. Energy drink in hand. Bad feeling.",quota:45,live:60,rate:3,mix:{rat:7,gasser:1.5,diva:.6,crutch:.5},tacos:3,drinks:2,call:"STAFF ASSAULT, STAFF PARKING LOT! ALL AVAILABLE STAFF RESPOND!",rung:0,prea:!0,units:["STAFF PARKING LOT","SALLY PORT","MEDICAL","WILLIAMS UNIT"],lines:[[1,"SERGEANT","Morning, {hero}. Quick heads up: they are in the parking lot."],[7,"{HERO}","I have not even clocked in."],[14,"SERGEANT","Spray them, baton them, and sign the overtime sheet."],[26,"{bernardo}","Hey {hero}, you wanna see how big my truck is? After this. Definitely after this."],[40,"COMPLIANCE","Reminder: your PREA training is overdue. Please complete it during the riot. Yes, the whole damn thing. Yes, the quiz too."]]},{key:"tier",title:"IMU North",sub:"Keys. Energy drinks. A tier full of opinions.",quota:80,live:85,rate:2.8,mix:{rat:5,gasser:2,shank:2,big:.8,diva:1.3,ding:1,wheel:.6,crutch:.8},cells:!0,tacos:3,drinks:3,call:"STAFF ASSAULT, IMU NORTH! STAFF ASSAULT, IMU NORTH! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:2,prea:!0,units:["IMU NORTH","IMU SOUTH","WILLIAMS UNIT","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, the food port is not a suggestion box."],[6,"RADIO",'Control just popped every door in IMU North. Control says "my bad."'],[15,"{caleb}","What's up bro. I'm on my taco break. I'll swing through when I'm done."],[24,"SERGEANT","Watch the cups. Do NOT ask what is in the cups."],[30,"COMPLIANCE","An inmate in IMU North has asked what PREA stands for. Please respond with the full 64-page answer."],[38,"COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one with blood AND piss on it. Initial here, here, and here."],[52,"{dustin}","Cell 14 says your football team is trash. Cell 14 is correct."]]},{key:"yard",title:"The Yard",sub:"Rec time. The weight pit regulars do NOT like being interrupted mid-set.",quota:75,live:75,rate:2.7,mix:{rat:4,big:1.6,cholo:1.2,shank:1.5,gasser:1,wheel:1.2,crutch:1,diva:.8},tacos:3,drinks:3,call:"STAFF ASSAULT, REC YARD! STAFF ASSAULT, WEIGHT PIT! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:1,prea:!0,units:["REC YARD","WEIGHT PIT","IMU SOUTH","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, yard is hot. Do not touch anybody's bench. Do not ask how much they bench. They will tell you."],[9,"RADIO","Tower One reports a fight at the chest press. Tower One is also eating nachos."],[18,"{caleb}","Bro, who left 405 on the bench? Oh wait. Me. That was me."],[30,"COMPLIANCE","Reminder: spotting an inmate requires a signed consent form, two witnesses, and a notary. Do not touch his hips."],[44,"RADIO",'Somebody on the pull-up bar has been "almost done" for forty minutes.'],[58,"{dustin}","That dude in the wheelchair just lapped me. Twice."]]},{key:"night",title:"Lights Out",sub:"IMU North, 0300. Count time. Bring your flashlight and change your underwear.",quota:60,live:45,rate:2,mix:{rat:4,ding:2.5,shank:2,crutch:1,wheel:.7,big:.6},cells:!0,tacos:3,drinks:2,call:"STAFF ASSAULT, IMU NORTH! POWER IS DOWN! ALL STAFF RESPOND WITH LIGHTS!",rung:2,prea:!0,night:!0,units:["IMU NORTH","IMU SOUTH","THE BAR UNITS"],lines:[[2,"SERGEANT","{hero}, generator is down. Facilities duct-taped a flashlight to your gun. Every shot lights them up and burns their eyes."],[10,"RADIO","Count is not clearing. Somebody is hiding. Flash every corner."],[22,"COMPLIANCE","Shining a light into a cell after 2300 requires a Nighttime Illumination Disclosure form. In triplicate. In the dark."],[36,"{caleb}","Bro, I am NOT scared. That was a different noise. That was my knee."],[50,"RADIO","Something in the laundry cart just moved. Nobody check the laundry cart."]]},{key:"row",title:"Supermax: Killer Row",sub:"The famous ones live here. Do not chat. Do not buy the paintings.",quota:70,live:70,rate:2.6,mix:{ding:4,rat:2,shank:2,big:1,gasser:1},cells:!0,tacos:4,drinks:3,call:"STAFF ASSAULT, SUPERMAX! STAFF ASSAULT, KILLER ROW! ALL STAFF RESPOND!",rung:3,crews:1,prea:!0,units:["SUPERMAX","KILLER ROW","THE BAR UNITS","IMU SOUTH"],boss:"ripper",bossAt:.35,lines:[[2,"SERGEANT","{hero}, Killer Row. Stay off the glass, stay off the intercom, and do NOT let them flatter you."],[12,"{halley}","Keep your eyes up, family. The mist plays tricks down here."],[26,"COMPLIANCE","Reminder: serial killers are still entitled to PREA training. They all passed. You failed it twice, dumbass. Retake it Monday."],[44,"RADIO","Somebody on the row ordered forty soups and a clown painting. Commissary says no."]]}];var lt=i=>document.getElementById(i),N=h.S={state:"menu",level:0,kills:0,time:0,hitStop:0,hpMul:1,dmgMul:1},or=new URLSearchParams(location.search),$i=parseInt(or.get("stress")||"0",10)||0;h.R.init(lt("game"));h.FX.init(h.R.scene);h.AI.init(h.R.scene);h.C.init(h.R.scene);var lp=new Uo(h.R.scene,520);h.W.load("lot","Rookie");for(let i=0;i<24;i++)h.AI.spawn(h.pick(["rat","rat","gasser","diva","big"]),h.rand(10,78),h.rand(10,56));var gs=Object.assign({name:"",gender:"male"},h.store.get("mo_player",{}));lt("nameIn").value=gs.name;function cr(i,e,t){let n=lt(i),s=r=>{for(let a of n.children)a.classList.toggle("on",a.dataset.v===String(r))};s(e),n.addEventListener("click",r=>{let a=r.target.closest("button");a&&(s(a.dataset.v),t(a.dataset.v))})}cr("segGender",gs.gender,i=>{gs.gender=i});cr("segQuality",h.settings.quality,i=>{h.settings.quality=i,h.saveSettings(),h.R.applyQuality(i)});cr("segGore",h.settings.gore?1:0,i=>{h.settings.gore=i==="1",h.saveSettings()});cr("segPace",String(h.settings.pace||.8),i=>{h.settings.pace=parseFloat(i),h.saveSettings()});cr("segAudio",h.settings.audio||(h.settings.muted?"off":"all"),i=>h.audio.setMode(i));cr("segCuss",h.settings.cuss?1:0,i=>{h.settings.cuss=i==="1",h.saveSettings()});lt("startBtn").addEventListener("click",iu);lt("nameIn").addEventListener("keydown",i=>{i.key==="Enter"&&iu()});function v_(){let i=tp(),e=Kh(0),t=!1;return{kind:"hybrid",noPad:!1,usesPad(n){return n===0&&!this.noPad},read(n){if(h.Touch.active)return h.Touch.read(n);if(this.noPad)return i.read(n);let s=e.read(n);(Math.abs(s.mx)+Math.abs(s.mz)>0||s.fire||s.spray||s.melee||s.dash)&&(t=!0);let r=i.read(n);return(h.Input.mouse.l||h.Input.mouse.r||Math.abs(r.mx)+Math.abs(r.mz)>0)&&(t=!1),t?s:r}}}function iu(){h.audio.init(),gs.name=h.cleanName(lt("nameIn").value),h.store.set("mo_player",gs);for(let i of h.officers)i.remove();h.officers.length=0,h.officers.push(new jr(0,gs.name,gs.gender,v_())),N.runKills=0,N.rung=-1,N.startLevelIdx=Math.max(0,Math.min(ps.length-1,parseInt(or.get("level")||"1",10)-1)),lt("menu").classList.add("hidden"),lt("hud").classList.remove("hidden"),hp(),ta(N.startLevelIdx||0)}var Yi={},ap=["Rodriguez","Johnson","Nguyen","Martinez","Thompson","Garcia","Williams","Reyes"];function __(i){return h.officers.some(e=>e.device.kind==="pad"&&e.device.index===i||e.device.usesPad&&e.device.usesPad(i))}function M_(){let i=h.pads();for(let e=0;e<i.length;e++){let t=i[e];if(!t)continue;let n=!!(t.buttons[0]&&t.buttons[0].pressed||t.buttons[9]&&t.buttons[9].pressed),s=n&&!Yi[e];if(Yi[e]=n,!s||h.officers.length>=4||e===0&&h.officers[0].device.usesPad&&!(h.Input.keys.size||h.Input.mouse.l)||__(e)&&!(e===0&&h.officers[0].device.usesPad))continue;e===0&&(h.officers[0].device.noPad=!0);let r=h.officers.length,a=h.officers[0],o=new jr(r,ap[Math.random()*ap.length|0],r%2?"female":"male",Kh(e));o.x=a.x+1.2,o.z=a.z+.8,h.officers.push(o),hp(),h.FX.float(o.x,2.8,o.z,`${h.rankName(o).toUpperCase()} CLOCKED IN`,"#"+h.PCOLORS[r].toString(16).padStart(6,"0"),20,2.2),rn("CONTROL",`${h.rankName(o)} is on the tier. The DOC family grows.`,3)}}function b_(i){for(let e of h.officers){if(!e.down)continue;let t=h.officers.find(n=>!n.down&&(n.x-e.x)**2+(n.z-e.z)**2<2.6);t?(e.reviveT+=i,Math.random()<i*4&&h.FX.float(e.x,2.2,e.z,`PICKING UP ${e.name.toUpperCase()}... ${Math.round(e.reviveT*50)}%`,"#7dff6a",14,.5),e.reviveT>=2&&(e.down=!1,e.hp=e.maxHp*.5,e.iframes=1.5,e.reviveT=0,h.FX.float(e.x,2.6,e.z,"BACK UP! DOC FAMILY!","#7dff6a",20,1.6),t.score+=50)):e.reviveT=Math.max(0,e.reviveT-i)}}function ta(i){N.level=i;let e=N.def=Object.assign({},ps[i]);$i&&Object.assign(e,{quota:1e9,live:$i,rate:80}),h.FX.reset(),h.AI.reset(),h.C.reset(),$n.reset(),Yn.reset(),h.Boss.reset();let t=h.W.load(e.key,h.officers[0].name);h.officers.forEach((s,r)=>{s.reset(),s.x=t.start[0]+r*1.2,s.z=t.start[1]}),h.R.camTarget.set(t.start[0],0,t.start[1]),Object.assign(N,{state:"play",kills:0,prea:0,lootWait:0,lootLeft:0,wrangleT:0,wrangleSaid:!1,spawned:0,spawnAcc:0,time:0,doorT:3,radioT:14,lineIdx:0,radio:null,clearT:0,downT:0,halleyUsed:!1,ricardoUsed:!1,ricardoT:or.has("ricardo")?3:0,crewT:h.rand(22,35),assaultT:30,compT:ms?5:Math.random()<.45?h.rand(60,120):0,compDone:0,compFirst:null,compLive:!1,compMissed:!1,compromised:0,compNames:[],bossSpawned:!1,bossDead:!1,slowmo:0,killerT:8}),h.W.alarm=e.cells?1:0,cp(!1);let n=()=>{for(let s=0;s<40;s++){let r=h.rand(4,t.w*2-4),a=h.rand(4,t.h*2-4);if(!h.W.blocked(r,a)&&!h.W.wallAt(r,a))return[r,a]}return t.start};for(let s=0;s<e.tacos;s++)h.C.spawnPickup("taco",...n());for(let s=0;s<e.drinks;s++)h.C.spawnPickup("drink",...n());for(let s=0;s<2;s++)h.C.spawnPickup("zyn",...n());h.C.spawnPickup("chew",...n()),Yn.spawn(zo(0),...Ho(n,t));for(let s=0;s<(e.crews||0);s++){let[r,a]=Ho(n,t);h.AI.spawnCrew(r,a,4),N.spawned+=4}if(e.prea){let[s,r]=Ho(n,t);h.AI.spawn("prea",s,r),N.spawned++}if(t.lifters)for(let[s,r]of t.lifters){let a=h.AI.spawn(h.pick(["big","big","cholo","rat"]),s,r+.9);a.x=s,a.z=r+.9,a.posted=!0,a.crew="weightpit",a.shirtless=!0,a.yaw=Math.PI,N.spawned++}if(t.scares)for(let s of t.scares)s.done=!1;if(["lot","yard","night"].includes(e.key)&&!h.store.get("sa_gold",[]).includes(e.key)&&h.C.spawnPickup("gold",...Ho(n,t)),h.store.get("sa_bigbro",!1)&&setTimeout(()=>{if(N.state==="play"&&$n.call("caleb")){let s=h.allies.find(r=>r.key==="caleb");s&&(s.t=1e9)}},4e3),t.caged){let s=Math.floor(t.caged.length/2)-2;Sd.forEach((r,a)=>{let o=t.caged[s+a],l=h.AI.spawn("killer",(o.i+1)*2,o.j*2+1);Object.assign(l,{caged:!0,killer:r,suit:r.suit,skin:r.skin,hair:r.hair,style:r.style,face:r.face,itemCol:r.item||0,hairOn:!0,x:(o.i+1)*2,z:o.j*2+1,chatT:h.rand(2,8)})})}xs(e.call?"STAFF ASSAULT":e.title,e.title+" \xB7 "+h.t(e.sub,h.officers[0].name),!!e.call,3600),e.call&&(rn("CONTROL",e.call,3.6),na(6)),lr(`Gear: ${rr[N.gun].label} + ${Wi[N.spray].label}`),Xo(),h.levelMusic(),h.R.precompile()}function Ho(i,e){for(let t=0;t<30;t++){let n=i();if((n[0]-e.start[0])**2+(n[1]-e.start[1])**2>196)return n}return i()}function Qh(i){let e=0;for(let n in i)e+=i[n];let t=Math.random()*e;for(let n in i)if(t-=i[n],t<=0)return n;return"rat"}function E_(i){if(N.spawned<N.def.quota&&N.kills<N.def.quota||(N.wrangleT=(N.wrangleT||0)-i,N.wrangleT>0))return;N.wrangleT=1;let e=h.officers.filter(n=>!n.down);if(!e.length)return;let t=0;for(let n of h.AI.list){if(n.dead||n.caged||n.boss)continue;let s=e.some(o=>(o.x-n.x)**2+(o.z-n.z)**2<64),r=Math.hypot(n.x-(n.wx??n.x+99),n.z-(n.wz??n.z));if(n.wx=n.x,n.wz=n.z,n.stuckT=s?0:r<1.2?(n.stuckT||0)+1:Math.max(0,(n.stuckT||0)-1),n.stuckT<4)continue;let a=h.pick(e);for(let o=0;o<30;o++){let l=Math.random()*Math.PI*2,c=h.rand(6,10),u=a.x+Math.sin(l)*c,f=a.z+Math.cos(l)*c;if(!(h.W.blocked(u,f)||!h.W.los(a.x,a.z,u,f))){h.FX.cloud(n.x,1,n.z,0,0,1,9080726),n.x=u,n.z=f,n.vx=n.vz=0,n.posted=!1,n.freezeT=0,n.stuckT=0,n.wx=u,n.wz=f,h.FX.cloud(u,1,f,0,0,1.2,9080726),h.FX.float(u,2.6,f,"EXTRACTED!","#ffcf4a",18,1.6),t++;break}}}t&&!N.wrangleSaid&&(N.wrangleSaid=!0,h.say("CONTROL",h.pick(["We pulled the last one out of his cell. He is coming to you.","Cell extraction complete. Your straggler is incoming.","Found him hiding under his bunk. Sending him out."]),3))}h.rankName=i=>`${ds[Math.max(0,N.rung??0)].rank} ${i.name}`;function cp(i){let e=N.def.rung||0;ds.forEach((a,o)=>{(N.runKills||0)>=a.at&&(e=Math.max(e,o))});let t=N.rung??-1;N.rung=Math.max(t,e);let n=ds[N.rung];if(N.gun=n.gun,N.spray=n.spray,N.nades=n.nades,!i||N.rung===t||t<0)return;let s=h.officers[0]?h.officers[0].name:"Rookie";if(n.rank!==ds[t].rank){xs("PROMOTED",`${n.title.toUpperCase()} ${s.toUpperCase()}`,!1,2600),h.audio.play("win");for(let a of h.officers)a.down||h.FX.float(a.x,3,a.z,`${n.rank} ${a.name}!`,"#ffcf4a",22,2.2)}else h.audio.play("pickup");rn("CONTROL",h.t(n.news||"",s),4),lr(`NEW GEAR: ${rr[n.gun].label} + ${Wi[n.spray].label}${n.nades?" + Grenades (Q / Y / NADE)":""}`)}h.onKill=()=>{N.runKills=(N.runKills||0)+1,cp(!0)};h.showCard=(...i)=>xs(...i);function xs(i,e,t,n){lt("lvlT").textContent=i,lt("lvlT").classList.toggle("alarm",!!t),lt("lvlS").textContent=e,lt("levelcard").classList.add("show"),clearTimeout(xs.h),xs.h=setTimeout(()=>lt("levelcard").classList.remove("show"),n)}function na(i){h.W.alarmT=i,h.audio.play("siren"),h.audio.sting("assault"),document.body.classList.add("assault"),clearTimeout(na.h),na.h=setTimeout(()=>document.body.classList.remove("assault"),i*1e3*.7)}h.levelMusic=function(){if(h.officers.some(i=>i.otT>0))return h.audio.music("overtime",!0);if(h.Boss.active&&!h.Boss.active.dead)return h.audio.music("boss",!0);h.audio.music(N.def?N.def.key:"menu")};function w_(i){if(N.moodT=(N.moodT||0)-i,N.scareMusT=(N.scareMusT||0)-i,N.moodT>0)return;N.moodT=.5;let e=0;for(let n of h.AI.list)if(!(n.dead||n.caged||n.posted)){for(let s of h.officers)if(!s.down&&(n.x-s.x)**2+(n.z-s.z)**2<144){e++;break}}let t=h.W.alarmT>0||e>=14||N.scareMusT>0||h.officers.some(n=>n.down);h.audio.intensity(t?2:e>=3?1:0),h.audio.musicName()==="boss"&&(!h.Boss.active||h.Boss.active.dead)&&h.levelMusic()}var S_=[{what:"laundry",type:"ding",text:"OUT OF THE LAUNDRY CART!",line:"He has been in the laundry cart since TUESDAY."},{what:"vent",type:"crutch",text:"FROM THE CEILING VENT!",line:"How did he get in the vent with a CRUTCH?!"},{what:"mannequin",type:"rat",text:"THE DUMMY MOVED!",line:"That is not the count dummy. That is NOT the count dummy."},{what:"bunk",type:"shank",text:"UNDER THE BUNK!",line:"He was under the bunk. The whole time. Breathing."},{what:"chair",type:"wheel",text:"WHEELCHAIR IN THE DARK!",line:"You hear wheels. Slowly. Getting closer."}];function T_(i){let e=h.W.def;if(!(!e||!e.scares)){for(let t of e.scares){if(t.done)continue;let n=h.officers.find(c=>!c.down&&(c.x-t.x)**2+(c.z-t.z)**2<12);if(!n)continue;t.done=!0;let s=h.pick(S_),r=Math.atan2(n.ax,n.az)+h.rand(-.6,.6),a=n.x+Math.sin(r)*2.2,o=n.z+Math.cos(r)*2.2,l=h.AI.spawn(s.type,h.W.blocked(a,o)?t.x:a,h.W.blocked(a,o)?t.z:o);if(N.spawned++,s.what==="vent"&&(l.hop=2.6,l.vy=0),l.swingCD=.6,l.scareT=1.5,h.FX.float(l.x,2.8,l.z,s.text,"#ff4040",26,1.6),h.R.shake=.9,h.R.split=1,h.R.flashBoost=1,h.audio.play("scare",1),h.audio.intensity(2),N.scareMusT=6,Math.random()<.5)l.countCheck=!0,rn("CONTROL","TIER CHECK! Flash him to clear count! "+s.line,3);else{rn("RADIO",s.line+" He brought friends.",3);for(let c=0;c<3;c++){let u=h.rand(0,h.TAU),f=h.AI.spawn(h.pick(["rat","ding","shank"]),t.x+Math.cos(u)*4,t.z+Math.sin(u)*4);f.x=h.W.blocked(f.x,f.z)?t.x:f.x,f.z=h.W.blocked(f.x,f.z)?t.z:f.z,N.spawned++}}}for(let t of h.AI.list)if(!(!t.countCheck||t.dead))if(t.scareT-=i,t.flashedT>0){t.countCheck=!1,h.FX.float(t.x,2.8,t.z,"COUNT CLEARS! +150","#7dff6a",22,1.6);let n=h.officers.find(s=>!s.down);h.AI.damage(t,9999,n?n.x:t.x,n?n.z:t.z,3,"flash",n||null),n&&(n.score+=150),h.audio.play("count")}else t.scareT<=0&&(t.countCheck=!1,rn("CONTROL","Count did NOT clear. He is loose. Get him.",2.5))}}function A_(i){let e=N.def;if($i||N.spawned>=e.quota||!e.units||(N.assaultT-=i,N.assaultT>0))return;N.assaultT=h.rand(40,55);let t=h.pick(e.units),n=/BAR/.test(t);rn("CONTROL",`STAFF ASSAULT, ${t}! STAFF ASSAULT, ${t}! ALL AVAILABLE STAFF RESPOND!`,3.8),xs("STAFF ASSAULT",t,!0,2600),na(7),n&&setTimeout(()=>{N.state==="play"&&rn("RADIO",h.pick(Rd),3.5)},4e3);let s=h.W.doors.filter(l=>!l.opening);for(let l=0;l<2&&s.length;l++)h.W.openDoor(s.splice(h.randi(0,s.length-1),1)[0]);let r=h.W.spawns.concat(h.W.doors.filter(l=>l.opening).map(l=>l.spawn)),a=r.filter(l=>h.officers.every(c=>(c.x-l.x)**2+(c.z-l.z)**2>64)),o=h.randi(8,14);for(let l=0;l<o&&N.spawned<e.quota&&h.AI.liveCount()<e.live+12;l++){let c=h.pick(a.length?a:r);if(!c)break;h.AI.spawn(n&&Math.random()<.75?"ding":Qh(e.mix),c.x+h.rand(-.6,.6),c.z+h.rand(-.6,.6)),N.spawned++}}var ms=or.has("both")?"both":or.has("caughren")?"caughren":or.has("bingham")?"bingham":null;function R_(i){if($i||!N.compT)return;let e=h.allies.filter(c=>c.passive);if(N.compLive){if(N.compRumorT-=i,N.compRumorT<=0&&e.some(c=>c.state==="cuddle")){N.compRumorT=h.rand(2.5,4);let c=h.AI.list.find(u=>!u.dead&&!u.bf&&Math.random()<.3);c?h.FX.float(c.x,2.8,c.z,h.pick(zd.concat(e.map(u=>`${u.d.back==="COUNSELOR"?"BINGHAM":"CAUGHREN"}! ${u.d.back==="COUNSELOR"?"BINGHAM":"CAUGHREN"}!`))),"#ffb37a",15,2):rn("RADIO",h.pick(zh),2.5)}if(N.compWait-=i,N.compWait<=0)for(let c of e)c.state==="cuddle"&&(c.walkOut("I was never here."),N.compMissed=!0);e.length||(N.compLive=!1);return}if(N.compT-=i,N.compT>0)return;if(N.compT=N.compDone>=2?0:h.rand(70,110),!ms&&N.compDone>=1&&Math.random()<.5){N.compT=0;return}let t=N.compDone===0&&(ms==="both"||!ms&&Math.random()<.15)?["caughren","bingham"]:[ms&&ms!=="both"&&N.compDone===0?ms:N.compFirst?N.compFirst==="caughren"?"bingham":"caughren":h.pick(["caughren","bingham"])];N.compFirst=N.compFirst||t[0],N.compDone+=t.length;let n=h.W.doors.filter(c=>!c.opening),s=n.length?h.pick(n):null,r=h.W.spawns.filter(c=>h.officers.every(u=>(u.x-c.x)**2+(u.z-c.z)**2>100)),a=s?s.spawn:h.pick(r.length?r:h.W.spawns);if(!a)return;s&&h.W.openDoor(s);let o=s?`CELL ${h.randi(10,48)}`:t.length>1?"THE CHAPLAIN'S CLOSET":t[0]==="bingham"?"COUNSELOR'S OFFICE":"THE SUPPLY CLOSET";t.forEach((c,u)=>{let f=a.x+(u?1.6:0),d=a.z,p=h.AI.spawn(h.pick(["big","cholo","rat"]),f+.42,d);p.bf=!0,p.freezeT=999,p.hp*=2.5,p.maxHp=p.hp;let y=$n.call(c,f-.05,d);y&&(y.bf=p)}),N.compLive=!0,N.compWait=40,N.compRumorT=3;let l=t.map(c=>h.CREW[c].toUpperCase()).join(" AND ");rn("CONTROL",t.length>1?`ALL STAFF RESPOND, ${o}. ${l} ARE BOTH IN THERE. TOGETHER. WITH HIM.`:t[0]==="caughren"?`ALL AVAILABLE STAFF RESPOND TO ${o}. C/O CAUGHREN IS NOT ANSWERING HER RADIO. AGAIN.`:`RESPOND TO ${o}. COUNSELOR BINGHAM HAS BEEN IN A 'ONE-ON-ONE' FOR THREE HOURS.`,4.2),xs("STAFF COMPROMISED",`${o} \xB7 ${l}`,!0,3200),na(5),setTimeout(()=>{N.state==="play"&&rn("RADIO",h.pick(zh),3)},4600)}function C_(i){let e=N.def,t=h.AI.liveCount();if(e.cells&&(N.doorT-=i,N.doorT<=0&&N.spawned<e.quota)){N.doorT=h.rand(1.5,3);let s=h.W.doors.filter(r=>!r.opening);if(s.length){let r=h.pick(s);h.W.openDoor(r);let a=h.randi(1,2);for(let o=0;o<a&&N.spawned<e.quota;o++)h.AI.spawn(Qh(e.mix),r.spawn.x,r.spawn.z),N.spawned++}}if(N.spawned>=e.quota||t>=e.live)return;N.spawnAcc+=i*e.rate*($i?1:Math.min(1.6,.7+N.time/60));let n=h.W.spawns.concat(h.W.doors.filter(s=>s.open>=1).map(s=>s.spawn));for(;N.spawnAcc>=1&&N.spawned<e.quota&&h.AI.liveCount()<e.live;){N.spawnAcc-=1;let s=n.filter(a=>h.officers.every(o=>(o.x-a.x)**2+(o.z-a.z)**2>64)),r=h.pick(s.length?s:n);if(!r)break;h.AI.spawn(Qh(e.mix),r.x,r.z),N.spawned++}}h.targets=[];function I_(i){if(!N.halleyUsed&&h.officers.some(t=>t.down||t.hp<25)&&(N.halleyUsed=!0,$n.call("halley")),N.ricardoT>0&&(N.ricardoT-=i)<=0&&(N.ricardoUsed=!0,$n.call("ricardo")),N.calebSwarmCD=(N.calebSwarmCD||0)-i,N.calebSwarmCD<=0&&!h.allies.some(t=>t.key==="caleb"))for(let t of h.officers){if(t.down)continue;let n=0;for(let s of h.AI.list)!s.dead&&!s.caged&&(s.x-t.x)**2+(s.z-t.z)**2<36&&n++;if(n>=12){N.calebSwarmCD=45,$n.call("caleb");break}}if(N.crewT-=i,N.crewT<=0)if(N.crewT=h.rand(35,55),!N.ricardoUsed&&Math.random()<.12)N.ricardoUsed=!0,$n.call("ricardo");else{let t=["caleb","dustin"].filter(n=>!h.allies.some(s=>s.key===n));t.length&&$n.call(h.pick(t))}let e=N.def;if(e.boss&&!N.bossSpawned&&N.kills>=e.quota*e.bossAt){N.bossSpawned=!0;let t=h.W.doors.find(n=>!n.opening)||h.W.doors[0];if(t)h.W.openDoor(t),h.Boss.spawn(t.spawn.x,t.spawn.z);else{let n=h.pick(h.W.spawns);h.Boss.spawn(n.x,n.z)}}}function rn(i,e,t=4){let n=h.officers[0]?h.officers[0].name:"Rookie";N.radio={t},lt("radWho").textContent=h.t(i,n),lt("radTxt").textContent=h.censor(h.t(e,n)),lt("radio").classList.add("show"),h.audio.play("radio")}h.say=rn;function P_(i){let e=N.def.lines;if(N.radio&&(N.radio.t-=i,N.radio.t<=0&&(N.radio=null,lt("radio").classList.remove("show"))),N.lineIdx<e.length&&N.time>=e[N.lineIdx][0]&&!N.radio){let[,t,n]=e[N.lineIdx++];rn(t,n),N.radioT=Math.max(N.radioT,10);return}if(N.def.key==="row"){N.killerT-=i;let t=h.AI.list.filter(n=>n.caged);if(N.killerT<=0&&!N.radio&&t.length){N.killerT=h.rand(9,15);let n=h.pick(t).killer;rn(`INTERCOM \xB7 ${n.name}`,h.pick(n.lines),4);return}for(let n of t){if(n.chatT-=i,n.chatT>0)continue;h.officers.some(r=>!r.down&&(r.x-n.x)**2+(r.z-n.z)**2<49)?(n.chatT=h.rand(6,10),h.FX.float(n.x,2.4,n.z,`${n.killer.name}: ${h.pick(n.killer.lines)}`,"#9fe6b8",14,3)):n.chatT=1}}if(N.radioT-=i,N.radioT<=0&&!N.radio){N.radioT=h.rand(16,26);let[t,n]=h.pick(md);rn(t,n)}}var eu=[];function hp(){let i=lt("players");i.textContent="",eu.length=0;for(let e of h.officers){let t=document.createElement("div");t.className="pcard",t.style.borderLeftColor="#"+h.PCOLORS[e.slot].toString(16).padStart(6,"0");let n=document.createElement("div");n.className="nm";let s=document.createElement("span");s.textContent=h.rankName(e).toUpperCase();let r=document.createElement("span");n.append(s,r);let a=document.createElement("div");a.className="bar hp",a.append(document.createElement("i"));let o=document.createElement("div");o.className="bar en",o.append(document.createElement("i"));let l=document.createElement("div");l.className="bar ot",l.append(document.createElement("i"));let c=document.createElement("div");c.className="buffs";let u=document.createElement("div");u.className="gear",t.append(n,a,o,l,c,u),i.append(t),eu.push({o:e,name:s,score:r,hp:a.firstChild,en:o.firstChild,ot:l.firstChild,bf:c,gear:u,gearKey:""})}}var Go=0,jh=0,Vo=60,Wo=0;function L_(i){for(let s of eu){s.hp.style.width=s.o.hp/s.o.maxHp*100+"%",s.en.style.width=s.o.energy+"%",s.ot.style.width=(s.o.otT>0?s.o.otT/12*100:s.o.ot||0)+"%",s.ot.parentNode.classList.toggle("full",s.o.ot>=100||s.o.otT>0),s.score.textContent=s.o.score+" pts";let r=h.rankName(s.o).toUpperCase();s.name.textContent!==r&&(s.name.textContent=r);let a=[];s.o.otT>0?a.push(`MANDATORY OVERTIME ${Math.ceil(s.o.otT)}s`):s.o.ot>=100&&a.push(s.o.device.kind==="pad"?"OVERTIME READY [B]":s.o.device.kind==="kbm"?"OVERTIME READY [F]":"OVERTIME READY [OT]"),s.o.sprinting&&a.push("SPRINT"),s.o.tacoT>0&&a.push(`TACO POWER ${Math.ceil(s.o.tacoT)}s`),s.o.drinkT>0&&a.push(`ENERGY ${Math.ceil(s.o.drinkT)}s`),s.o.zynT>0&&a.push(`ZYN HEAT ${Math.ceil(s.o.zynT)}s`),s.o.slowT>0&&a.push("GASSED"),s.o.rallyT>0&&a.push(`RALLY ${Math.ceil(s.o.rallyT)}s`),s.o.down&&a.push("DOWN"),s.bf.textContent=a.join(" \xB7 ");let o=Object.values(s.o.gear).map(l=>l?l.name+l.rarity:"-").join("|");if(o!==s.gearKey){s.gearKey=o,s.gear.textContent="";for(let l of Object.keys(ri)){let c=s.o.gear[l],u=document.createElement("span");u.className="chip",u.textContent=c?c.name:`no ${ri[l].label.toLowerCase()}`,u.title=c?`${fn[c.rarity].label} \xB7 ${Yh(c)}`:"Find gear on the map",c&&(u.style.borderColor=fn[c.rarity].css,u.style.color=fn[c.rarity].css),s.gear.append(u)}}}let e=h.Boss.active;lt("bossbar").classList.toggle("hidden",!e||e.dead),e&&!e.dead&&(lt("bossFill").style.width=Math.max(0,e.hp)/e.maxHp*100+"%"),lt("joinHint").classList.toggle("hidden",h.officers.length>=4||!np().length),lt("objT").textContent=N.def.title.toUpperCase();let t=Math.max(0,N.def.quota-N.kills);lt("objC").textContent=$i?`STRESS TEST \xB7 ${h.AI.liveCount()} live`:t>0?`${N.kills} / ${N.def.quota} inmates down`:N.lootLeft>0?`Grab your gear! Clocking out in ${N.lootLeft}s`:`Clear the stragglers: ${h.AI.liveCount()} left`;let n=Math.max(...h.officers.map(s=>s.hurtT));if(lt("vignette").style.opacity=Math.min(1,n*2.2+(h.officers.some(s=>!s.down&&s.hp<30)?.35:0)),Go+=i,jh++,Go>=.5){Vo=Math.round(jh/Go),Go=0,jh=0,lt("fps").textContent=`${Vo} FPS \xB7 ${h.R.qName.toUpperCase()}${h.R.dyn<1?" "+Math.round(h.R.dyn*100)+"%":""} \xB7 ${h.AI.liveCount()} inmates`,$i||h.R.tuneResolution(Vo,.5),Wo=Vo<38&&h.R.dyn<=.6?Wo+.5:0;let s=h.QUALITY_ORDER.indexOf(h.R.qName);Wo>=4&&s>0&&!$i&&(Wo=0,h.R.applyQuality(h.QUALITY_ORDER[s-1]),lr(`Graphics lowered to ${h.R.qName} to keep it smooth`))}}h.toast=i=>lr(i);function lr(i){let e=lt("toast");e.textContent=i,e.classList.add("show"),clearTimeout(lr.h),lr.h=setTimeout(()=>e.classList.remove("show"),2600)}function Zn(i,e,t,n,s){let r=lt("panelCard");if(r.textContent="",s){let c=document.createElement("div");c.className="herostamp",c.textContent=s,r.append(c)}let a=document.createElement("h2");a.textContent=i;let o=document.createElement("p");o.className="sub",o.textContent=h.censor(e),r.append(a,o);let l=document.createElement("div");if(l.className="btns",n.forEach(([c,u,f])=>{let d=document.createElement("button");d.className="go"+(f?" ghost":""),d.textContent=c,d.onclick=u,l.append(d)}),r.append(l),Zn.primary=n[0]&&n[0][1],t){let c=document.createElement("div");c.className="stats";for(let[u,f]of t){let d=document.createElement("div");d.textContent=u;let p=document.createElement("div");p.textContent=f,c.append(d,p)}r.append(c)}r.scrollTop=0,lt("panel").classList.remove("hidden")}function Xo(){lt("panel").classList.add("hidden")}function qo(){Xo(),N.state="menu",up(),h.audio.duck(!1),h.audio.music("menu"),lt("hud").classList.add("hidden"),lt("menu").classList.remove("hidden")}function up(){let i=h.board.list(),e=lt("boardRows");lt("board").classList.toggle("hidden",!i.length),e.textContent="",i.slice(0,8).forEach((t,n)=>{let s=document.createElement("div");s.textContent=`${n+1}. ${t.name}`;let r=document.createElement("div");r.textContent=`${t.areaName} \xB7 ${t.kills} down \xB7 ${t.rank}`,e.append(s,r)})}up();function fp(i){let e=N.level+(i?1:0),t=i&&N.level>=ps.length-1?"SURVIVED THE SHIFT":i?`Cleared ${ps[N.level].title}`:`Got to ${ps[N.level].title}`;for(let n of h.officers)h.board.record({name:h.cleanName(n.name),area:e,areaName:t,kills:N.runKills||0,score:n.score,rank:ds[N.rung||0].title,date:new Date().toISOString().slice(0,10)})}var tu=()=>[["\u2014\u2014 SHIFT BOARD \u2014\u2014",""]].concat(h.board.list().slice(0,5).map((i,e)=>[`${e+1}. ${i.name}`,i.areaName])),ar={force:["An inappropriate amount","Yes","Enough to need a second form","Fists, feet, a taco, and a time clock","Whatever was closest","All of it. Every bit."],fluids:["Yes (all of them)","Spit, piss, and something from a cup we are not naming","Too many to list. See attached 9 pages.","Cup contents: unknown. Smell: known.","Yes. On the PREA poster. Again."],reason:['"Your mom"','"He looked at me funny"','"I was bored as shit"','"I wanted to see the hot nurse"','"Commissary was out of hot Cheetos"','"Bro I thought it was rec"','"It was a Tuesday"'],witness:["Tower One (asleep)","Control (on TikTok)","Inmate in cell 14 (lying)","A rat. The animal kind.","Nobody. Everybody. Big Mike."],injuries:["Bruised ego, busted lip, pride","Bit on the ass. Medical laughed.","Got gassed. Shirt is evidence now.","Pulled a hammy. Not from the fight.","Emotional. Do not ask."],sig:["Sgt. (drew a dick instead)","Illegible. Smells like Zyn.","Signed in taco sauce",'"Mandatory OT" written 40 times',"Signed. Then cried."]},nu=()=>[...h.officers.flatMap(i=>[[`${h.rankName(i)}: inmates down`,String(i.kills)],[`${h.rankName(i)}: score`,String(i.score)]]),["Rank",ds[N.rung||0].title],["Force used",h.pick(ar.force)],["Bodily fluids involved",h.pick(ar.fluids)],["Inmate's stated reason",h.pick(ar.reason)],["Witnesses",h.pick(ar.witness)],["Staff injuries",h.pick(ar.injuries)],["Fake PREA claims yelled",String(N.prea||0)],...N.compromised?[["Staff compromised",`${N.compromised} (${N.compNames.join(", ")}. Paternity: pending.)`]]:N.compMissed?[["Staff compromised","Unverified. Baby shower still on."]]:[],["Real PREA claims","0 (filed 14 pages anyway)"],["Supervisor signature",h.pick(ar.sig)]].map(([i,e])=>[i,h.censor(e)]);function D_(){N.state="clear",h.audio.sting("clear"),h.audio.music("menu"),fp(!0),h.audio.play("win"),N.level>=ps.length-1?Zn("SHIFT SURVIVED","The Riverbank Ripper is back in his cell. Built for Sgt. Halley Munoz, Caleb Alaniz, Dustin Davis, and all my Correctional Officer homies back home. You are the real heroes. One DOC family. Stay safe out there.",nu().concat(tu()),[["PLAY AGAIN",()=>{N.runKills=0,N.rung=-1,ta(0)}],["MENU",qo,!0]],"HERO OF THE DOC"):Zn(`${N.def.title.toUpperCase()}: CLEARED`,h.pick(["INCIDENT REPORT #"+h.randi(1e3,9999)+". Sarge says good job. Sarge also says stay late.","INCIDENT REPORT. Somebody hose that shit down.","INCIDENT REPORT. Overtime approved. Sleep denied. Dignity: also denied.","INCIDENT REPORT. The DOC family thanks you. Payroll says fuck you."]),nu().concat(tu()),[["NEXT AREA",()=>ta(N.level+1)],["MENU",qo,!0]],"HERO OF THE DOC")}function N_(){N.state="over",h.audio.sting("over"),h.audio.music("menu"),fp(!1),Zn("YOU GOT MANDOWED",h.pick(["Medical is on the way. Medical is also on break.","The inmates are filing a grievance about how easy that was.","Your truck has been towed from the fire lane."]),nu().concat(tu()),[["RETRY AREA",()=>ta(N.level)],["MENU",qo,!0]])}addEventListener("keydown",i=>{if((i.code==="Enter"||i.code==="NumpadEnter")&&(N.state==="clear"||N.state==="over")&&Zn.primary){i.preventDefault();let e=Zn.primary;Zn.primary=null,e()}});addEventListener("keydown",i=>{if(i.code==="Escape")if(N.state==="play"){N.state="pause",h.audio.duck(!0);let e=h.officers.flatMap(t=>Object.keys(ri).map(n=>{let s=t.gear[n];return[`${t.name} \xB7 ${ri[n].label}`,s?`${s.name} (${fn[s.rarity].label})`:"none yet"]}));Zn("PAUSED",'Taking a smoke break. Officially a "wellness check."',e,[["RESUME",()=>{Xo(),N.state="play",h.audio.duck(!1)}],["QUIT TO MENU",qo,!0]])}else N.state==="pause"&&(Xo(),N.state="play",h.audio.duck(!1))});var op=performance.now();h.audio.music("menu");function dp(i){requestAnimationFrame(dp);let e=Math.min(.05,(i-op)/1e3),t=e;if(op=i,e*=h.PACE(),N.hitStop>0&&(N.hitStop-=e,e*=.15),N.slowmo>0&&(N.slowmo-=e,e*=.3),N.state==="play"){N.time+=e,h.targets.length=0;for(let r of h.officers)r.down||h.targets.push(r);for(let r of h.allies)!r.leaving&&!r.passive&&h.targets.push(r);h.W.buildFlowT=(h.W.buildFlowT||0)-e,h.W.buildFlowT<=0&&(h.W.buildFlowT=.2,h.W.buildFlow(h.targets)),h.AI.update(e);for(let r of h.officers)r.update(e);$n.update(e),h.Boss.update(e),I_(e),M_(),b_(e),h.C.update(e,i/1e3),Yn.update(e,i/1e3),C_(e),E_(e),T_(e),A_(e),R_(e),P_(e),L_(t),w_(t),h.officers.every(r=>r.down)?(N.downT+=e,N.downT>2.5&&N_()):(N.downT=0,N.kills>=N.def.quota&&h.AI.liveCount()===0&&(!N.def.boss||N.bossDead)&&(Yn.drops.length&&(N.lootWait||0)<20?(N.lootWait||(rn("CONTROL","Area secure. There is gear on the floor, go grab it before you clock out.",4),h.audio.play("pickup")),N.lootWait=(N.lootWait||0)+t,N.lootLeft=Math.ceil(20-N.lootWait)):(Yn.drops.length&&Yn.collectAll(),N.lootLeft=0,N.clearT+=e,N.clearT>1.5&&D_())))}else if((N.state==="clear"||N.state==="over")&&Zn.primary){let r=h.pads();for(let a=0;a<r.length;a++){let o=r[a],l=!!(o&&o.buttons[0]&&o.buttons[0].pressed);if(l&&!Yi[a]){Yi[a]=l;let c=Zn.primary;Zn.primary=null,c();break}Yi[a]=l}}else if(N.state==="menu"){h.AI.update(e);let r=h.pads();for(let a=0;a<r.length;a++){let o=r[a],l=!!(o&&o.buttons[0]&&o.buttons[0].pressed);if(l&&!Yi[a]&&document.activeElement!==lt("nameIn")){Yi[a]=l,iu();break}Yi[a]=l}}h.R.updateFlash(e),h.W.update(e,i/1e3),h.FX.update(e),lp.sync(h.AI.list);let s=h.officers.filter(r=>!r.down);if(N.state!=="menu"&&s.length){let r=s.reduce((l,c)=>l+c.x,0)/s.length,a=s.reduce((l,c)=>l+c.z,0)/s.length,o=Math.max(0,...s.map(l=>Math.hypot(l.x-r,l.z-a)));h.R.follow(r,a,e,1+o/18)}else{let r=i/1e3;h.R.follow(44+Math.sin(r*.1)*22,34+Math.cos(r*.13)*10,e,1.1)}h.R.render(i/1e3)}requestAnimationFrame(dp);h.startLevel=ta;h.crowd=lp;window.G=h;
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
