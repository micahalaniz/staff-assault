var h={};h.BRAND={game:"STAFF ASSAULT",sub:"Killer Row",alarm:"Body Alarm"};h.CREW={bernardo:"Bernardo",dustin:"Dustin Davis",caleb:"Caleb Alaniz",halley:"Sgt. Halley Munoz",halleyShort:"Sgt. Munoz"};h.TAU=Math.PI*2;h.rand=(i,e)=>i+Math.random()*(e-i);h.randi=(i,e)=>Math.floor(i+Math.random()*(e-i+1));h.pick=i=>i[Math.random()*i.length|0];h.clamp=(i,e,t)=>i<e?e:i>t?t:i;h.lerp=(i,e,t)=>i+(e-i)*t;h.angDiff=(i,e)=>{let t=(e-i)%h.TAU;return t>Math.PI&&(t-=h.TAU),t<-Math.PI&&(t+=h.TAU),t};h.store={get(i,e){try{let t=localStorage.getItem(i);return t==null?e:JSON.parse(t)}catch{return e}},set(i,e){try{localStorage.setItem(i,JSON.stringify(e))}catch{}}};var Yf=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches;h.settings=Object.assign({quality:Yf?"medium":"high",gore:!0,cuss:!0,muted:!1,pace:.8},h.store.get("mo_settings",{}));h.censor=i=>h.settings.cuss?i:i.replace(/\b(f)uck|\b(s)hit|\b(b)itch|\b(a)ss\b/gi,e=>e[0]+"*".repeat(e.length-1));h.PACE=()=>h.settings.pace||.8;h.board={list(){let i=h.store.get("sa_board",[]);return Array.isArray(i)?i:[]},record(i){let e=this.list(),t=String(i.name).toLowerCase(),n=e.findIndex(r=>String(r.name).toLowerCase()===t),s=(r,o)=>r.area>o.area||r.area===o.area&&r.score>o.score;n<0?e.push(i):s(i,e[n])&&(e[n]=i),e.sort((r,o)=>o.area-r.area||o.score-r.score),h.store.set("sa_board",e.slice(0,15))}};h.saveSettings=()=>h.store.set("mo_settings",h.settings);h.cleanName=i=>String(i||"").replace(/[\u0000-\u001f\u007f{}<>]/g,"").trim().slice(0,14)||"Rookie";h.t=(i,e)=>String(i).replace(/\{hero\}/g,e||"Rookie").replace(/\{HERO\}/g,(e||"Rookie").toUpperCase()).replace(/\{(bernardo|dustin|caleb|halley|halleyShort)\}/g,(t,n)=>h.CREW[n]);h.grid={cell:2,map:new Map,used:[],clear(){for(let i of this.used)i.length=0;this.used.length=0},key(i,e){return(i+2048)*8192+(e+2048)},insert(i){let e=this.key(Math.floor(i.x/this.cell),Math.floor(i.z/this.cell)),t=this.map.get(e);t||(t=[],this.map.set(e,t)),t.length===0&&this.used.push(t),t.push(i)},query(i,e,t,n){n.length=0;let s=this.cell,r=Math.floor((i-t)/s),o=Math.floor((i+t)/s),a=Math.floor((e-t)/s),l=Math.floor((e+t)/s);for(let c=r;c<=o;c++)for(let u=a;u<=l;u++){let d=this.map.get(this.key(c,u));if(d)for(let f=0;f<d.length;f++)n.push(d[f])}return n}};h.QUALITY={low:{pixel:.75,shadows:!1,shadowMap:0,bloom:!1,ao:!1,grade:!1,dust:0,particles:500,decals:150},medium:{pixel:1,shadows:!0,shadowMap:1024,bloom:!1,ao:!1,grade:!0,dust:120,particles:900,decals:250},high:{pixel:1,shadows:!0,shadowMap:2048,bloom:!0,ao:!1,grade:!0,dust:250,particles:1500,decals:400},ultra:{pixel:1.25,shadows:!0,shadowMap:4096,bloom:!0,ao:!0,grade:!0,dust:400,particles:2500,decals:600}};h.QUALITY_ORDER=["low","medium","high","ultra"];h.pads=function(){try{return navigator.getGamepads&&navigator.getGamepads()||[]}catch{return[]}};var xt={ctx:null,master:null,noiseBuf:null,last:{}};h.audio=xt;var Qh=.5;xt.init=function(){if(xt.ctx){xt.ctx.state==="suspended"&&xt.ctx.resume();return}let i=window.AudioContext||window.webkitAudioContext;if(!i)return;try{xt.ctx=new i}catch{return}let e=xt.ctx;xt.master=e.createGain(),xt.master.gain.value=h.settings.muted?0:Qh;let t=e.createDynamicsCompressor();t.threshold.value=-16,t.ratio.value=6,xt.master.connect(t),t.connect(e.destination);let n=e.sampleRate*2;xt.noiseBuf=e.createBuffer(1,n,e.sampleRate);let s=xt.noiseBuf.getChannelData(0);for(let r=0;r<n;r++)s[r]=Math.random()*2-1};xt.setMuted=function(i){h.settings.muted=i,h.saveSettings(),xt.master&&xt.master.gain.setTargetAtTime(i?0:Qh,xt.ctx.currentTime,.05)};function eu(i,e,t,n,s){i.gain.setValueAtTime(1e-4,e),i.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),e+s),i.gain.exponentialRampToValueAtTime(1e-4,e+t)}function qn(i,e,t){let n=xt.ctx,s=n.createBufferSource();s.buffer=xt.noiseBuf,s.playbackRate.value=t.rate||1;let r=n.createBiquadFilter();r.type=t.type||"bandpass",r.frequency.setValueAtTime(t.freq||1e3,i),t.freqEnd&&r.frequency.exponentialRampToValueAtTime(t.freqEnd,i+e),r.Q.value=t.q||1;let o=n.createGain();eu(o,i,e,t.gain||.3,t.attack||.002),s.connect(r),r.connect(o),o.connect(xt.master),s.start(i,Math.random()*.6),s.stop(i+e+.05)}function xn(i,e,t){let n=xt.ctx,s=n.createOscillator();s.type=t.type||"sine",s.frequency.setValueAtTime(t.freq||440,i),t.freqEnd&&s.frequency.exponentialRampToValueAtTime(t.freqEnd,i+e);let r=n.createGain();eu(r,i,e,t.gain||.2,t.attack||.004),s.connect(r),r.connect(xt.master),s.start(i),s.stop(i+e+.05)}var Zf={swing:{gap:60,f:(i,e)=>qn(i,.16,{freq:900,freqEnd:300,q:.8,gain:.25*e})},thud:{gap:35,f:(i,e)=>{xn(i,.12,{freq:140,freqEnd:50,gain:.45*e}),qn(i,.08,{freq:500,gain:.25*e})}},pop:{gap:40,f:(i,e)=>{xn(i,.06,{type:"square",freq:320,freqEnd:120,gain:.12*e}),qn(i,.05,{freq:2500,gain:.2*e})}},spray:{gap:90,f:(i,e)=>qn(i,.14,{type:"highpass",freq:3e3,gain:.12*e,attack:.02})},splat:{gap:50,f:(i,e)=>qn(i,.18,{freq:400,freqEnd:120,q:2,gain:.35*e})},hurt:{gap:180,f:(i,e)=>xn(i,.2,{type:"sawtooth",freq:220,freqEnd:110,gain:.15*e})},dash:{gap:100,f:(i,e)=>qn(i,.2,{freq:1500,freqEnd:500,gain:.2*e})},pickup:{gap:60,f:(i,e)=>{xn(i,.08,{type:"triangle",freq:660,gain:.2*e}),xn(i+.07,.12,{type:"triangle",freq:990,gain:.2*e})}},boom:{gap:80,f:(i,e)=>{qn(i,.35,{type:"lowpass",freq:1200,freqEnd:150,gain:.6*e}),xn(i,.25,{freq:110,freqEnd:35,gain:.55*e})}},zap:{gap:90,f:(i,e)=>{xn(i,.18,{type:"sawtooth",freq:1800,freqEnd:600,gain:.12*e}),qn(i,.15,{type:"highpass",freq:4e3,gain:.25*e})}},siren:{gap:2500,f:(i,e)=>{for(let t=0;t<4;t++)xn(i+t*.5,.25,{type:"square",freq:980,gain:.09*e}),xn(i+t*.5+.25,.25,{type:"square",freq:740,gain:.09*e})}},crack:{gap:60,f:(i,e)=>{qn(i,.05,{type:"highpass",freq:1800,gain:.5*e}),xn(i,.1,{freq:90,freqEnd:40,gain:.4*e})}},radio:{gap:300,f:(i,e)=>{qn(i,.09,{freq:1800,q:4,gain:.08*e}),xn(i,.05,{type:"square",freq:1400,gain:.04*e})}},alarm:{gap:900,f:(i,e)=>{for(let t=0;t<3;t++)xn(i+t*.28,.24,{type:"square",freq:880,freqEnd:660,gain:.08*e})}},win:{gap:900,f:(i,e)=>[523,659,784,1046].forEach((t,n)=>xn(i+n*.12,.3,{type:"triangle",freq:t,gain:.2*e}))}};xt.play=function(i,e=1){if(!xt.ctx||h.settings.muted)return;let t=Zf[i];if(!t)return;let n=performance.now();xt.last[i]&&n-xt.last[i]<t.gap||(xt.last[i]=n,t.f(xt.ctx.currentTime,e))};var Yc="170";var $f=0,tu=1,Jf=2;var dd=1,Zc=2,di=3,Ii=0,jt=1,Ht=2,Ot=0,Cs=1,Mn=2,nu=3,iu=4,$c=5,Ln=100,Kf=101,jf=102,Qf=103,ep=104,Xs=200,tp=201,np=202,ip=203,Ml=204,bl=205,ia=206,sp=207,sa=208,rp=209,op=210,ap=211,lp=212,cp=213,hp=214,Sl=0,wl=1,El=2,Ds=3,Tl=4,Al=5,Rl=6,Cl=7,fd=0,up=1,dp=2,Ci=0,Jc=1,Kc=2,jc=3,Ar=4,fp=5,Qc=6,eh=7;var pd=300,Ns=301,Us=302,xr=303,Il=304,ra=306,bn=1e3,_n=1001,Pl=1002,Qt=1003,pp=1004;var jr=1005;var Ut=1006,Ba=1007;var Ri=1008;var Vn=1009,md=1010,gd=1011,yr=1012,th=1013,es=1014,dn=1015,It=1016,nh=1017,ih=1018,Pi=1020,xd=35902,yd=1021,vd=1022,nn=1023,_d=1024,Md=1025,Is=1026,Li=1027,sh=1028,rh=1029,bd=1030,oh=1031;var ah=1033,Eo=33776,To=33777,Ao=33778,Ro=33779,Ll=35840,Dl=35841,Nl=35842,Ul=35843,Ol=36196,Fl=37492,zl=37496,kl=37808,Bl=37809,Hl=37810,Vl=37811,Gl=37812,Wl=37813,Xl=37814,ql=37815,Yl=37816,Zl=37817,$l=37818,Jl=37819,Kl=37820,jl=37821,Co=36492,Ql=36494,ec=36495,Sd=36283,tc=36284,nc=36285,ic=36286;var Io=2300,sc=2301,Ha=2302,su=2400,ru=2401,ou=2402;var mp=3200,gp=3201;var lh=0,xp=1,Ai="",qt="srgb",Jn="srgb-linear",oa="linear",ut="srgb";var fs=7680;var au=519,yp=512,vp=513,_p=514,wd=515,Mp=516,bp=517,Sp=518,wp=519,lu=35044,qs=35048;var cu="300 es",pi=2e3,Po=2001,Di=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Va=Math.PI/180,Lo=180/Math.PI;function Rr(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function Bt(i,e,t){return Math.max(e,Math.min(t,i))}function Ep(i,e){return(i%e+e)%e}function Ga(i,e,t){return(1-t)*i+t*e}function sr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function un(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var oe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Bt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ye=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],f=n[2],p=n[5],y=n[8],x=s[0],g=s[3],m=s[6],v=s[1],M=s[4],b=s[7],L=s[2],T=s[5],C=s[8];return r[0]=o*x+a*v+l*L,r[3]=o*g+a*M+l*T,r[6]=o*m+a*b+l*C,r[1]=c*x+u*v+d*L,r[4]=c*g+u*M+d*T,r[7]=c*m+u*b+d*C,r[2]=f*x+p*v+y*L,r[5]=f*g+p*M+y*T,r[8]=f*m+p*b+y*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,f=a*l-u*r,p=c*r-o*l,y=t*d+n*f+s*p;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/y;return e[0]=d*x,e[1]=(s*c-u*n)*x,e[2]=(a*n-s*o)*x,e[3]=f*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=p*x,e[7]=(n*l-c*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Wa.makeScale(e,t)),this}rotate(e){return this.premultiply(Wa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Wa=new Ye;function Ed(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function vr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Tp(){let i=vr("canvas");return i.style.display="block",i}var hu={};function dr(i){i in hu||(hu[i]=!0,console.warn(i))}function Ap(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Rp(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Cp(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var et={enabled:!0,workingColorSpace:Jn,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ut&&(i.r=mi(i.r),i.g=mi(i.g),i.b=mi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ut&&(i.r=Ps(i.r),i.g=Ps(i.g),i.b=Ps(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ai?oa:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function mi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ps(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var uu=[.64,.33,.3,.6,.15,.06],du=[.2126,.7152,.0722],fu=[.3127,.329],pu=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),mu=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);et.define({[Jn]:{primaries:uu,whitePoint:fu,transfer:oa,toXYZ:pu,fromXYZ:mu,luminanceCoefficients:du,workingColorSpaceConfig:{unpackColorSpace:qt},outputColorSpaceConfig:{drawingBufferColorSpace:qt}},[qt]:{primaries:uu,whitePoint:fu,transfer:ut,toXYZ:pu,fromXYZ:mu,luminanceCoefficients:du,outputColorSpaceConfig:{drawingBufferColorSpace:qt}}});var ps,rc=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ps===void 0&&(ps=vr("canvas")),ps.width=e.width,ps.height=e.height;let n=ps.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ps}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=vr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=mi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(mi(t[n]/255)*255):t[n]=mi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ip=0,Do=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ip++}),this.uuid=Rr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Xa(s[o].image)):r.push(Xa(s[o]))}else r=Xa(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Xa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?rc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Pp=0,sn=class i extends Di{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=_n,s=_n,r=Ut,o=Ri,a=nn,l=Vn,c=i.DEFAULT_ANISOTROPY,u=Ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pp++}),this.uuid=Rr(),this.name="",this.source=new Do(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==pd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case bn:e.x=e.x-Math.floor(e.x);break;case _n:e.x=e.x<0?0:1;break;case Pl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case bn:e.y=e.y-Math.floor(e.y);break;case _n:e.y=e.y<0?0:1;break;case Pl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=pd;sn.DEFAULT_ANISOTROPY=1;var mt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],p=l[5],y=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-x)<.01&&Math.abs(y-g)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+x)<.1&&Math.abs(y+g)<.1&&Math.abs(c+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,b=(p+1)/2,L=(m+1)/2,T=(u+f)/4,C=(d+x)/4,A=(y+g)/4;return M>b&&M>L?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=C/n):b>L?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=T/s,r=A/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=C/r,s=A/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-y)*(g-y)+(d-x)*(d-x)+(f-u)*(f-u));return Math.abs(v)<.001&&(v=1),this.x=(g-y)/v,this.y=(d-x)/v,this.z=(f-u)/v,this.w=Math.acos((c+p+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},oc=class extends Di{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new mt(0,0,e,t),this.scissorTest=!1,this.viewport=new mt(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new sn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Do(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Dt=class extends oc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},No=class extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ac=class extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Vt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],f=r[o+0],p=r[o+1],y=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=y,e[t+3]=x;return}if(d!==x||l!==f||c!==p||u!==y){let g=1-a,m=l*f+c*p+u*y+d*x,v=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){let L=Math.sqrt(M),T=Math.atan2(L,m*v);g=Math.sin(g*T)/L,a=Math.sin(a*T)/L}let b=a*v;if(l=l*g+f*b,c=c*g+p*b,u=u*g+y*b,d=d*g+x*b,g===1-a){let L=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=L,c*=L,u*=L,d*=L}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[o],f=r[o+1],p=r[o+2],y=r[o+3];return e[t]=a*y+u*d+l*p-c*f,e[t+1]=l*y+u*f+c*d-a*p,e[t+2]=c*y+u*p+a*f-l*d,e[t+3]=u*y-a*d-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),d=a(r/2),f=l(n/2),p=l(s/2),y=l(r/2);switch(o){case"XYZ":this._x=f*u*d+c*p*y,this._y=c*p*d-f*u*y,this._z=c*u*y+f*p*d,this._w=c*u*d-f*p*y;break;case"YXZ":this._x=f*u*d+c*p*y,this._y=c*p*d-f*u*y,this._z=c*u*y-f*p*d,this._w=c*u*d+f*p*y;break;case"ZXY":this._x=f*u*d-c*p*y,this._y=c*p*d+f*u*y,this._z=c*u*y+f*p*d,this._w=c*u*d-f*p*y;break;case"ZYX":this._x=f*u*d-c*p*y,this._y=c*p*d+f*u*y,this._z=c*u*y-f*p*d,this._w=c*u*d+f*p*y;break;case"YZX":this._x=f*u*d+c*p*y,this._y=c*p*d+f*u*y,this._z=c*u*y-f*p*d,this._w=c*u*d-f*p*y;break;case"XZY":this._x=f*u*d-c*p*y,this._y=c*p*d-f*u*y,this._z=c*u*y+f*p*d,this._w=c*u*d+f*p*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=n+a+d;if(f>0){let p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>d){let p=2*Math.sqrt(1+n-a-d);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>d){let p=2*Math.sqrt(1+a-n-d);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{let p=2*Math.sqrt(1+d-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Bt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),d=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(gu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(gu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*u,this.y=n+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qa.copy(this).projectOnVector(e),this.sub(qa)}reflect(e){return this.sub(qa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Bt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},qa=new P,gu=new Vt,gi=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(zn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(zn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=zn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,zn):zn.fromBufferAttribute(r,o),zn.applyMatrix4(e.matrixWorld),this.expandByPoint(zn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Qr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Qr.copy(n.boundingBox)),Qr.applyMatrix4(e.matrixWorld),this.union(Qr)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,zn),zn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rr),eo.subVectors(this.max,rr),ms.subVectors(e.a,rr),gs.subVectors(e.b,rr),xs.subVectors(e.c,rr),Mi.subVectors(gs,ms),bi.subVectors(xs,gs),Xi.subVectors(ms,xs);let t=[0,-Mi.z,Mi.y,0,-bi.z,bi.y,0,-Xi.z,Xi.y,Mi.z,0,-Mi.x,bi.z,0,-bi.x,Xi.z,0,-Xi.x,-Mi.y,Mi.x,0,-bi.y,bi.x,0,-Xi.y,Xi.x,0];return!Ya(t,ms,gs,xs,eo)||(t=[1,0,0,0,1,0,0,0,1],!Ya(t,ms,gs,xs,eo))?!1:(to.crossVectors(Mi,bi),t=[to.x,to.y,to.z],Ya(t,ms,gs,xs,eo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,zn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(zn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},oi=[new P,new P,new P,new P,new P,new P,new P,new P],zn=new P,Qr=new gi,ms=new P,gs=new P,xs=new P,Mi=new P,bi=new P,Xi=new P,rr=new P,eo=new P,to=new P,qi=new P;function Ya(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){qi.fromArray(i,r);let a=s.x*Math.abs(qi.x)+s.y*Math.abs(qi.y)+s.z*Math.abs(qi.z),l=e.dot(qi),c=t.dot(qi),u=n.dot(qi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var Lp=new gi,or=new P,Za=new P,Ni=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Lp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;or.subVectors(e,this.center);let t=or.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(or,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Za.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(or.copy(e.center).add(Za)),this.expandByPoint(or.copy(e.center).sub(Za))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},ai=new P,$a=new P,no=new P,Si=new P,Ja=new P,io=new P,Ka=new P,_r=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){$a.copy(e).add(t).multiplyScalar(.5),no.copy(t).sub(e).normalize(),Si.copy(this.origin).sub($a);let r=e.distanceTo(t)*.5,o=-this.direction.dot(no),a=Si.dot(this.direction),l=-Si.dot(no),c=Si.lengthSq(),u=Math.abs(1-o*o),d,f,p,y;if(u>0)if(d=o*l-a,f=o*a-l,y=r*u,d>=0)if(f>=-y)if(f<=y){let x=1/u;d*=x,f*=x,p=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;else f<=-y?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c):f<=y?(d=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy($a).addScaledVector(no,f),p}intersectSphere(e,t){ai.subVectors(e.center,this.origin);let n=ai.dot(this.direction),s=ai.dot(ai)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,s,r){Ja.subVectors(t,e),io.subVectors(n,e),Ka.crossVectors(Ja,io);let o=this.direction.dot(Ka),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Si.subVectors(this.origin,e);let l=a*this.direction.dot(io.crossVectors(Si,io));if(l<0)return null;let c=a*this.direction.dot(Ja.cross(Si));if(c<0||l+c>o)return null;let u=-a*Si.dot(Ka);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ze=class i{constructor(e,t,n,s,r,o,a,l,c,u,d,f,p,y,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,d,f,p,y,x,g)}set(e,t,n,s,r,o,a,l,c,u,d,f,p,y,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=f,m[3]=p,m[7]=y,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/ys.setFromMatrixColumn(e,0).length(),r=1/ys.setFromMatrixColumn(e,1).length(),o=1/ys.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let f=o*u,p=o*d,y=a*u,x=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=p+y*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=y+p*c,t[10]=o*l}else if(e.order==="YXZ"){let f=l*u,p=l*d,y=c*u,x=c*d;t[0]=f+x*a,t[4]=y*a-p,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=p*a-y,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){let f=l*u,p=l*d,y=c*u,x=c*d;t[0]=f-x*a,t[4]=-o*d,t[8]=y+p*a,t[1]=p+y*a,t[5]=o*u,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let f=o*u,p=o*d,y=a*u,x=a*d;t[0]=l*u,t[4]=y*c-p,t[8]=f*c+x,t[1]=l*d,t[5]=x*c+f,t[9]=p*c-y,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let f=o*l,p=o*c,y=a*l,x=a*c;t[0]=l*u,t[4]=x-f*d,t[8]=y*d+p,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*d+y,t[10]=f-x*d}else if(e.order==="XZY"){let f=o*l,p=o*c,y=a*l,x=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+x,t[5]=o*u,t[9]=p*d-y,t[2]=y*d-p,t[6]=a*u,t[10]=x*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Dp,e,Np)}lookAt(e,t,n){let s=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),wi.crossVectors(n,yn),wi.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),wi.crossVectors(n,yn)),wi.normalize(),so.crossVectors(yn,wi),s[0]=wi.x,s[4]=so.x,s[8]=yn.x,s[1]=wi.y,s[5]=so.y,s[9]=yn.y,s[2]=wi.z,s[6]=so.z,s[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],f=n[9],p=n[13],y=n[2],x=n[6],g=n[10],m=n[14],v=n[3],M=n[7],b=n[11],L=n[15],T=s[0],C=s[4],A=s[8],S=s[12],_=s[1],I=s[5],F=s[9],U=s[13],O=s[2],G=s[6],z=s[10],K=s[14],X=s[3],ne=s[7],le=s[11],Me=s[15];return r[0]=o*T+a*_+l*O+c*X,r[4]=o*C+a*I+l*G+c*ne,r[8]=o*A+a*F+l*z+c*le,r[12]=o*S+a*U+l*K+c*Me,r[1]=u*T+d*_+f*O+p*X,r[5]=u*C+d*I+f*G+p*ne,r[9]=u*A+d*F+f*z+p*le,r[13]=u*S+d*U+f*K+p*Me,r[2]=y*T+x*_+g*O+m*X,r[6]=y*C+x*I+g*G+m*ne,r[10]=y*A+x*F+g*z+m*le,r[14]=y*S+x*U+g*K+m*Me,r[3]=v*T+M*_+b*O+L*X,r[7]=v*C+M*I+b*G+L*ne,r[11]=v*A+M*F+b*z+L*le,r[15]=v*S+M*U+b*K+L*Me,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],p=e[14],y=e[3],x=e[7],g=e[11],m=e[15];return y*(+r*l*d-s*c*d-r*a*f+n*c*f+s*a*p-n*l*p)+x*(+t*l*p-t*c*f+r*o*f-s*o*p+s*c*u-r*l*u)+g*(+t*c*d-t*a*p-r*o*d+n*o*p+r*a*u-n*c*u)+m*(-s*a*u-t*l*d+t*a*f+s*o*d-n*o*f+n*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],p=e[11],y=e[12],x=e[13],g=e[14],m=e[15],v=d*g*c-x*f*c+x*l*p-a*g*p-d*l*m+a*f*m,M=y*f*c-u*g*c-y*l*p+o*g*p+u*l*m-o*f*m,b=u*x*c-y*d*c+y*a*p-o*x*p-u*a*m+o*d*m,L=y*d*l-u*x*l-y*a*f+o*x*f+u*a*g-o*d*g,T=t*v+n*M+s*b+r*L;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/T;return e[0]=v*C,e[1]=(x*f*r-d*g*r-x*s*p+n*g*p+d*s*m-n*f*m)*C,e[2]=(a*g*r-x*l*r+x*s*c-n*g*c-a*s*m+n*l*m)*C,e[3]=(d*l*r-a*f*r-d*s*c+n*f*c+a*s*p-n*l*p)*C,e[4]=M*C,e[5]=(u*g*r-y*f*r+y*s*p-t*g*p-u*s*m+t*f*m)*C,e[6]=(y*l*r-o*g*r-y*s*c+t*g*c+o*s*m-t*l*m)*C,e[7]=(o*f*r-u*l*r+u*s*c-t*f*c-o*s*p+t*l*p)*C,e[8]=b*C,e[9]=(y*d*r-u*x*r-y*n*p+t*x*p+u*n*m-t*d*m)*C,e[10]=(o*x*r-y*a*r+y*n*c-t*x*c-o*n*m+t*a*m)*C,e[11]=(u*a*r-o*d*r-u*n*c+t*d*c+o*n*p-t*a*p)*C,e[12]=L*C,e[13]=(u*x*s-y*d*s+y*n*f-t*x*f-u*n*g+t*d*g)*C,e[14]=(y*a*s-o*x*s-y*n*l+t*x*l+o*n*g-t*a*g)*C,e[15]=(o*d*s-u*a*s+u*n*l-t*d*l-o*n*f+t*a*f)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,d=a+a,f=r*c,p=r*u,y=r*d,x=o*u,g=o*d,m=a*d,v=l*c,M=l*u,b=l*d,L=n.x,T=n.y,C=n.z;return s[0]=(1-(x+m))*L,s[1]=(p+b)*L,s[2]=(y-M)*L,s[3]=0,s[4]=(p-b)*T,s[5]=(1-(f+m))*T,s[6]=(g+v)*T,s[7]=0,s[8]=(y+M)*C,s[9]=(g-v)*C,s[10]=(1-(f+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=ys.set(s[0],s[1],s[2]).length(),o=ys.set(s[4],s[5],s[6]).length(),a=ys.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],kn.copy(this);let c=1/r,u=1/o,d=1/a;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=u,kn.elements[5]*=u,kn.elements[6]*=u,kn.elements[8]*=d,kn.elements[9]*=d,kn.elements[10]*=d,t.setFromRotationMatrix(kn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=pi){let l=this.elements,c=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),p,y;if(a===pi)p=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===Po)p=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=pi){let l=this.elements,c=1/(t-e),u=1/(n-s),d=1/(o-r),f=(t+e)*c,p=(n+s)*u,y,x;if(a===pi)y=(o+r)*d,x=-2*d;else if(a===Po)y=r*d,x=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ys=new P,kn=new ze,Dp=new P(0,0,0),Np=new P(1,1,1),wi=new P,so=new P,yn=new P,xu=new ze,yu=new Vt,Gt=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Bt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Bt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Bt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return xu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(xu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yu.setFromEuler(this),this.setFromQuaternion(yu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Gt.DEFAULT_ORDER="XYZ";var Mr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Up=0,vu=new P,vs=new Vt,li=new ze,ro=new P,ar=new P,Op=new P,Fp=new Vt,_u=new P(1,0,0),Mu=new P(0,1,0),bu=new P(0,0,1),Su={type:"added"},zp={type:"removed"},_s={type:"childadded",child:null},ja={type:"childremoved",child:null},Wt=class i extends Di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Up++}),this.uuid=Rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new Gt,n=new Vt,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ze},normalMatrix:{value:new Ye}}),this.matrix=new ze,this.matrixWorld=new ze,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Mr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vs.setFromAxisAngle(e,t),this.quaternion.multiply(vs),this}rotateOnWorldAxis(e,t){return vs.setFromAxisAngle(e,t),this.quaternion.premultiply(vs),this}rotateX(e){return this.rotateOnAxis(_u,e)}rotateY(e){return this.rotateOnAxis(Mu,e)}rotateZ(e){return this.rotateOnAxis(bu,e)}translateOnAxis(e,t){return vu.copy(e).applyQuaternion(this.quaternion),this.position.add(vu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(_u,e)}translateY(e){return this.translateOnAxis(Mu,e)}translateZ(e){return this.translateOnAxis(bu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ro.copy(e):ro.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(ar,ro,this.up):li.lookAt(ro,ar,this.up),this.quaternion.setFromRotationMatrix(li),s&&(li.extractRotation(s.matrixWorld),vs.setFromRotationMatrix(li),this.quaternion.premultiply(vs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Su),_s.child=e,this.dispatchEvent(_s),_s.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zp),ja.child=e,this.dispatchEvent(ja),ja.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),li.multiply(e.parent.matrixWorld)),e.applyMatrix4(li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Su),_s.child=e,this.dispatchEvent(_s),_s.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,e,Op),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,Fp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),f=o(e.skeletons),p=o(e.animations),y=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),y.length>0&&(n.nodes=y)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Wt.DEFAULT_UP=new P(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bn=new P,ci=new P,Qa=new P,hi=new P,Ms=new P,bs=new P,wu=new P,el=new P,tl=new P,nl=new P,il=new mt,sl=new mt,rl=new mt,ji=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Bn.subVectors(e,t),s.cross(Bn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Bn.subVectors(s,t),ci.subVectors(n,t),Qa.subVectors(e,t);let o=Bn.dot(Bn),a=Bn.dot(ci),l=Bn.dot(Qa),c=ci.dot(ci),u=ci.dot(Qa),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let f=1/d,p=(c*l-a*u)*f,y=(o*u-a*l)*f;return r.set(1-p-y,y,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,hi.x),l.addScaledVector(o,hi.y),l.addScaledVector(a,hi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return il.setScalar(0),sl.setScalar(0),rl.setScalar(0),il.fromBufferAttribute(e,t),sl.fromBufferAttribute(e,n),rl.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(il,r.x),o.addScaledVector(sl,r.y),o.addScaledVector(rl,r.z),o}static isFrontFacing(e,t,n,s){return Bn.subVectors(n,t),ci.subVectors(e,t),Bn.cross(ci).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Bn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),Bn.cross(ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Ms.subVectors(s,n),bs.subVectors(r,n),el.subVectors(e,n);let l=Ms.dot(el),c=bs.dot(el);if(l<=0&&c<=0)return t.copy(n);tl.subVectors(e,s);let u=Ms.dot(tl),d=bs.dot(tl);if(u>=0&&d<=u)return t.copy(s);let f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(Ms,o);nl.subVectors(e,r);let p=Ms.dot(nl),y=bs.dot(nl);if(y>=0&&p<=y)return t.copy(r);let x=p*c-l*y;if(x<=0&&c>=0&&y<=0)return a=c/(c-y),t.copy(n).addScaledVector(bs,a);let g=u*y-p*d;if(g<=0&&d-u>=0&&p-y>=0)return wu.subVectors(r,s),a=(d-u)/(d-u+(p-y)),t.copy(s).addScaledVector(wu,a);let m=1/(g+x+f);return o=x*m,a=f*m,t.copy(n).addScaledVector(Ms,o).addScaledVector(bs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Td={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},oo={h:0,s:0,l:0};function ol(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var xe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=Ep(e,1),t=Bt(t,0,1),n=Bt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=ol(o,r,e+1/3),this.g=ol(o,r,e),this.b=ol(o,r,e-1/3)}return et.toWorkingColorSpace(this,s),this}setStyle(e,t=qt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qt){let n=Td[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mi(e.r),this.g=mi(e.g),this.b=mi(e.b),this}copyLinearToSRGB(e){return this.r=Ps(e.r),this.g=Ps(e.g),this.b=Ps(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qt){return et.fromWorkingColorSpace(Kt.copy(this),e),Math.round(Bt(Kt.r*255,0,255))*65536+Math.round(Bt(Kt.g*255,0,255))*256+Math.round(Bt(Kt.b*255,0,255))}getHexString(e=qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.fromWorkingColorSpace(Kt.copy(this),t);let n=Kt.r,s=Kt.g,r=Kt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=et.workingColorSpace){return et.fromWorkingColorSpace(Kt.copy(this),t),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=qt){et.fromWorkingColorSpace(Kt.copy(this),e);let t=Kt.r,n=Kt.g,s=Kt.b;return e!==qt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ei),this.setHSL(Ei.h+e,Ei.s+t,Ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ei),e.getHSL(oo);let n=Ga(Ei.h,oo.h,t),s=Ga(Ei.s,oo.s,t),r=Ga(Ei.l,oo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kt=new xe;xe.NAMES=Td;var kp=0,xi=class extends Di{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kp++}),this.uuid=Rr(),this.name="",this.blending=Cs,this.side=Ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ml,this.blendDst=bl,this.blendEquation=Ln,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new xe(0,0,0),this.blendAlpha=0,this.depthFunc=Ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=au,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fs,this.stencilZFail=fs,this.stencilZPass=fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Cs&&(n.blending=this.blending),this.side!==Ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ml&&(n.blendSrc=this.blendSrc),this.blendDst!==bl&&(n.blendDst=this.blendDst),this.blendEquation!==Ln&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ds&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==au&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},pt=class extends xi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gt,this.combine=fd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},fi=Bp();function Bp(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;!(c&8388608);)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function Hp(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Bt(i,-65504,65504),fi.floatView[0]=i;let e=fi.uint32View[0],t=e>>23&511;return fi.baseTable[t]+((e&8388607)>>fi.shiftTable[t])}function Vp(i){let e=i>>10;return fi.uint32View[0]=fi.mantissaTable[fi.offsetTable[e]+(i&1023)]+fi.exponentTable[e],fi.floatView[0]}var Cr={toHalfFloat:Hp,fromHalfFloat:Vp},Pt=new P,ao=new oe,Lt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=lu,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ao.fromBufferAttribute(this,t),ao.applyMatrix3(e),this.setXY(t,ao.x,ao.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=sr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=un(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=sr(t,this.array)),t}setX(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=sr(t,this.array)),t}setY(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=sr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=sr(t,this.array)),t}setW(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=un(t,this.array),n=un(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=un(t,this.array),n=un(n,this.array),s=un(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=un(t,this.array),n=un(n,this.array),s=un(s,this.array),r=un(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lu&&(e.usage=this.usage),e}};var Uo=class extends Lt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Oo=class extends Lt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var lt=class extends Lt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Gp=0,Pn=new ze,al=new Wt,Ss=new P,vn=new gi,lr=new gi,kt=new P,Nt=class i extends Di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gp++}),this.uuid=Rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ed(e)?Oo:Uo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Pn.makeRotationFromQuaternion(e),this.applyMatrix4(Pn),this}rotateX(e){return Pn.makeRotationX(e),this.applyMatrix4(Pn),this}rotateY(e){return Pn.makeRotationY(e),this.applyMatrix4(Pn),this}rotateZ(e){return Pn.makeRotationZ(e),this.applyMatrix4(Pn),this}translate(e,t,n){return Pn.makeTranslation(e,t,n),this.applyMatrix4(Pn),this}scale(e,t,n){return Pn.makeScale(e,t,n),this.applyMatrix4(Pn),this}lookAt(e){return al.lookAt(e),al.updateMatrix(),this.applyMatrix4(al.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ss).negate(),this.translate(Ss.x,Ss.y,Ss.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new lt(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];vn.setFromBufferAttribute(r),this.morphTargetsRelative?(kt.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(kt),kt.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(kt)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ni);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];lr.setFromBufferAttribute(a),this.morphTargetsRelative?(kt.addVectors(vn.min,lr.min),vn.expandByPoint(kt),kt.addVectors(vn.max,lr.max),vn.expandByPoint(kt)):(vn.expandByPoint(lr.min),vn.expandByPoint(lr.max))}vn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)kt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(kt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)kt.fromBufferAttribute(a,c),l&&(Ss.fromBufferAttribute(e,c),kt.add(Ss)),s=Math.max(s,n.distanceToSquared(kt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Lt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let A=0;A<n.count;A++)a[A]=new P,l[A]=new P;let c=new P,u=new P,d=new P,f=new oe,p=new oe,y=new oe,x=new P,g=new P;function m(A,S,_){c.fromBufferAttribute(n,A),u.fromBufferAttribute(n,S),d.fromBufferAttribute(n,_),f.fromBufferAttribute(r,A),p.fromBufferAttribute(r,S),y.fromBufferAttribute(r,_),u.sub(c),d.sub(c),p.sub(f),y.sub(f);let I=1/(p.x*y.y-y.x*p.y);isFinite(I)&&(x.copy(u).multiplyScalar(y.y).addScaledVector(d,-p.y).multiplyScalar(I),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-y.x).multiplyScalar(I),a[A].add(x),a[S].add(x),a[_].add(x),l[A].add(g),l[S].add(g),l[_].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let A=0,S=v.length;A<S;++A){let _=v[A],I=_.start,F=_.count;for(let U=I,O=I+F;U<O;U+=3)m(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let M=new P,b=new P,L=new P,T=new P;function C(A){L.fromBufferAttribute(s,A),T.copy(L);let S=a[A];M.copy(S),M.sub(L.multiplyScalar(L.dot(S))).normalize(),b.crossVectors(T,S);let I=b.dot(l[A])<0?-1:1;o.setXYZW(A,M.x,M.y,M.z,I)}for(let A=0,S=v.length;A<S;++A){let _=v[A],I=_.start,F=_.count;for(let U=I,O=I+F;U<O;U+=3)C(e.getX(U+0)),C(e.getX(U+1)),C(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Lt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);let s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,u=new P,d=new P;if(e)for(let f=0,p=e.count;f<p;f+=3){let y=e.getX(f+0),x=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,y),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,g),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,y),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),a.add(u),l.add(u),c.add(u),n.setXYZ(y,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)kt.fromBufferAttribute(e,t),kt.normalize(),e.setXYZ(t,kt.x,kt.y,kt.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,d=a.normalized,f=new c.constructor(l.length*u),p=0,y=0;for(let x=0,g=l.length;x<g;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*u;for(let m=0;m<u;m++)f[y++]=c[p++]}return new Lt(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){let f=c[u],p=e(f,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){let p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],d=r[c];for(let f=0,p=d.length;f<p;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Eu=new ze,Yi=new _r,lo=new Ni,Tu=new P,co=new P,ho=new P,uo=new P,ll=new P,fo=new P,Au=new P,po=new P,fe=class extends Wt{constructor(e=new Nt,t=new pt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){fo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],d=r[l];u!==0&&(ll.fromBufferAttribute(d,e),o?fo.addScaledVector(ll,u):fo.addScaledVector(ll.sub(t),u))}t.add(fo)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),lo.copy(n.boundingSphere),lo.applyMatrix4(r),Yi.copy(e.ray).recast(e.near),!(lo.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(lo,Tu)===null||Yi.origin.distanceToSquared(Tu)>(e.far-e.near)**2))&&(Eu.copy(r).invert(),Yi.copy(e.ray).applyMatrix4(Eu),!(n.boundingBox!==null&&Yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Yi)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let y=0,x=f.length;y<x;y++){let g=f[y],m=o[g.materialIndex],v=Math.max(g.start,p.start),M=Math.min(a.count,Math.min(g.start+g.count,p.start+p.count));for(let b=v,L=M;b<L;b+=3){let T=a.getX(b),C=a.getX(b+1),A=a.getX(b+2);s=mo(this,m,e,n,c,u,d,T,C,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=a.getX(g),M=a.getX(g+1),b=a.getX(g+2);s=mo(this,o,e,n,c,u,d,v,M,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let y=0,x=f.length;y<x;y++){let g=f[y],m=o[g.materialIndex],v=Math.max(g.start,p.start),M=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let b=v,L=M;b<L;b+=3){let T=b,C=b+1,A=b+2;s=mo(this,m,e,n,c,u,d,T,C,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let y=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let g=y,m=x;g<m;g+=3){let v=g,M=g+1,b=g+2;s=mo(this,o,e,n,c,u,d,v,M,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Wp(i,e,t,n,s,r,o,a){let l;if(e.side===jt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Ii,a),l===null)return null;po.copy(a),po.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(po);return c<t.near||c>t.far?null:{distance:c,point:po.clone(),object:i}}function mo(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,co),i.getVertexPosition(l,ho),i.getVertexPosition(c,uo);let u=Wp(i,e,t,n,co,ho,uo,Au);if(u){let d=new P;ji.getBarycoord(Au,co,ho,uo,d),s&&(u.uv=ji.getInterpolatedAttribute(s,a,l,c,d,new oe)),r&&(u.uv1=ji.getInterpolatedAttribute(r,a,l,c,d,new oe)),o&&(u.normal=ji.getInterpolatedAttribute(o,a,l,c,d,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new P,materialIndex:0};ji.getNormal(co,ho,uo,f.normal),u.face=f,u.barycoord=d}return u}var Pe=class i extends Nt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],d=[],f=0,p=0;y("z","y","x",-1,-1,n,t,e,o,r,0),y("z","y","x",1,-1,n,t,-e,o,r,1),y("x","z","y",1,1,e,n,t,s,o,2),y("x","z","y",1,-1,e,n,-t,s,o,3),y("x","y","z",1,-1,e,t,n,s,r,4),y("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(u,3)),this.setAttribute("uv",new lt(d,2));function y(x,g,m,v,M,b,L,T,C,A,S){let _=b/C,I=L/A,F=b/2,U=L/2,O=T/2,G=C+1,z=A+1,K=0,X=0,ne=new P;for(let le=0;le<z;le++){let Me=le*I-U;for(let Ce=0;Ce<G;Ce++){let We=Ce*_-F;ne[x]=We*v,ne[g]=Me*M,ne[m]=O,c.push(ne.x,ne.y,ne.z),ne[x]=0,ne[g]=0,ne[m]=T>0?1:-1,u.push(ne.x,ne.y,ne.z),d.push(Ce/C),d.push(1-le/A),K+=1}}for(let le=0;le<A;le++)for(let Me=0;Me<C;Me++){let Ce=f+Me+G*le,We=f+Me+G*(le+1),$=f+(Me+1)+G*(le+1),re=f+(Me+1)+G*le;l.push(Ce,We,re),l.push(We,$,re),X+=6}a.addGroup(p,X,S),p+=X,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Os(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function tn(i){let e={};for(let t=0;t<i.length;t++){let n=Os(i[t]);for(let s in n)e[s]=n[s]}return e}function Xp(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ad(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}var fn={clone:Os,merge:tn},qp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,St=class extends xi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=qp,this.fragmentShader=Yp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=Xp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Fo=class extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ze,this.projectionMatrix=new ze,this.projectionMatrixInverse=new ze,this.coordinateSystem=pi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ti=new P,Ru=new oe,Cu=new oe,Yt=class extends Fo{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Lo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Va*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Lo*2*Math.atan(Math.tan(Va*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z)}getViewSize(e,t){return this.getViewBounds(e,Ru,Cu),t.subVectors(Cu,Ru)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Va*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ws=-90,Es=1,lc=class extends Wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Yt(ws,Es,e,t);s.layers=this.layers,this.add(s);let r=new Yt(ws,Es,e,t);r.layers=this.layers,this.add(r);let o=new Yt(ws,Es,e,t);o.layers=this.layers,this.add(o);let a=new Yt(ws,Es,e,t);a.layers=this.layers,this.add(a);let l=new Yt(ws,Es,e,t);l.layers=this.layers,this.add(l);let c=new Yt(ws,Es,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===pi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Po)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),y=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(d,f,p),e.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},zo=class extends sn{constructor(e,t,n,s,r,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Ns,super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},cc=class extends Dt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new zo(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ut}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Pe(5,5,5),r=new St({name:"CubemapFromEquirect",uniforms:Os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:jt,blending:Ot});r.uniforms.tEquirect.value=t;let o=new fe(s,r),a=t.minFilter;return t.minFilter===Ri&&(t.minFilter=Ut),new lc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},cl=new P,Zp=new P,$p=new Ye,Hn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=cl.subVectors(n,t).cross(Zp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(cl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||$p.getNormalMatrix(e),s=this.coplanarPoint(cl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Zi=new Ni,go=new P,br=class{constructor(e=new Hn,t=new Hn,n=new Hn,s=new Hn,r=new Hn,o=new Hn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=pi){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],d=s[6],f=s[7],p=s[8],y=s[9],x=s[10],g=s[11],m=s[12],v=s[13],M=s[14],b=s[15];if(n[0].setComponents(l-r,f-c,g-p,b-m).normalize(),n[1].setComponents(l+r,f+c,g+p,b+m).normalize(),n[2].setComponents(l+o,f+u,g+y,b+v).normalize(),n[3].setComponents(l-o,f-u,g-y,b-v).normalize(),n[4].setComponents(l-a,f-d,g-x,b-M).normalize(),t===pi)n[5].setComponents(l+a,f+d,g+x,b+M).normalize();else if(t===Po)n[5].setComponents(a,d,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(e){return Zi.center.set(0,0,0),Zi.radius=.7071067811865476,Zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(go.x=s.normal.x>0?e.max.x:e.min.x,go.y=s.normal.y>0?e.max.y:e.min.y,go.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(go)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Rd(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Jp(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,d=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,u);else{d.sort((p,y)=>p.start-y.start);let f=0;for(let p=1;p<d.length;p++){let y=d[f],x=d[p];x.start<=y.start+y.count+1?y.count=Math.max(y.count,x.start+x.count-y.start):(++f,d[f]=x)}d.length=f+1;for(let p=0,y=d.length;p<y;p++){let x=d[p];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Ct=class i extends Nt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,d=e/a,f=t/l,p=[],y=[],x=[],g=[];for(let m=0;m<u;m++){let v=m*f-o;for(let M=0;M<c;M++){let b=M*d-r;y.push(b,-v,0),x.push(0,0,1),g.push(M/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<a;v++){let M=v+c*m,b=v+c*(m+1),L=v+1+c*(m+1),T=v+1+c*m;p.push(M,b,T),p.push(b,L,T)}this.setIndex(p),this.setAttribute("position",new lt(y,3)),this.setAttribute("normal",new lt(x,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Kp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,jp=`#ifdef USE_ALPHAHASH
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
#endif`,Qp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,em=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,im=`#ifdef USE_AOMAP
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
#endif`,sm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rm=`#ifdef USE_BATCHING
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
#endif`,om=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,am=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,hm=`#ifdef USE_IRIDESCENCE
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
#endif`,um=`#ifdef USE_BUMPMAP
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
#endif`,dm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ym=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,vm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,_m=`#define PI 3.141592653589793
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
} // validated`,Mm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,bm=`vec3 transformedNormal = objectNormal;
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
#endif`,Sm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Em=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Am="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cm=`#ifdef USE_ENVMAP
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
#endif`,Im=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Pm=`#ifdef USE_ENVMAP
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
#endif`,Lm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dm=`#ifdef USE_ENVMAP
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
#endif`,Nm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Um=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Om=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zm=`#ifdef USE_GRADIENTMAP
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
}`,km=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vm=`uniform bool receiveShadow;
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
#endif`,Gm=`#ifdef USE_ENVMAP
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
#endif`,Wm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ym=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zm=`PhysicalMaterial material;
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
#endif`,$m=`struct PhysicalMaterial {
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
}`,Jm=`
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
#endif`,Km=`#if defined( RE_IndirectDiffuse )
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
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,e0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,t0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,n0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,i0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,s0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,o0=`#if defined( USE_POINTS_UV )
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
#endif`,a0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,l0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,c0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,h0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,u0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,d0=`#ifdef USE_MORPHTARGETS
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
#endif`,f0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,m0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,g0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,v0=`#ifdef USE_NORMALMAP
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
#endif`,_0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,M0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,b0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,S0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,w0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,E0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,T0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,A0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,R0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,C0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,I0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,P0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,L0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,D0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,N0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,U0=`float getShadowMask() {
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
}`,O0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,F0=`#ifdef USE_SKINNING
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
#endif`,z0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,k0=`#ifdef USE_SKINNING
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
#endif`,B0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,H0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,V0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,G0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,W0=`#ifdef USE_TRANSMISSION
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
#endif`,X0=`#ifdef USE_TRANSMISSION
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
#endif`,q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,J0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,K0=`uniform sampler2D t2D;
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
}`,j0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Q0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ng=`#include <common>
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
}`,ig=`#if DEPTH_PACKING == 3200
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
}`,sg=`#define DISTANCE
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
}`,rg=`#define DISTANCE
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
}`,og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ag=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lg=`uniform float scale;
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
}`,cg=`uniform vec3 diffuse;
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
}`,hg=`#include <common>
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
}`,ug=`uniform vec3 diffuse;
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
}`,dg=`#define LAMBERT
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
}`,fg=`#define LAMBERT
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
}`,pg=`#define MATCAP
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
}`,mg=`#define MATCAP
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
}`,gg=`#define NORMAL
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
}`,xg=`#define NORMAL
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
}`,yg=`#define PHONG
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
}`,vg=`#define PHONG
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
}`,_g=`#define STANDARD
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
}`,Mg=`#define STANDARD
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
}`,bg=`#define TOON
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
}`,Sg=`#define TOON
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
}`,wg=`uniform float size;
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
}`,Eg=`uniform vec3 diffuse;
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
}`,Tg=`#include <common>
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
}`,Ag=`uniform vec3 color;
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
}`,Rg=`uniform float rotation;
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
}`,Cg=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:Kp,alphahash_pars_fragment:jp,alphamap_fragment:Qp,alphamap_pars_fragment:em,alphatest_fragment:tm,alphatest_pars_fragment:nm,aomap_fragment:im,aomap_pars_fragment:sm,batching_pars_vertex:rm,batching_vertex:om,begin_vertex:am,beginnormal_vertex:lm,bsdfs:cm,iridescence_fragment:hm,bumpmap_pars_fragment:um,clipping_planes_fragment:dm,clipping_planes_pars_fragment:fm,clipping_planes_pars_vertex:pm,clipping_planes_vertex:mm,color_fragment:gm,color_pars_fragment:xm,color_pars_vertex:ym,color_vertex:vm,common:_m,cube_uv_reflection_fragment:Mm,defaultnormal_vertex:bm,displacementmap_pars_vertex:Sm,displacementmap_vertex:wm,emissivemap_fragment:Em,emissivemap_pars_fragment:Tm,colorspace_fragment:Am,colorspace_pars_fragment:Rm,envmap_fragment:Cm,envmap_common_pars_fragment:Im,envmap_pars_fragment:Pm,envmap_pars_vertex:Lm,envmap_physical_pars_fragment:Gm,envmap_vertex:Dm,fog_vertex:Nm,fog_pars_vertex:Um,fog_fragment:Om,fog_pars_fragment:Fm,gradientmap_pars_fragment:zm,lightmap_pars_fragment:km,lights_lambert_fragment:Bm,lights_lambert_pars_fragment:Hm,lights_pars_begin:Vm,lights_toon_fragment:Wm,lights_toon_pars_fragment:Xm,lights_phong_fragment:qm,lights_phong_pars_fragment:Ym,lights_physical_fragment:Zm,lights_physical_pars_fragment:$m,lights_fragment_begin:Jm,lights_fragment_maps:Km,lights_fragment_end:jm,logdepthbuf_fragment:Qm,logdepthbuf_pars_fragment:e0,logdepthbuf_pars_vertex:t0,logdepthbuf_vertex:n0,map_fragment:i0,map_pars_fragment:s0,map_particle_fragment:r0,map_particle_pars_fragment:o0,metalnessmap_fragment:a0,metalnessmap_pars_fragment:l0,morphinstance_vertex:c0,morphcolor_vertex:h0,morphnormal_vertex:u0,morphtarget_pars_vertex:d0,morphtarget_vertex:f0,normal_fragment_begin:p0,normal_fragment_maps:m0,normal_pars_fragment:g0,normal_pars_vertex:x0,normal_vertex:y0,normalmap_pars_fragment:v0,clearcoat_normal_fragment_begin:_0,clearcoat_normal_fragment_maps:M0,clearcoat_pars_fragment:b0,iridescence_pars_fragment:S0,opaque_fragment:w0,packing:E0,premultiplied_alpha_fragment:T0,project_vertex:A0,dithering_fragment:R0,dithering_pars_fragment:C0,roughnessmap_fragment:I0,roughnessmap_pars_fragment:P0,shadowmap_pars_fragment:L0,shadowmap_pars_vertex:D0,shadowmap_vertex:N0,shadowmask_pars_fragment:U0,skinbase_vertex:O0,skinning_pars_vertex:F0,skinning_vertex:z0,skinnormal_vertex:k0,specularmap_fragment:B0,specularmap_pars_fragment:H0,tonemapping_fragment:V0,tonemapping_pars_fragment:G0,transmission_fragment:W0,transmission_pars_fragment:X0,uv_pars_fragment:q0,uv_pars_vertex:Y0,uv_vertex:Z0,worldpos_vertex:$0,background_vert:J0,background_frag:K0,backgroundCube_vert:j0,backgroundCube_frag:Q0,cube_vert:eg,cube_frag:tg,depth_vert:ng,depth_frag:ig,distanceRGBA_vert:sg,distanceRGBA_frag:rg,equirect_vert:og,equirect_frag:ag,linedashed_vert:lg,linedashed_frag:cg,meshbasic_vert:hg,meshbasic_frag:ug,meshlambert_vert:dg,meshlambert_frag:fg,meshmatcap_vert:pg,meshmatcap_frag:mg,meshnormal_vert:gg,meshnormal_frag:xg,meshphong_vert:yg,meshphong_frag:vg,meshphysical_vert:_g,meshphysical_frag:Mg,meshtoon_vert:bg,meshtoon_frag:Sg,points_vert:wg,points_frag:Eg,shadow_vert:Tg,shadow_frag:Ag,sprite_vert:Rg,sprite_frag:Cg},de={common:{diffuse:{value:new xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new xe(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Yn={basic:{uniforms:tn([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:tn([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new xe(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:tn([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new xe(0)},specular:{value:new xe(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:tn([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:tn([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new xe(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:tn([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:tn([de.points,de.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:tn([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:tn([de.common,de.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:tn([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:tn([de.sprite,de.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:tn([de.common,de.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:tn([de.lights,de.fog,{color:{value:new xe(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Yn.physical={uniforms:tn([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new xe(0)},specularColor:{value:new xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};var xo={r:0,b:0,g:0},$i=new Gt,Ig=new ze;function Pg(i,e,t,n,s,r,o){let a=new xe(0),l=r===!0?0:1,c,u,d=null,f=0,p=null;function y(v){let M=v.isScene===!0?v.background:null;return M&&M.isTexture&&(M=(v.backgroundBlurriness>0?t:e).get(M)),M}function x(v){let M=!1,b=y(v);b===null?m(a,l):b&&b.isColor&&(m(b,1),M=!0);let L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,M){let b=y(M);b&&(b.isCubeTexture||b.mapping===ra)?(u===void 0&&(u=new fe(new Pe(1,1,1),new St({name:"BackgroundCubeMaterial",uniforms:Os(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(L,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),$i.copy(M.backgroundRotation),$i.x*=-1,$i.y*=-1,$i.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&($i.y*=-1,$i.z*=-1),u.material.uniforms.envMap.value=b,u.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Ig.makeRotationFromEuler($i)),u.material.toneMapped=et.getTransfer(b.colorSpace)!==ut,(d!==b||f!==b.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,d=b,f=b.version,p=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new fe(new Ct(2,2),new St({name:"BackgroundMaterial",uniforms:Os(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=et.getTransfer(b.colorSpace)!==ut,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(d!==b||f!==b.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,d=b,f=b.version,p=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,M){v.getRGB(xo,Ad(i)),n.buffers.color.setClear(xo.r,xo.g,xo.b,M,o)}return{getClearColor:function(){return a},setClearColor:function(v,M=1){a.set(v),l=M,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,m(a,l)},render:x,addToRenderList:g}}function Lg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(_,I,F,U,O){let G=!1,z=d(U,F,I);r!==z&&(r=z,c(r.object)),G=p(_,U,F,O),G&&y(_,U,F,O),O!==null&&e.update(O,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,b(_,I,F,U),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function u(_){return i.deleteVertexArray(_)}function d(_,I,F){let U=F.wireframe===!0,O=n[_.id];O===void 0&&(O={},n[_.id]=O);let G=O[I.id];G===void 0&&(G={},O[I.id]=G);let z=G[U];return z===void 0&&(z=f(l()),G[U]=z),z}function f(_){let I=[],F=[],U=[];for(let O=0;O<t;O++)I[O]=0,F[O]=0,U[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:U,object:_,attributes:{},index:null}}function p(_,I,F,U){let O=r.attributes,G=I.attributes,z=0,K=F.getAttributes();for(let X in K)if(K[X].location>=0){let le=O[X],Me=G[X];if(Me===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(Me=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(Me=_.instanceColor)),le===void 0||le.attribute!==Me||Me&&le.data!==Me.data)return!0;z++}return r.attributesNum!==z||r.index!==U}function y(_,I,F,U){let O={},G=I.attributes,z=0,K=F.getAttributes();for(let X in K)if(K[X].location>=0){let le=G[X];le===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(le=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(le=_.instanceColor));let Me={};Me.attribute=le,le&&le.data&&(Me.data=le.data),O[X]=Me,z++}r.attributes=O,r.attributesNum=z,r.index=U}function x(){let _=r.newAttributes;for(let I=0,F=_.length;I<F;I++)_[I]=0}function g(_){m(_,0)}function m(_,I){let F=r.newAttributes,U=r.enabledAttributes,O=r.attributeDivisors;F[_]=1,U[_]===0&&(i.enableVertexAttribArray(_),U[_]=1),O[_]!==I&&(i.vertexAttribDivisor(_,I),O[_]=I)}function v(){let _=r.newAttributes,I=r.enabledAttributes;for(let F=0,U=I.length;F<U;F++)I[F]!==_[F]&&(i.disableVertexAttribArray(F),I[F]=0)}function M(_,I,F,U,O,G,z){z===!0?i.vertexAttribIPointer(_,I,F,O,G):i.vertexAttribPointer(_,I,F,U,O,G)}function b(_,I,F,U){x();let O=U.attributes,G=F.getAttributes(),z=I.defaultAttributeValues;for(let K in G){let X=G[K];if(X.location>=0){let ne=O[K];if(ne===void 0&&(K==="instanceMatrix"&&_.instanceMatrix&&(ne=_.instanceMatrix),K==="instanceColor"&&_.instanceColor&&(ne=_.instanceColor)),ne!==void 0){let le=ne.normalized,Me=ne.itemSize,Ce=e.get(ne);if(Ce===void 0)continue;let We=Ce.buffer,$=Ce.type,re=Ce.bytesPerElement,be=$===i.INT||$===i.UNSIGNED_INT||ne.gpuType===th;if(ne.isInterleavedBufferAttribute){let ce=ne.data,Ae=ce.stride,Ue=ne.offset;if(ce.isInstancedInterleavedBuffer){for(let He=0;He<X.locationSize;He++)m(X.location+He,ce.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let He=0;He<X.locationSize;He++)g(X.location+He);i.bindBuffer(i.ARRAY_BUFFER,We);for(let He=0;He<X.locationSize;He++)M(X.location+He,Me/X.locationSize,$,le,Ae*re,(Ue+Me/X.locationSize*He)*re,be)}else{if(ne.isInstancedBufferAttribute){for(let ce=0;ce<X.locationSize;ce++)m(X.location+ce,ne.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ce=0;ce<X.locationSize;ce++)g(X.location+ce);i.bindBuffer(i.ARRAY_BUFFER,We);for(let ce=0;ce<X.locationSize;ce++)M(X.location+ce,Me/X.locationSize,$,le,Me*re,Me/X.locationSize*ce*re,be)}}else if(z!==void 0){let le=z[K];if(le!==void 0)switch(le.length){case 2:i.vertexAttrib2fv(X.location,le);break;case 3:i.vertexAttrib3fv(X.location,le);break;case 4:i.vertexAttrib4fv(X.location,le);break;default:i.vertexAttrib1fv(X.location,le)}}}}v()}function L(){A();for(let _ in n){let I=n[_];for(let F in I){let U=I[F];for(let O in U)u(U[O].object),delete U[O];delete I[F]}delete n[_]}}function T(_){if(n[_.id]===void 0)return;let I=n[_.id];for(let F in I){let U=I[F];for(let O in U)u(U[O].object),delete U[O];delete I[F]}delete n[_.id]}function C(_){for(let I in n){let F=n[I];if(F[_.id]===void 0)continue;let U=F[_.id];for(let O in U)u(U[O].object),delete U[O];delete F[_.id]}}function A(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:A,resetDefaultState:S,dispose:L,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function Dg(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,d){d!==0&&(i.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function a(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,d);let p=0;for(let y=0;y<d;y++)p+=u[y];t.update(p,n,1)}function l(c,u,d,f){if(d===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let y=0;y<c.length;y++)o(c[y],u[y],f[y]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,d);let y=0;for(let x=0;x<d;x++)y+=u[x]*f[x];t.update(y,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Ng(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==nn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let A=C===It&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Vn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==dn&&!A)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=y>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:y,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:b,vertexTextures:L,maxSamples:T}}function Ug(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Hn,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let p=d.length!==0||f||n!==0||s;return s=f,n=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,p){let y=d.clippingPlanes,x=d.clipIntersection,g=d.clipShadows,m=i.get(d);if(!s||y===null||y.length===0||r&&!g)r?u(null):c();else{let v=r?0:n,M=v*4,b=m.clippingState||null;l.value=b,b=u(y,f,M,p);for(let L=0;L!==M;++L)b[L]=t[L];m.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,p,y){let x=d!==null?d.length:0,g=null;if(x!==0){if(g=l.value,y!==!0||g===null){let m=p+x*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(g===null||g.length<m)&&(g=new Float32Array(m));for(let M=0,b=p;M!==x;++M,b+=4)o.copy(d[M]).applyMatrix4(v,a),o.normal.toArray(g,b),g[b+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Og(i){let e=new WeakMap;function t(o,a){return a===xr?o.mapping=Ns:a===Il&&(o.mapping=Us),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===xr||a===Il)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new cc(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Fs=class extends Fo{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Rs=4,Iu=[.125,.215,.35,.446,.526,.582],Qi=20,hl=new Fs,Pu=new xe,ul=null,dl=0,fl=0,pl=!1,Ki=(1+Math.sqrt(5))/2,Ts=1/Ki,Lu=[new P(-Ki,Ts,0),new P(Ki,Ts,0),new P(-Ts,0,Ki),new P(Ts,0,Ki),new P(0,Ki,-Ts),new P(0,Ki,Ts),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],zs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){ul=this._renderer.getRenderTarget(),dl=this._renderer.getActiveCubeFace(),fl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ul,dl,fl),this._renderer.xr.enabled=pl,e.scissorTest=!1,yo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ns||e.mapping===Us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ul=this._renderer.getRenderTarget(),dl=this._renderer.getActiveCubeFace(),fl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:It,format:nn,colorSpace:Jn,depthBuffer:!1},s=Du(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Du(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Fg(r)),this._blurMaterial=zg(r,e,t)}return s}_compileMaterial(e){let t=new fe(this._lodPlanes[0],e);this._renderer.compile(t,hl)}_sceneToCubeUV(e,t,n,s){let a=new Yt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Pu),u.toneMapping=Ci,u.autoClear=!1;let p=new pt({name:"PMREM.Background",side:jt,depthWrite:!1,depthTest:!1}),y=new fe(new Pe,p),x=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,x=!0):(p.color.copy(Pu),x=!0);for(let m=0;m<6;m++){let v=m%3;v===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):v===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));let M=this._cubeSize;yo(s,v*M,m>2?M:0,M,M),u.setRenderTarget(s),x&&u.render(y,a),u.render(e,a)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Ns||e.mapping===Us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nu());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new fe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;yo(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,hl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Lu[(s-r-1)%Lu.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,d=new fe(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Qi-1),x=r/y,g=isFinite(r)?1+Math.floor(u*x):Qi;g>Qi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Qi}`);let m=[],v=0;for(let C=0;C<Qi;++C){let A=C/x,S=Math.exp(-A*A/2);m.push(S),C===0?v+=S:C<g&&(v+=2*S)}for(let C=0;C<m.length;C++)m[C]=m[C]/v;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:M}=this;f.dTheta.value=y,f.mipInt.value=M-n;let b=this._sizeLods[s],L=3*b*(s>M-Rs?s-M+Rs:0),T=4*(this._cubeSize-b);yo(t,L,T,3*b,2*b),l.setRenderTarget(t),l.render(d,hl)}};function Fg(i){let e=[],t=[],n=[],s=i,r=i-Rs+1+Iu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Rs?l=Iu[o-i+Rs-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,y=6,x=3,g=2,m=1,v=new Float32Array(x*y*p),M=new Float32Array(g*y*p),b=new Float32Array(m*y*p);for(let T=0;T<p;T++){let C=T%3*2/3-1,A=T>2?0:-1,S=[C,A,0,C+2/3,A,0,C+2/3,A+1,0,C,A,0,C+2/3,A+1,0,C,A+1,0];v.set(S,x*y*T),M.set(f,g*y*T);let _=[T,T,T,T,T,T];b.set(_,m*y*T)}let L=new Nt;L.setAttribute("position",new Lt(v,x)),L.setAttribute("uv",new Lt(M,g)),L.setAttribute("faceIndex",new Lt(b,m)),e.push(L),s>Rs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Du(i,e,t){let n=new Dt(i,e,t);return n.texture.mapping=ra,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function yo(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function zg(i,e,t){let n=new Float32Array(Qi),s=new P(0,1,0);return new St({name:"SphericalGaussianBlur",defines:{n:Qi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ch(),fragmentShader:`

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
		`,blending:Ot,depthTest:!1,depthWrite:!1})}function Nu(){return new St({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ch(),fragmentShader:`

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
		`,blending:Ot,depthTest:!1,depthWrite:!1})}function Uu(){return new St({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ch(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ot,depthTest:!1,depthWrite:!1})}function ch(){return`

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
	`}function kg(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===xr||l===Il,u=l===Ns||l===Us;if(c||u){let d=e.get(a),f=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new zs(i)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{let p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new zs(i)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Bg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&dr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Hg(i,e,t,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&e.remove(f.index);for(let y in f.attributes)e.remove(f.attributes[y]);for(let y in f.morphAttributes){let x=f.morphAttributes[y];for(let g=0,m=x.length;g<m;g++)e.remove(x[g])}f.removeEventListener("dispose",o),delete s[f.id];let p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(d){let f=d.attributes;for(let y in f)e.update(f[y],i.ARRAY_BUFFER);let p=d.morphAttributes;for(let y in p){let x=p[y];for(let g=0,m=x.length;g<m;g++)e.update(x[g],i.ARRAY_BUFFER)}}function c(d){let f=[],p=d.index,y=d.attributes.position,x=0;if(p!==null){let v=p.array;x=p.version;for(let M=0,b=v.length;M<b;M+=3){let L=v[M+0],T=v[M+1],C=v[M+2];f.push(L,T,T,C,C,L)}}else if(y!==void 0){let v=y.array;x=y.version;for(let M=0,b=v.length/3-1;M<b;M+=3){let L=M+0,T=M+1,C=M+2;f.push(L,T,T,C,C,L)}}else return;let g=new(Ed(f)?Oo:Uo)(f,1);g.version=x;let m=r.get(d);m&&e.remove(m),r.set(d,g)}function u(d){let f=r.get(d);if(f){let p=d.index;p!==null&&f.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function Vg(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*o),t.update(p,n,1)}function c(f,p,y){y!==0&&(i.drawElementsInstanced(n,p,r,f*o,y),t.update(p,n,y))}function u(f,p,y){if(y===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,y);let g=0;for(let m=0;m<y;m++)g+=p[m];t.update(g,n,1)}function d(f,p,y,x){if(y===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<f.length;m++)c(f[m]/o,p[m],x[m]);else{g.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,y);let m=0;for(let v=0;v<y;v++)m+=p[v]*x[v];t.update(m,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Gg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Wg(i,e,t){let n=new WeakMap,s=new mt;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,f=n.get(a);if(f===void 0||f.count!==d){let S=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",S)};f!==void 0&&f.texture.dispose();let p=a.morphAttributes.position!==void 0,y=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],M=0;p===!0&&(M=1),y===!0&&(M=2),x===!0&&(M=3);let b=a.attributes.position.count*M,L=1;b>e.maxTextureSize&&(L=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let T=new Float32Array(b*L*4*d),C=new No(T,b,L,d);C.type=dn,C.needsUpdate=!0;let A=M*4;for(let _=0;_<d;_++){let I=g[_],F=m[_],U=v[_],O=b*L*4*_;for(let G=0;G<I.count;G++){let z=G*A;p===!0&&(s.fromBufferAttribute(I,G),T[O+z+0]=s.x,T[O+z+1]=s.y,T[O+z+2]=s.z,T[O+z+3]=0),y===!0&&(s.fromBufferAttribute(F,G),T[O+z+4]=s.x,T[O+z+5]=s.y,T[O+z+6]=s.z,T[O+z+7]=0),x===!0&&(s.fromBufferAttribute(U,G),T[O+z+8]=s.x,T[O+z+9]=s.y,T[O+z+10]=s.z,T[O+z+11]=U.itemSize===4?s.w:1)}}f={count:d,texture:C,size:new oe(b,L)},n.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];let y=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",y),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Xg(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,d=e.get(l,u);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var ks=class extends sn{constructor(e,t,n,s,r,o,a,l,c,u=Is){if(u!==Is&&u!==Li)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Is&&(n=es),n===void 0&&u===Li&&(n=Pi),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Qt,this.minFilter=l!==void 0?l:Qt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Cd=new sn,Ou=new ks(1,1),Id=new No,Pd=new ac,Ld=new zo,Fu=[],zu=[],ku=new Float32Array(16),Bu=new Float32Array(9),Hu=new Float32Array(4);function Ys(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Fu[s];if(r===void 0&&(r=new Float32Array(s),Fu[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function zt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function aa(i,e){let t=zu[e];t===void 0&&(t=new Int32Array(e),zu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function qg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Yg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2fv(this.addr,e),zt(t,e)}}function Zg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;i.uniform3fv(this.addr,e),zt(t,e)}}function $g(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4fv(this.addr,e),zt(t,e)}}function Jg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),zt(t,e)}else{if(Ft(t,n))return;Hu.set(n),i.uniformMatrix2fv(this.addr,!1,Hu),zt(t,n)}}function Kg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),zt(t,e)}else{if(Ft(t,n))return;Bu.set(n),i.uniformMatrix3fv(this.addr,!1,Bu),zt(t,n)}}function jg(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),zt(t,e)}else{if(Ft(t,n))return;ku.set(n),i.uniformMatrix4fv(this.addr,!1,ku),zt(t,n)}}function Qg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ex(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2iv(this.addr,e),zt(t,e)}}function tx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3iv(this.addr,e),zt(t,e)}}function nx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4iv(this.addr,e),zt(t,e)}}function ix(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function sx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2uiv(this.addr,e),zt(t,e)}}function rx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3uiv(this.addr,e),zt(t,e)}}function ox(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4uiv(this.addr,e),zt(t,e)}}function ax(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ou.compareFunction=wd,r=Ou):r=Cd,t.setTexture2D(e||r,s)}function lx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Pd,s)}function cx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Ld,s)}function hx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Id,s)}function ux(i){switch(i){case 5126:return qg;case 35664:return Yg;case 35665:return Zg;case 35666:return $g;case 35674:return Jg;case 35675:return Kg;case 35676:return jg;case 5124:case 35670:return Qg;case 35667:case 35671:return ex;case 35668:case 35672:return tx;case 35669:case 35673:return nx;case 5125:return ix;case 36294:return sx;case 36295:return rx;case 36296:return ox;case 35678:case 36198:case 36298:case 36306:case 35682:return ax;case 35679:case 36299:case 36307:return lx;case 35680:case 36300:case 36308:case 36293:return cx;case 36289:case 36303:case 36311:case 36292:return hx}}function dx(i,e){i.uniform1fv(this.addr,e)}function fx(i,e){let t=Ys(e,this.size,2);i.uniform2fv(this.addr,t)}function px(i,e){let t=Ys(e,this.size,3);i.uniform3fv(this.addr,t)}function mx(i,e){let t=Ys(e,this.size,4);i.uniform4fv(this.addr,t)}function gx(i,e){let t=Ys(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function xx(i,e){let t=Ys(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function yx(i,e){let t=Ys(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function vx(i,e){i.uniform1iv(this.addr,e)}function _x(i,e){i.uniform2iv(this.addr,e)}function Mx(i,e){i.uniform3iv(this.addr,e)}function bx(i,e){i.uniform4iv(this.addr,e)}function Sx(i,e){i.uniform1uiv(this.addr,e)}function wx(i,e){i.uniform2uiv(this.addr,e)}function Ex(i,e){i.uniform3uiv(this.addr,e)}function Tx(i,e){i.uniform4uiv(this.addr,e)}function Ax(i,e,t){let n=this.cache,s=e.length,r=aa(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Cd,r[o])}function Rx(i,e,t){let n=this.cache,s=e.length,r=aa(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Pd,r[o])}function Cx(i,e,t){let n=this.cache,s=e.length,r=aa(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Ld,r[o])}function Ix(i,e,t){let n=this.cache,s=e.length,r=aa(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),zt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Id,r[o])}function Px(i){switch(i){case 5126:return dx;case 35664:return fx;case 35665:return px;case 35666:return mx;case 35674:return gx;case 35675:return xx;case 35676:return yx;case 5124:case 35670:return vx;case 35667:case 35671:return _x;case 35668:case 35672:return Mx;case 35669:case 35673:return bx;case 5125:return Sx;case 36294:return wx;case 36295:return Ex;case 36296:return Tx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ax;case 35679:case 36299:case 36307:return Rx;case 35680:case 36300:case 36308:case 36293:return Cx;case 36289:case 36303:case 36311:case 36292:return Ix}}var hc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ux(t.type)}},uc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Px(t.type)}},dc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},ml=/(\w+)(\])?(\[|\.)?/g;function Vu(i,e){i.seq.push(e),i.map[e.id]=e}function Lx(i,e,t){let n=i.name,s=n.length;for(ml.lastIndex=0;;){let r=ml.exec(n),o=ml.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Vu(t,c===void 0?new hc(a,i,e):new uc(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new dc(a),Vu(t,d)),t=d}}}var Ls=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Lx(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function Gu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Dx=37297,Nx=0;function Ux(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Wu=new Ye;function Ox(i){et._getMatrix(Wu,et.workingColorSpace,i);let e=`mat3( ${Wu.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case oa:return[e,"LinearTransferOETF"];case ut:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Xu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Ux(i.getShaderSource(e),o)}else return s}function Fx(i,e){let t=Ox(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function zx(i,e){let t;switch(e){case Jc:t="Linear";break;case Kc:t="Reinhard";break;case jc:t="Cineon";break;case Ar:t="ACESFilmic";break;case Qc:t="AgX";break;case eh:t="Neutral";break;case fp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var vo=new P;function kx(){et.getLuminanceCoefficients(vo);let i=vo.x.toFixed(4),e=vo.y.toFixed(4),t=vo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fr).join(`
`)}function Hx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Vx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function fr(i){return i!==""}function qu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Yu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Gx=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(i){return i.replace(Gx,Xx)}var Wx=new Map;function Xx(i,e){let t=Ze[e];if(t===void 0){let n=Wx.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return fc(t)}var qx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zu(i){return i.replace(qx,Yx)}function Yx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $u(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Zx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===dd?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Zc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===di&&(e="SHADOWMAP_TYPE_VSM"),e}function $x(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ns:case Us:e="ENVMAP_TYPE_CUBE";break;case ra:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Jx(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Us:e="ENVMAP_MODE_REFRACTION";break}return e}function Kx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case fd:e="ENVMAP_BLENDING_MULTIPLY";break;case up:e="ENVMAP_BLENDING_MIX";break;case dp:e="ENVMAP_BLENDING_ADD";break}return e}function jx(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Qx(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Zx(t),c=$x(t),u=Jx(t),d=Kx(t),f=jx(t),p=Bx(t),y=Hx(r),x=s.createProgram(),g,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(fr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y].filter(fr).join(`
`),m.length>0&&(m+=`
`)):(g=[$u(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fr).join(`
`),m=[$u(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,y,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ci?"#define TONE_MAPPING":"",t.toneMapping!==Ci?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Ci?zx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,Fx("linearToOutputTexel",t.outputColorSpace),kx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fr).join(`
`)),o=fc(o),o=qu(o,t),o=Yu(o,t),a=fc(a),a=qu(a,t),a=Yu(a,t),o=Zu(o),a=Zu(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===cu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===cu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let M=v+g+o,b=v+m+a,L=Gu(s,s.VERTEX_SHADER,M),T=Gu(s,s.FRAGMENT_SHADER,b);s.attachShader(x,L),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(I){if(i.debug.checkShaderErrors){let F=s.getProgramInfoLog(x).trim(),U=s.getShaderInfoLog(L).trim(),O=s.getShaderInfoLog(T).trim(),G=!0,z=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,L,T);else{let K=Xu(s,L,"vertex"),X=Xu(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+F+`
`+K+`
`+X)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(U===""||O==="")&&(z=!1);z&&(I.diagnostics={runnable:G,programLog:F,vertexShader:{log:U,prefix:g},fragmentShader:{log:O,prefix:m}})}s.deleteShader(L),s.deleteShader(T),A=new Ls(s,x),S=Vx(s,x)}let A;this.getUniforms=function(){return A===void 0&&C(this),A};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(x,Dx)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Nx++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=L,this.fragmentShader=T,this}var ey=0,pc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new mc(e),t.set(e,n)),n}},mc=class{constructor(e){this.id=ey++,this.code=e,this.usedTimes=0}};function ty(i,e,t,n,s,r,o){let a=new Mr,l=new pc,c=new Set,u=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures,p=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return c.add(S),S===0?"uv":`uv${S}`}function g(S,_,I,F,U){let O=F.fog,G=U.geometry,z=S.isMeshStandardMaterial?F.environment:null,K=(S.isMeshStandardMaterial?t:e).get(S.envMap||z),X=K&&K.mapping===ra?K.image.height:null,ne=y[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));let le=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Me=le!==void 0?le.length:0,Ce=0;G.morphAttributes.position!==void 0&&(Ce=1),G.morphAttributes.normal!==void 0&&(Ce=2),G.morphAttributes.color!==void 0&&(Ce=3);let We,$,re,be;if(ne){let ft=Yn[ne];We=ft.vertexShader,$=ft.fragmentShader}else We=S.vertexShader,$=S.fragmentShader,l.update(S),re=l.getVertexShaderID(S),be=l.getFragmentShaderID(S);let ce=i.getRenderTarget(),Ae=i.state.buffers.depth.getReversed(),Ue=U.isInstancedMesh===!0,He=U.isBatchedMesh===!0,yt=!!S.map,je=!!S.matcap,_t=!!K,k=!!S.aoMap,Zt=!!S.lightMap,Je=!!S.bumpMap,Ke=!!S.normalMap,Le=!!S.displacementMap,dt=!!S.emissiveMap,Ie=!!S.metalnessMap,R=!!S.roughnessMap,w=S.anisotropy>0,V=S.clearcoat>0,Q=S.dispersion>0,ie=S.iridescence>0,J=S.sheen>0,Se=S.transmission>0,ue=w&&!!S.anisotropyMap,pe=V&&!!S.clearcoatMap,$e=V&&!!S.clearcoatNormalMap,se=V&&!!S.clearcoatRoughnessMap,ve=ie&&!!S.iridescenceMap,Fe=ie&&!!S.iridescenceThicknessMap,Be=J&&!!S.sheenColorMap,_e=J&&!!S.sheenRoughnessMap,Qe=!!S.specularMap,Ve=!!S.specularColorMap,rt=!!S.specularIntensityMap,N=Se&&!!S.transmissionMap,he=Se&&!!S.thicknessMap,Z=!!S.gradientMap,ee=!!S.alphaMap,ye=S.alphaTest>0,me=!!S.alphaHash,Xe=!!S.extensions,Tt=Ci;S.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(Tt=i.toneMapping);let $t={shaderID:ne,shaderType:S.type,shaderName:S.name,vertexShader:We,fragmentShader:$,defines:S.defines,customVertexShaderID:re,customFragmentShaderID:be,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:He,batchingColor:He&&U._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&U.instanceColor!==null,instancingMorph:Ue&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ce===null?i.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Jn,alphaToCoverage:!!S.alphaToCoverage,map:yt,matcap:je,envMap:_t,envMapMode:_t&&K.mapping,envMapCubeUVHeight:X,aoMap:k,lightMap:Zt,bumpMap:Je,normalMap:Ke,displacementMap:f&&Le,emissiveMap:dt,normalMapObjectSpace:Ke&&S.normalMapType===xp,normalMapTangentSpace:Ke&&S.normalMapType===lh,metalnessMap:Ie,roughnessMap:R,anisotropy:w,anisotropyMap:ue,clearcoat:V,clearcoatMap:pe,clearcoatNormalMap:$e,clearcoatRoughnessMap:se,dispersion:Q,iridescence:ie,iridescenceMap:ve,iridescenceThicknessMap:Fe,sheen:J,sheenColorMap:Be,sheenRoughnessMap:_e,specularMap:Qe,specularColorMap:Ve,specularIntensityMap:rt,transmission:Se,transmissionMap:N,thicknessMap:he,gradientMap:Z,opaque:S.transparent===!1&&S.blending===Cs&&S.alphaToCoverage===!1,alphaMap:ee,alphaTest:ye,alphaHash:me,combine:S.combine,mapUv:yt&&x(S.map.channel),aoMapUv:k&&x(S.aoMap.channel),lightMapUv:Zt&&x(S.lightMap.channel),bumpMapUv:Je&&x(S.bumpMap.channel),normalMapUv:Ke&&x(S.normalMap.channel),displacementMapUv:Le&&x(S.displacementMap.channel),emissiveMapUv:dt&&x(S.emissiveMap.channel),metalnessMapUv:Ie&&x(S.metalnessMap.channel),roughnessMapUv:R&&x(S.roughnessMap.channel),anisotropyMapUv:ue&&x(S.anisotropyMap.channel),clearcoatMapUv:pe&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:$e&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Fe&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:_e&&x(S.sheenRoughnessMap.channel),specularMapUv:Qe&&x(S.specularMap.channel),specularColorMapUv:Ve&&x(S.specularColorMap.channel),specularIntensityMapUv:rt&&x(S.specularIntensityMap.channel),transmissionMapUv:N&&x(S.transmissionMap.channel),thicknessMapUv:he&&x(S.thicknessMap.channel),alphaMapUv:ee&&x(S.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Ke||w),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!G.attributes.uv&&(yt||ee),fog:!!O,useFog:S.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Ae,skinning:U.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:Ce,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Tt,decodeVideoTexture:yt&&S.map.isVideoTexture===!0&&et.getTransfer(S.map.colorSpace)===ut,decodeVideoTextureEmissive:dt&&S.emissiveMap.isVideoTexture===!0&&et.getTransfer(S.emissiveMap.colorSpace)===ut,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ht,flipSided:S.side===jt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Xe&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Xe&&S.extensions.multiDraw===!0||He)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return $t.vertexUv1s=c.has(1),$t.vertexUv2s=c.has(2),$t.vertexUv3s=c.has(3),c.clear(),$t}function m(S){let _=[];if(S.shaderID?_.push(S.shaderID):(_.push(S.customVertexShaderID),_.push(S.customFragmentShaderID)),S.defines!==void 0)for(let I in S.defines)_.push(I),_.push(S.defines[I]);return S.isRawShaderMaterial===!1&&(v(_,S),M(_,S),_.push(i.outputColorSpace)),_.push(S.customProgramCacheKey),_.join()}function v(S,_){S.push(_.precision),S.push(_.outputColorSpace),S.push(_.envMapMode),S.push(_.envMapCubeUVHeight),S.push(_.mapUv),S.push(_.alphaMapUv),S.push(_.lightMapUv),S.push(_.aoMapUv),S.push(_.bumpMapUv),S.push(_.normalMapUv),S.push(_.displacementMapUv),S.push(_.emissiveMapUv),S.push(_.metalnessMapUv),S.push(_.roughnessMapUv),S.push(_.anisotropyMapUv),S.push(_.clearcoatMapUv),S.push(_.clearcoatNormalMapUv),S.push(_.clearcoatRoughnessMapUv),S.push(_.iridescenceMapUv),S.push(_.iridescenceThicknessMapUv),S.push(_.sheenColorMapUv),S.push(_.sheenRoughnessMapUv),S.push(_.specularMapUv),S.push(_.specularColorMapUv),S.push(_.specularIntensityMapUv),S.push(_.transmissionMapUv),S.push(_.thicknessMapUv),S.push(_.combine),S.push(_.fogExp2),S.push(_.sizeAttenuation),S.push(_.morphTargetsCount),S.push(_.morphAttributeCount),S.push(_.numDirLights),S.push(_.numPointLights),S.push(_.numSpotLights),S.push(_.numSpotLightMaps),S.push(_.numHemiLights),S.push(_.numRectAreaLights),S.push(_.numDirLightShadows),S.push(_.numPointLightShadows),S.push(_.numSpotLightShadows),S.push(_.numSpotLightShadowsWithMaps),S.push(_.numLightProbes),S.push(_.shadowMapType),S.push(_.toneMapping),S.push(_.numClippingPlanes),S.push(_.numClipIntersection),S.push(_.depthPacking)}function M(S,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reverseDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),S.push(a.mask)}function b(S){let _=y[S.type],I;if(_){let F=Yn[_];I=fn.clone(F.uniforms)}else I=S.uniforms;return I}function L(S,_){let I;for(let F=0,U=u.length;F<U;F++){let O=u[F];if(O.cacheKey===_){I=O,++I.usedTimes;break}}return I===void 0&&(I=new Qx(i,_,S,r),u.push(I)),I}function T(S){if(--S.usedTimes===0){let _=u.indexOf(S);u[_]=u[u.length-1],u.pop(),S.destroy()}}function C(S){l.remove(S)}function A(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:b,acquireProgram:L,releaseProgram:T,releaseShaderCache:C,programs:u,dispose:A}}function ny(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function iy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ju(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ku(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,f,p,y,x,g){let m=i[e];return m===void 0?(m={id:d.id,object:d,geometry:f,material:p,groupOrder:y,renderOrder:d.renderOrder,z:x,group:g},i[e]=m):(m.id=d.id,m.object=d,m.geometry=f,m.material=p,m.groupOrder=y,m.renderOrder=d.renderOrder,m.z=x,m.group=g),e++,m}function a(d,f,p,y,x,g){let m=o(d,f,p,y,x,g);p.transmission>0?n.push(m):p.transparent===!0?s.push(m):t.push(m)}function l(d,f,p,y,x,g){let m=o(d,f,p,y,x,g);p.transmission>0?n.unshift(m):p.transparent===!0?s.unshift(m):t.unshift(m)}function c(d,f){t.length>1&&t.sort(d||iy),n.length>1&&n.sort(f||Ju),s.length>1&&s.sort(f||Ju)}function u(){for(let d=e,f=i.length;d<f;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function sy(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Ku,i.set(n,[o])):s>=r.length?(o=new Ku,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function ry(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new xe};break;case"SpotLight":t={position:new P,direction:new P,color:new xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new xe,groundColor:new xe};break;case"RectAreaLight":t={color:new xe,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function oy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var ay=0;function ly(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function cy(i){let e=new ry,t=oy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);let s=new P,r=new ze,o=new ze;function a(c){let u=0,d=0,f=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,y=0,x=0,g=0,m=0,v=0,M=0,b=0,L=0,T=0,C=0;c.sort(ly);for(let S=0,_=c.length;S<_;S++){let I=c[S],F=I.color,U=I.intensity,O=I.distance,G=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=F.r*U,d+=F.g*U,f+=F.b*U;else if(I.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(I.sh.coefficients[z],U);C++}else if(I.isDirectionalLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let K=I.shadow,X=t.get(I);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=G,n.directionalShadowMatrix[p]=I.shadow.matrix,v++}n.directional[p]=z,p++}else if(I.isSpotLight){let z=e.get(I);z.position.setFromMatrixPosition(I.matrixWorld),z.color.copy(F).multiplyScalar(U),z.distance=O,z.coneCos=Math.cos(I.angle),z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),z.decay=I.decay,n.spot[x]=z;let K=I.shadow;if(I.map&&(n.spotLightMap[L]=I.map,L++,K.updateMatrices(I),I.castShadow&&T++),n.spotLightMatrix[x]=K.matrix,I.castShadow){let X=t.get(I);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.spotShadow[x]=X,n.spotShadowMap[x]=G,b++}x++}else if(I.isRectAreaLight){let z=e.get(I);z.color.copy(F).multiplyScalar(U),z.halfWidth.set(I.width*.5,0,0),z.halfHeight.set(0,I.height*.5,0),n.rectArea[g]=z,g++}else if(I.isPointLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),z.distance=I.distance,z.decay=I.decay,I.castShadow){let K=I.shadow,X=t.get(I);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,X.shadowCameraNear=K.camera.near,X.shadowCameraFar=K.camera.far,n.pointShadow[y]=X,n.pointShadowMap[y]=G,n.pointShadowMatrix[y]=I.shadow.matrix,M++}n.point[y]=z,y++}else if(I.isHemisphereLight){let z=e.get(I);z.skyColor.copy(I.color).multiplyScalar(U),z.groundColor.copy(I.groundColor).multiplyScalar(U),n.hemi[m]=z,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;let A=n.hash;(A.directionalLength!==p||A.pointLength!==y||A.spotLength!==x||A.rectAreaLength!==g||A.hemiLength!==m||A.numDirectionalShadows!==v||A.numPointShadows!==M||A.numSpotShadows!==b||A.numSpotMaps!==L||A.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=g,n.point.length=y,n.hemi.length=m,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=b+L-T,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=C,A.directionalLength=p,A.pointLength=y,A.spotLength=x,A.rectAreaLength=g,A.hemiLength=m,A.numDirectionalShadows=v,A.numPointShadows=M,A.numSpotShadows=b,A.numSpotMaps=L,A.numLightProbes=C,n.version=ay++)}function l(c,u){let d=0,f=0,p=0,y=0,x=0,g=u.matrixWorldInverse;for(let m=0,v=c.length;m<v;m++){let M=c[m];if(M.isDirectionalLight){let b=n.directional[d];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),d++}else if(M.isSpotLight){let b=n.spot[p];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),p++}else if(M.isRectAreaLight){let b=n.rectArea[y];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),o.identity(),r.copy(M.matrixWorld),r.premultiply(g),o.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),y++}else if(M.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(g),f++}else if(M.isHemisphereLight){let b=n.hemi[x];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(g),x++}}}return{setup:a,setupView:l,state:n}}function ju(i){let e=new cy(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function hy(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new ju(i),e.set(s,[a])):r>=o.length?(a=new ju(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var gc=class extends xi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=mp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},xc=class extends xi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},uy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dy=`uniform sampler2D shadow_pass;
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
}`;function fy(i,e,t){let n=new br,s=new oe,r=new oe,o=new mt,a=new gc({depthPacking:gp}),l=new xc,c={},u=t.maxTextureSize,d={[Ii]:jt,[jt]:Ii,[Ht]:Ht},f=new St({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:uy,fragmentShader:dy}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let y=new Nt;y.setAttribute("position",new Lt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new fe(y,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=dd;let m=this.type;this.render=function(T,C,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let S=i.getRenderTarget(),_=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Ot),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let U=m!==di&&this.type===di,O=m===di&&this.type!==di;for(let G=0,z=T.length;G<z;G++){let K=T[G],X=K.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let ne=X.getFrameExtents();if(s.multiply(ne),r.copy(X.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,X.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,X.mapSize.y=r.y)),X.map===null||U===!0||O===!0){let Me=this.type!==di?{minFilter:Qt,magFilter:Qt}:{};X.map!==null&&X.map.dispose(),X.map=new Dt(s.x,s.y,Me),X.map.texture.name=K.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();let le=X.getViewportCount();for(let Me=0;Me<le;Me++){let Ce=X.getViewport(Me);o.set(r.x*Ce.x,r.y*Ce.y,r.x*Ce.z,r.y*Ce.w),F.viewport(o),X.updateMatrices(K,Me),n=X.getFrustum(),b(C,A,X.camera,K,this.type)}X.isPointLightShadow!==!0&&this.type===di&&v(X,A),X.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(S,_,I)};function v(T,C){let A=e.update(x);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Dt(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(C,null,A,f,x,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(C,null,A,p,x,null)}function M(T,C,A,S){let _=null,I=A.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)_=I;else if(_=A.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let F=_.uuid,U=C.uuid,O=c[F];O===void 0&&(O={},c[F]=O);let G=O[U];G===void 0&&(G=_.clone(),O[U]=G,C.addEventListener("dispose",L)),_=G}if(_.visible=C.visible,_.wireframe=C.wireframe,S===di?_.side=C.shadowSide!==null?C.shadowSide:C.side:_.side=C.shadowSide!==null?C.shadowSide:d[C.side],_.alphaMap=C.alphaMap,_.alphaTest=C.alphaTest,_.map=C.map,_.clipShadows=C.clipShadows,_.clippingPlanes=C.clippingPlanes,_.clipIntersection=C.clipIntersection,_.displacementMap=C.displacementMap,_.displacementScale=C.displacementScale,_.displacementBias=C.displacementBias,_.wireframeLinewidth=C.wireframeLinewidth,_.linewidth=C.linewidth,A.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let F=i.properties.get(_);F.light=A}return _}function b(T,C,A,S,_){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&_===di)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,T.matrixWorld);let U=e.update(T),O=T.material;if(Array.isArray(O)){let G=U.groups;for(let z=0,K=G.length;z<K;z++){let X=G[z],ne=O[X.materialIndex];if(ne&&ne.visible){let le=M(T,ne,S,_);T.onBeforeShadow(i,T,C,A,U,le,X),i.renderBufferDirect(A,null,U,le,T,X),T.onAfterShadow(i,T,C,A,U,le,X)}}}else if(O.visible){let G=M(T,O,S,_);T.onBeforeShadow(i,T,C,A,U,G,null),i.renderBufferDirect(A,null,U,G,T,null),T.onAfterShadow(i,T,C,A,U,G,null)}}let F=T.children;for(let U=0,O=F.length;U<O;U++)b(F[U],C,A,S,_)}function L(T){T.target.removeEventListener("dispose",L);for(let A in c){let S=c[A],_=T.target.uuid;_ in S&&(S[_].dispose(),delete S[_])}}}var py={[Sl]:wl,[El]:Rl,[Tl]:Cl,[Ds]:Al,[wl]:Sl,[Rl]:El,[Cl]:Tl,[Al]:Ds};function my(i,e){function t(){let N=!1,he=new mt,Z=null,ee=new mt(0,0,0,0);return{setMask:function(ye){Z!==ye&&!N&&(i.colorMask(ye,ye,ye,ye),Z=ye)},setLocked:function(ye){N=ye},setClear:function(ye,me,Xe,Tt,$t){$t===!0&&(ye*=Tt,me*=Tt,Xe*=Tt),he.set(ye,me,Xe,Tt),ee.equals(he)===!1&&(i.clearColor(ye,me,Xe,Tt),ee.copy(he))},reset:function(){N=!1,Z=null,ee.set(-1,0,0,0)}}}function n(){let N=!1,he=!1,Z=null,ee=null,ye=null;return{setReversed:function(me){if(he!==me){let Xe=e.get("EXT_clip_control");he?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT);let Tt=ye;ye=null,this.setClear(Tt)}he=me},getReversed:function(){return he},setTest:function(me){me?ce(i.DEPTH_TEST):Ae(i.DEPTH_TEST)},setMask:function(me){Z!==me&&!N&&(i.depthMask(me),Z=me)},setFunc:function(me){if(he&&(me=py[me]),ee!==me){switch(me){case Sl:i.depthFunc(i.NEVER);break;case wl:i.depthFunc(i.ALWAYS);break;case El:i.depthFunc(i.LESS);break;case Ds:i.depthFunc(i.LEQUAL);break;case Tl:i.depthFunc(i.EQUAL);break;case Al:i.depthFunc(i.GEQUAL);break;case Rl:i.depthFunc(i.GREATER);break;case Cl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ee=me}},setLocked:function(me){N=me},setClear:function(me){ye!==me&&(he&&(me=1-me),i.clearDepth(me),ye=me)},reset:function(){N=!1,Z=null,ee=null,ye=null,he=!1}}}function s(){let N=!1,he=null,Z=null,ee=null,ye=null,me=null,Xe=null,Tt=null,$t=null;return{setTest:function(ft){N||(ft?ce(i.STENCIL_TEST):Ae(i.STENCIL_TEST))},setMask:function(ft){he!==ft&&!N&&(i.stencilMask(ft),he=ft)},setFunc:function(ft,On,si){(Z!==ft||ee!==On||ye!==si)&&(i.stencilFunc(ft,On,si),Z=ft,ee=On,ye=si)},setOp:function(ft,On,si){(me!==ft||Xe!==On||Tt!==si)&&(i.stencilOp(ft,On,si),me=ft,Xe=On,Tt=si)},setLocked:function(ft){N=ft},setClear:function(ft){$t!==ft&&(i.clearStencil(ft),$t=ft)},reset:function(){N=!1,he=null,Z=null,ee=null,ye=null,me=null,Xe=null,Tt=null,$t=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},d={},f=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,M=null,b=null,L=null,T=null,C=new xe(0,0,0),A=0,S=!1,_=null,I=null,F=null,U=null,O=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,K=0,X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(X)[1]),z=K>=1):X.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),z=K>=2);let ne=null,le={},Me=i.getParameter(i.SCISSOR_BOX),Ce=i.getParameter(i.VIEWPORT),We=new mt().fromArray(Me),$=new mt().fromArray(Ce);function re(N,he,Z,ee){let ye=new Uint8Array(4),me=i.createTexture();i.bindTexture(N,me),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Xe=0;Xe<Z;Xe++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(he,0,i.RGBA,1,1,ee,0,i.RGBA,i.UNSIGNED_BYTE,ye):i.texImage2D(he+Xe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ye);return me}let be={};be[i.TEXTURE_2D]=re(i.TEXTURE_2D,i.TEXTURE_2D,1),be[i.TEXTURE_CUBE_MAP]=re(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),be[i.TEXTURE_2D_ARRAY]=re(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),be[i.TEXTURE_3D]=re(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ce(i.DEPTH_TEST),o.setFunc(Ds),Je(!1),Ke(tu),ce(i.CULL_FACE),k(Ot);function ce(N){u[N]!==!0&&(i.enable(N),u[N]=!0)}function Ae(N){u[N]!==!1&&(i.disable(N),u[N]=!1)}function Ue(N,he){return d[N]!==he?(i.bindFramebuffer(N,he),d[N]=he,N===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=he),N===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=he),!0):!1}function He(N,he){let Z=p,ee=!1;if(N){Z=f.get(he),Z===void 0&&(Z=[],f.set(he,Z));let ye=N.textures;if(Z.length!==ye.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let me=0,Xe=ye.length;me<Xe;me++)Z[me]=i.COLOR_ATTACHMENT0+me;Z.length=ye.length,ee=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,ee=!0);ee&&i.drawBuffers(Z)}function yt(N){return y!==N?(i.useProgram(N),y=N,!0):!1}let je={[Ln]:i.FUNC_ADD,[Kf]:i.FUNC_SUBTRACT,[jf]:i.FUNC_REVERSE_SUBTRACT};je[Qf]=i.MIN,je[ep]=i.MAX;let _t={[Xs]:i.ZERO,[tp]:i.ONE,[np]:i.SRC_COLOR,[Ml]:i.SRC_ALPHA,[op]:i.SRC_ALPHA_SATURATE,[sa]:i.DST_COLOR,[ia]:i.DST_ALPHA,[ip]:i.ONE_MINUS_SRC_COLOR,[bl]:i.ONE_MINUS_SRC_ALPHA,[rp]:i.ONE_MINUS_DST_COLOR,[sp]:i.ONE_MINUS_DST_ALPHA,[ap]:i.CONSTANT_COLOR,[lp]:i.ONE_MINUS_CONSTANT_COLOR,[cp]:i.CONSTANT_ALPHA,[hp]:i.ONE_MINUS_CONSTANT_ALPHA};function k(N,he,Z,ee,ye,me,Xe,Tt,$t,ft){if(N===Ot){x===!0&&(Ae(i.BLEND),x=!1);return}if(x===!1&&(ce(i.BLEND),x=!0),N!==$c){if(N!==g||ft!==S){if((m!==Ln||b!==Ln)&&(i.blendEquation(i.FUNC_ADD),m=Ln,b=Ln),ft)switch(N){case Cs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mn:i.blendFunc(i.ONE,i.ONE);break;case nu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case iu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Cs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case nu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case iu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}v=null,M=null,L=null,T=null,C.set(0,0,0),A=0,g=N,S=ft}return}ye=ye||he,me=me||Z,Xe=Xe||ee,(he!==m||ye!==b)&&(i.blendEquationSeparate(je[he],je[ye]),m=he,b=ye),(Z!==v||ee!==M||me!==L||Xe!==T)&&(i.blendFuncSeparate(_t[Z],_t[ee],_t[me],_t[Xe]),v=Z,M=ee,L=me,T=Xe),(Tt.equals(C)===!1||$t!==A)&&(i.blendColor(Tt.r,Tt.g,Tt.b,$t),C.copy(Tt),A=$t),g=N,S=!1}function Zt(N,he){N.side===Ht?Ae(i.CULL_FACE):ce(i.CULL_FACE);let Z=N.side===jt;he&&(Z=!Z),Je(Z),N.blending===Cs&&N.transparent===!1?k(Ot):k(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let ee=N.stencilWrite;a.setTest(ee),ee&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),dt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ce(i.SAMPLE_ALPHA_TO_COVERAGE):Ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function Je(N){_!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),_=N)}function Ke(N){N!==$f?(ce(i.CULL_FACE),N!==I&&(N===tu?i.cullFace(i.BACK):N===Jf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ae(i.CULL_FACE),I=N}function Le(N){N!==F&&(z&&i.lineWidth(N),F=N)}function dt(N,he,Z){N?(ce(i.POLYGON_OFFSET_FILL),(U!==he||O!==Z)&&(i.polygonOffset(he,Z),U=he,O=Z)):Ae(i.POLYGON_OFFSET_FILL)}function Ie(N){N?ce(i.SCISSOR_TEST):Ae(i.SCISSOR_TEST)}function R(N){N===void 0&&(N=i.TEXTURE0+G-1),ne!==N&&(i.activeTexture(N),ne=N)}function w(N,he,Z){Z===void 0&&(ne===null?Z=i.TEXTURE0+G-1:Z=ne);let ee=le[Z];ee===void 0&&(ee={type:void 0,texture:void 0},le[Z]=ee),(ee.type!==N||ee.texture!==he)&&(ne!==Z&&(i.activeTexture(Z),ne=Z),i.bindTexture(N,he||be[N]),ee.type=N,ee.texture=he)}function V(){let N=le[ne];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ie(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Se(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ue(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function pe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $e(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function se(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Fe(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Be(N){We.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),We.copy(N))}function _e(N){$.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),$.copy(N))}function Qe(N,he){let Z=c.get(he);Z===void 0&&(Z=new WeakMap,c.set(he,Z));let ee=Z.get(N);ee===void 0&&(ee=i.getUniformBlockIndex(he,N.name),Z.set(N,ee))}function Ve(N,he){let ee=c.get(he).get(N);l.get(he)!==ee&&(i.uniformBlockBinding(he,ee,N.__bindingPointIndex),l.set(he,ee))}function rt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ne=null,le={},d={},f=new WeakMap,p=[],y=null,x=!1,g=null,m=null,v=null,M=null,b=null,L=null,T=null,C=new xe(0,0,0),A=0,S=!1,_=null,I=null,F=null,U=null,O=null,We.set(0,0,i.canvas.width,i.canvas.height),$.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ce,disable:Ae,bindFramebuffer:Ue,drawBuffers:He,useProgram:yt,setBlending:k,setMaterial:Zt,setFlipSided:Je,setCullFace:Ke,setLineWidth:Le,setPolygonOffset:dt,setScissorTest:Ie,activeTexture:R,bindTexture:w,unbindTexture:V,compressedTexImage2D:Q,compressedTexImage3D:ie,texImage2D:ve,texImage3D:Fe,updateUBOMapping:Qe,uniformBlockBinding:Ve,texStorage2D:$e,texStorage3D:se,texSubImage2D:J,texSubImage3D:Se,compressedTexSubImage2D:ue,compressedTexSubImage3D:pe,scissor:Be,viewport:_e,reset:rt}}function Qu(i,e,t,n){let s=gy(n);switch(t){case yd:return i*e;case _d:return i*e;case Md:return i*e*2;case sh:return i*e/s.components*s.byteLength;case rh:return i*e/s.components*s.byteLength;case bd:return i*e*2/s.components*s.byteLength;case oh:return i*e*2/s.components*s.byteLength;case vd:return i*e*3/s.components*s.byteLength;case nn:return i*e*4/s.components*s.byteLength;case ah:return i*e*4/s.components*s.byteLength;case Eo:case To:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ao:case Ro:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Dl:case Ul:return Math.max(i,16)*Math.max(e,8)/4;case Ll:case Nl:return Math.max(i,8)*Math.max(e,8)/2;case Ol:case Fl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case kl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Bl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Hl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Gl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Wl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Xl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ql:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Yl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Zl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case $l:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Jl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Kl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case jl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Co:case Ql:case ec:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Sd:case tc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case nc:case ic:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function gy(i){switch(i){case Vn:case md:return{byteLength:1,components:1};case yr:case gd:case It:return{byteLength:2,components:1};case nh:case ih:return{byteLength:2,components:4};case es:case th:case dn:return{byteLength:4,components:1};case xd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function xy(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,u=new WeakMap,d,f=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,w){return p?new OffscreenCanvas(R,w):vr("canvas")}function x(R,w,V){let Q=1,ie=Ie(R);if((ie.width>V||ie.height>V)&&(Q=V/Math.max(ie.width,ie.height)),Q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let J=Math.floor(Q*ie.width),Se=Math.floor(Q*ie.height);d===void 0&&(d=y(J,Se));let ue=w?y(J,Se):d;return ue.width=J,ue.height=Se,ue.getContext("2d").drawImage(R,0,0,J,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+J+"x"+Se+")."),ue}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),R;return R}function g(R){return R.generateMipmaps}function m(R){i.generateMipmap(R)}function v(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(R,w,V,Q,ie=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let J=w;if(w===i.RED&&(V===i.FLOAT&&(J=i.R32F),V===i.HALF_FLOAT&&(J=i.R16F),V===i.UNSIGNED_BYTE&&(J=i.R8)),w===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.R8UI),V===i.UNSIGNED_SHORT&&(J=i.R16UI),V===i.UNSIGNED_INT&&(J=i.R32UI),V===i.BYTE&&(J=i.R8I),V===i.SHORT&&(J=i.R16I),V===i.INT&&(J=i.R32I)),w===i.RG&&(V===i.FLOAT&&(J=i.RG32F),V===i.HALF_FLOAT&&(J=i.RG16F),V===i.UNSIGNED_BYTE&&(J=i.RG8)),w===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RG8UI),V===i.UNSIGNED_SHORT&&(J=i.RG16UI),V===i.UNSIGNED_INT&&(J=i.RG32UI),V===i.BYTE&&(J=i.RG8I),V===i.SHORT&&(J=i.RG16I),V===i.INT&&(J=i.RG32I)),w===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGB8UI),V===i.UNSIGNED_SHORT&&(J=i.RGB16UI),V===i.UNSIGNED_INT&&(J=i.RGB32UI),V===i.BYTE&&(J=i.RGB8I),V===i.SHORT&&(J=i.RGB16I),V===i.INT&&(J=i.RGB32I)),w===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),V===i.UNSIGNED_INT&&(J=i.RGBA32UI),V===i.BYTE&&(J=i.RGBA8I),V===i.SHORT&&(J=i.RGBA16I),V===i.INT&&(J=i.RGBA32I)),w===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),w===i.RGBA){let Se=ie?oa:et.getTransfer(Q);V===i.FLOAT&&(J=i.RGBA32F),V===i.HALF_FLOAT&&(J=i.RGBA16F),V===i.UNSIGNED_BYTE&&(J=Se===ut?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function b(R,w){let V;return R?w===null||w===es||w===Pi?V=i.DEPTH24_STENCIL8:w===dn?V=i.DEPTH32F_STENCIL8:w===yr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===es||w===Pi?V=i.DEPTH_COMPONENT24:w===dn?V=i.DEPTH_COMPONENT32F:w===yr&&(V=i.DEPTH_COMPONENT16),V}function L(R,w){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Qt&&R.minFilter!==Ut?Math.log2(Math.max(w.width,w.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?w.mipmaps.length:1}function T(R){let w=R.target;w.removeEventListener("dispose",T),A(w),w.isVideoTexture&&u.delete(w)}function C(R){let w=R.target;w.removeEventListener("dispose",C),_(w)}function A(R){let w=n.get(R);if(w.__webglInit===void 0)return;let V=R.source,Q=f.get(V);if(Q){let ie=Q[w.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&S(R),Object.keys(Q).length===0&&f.delete(V)}n.remove(R)}function S(R){let w=n.get(R);i.deleteTexture(w.__webglTexture);let V=R.source,Q=f.get(V);delete Q[w.__cacheKey],o.memory.textures--}function _(R){let w=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(w.__webglFramebuffer[Q]))for(let ie=0;ie<w.__webglFramebuffer[Q].length;ie++)i.deleteFramebuffer(w.__webglFramebuffer[Q][ie]);else i.deleteFramebuffer(w.__webglFramebuffer[Q]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[Q])}else{if(Array.isArray(w.__webglFramebuffer))for(let Q=0;Q<w.__webglFramebuffer.length;Q++)i.deleteFramebuffer(w.__webglFramebuffer[Q]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Q=0;Q<w.__webglColorRenderbuffer.length;Q++)w.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[Q]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let V=R.textures;for(let Q=0,ie=V.length;Q<ie;Q++){let J=n.get(V[Q]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(V[Q])}n.remove(R)}let I=0;function F(){I=0}function U(){let R=I;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function O(R){let w=[];return w.push(R.wrapS),w.push(R.wrapT),w.push(R.wrapR||0),w.push(R.magFilter),w.push(R.minFilter),w.push(R.anisotropy),w.push(R.internalFormat),w.push(R.format),w.push(R.type),w.push(R.generateMipmaps),w.push(R.premultiplyAlpha),w.push(R.flipY),w.push(R.unpackAlignment),w.push(R.colorSpace),w.join()}function G(R,w){let V=n.get(R);if(R.isVideoTexture&&Le(R),R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){let Q=R.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(V,R,w);return}}t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+w)}function z(R,w){let V=n.get(R);if(R.version>0&&V.__version!==R.version){$(V,R,w);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+w)}function K(R,w){let V=n.get(R);if(R.version>0&&V.__version!==R.version){$(V,R,w);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+w)}function X(R,w){let V=n.get(R);if(R.version>0&&V.__version!==R.version){re(V,R,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+w)}let ne={[bn]:i.REPEAT,[_n]:i.CLAMP_TO_EDGE,[Pl]:i.MIRRORED_REPEAT},le={[Qt]:i.NEAREST,[pp]:i.NEAREST_MIPMAP_NEAREST,[jr]:i.NEAREST_MIPMAP_LINEAR,[Ut]:i.LINEAR,[Ba]:i.LINEAR_MIPMAP_NEAREST,[Ri]:i.LINEAR_MIPMAP_LINEAR},Me={[yp]:i.NEVER,[wp]:i.ALWAYS,[vp]:i.LESS,[wd]:i.LEQUAL,[_p]:i.EQUAL,[Sp]:i.GEQUAL,[Mp]:i.GREATER,[bp]:i.NOTEQUAL};function Ce(R,w){if(w.type===dn&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Ut||w.magFilter===Ba||w.magFilter===jr||w.magFilter===Ri||w.minFilter===Ut||w.minFilter===Ba||w.minFilter===jr||w.minFilter===Ri)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ne[w.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ne[w.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ne[w.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,le[w.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,le[w.minFilter]),w.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Me[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Qt||w.minFilter!==jr&&w.minFilter!==Ri||w.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function We(R,w){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,w.addEventListener("dispose",T));let Q=w.source,ie=f.get(Q);ie===void 0&&(ie={},f.set(Q,ie));let J=O(w);if(J!==R.__cacheKey){ie[J]===void 0&&(ie[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,V=!0),ie[J].usedTimes++;let Se=ie[R.__cacheKey];Se!==void 0&&(ie[R.__cacheKey].usedTimes--,Se.usedTimes===0&&S(w)),R.__cacheKey=J,R.__webglTexture=ie[J].texture}return V}function $(R,w,V){let Q=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Q=i.TEXTURE_3D);let ie=We(R,w),J=w.source;t.bindTexture(Q,R.__webglTexture,i.TEXTURE0+V);let Se=n.get(J);if(J.version!==Se.__version||ie===!0){t.activeTexture(i.TEXTURE0+V);let ue=et.getPrimaries(et.workingColorSpace),pe=w.colorSpace===Ai?null:et.getPrimaries(w.colorSpace),$e=w.colorSpace===Ai||ue===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$e);let se=x(w.image,!1,s.maxTextureSize);se=dt(w,se);let ve=r.convert(w.format,w.colorSpace),Fe=r.convert(w.type),Be=M(w.internalFormat,ve,Fe,w.colorSpace,w.isVideoTexture);Ce(Q,w);let _e,Qe=w.mipmaps,Ve=w.isVideoTexture!==!0,rt=Se.__version===void 0||ie===!0,N=J.dataReady,he=L(w,se);if(w.isDepthTexture)Be=b(w.format===Li,w.type),rt&&(Ve?t.texStorage2D(i.TEXTURE_2D,1,Be,se.width,se.height):t.texImage2D(i.TEXTURE_2D,0,Be,se.width,se.height,0,ve,Fe,null));else if(w.isDataTexture)if(Qe.length>0){Ve&&rt&&t.texStorage2D(i.TEXTURE_2D,he,Be,Qe[0].width,Qe[0].height);for(let Z=0,ee=Qe.length;Z<ee;Z++)_e=Qe[Z],Ve?N&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,_e.width,_e.height,ve,Fe,_e.data):t.texImage2D(i.TEXTURE_2D,Z,Be,_e.width,_e.height,0,ve,Fe,_e.data);w.generateMipmaps=!1}else Ve?(rt&&t.texStorage2D(i.TEXTURE_2D,he,Be,se.width,se.height),N&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,se.width,se.height,ve,Fe,se.data)):t.texImage2D(i.TEXTURE_2D,0,Be,se.width,se.height,0,ve,Fe,se.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Ve&&rt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,he,Be,Qe[0].width,Qe[0].height,se.depth);for(let Z=0,ee=Qe.length;Z<ee;Z++)if(_e=Qe[Z],w.format!==nn)if(ve!==null)if(Ve){if(N)if(w.layerUpdates.size>0){let ye=Qu(_e.width,_e.height,w.format,w.type);for(let me of w.layerUpdates){let Xe=_e.data.subarray(me*ye/_e.data.BYTES_PER_ELEMENT,(me+1)*ye/_e.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,me,_e.width,_e.height,1,ve,Xe)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,_e.width,_e.height,se.depth,ve,_e.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,Be,_e.width,_e.height,se.depth,0,_e.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ve?N&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,_e.width,_e.height,se.depth,ve,Fe,_e.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Z,Be,_e.width,_e.height,se.depth,0,ve,Fe,_e.data)}else{Ve&&rt&&t.texStorage2D(i.TEXTURE_2D,he,Be,Qe[0].width,Qe[0].height);for(let Z=0,ee=Qe.length;Z<ee;Z++)_e=Qe[Z],w.format!==nn?ve!==null?Ve?N&&t.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,_e.width,_e.height,ve,_e.data):t.compressedTexImage2D(i.TEXTURE_2D,Z,Be,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?N&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,_e.width,_e.height,ve,Fe,_e.data):t.texImage2D(i.TEXTURE_2D,Z,Be,_e.width,_e.height,0,ve,Fe,_e.data)}else if(w.isDataArrayTexture)if(Ve){if(rt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,he,Be,se.width,se.height,se.depth),N)if(w.layerUpdates.size>0){let Z=Qu(se.width,se.height,w.format,w.type);for(let ee of w.layerUpdates){let ye=se.data.subarray(ee*Z/se.data.BYTES_PER_ELEMENT,(ee+1)*Z/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ee,se.width,se.height,1,ve,Fe,ye)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ve,Fe,se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Be,se.width,se.height,se.depth,0,ve,Fe,se.data);else if(w.isData3DTexture)Ve?(rt&&t.texStorage3D(i.TEXTURE_3D,he,Be,se.width,se.height,se.depth),N&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ve,Fe,se.data)):t.texImage3D(i.TEXTURE_3D,0,Be,se.width,se.height,se.depth,0,ve,Fe,se.data);else if(w.isFramebufferTexture){if(rt)if(Ve)t.texStorage2D(i.TEXTURE_2D,he,Be,se.width,se.height);else{let Z=se.width,ee=se.height;for(let ye=0;ye<he;ye++)t.texImage2D(i.TEXTURE_2D,ye,Be,Z,ee,0,ve,Fe,null),Z>>=1,ee>>=1}}else if(Qe.length>0){if(Ve&&rt){let Z=Ie(Qe[0]);t.texStorage2D(i.TEXTURE_2D,he,Be,Z.width,Z.height)}for(let Z=0,ee=Qe.length;Z<ee;Z++)_e=Qe[Z],Ve?N&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,ve,Fe,_e):t.texImage2D(i.TEXTURE_2D,Z,Be,ve,Fe,_e);w.generateMipmaps=!1}else if(Ve){if(rt){let Z=Ie(se);t.texStorage2D(i.TEXTURE_2D,he,Be,Z.width,Z.height)}N&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,Fe,se)}else t.texImage2D(i.TEXTURE_2D,0,Be,ve,Fe,se);g(w)&&m(Q),Se.__version=J.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function re(R,w,V){if(w.image.length!==6)return;let Q=We(R,w),ie=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+V);let J=n.get(ie);if(ie.version!==J.__version||Q===!0){t.activeTexture(i.TEXTURE0+V);let Se=et.getPrimaries(et.workingColorSpace),ue=w.colorSpace===Ai?null:et.getPrimaries(w.colorSpace),pe=w.colorSpace===Ai||Se===ue?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);let $e=w.isCompressedTexture||w.image[0].isCompressedTexture,se=w.image[0]&&w.image[0].isDataTexture,ve=[];for(let ee=0;ee<6;ee++)!$e&&!se?ve[ee]=x(w.image[ee],!0,s.maxCubemapSize):ve[ee]=se?w.image[ee].image:w.image[ee],ve[ee]=dt(w,ve[ee]);let Fe=ve[0],Be=r.convert(w.format,w.colorSpace),_e=r.convert(w.type),Qe=M(w.internalFormat,Be,_e,w.colorSpace),Ve=w.isVideoTexture!==!0,rt=J.__version===void 0||Q===!0,N=ie.dataReady,he=L(w,Fe);Ce(i.TEXTURE_CUBE_MAP,w);let Z;if($e){Ve&&rt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,he,Qe,Fe.width,Fe.height);for(let ee=0;ee<6;ee++){Z=ve[ee].mipmaps;for(let ye=0;ye<Z.length;ye++){let me=Z[ye];w.format!==nn?Be!==null?Ve?N&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye,0,0,me.width,me.height,Be,me.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye,Qe,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ve?N&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye,0,0,me.width,me.height,Be,_e,me.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye,Qe,me.width,me.height,0,Be,_e,me.data)}}}else{if(Z=w.mipmaps,Ve&&rt){Z.length>0&&he++;let ee=Ie(ve[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,he,Qe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(se){Ve?N&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ve[ee].width,ve[ee].height,Be,_e,ve[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Qe,ve[ee].width,ve[ee].height,0,Be,_e,ve[ee].data);for(let ye=0;ye<Z.length;ye++){let Xe=Z[ye].image[ee].image;Ve?N&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye+1,0,0,Xe.width,Xe.height,Be,_e,Xe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye+1,Qe,Xe.width,Xe.height,0,Be,_e,Xe.data)}}else{Ve?N&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Be,_e,ve[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Qe,Be,_e,ve[ee]);for(let ye=0;ye<Z.length;ye++){let me=Z[ye];Ve?N&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye+1,0,0,Be,_e,me.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ye+1,Qe,Be,_e,me.image[ee])}}}g(w)&&m(i.TEXTURE_CUBE_MAP),J.__version=ie.version,w.onUpdate&&w.onUpdate(w)}R.__version=w.version}function be(R,w,V,Q,ie,J){let Se=r.convert(V.format,V.colorSpace),ue=r.convert(V.type),pe=M(V.internalFormat,Se,ue,V.colorSpace),$e=n.get(w),se=n.get(V);if(se.__renderTarget=w,!$e.__hasExternalTextures){let ve=Math.max(1,w.width>>J),Fe=Math.max(1,w.height>>J);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,J,pe,ve,Fe,w.depth,0,Se,ue,null):t.texImage2D(ie,J,pe,ve,Fe,0,Se,ue,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),Ke(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,ie,se.__webglTexture,0,Je(w)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,ie,se.__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ce(R,w,V){if(i.bindRenderbuffer(i.RENDERBUFFER,R),w.depthBuffer){let Q=w.depthTexture,ie=Q&&Q.isDepthTexture?Q.type:null,J=b(w.stencilBuffer,ie),Se=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=Je(w);Ke(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ue,J,w.width,w.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,J,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,J,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Se,i.RENDERBUFFER,R)}else{let Q=w.textures;for(let ie=0;ie<Q.length;ie++){let J=Q[ie],Se=r.convert(J.format,J.colorSpace),ue=r.convert(J.type),pe=M(J.internalFormat,Se,ue,J.colorSpace),$e=Je(w);V&&Ke(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,$e,pe,w.width,w.height):Ke(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$e,pe,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,pe,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ae(R,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Q=n.get(w.depthTexture);Q.__renderTarget=w,(!Q.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),G(w.depthTexture,0);let ie=Q.__webglTexture,J=Je(w);if(w.depthTexture.format===Is)Ke(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0);else if(w.depthTexture.format===Li)Ke(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function Ue(R){let w=n.get(R),V=R.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==R.depthTexture){let Q=R.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Q){let ie=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Q.removeEventListener("dispose",ie)};Q.addEventListener("dispose",ie),w.__depthDisposeCallback=ie}w.__boundDepthTexture=Q}if(R.depthTexture&&!w.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");Ae(w.__webglFramebuffer,R)}else if(V){w.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[Q]),w.__webglDepthbuffer[Q]===void 0)w.__webglDepthbuffer[Q]=i.createRenderbuffer(),ce(w.__webglDepthbuffer[Q],R,!1);else{let ie=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=w.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,J)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),ce(w.__webglDepthbuffer,R,!1);else{let Q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ie)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(R,w,V){let Q=n.get(R);w!==void 0&&be(Q.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Ue(R)}function yt(R){let w=R.texture,V=n.get(R),Q=n.get(w);R.addEventListener("dispose",C);let ie=R.textures,J=R.isWebGLCubeRenderTarget===!0,Se=ie.length>1;if(Se||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=w.version,o.memory.textures++),J){V.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer[ue]=[];for(let pe=0;pe<w.mipmaps.length;pe++)V.__webglFramebuffer[ue][pe]=i.createFramebuffer()}else V.__webglFramebuffer[ue]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer=[];for(let ue=0;ue<w.mipmaps.length;ue++)V.__webglFramebuffer[ue]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Se)for(let ue=0,pe=ie.length;ue<pe;ue++){let $e=n.get(ie[ue]);$e.__webglTexture===void 0&&($e.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Ke(R)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ue=0;ue<ie.length;ue++){let pe=ie[ue];V.__webglColorRenderbuffer[ue]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ue]);let $e=r.convert(pe.format,pe.colorSpace),se=r.convert(pe.type),ve=M(pe.internalFormat,$e,se,pe.colorSpace,R.isXRRenderTarget===!0),Fe=Je(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Fe,ve,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ue,i.RENDERBUFFER,V.__webglColorRenderbuffer[ue])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),ce(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),Ce(i.TEXTURE_CUBE_MAP,w);for(let ue=0;ue<6;ue++)if(w.mipmaps&&w.mipmaps.length>0)for(let pe=0;pe<w.mipmaps.length;pe++)be(V.__webglFramebuffer[ue][pe],R,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,pe);else be(V.__webglFramebuffer[ue],R,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);g(w)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let ue=0,pe=ie.length;ue<pe;ue++){let $e=ie[ue],se=n.get($e);t.bindTexture(i.TEXTURE_2D,se.__webglTexture),Ce(i.TEXTURE_2D,$e),be(V.__webglFramebuffer,R,$e,i.COLOR_ATTACHMENT0+ue,i.TEXTURE_2D,0),g($e)&&m(i.TEXTURE_2D)}t.unbindTexture()}else{let ue=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ue=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ue,Q.__webglTexture),Ce(ue,w),w.mipmaps&&w.mipmaps.length>0)for(let pe=0;pe<w.mipmaps.length;pe++)be(V.__webglFramebuffer[pe],R,w,i.COLOR_ATTACHMENT0,ue,pe);else be(V.__webglFramebuffer,R,w,i.COLOR_ATTACHMENT0,ue,0);g(w)&&m(ue),t.unbindTexture()}R.depthBuffer&&Ue(R)}function je(R){let w=R.textures;for(let V=0,Q=w.length;V<Q;V++){let ie=w[V];if(g(ie)){let J=v(R),Se=n.get(ie).__webglTexture;t.bindTexture(J,Se),m(J),t.unbindTexture()}}}let _t=[],k=[];function Zt(R){if(R.samples>0){if(Ke(R)===!1){let w=R.textures,V=R.width,Q=R.height,ie=i.COLOR_BUFFER_BIT,J=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Se=n.get(R),ue=w.length>1;if(ue)for(let pe=0;pe<w.length;pe++)t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let pe=0;pe<w.length;pe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),ue){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Se.__webglColorRenderbuffer[pe]);let $e=n.get(w[pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$e,0)}i.blitFramebuffer(0,0,V,Q,0,0,V,Q,ie,i.NEAREST),l===!0&&(_t.length=0,k.length=0,_t.push(i.COLOR_ATTACHMENT0+pe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(_t.push(J),k.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,_t))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ue)for(let pe=0;pe<w.length;pe++){t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,Se.__webglColorRenderbuffer[pe]);let $e=n.get(w[pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,$e,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let w=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Je(R){return Math.min(s.maxSamples,R.samples)}function Ke(R){let w=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Le(R){let w=o.render.frame;u.get(R)!==w&&(u.set(R,w),R.update())}function dt(R,w){let V=R.colorSpace,Q=R.format,ie=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==Jn&&V!==Ai&&(et.getTransfer(V)===ut?(Q!==nn||ie!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),w}function Ie(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=F,this.setTexture2D=G,this.setTexture2DArray=z,this.setTexture3D=K,this.setTextureCube=X,this.rebindTextures=He,this.setupRenderTarget=yt,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=Ue,this.setupFrameBufferTexture=be,this.useMultisampledRTT=Ke}function yy(i,e){function t(n,s=Ai){let r,o=et.getTransfer(s);if(n===Vn)return i.UNSIGNED_BYTE;if(n===nh)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ih)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===md)return i.BYTE;if(n===gd)return i.SHORT;if(n===yr)return i.UNSIGNED_SHORT;if(n===th)return i.INT;if(n===es)return i.UNSIGNED_INT;if(n===dn)return i.FLOAT;if(n===It)return i.HALF_FLOAT;if(n===yd)return i.ALPHA;if(n===vd)return i.RGB;if(n===nn)return i.RGBA;if(n===_d)return i.LUMINANCE;if(n===Md)return i.LUMINANCE_ALPHA;if(n===Is)return i.DEPTH_COMPONENT;if(n===Li)return i.DEPTH_STENCIL;if(n===sh)return i.RED;if(n===rh)return i.RED_INTEGER;if(n===bd)return i.RG;if(n===oh)return i.RG_INTEGER;if(n===ah)return i.RGBA_INTEGER;if(n===Eo||n===To||n===Ao||n===Ro)if(o===ut)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ro)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ll||n===Dl||n===Nl||n===Ul)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ll)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Dl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Nl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ul)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ol||n===Fl||n===zl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ol||n===Fl)return o===ut?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===zl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kl||n===Bl||n===Hl||n===Vl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===Zl||n===$l||n===Jl||n===Kl||n===jl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===kl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Bl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Hl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Gl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Wl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ql)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Zl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===$l)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Kl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===jl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Co||n===Ql||n===ec)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Co)return o===ut?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ql)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ec)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Sd||n===tc||n===nc||n===ic)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Co)return r.COMPRESSED_RED_RGTC1_EXT;if(n===tc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===nc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ic)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Pi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var yc=class extends Yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},at=class extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}},vy={type:"move"},pr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),p=.02,y=.005;c.inputState.pinching&&f>p+y?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-y&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(vy)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new at;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},_y=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,My=`
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

}`,vc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new sn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new St({vertexShader:_y,fragmentShader:My,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new fe(new Ct(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},_c=class extends Di{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,f=null,p=null,y=null,x=new vc,g=t.getContextAttributes(),m=null,v=null,M=[],b=[],L=new oe,T=null,C=new Yt;C.viewport=new mt;let A=new Yt;A.viewport=new mt;let S=[C,A],_=new yc,I=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let re=M[$];return re===void 0&&(re=new pr,M[$]=re),re.getTargetRaySpace()},this.getControllerGrip=function($){let re=M[$];return re===void 0&&(re=new pr,M[$]=re),re.getGripSpace()},this.getHand=function($){let re=M[$];return re===void 0&&(re=new pr,M[$]=re),re.getHandSpace()};function U($){let re=b.indexOf($.inputSource);if(re===-1)return;let be=M[re];be!==void 0&&(be.update($.inputSource,$.frame,c||o),be.dispatchEvent({type:$.type,data:$.inputSource}))}function O(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",G);for(let $=0;$<M.length;$++){let re=b[$];re!==null&&(b[$]=null,M[$].disconnect(re))}I=null,F=null,x.reset(),e.setRenderTarget(m),p=null,f=null,d=null,s=null,v=null,We.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(m=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",O),s.addEventListener("inputsourceschange",G),g.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(L),s.renderState.layers===void 0){let re={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,re),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new Dt(p.framebufferWidth,p.framebufferHeight,{format:nn,type:Vn,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let re=null,be=null,ce=null;g.depth&&(ce=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=g.stencil?Li:Is,be=g.stencil?Pi:es);let Ae={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};d=new XRWebGLBinding(s,t),f=d.createProjectionLayer(Ae),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new Dt(f.textureWidth,f.textureHeight,{format:nn,type:Vn,depthTexture:new ks(f.textureWidth,f.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),We.setContext(s),We.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function G($){for(let re=0;re<$.removed.length;re++){let be=$.removed[re],ce=b.indexOf(be);ce>=0&&(b[ce]=null,M[ce].disconnect(be))}for(let re=0;re<$.added.length;re++){let be=$.added[re],ce=b.indexOf(be);if(ce===-1){for(let Ue=0;Ue<M.length;Ue++)if(Ue>=b.length){b.push(be),ce=Ue;break}else if(b[Ue]===null){b[Ue]=be,ce=Ue;break}if(ce===-1)break}let Ae=M[ce];Ae&&Ae.connect(be)}}let z=new P,K=new P;function X($,re,be){z.setFromMatrixPosition(re.matrixWorld),K.setFromMatrixPosition(be.matrixWorld);let ce=z.distanceTo(K),Ae=re.projectionMatrix.elements,Ue=be.projectionMatrix.elements,He=Ae[14]/(Ae[10]-1),yt=Ae[14]/(Ae[10]+1),je=(Ae[9]+1)/Ae[5],_t=(Ae[9]-1)/Ae[5],k=(Ae[8]-1)/Ae[0],Zt=(Ue[8]+1)/Ue[0],Je=He*k,Ke=He*Zt,Le=ce/(-k+Zt),dt=Le*-k;if(re.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(dt),$.translateZ(Le),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ae[10]===-1)$.projectionMatrix.copy(re.projectionMatrix),$.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{let Ie=He+Le,R=yt+Le,w=Je-dt,V=Ke+(ce-dt),Q=je*yt/R*Ie,ie=_t*yt/R*Ie;$.projectionMatrix.makePerspective(w,V,Q,ie,Ie,R),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ne($,re){re===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(re.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let re=$.near,be=$.far;x.texture!==null&&(x.depthNear>0&&(re=x.depthNear),x.depthFar>0&&(be=x.depthFar)),_.near=A.near=C.near=re,_.far=A.far=C.far=be,(I!==_.near||F!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),I=_.near,F=_.far),C.layers.mask=$.layers.mask|2,A.layers.mask=$.layers.mask|4,_.layers.mask=C.layers.mask|A.layers.mask;let ce=$.parent,Ae=_.cameras;ne(_,ce);for(let Ue=0;Ue<Ae.length;Ue++)ne(Ae[Ue],ce);Ae.length===2?X(_,C,A):_.projectionMatrix.copy(C.projectionMatrix),le($,_,ce)};function le($,re,be){be===null?$.matrix.copy(re.matrixWorld):($.matrix.copy(be.matrixWorld),$.matrix.invert(),$.matrix.multiply(re.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(re.projectionMatrix),$.projectionMatrixInverse.copy(re.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Lo*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(_)};let Me=null;function Ce($,re){if(u=re.getViewerPose(c||o),y=re,u!==null){let be=u.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let ce=!1;be.length!==_.cameras.length&&(_.cameras.length=0,ce=!0);for(let Ue=0;Ue<be.length;Ue++){let He=be[Ue],yt=null;if(p!==null)yt=p.getViewport(He);else{let _t=d.getViewSubImage(f,He);yt=_t.viewport,Ue===0&&(e.setRenderTargetTextures(v,_t.colorTexture,f.ignoreDepthValues?void 0:_t.depthStencilTexture),e.setRenderTarget(v))}let je=S[Ue];je===void 0&&(je=new Yt,je.layers.enable(Ue),je.viewport=new mt,S[Ue]=je),je.matrix.fromArray(He.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(He.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(yt.x,yt.y,yt.width,yt.height),Ue===0&&(_.matrix.copy(je.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ce===!0&&_.cameras.push(je)}let Ae=s.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){let Ue=d.getDepthInformation(be[0]);Ue&&Ue.isValid&&Ue.texture&&x.init(e,Ue,s.renderState)}}for(let be=0;be<M.length;be++){let ce=b[be],Ae=M[be];ce!==null&&Ae!==void 0&&Ae.update(ce,re,c||o)}Me&&Me($,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),y=null}let We=new Rd;We.setAnimationLoop(Ce),this.setAnimationLoop=function($){Me=$},this.dispose=function(){}}},Ji=new Gt,by=new ze;function Sy(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Ad(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,v,M,b){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),d(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&p(g,m,b)):m.isMeshMatcapMaterial?(r(g,m),y(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,v,M):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===jt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===jt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let v=e.get(m),M=v.envMap,b=v.envMapRotation;M&&(g.envMap.value=M,Ji.copy(b),Ji.x*=-1,Ji.y*=-1,Ji.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ji.y*=-1,Ji.z*=-1),g.envMapRotation.value.setFromMatrix4(by.makeRotationFromEuler(Ji)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,v,M){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*v,g.scale.value=M*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function p(g,m,v){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===jt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function y(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let v=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function wy(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){let b=M.program;n.uniformBlockBinding(v,b)}function c(v,M){let b=s[v.id];b===void 0&&(y(v),b=u(v),s[v.id]=b,v.addEventListener("dispose",g));let L=M.program;n.updateUBOMapping(v,L);let T=e.render.frame;r[v.id]!==T&&(f(v),r[v.id]=T)}function u(v){let M=d();v.__bindingPointIndex=M;let b=i.createBuffer(),L=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,L,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){let M=s[v.id],b=v.uniforms,L=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,C=b.length;T<C;T++){let A=Array.isArray(b[T])?b[T]:[b[T]];for(let S=0,_=A.length;S<_;S++){let I=A[S];if(p(I,T,S,L)===!0){let F=I.__offset,U=Array.isArray(I.value)?I.value:[I.value],O=0;for(let G=0;G<U.length;G++){let z=U[G],K=x(z);typeof z=="number"||typeof z=="boolean"?(I.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,F+O,I.__data)):z.isMatrix3?(I.__data[0]=z.elements[0],I.__data[1]=z.elements[1],I.__data[2]=z.elements[2],I.__data[3]=0,I.__data[4]=z.elements[3],I.__data[5]=z.elements[4],I.__data[6]=z.elements[5],I.__data[7]=0,I.__data[8]=z.elements[6],I.__data[9]=z.elements[7],I.__data[10]=z.elements[8],I.__data[11]=0):(z.toArray(I.__data,O),O+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,M,b,L){let T=v.value,C=M+"_"+b;if(L[C]===void 0)return typeof T=="number"||typeof T=="boolean"?L[C]=T:L[C]=T.clone(),!0;{let A=L[C];if(typeof T=="number"||typeof T=="boolean"){if(A!==T)return L[C]=T,!0}else if(A.equals(T)===!1)return A.copy(T),!0}return!1}function y(v){let M=v.uniforms,b=0,L=16;for(let C=0,A=M.length;C<A;C++){let S=Array.isArray(M[C])?M[C]:[M[C]];for(let _=0,I=S.length;_<I;_++){let F=S[_],U=Array.isArray(F.value)?F.value:[F.value];for(let O=0,G=U.length;O<G;O++){let z=U[O],K=x(z),X=b%L,ne=X%K.boundary,le=X+ne;b+=ne,le!==0&&L-le<K.storage&&(b+=L-le),F.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=b,b+=K.storage}}}let T=b%L;return T>0&&(b+=L-T),v.__size=b,v.__cache={},this}function x(v){let M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function g(v){let M=v.target;M.removeEventListener("dispose",g);let b=o.indexOf(M.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function m(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}var ko=class{constructor(e={}){let{canvas:t=Tp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let y=new Uint32Array(4),x=new Int32Array(4),g=null,m=null,v=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=qt,this.toneMapping=Ci,this.toneMappingExposure=1;let b=this,L=!1,T=0,C=0,A=null,S=-1,_=null,I=new mt,F=new mt,U=null,O=new xe(0),G=0,z=t.width,K=t.height,X=1,ne=null,le=null,Me=new mt(0,0,z,K),Ce=new mt(0,0,z,K),We=!1,$=new br,re=!1,be=!1,ce=new ze,Ae=new ze,Ue=new P,He=new mt,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},je=!1;function _t(){return A===null?X:1}let k=n;function Zt(E,B){return t.getContext(E,B)}try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Yc}`),t.addEventListener("webglcontextlost",ee,!1),t.addEventListener("webglcontextrestored",ye,!1),t.addEventListener("webglcontextcreationerror",me,!1),k===null){let B="webgl2";if(k=Zt(B,E),k===null)throw Zt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Je,Ke,Le,dt,Ie,R,w,V,Q,ie,J,Se,ue,pe,$e,se,ve,Fe,Be,_e,Qe,Ve,rt,N;function he(){Je=new Bg(k),Je.init(),Ve=new yy(k,Je),Ke=new Ng(k,Je,e,Ve),Le=new my(k,Je),Ke.reverseDepthBuffer&&f&&Le.buffers.depth.setReversed(!0),dt=new Gg(k),Ie=new ny,R=new xy(k,Je,Le,Ie,Ke,Ve,dt),w=new Og(b),V=new kg(b),Q=new Jp(k),rt=new Lg(k,Q),ie=new Hg(k,Q,dt,rt),J=new Xg(k,ie,Q,dt),Be=new Wg(k,Ke,R),se=new Ug(Ie),Se=new ty(b,w,V,Je,Ke,rt,se),ue=new Sy(b,Ie),pe=new sy,$e=new hy(Je),Fe=new Pg(b,w,V,Le,J,p,l),ve=new fy(b,J,Ke),N=new wy(k,dt,Ke,Le),_e=new Dg(k,Je,dt),Qe=new Vg(k,Je,dt),dt.programs=Se.programs,b.capabilities=Ke,b.extensions=Je,b.properties=Ie,b.renderLists=pe,b.shadowMap=ve,b.state=Le,b.info=dt}he();let Z=new _c(b,k);this.xr=Z,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){let E=Je.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Je.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(E){E!==void 0&&(X=E,this.setSize(z,K,!1))},this.getSize=function(E){return E.set(z,K)},this.setSize=function(E,B,q=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=E,K=B,t.width=Math.floor(E*X),t.height=Math.floor(B*X),q===!0&&(t.style.width=E+"px",t.style.height=B+"px"),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(z*X,K*X).floor()},this.setDrawingBufferSize=function(E,B,q){z=E,K=B,X=q,t.width=Math.floor(E*q),t.height=Math.floor(B*q),this.setViewport(0,0,E,B)},this.getCurrentViewport=function(E){return E.copy(I)},this.getViewport=function(E){return E.copy(Me)},this.setViewport=function(E,B,q,Y){E.isVector4?Me.set(E.x,E.y,E.z,E.w):Me.set(E,B,q,Y),Le.viewport(I.copy(Me).multiplyScalar(X).round())},this.getScissor=function(E){return E.copy(Ce)},this.setScissor=function(E,B,q,Y){E.isVector4?Ce.set(E.x,E.y,E.z,E.w):Ce.set(E,B,q,Y),Le.scissor(F.copy(Ce).multiplyScalar(X).round())},this.getScissorTest=function(){return We},this.setScissorTest=function(E){Le.setScissorTest(We=E)},this.setOpaqueSort=function(E){ne=E},this.setTransparentSort=function(E){le=E},this.getClearColor=function(E){return E.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor.apply(Fe,arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha.apply(Fe,arguments)},this.clear=function(E=!0,B=!0,q=!0){let Y=0;if(E){let H=!1;if(A!==null){let ae=A.texture.format;H=ae===ah||ae===oh||ae===rh}if(H){let ae=A.texture.type,ge=ae===Vn||ae===es||ae===yr||ae===Pi||ae===nh||ae===ih,we=Fe.getClearColor(),Ee=Fe.getClearAlpha(),Ge=we.r,qe=we.g,Te=we.b;ge?(y[0]=Ge,y[1]=qe,y[2]=Te,y[3]=Ee,k.clearBufferuiv(k.COLOR,0,y)):(x[0]=Ge,x[1]=qe,x[2]=Te,x[3]=Ee,k.clearBufferiv(k.COLOR,0,x))}else Y|=k.COLOR_BUFFER_BIT}B&&(Y|=k.DEPTH_BUFFER_BIT),q&&(Y|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ee,!1),t.removeEventListener("webglcontextrestored",ye,!1),t.removeEventListener("webglcontextcreationerror",me,!1),pe.dispose(),$e.dispose(),Ie.dispose(),w.dispose(),V.dispose(),J.dispose(),rt.dispose(),N.dispose(),Se.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",Xh),Z.removeEventListener("sessionend",qh),Wi.stop()};function ee(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function ye(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;let E=dt.autoReset,B=ve.enabled,q=ve.autoUpdate,Y=ve.needsUpdate,H=ve.type;he(),dt.autoReset=E,ve.enabled=B,ve.autoUpdate=q,ve.needsUpdate=Y,ve.type=H}function me(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Xe(E){let B=E.target;B.removeEventListener("dispose",Xe),Tt(B)}function Tt(E){$t(E),Ie.remove(E)}function $t(E){let B=Ie.get(E).programs;B!==void 0&&(B.forEach(function(q){Se.releaseProgram(q)}),E.isShaderMaterial&&Se.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,q,Y,H,ae){B===null&&(B=yt);let ge=H.isMesh&&H.matrixWorld.determinant()<0,we=Wf(E,B,q,Y,H);Le.setMaterial(Y,ge);let Ee=q.index,Ge=1;if(Y.wireframe===!0){if(Ee=ie.getWireframeAttribute(q),Ee===void 0)return;Ge=2}let qe=q.drawRange,Te=q.attributes.position,ot=qe.start*Ge,vt=(qe.start+qe.count)*Ge;ae!==null&&(ot=Math.max(ot,ae.start*Ge),vt=Math.min(vt,(ae.start+ae.count)*Ge)),Ee!==null?(ot=Math.max(ot,0),vt=Math.min(vt,Ee.count)):Te!=null&&(ot=Math.max(ot,0),vt=Math.min(vt,Te.count));let Mt=vt-ot;if(Mt<0||Mt===1/0)return;rt.setup(H,Y,we,q,Ee);let hn,ct=_e;if(Ee!==null&&(hn=Q.get(Ee),ct=Qe,ct.setIndex(hn)),H.isMesh)Y.wireframe===!0?(Le.setLineWidth(Y.wireframeLinewidth*_t()),ct.setMode(k.LINES)):ct.setMode(k.TRIANGLES);else if(H.isLine){let Re=Y.linewidth;Re===void 0&&(Re=1),Le.setLineWidth(Re*_t()),H.isLineSegments?ct.setMode(k.LINES):H.isLineLoop?ct.setMode(k.LINE_LOOP):ct.setMode(k.LINE_STRIP)}else H.isPoints?ct.setMode(k.POINTS):H.isSprite&&ct.setMode(k.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)ct.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Je.get("WEBGL_multi_draw"))ct.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Re=H._multiDrawStarts,ri=H._multiDrawCounts,ht=H._multiDrawCount,Fn=Ee?Q.get(Ee).bytesPerElement:1,ds=Ie.get(Y).currentProgram.getUniforms();for(let gn=0;gn<ht;gn++)ds.setValue(k,"_gl_DrawID",gn),ct.render(Re[gn]/Fn,ri[gn])}else if(H.isInstancedMesh)ct.renderInstances(ot,Mt,H.count);else if(q.isInstancedBufferGeometry){let Re=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,ri=Math.min(q.instanceCount,Re);ct.renderInstances(ot,Mt,ri)}else ct.render(ot,Mt)};function ft(E,B,q){E.transparent===!0&&E.side===Ht&&E.forceSinglePass===!1?(E.side=jt,E.needsUpdate=!0,Kr(E,B,q),E.side=Ii,E.needsUpdate=!0,Kr(E,B,q),E.side=Ht):Kr(E,B,q)}this.compile=function(E,B,q=null){q===null&&(q=E),m=$e.get(q),m.init(B),M.push(m),q.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),E!==q&&E.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights();let Y=new Set;return E.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let ae=H.material;if(ae)if(Array.isArray(ae))for(let ge=0;ge<ae.length;ge++){let we=ae[ge];ft(we,q,H),Y.add(we)}else ft(ae,q,H),Y.add(ae)}),M.pop(),m=null,Y},this.compileAsync=function(E,B,q=null){let Y=this.compile(E,B,q);return new Promise(H=>{function ae(){if(Y.forEach(function(ge){Ie.get(ge).currentProgram.isReady()&&Y.delete(ge)}),Y.size===0){H(E);return}setTimeout(ae,10)}Je.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let On=null;function si(E){On&&On(E)}function Xh(){Wi.stop()}function qh(){Wi.start()}let Wi=new Rd;Wi.setAnimationLoop(si),typeof self<"u"&&Wi.setContext(self),this.setAnimationLoop=function(E){On=E,Z.setAnimationLoop(E),E===null?Wi.stop():Wi.start()},Z.addEventListener("sessionstart",Xh),Z.addEventListener("sessionend",qh),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(B),B=Z.getCamera()),E.isScene===!0&&E.onBeforeRender(b,E,B,A),m=$e.get(E,M.length),m.init(B),M.push(m),Ae.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),$.setFromProjectionMatrix(Ae),be=this.localClippingEnabled,re=se.init(this.clippingPlanes,be),g=pe.get(E,v.length),g.init(),v.push(g),Z.enabled===!0&&Z.isPresenting===!0){let ae=b.xr.getDepthSensingMesh();ae!==null&&ka(ae,B,-1/0,b.sortObjects)}ka(E,B,0,b.sortObjects),g.finish(),b.sortObjects===!0&&g.sort(ne,le),je=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,je&&Fe.addToRenderList(g,E),this.info.render.frame++,re===!0&&se.beginShadows();let q=m.state.shadowsArray;ve.render(q,E,B),re===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=g.opaque,H=g.transmissive;if(m.setupLights(),B.isArrayCamera){let ae=B.cameras;if(H.length>0)for(let ge=0,we=ae.length;ge<we;ge++){let Ee=ae[ge];Zh(Y,H,E,Ee)}je&&Fe.render(E);for(let ge=0,we=ae.length;ge<we;ge++){let Ee=ae[ge];Yh(g,E,Ee,Ee.viewport)}}else H.length>0&&Zh(Y,H,E,B),je&&Fe.render(E),Yh(g,E,B);A!==null&&(R.updateMultisampleRenderTarget(A),R.updateRenderTargetMipmap(A)),E.isScene===!0&&E.onAfterRender(b,E,B),rt.resetDefaultState(),S=-1,_=null,M.pop(),M.length>0?(m=M[M.length-1],re===!0&&se.setGlobalState(b.clippingPlanes,m.state.camera)):m=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function ka(E,B,q,Y){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)q=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLight)m.pushLight(E),E.castShadow&&m.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||$.intersectsSprite(E)){Y&&He.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ae);let ge=J.update(E),we=E.material;we.visible&&g.push(E,ge,we,q,He.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||$.intersectsObject(E))){let ge=J.update(E),we=E.material;if(Y&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),He.copy(E.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),He.copy(ge.boundingSphere.center)),He.applyMatrix4(E.matrixWorld).applyMatrix4(Ae)),Array.isArray(we)){let Ee=ge.groups;for(let Ge=0,qe=Ee.length;Ge<qe;Ge++){let Te=Ee[Ge],ot=we[Te.materialIndex];ot&&ot.visible&&g.push(E,ge,ot,q,He.z,Te)}}else we.visible&&g.push(E,ge,we,q,He.z,null)}}let ae=E.children;for(let ge=0,we=ae.length;ge<we;ge++)ka(ae[ge],B,q,Y)}function Yh(E,B,q,Y){let H=E.opaque,ae=E.transmissive,ge=E.transparent;m.setupLightsView(q),re===!0&&se.setGlobalState(b.clippingPlanes,q),Y&&Le.viewport(I.copy(Y)),H.length>0&&Jr(H,B,q),ae.length>0&&Jr(ae,B,q),ge.length>0&&Jr(ge,B,q),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function Zh(E,B,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[Y.id]===void 0&&(m.state.transmissionRenderTarget[Y.id]=new Dt(1,1,{generateMipmaps:!0,type:Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float")?It:Vn,minFilter:Ri,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace}));let ae=m.state.transmissionRenderTarget[Y.id],ge=Y.viewport||I;ae.setSize(ge.z,ge.w);let we=b.getRenderTarget();b.setRenderTarget(ae),b.getClearColor(O),G=b.getClearAlpha(),G<1&&b.setClearColor(16777215,.5),b.clear(),je&&Fe.render(q);let Ee=b.toneMapping;b.toneMapping=Ci;let Ge=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),m.setupLightsView(Y),re===!0&&se.setGlobalState(b.clippingPlanes,Y),Jr(E,q,Y),R.updateMultisampleRenderTarget(ae),R.updateRenderTargetMipmap(ae),Je.has("WEBGL_multisampled_render_to_texture")===!1){let qe=!1;for(let Te=0,ot=B.length;Te<ot;Te++){let vt=B[Te],Mt=vt.object,hn=vt.geometry,ct=vt.material,Re=vt.group;if(ct.side===Ht&&Mt.layers.test(Y.layers)){let ri=ct.side;ct.side=jt,ct.needsUpdate=!0,$h(Mt,q,Y,hn,ct,Re),ct.side=ri,ct.needsUpdate=!0,qe=!0}}qe===!0&&(R.updateMultisampleRenderTarget(ae),R.updateRenderTargetMipmap(ae))}b.setRenderTarget(we),b.setClearColor(O,G),Ge!==void 0&&(Y.viewport=Ge),b.toneMapping=Ee}function Jr(E,B,q){let Y=B.isScene===!0?B.overrideMaterial:null;for(let H=0,ae=E.length;H<ae;H++){let ge=E[H],we=ge.object,Ee=ge.geometry,Ge=Y===null?ge.material:Y,qe=ge.group;we.layers.test(q.layers)&&$h(we,B,q,Ee,Ge,qe)}}function $h(E,B,q,Y,H,ae){E.onBeforeRender(b,B,q,Y,H,ae),E.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.onBeforeRender(b,B,q,Y,E,ae),H.transparent===!0&&H.side===Ht&&H.forceSinglePass===!1?(H.side=jt,H.needsUpdate=!0,b.renderBufferDirect(q,B,Y,H,E,ae),H.side=Ii,H.needsUpdate=!0,b.renderBufferDirect(q,B,Y,H,E,ae),H.side=Ht):b.renderBufferDirect(q,B,Y,H,E,ae),E.onAfterRender(b,B,q,Y,H,ae)}function Kr(E,B,q){B.isScene!==!0&&(B=yt);let Y=Ie.get(E),H=m.state.lights,ae=m.state.shadowsArray,ge=H.state.version,we=Se.getParameters(E,H.state,ae,B,q),Ee=Se.getProgramCacheKey(we),Ge=Y.programs;Y.environment=E.isMeshStandardMaterial?B.environment:null,Y.fog=B.fog,Y.envMap=(E.isMeshStandardMaterial?V:w).get(E.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&E.envMap===null?B.environmentRotation:E.envMapRotation,Ge===void 0&&(E.addEventListener("dispose",Xe),Ge=new Map,Y.programs=Ge);let qe=Ge.get(Ee);if(qe!==void 0){if(Y.currentProgram===qe&&Y.lightsStateVersion===ge)return Kh(E,we),qe}else we.uniforms=Se.getUniforms(E),E.onBeforeCompile(we,b),qe=Se.acquireProgram(we,Ee),Ge.set(Ee,qe),Y.uniforms=we.uniforms;let Te=Y.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Te.clippingPlanes=se.uniform),Kh(E,we),Y.needsLights=qf(E),Y.lightsStateVersion=ge,Y.needsLights&&(Te.ambientLightColor.value=H.state.ambient,Te.lightProbe.value=H.state.probe,Te.directionalLights.value=H.state.directional,Te.directionalLightShadows.value=H.state.directionalShadow,Te.spotLights.value=H.state.spot,Te.spotLightShadows.value=H.state.spotShadow,Te.rectAreaLights.value=H.state.rectArea,Te.ltc_1.value=H.state.rectAreaLTC1,Te.ltc_2.value=H.state.rectAreaLTC2,Te.pointLights.value=H.state.point,Te.pointLightShadows.value=H.state.pointShadow,Te.hemisphereLights.value=H.state.hemi,Te.directionalShadowMap.value=H.state.directionalShadowMap,Te.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Te.spotShadowMap.value=H.state.spotShadowMap,Te.spotLightMatrix.value=H.state.spotLightMatrix,Te.spotLightMap.value=H.state.spotLightMap,Te.pointShadowMap.value=H.state.pointShadowMap,Te.pointShadowMatrix.value=H.state.pointShadowMatrix),Y.currentProgram=qe,Y.uniformsList=null,qe}function Jh(E){if(E.uniformsList===null){let B=E.currentProgram.getUniforms();E.uniformsList=Ls.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function Kh(E,B){let q=Ie.get(E);q.outputColorSpace=B.outputColorSpace,q.batching=B.batching,q.batchingColor=B.batchingColor,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.instancingMorph=B.instancingMorph,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function Wf(E,B,q,Y,H){B.isScene!==!0&&(B=yt),R.resetTextureUnits();let ae=B.fog,ge=Y.isMeshStandardMaterial?B.environment:null,we=A===null?b.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Jn,Ee=(Y.isMeshStandardMaterial?V:w).get(Y.envMap||ge),Ge=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,qe=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Te=!!q.morphAttributes.position,ot=!!q.morphAttributes.normal,vt=!!q.morphAttributes.color,Mt=Ci;Y.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Mt=b.toneMapping);let hn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ct=hn!==void 0?hn.length:0,Re=Ie.get(Y),ri=m.state.lights;if(re===!0&&(be===!0||E!==_)){let In=E===_&&Y.id===S;se.setState(Y,E,In)}let ht=!1;Y.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==ri.state.version||Re.outputColorSpace!==we||H.isBatchedMesh&&Re.batching===!1||!H.isBatchedMesh&&Re.batching===!0||H.isBatchedMesh&&Re.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Re.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Re.instancing===!1||!H.isInstancedMesh&&Re.instancing===!0||H.isSkinnedMesh&&Re.skinning===!1||!H.isSkinnedMesh&&Re.skinning===!0||H.isInstancedMesh&&Re.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Re.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Re.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Re.instancingMorph===!1&&H.morphTexture!==null||Re.envMap!==Ee||Y.fog===!0&&Re.fog!==ae||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==se.numPlanes||Re.numIntersection!==se.numIntersection)||Re.vertexAlphas!==Ge||Re.vertexTangents!==qe||Re.morphTargets!==Te||Re.morphNormals!==ot||Re.morphColors!==vt||Re.toneMapping!==Mt||Re.morphTargetsCount!==ct)&&(ht=!0):(ht=!0,Re.__version=Y.version);let Fn=Re.currentProgram;ht===!0&&(Fn=Kr(Y,B,H));let ds=!1,gn=!1,nr=!1,bt=Fn.getUniforms(),Xn=Re.uniforms;if(Le.useProgram(Fn.program)&&(ds=!0,gn=!0,nr=!0),Y.id!==S&&(S=Y.id,gn=!0),ds||_!==E){Le.buffers.depth.getReversed()?(ce.copy(E.projectionMatrix),Rp(ce),Cp(ce),bt.setValue(k,"projectionMatrix",ce)):bt.setValue(k,"projectionMatrix",E.projectionMatrix),bt.setValue(k,"viewMatrix",E.matrixWorldInverse);let vi=bt.map.cameraPosition;vi!==void 0&&vi.setValue(k,Ue.setFromMatrixPosition(E.matrixWorld)),Ke.logarithmicDepthBuffer&&bt.setValue(k,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&bt.setValue(k,"isOrthographic",E.isOrthographicCamera===!0),_!==E&&(_=E,gn=!0,nr=!0)}if(H.isSkinnedMesh){bt.setOptional(k,H,"bindMatrix"),bt.setOptional(k,H,"bindMatrixInverse");let In=H.skeleton;In&&(In.boneTexture===null&&In.computeBoneTexture(),bt.setValue(k,"boneTexture",In.boneTexture,R))}H.isBatchedMesh&&(bt.setOptional(k,H,"batchingTexture"),bt.setValue(k,"batchingTexture",H._matricesTexture,R),bt.setOptional(k,H,"batchingIdTexture"),bt.setValue(k,"batchingIdTexture",H._indirectTexture,R),bt.setOptional(k,H,"batchingColorTexture"),H._colorsTexture!==null&&bt.setValue(k,"batchingColorTexture",H._colorsTexture,R));let ir=q.morphAttributes;if((ir.position!==void 0||ir.normal!==void 0||ir.color!==void 0)&&Be.update(H,q,Fn),(gn||Re.receiveShadow!==H.receiveShadow)&&(Re.receiveShadow=H.receiveShadow,bt.setValue(k,"receiveShadow",H.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Xn.envMap.value=Ee,Xn.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&B.environment!==null&&(Xn.envMapIntensity.value=B.environmentIntensity),gn&&(bt.setValue(k,"toneMappingExposure",b.toneMappingExposure),Re.needsLights&&Xf(Xn,nr),ae&&Y.fog===!0&&ue.refreshFogUniforms(Xn,ae),ue.refreshMaterialUniforms(Xn,Y,X,K,m.state.transmissionRenderTarget[E.id]),Ls.upload(k,Jh(Re),Xn,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Ls.upload(k,Jh(Re),Xn,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&bt.setValue(k,"center",H.center),bt.setValue(k,"modelViewMatrix",H.modelViewMatrix),bt.setValue(k,"normalMatrix",H.normalMatrix),bt.setValue(k,"modelMatrix",H.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let In=Y.uniformsGroups;for(let vi=0,_i=In.length;vi<_i;vi++){let jh=In[vi];N.update(jh,Fn),N.bind(jh,Fn)}}return Fn}function Xf(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function qf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(E,B,q){Ie.get(E.texture).__webglTexture=B,Ie.get(E.depthTexture).__webglTexture=q;let Y=Ie.get(E);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||Je.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,B){let q=Ie.get(E);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,q=0){A=E,T=B,C=q;let Y=!0,H=null,ae=!1,ge=!1;if(E){let Ee=Ie.get(E);if(Ee.__useDefaultFramebuffer!==void 0)Le.bindFramebuffer(k.FRAMEBUFFER,null),Y=!1;else if(Ee.__webglFramebuffer===void 0)R.setupRenderTarget(E);else if(Ee.__hasExternalTextures)R.rebindTextures(E,Ie.get(E.texture).__webglTexture,Ie.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Te=E.depthTexture;if(Ee.__boundDepthTexture!==Te){if(Te!==null&&Ie.has(Te)&&(E.width!==Te.image.width||E.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(E)}}let Ge=E.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(ge=!0);let qe=Ie.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(qe[B])?H=qe[B][q]:H=qe[B],ae=!0):E.samples>0&&R.useMultisampledRTT(E)===!1?H=Ie.get(E).__webglMultisampledFramebuffer:Array.isArray(qe)?H=qe[q]:H=qe,I.copy(E.viewport),F.copy(E.scissor),U=E.scissorTest}else I.copy(Me).multiplyScalar(X).floor(),F.copy(Ce).multiplyScalar(X).floor(),U=We;if(Le.bindFramebuffer(k.FRAMEBUFFER,H)&&Y&&Le.drawBuffers(E,H),Le.viewport(I),Le.scissor(F),Le.setScissorTest(U),ae){let Ee=Ie.get(E.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ee.__webglTexture,q)}else if(ge){let Ee=Ie.get(E.texture),Ge=B||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ee.__webglTexture,q||0,Ge)}S=-1},this.readRenderTargetPixels=function(E,B,q,Y,H,ae,ge){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Ie.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ge!==void 0&&(we=we[ge]),we){Le.bindFramebuffer(k.FRAMEBUFFER,we);try{let Ee=E.texture,Ge=Ee.format,qe=Ee.type;if(!Ke.textureFormatReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ke.textureTypeReadable(qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-Y&&q>=0&&q<=E.height-H&&k.readPixels(B,q,Y,H,Ve.convert(Ge),Ve.convert(qe),ae)}finally{let Ee=A!==null?Ie.get(A).__webglFramebuffer:null;Le.bindFramebuffer(k.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(E,B,q,Y,H,ae,ge){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=Ie.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ge!==void 0&&(we=we[ge]),we){let Ee=E.texture,Ge=Ee.format,qe=Ee.type;if(!Ke.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ke.textureTypeReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=E.width-Y&&q>=0&&q<=E.height-H){Le.bindFramebuffer(k.FRAMEBUFFER,we);let Te=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Te),k.bufferData(k.PIXEL_PACK_BUFFER,ae.byteLength,k.STREAM_READ),k.readPixels(B,q,Y,H,Ve.convert(Ge),Ve.convert(qe),0);let ot=A!==null?Ie.get(A).__webglFramebuffer:null;Le.bindFramebuffer(k.FRAMEBUFFER,ot);let vt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Ap(k,vt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Te),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,ae),k.deleteBuffer(Te),k.deleteSync(vt),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,B=null,q=0){E.isTexture!==!0&&(dr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1]);let Y=Math.pow(2,-q),H=Math.floor(E.image.width*Y),ae=Math.floor(E.image.height*Y),ge=B!==null?B.x:0,we=B!==null?B.y:0;R.setTexture2D(E,0),k.copyTexSubImage2D(k.TEXTURE_2D,q,0,0,ge,we,H,ae),Le.unbindTexture()},this.copyTextureToTexture=function(E,B,q=null,Y=null,H=0){E.isTexture!==!0&&(dr("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,E=arguments[1],B=arguments[2],H=arguments[3]||0,q=null);let ae,ge,we,Ee,Ge,qe,Te,ot,vt,Mt=E.isCompressedTexture?E.mipmaps[H]:E.image;q!==null?(ae=q.max.x-q.min.x,ge=q.max.y-q.min.y,we=q.isBox3?q.max.z-q.min.z:1,Ee=q.min.x,Ge=q.min.y,qe=q.isBox3?q.min.z:0):(ae=Mt.width,ge=Mt.height,we=Mt.depth||1,Ee=0,Ge=0,qe=0),Y!==null?(Te=Y.x,ot=Y.y,vt=Y.z):(Te=0,ot=0,vt=0);let hn=Ve.convert(B.format),ct=Ve.convert(B.type),Re;B.isData3DTexture?(R.setTexture3D(B,0),Re=k.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(R.setTexture2DArray(B,0),Re=k.TEXTURE_2D_ARRAY):(R.setTexture2D(B,0),Re=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,B.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,B.unpackAlignment);let ri=k.getParameter(k.UNPACK_ROW_LENGTH),ht=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Fn=k.getParameter(k.UNPACK_SKIP_PIXELS),ds=k.getParameter(k.UNPACK_SKIP_ROWS),gn=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,Mt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Mt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ee),k.pixelStorei(k.UNPACK_SKIP_ROWS,Ge),k.pixelStorei(k.UNPACK_SKIP_IMAGES,qe);let nr=E.isDataArrayTexture||E.isData3DTexture,bt=B.isDataArrayTexture||B.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){let Xn=Ie.get(E),ir=Ie.get(B),In=Ie.get(Xn.__renderTarget),vi=Ie.get(ir.__renderTarget);Le.bindFramebuffer(k.READ_FRAMEBUFFER,In.__webglFramebuffer),Le.bindFramebuffer(k.DRAW_FRAMEBUFFER,vi.__webglFramebuffer);for(let _i=0;_i<we;_i++)nr&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ie.get(E).__webglTexture,H,qe+_i),E.isDepthTexture?(bt&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ie.get(B).__webglTexture,H,vt+_i),k.blitFramebuffer(Ee,Ge,ae,ge,Te,ot,ae,ge,k.DEPTH_BUFFER_BIT,k.NEAREST)):bt?k.copyTexSubImage3D(Re,H,Te,ot,vt+_i,Ee,Ge,ae,ge):k.copyTexSubImage2D(Re,H,Te,ot,vt+_i,Ee,Ge,ae,ge);Le.bindFramebuffer(k.READ_FRAMEBUFFER,null),Le.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else bt?E.isDataTexture||E.isData3DTexture?k.texSubImage3D(Re,H,Te,ot,vt,ae,ge,we,hn,ct,Mt.data):B.isCompressedArrayTexture?k.compressedTexSubImage3D(Re,H,Te,ot,vt,ae,ge,we,hn,Mt.data):k.texSubImage3D(Re,H,Te,ot,vt,ae,ge,we,hn,ct,Mt):E.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,H,Te,ot,ae,ge,hn,ct,Mt.data):E.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,H,Te,ot,Mt.width,Mt.height,hn,Mt.data):k.texSubImage2D(k.TEXTURE_2D,H,Te,ot,ae,ge,hn,ct,Mt);k.pixelStorei(k.UNPACK_ROW_LENGTH,ri),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ht),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Fn),k.pixelStorei(k.UNPACK_SKIP_ROWS,ds),k.pixelStorei(k.UNPACK_SKIP_IMAGES,gn),H===0&&B.generateMipmaps&&k.generateMipmap(Re),Le.unbindTexture()},this.copyTextureToTexture3D=function(E,B,q=null,Y=null,H=0){return E.isTexture!==!0&&(dr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Y=arguments[1]||null,E=arguments[2],B=arguments[3],H=arguments[4]||0),dr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,B,q,Y,H)},this.initRenderTarget=function(E){Ie.get(E).__webglFramebuffer===void 0&&R.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?R.setTextureCube(E,0):E.isData3DTexture?R.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?R.setTexture2DArray(E,0):R.setTexture2D(E,0),Le.unbindTexture()},this.resetState=function(){T=0,C=0,A=null,Le.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}};var Ui=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new xe(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Bs=class extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gt,this.environmentIntensity=1,this.environmentRotation=new Gt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Zn=class extends sn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Qt,u=Qt,d,f){super(null,o,a,l,c,u,s,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ts=class extends Lt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},As=new ze,ed=new ze,_o=[],td=new gi,Ey=new ze,cr=new fe,hr=new Ni,rn=class extends fe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ts(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ey)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new gi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,As),td.copy(e.boundingBox).applyMatrix4(As),this.boundingBox.union(td)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ni),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,As),hr.copy(e.boundingSphere).applyMatrix4(As),this.boundingSphere.union(hr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(cr.geometry=this.geometry,cr.material=this.material,cr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hr.copy(this.boundingSphere),hr.applyMatrix4(n),e.ray.intersectsSphere(hr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,As),ed.multiplyMatrices(n,As),cr.matrixWorld=ed,cr.raycast(e,_o);for(let o=0,a=_o.length;o<a;o++){let l=_o[o];l.instanceId=r,l.object=this,t.push(l)}_o.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ts(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Zn(new Float32Array(s*this.count),s,this.count,sh,dn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Sr=class extends xi{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},nd=new ze,Mc=new _r,Mo=new Ni,bo=new P,Bo=class extends Wt{constructor(e=new Nt,t=new Sr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Mo.copy(n.boundingSphere),Mo.applyMatrix4(s),Mo.radius+=r,e.ray.intersectsSphere(Mo)===!1)return;nd.copy(s).invert(),Mc.copy(e.ray).applyMatrix4(nd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let f=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let y=f,x=p;y<x;y++){let g=c.getX(y);bo.fromBufferAttribute(d,g),id(bo,g,l,s,e,t,this)}}else{let f=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let y=f,x=p;y<x;y++)bo.fromBufferAttribute(d,y),id(bo,y,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function id(i,e,t,n,s,r,o){let a=Mc.distanceSqToPoint(i);if(a<t){let l=new P;Mc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Hs=class extends sn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Dn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let u=n[s],f=n[s+1]-u,p=(o-u)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new oe:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new P,s=[],r=[],o=[],a=new P,l=new ze;for(let p=0;p<=e;p++){let y=p/e;s[p]=this.getTangentAt(y,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let y=Math.acos(Bt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,y))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Bt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let y=1;y<=e;y++)r[y].applyMatrix4(l.makeRotationAxis(s[y],p*y)),o[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},wr=class extends Dn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new oe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*u-p*d+this.aX,c=f*d+p*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},bc=class extends wr{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function hh(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,d){let f=(o-r)/c-(a-r)/(c+u)+(a-o)/u,p=(a-o)/u-(l-o)/(u+d)+(l-a)/d;f*=u,p*=u,s(o,a,f,p)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var So=new P,gl=new hh,xl=new hh,yl=new hh,Sc=class extends Dn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(So.subVectors(s[0],s[1]).add(s[0]),c=So);let d=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(So.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=So),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,y=Math.pow(c.distanceToSquared(d),p),x=Math.pow(d.distanceToSquared(f),p),g=Math.pow(f.distanceToSquared(u),p);x<1e-4&&(x=1),y<1e-4&&(y=x),g<1e-4&&(g=x),gl.initNonuniformCatmullRom(c.x,d.x,f.x,u.x,y,x,g),xl.initNonuniformCatmullRom(c.y,d.y,f.y,u.y,y,x,g),yl.initNonuniformCatmullRom(c.z,d.z,f.z,u.z,y,x,g)}else this.curveType==="catmullrom"&&(gl.initCatmullRom(c.x,d.x,f.x,u.x,this.tension),xl.initCatmullRom(c.y,d.y,f.y,u.y,this.tension),yl.initCatmullRom(c.z,d.z,f.z,u.z,this.tension));return n.set(gl.calc(l),xl.calc(l),yl.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function sd(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Ty(i,e){let t=1-i;return t*t*e}function Ay(i,e){return 2*(1-i)*i*e}function Ry(i,e){return i*i*e}function mr(i,e,t,n){return Ty(i,e)+Ay(i,t)+Ry(i,n)}function Cy(i,e){let t=1-i;return t*t*t*e}function Iy(i,e){let t=1-i;return 3*t*t*i*e}function Py(i,e){return 3*(1-i)*i*i*e}function Ly(i,e){return i*i*i*e}function gr(i,e,t,n,s){return Cy(i,e)+Iy(i,t)+Py(i,n)+Ly(i,s)}var Ho=class extends Dn{constructor(e=new oe,t=new oe,n=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new oe){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(e,s.x,r.x,o.x,a.x),gr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},wc=class extends Dn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gr(e,s.x,r.x,o.x,a.x),gr(e,s.y,r.y,o.y,a.y),gr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Vo=class extends Dn{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ec=class extends Dn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Go=class extends Dn{constructor(e=new oe,t=new oe,n=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new oe){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(mr(e,s.x,r.x,o.x),mr(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Tc=class extends Dn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(mr(e,s.x,r.x,o.x),mr(e,s.y,r.y,o.y),mr(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wo=class extends Dn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(sd(a,l.x,c.x,u.x,d.x),sd(a,l.y,c.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new oe().fromArray(s))}return this}},rd=Object.freeze({__proto__:null,ArcCurve:bc,CatmullRomCurve3:Sc,CubicBezierCurve:Ho,CubicBezierCurve3:wc,EllipseCurve:wr,LineCurve:Vo,LineCurve3:Ec,QuadraticBezierCurve:Go,QuadraticBezierCurve3:Tc,SplineCurve:Wo}),Ac=class extends Dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new rd[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new rd[s.type]().fromJSON(s))}return this}},Rc=class extends Ac{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Vo(this.currentPoint.clone(),new oe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Go(this.currentPoint.clone(),new oe(e,t),new oe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Ho(this.currentPoint.clone(),new oe(e,t),new oe(n,s),new oe(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Wo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new wr(e,t,n,s,r,o,a,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Cc=class i extends Nt{constructor(e=[new oe(0,-.5),new oe(.5,0),new oe(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=Bt(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],u=1/t,d=new P,f=new oe,p=new P,y=new P,x=new P,g=0,m=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,x.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:g=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,p.x=m*1,p.y=-g,p.z=m*0,y.copy(p),p.x+=x.x,p.y+=x.y,p.z+=x.z,p.normalize(),l.push(p.x,p.y,p.z),x.copy(y)}for(let v=0;v<=t;v++){let M=n+v*u*s,b=Math.sin(M),L=Math.cos(M);for(let T=0;T<=e.length-1;T++){d.x=e[T].x*b,d.y=e[T].y,d.z=e[T].x*L,o.push(d.x,d.y,d.z),f.x=v/t,f.y=T/(e.length-1),a.push(f.x,f.y);let C=l[3*T+0]*b,A=l[3*T+1],S=l[3*T+0]*L;c.push(C,A,S)}}for(let v=0;v<t;v++)for(let M=0;M<e.length-1;M++){let b=M+v*e.length,L=b,T=b+e.length,C=b+e.length+1,A=b+1;r.push(L,T,A),r.push(C,A,T)}this.setIndex(r),this.setAttribute("position",new lt(o,3)),this.setAttribute("uv",new lt(a,2)),this.setAttribute("normal",new lt(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Sn=class i extends Cc{constructor(e=1,t=1,n=4,s=8){let r=new Rc;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}};var tt=class i extends Nt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],d=[],f=[],p=[],y=0,x=[],g=n/2,m=0;v(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new lt(d,3)),this.setAttribute("normal",new lt(f,3)),this.setAttribute("uv",new lt(p,2));function v(){let b=new P,L=new P,T=0,C=(t-e)/n;for(let A=0;A<=r;A++){let S=[],_=A/r,I=_*(t-e)+e;for(let F=0;F<=s;F++){let U=F/s,O=U*l+a,G=Math.sin(O),z=Math.cos(O);L.x=I*G,L.y=-_*n+g,L.z=I*z,d.push(L.x,L.y,L.z),b.set(G,C,z).normalize(),f.push(b.x,b.y,b.z),p.push(U,1-_),S.push(y++)}x.push(S)}for(let A=0;A<s;A++)for(let S=0;S<r;S++){let _=x[S][A],I=x[S+1][A],F=x[S+1][A+1],U=x[S][A+1];(e>0||S!==0)&&(u.push(_,I,U),T+=3),(t>0||S!==r-1)&&(u.push(I,F,U),T+=3)}c.addGroup(m,T,0),m+=T}function M(b){let L=y,T=new oe,C=new P,A=0,S=b===!0?e:t,_=b===!0?1:-1;for(let F=1;F<=s;F++)d.push(0,g*_,0),f.push(0,_,0),p.push(.5,.5),y++;let I=y;for(let F=0;F<=s;F++){let O=F/s*l+a,G=Math.cos(O),z=Math.sin(O);C.x=S*z,C.y=g*_,C.z=S*G,d.push(C.x,C.y,C.z),f.push(0,_,0),T.x=G*.5+.5,T.y=z*.5*_+.5,p.push(T.x,T.y),y++}for(let F=0;F<s;F++){let U=L+F,O=I+F;b===!0?u.push(O,O+1,U):u.push(O+1,O,U),A+=3}c.addGroup(m,A,b===!0?1:2),m+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Xo=class i extends tt{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ic=class i extends Nt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),u(),this.setAttribute("position",new lt(r,3)),this.setAttribute("normal",new lt(r.slice(),3)),this.setAttribute("uv",new lt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let M=new P,b=new P,L=new P;for(let T=0;T<t.length;T+=3)p(t[T+0],M),p(t[T+1],b),p(t[T+2],L),l(M,b,L,v)}function l(v,M,b,L){let T=L+1,C=[];for(let A=0;A<=T;A++){C[A]=[];let S=v.clone().lerp(b,A/T),_=M.clone().lerp(b,A/T),I=T-A;for(let F=0;F<=I;F++)F===0&&A===T?C[A][F]=S:C[A][F]=S.clone().lerp(_,F/I)}for(let A=0;A<T;A++)for(let S=0;S<2*(T-A)-1;S++){let _=Math.floor(S/2);S%2===0?(f(C[A][_+1]),f(C[A+1][_]),f(C[A][_])):(f(C[A][_+1]),f(C[A+1][_+1]),f(C[A+1][_]))}}function c(v){let M=new P;for(let b=0;b<r.length;b+=3)M.x=r[b+0],M.y=r[b+1],M.z=r[b+2],M.normalize().multiplyScalar(v),r[b+0]=M.x,r[b+1]=M.y,r[b+2]=M.z}function u(){let v=new P;for(let M=0;M<r.length;M+=3){v.x=r[M+0],v.y=r[M+1],v.z=r[M+2];let b=g(v)/2/Math.PI+.5,L=m(v)/Math.PI+.5;o.push(b,1-L)}y(),d()}function d(){for(let v=0;v<o.length;v+=6){let M=o[v+0],b=o[v+2],L=o[v+4],T=Math.max(M,b,L),C=Math.min(M,b,L);T>.9&&C<.1&&(M<.2&&(o[v+0]+=1),b<.2&&(o[v+2]+=1),L<.2&&(o[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,M){let b=v*3;M.x=e[b+0],M.y=e[b+1],M.z=e[b+2]}function y(){let v=new P,M=new P,b=new P,L=new P,T=new oe,C=new oe,A=new oe;for(let S=0,_=0;S<r.length;S+=9,_+=6){v.set(r[S+0],r[S+1],r[S+2]),M.set(r[S+3],r[S+4],r[S+5]),b.set(r[S+6],r[S+7],r[S+8]),T.set(o[_+0],o[_+1]),C.set(o[_+2],o[_+3]),A.set(o[_+4],o[_+5]),L.copy(v).add(M).add(b).divideScalar(3);let I=g(L);x(T,_+0,v,I),x(C,_+2,M,I),x(A,_+4,b,I)}}function x(v,M,b,L){L<0&&v.x===1&&(o[M]=v.x-1),b.x===0&&b.z===0&&(o[M]=L/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Er=class i extends Ic{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var $n=class i extends Nt{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);let a=[],l=[],c=[],u=[],d=e,f=(t-e)/s,p=new P,y=new oe;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let m=r+g/n*o;p.x=d*Math.cos(m),p.y=d*Math.sin(m),l.push(p.x,p.y,p.z),c.push(0,0,1),y.x=(p.x/t+1)/2,y.y=(p.y/t+1)/2,u.push(y.x,y.y)}d+=f}for(let x=0;x<s;x++){let g=x*(n+1);for(let m=0;m<n;m++){let v=m+g,M=v,b=v+n+1,L=v+n+2,T=v+1;a.push(M,b,T),a.push(b,L,T)}}this.setIndex(a),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var Et=class i extends Nt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],d=new P,f=new P,p=[],y=[],x=[],g=[];for(let m=0;m<=n;m++){let v=[],M=m/n,b=0;m===0&&o===0?b=.5/t:m===n&&l===Math.PI&&(b=-.5/t);for(let L=0;L<=t;L++){let T=L/t;d.x=-e*Math.cos(s+T*r)*Math.sin(o+M*a),d.y=e*Math.cos(o+M*a),d.z=e*Math.sin(s+T*r)*Math.sin(o+M*a),y.push(d.x,d.y,d.z),f.copy(d).normalize(),x.push(f.x,f.y,f.z),g.push(T+b,1-M),v.push(c++)}u.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){let M=u[m][v+1],b=u[m][v],L=u[m+1][v],T=u[m+1][v+1];(m!==0||o>0)&&p.push(M,b,T),(m!==n-1||l<Math.PI)&&p.push(b,L,T)}this.setIndex(p),this.setAttribute("position",new lt(y,3)),this.setAttribute("normal",new lt(x,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var wn=class i extends Nt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],u=new P,d=new P,f=new P;for(let p=0;p<=n;p++)for(let y=0;y<=s;y++){let x=y/s*r,g=p/n*Math.PI*2;d.x=(e+t*Math.cos(g))*Math.cos(x),d.y=(e+t*Math.cos(g))*Math.sin(x),d.z=t*Math.sin(g),a.push(d.x,d.y,d.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),f.subVectors(d,u).normalize(),l.push(f.x,f.y,f.z),c.push(y/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let y=1;y<=s;y++){let x=(s+1)*p+y-1,g=(s+1)*(p-1)+y-1,m=(s+1)*(p-1)+y,v=(s+1)*p+y;o.push(x,g,v),o.push(g,m,v)}this.setIndex(o),this.setAttribute("position",new lt(a,3)),this.setAttribute("normal",new lt(l,3)),this.setAttribute("uv",new lt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var qo=class extends St{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}},Oe=class extends xi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lh,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Yo=class extends xi{static get type(){return"MeshNormalMaterial"}constructor(e){super(),this.isMeshNormalMaterial=!0,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lh,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}};function wo(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Dy(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Vs=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Pc=class extends Vs{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:su,endingEnd:su}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ru:r=e,a=2*t-n;break;case ou:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ru:o=e,l=2*n-t;break;case ou:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,p=this._weightNext,y=(n-t)/(s-t),x=y*y,g=x*y,m=-f*g+2*f*x-f*y,v=(1+f)*g+(-1.5-2*f)*x+(-.5+f)*y+1,M=(-1-p)*g+(1.5+p)*x+.5*y,b=p*g-p*x;for(let L=0;L!==a;++L)r[L]=m*o[u+L]+v*o[c+L]+M*o[l+L]+b*o[d+L];return r}},Lc=class extends Vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),d=1-u;for(let f=0;f!==a;++f)r[f]=o[c+f]*d+o[l+f]*u;return r}},Dc=class extends Vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Gn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=wo(t,this.TimeBufferType),this.values=wo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wo(e.times,Array),values:wo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Dc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Lc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Pc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Io:t=this.InterpolantFactoryMethodDiscrete;break;case sc:t=this.InterpolantFactoryMethodLinear;break;case Ha:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Io;case this.InterpolantFactoryMethodLinear:return sc;case this.InterpolantFactoryMethodSmooth:return Ha}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Dy(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ha,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let d=a*n,f=d-n,p=d+n;for(let y=0;y!==n;++y){let x=t[d+y];if(x!==t[f+y]||x!==t[p+y]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*n,f=o*n;for(let p=0;p!==n;++p)t[f+p]=t[d+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Gn.prototype.TimeBufferType=Float32Array;Gn.prototype.ValueBufferType=Float32Array;Gn.prototype.DefaultInterpolation=sc;var ns=class extends Gn{constructor(e,t,n){super(e,t,n)}};ns.prototype.ValueTypeName="bool";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Io;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Nc=class extends Gn{};Nc.prototype.ValueTypeName="color";var Uc=class extends Gn{};Uc.prototype.ValueTypeName="number";var Oc=class extends Vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)Vt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Zo=class extends Gn{InterpolantFactoryMethodLinear(e){return new Oc(this.times,this.values,this.getValueSize(),e)}};Zo.prototype.ValueTypeName="quaternion";Zo.prototype.InterpolantFactoryMethodSmooth=void 0;var is=class extends Gn{constructor(e,t,n){super(e,t,n)}};is.prototype.ValueTypeName="string";is.prototype.ValueBufferType=Array;is.prototype.DefaultInterpolation=Io;is.prototype.InterpolantFactoryMethodLinear=void 0;is.prototype.InterpolantFactoryMethodSmooth=void 0;var Fc=class extends Gn{};Fc.prototype.ValueTypeName="vector";var $o={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},zc=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,f=c.length;d<f;d+=2){let p=c[d],y=c[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return y}return null}}},Ny=new zc,ss=class{constructor(e){this.manager=e!==void 0?e:Ny,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};ss.DEFAULT_MATERIAL_NAME="__DEFAULT";var ui={},kc=class extends Error{constructor(e,t){super(e),this.response=t}},Bc=class extends ss{constructor(e){super(e)}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=$o.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(ui[e]!==void 0){ui[e].push({onLoad:t,onProgress:n,onError:s});return}ui[e]=[],ui[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=ui[e],d=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=f?parseInt(f):0,y=p!==0,x=0,g=new ReadableStream({start(m){v();function v(){d.read().then(({done:M,value:b})=>{if(M)m.close();else{x+=b.byteLength;let L=new ProgressEvent("progress",{lengthComputable:y,loaded:x,total:p});for(let T=0,C=u.length;T<C;T++){let A=u[T];A.onProgress&&A.onProgress(L)}m.enqueue(b),v()}},M=>{m.error(M)})}}});return new Response(g)}else throw new kc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a===void 0)return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),f=d&&d[1]?d[1].toLowerCase():void 0,p=new TextDecoder(f);return c.arrayBuffer().then(y=>p.decode(y))}}}).then(c=>{$o.add(e,c);let u=ui[e];delete ui[e];for(let d=0,f=u.length;d<f;d++){let p=u[d];p.onLoad&&p.onLoad(c)}}).catch(c=>{let u=ui[e];if(u===void 0)throw this.manager.itemError(e),c;delete ui[e];for(let d=0,f=u.length;d<f;d++){let p=u[d];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}};var Hc=class extends ss{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=$o.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;let a=vr("img");function l(){u(),$o.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}};var Jo=class extends ss{constructor(e){super(e)}load(e,t,n,s){let r=this,o=new Zn,a=new Bc(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(l){let c;try{c=r.parse(l)}catch(u){if(s!==void 0)s(u);else{console.error(u);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:_n,o.wrapT=c.wrapT!==void 0?c.wrapT:_n,o.magFilter=c.magFilter!==void 0?c.magFilter:Ut,o.minFilter=c.minFilter!==void 0?c.minFilter:Ut,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(o.colorSpace=c.colorSpace),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=Ri),c.mipmapCount===1&&(o.minFilter=Ut),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,t&&t(o,c)},n,s),o}},Ko=class extends ss{constructor(e){super(e)}load(e,t,n,s){let r=new sn,o=new Hc(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Gs=class extends Wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},jo=class extends Gs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},vl=new ze,od=new P,ad=new P,Tr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.map=null,this.mapPass=null,this.matrix=new ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new br,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;od.setFromMatrixPosition(e.matrixWorld),t.position.copy(od),ad.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ad),t.updateMatrixWorld(),vl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Vc=class extends Tr{constructor(){super(new Yt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=Lo*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Qo=class extends Gs{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.target=new Wt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Vc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},ld=new ze,ur=new P,_l=new P,Gc=class extends Tr{constructor(){super(new Yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new oe(4,2),this._viewportCount=6,this._viewports=[new mt(2,1,1,1),new mt(0,1,1,1),new mt(3,1,1,1),new mt(1,1,1,1),new mt(3,0,1,1),new mt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ur.setFromMatrixPosition(e.matrixWorld),n.position.copy(ur),_l.copy(n.position),_l.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(_l),n.updateMatrixWorld(),s.makeTranslation(-ur.x,-ur.y,-ur.z),ld.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ld)}},Ws=class extends Gs{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Gc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Wc=class extends Tr{constructor(){super(new Fs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ea=class extends Gs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.target=new Wt,this.shadow=new Wc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ta=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=cd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=cd();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function cd(){return performance.now()}var uh="\\[\\]\\.:\\/",Uy=new RegExp("["+uh+"]","g"),dh="[^"+uh+"]",Oy="[^"+uh.replace("\\.","")+"]",Fy=/((?:WC+[\/:])*)/.source.replace("WC",dh),zy=/(WCOD+)?/.source.replace("WCOD",Oy),ky=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",dh),By=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",dh),Hy=new RegExp("^"+Fy+zy+ky+By+"$"),Vy=["material","materials","bones","map"],Xc=class{constructor(e,t,n){let s=n||wt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},wt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Uy,"")}static parseTrackName(e){let t=Hy.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Vy.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};wt.Composite=Xc;wt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};wt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};wt.prototype.GetterByBindingType=[wt.prototype._getValue_direct,wt.prototype._getValue_array,wt.prototype._getValue_arrayElement,wt.prototype._getValue_toArray];wt.prototype.SetterByBindingTypeAndVersioning=[[wt.prototype._setValue_direct,wt.prototype._setValue_direct_setNeedsUpdate,wt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_array,wt.prototype._setValue_array_setNeedsUpdate,wt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_arrayElement,wt.prototype._setValue_arrayElement_setNeedsUpdate,wt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_fromArray,wt.prototype._setValue_fromArray_setNeedsUpdate,wt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var r_=new Float32Array(1);var hd=new ze,na=class{constructor(e,t,n=0,s=1/0){this.ray=new _r(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Mr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return hd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(hd),this}intersectObject(e,t=!0,n=[]){return qc(e,this,n,t),n.sort(ud),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)qc(e[s],this,n,t);return n.sort(ud),n}};function ud(i,e){return i.distance-e.distance}function qc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)qc(r[o],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yc);var Oi={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var on=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Gy=new Fs(-1,1,1,-1,0,1),fh=class extends Nt{constructor(){super(),this.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new lt([0,2,0,0,2,0],2))}},Wy=new fh,jn=class{constructor(e){this._mesh=new fe(Wy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Gy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Zs=class extends on{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof St?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=fn.clone(e.uniforms),this.material=new St({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new jn(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Ir=class extends on{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},la=class extends on{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var ca=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new oe);this._width=n.width,this._height=n.height,t=new Dt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:It}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Zs(Oi),this.copyPass.material.blending=Ot,this.clock=new ta}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Ir!==void 0&&(o instanceof Ir?n=!0:o instanceof la&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new oe);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ha=class extends on{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new xe}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}};var Dd={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new xe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var $s=class i extends on{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new oe(e.x,e.y):new oe(256,256),this.clearColor=new xe(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Dt(r,o,{type:It}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){let f=new Dt(r,o,{type:It});f.texture.name="UnrealBloomPass.h"+d,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let p=new Dt(r,o,{type:It});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),o=Math.round(o/2)}let a=Dd;this.highPassUniforms=fn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new St({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new oe(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let u=Oi;this.copyUniforms=fn.clone(u.uniforms),this.blendMaterial=new St({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:Mn,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new xe,this.oldClearAlpha=1,this.basic=new pt,this.fsQuad=new jn(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new oe(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new St({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new oe(.5,.5)},direction:{value:new oe(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new St({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}};$s.BlurDirectionX=new oe(1,0);$s.BlurDirectionY=new oe(0,1);var Pr={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new oe},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new ze},cameraProjectionMatrixInverse:{value:new ze},cameraWorldMatrix:{value:new ze},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new P(-1,-1,-1)},sceneBoxMax:{value:new P(1,1,1)}},vertexShader:`

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
		}`},Lr={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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

		}`},ua={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
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
		}`};function Nd(i=5){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=Xy(e),n=t.length,s=new Uint8Array(n*4);for(let o=0;o<n;++o){let a=t[o],l=2*Math.PI*a/n,c=new P(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new Zn(s,e,e);return r.wrapS=bn,r.wrapT=bn,r.needsUpdate=!0,r}function Xy(i){let e=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),t=e*e,n=Array(t).fill(0),s=Math.floor(e/2),r=e-1;for(let o=1;o<=t;){if(s===-1&&r===e?(r=e-2,s=0):(r===e&&(r=0),s<0&&(s=e-1)),n[s*e+r]!==0){r-=2,s++;continue}else n[s*e+r]=o++;r++,s--}return n}var Dr={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:ph(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new oe},cameraProjectionMatrixInverse:{value:new ze},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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
		}`};function ph(i,e,t){let n=qy(i,e,t),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let o=n[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<i-1?",":")"}`}return s}function qy(i,e,t){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*e*s/i,o=Math.pow(s/(i-1),t);n.push(new P(Math.cos(r),Math.sin(r),o))}return n}var da=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let t=0;t<512;t++)this.perm[t]=this.p[t&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}dot(e,t,n){return e[0]*t+e[1]*n}dot3(e,t,n,s){return e[0]*t+e[1]*n+e[2]*s}dot4(e,t,n,s,r){return e[0]*t+e[1]*n+e[2]*s+e[3]*r}noise(e,t){let n,s,r,o=.5*(Math.sqrt(3)-1),a=(e+t)*o,l=Math.floor(e+a),c=Math.floor(t+a),u=(3-Math.sqrt(3))/6,d=(l+c)*u,f=l-d,p=c-d,y=e-f,x=t-p,g,m;y>x?(g=1,m=0):(g=0,m=1);let v=y-g+u,M=x-m+u,b=y-1+2*u,L=x-1+2*u,T=l&255,C=c&255,A=this.perm[T+this.perm[C]]%12,S=this.perm[T+g+this.perm[C+m]]%12,_=this.perm[T+1+this.perm[C+1]]%12,I=.5-y*y-x*x;I<0?n=0:(I*=I,n=I*I*this.dot(this.grad3[A],y,x));let F=.5-v*v-M*M;F<0?s=0:(F*=F,s=F*F*this.dot(this.grad3[S],v,M));let U=.5-b*b-L*L;return U<0?r=0:(U*=U,r=U*U*this.dot(this.grad3[_],b,L)),70*(n+s+r)}noise3d(e,t,n){let s,r,o,a,c=(e+t+n)*.3333333333333333,u=Math.floor(e+c),d=Math.floor(t+c),f=Math.floor(n+c),p=1/6,y=(u+d+f)*p,x=u-y,g=d-y,m=f-y,v=e-x,M=t-g,b=n-m,L,T,C,A,S,_;v>=M?M>=b?(L=1,T=0,C=0,A=1,S=1,_=0):v>=b?(L=1,T=0,C=0,A=1,S=0,_=1):(L=0,T=0,C=1,A=1,S=0,_=1):M<b?(L=0,T=0,C=1,A=0,S=1,_=1):v<b?(L=0,T=1,C=0,A=0,S=1,_=1):(L=0,T=1,C=0,A=1,S=1,_=0);let I=v-L+p,F=M-T+p,U=b-C+p,O=v-A+2*p,G=M-S+2*p,z=b-_+2*p,K=v-1+3*p,X=M-1+3*p,ne=b-1+3*p,le=u&255,Me=d&255,Ce=f&255,We=this.perm[le+this.perm[Me+this.perm[Ce]]]%12,$=this.perm[le+L+this.perm[Me+T+this.perm[Ce+C]]]%12,re=this.perm[le+A+this.perm[Me+S+this.perm[Ce+_]]]%12,be=this.perm[le+1+this.perm[Me+1+this.perm[Ce+1]]]%12,ce=.6-v*v-M*M-b*b;ce<0?s=0:(ce*=ce,s=ce*ce*this.dot3(this.grad3[We],v,M,b));let Ae=.6-I*I-F*F-U*U;Ae<0?r=0:(Ae*=Ae,r=Ae*Ae*this.dot3(this.grad3[$],I,F,U));let Ue=.6-O*O-G*G-z*z;Ue<0?o=0:(Ue*=Ue,o=Ue*Ue*this.dot3(this.grad3[re],O,G,z));let He=.6-K*K-X*X-ne*ne;return He<0?a=0:(He*=He,a=He*He*this.dot3(this.grad3[be],K,X,ne)),32*(s+r+o+a)}noise4d(e,t,n,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,u,d,f,p,y,x=(e+t+n+s)*l,g=Math.floor(e+x),m=Math.floor(t+x),v=Math.floor(n+x),M=Math.floor(s+x),b=(g+m+v+M)*c,L=g-b,T=m-b,C=v-b,A=M-b,S=e-L,_=t-T,I=n-C,F=s-A,U=S>_?32:0,O=S>I?16:0,G=_>I?8:0,z=S>F?4:0,K=_>F?2:0,X=I>F?1:0,ne=U+O+G+z+K+X,le=o[ne][0]>=3?1:0,Me=o[ne][1]>=3?1:0,Ce=o[ne][2]>=3?1:0,We=o[ne][3]>=3?1:0,$=o[ne][0]>=2?1:0,re=o[ne][1]>=2?1:0,be=o[ne][2]>=2?1:0,ce=o[ne][3]>=2?1:0,Ae=o[ne][0]>=1?1:0,Ue=o[ne][1]>=1?1:0,He=o[ne][2]>=1?1:0,yt=o[ne][3]>=1?1:0,je=S-le+c,_t=_-Me+c,k=I-Ce+c,Zt=F-We+c,Je=S-$+2*c,Ke=_-re+2*c,Le=I-be+2*c,dt=F-ce+2*c,Ie=S-Ae+3*c,R=_-Ue+3*c,w=I-He+3*c,V=F-yt+3*c,Q=S-1+4*c,ie=_-1+4*c,J=I-1+4*c,Se=F-1+4*c,ue=g&255,pe=m&255,$e=v&255,se=M&255,ve=a[ue+a[pe+a[$e+a[se]]]]%32,Fe=a[ue+le+a[pe+Me+a[$e+Ce+a[se+We]]]]%32,Be=a[ue+$+a[pe+re+a[$e+be+a[se+ce]]]]%32,_e=a[ue+Ae+a[pe+Ue+a[$e+He+a[se+yt]]]]%32,Qe=a[ue+1+a[pe+1+a[$e+1+a[se+1]]]]%32,Ve=.6-S*S-_*_-I*I-F*F;Ve<0?u=0:(Ve*=Ve,u=Ve*Ve*this.dot4(r[ve],S,_,I,F));let rt=.6-je*je-_t*_t-k*k-Zt*Zt;rt<0?d=0:(rt*=rt,d=rt*rt*this.dot4(r[Fe],je,_t,k,Zt));let N=.6-Je*Je-Ke*Ke-Le*Le-dt*dt;N<0?f=0:(N*=N,f=N*N*this.dot4(r[Be],Je,Ke,Le,dt));let he=.6-Ie*Ie-R*R-w*w-V*V;he<0?p=0:(he*=he,p=he*he*this.dot4(r[_e],Ie,R,w,V));let Z=.6-Q*Q-ie*ie-J*J-Se*Se;return Z<0?y=0:(Z*=Z,y=Z*Z*this.dot4(r[Qe],Q,ie,J,Se)),27*(u+d+f+p+y)}};var Nr=class i extends on{constructor(e,t,n,s,r,o,a){super(),this.width=n!==void 0?n:512,this.height=s!==void 0?s:512,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=new Map,this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Nd(),this.pdNoiseTexture=this.generateNoise(),this.gtaoRenderTarget=new Dt(this.width,this.height,{type:It}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new St({defines:Object.assign({},Pr.defines),uniforms:fn.clone(Pr.uniforms),vertexShader:Pr.vertexShader,fragmentShader:Pr.fragmentShader,blending:Ot,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Yo,this.normalMaterial.blending=Ot,this.pdMaterial=new St({defines:Object.assign({},Dr.defines),uniforms:fn.clone(Dr.uniforms),vertexShader:Dr.vertexShader,fragmentShader:Dr.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new St({defines:Object.assign({},Lr.defines),uniforms:fn.clone(Lr.uniforms),vertexShader:Lr.vertexShader,fragmentShader:Lr.fragmentShader,blending:Ot}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new St({uniforms:fn.clone(Oi.uniforms),vertexShader:Oi.vertexShader,fragmentShader:Oi.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:sa,blendDst:Xs,blendEquation:Ln,blendSrcAlpha:ia,blendDstAlpha:Xs,blendEquationAlpha:Ln}),this.blendMaterial=new St({uniforms:fn.clone(ua.uniforms),vertexShader:ua.vertexShader,fragmentShader:ua.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:$c,blendSrc:sa,blendDst:Xs,blendEquation:Ln,blendSrcAlpha:ia,blendDstAlpha:Xs,blendEquationAlpha:Ln}),this.fsQuad=new jn(null),this.originalClearColor=new xe,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this.fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e!==void 0?(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1):(this.depthTexture=new ks,this.depthTexture.format=Li,this.depthTexture.type=Pi,this.normalRenderTarget=new Dt(this.width,this.height,{minFilter:Qt,magFilter:Qt,type:It,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&(e.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=e.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=ph(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(e,t,n){switch(this._renderGBuffer&&(this.overrideVisibility(),this.renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this.restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this.renderPass(e,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.renderPass(e,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Ot,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=Ot,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=Ot,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=Ot,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=Ot,this.renderPass(e,this.copyMaterial,this.renderToScreen?null:t),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.renderPass(e,this.blendMaterial,this.renderToScreen?null:t);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}renderPass(e,t,n,s,r){e.getClearColor(this.originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.fsQuad.material=t,this.fsQuad.render(e),e.autoClear=a,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}renderOverride(e,t,n,s,r){e.getClearColor(this.originalClearColor);let o=e.getClearAlpha(),a=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,s=t.clearColor||s,r=t.clearAlpha||r,s!=null&&(e.setClearColor(s),e.setClearAlpha(r||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=a,e.setClearColor(this.originalClearColor),e.setClearAlpha(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){t.set(n,n.visible),(n.isPoints||n.isLine)&&(n.visible=!1)})}restoreVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(n){let s=t.get(n);n.visible=s}),t.clear()}generateNoise(e=64){let t=new da,n=e*e*4,s=new Uint8Array(n);for(let o=0;o<e;o++)for(let a=0;a<e;a++){let l=o,c=a;s[(o*e+a)*4]=(t.noise(l,c)*.5+.5)*255,s[(o*e+a)*4+1]=(t.noise(l+e,c)*.5+.5)*255,s[(o*e+a)*4+2]=(t.noise(l,c+e)*.5+.5)*255,s[(o*e+a)*4+3]=(t.noise(l+e,c+e)*.5+.5)*255}let r=new Zn(s,e,e,nn,Vn);return r.wrapS=bn,r.wrapT=bn,r.needsUpdate=!0,r}};Nr.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Ud={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var fa=class extends on{constructor(){super();let e=Ud;this.uniforms=fn.clone(e.uniforms),this.material=new qo({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new jn(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},et.getTransfer(this._outputColorSpace)===ut&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Jc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Kc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===jc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ar?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Qc?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===eh&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var pa=class extends Bs{constructor(){super();let e=new Pe;e.deleteAttribute("uv");let t=new Oe({side:jt}),n=new Oe,s=new Ws(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new fe(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new fe(e,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);let a=new fe(e,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);let l=new fe(e,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let c=new fe(e,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);let u=new fe(e,n);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);let d=new fe(e,n);d.position.set(-2.193,-.369,-5.547),d.rotation.set(0,.516,0),d.scale.set(3.875,3.487,2.986),this.add(d);let f=new fe(e,Js(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);let p=new fe(e,Js(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);let y=new fe(e,Js(17));y.position.set(14.904,12.198,-1.832),y.scale.set(.15,4.265,6.331),this.add(y);let x=new fe(e,Js(43));x.position.set(-.462,8.89,14.52),x.scale.set(4.38,5.441,.088),this.add(x);let g=new fe(e,Js(20));g.position.set(3.235,11.486,-12.541),g.scale.set(2.5,2,.1),this.add(g);let m=new fe(e,Js(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Js(i){let e=new pt;return e.color.setScalar(i),e}var ma=class extends Jo{constructor(e){super(e),this.type=It}parse(e){let o=function(A,S){switch(A){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(S||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(S||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(S||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(S||""))}},u=`
`,d=function(A,S,_){S=S||1024;let F=A.pos,U=-1,O=0,G="",z=String.fromCharCode.apply(null,new Uint16Array(A.subarray(F,F+128)));for(;0>(U=z.indexOf(u))&&O<S&&F<A.byteLength;)G+=z,O+=z.length,F+=128,z+=String.fromCharCode.apply(null,new Uint16Array(A.subarray(F,F+128)));return-1<U?(_!==!1&&(A.pos+=O+U+1),G+z.slice(0,U)):!1},f=function(A){let S=/^#\?(\S+)/,_=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,I=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,F=/^\s*FORMAT=(\S+)\s*$/,U=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,O={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},G,z;for((A.pos>=A.byteLength||!(G=d(A)))&&o(1,"no header found"),(z=G.match(S))||o(3,"bad initial token"),O.valid|=1,O.programtype=z[1],O.string+=G+`
`;G=d(A),G!==!1;){if(O.string+=G+`
`,G.charAt(0)==="#"){O.comments+=G+`
`;continue}if((z=G.match(_))&&(O.gamma=parseFloat(z[1])),(z=G.match(I))&&(O.exposure=parseFloat(z[1])),(z=G.match(F))&&(O.valid|=2,O.format=z[1]),(z=G.match(U))&&(O.valid|=4,O.height=parseInt(z[1],10),O.width=parseInt(z[2],10)),O.valid&2&&O.valid&4)break}return O.valid&2||o(3,"missing format specifier"),O.valid&4||o(3,"missing image size specifier"),O},p=function(A,S,_){let I=S;if(I<8||I>32767||A[0]!==2||A[1]!==2||A[2]&128)return new Uint8Array(A);I!==(A[2]<<8|A[3])&&o(3,"wrong scanline width");let F=new Uint8Array(4*S*_);F.length||o(4,"unable to allocate buffer space");let U=0,O=0,G=4*I,z=new Uint8Array(4),K=new Uint8Array(G),X=_;for(;X>0&&O<A.byteLength;){O+4>A.byteLength&&o(1),z[0]=A[O++],z[1]=A[O++],z[2]=A[O++],z[3]=A[O++],(z[0]!=2||z[1]!=2||(z[2]<<8|z[3])!=I)&&o(3,"bad rgbe scanline format");let ne=0,le;for(;ne<G&&O<A.byteLength;){le=A[O++];let Ce=le>128;if(Ce&&(le-=128),(le===0||ne+le>G)&&o(3,"bad scanline data"),Ce){let We=A[O++];for(let $=0;$<le;$++)K[ne++]=We}else K.set(A.subarray(O,O+le),ne),ne+=le,O+=le}let Me=I;for(let Ce=0;Ce<Me;Ce++){let We=0;F[U]=K[Ce+We],We+=I,F[U+1]=K[Ce+We],We+=I,F[U+2]=K[Ce+We],We+=I,F[U+3]=K[Ce+We],U+=4}X--}return F},y=function(A,S,_,I){let F=A[S+3],U=Math.pow(2,F-128)/255;_[I+0]=A[S+0]*U,_[I+1]=A[S+1]*U,_[I+2]=A[S+2]*U,_[I+3]=1},x=function(A,S,_,I){let F=A[S+3],U=Math.pow(2,F-128)/255;_[I+0]=Cr.toHalfFloat(Math.min(A[S+0]*U,65504)),_[I+1]=Cr.toHalfFloat(Math.min(A[S+1]*U,65504)),_[I+2]=Cr.toHalfFloat(Math.min(A[S+2]*U,65504)),_[I+3]=Cr.toHalfFloat(1)},g=new Uint8Array(e);g.pos=0;let m=f(g),v=m.width,M=m.height,b=p(g.subarray(g.pos),v,M),L,T,C;switch(this.type){case dn:C=b.length/4;let A=new Float32Array(C*4);for(let _=0;_<C;_++)y(b,_*4,A,_*4);L=A,T=dn;break;case It:C=b.length/4;let S=new Uint16Array(C*4);for(let _=0;_<C;_++)x(b,_*4,S,_*4);L=S,T=It;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:v,height:M,data:L,header:m.string,gamma:m.gamma,exposure:m.exposure,type:T}}setDataType(e){return this.type=e,this}load(e,t,n,s){function r(o,a){switch(o.type){case dn:case It:o.colorSpace=Jn,o.minFilter=Ut,o.magFilter=Ut,o.generateMipmaps=!1,o.flipY=!0;break}t&&t(o,a)}return super.load(e,r,n,s)}};var D={};h.R=D;var Yy={uniforms:{tDiffuse:{value:null},uTime:{value:0},uContrast:{value:1.08},uSat:{value:1.12},uTint:{value:new P(1,1,1)},uVignette:{value:.32},uGrain:{value:.035},uSplit:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uTime, uContrast, uSat, uVignette, uGrain, uSplit; uniform vec3 uTint; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
    void main(){
      vec2 d = (vUv - 0.5);
      vec3 c;
      if (uSplit > 0.001) { // chromatic split on hits
        vec2 o = d * uSplit * 0.03;
        c = vec3(texture2D(tDiffuse, vUv + o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - o).b);
      } else c = texture2D(tDiffuse, vUv).rgb;
      c = (c - 0.5) * uContrast + 0.5;
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(l), c, uSat) * uTint;
      c *= 1.0 - uVignette * smoothstep(0.25, 0.85, length(d) * 1.35);
      c += (hash(vUv * 900.0) - 0.5) * uGrain;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }`};D.init=function(i){try{D.renderer=new ko({canvas:i,antialias:!0,powerPreference:"high-performance"})}catch(t){throw document.body.insertAdjacentHTML("beforeend",'<div style="position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:#07080b;color:#fff;font:600 17px system-ui;text-align:center;padding:24px">This browser could not start 3D graphics.<br><br>Try closing other tabs, turning off Low Power Mode, or opening the link in Chrome or Safari.</div>'),t}i.addEventListener("webglcontextlost",t=>{t.preventDefault(),h.settings.quality="low",h.saveSettings(),setTimeout(()=>location.reload(),1500)}),D.renderer.toneMapping=Ar,D.renderer.toneMappingExposure=1.05,D.renderer.shadowMap.type=Zc,D.scene=new Bs,D.pmrem=new zs(D.renderer),D.studioEnv=D.pmrem.fromScene(new pa,.04).texture,D.scene.environment=D.studioEnv,D.scene.environmentIntensity=.35,D.envCache={},D.camera=new Yt(38,1,.5,300),D.camOffset=new P(0,19,12),D.camTarget=new P,D.shake=0,D.split=0,D.dyn=1,D.dynT=0,D.hemi=new jo(13624319,3813928,.7),D.scene.add(D.hemi),D.sun=new ea(16773590,2.2),D.sun.position.set(12,30,8),Object.assign(D.sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,near:1,far:80}),D.sun.shadow.bias=-4e-4,D.sun.shadow.normalBias=.03,D.scene.add(D.sun,D.sun.target),D.lights=[];for(let t=0;t<8;t++){let n=new Ws(16777215,0,20,1.2);n.position.set(0,-50,0),D.scene.add(n),D.lights.push(n)}D.lightNext=0,D.flash=new Qo(16773848,0,26,.42,.45,1),D.flash.position.set(0,-50,0),D.scene.add(D.flash,D.flash.target),D.flashOn=!1,D.flashBoost=0,D.muzzleT=0;let e=new Xo(2.6,11,24,1,!0).translate(0,-5.5,0).rotateX(-Math.PI/2);D.beam=new fe(e,new pt({color:16773328,transparent:!0,opacity:.07,blending:Mn,depthWrite:!1,side:Ht,toneMapped:!1})),D.beam.visible=!1,D.beam.renderOrder=4,D.scene.add(D.beam),D.applyQuality(h.settings.quality),addEventListener("resize",D.resize)};D.setEnv=function(i){if(D.envWant=i,D.envCache[i]){D.scene.environment=D.envCache[i];return}fetch(`assets/hdri/${i}_1k.b64.txt`).then(e=>{if(!e.ok)throw new Error(e.status);return e.text()}).then(e=>{let t=atob(e.trim()),n=new Uint8Array(t.length);for(let a=0;a<t.length;a++)n[a]=t.charCodeAt(a);let s=new ma().parse(n.buffer),r=new Zn(s.data,s.width,s.height,nn,s.type);Object.assign(r,{colorSpace:Jn,mapping:xr,minFilter:Ut,magFilter:Ut,generateMipmaps:!1,flipY:!0}),r.needsUpdate=!0;let o=D.pmrem.fromEquirectangular(r).texture;r.dispose(),D.envCache[i]=o,D.envWant===i&&(D.scene.environment=o)}).catch(()=>{D.scene.environment=D.studioEnv})};D.muzzle=function(i,e,t=1){let n=h.W.muzzle;n&&(D.muzzleT=Math.max(D.muzzleT,t),n.position.set(i,1.6,e))};D.updateFlash=function(i){let e=h.officers&&h.officers.find(t=>!t.down);if(h.W.muzzle&&(D.muzzleT=Math.max(0,D.muzzleT-i*9),h.W.muzzle.intensity=D.muzzleT*40),!D.flashOn||!e){D.flash.intensity=0,D.flash.position.set(0,-50,0),D.beam.visible=!1;return}D.flashBoost=Math.max(0,D.flashBoost-i*4),D.flash.intensity=90+D.flashBoost*160,D.flash.distance=32,D.flash.angle=.5-D.flashBoost*.08,D.beam.visible=!0,D.beam.position.set(e.x+e.ax*.5,1.5,e.z+e.az*.5),D.beam.lookAt(e.x+e.ax*11,.2,e.z+e.az*11),D.beam.material.opacity=.06+D.flashBoost*.08,D.flash.position.set(e.x-e.ax*.3,1.9,e.z-e.az*.3),D.flash.target.position.set(e.x+e.ax*9,0,e.z+e.az*9),h.W.halo&&h.W.halo.position.set(e.x,2.6,e.z)};D.takeLight=function(i,e,t){let n=D.lights[D.lightNext++%D.lights.length];return n.color.set(i),n.intensity=e,n.distance=t,n};D.resetLights=function(){for(let i of D.lights)i.intensity=0,i.position.set(0,-50,0);D.lightNext=0};D.precompile=function(){D.renderer.compile(D.scene,D.camera)};D.applyQuality=function(i){let e=h.QUALITY[i]||h.QUALITY.high,t=D.q?D.q.shadows!==e.shadows:!0;D.q=e,D.qName=i,D.dyn=1,D.renderer.shadowMap.enabled=e.shadows,D.sun.castShadow=e.shadows,e.shadows&&(D.sun.shadow.mapSize.set(e.shadowMap,e.shadowMap),D.sun.shadow.map&&(D.sun.shadow.map.dispose(),D.sun.shadow.map=null)),t&&D.scene.traverse(n=>{n.material&&(n.material.needsUpdate=!0)}),D.buildComposer(),D.resize()};D.buildComposer=function(){D.composer&&D.composer.dispose(),D.composer=null,D.ao=null,D.grade=null;let i=D.q;if(!i.grade)return;let e=new Dt(1,1,{type:It,samples:4});if(D.composer=new ca(D.renderer,e),D.composer.addPass(new ha(D.scene,D.camera)),i.ao){D.ao=new Nr(D.scene,D.camera,1,1),D.ao.blendIntensity=.9;let t=D.ao.setSize.bind(D.ao);D.ao.setSize=(n,s)=>t(Math.max(1,n>>1),Math.max(1,s>>1)),D.composer.addPass(D.ao)}i.bloom&&D.composer.addPass(D.bloom=new $s(new oe(1,1),.6,.5,.82)),D.composer.addPass(new fa),D.composer.addPass(D.grade=new Zs(Yy)),D.setGrade(D.gradeLook||{})};D.setGrade=function(i){if(D.gradeLook=i,!D.grade)return;let e=D.grade.uniforms;e.uContrast.value=i.contrast??1.08,e.uSat.value=i.sat??1.12,e.uVignette.value=i.vignette??.32,e.uTint.value.set(...i.tint||[1,1,1])};D.resize=function(){let i=innerWidth,e=innerHeight,t=matchMedia("(pointer: coarse)").matches,n=Math.min(devicePixelRatio||1,t?1.5:2)*D.q.pixel*D.dyn;D.renderer.setPixelRatio(n),D.renderer.setSize(i,e,!1),D.camera.aspect=i/e,D.zoom=i<e?1.55:e<560?1.25:1.12,D.camera.updateProjectionMatrix(),D.composer&&(D.composer.setPixelRatio(n),D.composer.setSize(i,e))};D.tuneResolution=function(i,e){if(D.dynT-=e,D.dynT>0)return;let t=D.dyn;i<52&&D.dyn>.6?t=Math.max(.6,D.dyn-.1):i>58&&D.dyn<1&&(t=Math.min(1,D.dyn+.05)),t!==D.dyn?(D.dyn=t,D.resize(),D.dynT=2):D.dynT=1};D.follow=function(i,e,t,n=1){let s=1-Math.exp(-t*6);D.camTarget.x+=(i-D.camTarget.x)*s,D.camTarget.z+=(e-D.camTarget.z)*s;let r=(D.zoom||1)*n,o=0,a=0;D.shake>0&&(o=(Math.random()-.5)*D.shake,a=(Math.random()-.5)*D.shake,D.shake=Math.max(0,D.shake-t*3)),D.camera.position.set(D.camTarget.x+D.camOffset.x*r+o,D.camOffset.y*r,D.camTarget.z+D.camOffset.z*r+a),D.camera.lookAt(D.camTarget.x+o,0,D.camTarget.z+a),D.sun.position.set(D.camTarget.x+12,30,D.camTarget.z+8),D.sun.target.position.set(D.camTarget.x,0,D.camTarget.z),D.split=Math.max(0,D.split-t*2.5)};D.render=function(i){D.grade&&(D.grade.uniforms.uTime.value=i%100,D.grade.uniforms.uSplit.value=D.split),D.composer?D.composer.render():D.renderer.render(D.scene,D.camera)};var Od=new na,Fd=new oe,zd=new Hn(new P(0,1,0),0),kd=new P;D.screenToGround=function(i,e,t=1){return Fd.set(i/innerWidth*2-1,-(e/innerHeight)*2+1),Od.setFromCamera(Fd,D.camera),zd.constant=-t,Od.ray.intersectPlane(zd,kd)?kd:null};var ga=new P;D.worldToScreen=function(i,e,t){return ga.set(i,e,t).project(D.camera),[(ga.x+1)*.5*innerWidth,(1-ga.y)*.5*innerHeight,ga.z<1]};function Ur(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new Nt,c=0;for(let u=0;u<i.length;++u){let d=i[u],f=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in d.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(d.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in d.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(d.morphAttributes[p])}if(e){let p;if(t)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,u),c+=p}}if(t){let u=0,d=[];for(let f=0;f<i.length;++f){let p=i[f].index;for(let y=0;y<p.count;++y)d.push(p.getX(y)+u);u+=i[f].attributes.position.count}l.setIndex(d)}for(let u in r){let d=Bd(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,d)}for(let u in o){let d=o[u][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let f=0;f<d;++f){let p=[];for(let x=0;x<o[u].length;++x)p.push(o[u][x][f]);let y=Bd(p);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(y)}}return l}function Bd(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let u=i[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new Lt(o,t,n),l=0;for(let c=0;c<i.length;++c){let u=i[c];if(u.isInterleavedBufferAttribute){let d=l/t;for(let f=0,p=u.count;f<p;f++)for(let y=0;y<t;y++){let x=u.getComponent(f,y);a.setComponent(f+d,y,x)}}else o.set(u.array,l);l+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function mh(i,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,o=0,a=Object.keys(i.attributes),l={},c={},u=[],d=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let v=0,M=a.length;v<M;v++){let b=a[v],L=i.attributes[b];l[b]=new L.constructor(new L.array.constructor(L.count*L.itemSize),L.itemSize,L.normalized);let T=i.morphAttributes[b];T&&(c[b]||(c[b]=[]),T.forEach((C,A)=>{let S=new C.array.constructor(C.count*C.itemSize);c[b][A]=new C.constructor(S,C.itemSize,C.normalized)}))}let p=e*.5,y=Math.log10(1/e),x=Math.pow(10,y),g=p*x;for(let v=0;v<r;v++){let M=n?n.getX(v):v,b="";for(let L=0,T=a.length;L<T;L++){let C=a[L],A=i.getAttribute(C),S=A.itemSize;for(let _=0;_<S;_++)b+=`${~~(A[d[_]](M)*x+g)},`}if(b in t)u.push(t[b]);else{for(let L=0,T=a.length;L<T;L++){let C=a[L],A=i.getAttribute(C),S=i.morphAttributes[C],_=A.itemSize,I=l[C],F=c[C];for(let U=0;U<_;U++){let O=d[U],G=f[U];if(I[G](o,A[O](M)),S)for(let z=0,K=S.length;z<K;z++)F[z][G](o,S[z][O](M))}}t[b]=o,u.push(o),o++}}let m=i.clone();for(let v in i.attributes){let M=l[v];if(m.setAttribute(v,new M.constructor(M.array.slice(0,o*M.itemSize),M.itemSize,M.normalized)),v in c)for(let b=0;b<c[v].length;b++){let L=c[v][b];m.morphAttributes[v][b]=new L.constructor(L.array.slice(0,o*L.itemSize),L.itemSize,L.normalized)}}return m.setIndex(u),m}function rs(i,e){let t=document.createElement("canvas");return t.width=i,t.height=e,[t,t.getContext("2d")]}function Or(i,e=1){let t=new Hs(i);return t.colorSpace=qt,t.wrapS=t.wrapT=bn,t.repeat.set(e,e),t.anisotropy=8,t}function Zy(i,e,t,n,s,r=2){for(let o=0;o<n;o++){i.fillStyle=s[Math.random()*s.length|0],i.globalAlpha=Math.random()*.5+.1;let a=Math.random()*r+.5;i.fillRect(Math.random()*e,Math.random()*t,a,a)}i.globalAlpha=1}function Hd(){let[i,e]=rs(128,128);e.clearRect(0,0,128,128),e.strokeStyle="#c9ccd0",e.lineWidth=3;for(let t=-128;t<256;t+=16)e.beginPath(),e.moveTo(t,0),e.lineTo(t+128,128),e.stroke(),e.beginPath(),e.moveTo(t+128,0),e.lineTo(t,128),e.stroke();return Or(i)}function Fr(i,e={}){let t=e.w||512,n=e.h||128,[s,r]=rs(t,n);e.bg&&(r.fillStyle=e.bg,r.fillRect(0,0,t,n)),r.fillStyle=e.color||"#f2f2f2",r.font=`900 ${e.size||64}px Impact, "Arial Black", sans-serif`,r.textAlign="center",r.textBaseline="middle";let o=String(i).split(`
`),a=(e.size||64)*1.1;o.forEach((c,u)=>r.fillText(c,t/2,n/2+(u-(o.length-1)/2)*a)),e.worn&&(r.globalCompositeOperation="destination-out",Zy(r,t,n,1800,["#000"],4),r.globalCompositeOperation="source-over");let l=Or(s);return l.wrapS=l.wrapT=_n,l}function Vd(){let[i,e]=rs(256,340);return e.fillStyle="#f7f3e8",e.fillRect(0,0,256,340),e.fillStyle="#b3121b",e.fillRect(0,0,256,70),e.fillStyle="#fff",e.font="900 46px Impact, sans-serif",e.textAlign="center",e.fillText("PREA",128,52),e.fillStyle="#111",e.font="700 22px Arial, sans-serif",["ZERO TOLERANCE","For real this time.","","Training Module","2 of 47","","Initial here: ____"].forEach((t,n)=>e.fillText(t,128,110+n*30)),Or(i)}var Ks=8;function Gd(){let[t,n]=rs(256*Ks,256);n.fillStyle="#fff",n.fillRect(0,0,256*Ks,256);for(let r=0;r<Ks;r++){let o=r*256+64,a=256*.44,l=(f,p=7)=>{n.fillStyle="#1a1210",n.beginPath(),n.ellipse(o+f,a,p*.8,p,0,0,6.28),n.fill()},c=f=>{n.strokeStyle="#2a1a12",n.lineWidth=6,n.lineCap="round",[-1,1].forEach(p=>{n.beginPath(),n.moveTo(o+p*30,a-18-f*p*-1),n.lineTo(o+p*9,a-16+f),n.stroke()})},u=(f,p)=>{n.strokeStyle="#4a2018",n.lineWidth=5,n.beginPath(),n.moveTo(o-f,256*.62),n.quadraticCurveTo(o,256*.62+p,o+f,256*.62),n.stroke()},d=f=>`rgba(25,18,14,${f})`;r===7?(l(-18,11),l(18,11),n.fillStyle="#fff",n.fillRect(o-20,a-3,4,4),n.fillRect(o+16,a-3,4,4),u(22,14)):(l(-17),l(17)),(r===1||r===4||r===5)&&c(8),r===0||r===3?u(14,-4):r!==7&&u(16,6),r===2&&(n.fillStyle=d(.75),n.beginPath(),n.ellipse(o,256*.68,46,34,0,0,3.14),n.fill()),r===3&&(n.fillStyle=d(.8),n.fillRect(o-10,256*.66,20,24)),r===4&&(n.fillStyle=d(.85),n.fillRect(o-24,256*.57,48,9)),r===5&&(n.fillStyle=d(.9),n.beginPath(),n.ellipse(o+22,a+20,4,7,0,0,6.28),n.fill(),n.font="900 16px Arial",n.textAlign="center",n.fillText("13",o,256*.3)),r===6&&(n.strokeStyle="rgba(120,40,40,0.8)",n.lineWidth=4,n.beginPath(),n.moveTo(o-34,a-22),n.lineTo(o-12,a+26),n.stroke(),c(4))}let s=Or(t);return s.wrapS=s.wrapT=_n,s}function Wd(){let[i,e]=rs(512,128);e.fillStyle="#fff",e.fillRect(0,0,512,128),e.fillStyle="rgba(15,15,15,0.9)",e.textAlign="center",e.textBaseline="middle",e.font="900 96px Impact, Arial Black, sans-serif",e.fillText("DOC",256,66),e.font="900 44px Impact, Arial Black, sans-serif",e.fillText("DOC",451,52),e.font="900 15px Arial Black, sans-serif",e.fillText("#"+(4e3+Math.floor(Math.random()*999)),451,92);let t=Or(i);return t.wrapS=t.wrapT=_n,t}function Xd(i){return Fr(i,{w:512,h:128,size:i.length>8?58:80,color:"#e8e2cf",bg:"#1b1f29"})}function qd(){let[i,e]=rs(4,128),t=e.createLinearGradient(0,0,0,128);return t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.2,"rgba(255,255,255,0.5)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,4,128),new Hs(i)}function Yd(){let[i,e]=rs(128,128),t=e.createRadialGradient(64,64,4,64,64,62);t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.6,"rgba(255,255,255,0.85)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t;for(let s=0;s<7;s++){let r=Math.random()*6.28,o=Math.random()*22;e.beginPath(),e.arc(64+Math.cos(r)*o,64+Math.sin(r)*o,26+Math.random()*18,0,6.28),e.fill()}let n=new Hs(i);return n.colorSpace=qt,n}var j={T:2,w:0,h:0,solid:null,rects:[],spawns:[],doors:[],lights:[],group:null};h.W=j;var ke=j.T,Zd=new ze,$y=new Vt,Jy=new Gt,Ky=new P,jy=new P(1,1,1),Nn=class{constructor(){this.geos=[]}add(e,t,n,s,r,o=0,a=0,l=0){let c=(e.index,e.clone());Zd.compose(Ky.set(t,n,s),$y.setFromEuler(Jy.set(a,o,l)),jy),c.applyMatrix4(Zd);let u=new xe(r),d=c.attributes.position.count,f=new Float32Array(d*3);for(let p=0;p<d;p++)f[p*3]=u.r,f[p*3+1]=u.g,f[p*3+2]=u.b;return c.setAttribute("color",new Lt(f,3)),this.geos.push(c),this}box(e,t,n,s,r,o,a,l=0){return this.add(new Pe(e,t,n),s,r,o,a,l)}cyl(e,t,n,s,r,o,a=0,l=0,c=0,u=12,d=e){return this.add(new tt(e,d,t,u),n,s,r,o,l,a,c)}build(e,t=!0){if(!this.geos.length)return null;let n=new fe(Ur(this.geos,!1),e);return n.castShadow=t,n.receiveShadow=!0,this.geos.forEach(s=>s.dispose()),n}};j.Batch=Nn;var Qy=new Ko,xh={};function yh(i,e){if(!xh[i]){let t=Qy.load(`assets/tex/${i}.jpg`);t.wrapS=t.wrapT=bn,t.anisotropy=8,e&&(t.colorSpace=qt),xh[i]=t}return xh[i]}function _h(i,e,t=16777215,n={}){let s=r=>{let o=r.clone();return o.repeat.set(e[0],e[1]),o.needsUpdate=!0,o};return new Oe(Object.assign({map:s(yh(i+"_diff",!0)),normalMap:s(yh(i+"_nor")),roughnessMap:s(yh(i+"_rough")),color:t,normalScale:new oe(1.2,1.2)},n))}j.pbrMat=_h;var Xt={};function ev(){Xt.ready||(Xt.paint=new Oe({vertexColors:!0,roughness:.55,metalness:.25}),Xt.matte=new Oe({vertexColors:!0,roughness:.9}),Xt.metal=new Oe({vertexColors:!0,roughness:.35,metalness:.8}),Xt.glow=new pt({vertexColors:!0,toneMapped:!1}),Xt.shaft=new pt({map:qd(),transparent:!0,opacity:.22,blending:Mn,depthWrite:!1,side:Ht,toneMapped:!1}),Xt.fence=new Oe({map:Hd(),alphaTest:.5,side:Ht,metalness:.6,roughness:.4}),Xt.ready=!0)}function tv(i,e,t,n,s,r=0){let o=Math.cos(r),a=Math.sin(r),l=(d,f)=>[t+d*o+f*a,n-d*a+f*o],c=(d,f,p,y,x,g=0,m=0)=>{let[v,M]=l(f,y);i.add(d,v,p,M,x,r,g,m)},u=.55;[-1,1].forEach(d=>[-1.9,1.9].forEach(f=>c(new tt(.62,.62,.5,16),d,.62,f,1447446,0,Math.PI/2))),[-1,1].forEach(d=>[-1.9,1.9].forEach(f=>c(new tt(.32,.32,.52,10),d,.62,f,10133670,0,Math.PI/2))),c(new Pe(1.6,.25,4.6),0,.7+u*.4,0,2236962),c(new Pe(2.1,.75,5.6),0,1.25+u,0,s),c(new Pe(2,.85,2),0,2.05+u,-.45,s),c(new Pe(1.9,.6,1.9),0,2.08+u,-.45,1779507),c(new Pe(1.8,.12,2.1),0,1.7+u,1.6,2763306),c(new Pe(2.3,.3,.25),0,1+u,-2.85,14212579),[-.7,-.25,.25,.7].forEach(d=>{let[f,p]=l(d,-1.1);e.box(.32,.12,.14,f,2.6+u,p,16774348,r)}),[-.8,.8].forEach(d=>{let[f,p]=l(d,-2.82);e.box(.35,.18,.06,f,1.38+u,p,16776166,r)}),[-.85,.85].forEach(d=>{let[f,p]=l(d,2.82);e.box(.3,.2,.06,f,1.4+u,p,16722458,r)})}function nv(i,e,t,n,s,r=0){let o=Math.cos(r),a=Math.sin(r),l=(u,d)=>[t+u*o+d*a,n-u*a+d*o],c=(u,d,f,p,y,x=0,g=0)=>{let[m,v]=l(d,p);i.add(u,m,f,v,y,r,x,g)};[-.8,.8].forEach(u=>[-1.4,1.4].forEach(d=>c(new tt(.34,.34,.25,12),u,.34,d,1315860,0,Math.PI/2))),c(new Pe(1.75,.6,4.3),0,.65,0,s),c(new Pe(1.55,.5,2.1),0,1.18,.2,s),c(new Pe(1.5,.42,2),0,1.2,.2,1779507),[-.6,.6].forEach(u=>{let[d,f]=l(u,-2.16);e.box(.3,.12,.05,d,.75,f,16776166,r)})}function xa(i,e,t="."){return Array.from({length:e},()=>Array(i).fill(t))}var De=i=>i*ke+ke/2,Ne=i=>i*ke+ke/2;function Tn(i,e,t,n,s,r,o){let a=new fe(new Ct(s,r),new Oe({map:Fr(e,o),transparent:!0,roughness:.8,depthWrite:!1}));a.rotation.x=-Math.PI/2,a.position.set(t,.02,n),a.receiveShadow=!0,i.add(a)}function En(i,e,t,n,s,r,o){let a=h.R.takeLight(i,e,t);return a.position.set(n,s,r),j.lights.push({L:a,base:e,kind:o,t:Math.random()*10}),a}function iv(i){let n=xa(44,32);for(let o=0;o<44;o++)n[0][o]=n[1][o]=n[2][o]="#",n[31][o]="F";for(let o=0;o<32;o++)n[o][0]=n[o][43]="F";[10,22,34].forEach(o=>{n[2][o]="S",n[2][o+1]="S"}),[12,22].forEach(o=>{n[o][0]="S",n[o][43]="S"});let s={w:44,h:32,g:n,start:[De(22),Ne(28)],vehicles:[],outdoor:!0,theme:{floor:"asphalt_02",floorScale:6,wall:"precast_concrete_wall",hdri:"suburban_parking_area",envI:.75,grade:{tint:[1.07,1,.92],sat:1.12,contrast:1.08}}},r=[9379101,2047887,1118481,15263976,7040885,3104047,13214247,5910150];return[8,15,22].forEach((o,a)=>{for(let l=3;l<41;l+=3){if(Math.random()<.18)continue;let c=Math.random()<.5;s.vehicles.push({truck:c,x:De(l),z:Ne(o+1),color:h.pick(r),ry:a===1?Math.PI:0})}}),s.vehicles.push({truck:!0,x:De(30),z:Ne(28),color:1920959,ry:Math.PI/2,mine:!0}),s.vehicles.push({truck:!0,x:De(38),z:Ne(28),color:1118481,ry:Math.PI/2}),s.decor=o=>{Tn(o,`COMPACT
CARS ONLY`,De(9),Ne(12),5,2.5,{size:70,color:"#f5f5f5",worn:!0}),Tn(o,"RESERVED: SGT",De(18),Ne(19),6,1.6,{size:72,color:"#ffd23a",worn:!0}),Tn(o,`${i.toUpperCase()}'S TRUCK
(BOTH SPOTS)`,De(30),Ne(25.3),7,2.6,{size:60,color:"#9fd0ff",worn:!0}),Tn(o,`RESERVED: C. ALANIZ
BIG BRO PARKING`,De(38),Ne(25.3),7,2.6,{size:56,color:"#ffd34d",worn:!0}),Tn(o,"FIRE LANE",De(22),Ne(5),7,1.8,{size:90,color:"#e33",worn:!0});let a=new fe(new Ct(14,1.4),new Oe({map:Fr("BIG TRUCK STATE CORRECTIONAL",{w:1024,h:102,size:76,color:"#f3efe2",bg:"#24324a"}),roughness:.6}));a.position.set(34,1.6,3*ke+.03),o.add(a)},s}function Qd(){let t=xa(38,26);for(let o=0;o<38;o++)t[0][o]=t[25][o]="#";for(let o=0;o<26;o++)t[o][0]=t[o][37]="#";let n=[],s=(o,a,l,c)=>{for(let u=1;u<37;u++)for(let d=o;d<=a;d++)t[d][u]=(u-1)%3===0?"#":".";for(let u=1;u<37;u++)t[l][u]=(u-1)%3===0?"#":"C";for(let u=2;u<37;u+=3)n.push({i:u,j:c?o+1:a-1,door:l,top:c})};s(1,3,4,!0),s(22,24,21,!1),[12,13].forEach(o=>{t[o][1]="S",t[o][36]="S"});let r={w:38,h:26,g:t,start:[De(19),Ne(13)],cells:n,tables:[],outdoor:!1,theme:{floor:"concrete_floor_worn_001",floorScale:5,wall:"concrete_block_wall",wallTint:15392710,stripe:3104680,hdri:"empty_warehouse_01",envI:.45,grade:{tint:[.95,1.02,.96],sat:1.05,contrast:1.18,vignette:.45}}};return[8,13,18].forEach(o=>[7,13,25,31].forEach(a=>r.tables.push([De(a),Ne(o)]))),r.decor=o=>{Tn(o,"IMU NORTH",De(19),Ne(9.5),6,2,{size:100,color:"#d8c79a",worn:!0}),Tn(o,`NO LOITERING
(YOU ARE LOITERING)`,De(19),Ne(17.5),7,2.2,{size:54,color:"#d8c79a",worn:!0}),[5,20].forEach(c=>{let u=new fe(new Ct(36*ke,.25),new Oe({color:12591130,roughness:.7}));u.rotation.x=-Math.PI/2,u.position.set(38*ke/2,.015,Ne(c)+(c===5?-.6:.6)),o.add(u)});let a=Vd(),l=new Oe({map:a,roughness:.8});[4,13,22,31].forEach(c=>{let u=new fe(new Ct(.9,1.2),l);u.position.set(De(c),1.3,5*ke+.03),o.add(u)})},r}function sv(){let t=xa(36,24);for(let o=0;o<36;o++)t[0][o]=t[23][o]="#";for(let o=0;o<24;o++)t[o][0]=t[o][35]="#";let n=[],s=[];for(let o=1;o<35;o++)for(let a=1;a<=3;a++)t[a][o]=(o-1)%3===0?"#":".";for(let o=1;o<35;o++)t[4][o]=(o-1)%3===0?"#":"C";for(let o=2;o<35;o+=3)s.push({i:o,j:2,door:4,top:!0,locked:!0});for(let o=1;o<35;o++)for(let a=20;a<=22;a++)t[a][o]=(o-1)%3===0?"#":".";for(let o=1;o<35;o++)t[19][o]=(o-1)%3===0?"#":"C";for(let o=2;o<35;o+=3)n.push({i:o,j:21,door:19,top:!1});[11,12].forEach(o=>{t[o][1]="S",t[o][34]="S"});let r={w:36,h:24,g:t,start:[De(18),Ne(14)],cells:s.concat(n),caged:s,tables:[],mode:"row",outdoor:!1,water:[[De(10),Ne(12),14,6],[De(25),Ne(11),10,5],[De(18),Ne(16),8,3]],theme:{floor:"damaged_concrete_floor",floorScale:5,wall:"concrete_wall_006",wallTint:12174536,stripe:7017492,hdri:"sepulchral_chapel_basement",envI:.6,grade:{tint:[.86,.98,1.08],sat:.85,contrast:1.25,vignette:.6}}};return r.decor=o=>{Tn(o,"KILLER ROW",De(18),Ne(8),9,2.4,{size:100,color:"#b8c6cc",worn:!0}),Tn(o,`DO NOT FEED
DO NOT CHAT
DO NOT BUY THE PAINTINGS`,De(18),Ne(18.5),8,3,{size:46,color:"#c43a3a",worn:!0})},r}var gt=2830133,Qn=14212579,zr=1381653,Mh=[1118481,11739162,1851294,14198048,3112242];function bh(i,e,t,n,s,r,o=!1){i.cyl(.025,s,e,t,n,Qn,o?Math.PI/2:0,0,o?0:Math.PI/2,8);for(let a=-1;a<=1;a+=2)for(let l=0;l<r;l++){let c=(s/2-.25-l*.07)*a,u=.23-l*.025;i.cyl(u,.06,o?e:e+c,t,o?n+c:n,Mh[l%Mh.length],o?Math.PI/2:0,0,o?0:Math.PI/2,16)}}function $d(i,e,t,n,s){e.box(.34,.1,1.25,t,.46,n,zr),i.box(.08,.42,.08,t,.21,n-.5,gt).box(.08,.42,.08,t,.21,n+.45,gt).box(.6,.05,.08,t,.03,n-.5,gt).box(.6,.05,.08,t,.03,n+.45,gt);for(let r of[-.55,.55])i.box(.08,1.15,.08,t+r,.58,n-.62,gt),i.box(.12,.05,.12,t+r,1.05,n-.55,Qn);bh(i,t,1.1,n-.55,2.2,s),j.rects.push({x:t,z:n-.1,hw:1,hd:.8})}function rv(i,e,t,n,s){e.box(.34,.1,.5,t,.46,n+.35,zr),e.add(new Pe(.34,.1,.95),t,.75,n-.15,zr,0,-.62,0),i.box(.08,.45,.08,t,.22,n+.45,gt).box(.08,.95,.08,t,.47,n-.45,gt);for(let r of[-.55,.55])i.box(.08,1.5,.08,t+r,.75,n-.6,gt);bh(i,t,1.42,n-.55,2.2,s),j.rects.push({x:t,z:n,hw:1,hd:.8})}function Jd(i,e,t,n){for(let s of[-.65,.65])for(let r of[-.55,.55])i.box(.09,2.4,.09,t+s,1.2,n+r,gt);for(let s of[-.55,.55])i.box(1.4,.09,.09,t,2.38,n+s,gt);for(let s of[-.65,.65])i.box(.09,.09,1.2,t+s,2.38,n,gt),i.box(.09,.09,1.2,t+s,.05,n,gt),i.box(.06,.06,1.1,t+s,.75,n,Qn);i.cyl(.02,1.4,t,2.45,n+.62,Qn,0,0,Math.PI/2,8),e.box(1.6,.03,1.6,t,.015,n,2760726),bh(i,t,1.42,n-.5,2.3,4),j.rects.push({x:t,z:n,hw:.85,hd:.75})}function ov(i,e,t,n){i.box(3.4,.08,.5,t,.55,n,gt).box(3.4,.08,.5,t,.9,n-.05,gt);for(let s of[-1.6,0,1.6])i.box(.08,.9,.5,t+s,.45,n,gt);for(let s=0;s<8;s++)for(let[r,o]of[[.65,.08],[1,.03]]){let a=t-1.45+s*.41,l=.06+s*.008;i.cyl(.018,.3,a,r,n+o-.08,Qn,0,0,Math.PI/2,6);for(let c of[-.14,.14])i.cyl(l,.06,a+c,r,n+o-.08,1579034,0,0,Math.PI/2,6)}j.rects.push({x:t,z:n,hw:1.8,hd:.4})}function av(i,e,t,n){i.box(1.1,.08,1.7,t,.04,n,gt),i.box(.1,.42,.1,t,.25,n+.35,gt),e.box(.5,.1,.45,t,.5,n+.35,zr),i.box(.1,1.3,.1,t,.68,n+.7,gt),e.box(.5,.75,.1,t,1,n+.62,zr);for(let s of[-1,1])i.box(.07,.07,.75,t+s*.38,1,n+.25,gt),i.box(.07,.3,.07,t+s*.38,.88,n-.12,gt),i.cyl(.03,.22,t+s*.3,.75,n-.12,2236962,0,0,Math.PI/2,8);i.box(.1,1.9,.1,t-.25,.95,n-.65,gt).box(.1,1.9,.1,t+.25,.95,n-.65,gt).box(.6,.1,.12,t,1.9,n-.65,gt);for(let s=0;s<14;s++)i.box(.38,.05,.2,t,.12+s*.058,n-.65,s===9?11739162:7172986);i.cyl(.012,1.5,t-.08,.85,n-.65,Qn,0,0,0,6).cyl(.012,1.5,t+.08,.85,n-.65,Qn,0,0,0,6),j.rects.push({x:t,z:n,hw:.65,hd:.95})}function lv(i,e,t,n){for(let o=0;o<=3;o++)i.box(.1,2.7,.1,t-3*1.3/2+o*1.3,1.35,n,gt);i.box(3*1.3+.1,.1,.1,t,2.7,n,gt);for(let o=0;o<3;o++)i.cyl(.025,1.3-.1,t-3*1.3/2+(o+.5)*1.3,2.45,n+.15,Qn,0,0,Math.PI/2,8);for(let o of[-.28,.28])i.box(.06,.06,.6,t+3*1.3/2+.5+o,1.2,n,Qn).box(.08,1.2,.08,t+3*1.3/2+.5+o,.6,n-.28,gt);j.rects.push({x:t+.3,z:n,hw:3*1.3/2+.7,hd:.3})}function Kd(i,e,t){i.box(.1,1.4,.1,e,.7,t,gt).box(.8,.06,.8,e,.03,t,gt);for(let n=0;n<6;n++){let s=n*Math.PI/3;i.cyl(.03,.3,e+Math.cos(s)*.15,.3+n%3*.4,t+Math.sin(s)*.15,Qn,0,-s,Math.PI/2,6),i.cyl(.23,.06,e+Math.cos(s)*.3,.3+n%3*.4,t+Math.sin(s)*.3,Mh[n%4],0,-s,Math.PI/2,16)}j.rects.push({x:e,z:t,hw:.5,hd:.5})}function cv(i){let n=xa(44,30);for(let r=0;r<44;r++)n[0][r]=n[1][r]=n[2][r]="#",n[29][r]="F";for(let r=0;r<30;r++)n[r][0]=n[r][43]="F";[8,20,32].forEach(r=>{n[2][r]="S",n[2][r+1]="S"}),[14,15].forEach(r=>{n[r][0]="S",n[r][43]="S"});let s={w:44,h:30,g:n,start:[De(20),Ne(24)],outdoor:!0,mode:"yard",tables:[],theme:{floor:"asphalt_02",floorScale:7,floorTint:14209732,wall:"precast_concrete_wall",wallTint:14274488,stripe:3104680,hdri:"suburban_parking_area",envI:.9,grade:{tint:[1.04,1,.95],sat:1.12,contrast:1.08}},lifters:[],gym:{x0:52,x1:84,z0:9,z1:31}};return s.lifters=[[57,15],[63.5,15],[70,15],[58,23.5],[66,23.5],[76,24.5],[80,15]],[[14,20],[26,20]].forEach(([r,o])=>s.tables.push([De(r),Ne(o)])),s.decor=r=>{let o=new Nn,a=new Nn,l=new Nn,c=new fe(new Ct(32,22),new Oe({color:1776671,roughness:.95}));c.rotation.x=-Math.PI/2,c.position.set(68,.012,20),c.receiveShadow=!0,r.add(c);for(let[d,f,p,y]of[[68,9,32,.15],[68,31,32,.15],[52,20,.15,22],[84,20,.15,22]])l.box(p,.02,y,d,.02,f,16765498);$d(o,a,57,15,3),$d(o,a,63.5,15,4),rv(o,a,70,15,2),av(o,a,79,15),Jd(o,a,58,23.5),Jd(o,a,65,23.5),ov(o,a,73,28.5),lv(o,a,74,21),Kd(o,83,26),Kd(o,53.5,28);for(let[d,f,p,y]of[[24,13,28,.12],[10,27,.12,28],[38,27,.12,28],[24,19,8,.12],[20,16,.12,6],[28,16,.12,6]])l.box(p,.02,y,d,.02,f,15921906);o.box(.15,3,.15,24,1.5,9.6,2767466).box(1.8,1.05,.06,24,3.05,10,15921906),o.add(new wn(.23,.02,6,16),24,2.75,10.35,16734746,0,Math.PI/2,0),j.rects.push({x:24,z:9.6,hw:.3,hd:.3}),a.box(6,.45,.7,44,.22,7,9077880),j.rects.push({x:44,z:7,hw:3,hd:.4}),r.add(o.build(Xt.metal),a.build(Xt.paint),l.build(Xt.matte,!1)),Tn(r,"WEIGHT PIT",68,11,7,1.6,{size:90,color:"#ffd23a",worn:!0}),Tn(r,`NO SPOTTING
WITHOUT CONSENT FORM`,68,32.5,8,2.4,{size:54,color:"#d8c79a",worn:!0}),Tn(r,"REC YARD",24,34,7,2,{size:90,color:"#d8c79a",worn:!0});let u=new fe(new Ct(6.4,2),new Oe({map:Fr(`YARD RECORDS
BENCH 405 . C. ALANIZ
SQUAT 585 . C. ALANIZ
CURLS . C. ALANIZ (IN THE SQUAT RACK)`,{w:1024,h:320,size:46,color:"#f3efe2",bg:"#1d2a40"}),roughness:.6}));u.position.set(68,1.5,3*ke+.03),r.add(u)},s}function hv(i){let e=Qd();e.mode="night",e.theme=Object.assign({},e.theme,{hdri:"sepulchral_chapel_basement",envI:.08,grade:{tint:[.85,.95,1.12],sat:.7,contrast:1.3,vignette:.75}}),e.scares=[[10,12],[19,9],[28,15],[33,11],[6,16],[24,18],[15,14]].map(([n,s])=>({x:De(n),z:Ne(s),done:!1}));let t=e.decor;return e.decor=n=>{t(n),Tn(n,`LIGHTS OUT
2300 - 0600`,De(19),Ne(13),6,2.4,{size:70,color:"#7fb0ff",worn:!0})},e}j.BUILDERS={lot:iv,tier:Qd,yard:cv,night:hv,row:sv};j.load=function(i,e){j.alarmT=0,j.hemiBase=null,j.halo=null,j.muzzle=null,ev(),j.group&&(h.R.scene.remove(j.group),j.group.traverse(x=>{x.geometry&&x.geometry.dispose()})),j.group=new at,j.lights=[],j.rects=[],j.spawns=[],j.doors=[],h.R.resetLights(),h.R.scene.add(j.group);let t=j.BUILDERS[i](e);j.def=t,j.w=t.w,j.h=t.h,j.outdoor=t.outdoor,j.solid=new Uint8Array(t.w*t.h);let n=2.4,s=t.h,r=t.theme,o=r.floorScale,a=new fe(new Ct(t.w*ke,t.h*ke),_h(r.floor,[t.w*ke/o,t.h*ke/o],r.floorTint||16777215));a.rotation.x=-Math.PI/2,a.position.set(t.w*ke/2,0,t.h*ke/2),a.receiveShadow=!0,j.group.add(a);let l=new fe(new Ct(400,400),new Oe({color:t.outdoor?4872754:1118740,roughness:1}));l.rotation.x=-Math.PI/2,l.position.set(t.w*ke/2,-.02,t.h*ke/2),l.receiveShadow=!0,j.group.add(l);let c=new Nn,u=new Nn,d=new Nn,f=new Nn,p=new Nn,y=[];for(let x=0;x<t.h;x++)for(let g=0;g<t.w;g++){let m=t.g[x][g],v=De(g),M=Ne(x);if(m==="#")j.solid[x*t.w+g]=1,c.box(ke,n,ke,v,n/2,M,16777215),u.box(ke+.02,.08,ke+.02,v,n+.04,M,3882306),r.stripe&&u.box(ke+.02,.16,ke+.02,v,1.15,M,r.stripe);else if(m==="F"){j.solid[x*t.w+g]=1;let b=x===0||x===t.h-1,L=new Ct(ke,n);L.rotateY(b?0:Math.PI/2),L.translate(v,n/2,M),y.push(L),d.cyl(.06,n+.3,v-(b?ke/2:0),(n+.3)/2,M-(b?0:ke/2),9080726);for(let T=0;T<3;T++)d.add(new wn(.28,.025,4,10),v,n+.25,M+(b?0:(T-1)*.6),13620184,b?0:Math.PI/2,0,0)}else m==="S"?j.spawns.push({x:v,z:M,kind:"gate"}):m==="C"&&(j.solid[x*t.w+g]=1)}if(t.vehicles)for(let x of t.vehicles){(x.truck?tv:nv)(f,p,x.x,x.z,x.color,x.ry);let g=Math.abs(Math.sin(x.ry))>.5,m=x.truck?1.15:.95,v=x.truck?2.9:2.3;j.rects.push({x:x.x,z:x.z,hw:g?v:m,hd:g?m:v}),x.mine&&En(16774096,6,10,x.x,3.2,x.z)}if(t.tables)for(let[x,g]of t.tables){d.cyl(.95,.08,x,.78,g,10134443,0,0,0,20),d.cyl(.12,.78,x,.39,g,7173243);for(let m=0;m<4;m++){let v=m*Math.PI/2+Math.PI/4;d.cyl(.24,.06,x+Math.cos(v)*1.25,.46,g+Math.sin(v)*1.25,10134443,0,0,0,12),d.cyl(.06,.46,x+Math.cos(v)*1.25,.23,g+Math.sin(v)*1.25,7173243)}j.rects.push({x,z:g,hw:.9,hd:.9})}if(t.cells)for(let x of t.cells){let g=new Nn;for(let M=0;M<12;M++)g.cyl(.035,n,-ke+.17+M*.33,n/2,0,6120555,0,0,0,6);g.box(ke*2,.08,.08,0,n-.15,0,6120555).box(ke*2,.08,.08,0,.9,0,6120555);let m=g.build(Xt.metal),v=(De(x.i)+De(x.i+1))/2;m.position.set(v,0,Ne(x.door)),j.group.add(m),f.box(1,.45,1.9,De(x.i)-.5,.22,Ne(x.top?2:t.h-3),8023901),d.cyl(.25,.45,De(x.i+1)+.4,.22,Ne(x.top?1:t.h-2)+(x.top?.2:-.2),12107976,0,0,0,10),x.locked||j.doors.push({mesh:m,x0:v,cell:x,open:0,opening:!1,spawn:{x:De(x.i+1),z:Ne(x.j),kind:"cell"}})}if(t.water)for(let[x,g,m,v]of t.water){let M=new fe(new Ct(m,v),new Oe({color:4875888,roughness:.03,metalness:.85,transparent:!0,opacity:.5,envMapIntensity:2.2}));M.rotation.x=-Math.PI/2,M.position.set(x,.03,g),M.receiveShadow=!0,j.group.add(M)}h.R.flashOn=t.mode==="night",h.FX.mistIM&&(h.FX.mistIM.material.opacity=t.mode==="night"?.075:.032),t.mode==="yard"?(h.R.hemi.color.set(13624063),h.R.hemi.groundColor.set(6969924),h.R.hemi.intensity=1.35,h.R.sun.color.set(16773592),h.R.sun.intensity=3.6,h.R.scene.background=new xe(8038104),h.R.scene.fog=new Ui(10271712,70,160),[[24,8],[44,8]].forEach(([x,g])=>{d.cyl(.14,8,De(x),4,Ne(g),6054248),p.box(1.6,.25,.6,De(x),8,Ne(g),16773312)}),d.box(3,7,3,De(2.5),3.5,Ne(s-3.5),7040885).box(4,.3,4,De(2.5),7.2,Ne(s-3.5),3882306),p.box(3.2,.9,3.2,De(2.5),6.4,Ne(s-3.5),10473727)):t.mode==="night"?(h.R.hemi.color.set(5925530),h.R.hemi.groundColor.set(789524),h.R.hemi.intensity=.16,h.R.sun.color.set(9086207),h.R.sun.intensity=.3,j.halo=En(11058431,9,11,0,2.8,0,"halo"),j.muzzle=En(16767392,0,12,0,-50,0,"muzzle"),h.R.scene.background=new xe(131846),h.R.scene.fog=new Ui(131846,16,42),En(2162528,2.2,9,De(2),2.6,Ne(12.5),"flicker"),En(2162528,2.2,9,De(t.w-3),2.6,Ne(12.5),"flicker"),En(16767136,3,7,De(29),2.2,Ne(2),"flicker"),[1,t.w-2].forEach(x=>{p.box(.6,.25,.08,De(x)+(x===1?.95:-.95),2.6,Ne(12.5),2162528),En(16718362,0,16,De(x)+(x===1?2:-2),3,Ne(12.5),"alarm")})):t.mode==="row"?(h.R.hemi.color.set(12113128),h.R.hemi.groundColor.set(2765366),h.R.hemi.intensity=.75,h.R.sun.color.set(11850988),h.R.sun.intensity=1.5,h.R.scene.background=new xe(1845808),h.R.scene.fog=new Ui(3820628,22,70),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,De(g),n+.1,Ne(x)+(x===4?.8:-.8),13625087)}),[[8,9],[27,9],[8,15],[27,15],[18,12]].forEach(([x,g],m)=>En(12573951,22,24,De(x),4,Ne(g),m===1?"flicker":"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,De(x),n+.3,Ne(12),16719904),En(16718362,0,16,De(x)+(x===1?2:-2),3,Ne(12),"alarm")})):t.outdoor?(h.R.hemi.color.set(12374783),h.R.hemi.groundColor.set(5917242),h.R.hemi.intensity=1.25,h.R.sun.color.set(16762250),h.R.sun.intensity=3.4,h.R.scene.background=new xe(2831696),h.R.scene.fog=new Ui(2831696,60,140),[[8,13],[36,13],[8,20],[36,20]].forEach(([x,g])=>{let m=De(x),v=Ne(g);d.cyl(.12,6,m,3,v,6054248),p.box(1.2,.2,.5,m,6,v,16757594)}),En(16752704,10,20,De(8),5.5,Ne(16.5),"sodium"),En(16752704,10,20,De(36),5.5,Ne(16.5),"sodium")):(h.R.hemi.color.set(14542591),h.R.hemi.groundColor.set(2762274),h.R.hemi.intensity=.3,h.R.sun.color.set(13623551),h.R.sun.intensity=.8,h.R.scene.background=new xe(723983),h.R.scene.fog=new Ui(723983,200,400),[4,t.h-5].forEach(x=>{for(let g=3;g<t.w-3;g+=6)p.box(2.4,.1,.3,De(g),n+.1,Ne(x)+(x===4?.8:-.8),15266047)}),[[9,9],[28,9],[9,17],[28,17]].forEach(([x,g])=>En(14937343,12,22,De(x),4,Ne(g),"fluoro")),[1,t.w-2].forEach(x=>{p.box(.4,.4,.4,De(x),n+.3,Ne(12.5),16719904),En(16718362,0,16,De(x)+(x===1?2:-2),3,Ne(12.5),"alarm")})),h.R.setEnv(r.hdri),h.R.scene.environmentIntensity=r.envI,h.R.setGrade(r.grade);for(let x of j.lights){if(x.kind!=="fluoro"&&x.kind!=="sodium"&&x.kind!=="flicker")continue;let g=x.L.position.y,m=new fe(new tt(.5,2.6,g,20,1,!0),Xt.shaft.clone());m.material.color.set(x.L.color).multiplyScalar(.6),m.position.set(x.L.position.x,g/2,x.L.position.z),j.group.add(m)}if(uv(t),[c.build(_h(r.wall,[1,1.2],r.wallTint||16777215)),u.build(Xt.matte),d.build(Xt.metal),f.build(Xt.paint),p.build(Xt.glow,!1)].forEach(x=>x&&j.group.add(x)),y.length){let x=new fe(Ur(y),Xt.fence);x.castShadow=!0,j.group.add(x)}t.decor&&t.decor(j.group);for(let x of j.rects)for(let g=0;g<t.h;g++)for(let m=0;m<t.w;m++)Math.abs(De(m)-x.x)<x.hw+.2&&Math.abs(Ne(g)-x.z)<x.hd+.2&&(j.solid[g*t.w+m]=1);return j.dist=new Int16Array(t.w*t.h),j.flowT=0,h.R.precompile(),t};j.openDoor=function(i){if(i.opening)return;i.opening=!0;let e=i.cell.door,t=i.cell.i;j.solid[e*j.w+t+1]=0,h.audio.play("alarm",.6)};function uv(i){let e=h.R.q.dust;if(j.dust=null,!e)return;let t=new Float32Array(e*3);for(let r=0;r<e;r++)t[r*3]=h.rand(-20,20),t[r*3+1]=h.rand(.2,4),t[r*3+2]=h.rand(-14,14);let n=new Nt;n.setAttribute("position",new Lt(t,3));let s=new Bo(n,new Sr({size:.07,color:i.outdoor?16767392:14214399,transparent:!0,opacity:.55,blending:Mn,depthWrite:!1}));s.frustumCulled=!1,j.group.add(s),j.dust=s}var dv=new xe(16715792);j.update=function(i,e){if(j.alarmT>0){j.alarmT-=i,j.hemiBase||(j.hemiBase=h.R.hemi.color.clone());let t=.5+.5*Math.sin(e*9);h.R.hemi.color.copy(j.hemiBase).lerp(dv,t*.6)}else j.hemiBase&&(h.R.hemi.color.copy(j.hemiBase),j.hemiBase=null);if(j.dust){let t=j.dust.geometry.attributes.position,n=t.array,s=h.R.camTarget.x,r=h.R.camTarget.z;for(let o=0;o<n.length;o+=3)n[o]+=Math.sin(e*.3+o)*i*.25,n[o+1]+=Math.sin(e*.5+o*.7)*i*.08,n[o+2]+=i*.15,n[o]-s>20?n[o]-=40:n[o]-s<-20&&(n[o]+=40),n[o+2]-r>14?n[o+2]-=28:n[o+2]-r<-14&&(n[o+2]+=28);t.needsUpdate=!0}for(let t of j.doors)t.opening&&t.open<1&&(t.open=Math.min(1,t.open+i*1.4),t.mesh.position.x=t.x0-t.open*ke);for(let t of j.lights)t.t+=i,t.kind==="fluoro"?t.L.intensity=t.base*(Math.random()<.01?.2:1):t.kind==="flicker"?t.L.intensity=t.base*(Math.sin(e*23)>.6||Math.random()<.08?.1:1):t.kind==="alarm"&&(t.L.intensity=Math.max(j.alarm||0,j.alarmT>0?3:0)*(.5+.5*Math.sin(e*8))*6)};j.tileSolid=(i,e)=>i<0||e<0||i>=j.w||e>=j.h||j.solid[e*j.w+i]===1;j.wallAt=(i,e)=>{let t=Math.floor(i/ke),n=Math.floor(e/ke);if(t<0||n<0||t>=j.w||n>=j.h)return!0;let s=j.def.g[n][t];return(s==="#"||s==="F"||s==="C")&&j.solid[n*j.w+t]===1};j.rectAt=(i,e)=>{for(let t of j.rects)if(Math.abs(i-t.x)<t.hw&&Math.abs(e-t.z)<t.hd)return!0;return!1};j.blocked=(i,e)=>j.wallAt(i,e)||j.rectAt(i,e);j.collide=function(i){let e=i.r,t=Math.floor((i.x-e)/ke),n=Math.floor((i.x+e)/ke),s=Math.floor((i.z-e)/ke),r=Math.floor((i.z+e)/ke);for(let o=s;o<=r;o++)for(let a=t;a<=n;a++)j.wallAt(a*ke+1,o*ke+1)&&jd(i,a*ke+ke/2,o*ke+ke/2,ke/2,ke/2);for(let o of j.rects)Math.abs(i.x-o.x)<o.hw+e&&Math.abs(i.z-o.z)<o.hd+e&&jd(i,o.x,o.z,o.hw,o.hd)};function jd(i,e,t,n,s){let r=h.clamp(i.x,e-n,e+n),o=h.clamp(i.z,t-s,t+s),a=i.x-r,l=i.z-o,c=a*a+l*l;if(c>=i.r*i.r)return;if(c<1e-6){let f=n-Math.abs(i.x-e),p=s-Math.abs(i.z-t);f<p?i.x+=Math.sign(i.x-e||1)*(f+i.r):i.z+=Math.sign(i.z-t||1)*(p+i.r);return}let u=Math.sqrt(c),d=i.r-u;i.x+=a/u*d,i.z+=l/u*d}j.los=function(i,e,t,n){let s=t-i,r=n-e,o=Math.ceil(Math.hypot(s,r)/.5);for(let a=1;a<o;a++)if(j.blocked(i+s*a/o,e+r*a/o))return!1;return!0};var vh=new Int32Array(64*64);j.buildFlow=function(i){let e=j.w,t=j.h,n=j.dist;n.fill(-1);let s=0,r=0;for(let o of i){let a=h.clamp(Math.floor(o.x/ke),0,e-1),l=h.clamp(Math.floor(o.z/ke),0,t-1),c=l*e+a;n[c]!==0&&(n[c]=0,vh[r++]=c)}for(;s<r;){let o=vh[s++],a=o%e,l=o/e|0,c=n[o]+1;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++){if(!d&&!u)continue;let f=a+d,p=l+u;if(j.tileSolid(f,p)||d&&u&&(j.tileSolid(a+d,l)||j.tileSolid(a,l+u)))continue;let y=p*e+f;n[y]===-1&&(n[y]=c,vh[r++]=y)}}};j.flowDir=function(i,e,t){let n=j.w,s=Math.floor(i/ke),r=Math.floor(e/ke);if(s<0||r<0||s>=n||r>=j.h)return!1;let o=j.dist[r*n+s];if(o<=0)return!1;let a=o,l=0,c=0;for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){let p=s+f,y=r+d;if(j.tileSolid(p,y)||f&&d&&(j.tileSolid(s+f,r)||j.tileSolid(s,r+d)))continue;let x=j.dist[y*n+p];x>=0&&x<a&&(a=x,l=f,c=d)}if(a===o)return!1;t.x=De(s+l)-i,t.z=Ne(r+c)-e;let u=Math.hypot(t.x,t.z)||1;return t.x/=u,t.z/=u,!0};var te={};h.FX=te;var Fi=new ze,ya=new Vt,va=new P,_a=new P,os=new xe,Sh=new Gt,Ma=class{constructor(e,t,n,s){this.max=t,this.n=0,this.p=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.size=new Float32Array(t),this.col=new Uint32Array(t),this.grav=new Float32Array(t),this.im=new rn(s,n,t),this.im.instanceMatrix.setUsage(qs),this.im.setColorAt(0,os.set(1,1,1)),this.im.frustumCulled=!1,this.im.count=0,e.add(this.im)}spawn(e,t,n,s,r,o,a,l,c,u=1){let d=this.n;return d>=this.max?d=Math.random()*this.max|0:this.n++,this.p[d*3]=e,this.p[d*3+1]=t,this.p[d*3+2]=n,this.vel[d*3]=s,this.vel[d*3+1]=r,this.vel[d*3+2]=o,this.life[d]=this.maxLife[d]=a,this.size[d]=l,this.col[d]=c,this.grav[d]=u,d}update(e,t){let n=0;for(;n<this.n;){if(this.life[n]-=e,this.life[n]<=0){this.kill(n);continue}let s=n*3;this.vel[s+1]-=18*this.grav[n]*e,this.p[s]+=this.vel[s]*e,this.p[s+1]+=this.vel[s+1]*e,this.p[s+2]+=this.vel[s+2]*e,this.p[s+1]<.02&&(t&&this.vel[s+1]<-2&&t(this.p[s],this.p[s+2],this.col[n],this.size[n]),this.p[s+1]=.02,this.vel[s+1]*=-.25,this.vel[s]*=.5,this.vel[s+2]*=.5);let r=this.life[n]/this.maxLife[n],o=this.size[n]*(.4+.6*r);Fi.compose(va.set(this.p[s],this.p[s+1],this.p[s+2]),ya.identity(),_a.set(o,o,o)),this.im.setMatrixAt(n,Fi),this.im.setColorAt(n,os.setHex(this.col[n])),n++}this.im.count=this.n,this.im.instanceMatrix.needsUpdate=!0,this.im.instanceColor&&(this.im.instanceColor.needsUpdate=!0)}kill(e){let t=--this.n;if(e!==t){for(let n=0;n<3;n++)this.p[e*3+n]=this.p[t*3+n],this.vel[e*3+n]=this.vel[t*3+n];this.life[e]=this.life[t],this.maxLife[e]=this.maxLife[t],this.size[e]=this.size[t],this.col[e]=this.col[t],this.grav[e]=this.grav[t]}}clear(){this.n=0,this.im.count=0}};te.init=function(i){let e=h.R.q;te.solid=new Ma(i,e.particles,new Oe({roughness:.4}),new Pe(1,1,1)),te.glow=new Ma(i,Math.floor(e.particles/2),new pt({toneMapped:!1}),new Pe(1,1,1)),te.cloudMax=160,te.clouds=[],te.cloudIM=new rn(new Er(1,1),new pt({color:16777215,transparent:!0,opacity:.22,depthWrite:!1}),te.cloudMax),te.cloudIM.frustumCulled=!1,te.cloudIM.count=0,te.cloudIM.setColorAt(0,os.set(1,1,1)),i.add(te.cloudIM),te.mistMax=220,te.mists=[],te.mistIM=new rn(new Er(1,2),new pt({color:14676735,transparent:!0,opacity:.032,depthWrite:!1}),te.mistMax),te.mistIM.frustumCulled=!1,te.mistIM.count=0,te.mistIM.setColorAt(0,os.set(1,1,1)),i.add(te.mistIM),te.decalMax=e.decals,te.decalN=0,te.decalHead=0,te.decalIM=new rn(new Ct(1,1).rotateX(-Math.PI/2),new Oe({map:Yd(),transparent:!0,depthWrite:!1,roughness:.15,metalness:.1,polygonOffset:!0,polygonOffsetFactor:-2}),te.decalMax),te.decalIM.frustumCulled=!1,te.decalIM.count=0,te.decalIM.receiveShadow=!0,te.decalIM.setColorAt(0,os.set(1,1,1)),i.add(te.decalIM),te.floatEl=document.getElementById("floaters"),te.floaters=[]};te.reset=function(){te.solid.clear(),te.glow.clear(),te.clouds.length=0,te.cloudIM.count=0,te.mists.length=0,te.mistIM.count=0,te.decalN=0,te.decalHead=0,te.decalIM.count=0;for(let i of te.floaters)i.el.remove();te.floaters.length=0};te.decal=function(i,e,t,n){let s=te.decalHead;te.decalHead=(te.decalHead+1)%te.decalMax,te.decalN=Math.min(te.decalN+1,te.decalMax),Fi.compose(va.set(i,.012+s%50*4e-4,e),ya.setFromEuler(Sh.set(0,Math.random()*6.28,0)),_a.set(t,1,t*h.rand(.7,1.2))),te.decalIM.setMatrixAt(s,Fi),te.decalIM.setColorAt(s,os.setHex(n)),te.decalIM.count=te.decalN,te.decalIM.instanceMatrix.needsUpdate=!0,te.decalIM.instanceColor.needsUpdate=!0};var fv=(i,e,t,n)=>{h.settings.gore&&Math.random()<.35&&te.decal(i,e,n*6+.2,t)};te.blood=function(i,e,t,n,s,r=10){h.settings.gore||(r=Math.ceil(r/4));let o=h.settings.gore?9046538:14538440;for(let a=0;a<r;a++)te.solid.spawn(i,e,t,n*h.rand(2,6)+h.rand(-2,2),h.rand(2,6),s*h.rand(2,6)+h.rand(-2,2),h.rand(.5,1.1),h.rand(.05,.12),o)};te.teeth=function(i,e,t){if(h.settings.gore)for(let n=0;n<2;n++)te.solid.spawn(i,e,t,h.rand(-3,3),h.rand(4,7),h.rand(-3,3),1.5,.05,16775400)};te.sparks=function(i,e,t,n=8,s=16765562){for(let r=0;r<n;r++)te.glow.spawn(i,e,t,h.rand(-6,6),h.rand(1,7),h.rand(-6,6),h.rand(.15,.4),h.rand(.04,.08),s,.6)};te.spit=function(i,e,t,n,s){for(let r=0;r<6;r++)te.solid.spawn(i,e,t,n*h.rand(5,9)+h.rand(-1,1),h.rand(1,3),s*h.rand(5,9)+h.rand(-1,1),.7,.05,14279861)};te.splash=function(i,e,t,n=14){for(let s=0;s<n;s++)te.solid.spawn(i,.3,e,h.rand(-4,4),h.rand(2,5),h.rand(-4,4),.6,h.rand(.05,.1),t);te.decal(i,e,1.6,t)};te.cloud=function(i,e,t,n,s,r=.5,o=16742960){te.clouds.length>=te.cloudMax&&te.clouds.shift(),te.clouds.push({x:i,y:e,z:t,vx:n,vz:s,s:r,t:0,max:h.rand(1,1.6),col:o})};te.mist=function(i,e,t,n,s,r=.5){te.mists.length>=te.mistMax&&te.mists.shift(),te.mists.push({x:i,y:e,z:t,vx:n,vz:s,s:r*1.5,t:0,max:h.rand(1.6,2.4),seed:Math.random()*6.28,spin:h.rand(-2,2)})};te.float=function(i,e,t,n,s="#fff",r=15,o=1.6){te.floaters.length>=14&&te.floaters.shift().el.remove();let a=document.createElement("div");a.className="floater",a.textContent=n,a.style.color=s,a.style.fontSize=Math.round(r*(innerHeight<560?.72:.85))+"px",te.floatEl.appendChild(a),te.floaters.push({el:a,x:i,y:e,z:t,t:o,max:o,w:a.offsetWidth})};te.update=function(i){te.solid.update(i,fv),te.glow.update(i);let e=0;for(let t=te.clouds.length-1;t>=0;t--){let n=te.clouds[t];if(n.t+=i,n.t>=n.max){te.clouds.splice(t,1);continue}n.x+=n.vx*i,n.z+=n.vz*i,n.vx*=.9,n.vz*=.9,n.y+=i*.3;let s=n.s*(1+n.t*2.2)*(1-Math.pow(n.t/n.max,3));Fi.compose(va.set(n.x,n.y,n.z),ya.identity(),_a.set(s,s*.7,s)),te.cloudIM.setColorAt(e,os.setHex(n.col)),te.cloudIM.setMatrixAt(e++,Fi)}te.cloudIM.count=e,te.cloudIM.instanceMatrix.needsUpdate=!0,te.cloudIM.instanceColor&&(te.cloudIM.instanceColor.needsUpdate=!0),e=0;for(let t=te.mists.length-1;t>=0;t--){let n=te.mists[t];if(n.t+=i,n.t>=n.max){te.mists.splice(t,1);continue}let s=Math.sin(n.t*5+n.seed)*2.2;n.x+=(n.vx-n.vz*s*.12)*i,n.z+=(n.vz+n.vx*s*.12)*i,n.vx*=.93,n.vz*=.93,n.y+=i*.25;let r=n.t/n.max,o=n.s*(1+r*2.6)*(1-r*r);Sh.set(0,n.seed+n.t*n.spin,0),Fi.compose(va.set(n.x,n.y,n.z),ya.setFromEuler(Sh),_a.set(o*2.2,o*.3,o*.7)),te.mistIM.setMatrixAt(e++,Fi)}te.mistIM.count=e,te.mistIM.instanceMatrix.needsUpdate=!0;for(let t=te.floaters.length-1;t>=0;t--){let n=te.floaters[t];if(n.t-=i,n.y+=i*.9,n.t<=0){n.el.remove(),te.floaters.splice(t,1);continue}let[s,r,o]=h.R.worldToScreen(n.x,n.y,n.z),a=n.w/2+8;s=a*2>innerWidth?innerWidth/2:Math.max(a,Math.min(innerWidth-a,s)),n.el.style.transform=`translate(${s|0}px, ${r|0}px) translate(-50%, -50%)`,n.el.style.opacity=o?Math.min(1,n.t/(n.max*.3)):0}};var ef=[["{bernardo}","Hey, you wanna see how big my truck is? No? Too bad, it is parked across three spots."],["{bernardo}","Six-inch lift, 37s, and a payment bigger than my mortgage. Worth it."],["{bernardo}","{hero}, you owe me twenty on Sunday's game. Do not die before you pay me."],["{bernardo}","That linebacker they drafted hits softer than this whole tier."],["{bernardo}","If I go down, somebody move my truck. It is in the fire lane. Again."],["{bernardo}","My shield has seen more action than my fantasy team."],["{dustin}","Fourth taco of the shift. Pray for whoever is downwind."],["{dustin}","My truck is lifted so high the inmates need a step stool to key it."],["{dustin}","Our offensive line blocks worse than this door, and this door is gone."],["{dustin}","I sprayed one dude so hard his grandkids are gonna cough."],["{dustin}","Three energy drinks in. I can hear colors. Let's GO."],["{dustin}","Somebody tell the guy in cell 9 his mama called. Collect. She wants her shoes back."],["{caleb}","What's up bro. Did you see the game last night? Ref was a bum."],["{caleb}","{hero}, if you die, I am taking your parking spot AND your taco."],["{caleb}","That dude's breath is a use of force all by itself."],["{caleb}","You call that a takedown, {hero}? My little cousin tackles better at flag football."],["{caleb}","I am six foot four of pure overtime, baby."],["{caleb}","Tell Sarge his mustache has been written up for loitering."],["{HERO}","I have been awake so long my energy drink needs an energy drink."],["{HERO}","Somebody tell the warden my truck payment is due Friday."],["{HERO}","I swear to God, if I miss kickoff for this."],["{HERO}","Three hundred inmates and not one of them can pick a winner on Sunday."],["{HERO}","I am one bad taco away from a chemical incident."],["SERGEANT","{hero}, that is the ugliest takedown I have ever signed off on."],["SERGEANT","Whoever parked the lifted truck in the fire lane: nice truck. Move it."],["SERGEANT","I played college ball, you know. Nobody asked. But I did."],["SERGEANT","Hydrate, people. And no, Monster does not count as water. It counts as courage."],["RADIO","Reminder: the betting pool on this riot is closed. {bernardo} took the over."],["RADIO","Taco truck is at the sally port. Officers only. Inmates, that means you, Delgado."],["RADIO","Score update for those of you not currently bleeding: we are losing by 14."],["RADIO","Lost and found: one dentures, one shank, one dignity. Please claim at Central."],["COMPLIANCE","Friendly reminder: PREA training is due by end of shift. Your shift does not end."],["COMPLIANCE","PREA Module 2 of 47 will now autoplay over your radio."],["COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one still standing."],["COMPLIANCE","Great news! The PREA auditor is on site today. Please stop bleeding on the paperwork."],["COMPLIANCE","PREA Zero Tolerance includes zero tolerance for late paperwork."]],tf=["Sit DOWN, sweetheart.","That all you got?","File a grievance, tough guy.","Who wants some? Form a line!","I eat tacos tougher than you.","Next!","Back in your cell, princess.","You swing like a Cowboys fan.","Count that, chief.","That's a write-up.","Not on my overtime!","You want to see my truck? Too bad.","Lockdown, baby!","Tell it to the law library.","My ex hits harder.","Touchdown!","Flag on the play!","Stay down!","Chow's cancelled.","Somebody call medical. Not for me."],nf=["Fuck you, CO!","Bitch-ass cop!","I got your plate number!","Your truck is compensating, bro!","You can't even read, boss!","I know where you park!","I'm gonna gas your ass!","Pig!","I'm telling my lawyer!","Your wife writes me letters!","Come in here, tough guy!","This my house!","You ain't shit without that spray!","Bring the Sarge, punk!","Chow was cold AGAIN!","Where my commissary at?!","I want a grievance form!","You smell like tacos and fear!","I'll beat your ass!","PREA! PREA! He looked at me!","Get off my tier!","Y'all can't count!","Lift your truck? Lift THIS!","Your mama on my visitor list!","Shoot me, I dare you!","I'm on psych meds, I don't give a fuck!","Your football team trash!","I'll spit on you!"],wh=["MY EYES!","Ahh shit!","Medical! MEDICAL!","I'm filing on you!","That's excessive!","I can't breathe... jk","My tooth!","Ow! My commissary!","Okay okay okay!","I'm calling my mama!","That's a lawsuit!","Not the face!"],Eh=["Hey cutie!","Officer, you work out?","Ooh, cuff me, daddy!","Is that a baton or are you happy to see me?","Hey big truck!","Girl, those boots? No.","You can pat ME down anytime.","Call me, officer!","I did my makeup for THIS?!","Watch the hair!","Honey, I'm the shot caller now.","You're cute when you're scared.","Don't make me take my earrings off!","This jumpsuit is a crime. So am I."],sf={cup:["Taste this!","Fresh batch!","Gassed!"],tray:["Chow time!","Catch!"],shoe:["Shoe check!","Size 12, bitch!"]},rf={taco:["TACO POWER!","Carne asada mode!","Extra hot sauce!","Al pastor, baby!"],gold:["GOLDEN TACO!","Caleb hid this. Respect.","Big bro approved."],zyn:["ZYN! LIP ON FIRE!","Hot pouch! HOT POUCH!","Ooh that burns. Good.","Zyn in. Brain on.","Top lip is MELTING."],chew:["Dip check!","Fat lip. Full health.","Old school, baby.","Pinch between cheek and gum!"],drink:["ENERGY DRINK!","Zero sugar, all rage!","Heart rate: yes.","Monster mode!"]},Th=["THE TV TOLD ME TO!","I'm the warden now!","AWOOOOOO!","Who took my left sock?!","I can see sounds!","Officer, are you real?","I'm naked and I'm FAST!","The pruno speaks to me!","BEEP BEEP, I'm a truck!","Count me! COUNT ME!","I live in the vents now.","My lawyer is a pigeon."],Ah=["You lost, homie?","Wrong tier, jefe.","This is OUR dayroom.","\xD3rale, here comes the cop.","Don't look at me, CO.","We run this block.","Tell your sergeant we said what's up.","Big truck, small heart, homie.","Ey, nice boots... NOT.","Call your backup, we'll wait.","Jump him!","Get the CO!"],of=["Hey CO... real quick... what does PREA stand for?","Wait wait wait. What's PREA mean though?","Is PREA like a Prius? For real, what is it?"],af=["Prison Rape Elimination Act. There are 47 modules. Want the binder?","It's federal law, buddy. Here's the hotline. It's also on every wall.","P-R-E-A. Zero tolerance. Now get on the ground."],lf=["*confused silence*","...huh.","Forty-seven modules?!","Bro, that's a lot of paperwork.","I just wanted commissary."],cf=["Your mama's commissary is overdrawn!","Nice tattoo. Did you do it with a staple?","You swing like your parole officer.","Your release date called. It laughed.","You got that face only a cellie could love.","Even your shank is disappointed in you."],hf=["SHIELD UP!","Behind me, family!","This shield cost more than my truck. No it didn't. Nothing does.","Hey, you wanna see how big my truck is? After the riot."],uf=[{name:"The Charmer",suit:3107642,skin:15254176,hair:3810582,style:1,face:0,item:16053492,lines:["Officer, could you help me carry this box? My arm's in a cast.","I was my own lawyer, you know. Nailed it.","You seem trustworthy. That's my favorite thing about people.","Is that a lifted truck? I love a big vehicle."]},{name:"Pogo the Painter",suit:3107642,skin:15921906,hair:16726554,style:1,face:3,lines:["Commissary special: one clown painting, forty soups.","Smile, officer! Pogo's watching.","I paint what I see. I see YOU.","Want a portrait? It comes with a free balloon."]},{name:"Sam's Neighbor",suit:3107642,skin:14724229,hair:1709072,style:1,face:7,lines:["The dog says you're doing great, officer.","Harvey says hi. Harvey's the dog.","Don't look at me. Talk to the dog.","The dog wants a lawyer."]},{name:"The Night Prowler",suit:1780512,skin:13011550,hair:1118481,style:1,face:1,lines:["Turn. That light. OFF.","I hate fluorescents. I hate you more.","It's too bright in here, CO.","Hail the dark. Also, where's chow?"]},{name:"The Cipher",suit:3107642,skin:15845285,hair:7031338,style:2,face:4,lines:["I mailed the warden a puzzle. He hasn't solved it.","Check your kites, officer. Every 13th letter.","You'll never crack me. Nobody does.",'Crossword, officer? Seven letters: "overtime."']}],kr={intro:"The Riverbank Ripper is OUT of his cell! All staff, watch the mist!",taunts:["Nobody checks the river, officer.","The mist is my friend.","Took them twenty years to catch me. You've got two minutes.","Gone fishing.","You can't cuff fog."],callouts:["Movement by the water!","He's behind you!","I lost him in the mist!","Cell 7! No, cell 9! I don't know!"],death:"Riverbank Ripper is DOWN. Somebody get the paperwork. All of it."},df=["PREA!!!","PREA! PREA! PREA!","PREAAAAAAA!","PREA! He looked at me with his EYES!","PREA! That pepperball was flirting with me!","I'm calling the PREA hotline!","PREA! He breathed in my direction!","PREA! He sprayed me without a consent form!","Somebody get me a PREA form!","I know my PREA rights! I read the poster!","PREA! His baton winked at me!",'PREA! He said "good morning" aggressively!',"PREA! He stood within six feet of my feelings!","PREA! PREA! Get my lawyer!","PREA! He touched my commissary!","PREA! That taco smelled at me!","PREA! He made eye contact through his sunglasses!","This is a PREA violation and a Tuesday!"],ff=["That's not what PREA means.","Hotline's on the wall. Next to the hole you punched.","Write it up, buddy.","Spell PREA. I'll wait.","Form's in the box. Box is on fire.","Noted. Filed. Shredded.","Bro, you yelled PREA at a vending machine yesterday.","Tell it to the Auditor."],pf=["The Bar is loose. Somebody is naked again.","Bar units: one of them says he is the warden now. He is not the warden.","Heads up, the dings in the Bar are howling at the fluorescent lights again.","Bar units report an inmate wearing a mattress as armor. Respect, honestly.","Control to all staff: the Bar ding is painting the dayroom. With what? Do not ask.","Bar units: he says the TV told him to. The TV has been unplugged since 2009."],mf=["Twelve years of push-ups with my ARMS, CO.","I got four-wheel drive, you got flat feet.","Move. I got the right of way.","I'm faster sitting down than you are standing up.","This chair got more miles than your truck.","Handicap parking? I park wherever I want."],gf=["BEEP BEEP, BITCH!","Speed bump!","Wide load coming through!","RAMMING SPEED!","Ankles, CO! I want ANKLES!"],xf=["One leg, still whooping you.","Medical gave me these. Bad idea.","You know how long this crutch is? Long enough.","I hop faster than you run, CO."],yf=["CATCH!","Medical can bill me!","Here, you need this more than me!","I got another one in my cell!"];var nt={list:[],proj:[]};h.AI=nt;var Sa={rat:{hp:55,speed:4.3,dmg:8,scale:[.9,1.1],suit:[16742938,16747050,15887122],score:10},gasser:{hp:45,speed:3.9,dmg:6,scale:[.85,1],suit:[15765562],item:16053492,ranged:!0,score:15},shank:{hp:50,speed:5.3,dmg:15,scale:[.9,1.05],suit:[13119514],item:12634320,lunge:!0,score:20},big:{hp:240,speed:3.1,dmg:22,scale:[1.35,1.5],suit:[16742938],knock:10,score:40},diva:{hp:75,speed:4.9,dmg:10,scale:[.95,1.05],suit:[16747114,16751226],item:16732088,hair:[16732088,16244810,10181887,16722474],diva:!0,score:25},ding:{hp:60,speed:6,dmg:9,scale:[.9,1.05],suit:[16742938],shirtless:!0,face:7,style:0,ding:!0,score:15},cholo:{hp:85,speed:4.7,dmg:13,scale:[1,1.15],suit:[15759914,15232800],style:3,hats:[1315868,2763306,15263976],face:3,item:12634320,score:25},prea:{hp:50,speed:3.6,dmg:6,scale:[.95,1],suit:[16747050],style:1,face:0,prea:!0,score:30},wheel:{hp:140,speed:6.4,dmg:16,scale:[1,1.1],suit:[16742938,15887122],wheel:!0,turn:1.8,knock:11,score:30},crutch:{hp:90,speed:3.8,dmg:14,scale:[.95,1.1],suit:[16747050,15765562],crutch:!0,reach:.9,knock:6,score:25},killer:{hp:9999,speed:0,dmg:0,scale:[1,1.05],suit:[3107642],score:0},ripper:{hp:3200,speed:5.4,dmg:20,scale:[1.3,1.3],suit:[3107642],knockMul:.08,score:1e3,boss:!0}};h.TYPES=Sa;for(let i in Sa){let e=Sa[i];i!=="killer"&&(e.hp=Math.round(e.hp*(e.boss?1.2:1.6)))}h.MAX_SWINGERS=4;var vf=[],Rh={x:0,z:0},wa=0;nt.reset=function(){nt.list.length=0,nt.proj.length=0,nt.projIM.count=0};nt.init=function(i){nt.projIM=new rn(new Pe(1,1,1),new Oe({roughness:.6}),200),nt.projIM.frustumCulled=!1,nt.projIM.count=0,nt.projIM.castShadow=!0,nt.projIM.setColorAt(0,new xe(1,1,1)),i.add(nt.projIM)};nt.spawn=function(i,e,t){let n=Sa[i],s=n.scale[0]+Math.random()*(n.scale[1]-n.scale[0]),r={type:i,def:n,x:e+h.rand(-.4,.4),z:t+h.rand(-.4,.4),vx:0,vz:0,r:.38*s,scale:s,yaw:Math.random()*h.TAU,hp:n.hp*(h.S.hpMul||1),maxHp:n.hp*(h.S.hpMul||1),speed:n.speed*h.rand(.9,1.1),suit:h.pick(n.suit),skin:h.pick(h.SKIN),hair:n.hair?h.pick(n.hair):h.pick(h.HAIR),hairOn:n.diva||Math.random()<.55,itemCol:n.item||0,phase:Math.random()*6,move:0,swing:0,swingCD:h.rand(.3,1),flash:0,ocT:0,fall:0,dead:!1,deadT:0,thinkT:Math.random()*.3,seen:!1,throwT:h.rand(3,8),spitT:h.rand(2,6),lungeT:0,combo:0,hop:0,vy:0,spin:0,flail:0,windup:0,style:n.style??h.pick([0,0,1,1,1,2,3,3]),hat:h.pick(n.hats||[2039583,9051164,1850506,7171437,15263976]),face:n.face??h.randi(0,6),shirtless:!!n.shirtless,wide:n.wide||1};return n.diva&&(r.style=4),n.boss&&(r.boss=!0,r.noRender=!0),nt.list.push(r),r};nt.liveCount=()=>{let i=0;for(let e of nt.list)!e.dead&&!e.caged&&i++;return i};var pv=0;nt.spawnCrew=function(i,e,t=4){let n=++pv;for(let s=0;s<t;s++){let r=nt.spawn("cholo",i+Math.cos(s*1.6)*1.3,e+Math.sin(s*1.6)*1.3);r.posted=!0,r.crew=n,r.yaw=Math.atan2(i-r.x,e-r.z)}};function Ph(i){for(let e of nt.list)e.crew===i&&e.posted&&(e.posted=!1,e.flex=0)}nt.wakeCrew=Ph;function mv(i){let e=null,t=1e9;for(let n of h.targets){if(n.down)continue;let s=(n.x-i.x)**2+(n.z-i.z)**2;s<t&&(t=s,e=n)}return[e,Math.sqrt(t)]}function an(i,e,t="#ffb37a"){wa<=0||h.FX.floaters.length>8||(wa-=1,h.FX.float(i.x,2.3*i.scale,i.z,h.censor(h.pick(e)),t,14,1.8))}var Ih=0;function ba(i,e){if(!(Ih>0||Math.random()>e||h.FX.floaters.length>10)&&(Ih=h.rand(.7,1.6),h.S.prea=(h.S.prea||0)+1,h.FX.float(i.x,2.6*i.scale,i.z,h.pick(df),"#ffe24a",22,2.2),Math.random()<.3)){let t=h.officers.find(n=>!n.down&&(n.x-i.x)**2+(n.z-i.z)**2<200);t&&setTimeout(()=>h.FX.float(t.x,2.6,t.z,h.pick(ff),"#9fd0ff",16,2),700)}}function Ch(i,e,t,n){let s=t-i.x,r=n-i.z,o=Math.hypot(s,r)||1,a=o/13;nt.proj.push({kind:e,x:i.x,y:1.5*i.scale,z:i.z,vx:s/a,vz:r/a,vy:9*a*.5+.2,spin:0,dmg:e==="cup"?6:e==="tray"?9:5,life:3}),i.windup=1,Math.random()<.45&&an(i,sf[e])}nt.update=function(i){let e=h.W,t=nt.list;wa=Math.min(2,wa+i*.6),Ih-=i,h.grid.clear();for(let n of t)!n.dead&&!n.caged&&h.grid.insert(n);for(let n of h.targets)n.slots=0;for(let n=t.length-1;n>=0;n--){let s=t[n];if(s.flash=Math.max(0,s.flash-i),s.flashedT>0&&(s.flashedT-=i),!s.dead&&s.hop>0&&!s.def.crutch&&(s.vy-=20*i,s.hop=Math.max(0,s.hop+s.vy*i),s.hop===0&&(s.vy=0,h.FX.blood(s.x,.2,s.z,0,0,2),h.audio.play("thud",.6))),s.windup=Math.max(0,s.windup-i*3),s.vx||s.vz){s.x+=s.vx*i,s.z+=s.vz*i;let M=Math.exp(-i*7);s.vx*=M,s.vz*=M,Math.abs(s.vx)+Math.abs(s.vz)<.05&&(s.vx=s.vz=0),e.collide(s)}if(s.dead){s.fall=Math.min(1,s.fall+i*3.5),s.move=0,s.swing=0,(s.vy||s.hop>0)&&(s.hop+=s.vy*i,s.vy-=20*i,s.yaw+=s.spin*i,s.tumble=(s.tumble||0)+s.spin*.4*i,s.hop<=0&&(s.hop=0,s.vy=0,s.spin=0,s.tumble=0,h.FX.blood(s.x,.2,s.z,0,0,4),h.audio.play("thud",.5))),s.deadT+=i,s.deadT>9&&t.splice(n,1);continue}let[r,o]=mv(s);if(s.caged){r&&(s.yaw+=h.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*3)),s.phase+=i,s.move=0,s.flex=Math.max(0,Math.sin(s.phase*.7))*.3;continue}if(s.boss){h.Boss&&h.Boss.think(s,i,r,o);continue}if(s.freezeT>0){s.freezeT-=i,s.move=h.lerp(s.move,0,i*8),s.flex=1;continue}if(s.posted){s.move=0,s.phase+=i*.5,s.flex=.5+Math.sin(s.phase*2)*.3,Math.random()<i*.06&&an(s,Ah,"#ffd27a"),r&&o<9&&(Ph(s.crew),an(s,["Get the CO!","Jump him!","\xD3rale, let's go!"],"#ffd27a"));continue}if(s.flex=Math.max(0,(s.flex||0)-i*2),s.def.prea&&!s.asked&&r&&o<8){if(s.asking||(s.asking=!0,s.askT=0,h.FX.float(s.x,2.6,s.z,h.pick(of),"#ffe27a",16,3.5)),s.askT+=i,s.move=h.lerp(s.move,0,i*8),r.yaw!==void 0&&(s.yaw+=h.angDiff(s.yaw,Math.atan2(r.x-s.x,r.z-s.z))*Math.min(1,i*6)),o<2.8&&(s.answerT=(s.answerT||0)+i),s.answerT>1){s.asked=!0,h.say(r.name||"OFFICER",h.pick(af),4);for(let M of t)!M.dead&&!M.caged&&!M.boss&&(M.x-s.x)**2+(M.z-s.z)**2<140&&(M.freezeT=4,M.swing=0);h.FX.float(s.x,3,s.z,h.pick(lf),"#ffe27a",18,3),r.score=(r.score||0)+100}else s.askT>7&&(s.asked=!0);continue}if(s.ocT=Math.max(0,s.ocT-i),s.swingCD-=i,s.throwT-=i,s.spitT-=i,s.lungeT=Math.max(0,s.lungeT-i),!r){s.move=h.lerp(s.move,0,i*5);continue}s.thinkT-=i,s.thinkT<=0&&(s.thinkT=h.rand(.2,.35),s.seen=o<16&&e.los(s.x,s.z,r.x,r.z));let a=0,l=0,c=s.speed,u=r.x-s.x,d=r.z-s.z,f=1/(o||1);if(s.ocT>0)s.flail=1,a=Math.sin(s.phase*.7+n),l=Math.cos(s.phase*.5+n),c*=.35,Math.random()<i*.6&&an(s,["*cough cough*","MY EYES!","I can't see!","Water! WATER!"],"#ff9a6a");else{s.flail=Math.max(0,s.flail-i*2),s.seen||o<2.5?(a=u*f,l=d*f):e.flowDir(s.x,s.z,Rh)?(a=Rh.x,l=Rh.z):(a=u*f,l=d*f);let M=s.def;M.ranged&&s.seen?(o<6?(a=-a,l=-l):o<10&&(a*=.15,l*=.15),s.throwT<=0&&o<13&&(s.throwT=h.rand(1.8,2.8),Ch(s,"cup",r.x,r.z))):s.seen&&s.throwT<=0&&o>5&&o<12&&(s.throwT=h.rand(6,11),Ch(s,Math.random()<.5?"tray":"shoe",r.x,r.z)),M.lunge&&s.seen&&o>2&&o<4.5&&s.lungeT<=0&&s.swingCD<=0&&(s.lungeT=2.5,s.vx+=u*f*13,s.vz+=d*f*13,s.swingCD=0,Math.random()<.5&&an(s,["Shank time!","Poke poke, bitch!","Hold still, CO!"])),o<3.2&&s.spitT<=0&&Math.random()<.5&&(s.spitT=h.rand(5,9),h.FX.spit(s.x,1.5*s.scale,s.z,u*f,d*f),r.hurt(2,s.x,s.z,"spit"),an(s,["*hocks loogie*","PTOO!","Got you, CO!"],"#d9e4b5")),M.ding&&(s.dingT=(s.dingT||0)-i,s.dingT<=0&&(s.dingT=h.rand(1.5,4),s.dingDir=Math.random()<.45?Math.random()*h.TAU:null,Math.random()<.4&&an(s,Th,"#c6ff7a")),s.dingDir!=null&&o>2.5&&(a=Math.sin(s.dingDir),l=Math.cos(s.dingDir),c*=1.3,s.flail=1)),M.crutch&&!s.noCrutch&&s.seen&&o>5&&o<11&&Math.random()<i*.4&&(s.noCrutch=!0,Ch(s,"shoe",r.x,r.z),an(s,yf,"#ffb37a")),M.crutch&&(s.noCrutch?(c*=.75,s.hop=Math.abs(Math.sin(s.phase*.6))*.14):Math.random()<i*.04&&an(s,xf,"#ffb37a")),M.wheel&&(s.ramT=(s.ramT||0)-i,o<s.r+r.r+.5&&s.ramT<=0&&s.move>.6?(s.ramT=2.2,r.hurt(M.dmg*(h.S.dmgMul||1),s.x,s.z,"ram",M.knock),s.vx-=u*f*7,s.vz-=d*f*7,h.audio.play("thud",.8),an(s,gf,"#ffd27a")):Math.random()<i*.04&&an(s,mf,"#ffb37a")),Math.random()<i*.012&&ba(s,1),Math.random()<i*.05&&an(s,M.diva?Eh:M.ding?Th:s.type==="cholo"?Ah:nf,M.diva?"#ff8fd0":M.ding?"#c6ff7a":"#ffb37a")}let p=s.r+r.r+(.6+(s.def.crutch&&!s.noCrutch?s.def.reach:0))*s.scale;if(o<p+1.6&&s.ocT<=0){if(r.slots<h.MAX_SWINGERS)r.slots++;else if(s.swing<=0){let M=n&1?1:-1,b=o<2.6?-.6:.3;a=-d*f*M+u*f*b,l=u*f*M+d*f*b,c*=.55,s.swingCD=Math.max(s.swingCD,.3)}}if(s.swing>0){let M=s.swing;s.swing+=i*(s.def.diva?4.2:2.9),M<.5&&s.swing>=.5&&o<p+.4&&s.ocT<=0&&(r.hurt(s.def.dmg*(h.S.dmgMul||1),s.x,s.z,s.type,s.def.knock||3),s.def.diva&&Math.random()<.4&&an(s,Eh,"#ff8fd0")),s.swing>=1&&(s.swing=0,s.def.diva&&s.combo<1?(s.combo++,s.swing=.01):(s.combo=0,s.swingCD=h.rand(.7,1.1))),c*=.4}else o<p&&s.swingCD<=0&&s.ocT<=0&&!s.def.wheel&&(s.swing=.01);o<p*.85&&(a*=.1,l*=.1),h.grid.query(s.x,s.z,1.2,vf);let y=0,x=0;for(let M of vf){if(M===s)continue;let b=s.x-M.x,L=s.z-M.z,T=b*b+L*L,C=s.r+M.r;if(T<C*C&&T>1e-5){let A=Math.sqrt(T),S=(C-A)/A;y+=b*S,x+=L*S}}let g=Math.min(1,i*(s.def.turn||6));s.hx=h.lerp(s.hx??a,a,g),s.hz=h.lerp(s.hz??l,l,g),s.x+=s.hx*c*i+y*.5,s.z+=s.hz*c*i+x*.5,e.collide(s);let m=Math.min(1,Math.hypot(s.hx,s.hz));s.move=h.lerp(s.move,m,i*8),s.phase+=i*10*s.move*(c/4.3);let v=s.ocT>0||s.def.wheel?Math.atan2(s.hx,s.hz):Math.atan2(u,d);s.yaw+=h.angDiff(s.yaw,v)*Math.min(1,i*10)}bv(i)};var _f=new ze,gv=new Vt,xv=new Gt,yv=new P,vv=new P,_v=new xe,Mv={cup:[.16,.22,.16,15921906],tray:[.5,.05,.36,10134443],shoe:[.14,.12,.3,1776411]};function bv(i){let e=nt.proj,t=0;for(let n=e.length-1;n>=0;n--){let s=e[n];s.vy-=18*i*.5,s.x+=s.vx*i,s.y+=s.vy*i,s.z+=s.vz*i,s.spin+=i*12,s.life-=i;let r=!1;for(let a of h.targets)if(!a.down&&(a.x-s.x)**2+(a.z-s.z)**2<.6&&s.y<2){a.hurt(s.dmg,s.x-s.vx,s.z-s.vz,s.kind,2),s.kind==="cup"?(h.FX.splash(a.x,a.z,7035434,18),h.FX.float(a.x,2.4,a.z,"GASSED!","#c9b45a",18,1.4),a.slowT=2):h.FX.sparks(s.x,s.y,s.z,6,16777215),h.audio.play(s.kind==="cup"?"splat":"thud",.7),r=!0;break}if(!r&&(s.y<=.05||s.life<=0||h.W.blocked(s.x,s.z))&&(s.kind==="cup"&&h.FX.splash(s.x,s.z,7035434,10),r=!0),r){e.splice(n,1);continue}let o=Mv[s.kind];_f.compose(yv.set(s.x,s.y,s.z),gv.setFromEuler(xv.set(s.spin,s.spin*.6,0)),vv.set(o[0],o[1],o[2])),nt.projIM.setMatrixAt(t,_f),nt.projIM.setColorAt(t,_v.setHex(o[3])),t++}nt.projIM.count=t,nt.projIM.instanceMatrix.needsUpdate=!0,nt.projIM.instanceColor&&(nt.projIM.instanceColor.needsUpdate=!0)}nt.damage=function(i,e,t,n,s=4,r="hit",o=null){if(i.dead)return!1;i.hp-=e,i.flash=.25;let a=i.x-t,l=i.z-n,c=Math.hypot(a,l)||1,u=s/Math.sqrt(i.scale)*(i.def.knockMul??1);if(i.posted&&Ph(i.crew),i.freezeT>0&&(i.freezeT=0),i.boss&&h.Boss&&h.Boss.onHit(i,e),i.vx+=a/c*u,i.vz+=l/c*u,r!=="oc"&&h.FX.blood(i.x,1.2*i.scale,i.z,a/c,l/c,i.hp<=0?16:5),i.hp<=0){i.dead=!0,i.swing=0,i.vx*=1.8,i.vz*=1.8,s>=8&&!i.boss&&(i.vy=h.rand(3.5,6.5)/Math.sqrt(i.scale),i.spin=h.rand(-9,9)),i.boss?h.Boss&&h.Boss.onDeath(i):h.Loot&&h.Loot.maybeDrop(i.x,i.z,i.type==="big"||i.type==="cholo"?.03:.012),i.yaw=Math.atan2(-a,-l),Math.random()<.3&&h.FX.teeth(i.x,1.5,i.z),Math.random()<.5?ba(i,.6):Math.random()<.35&&an(i,wh,"#ffd0a0"),h.S.kills++,h.onKill&&h.onKill(),o&&(o.kills++,o.score+=i.def.score,o.ot!==void 0&&!(o.otT>0)&&(o.ot=Math.min(100,o.ot+3.5))),h.dropLoot&&h.dropLoot(i.x,i.z);let d=0;for(let f of nt.list)f.dead&&d++;if(d>80){let f=nt.list.findIndex(p=>p.dead);f>=0&&nt.list.splice(f,1)}return!0}return r==="oc"?ba(i,.02):Math.random()<.12&&ba(i,.6),r!=="oc"&&Math.random()<.08&&an(i,i.def.diva?["Not the FACE!","You chipped my nail!","Rude!"]:wh,"#ffd0a0"),!1};var Hr=new P;function Un(i,e,t,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Hr.copy(e),Hr[n]=0,Hr.normalize();let c=.5*o/(o+a),u=1-Hr.angleTo(i)/l;return Math.sign(Hr[t])===1?u*c:a/(o+a)+c+c*(1-u)}var pn=class extends Pe{constructor(e=1,t=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let a=new P,l=new P,c=new P(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,y=new P,x=.5/s;for(let g=0,m=0;g<u.length;g+=3,m+=2)switch(a.fromArray(u,g),l.copy(a),l.x-=Math.sign(l.x)*x,l.y-=Math.sign(l.y)*x,l.z-=Math.sign(l.z)*x,l.normalize(),u[g+0]=c.x*Math.sign(a.x)+l.x*r,u[g+1]=c.y*Math.sign(a.y)+l.y*r,u[g+2]=c.z*Math.sign(a.z)+l.z*r,d[g+0]=l.x,d[g+1]=l.y,d[g+2]=l.z,Math.floor(g/p)){case 0:y.set(1,0,0),f[m+0]=Un(y,l,"z","y",r,n),f[m+1]=1-Un(y,l,"y","z",r,t);break;case 1:y.set(-1,0,0),f[m+0]=1-Un(y,l,"z","y",r,n),f[m+1]=1-Un(y,l,"y","z",r,t);break;case 2:y.set(0,1,0),f[m+0]=1-Un(y,l,"x","z",r,e),f[m+1]=Un(y,l,"z","x",r,n);break;case 3:y.set(0,-1,0),f[m+0]=1-Un(y,l,"x","z",r,e),f[m+1]=1-Un(y,l,"z","x",r,n);break;case 4:y.set(0,0,1),f[m+0]=1-Un(y,l,"x","y",r,e),f[m+1]=1-Un(y,l,"y","x",r,t);break;case 5:y.set(0,0,-1),f[m+0]=Un(y,l,"x","y",r,e),f[m+1]=1-Un(y,l,"y","x",r,t);break}}};var Mf=[15845285,14724229,13011550,11037509,9065782,7028519,5188892],bf=[1709072,2825492,4861984,1118481,7031338,9079434];h.SKIN=Mf;h.HAIR=bf;function Dh(i,e){let t=i.attributes.position,n=t.count,s=new Float32Array(n*3);i.computeBoundingBox();let{min:r,max:o}=i.boundingBox;for(let a=0;a<n;a++){let l=(t.getY(a)-r.y)/(o.y-r.y||1),[c,u,d]=e(l,t.getX(a),t.getZ(a));s[a*3]=c,s[a*3+1]=u,s[a*3+2]=d}return i.setAttribute("color",new Lt(s,3)),i}var Vr=i=>mh(Ur(i.map(e=>e.index?e.toNonIndexed():e))),Gr=(i,e=1)=>Dh(i,()=>[e,e,e]),as=(i,e=.82)=>Dh(i,t=>{let n=e+t*(1-e);return[n,n,n]}),Lh=(i,e,t=10)=>new Sn(i,e-i*2,t>8?4:2,t).translate(0,-e/2,0),Sv=(i,e,t)=>{let n=i.attributes.uv;for(let s=0;s<n.count;s++)n.setXY(s,e,t);return i},Sf=[4033535,16731469,4054148,16763197];h.PCOLORS=Sf;function Ta(i={}){let e=i.gender==="female",t=i.gender==="they",n=i.rank==="sgt",s=i.uniform??2376318,r=1518162,o=i.skin??h.pick(Mf),a=i.hair??h.pick(bf),l=(O,G=.7,z=0)=>new Oe({color:O,roughness:G,metalness:z}),c={uni:l(s,.75),dark:l(r),skin:l(o,.55),hair:l(a,.7),black:l(1118481,.35,.2),gold:new Oe({color:16765773,emissive:5913600,roughness:.25,metalness:1}),steel:l(13225684,.25,1),vest:l(1777449,.8),red:l(13116444,.4),boots:l(1118481,.35,.2),pants:l(s,.75),print:new Oe({map:Xd(i.back||"CORRECTIONS"),roughness:.8})},u=(O,G,z=0,K=0,X=0)=>{let ne=new fe(O,G);return ne.position.set(z,K,X),ne.castShadow=!0,ne.receiveShadow=!0,ne},d=e?.9:t?.95:1,f=new at,p=new at;f.add(p),p.add(u(new pn(.52*d,.64,.3,2,.08),c.uni,0,1.08,0)),p.add(u(new pn(.57*d,.46,.35,2,.06),c.vest,0,1.12,0));let y=u(new Ct(.5*d,.13),c.print,0,1.2,-.178);y.rotation.y=Math.PI,p.add(y),p.add(u(new pn(.52*(e?1.04:1),.11,.33,2,.03),c.black,0,.8,0)),p.add(u(new Pe(.09,.07,.02),c.gold,0,.8,.17)),p.add(u(new tt(.045,.045,.012,6),c.gold,-.14*d,1.27,.18).rotateX(Math.PI/2)),p.add(u(new Pe(.08,.15,.07),c.black,.27,.8,.05)),p.add(u(new Pe(.06,.08,.04),c.black,.16*d,1.34,.17)),p.add(u(new tt(.04,.04,.17,10),c.red,-.27,.8,.05)),p.add(u(new wn(.05,.012,6,12),c.steel,.2,.72,.12)),p.add(u(new tt(.075,.08,.12,10),c.skin,0,1.43,0));let x=new at;x.position.set(0,1.58,0),p.add(x),x.add(u(new Et(.165,20,16),c.skin)),x.add(u(new pn(.24,.055,.04,1,.015),c.black,0,.02,.15)),e?(x.add(u(new Et(.175,16,10,0,Math.PI*2,0,Math.PI/1.9),c.hair,0,.02,-.01)),x.add(u(new Et(.085,12,8),c.hair,0,.04,-.19)),x.add(u(new Sn(.045,.2,4,8),c.hair,0,-.14,-.2))):(t&&(x.add(u(new Et(.178,16,10,0,Math.PI*2,0,Math.PI/1.65),c.hair,0,0,-.01)),[-.15,.15].forEach(O=>x.add(u(new Sn(.04,.12,3,8),c.hair,O,-.08,-.02)))),x.add(u(new tt(.175,.18,.1,18),c.dark,0,.12,0)),x.add(u(new pn(.26,.03,.17,1,.012),c.dark,0,.08,.16)));let g=(O,G,z,K)=>{let X=new at;return X.add(u(new tt(O,G,z,14,1).translate(0,-z/2,0),K)),X.add(u(new Et(O,14,10),K)),X.add(u(new Et(G,12,8),K,0,-z,0)),X},m=O=>{let G=new at;G.position.set(O*.33*d,1.33,0),G.add(u(new Et(.105*d+.01,16,12).scale(1,.85,1),c.uni,0,.01,0));let z=g(.088,.074,.29,c.uni);G.add(z);let K=new at;K.position.y=-.29,z.add(K);let X=g(.068,.054,.26,c.skin);K.add(X);let ne=new at;return ne.position.y=-.27,X.add(ne),ne.add(u(new pn(.09,.12,.06,2,.025),c.skin,0,-.05,.005)),ne.add(u(new Sn(.022,.05,2,6),c.skin,O*-.045,-.03,.03).rotateZ(O*.6)),p.add(G),{shoulder:G,elbow:K,hand:ne,upper:z}},v=m(-1),M=m(1),b=v.shoulder,L=M.shoulder;n&&[v.upper,M.upper].forEach(O=>[0,1,2].forEach(G=>{let z=u(new Pe(.19,.02,.19),c.gold,0,-.08-G*.04,0);z.rotation.z=.25,O.add(z)}));let T=u(new tt(.028,.034,.64,10),c.black,0,-.07,.25);T.rotation.x=Math.PI/2,M.hand.add(T);let C=new at;C.visible=!1,C.rotation.x=Math.PI/2,C.position.set(0,-.06,.02),M.hand.add(C),C.add(u(new pn(.07,.11,.42,1,.02),c.black,0,-.05,.16)),C.add(u(new tt(.018,.018,.3,8).rotateX(Math.PI/2),c.steel,0,-.03,.5)),C.add(u(new pn(.05,.14,.05,1,.015),c.black,0,-.14,.1));let A=O=>{let G=new at;G.position.set(O*.13,.8,0);let z=g(.105,.088,.4,c.pants);G.add(z);let K=new at;K.position.y=-.4,z.add(K);let X=g(.085,.072,.31,c.pants);return K.add(X),X.add(u(new pn(.19,.13,.31,2,.045),c.boots,0,-.35,.05)),p.add(G),{hip:G,knee:K}},S=A(-1),_=A(1),I=S.hip,F=_.hip,U=new fe(new $n(.5,.62,32),new pt({color:i.ringColor??Sf[i.slot||0],transparent:!0,opacity:.85,toneMapped:!1}));return U.rotation.x=-Math.PI/2,U.position.y=.03,f.add(U),i.scale&&f.scale.setScalar(i.scale),{root:f,body:p,head:x,armL:b,armR:L,legL:I,legR:F,elbowL:v.elbow,elbowR:M.elbow,kneeL:S.knee,kneeR:_.knee,baton:T,gun:C,ring:U,M:c,phase:0,j:{}}}function zi(i,e,t,n,s,r){i.phase+=e*10*Math.max(t,1e-4),i.t=(i.t||0)+e;let o=i.j||(i.j={}),a=(f,p,y,x,g=14)=>{let m=o[f]??x,v=m+(x-m)*Math.min(1,e*g);o[f]=v,p.rotation[y]=v},l=i.phase,c=Math.sin(l)*t,u=Math.cos(l);a("hL",i.legL,"x",c*.65),a("hR",i.legR,"x",-c*.65),i.kneeL&&(a("kL",i.kneeL,"x",(.15+Math.max(0,-Math.sin(l-.6))*1)*t,18),a("kR",i.kneeR,"x",(.15+Math.max(0,Math.sin(l-.6))*1)*t,18));let d=Math.sin(i.t*2.2)*.03;if(n>0){let f=Math.sin(n*Math.PI);a("aR",i.armR,"x",-2.5+n*3.1,30),a("aRz",i.armR,"z",-.35,30),i.elbowR&&a("eR",i.elbowR,"x",-.9*(1-n)-.1*f,30)}else s?(a("aR",i.armR,"x",-1.45,18),a("aRz",i.armR,"z",-.12,18),i.elbowR&&a("eR",i.elbowR,"x",-.15,18)):(a("aR",i.armR,"x",-c*.55+.05+d,10),a("aRz",i.armR,"z",.1,10),i.elbowR&&a("eR",i.elbowR,"x",-.25-Math.max(0,-c)*.6-t*.15,10));i.holdL?(a("aL",i.armL,"x",-1.1,12),a("aLz",i.armL,"z",.25,12),i.elbowL&&a("eL",i.elbowL,"x",-1.2,12)):s&&n<=0?(a("aL",i.armL,"x",-1.3,18),a("aLz",i.armL,"z",.45,18),i.elbowL&&a("eL",i.elbowL,"x",-.55,18)):(a("aL",i.armL,"x",c*.55+.05+d,10),a("aLz",i.armL,"z",-.1,10),i.elbowL&&a("eL",i.elbowL,"x",-.25-Math.max(0,c)*.6-t*.15,10)),i.gun&&(i.gun.visible=!!s&&n<=0,i.baton.visible=!i.gun.visible),i.body.position.y=Math.abs(Math.sin(l))*.045*t+(r?.2*r:0),a("bx",i.body,"x",r?-Math.PI/2*r:t*.1+(s?.04:0),10),a("by",i.body,"y",u*.07*t,10),i.head&&a("hy",i.head,"y",-u*.05*t,10)}function wv(i){let e=i.attributes.uv,t=i.attributes.normal;for(let n=0;n<e.count;n++){let s=t.getZ(n),r=e.getX(n),o=e.getY(n);s<-.6?e.setXY(n,.27+r*.46,.1+o*.8):s>.6?e.setXY(n,.79+r*.18,.12+o*.8):e.setXY(n,.05,.5)}return i}function Ev(){let i=Dh(Lh(.1,.8,7),x=>x<.14?[.12,.12,.12]:[.95,.95,.95]),e=as(Vr([Lh(.068,.54,6),new Et(.072,6,4).translate(0,-.56,0)])),t=as(Lh(.082,.24,6)),n=as(wv(mh(new pn(.5,.64,.3,1,.08))),.85),s=Sv(new tt(.075,.08,.14,6,1,!0).translate(0,-.17,0),.75/Ks,.3),r=as(Vr([new Et(.165,12,9),s]),.9),o=Gr(new Et(.175,10,5,0,Math.PI*2,0,Math.PI/2.2)),a=as(new Et(.18,10,5,0,Math.PI*2,0,Math.PI/2).scale(1,1.25,1),.7),l=Gr(Vr([new Et(.178,10,5,0,Math.PI*2,0,Math.PI/2.1),new pn(.08,.06,.12,1,.02).translate(0,.02,-.19)])),c=Gr(new Sn(.05,.28,2,6).translate(0,-.18,-.17)),u=Gr(new Pe(.045,.34,.06).translate(0,-.12,0)),d=x=>new wn(.3,.035,6,18).rotateY(Math.PI/2).translate(x,.3,-.05),f=as(Vr([new Pe(.48,.06,.46).translate(0,.46,0),new Pe(.48,.46,.05).translate(0,.72,-.24),d(-.3),d(.3),new wn(.25,.015,4,14).rotateY(Math.PI/2).translate(-.34,.3,-.05),new wn(.25,.015,4,14).rotateY(Math.PI/2).translate(.34,.3,-.05),new tt(.07,.07,.04,8).rotateZ(Math.PI/2).translate(-.2,.07,.3),new tt(.07,.07,.04,8).rotateZ(Math.PI/2).translate(.2,.07,.3),new Pe(.03,.42,.03).translate(-.2,.26,.26),new Pe(.03,.42,.03).translate(.2,.26,.26),new Pe(.4,.03,.12).translate(0,.1,.42)]),.6),p=as(Vr([new Pe(.04,1.15,.04).translate(0,-.2,0),new Pe(.06,.05,.2).translate(0,.38,0),new Pe(.05,.04,.12).translate(0,0,.04)]),.7),y=Gr(new tt(.125,.135,.42,8).translate(0,-.55,0),1);return[{key:"torso",geo:n,piv:[0,1.08,0],col:"suit",map:"suit"},{key:"head",geo:r,piv:[0,1.57,0],col:"skin",map:"face"},{key:"hair",geo:o,piv:[0,1.59,0],col:"hair",show:x=>x.style===1||x.style===4},{key:"beanie",geo:a,piv:[0,1.6,0],col:"hat",show:x=>x.style===2},{key:"bandana",geo:l,piv:[0,1.59,0],col:"hat",show:x=>x.style===3},{key:"tail",geo:c,piv:[0,1.6,0],col:"hair",show:x=>x.style===4},{key:"armL",geo:e,piv:[-.33,1.34,0],col:"skin",joint:"armL"},{key:"armR",geo:e,piv:[.33,1.34,0],col:"skin",joint:"armR"},{key:"sleeveL",geo:t,piv:[-.33,1.36,0],col:"suit",joint:"armL",show:x=>!x.shirtless},{key:"sleeveR",geo:t,piv:[.33,1.36,0],col:"suit",joint:"armR",show:x=>!x.shirtless},{key:"legL",geo:i,piv:[-.12,.8,0],col:"suit",joint:"legL"},{key:"legR",geo:i,piv:[.12,.8,0],col:"suit",joint:"legR"},{key:"chair",geo:f,piv:[0,.32,0],fixed:4212302,show:x=>!!x.def.wheel,sit:!0},{key:"crutch",geo:p,piv:[.33,1.34,0],fixed:12041927,joint:"armR",hand:[0,-.58,.06],show:x=>!!x.def.crutch&&!x.noCrutch},{key:"cast",geo:y,piv:[-.12,.8,0],fixed:15987178,joint:"legL",show:x=>!!x.def.crutch},{key:"item",geo:u,piv:[.33,1.34,0],col:"item",joint:"armR",hand:[0,-.58,.06],show:x=>!!x.itemCol}]}function Tv(i){let e=new Oe({vertexColors:!0,roughness:.6,map:i});return e.onBeforeCompile=t=>{t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute float aFace;`).replace("#include <uv_vertex>",`#include <uv_vertex>
 vMapUv.x = (vMapUv.x + aFace) / ${Ks}.0;`)},e}var Ea=class{constructor(e,t){this.max=t;let n=Gd(),s=Wd();this.parts=Ev().map(o=>{let a;o.map==="face"?(o.geo.setAttribute("aFace",new ts(new Float32Array(t),1)),a=Tv(n)):a=new Oe({vertexColors:!0,roughness:o.col==="skin"?.55:.78,map:o.map==="suit"?s:null});let l=new rn(o.geo,a,t);return l.instanceMatrix.setUsage(qs),l.setColorAt(0,new xe(1,1,1)),l.instanceColor.setUsage(qs),l.castShadow=["torso","head","legL","legR"].includes(o.key),l.receiveShadow=!0,l.frustumCulled=!1,l.count=0,e.add(l),{...o,im:l,face:o.map==="face"?o.geo.attributes.aFace:null}}),this.base=new ze,this.joint=new ze,this.out=new ze,this.q=new Vt,this.e=new Gt(0,0,0,"YXZ"),this.v=new P,this.s=new P,this.c=new xe,this.white=new xe(1,1,1),this.red=new xe(16726826),this.zero=new ze().makeScale(0,0,0);let r=(o,a)=>new pt({color:o,transparent:!0,opacity:a,depthWrite:!1,toneMapped:!1});this.barBg=new rn(new Ct(1,.11),r(0,.6),t),this.barFill=new rn(new Ct(1,.08).translate(.5,0,0),r(16777215,.95),t);for(let o of[this.barBg,this.barFill])o.frustumCulled=!1,o.count=0,o.renderOrder=5,o.instanceMatrix.setUsage(qs),e.add(o);this.barFill.setColorAt(0,this.c),this.tmp=new ze,this.tmp2=new ze,this.one=new P(1,1,1),this.barPos=new P,this.hpHi=new xe(5431386),this.hpLo=new xe(16724e3)}syncBars(e){let t=h.R&&h.R.camera;if(!t)return;let n=0;for(let s=0;s<e.length&&n<this.max;s++){let r=e[s];if(r.dead||r.caged||r.noRender||r.hp>=r.maxHp)continue;let o=Math.max(0,r.hp/r.maxHp);this.barPos.set(r.x,2.05*r.scale+(r.hop||0)-(r.def.wheel?.32:0),r.z),this.out.compose(this.barPos,t.quaternion,this.one),this.tmp.makeScale(.9*r.scale,1,1),this.barBg.setMatrixAt(n,this.tmp.premultiply(this.out)),this.tmp.makeTranslation(-.45*r.scale,0,.01),this.tmp.multiply(this.tmp2.makeScale(Math.max(.001,.9*r.scale*o),1,1)),this.barFill.setMatrixAt(n,this.tmp.premultiply(this.out)),this.c.copy(this.hpLo).lerp(this.hpHi,o),this.barFill.setColorAt(n,this.c),n++}this.barBg.count=this.barFill.count=n,this.barBg.instanceMatrix.needsUpdate=this.barFill.instanceMatrix.needsUpdate=!0,this.barFill.instanceColor&&(this.barFill.instanceColor.needsUpdate=!0)}sync(e){let t=Math.min(e.length,this.max),{base:n,joint:s,out:r,q:o,e:a,v:l,s:c,c:u}=this;for(let d=0;d<t;d++){let f=e[d];if(f.noRender){for(let g of this.parts)g.im.setMatrixAt(d,this.zero);continue}a.set(-(f.fall||0)*Math.PI/2+(f.tumble||0),f.yaw,0,"YXZ"),o.setFromEuler(a);let p=f.def.wheel&&!f.dead?.32:0;l.set(f.x,(f.fall||0)*.17*f.scale+(f.hop||0)-p*f.scale,f.z),c.set(f.scale*(f.wide||1),f.scale,f.scale*(f.wide||1)),n.compose(l,o,c);let y=Math.sin(f.phase)*.8*f.move,x=f.swing>0?Math.sin(f.swing*Math.PI):0;for(let g of this.parts){if(g.show&&!g.show(f)){g.im.setMatrixAt(d,this.zero);continue}let m=0,v=0;if(p&&(g.joint==="legL"||g.joint==="legR")?m=-1.35:g.joint==="legL"?m=f.def.crutch?-.5:y:g.joint==="legR"?m=-y:g.joint==="armL"?(m=-y*.9-(f.flail||0)*2.5,v=-(f.flex||0)*1.2):g.joint==="armR"&&(m=y*.9-x*2.6-(f.windup||0)*2.8,v=x*.5+(f.flex||0)*1.2),a.set(m,0,v,"XYZ"),o.setFromEuler(a),g.sit&&!p){g.im.setMatrixAt(d,this.zero);continue}s.compose(l.set(g.piv[0],g.piv[1],g.piv[2]),o,c.setScalar(1)),g.hand&&(r.makeTranslation(g.hand[0],g.hand[1],g.hand[2]),s.multiply(r)),r.multiplyMatrices(n,s),g.im.setMatrixAt(d,r);let M=g.fixed?g.fixed:g.col==="suit"?f.suit:g.col==="skin"?f.skin:g.col==="hair"?f.hair:g.col==="hat"?f.hat:f.itemCol;u.setHex(M),f.flash>0&&u.lerp(this.white,Math.min(1,f.flash*3)),f.ocT>0&&g.col==="skin"&&u.lerp(this.red,.45),g.im.setColorAt(d,u),g.face&&(g.face.array[d]=f.face)}}this.syncBars(e);for(let d of this.parts)d.im.count=t,d.im.instanceMatrix.needsUpdate=!0,d.im.instanceColor.needsUpdate=!0,d.face&&(d.face.needsUpdate=!0)}};var ln=[{key:"green",label:"Uncommon",color:4054106,css:"#3ddc5a",weight:55,mult:1},{key:"blue",label:"Rare",color:4033535,css:"#5aa0ff",weight:28,mult:1.6},{key:"purple",label:"Epic",color:10898943,css:"#b973ff",weight:13,mult:2.3},{key:"orange",label:"Legendary",color:16747034,css:"#ff9a3a",weight:4,mult:3.2}],ei={boots:{label:"Boots",stat:i=>({speed:.04*i}),text:i=>`+${Math.round(i.speed*100)}% speed`,names:[["Payless Patrol Shoes","Velcro Night-Shift Sneakers"],["Steel-Toe Snitch Kickers","Orthopedic Overtime Boots"],["Crocs (Sport Mode)","Tactical Jordans"],["Air Max Overtime","Six-Inch-Lift Boots"]],perk:{text:"Dashing is free",id:"freeDash"}},pants:{label:"Pants",stat:i=>({hp:Math.round(12*i)}),text:i=>`+${i.hp} max health`,names:[["Cargo Pants (17 Pockets)","Hand-Me-Down Slacks"],["Stretchy Taco Pants","Kevlar Khakis"],["Sweatpants of Command","Riot Joggers"],["The Pants of Seniority","Sergeant's Wedding Slacks"]],perk:{text:"Slowly heal over time",id:"regen"}},vest:{label:"Tactical Vest",stat:i=>({armor:.05*i}),text:i=>`-${Math.round(i.armor*100)}% damage taken`,names:[["Expired Stab Vest","Duct-Tape Armor"],["Gas-Proof Poncho","Hi-Vis Mesh of Authority"],["Tactical Fanny Pack Rig","PREA-Compliant Plate Carrier"],["DOC Family Heirloom Vest","Triple-Time Plate Carrier"]],perk:{text:"Anyone who hits you gets pepper-sprayed",id:"spiky"}}};function Ra(i=0){let e=0;for(let o=i;o<ln.length;o++)e+=ln[o].weight;let t=Math.random()*e,n=i;for(let o=i;o<ln.length;o++)if(t-=ln[o].weight,t<=0){n=o;break}let s=h.pick(Object.keys(ei)),r=ei[s];return{slot:s,rarity:n,name:h.pick(r.names[n]),stat:r.stat(ln[n].mult),perk:n===3?r.perk.id:null}}h.rollItem=Ra;var Nh=i=>ei[i.slot].text(i.stat)+(i.perk?` \xB7 ${ei[i.slot].perk.text}`:"");function wf(i){let e=i.gear;i.speedMul=1+(e.boots?e.boots.stat.speed:0),i.armor=e.vest?e.vest.stat.armor:0;let t=e.pants?e.pants.stat.hp:0,n=i.maxHp;i.maxHp=100+t,i.hp=Math.min(i.maxHp,i.hp+Math.max(0,i.maxHp-n)),i.perks=new Set(Object.values(e).filter(o=>o&&o.perk).map(o=>o.perk));let s=i.model.M,r=(o,a,l)=>{o.color.setHex(a?h.lerpHex(l,ln[a.rarity].color,.25):l),o.emissive.setHex(a?ln[a.rarity].color:0),o.emissiveIntensity=a?.25+a.rarity*.15:0};r(s.boots,e.boots,1118481),r(s.pants,e.pants,2376318),r(s.vest,e.vest,1777449)}h.lerpHex=(i,e,t)=>new xe(i).lerp(new xe(e),t).getHex();function Ef(i){let e=h.store.get("mo_gear_"+i.name.toLowerCase(),{});i.gear={boots:e.boots||null,pants:e.pants||null,vest:e.vest||null},wf(i)}var Av=i=>h.store.set("mo_gear_"+i.name.toLowerCase(),i.gear),yi=[],Aa={};function Rv(i){let e=ln[i.rarity];Aa[e.key]||(Aa[e.key]=new pt({color:e.color,transparent:!0,opacity:.32,blending:Mn,depthWrite:!1,toneMapped:!1,side:Ht}));let t=new at,n=new fe(new tt(.22,.45,7,14,1,!0),Aa[e.key]);n.position.y=3.5,t.add(n);let s=new fe(new $n(.5,.75,28),Aa[e.key]);s.rotation.x=-Math.PI/2,s.position.y=.04,t.add(s);let r=new Oe({color:e.color,emissive:e.color,emissiveIntensity:.9,roughness:.3,metalness:.4}),o=new at;if(i.slot==="boots")[-.12,.12].forEach(a=>{let l=new fe(new Pe(.18,.22,.36),r);l.position.set(a,0,.05),o.add(l)});else if(i.slot==="pants"){[-.1,.1].forEach(l=>{let c=new fe(new Sn(.08,.45,2,8),r);c.position.set(l,-.1,0),o.add(c)});let a=new fe(new Pe(.38,.12,.18),r);a.position.y=.22,o.add(a)}else{let a=new fe(new Pe(.44,.5,.2),r);o.add(a)}return o.position.y=.9,t.add(o),t.userData.item=o,t}var Wn={drops:yi,reset(){for(let i of yi)h.R.scene.remove(i.mesh);yi.length=0},spawn(i,e,t){if(yi.length>=5)return;let n=Rv(i);n.position.set(e,0,t),h.R.scene.add(n),yi.push({it:i,x:e,z:t,mesh:n,t:0});let s=ln[i.rarity];h.FX.float(e,2.6,t,`${s.label.toUpperCase()}: ${i.name}`,s.css,16,2.4),h.audio.play("pickup",.6)},maybeDrop(i,e,t=.012,n=0){Math.random()<t&&Wn.spawn(Ra(n),i,e)},update(i,e){for(let t=yi.length-1;t>=0;t--){let n=yi[t];n.t+=i,n.mesh.userData.item.rotation.y+=i*1.8,n.mesh.userData.item.position.y=.9+Math.sin(e*2.5+n.x)*.12;for(let s of h.officers)if(!(s.down||(s.x-n.x)**2+(s.z-n.z)**2>1.7)){Wn.pickUp(s,n.it),h.R.scene.remove(n.mesh),yi.splice(t,1);break}}},collectAll(){for(let i of yi.splice(0)){h.R.scene.remove(i.mesh);let e=h.officers.filter(t=>!t.down).sort((t,n)=>(t.x-i.x)**2+(t.z-i.z)**2-((n.x-i.x)**2+(n.z-i.z)**2))[0]||h.officers[0];e&&Wn.pickUp(e,i.it)}},pickUp(i,e){let t=i.gear[e.slot],n=ln[e.rarity];if(!t||e.rarity>t.rarity||e.rarity===t.rarity&&JSON.stringify(e.stat)>JSON.stringify(t.stat))i.gear[e.slot]=e,wf(i),Av(i),h.FX.float(i.x,2.8,i.z,`EQUIPPED: ${e.name}`,n.css,18,2.2),h.toast(`${i.name} equipped ${n.label} ${ei[e.slot].label}: ${e.name} (${Nh(e)})`),h.FX.sparks(i.x,1,i.z,24,n.color),h.audio.play("win",.5);else{let r=25*(e.rarity+1);i.score+=r,h.FX.float(i.x,2.6,i.z,`Sold to commissary +${r}`,"#cfcfcf",14,1.6),h.audio.play("pickup",.6)}}};h.Loot=Wn;var it={balls:[],pickups:[],hazards:[],nades:[]};h.C=it;h.officers=[];var Rt=[],js={launcher:{label:"40mm Less-Lethal",rate:2.2,dmg:60,speed:30,knock:17,sting:.8,pellets:1,spread:.02,life:.9,color:10477823,size:.2,sound:"boom",kick:.2},pepperball:{label:"Pepperball",rate:8,dmg:21,speed:34,knock:3,sting:.35,pellets:1,spread:.04,life:.9,color:16751146,size:.11,sound:"pop"},shotgun:{label:"Shotgun",rate:1.7,dmg:17,speed:38,knock:9,sting:0,pellets:8,spread:.32,life:.32,color:16769162,size:.07,sound:"boom",kick:.35},ar:{label:"AR-15",rate:11,dmg:34,speed:55,knock:4,sting:0,pellets:1,spread:.035,life:.7,color:16773808,size:.07,sound:"crack",kick:.08}},Bi={oc:{label:"Orange OC",range:6.5,cone:.45,dps:30,blind:3.2,drain:22,puff:.25},vapor:{label:"OC Vapor",range:8.5,cone:.7,dps:34,blind:4.5,drain:26,puff:.5,linger:!0}},ls=[{at:0,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"oc",nades:!1},{at:20,rank:"CO II",title:"Correctional Officer II",gun:"pepperball",spray:"vapor",nades:!1,news:"OC Vapor issued. It hangs in the air. Do NOT walk into your own cloud."},{at:45,rank:"SGT.",title:"Sergeant",gun:"launcher",spray:"vapor",nades:!1,news:"Congrats, Sgt. {hero}. Here is a 40mm less-lethal launcher. Still no raise."},{at:85,rank:"SGT.",title:"Sergeant",gun:"shotgun",spray:"vapor",nades:!1,news:"Armory approved the shotgun. Sign here, here, and here."},{at:130,rank:"LT.",title:"Lieutenant",gun:"ar",spray:"vapor",nades:!0,news:"Lieutenant {hero}! AR-15 and grenades approved. Please do not grenade the PREA poster."}],ti={time:12,hurtGain:.6,swing:.32,range:3.4,dmg:9999,bossDmg:260,knock:19,sprint:1.4,sprintDrain:16};h.coPower=h.coPower||function(i){};var ki={cd:5,fuse:.8,radius:4.6,dmg:140,knock:15},ni={gun:js.pepperball,spray:Bi.oc,baton:{range:2.4,arc:1.15,dmg:48,knock:11,time:.28,cd:.42},dash:{speed:21,time:.18,cost:22,dmg:10,knock:9},move:6.2},Wr=class{constructor(e,t,n,s){this.slot=e,this.name=h.cleanName(t),this.gender=n,this.device=s,this.model=Ta({gender:n,slot:e}),h.R.scene.add(this.model.root),this.x=0,this.z=0,this.r=.42,this.yaw=0,this.ax=0,this.az=1,this.reset(),Ef(this)}reset(){this.hp=this.maxHp=100+(this.gear&&this.gear.pants?this.gear.pants.stat.hp:0),this.energy=100,this.down=!1,this.reviveT=0,this.fireCD=0,this.swingT=0,this.swingCD=0,this.dashT=0,this.iframes=0,this.slowT=0,this.tacoT=0,this.drinkT=0,this.hurtT=0,this.tauntT=3,this.sprayT=0,this.spraying=!1,this.kills=0,this.score=0,this.move=0,this.kvx=0,this.kvz=0,this.ot=this.ot||0,this.otT=0,this.otSwingT=0,this.sprinting=!1,this.hammer&&(this.hammer.visible=!1,this.model.root.scale.setScalar(1))}remove(){h.R.scene.remove(this.model.root)}hurt(e,t,n,s,r=3){if(this.down||this.iframes>0)return;if(e*=1-(this.armor||0),this.perks&&this.perks.has("spiky")){h.grid.query(t,n,1.2,Rt);for(let c of Rt)c.dead||(c.ocT=Math.max(c.ocT,2.5))}this.otT>0?e*=.4:this.ot=Math.min(100,(this.ot||0)+e*ti.hurtGain),this.hp-=e,this.hurtT=.35;let o=this.x-t,a=this.z-n,l=Math.hypot(o,a)||1;this.kvx+=o/l*r,this.kvz+=a/l*r,h.R.shake=Math.min(.6,h.R.shake+e*.02),h.R.split=Math.min(1,h.R.split+e*.06),h.audio.play("hurt",.7),s!=="spit"&&s!=="cup"&&h.FX.blood(this.x,1.3,this.z,o/l,a/l,4),this.hp<=0&&(this.hp=0,this.down=!0,h.FX.float(this.x,2.5,this.z,`${this.name} IS DOWN!`,"#ff5050",20,2.5),h.audio.play("alarm",1))}update(e){let t=this.model,n=this.device.read(this);if(this.iframes=Math.max(0,this.iframes-e),this.hurtT=Math.max(0,this.hurtT-e),this.tacoT=Math.max(0,this.tacoT-e),this.drinkT=Math.max(0,this.drinkT-e),this.zynT=Math.max(0,(this.zynT||0)-e),this.slowT=Math.max(0,this.slowT-e),this.rallyT=Math.max(0,(this.rallyT||0)-e),this.fireCD-=e,this.swingCD-=e,this.tauntT-=e,this.nadeCD=(this.nadeCD||0)-e,this.down){zi(t,e,0,0,!1,1),t.root.position.set(this.x,0,this.z);return}this.perks&&this.perks.has("regen")&&(this.hp=Math.min(this.maxHp,this.hp+2*e)),this.sprinting=!!n.sprint&&this.energy>1&&Math.hypot(n.mx,n.mz)>.2&&!(this.otT>0),this.sprinting&&(this.energy=Math.max(0,this.energy-ti.sprintDrain*e)),n.ot&&this.ot>=100&&!(this.otT>0)&&this.startOT(),this.otT>0&&(this.otT-=e,this.otSwingT-=e,this.otSwingT<=0&&(this.otSwingT=ti.swing,this.swingT=.001,this.hitDone=!1,h.audio.play("swing",1)),this.otT<=0&&this.endOT());let s=ni.move*(this.speedMul||1)*(this.sprinting?ti.sprint:1)*(this.otT>0?1.15:1)*(this.drinkT>0?1.3:1)*(this.slowT>0?.6:1)*(this.spraying?.75:1),r=n.mx,o=n.mz,a=Math.hypot(r,o);if(a>1&&(r/=a,o/=a),this.dashT>0){this.dashT-=e,r=this.dashX,o=this.dashZ,s=ni.dash.speed,h.grid.query(this.x,this.z,1.3,Rt);for(let c of Rt)!c.dead&&!c.dashHit&&(c.dashHit=!0,h.AI.damage(c,ni.dash.dmg*this.dmgMul(),this.x,this.z,ni.dash.knock,"dash",this))}else if(n.dash&&this.energy>=ni.dash.cost&&a>.2){this.perks&&this.perks.has("freeDash")||(this.energy-=ni.dash.cost),this.dashT=ni.dash.time,this.iframes=.28,this.dashX=r/(a>1?1:a||1),this.dashZ=o/(a>1?1:a||1);for(let c of h.AI.list)c.dashHit=!1;h.audio.play("dash")}this.x+=(r*s+this.kvx)*e,this.z+=(o*s+this.kvz)*e;let l=Math.exp(-e*8);if(this.kvx*=l,this.kvz*=l,h.W.collide(this),this.move=h.lerp(this.move,Math.min(1,Math.hypot(r,o)),e*10),n.ax||n.az){let c=Math.hypot(n.ax,n.az);this.ax=n.ax/c,this.az=n.az/c}this.yaw=Math.atan2(this.ax,this.az),this.spraying=n.spray&&this.energy>0,!this.spraying&&!this.sprinting&&(this.energy=Math.min(100,this.energy+e*(this.drinkT>0?30:9))),n.fire&&this.fireCD<=0&&this.swingT<=0&&!this.sprinting&&!(this.otT>0)&&this.shoot(),this.spraying&&this.spray(e),n.nade&&h.S.nades&&this.nadeCD<=0&&this.throwNade(n),n.melee&&this.swingCD<=0&&(this.swingT=.001,this.swingCD=ni.baton.cd,this.hitDone=!1,h.audio.play("swing")),this.swingT>0&&(this.swingT+=e/ni.baton.time,!this.hitDone&&this.swingT>.4&&(this.hitDone=!0,this.baton()),this.swingT>=1&&(this.swingT=0)),zi(t,e,this.move,this.swingT,n.fire&&!this.sprinting&&!(this.otT>0)||this.spraying,0),this.otT>0&&(t.baton.visible=!1,t.gun.visible=!1,this.hammer.visible=!0),t.root.position.set(this.x,0,this.z),t.root.rotation.y=this.yaw,t.ring.material.opacity=this.iframes>0?.3:.85}startOT(){this.ot=0,this.otT=ti.time,this.otSwingT=0,this.hammer||(this.hammer=Uv(this.model)),this.model.root.scale.setScalar(1.3),h.showCard&&h.showCard("MANDATORY OVERTIME",h.pick(Nv),!0,2600),h.say&&h.say("SUPERVISOR",h.pick(["You are mandated. Sixteen hours. Have fun.","Congratulations, you just got mandated. Go nuts.","Overtime approved. Payroll is crying. Clean house."]),3.5),h.audio.play("siren"),h.R.shake=.8,document.body.classList.add("assault","overtime"),h.coPower(this)}endOT(){this.otT=0,this.model.root.scale.setScalar(1),this.hammer&&(this.hammer.visible=!1),h.officers.some(e=>e.otT>0)||document.body.classList.remove("assault","overtime"),h.FX.float(this.x,3,this.z,h.pick(["Clocked out.","Shift over. Back to normal pay.","OT done. Knees hurt."]),"#ffd24a",18,2)}dmgMul(){return(this.zynT>0?1.35:1)*(this.tacoT>0?1.5:1)*(this.rallyT>0?1.3:1)}flashShoot(){h.R.flashBoost=1;let e=13,t=.3;h.grid.query(this.x,this.z,e,Rt);for(let n of Rt){if(n.dead||n.caged)continue;let s=n.x-this.x,r=n.z-this.z,o=Math.hypot(s,r);o>e||o<.01||Math.acos(h.clamp((s*this.ax+r*this.az)/o,-1,1))>t||h.W.los(this.x,this.z,n.x,n.z)&&(n.ocT=Math.max(n.ocT,1.2),n.flashedT=.3,h.AI.damage(n,(o<5?6:3)*this.dmgMul(),this.x,this.z,.5,"flash",this))}Math.random()<.6&&h.FX.glow.spawn(this.x+this.ax*h.rand(1,9),1.3,this.z+this.az*h.rand(1,9),0,0,0,.12,.3,16773832,0),Math.random()<.25&&h.audio.play("spray",.25)}shoot(){let e=js[h.S.gun]||js.pepperball;h.S.def&&h.S.def.night&&(this.flashShoot(),h.R.muzzle(this.x+this.ax*1.2,this.z+this.az*1.2,e.pellets>1||e.sound==="boom"?1:.6));let n=e.rate*(this.drinkT>0?1.5:1);this.fireCD=1/n;let s=this.ax,r=this.az,o=.985;h.grid.query(this.x,this.z,16,Rt);for(let a of Rt){if(a.dead)continue;let l=a.x-this.x,c=a.z-this.z,u=Math.hypot(l,c)||1,d=(l*this.ax+c*this.az)/u;d>o&&(o=d,s=l/u,r=c/u)}for(let a=0;a<e.pellets;a++){let l=h.rand(-e.spread,e.spread),c=Math.cos(l),u=Math.sin(l),d=s*c-r*u,f=s*u+r*c,p=e.speed*h.rand(.9,1.1);it.balls.push({x:this.x+d*.6,z:this.z+f*.6,y:1.3,vx:d*p,vz:f*p,life:e.life,owner:this,gun:e})}e.kick&&(this.kvx-=s*e.kick*10,this.kvz-=r*e.kick*10,h.R.shake=Math.min(.5,h.R.shake+e.kick*.5)),h.FX.glow.spawn(this.x+s*.9,1.3,this.z+r*.9,0,0,0,.05,e.pellets>1?.35:.22,16770976,0),h.audio.play(e.sound,.6)}spray(e){if(this.energy=Math.max(0,this.energy-(Bi[h.S.spray]||Bi.oc).drain*e),this.sprayT-=e,this.sprayT>0)return;this.sprayT=.07;let t=Bi[h.S.spray]||Bi.oc,n=t.cone*3;(t.linger?h.FX.mist:h.FX.cloud)(this.x+this.ax*.8,1.35,this.z+this.az*.8,this.ax*t.range*2.2+h.rand(-n,n),this.az*t.range*2.2+h.rand(-n,n),t.puff),t.linger&&Math.random()<.35&&it.hazards.push({x:this.x+this.ax*t.range*.7,z:this.z+this.az*t.range*.7,r:2.4,t:5,owner:this}),h.audio.play("spray",.6),h.grid.query(this.x,this.z,t.range,Rt);for(let r of Rt){if(r.dead)continue;let o=r.x-this.x,a=r.z-this.z,l=Math.hypot(o,a);l>t.range||l<.01||Math.acos(h.clamp((o*this.ax+a*this.az)/l,-1,1))>t.cone||h.W.los(this.x,this.z,r.x,r.z)&&(r.ocT=t.blind,h.AI.damage(r,t.dps*.07*this.dmgMul(),this.x,this.z,.6,"oc",this))}}throwNade(e){this.nadeCD=ki.cd;let t=Math.hypot(e.ax||0,e.az||0),n=t>2.5?h.clamp(t,3,12):9,s=ki.fuse;it.nades.push({x:this.x+this.ax*.6,z:this.z+this.az*.6,y:1.6,vx:this.ax*n/s,vz:this.az*n/s,vy:4.5,t:s,owner:this,mesh:null}),h.audio.play("swing",1),h.FX.float(this.x,2.6,this.z,h.pick(["FRAG OUT!","GRENADE!","Fire in the hole!"]),"#ffcf4a",17,1.2)}baton(){if(this.otT>0)return this.hammerHit();let e=ni.baton;h.grid.query(this.x,this.z,e.range+.6,Rt);let t=0;for(let n of Rt){if(n.dead)continue;let s=n.x-this.x,r=n.z-this.z,o=Math.hypot(s,r);if(o>e.range+n.r||o>.5&&Math.acos(h.clamp((s*this.ax+r*this.az)/o,-1,1))>e.arc)continue;let a=n.ocT>0?2:1,l=h.AI.damage(n,e.dmg*a*this.dmgMul(),this.x,this.z,e.knock*(a>1?1.4:1),"baton",this);h.FX.sparks(n.x,1.3*n.scale,n.z,5,16777215),t++,a>1&&t===1&&h.FX.float(n.x,2.6,n.z,"BLIND SIDE!","#ffdd55",16,1),l&&this.taunt()}t&&(h.audio.play("crack"),h.R.shake=Math.min(.7,h.R.shake+.12+t*.03),h.S.hitStop=.04,h.R.flashOn&&h.R.muzzle(this.x+this.ax*1.5,this.z+this.az*1.5,.5))}hammerHit(){h.grid.query(this.x,this.z,ti.range+.6,Rt);let e=0;for(let t of Rt){if(t.dead||t.caged)continue;let n=t.x-this.x,s=t.z-this.z;Math.hypot(n,s)>ti.range+t.r||(h.AI.damage(t,t.boss?ti.bossDmg:ti.dmg,this.x,this.z,ti.knock,"hammer",this),h.FX.sparks(t.x,1.3*t.scale,t.z,8,16765514),e++)}e&&Math.random()<.5&&h.FX.float(this.x+this.ax*2,.8,this.z+this.az*2,h.pick(["*CLOCK IN*","DING!","*PUNCH*","BONK","OT!"]),"#ffd24a",15,.6),e&&(h.audio.play("crack",1),h.R.shake=Math.min(.9,h.R.shake+.25),h.S.hitStop=.05,h.R.flashOn&&h.R.muzzle(this.x,this.z,1.2))}taunt(){this.tauntT>0||Math.random()>.3||(this.tauntT=h.rand(4,7),h.FX.float(this.x,2.5,this.z,h.pick(tf),"#9fd0ff",16,1.8))}},ii,Cv=new P(0,0,1),Tf=new ze,Af=new Vt,Rf=new P,Iv=new P,Cf=new xe;it.init=function(i){ii=new rn(new Et(1,8,6),new pt({toneMapped:!1}),400),ii.frustumCulled=!1,ii.count=0,ii.setColorAt(0,Cf.set(1,1,1)),i.add(ii);for(let e=0;e<4;e++){let t=new fe(new Et(1,20,14),new pt({color:16756816,transparent:!0,opacity:0,depthWrite:!1,blending:Mn,toneMapped:!1}));t.visible=!1,i.add(t),Ca.push({mesh:t,t:0,x:0,z:0})}};var Ca=[],Pv=new Et(.13,10,8),Uh=null;it.reset=function(){for(let i of it.nades)i.mesh&&h.R.scene.remove(i.mesh);it.balls.length=0,it.hazards.length=0,it.nades.length=0;for(let i of it.pickups)h.R.scene.remove(i.mesh);it.pickups.length=0};it.update=function(i,e){let t=0;for(let n=it.balls.length-1;n>=0;n--){let s=it.balls[n];s.life-=i;let r=2,o=s.life<=0;for(let u=0;u<r&&!o;u++){if(s.x+=s.vx*i/r,s.z+=s.vz*i/r,h.W.blocked(s.x,s.z)){h.FX.sparks(s.x,s.y,s.z,4,16751146),o=!0;break}h.grid.query(s.x,s.z,.8,Rt);for(let d of Rt)if(!d.dead&&(d.x-s.x)**2+(d.z-s.z)**2<(d.r+.12)**2){let f=h.AI.damage(d,s.gun.dmg*s.owner.dmgMul(),s.x-s.vx,s.z-s.vz,s.gun.knock,"ball",s.owner);s.gun.sting&&(d.ocT=Math.max(d.ocT,s.gun.sting)),h.FX.sparks(s.x,s.y,s.z,h.R.flashOn?8:3,h.R.flashOn?16765066:16751146),h.FX.cloud(s.x,s.y,s.z,0,0,.15),h.R.flashOn&&h.R.muzzle(s.x,s.z,.35),h.audio.play("thud",.4),f&&s.owner.taunt(),o=!0;break}}if(o){it.balls.splice(n,1);continue}let a=h.R.flashOn,l=s.gun.size*(a?1.8:1),c=s.gun.speed>40?5:a?2.5:1;a&&Math.random()<.5&&h.FX.glow.spawn(s.x,s.y,s.z,0,0,0,.12,l*.8,s.gun.color,0),Af.setFromUnitVectors(Cv,Rf.set(s.vx,0,s.vz).normalize()),Tf.compose(Rf.set(s.x,s.y,s.z),Af,Iv.set(l,l,l*c)),ii.setMatrixAt(t,Tf),ii.setColorAt(t,Cf.setHex(s.gun.color)),t++}ii.count=t,ii.instanceMatrix.needsUpdate=!0,ii.instanceColor.needsUpdate=!0;for(let n=it.nades.length-1;n>=0;n--){let s=it.nades[n];s.mesh||(Uh=Uh||new Oe({color:4016682,roughness:.6,metalness:.3}),s.mesh=new fe(Pv,Uh),s.mesh.castShadow=!0,h.R.scene.add(s.mesh)),s.t-=i,s.vy-=12*i;let r=s.x+s.vx*i,o=s.z+s.vz*i;if(h.W.blocked(r,o)?(s.vx*=-.4,s.vz*=-.4):(s.x=r,s.z=o),s.y+=s.vy*i,s.y<.15&&(s.y=.15,s.vy=Math.abs(s.vy)*.35,s.vx*=.6,s.vz*=.6),s.mesh.position.set(s.x,s.y,s.z),s.mesh.rotation.x+=i*12,Math.random()<.5&&h.FX.glow.spawn(s.x,s.y+.1,s.z,0,.3,0,.1,.06,16764006,0),s.t>0)continue;h.R.scene.remove(s.mesh),it.nades.splice(n,1);let a=Ca.find(l=>l.t<=0)||Ca[0];a.t=.45,a.x=s.x,a.z=s.z,h.FX.sparks(s.x,.8,s.z,40,16760928),h.R.flashOn&&h.R.muzzle(s.x,s.z,2.5);for(let l=0;l<10;l++)h.FX.cloud(s.x+h.rand(-1.5,1.5),.8,s.z+h.rand(-1.5,1.5),h.rand(-3,3),h.rand(-3,3),.9,7236196);h.audio.play("boom",1.4),setTimeout(()=>h.audio.play("boom",.8),90),h.R.shake=Math.min(1,h.R.shake+.7),h.S.hitStop=.06,h.grid.query(s.x,s.z,ki.radius+1,Rt);for(let l of Rt.slice()){if(l.dead||l.caged)continue;let c=Math.hypot(l.x-s.x,l.z-s.z);c>ki.radius+l.r||h.AI.damage(l,ki.dmg*(1-.6*c/ki.radius)*s.owner.dmgMul(),s.x,s.z,ki.knock,"nade",s.owner)}}for(let n of Ca){if(n.t<=0){n.mesh.visible=!1;continue}n.t-=i;let s=1-n.t/.45;n.mesh.visible=!0,n.mesh.position.set(n.x,.8,n.z),n.mesh.scale.setScalar(.6+ki.radius*Math.sqrt(s)),n.mesh.material.opacity=(1-s)*.9,n.mesh.material.color.setHex(s<.25?16773312:16742944)}for(let n=it.hazards.length-1;n>=0;n--){let s=it.hazards[n];if(s.t-=i,s.t<=0){it.hazards.splice(n,1);continue}Math.random()<i*2.5&&h.FX.mist(s.x+h.rand(-1.2,1.2),.7,s.z+h.rand(-1.2,1.2),h.rand(-1.5,1.5),h.rand(-1.5,1.5),.6),h.grid.query(s.x,s.z,s.r,Rt);for(let r of Rt)!r.dead&&(r.x-s.x)**2+(r.z-s.z)**2<s.r*s.r&&(r.ocT=Math.max(r.ocT,1.5),Math.random()<i*3&&h.AI.damage(r,2,s.x,s.z,.2,"oc",s.owner))}for(let n=it.pickups.length-1;n>=0;n--){let s=it.pickups[n];s.t+=i,s.mesh.position.y=.55+Math.sin(e*3+s.x)*.12,s.mesh.rotation.y+=i*2;for(let r of h.officers)if(!(r.down||(r.x-s.x)**2+(r.z-s.z)**2>.9)){if(s.kind==="taco")r.hp=Math.min(r.maxHp,r.hp+30),r.tacoT=12;else if(s.kind==="gold"){let o=new Set(h.store.get("sa_gold",[]));o.add(h.S.def.key),h.store.set("sa_gold",[...o]),r.hp=r.maxHp,r.tacoT=20,o.size>=3&&!h.store.get("sa_bigbro",!1)?(h.store.set("sa_bigbro",!0),h.showCard("BIG BRO MODE UNLOCKED","Caleb Alaniz now rides the whole shift with you. I got you bro.",!0,4200)):h.FX.float(r.x,3,r.z,`GOLDEN TACO ${o.size}/3`,"#ffd34d",24,2.2)}else if(s.kind==="zyn")r.hp=Math.min(r.maxHp,r.hp+35),r.zynT=10,h.FX.sparks(r.x,1.6,r.z,14,16738842);else if(s.kind==="chew"){r.hp=Math.min(r.maxHp,r.hp+55),h.grid.query(r.x,r.z,5,Rt);let o=null,a=26;for(let l of Rt){if(l.dead)continue;let c=(l.x-r.x)**2+(l.z-r.z)**2;c<a&&(a=c,o=l)}o&&(o.ocT=4,h.FX.spit(r.x,1.5,r.z,o.x-r.x,o.z-r.z),h.FX.float(o.x,2.4,o.z,"TOBACCO IN THE EYE!","#c79a5a",16,1.4))}else r.energy=100,r.drinkT=10;h.FX.float(r.x,2.6,r.z,h.pick(rf[s.kind]),Lv[s.kind],20,1.6),h.audio.play("pickup"),h.R.scene.remove(s.mesh),it.pickups.splice(n,1);break}s.t>30&&s.kind!=="gold"&&it.pickups[n]===s&&(h.R.scene.remove(s.mesh),it.pickups.splice(n,1))}};var Lv={gold:"#ffd34d",taco:"#ffcf4a",drink:"#7dff6a",zyn:"#ff7a2a",chew:"#c79a5a"},At={};function Dv(i){At.ready||(At.shell=new Oe({color:15909198,roughness:.6}),At.meat=new Oe({color:7027486,roughness:.8}),At.lettuce=new Oe({color:6275642,roughness:.8}),At.can=new Oe({color:1118481,roughness:.25,metalness:.8}),At.logo=new pt({color:7012154,toneMapped:!1}),At.zynLid=new Oe({color:16054008,roughness:.35,metalness:.2}),At.zynBand=new Oe({color:2060246,emissive:16730640,emissiveIntensity:.9,roughness:.4}),At.chewLid=new Oe({color:2759954,roughness:.5,metalness:.3}),At.chewBand=new Oe({color:13214282,roughness:.35,metalness:.7}),At.ring=new pt({color:16777215,transparent:!0,opacity:.5,toneMapped:!1}),At.ready=!0);let e=new at;if(i==="taco"||i==="gold"){let n=new fe(new tt(.34,.34,.2,18,1,!0,0,Math.PI),At.shell);n.rotation.z=Math.PI/2,n.material.side=Ht;let s=new fe(new Pe(.16,.12,.55),At.meat);s.position.y=.06;let r=new fe(new Pe(.2,.06,.5),At.lettuce);if(r.position.y=.14,e.add(n,s,r),e.scale.setScalar(1.3),i==="gold"){let o=new Oe({color:16765773,emissive:9067008,emissiveIntensity:1.4,metalness:1,roughness:.2});e.traverse(a=>{a.isMesh&&(a.material=o)})}}else if(i==="zyn"||i==="chew"){let n=i==="zyn",s=new fe(new tt(.3,.3,.12,24),n?At.zynBand:At.chewBand),r=new fe(new tt(.31,.31,.05,24),n?At.zynLid:At.chewLid);r.position.y=.08,e.add(s,r),e.rotation.x=.5}else{let n=new fe(new tt(.13,.13,.48,16),At.can),s=new fe(new tt(.135,.135,.22,16,1,!0),At.logo);e.add(n,s)}e.traverse(n=>{n.castShadow=!0});let t=new fe(new $n(.45,.55,24),At.ring);return t.rotation.x=-Math.PI/2,t.position.y=-.5,e.add(t),e}it.spawnPickup=function(i,e,t){if(it.pickups.length>14)return;let n=Dv(i);n.position.set(e,.55,t),h.R.scene.add(n),it.pickups.push({kind:i,x:e,z:t,mesh:n,t:0})};h.dropLoot=function(i,e){let t=Math.random();t<.05?it.spawnPickup("taco",i,e):t<.09?it.spawnPickup("drink",i,e):t<.125?it.spawnPickup("zyn",i,e):t<.15&&it.spawnPickup("chew",i,e)};var Nv=["Sixteen hours. No breaks. No mercy.","Payroll is about to cry.","The time clock is a WEAPON now.","You have been mandated. They have been warned."];function Uv(i){let e=new Oe({color:16765773,emissive:8014336,emissiveIntensity:1.2,roughness:.3,metalness:1}),t=new Oe({color:5922920,roughness:.45,metalness:.6}),n=new Oe({color:16777215,emissive:16774080,emissiveIntensity:.6}),s=new Oe({color:16722458,emissive:16722458,emissiveIntensity:1.5}),r=new at,o=new fe(new tt(.05,.06,1.3,10),e);o.position.y=.55,r.add(o);let a=new fe(new Pe(.62,.5,.42),t);a.position.y=1.3,r.add(a);let l=new fe(new tt(.17,.17,.03,20),n);l.rotation.x=Math.PI/2,l.position.set(0,1.36,.22),r.add(l);let c=new fe(new Pe(.3,.05,.04),s);c.position.set(0,1.12,.22),r.add(c);for(let u of[-1,1]){let d=new fe(new Pe(.06,.56,.48),e);d.position.set(u*.34,1.3,0),r.add(d)}return r.traverse(u=>{u.isMesh&&(u.castShadow=!0)}),r.rotation.x=Math.PI/2,r.position.set(0,-.07,.05),i.baton.parent.add(r),r}var en=[];h.allies=[];var Ov={halley:{name:()=>h.CREW.halley,gender:"female",rank:"sgt",back:"SGT. MUNOZ",scale:1.02,title:"The Sergeant. The fianc\xE9e. The legend.",hp:400,time:30,speed:7.2,uniform:1914736,enter:["Sgt. Munoz on scene. Who touched my officers?","Move. Sergeant Munoz coming through.","Get up, {hero}. We are not dying on Sgt. Munoz's shift."],barks:["Sit DOWN.","That is a write-up AND a beatdown.","You wanna PREA me? Fill out the form.","Who trained you, {hero}? Oh right. Me.","Somebody get these men a timeout.","I did not do my hair for this.","Tase first, paperwork later."],leave:["Clean this up, family. I have a wedding to plan.","Sgt. Munoz out. Proud of every one of you.","Good work, family. Go home safe tonight. That is an order."]},caleb:{name:()=>h.CREW.caleb,gender:"male",back:"ALANIZ",scale:1.15,title:"Six-four of pure overtime. A real one.",hp:300,time:20,speed:6.8,uniform:2376318,enter:["I got you bro.","I got you bro. Caleb Alaniz on scene.","I got you bro. Get behind me.","Bro. BRO. I got you."],barks:["You wanna fuck on me?","I got you bro.","Nobody touches my brother.","Bro, I got this side.","Six-four of pure overtime, baby!","Bro, that was a flag on the play.","Hold my energy drink.","You good, {hero}? Eat a taco, bro.","Ref! REF!","Touchdown, baby!"],leave:["Gotta bounce, bro. My truck is double-parked.","Alaniz out. Love y'all. Stay up, family.","Caleb out. Proud to work with y'all, for real."]},bernardo:{name:()=>h.CREW.bernardo,gender:"male",back:"CORRECTIONS",scale:1.08,hp:500,time:22,speed:6.2,uniform:2376318,enter:["Bernardo on scene. Hey, you wanna see how big my truck is? After this.","SHIELD UP! Bernardo\u2019s here!","Who called for the big shield and the bigger truck?"],barks:hf,leave:["Shield\u2019s going back in the truck. The BIG truck.","Bernardo out. Somebody owes me twenty on Sunday."]},dustin:{name:()=>h.CREW.dustin,gender:"male",back:"DAVIS",scale:1,title:"Undefeated trash-talk champion of the DOC.",hp:300,time:22,speed:7,uniform:2376318,enter:["Dustin Davis on scene. Who wants to get roasted?","Officer Davis is here. Y\u2019all look like a group photo of bad decisions.","Dustin Davis in the building. Somebody hold my energy drink."],barks:["Fourth taco of the shift, baby.","I talk trash for a living. Overtime pays double.","They can\u2019t handle the truth. Or the roast."],leave:["Davis out. Somebody hand them some aloe for that burn.","Roast complete. Dustin Davis out. Love you, family."]}},Oh=class{constructor(e,t,n){let s=this.d=Ov[e];if(this.key=e,this.name=s.name(),this.model=Ta({gender:s.gender,rank:s.rank,back:s.back,ringColor:e==="halley"?16765773:16777215,uniform:s.uniform,scale:s.scale,skin:e==="halley"?13011550:void 0,hair:e==="halley"?1709072:void 0}),h.R.scene.add(this.model.root),e==="bernardo"){let r=new fe(new Pe(.06,.95,.62),new Oe({color:11063536,roughness:.08,metalness:.1,transparent:!0,opacity:.45}));r.position.set(-.05,-.38,.28),r.rotation.y=Math.PI/2,this.model.armL.add(r),this.model.holdL=!0}Object.assign(this,{x:t,z:n,r:.45,yaw:0,hp:s.hp,t:s.time,down:!1,isAlly:!0,move:0,swingT:0,cd:.5,tazeCD:0,slamCD:2,sprayT:0,barkT:h.rand(4,7),leaving:!1}),h.FX.sparks(t,1,n,20,16765773),h.FX.float(t,2.8,n,`${this.name.toUpperCase()} ON SCENE`,e==="halley"?"#ffd34d":"#9fd0ff",22,2.2),h.showCard&&h.showCard(`${this.name.toUpperCase()}`,`ON SCENE \xB7 ${s.title||""}`,!1,2800),this.tag=document.createElement("div"),this.tag.className="nametag"+(e==="halley"?" gold":""),this.tag.textContent=this.name,document.getElementById("floaters").appendChild(this.tag),h.say(this.name,h.pick(s.enter))}hurt(e){this.hp-=e*.5,this.model.root.children[0]&&(this.flash=.2),this.hp<=0&&(this.t=0)}remove(){h.R.scene.remove(this.model.root),this.tag&&this.tag.remove()}update(e){let t=this.d;if(this.t-=e,this.cd-=e,this.tazeCD-=e,this.slamCD-=e,this.barkT-=e,this.t<=0&&!this.leaving)return this.leaving=!0,h.say(this.name,h.pick(t.leave)),h.FX.sparks(this.x,1,this.z,16,16777215),!1;if(this.leaving)return!1;if(this.barkT<=0&&(this.barkT=h.rand(5,9),h.FX.float(this.x,2.7,this.z,h.t(h.pick(t.barks),Fv()),this.key==="halley"?"#ffd34d":"#9fd0ff",15,1.8)),this.key==="caleb"){let l=h.officers.find(c=>c.down);if(l){let c=l.x-this.x,u=l.z-this.z,d=Math.hypot(c,u)||1;if(d<1.4)l.down=!1,l.hp=Math.max(l.hp,55),l.iframes=2,h.FX.float(l.x,2.6,l.z,"GET UP BRO. I GOT YOU.","#9fd0ff",20,2),this.bigBroSlam();else{if(this.yaw=Math.atan2(c,u),this.x+=c/d*this.d.speed*1.2*e,this.z+=u/d*this.d.speed*1.2*e,h.W.collide(this),this.move=h.lerp(this.move,1,e*8),zi(this.model,e,this.move,0,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[f,p,y]=h.R.worldToScreen(this.x,2.6*(this.d.scale||1),this.z);this.tag.style.transform=`translate(${f|0}px, ${p|0}px) translate(-50%, -50%)`,this.tag.style.opacity=y?1:0}return!0}}}if(this.key==="caleb")for(let l of h.officers)!l.down&&(l.x-this.x)**2+(l.z-this.z)**2<16&&(l.hp=Math.min(l.maxHp,l.hp+6*e));let n=h.officers.find(l=>!l.down)||h.officers[0],s=null,r=1e9;h.grid.query(n.x,n.z,16,en);for(let l of en){if(l.dead)continue;let c=(l.x-this.x)**2+(l.z-this.z)**2;c<r&&(r=c,s=l)}let o=0,a=0;if(s){let l=Math.sqrt(r),c=(s.x-this.x)/l,u=(s.z-this.z)/l;this.yaw=Math.atan2(c,u),l>1.6&&(o=c,a=u),this.key==="halley"?this.halleyMoves(s,l,c,u):this.key==="bernardo"?this.bernardoMoves(s,l):this.key==="dustin"?this.dustinMoves(s,l,c,u):this.calebMoves(s,l,c,u,e)}else if((n.x-this.x)**2+(n.z-this.z)**2>9){let l=n.x-this.x,c=n.z-this.z,u=Math.hypot(l,c);o=l/u,a=c/u,this.yaw=Math.atan2(o,a)}if(this.x+=o*t.speed*e,this.z+=a*t.speed*e,h.W.collide(this),this.move=h.lerp(this.move,Math.hypot(o,a),e*8),this.swingT>0&&(this.swingT+=e/.3,this.swingT>=1&&(this.swingT=0)),zi(this.model,e,this.move,this.swingT,!1,0),this.model.root.position.set(this.x,0,this.z),this.model.root.rotation.y=this.yaw,this.tag){let[l,c,u]=h.R.worldToScreen(this.x,2.6*(t.scale||1),this.z);this.tag.style.transform=`translate(${l|0}px, ${c|0}px) translate(-50%, -50%)`,this.tag.style.opacity=u?1:0}return!0}baton(e,t,n){this.swingT=.001,h.grid.query(this.x,this.z,t+.5,en);let s=0;for(let r of en)r.dead||(r.x-this.x)**2+(r.z-this.z)**2>t*t||(h.AI.damage(r,e,this.x,this.z,n,"baton",null),s++);return s&&(h.audio.play("crack"),h.R.shake=Math.min(.6,h.R.shake+.1)),s}halleyMoves(e,t){let n=0;h.grid.query(this.x,this.z,2.8,en);for(let s of en)s.dead||n++;if(n>=3&&this.slamCD<=0)this.slamCD=4.5,this.cd=.6,this.baton(70,3.2,14),h.FX.sparks(this.x,.3,this.z,30,16765773),h.FX.float(this.x,2.9,this.z,"TAKEDOWN!","#ffd34d",20,1.2),h.R.shake=.7,h.S.hitStop=.08;else if(t>2.5&&t<9&&this.tazeCD<=0){this.tazeCD=1.4;let s=this,r=e,o=new Set;for(let a=0;a<4&&r;a++)o.add(r),zv(s.x,s.z,r.x,r.z),r.ocT=Math.max(r.ocT,2.2),h.AI.damage(r,28,s.x,s.z,3,"taser",null),s=r,h.grid.query(r.x,r.z,4,en),r=en.find(l=>!l.dead&&!o.has(l))||null;h.audio.play("zap",.9),Math.random()<.25&&h.FX.float(e.x,2.5,e.z,h.pick(["RIDE THE LIGHTNING!","TASER TASER TASER!","Don't tase me, sis!"]),"#9fe8ff",16,1.2)}else t<1.9&&this.cd<=0&&(this.cd=.45,this.baton(55,2.2,9))}bernardoMoves(e,t){for(let n=h.AI.proj.length-1;n>=0;n--){let s=h.AI.proj[n];(s.x-this.x)**2+(s.z-this.z)**2<7&&(h.FX.sparks(s.x,s.y,s.z,6,11063536),h.AI.proj.splice(n,1))}t<2.3&&this.cd<=0&&(this.cd=.8,this.baton(40,2.6,16)&&(h.FX.float(this.x,2.7,this.z,"SHIELD BASH!","#a8d0f0",16,1),h.S.hitStop=.05))}dustinMoves(e,t,n,s){if(this.tazeCD<=0&&t<7){this.tazeCD=2.8,h.FX.float(e.x,2.6,e.z,h.pick(cf),"#ffd27a",16,2.2),h.grid.query(this.x,this.z,7,en);for(let r of en){if(r.dead||r.boss)continue;let o=r.x-this.x,a=r.z-this.z,l=Math.hypot(o,a)||1;(o*n+a*s)/l>.6&&(r.freezeT=2,r.swing=0)}h.FX.float(this.x+n*3,2.2,this.z+s*3,"ROASTED!","#ff8a3a",20,1.2)}else t<1.9&&this.cd<=0&&(this.cd=.5,this.baton(45,2.2,9))}bigBroSlam(){h.grid.query(this.x,this.z,4.5,en);for(let e of en)!e.dead&&!e.boss&&h.AI.damage(e,70,this.x,this.z,16,"baton",null);h.FX.sparks(this.x,.4,this.z,30,10473727),h.R.shake=.7,h.audio.play("crack",1),h.FX.float(this.x,3,this.z,"BIG BRO SLAM!","#9fd0ff",24,1.6)}calebMoves(e,t,n,s,r){if(this.slammed||(this.slammed=!0,this.bigBroSlam()),this.tackleCD=(this.tackleCD||3)-r,this.tackleT>0){this.tackleT-=r,this.x+=this.tx*17*r,this.z+=this.tz*17*r,h.grid.query(this.x,this.z,1.4,en);for(let o of en)!o.dead&&!o.tackled&&(o.tackled=!0,h.AI.damage(o,60,this.x,this.z,13,"dash",null));return}if(this.tackleCD<=0&&t>2.5&&t<9){this.tackleCD=h.rand(3.5,5),this.tackleT=.35,this.tx=n,this.tz=s;for(let o of h.AI.list)o.tackled=!1;h.audio.play("dash"),h.FX.float(this.x,2.8,this.z,h.pick(["SHOULDER CHECK!","MOVE!","Tackle, bro!"]),"#9fd0ff",18,1);return}if(t<2.1&&this.cd<=0)this.cd=.5,this.baton(50,2.4,10);else if(t<6&&(this.sprayT-=r,this.sprayT<=0)){this.sprayT=.1,h.FX.cloud(this.x+n,1.4,this.z+s,n*12,s*12,.25),h.grid.query(this.x,this.z,6,en);for(let o of en){if(o.dead)continue;let a=o.x-this.x,l=o.z-this.z,c=Math.hypot(a,l)||1;(a*n+l*s)/c>.85&&c<6&&(o.ocT=3,h.AI.damage(o,2,this.x,this.z,.5,"oc",null))}}}};function Fv(){return h.officers[0]&&h.officers[0].name||"Rookie"}function zv(i,e,t,n){for(let r=0;r<=8;r++){let o=r/8;h.FX.glow.spawn(h.lerp(i,t,o)+h.rand(-.15,.15),1.2+h.rand(-.2,.2),h.lerp(e,n,o)+h.rand(-.15,.15),0,0,0,.18,.09,10479871,0)}}var Hi={reset(){for(let i of h.allies)i.remove();h.allies.length=0},call(i){if(h.allies.some(o=>o.key===i))return!1;let e=h.officers.find(o=>!o.down)||h.officers[0],t=Math.random()*h.TAU,n=e.x+Math.cos(t)*3,s=e.z+Math.sin(t)*3;h.W.blocked(n,s)&&(n=e.x,s=e.z);let r=new Oh(i,n,s);if(h.allies.push(r),i==="halley"){for(let o of h.officers)o.down&&(o.down=!1,o.hp=60,o.iframes=2,h.FX.float(o.x,2.6,o.z,"BACK UP!","#7dff6a",18,1.4)),o.rallyT=10;h.R.shake=.5}return!0},update(i){for(let e=h.allies.length-1;e>=0;e--)h.allies[e].update(i)||(h.allies[e].remove(),h.allies.splice(e,1))}};h.Allies=Hi;var An={active:null};h.Boss=An;function kv(){let i=(p,y=.7,x=0)=>new Oe({color:p,roughness:y,metalness:x}),e={suit:i(3107642,.8),waders:i(3885610,.45,.1),skin:i(14266508,.6),hair:i(3811868,.9),black:i(921102,.3,.4),steel:i(12107976,.2,1)},t=(p,y,x=0,g=0,m=0)=>{let v=new fe(p,y);return v.position.set(x,g,m),v.castShadow=!0,v},n=new at,s=new at;n.add(s),s.add(t(new Sn(.27,.42,4,12),e.suit,0,1.1,0)),s.add(t(new tt(.07,.08,.14,8),e.skin,0,1.45,0));let r=new at;r.position.set(0,1.6,0),s.add(r),r.add(t(new Et(.16,18,14),e.skin));for(let p=0;p<9;p++){let y=Math.PI*.55+p/8*Math.PI*.9;r.add(t(new tt(.018,.01,.34,4),e.hair,Math.cos(y)*.15,-.08,Math.sin(y)*.15-.02))}r.add(t(new Et(.17,14,8,0,Math.PI*2,0,Math.PI/2.4),e.hair,0,.02,0)),[-.065,.065].forEach(p=>{let y=t(new wn(.05,.012,6,16),e.black,p,.02,.155);r.add(y)}),r.add(t(new Pe(.13,.025,.02),e.hair,0,-.06,.16));let o=(p,y,x,g,m,v)=>{let M=new at;return M.position.set(p,y,0),M.add(t(new Sn(g,x-g*2,3,8).translate(0,-x/2,0),m)),v&&M.add(t(new Et(g*1.05,8,6),v,0,-x,0)),s.add(M),M},a=o(-.34,1.36,.62,.07,e.suit,e.skin),l=o(.34,1.36,.62,.07,e.suit,e.skin),c=o(-.13,.82,.82,.1,e.waders,e.black),u=o(.13,.82,.82,.1,e.waders,e.black),d=new at;d.position.set(0,-.66,.1),l.add(d),d.add(t(new tt(.015,.015,.5,4),e.steel,0,-.2,0)),d.add(t(new wn(.11,.022,6,14,Math.PI*1.4),e.steel,0,-.5,0));let f=new fe(new $n(.75,.9,32),new pt({color:8257434,transparent:!0,opacity:.6,toneMapped:!1}));return f.rotation.x=-Math.PI/2,f.position.y=.03,n.add(f),n.scale.setScalar(1.3),{root:n,body:s,head:r,armL:a,armR:l,legL:c,legR:u,ring:f,phase:0}}var Xr=[];An.spawn=function(i,e){let t=h.AI.spawn("ripper",i,e);return t.model=kv(),h.R.scene.add(t.model.root),Object.assign(t,{swingT:0,hookT:3,mistT:9,hiddenT:0,calloutT:6,tauntT:4,enraged:!1}),An.active=t,h.say("CONTROL",kr.intro,4),h.audio.play("siren"),h.R.shake=.6,t};An.reset=function(){An.active&&An.active.model&&h.R.scene.remove(An.active.model.root),An.active=null,Xr.length=0};An.think=function(i,e,t,n){let s=i.hp/i.maxHp,r=s>.66?1:s>.33?2:3;if(i.hookT-=e,i.mistT-=e,i.calloutT-=e,i.tauntT-=e,i.swingCD-=e,i.tauntT<=0&&(i.tauntT=h.rand(6,10),h.FX.float(i.x,3.2,i.z,h.pick(kr.taunts),"#7dff9a",17,2.4)),r>=2&&h.R.scene.fog.far>34&&(h.R.scene.fog.near=8,h.R.scene.fog.far=32,h.say("CONTROL","Visibility is dropping on Killer Row! Stay together!",3)),r===3&&!i.enraged){i.enraged=!0,i.speed*=1.3;for(let c of h.W.doors)if(!c.opening){h.W.openDoor(c);for(let u=0;u<2;u++)h.AI.spawn("ding",c.spawn.x,c.spawn.z)}h.say("CONTROL","He popped the whole row! Dings everywhere!",3.5)}if(!t)return;if(i.hiddenT>0){if(i.hiddenT-=e,i.hiddenT<=0){let c=h.pick(h.targets);if(c){let u=Math.atan2(c.ax||0,c.az||1)+Math.PI;i.x=c.x+Math.sin(u)*1.8,i.z=c.z+Math.cos(u)*1.8,h.W.collide(i),i.swingT=.001,i.swingCD=0,h.FX.cloud(i.x,1.2,i.z,0,0,1.2,10467496),h.FX.float(i.x,3,i.z,"BEHIND YOU!","#ff5050",22,1.4)}}return}if(r>=2&&i.mistT<=0){i.mistT=h.rand(7,10),i.hiddenT=2.2;for(let c=0;c<8;c++)h.FX.cloud(i.x+h.rand(-1,1),1,i.z+h.rand(-1,1),h.rand(-2,2),h.rand(-2,2),.9,10467496);h.say("RADIO",h.pick(kr.callouts),2.5);return}let o=t.x-i.x,a=t.z-i.z,l=1/(n||1);if(i.yaw+=h.angDiff(i.yaw,Math.atan2(o,a))*Math.min(1,e*8),i.hookT<=0&&n>4&&n<13&&(i.hookT=r===3?3:5,Xr.push({x:i.x,z:i.z,vx:o*l*20,vz:a*l*20,life:.8,owner:i}),h.audio.play("swing",1)),i.swingT>0){let c=i.swingT;if(i.swingT+=e*(r===3?3.2:2.6),c<.5&&i.swingT>=.5){for(let u of h.targets)(u.x-i.x)**2+(u.z-i.z)**2<7.3&&u.hurt(i.def.dmg*(r===3?1.3:1),i.x,i.z,"ripper",8);h.FX.sparks(i.x+o*l*1.5,1.2,i.z+a*l*1.5,8,10485696)}i.swingT>=1&&(i.swingT=0,i.swingCD=r===3?.5:.9)}else n<2.4&&i.swingCD<=0?i.swingT=.001:n>1.8&&(i.x+=o*l*i.speed*e,i.z+=a*l*i.speed*e,h.W.collide(i));i.move=h.lerp(i.move,n>1.8&&i.swingT===0?1:0,e*8)};An.onHit=function(i){i.hiddenT>0&&(i.hiddenT=Math.min(i.hiddenT,.3))};An.onDeath=function(i){h.S.slowmo=2.5,h.say("CONTROL",kr.death,4.5),h.FX.float(i.x,3.4,i.z,"RIVERBANK RIPPER: DOWN","#7dff9a",26,3),h.FX.sparks(i.x,1.2,i.z,60,8257434),h.R.shake=.9,h.Loot.spawn(h.rollItem(3),i.x+1.2,i.z),h.R.scene.fog.near=22,h.R.scene.fog.far=70,h.S.bossDead=!0};An.update=function(i){for(let n=Xr.length-1;n>=0;n--){let s=Xr[n];s.life-=i,s.x+=s.vx*i,s.z+=s.vz*i,h.FX.glow.spawn(s.x,1.3,s.z,0,0,0,.12,.07,14217471,0);let r=null;for(let o of h.targets)if((o.x-s.x)**2+(o.z-s.z)**2<.8){r=o;break}if(r){r.hurt(10,s.x,s.z,"hook",0);let o=s.owner.x-r.x,a=s.owner.z-r.z,l=Math.hypot(o,a)||1;r.kvx!==void 0&&(r.kvx+=o/l*16,r.kvz+=a/l*16),h.FX.float(r.x,2.6,r.z,"HOOKED!","#d8f0ff",18,1.2)}(r||s.life<=0||h.W.blocked(s.x,s.z))&&Xr.splice(n,1)}let e=An.active;if(!e||!e.model)return;let t=e.model;t.root.visible=!(e.hiddenT>0),zi(t,i,e.move||0,e.swingT||0,!1,e.dead?Math.min(1,e.fall):0),t.root.position.set(e.x,0,e.z),t.root.rotation.y=e.yaw,e.flash>0?t.body.children[0].material.emissive.setHex(5583667):t.body.children[0].material.emissive.setHex(0)};var qr=new Set,Rn={x:innerWidth/2,y:innerHeight/2,l:!1,r:!1};addEventListener("keydown",i=>{qr.add(i.code),["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(i.code)&&!(i.target instanceof HTMLInputElement)&&i.preventDefault()});addEventListener("keyup",i=>qr.delete(i.code));addEventListener("blur",()=>{qr.clear(),Rn.l=Rn.r=!1});addEventListener("mousemove",i=>{Rn.x=i.clientX,Rn.y=i.clientY});addEventListener("mousedown",i=>{i.button===0&&(Rn.l=!0),i.button===2&&(Rn.r=!0)});addEventListener("mouseup",i=>{i.button===0&&(Rn.l=!1),i.button===2&&(Rn.r=!1)});addEventListener("contextmenu",i=>i.preventDefault());var Bv={keys:qr,mouse:Rn};h.Input=Bv;function If(){let i=!1;return{kind:"kbm",label:"Keyboard + Mouse",read(e){let t=qr,n=(t.has("KeyD")?1:0)-(t.has("KeyA")?1:0),s=(t.has("KeyS")?1:0)-(t.has("KeyW")?1:0),r=h.R.screenToGround(Rn.x,Rn.y,1.2),o=t.has("ShiftLeft")||t.has("ShiftRight"),a=o&&!i;return i=o,{mx:n,mz:s,ax:r?r.x-e.x:0,az:r?r.z-e.z:0,fire:Rn.l,spray:Rn.r,melee:t.has("Space"),dash:a,sprint:o,ot:t.has("KeyF"),nade:t.has("KeyQ")||t.has("KeyG")}}}}function Fh(i){let e=!1,t=n=>Math.abs(n)<.2?0:n;return{kind:"pad",index:i,label:`Controller ${i+1}`,read(n){let s=h.pads()[i];if(!s)return{mx:0,mz:0,ax:0,az:0};let r=f=>!!(s.buttons[f]&&(s.buttons[f].pressed||s.buttons[f].value>.4)),o=t(s.axes[0]),a=t(s.axes[1]),l=s.axes[2]||0,c=s.axes[3]||0;Math.hypot(l,c)<.3&&(l=o,c=a);let u=r(0)||r(4),d=u&&!e;return e=u,{mx:o,mz:a,ax:l,az:c,fire:r(7),spray:r(6),melee:r(2)||r(5),dash:d,sprint:u,ot:r(1),nade:r(3)}}}}function Pf(){let i=[],e=h.pads();for(let t=0;t<e.length;t++)e[t]&&i.push(t);return i}var Nf=matchMedia("(pointer: coarse)").matches||navigator.maxTouchPoints>0,Ia={enabled:Nf,active:!1};h.Touch=Ia;var Gi=60,cn={move:null,aim:null},mn={spray:!1,melee:!1,dash:!1,nade:!1,ot:!1},Lf=!1,Hv=`
#touch { position: fixed; inset: 0; z-index: 5; touch-action: none; user-select: none; -webkit-user-select: none; display: none; }
#touch .base { position: absolute; width: ${Gi*2}px; height: ${Gi*2}px; margin: -${Gi}px 0 0 -${Gi}px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); background: rgba(0,0,0,0.18); pointer-events: none; }
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
`;function Vi(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n&&(s.textContent=n),t.appendChild(s),s}function Vv(){let i=document.createElement("style");i.textContent=Hv,document.head.appendChild(i);let e=Vi("div",null,document.body);e.id="touch";let t=Vi("div","hint",e,"MOVE");t.style.left="18%";let n=Vi("div","hint",e,"AIM + SHOOT");n.style.right="30%";let s=Vi("div",null,document.body,"\u{1F4F1}\u21BB Turn your phone sideways");s.id="rotateHint";let r=(d,f,p,y,x)=>{let g=Vi("div","btn "+d,e,f);g.style.right=y+"px",g.style.bottom=x+"px",g.addEventListener("pointerdown",v=>{v.preventDefault(),v.stopPropagation(),Ia.active=!0,mn[p]=!0,g.classList.add("on");try{g.setPointerCapture(v.pointerId)}catch{}});let m=v=>{v.preventDefault(),mn[p]=!1,g.classList.remove("on")};return g.addEventListener("pointerup",m),g.addEventListener("pointercancel",m),g};r("spray","SPRAY","spray",18,108),r("","BATON","melee",96,30),r("","DASH","dash",18,30);let o=r("ot","OT","ot",174,30),a=r("nade","NADE","nade",96,108);Vi("div","btn pause",e,"II").addEventListener("pointerdown",d=>{d.preventDefault(),d.stopPropagation(),dispatchEvent(new KeyboardEvent("keydown",{code:"Escape"}))}),e.addEventListener("pointerdown",d=>{d.preventDefault(),Ia.active=!0;let f=d.clientX<innerWidth*.45?"move":"aim";if(cn[f])return;let p=Vi("div","base",e),y=Vi("div","knob"+(f==="aim"?" aim":""),e);cn[f]={id:d.pointerId,ox:d.clientX,oy:d.clientY,x:d.clientX,y:d.clientY,base:p,knob:y};try{e.setPointerCapture(d.pointerId)}catch{}Df(cn[f])}),e.addEventListener("pointermove",d=>{for(let f in cn){let p=cn[f];p&&p.id===d.pointerId&&(p.x=d.clientX,p.y=d.clientY,Df(p))}});let c=d=>{for(let f in cn){let p=cn[f];p&&p.id===d.pointerId&&(p.base.remove(),p.knob.remove(),cn[f]=null)}};e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c);let u=()=>{requestAnimationFrame(u);let d=h.S&&h.S.state==="play";if(e.style.display=d?"block":"none",a.style.display=h.S&&h.S.nades?"grid":"none",o.classList.toggle("ready",!!(h.officers&&h.officers.some(f=>f.ot>=100))),s.style.display=d&&innerHeight>innerWidth*1.1?"block":"none",!d){for(let f in cn)cn[f]&&(cn[f].base.remove(),cn[f].knob.remove(),cn[f]=null);mn.spray=mn.melee=mn.dash=mn.nade=mn.ot=!1}};u()}function zh(i){if(!i)return{x:0,y:0,m:0};let e=(i.x-i.ox)/Gi,t=(i.y-i.oy)/Gi,n=Math.hypot(e,t);return n>1&&(e/=n,t/=n),{x:e,y:t,m:Math.min(1,n)}}function Df(i){let e=zh(i);i.base.style.left=i.ox+"px",i.base.style.top=i.oy+"px",i.knob.style.left=i.ox+e.x*Gi+"px",i.knob.style.top=i.oy+e.y*Gi+"px"}Ia.read=function(){let i=zh(cn.move),e=zh(cn.aim),n=(o=>o.m<.15?{x:0,y:0}:o)(i),s=e.m>.25,r=mn.dash&&!Lf;return Lf=mn.dash,{mx:n.x,mz:n.y,ax:s?e.x:n.x,az:s?e.y:n.y,fire:s,spray:mn.spray,melee:mn.melee,dash:r,sprint:mn.dash,ot:mn.ot,nade:mn.nade}};Nf&&Vv();var cs=[{key:"lot",title:"Parking Lot, Shift Change",sub:"{hero} parks the lifted truck. Energy drink in hand. Bad feeling.",quota:45,live:60,rate:3,mix:{rat:7,gasser:1.5,diva:.6,crutch:.5},tacos:3,drinks:2,call:"STAFF ASSAULT, STAFF PARKING LOT! ALL AVAILABLE STAFF RESPOND!",rung:0,prea:!0,units:["STAFF PARKING LOT","SALLY PORT","MEDICAL","WILLIAMS UNIT"],lines:[[1,"SERGEANT","Morning, {hero}. Quick heads up: they are in the parking lot."],[7,"{HERO}","I have not even clocked in."],[14,"SERGEANT","Spray them, baton them, and sign the overtime sheet."],[26,"{bernardo}","Hey {hero}, you wanna see how big my truck is? After this. Definitely after this."],[40,"COMPLIANCE","Reminder: your PREA training is overdue. Please complete it during the riot. Yes, the whole damn thing. Yes, the quiz too."]]},{key:"tier",title:"IMU North",sub:"Keys. Energy drinks. A tier full of opinions.",quota:80,live:85,rate:2.8,mix:{rat:5,gasser:2,shank:2,big:.8,diva:1.3,ding:1,wheel:.6,crutch:.8},cells:!0,tacos:3,drinks:3,call:"STAFF ASSAULT, IMU NORTH! STAFF ASSAULT, IMU NORTH! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:2,prea:!0,units:["IMU NORTH","IMU SOUTH","WILLIAMS UNIT","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, the food port is not a suggestion box."],[6,"RADIO",'Control just popped every door in IMU North. Control says "my bad."'],[15,"{caleb}","What's up bro. I'm on my taco break. I'll swing through when I'm done."],[24,"SERGEANT","Watch the cups. Do NOT ask what is in the cups."],[30,"COMPLIANCE","An inmate in IMU North has asked what PREA stands for. Please respond with the full 64-page answer."],[38,"COMPLIANCE","Please confirm you read the PREA poster. Yes, that poster. The one with blood AND piss on it. Initial here, here, and here."],[52,"{dustin}","Cell 14 says your football team is trash. Cell 14 is correct."]]},{key:"yard",title:"The Yard",sub:"Rec time. The weight pit regulars do NOT like being interrupted mid-set.",quota:75,live:75,rate:2.7,mix:{rat:4,big:1.6,cholo:1.2,shank:1.5,gasser:1,wheel:1.2,crutch:1,diva:.8},tacos:3,drinks:3,call:"STAFF ASSAULT, REC YARD! STAFF ASSAULT, WEIGHT PIT! ALL AVAILABLE STAFF RESPOND!",rung:2,crews:1,prea:!0,units:["REC YARD","WEIGHT PIT","IMU SOUTH","THE BAR UNITS"],lines:[[1,"SERGEANT","{hero}, yard is hot. Do not touch anybody's bench. Do not ask how much they bench. They will tell you."],[9,"RADIO","Tower One reports a fight at the chest press. Tower One is also eating nachos."],[18,"{caleb}","Bro, who left 405 on the bench? Oh wait. Me. That was me."],[30,"COMPLIANCE","Reminder: spotting an inmate requires a signed consent form, two witnesses, and a notary. Do not touch his hips."],[44,"RADIO",'Somebody on the pull-up bar has been "almost done" for forty minutes.'],[58,"{dustin}","That dude in the wheelchair just lapped me. Twice."]]},{key:"night",title:"Lights Out",sub:"IMU North, 0300. Count time. Bring your flashlight and change your underwear.",quota:60,live:45,rate:2,mix:{rat:4,ding:2.5,shank:2,crutch:1,wheel:.7,big:.6},cells:!0,tacos:3,drinks:2,call:"STAFF ASSAULT, IMU NORTH! POWER IS DOWN! ALL STAFF RESPOND WITH LIGHTS!",rung:2,prea:!0,night:!0,units:["IMU NORTH","IMU SOUTH","THE BAR UNITS"],lines:[[2,"SERGEANT","{hero}, generator is down. Facilities duct-taped a flashlight to your gun. Every shot lights them up and burns their eyes."],[10,"RADIO","Count is not clearing. Somebody is hiding. Flash every corner."],[22,"COMPLIANCE","Shining a light into a cell after 2300 requires a Nighttime Illumination Disclosure form. In triplicate. In the dark."],[36,"{caleb}","Bro, I am NOT scared. That was a different noise. That was my knee."],[50,"RADIO","Something in the laundry cart just moved. Nobody check the laundry cart."]]},{key:"row",title:"Supermax: Killer Row",sub:"The famous ones live here. Do not chat. Do not buy the paintings.",quota:70,live:70,rate:2.6,mix:{ding:4,rat:2,shank:2,big:1,gasser:1},cells:!0,tacos:4,drinks:3,call:"STAFF ASSAULT, SUPERMAX! STAFF ASSAULT, KILLER ROW! ALL STAFF RESPOND!",rung:3,crews:1,prea:!0,units:["SUPERMAX","KILLER ROW","THE BAR UNITS","IMU SOUTH"],boss:"ripper",bossAt:.35,lines:[[2,"SERGEANT","{hero}, Killer Row. Stay off the glass, stay off the intercom, and do NOT let them flatter you."],[12,"{halley}","Keep your eyes up, family. The mist plays tricks down here."],[26,"COMPLIANCE","Reminder: serial killers are still entitled to PREA training. They all passed. You failed it twice, dumbass. Retake it Monday."],[44,"RADIO","Somebody on the row ordered forty soups and a clown painting. Commissary says no."]]}];var st=i=>document.getElementById(i),W=h.S={state:"menu",level:0,kills:0,time:0,hitStop:0,hpMul:1,dmgMul:1},Ff=new URLSearchParams(location.search),us=parseInt(Ff.get("stress")||"0",10)||0;h.R.init(st("game"));h.FX.init(h.R.scene);h.AI.init(h.R.scene);h.C.init(h.R.scene);var zf=new Ea(h.R.scene,520);h.W.load("lot","Rookie");for(let i=0;i<24;i++)h.AI.spawn(h.pick(["rat","rat","gasser","diva","big"]),h.rand(10,78),h.rand(10,56));var hs=Object.assign({name:"",gender:"male"},h.store.get("mo_player",{}));st("nameIn").value=hs.name;function $r(i,e,t){let n=st(i),s=r=>{for(let o of n.children)o.classList.toggle("on",o.dataset.v===String(r))};s(e),n.addEventListener("click",r=>{let o=r.target.closest("button");o&&(s(o.dataset.v),t(o.dataset.v))})}$r("segGender",hs.gender,i=>{hs.gender=i});$r("segQuality",h.settings.quality,i=>{h.settings.quality=i,h.saveSettings(),h.R.applyQuality(i)});$r("segGore",h.settings.gore?1:0,i=>{h.settings.gore=i==="1",h.saveSettings()});$r("segPace",String(h.settings.pace||.8),i=>{h.settings.pace=parseFloat(i),h.saveSettings()});$r("segCuss",h.settings.cuss?1:0,i=>{h.settings.cuss=i==="1",h.saveSettings()});st("startBtn").addEventListener("click",Wh);st("nameIn").addEventListener("keydown",i=>{i.key==="Enter"&&Wh()});function Gv(){let i=If(),e=Fh(0),t=!1;return{kind:"hybrid",noPad:!1,usesPad(n){return n===0&&!this.noPad},read(n){if(h.Touch.active)return h.Touch.read(n);if(this.noPad)return i.read(n);let s=e.read(n);(Math.abs(s.mx)+Math.abs(s.mz)>0||s.fire||s.spray||s.melee||s.dash)&&(t=!0);let r=i.read(n);return(h.Input.mouse.l||h.Input.mouse.r||Math.abs(r.mx)+Math.abs(r.mz)>0)&&(t=!1),t?s:r}}}function Wh(){h.audio.init(),hs.name=h.cleanName(st("nameIn").value),h.store.set("mo_player",hs);for(let i of h.officers)i.remove();h.officers.length=0,h.officers.push(new Wr(0,hs.name,hs.gender,Gv())),W.runKills=0,W.rung=-1,W.startLevelIdx=Math.max(0,Math.min(cs.length-1,parseInt(Ff.get("level")||"1",10)-1)),st("menu").classList.add("hidden"),st("hud").classList.remove("hidden"),Bf(),Zr(W.startLevelIdx||0)}var Yr={},Uf=["Rodriguez","Johnson","Nguyen","Martinez","Thompson","Garcia","Williams","Reyes"];function Wv(i){return h.officers.some(e=>e.device.kind==="pad"&&e.device.index===i||e.device.usesPad&&e.device.usesPad(i))}function Xv(){let i=h.pads();for(let e=0;e<i.length;e++){let t=i[e];if(!t)continue;let n=!!(t.buttons[0]&&t.buttons[0].pressed||t.buttons[9]&&t.buttons[9].pressed),s=n&&!Yr[e];if(Yr[e]=n,!s||h.officers.length>=4||e===0&&h.officers[0].device.usesPad&&!(h.Input.keys.size||h.Input.mouse.l)||Wv(e)&&!(e===0&&h.officers[0].device.usesPad))continue;e===0&&(h.officers[0].device.noPad=!0);let r=h.officers.length,o=h.officers[0],a=new Wr(r,Uf[Math.random()*Uf.length|0],r%2?"female":"male",Fh(e));a.x=o.x+1.2,a.z=o.z+.8,h.officers.push(a),Bf(),h.FX.float(a.x,2.8,a.z,`${h.rankName(a).toUpperCase()} CLOCKED IN`,"#"+h.PCOLORS[r].toString(16).padStart(6,"0"),20,2.2),Cn("CONTROL",`${h.rankName(a)} is on the tier. The DOC family grows.`,3)}}function qv(i){for(let e of h.officers){if(!e.down)continue;let t=h.officers.find(n=>!n.down&&(n.x-e.x)**2+(n.z-e.z)**2<2.6);t?(e.reviveT+=i,Math.random()<i*4&&h.FX.float(e.x,2.2,e.z,`PICKING UP ${e.name.toUpperCase()}... ${Math.round(e.reviveT*50)}%`,"#7dff6a",14,.5),e.reviveT>=2&&(e.down=!1,e.hp=e.maxHp*.5,e.iframes=1.5,e.reviveT=0,h.FX.float(e.x,2.6,e.z,"BACK UP! DOC FAMILY!","#7dff6a",20,1.6),t.score+=50)):e.reviveT=Math.max(0,e.reviveT-i)}}function Zr(i){W.level=i;let e=W.def=Object.assign({},cs[i]);us&&Object.assign(e,{quota:1e9,live:us,rate:80}),h.FX.reset(),h.AI.reset(),h.C.reset(),Hi.reset(),Wn.reset(),h.Boss.reset();let t=h.W.load(e.key,h.officers[0].name);h.officers.forEach((s,r)=>{s.reset(),s.x=t.start[0]+r*1.2,s.z=t.start[1]}),h.R.camTarget.set(t.start[0],0,t.start[1]),Object.assign(W,{state:"play",kills:0,prea:0,lootWait:0,lootLeft:0,wrangleT:0,wrangleSaid:!1,spawned:0,spawnAcc:0,time:0,doorT:3,radioT:14,lineIdx:0,radio:null,clearT:0,downT:0,halleyUsed:!1,crewT:h.rand(22,35),assaultT:30,bossSpawned:!1,bossDead:!1,slowmo:0,killerT:8}),h.W.alarm=e.cells?1:0,kf(!1);let n=()=>{for(let s=0;s<40;s++){let r=h.rand(4,t.w*2-4),o=h.rand(4,t.h*2-4);if(!h.W.blocked(r,o)&&!h.W.wallAt(r,o))return[r,o]}return t.start};for(let s=0;s<e.tacos;s++)h.C.spawnPickup("taco",...n());for(let s=0;s<e.drinks;s++)h.C.spawnPickup("drink",...n());for(let s=0;s<2;s++)h.C.spawnPickup("zyn",...n());h.C.spawnPickup("chew",...n()),Wn.spawn(Ra(0),...Pa(n,t));for(let s=0;s<(e.crews||0);s++){let[r,o]=Pa(n,t);h.AI.spawnCrew(r,o,4),W.spawned+=4}if(e.prea){let[s,r]=Pa(n,t);h.AI.spawn("prea",s,r),W.spawned++}if(t.lifters)for(let[s,r]of t.lifters){let o=h.AI.spawn(h.pick(["big","big","cholo","rat"]),s,r+.9);o.x=s,o.z=r+.9,o.posted=!0,o.crew="weightpit",o.shirtless=!0,o.yaw=Math.PI,W.spawned++}if(t.scares)for(let s of t.scares)s.done=!1;if(["lot","yard","night"].includes(e.key)&&!h.store.get("sa_gold",[]).includes(e.key)&&h.C.spawnPickup("gold",...Pa(n,t)),h.store.get("sa_bigbro",!1)&&setTimeout(()=>{if(W.state==="play"&&Hi.call("caleb")){let s=h.allies.find(r=>r.key==="caleb");s&&(s.t=1e9)}},4e3),t.caged){let s=Math.floor(t.caged.length/2)-2;uf.forEach((r,o)=>{let a=t.caged[s+o],l=h.AI.spawn("killer",(a.i+1)*2,a.j*2+1);Object.assign(l,{caged:!0,killer:r,suit:r.suit,skin:r.skin,hair:r.hair,style:r.style,face:r.face,itemCol:r.item||0,hairOn:!0,x:(a.i+1)*2,z:a.j*2+1,chatT:h.rand(2,8)})})}er(e.call?"STAFF ASSAULT":e.title,e.title+" \xB7 "+h.t(e.sub,h.officers[0].name),!!e.call,3600),e.call&&(Cn("CONTROL",e.call,3.6),Ua(6)),tr(`Gear: ${js[W.gun].label} + ${Bi[W.spray].label}`),Fa(),h.R.precompile()}function Pa(i,e){for(let t=0;t<30;t++){let n=i();if((n[0]-e.start[0])**2+(n[1]-e.start[1])**2>196)return n}return i()}function Bh(i){let e=0;for(let n in i)e+=i[n];let t=Math.random()*e;for(let n in i)if(t-=i[n],t<=0)return n;return"rat"}function Yv(i){if(W.spawned<W.def.quota&&W.kills<W.def.quota||(W.wrangleT=(W.wrangleT||0)-i,W.wrangleT>0))return;W.wrangleT=1;let e=h.officers.filter(n=>!n.down);if(!e.length)return;let t=0;for(let n of h.AI.list){if(n.dead||n.caged||n.boss)continue;let s=e.some(a=>(a.x-n.x)**2+(a.z-n.z)**2<64),r=Math.hypot(n.x-(n.wx??n.x+99),n.z-(n.wz??n.z));if(n.wx=n.x,n.wz=n.z,n.stuckT=s?0:r<1.2?(n.stuckT||0)+1:Math.max(0,(n.stuckT||0)-1),n.stuckT<4)continue;let o=h.pick(e);for(let a=0;a<30;a++){let l=Math.random()*Math.PI*2,c=h.rand(6,10),u=o.x+Math.sin(l)*c,d=o.z+Math.cos(l)*c;if(!(h.W.blocked(u,d)||!h.W.los(o.x,o.z,u,d))){h.FX.cloud(n.x,1,n.z,0,0,1,9080726),n.x=u,n.z=d,n.vx=n.vz=0,n.posted=!1,n.freezeT=0,n.stuckT=0,n.wx=u,n.wz=d,h.FX.cloud(u,1,d,0,0,1.2,9080726),h.FX.float(u,2.6,d,"EXTRACTED!","#ffcf4a",18,1.6),t++;break}}}t&&!W.wrangleSaid&&(W.wrangleSaid=!0,h.say("CONTROL",h.pick(["We pulled the last one out of his cell. He is coming to you.","Cell extraction complete. Your straggler is incoming.","Found him hiding under his bunk. Sending him out."]),3))}h.rankName=i=>`${ls[Math.max(0,W.rung??0)].rank} ${i.name}`;function kf(i){let e=W.def.rung||0;ls.forEach((o,a)=>{(W.runKills||0)>=o.at&&(e=Math.max(e,a))});let t=W.rung??-1;W.rung=Math.max(t,e);let n=ls[W.rung];if(W.gun=n.gun,W.spray=n.spray,W.nades=n.nades,!i||W.rung===t||t<0)return;let s=h.officers[0]?h.officers[0].name:"Rookie";if(n.rank!==ls[t].rank){er("PROMOTED",`${n.title.toUpperCase()} ${s.toUpperCase()}`,!1,2600),h.audio.play("win");for(let o of h.officers)o.down||h.FX.float(o.x,3,o.z,`${n.rank} ${o.name}!`,"#ffcf4a",22,2.2)}else h.audio.play("pickup");Cn("CONTROL",h.t(n.news||"",s),4),tr(`NEW GEAR: ${js[n.gun].label} + ${Bi[n.spray].label}${n.nades?" + Grenades (Q / Y / NADE)":""}`)}h.onKill=()=>{W.runKills=(W.runKills||0)+1,kf(!0)};h.showCard=(...i)=>er(...i);function er(i,e,t,n){st("lvlT").textContent=i,st("lvlT").classList.toggle("alarm",!!t),st("lvlS").textContent=e,st("levelcard").classList.add("show"),clearTimeout(er.h),er.h=setTimeout(()=>st("levelcard").classList.remove("show"),n)}function Ua(i){h.W.alarmT=i,h.audio.play("siren"),h.audio.play("alarm",.8),document.body.classList.add("assault"),clearTimeout(Ua.h),Ua.h=setTimeout(()=>document.body.classList.remove("assault"),i*1e3*.7)}var Zv=[{what:"laundry",type:"ding",text:"OUT OF THE LAUNDRY CART!",line:"He has been in the laundry cart since TUESDAY."},{what:"vent",type:"crutch",text:"FROM THE CEILING VENT!",line:"How did he get in the vent with a CRUTCH?!"},{what:"mannequin",type:"rat",text:"THE DUMMY MOVED!",line:"That is not the count dummy. That is NOT the count dummy."},{what:"bunk",type:"shank",text:"UNDER THE BUNK!",line:"He was under the bunk. The whole time. Breathing."},{what:"chair",type:"wheel",text:"WHEELCHAIR IN THE DARK!",line:"You hear wheels. Slowly. Getting closer."}];function $v(i){let e=h.W.def;if(!(!e||!e.scares)){for(let t of e.scares){if(t.done)continue;let n=h.officers.find(c=>!c.down&&(c.x-t.x)**2+(c.z-t.z)**2<12);if(!n)continue;t.done=!0;let s=h.pick(Zv),r=Math.atan2(n.ax,n.az)+h.rand(-.6,.6),o=n.x+Math.sin(r)*2.2,a=n.z+Math.cos(r)*2.2,l=h.AI.spawn(s.type,h.W.blocked(o,a)?t.x:o,h.W.blocked(o,a)?t.z:a);if(W.spawned++,s.what==="vent"&&(l.hop=2.6,l.vy=0),l.swingCD=.6,l.scareT=1.5,h.FX.float(l.x,2.8,l.z,s.text,"#ff4040",26,1.6),h.R.shake=.9,h.R.split=1,h.R.flashBoost=1,h.audio.play("alarm",1),h.audio.play("hurt",.4),Math.random()<.5)l.countCheck=!0,Cn("CONTROL","TIER CHECK! Flash him to clear count! "+s.line,3);else{Cn("RADIO",s.line+" He brought friends.",3);for(let c=0;c<3;c++){let u=h.rand(0,h.TAU),d=h.AI.spawn(h.pick(["rat","ding","shank"]),t.x+Math.cos(u)*4,t.z+Math.sin(u)*4);d.x=h.W.blocked(d.x,d.z)?t.x:d.x,d.z=h.W.blocked(d.x,d.z)?t.z:d.z,W.spawned++}}}for(let t of h.AI.list)if(!(!t.countCheck||t.dead))if(t.scareT-=i,t.flashedT>0){t.countCheck=!1,h.FX.float(t.x,2.8,t.z,"COUNT CLEARS! +150","#7dff6a",22,1.6);let n=h.officers.find(s=>!s.down);h.AI.damage(t,9999,n?n.x:t.x,n?n.z:t.z,3,"flash",n||null),n&&(n.score+=150)}else t.scareT<=0&&(t.countCheck=!1,Cn("CONTROL","Count did NOT clear. He is loose. Get him.",2.5))}}function Jv(i){let e=W.def;if(us||W.spawned>=e.quota||!e.units||(W.assaultT-=i,W.assaultT>0))return;W.assaultT=h.rand(40,55);let t=h.pick(e.units),n=/BAR/.test(t);Cn("CONTROL",`STAFF ASSAULT, ${t}! STAFF ASSAULT, ${t}! ALL AVAILABLE STAFF RESPOND!`,3.8),er("STAFF ASSAULT",t,!0,2600),Ua(7),n&&setTimeout(()=>{W.state==="play"&&Cn("RADIO",h.pick(pf),3.5)},4e3);let s=h.W.doors.filter(l=>!l.opening);for(let l=0;l<2&&s.length;l++)h.W.openDoor(s.splice(h.randi(0,s.length-1),1)[0]);let r=h.W.spawns.concat(h.W.doors.filter(l=>l.opening).map(l=>l.spawn)),o=r.filter(l=>h.officers.every(c=>(c.x-l.x)**2+(c.z-l.z)**2>64)),a=h.randi(8,14);for(let l=0;l<a&&W.spawned<e.quota&&h.AI.liveCount()<e.live+12;l++){let c=h.pick(o.length?o:r);if(!c)break;h.AI.spawn(n&&Math.random()<.75?"ding":Bh(e.mix),c.x+h.rand(-.6,.6),c.z+h.rand(-.6,.6)),W.spawned++}}function Kv(i){let e=W.def,t=h.AI.liveCount();if(e.cells&&(W.doorT-=i,W.doorT<=0&&W.spawned<e.quota)){W.doorT=h.rand(1.5,3);let s=h.W.doors.filter(r=>!r.opening);if(s.length){let r=h.pick(s);h.W.openDoor(r);let o=h.randi(1,2);for(let a=0;a<o&&W.spawned<e.quota;a++)h.AI.spawn(Bh(e.mix),r.spawn.x,r.spawn.z),W.spawned++}}if(W.spawned>=e.quota||t>=e.live)return;W.spawnAcc+=i*e.rate*(us?1:Math.min(1.6,.7+W.time/60));let n=h.W.spawns.concat(h.W.doors.filter(s=>s.open>=1).map(s=>s.spawn));for(;W.spawnAcc>=1&&W.spawned<e.quota&&h.AI.liveCount()<e.live;){W.spawnAcc-=1;let s=n.filter(o=>h.officers.every(a=>(a.x-o.x)**2+(a.z-o.z)**2>64)),r=h.pick(s.length?s:n);if(!r)break;h.AI.spawn(Bh(e.mix),r.x,r.z),W.spawned++}}h.targets=[];function jv(i){if(!W.halleyUsed&&h.officers.some(t=>t.down||t.hp<25)&&(W.halleyUsed=!0,Hi.call("halley")),W.calebSwarmCD=(W.calebSwarmCD||0)-i,W.calebSwarmCD<=0&&!h.allies.some(t=>t.key==="caleb"))for(let t of h.officers){if(t.down)continue;let n=0;for(let s of h.AI.list)!s.dead&&!s.caged&&(s.x-t.x)**2+(s.z-t.z)**2<36&&n++;if(n>=12){W.calebSwarmCD=45,Hi.call("caleb");break}}if(W.crewT-=i,W.crewT<=0){W.crewT=h.rand(35,55);let t=["caleb","dustin"].filter(n=>!h.allies.some(s=>s.key===n));t.length&&Hi.call(h.pick(t))}let e=W.def;if(e.boss&&!W.bossSpawned&&W.kills>=e.quota*e.bossAt){W.bossSpawned=!0;let t=h.W.doors.find(n=>!n.opening)||h.W.doors[0];if(t)h.W.openDoor(t),h.Boss.spawn(t.spawn.x,t.spawn.z);else{let n=h.pick(h.W.spawns);h.Boss.spawn(n.x,n.z)}}}function Cn(i,e,t=4){let n=h.officers[0]?h.officers[0].name:"Rookie";W.radio={t},st("radWho").textContent=h.t(i,n),st("radTxt").textContent=h.censor(h.t(e,n)),st("radio").classList.add("show"),h.audio.play("radio")}h.say=Cn;function Qv(i){let e=W.def.lines;if(W.radio&&(W.radio.t-=i,W.radio.t<=0&&(W.radio=null,st("radio").classList.remove("show"))),W.lineIdx<e.length&&W.time>=e[W.lineIdx][0]&&!W.radio){let[,t,n]=e[W.lineIdx++];Cn(t,n),W.radioT=Math.max(W.radioT,10);return}if(W.def.key==="row"){W.killerT-=i;let t=h.AI.list.filter(n=>n.caged);if(W.killerT<=0&&!W.radio&&t.length){W.killerT=h.rand(9,15);let n=h.pick(t).killer;Cn(`INTERCOM \xB7 ${n.name}`,h.pick(n.lines),4);return}for(let n of t){if(n.chatT-=i,n.chatT>0)continue;h.officers.some(r=>!r.down&&(r.x-n.x)**2+(r.z-n.z)**2<49)?(n.chatT=h.rand(6,10),h.FX.float(n.x,2.4,n.z,`${n.killer.name}: ${h.pick(n.killer.lines)}`,"#9fe6b8",14,3)):n.chatT=1}}if(W.radioT-=i,W.radioT<=0&&!W.radio){W.radioT=h.rand(16,26);let[t,n]=h.pick(ef);Cn(t,n)}}var Hh=[];function Bf(){let i=st("players");i.textContent="",Hh.length=0;for(let e of h.officers){let t=document.createElement("div");t.className="pcard",t.style.borderLeftColor="#"+h.PCOLORS[e.slot].toString(16).padStart(6,"0");let n=document.createElement("div");n.className="nm";let s=document.createElement("span");s.textContent=h.rankName(e).toUpperCase();let r=document.createElement("span");n.append(s,r);let o=document.createElement("div");o.className="bar hp",o.append(document.createElement("i"));let a=document.createElement("div");a.className="bar en",a.append(document.createElement("i"));let l=document.createElement("div");l.className="bar ot",l.append(document.createElement("i"));let c=document.createElement("div");c.className="buffs";let u=document.createElement("div");u.className="gear",t.append(n,o,a,l,c,u),i.append(t),Hh.push({o:e,name:s,score:r,hp:o.firstChild,en:a.firstChild,ot:l.firstChild,bf:c,gear:u,gearKey:""})}}var La=0,kh=0,Da=60,Na=0;function e_(i){for(let s of Hh){s.hp.style.width=s.o.hp/s.o.maxHp*100+"%",s.en.style.width=s.o.energy+"%",s.ot.style.width=(s.o.otT>0?s.o.otT/12*100:s.o.ot||0)+"%",s.ot.parentNode.classList.toggle("full",s.o.ot>=100||s.o.otT>0),s.score.textContent=s.o.score+" pts";let r=h.rankName(s.o).toUpperCase();s.name.textContent!==r&&(s.name.textContent=r);let o=[];s.o.otT>0?o.push(`MANDATORY OVERTIME ${Math.ceil(s.o.otT)}s`):s.o.ot>=100&&o.push(s.o.device.kind==="pad"?"OVERTIME READY [B]":s.o.device.kind==="kbm"?"OVERTIME READY [F]":"OVERTIME READY [OT]"),s.o.sprinting&&o.push("SPRINT"),s.o.tacoT>0&&o.push(`TACO POWER ${Math.ceil(s.o.tacoT)}s`),s.o.drinkT>0&&o.push(`ENERGY ${Math.ceil(s.o.drinkT)}s`),s.o.zynT>0&&o.push(`ZYN HEAT ${Math.ceil(s.o.zynT)}s`),s.o.slowT>0&&o.push("GASSED"),s.o.rallyT>0&&o.push(`RALLY ${Math.ceil(s.o.rallyT)}s`),s.o.down&&o.push("DOWN"),s.bf.textContent=o.join(" \xB7 ");let a=Object.values(s.o.gear).map(l=>l?l.name+l.rarity:"-").join("|");if(a!==s.gearKey){s.gearKey=a,s.gear.textContent="";for(let l of Object.keys(ei)){let c=s.o.gear[l],u=document.createElement("span");u.className="chip",u.textContent=c?c.name:`no ${ei[l].label.toLowerCase()}`,u.title=c?`${ln[c.rarity].label} \xB7 ${Nh(c)}`:"Find gear on the map",c&&(u.style.borderColor=ln[c.rarity].css,u.style.color=ln[c.rarity].css),s.gear.append(u)}}}let e=h.Boss.active;st("bossbar").classList.toggle("hidden",!e||e.dead),e&&!e.dead&&(st("bossFill").style.width=Math.max(0,e.hp)/e.maxHp*100+"%"),st("joinHint").classList.toggle("hidden",h.officers.length>=4||!Pf().length),st("objT").textContent=W.def.title.toUpperCase();let t=Math.max(0,W.def.quota-W.kills);st("objC").textContent=us?`STRESS TEST \xB7 ${h.AI.liveCount()} live`:t>0?`${W.kills} / ${W.def.quota} inmates down`:W.lootLeft>0?`Grab your gear! Clocking out in ${W.lootLeft}s`:`Clear the stragglers: ${h.AI.liveCount()} left`;let n=Math.max(...h.officers.map(s=>s.hurtT));if(st("vignette").style.opacity=Math.min(1,n*2.2+(h.officers.some(s=>!s.down&&s.hp<30)?.35:0)),La+=i,kh++,La>=.5){Da=Math.round(kh/La),La=0,kh=0,st("fps").textContent=`${Da} FPS \xB7 ${h.R.qName.toUpperCase()}${h.R.dyn<1?" "+Math.round(h.R.dyn*100)+"%":""} \xB7 ${h.AI.liveCount()} inmates`,us||h.R.tuneResolution(Da,.5),Na=Da<38&&h.R.dyn<=.6?Na+.5:0;let s=h.QUALITY_ORDER.indexOf(h.R.qName);Na>=4&&s>0&&!us&&(Na=0,h.R.applyQuality(h.QUALITY_ORDER[s-1]),tr(`Graphics lowered to ${h.R.qName} to keep it smooth`))}}h.toast=i=>tr(i);function tr(i){let e=st("toast");e.textContent=i,e.classList.add("show"),clearTimeout(tr.h),tr.h=setTimeout(()=>e.classList.remove("show"),2600)}function Oa(i,e,t,n,s){let r=st("panelCard");if(r.textContent="",s){let c=document.createElement("div");c.className="herostamp",c.textContent=s,r.append(c)}let o=document.createElement("h2");o.textContent=i;let a=document.createElement("p");if(a.className="sub",a.textContent=h.censor(e),r.append(o,a),t){let c=document.createElement("div");c.className="stats";for(let[u,d]of t){let f=document.createElement("div");f.textContent=u;let p=document.createElement("div");p.textContent=d,c.append(f,p)}r.append(c)}let l=document.createElement("div");l.className="btns",n.forEach(([c,u,d])=>{let f=document.createElement("button");f.className="go"+(d?" ghost":""),f.textContent=c,f.onclick=u,l.append(f)}),r.append(l),st("panel").classList.remove("hidden")}function Fa(){st("panel").classList.add("hidden")}function za(){Fa(),W.state="menu",Hf(),st("hud").classList.add("hidden"),st("menu").classList.remove("hidden")}function Hf(){let i=h.board.list(),e=st("boardRows");st("board").classList.toggle("hidden",!i.length),e.textContent="",i.slice(0,8).forEach((t,n)=>{let s=document.createElement("div");s.textContent=`${n+1}. ${t.name}`;let r=document.createElement("div");r.textContent=`${t.areaName} \xB7 ${t.kills} down \xB7 ${t.rank}`,e.append(s,r)})}Hf();function Vf(i){let e=W.level+(i?1:0),t=i&&W.level>=cs.length-1?"SURVIVED THE SHIFT":i?`Cleared ${cs[W.level].title}`:`Got to ${cs[W.level].title}`;for(let n of h.officers)h.board.record({name:h.cleanName(n.name),area:e,areaName:t,kills:W.runKills||0,score:n.score,rank:ls[W.rung||0].title,date:new Date().toISOString().slice(0,10)})}var Vh=()=>[["\u2014\u2014 SHIFT BOARD \u2014\u2014",""]].concat(h.board.list().slice(0,5).map((i,e)=>[`${e+1}. ${i.name}`,i.areaName])),Qs={force:["An inappropriate amount","Yes","Enough to need a second form","Fists, feet, a taco, and a time clock","Whatever was closest","All of it. Every bit."],fluids:["Yes (all of them)","Spit, piss, and something from a cup we are not naming","Too many to list. See attached 9 pages.","Cup contents: unknown. Smell: known.","Yes. On the PREA poster. Again."],reason:['"Your mom"','"He looked at me funny"','"I was bored as shit"','"I wanted to see the hot nurse"','"Commissary was out of hot Cheetos"','"Bro I thought it was rec"','"It was a Tuesday"'],witness:["Tower One (asleep)","Control (on TikTok)","Inmate in cell 14 (lying)","A rat. The animal kind.","Nobody. Everybody. Big Mike."],injuries:["Bruised ego, busted lip, pride","Bit on the ass. Medical laughed.","Got gassed. Shirt is evidence now.","Pulled a hammy. Not from the fight.","Emotional. Do not ask."],sig:["Sgt. (drew a dick instead)","Illegible. Smells like Zyn.","Signed in taco sauce",'"Mandatory OT" written 40 times',"Signed. Then cried."]},Gh=()=>[...h.officers.flatMap(i=>[[`${h.rankName(i)}: inmates down`,String(i.kills)],[`${h.rankName(i)}: score`,String(i.score)]]),["Rank",ls[W.rung||0].title],["Force used",h.pick(Qs.force)],["Bodily fluids involved",h.pick(Qs.fluids)],["Inmate's stated reason",h.pick(Qs.reason)],["Witnesses",h.pick(Qs.witness)],["Staff injuries",h.pick(Qs.injuries)],["Fake PREA claims yelled",String(W.prea||0)],["Real PREA claims","0 (filed 14 pages anyway)"],["Supervisor signature",h.pick(Qs.sig)]].map(([i,e])=>[i,h.censor(e)]);function t_(){W.state="clear",Vf(!0),h.audio.play("win"),W.level>=cs.length-1?Oa("SHIFT SURVIVED","The Riverbank Ripper is back in his cell. Built for Sgt. Halley Munoz, Caleb Alaniz, Dustin Davis, and all my Correctional Officer homies back home. You are the real heroes. One DOC family. Stay safe out there.",Gh().concat(Vh()),[["PLAY AGAIN",()=>{W.runKills=0,W.rung=-1,Zr(0)}],["MENU",za,!0]],"HERO OF THE DOC"):Oa(`${W.def.title.toUpperCase()}: CLEARED`,h.pick(["INCIDENT REPORT #"+h.randi(1e3,9999)+". Sarge says good job. Sarge also says stay late.","INCIDENT REPORT. Somebody hose that shit down.","INCIDENT REPORT. Overtime approved. Sleep denied. Dignity: also denied.","INCIDENT REPORT. The DOC family thanks you. Payroll says fuck you."]),Gh().concat(Vh()),[["NEXT AREA",()=>Zr(W.level+1)],["MENU",za,!0]],"HERO OF THE DOC")}function n_(){W.state="over",Vf(!1),Oa("YOU GOT MANDOWED",h.pick(["Medical is on the way. Medical is also on break.","The inmates are filing a grievance about how easy that was.","Your truck has been towed from the fire lane."]),Gh().concat(Vh()),[["RETRY AREA",()=>Zr(W.level)],["MENU",za,!0]])}addEventListener("keydown",i=>{if(i.code==="Escape")if(W.state==="play"){W.state="pause";let e=h.officers.flatMap(t=>Object.keys(ei).map(n=>{let s=t.gear[n];return[`${t.name} \xB7 ${ei[n].label}`,s?`${s.name} (${ln[s.rarity].label})`:"none yet"]}));Oa("PAUSED",'Taking a smoke break. Officially a "wellness check."',e,[["RESUME",()=>{Fa(),W.state="play"}],["QUIT TO MENU",za,!0]])}else W.state==="pause"&&(Fa(),W.state="play")});var Of=performance.now();function Gf(i){requestAnimationFrame(Gf);let e=Math.min(.05,(i-Of)/1e3),t=e;if(Of=i,e*=h.PACE(),W.hitStop>0&&(W.hitStop-=e,e*=.15),W.slowmo>0&&(W.slowmo-=e,e*=.3),W.state==="play"){W.time+=e,h.targets.length=0;for(let r of h.officers)r.down||h.targets.push(r);for(let r of h.allies)r.leaving||h.targets.push(r);h.W.buildFlowT=(h.W.buildFlowT||0)-e,h.W.buildFlowT<=0&&(h.W.buildFlowT=.2,h.W.buildFlow(h.targets)),h.AI.update(e);for(let r of h.officers)r.update(e);Hi.update(e),h.Boss.update(e),jv(e),Xv(),qv(e),h.C.update(e,i/1e3),Wn.update(e,i/1e3),Kv(e),Yv(e),$v(e),Jv(e),Qv(e),e_(t),h.officers.every(r=>r.down)?(W.downT+=e,W.downT>2.5&&n_()):(W.downT=0,W.kills>=W.def.quota&&h.AI.liveCount()===0&&(!W.def.boss||W.bossDead)&&(Wn.drops.length&&(W.lootWait||0)<20?(W.lootWait||(Cn("CONTROL","Area secure. There is gear on the floor, go grab it before you clock out.",4),h.audio.play("pickup")),W.lootWait=(W.lootWait||0)+t,W.lootLeft=Math.ceil(20-W.lootWait)):(Wn.drops.length&&Wn.collectAll(),W.lootLeft=0,W.clearT+=e,W.clearT>1.5&&t_())))}else if(W.state==="menu"){h.AI.update(e);let r=h.pads();for(let o=0;o<r.length;o++){let a=r[o],l=!!(a&&a.buttons[0]&&a.buttons[0].pressed);if(l&&!Yr[o]&&document.activeElement!==st("nameIn")){Yr[o]=l,Wh();break}Yr[o]=l}}h.R.updateFlash(e),h.W.update(e,i/1e3),h.FX.update(e),zf.sync(h.AI.list);let s=h.officers.filter(r=>!r.down);if(W.state!=="menu"&&s.length){let r=s.reduce((l,c)=>l+c.x,0)/s.length,o=s.reduce((l,c)=>l+c.z,0)/s.length,a=Math.max(0,...s.map(l=>Math.hypot(l.x-r,l.z-o)));h.R.follow(r,o,e,1+a/18)}else{let r=i/1e3;h.R.follow(44+Math.sin(r*.1)*22,34+Math.cos(r*.13)*10,e,1.1)}h.R.render(i/1e3)}requestAnimationFrame(Gf);h.startLevel=Zr;h.crowd=zf;window.G=h;
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
