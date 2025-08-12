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

// Quote form (mock handler)
const form = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');
form?.addEventListener('submit',e=>{
  e.preventDefault();
  formStatus.textContent = '傳送中...';
  formStatus.className = 'form-status';
  const data = Object.fromEntries(new FormData(form).entries());
  // Fake async
  setTimeout(()=>{
    if(!data.name || !data.email || !data.message){
      formStatus.textContent = '請完整填寫必要欄位。';
      formStatus.classList.add('error');
      return;
    }
    formStatus.textContent = '已送出，我們會盡速回覆！';
    formStatus.classList.add('success');
    form.reset();
  }, 900);
});

// Year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();
// Global init flag
window.GCSInit = true;

// Product data
const PRODUCTS = {
  "Netflix": {
    desc: "Netflix 提供離線收看與線上電影與電視節目，提升您的電影體驗。",
    count: 8,
    updated: "2025-07-16 18:32",
    items: [
      ["獨享1個月",150],["獨享3個月",420],["獨享6個月",820],["獨享1年版",1650],["共享1個月",150],["共享3個月",350],["共享6個月",650],["共享1年版",1000]
    ]
  },
  "Spotify": {
    desc: "Spotify 提供更多音樂與娛樂服務，提升您的音樂體驗。本商品為登入版，請提供帳密。",
    count: 4,updated:"2025-07-16 18:32",
    items:[["1個月",120],["3個月",250],["6個月",380],["1整年",450]]
  },
  "Disney+": {desc:"Disney+ 提供更多動畫與電影，提升您的電影體驗。",count:4,updated:"2025-07-16 18:32",items:[["獨享1個月",150],["獨享3個月",420],["獨享6個月",650],["獨享1年版",850]]},
  "YouTube Premium": {desc:"YouTube Premium 提供離線收看與 YouTube Music，提升您的 YouTube 使用體驗。",count:5,updated:"2025-07-16 18:32",items:[["個人年費",600],["家庭年費",650],["頻道會員 1~75",70],["頻道會員 150",120],["頻道會員 300",250]]},
  "Discord Nitro": {desc:"Discord Nitro 提供更多功能與伺服器加成，提升您的 Discord 體驗。",count:4,updated:"2025-07-16 18:32",items:[["1個月登入",145],["1整年登入",1400],["1個月贈禮",225],["年費贈禮",2250]]},
  "Discord Store": {desc:"Discord Store 包含許多裝飾商品，提升您的 Discord 體驗。",count:24,updated:"2025-07-16 18:32",items:[
    ["A-禮物裝飾 $2.99",100],["A-禮物裝飾 $3.99",120],["禮物裝飾 $4.99",125],["禮物裝飾 $5.49",130],["禮物裝飾 $5.99",150],["禮物裝飾 $6.99",175],["禮物裝飾 $7.99",195],["禮物裝飾 $8.49",210],["禮物裝飾 $9.99",250],["禮物裝飾 $11.99",275],["禮物裝飾 $12.99",9999],["禮物裝飾 $15.99",9999],["登入裝飾 $4.99",110],["登入裝飾 $5.49",120],["登入裝飾 $5.99",140],["登入裝飾 $6.99",150],["登入裝飾 $7.99",160],["登入裝飾 $8.49",170],["登入裝飾 $9.99",180],["登入裝飾 $11.99",190],["登入裝飾 $12.99",200],["登入裝飾 $15.99",240],["名牌 $4.99",145],["名牌 $5.99",165]
  ]},
  "ExitLag": {desc:"ExitLag 提供更好的遊戲連線，提升您的遊戲體驗。",count:2,updated:"2025-07-16 18:32",items:[["1個月",200],["6個月",1050]]},
  "SurfShark VPN": {desc:"SurfShark 提供更安全的網路保護，提升您的網路體驗。",count:2,updated:"2025-07-16 18:32",items:[["1年版",300],["2年版",450]]},
  "Roblox": {desc:"Roblox 遊戲內購商品，提升您的遊戲體驗。",count:8,updated:"2025-07-16 18:32",items:[["80R",60],["400R",150],["800R",320],["1700R",650],["4500R",1500],["10000R",2650],["22500R",5500],["32500R",7800]]},
  "特戰英豪": {desc:"特戰英豪（Valorant）遊戲內購商品，提升您的遊戲體驗。",count:9,updated:"2025-07-16 18:32",items:[["475特務幣",180],["1000特務幣",300],["2050特務幣",600],["3650特務幣",1050],["5350特務幣",1400],["9000特務幣",2350],["11000特務幣",2750],["13050特務幣",3200],["16350特務幣",4200]]},
  "荒野亂鬥": {desc:"荒野亂鬥遊戲內購商品，提升您的遊戲體驗。",count:7,updated:"2025-07-16 18:32",items:[["30寶石",100],["80寶石",180],["170寶石",320],["360寶石",600],["950寶石",1500],["2000寶石",2950],["通行證",320]]},
  "網域代購": {desc:"專業網域註冊服務，提供子網域與獨立網域選擇，為您的品牌打造專屬網路位址。",count:2,updated:"2025-07-16 18:32",items:[["子網域3組3個月",150],["獨立主網域",500]]},
  "Website代寫": {desc:"專業網頁設計與開發服務，從形象網站到電子商務平台，為您打造專屬的網路形象。",count:3,updated:"2025-07-16 18:32",items:[["形象式網頁",550],["自訂功能網站",600],["電子商務系統",2000]]},
  "社團識別證": {desc:"校園社團客製化名字板與識別證，輕便塑膠材質，創意無限客製化設計。",count:2,updated:"2025-07-16 18:32",items:[["單件識別證",250],["團隊訂購(10+)",200]]},
  "Discord Bot代寫": {desc:"專業Discord機器人開發服務，從基本功能到高度客製化商用機器人，滿足您的所有需求。",count:3,updated:"2025-07-16 18:32",items:[["基本功能機器人",500],["進階機器人",800],["商用級機器人",1500]]}
};

// Modal logic
const productModal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productDesc = document.getElementById('productDesc');
const productCount = document.getElementById('productCount');
const productUpdated = document.getElementById('productUpdated');
const priceTbody = document.getElementById('priceTbody');
const productSelect = document.getElementById('productSelect');
const quoteForm = document.getElementById('quoteForm');

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
  productSelect.innerHTML = Object.keys(PRODUCTS).map(k=>`<option value="${k}" ${k===active?'selected':''}>${k}</option>`).join('');
  // Refresh enhanced custom select if present
  if(typeof window.refreshProductSelect === 'function') window.refreshProductSelect();
}
function fillProduct(name){
  const p = PRODUCTS[name];
  modalTitle.textContent = name;
  productDesc.textContent = p.desc;
  productCount.textContent = `可購商品 ${p.count} 種`;
  productUpdated.textContent = `更新時間 ${p.updated}`;
  // guide removed per requirement
  priceTbody.innerHTML = p.items.map(([label,price])=>`<tr><td>${name} ${label}</td><td class="col-price">${price.toLocaleString()}</td><td><button data-inject="${name} ${label}">購買</button></td></tr>`).join('');
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
    const value = e.target.getAttribute('data-inject');
    if(quoteForm){
      const categoryField = quoteForm.querySelector('select[name="category"]');
      const itemField = quoteForm.querySelector('input[name="item"]');
      const cat = detectCategoryFromProduct(value);
      if(categoryField && cat){categoryField.value = cat;}
      if(itemField){itemField.value = value;}
      closeModal();
      setTimeout(()=>{document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});},260);
    }
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

// Enhance quote form category select similarly
(function enhanceQuoteCategory(){
  const catSelect = document.querySelector('form#quoteForm select[name="category"]');
  if(!catSelect) return;
  if(catSelect.dataset.enhanced) return;
  const wrap = document.createElement('div');
  wrap.className='select-wrap full enhanced';
  catSelect.parentNode.insertBefore(wrap,catSelect);
  wrap.appendChild(catSelect);
  catSelect.dataset.enhanced='true';
  const trigger = document.createElement('button');
  trigger.type='button';
  trigger.className='c-select';
  trigger.setAttribute('aria-haspopup','listbox');
  trigger.setAttribute('aria-expanded','false');
  trigger.textContent = catSelect.options[catSelect.selectedIndex]?.text || '選擇服務類型';
  const list = document.createElement('div');
  list.className='c-options';
  list.setAttribute('role','listbox');
  function rebuild(){
    list.innerHTML='';
    [...catSelect.options].forEach(opt=>{
      const optDiv=document.createElement('div');
      optDiv.className='c-option';
      optDiv.setAttribute('role','option');
      optDiv.setAttribute('data-value',opt.value);
      optDiv.tabIndex=-1;
      if(opt.selected) optDiv.setAttribute('aria-selected','true');
      optDiv.textContent=opt.text;
      optDiv.addEventListener('click',()=>selectValue(opt.value));
      list.appendChild(optDiv);
    });
  }
  function open(){wrap.classList.add('select-open');trigger.setAttribute('aria-expanded','true');}
  function close(){wrap.classList.remove('select-open');trigger.setAttribute('aria-expanded','false');}
  function toggle(){wrap.classList.contains('select-open')?close():open();}
  function selectValue(val){
    if(!val) return; // disabled placeholder
    catSelect.value=val;
    [...list.children].forEach(c=>c.setAttribute('aria-selected',c.getAttribute('data-value')===val?'true':'false'));
    trigger.textContent=catSelect.options[catSelect.selectedIndex].text;
    close();
  }
  trigger.addEventListener('click',toggle);
  document.addEventListener('click',e=>{if(!wrap.contains(e.target)) close();});
  document.addEventListener('keydown',e=>{
    if(!wrap.classList.contains('select-open')) return;
    const opts=[...list.querySelectorAll('.c-option')];
    let idx=opts.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();(opts[idx+1]||opts[0]).focus();}
    else if(e.key==='ArrowUp'){e.preventDefault();(opts[idx-1]||opts.at(-1)).focus();}
    else if(e.key==='Enter'){e.preventDefault();document.activeElement.click();}
    else if(e.key==='Escape'){close();trigger.focus();}
  });
  wrap.insertBefore(trigger,catSelect);
  wrap.appendChild(list);
  rebuild();
})();
