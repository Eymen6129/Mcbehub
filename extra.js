const CREDIT='Eymen6129';   // footer'da görünecek yapımcı adı

document.head.insertAdjacentHTML('beforeend',`<style>
.xrow{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px}
.cf{position:fixed;top:-16px;z-index:200;width:9px;height:14px;pointer-events:none;animation:cf 3s ease-in forwards}
@keyframes cf{to{transform:translateY(108vh) rotate(720deg)}}
.up{position:fixed;right:14px;bottom:90px;z-index:45;width:44px;height:44px;justify-content:center;border-radius:50%;background:rgba(20,22,36,.92)}
.wzq{font-size:1.05rem;margin:14px 0 6px}
</style>`);

// Footer (yapımcı imzası)
$('footer').innerHTML=`© 2026 Mcbehub • Yapımcı: <a href="https://github.com/${USER}" target="_blank" rel="noopener">${CREDIT}</a> • Modların hakları yapımcılarına aittir • Mojang AB ile bağlantılı değildir<br><a href="${REQ}" target="_blank" rel="noopener">📝 Mod iste</a>${DISCORD?`<a href="${DISCORD}" target="_blank" rel="noopener">💬 Discord</a>`:''}`;

// Yeni tema renkleri
TH.push(['#f97316','249,115,22'],['#ec4899','236,72,153']);
$('#dots').innerHTML=TH.map((t,i)=>`<span class="dot" data-i="${i}" style="background:${t[0]}"></span>`).join('');
theme(S.ac);

// Yeni başarımlar
ACH.push(
 {id:'st3',e:'🔥',n:'Ateşli',d:'3 gün üst üste gir',f:()=>(S.streak||0)>=3},
 {id:'wz',e:'🧙',n:'Büyücü',d:'Mod önericiyi kullan',f:()=>S.wzc>=1},
 {id:'cd',e:'📇',n:'Kartvizit',d:'Profil kartı oluştur',f:()=>S.cdc>=1}
);

// Günlük seri
(function(){const d=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();
 if(S.day===d)return;
 S.streak=S.day===y?(S.streak||0)+1:1;S.day=d;persist();
 setTimeout(()=>{const b=Math.min(S.streak,7)*5;gain(b);if(S.streak>1)toast('🔥 '+S.streak+' gün üst üste! +'+b+' XP');chk()},1800)})();

// Konfeti (seviye atlama ve başarımda)
function confetti(){for(let i=0;i<40;i++){const s=document.createElement('i');s.className='cf';
 s.style.cssText=`left:${Math.random()*100}vw;background:hsl(${Math.random()*360},90%,60%);animation-delay:${Math.random()*.6}s;animation-duration:${2+Math.random()*1.5}s`;
 document.body.appendChild(s);setTimeout(()=>s.remove(),4500)}}
const _g=gain;gain=function(n){const o=LV(S.xp);_g(n);if(LV(S.xp)>o)confetti()};
const _c=chk;chk=function(){const n=S.ach.length;_c();if(S.ach.length>n)confetti()};

// Mod önerici
const WZ=[
 {q:'Ne yapmayı seviyorsun?',o:[['🏗️ İnşa etmek',['inşa']],['⛏️ Madencilik',['madenci']],['⚔️ Hayatta kalma ve savaş',['zırh','mob']],['🏡 Dekor ve köy',['dekor','mobilya','ağaç','ışık']]]},
 {q:'Oyunun nasıl olsun?',o:[['✨ Daha güzel görünsün',['görsel','ışık','ağaç']],['🌀 Gerçekçi fizik',['fizik']],['🛠️ Kullanışlı araçlar',['araç','hud']]]}
];
let wz=[];
function wizard(i){
 if(i===0)wz=[];
 if(i>=WZ.length)return wzRes();
 const w=WZ[i];
 $('#md').innerHTML=`<button class="x" data-x>✕</button><div class="mb"><h2 class="px" style="font-size:.9rem;padding-right:40px">🧙 Mod Önerici</h2><div class="by">Soru ${i+1}/${WZ.length}</div><div class="wzq">${w.q}</div>
<div class="act" style="flex-direction:column">${w.o.map((o,k)=>`<button class="b2" data-wz="${i},${k}">${o[0]}</button>`).join('')}</div></div>`;
 $('#ov').classList.add('show');document.body.style.overflow='hidden'}
function wzRes(){
 const ks=wz.flat(),top=MODS.map(m=>{const s=(m.t.join(' ')+' '+m.c+' '+m.d).toLowerCase();return{m,n:ks.filter(k=>s.includes(k)).length}}).sort((a,b)=>b.n-a.n).slice(0,3).map(x=>x.m);
 S.wzc=(S.wzc||0)+1;persist();chk();
 $('#md').innerHTML=`<button class="x" data-x>✕</button><div class="mb"><h2 class="px" style="font-size:.9rem;padding-right:40px">🎯 Sana Özel</h2><div class="by">Senin için seçtim, birine dokun</div>
<div class="vl" style="margin-top:14px">${top.map(m=>`<div data-open="${m.id}" style="cursor:pointer"><b style="min-width:34px;font-size:1.5rem">${m.e}</b><span><b style="color:#fff;min-width:0">${m.n}</b><br>${m.d}</span></div>`).join('')}</div>
<div class="act"><button class="b2" data-wzall="${top.map(m=>m.id).join(',')}">🧺 Hepsini koleksiyona ekle</button><button class="b2" data-wz0>🔁 Tekrar</button></div></div>`}

// Profil kartı (resim olarak paylaşılır)
function profil(){
 const c=document.createElement('canvas');c.width=900;c.height=500;const x=c.getContext('2d'),l=LV(S.xp),a=20*(l-1)**2,p=(S.xp-a)/(20*l*l-a);
 const g=x.createLinearGradient(0,0,900,500);g.addColorStop(0,'#14162a');g.addColorStop(1,TH[S.ac][0]);
 x.fillStyle=g;x.fillRect(0,0,900,500);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(30,30,840,440);
 x.fillStyle='#fff';x.font='bold 30px system-ui,sans-serif';x.fillText('▣ McbeHub • Oyuncu Kartı',60,95);
 x.font='bold 96px system-ui,sans-serif';x.fillText('Sv '+l,60,205);
 x.fillStyle='rgba(255,255,255,.18)';x.fillRect(60,235,780,26);x.fillStyle='#7bff5a';x.fillRect(60,235,780*p,26);
 x.fillStyle='#fff';x.font='24px system-ui,sans-serif';x.fillText(S.xp+' XP',60,295);
 [['⬇',S.dl,'indirme'],['❤',S.like.length,'beğeni'],['🏆',S.ach.length+'/'+ACH.length,'başarım'],['🔥',S.streak||1,'gün seri']].forEach((s,i)=>{
  const px=60+i*200;x.fillStyle='#fff';x.font='bold 46px system-ui,sans-serif';x.fillText(s[0]+' '+s[1],px,375);
  x.font='22px system-ui,sans-serif';x.fillStyle='rgba(255,255,255,.7)';x.fillText(s[2],px,410)});
 x.fillStyle='rgba(255,255,255,.6)';x.font='22px system-ui,sans-serif';x.fillText(location.host,60,448);
 S.cdc=(S.cdc||0)+1;persist();chk();
 c.toBlob(b=>{const f=new File([b],'mcbehub-kart.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'Mcbehub kartım',text:location.origin}).catch(()=>{});
  else{saveAs(b,'mcbehub-kart.png');toast('📇 Kart indirildi')}})}

// Tıklamalar (öneri, benzer modlar, profil)
$('#md').addEventListener('click',e=>{
 const a=e.target.closest('[data-wz]');if(a){const[i,k]=a.dataset.wz.split(',').map(Number);wz[i]=WZ[i].o[k][1];return wizard(i+1)}
 if(e.target.closest('[data-wz0]'))return wizard(0);
 const z=e.target.closest('[data-wzall]');if(z){setPick(z.dataset.wzall.split(',').filter(M));S.pkc++;persist();gain(5);chk();close_();return toast('🧺 Öneriler koleksiyona eklendi')}
 if(e.target.closest('[data-pf]'))return profil();
 const o=e.target.closest('[data-open]');if(o)openM(o.dataset.open)});

// Mod penceresine "benzer modlar"
const _o=openM;openM=function(id){_o(id);const m=M(id),mb=$('#md .mb'),ac=mb&&mb.querySelector('.act');if(!m||!ac)return;
 const r=MODS.filter(x=>x.id!==id&&(x.c===m.c||x.t.some(t=>m.t.includes(t)))).slice(0,3);
 if(r.length)ac.insertAdjacentHTML('beforebegin',`<h4>Benzer modlar</h4><div class="vl">${r.map(x=>`<div data-open="${x.id}" style="cursor:pointer"><b style="min-width:34px;font-size:1.4rem">${x.e}</b><span><b style="color:#fff;min-width:0">${x.n}</b></span></div>`).join('')}</div>`)};

// Başarım penceresine seri ve profil kartı
const _a=openA;openA=function(){_a();const m=$('#md .mb'),b=m&&m.querySelector('.by'),a=m&&m.querySelector('.act');
 if(b)b.insertAdjacentHTML('beforeend',' • 🔥 '+(S.streak||1)+' gün seri');
 if(a)a.insertAdjacentHTML('beforeend','<button class="b2" data-pf>📇 Profil kartı</button>')};
$('#xp').onclick=openA;

// Komut paletine yeni komutlar
const _p=pal;pal=function(t=''){_p(t);const L=t.toLowerCase();
 pitems.push(...[{t:'🧙 Bana mod öner',f:()=>wizard(0)},{t:'📇 Profil kartım',f:profil},
  {t:'🔗 Siteyi paylaş',f:()=>navigator.share?navigator.share({title:'Mcbehub',url:location.origin}).catch(()=>{}):navigator.clipboard.writeText(location.origin).then(()=>toast('🔗 Link kopyalandı'))}
 ].filter(x=>x.t.toLowerCase().includes(L)));prn()};

// Ana sayfa butonları ve yukarı çık
$('.search').insertAdjacentHTML('afterend','<div class="xrow"><button class="b2" id="wzb">🧙 Bana mod öner</button><button class="b2" id="pfb">📇 Profil kartım</button></div>');
$('#wzb').onclick=()=>wizard(0);$('#pfb').onclick=profil;
document.body.insertAdjacentHTML('beforeend','<button class="b2 up" id="up" style="display:none">⬆</button>');
$('#up').onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>{$('#up').style.display=scrollY>700?'':'none'});
