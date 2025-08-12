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
