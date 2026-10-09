// Beğen / kaydet / koleksiyon
function tog(k,id){const a=k==='pick'?P:S[k],x=a.indexOf(id),on=x<0;on?a.push(id):a.splice(x,1);
 if(k!=='pick')persist();if(k==='like')bump(id,'likes',on?1:-1);
 document.querySelectorAll(`[data-id="${id}"] [data-act="${k}"]`).forEach(b=>{b.classList.toggle('on',on);b.querySelector('u').textContent=IC[k][+on]});
 if((k==='like'&&cat===cats[1]||k==='save'&&cat===cats[2])&&!$('#ov').classList.contains('show'))render();
 stats();dock();return on}
function burst(b){const r=b.getBoundingClientRect();
 for(let i=0;i<7;i++){const s=document.createElement('span');s.className='ht';s.textContent='❤';
  s.style.cssText=`left:${r.left+14}px;top:${r.top}px;--x:${(Math.random()-.5)*90}px`;document.body.appendChild(s);setTimeout(()=>s.remove(),900)}}
function share(m){const url=location.origin+location.pathname+'#'+m.id;
 if(navigator.share)navigator.share({title:m.n+' • Mcbehub',url}).catch(()=>{});
 else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>toast('🔗 Link kopyalandı')).catch(()=>{})}
function act(k,m,b){if(k==='share')return share(m);const on=tog(k,m.id);toast(MSG[k][+on]+m.n);if(k==='like'&&on)burst(b)}

// Detay penceresi
function openM(id){const m=M(id);if(!m)return;const v=cur(m);
 if(!S.seen.includes(id)){S.seen.push(id);gain(2);chk()}
 $('#md').innerHTML=`<button class="x" data-x>✕</button>
<div class="mh" style="background:linear-gradient(135deg,${m.g[0]}88,${m.g[1]}33)"><span>${m.e}</span></div>
<div class="mb" data-id="${m.id}"><h2>${m.n}</h2><div class="by">${m.by?'by '+m.by:''}</div>
<div class="tags" style="margin:10px 0">${tg(m,v)}${m.t.map(t=>`<i>#${t}</i>`).join('')}</div>
<p class="ds">${m.d}${m.nt?'<br><br>📝 '+m.nt:''}</p>
<h4>Sürümler</h4><div class="vl">${m.vs.map((x,k)=>`<div><b>${x[0]}</b><span>${[fmt(x[2]),k==0&&x[3]?ago(x[3]):'',k==0?'en yeni':''].filter(Boolean).join(' • ')}</span><button class="btn sm dlv" data-k="${k}">⬇</button></div>`).join('')}</div>
<h4>Kurulum ipuçları</h4><ul><li>İndirdiğin <b>.mcaddon</b> dosyasına dokun, Minecraft açılıp otomatik kurar.</li><li>Dünyanı düzenle → <b>Eklentiler</b>'den davranış ve kaynak paketini etkinleştir.</li>${m.x?'<li>🧪 Dünya ayarlarında <b>Deneysel Özellikler</b> açık olmalı.</li>':''}</ul>
<div class="act">${bt('like',m.id,' Beğen')}${bt('save',m.id,' Kaydet')}${bt('pick',m.id,' Koleksiyon')}<button class="b2" data-act="share">🔗 Paylaş</button><a class="b2" target="_blank" rel="noopener" href="${GH}?title=${encodeURIComponent('Sorun: '+m.n+' '+v[0])}">🐞 Sorun bildir</a></div><div id="gc"></div></div>`;
 $('#ov').classList.add('show');document.body.style.overflow='hidden';history.replaceState(null,'','#'+id);
 if(GC.repo){const h=$('#gc'),s=document.createElement('script');h.innerHTML='<h4>💬 Yorumlar</h4>';
  Object.entries({src:'https://giscus.app/client.js','data-repo':GC.repo,'data-repo-id':GC.rid,'data-category':GC.cat,'data-category-id':GC.cid,'data-mapping':'specific','data-term':m.n,'data-theme':'dark','data-lang':'tr','data-loading':'lazy',crossorigin:'anonymous'}).forEach(([a,b])=>s.setAttribute(a,b));
  s.async=true;h.appendChild(s)}}
function close_(){$('#ov').classList.remove('show');$('#md').innerHTML='';document.body.style.overflow='';history.replaceState(null,'',location.pathname+location.search)}
$('#ov').onclick=e=>{if(e.target.id==='ov')close_()};
$('#md').onclick=e=>{
 if(e.target.closest('[data-x]'))return close_();
 if(e.target.closest('[data-snd]')){S.snd=+!S.snd;persist();return openA()}
 const mb=$('#md .mb'),m=mb&&M(mb.dataset.id);if(!m)return;
 const a=e.target.closest('[data-act]');if(a)return act(a.dataset.act,m,a);
 const d=e.target.closest('.dlv');if(d)dl(m,m.vs[+d.dataset.k],d)};
$('#dock').onclick=e=>{if(e.target.id==='zc')setPick([]);if(e.target.id==='zb')zipAll()};

// Kart olayları
G.onclick=e=>{const c=e.target.closest('.card'),m=c&&M(c.dataset.id);if(!m)return;
 const a=e.target.closest('[data-act]');if(a)return act(a.dataset.act,m,a);
 const d=e.target.closest('.dl');if(d)return dl(m,cur(m),d);
 if(!e.target.closest('select'))openM(m.id)};
G.onchange=e=>{const c=e.target.closest('.card');if(!c||e.target.tagName!=='SELECT')return;
 const m=M(c.dataset.id),i=+e.target.value;S.ver[m.id]=i;persist();
 const z=c.querySelector('.sz');if(z)z.textContent=fmt(m.vs[i][2]);toast('Sürüm seçildi: '+m.n+' '+m.vs[i][0])};
G.onmousemove=e=>{const c=e.target.closest('.card');if(!c||c.classList.contains('sk'))return;
 const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,s=c.style;
 s.setProperty('--mx',x+'px');s.setProperty('--my',y+'px');s.setProperty('--rx',((y/r.height)-.5)*-7+'deg');s.setProperty('--ry',((x/r.width)-.5)*7+'deg')};
G.onmouseout=e=>{const c=e.target.closest('.card');if(c&&!c.contains(e.relatedTarget)){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}};
$('#chips').onclick=e=>{const c=e.target.closest('.chip');if(c){cat=c.dataset.c;render()}};
$('#sort').onchange=e=>{so=e.target.value;render()};
$('#q').oninput=e=>{q=e.target.value.toLowerCase();render()};

// XP, seviye, başarımlar, ses
const LV=x=>Math.floor(Math.sqrt(x/20))+1;
const ACH=[
 {id:'dl1',e:'⬇️',n:'İlk İndirme',d:'İlk modunu indir',f:()=>S.dl>=1},
 {id:'dl5',e:'📦',n:'Koleksiyoncu',d:'Toplam 5 mod indir',f:()=>S.dl>=5},
 {id:'lk3',e:'❤️',n:'Hayran',d:'3 mod beğen',f:()=>S.like.length>=3},
 {id:'sv3',e:'🔖',n:'Kitapçı',d:'3 mod kaydet',f:()=>S.save.length>=3},
 {id:'zip',e:'🧺',n:'Paketçi',d:'ZIP koleksiyon indir',f:()=>S.zip>=1},
 {id:'pk',e:'🎁',n:'Paket Avcısı',d:'Hazır paket seç',f:()=>S.pkc>=1},
 {id:'vw5',e:'🔍',n:'Meraklı',d:'5 farklı modu incele',f:()=>S.seen.length>=5},
 {id:'pal',e:'⌨️',n:'Güçlü Kullanıcı',d:'Komut paletini aç',f:()=>S.pal>=1},
 {id:'th',e:'🎨',n:'Stilist',d:'Tema rengini değiştir',f:()=>S.thc>=1}
];
let AC;
function snd(t){if(!S.snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();
 const o=AC.createOscillator(),g=AC.createGain(),T={xp:[880,1320,.08],lv:[523,1046,.35],ach:[660,990,.3],tap:[400,300,.04]}[t]||[500,500,.05],n=AC.currentTime;
 o.type=t==='tap'?'square':'sine';o.frequency.setValueAtTime(T[0],n);o.frequency.exponentialRampToValueAtTime(T[1],n+T[2]);
 g.gain.setValueAtTime(.05,n);g.gain.exponentialRampToValueAtTime(.001,n+T[2]+.05);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+T[2]+.06)}catch(e){}}
function xpUI(){const x=S.xp,l=LV(x),a=20*(l-1)**2,b=20*l*l;$('#lv').textContent='Sv '+l;$('#xpi').style.setProperty('--w',(x-a)/(b-a)*100+'%')}
function gain(n){const o=LV(S.xp);S.xp+=n;persist();xpUI();if(LV(S.xp)>o){snd('lv');toast('⬆️ Seviye atladın! Sv '+LV(S.xp))}else snd('xp')}
function chk(){ACH.forEach(a=>{if(!S.ach.includes(a.id)&&a.f()){S.ach.push(a.id);persist();gain(25);
 const h=$('#ach');h.innerHTML=`<em>${a.e}</em><div><b>Başarım kilidi açıldı!</b>${a.n}</div>`;h.classList.add('show');snd('ach');
 clearTimeout(chk.t);chk.t=setTimeout(()=>h.classList.remove('show'),3600)}})}
function openA(){const x=S.xp,l=LV(x);
 $('#md').innerHTML=`<button class="x" data-x>✕</button><div class="mb"><h2 class="px" style="font-size:1rem;padding-right:40px">Seviye ${l}</h2><div class="by">${x} XP • sonraki seviye ${20*l*l} XP</div>
<h4>Başarımlar (${S.ach.length}/${ACH.length})</h4><div class="vl">${ACH.map(a=>{const u=S.ach.includes(a.id);return `<div style="opacity:${u?1:.45}"><b style="min-width:34px;font-size:1.4rem">${u?a.e:'🔒'}</b><span><b style="color:#fff;min-width:0">${a.n}</b><br>${a.d}</span></div>`}).join('')}</div>
<div class="act"><button class="b2" data-snd>${S.snd?'🔊 Ses: Açık':'🔇 Ses: Kapalı'}</button></div></div>`;
 $('#ov').classList.add('show');document.body.style.overflow='hidden'}
$('#xp').onclick=openA;

// Günün modu, hazır paketler, kurulum rehberi
function packs(){const l=PACKS.map((k,i)=>({k,i})).filter(x=>x.k.ids.filter(M).length>1);
 $('#packs').innerHTML=l.map(x=>`<div class="pk" data-p="${x.i}"><span>${x.k.e}</span><div><b>${x.k.n}</b><small>${x.k.d} • ${x.k.ids.filter(M).length} mod</small></div></div>`).join('')}
$('#packs').onclick=e=>{const p=e.target.closest('.pk');if(!p)return;const k=PACKS[+p.dataset.p],ids=k.ids.filter(M);
 setPick(ids);S.pkc++;gain(5);chk();toast(`${k.e} ${k.n}: ${ids.length} mod koleksiyona eklendi`)};
function daily(){const d=new Date(),m=MODS[(d.getFullYear()*400+d.getMonth()*31+d.getDate())%MODS.length];if(!m)return;
 $('#dm').innerHTML=`<div class="dmi" data-id="${m.id}"><span style="font-size:2.2rem">${m.e}</span><div style="flex:1"><small class="px">GÜNÜN MODU</small><div style="margin-top:6px"><b>${m.n}</b> <span style="color:var(--mut);font-size:.85rem">${m.d}</span></div></div><button class="btn sm">İncele</button></div>`}
$('#dm').onclick=e=>{const d=e.target.closest('.dmi');if(d)openM(d.dataset.id)};
let gk=Object.keys(GUIDE)[0];
function guide(){$('#gt').innerHTML=Object.keys(GUIDE).map(k=>`<button class="chip${k===gk?' on':''}">${k}</button>`).join('');$('#gd').innerHTML=GUIDE[gk]}
$('#gt').onclick=e=>{const c=e.target.closest('.chip');if(c){gk=c.textContent;guide()}};

// Komut paleti (Ctrl/⌘+K)
const rnd=()=>{if(!MODS.length)return;cat='Hepsi';q='';$('#q').value='';render();
 const m=MODS[Math.random()*MODS.length|0],c=$('#c-'+m.id);c.scrollIntoView({behavior:'smooth',block:'center'});c.classList.add('flash');setTimeout(()=>c.classList.remove('flash'),2200)};
let ip;addEventListener('beforeinstallprompt',e=>{e.preventDefault();ip=e;$('#ins').style.display=''});
const install=()=>ip?ip.prompt():toast('📲 Tarayıcı menüsünden "Ana ekrana ekle"yi seç');
function pal(t=''){t=t.toLowerCase();
 pitems=[...MODS.map(m=>({t:m.e+' '+m.n,s:m.c,f:()=>openM(m.id)})),
  {t:'🎲 Rastgele mod',f:rnd},{t:'🏆 Başarımlarım',f:openA},{t:'❤ Beğendiklerim',f:()=>go(cats[1])},{t:'🔖 Kaydettiklerim',f:()=>go(cats[2])},
  {t:'🎨 Tema rengini değiştir',f:()=>theme((S.ac+1)%TH.length,1)},
  {t:'🔊 Sesi aç / kapat',f:()=>{S.snd=+!S.snd;persist();toast(S.snd?'🔊 Ses açık':'🔇 Ses kapalı')}},
  {t:'📝 Mod iste',f:()=>window.open(REQ)},{t:'📲 Uygulamayı yükle',f:install}
 ].filter(x=>x.t.toLowerCase().includes(t));pk=0;prn()}
const prn=()=>{$('#pl').innerHTML=pitems.map((x,i)=>`<div class="pi${i===pk?' on':''}" data-i="${i}">${x.t}<small>${x.s||''}</small></div>`).join('')||'<div class="pi">Sonuç yok</div>'};
const runP=i=>{const x=pitems[i];if(x){$('#pv').classList.remove('show');x.f()}};
function togPal(){const p=$('#pv');p.classList.toggle('show');
 if(p.classList.contains('show')){$('#pi').value='';pal();$('#pi').focus();if(!S.pal){S.pal=1;persist();chk()}}}
$('#kb').onclick=togPal;$('#rnd').onclick=rnd;$('#ins').onclick=install;
$('#pi').oninput=e=>pal(e.target.value);
$('#pl').onclick=e=>{const p=e.target.closest('.pi[data-i]');if(p)runP(+p.dataset.i)};
$('#pv').onclick=e=>{if(e.target.id==='pv')e.target.classList.remove('show')};
addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();return togPal()}
 if(e.key==='Escape'){close_();$('#pv').classList.remove('show');return}
 if($('#pv').classList.contains('show')){
  if(e.key==='ArrowDown'){pk=(pk+1)%(pitems.length||1);prn();e.preventDefault()}
  if(e.key==='ArrowUp'){pk=(pk-1+pitems.length)%(pitems.length||1);prn();e.preventDefault()}
  if(e.key==='Enter')runP(pk);return}
 if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();$('#q').focus()}});
addEventListener('click',e=>{if(e.target.closest('button,.chip,.card,.pk,.dmi'))snd('tap')});

// Tema, toast, efektler
function toast(t){const e=$('#toast');e.classList.remove('show');void e.offsetWidth;e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),2600)}
const TH=[['#ff4757','255,71,87'],['#3b82f6','59,130,246'],['#10b981','16,185,129'],['#a855f7','168,85,247']];
$('#dots').innerHTML=TH.map((t,i)=>`<span class="dot" data-i="${i}" style="background:${t[0]}"></span>`).join('');
function theme(i,u){S.ac=i;const r=document.documentElement.style;r.setProperty('--a',TH[i][0]);r.setProperty('--rgb',TH[i][1]);persist();
 document.querySelectorAll('.dot').forEach((d,k)=>d.classList.toggle('on',k===i));if(u){S.thc++;persist();chk()}}
$('#dots').onclick=e=>{if(e.target.dataset.i)theme(+e.target.dataset.i,1)};
addEventListener('scroll',()=>{$('#bar').style.width=scrollY/(document.body.scrollHeight-innerHeight)*100+'%'});
addEventListener('pointermove',e=>{$('#cg').style.transform=`translate(${e.clientX-250}px,${e.clientY-250}px)`});
const W=['Bedrock','Fizik','Görsel','Dekor','Araç'];let wi=0;
setInterval(()=>{const w=$('#w');w.style.opacity=0;setTimeout(()=>{w.textContent=W[++wi%W.length];w.style.opacity=1},300)},2300);
$('#rq').href=$('#rq2').href=REQ;
if(DISCORD){$('#dc').href=DISCORD;$('#dc').style.display=''}
if(SB.u)$('#sort').insertAdjacentHTML('beforeend','<option value="pop">En çok indirilen</option>');
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

// Başlat
theme(S.ac);xpUI();guide();G.innerHTML='<div class="card sk"></div>'.repeat(6);
Promise.all([load(),loadC()]).then(([m])=>{MODS=m;render();packs();daily();
 dates().then(()=>{const n=MODS.filter(m=>new Date(m.vs[0][3]||0)>S.last).length;
  if(S.last&&n)toast('🆕 Son ziyaretinden beri '+n+' yeni/güncel mod var!');S.last=Date.now();persist()});
 if(location.hash.length>1)openM(decodeURIComponent(location.hash.slice(1)))
}).catch(e=>{console.error(e);G.innerHTML='<div class="none">Modlar yüklenemedi 😢 Sayfayı yenile.</div>'});
