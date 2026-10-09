const API=`https://api.github.com/repos/${USER}/${REPO}/`,RAW=`https://raw.githubusercontent.com/${USER}/${REPO}/${BR}/`;
const GH=`https://github.com/${USER}/${REPO}/issues/new`;
const REQ=GH+'?title='+encodeURIComponent('Mod isteği: ')+'&body='+encodeURIComponent('Mod adı:\nYapımcı:\nİndirme linki:\n');

const $=s=>document.querySelector(s),G=$('#grid');
let S={like:[],save:[],ver:{},ac:0,xp:0,dl:0,zip:0,pkc:0,pal:0,thc:0,snd:1,last:0,seen:[],ach:[]},MODS=[],C={},P=[],cat='Hepsi',q='',so='def',pk=0,pitems=[];
try{Object.assign(S,JSON.parse(localStorage.getItem('mcb')))}catch(e){}
const persist=()=>{try{localStorage.setItem('mcb',JSON.stringify(S))}catch(e){}};
const cats=['Hepsi','❤ Beğendiklerim','🔖 Kaydettiklerim'];
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const fmt=b=>!b?'':b>=1048576?(b/1048576).toFixed(1)+' MB':Math.round(b/1024)+' KB';
const nums=s=>(s.match(/\d+/g)||[]).map(Number);
const ver=n=>{const m=n.replace(EXT,'').match(/v?\d+(?:[._-]\d+)*/i);return m?(/^v/i.test(m[0])?m[0]:'v'+m[0]):'Son'};
const clean=n=>n.replace(EXT,'').replace(/v?\d+(?:[._-]\d+)*/i,'').replace(/[_\-\[\]()]+/g,' ').replace(/\s+/g,' ').trim()||n;
const ago=d=>{const s=(Date.now()-new Date(d))/864e5;return s<1?'bugün':s<2?'dün':s<30?Math.floor(s)+' gün önce':s<365?Math.floor(s/30)+' ay önce':Math.floor(s/365)+' yıl önce'};
const M=id=>MODS.find(m=>m.id===id),vi=m=>Math.min(S.ver[m.id]||0,m.vs.length-1),cur=m=>m.vs[vi(m)];
const isNew=m=>m.vs[0][3]&&Date.now()-new Date(m.vs[0][3])<6048e5;

// Dosya listesini modlara çevirir (aynı modun sürümleri birleşir)
function build(files){
 const out=[];
 files.forEach(f=>{const n=norm(f.name);let m=out.find(x=>n.includes(x.k));
  if(!m){const meta=META.find(x=>n.includes(x.k));
   if(meta)m={...meta,vs:[]};
   else{const nm=clean(f.name);m={id:'x'+norm(nm),k:norm(nm),n:nm,by:'',c:'Eklenti',e:'📦',g:['#6c5ce7','#341f97'],d:'Yeni eklenen mod. Açıklaması yakında eklenecek.',t:['yeni'],vs:[]}}
   out.push(m)}
  m.vs.push([ver(f.name),f.name,f.size]);});
 out.forEach(m=>m.vs.sort((a,b)=>{const x=nums(b[0]),y=nums(a[0]);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d}return 0}));
 const ix=m=>META.findIndex(x=>x.id===m.id);
 return out.sort((a,b)=>ix(a)-ix(b));
}
async function load(){
 let files;
 try{const c=JSON.parse(localStorage.getItem('mcbf')||'null');if(c&&Date.now()-c.t<3e5)files=c.f}catch(e){}
 if(!files)try{const r=await fetch(API+'contents/');
  if(r.ok){files=(await r.json()).filter(x=>x.type==='file'&&EXT.test(x.name)).map(x=>({name:x.name,size:x.size}));
   try{localStorage.setItem('mcbf',JSON.stringify({t:Date.now(),f:files}))}catch(e){}}}catch(e){}
 if(!files||!files.length)files=FALLBACK.map(name=>({name,size:0}));
 return build(files);
}
// Commit tarihinden "yeni / X gün önce" (günde 1 kez, GitHub limiti dolarsa durur)
async function dates(){
 let c={};try{c=JSON.parse(localStorage.getItem('mcbd')||'{}')}catch(e){}
 const fresh=c.t&&Date.now()-c.t<864e5,d=c.d||{};
 if(!fresh){let ok=0;
  for(const m of MODS){const f=m.vs[0][1];
   try{const r=await fetch(API+'commits?per_page=1&path='+encodeURIComponent(f));
    if(!r.ok)break;const j=await r.json();if(j[0]){d[f]=j[0].commit.committer.date;ok=1}}catch(e){break}}
  if(ok)try{localStorage.setItem('mcbd',JSON.stringify({t:Date.now(),d}))}catch(e){}}
 MODS.forEach(m=>m.vs[0][3]=d[m.vs[0][1]]);render(1);
}
// Ortak sayaç (Supabase)
const sbf=(p,o)=>fetch(SB.u+'/rest/v1/'+p,{...o,headers:{apikey:SB.k,Authorization:'Bearer '+SB.k,'Content-Type':'application/json'}});
async function loadC(){if(!SB.u)return;try{(await(await sbf('stats?select=*')).json()).forEach(r=>C[r.id]=r)}catch(e){}}
function bump(id,c,d){const r=C[id]=C[id]||{likes:0,downloads:0};r[c]=Math.max(0,(r[c]||0)+d);if(SB.u)sbf('rpc/bump',{method:'POST',body:JSON.stringify({m:id,c,d})}).catch(()=>{})}

// Kart ve liste
const IC={like:['🤍','❤️'],save:['📑','🔖'],pick:['➕','✔️']},TT={like:'Beğen',save:'Kaydet',pick:'Koleksiyona ekle'};
const MSG={like:['💔 Beğeni kaldırıldı: ','❤️ Beğenildi: '],save:['Kayıttan çıkarıldı: ','🔖 Kaydedildi: '],pick:['Koleksiyondan çıkarıldı: ','🧺 Koleksiyona eklendi: ']};
const has=(k,id)=>(k==='pick'?P:S[k]).includes(id);
const bt=(k,id,l)=>{const on=has(k,id);return `<button data-act="${k}" title="${TT[k]}" class="${l?'b2 ':''}${on?'on':''}"><u>${IC[k][+on]}</u>${l||''}</button>`};
const tg=(m,v)=>{const r=C[m.id]||{};return `<i>${m.c}</i><i class="ok">✅ ${m.u||'1.21+'}</i>${m.x?'<i class="wr">🧪 Deneysel</i>':''}${v[2]?`<i class="sz">${fmt(v[2])}</i>`:''}${SB.u?`<i>❤ ${r.likes||0}</i><i>⬇ ${r.downloads||0}</i>`:''}`};

const card=(m,n)=>{const i=vi(m),v=m.vs[i],d=m.vs[0][3];
return `<article class="card" id="c-${m.id}" data-id="${m.id}" style="--i:${n}">
<div class="ban" style="background:linear-gradient(135deg,${m.g[0]}66,${m.g[1]}22)"><span>${m.e}</span>${isNew(m)?'<em class="new">YENİ</em>':''}<div class="ic">${bt('pick',m.id)}${bt('like',m.id)}${bt('save',m.id)}</div></div>
<div class="body"><h3>${m.n}</h3><div class="by">${[m.by&&'by '+m.by,d&&'🕒 '+ago(d)].filter(Boolean).join(' • ')}</div><p>${m.d}</p>
<div class="tags">${tg(m,v)}</div>
<div class="row"><select>${m.vs.map((x,k)=>`<option value="${k}"${k==i?' selected':''}>${x[0]}</option>`).join('')}</select><button class="btn dl">⬇ İndir</button></div></div></article>`};

function stats(){
 $('#s1').textContent=MODS.length;$('#s2').textContent=MODS.reduce((a,m)=>a+m.vs.length,0);
 $('#s3').textContent=S.like.length;$('#s4').textContent=S.save.length;
 document.querySelectorAll('.chip').forEach(c=>{const k=c.dataset.c;if(k===cats[1])c.textContent=k+' '+S.like.length;if(k===cats[2])c.textContent=k+' '+S.save.length});
 if(MODS.length)chk();
}
function render(na){
 G.classList.toggle('na',!!na);
 $('#chips').innerHTML=[...cats,...new Set(MODS.map(m=>m.c))].map(c=>`<button class="chip${c===cat?' on':''}" data-c="${c}">${c}</button>`).join('');
 let l=MODS.filter(m=>(cat==='Hepsi'||(cat===cats[1]?S.like.includes(m.id):cat===cats[2]?S.save.includes(m.id):m.c===cat))&&(m.n+m.by+m.d+m.t).toLowerCase().includes(q));
 if(so==='az')l.sort((a,b)=>a.n.localeCompare(b.n));
 if(so==='new')l.sort((a,b)=>new Date(b.vs[0][3]||0)-new Date(a.vs[0][3]||0));
 if(so==='fav')l.sort((a,b)=>S.like.includes(b.id)-S.like.includes(a.id));
 if(so==='pop')l.sort((a,b)=>((C[b.id]||{}).downloads||0)-((C[a.id]||{}).downloads||0));
 G.innerHTML=l.length?l.map(card).join(''):`<div class="none">${cat===cats[1]?'Henüz beğendiğin mod yok 🤍':cat===cats[2]?'Kaydettiğin mod yok 📑':`Mod bulunamadı 😢<br><a href="${REQ}" target="_blank" rel="noopener">İstediğin modu iste →</a>`}</div>`;
 stats();
}
const go=c=>{cat=c;q='';$('#q').value='';render();$('#mh').scrollIntoView()};

// İndirme + ZIP
async function get(v,cb){const e=encodeURIComponent(v[1]);
 for(const u of ['./'+e,RAW+e]){try{const r=await fetch(u);
  if(!r.ok||(r.headers.get('content-type')||'').includes('text/html'))continue;
  const T=+r.headers.get('content-length')||v[2]||0,rd=r.body.getReader(),ch=[];let L=0;
  for(;;){const{done,value}=await rd.read();if(done)break;ch.push(value);L+=value.length;cb&&cb(T?Math.min(1,L/T):.6)}
  return new Blob(ch)}catch(x){}}
 return null}
const saveAs=(b,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();a.remove()};
async function dl(m,v,b){const o=b.innerHTML;b.classList.add('busy');b.style.setProperty('--p','4%');b.textContent='⏳';
 const bl=await get(v,p=>b.style.setProperty('--p',p*100+'%'));
 b.classList.remove('busy');b.innerHTML=o;
 if(!bl)return toast('❌ Dosya bulunamadı: '+v[1]);
 saveAs(bl,v[1]);bump(m.id,'downloads',1);S.dl++;gain(10);chk();
 toast('✅ '+m.n+' '+v[0]+' indirildi, dosyaya dokunarak aç')}
const crcT=(()=>{let t=[],c;for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?3988292384^(c>>>1):c>>>1;t[n]=c}return t})();
const crc=u=>{let c=-1;for(let i=0;i<u.length;i++)c=crcT[(c^u[i])&255]^(c>>>8);return(c^-1)>>>0};
function zip(fs){const A=[],B=[],en=new TextEncoder();let o=0;
 fs.forEach(f=>{const nm=en.encode(f.n),c=crc(f.d),L=f.d.length,h=new DataView(new ArrayBuffer(30)),g=new DataView(new ArrayBuffer(46));
  h.setUint32(0,0x04034b50,1);h.setUint16(4,20,1);h.setUint16(6,0x800,1);h.setUint32(14,c,1);h.setUint32(18,L,1);h.setUint32(22,L,1);h.setUint16(26,nm.length,1);
  g.setUint32(0,0x02014b50,1);g.setUint16(4,20,1);g.setUint16(6,20,1);g.setUint16(8,0x800,1);g.setUint32(16,c,1);g.setUint32(20,L,1);g.setUint32(24,L,1);g.setUint16(28,nm.length,1);g.setUint32(42,o,1);
  A.push(h,nm,f.d);B.push(g,nm);o+=30+nm.length+L});
 const e=new DataView(new ArrayBuffer(22));
 e.setUint32(0,0x06054b50,1);e.setUint16(8,fs.length,1);e.setUint16(10,fs.length,1);e.setUint32(12,B.reduce((a,b)=>a+b.byteLength,0),1);e.setUint32(16,o,1);
 return new Blob([...A,...B,e])}
async function zipAll(){const b=$('#zb'),fs=[];b.classList.add('busy');
 for(let i=0;i<P.length;i++){const m=M(P[i]),v=cur(m);b.textContent=`⏳ ${i+1}/${P.length}`;
  const bl=await get(v);if(bl){fs.push({n:v[1],d:new Uint8Array(await bl.arrayBuffer())});bump(m.id,'downloads',1)}}
 b.classList.remove('busy');b.textContent='⬇ ZIP indir';
 if(!fs.length)return toast('❌ Dosyalar bulunamadı');
 saveAs(zip(fs),'Mcbehub-koleksiyon.zip');S.zip++;S.dl+=fs.length;gain(10*fs.length);chk();
 toast('✅ '+fs.length+' mod zip olarak indirildi')}
function dock(){const d=$('#dock');d.classList.toggle('show',P.length>0);if(P.length)d.innerHTML=`🧺 <b>${P.length}</b> mod seçildi <button class="btn sm" id="zb">⬇ ZIP indir</button><button class="b2" id="zc">✕</button>`}
function setPick(ids){P=ids;document.querySelectorAll('[data-act=pick]').forEach(b=>{const w=b.closest('[data-id]'),on=P.includes(w&&w.dataset.id);b.classList.toggle('on',on);b.querySelector('u').textContent=IC.pick[+on]});dock()}
