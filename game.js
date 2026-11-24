var l={};l.BRAND={game:"MANDATORY OVERTIME",sub:"Riot Shift",alarm:"Body Alarm",by:"Made by Micah Alaniz, Correctional Officer"};l.CREW={bernardo:"Bernardo",dustin:"Dustin Davis",caleb:"Caleb Alaniz",ricardo:"Counselor Ricardo Alaniz",caughren:"C/O Coughronny",bingham:"Counselor Bingbing"};l.SHOUTOUT="Shout out to Bernardo, Dustin Davis, and Caleb Alaniz. One DOC family.";l.TAU=Math.PI*2;l.rand=(i,e)=>i+Math.random()*(e-i);l.randi=(i,e)=>Math.floor(i+Math.random()*(e-i+1));l.pick=i=>i[Math.random()*i.length|0];l.clamp=(i,e,t)=>i<e?e:i>t?t:i;l.lerp=(i,e,t)=>i+(e-i)*t;l.angDiff=(i,e)=>{let t=(e-i)%l.TAU;return t>Math.PI&&(t-=l.TAU),t<-Math.PI&&(t+=l.TAU),t};l.store={get(i,e){try{let t=localStorage.getItem(i);return t==null?e:JSON.parse(t)}catch{return e}},set(i,e){try{localStorage.setItem(i,JSON.stringify(e))}catch{}}};var jp=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches;l.settings=Object.assign({quality:jp?"medium":"high",gore:"max",cuss:!0,muted:!1,pace:.8},l.store.get("mo_settings",{}));/[?&]safe(&|=|$)/.test(location.search)&&(l.settings.quality="low");l.censor=i=>l.settings.cuss?i:i.replace(/\b(f)uck|\b(s)hit|\b(b)itch|\b(a)ss\b/gi,e=>e[0]+"*".repeat(e.length-1));l.DIFF={rookie:{label:"Rookie",hp:.8,dmg:.7,rate:.85,live:.85,swing:3,heal:1.2,score:1},veteran:{label:"Veteran",hp:1,dmg:1,rate:1,live:1,swing:4,heal:1,score:1.5},pro:{label:"Pro",hp:1.35,dmg:1.5,rate:1.3,live:1.3,swing:6,heal:.75,score:2.5},lifer:{label:"Lifer",hp:1.75,dmg:2,rate:1.6,live:1.55,swing:8,heal:.5,score:4}};l.DIFF[l.settings.diff]||(l.settings.diff="veteran");l.diff=()=>l.DIFF[l.settings.diff]||l.DIFF.veteran;l.PACE=()=>l.settings.pace||.8;l.board={list(){let i=l.store.get("sa_board",[]);return Array.isArray(i)?i:[]},record(i){let e=this.list(),t=String(i.name).toLowerCase(),n=e.findIndex(r=>String(r.name).toLowerCase()===t),s=(r,a)=>r.area>a.area||r.area===a.area&&r.score>a.score;n<0?e.push(i):s(i,e[n])&&(e[n]=i),e.sort((r,a)=>a.area-r.area||a.score-r.score),l.store.set("sa_board",e.slice(0,15))}};l.saveSettings=()=>l.store.set("mo_settings",l.settings);l.goreMax=()=>l.settings.gore==="max";l.settings.gore===!0&&!l.store.get("sa_gore16",!1)&&(l.settings.gore="max",l.store.set("sa_gore16",!0),l.saveSettings());l.cleanName=i=>String(i||"").replace(/[\u0000-\u001f\u007f{}<>]/g,"").trim().slice(0,14)||"Rookie";l.t=(i,e)=>String(i).replace(/\{hero\}/g,e||"Rookie").replace(/\{HERO\}/g,(e||"Rookie").toUpperCase()).replace(/\{(bernardo|dustin|caleb)\}/g,(t,n)=>l.CREW[n]);l.grid={cell:2,map:new Map,used:[],clear(){for(let i of this.used)i.length=0;this.used.length=0},key(i,e){return(i+2048)*8192+(e+2048)},insert(i){let e=this.key(Math.floor(i.x/this.cell),Math.floor(i.z/this.cell)),t=this.map.get(e);t||(t=[],this.map.set(e,t)),t.length===0&&this.used.push(t),t.push(i)},query(i,e,t,n){n.length=0;let s=this.cell,r=Math.floor((i-t)/s),a=Math.floor((i+t)/s),o=Math.floor((e-t)/s),c=Math.floor((e+t)/s);for(let h=r;h<=a;h++)for(let u=o;u<=c;u++){let d=this.map.get(this.key(h,u));if(d)for(let f=0;f<d.length;f++)n.push(d[f])}return n}};l.QUALITY={low:{pixel:.75,shadows:!1,shadowMap:0,bloom:!1,ao:!1,grade:!1,dust:0,particles:500,decals:150},medium:{pixel:1,shadows:!0,shadowMap:1024,bloom:!1,ao:!1,grade:!0,dust:120,particles:900,decals:250},high:{pixel:1,shadows:!0,shadowMap:2048,bloom:!0,ao:!1,grade:!0,dust:250,particles:1500,decals:400},ultra:{pixel:1.25,shadows:!0,shadowMap:4096,bloom:!0,ao:!0,grade:!0,dust:400,particles:2500,decals:600}};l.QUALITY_ORDER=["low","medium","high","ultra"];l.pads=function(){try{return navigator.getGamepads&&navigator.getGamepads()||[]}catch{return[]}};var te={ctx:null,master:null,sfx:null,mus:null,noiseBuf:null,last:{}};l.audio=te;var fa=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches,Qp=.55,Iu=.34,ul=()=>l.settings.audio||(l.settings.muted?"off":"all");te.init=function(){if(te.ctx){te.wake();return}let i=window.AudioContext||window.webkitAudioContext;if(!i)return;try{te.ctx=new i({latencyHint:"interactive"})}catch{try{te.ctx=new i}catch{return}}try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}let e=te.ctx,t=e.createDynamicsCompressor();t.threshold.value=-14,t.ratio.value=5,t.attack.value=.004,t.release.value=.2,te.master=e.createGain(),te.master.gain.value=1,te.sfx=e.createGain(),te.mus=e.createGain(),te.sfx.connect(te.master),te.mus.connect(te.master),te.master.connect(t),t.connect(e.destination),te.echo=e.createDelay(1.5),te.echoFb=e.createGain(),te.echoFb.gain.value=.28;let n=e.createBiquadFilter();n.type="lowpass",n.frequency.value=2400,te.echoIn=e.createGain(),te.echoIn.gain.value=.35,te.echoIn.connect(te.echo),te.echo.connect(n),n.connect(te.echoFb),te.echoFb.connect(te.echo),n.connect(te.mus);let s=e.sampleRate*2;te.noiseBuf=e.createBuffer(1,s,e.sampleRate);let r=te.noiseBuf.getChannelData(0);for(let a=0;a<s;a++)r[a]=Math.random()*2-1;try{let a=e.createBufferSource();a.buffer=e.createBuffer(1,1,22050),a.connect(e.destination),a.start(0)}catch{}te.applyMode(),Ye.timer=setInterval(s0,25),Ye.want&&te.music(Ye.want,!0)};te.wake=function(){te.ctx&&te.ctx.state!=="running"&&!document.hidden&&te.ctx.resume().catch(()=>{})};var e0=()=>te.init();["pointerdown","touchend","keydown","mousedown"].forEach(i=>addEventListener(i,e0,{passive:!0}));document.addEventListener("visibilitychange",()=>{te.ctx&&(document.hidden?te.ctx.suspend().catch(()=>{}):te.wake())});te.applyMode=function(){if(!te.ctx)return;let i=ul(),e=te.ctx.currentTime;te.sfx.gain.setTargetAtTime(i==="off"?0:Qp,e,.05),te.mus.gain.setTargetAtTime(i==="all"?Ye.ducked?Iu*.35:Iu:0,e,.08)};te.setMode=function(i){l.settings.audio=i,l.settings.muted=i==="off",l.saveSettings(),te.applyMode()};te.setMuted=function(i){te.setMode(i?"off":"all")};te.duck=function(i){Ye.ducked=!!i,te.applyMode()};function Pu(i,e,t,n,s,r){i.gain.setValueAtTime(1e-4,e),i.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),e+s),r&&i.gain.setValueAtTime(Math.max(2e-4,n),e+Math.max(s,t-r)),i.gain.exponentialRampToValueAtTime(1e-4,e+t)}function st(i,e,t,n=te.sfx){let s=te.ctx,r=s.createBufferSource();r.buffer=te.noiseBuf,r.playbackRate.value=t.rate||1;let a=s.createBiquadFilter();a.type=t.type||"bandpass",a.frequency.setValueAtTime(t.freq||1e3,i),t.freqEnd&&a.frequency.exponentialRampToValueAtTime(t.freqEnd,i+e),a.Q.value=t.q||1;let o=s.createGain();Pu(o,i,e,t.gain||.3,t.attack||.002),r.connect(a),a.connect(o),o.connect(n),r.start(i,Math.random()*1.5),r.stop(i+e+.05)}function ze(i,e,t,n=te.sfx){let s=te.ctx,r=s.createOscillator();if(r.type=t.type||"sine",r.frequency.setValueAtTime(t.freq||440,i),t.freqEnd&&r.frequency.exponentialRampToValueAtTime(t.freqEnd,i+(t.glide||e)),t.detune&&(r.detune.value=t.detune),t.vib){let c=s.createOscillator(),h=s.createGain();c.frequency.value=t.vib,h.gain.value=t.vibAmt||12,c.connect(h),h.connect(r.detune),c.start(i+.15),c.stop(i+e+.05)}let a=s.createGain();Pu(a,i,e,t.gain||.2,t.attack||.004,t.release);let o=r;if(t.lp){let c=s.createBiquadFilter();c.type="lowpass",c.Q.value=t.q||1,c.frequency.setValueAtTime(t.lp,i),t.lpEnd&&c.frequency.exponentialRampToValueAtTime(t.lpEnd,i+(t.lpTime||e)),r.connect(c),o=c}o.connect(a),a.connect(n),t.echo&&te.echoIn&&a.connect(te.echoIn),r.start(i),r.stop(i+e+.05)}var pa=i=>440*Math.pow(2,(i-69)/12),Lu={pop:{gap:45,f:(i,e)=>{st(i,.05,{freq:2600,q:1.5,gain:.28*e}),ze(i,.07,{type:"square",freq:520,freqEnd:150,gain:.1*e,lp:2e3}),st(i+.01,.09,{type:"highpass",freq:5e3,gain:.08*e})}},thoomp:{gap:120,f:(i,e)=>{ze(i,.3,{freq:120,freqEnd:40,gain:.75*e}),st(i,.22,{type:"lowpass",freq:900,freqEnd:150,gain:.45*e}),st(i,.03,{type:"highpass",freq:3e3,gain:.3*e})}},shotgun:{gap:150,f:(i,e)=>{st(i,.4,{type:"lowpass",freq:3800,freqEnd:260,gain:.85*e}),ze(i,.18,{freq:85,freqEnd:32,gain:.7*e}),st(i,.025,{type:"highpass",freq:2500,gain:.5*e}),st(i+.3,.035,{type:"highpass",freq:3200,q:2,gain:.22*e}),st(i+.38,.05,{freq:1500,q:3,gain:.25*e})}},rifle:{gap:60,f:(i,e)=>{st(i,.05,{type:"highpass",freq:1800,gain:.55*e}),st(i,.16,{freq:700,freqEnd:250,q:.8,gain:.3*e}),ze(i,.07,{freq:150,freqEnd:55,gain:.4*e})}},beam:{gap:110,f:(i,e)=>{ze(i,.12,{type:"sawtooth",freq:1400,freqEnd:2200,gain:.04*e,lp:3e3}),st(i,.1,{type:"highpass",freq:6e3,gain:.07*e})}},swing:{gap:60,f:(i,e)=>st(i,.17,{freq:1100,freqEnd:260,q:.9,gain:.28*e})},crack:{gap:55,f:(i,e)=>{st(i,.05,{type:"highpass",freq:1800,gain:.55*e}),ze(i,.13,{freq:110,freqEnd:42,gain:.5*e}),st(i,.09,{freq:450,q:1.2,gain:.3*e})}},clock:{gap:90,f:(i,e)=>{[1568,2349,3136].forEach((t,n)=>ze(i,.9-n*.2,{freq:t,gain:(.16-n*.04)*e,attack:.002})),ze(i,.25,{freq:90,freqEnd:40,gain:.7*e}),st(i,.12,{freq:900,q:2,gain:.4*e})}},slam:{gap:300,f:(i,e)=>{ze(i,.6,{freq:70,freqEnd:28,gain:.9*e}),st(i,.5,{type:"lowpass",freq:1500,freqEnd:120,gain:.6*e})}},spray:{gap:90,f:(i,e)=>st(i,.16,{type:"highpass",freq:2800,gain:.13*e,attack:.02})},splat:{gap:50,f:(i,e)=>st(i,.18,{freq:400,freqEnd:120,q:2,gain:.35*e})},thud:{gap:35,f:(i,e)=>{ze(i,.12,{freq:140,freqEnd:50,gain:.45*e}),st(i,.08,{freq:500,gain:.25*e})}},hurt:{gap:180,f:(i,e)=>{ze(i,.18,{type:"sawtooth",freq:230,freqEnd:110,gain:.13*e,lp:1400}),st(i,.08,{freq:800,gain:.2*e})}},dash:{gap:100,f:(i,e)=>st(i,.22,{freq:1600,freqEnd:400,gain:.22*e})},boom:{gap:80,f:(i,e)=>{st(i,.7,{type:"lowpass",freq:1600,freqEnd:90,gain:.8*e}),ze(i,.45,{freq:95,freqEnd:28,gain:.8*e}),st(i+.05,.9,{type:"lowpass",freq:500,freqEnd:60,gain:.3*e})}},zap:{gap:90,f:(i,e)=>{ze(i,.18,{type:"sawtooth",freq:1800,freqEnd:600,gain:.12*e}),st(i,.15,{type:"highpass",freq:4e3,gain:.25*e})}},pickup:{gap:60,f:(i,e)=>{ze(i,.08,{type:"triangle",freq:660,gain:.2*e}),ze(i+.07,.14,{type:"triangle",freq:990,gain:.2*e})}},zyn:{gap:100,f:(i,e)=>{st(i,.03,{type:"highpass",freq:4e3,gain:.3*e}),st(i+.06,.5,{type:"highpass",freq:5e3,gain:.1*e,attack:.05}),ze(i+.04,.2,{type:"triangle",freq:880,freqEnd:1320,gain:.15*e})}},chew:{gap:100,f:(i,e)=>{st(i,.05,{freq:600,q:2,gain:.3*e}),st(i+.18,.14,{freq:1800,freqEnd:600,q:1.5,gain:.35*e})}},gold:{gap:300,f:(i,e)=>[1047,1319,1568,2093,2637].forEach((t,n)=>ze(i+n*.06,.4,{type:"triangle",freq:t,gain:.14*e,echo:!0}))},siren:{gap:2500,f:(i,e)=>{for(let t=0;t<4;t++)ze(i+t*.5,.25,{type:"square",freq:980,gain:.08*e,lp:3e3}),ze(i+t*.5+.25,.25,{type:"square",freq:740,gain:.08*e,lp:3e3})}},radio:{gap:300,f:(i,e)=>{st(i,.09,{freq:1800,q:4,gain:.08*e}),ze(i,.05,{type:"square",freq:1400,gain:.04*e})}},alarm:{gap:900,f:(i,e)=>{for(let t=0;t<3;t++)ze(i+t*.28,.24,{type:"square",freq:880,freqEnd:660,gain:.07*e,lp:2500})}},scare:{gap:600,f:(i,e)=>{[1180,1250,1325,1405].forEach(t=>ze(i,.9,{type:"sawtooth",freq:t,freqEnd:t*.7,gain:.05*e,lp:4e3})),ze(i,.5,{freq:55,gain:.7*e}),st(i,.4,{freq:3e3,freqEnd:900,q:3,gain:.25*e})}},count:{gap:400,f:(i,e)=>[784,1047,1319].forEach((t,n)=>ze(i+n*.08,.3,{type:"triangle",freq:t,gain:.16*e}))},win:{gap:900,f:(i,e)=>[523,659,784,1046].forEach((t,n)=>ze(i+n*.12,.3,{type:"triangle",freq:t,gain:.2*e}))}};te.play=function(i,e=1){if(!te.ctx||ul()==="off"||te.ctx.state!=="running")return;let t=Lu[i];if(!t)return;let n=performance.now();te.last[i]&&n-te.last[i]<t.gap||(te.last[i]=n,t.f(te.ctx.currentTime+.005,e))};var Rn={kick:(i,e,t,n)=>{ze(i,.32,{freq:165,freqEnd:42,glide:.12,gain:.95*n},te.mus),st(i,.02,{type:"highpass",freq:2500,gain:.12*n},te.mus)},heart:(i,e,t,n)=>{ze(i,.25,{freq:80,freqEnd:38,gain:.85*n,lp:300},te.mus)},snare:(i,e,t,n)=>{st(i,.2,{freq:1900,q:.7,gain:.5*n},te.mus),ze(i,.1,{type:"triangle",freq:200,freqEnd:150,gain:.3*n},te.mus)},clap:(i,e,t,n)=>{for(let s=0;s<3;s++)st(i+s*.011,.12-s*.02,{freq:1300,q:1.1,gain:.42*n},te.mus)},hat:(i,e,t,n)=>st(i,.045,{type:"highpass",freq:7600,gain:.17*n},te.mus),ohat:(i,e,t,n)=>st(i,.26,{type:"highpass",freq:7e3,gain:.13*n},te.mus),crash:(i,e,t,n)=>st(i,1.6,{type:"highpass",freq:4500,gain:.16*n,attack:.003},te.mus),tom:(i,e,t,n)=>{ze(i,.4,{freq:e||110,freqEnd:(e||110)*.55,gain:.75*n},te.mus),st(i,.05,{freq:600,gain:.15*n},te.mus)},bass:(i,e,t,n)=>{ze(i,t,{type:"sawtooth",freq:e,gain:.32*n,lp:1400,lpEnd:220,lpTime:t*.8,q:5},te.mus),fa||ze(i,t,{type:"square",freq:e/2,gain:.12*n,lp:400},te.mus)},sub:(i,e,t,n)=>{ze(i,t,{freq:e*1.5,freqEnd:e,glide:.06,gain:.7*n,release:.12},te.mus),ze(i,t,{type:"triangle",freq:e*2,gain:.08*n,lp:600},te.mus)},chipb:(i,e,t,n)=>ze(i,t*.8,{type:"square",freq:e,gain:.13*n,lp:2500},te.mus),stab:(i,e,t,n)=>[1,1.5,2].forEach(s=>ze(i,Math.min(t,.22),{type:"sawtooth",freq:e*s,gain:.08*n,lp:2600,lpEnd:500,q:2},te.mus)),pluck:(i,e,t,n)=>ze(i,.3,{type:"triangle",freq:e,gain:.13*n,lp:3e3,lpEnd:600,echo:!0},te.mus),brass:(i,e,t,n)=>{let s={type:"sawtooth",freq:e,gain:.11*n,attack:.03,lp:600,lpEnd:2600,lpTime:.08,q:2,vib:5.5,vibAmt:8,echo:!0};ze(i,t,s,te.mus),fa||ze(i,t,Object.assign({},s,{detune:9,gain:.07*n}),te.mus)},chip:(i,e,t,n)=>ze(i,t*.9,{type:"square",freq:e,gain:.09*n,vib:6,vibAmt:10,echo:!0,lp:5e3},te.mus),lead:(i,e,t,n)=>ze(i,t,{type:"sawtooth",freq:e,gain:.08*n,lp:3500,q:3,vib:5,vibAmt:6,echo:!0},te.mus),bell:(i,e,t,n)=>{ze(i,2.2,{freq:e,gain:.12*n,echo:!0},te.mus),ze(i,1.2,{freq:e*2.76,gain:.04*n},te.mus)},pad:(i,e,t,n)=>e.forEach(s=>{ze(i,t,{type:"sawtooth",freq:s,gain:.035*n,attack:t*.3,release:t*.3,lp:900,echo:!0,detune:-6},te.mus),fa||ze(i,t,{type:"sawtooth",freq:s,gain:.03*n,attack:t*.3,release:t*.3,lp:900,detune:7},te.mus)}),choir:(i,e,t,n)=>e.forEach(s=>{ze(i,t,{type:"triangle",freq:s,gain:.07*n,attack:t*.35,release:t*.35,vib:4.5,vibAmt:14,echo:!0},te.mus),fa||ze(i,t,{type:"triangle",freq:s*2,gain:.02*n,attack:t*.4,release:t*.3,vib:4,vibAmt:10},te.mus)}),drone:(i,e,t,n)=>{ze(i,t,{type:"sawtooth",freq:e[0]/2,gain:.08*n,attack:t*.4,release:t*.4,lp:260},te.mus),ze(i,t,{freq:e[0],gain:.08*n,attack:t*.3,release:t*.4,vib:.3,vibAmt:25},te.mus)},scrape:(i,e,t,n)=>st(i,1.4,{freq:2600,freqEnd:700,q:9,gain:.08*n,attack:.4},te.mus)},t0={minor:[0,2,3,5,7,8,10],harm:[0,2,3,5,7,8,11],major:[0,2,4,5,7,9,11],phryg:[0,1,3,5,7,8,10]},hl={menu:{bpm:86,root:45,scale:"minor",swing:.14,chords:[0,5,2,6],layers:[{i:"kick",p:"x.....x...x.....",v:.8},{i:"snare",p:"....x.......x...",v:.55},{i:"hat",p:"x.x.x.x.x.x.x.xx",v:.6},{i:"bass",bass:"x.....x...5....."},{i:"pad",chord:!0,v:.9},{i:"pluck",arp:"..x...x...x...x.",oct:2,v:.8}]},lot:{bpm:124,root:40,scale:"minor",chords:[0,0,5,6],layers:[{i:"kick",p:"x...x...x...x..."},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.7},{i:"bass",bass:"x.x.x.x.x.x.o.x."},{i:"pad",chord:!0,v:.6},{i:"snare",p:"....x.......x...",min:1},{i:"stab",p:"x......x..x.....",oct:1,min:1},{i:"hat",p:".x.x.x.x.x.x.x.x",v:.4,min:2},{i:"crash",p:"x...............",every:4,min:2},{i:"brass",mel:["7...6...4...6...","7...9...7.6.4...","7...6...4...6...","a...9...7...6..."],oct:1,min:2}]},tier:{bpm:140,root:36,scale:"phryg",chords:[0,0,5,4],layers:[{i:"kick",p:"x......x..x....."},{i:"clap",p:"........x......."},{i:"sub",bass:"x......x..x.....",len:3},{i:"bell",mel:["4.......3.......","4.......5...4..."],oct:2,v:.8},{i:"hat",p:"x.x.x.x.x.x.xxxx",min:1},{i:"pad",chord:!0,v:.5,min:1},{i:"hat",p:"xxxxxxx.x.xxxxxx",v:.5,min:2},{i:"ohat",p:"......o.......o.",min:2},{i:"lead",mel:["0.0.3.0.5.4.3.2.","0.0.3.0.7.5.4..."],oct:2,min:2}]},yard:{bpm:128,root:43,scale:"minor",chords:[0,5,2,6],layers:[{i:"kick",p:"x...x...x...x..."},{i:"ohat",p:"..o...o...o...o."},{i:"bass",bass:"..x...x...x...o."},{i:"pad",chord:!0,v:.7},{i:"clap",p:"....x.......x...",min:1},{i:"pluck",arp:"xxxxxxxxxxxxxxxx",oct:2,v:.7,min:1},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.6,min:2},{i:"crash",p:"x...............",every:4,min:2},{i:"brass",mel:["4...4...3.4.6...","4...4...3.2.0...","4...4...3.4.6...","7...6...4...6..."],oct:1,min:2}]},night:{bpm:60,root:38,scale:"phryg",chords:[0,1,0,6],night:!0,layers:[{i:"drone",chord:!0,v:1},{i:"heart",p:"x..x............",v:.8},{i:"bell",mel:["........1.......","................",".......4........","..............2."],oct:3,v:.7},{i:"heart",p:"........x..x....",v:.8,min:1},{i:"hat",p:"..x...x...x...x.",v:.25,min:1},{i:"tom",p:"x..x..x...x.x...",f:70,v:.6,min:2},{i:"bass",bass:"x.x.x.x.x.x.x.x.",v:.6,min:2}]},row:{bpm:96,root:38,scale:"harm",chords:[0,5,3,4],layers:[{i:"tom",p:"x..x..x...x.x...",f:95},{i:"choir",chord:!0},{i:"bass",bass:"x..x..x.x..x..x."},{i:"kick",p:"x.......x.......",min:1},{i:"snare",p:"....x.......x...",min:1},{i:"brass",mel:["7.7.7.9.a.9.7.6.","7.7.7.9.a.c.a.9."],oct:0,v:.8,min:1},{i:"tom",p:"..........xxx.xx",f:140,v:.7,min:2},{i:"crash",p:"x...............",every:2,min:2},{i:"lead",mel:["e---d---c---b---","c---b---a---b---"],oct:1,min:2}]},boss:{bpm:152,root:38,scale:"harm",chords:[0,0,5,4],layers:[{i:"kick",p:"x...x...x...x.x."},{i:"snare",p:"....x.......x..."},{i:"hat",p:"xxxxxxxxxxxxxxxx",v:.5},{i:"bass",bass:"xxxxxxxxxxxxoxox",v:.8},{i:"choir",chord:!0},{i:"tom",p:"x.....x.....x.xx",f:90},{i:"brass",mel:["7.7.6.7.9.7.6.4.","7.7.6.7.a.9.7..."],oct:1},{i:"crash",p:"x...............",every:4}]},overtime:{bpm:168,root:48,scale:"major",chords:[0,3,4,0],layers:[{i:"kick",p:"x...x...x...x..."},{i:"snare",p:"....x.......x..."},{i:"hat",p:"x.x.x.x.x.x.x.x.",v:.7},{i:"chipb",bass:"x.o.x.o.x.o.x.o."},{i:"pluck",arp:"x.x.x.x.x.x.x.x.",oct:2,v:.6},{i:"chip",mel:["0.2.4.7.4.2.4...","3.5.7.a.7.5.3...","4.6.8.b.8.6.4...","7.6.5.4.2.1.0..."],oct:2},{i:"crash",p:"x...............",every:4}]}},Ye={track:null,name:"",step:0,next:0,timer:0,int:0,want:"",pending:null,ducked:!1};function ma(i,e,t=0){let n=t0[i.scale],s=n.length,r=Math.floor(e/s),a=(e%s+s)%s;return i.root+n[a]+12*(r+t)}function n0(i,e,t){return[0,2,4].map(n=>pa(ma(i,e+n,t)))}function i0(i,e,t){let n=e%16,s=Math.floor(e/16),r=60/i.bpm/4,a=n%2?(i.swing||0)*r:0,o=t+a,c=i.chords[s%i.chords.length];for(let h of i.layers){if((h.min||0)>Ye.int)continue;let u=h.v??1,d=Rn[h.i];if(h.p){if(h.every&&s%h.every)continue;let f=h.p[n];(f==="x"||f==="o")&&d(o,h.f,r,(f==="o"?1.2:1)*u)}else if(h.bass){let f=h.bass[n];if(f==="."||!f)continue;d(o,pa(ma(i,c+(f==="o"?7:f==="5"?4:0),h.oct||0)),r*(h.len||1.6),u)}else if(h.chord)n===0&&d(o,n0(i,c,1+(h.oct||0)),r*16*1.05,u);else if(h.arp){if(h.arp[n]!=="x")continue;let f=[0,2,4,7][n%4];d(o,pa(ma(i,c+f,h.oct||2)),r,u)}else if(h.mel){let f=h.mel[s%h.mel.length],p=f[n];if(!p||p==="."||p==="-")continue;let y=1;for(;f[n+y]==="-";)y++;d(o,pa(ma(i,parseInt(p,36),h.oct||0)),r*(y+.6),u)}}i.night&&n===0&&Math.random()<.3+Ye.int*.2&&Rn.scrape(t+Math.random()*r*8,0,0,.7+Ye.int*.3)}function s0(){if(!te.ctx||te.ctx.state!=="running")return;let i=te.ctx.currentTime;if(Ye.track)for(Ye.next<i&&(Ye.next=i+.05);Ye.next<i+.12&&(Ye.pending&&(Ye.step%16===0||Ye.pending.now)&&(Ye.track=hl[Ye.pending.name],Ye.name=Ye.pending.name,Ye.step=0,Ye.pending=null),!!Ye.track);)i0(Ye.track,Ye.step,Ye.next),Ye.next+=60/Ye.track.bpm/4,Ye.step++}te.music=function(i,e){if(Ye.want=i,!!te.ctx){if(!i||!hl[i]){Ye.track=null,Ye.name="";return}if(!(Ye.name===i&&!Ye.pending)){if(!Ye.track){Ye.track=hl[i],Ye.name=i,Ye.step=0,Ye.next=te.ctx.currentTime+.06;return}Ye.pending={name:i,now:!!e}}}};te.musicName=()=>Ye.pending?Ye.pending.name:Ye.name;te.intensity=function(i){Ye.int=i};te.sting=function(i){if(!te.ctx||ul()!=="all"||te.ctx.state!=="running")return;let e=te.ctx.currentTime+.02,t=te.mus;i==="clear"?([[0,523],[.14,659],[.28,784],[.42,1047]].forEach(([n,s])=>Rn.brass(e+n,s,.5,1.3)),Rn.pad(e+.42,[523,659,784],1.6,2),Rn.crash(e+.42,0,0,1.2),Rn.kick(e+.42,0,0,1)):i==="over"?([[0,233],[.45,220],[.9,208]].forEach(([n,s])=>ze(e+n,.42,{type:"sawtooth",freq:s,gain:.14,lp:1200,attack:.04},t)),ze(e+1.35,1.3,{type:"sawtooth",freq:196,gain:.14,lp:1200,attack:.04,vib:6,vibAmt:40},t)):i==="assault"?(Rn.kick(e,0,0,1.3),Rn.crash(e,0,0,1.3),Rn.stab(e,82,.4,1.6),Rn.tom(e+.18,90,0,1),Rn.tom(e+.3,70,0,1)):i==="overtime"?(Lu.clock.f(e,1.2),ze(e,.9,{type:"sawtooth",freq:200,freqEnd:1600,gain:.08,lp:3e3},t)):i==="boss"&&(ze(e,2.2,{type:"sawtooth",freq:55,freqEnd:110,gain:.2,lp:500,lpEnd:2400},t),Rn.crash(e+2,0,0,1.4),Rn.kick(e+2,0,0,1.3))};var vh="170";var r0=0,Du=1,a0=2;var Wd=1,_h=2,wi=3,Vi=0,ln=1,Nt=2,Vt=0,qs=1,hn=2,Nu=3,ku=4,Mh=5,Fn=100,o0=101,l0=102,c0=103,h0=104,or=200,u0=201,d0=202,f0=203,Yl=204,$l=205,Mo=206,p0=207,bo=208,m0=209,g0=210,x0=211,y0=212,v0=213,_0=214,Zl=0,Kl=1,Jl=2,Ks=3,jl=4,Ql=5,ec=6,tc=7,Xd=0,M0=1,b0=2,Gi=0,bh=1,wh=2,Eh=3,Wr=4,w0=5,Th=6,Sh=7;var qd=300,Js=301,js=302,Dr=303,nc=304,wo=306,Ln=1e3,Pn=1001,ic=1002,cn=1003,E0=1004;var ga=1005;var Gt=1006,dl=1007;var Hi=1008;var jn=1009,Yd=1010,$d=1011,Nr=1012,Ah=1013,ms=1014,bn=1015,Ut=1016,Rh=1017,Ch=1018,Wi=1020,Zd=35902,Kd=1021,Jd=1022,fn=1023,jd=1024,Qd=1025,Ys=1026,Xi=1027,Ih=1028,Ph=1029,ef=1030,Lh=1031;var Dh=1033,Ga=33776,Va=33777,Wa=33778,Xa=33779,sc=35840,rc=35841,ac=35842,oc=35843,lc=36196,cc=37492,hc=37496,uc=37808,dc=37809,fc=37810,pc=37811,mc=37812,gc=37813,xc=37814,yc=37815,vc=37816,_c=37817,Mc=37818,bc=37819,wc=37820,Ec=37821,qa=36492,Tc=36494,Sc=36495,tf=36283,Ac=36284,Rc=36285,Cc=36286;var Ya=2300,Ic=2301,fl=2302,Uu=2400,Ou=2401,zu=2402;var T0=3200,S0=3201;var Nh=0,A0=1,Bi="",Ht="srgb",ri="srgb-linear",Eo="linear",gt="srgb";var Is=7680;var Fu=519,R0=512,C0=513,I0=514,nf=515,P0=516,L0=517,D0=518,N0=519,Bu=35044,_s=35048;var Hu="300 es",Ti=2e3,$a=2001,qi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var pl=Math.PI/180,Za=180/Math.PI;function Xr(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(an[i&255]+an[i>>8&255]+an[i>>16&255]+an[i>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[t&63|128]+an[t>>8&255]+"-"+an[t>>16&255]+an[t>>24&255]+an[n&255]+an[n>>8&255]+an[n>>16&255]+an[n>>24&255]).toLowerCase()}function $t(i,e,t){return Math.max(e,Math.min(t,i))}function k0(i,e){return(i%e+e)%e}function ml(i,e,t){return(1-t)*i+t*e}function _r(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Mn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var he=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ke=class i{constructor(e,t,n,s,r,a,o,c,h){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,h)}set(e,t,n,s,r,a,o,c,h){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],h=n[1],u=n[4],d=n[7],f=n[2],p=n[5],y=n[8],x=s[0],g=s[3],m=s[6],v=s[1],b=s[4],w=s[7],D=s[2],A=s[5],I=s[8];return r[0]=a*x+o*v+c*D,r[3]=a*g+o*b+c*A,r[6]=a*m+o*w+c*I,r[1]=h*x+u*v+d*D,r[4]=h*g+u*b+d*A,r[7]=h*m+u*w+d*I,r[2]=f*x+p*v+y*D,r[5]=f*g+p*b+y*A,r[8]=f*m+p*w+y*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],u=e[8];return t*a*u-t*o*h-n*r*u+n*o*c+s*r*h-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],u=e[8],d=u*a-o*h,f=o*c-u*r,p=h*r-a*c,y=t*d+n*f+s*p;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/y;return e[0]=d*x,e[1]=(s*h-u*n)*x,e[2]=(o*n-s*a)*x,e[3]=f*x,e[4]=(u*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=p*x,e[7]=(n*c-h*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*o)+a+e,-s*h,s*c,-s*(-h*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(gl.makeScale(e,t)),this}rotate(e){return this.premultiply(gl.makeRotation(-e)),this}translate(e,t){return this.premultiply(gl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},gl=new Ke;function sf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function U0(){let i=kr("canvas");return i.style.display="block",i}var Gu={};function Rr(i){i in Gu||(Gu[i]=!0,console.warn(i))}function O0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function z0(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function F0(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var lt={enabled:!0,workingColorSpace:ri,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===gt&&(i.r=Si(i.r),i.g=Si(i.g),i.b=Si(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===gt&&(i.r=$s(i.r),i.g=$s(i.g),i.b=$s(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Bi?Eo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $s(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Vu=[.64,.33,.3,.6,.15,.06],Wu=[.2126,.7152,.0722],Xu=[.3127,.329],qu=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yu=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);lt.define({[ri]:{primaries:Vu,whitePoint:Xu,transfer:Eo,toXYZ:qu,fromXYZ:Yu,luminanceCoefficients:Wu,workingColorSpaceConfig:{unpackColorSpace:Ht},outputColorSpaceConfig:{drawingBufferColorSpace:Ht}},[Ht]:{primaries:Vu,whitePoint:Xu,transfer:gt,toXYZ:qu,fromXYZ:Yu,luminanceCoefficients:Wu,outputColorSpaceConfig:{drawingBufferColorSpace:Ht}}});var Ps,Pc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ps===void 0&&(Ps=kr("canvas")),Ps.width=e.width,Ps.height=e.height;let n=Ps.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ps}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=kr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Si(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Si(t[n]/255)*255):t[n]=Si(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},B0=0,Ka=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:B0++}),this.uuid=Xr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(xl(s[a].image)):r.push(xl(s[a]))}else r=xl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function xl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Pc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var H0=0,pn=class i extends qi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Pn,s=Pn,r=Gt,a=Hi,o=fn,c=jn,h=i.DEFAULT_ANISOTROPY,u=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:H0++}),this.uuid=Xr(),this.name="",this.source=new Ka(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==qd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ln:e.x=e.x-Math.floor(e.x);break;case Pn:e.x=e.x<0?0:1;break;case ic:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ln:e.y=e.y-Math.floor(e.y);break;case Pn:e.y=e.y<0?0:1;break;case ic:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};pn.DEFAULT_IMAGE=null;pn.DEFAULT_MAPPING=qd;pn.DEFAULT_ANISOTROPY=1;var _t=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,h=c[0],u=c[4],d=c[8],f=c[1],p=c[5],y=c[9],x=c[2],g=c[6],m=c[10];if(Math.abs(u-f)<.01&&Math.abs(d-x)<.01&&Math.abs(y-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+x)<.1&&Math.abs(y+g)<.1&&Math.abs(h+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(h+1)/2,w=(p+1)/2,D=(m+1)/2,A=(u+f)/4,I=(d+x)/4,R=(y+g)/4;return b>w&&b>D?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=A/n,r=I/n):w>D?w<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),n=A/s,r=R/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=I/r,s=R/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-y)*(g-y)+(d-x)*(d-x)+(f-u)*(f-u));return Math.abs(v)<.001&&(v=1),this.x=(g-y)/v,this.y=(d-x)/v,this.z=(f-u)/v,this.w=Math.acos((h+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Lc=class extends qi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new pn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ka(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bt=class extends Lc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ja=class extends pn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Dc=class extends pn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Zt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],h=n[s+1],u=n[s+2],d=n[s+3],f=r[a+0],p=r[a+1],y=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=h,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=p,e[t+2]=y,e[t+3]=x;return}if(d!==x||c!==f||h!==p||u!==y){let g=1-o,m=c*f+h*p+u*y+d*x,v=m>=0?1:-1,b=1-m*m;if(b>Number.EPSILON){let D=Math.sqrt(b),A=Math.atan2(D,m*v);g=Math.sin(g*A)/D,o=Math.sin(o*A)/D}let w=o*v;if(c=c*g+f*w,h=h*g+p*w,u=u*g+y*w,d=d*g+x*w,g===1-o){let D=1/Math.sqrt(c*c+h*h+u*u+d*d);c*=D,h*=D,u*=D,d*=D}}e[t]=c,e[t+1]=h,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],h=n[s+2],u=n[s+3],d=r[a],f=r[a+1],p=r[a+2],y=r[a+3];return e[t]=o*y+u*d+c*p-h*f,e[t+1]=c*y+u*f+h*d-o*p,e[t+2]=h*y+u*p+o*f-c*d,e[t+3]=u*y-o*d-c*f-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(n/2),u=o(s/2),d=o(r/2),f=c(n/2),p=c(s/2),y=c(r/2);switch(a){case"XYZ":this._x=f*u*d+h*p*y,this._y=h*p*d-f*u*y,this._z=h*u*y+f*p*d,this._w=h*u*d-f*p*y;break;case"YXZ":this._x=f*u*d+h*p*y,this._y=h*p*d-f*u*y,this._z=h*u*y-f*p*d,this._w=h*u*d+f*p*y;break;case"ZXY":this._x=f*u*d-h*p*y,this._y=h*p*d+f*u*y,this._z=h*u*y+f*p*d,this._w=h*u*d-f*p*y;break;case"ZYX":this._x=f*u*d-h*p*y,this._y=h*p*d+f*u*y,this._z=h*u*y-f*p*d,this._w=h*u*d+f*p*y;break;case"YZX":this._x=f*u*d+h*p*y,this._y=h*p*d+f*u*y,this._z=h*u*y-f*p*d,this._w=h*u*d-f*p*y;break;case"XZY":this._x=f*u*d-h*p*y,this._y=h*p*d-f*u*y,this._z=h*u*y+f*p*d,this._w=h*u*d+f*p*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],h=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(u-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($t(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,h=t._z,u=t._w;return this._x=n*u+a*o+s*h-r*c,this._y=s*u+a*c+r*o-n*h,this._z=r*u+a*h+n*c-s*o,this._w=a*u-n*o-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let h=Math.sqrt(c),u=Math.atan2(h,o),d=Math.sin((1-t)*u)/h,f=Math.sin(t*u)/h;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion($u.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion($u.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*s-o*n),u=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+c*h+a*d-o*u,this.y=n+c*u+o*h-r*d,this.z=s+c*d+r*u-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return yl.copy(this).projectOnVector(e),this.sub(yl)}reflect(e){return this.sub(yl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},yl=new L,$u=new Zt,Ai=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint($n.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint($n.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=$n.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,$n):$n.fromBufferAttribute(r,a),$n.applyMatrix4(e.matrixWorld),this.expandByPoint($n);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xa.copy(n.boundingBox)),xa.applyMatrix4(e.matrixWorld),this.union(xa)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,$n),$n.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Mr),ya.subVectors(this.max,Mr),Ls.subVectors(e.a,Mr),Ds.subVectors(e.b,Mr),Ns.subVectors(e.c,Mr),Ni.subVectors(Ds,Ls),ki.subVectors(Ns,Ds),as.subVectors(Ls,Ns);let t=[0,-Ni.z,Ni.y,0,-ki.z,ki.y,0,-as.z,as.y,Ni.z,0,-Ni.x,ki.z,0,-ki.x,as.z,0,-as.x,-Ni.y,Ni.x,0,-ki.y,ki.x,0,-as.y,as.x,0];return!vl(t,Ls,Ds,Ns,ya)||(t=[1,0,0,0,1,0,0,0,1],!vl(t,Ls,Ds,Ns,ya))?!1:(va.crossVectors(Ni,ki),t=[va.x,va.y,va.z],vl(t,Ls,Ds,Ns,ya))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,$n).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize($n).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},xi=[new L,new L,new L,new L,new L,new L,new L,new L],$n=new L,xa=new Ai,Ls=new L,Ds=new L,Ns=new L,Ni=new L,ki=new L,as=new L,Mr=new L,ya=new L,va=new L,os=new L;function vl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){os.fromArray(i,r);let o=s.x*Math.abs(os.x)+s.y*Math.abs(os.y)+s.z*Math.abs(os.z),c=e.dot(os),h=t.dot(os),u=n.dot(os);if(Math.max(-Math.max(c,h,u),Math.min(c,h,u))>o)return!1}return!0}var G0=new Ai,br=new L,_l=new L,Yi=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):G0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;br.subVectors(e,this.center);let t=br.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(br,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_l.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(br.copy(e.center).add(_l)),this.expandByPoint(br.copy(e.center).sub(_l))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},yi=new L,Ml=new L,_a=new L,Ui=new L,bl=new L,Ma=new L,wl=new L,Ur=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=yi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yi.copy(this.origin).addScaledVector(this.direction,t),yi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ml.copy(e).add(t).multiplyScalar(.5),_a.copy(t).sub(e).normalize(),Ui.copy(this.origin).sub(Ml);let r=e.distanceTo(t)*.5,a=-this.direction.dot(_a),o=Ui.dot(this.direction),c=-Ui.dot(_a),h=Ui.lengthSq(),u=Math.abs(1-a*a),d,f,p,y;if(u>0)if(d=a*c-o,f=a*o-c,y=r*u,d>=0)if(f>=-y)if(f<=y){let x=1/u;d*=x,f*=x,p=d*(d+a*f+2*o)+f*(a*d+f+2*c)+h}else f=r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*c)+h;else f=-r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*c)+h;else f<=-y?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-c),r),p=-d*d+f*(f+2*c)+h):f<=y?(d=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-c),r),p=-d*d+f*(f+2*c)+h);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Ml).addScaledVector(_a,f),p}intersectSphere(e,t){yi.subVectors(e.center,this.origin);let n=yi.dot(this.direction),s=yi.dot(yi)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,h=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return h>=0?(n=(e.min.x-f.x)*h,s=(e.max.x-f.x)*h):(n=(e.max.x-f.x)*h,s=(e.min.x-f.x)*h),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,yi)!==null}intersectTriangle(e,t,n,s,r){bl.subVectors(t,e),Ma.subVectors(n,e),wl.crossVectors(bl,Ma);let a=this.direction.dot(wl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ui.subVectors(this.origin,e);let c=o*this.direction.dot(Ma.crossVectors(Ui,Ma));if(c<0)return null;let h=o*this.direction.dot(bl.cross(Ui));if(h<0||c+h>a)return null;let u=-o*Ui.dot(wl);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},He=class i{constructor(e,t,n,s,r,a,o,c,h,u,d,f,p,y,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,h,u,d,f,p,y,x,g)}set(e,t,n,s,r,a,o,c,h,u,d,f,p,y,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=h,m[6]=u,m[10]=d,m[14]=f,m[3]=p,m[7]=y,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/ks.setFromMatrixColumn(e,0).length(),r=1/ks.setFromMatrixColumn(e,1).length(),a=1/ks.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),h=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let f=a*u,p=a*d,y=o*u,x=o*d;t[0]=c*u,t[4]=-c*d,t[8]=h,t[1]=p+y*h,t[5]=f-x*h,t[9]=-o*c,t[2]=x-f*h,t[6]=y+p*h,t[10]=a*c}else if(e.order==="YXZ"){let f=c*u,p=c*d,y=h*u,x=h*d;t[0]=f+x*o,t[4]=y*o-p,t[8]=a*h,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=p*o-y,t[6]=x+f*o,t[10]=a*c}else if(e.order==="ZXY"){let f=c*u,p=c*d,y=h*u,x=h*d;t[0]=f-x*o,t[4]=-a*d,t[8]=y+p*o,t[1]=p+y*o,t[5]=a*u,t[9]=x-f*o,t[2]=-a*h,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let f=a*u,p=a*d,y=o*u,x=o*d;t[0]=c*u,t[4]=y*h-p,t[8]=f*h+x,t[1]=c*d,t[5]=x*h+f,t[9]=p*h-y,t[2]=-h,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let f=a*c,p=a*h,y=o*c,x=o*h;t[0]=c*u,t[4]=x-f*d,t[8]=y*d+p,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-h*u,t[6]=p*d+y,t[10]=f-x*d}else if(e.order==="XZY"){let f=a*c,p=a*h,y=o*c,x=o*h;t[0]=c*u,t[4]=-d,t[8]=h*u,t[1]=f*d+x,t[5]=a*u,t[9]=p*d-y,t[2]=y*d-p,t[6]=o*u,t[10]=x*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(V0,e,W0)}lookAt(e,t,n){let s=this.elements;return Cn.subVectors(e,t),Cn.lengthSq()===0&&(Cn.z=1),Cn.normalize(),Oi.crossVectors(n,Cn),Oi.lengthSq()===0&&(Math.abs(n.z)===1?Cn.x+=1e-4:Cn.z+=1e-4,Cn.normalize(),Oi.crossVectors(n,Cn)),Oi.normalize(),ba.crossVectors(Cn,Oi),s[0]=Oi.x,s[4]=ba.x,s[8]=Cn.x,s[1]=Oi.y,s[5]=ba.y,s[9]=Cn.y,s[2]=Oi.z,s[6]=ba.z,s[10]=Cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],h=n[12],u=n[1],d=n[5],f=n[9],p=n[13],y=n[2],x=n[6],g=n[10],m=n[14],v=n[3],b=n[7],w=n[11],D=n[15],A=s[0],I=s[4],R=s[8],E=s[12],_=s[1],P=s[5],U=s[9],O=s[13],H=s[2],K=s[6],V=s[10],se=s[14],Y=s[3],ne=s[7],J=s[11],oe=s[15];return r[0]=a*A+o*_+c*H+h*Y,r[4]=a*I+o*P+c*K+h*ne,r[8]=a*R+o*U+c*V+h*J,r[12]=a*E+o*O+c*se+h*oe,r[1]=u*A+d*_+f*H+p*Y,r[5]=u*I+d*P+f*K+p*ne,r[9]=u*R+d*U+f*V+p*J,r[13]=u*E+d*O+f*se+p*oe,r[2]=y*A+x*_+g*H+m*Y,r[6]=y*I+x*P+g*K+m*ne,r[10]=y*R+x*U+g*V+m*J,r[14]=y*E+x*O+g*se+m*oe,r[3]=v*A+b*_+w*H+D*Y,r[7]=v*I+b*P+w*K+D*ne,r[11]=v*R+b*U+w*V+D*J,r[15]=v*E+b*O+w*se+D*oe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],h=e[13],u=e[2],d=e[6],f=e[10],p=e[14],y=e[3],x=e[7],g=e[11],m=e[15];return y*(+r*c*d-s*h*d-r*o*f+n*h*f+s*o*p-n*c*p)+x*(+t*c*p-t*h*f+r*a*f-s*a*p+s*h*u-r*c*u)+g*(+t*h*d-t*o*p-r*a*d+n*a*p+r*o*u-n*h*u)+m*(-s*o*u-t*c*d+t*o*f+s*a*d-n*a*f+n*c*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],h=e[7],u=e[8],d=e[9],f=e[10],p=e[11],y=e[12],x=e[13],g=e[14],m=e[15],v=d*g*h-x*f*h+x*c*p-o*g*p-d*c*m+o*f*m,b=y*f*h-u*g*h-y*c*p+a*g*p+u*c*m-a*f*m,w=u*x*h-y*d*h+y*o*p-a*x*p-u*o*m+a*d*m,D=y*d*c-u*x*c-y*o*f+a*x*f+u*o*g-a*d*g,A=t*v+n*b+s*w+r*D;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/A;return e[0]=v*I,e[1]=(x*f*r-d*g*r-x*s*p+n*g*p+d*s*m-n*f*m)*I,e[2]=(o*g*r-x*c*r+x*s*h-n*g*h-o*s*m+n*c*m)*I,e[3]=(d*c*r-o*f*r-d*s*h+n*f*h+o*s*p-n*c*p)*I,e[4]=b*I,e[5]=(u*g*r-y*f*r+y*s*p-t*g*p-u*s*m+t*f*m)*I,e[6]=(y*c*r-a*g*r-y*s*h+t*g*h+a*s*m-t*c*m)*I,e[7]=(a*f*r-u*c*r+u*s*h-t*f*h-a*s*p+t*c*p)*I,e[8]=w*I,e[9]=(y*d*r-u*x*r-y*n*p+t*x*p+u*n*m-t*d*m)*I,e[10]=(a*x*r-y*o*r+y*n*h-t*x*h-a*n*m+t*o*m)*I,e[11]=(u*o*r-a*d*r-u*n*h+t*d*h+a*n*p-t*o*p)*I,e[12]=D*I,e[13]=(u*x*s-y*d*s+y*n*f-t*x*f-u*n*g+t*d*g)*I,e[14]=(y*o*s-a*x*s-y*n*c+t*x*c+a*n*g-t*o*g)*I,e[15]=(a*d*s-u*o*s+u*n*c-t*d*c-a*n*f+t*o*f)*I,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,h=r*a,u=r*o;return this.set(h*a+n,h*o-s*c,h*c+s*o,0,h*o+s*c,u*o+n,u*c-s*a,0,h*c-s*o,u*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,h=r+r,u=a+a,d=o+o,f=r*h,p=r*u,y=r*d,x=a*u,g=a*d,m=o*d,v=c*h,b=c*u,w=c*d,D=n.x,A=n.y,I=n.z;return s[0]=(1-(x+m))*D,s[1]=(p+w)*D,s[2]=(y-b)*D,s[3]=0,s[4]=(p-w)*A,s[5]=(1-(f+m))*A,s[6]=(g+v)*A,s[7]=0,s[8]=(y+b)*I,s[9]=(g-v)*I,s[10]=(1-(f+x))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=ks.set(s[0],s[1],s[2]).length(),a=ks.set(s[4],s[5],s[6]).length(),o=ks.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Zn.copy(this);let h=1/r,u=1/a,d=1/o;return Zn.elements[0]*=h,Zn.elements[1]*=h,Zn.elements[2]*=h,Zn.elements[4]*=u,Zn.elements[5]*=u,Zn.elements[6]*=u,Zn.elements[8]*=d,Zn.elements[9]*=d,Zn.elements[10]*=d,t.setFromRotationMatrix(Zn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Ti){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),p,y;if(o===Ti)p=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===$a)p=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Ti){let c=this.elements,h=1/(t-e),u=1/(n-s),d=1/(a-r),f=(t+e)*h,p=(n+s)*u,y,x;if(o===Ti)y=(a+r)*d,x=-2*d;else if(o===$a)y=r*d,x=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=x,c[14]=-y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ks=new L,Zn=new He,V0=new L(0,0,0),W0=new L(1,1,1),Oi=new L,ba=new L,Cn=new L,Zu=new He,Ku=new Zt,Kt=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],u=s[9],d=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin($t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin($t(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-$t(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin($t(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-$t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Zu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ku.setFromEuler(this),this.setFromQuaternion(Ku,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Kt.DEFAULT_ORDER="XYZ";var Or=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},X0=0,Ju=new L,Us=new Zt,vi=new He,wa=new L,wr=new L,q0=new L,Y0=new Zt,ju=new L(1,0,0),Qu=new L(0,1,0),ed=new L(0,0,1),td={type:"added"},$0={type:"removed"},Os={type:"childadded",child:null},El={type:"childremoved",child:null},Jt=class i extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:X0++}),this.uuid=Xr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new L,t=new Kt,n=new Zt,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new He},normalMatrix:{value:new Ke}}),this.matrix=new He,this.matrixWorld=new He,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Or,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.multiply(Us),this}rotateOnWorldAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.premultiply(Us),this}rotateX(e){return this.rotateOnAxis(ju,e)}rotateY(e){return this.rotateOnAxis(Qu,e)}rotateZ(e){return this.rotateOnAxis(ed,e)}translateOnAxis(e,t){return Ju.copy(e).applyQuaternion(this.quaternion),this.position.add(Ju.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ju,e)}translateY(e){return this.translateOnAxis(Qu,e)}translateZ(e){return this.translateOnAxis(ed,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?wa.copy(e):wa.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),wr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt(wr,wa,this.up):vi.lookAt(wa,wr,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),Us.setFromRotationMatrix(vi),this.quaternion.premultiply(Us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(td),Os.child=e,this.dispatchEvent(Os),Os.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($0),El.child=e,this.dispatchEvent(El),El.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vi.multiply(e.parent.matrixWorld)),e.applyMatrix4(vi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(td),Os.child=e,this.dispatchEvent(Os),Os.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,e,q0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wr,Y0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let h=0,u=c.length;h<u;h++){let d=c[h];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),h=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),p=a(e.animations),y=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let c=[];for(let h in o){let u=o[h];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Jt.DEFAULT_UP=new L(0,1,0);Jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Kn=new L,_i=new L,Tl=new L,Mi=new L,zs=new L,Fs=new L,nd=new L,Sl=new L,Al=new L,Rl=new L,Cl=new _t,Il=new _t,Pl=new _t,fs=class i{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Kn.subVectors(e,t),s.cross(Kn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Kn.subVectors(s,t),_i.subVectors(n,t),Tl.subVectors(e,t);let a=Kn.dot(Kn),o=Kn.dot(_i),c=Kn.dot(Tl),h=_i.dot(_i),u=_i.dot(Tl),d=a*h-o*o;if(d===0)return r.set(0,0,0),null;let f=1/d,p=(h*c-o*u)*f,y=(a*u-o*c)*f;return r.set(1-p-y,y,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Mi.x),c.addScaledVector(a,Mi.y),c.addScaledVector(o,Mi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Cl.setScalar(0),Il.setScalar(0),Pl.setScalar(0),Cl.fromBufferAttribute(e,t),Il.fromBufferAttribute(e,n),Pl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Cl,r.x),a.addScaledVector(Il,r.y),a.addScaledVector(Pl,r.z),a}static isFrontFacing(e,t,n,s){return Kn.subVectors(n,t),_i.subVectors(e,t),Kn.cross(_i).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kn.subVectors(this.c,this.b),_i.subVectors(this.a,this.b),Kn.cross(_i).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;zs.subVectors(s,n),Fs.subVectors(r,n),Sl.subVectors(e,n);let c=zs.dot(Sl),h=Fs.dot(Sl);if(c<=0&&h<=0)return t.copy(n);Al.subVectors(e,s);let u=zs.dot(Al),d=Fs.dot(Al);if(u>=0&&d<=u)return t.copy(s);let f=c*d-u*h;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(zs,a);Rl.subVectors(e,r);let p=zs.dot(Rl),y=Fs.dot(Rl);if(y>=0&&p<=y)return t.copy(r);let x=p*h-c*y;if(x<=0&&h>=0&&y<=0)return o=h/(h-y),t.copy(n).addScaledVector(Fs,o);let g=u*y-p*d;if(g<=0&&d-u>=0&&p-y>=0)return nd.subVectors(r,s),o=(d-u)/(d-u+(p-y)),t.copy(s).addScaledVector(nd,o);let m=1/(g+x+f);return a=x*m,o=f*m,t.copy(n).addScaledVector(zs,a).addScaledVector(Fs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},rf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zi={h:0,s:0,l:0},Ea={h:0,s:0,l:0};function Ll(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var xe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=lt.workingColorSpace){if(e=k0(e,1),t=$t(t,0,1),n=$t(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ll(a,r,e+1/3),this.g=Ll(a,r,e),this.b=Ll(a,r,e-1/3)}return lt.toWorkingColorSpace(this,s),this}setStyle(e,t=Ht){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ht){let n=rf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=$s(e.r),this.g=$s(e.g),this.b=$s(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ht){return lt.fromWorkingColorSpace(on.copy(this),e),Math.round($t(on.r*255,0,255))*65536+Math.round($t(on.g*255,0,255))*256+Math.round($t(on.b*255,0,255))}getHexString(e=Ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.fromWorkingColorSpace(on.copy(this),t);let n=on.r,s=on.g,r=on.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,h,u=(o+a)/2;if(o===a)c=0,h=0;else{let d=a-o;switch(h=u<=.5?d/(a+o):d/(2-a-o),a){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=h,e.l=u,e}getRGB(e,t=lt.workingColorSpace){return lt.fromWorkingColorSpace(on.copy(this),t),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=Ht){lt.fromWorkingColorSpace(on.copy(this),e);let t=on.r,n=on.g,s=on.b;return e!==Ht?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(zi),this.setHSL(zi.h+e,zi.s+t,zi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(zi),e.getHSL(Ea);let n=ml(zi.h,Ea.h,t),s=ml(zi.s,Ea.s,t),r=ml(zi.l,Ea.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},on=new xe;xe.NAMES=rf;var Z0=0,Ri=class extends qi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Z0++}),this.uuid=Xr(),this.name="",this.blending=qs,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yl,this.blendDst=$l,this.blendEquation=Fn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new xe(0,0,0),this.blendAlpha=0,this.depthFunc=Ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Is,this.stencilZFail=Is,this.stencilZPass=Is,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qs&&(n.blending=this.blending),this.side!==Vi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Yl&&(n.blendSrc=this.blendSrc),this.blendDst!==$l&&(n.blendDst=this.blendDst),this.blendEquation!==Fn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ks&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Is&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Is&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Is&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},ut=class extends Ri{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kt,this.combine=Xd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ei=K0();function K0(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){let h=c-127;h<-27?(n[c]=0,n[c|256]=32768,s[c]=24,s[c|256]=24):h<-14?(n[c]=1024>>-h-14,n[c|256]=1024>>-h-14|32768,s[c]=-h-1,s[c|256]=-h-1):h<=15?(n[c]=h+15<<10,n[c|256]=h+15<<10|32768,s[c]=13,s[c|256]=13):h<128?(n[c]=31744,n[c|256]=64512,s[c]=24,s[c|256]=24):(n[c]=31744,n[c|256]=64512,s[c]=13,s[c|256]=13)}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let h=c<<13,u=0;for(;!(h&8388608);)h<<=1,u-=8388608;h&=-8388609,u+=947912704,r[c]=h|u}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function J0(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=$t(i,-65504,65504),Ei.floatView[0]=i;let e=Ei.uint32View[0],t=e>>23&511;return Ei.baseTable[t]+((e&8388607)>>Ei.shiftTable[t])}function j0(i){let e=i>>10;return Ei.uint32View[0]=Ei.mantissaTable[Ei.offsetTable[e]+(i&1023)]+Ei.exponentTable[e],Ei.floatView[0]}var qr={toHalfFloat:J0,fromHalfFloat:j0},zt=new L,Ta=new he,Ft=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Bu,this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ta.fromBufferAttribute(this,t),Ta.applyMatrix3(e),this.setXY(t,Ta.x,Ta.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix3(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=_r(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Mn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_r(t,this.array)),t}setX(e,t){return this.normalized&&(t=Mn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_r(t,this.array)),t}setY(e,t){return this.normalized&&(t=Mn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_r(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Mn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_r(t,this.array)),t}setW(e,t){return this.normalized&&(t=Mn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Mn(t,this.array),n=Mn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Mn(t,this.array),n=Mn(n,this.array),s=Mn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Mn(t,this.array),n=Mn(n,this.array),s=Mn(s,this.array),r=Mn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Bu&&(e.usage=this.usage),e}};var ja=class extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Qa=class extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ct=class extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}},Q0=0,zn=new He,Dl=new Jt,Bs=new L,In=new Ai,Er=new Ai,Yt=new L,kt=class i extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Q0++}),this.uuid=Xr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sf(e)?Qa:ja)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zn.makeRotationFromQuaternion(e),this.applyMatrix4(zn),this}rotateX(e){return zn.makeRotationX(e),this.applyMatrix4(zn),this}rotateY(e){return zn.makeRotationY(e),this.applyMatrix4(zn),this}rotateZ(e){return zn.makeRotationZ(e),this.applyMatrix4(zn),this}translate(e,t,n){return zn.makeTranslation(e,t,n),this.applyMatrix4(zn),this}scale(e,t,n){return zn.makeScale(e,t,n),this.applyMatrix4(zn),this}lookAt(e){return Dl.lookAt(e),Dl.updateMatrix(),this.applyMatrix4(Dl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ct(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];In.setFromBufferAttribute(r),this.morphTargetsRelative?(Yt.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(Yt),Yt.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(Yt)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(In.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Er.setFromBufferAttribute(o),this.morphTargetsRelative?(Yt.addVectors(In.min,Er.min),In.expandByPoint(Yt),Yt.addVectors(In.max,Er.max),In.expandByPoint(Yt)):(In.expandByPoint(Er.min),In.expandByPoint(Er.max))}In.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Yt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Yt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)Yt.fromBufferAttribute(o,h),c&&(Bs.fromBufferAttribute(e,h),Yt.add(Bs)),s=Math.max(s,n.distanceToSquared(Yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ft(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new L,c[R]=new L;let h=new L,u=new L,d=new L,f=new he,p=new he,y=new he,x=new L,g=new L;function m(R,E,_){h.fromBufferAttribute(n,R),u.fromBufferAttribute(n,E),d.fromBufferAttribute(n,_),f.fromBufferAttribute(r,R),p.fromBufferAttribute(r,E),y.fromBufferAttribute(r,_),u.sub(h),d.sub(h),p.sub(f),y.sub(f);let P=1/(p.x*y.y-y.x*p.y);isFinite(P)&&(x.copy(u).multiplyScalar(y.y).addScaledVector(d,-p.y).multiplyScalar(P),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-y.x).multiplyScalar(P),o[R].add(x),o[E].add(x),o[_].add(x),c[R].add(g),c[E].add(g),c[_].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,E=v.length;R<E;++R){let _=v[R],P=_.start,U=_.count;for(let O=P,H=P+U;O<H;O+=3)m(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let b=new L,w=new L,D=new L,A=new L;function I(R){D.fromBufferAttribute(s,R),A.copy(D);let E=o[R];b.copy(E),b.sub(D.multiplyScalar(D.dot(E))).normalize(),w.crossVectors(A,E);let P=w.dot(c[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,P)}for(let R=0,E=v.length;R<E;++R){let _=v[R],P=_.start,U=_.count;for(let O=P,H=P+U;O<H;O+=3)I(e.getX(O+0)),I(e.getX(O+1)),I(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new L,r=new L,a=new L,o=new L,c=new L,h=new L,u=new L,d=new L;if(e)for(let f=0,p=e.count;f<p;f+=3){let y=e.getX(f+0),x=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,y),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(n,y),c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,g),o.add(u),c.add(u),h.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,h.x,h.y,h.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Yt.fromBufferAttribute(e,t),Yt.normalize(),e.setXYZ(t,Yt.x,Yt.y,Yt.z)}toNonIndexed(){function e(o,c){let h=o.array,u=o.itemSize,d=o.normalized,f=new h.constructor(c.length*u),p=0,y=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?p=c[x]*o.data.stride+o.offset:p=c[x]*u;for(let m=0;m<u;m++)f[y++]=h[p++]}return new Ft(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],h=e(c,n);t.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let c=[],h=r[o];for(let u=0,d=h.length;u<d;u++){let f=h[u],p=e(f,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let h=a[o];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let h=n[c];e.data.attributes[c]=h.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],u=[];for(let d=0,f=h.length;d<f;d++){let p=h[d];u.push(p.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let h in s){let u=s[h];this.setAttribute(h,u.clone(t))}let r=e.morphAttributes;for(let h in r){let u=[],d=r[h];for(let f=0,p=d.length;f<p;f++)u.push(d[f].clone(t));this.morphAttributes[h]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let h=0,u=a.length;h<u;h++){let d=a[h];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},id=new He,ls=new Ur,Sa=new Yi,sd=new L,Aa=new L,Ra=new L,Ca=new L,Nl=new L,Ia=new L,rd=new L,Pa=new L,ce=class extends Jt{constructor(e=new kt,t=new ut){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Ia.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let u=o[c],d=r[c];u!==0&&(Nl.fromBufferAttribute(d,e),a?Ia.addScaledVector(Nl,u):Ia.addScaledVector(Nl.sub(t),u))}t.add(Ia)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Sa.copy(n.boundingSphere),Sa.applyMatrix4(r),ls.copy(e.ray).recast(e.near),!(Sa.containsPoint(ls.origin)===!1&&(ls.intersectSphere(Sa,sd)===null||ls.origin.distanceToSquared(sd)>(e.far-e.near)**2))&&(id.copy(r).invert(),ls.copy(e.ray).applyMatrix4(id),!(n.boundingBox!==null&&ls.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ls)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,x=f.length;y<x;y++){let g=f[y],m=a[g.materialIndex],v=Math.max(g.start,p.start),b=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let w=v,D=b;w<D;w+=3){let A=o.getX(w),I=o.getX(w+1),R=o.getX(w+2);s=La(this,m,e,n,h,u,d,A,I,R),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=o.getX(g),b=o.getX(g+1),w=o.getX(g+2);s=La(this,a,e,n,h,u,d,v,b,w),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let y=0,x=f.length;y<x;y++){let g=f[y],m=a[g.materialIndex],v=Math.max(g.start,p.start),b=Math.min(c.count,Math.min(g.start+g.count,p.start+p.count));for(let w=v,D=b;w<D;w+=3){let A=w,I=w+1,R=w+2;s=La(this,m,e,n,h,u,d,A,I,R),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=g,b=g+1,w=g+2;s=La(this,a,e,n,h,u,d,v,b,w),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function em(i,e,t,n,s,r,a,o){let c;if(e.side===ln?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Vi,o),c===null)return null;Pa.copy(o),Pa.applyMatrix4(i.matrixWorld);let h=t.ray.origin.distanceTo(Pa);return h<t.near||h>t.far?null:{distance:h,point:Pa.clone(),object:i}}function La(i,e,t,n,s,r,a,o,c,h){i.getVertexPosition(o,Aa),i.getVertexPosition(c,Ra),i.getVertexPosition(h,Ca);let u=em(i,e,t,n,Aa,Ra,Ca,rd);if(u){let d=new L;fs.getBarycoord(rd,Aa,Ra,Ca,d),s&&(u.uv=fs.getInterpolatedAttribute(s,o,c,h,d,new he)),r&&(u.uv1=fs.getInterpolatedAttribute(r,o,c,h,d,new he)),a&&(u.normal=fs.getInterpolatedAttribute(a,o,c,h,d,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:c,c:h,normal:new L,materialIndex:0};fs.getNormal(Aa,Ra,Ca,f.normal),u.face=f,u.barycoord=d}return u}var Te=class i extends kt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],h=[],u=[],d=[],f=0,p=0;y("z","y","x",-1,-1,n,t,e,a,r,0),y("z","y","x",1,-1,n,t,-e,a,r,1),y("x","z","y",1,1,e,n,t,s,a,2),y("x","z","y",1,-1,e,n,-t,s,a,3),y("x","y","z",1,-1,e,t,n,s,r,4),y("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ct(h,3)),this.setAttribute("normal",new ct(u,3)),this.setAttribute("uv",new ct(d,2));function y(x,g,m,v,b,w,D,A,I,R,E){let _=w/I,P=D/R,U=w/2,O=D/2,H=A/2,K=I+1,V=R+1,se=0,Y=0,ne=new L;for(let J=0;J<V;J++){let oe=J*P-O;for(let ge=0;ge<K;ge++){let Re=ge*_-U;ne[x]=Re*v,ne[g]=oe*b,ne[m]=H,h.push(ne.x,ne.y,ne.z),ne[x]=0,ne[g]=0,ne[m]=A>0?1:-1,u.push(ne.x,ne.y,ne.z),d.push(ge/I),d.push(1-J/R),se+=1}}for(let J=0;J<R;J++)for(let oe=0;oe<I;oe++){let ge=f+oe+K*J,Re=f+oe+K*(J+1),$=f+(oe+1)+K*(J+1),ae=f+(oe+1)+K*J;c.push(ge,Re,ae),c.push(Re,$,ae),Y+=6}o.addGroup(p,Y,E),p+=Y,f+=se}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Qs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function dn(i){let e={};for(let t=0;t<i.length;t++){let n=Qs(i[t]);for(let s in n)e[s]=n[s]}return e}function tm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function af(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}var wn={clone:Qs,merge:dn},nm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,im=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ct=class extends Ri{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nm,this.fragmentShader=im,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qs(e.uniforms),this.uniformsGroups=tm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},eo=class extends Jt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new He,this.projectionMatrix=new He,this.projectionMatrixInverse=new He,this.coordinateSystem=Ti}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Fi=new L,ad=new he,od=new he,en=class extends eo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Za*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(pl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Za*2*Math.atan(Math.tan(pl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,ad,od),t.subVectors(od,ad)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(pl*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Hs=-90,Gs=1,Nc=class extends Jt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new en(Hs,Gs,e,t);s.layers=this.layers,this.add(s);let r=new en(Hs,Gs,e,t);r.layers=this.layers,this.add(r);let a=new en(Hs,Gs,e,t);a.layers=this.layers,this.add(a);let o=new en(Hs,Gs,e,t);o.layers=this.layers,this.add(o);let c=new en(Hs,Gs,e,t);c.layers=this.layers,this.add(c);let h=new en(Hs,Gs,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let h of t)this.remove(h);if(e===Ti)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===$a)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,h,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,h),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(d,f,p),e.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},to=class extends pn{constructor(e,t,n,s,r,a,o,c,h,u){e=e!==void 0?e:[],t=t!==void 0?t:Js,super(e,t,n,s,r,a,o,c,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},kc=class extends Bt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new to(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Gt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Te(5,5,5),r=new Ct({name:"CubemapFromEquirect",uniforms:Qs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ln,blending:Vt});r.uniforms.tEquirect.value=t;let a=new ce(s,r),o=t.minFilter;return t.minFilter===Hi&&(t.minFilter=Gt),new Nc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},kl=new L,sm=new L,rm=new Ke,Jn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=kl.subVectors(n,t).cross(sm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(kl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||rm.getNormalMatrix(e),s=this.coplanarPoint(kl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},cs=new Yi,Da=new L,zr=class{constructor(e=new Jn,t=new Jn,n=new Jn,s=new Jn,r=new Jn,a=new Jn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ti){let n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],p=s[8],y=s[9],x=s[10],g=s[11],m=s[12],v=s[13],b=s[14],w=s[15];if(n[0].setComponents(c-r,f-h,g-p,w-m).normalize(),n[1].setComponents(c+r,f+h,g+p,w+m).normalize(),n[2].setComponents(c+a,f+u,g+y,w+v).normalize(),n[3].setComponents(c-a,f-u,g-y,w-v).normalize(),n[4].setComponents(c-o,f-d,g-x,w-b).normalize(),t===Ti)n[5].setComponents(c+o,f+d,g+x,w+b).normalize();else if(t===$a)n[5].setComponents(o,d,x,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),cs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),cs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(cs)}intersectsSprite(e){return cs.center.set(0,0,0),cs.radius=.7071067811865476,cs.applyMatrix4(e.matrixWorld),this.intersectsSphere(cs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Da.x=s.normal.x>0?e.max.x:e.min.x,Da.y=s.normal.y>0?e.max.y:e.min.y,Da.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Da)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function of(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function am(i){let e=new WeakMap;function t(o,c){let h=o.array,u=o.usage,d=h.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,h,u),o.onUploadCallback();let p;if(h instanceof Float32Array)p=i.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=i.SHORT;else if(h instanceof Uint32Array)p=i.UNSIGNED_INT;else if(h instanceof Int32Array)p=i.INT;else if(h instanceof Int8Array)p=i.BYTE;else if(h instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:f,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,h){let u=c.array,d=c.updateRanges;if(i.bindBuffer(h,o),d.length===0)i.bufferSubData(h,0,u);else{d.sort((p,y)=>p.start-y.start);let f=0;for(let p=1;p<d.length;p++){let y=d[f],x=d[p];x.start<=y.start+y.count+1?y.count=Math.max(y.count,x.start+x.count-y.start):(++f,d[f]=x)}d.length=f+1;for(let p=0,y=d.length;p<y;p++){let x=d[p];i.bufferSubData(h,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=e.get(o);if(h===void 0)e.set(o,t(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,o,c),h.version=o.version}}return{get:s,remove:r,update:a}}var Pt=class i extends kt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),h=o+1,u=c+1,d=e/o,f=t/c,p=[],y=[],x=[],g=[];for(let m=0;m<u;m++){let v=m*f-a;for(let b=0;b<h;b++){let w=b*d-r;y.push(w,-v,0),x.push(0,0,1),g.push(b/o),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let v=0;v<o;v++){let b=v+h*m,w=v+h*(m+1),D=v+1+h*(m+1),A=v+1+h*m;p.push(b,w,A),p.push(w,D,A)}this.setIndex(p),this.setAttribute("position",new ct(y,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},om=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lm=`#ifdef USE_ALPHAHASH
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
#endif`,cm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,um=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fm=`#ifdef USE_AOMAP
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
#endif`,pm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mm=`#ifdef USE_BATCHING
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
#endif`,gm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ym=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,_m=`#ifdef USE_IRIDESCENCE
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
#endif`,Mm=`#ifdef USE_BUMPMAP
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
#endif`,bm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Em=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Cm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Im=`#define PI 3.141592653589793
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
} // validated`,Pm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Lm=`vec3 transformedNormal = objectNormal;
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
#endif`,Dm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,km=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Um=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Om="gl_FragColor = linearToOutputTexel( gl_FragColor );",zm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Fm=`#ifdef USE_ENVMAP
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
#endif`,Bm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hm=`#ifdef USE_ENVMAP
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
#endif`,Gm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vm=`#ifdef USE_ENVMAP
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
#endif`,Wm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ym=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$m=`#ifdef USE_GRADIENTMAP
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
}`,Zm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Km=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jm=`uniform bool receiveShadow;
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
#endif`,Qm=`#ifdef USE_ENVMAP
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
#endif`,eg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ng=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ig=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sg=`PhysicalMaterial material;
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
#endif`,rg=`struct PhysicalMaterial {
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
}`,ag=`
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
#endif`,og=`#if defined( RE_IndirectDiffuse )
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
#endif`,lg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ug=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gg=`#if defined( USE_POINTS_UV )
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
#endif`,xg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_g=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bg=`#ifdef USE_MORPHTARGETS
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
#endif`,wg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Eg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ag=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cg=`#ifdef USE_NORMALMAP
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
#endif`,Ig=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ng=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,kg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ug=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Og=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xg=`float getShadowMask() {
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
}`,qg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yg=`#ifdef USE_SKINNING
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
#endif`,$g=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zg=`#ifdef USE_SKINNING
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
#endif`,Kg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ex=`#ifdef USE_TRANSMISSION
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
#endif`,tx=`#ifdef USE_TRANSMISSION
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
#endif`,nx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ix=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ax=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ox=`uniform sampler2D t2D;
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
}`,lx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ux=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dx=`#include <common>
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
}`,fx=`#if DEPTH_PACKING == 3200
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
}`,px=`#define DISTANCE
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
}`,mx=`#define DISTANCE
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
}`,gx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yx=`uniform float scale;
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
}`,vx=`uniform vec3 diffuse;
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
}`,_x=`#include <common>
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
}`,Mx=`uniform vec3 diffuse;
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
}`,bx=`#define LAMBERT
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
}`,wx=`#define LAMBERT
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
}`,Ex=`#define MATCAP
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
}`,Tx=`#define MATCAP
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
}`,Sx=`#define NORMAL
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
}`,Ax=`#define NORMAL
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
}`,Rx=`#define PHONG
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
}`,Cx=`#define PHONG
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
}`,Ix=`#define STANDARD
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
}`,Px=`#define STANDARD
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
}`,Lx=`#define TOON
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
}`,Dx=`#define TOON
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
}`,Nx=`uniform float size;
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
}`,kx=`uniform vec3 diffuse;
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
}`,Ux=`#include <common>
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
}`,Ox=`uniform vec3 color;
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
}`,zx=`uniform float rotation;
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
}`,Fx=`uniform vec3 diffuse;
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
}`,je={alphahash_fragment:om,alphahash_pars_fragment:lm,alphamap_fragment:cm,alphamap_pars_fragment:hm,alphatest_fragment:um,alphatest_pars_fragment:dm,aomap_fragment:fm,aomap_pars_fragment:pm,batching_pars_vertex:mm,batching_vertex:gm,begin_vertex:xm,beginnormal_vertex:ym,bsdfs:vm,iridescence_fragment:_m,bumpmap_pars_fragment:Mm,clipping_planes_fragment:bm,clipping_planes_pars_fragment:wm,clipping_planes_pars_vertex:Em,clipping_planes_vertex:Tm,color_fragment:Sm,color_pars_fragment:Am,color_pars_vertex:Rm,color_vertex:Cm,common:Im,cube_uv_reflection_fragment:Pm,defaultnormal_vertex:Lm,displacementmap_pars_vertex:Dm,displacementmap_vertex:Nm,emissivemap_fragment:km,emissivemap_pars_fragment:Um,colorspace_fragment:Om,colorspace_pars_fragment:zm,envmap_fragment:Fm,envmap_common_pars_fragment:Bm,envmap_pars_fragment:Hm,envmap_pars_vertex:Gm,envmap_physical_pars_fragment:Qm,envmap_vertex:Vm,fog_vertex:Wm,fog_pars_vertex:Xm,fog_fragment:qm,fog_pars_fragment:Ym,gradientmap_pars_fragment:$m,lightmap_pars_fragment:Zm,lights_lambert_fragment:Km,lights_lambert_pars_fragment:Jm,lights_pars_begin:jm,lights_toon_fragment:eg,lights_toon_pars_fragment:tg,lights_phong_fragment:ng,lights_phong_pars_fragment:ig,lights_physical_fragment:sg,lights_physical_pars_fragment:rg,lights_fragment_begin:ag,lights_fragment_maps:og,lights_fragment_end:lg,logdepthbuf_fragment:cg,logdepthbuf_pars_fragment:hg,logdepthbuf_pars_vertex:ug,logdepthbuf_vertex:dg,map_fragment:fg,map_pars_fragment:pg,map_particle_fragment:mg,map_particle_pars_fragment:gg,metalnessmap_fragment:xg,metalnessmap_pars_fragment:yg,morphinstance_vertex:vg,morphcolor_vertex:_g,morphnormal_vertex:Mg,morphtarget_pars_vertex:bg,morphtarget_vertex:wg,normal_fragment_begin:Eg,normal_fragment_maps:Tg,normal_pars_fragment:Sg,normal_pars_vertex:Ag,normal_vertex:Rg,normalmap_pars_fragment:Cg,clearcoat_normal_fragment_begin:Ig,clearcoat_normal_fragment_maps:Pg,clearcoat_pars_fragment:Lg,iridescence_pars_fragment:Dg,opaque_fragment:Ng,packing:kg,premultiplied_alpha_fragment:Ug,project_vertex:Og,dithering_fragment:zg,dithering_pars_fragment:Fg,roughnessmap_fragment:Bg,roughnessmap_pars_fragment:Hg,shadowmap_pars_fragment:Gg,shadowmap_pars_vertex:Vg,shadowmap_vertex:Wg,shadowmask_pars_fragment:Xg,skinbase_vertex:qg,skinning_pars_vertex:Yg,skinning_vertex:$g,skinnormal_vertex:Zg,specularmap_fragment:Kg,specularmap_pars_fragment:Jg,tonemapping_fragment:jg,tonemapping_pars_fragment:Qg,transmission_fragment:ex,transmission_pars_fragment:tx,uv_pars_fragment:nx,uv_pars_vertex:ix,uv_vertex:sx,worldpos_vertex:rx,background_vert:ax,background_frag:ox,backgroundCube_vert:lx,backgroundCube_frag:cx,cube_vert:hx,cube_frag:ux,depth_vert:dx,depth_frag:fx,distanceRGBA_vert:px,distanceRGBA_frag:mx,equirect_vert:gx,equirect_frag:xx,linedashed_vert:yx,linedashed_frag:vx,meshbasic_vert:_x,meshbasic_frag:Mx,meshlambert_vert:bx,meshlambert_frag:wx,meshmatcap_vert:Ex,meshmatcap_frag:Tx,meshnormal_vert:Sx,meshnormal_frag:Ax,meshphong_vert:Rx,meshphong_frag:Cx,meshphysical_vert:Ix,meshphysical_frag:Px,meshtoon_vert:Lx,meshtoon_frag:Dx,points_vert:Nx,points_frag:kx,shadow_vert:Ux,shadow_frag:Ox,sprite_vert:zx,sprite_frag:Fx},me={common:{diffuse:{value:new xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new xe(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},ni={basic:{uniforms:dn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:dn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new xe(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:dn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new xe(0)},specular:{value:new xe(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:dn([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:dn([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new xe(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:dn([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:dn([me.points,me.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:dn([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:dn([me.common,me.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:dn([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:dn([me.sprite,me.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:dn([me.common,me.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:dn([me.lights,me.fog,{color:{value:new xe(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};ni.physical={uniforms:dn([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new xe(0)},specularColor:{value:new xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};var Na={r:0,b:0,g:0},hs=new Kt,Bx=new He;function Hx(i,e,t,n,s,r,a){let o=new xe(0),c=r===!0?0:1,h,u,d=null,f=0,p=null;function y(v){let b=v.isScene===!0?v.background:null;return b&&b.isTexture&&(b=(v.backgroundBlurriness>0?t:e).get(b)),b}function x(v){let b=!1,w=y(v);w===null?m(o,c):w&&w.isColor&&(m(w,1),b=!0);let D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,b){let w=y(b);w&&(w.isCubeTexture||w.mapping===wo)?(u===void 0&&(u=new ce(new Te(1,1,1),new Ct({name:"BackgroundCubeMaterial",uniforms:Qs(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(D,A,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),hs.copy(b.backgroundRotation),hs.x*=-1,hs.y*=-1,hs.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(hs.y*=-1,hs.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Bx.makeRotationFromEuler(hs)),u.material.toneMapped=lt.getTransfer(w.colorSpace)!==gt,(d!==w||f!==w.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,d=w,f=w.version,p=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(h===void 0&&(h=new ce(new Pt(2,2),new Ct({name:"BackgroundMaterial",uniforms:Qs(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=w,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.toneMapped=lt.getTransfer(w.colorSpace)!==gt,w.matrixAutoUpdate===!0&&w.updateMatrix(),h.material.uniforms.uvTransform.value.copy(w.matrix),(d!==w||f!==w.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,d=w,f=w.version,p=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null))}function m(v,b){v.getRGB(Na,af(i)),n.buffers.color.setClear(Na.r,Na.g,Na.b,b,a)}return{getClearColor:function(){return o},setClearColor:function(v,b=1){o.set(v),c=b,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,m(o,c)},render:x,addToRenderList:g}}function Gx(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(_,P,U,O,H){let K=!1,V=d(O,U,P);r!==V&&(r=V,h(r.object)),K=p(_,O,U,H),K&&y(_,O,U,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,w(_,P,U,O),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return i.createVertexArray()}function h(_){return i.bindVertexArray(_)}function u(_){return i.deleteVertexArray(_)}function d(_,P,U){let O=U.wireframe===!0,H=n[_.id];H===void 0&&(H={},n[_.id]=H);let K=H[P.id];K===void 0&&(K={},H[P.id]=K);let V=K[O];return V===void 0&&(V=f(c()),K[O]=V),V}function f(_){let P=[],U=[],O=[];for(let H=0;H<t;H++)P[H]=0,U[H]=0,O[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:U,attributeDivisors:O,object:_,attributes:{},index:null}}function p(_,P,U,O){let H=r.attributes,K=P.attributes,V=0,se=U.getAttributes();for(let Y in se)if(se[Y].location>=0){let J=H[Y],oe=K[Y];if(oe===void 0&&(Y==="instanceMatrix"&&_.instanceMatrix&&(oe=_.instanceMatrix),Y==="instanceColor"&&_.instanceColor&&(oe=_.instanceColor)),J===void 0||J.attribute!==oe||oe&&J.data!==oe.data)return!0;V++}return r.attributesNum!==V||r.index!==O}function y(_,P,U,O){let H={},K=P.attributes,V=0,se=U.getAttributes();for(let Y in se)if(se[Y].location>=0){let J=K[Y];J===void 0&&(Y==="instanceMatrix"&&_.instanceMatrix&&(J=_.instanceMatrix),Y==="instanceColor"&&_.instanceColor&&(J=_.instanceColor));let oe={};oe.attribute=J,J&&J.data&&(oe.data=J.data),H[Y]=oe,V++}r.attributes=H,r.attributesNum=V,r.index=O}function x(){let _=r.newAttributes;for(let P=0,U=_.length;P<U;P++)_[P]=0}function g(_){m(_,0)}function m(_,P){let U=r.newAttributes,O=r.enabledAttributes,H=r.attributeDivisors;U[_]=1,O[_]===0&&(i.enableVertexAttribArray(_),O[_]=1),H[_]!==P&&(i.vertexAttribDivisor(_,P),H[_]=P)}function v(){let _=r.newAttributes,P=r.enabledAttributes;for(let U=0,O=P.length;U<O;U++)P[U]!==_[U]&&(i.disableVertexAttribArray(U),P[U]=0)}function b(_,P,U,O,H,K,V){V===!0?i.vertexAttribIPointer(_,P,U,H,K):i.vertexAttribPointer(_,P,U,O,H,K)}function w(_,P,U,O){x();let H=O.attributes,K=U.getAttributes(),V=P.defaultAttributeValues;for(let se in K){let Y=K[se];if(Y.location>=0){let ne=H[se];if(ne===void 0&&(se==="instanceMatrix"&&_.instanceMatrix&&(ne=_.instanceMatrix),se==="instanceColor"&&_.instanceColor&&(ne=_.instanceColor)),ne!==void 0){let J=ne.normalized,oe=ne.itemSize,ge=e.get(ne);if(ge===void 0)continue;let Re=ge.buffer,$=ge.type,ae=ge.bytesPerElement,Ee=$===i.INT||$===i.UNSIGNED_INT||ne.gpuType===Ah;if(ne.isInterleavedBufferAttribute){let de=ne.data,Le=de.stride,Fe=ne.offset;if(de.isInstancedInterleavedBuffer){for(let We=0;We<Y.locationSize;We++)m(Y.location+We,de.meshPerAttribute);_.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let We=0;We<Y.locationSize;We++)g(Y.location+We);i.bindBuffer(i.ARRAY_BUFFER,Re);for(let We=0;We<Y.locationSize;We++)b(Y.location+We,oe/Y.locationSize,$,J,Le*ae,(Fe+oe/Y.locationSize*We)*ae,Ee)}else{if(ne.isInstancedBufferAttribute){for(let de=0;de<Y.locationSize;de++)m(Y.location+de,ne.meshPerAttribute);_.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let de=0;de<Y.locationSize;de++)g(Y.location+de);i.bindBuffer(i.ARRAY_BUFFER,Re);for(let de=0;de<Y.locationSize;de++)b(Y.location+de,oe/Y.locationSize,$,J,oe*ae,oe/Y.locationSize*de*ae,Ee)}}else if(V!==void 0){let J=V[se];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(Y.location,J);break;case 3:i.vertexAttrib3fv(Y.location,J);break;case 4:i.vertexAttrib4fv(Y.location,J);break;default:i.vertexAttrib1fv(Y.location,J)}}}}v()}function D(){R();for(let _ in n){let P=n[_];for(let U in P){let O=P[U];for(let H in O)u(O[H].object),delete O[H];delete P[U]}delete n[_]}}function A(_){if(n[_.id]===void 0)return;let P=n[_.id];for(let U in P){let O=P[U];for(let H in O)u(O[H].object),delete O[H];delete P[U]}delete n[_.id]}function I(_){for(let P in n){let U=n[P];if(U[_.id]===void 0)continue;let O=U[_.id];for(let H in O)u(O[H].object),delete O[H];delete U[_.id]}}function R(){E(),a=!0,r!==s&&(r=s,h(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:E,dispose:D,releaseStatesOfGeometry:A,releaseStatesOfProgram:I,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function Vx(i,e,t){let n;function s(h){n=h}function r(h,u){i.drawArrays(n,h,u),t.update(u,n,1)}function a(h,u,d){d!==0&&(i.drawArraysInstanced(n,h,u,d),t.update(u,n,d))}function o(h,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,u,0,d);let p=0;for(let y=0;y<d;y++)p+=u[y];t.update(p,n,1)}function c(h,u,d,f){if(d===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let y=0;y<h.length;y++)a(h[y],u[y],f[y]);else{p.multiDrawArraysInstancedWEBGL(n,h,0,u,0,f,0,d);let y=0;for(let x=0;x<d;x++)y+=u[x]*f[x];t.update(y,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Wx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let I=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==fn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let R=I===Ut&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==jn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==bn&&!R)}function c(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",u=c(h);u!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);let d=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=y>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:y,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:w,vertexTextures:D,maxSamples:A}}function Xx(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Jn,o=new Ke,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let p=d.length!==0||f||n!==0||s;return s=f,n=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,p){let y=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,m=i.get(d);if(!s||y===null||y.length===0||r&&!g)r?u(null):h();else{let v=r?0:n,b=v*4,w=m.clippingState||null;c.value=w,w=u(y,f,b,p);for(let D=0;D!==b;++D)w[D]=t[D];m.clippingState=w,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,p,y){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=c.value,y!==!0||g===null){let m=p+x*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<m)&&(g=new Float32Array(m));for(let b=0,w=p;b!==x;++b,w+=4)a.copy(d[b]).applyMatrix4(v,o),a.normal.toArray(g,w),g[w+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function qx(i){let e=new WeakMap;function t(a,o){return o===Dr?a.mapping=Js:o===nc&&(a.mapping=js),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Dr||o===nc)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let h=new kc(c.height);return h.fromEquirectangularTexture(i,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var er=class extends eo{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Xs=4,ld=[.125,.215,.35,.446,.526,.582],ps=20,Ul=new er,cd=new xe,Ol=null,zl=0,Fl=0,Bl=!1,ds=(1+Math.sqrt(5))/2,Vs=1/ds,hd=[new L(-ds,Vs,0),new L(ds,Vs,0),new L(-Vs,0,ds),new L(Vs,0,ds),new L(0,ds,-Vs),new L(0,ds,Vs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],tr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Ol=this._renderer.getRenderTarget(),zl=this._renderer.getActiveCubeFace(),Fl=this._renderer.getActiveMipmapLevel(),Bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ol,zl,Fl),this._renderer.xr.enabled=Bl,e.scissorTest=!1,ka(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Js||e.mapping===js?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ol=this._renderer.getRenderTarget(),zl=this._renderer.getActiveCubeFace(),Fl=this._renderer.getActiveMipmapLevel(),Bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:Ut,format:fn,colorSpace:ri,depthBuffer:!1},s=ud(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ud(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yx(r)),this._blurMaterial=$x(r,e,t)}return s}_compileMaterial(e){let t=new ce(this._lodPlanes[0],e);this._renderer.compile(t,Ul)}_sceneToCubeUV(e,t,n,s){let o=new en(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(cd),u.toneMapping=Gi,u.autoClear=!1;let p=new ut({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1}),y=new ce(new Te,p),x=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,x=!0):(p.color.copy(cd),x=!0);for(let m=0;m<6;m++){let v=m%3;v===0?(o.up.set(0,c[m],0),o.lookAt(h[m],0,0)):v===1?(o.up.set(0,0,c[m]),o.lookAt(0,h[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,h[m]));let b=this._cubeSize;ka(s,v*b,m>2?b:0,b,b),u.setRenderTarget(s),x&&u.render(y,o),u.render(e,o)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Js||e.mapping===js;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=fd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new ce(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;ka(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Ul)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=hd[(s-r-1)%hd.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,d=new ce(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ps-1),x=r/y,g=isFinite(r)?1+Math.floor(u*x):ps;g>ps&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ps}`);let m=[],v=0;for(let I=0;I<ps;++I){let R=I/x,E=Math.exp(-R*R/2);m.push(E),I===0?v+=E:I<g&&(v+=2*E)}for(let I=0;I<m.length;I++)m[I]=m[I]/v;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:b}=this;f.dTheta.value=y,f.mipInt.value=b-n;let w=this._sizeLods[s],D=3*w*(s>b-Xs?s-b+Xs:0),A=4*(this._cubeSize-w);ka(t,D,A,3*w,2*w),c.setRenderTarget(t),c.render(d,Ul)}};function Yx(i){let e=[],t=[],n=[],s=i,r=i-Xs+1+ld.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-Xs?c=ld[a-i+Xs-1]:a===0&&(c=0),n.push(c);let h=1/(o-2),u=-h,d=1+h,f=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,y=6,x=3,g=2,m=1,v=new Float32Array(x*y*p),b=new Float32Array(g*y*p),w=new Float32Array(m*y*p);for(let A=0;A<p;A++){let I=A%3*2/3-1,R=A>2?0:-1,E=[I,R,0,I+2/3,R,0,I+2/3,R+1,0,I,R,0,I+2/3,R+1,0,I,R+1,0];v.set(E,x*y*A),b.set(f,g*y*A);let _=[A,A,A,A,A,A];w.set(_,m*y*A)}let D=new kt;D.setAttribute("position",new Ft(v,x)),D.setAttribute("uv",new Ft(b,g)),D.setAttribute("faceIndex",new Ft(w,m)),e.push(D),s>Xs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ud(i,e,t){let n=new Bt(i,e,t);return n.texture.mapping=wo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ka(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function $x(i,e,t){let n=new Float32Array(ps),s=new L(0,1,0);return new Ct({name:"SphericalGaussianBlur",defines:{n:ps,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:kh(),fragmentShader:`

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
		`,blending:Vt,depthTest:!1,depthWrite:!1})}function dd(){return new Ct({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:kh(),fragmentShader:`

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
		`,blending:Vt,depthTest:!1,depthWrite:!1})}function fd(){return new Ct({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vt,depthTest:!1,depthWrite:!1})}function kh(){return`

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
	`}function Zx(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let c=o.mapping,h=c===Dr||c===nc,u=c===Js||c===js;if(h||u){let d=e.get(o),f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new tr(i)),d=h?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{let p=o.image;return h&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new tr(i)),d=h?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let c=0,h=6;for(let u=0;u<h;u++)o[u]!==void 0&&c++;return c===h}function r(o){let c=o.target;c.removeEventListener("dispose",r);let h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Kx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Rr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Jx(i,e,t,n){let s={},r=new WeakMap;function a(d){let f=d.target;f.index!==null&&e.remove(f.index);for(let y in f.attributes)e.remove(f.attributes[y]);for(let y in f.morphAttributes){let x=f.morphAttributes[y];for(let g=0,m=x.length;g<m;g++)e.remove(x[g])}f.removeEventListener("dispose",a),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(d){let f=d.attributes;for(let y in f)e.update(f[y],i.ARRAY_BUFFER);let p=d.morphAttributes;for(let y in p){let x=p[y];for(let g=0,m=x.length;g<m;g++)e.update(x[g],i.ARRAY_BUFFER)}}function h(d){let f=[],p=d.index,y=d.attributes.position,x=0;if(p!==null){let v=p.array;x=p.version;for(let b=0,w=v.length;b<w;b+=3){let D=v[b+0],A=v[b+1],I=v[b+2];f.push(D,A,A,I,I,D)}}else if(y!==void 0){let v=y.array;x=y.version;for(let b=0,w=v.length/3-1;b<w;b+=3){let D=b+0,A=b+1,I=b+2;f.push(D,A,A,I,I,D)}}else return;let g=new(sf(f)?Qa:ja)(f,1);g.version=x;let m=r.get(d);m&&e.remove(m),r.set(d,g)}function u(d){let f=r.get(d);if(f){let p=d.index;p!==null&&f.version<p.version&&h(d)}else h(d);return r.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function jx(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*a),t.update(p,n,1)}function h(f,p,y){y!==0&&(i.drawElementsInstanced(n,p,r,f*a,y),t.update(p,n,y))}function u(f,p,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,y);let g=0;for(let m=0;m<y;m++)g+=p[m];t.update(g,n,1)}function d(f,p,y,x){if(y===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<f.length;m++)h(f[m]/a,p[m],x[m]);else{g.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,y);let m=0;for(let v=0;v<y;v++)m+=p[v]*x[v];t.update(m,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Qx(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ey(i,e,t){let n=new WeakMap,s=new _t;function r(a,o,c){let h=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,f=n.get(o);if(f===void 0||f.count!==d){let E=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();let p=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],b=0;p===!0&&(b=1),y===!0&&(b=2),x===!0&&(b=3);let w=o.attributes.position.count*b,D=1;w>e.maxTextureSize&&(D=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);let A=new Float32Array(w*D*4*d),I=new Ja(A,w,D,d);I.type=bn,I.needsUpdate=!0;let R=b*4;for(let _=0;_<d;_++){let P=g[_],U=m[_],O=v[_],H=w*D*4*_;for(let K=0;K<P.count;K++){let V=K*R;p===!0&&(s.fromBufferAttribute(P,K),A[H+V+0]=s.x,A[H+V+1]=s.y,A[H+V+2]=s.z,A[H+V+3]=0),y===!0&&(s.fromBufferAttribute(U,K),A[H+V+4]=s.x,A[H+V+5]=s.y,A[H+V+6]=s.z,A[H+V+7]=0),x===!0&&(s.fromBufferAttribute(O,K),A[H+V+8]=s.x,A[H+V+9]=s.y,A[H+V+10]=s.z,A[H+V+11]=O.itemSize===4?s.w:1)}}f={count:d,texture:I,size:new he(w,D)},n.set(o,f),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let x=0;x<h.length;x++)p+=h[x];let y=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",y),c.getUniforms().setValue(i,"morphTargetInfluences",h)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function ty(i,e,t,n){let s=new WeakMap;function r(c){let h=n.render.frame,u=c.geometry,d=e.get(c,u);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return d}function a(){s=new WeakMap}function o(c){let h=c.target;h.removeEventListener("dispose",o),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}var nr=class extends pn{constructor(e,t,n,s,r,a,o,c,h,u=Ys){if(u!==Ys&&u!==Xi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Ys&&(n=ms),n===void 0&&u===Xi&&(n=Wi),super(null,s,r,a,o,c,u,n,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:cn,this.minFilter=c!==void 0?c:cn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},lf=new pn,pd=new nr(1,1),cf=new Ja,hf=new Dc,uf=new to,md=[],gd=[],xd=new Float32Array(16),yd=new Float32Array(9),vd=new Float32Array(4);function lr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=md[s];if(r===void 0&&(r=new Float32Array(s),md[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Wt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Xt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function To(i,e){let t=gd[e];t===void 0&&(t=new Int32Array(e),gd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ny(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function iy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2fv(this.addr,e),Xt(t,e)}}function sy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Wt(t,e))return;i.uniform3fv(this.addr,e),Xt(t,e)}}function ry(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4fv(this.addr,e),Xt(t,e)}}function ay(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;vd.set(n),i.uniformMatrix2fv(this.addr,!1,vd),Xt(t,n)}}function oy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;yd.set(n),i.uniformMatrix3fv(this.addr,!1,yd),Xt(t,n)}}function ly(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Wt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Xt(t,e)}else{if(Wt(t,n))return;xd.set(n),i.uniformMatrix4fv(this.addr,!1,xd),Xt(t,n)}}function cy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function hy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2iv(this.addr,e),Xt(t,e)}}function uy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3iv(this.addr,e),Xt(t,e)}}function dy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4iv(this.addr,e),Xt(t,e)}}function fy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function py(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Wt(t,e))return;i.uniform2uiv(this.addr,e),Xt(t,e)}}function my(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Wt(t,e))return;i.uniform3uiv(this.addr,e),Xt(t,e)}}function gy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Wt(t,e))return;i.uniform4uiv(this.addr,e),Xt(t,e)}}function xy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(pd.compareFunction=nf,r=pd):r=lf,t.setTexture2D(e||r,s)}function yy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||hf,s)}function vy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||uf,s)}function _y(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||cf,s)}function My(i){switch(i){case 5126:return ny;case 35664:return iy;case 35665:return sy;case 35666:return ry;case 35674:return ay;case 35675:return oy;case 35676:return ly;case 5124:case 35670:return cy;case 35667:case 35671:return hy;case 35668:case 35672:return uy;case 35669:case 35673:return dy;case 5125:return fy;case 36294:return py;case 36295:return my;case 36296:return gy;case 35678:case 36198:case 36298:case 36306:case 35682:return xy;case 35679:case 36299:case 36307:return yy;case 35680:case 36300:case 36308:case 36293:return vy;case 36289:case 36303:case 36311:case 36292:return _y}}function by(i,e){i.uniform1fv(this.addr,e)}function wy(i,e){let t=lr(e,this.size,2);i.uniform2fv(this.addr,t)}function Ey(i,e){let t=lr(e,this.size,3);i.uniform3fv(this.addr,t)}function Ty(i,e){let t=lr(e,this.size,4);i.uniform4fv(this.addr,t)}function Sy(i,e){let t=lr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Ay(i,e){let t=lr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ry(i,e){let t=lr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Cy(i,e){i.uniform1iv(this.addr,e)}function Iy(i,e){i.uniform2iv(this.addr,e)}function Py(i,e){i.uniform3iv(this.addr,e)}function Ly(i,e){i.uniform4iv(this.addr,e)}function Dy(i,e){i.uniform1uiv(this.addr,e)}function Ny(i,e){i.uniform2uiv(this.addr,e)}function ky(i,e){i.uniform3uiv(this.addr,e)}function Uy(i,e){i.uniform4uiv(this.addr,e)}function Oy(i,e,t){let n=this.cache,s=e.length,r=To(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||lf,r[a])}function zy(i,e,t){let n=this.cache,s=e.length,r=To(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||hf,r[a])}function Fy(i,e,t){let n=this.cache,s=e.length,r=To(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||uf,r[a])}function By(i,e,t){let n=this.cache,s=e.length,r=To(t,s);Wt(n,r)||(i.uniform1iv(this.addr,r),Xt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||cf,r[a])}function Hy(i){switch(i){case 5126:return by;case 35664:return wy;case 35665:return Ey;case 35666:return Ty;case 35674:return Sy;case 35675:return Ay;case 35676:return Ry;case 5124:case 35670:return Cy;case 35667:case 35671:return Iy;case 35668:case 35672:return Py;case 35669:case 35673:return Ly;case 5125:return Dy;case 36294:return Ny;case 36295:return ky;case 36296:return Uy;case 35678:case 36198:case 36298:case 36306:case 35682:return Oy;case 35679:case 36299:case 36307:return zy;case 35680:case 36300:case 36308:case 36293:return Fy;case 36289:case 36303:case 36311:case 36292:return By}}var Uc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=My(t.type)}},Oc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Hy(t.type)}},zc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Hl=/(\w+)(\])?(\[|\.)?/g;function _d(i,e){i.seq.push(e),i.map[e.id]=e}function Gy(i,e,t){let n=i.name,s=n.length;for(Hl.lastIndex=0;;){let r=Hl.exec(n),a=Hl.lastIndex,o=r[1],c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){_d(t,h===void 0?new Uc(o,i,e):new Oc(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new zc(o),_d(t,d)),t=d}}}var Zs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Gy(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Md(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Vy=37297,Wy=0;function Xy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var bd=new Ke;function qy(i){lt._getMatrix(bd,lt.workingColorSpace,i);let e=`mat3( ${bd.elements.map(t=>t.toFixed(4))} )`;switch(lt.getTransfer(i)){case Eo:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function wd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Xy(i.getShaderSource(e),a)}else return s}function Yy(i,e){let t=qy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $y(i,e){let t;switch(e){case bh:t="Linear";break;case wh:t="Reinhard";break;case Eh:t="Cineon";break;case Wr:t="ACESFilmic";break;case Th:t="AgX";break;case Sh:t="Neutral";break;case w0:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ua=new L;function Zy(){lt.getLuminanceCoefficients(Ua);let i=Ua.x.toFixed(4),e=Ua.y.toFixed(4),t=Ua.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ky(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cr).join(`
`)}function Jy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function jy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Cr(i){return i!==""}function Ed(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Td(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Qy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fc(i){return i.replace(Qy,tv)}var ev=new Map;function tv(i,e){let t=je[e];if(t===void 0){let n=ev.get(e);if(n!==void 0)t=je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Fc(t)}var nv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sd(i){return i.replace(nv,iv)}function iv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ad(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function sv(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Wd?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===_h?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===wi&&(e="SHADOWMAP_TYPE_VSM"),e}function rv(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Js:case js:e="ENVMAP_TYPE_CUBE";break;case wo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function av(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case js:e="ENVMAP_MODE_REFRACTION";break}return e}function ov(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Xd:e="ENVMAP_BLENDING_MULTIPLY";break;case M0:e="ENVMAP_BLENDING_MIX";break;case b0:e="ENVMAP_BLENDING_ADD";break}return e}function lv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function cv(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=sv(t),h=rv(t),u=av(t),d=ov(t),f=lv(t),p=Ky(t),y=Jy(r),x=s.createProgram(),g,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Cr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(Cr).join(`
`),m.length>0&&(m+=`
`)):(g=[Ad(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cr).join(`
`),m=[Ad(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gi?"#define TONE_MAPPING":"",t.toneMapping!==Gi?je.tonemapping_pars_fragment:"",t.toneMapping!==Gi?$y("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,Yy("linearToOutputTexel",t.outputColorSpace),Zy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Cr).join(`
`)),a=Fc(a),a=Ed(a,t),a=Td(a,t),o=Fc(o),o=Ed(o,t),o=Td(o,t),a=Sd(a),o=Sd(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Hu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Hu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let b=v+g+a,w=v+m+o,D=Md(s,s.VERTEX_SHADER,b),A=Md(s,s.FRAGMENT_SHADER,w);s.attachShader(x,D),s.attachShader(x,A),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function I(P){if(i.debug.checkShaderErrors){let U=s.getProgramInfoLog(x).trim(),O=s.getShaderInfoLog(D).trim(),H=s.getShaderInfoLog(A).trim(),K=!0,V=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,D,A);else{let se=wd(s,D,"vertex"),Y=wd(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+U+`
`+se+`
`+Y)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(O===""||H==="")&&(V=!1);V&&(P.diagnostics={runnable:K,programLog:U,vertexShader:{log:O,prefix:g},fragmentShader:{log:H,prefix:m}})}s.deleteShader(D),s.deleteShader(A),R=new Zs(s,x),E=jy(s,x)}let R;this.getUniforms=function(){return R===void 0&&I(this),R};let E;this.getAttributes=function(){return E===void 0&&I(this),E};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(x,Vy)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Wy++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=D,this.fragmentShader=A,this}var hv=0,Bc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Hc(e),t.set(e,n)),n}},Hc=class{constructor(e){this.id=hv++,this.code=e,this.usedTimes=0}};function uv(i,e,t,n,s,r,a){let o=new Or,c=new Bc,h=new Set,u=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(E){return h.add(E),E===0?"uv":`uv${E}`}function g(E,_,P,U,O){let H=U.fog,K=O.geometry,V=E.isMeshStandardMaterial?U.environment:null,se=(E.isMeshStandardMaterial?t:e).get(E.envMap||V),Y=se&&se.mapping===wo?se.image.height:null,ne=y[E.type];E.precision!==null&&(p=s.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));let J=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,oe=J!==void 0?J.length:0,ge=0;K.morphAttributes.position!==void 0&&(ge=1),K.morphAttributes.normal!==void 0&&(ge=2),K.morphAttributes.color!==void 0&&(ge=3);let Re,$,ae,Ee;if(ne){let yt=ni[ne];Re=yt.vertexShader,$=yt.fragmentShader}else Re=E.vertexShader,$=E.fragmentShader,c.update(E),ae=c.getVertexShaderID(E),Ee=c.getFragmentShaderID(E);let de=i.getRenderTarget(),Le=i.state.buffers.depth.getReversed(),Fe=O.isInstancedMesh===!0,We=O.isBatchedMesh===!0,wt=!!E.map,rt=!!E.matcap,St=!!se,z=!!E.aoMap,sn=!!E.lightMap,nt=!!E.bumpMap,it=!!E.normalMap,Oe=!!E.displacementMap,xt=!!E.emissiveMap,ke=!!E.metalnessMap,C=!!E.roughnessMap,T=E.anisotropy>0,W=E.clearcoat>0,ee=E.dispersion>0,re=E.iridescence>0,j=E.sheen>0,Se=E.transmission>0,pe=T&&!!E.anisotropyMap,ye=W&&!!E.clearcoatMap,Qe=W&&!!E.clearcoatNormalMap,le=W&&!!E.clearcoatRoughnessMap,be=re&&!!E.iridescenceMap,Be=re&&!!E.iridescenceThicknessMap,Ve=j&&!!E.sheenColorMap,we=j&&!!E.sheenRoughnessMap,at=!!E.specularMap,Xe=!!E.specularColorMap,dt=!!E.specularIntensityMap,k=Se&&!!E.transmissionMap,fe=Se&&!!E.thicknessMap,Z=!!E.gradientMap,ie=!!E.alphaMap,Me=E.alphaTest>0,ve=!!E.alphaHash,$e=!!E.extensions,Dt=Gi;E.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Dt=i.toneMapping);let rn={shaderID:ne,shaderType:E.type,shaderName:E.name,vertexShader:Re,fragmentShader:$,defines:E.defines,customVertexShaderID:ae,customFragmentShaderID:Ee,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:We,batchingColor:We&&O._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&O.instanceColor!==null,instancingMorph:Fe&&O.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:de===null?i.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:ri,alphaToCoverage:!!E.alphaToCoverage,map:wt,matcap:rt,envMap:St,envMapMode:St&&se.mapping,envMapCubeUVHeight:Y,aoMap:z,lightMap:sn,bumpMap:nt,normalMap:it,displacementMap:f&&Oe,emissiveMap:xt,normalMapObjectSpace:it&&E.normalMapType===A0,normalMapTangentSpace:it&&E.normalMapType===Nh,metalnessMap:ke,roughnessMap:C,anisotropy:T,anisotropyMap:pe,clearcoat:W,clearcoatMap:ye,clearcoatNormalMap:Qe,clearcoatRoughnessMap:le,dispersion:ee,iridescence:re,iridescenceMap:be,iridescenceThicknessMap:Be,sheen:j,sheenColorMap:Ve,sheenRoughnessMap:we,specularMap:at,specularColorMap:Xe,specularIntensityMap:dt,transmission:Se,transmissionMap:k,thicknessMap:fe,gradientMap:Z,opaque:E.transparent===!1&&E.blending===qs&&E.alphaToCoverage===!1,alphaMap:ie,alphaTest:Me,alphaHash:ve,combine:E.combine,mapUv:wt&&x(E.map.channel),aoMapUv:z&&x(E.aoMap.channel),lightMapUv:sn&&x(E.lightMap.channel),bumpMapUv:nt&&x(E.bumpMap.channel),normalMapUv:it&&x(E.normalMap.channel),displacementMapUv:Oe&&x(E.displacementMap.channel),emissiveMapUv:xt&&x(E.emissiveMap.channel),metalnessMapUv:ke&&x(E.metalnessMap.channel),roughnessMapUv:C&&x(E.roughnessMap.channel),anisotropyMapUv:pe&&x(E.anisotropyMap.channel),clearcoatMapUv:ye&&x(E.clearcoatMap.channel),clearcoatNormalMapUv:Qe&&x(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&x(E.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&x(E.iridescenceMap.channel),iridescenceThicknessMapUv:Be&&x(E.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&x(E.sheenColorMap.channel),sheenRoughnessMapUv:we&&x(E.sheenRoughnessMap.channel),specularMapUv:at&&x(E.specularMap.channel),specularColorMapUv:Xe&&x(E.specularColorMap.channel),specularIntensityMapUv:dt&&x(E.specularIntensityMap.channel),transmissionMapUv:k&&x(E.transmissionMap.channel),thicknessMapUv:fe&&x(E.thicknessMap.channel),alphaMapUv:ie&&x(E.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(it||T),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!K.attributes.uv&&(wt||ie),fog:!!H,useFog:E.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Le,skinning:O.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:oe,morphTextureStride:ge,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Dt,decodeVideoTexture:wt&&E.map.isVideoTexture===!0&&lt.getTransfer(E.map.colorSpace)===gt,decodeVideoTextureEmissive:xt&&E.emissiveMap.isVideoTexture===!0&&lt.getTransfer(E.emissiveMap.colorSpace)===gt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Nt,flipSided:E.side===ln,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:$e&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:($e&&E.extensions.multiDraw===!0||We)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return rn.vertexUv1s=h.has(1),rn.vertexUv2s=h.has(2),rn.vertexUv3s=h.has(3),h.clear(),rn}function m(E){let _=[];if(E.shaderID?_.push(E.shaderID):(_.push(E.customVertexShaderID),_.push(E.customFragmentShaderID)),E.defines!==void 0)for(let P in E.defines)_.push(P),_.push(E.defines[P]);return E.isRawShaderMaterial===!1&&(v(_,E),b(_,E),_.push(i.outputColorSpace)),_.push(E.customProgramCacheKey),_.join()}function v(E,_){E.push(_.precision),E.push(_.outputColorSpace),E.push(_.envMapMode),E.push(_.envMapCubeUVHeight),E.push(_.mapUv),E.push(_.alphaMapUv),E.push(_.lightMapUv),E.push(_.aoMapUv),E.push(_.bumpMapUv),E.push(_.normalMapUv),E.push(_.displacementMapUv),E.push(_.emissiveMapUv),E.push(_.metalnessMapUv),E.push(_.roughnessMapUv),E.push(_.anisotropyMapUv),E.push(_.clearcoatMapUv),E.push(_.clearcoatNormalMapUv),E.push(_.clearcoatRoughnessMapUv),E.push(_.iridescenceMapUv),E.push(_.iridescenceThicknessMapUv),E.push(_.sheenColorMapUv),E.push(_.sheenRoughnessMapUv),E.push(_.specularMapUv),E.push(_.specularColorMapUv),E.push(_.specularIntensityMapUv),E.push(_.transmissionMapUv),E.push(_.thicknessMapUv),E.push(_.combine),E.push(_.fogExp2),E.push(_.sizeAttenuation),E.push(_.morphTargetsCount),E.push(_.morphAttributeCount),E.push(_.numDirLights),E.push(_.numPointLights),E.push(_.numSpotLights),E.push(_.numSpotLightMaps),E.push(_.numHemiLights),E.push(_.numRectAreaLights),E.push(_.numDirLightShadows),E.push(_.numPointLightShadows),E.push(_.numSpotLightShadows),E.push(_.numSpotLightShadowsWithMaps),E.push(_.numLightProbes),E.push(_.shadowMapType),E.push(_.toneMapping),E.push(_.numClippingPlanes),E.push(_.numClipIntersection),E.push(_.depthPacking)}function b(E,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reverseDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),E.push(o.mask)}function w(E){let _=y[E.type],P;if(_){let U=ni[_];P=wn.clone(U.uniforms)}else P=E.uniforms;return P}function D(E,_){let P;for(let U=0,O=u.length;U<O;U++){let H=u[U];if(H.cacheKey===_){P=H,++P.usedTimes;break}}return P===void 0&&(P=new cv(i,_,E,r),u.push(P)),P}function A(E){if(--E.usedTimes===0){let _=u.indexOf(E);u[_]=u[u.length-1],u.pop(),E.destroy()}}function I(E){c.remove(E)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:w,acquireProgram:D,releaseProgram:A,releaseShaderCache:I,programs:u,dispose:R}}function dv(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function fv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Rd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Cd(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d,f,p,y,x,g){let m=i[e];return m===void 0?(m={id:d.id,object:d,geometry:f,material:p,groupOrder:y,renderOrder:d.renderOrder,z:x,group:g},i[e]=m):(m.id=d.id,m.object=d,m.geometry=f,m.material=p,m.groupOrder=y,m.renderOrder=d.renderOrder,m.z=x,m.group=g),e++,m}function o(d,f,p,y,x,g){let m=a(d,f,p,y,x,g);p.transmission>0?n.push(m):p.transparent===!0?s.push(m):t.push(m)}function c(d,f,p,y,x,g){let m=a(d,f,p,y,x,g);p.transmission>0?n.unshift(m):p.transparent===!0?s.unshift(m):t.unshift(m)}function h(d,f){t.length>1&&t.sort(d||fv),n.length>1&&n.sort(f||Rd),s.length>1&&s.sort(f||Rd)}function u(){for(let d=e,f=i.length;d<f;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:u,sort:h}}function pv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Cd,i.set(n,[a])):s>=r.length?(a=new Cd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function mv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new xe};break;case"SpotLight":t={position:new L,direction:new L,color:new xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new xe,groundColor:new xe};break;case"RectAreaLight":t={color:new xe,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function gv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var xv=0;function yv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function vv(i){let e=new mv,t=gv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new L);let s=new L,r=new He,a=new He;function o(h){let u=0,d=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let p=0,y=0,x=0,g=0,m=0,v=0,b=0,w=0,D=0,A=0,I=0;h.sort(yv);for(let E=0,_=h.length;E<_;E++){let P=h[E],U=P.color,O=P.intensity,H=P.distance,K=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=U.r*O,d+=U.g*O,f+=U.b*O;else if(P.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(P.sh.coefficients[V],O);I++}else if(P.isDirectionalLight){let V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let se=P.shadow,Y=t.get(P);Y.shadowIntensity=se.intensity,Y.shadowBias=se.bias,Y.shadowNormalBias=se.normalBias,Y.shadowRadius=se.radius,Y.shadowMapSize=se.mapSize,n.directionalShadow[p]=Y,n.directionalShadowMap[p]=K,n.directionalShadowMatrix[p]=P.shadow.matrix,v++}n.directional[p]=V,p++}else if(P.isSpotLight){let V=e.get(P);V.position.setFromMatrixPosition(P.matrixWorld),V.color.copy(U).multiplyScalar(O),V.distance=H,V.coneCos=Math.cos(P.angle),V.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),V.decay=P.decay,n.spot[x]=V;let se=P.shadow;if(P.map&&(n.spotLightMap[D]=P.map,D++,se.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[x]=se.matrix,P.castShadow){let Y=t.get(P);Y.shadowIntensity=se.intensity,Y.shadowBias=se.bias,Y.shadowNormalBias=se.normalBias,Y.shadowRadius=se.radius,Y.shadowMapSize=se.mapSize,n.spotShadow[x]=Y,n.spotShadowMap[x]=K,w++}x++}else if(P.isRectAreaLight){let V=e.get(P);V.color.copy(U).multiplyScalar(O),V.halfWidth.set(P.width*.5,0,0),V.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=V,g++}else if(P.isPointLight){let V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),V.distance=P.distance,V.decay=P.decay,P.castShadow){let se=P.shadow,Y=t.get(P);Y.shadowIntensity=se.intensity,Y.shadowBias=se.bias,Y.shadowNormalBias=se.normalBias,Y.shadowRadius=se.radius,Y.shadowMapSize=se.mapSize,Y.shadowCameraNear=se.camera.near,Y.shadowCameraFar=se.camera.far,n.pointShadow[y]=Y,n.pointShadowMap[y]=K,n.pointShadowMatrix[y]=P.shadow.matrix,b++}n.point[y]=V,y++}else if(P.isHemisphereLight){let V=e.get(P);V.skyColor.copy(P.color).multiplyScalar(O),V.groundColor.copy(P.groundColor).multiplyScalar(O),n.hemi[m]=V,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=me.LTC_FLOAT_1,n.rectAreaLTC2=me.LTC_FLOAT_2):(n.rectAreaLTC1=me.LTC_HALF_1,n.rectAreaLTC2=me.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;let R=n.hash;(R.directionalLength!==p||R.pointLength!==y||R.spotLength!==x||R.rectAreaLength!==g||R.hemiLength!==m||R.numDirectionalShadows!==v||R.numPointShadows!==b||R.numSpotShadows!==w||R.numSpotMaps!==D||R.numLightProbes!==I)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=g,n.point.length=y,n.hemi.length=m,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=w+D-A,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=I,R.directionalLength=p,R.pointLength=y,R.spotLength=x,R.rectAreaLength=g,R.hemiLength=m,R.numDirectionalShadows=v,R.numPointShadows=b,R.numSpotShadows=w,R.numSpotMaps=D,R.numLightProbes=I,n.version=xv++)}function c(h,u){let d=0,f=0,p=0,y=0,x=0,g=u.matrixWorldInverse;for(let m=0,v=h.length;m<v;m++){let b=h[m];if(b.isDirectionalLight){let w=n.directional[d];w.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(g),d++}else if(b.isSpotLight){let w=n.spot[p];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(g),w.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(g),p++}else if(b.isRectAreaLight){let w=n.rectArea[y];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(g),a.identity(),r.copy(b.matrixWorld),r.premultiply(g),a.extractRotation(r),w.halfWidth.set(b.width*.5,0,0),w.halfHeight.set(0,b.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),y++}else if(b.isPointLight){let w=n.point[f];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(g),f++}else if(b.isHemisphereLight){let w=n.hemi[x];w.direction.setFromMatrixPosition(b.matrixWorld),w.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function Id(i){let e=new vv(i),t=[],n=[];function s(u){h.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}let h={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function _v(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Id(i),e.set(s,[o])):r>=a.length?(o=new Id(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Gc=class extends Ri{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=T0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Vc=class extends Ri{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Mv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bv=`uniform sampler2D shadow_pass;
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
}`;function wv(i,e,t){let n=new zr,s=new he,r=new he,a=new _t,o=new Gc({depthPacking:S0}),c=new Vc,h={},u=t.maxTextureSize,d={[Vi]:ln,[ln]:Vi,[Nt]:Nt},f=new Ct({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:Mv,fragmentShader:bv}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let y=new kt;y.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new ce(y,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wd;let m=this.type;this.render=function(A,I,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;let E=i.getRenderTarget(),_=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),U=i.state;U.setBlending(Vt),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let O=m!==wi&&this.type===wi,H=m===wi&&this.type!==wi;for(let K=0,V=A.length;K<V;K++){let se=A[K],Y=se.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);let ne=Y.getFrameExtents();if(s.multiply(ne),r.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,Y.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,Y.mapSize.y=r.y)),Y.map===null||O===!0||H===!0){let oe=this.type!==wi?{minFilter:cn,magFilter:cn}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Bt(s.x,s.y,oe),Y.map.texture.name=se.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();let J=Y.getViewportCount();for(let oe=0;oe<J;oe++){let ge=Y.getViewport(oe);a.set(r.x*ge.x,r.y*ge.y,r.x*ge.z,r.y*ge.w),U.viewport(a),Y.updateMatrices(se,oe),n=Y.getFrustum(),w(I,R,Y.camera,se,this.type)}Y.isPointLightShadow!==!0&&this.type===wi&&v(Y,R),Y.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(E,_,P)};function v(A,I){let R=e.update(x);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Bt(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(I,null,R,f,x,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(I,null,R,p,x,null)}function b(A,I,R,E){let _=null,P=R.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)_=P;else if(_=R.isPointLight===!0?c:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){let U=_.uuid,O=I.uuid,H=h[U];H===void 0&&(H={},h[U]=H);let K=H[O];K===void 0&&(K=_.clone(),H[O]=K,I.addEventListener("dispose",D)),_=K}if(_.visible=I.visible,_.wireframe=I.wireframe,E===wi?_.side=I.shadowSide!==null?I.shadowSide:I.side:_.side=I.shadowSide!==null?I.shadowSide:d[I.side],_.alphaMap=I.alphaMap,_.alphaTest=I.alphaTest,_.map=I.map,_.clipShadows=I.clipShadows,_.clippingPlanes=I.clippingPlanes,_.clipIntersection=I.clipIntersection,_.displacementMap=I.displacementMap,_.displacementScale=I.displacementScale,_.displacementBias=I.displacementBias,_.wireframeLinewidth=I.wireframeLinewidth,_.linewidth=I.linewidth,R.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let U=i.properties.get(_);U.light=R}return _}function w(A,I,R,E,_){if(A.visible===!1)return;if(A.layers.test(I.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&_===wi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,A.matrixWorld);let O=e.update(A),H=A.material;if(Array.isArray(H)){let K=O.groups;for(let V=0,se=K.length;V<se;V++){let Y=K[V],ne=H[Y.materialIndex];if(ne&&ne.visible){let J=b(A,ne,E,_);A.onBeforeShadow(i,A,I,R,O,J,Y),i.renderBufferDirect(R,null,O,J,A,Y),A.onAfterShadow(i,A,I,R,O,J,Y)}}}else if(H.visible){let K=b(A,H,E,_);A.onBeforeShadow(i,A,I,R,O,K,null),i.renderBufferDirect(R,null,O,K,A,null),A.onAfterShadow(i,A,I,R,O,K,null)}}let U=A.children;for(let O=0,H=U.length;O<H;O++)w(U[O],I,R,E,_)}function D(A){A.target.removeEventListener("dispose",D);for(let R in h){let E=h[R],_=A.target.uuid;_ in E&&(E[_].dispose(),delete E[_])}}}var Ev={[Zl]:Kl,[Jl]:ec,[jl]:tc,[Ks]:Ql,[Kl]:Zl,[ec]:Jl,[tc]:jl,[Ql]:Ks};function Tv(i,e){function t(){let k=!1,fe=new _t,Z=null,ie=new _t(0,0,0,0);return{setMask:function(Me){Z!==Me&&!k&&(i.colorMask(Me,Me,Me,Me),Z=Me)},setLocked:function(Me){k=Me},setClear:function(Me,ve,$e,Dt,rn){rn===!0&&(Me*=Dt,ve*=Dt,$e*=Dt),fe.set(Me,ve,$e,Dt),ie.equals(fe)===!1&&(i.clearColor(Me,ve,$e,Dt),ie.copy(fe))},reset:function(){k=!1,Z=null,ie.set(-1,0,0,0)}}}function n(){let k=!1,fe=!1,Z=null,ie=null,Me=null;return{setReversed:function(ve){if(fe!==ve){let $e=e.get("EXT_clip_control");fe?$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.ZERO_TO_ONE_EXT):$e.clipControlEXT($e.LOWER_LEFT_EXT,$e.NEGATIVE_ONE_TO_ONE_EXT);let Dt=Me;Me=null,this.setClear(Dt)}fe=ve},getReversed:function(){return fe},setTest:function(ve){ve?de(i.DEPTH_TEST):Le(i.DEPTH_TEST)},setMask:function(ve){Z!==ve&&!k&&(i.depthMask(ve),Z=ve)},setFunc:function(ve){if(fe&&(ve=Ev[ve]),ie!==ve){switch(ve){case Zl:i.depthFunc(i.NEVER);break;case Kl:i.depthFunc(i.ALWAYS);break;case Jl:i.depthFunc(i.LESS);break;case Ks:i.depthFunc(i.LEQUAL);break;case jl:i.depthFunc(i.EQUAL);break;case Ql:i.depthFunc(i.GEQUAL);break;case ec:i.depthFunc(i.GREATER);break;case tc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ie=ve}},setLocked:function(ve){k=ve},setClear:function(ve){Me!==ve&&(fe&&(ve=1-ve),i.clearDepth(ve),Me=ve)},reset:function(){k=!1,Z=null,ie=null,Me=null,fe=!1}}}function s(){let k=!1,fe=null,Z=null,ie=null,Me=null,ve=null,$e=null,Dt=null,rn=null;return{setTest:function(yt){k||(yt?de(i.STENCIL_TEST):Le(i.STENCIL_TEST))},setMask:function(yt){fe!==yt&&!k&&(i.stencilMask(yt),fe=yt)},setFunc:function(yt,qn,mi){(Z!==yt||ie!==qn||Me!==mi)&&(i.stencilFunc(yt,qn,mi),Z=yt,ie=qn,Me=mi)},setOp:function(yt,qn,mi){(ve!==yt||$e!==qn||Dt!==mi)&&(i.stencilOp(yt,qn,mi),ve=yt,$e=qn,Dt=mi)},setLocked:function(yt){k=yt},setClear:function(yt){rn!==yt&&(i.clearStencil(yt),rn=yt)},reset:function(){k=!1,fe=null,Z=null,ie=null,Me=null,ve=null,$e=null,Dt=null,rn=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,h=new WeakMap,u={},d={},f=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,b=null,w=null,D=null,A=null,I=new xe(0,0,0),R=0,E=!1,_=null,P=null,U=null,O=null,H=null,K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,se=0,Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(Y)[1]),V=se>=1):Y.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),V=se>=2);let ne=null,J={},oe=i.getParameter(i.SCISSOR_BOX),ge=i.getParameter(i.VIEWPORT),Re=new _t().fromArray(oe),$=new _t().fromArray(ge);function ae(k,fe,Z,ie){let Me=new Uint8Array(4),ve=i.createTexture();i.bindTexture(k,ve),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let $e=0;$e<Z;$e++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,ie,0,i.RGBA,i.UNSIGNED_BYTE,Me):i.texImage2D(fe+$e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Me);return ve}let Ee={};Ee[i.TEXTURE_2D]=ae(i.TEXTURE_2D,i.TEXTURE_2D,1),Ee[i.TEXTURE_CUBE_MAP]=ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ee[i.TEXTURE_2D_ARRAY]=ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ee[i.TEXTURE_3D]=ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),de(i.DEPTH_TEST),a.setFunc(Ks),nt(!1),it(Du),de(i.CULL_FACE),z(Vt);function de(k){u[k]!==!0&&(i.enable(k),u[k]=!0)}function Le(k){u[k]!==!1&&(i.disable(k),u[k]=!1)}function Fe(k,fe){return d[k]!==fe?(i.bindFramebuffer(k,fe),d[k]=fe,k===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=fe),k===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function We(k,fe){let Z=p,ie=!1;if(k){Z=f.get(fe),Z===void 0&&(Z=[],f.set(fe,Z));let Me=k.textures;if(Z.length!==Me.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let ve=0,$e=Me.length;ve<$e;ve++)Z[ve]=i.COLOR_ATTACHMENT0+ve;Z.length=Me.length,ie=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,ie=!0);ie&&i.drawBuffers(Z)}function wt(k){return y!==k?(i.useProgram(k),y=k,!0):!1}let rt={[Fn]:i.FUNC_ADD,[o0]:i.FUNC_SUBTRACT,[l0]:i.FUNC_REVERSE_SUBTRACT};rt[c0]=i.MIN,rt[h0]=i.MAX;let St={[or]:i.ZERO,[u0]:i.ONE,[d0]:i.SRC_COLOR,[Yl]:i.SRC_ALPHA,[g0]:i.SRC_ALPHA_SATURATE,[bo]:i.DST_COLOR,[Mo]:i.DST_ALPHA,[f0]:i.ONE_MINUS_SRC_COLOR,[$l]:i.ONE_MINUS_SRC_ALPHA,[m0]:i.ONE_MINUS_DST_COLOR,[p0]:i.ONE_MINUS_DST_ALPHA,[x0]:i.CONSTANT_COLOR,[y0]:i.ONE_MINUS_CONSTANT_COLOR,[v0]:i.CONSTANT_ALPHA,[_0]:i.ONE_MINUS_CONSTANT_ALPHA};function z(k,fe,Z,ie,Me,ve,$e,Dt,rn,yt){if(k===Vt){x===!0&&(Le(i.BLEND),x=!1);return}if(x===!1&&(de(i.BLEND),x=!0),k!==Mh){if(k!==g||yt!==E){if((m!==Fn||w!==Fn)&&(i.blendEquation(i.FUNC_ADD),m=Fn,w=Fn),yt)switch(k){case qs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case hn:i.blendFunc(i.ONE,i.ONE);break;case Nu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ku:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case qs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case hn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Nu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ku:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}v=null,b=null,D=null,A=null,I.set(0,0,0),R=0,g=k,E=yt}return}Me=Me||fe,ve=ve||Z,$e=$e||ie,(fe!==m||Me!==w)&&(i.blendEquationSeparate(rt[fe],rt[Me]),m=fe,w=Me),(Z!==v||ie!==b||ve!==D||$e!==A)&&(i.blendFuncSeparate(St[Z],St[ie],St[ve],St[$e]),v=Z,b=ie,D=ve,A=$e),(Dt.equals(I)===!1||rn!==R)&&(i.blendColor(Dt.r,Dt.g,Dt.b,rn),I.copy(Dt),R=rn),g=k,E=!1}function sn(k,fe){k.side===Nt?Le(i.CULL_FACE):de(i.CULL_FACE);let Z=k.side===ln;fe&&(Z=!Z),nt(Z),k.blending===qs&&k.transparent===!1?z(Vt):z(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);let ie=k.stencilWrite;o.setTest(ie),ie&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),xt(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?de(i.SAMPLE_ALPHA_TO_COVERAGE):Le(i.SAMPLE_ALPHA_TO_COVERAGE)}function nt(k){_!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),_=k)}function it(k){k!==r0?(de(i.CULL_FACE),k!==P&&(k===Du?i.cullFace(i.BACK):k===a0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Le(i.CULL_FACE),P=k}function Oe(k){k!==U&&(V&&i.lineWidth(k),U=k)}function xt(k,fe,Z){k?(de(i.POLYGON_OFFSET_FILL),(O!==fe||H!==Z)&&(i.polygonOffset(fe,Z),O=fe,H=Z)):Le(i.POLYGON_OFFSET_FILL)}function ke(k){k?de(i.SCISSOR_TEST):Le(i.SCISSOR_TEST)}function C(k){k===void 0&&(k=i.TEXTURE0+K-1),ne!==k&&(i.activeTexture(k),ne=k)}function T(k,fe,Z){Z===void 0&&(ne===null?Z=i.TEXTURE0+K-1:Z=ne);let ie=J[Z];ie===void 0&&(ie={type:void 0,texture:void 0},J[Z]=ie),(ie.type!==k||ie.texture!==fe)&&(ne!==Z&&(i.activeTexture(Z),ne=Z),i.bindTexture(k,fe||Ee[k]),ie.type=k,ie.texture=fe)}function W(){let k=J[ne];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function ee(){try{i.compressedTexImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function re(){try{i.compressedTexImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function j(){try{i.texSubImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Se(){try{i.texSubImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function pe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ye(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Qe(){try{i.texStorage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function le(){try{i.texStorage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function be(){try{i.texImage2D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Be(){try{i.texImage3D.apply(i,arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ve(k){Re.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),Re.copy(k))}function we(k){$.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),$.copy(k))}function at(k,fe){let Z=h.get(fe);Z===void 0&&(Z=new WeakMap,h.set(fe,Z));let ie=Z.get(k);ie===void 0&&(ie=i.getUniformBlockIndex(fe,k.name),Z.set(k,ie))}function Xe(k,fe){let ie=h.get(fe).get(k);c.get(fe)!==ie&&(i.uniformBlockBinding(fe,ie,k.__bindingPointIndex),c.set(fe,ie))}function dt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ne=null,J={},d={},f=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,b=null,w=null,D=null,A=null,I=new xe(0,0,0),R=0,E=!1,_=null,P=null,U=null,O=null,H=null,Re.set(0,0,i.canvas.width,i.canvas.height),$.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:de,disable:Le,bindFramebuffer:Fe,drawBuffers:We,useProgram:wt,setBlending:z,setMaterial:sn,setFlipSided:nt,setCullFace:it,setLineWidth:Oe,setPolygonOffset:xt,setScissorTest:ke,activeTexture:C,bindTexture:T,unbindTexture:W,compressedTexImage2D:ee,compressedTexImage3D:re,texImage2D:be,texImage3D:Be,updateUBOMapping:at,uniformBlockBinding:Xe,texStorage2D:Qe,texStorage3D:le,texSubImage2D:j,texSubImage3D:Se,compressedTexSubImage2D:pe,compressedTexSubImage3D:ye,scissor:Ve,viewport:we,reset:dt}}function Pd(i,e,t,n){let s=Sv(n);switch(t){case Kd:return i*e;case jd:return i*e;case Qd:return i*e*2;case Ih:return i*e/s.components*s.byteLength;case Ph:return i*e/s.components*s.byteLength;case ef:return i*e*2/s.components*s.byteLength;case Lh:return i*e*2/s.components*s.byteLength;case Jd:return i*e*3/s.components*s.byteLength;case fn:return i*e*4/s.components*s.byteLength;case Dh:return i*e*4/s.components*s.byteLength;case Ga:case Va:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Wa:case Xa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case rc:case oc:return Math.max(i,16)*Math.max(e,8)/4;case sc:case ac:return Math.max(i,8)*Math.max(e,8)/2;case lc:case cc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case hc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case uc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case dc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case fc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case pc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case mc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case gc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case xc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case yc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case vc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case _c:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Mc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case bc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case wc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ec:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case qa:case Tc:case Sc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case tf:case Ac:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Rc:case Cc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Sv(i){switch(i){case jn:case Yd:return{byteLength:1,components:1};case Nr:case $d:case Ut:return{byteLength:2,components:1};case Rh:case Ch:return{byteLength:2,components:4};case ms:case Ah:case bn:return{byteLength:4,components:1};case Zd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Av(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new he,u=new WeakMap,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(C,T){return p?new OffscreenCanvas(C,T):kr("canvas")}function x(C,T,W){let ee=1,re=ke(C);if((re.width>W||re.height>W)&&(ee=W/Math.max(re.width,re.height)),ee<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let j=Math.floor(ee*re.width),Se=Math.floor(ee*re.height);d===void 0&&(d=y(j,Se));let pe=T?y(j,Se):d;return pe.width=j,pe.height=Se,pe.getContext("2d").drawImage(C,0,0,j,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+j+"x"+Se+")."),pe}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),C;return C}function g(C){return C.generateMipmaps}function m(C){i.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(C,T,W,ee,re=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let j=T;if(T===i.RED&&(W===i.FLOAT&&(j=i.R32F),W===i.HALF_FLOAT&&(j=i.R16F),W===i.UNSIGNED_BYTE&&(j=i.R8)),T===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.R8UI),W===i.UNSIGNED_SHORT&&(j=i.R16UI),W===i.UNSIGNED_INT&&(j=i.R32UI),W===i.BYTE&&(j=i.R8I),W===i.SHORT&&(j=i.R16I),W===i.INT&&(j=i.R32I)),T===i.RG&&(W===i.FLOAT&&(j=i.RG32F),W===i.HALF_FLOAT&&(j=i.RG16F),W===i.UNSIGNED_BYTE&&(j=i.RG8)),T===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.RG8UI),W===i.UNSIGNED_SHORT&&(j=i.RG16UI),W===i.UNSIGNED_INT&&(j=i.RG32UI),W===i.BYTE&&(j=i.RG8I),W===i.SHORT&&(j=i.RG16I),W===i.INT&&(j=i.RG32I)),T===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.RGB8UI),W===i.UNSIGNED_SHORT&&(j=i.RGB16UI),W===i.UNSIGNED_INT&&(j=i.RGB32UI),W===i.BYTE&&(j=i.RGB8I),W===i.SHORT&&(j=i.RGB16I),W===i.INT&&(j=i.RGB32I)),T===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),W===i.UNSIGNED_INT&&(j=i.RGBA32UI),W===i.BYTE&&(j=i.RGBA8I),W===i.SHORT&&(j=i.RGBA16I),W===i.INT&&(j=i.RGBA32I)),T===i.RGB&&W===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),T===i.RGBA){let Se=re?Eo:lt.getTransfer(ee);W===i.FLOAT&&(j=i.RGBA32F),W===i.HALF_FLOAT&&(j=i.RGBA16F),W===i.UNSIGNED_BYTE&&(j=Se===gt?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function w(C,T){let W;return C?T===null||T===ms||T===Wi?W=i.DEPTH24_STENCIL8:T===bn?W=i.DEPTH32F_STENCIL8:T===Nr&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ms||T===Wi?W=i.DEPTH_COMPONENT24:T===bn?W=i.DEPTH_COMPONENT32F:T===Nr&&(W=i.DEPTH_COMPONENT16),W}function D(C,T){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==cn&&C.minFilter!==Gt?Math.log2(Math.max(T.width,T.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?T.mipmaps.length:1}function A(C){let T=C.target;T.removeEventListener("dispose",A),R(T),T.isVideoTexture&&u.delete(T)}function I(C){let T=C.target;T.removeEventListener("dispose",I),_(T)}function R(C){let T=n.get(C);if(T.__webglInit===void 0)return;let W=C.source,ee=f.get(W);if(ee){let re=ee[T.__cacheKey];re.usedTimes--,re.usedTimes===0&&E(C),Object.keys(ee).length===0&&f.delete(W)}n.remove(C)}function E(C){let T=n.get(C);i.deleteTexture(T.__webglTexture);let W=C.source,ee=f.get(W);delete ee[T.__cacheKey],a.memory.textures--}function _(C){let T=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(T.__webglFramebuffer[ee]))for(let re=0;re<T.__webglFramebuffer[ee].length;re++)i.deleteFramebuffer(T.__webglFramebuffer[ee][re]);else i.deleteFramebuffer(T.__webglFramebuffer[ee]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[ee])}else{if(Array.isArray(T.__webglFramebuffer))for(let ee=0;ee<T.__webglFramebuffer.length;ee++)i.deleteFramebuffer(T.__webglFramebuffer[ee]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let ee=0;ee<T.__webglColorRenderbuffer.length;ee++)T.__webglColorRenderbuffer[ee]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[ee]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let W=C.textures;for(let ee=0,re=W.length;ee<re;ee++){let j=n.get(W[ee]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),a.memory.textures--),n.remove(W[ee])}n.remove(C)}let P=0;function U(){P=0}function O(){let C=P;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),P+=1,C}function H(C){let T=[];return T.push(C.wrapS),T.push(C.wrapT),T.push(C.wrapR||0),T.push(C.magFilter),T.push(C.minFilter),T.push(C.anisotropy),T.push(C.internalFormat),T.push(C.format),T.push(C.type),T.push(C.generateMipmaps),T.push(C.premultiplyAlpha),T.push(C.flipY),T.push(C.unpackAlignment),T.push(C.colorSpace),T.join()}function K(C,T){let W=n.get(C);if(C.isVideoTexture&&Oe(C),C.isRenderTargetTexture===!1&&C.version>0&&W.__version!==C.version){let ee=C.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(W,C,T);return}}t.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+T)}function V(C,T){let W=n.get(C);if(C.version>0&&W.__version!==C.version){$(W,C,T);return}t.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+T)}function se(C,T){let W=n.get(C);if(C.version>0&&W.__version!==C.version){$(W,C,T);return}t.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+T)}function Y(C,T){let W=n.get(C);if(C.version>0&&W.__version!==C.version){ae(W,C,T);return}t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+T)}let ne={[Ln]:i.REPEAT,[Pn]:i.CLAMP_TO_EDGE,[ic]:i.MIRRORED_REPEAT},J={[cn]:i.NEAREST,[E0]:i.NEAREST_MIPMAP_NEAREST,[ga]:i.NEAREST_MIPMAP_LINEAR,[Gt]:i.LINEAR,[dl]:i.LINEAR_MIPMAP_NEAREST,[Hi]:i.LINEAR_MIPMAP_LINEAR},oe={[R0]:i.NEVER,[N0]:i.ALWAYS,[C0]:i.LESS,[nf]:i.LEQUAL,[I0]:i.EQUAL,[D0]:i.GEQUAL,[P0]:i.GREATER,[L0]:i.NOTEQUAL};function ge(C,T){if(T.type===bn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Gt||T.magFilter===dl||T.magFilter===ga||T.magFilter===Hi||T.minFilter===Gt||T.minFilter===dl||T.minFilter===ga||T.minFilter===Hi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,ne[T.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,ne[T.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,ne[T.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,J[T.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,J[T.minFilter]),T.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,oe[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===cn||T.minFilter!==ga&&T.minFilter!==Hi||T.type===bn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){let W=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Re(C,T){let W=!1;C.__webglInit===void 0&&(C.__webglInit=!0,T.addEventListener("dispose",A));let ee=T.source,re=f.get(ee);re===void 0&&(re={},f.set(ee,re));let j=H(T);if(j!==C.__cacheKey){re[j]===void 0&&(re[j]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),re[j].usedTimes++;let Se=re[C.__cacheKey];Se!==void 0&&(re[C.__cacheKey].usedTimes--,Se.usedTimes===0&&E(T)),C.__cacheKey=j,C.__webglTexture=re[j].texture}return W}function $(C,T,W){let ee=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(ee=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&(ee=i.TEXTURE_3D);let re=Re(C,T),j=T.source;t.bindTexture(ee,C.__webglTexture,i.TEXTURE0+W);let Se=n.get(j);if(j.version!==Se.__version||re===!0){t.activeTexture(i.TEXTURE0+W);let pe=lt.getPrimaries(lt.workingColorSpace),ye=T.colorSpace===Bi?null:lt.getPrimaries(T.colorSpace),Qe=T.colorSpace===Bi||pe===ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qe);let le=x(T.image,!1,s.maxTextureSize);le=xt(T,le);let be=r.convert(T.format,T.colorSpace),Be=r.convert(T.type),Ve=b(T.internalFormat,be,Be,T.colorSpace,T.isVideoTexture);ge(ee,T);let we,at=T.mipmaps,Xe=T.isVideoTexture!==!0,dt=Se.__version===void 0||re===!0,k=j.dataReady,fe=D(T,le);if(T.isDepthTexture)Ve=w(T.format===Xi,T.type),dt&&(Xe?t.texStorage2D(i.TEXTURE_2D,1,Ve,le.width,le.height):t.texImage2D(i.TEXTURE_2D,0,Ve,le.width,le.height,0,be,Be,null));else if(T.isDataTexture)if(at.length>0){Xe&&dt&&t.texStorage2D(i.TEXTURE_2D,fe,Ve,at[0].width,at[0].height);for(let Z=0,ie=at.length;Z<ie;Z++)we=at[Z],Xe?k&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,we.width,we.height,be,Be,we.data):t.texImage2D(i.TEXTURE_2D,Z,Ve,we.width,we.height,0,be,Be,we.data);T.generateMipmaps=!1}else Xe?(dt&&t.texStorage2D(i.TEXTURE_2D,fe,Ve,le.width,le.height),k&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,le.width,le.height,be,Be,le.data)):t.texImage2D(i.TEXTURE_2D,0,Ve,le.width,le.height,0,be,Be,le.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Xe&&dt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Ve,at[0].width,at[0].height,le.depth);for(let Z=0,ie=at.length;Z<ie;Z++)if(we=at[Z],T.format!==fn)if(be!==null)if(Xe){if(k)if(T.layerUpdates.size>0){let Me=Pd(we.width,we.height,T.format,T.type);for(let ve of T.layerUpdates){let $e=we.data.subarray(ve*Me/we.data.BYTES_PER_ELEMENT,(ve+1)*Me/we.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,ve,we.width,we.height,1,be,$e)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,we.width,we.height,le.depth,be,we.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,Ve,we.width,we.height,le.depth,0,we.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?k&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,we.width,we.height,le.depth,be,Be,we.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Z,Ve,we.width,we.height,le.depth,0,be,Be,we.data)}else{Xe&&dt&&t.texStorage2D(i.TEXTURE_2D,fe,Ve,at[0].width,at[0].height);for(let Z=0,ie=at.length;Z<ie;Z++)we=at[Z],T.format!==fn?be!==null?Xe?k&&t.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,we.width,we.height,be,we.data):t.compressedTexImage2D(i.TEXTURE_2D,Z,Ve,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?k&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,we.width,we.height,be,Be,we.data):t.texImage2D(i.TEXTURE_2D,Z,Ve,we.width,we.height,0,be,Be,we.data)}else if(T.isDataArrayTexture)if(Xe){if(dt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Ve,le.width,le.height,le.depth),k)if(T.layerUpdates.size>0){let Z=Pd(le.width,le.height,T.format,T.type);for(let ie of T.layerUpdates){let Me=le.data.subarray(ie*Z/le.data.BYTES_PER_ELEMENT,(ie+1)*Z/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ie,le.width,le.height,1,be,Be,Me)}T.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,be,Be,le.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ve,le.width,le.height,le.depth,0,be,Be,le.data);else if(T.isData3DTexture)Xe?(dt&&t.texStorage3D(i.TEXTURE_3D,fe,Ve,le.width,le.height,le.depth),k&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,be,Be,le.data)):t.texImage3D(i.TEXTURE_3D,0,Ve,le.width,le.height,le.depth,0,be,Be,le.data);else if(T.isFramebufferTexture){if(dt)if(Xe)t.texStorage2D(i.TEXTURE_2D,fe,Ve,le.width,le.height);else{let Z=le.width,ie=le.height;for(let Me=0;Me<fe;Me++)t.texImage2D(i.TEXTURE_2D,Me,Ve,Z,ie,0,be,Be,null),Z>>=1,ie>>=1}}else if(at.length>0){if(Xe&&dt){let Z=ke(at[0]);t.texStorage2D(i.TEXTURE_2D,fe,Ve,Z.width,Z.height)}for(let Z=0,ie=at.length;Z<ie;Z++)we=at[Z],Xe?k&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,be,Be,we):t.texImage2D(i.TEXTURE_2D,Z,Ve,be,Be,we);T.generateMipmaps=!1}else if(Xe){if(dt){let Z=ke(le);t.texStorage2D(i.TEXTURE_2D,fe,Ve,Z.width,Z.height)}k&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,be,Be,le)}else t.texImage2D(i.TEXTURE_2D,0,Ve,be,Be,le);g(T)&&m(ee),Se.__version=j.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function ae(C,T,W){if(T.image.length!==6)return;let ee=Re(C,T),re=T.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+W);let j=n.get(re);if(re.version!==j.__version||ee===!0){t.activeTexture(i.TEXTURE0+W);let Se=lt.getPrimaries(lt.workingColorSpace),pe=T.colorSpace===Bi?null:lt.getPrimaries(T.colorSpace),ye=T.colorSpace===Bi||Se===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let Qe=T.isCompressedTexture||T.image[0].isCompressedTexture,le=T.image[0]&&T.image[0].isDataTexture,be=[];for(let ie=0;ie<6;ie++)!Qe&&!le?be[ie]=x(T.image[ie],!0,s.maxCubemapSize):be[ie]=le?T.image[ie].image:T.image[ie],be[ie]=xt(T,be[ie]);let Be=be[0],Ve=r.convert(T.format,T.colorSpace),we=r.convert(T.type),at=b(T.internalFormat,Ve,we,T.colorSpace),Xe=T.isVideoTexture!==!0,dt=j.__version===void 0||ee===!0,k=re.dataReady,fe=D(T,Be);ge(i.TEXTURE_CUBE_MAP,T);let Z;if(Qe){Xe&&dt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,at,Be.width,Be.height);for(let ie=0;ie<6;ie++){Z=be[ie].mipmaps;for(let Me=0;Me<Z.length;Me++){let ve=Z[Me];T.format!==fn?Ve!==null?Xe?k&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me,0,0,ve.width,ve.height,Ve,ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me,at,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xe?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me,0,0,ve.width,ve.height,Ve,we,ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me,at,ve.width,ve.height,0,Ve,we,ve.data)}}}else{if(Z=T.mipmaps,Xe&&dt){Z.length>0&&fe++;let ie=ke(be[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,at,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(le){Xe?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,be[ie].width,be[ie].height,Ve,we,be[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,at,be[ie].width,be[ie].height,0,Ve,we,be[ie].data);for(let Me=0;Me<Z.length;Me++){let $e=Z[Me].image[ie].image;Xe?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me+1,0,0,$e.width,$e.height,Ve,we,$e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me+1,at,$e.width,$e.height,0,Ve,we,$e.data)}}else{Xe?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Ve,we,be[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,at,Ve,we,be[ie]);for(let Me=0;Me<Z.length;Me++){let ve=Z[Me];Xe?k&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me+1,0,0,Ve,we,ve.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Me+1,at,Ve,we,ve.image[ie])}}}g(T)&&m(i.TEXTURE_CUBE_MAP),j.__version=re.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function Ee(C,T,W,ee,re,j){let Se=r.convert(W.format,W.colorSpace),pe=r.convert(W.type),ye=b(W.internalFormat,Se,pe,W.colorSpace),Qe=n.get(T),le=n.get(W);if(le.__renderTarget=T,!Qe.__hasExternalTextures){let be=Math.max(1,T.width>>j),Be=Math.max(1,T.height>>j);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,j,ye,be,Be,T.depth,0,Se,pe,null):t.texImage2D(re,j,ye,be,Be,0,Se,pe,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),it(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,re,le.__webglTexture,0,nt(T)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ee,re,le.__webglTexture,j),t.bindFramebuffer(i.FRAMEBUFFER,null)}function de(C,T,W){if(i.bindRenderbuffer(i.RENDERBUFFER,C),T.depthBuffer){let ee=T.depthTexture,re=ee&&ee.isDepthTexture?ee.type:null,j=w(T.stencilBuffer,re),Se=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=nt(T);it(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe,j,T.width,T.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,j,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,j,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Se,i.RENDERBUFFER,C)}else{let ee=T.textures;for(let re=0;re<ee.length;re++){let j=ee[re],Se=r.convert(j.format,j.colorSpace),pe=r.convert(j.type),ye=b(j.internalFormat,Se,pe,j.colorSpace),Qe=nt(T);W&&it(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe,ye,T.width,T.height):it(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qe,ye,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,ye,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(C,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let ee=n.get(T.depthTexture);ee.__renderTarget=T,(!ee.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),K(T.depthTexture,0);let re=ee.__webglTexture,j=nt(T);if(T.depthTexture.format===Ys)it(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0);else if(T.depthTexture.format===Xi)it(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Fe(C){let T=n.get(C),W=C.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==C.depthTexture){let ee=C.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),ee){let re=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ee.removeEventListener("dispose",re)};ee.addEventListener("dispose",re),T.__depthDisposeCallback=re}T.__boundDepthTexture=ee}if(C.depthTexture&&!T.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");Le(T.__webglFramebuffer,C)}else if(W){T.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[ee]),T.__webglDepthbuffer[ee]===void 0)T.__webglDepthbuffer[ee]=i.createRenderbuffer(),de(T.__webglDepthbuffer[ee],C,!1);else{let re=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=T.__webglDepthbuffer[ee];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,j)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),de(T.__webglDepthbuffer,C,!1);else{let ee=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,re)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function We(C,T,W){let ee=n.get(C);T!==void 0&&Ee(ee.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Fe(C)}function wt(C){let T=C.texture,W=n.get(C),ee=n.get(T);C.addEventListener("dispose",I);let re=C.textures,j=C.isWebGLCubeRenderTarget===!0,Se=re.length>1;if(Se||(ee.__webglTexture===void 0&&(ee.__webglTexture=i.createTexture()),ee.__version=T.version,a.memory.textures++),j){W.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer[pe]=[];for(let ye=0;ye<T.mipmaps.length;ye++)W.__webglFramebuffer[pe][ye]=i.createFramebuffer()}else W.__webglFramebuffer[pe]=i.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer=[];for(let pe=0;pe<T.mipmaps.length;pe++)W.__webglFramebuffer[pe]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Se)for(let pe=0,ye=re.length;pe<ye;pe++){let Qe=n.get(re[pe]);Qe.__webglTexture===void 0&&(Qe.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&it(C)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let pe=0;pe<re.length;pe++){let ye=re[pe];W.__webglColorRenderbuffer[pe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[pe]);let Qe=r.convert(ye.format,ye.colorSpace),le=r.convert(ye.type),be=b(ye.internalFormat,Qe,le,ye.colorSpace,C.isXRRenderTarget===!0),Be=nt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,be,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,W.__webglColorRenderbuffer[pe])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),de(W.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture),ge(i.TEXTURE_CUBE_MAP,T);for(let pe=0;pe<6;pe++)if(T.mipmaps&&T.mipmaps.length>0)for(let ye=0;ye<T.mipmaps.length;ye++)Ee(W.__webglFramebuffer[pe][ye],C,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,ye);else Ee(W.__webglFramebuffer[pe],C,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);g(T)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let pe=0,ye=re.length;pe<ye;pe++){let Qe=re[pe],le=n.get(Qe);t.bindTexture(i.TEXTURE_2D,le.__webglTexture),ge(i.TEXTURE_2D,Qe),Ee(W.__webglFramebuffer,C,Qe,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,0),g(Qe)&&m(i.TEXTURE_2D)}t.unbindTexture()}else{let pe=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(pe=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,ee.__webglTexture),ge(pe,T),T.mipmaps&&T.mipmaps.length>0)for(let ye=0;ye<T.mipmaps.length;ye++)Ee(W.__webglFramebuffer[ye],C,T,i.COLOR_ATTACHMENT0,pe,ye);else Ee(W.__webglFramebuffer,C,T,i.COLOR_ATTACHMENT0,pe,0);g(T)&&m(pe),t.unbindTexture()}C.depthBuffer&&Fe(C)}function rt(C){let T=C.textures;for(let W=0,ee=T.length;W<ee;W++){let re=T[W];if(g(re)){let j=v(C),Se=n.get(re).__webglTexture;t.bindTexture(j,Se),m(j),t.unbindTexture()}}}let St=[],z=[];function sn(C){if(C.samples>0){if(it(C)===!1){let T=C.textures,W=C.width,ee=C.height,re=i.COLOR_BUFFER_BIT,j=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Se=n.get(C),pe=T.length>1;if(pe)for(let ye=0;ye<T.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let ye=0;ye<T.length;ye++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),pe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Se.__webglColorRenderbuffer[ye]);let Qe=n.get(T[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Qe,0)}i.blitFramebuffer(0,0,W,ee,0,0,W,ee,re,i.NEAREST),c===!0&&(St.length=0,z.length=0,St.push(i.COLOR_ATTACHMENT0+ye),C.depthBuffer&&C.resolveDepthBuffer===!1&&(St.push(j),z.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,z)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,St))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pe)for(let ye=0;ye<T.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,Se.__webglColorRenderbuffer[ye]);let Qe=n.get(T[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,Qe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){let T=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function nt(C){return Math.min(s.maxSamples,C.samples)}function it(C){let T=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Oe(C){let T=a.render.frame;u.get(C)!==T&&(u.set(C,T),C.update())}function xt(C,T){let W=C.colorSpace,ee=C.format,re=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||W!==ri&&W!==Bi&&(lt.getTransfer(W)===gt?(ee!==fn||re!==jn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),T}function ke(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(h.width=C.naturalWidth||C.width,h.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(h.width=C.displayWidth,h.height=C.displayHeight):(h.width=C.width,h.height=C.height),h}this.allocateTextureUnit=O,this.resetTextureUnits=U,this.setTexture2D=K,this.setTexture2DArray=V,this.setTexture3D=se,this.setTextureCube=Y,this.rebindTextures=We,this.setupRenderTarget=wt,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=sn,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=Ee,this.useMultisampledRTT=it}function Rv(i,e){function t(n,s=Bi){let r,a=lt.getTransfer(s);if(n===jn)return i.UNSIGNED_BYTE;if(n===Rh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ch)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Yd)return i.BYTE;if(n===$d)return i.SHORT;if(n===Nr)return i.UNSIGNED_SHORT;if(n===Ah)return i.INT;if(n===ms)return i.UNSIGNED_INT;if(n===bn)return i.FLOAT;if(n===Ut)return i.HALF_FLOAT;if(n===Kd)return i.ALPHA;if(n===Jd)return i.RGB;if(n===fn)return i.RGBA;if(n===jd)return i.LUMINANCE;if(n===Qd)return i.LUMINANCE_ALPHA;if(n===Ys)return i.DEPTH_COMPONENT;if(n===Xi)return i.DEPTH_STENCIL;if(n===Ih)return i.RED;if(n===Ph)return i.RED_INTEGER;if(n===ef)return i.RG;if(n===Lh)return i.RG_INTEGER;if(n===Dh)return i.RGBA_INTEGER;if(n===Ga||n===Va||n===Wa||n===Xa)if(a===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ga)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Wa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ga)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Va)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Wa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Xa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===sc||n===rc||n===ac||n===oc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===sc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===rc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ac)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===oc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===lc||n===cc||n===hc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===lc||n===cc)return a===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===hc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===uc||n===dc||n===fc||n===pc||n===mc||n===gc||n===xc||n===yc||n===vc||n===_c||n===Mc||n===bc||n===wc||n===Ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===uc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===dc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===fc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===pc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===mc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===gc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===vc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===_c)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Mc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===bc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wc)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ec)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qa||n===Tc||n===Sc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===qa)return a===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Tc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Sc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===tf||n===Ac||n===Rc||n===Cc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===qa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ac)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Rc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Cc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Wi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Wc=class extends en{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},ot=class extends Jt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Cv={type:"move"},Ir=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(h,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let u=h.joints["index-finger-tip"],d=h.joints["thumb-tip"],f=u.position.distanceTo(d.position),p=.02,y=.005;h.inputState.pinching&&f>p+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&f<=p-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Cv)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ot;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Iv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pv=`
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

}`,Xc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new pn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ct({vertexShader:Iv,fragmentShader:Pv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ce(new Pt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},qc=class extends qi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,h=null,u=null,d=null,f=null,p=null,y=null,x=new Xc,g=t.getContextAttributes(),m=null,v=null,b=[],w=[],D=new he,A=null,I=new en;I.viewport=new _t;let R=new en;R.viewport=new _t;let E=[I,R],_=new Wc,P=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ae=b[$];return ae===void 0&&(ae=new Ir,b[$]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function($){let ae=b[$];return ae===void 0&&(ae=new Ir,b[$]=ae),ae.getGripSpace()},this.getHand=function($){let ae=b[$];return ae===void 0&&(ae=new Ir,b[$]=ae),ae.getHandSpace()};function O($){let ae=w.indexOf($.inputSource);if(ae===-1)return;let Ee=b[ae];Ee!==void 0&&(Ee.update($.inputSource,$.frame,h||a),Ee.dispatchEvent({type:$.type,data:$.inputSource}))}function H(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",K);for(let $=0;$<b.length;$++){let ae=w[$];ae!==null&&(w[$]=null,b[$].disconnect(ae))}P=null,U=null,x.reset(),e.setRenderTarget(m),p=null,f=null,d=null,s=null,v=null,Re.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(m=e.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",H),s.addEventListener("inputsourceschange",K),g.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(D),s.renderState.layers===void 0){let ae={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new Bt(p.framebufferWidth,p.framebufferHeight,{format:fn,type:jn,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ae=null,Ee=null,de=null;g.depth&&(de=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=g.stencil?Xi:Ys,Ee=g.stencil?Wi:ms);let Le={colorFormat:t.RGBA8,depthFormat:de,scaleFactor:r};d=new XRWebGLBinding(s,t),f=d.createProjectionLayer(Le),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new Bt(f.textureWidth,f.textureHeight,{format:fn,type:jn,depthTexture:new nr(f.textureWidth,f.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),Re.setContext(s),Re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function K($){for(let ae=0;ae<$.removed.length;ae++){let Ee=$.removed[ae],de=w.indexOf(Ee);de>=0&&(w[de]=null,b[de].disconnect(Ee))}for(let ae=0;ae<$.added.length;ae++){let Ee=$.added[ae],de=w.indexOf(Ee);if(de===-1){for(let Fe=0;Fe<b.length;Fe++)if(Fe>=w.length){w.push(Ee),de=Fe;break}else if(w[Fe]===null){w[Fe]=Ee,de=Fe;break}if(de===-1)break}let Le=b[de];Le&&Le.connect(Ee)}}let V=new L,se=new L;function Y($,ae,Ee){V.setFromMatrixPosition(ae.matrixWorld),se.setFromMatrixPosition(Ee.matrixWorld);let de=V.distanceTo(se),Le=ae.projectionMatrix.elements,Fe=Ee.projectionMatrix.elements,We=Le[14]/(Le[10]-1),wt=Le[14]/(Le[10]+1),rt=(Le[9]+1)/Le[5],St=(Le[9]-1)/Le[5],z=(Le[8]-1)/Le[0],sn=(Fe[8]+1)/Fe[0],nt=We*z,it=We*sn,Oe=de/(-z+sn),xt=Oe*-z;if(ae.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(xt),$.translateZ(Oe),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Le[10]===-1)$.projectionMatrix.copy(ae.projectionMatrix),$.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{let ke=We+Oe,C=wt+Oe,T=nt-xt,W=it+(de-xt),ee=rt*wt/C*ke,re=St*wt/C*ke;$.projectionMatrix.makePerspective(T,W,ee,re,ke,C),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ne($,ae){ae===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ae.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let ae=$.near,Ee=$.far;x.texture!==null&&(x.depthNear>0&&(ae=x.depthNear),x.depthFar>0&&(Ee=x.depthFar)),_.near=R.near=I.near=ae,_.far=R.far=I.far=Ee,(P!==_.near||U!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),P=_.near,U=_.far),I.layers.mask=$.layers.mask|2,R.layers.mask=$.layers.mask|4,_.layers.mask=I.layers.mask|R.layers.mask;let de=$.parent,Le=_.cameras;ne(_,de);for(let Fe=0;Fe<Le.length;Fe++)ne(Le[Fe],de);Le.length===2?Y(_,I,R):_.projectionMatrix.copy(I.projectionMatrix),J($,_,de)};function J($,ae,Ee){Ee===null?$.matrix.copy(ae.matrixWorld):($.matrix.copy(Ee.matrixWorld),$.matrix.invert(),$.matrix.multiply(ae.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ae.projectionMatrix),$.projectionMatrixInverse.copy(ae.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Za*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function($){c=$,f!==null&&(f.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(_)};let oe=null;function ge($,ae){if(u=ae.getViewerPose(h||a),y=ae,u!==null){let Ee=u.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let de=!1;Ee.length!==_.cameras.length&&(_.cameras.length=0,de=!0);for(let Fe=0;Fe<Ee.length;Fe++){let We=Ee[Fe],wt=null;if(p!==null)wt=p.getViewport(We);else{let St=d.getViewSubImage(f,We);wt=St.viewport,Fe===0&&(e.setRenderTargetTextures(v,St.colorTexture,f.ignoreDepthValues?void 0:St.depthStencilTexture),e.setRenderTarget(v))}let rt=E[Fe];rt===void 0&&(rt=new en,rt.layers.enable(Fe),rt.viewport=new _t,E[Fe]=rt),rt.matrix.fromArray(We.transform.matrix),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.projectionMatrix.fromArray(We.projectionMatrix),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert(),rt.viewport.set(wt.x,wt.y,wt.width,wt.height),Fe===0&&(_.matrix.copy(rt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),de===!0&&_.cameras.push(rt)}let Le=s.enabledFeatures;if(Le&&Le.includes("depth-sensing")){let Fe=d.getDepthInformation(Ee[0]);Fe&&Fe.isValid&&Fe.texture&&x.init(e,Fe,s.renderState)}}for(let Ee=0;Ee<b.length;Ee++){let de=w[Ee],Le=b[Ee];de!==null&&Le!==void 0&&Le.update(de,ae,h||a)}oe&&oe($,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),y=null}let Re=new of;Re.setAnimationLoop(ge),this.setAnimationLoop=function($){oe=$},this.dispose=function(){}}},us=new Kt,Lv=new He;function Dv(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,af(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,v,b,w){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),d(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&p(g,m,w)):m.isMeshMatcapMaterial?(r(g,m),y(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?c(g,m,v,b):m.isSpriteMaterial?h(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===ln&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===ln&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let v=e.get(m),b=v.envMap,w=v.envMapRotation;b&&(g.envMap.value=b,us.copy(w),us.x*=-1,us.y*=-1,us.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(us.y*=-1,us.z*=-1),g.envMapRotation.value.setFromMatrix4(Lv.makeRotationFromEuler(us)),g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,v,b){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*v,g.scale.value=b*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function p(g,m,v){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===ln&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function y(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let v=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Nv(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,b){let w=b.program;n.uniformBlockBinding(v,w)}function h(v,b){let w=s[v.id];w===void 0&&(y(v),w=u(v),s[v.id]=w,v.addEventListener("dispose",g));let D=b.program;n.updateUBOMapping(v,D);let A=e.render.frame;r[v.id]!==A&&(f(v),r[v.id]=A)}function u(v){let b=d();v.__bindingPointIndex=b;let w=i.createBuffer(),D=v.__size,A=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,D,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,w),w}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){let b=s[v.id],w=v.uniforms,D=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let A=0,I=w.length;A<I;A++){let R=Array.isArray(w[A])?w[A]:[w[A]];for(let E=0,_=R.length;E<_;E++){let P=R[E];if(p(P,A,E,D)===!0){let U=P.__offset,O=Array.isArray(P.value)?P.value:[P.value],H=0;for(let K=0;K<O.length;K++){let V=O[K],se=x(V);typeof V=="number"||typeof V=="boolean"?(P.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,U+H,P.__data)):V.isMatrix3?(P.__data[0]=V.elements[0],P.__data[1]=V.elements[1],P.__data[2]=V.elements[2],P.__data[3]=0,P.__data[4]=V.elements[3],P.__data[5]=V.elements[4],P.__data[6]=V.elements[5],P.__data[7]=0,P.__data[8]=V.elements[6],P.__data[9]=V.elements[7],P.__data[10]=V.elements[8],P.__data[11]=0):(V.toArray(P.__data,H),H+=se.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,b,w,D){let A=v.value,I=b+"_"+w;if(D[I]===void 0)return typeof A=="number"||typeof A=="boolean"?D[I]=A:D[I]=A.clone(),!0;{let R=D[I];if(typeof A=="number"||typeof A=="boolean"){if(R!==A)return D[I]=A,!0}else if(R.equals(A)===!1)return R.copy(A),!0}return!1}function y(v){let b=v.uniforms,w=0,D=16;for(let I=0,R=b.length;I<R;I++){let E=Array.isArray(b[I])?b[I]:[b[I]];for(let _=0,P=E.length;_<P;_++){let U=E[_],O=Array.isArray(U.value)?U.value:[U.value];for(let H=0,K=O.length;H<K;H++){let V=O[H],se=x(V),Y=w%D,ne=Y%se.boundary,J=Y+ne;w+=ne,J!==0&&D-J<se.storage&&(w+=D-J),U.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=w,w+=se.storage}}}let A=w%D;return A>0&&(w+=D-A),v.__size=w,v.__cache={},this}function x(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),b}function g(v){let b=v.target;b.removeEventListener("dispose",g);let w=a.indexOf(b.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function m(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:h,dispose:m}}var no=class{constructor(e={}){let{canvas:t=U0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let y=new Uint32Array(4),x=new Int32Array(4),g=null,m=null,v=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ht,this.toneMapping=Gi,this.toneMappingExposure=1;let w=this,D=!1,A=0,I=0,R=null,E=-1,_=null,P=new _t,U=new _t,O=null,H=new xe(0),K=0,V=t.width,se=t.height,Y=1,ne=null,J=null,oe=new _t(0,0,V,se),ge=new _t(0,0,V,se),Re=!1,$=new zr,ae=!1,Ee=!1,de=new He,Le=new He,Fe=new L,We=new _t,wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},rt=!1;function St(){return R===null?Y:1}let z=n;function sn(S,F){return t.getContext(S,F)}try{let S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vh}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",Me,!1),t.addEventListener("webglcontextcreationerror",ve,!1),z===null){let F="webgl2";if(z=sn(F,S),z===null)throw sn(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let nt,it,Oe,xt,ke,C,T,W,ee,re,j,Se,pe,ye,Qe,le,be,Be,Ve,we,at,Xe,dt,k;function fe(){nt=new Kx(z),nt.init(),Xe=new Rv(z,nt),it=new Wx(z,nt,e,Xe),Oe=new Tv(z,nt),it.reverseDepthBuffer&&f&&Oe.buffers.depth.setReversed(!0),xt=new Qx(z),ke=new dv,C=new Av(z,nt,Oe,ke,it,Xe,xt),T=new qx(w),W=new Zx(w),ee=new am(z),dt=new Gx(z,ee),re=new Jx(z,ee,xt,dt),j=new ty(z,re,ee,xt),Ve=new ey(z,it,C),le=new Xx(ke),Se=new uv(w,T,W,nt,it,dt,le),pe=new Dv(w,ke),ye=new pv,Qe=new _v(nt),Be=new Hx(w,T,W,Oe,j,p,c),be=new wv(w,j,it),k=new Nv(z,xt,it,Oe),we=new Vx(z,nt,xt),at=new jx(z,nt,xt),xt.programs=Se.programs,w.capabilities=it,w.extensions=nt,w.properties=ke,w.renderLists=ye,w.shadowMap=be,w.state=Oe,w.info=xt}fe();let Z=new qc(w,z);this.xr=Z,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let S=nt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=nt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(S){S!==void 0&&(Y=S,this.setSize(V,se,!1))},this.getSize=function(S){return S.set(V,se)},this.setSize=function(S,F,X=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=S,se=F,t.width=Math.floor(S*Y),t.height=Math.floor(F*Y),X===!0&&(t.style.width=S+"px",t.style.height=F+"px"),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(V*Y,se*Y).floor()},this.setDrawingBufferSize=function(S,F,X){V=S,se=F,Y=X,t.width=Math.floor(S*X),t.height=Math.floor(F*X),this.setViewport(0,0,S,F)},this.getCurrentViewport=function(S){return S.copy(P)},this.getViewport=function(S){return S.copy(oe)},this.setViewport=function(S,F,X,q){S.isVector4?oe.set(S.x,S.y,S.z,S.w):oe.set(S,F,X,q),Oe.viewport(P.copy(oe).multiplyScalar(Y).round())},this.getScissor=function(S){return S.copy(ge)},this.setScissor=function(S,F,X,q){S.isVector4?ge.set(S.x,S.y,S.z,S.w):ge.set(S,F,X,q),Oe.scissor(U.copy(ge).multiplyScalar(Y).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(S){Oe.setScissorTest(Re=S)},this.setOpaqueSort=function(S){ne=S},this.setTransparentSort=function(S){J=S},this.getClearColor=function(S){return S.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor.apply(Be,arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha.apply(Be,arguments)},this.clear=function(S=!0,F=!0,X=!0){let q=0;if(S){let B=!1;if(R!==null){let ue=R.texture.format;B=ue===Dh||ue===Lh||ue===Ph}if(B){let ue=R.texture.type,_e=ue===jn||ue===ms||ue===Nr||ue===Wi||ue===Rh||ue===Ch,Ce=Be.getClearColor(),Ie=Be.getClearAlpha(),qe=Ce.r,Ze=Ce.g,Pe=Ce.b;_e?(y[0]=qe,y[1]=Ze,y[2]=Pe,y[3]=Ie,z.clearBufferuiv(z.COLOR,0,y)):(x[0]=qe,x[1]=Ze,x[2]=Pe,x[3]=Ie,z.clearBufferiv(z.COLOR,0,x))}else q|=z.COLOR_BUFFER_BIT}F&&(q|=z.DEPTH_BUFFER_BIT),X&&(q|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",Me,!1),t.removeEventListener("webglcontextcreationerror",ve,!1),ye.dispose(),Qe.dispose(),ke.dispose(),T.dispose(),W.dispose(),j.dispose(),dt.dispose(),k.dispose(),Se.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",bu),Z.removeEventListener("sessionend",wu),rs.stop()};function ie(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function Me(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;let S=xt.autoReset,F=be.enabled,X=be.autoUpdate,q=be.needsUpdate,B=be.type;fe(),xt.autoReset=S,be.enabled=F,be.autoUpdate=X,be.needsUpdate=q,be.type=B}function ve(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function $e(S){let F=S.target;F.removeEventListener("dispose",$e),Dt(F)}function Dt(S){rn(S),ke.remove(S)}function rn(S){let F=ke.get(S).programs;F!==void 0&&(F.forEach(function(X){Se.releaseProgram(X)}),S.isShaderMaterial&&Se.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,X,q,B,ue){F===null&&(F=wt);let _e=B.isMesh&&B.matrixWorld.determinant()<0,Ce=Zp(S,F,X,q,B);Oe.setMaterial(q,_e);let Ie=X.index,qe=1;if(q.wireframe===!0){if(Ie=re.getWireframeAttribute(X),Ie===void 0)return;qe=2}let Ze=X.drawRange,Pe=X.attributes.position,ft=Ze.start*qe,Et=(Ze.start+Ze.count)*qe;ue!==null&&(ft=Math.max(ft,ue.start*qe),Et=Math.min(Et,(ue.start+ue.count)*qe)),Ie!==null?(ft=Math.max(ft,0),Et=Math.min(Et,Ie.count)):Pe!=null&&(ft=Math.max(ft,0),Et=Math.min(Et,Pe.count));let At=Et-ft;if(At<0||At===1/0)return;dt.setup(B,q,Ce,X,Ie);let _n,pt=we;if(Ie!==null&&(_n=ee.get(Ie),pt=at,pt.setIndex(_n)),B.isMesh)q.wireframe===!0?(Oe.setLineWidth(q.wireframeLinewidth*St()),pt.setMode(z.LINES)):pt.setMode(z.TRIANGLES);else if(B.isLine){let De=q.linewidth;De===void 0&&(De=1),Oe.setLineWidth(De*St()),B.isLineSegments?pt.setMode(z.LINES):B.isLineLoop?pt.setMode(z.LINE_LOOP):pt.setMode(z.LINE_STRIP)}else B.isPoints?pt.setMode(z.POINTS):B.isSprite&&pt.setMode(z.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)pt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))pt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let De=B._multiDrawStarts,gi=B._multiDrawCounts,mt=B._multiDrawCount,Yn=Ie?ee.get(Ie).bytesPerElement:1,Cs=ke.get(q).currentProgram.getUniforms();for(let An=0;An<mt;An++)Cs.setValue(z,"_gl_DrawID",An),pt.render(De[An]/Yn,gi[An])}else if(B.isInstancedMesh)pt.renderInstances(ft,At,B.count);else if(X.isInstancedBufferGeometry){let De=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,gi=Math.min(X.instanceCount,De);pt.renderInstances(ft,At,gi)}else pt.render(ft,At)};function yt(S,F,X){S.transparent===!0&&S.side===Nt&&S.forceSinglePass===!1?(S.side=ln,S.needsUpdate=!0,da(S,F,X),S.side=Vi,S.needsUpdate=!0,da(S,F,X),S.side=Nt):da(S,F,X)}this.compile=function(S,F,X=null){X===null&&(X=S),m=Qe.get(X),m.init(F),b.push(m),X.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),S!==X&&S.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights();let q=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let ue=B.material;if(ue)if(Array.isArray(ue))for(let _e=0;_e<ue.length;_e++){let Ce=ue[_e];yt(Ce,X,B),q.add(Ce)}else yt(ue,X,B),q.add(ue)}),b.pop(),m=null,q},this.compileAsync=function(S,F,X=null){let q=this.compile(S,F,X);return new Promise(B=>{function ue(){if(q.forEach(function(_e){ke.get(_e).currentProgram.isReady()&&q.delete(_e)}),q.size===0){B(S);return}setTimeout(ue,10)}nt.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let qn=null;function mi(S){qn&&qn(S)}function bu(){rs.stop()}function wu(){rs.start()}let rs=new of;rs.setAnimationLoop(mi),typeof self<"u"&&rs.setContext(self),this.setAnimationLoop=function(S){qn=S,Z.setAnimationLoop(S),S===null?rs.stop():rs.start()},Z.addEventListener("sessionstart",bu),Z.addEventListener("sessionend",wu),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(F),F=Z.getCamera()),S.isScene===!0&&S.onBeforeRender(w,S,F,R),m=Qe.get(S,b.length),m.init(F),b.push(m),Le.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),$.setFromProjectionMatrix(Le),Ee=this.localClippingEnabled,ae=le.init(this.clippingPlanes,Ee),g=ye.get(S,v.length),g.init(),v.push(g),Z.enabled===!0&&Z.isPresenting===!0){let ue=w.xr.getDepthSensingMesh();ue!==null&&cl(ue,F,-1/0,w.sortObjects)}cl(S,F,0,w.sortObjects),g.finish(),w.sortObjects===!0&&g.sort(ne,J),rt=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,rt&&Be.addToRenderList(g,S),this.info.render.frame++,ae===!0&&le.beginShadows();let X=m.state.shadowsArray;be.render(X,S,F),ae===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=g.opaque,B=g.transmissive;if(m.setupLights(),F.isArrayCamera){let ue=F.cameras;if(B.length>0)for(let _e=0,Ce=ue.length;_e<Ce;_e++){let Ie=ue[_e];Tu(q,B,S,Ie)}rt&&Be.render(S);for(let _e=0,Ce=ue.length;_e<Ce;_e++){let Ie=ue[_e];Eu(g,S,Ie,Ie.viewport)}}else B.length>0&&Tu(q,B,S,F),rt&&Be.render(S),Eu(g,S,F);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),S.isScene===!0&&S.onAfterRender(w,S,F),dt.resetDefaultState(),E=-1,_=null,b.pop(),b.length>0?(m=b[b.length-1],ae===!0&&le.setGlobalState(w.clippingPlanes,m.state.camera)):m=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function cl(S,F,X,q){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)X=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLight)m.pushLight(S),S.castShadow&&m.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||$.intersectsSprite(S)){q&&We.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Le);let _e=j.update(S),Ce=S.material;Ce.visible&&g.push(S,_e,Ce,X,We.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||$.intersectsObject(S))){let _e=j.update(S),Ce=S.material;if(q&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),We.copy(S.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),We.copy(_e.boundingSphere.center)),We.applyMatrix4(S.matrixWorld).applyMatrix4(Le)),Array.isArray(Ce)){let Ie=_e.groups;for(let qe=0,Ze=Ie.length;qe<Ze;qe++){let Pe=Ie[qe],ft=Ce[Pe.materialIndex];ft&&ft.visible&&g.push(S,_e,ft,X,We.z,Pe)}}else Ce.visible&&g.push(S,_e,Ce,X,We.z,null)}}let ue=S.children;for(let _e=0,Ce=ue.length;_e<Ce;_e++)cl(ue[_e],F,X,q)}function Eu(S,F,X,q){let B=S.opaque,ue=S.transmissive,_e=S.transparent;m.setupLightsView(X),ae===!0&&le.setGlobalState(w.clippingPlanes,X),q&&Oe.viewport(P.copy(q)),B.length>0&&ua(B,F,X),ue.length>0&&ua(ue,F,X),_e.length>0&&ua(_e,F,X),Oe.buffers.depth.setTest(!0),Oe.buffers.depth.setMask(!0),Oe.buffers.color.setMask(!0),Oe.setPolygonOffset(!1)}function Tu(S,F,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[q.id]===void 0&&(m.state.transmissionRenderTarget[q.id]=new Bt(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?Ut:jn,minFilter:Hi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));let ue=m.state.transmissionRenderTarget[q.id],_e=q.viewport||P;ue.setSize(_e.z,_e.w);let Ce=w.getRenderTarget();w.setRenderTarget(ue),w.getClearColor(H),K=w.getClearAlpha(),K<1&&w.setClearColor(16777215,.5),w.clear(),rt&&Be.render(X);let Ie=w.toneMapping;w.toneMapping=Gi;let qe=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),m.setupLightsView(q),ae===!0&&le.setGlobalState(w.clippingPlanes,q),ua(S,X,q),C.updateMultisampleRenderTarget(ue),C.updateRenderTargetMipmap(ue),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let Pe=0,ft=F.length;Pe<ft;Pe++){let Et=F[Pe],At=Et.object,_n=Et.geometry,pt=Et.material,De=Et.group;if(pt.side===Nt&&At.layers.test(q.layers)){let gi=pt.side;pt.side=ln,pt.needsUpdate=!0,Su(At,X,q,_n,pt,De),pt.side=gi,pt.needsUpdate=!0,Ze=!0}}Ze===!0&&(C.updateMultisampleRenderTarget(ue),C.updateRenderTargetMipmap(ue))}w.setRenderTarget(Ce),w.setClearColor(H,K),qe!==void 0&&(q.viewport=qe),w.toneMapping=Ie}function ua(S,F,X){let q=F.isScene===!0?F.overrideMaterial:null;for(let B=0,ue=S.length;B<ue;B++){let _e=S[B],Ce=_e.object,Ie=_e.geometry,qe=q===null?_e.material:q,Ze=_e.group;Ce.layers.test(X.layers)&&Su(Ce,F,X,Ie,qe,Ze)}}function Su(S,F,X,q,B,ue){S.onBeforeRender(w,F,X,q,B,ue),S.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(w,F,X,q,S,ue),B.transparent===!0&&B.side===Nt&&B.forceSinglePass===!1?(B.side=ln,B.needsUpdate=!0,w.renderBufferDirect(X,F,q,B,S,ue),B.side=Vi,B.needsUpdate=!0,w.renderBufferDirect(X,F,q,B,S,ue),B.side=Nt):w.renderBufferDirect(X,F,q,B,S,ue),S.onAfterRender(w,F,X,q,B,ue)}function da(S,F,X){F.isScene!==!0&&(F=wt);let q=ke.get(S),B=m.state.lights,ue=m.state.shadowsArray,_e=B.state.version,Ce=Se.getParameters(S,B.state,ue,F,X),Ie=Se.getProgramCacheKey(Ce),qe=q.programs;q.environment=S.isMeshStandardMaterial?F.environment:null,q.fog=F.fog,q.envMap=(S.isMeshStandardMaterial?W:T).get(S.envMap||q.environment),q.envMapRotation=q.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,qe===void 0&&(S.addEventListener("dispose",$e),qe=new Map,q.programs=qe);let Ze=qe.get(Ie);if(Ze!==void 0){if(q.currentProgram===Ze&&q.lightsStateVersion===_e)return Ru(S,Ce),Ze}else Ce.uniforms=Se.getUniforms(S),S.onBeforeCompile(Ce,w),Ze=Se.acquireProgram(Ce,Ie),qe.set(Ie,Ze),q.uniforms=Ce.uniforms;let Pe=q.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Pe.clippingPlanes=le.uniform),Ru(S,Ce),q.needsLights=Jp(S),q.lightsStateVersion=_e,q.needsLights&&(Pe.ambientLightColor.value=B.state.ambient,Pe.lightProbe.value=B.state.probe,Pe.directionalLights.value=B.state.directional,Pe.directionalLightShadows.value=B.state.directionalShadow,Pe.spotLights.value=B.state.spot,Pe.spotLightShadows.value=B.state.spotShadow,Pe.rectAreaLights.value=B.state.rectArea,Pe.ltc_1.value=B.state.rectAreaLTC1,Pe.ltc_2.value=B.state.rectAreaLTC2,Pe.pointLights.value=B.state.point,Pe.pointLightShadows.value=B.state.pointShadow,Pe.hemisphereLights.value=B.state.hemi,Pe.directionalShadowMap.value=B.state.directionalShadowMap,Pe.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Pe.spotShadowMap.value=B.state.spotShadowMap,Pe.spotLightMatrix.value=B.state.spotLightMatrix,Pe.spotLightMap.value=B.state.spotLightMap,Pe.pointShadowMap.value=B.state.pointShadowMap,Pe.pointShadowMatrix.value=B.state.pointShadowMatrix),q.currentProgram=Ze,q.uniformsList=null,Ze}function Au(S){if(S.uniformsList===null){let F=S.currentProgram.getUniforms();S.uniformsList=Zs.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function Ru(S,F){let X=ke.get(S);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.batchingColor=F.batchingColor,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function Zp(S,F,X,q,B){F.isScene!==!0&&(F=wt),C.resetTextureUnits();let ue=F.fog,_e=q.isMeshStandardMaterial?F.environment:null,Ce=R===null?w.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:ri,Ie=(q.isMeshStandardMaterial?W:T).get(q.envMap||_e),qe=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ze=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Pe=!!X.morphAttributes.position,ft=!!X.morphAttributes.normal,Et=!!X.morphAttributes.color,At=Gi;q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(At=w.toneMapping);let _n=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,pt=_n!==void 0?_n.length:0,De=ke.get(q),gi=m.state.lights;if(ae===!0&&(Ee===!0||S!==_)){let On=S===_&&q.id===E;le.setState(q,S,On)}let mt=!1;q.version===De.__version?(De.needsLights&&De.lightsStateVersion!==gi.state.version||De.outputColorSpace!==Ce||B.isBatchedMesh&&De.batching===!1||!B.isBatchedMesh&&De.batching===!0||B.isBatchedMesh&&De.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&De.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&De.instancing===!1||!B.isInstancedMesh&&De.instancing===!0||B.isSkinnedMesh&&De.skinning===!1||!B.isSkinnedMesh&&De.skinning===!0||B.isInstancedMesh&&De.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&De.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&De.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&De.instancingMorph===!1&&B.morphTexture!==null||De.envMap!==Ie||q.fog===!0&&De.fog!==ue||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==le.numPlanes||De.numIntersection!==le.numIntersection)||De.vertexAlphas!==qe||De.vertexTangents!==Ze||De.morphTargets!==Pe||De.morphNormals!==ft||De.morphColors!==Et||De.toneMapping!==At||De.morphTargetsCount!==pt)&&(mt=!0):(mt=!0,De.__version=q.version);let Yn=De.currentProgram;mt===!0&&(Yn=da(q,F,B));let Cs=!1,An=!1,yr=!1,Rt=Yn.getUniforms(),ti=De.uniforms;if(Oe.useProgram(Yn.program)&&(Cs=!0,An=!0,yr=!0),q.id!==E&&(E=q.id,An=!0),Cs||_!==S){Oe.buffers.depth.getReversed()?(de.copy(S.projectionMatrix),z0(de),F0(de),Rt.setValue(z,"projectionMatrix",de)):Rt.setValue(z,"projectionMatrix",S.projectionMatrix),Rt.setValue(z,"viewMatrix",S.matrixWorldInverse);let Li=Rt.map.cameraPosition;Li!==void 0&&Li.setValue(z,Fe.setFromMatrixPosition(S.matrixWorld)),it.logarithmicDepthBuffer&&Rt.setValue(z,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Rt.setValue(z,"isOrthographic",S.isOrthographicCamera===!0),_!==S&&(_=S,An=!0,yr=!0)}if(B.isSkinnedMesh){Rt.setOptional(z,B,"bindMatrix"),Rt.setOptional(z,B,"bindMatrixInverse");let On=B.skeleton;On&&(On.boneTexture===null&&On.computeBoneTexture(),Rt.setValue(z,"boneTexture",On.boneTexture,C))}B.isBatchedMesh&&(Rt.setOptional(z,B,"batchingTexture"),Rt.setValue(z,"batchingTexture",B._matricesTexture,C),Rt.setOptional(z,B,"batchingIdTexture"),Rt.setValue(z,"batchingIdTexture",B._indirectTexture,C),Rt.setOptional(z,B,"batchingColorTexture"),B._colorsTexture!==null&&Rt.setValue(z,"batchingColorTexture",B._colorsTexture,C));let vr=X.morphAttributes;if((vr.position!==void 0||vr.normal!==void 0||vr.color!==void 0)&&Ve.update(B,X,Yn),(An||De.receiveShadow!==B.receiveShadow)&&(De.receiveShadow=B.receiveShadow,Rt.setValue(z,"receiveShadow",B.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(ti.envMap.value=Ie,ti.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&F.environment!==null&&(ti.envMapIntensity.value=F.environmentIntensity),An&&(Rt.setValue(z,"toneMappingExposure",w.toneMappingExposure),De.needsLights&&Kp(ti,yr),ue&&q.fog===!0&&pe.refreshFogUniforms(ti,ue),pe.refreshMaterialUniforms(ti,q,Y,se,m.state.transmissionRenderTarget[S.id]),Zs.upload(z,Au(De),ti,C)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Zs.upload(z,Au(De),ti,C),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Rt.setValue(z,"center",B.center),Rt.setValue(z,"modelViewMatrix",B.modelViewMatrix),Rt.setValue(z,"normalMatrix",B.normalMatrix),Rt.setValue(z,"modelMatrix",B.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let On=q.uniformsGroups;for(let Li=0,Di=On.length;Li<Di;Li++){let Cu=On[Li];k.update(Cu,Yn),k.bind(Cu,Yn)}}return Yn}function Kp(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function Jp(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(S,F,X){ke.get(S.texture).__webglTexture=F,ke.get(S.depthTexture).__webglTexture=X;let q=ke.get(S);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=X===void 0,q.__autoAllocateDepthBuffer||nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,F){let X=ke.get(S);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(S,F=0,X=0){R=S,A=F,I=X;let q=!0,B=null,ue=!1,_e=!1;if(S){let Ie=ke.get(S);if(Ie.__useDefaultFramebuffer!==void 0)Oe.bindFramebuffer(z.FRAMEBUFFER,null),q=!1;else if(Ie.__webglFramebuffer===void 0)C.setupRenderTarget(S);else if(Ie.__hasExternalTextures)C.rebindTextures(S,ke.get(S.texture).__webglTexture,ke.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let Pe=S.depthTexture;if(Ie.__boundDepthTexture!==Pe){if(Pe!==null&&ke.has(Pe)&&(S.width!==Pe.image.width||S.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(S)}}let qe=S.texture;(qe.isData3DTexture||qe.isDataArrayTexture||qe.isCompressedArrayTexture)&&(_e=!0);let Ze=ke.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ze[F])?B=Ze[F][X]:B=Ze[F],ue=!0):S.samples>0&&C.useMultisampledRTT(S)===!1?B=ke.get(S).__webglMultisampledFramebuffer:Array.isArray(Ze)?B=Ze[X]:B=Ze,P.copy(S.viewport),U.copy(S.scissor),O=S.scissorTest}else P.copy(oe).multiplyScalar(Y).floor(),U.copy(ge).multiplyScalar(Y).floor(),O=Re;if(Oe.bindFramebuffer(z.FRAMEBUFFER,B)&&q&&Oe.drawBuffers(S,B),Oe.viewport(P),Oe.scissor(U),Oe.setScissorTest(O),ue){let Ie=ke.get(S.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ie.__webglTexture,X)}else if(_e){let Ie=ke.get(S.texture),qe=F||0;z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ie.__webglTexture,X||0,qe)}E=-1},this.readRenderTargetPixels=function(S,F,X,q,B,ue,_e){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ke.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_e!==void 0&&(Ce=Ce[_e]),Ce){Oe.bindFramebuffer(z.FRAMEBUFFER,Ce);try{let Ie=S.texture,qe=Ie.format,Ze=Ie.type;if(!it.textureFormatReadable(qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-q&&X>=0&&X<=S.height-B&&z.readPixels(F,X,q,B,Xe.convert(qe),Xe.convert(Ze),ue)}finally{let Ie=R!==null?ke.get(R).__webglFramebuffer:null;Oe.bindFramebuffer(z.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(S,F,X,q,B,ue,_e){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=ke.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&_e!==void 0&&(Ce=Ce[_e]),Ce){let Ie=S.texture,qe=Ie.format,Ze=Ie.type;if(!it.textureFormatReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=S.width-q&&X>=0&&X<=S.height-B){Oe.bindFramebuffer(z.FRAMEBUFFER,Ce);let Pe=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,Pe),z.bufferData(z.PIXEL_PACK_BUFFER,ue.byteLength,z.STREAM_READ),z.readPixels(F,X,q,B,Xe.convert(qe),Xe.convert(Ze),0);let ft=R!==null?ke.get(R).__webglFramebuffer:null;Oe.bindFramebuffer(z.FRAMEBUFFER,ft);let Et=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await O0(z,Et,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,Pe),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,ue),z.deleteBuffer(Pe),z.deleteSync(Et),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,F=null,X=0){S.isTexture!==!0&&(Rr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,S=arguments[1]);let q=Math.pow(2,-X),B=Math.floor(S.image.width*q),ue=Math.floor(S.image.height*q),_e=F!==null?F.x:0,Ce=F!==null?F.y:0;C.setTexture2D(S,0),z.copyTexSubImage2D(z.TEXTURE_2D,X,0,0,_e,Ce,B,ue),Oe.unbindTexture()},this.copyTextureToTexture=function(S,F,X=null,q=null,B=0){S.isTexture!==!0&&(Rr("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,S=arguments[1],F=arguments[2],B=arguments[3]||0,X=null);let ue,_e,Ce,Ie,qe,Ze,Pe,ft,Et,At=S.isCompressedTexture?S.mipmaps[B]:S.image;X!==null?(ue=X.max.x-X.min.x,_e=X.max.y-X.min.y,Ce=X.isBox3?X.max.z-X.min.z:1,Ie=X.min.x,qe=X.min.y,Ze=X.isBox3?X.min.z:0):(ue=At.width,_e=At.height,Ce=At.depth||1,Ie=0,qe=0,Ze=0),q!==null?(Pe=q.x,ft=q.y,Et=q.z):(Pe=0,ft=0,Et=0);let _n=Xe.convert(F.format),pt=Xe.convert(F.type),De;F.isData3DTexture?(C.setTexture3D(F,0),De=z.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(C.setTexture2DArray(F,0),De=z.TEXTURE_2D_ARRAY):(C.setTexture2D(F,0),De=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,F.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,F.unpackAlignment);let gi=z.getParameter(z.UNPACK_ROW_LENGTH),mt=z.getParameter(z.UNPACK_IMAGE_HEIGHT),Yn=z.getParameter(z.UNPACK_SKIP_PIXELS),Cs=z.getParameter(z.UNPACK_SKIP_ROWS),An=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,At.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,At.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Ie),z.pixelStorei(z.UNPACK_SKIP_ROWS,qe),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Ze);let yr=S.isDataArrayTexture||S.isData3DTexture,Rt=F.isDataArrayTexture||F.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){let ti=ke.get(S),vr=ke.get(F),On=ke.get(ti.__renderTarget),Li=ke.get(vr.__renderTarget);Oe.bindFramebuffer(z.READ_FRAMEBUFFER,On.__webglFramebuffer),Oe.bindFramebuffer(z.DRAW_FRAMEBUFFER,Li.__webglFramebuffer);for(let Di=0;Di<Ce;Di++)yr&&z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,ke.get(S).__webglTexture,B,Ze+Di),S.isDepthTexture?(Rt&&z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,ke.get(F).__webglTexture,B,Et+Di),z.blitFramebuffer(Ie,qe,ue,_e,Pe,ft,ue,_e,z.DEPTH_BUFFER_BIT,z.NEAREST)):Rt?z.copyTexSubImage3D(De,B,Pe,ft,Et+Di,Ie,qe,ue,_e):z.copyTexSubImage2D(De,B,Pe,ft,Et+Di,Ie,qe,ue,_e);Oe.bindFramebuffer(z.READ_FRAMEBUFFER,null),Oe.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else Rt?S.isDataTexture||S.isData3DTexture?z.texSubImage3D(De,B,Pe,ft,Et,ue,_e,Ce,_n,pt,At.data):F.isCompressedArrayTexture?z.compressedTexSubImage3D(De,B,Pe,ft,Et,ue,_e,Ce,_n,At.data):z.texSubImage3D(De,B,Pe,ft,Et,ue,_e,Ce,_n,pt,At):S.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,B,Pe,ft,ue,_e,_n,pt,At.data):S.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,B,Pe,ft,At.width,At.height,_n,At.data):z.texSubImage2D(z.TEXTURE_2D,B,Pe,ft,ue,_e,_n,pt,At);z.pixelStorei(z.UNPACK_ROW_LENGTH,gi),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,mt),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Yn),z.pixelStorei(z.UNPACK_SKIP_ROWS,Cs),z.pixelStorei(z.UNPACK_SKIP_IMAGES,An),B===0&&F.generateMipmaps&&z.generateMipmap(De),Oe.unbindTexture()},this.copyTextureToTexture3D=function(S,F,X=null,q=null,B=0){return S.isTexture!==!0&&(Rr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,q=arguments[1]||null,S=arguments[2],F=arguments[3],B=arguments[4]||0),Rr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,F,X,q,B)},this.initRenderTarget=function(S){ke.get(S).__webglFramebuffer===void 0&&C.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?C.setTextureCube(S,0):S.isData3DTexture?C.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?C.setTexture2DArray(S,0):C.setTexture2D(S,0),Oe.unbindTexture()},this.resetState=function(){A=0,I=0,R=null,Oe.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}};var $i=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new xe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ir=class extends Jt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Kt,this.environmentIntensity=1,this.environmentRotation=new Kt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var ii=class extends pn{constructor(e=null,t=1,n=1,s,r,a,o,c,h=cn,u=cn,d,f){super(null,a,o,c,h,u,s,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var gs=class extends Ft{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ws=new He,Ld=new He,Oa=[],Dd=new Ai,kv=new He,Tr=new ce,Sr=new Yi,un=class extends ce{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new gs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,kv)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ai),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ws),Dd.copy(e.boundingBox).applyMatrix4(Ws),this.boundingBox.union(Dd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Yi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ws),Sr.copy(e.boundingSphere).applyMatrix4(Ws),this.boundingSphere.union(Sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Tr.geometry=this.geometry,Tr.material=this.material,Tr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Sr.copy(this.boundingSphere),Sr.applyMatrix4(n),e.ray.intersectsSphere(Sr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ws),Ld.multiplyMatrices(n,Ws),Tr.matrixWorld=Ld,Tr.raycast(e,Oa);for(let a=0,o=Oa.length;a<o;a++){let c=Oa[a];c.instanceId=r,c.object=this,t.push(c)}Oa.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new gs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new ii(new Float32Array(s*this.count),s,this.count,Ih,bn));let r=this.morphTexture.source.data.data,a=0;for(let h=0;h<n.length;h++)a+=n[h];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Fr=class extends Ri{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Nd=new He,Yc=new Ur,za=new Yi,Fa=new L,io=class extends Jt{constructor(e=new kt,t=new Fr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),za.copy(n.boundingSphere),za.applyMatrix4(s),za.radius+=r,e.ray.intersectsSphere(za)===!1)return;Nd.copy(s).invert(),Yc.copy(e.ray).applyMatrix4(Nd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let y=f,x=p;y<x;y++){let g=h.getX(y);Fa.fromBufferAttribute(d,g),kd(Fa,g,c,s,e,t,this)}}else{let f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let y=f,x=p;y<x;y++)Fa.fromBufferAttribute(d,y),kd(Fa,y,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function kd(i,e,t,n,s,r,a){let o=Yc.distanceSqToPoint(i);if(o<t){let c=new L;Yc.closestPointToPoint(i,c),c.applyMatrix4(n);let h=s.ray.origin.distanceTo(c);if(h<s.near||h>s.far)return;r.push({distance:h,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Zi=class extends pn{constructor(e,t,n,s,r,a,o,c,h){super(e,t,n,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},Bn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let u=n[s],f=n[s+1]-u,p=(a-u)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new he:new L);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new L,s=[],r=[],a=[],o=new L,c=new He;for(let p=0;p<=e;p++){let y=p/e;s[p]=this.getTangentAt(y,new L)}r[0]=new L,a[0]=new L;let h=Number.MAX_VALUE,u=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=h&&(h=u,n.set(1,0,0)),d<=h&&(h=d,n.set(0,1,0)),f<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let y=Math.acos($t(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,y))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos($t(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let y=1;y<=e;y++)r[y].applyMatrix4(c.makeRotationAxis(s[y],p*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Br=class extends Bn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new he){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=c-this.aX,p=h-this.aY;c=f*u-p*d+this.aX,h=f*d+p*u+this.aY}return n.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},$c=class extends Br{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Uh(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,u,d){let f=(a-r)/h-(o-r)/(h+u)+(o-a)/u,p=(o-a)/u-(c-a)/(u+d)+(c-o)/d;f*=u,p*=u,s(a,o,f,p)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Ba=new L,Gl=new Uh,Vl=new Uh,Wl=new Uh,Zc=class extends Bn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,u;this.closed||o>0?h=s[(o-1)%r]:(Ba.subVectors(s[0],s[1]).add(s[0]),h=Ba);let d=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Ba.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Ba),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,y=Math.pow(h.distanceToSquared(d),p),x=Math.pow(d.distanceToSquared(f),p),g=Math.pow(f.distanceToSquared(u),p);x<1e-4&&(x=1),y<1e-4&&(y=x),g<1e-4&&(g=x),Gl.initNonuniformCatmullRom(h.x,d.x,f.x,u.x,y,x,g),Vl.initNonuniformCatmullRom(h.y,d.y,f.y,u.y,y,x,g),Wl.initNonuniformCatmullRom(h.z,d.z,f.z,u.z,y,x,g)}else this.curveType==="catmullrom"&&(Gl.initCatmullRom(h.x,d.x,f.x,u.x,this.tension),Vl.initCatmullRom(h.y,d.y,f.y,u.y,this.tension),Wl.initCatmullRom(h.z,d.z,f.z,u.z,this.tension));return n.set(Gl.calc(c),Vl.calc(c),Wl.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ud(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function Uv(i,e){let t=1-i;return t*t*e}function Ov(i,e){return 2*(1-i)*i*e}function zv(i,e){return i*i*e}function Pr(i,e,t,n){return Uv(i,e)+Ov(i,t)+zv(i,n)}function Fv(i,e){let t=1-i;return t*t*t*e}function Bv(i,e){let t=1-i;return 3*t*t*i*e}function Hv(i,e){return 3*(1-i)*i*i*e}function Gv(i,e){return i*i*i*e}function Lr(i,e,t,n,s){return Fv(i,e)+Bv(i,t)+Hv(i,n)+Gv(i,s)}var so=class extends Bn{constructor(e=new he,t=new he,n=new he,s=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Lr(e,s.x,r.x,a.x,o.x),Lr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Kc=class extends Bn{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Lr(e,s.x,r.x,a.x,o.x),Lr(e,s.y,r.y,a.y,o.y),Lr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ro=class extends Bn{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Jc=class extends Bn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ao=class extends Bn{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Pr(e,s.x,r.x,a.x),Pr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},jc=class extends Bn{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Pr(e,s.x,r.x,a.x),Pr(e,s.y,r.y,a.y),Pr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},oo=class extends Bn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],u=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Ud(o,c.x,h.x,u.x,d.x),Ud(o,c.y,h.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new he().fromArray(s))}return this}},Od=Object.freeze({__proto__:null,ArcCurve:$c,CatmullRomCurve3:Zc,CubicBezierCurve:so,CubicBezierCurve3:Kc,EllipseCurve:Br,LineCurve:ro,LineCurve3:Jc,QuadraticBezierCurve:ao,QuadraticBezierCurve3:jc,SplineCurve:oo}),Qc=class extends Bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Od[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let h=0;h<c.length;h++){let u=c[h];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Od[s.type]().fromJSON(s))}return this}},eh=class extends Qc{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ro(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new ao(this.currentPoint.clone(),new he(e,t),new he(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new so(this.currentPoint.clone(),new he(e,t),new he(n,s),new he(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new oo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){let h=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+h,t+u,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){let h=new Br(e,t,n,s,r,a,o,c);if(this.curves.length>0){let d=h.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(h);let u=h.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},th=class i extends kt{constructor(e=[new he(0,-.5),new he(.5,0),new he(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=$t(s,0,Math.PI*2);let r=[],a=[],o=[],c=[],h=[],u=1/t,d=new L,f=new he,p=new L,y=new L,x=new L,g=0,m=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,x.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(x.x,x.y,x.z);break;default:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,y.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),c.push(p.x,p.y,p.z),x.copy(y)}for(let v=0;v<=t;v++){let b=n+v*u*s,w=Math.sin(b),D=Math.cos(b);for(let A=0;A<=e.length-1;A++){d.x=e[A].x*w,d.y=e[A].y,d.z=e[A].x*D,a.push(d.x,d.y,d.z),f.x=v/t,f.y=A/(e.length-1),o.push(f.x,f.y);let I=c[3*A+0]*w,R=c[3*A+1],E=c[3*A+0]*D;h.push(I,R,E)}}for(let v=0;v<t;v++)for(let b=0;b<e.length-1;b++){let w=b+v*e.length,D=w,A=w+e.length,I=w+e.length+1,R=w+1;r.push(D,A,R),r.push(I,R,A)}this.setIndex(r),this.setAttribute("position",new ct(a,3)),this.setAttribute("uv",new ct(o,2)),this.setAttribute("normal",new ct(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},tn=class i extends th{constructor(e=1,t=1,n=4,s=8){let r=new eh;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},Hr=class i extends kt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],h=new L,u=new he;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,f=3;d<=t;d++,f+=3){let p=n+d/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),a.push(h.x,h.y,h.z),o.push(0,0,1),u.x=(a[f]/e+1)/2,u.y=(a[f+1]/e+1)/2,c.push(u.x,u.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new ct(a,3)),this.setAttribute("normal",new ct(o,3)),this.setAttribute("uv",new ct(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Je=class i extends kt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let u=[],d=[],f=[],p=[],y=0,x=[],g=n/2,m=0;v(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new ct(d,3)),this.setAttribute("normal",new ct(f,3)),this.setAttribute("uv",new ct(p,2));function v(){let w=new L,D=new L,A=0,I=(t-e)/n;for(let R=0;R<=r;R++){let E=[],_=R/r,P=_*(t-e)+e;for(let U=0;U<=s;U++){let O=U/s,H=O*c+o,K=Math.sin(H),V=Math.cos(H);D.x=P*K,D.y=-_*n+g,D.z=P*V,d.push(D.x,D.y,D.z),w.set(K,I,V).normalize(),f.push(w.x,w.y,w.z),p.push(O,1-_),E.push(y++)}x.push(E)}for(let R=0;R<s;R++)for(let E=0;E<r;E++){let _=x[E][R],P=x[E+1][R],U=x[E+1][R+1],O=x[E][R+1];(e>0||E!==0)&&(u.push(_,P,O),A+=3),(t>0||E!==r-1)&&(u.push(P,U,O),A+=3)}h.addGroup(m,A,0),m+=A}function b(w){let D=y,A=new he,I=new L,R=0,E=w===!0?e:t,_=w===!0?1:-1;for(let U=1;U<=s;U++)d.push(0,g*_,0),f.push(0,_,0),p.push(.5,.5),y++;let P=y;for(let U=0;U<=s;U++){let H=U/s*c+o,K=Math.cos(H),V=Math.sin(H);I.x=E*V,I.y=g*_,I.z=E*K,d.push(I.x,I.y,I.z),f.push(0,_,0),A.x=K*.5+.5,A.y=V*.5*_+.5,p.push(A.x,A.y),y++}for(let U=0;U<s;U++){let O=D+U,H=P+U;w===!0?u.push(H,H+1,O):u.push(H+1,H,O),R+=3}h.addGroup(m,R,w===!0?1:2),m+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},lo=class i extends Je{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},nh=class i extends kt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),h(n),u(),this.setAttribute("position",new ct(r,3)),this.setAttribute("normal",new ct(r.slice(),3)),this.setAttribute("uv",new ct(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){let b=new L,w=new L,D=new L;for(let A=0;A<t.length;A+=3)p(t[A+0],b),p(t[A+1],w),p(t[A+2],D),c(b,w,D,v)}function c(v,b,w,D){let A=D+1,I=[];for(let R=0;R<=A;R++){I[R]=[];let E=v.clone().lerp(w,R/A),_=b.clone().lerp(w,R/A),P=A-R;for(let U=0;U<=P;U++)U===0&&R===A?I[R][U]=E:I[R][U]=E.clone().lerp(_,U/P)}for(let R=0;R<A;R++)for(let E=0;E<2*(A-R)-1;E++){let _=Math.floor(E/2);E%2===0?(f(I[R][_+1]),f(I[R+1][_]),f(I[R][_])):(f(I[R][_+1]),f(I[R+1][_+1]),f(I[R+1][_]))}}function h(v){let b=new L;for(let w=0;w<r.length;w+=3)b.x=r[w+0],b.y=r[w+1],b.z=r[w+2],b.normalize().multiplyScalar(v),r[w+0]=b.x,r[w+1]=b.y,r[w+2]=b.z}function u(){let v=new L;for(let b=0;b<r.length;b+=3){v.x=r[b+0],v.y=r[b+1],v.z=r[b+2];let w=g(v)/2/Math.PI+.5,D=m(v)/Math.PI+.5;a.push(w,1-D)}y(),d()}function d(){for(let v=0;v<a.length;v+=6){let b=a[v+0],w=a[v+2],D=a[v+4],A=Math.max(b,w,D),I=Math.min(b,w,D);A>.9&&I<.1&&(b<.2&&(a[v+0]+=1),w<.2&&(a[v+2]+=1),D<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,b){let w=v*3;b.x=e[w+0],b.y=e[w+1],b.z=e[w+2]}function y(){let v=new L,b=new L,w=new L,D=new L,A=new he,I=new he,R=new he;for(let E=0,_=0;E<r.length;E+=9,_+=6){v.set(r[E+0],r[E+1],r[E+2]),b.set(r[E+3],r[E+4],r[E+5]),w.set(r[E+6],r[E+7],r[E+8]),A.set(a[_+0],a[_+1]),I.set(a[_+2],a[_+3]),R.set(a[_+4],a[_+5]),D.copy(v).add(b).add(w).divideScalar(3);let P=g(D);x(A,_+0,v,P),x(I,_+2,b,P),x(R,_+4,w,P)}}function x(v,b,w,D){D<0&&v.x===1&&(a[b]=v.x-1),w.x===0&&w.z===0&&(a[b]=D/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Gr=class i extends nh{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var si=class i extends kt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],h=[],u=[],d=e,f=(t-e)/s,p=new L,y=new he;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let m=r+g/n*a;p.x=d*Math.cos(m),p.y=d*Math.sin(m),c.push(p.x,p.y,p.z),h.push(0,0,1),y.x=(p.x/t+1)/2,y.y=(p.y/t+1)/2,u.push(y.x,y.y)}d+=f}for(let x=0;x<s;x++){let g=x*(n+1);for(let m=0;m<n;m++){let v=m+g,b=v,w=v+n+1,D=v+n+2,A=v+1;o.push(b,w,A),o.push(w,D,A)}}this.setIndex(o),this.setAttribute("position",new ct(c,3)),this.setAttribute("normal",new ct(h,3)),this.setAttribute("uv",new ct(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var vt=class i extends kt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),h=0,u=[],d=new L,f=new L,p=[],y=[],x=[],g=[];for(let m=0;m<=n;m++){let v=[],b=m/n,w=0;m===0&&a===0?w=.5/t:m===n&&c===Math.PI&&(w=-.5/t);for(let D=0;D<=t;D++){let A=D/t;d.x=-e*Math.cos(s+A*r)*Math.sin(a+b*o),d.y=e*Math.cos(a+b*o),d.z=e*Math.sin(s+A*r)*Math.sin(a+b*o),y.push(d.x,d.y,d.z),f.copy(d).normalize(),x.push(f.x,f.y,f.z),g.push(A+w,1-b),v.push(h++)}u.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){let b=u[m][v+1],w=u[m][v],D=u[m+1][v],A=u[m+1][v+1];(m!==0||a>0)&&p.push(b,w,A),(m!==n-1||c<Math.PI)&&p.push(w,D,A)}this.setIndex(p),this.setAttribute("position",new ct(y,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var nn=class i extends kt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],h=[],u=new L,d=new L,f=new L;for(let p=0;p<=n;p++)for(let y=0;y<=s;y++){let x=y/s*r,g=p/n*Math.PI*2;d.x=(e+t*Math.cos(g))*Math.cos(x),d.y=(e+t*Math.cos(g))*Math.sin(x),d.z=t*Math.sin(g),o.push(d.x,d.y,d.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),f.subVectors(d,u).normalize(),c.push(f.x,f.y,f.z),h.push(y/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let y=1;y<=s;y++){let x=(s+1)*p+y-1,g=(s+1)*(p-1)+y-1,m=(s+1)*(p-1)+y,v=(s+1)*p+y;a.push(x,g,v),a.push(g,m,v)}this.setIndex(a),this.setAttribute("position",new ct(o,3)),this.setAttribute("normal",new ct(c,3)),this.setAttribute("uv",new ct(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var co=class extends Ct{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}},Ae=class extends Ri{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nh,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var ho=class extends Ri{static get type(){return"MeshNormalMaterial"}constructor(e){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nh,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};function Ha(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Vv(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var sr=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ih=class extends sr{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Uu,endingEnd:Uu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ou:r=e,o=2*t-n;break;case zu:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ou:a=e,c=2*n-t;break;case zu:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let h=(n-t)*.5,u=this.valueSize;this._weightPrev=h/(t-o),this._weightNext=h/(c-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,u=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,p=this._weightNext,y=(n-t)/(s-t),x=y*y,g=x*y,m=-f*g+2*f*x-f*y,v=(1+f)*g+(-1.5-2*f)*x+(-.5+f)*y+1,b=(-1-p)*g+(1.5+p)*x+.5*y,w=p*g-p*x;for(let D=0;D!==o;++D)r[D]=m*a[u+D]+v*a[h+D]+b*a[c+D]+w*a[d+D];return r}},sh=class extends sr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,h=c-o,u=(n-t)/(s-t),d=1-u;for(let f=0;f!==o;++f)r[f]=a[h+f]*d+a[c+f]*u;return r}},rh=class extends sr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Qn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ha(t,this.TimeBufferType),this.values=Ha(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ha(e.times,Array),values:Ha(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new rh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new sh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ih(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ya:t=this.InterpolantFactoryMethodDiscrete;break;case Ic:t=this.InterpolantFactoryMethodLinear;break;case fl:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ya;case this.InterpolantFactoryMethodLinear:return Ic;case this.InterpolantFactoryMethodSmooth:return fl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&Vv(s))for(let o=0,c=s.length;o!==c;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===fl,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,h=e[o],u=e[o+1];if(h!==u&&(o!==1||h!==e[0]))if(s)c=!0;else{let d=o*n,f=d-n,p=d+n;for(let y=0;y!==n;++y){let x=t[d+y];if(x!==t[f+y]||x!==t[p+y]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let d=o*n,f=a*n;for(let p=0;p!==n;++p)t[f+p]=t[d+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,h=0;h!==n;++h)t[c+h]=t[o+h];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Qn.prototype.TimeBufferType=Float32Array;Qn.prototype.ValueBufferType=Float32Array;Qn.prototype.DefaultInterpolation=Ic;var xs=class extends Qn{constructor(e,t,n){super(e,t,n)}};xs.prototype.ValueTypeName="bool";xs.prototype.ValueBufferType=Array;xs.prototype.DefaultInterpolation=Ya;xs.prototype.InterpolantFactoryMethodLinear=void 0;xs.prototype.InterpolantFactoryMethodSmooth=void 0;var ah=class extends Qn{};ah.prototype.ValueTypeName="color";var oh=class extends Qn{};oh.prototype.ValueTypeName="number";var lh=class extends sr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),h=e*o;for(let u=h+o;h!==u;h+=4)Zt.slerpFlat(r,0,a,h-o,a,h,c);return r}},uo=class extends Qn{InterpolantFactoryMethodLinear(e){return new lh(this.times,this.values,this.getValueSize(),e)}};uo.prototype.ValueTypeName="quaternion";uo.prototype.InterpolantFactoryMethodSmooth=void 0;var ys=class extends Qn{constructor(e,t,n){super(e,t,n)}};ys.prototype.ValueTypeName="string";ys.prototype.ValueBufferType=Array;ys.prototype.DefaultInterpolation=Ya;ys.prototype.InterpolantFactoryMethodLinear=void 0;ys.prototype.InterpolantFactoryMethodSmooth=void 0;var ch=class extends Qn{};ch.prototype.ValueTypeName="vector";var fo={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},hh=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return h.push(u,d),this},this.removeHandler=function(u){let d=h.indexOf(u);return d!==-1&&h.splice(d,2),this},this.getHandler=function(u){for(let d=0,f=h.length;d<f;d+=2){let p=h[d],y=h[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return y}return null}}},Wv=new hh,vs=class{constructor(e){this.manager=e!==void 0?e:Wv,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};vs.DEFAULT_MATERIAL_NAME="__DEFAULT";var bi={},uh=class extends Error{constructor(e,t){super(e),this.response=t}},dh=class extends vs{constructor(e){super(e)}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=fo.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(bi[e]!==void 0){bi[e].push({onLoad:t,onProgress:n,onError:s});return}bi[e]=[],bi[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,c=this.responseType;fetch(a).then(h=>{if(h.status===200||h.status===0){if(h.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||h.body===void 0||h.body.getReader===void 0)return h;let u=bi[e],d=h.body.getReader(),f=h.headers.get("X-File-Size")||h.headers.get("Content-Length"),p=f?parseInt(f):0,y=p!==0,x=0,g=new ReadableStream({start(m){v();function v(){d.read().then(({done:b,value:w})=>{if(b)m.close();else{x+=w.byteLength;let D=new ProgressEvent("progress",{lengthComputable:y,loaded:x,total:p});for(let A=0,I=u.length;A<I;A++){let R=u[A];R.onProgress&&R.onProgress(D)}m.enqueue(w),v()}},b=>{m.error(b)})}}});return new Response(g)}else throw new uh(`fetch for "${h.url}" responded with ${h.status}: ${h.statusText}`,h)}).then(h=>{switch(c){case"arraybuffer":return h.arrayBuffer();case"blob":return h.blob();case"document":return h.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return h.json();default:if(o===void 0)return h.text();{let d=/charset="?([^;"\s]*)"?/i.exec(o),f=d&&d[1]?d[1].toLowerCase():void 0,p=new TextDecoder(f);return h.arrayBuffer().then(y=>p.decode(y))}}}).then(h=>{fo.add(e,h);let u=bi[e];delete bi[e];for(let d=0,f=u.length;d<f;d++){let p=u[d];p.onLoad&&p.onLoad(h)}}).catch(h=>{let u=bi[e];if(u===void 0)throw this.manager.itemError(e),h;delete bi[e];for(let d=0,f=u.length;d<f;d++){let p=u[d];p.onError&&p.onError(h)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}};var fh=class extends vs{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=fo.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;let o=kr("img");function c(){u(),fo.add(e,this),t&&t(this),r.manager.itemEnd(e)}function h(d){u(),s&&s(d),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",c,!1),o.removeEventListener("error",h,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",h,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}};var po=class extends vs{constructor(e){super(e)}load(e,t,n,s){let r=this,a=new ii,o=new dh(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(c){let h;try{h=r.parse(c)}catch(u){if(s!==void 0)s(u);else{console.error(u);return}}h.image!==void 0?a.image=h.image:h.data!==void 0&&(a.image.width=h.width,a.image.height=h.height,a.image.data=h.data),a.wrapS=h.wrapS!==void 0?h.wrapS:Pn,a.wrapT=h.wrapT!==void 0?h.wrapT:Pn,a.magFilter=h.magFilter!==void 0?h.magFilter:Gt,a.minFilter=h.minFilter!==void 0?h.minFilter:Gt,a.anisotropy=h.anisotropy!==void 0?h.anisotropy:1,h.colorSpace!==void 0&&(a.colorSpace=h.colorSpace),h.flipY!==void 0&&(a.flipY=h.flipY),h.format!==void 0&&(a.format=h.format),h.type!==void 0&&(a.type=h.type),h.mipmaps!==void 0&&(a.mipmaps=h.mipmaps,a.minFilter=Hi),h.mipmapCount===1&&(a.minFilter=Gt),h.generateMipmaps!==void 0&&(a.generateMipmaps=h.generateMipmaps),a.needsUpdate=!0,t&&t(a,h)},n,s),a}},mo=class extends vs{constructor(e){super(e)}load(e,t,n,s){let r=new pn,a=new fh(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},rr=class extends Jt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},go=class extends rr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Jt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Xl=new He,zd=new L,Fd=new L,Vr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.map=null,this.mapPass=null,this.matrix=new He,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zr,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;zd.setFromMatrixPosition(e.matrixWorld),t.position.copy(zd),Fd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fd),t.updateMatrixWorld(),Xl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Xl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Xl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ph=class extends Vr{constructor(){super(new en(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=Za*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},xo=class extends rr{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Jt.DEFAULT_UP),this.updateMatrix(),this.target=new Jt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new ph}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Bd=new He,Ar=new L,ql=new L,mh=class extends Vr{constructor(){super(new en(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new he(4,2),this._viewportCount=6,this._viewports=[new _t(2,1,1,1),new _t(0,1,1,1),new _t(3,1,1,1),new _t(1,1,1,1),new _t(3,0,1,1),new _t(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ar.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ar),ql.copy(n.position),ql.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ql),n.updateMatrixWorld(),s.makeTranslation(-Ar.x,-Ar.y,-Ar.z),Bd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bd)}},ar=class extends rr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new mh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},gh=class extends Vr{constructor(){super(new er(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},yo=class extends rr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Jt.DEFAULT_UP),this.updateMatrix(),this.target=new Jt,this.shadow=new gh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var vo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Hd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Hd();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function Hd(){return performance.now()}var Oh="\\[\\]\\.:\\/",Xv=new RegExp("["+Oh+"]","g"),zh="[^"+Oh+"]",qv="[^"+Oh.replace("\\.","")+"]",Yv=/((?:WC+[\/:])*)/.source.replace("WC",zh),$v=/(WCOD+)?/.source.replace("WCOD",qv),Zv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",zh),Kv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",zh),Jv=new RegExp("^"+Yv+$v+Zv+Kv+"$"),jv=["material","materials","bones","map"],xh=class{constructor(e,t,n){let s=n||It.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},It=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Xv,"")}static parseTrackName(e){let t=Jv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);jv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===h){h=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let a=e[s];if(a===void 0){let h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};It.Composite=xh;It.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};It.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};It.prototype.GetterByBindingType=[It.prototype._getValue_direct,It.prototype._getValue_array,It.prototype._getValue_arrayElement,It.prototype._getValue_toArray];It.prototype.SetterByBindingTypeAndVersioning=[[It.prototype._setValue_direct,It.prototype._setValue_direct_setNeedsUpdate,It.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[It.prototype._setValue_array,It.prototype._setValue_array_setNeedsUpdate,It.prototype._setValue_array_setMatrixWorldNeedsUpdate],[It.prototype._setValue_arrayElement,It.prototype._setValue_arrayElement_setNeedsUpdate,It.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[It.prototype._setValue_fromArray,It.prototype._setValue_fromArray_setNeedsUpdate,It.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var H_=new Float32Array(1);var Gd=new He,_o=class{constructor(e,t,n=0,s=1/0){this.ray=new Ur(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Or,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Gd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Gd),this}intersectObject(e,t=!0,n=[]){return yh(e,this,n,t),n.sort(Vd),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)yh(e[s],this,n,t);return n.sort(Vd),n}};function Vd(i,e){return i.distance-e.distance}function yh(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)yh(r[a],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vh);var Ki={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var mn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Qv=new er(-1,1,1,-1,0,1),Fh=class extends kt{constructor(){super(),this.setAttribute("position",new ct([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ct([0,2,0,0,2,0],2))}},e1=new Fh,oi=class{constructor(e){this._mesh=new ce(e1,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Qv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var cr=class extends mn{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Ct?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=wn.clone(e.uniforms),this.material=new Ct({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new oi(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Yr=class extends mn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},So=class extends mn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Ao=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new he);this._width=n.width,this._height=n.height,t=new Bt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ut}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new cr(Ki),this.copyPass.material.blending=Vt,this.clock=new vo}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Yr!==void 0&&(a instanceof Yr?n=!0:a instanceof So&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new he);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Ro=class extends mn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new xe}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var df={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new xe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var hr=class i extends mn{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new he(e.x,e.y):new he(256,256),this.clearColor=new xe(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Bt(r,a,{type:Ut}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){let f=new Bt(r,a,{type:Ut});f.texture.name="UnrealBloomPass.h"+d,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let p=new Bt(r,a,{type:Ut});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}let o=df;this.highPassUniforms=wn.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ct({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new he(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let u=Ki;this.copyUniforms=wn.clone(u.uniforms),this.blendMaterial=new Ct({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:hn,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new xe,this.oldClearAlpha=1,this.basic=new ut,this.fsQuad=new oi(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new he(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Ct({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new he(.5,.5)},direction:{value:new he(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new Ct({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}};hr.BlurDirectionX=new he(1,0);hr.BlurDirectionY=new he(0,1);var $r={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new he},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new He},cameraProjectionMatrixInverse:{value:new He},cameraWorldMatrix:{value:new He},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new L(-1,-1,-1)},sceneBoxMax:{value:new L(1,1,1)}},vertexShader:`

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
		}`},Zr={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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

		}`},Co={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
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
		}`};function ff(i=5){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=t1(e),n=t.length,s=new Uint8Array(n*4);for(let a=0;a<n;++a){let o=t[a],c=2*Math.PI*o/n,h=new L(Math.cos(c),Math.sin(c),0).normalize();s[a*4]=(h.x*.5+.5)*255,s[a*4+1]=(h.y*.5+.5)*255,s[a*4+2]=127,s[a*4+3]=255}let r=new ii(s,e,e);return r.wrapS=Ln,r.wrapT=Ln,r.needsUpdate=!0,r}function t1(i){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=e*e,n=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let a=1;a<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),n[s*e+r]!==0){r-=2,s++;continue}else n[s*e+r]=a++;r++,s--}return n}var Kr={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Bh(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new he},cameraProjectionMatrixInverse:{value:new He},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function Bh(i,e,t){let n=n1(i,e,t),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let a=n[r];s+=`vec3(${a.x}, ${a.y}, ${a.z})${r<i-1?",":")"}`}return s}function n1(i,e,t){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*e*s/i,a=Math.pow(s/(i-1),t);n.push(new L(Math.cos(r),Math.sin(r),a))}return n}var Io=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,n){return e[0]*t+e[1]*n}dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}noise(e,t){let n,s,r,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,c=Math.floor(e+o),h=Math.floor(t+o),u=(3-Math.sqrt(3))/6,d=(c+h)*u,f=c-d,p=h-d,y=e-f,x=t-p,g,m;y>x?(g=1,m=0):(g=0,m=1);let v=y-g+u,b=x-m+u,w=y-1+2*u,D=x-1+2*u,A=c&255,I=h&255,R=this.perm[A+this.perm[I]]%12,E=this.perm[A+g+this.perm[I+m]]%12,_=this.perm[A+1+this.perm[I+1]]%12,P=.5-y*y-x*x;P<0?n=0:(P*=P,n=P*P*this.dot(this.grad3[R],y,x));let U=.5-v*v-b*b;U<0?s=0:(U*=U,s=U*U*this.dot(this.grad3[E],v,b));let O=.5-w*w-D*D;return O<0?r=0:(O*=O,r=O*O*this.dot(this.grad3[_],w,D)),70*(n+s+r)}noise3d(e,t,n){let s,r,a,o,h=(e+t+n)*.3333333333333333,u=Math.floor(e+h),d=Math.floor(t+h),f=Math.floor(n+h),p=1/6,y=(u+d+f)*p,x=u-y,g=d-y,m=f-y,v=e-x,b=t-g,w=n-m,D,A,I,R,E,_;v>=b?b>=w?(D=1,A=0,I=0,R=1,E=1,_=0):v>=w?(D=1,A=0,I=0,R=1,E=0,_=1):(D=0,A=0,I=1,R=1,E=0,_=1):b<w?(D=0,A=0,I=1,R=0,E=1,_=1):v<w?(D=0,A=1,I=0,R=0,E=1,_=1):(D=0,A=1,I=0,R=1,E=1,_=0);let P=v-D+p,U=b-A+p,O=w-I+p,H=v-R+2*p,K=b-E+2*p,V=w-_+2*p,se=v-1+3*p,Y=b-1+3*p,ne=w-1+3*p,J=u&255,oe=d&255,ge=f&255,Re=this.perm[J+this.perm[oe+this.perm[ge]]]%12,$=this.perm[J+D+this.perm[oe+A+this.perm[ge+I]]]%12,ae=this.perm[J+R+this.perm[oe+E+this.perm[ge+_]]]%12,Ee=this.perm[J+1+this.perm[oe+1+this.perm[ge+1]]]%12,de=.6-v*v-b*b-w*w;de<0?s=0:(de*=de,s=de*de*this.dot3(this.grad3[Re],v,b,w));let Le=.6-P*P-U*U-O*O;Le<0?r=0:(Le*=Le,r=Le*Le*this.dot3(this.grad3[$],P,U,O));let Fe=.6-H*H-K*K-V*V;Fe<0?a=0:(Fe*=Fe,a=Fe*Fe*this.dot3(this.grad3[ae],H,K,V));let We=.6-se*se-Y*Y-ne*ne;return We<0?o=0:(We*=We,o=We*We*this.dot3(this.grad3[Ee],se,Y,ne)),32*(s+r+a+o)}noise4d(e,t,n,s){let r=this.grad4,a=this.simplex,o=this.perm,c=(Math.sqrt(5)-1)/4,h=(5-Math.sqrt(5))/20,u,d,f,p,y,x=(e+t+n+s)*c,g=Math.floor(e+x),m=Math.floor(t+x),v=Math.floor(n+x),b=Math.floor(s+x),w=(g+m+v+b)*h,D=g-w,A=m-w,I=v-w,R=b-w,E=e-D,_=t-A,P=n-I,U=s-R,O=E>_?32:0,H=E>P?16:0,K=_>P?8:0,V=E>U?4:0,se=_>U?2:0,Y=P>U?1:0,ne=O+H+K+V+se+Y,J=a[ne][0]>=3?1:0,oe=a[ne][1]>=3?1:0,ge=a[ne][2]>=3?1:0,Re=a[ne][3]>=3?1:0,$=a[ne][0]>=2?1:0,ae=a[ne][1]>=2?1:0,Ee=a[ne][2]>=2?1:0,de=a[ne][3]>=2?1:0,Le=a[ne][0]>=1?1:0,Fe=a[ne][1]>=1?1:0,We=a[ne][2]>=1?1:0,wt=a[ne][3]>=1?1:0,rt=E-J+h,St=_-oe+h,z=P-ge+h,sn=U-Re+h,nt=E-$+2*h,it=_-ae+2*h,Oe=P-Ee+2*h,xt=U-de+2*h,ke=E-Le+3*h,C=_-Fe+3*h,T=P-We+3*h,W=U-wt+3*h,ee=E-1+4*h,re=_-1+4*h,j=P-1+4*h,Se=U-1+4*h,pe=g&255,ye=m&255,Qe=v&255,le=b&255,be=o[pe+o[ye+o[Qe+o[le]]]]%32,Be=o[pe+J+o[ye+oe+o[Qe+ge+o[le+Re]]]]%32,Ve=o[pe+$+o[ye+ae+o[Qe+Ee+o[le+de]]]]%32,we=o[pe+Le+o[ye+Fe+o[Qe+We+o[le+wt]]]]%32,at=o[pe+1+o[ye+1+o[Qe+1+o[le+1]]]]%32,Xe=.6-E*E-_*_-P*P-U*U;Xe<0?u=0:(Xe*=Xe,u=Xe*Xe*this.dot4(r[be],E,_,P,U));let dt=.6-rt*rt-St*St-z*z-sn*sn;dt<0?d=0:(dt*=dt,d=dt*dt*this.dot4(r[Be],rt,St,z,sn));let k=.6-nt*nt-it*it-Oe*Oe-xt*xt;k<0?f=0:(k*=k,f=k*k*this.dot4(r[Ve],nt,it,Oe,xt));let fe=.6-ke*ke-C*C-T*T-W*W;fe<0?p=0:(fe*=fe,p=fe*fe*this.dot4(r[we],ke,C,T,W));let Z=.6-ee*ee-re*re-j*j-Se*Se;return Z<0?y=0:(Z*=Z,y=Z*Z*this.dot4(r[at],ee,re,j,Se)),27*(u+d+f+p+y)}};var Jr=class i extends mn{constructor(e,t,n,s,r,a,o){super(),this.width=n!==void 0?n:512,this.height=s!==void 0?s:512,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=ff(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new Bt(this.width,this.height,{type:Ut}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new Ct({defines:Object.assign({},$r.defines),uniforms:wn.clone($r.uniforms),vertexShader:$r.vertexShader,fragmentShader:$r.fragmentShader,blending:Vt,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new ho,this.normalMaterial.blending=Vt,this.pdMaterial=new Ct({defines:Object.assign({},Kr.defines),uniforms:wn.clone(Kr.uniforms),vertexShader:Kr.vertexShader,fragmentShader:Kr.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new Ct({defines:Object.assign({},Zr.defines),uniforms:wn.clone(Zr.uniforms),vertexShader:Zr.vertexShader,fragmentShader:Zr.fragmentShader,blending:Vt}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new Ct({uniforms:wn.clone(Ki.uniforms),vertexShader:Ki.vertexShader,fragmentShader:Ki.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:bo,blendDst:or,blendEquation:Fn,blendSrcAlpha:Mo,blendDstAlpha:or,blendEquationAlpha:Fn}),this.blendMaterial=new Ct({uniforms:wn.clone(Co.uniforms),vertexShader:Co.vertexShader,fragmentShader:Co.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Mh,blendSrc:bo,blendDst:or,blendEquation:Fn,blendSrcAlpha:Mo,blendDstAlpha:or,blendEquationAlpha:Fn}),this.fsQuad=new oi(null),this.originalClearColor=new xe,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new nr,this.depthTexture.format=Xi,this.depthTexture.type=Wi,this.normalRenderTarget=new Bt(this.width,this.height,{minFilter:cn,magFilter:cn,type:Ut,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Bh(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,n){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Vt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Vt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Vt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Vt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Vt,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(e,t,n,s,r){e.getClearColor(this.originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(a)}renderOverride(e,t,n,s,r){e.getClearColor(this.originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this.originalClearColor),e.setClearAlpha(a)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){t.set(n,n.visible),(n.isPoints||n.isLine)&&(n.visible=!1)})}restoreVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){let s=t.get(n);n.visible=s}),t.clear()}generateNoise(e=64){let t=new Io,n=e*e*4,s=new Uint8Array(n);for(let a=0;a<e;a++)for(let o=0;o<e;o++){let c=a,h=o;s[(a*e+o)*4]=(t.noise(c,h)*.5+.5)*255,s[(a*e+o)*4+1]=(t.noise(c+e,h)*.5+.5)*255,s[(a*e+o)*4+2]=(t.noise(c,h+e)*.5+.5)*255,s[(a*e+o)*4+3]=(t.noise(c+e,h+e)*.5+.5)*255}let r=new ii(s,e,e,fn,jn);return r.wrapS=Ln,r.wrapT=Ln,r.needsUpdate=!0,r}};Jr.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var pf={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var Po=class extends mn{constructor(){super();let e=pf;this.uniforms=wn.clone(e.uniforms),this.material=new co({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new oi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},lt.getTransfer(this._outputColorSpace)===gt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===bh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===wh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Eh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Wr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Th?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Sh&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Lo=class extends ir{constructor(){super();let e=new Te;e.deleteAttribute("uv");let t=new Ae({side:ln}),n=new Ae,s=new ar(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ce(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new ce(e,n);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);let o=new ce(e,n);o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),this.add(o);let c=new ce(e,n);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);let h=new ce(e,n);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);let u=new ce(e,n);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);let d=new ce(e,n);d.position.set(-2.193,-.369,-5.547),d.rotation.set(0,.516,0),d.scale.set(3.875,3.487,2.986),this.add(d);let f=new ce(e,ur(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);let p=new ce(e,ur(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let y=new ce(e,ur(17));y.position.set(14.904,12.198,-1.832),y.scale.set(.15,4.265,6.331),this.add(y);let x=new ce(e,ur(43));x.position.set(-.462,8.89,14.52),x.scale.set(4.38,5.441,.088),this.add(x);let g=new ce(e,ur(20));g.position.set(3.235,11.486,-12.541),g.scale.set(2.5,2,.1),this.add(g);let m=new ce(e,ur(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function ur(i){let e=new ut;return e.color.setScalar(i),e}var Do=class extends po{constructor(e){super(e),this.type=Ut}parse(e){let a=function(R,E){switch(R){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(E||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(E||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(E||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(E||""))}},u=`
`,d=function(R,E,_){E=E||1024;let U=R.pos,O=-1,H=0,K="",V=String.fromCharCode.apply(null,new Uint16Array(R.subarray(U,U+128)));for(;0>(O=V.indexOf(u))&&H<E&&U<R.byteLength;)K+=V,H+=V.length,U+=128,V+=String.fromCharCode.apply(null,new Uint16Array(R.subarray(U,U+128)));return-1<O?(_!==!1&&(R.pos+=H+O+1),K+V.slice(0,O)):!1},f=function(R){let E=/^#\?(\S+)/,_=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,P=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,U=/^\s*FORMAT=(\S+)\s*$/,O=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,H={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},K,V;for((R.pos>=R.byteLength||!(K=d(R)))&&a(1,"no header found"),(V=K.match(E))||a(3,"bad initial token"),H.valid|=1,H.programtype=V[1],H.string+=K+`
`;K=d(R),K!==!1;){if(H.string+=K+`
`,K.charAt(0)==="#"){H.comments+=K+`
`;continue}if((V=K.match(_))&&(H.gamma=parseFloat(V[1])),(V=K.match(P))&&(H.exposure=parseFloat(V[1])),(V=K.match(U))&&(H.valid|=2,H.format=V[1]),(V=K.match(O))&&(H.valid|=4,H.height=parseInt(V[1],10),H.width=parseInt(V[2],10)),H.valid&2&&H.valid&4)break}return H.valid&2||a(3,"missing format specifier"),H.valid&4||a(3,"missing image size specifier"),H},p=function(R,E,_){let P=E;if(P<8||P>32767||R[0]!==2||R[1]!==2||R[2]&128)return new Uint8Array(R);P!==(R[2]<<8|R[3])&&a(3,"wrong scanline width");let U=new Uint8Array(4*E*_);U.length||a(4,"unable to allocate buffer space");let O=0,H=0,K=4*P,V=new Uint8Array(4),se=new Uint8Array(K),Y=_;for(;Y>0&&H<R.byteLength;){H+4>R.byteLength&&a(1),V[0]=R[H++],V[1]=R[H++],V[2]=R[H++],V[3]=R[H++],(V[0]!=2||V[1]!=2||(V[2]<<8|V[3])!=P)&&a(3,"bad rgbe scanline format");let ne=0,J;for(;ne<K&&H<R.byteLength;){J=R[H++];let ge=J>128;if(ge&&(J-=128),(J===0||ne+J>K)&&a(3,"bad scanline data"),ge){let Re=R[H++];for(let $=0;$<J;$++)se[ne++]=Re}else se.set(R.subarray(H,H+J),ne),ne+=J,H+=J}let oe=P;for(let ge=0;ge<oe;ge++){let Re=0;U[O]=se[ge+Re],Re+=P,U[O+1]=se[ge+Re],Re+=P,U[O+2]=se[ge+Re],Re+=P,U[O+3]=se[ge+Re],O+=4}Y--}return U},y=function(R,E,_,P){let U=R[E+3],O=Math.pow(2,U-128)/255;_[P+0]=R[E+0]*O,_[P+1]=R[E+1]*O,_[P+2]=R[E+2]*O,_[P+3]=1},x=function(R,E,_,P){let U=R[E+3],O=Math.pow(2,U-128)/255;_[P+0]=qr.toHalfFloat(Math.min(R[E+0]*O,65504)),_[P+1]=qr.toHalfFloat(Math.min(R[E+1]*O,65504)),_[P+2]=qr.toHalfFloat(Math.min(R[E+2]*O,65504)),_[P+3]=qr.toHalfFloat(1)},g=new Uint8Array(e);g.pos=0;let m=f(g),v=m.width,b=m.height,w=p(g.subarray(g.pos),v,b),D,A,I;switch(this.type){case bn:I=w.length/4;let R=new Float32Array(I*4);for(let _=0;_<I;_++)y(w,_*4,R,_*4);D=R,A=bn;break;case Ut:I=w.length/4;let E=new Uint16Array(I*4);for(let _=0;_<I;_++)x(w,_*4,E,_*4);D=E,A=Ut;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:v,height:b,data:D,header:m.string,gamma:m.gamma,exposure:m.exposure,type:A}}setDataType(e){return this.type=e,this}load(e,t,n,s){function r(a,o){switch(a.type){case bn:case Ut:a.colorSpace=ri,a.minFilter=Gt,a.magFilter=Gt,a.generateMipmaps=!1,a.flipY=!0;break}t&&t(a,o)}return super.load(e,r,n,s)}};var N={};l.R=N;var i1={uniforms:{tDiffuse:{value:null},uTime:{value:0},uContrast:{value:1.08},uSat:{value:1.12},uTint:{value:new L(1,1,1)},uVignette:{value:.32},uGrain:{value:.035},uSplit:{value:0},uTexel:{value:new he(1/1280,1/720)},uSharp:{value:.2},uTilt:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uTime, uContrast, uSat, uVignette, uGrain, uSplit, uSharp, uTilt; uniform vec3 uTint; uniform vec2 uTexel; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
    void main(){
      vec2 d = (vUv - 0.5);
      vec3 c;
      if (uSplit > 0.001) { // chromatic split on hits
        vec2 o = d * min(uSplit, 0.6) * 0.012; // v16: subtle; it used to smear the whole screen
        c = vec3(texture2D(tDiffuse, vUv + o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - o).b);
      } else c = texture2D(tDiffuse, vUv).rgb;
      // Sharpen: push each pixel away from the blur of its 4 neighbors (crisper edges after TAA-ish softness).
      vec3 nb = texture2D(tDiffuse, vUv + vec2(uTexel.x, 0.0)).rgb + texture2D(tDiffuse, vUv - vec2(uTexel.x, 0.0)).rgb
              + texture2D(tDiffuse, vUv + vec2(0.0, uTexel.y)).rgb + texture2D(tDiffuse, vUv - vec2(0.0, uTexel.y)).rgb;
      // Tilt-shift: the top and bottom of the screen go soft, like a miniature diorama. Middle stays sharp.
      // (v16: lighter touch, only the outer edges, so the fight never looks smeared.)
      float tilt = uTilt * smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
      if (tilt > 0.01) {
        vec3 b = vec3(0.0); float r = tilt * 2.0;
        for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; b += texture2D(tDiffuse, vUv + vec2(cos(a), sin(a)) * uTexel * r * (1.0 + float(i - (i / 2) * 2))).rgb; }
        c = mix(c, b / 8.0, min(1.0, tilt * 0.8));
      }
      c = max(c + (c - nb * 0.25) * uSharp * (1.0 - tilt), 0.0);
      c = (c - 0.5) * uContrast + 0.5;
      c = mix(c, c * c * (3.0 - 2.0 * c), 0.25); // gentle filmic S-curve: deeper shadows, punchier highlights
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, uSat) * uTint;
      c *= 1.0 - uVignette * smoothstep(0.25, 0.85, length(d) * 1.35);
      c += (hash(vUv * 900.0) - 0.5) * uGrain;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`};N.init=function(i){let e=[{antialias:!0,powerPreference:"high-performance"},{antialias:!1,powerPreference:"default"},{antialias:!1,powerPreference:"low-power",failIfMajorPerformanceCaveat:!1,precision:"mediump"}],t=null;for(let s of e)try{N.renderer=new no(Object.assign({canvas:i},s));break}catch(r){t=r}if(!N.renderer){let s=/firefox/i.test(navigator.userAgent);throw document.body.insertAdjacentHTML("beforeend",'<div style="position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:#07080b;color:#fff;font:600 17px system-ui;text-align:center;padding:24px"><div>This browser could not start 3D graphics.<br><br>'+(s?'Firefox fix: Settings \u2192 General \u2192 Performance \u2192 uncheck "Use recommended performance settings", then CHECK "Use hardware acceleration when available", and restart Firefox.<br>Still stuck? Type about:support in the address bar and look at the WebGL 2 line.':"Try closing other tabs, turning off Low Power Mode, or opening the link in Chrome or Safari.")+'<br><br><span style="color:#9aa0ab;font:12px monospace">'+String(t&&t.message||t).slice(0,200)+"</span></div></div>"),t}i.addEventListener("webglcontextlost",s=>{s.preventDefault();let r=0;try{r=+sessionStorage.getItem("sa_lost")||0,sessionStorage.setItem("sa_lost",r+1)}catch{r=9}if(l.settings.quality="low",l.saveSettings(),r<1){setTimeout(()=>location.reload(),1500);return}document.body.insertAdjacentHTML("beforeend",'<div style="position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:#07080b;color:#fff;font:600 17px system-ui;text-align:center;padding:24px">The graphics driver keeps crashing in this browser.<br><br>Restart the browser and try again on Low, or open the game in Chrome or Edge.</div>')}),N.renderer.toneMapping=Wr,N.renderer.toneMappingExposure=1.05,N.renderer.shadowMap.type=_h,N.scene=new ir,N.pmrem=new tr(N.renderer),N.studioEnv=N.pmrem.fromScene(new Lo,.04).texture,N.scene.environment=N.studioEnv,N.scene.environmentIntensity=.35,N.envCache={},N.camera=new en(38,1,.5,300),N.camOffset=new L(0,19,12),N.camTarget=new L,N.shake=0,N.split=0,N.dyn=1,N.dynT=0,N.hemi=new go(13624319,3813928,.7),N.scene.add(N.hemi),N.sun=new yo(16773590,2.2),N.sun.position.set(12,30,8),Object.assign(N.sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:80}),N.sun.shadow.bias=-4e-4,N.sun.shadow.normalBias=.03,N.scene.add(N.sun,N.sun.target),N.lights=[];for(let s=0;s<8;s++){let r=new ar(16777215,0,20,1.2);r.position.set(0,-50,0),N.scene.add(r),N.lights.push(r)}N.lightNext=0,N.flash=new xo(16773848,0,26,.42,.45,1),N.flash.position.set(0,-50,0),N.scene.add(N.flash,N.flash.target),N.flashOn=!1,N.flashBoost=0,N.muzzleT=0;let n=new lo(2.6,11,24,1,!0).translate(0,-5.5,0).rotateX(-Math.PI/2);N.beam=new ce(n,new ut({color:16773328,transparent:!0,opacity:.07,blending:hn,depthWrite:!1,side:Nt,toneMapped:!1})),N.beam.visible=!1,N.beam.renderOrder=4,N.scene.add(N.beam),N.applyQuality(l.settings.quality),addEventListener("resize",N.resize)};N.setEnv=function(i){if(N.envWant=i,N.envCache[i]){N.scene.environment=N.envCache[i];return}fetch(`assets/hdri/${i}_1k.b64.txt`).then(e=>{if(!e.ok)throw new Error(e.status);return e.text()}).then(e=>{let t=atob(e.trim()),n=new Uint8Array(t.length);for(let o=0;o<t.length;o++)n[o]=t.charCodeAt(o);let s=new Do().parse(n.buffer),r=new ii(s.data,s.width,s.height,fn,s.type);Object.assign(r,{colorSpace:ri,mapping:Dr,minFilter:Gt,magFilter:Gt,generateMipmaps:!1,flipY:!0}),r.needsUpdate=!0;let a=N.pmrem.fromEquirectangular(r).texture;r.dispose(),N.envCache[i]=a,N.envWant===i&&(N.scene.environment=a)}).catch(()=>{N.scene.environment=N.studioEnv})};N.muzzle=function(i,e,t=1){let n=l.W.muzzle;n&&(N.muzzleT=Math.max(N.muzzleT,t),n.position.set(i,1.6,e))};N.updateFlash=function(i){let e=l.officers&&l.officers.find(t=>!t.down);if(l.W.muzzle&&(N.muzzleT=Math.max(0,N.muzzleT-i*9),l.W.muzzle.intensity=N.muzzleT*40),!N.flashOn||!e){N.flash.intensity=0,N.flash.position.set(0,-50,0),N.beam.visible=!1;return}N.flashBoost=Math.max(0,N.flashBoost-i*4),N.flash.intensity=90+N.flashBoost*160,N.flash.distance=32,N.flash.angle=.5-N.flashBoost*.08,N.beam.visible=!0,N.beam.position.set(e.x+e.ax*.5,1.5,e.z+e.az*.5),N.beam.lookAt(e.x+e.ax*11,.2,e.z+e.az*11),N.beam.material.opacity=.06+N.flashBoost*.08,N.flash.position.set(e.x-e.ax*.3,1.9,e.z-e.az*.3),N.flash.target.position.set(e.x+e.ax*9,0,e.z+e.az*9),l.W.halo&&l.W.halo.position.set(e.x,2.6,e.z)};N.takeLight=function(i,e,t){let n=N.lights[N.lightNext++%N.lights.length];return n.color.set(i),n.intensity=e,n.distance=t,n};N.resetLights=function(){for(let i of N.lights)i.intensity=0,i.position.set(0,-50,0);N.lightNext=0};N.precompile=function(){N.renderer.compile(N.scene,N.camera)};N.applyQuality=function(i){let e=l.QUALITY[i]||l.QUALITY.high,t=N.q?N.q.shadows!==e.shadows:!0;N.q=e,N.qName=i,N.dyn=1,N.renderer.shadowMap.enabled=e.shadows,N.sun.castShadow=e.shadows,e.shadows&&(N.sun.shadow.mapSize.set(e.shadowMap,e.shadowMap),N.sun.shadow.map&&(N.sun.shadow.map.dispose(),N.sun.shadow.map=null)),t&&N.scene.traverse(n=>{n.material&&(n.material.needsUpdate=!0)}),N.buildComposer(),N.resize()};N.buildComposer=function(){N.composer&&N.composer.dispose(),N.composer=null,N.ao=null,N.grade=null;let i=N.q;if(!i.grade)return;let e=new Bt(1,1,{type:Ut,samples:4});if(N.composer=new Ao(N.renderer,e),N.composer.addPass(new Ro(N.scene,N.camera)),i.ao){N.ao=new Jr(N.scene,N.camera,1,1),N.ao.blendIntensity=.9;let n=N.ao.setSize.bind(N.ao);N.ao.setSize=(s,r)=>n(Math.max(1,s>>1),Math.max(1,r>>1)),N.composer.addPass(N.ao)}i.bloom&&N.composer.addPass(N.bloom=new hr(new he(1,1),.6,.5,.82)),N.composer.addPass(new Po),N.composer.addPass(N.grade=new cr(i1)),N.setGrade(N.gradeLook||{});let t=N.renderer.getDrawingBufferSize(new he);N.grade.uniforms.uTexel.value.set(1/Math.max(1,t.x),1/Math.max(1,t.y)),N.grade.uniforms.uTilt.value=i.bloom&&!matchMedia("(pointer: coarse)").matches?1:0};N.setGrade=function(i){if(N.gradeLook=i,!N.grade)return;let e=N.grade.uniforms;e.uContrast.value=i.contrast??1.08,e.uSat.value=i.sat??1.12,e.uVignette.value=i.vignette??.32,e.uTint.value.set(...i.tint||[1,1,1])};N.resize=function(){let i=innerWidth,e=innerHeight,t=matchMedia("(pointer: coarse)").matches,n=Math.min(devicePixelRatio||1,t?1.5:2)*N.q.pixel*N.dyn;N.renderer.setPixelRatio(n),N.renderer.setSize(i,e,!1),N.camera.aspect=i/e,N.zoom=i<e?1.55:e<560?1.25:1.12,N.camera.updateProjectionMatrix(),N.composer&&(N.composer.setPixelRatio(n),N.composer.setSize(i,e)),N.grade&&N.grade.uniforms.uTexel.value.set(1/Math.max(1,i*n),1/Math.max(1,e*n))};N.tuneResolution=function(i,e){if(N.dynT-=e,N.dynT>0)return;let t=N.dyn;i<52&&N.dyn>.6?t=Math.max(.6,N.dyn-.1):i>58&&N.dyn<1&&(t=Math.min(1,N.dyn+.05)),t!==N.dyn?(N.dyn=t,N.resize(),N.dynT=2):N.dynT=1};N.follow=function(i,e,t,n=1){let s=1-Math.exp(-t*6);N.camTarget.x+=(i-N.camTarget.x)*s,N.camTarget.z+=(e-N.camTarget.z)*s;let r=(N.zoom||1)*n,a=0,o=0;N.shake>0&&(a=(Math.random()-.5)*N.shake,o=(Math.random()-.5)*N.shake,N.shake=Math.max(0,N.shake-t*3)),N.camera.position.set(N.camTarget.x+N.camOffset.x*r+a,N.camOffset.y*r,N.camTarget.z+N.camOffset.z*r+o),N.camera.lookAt(N.camTarget.x+a,0,N.camTarget.z+o),N.sun.position.set(N.camTarget.x+12,30,N.camTarget.z+8),N.sun.target.position.set(N.camTarget.x,0,N.camTarget.z),N.split=Math.max(0,N.split-t*2.5)};N.render=function(i){N.grade&&(N.grade.uniforms.uTime.value=i%100,N.grade.uniforms.uSplit.value=N.split),N.composer?N.composer.render():N.renderer.render(N.scene,N.camera)};var mf=new _o,gf=new he,xf=new Jn(new L(0,1,0),0),yf=new L;N.screenToGround=function(i,e,t=1){return gf.set(i/innerWidth*2-1,-(e/innerHeight)*2+1),mf.setFromCamera(gf,N.camera),xf.constant=-t,mf.ray.intersectPlane(xf,yf)?yf:null};var No=new L;N.worldToScreen=function(i,e,t){return No.set(i,e,t).project(N.camera),[(No.x+1)*.5*innerWidth,(1-No.y)*.5*innerHeight,No.z<1]};function jr(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new kt,h=0;for(let u=0;u<i.length;++u){let d=i[u],f=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in d.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(d.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in d.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(d.morphAttributes[p])}if(e){let p;if(t)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,p,u),h+=p}}if(t){let u=0,d=[];for(let f=0;f<i.length;++f){let p=i[f].index;for(let y=0;y<p.count;++y)d.push(p.getX(y)+u);u+=i[f].attributes.position.count}c.setIndex(d)}for(let u in r){let d=vf(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,d)}for(let u in a){let d=a[u][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<d;++f){let p=[];for(let x=0;x<a[u].length;++x)p.push(a[u][x][f]);let y=vf(p);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(y)}}return c}function vf(i){let e,t,n,s=-1,r=0;for(let h=0;h<i.length;++h){let u=i[h];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let a=new e(r),o=new Ft(a,t,n),c=0;for(let h=0;h<i.length;++h){let u=i[h];if(u.isInterleavedBufferAttribute){let d=c/t;for(let f=0,p=u.count;f<p;f++)for(let y=0;y<t;y++){let x=u.getComponent(f,y);o.setComponent(f+d,y,x)}}else a.set(u.array,c);c+=u.count*t}return s!==void 0&&(o.gpuType=s),o}function Hh(i,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),c={},h={},u=[],d=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let v=0,b=o.length;v<b;v++){let w=o[v],D=i.attributes[w];c[w]=new D.constructor(new D.array.constructor(D.count*D.itemSize),D.itemSize,D.normalized);let A=i.morphAttributes[w];A&&(h[w]||(h[w]=[]),A.forEach((I,R)=>{let E=new I.array.constructor(I.count*I.itemSize);h[w][R]=new I.constructor(E,I.itemSize,I.normalized)}))}let p=e*.5,y=Math.log10(1/e),x=Math.pow(10,y),g=p*x;for(let v=0;v<r;v++){let b=n?n.getX(v):v,w="";for(let D=0,A=o.length;D<A;D++){let I=o[D],R=i.getAttribute(I),E=R.itemSize;for(let _=0;_<E;_++)w+=`${~~(R[d[_]](b)*x+g)},`}if(w in t)u.push(t[w]);else{for(let D=0,A=o.length;D<A;D++){let I=o[D],R=i.getAttribute(I),E=i.morphAttributes[I],_=R.itemSize,P=c[I],U=h[I];for(let O=0;O<_;O++){let H=d[O],K=f[O];if(P[K](a,R[H](b)),E)for(let V=0,se=E.length;V<se;V++)U[V][K](a,E[V][H](b))}}t[w]=a,u.push(a),a++}}let m=i.clone();for(let v in i.attributes){let b=c[v];if(m.setAttribute(v,new b.constructor(b.array.slice(0,a*b.itemSize),b.itemSize,b.normalized)),v in h)for(let w=0;w<h[v].length;w++){let D=h[v][w];m.morphAttributes[v][w]=new D.constructor(D.array.slice(0,a*D.itemSize),D.itemSize,D.normalized)}}return m.setIndex(u),m}function Ms(i,e){let t=document.createElement("canvas");return t.width=i,t.height=e,[t,t.getContext("2d")]}function Qr(i,e=1){let t=new Zi(i);return t.colorSpace=Ht,t.wrapS=t.wrapT=Ln,t.repeat.set(e,e),t.anisotropy=8,t}function s1(i,e,t,n,s,r=2){for(let a=0;a<n;a++){i.fillStyle=s[Math.random()*s.length|0],i.globalAlpha=Math.random()*.5+.1;let o=Math.random()*r+.5;i.fillRect(Math.random()*e,Math.random()*t,o,o)}i.globalAlpha=1}function _f(){let[i,e]=Ms(128,128);e.clearRect(0,0,128,128),e.strokeStyle="#c9ccd0",e.lineWidth=3;for(let t=-128;t<256;t+=16)e.beginPath(),e.moveTo(t,0),e.lineTo(t+128,128),e.stroke(),e.beginPath(),e.moveTo(t+128,0),e.lineTo(t,128),e.stroke();return Qr(i)}function ea(i,e={}){let t=e.w||512,n=e.h||128,[s,r]=Ms(t,n);e.bg&&(r.fillStyle=e.bg,r.fillRect(0,0,t,n)),r.fillStyle=e.color||"#f2f2f2",r.font=`900 ${e.size||64}px Impact, "Arial Black", sans-serif`,r.textAlign="center",r.textBaseline="middle";let a=String(i).split(`
`),o=(e.size||64)*1.1;a.forEach((h,u)=>r.fillText(h,t/2,n/2+(u-(a.length-1)/2)*o)),e.worn&&(r.globalCompositeOperation="destination-out",s1(r,t,n,1800,["#000"],4),r.globalCompositeOperation="source-over");let c=Qr(s);return c.wrapS=c.wrapT=Pn,c}function Mf(){let[i,e]=Ms(256,340);return e.fillStyle="#f7f3e8",e.fillRect(0,0,256,340),e.fillStyle="#b3121b",e.fillRect(0,0,256,70),e.fillStyle="#fff",e.font="900 46px Impact, sans-serif",e.textAlign="center",e.fillText("PREA",128,52),e.fillStyle="#111",e.font="700 22px Arial, sans-serif",["ZERO TOLERANCE","For real this time.","","Training Module","2 of 47","","Initial here: ____"].forEach((t,n)=>e.fillText(t,128,110+n*30)),Qr(i)}var dr=8;function bf(){let[t,n]=Ms(256*dr,256);n.fillStyle="#fff",n.fillRect(0,0,256*dr,256);for(let r=0;r<dr;r++){let a=r*256+64,o=256*.44,c=(f,p=7)=>{n.fillStyle="#1a1210",n.beginPath(),n.ellipse(a+f,o,p*.8,p,0,0,6.28),n.fill()},h=f=>{n.strokeStyle="#2a1a12",n.lineWidth=6,n.lineCap="round",[-1,1].forEach(p=>{n.beginPath(),n.moveTo(a+p*30,o-18-f*p*-1),n.lineTo(a+p*9,o-16+f),n.stroke()})},u=(f,p)=>{n.strokeStyle="#4a2018",n.lineWidth=5,n.beginPath(),n.moveTo(a-f,256*.62),n.quadraticCurveTo(a,256*.62+p,a+f,256*.62),n.stroke()},d=f=>`rgba(25,18,14,${f})`;r===7?(c(-18,11),c(18,11),n.fillStyle="#fff",n.fillRect(a-20,o-3,4,4),n.fillRect(a+16,o-3,4,4),u(22,14)):(c(-17),c(17)),(r===1||r===4||r===5)&&h(8),r===0||r===3?u(14,-4):r!==7&&u(16,6),r===2&&(n.fillStyle=d(.75),n.beginPath(),n.ellipse(a,256*.68,46,34,0,0,3.14),n.fill()),r===3&&(n.fillStyle=d(.8),n.fillRect(a-10,256*.66,20,24)),r===4&&(n.fillStyle=d(.85),n.fillRect(a-24,256*.57,48,9)),r===5&&(n.fillStyle=d(.9),n.beginPath(),n.ellipse(a+22,o+20,4,7,0,0,6.28),n.fill(),n.font="900 16px Arial",n.textAlign="center",n.fillText("13",a,256*.3)),r===6&&(n.strokeStyle="rgba(120,40,40,0.8)",n.lineWidth=4,n.beginPath(),n.moveTo(a-34,o-22),n.lineTo(a-12,o+26),n.stroke(),h(4))}let s=Qr(t);return s.wrapS=s.wrapT=Pn,s}function wf(){let[i,e]=Ms(512,128);e.fillStyle="#fff",e.fillRect(0,0,512,128),e.fillStyle="rgba(15,15,15,0.9)",e.textAlign="center",e.textBaseline="middle",e.font="900 96px Impact, Arial Black, sans-serif",e.fillText("DOC",256,66),e.font="900 44px Impact, Arial Black, sans-serif",e.fillText("DOC",451,52),e.font="900 15px Arial Black, sans-serif",e.fillText("#"+(4e3+Math.floor(Math.random()*999)),451,92);let t=Qr(i);return t.wrapS=t.wrapT=Pn,t}function Ef(i){return ea(i,{w:512,h:128,size:i.length>8?58:80,color:"#e8e2cf",bg:"#1b1f29"})}function Tf(){let[i,e]=Ms(4,128),t=e.createLinearGradient(0,0,0,128);return t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.2,"rgba(255,255,255,0.5)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,4,128),new Zi(i)}function ko(){let[i,e]=Ms(128,128),t=e.createRadialGradient(64,64,4,64,64,62);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.6,"rgba(255,255,255,0.85)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t;for(let s=0;s<7;s++){let r=Math.random()*6.28,a=Math.random()*22;e.beginPath(),e.arc(64+Math.cos(r)*a,64+Math.sin(r)*a,26+Math.random()*18,0,6.28),e.fill()}let n=new Zi(i);return n.colorSpace=Ht,n}var Q={T:2,w:0,h:0,solid:null,rects:[],spawns:[],doors:[],lights:[],group:null};l.W=Q;var Ge=Q.T,Sf=new He,r1=new Zt,a1=new Kt,o1=new L,l1=new L(1,1,1),Hn=class{constructor(){this.geos=[]}add(e,t,n,s,r,a=0,o=0,c=0){let h=(e.index,e.clone());Sf.compose(o1.set(t,n,s),r1.setFromEuler(a1.set(o,a,c)),l1),h.applyMatrix4(Sf);let u=new xe(r),d=h.attributes.position.count,f=new Float32Array(d*3);for(let p=0;p<d;p++)f[p*3]=u.r,f[p*3+1]=u.g,f[p*3+2]=u.b;return h.setAttribute("color",new Ft(f,3)),this.geos.push(h),this}box(e,t,n,s,r,a,o,c=0){return this.add(new Te(e,t,n),s,r,a,o,c)}cyl(e,t,n,s,r,a,o=0,c=0,h=0,u=12,d=e){return this.add(new Je(e,d,t,u),n,s,r,a,c,o,h)}build(e,t=!0){if(!this.geos.length)return null;let n=new ce(jr(this.geos,!1),e);return n.castShadow=t,n.receiveShadow=!0,this.geos.forEach(s=>s.dispose()),n}};Q.Batch=Hn;var c1=new mo,Vh={};function Wh(i,e){if(!Vh[i]){let t=c1.load(`assets/tex/${i}.jpg`);t.wrapS=t.wrapT=Ln,t.anisotropy=8,e&&(t.colorSpace=Ht),Vh[i]=t}return Vh[i]}function qh(i,e,t=16777215,n={}){let s=r=>{let a=r.clone();return a.repeat.set(e[0],e[1]),a.needsUpdate=!0,a};return new Ae(Object.assign({map:s(Wh(i+"_diff",!0)),normalMap:s(Wh(i+"_nor")),roughnessMap:s(Wh(i+"_rough")),color:t,normalScale:new he(1.2,1.2)},n))}Q.pbrMat=qh;var jt={};function h1(){jt.ready||(jt.paint=new Ae({vertexColors:!0,roughness:.55,metalness:.25}),jt.matte=new Ae({vertexColors:!0,roughness:.9}),jt.metal=new Ae({vertexColors:!0,roughness:.35,metalness:.8}),jt.glow=new ut({vertexColors:!0,toneMapped:!1}),jt.shaft=new ut({map:Tf(),transparent:!0,opacity:.22,blending:hn,depthWrite:!1,side:Nt,toneMapped:!1}),jt.fence=new Ae({map:_f(),alphaTest:.5,side:Nt,metalness:.6,roughness:.4}),jt.ready=!0)}function u1(i,e,t,n,s,r=0){let a=Math.cos(r),o=Math.sin(r),c=(d,f)=>[t+d*a+f*o,n-d*o+f*a],h=(d,f,p,y,x,g=0,m=0)=>{let[v,b]=c(f,y);i.add(d,v,p,b,x,r,g,m)},u=.55;[-1,1].forEach(d=>[-1.9,1.9].forEach(f=>h(new Je(.62,.62,.5,16),d,.62,f,1447446,0,Math.PI/2))),[-1,1].forEach(d=>[-1.9,1.9].forEach(f=>h(new Je(.32,.32,.52,10),d,.62,f,10133670,0,Math.PI/2))),h(new Te(1.6,.25,4.6),0,.7+u*.4,0,2236962),h(new Te(2.1,.75,5.6),0,1.25+u,0,s),h(new Te(2,.85,2),0,2.05+u,-.45,s),h(new Te(1.9,.6,1.9),0,2.08+u,-.45,1779507),h(new Te(1.8,.12,2.1),0,1.7+u,1.6,2763306),h(new Te(2.3,.3,.25),0,1+u,-2.85,14212579),[-.7,-.25,.25,.7].forEach(d=>{let[f,p]=c(d,-1.1);e.box(.32,.12,.14,f,2.6+u,p,16774348,r)}),[-.8,.8].forEach(d=>{let[f,p]=c(d,-2.82);e.box(.35,.18,.06,f,1.38+u,p,16776166,r)}),[-.85,.85].forEach(d=>{let[f,p]=c(d,2.82);e.box(.3,.2,.06,f,1.4+u,p,16722458,r)})}function d1(i,e,t,n,s,r=0){let a=Math.cos(r),o=Math.sin(r),c=(u,d)=>[t+u*a+d*o,n-u*o+d*a],h=(u,d,f,p,y,x=0,g=0)=>{let[m,v]=c(d,p);i.add(u,m,f,v,y,r,x,g)};[-.8,.8].forEach(u=>[-1.4,1.4].forEach(d=>h(new Je(.34,.34,.25,12),u,.34,d,1315860,0,Math.PI/2))),h(new Te(1.75,.6,4.3),0,.65,0,s),h(new Te(1.55,.5,2.1),0,1.18,.2,s),h(new Te(1.5,.42,2),0,1.2,.2,1779507),[-.6,.6].forEach(u=>{let[d,f]=c(u,-2.16);e.box(.3,.12,.05,d,.75,f,16776166,r)})}function Uo(i,e,t="."){return Array.from({length:e},()=>Array(i).fill(t))}var Ne=i=>i*Ge+Ge/2,Ue=i=>i*Ge+Ge/2;function Tn(i,e,t,n,s,r,a){let o=new ce(new Pt(s,r),new Ae({map:ea(e,a),transparent:!0,roughness:.8,depthWrite:!1}));o.rotation.x=-Math.PI/2,o.position.set(t,.02,n),o.receiveShadow=!0,i.add(o)}function En(i,e,t,n,s,r,a){let o=l.R.takeLight(i,e,t);return o.position.set(n,s,r),Q.lights.push({L:o,base:e,kind:a,t:Math.random()*10}),o}function Pf(i){let n=Uo(44,32);for(let a=0;a<44;a++)n[0][a]=n[1][a]=n[2][a]="#",n[31][a]="F";for(let a=0;a<32;a++)n[a][0]=n[a][43]="F";[10,22,34].forEach(a=>{n[2][a]="S",n[2][a+1]="S"}),[12,22].forEach(a=>{n[a][0]="S",n[a][43]="S"});let s={w:44,h:32,g:n,start:[Ne(22),Ue(28)],vehicles:[],outdoor:!0,theme:{floor:"asphalt_02",floorScale:6,wall:"precast_concrete_wall",hdri:"suburban_parking_area",envI:.75,grade:{tint:[1.07,1,.92],sat:1.12,contrast:1.08}}},r=[9379101,2047887,1118481,15263976,7040885,3104047,13214247,5910150];return[8,15,22].forEach((a,o)=>{for(let c=3;c<41;c+=3){if(Math.random()<.18)continue;let h=Math.random()<.5;s.vehicles.push({truck:h,x:Ne(c),z:Ue(a+1),color:l.pick(r),ry:o===1?Math.PI:0})}}),s.vehicles.push({truck:!0,x:Ne(30),z:Ue(28),color:1920959,ry:Math.PI/2,mine:!0}),s.vehicles.push({truck:!0,x:Ne(38),z:Ue(28),color:1118481,ry:Math.PI/2}),s.decor=a=>{Tn(a,`COMPACT
CARS ONLY`,Ne(9),Ue(12),5,2.5,{size:70,color:"#f5f5f5",worn:!0}),Tn(a,"RESERVED: SGT",Ne(18),Ue(19),6,1.6,{size:72,color:"#ffd23a",worn:!0}),Tn(a,`${i.toUpperCase()}'S TRUCK
(BOTH SPOTS)`,Ne(30),Ue(25.3),7,2.6,{size:60,color:"#9fd0ff",worn:!0}),Tn(a,`RESERVED: C. ALANIZ
BIG BRO PARKING`,Ne(38),Ue(25.3),7,2.6,{size:56,color:"#ffd34d",worn:!0}),Tn(a,"FIRE LANE",Ne(22),Ue(5),7,1.8,{size:90,color:"#e33",worn:!0});let o=new ce(new Pt(14,1.4),new Ae({map:ea("BIG TRUCK STATE CORRECTIONAL",{w:1024,h:102,size:76,color:"#f3efe2",bg:"#24324a"}),roughness:.6}));o.position.set(34,1.6,3*Ge+.03),a.add(o)},s}function Lf(){let t=Uo(38,26);for(let a=0;a<38;a++)t[0][a]=t[25][a]="#";for(let a=0;a<26;a++)t[a][0]=t[a][37]="#";let n=[],s=(a,o,c,h)=>{for(let u=1;u<37;u++)for(let d=a;d<=o;d++)t[d][u]=(u-1)%3===0?"#":".";for(let u=1;u<37;u++)t[c][u]=(u-1)%3===0?"#":"C";for(let u=2;u<37;u+=3)n.push({i:u,j:h?a+1:o-1,door:c,top:h})};s(1,3,4,!0),s(22,24,21,!1),[12,13].forEach(a=>{t[a][1]="S",t[a][36]="S"});let r={w:38,h:26,g:t,start:[Ne(19),Ue(13)],cells:n,tables:[],outdoor:!1,theme:{floor:"concrete_floor_worn_001",floorScale:5,wall:"concrete_block_wall",wallTint:15392710,stripe:3104680,hdri:"empty_warehouse_01",envI:.45,grade:{tint:[.95,1.02,.96],sat:1.05,contrast:1.18,vignette:.45}}};return[8,13,18].forEach(a=>[7,13,25,31].forEach(o=>r.tables.push([Ne(o),Ue(a)]))),r.decor=a=>{Tn(a,"IMU NORTH",Ne(19),Ue(9.5),6,2,{size:100,color:"#d8c79a",worn:!0}),Tn(a,`NO LOITERING
(YOU ARE LOITERING)`,Ne(19),Ue(17.5),7,2.2,{size:54,color:"#d8c79a",worn:!0}),[5,20].forEach(h=>{let u=new ce(new Pt(36*Ge,.25),new Ae({color:12591130,roughness:.7}));u.rotation.x=-Math.PI/2,u.position.set(38*Ge/2,.015,Ue(h)+(h===5?-.6:.6)),a.add(u)});let o=Mf(),c=new Ae({map:o,roughness:.8});[4,13,22,31].forEach(h=>{let u=new ce(new Pt(.9,1.2),c);u.position.set(Ne(h),1.3,5*Ge+.03),a.add(u)})},r}function f1(){let t=Uo(36,24);for(let a=0;a<36;a++)t[0][a]=t[23][a]="#";for(let a=0;a<24;a++)t[a][0]=t[a][35]="#";let n=[],s=[];for(let a=1;a<35;a++)for(let o=1;o<=3;o++)t[o][a]=(a-1)%3===0?"#":".";for(let a=1;a<35;a++)t[4][a]=(a-1)%3===0?"#":"C";for(let a=2;a<35;a+=3)s.push({i:a,j:2,door:4,top:!0,locked:!0});for(let a=1;a<35;a++)for(let o=20;o<=22;o++)t[o][a]=(a-1)%3===0?"#":".";for(let a=1;a<35;a++)t[19][a]=(a-1)%3===0?"#":"C";for(let a=2;a<35;a+=3)n.push({i:a,j:21,door:19,top:!1});[11,12].forEach(a=>{t[a][1]="S",t[a][34]="S"});let r={w:36,h:24,g:t,start:[Ne(18),Ue(14)],cells:s.concat(n),caged:s,tables:[],mode:"row",outdoor:!1,water:[[Ne(10),Ue(12),14,6],[Ne(25),Ue(11),10,5],[Ne(18),Ue(16),8,3]],theme:{floor:"damaged_concrete_floor",floorScale:5,wall:"concrete_wall_006",wallTint:12174536,stripe:7017492,hdri:"sepulchral_chapel_basement",envI:.6,grade:{tint:[.86,.98,1.08],sat:.85,contrast:1.25,vignette:.6}}};return r.decor=a=>{Tn(a,"SUPERMAX",Ne(18),Ue(8),9,2.4,{size:100,color:"#b8c6cc",worn:!0}),Tn(a,`DO NOT FEED
DO NOT CHAT
DO NOT BUY THE PAINTINGS`,Ne(18),Ue(18.5),8,3,{size:46,color:"#c43a3a",worn:!0})},r}var Mt=2830133,li=14212579,ta=1381653,Yh=[1118481,11739162,1851294,14198048,3112242];function $h(i,e,t,n,s,r,a=!1){i.cyl(.025,s,e,t,n,li,a?Math.PI/2:0,0,a?0:Math.PI/2,8);for(let o=-1;o<=1;o+=2)for(let c=0;c<r;c++){let h=(s/2-.25-c*.07)*o,u=.23-c*.025;i.cyl(u,.06,a?e:e+h,t,a?n+h:n,Yh[c%Yh.length],a?Math.PI/2:0,0,a?0:Math.PI/2,16)}}function Af(i,e,t,n,s){e.box(.34,.1,1.25,t,.46,n,ta),i.box(.08,.42,.08,t,.21,n-.5,Mt).box(.08,.42,.08,t,.21,n+.45,Mt).box(.6,.05,.08,t,.03,n-.5,Mt).box(.6,.05,.08,t,.03,n+.45,Mt);for(let r of[-.55,.55])i.box(.08,1.15,.08,t+r,.58,n-.62,Mt),i.box(.12,.05,.12,t+r,1.05,n-.55,li);$h(i,t,1.1,n-.55,2.2,s),Q.rects.push({x:t,z:n-.1,hw:1,hd:.8})}function p1(i,e,t,n,s){e.box(.34,.1,.5,t,.46,n+.35,ta),e.add(new Te(.34,.1,.95),t,.75,n-.15,ta,0,-.62,0),i.box(.08,.45,.08,t,.22,n+.45,Mt).box(.08,.95,.08,t,.47,n-.45,Mt);for(let r of[-.55,.55])i.box(.08,1.5,.08,t+r,.75,n-.6,Mt);$h(i,t,1.42,n-.55,2.2,s),Q.rects.push({x:t,z:n,hw:1,hd:.8})}function Rf(i,e,t,n){for(let s of[-.65,.65])for(let r of[-.55,.55])i.box(.09,2.4,.09,t+s,1.2,n+r,Mt);for(let s of[-.55,.55])i.box(1.4,.09,.09,t,2.38,n+s,Mt);for(let s of[-.65,.65])i.box(.09,.09,1.2,t+s,2.38,n,Mt),i.box(.09,.09,1.2,t+s,.05,n,Mt),i.box(.06,.06,1.1,t+s,.75,n,li);i.cyl(.02,1.4,t,2.45,n+.62,li,0,0,Math.PI/2,8),e.box(1.6,.03,1.6,t,.015,n,2760726),$h(i,t,1.42,n-.5,2.3,4),Q.rects.push({x:t,z:n,hw:.85,hd:.75})}function m1(i,e,t,n){i.box(3.4,.08,.5,t,.55,n,Mt).box(3.4,.08,.5,t,.9,n-.05,Mt);for(let s of[-1.6,0,1.6])i.box(.08,.9,.5,t+s,.45,n,Mt);for(let s=0;s<8;s++)for(let[r,a]of[[.65,.08],[1,.03]]){let o=t-1.45+s*.41,c=.06+s*.008;i.cyl(.018,.3,o,r,n+a-.08,li,0,0,Math.PI/2,6);for(let h of[-.14,.14])i.cyl(c,.06,o+h,r,n+a-.08,1579034,0,0,Math.PI/2,6)}Q.rects.push({x:t,z:n,hw:1.8,hd:.4})}function g1(i,e,t,n){i.box(1.1,.08,1.7,t,.04,n,Mt),i.box(.1,.42,.1,t,.25,n+.35,Mt),e.box(.5,.1,.45,t,.5,n+.35,ta),i.box(.1,1.3,.1,t,.68,n+.7,Mt),e.box(.5,.75,.1,t,1,n+.62,ta);for(let s of[-1,1])i.box(.07,.07,.75,t+s*.38,1,n+.25,Mt),i.box(.07,.3,.07,t+s*.38,.88,n-.12,Mt),i.cyl(.03,.22,t+s*.3,.75,n-.12,2236962,0,0,Math.PI/2,8);i.box(.1,1.9,.1,t-.25,.95,n-.65,Mt).box(.1,1.9,.1,t+.25,.95,n-.65,Mt).box(.6,.1,.12,t,1.9,n-.65,Mt);for(let s=0;s<14;s++)i.box(.38,.05,.2,t,.12+s*.058,n-.65,s===9?11739162:7172986);i.cyl(.012,1.5,t-.08,.85,n-.65,li,0,0,0,6).cyl(.012,1.5,t+.08,.85,n-.65,li,0,0,0,6),Q.rects.push({x:t,z:n,hw:.65,hd:.95})}function x1(i,e,t,n){for(let a=0;a<=3;a++)i.box(.1,2.7,.1,t-3*1.3/2+a*1.3,1.35,n,Mt);i.box(3*1.3+.1,.1,.1,t,2.7,n,Mt);for(let a=0;a<3;a++)i.cyl(.025,1.3-.1,t-3*1.3/2+(a+.5)*1.3,2.45,n+.15,li,0,0,Math.PI/2,8);for(let a of[-.28,.28])i.box(.06,.06,.6,t+3*1.3/2+.5+a,1.2,n,li).box(.08,1.2,.08,t+3*1.3/2+.5+a,.6,n-.28,Mt);Q.rects.push({x:t+.3,z:n,hw:3*1.3/2+.7,hd:.3})}function Cf(i,e,t){i.box(.1,1.4,.1,e,.7,t,Mt).box(.8,.06,.8,e,.03,t,Mt);for(let n=0;n<6;n++){let s=n*Math.PI/3;i.cyl(.03,.3,e+Math.cos(s)*.15,.3+n%3*.4,t+Math.sin(s)*.15,li,0,-s,Math.PI/2,6),i.cyl(.23,.06,e+Math.cos(s)*.3,.3+n%3*.4,t+Math.sin(s)*.3,Yh[n%4],0,-s,Math.PI/2,16)}Q.rects.push({x:e,z:t,hw:.5,hd:.5})}function Df(i){let n=Uo(44,30);for(let r=0;r<44;r++)n[0][r]=n[1][r]=n[2][r]="#",n[29][r]="F";for(let r=0;r<30;r++)n[r][0]=n[r][43]="F";[8,20,32].forEach(r=>{n[2][r]="S",n[2][r+1]="S"}),[14,15].forEach(r=>{n[r][0]="S",n[r][43]="S"});let s={w:44,h:30,g:n,start:[Ne(20),Ue(24)],outdoor:!0,mode:"yard",tables:[],theme:{floor:"asphalt_02",floorScale:7,floorTint:14209732,wall:"precast_concrete_wall",wallTint:14274488,stripe:3104680,hdri:"suburban_parking_area",envI:.9,grade:{tint:[1.04,1,.95],sat:1.12,contrast:1.08}},lifters:[],gym:{x0:52,x1:84,z0:9,z1:31}};return s.lifters=[[57,15],[63.5,15],[70,15],[58,23.5],[66,23.5],[76,24.5],[80,15]],[[14,20],[26,20]].forEach(([r,a])=>s.tables.push([Ne(r),Ue(a)])),s.decor=r=>{let a=new Hn,o=new Hn,c=new Hn,h=new ce(new Pt(32,22),new Ae({color:1776671,roughness:.95}));h.rotation.x=-Math.PI/2,h.position.set(68,.012,20),h.receiveShadow=!0,r.add(h);for(let[d,f,p,y]of[[68,9,32,.15],[68,31,32,.15],[52,20,.15,22],[84,20,.15,22]])c.box(p,.02,y,d,.02,f,16765498);Af(a,o,57,15,3),Af(a,o,63.5,15,4),p1(a,o,70,15,2),g1(a,o,79,15),Rf(a,o,58,23.5),Rf(a,o,65,23.5),m1(a,o,73,28.5),x1(a,o,74,21),Cf(a,83,26),Cf(a,53.5,28);for(let[d,f,p,y]of[[24,13,28,.12],[10,27,.12,28],[38,27,.12,28],[24,19,8,.12],[20,16,.12,6],[28,16,.12,6]])c.box(p,.02,y,d,.02,f,15921906);a.box(.15,3,.15,24,1.5,9.6,2767466).box(1.8,1.05,.06,24,3.05,10,15921906),a.add(new nn(.23,.02,6,16),24,2.75,10.35,16734746,0,Math.PI/2,0),Q.rects.push({x:24,z:9.6,hw:.3,hd:.3}),o.box(6,.45,.7,44,.22,7,9077880),Q.rects.push({x:44,z:7,hw:3,hd:.4}),r.add(a.build(jt.metal),o.build(jt.paint),c.build(jt.matte,!1)),Tn(r,"WEIGHT PIT",68,11,7,1.6,{size:90,color:"#ffd23a",worn:!0}),Tn(r,`NO SPOTTING
WITHOUT CONSENT FORM`,68,32.5,8,2.4,{size:54,color:"#d8c79a",worn:!0}),Tn(r,"REC YARD",24,34,7,2,{size:90,color:"#d8c79a",worn:!0});let u=new ce(new Pt(6.4,2),new Ae({map:ea(`YARD RECORDS
BENCH 405 . C. ALANIZ
SQUAT 585 . C. ALANIZ
CURLS . C. ALANIZ (IN THE SQUAT RACK)`,{w:1024,h:320,size:46,color:"#f3efe2",bg:"#1d2a40"}),roughness:.6}));u.position.set(68,1.5,3*Ge+.03),r.add(u)},s}function y1(i){let e=Lf();e.mode="night",e.theme=Object.assign({},e.theme,{hdri:"sepulchral_chapel_basement",envI:.08,grade:{tint:[.85,.95,1.12],sat:.7,contrast:1.3,vignette:.75}}),e.scares=[[10,12],[19,9],[28,15],[33,11],[6,16],[24,18],[15,14]].map(([n,s])=>({x:Ne(n),z:Ue(s),done:!1}));let t=e.decor;return e.decor=n=>{t(n),Tn(n,`LIGHTS OUT
2300 - 0600`,Ne(19),Ue(13),6,2.4,{size:70,color:"#7fb0ff",worn:!0})},e}function Nf(i,e,t){i.mode="night",i.lifters=null,i.theme=Object.assign({},i.theme,{hdri:"sepulchral_chapel_basement",envI:.08,grade:t||{tint:[.85,.95,1.12],sat:.7,contrast:1.3,vignette:.75}}),i.scares="random";let n=i.decor;return i.decor=s=>{n&&n(s),Tn(s,e[0],i.start[0],i.start[1]-6,7,2.4,{size:70,color:e[1],worn:!0})},i}function v1(i){return Nf(Pf(i),[`GRAVEYARD SHIFT
0300`,"#ff9a5a"],{tint:[1.08,.9,.82],sat:.65,contrast:1.32,vignette:.8})}function _1(i){return Nf(Df(i),[`BLACKOUT
YARD CLOSED`,"#ff4a4a"],{tint:[.82,1,.9],sat:.6,contrast:1.35,vignette:.8})}Q.BUILDERS={lot:Pf,tier:Lf,yard:Df,night:y1,row:f1,graveyard:v1,blackout:_1};Q.load=function(i,e){Q.alarmT=0,Q.hemiBase=null,Q.halo=null,Q.muzzle=null,h1(),Q.group&&(l.R.scene.remove(Q.group),Q.group.traverse(x=>{x.geometry&&x.geometry.dispose()})),Q.group=new ot,Q.lights=[],Q.rects=[],Q.spawns=[],Q.doors=[],l.R.resetLights(),l.R.scene.add(Q.group);let t=Q.BUILDERS[i](e);Q.def=t,Q.w=t.w,Q.h=t.h,Q.outdoor=t.outdoor,Q.solid=new Uint8Array(t.w*t.h);let n=2.4,s=t.h,r=t.theme,a=r.floorScale,o=new ce(new Pt(t.w*Ge,t.h*Ge),qh(r.floor,[t.w*Ge/a,t.h*Ge/a],r.floorTint||16777215));o.rotation.x=-Math.PI/2,o.position.set(t.w*Ge/2,0,t.h*Ge/2),o.receiveShadow=!0,Q.group.add(o);let c=new ce(new Pt(400,400),new Ae({color:t.outdoor?4872754:1118740,roughness:1}));c.rotation.x=-Math.PI/2,c.position.set(t.w*Ge/2,-.02,t.h*Ge/2),c.receiveShadow=!0,Q.group.add(c);let h=new Hn,u=new Hn,d=new Hn,f=new Hn,p=new Hn,y=[];for(let x=0;x<t.h;x++)for(let g=0;g<t.w;g++){let m=t.g[x][g],v=Ne(g),b=Ue(x);if(m==="#")Q.solid[x*t.w+g]=1,h.box(Ge,n,Ge,v,n/2,b,16777215),u.box(Ge+.02,.08,Ge+.02,v,n+.04,b,3882306),r.stripe&&u.box(Ge+.02,.16,Ge+.02,v,1.15,b,r.stripe);else if(m==="F"){Q.solid[x*t.w+g]=1;let w=x===0||x===t.h-1,D=new Pt(Ge,n);D.rotateY(w?0:Math.PI/2),D.translate(v,n/2,b),y.push(D),d.cyl(.06,n+.3,v-(w?Ge/2:0),(n+.3)/2,b-(w?0:Ge/2),9080726);for(let A=0;A<3;A++)d.add(new nn(.28,.025,4,10),v,n+.25,b+(w?0:(A-1)*.6),13620184,w?0:Math.PI/2,0,0)}else m==="S"?Q.spawns.push({x:v,z:b,kind:"gate"}):m==="C"&&(Q.solid[x*t.w+g]=1)}if(t.vehicles)for(let x of t.vehicles){(x.truck?u1:d1)(f,p,x.x,x.z,x.color,x.ry);let g=Math.abs(Math.sin(x.ry))>.5,m=x.truck?1.15:.95,v=x.truck?2.9:2.3;Q.rects.push({x:x.x,z:x.z,hw:g?v:m,hd:g?m:v}),x.mine&&En(16774096,6,10,x.x,3.2,x.z)}if(t.tables)for(let[x,g]of t.tables){d.cyl(.95,.08,x,.78,g,10134443,0,0,0,20),d.cyl(.12,.78,x,.39,g,7173243);for(let m=0;m<4;m++){let v=m*Math.PI/2+Math.PI/4;d.cyl(.24,.06,x+Math.cos(v)*1.25,.46,g+Math.sin(v)*1.25,10134443,0,0,0,12),d.cyl(.06,.46,x+Math.cos(v)*1.25,.23,g+Math.sin(v)*1.25,7173243)}Q.rects.push({x,z:g,hw:.9,hd:.9})}if(t.cells)for(let x of t.cells){let g=new Hn;for(let b=0;b<12;b++)g.cyl(.035,n,-Ge+.17+b*.33,n/2,0,6120555,0,0,0,6);g.box(Ge*2,.08,.08,0,n-.15,0,6120555).box(Ge*2,.08,.08,0,.9,0,6120555);let m=g.build(jt.metal),v=(Ne(x.i)+Ne(x.i+1))/2;m.position.set(v,0,Ue(x.door)),Q.group.add(m),f.box(1,.45,1.9,Ne(x.i)-.5,.22,Ue(x.top?2:t.h-3),8023901),d.cyl(.25,.45,Ne(x.i+1)+.4,.22,Ue(x.top?1:t.h-2)+(x.top?.2:-.2),12107976,0,0,0,10),x.locked||Q.doors.push({mesh:m,x0:v,cell:x,open:0,opening:!1,spawn:{x:Ne(x.i+1),z:Ue(x.j),kind:"cell"}})}if(t.water)for(let[x,g,m,v]of t.water){let b=new ce(new Pt(m,v),new Ae({color:4875888,roughness:.03,metalness:.85,transparent:!0,opacity:.5,envMapIntensity:2.2}));b.rotation.x=-Math.PI/2,b.position.set(x,.03,g),b.receiveShadow=!0,Q.group.add(b)}if(l.R.flashOn=t.mode==="night",l.FX.mistIM&&(l.FX.mistIM.material.opacity=t.mode==="night"?.075:.032),t.mode==="yard")l.R.hemi.color.set(13624063),l.R.hemi.groundColor.set(6969924),l.R.hemi.intensity=1.35,l.R.sun.color.set(16773592),l.R.sun.intensity=3.6,l.R.scene.background=new xe(8038104),l.R.scene.fog=new $i(10271712,70,160),[[24,8],[44,8]].forEach(([x,g])=>{d.cyl(.14,8,Ne(x),4,Ue(g),6054248),p.box(1.6,.25,.6,Ne(x),8,Ue(g),16773312)}),d.box(3,7,3,Ne(2.5),3.5,Ue(s-3.5),7040885).box(4,.3,4,Ne(2.5),7.2,Ue(s-3.5),3882306),p.box(3.2,.9,3.2,Ne(2.5),6.4,Ue(s-3.5),10473727);else if(t.mode==="night"){l.R.hemi.color.set(5925530),l.R.hemi.groundColor.set(789524),l.R.hemi.intensity=.16,l.R.sun.color.set(9086207),l.R.sun.intensity=.3,Q.halo=En(11058431,9,11,0,2.8,0,"halo"),Q.muzzle=En(16767392,0,12,0,-50,0,"muzzle"),l.R.scene.background=new xe(131846),l.R.scene.fog=new $i(131846,16,42);let x=i==="night"?12.5:t.h/2;En(2162528,2.2,9,Ne(2),2.6,Ue(x),"flicker"),En(2162528,2.2,9,Ne(t.w-3),2.6,Ue(x),"flicker"),En(16767136,3,7,Ne(Math.min(29,t.w-4)),2.2,Ue(2),"flicker"),[1,t.w-2].forEach(g=>{p.box(.6,.25,.08,Ne(g)+(g===1?.95:-.95),2.6,Ue(x),2162528),En(16718362,0,16,Ne(g)+(g===1?2:-2),3,Ue(x),"alarm")}),i==="graveyard"&&En(16722448,3,10,Ne(12),1.2,Ue(8),"alarm")}else t.mode==="row"?(l.R.hemi.color.set(12113128),l.R.hemi.groundColor.set(2765366),l.R.hemi.intensity=.75,l.R.sun.color.set(11850988),l.R.sun.intensity=1.5,l.R.scene.background=new xe(1845808),l.R.scene.fog=new $i(3820628,22,70),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,Ne(g),n+.1,Ue(x)+(x===4?.8:-.8),13625087)}),[[8,9],[27,9],[8,15],[27,15],[18,12]].forEach(([x,g],m)=>En(12573951,22,24,Ne(x),4,Ue(g),m===1?"flicker":"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,Ne(x),n+.3,Ue(12),16719904),En(16718362,0,16,Ne(x)+(x===1?2:-2),3,Ue(12),"alarm")})):t.outdoor?(l.R.hemi.color.set(12374783),l.R.hemi.groundColor.set(5917242),l.R.hemi.intensity=1.25,l.R.sun.color.set(16762250),l.R.sun.intensity=3.4,l.R.scene.background=new xe(2831696),l.R.scene.fog=new $i(2831696,60,140),[[8,13],[36,13],[8,20],[36,20]].forEach(([x,g])=>{let m=Ne(x),v=Ue(g);d.cyl(.12,6,m,3,v,6054248),p.box(1.2,.2,.5,m,6,v,16757594)}),En(16752704,10,20,Ne(8),5.5,Ue(16.5),"sodium"),En(16752704,10,20,Ne(36),5.5,Ue(16.5),"sodium")):(l.R.hemi.color.set(14542591),l.R.hemi.groundColor.set(2762274),l.R.hemi.intensity=.3,l.R.sun.color.set(13623551),l.R.sun.intensity=.8,l.R.scene.background=new xe(723983),l.R.scene.fog=new $i(723983,200,400),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,Ne(g),n+.1,Ue(x)+(x===4?.8:-.8),15266047)}),[[9,9],[28,9],[9,17],[28,17]].forEach(([x,g])=>En(14937343,12,22,Ne(x),4,Ue(g),"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,Ne(x),n+.3,Ue(12.5),16719904),En(16718362,0,16,Ne(x)+(x===1?2:-2),3,Ue(12.5),"alarm")}));l.R.setEnv(r.hdri),l.R.scene.environmentIntensity=r.envI,l.R.setGrade(r.grade);for(let x of Q.lights){if(x.kind!=="fluoro"&&x.kind!=="sodium"&&x.kind!=="flicker")continue;let g=x.L.position.y,m=new ce(new Je(.5,2.6,g,20,1,!0),jt.shaft.clone());m.material.color.set(x.L.color).multiplyScalar(.6),m.position.set(x.L.position.x,g/2,x.L.position.z),Q.group.add(m)}if(M1(t),[h.build(qh(r.wall,[1,1.2],r.wallTint||16777215)),u.build(jt.matte),d.build(jt.metal),f.build(jt.paint),p.build(jt.glow,!1)].forEach(x=>x&&Q.group.add(x)),y.length){let x=new ce(jr(y),jt.fence);x.castShadow=!0,Q.group.add(x)}t.decor&&t.decor(Q.group);for(let x of Q.rects)for(let g=0;g<t.h;g++)for(let m=0;m<t.w;m++)Math.abs(Ne(m)-x.x)<x.hw+.2&&Math.abs(Ue(g)-x.z)<x.hd+.2&&(Q.solid[g*t.w+m]=1);if(Q.dist=new Int16Array(t.w*t.h),Q.flowT=0,l.R.precompile(),t.scares==="random"){t.scares=[];for(let x=0;x<400&&t.scares.length<7;x++){let g=l.randi(2,t.w-3),m=l.randi(2,t.h-3),v=Ne(g),b=Ue(m);Q.solid[m*t.w+g]||(v-t.start[0])**2+(b-t.start[1])**2<100||t.scares.some(w=>(w.x-v)**2+(w.z-b)**2<49)||t.scares.push({x:v,z:b,done:!1})}}return t};Q.openDoor=function(i){if(i.opening)return;i.opening=!0;let e=i.cell.door,t=i.cell.i;Q.solid[e*Q.w+t+1]=0,l.audio.play("alarm",.6)};function M1(i){let e=l.R.q.dust;if(Q.dust=null,!e)return;let t=new Float32Array(e*3);for(let r=0;r<e;r++)t[r*3]=l.rand(-20,20),t[r*3+1]=l.rand(.2,4),t[r*3+2]=l.rand(-14,14);let n=new kt;n.setAttribute("position",new Ft(t,3));let s=new io(n,new Fr({size:.07,color:i.outdoor?16767392:14214399,transparent:!0,opacity:.55,blending:hn,depthWrite:!1}));s.frustumCulled=!1,Q.group.add(s),Q.dust=s}var b1=new xe(16715792);Q.update=function(i,e){if(Q.alarmT>0){Q.alarmT-=i,Q.hemiBase||(Q.hemiBase=l.R.hemi.color.clone());let t=.5+.5*Math.sin(e*9);l.R.hemi.color.copy(Q.hemiBase).lerp(b1,t*.6)}else Q.hemiBase&&(l.R.hemi.color.copy(Q.hemiBase),Q.hemiBase=null);if(Q.dust){let t=Q.dust.geometry.attributes.position,n=t.array,s=l.R.camTarget.x,r=l.R.camTarget.z;for(let a=0;a<n.length;a+=3)n[a]+=Math.sin(e*.3+a)*i*.25,n[a+1]+=Math.sin(e*.5+a*.7)*i*.08,n[a+2]+=i*.15,n[a]-s>20?n[a]-=40:n[a]-s<-20&&(n[a]+=40),n[a+2]-r>14?n[a+2]-=28:n[a+2]-r<-14&&(n[a+2]+=28);t.needsUpdate=!0}for(let t of Q.doors)t.opening&&t.open<1&&(t.open=Math.min(1,t.open+i*1.4),t.mesh.position.x=t.x0-t.open*Ge);for(let t of Q.lights)t.t+=i,t.kind==="fluoro"?t.L.intensity=t.base*(Math.random()<.01?.2:1):t.kind==="flicker"?t.L.intensity=t.base*(Math.sin(e*23)>.6||Math.random()<.08?.1:1):t.kind==="alarm"&&(t.L.intensity=Math.max(Q.alarm||0,Q.alarmT>0?3:0)*(.5+.5*Math.sin(e*8))*6)};Q.tileSolid=(i,e)=>i<0||e<0||i>=Q.w||e>=Q.h||Q.solid[e*Q.w+i]===1;Q.wallAt=(i,e)=>{let t=Math.floor(i/Ge),n=Math.floor(e/Ge);if(t<0||n<0||t>=Q.w||n>=Q.h)return!0;let s=Q.def.g[n][t];return(s==="#"||s==="F"||s==="C")&&Q.solid[n*Q.w+t]===1};Q.rectAt=(i,e)=>{for(let t of Q.rects)if(Math.abs(i-t.x)<t.hw&&Math.abs(e-t.z)<t.hd)return!0;return!1};Q.blocked=(i,e)=>Q.wallAt(i,e)||Q.rectAt(i,e);Q.collide=function(i){let e=i.r,t=Math.floor((i.x-e)/Ge),n=Math.floor((i.x+e)/Ge),s=Math.floor((i.z-e)/Ge),r=Math.floor((i.z+e)/Ge);for(let a=s;a<=r;a++)for(let o=t;o<=n;o++)Q.wallAt(o*Ge+1,a*Ge+1)&&If(i,o*Ge+Ge/2,a*Ge+Ge/2,Ge/2,Ge/2);for(let a of Q.rects)Math.abs(i.x-a.x)<a.hw+e&&Math.abs(i.z-a.z)<a.hd+e&&If(i,a.x,a.z,a.hw,a.hd)};function If(i,e,t,n,s){let r=l.clamp(i.x,e-n,e+n),a=l.clamp(i.z,t-s,t+s),o=i.x-r,c=i.z-a,h=o*o+c*c;if(h>=i.r*i.r)return;if(h<1e-6){let f=n-Math.abs(i.x-e),p=s-Math.abs(i.z-t);f<p?i.x+=Math.sign(i.x-e||1)*(f+i.r):i.z+=Math.sign(i.z-t||1)*(p+i.r);return}let u=Math.sqrt(h),d=i.r-u;i.x+=o/u*d,i.z+=c/u*d}Q.los=function(i,e,t,n){let s=t-i,r=n-e,a=Math.ceil(Math.hypot(s,r)/.5);for(let o=1;o<a;o++)if(Q.blocked(i+s*o/a,e+r*o/a))return!1;return!0};var Xh=new Int32Array(64*64);Q.buildFlow=function(i){let e=Q.w,t=Q.h,n=Q.dist;n.fill(-1);let s=0,r=0;for(let a of i){let o=l.clamp(Math.floor(a.x/Ge),0,e-1),c=l.clamp(Math.floor(a.z/Ge),0,t-1),h=c*e+o;n[h]!==0&&(n[h]=0,Xh[r++]=h)}for(;s<r;){let a=Xh[s++],o=a%e,c=a/e|0,h=n[a]+1;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++){if(!d&&!u)continue;let f=o+d,p=c+u;if(Q.tileSolid(f,p)||d&&u&&(Q.tileSolid(o+d,c)||Q.tileSolid(o,c+u)))continue;let y=p*e+f;n[y]===-1&&(n[y]=h,Xh[r++]=y)}}};Q.flowDir=function(i,e,t){let n=Q.w,s=Math.floor(i/Ge),r=Math.floor(e/Ge);if(s<0||r<0||s>=n||r>=Q.h)return!1;let a=Q.dist[r*n+s];if(a<=0)return!1;let o=a,c=0,h=0;for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=s+f,y=r+d;if(Q.tileSolid(p,y)||f&&d&&(Q.tileSolid(s+f,r)||Q.tileSolid(s,r+d)))continue;let x=Q.dist[y*n+p];x>=0&&x<o&&(o=x,c=f,h=d)}if(o===a)return!1;t.x=Ne(s+c)-i,t.z=Ue(r+h)-e;let u=Math.hypot(t.x,t.z)||1;return t.x/=u,t.z/=u,!0};var G={};l.FX=G;var Ji=new He,zo=new Zt,Fo=new L,Bo=new L,bs=new xe,Zh=new Kt,Ho=class{constructor(e,t,n,s){this.max=t,this.n=0,this.p=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.size=new Float32Array(t),this.col=new Uint32Array(t),this.grav=new Float32Array(t),this.im=new un(s,n,t),this.im.instanceMatrix.setUsage(_s),this.im.setColorAt(0,bs.set(1,1,1)),this.im.frustumCulled=!1,this.im.count=0,e.add(this.im)}spawn(e,t,n,s,r,a,o,c,h,u=1){let d=this.n;return d>=this.max?d=Math.random()*this.max|0:this.n++,this.p[d*3]=e,this.p[d*3+1]=t,this.p[d*3+2]=n,this.vel[d*3]=s,this.vel[d*3+1]=r,this.vel[d*3+2]=a,this.life[d]=this.maxLife[d]=o,this.size[d]=c,this.col[d]=h,this.grav[d]=u,d}update(e,t){let n=0;for(;n<this.n;){if(this.life[n]-=e,this.life[n]<=0){this.kill(n);continue}let s=n*3;this.vel[s+1]-=18*this.grav[n]*e,this.p[s]+=this.vel[s]*e,this.p[s+1]+=this.vel[s+1]*e,this.p[s+2]+=this.vel[s+2]*e,this.p[s+1]<.02&&(t&&this.vel[s+1]<-2&&t(this.p[s],this.p[s+2],this.col[n],this.size[n]),this.p[s+1]=.02,this.vel[s+1]*=-.25,this.vel[s]*=.5,this.vel[s+2]*=.5);let r=this.life[n]/this.maxLife[n],a=this.size[n]*(.4+.6*r);Ji.compose(Fo.set(this.p[s],this.p[s+1],this.p[s+2]),zo.identity(),Bo.set(a,a,a)),this.im.setMatrixAt(n,Ji),this.im.setColorAt(n,bs.setHex(this.col[n])),n++}this.im.count=this.n,this.im.instanceMatrix.needsUpdate=!0,this.im.instanceColor&&(this.im.instanceColor.needsUpdate=!0)}kill(e){let t=--this.n;if(e!==t){for(let n=0;n<3;n++)this.p[e*3+n]=this.p[t*3+n],this.vel[e*3+n]=this.vel[t*3+n];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.size[e]=this.size[t],this.col[e]=this.col[t],this.grav[e]=this.grav[t]}}clear(){this.n=0,this.im.count=0}};G.init=function(i){let e=l.R.q;G.solid=new Ho(i,e.particles,new Ae({roughness:.4}),new Te(1,1,1)),G.glow=new Ho(i,Math.floor(e.particles/2),new ut({toneMapped:!1}),new Te(1,1,1)),G.cloudMax=160,G.clouds=[],G.cloudIM=new un(new Gr(1,1),new ut({color:16777215,transparent:!0,opacity:.22,depthWrite:!1}),G.cloudMax),G.cloudIM.frustumCulled=!1,G.cloudIM.count=0,G.cloudIM.setColorAt(0,bs.set(1,1,1)),i.add(G.cloudIM),G.mistMax=220,G.mists=[],G.mistIM=new un(new Gr(1,2),new ut({color:14676735,transparent:!0,opacity:.032,depthWrite:!1}),G.mistMax),G.mistIM.frustumCulled=!1,G.mistIM.count=0,G.mistIM.setColorAt(0,bs.set(1,1,1)),i.add(G.mistIM),G.decalMax=e.decals,G.decalN=0,G.decalHead=0,G.decalIM=new un(new Pt(1,1).rotateX(-Math.PI/2),new Ae({map:ko(),transparent:!0,depthWrite:!1,roughness:.15,metalness:.1,polygonOffset:!0,polygonOffsetFactor:-2}),G.decalMax),G.decalIM.frustumCulled=!1,G.decalIM.count=0,G.decalIM.receiveShadow=!0,G.decalIM.setColorAt(0,bs.set(1,1,1)),i.add(G.decalIM),G.floatEl=document.getElementById("floaters"),G.floaters=[],E1(i)};G.reset=function(){G.solid.clear(),G.glow.clear(),G.spurts.length=0,G.pools.length=0,G.mess=0,G.clouds.length=0;for(let i of G.gibs)i.on=!1,i.grp.visible=!1;G.cloudIM.count=0,G.mists.length=0,G.mistIM.count=0,G.decalN=0,G.decalHead=0,G.decalIM.count=0;for(let i of G.floaters)i.el.remove();G.floaters.length=0};G.decal=function(i,e,t,n,s,r){let a=G.decalHead;G.decalHead=(G.decalHead+1)%G.decalMax,G.decalN=Math.min(G.decalN+1,G.decalMax),Ji.compose(Fo.set(i,.012+a%50*4e-4,e),zo.setFromEuler(Zh.set(0,s??Math.random()*6.28,0)),Bo.set(t,1,t*(r??l.rand(.7,1.2)))),G.decalIM.setMatrixAt(a,Ji),G.decalIM.setColorAt(a,bs.setHex(n)),G.decalIM.count=G.decalN,G.decalIM.instanceMatrix.needsUpdate=!0,G.decalIM.instanceColor.needsUpdate=!0};var w1=(i,e,t,n)=>{l.settings.gore&&Math.random()<.45&&G.decal(i,e,n*6+.2,t)},Gn=[9046538,7210502,10686478,5899268,10163216];G.blood=function(i,e,t,n,s,r=10){if(!l.settings.gore){r=Math.ceil(r/4);for(let a=0;a<r;a++)G.solid.spawn(i,e,t,n*l.rand(2,6)+l.rand(-2,2),l.rand(2,6),s*l.rand(2,6)+l.rand(-2,2),l.rand(.5,1.1),l.rand(.05,.12),14538440);return}r=Math.round(r*(l.goreMax()?2.6:1.6));for(let a=0;a<r;a++)G.solid.spawn(i,e,t,n*l.rand(2,7)+l.rand(-2.5,2.5),l.rand(2,7),s*l.rand(2,7)+l.rand(-2.5,2.5),l.rand(.5,1.2),l.rand(.04,.13),l.pick(Gn));for(let a=0;a<r/2;a++)G.solid.spawn(i,e,t,n*l.rand(7,12)+l.rand(-1,1),l.rand(1,4),s*l.rand(7,12)+l.rand(-1,1),l.rand(.3,.6),l.rand(.025,.05),l.pick(Gn),.7);Math.random()<.5&&G.decal(i+n*l.rand(.8,2),t+s*l.rand(.8,2),l.rand(.5,1.1),l.pick(Gn))};G.teeth=function(i,e,t){if(l.settings.gore)for(let n=0;n<l.randi(2,4);n++)G.solid.spawn(i,e,t,l.rand(-3,3),l.rand(4,7),l.rand(-3,3),1.8,.055,16775400)};G.spurts=[];G.knockout=function(i,e,t,n,s,r=16742938){if(!l.settings.gore)return;let a=l.goreMax(),o=a?1.35:1;G.decal(i,e,l.rand(1.6,2.4)*o,l.pick(Gn)),setTimeout(()=>G.decal(i+l.rand(-.3,.3),e+l.rand(-.3,.3),l.rand(2.2,3.2)*o,5899268),450),a&&setTimeout(()=>G.decal(i+l.rand(-.4,.4),e+l.rand(-.4,.4),l.rand(3,4.2),4850435),1100),G.spurts.length<30&&G.spurts.push({x:i,z:e,y:.5,dx:-t,dz:-n,t:l.rand(.7,1.3)*(a?1.8:1),k:0}),G.pools.push({x:i,z:e,r2:(a?1.5:1.1)**2}),G.pools.length>80&&G.pools.shift(),G.mess+=s?3:1;let c=s?a?16:7:a?5:0;for(let u=0;u<c;u++)G.solid.spawn(i,1,e,t*l.rand(3,8)+l.rand(-3,3),l.rand(4,9),n*l.rand(3,8)+l.rand(-3,3),l.rand(1.5,2.5),l.rand(.1,s?.24:.16),l.pick([5899268,7999504,9382436,10172976]));if(a)for(let u=0;u<(s?6:2);u++)G.solid.spawn(i,1.1,e,t*l.rand(2,6)+l.rand(-2,2),l.rand(3,7),n*l.rand(2,6)+l.rand(-2,2),2.2,l.rand(.08,.15),r);if(s&&(G.decal(i+t*1.5,e+n*1.5,l.rand(1.8,2.6)*o,l.pick(Gn)),a)){for(let u=0;u<20;u++){let d=Math.random()*6.28;G.solid.spawn(i,1.2,e,Math.cos(d)*l.rand(4,9),l.rand(1,5),Math.sin(d)*l.rand(4,9),.8,l.rand(.04,.09),l.pick(Gn))}for(let u=1;u<=4;u++)G.decal(i+t*u*.9,e+n*u*.9,l.rand(.9,1.5),l.pick(Gn))}let h=l.officers&&l.officers[0];h&&(h.x-i)**2+(h.z-e)**2<(s?12:5)&&G.splat(s?.9:.55)};G.pools=[];G.mess=0;var kf=48;G.gibs=[];var Oo=null;function Uf(){if(Oo)return Oo;let i=e=>new Je(e,e,.03,10);return Oo={head:[new vt(.165,14,10),new vt(.175,10,5,0,Math.PI*2,0,Math.PI/2.2).translate(0,.02,0),i(.08).translate(0,-.16,0)],arm:[new tn(.068,.4,3,8),new tn(.084,.12,3,8).translate(0,.17,0),i(.085).translate(0,.28,0)],leg:[new tn(.1,.56,3,8),new Te(.2,.13,.3).translate(0,-.36,.05),i(.1).translate(0,.39,0)]},Oo}function E1(i){let e=Uf(),t=new Ae({color:7996934,roughness:.3});for(let n=0;n<kf;n++){let s=new ot;s.visible=!1;let r=new ce(e.head[0],new Ae({roughness:.55})),a=new ce(e.head[1],new Ae({roughness:.7})),o=new ce(e.head[2],t);for(let c of[r,a,o])c.castShadow=!0,s.add(c);i.add(s),G.gibs.push({grp:s,a:r,b:a,c:o,on:!1,t:0})}G.gibHead=0}G.gib=function(i,e,t,n,s,r,a,o,c,h=1){let u=G.gibs[G.gibHead];G.gibHead=(G.gibHead+1)%kf;let d=Uf()[i];u.a.geometry=d[0],u.b.geometry=d[1],u.c.geometry=d[2],u.a.material.color.setHex(o),u.b.visible=c!=null,c!=null&&u.b.material.color.setHex(c),Object.assign(u,{on:!0,t:30,x:e,y:t,z:n,vx:s,vy:r,vz:a,rx:l.rand(-14,14),rz:l.rand(-14,14),rest:i==="head"?.16:.09,landed:!1,kind:i}),u.grp.scale.setScalar(h),u.grp.visible=!0,u.grp.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6),u.grp.position.set(e,t,n)};function T1(i){for(let e of G.gibs)if(e.on){if(e.t-=i,e.t<=0){e.on=!1,e.grp.visible=!1;continue}(e.y>e.rest||Math.abs(e.vy)>.5||Math.abs(e.vx)+Math.abs(e.vz)>.3)&&(e.vy-=18*i,e.x+=e.vx*i,e.y+=e.vy*i,e.z+=e.vz*i,l.W&&l.W.blocked&&l.W.blocked(e.x,e.z)&&(e.x-=e.vx*i,e.z-=e.vz*i,e.vx*=-.4,e.vz*=-.4),e.y<e.rest&&(e.y=e.rest,e.vy=Math.abs(e.vy)*.3,e.vx*=.55,e.vz*=.55,e.rx*=.5,e.rz*=.5,(!e.landed||Math.random()<.5)&&G.decal(e.x,e.z,l.rand(.6,1.1),l.pick(Gn)),e.landed=!0),e.grp.rotation.x+=e.rx*i,e.grp.rotation.z+=e.rz*i,Math.random()<.5&&G.solid.spawn(e.x,e.y,e.z,l.rand(-.5,.5),.5,l.rand(-.5,.5),.5,.045,l.pick(Gn)),e.grp.position.set(e.x,e.y,e.z)),e.t<1&&e.grp.scale.setScalar(Math.max(.01,e.t))}}G.dismember=function(i,e,t,n){if(!l.settings.gore||i.boss||i.caged||i.noRender||i.lost)return;let s=l.goreMax(),r=n?s?.95:.5:s?.3:0;if(Math.random()>r)return;let a=i.lost={},o=["head","armL","armR","legL","legR"],c=n&&s?l.randi(1,3):1;for(n&&s&&Math.random()<.55&&(a.head=!0);c-- >0;)a[l.pick(o)]=!0;let h=l.S&&l.S.run;h&&(a.head&&h.heads++,h.limbs+=Object.keys(a).length-(a.head?1:0));let u=i.scale||1,d=n?1:.6,f=i.yaw||0,p=y=>[Math.cos(f)*y*.33*u,-Math.sin(f)*y*.33*u];for(let y in a)if(y==="head")G.gib("head",i.x,1.6*u,i.z,e*l.rand(3,8)*d+l.rand(-1.5,1.5),l.rand(6,10)*d,t*l.rand(3,8)*d+l.rand(-1.5,1.5),i.skin,i.style===1||i.style===4?i.hair:i.style===2||i.style===3?i.hat:null,u),G.spurts.push({x:i.x,z:i.z,y:1.3*u,dx:e*.3,dz:t*.3,t:s?2.4:1.4,k:0,up:!0}),Math.random()<.5&&G.float(i.x,2.6,i.z,l.pick(["HEADS UP!","HEADCOUNT: -1","LOST HIS HEAD!","COUNT IS OFF!","NOGGIN GONE!"]),"#ff4a3a",18,1.4);else{let[x,g]=p(y.endsWith("L")?-1:1),m=y.startsWith("leg");G.gib(m?"leg":"arm",i.x+x,(m?.5:1.2)*u,i.z+g,e*l.rand(2,6)*d+x*6,l.rand(4,8)*d,t*l.rand(2,6)*d+g*6,m?i.suit:i.skin,m?1381653:i.shirtless?null:i.suit,u)}l.audio&&l.audio.play("thud",.8)};G.inPool=function(i,e){for(let t of G.pools)if((t.x-i)**2+(t.z-e)**2<t.r2)return!0;return!1};G.bootprint=function(i,e,t,n){let s=Math.cos(t)*(n?-.12:.12),r=-Math.sin(t)*(n?-.12:.12);G.decal(i+s,e+r,.17,7210502,t,2.1)};G.bloodRain=function(i,e){if(l.settings.gore)for(let t=0;t<90;t++)G.solid.spawn(i+l.rand(-7,7),l.rand(5,9),e+l.rand(-5,5),0,l.rand(-2,0),0,1.4,l.rand(.04,.1),l.pick(Gn))};G.splat=function(i=.6){if(!l.settings.gore)return;let e=document.getElementById("splat");e||(e=document.createElement("div"),e.id="splat",e.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:4;transition:opacity 1.4s ease-out;opacity:0",document.body.appendChild(e));let t=[];for(let n=0;n<5;n++){let s=n%4,r=Math.random()*100,[a,o]=s===0?[r,l.rand(0,12)]:s===1?[r,l.rand(88,100)]:s===2?[l.rand(0,10),r]:[l.rand(90,100),r],c=l.rand(4,11)*i;t.push(`radial-gradient(circle at ${a}% ${o}%, rgba(110,4,4,.85) 0, rgba(90,2,2,.6) ${c*.6}vmin, rgba(70,0,0,0) ${c}vmin)`)}e.style.transition="none",e.style.background=t.join(","),e.style.opacity=String(Math.min(1,i+.2)),requestAnimationFrame(()=>{e.style.transition="opacity 1.6s ease-out",e.style.opacity="0"})};G.sparks=function(i,e,t,n=8,s=16765562){for(let r=0;r<n;r++)G.glow.spawn(i,e,t,l.rand(-6,6),l.rand(1,7),l.rand(-6,6),l.rand(.15,.4),l.rand(.04,.08),s,.6)};G.spit=function(i,e,t,n,s){for(let r=0;r<6;r++)G.solid.spawn(i,e,t,n*l.rand(5,9)+l.rand(-1,1),l.rand(1,3),s*l.rand(5,9)+l.rand(-1,1),.7,.05,14279861)};G.splash=function(i,e,t,n=14){for(let s=0;s<n;s++)G.solid.spawn(i,.3,e,l.rand(-4,4),l.rand(2,5),l.rand(-4,4),.6,l.rand(.05,.1),t);G.decal(i,e,1.6,t)};G.cloud=function(i,e,t,n,s,r=.5,a=16742960){G.clouds.length>=G.cloudMax&&G.clouds.shift(),G.clouds.push({x:i,y:e,z:t,vx:n,vz:s,s:r,t:0,max:l.rand(1,1.6),col:a})};G.mist=function(i,e,t,n,s,r=.5){G.mists.length>=G.mistMax&&G.mists.shift(),G.mists.push({x:i,y:e,z:t,vx:n,vz:s,s:r*1.5,t:0,max:l.rand(1.6,2.4),seed:Math.random()*6.28,spin:l.rand(-2,2)})};G.float=function(i,e,t,n,s="#fff",r=15,a=1.6){G.floaters.length>=14&&G.floaters.shift().el.remove();let o=document.createElement("div");o.className="floater",o.textContent=n,o.style.color=s,o.style.fontSize=Math.round(r*(innerHeight<560?.72:.85))+"px",G.floatEl.appendChild(o),G.floaters.push({el:o,x:i,y:e,z:t,t:a,max:a,w:o.offsetWidth})};G.update=function(i){for(let t=G.spurts.length-1;t>=0;t--){let n=G.spurts[t];if(n.t-=i,n.k+=i,n.t<=0){G.spurts.splice(t,1);continue}if(Math.sin(n.k*14)>.4)for(let s=0;s<(n.up?4:2);s++)G.solid.spawn(n.x,n.y??.5,n.z,n.dx*l.rand(1,3)+l.rand(-.6,.6),n.up?l.rand(4,7):l.rand(2.5,4.5),n.dz*l.rand(1,3)+l.rand(-.6,.6),.7,l.rand(.04,.08),l.pick(Gn));n.up&&(n.y=Math.max(.3,n.y-i*1.2))}if(l.settings.gore&&l.AI&&l.AI.list&&(G.dripT=(G.dripT||0)-i,G.dripT<=0)){G.dripT=.12;for(let t of l.AI.list)!t.dead&&t.maxHp&&t.hp<t.maxHp*.45&&Math.random()<.25&&G.solid.spawn(t.x+l.rand(-.2,.2),.9,t.z+l.rand(-.2,.2),0,-1,0,.6,.05,l.pick(Gn))}T1(i),G.solid.update(i,w1),G.glow.update(i);let e=0;for(let t=G.clouds.length-1;t>=0;t--){let n=G.clouds[t];if(n.t+=i,n.t>=n.max){G.clouds.splice(t,1);continue}n.x+=n.vx*i,n.z+=n.vz*i,n.vx*=.9,n.vz*=.9,n.y+=i*.3;let s=n.s*(1+n.t*2.2)*(1-Math.pow(n.t/n.max,3));Ji.compose(Fo.set(n.x,n.y,n.z),zo.identity(),Bo.set(s,s*.7,s)),G.cloudIM.setColorAt(e,bs.setHex(n.col)),G.cloudIM.setMatrixAt(e++,Ji)}G.cloudIM.count=e,G.cloudIM.instanceMatrix.needsUpdate=!0,G.cloudIM.instanceColor&&(G.cloudIM.instanceColor.needsUpdate=!0),e=0;for(let t=G.mists.length-1;t>=0;t--){let n=G.mists[t];if(n.t+=i,n.t>=n.max){G.mists.splice(t,1);continue}let s=Math.sin(n.t*5+n.seed)*2.2;n.x+=(n.vx-n.vz*s*.12)*i,n.z+=(n.vz+n.vx*s*.12)*i,n.vx*=.93,n.vz*=.93,n.y+=i*.25;let r=n.t/n.max,a=n.s*(1+r*2.6)*(1-r*r);Zh.set(0,n.seed+n.t*n.spin,0),Ji.compose(Fo.set(n.x,n.y,n.z),zo.setFromEuler(Zh),Bo.set(a*2.2,a*.3,a*.7)),G.mistIM.setMatrixAt(e++,Ji)}G.mistIM.count=e,G.mistIM.instanceMatrix.needsUpdate=!0;for(let t=G.floaters.length-1;t>=0;t--){let n=G.floaters[t];if(n.t-=i,n.y+=i*.9,n.t<=0){n.el.remove(),G.floaters.splice(t,1);continue}let[s,r,a]=l.R.worldToScreen(n.x,n.y,n.z),o=n.w/2+8;s=o*2>innerWidth?innerWidth/2:Math.max(o,Math.min(innerWidth-o,s)),n.el.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%)`,n.el.style.opacity=a?Math.min(1,n.t/(n.max*.3)):0}};var Of=[["{bernardo}","Hey, you wanna see how big my truck is? No? Too bad, it is parked across three spots."],["{bernardo}","Six-inch lift, 37s, and a payment bigger than my mortgage. Worth it."],["{bernardo}","{hero}, you owe me twenty on Sunday's game. Do not die before you pay me."],["{bernardo}","That linebacker they drafted hits softer than this whole tier."],["{bernardo}","If I go down, somebody move my truck. It is in the fire lane. Again."],["{bernardo}","My shield has seen more action than my fantasy team."],["{dustin}","Fourth taco of the shift. Pray for whoever is downwind."],["{dustin}","My truck is lifted so high the inmates need a step stool to key it."],["{dustin}","Our offensive line blocks worse than this door, and this door is gone."],["{dustin}","I sprayed one dude so hard his grandkids are gonna cough."],["{dustin}","Three energy drinks in. I can hear colors. Let's GO."],["{dustin}","Somebody tell the guy in cell 9 his mama called. Collect. She wants her shoes back."],["{caleb}","What's up bro. Did you see the game last night? Ref was a bum."],["{caleb}","{hero}, if you die, I am taking your parking spot AND your taco."],["{caleb}","That dude's breath is a use of force all by itself."],["{caleb}","You call that a takedown, {hero}? My little cousin tackles better at flag football."],["{caleb}","I am six foot four of pure overtime, baby."],["{caleb}","Tell Sarge his mustache has been written up for loitering."],["{HERO}","I have been awake so long my energy drink needs an energy drink."],["{HERO}","Somebody tell the warden my truck payment is due Friday."],["{HERO}","I swear to God, if I miss kickoff for this."],["{HERO}","Three hundred inmates and not one of them can pick a winner on Sunday."],["{HERO}","I am one bad taco away from a chemical incident."],["SERGEANT","{hero}, that is the ugliest takedown I have ever signed off on."],["SERGEANT","Whoever parked the lifted truck in the fire lane: nice truck. Move it."],["SERGEANT","I played college ball, you know. Nobody asked. But I did."],["SERGEANT","Hydrate, people. And no, energy drinks do not count as water. They count as courage."],["RADIO","Reminder: the betting pool on this riot is closed. {bernardo} took the over."],["RADIO","Taco truck is at the sally port. Officers only. Inmates, that means you, Delgado."],["RADIO","Score update for those of you not currently bleeding: we are losing by 14."],["RADIO","Lost and found: one dentures, one shank, one dignity. Please claim at Central."],["COMPLIANCE","Friendly reminder: PREA training is due by end of shift. Your shift does not end."],["COMPLIANCE","PREA Module 2 of 47 will now autoplay over your radio."],["COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one still standing."],["COMPLIANCE","Great news! The PREA auditor is on site today. Please stop bleeding on the paperwork."],["COMPLIANCE","PREA Zero Tolerance includes zero tolerance for late paperwork."]],zf=["Sit DOWN, sweetheart.","That all you got?","File a grievance, tough guy.","Who wants some? Form a line!","I eat tacos tougher than you.","Next!","Back in your cell, princess.","You swing like a Monday.","Count that, chief.","That's a write-up.","Not on my overtime!","You want to see my truck? Too bad.","Lockdown, baby!","Tell it to the law library.","My ex hits harder.","Touchdown!","Flag on the play!","Stay down!","Chow's cancelled.","Somebody call medical. Not for me."],Ff=["Fuck you, CO!","Bitch-ass cop!","I got your plate number!","Your truck is compensating, bro!","You can't even read, boss!","I know where you park!","I'm gonna gas your ass!","Pig!","I'm telling my lawyer!","Your wife writes me letters!","Come in here, tough guy!","This my house!","You ain't shit without that spray!","Bring the Sarge, punk!","Chow was cold AGAIN!","Where my commissary at?!","I want a grievance form!","You smell like tacos and fear!","I'll beat your ass!","PREA! PREA! He looked at me!","Get off my tier!","Y'all can't count!","Lift your truck? Lift THIS!","Your mama on my visitor list!","Shoot me, I dare you!","I got life, I don't give a fuck!","Your football team trash!","I'll spit on you!"],Kh=["MY EYES!","Ahh shit!","Medical! MEDICAL!","I'm filing on you!","That's excessive!","I can't breathe... jk","My tooth!","Ow! My commissary!","Okay okay okay!","I'm calling my mama!","That's a lawsuit!","Not the face!"],Jh=["Hey cutie!","Officer, you work out?","Ooh, not the cuffs, they clash!","Is that a baton or a fashion statement?","Hey big truck!","Girl, those boots? No.","That uniform is NOT flattering, boo.","Call me, officer!","I did my makeup for THIS?!","Watch the hair!","Honey, I'm the shot caller now.","You're cute when you're scared.","Don't make me take my earrings off!","This jumpsuit is a crime. So am I."],Bf={cup:["Taste this!","Fresh batch!","Gassed!"],tray:["Chow time!","Catch!"],shoe:["Shoe check!","Size 12, bitch!"]},Hf={taco:["TACO POWER!","Carne asada mode!","Extra hot sauce!","Al pastor, baby!"],gold:["GOLDEN TACO!","Caleb hid this. Respect.","Big bro approved."],zyn:["HOT POUCH! LIP ON FIRE!","Hot pouch! HOT POUCH!","Ooh that burns. Good.","Pouch in. Brain on.","Top lip is MELTING."],chew:["Dip check!","Fat lip. Full health.","Old school, baby.","Pinch between cheek and gum!"],drink:["ENERGY DRINK!","Zero sugar, all rage!","Heart rate: yes.","Beast mode!"]},jh=["THE TV TOLD ME TO!","I'm the warden now!","AWOOOOOO!","Who took my left sock?!","I can see sounds!","Officer, are you real?","I'm naked and I'm FAST!","The pruno speaks to me!","BEEP BEEP, I'm a truck!","Count me! COUNT ME!","I live in the vents now.","My lawyer is a pigeon."],Qh=["You lost, homie?","Wrong tier, jefe.","This is OUR dayroom.","\xD3rale, here comes the cop.","Don't look at me, CO.","We run this block.","Tell your sergeant we said what's up.","Big truck, small heart, homie.","Ey, nice boots... NOT.","Call your backup, we'll wait.","Jump him!","Get the CO!"],Gf=["Hey CO... real quick... what does PREA stand for?","Wait wait wait. What's PREA mean though?","Is PREA like a Prius? For real, what is it?"],Vf=["Prison Rape Elimination Act. There are 47 modules. Want the binder?","It's federal law, buddy. Here's the hotline. It's also on every wall.","P-R-E-A. Zero tolerance. Now get on the ground."],Wf=["*confused silence*","...huh.","Forty-seven modules?!","Bro, that's a lot of paperwork.","I just wanted commissary."],Xf=["Your mama's commissary is overdrawn!","Nice tattoo. Did you do it with a staple?","You swing like your parole officer.","Your release date called. It laughed.","You got that face only a cellie could love.","Even your shank is disappointed in you."],qf=["SHIELD UP!","Behind me, family!","This shield cost more than my truck. No it didn't. Nothing does.","Hey, you wanna see how big my truck is? After the riot."],Yf=[{name:"The Jailhouse Lawyer",suit:3107642,skin:15254176,hair:3810582,style:1,face:0,item:16053492,lines:["Officer, I am filing a motion. Against your haircut.","I have 400 pages of grievances. This is volume one.","Objection! Chow was cold. Sustained.","I represent myself. My client is VERY happy with me."]},{name:"Picasso",suit:3107642,skin:15921906,hair:16726554,style:1,face:3,lines:["Commissary special: one portrait, forty soups.","Hold still, officer. I am painting you. Badly.","I painted the warden. He made me paint over it.","Want a portrait? It comes with a free mustache."]},{name:"Dog Talker Doug",suit:3107642,skin:14724229,hair:1709072,style:1,face:7,lines:["The K-9 says you're doing great, officer.","Biscuit says hi. Biscuit's the K-9.","Don't look at me. Talk to the dog.","The dog wants a lawyer. Get him the Jailhouse Lawyer."]},{name:"Lights Out Larry",suit:1780512,skin:13011550,hair:1118481,style:1,face:1,lines:["Turn. That light. OFF.","I hate fluorescents. I hate you more.","It's too bright in here, CO.","I been asking for a dimmer switch since 2004."]},{name:"Puzzle Pete",suit:3107642,skin:15845285,hair:7031338,style:2,face:4,lines:["I mailed the warden a crossword. He hasn't solved it.","Check my kite, officer. Every 13th letter spells TACOS.","You'll never finish my sudoku. Nobody does.",'Seven letters, means "forever": OVERTIME.']}],na={intro:"Big Foggy is OUT of his cell! He got into the fog machine again! All staff, watch the mist!",taunts:["Nobody checks the fog machine, officer.","The mist is my friend.","Nineteen escape attempts. This is twenty.","Gone fishing. In the mop bucket.","You can't cuff fog."],callouts:["Movement in the mist!","He's behind you!","I lost him in the fog!","Cell 7! No, cell 9! I don't know!"],death:"Big Foggy is DOWN. Somebody unplug that fog machine. And get the paperwork."},$f=["PREA!!!","PREA! PREA! PREA!","PREAAAAAAA!","PREA! He looked at me with his EYES!","PREA! That pepperball was flirting with me!","I'm calling the PREA hotline!","PREA! He breathed in my direction!","PREA! He sprayed me without a consent form!","Somebody get me a PREA form!","I know my PREA rights! I read the poster!","PREA! His baton winked at me!",'PREA! He said "good morning" aggressively!',"PREA! He stood within six feet of my feelings!","PREA! PREA! Get my lawyer!","PREA! He touched my commissary!","PREA! That taco smelled at me!","PREA! He made eye contact through his sunglasses!","This is a PREA violation and a Tuesday!"],Zf=["That's not what PREA means.","Hotline's on the wall. Next to the hole you punched.","Write it up, buddy.","Spell PREA. I'll wait.","Form's in the box. Box is on fire.","Noted. Filed. Shredded.","Bro, you yelled PREA at a vending machine yesterday.","Tell it to the Auditor."],Kf=["The Bar is loose. Somebody is naked again.","Bar units: one of them says he is the warden now. He is not the warden.","Heads up, the dings in the Bar are howling at the fluorescent lights again.","Bar units report an inmate wearing a mattress as armor. Respect, honestly.","Control to all staff: the Bar ding is painting the dayroom. With what? Do not ask.","Bar units: he says the TV told him to. The TV has been unplugged since 2009."],Jf=["Twelve years of push-ups with my ARMS, CO.","I got four-wheel drive, you got flat feet.","Move. I got the right of way.","I'm faster sitting down than you are standing up.","This chair got more miles than your truck.","Handicap parking? I park wherever I want."],jf=["BEEP BEEP, BITCH!","Speed bump!","Wide load coming through!","RAMMING SPEED!","Ankles, CO! I want ANKLES!"],Qf=["One leg, still whooping you.","Medical gave me these. Bad idea.","You know how long this crutch is? Long enough.","I hop faster than you run, CO."],ep=["CATCH!","Medical can bill me!","Here, you need this more than me!","I got another one in my cell!"],tp=["No I wasn't in his cell by myself.","I don't love offenders.","I am NOT an inmate lover.","Ask Bingbing. I am innocent.","My mom got my ass beat for acting exactly like this."],np=["He's not my boyfriend. He's my pen pal. We just write a LOT.","Boyfriend? Please. He's my emotional support offender.","I'm not his girlfriend, I'm one of his girlfriends. WAIT.","Why does he have my name tattooed on his neck? Ask HIM.","That phone? Never seen it. It's not even my case color. ...It's my case color.","I've only been in four cells today. That's below the unit average.","Twelve years in. Zero write-ups. Forty-one 'pen pals'.","The honey buns were a GIFT. From me. To him. Every day. That's normal.","Those letters are fan mail. He writes me fan mail. And poems. And a song.","I didn't bring him anything! ...Except the hot chips. And the charger.","We're just friends. He calls me 'wifey' as a joke. Every day.","I read the PREA poster. I just didn't think it was about ME."],ip=["I was providing COUNSELING. Very close counseling.","I'm not compromised, I'm emotionally available.","He's not my boyfriend, he's my CASELOAD.","I don't love offenders. I just love... helping them. Personally. After hours."],sp=["Ask Coughronny. She'll tell you I'm innocent. ...Don't ask Coughronny.","My office door was locked for CONFIDENTIALITY.","That wasn't a date. It was a treatment plan. With candles.","Rehabilitation is a two-way street. Mostly his way.","I put money on his books because I'm a GIVER.","Why is my number in his phone? He needed a counselor! At 2 AM! Nightly!","His release plan says 'move in with Counselor Bingbing.' Typo.","We're working on boundaries. Together. In my office. With the blinds shut."],rp="My mom got MY ass beat for this too. It runs in the family.",ap=["Coughronny AND Bingbing on the same shift? That's a pod party.","Heard they got matching tattoos. With HIM.","Bro she put fifty on his books and none on mine!","Bingbing's office smells like cologne and bad decisions.","Ayy she been writing ME letters too!","Line forms on the left, homie!","She brought him hot chips. HOT CHIPS, CO!"],eu=["Bro... not again.","Somebody check. I'm not checking.","Is it Coughronny or the OTHER one?","Copy. Bringing a write-up and a box for her desk.","Control, do we have a form for this? We need a form for this."],tu=["BABY TELL 'EM ABOUT US!","THAT'S MY WIFE!","That's MY girl, CO!","Wifey, you said it was SPECIAL!","Girl you smell like commissary.","We're in LOVE, CO!"],fr="You wanna run it with me?",op=["You wanna run it with me? Then square up.","You built like a commissary receipt.","Your hands are slower than medical.","I've seen better fighting in the chow line.","You wanna run it with me? Nah, you wanna run your MOUTH.","Who's next? Line up. I'll roast all of y'all.","Your mama called. She said keep me out of this.","Bro you swing like you got a write-up pending.","Sit down before I make you sit down. Twice.","Fourth taco of the shift, baby."],lp=["Counselor Alaniz on the floor. Case CLOSED.","Y'all called a counselor? Bad idea.","Ricardo Alaniz in the building. Somebody about to get counseled.","Legend of the community, reporting for duty. Ask about me."],cp=["Did you see that Combo Rombo?","Did you SEE that Combo Rombo?!","That's a COMBO, ROMBO!","I don't do treatment plans. I do treatment PAIN.","Your release date just got pushed back, homie.","I counsel with my hands.","Group therapy is in session. You're the group.","Y'all thought counselors just did paperwork?","Legend of the community. Ask about me.","I cleaned house AND did your annual review.","Combo Rombo, baby! Write THAT in your file!","That's a program violation. And a beatdown."],hp=["House is clean. I got a caseload to get back to.","Alaniz out. Did y'all see that Combo Rombo though?","Session over. Y'all are rehabilitated."],up=["{name}? In MY building? Pack your desk.","{name}, I KNEW it. Badge. Keys. Now.","Nah. Not on my watch, {name}. Not in my house."];var ht={list:[],proj:[]};l.AI=ht;var Vo={rat:{hp:55,speed:4.3,dmg:8,scale:[.9,1.1],suit:[16742938,16747050,15887122],score:10},gasser:{hp:45,speed:3.9,dmg:6,scale:[.85,1],suit:[15765562],item:16053492,ranged:!0,score:15},shank:{hp:50,speed:5.3,dmg:15,scale:[.9,1.05],suit:[13119514],item:12634320,lunge:!0,score:20},big:{hp:240,speed:3.1,dmg:22,scale:[1.35,1.5],suit:[16742938],knock:10,score:40},diva:{hp:75,speed:4.9,dmg:10,scale:[.95,1.05],suit:[16747114,16751226],item:16732088,hair:[16732088,16244810,10181887,16722474],diva:!0,score:25},ding:{hp:60,speed:6,dmg:9,scale:[.9,1.05],suit:[16742938],shirtless:!0,face:7,style:0,ding:!0,score:15},cholo:{hp:85,speed:4.7,dmg:13,scale:[1,1.15],suit:[15759914,15232800],style:3,hats:[1315868,2763306,15263976],face:3,item:12634320,score:25},prea:{hp:50,speed:3.6,dmg:6,scale:[.95,1],suit:[16747050],style:1,face:0,prea:!0,score:30},wheel:{hp:140,speed:6.4,dmg:16,scale:[1,1.1],suit:[16742938,15887122],wheel:!0,turn:1.8,knock:11,score:30},crutch:{hp:90,speed:3.8,dmg:14,scale:[.95,1.1],suit:[16747050,15765562],crutch:!0,reach:.9,knock:6,score:25},killer:{hp:9999,speed:0,dmg:0,scale:[1,1.05],suit:[3107642],score:0},ripper:{hp:3200,speed:5.4,dmg:20,scale:[1.3,1.3],suit:[3107642],knockMul:.08,score:1e3,boss:!0}};l.TYPES=Vo;for(let i in Vo){let e=Vo[i];i!=="killer"&&(e.hp=Math.round(e.hp*(e.boss?1.2:1.6)))}l.MAX_SWINGERS=4;var dp=[],nu={x:0,z:0},Wo=0;ht.reset=function(){ht.list.length=0,ht.proj.length=0,ht.projIM.count=0};ht.init=function(i){ht.projIM=new un(new Te(1,1,1),new Ae({roughness:.6}),200),ht.projIM.frustumCulled=!1,ht.projIM.count=0,ht.projIM.castShadow=!0,ht.projIM.setColorAt(0,new xe(1,1,1)),i.add(ht.projIM)};ht.spawn=function(i,e,t){let n=Vo[i],s=n.scale[0]+Math.random()*(n.scale[1]-n.scale[0]),r={type:i,def:n,x:e+l.rand(-.4,.4),z:t+l.rand(-.4,.4),vx:0,vz:0,r:.38*s,scale:s,yaw:Math.random()*l.TAU,hp:n.hp*(l.S.hpMul||1),maxHp:n.hp*(l.S.hpMul||1),speed:n.speed*l.rand(.9,1.1),suit:l.pick(n.suit),skin:l.pick(l.SKIN),hair:n.hair?l.pick(n.hair):l.pick(l.HAIR),hairOn:n.diva||Math.random()<.55,itemCol:n.item||0,phase:Math.random()*6,move:0,swing:0,swingCD:l.rand(.3,1),flash:0,ocT:0,fall:0,dead:!1,deadT:0,thinkT:Math.random()*.3,seen:!1,throwT:l.rand(3,8),spitT:l.rand(2,6),lungeT:0,combo:0,hop:0,vy:0,spin:0,flail:0,windup:0,style:n.style??l.pick([0,0,1,1,1,2,3,3]),hat:l.pick(n.hats||[2039583,9051164,1850506,7171437,15263976]),face:n.face??l.randi(0,6),shirtless:!!n.shirtless,wide:n.wide||1};return n.diva&&(r.style=4),n.boss&&(r.boss=!0,r.noRender=!0),ht.list.push(r),r};ht.liveCount=()=>{let i=0;for(let e of ht.list)!e.dead&&!e.caged&&i++;return i};var S1=0;ht.spawnCrew=function(i,e,t=4){let n=++S1;for(let s=0;s<t;s++){let r=ht.spawn("cholo",i+Math.cos(s*1.6)*1.3,e+Math.sin(s*1.6)*1.3);r.posted=!0,r.crew=n,r.yaw=Math.atan2(i-r.x,e-r.z)}};function ru(i){for(let e of ht.list)e.crew===i&&e.posted&&(e.posted=!1,e.flex=0)}ht.wakeCrew=ru;function A1(i){let e=null,t=1e9;for(let n of l.targets){if(n.down)continue;let s=(n.x-i.x)**2+(n.z-i.z)**2;s<t&&(t=s,e=n)}return[e,Math.sqrt(t)]}function gn(i,e,t="#ffb37a"){Wo<=0||l.FX.floaters.length>8||(Wo-=1,l.FX.float(i.x,2.3*i.scale,i.z,l.censor(l.pick(e)),t,14,1.8))}var su=0;function Go(i,e){if(!(su>0||Math.random()>e||l.FX.floaters.length>10)&&(su=l.rand(.7,1.6),l.S.prea=(l.S.prea||0)+1,l.FX.float(i.x,2.6*i.scale,i.z,l.pick($f),"#ffe24a",22,2.2),Math.random()<.3)){let t=l.officers.find(n=>!n.down&&(n.x-i.x)**2+(n.z-i.z)**2<200);t&&setTimeout(()=>l.FX.float(t.x,2.6,t.z,l.pick(Zf),"#9fd0ff",16,2),700)}}function iu(i,e,t,n){let s=t-i.x,r=n-i.z,a=Math.hypot(s,r)||1,o=a/13;ht.proj.push({kind:e,x:i.x,y:1.5*i.scale,z:i.z,vx:s/o,vz:r/o,vy:9*o*.5+.2,spin:0,dmg:e==="cup"?6:e==="tray"?9:5,life:3}),i.windup=1,Math.random()<.45&&gn(i,Bf[e])}ht.update=function(i){let e=l.W,t=ht.list;Wo=Math.min(2,Wo+i*.6),su-=i,l.grid.clear();for(let n of t)!n.dead&&!n.caged&&l.grid.insert(n);for(let n of l.targets)n.slots=0;for(let n=t.length-1;n>=0;n--){let s=t[n];if(s.flash=Math.max(0,s.flash-i),s.flashedT>0&&(s.flashedT-=i),!s.dead&&s.hop>0&&!s.def.crutch&&(s.vy-=20*i,s.hop=Math.max(0,s.hop+s.vy*i),s.hop===0&&(s.vy=0,l.FX.blood(s.x,.2,s.z,0,0,2),l.audio.play("thud",.6))),s.windup=Math.max(0,s.windup-i*3),s.vx||s.vz){s.x+=s.vx*i,s.z+=s.vz*i;let b=Math.exp(-i*7);s.vx*=b,s.vz*=b,Math.abs(s.vx)+Math.abs(s.vz)<.05&&(s.vx=s.vz=0),e.collide(s)}if(s.dead){s.fall=Math.min(1,s.fall+i*3.5),s.move=0,s.swing=0,(s.vy||s.hop>0)&&(s.hop+=s.vy*i,s.vy-=20*i,s.yaw+=s.spin*i,s.tumble=(s.tumble||0)+s.spin*.4*i,s.hop<=0&&(s.hop=0,s.vy=0,s.spin=0,s.tumble=0,l.FX.blood(s.x,.2,s.z,0,0,4),l.audio.play("thud",.5))),s.deadT+=i,s.deadT>9&&t.splice(n,1);continue}let[r,a]=A1(s);if(s.caged){r&&(s.yaw+=l.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*3)),s.phase+=i,s.move=0,s.flex=Math.max(0,Math.sin(s.phase*.7))*.3;continue}if(s.boss){l.Boss&&l.Boss.think(s,i,r,a);continue}if(s.freezeT>0){s.freezeT-=i,s.move=l.lerp(s.move,0,i*8),s.flex=1;continue}if(s.posted){s.move=0,s.phase+=i*.5,s.flex=.5+Math.sin(s.phase*2)*.3,Math.random()<i*.06&&gn(s,Qh,"#ffd27a"),r&&a<9&&(ru(s.crew),gn(s,["Get the CO!","Jump him!","\xD3rale, let's go!"],"#ffd27a"));continue}if(s.flex=Math.max(0,(s.flex||0)-i*2),s.def.prea&&!s.asked&&r&&a<8){if(s.asking||(s.asking=!0,s.askT=0,l.FX.float(s.x,2.6,s.z,l.pick(Gf),"#ffe27a",16,3.5)),s.askT+=i,s.move=l.lerp(s.move,0,i*8),r.yaw!==void 0&&(s.yaw+=l.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*6)),a<2.8&&(s.answerT=(s.answerT||0)+i),s.answerT>1){s.asked=!0,l.say(r.name||"OFFICER",l.pick(Vf),4);for(let b of t)!b.dead&&!b.caged&&!b.boss&&(b.x-s.x)**2+(b.z-s.z)**2<140&&(b.freezeT=4,b.swing=0);l.FX.float(s.x,3,s.z,l.pick(Wf),"#ffe27a",18,3),r.score=(r.score||0)+100}else s.askT>7&&(s.asked=!0);continue}if(s.ocT=Math.max(0,s.ocT-i),s.swingCD-=i,s.throwT-=i,s.spitT-=i,s.lungeT=Math.max(0,s.lungeT-i),!r){s.move=l.lerp(s.move,0,i*5);continue}s.thinkT-=i,s.thinkT<=0&&(s.thinkT=l.rand(.2,.35),s.seen=a<16&&e.los(s.x,s.z,r.x,r.z));let o=0,c=0,h=s.speed,u=r.x-s.x,d=r.z-s.z,f=1/(a||1);if(s.ocT>0)s.flail=1,o=Math.sin(s.phase*.7+n),c=Math.cos(s.phase*.5+n),h*=.35,Math.random()<i*.6&&gn(s,["*cough cough*","MY EYES!","I can't see!","Water! WATER!"],"#ff9a6a");else{s.flail=Math.max(0,s.flail-i*2),s.seen||a<2.5?(o=u*f,c=d*f):e.flowDir(s.x,s.z,nu)?(o=nu.x,c=nu.z):(o=u*f,c=d*f);let b=s.def;b.ranged&&s.seen?(a<6?(o=-o,c=-c):a<10&&(o*=.15,c*=.15),s.throwT<=0&&a<13&&(s.throwT=l.rand(1.8,2.8),iu(s,"cup",r.x,r.z))):s.seen&&s.throwT<=0&&a>5&&a<12&&(s.throwT=l.rand(6,11),iu(s,Math.random()<.5?"tray":"shoe",r.x,r.z)),b.lunge&&s.seen&&a>2&&a<4.5&&s.lungeT<=0&&s.swingCD<=0&&(s.lungeT=2.5,s.vx+=u*f*13,s.vz+=d*f*13,s.swingCD=0,Math.random()<.5&&gn(s,["Shank time!","Poke poke, bitch!","Hold still, CO!"])),a<3.2&&s.spitT<=0&&Math.random()<.5&&(s.spitT=l.rand(5,9),l.FX.spit(s.x,1.5*s.scale,s.z,u*f,d*f),r.hurt(2,s.x,s.z,"spit"),gn(s,["*hocks loogie*","PTOO!","Got you, CO!"],"#d9e4b5")),b.ding&&(s.dingT=(s.dingT||0)-i,s.dingT<=0&&(s.dingT=l.rand(1.5,4),s.dingDir=Math.random()<.45?Math.random()*l.TAU:null,Math.random()<.4&&gn(s,jh,"#c6ff7a")),s.dingDir!=null&&a>2.5&&(o=Math.sin(s.dingDir),c=Math.cos(s.dingDir),h*=1.3,s.flail=1)),b.crutch&&!s.noCrutch&&s.seen&&a>5&&a<11&&Math.random()<i*.4&&(s.noCrutch=!0,iu(s,"shoe",r.x,r.z),gn(s,ep,"#ffb37a")),b.crutch&&(s.noCrutch?(h*=.75,s.hop=Math.abs(Math.sin(s.phase*.6))*.14):Math.random()<i*.04&&gn(s,Qf,"#ffb37a")),b.wheel&&(s.ramT=(s.ramT||0)-i,a<s.r+r.r+.5&&s.ramT<=0&&s.move>.6?(s.ramT=2.2,r.hurt(b.dmg*(l.S.dmgMul||1),s.x,s.z,"ram",b.knock),s.vx-=u*f*7,s.vz-=d*f*7,l.audio.play("thud",.8),gn(s,jf,"#ffd27a")):Math.random()<i*.04&&gn(s,Jf,"#ffb37a")),Math.random()<i*.012&&Go(s,1),Math.random()<i*.05&&gn(s,b.diva?Jh:b.ding?jh:s.type==="cholo"?Qh:Ff,b.diva?"#ff8fd0":b.ding?"#c6ff7a":"#ffb37a")}let p=s.r+r.r+(.6+(s.def.crutch&&!s.noCrutch?s.def.reach:0))*s.scale;if(a<p+1.6&&s.ocT<=0){if(r.slots<l.MAX_SWINGERS)r.slots++;else if(s.swing<=0){let b=n&1?1:-1,w=a<2.6?-.6:.3;o=-d*f*b+u*f*w,c=u*f*b+d*f*w,h*=.55,s.swingCD=Math.max(s.swingCD,.3)}}if(s.swing>0){let b=s.swing;s.swing+=i*(s.def.diva?4.2:2.9),b<.5&&s.swing>=.5&&a<p+.4&&s.ocT<=0&&(r.hurt(s.def.dmg*(l.S.dmgMul||1),s.x,s.z,s.type,s.def.knock||3),s.def.diva&&Math.random()<.4&&gn(s,Jh,"#ff8fd0")),s.swing>=1&&(s.swing=0,s.def.diva&&s.combo<1?(s.combo++,s.swing=.01):(s.combo=0,s.swingCD=l.rand(.7,1.1))),h*=.4}else a<p&&s.swingCD<=0&&s.ocT<=0&&!s.def.wheel&&(s.swing=.01);a<p*.85&&(o*=.1,c*=.1),l.grid.query(s.x,s.z,1.2,dp);let y=0,x=0;for(let b of dp){if(b===s)continue;let w=s.x-b.x,D=s.z-b.z,A=w*w+D*D,I=s.r+b.r;if(A<I*I&&A>1e-5){let R=Math.sqrt(A),E=(I-R)/R;y+=w*E,x+=D*E}}let g=Math.min(1,i*(s.def.turn||6));s.hx=l.lerp(s.hx??o,o,g),s.hz=l.lerp(s.hz??c,c,g),s.x+=s.hx*h*i+y*.5,s.z+=s.hz*h*i+x*.5,e.collide(s);let m=Math.min(1,Math.hypot(s.hx,s.hz));s.move=l.lerp(s.move,m,i*8),s.phase+=i*10*s.move*(h/4.3);let v=s.ocT>0||s.def.wheel?Math.atan2(s.hx,s.hz):Math.atan2(u,d);s.yaw+=l.angDiff(s.yaw,v)*Math.min(1,i*10)}N1(i)};var fp=new He,R1=new Zt,C1=new Kt,I1=new L,P1=new L,L1=new xe,D1={cup:[.16,.22,.16,15921906],tray:[.5,.05,.36,10134443],shoe:[.14,.12,.3,1776411]};function N1(i){let e=ht.proj,t=0;for(let n=e.length-1;n>=0;n--){let s=e[n];s.vy-=18*i*.5,s.x+=s.vx*i,s.y+=s.vy*i,s.z+=s.vz*i,s.spin+=i*12,s.life-=i;let r=!1;for(let o of l.targets)if(!o.down&&(o.x-s.x)**2+(o.z-s.z)**2<.6&&s.y<2){o.hurt(s.dmg,s.x-s.vx,s.z-s.vz,s.kind,2),s.kind==="cup"?(l.FX.splash(o.x,o.z,7035434,18),l.FX.float(o.x,2.4,o.z,"GASSED!","#c9b45a",18,1.4),o.slowT=2):l.FX.sparks(s.x,s.y,s.z,6,16777215),l.audio.play(s.kind==="cup"?"splat":"thud",.7),r=!0;break}if(!r&&(s.y<=.05||s.life<=0||l.W.blocked(s.x,s.z))&&(s.kind==="cup"&&l.FX.splash(s.x,s.z,7035434,10),r=!0),r){e.splice(n,1);continue}let a=D1[s.kind];fp.compose(I1.set(s.x,s.y,s.z),R1.setFromEuler(C1.set(s.spin,s.spin*.6,0)),P1.set(a[0],a[1],a[2])),ht.projIM.setMatrixAt(t,fp),ht.projIM.setColorAt(t,L1.setHex(a[3])),t++}ht.projIM.count=t,ht.projIM.instanceMatrix.needsUpdate=!0,ht.projIM.instanceColor&&(ht.projIM.instanceColor.needsUpdate=!0)}ht.damage=function(i,e,t,n,s=4,r="hit",a=null){if(i.dead)return!1;i.hp-=e,i.flash=.25;let o=i.x-t,c=i.z-n,h=Math.hypot(o,c)||1,u=s/Math.sqrt(i.scale)*(i.def.knockMul??1);if(i.posted&&ru(i.crew),i.freezeT>0&&(i.freezeT=0),i.boss&&l.Boss&&l.Boss.onHit(i,e),i.vx+=o/h*u,i.vz+=c/h*u,r!=="oc"&&l.FX.blood(i.x,1.2*i.scale,i.z,o/h,c/h,i.hp<=0?16:5),i.hp<=0){i.dead=!0,i.swing=0,i.vx*=1.8,i.vz*=1.8,s>=8&&!i.boss&&(i.vy=l.rand(3.5,6.5)/Math.sqrt(i.scale),i.spin=l.rand(-9,9)),i.boss?l.Boss&&l.Boss.onDeath(i):l.Loot&&l.Loot.maybeDrop(i.x,i.z,i.type==="big"||i.type==="cholo"?.03:.012),i.yaw=Math.atan2(-o,-c),Math.random()<.45&&l.FX.teeth(i.x,1.5,i.z);let d=s>=12||r==="nade"||r==="hammer"||r==="buck";l.FX.knockout(i.x,i.z,o/h,c/h,d,i.suit||16742938),l.FX.dismember(i,o/h,c/h,d),a&&a.bloodUp&&a.bloodUp(i.x,i.z),l.goreStreak&&l.goreStreak(i.x,i.z),Math.random()<.5?Go(i,.6):Math.random()<.35&&gn(i,Kh,"#ffd0a0"),l.S.kills++,l.onKill&&l.onKill(),a&&(a.kills++,a.score+=Math.round(i.def.score*l.diff().score*(l.S.comboMul||1)),l.streakKill&&l.streakKill(a,i),l.onKillBy&&l.onKillBy(a,r),a.ot!==void 0&&!(a.otT>0)&&(a.ot=Math.min(100,a.ot+3.5))),l.dropLoot&&l.dropLoot(i.x,i.z),i.bf&&(a&&(a.score+=250),l.FX.float(i.x,3,i.z,"LOVE IS DEAD +250","#ff5ab0",24,2));let f=0;for(let p of ht.list)p.dead&&f++;if(f>80){let p=ht.list.findIndex(y=>y.dead);p>=0&&ht.list.splice(p,1)}return!0}return r==="oc"?Go(i,.02):Math.random()<.12&&Go(i,.6),r!=="oc"&&Math.random()<.08&&gn(i,i.def.diva?["Not the FACE!","You chipped my nail!","Rude!"]:Kh,"#ffd0a0"),!1};var sa=new L;function Vn(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;sa.copy(e),sa[n]=0,sa.normalize();let h=.5*a/(a+o),u=1-sa.angleTo(i)/c;return Math.sign(sa[t])===1?u*h:o/(a+o)+h+h*(1-u)}var Dn=class extends Te{constructor(e=1,t=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let o=new L,c=new L,h=new L(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,y=new L,x=.5/s;for(let g=0,m=0;g<u.length;g+=3,m+=2)switch(o.fromArray(u,g),c.copy(o),c.x-=Math.sign(c.x)*x,c.y-=Math.sign(c.y)*x,c.z-=Math.sign(c.z)*x,c.normalize(),u[g+0]=h.x*Math.sign(o.x)+c.x*r,u[g+1]=h.y*Math.sign(o.y)+c.y*r,u[g+2]=h.z*Math.sign(o.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/p)){case 0:y.set(1,0,0),f[m+0]=Vn(y,c,"z","y",r,n),f[m+1]=1-Vn(y,c,"y","z",r,t);break;case 1:y.set(-1,0,0),f[m+0]=1-Vn(y,c,"z","y",r,n),f[m+1]=1-Vn(y,c,"y","z",r,t);break;case 2:y.set(0,1,0),f[m+0]=1-Vn(y,c,"x","z",r,e),f[m+1]=Vn(y,c,"z","x",r,n);break;case 3:y.set(0,-1,0),f[m+0]=1-Vn(y,c,"x","z",r,e),f[m+1]=1-Vn(y,c,"z","x",r,n);break;case 4:y.set(0,0,1),f[m+0]=1-Vn(y,c,"x","y",r,e),f[m+1]=1-Vn(y,c,"y","x",r,t);break;case 5:y.set(0,0,-1),f[m+0]=Vn(y,c,"x","y",r,e),f[m+1]=1-Vn(y,c,"y","x",r,t);break}}};var pp=[15845285,14724229,13011550,11037509,9065782,7028519,5188892],mp=[1709072,2825492,4861984,1118481,7031338,9079434];l.SKIN=pp;l.HAIR=mp;function lu(i,e){let t=i.attributes.position,n=t.count,s=new Float32Array(n*3);i.computeBoundingBox();let{min:r,max:a}=i.boundingBox;for(let o=0;o<n;o++){let c=(t.getY(o)-r.y)/(a.y-r.y||1),[h,u,d]=e(c,t.getX(o),t.getZ(o));s[o*3]=h,s[o*3+1]=u,s[o*3+2]=d}return i.setAttribute("color",new Ft(s,3)),i}var ra=i=>Hh(jr(i.map(e=>e.index?e.toNonIndexed():e))),aa=(i,e=1)=>lu(i,()=>[e,e,e]),ws=(i,e=.82)=>lu(i,t=>{let n=e+t*(1-e);return[n,n,n]}),au=(i,e,t=10)=>new tn(i,e-i*2,t>8?4:2,t).translate(0,-e/2,0),k1=(i,e,t)=>{let n=i.attributes.uv;for(let s=0;s<n.count;s++)n.setXY(s,e,t);return i},gp=[4033535,16731469,4054148,16763197];l.PCOLORS=gp;function Yo(i={}){let e=i.gender==="female",t=i.gender==="they",n=i.rank==="sgt",s=i.uniform??2376318,r=1518162,a=i.skin??l.pick(pp),o=i.hair??l.pick(mp),c=(J,oe=.7,ge=0)=>new Ae({color:J,roughness:oe,metalness:ge}),h={uni:c(s,.75),dark:c(r),skin:c(a,.55),hair:c(o,.7),black:c(1118481,.35,.2),gold:new Ae({color:16765773,emissive:5913600,roughness:.25,metalness:1}),steel:c(13225684,.25,1),vest:c(1777449,.8),red:c(13116444,.4),boots:c(1118481,.35,.2),pants:c(s,.75),print:new Ae({map:Ef(i.back||"CORRECTIONS"),roughness:.8})};for(let J of["uni","dark","skin","hair","vest","pants","boots"])cu(h[J]);let u=(J,oe,ge=0,Re=0,$=0)=>{let ae=new ce(J,oe);return ae.position.set(ge,Re,$),ae.castShadow=!0,ae.receiveShadow=!0,ae},d=e?.9:t?.95:1,f=new ot,p=new ot;f.add(p),p.add(u(new Dn(.52*d,.64,.3,2,.08),h.uni,0,1.08,0)),p.add(u(new Dn(.57*d,.46,.35,2,.06),h.vest,0,1.12,0));let y=u(new Pt(.5*d,.13),h.print,0,1.2,-.178);y.rotation.y=Math.PI,p.add(y),p.add(u(new Dn(.52*(e?1.04:1),.11,.33,2,.03),h.black,0,.8,0)),p.add(u(new Te(.09,.07,.02),h.gold,0,.8,.17)),p.add(u(new Je(.045,.045,.012,6),h.gold,-.14*d,1.27,.18).rotateX(Math.PI/2)),p.add(u(new Te(.08,.15,.07),h.black,.27,.8,.05)),p.add(u(new Te(.06,.08,.04),h.black,.16*d,1.34,.17)),p.add(u(new Je(.04,.04,.17,10),h.red,-.27,.8,.05)),p.add(u(new nn(.05,.012,6,12),h.steel,.2,.72,.12)),i.belly&&(p.add(u(new vt(.24,22,16).scale(1,.95,1.15),h.uni,0,.96,.15)),p.add(u(new vt(.02,8,6),h.uni,0,.97,.43))),i.lanyard&&(p.add(u(new nn(.15,.008,4,20,Math.PI).rotateZ(Math.PI),h.red,0,1.4,.18)),p.add(u(new Te(.08,.11,.01),h.steel,0,1.2,i.belly?.36:.19))),p.add(u(new Je(.075,.08,.12,10),h.skin,0,1.43,0));let x=new ot;x.position.set(0,1.58,0),p.add(x),x.add(u(new vt(.165,20,16),h.skin)),x.add(u(new Dn(.24,.055,.04,1,.015),h.black,0,.02,.15)),e?(x.add(u(new vt(.175,16,10,0,Math.PI*2,0,Math.PI/1.9),h.hair,0,.02,-.01)),x.add(u(new vt(.085,12,8),h.hair,0,.04,-.19)),x.add(u(new tn(.045,.2,4,8),h.hair,0,-.14,-.2))):(t&&(x.add(u(new vt(.178,16,10,0,Math.PI*2,0,Math.PI/1.65),h.hair,0,0,-.01)),[-.15,.15].forEach(J=>x.add(u(new tn(.04,.12,3,8),h.hair,J,-.08,-.02)))),x.add(u(new Je(.175,.18,.1,18),h.dark,0,.12,0)),x.add(u(new Dn(.26,.03,.17,1,.012),h.dark,0,.08,.16)));let g=(J,oe,ge,Re)=>{let $=new ot;return $.add(u(new Je(J,oe,ge,14,1).translate(0,-ge/2,0),Re)),$.add(u(new vt(J,14,10),Re)),$.add(u(new vt(oe,12,8),Re,0,-ge,0)),$},m=J=>{let oe=new ot;oe.position.set(J*.33*d,1.33,0),oe.add(u(new vt(.105*d+.01,16,12).scale(1,.85,1),h.uni,0,.01,0));let ge=g(.088,.074,.29,h.uni);oe.add(ge);let Re=new ot;Re.position.y=-.29,ge.add(Re);let $=g(.068,.054,.26,h.skin);Re.add($);let ae=new ot;return ae.position.y=-.27,$.add(ae),ae.add(u(new Dn(.09,.12,.06,2,.025),h.skin,0,-.05,.005)),ae.add(u(new tn(.022,.05,2,6),h.skin,J*-.045,-.03,.03).rotateZ(J*.6)),p.add(oe),{shoulder:oe,elbow:Re,hand:ae,upper:ge}},v=m(-1),b=m(1),w=v.shoulder,D=b.shoulder;n&&[v.upper,b.upper].forEach(J=>[0,1,2].forEach(oe=>{let ge=u(new Te(.19,.02,.19),h.gold,0,-.08-oe*.04,0);ge.rotation.z=.25,J.add(ge)}));let A=u(new Je(.028,.034,.64,10),h.black,0,-.07,.25);A.rotation.x=Math.PI/2,b.hand.add(A);let I=new ot;I.visible=!1,I.rotation.x=Math.PI/2,I.position.set(0,-.06,.02),b.hand.add(I);let R=xp(u,h);for(let J in R)R[J].visible=J==="pepperball",I.add(R[J]);let E=new ut({color:16765562,map:ko(),transparent:!0,blending:hn,depthWrite:!1,toneMapped:!1,side:Nt}),_=new ot;_.visible=!1,I.add(_);for(let J=0;J<2;J++){let oe=new ce(new Pt(.34,.6),E);oe.rotation.set(Math.PI/2,0,J*Math.PI/2),oe.position.z=.22,_.add(oe)}let P=new ce(new Hr(.16,10),E);_.add(P);let U=J=>{let oe=new ot;oe.position.set(J*.13,.8,0);let ge=g(.105,.088,.4,h.pants);oe.add(ge);let Re=new ot;Re.position.y=-.4,ge.add(Re);let $=g(.085,.072,.31,h.pants);return Re.add($),$.add(u(new Dn(.19,.13,.31,2,.045),h.boots,0,-.35,.05)),p.add(oe),{hip:oe,knee:Re}},O=U(-1),H=U(1),K=O.hip,V=H.hip,se=new ce(new si(.5,.62,32),new ut({color:i.ringColor??gp[i.slot||0],transparent:!0,opacity:.85,toneMapped:!1}));se.rotation.x=-Math.PI/2,se.position.y=.03,f.add(se);let Y=new ce(vp,yp());Y.scale.set(1.25,1,1.25),Y.position.y=.025,Y.renderOrder=1,f.add(Y),i.scale&&f.scale.setScalar(i.scale);let ne={root:f,body:p,head:x,armL:w,armR:D,legL:K,legR:V,elbowL:v.elbow,elbowR:b.elbow,kneeL:O.knee,kneeR:H.knee,baton:A,gun:I,guns:R,flash:_,ring:se,M:h,phase:0,j:{},gunKey:"pepperball",flashT:0};return ne.setGun=J=>{!R[J]||ne.gunKey===J||(R[ne.gunKey].visible=!1,R[J].visible=!0,ne.gunKey=J)},ne.fire=J=>{let oe=R[ne.gunKey];_.position.set(0,oe.userData.my??-.03,oe.userData.muzzle),_.rotation.z=Math.random()*Math.PI,_.scale.setScalar((J?1.5:1)*l.rand(.85,1.15)),_.visible=!0,ne.flashT=J?.07:.045,oe.userData.spin&&(oe.userData.spinV=40)},ne.tickGun=J=>{ne.flashT>0&&(ne.flashT-=J)<=0&&(_.visible=!1);let oe=R[ne.gunKey];oe.userData.spin&&(oe.userData.spinV=Math.max(0,(oe.userData.spinV||0)-J*30),oe.userData.spin.rotation.z+=oe.userData.spinV*J)},ne}l.gunModel=i=>{let t=xp((n,s,r=0,a=0,o=0)=>{let c=new ce(n,s);return c.position.set(r,a,o),c.castShadow=!0,c},null);return t[i]||t.pepperball};var ou={};function xp(i,e){let t=(d,f=.5,p=.2,y)=>new Ae({color:d,roughness:f,metalness:p,emissive:y||0,emissiveIntensity:y?1.4:0}),n=ou.ready?ou:Object.assign(ou,{ready:!0,poly:t(1842722,.55,.1),metal:t(2829875,.3,.85),steel:t(10133928,.22,1),orange:t(16742938,.45,.05),yellow:t(16765466,.45,.05),wood:t(7029542,.6,0),tan:t(11901546,.7,0),lens:t(2780415,.05,.6,666248),cyan:t(8382719,.3,.3,1739424),pink:t(16734896,.4,.2,8395344)}),s=(d,f,p,y,x,g,m,v=.012)=>i(new Dn(d,f,p,1,v),y,x,g,m),r=(d,f,p,y,x,g,m=12)=>i(new Je(d,d,f,m).rotateX(Math.PI/2),p,y,x,g),a=(d,f)=>{let p=new ot;return p.userData.muzzle=d,p.userData.my=f,p.scale.setScalar(1.25),p},o=(d,f=.08)=>d.add(s(.05,.15,.06,n.poly,0,-.15,f)),c={},h=c.pepperball=a(.62);h.add(s(.08,.12,.44,n.poly,0,-.05,.18)),o(h),h.add(r(.022,.26,n.metal,0,-.03,.48)),h.add(i(new vt(.09,14,10).scale(1,.85,1.25),n.orange,0,.08,.16)),h.add(s(.07,.07,.2,n.poly,0,-.06,-.14)),h=c.launcher=a(.6),h.add(r(.06,.4,n.metal,0,-.02,.38,16)),h.add(r(.064,.05,n.yellow,0,-.02,.52,16)),h.add(r(.1,.16,n.poly,0,-.04,.12,6)),o(h,0),h.add(s(.06,.08,.24,n.poly,0,-.06,-.16)),h.add(s(.03,.14,.04,n.poly,0,-.12,.3)),h=c.shotgun=a(.82),h.add(s(.07,.11,.3,n.metal,0,-.04,.1)),o(h,.02),h.add(r(.024,.58,n.metal,0,-.01,.52)),h.add(r(.02,.46,n.metal,0,-.06,.45)),h.add(s(.07,.07,.17,n.wood,0,-.06,.38,.025)),h.add(s(.06,.1,.3,n.wood,0,-.08,-.18,.025)),h=c.ar=a(.8),h.add(s(.06,.1,.32,n.metal,0,-.03,.1)),o(h,0),h.add(s(.07,.07,.3,n.poly,0,-.03,.4)),h.add(r(.014,.18,n.metal,0,-.03,.62)),h.add(s(.045,.16,.07,n.metal,0,-.15,.14).rotateX(.18)),h.add(r(.03,.09,n.poly,0,.06,.12)),h.add(i(new Hr(.024,12),n.lens,0,.06,.166)),h.add(s(.05,.09,.2,n.poly,0,-.06,-.16)),h.add(r(.016,.14,n.metal,0,-.02,-.06)),h=c.minigun=a(.86,-.02);let u=new ot;u.position.set(0,-.02,.5),h.add(u),h.userData.spin=u;for(let d=0;d<6;d++){let f=d/6*Math.PI*2;u.add(r(.016,.62,n.steel,Math.cos(f)*.045,Math.sin(f)*.045,.05,8))}u.add(r(.07,.04,n.metal,0,0,-.12)),u.add(r(.07,.04,n.metal,0,0,.22)),h.add(s(.15,.15,.3,n.metal,0,-.03,.08)),h.add(s(.12,.13,.17,n.tan,-.13,-.08,.05)),h.add(s(.03,.08,.16,n.poly,0,.09,.08)),o(h,-.04),h=c.drum=a(.7),h.add(s(.08,.13,.36,n.poly,0,-.03,.14)),o(h,-.02),h.add(r(.03,.34,n.metal,0,-.01,.46)),h.add(i(new Je(.11,.11,.07,18).rotateZ(Math.PI/2),n.metal,0,-.15,.16)),h.add(s(.06,.09,.22,n.poly,0,-.06,-.17)),h=c.cannon=a(.78),h.add(r(.075,.5,n.metal,0,-.02,.42,16));for(let d=0;d<4;d++)h.add(r(.08,.025,n.cyan,0,-.02,.26+d*.08,16));return h.add(s(.14,.16,.28,n.poly,0,-.05,.06)),o(h,-.02),h.add(s(.1,.1,.14,n.tan,-.12,-.09,.04)),h=c.taser=a(.42),h.add(s(.07,.11,.26,n.yellow,0,-.04,.12)),o(h,.02),h.add(s(.09,.09,.08,n.poly,0,-.03,.3)),h.add(i(new nn(.04,.012,6,14),n.pink,0,-.03,.36)),c}function Wn(i,e,t,n,s,r){i.phase+=e*10*Math.max(t,1e-4),i.t=(i.t||0)+e;let a=i.j||(i.j={}),o=(f,p,y,x,g=14)=>{let m=a[f]??x,v=m+(x-m)*Math.min(1,e*g);a[f]=v,p.rotation[y]=v},c=i.phase,h=Math.sin(c)*t,u=Math.cos(c);o("hL",i.legL,"x",h*.65),o("hR",i.legR,"x",-h*.65),i.kneeL&&(o("kL",i.kneeL,"x",(.15+Math.max(0,-Math.sin(c-.6))*1)*t,18),o("kR",i.kneeR,"x",(.15+Math.max(0,Math.sin(c-.6))*1)*t,18));let d=Math.sin(i.t*2.2)*.03;if(n>0){let f=Math.sin(n*Math.PI);o("aR",i.armR,"x",-2.5+n*3.1,30),o("aRz",i.armR,"z",-.35,30),i.elbowR&&o("eR",i.elbowR,"x",-.9*(1-n)-.1*f,30)}else s?(o("aR",i.armR,"x",-1.45,18),o("aRz",i.armR,"z",-.12,18),i.elbowR&&o("eR",i.elbowR,"x",-.15,18)):(o("aR",i.armR,"x",-h*.55+.05+d,10),o("aRz",i.armR,"z",.1,10),i.elbowR&&o("eR",i.elbowR,"x",-.25-Math.max(0,-h)*.6-t*.15,10));i.holdL?(o("aL",i.armL,"x",-1.1,12),o("aLz",i.armL,"z",.25,12),i.elbowL&&o("eL",i.elbowL,"x",-1.2,12)):s&&n<=0?(o("aL",i.armL,"x",-1.3,18),o("aLz",i.armL,"z",.45,18),i.elbowL&&o("eL",i.elbowL,"x",-.55,18)):(o("aL",i.armL,"x",h*.55+.05+d,10),o("aLz",i.armL,"z",-.1,10),i.elbowL&&o("eL",i.elbowL,"x",-.25-Math.max(0,h)*.6-t*.15,10)),i.gun&&(i.gun.visible=!!s&&n<=0,i.baton.visible=!i.gun.visible),i.body.position.y=Math.abs(Math.sin(c))*.045*t+(r?.2*r:0),o("bx",i.body,"x",r?-Math.PI/2*r:t*.1+(s?.04:0),10),o("by",i.body,"y",u*.07*t,10),i.head&&o("hy",i.head,"y",-u*.05*t,10)}function U1(i){let e=i.attributes.uv,t=i.attributes.normal;for(let n=0;n<e.count;n++){let s=t.getZ(n),r=e.getX(n),a=e.getY(n);s<-.6?e.setXY(n,.27+r*.46,.1+a*.8):s>.6?e.setXY(n,.79+r*.18,.12+a*.8):e.setXY(n,.05,.5)}return i}function O1(){let i=lu(au(.1,.8,7),x=>x<.14?[.12,.12,.12]:[.95,.95,.95]),e=ws(ra([au(.068,.54,6),new vt(.072,6,4).translate(0,-.56,0)])),t=ws(au(.082,.24,6)),n=ws(U1(Hh(new Dn(.5,.64,.3,1,.08))),.85),s=k1(new Je(.075,.08,.14,6,1,!0).translate(0,-.17,0),.75/dr,.3),r=ws(ra([new vt(.165,12,9),s]),.9),a=aa(new vt(.175,10,5,0,Math.PI*2,0,Math.PI/2.2)),o=ws(new vt(.18,10,5,0,Math.PI*2,0,Math.PI/2).scale(1,1.25,1),.7),c=aa(ra([new vt(.178,10,5,0,Math.PI*2,0,Math.PI/2.1),new Dn(.08,.06,.12,1,.02).translate(0,.02,-.19)])),h=aa(new tn(.05,.28,2,6).translate(0,-.18,-.17)),u=aa(new Te(.045,.34,.06).translate(0,-.12,0)),d=x=>new nn(.3,.035,6,18).rotateY(Math.PI/2).translate(x,.3,-.05),f=ws(ra([new Te(.48,.06,.46).translate(0,.46,0),new Te(.48,.46,.05).translate(0,.72,-.24),d(-.3),d(.3),new nn(.25,.015,4,14).rotateY(Math.PI/2).translate(-.34,.3,-.05),new nn(.25,.015,4,14).rotateY(Math.PI/2).translate(.34,.3,-.05),new Je(.07,.07,.04,8).rotateZ(Math.PI/2).translate(-.2,.07,.3),new Je(.07,.07,.04,8).rotateZ(Math.PI/2).translate(.2,.07,.3),new Te(.03,.42,.03).translate(-.2,.26,.26),new Te(.03,.42,.03).translate(.2,.26,.26),new Te(.4,.03,.12).translate(0,.1,.42)]),.6),p=ws(ra([new Te(.04,1.15,.04).translate(0,-.2,0),new Te(.06,.05,.2).translate(0,.38,0),new Te(.05,.04,.12).translate(0,0,.04)]),.7),y=aa(new Je(.125,.135,.42,8).translate(0,-.55,0),1);return[{key:"torso",geo:n,piv:[0,1.08,0],col:"suit",map:"suit"},{key:"head",geo:r,piv:[0,1.57,0],col:"skin",map:"face"},{key:"hair",geo:a,piv:[0,1.59,0],col:"hair",show:x=>x.style===1||x.style===4},{key:"beanie",geo:o,piv:[0,1.6,0],col:"hat",show:x=>x.style===2},{key:"bandana",geo:c,piv:[0,1.59,0],col:"hat",show:x=>x.style===3},{key:"tail",geo:h,piv:[0,1.6,0],col:"hair",show:x=>x.style===4},{key:"armL",geo:e,piv:[-.33,1.34,0],col:"skin",joint:"armL"},{key:"armR",geo:e,piv:[.33,1.34,0],col:"skin",joint:"armR"},{key:"sleeveL",geo:t,piv:[-.33,1.36,0],col:"suit",joint:"armL",show:x=>!x.shirtless},{key:"sleeveR",geo:t,piv:[.33,1.36,0],col:"suit",joint:"armR",show:x=>!x.shirtless},{key:"legL",geo:i,piv:[-.12,.8,0],col:"suit",joint:"legL"},{key:"legR",geo:i,piv:[.12,.8,0],col:"suit",joint:"legR"},{key:"chair",geo:f,piv:[0,.32,0],fixed:4212302,show:x=>!!x.def.wheel,sit:!0},{key:"crutch",geo:p,piv:[.33,1.34,0],fixed:12041927,joint:"armR",hand:[0,-.58,.06],show:x=>!!x.def.crutch&&!x.noCrutch},{key:"cast",geo:y,piv:[-.12,.8,0],fixed:15987178,joint:"legL",show:x=>!!x.def.crutch},{key:"item",geo:u,piv:[.33,1.34,0],col:"item",joint:"armR",hand:[0,-.58,.06],show:x=>!!x.itemCol}]}var z1=`#include <emissivemap_fragment>
  { float fr = 1.0 - saturate(dot(normal, normalize(vViewPosition)));
    totalEmissiveRadiance += vec3(0.62, 0.72, 0.9) * pow(fr, 3.0) * 0.42; }`;function cu(i){let e=i.onBeforeCompile;i.onBeforeCompile=(n,s)=>{e&&e.call(i,n,s),n.fragmentShader=n.fragmentShader.replace("#include <emissivemap_fragment>",z1)};let t=e?"rim+"+e.toString():"rim";return i.customProgramCacheKey=()=>t,i}l.rim=cu;var Xo=null;function yp(){if(Xo)return Xo;let i=document.createElement("canvas");i.width=i.height=64;let e=i.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(0,0,0,0.85)"),t.addColorStop(.45,"rgba(0,0,0,0.5)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);let n=new Zi(i);return n.colorSpace=Ht,Xo=new ut({map:n,transparent:!0,depthWrite:!1,opacity:.55,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-2}),Xo}var vp=new Pt(1,1).rotateX(-Math.PI/2);function F1(i){let e=new Ae({vertexColors:!0,roughness:.6,map:i});return e.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute float aFace;`).replace("#include <uv_vertex>",`#include <uv_vertex>
 vMapUv.x = (vMapUv.x + aFace) / ${dr}.0;`)},e}var B1={head:"head",hair:"head",beanie:"head",bandana:"head",tail:"head",armL:"armL",sleeveL:"armL",armR:"armR",sleeveR:"armR",crutch:"armR",item:"armR",legL:"legL",cast:"legL",legR:"legR"},qo=class{constructor(e,t){this.max=t;let n=bf(),s=wf();this.parts=O1().map(a=>{let o;a.map==="face"?(a.geo.setAttribute("aFace",new gs(new Float32Array(t),1)),o=F1(n)):o=new Ae({vertexColors:!0,roughness:a.col==="skin"?.55:.78,map:a.map==="suit"?s:null}),cu(o);let c=new un(a.geo,o,t);return c.instanceMatrix.setUsage(_s),c.setColorAt(0,new xe(1,1,1)),c.instanceColor.setUsage(_s),c.castShadow=["torso","head","legL","legR"].includes(a.key),c.receiveShadow=!0,c.frustumCulled=!1,c.count=0,e.add(c),{...a,im:c,face:a.map==="face"?a.geo.attributes.aFace:null}}),this.base=new He,this.joint=new He,this.out=new He,this.q=new Zt,this.e=new Kt(0,0,0,"YXZ"),this.v=new L,this.s=new L,this.c=new xe,this.white=new xe(1,1,1),this.red=new xe(16726826),this.zero=new He().makeScale(0,0,0);let r=(a,o)=>new ut({color:a,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1});this.barBg=new un(new Pt(1,.11),r(0,.6),t),this.barFill=new un(new Pt(1,.08).translate(.5,0,0),r(16777215,.95),t);for(let a of[this.barBg,this.barFill])a.frustumCulled=!1,a.count=0,a.renderOrder=5,a.instanceMatrix.setUsage(_s),e.add(a);this.barFill.setColorAt(0,this.c),this.tmp=new He,this.tmp2=new He,this.one=new L(1,1,1),this.barPos=new L,this.hpHi=new xe(5431386),this.hpLo=new xe(16724e3),this.blob=new un(vp,yp(),t),this.blob.frustumCulled=!1,this.blob.count=0,this.blob.renderOrder=1,this.blob.instanceMatrix.setUsage(_s),e.add(this.blob)}syncBars(e){let t=l.R&&l.R.camera;if(!t)return;let n=0;for(let s=0;s<e.length&&n<this.max;s++){let r=e[s];if(r.dead||r.caged||r.noRender||r.hp>=r.maxHp)continue;let a=Math.max(0,r.hp/r.maxHp);this.barPos.set(r.x,2.05*r.scale+(r.hop||0)-(r.def.wheel?.32:0),r.z),this.out.compose(this.barPos,t.quaternion,this.one),this.tmp.makeScale(.9*r.scale,1,1),this.barBg.setMatrixAt(n,this.tmp.premultiply(this.out)),this.tmp.makeTranslation(-.45*r.scale,0,.01),this.tmp.multiply(this.tmp2.makeScale(Math.max(.001,.9*r.scale*a),1,1)),this.barFill.setMatrixAt(n,this.tmp.premultiply(this.out)),this.c.copy(this.hpLo).lerp(this.hpHi,a),this.barFill.setColorAt(n,this.c),n++}this.barBg.count=this.barFill.count=n,this.barBg.instanceMatrix.needsUpdate=this.barFill.instanceMatrix.needsUpdate=!0,this.barFill.instanceColor&&(this.barFill.instanceColor.needsUpdate=!0)}sync(e){let t=Math.min(e.length,this.max),{base:n,joint:s,out:r,q:a,e:o,v:c,s:h,c:u}=this;for(let d=0;d<t;d++){let f=e[d];if(f.noRender){for(let g of this.parts)g.im.setMatrixAt(d,this.zero);this.blob.setMatrixAt(d,this.zero);continue}{let g=f.fall||0,m=f.scale*(f.wide||1)*1.15/(1+(f.hop||0)*.8);this.tmp.makeRotationY(f.yaw),this.tmp.scale(this.s.set(m,1,m*(1+g*1.6))),this.tmp.setPosition(f.x+Math.sin(f.yaw)*-g*.7*f.scale,.02,f.z+Math.cos(f.yaw)*-g*.7*f.scale),this.blob.setMatrixAt(d,this.tmp)}o.set(-(f.fall||0)*Math.PI/2+(f.tumble||0),f.yaw,0,"YXZ"),a.setFromEuler(o);let p=f.def.wheel&&!f.dead?.32:0;c.set(f.x,(f.fall||0)*.17*f.scale+(f.hop||0)-p*f.scale,f.z),h.set(f.scale*(f.wide||1),f.scale,f.scale*(f.wide||1)),n.compose(c,a,h);let y=Math.sin(f.phase)*.8*f.move,x=f.swing>0?Math.sin(f.swing*Math.PI):0;for(let g of this.parts){if(g.show&&!g.show(f)){g.im.setMatrixAt(d,this.zero);continue}if(f.lost&&f.lost[B1[g.key]]){g.im.setMatrixAt(d,this.zero);continue}let m=0,v=0;if(p&&(g.joint==="legL"||g.joint==="legR")?m=-1.35:g.joint==="legL"?m=f.def.crutch?-.5:y:g.joint==="legR"?m=-y:g.joint==="armL"?(m=-y*.9-(f.flail||0)*2.5,v=-(f.flex||0)*1.2):g.joint==="armR"&&(m=y*.9-x*2.6-(f.windup||0)*2.8,v=x*.5+(f.flex||0)*1.2),o.set(m,0,v,"XYZ"),a.setFromEuler(o),g.sit&&!p){g.im.setMatrixAt(d,this.zero);continue}s.compose(c.set(g.piv[0],g.piv[1],g.piv[2]),a,h.setScalar(1)),g.hand&&(r.makeTranslation(g.hand[0],g.hand[1],g.hand[2]),s.multiply(r)),r.multiplyMatrices(n,s),g.im.setMatrixAt(d,r);let b=g.fixed?g.fixed:g.col==="suit"?f.suit:g.col==="skin"?f.skin:g.col==="hair"?f.hair:g.col==="hat"?f.hat:f.itemCol;u.setHex(b),f.flash>0&&u.lerp(this.white,Math.min(1,f.flash*3)),f.ocT>0&&g.col==="skin"&&u.lerp(this.red,.45),g.im.setColorAt(d,u),g.face&&(g.face.array[d]=f.face)}}this.syncBars(e),this.blob.count=t,this.blob.instanceMatrix.needsUpdate=!0;for(let d of this.parts)d.im.count=t,d.im.instanceMatrix.needsUpdate=!0,d.im.instanceColor.needsUpdate=!0,d.face&&(d.face.needsUpdate=!0)}};var xn=[{key:"green",label:"Uncommon",color:4054106,css:"#3ddc5a",weight:55,mult:1},{key:"blue",label:"Rare",color:4033535,css:"#5aa0ff",weight:28,mult:1.6},{key:"purple",label:"Epic",color:10898943,css:"#b973ff",weight:13,mult:2.3},{key:"orange",label:"Legendary",color:16747034,css:"#ff9a3a",weight:4,mult:3.2}],ci={boots:{label:"Boots",stat:i=>({speed:.04*i}),text:i=>`+${Math.round(i.speed*100)}% speed`,names:[["Payless Patrol Shoes","Velcro Night-Shift Sneakers"],["Steel-Toe Snitch Kickers","Orthopedic Overtime Boots"],["Crocs (Sport Mode)","Tactical Jordans"],["Air Max Overtime","Six-Inch-Lift Boots"]],perk:{text:"Dashing is free",id:"freeDash"}},pants:{label:"Pants",stat:i=>({hp:Math.round(12*i)}),text:i=>`+${i.hp} max health`,names:[["Cargo Pants (17 Pockets)","Hand-Me-Down Slacks"],["Stretchy Taco Pants","Kevlar Khakis"],["Sweatpants of Command","Riot Joggers"],["The Pants of Seniority","Sergeant's Wedding Slacks"]],perk:{text:"Slowly heal over time",id:"regen"}},vest:{label:"Tactical Vest",stat:i=>({armor:.05*i}),text:i=>`-${Math.round(i.armor*100)}% damage taken`,names:[["Expired Stab Vest","Duct-Tape Armor"],["Gas-Proof Poncho","Hi-Vis Mesh of Authority"],["Tactical Fanny Pack Rig","PREA-Compliant Plate Carrier"],["DOC Family Heirloom Vest","Triple-Time Plate Carrier"]],perk:{text:"Anyone who hits you gets pepper-sprayed",id:"spiky"}}};function Zo(i=0){let e=0;for(let a=i;a<xn.length;a++)e+=xn[a].weight;let t=Math.random()*e,n=i;for(let a=i;a<xn.length;a++)if(t-=xn[a].weight,t<=0){n=a;break}let s=l.pick(Object.keys(ci)),r=ci[s];return{slot:s,rarity:n,name:l.pick(r.names[n]),stat:r.stat(xn[n].mult),perk:n===3?r.perk.id:null}}l.rollItem=Zo;var hu=i=>ci[i.slot].text(i.stat)+(i.perk?` \xB7 ${ci[i.slot].perk.text}`:"");function _p(i){let e=i.gear;i.speedMul=1+(e.boots?e.boots.stat.speed:0),i.armor=e.vest?e.vest.stat.armor:0;let t=e.pants?e.pants.stat.hp:0,n=i.maxHp;i.maxHp=100+t,i.hp=Math.min(i.maxHp,i.hp+Math.max(0,i.maxHp-n)),i.perks=new Set(Object.values(e).filter(a=>a&&a.perk).map(a=>a.perk));let s=i.model.M,r=(a,o,c)=>{a.color.setHex(o?l.lerpHex(c,xn[o.rarity].color,.25):c),a.emissive.setHex(o?xn[o.rarity].color:0),a.emissiveIntensity=o?.25+o.rarity*.15:0};r(s.boots,e.boots,1118481),r(s.pants,e.pants,2376318),r(s.vest,e.vest,1777449)}l.lerpHex=(i,e,t)=>new xe(i).lerp(new xe(e),t).getHex();function Mp(i){let e=l.store.get("mo_gear_"+i.name.toLowerCase(),{});i.gear={boots:e.boots||null,pants:e.pants||null,vest:e.vest||null},_p(i)}var H1=i=>l.store.set("mo_gear_"+i.name.toLowerCase(),i.gear),Ci=[],$o={};function G1(i){let e=xn[i.rarity];$o[e.key]||($o[e.key]=new ut({color:e.color,transparent:!0,opacity:.32,blending:hn,depthWrite:!1,toneMapped:!1,side:Nt}));let t=new ot,n=new ce(new Je(.22,.45,7,14,1,!0),$o[e.key]);n.position.y=3.5,t.add(n);let s=new ce(new si(.5,.75,28),$o[e.key]);s.rotation.x=-Math.PI/2,s.position.y=.04,t.add(s);let r=new Ae({color:e.color,emissive:e.color,emissiveIntensity:.9,roughness:.3,metalness:.4}),a=new ot;if(i.slot==="boots")[-.12,.12].forEach(o=>{let c=new ce(new Te(.18,.22,.36),r);c.position.set(o,0,.05),a.add(c)});else if(i.slot==="pants"){[-.1,.1].forEach(c=>{let h=new ce(new tn(.08,.45,2,8),r);h.position.set(c,-.1,0),a.add(h)});let o=new ce(new Te(.38,.12,.18),r);o.position.y=.22,a.add(o)}else{let o=new ce(new Te(.44,.5,.2),r);a.add(o)}return a.position.y=.9,t.add(a),t.userData.item=a,t}var ei={drops:Ci,reset(){for(let i of Ci)l.R.scene.remove(i.mesh);Ci.length=0},spawn(i,e,t){if(Ci.length>=5)return;let n=G1(i);n.position.set(e,0,t),l.R.scene.add(n),Ci.push({it:i,x:e,z:t,mesh:n,t:0});let s=xn[i.rarity];l.FX.float(e,2.6,t,`${s.label.toUpperCase()}: ${i.name}`,s.css,16,2.4),l.audio.play("pickup",.6)},maybeDrop(i,e,t=.012,n=0){Math.random()<t&&ei.spawn(Zo(n),i,e)},update(i,e){for(let t=Ci.length-1;t>=0;t--){let n=Ci[t];n.t+=i,n.mesh.userData.item.rotation.y+=i*1.8,n.mesh.userData.item.position.y=.9+Math.sin(e*2.5+n.x)*.12;for(let s of l.officers)if(!(s.down||(s.x-n.x)**2+(s.z-n.z)**2>1.7)){ei.pickUp(s,n.it),l.R.scene.remove(n.mesh),Ci.splice(t,1);break}}},collectAll(){for(let i of Ci.splice(0)){l.R.scene.remove(i.mesh);let e=l.officers.filter(t=>!t.down).sort((t,n)=>(t.x-i.x)**2+(t.z-i.z)**2-((n.x-i.x)**2+(n.z-i.z)**2))[0]||l.officers[0];e&&ei.pickUp(e,i.it)}},pickUp(i,e){let t=i.gear[e.slot],n=xn[e.rarity];if(!t||e.rarity>t.rarity||e.rarity===t.rarity&&JSON.stringify(e.stat)>JSON.stringify(t.stat))i.gear[e.slot]=e,_p(i),H1(i),l.FX.float(i.x,2.8,i.z,`EQUIPPED: ${e.name}`,n.css,18,2.2),l.toast(`${i.name} equipped ${n.label} ${ci[e.slot].label}: ${e.name} (${hu(e)})`),l.FX.sparks(i.x,1,i.z,24,n.color),l.audio.play("win",.5);else{let r=25*(e.rarity+1);i.score+=r,l.FX.float(i.x,2.6,i.z,`Sold to commissary +${r}`,"#cfcfcf",14,1.6),l.audio.play("pickup",.6)}}};l.Loot=ei;var et={balls:[],pickups:[],hazards:[],nades:[]};l.C=et;l.officers=[];var Tt=[],yn={launcher:{label:"40mm Less-Lethal",rate:2.2,dmg:60,speed:30,knock:17,sting:.8,pellets:1,spread:.02,life:.9,color:10477823,size:.2,sound:"thoomp",kick:.2},pepperball:{label:"Pepperball",rate:8,dmg:21,speed:34,knock:3,sting:.35,pellets:1,spread:.04,life:.9,color:16751146,size:.11,sound:"pop"},shotgun:{label:"Shotgun",rate:1.7,dmg:17,speed:38,knock:9,sting:0,pellets:8,spread:.32,life:.32,color:16769162,size:.07,sound:"shotgun",kick:.35},ar:{label:"AR-15",rate:11,dmg:34,speed:55,knock:4,sting:0,pellets:1,spread:.035,life:.7,color:16773808,size:.07,sound:"rifle",kick:.08},minigun:{label:"MINIGUN",rate:26,dmg:32,speed:62,knock:5,sting:0,pellets:1,spread:.09,life:.6,color:16756800,size:.09,sound:"rifle",kick:.03,power:!0,line:"BRRRRRRT. Payroll can bill me."},drum:{label:"DRUM SHOTGUN",rate:5,dmg:22,speed:40,knock:12,sting:0,pellets:10,spread:.4,life:.36,color:16738874,size:.09,sound:"shotgun",kick:.15,power:!0,line:"Twenty rounds of NOPE."},cannon:{label:"40MM AUTO",rate:6,dmg:80,speed:34,knock:22,sting:1,pellets:1,spread:.05,life:.9,color:8382719,size:.24,sound:"thoomp",kick:.12,power:!0,line:"Full auto less-lethal. Very much lethal."}};yn.taser={label:"CHAIN TASER",rate:3.2,dmg:40,range:11,jumps:6,jumpR:4.5,stun:2.4,sound:"zap",kick:.05,power:!0,chain:!0,color:10479871,pellets:1,size:.1,line:"RIDE THE LIGHTNING. Six at a time."};var V1=["minigun","drum","cannon","taser"],W1=new xe(4851206),bp={shotgun:13116444,drum:13116444,ar:14200906,minigun:14200906,cannon:10462893},Jo=[{name:"Standard",mul:1},{name:"+P ROUNDS",mul:1.3},{name:"HOT LOADS",mul:1.65},{name:"DEPLETED DOC",mul:2.1}],Ii={oc:{label:"Orange OC",range:6.5,cone:.45,dps:30,blind:3.2,drain:22,puff:.25},vapor:{label:"OC Vapor",range:8.5,cone:.7,dps:34,blind:4.5,drain:26,puff:.5,linger:!0}},fi=[{at:0,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"oc",nades:!1},{at:20,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"vapor",nades:!1,news:"OC Vapor issued. It hangs in the air. Do NOT walk into your own cloud."},{at:45,rank:"SGT.",title:"Sergeant",gun:"launcher",spray:"vapor",nades:!1,news:"Congrats, Sgt. {hero}. Here is a 40mm less-lethal launcher. Still no raise."},{at:85,rank:"SGT.",title:"Sergeant",gun:"shotgun",spray:"vapor",nades:!1,news:"Armory approved the shotgun. Sign here, here, and here."},{at:130,rank:"LT.",title:"Lieutenant",gun:"ar",spray:"vapor",nades:!0,news:"Lieutenant {hero}! AR-15 and grenades approved. Please do not grenade the PREA poster."}],hi={time:12,hurtGain:.6,swing:.32,range:3.4,dmg:9999,bossDmg:260,knock:19,sprint:1.4,sprintDrain:16};l.coPower=l.coPower||function(i){};var ji={cd:5,fuse:.8,radius:4.6,dmg:140,knock:15},ui={gun:yn.pepperball,spray:Ii.oc,baton:{range:2.4,arc:1.15,dmg:48,knock:11,time:.28,cd:.42},dash:{speed:21,time:.18,cost:22,dmg:10,knock:9},move:6.2},oa=class{constructor(e,t,n,s){this.slot=e,this.name=l.cleanName(t),this.gender=n,this.device=s,this.model=Yo({gender:n,slot:e}),l.R.scene.add(this.model.root),this.x=0,this.z=0,this.r=.42,this.yaw=0,this.ax=0,this.az=1,this.reset(),Mp(this)}reset(){this.hp=this.maxHp=100+(this.gear&&this.gear.pants?this.gear.pants.stat.hp:0),this.energy=100,this.down=!1,this.reviveT=0,this.fireCD=0,this.swingT=0,this.swingCD=0,this.dashT=0,this.iframes=0,this.slowT=0,this.tacoT=0,this.drinkT=0,this.hurtT=0,this.tauntT=3,this.sprayT=0,this.spraying=!1,this.kills=0,this.score=0,this.move=0,this.kvx=0,this.kvz=0,this.ot=this.ot||0,this.otT=0,this.otSwingT=0,this.sprinting=!1,this.hammer&&(this.hammer.visible=!1,this.model.root.scale.setScalar(1)),this.blood=0,this.feetT=0,this.paintBlood&&this.paintBlood()}remove(){l.R.scene.remove(this.model.root)}bloodUp(e,t){if(!l.settings.gore||(e-this.x)**2+(t-this.z)**2>16)return;let n=this.model.M;this.cleanCols||(this.cleanCols={uni:n.uni.color.clone(),pants:n.pants.color.clone(),vest:n.vest.color.clone()}),this.blood=Math.min(1,(this.blood||0)+(l.goreMax()?.05:.025)),this.paintBlood()}paintBlood(){let e=this.model.M,t=this.blood||0;if(this.cleanCols)for(let n of["uni","pants","vest"])e[n].color.copy(this.cleanCols[n]).lerp(W1,t*(n==="vest"?.45:.6))}hurt(e,t,n,s,r=3){if(this.down||this.iframes>0)return;if(e*=(1-(this.armor||0))*l.diff().dmg*(l.S.endlessDmg||1),l.streakHit&&l.streakHit(this),l.onHurt&&l.onHurt(this,e,t,n,s),this.perks&&this.perks.has("spiky")){l.grid.query(t,n,1.2,Tt);for(let h of Tt)h.dead||(h.ocT=Math.max(h.ocT,2.5))}this.otT>0?e*=.4:this.ot=Math.min(100,(this.ot||0)+e*hi.hurtGain),this.hp-=e,this.hurtT=.35;let a=this.x-t,o=this.z-n,c=Math.hypot(a,o)||1;this.kvx+=a/c*r,this.kvz+=o/c*r,l.R.shake=Math.min(.6,l.R.shake+e*.02),l.R.split=Math.min(1,l.R.split+e*.06),l.audio.play("hurt",.7),s!=="spit"&&s!=="cup"&&l.FX.blood(this.x,1.3,this.z,a/c,o/c,4),this.hp<=0&&(this.hp=0,this.down=!0,l.streakBreak&&l.streakBreak("DOWN"),l.onDown&&l.onDown(this,t,n,s),l.FX.float(this.x,2.5,this.z,`${this.name} IS DOWN!`,"#ff5050",20,2.5),l.audio.play("alarm",1))}update(e){let t=this.model,n=this.device.read(this);if(this.iframes=Math.max(0,this.iframes-e),this.hurtT=Math.max(0,this.hurtT-e),this.tacoT=Math.max(0,this.tacoT-e),this.drinkT=Math.max(0,this.drinkT-e),this.zynT=Math.max(0,(this.zynT||0)-e),this.slowT=Math.max(0,this.slowT-e),this.rallyT=Math.max(0,(this.rallyT||0)-e),this.fireCD-=e,this.swingCD-=e,this.tauntT-=e,this.nadeCD=(this.nadeCD||0)-e,this.down){Wn(t,e,0,0,!1,1),t.root.position.set(this.x,0,this.z);return}this.perks&&this.perks.has("regen")&&(this.hp=Math.min(this.maxHp,this.hp+2*e)),this.sprinting=!!n.sprint&&this.energy>1&&Math.hypot(n.mx,n.mz)>.2&&!(this.otT>0),this.sprinting&&(this.energy=Math.max(0,this.energy-hi.sprintDrain*e)),n.ot&&this.ot>=100&&!(this.otT>0)&&this.startOT(),this.otT>0&&(this.otT-=e,this.otSwingT-=e,this.otSwingT<=0&&(this.otSwingT=hi.swing,this.swingT=.001,this.hitDone=!1,l.audio.play("swing",1)),this.otT<=0&&this.endOT());let s=ui.move*(this.speedMul||1)*(this.sprinting?hi.sprint:1)*(this.otT>0?1.15:1)*(this.drinkT>0?1.3:1)*(this.slowT>0?.6:1)*(this.spraying?.75:1),r=n.mx,a=n.mz,o=Math.hypot(r,a);if(o>1&&(r/=o,a/=o),this.dashT>0){this.dashT-=e,r=this.dashX,a=this.dashZ,s=ui.dash.speed,l.grid.query(this.x,this.z,1.3,Tt);for(let h of Tt)!h.dead&&!h.dashHit&&(h.dashHit=!0,l.AI.damage(h,ui.dash.dmg*this.dmgMul(),this.x,this.z,ui.dash.knock,"dash",this))}else if(n.dash&&this.energy>=ui.dash.cost&&o>.2){this.perks&&this.perks.has("freeDash")||(this.energy-=ui.dash.cost),this.dashT=ui.dash.time,this.iframes=.28,this.dashX=r/(o>1?1:o||1),this.dashZ=a/(o>1?1:o||1);for(let h of l.AI.list)h.dashHit=!1;l.audio.play("dash")}this.x+=(r*s+this.kvx)*e,this.z+=(a*s+this.kvz)*e;let c=Math.exp(-e*8);if(this.kvx*=c,this.kvz*=c,l.W.collide(this),this.move=l.lerp(this.move,Math.min(1,Math.hypot(r,a)),e*10),n.ax||n.az){let h=Math.hypot(n.ax,n.az);this.ax=n.ax/h,this.az=n.az/h}this.yaw=Math.atan2(this.ax,this.az),this.spraying=n.spray&&this.energy>0,!this.spraying&&!this.sprinting&&(this.energy=Math.min(100,this.energy+e*(this.drinkT>0?30:9))),n.fire&&this.fireCD<=0&&this.swingT<=0&&!this.sprinting&&!(this.otT>0)&&this.shoot(),this.spraying&&this.spray(e),n.nade&&l.S.nades&&this.nadeCD<=0&&this.throwNade(n),n.melee&&this.swingCD<=0&&(this.swingT=.001,this.swingCD=ui.baton.cd,this.hitDone=!1,l.audio.play("swing")),this.swingT>0&&(this.swingT+=e/ui.baton.time,!this.hitDone&&this.swingT>.4&&(this.hitDone=!0,this.baton()),this.swingT>=1&&(this.swingT=0)),t.setGun&&(t.setGun(l.S.power&&l.S.power.key||l.S.gun||"pepperball"),t.tickGun(e)),l.settings.gore&&(this.poolT=(this.poolT||0)-e,this.poolT<=0&&(this.poolT=.2,l.FX.inPool(this.x,this.z)&&(this.feetT=l.goreMax()?7:4)),this.feetT>0&&this.move>.3&&(this.feetT-=e,this.stepT=(this.stepT||0)-e,this.stepT<=0&&(this.stepT=.28,this.stepL=!this.stepL,l.FX.bootprint(this.x,this.z,Math.atan2(this.vx||this.ax,this.vz||this.az),this.stepL)))),Wn(t,e,this.move,this.swingT,n.fire&&!this.sprinting&&!(this.otT>0)||this.spraying,0),this.otT>0&&(t.baton.visible=!1,t.gun.visible=!1,this.hammer.visible=!0),t.root.position.set(this.x,0,this.z),t.root.rotation.y=this.yaw,t.ring.material.opacity=this.iframes>0?.3:.85}startOT(){this.ot=0,this.otT=hi.time,this.otSwingT=0,this.hammer||(this.hammer=j1(this.model)),this.model.root.scale.setScalar(1.3),l.showCard&&l.showCard("MANDATORY OVERTIME",l.pick(J1),!0,2600),l.say&&l.say("SUPERVISOR",l.pick(["You are mandated. Sixteen hours. Have fun.","Congratulations, you just got mandated. Go nuts.","Overtime approved. Payroll is crying. Clean house."]),3.5),l.audio.sting("overtime"),l.audio.music("overtime",!0),l.R.shake=.8,document.body.classList.add("assault","overtime"),l.coPower(this)}endOT(){this.otT=0,this.model.root.scale.setScalar(1),this.hammer&&(this.hammer.visible=!1),l.officers.some(e=>e.otT>0)||(document.body.classList.remove("assault","overtime"),l.levelMusic&&l.levelMusic()),l.FX.float(this.x,3,this.z,l.pick(["Clocked out.","Shift over. Back to normal pay.","OT done. Knees hurt."]),"#ffd24a",18,2)}dmgMul(){return(this.zynT>0?1.35:1)*(this.tacoT>0?1.5:1)*(this.rallyT>0?1.3:1)}flashShoot(){l.R.flashBoost=1;let e=13,t=.3;l.grid.query(this.x,this.z,e,Tt);for(let n of Tt){if(n.dead||n.caged)continue;let s=n.x-this.x,r=n.z-this.z,a=Math.hypot(s,r);a>e||a<.01||Math.acos(l.clamp((s*this.ax+r*this.az)/a,-1,1))>t||l.W.los(this.x,this.z,n.x,n.z)&&(n.ocT=Math.max(n.ocT,1.2),n.flashedT=.3,l.AI.damage(n,(a<5?6:3)*this.dmgMul(),this.x,this.z,.5,"flash",this))}Math.random()<.6&&l.FX.glow.spawn(this.x+this.ax*l.rand(1,9),1.3,this.z+this.az*l.rand(1,9),0,0,0,.12,.3,16773832,0),l.audio.play("beam",.6)}shoot(){let e=l.S.power,t=e&&yn[e.key]||yn[l.S.gun]||yn.pepperball,n=e?0:(l.S.ammo||{})[l.S.gun]||0,s=e?1:Jo[n].mul;l.S.def&&l.S.def.night&&(this.flashShoot(),l.R.muzzle(this.x+this.ax*1.2,this.z+this.az*1.2,t.pellets>1||t.sound==="boom"?1:.6));let a=t.rate*(this.drinkT>0?1.5:1);this.fireCD=1/a;let o=this.ax,c=this.az,h=.985;l.grid.query(this.x,this.z,16,Tt);for(let f of Tt){if(f.dead)continue;let p=f.x-this.x,y=f.z-this.z,x=Math.hypot(p,y)||1,g=(p*this.ax+y*this.az)/x;g>h&&(h=g,o=p/x,c=y/x)}this.model.fire&&this.model.fire(t.pellets>1||t.size>.2);let u=e&&e.key||l.S.gun;if(bp[u]&&l.FX.solid.spawn(this.x+c*.35,1.35,this.z-o*.35,c*l.rand(2,4)+l.rand(-.5,.5),l.rand(2.5,4),-o*l.rand(2,4)+l.rand(-.5,.5),1.4,u==="shotgun"||u==="drum"?.07:.045,bp[u]),t.chain)return this.chainZap(t,o,c,h>.985);let d=t.pellets+(t.pellets>1?n*2:0);for(let f=0;f<d;f++){let p=l.rand(-t.spread,t.spread),y=Math.cos(p),x=Math.sin(p),g=o*y-c*x,m=o*x+c*y,v=t.speed*l.rand(.9,1.1);et.balls.push({x:this.x+g*.6,z:this.z+m*.6,y:1.3,vx:g*v,vz:m*v,life:t.life,owner:this,gun:t,mul:s})}t.kick&&(this.kvx-=o*t.kick*10,this.kvz-=c*t.kick*10,l.R.shake=Math.min(.5,l.R.shake+t.kick*.5)),l.FX.glow.spawn(this.x+o*.9,1.3,this.z+c*.9,0,0,0,.05,t.pellets>1?.35:.22,16770976,0),l.audio.play(t.sound,.6)}chainZap(e,t,n,s){l.audio.play("zap",.9);let r=null,a=1e9;l.grid.query(this.x,this.z,e.range,Tt);for(let u of Tt){if(u.dead||u.caged)continue;let d=u.x-this.x,f=u.z-this.z,p=Math.hypot(d,f)||1;p>e.range||(d*t+f*n)/p<(s?.98:.7)||!l.W.los(this.x,this.z,u.x,u.z)||p<a&&(a=p,r=u)}if(!r){l.zapLine&&l.zapLine(this.x,this.z,this.x+t*3,this.z+n*3);return}let o=this.x,c=this.z,h=new Set;for(let u=0;u<e.jumps&&r;u++){h.add(r),l.zapLine&&l.zapLine(o,c,r.x,r.z),r.ocT=Math.max(r.ocT,e.stun),r.freezeT=Math.max(r.freezeT||0,e.stun*.5);let d=l.AI.damage(r,e.dmg*this.dmgMul(),o,c,3,"taser",this);l.FX.sparks(r.x,1.3,r.z,6,10479871),d&&this.taunt(),o=r.x,c=r.z,l.grid.query(r.x,r.z,e.jumpR,Tt);let f=null,p=1e9;for(let y of Tt){if(y.dead||y.caged||h.has(y))continue;let x=(y.x-o)**2+(y.z-c)**2;x<p&&(p=x,f=y)}r=f}h.size>=4&&Math.random()<.4&&l.FX.float(o,2.6,c,l.pick(["RIDE THE LIGHTNING!","TASER TASER TASER!",`x${h.size} CHAIN!`]),"#9fe8ff",18,1.2)}spray(e){if(this.energy=Math.max(0,this.energy-(Ii[l.S.spray]||Ii.oc).drain*e),this.sprayT-=e,this.sprayT>0)return;this.sprayT=.07;let t=Ii[l.S.spray]||Ii.oc,n=t.cone*3;(t.linger?l.FX.mist:l.FX.cloud)(this.x+this.ax*.8,1.35,this.z+this.az*.8,this.ax*t.range*2.2+l.rand(-n,n),this.az*t.range*2.2+l.rand(-n,n),t.puff),t.linger&&Math.random()<.35&&et.hazards.push({x:this.x+this.ax*t.range*.7,z:this.z+this.az*t.range*.7,r:2.4,t:5,owner:this}),l.audio.play("spray",.6),l.grid.query(this.x,this.z,t.range,Tt);for(let r of Tt){if(r.dead)continue;let a=r.x-this.x,o=r.z-this.z,c=Math.hypot(a,o);c>t.range||c<.01||Math.acos(l.clamp((a*this.ax+o*this.az)/c,-1,1))>t.cone||l.W.los(this.x,this.z,r.x,r.z)&&(r.ocT=t.blind,l.AI.damage(r,t.dps*.07*this.dmgMul(),this.x,this.z,.6,"oc",this))}}throwNade(e){this.nadeCD=ji.cd;let t=Math.hypot(e.ax||0,e.az||0),n=t>2.5?l.clamp(t,3,12):9,s=ji.fuse;et.nades.push({x:this.x+this.ax*.6,z:this.z+this.az*.6,y:1.6,vx:this.ax*n/s,vz:this.az*n/s,vy:4.5,t:s,owner:this,mesh:null}),l.audio.play("swing",1),l.FX.float(this.x,2.6,this.z,l.pick(["FRAG OUT!","GRENADE!","Fire in the hole!"]),"#ffcf4a",17,1.2)}baton(){if(this.otT>0)return this.hammerHit();let e=ui.baton;l.grid.query(this.x,this.z,e.range+.6,Tt);let t=0;for(let n of Tt){if(n.dead)continue;let s=n.x-this.x,r=n.z-this.z,a=Math.hypot(s,r);if(a>e.range+n.r||a>.5&&Math.acos(l.clamp((s*this.ax+r*this.az)/a,-1,1))>e.arc)continue;let o=n.ocT>0?2:1,c=l.AI.damage(n,e.dmg*o*this.dmgMul(),this.x,this.z,e.knock*(o>1?1.4:1),"baton",this);l.FX.sparks(n.x,1.3*n.scale,n.z,5,16777215),t++,o>1&&t===1&&l.FX.float(n.x,2.6,n.z,"BLIND SIDE!","#ffdd55",16,1),c&&this.taunt()}t&&(l.audio.play("crack"),l.R.shake=Math.min(.7,l.R.shake+.12+t*.03),l.S.hitStop=.04,l.R.flashOn&&l.R.muzzle(this.x+this.ax*1.5,this.z+this.az*1.5,.5))}hammerHit(){l.grid.query(this.x,this.z,hi.range+.6,Tt);let e=0;for(let t of Tt){if(t.dead||t.caged)continue;let n=t.x-this.x,s=t.z-this.z;Math.hypot(n,s)>hi.range+t.r||(l.AI.damage(t,t.boss?hi.bossDmg:hi.dmg,this.x,this.z,hi.knock,"hammer",this),l.FX.sparks(t.x,1.3*t.scale,t.z,8,16765514),e++)}e&&Math.random()<.5&&l.FX.float(this.x+this.ax*2,.8,this.z+this.az*2,l.pick(["*CLOCK IN*","DING!","*PUNCH*","BONK","OT!"]),"#ffd24a",15,.6),e&&(l.audio.play("clock",1),l.R.shake=Math.min(.9,l.R.shake+.25),l.S.hitStop=.05,l.R.flashOn&&l.R.muzzle(this.x,this.z,1.2))}taunt(){this.tauntT>0||Math.random()>.3||(this.tauntT=l.rand(4,7),l.FX.float(this.x,2.5,this.z,l.pick(zf),"#9fd0ff",16,1.8))}},di,X1=new L(0,0,1),wp=new He,Ep=new Zt,Tp=new L,q1=new L,Sp=new xe;et.init=function(i){di=new un(new vt(1,8,6),new ut({toneMapped:!1}),400),di.frustumCulled=!1,di.count=0,di.setColorAt(0,Sp.set(1,1,1)),i.add(di);for(let e=0;e<4;e++){let t=new ce(new vt(1,20,14),new ut({color:16756816,transparent:!0,opacity:0,depthWrite:!1,blending:hn,toneMapped:!1}));t.visible=!1,i.add(t),Ko.push({mesh:t,t:0,x:0,z:0})}};var Ko=[],Y1=new vt(.13,10,8),uu=null;et.reset=function(){for(let i of et.nades)i.mesh&&l.R.scene.remove(i.mesh);et.balls.length=0,et.hazards.length=0,et.nades.length=0;for(let i of et.pickups)l.R.scene.remove(i.mesh);et.pickups.length=0};et.update=function(i,e){l.S.power&&(l.S.power.t-=i)<=0&&(l.S.power=null,l.FX.float(l.officers[0].x,2.8,l.officers[0].z,"Power weapon empty. Back to issue.","#ff9adf",16,1.6));let t=0;for(let n=et.balls.length-1;n>=0;n--){let s=et.balls[n];s.life-=i;let r=2,a=s.life<=0;for(let u=0;u<r&&!a;u++){if(s.x+=s.vx*i/r,s.z+=s.vz*i/r,l.W.blocked(s.x,s.z)){l.FX.sparks(s.x,s.y,s.z,4,16751146),a=!0;break}l.grid.query(s.x,s.z,.8,Tt);for(let d of Tt)if(!d.dead&&(d.x-s.x)**2+(d.z-s.z)**2<(d.r+.12)**2){let f=l.AI.damage(d,s.gun.dmg*(s.mul||1)*s.owner.dmgMul(),s.x-s.vx,s.z-s.vz,s.gun.knock,s.gun.pellets>1?"buck":"ball",s.owner);s.gun.sting&&(d.ocT=Math.max(d.ocT,s.gun.sting)),l.FX.sparks(s.x,s.y,s.z,l.R.flashOn?8:3,l.R.flashOn?16765066:16751146),l.FX.cloud(s.x,s.y,s.z,0,0,.15),l.R.flashOn&&l.R.muzzle(s.x,s.z,.35),l.audio.play("thud",.4),f&&s.owner.taunt(),a=!0;break}}if(a){et.balls.splice(n,1);continue}let o=l.R.flashOn,c=s.gun.size*(o?1.8:1),h=s.gun.speed>40?5:o?2.5:1;o&&Math.random()<.5&&l.FX.glow.spawn(s.x,s.y,s.z,0,0,0,.12,c*.8,s.gun.color,0),Ep.setFromUnitVectors(X1,Tp.set(s.vx,0,s.vz).normalize()),wp.compose(Tp.set(s.x,s.y,s.z),Ep,q1.set(c,c,c*h)),di.setMatrixAt(t,wp),di.setColorAt(t,Sp.setHex(s.gun.color)),t++}di.count=t,di.instanceMatrix.needsUpdate=!0,di.instanceColor.needsUpdate=!0;for(let n=et.nades.length-1;n>=0;n--){let s=et.nades[n];s.mesh||(uu=uu||new Ae({color:4016682,roughness:.6,metalness:.3}),s.mesh=new ce(Y1,uu),s.mesh.castShadow=!0,l.R.scene.add(s.mesh)),s.t-=i,s.vy-=12*i;let r=s.x+s.vx*i,a=s.z+s.vz*i;if(l.W.blocked(r,a)?(s.vx*=-.4,s.vz*=-.4):(s.x=r,s.z=a),s.y+=s.vy*i,s.y<.15&&(s.y=.15,s.vy=Math.abs(s.vy)*.35,s.vx*=.6,s.vz*=.6),s.mesh.position.set(s.x,s.y,s.z),s.mesh.rotation.x+=i*12,Math.random()<.5&&l.FX.glow.spawn(s.x,s.y+.1,s.z,0,.3,0,.1,.06,16764006,0),s.t>0)continue;l.R.scene.remove(s.mesh),et.nades.splice(n,1);let o=Ko.find(c=>c.t<=0)||Ko[0];o.t=.45,o.x=s.x,o.z=s.z,l.FX.sparks(s.x,.8,s.z,40,16760928),l.R.flashOn&&l.R.muzzle(s.x,s.z,2.5);for(let c=0;c<10;c++)l.FX.cloud(s.x+l.rand(-1.5,1.5),.8,s.z+l.rand(-1.5,1.5),l.rand(-3,3),l.rand(-3,3),.9,7236196);l.audio.play("boom",1.4),setTimeout(()=>l.audio.play("boom",.8),90),l.R.shake=Math.min(1,l.R.shake+.7),l.S.hitStop=.06,l.grid.query(s.x,s.z,ji.radius+1,Tt);for(let c of Tt.slice()){if(c.dead||c.caged)continue;let h=Math.hypot(c.x-s.x,c.z-s.z);h>ji.radius+c.r||l.AI.damage(c,ji.dmg*(1-.6*h/ji.radius)*s.owner.dmgMul(),s.x,s.z,ji.knock,"nade",s.owner)}}for(let n of Ko){if(n.t<=0){n.mesh.visible=!1;continue}n.t-=i;let s=1-n.t/.45;n.mesh.visible=!0,n.mesh.position.set(n.x,.8,n.z),n.mesh.scale.setScalar(.6+ji.radius*Math.sqrt(s)),n.mesh.material.opacity=(1-s)*.9,n.mesh.material.color.setHex(s<.25?16773312:16742944)}for(let n=et.hazards.length-1;n>=0;n--){let s=et.hazards[n];if(s.t-=i,s.t<=0){et.hazards.splice(n,1);continue}Math.random()<i*2.5&&l.FX.mist(s.x+l.rand(-1.2,1.2),.7,s.z+l.rand(-1.2,1.2),l.rand(-1.5,1.5),l.rand(-1.5,1.5),.6),l.grid.query(s.x,s.z,s.r,Tt);for(let r of Tt)!r.dead&&(r.x-s.x)**2+(r.z-s.z)**2<s.r*s.r&&(r.ocT=Math.max(r.ocT,1.5),Math.random()<i*3&&l.AI.damage(r,2,s.x,s.z,.2,"oc",s.owner))}for(let n=et.pickups.length-1;n>=0;n--){let s=et.pickups[n];s.t+=i,s.mesh.position.y=.55+Math.sin(e*3+s.x)*.12,s.mesh.rotation.y+=i*2;for(let r of l.officers)if(!(r.down||(r.x-s.x)**2+(r.z-s.z)**2>.9)){if(s.kind==="ammo"||s.kind==="power"){$1(r,s),l.R.scene.remove(s.mesh),et.pickups.splice(n,1);break}if(s.kind==="taco")r.hp=Math.min(r.maxHp,r.hp+30*l.diff().heal),r.tacoT=12;else if(s.kind==="gold"){let a=new Set(l.store.get("sa_gold",[]));a.add(l.S.def.key),l.store.set("sa_gold",[...a]),r.hp=r.maxHp,r.tacoT=20,a.size>=3&&!l.store.get("sa_bigbro",!1)?(l.store.set("sa_bigbro",!0),l.showCard("BIG BRO MODE UNLOCKED","Caleb Alaniz now rides the whole shift with you. I got you bro.",!0,4200)):l.FX.float(r.x,3,r.z,`GOLDEN TACO ${a.size}/3`,"#ffd34d",24,2.2)}else if(s.kind==="zyn")r.hp=Math.min(r.maxHp,r.hp+35*l.diff().heal),r.zynT=10,l.FX.sparks(r.x,1.6,r.z,14,16738842);else if(s.kind==="chew"){r.hp=Math.min(r.maxHp,r.hp+55*l.diff().heal),l.grid.query(r.x,r.z,5,Tt);let a=null,o=26;for(let c of Tt){if(c.dead)continue;let h=(c.x-r.x)**2+(c.z-r.z)**2;h<o&&(o=h,a=c)}a&&(a.ocT=4,l.FX.spit(r.x,1.5,r.z,a.x-r.x,a.z-r.z),l.FX.float(a.x,2.4,a.z,"TOBACCO IN THE EYE!","#c79a5a",16,1.4))}else r.energy=100,r.drinkT=10;l.FX.float(r.x,2.6,r.z,l.pick(Hf[s.kind]),Z1[s.kind],20,1.6),l.audio.play(s.kind==="zyn"||s.kind==="chew"||s.kind==="gold"?s.kind:"pickup"),l.R.scene.remove(s.mesh),et.pickups.splice(n,1);break}s.beam&&(s.beam.material.opacity=.18+Math.sin(e*6)*.06),s.t>(s.kind==="power"?45:30)&&s.kind!=="gold"&&et.pickups[n]===s&&(l.R.scene.remove(s.mesh),et.pickups.splice(n,1))}};function $1(i,e){let t=l.S;if(e.kind==="ammo"){t.ammo=t.ammo||{};let n=Math.min(3,(t.ammo[t.gun]||0)+1);t.ammo[t.gun]=n,l.FX.float(i.x,2.8,i.z,`${Jo[n].name}! ${yn[t.gun].label} hits harder`,"#ffe14a",20,2),l.FX.sparks(i.x,1.2,i.z,18,16769354),l.audio.play("pickup")}else{let n=yn[e.gun];t.power={key:e.gun,t:15,max:15},l.showCard(n.label,"GO HAM. 15 SECONDS. "+n.line,!0,2600),l.FX.sparks(i.x,1.4,i.z,40,16726992),l.R.shake=.5,l.audio.play("win")}}et.spawnWeapon=function(i,e,t){et.spawnPickup("power",i,e,t||l.pick(V1))};var Z1={gold:"#ffd34d",taco:"#ffcf4a",drink:"#7dff6a",zyn:"#ff7a2a",chew:"#c79a5a"},Lt={};function K1(i,e){Lt.ready||(Lt.shell=new Ae({color:15909198,roughness:.6}),Lt.meat=new Ae({color:7027486,roughness:.8}),Lt.lettuce=new Ae({color:6275642,roughness:.8}),Lt.can=new Ae({color:1118481,roughness:.25,metalness:.8}),Lt.logo=new ut({color:7012154,toneMapped:!1}),Lt.zynLid=new Ae({color:16054008,roughness:.35,metalness:.2}),Lt.zynBand=new Ae({color:14173727,emissive:16730640,emissiveIntensity:.9,roughness:.4}),Lt.chewLid=new Ae({color:2759954,roughness:.5,metalness:.3}),Lt.chewBand=new Ae({color:13214282,roughness:.35,metalness:.7}),Lt.ring=new ut({color:16777215,transparent:!0,opacity:.5,toneMapped:!1}),Lt.ready=!0);let t=new ot;if(i==="taco"||i==="gold"){let s=new ce(new Je(.34,.34,.2,18,1,!0,0,Math.PI),Lt.shell);s.rotation.z=Math.PI/2,s.material.side=Nt;let r=new ce(new Te(.16,.12,.55),Lt.meat);r.position.y=.06;let a=new ce(new Te(.2,.06,.5),Lt.lettuce);if(a.position.y=.14,t.add(s,r,a),t.scale.setScalar(1.3),i==="gold"){let o=new Ae({color:16765773,emissive:9067008,emissiveIntensity:1.4,metalness:1,roughness:.2});t.traverse(c=>{c.isMesh&&(c.material=o)})}}else if(i==="zyn"||i==="chew"){let s=i==="zyn",r=new ce(new Je(.3,.3,.12,24),s?Lt.zynBand:Lt.chewBand),a=new ce(new Je(.31,.31,.05,24),s?Lt.zynLid:Lt.chewLid);a.position.y=.08,t.add(r,a),t.rotation.x=.5}else if(i==="ammo"){let s=new ce(new Te(.55,.36,.3),new Ae({color:4872746,roughness:.5,metalness:.4})),r=new ce(new Te(.57,.08,.32),new Ae({color:16765498,emissive:16756736,emissiveIntensity:1.2})),a=new ce(new Te(.3,.05,.12),Lt.zynLid);a.position.y=.2,t.add(s,r,a)}else if(i==="power"&&e&&l.gunModel){let s=l.gunModel(e);s.scale.setScalar(2.4),s.rotation.y=Math.PI/2,s.position.z=-.3;let r=new ce(new nn(.55,.04,8,32),new ut({color:16726992,toneMapped:!1}));r.rotation.x=Math.PI/2,r.position.y=-.2,t.add(s,r)}else if(i==="power"){let s=new Ae({color:1710623,metalness:.8,roughness:.3,emissive:16726992,emissiveIntensity:.35}),r=new ce(new Te(.9,.2,.16),s),a=new ce(new Je(.06,.06,.6,10).rotateZ(Math.PI/2),s);a.position.x=.7;let o=new ce(new Te(.12,.26,.12),s);o.position.set(-.2,-.18,0);let c=new ce(new Je(.17,.17,.14,14).rotateX(Math.PI/2),new Ae({color:16726992,emissive:16726992,emissiveIntensity:1.5}));c.position.set(.1,-.16,0),t.add(r,a,o,c),t.scale.setScalar(1.3)}else{let s=new ce(new Je(.13,.13,.48,16),Lt.can),r=new ce(new Je(.135,.135,.22,16,1,!0),Lt.logo);t.add(s,r)}t.traverse(s=>{s.castShadow=!0});let n=new ce(new si(.45,.55,24),Lt.ring);return n.rotation.x=-Math.PI/2,n.position.y=-.5,t.add(n),t}et.spawnPickup=function(i,e,t,n){if(et.pickups.length>14&&i!=="power")return;let s=K1(i,n);s.position.set(e,.55,t),l.R.scene.add(s);let r={kind:i,x:e,z:t,mesh:s,t:0,gun:n};i==="power"&&(r.beam=new ce(new Je(.5,.7,9,16,1,!0),new ut({color:16726992,transparent:!0,opacity:.2,blending:hn,depthWrite:!1,side:Nt,toneMapped:!1})),r.beam.position.set(e,4.5,t),l.R.scene.add(r.beam),r.mesh.addEventListener("removed",()=>l.R.scene.remove(r.beam))),et.pickups.push(r)};l.dropLoot=function(i,e){let t=Math.random();t<.05?et.spawnPickup("taco",i,e):t<.09?et.spawnPickup("drink",i,e):t<.125?et.spawnPickup("zyn",i,e):t<.15?et.spawnPickup("chew",i,e):t<.172?et.spawnPickup("ammo",i,e):t<.18&&et.spawnWeapon(i,e)};var J1=["Sixteen hours. No breaks. No mercy.","Payroll is about to cry.","The time clock is a WEAPON now.","You have been mandated. They have been warned."];function j1(i){let e=new Ae({color:16765773,emissive:8014336,emissiveIntensity:1.2,roughness:.3,metalness:1}),t=new Ae({color:5922920,roughness:.45,metalness:.6}),n=new Ae({color:16777215,emissive:16774080,emissiveIntensity:.6}),s=new Ae({color:16722458,emissive:16722458,emissiveIntensity:1.5}),r=new ot,a=new ce(new Je(.05,.06,1.3,10),e);a.position.y=.55,r.add(a);let o=new ce(new Te(.62,.5,.42),t);o.position.y=1.3,r.add(o);let c=new ce(new Je(.17,.17,.03,20),n);c.rotation.x=Math.PI/2,c.position.set(0,1.36,.22),r.add(c);let h=new ce(new Te(.3,.05,.04),s);h.position.set(0,1.12,.22),r.add(h);for(let u of[-1,1]){let d=new ce(new Te(.06,.56,.48),e);d.position.set(u*.34,1.3,0),r.add(d)}return r.traverse(u=>{u.isMesh&&(u.castShadow=!0)}),r.rotation.x=Math.PI/2,r.position.set(0,-.07,.05),i.baton.parent.add(r),r}var Qt=[];l.allies=[];var Q1={caleb:{name:()=>l.CREW.caleb,gender:"male",back:"ALANIZ",scale:1.15,title:"Six-four of pure overtime. A real one.",hp:300,time:20,speed:6.8,uniform:2376318,enter:["I got you bro.","I got you bro. Caleb Alaniz on scene.","I got you bro. Get behind me.","Bro. BRO. I got you."],barks:["I got you bro.","Nobody touches my brother.","Bro, I got this side.","Six-four of pure overtime, baby!","Bro, that was a flag on the play.","Hold my energy drink.","You good, {hero}? Eat a taco, bro.","Ref! REF!","Touchdown, baby!"],leave:["Gotta bounce, bro. My truck is double-parked.","Alaniz out. Love y'all. Stay up, family.","Caleb out. Proud to work with y'all, for real."]},bernardo:{name:()=>l.CREW.bernardo,gender:"male",back:"BERNARDO",scale:1.08,title:"Big shield. Bigger truck.",hp:500,time:22,speed:6.2,uniform:2376318,enter:["Bernardo on scene. Hey, you wanna see how big my truck is? After this.","SHIELD UP! Bernardo\u2019s here!","Who called for the big shield and the bigger truck?"],barks:qf,leave:["Shield\u2019s going back in the truck. The BIG truck.","Bernardo out. Somebody owes me twenty on Sunday."]},dustin:{name:()=>l.CREW.dustin,gender:"male",back:"DAVIS",scale:1,title:'"YOU WANNA RUN IT WITH ME?"',hp:300,time:22,speed:7,uniform:2376318,enter:["You wanna run it with me? Dustin Davis on scene.","YOU WANNA RUN IT WITH ME?! Officer Davis is here.","You wanna run it with me? Come on then. Dustin Davis in the building."],barks:[fr,fr,fr,fr,fr,...op],barkGap:[2.5,4.5],barkSize:18,leave:["Davis out. You still wanna run it with me? Didn't think so.","Roast complete. Dustin Davis out. Love you, family."]},ricardo:{name:()=>l.CREW.ricardo,gender:"male",back:"ALANIZ",scale:1.1,title:"One of the good ones. A legend. He cleans house.",hp:450,time:22,speed:7.6,uniform:11569749,lanyard:!0,gold:!0,enter:lp,barks:cp,leave:hp,barkGap:[3,5],barkSize:17},caughren:{name:()=>l.CREW.caughren,gender:"female",back:"COUGHRONNY",scale:1,hp:1,time:1e9,speed:3,uniform:2771594,passive:!0,deny:tp,extra:np,close:"ASK BINGBING.",col:"#ff8ad8",leave:["It was ONE phone!","I want my union rep!","He said he LOVED me!","I was never here."]},bingham:{name:()=>l.CREW.bingham,gender:"female",back:"COUNSELOR",scale:1,hp:1,time:1e9,speed:3,uniform:12098154,passive:!0,lanyard:!0,deny:ip,extra:sp,close:rp,col:"#ffb37a",leave:["My caseload NEEDS me!","I am calling my therapist. He is in C-pod.","This is a hostile work environment!","I was never here."]}},du=class{constructor(e,t,n){let s=this.d=Q1[e];if(this.key=e,this.name=s.name(),this.model=Yo({gender:s.gender,rank:s.rank,back:s.back,ringColor:s.gold?16765773:s.passive?16734896:16777215,uniform:s.uniform,scale:s.scale,lanyard:s.lanyard}),l.R.scene.add(this.model.root),e==="bernardo"){let r=new ce(new Te(.06,.95,.62),new Ae({color:11063536,roughness:.08,metalness:.1,transparent:!0,opacity:.45}));r.position.set(-.05,-.38,.28),r.rotation.y=Math.PI/2,this.model.armL.add(r),this.model.holdL=!0}if(Object.assign(this,{x:t,z:n,r:.45,yaw:0,hp:s.hp,t:s.time,down:!1,isAlly:!0,move:0,swingT:0,cd:.5,tazeCD:0,slamCD:2,sprayT:0,barkT:l.rand(4,7),leaving:!1}),s.passive){Object.assign(this,{passive:!0,state:"cuddle",lines:[],lineT:0,heartT:.5,walkT:0}),this.model.baton.visible=!1,this.tag=document.createElement("div"),this.tag.className="nametag",this.tag.style.color=s.col,this.tag.textContent="\u26A0 "+this.name+" \u26A0",document.getElementById("floaters").appendChild(this.tag);return}l.FX.sparks(t,1,n,20,16765773),l.FX.float(t,2.8,n,`${this.name.toUpperCase()} ON SCENE`,s.gold?"#ffd34d":"#9fd0ff",22,2.2),e==="dustin"&&l.FX.float(t,3.4,n,'"YOU WANNA RUN IT WITH ME?"',"#ffd27a",30,2.8),e==="ricardo"&&(l.FX.sparks(t,1,n,40,16765773),l.R.shake=.5,l.audio.play("slam",.8)),l.showCard&&l.showCard(`${this.name.toUpperCase()}`,`ON SCENE \xB7 ${s.title||""}`,!1,2800),this.tag=document.createElement("div"),this.tag.className="nametag"+(s.gold?" gold":""),this.tag.textContent=this.name,document.getElementById("floaters").appendChild(this.tag),l.say(this.name,l.pick(s.enter))}hurt(e){this.hp-=e*.5,this.model.root.children[0]&&(this.flash=.2),this.hp<=0&&(this.t=0)}remove(){l.R.scene.remove(this.model.root),this.tag&&this.tag.remove()}bust(){if(this.state!=="cuddle")return;let e=this.d;this.state="busted",this.lineT=.4,this.lines=e.deny.concat(e.extra.slice().sort(()=>Math.random()-.5).slice(0,4),[e.close]),l.showCard("COMPROMISED",`${this.name.toUpperCase()} \xB7 CAUGHT IN 4K`,!0,3e3),l.audio.play("scare",.8),this.bf&&!this.bf.dead&&l.FX.float(this.bf.x,2.9,this.bf.z,l.pick(tu),"#ff8a3a",18,2)}walkOut(e){this.state!=="walk"&&(this.state="walk",this.walkT=3.5,l.FX.float(this.x,3,this.z,e||l.pick(this.d.leave),this.d.col,20,2.4),this.bf&&!this.bf.dead&&(this.bf.freezeT=0,this.bf.loveSick=!1))}passiveUpdate(e){let t=this.d,n=this.bf;if(this.state==="cuddle")n&&!n.dead&&(this.yaw=Math.atan2(n.x-this.x,n.z-this.z),n.freezeT=Math.max(n.freezeT,1),n.yaw=Math.atan2(this.x-n.x,this.z-n.z)),this.heartT-=e,this.heartT<=0&&(this.heartT=l.rand(.7,1.3),l.FX.float(this.x+l.rand(-.4,.4),2.3,this.z+l.rand(-.4,.4),l.pick(["\u2665","\u2665\u2665","\u2665","mwah","\u2665 \u2665 \u2665"]),"#ff5ab0",20,1.4),Math.random()<.3&&n&&!n.dead&&l.FX.float(n.x,2.8,n.z,l.pick(tu),"#ff8a3a",15,1.8)),l.officers.some(s=>!s.down&&(s.x-this.x)**2+(s.z-this.z)**2<9)&&this.bust(),this.model.root.rotation.z=Math.sin(performance.now()/300)*.06;else if(this.state==="busted"){let s=l.officers.find(r=>!r.down)||l.officers[0];if(this.yaw=Math.atan2(s.x-this.x,s.z-this.z),this.model.root.rotation.z=0,this.lineT-=e,this.lineT<=0){let r=this.lines.shift();if(r)this.lineT=2.3,l.FX.float(this.x,3.1,this.z,r,t.col,17,2.4),l.say(this.name,r,2.3);else{l.S.compromised=(l.S.compromised||0)+1,(l.S.compNames=l.S.compNames||[]).push(this.name),l.say("CONTROL",`${this.name}, turn in your keys. Your radio. And your dignity.`,3.2);for(let a=0;a<2;a++)l.C.spawnPickup("zyn",this.x+l.rand(-1,1),this.z+l.rand(-1,1));l.FX.float(this.x,2.2,this.z,"CONTRABAND: 2 TINS, 1 PHONE, 14 LOVE LETTERS","#ff7a2a",15,2.5),this.walkOut()}}}else if(this.state==="walk"&&(this.walkT-=e,this.x+=Math.sin(this.yaw+Math.PI)*2*e,this.z+=Math.cos(this.yaw+Math.PI)*2*e,l.W.collide(this),this.move=l.lerp(this.move,.6,e*6),this.walkT<=0))return l.FX.sparks(this.x,1,this.z,16,16734896),this.leaving=!0,!1;if(Wn(this.model,e,this.state==="walk"?this.move:0,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.state==="walk"?this.yaw+Math.PI:this.yaw,this.tag){let[s,r,a]=l.R.worldToScreen(this.x,2.7,this.z);this.tag.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%) scale(${1+.12*Math.sin(performance.now()/150)})`,this.tag.style.opacity=a?1:0}return!0}update(e){if(this.passive)return this.passiveUpdate(e);let t=this.d;if(this.t-=e,this.cd-=e,this.tazeCD-=e,this.slamCD-=e,this.barkT-=e,this.t<=0&&!this.leaving)return this.leaving=!0,l.say(this.name,l.pick(t.leave)),l.FX.sparks(this.x,1,this.z,16,16777215),!1;if(this.leaving)return!1;if(this.barkT<=0&&(this.barkT=l.rand(...t.barkGap||[5,9]),l.FX.float(this.x,2.7,this.z,l.t(l.pick(t.barks),e_()),this.d.gold?"#ffd34d":this.key==="dustin"?"#ffd27a":"#9fd0ff",t.barkSize||15,2)),this.key==="ricardo"){let c=l.allies.find(h=>h.passive&&h.state==="cuddle");if(c){let h=c.x-this.x,u=c.z-this.z,d=Math.hypot(h,u)||1;if(d<2.2){let f=l.pick(up).replace("{name}",c.name.replace(/^(C\/O|Counselor) /,""));l.FX.float(this.x,3.3,this.z,f,"#ffd34d",22,2.6),c.bust(),c.lineT=2.4,l.say(this.name,f,2.4)}else return this.stuckT=(this.bestL??1e9)-d<.05?(this.stuckT||0)+e:0,this.bestL=Math.min(this.bestL??1e9,d),this.stuckT>1.2&&(l.FX.sparks(this.x,1,this.z,16,16765773),this.x=c.x-1.5,this.z=c.z+.5,this.stuckT=0,l.W.blocked(this.x,this.z)&&(this.x=c.x,this.z=c.z+1.2),l.FX.sparks(this.x,1,this.z,24,16765773),l.FX.float(this.x,2.9,this.z,"I know a shortcut.","#ffd34d",18,1.6)),this.walkTo(h/d,u/d,e)}}if(this.key==="caleb"){let c=l.officers.find(h=>h.down);if(c){let h=c.x-this.x,u=c.z-this.z,d=Math.hypot(h,u)||1;if(d<1.4)c.down=!1,c.hp=Math.max(c.hp,55),c.iframes=2,l.FX.float(c.x,2.6,c.z,"GET UP BRO. I GOT YOU.","#9fd0ff",20,2),this.bigBroSlam();else{if(this.yaw=Math.atan2(h,u),this.x+=h/d*this.d.speed*1.2*e,this.z+=u/d*this.d.speed*1.2*e,l.W.collide(this),this.move=l.lerp(this.move,1,e*8),Wn(this.model,e,this.move,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[f,p,y]=l.R.worldToScreen(this.x,2.6*(this.d.scale||1),this.z);this.tag.style.transform=`translate(${f|0}px, ${p|0}px) translate(-50%, -50%)`,this.tag.style.opacity=y?1:0}return!0}}}if(this.key==="caleb")for(let c of l.officers)!c.down&&(c.x-this.x)**2+(c.z-this.z)**2<16&&(c.hp=Math.min(c.maxHp,c.hp+6*e));let n=l.officers.find(c=>!c.down)||l.officers[0],s=null,r=1e9;l.grid.query(n.x,n.z,16,Qt);for(let c of Qt){if(c.dead)continue;let h=(c.x-this.x)**2+(c.z-this.z)**2;h<r&&(r=h,s=c)}let a=0,o=0;if(s){let c=Math.sqrt(r),h=(s.x-this.x)/c,u=(s.z-this.z)/c;this.yaw=Math.atan2(h,u),c>1.6&&(a=h,o=u),this.key==="bernardo"?this.bernardoMoves(s,c):this.key==="dustin"?this.dustinMoves(s,c,h,u):this.key==="ricardo"?this.ricardoMoves(s,c,h,u,e):this.calebMoves(s,c,h,u,e)}else if((n.x-this.x)**2+(n.z-this.z)**2>9){let c=n.x-this.x,h=n.z-this.z,u=Math.hypot(c,h);a=c/u,o=h/u,this.yaw=Math.atan2(a,o)}if(this.x+=a*t.speed*e,this.z+=o*t.speed*e,l.W.collide(this),this.move=l.lerp(this.move,Math.hypot(a,o),e*8),this.swingT>0&&(this.swingT+=e/.3,this.swingT>=1&&(this.swingT=0)),Wn(this.model,e,this.move,this.swingT,!1,0),this.model.root.position.set(this.x,0,this.z),this.spin>0&&(this.spin-=e),this.model.root.rotation.y=this.yaw+(this.spin>0?(.5-this.spin)*l.TAU*4:0),this.tag){let[c,h,u]=l.R.worldToScreen(this.x,2.6*(t.scale||1),this.z);this.tag.style.transform=`translate(${c|0}px, ${h|0}px) translate(-50%, -50%)`,this.tag.style.opacity=u?1:0}return!0}baton(e,t,n){this.swingT=.001,l.grid.query(this.x,this.z,t+.5,Qt);let s=0;for(let r of Qt)r.dead||(r.x-this.x)**2+(r.z-this.z)**2>t*t||(l.AI.damage(r,e,this.x,this.z,n,"baton",null),s++);return s&&(l.audio.play("crack"),l.R.shake=Math.min(.6,l.R.shake+.1)),s}bernardoMoves(e,t){for(let n=l.AI.proj.length-1;n>=0;n--){let s=l.AI.proj[n];(s.x-this.x)**2+(s.z-this.z)**2<7&&(l.FX.sparks(s.x,s.y,s.z,6,11063536),l.AI.proj.splice(n,1))}t<2.3&&this.cd<=0&&(this.cd=.8,this.baton(40,2.6,16)&&(l.FX.float(this.x,2.7,this.z,"SHIELD BASH!","#a8d0f0",16,1),l.S.hitStop=.05))}dustinMoves(e,t,n,s){if(this.tazeCD<=0&&t<7){this.tazeCD=2.8,l.FX.float(e.x,2.6,e.z,l.pick(Xf),"#ffd27a",16,2.2),l.grid.query(this.x,this.z,7,Qt);for(let r of Qt){if(r.dead||r.boss)continue;let a=r.x-this.x,o=r.z-this.z,c=Math.hypot(a,o)||1;(a*n+o*s)/c>.6&&(r.freezeT=2,r.swing=0)}l.FX.float(this.x+n*3,2.2,this.z+s*3,"ROASTED!","#ff8a3a",20,1.2)}else t<1.9&&this.cd<=0&&(this.cd=.5,this.baton(45,2.2,9))}walkTo(e,t,n){if(this.yaw=Math.atan2(e,t),this.x+=e*this.d.speed*n,this.z+=t*this.d.speed*n,l.W.collide(this),this.move=l.lerp(this.move,1,n*8),Wn(this.model,n,this.move,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[s,r,a]=l.R.worldToScreen(this.x,2.6*(this.d.scale||1),this.z);this.tag.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%)`,this.tag.style.opacity=a?1:0}return!0}ricardoMoves(e,t,n,s,r){if(this.comboCD=(this.comboCD??1)-r,this.houseCD=(this.houseCD??2)-r,this.chain&&this.chain.length){if(this.chainT-=r,this.chainT<=0){this.chainT=.13;let o=this.chain.shift();if(o&&!o.dead){let c=o.x-this.x,h=o.z-this.z,u=Math.hypot(c,h)||1;this.x=o.x-c/u*.9,this.z=o.z-h/u*.9,l.W.collide(this),this.yaw=Math.atan2(c,h),this.swingT=.001,this.combo++,l.AI.damage(o,55+this.combo*8,this.x,this.z,8+this.combo,"baton",null),l.FX.sparks(o.x,1.2,o.z,10,16765773),l.FX.float(o.x,2.6,o.z,`COMBO x${this.combo}`,"#ffd34d",16+this.combo*2,.9),l.audio.play("crack"),l.R.shake=Math.min(.7,l.R.shake+.12),l.S.hitStop=.03}this.chain.length||(l.FX.float(this.x,3.2,this.z,`COMBO x${this.combo} ROMBO!`,"#ffd34d",28,2),setTimeout(()=>l.FX.float(this.x,3,this.z,"Did you see that Combo Rombo?","#ffd34d",18,2.2),500),this.barkT=4)}return}let a=0;l.grid.query(this.x,this.z,3,Qt);for(let o of Qt)o.dead||a++;if(a>=5&&this.houseCD<=0){this.houseCD=6,this.cd=.8,this.spin=.5,l.grid.query(this.x,this.z,4,Qt);for(let o of Qt)!o.dead&&!o.boss&&l.AI.damage(o,95,this.x,this.z,18,"baton",null);for(let o=0;o<24;o++){let c=o/24*l.TAU;l.FX.sparks(this.x+Math.cos(c)*2.5,.3,this.z+Math.sin(c)*2.5,2,16765773)}l.FX.float(this.x,3.3,this.z,"HOUSE. CLEANED.","#ffd34d",30,2),l.R.shake=.8,l.S.hitStop=.1,l.audio.play("slam",1);return}if(this.comboCD<=0&&t<9){l.grid.query(this.x,this.z,9,Qt);let o=Qt.filter(c=>!c.dead).sort((c,h)=>(c.x-this.x)**2+(c.z-this.z)**2-((h.x-this.x)**2+(h.z-this.z)**2)).slice(0,6);if(o.length>=2){this.chain=o,this.chainT=0,this.combo=0,this.comboCD=l.rand(4,6),l.FX.float(this.x,2.9,this.z,"COMBO ROMBO!","#ffd34d",22,1),l.audio.play("dash");return}}t<2.1&&this.cd<=0&&(this.cd=.4,this.baton(60,2.4,11))}bigBroSlam(){l.grid.query(this.x,this.z,4.5,Qt);for(let e of Qt)!e.dead&&!e.boss&&l.AI.damage(e,70,this.x,this.z,16,"baton",null);l.FX.sparks(this.x,.4,this.z,30,10473727),l.R.shake=.7,l.audio.play("slam",1),l.FX.float(this.x,3,this.z,"BIG BRO SLAM!","#9fd0ff",24,1.6)}calebMoves(e,t,n,s,r){if(this.slammed||(this.slammed=!0,this.bigBroSlam()),this.tackleCD=(this.tackleCD||3)-r,this.tackleT>0){this.tackleT-=r,this.x+=this.tx*17*r,this.z+=this.tz*17*r,l.grid.query(this.x,this.z,1.4,Qt);for(let a of Qt)!a.dead&&!a.tackled&&(a.tackled=!0,l.AI.damage(a,60,this.x,this.z,13,"dash",null));return}if(this.tackleCD<=0&&t>2.5&&t<9){this.tackleCD=l.rand(3.5,5),this.tackleT=.35,this.tx=n,this.tz=s;for(let a of l.AI.list)a.tackled=!1;l.audio.play("dash"),l.FX.float(this.x,2.8,this.z,l.pick(["SHOULDER CHECK!","MOVE!","Tackle, bro!"]),"#9fd0ff",18,1);return}if(t<2.1&&this.cd<=0)this.cd=.5,this.baton(50,2.4,10);else if(t<6&&(this.sprayT-=r,this.sprayT<=0)){this.sprayT=.1,l.FX.cloud(this.x+n,1.4,this.z+s,n*12,s*12,.25),l.grid.query(this.x,this.z,6,Qt);for(let a of Qt){if(a.dead)continue;let o=a.x-this.x,c=a.z-this.z,h=Math.hypot(o,c)||1;(o*n+c*s)/h>.85&&h<6&&(a.ocT=3,l.AI.damage(a,2,this.x,this.z,.5,"oc",null))}}}};function e_(){return l.officers[0]&&l.officers[0].name||"Rookie"}l.zapLine=t_;function t_(i,e,t,n){for(let r=0;r<=8;r++){let a=r/8;l.FX.glow.spawn(l.lerp(i,t,a)+l.rand(-.15,.15),1.2+l.rand(-.2,.2),l.lerp(e,n,a)+l.rand(-.15,.15),0,0,0,.18,.09,10479871,0)}}var Xn={reset(){for(let i of l.allies)i.remove();l.allies.length=0},call(i,e,t){if(l.allies.some(c=>c.key===i))return!1;let n=l.officers.find(c=>!c.down)||l.officers[0],s=Math.random()*l.TAU,r=n.x+Math.cos(s)*3,a=n.z+Math.sin(s)*3;l.W.blocked(r,a)&&(r=n.x,a=n.z),e!==void 0&&(r=e,a=t);let o=new du(i,r,a);return l.allies.push(o),o},update(i){for(let e=l.allies.length-1;e>=0;e--)l.allies[e].update(i)||(l.allies[e].remove(),l.allies.splice(e,1))}};l.Allies=Xn;var Nn={active:null};l.Boss=Nn;function n_(){let i=(p,y=.7,x=0)=>new Ae({color:p,roughness:y,metalness:x}),e={suit:i(3107642,.8),waders:i(3885610,.45,.1),skin:i(14266508,.6),hair:i(3811868,.9),black:i(921102,.3,.4),steel:i(12107976,.2,1)},t=(p,y,x=0,g=0,m=0)=>{let v=new ce(p,y);return v.position.set(x,g,m),v.castShadow=!0,v},n=new ot,s=new ot;n.add(s),s.add(t(new tn(.27,.42,4,12),e.suit,0,1.1,0)),s.add(t(new Je(.07,.08,.14,8),e.skin,0,1.45,0));let r=new ot;r.position.set(0,1.6,0),s.add(r),r.add(t(new vt(.16,18,14),e.skin));for(let p=0;p<9;p++){let y=Math.PI*.55+p/8*Math.PI*.9;r.add(t(new Je(.018,.01,.34,4),e.hair,Math.cos(y)*.15,-.08,Math.sin(y)*.15-.02))}r.add(t(new vt(.17,14,8,0,Math.PI*2,0,Math.PI/2.4),e.hair,0,.02,0)),[-.065,.065].forEach(p=>{let y=t(new nn(.05,.012,6,16),e.black,p,.02,.155);r.add(y)}),r.add(t(new Te(.13,.025,.02),e.hair,0,-.06,.16));let a=(p,y,x,g,m,v)=>{let b=new ot;return b.position.set(p,y,0),b.add(t(new tn(g,x-g*2,3,8).translate(0,-x/2,0),m)),v&&b.add(t(new vt(g*1.05,8,6),v,0,-x,0)),s.add(b),b},o=a(-.34,1.36,.62,.07,e.suit,e.skin),c=a(.34,1.36,.62,.07,e.suit,e.skin),h=a(-.13,.82,.82,.1,e.waders,e.black),u=a(.13,.82,.82,.1,e.waders,e.black),d=new ot;d.position.set(0,-.66,.1),c.add(d),d.add(t(new Je(.015,.015,.5,4),e.steel,0,-.2,0)),d.add(t(new nn(.11,.022,6,14,Math.PI*1.4),e.steel,0,-.5,0));let f=new ce(new si(.75,.9,32),new ut({color:8257434,transparent:!0,opacity:.6,toneMapped:!1}));return f.rotation.x=-Math.PI/2,f.position.y=.03,n.add(f),n.scale.setScalar(1.3),{root:n,body:s,head:r,armL:o,armR:c,legL:h,legR:u,ring:f,phase:0}}var la=[];Nn.spawn=function(i,e){let t=l.AI.spawn("ripper",i,e);return t.model=n_(),l.R.scene.add(t.model.root),Object.assign(t,{swingT:0,hookT:3,mistT:9,hiddenT:0,calloutT:6,tauntT:4,enraged:!1}),Nn.active=t,l.say("CONTROL",na.intro,4),l.audio.play("siren"),l.audio.sting("boss"),l.audio.music("boss",!0),l.R.shake=.6,t};Nn.reset=function(){Nn.active&&Nn.active.model&&l.R.scene.remove(Nn.active.model.root),Nn.active=null,la.length=0};Nn.think=function(i,e,t,n){let s=i.hp/i.maxHp,r=s>.66?1:s>.33?2:3;if(i.hookT-=e,i.mistT-=e,i.calloutT-=e,i.tauntT-=e,i.swingCD-=e,i.tauntT<=0&&(i.tauntT=l.rand(6,10),l.FX.float(i.x,3.2,i.z,l.pick(na.taunts),"#7dff9a",17,2.4)),r>=2&&l.R.scene.fog.far>34&&(l.R.scene.fog.near=8,l.R.scene.fog.far=32,l.say("CONTROL","Visibility is dropping in Supermax! Stay together!",3)),r===3&&!i.enraged){i.enraged=!0,i.speed*=1.3;for(let h of l.W.doors)if(!h.opening){l.W.openDoor(h);for(let u=0;u<2;u++)l.AI.spawn("ding",h.spawn.x,h.spawn.z)}l.say("CONTROL","He popped the whole row! Dings everywhere!",3.5)}if(!t)return;if(i.hiddenT>0){if(i.hiddenT-=e,i.hiddenT<=0){let h=l.pick(l.targets);if(h){let u=Math.atan2(h.ax||0,h.az||1)+Math.PI;i.x=h.x+Math.sin(u)*1.8,i.z=h.z+Math.cos(u)*1.8,l.W.collide(i),i.swingT=.001,i.swingCD=0,l.FX.cloud(i.x,1.2,i.z,0,0,1.2,10467496),l.FX.float(i.x,3,i.z,"BEHIND YOU!","#ff5050",22,1.4)}}return}if(r>=2&&i.mistT<=0){i.mistT=l.rand(7,10),i.hiddenT=2.2;for(let h=0;h<8;h++)l.FX.cloud(i.x+l.rand(-1,1),1,i.z+l.rand(-1,1),l.rand(-2,2),l.rand(-2,2),.9,10467496);l.say("RADIO",l.pick(na.callouts),2.5);return}let a=t.x-i.x,o=t.z-i.z,c=1/(n||1);if(i.yaw+=l.angDiff(i.yaw,Math.atan2(a,o))*Math.min(1,e*8),i.hookT<=0&&n>4&&n<13&&(i.hookT=r===3?3:5,la.push({x:i.x,z:i.z,vx:a*c*20,vz:o*c*20,life:.8,owner:i}),l.audio.play("swing",1)),i.swingT>0){let h=i.swingT;if(i.swingT+=e*(r===3?3.2:2.6),h<.5&&i.swingT>=.5){for(let u of l.targets)(u.x-i.x)**2+(u.z-i.z)**2<7.3&&u.hurt(i.def.dmg*(r===3?1.3:1),i.x,i.z,"ripper",8);l.FX.sparks(i.x+a*c*1.5,1.2,i.z+o*c*1.5,8,10485696)}i.swingT>=1&&(i.swingT=0,i.swingCD=r===3?.5:.9)}else n<2.4&&i.swingCD<=0?i.swingT=.001:n>1.8&&(i.x+=a*c*i.speed*e,i.z+=o*c*i.speed*e,l.W.collide(i));i.move=l.lerp(i.move,n>1.8&&i.swingT===0?1:0,e*8)};Nn.onHit=function(i){i.hiddenT>0&&(i.hiddenT=Math.min(i.hiddenT,.3))};Nn.onDeath=function(i){l.S.slowmo=2.5,l.say("CONTROL",na.death,4.5),l.FX.float(i.x,3.4,i.z,"BIG FOGGY: DOWN","#7dff9a",26,3),l.FX.sparks(i.x,1.2,i.z,60,8257434),l.R.shake=.9,l.Loot.spawn(l.rollItem(3),i.x+1.2,i.z),l.R.scene.fog.near=22,l.R.scene.fog.far=70,l.S.bossDead=!0};Nn.update=function(i){for(let n=la.length-1;n>=0;n--){let s=la[n];s.life-=i,s.x+=s.vx*i,s.z+=s.vz*i,l.FX.glow.spawn(s.x,1.3,s.z,0,0,0,.12,.07,14217471,0);let r=null;for(let a of l.targets)if((a.x-s.x)**2+(a.z-s.z)**2<.8){r=a;break}if(r){r.hurt(10,s.x,s.z,"hook",0);let a=s.owner.x-r.x,o=s.owner.z-r.z,c=Math.hypot(a,o)||1;r.kvx!==void 0&&(r.kvx+=a/c*16,r.kvz+=o/c*16),l.FX.float(r.x,2.6,r.z,"HOOKED!","#d8f0ff",18,1.2)}(r||s.life<=0||l.W.blocked(s.x,s.z))&&la.splice(n,1)}let e=Nn.active;if(!e||!e.model)return;let t=e.model;t.root.visible=!(e.hiddenT>0),Wn(t,i,e.move||0,e.swingT||0,!1,e.dead?Math.min(1,e.fall):0),t.root.position.set(e.x,0,e.z),t.root.rotation.y=e.yaw,e.flash>0?t.body.children[0].material.emissive.setHex(5583667):t.body.children[0].material.emissive.setHex(0)};var ca=new Set,kn={x:innerWidth/2,y:innerHeight/2,l:!1,r:!1};addEventListener("keydown",i=>{ca.add(i.code),["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.code)&&!(i.target instanceof HTMLInputElement)&&i.preventDefault()});addEventListener("keyup",i=>ca.delete(i.code));addEventListener("blur",()=>{ca.clear(),kn.l=kn.r=!1});addEventListener("mousemove",i=>{kn.x=i.clientX,kn.y=i.clientY});addEventListener("mousedown",i=>{i.button===0&&(kn.l=!0),i.button===2&&(kn.r=!0)});addEventListener("mouseup",i=>{i.button===0&&(kn.l=!1),i.button===2&&(kn.r=!1)});addEventListener("contextmenu",i=>i.preventDefault());var i_={keys:ca,mouse:kn};l.Input=i_;function Ap(){let i=!1;return{kind:"kbm",label:"Keyboard + Mouse",read(e){let t=ca,n=(t.has("KeyD")?1:0)-(t.has("KeyA")?1:0),s=(t.has("KeyS")?1:0)-(t.has("KeyW")?1:0),r=l.R.screenToGround(kn.x,kn.y,1.2),a=t.has("ShiftLeft")||t.has("ShiftRight"),o=a&&!i;return i=a,{mx:n,mz:s,ax:r?r.x-e.x:0,az:r?r.z-e.z:0,fire:kn.l,spray:kn.r,melee:t.has("Space"),dash:o,sprint:a,ot:t.has("KeyF"),nade:t.has("KeyQ")||t.has("KeyG")}}}}function fu(i){let e=!1,t=n=>Math.abs(n)<.2?0:n;return{kind:"pad",index:i,label:`Controller ${i+1}`,read(n){let s=l.pads()[i];if(!s)return{mx:0,mz:0,ax:0,az:0};let r=f=>!!(s.buttons[f]&&(s.buttons[f].pressed||s.buttons[f].value>.4)),a=t(s.axes[0]),o=t(s.axes[1]),c=s.axes[2]||0,h=s.axes[3]||0;Math.hypot(c,h)<.3&&(c=a,h=o);let u=r(0)||r(4),d=u&&!e;return e=u,{mx:a,mz:o,ax:c,az:h,fire:r(7),spray:r(6),melee:r(2)||r(5),dash:d,sprint:u,ot:r(1),nade:r(3)}}}}function Rp(){let i=[],e=l.pads();for(let t=0;t<e.length;t++)e[t]&&i.push(t);return i}var Pp=matchMedia("(pointer: coarse)").matches||navigator.maxTouchPoints>0,jo={enabled:Pp,active:!1};l.Touch=jo;var es=60,vn={move:null,aim:null},Sn={spray:!1,melee:!1,dash:!1,nade:!1,ot:!1},Cp=!1,s_=`
#touch { position: fixed; inset: 0; z-index: 5; touch-action: none; user-select: none; -webkit-user-select: none; display: none; }
#touch .base { position: absolute; width: ${es*2}px; height: ${es*2}px; margin: -${es}px 0 0 -${es}px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); background: rgba(0,0,0,0.18); pointer-events: none; }
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
`;function Qi(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n&&(s.textContent=n),t.appendChild(s),s}function r_(){let i=document.createElement("style");i.textContent=s_,document.head.appendChild(i);let e=Qi("div",null,document.body);e.id="touch";let t=Qi("div","hint",e,"MOVE");t.style.left="18%";let n=Qi("div","hint",e,"AIM + SHOOT");n.style.right="30%";let s=Qi("div",null,document.body,"\u{1F4F1}\u21BB Turn your phone sideways");s.id="rotateHint";let r=(d,f,p,y,x)=>{let g=Qi("div","btn "+d,e,f);g.style.right=y+"px",g.style.bottom=x+"px",g.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),jo.active=!0,Sn[p]=!0,g.classList.add("on");try{g.setPointerCapture(v.pointerId)}catch{}});let m=v=>{v.preventDefault(),Sn[p]=!1,g.classList.remove("on")};return g.addEventListener("pointerup",m),g.addEventListener("pointercancel",m),g};r("spray","SPRAY","spray",18,108),r("","BATON","melee",96,30),r("","DASH","dash",18,30);let a=r("ot","OT","ot",174,30),o=r("nade","NADE","nade",96,108);Qi("div","btn pause",e,"II").addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),dispatchEvent(new KeyboardEvent("keydown",{code:"Escape"}))}),e.addEventListener("pointerdown",d=>{d.preventDefault(),jo.active=!0;let f=d.clientX<innerWidth*.45?"move":"aim";if(vn[f])return;let p=Qi("div","base",e),y=Qi("div","knob"+(f==="aim"?" aim":""),e);vn[f]={id:d.pointerId,ox:d.clientX,oy:d.clientY,x:d.clientX,y:d.clientY,base:p,knob:y};try{e.setPointerCapture(d.pointerId)}catch{}Ip(vn[f])}),e.addEventListener("pointermove",d=>{for(let f in vn){let p=vn[f];p&&p.id===d.pointerId&&(p.x=d.clientX,p.y=d.clientY,Ip(p))}});let h=d=>{for(let f in vn){let p=vn[f];p&&p.id===d.pointerId&&(p.base.remove(),p.knob.remove(),vn[f]=null)}};e.addEventListener("pointerup",h),e.addEventListener("pointercancel",h);let u=()=>{requestAnimationFrame(u);let d=l.S&&l.S.state==="play";if(e.style.display=d?"block":"none",o.style.display=l.S&&l.S.nades?"grid":"none",a.classList.toggle("ready",!!(l.officers&&l.officers.some(f=>f.ot>=100))),s.style.display=d&&innerHeight>innerWidth*1.1?"block":"none",!d){for(let f in vn)vn[f]&&(vn[f].base.remove(),vn[f].knob.remove(),vn[f]=null);Sn.spray=Sn.melee=Sn.dash=Sn.nade=Sn.ot=!1}};u()}function pu(i){if(!i)return{x:0,y:0,m:0};let e=(i.x-i.ox)/es,t=(i.y-i.oy)/es,n=Math.hypot(e,t);return n>1&&(e/=n,t/=n),{x:e,y:t,m:Math.min(1,n)}}function Ip(i){let e=pu(i);i.base.style.left=i.ox+"px",i.base.style.top=i.oy+"px",i.knob.style.left=i.ox+e.x*es+"px",i.knob.style.top=i.oy+e.y*es+"px"}jo.read=function(){let i=pu(vn.move),e=pu(vn.aim),n=(a=>a.m<.15?{x:0,y:0}:a)(i),s=e.m>.25,r=Sn.dash&&!Cp;return Cp=Sn.dash,{mx:n.x,mz:n.y,ax:s?e.x:n.x,az:s?e.y:n.y,fire:s,spray:Sn.spray,melee:Sn.melee,dash:r,sprint:Sn.dash,ot:Sn.ot,nade:Sn.nade}};Pp&&r_();var ts=[{key:"lot",title:"Parking Lot, Shift Change",sub:"{hero} parks the lifted truck. Energy drink in hand. Bad feeling.",quota:45,live:60,rate:3,mix:{rat:7,gasser:1.5,diva:.6,crutch:.5},tacos:3,drinks:2,call:"STAFF ASSAULT, STAFF PARKING LOT! ALL AVAILABLE STAFF RESPOND!",rung:0,prea:!0,units:["STAFF PARKING LOT","SALLY PORT","MEDICAL","WILLIAMS UNIT"],lines:[[1,"SERGEANT","Morning, {hero}. Quick heads up: they are in the parking lot."],[7,"{HERO}","I have not even clocked in."],[14,"SERGEANT","Spray them, baton them, and sign the overtime sheet."],[26,"{bernardo}","Hey {hero}, you wanna see how big my truck is? After this. Definitely after this."],[40,"COMPLIANCE","Reminder: your PREA training is overdue. Please complete it during the riot. Yes, the whole damn thing. Yes, the quiz too."]]},{key:"tier",title:"IMU North",sub:"Keys. Energy drinks. A tier full of opinions.",quota:80,live:85,rate:2.8,mix:{rat:5,gasser:2,shank:2,big:.8,diva:1.3,ding:1,wheel:.6,crutch:.8},cells:!0,tacos:3,drinks:3,call:"STAFF ASSAULT, IMU NORTH! STAFF ASSAULT, IMU NORTH! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:2,prea:!0,units:["IMU NORTH","IMU SOUTH","WILLIAMS UNIT","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, the food port is not a suggestion box."],[6,"RADIO",'Control just popped every door in IMU North. Control says "my bad."'],[15,"{caleb}","What's up bro. I'm on my taco break. I'll swing through when I'm done."],[24,"SERGEANT","Watch the cups. Do NOT ask what is in the cups."],[30,"COMPLIANCE","An inmate in IMU North has asked what PREA stands for. Please respond with the full 64-page answer."],[38,"COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one with blood AND piss on it. Initial here, here, and here."],[52,"{dustin}","Cell 14 says your football team is trash. Cell 14 is correct."]]},{key:"yard",title:"The Yard",sub:"Rec time. The weight pit regulars do NOT like being interrupted mid-set.",quota:75,live:75,rate:2.7,mix:{rat:4,big:1.6,cholo:1.2,shank:1.5,gasser:1,wheel:1.2,crutch:1,diva:.8},tacos:3,drinks:3,call:"STAFF ASSAULT, REC YARD! STAFF ASSAULT, WEIGHT PIT! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:1,prea:!0,units:["REC YARD","WEIGHT PIT","IMU SOUTH","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, yard is hot. Do not touch anybody's bench. Do not ask how much they bench. They will tell you."],[9,"RADIO","Tower One reports a fight at the chest press. Tower One is also eating nachos."],[18,"{caleb}","Bro, who left 405 on the bench? Oh wait. Me. That was me."],[30,"COMPLIANCE","Reminder: spotting an inmate requires a signed consent form, two witnesses, and a notary. Do not touch his hips."],[44,"RADIO",'Somebody on the pull-up bar has been "almost done" for forty minutes.'],[58,"{dustin}","That dude in the wheelchair just lapped me. Twice."]]},{key:"night",title:"Lights Out",sub:"IMU North, 0300. Count time. Bring your flashlight and change your underwear.",quota:60,live:45,rate:2,mix:{rat:4,ding:2.5,shank:2,crutch:1,wheel:.7,big:.6},cells:!0,tacos:3,drinks:2,call:"STAFF ASSAULT, IMU NORTH! POWER IS DOWN! ALL STAFF RESPOND WITH LIGHTS!",rung:2,prea:!0,night:!0,units:["IMU NORTH","IMU SOUTH","THE BAR UNITS"],lines:[[2,"SERGEANT","{hero}, generator is down. Facilities duct-taped a flashlight to your gun. Every shot lights them up and burns their eyes."],[10,"RADIO","Count is not clearing. Somebody is hiding. Flash every corner."],[22,"COMPLIANCE","Shining a light into a cell after 2300 requires a Nighttime Illumination Disclosure form. In triplicate. In the dark."],[36,"{caleb}","Bro, I am NOT scared. That was a different noise. That was my knee."],[50,"RADIO","Something in the laundry cart just moved. Nobody check the laundry cart."]]},{key:"graveyard",title:"Graveyard Shift",sub:"Staff lot, 0300. Sodium lights are dead. Somebody\u2019s truck alarm will not stop. Something is under the trucks.",quota:60,live:50,rate:2.1,mix:{rat:4,ding:2,shank:2,crutch:1,gasser:1,big:.7},tacos:3,drinks:3,call:"STAFF ASSAULT, STAFF PARKING LOT! LOT LIGHTS ARE DOWN! RESPOND WITH LIGHTS!",rung:2,prea:!0,night:!0,music:"night",units:["STAFF PARKING LOT","SALLY PORT","MEDICAL"],lines:[[2,"SERGEANT","{hero}, lot lights are down and half of B-pod is hiding under the trucks. Flash under every truck."],[11,"RADIO","Whose truck alarm is that. Whose. Truck. Alarm. Is. That."],[24,"{bernardo}","If anybody scratches my truck in the dark I am filing a PREA. On the TRUCK\u2019S behalf."],[38,"COMPLIANCE","Reminder: parking lot incidents after 0000 require the Nighttime Vehicle Proximity Form. It is in the lot. In the dark."],[52,"{caleb}","Bro I parked RIGHT here. Where is my truck. Bro. BRO."]]},{key:"blackout",title:"Blackout: The Yard",sub:"The whole grid is down. You can hear plates clanking in the weight pit. You cannot see who is lifting them.",quota:70,live:55,rate:2.2,mix:{rat:3,big:2,cholo:1.5,shank:2,ding:1.5,wheel:1,crutch:1},tacos:3,drinks:3,call:"STAFF ASSAULT, REC YARD! TOTAL BLACKOUT! ALL STAFF RESPOND WITH LIGHTS!",rung:3,crews:1,prea:!0,night:!0,music:"night",units:["REC YARD","WEIGHT PIT","THE BAR UNITS"],lines:[[2,"SERGEANT","{hero}, total blackout on the yard. Tower can\u2019t see. We can\u2019t see. They CAN see. Light everything up."],[12,"RADIO","Somebody just benched 405 in the pitch dark. That is not a normal sound."],[26,"{dustin}","You wanna run it with me? In the DARK? Bold. Very bold."],[40,"COMPLIANCE","Yard blackout protocol requires a headcount. Please count every inmate by touch. Do not touch them."],[55,"RADIO","Generator is back in five minutes. Facilities said that an hour ago."]]},{key:"row",title:"Supermax",sub:"The regulars live here. Do not chat. Do not buy the paintings.",quota:70,live:70,rate:2.6,mix:{ding:4,rat:2,shank:2,big:1,gasser:1},cells:!0,tacos:4,drinks:3,call:"STAFF ASSAULT, SUPERMAX! STAFF ASSAULT, SUPERMAX! ALL STAFF RESPOND!",rung:3,crews:1,prea:!0,units:["SUPERMAX","SUPERMAX EAST","THE BAR UNITS","IMU SOUTH"],boss:"ripper",bossAt:.35,lines:[[2,"SERGEANT","{hero}, Supermax. Stay off the glass, stay off the intercom, and do NOT let them flatter you."],[12,"{bernardo}","Keep your eyes up, family. The mist plays tricks down here. Also my truck is unlocked, do not tell anyone."],[26,"COMPLIANCE","Reminder: Supermax inmates are still entitled to PREA training. They all passed. You failed it twice. Retake it Monday."],[44,"RADIO","Somebody on the row ordered forty soups and a clown painting. Commissary says no."]]}];var tt=i=>document.getElementById(i),M=l.S={state:"menu",level:0,kills:0,time:0,hitStop:0,hpMul:1,dmgMul:1},Ss=new URLSearchParams(location.search),is=parseInt(Ss.get("stress")||"0",10)||0;l.R.init(tt("game"));l.FX.init(l.R.scene);l.AI.init(l.R.scene);l.C.init(l.R.scene);var zp=new qo(l.R.scene,520);l.W.load("lot","Rookie");for(let i=0;i<24;i++)l.AI.spawn(l.pick(["rat","rat","gasser","diva","big"]),l.rand(10,78),l.rand(10,56));var Ts=Object.assign({name:"",gender:"male"},l.store.get("mo_player",{}));tt("nameIn").value=Ts.name;function Rs(i,e,t){let n=tt(i),s=r=>{for(let a of n.children)a.classList.toggle("on",a.dataset.v===String(r))};s(e),n.addEventListener("click",r=>{let a=r.target.closest("button");a&&(s(a.dataset.v),t(a.dataset.v))})}Rs("segGender",Ts.gender,i=>{Ts.gender=i});Rs("segQuality",l.settings.quality,i=>{l.settings.quality=i,l.saveSettings(),l.R.applyQuality(i)});Rs("segGore",l.settings.gore==="max"?2:l.settings.gore?1:0,i=>{l.settings.gore=i==="2"?"max":i==="1",l.saveSettings()});Rs("segPace",String(l.settings.pace||.8),i=>{l.settings.pace=parseFloat(i),l.saveSettings()});Rs("segAudio",l.settings.audio||(l.settings.muted?"off":"all"),i=>l.audio.setMode(i));Rs("segCuss",l.settings.cuss?1:0,i=>{l.settings.cuss=i==="1",l.saveSettings()});tt("startBtn").addEventListener("click",()=>ll(!1));tt("endlessBtn").addEventListener("click",()=>ll(!0));Rs("segDiff",l.settings.diff,i=>{l.settings.diff=i,l.saveSettings()});tt("nameIn").addEventListener("keydown",i=>{i.key==="Enter"&&ll()});function a_(){let i=Ap(),e=fu(0),t=!1;return{kind:"hybrid",noPad:!1,usesPad(n){return n===0&&!this.noPad},read(n){if(l.Touch.active)return l.Touch.read(n);if(this.noPad)return i.read(n);let s=e.read(n);(Math.abs(s.mx)+Math.abs(s.mz)>0||s.fire||s.spray||s.melee||s.dash)&&(t=!0);let r=i.read(n);return(l.Input.mouse.l||l.Input.mouse.r||Math.abs(r.mx)+Math.abs(r.mz)>0)&&(t=!1),t?s:r}}}function ll(i){M.endless=i===!0?{wave:1}:null,M.runBestStreak=0,M.combo=0,M.comboMul=1,M.run=null,l.audio.init(),Ts.name=l.cleanName(tt("nameIn").value),l.store.set("mo_player",Ts);for(let e of l.officers)e.remove();l.officers.length=0,l.officers.push(new oa(0,Ts.name,Ts.gender,a_())),M.runKills=0,M.rung=-1,M.ammo={},M.gun=null,M.startLevelIdx=Math.max(0,Math.min(ts.length-1,parseInt(Ss.get("level")||"1",10)-1)),tt("menu").classList.add("hidden"),tt("hud").classList.remove("hidden"),Gp(),As(M.endless?0:M.startLevelIdx||0),setTimeout(()=>{M.state==="play"&&(pi("SHOUT OUT","BERNARDO \xB7 DUSTIN DAVIS \xB7 CALEB ALANIZ",!1,3400),setTimeout(()=>M.state==="play"&&Ot("{caleb}","Shout out to {bernardo} and {dustin}. Let's get this overtime, family.",3.4),700))},3900)}var ns={},Lp=["Rodriguez","Johnson","Nguyen","Martinez","Thompson","Garcia","Williams","Reyes"];function o_(i){return l.officers.some(e=>e.device.kind==="pad"&&e.device.index===i||e.device.usesPad&&e.device.usesPad(i))}function l_(){let i=l.pads();for(let e=0;e<i.length;e++){let t=i[e];if(!t)continue;let n=!!(t.buttons[0]&&t.buttons[0].pressed||t.buttons[9]&&t.buttons[9].pressed),s=n&&!ns[e];if(ns[e]=n,!s||l.officers.length>=4||e===0&&l.officers[0].device.usesPad&&!(l.Input.keys.size||l.Input.mouse.l)||o_(e)&&!(e===0&&l.officers[0].device.usesPad))continue;e===0&&(l.officers[0].device.noPad=!0);let r=l.officers.length,a=l.officers[0],o=new oa(r,Lp[Math.random()*Lp.length|0],r%2?"female":"male",fu(e));o.x=a.x+1.2,o.z=a.z+.8,l.officers.push(o),Gp(),l.FX.float(o.x,2.8,o.z,`${l.rankName(o).toUpperCase()} CLOCKED IN`,"#"+l.PCOLORS[r].toString(16).padStart(6,"0"),20,2.2),Ot("CONTROL",`${l.rankName(o)} is on the tier. The DOC family grows.`,3)}}function c_(i){for(let e of l.officers){if(!e.down)continue;let t=l.officers.find(n=>!n.down&&(n.x-e.x)**2+(n.z-e.z)**2<2.6);t?(e.reviveT+=i,Math.random()<i*4&&l.FX.float(e.x,2.2,e.z,`PICKING UP ${e.name.toUpperCase()}... ${Math.round(e.reviveT*50)}%`,"#7dff6a",14,.5),e.reviveT>=2&&(e.down=!1,e.hp=e.maxHp*.5,e.iframes=1.5,e.reviveT=0,l.FX.float(e.x,2.6,e.z,"BACK UP! DOC FAMILY!","#7dff6a",20,1.6),t.score+=50)):e.reviveT=Math.max(0,e.reviveT-i)}}function As(i){M.level=i;let e=M.def=Object.assign({},ts[i]);(!M.endless||!M.run)&&(M.run=Mu()),Pi.frames.length=0,M.deathAt=null,M.killer=null;let t=l.diff(),n=M.endless?M.endless.wave:1,s=M.endless?1+(n-1)*.12:1;e.rate*=t.rate*s,e.live=Math.round(e.live*t.live*Math.min(1.8,s)),M.endless&&(e.quota=Math.round(e.quota*.6+n*10),e.title=`Wave ${n}: ${e.title}`,e.bossAt=e.boss?.5:e.bossAt),M.hpMul=t.hp*(M.endless?1+(n-1)*.15:1),M.endlessDmg=M.endless?1+(n-1)*.08:1,l.MAX_SWINGERS=t.swing+(M.endless?Math.min(4,Math.floor(n/3)):0),is&&Object.assign(e,{quota:1e9,live:is,rate:80}),l.FX.reset(),l.AI.reset(),l.C.reset(),Xn.reset(),ei.reset(),l.Boss.reset();let r=l.W.load(e.key,l.officers[0].name);l.officers.forEach((o,c)=>{o.reset(),o.x=r.start[0]+c*1.2,o.z=r.start[1]}),l.R.camTarget.set(r.start[0],0,r.start[1]),Object.assign(M,{state:"play",kills:0,prea:0,lootWait:0,lootLeft:0,wrangleT:0,wrangleSaid:!1,spawned:0,spawnAcc:0,time:0,doorT:3,radioT:14,lineIdx:0,radio:null,clearT:0,downT:0,galore:0,streak:[],galoreAt:-99,combo:0,comboMul:1,comboT:0,towerT:0,bestStreak:0,ricardoUsed:!1,ricardoT:Ss.has("ricardo")?3:0,crewT:l.rand(22,35),assaultT:30,compT:Es?5:Math.random()<.45?l.rand(60,120):0,compDone:0,compFirst:null,compLive:!1,compMissed:!1,compromised:0,compNames:[],bossSpawned:!1,bossDead:!1,slowmo:0,killerT:8}),l.W.alarm=e.cells?1:0,Fp(!1);let a=()=>{for(let o=0;o<40;o++){let c=l.rand(4,r.w*2-4),h=l.rand(4,r.h*2-4);if(!l.W.blocked(c,h)&&!l.W.wallAt(c,h))return[c,h]}return r.start};for(let o=0;o<e.tacos;o++)l.C.spawnPickup("taco",...a());for(let o=0;o<e.drinks;o++)l.C.spawnPickup("drink",...a());for(let o=0;o<2;o++)l.C.spawnPickup("zyn",...a());l.C.spawnPickup("chew",...a()),l.C.spawnPickup("ammo",...a()),M.power=null,M.powerDrop=!1,ei.spawn(Zo(0),...Qo(a,r));for(let o=0;o<(e.crews||0);o++){let[c,h]=Qo(a,r);l.AI.spawnCrew(c,h,4),M.spawned+=4}if(e.prea){let[o,c]=Qo(a,r);l.AI.spawn("prea",o,c),M.spawned++}if(r.lifters)for(let[o,c]of r.lifters){let h=l.AI.spawn(l.pick(["big","big","cholo","rat"]),o,c+.9);h.x=o,h.z=c+.9,h.posted=!0,h.crew="weightpit",h.shirtless=!0,h.yaw=Math.PI,M.spawned++}if(r.scares)for(let o of r.scares)o.done=!1;if(["lot","yard","night"].includes(e.key)&&!l.store.get("sa_gold",[]).includes(e.key)&&l.C.spawnPickup("gold",...Qo(a,r)),l.store.get("sa_bigbro",!1)&&setTimeout(()=>{if(M.state==="play"&&Xn.call("caleb")){let o=l.allies.find(c=>c.key==="caleb");o&&(o.t=1e9)}},4e3),r.caged){let o=Math.floor(r.caged.length/2)-2;Yf.forEach((c,h)=>{let u=r.caged[o+h],d=l.AI.spawn("killer",(u.i+1)*2,u.j*2+1);Object.assign(d,{caged:!0,killer:c,suit:c.suit,skin:c.skin,hair:c.hair,style:c.style,face:c.face,itemCol:c.item||0,hairOn:!0,x:(u.i+1)*2,z:u.j*2+1,chatT:l.rand(2,8)})})}pi(e.call?"STAFF ASSAULT":e.title,e.title+" \xB7 "+l.t(e.sub,l.officers[0].name),!!e.call,3600),e.call&&(Ot("CONTROL",e.call,3.6),gr(6)),ss(`Gear: ${yn[M.gun].label} + ${Ii[M.spray].label}${matchMedia("(pointer: coarse)").matches?"":" \xB7 Click the weapon bar or press 1-6 to switch"}`),al(),l.levelMusic(),l.R.precompile()}function Qo(i,e){for(let t=0;t<30;t++){let n=i();if((n[0]-e.start[0])**2+(n[1]-e.start[1])**2>196)return n}return i()}function gu(i){let e=0;for(let n in i)e+=i[n];let t=Math.random()*e;for(let n in i)if(t-=i[n],t<=0)return n;return"rat"}function h_(i){if(M.spawned<M.def.quota&&M.kills<M.def.quota||(M.wrangleT=(M.wrangleT||0)-i,M.wrangleT>0))return;M.wrangleT=1;let e=l.officers.filter(n=>!n.down);if(!e.length)return;let t=0;for(let n of l.AI.list){if(n.dead||n.caged||n.boss)continue;let s=e.some(o=>(o.x-n.x)**2+(o.z-n.z)**2<64),r=Math.hypot(n.x-(n.wx??n.x+99),n.z-(n.wz??n.z));if(n.wx=n.x,n.wz=n.z,n.stuckT=s?0:r<1.2?(n.stuckT||0)+1:Math.max(0,(n.stuckT||0)-1),n.stuckT<4)continue;let a=l.pick(e);for(let o=0;o<30;o++){let c=Math.random()*Math.PI*2,h=l.rand(6,10),u=a.x+Math.sin(c)*h,d=a.z+Math.cos(c)*h;if(!(l.W.blocked(u,d)||!l.W.los(a.x,a.z,u,d))){l.FX.cloud(n.x,1,n.z,0,0,1,9080726),n.x=u,n.z=d,n.vx=n.vz=0,n.posted=!1,n.freezeT=0,n.stuckT=0,n.wx=u,n.wz=d,l.FX.cloud(u,1,d,0,0,1.2,9080726),l.FX.float(u,2.6,d,"EXTRACTED!","#ffcf4a",18,1.6),t++;break}}}t&&!M.wrangleSaid&&(M.wrangleSaid=!0,l.say("CONTROL",l.pick(["We pulled the last one out of his cell. He is coming to you.","Cell extraction complete. Your straggler is incoming.","Found him hiding under his bunk. Sending him out."]),3))}l.rankName=i=>`${fi[Math.max(0,M.rung??0)].rank} ${i.name}`;function Fp(i){let e=M.def.rung||0;fi.forEach((o,c)=>{(M.runKills||0)>=o.at&&(e=Math.max(e,c))});let t=M.rung??-1;M.rung=Math.max(t,e);let n=fi[M.rung],s=(M.owned||[]).length;if(M.owned=[...new Set(fi.slice(0,M.rung+1).map(o=>o.gun))],M.ownedSpray=[...new Set(fi.slice(0,M.rung+1).map(o=>o.spray))],(!M.gun||!M.owned.includes(M.gun)||i&&M.owned.length>s)&&(M.gun=n.gun),(!M.spray||!M.ownedSpray.includes(M.spray)||i&&M.rung!==t)&&(M.spray=n.spray),M.nades=n.nades,rl.dirty=!0,!i||M.rung===t||t<0)return;let r=l.officers[0]?l.officers[0].name:"Rookie";if(n.rank!==fi[t].rank){pi("PROMOTED",`${n.title.toUpperCase()} ${r.toUpperCase()}`,!1,2600),l.audio.play("win");for(let o of l.officers)o.down||l.FX.float(o.x,3,o.z,`${n.rank} ${o.name}!`,"#ffcf4a",22,2.2)}else l.audio.play("pickup");Ot("CONTROL",l.t(n.news||"",r),4),ss(`NEW GEAR: ${yn[n.gun].label} + ${Ii[n.spray].label}${n.nades?" + Grenades (Q / Y / NADE)":""}`)}l.onKill=()=>{M.runKills=(M.runKills||0)+1,Fp(!0)};var Pi={frames:[],acc:0},Mu=()=>({dmgBy:{},killsBy:{},heads:0,limbs:0,dmg:0,time:0});function u_(i){if(Pi.acc+=i,Pi.acc<1/30)return;Pi.acc=0;let e=l.officers[0];if(!e)return;let t=[];for(let n of l.AI.list)n.caged||(n.x-e.x)**2+(n.z-e.z)**2>484||t.push(n,n.x,n.z,n.yaw,n.fall||0,n.dead?1:0,n.hop||0,n.swing||0,n.move||0,n.phase||0,n.tumble||0,n.flash||0,n.lost||null);for(Pi.frames.push({t:M.time,ms:t,os:l.officers.map(n=>[n.x,n.z,n.yaw,n.down?1:0,n.move||0]),al:l.allies.map(n=>[n,n.x,n.z,n.yaw])});Pi.frames.length&&M.time-Pi.frames[0].t>6;)Pi.frames.shift()}var d_=13;function Bp(i,e){for(let t=0;t<i.ms.length;t+=d_){let n=i.ms[t];n.x=i.ms[t+1],n.z=i.ms[t+2],n.yaw=i.ms[t+3],n.fall=i.ms[t+4],n.dead=!!i.ms[t+5],n.hop=i.ms[t+6],n.swing=i.ms[t+7],n.move=i.ms[t+8],n.phase=i.ms[t+9],n.tumble=i.ms[t+10],n.flash=i.ms[t+11],n.lost=i.ms[t+12]}i.os.forEach(([t,n,s,r,a],o)=>{let c=l.officers[o];c&&(Wn(c.model,e,r?0:a,0,!1,r),c.model.root.position.set(t,0,n),c.model.root.rotation.y=s)});for(let[t,n,s,r]of i.al)t.model&&(t.model.root.position.set(n,0,s),t.model.root.rotation.y=r)}var xu={rat:"a regular",gasser:"a gasser",shank:"a shank guy",big:"a big dude",diva:"a diva",ding:"a ding from the Bar",cholo:"a crew member",wheel:"a wheelchair",crutch:"a guy on crutches",prea:"the PREA question guy",ripper:"Big Foggy",ram:"a wheelchair",cup:"a cup of... something",spit:"spit",tray:"a chow tray",shoe:"a size 12 shoe",crutchThrow:"a flying crutch"},Dp={rat:["Taken out by the most regular dude on the tier. Embarrassing.","He was a nobody. Now he is a legend in B-pod."],gasser:["Gassed out. Your uniform is evidence now.","Death by cup. Do not ask what was in the cup."],shank:["Shanked with a toothbrush. A toothbrush.","He sharpened that thing for six months. Worth it, apparently."],big:["Folded like a lawn chair by a man who benches 405.","He did not even warm up first."],diva:["She did NOT chip a nail. You chipped everything.","Destroyed. Hair still perfect. Hers, not yours."],ding:["Taken down by a man who thinks he is the warden.","The TV told him to. The TV was right."],cholo:["Jumped by the crew. They had it planned since chow.","Wrong tier, jefe."],wheel:["Run over by a wheelchair. Medical is still laughing.","BEEP BEEP. You got lapped."],ram:["Run over by a wheelchair. Medical is still laughing.","BEEP BEEP. You got lapped."],crutch:["Beaten with a crutch. Then he threw it. Then he got another one.","One leg. Still whooped you."],ripper:["Lost in the fog. Big Foggy wins this round.","Somebody unplug that fog machine."],_:["Mandowed. Medical is on the way. Medical is on break.","The inmates are filing a grievance about how easy that was.","Your truck has been towed from the fire lane."]},f_={baton:"Baton",oc:"OC spray",dash:"Shoulder check",nade:"Grenades",hammer:"The Time Clock",taser:"Chain Taser",flash:"Flashlight"};l.onHurt=(i,e,t,n,s)=>{if(!M.run||i!==l.officers[0])return;let r=s==="ram"?"wheel":s;e=Math.min(e,Math.max(0,i.hp)),M.run.dmgBy[r]=(M.run.dmgBy[r]||0)+e,M.run.dmg+=e};l.onDown=(i,e,t,n)=>{M.deathAt=M.time,M.deathIdx=Math.max(0,l.officers.indexOf(i));let s=null,r=9;for(let a of l.AI.list){if(a.dead||a.caged)continue;let o=(a.x-e)**2+(a.z-t)**2;o<r&&(r=o,s=a)}M.killer={m:s,kind:n,type:s?s.type:n}};l.onKillBy=(i,e)=>{if(!M.run||i!==l.officers[0])return;let t=e==="ball"||e==="buck"?(M.power&&yn[M.power.key]||yn[M.gun]||yn.pepperball).label:f_[e]||"Bare hands";M.run.killsBy[t]=(M.run.killsBy[t]||0)+1};var Hp=()=>{let i=M.run||Mu(),e=M.killer||{},t=e.kind==="cup"||e.kind==="spit"||e.kind==="tray"||e.kind==="shoe"?e.kind:e.type,n=Object.entries(i.dmgBy).sort((o,c)=>c[1]-o[1])[0],s=Object.entries(i.killsBy).sort((o,c)=>c[1]-o[1])[0],r=Math.floor(i.time/60),a=String(Math.floor(i.time%60)).padStart(2,"0");return[["\u2014\u2014 DEATH RECAP \u2014\u2014",""],["Taken out by",(xu[t]||"the whole tier").replace(/^./,o=>o.toUpperCase())],["Cause of death",l.pick(Dp[t]||Dp._)],["Your nemesis",n?`${(xu[n[0]]||n[0]).replace(/^./,o=>o.toUpperCase())} (${Math.round(n[1]/Math.max(1,i.dmg)*100)}% of your damage)`:"Nobody. You tripped."],["Best weapon",s?`${s[0]} (${s[1]} takedowns)`:"Your mouth (0 takedowns)"],...l.settings.gore?[["Heads popped",String(i.heads)],["Limbs removed",String(i.limbs)]]:[],["Damage taken",String(Math.round(i.dmg))],["Time on shift",`${r}:${a}`]].map(([o,c])=>[o,l.censor(c)])},bt=null;function p_(i){let e=(M.deathAt??M.time)-2.2,t=(M.deathAt??M.time)+.7,n=Pi.frames.filter(h=>h.t>=e&&h.t<=t);if(n.length<10||Ss.has("nodeathcam")){i();return}M.state="deathcam";let s=document.createElement("div");s.id="dcam",s.innerHTML=`<div style="position:fixed;left:0;right:0;top:0;height:11vh;background:#000;z-index:7"></div><div style="position:fixed;left:0;right:0;bottom:0;height:11vh;background:#000;z-index:7"></div><div style="position:fixed;left:24px;top:2.5vh;z-index:8;font:700 22px Impact,'Arial Black',sans-serif;letter-spacing:3px;color:#ff3b2a">\u25CF DEATH CAM <span class="dspd" style="color:#fff;font-size:14px;letter-spacing:1px"></span></div><div class="dwho" style="position:fixed;left:0;right:0;bottom:3vh;z-index:8;text-align:center;font:700 24px Impact,'Arial Black',sans-serif;letter-spacing:2px;color:#fff"></div><div style="position:fixed;right:24px;top:3vh;z-index:8;font:600 13px system-ui;color:#9aa0ab">Click / Enter / A to skip</div><div class="dtag" style="position:fixed;z-index:8;left:0;top:0;font:700 15px Impact,sans-serif;letter-spacing:1px;color:#fff;background:#c8241c;padding:2px 8px;border-radius:3px;white-space:nowrap;opacity:0">KILLED BY</div>`,document.body.appendChild(s),tt("hud").style.visibility="hidden",qt&&(qt.style.visibility="hidden");let r=M.killer||{};s.querySelector(".dwho").textContent=`TAKEN OUT BY ${(xu[r.kind==="cup"||r.kind==="spit"?r.kind:r.type]||"THE WHOLE TIER").toUpperCase()}`;let a=m_();l.R.setGrade({contrast:1.15,sat:.45,vignette:.7,tint:[1.12,.88,.86]});let o=l.R.camOffset.clone();bt={frames:n,i:0,t:n[0].t,done:i,ui:s,off:o,look:a,ang:0,hold:0,skip:!1},l.audio.duck(!0),l.audio.play("alarm",.6);let c=h=>{bt&&(h.type==="keydown"&&!["Enter","Space","Escape"].includes(h.code)||(bt.skip=!0))};bt.skipFns=c,addEventListener("keydown",c),addEventListener("mousedown",c)}var m_=()=>Object.assign({},l.R.gradeLook||{});function g_(i){if(!bt)return;let e=Math.abs(bt.t-(M.deathAt??0))<.3,t=e?.25:.6;for(bt.ui.querySelector(".dspd").textContent=`\u25B6 REPLAY ${t}x`,bt.t+=i*t;bt.i<bt.frames.length-1&&bt.frames[bt.i+1].t<=bt.t;)bt.i++;let n=bt.frames[bt.i];Bp(n,i*t);let[s,r]=n.os[M.deathIdx||0]||n.os[0];bt.ang+=i*.35,l.R.camOffset.set(Math.sin(bt.ang)*8.5,8.5,Math.cos(bt.ang)*8.5),l.R.follow(s,r,i,1/(l.R.zoom||1)),e&&Math.random()<.2&&(l.R.shake=Math.max(l.R.shake,.15));let a=M.killer&&M.killer.m,o=bt.ui.querySelector(".dtag");if(a&&!a.noRender){let[h,u,d]=l.R.worldToScreen(a.x,2.6*(a.scale||1),a.z);o.style.transform=`translate(${h|0}px, ${u|0}px) translate(-50%, -100%)`,o.style.opacity=d?1:0}bt.i>=bt.frames.length-1&&(bt.hold+=i),(bt.skip||bt.hold>.7)&&x_()}function x_(){let i=bt;bt=null,Bp(i.frames[i.frames.length-1],.016),l.R.camOffset.copy(i.off),l.R.setGrade(i.look),l.audio.duck(!1),removeEventListener("keydown",i.skipFns),removeEventListener("mousedown",i.skipFns),i.ui.remove(),tt("hud").style.visibility="",qt&&(qt.style.visibility=""),i.done()}var y_=[{at:10,name:"DOUBLE SHIFT",sub:"x1.5 SCORE \xB7 HEALED UP",fn:()=>{for(let i of l.officers)i.down||(i.hp=Math.min(i.maxHp,i.hp+30),i.energy=100)}},{at:20,name:"TOWER SUPPORT",sub:"TOWER ONE IS AWAKE",fn:()=>{M.towerT=9,Ot("TOWER ONE",l.pick(["I'm awake. I'm awake! Tower One on the glass. I got you.","Tower One here. Somebody tell my Sergeant I was NOT asleep.","Tower One. Put your heads down, family."]),3.4)}},{at:35,name:"LOCKDOWN",sub:"EVERYBODY ON THE GROUND",fn:()=>{Np(14),Ot("CONTROL","LOCKDOWN, LOCKDOWN! EVERYBODY ON THE GROUND! NOW!",3),gr(3)}},{at:50,name:"ALL-CALL BACKUP",sub:"SARGE SENT EVERYBODY",fn:()=>{for(let i of["caleb","dustin","bernardo"])Xn.call(i)}},{at:75,name:"MANDATORY OVERTIME",sub:"THE CLOCK IS YOURS",fn:()=>{for(let i of l.officers)i.ot=100;M.towerT=Math.max(M.towerT||0,8)}},{at:100,name:"LEGEND OF THE DOC",sub:"x5 SCORE \xB7 THEY WILL TELL STORIES",fn:()=>{Np(20),M.towerT=14;for(let i of l.officers)i.hp=i.maxHp,i.ot=100}}];function Np(i){for(let e of l.officers){l.grid.query(e.x,e.z,i,sl);for(let t of sl)!t.dead&&!t.boss&&!t.caged&&(t.freezeT=Math.max(t.freezeT||0,3.5),t.swing=0)}l.FX.float(l.officers[0].x,3,l.officers[0].z,"ON THE GROUND!","#ffcf4a",26,2)}var sl=[],v_=i=>i>=100?5:i>=75?4:i>=50?3:i>=35?2.5:i>=20?2:i>=10?1.5:1;l.streakKill=i=>{if(M.state!=="play"||M.noStreak)return;M.combo=(M.combo||0)+1,M.comboT=Math.max(1.8,3.2-M.combo*.012),M.comboMul=v_(M.combo),M.bestStreak=Math.max(M.bestStreak||0,M.combo),M.runBestStreak=Math.max(M.runBestStreak||0,M.combo);let e=y_.find(t=>t.at===M.combo)||(M.combo>100&&M.combo%50===0?{name:`${M.combo} STREAK`,sub:"TOWER SUPPORT AGAIN",fn:()=>{M.towerT=10}}:null);if(e){pi(e.name,`${M.combo} STREAK \xB7 ${e.sub}`,!0,2400),e.fn(),l.audio.sting&&l.audio.sting("clear"),l.R.shake=Math.max(l.R.shake,.4);for(let t of l.officers)t.down||(t.score+=M.combo*25)}mr(!0)};l.streakHit=()=>{M.combo>0&&(M.comboT-=l.settings.diff==="lifer"?.8:l.settings.diff==="pro"?.5:.2)};l.streakBreak=i=>{if(!(M.combo>=5)){M.combo=0,M.comboMul=1,mr();return}l.FX.float(l.officers[0].x,3,l.officers[0].z,`STREAK OVER \xB7 ${M.combo}${i==="DOWN"?" \xB7 YOU WENT DOWN":""}`,"#ff8a6a",20,2);let e=l.store.get("sa_beststreak",0);M.combo>e&&(l.store.set("sa_beststreak",M.combo),l.FX.float(l.officers[0].x,3.6,l.officers[0].z,`NEW PERSONAL BEST STREAK: ${M.combo}!`,"#ffd34d",24,2.6)),M.combo=0,M.comboMul=1,mr()};function __(i){if(!(M.towerT>0)||(M.towerT-=i,M.towerShot=(M.towerShot||0)-i,M.towerShot>0))return;M.towerShot=.32;let e=l.officers.find(a=>!a.down);if(!e)return;l.grid.query(e.x,e.z,16,sl);let t=l.pick(sl.filter(a=>!a.dead&&!a.caged&&!a.boss));if(!t)return;let n=t.x-6,s=14,r=t.z-10;for(let a=0;a<=10;a++){let o=a/10;l.FX.glow.spawn(l.lerp(n,t.x,o),l.lerp(s,1.3,o),l.lerp(r,t.z,o),0,0,0,.12,.07,16773808,0)}M.noStreak=!0,l.AI.damage(t,9999,n,r,14,"nade",e),M.noStreak=!1,l.audio.play("rifle",.5)}var qt=null;function mr(i){qt||(qt=document.createElement("div"),qt.id="combo",qt.style.cssText='position:fixed;right:18px;top:38%;z-index:6;text-align:right;pointer-events:none;font-family:Impact,"Arial Black",sans-serif;color:#fff;text-shadow:0 3px 0 #000,0 0 18px rgba(255,80,40,.6);transition:transform .08s;opacity:0',qt.innerHTML='<div class="cn" style="font-size:58px;line-height:1"></div><div class="cl" style="font-size:15px;letter-spacing:3px;color:#ffcf4a">STREAK</div><div class="cm" style="font-size:22px;color:#ff7a2a"></div><div style="margin-top:6px;width:150px;height:6px;background:rgba(0,0,0,.5);border-radius:3px;margin-left:auto;overflow:hidden"><i class="cb" style="display:block;height:100%;background:linear-gradient(90deg,#ff3a1a,#ffcf4a)"></i></div><div class="cbest" style="font:600 11px system-ui;color:#9aa0ab;margin-top:4px"></div>',document.body.appendChild(qt));let e=M.combo||0;qt.style.opacity=e>=2&&M.state==="play"?1:0,qt.querySelector(".cn").textContent=e,qt.querySelector(".cm").textContent=(M.comboMul||1)>1?`x${M.comboMul} SCORE`:"",qt.querySelector(".cbest").textContent=`BEST ${Math.max(e,l.store.get("sa_beststreak",0))}`,i&&(qt.style.transform="scale(1.18)",setTimeout(()=>qt&&(qt.style.transform="scale(1)"),80))}function M_(i){__(i),M.combo>0&&(M.comboT-=i,M.comboT<=0?l.streakBreak():qt&&(qt.querySelector(".cb").style.width=`${Math.max(0,Math.min(1,M.comboT/3.2))*100}%`))}var b_=["Porters to the tier with the BIG mop bucket.","Control to all porters: bring every mop. Every one.","Medical is asking if that was one inmate or six. Nobody knows.",'Maintenance says the floor drain is "full." What does that MEAN.',"Somebody tell laundry. Somebody tell laundry RIGHT NOW.","That is going in the training video. As a warning."];l.goreStreak=(i,e)=>{if(!l.settings.gore||M.state!=="play")return;let t=M.time;for((M.streak=M.streak||[]).push(t);M.streak.length&&t-M.streak[0]>3;)M.streak.shift();if(M.streak.length>=6&&t-(M.galoreAt||-99)>12){M.galoreAt=t,M.galore=(M.galore||0)+1,M.streak.length=0,pi("GORE GALORE!",l.pick(["MOP BUCKET NEEDED","CLEANUP ON EVERY AISLE","THE PORTERS QUIT","HAZMAT IS ON THE WAY"]),!0,2200),M.slowmo=Math.max(M.slowmo,.35),l.R.shake=Math.max(l.R.shake,.5);let n=l.officers[0];l.FX.bloodRain(n?n.x:i,n?n.z:e),l.FX.splat(1),l.audio.play("slam",.9),setTimeout(()=>M.state==="play"&&Ot("CONTROL",l.pick(b_),3.2),900);for(let s of l.officers)s.down||(s.score+=500)}};l.showCard=(...i)=>pi(...i);function pi(i,e,t,n){tt("lvlT").textContent=i,tt("lvlT").classList.toggle("alarm",!!t),tt("lvlS").textContent=e,tt("levelcard").classList.add("show"),clearTimeout(pi.h),pi.h=setTimeout(()=>tt("levelcard").classList.remove("show"),n)}function gr(i){l.W.alarmT=i,l.audio.play("siren"),l.audio.sting("assault"),document.body.classList.add("assault"),clearTimeout(gr.h),gr.h=setTimeout(()=>document.body.classList.remove("assault"),i*1e3*.7)}l.levelMusic=function(){if(l.officers.some(i=>i.otT>0))return l.audio.music("overtime",!0);if(l.Boss.active&&!l.Boss.active.dead)return l.audio.music("boss",!0);l.audio.music(M.def?M.def.music||M.def.key:"menu")};function w_(i){if(M.moodT=(M.moodT||0)-i,M.scareMusT=(M.scareMusT||0)-i,M.moodT>0)return;M.moodT=.5;let e=0;for(let n of l.AI.list)if(!(n.dead||n.caged||n.posted)){for(let s of l.officers)if(!s.down&&(n.x-s.x)**2+(n.z-s.z)**2<144){e++;break}}let t=l.W.alarmT>0||e>=14||M.scareMusT>0||l.officers.some(n=>n.down);l.audio.intensity(t?2:e>=3?1:0),l.audio.musicName()==="boss"&&(!l.Boss.active||l.Boss.active.dead)&&l.levelMusic()}var E_=[{what:"laundry",type:"ding",text:"OUT OF THE LAUNDRY CART!",line:"He has been in the laundry cart since TUESDAY."},{what:"vent",type:"crutch",text:"FROM THE CEILING VENT!",line:"How did he get in the vent with a CRUTCH?!"},{what:"mannequin",type:"rat",text:"THE DUMMY MOVED!",line:"That is not the count dummy. That is NOT the count dummy."},{what:"bunk",type:"shank",text:"UNDER THE BUNK!",line:"He was under the bunk. The whole time. Breathing."},{what:"chair",type:"wheel",text:"WHEELCHAIR IN THE DARK!",line:"You hear wheels. Slowly. Getting closer."}];function T_(i){let e=l.W.def;if(!(!e||!e.scares)){for(let t of e.scares){if(t.done)continue;let n=l.officers.find(h=>!h.down&&(h.x-t.x)**2+(h.z-t.z)**2<12);if(!n)continue;t.done=!0;let s=l.pick(E_),r=Math.atan2(n.ax,n.az)+l.rand(-.6,.6),a=n.x+Math.sin(r)*2.2,o=n.z+Math.cos(r)*2.2,c=l.AI.spawn(s.type,l.W.blocked(a,o)?t.x:a,l.W.blocked(a,o)?t.z:o);if(M.spawned++,s.what==="vent"&&(c.hop=2.6,c.vy=0),c.swingCD=.6,c.scareT=1.5,l.FX.float(c.x,2.8,c.z,s.text,"#ff4040",26,1.6),l.R.shake=.9,l.R.split=1,l.R.flashBoost=1,l.audio.play("scare",1),l.audio.intensity(2),M.scareMusT=6,Math.random()<.5)c.countCheck=!0,Ot("CONTROL","TIER CHECK! Flash him to clear count! "+s.line,3);else{Ot("RADIO",s.line+" He brought friends.",3);for(let h=0;h<3;h++){let u=l.rand(0,l.TAU),d=l.AI.spawn(l.pick(["rat","ding","shank"]),t.x+Math.cos(u)*4,t.z+Math.sin(u)*4);d.x=l.W.blocked(d.x,d.z)?t.x:d.x,d.z=l.W.blocked(d.x,d.z)?t.z:d.z,M.spawned++}}}for(let t of l.AI.list)if(!(!t.countCheck||t.dead))if(t.scareT-=i,t.flashedT>0){t.countCheck=!1,l.FX.float(t.x,2.8,t.z,"COUNT CLEARS! +150","#7dff6a",22,1.6);let n=l.officers.find(s=>!s.down);l.AI.damage(t,9999,n?n.x:t.x,n?n.z:t.z,3,"flash",n||null),n&&(n.score+=150),l.audio.play("count")}else t.scareT<=0&&(t.countCheck=!1,Ot("CONTROL","Count did NOT clear. He is loose. Get him.",2.5))}}function S_(i){let e=M.def;if(is||M.spawned>=e.quota||!e.units||(M.assaultT-=i,M.assaultT>0))return;M.assaultT=l.rand(40,55);let t=l.pick(e.units),n=/BAR/.test(t);Ot("CONTROL",`STAFF ASSAULT, ${t}! STAFF ASSAULT, ${t}! ALL AVAILABLE STAFF RESPOND!`,3.8),pi("STAFF ASSAULT",t,!0,2600),gr(7),n&&setTimeout(()=>{M.state==="play"&&Ot("RADIO",l.pick(Kf),3.5)},4e3);let s=l.W.doors.filter(c=>!c.opening);for(let c=0;c<2&&s.length;c++)l.W.openDoor(s.splice(l.randi(0,s.length-1),1)[0]);let r=l.W.spawns.concat(l.W.doors.filter(c=>c.opening).map(c=>c.spawn)),a=r.filter(c=>l.officers.every(h=>(h.x-c.x)**2+(h.z-c.z)**2>64)),o=l.randi(8,14);for(let c=0;c<o&&M.spawned<e.quota&&l.AI.liveCount()<e.live+12;c++){let h=l.pick(a.length?a:r);if(!h)break;l.AI.spawn(n&&Math.random()<.75?"ding":gu(e.mix),h.x+l.rand(-.6,.6),h.z+l.rand(-.6,.6)),M.spawned++}}var Es=Ss.has("both")?"both":Ss.has("caughren")?"caughren":Ss.has("bingham")?"bingham":null;function A_(i){if(is||!M.compT)return;let e=l.allies.filter(h=>h.passive);if(M.compLive){if(M.compRumorT-=i,M.compRumorT<=0&&e.some(h=>h.state==="cuddle")){M.compRumorT=l.rand(2.5,4);let h=l.AI.list.find(u=>!u.dead&&!u.bf&&Math.random()<.3);h?l.FX.float(h.x,2.8,h.z,l.pick(ap.concat(e.map(u=>`${u.d.back==="COUNSELOR"?"BINGBING":"COUGHRONNY"}! ${u.d.back==="COUNSELOR"?"BINGBING":"COUGHRONNY"}!`))),"#ffb37a",15,2):Ot("RADIO",l.pick(eu),2.5)}if(M.compWait-=i,M.compWait<=0)for(let h of e)h.state==="cuddle"&&(h.walkOut("I was never here."),M.compMissed=!0);e.length||(M.compLive=!1);return}if(M.compT-=i,M.compT>0)return;if(M.compT=M.compDone>=2?0:l.rand(70,110),!Es&&M.compDone>=1&&Math.random()<.5){M.compT=0;return}let t=M.compDone===0&&(Es==="both"||!Es&&Math.random()<.15)?["caughren","bingham"]:[Es&&Es!=="both"&&M.compDone===0?Es:M.compFirst?M.compFirst==="caughren"?"bingham":"caughren":l.pick(["caughren","bingham"])];M.compFirst=M.compFirst||t[0],M.compDone+=t.length;let n=l.W.doors.filter(h=>!h.opening),s=n.length?l.pick(n):null,r=l.W.spawns.filter(h=>l.officers.every(u=>(u.x-h.x)**2+(u.z-h.z)**2>100)),a=s?s.spawn:l.pick(r.length?r:l.W.spawns);if(!a)return;s&&l.W.openDoor(s);let o=s?`CELL ${l.randi(10,48)}`:t.length>1?"THE CHAPLAIN'S CLOSET":t[0]==="bingham"?"COUNSELOR'S OFFICE":"THE SUPPLY CLOSET";t.forEach((h,u)=>{let d=a.x+(u?1.6:0),f=a.z,p=l.AI.spawn(l.pick(["big","cholo","rat"]),d+.42,f);p.bf=!0,p.freezeT=999,p.hp*=2.5,p.maxHp=p.hp;let y=Xn.call(h,d-.05,f);y&&(y.bf=p)}),M.compLive=!0,M.compWait=40,M.compRumorT=3;let c=t.map(h=>l.CREW[h].toUpperCase()).join(" AND ");Ot("CONTROL",t.length>1?`ALL STAFF RESPOND, ${o}. ${c} ARE BOTH IN THERE. TOGETHER. WITH HIM.`:t[0]==="caughren"?`ALL AVAILABLE STAFF RESPOND TO ${o}. C/O COUGHRONNY IS NOT ANSWERING HER RADIO. AGAIN.`:`RESPOND TO ${o}. COUNSELOR BINGBING HAS BEEN IN A 'ONE-ON-ONE' FOR THREE HOURS.`,4.2),pi("STAFF COMPROMISED",`${o} \xB7 ${c}`,!0,3200),gr(5),setTimeout(()=>{M.state==="play"&&Ot("RADIO",l.pick(eu),3)},4600)}function R_(i){let e=M.def,t=l.AI.liveCount();if(e.cells&&(M.doorT-=i,M.doorT<=0&&M.spawned<e.quota)){M.doorT=l.rand(1.5,3);let s=l.W.doors.filter(r=>!r.opening);if(s.length){let r=l.pick(s);l.W.openDoor(r);let a=l.randi(1,2);for(let o=0;o<a&&M.spawned<e.quota;o++)l.AI.spawn(gu(e.mix),r.spawn.x,r.spawn.z),M.spawned++}}if(M.spawned>=e.quota||t>=e.live)return;M.spawnAcc+=i*e.rate*(is?1:Math.min(1.6,.7+M.time/60));let n=l.W.spawns.concat(l.W.doors.filter(s=>s.open>=1).map(s=>s.spawn));for(;M.spawnAcc>=1&&M.spawned<e.quota&&l.AI.liveCount()<e.live;){M.spawnAcc-=1;let s=n.filter(a=>l.officers.every(o=>(o.x-a.x)**2+(o.z-a.z)**2>64)),r=l.pick(s.length?s:n);if(!r)break;l.AI.spawn(gu(e.mix),r.x,r.z),M.spawned++}}l.targets=[];function C_(){if(M.powerDrop||M.kills<M.def.quota*.4)return;M.powerDrop=!0;let i=l.officers.find(e=>!e.down)||l.officers[0];for(let e=0;e<20;e++){let t=Math.random()*l.TAU,n=i.x+Math.cos(t)*6,s=i.z+Math.sin(t)*6;if(!l.W.blocked(n,s)){l.C.spawnWeapon(n,s);break}}Ot("CONTROL","Armory dropped something heavy on the floor near you. Look for the pink light. Go HAM.",3.6)}function I_(i){if(C_(),M.calebDownCD=(M.calebDownCD||0)-i,M.calebDownCD<=0&&l.officers.some(t=>t.down)&&!l.allies.some(t=>t.key==="caleb")&&(M.calebDownCD=40,Xn.call("caleb")),M.ricardoT>0&&(M.ricardoT-=i)<=0&&(M.ricardoUsed=!0,Xn.call("ricardo")),M.calebSwarmCD=(M.calebSwarmCD||0)-i,M.calebSwarmCD<=0&&!l.allies.some(t=>t.key==="caleb"))for(let t of l.officers){if(t.down)continue;let n=0;for(let s of l.AI.list)!s.dead&&!s.caged&&(s.x-t.x)**2+(s.z-t.z)**2<36&&n++;if(n>=12){M.calebSwarmCD=45,Xn.call("caleb");break}}if(M.crewT-=i,M.crewT<=0)if(M.crewT=l.rand(35,55),!M.ricardoUsed&&Math.random()<.12)M.ricardoUsed=!0,Xn.call("ricardo");else{let t=["caleb","dustin","bernardo"].filter(n=>!l.allies.some(s=>s.key===n));t.length&&Xn.call(l.pick(t))}let e=M.def;if(e.boss&&!M.bossSpawned&&M.kills>=e.quota*e.bossAt){M.bossSpawned=!0;let t=l.W.doors.find(n=>!n.opening)||l.W.doors[0];if(t)l.W.openDoor(t),l.Boss.spawn(t.spawn.x,t.spawn.z);else{let n=l.pick(l.W.spawns);l.Boss.spawn(n.x,n.z)}}}function Ot(i,e,t=4){let n=l.officers[0]?l.officers[0].name:"Rookie";M.radio={t},tt("radWho").textContent=l.t(i,n),tt("radTxt").textContent=l.censor(l.t(e,n)),tt("radio").classList.add("show"),l.audio.play("radio")}l.say=Ot;function P_(i){let e=M.def.lines;if(M.radio&&(M.radio.t-=i,M.radio.t<=0&&(M.radio=null,tt("radio").classList.remove("show"))),M.lineIdx<e.length&&M.time>=e[M.lineIdx][0]&&!M.radio){let[,t,n]=e[M.lineIdx++];Ot(t,n),M.radioT=Math.max(M.radioT,10);return}if(M.def.key==="row"){M.killerT-=i;let t=l.AI.list.filter(n=>n.caged);if(M.killerT<=0&&!M.radio&&t.length){M.killerT=l.rand(9,15);let n=l.pick(t).killer;Ot(`INTERCOM \xB7 ${n.name}`,l.pick(n.lines),4);return}for(let n of t){if(n.chatT-=i,n.chatT>0)continue;l.officers.some(r=>!r.down&&(r.x-n.x)**2+(r.z-n.z)**2<49)?(n.chatT=l.rand(6,10),l.FX.float(n.x,2.4,n.z,`${n.killer.name}: ${l.pick(n.killer.lines)}`,"#9fe6b8",14,3)):n.chatT=1}}if(M.radioT-=i,M.radioT<=0&&!M.radio){M.radioT=l.rand(16,26);let[t,n]=l.pick(Of);Ot(t,n)}}var yu=[];function Gp(){let i=tt("players");i.textContent="",yu.length=0;for(let e of l.officers){let t=document.createElement("div");t.className="pcard",t.style.borderLeftColor="#"+l.PCOLORS[e.slot].toString(16).padStart(6,"0");let n=document.createElement("div");n.className="nm";let s=document.createElement("span");s.textContent=l.rankName(e).toUpperCase();let r=document.createElement("span");n.append(s,r);let a=document.createElement("div");a.className="bar hp",a.append(document.createElement("i"));let o=document.createElement("div");o.className="bar en",o.append(document.createElement("i"));let c=document.createElement("div");c.className="bar ot",c.append(document.createElement("i"));let h=document.createElement("div");h.className="buffs";let u=document.createElement("div");u.className="gear",t.append(n,a,o,c,h,u),i.append(t),yu.push({o:e,name:s,score:r,hp:a.firstChild,en:o.firstChild,ot:c.firstChild,bf:h,gear:u,gearKey:""})}}var el=0,mu=0,tl=60,nl=0;function L_(i){rl();for(let s of yu){s.hp.style.width=s.o.hp/s.o.maxHp*100+"%",s.en.style.width=s.o.energy+"%",s.ot.style.width=(s.o.otT>0?s.o.otT/12*100:s.o.ot||0)+"%",s.ot.parentNode.classList.toggle("full",s.o.ot>=100||s.o.otT>0),s.score.textContent=s.o.score+" pts";let r=l.rankName(s.o).toUpperCase();s.name.textContent!==r&&(s.name.textContent=r);let a=[];s.o.otT>0?a.push(`MANDATORY OVERTIME ${Math.ceil(s.o.otT)}s`):s.o.ot>=100&&a.push(s.o.device.kind==="pad"?"OVERTIME READY [B]":s.o.device.kind==="kbm"?"OVERTIME READY [F]":"OVERTIME READY [OT]"),s.o.sprinting&&a.push("SPRINT"),s.o.tacoT>0&&a.push(`TACO POWER ${Math.ceil(s.o.tacoT)}s`),s.o.drinkT>0&&a.push(`ENERGY ${Math.ceil(s.o.drinkT)}s`),s.o.zynT>0&&a.push(`POUCH HEAT ${Math.ceil(s.o.zynT)}s`),s.o.slowT>0&&a.push("GASSED"),s.o.rallyT>0&&a.push(`RALLY ${Math.ceil(s.o.rallyT)}s`),s.o.down&&a.push("DOWN"),s.bf.textContent=a.join(" \xB7 ");let o=Object.values(s.o.gear).map(c=>c?c.name+c.rarity:"-").join("|");if(o!==s.gearKey){s.gearKey=o,s.gear.textContent="";for(let c of Object.keys(ci)){let h=s.o.gear[c],u=document.createElement("span");u.className="chip",u.textContent=h?h.name:`no ${ci[c].label.toLowerCase()}`,u.title=h?`${xn[h.rarity].label} \xB7 ${hu(h)}`:"Find gear on the map",h&&(u.style.borderColor=xn[h.rarity].css,u.style.color=xn[h.rarity].css),s.gear.append(u)}}}let e=l.Boss.active;tt("bossbar").classList.toggle("hidden",!e||e.dead),e&&!e.dead&&(tt("bossFill").style.width=Math.max(0,e.hp)/e.maxHp*100+"%"),tt("joinHint").classList.toggle("hidden",l.officers.length>=4||!Rp().length),tt("objT").textContent=M.def.title.toUpperCase();let t=Math.max(0,M.def.quota-M.kills);tt("objC").textContent=is?`STRESS TEST \xB7 ${l.AI.liveCount()} live`:t>0?`${M.kills} / ${M.def.quota} inmates down`:M.lootLeft>0?`Grab your gear! Clocking out in ${M.lootLeft}s`:`Clear the stragglers: ${l.AI.liveCount()} left`;let n=Math.max(...l.officers.map(s=>s.hurtT));if(tt("vignette").style.opacity=Math.min(1,n*2.2+(l.officers.some(s=>!s.down&&s.hp<30)?.35:0)),el+=i,mu++,el>=.5){tl=Math.round(mu/el),el=0,mu=0,tt("fps").textContent=`${tl} FPS \xB7 ${l.R.qName.toUpperCase()}${l.R.dyn<1?" "+Math.round(l.R.dyn*100)+"%":""} \xB7 ${l.AI.liveCount()} inmates`,is||l.R.tuneResolution(tl,.5),nl=tl<38&&l.R.dyn<=.6?nl+.5:0;let s=l.QUALITY_ORDER.indexOf(l.R.qName);nl>=4&&s>0&&!is&&(nl=0,l.R.applyQuality(l.QUALITY_ORDER[s-1]),ss(`Graphics lowered to ${l.R.qName} to keep it smooth`))}}l.toast=i=>ss(i);var vu=["pepperball","launcher","shotgun","ar"],Vp=["oc","vapor"],kp={pepperball:"PEPPERBALL",launcher:"40MM",shotgun:"SHOTGUN",ar:"AR-15",oc:"ORANGE OC",vapor:"OC VAPOR"},Up=(i,e)=>(fi.find(t=>t[e]===i)||{}).at;function rl(){let i=tt("wbar");if(i){if(rl.dirty||!i.firstChild){rl.dirty=!1;let e=(t,n,s,r,a,o)=>`<button class="ws${a?"":" locked"}" data-kind="${n}" data-key="${s}"><span class="wk">${t}</span><span class="wn">${r}</span><span class="wl">${a?n==="gun"?'<i class="pips"></i>':"":"\u{1F512} "+o+" takedowns"}</span></button>`;i.innerHTML=vu.map((t,n)=>e(n+1,"gun",t,kp[t],(M.owned||[]).includes(t),Up(t,"gun"))).join("")+'<span class="wsep"></span>'+Vp.map((t,n)=>e(n+5,"spray",t,kp[t],(M.ownedSpray||[]).includes(t),Up(t,"spray"))).join("")+`<span class="wsep"></span><button class="ws nade${M.nades?"":" locked"}" data-kind="nade"><span class="wk">Q</span><span class="wn">Grenades</span><span class="wl">${M.nades?"Right here!":"\u{1F512} Lieutenant"}</span></button><button class="ws power hidden" data-kind="power"><span class="wk">!</span><span class="wn"></span><span class="wl"></span></button>`}for(let e of i.children)if(e.dataset.kind==="gun"){e.classList.toggle("on",M.gun===e.dataset.key&&!M.power);let t=e.querySelector(".pips"),n=(M.ammo||{})[e.dataset.key]||0;t&&t.dataset.lv!==String(n)&&(t.dataset.lv=n,t.textContent=n?"\u2605".repeat(n)+" "+Jo[n].name:"Standard ammo")}else if(e.dataset.kind==="spray")e.classList.toggle("on",M.spray===e.dataset.key);else if(e.dataset.kind==="nade"){let t=l.officers[0];e.classList.toggle("cool",!!(t&&t.nadeCD>0))}else e.dataset.kind==="power"&&(e.classList.toggle("hidden",!M.power),M.power&&(e.children[1].textContent=yn[M.power.key].label,e.children[2].textContent=`GO HAM ${Math.ceil(M.power.t)}s`,e.style.setProperty("--p",M.power.t/M.power.max)))}}function il(i,e){if(M.state==="play"){if(i==="gun"&&(M.owned||[]).includes(e))M.gun!==e&&(M.gun=e,l.audio.play("pickup",.5));else if(i==="spray"&&(M.ownedSpray||[]).includes(e))M.spray=e;else if(i==="nade")M.nades?ss("Grenades: press Q (pad Y) to throw toward your aim."):ss("Grenades unlock at Lieutenant (130 takedowns).");else return;i!=="nade"&&l.FX.float(l.officers[0].x,2.7,l.officers[0].z,i==="gun"?yn[e].label:Ii[e].label,"#9fd0ff",16,1)}}function D_(){let i=tt("wbar");!i||i.dataset.init||(i.dataset.init=1,i.addEventListener("mousedown",e=>e.stopPropagation()),i.addEventListener("click",e=>{let t=e.target.closest(".ws");t&&il(t.dataset.kind,t.dataset.key)}),addEventListener("keydown",e=>{if(e.target instanceof HTMLInputElement)return;let t=parseInt(e.key,10);t>=1&&t<=4?il("gun",vu[t-1]):(t===5||t===6)&&il("spray",Vp[t-5])}),addEventListener("wheel",e=>{if(M.state!=="play"||!(M.owned||[]).length)return;let t=vu.filter(s=>M.owned.includes(s)),n=t.indexOf(M.gun);il("gun",t[(n+(e.deltaY>0?1:-1)+t.length)%t.length])},{passive:!0}))}D_();function ss(i){let e=tt("toast");e.textContent=i,e.classList.add("show"),clearTimeout(ss.h),ss.h=setTimeout(()=>e.classList.remove("show"),2600)}function Un(i,e,t,n,s){let r=tt("panelCard");if(r.textContent="",s){let h=document.createElement("div");h.className="herostamp",h.textContent=s,r.append(h)}let a=document.createElement("h2");a.textContent=i;let o=document.createElement("p");o.className="sub",o.textContent=l.censor(e),r.append(a,o);let c=document.createElement("div");if(c.className="btns",n.forEach(([h,u,d])=>{let f=document.createElement("button");f.className="go"+(d?" ghost":""),f.textContent=h,f.onclick=u,c.append(f)}),r.append(c),Un.primary=n[0]&&n[0][1],t){let h=document.createElement("div");h.className="stats";for(let[u,d]of t){let f=document.createElement("div");f.textContent=u;let p=document.createElement("div");p.textContent=d,h.append(f,p)}r.append(h)}r.scrollTop=0,tt("panel").classList.remove("hidden")}function al(){tt("panel").classList.add("hidden")}function xr(){al(),M.state="menu",mr(),Wp(),l.audio.duck(!1),l.audio.music("menu"),tt("hud").classList.add("hidden"),tt("menu").classList.remove("hidden")}function Wp(){let i=l.board.list(),e=tt("boardRows"),t=ha(),n=l.store.get("sa_beststreak",0);if(tt("board").classList.toggle("hidden",!i.length&&!t.wave&&!n),e.textContent="",t.wave||n){let s=document.createElement("div");s.textContent="ENDLESS BEST";let r=document.createElement("div");r.textContent=`${t.wave?`Wave ${t.wave} \xB7 ${t.score} pts \xB7 ${t.diff||""}`:"not yet"} \xB7 Best streak ${n}`,s.style.color=r.style.color="#ffcf4a",e.append(s,r)}i.slice(0,8).forEach((s,r)=>{let a=document.createElement("div");a.textContent=`${r+1}. ${s.name}`;let o=document.createElement("div");o.textContent=`${s.areaName} \xB7 ${s.kills} down \xB7 ${s.rank}`,e.append(a,o)})}Wp();function ha(){let i=l.store.get("sa_endless",null);return i&&typeof i=="object"?i:{wave:0,score:0}}function Xp(){let i=ha(),e=l.officers.reduce((s,r)=>s+r.score,0),t=M.endless.wave,n=t>i.wave||t===i.wave&&e>i.score;return n&&l.store.set("sa_endless",{wave:t,score:e,name:l.officers[0].name,diff:l.diff().label,streak:M.runBestStreak||0}),l.store.set("sa_beststreak",Math.max(l.store.get("sa_beststreak",0),M.runBestStreak||0)),n}var qp=()=>[["Wave reached",String(M.endless.wave)],["Difficulty",l.diff().label],["Best streak this run",String(M.runBestStreak||0)],["Total score",String(l.officers.reduce((i,e)=>i+e.score,0))],["\u2014\u2014 YOUR ENDLESS BEST \u2014\u2014",""],["Wave",String(ha().wave)],["Score",String(ha().score)],["Best streak ever",String(l.store.get("sa_beststreak",0))]];function N_(){l.audio.sting("clear"),l.audio.music("menu"),l.audio.play("win");let i=M.endless.wave;M.endless.wave++,Xp(),Un(`WAVE ${i} CLEARED`,l.pick(["The shift is not over. The shift is never over.","Sarge says one more. Sarge always says one more.","Your relief called out. Again.","Payroll has stopped counting your hours. It ran out of numbers."]),qp().concat(ol()),[[`WAVE ${i+1}`,()=>As((M.level+1)%ts.length)],["MENU",xr,!0]],"STILL ON THE CLOCK")}function k_(){l.audio.sting("over"),l.audio.music("menu");let i=Xp();Un(i?"NEW ENDLESS RECORD!":"SHIFT FINALLY OVER",`You made it to wave ${M.endless.wave} on ${l.diff().label}.${i?" Nobody on this device has done better.":` Your best is wave ${ha().wave}. Go get it.`}`,Hp().concat(qp()),[["GO AGAIN",()=>{M.endless={wave:1},M.run=Mu(),M.runKills=0,M.rung=-1,M.ammo={},M.gun=null,M.runBestStreak=0;for(let e of l.officers)e.score=0,e.kills=0;As(0)}],["MENU",xr,!0]],i?"RECORD":null)}function Yp(i){l.store.set("sa_beststreak",Math.max(l.store.get("sa_beststreak",0),M.runBestStreak||0));let e=M.level+(i?1:0),t=i&&M.level>=ts.length-1?"SURVIVED THE SHIFT":i?`Cleared ${ts[M.level].title}`:`Got to ${ts[M.level].title}`;for(let n of l.officers)l.board.record({name:l.cleanName(n.name),area:e,areaName:t,kills:M.runKills||0,score:n.score,rank:fi[M.rung||0].title,date:new Date().toISOString().slice(0,10)})}var _u=()=>[["\u2014\u2014 SHIFT BOARD \u2014\u2014",""]].concat(l.board.list().slice(0,5).map((i,e)=>[`${e+1}. ${i.name}`,i.areaName])),pr={force:["An inappropriate amount","Yes","Enough to need a second form","Fists, feet, a taco, and a time clock","Whatever was closest","All of it. Every bit."],fluids:["Yes (all of them)","Spit, piss, and something from a cup we are not naming","Too many to list. See attached 9 pages.","Cup contents: unknown. Smell: known.","Yes. On the PREA poster. Again."],reason:['"Your mom"','"He looked at me funny"','"I was bored as shit"','"I wanted to see the hot nurse"','"Commissary was out of hot chips"','"Bro I thought it was rec"','"It was a Tuesday"'],witness:["Tower One (asleep)","Control (on his phone)","Inmate in cell 14 (lying)","A rat. The animal kind.","Nobody. Everybody. Big Mike."],injuries:["Bruised ego, busted lip, pride","Bit on the ass. Medical laughed.","Got gassed. Shirt is evidence now.","Pulled a hammy. Not from the fight.","Emotional. Do not ask."],sig:["Sgt. (drew a smiley face instead)","Illegible. Smells like wintergreen.","Signed in taco sauce",'"Mandatory OT" written 40 times',"Signed. Then cried."]},ol=()=>[...l.officers.flatMap(i=>[[`${l.rankName(i)}: inmates down`,String(i.kills)],[`${l.rankName(i)}: score`,String(i.score)]]),["Rank",fi[M.rung||0].title],["Force used",l.pick(pr.force)],["Bodily fluids involved",l.pick(pr.fluids)],["Inmate's stated reason",l.pick(pr.reason)],["Witnesses",l.pick(pr.witness)],["Staff injuries",l.pick(pr.injuries)],["Best kill streak",`${M.bestStreak||0} (all-time ${Math.max(M.bestStreak||0,l.store.get("sa_beststreak",0))})`],["Difficulty",l.diff().label],["Fake PREA claims yelled",String(M.prea||0)],...M.compromised?[["Staff compromised",`${M.compromised} (${M.compNames.join(", ")}. Walked out with a box.)`]]:M.compMissed?[["Staff compromised","Unverified. Love letters still in the mail."]]:[],["Real PREA claims","0 (filed 14 pages anyway)"],...l.settings.gore?[["Mop buckets required",`${Math.max(1,Math.ceil((l.FX.mess||0)/6))}${M.galore?` (GORE GALORE x${M.galore})`:""}`]]:[],["Supervisor signature",l.pick(pr.sig)]].map(([i,e])=>[i,l.censor(e)]);function U_(){if(M.state="clear",mr(),M.endless)return N_();l.audio.sting("clear"),l.audio.music("menu"),Yp(!0),l.audio.play("win"),M.level>=ts.length-1?Un("SHIFT SURVIVED","Big Foggy is back in his cell. Made by Micah Alaniz, Correctional Officer, for my family and friends back home at WSP. Shout out to Bernardo, Dustin Davis, Caleb Alaniz, and every correctional officer out there. Much respect. Stay safe out there.",ol().concat(_u()),[["PLAY AGAIN",()=>{M.runKills=0,M.rung=-1,M.ammo={},M.gun=null,As(0)}],["MENU",xr,!0]],"HERO OF THE DOC"):Un(`${M.def.title.toUpperCase()}: CLEARED`,l.pick(["INCIDENT REPORT #"+l.randi(1e3,9999)+". Sarge says good job. Sarge also says stay late.","INCIDENT REPORT. Somebody hose that shit down.","INCIDENT REPORT. Overtime approved. Sleep denied. Dignity: also denied.","INCIDENT REPORT. The DOC family thanks you. Payroll says fuck you."]),ol().concat(_u()),[["NEXT AREA",()=>As(M.level+1)],["MENU",xr,!0]],"HERO OF THE DOC")}function O_(){M.state==="play"&&(l.streakBreak("DOWN"),mr(),p_(()=>{if(M.state="over",M.endless)return k_();z_()}))}function z_(){M.state="over",l.audio.sting("over"),l.audio.music("menu"),Yp(!1),Un("YOU GOT MANDOWED",l.pick(["Medical is on the way. Medical is also on break.","The inmates are filing a grievance about how easy that was.","Your truck has been towed from the fire lane."]),Hp().concat(ol(),_u()),[["RETRY AREA",()=>As(M.level)],["MENU",xr,!0]])}addEventListener("keydown",i=>{if((i.code==="Enter"||i.code==="NumpadEnter")&&(M.state==="clear"||M.state==="over")&&Un.primary){i.preventDefault();let e=Un.primary;Un.primary=null,e()}});addEventListener("keydown",i=>{if(i.code==="Escape")if(M.state==="play"){M.state="pause",l.audio.duck(!0);let e=l.officers.flatMap(t=>Object.keys(ci).map(n=>{let s=t.gear[n];return[`${t.name} \xB7 ${ci[n].label}`,s?`${s.name} (${xn[s.rarity].label})`:"none yet"]}));Un("PAUSED",'Taking a smoke break. Officially a "wellness check."',e,[["RESUME",()=>{al(),M.state="play",l.audio.duck(!1)}],["QUIT TO MENU",xr,!0]])}else M.state==="pause"&&(al(),M.state="play",l.audio.duck(!1))});var Op=performance.now();l.audio.music("menu");function $p(i){requestAnimationFrame($p);let e=Math.min(.05,(i-Op)/1e3),t=e;if(Op=i,e*=l.PACE(),M.hitStop>0&&(M.hitStop-=e,e*=.15),M.slowmo>0&&(M.slowmo-=e,e*=.3),M.state==="play"){M.time+=e,l.targets.length=0;for(let r of l.officers)r.down||l.targets.push(r);for(let r of l.allies)!r.leaving&&!r.passive&&l.targets.push(r);l.W.buildFlowT=(l.W.buildFlowT||0)-e,l.W.buildFlowT<=0&&(l.W.buildFlowT=.2,l.W.buildFlow(l.targets)),l.AI.update(e);for(let r of l.officers)r.update(e);Xn.update(e),l.Boss.update(e),I_(e),l_(),c_(e),l.C.update(e,i/1e3),ei.update(e,i/1e3),R_(e),h_(e),T_(e),S_(e),A_(e),M_(e),u_(e),M.run&&(M.run.time+=e),P_(e),L_(t),w_(t),l.officers.every(r=>r.down)?(M.downT+=e,M.downT>2.5&&O_()):(M.downT=0,M.kills>=M.def.quota&&l.AI.liveCount()===0&&(!M.def.boss||M.bossDead)&&(ei.drops.length&&(M.lootWait||0)<20?(M.lootWait||(Ot("CONTROL","Area secure. There is gear on the floor, go grab it before you clock out.",4),l.audio.play("pickup")),M.lootWait=(M.lootWait||0)+t,M.lootLeft=Math.ceil(20-M.lootWait)):(ei.drops.length&&ei.collectAll(),M.lootLeft=0,M.clearT+=e,M.clearT>1.5&&U_())))}else if(M.state==="deathcam")g_(t);else if((M.state==="clear"||M.state==="over")&&Un.primary){let r=l.pads();for(let a=0;a<r.length;a++){let o=r[a],c=!!(o&&o.buttons[0]&&o.buttons[0].pressed);if(c&&!ns[a]){ns[a]=c;let h=Un.primary;Un.primary=null,h();break}ns[a]=c}}else if(M.state==="menu"){l.AI.update(e);let r=l.pads();for(let a=0;a<r.length;a++){let o=r[a],c=!!(o&&o.buttons[0]&&o.buttons[0].pressed);if(c&&!ns[a]&&document.activeElement!==tt("nameIn")){ns[a]=c,ll();break}ns[a]=c}}l.R.updateFlash(e),l.W.update(e,i/1e3),l.FX.update(e),zp.sync(l.AI.list);let s=l.officers.filter(r=>!r.down);if(M.state!=="deathcam")if(M.state!=="menu"&&s.length){let r=s.reduce((c,h)=>c+h.x,0)/s.length,a=s.reduce((c,h)=>c+h.z,0)/s.length,o=Math.max(0,...s.map(c=>Math.hypot(c.x-r,c.z-a)));l.R.follow(r,a,e,1+o/18)}else{let r=i/1e3;l.R.follow(44+Math.sin(r*.1)*22,34+Math.cos(r*.13)*10,e,1.1)}l.R.render(i/1e3)}requestAnimationFrame($p);l.startLevel=As;l.crowd=zp;window.G=l;
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
