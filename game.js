var h={};h.BRAND={game:"STAFF ASSAULT",sub:"Killer Row",alarm:"Body Alarm"};h.CREW={bernardo:"Bernardo",dustin:"Dustin Davis",caleb:"Caleb Alaniz",halley:"Sgt. Halley Munoz",halleyShort:"Sgt. Munoz",ricardo:"Counselor Ricardo Alaniz",caughren:"C/O Caughren",bingham:"Counselor Bingham"};h.TAU=Math.PI*2;h.rand=(i,e)=>i+Math.random()*(e-i);h.randi=(i,e)=>Math.floor(i+Math.random()*(e-i+1));h.pick=i=>i[Math.random()*i.length|0];h.clamp=(i,e,t)=>i<e?e:i>t?t:i;h.lerp=(i,e,t)=>i+(e-i)*t;h.angDiff=(i,e)=>{let t=(e-i)%h.TAU;return t>Math.PI&&(t-=h.TAU),t<-Math.PI&&(t+=h.TAU),t};h.store={get(i,e){try{let t=localStorage.getItem(i);return t==null?e:JSON.parse(t)}catch{return e}},set(i,e){try{localStorage.setItem(i,JSON.stringify(e))}catch{}}};var Ip=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches;h.settings=Object.assign({quality:Ip?"medium":"high",gore:!0,cuss:!0,muted:!1,pace:.8},h.store.get("mo_settings",{}));h.censor=i=>h.settings.cuss?i:i.replace(/\b(f)uck|\b(s)hit|\b(b)itch|\b(a)ss\b/gi,e=>e[0]+"*".repeat(e.length-1));h.PACE=()=>h.settings.pace||.8;h.board={list(){let i=h.store.get("sa_board",[]);return Array.isArray(i)?i:[]},record(i){let e=this.list(),t=String(i.name).toLowerCase(),n=e.findIndex(r=>String(r.name).toLowerCase()===t),s=(r,a)=>r.area>a.area||r.area===a.area&&r.score>a.score;n<0?e.push(i):s(i,e[n])&&(e[n]=i),e.sort((r,a)=>a.area-r.area||a.score-r.score),h.store.set("sa_board",e.slice(0,15))}};h.saveSettings=()=>h.store.set("mo_settings",h.settings);h.cleanName=i=>String(i||"").replace(/[\u0000-\u001f\u007f{}<>]/g,"").trim().slice(0,14)||"Rookie";h.t=(i,e)=>String(i).replace(/\{hero\}/g,e||"Rookie").replace(/\{HERO\}/g,(e||"Rookie").toUpperCase()).replace(/\{(bernardo|dustin|caleb|halley|halleyShort)\}/g,(t,n)=>h.CREW[n]);h.grid={cell:2,map:new Map,used:[],clear(){for(let i of this.used)i.length=0;this.used.length=0},key(i,e){return(i+2048)*8192+(e+2048)},insert(i){let e=this.key(Math.floor(i.x/this.cell),Math.floor(i.z/this.cell)),t=this.map.get(e);t||(t=[],this.map.set(e,t)),t.length===0&&this.used.push(t),t.push(i)},query(i,e,t,n){n.length=0;let s=this.cell,r=Math.floor((i-t)/s),a=Math.floor((i+t)/s),o=Math.floor((e-t)/s),l=Math.floor((e+t)/s);for(let c=r;c<=a;c++)for(let u=o;u<=l;u++){let d=this.map.get(this.key(c,u));if(d)for(let f=0;f<d.length;f++)n.push(d[f])}return n}};h.QUALITY={low:{pixel:.75,shadows:!1,shadowMap:0,bloom:!1,ao:!1,grade:!1,dust:0,particles:500,decals:150},medium:{pixel:1,shadows:!0,shadowMap:1024,bloom:!1,ao:!1,grade:!0,dust:120,particles:900,decals:250},high:{pixel:1,shadows:!0,shadowMap:2048,bloom:!0,ao:!1,grade:!0,dust:250,particles:1500,decals:400},ultra:{pixel:1.25,shadows:!0,shadowMap:4096,bloom:!0,ao:!0,grade:!0,dust:400,particles:2500,decals:600}};h.QUALITY_ORDER=["low","medium","high","ultra"];h.pads=function(){try{return navigator.getGamepads&&navigator.getGamepads()||[]}catch{return[]}};var ee={ctx:null,master:null,sfx:null,mus:null,noiseBuf:null,last:{}};h.audio=ee;var ra=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,Pp=.55,xu=.34,Qo=()=>h.settings.audio||(h.settings.muted?"off":"all");ee.init=function(){if(ee.ctx){ee.wake();return}let i=window.AudioContext||window.webkitAudioContext;if(!i)return;try{ee.ctx=new i({latencyHint:"interactive"})}catch{try{ee.ctx=new i}catch{return}}try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}let e=ee.ctx,t=e.createDynamicsCompressor();t.threshold.value=-14,t.ratio.value=5,t.attack.value=.004,t.release.value=.2,ee.master=e.createGain(),ee.master.gain.value=1,ee.sfx=e.createGain(),ee.mus=e.createGain(),ee.sfx.connect(ee.master),ee.mus.connect(ee.master),ee.master.connect(t),t.connect(e.destination),ee.echo=e.createDelay(1.5),ee.echoFb=e.createGain(),ee.echoFb.gain.value=.28;let n=e.createBiquadFilter();n.type="lowpass",n.frequency.value=2400,ee.echoIn=e.createGain(),ee.echoIn.gain.value=.35,ee.echoIn.connect(ee.echo),ee.echo.connect(n),n.connect(ee.echoFb),ee.echoFb.connect(ee.echo),n.connect(ee.mus);let s=e.sampleRate*2;ee.noiseBuf=e.createBuffer(1,s,e.sampleRate);let r=ee.noiseBuf.getChannelData(0);for(let a=0;a<s;a++)r[a]=Math.random()*2-1;try{let a=e.createBufferSource();a.buffer=e.createBuffer(1,1,22050),a.connect(e.destination),a.start(0)}catch{}ee.applyMode(),qe.timer=setInterval(Op,25),qe.want&&ee.music(qe.want,!0)};ee.wake=function(){ee.ctx&&ee.ctx.state!=="running"&&!document.hidden&&ee.ctx.resume().catch(()=>{})};var Lp=()=>ee.init();["pointerdown","touchend","keydown","mousedown"].forEach(i=>addEventListener(i,Lp,{passive:!0}));document.addEventListener("visibilitychange",()=>{ee.ctx&&(document.hidden?ee.ctx.suspend().catch(()=>{}):ee.wake())});ee.applyMode=function(){if(!ee.ctx)return;let i=Qo(),e=ee.ctx.currentTime;ee.sfx.gain.setTargetAtTime(i==="off"?0:Pp,e,.05),ee.mus.gain.setTargetAtTime(i==="all"?qe.ducked?xu*.35:xu:0,e,.08)};ee.setMode=function(i){h.settings.audio=i,h.settings.muted=i==="off",h.saveSettings(),ee.applyMode()};ee.setMuted=function(i){ee.setMode(i?"off":"all")};ee.duck=function(i){qe.ducked=!!i,ee.applyMode()};function yu(i,e,t,n,s,r){i.gain.setValueAtTime(1e-4,e),i.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),e+s),r&&i.gain.setValueAtTime(Math.max(2e-4,n),e+Math.max(s,t-r)),i.gain.exponentialRampToValueAtTime(1e-4,e+t)}function nt(i,e,t,n=ee.sfx){let s=ee.ctx,r=s.createBufferSource();r.buffer=ee.noiseBuf,r.playbackRate.value=t.rate||1;let a=s.createBiquadFilter();a.type=t.type||"bandpass",a.frequency.setValueAtTime(t.freq||1e3,i),t.freqEnd&&a.frequency.exponentialRampToValueAtTime(t.freqEnd,i+e),a.Q.value=t.q||1;let o=s.createGain();yu(o,i,e,t.gain||.3,t.attack||.002),r.connect(a),a.connect(o),o.connect(n),r.start(i,Math.random()*1.5),r.stop(i+e+.05)}function ke(i,e,t,n=ee.sfx){let s=ee.ctx,r=s.createOscillator();if(r.type=t.type||"sine",r.frequency.setValueAtTime(t.freq||440,i),t.freqEnd&&r.frequency.exponentialRampToValueAtTime(t.freqEnd,i+(t.glide||e)),t.detune&&(r.detune.value=t.detune),t.vib){let l=s.createOscillator(),c=s.createGain();l.frequency.value=t.vib,c.gain.value=t.vibAmt||12,l.connect(c),c.connect(r.detune),l.start(i+.15),l.stop(i+e+.05)}let a=s.createGain();yu(a,i,e,t.gain||.2,t.attack||.004,t.release);let o=r;if(t.lp){let l=s.createBiquadFilter();l.type="lowpass",l.Q.value=t.q||1,l.frequency.setValueAtTime(t.lp,i),t.lpEnd&&l.frequency.exponentialRampToValueAtTime(t.lpEnd,i+(t.lpTime||e)),r.connect(l),o=l}o.connect(a),a.connect(n),t.echo&&ee.echoIn&&a.connect(ee.echoIn),r.start(i),r.stop(i+e+.05)}var aa=i=>440*Math.pow(2,(i-69)/12),vu={pop:{gap:45,f:(i,e)=>{nt(i,.05,{freq:2600,q:1.5,gain:.28*e}),ke(i,.07,{type:"square",freq:520,freqEnd:150,gain:.1*e,lp:2e3}),nt(i+.01,.09,{type:"highpass",freq:5e3,gain:.08*e})}},thoomp:{gap:120,f:(i,e)=>{ke(i,.3,{freq:120,freqEnd:40,gain:.75*e}),nt(i,.22,{type:"lowpass",freq:900,freqEnd:150,gain:.45*e}),nt(i,.03,{type:"highpass",freq:3e3,gain:.3*e})}},shotgun:{gap:150,f:(i,e)=>{nt(i,.4,{type:"lowpass",freq:3800,freqEnd:260,gain:.85*e}),ke(i,.18,{freq:85,freqEnd:32,gain:.7*e}),nt(i,.025,{type:"highpass",freq:2500,gain:.5*e}),nt(i+.3,.035,{type:"highpass",freq:3200,q:2,gain:.22*e}),nt(i+.38,.05,{freq:1500,q:3,gain:.25*e})}},rifle:{gap:60,f:(i,e)=>{nt(i,.05,{type:"highpass",freq:1800,gain:.55*e}),nt(i,.16,{freq:700,freqEnd:250,q:.8,gain:.3*e}),ke(i,.07,{freq:150,freqEnd:55,gain:.4*e})}},beam:{gap:110,f:(i,e)=>{ke(i,.12,{type:"sawtooth",freq:1400,freqEnd:2200,gain:.04*e,lp:3e3}),nt(i,.1,{type:"highpass",freq:6e3,gain:.07*e})}},swing:{gap:60,f:(i,e)=>nt(i,.17,{freq:1100,freqEnd:260,q:.9,gain:.28*e})},crack:{gap:55,f:(i,e)=>{nt(i,.05,{type:"highpass",freq:1800,gain:.55*e}),ke(i,.13,{freq:110,freqEnd:42,gain:.5*e}),nt(i,.09,{freq:450,q:1.2,gain:.3*e})}},clock:{gap:90,f:(i,e)=>{[1568,2349,3136].forEach((t,n)=>ke(i,.9-n*.2,{freq:t,gain:(.16-n*.04)*e,attack:.002})),ke(i,.25,{freq:90,freqEnd:40,gain:.7*e}),nt(i,.12,{freq:900,q:2,gain:.4*e})}},slam:{gap:300,f:(i,e)=>{ke(i,.6,{freq:70,freqEnd:28,gain:.9*e}),nt(i,.5,{type:"lowpass",freq:1500,freqEnd:120,gain:.6*e})}},spray:{gap:90,f:(i,e)=>nt(i,.16,{type:"highpass",freq:2800,gain:.13*e,attack:.02})},splat:{gap:50,f:(i,e)=>nt(i,.18,{freq:400,freqEnd:120,q:2,gain:.35*e})},thud:{gap:35,f:(i,e)=>{ke(i,.12,{freq:140,freqEnd:50,gain:.45*e}),nt(i,.08,{freq:500,gain:.25*e})}},hurt:{gap:180,f:(i,e)=>{ke(i,.18,{type:"sawtooth",freq:230,freqEnd:110,gain:.13*e,lp:1400}),nt(i,.08,{freq:800,gain:.2*e})}},dash:{gap:100,f:(i,e)=>nt(i,.22,{freq:1600,freqEnd:400,gain:.22*e})},boom:{gap:80,f:(i,e)=>{nt(i,.7,{type:"lowpass",freq:1600,freqEnd:90,gain:.8*e}),ke(i,.45,{freq:95,freqEnd:28,gain:.8*e}),nt(i+.05,.9,{type:"lowpass",freq:500,freqEnd:60,gain:.3*e})}},zap:{gap:90,f:(i,e)=>{ke(i,.18,{type:"sawtooth",freq:1800,freqEnd:600,gain:.12*e}),nt(i,.15,{type:"highpass",freq:4e3,gain:.25*e})}},pickup:{gap:60,f:(i,e)=>{ke(i,.08,{type:"triangle",freq:660,gain:.2*e}),ke(i+.07,.14,{type:"triangle",freq:990,gain:.2*e})}},zyn:{gap:100,f:(i,e)=>{nt(i,.03,{type:"highpass",freq:4e3,gain:.3*e}),nt(i+.06,.5,{type:"highpass",freq:5e3,gain:.1*e,attack:.05}),ke(i+.04,.2,{type:"triangle",freq:880,freqEnd:1320,gain:.15*e})}},chew:{gap:100,f:(i,e)=>{nt(i,.05,{freq:600,q:2,gain:.3*e}),nt(i+.18,.14,{freq:1800,freqEnd:600,q:1.5,gain:.35*e})}},gold:{gap:300,f:(i,e)=>[1047,1319,1568,2093,2637].forEach((t,n)=>ke(i+n*.06,.4,{type:"triangle",freq:t,gain:.14*e,echo:!0}))},siren:{gap:2500,f:(i,e)=>{for(let t=0;t<4;t++)ke(i+t*.5,.25,{type:"square",freq:980,gain:.08*e,lp:3e3}),ke(i+t*.5+.25,.25,{type:"square",freq:740,gain:.08*e,lp:3e3})}},radio:{gap:300,f:(i,e)=>{nt(i,.09,{freq:1800,q:4,gain:.08*e}),ke(i,.05,{type:"square",freq:1400,gain:.04*e})}},alarm:{gap:900,f:(i,e)=>{for(let t=0;t<3;t++)ke(i+t*.28,.24,{type:"square",freq:880,freqEnd:660,gain:.07*e,lp:2500})}},scare:{gap:600,f:(i,e)=>{[1180,1250,1325,1405].forEach(t=>ke(i,.9,{type:"sawtooth",freq:t,freqEnd:t*.7,gain:.05*e,lp:4e3})),ke(i,.5,{freq:55,gain:.7*e}),nt(i,.4,{freq:3e3,freqEnd:900,q:3,gain:.25*e})}},count:{gap:400,f:(i,e)=>[784,1047,1319].forEach((t,n)=>ke(i+n*.08,.3,{type:"triangle",freq:t,gain:.16*e}))},win:{gap:900,f:(i,e)=>[523,659,784,1046].forEach((t,n)=>ke(i+n*.12,.3,{type:"triangle",freq:t,gain:.2*e}))}};ee.play=function(i,e=1){if(!ee.ctx||Qo()==="off"||ee.ctx.state!=="running")return;let t=vu[i];if(!t)return;let n=performance.now();ee.last[i]&&n-ee.last[i]<t.gap||(ee.last[i]=n,t.f(ee.ctx.currentTime+.005,e))};var Sn={kick:(i,e,t,n)=>{ke(i,.32,{freq:165,freqEnd:42,glide:.12,gain:.95*n},ee.mus),nt(i,.02,{type:"highpass",freq:2500,gain:.12*n},ee.mus)},heart:(i,e,t,n)=>{ke(i,.25,{freq:80,freqEnd:38,gain:.85*n,lp:300},ee.mus)},snare:(i,e,t,n)=>{nt(i,.2,{freq:1900,q:.7,gain:.5*n},ee.mus),ke(i,.1,{type:"triangle",freq:200,freqEnd:150,gain:.3*n},ee.mus)},clap:(i,e,t,n)=>{for(let s=0;s<3;s++)nt(i+s*.011,.12-s*.02,{freq:1300,q:1.1,gain:.42*n},ee.mus)},hat:(i,e,t,n)=>nt(i,.045,{type:"highpass",freq:7600,gain:.17*n},ee.mus),ohat:(i,e,t,n)=>nt(i,.26,{type:"highpass",freq:7e3,gain:.13*n},ee.mus),crash:(i,e,t,n)=>nt(i,1.6,{type:"highpass",freq:4500,gain:.16*n,attack:.003},ee.mus),tom:(i,e,t,n)=>{ke(i,.4,{freq:e||110,freqEnd:(e||110)*.55,gain:.75*n},ee.mus),nt(i,.05,{freq:600,gain:.15*n},ee.mus)},bass:(i,e,t,n)=>{ke(i,t,{type:"sawtooth",freq:e,gain:.32*n,lp:1400,lpEnd:220,lpTime:t*.8,q:5},ee.mus),ra||ke(i,t,{type:"square",freq:e/2,gain:.12*n,lp:400},ee.mus)},sub:(i,e,t,n)=>{ke(i,t,{freq:e*1.5,freqEnd:e,glide:.06,gain:.7*n,release:.12},ee.mus),ke(i,t,{type:"triangle",freq:e*2,gain:.08*n,lp:600},ee.mus)},chipb:(i,e,t,n)=>ke(i,t*.8,{type:"square",freq:e,gain:.13*n,lp:2500},ee.mus),stab:(i,e,t,n)=>[1,1.5,2].forEach(s=>ke(i,Math.min(t,.22),{type:"sawtooth",freq:e*s,gain:.08*n,lp:2600,lpEnd:500,q:2},ee.mus)),pluck:(i,e,t,n)=>ke(i,.3,{type:"triangle",freq:e,gain:.13*n,lp:3e3,lpEnd:600,echo:!0},ee.mus),brass:(i,e,t,n)=>{let s={type:"sawtooth",freq:e,gain:.11*n,attack:.03,lp:600,lpEnd:2600,lpTime:.08,q:2,vib:5.5,vibAmt:8,echo:!0};ke(i,t,s,ee.mus),ra||ke(i,t,Object.assign({},s,{detune:9,gain:.07*n}),ee.mus)},chip:(i,e,t,n)=>ke(i,t*.9,{type:"square",freq:e,gain:.09*n,vib:6,vibAmt:10,echo:!0,lp:5e3},ee.mus),lead:(i,e,t,n)=>ke(i,t,{type:"sawtooth",freq:e,gain:.08*n,lp:3500,q:3,vib:5,vibAmt:6,echo:!0},ee.mus),bell:(i,e,t,n)=>{ke(i,2.2,{freq:e,gain:.12*n,echo:!0},ee.mus),ke(i,1.2,{freq:e*2.76,gain:.04*n},ee.mus)},pad:(i,e,t,n)=>e.forEach(s=>{ke(i,t,{type:"sawtooth",freq:s,gain:.035*n,attack:t*.3,release:t*.3,lp:900,echo:!0,detune:-6},ee.mus),ra||ke(i,t,{type:"sawtooth",freq:s,gain:.03*n,attack:t*.3,release:t*.3,lp:900,detune:7},ee.mus)}),choir:(i,e,t,n)=>e.forEach(s=>{ke(i,t,{type:"triangle",freq:s,gain:.07*n,attack:t*.35,release:t*.35,vib:4.5,vibAmt:14,echo:!0},ee.mus),ra||ke(i,t,{type:"triangle",freq:s*2,gain:.02*n,attack:t*.4,release:t*.3,vib:4,vibAmt:10},ee.mus)}),drone:(i,e,t,n)=>{ke(i,t,{type:"sawtooth",freq:e[0]/2,gain:.08*n,attack:t*.4,release:t*.4,lp:260},ee.mus),ke(i,t,{freq:e[0],gain:.08*n,attack:t*.3,release:t*.4,vib:.3,vibAmt:25},ee.mus)},scrape:(i,e,t,n)=>nt(i,1.4,{freq:2600,freqEnd:700,q:9,gain:.08*n,attack:.4},ee.mus)},Dp={minor:[0,2,3,5,7,8,10],harm:[0,2,3,5,7,8,11],major:[0,2,4,5,7,9,11],phryg:[0,1,3,5,7,8,10]},jo={menu:{bpm:86,root:45,scale:"minor",swing:.14,chords:[0,5,2,6],layers:[{i:"kick",p:"x.....x...x.....",v:.8},{i:"snare",p:"....x.......x...",v:.55},{i:"hat",p:"x.x.x.x.x.x.x.xx",v:.6},{i:"bass",bass:"x.....x...5....."},{i:"pad",chord:!0,v:.9},{i:"pluck",arp:"..x...x...x...x.",oct:2,v:.8}]},lot:{bpm:124,root:40,scale:"minor",chords:[0,0,5,6],layers:[{i:"kick",p:"x...x...x...x..."},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.7},{i:"bass",bass:"x.x.x.x.x.x.o.x."},{i:"pad",chord:!0,v:.6},{i:"snare",p:"....x.......x...",min:1},{i:"stab",p:"x......x..x.....",oct:1,min:1},{i:"hat",p:".x.x.x.x.x.x.x.x",v:.4,min:2},{i:"crash",p:"x...............",every:4,min:2},{i:"brass",mel:["7...6...4...6...","7...9...7.6.4...","7...6...4...6...","a...9...7...6..."],oct:1,min:2}]},tier:{bpm:140,root:36,scale:"phryg",chords:[0,0,5,4],layers:[{i:"kick",p:"x......x..x....."},{i:"clap",p:"........x......."},{i:"sub",bass:"x......x..x.....",len:3},{i:"bell",mel:["4.......3.......","4.......5...4..."],oct:2,v:.8},{i:"hat",p:"x.x.x.x.x.x.xxxx",min:1},{i:"pad",chord:!0,v:.5,min:1},{i:"hat",p:"xxxxxxx.x.xxxxxx",v:.5,min:2},{i:"ohat",p:"......o.......o.",min:2},{i:"lead",mel:["0.0.3.0.5.4.3.2.","0.0.3.0.7.5.4..."],oct:2,min:2}]},yard:{bpm:128,root:43,scale:"minor",chords:[0,5,2,6],layers:[{i:"kick",p:"x...x...x...x..."},{i:"ohat",p:"..o...o...o...o."},{i:"bass",bass:"..x...x...x...o."},{i:"pad",chord:!0,v:.7},{i:"clap",p:"....x.......x...",min:1},{i:"pluck",arp:"xxxxxxxxxxxxxxxx",oct:2,v:.7,min:1},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.6,min:2},{i:"crash",p:"x...............",every:4,min:2},{i:"brass",mel:["4...4...3.4.6...","4...4...3.2.0...","4...4...3.4.6...","7...6...4...6..."],oct:1,min:2}]},night:{bpm:60,root:38,scale:"phryg",chords:[0,1,0,6],night:!0,layers:[{i:"drone",chord:!0,v:1},{i:"heart",p:"x..x............",v:.8},{i:"bell",mel:["........1.......","................",".......4........","..............2."],oct:3,v:.7},{i:"heart",p:"........x..x....",v:.8,min:1},{i:"hat",p:"..x...x...x...x.",v:.25,min:1},{i:"tom",p:"x..x..x...x.x...",f:70,v:.6,min:2},{i:"bass",bass:"x.x.x.x.x.x.x.x.",v:.6,min:2}]},row:{bpm:96,root:38,scale:"harm",chords:[0,5,3,4],layers:[{i:"tom",p:"x..x..x...x.x...",f:95},{i:"choir",chord:!0},{i:"bass",bass:"x..x..x.x..x..x."},{i:"kick",p:"x.......x.......",min:1},{i:"snare",p:"....x.......x...",min:1},{i:"brass",mel:["7.7.7.9.a.9.7.6.","7.7.7.9.a.c.a.9."],oct:0,v:.8,min:1},{i:"tom",p:"..........xxx.xx",f:140,v:.7,min:2},{i:"crash",p:"x...............",every:2,min:2},{i:"lead",mel:["e---d---c---b---","c---b---a---b---"],oct:1,min:2}]},boss:{bpm:152,root:38,scale:"harm",chords:[0,0,5,4],layers:[{i:"kick",p:"x...x...x...x.x."},{i:"snare",p:"....x.......x..."},{i:"hat",p:"xxxxxxxxxxxxxxxx",v:.5},{i:"bass",bass:"xxxxxxxxxxxxoxox",v:.8},{i:"choir",chord:!0},{i:"tom",p:"x.....x.....x.xx",f:90},{i:"brass",mel:["7.7.6.7.9.7.6.4.","7.7.6.7.a.9.7..."],oct:1},{i:"crash",p:"x...............",every:4}]},overtime:{bpm:168,root:48,scale:"major",chords:[0,3,4,0],layers:[{i:"kick",p:"x...x...x...x..."},{i:"snare",p:"....x.......x..."},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.7},{i:"chipb",bass:"x.o.x.o.x.o.x.o."},{i:"pluck",arp:"x.x.x.x.x.x.x.x.",oct:2,v:.6},{i:"chip",mel:["0.2.4.7.4.2.4...","3.5.7.a.7.5.3...","4.6.8.b.8.6.4...","7.6.5.4.2.1.0..."],oct:2},{i:"crash",p:"x...............",every:4}]}},qe={track:null,name:"",step:0,next:0,timer:0,int:0,want:"",pending:null,ducked:!1};function oa(i,e,t=0){let n=Dp[i.scale],s=n.length,r=Math.floor(e/s),a=(e%s+s)%s;return i.root+n[a]+12*(r+t)}function Np(i,e,t){return[0,2,4].map(n=>aa(oa(i,e+n,t)))}function Up(i,e,t){let n=e%16,s=Math.floor(e/16),r=60/i.bpm/4,a=n%2?(i.swing||0)*r:0,o=t+a,l=i.chords[s%i.chords.length];for(let c of i.layers){if((c.min||0)>qe.int)continue;let u=c.v??1,d=Sn[c.i];if(c.p){if(c.every&&s%c.every)continue;let f=c.p[n];(f==="x"||f==="o")&&d(o,c.f,r,(f==="o"?1.2:1)*u)}else if(c.bass){let f=c.bass[n];if(f==="."||!f)continue;d(o,aa(oa(i,l+(f==="o"?7:f==="5"?4:0),c.oct||0)),r*(c.len||1.6),u)}else if(c.chord)n===0&&d(o,Np(i,l,1+(c.oct||0)),r*16*1.05,u);else if(c.arp){if(c.arp[n]!=="x")continue;let f=[0,2,4,7][n%4];d(o,aa(oa(i,l+f,c.oct||2)),r,u)}else if(c.mel){let f=c.mel[s%c.mel.length],p=f[n];if(!p||p==="."||p==="-")continue;let y=1;for(;f[n+y]==="-";)y++;d(o,aa(oa(i,parseInt(p,36),c.oct||0)),r*(y+.6),u)}}i.night&&n===0&&Math.random()<.3+qe.int*.2&&Sn.scrape(t+Math.random()*r*8,0,0,.7+qe.int*.3)}function Op(){if(!ee.ctx||ee.ctx.state!=="running")return;let i=ee.ctx.currentTime;if(qe.track)for(qe.next<i&&(qe.next=i+.05);qe.next<i+.12&&(qe.pending&&(qe.step%16===0||qe.pending.now)&&(qe.track=jo[qe.pending.name],qe.name=qe.pending.name,qe.step=0,qe.pending=null),!!qe.track);)Up(qe.track,qe.step,qe.next),qe.next+=60/qe.track.bpm/4,qe.step++}ee.music=function(i,e){if(qe.want=i,!!ee.ctx){if(!i||!jo[i]){qe.track=null,qe.name="";return}if(!(qe.name===i&&!qe.pending)){if(!qe.track){qe.track=jo[i],qe.name=i,qe.step=0,qe.next=ee.ctx.currentTime+.06;return}qe.pending={name:i,now:!!e}}}};ee.musicName=()=>qe.pending?qe.pending.name:qe.name;ee.intensity=function(i){qe.int=i};ee.sting=function(i){if(!ee.ctx||Qo()!=="all"||ee.ctx.state!=="running")return;let e=ee.ctx.currentTime+.02,t=ee.mus;i==="clear"?([[0,523],[.14,659],[.28,784],[.42,1047]].forEach(([n,s])=>Sn.brass(e+n,s,.5,1.3)),Sn.pad(e+.42,[523,659,784],1.6,2),Sn.crash(e+.42,0,0,1.2),Sn.kick(e+.42,0,0,1)):i==="over"?([[0,233],[.45,220],[.9,208]].forEach(([n,s])=>ke(e+n,.42,{type:"sawtooth",freq:s,gain:.14,lp:1200,attack:.04},t)),ke(e+1.35,1.3,{type:"sawtooth",freq:196,gain:.14,lp:1200,attack:.04,vib:6,vibAmt:40},t)):i==="assault"?(Sn.kick(e,0,0,1.3),Sn.crash(e,0,0,1.3),Sn.stab(e,82,.4,1.6),Sn.tom(e+.18,90,0,1),Sn.tom(e+.3,70,0,1)):i==="overtime"?(vu.clock.f(e,1.2),ke(e,.9,{type:"sawtooth",freq:200,freqEnd:1600,gain:.08,lp:3e3},t)):i==="boss"&&(ke(e,2.2,{type:"sawtooth",freq:55,freqEnd:110,gain:.2,lp:500,lpEnd:2400},t),Sn.crash(e+2,0,0,1.4),Sn.kick(e+2,0,0,1.3))};var oh="170";var kp=0,_u=1,zp=2;var Pd=1,lh=2,vi=3,zi=0,sn=1,Bt=2,Gt=0,Fs=1,xn=2,Mu=3,bu=4,ch=5,Un=100,Fp=101,Bp=102,Hp=103,Gp=104,er=200,Vp=201,Wp=202,Xp=203,Ul=204,Ol=205,fo=206,qp=207,po=208,Yp=209,$p=210,Zp=211,Kp=212,Jp=213,jp=214,kl=0,zl=1,Fl=2,Vs=3,Bl=4,Hl=5,Gl=6,Vl=7,Ld=0,Qp=1,em=2,ki=0,hh=1,uh=2,dh=3,Ur=4,tm=5,fh=6,ph=7;var Dd=300,Ws=301,Xs=302,Sr=303,Wl=304,mo=306,Cn=1e3,Rn=1001,Xl=1002,rn=1003,nm=1004;var la=1005;var Ht=1006,el=1007;var Oi=1008;var Xn=1009,Nd=1010,Ud=1011,Tr=1012,mh=1013,cs=1014,gn=1015,Nt=1016,gh=1017,xh=1018,Fi=1020,Od=35902,kd=1021,zd=1022,ln=1023,Fd=1024,Bd=1025,Bs=1026,Bi=1027,yh=1028,vh=1029,Hd=1030,_h=1031;var Mh=1033,Na=33776,Ua=33777,Oa=33778,ka=33779,ql=35840,Yl=35841,$l=35842,Zl=35843,Kl=36196,Jl=37492,jl=37496,Ql=37808,ec=37809,tc=37810,nc=37811,ic=37812,sc=37813,rc=37814,ac=37815,oc=37816,lc=37817,cc=37818,hc=37819,uc=37820,dc=37821,za=36492,fc=36494,pc=36495,Gd=36283,mc=36284,gc=36285,xc=36286;var Fa=2300,yc=2301,tl=2302,wu=2400,Eu=2401,Su=2402;var im=3200,sm=3201;var bh=0,rm=1,Ui="",Ft="srgb",ti="srgb-linear",go="linear",gt="srgb";var ws=7680;var Tu=519,am=512,om=513,lm=514,Vd=515,cm=516,hm=517,um=518,dm=519,Au=35044,ps=35048;var Ru="300 es",Mi=2e3,Ba=2001,Hi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var nl=Math.PI/180,Ha=180/Math.PI;function Or(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[i&255]+tn[i>>8&255]+tn[i>>16&255]+tn[i>>24&255]+"-"+tn[e&255]+tn[e>>8&255]+"-"+tn[e>>16&15|64]+tn[e>>24&255]+"-"+tn[t&63|128]+tn[t>>8&255]+"-"+tn[t>>16&255]+tn[t>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function qt(i,e,t){return Math.max(e,Math.min(t,i))}function fm(i,e){return(i%e+e)%e}function il(i,e,t){return(1-t)*i+t*e}function dr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function mn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var le=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ke=class i{constructor(e,t,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],f=n[2],p=n[5],y=n[8],x=s[0],g=s[3],m=s[6],v=s[1],_=s[4],b=s[7],D=s[2],T=s[5],C=s[8];return r[0]=a*x+o*v+l*D,r[3]=a*g+o*_+l*T,r[6]=a*m+o*b+l*C,r[1]=c*x+u*v+d*D,r[4]=c*g+u*_+d*T,r[7]=c*m+u*b+d*C,r[2]=f*x+p*v+y*D,r[5]=f*g+p*_+y*T,r[8]=f*m+p*b+y*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,f=o*l-u*r,p=c*r-a*l,y=t*d+n*f+s*p;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/y;return e[0]=d*x,e[1]=(s*c-u*n)*x,e[2]=(o*n-s*a)*x,e[3]=f*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=p*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(sl.makeScale(e,t)),this}rotate(e){return this.premultiply(sl.makeRotation(-e)),this}translate(e,t){return this.premultiply(sl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},sl=new Ke;function Wd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ar(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function pm(){let i=Ar("canvas");return i.style.display="block",i}var Cu={};function _r(i){i in Cu||(Cu[i]=!0,console.warn(i))}function mm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function gm(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function xm(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var ot={enabled:!0,workingColorSpace:ti,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===gt&&(i.r=bi(i.r),i.g=bi(i.g),i.b=bi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===gt&&(i.r=Hs(i.r),i.g=Hs(i.g),i.b=Hs(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ui?go:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function bi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Hs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Iu=[.64,.33,.3,.6,.15,.06],Pu=[.2126,.7152,.0722],Lu=[.3127,.329],Du=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Nu=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ot.define({[ti]:{primaries:Iu,whitePoint:Lu,transfer:go,toXYZ:Du,fromXYZ:Nu,luminanceCoefficients:Pu,workingColorSpaceConfig:{unpackColorSpace:Ft},outputColorSpaceConfig:{drawingBufferColorSpace:Ft}},[Ft]:{primaries:Iu,whitePoint:Lu,transfer:gt,toXYZ:Du,fromXYZ:Nu,luminanceCoefficients:Pu,outputColorSpaceConfig:{drawingBufferColorSpace:Ft}}});var Es,vc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Es===void 0&&(Es=Ar("canvas")),Es.width=e.width,Es.height=e.height;let n=Es.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Es}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ar("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=bi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(bi(t[n]/255)*255):t[n]=bi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},ym=0,Ga=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ym++}),this.uuid=Or(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(rl(s[a].image)):r.push(rl(s[a]))}else r=rl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function rl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?vc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var vm=0,cn=class i extends Hi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Rn,s=Rn,r=Ht,a=Oi,o=ln,l=Xn,c=i.DEFAULT_ANISOTROPY,u=Ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=Or(),this.name="",this.source=new Ga(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Dd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Cn:e.x=e.x-Math.floor(e.x);break;case Rn:e.x=e.x<0?0:1;break;case Xl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Cn:e.y=e.y-Math.floor(e.y);break;case Rn:e.y=e.y<0?0:1;break;case Xl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};cn.DEFAULT_IMAGE=null;cn.DEFAULT_MAPPING=Dd;cn.DEFAULT_ANISOTROPY=1;var vt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],p=l[5],y=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-x)<.01&&Math.abs(y-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+x)<.1&&Math.abs(y+g)<.1&&Math.abs(c+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let _=(c+1)/2,b=(p+1)/2,D=(m+1)/2,T=(u+f)/4,C=(d+x)/4,A=(y+g)/4;return _>b&&_>D?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=T/n,r=C/n):b>D?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=T/s,r=A/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=C/r,s=A/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-y)*(g-y)+(d-x)*(d-x)+(f-u)*(f-u));return Math.abs(v)<.001&&(v=1),this.x=(g-y)/v,this.y=(d-x)/v,this.z=(f-u)/v,this.w=Math.acos((c+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},_c=class extends Hi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ht,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new cn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ga(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},kt=class extends _c{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Va=class extends cn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Mc=class extends cn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Yt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],f=r[a+0],p=r[a+1],y=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=p,e[t+2]=y,e[t+3]=x;return}if(d!==x||l!==f||c!==p||u!==y){let g=1-o,m=l*f+c*p+u*y+d*x,v=m>=0?1:-1,_=1-m*m;if(_>Number.EPSILON){let D=Math.sqrt(_),T=Math.atan2(D,m*v);g=Math.sin(g*T)/D,o=Math.sin(o*T)/D}let b=o*v;if(l=l*g+f*b,c=c*g+p*b,u=u*g+y*b,d=d*g+x*b,g===1-o){let D=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=D,c*=D,u*=D,d*=D}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[a],f=r[a+1],p=r[a+2],y=r[a+3];return e[t]=o*y+u*d+l*p-c*f,e[t+1]=l*y+u*f+c*d-o*p,e[t+2]=c*y+u*p+o*f-l*d,e[t+3]=u*y-o*d-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),d=o(r/2),f=l(n/2),p=l(s/2),y=l(r/2);switch(a){case"XYZ":this._x=f*u*d+c*p*y,this._y=c*p*d-f*u*y,this._z=c*u*y+f*p*d,this._w=c*u*d-f*p*y;break;case"YXZ":this._x=f*u*d+c*p*y,this._y=c*p*d-f*u*y,this._z=c*u*y-f*p*d,this._w=c*u*d+f*p*y;break;case"ZXY":this._x=f*u*d-c*p*y,this._y=c*p*d+f*u*y,this._z=c*u*y+f*p*d,this._w=c*u*d-f*p*y;break;case"ZYX":this._x=f*u*d-c*p*y,this._y=c*p*d+f*u*y,this._z=c*u*y-f*p*d,this._w=c*u*d+f*p*y;break;case"YZX":this._x=f*u*d+c*p*y,this._y=c*p*d+f*u*y,this._z=c*u*y-f*p*d,this._w=c*u*d-f*p*y;break;case"XZY":this._x=f*u*d-c*p*y,this._y=c*p*d-f*u*y,this._z=c*u*y+f*p*d,this._w=c*u*d+f*p*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(u-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+u)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,o),d=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Uu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Uu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-r*d,this.z=s+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return al.copy(this).projectOnVector(e),this.sub(al)}reflect(e){return this.sub(al.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},al=new L,Uu=new Yt,wi=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Hn):Hn.fromBufferAttribute(r,a),Hn.applyMatrix4(e.matrixWorld),this.expandByPoint(Hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ca.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ca.copy(n.boundingBox)),ca.applyMatrix4(e.matrixWorld),this.union(ca)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hn),Hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(fr),ha.subVectors(this.max,fr),Ss.subVectors(e.a,fr),Ts.subVectors(e.b,fr),As.subVectors(e.c,fr),Ci.subVectors(Ts,Ss),Ii.subVectors(As,Ts),es.subVectors(Ss,As);let t=[0,-Ci.z,Ci.y,0,-Ii.z,Ii.y,0,-es.z,es.y,Ci.z,0,-Ci.x,Ii.z,0,-Ii.x,es.z,0,-es.x,-Ci.y,Ci.x,0,-Ii.y,Ii.x,0,-es.y,es.x,0];return!ol(t,Ss,Ts,As,ha)||(t=[1,0,0,0,1,0,0,0,1],!ol(t,Ss,Ts,As,ha))?!1:(ua.crossVectors(Ci,Ii),t=[ua.x,ua.y,ua.z],ol(t,Ss,Ts,As,ha))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},fi=[new L,new L,new L,new L,new L,new L,new L,new L],Hn=new L,ca=new wi,Ss=new L,Ts=new L,As=new L,Ci=new L,Ii=new L,es=new L,fr=new L,ha=new L,ua=new L,ts=new L;function ol(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ts.fromArray(i,r);let o=s.x*Math.abs(ts.x)+s.y*Math.abs(ts.y)+s.z*Math.abs(ts.z),l=e.dot(ts),c=t.dot(ts),u=n.dot(ts);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var _m=new wi,pr=new L,ll=new L,Gi=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):_m.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;pr.subVectors(e,this.center);let t=pr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(pr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ll.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(pr.copy(e.center).add(ll)),this.expandByPoint(pr.copy(e.center).sub(ll))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},pi=new L,cl=new L,da=new L,Pi=new L,hl=new L,fa=new L,ul=new L,Rr=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=pi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pi.copy(this.origin).addScaledVector(this.direction,t),pi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){cl.copy(e).add(t).multiplyScalar(.5),da.copy(t).sub(e).normalize(),Pi.copy(this.origin).sub(cl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(da),o=Pi.dot(this.direction),l=-Pi.dot(da),c=Pi.lengthSq(),u=Math.abs(1-a*a),d,f,p,y;if(u>0)if(d=a*l-o,f=a*o-l,y=r*u,d>=0)if(f>=-y)if(f<=y){let x=1/u;d*=x,f*=x,p=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;else f<=-y?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c):f<=y?(d=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(cl).addScaledVector(da,f),p}intersectSphere(e,t){pi.subVectors(e.center,this.origin);let n=pi.dot(this.direction),s=pi.dot(pi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,pi)!==null}intersectTriangle(e,t,n,s,r){hl.subVectors(t,e),fa.subVectors(n,e),ul.crossVectors(hl,fa);let a=this.direction.dot(ul),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Pi.subVectors(this.origin,e);let l=o*this.direction.dot(fa.crossVectors(Pi,fa));if(l<0)return null;let c=o*this.direction.dot(hl.cross(Pi));if(c<0||l+c>a)return null;let u=-o*Pi.dot(ul);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Be=class i{constructor(e,t,n,s,r,a,o,l,c,u,d,f,p,y,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,d,f,p,y,x,g)}set(e,t,n,s,r,a,o,l,c,u,d,f,p,y,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=f,m[3]=p,m[7]=y,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Rs.setFromMatrixColumn(e,0).length(),r=1/Rs.setFromMatrixColumn(e,1).length(),a=1/Rs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let f=a*u,p=a*d,y=o*u,x=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=p+y*c,t[5]=f-x*c,t[9]=-o*l,t[2]=x-f*c,t[6]=y+p*c,t[10]=a*l}else if(e.order==="YXZ"){let f=l*u,p=l*d,y=c*u,x=c*d;t[0]=f+x*o,t[4]=y*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=p*o-y,t[6]=x+f*o,t[10]=a*l}else if(e.order==="ZXY"){let f=l*u,p=l*d,y=c*u,x=c*d;t[0]=f-x*o,t[4]=-a*d,t[8]=y+p*o,t[1]=p+y*o,t[5]=a*u,t[9]=x-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let f=a*u,p=a*d,y=o*u,x=o*d;t[0]=l*u,t[4]=y*c-p,t[8]=f*c+x,t[1]=l*d,t[5]=x*c+f,t[9]=p*c-y,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let f=a*l,p=a*c,y=o*l,x=o*c;t[0]=l*u,t[4]=x-f*d,t[8]=y*d+p,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=p*d+y,t[10]=f-x*d}else if(e.order==="XZY"){let f=a*l,p=a*c,y=o*l,x=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+x,t[5]=a*u,t[9]=p*d-y,t[2]=y*d-p,t[6]=o*u,t[10]=x*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mm,e,bm)}lookAt(e,t,n){let s=this.elements;return Tn.subVectors(e,t),Tn.lengthSq()===0&&(Tn.z=1),Tn.normalize(),Li.crossVectors(n,Tn),Li.lengthSq()===0&&(Math.abs(n.z)===1?Tn.x+=1e-4:Tn.z+=1e-4,Tn.normalize(),Li.crossVectors(n,Tn)),Li.normalize(),pa.crossVectors(Tn,Li),s[0]=Li.x,s[4]=pa.x,s[8]=Tn.x,s[1]=Li.y,s[5]=pa.y,s[9]=Tn.y,s[2]=Li.z,s[6]=pa.z,s[10]=Tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],f=n[9],p=n[13],y=n[2],x=n[6],g=n[10],m=n[14],v=n[3],_=n[7],b=n[11],D=n[15],T=s[0],C=s[4],A=s[8],w=s[12],M=s[1],I=s[5],k=s[9],O=s[13],G=s[2],X=s[6],z=s[10],K=s[14],W=s[3],te=s[7],re=s[11],be=s[15];return r[0]=a*T+o*M+l*G+c*W,r[4]=a*C+o*I+l*X+c*te,r[8]=a*A+o*k+l*z+c*re,r[12]=a*w+o*O+l*K+c*be,r[1]=u*T+d*M+f*G+p*W,r[5]=u*C+d*I+f*X+p*te,r[9]=u*A+d*k+f*z+p*re,r[13]=u*w+d*O+f*K+p*be,r[2]=y*T+x*M+g*G+m*W,r[6]=y*C+x*I+g*X+m*te,r[10]=y*A+x*k+g*z+m*re,r[14]=y*w+x*O+g*K+m*be,r[3]=v*T+_*M+b*G+D*W,r[7]=v*C+_*I+b*X+D*te,r[11]=v*A+_*k+b*z+D*re,r[15]=v*w+_*O+b*K+D*be,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],p=e[14],y=e[3],x=e[7],g=e[11],m=e[15];return y*(+r*l*d-s*c*d-r*o*f+n*c*f+s*o*p-n*l*p)+x*(+t*l*p-t*c*f+r*a*f-s*a*p+s*c*u-r*l*u)+g*(+t*c*d-t*o*p-r*a*d+n*a*p+r*o*u-n*c*u)+m*(-s*o*u-t*l*d+t*o*f+s*a*d-n*a*f+n*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],p=e[11],y=e[12],x=e[13],g=e[14],m=e[15],v=d*g*c-x*f*c+x*l*p-o*g*p-d*l*m+o*f*m,_=y*f*c-u*g*c-y*l*p+a*g*p+u*l*m-a*f*m,b=u*x*c-y*d*c+y*o*p-a*x*p-u*o*m+a*d*m,D=y*d*l-u*x*l-y*o*f+a*x*f+u*o*g-a*d*g,T=t*v+n*_+s*b+r*D;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/T;return e[0]=v*C,e[1]=(x*f*r-d*g*r-x*s*p+n*g*p+d*s*m-n*f*m)*C,e[2]=(o*g*r-x*l*r+x*s*c-n*g*c-o*s*m+n*l*m)*C,e[3]=(d*l*r-o*f*r-d*s*c+n*f*c+o*s*p-n*l*p)*C,e[4]=_*C,e[5]=(u*g*r-y*f*r+y*s*p-t*g*p-u*s*m+t*f*m)*C,e[6]=(y*l*r-a*g*r-y*s*c+t*g*c+a*s*m-t*l*m)*C,e[7]=(a*f*r-u*l*r+u*s*c-t*f*c-a*s*p+t*l*p)*C,e[8]=b*C,e[9]=(y*d*r-u*x*r-y*n*p+t*x*p+u*n*m-t*d*m)*C,e[10]=(a*x*r-y*o*r+y*n*c-t*x*c-a*n*m+t*o*m)*C,e[11]=(u*o*r-a*d*r-u*n*c+t*d*c+a*n*p-t*o*p)*C,e[12]=D*C,e[13]=(u*x*s-y*d*s+y*n*f-t*x*f-u*n*g+t*d*g)*C,e[14]=(y*o*s-a*x*s-y*n*l+t*x*l+a*n*g-t*o*g)*C,e[15]=(a*d*s-u*o*s+u*n*l-t*d*l-a*n*f+t*o*f)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,f=r*c,p=r*u,y=r*d,x=a*u,g=a*d,m=o*d,v=l*c,_=l*u,b=l*d,D=n.x,T=n.y,C=n.z;return s[0]=(1-(x+m))*D,s[1]=(p+b)*D,s[2]=(y-_)*D,s[3]=0,s[4]=(p-b)*T,s[5]=(1-(f+m))*T,s[6]=(g+v)*T,s[7]=0,s[8]=(y+_)*C,s[9]=(g-v)*C,s[10]=(1-(f+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Rs.set(s[0],s[1],s[2]).length(),a=Rs.set(s[4],s[5],s[6]).length(),o=Rs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Gn.copy(this);let c=1/r,u=1/a,d=1/o;return Gn.elements[0]*=c,Gn.elements[1]*=c,Gn.elements[2]*=c,Gn.elements[4]*=u,Gn.elements[5]*=u,Gn.elements[6]*=u,Gn.elements[8]*=d,Gn.elements[9]*=d,Gn.elements[10]*=d,t.setFromRotationMatrix(Gn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Mi){let l=this.elements,c=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),p,y;if(o===Mi)p=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===Ba)p=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Mi){let l=this.elements,c=1/(t-e),u=1/(n-s),d=1/(a-r),f=(t+e)*c,p=(n+s)*u,y,x;if(o===Mi)y=(a+r)*d,x=-2*d;else if(o===Ba)y=r*d,x=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Rs=new L,Gn=new Be,Mm=new L(0,0,0),bm=new L(1,1,1),Li=new L,pa=new L,Tn=new L,Ou=new Be,ku=new Yt,$t=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],d=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(qt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ou.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ou,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ku.setFromEuler(this),this.setFromQuaternion(ku,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};$t.DEFAULT_ORDER="XYZ";var Cr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},wm=0,zu=new L,Cs=new Yt,mi=new Be,ma=new L,mr=new L,Em=new L,Sm=new Yt,Fu=new L(1,0,0),Bu=new L(0,1,0),Hu=new L(0,0,1),Gu={type:"added"},Tm={type:"removed"},Is={type:"childadded",child:null},dl={type:"childremoved",child:null},Zt=class i extends Hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=Or(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new $t,n=new Yt,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Be},normalMatrix:{value:new Ke}}),this.matrix=new Be,this.matrixWorld=new Be,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Cs.setFromAxisAngle(e,t),this.quaternion.multiply(Cs),this}rotateOnWorldAxis(e,t){return Cs.setFromAxisAngle(e,t),this.quaternion.premultiply(Cs),this}rotateX(e){return this.rotateOnAxis(Fu,e)}rotateY(e){return this.rotateOnAxis(Bu,e)}rotateZ(e){return this.rotateOnAxis(Hu,e)}translateOnAxis(e,t){return zu.copy(e).applyQuaternion(this.quaternion),this.position.add(zu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fu,e)}translateY(e){return this.translateOnAxis(Bu,e)}translateZ(e){return this.translateOnAxis(Hu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ma.copy(e):ma.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mi.lookAt(mr,ma,this.up):mi.lookAt(ma,mr,this.up),this.quaternion.setFromRotationMatrix(mi),s&&(mi.extractRotation(s.matrixWorld),Cs.setFromRotationMatrix(mi),this.quaternion.premultiply(Cs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Gu),Is.child=e,this.dispatchEvent(Is),Is.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Tm),dl.child=e,this.dispatchEvent(dl),dl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mi.multiply(e.parent.matrixWorld)),e.applyMatrix4(mi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Gu),Is.child=e,this.dispatchEvent(Is),Is.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,e,Em),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,Sm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),p=a(e.animations),y=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Zt.DEFAULT_UP=new L(0,1,0);Zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Vn=new L,gi=new L,fl=new L,xi=new L,Ps=new L,Ls=new L,Vu=new L,pl=new L,ml=new L,gl=new L,xl=new vt,yl=new vt,vl=new vt,os=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Vn.subVectors(e,t),s.cross(Vn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Vn.subVectors(s,t),gi.subVectors(n,t),fl.subVectors(e,t);let a=Vn.dot(Vn),o=Vn.dot(gi),l=Vn.dot(fl),c=gi.dot(gi),u=gi.dot(fl),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let f=1/d,p=(c*l-o*u)*f,y=(a*u-o*l)*f;return r.set(1-p-y,y,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,xi)===null?!1:xi.x>=0&&xi.y>=0&&xi.x+xi.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,xi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,xi.x),l.addScaledVector(a,xi.y),l.addScaledVector(o,xi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return xl.setScalar(0),yl.setScalar(0),vl.setScalar(0),xl.fromBufferAttribute(e,t),yl.fromBufferAttribute(e,n),vl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(xl,r.x),a.addScaledVector(yl,r.y),a.addScaledVector(vl,r.z),a}static isFrontFacing(e,t,n,s){return Vn.subVectors(n,t),gi.subVectors(e,t),Vn.cross(gi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),gi.subVectors(this.a,this.b),Vn.cross(gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Ps.subVectors(s,n),Ls.subVectors(r,n),pl.subVectors(e,n);let l=Ps.dot(pl),c=Ls.dot(pl);if(l<=0&&c<=0)return t.copy(n);ml.subVectors(e,s);let u=Ps.dot(ml),d=Ls.dot(ml);if(u>=0&&d<=u)return t.copy(s);let f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Ps,a);gl.subVectors(e,r);let p=Ps.dot(gl),y=Ls.dot(gl);if(y>=0&&p<=y)return t.copy(r);let x=p*c-l*y;if(x<=0&&c>=0&&y<=0)return o=c/(c-y),t.copy(n).addScaledVector(Ls,o);let g=u*y-p*d;if(g<=0&&d-u>=0&&p-y>=0)return Vu.subVectors(r,s),o=(d-u)/(d-u+(p-y)),t.copy(s).addScaledVector(Vu,o);let m=1/(g+x+f);return a=x*m,o=f*m,t.copy(n).addScaledVector(Ps,a).addScaledVector(Ls,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Xd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},ga={h:0,s:0,l:0};function _l(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ye=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=ot.workingColorSpace){if(e=fm(e,1),t=qt(t,0,1),n=qt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=_l(a,r,e+1/3),this.g=_l(a,r,e),this.b=_l(a,r,e-1/3)}return ot.toWorkingColorSpace(this,s),this}setStyle(e,t=Ft){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ft){let n=Xd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=bi(e.r),this.g=bi(e.g),this.b=bi(e.b),this}copyLinearToSRGB(e){return this.r=Hs(e.r),this.g=Hs(e.g),this.b=Hs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ft){return ot.fromWorkingColorSpace(nn.copy(this),e),Math.round(qt(nn.r*255,0,255))*65536+Math.round(qt(nn.g*255,0,255))*256+Math.round(qt(nn.b*255,0,255))}getHexString(e=Ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.fromWorkingColorSpace(nn.copy(this),t);let n=nn.r,s=nn.g,r=nn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ot.workingColorSpace){return ot.fromWorkingColorSpace(nn.copy(this),t),e.r=nn.r,e.g=nn.g,e.b=nn.b,e}getStyle(e=Ft){ot.fromWorkingColorSpace(nn.copy(this),e);let t=nn.r,n=nn.g,s=nn.b;return e!==Ft?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Di),this.setHSL(Di.h+e,Di.s+t,Di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Di),e.getHSL(ga);let n=il(Di.h,ga.h,t),s=il(Di.s,ga.s,t),r=il(Di.l,ga.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},nn=new ye;ye.NAMES=Xd;var Am=0,Ei=class extends Hi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Am++}),this.uuid=Or(),this.name="",this.blending=Fs,this.side=zi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ul,this.blendDst=Ol,this.blendEquation=Un,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ye(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Tu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ws,this.stencilZFail=ws,this.stencilZPass=ws,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Fs&&(n.blending=this.blending),this.side!==zi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ul&&(n.blendSrc=this.blendSrc),this.blendDst!==Ol&&(n.blendDst=this.blendDst),this.blendEquation!==Un&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Tu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ws&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ws&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ws&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},ft=class extends Ei{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $t,this.combine=Ld,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},_i=Rm();function Rm(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;!(c&8388608);)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function Cm(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=qt(i,-65504,65504),_i.floatView[0]=i;let e=_i.uint32View[0],t=e>>23&511;return _i.baseTable[t]+((e&8388607)>>_i.shiftTable[t])}function Im(i){let e=i>>10;return _i.uint32View[0]=_i.mantissaTable[_i.offsetTable[e]+(i&1023)]+_i.exponentTable[e],_i.floatView[0]}var kr={toHalfFloat:Cm,fromHalfFloat:Im},Ut=new L,xa=new le,Ot=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Au,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xa.fromBufferAttribute(this,t),xa.applyMatrix3(e),this.setXY(t,xa.x,xa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix3(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=dr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=dr(t,this.array)),t}setX(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=dr(t,this.array)),t}setY(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=dr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=dr(t,this.array)),t}setW(e,t){return this.normalized&&(t=mn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),n=mn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),n=mn(n,this.array),s=mn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=mn(t,this.array),n=mn(n,this.array),s=mn(s,this.array),r=mn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Au&&(e.usage=this.usage),e}};var Wa=class extends Ot{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Xa=class extends Ot{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var dt=class extends Ot{constructor(e,t,n){super(new Float32Array(e),t,n)}},Pm=0,Nn=new Be,Ml=new Zt,Ds=new L,An=new wi,gr=new wi,Xt=new L,zt=class i extends Hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pm++}),this.uuid=Or(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Wd(e)?Xa:Wa)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,t,n){return Nn.makeTranslation(e,t,n),this.applyMatrix4(Nn),this}scale(e,t,n){return Nn.makeScale(e,t,n),this.applyMatrix4(Nn),this}lookAt(e){return Ml.lookAt(e),Ml.updateMatrix(),this.applyMatrix4(Ml.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ds).negate(),this.translate(Ds.x,Ds.y,Ds.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new dt(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];An.setFromBufferAttribute(r),this.morphTargetsRelative?(Xt.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(Xt),Xt.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(Xt)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(An.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];gr.setFromBufferAttribute(o),this.morphTargetsRelative?(Xt.addVectors(An.min,gr.min),An.expandByPoint(Xt),Xt.addVectors(An.max,gr.max),An.expandByPoint(Xt)):(An.expandByPoint(gr.min),An.expandByPoint(gr.max))}An.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Xt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Xt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Xt.fromBufferAttribute(o,c),l&&(Ds.fromBufferAttribute(e,c),Xt.add(Ds)),s=Math.max(s,n.distanceToSquared(Xt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ot(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let A=0;A<n.count;A++)o[A]=new L,l[A]=new L;let c=new L,u=new L,d=new L,f=new le,p=new le,y=new le,x=new L,g=new L;function m(A,w,M){c.fromBufferAttribute(n,A),u.fromBufferAttribute(n,w),d.fromBufferAttribute(n,M),f.fromBufferAttribute(r,A),p.fromBufferAttribute(r,w),y.fromBufferAttribute(r,M),u.sub(c),d.sub(c),p.sub(f),y.sub(f);let I=1/(p.x*y.y-y.x*p.y);isFinite(I)&&(x.copy(u).multiplyScalar(y.y).addScaledVector(d,-p.y).multiplyScalar(I),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-y.x).multiplyScalar(I),o[A].add(x),o[w].add(x),o[M].add(x),l[A].add(g),l[w].add(g),l[M].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let A=0,w=v.length;A<w;++A){let M=v[A],I=M.start,k=M.count;for(let O=I,G=I+k;O<G;O+=3)m(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let _=new L,b=new L,D=new L,T=new L;function C(A){D.fromBufferAttribute(s,A),T.copy(D);let w=o[A];_.copy(w),_.sub(D.multiplyScalar(D.dot(w))).normalize(),b.crossVectors(T,w);let I=b.dot(l[A])<0?-1:1;a.setXYZW(A,_.x,_.y,_.z,I)}for(let A=0,w=v.length;A<w;++A){let M=v[A],I=M.start,k=M.count;for(let O=I,G=I+k;O<G;O+=3)C(e.getX(O+0)),C(e.getX(O+1)),C(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ot(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,u=new L,d=new L;if(e)for(let f=0,p=e.count;f<p;f+=3){let y=e.getX(f+0),x=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,y),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(n,y),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Xt.fromBufferAttribute(e,t),Xt.normalize(),e.setXYZ(t,Xt.x,Xt.y,Xt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,d=o.normalized,f=new c.constructor(l.length*u),p=0,y=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?p=l[x]*o.data.stride+o.offset:p=l[x]*u;for(let m=0;m<u;m++)f[y++]=c[p++]}return new Ot(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){let f=c[u],p=e(f,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){let p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],d=r[c];for(let f=0,p=d.length;f<p;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Wu=new Be,ns=new Rr,ya=new Gi,Xu=new L,va=new L,_a=new L,Ma=new L,bl=new L,ba=new L,qu=new L,wa=new L,he=class extends Zt{constructor(e=new zt,t=new ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){ba.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],d=r[l];u!==0&&(bl.fromBufferAttribute(d,e),a?ba.addScaledVector(bl,u):ba.addScaledVector(bl.sub(t),u))}t.add(ba)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(r),ns.copy(e.ray).recast(e.near),!(ya.containsPoint(ns.origin)===!1&&(ns.intersectSphere(ya,Xu)===null||ns.origin.distanceToSquared(Xu)>(e.far-e.near)**2))&&(Wu.copy(r).invert(),ns.copy(e.ray).applyMatrix4(Wu),!(n.boundingBox!==null&&ns.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,x=f.length;y<x;y++){let g=f[y],m=a[g.materialIndex],v=Math.max(g.start,p.start),_=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let b=v,D=_;b<D;b+=3){let T=o.getX(b),C=o.getX(b+1),A=o.getX(b+2);s=Ea(this,m,e,n,c,u,d,T,C,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=o.getX(g),_=o.getX(g+1),b=o.getX(g+2);s=Ea(this,a,e,n,c,u,d,v,_,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let y=0,x=f.length;y<x;y++){let g=f[y],m=a[g.materialIndex],v=Math.max(g.start,p.start),_=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let b=v,D=_;b<D;b+=3){let T=b,C=b+1,A=b+2;s=Ea(this,m,e,n,c,u,d,T,C,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=g,_=g+1,b=g+2;s=Ea(this,a,e,n,c,u,d,v,_,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Lm(i,e,t,n,s,r,a,o){let l;if(e.side===sn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===zi,o),l===null)return null;wa.copy(o),wa.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(wa);return c<t.near||c>t.far?null:{distance:c,point:wa.clone(),object:i}}function Ea(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,va),i.getVertexPosition(l,_a),i.getVertexPosition(c,Ma);let u=Lm(i,e,t,n,va,_a,Ma,qu);if(u){let d=new L;os.getBarycoord(qu,va,_a,Ma,d),s&&(u.uv=os.getInterpolatedAttribute(s,o,l,c,d,new le)),r&&(u.uv1=os.getInterpolatedAttribute(r,o,l,c,d,new le)),a&&(u.normal=os.getInterpolatedAttribute(a,o,l,c,d,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:l,c,normal:new L,materialIndex:0};os.getNormal(va,_a,Ma,f.normal),u.face=f,u.barycoord=d}return u}var Se=class i extends zt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],d=[],f=0,p=0;y("z","y","x",-1,-1,n,t,e,a,r,0),y("z","y","x",1,-1,n,t,-e,a,r,1),y("x","z","y",1,1,e,n,t,s,a,2),y("x","z","y",1,-1,e,n,-t,s,a,3),y("x","y","z",1,-1,e,t,n,s,r,4),y("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new dt(c,3)),this.setAttribute("normal",new dt(u,3)),this.setAttribute("uv",new dt(d,2));function y(x,g,m,v,_,b,D,T,C,A,w){let M=b/C,I=D/A,k=b/2,O=D/2,G=T/2,X=C+1,z=A+1,K=0,W=0,te=new L;for(let re=0;re<z;re++){let be=re*I-O;for(let Pe=0;Pe<X;Pe++){let Ye=Pe*M-k;te[x]=Ye*v,te[g]=be*_,te[m]=G,c.push(te.x,te.y,te.z),te[x]=0,te[g]=0,te[m]=T>0?1:-1,u.push(te.x,te.y,te.z),d.push(Pe/C),d.push(1-re/A),K+=1}}for(let re=0;re<A;re++)for(let be=0;be<C;be++){let Pe=f+be+X*re,Ye=f+be+X*(re+1),Z=f+(be+1)+X*(re+1),oe=f+(be+1)+X*re;l.push(Pe,Ye,oe),l.push(Ye,Z,oe),W+=6}o.addGroup(p,W,w),p+=W,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function qs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function on(i){let e={};for(let t=0;t<i.length;t++){let n=qs(i[t]);for(let s in n)e[s]=n[s]}return e}function Dm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function qd(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}var vn={clone:qs,merge:on},Nm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Um=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Tt=class extends Ei{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nm,this.fragmentShader=Um,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qs(e.uniforms),this.uniformsGroups=Dm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},qa=class extends Zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Be,this.projectionMatrix=new Be,this.projectionMatrixInverse=new Be,this.coordinateSystem=Mi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ni=new L,Yu=new le,$u=new le,Jt=class extends qa{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ha*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(nl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ha*2*Math.atan(Math.tan(nl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z),Ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z)}getViewSize(e,t){return this.getViewBounds(e,Yu,$u),t.subVectors($u,Yu)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(nl*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ns=-90,Us=1,bc=class extends Zt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Jt(Ns,Us,e,t);s.layers=this.layers,this.add(s);let r=new Jt(Ns,Us,e,t);r.layers=this.layers,this.add(r);let a=new Jt(Ns,Us,e,t);a.layers=this.layers,this.add(a);let o=new Jt(Ns,Us,e,t);o.layers=this.layers,this.add(o);let l=new Jt(Ns,Us,e,t);l.layers=this.layers,this.add(l);let c=new Jt(Ns,Us,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===Mi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ba)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(d,f,p),e.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},Ya=class extends cn{constructor(e,t,n,s,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Ws,super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},wc=class extends kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ya(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ht}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Se(5,5,5),r=new Tt({name:"CubemapFromEquirect",uniforms:qs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:Gt});r.uniforms.tEquirect.value=t;let a=new he(s,r),o=t.minFilter;return t.minFilter===Oi&&(t.minFilter=Ht),new bc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},wl=new L,Om=new L,km=new Ke,Wn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=wl.subVectors(n,t).cross(Om.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(wl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||km.getNormalMatrix(e),s=this.coplanarPoint(wl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},is=new Gi,Sa=new L,Ir=class{constructor(e=new Wn,t=new Wn,n=new Wn,s=new Wn,r=new Wn,a=new Wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Mi){let n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],d=s[6],f=s[7],p=s[8],y=s[9],x=s[10],g=s[11],m=s[12],v=s[13],_=s[14],b=s[15];if(n[0].setComponents(l-r,f-c,g-p,b-m).normalize(),n[1].setComponents(l+r,f+c,g+p,b+m).normalize(),n[2].setComponents(l+a,f+u,g+y,b+v).normalize(),n[3].setComponents(l-a,f-u,g-y,b-v).normalize(),n[4].setComponents(l-o,f-d,g-x,b-_).normalize(),t===Mi)n[5].setComponents(l+o,f+d,g+x,b+_).normalize();else if(t===Ba)n[5].setComponents(o,d,x,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){return is.center.set(0,0,0),is.radius=.7071067811865476,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Sa.x=s.normal.x>0?e.max.x:e.min.x,Sa.y=s.normal.y>0?e.max.y:e.min.y,Sa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Sa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Yd(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function zm(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,d=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,u);else{d.sort((p,y)=>p.start-y.start);let f=0;for(let p=1;p<d.length;p++){let y=d[f],x=d[p];x.start<=y.start+y.count+1?y.count=Math.max(y.count,x.start+x.count-y.start):(++f,d[f]=x)}d.length=f+1;for(let p=0,y=d.length;p<y;p++){let x=d[p];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Pt=class i extends zt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,d=e/o,f=t/l,p=[],y=[],x=[],g=[];for(let m=0;m<u;m++){let v=m*f-a;for(let _=0;_<c;_++){let b=_*d-r;y.push(b,-v,0),x.push(0,0,1),g.push(_/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<o;v++){let _=v+c*m,b=v+c*(m+1),D=v+1+c*(m+1),T=v+1+c*m;p.push(_,b,T),p.push(b,D,T)}this.setIndex(p),this.setAttribute("position",new dt(y,3)),this.setAttribute("normal",new dt(x,3)),this.setAttribute("uv",new dt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Fm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bm=`#ifdef USE_ALPHAHASH
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
#endif`,Hm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xm=`#ifdef USE_AOMAP
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
#endif`,qm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ym=`#ifdef USE_BATCHING
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
#endif`,$m=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Km=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,jm=`#ifdef USE_IRIDESCENCE
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
#endif`,Qm=`#ifdef USE_BUMPMAP
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
#endif`,e0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,t0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,n0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,i0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,s0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,r0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,a0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,o0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,l0=`#define PI 3.141592653589793
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
} // validated`,c0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,h0=`vec3 transformedNormal = objectNormal;
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
#endif`,u0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,d0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,f0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,p0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,m0="gl_FragColor = linearToOutputTexel( gl_FragColor );",g0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,x0=`#ifdef USE_ENVMAP
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
#endif`,y0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,v0=`#ifdef USE_ENVMAP
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
#endif`,_0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,M0=`#ifdef USE_ENVMAP
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
#endif`,b0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,w0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,E0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,S0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,T0=`#ifdef USE_GRADIENTMAP
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
}`,A0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,R0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,C0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,I0=`uniform bool receiveShadow;
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
#endif`,P0=`#ifdef USE_ENVMAP
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
#endif`,L0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,D0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,N0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,U0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,O0=`PhysicalMaterial material;
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
#endif`,k0=`struct PhysicalMaterial {
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
}`,z0=`
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
#endif`,F0=`#if defined( RE_IndirectDiffuse )
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
#endif`,B0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,H0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,G0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,V0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,W0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,X0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,q0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Y0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,$0=`#if defined( USE_POINTS_UV )
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
#endif`,Z0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,K0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,J0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,j0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Q0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eg=`#ifdef USE_MORPHTARGETS
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
#endif`,tg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ng=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ig=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,sg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ag=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,og=`#ifdef USE_NORMALMAP
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
#endif`,lg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ug=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,pg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_g=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Mg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,bg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,wg=`float getShadowMask() {
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
}`,Eg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sg=`#ifdef USE_SKINNING
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
#endif`,Tg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ag=`#ifdef USE_SKINNING
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
#endif`,Rg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ig=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Pg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lg=`#ifdef USE_TRANSMISSION
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
#endif`,Dg=`#ifdef USE_TRANSMISSION
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
#endif`,Ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,zg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fg=`uniform sampler2D t2D;
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
}`,Bg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wg=`#include <common>
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
}`,Xg=`#if DEPTH_PACKING == 3200
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
}`,qg=`#define DISTANCE
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
}`,Yg=`#define DISTANCE
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
}`,$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kg=`uniform float scale;
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
}`,Jg=`uniform vec3 diffuse;
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
}`,jg=`#include <common>
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
}`,Qg=`uniform vec3 diffuse;
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
}`,ex=`#define LAMBERT
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
}`,tx=`#define LAMBERT
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
}`,nx=`#define MATCAP
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
}`,ix=`#define MATCAP
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
}`,sx=`#define NORMAL
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
}`,rx=`#define NORMAL
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
}`,ax=`#define PHONG
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
}`,ox=`#define PHONG
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
}`,lx=`#define STANDARD
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
}`,cx=`#define STANDARD
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
}`,hx=`#define TOON
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
}`,ux=`#define TOON
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
}`,dx=`uniform float size;
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
}`,fx=`uniform vec3 diffuse;
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
}`,px=`#include <common>
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
}`,mx=`uniform vec3 color;
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
}`,gx=`uniform float rotation;
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
}`,xx=`uniform vec3 diffuse;
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
}`,Je={alphahash_fragment:Fm,alphahash_pars_fragment:Bm,alphamap_fragment:Hm,alphamap_pars_fragment:Gm,alphatest_fragment:Vm,alphatest_pars_fragment:Wm,aomap_fragment:Xm,aomap_pars_fragment:qm,batching_pars_vertex:Ym,batching_vertex:$m,begin_vertex:Zm,beginnormal_vertex:Km,bsdfs:Jm,iridescence_fragment:jm,bumpmap_pars_fragment:Qm,clipping_planes_fragment:e0,clipping_planes_pars_fragment:t0,clipping_planes_pars_vertex:n0,clipping_planes_vertex:i0,color_fragment:s0,color_pars_fragment:r0,color_pars_vertex:a0,color_vertex:o0,common:l0,cube_uv_reflection_fragment:c0,defaultnormal_vertex:h0,displacementmap_pars_vertex:u0,displacementmap_vertex:d0,emissivemap_fragment:f0,emissivemap_pars_fragment:p0,colorspace_fragment:m0,colorspace_pars_fragment:g0,envmap_fragment:x0,envmap_common_pars_fragment:y0,envmap_pars_fragment:v0,envmap_pars_vertex:_0,envmap_physical_pars_fragment:P0,envmap_vertex:M0,fog_vertex:b0,fog_pars_vertex:w0,fog_fragment:E0,fog_pars_fragment:S0,gradientmap_pars_fragment:T0,lightmap_pars_fragment:A0,lights_lambert_fragment:R0,lights_lambert_pars_fragment:C0,lights_pars_begin:I0,lights_toon_fragment:L0,lights_toon_pars_fragment:D0,lights_phong_fragment:N0,lights_phong_pars_fragment:U0,lights_physical_fragment:O0,lights_physical_pars_fragment:k0,lights_fragment_begin:z0,lights_fragment_maps:F0,lights_fragment_end:B0,logdepthbuf_fragment:H0,logdepthbuf_pars_fragment:G0,logdepthbuf_pars_vertex:V0,logdepthbuf_vertex:W0,map_fragment:X0,map_pars_fragment:q0,map_particle_fragment:Y0,map_particle_pars_fragment:$0,metalnessmap_fragment:Z0,metalnessmap_pars_fragment:K0,morphinstance_vertex:J0,morphcolor_vertex:j0,morphnormal_vertex:Q0,morphtarget_pars_vertex:eg,morphtarget_vertex:tg,normal_fragment_begin:ng,normal_fragment_maps:ig,normal_pars_fragment:sg,normal_pars_vertex:rg,normal_vertex:ag,normalmap_pars_fragment:og,clearcoat_normal_fragment_begin:lg,clearcoat_normal_fragment_maps:cg,clearcoat_pars_fragment:hg,iridescence_pars_fragment:ug,opaque_fragment:dg,packing:fg,premultiplied_alpha_fragment:pg,project_vertex:mg,dithering_fragment:gg,dithering_pars_fragment:xg,roughnessmap_fragment:yg,roughnessmap_pars_fragment:vg,shadowmap_pars_fragment:_g,shadowmap_pars_vertex:Mg,shadowmap_vertex:bg,shadowmask_pars_fragment:wg,skinbase_vertex:Eg,skinning_pars_vertex:Sg,skinning_vertex:Tg,skinnormal_vertex:Ag,specularmap_fragment:Rg,specularmap_pars_fragment:Cg,tonemapping_fragment:Ig,tonemapping_pars_fragment:Pg,transmission_fragment:Lg,transmission_pars_fragment:Dg,uv_pars_fragment:Ng,uv_pars_vertex:Ug,uv_vertex:Og,worldpos_vertex:kg,background_vert:zg,background_frag:Fg,backgroundCube_vert:Bg,backgroundCube_frag:Hg,cube_vert:Gg,cube_frag:Vg,depth_vert:Wg,depth_frag:Xg,distanceRGBA_vert:qg,distanceRGBA_frag:Yg,equirect_vert:$g,equirect_frag:Zg,linedashed_vert:Kg,linedashed_frag:Jg,meshbasic_vert:jg,meshbasic_frag:Qg,meshlambert_vert:ex,meshlambert_frag:tx,meshmatcap_vert:nx,meshmatcap_frag:ix,meshnormal_vert:sx,meshnormal_frag:rx,meshphong_vert:ax,meshphong_frag:ox,meshphysical_vert:lx,meshphysical_frag:cx,meshtoon_vert:hx,meshtoon_frag:ux,points_vert:dx,points_frag:fx,shadow_vert:px,shadow_frag:mx,sprite_vert:gx,sprite_frag:xx},pe={common:{diffuse:{value:new ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new ye(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},jn={basic:{uniforms:on([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:on([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ye(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:on([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ye(0)},specular:{value:new ye(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:on([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:on([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new ye(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:on([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:on([pe.points,pe.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:on([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:on([pe.common,pe.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:on([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:on([pe.sprite,pe.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:on([pe.common,pe.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:on([pe.lights,pe.fog,{color:{value:new ye(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};jn.physical={uniforms:on([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new ye(0)},specularColor:{value:new ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};var Ta={r:0,b:0,g:0},ss=new $t,yx=new Be;function vx(i,e,t,n,s,r,a){let o=new ye(0),l=r===!0?0:1,c,u,d=null,f=0,p=null;function y(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?t:e).get(_)),_}function x(v){let _=!1,b=y(v);b===null?m(o,l):b&&b.isColor&&(m(b,1),_=!0);let D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,_){let b=y(_);b&&(b.isCubeTexture||b.mapping===mo)?(u===void 0&&(u=new he(new Se(1,1,1),new Tt({name:"BackgroundCubeMaterial",uniforms:qs(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(D,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),ss.copy(_.backgroundRotation),ss.x*=-1,ss.y*=-1,ss.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),u.material.uniforms.envMap.value=b,u.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(yx.makeRotationFromEuler(ss)),u.material.toneMapped=ot.getTransfer(b.colorSpace)!==gt,(d!==b||f!==b.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,d=b,f=b.version,p=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new he(new Pt(2,2),new Tt({name:"BackgroundMaterial",uniforms:qs(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:zi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=ot.getTransfer(b.colorSpace)!==gt,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(d!==b||f!==b.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,d=b,f=b.version,p=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,_){v.getRGB(Ta,qd(i)),n.buffers.color.setClear(Ta.r,Ta.g,Ta.b,_,a)}return{getClearColor:function(){return o},setClearColor:function(v,_=1){o.set(v),l=_,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,m(o,l)},render:x,addToRenderList:g}}function _x(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(M,I,k,O,G){let X=!1,z=d(O,k,I);r!==z&&(r=z,c(r.object)),X=p(M,O,k,G),X&&y(M,O,k,G),G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,b(M,I,k,O),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function d(M,I,k){let O=k.wireframe===!0,G=n[M.id];G===void 0&&(G={},n[M.id]=G);let X=G[I.id];X===void 0&&(X={},G[I.id]=X);let z=X[O];return z===void 0&&(z=f(l()),X[O]=z),z}function f(M){let I=[],k=[],O=[];for(let G=0;G<t;G++)I[G]=0,k[G]=0,O[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:k,attributeDivisors:O,object:M,attributes:{},index:null}}function p(M,I,k,O){let G=r.attributes,X=I.attributes,z=0,K=k.getAttributes();for(let W in K)if(K[W].location>=0){let re=G[W],be=X[W];if(be===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(be=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(be=M.instanceColor)),re===void 0||re.attribute!==be||be&&re.data!==be.data)return!0;z++}return r.attributesNum!==z||r.index!==O}function y(M,I,k,O){let G={},X=I.attributes,z=0,K=k.getAttributes();for(let W in K)if(K[W].location>=0){let re=X[W];re===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(re=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(re=M.instanceColor));let be={};be.attribute=re,re&&re.data&&(be.data=re.data),G[W]=be,z++}r.attributes=G,r.attributesNum=z,r.index=O}function x(){let M=r.newAttributes;for(let I=0,k=M.length;I<k;I++)M[I]=0}function g(M){m(M,0)}function m(M,I){let k=r.newAttributes,O=r.enabledAttributes,G=r.attributeDivisors;k[M]=1,O[M]===0&&(i.enableVertexAttribArray(M),O[M]=1),G[M]!==I&&(i.vertexAttribDivisor(M,I),G[M]=I)}function v(){let M=r.newAttributes,I=r.enabledAttributes;for(let k=0,O=I.length;k<O;k++)I[k]!==M[k]&&(i.disableVertexAttribArray(k),I[k]=0)}function _(M,I,k,O,G,X,z){z===!0?i.vertexAttribIPointer(M,I,k,G,X):i.vertexAttribPointer(M,I,k,O,G,X)}function b(M,I,k,O){x();let G=O.attributes,X=k.getAttributes(),z=I.defaultAttributeValues;for(let K in X){let W=X[K];if(W.location>=0){let te=G[K];if(te===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(te=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(te=M.instanceColor)),te!==void 0){let re=te.normalized,be=te.itemSize,Pe=e.get(te);if(Pe===void 0)continue;let Ye=Pe.buffer,Z=Pe.type,oe=Pe.bytesPerElement,we=Z===i.INT||Z===i.UNSIGNED_INT||te.gpuType===mh;if(te.isInterleavedBufferAttribute){let ue=te.data,Ce=ue.stride,ze=te.offset;if(ue.isInstancedInterleavedBuffer){for(let Ve=0;Ve<W.locationSize;Ve++)m(W.location+Ve,ue.meshPerAttribute);M.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let Ve=0;Ve<W.locationSize;Ve++)g(W.location+Ve);i.bindBuffer(i.ARRAY_BUFFER,Ye);for(let Ve=0;Ve<W.locationSize;Ve++)_(W.location+Ve,be/W.locationSize,Z,re,Ce*oe,(ze+be/W.locationSize*Ve)*oe,we)}else{if(te.isInstancedBufferAttribute){for(let ue=0;ue<W.locationSize;ue++)m(W.location+ue,te.meshPerAttribute);M.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ue=0;ue<W.locationSize;ue++)g(W.location+ue);i.bindBuffer(i.ARRAY_BUFFER,Ye);for(let ue=0;ue<W.locationSize;ue++)_(W.location+ue,be/W.locationSize,Z,re,be*oe,be/W.locationSize*ue*oe,we)}}else if(z!==void 0){let re=z[K];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(W.location,re);break;case 3:i.vertexAttrib3fv(W.location,re);break;case 4:i.vertexAttrib4fv(W.location,re);break;default:i.vertexAttrib1fv(W.location,re)}}}}v()}function D(){A();for(let M in n){let I=n[M];for(let k in I){let O=I[k];for(let G in O)u(O[G].object),delete O[G];delete I[k]}delete n[M]}}function T(M){if(n[M.id]===void 0)return;let I=n[M.id];for(let k in I){let O=I[k];for(let G in O)u(O[G].object),delete O[G];delete I[k]}delete n[M.id]}function C(M){for(let I in n){let k=n[I];if(k[M.id]===void 0)continue;let O=k[M.id];for(let G in O)u(O[G].object),delete O[G];delete k[M.id]}}function A(){w(),a=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:w,dispose:D,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function Mx(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,d){d!==0&&(i.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function o(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,d);let p=0;for(let y=0;y<d;y++)p+=u[y];t.update(p,n,1)}function l(c,u,d,f){if(d===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let y=0;y<c.length;y++)a(c[y],u[y],f[y]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,d);let y=0;for(let x=0;x<d;x++)y+=u[x]*f[x];t.update(y,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function bx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==ln&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let A=C===Nt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Xn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==gn&&!A)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=y>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:y,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:v,maxVaryings:_,maxFragmentUniforms:b,vertexTextures:D,maxSamples:T}}function wx(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Wn,o=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let p=d.length!==0||f||n!==0||s;return s=f,n=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,p){let y=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,m=i.get(d);if(!s||y===null||y.length===0||r&&!g)r?u(null):c();else{let v=r?0:n,_=v*4,b=m.clippingState||null;l.value=b,b=u(y,f,_,p);for(let D=0;D!==_;++D)b[D]=t[D];m.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,p,y){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=l.value,y!==!0||g===null){let m=p+x*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<m)&&(g=new Float32Array(m));for(let _=0,b=p;_!==x;++_,b+=4)a.copy(d[_]).applyMatrix4(v,o),a.normal.toArray(g,b),g[b+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Ex(i){let e=new WeakMap;function t(a,o){return o===Sr?a.mapping=Ws:o===Wl&&(a.mapping=Xs),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Sr||o===Wl)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new wc(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Ys=class extends qa{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},zs=4,Zu=[.125,.215,.35,.446,.526,.582],ls=20,El=new Ys,Ku=new ye,Sl=null,Tl=0,Al=0,Rl=!1,as=(1+Math.sqrt(5))/2,Os=1/as,Ju=[new L(-as,Os,0),new L(as,Os,0),new L(-Os,0,as),new L(Os,0,as),new L(0,as,-Os),new L(0,as,Os),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],$s=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Sl=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),Al=this._renderer.getActiveMipmapLevel(),Rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ed(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Sl,Tl,Al),this._renderer.xr.enabled=Rl,e.scissorTest=!1,Aa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ws||e.mapping===Xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sl=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),Al=this._renderer.getActiveMipmapLevel(),Rl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ht,minFilter:Ht,generateMipmaps:!1,type:Nt,format:ln,colorSpace:ti,depthBuffer:!1},s=ju(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ju(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Sx(r)),this._blurMaterial=Tx(r,e,t)}return s}_compileMaterial(e){let t=new he(this._lodPlanes[0],e);this._renderer.compile(t,El)}_sceneToCubeUV(e,t,n,s){let o=new Jt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Ku),u.toneMapping=ki,u.autoClear=!1;let p=new ft({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),y=new he(new Se,p),x=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,x=!0):(p.color.copy(Ku),x=!0);for(let m=0;m<6;m++){let v=m%3;v===0?(o.up.set(0,l[m],0),o.lookAt(c[m],0,0)):v===1?(o.up.set(0,0,l[m]),o.lookAt(0,c[m],0)):(o.up.set(0,l[m],0),o.lookAt(0,0,c[m]));let _=this._cubeSize;Aa(s,v*_,m>2?_:0,_,_),u.setRenderTarget(s),x&&u.render(y,o),u.render(e,o)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ws||e.mapping===Xs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ed()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new he(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Aa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,El)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Ju[(s-r-1)%Ju.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,d=new he(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ls-1),x=r/y,g=isFinite(r)?1+Math.floor(u*x):ls;g>ls&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ls}`);let m=[],v=0;for(let C=0;C<ls;++C){let A=C/x,w=Math.exp(-A*A/2);m.push(w),C===0?v+=w:C<g&&(v+=2*w)}for(let C=0;C<m.length;C++)m[C]=m[C]/v;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:_}=this;f.dTheta.value=y,f.mipInt.value=_-n;let b=this._sizeLods[s],D=3*b*(s>_-zs?s-_+zs:0),T=4*(this._cubeSize-b);Aa(t,D,T,3*b,2*b),l.setRenderTarget(t),l.render(d,El)}};function Sx(i){let e=[],t=[],n=[],s=i,r=i-zs+1+Zu.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>i-zs?l=Zu[a-i+zs-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,y=6,x=3,g=2,m=1,v=new Float32Array(x*y*p),_=new Float32Array(g*y*p),b=new Float32Array(m*y*p);for(let T=0;T<p;T++){let C=T%3*2/3-1,A=T>2?0:-1,w=[C,A,0,C+2/3,A,0,C+2/3,A+1,0,C,A,0,C+2/3,A+1,0,C,A+1,0];v.set(w,x*y*T),_.set(f,g*y*T);let M=[T,T,T,T,T,T];b.set(M,m*y*T)}let D=new zt;D.setAttribute("position",new Ot(v,x)),D.setAttribute("uv",new Ot(_,g)),D.setAttribute("faceIndex",new Ot(b,m)),e.push(D),s>zs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ju(i,e,t){let n=new kt(i,e,t);return n.texture.mapping=mo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Aa(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Tx(i,e,t){let n=new Float32Array(ls),s=new L(0,1,0);return new Tt({name:"SphericalGaussianBlur",defines:{n:ls,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:wh(),fragmentShader:`

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
		`,blending:Gt,depthTest:!1,depthWrite:!1})}function Qu(){return new Tt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wh(),fragmentShader:`

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
		`,blending:Gt,depthTest:!1,depthWrite:!1})}function ed(){return new Tt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gt,depthTest:!1,depthWrite:!1})}function wh(){return`

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
	`}function Ax(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===Sr||l===Wl,u=l===Ws||l===Xs;if(c||u){let d=e.get(o),f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new $s(i)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{let p=o.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new $s(i)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0,c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Rx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&_r("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Cx(i,e,t,n){let s={},r=new WeakMap;function a(d){let f=d.target;f.index!==null&&e.remove(f.index);for(let y in f.attributes)e.remove(f.attributes[y]);for(let y in f.morphAttributes){let x=f.morphAttributes[y];for(let g=0,m=x.length;g<m;g++)e.remove(x[g])}f.removeEventListener("dispose",a),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(d){let f=d.attributes;for(let y in f)e.update(f[y],i.ARRAY_BUFFER);let p=d.morphAttributes;for(let y in p){let x=p[y];for(let g=0,m=x.length;g<m;g++)e.update(x[g],i.ARRAY_BUFFER)}}function c(d){let f=[],p=d.index,y=d.attributes.position,x=0;if(p!==null){let v=p.array;x=p.version;for(let _=0,b=v.length;_<b;_+=3){let D=v[_+0],T=v[_+1],C=v[_+2];f.push(D,T,T,C,C,D)}}else if(y!==void 0){let v=y.array;x=y.version;for(let _=0,b=v.length/3-1;_<b;_+=3){let D=_+0,T=_+1,C=_+2;f.push(D,T,T,C,C,D)}}else return;let g=new(Wd(f)?Xa:Wa)(f,1);g.version=x;let m=r.get(d);m&&e.remove(m),r.set(d,g)}function u(d){let f=r.get(d);if(f){let p=d.index;p!==null&&f.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function Ix(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*a),t.update(p,n,1)}function c(f,p,y){y!==0&&(i.drawElementsInstanced(n,p,r,f*a,y),t.update(p,n,y))}function u(f,p,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,y);let g=0;for(let m=0;m<y;m++)g+=p[m];t.update(g,n,1)}function d(f,p,y,x){if(y===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<f.length;m++)c(f[m]/a,p[m],x[m]);else{g.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,y);let m=0;for(let v=0;v<y;v++)m+=p[v]*x[v];t.update(m,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Px(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Lx(i,e,t){let n=new WeakMap,s=new vt;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,f=n.get(o);if(f===void 0||f.count!==d){let w=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();let p=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],_=0;p===!0&&(_=1),y===!0&&(_=2),x===!0&&(_=3);let b=o.attributes.position.count*_,D=1;b>e.maxTextureSize&&(D=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let T=new Float32Array(b*D*4*d),C=new Va(T,b,D,d);C.type=gn,C.needsUpdate=!0;let A=_*4;for(let M=0;M<d;M++){let I=g[M],k=m[M],O=v[M],G=b*D*4*M;for(let X=0;X<I.count;X++){let z=X*A;p===!0&&(s.fromBufferAttribute(I,X),T[G+z+0]=s.x,T[G+z+1]=s.y,T[G+z+2]=s.z,T[G+z+3]=0),y===!0&&(s.fromBufferAttribute(k,X),T[G+z+4]=s.x,T[G+z+5]=s.y,T[G+z+6]=s.z,T[G+z+7]=0),x===!0&&(s.fromBufferAttribute(O,X),T[G+z+8]=s.x,T[G+z+9]=s.y,T[G+z+10]=s.z,T[G+z+11]=O.itemSize===4?s.w:1)}}f={count:d,texture:C,size:new le(b,D)},n.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];let y=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",y),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Dx(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,d=e.get(l,u);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}var Zs=class extends cn{constructor(e,t,n,s,r,a,o,l,c,u=Bs){if(u!==Bs&&u!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Bs&&(n=cs),n===void 0&&u===Bi&&(n=Fi),super(null,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:rn,this.minFilter=l!==void 0?l:rn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},$d=new cn,td=new Zs(1,1),Zd=new Va,Kd=new Mc,Jd=new Ya,nd=[],id=[],sd=new Float32Array(16),rd=new Float32Array(9),ad=new Float32Array(4);function tr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=nd[s];if(r===void 0&&(r=new Float32Array(s),nd[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function xo(i,e){let t=id[e];t===void 0&&(t=new Int32Array(e),id[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Nx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Ux(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2fv(this.addr,e),Wt(t,e)}}function Ox(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;i.uniform3fv(this.addr,e),Wt(t,e)}}function kx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4fv(this.addr,e),Wt(t,e)}}function zx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Wt(t,e)}else{if(Vt(t,n))return;ad.set(n),i.uniformMatrix2fv(this.addr,!1,ad),Wt(t,n)}}function Fx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Wt(t,e)}else{if(Vt(t,n))return;rd.set(n),i.uniformMatrix3fv(this.addr,!1,rd),Wt(t,n)}}function Bx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Wt(t,e)}else{if(Vt(t,n))return;sd.set(n),i.uniformMatrix4fv(this.addr,!1,sd),Wt(t,n)}}function Hx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Gx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2iv(this.addr,e),Wt(t,e)}}function Vx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3iv(this.addr,e),Wt(t,e)}}function Wx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4iv(this.addr,e),Wt(t,e)}}function Xx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function qx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2uiv(this.addr,e),Wt(t,e)}}function Yx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3uiv(this.addr,e),Wt(t,e)}}function $x(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4uiv(this.addr,e),Wt(t,e)}}function Zx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(td.compareFunction=Vd,r=td):r=$d,t.setTexture2D(e||r,s)}function Kx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Kd,s)}function Jx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Jd,s)}function jx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Zd,s)}function Qx(i){switch(i){case 5126:return Nx;case 35664:return Ux;case 35665:return Ox;case 35666:return kx;case 35674:return zx;case 35675:return Fx;case 35676:return Bx;case 5124:case 35670:return Hx;case 35667:case 35671:return Gx;case 35668:case 35672:return Vx;case 35669:case 35673:return Wx;case 5125:return Xx;case 36294:return qx;case 36295:return Yx;case 36296:return $x;case 35678:case 36198:case 36298:case 36306:case 35682:return Zx;case 35679:case 36299:case 36307:return Kx;case 35680:case 36300:case 36308:case 36293:return Jx;case 36289:case 36303:case 36311:case 36292:return jx}}function ey(i,e){i.uniform1fv(this.addr,e)}function ty(i,e){let t=tr(e,this.size,2);i.uniform2fv(this.addr,t)}function ny(i,e){let t=tr(e,this.size,3);i.uniform3fv(this.addr,t)}function iy(i,e){let t=tr(e,this.size,4);i.uniform4fv(this.addr,t)}function sy(i,e){let t=tr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function ry(i,e){let t=tr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function ay(i,e){let t=tr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function oy(i,e){i.uniform1iv(this.addr,e)}function ly(i,e){i.uniform2iv(this.addr,e)}function cy(i,e){i.uniform3iv(this.addr,e)}function hy(i,e){i.uniform4iv(this.addr,e)}function uy(i,e){i.uniform1uiv(this.addr,e)}function dy(i,e){i.uniform2uiv(this.addr,e)}function fy(i,e){i.uniform3uiv(this.addr,e)}function py(i,e){i.uniform4uiv(this.addr,e)}function my(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||$d,r[a])}function gy(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Kd,r[a])}function xy(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Jd,r[a])}function yy(i,e,t){let n=this.cache,s=e.length,r=xo(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Zd,r[a])}function vy(i){switch(i){case 5126:return ey;case 35664:return ty;case 35665:return ny;case 35666:return iy;case 35674:return sy;case 35675:return ry;case 35676:return ay;case 5124:case 35670:return oy;case 35667:case 35671:return ly;case 35668:case 35672:return cy;case 35669:case 35673:return hy;case 5125:return uy;case 36294:return dy;case 36295:return fy;case 36296:return py;case 35678:case 36198:case 36298:case 36306:case 35682:return my;case 35679:case 36299:case 36307:return gy;case 35680:case 36300:case 36308:case 36293:return xy;case 36289:case 36303:case 36311:case 36292:return yy}}var Ec=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Qx(t.type)}},Sc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=vy(t.type)}},Tc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Cl=/(\w+)(\])?(\[|\.)?/g;function od(i,e){i.seq.push(e),i.map[e.id]=e}function _y(i,e,t){let n=i.name,s=n.length;for(Cl.lastIndex=0;;){let r=Cl.exec(n),a=Cl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){od(t,c===void 0?new Ec(o,i,e):new Sc(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Tc(o),od(t,d)),t=d}}}var Gs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);_y(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function ld(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var My=37297,by=0;function wy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var cd=new Ke;function Ey(i){ot._getMatrix(cd,ot.workingColorSpace,i);let e=`mat3( ${cd.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(i)){case go:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function hd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+wy(i.getShaderSource(e),a)}else return s}function Sy(i,e){let t=Ey(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Ty(i,e){let t;switch(e){case hh:t="Linear";break;case uh:t="Reinhard";break;case dh:t="Cineon";break;case Ur:t="ACESFilmic";break;case fh:t="AgX";break;case ph:t="Neutral";break;case tm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ra=new L;function Ay(){ot.getLuminanceCoefficients(Ra);let i=Ra.x.toFixed(4),e=Ra.y.toFixed(4),t=Ra.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ry(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mr).join(`
`)}function Cy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Iy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Mr(i){return i!==""}function ud(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function dd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Py=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ac(i){return i.replace(Py,Dy)}var Ly=new Map;function Dy(i,e){let t=Je[e];if(t===void 0){let n=Ly.get(e);if(n!==void 0)t=Je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ac(t)}var Ny=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fd(i){return i.replace(Ny,Uy)}function Uy(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function pd(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Oy(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Pd?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===lh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===vi&&(e="SHADOWMAP_TYPE_VSM"),e}function ky(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ws:case Xs:e="ENVMAP_TYPE_CUBE";break;case mo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function zy(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Xs:e="ENVMAP_MODE_REFRACTION";break}return e}function Fy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ld:e="ENVMAP_BLENDING_MULTIPLY";break;case Qp:e="ENVMAP_BLENDING_MIX";break;case em:e="ENVMAP_BLENDING_ADD";break}return e}function By(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Hy(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=Oy(t),c=ky(t),u=zy(t),d=Fy(t),f=By(t),p=Ry(t),y=Cy(r),x=s.createProgram(),g,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Mr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Mr).join(`
`),m.length>0&&(m+=`
`)):(g=[pd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mr).join(`
`),m=[pd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ki?"#define TONE_MAPPING":"",t.toneMapping!==ki?Je.tonemapping_pars_fragment:"",t.toneMapping!==ki?Ty("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,Sy("linearToOutputTexel",t.outputColorSpace),Ay(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Mr).join(`
`)),a=Ac(a),a=ud(a,t),a=dd(a,t),o=Ac(o),o=ud(o,t),o=dd(o,t),a=fd(a),o=fd(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Ru?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ru?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let _=v+g+a,b=v+m+o,D=ld(s,s.VERTEX_SHADER,_),T=ld(s,s.FRAGMENT_SHADER,b);s.attachShader(x,D),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(I){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(x).trim(),O=s.getShaderInfoLog(D).trim(),G=s.getShaderInfoLog(T).trim(),X=!0,z=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,D,T);else{let K=hd(s,D,"vertex"),W=hd(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+k+`
`+K+`
`+W)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(O===""||G==="")&&(z=!1);z&&(I.diagnostics={runnable:X,programLog:k,vertexShader:{log:O,prefix:g},fragmentShader:{log:G,prefix:m}})}s.deleteShader(D),s.deleteShader(T),A=new Gs(s,x),w=Iy(s,x)}let A;this.getUniforms=function(){return A===void 0&&C(this),A};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,My)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=by++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=D,this.fragmentShader=T,this}var Gy=0,Rc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Cc(e),t.set(e,n)),n}},Cc=class{constructor(e){this.id=Gy++,this.code=e,this.usedTimes=0}};function Vy(i,e,t,n,s,r,a){let o=new Cr,l=new Rc,c=new Set,u=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return c.add(w),w===0?"uv":`uv${w}`}function g(w,M,I,k,O){let G=k.fog,X=O.geometry,z=w.isMeshStandardMaterial?k.environment:null,K=(w.isMeshStandardMaterial?t:e).get(w.envMap||z),W=K&&K.mapping===mo?K.image.height:null,te=y[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));let re=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,be=re!==void 0?re.length:0,Pe=0;X.morphAttributes.position!==void 0&&(Pe=1),X.morphAttributes.normal!==void 0&&(Pe=2),X.morphAttributes.color!==void 0&&(Pe=3);let Ye,Z,oe,we;if(te){let yt=jn[te];Ye=yt.vertexShader,Z=yt.fragmentShader}else Ye=w.vertexShader,Z=w.fragmentShader,l.update(w),oe=l.getVertexShaderID(w),we=l.getFragmentShaderID(w);let ue=i.getRenderTarget(),Ce=i.state.buffers.depth.getReversed(),ze=O.isInstancedMesh===!0,Ve=O.isBatchedMesh===!0,Mt=!!w.map,st=!!w.matcap,wt=!!K,F=!!w.aoMap,Qt=!!w.lightMap,et=!!w.bumpMap,tt=!!w.normalMap,Oe=!!w.displacementMap,xt=!!w.emissiveMap,Ne=!!w.metalnessMap,R=!!w.roughnessMap,E=w.anisotropy>0,V=w.clearcoat>0,Q=w.dispersion>0,se=w.iridescence>0,J=w.sheen>0,Ee=w.transmission>0,fe=E&&!!w.anisotropyMap,me=V&&!!w.clearcoatMap,je=V&&!!w.clearcoatNormalMap,ae=V&&!!w.clearcoatRoughnessMap,_e=se&&!!w.iridescenceMap,Fe=se&&!!w.iridescenceThicknessMap,Ge=J&&!!w.sheenColorMap,Me=J&&!!w.sheenRoughnessMap,rt=!!w.specularMap,We=!!w.specularColorMap,ct=!!w.specularIntensityMap,U=Ee&&!!w.transmissionMap,de=Ee&&!!w.thicknessMap,$=!!w.gradientMap,ne=!!w.alphaMap,ve=w.alphaTest>0,ge=!!w.alphaHash,$e=!!w.extensions,It=ki;w.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(It=i.toneMapping);let en={shaderID:te,shaderType:w.type,shaderName:w.name,vertexShader:Ye,fragmentShader:Z,defines:w.defines,customVertexShaderID:oe,customFragmentShaderID:we,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ve,batchingColor:Ve&&O._colorsTexture!==null,instancing:ze,instancingColor:ze&&O.instanceColor!==null,instancingMorph:ze&&O.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ue===null?i.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:ti,alphaToCoverage:!!w.alphaToCoverage,map:Mt,matcap:st,envMap:wt,envMapMode:wt&&K.mapping,envMapCubeUVHeight:W,aoMap:F,lightMap:Qt,bumpMap:et,normalMap:tt,displacementMap:f&&Oe,emissiveMap:xt,normalMapObjectSpace:tt&&w.normalMapType===rm,normalMapTangentSpace:tt&&w.normalMapType===bh,metalnessMap:Ne,roughnessMap:R,anisotropy:E,anisotropyMap:fe,clearcoat:V,clearcoatMap:me,clearcoatNormalMap:je,clearcoatRoughnessMap:ae,dispersion:Q,iridescence:se,iridescenceMap:_e,iridescenceThicknessMap:Fe,sheen:J,sheenColorMap:Ge,sheenRoughnessMap:Me,specularMap:rt,specularColorMap:We,specularIntensityMap:ct,transmission:Ee,transmissionMap:U,thicknessMap:de,gradientMap:$,opaque:w.transparent===!1&&w.blending===Fs&&w.alphaToCoverage===!1,alphaMap:ne,alphaTest:ve,alphaHash:ge,combine:w.combine,mapUv:Mt&&x(w.map.channel),aoMapUv:F&&x(w.aoMap.channel),lightMapUv:Qt&&x(w.lightMap.channel),bumpMapUv:et&&x(w.bumpMap.channel),normalMapUv:tt&&x(w.normalMap.channel),displacementMapUv:Oe&&x(w.displacementMap.channel),emissiveMapUv:xt&&x(w.emissiveMap.channel),metalnessMapUv:Ne&&x(w.metalnessMap.channel),roughnessMapUv:R&&x(w.roughnessMap.channel),anisotropyMapUv:fe&&x(w.anisotropyMap.channel),clearcoatMapUv:me&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:je&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:Fe&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ge&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:Me&&x(w.sheenRoughnessMap.channel),specularMapUv:rt&&x(w.specularMap.channel),specularColorMapUv:We&&x(w.specularColorMap.channel),specularIntensityMapUv:ct&&x(w.specularIntensityMap.channel),transmissionMapUv:U&&x(w.transmissionMap.channel),thicknessMapUv:de&&x(w.thicknessMap.channel),alphaMapUv:ne&&x(w.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(tt||E),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!X.attributes.uv&&(Mt||ne),fog:!!G,useFog:w.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Ce,skinning:O.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Pe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:It,decodeVideoTexture:Mt&&w.map.isVideoTexture===!0&&ot.getTransfer(w.map.colorSpace)===gt,decodeVideoTextureEmissive:xt&&w.emissiveMap.isVideoTexture===!0&&ot.getTransfer(w.emissiveMap.colorSpace)===gt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Bt,flipSided:w.side===sn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:$e&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:($e&&w.extensions.multiDraw===!0||Ve)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return en.vertexUv1s=c.has(1),en.vertexUv2s=c.has(2),en.vertexUv3s=c.has(3),c.clear(),en}function m(w){let M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(let I in w.defines)M.push(I),M.push(w.defines[I]);return w.isRawShaderMaterial===!1&&(v(M,w),_(M,w),M.push(i.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function v(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function _(w,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),w.push(o.mask)}function b(w){let M=y[w.type],I;if(M){let k=jn[M];I=vn.clone(k.uniforms)}else I=w.uniforms;return I}function D(w,M){let I;for(let k=0,O=u.length;k<O;k++){let G=u[k];if(G.cacheKey===M){I=G,++I.usedTimes;break}}return I===void 0&&(I=new Hy(i,M,w,r),u.push(I)),I}function T(w){if(--w.usedTimes===0){let M=u.indexOf(w);u[M]=u[u.length-1],u.pop(),w.destroy()}}function C(w){l.remove(w)}function A(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:b,acquireProgram:D,releaseProgram:T,releaseShaderCache:C,programs:u,dispose:A}}function Wy(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Xy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function md(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function gd(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d,f,p,y,x,g){let m=i[e];return m===void 0?(m={id:d.id,object:d,geometry:f,material:p,groupOrder:y,renderOrder:d.renderOrder,z:x,group:g},i[e]=m):(m.id=d.id,m.object=d,m.geometry=f,m.material=p,m.groupOrder=y,m.renderOrder=d.renderOrder,m.z=x,m.group=g),e++,m}function o(d,f,p,y,x,g){let m=a(d,f,p,y,x,g);p.transmission>0?n.push(m):p.transparent===!0?s.push(m):t.push(m)}function l(d,f,p,y,x,g){let m=a(d,f,p,y,x,g);p.transmission>0?n.unshift(m):p.transparent===!0?s.unshift(m):t.unshift(m)}function c(d,f){t.length>1&&t.sort(d||Xy),n.length>1&&n.sort(f||md),s.length>1&&s.sort(f||md)}function u(){for(let d=e,f=i.length;d<f;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function qy(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new gd,i.set(n,[a])):s>=r.length?(a=new gd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Yy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new ye};break;case"SpotLight":t={position:new L,direction:new L,color:new ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new ye,groundColor:new ye};break;case"RectAreaLight":t={color:new ye,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function $y(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Zy=0;function Ky(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Jy(i){let e=new Yy,t=$y(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new Be,a=new Be;function o(c){let u=0,d=0,f=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let p=0,y=0,x=0,g=0,m=0,v=0,_=0,b=0,D=0,T=0,C=0;c.sort(Ky);for(let w=0,M=c.length;w<M;w++){let I=c[w],k=I.color,O=I.intensity,G=I.distance,X=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=k.r*O,d+=k.g*O,f+=k.b*O;else if(I.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(I.sh.coefficients[z],O);C++}else if(I.isDirectionalLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let K=I.shadow,W=t.get(I);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,n.directionalShadow[p]=W,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=I.shadow.matrix,v++}n.directional[p]=z,p++}else if(I.isSpotLight){let z=e.get(I);z.position.setFromMatrixPosition(I.matrixWorld),z.color.copy(k).multiplyScalar(O),z.distance=G,z.coneCos=Math.cos(I.angle),z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),z.decay=I.decay,n.spot[x]=z;let K=I.shadow;if(I.map&&(n.spotLightMap[D]=I.map,D++,K.updateMatrices(I),I.castShadow&&T++),n.spotLightMatrix[x]=K.matrix,I.castShadow){let W=t.get(I);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,n.spotShadow[x]=W,n.spotShadowMap[x]=X,b++}x++}else if(I.isRectAreaLight){let z=e.get(I);z.color.copy(k).multiplyScalar(O),z.halfWidth.set(I.width*.5,0,0),z.halfHeight.set(0,I.height*.5,0),n.rectArea[g]=z,g++}else if(I.isPointLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),z.distance=I.distance,z.decay=I.decay,I.castShadow){let K=I.shadow,W=t.get(I);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,W.shadowCameraNear=K.camera.near,W.shadowCameraFar=K.camera.far,n.pointShadow[y]=W,n.pointShadowMap[y]=X,n.pointShadowMatrix[y]=I.shadow.matrix,_++}n.point[y]=z,y++}else if(I.isHemisphereLight){let z=e.get(I);z.skyColor.copy(I.color).multiplyScalar(O),z.groundColor.copy(I.groundColor).multiplyScalar(O),n.hemi[m]=z,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pe.LTC_FLOAT_1,n.rectAreaLTC2=pe.LTC_FLOAT_2):(n.rectAreaLTC1=pe.LTC_HALF_1,n.rectAreaLTC2=pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;let A=n.hash;(A.directionalLength!==p||A.pointLength!==y||A.spotLength!==x||A.rectAreaLength!==g||A.hemiLength!==m||A.numDirectionalShadows!==v||A.numPointShadows!==_||A.numSpotShadows!==b||A.numSpotMaps!==D||A.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=g,n.point.length=y,n.hemi.length=m,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=b+D-T,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=C,A.directionalLength=p,A.pointLength=y,A.spotLength=x,A.rectAreaLength=g,A.hemiLength=m,A.numDirectionalShadows=v,A.numPointShadows=_,A.numSpotShadows=b,A.numSpotMaps=D,A.numLightProbes=C,n.version=Zy++)}function l(c,u){let d=0,f=0,p=0,y=0,x=0,g=u.matrixWorldInverse;for(let m=0,v=c.length;m<v;m++){let _=c[m];if(_.isDirectionalLight){let b=n.directional[d];b.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),d++}else if(_.isSpotLight){let b=n.spot[p];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),p++}else if(_.isRectAreaLight){let b=n.rectArea[y];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(_.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),y++}else if(_.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),f++}else if(_.isHemisphereLight){let b=n.hemi[x];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:n}}function xd(i){let e=new Jy(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function jy(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new xd(i),e.set(s,[o])):r>=a.length?(o=new xd(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Ic=class extends Ei{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=im,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Pc=class extends Ei{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Qy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ev=`uniform sampler2D shadow_pass;
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
}`;function tv(i,e,t){let n=new Ir,s=new le,r=new le,a=new vt,o=new Ic({depthPacking:sm}),l=new Pc,c={},u=t.maxTextureSize,d={[zi]:sn,[sn]:zi,[Bt]:Bt},f=new Tt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:Qy,fragmentShader:ev}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let y=new zt;y.setAttribute("position",new Ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new he(y,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pd;let m=this.type;this.render=function(T,C,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let w=i.getRenderTarget(),M=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),k=i.state;k.setBlending(Gt),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let O=m!==vi&&this.type===vi,G=m===vi&&this.type!==vi;for(let X=0,z=T.length;X<z;X++){let K=T[X],W=K.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let te=W.getFrameExtents();if(s.multiply(te),r.copy(W.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/te.x),s.x=r.x*te.x,W.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/te.y),s.y=r.y*te.y,W.mapSize.y=r.y)),W.map===null||O===!0||G===!0){let be=this.type!==vi?{minFilter:rn,magFilter:rn}:{};W.map!==null&&W.map.dispose(),W.map=new kt(s.x,s.y,be),W.map.texture.name=K.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();let re=W.getViewportCount();for(let be=0;be<re;be++){let Pe=W.getViewport(be);a.set(r.x*Pe.x,r.y*Pe.y,r.x*Pe.z,r.y*Pe.w),k.viewport(a),W.updateMatrices(K,be),n=W.getFrustum(),b(C,A,W.camera,K,this.type)}W.isPointLightShadow!==!0&&this.type===vi&&v(W,A),W.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(w,M,I)};function v(T,C){let A=e.update(x);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new kt(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(C,null,A,f,x,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(C,null,A,p,x,null)}function _(T,C,A,w){let M=null,I=A.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)M=I;else if(M=A.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let k=M.uuid,O=C.uuid,G=c[k];G===void 0&&(G={},c[k]=G);let X=G[O];X===void 0&&(X=M.clone(),G[O]=X,C.addEventListener("dispose",D)),M=X}if(M.visible=C.visible,M.wireframe=C.wireframe,w===vi?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:d[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,A.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let k=i.properties.get(M);k.light=A}return M}function b(T,C,A,w,M){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===vi)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,T.matrixWorld);let O=e.update(T),G=T.material;if(Array.isArray(G)){let X=O.groups;for(let z=0,K=X.length;z<K;z++){let W=X[z],te=G[W.materialIndex];if(te&&te.visible){let re=_(T,te,w,M);T.onBeforeShadow(i,T,C,A,O,re,W),i.renderBufferDirect(A,null,O,re,T,W),T.onAfterShadow(i,T,C,A,O,re,W)}}}else if(G.visible){let X=_(T,G,w,M);T.onBeforeShadow(i,T,C,A,O,X,null),i.renderBufferDirect(A,null,O,X,T,null),T.onAfterShadow(i,T,C,A,O,X,null)}}let k=T.children;for(let O=0,G=k.length;O<G;O++)b(k[O],C,A,w,M)}function D(T){T.target.removeEventListener("dispose",D);for(let A in c){let w=c[A],M=T.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}var nv={[kl]:zl,[Fl]:Gl,[Bl]:Vl,[Vs]:Hl,[zl]:kl,[Gl]:Fl,[Vl]:Bl,[Hl]:Vs};function iv(i,e){function t(){let U=!1,de=new vt,$=null,ne=new vt(0,0,0,0);return{setMask:function(ve){$!==ve&&!U&&(i.colorMask(ve,ve,ve,ve),$=ve)},setLocked:function(ve){U=ve},setClear:function(ve,ge,$e,It,en){en===!0&&(ve*=It,ge*=It,$e*=It),de.set(ve,ge,$e,It),ne.equals(de)===!1&&(i.clearColor(ve,ge,$e,It),ne.copy(de))},reset:function(){U=!1,$=null,ne.set(-1,0,0,0)}}}function n(){let U=!1,de=!1,$=null,ne=null,ve=null;return{setReversed:function(ge){if(de!==ge){let $e=e.get("EXT_clip_control");de?$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.ZERO_TO_ONE_EXT):$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.NEGATIVE_ONE_TO_ONE_EXT);let It=ve;ve=null,this.setClear(It)}de=ge},getReversed:function(){return de},setTest:function(ge){ge?ue(i.DEPTH_TEST):Ce(i.DEPTH_TEST)},setMask:function(ge){$!==ge&&!U&&(i.depthMask(ge),$=ge)},setFunc:function(ge){if(de&&(ge=nv[ge]),ne!==ge){switch(ge){case kl:i.depthFunc(i.NEVER);break;case zl:i.depthFunc(i.ALWAYS);break;case Fl:i.depthFunc(i.LESS);break;case Vs:i.depthFunc(i.LEQUAL);break;case Bl:i.depthFunc(i.EQUAL);break;case Hl:i.depthFunc(i.GEQUAL);break;case Gl:i.depthFunc(i.GREATER);break;case Vl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ne=ge}},setLocked:function(ge){U=ge},setClear:function(ge){ve!==ge&&(de&&(ge=1-ge),i.clearDepth(ge),ve=ge)},reset:function(){U=!1,$=null,ne=null,ve=null,de=!1}}}function s(){let U=!1,de=null,$=null,ne=null,ve=null,ge=null,$e=null,It=null,en=null;return{setTest:function(yt){U||(yt?ue(i.STENCIL_TEST):Ce(i.STENCIL_TEST))},setMask:function(yt){de!==yt&&!U&&(i.stencilMask(yt),de=yt)},setFunc:function(yt,Fn,ui){($!==yt||ne!==Fn||ve!==ui)&&(i.stencilFunc(yt,Fn,ui),$=yt,ne=Fn,ve=ui)},setOp:function(yt,Fn,ui){(ge!==yt||$e!==Fn||It!==ui)&&(i.stencilOp(yt,Fn,ui),ge=yt,$e=Fn,It=ui)},setLocked:function(yt){U=yt},setClear:function(yt){en!==yt&&(i.clearStencil(yt),en=yt)},reset:function(){U=!1,de=null,$=null,ne=null,ve=null,ge=null,$e=null,It=null,en=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,u={},d={},f=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,_=null,b=null,D=null,T=null,C=new ye(0,0,0),A=0,w=!1,M=null,I=null,k=null,O=null,G=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,K=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(W)[1]),z=K>=1):W.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),z=K>=2);let te=null,re={},be=i.getParameter(i.SCISSOR_BOX),Pe=i.getParameter(i.VIEWPORT),Ye=new vt().fromArray(be),Z=new vt().fromArray(Pe);function oe(U,de,$,ne){let ve=new Uint8Array(4),ge=i.createTexture();i.bindTexture(U,ge),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let $e=0;$e<$;$e++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(de,0,i.RGBA,1,1,ne,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(de+$e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return ge}let we={};we[i.TEXTURE_2D]=oe(i.TEXTURE_2D,i.TEXTURE_2D,1),we[i.TEXTURE_CUBE_MAP]=oe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),we[i.TEXTURE_2D_ARRAY]=oe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),we[i.TEXTURE_3D]=oe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ue(i.DEPTH_TEST),a.setFunc(Vs),et(!1),tt(_u),ue(i.CULL_FACE),F(Gt);function ue(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function Ce(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function ze(U,de){return d[U]!==de?(i.bindFramebuffer(U,de),d[U]=de,U===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=de),U===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=de),!0):!1}function Ve(U,de){let $=p,ne=!1;if(U){$=f.get(de),$===void 0&&($=[],f.set(de,$));let ve=U.textures;if($.length!==ve.length||$[0]!==i.COLOR_ATTACHMENT0){for(let ge=0,$e=ve.length;ge<$e;ge++)$[ge]=i.COLOR_ATTACHMENT0+ge;$.length=ve.length,ne=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,ne=!0);ne&&i.drawBuffers($)}function Mt(U){return y!==U?(i.useProgram(U),y=U,!0):!1}let st={[Un]:i.FUNC_ADD,[Fp]:i.FUNC_SUBTRACT,[Bp]:i.FUNC_REVERSE_SUBTRACT};st[Hp]=i.MIN,st[Gp]=i.MAX;let wt={[er]:i.ZERO,[Vp]:i.ONE,[Wp]:i.SRC_COLOR,[Ul]:i.SRC_ALPHA,[$p]:i.SRC_ALPHA_SATURATE,[po]:i.DST_COLOR,[fo]:i.DST_ALPHA,[Xp]:i.ONE_MINUS_SRC_COLOR,[Ol]:i.ONE_MINUS_SRC_ALPHA,[Yp]:i.ONE_MINUS_DST_COLOR,[qp]:i.ONE_MINUS_DST_ALPHA,[Zp]:i.CONSTANT_COLOR,[Kp]:i.ONE_MINUS_CONSTANT_COLOR,[Jp]:i.CONSTANT_ALPHA,[jp]:i.ONE_MINUS_CONSTANT_ALPHA};function F(U,de,$,ne,ve,ge,$e,It,en,yt){if(U===Gt){x===!0&&(Ce(i.BLEND),x=!1);return}if(x===!1&&(ue(i.BLEND),x=!0),U!==ch){if(U!==g||yt!==w){if((m!==Un||b!==Un)&&(i.blendEquation(i.FUNC_ADD),m=Un,b=Un),yt)switch(U){case Fs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xn:i.blendFunc(i.ONE,i.ONE);break;case Mu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Fs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Mu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}v=null,_=null,D=null,T=null,C.set(0,0,0),A=0,g=U,w=yt}return}ve=ve||de,ge=ge||$,$e=$e||ne,(de!==m||ve!==b)&&(i.blendEquationSeparate(st[de],st[ve]),m=de,b=ve),($!==v||ne!==_||ge!==D||$e!==T)&&(i.blendFuncSeparate(wt[$],wt[ne],wt[ge],wt[$e]),v=$,_=ne,D=ge,T=$e),(It.equals(C)===!1||en!==A)&&(i.blendColor(It.r,It.g,It.b,en),C.copy(It),A=en),g=U,w=!1}function Qt(U,de){U.side===Bt?Ce(i.CULL_FACE):ue(i.CULL_FACE);let $=U.side===sn;de&&($=!$),et($),U.blending===Fs&&U.transparent===!1?F(Gt):F(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);let ne=U.stencilWrite;o.setTest(ne),ne&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),xt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ue(i.SAMPLE_ALPHA_TO_COVERAGE):Ce(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(U){M!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),M=U)}function tt(U){U!==kp?(ue(i.CULL_FACE),U!==I&&(U===_u?i.cullFace(i.BACK):U===zp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ce(i.CULL_FACE),I=U}function Oe(U){U!==k&&(z&&i.lineWidth(U),k=U)}function xt(U,de,$){U?(ue(i.POLYGON_OFFSET_FILL),(O!==de||G!==$)&&(i.polygonOffset(de,$),O=de,G=$)):Ce(i.POLYGON_OFFSET_FILL)}function Ne(U){U?ue(i.SCISSOR_TEST):Ce(i.SCISSOR_TEST)}function R(U){U===void 0&&(U=i.TEXTURE0+X-1),te!==U&&(i.activeTexture(U),te=U)}function E(U,de,$){$===void 0&&(te===null?$=i.TEXTURE0+X-1:$=te);let ne=re[$];ne===void 0&&(ne={type:void 0,texture:void 0},re[$]=ne),(ne.type!==U||ne.texture!==de)&&(te!==$&&(i.activeTexture($),te=$),i.bindTexture(U,de||we[U]),ne.type=U,ne.texture=de)}function V(){let U=re[te];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ee(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function fe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function je(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _e(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Fe(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ge(U){Ye.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Ye.copy(U))}function Me(U){Z.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Z.copy(U))}function rt(U,de){let $=c.get(de);$===void 0&&($=new WeakMap,c.set(de,$));let ne=$.get(U);ne===void 0&&(ne=i.getUniformBlockIndex(de,U.name),$.set(U,ne))}function We(U,de){let ne=c.get(de).get(U);l.get(de)!==ne&&(i.uniformBlockBinding(de,ne,U.__bindingPointIndex),l.set(de,ne))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},te=null,re={},d={},f=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,_=null,b=null,D=null,T=null,C=new ye(0,0,0),A=0,w=!1,M=null,I=null,k=null,O=null,G=null,Ye.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ue,disable:Ce,bindFramebuffer:ze,drawBuffers:Ve,useProgram:Mt,setBlending:F,setMaterial:Qt,setFlipSided:et,setCullFace:tt,setLineWidth:Oe,setPolygonOffset:xt,setScissorTest:Ne,activeTexture:R,bindTexture:E,unbindTexture:V,compressedTexImage2D:Q,compressedTexImage3D:se,texImage2D:_e,texImage3D:Fe,updateUBOMapping:rt,uniformBlockBinding:We,texStorage2D:je,texStorage3D:ae,texSubImage2D:J,texSubImage3D:Ee,compressedTexSubImage2D:fe,compressedTexSubImage3D:me,scissor:Ge,viewport:Me,reset:ct}}function yd(i,e,t,n){let s=sv(n);switch(t){case kd:return i*e;case Fd:return i*e;case Bd:return i*e*2;case yh:return i*e/s.components*s.byteLength;case vh:return i*e/s.components*s.byteLength;case Hd:return i*e*2/s.components*s.byteLength;case _h:return i*e*2/s.components*s.byteLength;case zd:return i*e*3/s.components*s.byteLength;case ln:return i*e*4/s.components*s.byteLength;case Mh:return i*e*4/s.components*s.byteLength;case Na:case Ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Oa:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Yl:case Zl:return Math.max(i,16)*Math.max(e,8)/4;case ql:case $l:return Math.max(i,8)*Math.max(e,8)/2;case Kl:case Jl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case jl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ql:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ec:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case tc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case nc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ic:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case sc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case rc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ac:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case oc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case lc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case cc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case hc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case uc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case dc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case za:case fc:case pc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Gd:case mc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case gc:case xc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function sv(i){switch(i){case Xn:case Nd:return{byteLength:1,components:1};case Tr:case Ud:case Nt:return{byteLength:2,components:1};case gh:case xh:return{byteLength:2,components:4};case cs:case mh:case gn:return{byteLength:4,components:1};case Od:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function rv(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,u=new WeakMap,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,E){return p?new OffscreenCanvas(R,E):Ar("canvas")}function x(R,E,V){let Q=1,se=Ne(R);if((se.width>V||se.height>V)&&(Q=V/Math.max(se.width,se.height)),Q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let J=Math.floor(Q*se.width),Ee=Math.floor(Q*se.height);d===void 0&&(d=y(J,Ee));let fe=E?y(J,Ee):d;return fe.width=J,fe.height=Ee,fe.getContext("2d").drawImage(R,0,0,J,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+J+"x"+Ee+")."),fe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),R;return R}function g(R){return R.generateMipmaps}function m(R){i.generateMipmap(R)}function v(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(R,E,V,Q,se=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let J=E;if(E===i.RED&&(V===i.FLOAT&&(J=i.R32F),V===i.HALF_FLOAT&&(J=i.R16F),V===i.UNSIGNED_BYTE&&(J=i.R8)),E===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.R8UI),V===i.UNSIGNED_SHORT&&(J=i.R16UI),V===i.UNSIGNED_INT&&(J=i.R32UI),V===i.BYTE&&(J=i.R8I),V===i.SHORT&&(J=i.R16I),V===i.INT&&(J=i.R32I)),E===i.RG&&(V===i.FLOAT&&(J=i.RG32F),V===i.HALF_FLOAT&&(J=i.RG16F),V===i.UNSIGNED_BYTE&&(J=i.RG8)),E===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RG8UI),V===i.UNSIGNED_SHORT&&(J=i.RG16UI),V===i.UNSIGNED_INT&&(J=i.RG32UI),V===i.BYTE&&(J=i.RG8I),V===i.SHORT&&(J=i.RG16I),V===i.INT&&(J=i.RG32I)),E===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGB8UI),V===i.UNSIGNED_SHORT&&(J=i.RGB16UI),V===i.UNSIGNED_INT&&(J=i.RGB32UI),V===i.BYTE&&(J=i.RGB8I),V===i.SHORT&&(J=i.RGB16I),V===i.INT&&(J=i.RGB32I)),E===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),V===i.UNSIGNED_INT&&(J=i.RGBA32UI),V===i.BYTE&&(J=i.RGBA8I),V===i.SHORT&&(J=i.RGBA16I),V===i.INT&&(J=i.RGBA32I)),E===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),E===i.RGBA){let Ee=se?go:ot.getTransfer(Q);V===i.FLOAT&&(J=i.RGBA32F),V===i.HALF_FLOAT&&(J=i.RGBA16F),V===i.UNSIGNED_BYTE&&(J=Ee===gt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function b(R,E){let V;return R?E===null||E===cs||E===Fi?V=i.DEPTH24_STENCIL8:E===gn?V=i.DEPTH32F_STENCIL8:E===Tr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===cs||E===Fi?V=i.DEPTH_COMPONENT24:E===gn?V=i.DEPTH_COMPONENT32F:E===Tr&&(V=i.DEPTH_COMPONENT16),V}function D(R,E){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==rn&&R.minFilter!==Ht?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function T(R){let E=R.target;E.removeEventListener("dispose",T),A(E),E.isVideoTexture&&u.delete(E)}function C(R){let E=R.target;E.removeEventListener("dispose",C),M(E)}function A(R){let E=n.get(R);if(E.__webglInit===void 0)return;let V=R.source,Q=f.get(V);if(Q){let se=Q[E.__cacheKey];se.usedTimes--,se.usedTimes===0&&w(R),Object.keys(Q).length===0&&f.delete(V)}n.remove(R)}function w(R){let E=n.get(R);i.deleteTexture(E.__webglTexture);let V=R.source,Q=f.get(V);delete Q[E.__cacheKey],a.memory.textures--}function M(R){let E=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(E.__webglFramebuffer[Q]))for(let se=0;se<E.__webglFramebuffer[Q].length;se++)i.deleteFramebuffer(E.__webglFramebuffer[Q][se]);else i.deleteFramebuffer(E.__webglFramebuffer[Q]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[Q])}else{if(Array.isArray(E.__webglFramebuffer))for(let Q=0;Q<E.__webglFramebuffer.length;Q++)i.deleteFramebuffer(E.__webglFramebuffer[Q]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Q=0;Q<E.__webglColorRenderbuffer.length;Q++)E.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[Q]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let V=R.textures;for(let Q=0,se=V.length;Q<se;Q++){let J=n.get(V[Q]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),a.memory.textures--),n.remove(V[Q])}n.remove(R)}let I=0;function k(){I=0}function O(){let R=I;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function G(R){let E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function X(R,E){let V=n.get(R);if(R.isVideoTexture&&Oe(R),R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){let Q=R.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(V,R,E);return}}t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+E)}function z(R,E){let V=n.get(R);if(R.version>0&&V.__version!==R.version){Z(V,R,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+E)}function K(R,E){let V=n.get(R);if(R.version>0&&V.__version!==R.version){Z(V,R,E);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+E)}function W(R,E){let V=n.get(R);if(R.version>0&&V.__version!==R.version){oe(V,R,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+E)}let te={[Cn]:i.REPEAT,[Rn]:i.CLAMP_TO_EDGE,[Xl]:i.MIRRORED_REPEAT},re={[rn]:i.NEAREST,[nm]:i.NEAREST_MIPMAP_NEAREST,[la]:i.NEAREST_MIPMAP_LINEAR,[Ht]:i.LINEAR,[el]:i.LINEAR_MIPMAP_NEAREST,[Oi]:i.LINEAR_MIPMAP_LINEAR},be={[am]:i.NEVER,[dm]:i.ALWAYS,[om]:i.LESS,[Vd]:i.LEQUAL,[lm]:i.EQUAL,[um]:i.GEQUAL,[cm]:i.GREATER,[hm]:i.NOTEQUAL};function Pe(R,E){if(E.type===gn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Ht||E.magFilter===el||E.magFilter===la||E.magFilter===Oi||E.minFilter===Ht||E.minFilter===el||E.minFilter===la||E.minFilter===Oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,te[E.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,te[E.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,te[E.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,re[E.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,re[E.minFilter]),E.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,be[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===rn||E.minFilter!==la&&E.minFilter!==Oi||E.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Ye(R,E){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",T));let Q=E.source,se=f.get(Q);se===void 0&&(se={},f.set(Q,se));let J=G(E);if(J!==R.__cacheKey){se[J]===void 0&&(se[J]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,V=!0),se[J].usedTimes++;let Ee=se[R.__cacheKey];Ee!==void 0&&(se[R.__cacheKey].usedTimes--,Ee.usedTimes===0&&w(E)),R.__cacheKey=J,R.__webglTexture=se[J].texture}return V}function Z(R,E,V){let Q=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Q=i.TEXTURE_3D);let se=Ye(R,E),J=E.source;t.bindTexture(Q,R.__webglTexture,i.TEXTURE0+V);let Ee=n.get(J);if(J.version!==Ee.__version||se===!0){t.activeTexture(i.TEXTURE0+V);let fe=ot.getPrimaries(ot.workingColorSpace),me=E.colorSpace===Ui?null:ot.getPrimaries(E.colorSpace),je=E.colorSpace===Ui||fe===me?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let ae=x(E.image,!1,s.maxTextureSize);ae=xt(E,ae);let _e=r.convert(E.format,E.colorSpace),Fe=r.convert(E.type),Ge=_(E.internalFormat,_e,Fe,E.colorSpace,E.isVideoTexture);Pe(Q,E);let Me,rt=E.mipmaps,We=E.isVideoTexture!==!0,ct=Ee.__version===void 0||se===!0,U=J.dataReady,de=D(E,ae);if(E.isDepthTexture)Ge=b(E.format===Bi,E.type),ct&&(We?t.texStorage2D(i.TEXTURE_2D,1,Ge,ae.width,ae.height):t.texImage2D(i.TEXTURE_2D,0,Ge,ae.width,ae.height,0,_e,Fe,null));else if(E.isDataTexture)if(rt.length>0){We&&ct&&t.texStorage2D(i.TEXTURE_2D,de,Ge,rt[0].width,rt[0].height);for(let $=0,ne=rt.length;$<ne;$++)Me=rt[$],We?U&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,_e,Fe,Me.data):t.texImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,_e,Fe,Me.data);E.generateMipmaps=!1}else We?(ct&&t.texStorage2D(i.TEXTURE_2D,de,Ge,ae.width,ae.height),U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae.width,ae.height,_e,Fe,ae.data)):t.texImage2D(i.TEXTURE_2D,0,Ge,ae.width,ae.height,0,_e,Fe,ae.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){We&&ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,Ge,rt[0].width,rt[0].height,ae.depth);for(let $=0,ne=rt.length;$<ne;$++)if(Me=rt[$],E.format!==ln)if(_e!==null)if(We){if(U)if(E.layerUpdates.size>0){let ve=yd(Me.width,Me.height,E.format,E.type);for(let ge of E.layerUpdates){let $e=Me.data.subarray(ge*ve/Me.data.BYTES_PER_ELEMENT,(ge+1)*ve/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,ge,Me.width,Me.height,1,_e,$e)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Me.width,Me.height,ae.depth,_e,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Ge,Me.width,Me.height,ae.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Me.width,Me.height,ae.depth,_e,Fe,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,$,Ge,Me.width,Me.height,ae.depth,0,_e,Fe,Me.data)}else{We&&ct&&t.texStorage2D(i.TEXTURE_2D,de,Ge,rt[0].width,rt[0].height);for(let $=0,ne=rt.length;$<ne;$++)Me=rt[$],E.format!==ln?_e!==null?We?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,_e,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?U&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,Me.width,Me.height,_e,Fe,Me.data):t.texImage2D(i.TEXTURE_2D,$,Ge,Me.width,Me.height,0,_e,Fe,Me.data)}else if(E.isDataArrayTexture)if(We){if(ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,Ge,ae.width,ae.height,ae.depth),U)if(E.layerUpdates.size>0){let $=yd(ae.width,ae.height,E.format,E.type);for(let ne of E.layerUpdates){let ve=ae.data.subarray(ne*$/ae.data.BYTES_PER_ELEMENT,(ne+1)*$/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ne,ae.width,ae.height,1,_e,Fe,ve)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,_e,Fe,ae.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ge,ae.width,ae.height,ae.depth,0,_e,Fe,ae.data);else if(E.isData3DTexture)We?(ct&&t.texStorage3D(i.TEXTURE_3D,de,Ge,ae.width,ae.height,ae.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,_e,Fe,ae.data)):t.texImage3D(i.TEXTURE_3D,0,Ge,ae.width,ae.height,ae.depth,0,_e,Fe,ae.data);else if(E.isFramebufferTexture){if(ct)if(We)t.texStorage2D(i.TEXTURE_2D,de,Ge,ae.width,ae.height);else{let $=ae.width,ne=ae.height;for(let ve=0;ve<de;ve++)t.texImage2D(i.TEXTURE_2D,ve,Ge,$,ne,0,_e,Fe,null),$>>=1,ne>>=1}}else if(rt.length>0){if(We&&ct){let $=Ne(rt[0]);t.texStorage2D(i.TEXTURE_2D,de,Ge,$.width,$.height)}for(let $=0,ne=rt.length;$<ne;$++)Me=rt[$],We?U&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,_e,Fe,Me):t.texImage2D(i.TEXTURE_2D,$,Ge,_e,Fe,Me);E.generateMipmaps=!1}else if(We){if(ct){let $=Ne(ae);t.texStorage2D(i.TEXTURE_2D,de,Ge,$.width,$.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,_e,Fe,ae)}else t.texImage2D(i.TEXTURE_2D,0,Ge,_e,Fe,ae);g(E)&&m(Q),Ee.__version=J.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function oe(R,E,V){if(E.image.length!==6)return;let Q=Ye(R,E),se=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+V);let J=n.get(se);if(se.version!==J.__version||Q===!0){t.activeTexture(i.TEXTURE0+V);let Ee=ot.getPrimaries(ot.workingColorSpace),fe=E.colorSpace===Ui?null:ot.getPrimaries(E.colorSpace),me=E.colorSpace===Ui||Ee===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);let je=E.isCompressedTexture||E.image[0].isCompressedTexture,ae=E.image[0]&&E.image[0].isDataTexture,_e=[];for(let ne=0;ne<6;ne++)!je&&!ae?_e[ne]=x(E.image[ne],!0,s.maxCubemapSize):_e[ne]=ae?E.image[ne].image:E.image[ne],_e[ne]=xt(E,_e[ne]);let Fe=_e[0],Ge=r.convert(E.format,E.colorSpace),Me=r.convert(E.type),rt=_(E.internalFormat,Ge,Me,E.colorSpace),We=E.isVideoTexture!==!0,ct=J.__version===void 0||Q===!0,U=se.dataReady,de=D(E,Fe);Pe(i.TEXTURE_CUBE_MAP,E);let $;if(je){We&&ct&&t.texStorage2D(i.TEXTURE_CUBE_MAP,de,rt,Fe.width,Fe.height);for(let ne=0;ne<6;ne++){$=_e[ne].mipmaps;for(let ve=0;ve<$.length;ve++){let ge=$[ve];E.format!==ln?Ge!==null?We?U&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve,0,0,ge.width,ge.height,Ge,ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve,rt,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve,0,0,ge.width,ge.height,Ge,Me,ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve,rt,ge.width,ge.height,0,Ge,Me,ge.data)}}}else{if($=E.mipmaps,We&&ct){$.length>0&&de++;let ne=Ne(_e[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,de,rt,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(ae){We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,_e[ne].width,_e[ne].height,Ge,Me,_e[ne].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,rt,_e[ne].width,_e[ne].height,0,Ge,Me,_e[ne].data);for(let ve=0;ve<$.length;ve++){let $e=$[ve].image[ne].image;We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve+1,0,0,$e.width,$e.height,Ge,Me,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve+1,rt,$e.width,$e.height,0,Ge,Me,$e.data)}}else{We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,Ge,Me,_e[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,rt,Ge,Me,_e[ne]);for(let ve=0;ve<$.length;ve++){let ge=$[ve];We?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve+1,0,0,Ge,Me,ge.image[ne]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve+1,rt,Ge,Me,ge.image[ne])}}}g(E)&&m(i.TEXTURE_CUBE_MAP),J.__version=se.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function we(R,E,V,Q,se,J){let Ee=r.convert(V.format,V.colorSpace),fe=r.convert(V.type),me=_(V.internalFormat,Ee,fe,V.colorSpace),je=n.get(E),ae=n.get(V);if(ae.__renderTarget=E,!je.__hasExternalTextures){let _e=Math.max(1,E.width>>J),Fe=Math.max(1,E.height>>J);se===i.TEXTURE_3D||se===i.TEXTURE_2D_ARRAY?t.texImage3D(se,J,me,_e,Fe,E.depth,0,Ee,fe,null):t.texImage2D(se,J,me,_e,Fe,0,Ee,fe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),tt(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,se,ae.__webglTexture,0,et(E)):(se===i.TEXTURE_2D||se>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,se,ae.__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ue(R,E,V){if(i.bindRenderbuffer(i.RENDERBUFFER,R),E.depthBuffer){let Q=E.depthTexture,se=Q&&Q.isDepthTexture?Q.type:null,J=b(E.stencilBuffer,se),Ee=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=et(E);tt(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe,J,E.width,E.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,J,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,J,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ee,i.RENDERBUFFER,R)}else{let Q=E.textures;for(let se=0;se<Q.length;se++){let J=Q[se],Ee=r.convert(J.format,J.colorSpace),fe=r.convert(J.type),me=_(J.internalFormat,Ee,fe,J.colorSpace),je=et(E);V&&tt(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,je,me,E.width,E.height):tt(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,je,me,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,me,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ce(R,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Q=n.get(E.depthTexture);Q.__renderTarget=E,(!Q.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),X(E.depthTexture,0);let se=Q.__webglTexture,J=et(E);if(E.depthTexture.format===Bs)tt(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,se,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,se,0);else if(E.depthTexture.format===Bi)tt(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,se,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,se,0);else throw new Error("Unknown depthTexture format")}function ze(R){let E=n.get(R),V=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){let Q=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Q){let se=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Q.removeEventListener("dispose",se)};Q.addEventListener("dispose",se),E.__depthDisposeCallback=se}E.__boundDepthTexture=Q}if(R.depthTexture&&!E.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");Ce(E.__webglFramebuffer,R)}else if(V){E.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[Q]),E.__webglDepthbuffer[Q]===void 0)E.__webglDepthbuffer[Q]=i.createRenderbuffer(),ue(E.__webglDepthbuffer[Q],R,!1);else{let se=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=E.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,J)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),ue(E.__webglDepthbuffer,R,!1);else{let Q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,se)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(R,E,V){let Q=n.get(R);E!==void 0&&we(Q.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&ze(R)}function Mt(R){let E=R.texture,V=n.get(R),Q=n.get(E);R.addEventListener("dispose",C);let se=R.textures,J=R.isWebGLCubeRenderTarget===!0,Ee=se.length>1;if(Ee||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=E.version,a.memory.textures++),J){V.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer[fe]=[];for(let me=0;me<E.mipmaps.length;me++)V.__webglFramebuffer[fe][me]=i.createFramebuffer()}else V.__webglFramebuffer[fe]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer=[];for(let fe=0;fe<E.mipmaps.length;fe++)V.__webglFramebuffer[fe]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Ee)for(let fe=0,me=se.length;fe<me;fe++){let je=n.get(se[fe]);je.__webglTexture===void 0&&(je.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&tt(R)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let fe=0;fe<se.length;fe++){let me=se[fe];V.__webglColorRenderbuffer[fe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[fe]);let je=r.convert(me.format,me.colorSpace),ae=r.convert(me.type),_e=_(me.internalFormat,je,ae,me.colorSpace,R.isXRRenderTarget===!0),Fe=et(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Fe,_e,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,V.__webglColorRenderbuffer[fe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),ue(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),Pe(i.TEXTURE_CUBE_MAP,E);for(let fe=0;fe<6;fe++)if(E.mipmaps&&E.mipmaps.length>0)for(let me=0;me<E.mipmaps.length;me++)we(V.__webglFramebuffer[fe][me],R,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,me);else we(V.__webglFramebuffer[fe],R,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);g(E)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let fe=0,me=se.length;fe<me;fe++){let je=se[fe],ae=n.get(je);t.bindTexture(i.TEXTURE_2D,ae.__webglTexture),Pe(i.TEXTURE_2D,je),we(V.__webglFramebuffer,R,je,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,0),g(je)&&m(i.TEXTURE_2D)}t.unbindTexture()}else{let fe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(fe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,Q.__webglTexture),Pe(fe,E),E.mipmaps&&E.mipmaps.length>0)for(let me=0;me<E.mipmaps.length;me++)we(V.__webglFramebuffer[me],R,E,i.COLOR_ATTACHMENT0,fe,me);else we(V.__webglFramebuffer,R,E,i.COLOR_ATTACHMENT0,fe,0);g(E)&&m(fe),t.unbindTexture()}R.depthBuffer&&ze(R)}function st(R){let E=R.textures;for(let V=0,Q=E.length;V<Q;V++){let se=E[V];if(g(se)){let J=v(R),Ee=n.get(se).__webglTexture;t.bindTexture(J,Ee),m(J),t.unbindTexture()}}}let wt=[],F=[];function Qt(R){if(R.samples>0){if(tt(R)===!1){let E=R.textures,V=R.width,Q=R.height,se=i.COLOR_BUFFER_BIT,J=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ee=n.get(R),fe=E.length>1;if(fe)for(let me=0;me<E.length;me++)t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let me=0;me<E.length;me++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(se|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(se|=i.STENCIL_BUFFER_BIT)),fe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[me]);let je=n.get(E[me]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,je,0)}i.blitFramebuffer(0,0,V,Q,0,0,V,Q,se,i.NEAREST),l===!0&&(wt.length=0,F.length=0,wt.push(i.COLOR_ATTACHMENT0+me),R.depthBuffer&&R.resolveDepthBuffer===!1&&(wt.push(J),F.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,F)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,wt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),fe)for(let me=0;me<E.length;me++){t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.RENDERBUFFER,Ee.__webglColorRenderbuffer[me]);let je=n.get(E[me]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.TEXTURE_2D,je,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let E=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function et(R){return Math.min(s.maxSamples,R.samples)}function tt(R){let E=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Oe(R){let E=a.render.frame;u.get(R)!==E&&(u.set(R,E),R.update())}function xt(R,E){let V=R.colorSpace,Q=R.format,se=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==ti&&V!==Ui&&(ot.getTransfer(V)===gt?(Q!==ln||se!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),E}function Ne(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=k,this.setTexture2D=X,this.setTexture2DArray=z,this.setTexture3D=K,this.setTextureCube=W,this.rebindTextures=Ve,this.setupRenderTarget=Mt,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=Qt,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=we,this.useMultisampledRTT=tt}function av(i,e){function t(n,s=Ui){let r,a=ot.getTransfer(s);if(n===Xn)return i.UNSIGNED_BYTE;if(n===gh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===xh)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Od)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Nd)return i.BYTE;if(n===Ud)return i.SHORT;if(n===Tr)return i.UNSIGNED_SHORT;if(n===mh)return i.INT;if(n===cs)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===Nt)return i.HALF_FLOAT;if(n===kd)return i.ALPHA;if(n===zd)return i.RGB;if(n===ln)return i.RGBA;if(n===Fd)return i.LUMINANCE;if(n===Bd)return i.LUMINANCE_ALPHA;if(n===Bs)return i.DEPTH_COMPONENT;if(n===Bi)return i.DEPTH_STENCIL;if(n===yh)return i.RED;if(n===vh)return i.RED_INTEGER;if(n===Hd)return i.RG;if(n===_h)return i.RG_INTEGER;if(n===Mh)return i.RGBA_INTEGER;if(n===Na||n===Ua||n===Oa||n===ka)if(a===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Na)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Na)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ua)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ql||n===Yl||n===$l||n===Zl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ql)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Yl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===$l)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Zl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Kl||n===Jl||n===jl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Kl||n===Jl)return a===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===jl)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ql||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===lc||n===cc||n===hc||n===uc||n===dc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ql)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ec)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===tc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===nc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ic)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===sc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===rc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ac)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===oc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===lc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===cc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===hc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===uc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===dc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===za||n===fc||n===pc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===za)return a===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===fc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===pc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Gd||n===mc||n===gc||n===xc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===za)return r.COMPRESSED_RED_RGTC1_EXT;if(n===mc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===gc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===xc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Fi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Lc=class extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},ut=class extends Zt{constructor(){super(),this.isGroup=!0,this.type="Group"}},ov={type:"move"},br=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ut,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ut,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ut,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),p=.02,y=.005;c.inputState.pinching&&f>p+y?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-y&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ov)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ut;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},lv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cv=`
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

}`,Dc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new cn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Tt({vertexShader:lv,fragmentShader:cv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new he(new Pt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nc=class extends Hi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,f=null,p=null,y=null,x=new Dc,g=t.getContextAttributes(),m=null,v=null,_=[],b=[],D=new le,T=null,C=new Jt;C.viewport=new vt;let A=new Jt;A.viewport=new vt;let w=[C,A],M=new Lc,I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let oe=_[Z];return oe===void 0&&(oe=new br,_[Z]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(Z){let oe=_[Z];return oe===void 0&&(oe=new br,_[Z]=oe),oe.getGripSpace()},this.getHand=function(Z){let oe=_[Z];return oe===void 0&&(oe=new br,_[Z]=oe),oe.getHandSpace()};function O(Z){let oe=b.indexOf(Z.inputSource);if(oe===-1)return;let we=_[oe];we!==void 0&&(we.update(Z.inputSource,Z.frame,c||a),we.dispatchEvent({type:Z.type,data:Z.inputSource}))}function G(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",X);for(let Z=0;Z<_.length;Z++){let oe=b[Z];oe!==null&&(b[Z]=null,_[Z].disconnect(oe))}I=null,k=null,x.reset(),e.setRenderTarget(m),p=null,f=null,d=null,s=null,v=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(m=e.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",G),s.addEventListener("inputsourceschange",X),g.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(D),s.renderState.layers===void 0){let oe={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new kt(p.framebufferWidth,p.framebufferHeight,{format:ln,type:Xn,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let oe=null,we=null,ue=null;g.depth&&(ue=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=g.stencil?Bi:Bs,we=g.stencil?Fi:cs);let Ce={colorFormat:t.RGBA8,depthFormat:ue,scaleFactor:r};d=new XRWebGLBinding(s,t),f=d.createProjectionLayer(Ce),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new kt(f.textureWidth,f.textureHeight,{format:ln,type:Xn,depthTexture:new Zs(f.textureWidth,f.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ye.setContext(s),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function X(Z){for(let oe=0;oe<Z.removed.length;oe++){let we=Z.removed[oe],ue=b.indexOf(we);ue>=0&&(b[ue]=null,_[ue].disconnect(we))}for(let oe=0;oe<Z.added.length;oe++){let we=Z.added[oe],ue=b.indexOf(we);if(ue===-1){for(let ze=0;ze<_.length;ze++)if(ze>=b.length){b.push(we),ue=ze;break}else if(b[ze]===null){b[ze]=we,ue=ze;break}if(ue===-1)break}let Ce=_[ue];Ce&&Ce.connect(we)}}let z=new L,K=new L;function W(Z,oe,we){z.setFromMatrixPosition(oe.matrixWorld),K.setFromMatrixPosition(we.matrixWorld);let ue=z.distanceTo(K),Ce=oe.projectionMatrix.elements,ze=we.projectionMatrix.elements,Ve=Ce[14]/(Ce[10]-1),Mt=Ce[14]/(Ce[10]+1),st=(Ce[9]+1)/Ce[5],wt=(Ce[9]-1)/Ce[5],F=(Ce[8]-1)/Ce[0],Qt=(ze[8]+1)/ze[0],et=Ve*F,tt=Ve*Qt,Oe=ue/(-F+Qt),xt=Oe*-F;if(oe.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(xt),Z.translateZ(Oe),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Ce[10]===-1)Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{let Ne=Ve+Oe,R=Mt+Oe,E=et-xt,V=tt+(ue-xt),Q=st*Mt/R*Ne,se=wt*Mt/R*Ne;Z.projectionMatrix.makePerspective(E,V,Q,se,Ne,R),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function te(Z,oe){oe===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(oe.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let oe=Z.near,we=Z.far;x.texture!==null&&(x.depthNear>0&&(oe=x.depthNear),x.depthFar>0&&(we=x.depthFar)),M.near=A.near=C.near=oe,M.far=A.far=C.far=we,(I!==M.near||k!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),I=M.near,k=M.far),C.layers.mask=Z.layers.mask|2,A.layers.mask=Z.layers.mask|4,M.layers.mask=C.layers.mask|A.layers.mask;let ue=Z.parent,Ce=M.cameras;te(M,ue);for(let ze=0;ze<Ce.length;ze++)te(Ce[ze],ue);Ce.length===2?W(M,C,A):M.projectionMatrix.copy(C.projectionMatrix),re(Z,M,ue)};function re(Z,oe,we){we===null?Z.matrix.copy(oe.matrixWorld):(Z.matrix.copy(we.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(oe.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ha*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(Z){l=Z,f!==null&&(f.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(M)};let be=null;function Pe(Z,oe){if(u=oe.getViewerPose(c||a),y=oe,u!==null){let we=u.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let ue=!1;we.length!==M.cameras.length&&(M.cameras.length=0,ue=!0);for(let ze=0;ze<we.length;ze++){let Ve=we[ze],Mt=null;if(p!==null)Mt=p.getViewport(Ve);else{let wt=d.getViewSubImage(f,Ve);Mt=wt.viewport,ze===0&&(e.setRenderTargetTextures(v,wt.colorTexture,f.ignoreDepthValues?void 0:wt.depthStencilTexture),e.setRenderTarget(v))}let st=w[ze];st===void 0&&(st=new Jt,st.layers.enable(ze),st.viewport=new vt,w[ze]=st),st.matrix.fromArray(Ve.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(Ve.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(Mt.x,Mt.y,Mt.width,Mt.height),ze===0&&(M.matrix.copy(st.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ue===!0&&M.cameras.push(st)}let Ce=s.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")){let ze=d.getDepthInformation(we[0]);ze&&ze.isValid&&ze.texture&&x.init(e,ze,s.renderState)}}for(let we=0;we<_.length;we++){let ue=b[we],Ce=_[we];ue!==null&&Ce!==void 0&&Ce.update(ue,oe,c||a)}be&&be(Z,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),y=null}let Ye=new Yd;Ye.setAnimationLoop(Pe),this.setAnimationLoop=function(Z){be=Z},this.dispose=function(){}}},rs=new $t,hv=new Be;function uv(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,qd(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,v,_,b){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),d(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&p(g,m,b)):m.isMeshMatcapMaterial?(r(g,m),y(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,v,_):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===sn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===sn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let v=e.get(m),_=v.envMap,b=v.envMapRotation;_&&(g.envMap.value=_,rs.copy(b),rs.x*=-1,rs.y*=-1,rs.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),g.envMapRotation.value.setFromMatrix4(hv.makeRotationFromEuler(rs)),g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,v,_){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*v,g.scale.value=_*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function p(g,m,v){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===sn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function y(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let v=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function dv(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,_){let b=_.program;n.uniformBlockBinding(v,b)}function c(v,_){let b=s[v.id];b===void 0&&(y(v),b=u(v),s[v.id]=b,v.addEventListener("dispose",g));let D=_.program;n.updateUBOMapping(v,D);let T=e.render.frame;r[v.id]!==T&&(f(v),r[v.id]=T)}function u(v){let _=d();v.__bindingPointIndex=_;let b=i.createBuffer(),D=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,D,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,b),b}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){let _=s[v.id],b=v.uniforms,D=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let T=0,C=b.length;T<C;T++){let A=Array.isArray(b[T])?b[T]:[b[T]];for(let w=0,M=A.length;w<M;w++){let I=A[w];if(p(I,T,w,D)===!0){let k=I.__offset,O=Array.isArray(I.value)?I.value:[I.value],G=0;for(let X=0;X<O.length;X++){let z=O[X],K=x(z);typeof z=="number"||typeof z=="boolean"?(I.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,k+G,I.__data)):z.isMatrix3?(I.__data[0]=z.elements[0],I.__data[1]=z.elements[1],I.__data[2]=z.elements[2],I.__data[3]=0,I.__data[4]=z.elements[3],I.__data[5]=z.elements[4],I.__data[6]=z.elements[5],I.__data[7]=0,I.__data[8]=z.elements[6],I.__data[9]=z.elements[7],I.__data[10]=z.elements[8],I.__data[11]=0):(z.toArray(I.__data,G),G+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,_,b,D){let T=v.value,C=_+"_"+b;if(D[C]===void 0)return typeof T=="number"||typeof T=="boolean"?D[C]=T:D[C]=T.clone(),!0;{let A=D[C];if(typeof T=="number"||typeof T=="boolean"){if(A!==T)return D[C]=T,!0}else if(A.equals(T)===!1)return A.copy(T),!0}return!1}function y(v){let _=v.uniforms,b=0,D=16;for(let C=0,A=_.length;C<A;C++){let w=Array.isArray(_[C])?_[C]:[_[C]];for(let M=0,I=w.length;M<I;M++){let k=w[M],O=Array.isArray(k.value)?k.value:[k.value];for(let G=0,X=O.length;G<X;G++){let z=O[G],K=x(z),W=b%D,te=W%K.boundary,re=W+te;b+=te,re!==0&&D-re<K.storage&&(b+=D-re),k.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=b,b+=K.storage}}}let T=b%D;return T>0&&(b+=D-T),v.__size=b,v.__cache={},this}function x(v){let _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),_}function g(v){let _=v.target;_.removeEventListener("dispose",g);let b=a.indexOf(_.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function m(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:m}}var $a=class{constructor(e={}){let{canvas:t=pm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let y=new Uint32Array(4),x=new Int32Array(4),g=null,m=null,v=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ft,this.toneMapping=ki,this.toneMappingExposure=1;let b=this,D=!1,T=0,C=0,A=null,w=-1,M=null,I=new vt,k=new vt,O=null,G=new ye(0),X=0,z=t.width,K=t.height,W=1,te=null,re=null,be=new vt(0,0,z,K),Pe=new vt(0,0,z,K),Ye=!1,Z=new Ir,oe=!1,we=!1,ue=new Be,Ce=new Be,ze=new L,Ve=new vt,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},st=!1;function wt(){return A===null?W:1}let F=n;function Qt(S,B){return t.getContext(S,B)}try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${oh}`),t.addEventListener("webglcontextlost",ne,!1),t.addEventListener("webglcontextrestored",ve,!1),t.addEventListener("webglcontextcreationerror",ge,!1),F===null){let B="webgl2";if(F=Qt(B,S),F===null)throw Qt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let et,tt,Oe,xt,Ne,R,E,V,Q,se,J,Ee,fe,me,je,ae,_e,Fe,Ge,Me,rt,We,ct,U;function de(){et=new Rx(F),et.init(),We=new av(F,et),tt=new bx(F,et,e,We),Oe=new iv(F,et),tt.reverseDepthBuffer&&f&&Oe.buffers.depth.setReversed(!0),xt=new Px(F),Ne=new Wy,R=new rv(F,et,Oe,Ne,tt,We,xt),E=new Ex(b),V=new Ax(b),Q=new zm(F),ct=new _x(F,Q),se=new Cx(F,Q,xt,ct),J=new Dx(F,se,Q,xt),Ge=new Lx(F,tt,R),ae=new wx(Ne),Ee=new Vy(b,E,V,et,tt,ct,ae),fe=new uv(b,Ne),me=new qy,je=new jy(et),Fe=new vx(b,E,V,Oe,J,p,l),_e=new tv(b,J,tt),U=new dv(F,xt,tt,Oe),Me=new Mx(F,et,xt),rt=new Ix(F,et,xt),xt.programs=Ee.programs,b.capabilities=tt,b.extensions=et,b.properties=Ne,b.renderLists=me,b.shadowMap=_e,b.state=Oe,b.info=xt}de();let $=new Nc(b,F);this.xr=$,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let S=et.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=et.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(S){S!==void 0&&(W=S,this.setSize(z,K,!1))},this.getSize=function(S){return S.set(z,K)},this.setSize=function(S,B,q=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=S,K=B,t.width=Math.floor(S*W),t.height=Math.floor(B*W),q===!0&&(t.style.width=S+"px",t.style.height=B+"px"),this.setViewport(0,0,S,B)},this.getDrawingBufferSize=function(S){return S.set(z*W,K*W).floor()},this.setDrawingBufferSize=function(S,B,q){z=S,K=B,W=q,t.width=Math.floor(S*q),t.height=Math.floor(B*q),this.setViewport(0,0,S,B)},this.getCurrentViewport=function(S){return S.copy(I)},this.getViewport=function(S){return S.copy(be)},this.setViewport=function(S,B,q,Y){S.isVector4?be.set(S.x,S.y,S.z,S.w):be.set(S,B,q,Y),Oe.viewport(I.copy(be).multiplyScalar(W).round())},this.getScissor=function(S){return S.copy(Pe)},this.setScissor=function(S,B,q,Y){S.isVector4?Pe.set(S.x,S.y,S.z,S.w):Pe.set(S,B,q,Y),Oe.scissor(k.copy(Pe).multiplyScalar(W).round())},this.getScissorTest=function(){return Ye},this.setScissorTest=function(S){Oe.setScissorTest(Ye=S)},this.setOpaqueSort=function(S){te=S},this.setTransparentSort=function(S){re=S},this.getClearColor=function(S){return S.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor.apply(Fe,arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha.apply(Fe,arguments)},this.clear=function(S=!0,B=!0,q=!0){let Y=0;if(S){let H=!1;if(A!==null){let ce=A.texture.format;H=ce===Mh||ce===_h||ce===vh}if(H){let ce=A.texture.type,xe=ce===Xn||ce===cs||ce===Tr||ce===Fi||ce===gh||ce===xh,Te=Fe.getClearColor(),Ae=Fe.getClearAlpha(),Xe=Te.r,Ze=Te.g,Re=Te.b;xe?(y[0]=Xe,y[1]=Ze,y[2]=Re,y[3]=Ae,F.clearBufferuiv(F.COLOR,0,y)):(x[0]=Xe,x[1]=Ze,x[2]=Re,x[3]=Ae,F.clearBufferiv(F.COLOR,0,x))}else Y|=F.COLOR_BUFFER_BIT}B&&(Y|=F.DEPTH_BUFFER_BIT),q&&(Y|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ne,!1),t.removeEventListener("webglcontextrestored",ve,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),me.dispose(),je.dispose(),Ne.dispose(),E.dispose(),V.dispose(),J.dispose(),ct.dispose(),U.dispose(),Ee.dispose(),$.dispose(),$.removeEventListener("sessionstart",cu),$.removeEventListener("sessionend",hu),Qi.stop()};function ne(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;let S=xt.autoReset,B=_e.enabled,q=_e.autoUpdate,Y=_e.needsUpdate,H=_e.type;de(),xt.autoReset=S,_e.enabled=B,_e.autoUpdate=q,_e.needsUpdate=Y,_e.type=H}function ge(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function $e(S){let B=S.target;B.removeEventListener("dispose",$e),It(B)}function It(S){en(S),Ne.remove(S)}function en(S){let B=Ne.get(S).programs;B!==void 0&&(B.forEach(function(q){Ee.releaseProgram(q)}),S.isShaderMaterial&&Ee.releaseShaderCache(S))}this.renderBufferDirect=function(S,B,q,Y,H,ce){B===null&&(B=Mt);let xe=H.isMesh&&H.matrixWorld.determinant()<0,Te=Ap(S,B,q,Y,H);Oe.setMaterial(Y,xe);let Ae=q.index,Xe=1;if(Y.wireframe===!0){if(Ae=se.getWireframeAttribute(q),Ae===void 0)return;Xe=2}let Ze=q.drawRange,Re=q.attributes.position,ht=Ze.start*Xe,bt=(Ze.start+Ze.count)*Xe;ce!==null&&(ht=Math.max(ht,ce.start*Xe),bt=Math.min(bt,(ce.start+ce.count)*Xe)),Ae!==null?(ht=Math.max(ht,0),bt=Math.min(bt,Ae.count)):Re!=null&&(ht=Math.max(ht,0),bt=Math.min(bt,Re.count));let Et=bt-ht;if(Et<0||Et===1/0)return;ct.setup(H,Y,Te,q,Ae);let pn,pt=Me;if(Ae!==null&&(pn=Q.get(Ae),pt=rt,pt.setIndex(pn)),H.isMesh)Y.wireframe===!0?(Oe.setLineWidth(Y.wireframeLinewidth*wt()),pt.setMode(F.LINES)):pt.setMode(F.TRIANGLES);else if(H.isLine){let Ie=Y.linewidth;Ie===void 0&&(Ie=1),Oe.setLineWidth(Ie*wt()),H.isLineSegments?pt.setMode(F.LINES):H.isLineLoop?pt.setMode(F.LINE_LOOP):pt.setMode(F.LINE_STRIP)}else H.isPoints?pt.setMode(F.POINTS):H.isSprite&&pt.setMode(F.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)pt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(et.get("WEBGL_multi_draw"))pt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Ie=H._multiDrawStarts,di=H._multiDrawCounts,mt=H._multiDrawCount,Bn=Ae?Q.get(Ae).bytesPerElement:1,bs=Ne.get(Y).currentProgram.getUniforms();for(let En=0;En<mt;En++)bs.setValue(F,"_gl_DrawID",En),pt.render(Ie[En]/Bn,di[En])}else if(H.isInstancedMesh)pt.renderInstances(ht,Et,H.count);else if(q.isInstancedBufferGeometry){let Ie=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,di=Math.min(q.instanceCount,Ie);pt.renderInstances(ht,Et,di)}else pt.render(ht,Et)};function yt(S,B,q){S.transparent===!0&&S.side===Bt&&S.forceSinglePass===!1?(S.side=sn,S.needsUpdate=!0,sa(S,B,q),S.side=zi,S.needsUpdate=!0,sa(S,B,q),S.side=Bt):sa(S,B,q)}this.compile=function(S,B,q=null){q===null&&(q=S),m=je.get(q),m.init(B),_.push(m),q.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),S!==q&&S.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights();let Y=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let ce=H.material;if(ce)if(Array.isArray(ce))for(let xe=0;xe<ce.length;xe++){let Te=ce[xe];yt(Te,q,H),Y.add(Te)}else yt(ce,q,H),Y.add(ce)}),_.pop(),m=null,Y},this.compileAsync=function(S,B,q=null){let Y=this.compile(S,B,q);return new Promise(H=>{function ce(){if(Y.forEach(function(xe){Ne.get(xe).currentProgram.isReady()&&Y.delete(xe)}),Y.size===0){H(S);return}setTimeout(ce,10)}et.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Fn=null;function ui(S){Fn&&Fn(S)}function cu(){Qi.stop()}function hu(){Qi.start()}let Qi=new Yd;Qi.setAnimationLoop(ui),typeof self<"u"&&Qi.setContext(self),this.setAnimationLoop=function(S){Fn=S,$.setAnimationLoop(S),S===null?Qi.stop():Qi.start()},$.addEventListener("sessionstart",cu),$.addEventListener("sessionend",hu),this.render=function(S,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(B),B=$.getCamera()),S.isScene===!0&&S.onBeforeRender(b,S,B,A),m=je.get(S,_.length),m.init(B),_.push(m),Ce.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Z.setFromProjectionMatrix(Ce),we=this.localClippingEnabled,oe=ae.init(this.clippingPlanes,we),g=me.get(S,v.length),g.init(),v.push(g),$.enabled===!0&&$.isPresenting===!0){let ce=b.xr.getDepthSensingMesh();ce!==null&&Jo(ce,B,-1/0,b.sortObjects)}Jo(S,B,0,b.sortObjects),g.finish(),b.sortObjects===!0&&g.sort(te,re),st=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,st&&Fe.addToRenderList(g,S),this.info.render.frame++,oe===!0&&ae.beginShadows();let q=m.state.shadowsArray;_e.render(q,S,B),oe===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=g.opaque,H=g.transmissive;if(m.setupLights(),B.isArrayCamera){let ce=B.cameras;if(H.length>0)for(let xe=0,Te=ce.length;xe<Te;xe++){let Ae=ce[xe];du(Y,H,S,Ae)}st&&Fe.render(S);for(let xe=0,Te=ce.length;xe<Te;xe++){let Ae=ce[xe];uu(g,S,Ae,Ae.viewport)}}else H.length>0&&du(Y,H,S,B),st&&Fe.render(S),uu(g,S,B);A!==null&&(R.updateMultisampleRenderTarget(A),R.updateRenderTargetMipmap(A)),S.isScene===!0&&S.onAfterRender(b,S,B),ct.resetDefaultState(),w=-1,M=null,_.pop(),_.length>0?(m=_[_.length-1],oe===!0&&ae.setGlobalState(b.clippingPlanes,m.state.camera)):m=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Jo(S,B,q,Y){if(S.visible===!1)return;if(S.layers.test(B.layers)){if(S.isGroup)q=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(B);else if(S.isLight)m.pushLight(S),S.castShadow&&m.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Z.intersectsSprite(S)){Y&&Ve.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Ce);let xe=J.update(S),Te=S.material;Te.visible&&g.push(S,xe,Te,q,Ve.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Z.intersectsObject(S))){let xe=J.update(S),Te=S.material;if(Y&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ve.copy(S.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),Ve.copy(xe.boundingSphere.center)),Ve.applyMatrix4(S.matrixWorld).applyMatrix4(Ce)),Array.isArray(Te)){let Ae=xe.groups;for(let Xe=0,Ze=Ae.length;Xe<Ze;Xe++){let Re=Ae[Xe],ht=Te[Re.materialIndex];ht&&ht.visible&&g.push(S,xe,ht,q,Ve.z,Re)}}else Te.visible&&g.push(S,xe,Te,q,Ve.z,null)}}let ce=S.children;for(let xe=0,Te=ce.length;xe<Te;xe++)Jo(ce[xe],B,q,Y)}function uu(S,B,q,Y){let H=S.opaque,ce=S.transmissive,xe=S.transparent;m.setupLightsView(q),oe===!0&&ae.setGlobalState(b.clippingPlanes,q),Y&&Oe.viewport(I.copy(Y)),H.length>0&&ia(H,B,q),ce.length>0&&ia(ce,B,q),xe.length>0&&ia(xe,B,q),Oe.buffers.depth.setTest(!0),Oe.buffers.depth.setMask(!0),Oe.buffers.color.setMask(!0),Oe.setPolygonOffset(!1)}function du(S,B,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[Y.id]===void 0&&(m.state.transmissionRenderTarget[Y.id]=new kt(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float")?Nt:Xn,minFilter:Oi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));let ce=m.state.transmissionRenderTarget[Y.id],xe=Y.viewport||I;ce.setSize(xe.z,xe.w);let Te=b.getRenderTarget();b.setRenderTarget(ce),b.getClearColor(G),X=b.getClearAlpha(),X<1&&b.setClearColor(16777215,.5),b.clear(),st&&Fe.render(q);let Ae=b.toneMapping;b.toneMapping=ki;let Xe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),m.setupLightsView(Y),oe===!0&&ae.setGlobalState(b.clippingPlanes,Y),ia(S,q,Y),R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce),et.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let Re=0,ht=B.length;Re<ht;Re++){let bt=B[Re],Et=bt.object,pn=bt.geometry,pt=bt.material,Ie=bt.group;if(pt.side===Bt&&Et.layers.test(Y.layers)){let di=pt.side;pt.side=sn,pt.needsUpdate=!0,fu(Et,q,Y,pn,pt,Ie),pt.side=di,pt.needsUpdate=!0,Ze=!0}}Ze===!0&&(R.updateMultisampleRenderTarget(ce),R.updateRenderTargetMipmap(ce))}b.setRenderTarget(Te),b.setClearColor(G,X),Xe!==void 0&&(Y.viewport=Xe),b.toneMapping=Ae}function ia(S,B,q){let Y=B.isScene===!0?B.overrideMaterial:null;for(let H=0,ce=S.length;H<ce;H++){let xe=S[H],Te=xe.object,Ae=xe.geometry,Xe=Y===null?xe.material:Y,Ze=xe.group;Te.layers.test(q.layers)&&fu(Te,B,q,Ae,Xe,Ze)}}function fu(S,B,q,Y,H,ce){S.onBeforeRender(b,B,q,Y,H,ce),S.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(b,B,q,Y,S,ce),H.transparent===!0&&H.side===Bt&&H.forceSinglePass===!1?(H.side=sn,H.needsUpdate=!0,b.renderBufferDirect(q,B,Y,H,S,ce),H.side=zi,H.needsUpdate=!0,b.renderBufferDirect(q,B,Y,H,S,ce),H.side=Bt):b.renderBufferDirect(q,B,Y,H,S,ce),S.onAfterRender(b,B,q,Y,H,ce)}function sa(S,B,q){B.isScene!==!0&&(B=Mt);let Y=Ne.get(S),H=m.state.lights,ce=m.state.shadowsArray,xe=H.state.version,Te=Ee.getParameters(S,H.state,ce,B,q),Ae=Ee.getProgramCacheKey(Te),Xe=Y.programs;Y.environment=S.isMeshStandardMaterial?B.environment:null,Y.fog=B.fog,Y.envMap=(S.isMeshStandardMaterial?V:E).get(S.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&S.envMap===null?B.environmentRotation:S.envMapRotation,Xe===void 0&&(S.addEventListener("dispose",$e),Xe=new Map,Y.programs=Xe);let Ze=Xe.get(Ae);if(Ze!==void 0){if(Y.currentProgram===Ze&&Y.lightsStateVersion===xe)return mu(S,Te),Ze}else Te.uniforms=Ee.getUniforms(S),S.onBeforeCompile(Te,b),Ze=Ee.acquireProgram(Te,Ae),Xe.set(Ae,Ze),Y.uniforms=Te.uniforms;let Re=Y.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Re.clippingPlanes=ae.uniform),mu(S,Te),Y.needsLights=Cp(S),Y.lightsStateVersion=xe,Y.needsLights&&(Re.ambientLightColor.value=H.state.ambient,Re.lightProbe.value=H.state.probe,Re.directionalLights.value=H.state.directional,Re.directionalLightShadows.value=H.state.directionalShadow,Re.spotLights.value=H.state.spot,Re.spotLightShadows.value=H.state.spotShadow,Re.rectAreaLights.value=H.state.rectArea,Re.ltc_1.value=H.state.rectAreaLTC1,Re.ltc_2.value=H.state.rectAreaLTC2,Re.pointLights.value=H.state.point,Re.pointLightShadows.value=H.state.pointShadow,Re.hemisphereLights.value=H.state.hemi,Re.directionalShadowMap.value=H.state.directionalShadowMap,Re.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Re.spotShadowMap.value=H.state.spotShadowMap,Re.spotLightMatrix.value=H.state.spotLightMatrix,Re.spotLightMap.value=H.state.spotLightMap,Re.pointShadowMap.value=H.state.pointShadowMap,Re.pointShadowMatrix.value=H.state.pointShadowMatrix),Y.currentProgram=Ze,Y.uniformsList=null,Ze}function pu(S){if(S.uniformsList===null){let B=S.currentProgram.getUniforms();S.uniformsList=Gs.seqWithValue(B.seq,S.uniforms)}return S.uniformsList}function mu(S,B){let q=Ne.get(S);q.outputColorSpace=B.outputColorSpace,q.batching=B.batching,q.batchingColor=B.batchingColor,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.instancingMorph=B.instancingMorph,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function Ap(S,B,q,Y,H){B.isScene!==!0&&(B=Mt),R.resetTextureUnits();let ce=B.fog,xe=Y.isMeshStandardMaterial?B.environment:null,Te=A===null?b.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ti,Ae=(Y.isMeshStandardMaterial?V:E).get(Y.envMap||xe),Xe=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ze=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Re=!!q.morphAttributes.position,ht=!!q.morphAttributes.normal,bt=!!q.morphAttributes.color,Et=ki;Y.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Et=b.toneMapping);let pn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,pt=pn!==void 0?pn.length:0,Ie=Ne.get(Y),di=m.state.lights;if(oe===!0&&(we===!0||S!==M)){let Dn=S===M&&Y.id===w;ae.setState(Y,S,Dn)}let mt=!1;Y.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==di.state.version||Ie.outputColorSpace!==Te||H.isBatchedMesh&&Ie.batching===!1||!H.isBatchedMesh&&Ie.batching===!0||H.isBatchedMesh&&Ie.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ie.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ie.instancing===!1||!H.isInstancedMesh&&Ie.instancing===!0||H.isSkinnedMesh&&Ie.skinning===!1||!H.isSkinnedMesh&&Ie.skinning===!0||H.isInstancedMesh&&Ie.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ie.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ie.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ie.instancingMorph===!1&&H.morphTexture!==null||Ie.envMap!==Ae||Y.fog===!0&&Ie.fog!==ce||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==ae.numPlanes||Ie.numIntersection!==ae.numIntersection)||Ie.vertexAlphas!==Xe||Ie.vertexTangents!==Ze||Ie.morphTargets!==Re||Ie.morphNormals!==ht||Ie.morphColors!==bt||Ie.toneMapping!==Et||Ie.morphTargetsCount!==pt)&&(mt=!0):(mt=!0,Ie.__version=Y.version);let Bn=Ie.currentProgram;mt===!0&&(Bn=sa(Y,B,H));let bs=!1,En=!1,hr=!1,St=Bn.getUniforms(),Jn=Ie.uniforms;if(Oe.useProgram(Bn.program)&&(bs=!0,En=!0,hr=!0),Y.id!==w&&(w=Y.id,En=!0),bs||M!==S){Oe.buffers.depth.getReversed()?(ue.copy(S.projectionMatrix),gm(ue),xm(ue),St.setValue(F,"projectionMatrix",ue)):St.setValue(F,"projectionMatrix",S.projectionMatrix),St.setValue(F,"viewMatrix",S.matrixWorldInverse);let Ai=St.map.cameraPosition;Ai!==void 0&&Ai.setValue(F,ze.setFromMatrixPosition(S.matrixWorld)),tt.logarithmicDepthBuffer&&St.setValue(F,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&St.setValue(F,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,En=!0,hr=!0)}if(H.isSkinnedMesh){St.setOptional(F,H,"bindMatrix"),St.setOptional(F,H,"bindMatrixInverse");let Dn=H.skeleton;Dn&&(Dn.boneTexture===null&&Dn.computeBoneTexture(),St.setValue(F,"boneTexture",Dn.boneTexture,R))}H.isBatchedMesh&&(St.setOptional(F,H,"batchingTexture"),St.setValue(F,"batchingTexture",H._matricesTexture,R),St.setOptional(F,H,"batchingIdTexture"),St.setValue(F,"batchingIdTexture",H._indirectTexture,R),St.setOptional(F,H,"batchingColorTexture"),H._colorsTexture!==null&&St.setValue(F,"batchingColorTexture",H._colorsTexture,R));let ur=q.morphAttributes;if((ur.position!==void 0||ur.normal!==void 0||ur.color!==void 0)&&Ge.update(H,q,Bn),(En||Ie.receiveShadow!==H.receiveShadow)&&(Ie.receiveShadow=H.receiveShadow,St.setValue(F,"receiveShadow",H.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Jn.envMap.value=Ae,Jn.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&B.environment!==null&&(Jn.envMapIntensity.value=B.environmentIntensity),En&&(St.setValue(F,"toneMappingExposure",b.toneMappingExposure),Ie.needsLights&&Rp(Jn,hr),ce&&Y.fog===!0&&fe.refreshFogUniforms(Jn,ce),fe.refreshMaterialUniforms(Jn,Y,W,K,m.state.transmissionRenderTarget[S.id]),Gs.upload(F,pu(Ie),Jn,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Gs.upload(F,pu(Ie),Jn,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&St.setValue(F,"center",H.center),St.setValue(F,"modelViewMatrix",H.modelViewMatrix),St.setValue(F,"normalMatrix",H.normalMatrix),St.setValue(F,"modelMatrix",H.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Dn=Y.uniformsGroups;for(let Ai=0,Ri=Dn.length;Ai<Ri;Ai++){let gu=Dn[Ai];U.update(gu,Bn),U.bind(gu,Bn)}}return Bn}function Rp(S,B){S.ambientLightColor.needsUpdate=B,S.lightProbe.needsUpdate=B,S.directionalLights.needsUpdate=B,S.directionalLightShadows.needsUpdate=B,S.pointLights.needsUpdate=B,S.pointLightShadows.needsUpdate=B,S.spotLights.needsUpdate=B,S.spotLightShadows.needsUpdate=B,S.rectAreaLights.needsUpdate=B,S.hemisphereLights.needsUpdate=B}function Cp(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(S,B,q){Ne.get(S.texture).__webglTexture=B,Ne.get(S.depthTexture).__webglTexture=q;let Y=Ne.get(S);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,B){let q=Ne.get(S);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(S,B=0,q=0){A=S,T=B,C=q;let Y=!0,H=null,ce=!1,xe=!1;if(S){let Ae=Ne.get(S);if(Ae.__useDefaultFramebuffer!==void 0)Oe.bindFramebuffer(F.FRAMEBUFFER,null),Y=!1;else if(Ae.__webglFramebuffer===void 0)R.setupRenderTarget(S);else if(Ae.__hasExternalTextures)R.rebindTextures(S,Ne.get(S.texture).__webglTexture,Ne.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Re=S.depthTexture;if(Ae.__boundDepthTexture!==Re){if(Re!==null&&Ne.has(Re)&&(S.width!==Re.image.width||S.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(S)}}let Xe=S.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(xe=!0);let Ze=Ne.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ze[B])?H=Ze[B][q]:H=Ze[B],ce=!0):S.samples>0&&R.useMultisampledRTT(S)===!1?H=Ne.get(S).__webglMultisampledFramebuffer:Array.isArray(Ze)?H=Ze[q]:H=Ze,I.copy(S.viewport),k.copy(S.scissor),O=S.scissorTest}else I.copy(be).multiplyScalar(W).floor(),k.copy(Pe).multiplyScalar(W).floor(),O=Ye;if(Oe.bindFramebuffer(F.FRAMEBUFFER,H)&&Y&&Oe.drawBuffers(S,H),Oe.viewport(I),Oe.scissor(k),Oe.setScissorTest(O),ce){let Ae=Ne.get(S.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ae.__webglTexture,q)}else if(xe){let Ae=Ne.get(S.texture),Xe=B||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ae.__webglTexture,q||0,Xe)}w=-1},this.readRenderTargetPixels=function(S,B,q,Y,H,ce,xe){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Ne.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&xe!==void 0&&(Te=Te[xe]),Te){Oe.bindFramebuffer(F.FRAMEBUFFER,Te);try{let Ae=S.texture,Xe=Ae.format,Ze=Ae.type;if(!tt.textureFormatReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=S.width-Y&&q>=0&&q<=S.height-H&&F.readPixels(B,q,Y,H,We.convert(Xe),We.convert(Ze),ce)}finally{let Ae=A!==null?Ne.get(A).__webglFramebuffer:null;Oe.bindFramebuffer(F.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(S,B,q,Y,H,ce,xe){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=Ne.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&xe!==void 0&&(Te=Te[xe]),Te){let Ae=S.texture,Xe=Ae.format,Ze=Ae.type;if(!tt.textureFormatReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=S.width-Y&&q>=0&&q<=S.height-H){Oe.bindFramebuffer(F.FRAMEBUFFER,Te);let Re=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Re),F.bufferData(F.PIXEL_PACK_BUFFER,ce.byteLength,F.STREAM_READ),F.readPixels(B,q,Y,H,We.convert(Xe),We.convert(Ze),0);let ht=A!==null?Ne.get(A).__webglFramebuffer:null;Oe.bindFramebuffer(F.FRAMEBUFFER,ht);let bt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await mm(F,bt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Re),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ce),F.deleteBuffer(Re),F.deleteSync(bt),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,B=null,q=0){S.isTexture!==!0&&(_r("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,S=arguments[1]);let Y=Math.pow(2,-q),H=Math.floor(S.image.width*Y),ce=Math.floor(S.image.height*Y),xe=B!==null?B.x:0,Te=B!==null?B.y:0;R.setTexture2D(S,0),F.copyTexSubImage2D(F.TEXTURE_2D,q,0,0,xe,Te,H,ce),Oe.unbindTexture()},this.copyTextureToTexture=function(S,B,q=null,Y=null,H=0){S.isTexture!==!0&&(_r("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,S=arguments[1],B=arguments[2],H=arguments[3]||0,q=null);let ce,xe,Te,Ae,Xe,Ze,Re,ht,bt,Et=S.isCompressedTexture?S.mipmaps[H]:S.image;q!==null?(ce=q.max.x-q.min.x,xe=q.max.y-q.min.y,Te=q.isBox3?q.max.z-q.min.z:1,Ae=q.min.x,Xe=q.min.y,Ze=q.isBox3?q.min.z:0):(ce=Et.width,xe=Et.height,Te=Et.depth||1,Ae=0,Xe=0,Ze=0),Y!==null?(Re=Y.x,ht=Y.y,bt=Y.z):(Re=0,ht=0,bt=0);let pn=We.convert(B.format),pt=We.convert(B.type),Ie;B.isData3DTexture?(R.setTexture3D(B,0),Ie=F.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(R.setTexture2DArray(B,0),Ie=F.TEXTURE_2D_ARRAY):(R.setTexture2D(B,0),Ie=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,B.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,B.unpackAlignment);let di=F.getParameter(F.UNPACK_ROW_LENGTH),mt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Bn=F.getParameter(F.UNPACK_SKIP_PIXELS),bs=F.getParameter(F.UNPACK_SKIP_ROWS),En=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Et.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Et.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ae),F.pixelStorei(F.UNPACK_SKIP_ROWS,Xe),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ze);let hr=S.isDataArrayTexture||S.isData3DTexture,St=B.isDataArrayTexture||B.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){let Jn=Ne.get(S),ur=Ne.get(B),Dn=Ne.get(Jn.__renderTarget),Ai=Ne.get(ur.__renderTarget);Oe.bindFramebuffer(F.READ_FRAMEBUFFER,Dn.__webglFramebuffer),Oe.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ai.__webglFramebuffer);for(let Ri=0;Ri<Te;Ri++)hr&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ne.get(S).__webglTexture,H,Ze+Ri),S.isDepthTexture?(St&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ne.get(B).__webglTexture,H,bt+Ri),F.blitFramebuffer(Ae,Xe,ce,xe,Re,ht,ce,xe,F.DEPTH_BUFFER_BIT,F.NEAREST)):St?F.copyTexSubImage3D(Ie,H,Re,ht,bt+Ri,Ae,Xe,ce,xe):F.copyTexSubImage2D(Ie,H,Re,ht,bt+Ri,Ae,Xe,ce,xe);Oe.bindFramebuffer(F.READ_FRAMEBUFFER,null),Oe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else St?S.isDataTexture||S.isData3DTexture?F.texSubImage3D(Ie,H,Re,ht,bt,ce,xe,Te,pn,pt,Et.data):B.isCompressedArrayTexture?F.compressedTexSubImage3D(Ie,H,Re,ht,bt,ce,xe,Te,pn,Et.data):F.texSubImage3D(Ie,H,Re,ht,bt,ce,xe,Te,pn,pt,Et):S.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,H,Re,ht,ce,xe,pn,pt,Et.data):S.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,H,Re,ht,Et.width,Et.height,pn,Et.data):F.texSubImage2D(F.TEXTURE_2D,H,Re,ht,ce,xe,pn,pt,Et);F.pixelStorei(F.UNPACK_ROW_LENGTH,di),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,mt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Bn),F.pixelStorei(F.UNPACK_SKIP_ROWS,bs),F.pixelStorei(F.UNPACK_SKIP_IMAGES,En),H===0&&B.generateMipmaps&&F.generateMipmap(Ie),Oe.unbindTexture()},this.copyTextureToTexture3D=function(S,B,q=null,Y=null,H=0){return S.isTexture!==!0&&(_r("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Y=arguments[1]||null,S=arguments[2],B=arguments[3],H=arguments[4]||0),_r('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,B,q,Y,H)},this.initRenderTarget=function(S){Ne.get(S).__webglFramebuffer===void 0&&R.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?R.setTextureCube(S,0):S.isData3DTexture?R.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?R.setTexture2DArray(S,0):R.setTexture2D(S,0),Oe.unbindTexture()},this.resetState=function(){T=0,C=0,A=null,Oe.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}};var Vi=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ye(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ks=class extends Zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $t,this.environmentIntensity=1,this.environmentRotation=new $t,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Qn=class extends cn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=rn,u=rn,d,f){super(null,a,o,l,c,u,s,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var hs=class extends Ot{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ks=new Be,vd=new Be,Ca=[],_d=new wi,fv=new Be,xr=new he,yr=new Gi,an=class extends he{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new hs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,fv)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new wi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ks),_d.copy(e.boundingBox).applyMatrix4(ks),this.boundingBox.union(_d)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ks),yr.copy(e.boundingSphere).applyMatrix4(ks),this.boundingSphere.union(yr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(xr.geometry=this.geometry,xr.material=this.material,xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yr.copy(this.boundingSphere),yr.applyMatrix4(n),e.ray.intersectsSphere(yr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ks),vd.multiplyMatrices(n,ks),xr.matrixWorld=vd,xr.raycast(e,Ca);for(let a=0,o=Ca.length;a<o;a++){let l=Ca[a];l.instanceId=r,l.object=this,t.push(l)}Ca.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new hs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Qn(new Float32Array(s*this.count),s,this.count,yh,gn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Pr=class extends Ei{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ye(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Md=new Be,Uc=new Rr,Ia=new Gi,Pa=new L,Za=class extends Zt{constructor(e=new zt,t=new Pr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ia.copy(n.boundingSphere),Ia.applyMatrix4(s),Ia.radius+=r,e.ray.intersectsSphere(Ia)===!1)return;Md.copy(s).invert(),Uc.copy(e.ray).applyMatrix4(Md);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let y=f,x=p;y<x;y++){let g=c.getX(y);Pa.fromBufferAttribute(d,g),bd(Pa,g,l,s,e,t,this)}}else{let f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let y=f,x=p;y<x;y++)Pa.fromBufferAttribute(d,y),bd(Pa,y,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function bd(i,e,t,n,s,r,a){let o=Uc.distanceSqToPoint(i);if(o<t){let l=new L;Uc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Wi=class extends cn{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},On=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],f=n[s+1]-u,p=(a-u)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new le:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new L,s=[],r=[],a=[],o=new L,l=new Be;for(let p=0;p<=e;p++){let y=p/e;s[p]=this.getTangentAt(y,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let y=Math.acos(qt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,y))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(qt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let y=1;y<=e;y++)r[y].applyMatrix4(l.makeRotationAxis(s[y],p*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Lr=class extends On{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*u-p*d+this.aX,c=f*d+p*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Oc=class extends Lr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Eh(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,d){let f=(a-r)/c-(o-r)/(c+u)+(o-a)/u,p=(o-a)/u-(l-a)/(u+d)+(l-o)/d;f*=u,p*=u,s(a,o,f,p)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var La=new L,Il=new Eh,Pl=new Eh,Ll=new Eh,kc=class extends On{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(La.subVectors(s[0],s[1]).add(s[0]),c=La);let d=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(La.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=La),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,y=Math.pow(c.distanceToSquared(d),p),x=Math.pow(d.distanceToSquared(f),p),g=Math.pow(f.distanceToSquared(u),p);x<1e-4&&(x=1),y<1e-4&&(y=x),g<1e-4&&(g=x),Il.initNonuniformCatmullRom(c.x,d.x,f.x,u.x,y,x,g),Pl.initNonuniformCatmullRom(c.y,d.y,f.y,u.y,y,x,g),Ll.initNonuniformCatmullRom(c.z,d.z,f.z,u.z,y,x,g)}else this.curveType==="catmullrom"&&(Il.initCatmullRom(c.x,d.x,f.x,u.x,this.tension),Pl.initCatmullRom(c.y,d.y,f.y,u.y,this.tension),Ll.initCatmullRom(c.z,d.z,f.z,u.z,this.tension));return n.set(Il.calc(l),Pl.calc(l),Ll.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function wd(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function pv(i,e){let t=1-i;return t*t*e}function mv(i,e){return 2*(1-i)*i*e}function gv(i,e){return i*i*e}function wr(i,e,t,n){return pv(i,e)+mv(i,t)+gv(i,n)}function xv(i,e){let t=1-i;return t*t*t*e}function yv(i,e){let t=1-i;return 3*t*t*i*e}function vv(i,e){return 3*(1-i)*i*i*e}function _v(i,e){return i*i*i*e}function Er(i,e,t,n,s){return xv(i,e)+yv(i,t)+vv(i,n)+_v(i,s)}var Ka=class extends On{constructor(e=new le,t=new le,n=new le,s=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Er(e,s.x,r.x,a.x,o.x),Er(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zc=class extends On{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Er(e,s.x,r.x,a.x,o.x),Er(e,s.y,r.y,a.y,o.y),Er(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ja=class extends On{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Fc=class extends On{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ja=class extends On{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(wr(e,s.x,r.x,a.x),wr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Bc=class extends On{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(wr(e,s.x,r.x,a.x),wr(e,s.y,r.y,a.y),wr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qa=class extends On{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(wd(o,l.x,c.x,u.x,d.x),wd(o,l.y,c.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new le().fromArray(s))}return this}},Ed=Object.freeze({__proto__:null,ArcCurve:Oc,CatmullRomCurve3:kc,CubicBezierCurve:Ka,CubicBezierCurve3:zc,EllipseCurve:Lr,LineCurve:Ja,LineCurve3:Fc,QuadraticBezierCurve:ja,QuadraticBezierCurve3:Bc,SplineCurve:Qa}),Hc=class extends On{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ed[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Ed[s.type]().fromJSON(s))}return this}},Gc=class extends Hc{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ja(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new ja(this.currentPoint.clone(),new le(e,t),new le(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new Ka(this.currentPoint.clone(),new le(e,t),new le(n,s),new le(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Qa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){let c=new Lr(e,t,n,s,r,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Vc=class i extends zt{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=qt(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],u=1/t,d=new L,f=new le,p=new L,y=new L,x=new L,g=0,m=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,x.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,y.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),l.push(p.x,p.y,p.z),x.copy(y)}for(let v=0;v<=t;v++){let _=n+v*u*s,b=Math.sin(_),D=Math.cos(_);for(let T=0;T<=e.length-1;T++){d.x=e[T].x*b,d.y=e[T].y,d.z=e[T].x*D,a.push(d.x,d.y,d.z),f.x=v/t,f.y=T/(e.length-1),o.push(f.x,f.y);let C=l[3*T+0]*b,A=l[3*T+1],w=l[3*T+0]*D;c.push(C,A,w)}}for(let v=0;v<t;v++)for(let _=0;_<e.length-1;_++){let b=_+v*e.length,D=b,T=b+e.length,C=b+e.length+1,A=b+1;r.push(D,T,A),r.push(C,A,T)}this.setIndex(r),this.setAttribute("position",new dt(a,3)),this.setAttribute("uv",new dt(o,2)),this.setAttribute("normal",new dt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},In=class i extends Vc{constructor(e=1,t=1,n=4,s=8){let r=new Gc;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}};var it=class i extends zt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],d=[],f=[],p=[],y=0,x=[],g=n/2,m=0;v(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new dt(d,3)),this.setAttribute("normal",new dt(f,3)),this.setAttribute("uv",new dt(p,2));function v(){let b=new L,D=new L,T=0,C=(t-e)/n;for(let A=0;A<=r;A++){let w=[],M=A/r,I=M*(t-e)+e;for(let k=0;k<=s;k++){let O=k/s,G=O*l+o,X=Math.sin(G),z=Math.cos(G);D.x=I*X,D.y=-M*n+g,D.z=I*z,d.push(D.x,D.y,D.z),b.set(X,C,z).normalize(),f.push(b.x,b.y,b.z),p.push(O,1-M),w.push(y++)}x.push(w)}for(let A=0;A<s;A++)for(let w=0;w<r;w++){let M=x[w][A],I=x[w+1][A],k=x[w+1][A+1],O=x[w][A+1];(e>0||w!==0)&&(u.push(M,I,O),T+=3),(t>0||w!==r-1)&&(u.push(I,k,O),T+=3)}c.addGroup(m,T,0),m+=T}function _(b){let D=y,T=new le,C=new L,A=0,w=b===!0?e:t,M=b===!0?1:-1;for(let k=1;k<=s;k++)d.push(0,g*M,0),f.push(0,M,0),p.push(.5,.5),y++;let I=y;for(let k=0;k<=s;k++){let G=k/s*l+o,X=Math.cos(G),z=Math.sin(G);C.x=w*z,C.y=g*M,C.z=w*X,d.push(C.x,C.y,C.z),f.push(0,M,0),T.x=X*.5+.5,T.y=z*.5*M+.5,p.push(T.x,T.y),y++}for(let k=0;k<s;k++){let O=D+k,G=I+k;b===!0?u.push(G,G+1,O):u.push(G+1,G,O),A+=3}c.addGroup(m,A,b===!0?1:2),m+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},eo=class i extends it{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Wc=class i extends zt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),c(n),u(),this.setAttribute("position",new dt(r,3)),this.setAttribute("normal",new dt(r.slice(),3)),this.setAttribute("uv",new dt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){let _=new L,b=new L,D=new L;for(let T=0;T<t.length;T+=3)p(t[T+0],_),p(t[T+1],b),p(t[T+2],D),l(_,b,D,v)}function l(v,_,b,D){let T=D+1,C=[];for(let A=0;A<=T;A++){C[A]=[];let w=v.clone().lerp(b,A/T),M=_.clone().lerp(b,A/T),I=T-A;for(let k=0;k<=I;k++)k===0&&A===T?C[A][k]=w:C[A][k]=w.clone().lerp(M,k/I)}for(let A=0;A<T;A++)for(let w=0;w<2*(T-A)-1;w++){let M=Math.floor(w/2);w%2===0?(f(C[A][M+1]),f(C[A+1][M]),f(C[A][M])):(f(C[A][M+1]),f(C[A+1][M+1]),f(C[A+1][M]))}}function c(v){let _=new L;for(let b=0;b<r.length;b+=3)_.x=r[b+0],_.y=r[b+1],_.z=r[b+2],_.normalize().multiplyScalar(v),r[b+0]=_.x,r[b+1]=_.y,r[b+2]=_.z}function u(){let v=new L;for(let _=0;_<r.length;_+=3){v.x=r[_+0],v.y=r[_+1],v.z=r[_+2];let b=g(v)/2/Math.PI+.5,D=m(v)/Math.PI+.5;a.push(b,1-D)}y(),d()}function d(){for(let v=0;v<a.length;v+=6){let _=a[v+0],b=a[v+2],D=a[v+4],T=Math.max(_,b,D),C=Math.min(_,b,D);T>.9&&C<.1&&(_<.2&&(a[v+0]+=1),b<.2&&(a[v+2]+=1),D<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,_){let b=v*3;_.x=e[b+0],_.y=e[b+1],_.z=e[b+2]}function y(){let v=new L,_=new L,b=new L,D=new L,T=new le,C=new le,A=new le;for(let w=0,M=0;w<r.length;w+=9,M+=6){v.set(r[w+0],r[w+1],r[w+2]),_.set(r[w+3],r[w+4],r[w+5]),b.set(r[w+6],r[w+7],r[w+8]),T.set(a[M+0],a[M+1]),C.set(a[M+2],a[M+3]),A.set(a[M+4],a[M+5]),D.copy(v).add(_).add(b).divideScalar(3);let I=g(D);x(T,M+0,v,I),x(C,M+2,_,I),x(A,M+4,b,I)}}function x(v,_,b,D){D<0&&v.x===1&&(a[_]=v.x-1),b.x===0&&b.z===0&&(a[_]=D/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Dr=class i extends Wc{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var ei=class i extends zt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],c=[],u=[],d=e,f=(t-e)/s,p=new L,y=new le;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let m=r+g/n*a;p.x=d*Math.cos(m),p.y=d*Math.sin(m),l.push(p.x,p.y,p.z),c.push(0,0,1),y.x=(p.x/t+1)/2,y.y=(p.y/t+1)/2,u.push(y.x,y.y)}d+=f}for(let x=0;x<s;x++){let g=x*(n+1);for(let m=0;m<n;m++){let v=m+g,_=v,b=v+n+1,D=v+n+2,T=v+1;o.push(_,b,T),o.push(b,D,T)}}this.setIndex(o),this.setAttribute("position",new dt(l,3)),this.setAttribute("normal",new dt(c,3)),this.setAttribute("uv",new dt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var At=class i extends zt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,u=[],d=new L,f=new L,p=[],y=[],x=[],g=[];for(let m=0;m<=n;m++){let v=[],_=m/n,b=0;m===0&&a===0?b=.5/t:m===n&&l===Math.PI&&(b=-.5/t);for(let D=0;D<=t;D++){let T=D/t;d.x=-e*Math.cos(s+T*r)*Math.sin(a+_*o),d.y=e*Math.cos(a+_*o),d.z=e*Math.sin(s+T*r)*Math.sin(a+_*o),y.push(d.x,d.y,d.z),f.copy(d).normalize(),x.push(f.x,f.y,f.z),g.push(T+b,1-_),v.push(c++)}u.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){let _=u[m][v+1],b=u[m][v],D=u[m+1][v],T=u[m+1][v+1];(m!==0||a>0)&&p.push(_,b,T),(m!==n-1||l<Math.PI)&&p.push(b,D,T)}this.setIndex(p),this.setAttribute("position",new dt(y,3)),this.setAttribute("normal",new dt(x,3)),this.setAttribute("uv",new dt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var yn=class i extends zt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],l=[],c=[],u=new L,d=new L,f=new L;for(let p=0;p<=n;p++)for(let y=0;y<=s;y++){let x=y/s*r,g=p/n*Math.PI*2;d.x=(e+t*Math.cos(g))*Math.cos(x),d.y=(e+t*Math.cos(g))*Math.sin(x),d.z=t*Math.sin(g),o.push(d.x,d.y,d.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),f.subVectors(d,u).normalize(),l.push(f.x,f.y,f.z),c.push(y/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let y=1;y<=s;y++){let x=(s+1)*p+y-1,g=(s+1)*(p-1)+y-1,m=(s+1)*(p-1)+y,v=(s+1)*p+y;a.push(x,g,v),a.push(g,m,v)}this.setIndex(a),this.setAttribute("position",new dt(o,3)),this.setAttribute("normal",new dt(l,3)),this.setAttribute("uv",new dt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var to=class extends Tt{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}},Le=class extends Ei{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bh,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $t,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var no=class extends Ei{static get type(){return"MeshNormalMaterial"}constructor(e){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bh,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};function Da(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Mv(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Js=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Xc=class extends Js{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:wu,endingEnd:wu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Eu:r=e,o=2*t-n;break;case Su:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Eu:a=e,l=2*n-t;break;case Su:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,p=this._weightNext,y=(n-t)/(s-t),x=y*y,g=x*y,m=-f*g+2*f*x-f*y,v=(1+f)*g+(-1.5-2*f)*x+(-.5+f)*y+1,_=(-1-p)*g+(1.5+p)*x+.5*y,b=p*g-p*x;for(let D=0;D!==o;++D)r[D]=m*a[u+D]+v*a[c+D]+_*a[l+D]+b*a[d+D];return r}},qc=class extends Js{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),d=1-u;for(let f=0;f!==o;++f)r[f]=a[c+f]*d+a[l+f]*u;return r}},Yc=class extends Js{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},qn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Da(t,this.TimeBufferType),this.values=Da(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Da(e.times,Array),values:Da(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Yc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Xc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Fa:t=this.InterpolantFactoryMethodDiscrete;break;case yc:t=this.InterpolantFactoryMethodLinear;break;case tl:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Fa;case this.InterpolantFactoryMethodLinear:return yc;case this.InterpolantFactoryMethodSmooth:return tl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Mv(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===tl,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*n,f=d-n,p=d+n;for(let y=0;y!==n;++y){let x=t[d+y];if(x!==t[f+y]||x!==t[p+y]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,f=a*n;for(let p=0;p!==n;++p)t[f+p]=t[d+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};qn.prototype.TimeBufferType=Float32Array;qn.prototype.ValueBufferType=Float32Array;qn.prototype.DefaultInterpolation=yc;var us=class extends qn{constructor(e,t,n){super(e,t,n)}};us.prototype.ValueTypeName="bool";us.prototype.ValueBufferType=Array;us.prototype.DefaultInterpolation=Fa;us.prototype.InterpolantFactoryMethodLinear=void 0;us.prototype.InterpolantFactoryMethodSmooth=void 0;var $c=class extends qn{};$c.prototype.ValueTypeName="color";var Zc=class extends qn{};Zc.prototype.ValueTypeName="number";var Kc=class extends Js{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let u=c+o;c!==u;c+=4)Yt.slerpFlat(r,0,a,c-o,a,c,l);return r}},io=class extends qn{InterpolantFactoryMethodLinear(e){return new Kc(this.times,this.values,this.getValueSize(),e)}};io.prototype.ValueTypeName="quaternion";io.prototype.InterpolantFactoryMethodSmooth=void 0;var ds=class extends qn{constructor(e,t,n){super(e,t,n)}};ds.prototype.ValueTypeName="string";ds.prototype.ValueBufferType=Array;ds.prototype.DefaultInterpolation=Fa;ds.prototype.InterpolantFactoryMethodLinear=void 0;ds.prototype.InterpolantFactoryMethodSmooth=void 0;var Jc=class extends qn{};Jc.prototype.ValueTypeName="vector";var so={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},jc=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,f=c.length;d<f;d+=2){let p=c[d],y=c[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return y}return null}}},bv=new jc,fs=class{constructor(e){this.manager=e!==void 0?e:bv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};fs.DEFAULT_MATERIAL_NAME="__DEFAULT";var yi={},Qc=class extends Error{constructor(e,t){super(e),this.response=t}},eh=class extends fs{constructor(e){super(e)}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=so.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(yi[e]!==void 0){yi[e].push({onLoad:t,onProgress:n,onError:s});return}yi[e]=[],yi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=yi[e],d=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=f?parseInt(f):0,y=p!==0,x=0,g=new ReadableStream({start(m){v();function v(){d.read().then(({done:_,value:b})=>{if(_)m.close();else{x+=b.byteLength;let D=new ProgressEvent("progress",{lengthComputable:y,loaded:x,total:p});for(let T=0,C=u.length;T<C;T++){let A=u[T];A.onProgress&&A.onProgress(D)}m.enqueue(b),v()}},_=>{m.error(_)})}}});return new Response(g)}else throw new Qc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o===void 0)return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(o),f=d&&d[1]?d[1].toLowerCase():void 0,p=new TextDecoder(f);return c.arrayBuffer().then(y=>p.decode(y))}}}).then(c=>{so.add(e,c);let u=yi[e];delete yi[e];for(let d=0,f=u.length;d<f;d++){let p=u[d];p.onLoad&&p.onLoad(c)}}).catch(c=>{let u=yi[e];if(u===void 0)throw this.manager.itemError(e),c;delete yi[e];for(let d=0,f=u.length;d<f;d++){let p=u[d];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}};var th=class extends fs{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=so.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;let o=Ar("img");function l(){u(),so.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}};var ro=class extends fs{constructor(e){super(e)}load(e,t,n,s){let r=this,a=new Qn,o=new eh(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(u){if(s!==void 0)s(u);else{console.error(u);return}}c.image!==void 0?a.image=c.image:c.data!==void 0&&(a.image.width=c.width,a.image.height=c.height,a.image.data=c.data),a.wrapS=c.wrapS!==void 0?c.wrapS:Rn,a.wrapT=c.wrapT!==void 0?c.wrapT:Rn,a.magFilter=c.magFilter!==void 0?c.magFilter:Ht,a.minFilter=c.minFilter!==void 0?c.minFilter:Ht,a.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(a.colorSpace=c.colorSpace),c.flipY!==void 0&&(a.flipY=c.flipY),c.format!==void 0&&(a.format=c.format),c.type!==void 0&&(a.type=c.type),c.mipmaps!==void 0&&(a.mipmaps=c.mipmaps,a.minFilter=Oi),c.mipmapCount===1&&(a.minFilter=Ht),c.generateMipmaps!==void 0&&(a.generateMipmaps=c.generateMipmaps),a.needsUpdate=!0,t&&t(a,c)},n,s),a}},ao=class extends fs{constructor(e){super(e)}load(e,t,n,s){let r=new cn,a=new th(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},js=class extends Zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ye(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},oo=class extends js{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ye(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Dl=new Be,Sd=new L,Td=new L,Nr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new Be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ir,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Sd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Sd),Td.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Td),t.updateMatrixWorld(),Dl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Dl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},nh=class extends Nr{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=Ha*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},lo=class extends js{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.target=new Zt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new nh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Ad=new Be,vr=new L,Nl=new L,ih=class extends Nr{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new le(4,2),this._viewportCount=6,this._viewports=[new vt(2,1,1,1),new vt(0,1,1,1),new vt(3,1,1,1),new vt(1,1,1,1),new vt(3,0,1,1),new vt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),vr.setFromMatrixPosition(e.matrixWorld),n.position.copy(vr),Nl.copy(n.position),Nl.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Nl),n.updateMatrixWorld(),s.makeTranslation(-vr.x,-vr.y,-vr.z),Ad.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ad)}},Qs=class extends js{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ih}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},sh=class extends Nr{constructor(){super(new Ys(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},co=class extends js{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Zt.DEFAULT_UP),this.updateMatrix(),this.target=new Zt,this.shadow=new sh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ho=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Rd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Rd();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function Rd(){return performance.now()}var Sh="\\[\\]\\.:\\/",wv=new RegExp("["+Sh+"]","g"),Th="[^"+Sh+"]",Ev="[^"+Sh.replace("\\.","")+"]",Sv=/((?:WC+[\/:])*)/.source.replace("WC",Th),Tv=/(WCOD+)?/.source.replace("WCOD",Ev),Av=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Th),Rv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Th),Cv=new RegExp("^"+Sv+Tv+Av+Rv+"$"),Iv=["material","materials","bones","map"],rh=class{constructor(e,t,n){let s=n||Rt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Rt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(wv,"")}static parseTrackName(e){let t=Cv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Iv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Rt.Composite=rh;Rt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Rt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Rt.prototype.GetterByBindingType=[Rt.prototype._getValue_direct,Rt.prototype._getValue_array,Rt.prototype._getValue_arrayElement,Rt.prototype._getValue_toArray];Rt.prototype.SetterByBindingTypeAndVersioning=[[Rt.prototype._setValue_direct,Rt.prototype._setValue_direct_setNeedsUpdate,Rt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_array,Rt.prototype._setValue_array_setNeedsUpdate,Rt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_arrayElement,Rt.prototype._setValue_arrayElement_setNeedsUpdate,Rt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Rt.prototype._setValue_fromArray,Rt.prototype._setValue_fromArray_setNeedsUpdate,Rt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var e1=new Float32Array(1);var Cd=new Be,uo=class{constructor(e,t,n=0,s=1/0){this.ray=new Rr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Cr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Cd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Cd),this}intersectObject(e,t=!0,n=[]){return ah(e,this,n,t),n.sort(Id),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)ah(e[s],this,n,t);return n.sort(Id),n}};function Id(i,e){return i.distance-e.distance}function ah(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)ah(r[a],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oh);var Xi={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var hn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Pv=new Ys(-1,1,1,-1,0,1),Ah=class extends zt{constructor(){super(),this.setAttribute("position",new dt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new dt([0,2,0,0,2,0],2))}},Lv=new Ah,ii=class{constructor(e){this._mesh=new he(Lv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Pv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var nr=class extends hn{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Tt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=vn.clone(e.uniforms),this.material=new Tt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ii(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var zr=class extends hn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},yo=class extends hn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var vo=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new le);this._width=n.width,this._height=n.height,t=new kt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Nt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new nr(Xi),this.copyPass.material.blending=Gt,this.clock=new ho}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}zr!==void 0&&(a instanceof zr?n=!0:a instanceof yo&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new le);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var _o=class extends hn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ye}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var jd={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ye(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var ir=class i extends hn{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new le(e.x,e.y):new le(256,256),this.clearColor=new ye(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new kt(r,a,{type:Nt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){let f=new kt(r,a,{type:Nt});f.texture.name="UnrealBloomPass.h"+d,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let p=new kt(r,a,{type:Nt});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}let o=jd;this.highPassUniforms=vn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Tt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new le(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let u=Xi;this.copyUniforms=vn.clone(u.uniforms),this.blendMaterial=new Tt({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:xn,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ye,this.oldClearAlpha=1,this.basic=new ft,this.fsQuad=new ii(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new le(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Tt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new le(.5,.5)},direction:{value:new le(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}};ir.BlurDirectionX=new le(1,0);ir.BlurDirectionY=new le(0,1);var Fr={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new le},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new Be},cameraProjectionMatrixInverse:{value:new Be},cameraWorldMatrix:{value:new Be},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new L(-1,-1,-1)},sceneBoxMax:{value:new L(1,1,1)}},vertexShader:`

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
		}`};function Qd(i=5){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=Dv(e),n=t.length,s=new Uint8Array(n*4);for(let a=0;a<n;++a){let o=t[a],l=2*Math.PI*o/n,c=new L(Math.cos(l),Math.sin(l),0).normalize();s[a*4]=(c.x*.5+.5)*255,s[a*4+1]=(c.y*.5+.5)*255,s[a*4+2]=127,s[a*4+3]=255}let r=new Qn(s,e,e);return r.wrapS=Cn,r.wrapT=Cn,r.needsUpdate=!0,r}function Dv(i){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=e*e,n=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),n[s*e+r]!==0){r-=2,s++;continue}else n[s*e+r]=a++;r++,s--}return n}var Hr={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Rh(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new le},cameraProjectionMatrixInverse:{value:new Be},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function Rh(i,e,t){let n=Nv(i,e,t),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let a=n[r];s+=`vec3(${a.x}, ${a.y}, ${a.z})${r<i-1?",":")"}`}return s}function Nv(i,e,t){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*e*s/i,a=Math.pow(s/(i-1),t);n.push(new L(Math.cos(r),Math.sin(r),a))}return n}var bo=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,n){return e[0]*t+e[1]*n}dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}noise(e,t){let n,s,r,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,l=Math.floor(e+o),c=Math.floor(t+o),u=(3-Math.sqrt(3))/6,d=(l+c)*u,f=l-d,p=c-d,y=e-f,x=t-p,g,m;y>x?(g=1,m=0):(g=0,m=1);let v=y-g+u,_=x-m+u,b=y-1+2*u,D=x-1+2*u,T=l&255,C=c&255,A=this.perm[T+this.perm[C]]%12,w=this.perm[T+g+this.perm[C+m]]%12,M=this.perm[T+1+this.perm[C+1]]%12,I=.5-y*y-x*x;I<0?n=0:(I*=I,n=I*I*this.dot(this.grad3[A],y,x));let k=.5-v*v-_*_;k<0?s=0:(k*=k,s=k*k*this.dot(this.grad3[w],v,_));let O=.5-b*b-D*D;return O<0?r=0:(O*=O,r=O*O*this.dot(this.grad3[M],b,D)),70*(n+s+r)}noise3d(e,t,n){let s,r,a,o,c=(e+t+n)*.3333333333333333,u=Math.floor(e+c),d=Math.floor(t+c),f=Math.floor(n+c),p=1/6,y=(u+d+f)*p,x=u-y,g=d-y,m=f-y,v=e-x,_=t-g,b=n-m,D,T,C,A,w,M;v>=_?_>=b?(D=1,T=0,C=0,A=1,w=1,M=0):v>=b?(D=1,T=0,C=0,A=1,w=0,M=1):(D=0,T=0,C=1,A=1,w=0,M=1):_<b?(D=0,T=0,C=1,A=0,w=1,M=1):v<b?(D=0,T=1,C=0,A=0,w=1,M=1):(D=0,T=1,C=0,A=1,w=1,M=0);let I=v-D+p,k=_-T+p,O=b-C+p,G=v-A+2*p,X=_-w+2*p,z=b-M+2*p,K=v-1+3*p,W=_-1+3*p,te=b-1+3*p,re=u&255,be=d&255,Pe=f&255,Ye=this.perm[re+this.perm[be+this.perm[Pe]]]%12,Z=this.perm[re+D+this.perm[be+T+this.perm[Pe+C]]]%12,oe=this.perm[re+A+this.perm[be+w+this.perm[Pe+M]]]%12,we=this.perm[re+1+this.perm[be+1+this.perm[Pe+1]]]%12,ue=.6-v*v-_*_-b*b;ue<0?s=0:(ue*=ue,s=ue*ue*this.dot3(this.grad3[Ye],v,_,b));let Ce=.6-I*I-k*k-O*O;Ce<0?r=0:(Ce*=Ce,r=Ce*Ce*this.dot3(this.grad3[Z],I,k,O));let ze=.6-G*G-X*X-z*z;ze<0?a=0:(ze*=ze,a=ze*ze*this.dot3(this.grad3[oe],G,X,z));let Ve=.6-K*K-W*W-te*te;return Ve<0?o=0:(Ve*=Ve,o=Ve*Ve*this.dot3(this.grad3[we],K,W,te)),32*(s+r+a+o)}noise4d(e,t,n,s){let r=this.grad4,a=this.simplex,o=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,u,d,f,p,y,x=(e+t+n+s)*l,g=Math.floor(e+x),m=Math.floor(t+x),v=Math.floor(n+x),_=Math.floor(s+x),b=(g+m+v+_)*c,D=g-b,T=m-b,C=v-b,A=_-b,w=e-D,M=t-T,I=n-C,k=s-A,O=w>M?32:0,G=w>I?16:0,X=M>I?8:0,z=w>k?4:0,K=M>k?2:0,W=I>k?1:0,te=O+G+X+z+K+W,re=a[te][0]>=3?1:0,be=a[te][1]>=3?1:0,Pe=a[te][2]>=3?1:0,Ye=a[te][3]>=3?1:0,Z=a[te][0]>=2?1:0,oe=a[te][1]>=2?1:0,we=a[te][2]>=2?1:0,ue=a[te][3]>=2?1:0,Ce=a[te][0]>=1?1:0,ze=a[te][1]>=1?1:0,Ve=a[te][2]>=1?1:0,Mt=a[te][3]>=1?1:0,st=w-re+c,wt=M-be+c,F=I-Pe+c,Qt=k-Ye+c,et=w-Z+2*c,tt=M-oe+2*c,Oe=I-we+2*c,xt=k-ue+2*c,Ne=w-Ce+3*c,R=M-ze+3*c,E=I-Ve+3*c,V=k-Mt+3*c,Q=w-1+4*c,se=M-1+4*c,J=I-1+4*c,Ee=k-1+4*c,fe=g&255,me=m&255,je=v&255,ae=_&255,_e=o[fe+o[me+o[je+o[ae]]]]%32,Fe=o[fe+re+o[me+be+o[je+Pe+o[ae+Ye]]]]%32,Ge=o[fe+Z+o[me+oe+o[je+we+o[ae+ue]]]]%32,Me=o[fe+Ce+o[me+ze+o[je+Ve+o[ae+Mt]]]]%32,rt=o[fe+1+o[me+1+o[je+1+o[ae+1]]]]%32,We=.6-w*w-M*M-I*I-k*k;We<0?u=0:(We*=We,u=We*We*this.dot4(r[_e],w,M,I,k));let ct=.6-st*st-wt*wt-F*F-Qt*Qt;ct<0?d=0:(ct*=ct,d=ct*ct*this.dot4(r[Fe],st,wt,F,Qt));let U=.6-et*et-tt*tt-Oe*Oe-xt*xt;U<0?f=0:(U*=U,f=U*U*this.dot4(r[Ge],et,tt,Oe,xt));let de=.6-Ne*Ne-R*R-E*E-V*V;de<0?p=0:(de*=de,p=de*de*this.dot4(r[Me],Ne,R,E,V));let $=.6-Q*Q-se*se-J*J-Ee*Ee;return $<0?y=0:($*=$,y=$*$*this.dot4(r[rt],Q,se,J,Ee)),27*(u+d+f+p+y)}};var Gr=class i extends hn{constructor(e,t,n,s,r,a,o){super(),this.width=n!==void 0?n:512,this.height=s!==void 0?s:512,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Qd(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new kt(this.width,this.height,{type:Nt}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Tt({defines:Object.assign({},Fr.defines),uniforms:vn.clone(Fr.uniforms),vertexShader:Fr.vertexShader,fragmentShader:Fr.fragmentShader,blending:Gt,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new no,this.normalMaterial.blending=Gt,this.pdMaterial=new Tt({defines:Object.assign({},Hr.defines),uniforms:vn.clone(Hr.uniforms),vertexShader:Hr.vertexShader,fragmentShader:Hr.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Tt({defines:Object.assign({},Br.defines),uniforms:vn.clone(Br.uniforms),vertexShader:Br.vertexShader,fragmentShader:Br.fragmentShader,blending:Gt}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Tt({uniforms:vn.clone(Xi.uniforms),vertexShader:Xi.vertexShader,fragmentShader:Xi.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:po,blendDst:er,blendEquation:Un,blendSrcAlpha:fo,blendDstAlpha:er,blendEquationAlpha:Un}),this.blendMaterial=new Tt({uniforms:vn.clone(Mo.uniforms),vertexShader:Mo.vertexShader,fragmentShader:Mo.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:ch,blendSrc:po,blendDst:er,blendEquation:Un,blendSrcAlpha:fo,blendDstAlpha:er,blendEquationAlpha:Un}),this.fsQuad=new ii(null),this.originalClearColor=new ye,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new Zs,this.depthTexture.format=Bi,this.depthTexture.type=Fi,this.normalRenderTarget=new kt(this.width,this.height,{minFilter:rn,magFilter:rn,type:Nt,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Rh(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,n){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Gt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Gt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Gt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Gt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Gt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(e,t,n,s,r){e.getClearColor(this.originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(a)}renderOverride(e,t,n,s,r){e.getClearColor(this.originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(a)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){t.set(n,n.visible),(n.isPoints||n.isLine)&&(n.visible=!1)})}restoreVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){let s=t.get(n);n.visible=s}),t.clear()}generateNoise(e=64){let t=new bo,n=e*e*4,s=new Uint8Array(n);for(let a=0;a<e;a++)for(let o=0;o<e;o++){let l=a,c=o;s[(a*e+o)*4]=(t.noise(l,c)*.5+.5)*255,s[(a*e+o)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(a*e+o)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(a*e+o)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new Qn(s,e,e,ln,Xn);return r.wrapS=Cn,r.wrapT=Cn,r.needsUpdate=!0,r}};Gr.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var ef={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var wo=class extends hn{constructor(){super();let e=ef;this.uniforms=vn.clone(e.uniforms),this.material=new to({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ii(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ot.getTransfer(this._outputColorSpace)===gt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===hh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===uh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===dh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ur?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===fh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ph&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Eo=class extends Ks{constructor(){super();let e=new Se;e.deleteAttribute("uv");let t=new Le({side:sn}),n=new Le,s=new Qs(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new he(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new he(e,n);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);let o=new he(e,n);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);let l=new he(e,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let c=new he(e,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);let u=new he(e,n);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);let d=new he(e,n);d.position.set(-2.193,-.369,-5.547),d.rotation.set(0,.516,0),d.scale.set(3.875,3.487,2.986),this.add(d);let f=new he(e,sr(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);let p=new he(e,sr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let y=new he(e,sr(17));y.position.set(14.904,12.198,-1.832),y.scale.set(.15,4.265,6.331),this.add(y);let x=new he(e,sr(43));x.position.set(-.462,8.89,14.52),x.scale.set(4.38,5.441,.088),this.add(x);let g=new he(e,sr(20));g.position.set(3.235,11.486,-12.541),g.scale.set(2.5,2,.1),this.add(g);let m=new he(e,sr(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function sr(i){let e=new ft;return e.color.setScalar(i),e}var So=class extends ro{constructor(e){super(e),this.type=Nt}parse(e){let a=function(A,w){switch(A){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(w||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(w||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(w||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(w||""))}},u=`
`,d=function(A,w,M){w=w||1024;let k=A.pos,O=-1,G=0,X="",z=String.fromCharCode.apply(null,new Uint16Array(A.subarray(k,k+128)));for(;0>(O=z.indexOf(u))&&G<w&&k<A.byteLength;)X+=z,G+=z.length,k+=128,z+=String.fromCharCode.apply(null,new Uint16Array(A.subarray(k,k+128)));return-1<O?(M!==!1&&(A.pos+=G+O+1),X+z.slice(0,O)):!1},f=function(A){let w=/^#\?(\S+)/,M=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,I=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,k=/^\s*FORMAT=(\S+)\s*$/,O=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,G={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},X,z;for((A.pos>=A.byteLength||!(X=d(A)))&&a(1,"no header found"),(z=X.match(w))||a(3,"bad initial token"),G.valid|=1,G.programtype=z[1],G.string+=X+`
`;X=d(A),X!==!1;){if(G.string+=X+`
`,X.charAt(0)==="#"){G.comments+=X+`
`;continue}if((z=X.match(M))&&(G.gamma=parseFloat(z[1])),(z=X.match(I))&&(G.exposure=parseFloat(z[1])),(z=X.match(k))&&(G.valid|=2,G.format=z[1]),(z=X.match(O))&&(G.valid|=4,G.height=parseInt(z[1],10),G.width=parseInt(z[2],10)),G.valid&2&&G.valid&4)break}return G.valid&2||a(3,"missing format specifier"),G.valid&4||a(3,"missing image size specifier"),G},p=function(A,w,M){let I=w;if(I<8||I>32767||A[0]!==2||A[1]!==2||A[2]&128)return new Uint8Array(A);I!==(A[2]<<8|A[3])&&a(3,"wrong scanline width");let k=new Uint8Array(4*w*M);k.length||a(4,"unable to allocate buffer space");let O=0,G=0,X=4*I,z=new Uint8Array(4),K=new Uint8Array(X),W=M;for(;W>0&&G<A.byteLength;){G+4>A.byteLength&&a(1),z[0]=A[G++],z[1]=A[G++],z[2]=A[G++],z[3]=A[G++],(z[0]!=2||z[1]!=2||(z[2]<<8|z[3])!=I)&&a(3,"bad rgbe scanline format");let te=0,re;for(;te<X&&G<A.byteLength;){re=A[G++];let Pe=re>128;if(Pe&&(re-=128),(re===0||te+re>X)&&a(3,"bad scanline data"),Pe){let Ye=A[G++];for(let Z=0;Z<re;Z++)K[te++]=Ye}else K.set(A.subarray(G,G+re),te),te+=re,G+=re}let be=I;for(let Pe=0;Pe<be;Pe++){let Ye=0;k[O]=K[Pe+Ye],Ye+=I,k[O+1]=K[Pe+Ye],Ye+=I,k[O+2]=K[Pe+Ye],Ye+=I,k[O+3]=K[Pe+Ye],O+=4}W--}return k},y=function(A,w,M,I){let k=A[w+3],O=Math.pow(2,k-128)/255;M[I+0]=A[w+0]*O,M[I+1]=A[w+1]*O,M[I+2]=A[w+2]*O,M[I+3]=1},x=function(A,w,M,I){let k=A[w+3],O=Math.pow(2,k-128)/255;M[I+0]=kr.toHalfFloat(Math.min(A[w+0]*O,65504)),M[I+1]=kr.toHalfFloat(Math.min(A[w+1]*O,65504)),M[I+2]=kr.toHalfFloat(Math.min(A[w+2]*O,65504)),M[I+3]=kr.toHalfFloat(1)},g=new Uint8Array(e);g.pos=0;let m=f(g),v=m.width,_=m.height,b=p(g.subarray(g.pos),v,_),D,T,C;switch(this.type){case gn:C=b.length/4;let A=new Float32Array(C*4);for(let M=0;M<C;M++)y(b,M*4,A,M*4);D=A,T=gn;break;case Nt:C=b.length/4;let w=new Uint16Array(C*4);for(let M=0;M<C;M++)x(b,M*4,w,M*4);D=w,T=Nt;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:v,height:_,data:D,header:m.string,gamma:m.gamma,exposure:m.exposure,type:T}}setDataType(e){return this.type=e,this}load(e,t,n,s){function r(a,o){switch(a.type){case gn:case Nt:a.colorSpace=ti,a.minFilter=Ht,a.magFilter=Ht,a.generateMipmaps=!1,a.flipY=!0;break}t&&t(a,o)}return super.load(e,r,n,s)}};var N={};h.R=N;var Uv={uniforms:{tDiffuse:{value:null},uTime:{value:0},uContrast:{value:1.08},uSat:{value:1.12},uTint:{value:new L(1,1,1)},uVignette:{value:.32},uGrain:{value:.035},uSplit:{value:0},uTexel:{value:new le(1/1280,1/720)},uSharp:{value:.2},uTilt:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uTime, uContrast, uSat, uVignette, uGrain, uSplit, uSharp, uTilt; uniform vec3 uTint; uniform vec2 uTexel; varying vec2 vUv;
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
      // Tilt-shift: the top and bottom of the screen go soft, like a miniature diorama. Middle stays sharp.
      float tilt = uTilt * smoothstep(0.16, 0.5, abs(vUv.y - 0.5));
      if (tilt > 0.01) {
        vec3 b = vec3(0.0); float r = tilt * 3.5;
        for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; b += texture2D(tDiffuse, vUv + vec2(cos(a), sin(a)) * uTexel * r * (1.0 + float(i - (i / 2) * 2))).rgb; }
        c = mix(c, b / 8.0, min(1.0, tilt * 1.4));
      }
      c = max(c + (c - nb * 0.25) * uSharp * (1.0 - tilt), 0.0);
      c = (c - 0.5) * uContrast + 0.5;
      c = mix(c, c * c * (3.0 - 2.0 * c), 0.25); // gentle filmic S-curve: deeper shadows, punchier highlights
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, uSat) * uTint;
      c *= 1.0 - uVignette * smoothstep(0.25, 0.85, length(d) * 1.35);
      c += (hash(vUv * 900.0) - 0.5) * uGrain;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`};N.init=function(i){try{N.renderer=new $a({canvas:i,antialias:!0,powerPreference:"high-performance"})}catch(t){throw document.body.insertAdjacentHTML("beforeend",'<div style="position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:#07080b;color:#fff;font:600 17px system-ui;text-align:center;padding:24px">This browser could not start 3D graphics.<br><br>Try closing other tabs, turning off Low Power Mode, or opening the link in Chrome or Safari.</div>'),t}i.addEventListener("webglcontextlost",t=>{t.preventDefault(),h.settings.quality="low",h.saveSettings(),setTimeout(()=>location.reload(),1500)}),N.renderer.toneMapping=Ur,N.renderer.toneMappingExposure=1.05,N.renderer.shadowMap.type=lh,N.scene=new Ks,N.pmrem=new $s(N.renderer),N.studioEnv=N.pmrem.fromScene(new Eo,.04).texture,N.scene.environment=N.studioEnv,N.scene.environmentIntensity=.35,N.envCache={},N.camera=new Jt(38,1,.5,300),N.camOffset=new L(0,19,12),N.camTarget=new L,N.shake=0,N.split=0,N.dyn=1,N.dynT=0,N.hemi=new oo(13624319,3813928,.7),N.scene.add(N.hemi),N.sun=new co(16773590,2.2),N.sun.position.set(12,30,8),Object.assign(N.sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:80}),N.sun.shadow.bias=-4e-4,N.sun.shadow.normalBias=.03,N.scene.add(N.sun,N.sun.target),N.lights=[];for(let t=0;t<8;t++){let n=new Qs(16777215,0,20,1.2);n.position.set(0,-50,0),N.scene.add(n),N.lights.push(n)}N.lightNext=0,N.flash=new lo(16773848,0,26,.42,.45,1),N.flash.position.set(0,-50,0),N.scene.add(N.flash,N.flash.target),N.flashOn=!1,N.flashBoost=0,N.muzzleT=0;let e=new eo(2.6,11,24,1,!0).translate(0,-5.5,0).rotateX(-Math.PI/2);N.beam=new he(e,new ft({color:16773328,transparent:!0,opacity:.07,blending:xn,depthWrite:!1,side:Bt,toneMapped:!1})),N.beam.visible=!1,N.beam.renderOrder=4,N.scene.add(N.beam),N.applyQuality(h.settings.quality),addEventListener("resize",N.resize)};N.setEnv=function(i){if(N.envWant=i,N.envCache[i]){N.scene.environment=N.envCache[i];return}fetch(`assets/hdri/${i}_1k.b64.txt`).then(e=>{if(!e.ok)throw new Error(e.status);return e.text()}).then(e=>{let t=atob(e.trim()),n=new Uint8Array(t.length);for(let o=0;o<t.length;o++)n[o]=t.charCodeAt(o);let s=new So().parse(n.buffer),r=new Qn(s.data,s.width,s.height,ln,s.type);Object.assign(r,{colorSpace:ti,mapping:Sr,minFilter:Ht,magFilter:Ht,generateMipmaps:!1,flipY:!0}),r.needsUpdate=!0;let a=N.pmrem.fromEquirectangular(r).texture;r.dispose(),N.envCache[i]=a,N.envWant===i&&(N.scene.environment=a)}).catch(()=>{N.scene.environment=N.studioEnv})};N.muzzle=function(i,e,t=1){let n=h.W.muzzle;n&&(N.muzzleT=Math.max(N.muzzleT,t),n.position.set(i,1.6,e))};N.updateFlash=function(i){let e=h.officers&&h.officers.find(t=>!t.down);if(h.W.muzzle&&(N.muzzleT=Math.max(0,N.muzzleT-i*9),h.W.muzzle.intensity=N.muzzleT*40),!N.flashOn||!e){N.flash.intensity=0,N.flash.position.set(0,-50,0),N.beam.visible=!1;return}N.flashBoost=Math.max(0,N.flashBoost-i*4),N.flash.intensity=90+N.flashBoost*160,N.flash.distance=32,N.flash.angle=.5-N.flashBoost*.08,N.beam.visible=!0,N.beam.position.set(e.x+e.ax*.5,1.5,e.z+e.az*.5),N.beam.lookAt(e.x+e.ax*11,.2,e.z+e.az*11),N.beam.material.opacity=.06+N.flashBoost*.08,N.flash.position.set(e.x-e.ax*.3,1.9,e.z-e.az*.3),N.flash.target.position.set(e.x+e.ax*9,0,e.z+e.az*9),h.W.halo&&h.W.halo.position.set(e.x,2.6,e.z)};N.takeLight=function(i,e,t){let n=N.lights[N.lightNext++%N.lights.length];return n.color.set(i),n.intensity=e,n.distance=t,n};N.resetLights=function(){for(let i of N.lights)i.intensity=0,i.position.set(0,-50,0);N.lightNext=0};N.precompile=function(){N.renderer.compile(N.scene,N.camera)};N.applyQuality=function(i){let e=h.QUALITY[i]||h.QUALITY.high,t=N.q?N.q.shadows!==e.shadows:!0;N.q=e,N.qName=i,N.dyn=1,N.renderer.shadowMap.enabled=e.shadows,N.sun.castShadow=e.shadows,e.shadows&&(N.sun.shadow.mapSize.set(e.shadowMap,e.shadowMap),N.sun.shadow.map&&(N.sun.shadow.map.dispose(),N.sun.shadow.map=null)),t&&N.scene.traverse(n=>{n.material&&(n.material.needsUpdate=!0)}),N.buildComposer(),N.resize()};N.buildComposer=function(){N.composer&&N.composer.dispose(),N.composer=null,N.ao=null,N.grade=null;let i=N.q;if(!i.grade)return;let e=new kt(1,1,{type:Nt,samples:4});if(N.composer=new vo(N.renderer,e),N.composer.addPass(new _o(N.scene,N.camera)),i.ao){N.ao=new Gr(N.scene,N.camera,1,1),N.ao.blendIntensity=.9;let n=N.ao.setSize.bind(N.ao);N.ao.setSize=(s,r)=>n(Math.max(1,s>>1),Math.max(1,r>>1)),N.composer.addPass(N.ao)}i.bloom&&N.composer.addPass(N.bloom=new ir(new le(1,1),.6,.5,.82)),N.composer.addPass(new wo),N.composer.addPass(N.grade=new nr(Uv)),N.setGrade(N.gradeLook||{});let t=N.renderer.getDrawingBufferSize(new le);N.grade.uniforms.uTexel.value.set(1/Math.max(1,t.x),1/Math.max(1,t.y)),N.grade.uniforms.uTilt.value=i.bloom&&!matchMedia("(pointer: coarse)").matches?1:0};N.setGrade=function(i){if(N.gradeLook=i,!N.grade)return;let e=N.grade.uniforms;e.uContrast.value=i.contrast??1.08,e.uSat.value=i.sat??1.12,e.uVignette.value=i.vignette??.32,e.uTint.value.set(...i.tint||[1,1,1])};N.resize=function(){let i=innerWidth,e=innerHeight,t=matchMedia("(pointer: coarse)").matches,n=Math.min(devicePixelRatio||1,t?1.5:2)*N.q.pixel*N.dyn;N.renderer.setPixelRatio(n),N.renderer.setSize(i,e,!1),N.camera.aspect=i/e,N.zoom=i<e?1.55:e<560?1.25:1.12,N.camera.updateProjectionMatrix(),N.composer&&(N.composer.setPixelRatio(n),N.composer.setSize(i,e)),N.grade&&N.grade.uniforms.uTexel.value.set(1/Math.max(1,i*n),1/Math.max(1,e*n))};N.tuneResolution=function(i,e){if(N.dynT-=e,N.dynT>0)return;let t=N.dyn;i<52&&N.dyn>.6?t=Math.max(.6,N.dyn-.1):i>58&&N.dyn<1&&(t=Math.min(1,N.dyn+.05)),t!==N.dyn?(N.dyn=t,N.resize(),N.dynT=2):N.dynT=1};N.follow=function(i,e,t,n=1){let s=1-Math.exp(-t*6);N.camTarget.x+=(i-N.camTarget.x)*s,N.camTarget.z+=(e-N.camTarget.z)*s;let r=(N.zoom||1)*n,a=0,o=0;N.shake>0&&(a=(Math.random()-.5)*N.shake,o=(Math.random()-.5)*N.shake,N.shake=Math.max(0,N.shake-t*3)),N.camera.position.set(N.camTarget.x+N.camOffset.x*r+a,N.camOffset.y*r,N.camTarget.z+N.camOffset.z*r+o),N.camera.lookAt(N.camTarget.x+a,0,N.camTarget.z+o),N.sun.position.set(N.camTarget.x+12,30,N.camTarget.z+8),N.sun.target.position.set(N.camTarget.x,0,N.camTarget.z),N.split=Math.max(0,N.split-t*2.5)};N.render=function(i){N.grade&&(N.grade.uniforms.uTime.value=i%100,N.grade.uniforms.uSplit.value=N.split),N.composer?N.composer.render():N.renderer.render(N.scene,N.camera)};var tf=new uo,nf=new le,sf=new Wn(new L(0,1,0),0),rf=new L;N.screenToGround=function(i,e,t=1){return nf.set(i/innerWidth*2-1,-(e/innerHeight)*2+1),tf.setFromCamera(nf,N.camera),sf.constant=-t,tf.ray.intersectPlane(sf,rf)?rf:null};var To=new L;N.worldToScreen=function(i,e,t){return To.set(i,e,t).project(N.camera),[(To.x+1)*.5*innerWidth,(1-To.y)*.5*innerHeight,To.z<1]};function Vr(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new zt,c=0;for(let u=0;u<i.length;++u){let d=i[u],f=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in d.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(d.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in d.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(d.morphAttributes[p])}if(e){let p;if(t)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,u),c+=p}}if(t){let u=0,d=[];for(let f=0;f<i.length;++f){let p=i[f].index;for(let y=0;y<p.count;++y)d.push(p.getX(y)+u);u+=i[f].attributes.position.count}l.setIndex(d)}for(let u in r){let d=af(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,d)}for(let u in a){let d=a[u][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let f=0;f<d;++f){let p=[];for(let x=0;x<a[u].length;++x)p.push(a[u][x][f]);let y=af(p);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(y)}}return l}function af(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let u=i[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let a=new e(r),o=new Ot(a,t,n),l=0;for(let c=0;c<i.length;++c){let u=i[c];if(u.isInterleavedBufferAttribute){let d=l/t;for(let f=0,p=u.count;f<p;f++)for(let y=0;y<t;y++){let x=u.getComponent(f,y);o.setComponent(f+d,y,x)}}else a.set(u.array,l);l+=u.count*t}return s!==void 0&&(o.gpuType=s),o}function Ch(i,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),l={},c={},u=[],d=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let v=0,_=o.length;v<_;v++){let b=o[v],D=i.attributes[b];l[b]=new D.constructor(new D.array.constructor(D.count*D.itemSize),D.itemSize,D.normalized);let T=i.morphAttributes[b];T&&(c[b]||(c[b]=[]),T.forEach((C,A)=>{let w=new C.array.constructor(C.count*C.itemSize);c[b][A]=new C.constructor(w,C.itemSize,C.normalized)}))}let p=e*.5,y=Math.log10(1/e),x=Math.pow(10,y),g=p*x;for(let v=0;v<r;v++){let _=n?n.getX(v):v,b="";for(let D=0,T=o.length;D<T;D++){let C=o[D],A=i.getAttribute(C),w=A.itemSize;for(let M=0;M<w;M++)b+=`${~~(A[d[M]](_)*x+g)},`}if(b in t)u.push(t[b]);else{for(let D=0,T=o.length;D<T;D++){let C=o[D],A=i.getAttribute(C),w=i.morphAttributes[C],M=A.itemSize,I=l[C],k=c[C];for(let O=0;O<M;O++){let G=d[O],X=f[O];if(I[X](a,A[G](_)),w)for(let z=0,K=w.length;z<K;z++)k[z][X](a,w[z][G](_))}}t[b]=a,u.push(a),a++}}let m=i.clone();for(let v in i.attributes){let _=l[v];if(m.setAttribute(v,new _.constructor(_.array.slice(0,a*_.itemSize),_.itemSize,_.normalized)),v in c)for(let b=0;b<c[v].length;b++){let D=c[v][b];m.morphAttributes[v][b]=new D.constructor(D.array.slice(0,a*D.itemSize),D.itemSize,D.normalized)}}return m.setIndex(u),m}function ms(i,e){let t=document.createElement("canvas");return t.width=i,t.height=e,[t,t.getContext("2d")]}function Wr(i,e=1){let t=new Wi(i);return t.colorSpace=Ft,t.wrapS=t.wrapT=Cn,t.repeat.set(e,e),t.anisotropy=8,t}function Ov(i,e,t,n,s,r=2){for(let a=0;a<n;a++){i.fillStyle=s[Math.random()*s.length|0],i.globalAlpha=Math.random()*.5+.1;let o=Math.random()*r+.5;i.fillRect(Math.random()*e,Math.random()*t,o,o)}i.globalAlpha=1}function of(){let[i,e]=ms(128,128);e.clearRect(0,0,128,128),e.strokeStyle="#c9ccd0",e.lineWidth=3;for(let t=-128;t<256;t+=16)e.beginPath(),e.moveTo(t,0),e.lineTo(t+128,128),e.stroke(),e.beginPath(),e.moveTo(t+128,0),e.lineTo(t,128),e.stroke();return Wr(i)}function Xr(i,e={}){let t=e.w||512,n=e.h||128,[s,r]=ms(t,n);e.bg&&(r.fillStyle=e.bg,r.fillRect(0,0,t,n)),r.fillStyle=e.color||"#f2f2f2",r.font=`900 ${e.size||64}px Impact, "Arial Black", sans-serif`,r.textAlign="center",r.textBaseline="middle";let a=String(i).split(`
`),o=(e.size||64)*1.1;a.forEach((c,u)=>r.fillText(c,t/2,n/2+(u-(a.length-1)/2)*o)),e.worn&&(r.globalCompositeOperation="destination-out",Ov(r,t,n,1800,["#000"],4),r.globalCompositeOperation="source-over");let l=Wr(s);return l.wrapS=l.wrapT=Rn,l}function lf(){let[i,e]=ms(256,340);return e.fillStyle="#f7f3e8",e.fillRect(0,0,256,340),e.fillStyle="#b3121b",e.fillRect(0,0,256,70),e.fillStyle="#fff",e.font="900 46px Impact, sans-serif",e.textAlign="center",e.fillText("PREA",128,52),e.fillStyle="#111",e.font="700 22px Arial, sans-serif",["ZERO TOLERANCE","For real this time.","","Training Module","2 of 47","","Initial here: ____"].forEach((t,n)=>e.fillText(t,128,110+n*30)),Wr(i)}var rr=8;function cf(){let[t,n]=ms(256*rr,256);n.fillStyle="#fff",n.fillRect(0,0,256*rr,256);for(let r=0;r<rr;r++){let a=r*256+64,o=256*.44,l=(f,p=7)=>{n.fillStyle="#1a1210",n.beginPath(),n.ellipse(a+f,o,p*.8,p,0,0,6.28),n.fill()},c=f=>{n.strokeStyle="#2a1a12",n.lineWidth=6,n.lineCap="round",[-1,1].forEach(p=>{n.beginPath(),n.moveTo(a+p*30,o-18-f*p*-1),n.lineTo(a+p*9,o-16+f),n.stroke()})},u=(f,p)=>{n.strokeStyle="#4a2018",n.lineWidth=5,n.beginPath(),n.moveTo(a-f,256*.62),n.quadraticCurveTo(a,256*.62+p,a+f,256*.62),n.stroke()},d=f=>`rgba(25,18,14,${f})`;r===7?(l(-18,11),l(18,11),n.fillStyle="#fff",n.fillRect(a-20,o-3,4,4),n.fillRect(a+16,o-3,4,4),u(22,14)):(l(-17),l(17)),(r===1||r===4||r===5)&&c(8),r===0||r===3?u(14,-4):r!==7&&u(16,6),r===2&&(n.fillStyle=d(.75),n.beginPath(),n.ellipse(a,256*.68,46,34,0,0,3.14),n.fill()),r===3&&(n.fillStyle=d(.8),n.fillRect(a-10,256*.66,20,24)),r===4&&(n.fillStyle=d(.85),n.fillRect(a-24,256*.57,48,9)),r===5&&(n.fillStyle=d(.9),n.beginPath(),n.ellipse(a+22,o+20,4,7,0,0,6.28),n.fill(),n.font="900 16px Arial",n.textAlign="center",n.fillText("13",a,256*.3)),r===6&&(n.strokeStyle="rgba(120,40,40,0.8)",n.lineWidth=4,n.beginPath(),n.moveTo(a-34,o-22),n.lineTo(a-12,o+26),n.stroke(),c(4))}let s=Wr(t);return s.wrapS=s.wrapT=Rn,s}function hf(){let[i,e]=ms(512,128);e.fillStyle="#fff",e.fillRect(0,0,512,128),e.fillStyle="rgba(15,15,15,0.9)",e.textAlign="center",e.textBaseline="middle",e.font="900 96px Impact, Arial Black, sans-serif",e.fillText("DOC",256,66),e.font="900 44px Impact, Arial Black, sans-serif",e.fillText("DOC",451,52),e.font="900 15px Arial Black, sans-serif",e.fillText("#"+(4e3+Math.floor(Math.random()*999)),451,92);let t=Wr(i);return t.wrapS=t.wrapT=Rn,t}function uf(i){return Xr(i,{w:512,h:128,size:i.length>8?58:80,color:"#e8e2cf",bg:"#1b1f29"})}function df(){let[i,e]=ms(4,128),t=e.createLinearGradient(0,0,0,128);return t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.2,"rgba(255,255,255,0.5)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,4,128),new Wi(i)}function ff(){let[i,e]=ms(128,128),t=e.createRadialGradient(64,64,4,64,64,62);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.6,"rgba(255,255,255,0.85)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t;for(let s=0;s<7;s++){let r=Math.random()*6.28,a=Math.random()*22;e.beginPath(),e.arc(64+Math.cos(r)*a,64+Math.sin(r)*a,26+Math.random()*18,0,6.28),e.fill()}let n=new Wi(i);return n.colorSpace=Ft,n}var j={T:2,w:0,h:0,solid:null,rects:[],spawns:[],doors:[],lights:[],group:null};h.W=j;var He=j.T,pf=new Be,kv=new Yt,zv=new $t,Fv=new L,Bv=new L(1,1,1),kn=class{constructor(){this.geos=[]}add(e,t,n,s,r,a=0,o=0,l=0){let c=(e.index,e.clone());pf.compose(Fv.set(t,n,s),kv.setFromEuler(zv.set(o,a,l)),Bv),c.applyMatrix4(pf);let u=new ye(r),d=c.attributes.position.count,f=new Float32Array(d*3);for(let p=0;p<d;p++)f[p*3]=u.r,f[p*3+1]=u.g,f[p*3+2]=u.b;return c.setAttribute("color",new Ot(f,3)),this.geos.push(c),this}box(e,t,n,s,r,a,o,l=0){return this.add(new Se(e,t,n),s,r,a,o,l)}cyl(e,t,n,s,r,a,o=0,l=0,c=0,u=12,d=e){return this.add(new it(e,d,t,u),n,s,r,a,l,o,c)}build(e,t=!0){if(!this.geos.length)return null;let n=new he(Vr(this.geos,!1),e);return n.castShadow=t,n.receiveShadow=!0,this.geos.forEach(s=>s.dispose()),n}};j.Batch=kn;var Hv=new ao,Ph={};function Lh(i,e){if(!Ph[i]){let t=Hv.load(`assets/tex/${i}.jpg`);t.wrapS=t.wrapT=Cn,t.anisotropy=8,e&&(t.colorSpace=Ft),Ph[i]=t}return Ph[i]}function Nh(i,e,t=16777215,n={}){let s=r=>{let a=r.clone();return a.repeat.set(e[0],e[1]),a.needsUpdate=!0,a};return new Le(Object.assign({map:s(Lh(i+"_diff",!0)),normalMap:s(Lh(i+"_nor")),roughnessMap:s(Lh(i+"_rough")),color:t,normalScale:new le(1.2,1.2)},n))}j.pbrMat=Nh;var Kt={};function Gv(){Kt.ready||(Kt.paint=new Le({vertexColors:!0,roughness:.55,metalness:.25}),Kt.matte=new Le({vertexColors:!0,roughness:.9}),Kt.metal=new Le({vertexColors:!0,roughness:.35,metalness:.8}),Kt.glow=new ft({vertexColors:!0,toneMapped:!1}),Kt.shaft=new ft({map:df(),transparent:!0,opacity:.22,blending:xn,depthWrite:!1,side:Bt,toneMapped:!1}),Kt.fence=new Le({map:of(),alphaTest:.5,side:Bt,metalness:.6,roughness:.4}),Kt.ready=!0)}function Vv(i,e,t,n,s,r=0){let a=Math.cos(r),o=Math.sin(r),l=(d,f)=>[t+d*a+f*o,n-d*o+f*a],c=(d,f,p,y,x,g=0,m=0)=>{let[v,_]=l(f,y);i.add(d,v,p,_,x,r,g,m)},u=.55;[-1,1].forEach(d=>[-1.9,1.9].forEach(f=>c(new it(.62,.62,.5,16),d,.62,f,1447446,0,Math.PI/2))),[-1,1].forEach(d=>[-1.9,1.9].forEach(f=>c(new it(.32,.32,.52,10),d,.62,f,10133670,0,Math.PI/2))),c(new Se(1.6,.25,4.6),0,.7+u*.4,0,2236962),c(new Se(2.1,.75,5.6),0,1.25+u,0,s),c(new Se(2,.85,2),0,2.05+u,-.45,s),c(new Se(1.9,.6,1.9),0,2.08+u,-.45,1779507),c(new Se(1.8,.12,2.1),0,1.7+u,1.6,2763306),c(new Se(2.3,.3,.25),0,1+u,-2.85,14212579),[-.7,-.25,.25,.7].forEach(d=>{let[f,p]=l(d,-1.1);e.box(.32,.12,.14,f,2.6+u,p,16774348,r)}),[-.8,.8].forEach(d=>{let[f,p]=l(d,-2.82);e.box(.35,.18,.06,f,1.38+u,p,16776166,r)}),[-.85,.85].forEach(d=>{let[f,p]=l(d,2.82);e.box(.3,.2,.06,f,1.4+u,p,16722458,r)})}function Wv(i,e,t,n,s,r=0){let a=Math.cos(r),o=Math.sin(r),l=(u,d)=>[t+u*a+d*o,n-u*o+d*a],c=(u,d,f,p,y,x=0,g=0)=>{let[m,v]=l(d,p);i.add(u,m,f,v,y,r,x,g)};[-.8,.8].forEach(u=>[-1.4,1.4].forEach(d=>c(new it(.34,.34,.25,12),u,.34,d,1315860,0,Math.PI/2))),c(new Se(1.75,.6,4.3),0,.65,0,s),c(new Se(1.55,.5,2.1),0,1.18,.2,s),c(new Se(1.5,.42,2),0,1.2,.2,1779507),[-.6,.6].forEach(u=>{let[d,f]=l(u,-2.16);e.box(.3,.12,.05,d,.75,f,16776166,r)})}function Ao(i,e,t="."){return Array.from({length:e},()=>Array(i).fill(t))}var De=i=>i*He+He/2,Ue=i=>i*He+He/2;function Mn(i,e,t,n,s,r,a){let o=new he(new Pt(s,r),new Le({map:Xr(e,a),transparent:!0,roughness:.8,depthWrite:!1}));o.rotation.x=-Math.PI/2,o.position.set(t,.02,n),o.receiveShadow=!0,i.add(o)}function _n(i,e,t,n,s,r,a){let o=h.R.takeLight(i,e,t);return o.position.set(n,s,r),j.lights.push({L:o,base:e,kind:a,t:Math.random()*10}),o}function vf(i){let n=Ao(44,32);for(let a=0;a<44;a++)n[0][a]=n[1][a]=n[2][a]="#",n[31][a]="F";for(let a=0;a<32;a++)n[a][0]=n[a][43]="F";[10,22,34].forEach(a=>{n[2][a]="S",n[2][a+1]="S"}),[12,22].forEach(a=>{n[a][0]="S",n[a][43]="S"});let s={w:44,h:32,g:n,start:[De(22),Ue(28)],vehicles:[],outdoor:!0,theme:{floor:"asphalt_02",floorScale:6,wall:"precast_concrete_wall",hdri:"suburban_parking_area",envI:.75,grade:{tint:[1.07,1,.92],sat:1.12,contrast:1.08}}},r=[9379101,2047887,1118481,15263976,7040885,3104047,13214247,5910150];return[8,15,22].forEach((a,o)=>{for(let l=3;l<41;l+=3){if(Math.random()<.18)continue;let c=Math.random()<.5;s.vehicles.push({truck:c,x:De(l),z:Ue(a+1),color:h.pick(r),ry:o===1?Math.PI:0})}}),s.vehicles.push({truck:!0,x:De(30),z:Ue(28),color:1920959,ry:Math.PI/2,mine:!0}),s.vehicles.push({truck:!0,x:De(38),z:Ue(28),color:1118481,ry:Math.PI/2}),s.decor=a=>{Mn(a,`COMPACT
CARS ONLY`,De(9),Ue(12),5,2.5,{size:70,color:"#f5f5f5",worn:!0}),Mn(a,"RESERVED: SGT",De(18),Ue(19),6,1.6,{size:72,color:"#ffd23a",worn:!0}),Mn(a,`${i.toUpperCase()}'S TRUCK
(BOTH SPOTS)`,De(30),Ue(25.3),7,2.6,{size:60,color:"#9fd0ff",worn:!0}),Mn(a,`RESERVED: C. ALANIZ
BIG BRO PARKING`,De(38),Ue(25.3),7,2.6,{size:56,color:"#ffd34d",worn:!0}),Mn(a,"FIRE LANE",De(22),Ue(5),7,1.8,{size:90,color:"#e33",worn:!0});let o=new he(new Pt(14,1.4),new Le({map:Xr("BIG TRUCK STATE CORRECTIONAL",{w:1024,h:102,size:76,color:"#f3efe2",bg:"#24324a"}),roughness:.6}));o.position.set(34,1.6,3*He+.03),a.add(o)},s}function _f(){let t=Ao(38,26);for(let a=0;a<38;a++)t[0][a]=t[25][a]="#";for(let a=0;a<26;a++)t[a][0]=t[a][37]="#";let n=[],s=(a,o,l,c)=>{for(let u=1;u<37;u++)for(let d=a;d<=o;d++)t[d][u]=(u-1)%3===0?"#":".";for(let u=1;u<37;u++)t[l][u]=(u-1)%3===0?"#":"C";for(let u=2;u<37;u+=3)n.push({i:u,j:c?a+1:o-1,door:l,top:c})};s(1,3,4,!0),s(22,24,21,!1),[12,13].forEach(a=>{t[a][1]="S",t[a][36]="S"});let r={w:38,h:26,g:t,start:[De(19),Ue(13)],cells:n,tables:[],outdoor:!1,theme:{floor:"concrete_floor_worn_001",floorScale:5,wall:"concrete_block_wall",wallTint:15392710,stripe:3104680,hdri:"empty_warehouse_01",envI:.45,grade:{tint:[.95,1.02,.96],sat:1.05,contrast:1.18,vignette:.45}}};return[8,13,18].forEach(a=>[7,13,25,31].forEach(o=>r.tables.push([De(o),Ue(a)]))),r.decor=a=>{Mn(a,"IMU NORTH",De(19),Ue(9.5),6,2,{size:100,color:"#d8c79a",worn:!0}),Mn(a,`NO LOITERING
(YOU ARE LOITERING)`,De(19),Ue(17.5),7,2.2,{size:54,color:"#d8c79a",worn:!0}),[5,20].forEach(c=>{let u=new he(new Pt(36*He,.25),new Le({color:12591130,roughness:.7}));u.rotation.x=-Math.PI/2,u.position.set(38*He/2,.015,Ue(c)+(c===5?-.6:.6)),a.add(u)});let o=lf(),l=new Le({map:o,roughness:.8});[4,13,22,31].forEach(c=>{let u=new he(new Pt(.9,1.2),l);u.position.set(De(c),1.3,5*He+.03),a.add(u)})},r}function Xv(){let t=Ao(36,24);for(let a=0;a<36;a++)t[0][a]=t[23][a]="#";for(let a=0;a<24;a++)t[a][0]=t[a][35]="#";let n=[],s=[];for(let a=1;a<35;a++)for(let o=1;o<=3;o++)t[o][a]=(a-1)%3===0?"#":".";for(let a=1;a<35;a++)t[4][a]=(a-1)%3===0?"#":"C";for(let a=2;a<35;a+=3)s.push({i:a,j:2,door:4,top:!0,locked:!0});for(let a=1;a<35;a++)for(let o=20;o<=22;o++)t[o][a]=(a-1)%3===0?"#":".";for(let a=1;a<35;a++)t[19][a]=(a-1)%3===0?"#":"C";for(let a=2;a<35;a+=3)n.push({i:a,j:21,door:19,top:!1});[11,12].forEach(a=>{t[a][1]="S",t[a][34]="S"});let r={w:36,h:24,g:t,start:[De(18),Ue(14)],cells:s.concat(n),caged:s,tables:[],mode:"row",outdoor:!1,water:[[De(10),Ue(12),14,6],[De(25),Ue(11),10,5],[De(18),Ue(16),8,3]],theme:{floor:"damaged_concrete_floor",floorScale:5,wall:"concrete_wall_006",wallTint:12174536,stripe:7017492,hdri:"sepulchral_chapel_basement",envI:.6,grade:{tint:[.86,.98,1.08],sat:.85,contrast:1.25,vignette:.6}}};return r.decor=a=>{Mn(a,"KILLER ROW",De(18),Ue(8),9,2.4,{size:100,color:"#b8c6cc",worn:!0}),Mn(a,`DO NOT FEED
DO NOT CHAT
DO NOT BUY THE PAINTINGS`,De(18),Ue(18.5),8,3,{size:46,color:"#c43a3a",worn:!0})},r}var _t=2830133,si=14212579,qr=1381653,Uh=[1118481,11739162,1851294,14198048,3112242];function Oh(i,e,t,n,s,r,a=!1){i.cyl(.025,s,e,t,n,si,a?Math.PI/2:0,0,a?0:Math.PI/2,8);for(let o=-1;o<=1;o+=2)for(let l=0;l<r;l++){let c=(s/2-.25-l*.07)*o,u=.23-l*.025;i.cyl(u,.06,a?e:e+c,t,a?n+c:n,Uh[l%Uh.length],a?Math.PI/2:0,0,a?0:Math.PI/2,16)}}function mf(i,e,t,n,s){e.box(.34,.1,1.25,t,.46,n,qr),i.box(.08,.42,.08,t,.21,n-.5,_t).box(.08,.42,.08,t,.21,n+.45,_t).box(.6,.05,.08,t,.03,n-.5,_t).box(.6,.05,.08,t,.03,n+.45,_t);for(let r of[-.55,.55])i.box(.08,1.15,.08,t+r,.58,n-.62,_t),i.box(.12,.05,.12,t+r,1.05,n-.55,si);Oh(i,t,1.1,n-.55,2.2,s),j.rects.push({x:t,z:n-.1,hw:1,hd:.8})}function qv(i,e,t,n,s){e.box(.34,.1,.5,t,.46,n+.35,qr),e.add(new Se(.34,.1,.95),t,.75,n-.15,qr,0,-.62,0),i.box(.08,.45,.08,t,.22,n+.45,_t).box(.08,.95,.08,t,.47,n-.45,_t);for(let r of[-.55,.55])i.box(.08,1.5,.08,t+r,.75,n-.6,_t);Oh(i,t,1.42,n-.55,2.2,s),j.rects.push({x:t,z:n,hw:1,hd:.8})}function gf(i,e,t,n){for(let s of[-.65,.65])for(let r of[-.55,.55])i.box(.09,2.4,.09,t+s,1.2,n+r,_t);for(let s of[-.55,.55])i.box(1.4,.09,.09,t,2.38,n+s,_t);for(let s of[-.65,.65])i.box(.09,.09,1.2,t+s,2.38,n,_t),i.box(.09,.09,1.2,t+s,.05,n,_t),i.box(.06,.06,1.1,t+s,.75,n,si);i.cyl(.02,1.4,t,2.45,n+.62,si,0,0,Math.PI/2,8),e.box(1.6,.03,1.6,t,.015,n,2760726),Oh(i,t,1.42,n-.5,2.3,4),j.rects.push({x:t,z:n,hw:.85,hd:.75})}function Yv(i,e,t,n){i.box(3.4,.08,.5,t,.55,n,_t).box(3.4,.08,.5,t,.9,n-.05,_t);for(let s of[-1.6,0,1.6])i.box(.08,.9,.5,t+s,.45,n,_t);for(let s=0;s<8;s++)for(let[r,a]of[[.65,.08],[1,.03]]){let o=t-1.45+s*.41,l=.06+s*.008;i.cyl(.018,.3,o,r,n+a-.08,si,0,0,Math.PI/2,6);for(let c of[-.14,.14])i.cyl(l,.06,o+c,r,n+a-.08,1579034,0,0,Math.PI/2,6)}j.rects.push({x:t,z:n,hw:1.8,hd:.4})}function $v(i,e,t,n){i.box(1.1,.08,1.7,t,.04,n,_t),i.box(.1,.42,.1,t,.25,n+.35,_t),e.box(.5,.1,.45,t,.5,n+.35,qr),i.box(.1,1.3,.1,t,.68,n+.7,_t),e.box(.5,.75,.1,t,1,n+.62,qr);for(let s of[-1,1])i.box(.07,.07,.75,t+s*.38,1,n+.25,_t),i.box(.07,.3,.07,t+s*.38,.88,n-.12,_t),i.cyl(.03,.22,t+s*.3,.75,n-.12,2236962,0,0,Math.PI/2,8);i.box(.1,1.9,.1,t-.25,.95,n-.65,_t).box(.1,1.9,.1,t+.25,.95,n-.65,_t).box(.6,.1,.12,t,1.9,n-.65,_t);for(let s=0;s<14;s++)i.box(.38,.05,.2,t,.12+s*.058,n-.65,s===9?11739162:7172986);i.cyl(.012,1.5,t-.08,.85,n-.65,si,0,0,0,6).cyl(.012,1.5,t+.08,.85,n-.65,si,0,0,0,6),j.rects.push({x:t,z:n,hw:.65,hd:.95})}function Zv(i,e,t,n){for(let a=0;a<=3;a++)i.box(.1,2.7,.1,t-3*1.3/2+a*1.3,1.35,n,_t);i.box(3*1.3+.1,.1,.1,t,2.7,n,_t);for(let a=0;a<3;a++)i.cyl(.025,1.3-.1,t-3*1.3/2+(a+.5)*1.3,2.45,n+.15,si,0,0,Math.PI/2,8);for(let a of[-.28,.28])i.box(.06,.06,.6,t+3*1.3/2+.5+a,1.2,n,si).box(.08,1.2,.08,t+3*1.3/2+.5+a,.6,n-.28,_t);j.rects.push({x:t+.3,z:n,hw:3*1.3/2+.7,hd:.3})}function xf(i,e,t){i.box(.1,1.4,.1,e,.7,t,_t).box(.8,.06,.8,e,.03,t,_t);for(let n=0;n<6;n++){let s=n*Math.PI/3;i.cyl(.03,.3,e+Math.cos(s)*.15,.3+n%3*.4,t+Math.sin(s)*.15,si,0,-s,Math.PI/2,6),i.cyl(.23,.06,e+Math.cos(s)*.3,.3+n%3*.4,t+Math.sin(s)*.3,Uh[n%4],0,-s,Math.PI/2,16)}j.rects.push({x:e,z:t,hw:.5,hd:.5})}function Mf(i){let n=Ao(44,30);for(let r=0;r<44;r++)n[0][r]=n[1][r]=n[2][r]="#",n[29][r]="F";for(let r=0;r<30;r++)n[r][0]=n[r][43]="F";[8,20,32].forEach(r=>{n[2][r]="S",n[2][r+1]="S"}),[14,15].forEach(r=>{n[r][0]="S",n[r][43]="S"});let s={w:44,h:30,g:n,start:[De(20),Ue(24)],outdoor:!0,mode:"yard",tables:[],theme:{floor:"asphalt_02",floorScale:7,floorTint:14209732,wall:"precast_concrete_wall",wallTint:14274488,stripe:3104680,hdri:"suburban_parking_area",envI:.9,grade:{tint:[1.04,1,.95],sat:1.12,contrast:1.08}},lifters:[],gym:{x0:52,x1:84,z0:9,z1:31}};return s.lifters=[[57,15],[63.5,15],[70,15],[58,23.5],[66,23.5],[76,24.5],[80,15]],[[14,20],[26,20]].forEach(([r,a])=>s.tables.push([De(r),Ue(a)])),s.decor=r=>{let a=new kn,o=new kn,l=new kn,c=new he(new Pt(32,22),new Le({color:1776671,roughness:.95}));c.rotation.x=-Math.PI/2,c.position.set(68,.012,20),c.receiveShadow=!0,r.add(c);for(let[d,f,p,y]of[[68,9,32,.15],[68,31,32,.15],[52,20,.15,22],[84,20,.15,22]])l.box(p,.02,y,d,.02,f,16765498);mf(a,o,57,15,3),mf(a,o,63.5,15,4),qv(a,o,70,15,2),$v(a,o,79,15),gf(a,o,58,23.5),gf(a,o,65,23.5),Yv(a,o,73,28.5),Zv(a,o,74,21),xf(a,83,26),xf(a,53.5,28);for(let[d,f,p,y]of[[24,13,28,.12],[10,27,.12,28],[38,27,.12,28],[24,19,8,.12],[20,16,.12,6],[28,16,.12,6]])l.box(p,.02,y,d,.02,f,15921906);a.box(.15,3,.15,24,1.5,9.6,2767466).box(1.8,1.05,.06,24,3.05,10,15921906),a.add(new yn(.23,.02,6,16),24,2.75,10.35,16734746,0,Math.PI/2,0),j.rects.push({x:24,z:9.6,hw:.3,hd:.3}),o.box(6,.45,.7,44,.22,7,9077880),j.rects.push({x:44,z:7,hw:3,hd:.4}),r.add(a.build(Kt.metal),o.build(Kt.paint),l.build(Kt.matte,!1)),Mn(r,"WEIGHT PIT",68,11,7,1.6,{size:90,color:"#ffd23a",worn:!0}),Mn(r,`NO SPOTTING
WITHOUT CONSENT FORM`,68,32.5,8,2.4,{size:54,color:"#d8c79a",worn:!0}),Mn(r,"REC YARD",24,34,7,2,{size:90,color:"#d8c79a",worn:!0});let u=new he(new Pt(6.4,2),new Le({map:Xr(`YARD RECORDS
BENCH 405 . C. ALANIZ
SQUAT 585 . C. ALANIZ
CURLS . C. ALANIZ (IN THE SQUAT RACK)`,{w:1024,h:320,size:46,color:"#f3efe2",bg:"#1d2a40"}),roughness:.6}));u.position.set(68,1.5,3*He+.03),r.add(u)},s}function Kv(i){let e=_f();e.mode="night",e.theme=Object.assign({},e.theme,{hdri:"sepulchral_chapel_basement",envI:.08,grade:{tint:[.85,.95,1.12],sat:.7,contrast:1.3,vignette:.75}}),e.scares=[[10,12],[19,9],[28,15],[33,11],[6,16],[24,18],[15,14]].map(([n,s])=>({x:De(n),z:Ue(s),done:!1}));let t=e.decor;return e.decor=n=>{t(n),Mn(n,`LIGHTS OUT
2300 - 0600`,De(19),Ue(13),6,2.4,{size:70,color:"#7fb0ff",worn:!0})},e}function bf(i,e,t){i.mode="night",i.lifters=null,i.theme=Object.assign({},i.theme,{hdri:"sepulchral_chapel_basement",envI:.08,grade:t||{tint:[.85,.95,1.12],sat:.7,contrast:1.3,vignette:.75}}),i.scares="random";let n=i.decor;return i.decor=s=>{n&&n(s),Mn(s,e[0],i.start[0],i.start[1]-6,7,2.4,{size:70,color:e[1],worn:!0})},i}function Jv(i){return bf(vf(i),[`GRAVEYARD SHIFT
0300`,"#ff9a5a"],{tint:[1.08,.9,.82],sat:.65,contrast:1.32,vignette:.8})}function jv(i){return bf(Mf(i),[`BLACKOUT
YARD CLOSED`,"#ff4a4a"],{tint:[.82,1,.9],sat:.6,contrast:1.35,vignette:.8})}j.BUILDERS={lot:vf,tier:_f,yard:Mf,night:Kv,row:Xv,graveyard:Jv,blackout:jv};j.load=function(i,e){j.alarmT=0,j.hemiBase=null,j.halo=null,j.muzzle=null,Gv(),j.group&&(h.R.scene.remove(j.group),j.group.traverse(x=>{x.geometry&&x.geometry.dispose()})),j.group=new ut,j.lights=[],j.rects=[],j.spawns=[],j.doors=[],h.R.resetLights(),h.R.scene.add(j.group);let t=j.BUILDERS[i](e);j.def=t,j.w=t.w,j.h=t.h,j.outdoor=t.outdoor,j.solid=new Uint8Array(t.w*t.h);let n=2.4,s=t.h,r=t.theme,a=r.floorScale,o=new he(new Pt(t.w*He,t.h*He),Nh(r.floor,[t.w*He/a,t.h*He/a],r.floorTint||16777215));o.rotation.x=-Math.PI/2,o.position.set(t.w*He/2,0,t.h*He/2),o.receiveShadow=!0,j.group.add(o);let l=new he(new Pt(400,400),new Le({color:t.outdoor?4872754:1118740,roughness:1}));l.rotation.x=-Math.PI/2,l.position.set(t.w*He/2,-.02,t.h*He/2),l.receiveShadow=!0,j.group.add(l);let c=new kn,u=new kn,d=new kn,f=new kn,p=new kn,y=[];for(let x=0;x<t.h;x++)for(let g=0;g<t.w;g++){let m=t.g[x][g],v=De(g),_=Ue(x);if(m==="#")j.solid[x*t.w+g]=1,c.box(He,n,He,v,n/2,_,16777215),u.box(He+.02,.08,He+.02,v,n+.04,_,3882306),r.stripe&&u.box(He+.02,.16,He+.02,v,1.15,_,r.stripe);else if(m==="F"){j.solid[x*t.w+g]=1;let b=x===0||x===t.h-1,D=new Pt(He,n);D.rotateY(b?0:Math.PI/2),D.translate(v,n/2,_),y.push(D),d.cyl(.06,n+.3,v-(b?He/2:0),(n+.3)/2,_-(b?0:He/2),9080726);for(let T=0;T<3;T++)d.add(new yn(.28,.025,4,10),v,n+.25,_+(b?0:(T-1)*.6),13620184,b?0:Math.PI/2,0,0)}else m==="S"?j.spawns.push({x:v,z:_,kind:"gate"}):m==="C"&&(j.solid[x*t.w+g]=1)}if(t.vehicles)for(let x of t.vehicles){(x.truck?Vv:Wv)(f,p,x.x,x.z,x.color,x.ry);let g=Math.abs(Math.sin(x.ry))>.5,m=x.truck?1.15:.95,v=x.truck?2.9:2.3;j.rects.push({x:x.x,z:x.z,hw:g?v:m,hd:g?m:v}),x.mine&&_n(16774096,6,10,x.x,3.2,x.z)}if(t.tables)for(let[x,g]of t.tables){d.cyl(.95,.08,x,.78,g,10134443,0,0,0,20),d.cyl(.12,.78,x,.39,g,7173243);for(let m=0;m<4;m++){let v=m*Math.PI/2+Math.PI/4;d.cyl(.24,.06,x+Math.cos(v)*1.25,.46,g+Math.sin(v)*1.25,10134443,0,0,0,12),d.cyl(.06,.46,x+Math.cos(v)*1.25,.23,g+Math.sin(v)*1.25,7173243)}j.rects.push({x,z:g,hw:.9,hd:.9})}if(t.cells)for(let x of t.cells){let g=new kn;for(let _=0;_<12;_++)g.cyl(.035,n,-He+.17+_*.33,n/2,0,6120555,0,0,0,6);g.box(He*2,.08,.08,0,n-.15,0,6120555).box(He*2,.08,.08,0,.9,0,6120555);let m=g.build(Kt.metal),v=(De(x.i)+De(x.i+1))/2;m.position.set(v,0,Ue(x.door)),j.group.add(m),f.box(1,.45,1.9,De(x.i)-.5,.22,Ue(x.top?2:t.h-3),8023901),d.cyl(.25,.45,De(x.i+1)+.4,.22,Ue(x.top?1:t.h-2)+(x.top?.2:-.2),12107976,0,0,0,10),x.locked||j.doors.push({mesh:m,x0:v,cell:x,open:0,opening:!1,spawn:{x:De(x.i+1),z:Ue(x.j),kind:"cell"}})}if(t.water)for(let[x,g,m,v]of t.water){let _=new he(new Pt(m,v),new Le({color:4875888,roughness:.03,metalness:.85,transparent:!0,opacity:.5,envMapIntensity:2.2}));_.rotation.x=-Math.PI/2,_.position.set(x,.03,g),_.receiveShadow=!0,j.group.add(_)}if(h.R.flashOn=t.mode==="night",h.FX.mistIM&&(h.FX.mistIM.material.opacity=t.mode==="night"?.075:.032),t.mode==="yard")h.R.hemi.color.set(13624063),h.R.hemi.groundColor.set(6969924),h.R.hemi.intensity=1.35,h.R.sun.color.set(16773592),h.R.sun.intensity=3.6,h.R.scene.background=new ye(8038104),h.R.scene.fog=new Vi(10271712,70,160),[[24,8],[44,8]].forEach(([x,g])=>{d.cyl(.14,8,De(x),4,Ue(g),6054248),p.box(1.6,.25,.6,De(x),8,Ue(g),16773312)}),d.box(3,7,3,De(2.5),3.5,Ue(s-3.5),7040885).box(4,.3,4,De(2.5),7.2,Ue(s-3.5),3882306),p.box(3.2,.9,3.2,De(2.5),6.4,Ue(s-3.5),10473727);else if(t.mode==="night"){h.R.hemi.color.set(5925530),h.R.hemi.groundColor.set(789524),h.R.hemi.intensity=.16,h.R.sun.color.set(9086207),h.R.sun.intensity=.3,j.halo=_n(11058431,9,11,0,2.8,0,"halo"),j.muzzle=_n(16767392,0,12,0,-50,0,"muzzle"),h.R.scene.background=new ye(131846),h.R.scene.fog=new Vi(131846,16,42);let x=i==="night"?12.5:t.h/2;_n(2162528,2.2,9,De(2),2.6,Ue(x),"flicker"),_n(2162528,2.2,9,De(t.w-3),2.6,Ue(x),"flicker"),_n(16767136,3,7,De(Math.min(29,t.w-4)),2.2,Ue(2),"flicker"),[1,t.w-2].forEach(g=>{p.box(.6,.25,.08,De(g)+(g===1?.95:-.95),2.6,Ue(x),2162528),_n(16718362,0,16,De(g)+(g===1?2:-2),3,Ue(x),"alarm")}),i==="graveyard"&&_n(16722448,3,10,De(12),1.2,Ue(8),"alarm")}else t.mode==="row"?(h.R.hemi.color.set(12113128),h.R.hemi.groundColor.set(2765366),h.R.hemi.intensity=.75,h.R.sun.color.set(11850988),h.R.sun.intensity=1.5,h.R.scene.background=new ye(1845808),h.R.scene.fog=new Vi(3820628,22,70),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,De(g),n+.1,Ue(x)+(x===4?.8:-.8),13625087)}),[[8,9],[27,9],[8,15],[27,15],[18,12]].forEach(([x,g],m)=>_n(12573951,22,24,De(x),4,Ue(g),m===1?"flicker":"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,De(x),n+.3,Ue(12),16719904),_n(16718362,0,16,De(x)+(x===1?2:-2),3,Ue(12),"alarm")})):t.outdoor?(h.R.hemi.color.set(12374783),h.R.hemi.groundColor.set(5917242),h.R.hemi.intensity=1.25,h.R.sun.color.set(16762250),h.R.sun.intensity=3.4,h.R.scene.background=new ye(2831696),h.R.scene.fog=new Vi(2831696,60,140),[[8,13],[36,13],[8,20],[36,20]].forEach(([x,g])=>{let m=De(x),v=Ue(g);d.cyl(.12,6,m,3,v,6054248),p.box(1.2,.2,.5,m,6,v,16757594)}),_n(16752704,10,20,De(8),5.5,Ue(16.5),"sodium"),_n(16752704,10,20,De(36),5.5,Ue(16.5),"sodium")):(h.R.hemi.color.set(14542591),h.R.hemi.groundColor.set(2762274),h.R.hemi.intensity=.3,h.R.sun.color.set(13623551),h.R.sun.intensity=.8,h.R.scene.background=new ye(723983),h.R.scene.fog=new Vi(723983,200,400),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,De(g),n+.1,Ue(x)+(x===4?.8:-.8),15266047)}),[[9,9],[28,9],[9,17],[28,17]].forEach(([x,g])=>_n(14937343,12,22,De(x),4,Ue(g),"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,De(x),n+.3,Ue(12.5),16719904),_n(16718362,0,16,De(x)+(x===1?2:-2),3,Ue(12.5),"alarm")}));h.R.setEnv(r.hdri),h.R.scene.environmentIntensity=r.envI,h.R.setGrade(r.grade);for(let x of j.lights){if(x.kind!=="fluoro"&&x.kind!=="sodium"&&x.kind!=="flicker")continue;let g=x.L.position.y,m=new he(new it(.5,2.6,g,20,1,!0),Kt.shaft.clone());m.material.color.set(x.L.color).multiplyScalar(.6),m.position.set(x.L.position.x,g/2,x.L.position.z),j.group.add(m)}if(Qv(t),[c.build(Nh(r.wall,[1,1.2],r.wallTint||16777215)),u.build(Kt.matte),d.build(Kt.metal),f.build(Kt.paint),p.build(Kt.glow,!1)].forEach(x=>x&&j.group.add(x)),y.length){let x=new he(Vr(y),Kt.fence);x.castShadow=!0,j.group.add(x)}t.decor&&t.decor(j.group);for(let x of j.rects)for(let g=0;g<t.h;g++)for(let m=0;m<t.w;m++)Math.abs(De(m)-x.x)<x.hw+.2&&Math.abs(Ue(g)-x.z)<x.hd+.2&&(j.solid[g*t.w+m]=1);if(j.dist=new Int16Array(t.w*t.h),j.flowT=0,h.R.precompile(),t.scares==="random"){t.scares=[];for(let x=0;x<400&&t.scares.length<7;x++){let g=h.randi(2,t.w-3),m=h.randi(2,t.h-3),v=De(g),_=Ue(m);j.solid[m*t.w+g]||(v-t.start[0])**2+(_-t.start[1])**2<100||t.scares.some(b=>(b.x-v)**2+(b.z-_)**2<49)||t.scares.push({x:v,z:_,done:!1})}}return t};j.openDoor=function(i){if(i.opening)return;i.opening=!0;let e=i.cell.door,t=i.cell.i;j.solid[e*j.w+t+1]=0,h.audio.play("alarm",.6)};function Qv(i){let e=h.R.q.dust;if(j.dust=null,!e)return;let t=new Float32Array(e*3);for(let r=0;r<e;r++)t[r*3]=h.rand(-20,20),t[r*3+1]=h.rand(.2,4),t[r*3+2]=h.rand(-14,14);let n=new zt;n.setAttribute("position",new Ot(t,3));let s=new Za(n,new Pr({size:.07,color:i.outdoor?16767392:14214399,transparent:!0,opacity:.55,blending:xn,depthWrite:!1}));s.frustumCulled=!1,j.group.add(s),j.dust=s}var e_=new ye(16715792);j.update=function(i,e){if(j.alarmT>0){j.alarmT-=i,j.hemiBase||(j.hemiBase=h.R.hemi.color.clone());let t=.5+.5*Math.sin(e*9);h.R.hemi.color.copy(j.hemiBase).lerp(e_,t*.6)}else j.hemiBase&&(h.R.hemi.color.copy(j.hemiBase),j.hemiBase=null);if(j.dust){let t=j.dust.geometry.attributes.position,n=t.array,s=h.R.camTarget.x,r=h.R.camTarget.z;for(let a=0;a<n.length;a+=3)n[a]+=Math.sin(e*.3+a)*i*.25,n[a+1]+=Math.sin(e*.5+a*.7)*i*.08,n[a+2]+=i*.15,n[a]-s>20?n[a]-=40:n[a]-s<-20&&(n[a]+=40),n[a+2]-r>14?n[a+2]-=28:n[a+2]-r<-14&&(n[a+2]+=28);t.needsUpdate=!0}for(let t of j.doors)t.opening&&t.open<1&&(t.open=Math.min(1,t.open+i*1.4),t.mesh.position.x=t.x0-t.open*He);for(let t of j.lights)t.t+=i,t.kind==="fluoro"?t.L.intensity=t.base*(Math.random()<.01?.2:1):t.kind==="flicker"?t.L.intensity=t.base*(Math.sin(e*23)>.6||Math.random()<.08?.1:1):t.kind==="alarm"&&(t.L.intensity=Math.max(j.alarm||0,j.alarmT>0?3:0)*(.5+.5*Math.sin(e*8))*6)};j.tileSolid=(i,e)=>i<0||e<0||i>=j.w||e>=j.h||j.solid[e*j.w+i]===1;j.wallAt=(i,e)=>{let t=Math.floor(i/He),n=Math.floor(e/He);if(t<0||n<0||t>=j.w||n>=j.h)return!0;let s=j.def.g[n][t];return(s==="#"||s==="F"||s==="C")&&j.solid[n*j.w+t]===1};j.rectAt=(i,e)=>{for(let t of j.rects)if(Math.abs(i-t.x)<t.hw&&Math.abs(e-t.z)<t.hd)return!0;return!1};j.blocked=(i,e)=>j.wallAt(i,e)||j.rectAt(i,e);j.collide=function(i){let e=i.r,t=Math.floor((i.x-e)/He),n=Math.floor((i.x+e)/He),s=Math.floor((i.z-e)/He),r=Math.floor((i.z+e)/He);for(let a=s;a<=r;a++)for(let o=t;o<=n;o++)j.wallAt(o*He+1,a*He+1)&&yf(i,o*He+He/2,a*He+He/2,He/2,He/2);for(let a of j.rects)Math.abs(i.x-a.x)<a.hw+e&&Math.abs(i.z-a.z)<a.hd+e&&yf(i,a.x,a.z,a.hw,a.hd)};function yf(i,e,t,n,s){let r=h.clamp(i.x,e-n,e+n),a=h.clamp(i.z,t-s,t+s),o=i.x-r,l=i.z-a,c=o*o+l*l;if(c>=i.r*i.r)return;if(c<1e-6){let f=n-Math.abs(i.x-e),p=s-Math.abs(i.z-t);f<p?i.x+=Math.sign(i.x-e||1)*(f+i.r):i.z+=Math.sign(i.z-t||1)*(p+i.r);return}let u=Math.sqrt(c),d=i.r-u;i.x+=o/u*d,i.z+=l/u*d}j.los=function(i,e,t,n){let s=t-i,r=n-e,a=Math.ceil(Math.hypot(s,r)/.5);for(let o=1;o<a;o++)if(j.blocked(i+s*o/a,e+r*o/a))return!1;return!0};var Dh=new Int32Array(64*64);j.buildFlow=function(i){let e=j.w,t=j.h,n=j.dist;n.fill(-1);let s=0,r=0;for(let a of i){let o=h.clamp(Math.floor(a.x/He),0,e-1),l=h.clamp(Math.floor(a.z/He),0,t-1),c=l*e+o;n[c]!==0&&(n[c]=0,Dh[r++]=c)}for(;s<r;){let a=Dh[s++],o=a%e,l=a/e|0,c=n[a]+1;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++){if(!d&&!u)continue;let f=o+d,p=l+u;if(j.tileSolid(f,p)||d&&u&&(j.tileSolid(o+d,l)||j.tileSolid(o,l+u)))continue;let y=p*e+f;n[y]===-1&&(n[y]=c,Dh[r++]=y)}}};j.flowDir=function(i,e,t){let n=j.w,s=Math.floor(i/He),r=Math.floor(e/He);if(s<0||r<0||s>=n||r>=j.h)return!1;let a=j.dist[r*n+s];if(a<=0)return!1;let o=a,l=0,c=0;for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=s+f,y=r+d;if(j.tileSolid(p,y)||f&&d&&(j.tileSolid(s+f,r)||j.tileSolid(s,r+d)))continue;let x=j.dist[y*n+p];x>=0&&x<o&&(o=x,l=f,c=d)}if(o===a)return!1;t.x=De(s+l)-i,t.z=Ue(r+c)-e;let u=Math.hypot(t.x,t.z)||1;return t.x/=u,t.z/=u,!0};var ie={};h.FX=ie;var qi=new Be,Ro=new Yt,Co=new L,Io=new L,gs=new ye,kh=new $t,Po=class{constructor(e,t,n,s){this.max=t,this.n=0,this.p=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.size=new Float32Array(t),this.col=new Uint32Array(t),this.grav=new Float32Array(t),this.im=new an(s,n,t),this.im.instanceMatrix.setUsage(ps),this.im.setColorAt(0,gs.set(1,1,1)),this.im.frustumCulled=!1,this.im.count=0,e.add(this.im)}spawn(e,t,n,s,r,a,o,l,c,u=1){let d=this.n;return d>=this.max?d=Math.random()*this.max|0:this.n++,this.p[d*3]=e,this.p[d*3+1]=t,this.p[d*3+2]=n,this.vel[d*3]=s,this.vel[d*3+1]=r,this.vel[d*3+2]=a,this.life[d]=this.maxLife[d]=o,this.size[d]=l,this.col[d]=c,this.grav[d]=u,d}update(e,t){let n=0;for(;n<this.n;){if(this.life[n]-=e,this.life[n]<=0){this.kill(n);continue}let s=n*3;this.vel[s+1]-=18*this.grav[n]*e,this.p[s]+=this.vel[s]*e,this.p[s+1]+=this.vel[s+1]*e,this.p[s+2]+=this.vel[s+2]*e,this.p[s+1]<.02&&(t&&this.vel[s+1]<-2&&t(this.p[s],this.p[s+2],this.col[n],this.size[n]),this.p[s+1]=.02,this.vel[s+1]*=-.25,this.vel[s]*=.5,this.vel[s+2]*=.5);let r=this.life[n]/this.maxLife[n],a=this.size[n]*(.4+.6*r);qi.compose(Co.set(this.p[s],this.p[s+1],this.p[s+2]),Ro.identity(),Io.set(a,a,a)),this.im.setMatrixAt(n,qi),this.im.setColorAt(n,gs.setHex(this.col[n])),n++}this.im.count=this.n,this.im.instanceMatrix.needsUpdate=!0,this.im.instanceColor&&(this.im.instanceColor.needsUpdate=!0)}kill(e){let t=--this.n;if(e!==t){for(let n=0;n<3;n++)this.p[e*3+n]=this.p[t*3+n],this.vel[e*3+n]=this.vel[t*3+n];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.size[e]=this.size[t],this.col[e]=this.col[t],this.grav[e]=this.grav[t]}}clear(){this.n=0,this.im.count=0}};ie.init=function(i){let e=h.R.q;ie.solid=new Po(i,e.particles,new Le({roughness:.4}),new Se(1,1,1)),ie.glow=new Po(i,Math.floor(e.particles/2),new ft({toneMapped:!1}),new Se(1,1,1)),ie.cloudMax=160,ie.clouds=[],ie.cloudIM=new an(new Dr(1,1),new ft({color:16777215,transparent:!0,opacity:.22,depthWrite:!1}),ie.cloudMax),ie.cloudIM.frustumCulled=!1,ie.cloudIM.count=0,ie.cloudIM.setColorAt(0,gs.set(1,1,1)),i.add(ie.cloudIM),ie.mistMax=220,ie.mists=[],ie.mistIM=new an(new Dr(1,2),new ft({color:14676735,transparent:!0,opacity:.032,depthWrite:!1}),ie.mistMax),ie.mistIM.frustumCulled=!1,ie.mistIM.count=0,ie.mistIM.setColorAt(0,gs.set(1,1,1)),i.add(ie.mistIM),ie.decalMax=e.decals,ie.decalN=0,ie.decalHead=0,ie.decalIM=new an(new Pt(1,1).rotateX(-Math.PI/2),new Le({map:ff(),transparent:!0,depthWrite:!1,roughness:.15,metalness:.1,polygonOffset:!0,polygonOffsetFactor:-2}),ie.decalMax),ie.decalIM.frustumCulled=!1,ie.decalIM.count=0,ie.decalIM.receiveShadow=!0,ie.decalIM.setColorAt(0,gs.set(1,1,1)),i.add(ie.decalIM),ie.floatEl=document.getElementById("floaters"),ie.floaters=[]};ie.reset=function(){ie.solid.clear(),ie.glow.clear(),ie.clouds.length=0,ie.cloudIM.count=0,ie.mists.length=0,ie.mistIM.count=0,ie.decalN=0,ie.decalHead=0,ie.decalIM.count=0;for(let i of ie.floaters)i.el.remove();ie.floaters.length=0};ie.decal=function(i,e,t,n){let s=ie.decalHead;ie.decalHead=(ie.decalHead+1)%ie.decalMax,ie.decalN=Math.min(ie.decalN+1,ie.decalMax),qi.compose(Co.set(i,.012+s%50*4e-4,e),Ro.setFromEuler(kh.set(0,Math.random()*6.28,0)),Io.set(t,1,t*h.rand(.7,1.2))),ie.decalIM.setMatrixAt(s,qi),ie.decalIM.setColorAt(s,gs.setHex(n)),ie.decalIM.count=ie.decalN,ie.decalIM.instanceMatrix.needsUpdate=!0,ie.decalIM.instanceColor.needsUpdate=!0};var t_=(i,e,t,n)=>{h.settings.gore&&Math.random()<.35&&ie.decal(i,e,n*6+.2,t)};ie.blood=function(i,e,t,n,s,r=10){h.settings.gore||(r=Math.ceil(r/4));let a=h.settings.gore?9046538:14538440;for(let o=0;o<r;o++)ie.solid.spawn(i,e,t,n*h.rand(2,6)+h.rand(-2,2),h.rand(2,6),s*h.rand(2,6)+h.rand(-2,2),h.rand(.5,1.1),h.rand(.05,.12),a)};ie.teeth=function(i,e,t){if(h.settings.gore)for(let n=0;n<2;n++)ie.solid.spawn(i,e,t,h.rand(-3,3),h.rand(4,7),h.rand(-3,3),1.5,.05,16775400)};ie.sparks=function(i,e,t,n=8,s=16765562){for(let r=0;r<n;r++)ie.glow.spawn(i,e,t,h.rand(-6,6),h.rand(1,7),h.rand(-6,6),h.rand(.15,.4),h.rand(.04,.08),s,.6)};ie.spit=function(i,e,t,n,s){for(let r=0;r<6;r++)ie.solid.spawn(i,e,t,n*h.rand(5,9)+h.rand(-1,1),h.rand(1,3),s*h.rand(5,9)+h.rand(-1,1),.7,.05,14279861)};ie.splash=function(i,e,t,n=14){for(let s=0;s<n;s++)ie.solid.spawn(i,.3,e,h.rand(-4,4),h.rand(2,5),h.rand(-4,4),.6,h.rand(.05,.1),t);ie.decal(i,e,1.6,t)};ie.cloud=function(i,e,t,n,s,r=.5,a=16742960){ie.clouds.length>=ie.cloudMax&&ie.clouds.shift(),ie.clouds.push({x:i,y:e,z:t,vx:n,vz:s,s:r,t:0,max:h.rand(1,1.6),col:a})};ie.mist=function(i,e,t,n,s,r=.5){ie.mists.length>=ie.mistMax&&ie.mists.shift(),ie.mists.push({x:i,y:e,z:t,vx:n,vz:s,s:r*1.5,t:0,max:h.rand(1.6,2.4),seed:Math.random()*6.28,spin:h.rand(-2,2)})};ie.float=function(i,e,t,n,s="#fff",r=15,a=1.6){ie.floaters.length>=14&&ie.floaters.shift().el.remove();let o=document.createElement("div");o.className="floater",o.textContent=n,o.style.color=s,o.style.fontSize=Math.round(r*(innerHeight<560?.72:.85))+"px",ie.floatEl.appendChild(o),ie.floaters.push({el:o,x:i,y:e,z:t,t:a,max:a,w:o.offsetWidth})};ie.update=function(i){ie.solid.update(i,t_),ie.glow.update(i);let e=0;for(let t=ie.clouds.length-1;t>=0;t--){let n=ie.clouds[t];if(n.t+=i,n.t>=n.max){ie.clouds.splice(t,1);continue}n.x+=n.vx*i,n.z+=n.vz*i,n.vx*=.9,n.vz*=.9,n.y+=i*.3;let s=n.s*(1+n.t*2.2)*(1-Math.pow(n.t/n.max,3));qi.compose(Co.set(n.x,n.y,n.z),Ro.identity(),Io.set(s,s*.7,s)),ie.cloudIM.setColorAt(e,gs.setHex(n.col)),ie.cloudIM.setMatrixAt(e++,qi)}ie.cloudIM.count=e,ie.cloudIM.instanceMatrix.needsUpdate=!0,ie.cloudIM.instanceColor&&(ie.cloudIM.instanceColor.needsUpdate=!0),e=0;for(let t=ie.mists.length-1;t>=0;t--){let n=ie.mists[t];if(n.t+=i,n.t>=n.max){ie.mists.splice(t,1);continue}let s=Math.sin(n.t*5+n.seed)*2.2;n.x+=(n.vx-n.vz*s*.12)*i,n.z+=(n.vz+n.vx*s*.12)*i,n.vx*=.93,n.vz*=.93,n.y+=i*.25;let r=n.t/n.max,a=n.s*(1+r*2.6)*(1-r*r);kh.set(0,n.seed+n.t*n.spin,0),qi.compose(Co.set(n.x,n.y,n.z),Ro.setFromEuler(kh),Io.set(a*2.2,a*.3,a*.7)),ie.mistIM.setMatrixAt(e++,qi)}ie.mistIM.count=e,ie.mistIM.instanceMatrix.needsUpdate=!0;for(let t=ie.floaters.length-1;t>=0;t--){let n=ie.floaters[t];if(n.t-=i,n.y+=i*.9,n.t<=0){n.el.remove(),ie.floaters.splice(t,1);continue}let[s,r,a]=h.R.worldToScreen(n.x,n.y,n.z),o=n.w/2+8;s=o*2>innerWidth?innerWidth/2:Math.max(o,Math.min(innerWidth-o,s)),n.el.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%)`,n.el.style.opacity=a?Math.min(1,n.t/(n.max*.3)):0}};var wf=[["{bernardo}","Hey, you wanna see how big my truck is? No? Too bad, it is parked across three spots."],["{bernardo}","Six-inch lift, 37s, and a payment bigger than my mortgage. Worth it."],["{bernardo}","{hero}, you owe me twenty on Sunday's game. Do not die before you pay me."],["{bernardo}","That linebacker they drafted hits softer than this whole tier."],["{bernardo}","If I go down, somebody move my truck. It is in the fire lane. Again."],["{bernardo}","My shield has seen more action than my fantasy team."],["{dustin}","Fourth taco of the shift. Pray for whoever is downwind."],["{dustin}","My truck is lifted so high the inmates need a step stool to key it."],["{dustin}","Our offensive line blocks worse than this door, and this door is gone."],["{dustin}","I sprayed one dude so hard his grandkids are gonna cough."],["{dustin}","Three energy drinks in. I can hear colors. Let's GO."],["{dustin}","Somebody tell the guy in cell 9 his mama called. Collect. She wants her shoes back."],["{caleb}","What's up bro. Did you see the game last night? Ref was a bum."],["{caleb}","{hero}, if you die, I am taking your parking spot AND your taco."],["{caleb}","That dude's breath is a use of force all by itself."],["{caleb}","You call that a takedown, {hero}? My little cousin tackles better at flag football."],["{caleb}","I am six foot four of pure overtime, baby."],["{caleb}","Tell Sarge his mustache has been written up for loitering."],["{HERO}","I have been awake so long my energy drink needs an energy drink."],["{HERO}","Somebody tell the warden my truck payment is due Friday."],["{HERO}","I swear to God, if I miss kickoff for this."],["{HERO}","Three hundred inmates and not one of them can pick a winner on Sunday."],["{HERO}","I am one bad taco away from a chemical incident."],["SERGEANT","{hero}, that is the ugliest takedown I have ever signed off on."],["SERGEANT","Whoever parked the lifted truck in the fire lane: nice truck. Move it."],["SERGEANT","I played college ball, you know. Nobody asked. But I did."],["SERGEANT","Hydrate, people. And no, Monster does not count as water. It counts as courage."],["RADIO","Reminder: the betting pool on this riot is closed. {bernardo} took the over."],["RADIO","Taco truck is at the sally port. Officers only. Inmates, that means you, Delgado."],["RADIO","Score update for those of you not currently bleeding: we are losing by 14."],["RADIO","Lost and found: one dentures, one shank, one dignity. Please claim at Central."],["COMPLIANCE","Friendly reminder: PREA training is due by end of shift. Your shift does not end."],["COMPLIANCE","PREA Module 2 of 47 will now autoplay over your radio."],["COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one still standing."],["COMPLIANCE","Great news! The PREA auditor is on site today. Please stop bleeding on the paperwork."],["COMPLIANCE","PREA Zero Tolerance includes zero tolerance for late paperwork."]],Ef=["Sit DOWN, sweetheart.","That all you got?","File a grievance, tough guy.","Who wants some? Form a line!","I eat tacos tougher than you.","Next!","Back in your cell, princess.","You swing like a Cowboys fan.","Count that, chief.","That's a write-up.","Not on my overtime!","You want to see my truck? Too bad.","Lockdown, baby!","Tell it to the law library.","My ex hits harder.","Touchdown!","Flag on the play!","Stay down!","Chow's cancelled.","Somebody call medical. Not for me."],Sf=["Fuck you, CO!","Bitch-ass cop!","I got your plate number!","Your truck is compensating, bro!","You can't even read, boss!","I know where you park!","I'm gonna gas your ass!","Pig!","I'm telling my lawyer!","Your wife writes me letters!","Come in here, tough guy!","This my house!","You ain't shit without that spray!","Bring the Sarge, punk!","Chow was cold AGAIN!","Where my commissary at?!","I want a grievance form!","You smell like tacos and fear!","I'll beat your ass!","PREA! PREA! He looked at me!","Get off my tier!","Y'all can't count!","Lift your truck? Lift THIS!","Your mama on my visitor list!","Shoot me, I dare you!","I'm on psych meds, I don't give a fuck!","Your football team trash!","I'll spit on you!"],zh=["MY EYES!","Ahh shit!","Medical! MEDICAL!","I'm filing on you!","That's excessive!","I can't breathe... jk","My tooth!","Ow! My commissary!","Okay okay okay!","I'm calling my mama!","That's a lawsuit!","Not the face!"],Fh=["Hey cutie!","Officer, you work out?","Ooh, cuff me, daddy!","Is that a baton or are you happy to see me?","Hey big truck!","Girl, those boots? No.","You can pat ME down anytime.","Call me, officer!","I did my makeup for THIS?!","Watch the hair!","Honey, I'm the shot caller now.","You're cute when you're scared.","Don't make me take my earrings off!","This jumpsuit is a crime. So am I."],Tf={cup:["Taste this!","Fresh batch!","Gassed!"],tray:["Chow time!","Catch!"],shoe:["Shoe check!","Size 12, bitch!"]},Af={taco:["TACO POWER!","Carne asada mode!","Extra hot sauce!","Al pastor, baby!"],gold:["GOLDEN TACO!","Caleb hid this. Respect.","Big bro approved."],zyn:["ZYN! LIP ON FIRE!","Hot pouch! HOT POUCH!","Ooh that burns. Good.","Zyn in. Brain on.","Top lip is MELTING."],chew:["Dip check!","Fat lip. Full health.","Old school, baby.","Pinch between cheek and gum!"],drink:["ENERGY DRINK!","Zero sugar, all rage!","Heart rate: yes.","Monster mode!"]},Bh=["THE TV TOLD ME TO!","I'm the warden now!","AWOOOOOO!","Who took my left sock?!","I can see sounds!","Officer, are you real?","I'm naked and I'm FAST!","The pruno speaks to me!","BEEP BEEP, I'm a truck!","Count me! COUNT ME!","I live in the vents now.","My lawyer is a pigeon."],Hh=["You lost, homie?","Wrong tier, jefe.","This is OUR dayroom.","\xD3rale, here comes the cop.","Don't look at me, CO.","We run this block.","Tell your sergeant we said what's up.","Big truck, small heart, homie.","Ey, nice boots... NOT.","Call your backup, we'll wait.","Jump him!","Get the CO!"],Rf=["Hey CO... real quick... what does PREA stand for?","Wait wait wait. What's PREA mean though?","Is PREA like a Prius? For real, what is it?"],Cf=["Prison Rape Elimination Act. There are 47 modules. Want the binder?","It's federal law, buddy. Here's the hotline. It's also on every wall.","P-R-E-A. Zero tolerance. Now get on the ground."],If=["*confused silence*","...huh.","Forty-seven modules?!","Bro, that's a lot of paperwork.","I just wanted commissary."],Pf=["Your mama's commissary is overdrawn!","Nice tattoo. Did you do it with a staple?","You swing like your parole officer.","Your release date called. It laughed.","You got that face only a cellie could love.","Even your shank is disappointed in you."],Lf=["SHIELD UP!","Behind me, family!","This shield cost more than my truck. No it didn't. Nothing does.","Hey, you wanna see how big my truck is? After the riot."],Df=[{name:"The Charmer",suit:3107642,skin:15254176,hair:3810582,style:1,face:0,item:16053492,lines:["Officer, could you help me carry this box? My arm's in a cast.","I was my own lawyer, you know. Nailed it.","You seem trustworthy. That's my favorite thing about people.","Is that a lifted truck? I love a big vehicle."]},{name:"Pogo the Painter",suit:3107642,skin:15921906,hair:16726554,style:1,face:3,lines:["Commissary special: one clown painting, forty soups.","Smile, officer! Pogo's watching.","I paint what I see. I see YOU.","Want a portrait? It comes with a free balloon."]},{name:"Sam's Neighbor",suit:3107642,skin:14724229,hair:1709072,style:1,face:7,lines:["The dog says you're doing great, officer.","Harvey says hi. Harvey's the dog.","Don't look at me. Talk to the dog.","The dog wants a lawyer."]},{name:"The Night Prowler",suit:1780512,skin:13011550,hair:1118481,style:1,face:1,lines:["Turn. That light. OFF.","I hate fluorescents. I hate you more.","It's too bright in here, CO.","Hail the dark. Also, where's chow?"]},{name:"The Cipher",suit:3107642,skin:15845285,hair:7031338,style:2,face:4,lines:["I mailed the warden a puzzle. He hasn't solved it.","Check your kites, officer. Every 13th letter.","You'll never crack me. Nobody does.",'Crossword, officer? Seven letters: "overtime."']}],Yr={intro:"The Riverbank Ripper is OUT of his cell! All staff, watch the mist!",taunts:["Nobody checks the river, officer.","The mist is my friend.","Took them twenty years to catch me. You've got two minutes.","Gone fishing.","You can't cuff fog."],callouts:["Movement by the water!","He's behind you!","I lost him in the mist!","Cell 7! No, cell 9! I don't know!"],death:"Riverbank Ripper is DOWN. Somebody get the paperwork. All of it."},Nf=["PREA!!!","PREA! PREA! PREA!","PREAAAAAAA!","PREA! He looked at me with his EYES!","PREA! That pepperball was flirting with me!","I'm calling the PREA hotline!","PREA! He breathed in my direction!","PREA! He sprayed me without a consent form!","Somebody get me a PREA form!","I know my PREA rights! I read the poster!","PREA! His baton winked at me!",'PREA! He said "good morning" aggressively!',"PREA! He stood within six feet of my feelings!","PREA! PREA! Get my lawyer!","PREA! He touched my commissary!","PREA! That taco smelled at me!","PREA! He made eye contact through his sunglasses!","This is a PREA violation and a Tuesday!"],Uf=["That's not what PREA means.","Hotline's on the wall. Next to the hole you punched.","Write it up, buddy.","Spell PREA. I'll wait.","Form's in the box. Box is on fire.","Noted. Filed. Shredded.","Bro, you yelled PREA at a vending machine yesterday.","Tell it to the Auditor."],Of=["The Bar is loose. Somebody is naked again.","Bar units: one of them says he is the warden now. He is not the warden.","Heads up, the dings in the Bar are howling at the fluorescent lights again.","Bar units report an inmate wearing a mattress as armor. Respect, honestly.","Control to all staff: the Bar ding is painting the dayroom. With what? Do not ask.","Bar units: he says the TV told him to. The TV has been unplugged since 2009."],kf=["Twelve years of push-ups with my ARMS, CO.","I got four-wheel drive, you got flat feet.","Move. I got the right of way.","I'm faster sitting down than you are standing up.","This chair got more miles than your truck.","Handicap parking? I park wherever I want."],zf=["BEEP BEEP, BITCH!","Speed bump!","Wide load coming through!","RAMMING SPEED!","Ankles, CO! I want ANKLES!"],Ff=["One leg, still whooping you.","Medical gave me these. Bad idea.","You know how long this crutch is? Long enough.","I hop faster than you run, CO."],Bf=["CATCH!","Medical can bill me!","Here, you need this more than me!","I got another one in my cell!"],Hf=["No I wasn't in his cell by myself.","I don't love offenders.","I am NOT an inmate lover.","I do not like anal.","ASK BINGHAM. I am innocent.","My mom got my ass beat for acting exactly like this."],Gf=["He's not my boyfriend. He's my pen pal. With benefits. No benefits. Forget I said benefits.","Boyfriend? Please. He's my emotional support offender.","I'm not his girlfriend, I'm one of his girlfriends. WAIT.","Why does he have my name tattooed on his neck? Ask HIM.","I don't take it in the butt. Exit only. That's facility policy AND my policy.","Nothing's going in the back door. The back door is LOCKED. Sally port rules.","Why would I keister a phone? I keep it in my bra like a professional.","I've only been in four cells today. That's below the unit average.","I'm not a slut, I'm a rehabilitation specialist.","I'm not easy, I'm accessible. ADA compliant.","Those are NOT my panties on his bunk. Those are evidence panties.","Twelve years in. Zero write-ups. Forty-one 'friends'.","This belly? Commissary. I've been eating a LOT of honey buns.","The baby's father is... the State. Technically.","It's not his. It's not HIS either. Stop lining them up, Sarge.","I'm due in March. Same as his parole hearing. Coincidence."],Vf=["I was providing COUNSELING. Very close counseling.","I'm not compromised, I'm emotionally available.","He's not my boyfriend, he's my CASELOAD.","I don't love offenders. I just love... helping them. Personally. After hours."],Wf=["That's not his DNA, that's a treatment plan.","Ask Caughren. She'll tell you I'm innocent. ...Don't ask Caughren.","This belly is a stress belly. From all the paperwork. And the visits.","The baby's name? We were thinking 'Inmate.' It's gender neutral.","Rehabilitation starts at home. My home. On weekends.","I don't do it in the butt. I'm a licensed professional.","My office door was locked for CONFIDENTIALITY.","That was not a conjugal visit. It was a... wellness check.","I'm not his baby mama, I'm his case manager. Same thing in here."],Xf="My mom got MY ass beat for this too. It runs in the family.",qf=["Caughren AND Bingham pregnant at the same time? That's a pod party.","Heard both babies already got a release date.","The baby shower's in the dayroom. BYO commissary.","Bro the kids gonna be born with an inmate number.","Bingham's baby already got a gang tattoo, I swear.","Who's the daddy? Whole B-pod raising their hand.","Ayy she been in MY cell too!","Line forms on the left, homie!"],Gh=["Bro... not again.","Somebody check. I'm not checking.","Is it the pregnant one or the OTHER pregnant one?","Copy. Bringing a pregnancy test and a write-up.","Control, do we have a form for this? We need a form for this."],Vh=["BABY TELL 'EM ABOUT US!","THAT'S MY WIFE!","That's MY baby, CO!","Wifey, you said it was SPECIAL!","Girl you smell like commissary.","We're in LOVE, CO!"],ar="You wanna fuck on me?",Yf=["You wanna fuck on me? Then square up.","You built like a commissary receipt.","Your hands are slower than medical.","I've seen better fighting in the chow line.","You wanna fuck on me? Nah, you wanna fuck AROUND.","Who's next? Line up. I'll roast all of y'all.","Your mama called. She said keep me out of this.","Bro you swing like you got a write-up pending.","Sit down before I make you sit down. Twice.","Fourth taco of the shift, baby."],$f=["Counselor Alaniz on the floor. Case CLOSED.","Y'all called a counselor? Bad idea.","Ricardo Alaniz in the building. Somebody about to get counseled.","Legend of the community, reporting for duty. Ask about me."],Zf=["Did you see that Combo Rombo?","Did you SEE that Combo Rombo?!","That's a COMBO, ROMBO!","I don't do treatment plans. I do treatment PAIN.","Your release date just got pushed back, homie.","I counsel with my hands.","Group therapy is in session. You're the group.","Y'all thought counselors just did paperwork?","Legend of the community. Ask about me.","I cleaned house AND did your annual review.","Combo Rombo, baby! Write THAT in your file!","That's a program violation. And a beatdown."],Kf=["House is clean. I got a caseload to get back to.","Alaniz out. Did y'all see that Combo Rombo though?","Session over. Y'all are rehabilitated."],Jf=["{name}? In MY building? Pack your desk.","{name}, I KNEW it. Badge. Keys. Now.","Nah. Not on my watch, {name}. Not in my house."];var lt={list:[],proj:[]};h.AI=lt;var Do={rat:{hp:55,speed:4.3,dmg:8,scale:[.9,1.1],suit:[16742938,16747050,15887122],score:10},gasser:{hp:45,speed:3.9,dmg:6,scale:[.85,1],suit:[15765562],item:16053492,ranged:!0,score:15},shank:{hp:50,speed:5.3,dmg:15,scale:[.9,1.05],suit:[13119514],item:12634320,lunge:!0,score:20},big:{hp:240,speed:3.1,dmg:22,scale:[1.35,1.5],suit:[16742938],knock:10,score:40},diva:{hp:75,speed:4.9,dmg:10,scale:[.95,1.05],suit:[16747114,16751226],item:16732088,hair:[16732088,16244810,10181887,16722474],diva:!0,score:25},ding:{hp:60,speed:6,dmg:9,scale:[.9,1.05],suit:[16742938],shirtless:!0,face:7,style:0,ding:!0,score:15},cholo:{hp:85,speed:4.7,dmg:13,scale:[1,1.15],suit:[15759914,15232800],style:3,hats:[1315868,2763306,15263976],face:3,item:12634320,score:25},prea:{hp:50,speed:3.6,dmg:6,scale:[.95,1],suit:[16747050],style:1,face:0,prea:!0,score:30},wheel:{hp:140,speed:6.4,dmg:16,scale:[1,1.1],suit:[16742938,15887122],wheel:!0,turn:1.8,knock:11,score:30},crutch:{hp:90,speed:3.8,dmg:14,scale:[.95,1.1],suit:[16747050,15765562],crutch:!0,reach:.9,knock:6,score:25},killer:{hp:9999,speed:0,dmg:0,scale:[1,1.05],suit:[3107642],score:0},ripper:{hp:3200,speed:5.4,dmg:20,scale:[1.3,1.3],suit:[3107642],knockMul:.08,score:1e3,boss:!0}};h.TYPES=Do;for(let i in Do){let e=Do[i];i!=="killer"&&(e.hp=Math.round(e.hp*(e.boss?1.2:1.6)))}h.MAX_SWINGERS=4;var jf=[],Wh={x:0,z:0},No=0;lt.reset=function(){lt.list.length=0,lt.proj.length=0,lt.projIM.count=0};lt.init=function(i){lt.projIM=new an(new Se(1,1,1),new Le({roughness:.6}),200),lt.projIM.frustumCulled=!1,lt.projIM.count=0,lt.projIM.castShadow=!0,lt.projIM.setColorAt(0,new ye(1,1,1)),i.add(lt.projIM)};lt.spawn=function(i,e,t){let n=Do[i],s=n.scale[0]+Math.random()*(n.scale[1]-n.scale[0]),r={type:i,def:n,x:e+h.rand(-.4,.4),z:t+h.rand(-.4,.4),vx:0,vz:0,r:.38*s,scale:s,yaw:Math.random()*h.TAU,hp:n.hp*(h.S.hpMul||1),maxHp:n.hp*(h.S.hpMul||1),speed:n.speed*h.rand(.9,1.1),suit:h.pick(n.suit),skin:h.pick(h.SKIN),hair:n.hair?h.pick(n.hair):h.pick(h.HAIR),hairOn:n.diva||Math.random()<.55,itemCol:n.item||0,phase:Math.random()*6,move:0,swing:0,swingCD:h.rand(.3,1),flash:0,ocT:0,fall:0,dead:!1,deadT:0,thinkT:Math.random()*.3,seen:!1,throwT:h.rand(3,8),spitT:h.rand(2,6),lungeT:0,combo:0,hop:0,vy:0,spin:0,flail:0,windup:0,style:n.style??h.pick([0,0,1,1,1,2,3,3]),hat:h.pick(n.hats||[2039583,9051164,1850506,7171437,15263976]),face:n.face??h.randi(0,6),shirtless:!!n.shirtless,wide:n.wide||1};return n.diva&&(r.style=4),n.boss&&(r.boss=!0,r.noRender=!0),lt.list.push(r),r};lt.liveCount=()=>{let i=0;for(let e of lt.list)!e.dead&&!e.caged&&i++;return i};var n_=0;lt.spawnCrew=function(i,e,t=4){let n=++n_;for(let s=0;s<t;s++){let r=lt.spawn("cholo",i+Math.cos(s*1.6)*1.3,e+Math.sin(s*1.6)*1.3);r.posted=!0,r.crew=n,r.yaw=Math.atan2(i-r.x,e-r.z)}};function Yh(i){for(let e of lt.list)e.crew===i&&e.posted&&(e.posted=!1,e.flex=0)}lt.wakeCrew=Yh;function i_(i){let e=null,t=1e9;for(let n of h.targets){if(n.down)continue;let s=(n.x-i.x)**2+(n.z-i.z)**2;s<t&&(t=s,e=n)}return[e,Math.sqrt(t)]}function un(i,e,t="#ffb37a"){No<=0||h.FX.floaters.length>8||(No-=1,h.FX.float(i.x,2.3*i.scale,i.z,h.censor(h.pick(e)),t,14,1.8))}var qh=0;function Lo(i,e){if(!(qh>0||Math.random()>e||h.FX.floaters.length>10)&&(qh=h.rand(.7,1.6),h.S.prea=(h.S.prea||0)+1,h.FX.float(i.x,2.6*i.scale,i.z,h.pick(Nf),"#ffe24a",22,2.2),Math.random()<.3)){let t=h.officers.find(n=>!n.down&&(n.x-i.x)**2+(n.z-i.z)**2<200);t&&setTimeout(()=>h.FX.float(t.x,2.6,t.z,h.pick(Uf),"#9fd0ff",16,2),700)}}function Xh(i,e,t,n){let s=t-i.x,r=n-i.z,a=Math.hypot(s,r)||1,o=a/13;lt.proj.push({kind:e,x:i.x,y:1.5*i.scale,z:i.z,vx:s/o,vz:r/o,vy:9*o*.5+.2,spin:0,dmg:e==="cup"?6:e==="tray"?9:5,life:3}),i.windup=1,Math.random()<.45&&un(i,Tf[e])}lt.update=function(i){let e=h.W,t=lt.list;No=Math.min(2,No+i*.6),qh-=i,h.grid.clear();for(let n of t)!n.dead&&!n.caged&&h.grid.insert(n);for(let n of h.targets)n.slots=0;for(let n=t.length-1;n>=0;n--){let s=t[n];if(s.flash=Math.max(0,s.flash-i),s.flashedT>0&&(s.flashedT-=i),!s.dead&&s.hop>0&&!s.def.crutch&&(s.vy-=20*i,s.hop=Math.max(0,s.hop+s.vy*i),s.hop===0&&(s.vy=0,h.FX.blood(s.x,.2,s.z,0,0,2),h.audio.play("thud",.6))),s.windup=Math.max(0,s.windup-i*3),s.vx||s.vz){s.x+=s.vx*i,s.z+=s.vz*i;let _=Math.exp(-i*7);s.vx*=_,s.vz*=_,Math.abs(s.vx)+Math.abs(s.vz)<.05&&(s.vx=s.vz=0),e.collide(s)}if(s.dead){s.fall=Math.min(1,s.fall+i*3.5),s.move=0,s.swing=0,(s.vy||s.hop>0)&&(s.hop+=s.vy*i,s.vy-=20*i,s.yaw+=s.spin*i,s.tumble=(s.tumble||0)+s.spin*.4*i,s.hop<=0&&(s.hop=0,s.vy=0,s.spin=0,s.tumble=0,h.FX.blood(s.x,.2,s.z,0,0,4),h.audio.play("thud",.5))),s.deadT+=i,s.deadT>9&&t.splice(n,1);continue}let[r,a]=i_(s);if(s.caged){r&&(s.yaw+=h.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*3)),s.phase+=i,s.move=0,s.flex=Math.max(0,Math.sin(s.phase*.7))*.3;continue}if(s.boss){h.Boss&&h.Boss.think(s,i,r,a);continue}if(s.freezeT>0){s.freezeT-=i,s.move=h.lerp(s.move,0,i*8),s.flex=1;continue}if(s.posted){s.move=0,s.phase+=i*.5,s.flex=.5+Math.sin(s.phase*2)*.3,Math.random()<i*.06&&un(s,Hh,"#ffd27a"),r&&a<9&&(Yh(s.crew),un(s,["Get the CO!","Jump him!","\xD3rale, let's go!"],"#ffd27a"));continue}if(s.flex=Math.max(0,(s.flex||0)-i*2),s.def.prea&&!s.asked&&r&&a<8){if(s.asking||(s.asking=!0,s.askT=0,h.FX.float(s.x,2.6,s.z,h.pick(Rf),"#ffe27a",16,3.5)),s.askT+=i,s.move=h.lerp(s.move,0,i*8),r.yaw!==void 0&&(s.yaw+=h.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*6)),a<2.8&&(s.answerT=(s.answerT||0)+i),s.answerT>1){s.asked=!0,h.say(r.name||"OFFICER",h.pick(Cf),4);for(let _ of t)!_.dead&&!_.caged&&!_.boss&&(_.x-s.x)**2+(_.z-s.z)**2<140&&(_.freezeT=4,_.swing=0);h.FX.float(s.x,3,s.z,h.pick(If),"#ffe27a",18,3),r.score=(r.score||0)+100}else s.askT>7&&(s.asked=!0);continue}if(s.ocT=Math.max(0,s.ocT-i),s.swingCD-=i,s.throwT-=i,s.spitT-=i,s.lungeT=Math.max(0,s.lungeT-i),!r){s.move=h.lerp(s.move,0,i*5);continue}s.thinkT-=i,s.thinkT<=0&&(s.thinkT=h.rand(.2,.35),s.seen=a<16&&e.los(s.x,s.z,r.x,r.z));let o=0,l=0,c=s.speed,u=r.x-s.x,d=r.z-s.z,f=1/(a||1);if(s.ocT>0)s.flail=1,o=Math.sin(s.phase*.7+n),l=Math.cos(s.phase*.5+n),c*=.35,Math.random()<i*.6&&un(s,["*cough cough*","MY EYES!","I can't see!","Water! WATER!"],"#ff9a6a");else{s.flail=Math.max(0,s.flail-i*2),s.seen||a<2.5?(o=u*f,l=d*f):e.flowDir(s.x,s.z,Wh)?(o=Wh.x,l=Wh.z):(o=u*f,l=d*f);let _=s.def;_.ranged&&s.seen?(a<6?(o=-o,l=-l):a<10&&(o*=.15,l*=.15),s.throwT<=0&&a<13&&(s.throwT=h.rand(1.8,2.8),Xh(s,"cup",r.x,r.z))):s.seen&&s.throwT<=0&&a>5&&a<12&&(s.throwT=h.rand(6,11),Xh(s,Math.random()<.5?"tray":"shoe",r.x,r.z)),_.lunge&&s.seen&&a>2&&a<4.5&&s.lungeT<=0&&s.swingCD<=0&&(s.lungeT=2.5,s.vx+=u*f*13,s.vz+=d*f*13,s.swingCD=0,Math.random()<.5&&un(s,["Shank time!","Poke poke, bitch!","Hold still, CO!"])),a<3.2&&s.spitT<=0&&Math.random()<.5&&(s.spitT=h.rand(5,9),h.FX.spit(s.x,1.5*s.scale,s.z,u*f,d*f),r.hurt(2,s.x,s.z,"spit"),un(s,["*hocks loogie*","PTOO!","Got you, CO!"],"#d9e4b5")),_.ding&&(s.dingT=(s.dingT||0)-i,s.dingT<=0&&(s.dingT=h.rand(1.5,4),s.dingDir=Math.random()<.45?Math.random()*h.TAU:null,Math.random()<.4&&un(s,Bh,"#c6ff7a")),s.dingDir!=null&&a>2.5&&(o=Math.sin(s.dingDir),l=Math.cos(s.dingDir),c*=1.3,s.flail=1)),_.crutch&&!s.noCrutch&&s.seen&&a>5&&a<11&&Math.random()<i*.4&&(s.noCrutch=!0,Xh(s,"shoe",r.x,r.z),un(s,Bf,"#ffb37a")),_.crutch&&(s.noCrutch?(c*=.75,s.hop=Math.abs(Math.sin(s.phase*.6))*.14):Math.random()<i*.04&&un(s,Ff,"#ffb37a")),_.wheel&&(s.ramT=(s.ramT||0)-i,a<s.r+r.r+.5&&s.ramT<=0&&s.move>.6?(s.ramT=2.2,r.hurt(_.dmg*(h.S.dmgMul||1),s.x,s.z,"ram",_.knock),s.vx-=u*f*7,s.vz-=d*f*7,h.audio.play("thud",.8),un(s,zf,"#ffd27a")):Math.random()<i*.04&&un(s,kf,"#ffb37a")),Math.random()<i*.012&&Lo(s,1),Math.random()<i*.05&&un(s,_.diva?Fh:_.ding?Bh:s.type==="cholo"?Hh:Sf,_.diva?"#ff8fd0":_.ding?"#c6ff7a":"#ffb37a")}let p=s.r+r.r+(.6+(s.def.crutch&&!s.noCrutch?s.def.reach:0))*s.scale;if(a<p+1.6&&s.ocT<=0){if(r.slots<h.MAX_SWINGERS)r.slots++;else if(s.swing<=0){let _=n&1?1:-1,b=a<2.6?-.6:.3;o=-d*f*_+u*f*b,l=u*f*_+d*f*b,c*=.55,s.swingCD=Math.max(s.swingCD,.3)}}if(s.swing>0){let _=s.swing;s.swing+=i*(s.def.diva?4.2:2.9),_<.5&&s.swing>=.5&&a<p+.4&&s.ocT<=0&&(r.hurt(s.def.dmg*(h.S.dmgMul||1),s.x,s.z,s.type,s.def.knock||3),s.def.diva&&Math.random()<.4&&un(s,Fh,"#ff8fd0")),s.swing>=1&&(s.swing=0,s.def.diva&&s.combo<1?(s.combo++,s.swing=.01):(s.combo=0,s.swingCD=h.rand(.7,1.1))),c*=.4}else a<p&&s.swingCD<=0&&s.ocT<=0&&!s.def.wheel&&(s.swing=.01);a<p*.85&&(o*=.1,l*=.1),h.grid.query(s.x,s.z,1.2,jf);let y=0,x=0;for(let _ of jf){if(_===s)continue;let b=s.x-_.x,D=s.z-_.z,T=b*b+D*D,C=s.r+_.r;if(T<C*C&&T>1e-5){let A=Math.sqrt(T),w=(C-A)/A;y+=b*w,x+=D*w}}let g=Math.min(1,i*(s.def.turn||6));s.hx=h.lerp(s.hx??o,o,g),s.hz=h.lerp(s.hz??l,l,g),s.x+=s.hx*c*i+y*.5,s.z+=s.hz*c*i+x*.5,e.collide(s);let m=Math.min(1,Math.hypot(s.hx,s.hz));s.move=h.lerp(s.move,m,i*8),s.phase+=i*10*s.move*(c/4.3);let v=s.ocT>0||s.def.wheel?Math.atan2(s.hx,s.hz):Math.atan2(u,d);s.yaw+=h.angDiff(s.yaw,v)*Math.min(1,i*10)}h_(i)};var Qf=new Be,s_=new Yt,r_=new $t,a_=new L,o_=new L,l_=new ye,c_={cup:[.16,.22,.16,15921906],tray:[.5,.05,.36,10134443],shoe:[.14,.12,.3,1776411]};function h_(i){let e=lt.proj,t=0;for(let n=e.length-1;n>=0;n--){let s=e[n];s.vy-=18*i*.5,s.x+=s.vx*i,s.y+=s.vy*i,s.z+=s.vz*i,s.spin+=i*12,s.life-=i;let r=!1;for(let o of h.targets)if(!o.down&&(o.x-s.x)**2+(o.z-s.z)**2<.6&&s.y<2){o.hurt(s.dmg,s.x-s.vx,s.z-s.vz,s.kind,2),s.kind==="cup"?(h.FX.splash(o.x,o.z,7035434,18),h.FX.float(o.x,2.4,o.z,"GASSED!","#c9b45a",18,1.4),o.slowT=2):h.FX.sparks(s.x,s.y,s.z,6,16777215),h.audio.play(s.kind==="cup"?"splat":"thud",.7),r=!0;break}if(!r&&(s.y<=.05||s.life<=0||h.W.blocked(s.x,s.z))&&(s.kind==="cup"&&h.FX.splash(s.x,s.z,7035434,10),r=!0),r){e.splice(n,1);continue}let a=c_[s.kind];Qf.compose(a_.set(s.x,s.y,s.z),s_.setFromEuler(r_.set(s.spin,s.spin*.6,0)),o_.set(a[0],a[1],a[2])),lt.projIM.setMatrixAt(t,Qf),lt.projIM.setColorAt(t,l_.setHex(a[3])),t++}lt.projIM.count=t,lt.projIM.instanceMatrix.needsUpdate=!0,lt.projIM.instanceColor&&(lt.projIM.instanceColor.needsUpdate=!0)}lt.damage=function(i,e,t,n,s=4,r="hit",a=null){if(i.dead)return!1;i.hp-=e,i.flash=.25;let o=i.x-t,l=i.z-n,c=Math.hypot(o,l)||1,u=s/Math.sqrt(i.scale)*(i.def.knockMul??1);if(i.posted&&Yh(i.crew),i.freezeT>0&&(i.freezeT=0),i.boss&&h.Boss&&h.Boss.onHit(i,e),i.vx+=o/c*u,i.vz+=l/c*u,r!=="oc"&&h.FX.blood(i.x,1.2*i.scale,i.z,o/c,l/c,i.hp<=0?16:5),i.hp<=0){i.dead=!0,i.swing=0,i.vx*=1.8,i.vz*=1.8,s>=8&&!i.boss&&(i.vy=h.rand(3.5,6.5)/Math.sqrt(i.scale),i.spin=h.rand(-9,9)),i.boss?h.Boss&&h.Boss.onDeath(i):h.Loot&&h.Loot.maybeDrop(i.x,i.z,i.type==="big"||i.type==="cholo"?.03:.012),i.yaw=Math.atan2(-o,-l),Math.random()<.3&&h.FX.teeth(i.x,1.5,i.z),Math.random()<.5?Lo(i,.6):Math.random()<.35&&un(i,zh,"#ffd0a0"),h.S.kills++,h.onKill&&h.onKill(),a&&(a.kills++,a.score+=i.def.score,a.ot!==void 0&&!(a.otT>0)&&(a.ot=Math.min(100,a.ot+3.5))),h.dropLoot&&h.dropLoot(i.x,i.z),i.bf&&(a&&(a.score+=250),h.FX.float(i.x,3,i.z,"LOVE IS DEAD +250","#ff5ab0",24,2));let d=0;for(let f of lt.list)f.dead&&d++;if(d>80){let f=lt.list.findIndex(p=>p.dead);f>=0&&lt.list.splice(f,1)}return!0}return r==="oc"?Lo(i,.02):Math.random()<.12&&Lo(i,.6),r!=="oc"&&Math.random()<.08&&un(i,i.def.diva?["Not the FACE!","You chipped my nail!","Rude!"]:zh,"#ffd0a0"),!1};var Zr=new L;function zn(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Zr.copy(e),Zr[n]=0,Zr.normalize();let c=.5*a/(a+o),u=1-Zr.angleTo(i)/l;return Math.sign(Zr[t])===1?u*c:o/(a+o)+c+c*(1-u)}var bn=class extends Se{constructor(e=1,t=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let o=new L,l=new L,c=new L(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,y=new L,x=.5/s;for(let g=0,m=0;g<u.length;g+=3,m+=2)switch(o.fromArray(u,g),l.copy(o),l.x-=Math.sign(l.x)*x,l.y-=Math.sign(l.y)*x,l.z-=Math.sign(l.z)*x,l.normalize(),u[g+0]=c.x*Math.sign(o.x)+l.x*r,u[g+1]=c.y*Math.sign(o.y)+l.y*r,u[g+2]=c.z*Math.sign(o.z)+l.z*r,d[g+0]=l.x,d[g+1]=l.y,d[g+2]=l.z,Math.floor(g/p)){case 0:y.set(1,0,0),f[m+0]=zn(y,l,"z","y",r,n),f[m+1]=1-zn(y,l,"y","z",r,t);break;case 1:y.set(-1,0,0),f[m+0]=1-zn(y,l,"z","y",r,n),f[m+1]=1-zn(y,l,"y","z",r,t);break;case 2:y.set(0,1,0),f[m+0]=1-zn(y,l,"x","z",r,e),f[m+1]=zn(y,l,"z","x",r,n);break;case 3:y.set(0,-1,0),f[m+0]=1-zn(y,l,"x","z",r,e),f[m+1]=1-zn(y,l,"z","x",r,n);break;case 4:y.set(0,0,1),f[m+0]=1-zn(y,l,"x","y",r,e),f[m+1]=1-zn(y,l,"y","x",r,t);break;case 5:y.set(0,0,-1),f[m+0]=zn(y,l,"x","y",r,e),f[m+1]=1-zn(y,l,"y","x",r,t);break}}};var ep=[15845285,14724229,13011550,11037509,9065782,7028519,5188892],tp=[1709072,2825492,4861984,1118481,7031338,9079434];h.SKIN=ep;h.HAIR=tp;function Zh(i,e){let t=i.attributes.position,n=t.count,s=new Float32Array(n*3);i.computeBoundingBox();let{min:r,max:a}=i.boundingBox;for(let o=0;o<n;o++){let l=(t.getY(o)-r.y)/(a.y-r.y||1),[c,u,d]=e(l,t.getX(o),t.getZ(o));s[o*3]=c,s[o*3+1]=u,s[o*3+2]=d}return i.setAttribute("color",new Ot(s,3)),i}var Kr=i=>Ch(Vr(i.map(e=>e.index?e.toNonIndexed():e))),Jr=(i,e=1)=>Zh(i,()=>[e,e,e]),xs=(i,e=.82)=>Zh(i,t=>{let n=e+t*(1-e);return[n,n,n]}),$h=(i,e,t=10)=>new In(i,e-i*2,t>8?4:2,t).translate(0,-e/2,0),u_=(i,e,t)=>{let n=i.attributes.uv;for(let s=0;s<n.count;s++)n.setXY(s,e,t);return i},np=[4033535,16731469,4054148,16763197];h.PCOLORS=np;function ko(i={}){let e=i.gender==="female",t=i.gender==="they",n=i.rank==="sgt",s=i.uniform??2376318,r=1518162,a=i.skin??h.pick(ep),o=i.hair??h.pick(tp),l=(X,z=.7,K=0)=>new Le({color:X,roughness:z,metalness:K}),c={uni:l(s,.75),dark:l(r),skin:l(a,.55),hair:l(o,.7),black:l(1118481,.35,.2),gold:new Le({color:16765773,emissive:5913600,roughness:.25,metalness:1}),steel:l(13225684,.25,1),vest:l(1777449,.8),red:l(13116444,.4),boots:l(1118481,.35,.2),pants:l(s,.75),print:new Le({map:uf(i.back||"CORRECTIONS"),roughness:.8})};for(let X of["uni","dark","skin","hair","vest","pants","boots"])Kh(c[X]);let u=(X,z,K=0,W=0,te=0)=>{let re=new he(X,z);return re.position.set(K,W,te),re.castShadow=!0,re.receiveShadow=!0,re},d=e?.9:t?.95:1,f=new ut,p=new ut;f.add(p),p.add(u(new bn(.52*d,.64,.3,2,.08),c.uni,0,1.08,0)),p.add(u(new bn(.57*d,.46,.35,2,.06),c.vest,0,1.12,0));let y=u(new Pt(.5*d,.13),c.print,0,1.2,-.178);y.rotation.y=Math.PI,p.add(y),p.add(u(new bn(.52*(e?1.04:1),.11,.33,2,.03),c.black,0,.8,0)),p.add(u(new Se(.09,.07,.02),c.gold,0,.8,.17)),p.add(u(new it(.045,.045,.012,6),c.gold,-.14*d,1.27,.18).rotateX(Math.PI/2)),p.add(u(new Se(.08,.15,.07),c.black,.27,.8,.05)),p.add(u(new Se(.06,.08,.04),c.black,.16*d,1.34,.17)),p.add(u(new it(.04,.04,.17,10),c.red,-.27,.8,.05)),p.add(u(new yn(.05,.012,6,12),c.steel,.2,.72,.12)),i.belly&&(p.add(u(new At(.24,22,16).scale(1,.95,1.15),c.uni,0,.96,.15)),p.add(u(new At(.02,8,6),c.uni,0,.97,.43))),i.lanyard&&(p.add(u(new yn(.15,.008,4,20,Math.PI).rotateZ(Math.PI),c.red,0,1.4,.18)),p.add(u(new Se(.08,.11,.01),c.steel,0,1.2,i.belly?.36:.19))),p.add(u(new it(.075,.08,.12,10),c.skin,0,1.43,0));let x=new ut;x.position.set(0,1.58,0),p.add(x),x.add(u(new At(.165,20,16),c.skin)),x.add(u(new bn(.24,.055,.04,1,.015),c.black,0,.02,.15)),e?(x.add(u(new At(.175,16,10,0,Math.PI*2,0,Math.PI/1.9),c.hair,0,.02,-.01)),x.add(u(new At(.085,12,8),c.hair,0,.04,-.19)),x.add(u(new In(.045,.2,4,8),c.hair,0,-.14,-.2))):(t&&(x.add(u(new At(.178,16,10,0,Math.PI*2,0,Math.PI/1.65),c.hair,0,0,-.01)),[-.15,.15].forEach(X=>x.add(u(new In(.04,.12,3,8),c.hair,X,-.08,-.02)))),x.add(u(new it(.175,.18,.1,18),c.dark,0,.12,0)),x.add(u(new bn(.26,.03,.17,1,.012),c.dark,0,.08,.16)));let g=(X,z,K,W)=>{let te=new ut;return te.add(u(new it(X,z,K,14,1).translate(0,-K/2,0),W)),te.add(u(new At(X,14,10),W)),te.add(u(new At(z,12,8),W,0,-K,0)),te},m=X=>{let z=new ut;z.position.set(X*.33*d,1.33,0),z.add(u(new At(.105*d+.01,16,12).scale(1,.85,1),c.uni,0,.01,0));let K=g(.088,.074,.29,c.uni);z.add(K);let W=new ut;W.position.y=-.29,K.add(W);let te=g(.068,.054,.26,c.skin);W.add(te);let re=new ut;return re.position.y=-.27,te.add(re),re.add(u(new bn(.09,.12,.06,2,.025),c.skin,0,-.05,.005)),re.add(u(new In(.022,.05,2,6),c.skin,X*-.045,-.03,.03).rotateZ(X*.6)),p.add(z),{shoulder:z,elbow:W,hand:re,upper:K}},v=m(-1),_=m(1),b=v.shoulder,D=_.shoulder;n&&[v.upper,_.upper].forEach(X=>[0,1,2].forEach(z=>{let K=u(new Se(.19,.02,.19),c.gold,0,-.08-z*.04,0);K.rotation.z=.25,X.add(K)}));let T=u(new it(.028,.034,.64,10),c.black,0,-.07,.25);T.rotation.x=Math.PI/2,_.hand.add(T);let C=new ut;C.visible=!1,C.rotation.x=Math.PI/2,C.position.set(0,-.06,.02),_.hand.add(C),C.add(u(new bn(.07,.11,.42,1,.02),c.black,0,-.05,.16)),C.add(u(new it(.018,.018,.3,8).rotateX(Math.PI/2),c.steel,0,-.03,.5)),C.add(u(new bn(.05,.14,.05,1,.015),c.black,0,-.14,.1));let A=X=>{let z=new ut;z.position.set(X*.13,.8,0);let K=g(.105,.088,.4,c.pants);z.add(K);let W=new ut;W.position.y=-.4,K.add(W);let te=g(.085,.072,.31,c.pants);return W.add(te),te.add(u(new bn(.19,.13,.31,2,.045),c.boots,0,-.35,.05)),p.add(z),{hip:z,knee:W}},w=A(-1),M=A(1),I=w.hip,k=M.hip,O=new he(new ei(.5,.62,32),new ft({color:i.ringColor??np[i.slot||0],transparent:!0,opacity:.85,toneMapped:!1}));O.rotation.x=-Math.PI/2,O.position.y=.03,f.add(O);let G=new he(sp,ip());return G.scale.set(1.25,1,1.25),G.position.y=.025,G.renderOrder=1,f.add(G),i.scale&&f.scale.setScalar(i.scale),{root:f,body:p,head:x,armL:b,armR:D,legL:I,legR:k,elbowL:v.elbow,elbowR:_.elbow,kneeL:w.knee,kneeR:M.knee,baton:T,gun:C,ring:O,M:c,phase:0,j:{}}}function ri(i,e,t,n,s,r){i.phase+=e*10*Math.max(t,1e-4),i.t=(i.t||0)+e;let a=i.j||(i.j={}),o=(f,p,y,x,g=14)=>{let m=a[f]??x,v=m+(x-m)*Math.min(1,e*g);a[f]=v,p.rotation[y]=v},l=i.phase,c=Math.sin(l)*t,u=Math.cos(l);o("hL",i.legL,"x",c*.65),o("hR",i.legR,"x",-c*.65),i.kneeL&&(o("kL",i.kneeL,"x",(.15+Math.max(0,-Math.sin(l-.6))*1)*t,18),o("kR",i.kneeR,"x",(.15+Math.max(0,Math.sin(l-.6))*1)*t,18));let d=Math.sin(i.t*2.2)*.03;if(n>0){let f=Math.sin(n*Math.PI);o("aR",i.armR,"x",-2.5+n*3.1,30),o("aRz",i.armR,"z",-.35,30),i.elbowR&&o("eR",i.elbowR,"x",-.9*(1-n)-.1*f,30)}else s?(o("aR",i.armR,"x",-1.45,18),o("aRz",i.armR,"z",-.12,18),i.elbowR&&o("eR",i.elbowR,"x",-.15,18)):(o("aR",i.armR,"x",-c*.55+.05+d,10),o("aRz",i.armR,"z",.1,10),i.elbowR&&o("eR",i.elbowR,"x",-.25-Math.max(0,-c)*.6-t*.15,10));i.holdL?(o("aL",i.armL,"x",-1.1,12),o("aLz",i.armL,"z",.25,12),i.elbowL&&o("eL",i.elbowL,"x",-1.2,12)):s&&n<=0?(o("aL",i.armL,"x",-1.3,18),o("aLz",i.armL,"z",.45,18),i.elbowL&&o("eL",i.elbowL,"x",-.55,18)):(o("aL",i.armL,"x",c*.55+.05+d,10),o("aLz",i.armL,"z",-.1,10),i.elbowL&&o("eL",i.elbowL,"x",-.25-Math.max(0,c)*.6-t*.15,10)),i.gun&&(i.gun.visible=!!s&&n<=0,i.baton.visible=!i.gun.visible),i.body.position.y=Math.abs(Math.sin(l))*.045*t+(r?.2*r:0),o("bx",i.body,"x",r?-Math.PI/2*r:t*.1+(s?.04:0),10),o("by",i.body,"y",u*.07*t,10),i.head&&o("hy",i.head,"y",-u*.05*t,10)}function d_(i){let e=i.attributes.uv,t=i.attributes.normal;for(let n=0;n<e.count;n++){let s=t.getZ(n),r=e.getX(n),a=e.getY(n);s<-.6?e.setXY(n,.27+r*.46,.1+a*.8):s>.6?e.setXY(n,.79+r*.18,.12+a*.8):e.setXY(n,.05,.5)}return i}function f_(){let i=Zh($h(.1,.8,7),x=>x<.14?[.12,.12,.12]:[.95,.95,.95]),e=xs(Kr([$h(.068,.54,6),new At(.072,6,4).translate(0,-.56,0)])),t=xs($h(.082,.24,6)),n=xs(d_(Ch(new bn(.5,.64,.3,1,.08))),.85),s=u_(new it(.075,.08,.14,6,1,!0).translate(0,-.17,0),.75/rr,.3),r=xs(Kr([new At(.165,12,9),s]),.9),a=Jr(new At(.175,10,5,0,Math.PI*2,0,Math.PI/2.2)),o=xs(new At(.18,10,5,0,Math.PI*2,0,Math.PI/2).scale(1,1.25,1),.7),l=Jr(Kr([new At(.178,10,5,0,Math.PI*2,0,Math.PI/2.1),new bn(.08,.06,.12,1,.02).translate(0,.02,-.19)])),c=Jr(new In(.05,.28,2,6).translate(0,-.18,-.17)),u=Jr(new Se(.045,.34,.06).translate(0,-.12,0)),d=x=>new yn(.3,.035,6,18).rotateY(Math.PI/2).translate(x,.3,-.05),f=xs(Kr([new Se(.48,.06,.46).translate(0,.46,0),new Se(.48,.46,.05).translate(0,.72,-.24),d(-.3),d(.3),new yn(.25,.015,4,14).rotateY(Math.PI/2).translate(-.34,.3,-.05),new yn(.25,.015,4,14).rotateY(Math.PI/2).translate(.34,.3,-.05),new it(.07,.07,.04,8).rotateZ(Math.PI/2).translate(-.2,.07,.3),new it(.07,.07,.04,8).rotateZ(Math.PI/2).translate(.2,.07,.3),new Se(.03,.42,.03).translate(-.2,.26,.26),new Se(.03,.42,.03).translate(.2,.26,.26),new Se(.4,.03,.12).translate(0,.1,.42)]),.6),p=xs(Kr([new Se(.04,1.15,.04).translate(0,-.2,0),new Se(.06,.05,.2).translate(0,.38,0),new Se(.05,.04,.12).translate(0,0,.04)]),.7),y=Jr(new it(.125,.135,.42,8).translate(0,-.55,0),1);return[{key:"torso",geo:n,piv:[0,1.08,0],col:"suit",map:"suit"},{key:"head",geo:r,piv:[0,1.57,0],col:"skin",map:"face"},{key:"hair",geo:a,piv:[0,1.59,0],col:"hair",show:x=>x.style===1||x.style===4},{key:"beanie",geo:o,piv:[0,1.6,0],col:"hat",show:x=>x.style===2},{key:"bandana",geo:l,piv:[0,1.59,0],col:"hat",show:x=>x.style===3},{key:"tail",geo:c,piv:[0,1.6,0],col:"hair",show:x=>x.style===4},{key:"armL",geo:e,piv:[-.33,1.34,0],col:"skin",joint:"armL"},{key:"armR",geo:e,piv:[.33,1.34,0],col:"skin",joint:"armR"},{key:"sleeveL",geo:t,piv:[-.33,1.36,0],col:"suit",joint:"armL",show:x=>!x.shirtless},{key:"sleeveR",geo:t,piv:[.33,1.36,0],col:"suit",joint:"armR",show:x=>!x.shirtless},{key:"legL",geo:i,piv:[-.12,.8,0],col:"suit",joint:"legL"},{key:"legR",geo:i,piv:[.12,.8,0],col:"suit",joint:"legR"},{key:"chair",geo:f,piv:[0,.32,0],fixed:4212302,show:x=>!!x.def.wheel,sit:!0},{key:"crutch",geo:p,piv:[.33,1.34,0],fixed:12041927,joint:"armR",hand:[0,-.58,.06],show:x=>!!x.def.crutch&&!x.noCrutch},{key:"cast",geo:y,piv:[-.12,.8,0],fixed:15987178,joint:"legL",show:x=>!!x.def.crutch},{key:"item",geo:u,piv:[.33,1.34,0],col:"item",joint:"armR",hand:[0,-.58,.06],show:x=>!!x.itemCol}]}var p_=`#include <emissivemap_fragment>
  { float fr = 1.0 - saturate(dot(normal, normalize(vViewPosition)));
    totalEmissiveRadiance += vec3(0.62, 0.72, 0.9) * pow(fr, 3.0) * 0.42; }`;function Kh(i){let e=i.onBeforeCompile;i.onBeforeCompile=(n,s)=>{e&&e.call(i,n,s),n.fragmentShader=n.fragmentShader.replace("#include <emissivemap_fragment>",p_)};let t=e?"rim+"+e.toString():"rim";return i.customProgramCacheKey=()=>t,i}h.rim=Kh;var Uo=null;function ip(){if(Uo)return Uo;let i=document.createElement("canvas");i.width=i.height=64;let e=i.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(0,0,0,0.85)"),t.addColorStop(.45,"rgba(0,0,0,0.5)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);let n=new Wi(i);return n.colorSpace=Ft,Uo=new ft({map:n,transparent:!0,depthWrite:!1,opacity:.55,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-2}),Uo}var sp=new Pt(1,1).rotateX(-Math.PI/2);function m_(i){let e=new Le({vertexColors:!0,roughness:.6,map:i});return e.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute float aFace;`).replace("#include <uv_vertex>",`#include <uv_vertex>
 vMapUv.x = (vMapUv.x + aFace) / ${rr}.0;`)},e}var Oo=class{constructor(e,t){this.max=t;let n=cf(),s=hf();this.parts=f_().map(a=>{let o;a.map==="face"?(a.geo.setAttribute("aFace",new hs(new Float32Array(t),1)),o=m_(n)):o=new Le({vertexColors:!0,roughness:a.col==="skin"?.55:.78,map:a.map==="suit"?s:null}),Kh(o);let l=new an(a.geo,o,t);return l.instanceMatrix.setUsage(ps),l.setColorAt(0,new ye(1,1,1)),l.instanceColor.setUsage(ps),l.castShadow=["torso","head","legL","legR"].includes(a.key),l.receiveShadow=!0,l.frustumCulled=!1,l.count=0,e.add(l),{...a,im:l,face:a.map==="face"?a.geo.attributes.aFace:null}}),this.base=new Be,this.joint=new Be,this.out=new Be,this.q=new Yt,this.e=new $t(0,0,0,"YXZ"),this.v=new L,this.s=new L,this.c=new ye,this.white=new ye(1,1,1),this.red=new ye(16726826),this.zero=new Be().makeScale(0,0,0);let r=(a,o)=>new ft({color:a,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1});this.barBg=new an(new Pt(1,.11),r(0,.6),t),this.barFill=new an(new Pt(1,.08).translate(.5,0,0),r(16777215,.95),t);for(let a of[this.barBg,this.barFill])a.frustumCulled=!1,a.count=0,a.renderOrder=5,a.instanceMatrix.setUsage(ps),e.add(a);this.barFill.setColorAt(0,this.c),this.tmp=new Be,this.tmp2=new Be,this.one=new L(1,1,1),this.barPos=new L,this.hpHi=new ye(5431386),this.hpLo=new ye(16724e3),this.blob=new an(sp,ip(),t),this.blob.frustumCulled=!1,this.blob.count=0,this.blob.renderOrder=1,this.blob.instanceMatrix.setUsage(ps),e.add(this.blob)}syncBars(e){let t=h.R&&h.R.camera;if(!t)return;let n=0;for(let s=0;s<e.length&&n<this.max;s++){let r=e[s];if(r.dead||r.caged||r.noRender||r.hp>=r.maxHp)continue;let a=Math.max(0,r.hp/r.maxHp);this.barPos.set(r.x,2.05*r.scale+(r.hop||0)-(r.def.wheel?.32:0),r.z),this.out.compose(this.barPos,t.quaternion,this.one),this.tmp.makeScale(.9*r.scale,1,1),this.barBg.setMatrixAt(n,this.tmp.premultiply(this.out)),this.tmp.makeTranslation(-.45*r.scale,0,.01),this.tmp.multiply(this.tmp2.makeScale(Math.max(.001,.9*r.scale*a),1,1)),this.barFill.setMatrixAt(n,this.tmp.premultiply(this.out)),this.c.copy(this.hpLo).lerp(this.hpHi,a),this.barFill.setColorAt(n,this.c),n++}this.barBg.count=this.barFill.count=n,this.barBg.instanceMatrix.needsUpdate=this.barFill.instanceMatrix.needsUpdate=!0,this.barFill.instanceColor&&(this.barFill.instanceColor.needsUpdate=!0)}sync(e){let t=Math.min(e.length,this.max),{base:n,joint:s,out:r,q:a,e:o,v:l,s:c,c:u}=this;for(let d=0;d<t;d++){let f=e[d];if(f.noRender){for(let g of this.parts)g.im.setMatrixAt(d,this.zero);this.blob.setMatrixAt(d,this.zero);continue}{let g=f.fall||0,m=f.scale*(f.wide||1)*1.15/(1+(f.hop||0)*.8);this.tmp.makeRotationY(f.yaw),this.tmp.scale(this.s.set(m,1,m*(1+g*1.6))),this.tmp.setPosition(f.x+Math.sin(f.yaw)*-g*.7*f.scale,.02,f.z+Math.cos(f.yaw)*-g*.7*f.scale),this.blob.setMatrixAt(d,this.tmp)}o.set(-(f.fall||0)*Math.PI/2+(f.tumble||0),f.yaw,0,"YXZ"),a.setFromEuler(o);let p=f.def.wheel&&!f.dead?.32:0;l.set(f.x,(f.fall||0)*.17*f.scale+(f.hop||0)-p*f.scale,f.z),c.set(f.scale*(f.wide||1),f.scale,f.scale*(f.wide||1)),n.compose(l,a,c);let y=Math.sin(f.phase)*.8*f.move,x=f.swing>0?Math.sin(f.swing*Math.PI):0;for(let g of this.parts){if(g.show&&!g.show(f)){g.im.setMatrixAt(d,this.zero);continue}let m=0,v=0;if(p&&(g.joint==="legL"||g.joint==="legR")?m=-1.35:g.joint==="legL"?m=f.def.crutch?-.5:y:g.joint==="legR"?m=-y:g.joint==="armL"?(m=-y*.9-(f.flail||0)*2.5,v=-(f.flex||0)*1.2):g.joint==="armR"&&(m=y*.9-x*2.6-(f.windup||0)*2.8,v=x*.5+(f.flex||0)*1.2),o.set(m,0,v,"XYZ"),a.setFromEuler(o),g.sit&&!p){g.im.setMatrixAt(d,this.zero);continue}s.compose(l.set(g.piv[0],g.piv[1],g.piv[2]),a,c.setScalar(1)),g.hand&&(r.makeTranslation(g.hand[0],g.hand[1],g.hand[2]),s.multiply(r)),r.multiplyMatrices(n,s),g.im.setMatrixAt(d,r);let _=g.fixed?g.fixed:g.col==="suit"?f.suit:g.col==="skin"?f.skin:g.col==="hair"?f.hair:g.col==="hat"?f.hat:f.itemCol;u.setHex(_),f.flash>0&&u.lerp(this.white,Math.min(1,f.flash*3)),f.ocT>0&&g.col==="skin"&&u.lerp(this.red,.45),g.im.setColorAt(d,u),g.face&&(g.face.array[d]=f.face)}}this.syncBars(e),this.blob.count=t,this.blob.instanceMatrix.needsUpdate=!0;for(let d of this.parts)d.im.count=t,d.im.instanceMatrix.needsUpdate=!0,d.im.instanceColor.needsUpdate=!0,d.face&&(d.face.needsUpdate=!0)}};var dn=[{key:"green",label:"Uncommon",color:4054106,css:"#3ddc5a",weight:55,mult:1},{key:"blue",label:"Rare",color:4033535,css:"#5aa0ff",weight:28,mult:1.6},{key:"purple",label:"Epic",color:10898943,css:"#b973ff",weight:13,mult:2.3},{key:"orange",label:"Legendary",color:16747034,css:"#ff9a3a",weight:4,mult:3.2}],ai={boots:{label:"Boots",stat:i=>({speed:.04*i}),text:i=>`+${Math.round(i.speed*100)}% speed`,names:[["Payless Patrol Shoes","Velcro Night-Shift Sneakers"],["Steel-Toe Snitch Kickers","Orthopedic Overtime Boots"],["Crocs (Sport Mode)","Tactical Jordans"],["Air Max Overtime","Six-Inch-Lift Boots"]],perk:{text:"Dashing is free",id:"freeDash"}},pants:{label:"Pants",stat:i=>({hp:Math.round(12*i)}),text:i=>`+${i.hp} max health`,names:[["Cargo Pants (17 Pockets)","Hand-Me-Down Slacks"],["Stretchy Taco Pants","Kevlar Khakis"],["Sweatpants of Command","Riot Joggers"],["The Pants of Seniority","Sergeant's Wedding Slacks"]],perk:{text:"Slowly heal over time",id:"regen"}},vest:{label:"Tactical Vest",stat:i=>({armor:.05*i}),text:i=>`-${Math.round(i.armor*100)}% damage taken`,names:[["Expired Stab Vest","Duct-Tape Armor"],["Gas-Proof Poncho","Hi-Vis Mesh of Authority"],["Tactical Fanny Pack Rig","PREA-Compliant Plate Carrier"],["DOC Family Heirloom Vest","Triple-Time Plate Carrier"]],perk:{text:"Anyone who hits you gets pepper-sprayed",id:"spiky"}}};function Fo(i=0){let e=0;for(let a=i;a<dn.length;a++)e+=dn[a].weight;let t=Math.random()*e,n=i;for(let a=i;a<dn.length;a++)if(t-=dn[a].weight,t<=0){n=a;break}let s=h.pick(Object.keys(ai)),r=ai[s];return{slot:s,rarity:n,name:h.pick(r.names[n]),stat:r.stat(dn[n].mult),perk:n===3?r.perk.id:null}}h.rollItem=Fo;var Jh=i=>ai[i.slot].text(i.stat)+(i.perk?` \xB7 ${ai[i.slot].perk.text}`:"");function rp(i){let e=i.gear;i.speedMul=1+(e.boots?e.boots.stat.speed:0),i.armor=e.vest?e.vest.stat.armor:0;let t=e.pants?e.pants.stat.hp:0,n=i.maxHp;i.maxHp=100+t,i.hp=Math.min(i.maxHp,i.hp+Math.max(0,i.maxHp-n)),i.perks=new Set(Object.values(e).filter(a=>a&&a.perk).map(a=>a.perk));let s=i.model.M,r=(a,o,l)=>{a.color.setHex(o?h.lerpHex(l,dn[o.rarity].color,.25):l),a.emissive.setHex(o?dn[o.rarity].color:0),a.emissiveIntensity=o?.25+o.rarity*.15:0};r(s.boots,e.boots,1118481),r(s.pants,e.pants,2376318),r(s.vest,e.vest,1777449)}h.lerpHex=(i,e,t)=>new ye(i).lerp(new ye(e),t).getHex();function ap(i){let e=h.store.get("mo_gear_"+i.name.toLowerCase(),{});i.gear={boots:e.boots||null,pants:e.pants||null,vest:e.vest||null},rp(i)}var g_=i=>h.store.set("mo_gear_"+i.name.toLowerCase(),i.gear),Si=[],zo={};function x_(i){let e=dn[i.rarity];zo[e.key]||(zo[e.key]=new ft({color:e.color,transparent:!0,opacity:.32,blending:xn,depthWrite:!1,toneMapped:!1,side:Bt}));let t=new ut,n=new he(new it(.22,.45,7,14,1,!0),zo[e.key]);n.position.y=3.5,t.add(n);let s=new he(new ei(.5,.75,28),zo[e.key]);s.rotation.x=-Math.PI/2,s.position.y=.04,t.add(s);let r=new Le({color:e.color,emissive:e.color,emissiveIntensity:.9,roughness:.3,metalness:.4}),a=new ut;if(i.slot==="boots")[-.12,.12].forEach(o=>{let l=new he(new Se(.18,.22,.36),r);l.position.set(o,0,.05),a.add(l)});else if(i.slot==="pants"){[-.1,.1].forEach(l=>{let c=new he(new In(.08,.45,2,8),r);c.position.set(l,-.1,0),a.add(c)});let o=new he(new Se(.38,.12,.18),r);o.position.y=.22,a.add(o)}else{let o=new he(new Se(.44,.5,.2),r);a.add(o)}return a.position.y=.9,t.add(a),t.userData.item=a,t}var Yn={drops:Si,reset(){for(let i of Si)h.R.scene.remove(i.mesh);Si.length=0},spawn(i,e,t){if(Si.length>=5)return;let n=x_(i);n.position.set(e,0,t),h.R.scene.add(n),Si.push({it:i,x:e,z:t,mesh:n,t:0});let s=dn[i.rarity];h.FX.float(e,2.6,t,`${s.label.toUpperCase()}: ${i.name}`,s.css,16,2.4),h.audio.play("pickup",.6)},maybeDrop(i,e,t=.012,n=0){Math.random()<t&&Yn.spawn(Fo(n),i,e)},update(i,e){for(let t=Si.length-1;t>=0;t--){let n=Si[t];n.t+=i,n.mesh.userData.item.rotation.y+=i*1.8,n.mesh.userData.item.position.y=.9+Math.sin(e*2.5+n.x)*.12;for(let s of h.officers)if(!(s.down||(s.x-n.x)**2+(s.z-n.z)**2>1.7)){Yn.pickUp(s,n.it),h.R.scene.remove(n.mesh),Si.splice(t,1);break}}},collectAll(){for(let i of Si.splice(0)){h.R.scene.remove(i.mesh);let e=h.officers.filter(t=>!t.down).sort((t,n)=>(t.x-i.x)**2+(t.z-i.z)**2-((n.x-i.x)**2+(n.z-i.z)**2))[0]||h.officers[0];e&&Yn.pickUp(e,i.it)}},pickUp(i,e){let t=i.gear[e.slot],n=dn[e.rarity];if(!t||e.rarity>t.rarity||e.rarity===t.rarity&&JSON.stringify(e.stat)>JSON.stringify(t.stat))i.gear[e.slot]=e,rp(i),g_(i),h.FX.float(i.x,2.8,i.z,`EQUIPPED: ${e.name}`,n.css,18,2.2),h.toast(`${i.name} equipped ${n.label} ${ai[e.slot].label}: ${e.name} (${Jh(e)})`),h.FX.sparks(i.x,1,i.z,24,n.color),h.audio.play("win",.5);else{let r=25*(e.rarity+1);i.score+=r,h.FX.float(i.x,2.6,i.z,`Sold to commissary +${r}`,"#cfcfcf",14,1.6),h.audio.play("pickup",.6)}}};h.Loot=Yn;var Qe={balls:[],pickups:[],hazards:[],nades:[]};h.C=Qe;h.officers=[];var Lt=[],$n={launcher:{label:"40mm Less-Lethal",rate:2.2,dmg:60,speed:30,knock:17,sting:.8,pellets:1,spread:.02,life:.9,color:10477823,size:.2,sound:"thoomp",kick:.2},pepperball:{label:"Pepperball",rate:8,dmg:21,speed:34,knock:3,sting:.35,pellets:1,spread:.04,life:.9,color:16751146,size:.11,sound:"pop"},shotgun:{label:"Shotgun",rate:1.7,dmg:17,speed:38,knock:9,sting:0,pellets:8,spread:.32,life:.32,color:16769162,size:.07,sound:"shotgun",kick:.35},ar:{label:"AR-15",rate:11,dmg:34,speed:55,knock:4,sting:0,pellets:1,spread:.035,life:.7,color:16773808,size:.07,sound:"rifle",kick:.08},minigun:{label:"MINIGUN",rate:26,dmg:32,speed:62,knock:5,sting:0,pellets:1,spread:.09,life:.6,color:16756800,size:.09,sound:"rifle",kick:.03,power:!0,line:"BRRRRRRT. Payroll can bill me."},drum:{label:"DRUM SHOTGUN",rate:5,dmg:22,speed:40,knock:12,sting:0,pellets:10,spread:.4,life:.36,color:16738874,size:.09,sound:"shotgun",kick:.15,power:!0,line:"Twenty rounds of NOPE."},cannon:{label:"40MM AUTO",rate:6,dmg:80,speed:34,knock:22,sting:1,pellets:1,spread:.05,life:.9,color:8382719,size:.24,sound:"thoomp",kick:.12,power:!0,line:"Full auto less-lethal. Very much lethal."}},y_=["minigun","drum","cannon"],Ho=[{name:"Standard",mul:1},{name:"+P ROUNDS",mul:1.3},{name:"HOT LOADS",mul:1.65},{name:"DEPLETED DOC",mul:2.1}],Ti={oc:{label:"Orange OC",range:6.5,cone:.45,dps:30,blind:3.2,drain:22,puff:.25},vapor:{label:"OC Vapor",range:8.5,cone:.7,dps:34,blind:4.5,drain:26,puff:.5,linger:!0}},hi=[{at:0,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"oc",nades:!1},{at:20,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"vapor",nades:!1,news:"OC Vapor issued. It hangs in the air. Do NOT walk into your own cloud."},{at:45,rank:"SGT.",title:"Sergeant",gun:"launcher",spray:"vapor",nades:!1,news:"Congrats, Sgt. {hero}. Here is a 40mm less-lethal launcher. Still no raise."},{at:85,rank:"SGT.",title:"Sergeant",gun:"shotgun",spray:"vapor",nades:!1,news:"Armory approved the shotgun. Sign here, here, and here."},{at:130,rank:"LT.",title:"Lieutenant",gun:"ar",spray:"vapor",nades:!0,news:"Lieutenant {hero}! AR-15 and grenades approved. Please do not grenade the PREA poster."}],oi={time:12,hurtGain:.6,swing:.32,range:3.4,dmg:9999,bossDmg:260,knock:19,sprint:1.4,sprintDrain:16};h.coPower=h.coPower||function(i){};var Yi={cd:5,fuse:.8,radius:4.6,dmg:140,knock:15},li={gun:$n.pepperball,spray:Ti.oc,baton:{range:2.4,arc:1.15,dmg:48,knock:11,time:.28,cd:.42},dash:{speed:21,time:.18,cost:22,dmg:10,knock:9},move:6.2},jr=class{constructor(e,t,n,s){this.slot=e,this.name=h.cleanName(t),this.gender=n,this.device=s,this.model=ko({gender:n,slot:e}),h.R.scene.add(this.model.root),this.x=0,this.z=0,this.r=.42,this.yaw=0,this.ax=0,this.az=1,this.reset(),ap(this)}reset(){this.hp=this.maxHp=100+(this.gear&&this.gear.pants?this.gear.pants.stat.hp:0),this.energy=100,this.down=!1,this.reviveT=0,this.fireCD=0,this.swingT=0,this.swingCD=0,this.dashT=0,this.iframes=0,this.slowT=0,this.tacoT=0,this.drinkT=0,this.hurtT=0,this.tauntT=3,this.sprayT=0,this.spraying=!1,this.kills=0,this.score=0,this.move=0,this.kvx=0,this.kvz=0,this.ot=this.ot||0,this.otT=0,this.otSwingT=0,this.sprinting=!1,this.hammer&&(this.hammer.visible=!1,this.model.root.scale.setScalar(1))}remove(){h.R.scene.remove(this.model.root)}hurt(e,t,n,s,r=3){if(this.down||this.iframes>0)return;if(e*=1-(this.armor||0),this.perks&&this.perks.has("spiky")){h.grid.query(t,n,1.2,Lt);for(let c of Lt)c.dead||(c.ocT=Math.max(c.ocT,2.5))}this.otT>0?e*=.4:this.ot=Math.min(100,(this.ot||0)+e*oi.hurtGain),this.hp-=e,this.hurtT=.35;let a=this.x-t,o=this.z-n,l=Math.hypot(a,o)||1;this.kvx+=a/l*r,this.kvz+=o/l*r,h.R.shake=Math.min(.6,h.R.shake+e*.02),h.R.split=Math.min(1,h.R.split+e*.06),h.audio.play("hurt",.7),s!=="spit"&&s!=="cup"&&h.FX.blood(this.x,1.3,this.z,a/l,o/l,4),this.hp<=0&&(this.hp=0,this.down=!0,h.FX.float(this.x,2.5,this.z,`${this.name} IS DOWN!`,"#ff5050",20,2.5),h.audio.play("alarm",1))}update(e){let t=this.model,n=this.device.read(this);if(this.iframes=Math.max(0,this.iframes-e),this.hurtT=Math.max(0,this.hurtT-e),this.tacoT=Math.max(0,this.tacoT-e),this.drinkT=Math.max(0,this.drinkT-e),this.zynT=Math.max(0,(this.zynT||0)-e),this.slowT=Math.max(0,this.slowT-e),this.rallyT=Math.max(0,(this.rallyT||0)-e),this.fireCD-=e,this.swingCD-=e,this.tauntT-=e,this.nadeCD=(this.nadeCD||0)-e,this.down){ri(t,e,0,0,!1,1),t.root.position.set(this.x,0,this.z);return}this.perks&&this.perks.has("regen")&&(this.hp=Math.min(this.maxHp,this.hp+2*e)),this.sprinting=!!n.sprint&&this.energy>1&&Math.hypot(n.mx,n.mz)>.2&&!(this.otT>0),this.sprinting&&(this.energy=Math.max(0,this.energy-oi.sprintDrain*e)),n.ot&&this.ot>=100&&!(this.otT>0)&&this.startOT(),this.otT>0&&(this.otT-=e,this.otSwingT-=e,this.otSwingT<=0&&(this.otSwingT=oi.swing,this.swingT=.001,this.hitDone=!1,h.audio.play("swing",1)),this.otT<=0&&this.endOT());let s=li.move*(this.speedMul||1)*(this.sprinting?oi.sprint:1)*(this.otT>0?1.15:1)*(this.drinkT>0?1.3:1)*(this.slowT>0?.6:1)*(this.spraying?.75:1),r=n.mx,a=n.mz,o=Math.hypot(r,a);if(o>1&&(r/=o,a/=o),this.dashT>0){this.dashT-=e,r=this.dashX,a=this.dashZ,s=li.dash.speed,h.grid.query(this.x,this.z,1.3,Lt);for(let c of Lt)!c.dead&&!c.dashHit&&(c.dashHit=!0,h.AI.damage(c,li.dash.dmg*this.dmgMul(),this.x,this.z,li.dash.knock,"dash",this))}else if(n.dash&&this.energy>=li.dash.cost&&o>.2){this.perks&&this.perks.has("freeDash")||(this.energy-=li.dash.cost),this.dashT=li.dash.time,this.iframes=.28,this.dashX=r/(o>1?1:o||1),this.dashZ=a/(o>1?1:o||1);for(let c of h.AI.list)c.dashHit=!1;h.audio.play("dash")}this.x+=(r*s+this.kvx)*e,this.z+=(a*s+this.kvz)*e;let l=Math.exp(-e*8);if(this.kvx*=l,this.kvz*=l,h.W.collide(this),this.move=h.lerp(this.move,Math.min(1,Math.hypot(r,a)),e*10),n.ax||n.az){let c=Math.hypot(n.ax,n.az);this.ax=n.ax/c,this.az=n.az/c}this.yaw=Math.atan2(this.ax,this.az),this.spraying=n.spray&&this.energy>0,!this.spraying&&!this.sprinting&&(this.energy=Math.min(100,this.energy+e*(this.drinkT>0?30:9))),n.fire&&this.fireCD<=0&&this.swingT<=0&&!this.sprinting&&!(this.otT>0)&&this.shoot(),this.spraying&&this.spray(e),n.nade&&h.S.nades&&this.nadeCD<=0&&this.throwNade(n),n.melee&&this.swingCD<=0&&(this.swingT=.001,this.swingCD=li.baton.cd,this.hitDone=!1,h.audio.play("swing")),this.swingT>0&&(this.swingT+=e/li.baton.time,!this.hitDone&&this.swingT>.4&&(this.hitDone=!0,this.baton()),this.swingT>=1&&(this.swingT=0)),ri(t,e,this.move,this.swingT,n.fire&&!this.sprinting&&!(this.otT>0)||this.spraying,0),this.otT>0&&(t.baton.visible=!1,t.gun.visible=!1,this.hammer.visible=!0),t.root.position.set(this.x,0,this.z),t.root.rotation.y=this.yaw,t.ring.material.opacity=this.iframes>0?.3:.85}startOT(){this.ot=0,this.otT=oi.time,this.otSwingT=0,this.hammer||(this.hammer=T_(this.model)),this.model.root.scale.setScalar(1.3),h.showCard&&h.showCard("MANDATORY OVERTIME",h.pick(S_),!0,2600),h.say&&h.say("SUPERVISOR",h.pick(["You are mandated. Sixteen hours. Have fun.","Congratulations, you just got mandated. Go nuts.","Overtime approved. Payroll is crying. Clean house."]),3.5),h.audio.sting("overtime"),h.audio.music("overtime",!0),h.R.shake=.8,document.body.classList.add("assault","overtime"),h.coPower(this)}endOT(){this.otT=0,this.model.root.scale.setScalar(1),this.hammer&&(this.hammer.visible=!1),h.officers.some(e=>e.otT>0)||(document.body.classList.remove("assault","overtime"),h.levelMusic&&h.levelMusic()),h.FX.float(this.x,3,this.z,h.pick(["Clocked out.","Shift over. Back to normal pay.","OT done. Knees hurt."]),"#ffd24a",18,2)}dmgMul(){return(this.zynT>0?1.35:1)*(this.tacoT>0?1.5:1)*(this.rallyT>0?1.3:1)}flashShoot(){h.R.flashBoost=1;let e=13,t=.3;h.grid.query(this.x,this.z,e,Lt);for(let n of Lt){if(n.dead||n.caged)continue;let s=n.x-this.x,r=n.z-this.z,a=Math.hypot(s,r);a>e||a<.01||Math.acos(h.clamp((s*this.ax+r*this.az)/a,-1,1))>t||h.W.los(this.x,this.z,n.x,n.z)&&(n.ocT=Math.max(n.ocT,1.2),n.flashedT=.3,h.AI.damage(n,(a<5?6:3)*this.dmgMul(),this.x,this.z,.5,"flash",this))}Math.random()<.6&&h.FX.glow.spawn(this.x+this.ax*h.rand(1,9),1.3,this.z+this.az*h.rand(1,9),0,0,0,.12,.3,16773832,0),h.audio.play("beam",.6)}shoot(){let e=h.S.power,t=e&&$n[e.key]||$n[h.S.gun]||$n.pepperball,n=e?0:(h.S.ammo||{})[h.S.gun]||0,s=e?1:Ho[n].mul;h.S.def&&h.S.def.night&&(this.flashShoot(),h.R.muzzle(this.x+this.ax*1.2,this.z+this.az*1.2,t.pellets>1||t.sound==="boom"?1:.6));let a=t.rate*(this.drinkT>0?1.5:1);this.fireCD=1/a;let o=this.ax,l=this.az,c=.985;h.grid.query(this.x,this.z,16,Lt);for(let d of Lt){if(d.dead)continue;let f=d.x-this.x,p=d.z-this.z,y=Math.hypot(f,p)||1,x=(f*this.ax+p*this.az)/y;x>c&&(c=x,o=f/y,l=p/y)}let u=t.pellets+(t.pellets>1?n*2:0);for(let d=0;d<u;d++){let f=h.rand(-t.spread,t.spread),p=Math.cos(f),y=Math.sin(f),x=o*p-l*y,g=o*y+l*p,m=t.speed*h.rand(.9,1.1);Qe.balls.push({x:this.x+x*.6,z:this.z+g*.6,y:1.3,vx:x*m,vz:g*m,life:t.life,owner:this,gun:t,mul:s})}t.kick&&(this.kvx-=o*t.kick*10,this.kvz-=l*t.kick*10,h.R.shake=Math.min(.5,h.R.shake+t.kick*.5)),h.FX.glow.spawn(this.x+o*.9,1.3,this.z+l*.9,0,0,0,.05,t.pellets>1?.35:.22,16770976,0),h.audio.play(t.sound,.6)}spray(e){if(this.energy=Math.max(0,this.energy-(Ti[h.S.spray]||Ti.oc).drain*e),this.sprayT-=e,this.sprayT>0)return;this.sprayT=.07;let t=Ti[h.S.spray]||Ti.oc,n=t.cone*3;(t.linger?h.FX.mist:h.FX.cloud)(this.x+this.ax*.8,1.35,this.z+this.az*.8,this.ax*t.range*2.2+h.rand(-n,n),this.az*t.range*2.2+h.rand(-n,n),t.puff),t.linger&&Math.random()<.35&&Qe.hazards.push({x:this.x+this.ax*t.range*.7,z:this.z+this.az*t.range*.7,r:2.4,t:5,owner:this}),h.audio.play("spray",.6),h.grid.query(this.x,this.z,t.range,Lt);for(let r of Lt){if(r.dead)continue;let a=r.x-this.x,o=r.z-this.z,l=Math.hypot(a,o);l>t.range||l<.01||Math.acos(h.clamp((a*this.ax+o*this.az)/l,-1,1))>t.cone||h.W.los(this.x,this.z,r.x,r.z)&&(r.ocT=t.blind,h.AI.damage(r,t.dps*.07*this.dmgMul(),this.x,this.z,.6,"oc",this))}}throwNade(e){this.nadeCD=Yi.cd;let t=Math.hypot(e.ax||0,e.az||0),n=t>2.5?h.clamp(t,3,12):9,s=Yi.fuse;Qe.nades.push({x:this.x+this.ax*.6,z:this.z+this.az*.6,y:1.6,vx:this.ax*n/s,vz:this.az*n/s,vy:4.5,t:s,owner:this,mesh:null}),h.audio.play("swing",1),h.FX.float(this.x,2.6,this.z,h.pick(["FRAG OUT!","GRENADE!","Fire in the hole!"]),"#ffcf4a",17,1.2)}baton(){if(this.otT>0)return this.hammerHit();let e=li.baton;h.grid.query(this.x,this.z,e.range+.6,Lt);let t=0;for(let n of Lt){if(n.dead)continue;let s=n.x-this.x,r=n.z-this.z,a=Math.hypot(s,r);if(a>e.range+n.r||a>.5&&Math.acos(h.clamp((s*this.ax+r*this.az)/a,-1,1))>e.arc)continue;let o=n.ocT>0?2:1,l=h.AI.damage(n,e.dmg*o*this.dmgMul(),this.x,this.z,e.knock*(o>1?1.4:1),"baton",this);h.FX.sparks(n.x,1.3*n.scale,n.z,5,16777215),t++,o>1&&t===1&&h.FX.float(n.x,2.6,n.z,"BLIND SIDE!","#ffdd55",16,1),l&&this.taunt()}t&&(h.audio.play("crack"),h.R.shake=Math.min(.7,h.R.shake+.12+t*.03),h.S.hitStop=.04,h.R.flashOn&&h.R.muzzle(this.x+this.ax*1.5,this.z+this.az*1.5,.5))}hammerHit(){h.grid.query(this.x,this.z,oi.range+.6,Lt);let e=0;for(let t of Lt){if(t.dead||t.caged)continue;let n=t.x-this.x,s=t.z-this.z;Math.hypot(n,s)>oi.range+t.r||(h.AI.damage(t,t.boss?oi.bossDmg:oi.dmg,this.x,this.z,oi.knock,"hammer",this),h.FX.sparks(t.x,1.3*t.scale,t.z,8,16765514),e++)}e&&Math.random()<.5&&h.FX.float(this.x+this.ax*2,.8,this.z+this.az*2,h.pick(["*CLOCK IN*","DING!","*PUNCH*","BONK","OT!"]),"#ffd24a",15,.6),e&&(h.audio.play("clock",1),h.R.shake=Math.min(.9,h.R.shake+.25),h.S.hitStop=.05,h.R.flashOn&&h.R.muzzle(this.x,this.z,1.2))}taunt(){this.tauntT>0||Math.random()>.3||(this.tauntT=h.rand(4,7),h.FX.float(this.x,2.5,this.z,h.pick(Ef),"#9fd0ff",16,1.8))}},ci,v_=new L(0,0,1),op=new Be,lp=new Yt,cp=new L,__=new L,hp=new ye;Qe.init=function(i){ci=new an(new At(1,8,6),new ft({toneMapped:!1}),400),ci.frustumCulled=!1,ci.count=0,ci.setColorAt(0,hp.set(1,1,1)),i.add(ci);for(let e=0;e<4;e++){let t=new he(new At(1,20,14),new ft({color:16756816,transparent:!0,opacity:0,depthWrite:!1,blending:xn,toneMapped:!1}));t.visible=!1,i.add(t),Bo.push({mesh:t,t:0,x:0,z:0})}};var Bo=[],M_=new At(.13,10,8),jh=null;Qe.reset=function(){for(let i of Qe.nades)i.mesh&&h.R.scene.remove(i.mesh);Qe.balls.length=0,Qe.hazards.length=0,Qe.nades.length=0;for(let i of Qe.pickups)h.R.scene.remove(i.mesh);Qe.pickups.length=0};Qe.update=function(i,e){h.S.power&&(h.S.power.t-=i)<=0&&(h.S.power=null,h.FX.float(h.officers[0].x,2.8,h.officers[0].z,"Power weapon empty. Back to issue.","#ff9adf",16,1.6));let t=0;for(let n=Qe.balls.length-1;n>=0;n--){let s=Qe.balls[n];s.life-=i;let r=2,a=s.life<=0;for(let u=0;u<r&&!a;u++){if(s.x+=s.vx*i/r,s.z+=s.vz*i/r,h.W.blocked(s.x,s.z)){h.FX.sparks(s.x,s.y,s.z,4,16751146),a=!0;break}h.grid.query(s.x,s.z,.8,Lt);for(let d of Lt)if(!d.dead&&(d.x-s.x)**2+(d.z-s.z)**2<(d.r+.12)**2){let f=h.AI.damage(d,s.gun.dmg*(s.mul||1)*s.owner.dmgMul(),s.x-s.vx,s.z-s.vz,s.gun.knock,"ball",s.owner);s.gun.sting&&(d.ocT=Math.max(d.ocT,s.gun.sting)),h.FX.sparks(s.x,s.y,s.z,h.R.flashOn?8:3,h.R.flashOn?16765066:16751146),h.FX.cloud(s.x,s.y,s.z,0,0,.15),h.R.flashOn&&h.R.muzzle(s.x,s.z,.35),h.audio.play("thud",.4),f&&s.owner.taunt(),a=!0;break}}if(a){Qe.balls.splice(n,1);continue}let o=h.R.flashOn,l=s.gun.size*(o?1.8:1),c=s.gun.speed>40?5:o?2.5:1;o&&Math.random()<.5&&h.FX.glow.spawn(s.x,s.y,s.z,0,0,0,.12,l*.8,s.gun.color,0),lp.setFromUnitVectors(v_,cp.set(s.vx,0,s.vz).normalize()),op.compose(cp.set(s.x,s.y,s.z),lp,__.set(l,l,l*c)),ci.setMatrixAt(t,op),ci.setColorAt(t,hp.setHex(s.gun.color)),t++}ci.count=t,ci.instanceMatrix.needsUpdate=!0,ci.instanceColor.needsUpdate=!0;for(let n=Qe.nades.length-1;n>=0;n--){let s=Qe.nades[n];s.mesh||(jh=jh||new Le({color:4016682,roughness:.6,metalness:.3}),s.mesh=new he(M_,jh),s.mesh.castShadow=!0,h.R.scene.add(s.mesh)),s.t-=i,s.vy-=12*i;let r=s.x+s.vx*i,a=s.z+s.vz*i;if(h.W.blocked(r,a)?(s.vx*=-.4,s.vz*=-.4):(s.x=r,s.z=a),s.y+=s.vy*i,s.y<.15&&(s.y=.15,s.vy=Math.abs(s.vy)*.35,s.vx*=.6,s.vz*=.6),s.mesh.position.set(s.x,s.y,s.z),s.mesh.rotation.x+=i*12,Math.random()<.5&&h.FX.glow.spawn(s.x,s.y+.1,s.z,0,.3,0,.1,.06,16764006,0),s.t>0)continue;h.R.scene.remove(s.mesh),Qe.nades.splice(n,1);let o=Bo.find(l=>l.t<=0)||Bo[0];o.t=.45,o.x=s.x,o.z=s.z,h.FX.sparks(s.x,.8,s.z,40,16760928),h.R.flashOn&&h.R.muzzle(s.x,s.z,2.5);for(let l=0;l<10;l++)h.FX.cloud(s.x+h.rand(-1.5,1.5),.8,s.z+h.rand(-1.5,1.5),h.rand(-3,3),h.rand(-3,3),.9,7236196);h.audio.play("boom",1.4),setTimeout(()=>h.audio.play("boom",.8),90),h.R.shake=Math.min(1,h.R.shake+.7),h.S.hitStop=.06,h.grid.query(s.x,s.z,Yi.radius+1,Lt);for(let l of Lt.slice()){if(l.dead||l.caged)continue;let c=Math.hypot(l.x-s.x,l.z-s.z);c>Yi.radius+l.r||h.AI.damage(l,Yi.dmg*(1-.6*c/Yi.radius)*s.owner.dmgMul(),s.x,s.z,Yi.knock,"nade",s.owner)}}for(let n of Bo){if(n.t<=0){n.mesh.visible=!1;continue}n.t-=i;let s=1-n.t/.45;n.mesh.visible=!0,n.mesh.position.set(n.x,.8,n.z),n.mesh.scale.setScalar(.6+Yi.radius*Math.sqrt(s)),n.mesh.material.opacity=(1-s)*.9,n.mesh.material.color.setHex(s<.25?16773312:16742944)}for(let n=Qe.hazards.length-1;n>=0;n--){let s=Qe.hazards[n];if(s.t-=i,s.t<=0){Qe.hazards.splice(n,1);continue}Math.random()<i*2.5&&h.FX.mist(s.x+h.rand(-1.2,1.2),.7,s.z+h.rand(-1.2,1.2),h.rand(-1.5,1.5),h.rand(-1.5,1.5),.6),h.grid.query(s.x,s.z,s.r,Lt);for(let r of Lt)!r.dead&&(r.x-s.x)**2+(r.z-s.z)**2<s.r*s.r&&(r.ocT=Math.max(r.ocT,1.5),Math.random()<i*3&&h.AI.damage(r,2,s.x,s.z,.2,"oc",s.owner))}for(let n=Qe.pickups.length-1;n>=0;n--){let s=Qe.pickups[n];s.t+=i,s.mesh.position.y=.55+Math.sin(e*3+s.x)*.12,s.mesh.rotation.y+=i*2;for(let r of h.officers)if(!(r.down||(r.x-s.x)**2+(r.z-s.z)**2>.9)){if(s.kind==="ammo"||s.kind==="power"){b_(r,s),h.R.scene.remove(s.mesh),Qe.pickups.splice(n,1);break}if(s.kind==="taco")r.hp=Math.min(r.maxHp,r.hp+30),r.tacoT=12;else if(s.kind==="gold"){let a=new Set(h.store.get("sa_gold",[]));a.add(h.S.def.key),h.store.set("sa_gold",[...a]),r.hp=r.maxHp,r.tacoT=20,a.size>=3&&!h.store.get("sa_bigbro",!1)?(h.store.set("sa_bigbro",!0),h.showCard("BIG BRO MODE UNLOCKED","Caleb Alaniz now rides the whole shift with you. I got you bro.",!0,4200)):h.FX.float(r.x,3,r.z,`GOLDEN TACO ${a.size}/3`,"#ffd34d",24,2.2)}else if(s.kind==="zyn")r.hp=Math.min(r.maxHp,r.hp+35),r.zynT=10,h.FX.sparks(r.x,1.6,r.z,14,16738842);else if(s.kind==="chew"){r.hp=Math.min(r.maxHp,r.hp+55),h.grid.query(r.x,r.z,5,Lt);let a=null,o=26;for(let l of Lt){if(l.dead)continue;let c=(l.x-r.x)**2+(l.z-r.z)**2;c<o&&(o=c,a=l)}a&&(a.ocT=4,h.FX.spit(r.x,1.5,r.z,a.x-r.x,a.z-r.z),h.FX.float(a.x,2.4,a.z,"TOBACCO IN THE EYE!","#c79a5a",16,1.4))}else r.energy=100,r.drinkT=10;h.FX.float(r.x,2.6,r.z,h.pick(Af[s.kind]),w_[s.kind],20,1.6),h.audio.play(s.kind==="zyn"||s.kind==="chew"||s.kind==="gold"?s.kind:"pickup"),h.R.scene.remove(s.mesh),Qe.pickups.splice(n,1);break}s.beam&&(s.beam.material.opacity=.18+Math.sin(e*6)*.06),s.t>(s.kind==="power"?45:30)&&s.kind!=="gold"&&Qe.pickups[n]===s&&(h.R.scene.remove(s.mesh),Qe.pickups.splice(n,1))}};function b_(i,e){let t=h.S;if(e.kind==="ammo"){t.ammo=t.ammo||{};let n=Math.min(3,(t.ammo[t.gun]||0)+1);t.ammo[t.gun]=n,h.FX.float(i.x,2.8,i.z,`${Ho[n].name}! ${$n[t.gun].label} hits harder`,"#ffe14a",20,2),h.FX.sparks(i.x,1.2,i.z,18,16769354),h.audio.play("pickup")}else{let n=$n[e.gun];t.power={key:e.gun,t:15,max:15},h.showCard(n.label,"GO HAM. 15 SECONDS. "+n.line,!0,2600),h.FX.sparks(i.x,1.4,i.z,40,16726992),h.R.shake=.5,h.audio.play("win")}}Qe.spawnWeapon=function(i,e,t){Qe.spawnPickup("power",i,e,t||h.pick(y_))};var w_={gold:"#ffd34d",taco:"#ffcf4a",drink:"#7dff6a",zyn:"#ff7a2a",chew:"#c79a5a"},Ct={};function E_(i){Ct.ready||(Ct.shell=new Le({color:15909198,roughness:.6}),Ct.meat=new Le({color:7027486,roughness:.8}),Ct.lettuce=new Le({color:6275642,roughness:.8}),Ct.can=new Le({color:1118481,roughness:.25,metalness:.8}),Ct.logo=new ft({color:7012154,toneMapped:!1}),Ct.zynLid=new Le({color:16054008,roughness:.35,metalness:.2}),Ct.zynBand=new Le({color:2060246,emissive:16730640,emissiveIntensity:.9,roughness:.4}),Ct.chewLid=new Le({color:2759954,roughness:.5,metalness:.3}),Ct.chewBand=new Le({color:13214282,roughness:.35,metalness:.7}),Ct.ring=new ft({color:16777215,transparent:!0,opacity:.5,toneMapped:!1}),Ct.ready=!0);let e=new ut;if(i==="taco"||i==="gold"){let n=new he(new it(.34,.34,.2,18,1,!0,0,Math.PI),Ct.shell);n.rotation.z=Math.PI/2,n.material.side=Bt;let s=new he(new Se(.16,.12,.55),Ct.meat);s.position.y=.06;let r=new he(new Se(.2,.06,.5),Ct.lettuce);if(r.position.y=.14,e.add(n,s,r),e.scale.setScalar(1.3),i==="gold"){let a=new Le({color:16765773,emissive:9067008,emissiveIntensity:1.4,metalness:1,roughness:.2});e.traverse(o=>{o.isMesh&&(o.material=a)})}}else if(i==="zyn"||i==="chew"){let n=i==="zyn",s=new he(new it(.3,.3,.12,24),n?Ct.zynBand:Ct.chewBand),r=new he(new it(.31,.31,.05,24),n?Ct.zynLid:Ct.chewLid);r.position.y=.08,e.add(s,r),e.rotation.x=.5}else if(i==="ammo"){let n=new he(new Se(.55,.36,.3),new Le({color:4872746,roughness:.5,metalness:.4})),s=new he(new Se(.57,.08,.32),new Le({color:16765498,emissive:16756736,emissiveIntensity:1.2})),r=new he(new Se(.3,.05,.12),Ct.zynLid);r.position.y=.2,e.add(n,s,r)}else if(i==="power"){let n=new Le({color:1710623,metalness:.8,roughness:.3,emissive:16726992,emissiveIntensity:.35}),s=new he(new Se(.9,.2,.16),n),r=new he(new it(.06,.06,.6,10).rotateZ(Math.PI/2),n);r.position.x=.7;let a=new he(new Se(.12,.26,.12),n);a.position.set(-.2,-.18,0);let o=new he(new it(.17,.17,.14,14).rotateX(Math.PI/2),new Le({color:16726992,emissive:16726992,emissiveIntensity:1.5}));o.position.set(.1,-.16,0),e.add(s,r,a,o),e.scale.setScalar(1.3)}else{let n=new he(new it(.13,.13,.48,16),Ct.can),s=new he(new it(.135,.135,.22,16,1,!0),Ct.logo);e.add(n,s)}e.traverse(n=>{n.castShadow=!0});let t=new he(new ei(.45,.55,24),Ct.ring);return t.rotation.x=-Math.PI/2,t.position.y=-.5,e.add(t),e}Qe.spawnPickup=function(i,e,t,n){if(Qe.pickups.length>14&&i!=="power")return;let s=E_(i);s.position.set(e,.55,t),h.R.scene.add(s);let r={kind:i,x:e,z:t,mesh:s,t:0,gun:n};i==="power"&&(r.beam=new he(new it(.5,.7,9,16,1,!0),new ft({color:16726992,transparent:!0,opacity:.2,blending:xn,depthWrite:!1,side:Bt,toneMapped:!1})),r.beam.position.set(e,4.5,t),h.R.scene.add(r.beam),r.mesh.addEventListener("removed",()=>h.R.scene.remove(r.beam))),Qe.pickups.push(r)};h.dropLoot=function(i,e){let t=Math.random();t<.05?Qe.spawnPickup("taco",i,e):t<.09?Qe.spawnPickup("drink",i,e):t<.125?Qe.spawnPickup("zyn",i,e):t<.15?Qe.spawnPickup("chew",i,e):t<.172?Qe.spawnPickup("ammo",i,e):t<.18&&Qe.spawnWeapon(i,e)};var S_=["Sixteen hours. No breaks. No mercy.","Payroll is about to cry.","The time clock is a WEAPON now.","You have been mandated. They have been warned."];function T_(i){let e=new Le({color:16765773,emissive:8014336,emissiveIntensity:1.2,roughness:.3,metalness:1}),t=new Le({color:5922920,roughness:.45,metalness:.6}),n=new Le({color:16777215,emissive:16774080,emissiveIntensity:.6}),s=new Le({color:16722458,emissive:16722458,emissiveIntensity:1.5}),r=new ut,a=new he(new it(.05,.06,1.3,10),e);a.position.y=.55,r.add(a);let o=new he(new Se(.62,.5,.42),t);o.position.y=1.3,r.add(o);let l=new he(new it(.17,.17,.03,20),n);l.rotation.x=Math.PI/2,l.position.set(0,1.36,.22),r.add(l);let c=new he(new Se(.3,.05,.04),s);c.position.set(0,1.12,.22),r.add(c);for(let u of[-1,1]){let d=new he(new Se(.06,.56,.48),e);d.position.set(u*.34,1.3,0),r.add(d)}return r.traverse(u=>{u.isMesh&&(u.castShadow=!0)}),r.rotation.x=Math.PI/2,r.position.set(0,-.07,.05),i.baton.parent.add(r),r}var Dt=[];h.allies=[];var A_={halley:{name:()=>h.CREW.halley,gender:"female",rank:"sgt",back:"SGT. MUNOZ",scale:1.02,title:"The Sergeant. The fianc\xE9e. The legend.",hp:400,time:30,speed:7.2,uniform:1914736,enter:["Sgt. Munoz on scene. Who touched my officers?","Move. Sergeant Munoz coming through.","Get up, {hero}. We are not dying on Sgt. Munoz's shift."],barks:["Sit DOWN.","That is a write-up AND a beatdown.","You wanna PREA me? Fill out the form.","Who trained you, {hero}? Oh right. Me.","Somebody get these men a timeout.","I did not do my hair for this.","Tase first, paperwork later."],leave:["Clean this up, family. I have a wedding to plan.","Sgt. Munoz out. Proud of every one of you.","Good work, family. Go home safe tonight. That is an order."]},caleb:{name:()=>h.CREW.caleb,gender:"male",back:"ALANIZ",scale:1.15,title:"Six-four of pure overtime. A real one.",hp:300,time:20,speed:6.8,uniform:2376318,enter:["I got you bro.","I got you bro. Caleb Alaniz on scene.","I got you bro. Get behind me.","Bro. BRO. I got you."],barks:["I got you bro.","Nobody touches my brother.","Bro, I got this side.","Six-four of pure overtime, baby!","Bro, that was a flag on the play.","Hold my energy drink.","You good, {hero}? Eat a taco, bro.","Ref! REF!","Touchdown, baby!"],leave:["Gotta bounce, bro. My truck is double-parked.","Alaniz out. Love y'all. Stay up, family.","Caleb out. Proud to work with y'all, for real."]},bernardo:{name:()=>h.CREW.bernardo,gender:"male",back:"CORRECTIONS",scale:1.08,hp:500,time:22,speed:6.2,uniform:2376318,enter:["Bernardo on scene. Hey, you wanna see how big my truck is? After this.","SHIELD UP! Bernardo\u2019s here!","Who called for the big shield and the bigger truck?"],barks:Lf,leave:["Shield\u2019s going back in the truck. The BIG truck.","Bernardo out. Somebody owes me twenty on Sunday."]},dustin:{name:()=>h.CREW.dustin,gender:"male",back:"DAVIS",scale:1,title:'"YOU WANNA FUCK ON ME?"',hp:300,time:22,speed:7,uniform:2376318,enter:["You wanna fuck on me? Dustin Davis on scene.","YOU WANNA FUCK ON ME?! Officer Davis is here.","You wanna fuck on me? Come on then. Dustin Davis in the building."],barks:[ar,ar,ar,ar,ar,...Yf],barkGap:[2.5,4.5],barkSize:18,leave:["Davis out. You still wanna fuck on me? Didn't think so.","Roast complete. Dustin Davis out. Love you, family."]},ricardo:{name:()=>h.CREW.ricardo,gender:"male",back:"ALANIZ",scale:1.1,title:"One of the good ones. A legend. He cleans house.",hp:450,time:22,speed:7.6,uniform:11569749,lanyard:!0,gold:!0,enter:$f,barks:Zf,leave:Kf,barkGap:[3,5],barkSize:17},caughren:{name:()=>h.CREW.caughren,gender:"female",back:"CAUGHREN",scale:1,hp:1,time:1e9,speed:3,uniform:2771594,passive:!0,belly:!0,deny:Hf,extra:Gf,close:"ASK BINGHAM.",col:"#ff8ad8",leave:["It was ONE phone!","I want my union rep!","He said he LOVED me!","I was never here."]},bingham:{name:()=>h.CREW.bingham,gender:"female",back:"COUNSELOR",scale:1,hp:1,time:1e9,speed:3,uniform:12098154,passive:!0,belly:!0,lanyard:!0,deny:Vf,extra:Wf,close:Xf,col:"#ffb37a",leave:["My caseload NEEDS me!","I am calling my therapist. He is in C-pod.","This is a hostile work environment!","I was never here."]}},Qh=class{constructor(e,t,n){let s=this.d=A_[e];if(this.key=e,this.name=s.name(),this.model=ko({gender:s.gender,rank:s.rank,back:s.back,ringColor:e==="halley"||s.gold?16765773:s.passive?16734896:16777215,uniform:s.uniform,scale:s.scale,skin:e==="halley"?13011550:void 0,hair:e==="halley"?1709072:void 0,belly:s.belly,lanyard:s.lanyard}),h.R.scene.add(this.model.root),e==="bernardo"){let r=new he(new Se(.06,.95,.62),new Le({color:11063536,roughness:.08,metalness:.1,transparent:!0,opacity:.45}));r.position.set(-.05,-.38,.28),r.rotation.y=Math.PI/2,this.model.armL.add(r),this.model.holdL=!0}if(Object.assign(this,{x:t,z:n,r:.45,yaw:0,hp:s.hp,t:s.time,down:!1,isAlly:!0,move:0,swingT:0,cd:.5,tazeCD:0,slamCD:2,sprayT:0,barkT:h.rand(4,7),leaving:!1}),s.passive){Object.assign(this,{passive:!0,state:"cuddle",lines:[],lineT:0,heartT:.5,walkT:0}),this.model.baton.visible=!1,this.tag=document.createElement("div"),this.tag.className="nametag",this.tag.style.color=s.col,this.tag.textContent="\u26A0 "+this.name+" \u26A0",document.getElementById("floaters").appendChild(this.tag);return}h.FX.sparks(t,1,n,20,16765773),h.FX.float(t,2.8,n,`${this.name.toUpperCase()} ON SCENE`,e==="halley"||s.gold?"#ffd34d":"#9fd0ff",22,2.2),e==="dustin"&&h.FX.float(t,3.4,n,'"YOU WANNA FUCK ON ME?"',"#ffd27a",30,2.8),e==="ricardo"&&(h.FX.sparks(t,1,n,40,16765773),h.R.shake=.5,h.audio.play("slam",.8)),h.showCard&&h.showCard(`${this.name.toUpperCase()}`,`ON SCENE \xB7 ${s.title||""}`,!1,2800),this.tag=document.createElement("div"),this.tag.className="nametag"+(e==="halley"||s.gold?" gold":""),this.tag.textContent=this.name,document.getElementById("floaters").appendChild(this.tag),h.say(this.name,h.pick(s.enter))}hurt(e){this.hp-=e*.5,this.model.root.children[0]&&(this.flash=.2),this.hp<=0&&(this.t=0)}remove(){h.R.scene.remove(this.model.root),this.tag&&this.tag.remove()}bust(){if(this.state!=="cuddle")return;let e=this.d;this.state="busted",this.lineT=.4,this.lines=e.deny.concat(e.extra.slice().sort(()=>Math.random()-.5).slice(0,4),[e.close]),h.showCard("COMPROMISED",`${this.name.toUpperCase()} \xB7 CAUGHT IN 4K`,!0,3e3),h.audio.play("scare",.8),this.bf&&!this.bf.dead&&h.FX.float(this.bf.x,2.9,this.bf.z,h.pick(Vh),"#ff8a3a",18,2)}walkOut(e){this.state!=="walk"&&(this.state="walk",this.walkT=3.5,h.FX.float(this.x,3,this.z,e||h.pick(this.d.leave),this.d.col,20,2.4),this.bf&&!this.bf.dead&&(this.bf.freezeT=0,this.bf.loveSick=!1))}passiveUpdate(e){let t=this.d,n=this.bf;if(this.state==="cuddle")n&&!n.dead&&(this.yaw=Math.atan2(n.x-this.x,n.z-this.z),n.freezeT=Math.max(n.freezeT,1),n.yaw=Math.atan2(this.x-n.x,this.z-n.z)),this.heartT-=e,this.heartT<=0&&(this.heartT=h.rand(.7,1.3),h.FX.float(this.x+h.rand(-.4,.4),2.3,this.z+h.rand(-.4,.4),h.pick(["\u2665","\u2665\u2665","\u2665","mwah","\u2665 \u2665 \u2665"]),"#ff5ab0",20,1.4),Math.random()<.3&&n&&!n.dead&&h.FX.float(n.x,2.8,n.z,h.pick(Vh),"#ff8a3a",15,1.8)),h.officers.some(s=>!s.down&&(s.x-this.x)**2+(s.z-this.z)**2<9)&&this.bust(),this.model.root.rotation.z=Math.sin(performance.now()/300)*.06;else if(this.state==="busted"){let s=h.officers.find(r=>!r.down)||h.officers[0];if(this.yaw=Math.atan2(s.x-this.x,s.z-this.z),this.model.root.rotation.z=0,this.lineT-=e,this.lineT<=0){let r=this.lines.shift();if(r)this.lineT=2.3,h.FX.float(this.x,3.1,this.z,r,t.col,17,2.4),h.say(this.name,r,2.3);else{h.S.compromised=(h.S.compromised||0)+1,(h.S.compNames=h.S.compNames||[]).push(this.name),h.say("CONTROL",`${this.name}, turn in your keys. Your radio. And your dignity.`,3.2);for(let a=0;a<2;a++)h.C.spawnPickup("zyn",this.x+h.rand(-1,1),this.z+h.rand(-1,1));h.FX.float(this.x,2.2,this.z,"CONTRABAND: 2 TINS, 1 PHONE, 1 SONOGRAM","#ff7a2a",15,2.5),this.walkOut()}}}else if(this.state==="walk"&&(this.walkT-=e,this.x+=Math.sin(this.yaw+Math.PI)*2*e,this.z+=Math.cos(this.yaw+Math.PI)*2*e,h.W.collide(this),this.move=h.lerp(this.move,.6,e*6),this.walkT<=0))return h.FX.sparks(this.x,1,this.z,16,16734896),this.leaving=!0,!1;if(ri(this.model,e,this.state==="walk"?this.move:0,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.state==="walk"?this.yaw+Math.PI:this.yaw,this.tag){let[s,r,a]=h.R.worldToScreen(this.x,2.7,this.z);this.tag.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%) scale(${1+.12*Math.sin(performance.now()/150)})`,this.tag.style.opacity=a?1:0}return!0}update(e){if(this.passive)return this.passiveUpdate(e);let t=this.d;if(this.t-=e,this.cd-=e,this.tazeCD-=e,this.slamCD-=e,this.barkT-=e,this.t<=0&&!this.leaving)return this.leaving=!0,h.say(this.name,h.pick(t.leave)),h.FX.sparks(this.x,1,this.z,16,16777215),!1;if(this.leaving)return!1;if(this.barkT<=0&&(this.barkT=h.rand(...t.barkGap||[5,9]),h.FX.float(this.x,2.7,this.z,h.t(h.pick(t.barks),R_()),this.key==="halley"||t.gold?"#ffd34d":this.key==="dustin"?"#ffd27a":"#9fd0ff",t.barkSize||15,2)),this.key==="ricardo"){let l=h.allies.find(c=>c.passive&&c.state==="cuddle");if(l){let c=l.x-this.x,u=l.z-this.z,d=Math.hypot(c,u)||1;if(d<2.2){let f=h.pick(Jf).replace("{name}",l.name.replace(/^(C\/O|Counselor) /,""));h.FX.float(this.x,3.3,this.z,f,"#ffd34d",22,2.6),l.bust(),l.lineT=2.4,h.say(this.name,f,2.4)}else return this.stuckT=(this.bestL??1e9)-d<.05?(this.stuckT||0)+e:0,this.bestL=Math.min(this.bestL??1e9,d),this.stuckT>1.2&&(h.FX.sparks(this.x,1,this.z,16,16765773),this.x=l.x-1.5,this.z=l.z+.5,this.stuckT=0,h.W.blocked(this.x,this.z)&&(this.x=l.x,this.z=l.z+1.2),h.FX.sparks(this.x,1,this.z,24,16765773),h.FX.float(this.x,2.9,this.z,"I know a shortcut.","#ffd34d",18,1.6)),this.walkTo(c/d,u/d,e)}}if(this.key==="caleb"){let l=h.officers.find(c=>c.down);if(l){let c=l.x-this.x,u=l.z-this.z,d=Math.hypot(c,u)||1;if(d<1.4)l.down=!1,l.hp=Math.max(l.hp,55),l.iframes=2,h.FX.float(l.x,2.6,l.z,"GET UP BRO. I GOT YOU.","#9fd0ff",20,2),this.bigBroSlam();else{if(this.yaw=Math.atan2(c,u),this.x+=c/d*this.d.speed*1.2*e,this.z+=u/d*this.d.speed*1.2*e,h.W.collide(this),this.move=h.lerp(this.move,1,e*8),ri(this.model,e,this.move,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[f,p,y]=h.R.worldToScreen(this.x,2.6*(this.d.scale||1),this.z);this.tag.style.transform=`translate(${f|0}px, ${p|0}px) translate(-50%, -50%)`,this.tag.style.opacity=y?1:0}return!0}}}if(this.key==="caleb")for(let l of h.officers)!l.down&&(l.x-this.x)**2+(l.z-this.z)**2<16&&(l.hp=Math.min(l.maxHp,l.hp+6*e));let n=h.officers.find(l=>!l.down)||h.officers[0],s=null,r=1e9;h.grid.query(n.x,n.z,16,Dt);for(let l of Dt){if(l.dead)continue;let c=(l.x-this.x)**2+(l.z-this.z)**2;c<r&&(r=c,s=l)}let a=0,o=0;if(s){let l=Math.sqrt(r),c=(s.x-this.x)/l,u=(s.z-this.z)/l;this.yaw=Math.atan2(c,u),l>1.6&&(a=c,o=u),this.key==="halley"?this.halleyMoves(s,l,c,u):this.key==="bernardo"?this.bernardoMoves(s,l):this.key==="dustin"?this.dustinMoves(s,l,c,u):this.key==="ricardo"?this.ricardoMoves(s,l,c,u,e):this.calebMoves(s,l,c,u,e)}else if((n.x-this.x)**2+(n.z-this.z)**2>9){let l=n.x-this.x,c=n.z-this.z,u=Math.hypot(l,c);a=l/u,o=c/u,this.yaw=Math.atan2(a,o)}if(this.x+=a*t.speed*e,this.z+=o*t.speed*e,h.W.collide(this),this.move=h.lerp(this.move,Math.hypot(a,o),e*8),this.swingT>0&&(this.swingT+=e/.3,this.swingT>=1&&(this.swingT=0)),ri(this.model,e,this.move,this.swingT,!1,0),this.model.root.position.set(this.x,0,this.z),this.spin>0&&(this.spin-=e),this.model.root.rotation.y=this.yaw+(this.spin>0?(.5-this.spin)*h.TAU*4:0),this.tag){let[l,c,u]=h.R.worldToScreen(this.x,2.6*(t.scale||1),this.z);this.tag.style.transform=`translate(${l|0}px, ${c|0}px) translate(-50%, -50%)`,this.tag.style.opacity=u?1:0}return!0}baton(e,t,n){this.swingT=.001,h.grid.query(this.x,this.z,t+.5,Dt);let s=0;for(let r of Dt)r.dead||(r.x-this.x)**2+(r.z-this.z)**2>t*t||(h.AI.damage(r,e,this.x,this.z,n,"baton",null),s++);return s&&(h.audio.play("crack"),h.R.shake=Math.min(.6,h.R.shake+.1)),s}halleyMoves(e,t){let n=0;h.grid.query(this.x,this.z,2.8,Dt);for(let s of Dt)s.dead||n++;if(n>=3&&this.slamCD<=0)this.slamCD=4.5,this.cd=.6,this.baton(70,3.2,14),h.FX.sparks(this.x,.3,this.z,30,16765773),h.FX.float(this.x,2.9,this.z,"TAKEDOWN!","#ffd34d",20,1.2),h.R.shake=.7,h.S.hitStop=.08;else if(t>2.5&&t<9&&this.tazeCD<=0){this.tazeCD=1.4;let s=this,r=e,a=new Set;for(let o=0;o<4&&r;o++)a.add(r),C_(s.x,s.z,r.x,r.z),r.ocT=Math.max(r.ocT,2.2),h.AI.damage(r,28,s.x,s.z,3,"taser",null),s=r,h.grid.query(r.x,r.z,4,Dt),r=Dt.find(l=>!l.dead&&!a.has(l))||null;h.audio.play("zap",.9),Math.random()<.25&&h.FX.float(e.x,2.5,e.z,h.pick(["RIDE THE LIGHTNING!","TASER TASER TASER!","Don't tase me, sis!"]),"#9fe8ff",16,1.2)}else t<1.9&&this.cd<=0&&(this.cd=.45,this.baton(55,2.2,9))}bernardoMoves(e,t){for(let n=h.AI.proj.length-1;n>=0;n--){let s=h.AI.proj[n];(s.x-this.x)**2+(s.z-this.z)**2<7&&(h.FX.sparks(s.x,s.y,s.z,6,11063536),h.AI.proj.splice(n,1))}t<2.3&&this.cd<=0&&(this.cd=.8,this.baton(40,2.6,16)&&(h.FX.float(this.x,2.7,this.z,"SHIELD BASH!","#a8d0f0",16,1),h.S.hitStop=.05))}dustinMoves(e,t,n,s){if(this.tazeCD<=0&&t<7){this.tazeCD=2.8,h.FX.float(e.x,2.6,e.z,h.pick(Pf),"#ffd27a",16,2.2),h.grid.query(this.x,this.z,7,Dt);for(let r of Dt){if(r.dead||r.boss)continue;let a=r.x-this.x,o=r.z-this.z,l=Math.hypot(a,o)||1;(a*n+o*s)/l>.6&&(r.freezeT=2,r.swing=0)}h.FX.float(this.x+n*3,2.2,this.z+s*3,"ROASTED!","#ff8a3a",20,1.2)}else t<1.9&&this.cd<=0&&(this.cd=.5,this.baton(45,2.2,9))}walkTo(e,t,n){if(this.yaw=Math.atan2(e,t),this.x+=e*this.d.speed*n,this.z+=t*this.d.speed*n,h.W.collide(this),this.move=h.lerp(this.move,1,n*8),ri(this.model,n,this.move,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[s,r,a]=h.R.worldToScreen(this.x,2.6*(this.d.scale||1),this.z);this.tag.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%)`,this.tag.style.opacity=a?1:0}return!0}ricardoMoves(e,t,n,s,r){if(this.comboCD=(this.comboCD??1)-r,this.houseCD=(this.houseCD??2)-r,this.chain&&this.chain.length){if(this.chainT-=r,this.chainT<=0){this.chainT=.13;let o=this.chain.shift();if(o&&!o.dead){let l=o.x-this.x,c=o.z-this.z,u=Math.hypot(l,c)||1;this.x=o.x-l/u*.9,this.z=o.z-c/u*.9,h.W.collide(this),this.yaw=Math.atan2(l,c),this.swingT=.001,this.combo++,h.AI.damage(o,55+this.combo*8,this.x,this.z,8+this.combo,"baton",null),h.FX.sparks(o.x,1.2,o.z,10,16765773),h.FX.float(o.x,2.6,o.z,`COMBO x${this.combo}`,"#ffd34d",16+this.combo*2,.9),h.audio.play("crack"),h.R.shake=Math.min(.7,h.R.shake+.12),h.S.hitStop=.03}this.chain.length||(h.FX.float(this.x,3.2,this.z,`COMBO x${this.combo} ROMBO!`,"#ffd34d",28,2),setTimeout(()=>h.FX.float(this.x,3,this.z,"Did you see that Combo Rombo?","#ffd34d",18,2.2),500),this.barkT=4)}return}let a=0;h.grid.query(this.x,this.z,3,Dt);for(let o of Dt)o.dead||a++;if(a>=5&&this.houseCD<=0){this.houseCD=6,this.cd=.8,this.spin=.5,h.grid.query(this.x,this.z,4,Dt);for(let o of Dt)!o.dead&&!o.boss&&h.AI.damage(o,95,this.x,this.z,18,"baton",null);for(let o=0;o<24;o++){let l=o/24*h.TAU;h.FX.sparks(this.x+Math.cos(l)*2.5,.3,this.z+Math.sin(l)*2.5,2,16765773)}h.FX.float(this.x,3.3,this.z,"HOUSE. CLEANED.","#ffd34d",30,2),h.R.shake=.8,h.S.hitStop=.1,h.audio.play("slam",1);return}if(this.comboCD<=0&&t<9){h.grid.query(this.x,this.z,9,Dt);let o=Dt.filter(l=>!l.dead).sort((l,c)=>(l.x-this.x)**2+(l.z-this.z)**2-((c.x-this.x)**2+(c.z-this.z)**2)).slice(0,6);if(o.length>=2){this.chain=o,this.chainT=0,this.combo=0,this.comboCD=h.rand(4,6),h.FX.float(this.x,2.9,this.z,"COMBO ROMBO!","#ffd34d",22,1),h.audio.play("dash");return}}t<2.1&&this.cd<=0&&(this.cd=.4,this.baton(60,2.4,11))}bigBroSlam(){h.grid.query(this.x,this.z,4.5,Dt);for(let e of Dt)!e.dead&&!e.boss&&h.AI.damage(e,70,this.x,this.z,16,"baton",null);h.FX.sparks(this.x,.4,this.z,30,10473727),h.R.shake=.7,h.audio.play("slam",1),h.FX.float(this.x,3,this.z,"BIG BRO SLAM!","#9fd0ff",24,1.6)}calebMoves(e,t,n,s,r){if(this.slammed||(this.slammed=!0,this.bigBroSlam()),this.tackleCD=(this.tackleCD||3)-r,this.tackleT>0){this.tackleT-=r,this.x+=this.tx*17*r,this.z+=this.tz*17*r,h.grid.query(this.x,this.z,1.4,Dt);for(let a of Dt)!a.dead&&!a.tackled&&(a.tackled=!0,h.AI.damage(a,60,this.x,this.z,13,"dash",null));return}if(this.tackleCD<=0&&t>2.5&&t<9){this.tackleCD=h.rand(3.5,5),this.tackleT=.35,this.tx=n,this.tz=s;for(let a of h.AI.list)a.tackled=!1;h.audio.play("dash"),h.FX.float(this.x,2.8,this.z,h.pick(["SHOULDER CHECK!","MOVE!","Tackle, bro!"]),"#9fd0ff",18,1);return}if(t<2.1&&this.cd<=0)this.cd=.5,this.baton(50,2.4,10);else if(t<6&&(this.sprayT-=r,this.sprayT<=0)){this.sprayT=.1,h.FX.cloud(this.x+n,1.4,this.z+s,n*12,s*12,.25),h.grid.query(this.x,this.z,6,Dt);for(let a of Dt){if(a.dead)continue;let o=a.x-this.x,l=a.z-this.z,c=Math.hypot(o,l)||1;(o*n+l*s)/c>.85&&c<6&&(a.ocT=3,h.AI.damage(a,2,this.x,this.z,.5,"oc",null))}}}};function R_(){return h.officers[0]&&h.officers[0].name||"Rookie"}function C_(i,e,t,n){for(let r=0;r<=8;r++){let a=r/8;h.FX.glow.spawn(h.lerp(i,t,a)+h.rand(-.15,.15),1.2+h.rand(-.2,.2),h.lerp(e,n,a)+h.rand(-.15,.15),0,0,0,.18,.09,10479871,0)}}var Zn={reset(){for(let i of h.allies)i.remove();h.allies.length=0},call(i,e,t){if(h.allies.some(l=>l.key===i))return!1;let n=h.officers.find(l=>!l.down)||h.officers[0],s=Math.random()*h.TAU,r=n.x+Math.cos(s)*3,a=n.z+Math.sin(s)*3;h.W.blocked(r,a)&&(r=n.x,a=n.z),e!==void 0&&(r=e,a=t);let o=new Qh(i,r,a);if(h.allies.push(o),i==="halley"){for(let l of h.officers)l.down&&(l.down=!1,l.hp=60,l.iframes=2,h.FX.float(l.x,2.6,l.z,"BACK UP!","#7dff6a",18,1.4)),l.rallyT=10;h.R.shake=.5}return o},update(i){for(let e=h.allies.length-1;e>=0;e--)h.allies[e].update(i)||(h.allies[e].remove(),h.allies.splice(e,1))}};h.Allies=Zn;var Pn={active:null};h.Boss=Pn;function I_(){let i=(p,y=.7,x=0)=>new Le({color:p,roughness:y,metalness:x}),e={suit:i(3107642,.8),waders:i(3885610,.45,.1),skin:i(14266508,.6),hair:i(3811868,.9),black:i(921102,.3,.4),steel:i(12107976,.2,1)},t=(p,y,x=0,g=0,m=0)=>{let v=new he(p,y);return v.position.set(x,g,m),v.castShadow=!0,v},n=new ut,s=new ut;n.add(s),s.add(t(new In(.27,.42,4,12),e.suit,0,1.1,0)),s.add(t(new it(.07,.08,.14,8),e.skin,0,1.45,0));let r=new ut;r.position.set(0,1.6,0),s.add(r),r.add(t(new At(.16,18,14),e.skin));for(let p=0;p<9;p++){let y=Math.PI*.55+p/8*Math.PI*.9;r.add(t(new it(.018,.01,.34,4),e.hair,Math.cos(y)*.15,-.08,Math.sin(y)*.15-.02))}r.add(t(new At(.17,14,8,0,Math.PI*2,0,Math.PI/2.4),e.hair,0,.02,0)),[-.065,.065].forEach(p=>{let y=t(new yn(.05,.012,6,16),e.black,p,.02,.155);r.add(y)}),r.add(t(new Se(.13,.025,.02),e.hair,0,-.06,.16));let a=(p,y,x,g,m,v)=>{let _=new ut;return _.position.set(p,y,0),_.add(t(new In(g,x-g*2,3,8).translate(0,-x/2,0),m)),v&&_.add(t(new At(g*1.05,8,6),v,0,-x,0)),s.add(_),_},o=a(-.34,1.36,.62,.07,e.suit,e.skin),l=a(.34,1.36,.62,.07,e.suit,e.skin),c=a(-.13,.82,.82,.1,e.waders,e.black),u=a(.13,.82,.82,.1,e.waders,e.black),d=new ut;d.position.set(0,-.66,.1),l.add(d),d.add(t(new it(.015,.015,.5,4),e.steel,0,-.2,0)),d.add(t(new yn(.11,.022,6,14,Math.PI*1.4),e.steel,0,-.5,0));let f=new he(new ei(.75,.9,32),new ft({color:8257434,transparent:!0,opacity:.6,toneMapped:!1}));return f.rotation.x=-Math.PI/2,f.position.y=.03,n.add(f),n.scale.setScalar(1.3),{root:n,body:s,head:r,armL:o,armR:l,legL:c,legR:u,ring:f,phase:0}}var Qr=[];Pn.spawn=function(i,e){let t=h.AI.spawn("ripper",i,e);return t.model=I_(),h.R.scene.add(t.model.root),Object.assign(t,{swingT:0,hookT:3,mistT:9,hiddenT:0,calloutT:6,tauntT:4,enraged:!1}),Pn.active=t,h.say("CONTROL",Yr.intro,4),h.audio.play("siren"),h.audio.sting("boss"),h.audio.music("boss",!0),h.R.shake=.6,t};Pn.reset=function(){Pn.active&&Pn.active.model&&h.R.scene.remove(Pn.active.model.root),Pn.active=null,Qr.length=0};Pn.think=function(i,e,t,n){let s=i.hp/i.maxHp,r=s>.66?1:s>.33?2:3;if(i.hookT-=e,i.mistT-=e,i.calloutT-=e,i.tauntT-=e,i.swingCD-=e,i.tauntT<=0&&(i.tauntT=h.rand(6,10),h.FX.float(i.x,3.2,i.z,h.pick(Yr.taunts),"#7dff9a",17,2.4)),r>=2&&h.R.scene.fog.far>34&&(h.R.scene.fog.near=8,h.R.scene.fog.far=32,h.say("CONTROL","Visibility is dropping on Killer Row! Stay together!",3)),r===3&&!i.enraged){i.enraged=!0,i.speed*=1.3;for(let c of h.W.doors)if(!c.opening){h.W.openDoor(c);for(let u=0;u<2;u++)h.AI.spawn("ding",c.spawn.x,c.spawn.z)}h.say("CONTROL","He popped the whole row! Dings everywhere!",3.5)}if(!t)return;if(i.hiddenT>0){if(i.hiddenT-=e,i.hiddenT<=0){let c=h.pick(h.targets);if(c){let u=Math.atan2(c.ax||0,c.az||1)+Math.PI;i.x=c.x+Math.sin(u)*1.8,i.z=c.z+Math.cos(u)*1.8,h.W.collide(i),i.swingT=.001,i.swingCD=0,h.FX.cloud(i.x,1.2,i.z,0,0,1.2,10467496),h.FX.float(i.x,3,i.z,"BEHIND YOU!","#ff5050",22,1.4)}}return}if(r>=2&&i.mistT<=0){i.mistT=h.rand(7,10),i.hiddenT=2.2;for(let c=0;c<8;c++)h.FX.cloud(i.x+h.rand(-1,1),1,i.z+h.rand(-1,1),h.rand(-2,2),h.rand(-2,2),.9,10467496);h.say("RADIO",h.pick(Yr.callouts),2.5);return}let a=t.x-i.x,o=t.z-i.z,l=1/(n||1);if(i.yaw+=h.angDiff(i.yaw,Math.atan2(a,o))*Math.min(1,e*8),i.hookT<=0&&n>4&&n<13&&(i.hookT=r===3?3:5,Qr.push({x:i.x,z:i.z,vx:a*l*20,vz:o*l*20,life:.8,owner:i}),h.audio.play("swing",1)),i.swingT>0){let c=i.swingT;if(i.swingT+=e*(r===3?3.2:2.6),c<.5&&i.swingT>=.5){for(let u of h.targets)(u.x-i.x)**2+(u.z-i.z)**2<7.3&&u.hurt(i.def.dmg*(r===3?1.3:1),i.x,i.z,"ripper",8);h.FX.sparks(i.x+a*l*1.5,1.2,i.z+o*l*1.5,8,10485696)}i.swingT>=1&&(i.swingT=0,i.swingCD=r===3?.5:.9)}else n<2.4&&i.swingCD<=0?i.swingT=.001:n>1.8&&(i.x+=a*l*i.speed*e,i.z+=o*l*i.speed*e,h.W.collide(i));i.move=h.lerp(i.move,n>1.8&&i.swingT===0?1:0,e*8)};Pn.onHit=function(i){i.hiddenT>0&&(i.hiddenT=Math.min(i.hiddenT,.3))};Pn.onDeath=function(i){h.S.slowmo=2.5,h.say("CONTROL",Yr.death,4.5),h.FX.float(i.x,3.4,i.z,"RIVERBANK RIPPER: DOWN","#7dff9a",26,3),h.FX.sparks(i.x,1.2,i.z,60,8257434),h.R.shake=.9,h.Loot.spawn(h.rollItem(3),i.x+1.2,i.z),h.R.scene.fog.near=22,h.R.scene.fog.far=70,h.S.bossDead=!0};Pn.update=function(i){for(let n=Qr.length-1;n>=0;n--){let s=Qr[n];s.life-=i,s.x+=s.vx*i,s.z+=s.vz*i,h.FX.glow.spawn(s.x,1.3,s.z,0,0,0,.12,.07,14217471,0);let r=null;for(let a of h.targets)if((a.x-s.x)**2+(a.z-s.z)**2<.8){r=a;break}if(r){r.hurt(10,s.x,s.z,"hook",0);let a=s.owner.x-r.x,o=s.owner.z-r.z,l=Math.hypot(a,o)||1;r.kvx!==void 0&&(r.kvx+=a/l*16,r.kvz+=o/l*16),h.FX.float(r.x,2.6,r.z,"HOOKED!","#d8f0ff",18,1.2)}(r||s.life<=0||h.W.blocked(s.x,s.z))&&Qr.splice(n,1)}let e=Pn.active;if(!e||!e.model)return;let t=e.model;t.root.visible=!(e.hiddenT>0),ri(t,i,e.move||0,e.swingT||0,!1,e.dead?Math.min(1,e.fall):0),t.root.position.set(e.x,0,e.z),t.root.rotation.y=e.yaw,e.flash>0?t.body.children[0].material.emissive.setHex(5583667):t.body.children[0].material.emissive.setHex(0)};var ea=new Set,Ln={x:innerWidth/2,y:innerHeight/2,l:!1,r:!1};addEventListener("keydown",i=>{ea.add(i.code),["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.code)&&!(i.target instanceof HTMLInputElement)&&i.preventDefault()});addEventListener("keyup",i=>ea.delete(i.code));addEventListener("blur",()=>{ea.clear(),Ln.l=Ln.r=!1});addEventListener("mousemove",i=>{Ln.x=i.clientX,Ln.y=i.clientY});addEventListener("mousedown",i=>{i.button===0&&(Ln.l=!0),i.button===2&&(Ln.r=!0)});addEventListener("mouseup",i=>{i.button===0&&(Ln.l=!1),i.button===2&&(Ln.r=!1)});addEventListener("contextmenu",i=>i.preventDefault());var P_={keys:ea,mouse:Ln};h.Input=P_;function up(){let i=!1;return{kind:"kbm",label:"Keyboard + Mouse",read(e){let t=ea,n=(t.has("KeyD")?1:0)-(t.has("KeyA")?1:0),s=(t.has("KeyS")?1:0)-(t.has("KeyW")?1:0),r=h.R.screenToGround(Ln.x,Ln.y,1.2),a=t.has("ShiftLeft")||t.has("ShiftRight"),o=a&&!i;return i=a,{mx:n,mz:s,ax:r?r.x-e.x:0,az:r?r.z-e.z:0,fire:Ln.l,spray:Ln.r,melee:t.has("Space"),dash:o,sprint:a,ot:t.has("KeyF"),nade:t.has("KeyQ")||t.has("KeyG")}}}}function eu(i){let e=!1,t=n=>Math.abs(n)<.2?0:n;return{kind:"pad",index:i,label:`Controller ${i+1}`,read(n){let s=h.pads()[i];if(!s)return{mx:0,mz:0,ax:0,az:0};let r=f=>!!(s.buttons[f]&&(s.buttons[f].pressed||s.buttons[f].value>.4)),a=t(s.axes[0]),o=t(s.axes[1]),l=s.axes[2]||0,c=s.axes[3]||0;Math.hypot(l,c)<.3&&(l=a,c=o);let u=r(0)||r(4),d=u&&!e;return e=u,{mx:a,mz:o,ax:l,az:c,fire:r(7),spray:r(6),melee:r(2)||r(5),dash:d,sprint:u,ot:r(1),nade:r(3)}}}}function dp(){let i=[],e=h.pads();for(let t=0;t<e.length;t++)e[t]&&i.push(t);return i}var mp=matchMedia("(pointer: coarse)").matches||navigator.maxTouchPoints>0,Go={enabled:mp,active:!1};h.Touch=Go;var Zi=60,fn={move:null,aim:null},wn={spray:!1,melee:!1,dash:!1,nade:!1,ot:!1},fp=!1,L_=`
#touch { position: fixed; inset: 0; z-index: 5; touch-action: none; user-select: none; -webkit-user-select: none; display: none; }
#touch .base { position: absolute; width: ${Zi*2}px; height: ${Zi*2}px; margin: -${Zi}px 0 0 -${Zi}px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); background: rgba(0,0,0,0.18); pointer-events: none; }
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
`;function $i(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n&&(s.textContent=n),t.appendChild(s),s}function D_(){let i=document.createElement("style");i.textContent=L_,document.head.appendChild(i);let e=$i("div",null,document.body);e.id="touch";let t=$i("div","hint",e,"MOVE");t.style.left="18%";let n=$i("div","hint",e,"AIM + SHOOT");n.style.right="30%";let s=$i("div",null,document.body,"\u{1F4F1}\u21BB Turn your phone sideways");s.id="rotateHint";let r=(d,f,p,y,x)=>{let g=$i("div","btn "+d,e,f);g.style.right=y+"px",g.style.bottom=x+"px",g.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),Go.active=!0,wn[p]=!0,g.classList.add("on");try{g.setPointerCapture(v.pointerId)}catch{}});let m=v=>{v.preventDefault(),wn[p]=!1,g.classList.remove("on")};return g.addEventListener("pointerup",m),g.addEventListener("pointercancel",m),g};r("spray","SPRAY","spray",18,108),r("","BATON","melee",96,30),r("","DASH","dash",18,30);let a=r("ot","OT","ot",174,30),o=r("nade","NADE","nade",96,108);$i("div","btn pause",e,"II").addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),dispatchEvent(new KeyboardEvent("keydown",{code:"Escape"}))}),e.addEventListener("pointerdown",d=>{d.preventDefault(),Go.active=!0;let f=d.clientX<innerWidth*.45?"move":"aim";if(fn[f])return;let p=$i("div","base",e),y=$i("div","knob"+(f==="aim"?" aim":""),e);fn[f]={id:d.pointerId,ox:d.clientX,oy:d.clientY,x:d.clientX,y:d.clientY,base:p,knob:y};try{e.setPointerCapture(d.pointerId)}catch{}pp(fn[f])}),e.addEventListener("pointermove",d=>{for(let f in fn){let p=fn[f];p&&p.id===d.pointerId&&(p.x=d.clientX,p.y=d.clientY,pp(p))}});let c=d=>{for(let f in fn){let p=fn[f];p&&p.id===d.pointerId&&(p.base.remove(),p.knob.remove(),fn[f]=null)}};e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c);let u=()=>{requestAnimationFrame(u);let d=h.S&&h.S.state==="play";if(e.style.display=d?"block":"none",o.style.display=h.S&&h.S.nades?"grid":"none",a.classList.toggle("ready",!!(h.officers&&h.officers.some(f=>f.ot>=100))),s.style.display=d&&innerHeight>innerWidth*1.1?"block":"none",!d){for(let f in fn)fn[f]&&(fn[f].base.remove(),fn[f].knob.remove(),fn[f]=null);wn.spray=wn.melee=wn.dash=wn.nade=wn.ot=!1}};u()}function tu(i){if(!i)return{x:0,y:0,m:0};let e=(i.x-i.ox)/Zi,t=(i.y-i.oy)/Zi,n=Math.hypot(e,t);return n>1&&(e/=n,t/=n),{x:e,y:t,m:Math.min(1,n)}}function pp(i){let e=tu(i);i.base.style.left=i.ox+"px",i.base.style.top=i.oy+"px",i.knob.style.left=i.ox+e.x*Zi+"px",i.knob.style.top=i.oy+e.y*Zi+"px"}Go.read=function(){let i=tu(fn.move),e=tu(fn.aim),n=(a=>a.m<.15?{x:0,y:0}:a)(i),s=e.m>.25,r=wn.dash&&!fp;return fp=wn.dash,{mx:n.x,mz:n.y,ax:s?e.x:n.x,az:s?e.y:n.y,fire:s,spray:wn.spray,melee:wn.melee,dash:r,sprint:wn.dash,ot:wn.ot,nade:wn.nade}};mp&&D_();var ys=[{key:"lot",title:"Parking Lot, Shift Change",sub:"{hero} parks the lifted truck. Energy drink in hand. Bad feeling.",quota:45,live:60,rate:3,mix:{rat:7,gasser:1.5,diva:.6,crutch:.5},tacos:3,drinks:2,call:"STAFF ASSAULT, STAFF PARKING LOT! ALL AVAILABLE STAFF RESPOND!",rung:0,prea:!0,units:["STAFF PARKING LOT","SALLY PORT","MEDICAL","WILLIAMS UNIT"],lines:[[1,"SERGEANT","Morning, {hero}. Quick heads up: they are in the parking lot."],[7,"{HERO}","I have not even clocked in."],[14,"SERGEANT","Spray them, baton them, and sign the overtime sheet."],[26,"{bernardo}","Hey {hero}, you wanna see how big my truck is? After this. Definitely after this."],[40,"COMPLIANCE","Reminder: your PREA training is overdue. Please complete it during the riot. Yes, the whole damn thing. Yes, the quiz too."]]},{key:"tier",title:"IMU North",sub:"Keys. Energy drinks. A tier full of opinions.",quota:80,live:85,rate:2.8,mix:{rat:5,gasser:2,shank:2,big:.8,diva:1.3,ding:1,wheel:.6,crutch:.8},cells:!0,tacos:3,drinks:3,call:"STAFF ASSAULT, IMU NORTH! STAFF ASSAULT, IMU NORTH! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:2,prea:!0,units:["IMU NORTH","IMU SOUTH","WILLIAMS UNIT","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, the food port is not a suggestion box."],[6,"RADIO",'Control just popped every door in IMU North. Control says "my bad."'],[15,"{caleb}","What's up bro. I'm on my taco break. I'll swing through when I'm done."],[24,"SERGEANT","Watch the cups. Do NOT ask what is in the cups."],[30,"COMPLIANCE","An inmate in IMU North has asked what PREA stands for. Please respond with the full 64-page answer."],[38,"COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one with blood AND piss on it. Initial here, here, and here."],[52,"{dustin}","Cell 14 says your football team is trash. Cell 14 is correct."]]},{key:"yard",title:"The Yard",sub:"Rec time. The weight pit regulars do NOT like being interrupted mid-set.",quota:75,live:75,rate:2.7,mix:{rat:4,big:1.6,cholo:1.2,shank:1.5,gasser:1,wheel:1.2,crutch:1,diva:.8},tacos:3,drinks:3,call:"STAFF ASSAULT, REC YARD! STAFF ASSAULT, WEIGHT PIT! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:1,prea:!0,units:["REC YARD","WEIGHT PIT","IMU SOUTH","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, yard is hot. Do not touch anybody's bench. Do not ask how much they bench. They will tell you."],[9,"RADIO","Tower One reports a fight at the chest press. Tower One is also eating nachos."],[18,"{caleb}","Bro, who left 405 on the bench? Oh wait. Me. That was me."],[30,"COMPLIANCE","Reminder: spotting an inmate requires a signed consent form, two witnesses, and a notary. Do not touch his hips."],[44,"RADIO",'Somebody on the pull-up bar has been "almost done" for forty minutes.'],[58,"{dustin}","That dude in the wheelchair just lapped me. Twice."]]},{key:"night",title:"Lights Out",sub:"IMU North, 0300. Count time. Bring your flashlight and change your underwear.",quota:60,live:45,rate:2,mix:{rat:4,ding:2.5,shank:2,crutch:1,wheel:.7,big:.6},cells:!0,tacos:3,drinks:2,call:"STAFF ASSAULT, IMU NORTH! POWER IS DOWN! ALL STAFF RESPOND WITH LIGHTS!",rung:2,prea:!0,night:!0,units:["IMU NORTH","IMU SOUTH","THE BAR UNITS"],lines:[[2,"SERGEANT","{hero}, generator is down. Facilities duct-taped a flashlight to your gun. Every shot lights them up and burns their eyes."],[10,"RADIO","Count is not clearing. Somebody is hiding. Flash every corner."],[22,"COMPLIANCE","Shining a light into a cell after 2300 requires a Nighttime Illumination Disclosure form. In triplicate. In the dark."],[36,"{caleb}","Bro, I am NOT scared. That was a different noise. That was my knee."],[50,"RADIO","Something in the laundry cart just moved. Nobody check the laundry cart."]]},{key:"graveyard",title:"Graveyard Shift",sub:"Staff lot, 0300. Sodium lights are dead. Somebody\u2019s truck alarm will not stop. Something is under the trucks.",quota:60,live:50,rate:2.1,mix:{rat:4,ding:2,shank:2,crutch:1,gasser:1,big:.7},tacos:3,drinks:3,call:"STAFF ASSAULT, STAFF PARKING LOT! LOT LIGHTS ARE DOWN! RESPOND WITH LIGHTS!",rung:2,prea:!0,night:!0,music:"night",units:["STAFF PARKING LOT","SALLY PORT","MEDICAL"],lines:[[2,"SERGEANT","{hero}, lot lights are down and half of B-pod is hiding under the trucks. Flash under every truck."],[11,"RADIO","Whose truck alarm is that. Whose. Truck. Alarm. Is. That."],[24,"{bernardo}","If anybody scratches my truck in the dark I am filing a PREA. On the TRUCK\u2019S behalf."],[38,"COMPLIANCE","Reminder: parking lot incidents after 0000 require the Nighttime Vehicle Proximity Form. It is in the lot. In the dark."],[52,"{caleb}","Bro I parked RIGHT here. Where is my truck. Bro. BRO."]]},{key:"blackout",title:"Blackout: The Yard",sub:"The whole grid is down. You can hear plates clanking in the weight pit. You cannot see who is lifting them.",quota:70,live:55,rate:2.2,mix:{rat:3,big:2,cholo:1.5,shank:2,ding:1.5,wheel:1,crutch:1},tacos:3,drinks:3,call:"STAFF ASSAULT, REC YARD! TOTAL BLACKOUT! ALL STAFF RESPOND WITH LIGHTS!",rung:3,crews:1,prea:!0,night:!0,music:"night",units:["REC YARD","WEIGHT PIT","THE BAR UNITS"],lines:[[2,"SERGEANT","{hero}, total blackout on the yard. Tower can\u2019t see. We can\u2019t see. They CAN see. Light everything up."],[12,"RADIO","Somebody just benched 405 in the pitch dark. That is not a normal sound."],[26,"{dustin}","You wanna fuck on me? In the DARK? Bold. Very bold."],[40,"COMPLIANCE","Yard blackout protocol requires a headcount. Please count every inmate by touch. Do not touch them."],[55,"RADIO","Generator is back in five minutes. Facilities said that an hour ago."]]},{key:"row",title:"Supermax: Killer Row",sub:"The famous ones live here. Do not chat. Do not buy the paintings.",quota:70,live:70,rate:2.6,mix:{ding:4,rat:2,shank:2,big:1,gasser:1},cells:!0,tacos:4,drinks:3,call:"STAFF ASSAULT, SUPERMAX! STAFF ASSAULT, KILLER ROW! ALL STAFF RESPOND!",rung:3,crews:1,prea:!0,units:["SUPERMAX","KILLER ROW","THE BAR UNITS","IMU SOUTH"],boss:"ripper",bossAt:.35,lines:[[2,"SERGEANT","{hero}, Killer Row. Stay off the glass, stay off the intercom, and do NOT let them flatter you."],[12,"{halley}","Keep your eyes up, family. The mist plays tricks down here."],[26,"COMPLIANCE","Reminder: serial killers are still entitled to PREA training. They all passed. You failed it twice, dumbass. Retake it Monday."],[44,"RADIO","Somebody on the row ordered forty soups and a clown painting. Commissary says no."]]}];var at=i=>document.getElementById(i),P=h.S={state:"menu",level:0,kills:0,time:0,hitStop:0,hpMul:1,dmgMul:1},lr=new URLSearchParams(location.search),Ji=parseInt(lr.get("stress")||"0",10)||0;h.R.init(at("game"));h.FX.init(h.R.scene);h.AI.init(h.R.scene);h.C.init(h.R.scene);var _p=new Oo(h.R.scene,520);h.W.load("lot","Rookie");for(let i=0;i<24;i++)h.AI.spawn(h.pick(["rat","rat","gasser","diva","big"]),h.rand(10,78),h.rand(10,56));var _s=Object.assign({name:"",gender:"male"},h.store.get("mo_player",{}));at("nameIn").value=_s.name;function cr(i,e,t){let n=at(i),s=r=>{for(let a of n.children)a.classList.toggle("on",a.dataset.v===String(r))};s(e),n.addEventListener("click",r=>{let a=r.target.closest("button");a&&(s(a.dataset.v),t(a.dataset.v))})}cr("segGender",_s.gender,i=>{_s.gender=i});cr("segQuality",h.settings.quality,i=>{h.settings.quality=i,h.saveSettings(),h.R.applyQuality(i)});cr("segGore",h.settings.gore?1:0,i=>{h.settings.gore=i==="1",h.saveSettings()});cr("segPace",String(h.settings.pace||.8),i=>{h.settings.pace=parseFloat(i),h.saveSettings()});cr("segAudio",h.settings.audio||(h.settings.muted?"off":"all"),i=>h.audio.setMode(i));cr("segCuss",h.settings.cuss?1:0,i=>{h.settings.cuss=i==="1",h.saveSettings()});at("startBtn").addEventListener("click",lu);at("nameIn").addEventListener("keydown",i=>{i.key==="Enter"&&lu()});function N_(){let i=up(),e=eu(0),t=!1;return{kind:"hybrid",noPad:!1,usesPad(n){return n===0&&!this.noPad},read(n){if(h.Touch.active)return h.Touch.read(n);if(this.noPad)return i.read(n);let s=e.read(n);(Math.abs(s.mx)+Math.abs(s.mz)>0||s.fire||s.spray||s.melee||s.dash)&&(t=!0);let r=i.read(n);return(h.Input.mouse.l||h.Input.mouse.r||Math.abs(r.mx)+Math.abs(r.mz)>0)&&(t=!1),t?s:r}}}function lu(){h.audio.init(),_s.name=h.cleanName(at("nameIn").value),h.store.set("mo_player",_s);for(let i of h.officers)i.remove();h.officers.length=0,h.officers.push(new jr(0,_s.name,_s.gender,N_())),P.runKills=0,P.rung=-1,P.ammo={},P.gun=null,P.startLevelIdx=Math.max(0,Math.min(ys.length-1,parseInt(lr.get("level")||"1",10)-1)),at("menu").classList.add("hidden"),at("hud").classList.remove("hidden"),bp(),ta(P.startLevelIdx||0)}var Ki={},gp=["Rodriguez","Johnson","Nguyen","Martinez","Thompson","Garcia","Williams","Reyes"];function U_(i){return h.officers.some(e=>e.device.kind==="pad"&&e.device.index===i||e.device.usesPad&&e.device.usesPad(i))}function O_(){let i=h.pads();for(let e=0;e<i.length;e++){let t=i[e];if(!t)continue;let n=!!(t.buttons[0]&&t.buttons[0].pressed||t.buttons[9]&&t.buttons[9].pressed),s=n&&!Ki[e];if(Ki[e]=n,!s||h.officers.length>=4||e===0&&h.officers[0].device.usesPad&&!(h.Input.keys.size||h.Input.mouse.l)||U_(e)&&!(e===0&&h.officers[0].device.usesPad))continue;e===0&&(h.officers[0].device.noPad=!0);let r=h.officers.length,a=h.officers[0],o=new jr(r,gp[Math.random()*gp.length|0],r%2?"female":"male",eu(e));o.x=a.x+1.2,o.z=a.z+.8,h.officers.push(o),bp(),h.FX.float(o.x,2.8,o.z,`${h.rankName(o).toUpperCase()} CLOCKED IN`,"#"+h.PCOLORS[r].toString(16).padStart(6,"0"),20,2.2),jt("CONTROL",`${h.rankName(o)} is on the tier. The DOC family grows.`,3)}}function k_(i){for(let e of h.officers){if(!e.down)continue;let t=h.officers.find(n=>!n.down&&(n.x-e.x)**2+(n.z-e.z)**2<2.6);t?(e.reviveT+=i,Math.random()<i*4&&h.FX.float(e.x,2.2,e.z,`PICKING UP ${e.name.toUpperCase()}... ${Math.round(e.reviveT*50)}%`,"#7dff6a",14,.5),e.reviveT>=2&&(e.down=!1,e.hp=e.maxHp*.5,e.iframes=1.5,e.reviveT=0,h.FX.float(e.x,2.6,e.z,"BACK UP! DOC FAMILY!","#7dff6a",20,1.6),t.score+=50)):e.reviveT=Math.max(0,e.reviveT-i)}}function ta(i){P.level=i;let e=P.def=Object.assign({},ys[i]);Ji&&Object.assign(e,{quota:1e9,live:Ji,rate:80}),h.FX.reset(),h.AI.reset(),h.C.reset(),Zn.reset(),Yn.reset(),h.Boss.reset();let t=h.W.load(e.key,h.officers[0].name);h.officers.forEach((s,r)=>{s.reset(),s.x=t.start[0]+r*1.2,s.z=t.start[1]}),h.R.camTarget.set(t.start[0],0,t.start[1]),Object.assign(P,{state:"play",kills:0,prea:0,lootWait:0,lootLeft:0,wrangleT:0,wrangleSaid:!1,spawned:0,spawnAcc:0,time:0,doorT:3,radioT:14,lineIdx:0,radio:null,clearT:0,downT:0,halleyUsed:!1,ricardoUsed:!1,ricardoT:lr.has("ricardo")?3:0,crewT:h.rand(22,35),assaultT:30,compT:vs?5:Math.random()<.45?h.rand(60,120):0,compDone:0,compFirst:null,compLive:!1,compMissed:!1,compromised:0,compNames:[],bossSpawned:!1,bossDead:!1,slowmo:0,killerT:8}),h.W.alarm=e.cells?1:0,Mp(!1);let n=()=>{for(let s=0;s<40;s++){let r=h.rand(4,t.w*2-4),a=h.rand(4,t.h*2-4);if(!h.W.blocked(r,a)&&!h.W.wallAt(r,a))return[r,a]}return t.start};for(let s=0;s<e.tacos;s++)h.C.spawnPickup("taco",...n());for(let s=0;s<e.drinks;s++)h.C.spawnPickup("drink",...n());for(let s=0;s<2;s++)h.C.spawnPickup("zyn",...n());h.C.spawnPickup("chew",...n()),h.C.spawnPickup("ammo",...n()),P.power=null,P.powerDrop=!1,Yn.spawn(Fo(0),...Vo(n,t));for(let s=0;s<(e.crews||0);s++){let[r,a]=Vo(n,t);h.AI.spawnCrew(r,a,4),P.spawned+=4}if(e.prea){let[s,r]=Vo(n,t);h.AI.spawn("prea",s,r),P.spawned++}if(t.lifters)for(let[s,r]of t.lifters){let a=h.AI.spawn(h.pick(["big","big","cholo","rat"]),s,r+.9);a.x=s,a.z=r+.9,a.posted=!0,a.crew="weightpit",a.shirtless=!0,a.yaw=Math.PI,P.spawned++}if(t.scares)for(let s of t.scares)s.done=!1;if(["lot","yard","night"].includes(e.key)&&!h.store.get("sa_gold",[]).includes(e.key)&&h.C.spawnPickup("gold",...Vo(n,t)),h.store.get("sa_bigbro",!1)&&setTimeout(()=>{if(P.state==="play"&&Zn.call("caleb")){let s=h.allies.find(r=>r.key==="caleb");s&&(s.t=1e9)}},4e3),t.caged){let s=Math.floor(t.caged.length/2)-2;Df.forEach((r,a)=>{let o=t.caged[s+a],l=h.AI.spawn("killer",(o.i+1)*2,o.j*2+1);Object.assign(l,{caged:!0,killer:r,suit:r.suit,skin:r.skin,hair:r.hair,style:r.style,face:r.face,itemCol:r.item||0,hairOn:!0,x:(o.i+1)*2,z:o.j*2+1,chatT:h.rand(2,8)})})}Ms(e.call?"STAFF ASSAULT":e.title,e.title+" \xB7 "+h.t(e.sub,h.officers[0].name),!!e.call,3600),e.call&&(jt("CONTROL",e.call,3.6),na(6)),ji(`Gear: ${$n[P.gun].label} + ${Ti[P.spray].label}${matchMedia("(pointer: coarse)").matches?"":" \xB7 Click the weapon bar or press 1-6 to switch"}`),Zo(),h.levelMusic(),h.R.precompile()}function Vo(i,e){for(let t=0;t<30;t++){let n=i();if((n[0]-e.start[0])**2+(n[1]-e.start[1])**2>196)return n}return i()}function iu(i){let e=0;for(let n in i)e+=i[n];let t=Math.random()*e;for(let n in i)if(t-=i[n],t<=0)return n;return"rat"}function z_(i){if(P.spawned<P.def.quota&&P.kills<P.def.quota||(P.wrangleT=(P.wrangleT||0)-i,P.wrangleT>0))return;P.wrangleT=1;let e=h.officers.filter(n=>!n.down);if(!e.length)return;let t=0;for(let n of h.AI.list){if(n.dead||n.caged||n.boss)continue;let s=e.some(o=>(o.x-n.x)**2+(o.z-n.z)**2<64),r=Math.hypot(n.x-(n.wx??n.x+99),n.z-(n.wz??n.z));if(n.wx=n.x,n.wz=n.z,n.stuckT=s?0:r<1.2?(n.stuckT||0)+1:Math.max(0,(n.stuckT||0)-1),n.stuckT<4)continue;let a=h.pick(e);for(let o=0;o<30;o++){let l=Math.random()*Math.PI*2,c=h.rand(6,10),u=a.x+Math.sin(l)*c,d=a.z+Math.cos(l)*c;if(!(h.W.blocked(u,d)||!h.W.los(a.x,a.z,u,d))){h.FX.cloud(n.x,1,n.z,0,0,1,9080726),n.x=u,n.z=d,n.vx=n.vz=0,n.posted=!1,n.freezeT=0,n.stuckT=0,n.wx=u,n.wz=d,h.FX.cloud(u,1,d,0,0,1.2,9080726),h.FX.float(u,2.6,d,"EXTRACTED!","#ffcf4a",18,1.6),t++;break}}}t&&!P.wrangleSaid&&(P.wrangleSaid=!0,h.say("CONTROL",h.pick(["We pulled the last one out of his cell. He is coming to you.","Cell extraction complete. Your straggler is incoming.","Found him hiding under his bunk. Sending him out."]),3))}h.rankName=i=>`${hi[Math.max(0,P.rung??0)].rank} ${i.name}`;function Mp(i){let e=P.def.rung||0;hi.forEach((o,l)=>{(P.runKills||0)>=o.at&&(e=Math.max(e,l))});let t=P.rung??-1;P.rung=Math.max(t,e);let n=hi[P.rung],s=(P.owned||[]).length;if(P.owned=[...new Set(hi.slice(0,P.rung+1).map(o=>o.gun))],P.ownedSpray=[...new Set(hi.slice(0,P.rung+1).map(o=>o.spray))],(!P.gun||!P.owned.includes(P.gun)||i&&P.owned.length>s)&&(P.gun=n.gun),(!P.spray||!P.ownedSpray.includes(P.spray)||i&&P.rung!==t)&&(P.spray=n.spray),P.nades=n.nades,$o.dirty=!0,!i||P.rung===t||t<0)return;let r=h.officers[0]?h.officers[0].name:"Rookie";if(n.rank!==hi[t].rank){Ms("PROMOTED",`${n.title.toUpperCase()} ${r.toUpperCase()}`,!1,2600),h.audio.play("win");for(let o of h.officers)o.down||h.FX.float(o.x,3,o.z,`${n.rank} ${o.name}!`,"#ffcf4a",22,2.2)}else h.audio.play("pickup");jt("CONTROL",h.t(n.news||"",r),4),ji(`NEW GEAR: ${$n[n.gun].label} + ${Ti[n.spray].label}${n.nades?" + Grenades (Q / Y / NADE)":""}`)}h.onKill=()=>{P.runKills=(P.runKills||0)+1,Mp(!0)};h.showCard=(...i)=>Ms(...i);function Ms(i,e,t,n){at("lvlT").textContent=i,at("lvlT").classList.toggle("alarm",!!t),at("lvlS").textContent=e,at("levelcard").classList.add("show"),clearTimeout(Ms.h),Ms.h=setTimeout(()=>at("levelcard").classList.remove("show"),n)}function na(i){h.W.alarmT=i,h.audio.play("siren"),h.audio.sting("assault"),document.body.classList.add("assault"),clearTimeout(na.h),na.h=setTimeout(()=>document.body.classList.remove("assault"),i*1e3*.7)}h.levelMusic=function(){if(h.officers.some(i=>i.otT>0))return h.audio.music("overtime",!0);if(h.Boss.active&&!h.Boss.active.dead)return h.audio.music("boss",!0);h.audio.music(P.def?P.def.music||P.def.key:"menu")};function F_(i){if(P.moodT=(P.moodT||0)-i,P.scareMusT=(P.scareMusT||0)-i,P.moodT>0)return;P.moodT=.5;let e=0;for(let n of h.AI.list)if(!(n.dead||n.caged||n.posted)){for(let s of h.officers)if(!s.down&&(n.x-s.x)**2+(n.z-s.z)**2<144){e++;break}}let t=h.W.alarmT>0||e>=14||P.scareMusT>0||h.officers.some(n=>n.down);h.audio.intensity(t?2:e>=3?1:0),h.audio.musicName()==="boss"&&(!h.Boss.active||h.Boss.active.dead)&&h.levelMusic()}var B_=[{what:"laundry",type:"ding",text:"OUT OF THE LAUNDRY CART!",line:"He has been in the laundry cart since TUESDAY."},{what:"vent",type:"crutch",text:"FROM THE CEILING VENT!",line:"How did he get in the vent with a CRUTCH?!"},{what:"mannequin",type:"rat",text:"THE DUMMY MOVED!",line:"That is not the count dummy. That is NOT the count dummy."},{what:"bunk",type:"shank",text:"UNDER THE BUNK!",line:"He was under the bunk. The whole time. Breathing."},{what:"chair",type:"wheel",text:"WHEELCHAIR IN THE DARK!",line:"You hear wheels. Slowly. Getting closer."}];function H_(i){let e=h.W.def;if(!(!e||!e.scares)){for(let t of e.scares){if(t.done)continue;let n=h.officers.find(c=>!c.down&&(c.x-t.x)**2+(c.z-t.z)**2<12);if(!n)continue;t.done=!0;let s=h.pick(B_),r=Math.atan2(n.ax,n.az)+h.rand(-.6,.6),a=n.x+Math.sin(r)*2.2,o=n.z+Math.cos(r)*2.2,l=h.AI.spawn(s.type,h.W.blocked(a,o)?t.x:a,h.W.blocked(a,o)?t.z:o);if(P.spawned++,s.what==="vent"&&(l.hop=2.6,l.vy=0),l.swingCD=.6,l.scareT=1.5,h.FX.float(l.x,2.8,l.z,s.text,"#ff4040",26,1.6),h.R.shake=.9,h.R.split=1,h.R.flashBoost=1,h.audio.play("scare",1),h.audio.intensity(2),P.scareMusT=6,Math.random()<.5)l.countCheck=!0,jt("CONTROL","TIER CHECK! Flash him to clear count! "+s.line,3);else{jt("RADIO",s.line+" He brought friends.",3);for(let c=0;c<3;c++){let u=h.rand(0,h.TAU),d=h.AI.spawn(h.pick(["rat","ding","shank"]),t.x+Math.cos(u)*4,t.z+Math.sin(u)*4);d.x=h.W.blocked(d.x,d.z)?t.x:d.x,d.z=h.W.blocked(d.x,d.z)?t.z:d.z,P.spawned++}}}for(let t of h.AI.list)if(!(!t.countCheck||t.dead))if(t.scareT-=i,t.flashedT>0){t.countCheck=!1,h.FX.float(t.x,2.8,t.z,"COUNT CLEARS! +150","#7dff6a",22,1.6);let n=h.officers.find(s=>!s.down);h.AI.damage(t,9999,n?n.x:t.x,n?n.z:t.z,3,"flash",n||null),n&&(n.score+=150),h.audio.play("count")}else t.scareT<=0&&(t.countCheck=!1,jt("CONTROL","Count did NOT clear. He is loose. Get him.",2.5))}}function G_(i){let e=P.def;if(Ji||P.spawned>=e.quota||!e.units||(P.assaultT-=i,P.assaultT>0))return;P.assaultT=h.rand(40,55);let t=h.pick(e.units),n=/BAR/.test(t);jt("CONTROL",`STAFF ASSAULT, ${t}! STAFF ASSAULT, ${t}! ALL AVAILABLE STAFF RESPOND!`,3.8),Ms("STAFF ASSAULT",t,!0,2600),na(7),n&&setTimeout(()=>{P.state==="play"&&jt("RADIO",h.pick(Of),3.5)},4e3);let s=h.W.doors.filter(l=>!l.opening);for(let l=0;l<2&&s.length;l++)h.W.openDoor(s.splice(h.randi(0,s.length-1),1)[0]);let r=h.W.spawns.concat(h.W.doors.filter(l=>l.opening).map(l=>l.spawn)),a=r.filter(l=>h.officers.every(c=>(c.x-l.x)**2+(c.z-l.z)**2>64)),o=h.randi(8,14);for(let l=0;l<o&&P.spawned<e.quota&&h.AI.liveCount()<e.live+12;l++){let c=h.pick(a.length?a:r);if(!c)break;h.AI.spawn(n&&Math.random()<.75?"ding":iu(e.mix),c.x+h.rand(-.6,.6),c.z+h.rand(-.6,.6)),P.spawned++}}var vs=lr.has("both")?"both":lr.has("caughren")?"caughren":lr.has("bingham")?"bingham":null;function V_(i){if(Ji||!P.compT)return;let e=h.allies.filter(c=>c.passive);if(P.compLive){if(P.compRumorT-=i,P.compRumorT<=0&&e.some(c=>c.state==="cuddle")){P.compRumorT=h.rand(2.5,4);let c=h.AI.list.find(u=>!u.dead&&!u.bf&&Math.random()<.3);c?h.FX.float(c.x,2.8,c.z,h.pick(qf.concat(e.map(u=>`${u.d.back==="COUNSELOR"?"BINGHAM":"CAUGHREN"}! ${u.d.back==="COUNSELOR"?"BINGHAM":"CAUGHREN"}!`))),"#ffb37a",15,2):jt("RADIO",h.pick(Gh),2.5)}if(P.compWait-=i,P.compWait<=0)for(let c of e)c.state==="cuddle"&&(c.walkOut("I was never here."),P.compMissed=!0);e.length||(P.compLive=!1);return}if(P.compT-=i,P.compT>0)return;if(P.compT=P.compDone>=2?0:h.rand(70,110),!vs&&P.compDone>=1&&Math.random()<.5){P.compT=0;return}let t=P.compDone===0&&(vs==="both"||!vs&&Math.random()<.15)?["caughren","bingham"]:[vs&&vs!=="both"&&P.compDone===0?vs:P.compFirst?P.compFirst==="caughren"?"bingham":"caughren":h.pick(["caughren","bingham"])];P.compFirst=P.compFirst||t[0],P.compDone+=t.length;let n=h.W.doors.filter(c=>!c.opening),s=n.length?h.pick(n):null,r=h.W.spawns.filter(c=>h.officers.every(u=>(u.x-c.x)**2+(u.z-c.z)**2>100)),a=s?s.spawn:h.pick(r.length?r:h.W.spawns);if(!a)return;s&&h.W.openDoor(s);let o=s?`CELL ${h.randi(10,48)}`:t.length>1?"THE CHAPLAIN'S CLOSET":t[0]==="bingham"?"COUNSELOR'S OFFICE":"THE SUPPLY CLOSET";t.forEach((c,u)=>{let d=a.x+(u?1.6:0),f=a.z,p=h.AI.spawn(h.pick(["big","cholo","rat"]),d+.42,f);p.bf=!0,p.freezeT=999,p.hp*=2.5,p.maxHp=p.hp;let y=Zn.call(c,d-.05,f);y&&(y.bf=p)}),P.compLive=!0,P.compWait=40,P.compRumorT=3;let l=t.map(c=>h.CREW[c].toUpperCase()).join(" AND ");jt("CONTROL",t.length>1?`ALL STAFF RESPOND, ${o}. ${l} ARE BOTH IN THERE. TOGETHER. WITH HIM.`:t[0]==="caughren"?`ALL AVAILABLE STAFF RESPOND TO ${o}. C/O CAUGHREN IS NOT ANSWERING HER RADIO. AGAIN.`:`RESPOND TO ${o}. COUNSELOR BINGHAM HAS BEEN IN A 'ONE-ON-ONE' FOR THREE HOURS.`,4.2),Ms("STAFF COMPROMISED",`${o} \xB7 ${l}`,!0,3200),na(5),setTimeout(()=>{P.state==="play"&&jt("RADIO",h.pick(Gh),3)},4600)}function W_(i){let e=P.def,t=h.AI.liveCount();if(e.cells&&(P.doorT-=i,P.doorT<=0&&P.spawned<e.quota)){P.doorT=h.rand(1.5,3);let s=h.W.doors.filter(r=>!r.opening);if(s.length){let r=h.pick(s);h.W.openDoor(r);let a=h.randi(1,2);for(let o=0;o<a&&P.spawned<e.quota;o++)h.AI.spawn(iu(e.mix),r.spawn.x,r.spawn.z),P.spawned++}}if(P.spawned>=e.quota||t>=e.live)return;P.spawnAcc+=i*e.rate*(Ji?1:Math.min(1.6,.7+P.time/60));let n=h.W.spawns.concat(h.W.doors.filter(s=>s.open>=1).map(s=>s.spawn));for(;P.spawnAcc>=1&&P.spawned<e.quota&&h.AI.liveCount()<e.live;){P.spawnAcc-=1;let s=n.filter(a=>h.officers.every(o=>(o.x-a.x)**2+(o.z-a.z)**2>64)),r=h.pick(s.length?s:n);if(!r)break;h.AI.spawn(iu(e.mix),r.x,r.z),P.spawned++}}h.targets=[];function X_(){if(P.powerDrop||P.kills<P.def.quota*.4)return;P.powerDrop=!0;let i=h.officers.find(e=>!e.down)||h.officers[0];for(let e=0;e<20;e++){let t=Math.random()*h.TAU,n=i.x+Math.cos(t)*6,s=i.z+Math.sin(t)*6;if(!h.W.blocked(n,s)){h.C.spawnWeapon(n,s);break}}jt("CONTROL","Armory dropped something heavy on the floor near you. Look for the pink light. Go HAM.",3.6)}function q_(i){if(X_(),!P.halleyUsed&&h.officers.some(t=>t.down||t.hp<25)&&(P.halleyUsed=!0,Zn.call("halley")),P.ricardoT>0&&(P.ricardoT-=i)<=0&&(P.ricardoUsed=!0,Zn.call("ricardo")),P.calebSwarmCD=(P.calebSwarmCD||0)-i,P.calebSwarmCD<=0&&!h.allies.some(t=>t.key==="caleb"))for(let t of h.officers){if(t.down)continue;let n=0;for(let s of h.AI.list)!s.dead&&!s.caged&&(s.x-t.x)**2+(s.z-t.z)**2<36&&n++;if(n>=12){P.calebSwarmCD=45,Zn.call("caleb");break}}if(P.crewT-=i,P.crewT<=0)if(P.crewT=h.rand(35,55),!P.ricardoUsed&&Math.random()<.12)P.ricardoUsed=!0,Zn.call("ricardo");else{let t=["caleb","dustin"].filter(n=>!h.allies.some(s=>s.key===n));t.length&&Zn.call(h.pick(t))}let e=P.def;if(e.boss&&!P.bossSpawned&&P.kills>=e.quota*e.bossAt){P.bossSpawned=!0;let t=h.W.doors.find(n=>!n.opening)||h.W.doors[0];if(t)h.W.openDoor(t),h.Boss.spawn(t.spawn.x,t.spawn.z);else{let n=h.pick(h.W.spawns);h.Boss.spawn(n.x,n.z)}}}function jt(i,e,t=4){let n=h.officers[0]?h.officers[0].name:"Rookie";P.radio={t},at("radWho").textContent=h.t(i,n),at("radTxt").textContent=h.censor(h.t(e,n)),at("radio").classList.add("show"),h.audio.play("radio")}h.say=jt;function Y_(i){let e=P.def.lines;if(P.radio&&(P.radio.t-=i,P.radio.t<=0&&(P.radio=null,at("radio").classList.remove("show"))),P.lineIdx<e.length&&P.time>=e[P.lineIdx][0]&&!P.radio){let[,t,n]=e[P.lineIdx++];jt(t,n),P.radioT=Math.max(P.radioT,10);return}if(P.def.key==="row"){P.killerT-=i;let t=h.AI.list.filter(n=>n.caged);if(P.killerT<=0&&!P.radio&&t.length){P.killerT=h.rand(9,15);let n=h.pick(t).killer;jt(`INTERCOM \xB7 ${n.name}`,h.pick(n.lines),4);return}for(let n of t){if(n.chatT-=i,n.chatT>0)continue;h.officers.some(r=>!r.down&&(r.x-n.x)**2+(r.z-n.z)**2<49)?(n.chatT=h.rand(6,10),h.FX.float(n.x,2.4,n.z,`${n.killer.name}: ${h.pick(n.killer.lines)}`,"#9fe6b8",14,3)):n.chatT=1}}if(P.radioT-=i,P.radioT<=0&&!P.radio){P.radioT=h.rand(16,26);let[t,n]=h.pick(wf);jt(t,n)}}var su=[];function bp(){let i=at("players");i.textContent="",su.length=0;for(let e of h.officers){let t=document.createElement("div");t.className="pcard",t.style.borderLeftColor="#"+h.PCOLORS[e.slot].toString(16).padStart(6,"0");let n=document.createElement("div");n.className="nm";let s=document.createElement("span");s.textContent=h.rankName(e).toUpperCase();let r=document.createElement("span");n.append(s,r);let a=document.createElement("div");a.className="bar hp",a.append(document.createElement("i"));let o=document.createElement("div");o.className="bar en",o.append(document.createElement("i"));let l=document.createElement("div");l.className="bar ot",l.append(document.createElement("i"));let c=document.createElement("div");c.className="buffs";let u=document.createElement("div");u.className="gear",t.append(n,a,o,l,c,u),i.append(t),su.push({o:e,name:s,score:r,hp:a.firstChild,en:o.firstChild,ot:l.firstChild,bf:c,gear:u,gearKey:""})}}var Wo=0,nu=0,Xo=60,qo=0;function $_(i){$o();for(let s of su){s.hp.style.width=s.o.hp/s.o.maxHp*100+"%",s.en.style.width=s.o.energy+"%",s.ot.style.width=(s.o.otT>0?s.o.otT/12*100:s.o.ot||0)+"%",s.ot.parentNode.classList.toggle("full",s.o.ot>=100||s.o.otT>0),s.score.textContent=s.o.score+" pts";let r=h.rankName(s.o).toUpperCase();s.name.textContent!==r&&(s.name.textContent=r);let a=[];s.o.otT>0?a.push(`MANDATORY OVERTIME ${Math.ceil(s.o.otT)}s`):s.o.ot>=100&&a.push(s.o.device.kind==="pad"?"OVERTIME READY [B]":s.o.device.kind==="kbm"?"OVERTIME READY [F]":"OVERTIME READY [OT]"),s.o.sprinting&&a.push("SPRINT"),s.o.tacoT>0&&a.push(`TACO POWER ${Math.ceil(s.o.tacoT)}s`),s.o.drinkT>0&&a.push(`ENERGY ${Math.ceil(s.o.drinkT)}s`),s.o.zynT>0&&a.push(`ZYN HEAT ${Math.ceil(s.o.zynT)}s`),s.o.slowT>0&&a.push("GASSED"),s.o.rallyT>0&&a.push(`RALLY ${Math.ceil(s.o.rallyT)}s`),s.o.down&&a.push("DOWN"),s.bf.textContent=a.join(" \xB7 ");let o=Object.values(s.o.gear).map(l=>l?l.name+l.rarity:"-").join("|");if(o!==s.gearKey){s.gearKey=o,s.gear.textContent="";for(let l of Object.keys(ai)){let c=s.o.gear[l],u=document.createElement("span");u.className="chip",u.textContent=c?c.name:`no ${ai[l].label.toLowerCase()}`,u.title=c?`${dn[c.rarity].label} \xB7 ${Jh(c)}`:"Find gear on the map",c&&(u.style.borderColor=dn[c.rarity].css,u.style.color=dn[c.rarity].css),s.gear.append(u)}}}let e=h.Boss.active;at("bossbar").classList.toggle("hidden",!e||e.dead),e&&!e.dead&&(at("bossFill").style.width=Math.max(0,e.hp)/e.maxHp*100+"%"),at("joinHint").classList.toggle("hidden",h.officers.length>=4||!dp().length),at("objT").textContent=P.def.title.toUpperCase();let t=Math.max(0,P.def.quota-P.kills);at("objC").textContent=Ji?`STRESS TEST \xB7 ${h.AI.liveCount()} live`:t>0?`${P.kills} / ${P.def.quota} inmates down`:P.lootLeft>0?`Grab your gear! Clocking out in ${P.lootLeft}s`:`Clear the stragglers: ${h.AI.liveCount()} left`;let n=Math.max(...h.officers.map(s=>s.hurtT));if(at("vignette").style.opacity=Math.min(1,n*2.2+(h.officers.some(s=>!s.down&&s.hp<30)?.35:0)),Wo+=i,nu++,Wo>=.5){Xo=Math.round(nu/Wo),Wo=0,nu=0,at("fps").textContent=`${Xo} FPS \xB7 ${h.R.qName.toUpperCase()}${h.R.dyn<1?" "+Math.round(h.R.dyn*100)+"%":""} \xB7 ${h.AI.liveCount()} inmates`,Ji||h.R.tuneResolution(Xo,.5),qo=Xo<38&&h.R.dyn<=.6?qo+.5:0;let s=h.QUALITY_ORDER.indexOf(h.R.qName);qo>=4&&s>0&&!Ji&&(qo=0,h.R.applyQuality(h.QUALITY_ORDER[s-1]),ji(`Graphics lowered to ${h.R.qName} to keep it smooth`))}}h.toast=i=>ji(i);var ru=["pepperball","launcher","shotgun","ar"],wp=["oc","vapor"],xp={pepperball:"PEPPERBALL",launcher:"40MM",shotgun:"SHOTGUN",ar:"AR-15",oc:"ORANGE OC",vapor:"OC VAPOR"},yp=(i,e)=>(hi.find(t=>t[e]===i)||{}).at;function $o(){let i=at("wbar");if(i){if($o.dirty||!i.firstChild){$o.dirty=!1;let e=(t,n,s,r,a,o)=>`<button class="ws${a?"":" locked"}" data-kind="${n}" data-key="${s}"><span class="wk">${t}</span><span class="wn">${r}</span><span class="wl">${a?n==="gun"?'<i class="pips"></i>':"":"\u{1F512} "+o+" takedowns"}</span></button>`;i.innerHTML=ru.map((t,n)=>e(n+1,"gun",t,xp[t],(P.owned||[]).includes(t),yp(t,"gun"))).join("")+'<span class="wsep"></span>'+wp.map((t,n)=>e(n+5,"spray",t,xp[t],(P.ownedSpray||[]).includes(t),yp(t,"spray"))).join("")+`<span class="wsep"></span><button class="ws nade${P.nades?"":" locked"}" data-kind="nade"><span class="wk">Q</span><span class="wn">Grenades</span><span class="wl">${P.nades?"Right here!":"\u{1F512} Lieutenant"}</span></button><button class="ws power hidden" data-kind="power"><span class="wk">!</span><span class="wn"></span><span class="wl"></span></button>`}for(let e of i.children)if(e.dataset.kind==="gun"){e.classList.toggle("on",P.gun===e.dataset.key&&!P.power);let t=e.querySelector(".pips"),n=(P.ammo||{})[e.dataset.key]||0;t&&t.dataset.lv!==String(n)&&(t.dataset.lv=n,t.textContent=n?"\u2605".repeat(n)+" "+Ho[n].name:"Standard ammo")}else if(e.dataset.kind==="spray")e.classList.toggle("on",P.spray===e.dataset.key);else if(e.dataset.kind==="nade"){let t=h.officers[0];e.classList.toggle("cool",!!(t&&t.nadeCD>0))}else e.dataset.kind==="power"&&(e.classList.toggle("hidden",!P.power),P.power&&(e.children[1].textContent=$n[P.power.key].label,e.children[2].textContent=`GO HAM ${Math.ceil(P.power.t)}s`,e.style.setProperty("--p",P.power.t/P.power.max)))}}function Yo(i,e){if(P.state==="play"){if(i==="gun"&&(P.owned||[]).includes(e))P.gun!==e&&(P.gun=e,h.audio.play("pickup",.5));else if(i==="spray"&&(P.ownedSpray||[]).includes(e))P.spray=e;else if(i==="nade")P.nades?ji("Grenades: press Q (pad Y) to throw toward your aim."):ji("Grenades unlock at Lieutenant (130 takedowns).");else return;i!=="nade"&&h.FX.float(h.officers[0].x,2.7,h.officers[0].z,i==="gun"?$n[e].label:Ti[e].label,"#9fd0ff",16,1)}}function Z_(){let i=at("wbar");!i||i.dataset.init||(i.dataset.init=1,i.addEventListener("mousedown",e=>e.stopPropagation()),i.addEventListener("click",e=>{let t=e.target.closest(".ws");t&&Yo(t.dataset.kind,t.dataset.key)}),addEventListener("keydown",e=>{if(e.target instanceof HTMLInputElement)return;let t=parseInt(e.key,10);t>=1&&t<=4?Yo("gun",ru[t-1]):(t===5||t===6)&&Yo("spray",wp[t-5])}),addEventListener("wheel",e=>{if(P.state!=="play"||!(P.owned||[]).length)return;let t=ru.filter(s=>P.owned.includes(s)),n=t.indexOf(P.gun);Yo("gun",t[(n+(e.deltaY>0?1:-1)+t.length)%t.length])},{passive:!0}))}Z_();function ji(i){let e=at("toast");e.textContent=i,e.classList.add("show"),clearTimeout(ji.h),ji.h=setTimeout(()=>e.classList.remove("show"),2600)}function Kn(i,e,t,n,s){let r=at("panelCard");if(r.textContent="",s){let c=document.createElement("div");c.className="herostamp",c.textContent=s,r.append(c)}let a=document.createElement("h2");a.textContent=i;let o=document.createElement("p");o.className="sub",o.textContent=h.censor(e),r.append(a,o);let l=document.createElement("div");if(l.className="btns",n.forEach(([c,u,d])=>{let f=document.createElement("button");f.className="go"+(d?" ghost":""),f.textContent=c,f.onclick=u,l.append(f)}),r.append(l),Kn.primary=n[0]&&n[0][1],t){let c=document.createElement("div");c.className="stats";for(let[u,d]of t){let f=document.createElement("div");f.textContent=u;let p=document.createElement("div");p.textContent=d,c.append(f,p)}r.append(c)}r.scrollTop=0,at("panel").classList.remove("hidden")}function Zo(){at("panel").classList.add("hidden")}function Ko(){Zo(),P.state="menu",Ep(),h.audio.duck(!1),h.audio.music("menu"),at("hud").classList.add("hidden"),at("menu").classList.remove("hidden")}function Ep(){let i=h.board.list(),e=at("boardRows");at("board").classList.toggle("hidden",!i.length),e.textContent="",i.slice(0,8).forEach((t,n)=>{let s=document.createElement("div");s.textContent=`${n+1}. ${t.name}`;let r=document.createElement("div");r.textContent=`${t.areaName} \xB7 ${t.kills} down \xB7 ${t.rank}`,e.append(s,r)})}Ep();function Sp(i){let e=P.level+(i?1:0),t=i&&P.level>=ys.length-1?"SURVIVED THE SHIFT":i?`Cleared ${ys[P.level].title}`:`Got to ${ys[P.level].title}`;for(let n of h.officers)h.board.record({name:h.cleanName(n.name),area:e,areaName:t,kills:P.runKills||0,score:n.score,rank:hi[P.rung||0].title,date:new Date().toISOString().slice(0,10)})}var au=()=>[["\u2014\u2014 SHIFT BOARD \u2014\u2014",""]].concat(h.board.list().slice(0,5).map((i,e)=>[`${e+1}. ${i.name}`,i.areaName])),or={force:["An inappropriate amount","Yes","Enough to need a second form","Fists, feet, a taco, and a time clock","Whatever was closest","All of it. Every bit."],fluids:["Yes (all of them)","Spit, piss, and something from a cup we are not naming","Too many to list. See attached 9 pages.","Cup contents: unknown. Smell: known.","Yes. On the PREA poster. Again."],reason:['"Your mom"','"He looked at me funny"','"I was bored as shit"','"I wanted to see the hot nurse"','"Commissary was out of hot Cheetos"','"Bro I thought it was rec"','"It was a Tuesday"'],witness:["Tower One (asleep)","Control (on TikTok)","Inmate in cell 14 (lying)","A rat. The animal kind.","Nobody. Everybody. Big Mike."],injuries:["Bruised ego, busted lip, pride","Bit on the ass. Medical laughed.","Got gassed. Shirt is evidence now.","Pulled a hammy. Not from the fight.","Emotional. Do not ask."],sig:["Sgt. (drew a dick instead)","Illegible. Smells like Zyn.","Signed in taco sauce",'"Mandatory OT" written 40 times',"Signed. Then cried."]},ou=()=>[...h.officers.flatMap(i=>[[`${h.rankName(i)}: inmates down`,String(i.kills)],[`${h.rankName(i)}: score`,String(i.score)]]),["Rank",hi[P.rung||0].title],["Force used",h.pick(or.force)],["Bodily fluids involved",h.pick(or.fluids)],["Inmate's stated reason",h.pick(or.reason)],["Witnesses",h.pick(or.witness)],["Staff injuries",h.pick(or.injuries)],["Fake PREA claims yelled",String(P.prea||0)],...P.compromised?[["Staff compromised",`${P.compromised} (${P.compNames.join(", ")}. Paternity: pending.)`]]:P.compMissed?[["Staff compromised","Unverified. Baby shower still on."]]:[],["Real PREA claims","0 (filed 14 pages anyway)"],["Supervisor signature",h.pick(or.sig)]].map(([i,e])=>[i,h.censor(e)]);function K_(){P.state="clear",h.audio.sting("clear"),h.audio.music("menu"),Sp(!0),h.audio.play("win"),P.level>=ys.length-1?Kn("SHIFT SURVIVED","The Riverbank Ripper is back in his cell. Built for Sgt. Halley Munoz, Caleb Alaniz, Dustin Davis, and all my Correctional Officer homies back home. You are the real heroes. One DOC family. Stay safe out there.",ou().concat(au()),[["PLAY AGAIN",()=>{P.runKills=0,P.rung=-1,P.ammo={},P.gun=null,ta(0)}],["MENU",Ko,!0]],"HERO OF THE DOC"):Kn(`${P.def.title.toUpperCase()}: CLEARED`,h.pick(["INCIDENT REPORT #"+h.randi(1e3,9999)+". Sarge says good job. Sarge also says stay late.","INCIDENT REPORT. Somebody hose that shit down.","INCIDENT REPORT. Overtime approved. Sleep denied. Dignity: also denied.","INCIDENT REPORT. The DOC family thanks you. Payroll says fuck you."]),ou().concat(au()),[["NEXT AREA",()=>ta(P.level+1)],["MENU",Ko,!0]],"HERO OF THE DOC")}function J_(){P.state="over",h.audio.sting("over"),h.audio.music("menu"),Sp(!1),Kn("YOU GOT MANDOWED",h.pick(["Medical is on the way. Medical is also on break.","The inmates are filing a grievance about how easy that was.","Your truck has been towed from the fire lane."]),ou().concat(au()),[["RETRY AREA",()=>ta(P.level)],["MENU",Ko,!0]])}addEventListener("keydown",i=>{if((i.code==="Enter"||i.code==="NumpadEnter")&&(P.state==="clear"||P.state==="over")&&Kn.primary){i.preventDefault();let e=Kn.primary;Kn.primary=null,e()}});addEventListener("keydown",i=>{if(i.code==="Escape")if(P.state==="play"){P.state="pause",h.audio.duck(!0);let e=h.officers.flatMap(t=>Object.keys(ai).map(n=>{let s=t.gear[n];return[`${t.name} \xB7 ${ai[n].label}`,s?`${s.name} (${dn[s.rarity].label})`:"none yet"]}));Kn("PAUSED",'Taking a smoke break. Officially a "wellness check."',e,[["RESUME",()=>{Zo(),P.state="play",h.audio.duck(!1)}],["QUIT TO MENU",Ko,!0]])}else P.state==="pause"&&(Zo(),P.state="play",h.audio.duck(!1))});var vp=performance.now();h.audio.music("menu");function Tp(i){requestAnimationFrame(Tp);let e=Math.min(.05,(i-vp)/1e3),t=e;if(vp=i,e*=h.PACE(),P.hitStop>0&&(P.hitStop-=e,e*=.15),P.slowmo>0&&(P.slowmo-=e,e*=.3),P.state==="play"){P.time+=e,h.targets.length=0;for(let r of h.officers)r.down||h.targets.push(r);for(let r of h.allies)!r.leaving&&!r.passive&&h.targets.push(r);h.W.buildFlowT=(h.W.buildFlowT||0)-e,h.W.buildFlowT<=0&&(h.W.buildFlowT=.2,h.W.buildFlow(h.targets)),h.AI.update(e);for(let r of h.officers)r.update(e);Zn.update(e),h.Boss.update(e),q_(e),O_(),k_(e),h.C.update(e,i/1e3),Yn.update(e,i/1e3),W_(e),z_(e),H_(e),G_(e),V_(e),Y_(e),$_(t),F_(t),h.officers.every(r=>r.down)?(P.downT+=e,P.downT>2.5&&J_()):(P.downT=0,P.kills>=P.def.quota&&h.AI.liveCount()===0&&(!P.def.boss||P.bossDead)&&(Yn.drops.length&&(P.lootWait||0)<20?(P.lootWait||(jt("CONTROL","Area secure. There is gear on the floor, go grab it before you clock out.",4),h.audio.play("pickup")),P.lootWait=(P.lootWait||0)+t,P.lootLeft=Math.ceil(20-P.lootWait)):(Yn.drops.length&&Yn.collectAll(),P.lootLeft=0,P.clearT+=e,P.clearT>1.5&&K_())))}else if((P.state==="clear"||P.state==="over")&&Kn.primary){let r=h.pads();for(let a=0;a<r.length;a++){let o=r[a],l=!!(o&&o.buttons[0]&&o.buttons[0].pressed);if(l&&!Ki[a]){Ki[a]=l;let c=Kn.primary;Kn.primary=null,c();break}Ki[a]=l}}else if(P.state==="menu"){h.AI.update(e);let r=h.pads();for(let a=0;a<r.length;a++){let o=r[a],l=!!(o&&o.buttons[0]&&o.buttons[0].pressed);if(l&&!Ki[a]&&document.activeElement!==at("nameIn")){Ki[a]=l,lu();break}Ki[a]=l}}h.R.updateFlash(e),h.W.update(e,i/1e3),h.FX.update(e),_p.sync(h.AI.list);let s=h.officers.filter(r=>!r.down);if(P.state!=="menu"&&s.length){let r=s.reduce((l,c)=>l+c.x,0)/s.length,a=s.reduce((l,c)=>l+c.z,0)/s.length,o=Math.max(0,...s.map(l=>Math.hypot(l.x-r,l.z-a)));h.R.follow(r,a,e,1+o/18)}else{let r=i/1e3;h.R.follow(44+Math.sin(r*.1)*22,34+Math.cos(r*.13)*10,e,1.1)}h.R.render(i/1e3)}requestAnimationFrame(Tp);h.startLevel=ta;h.crowd=_p;window.G=h;
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
