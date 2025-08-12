// Canvas particle background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const P_COUNT = 68;

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function initParticles(){
  particles = Array.from({length:P_COUNT}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*2.2+0.4,
    a: Math.random()*360,
    v: 0.2+Math.random()*0.35,
    o: 0.15+Math.random()*0.25
  }));
}
initParticles();

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of particles){
    p.a += p.v * 0.2;
    p.x += Math.cos(p.a*0.017)*0.15;
    p.y += Math.sin(p.a*0.017)*0.15;
    if(p.x<0) p.x=canvas.width; if(p.x>canvas.width) p.x=0;
    if(p.y<0) p.y=canvas.height; if(p.y>canvas.height) p.y=0;
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
    g.addColorStop(0,`rgba(99,168,255,${p.o})`);
    g.addColorStop(1,'rgba(15,32,53,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle?.addEventListener('click',()=>{
  mainNav.classList.toggle('show');
  navToggle.classList.toggle('open');
});

// Animated stats counters
const counters = document.querySelectorAll('.num[data-target]');
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = +el.getAttribute('data-target');
      let current = 0;
      const duration = 1600;
      const start = performance.now();
      function update(ts){
        const p = Math.min(1,(ts-start)/duration);
        current = Math.floor(target * (p*p*(3-2*p))); // ease in-out
        el.textContent = current.toLocaleString();
        if(p<1) requestAnimationFrame(update); else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    }
  })
},{threshold:.4});

counters.forEach(c=>observer.observe(c));

// Scroll reveal
const revealEls = document.querySelectorAll('[data-animate], .category-card, .contact-card, .stat, .card.glass');
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
},{threshold:.2});
revealEls.forEach(el=>revealObs.observe(el));

// 已移除諮詢表單：保留占位註解以便未來需要再回復。

// Year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();
// Global init flag
window.GCSInit = true;

// Predeclare elements that will be assigned later (needed so applyLang can safely reference)
let productModal, modalTitle, productDesc, productCount, productUpdated, priceTbody, productSelect, discordJoinBtn;

// i18n translations (zh default, en fallback)
const I18N = {
  zh: {
    'hero.title':'GCS • 全方位代購',
    'nav.home':'首頁','nav.catalog':'商品服務','nav.about':'關於我們','nav.contact':'聯絡',
    'hero.subtitle':'串流｜遊戲｜技術服務 一站式安心代購',
    'hero.cta.browse':'瀏覽商品','hero.cta.contact':'聯絡我們',
    'catalog.title':'商品服務目錄','catalog.hint':'提示：點擊下方任一商品可開啟詳情與多方案價格表。','catalog.tip':'想了解詳細價格與規格？ <strong>請私訊管理員獲取專業諮詢！</strong>',
    'category.streaming':'串流媒體服務','category.gaming':'遊戲相關服務','category.tech':'專業技術服務',
    'about.title':'為什麼選擇 GCS？','about.desc':'我們提供安全、快速且透明的代購服務，涵蓋主流串流平台、熱門遊戲與進階技術服務，協助你省時省力取得最合適的方案。',
    'about.feature1':'多年經驗與良好評價','about.feature2':'嚴格風險控管與安全流程','about.feature3':'客製化技術與自動化方案','about.feature4':'快速回覆與售後支援',
    'about.vision.title':'願景','about.vision.text':'打造最值得信賴的一站式數位服務與內容供應平台。',
    'contact.title':'聯絡我們 / 取得報價',
    'contact.discord.title':'Discord','contact.discord.desc':'加入社群以獲得即時支援與公告。','contact.discord.join':'加入 Discord',
    'contact.ig.title':'Instagram','contact.ig.desc':'追蹤我們掌握活動與最新服務。','contact.ig.go':'前往 IG',
    'footer.nav':'快速導覽','footer.social':'社群',
  'modal.helper':'點擊「購買」將引導你前往 Discord 進行下單。',
  'footer.note':'提供合法合規的數位內容與技術協助。任何品牌標誌僅為識別用途。',
  'table.header.item':'品項','table.header.price':'價格 (TWD)','table.header.action':'',
  'stat.clients':'+ 累積客戶','stat.orders':'+ 完成訂單','stat.satisfaction':'% 滿意度',
  // Product names
  'prod.discord-nitro':'Discord Nitro','prod.youtube-premium':'YouTube Premium','prod.spotify':'Spotify','prod.netflix':'Netflix','prod.disney-plus':'Disney+',
  'prod.brawl-stars':'荒野亂鬥','prod.valorant':'特戰英豪','prod.roblox':'Roblox','prod.exitlag':'ExitLag',
  'prod.discord-store':'Discord Store','prod.surfshark':'SurfShark VPN','prod.discord-host':'Discord Host','prod.domain':'網域代購','prod.club-id':'社團識別證','prod.bot-dev':'Discord Bot代寫','prod.web-dev':'Website代寫'
  },
  en: {
    'hero.title':'GCS SHOP',
    'nav.home':'Home','nav.catalog':'Catalog','nav.about':'About','nav.contact':'Contact',
    'hero.subtitle':'Streaming | Gaming | Tech services in one trusted place',
    'hero.cta.browse':'Browse','hero.cta.contact':'Contact Us',
    'catalog.title':'Service Catalog','catalog.hint':'Tip: Click any item below to view details & pricing tiers.','catalog.tip':'Need more details? <strong>DM an admin for tailored advice!</strong>',
    'category.streaming':'Streaming Services','category.gaming':'Gaming Services','category.tech':'Technical Services',
    'about.title':'Why Choose GCS?','about.desc':'We deliver safe, fast and transparent purchasing across major streaming, popular games and advanced technical services.',
    'about.feature1':'Years of experience & strong reputation','about.feature2':'Strict risk control & secure process','about.feature3':'Customized automation & technical solutions','about.feature4':'Fast response & after-sales support',
    'about.vision.title':'Vision','about.vision.text':'Become the most trusted one-stop digital service platform.',
    'contact.title':'Contact / Business Inquiry',
    'contact.discord.title':'Discord','contact.discord.desc':'Join for real-time support & announcements.','contact.discord.join':'Join Discord',
    'contact.ig.title':'Instagram','contact.ig.desc':'Follow for updates & campaigns.','contact.ig.go':'Open IG',
    'footer.nav':'Navigation','footer.social':'Community',
  'modal.helper':'Click “Buy” to proceed via Discord.',
  'footer.note':'Providing compliant digital content & technical assistance. Brands shown are for identification only.',
  'table.header.item':'Item','table.header.price':'Price (TWD)','table.header.action':'',
  'stat.clients':'+ Clients','stat.orders':'+ Orders','stat.satisfaction':'% Satisfaction',
  'prod.discord-nitro':'Discord Nitro','prod.youtube-premium':'YouTube Premium','prod.spotify':'Spotify','prod.netflix':'Netflix','prod.disney-plus':'Disney+',
  'prod.brawl-stars':'Brawl Stars','prod.valorant':'Valorant','prod.roblox':'Roblox','prod.exitlag':'ExitLag',
  'prod.discord-store':'Discord Store','prod.surfshark':'SurfShark VPN','prod.discord-host':'Discord Host','prod.domain':'Domain Purchase','prod.club-id':'Club ID Badge','prod.bot-dev':'Discord Bot Dev','prod.web-dev':'Website Dev'
  }
};

// 產品名稱多語（下拉選單與標題用）: key 為 PRODUCTS 內的原始名稱
const PRODUCT_NAME_MAP = {
  '特戰英豪': { zh:'特戰英豪', en:'Valorant' },
  '荒野亂鬥': { zh:'荒野亂鬥', en:'Brawl Stars' },
  '網域代購': { zh:'網域代購', en:'Domain Purchase' },
  'Website代寫': { zh:'Website代寫', en:'Website Dev' },
  '社團識別證': { zh:'社團識別證', en:'Club ID Badge' },
  'Discord Bot代寫': { zh:'Discord Bot代寫', en:'Discord Bot Dev' },
  'Discord Host': { zh:'Discord Host', en:'Discord Host' },
  'Discord Store': { zh:'Discord Store', en:'Discord Store' },
  'Discord Nitro': { zh:'Discord Nitro', en:'Discord Nitro' },
  'Netflix': { zh:'Netflix', en:'Netflix' },
  'Spotify': { zh:'Spotify', en:'Spotify' },
  'Disney+': { zh:'Disney+', en:'Disney+' },
  'YouTube Premium': { zh:'YouTube Premium', en:'YouTube Premium' },
  'ExitLag': { zh:'ExitLag', en:'ExitLag' },
  'SurfShark VPN': { zh:'SurfShark VPN', en:'SurfShark VPN' },
  'Roblox': { zh:'Roblox', en:'Roblox' }
};

function getDisplayProductName(originalName, lang){
  const map = PRODUCT_NAME_MAP[originalName];
  if(!map) return originalName; // fallback 如果未定義
  return map[lang] || map.zh || originalName;
}

function applyLang(lang){
  const dict = I18N[lang] || I18N.zh;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const html = dict[key];
    if(html){
      el.innerHTML = html;
      if(el.classList.contains('glitch')) el.setAttribute('data-text', html);
    }
  });
  // Product list static text replacement
  document.querySelectorAll('[data-pid]').forEach(li=>{
    const pid = li.getAttribute('data-pid');
    const k = 'prod.'+pid;
    if(dict[k]) li.textContent = dict[k];
  });
  document.documentElement.lang = lang==='zh'?'zh-Hant':'en';
  document.body.classList.toggle('lang-en', lang==='en');
  localStorage.setItem('gcs_lang', lang);
  // Update active button
  document.querySelectorAll('#langSwitch button').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.lang===lang);
  });
  // Refresh modal contents if open
  if(productModal && productModal.classList && productModal.classList.contains('show')){
    const currentKey = productSelect?.value; // 使用原始 key 確保一致
    if(currentKey){
      buildSelect(currentKey); // 重新建立下拉 (翻譯 option)
      fillProduct(currentKey);
    }
  } else {
    // 若未開啟但曾建立過 select，仍需翻譯 option
    if(productSelect){
      const keep = productSelect.value;
      buildSelect(keep);
    }
  }
}

// Init language after DOM is ready to ensure nodes exist
document.addEventListener('DOMContentLoaded',()=>{
  const saved = localStorage.getItem('gcs_lang') || 'zh';
  applyLang(saved);
  document.getElementById('langSwitch')?.addEventListener('click',e=>{
    const btn = e.target.closest('button[data-lang]');
    if(!btn) return;
    applyLang(btn.dataset.lang);
  });
});

// Product data (multi-language capable)
const PRODUCTS = {
  "Netflix": { desc_i18n:{ zh:"Netflix 提供離線收看與線上電影與電視節目，提升您的電影體驗。", en:"Netflix offers offline viewing and a rich library of movies & shows."}, updated:"2025-07-16 18:32", items:[
    {k:"solo_1m", label:{zh:"獨享1個月", en:"Solo 1 Month"}, price:150},
    {k:"solo_3m", label:{zh:"獨享3個月", en:"Solo 3 Months"}, price:420},
    {k:"solo_6m", label:{zh:"獨享6個月", en:"Solo 6 Months"}, price:820},
    {k:"solo_12m", label:{zh:"獨享1年版", en:"Solo 1 Year"}, price:1650},
    {k:"share_1m", label:{zh:"共享1個月", en:"Shared 1 Month"}, price:150},
    {k:"share_3m", label:{zh:"共享3個月", en:"Shared 3 Months"}, price:350},
    {k:"share_6m", label:{zh:"共享6個月", en:"Shared 6 Months"}, price:650},
    {k:"share_12m", label:{zh:"共享1年版", en:"Shared 1 Year"}, price:1000}
  ]},
  "Spotify": { desc_i18n:{ zh:"Spotify 提供更多音樂與娛樂服務，提升您的音樂體驗。本商品為登入版，請提供帳密。", en:"Spotify premium access (login required). Enhanced music experience."}, updated:"2025-07-16 18:32", items:[
    {k:"1m", label:{zh:"1個月", en:"1 Month"}, price:120},
    {k:"3m", label:{zh:"3個月", en:"3 Months"}, price:250},
    {k:"6m", label:{zh:"6個月", en:"6 Months"}, price:380},
    {k:"12m", label:{zh:"1整年", en:"1 Year"}, price:450}
  ]},
  "Disney+": { desc_i18n:{ zh:"Disney+ 提供更多動畫與電影，提升您的電影體驗。", en:"Disney+ offers popular franchises, animated classics and originals."}, updated:"2025-07-16 18:32", items:[
    {k:"solo_1m", label:{zh:"獨享1個月", en:"Solo 1 Month"}, price:150},
    {k:"solo_3m", label:{zh:"獨享3個月", en:"Solo 3 Months"}, price:420},
    {k:"solo_6m", label:{zh:"獨享6個月", en:"Solo 6 Months"}, price:650},
    {k:"solo_12m", label:{zh:"獨享1年版", en:"Solo 1 Year"}, price:850}
  ]},
  "YouTube Premium": { desc_i18n:{ zh:"YouTube Premium 提供離線收看與 YouTube Music，提升您的 YouTube 使用體驗。", en:"YouTube Premium with ad-free playback, downloads & Music."}, updated:"2025-07-16 18:32", items:[
    {k:"personal_year", label:{zh:"個人年費", en:"Personal Annual"}, price:600},
    {k:"family_year", label:{zh:"家庭年費", en:"Family Annual"}, price:650},
    {k:"member_75", label:{zh:"頻道會員 1~75", en:"Channel Member 1~75"}, price:70},
    {k:"member_150", label:{zh:"頻道會員 150", en:"Channel Member 150"}, price:120},
    {k:"member_300", label:{zh:"頻道會員 300", en:"Channel Member 300"}, price:250}
  ]},
  "Discord Nitro": { desc_i18n:{ zh:"Discord Nitro 提供更多功能與伺服器加成，提升您的 Discord 體驗。", en:"Discord Nitro boosts features & server perks."}, updated:"2025-07-16 18:32", items:[
    {k:"login_1m", label:{zh:"1個月登入", en:"1M Login"}, price:145},
    {k:"login_12m", label:{zh:"1整年登入", en:"1Y Login"}, price:1400},
    {k:"gift_1m", label:{zh:"1個月贈禮", en:"1M Gift"}, price:225},
    {k:"gift_12m", label:{zh:"年費贈禮", en:"1Y Gift"}, price:2250}
  ]},
  "Discord Store": { desc_i18n:{ zh:"Discord Store 包含許多裝飾商品，提升您的 Discord 體驗。", en:"Discord Store decorative & profile items."}, updated:"2025-07-16 18:32", items:[
    {k:"gift_299", label:{zh:"A-禮物裝飾 $2.99", en:"Gift Deco $2.99"}, price:100},
    {k:"gift_399", label:{zh:"A-禮物裝飾 $3.99", en:"Gift Deco $3.99"}, price:120},
    {k:"gift_499", label:{zh:"禮物裝飾 $4.99", en:"Gift Deco $4.99"}, price:125},
    {k:"gift_549", label:{zh:"禮物裝飾 $5.49", en:"Gift Deco $5.49"}, price:130},
    {k:"gift_599", label:{zh:"禮物裝飾 $5.99", en:"Gift Deco $5.99"}, price:150},
    {k:"gift_699", label:{zh:"禮物裝飾 $6.99", en:"Gift Deco $6.99"}, price:175},
    {k:"gift_799", label:{zh:"禮物裝飾 $7.99", en:"Gift Deco $7.99"}, price:195},
    {k:"gift_849", label:{zh:"禮物裝飾 $8.49", en:"Gift Deco $8.49"}, price:210},
    {k:"gift_999", label:{zh:"禮物裝飾 $9.99", en:"Gift Deco $9.99"}, price:250},
    {k:"gift_1199", label:{zh:"禮物裝飾 $11.99", en:"Gift Deco $11.99"}, price:275},
    {k:"gift_1299", label:{zh:"禮物裝飾 $12.99", en:"Gift Deco $12.99"}, price:9999},
    {k:"gift_1599", label:{zh:"禮物裝飾 $15.99", en:"Gift Deco $15.99"}, price:9999},
    {k:"avatar_499", label:{zh:"登入裝飾 $4.99", en:"Login Deco $4.99"}, price:110},
    {k:"avatar_549", label:{zh:"登入裝飾 $5.49", en:"Login Deco $5.49"}, price:120},
    {k:"avatar_599", label:{zh:"登入裝飾 $5.99", en:"Login Deco $5.99"}, price:140},
    {k:"avatar_699", label:{zh:"登入裝飾 $6.99", en:"Login Deco $6.99"}, price:150},
    {k:"avatar_799", label:{zh:"登入裝飾 $7.99", en:"Login Deco $7.99"}, price:160},
    {k:"avatar_849", label:{zh:"登入裝飾 $8.49", en:"Login Deco $8.49"}, price:170},
    {k:"avatar_999", label:{zh:"登入裝飾 $9.99", en:"Login Deco $9.99"}, price:180},
    {k:"avatar_1199", label:{zh:"登入裝飾 $11.99", en:"Login Deco $11.99"}, price:190},
    {k:"avatar_1299", label:{zh:"登入裝飾 $12.99", en:"Login Deco $12.99"}, price:200},
    {k:"avatar_1599", label:{zh:"登入裝飾 $15.99", en:"Login Deco $15.99"}, price:240},
    {k:"name_499", label:{zh:"名牌 $4.99", en:"Name Tag $4.99"}, price:145},
    {k:"name_599", label:{zh:"名牌 $5.99", en:"Name Tag $5.99"}, price:165}
  ]},
  "Discord Host": { desc_i18n:{ zh:"Discord Host 代管服務，提供穩定節點、代維與監控，適合 Bot / 社群 / 輕量應用。", en:"Discord hosting with stable nodes, maintenance & monitoring."}, updated:"2025-08-13 12:00", items:[
    {k:"basic_1m", label:{zh:"1個月 基礎", en:"1M Basic"}, price:120},
    {k:"pro_1m", label:{zh:"1個月 進階", en:"1M Advanced"}, price:200},
    {k:"expert_1m", label:{zh:"1個月 專業", en:"1M Pro"}, price:320}
  ]},
  "ExitLag": { desc_i18n:{ zh:"ExitLag 提供更好的遊戲連線，提升您的遊戲體驗。", en:"ExitLag optimizes game routing for better latency."}, updated:"2025-07-16 18:32", items:[
    {k:"1m", label:{zh:"1個月", en:"1 Month"}, price:200},
    {k:"6m", label:{zh:"6個月", en:"6 Months"}, price:1050}
  ]},
  "SurfShark VPN": { desc_i18n:{ zh:"SurfShark 提供更安全的網路保護，提升您的網路體驗。", en:"SurfShark VPN secures and accelerates browsing."}, updated:"2025-07-16 18:32", items:[
    {k:"1y", label:{zh:"1年版", en:"1 Year"}, price:300},
    {k:"2y", label:{zh:"2年版", en:"2 Years"}, price:450}
  ]},
  "Roblox": { desc_i18n:{ zh:"Roblox 遊戲內購商品，提升您的遊戲體驗。", en:"Roblox in-game currency packages."}, updated:"2025-07-16 18:32", items:[
    {k:"80r", label:{zh:"80R", en:"80R"}, price:60},
    {k:"400r", label:{zh:"400R", en:"400R"}, price:150},
    {k:"800r", label:{zh:"800R", en:"800R"}, price:320},
    {k:"1700r", label:{zh:"1700R", en:"1700R"}, price:650},
    {k:"4500r", label:{zh:"4500R", en:"4500R"}, price:1500},
    {k:"10000r", label:{zh:"10000R", en:"10000R"}, price:2650},
    {k:"22500r", label:{zh:"22500R", en:"22500R"}, price:5500},
    {k:"32500r", label:{zh:"32500R", en:"32500R"}, price:7800}
  ]},
  "特戰英豪": { desc_i18n:{ zh:"特戰英豪（Valorant）遊戲內購商品，提升您的遊戲體驗。", en:"Valorant in-game currency packages."}, updated:"2025-07-16 18:32", items:[
    {k:"475vp", label:{zh:"475特務幣", en:"475 VP"}, price:180},
    {k:"1000vp", label:{zh:"1000特務幣", en:"1000 VP"}, price:300},
    {k:"2050vp", label:{zh:"2050特務幣", en:"2050 VP"}, price:600},
    {k:"3650vp", label:{zh:"3650特務幣", en:"3650 VP"}, price:1050},
    {k:"5350vp", label:{zh:"5350特務幣", en:"5350 VP"}, price:1400},
    {k:"9000vp", label:{zh:"9000特務幣", en:"9000 VP"}, price:2350},
    {k:"11000vp", label:{zh:"11000特務幣", en:"11000 VP"}, price:2750},
    {k:"13050vp", label:{zh:"13050特務幣", en:"13050 VP"}, price:3200},
    {k:"16350vp", label:{zh:"16350特務幣", en:"16350 VP"}, price:4200}
  ]},
  "荒野亂鬥": { desc_i18n:{ zh:"荒野亂鬥遊戲內購商品，提升您的遊戲體驗。", en:"Brawl Stars gems & pass."}, updated:"2025-07-16 18:32", items:[
    {k:"30g", label:{zh:"30寶石", en:"30 Gems"}, price:100},
    {k:"80g", label:{zh:"80寶石", en:"80 Gems"}, price:180},
    {k:"170g", label:{zh:"170寶石", en:"170 Gems"}, price:320},
    {k:"360g", label:{zh:"360寶石", en:"360 Gems"}, price:600},
    {k:"950g", label:{zh:"950寶石", en:"950 Gems"}, price:1500},
    {k:"2000g", label:{zh:"2000寶石", en:"2000 Gems"}, price:2950},
    {k:"pass", label:{zh:"通行證", en:"Season Pass"}, price:320}
  ]},
  "網域代購": { desc_i18n:{ zh:"專業網域註冊服務，提供子網域與獨立網域選擇，為您的品牌打造專屬網路位址。", en:"Domain registration & subdomain provisioning services."}, updated:"2025-07-16 18:32", items:[
    {k:"sub_3x3m", label:{zh:"子網域3組3個月", en:"3 Subdomains / 3 Months"}, price:150},
    {k:"root_domain", label:{zh:"獨立主網域", en:"Root Domain"}, price:500}
  ]},
  "Website代寫": { desc_i18n:{ zh:"專業網頁設計與開發服務，從形象網站到電子商務平台，為您打造專屬的網路形象。", en:"Professional web design & development from branding to e-commerce."}, updated:"2025-07-16 18:32", items:[
    {k:"branding_site", label:{zh:"形象式網頁", en:"Branding Site"}, price:550},
    {k:"custom_site", label:{zh:"自訂功能網站", en:"Custom Feature Site"}, price:600},
    {k:"commerce", label:{zh:"電子商務系統", en:"E-Commerce System"}, price:2000}
  ]},
  "社團識別證": { desc_i18n:{ zh:"校園社團客製化名字板與識別證，輕便塑膠材質，創意無限客製化設計。", en:"Custom ID badges for school clubs (light durable plastic)."}, updated:"2025-07-16 18:32", items:[
    {k:"single", label:{zh:"單件識別證", en:"Single Badge"}, price:250},
    {k:"bulk", label:{zh:"團隊訂購(10+)", en:"Bulk (10+)"}, price:200}
  ]},
  "Discord Bot代寫": { desc_i18n:{ zh:"專業Discord機器人開發服務，從基本功能到高度客製化商用機器人，滿足您的所有需求。", en:"Custom Discord bot development from basic to enterprise-scale."}, updated:"2025-07-16 18:32", items:[
    {k:"basic_bot", label:{zh:"基本功能機器人", en:"Basic Bot"}, price:500},
    {k:"advanced_bot", label:{zh:"進階機器人", en:"Advanced Bot"}, price:800},
    {k:"enterprise_bot", label:{zh:"商用級機器人", en:"Enterprise Bot"}, price:1500}
  ]}
};

// Modal logic (assign previously declared refs)
productModal = document.getElementById('productModal');
modalTitle = document.getElementById('modalTitle');
productDesc = document.getElementById('productDesc');
productCount = document.getElementById('productCount');
productUpdated = document.getElementById('productUpdated');
priceTbody = document.getElementById('priceTbody');
productSelect = document.getElementById('productSelect');
discordJoinBtn = document.getElementById('discordJoin');

function openModal(name){
  if(!PRODUCTS[name]) return;
  buildSelect(name);
  fillProduct(name);
  productModal.classList.add('show');
  productModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeModal(){
  productModal.classList.remove('show');
  productModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
function buildSelect(active){
  const lang = localStorage.getItem('gcs_lang') || 'zh';
  productSelect.innerHTML = Object.keys(PRODUCTS).map(k=>{
    const label = getDisplayProductName(k, lang);
    return `<option value="${k}" ${k===active?'selected':''}>${label}</option>`;
  }).join('');
  // Refresh enhanced custom select if present
  if(typeof window.refreshProductSelect === 'function') window.refreshProductSelect();
}
function fillProduct(name){
  const p = PRODUCTS[name];
  const lang = localStorage.getItem('gcs_lang') || 'zh';
  const dict = I18N[lang] || I18N.zh;
  const displayName = getDisplayProductName(name, lang);
  modalTitle.textContent = displayName;
  productDesc.textContent = p.desc_i18n ? (p.desc_i18n[lang] || p.desc_i18n.zh) : '';
  const count = p.items.length;
  productCount.textContent = lang==='en' ? `Items ${count}` : `可購商品 ${count} 種`;
  productUpdated.textContent = lang==='en' ? `Updated ${p.updated}` : `更新時間 ${p.updated}`;
  const buy = lang==='en' ? 'Buy' : '購買';
  priceTbody.innerHTML = p.items.map(it=>{
    const lbl = it.label[lang] || it.label.zh;
    return `<tr><td>${displayName} ${lbl}</td><td class="col-price">${it.price.toLocaleString()}</td><td><button data-inject="${displayName} ${lbl}">${buy}</button></td></tr>`;
  }).join('');
}

document.addEventListener('click',e=>{
  const li = e.target.closest('li[data-product]');
  if(li){
    openModal(li.getAttribute('data-product'));
  }
  if(e.target.matches('[data-close]')){
    closeModal();
  }
  if(e.target.matches('button[data-inject]')){
    // 關閉彈窗並捲動到 Discord 按鈕前
    closeModal();
    setTimeout(()=>{
      discordJoinBtn?.scrollIntoView({behavior:'smooth', block:'center'});
      discordJoinBtn?.classList.add('pulse-focus');
      setTimeout(()=>discordJoinBtn?.classList.remove('pulse-focus'),1800);
    },200);
  }
});
// Keyboard support for list items
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ') && document.activeElement?.matches('li[data-product]')){
    e.preventDefault();
    const name = document.activeElement.getAttribute('data-product');
    openModal(name);
  }
});
productSelect?.addEventListener('change',e=>fillProduct(e.target.value));
window.addEventListener('keydown',e=>{if(e.key==='Escape' && productModal.classList.contains('show')) closeModal();});

function detectCategoryFromProduct(name){
  if(/Netflix|Spotify|YouTube|Disney|Discord Nitro|Discord Store|SurfShark/i.test(name)){
    if(/Discord Store|SurfShark/.test(name)) return 'tech';
    return 'streaming';
  }
  if(/Roblox|特戰英豪|荒野|ExitLag/i.test(name)) return 'gaming';
  if(/網域代購|Website代寫|社團識別證|Discord Bot代寫/i.test(name)) return 'tech';
  return '';
}

// Accessibility focus trap (simple)
document.addEventListener('focus',e=>{
  if(productModal.classList.contains('show') && !productModal.contains(e.target)){
    productModal.querySelector('.modal-panel')?.focus?.();
  }
},true);

// Enhance select with custom dropdown
(function enhanceSelect(){
  if(!productSelect) return;
  const wrap = productSelect.parentElement;
  if(!wrap || wrap.classList.contains('enhanced')) return;
  wrap.classList.add('enhanced');
  const trigger = document.createElement('button');
  trigger.type='button';
  trigger.className='c-select';
  trigger.setAttribute('aria-haspopup','listbox');
  trigger.setAttribute('aria-expanded','false');
  trigger.textContent = productSelect.options[productSelect.selectedIndex]?.text || '選擇商品';
  const list = document.createElement('div');
  list.className='c-options';
  list.setAttribute('role','listbox');
  function rebuild(){
    list.innerHTML='';
    [...productSelect.options].forEach(opt=>{
      const btn=document.createElement('div');
      btn.className='c-option';
      btn.setAttribute('role','option');
      btn.setAttribute('data-value',opt.value);
      btn.setAttribute('tabindex','-1');
      if(opt.selected) btn.setAttribute('aria-selected','true');
      btn.textContent=opt.text;
      btn.addEventListener('click',()=>selectValue(opt.value));
      list.appendChild(btn);
    });
  }
  function open(){
    wrap.classList.add('select-open');
    trigger.setAttribute('aria-expanded','true');
    const sel = list.querySelector('[aria-selected="true"]');
    sel && sel.scrollIntoView({block:'nearest'});
  }
  function close(){
    wrap.classList.remove('select-open');
    trigger.setAttribute('aria-expanded','false');
  }
  function toggle(){wrap.classList.contains('select-open')?close():open();}
  function selectValue(val){
    if(productSelect.value!==val){
      productSelect.value=val;
      fillProduct(val);
    }
    [...list.children].forEach(c=>c.setAttribute('aria-selected',c.getAttribute('data-value')===val?'true':'false'));
    trigger.textContent=productSelect.options[productSelect.selectedIndex].text;
    close();
  }
  trigger.addEventListener('click',toggle);
  document.addEventListener('click',e=>{ if(!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown',e=>{
    if(!wrap.classList.contains('select-open')) return;
    const focusables=[...list.querySelectorAll('.c-option')];
    let idx=focusables.findIndex(el=>el===document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();(focusables[idx+1]||focusables[0]).focus();}
    else if(e.key==='ArrowUp'){e.preventDefault();(focusables[idx-1]||focusables.at(-1)).focus();}
    else if(e.key==='Enter'){e.preventDefault();document.activeElement?.click();}
    else if(e.key==='Escape'){close();trigger.focus();}
  });
  wrap.insertBefore(trigger,productSelect);
  wrap.appendChild(list);
  rebuild();
  // Expose refresh for outside updates
  window.refreshProductSelect = ()=>{
    rebuild();
    trigger.textContent = productSelect.options[productSelect.selectedIndex]?.text || '選擇商品';
  };
})();

// 已移除諮詢表單相關自訂下拉選單。
