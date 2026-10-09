// ===== AYARLAR =====
const USER='Eymen6129',REPO='Mcbehub',BR='main';
const SB={u:'',k:''};                       // Supabase (ortak beğeni/sayaç), boşsa kapalı
const GC={repo:'',rid:'',cat:'',cid:''};   // giscus (yorumlar), boşsa kapalı
const DISCORD='';                           // Discord davet linki, boşsa buton gizli
const EXT=/\.(mcaddon|mcpack)$/i;

// ===== MODLAR =====
// k: dosya adı anahtarı • u: uyumlu sürüm • x:1 → "Deneysel özellik gerekir" • nt: ek not • by: yapımcı
const META=[
 {id:'bmc',k:'bmcaddon',n:'BMC Add-On',c:'Eklenti',e:'🧩',g:['#9b59b6','#6c3483'],d:'Oyuna yeni içerik ve mekanikler getiren kapsamlı eklenti.',t:['eklenti','içerik']},
 {id:'dav',k:'durability',n:'Durability Armor Viewer',c:'Araç',e:'🛡️',g:['#3498db','#1f618d'],d:'Zırh ve eşyalarının dayanıklılığını ekranda canlı gösterir.',t:['zırh','hud']},
 {id:'eb',k:'effortless',n:'Effortless Building',c:'Araç',e:'🏗️',g:['#f39c12','#d35400'],d:'Tek hamlede çizgi, duvar ve alan inşa et. Yapı yapmak çok hızlanır.',t:['inşa','yapı']},
 {id:'trees',k:'bettertrees',n:'Better Trees',by:'Daniye',c:'Görsel',e:'🌳',g:['#2ecc71','#16a085'],d:'Ağaçları daha dolgun, gerçekçi ve güzel hale getirir.',t:['doğa','ağaç']},
 {id:'ip',k:'itemphysics',n:'Item Physics',c:'Fizik',e:'🎒',g:['#5dade2','#8e44ad'],d:'Yere düşen eşyalar gerçekçi şekilde yere yatar, döner ve durur.',t:['fizik','eşya']},
 {id:'rr',k:'realragdoll',n:'RealRagdoll',c:'Fizik',e:'🧟',g:['#e74c3c','#922b21'],d:'Mob ve oyuncular ölünce gerçekçi ragdoll fiziğiyle yıkılır.',t:['fizik','mob']},
 {id:'rf',k:'rustic',n:'Rustic Furniture',c:'Dekor',e:'🪑',g:['#d68910','#935116'],d:'Köy tarzı rustik mobilyalar: masa, sandalye, dolap ve fazlası.',t:['mobilya','dekor']},
 {id:'sdl',k:'dynamiclights',n:'System Dynamic Lights',c:'Görsel',e:'🔦',g:['#f1c40f','#e67e22'],d:'Elindeki meşale ve parlayan eşyalar etrafı dinamik aydınlatır.',t:['ışık','görsel']},
 {id:'vm',k:'veinminer',n:'Vein Miner',c:'Araç',e:'⛏️',g:['#1abc9c','#2c3e50'],d:'Cevher damarını tek vuruşta kır, bağlı tüm bloklar topluca kazılır.',t:['madenci','araç']}
];

// GitHub listesi alınamazsa bu adlar kullanılır: depodaki dosya adlarıyla BİREBİR aynı yaz
const FALLBACK=['BMC_Add-On_4-25.mcaddon','Durability Armor Viewer v2.1.mcaddon','Effortless Building v5.0.mcaddon','Better Trees by Daniye - v1.4.mcaddon','Item Physics [V2.9] Behavior.mcaddon','RealRagdoll-1.3.0.mcaddon','Rustic Furnture.mcaddon','System Dynamic Lights V3.3.mcaddon','Utilities_Vein_Miner_v5.5.mcaddon'];

// ===== HAZIR PAKETLER ===== (ids: META'daki id'ler)
const PACKS=[
 {n:'Fizik Paketi',e:'🌀',d:'Gerçekçi fizik',ids:['ip','rr']},
 {n:'Güzellik Paketi',e:'✨',d:'Daha güzel dünya',ids:['trees','sdl']},
 {n:'Mühendis Paketi',e:'🛠️',d:'Hızlı inşa ve madencilik',ids:['eb','vm','dav']},
 {n:'Köy Paketi',e:'🏡',d:'Dekor, ışık ve ağaç',ids:['rf','sdl','trees']}
];

// ===== KURULUM REHBERİ =====
const GUIDE={
 '📱 Android':'1. Modu indir.<br>2. Bildirimden veya Dosyalar uygulamasından <b>.mcaddon</b> dosyasına dokun.<br>3. <b>Minecraft ile aç</b>\'ı seç, içe aktarma bitince oyunu aç.',
 '🍎 iPhone / iPad':'1. Safari ile indir (dosya Dosyalar uygulamasına düşer).<br>2. Dosyalar\'da .mcaddon dosyasına uzun bas → <b>Paylaş → Minecraft</b>.<br>3. İçe aktarma bitince dünyanda etkinleştir.',
 '🖥️ Windows':'1. Modu indir.<br>2. .mcaddon dosyasına <b>çift tıkla</b>, Minecraft kendiliğinden açılıp kurar.<br>3. Dünya ayarları → <b>Eklentiler</b>\'den etkinleştir.'
};
