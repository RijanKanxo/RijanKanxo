
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  SCENE CANVAS â€” perlin noise flow field
  Optimized: pauses when tab hidden,
  reduced on mobile
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const c=document.getElementById('scene');
  const ctx=c.getContext('2d');
  let W,H,running=true,raf;
  const isMob=window.innerWidth<640;
  function sz(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  sz();window.addEventListener('resize',sz);

  /* permutation table for noise */
  const P=(()=>{const p=Array.from({length:256},(_,i)=>i);for(let i=255;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]];}return[...p,...p];})();
  const f=t=>t*t*t*(t*(6*t-15)+10);
  const lp=(a,b,t)=>a+t*(b-a);
  const g=(h,x,y)=>((h&1)?-x:x)+((h&2)?-y:y);
  function noise(x,y){
    const X=Math.floor(x)&255,Y=Math.floor(y)&255,xf=x-Math.floor(x),yf=y-Math.floor(y);
    const u=f(xf),v=f(yf);
    return lp(lp(g(P[P[X]+Y]&15,xf,yf),g(P[P[X+1]+Y]&15,xf-1,yf),u),lp(g(P[P[X]+Y+1]&15,xf,yf-1),g(P[P[X+1]+Y+1]&15,xf-1,yf-1),u),v);
  }

  /* soft blobs â€” very slow */
  class Blob{
    constructor(){
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.r=isMob?120+Math.random()*180:200+Math.random()*300;
      this.nx=Math.random()*80;this.ny=Math.random()*80;this.nz=Math.random()*80;
      this.s=0.00025+Math.random()*0.0002;
    }
    tick(){
      this.nx+=this.s;this.ny+=this.s*.7;this.nz+=this.s*.5;
      this.x+=noise(this.nx,this.nz)*.5;
      this.y+=noise(this.ny,this.nz+50)*.5;
      if(this.x<-this.r)this.x=W+this.r;
      if(this.x>W+this.r)this.x=-this.r;
      if(this.y<-this.r)this.y=H+this.r;
      if(this.y>H+this.r)this.y=-this.r;
    }
    draw(){
      const a=0.012+noise(this.nz*1.5,this.nz)*0.008;
      const g2=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
      g2.addColorStop(0,`rgba(255,255,255,${a})`);
      g2.addColorStop(.55,`rgba(255,255,255,${a*.35})`);
      g2.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=g2;ctx.fill();
    }
  }

  /* flow lines */
  class Line{
    constructor(){this.reset();}
    reset(){
      this.pts=[];this.x=Math.random()*W;this.y=Math.random()*H;
      this.life=0;this.max=160+Math.random()*240;
      this.nx=Math.random()*40;this.ny=Math.random()*40;
    }
    tick(){
      this.life++;
      const ang=noise(this.nx,this.ny)*Math.PI*2.8;
      this.x+=Math.cos(ang)*.7;this.y+=Math.sin(ang)*.7;
      this.nx+=.005;this.ny+=.0035;
      this.pts.push({x:this.x,y:this.y});
      if(this.pts.length>45)this.pts.shift();
      if(this.life>this.max||this.x<-80||this.x>W+80||this.y<-80||this.y>H+80)this.reset();
    }
    draw(){
      if(this.pts.length<3)return;
      const a=Math.sin((this.life/this.max)*Math.PI)*.05;
      ctx.beginPath();ctx.moveTo(this.pts[0].x,this.pts[0].y);
      for(let i=1;i<this.pts.length-1;i++){
        ctx.quadraticCurveTo(this.pts[i].x,this.pts[i].y,(this.pts[i].x+this.pts[i+1].x)/2,(this.pts[i].y+this.pts[i+1].y)/2);
      }
      ctx.strokeStyle=`rgba(255,255,255,${a})`;ctx.lineWidth=.7;ctx.stroke();
    }
  }

  const blobCount=isMob?4:6;
  const lineCount=isMob?10:20;
  const blobs=Array.from({length:blobCount},()=>new Blob());
  const lines=Array.from({length:lineCount},()=>new Line());
  lines.forEach(l=>{l.life=Math.floor(Math.random()*l.max);});

  /* fps cap ~30 */
  let last=0;
  function frame(ts){
    if(!running){raf=requestAnimationFrame(frame);return;}
    if(ts-last<32){raf=requestAnimationFrame(frame);return;}
    last=ts;
    ctx.clearRect(0,0,W,H);
    blobs.forEach(b=>{b.tick();b.draw();});
    lines.forEach(l=>{l.tick();l.draw();});
    raf=requestAnimationFrame(frame);
  }
  if(prefersReducedMotion){
    ctx.clearRect(0,0,W,H);
    blobs.forEach(b=>{b.tick();b.draw();});
    lines.forEach(l=>{l.tick();l.draw();});
  }else{
    raf=requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange',()=>{running=!document.hidden;});
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HERO LOAD + COUNTER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initHeroLoad(){
  if(document.body.classList.contains('loaded'))return;
  document.body.classList.add('loaded');
  let v=0;const el=document.getElementById('c1');
  if(!el)return;
  const iv=setInterval(()=>{v++;el.textContent=v;if(v>=9){el.textContent='9+';el.classList.add('counted');clearInterval(iv);}},80);
}
if(document.readyState==='complete'||document.readyState==='interactive'){
  setTimeout(initHeroLoad,0);
}else{
  window.addEventListener('load',initHeroLoad,{once:true});
  document.addEventListener('DOMContentLoaded',initHeroLoad,{once:true});
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TICKER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const items=['UI/UX Design','Frontend Dev','React','Next.js','Figma','Branding','Open Source','Canvas API','Typography','Chitwan, Nepal','JavaScript'];
  const t=document.getElementById('tkr');
  [...items,...items,...items,...items].forEach(s=>{
    const d=document.createElement('div');
    d.className='ti';d.innerHTML=`<span class="ti-sep"></span>${s}`;
    t.appendChild(d);
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAV SCROLL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('on',scrollY>40),{passive:true});

function syncScrollEffects(){
  const y=window.scrollY||0;
  const nav=document.getElementById('nav');
  if(nav)nav.classList.toggle('on',y>40);

  const line=document.getElementById('scroll-line');
  if(line){
    const h=document.documentElement.scrollHeight-window.innerHeight;
    line.style.width=h>0?`${(y/h)*100}%`:'0%';
  }

  const hero=document.querySelector('.hero-h1');
  if(prefersReducedMotion){
    if(hero){hero.style.transform='';hero.style.opacity='';}
    return;
  }

  const scene=document.getElementById('scene');
  const spotlight=document.getElementById('spotlight');
  const trail=document.getElementById('trail-canvas');
  if(scene)scene.style.transform=`translate3d(0, ${y*.03}px, 0)`;
  if(hero){
    const p=Math.min(1,y/window.innerHeight);
    hero.style.transform=`translate3d(0, ${y*.14}px, 0) scale(${1-p*.02})`;
    hero.style.opacity=String(Math.max(0,1-p*1.05));
  }
}
window.addEventListener('scroll',syncScrollEffects,{passive:true});
syncScrollEffects();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   REVEAL ON SCROLL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const rvObs=new IntersectionObserver(es=>{
  es.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('on'),i*55);rvObs.unobserve(e.target);}});
},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>rvObs.observe(el));

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MOBILE NAV
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
let mO=false;
document.getElementById('hbg').addEventListener('click',()=>{
  mO=!mO;
  document.getElementById('mob-nav').classList.toggle('open',mO);
  const s=document.getElementById('hbg').querySelectorAll('span');
  if(mO){s[0].style.transform='rotate(45deg) translate(4px,4px)';s[1].style.opacity='0';s[2].style.transform='rotate(-45deg) translate(4px,-4px)';}
  else{s.forEach(x=>{x.style.transform='';x.style.opacity='';});}
});
function cM(){mO=false;document.getElementById('mob-nav').classList.remove('open');document.getElementById('hbg').querySelectorAll('span').forEach(x=>{x.style.transform='';x.style.opacity='';});}
document.querySelectorAll('#mob-nav a').forEach(link=>link.addEventListener('click',cM));

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PROJECT DATA â€” real case studies
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PROJECTS={
  uno:{
    title:'UNO Card Game',
    cat:'Frontend Experiment - 2024',
    chips:['Vanilla JavaScript','DOM Manipulation','Game Logic','CSS Animation'],
    link:'https://uno-wheat-ten.vercel.app',
    previewImage:'projects/uno-1.png',
    images:['projects/uno-1.png','projects/uno-2.png','projects/uno-3.png'],
    svgType:'code',
    problem:'I wanted a project that tested more than tutorials - real state management, complex rules, and an actual UI. UNO has 108 cards, turn logic, special cards (+2, +4, Skip, Reverse), and needs to feel like a real game.',
    role:'Solo developer. Designed and built everything - game logic, UI, card rendering, and turn system.',
    decisions:[
      'Chose vanilla JS over React to really understand DOM manipulation at a deep level',
      'Represented each card as a plain object {color, value} - kept state predictable',
      'Used event delegation instead of attaching listeners to every card for performance',
      'CSS custom properties for card colors - made theming trivial',
    ],
    challenge:'The +4 challenge rule - a player can challenge if they think the card was played illegally. Tracking playability state across turns without a framework required careful state design.',
    learned:'Pure JS forces you to think about state. Every framework hides this. Building without one made me understand why React exists.',
    snippet:`// Card playability check
function canPlay(card, topCard) {
  return card.color === 'wild' 
    || card.color === topCard.color 
    || card.value === topCard.value;
}`,
  },
  email:{
    title:'Email Client',
    cat:'Next.js - React - 2024',
    chips:['Next.js','React','API Integration','Component Design','Async State'],
    link:'https://fe-mail.vercel.app',
    previewImage:'projects/fe-mail-1.png',
    images:['projects/fe-mail-1.png','projects/fe-mail-2.png'],
    svgType:'ui',
    problem:'Most email UI tutorials show basic lists. I wanted to build something closer to real inbox design - threading, read/unread state, async loading, and a clean component API.',
    role:'Solo. Designed the component architecture, built the API layer, and handled all UI states (loading, error, empty).',
    decisions:[
      'Separated data fetching from UI - custom hooks for each resource',
      'Used optimistic updates for read/unread state so UI feels instant',
      'Built a composable layout system - sidebar, thread view, and message panel all independent',
      'Mobile-first breakpoints from the start',
    ],
    challenge:'Managing async state without a library like SWR - had to handle stale data, cancellation, and error states manually. Educational.',
    learned:'Building a real data layer teaches you why libraries like React Query exist. I now appreciate abstraction more.',
    snippet:`// Custom hook for email fetching
function useEmails(folderId) {
  const [state, setState] = useState({
    data: null, loading: true, error: null
  });
  useEffect(() => {
    fetchEmails(folderId)
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => setState({ data: null, loading: false, error: err }));
  }, [folderId]);
  return state;
}`,
  },
  unsent:{
    title:'Unsent Poems',
    cat:'Poetry Experience - Next.js - 2025',
    chips:['Next.js','Poetry','Reading Experience','Atmosphere'],
    link:'https://unsentpoems.vercel.app',
    svgType:'brand',
    problem:'I wanted to make a quiet, emotionally led website where presentation matters as much as content. The goal was not just to publish writing, but to create a reading space that feels intimate and intentional.',
    role:'Solo creator. Wrote the content direction, shaped the visual mood, and built the frontend experience.',
    decisions:[
      'Kept the interface minimal so the writing stays central',
      'Used spacing and pacing to slow the reader down',
      'Focused on atmosphere over feature count',
      'Treated typography as the main visual system',
    ],
    challenge:'Balancing restraint with personality. Too little styling feels plain, too much styling distracts from the poems.',
    learned:'Writing-focused products need just as much design care as technical products. Tone, rhythm, and whitespace do real product work.',
  },
  cashiro:{
    title:'Cashiro - Open Source',
    cat:'Contributor - JavaScript - 2024',
    chips:['Open Source','JavaScript','GitHub','Code Review','PR Process'],
    link:'https://github.com/rijan-poudel',
    svgType:'ossgraph',
    problem:'Cashiro is an open-source personal finance app. It lacked support for Nepali banking systems - local users couldn\'t connect their banks. As someone from Nepal, this felt like something I could actually fix.',
    role:'Contributor. Researched Nepali bank APIs, wrote the integration code, submitted a PR, went through review, and got it merged.',
    decisions:[
      'Followed the existing bank adapter pattern exactly - no new abstractions',
      'Added test cases that matched the existing test structure',
      'Wrote clear commit messages and a detailed PR description for reviewers',
      'Kept the change small and focused - one thing done well',
    ],
    challenge:'Understanding an unfamiliar codebase with no documentation. Spent time reading existing bank adapters before writing a single line of code.',
    learned:'Open source is mostly reading, not writing. Understanding code > writing code. A well-described PR is as important as the code itself.',
    snippet:`// Nepali bank adapter
const NepaliBank = {
  id: 'nepali-bank',
  name: 'Nepal Bank Limited',
  country: 'NP',
  currency: 'NPR',
  fetchBalance: async (credentials) => {
    // Integrated with local banking API
  }
};`,
  },
  wearecars:{
    title:'WeAreCars Rental System',
    cat:'Desktop App - Python - Tkinter',
    chips:['Python','Tkinter','Booking System','Admin UI'],
    link:'https://github.com/rijan-poudel/WeAreCarsRentalSystem_Tkinter',
    previewImage:'projects/Screenshot 2026-05-24 173018.png',
    images:[
      'projects/Screenshot 2026-05-24 173018.png',
      'projects/Screenshot 2026-05-24 172935.png',
      'projects/Screenshot 2026-05-24 172922.png',
      'projects/Screenshot 2026-05-24 172859.png'
    ],
    svgType:'ui',
    problem:'I wanted to build a proper rental management system instead of another simple CRUD exercise. The goal was to handle bookings, vehicle returns, rented-car tracking, and staff-facing workflows inside a desktop interface.',
    role:'Solo developer. Built the application structure, desktop UI, booking flow, and operational screens for staff use.',
    decisions:[
      'Chose Tkinter to focus on application logic and structured desktop workflows',
      'Designed around staff tasks first — login, create booking, view rented cars, and process returns',
      'Used table-heavy screens to keep operational information readable',
      'Kept the visual system dark and clean so dense information stayed manageable',
    ],
    challenge:'Desktop admin tools can become cluttered fast. The hardest part was keeping the data-heavy screens readable while still making the system feel coherent and usable.',
    learned:'Building software for operations is different from building showcase UIs. Clarity, flow, and reliability matter more than decoration, and that taught me a lot about practical product thinking.',
  },
  minnano:{
    title:'Minnano Education',
    cat:'Visual Identity - Branding - Client Work',
    chips:['Branding','Figma','Social Media','Photoshop','Visual Identity'],
    link:'mailto:rijankanxo111@gmail.com',
    svgType:'brand',
    problem:'Minnano Education Pvt. Ltd. needed a consistent visual identity for their social media. Their posts were inconsistent - different fonts, colors, and styles across platforms. No recognition, no trust.',
    role:'Lead designer. Created the full social media design system - color palette, typography rules, template library, and visual guidelines.',
    decisions:[
      'Chose a warm, educational color palette - approachable but professional',
      'Built reusable Figma templates so the client could produce content without a designer',
      'Consistent grid system across all post formats (square, story, banner)',
      'Reduced color count to two primaries - easier to maintain, stronger recognition',
    ],
    challenge:'Clients often want "more colors" and "more elements." The challenge was selling restraint. Showing before/after comparisons helped.',
    learned:'Good design work is partly design, partly client education. Simplicity needs to be sold, not assumed.',
  },
  sacco:{
    title:'SACCO Promotional Design',
    cat:'Print Design - Nepal',
    chips:['Print Design','Photoshop','Brochure','Promotional'],
    link:'mailto:rijankanxo111@gmail.com',
    svgType:'print',
    problem:'A savings cooperative (SACCO) needed promotional materials - brochures, flyers, and posters - to communicate their services to a local, mostly non-digital audience. Print-first, trust-first.',
    role:'Designer. Created all print collateral - brochures, A4 flyers, and social media adaptations.',
    decisions:[
      'Used bold, high-contrast typography for instant readability at a distance',
      'Grounded the palette in blues and greens - trust and stability for a financial brand',
      'Kept layouts clean - local print shops have limitations, complicated designs fail in print',
      'All artwork in CMYK from the start',
    ],
    challenge:'Designing for print when you\'ve mostly worked digitally. Learning bleed, safe areas, and CMYK color modes. Some colors look great on screen and terrible printed.',
    learned:'Print constraints are design constraints. Working within them makes you a better digital designer too.',
  },
  consult:{
    title:'Consultancy Branding',
    cat:'Identity Design - Visiting Cards - Collateral',
    chips:['Logo Design','Visiting Cards','Brand Identity','Illustrator'],
    link:'mailto:rijankanxo111@gmail.com',
    svgType:'card',
    problem:'A local businessman needed a complete brand identity from scratch - logo, visiting cards, and document templates. Nothing existed. First impression was everything.',
    role:'Brand designer. Delivered logo, color system, typography, visiting cards, and a basic brand guide.',
    decisions:[
      'Started with values, not aesthetics - understood the business before opening Illustrator',
      'Designed three logo directions to show range, then refined the chosen one through 4 rounds',
      'Visiting card: chose a single-color print approach - cheaper, cleaner, more professional',
      'Wrote a one-page brand guide so the client could stay consistent without me',
    ],
    challenge:'Balancing the client\'s taste with what actually works. They wanted complex. I delivered simple. They were initially skeptical. After printing, they loved it.',
    learned:'The best logo is the one that works at 1cm and 1 meter. Simplicity isn\'t laziness - it\'s the hardest thing to achieve.',
  },
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SVG DIAGRAMS for project previews & modals
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const SVG_PREVIEW={
  code:`
    <rect width="300" height="188" fill="#101010"/>
    <rect x="20" y="20" width="260" height="148" rx="6" fill="#161616" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <rect x="20" y="20" width="260" height="28" rx="6" fill="#1a1a1a"/>
    <circle cx="36" cy="34" r="5" fill="#ff5f57"/><circle cx="52" cy="34" r="5" fill="#febc2e"/><circle cx="68" cy="34" r="5" fill="#28c840"/>
    <rect x="32" y="60" width="120" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
    <rect x="32" y="76" width="80" height="6" rx="3" fill="rgba(255,255,255,0.08)"/>
    <rect x="44" y="92" width="100" height="6" rx="3" fill="rgba(255,255,255,0.06)"/>
    <rect x="44" y="108" width="60" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
    <rect x="32" y="124" width="90" height="6" rx="3" fill="rgba(255,255,255,0.06)"/>
    <rect x="44" y="140" width="70" height="6" rx="3" fill="rgba(255,255,255,0.04)"/>
    <rect x="170" y="60" width="90" height="6" rx="3" fill="rgba(255,255,255,0.05)"/>
    <rect x="170" y="76" width="70" height="6" rx="3" fill="rgba(255,255,255,0.07)"/>
  `,
  ui:`
    <rect width="300" height="188" fill="#101010"/>
    <rect x="16" y="16" width="80" height="156" rx="4" fill="#161616" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <rect x="104" y="16" width="180" height="156" rx="4" fill="#141414" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    <rect x="24" y="28" width="64" height="8" rx="2" fill="rgba(255,255,255,0.1)"/>
    <rect x="24" y="46" width="64" height="28" rx="3" fill="rgba(255,255,255,0.06)"/>
    <rect x="24" y="82" width="64" height="28" rx="3" fill="rgba(255,255,255,0.03)"/>
    <rect x="24" y="118" width="64" height="28" rx="3" fill="rgba(255,255,255,0.03)"/>
    <rect x="112" y="24" width="80" height="6" rx="2" fill="rgba(255,255,255,0.12)"/>
    <rect x="112" y="38" width="164" height="1" fill="rgba(255,255,255,0.05)"/>
    <rect x="112" y="48" width="164" height="40" rx="3" fill="#1a1a1a"/>
    <rect x="120" y="56" width="100" height="6" rx="2" fill="rgba(255,255,255,0.08)"/>
    <rect x="120" y="70" width="70" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="112" y="96" width="164" height="30" rx="3" fill="#161616"/>
    <rect x="120" y="104" width="80" height="6" rx="2" fill="rgba(255,255,255,0.07)"/>
    <rect x="120" y="118" width="50" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
  `,
  ossgraph:`
    <rect width="300" height="188" fill="#101010"/>
    <circle cx="150" cy="94" r="28" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <circle cx="240" cy="60" r="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <circle cx="60" cy="130" r="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <circle cx="240" cy="130" r="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <line x1="76" y1="68" x2="124" y2="82" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <line x1="224" y1="68" x2="176" y2="82" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <line x1="76" y1="122" x2="124" y2="108" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <line x1="224" y1="122" x2="176" y2="108" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <circle cx="150" cy="94" r="6" fill="rgba(255,255,255,0.5)"/>
    <circle cx="60" cy="60" r="4" fill="rgba(255,255,255,0.2)"/>
    <circle cx="240" cy="60" r="4" fill="rgba(255,255,255,0.2)"/>
    <circle cx="60" cy="130" r="4" fill="rgba(255,255,255,0.2)"/>
    <circle cx="240" cy="130" r="4" fill="rgba(255,255,255,0.2)"/>
    <text x="126" y="168" fill="rgba(255,255,255,0.25)" font-size="9" font-family="Inter,sans-serif" letter-spacing="1">PR MERGED</text>
  `,
  brand:`
    <rect width="300" height="188" fill="#101010"/>
    <rect x="40" y="40" width="100" height="100" rx="12" fill="#161616" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <rect x="56" y="72" width="68" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
    <rect x="64" y="86" width="52" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
    <rect x="56" y="100" width="20" height="20" rx="4" fill="rgba(255,255,255,0.12)"/>
    <rect x="82" y="100" width="20" height="20" rx="4" fill="rgba(255,255,255,0.06)"/>
    <rect x="108" y="100" width="20" height="20" rx="4" fill="rgba(255,255,255,0.03)"/>
    <rect x="160" y="40" width="100" height="44" rx="6" fill="#161616" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <rect x="170" y="52" width="80" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
    <rect x="170" y="66" width="56" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
    <rect x="160" y="94" width="100" height="44" rx="6" fill="#141414" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    <rect x="170" y="106" width="60" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
    <rect x="170" y="118" width="80" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="40" y="152" width="220" height="1" fill="rgba(255,255,255,0.05)"/>
    <rect x="40" y="162" width="40" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
    <rect x="88" y="162" width="40" height="4" rx="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="136" y="162" width="40" height="4" rx="2" fill="rgba(255,255,255,0.05)"/>
  `,
  print:`
    <rect width="300" height="188" fill="#101010"/>
    <rect x="30" y="24" width="112" height="148" rx="4" fill="#161616" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    <rect x="38" y="36" width="96" height="48" rx="2" fill="#1a1a1a"/>
    <rect x="38" y="94" width="80" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
    <rect x="38" y="108" width="96" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
    <rect x="38" y="118" width="72" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="38" y="128" width="88" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="38" y="148" width="36" height="10" rx="5" fill="rgba(255,255,255,0.1)"/>
    <rect x="158" y="24" width="112" height="66" rx="4" fill="#141414" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <rect x="166" y="34" width="96" height="28" rx="2" fill="#1a1a1a"/>
    <rect x="166" y="70" width="60" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
    <rect x="158" y="106" width="112" height="66" rx="4" fill="#131313" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    <rect x="166" y="116" width="96" height="28" rx="2" fill="#1a1a1a"/>
    <rect x="166" y="152" width="50" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
  `,
  card:`
    <rect width="300" height="188" fill="#101010"/>
    <rect x="30" y="54" width="240" height="80" rx="8" fill="#181818" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <rect x="46" y="70" width="90" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
    <rect x="46" y="86" width="120" height="5" rx="2" fill="rgba(255,255,255,0.06)"/>
    <rect x="46" y="98" width="80" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="46" y="108" width="60" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="196" y="72" width="56" height="40" rx="4" fill="rgba(255,255,255,0.03)"/>
    <circle cx="224" cy="92" r="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <rect x="76" y="150" width="148" height="1" fill="rgba(255,255,255,0.04)"/>
    <rect x="106" y="158" width="88" height="4" rx="2" fill="rgba(255,255,255,0.04)"/>
  `,
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FLOATING PROJECT PREVIEW
   pointer-events: none â€” row stays clickable
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const fl=document.getElementById('proj-float');
  let mx=0,my=0,px=-999,py=-999,current=null,animating=false,raf2;

  function setPreview(key){
    const project=PROJECTS[key];
    if(project?.previewImage){
      fl.innerHTML=`<img src="${project.previewImage}" alt="${project.title} preview"/>`;
      return;
    }
    fl.innerHTML=`<svg id="proj-float-svg" viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg"></svg>`;
    const previewSvg=fl.querySelector('#proj-float-svg');
    const d=SVG_PREVIEW[project?.svgType]||SVG_PREVIEW.code;
    previewSvg.innerHTML=d;
  }
  function track(){
    px+=(mx-160-px)*.13;py+=(my-100-py)*.13;
    fl.style.left=px+'px';fl.style.top=py+'px';
    raf2=requestAnimationFrame(track);
  }
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  document.querySelectorAll('.proj-row').forEach(row=>{
    row.addEventListener('mouseenter',()=>{
      if(prefersReducedMotion)return;
      const k=row.dataset.key;
      if(k!==current){current=k;setPreview(k);}
      fl.classList.add('vis');
      if(!animating){animating=true;raf2=requestAnimationFrame(track);}
    });
    row.addEventListener('mouseleave',()=>{
      fl.classList.remove('vis');
      if(raf2){cancelAnimationFrame(raf2);animating=false;}
    });
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PROJECT MODAL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function openModal(key){
  const p=PROJECTS[key];if(!p)return;
  const mediaContent=p.images?.length
    ? `<div class="modal-shot-grid">${p.images.map((src,idx)=>`<figure class="modal-shot"><img src="${src}" alt="${p.title} screenshot ${idx+1}"/></figure>`).join('')}</div>`
    : `<div class="modal-svg-wrap"><svg viewBox="0 0 300 188" xmlns="http://www.w3.org/2000/svg">${SVG_PREVIEW[p.svgType]||''}</svg></div>`;
  let html=`
    <div class="modal-tag">${p.cat}</div>
    <div class="modal-title" id="modal-title">${p.title}</div>
    <div class="modal-meta">${p.chips.map(c=>`<span class="modal-chip">${c}</span>`).join('')}</div>
    ${mediaContent}
    <div class="modal-section"><h4>The Problem</h4><p>${p.problem}</p></div>
    <div class="modal-section"><h4>My Role</h4><p>${p.role}</p></div>
    <div class="modal-section"><h4>Design Decisions</h4><ul>${p.decisions.map(d=>`<li>${d}</li>`).join('')}</ul></div>
    <div class="modal-section"><h4>Hardest Part</h4><p>${p.challenge}</p></div>
  `;
  if(p.snippet){html+=`<div class="modal-section"><h4>Code Snippet</h4><pre class="modal-code">${p.snippet.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre></div>`;}
  html+=`<div class="learn-box">${p.learned}</div>`;
  const linkLabel=p.link.startsWith('mailto')
    ? 'Get in touch'
    : (p.link.includes('vercel.app') ? 'View live site' : 'View on GitHub');
  const linkTarget=p.link.startsWith('mailto')? '_self':'_blank';
  const linkRel=linkTarget==='_blank' ? ' rel="noopener noreferrer"' : '';
  html+=`<div style="margin-top:20px;"><a href="${p.link}" target="${linkTarget}"${linkRel} class="modal-link">${linkLabel}</a></div>`;
  document.getElementById('modal-body').innerHTML=html;
  document.getElementById('modal').scrollTop=0;
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal').classList.add('open');
  document.getElementById('modal').focus();
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('modal-overlay').addEventListener('click',closeModal);
document.getElementById('modal-close-btn').addEventListener('click',closeModal);
document.querySelectorAll('.proj-row').forEach(row=>{
  row.addEventListener('click',()=>openModal(row.dataset.key));
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GITHUB CONSTELLATION BG
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const c=document.getElementById('gh-bg');
  const ctx=c.getContext('2d');
  function sz(){c.width=c.offsetParent?.offsetWidth||900;c.height=c.offsetParent?.offsetHeight||500;}
  setTimeout(sz,300);window.addEventListener('resize',()=>setTimeout(sz,300));
  const pts=Array.from({length:30},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.0003,vy:(Math.random()-.5)*.0003}));
  function draw(){
    const W=c.width,H=c.height;
    if(!W||!H){requestAnimationFrame(draw);return;}
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;});
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=(pts[i].x-pts[j].x)*W,dy=(pts[i].y-pts[j].y)*H,d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x*W,pts[i].y*H);ctx.lineTo(pts[j].x*W,pts[j].y*H);ctx.strokeStyle=`rgba(255,255,255,${.05*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke();}
    }
    pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x*W,p.y*H,.9,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fill();});
    requestAnimationFrame(draw);
  }
  if(!prefersReducedMotion){
    draw();
  }
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONTRIBUTION GRID â€” 365 days (53Ã—7)
   More organic distribution
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const g=document.getElementById('cg');
  const total=53*7;
  // Generate realistic-looking contribution pattern
  // Sparse early, slightly denser later in year (starting contributor)
  for(let i=0;i<total;i++){
    const d=document.createElement('div');
    d.className='cc';
    const weekProgress=Math.floor(i/7)/52; // 0 to 1
    // Higher probability later in the year
    const baseProbability=weekProgress*0.35+0.02;
    const r=Math.random();
    if(r<baseProbability*.15)d.classList.add('l4');
    else if(r<baseProbability*.3)d.classList.add('l3');
    else if(r<baseProbability*.55)d.classList.add('l2');
    else if(r<baseProbability)d.classList.add('l1');
    g.appendChild(d);
  }
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONTACT FORM
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
// Legacy mailto fallback removed — contact is handled via `/api/contact` (server-side proxy).
// The client-side script attaches to `#cf` and will open the user's mail client only when
// the server-side endpoint is not configured or when forwarding fails.

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SCROLL PROGRESS LINE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const line=document.getElementById('scroll-line');
  window.addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-window.innerHeight;
    const pct=h>0?(window.scrollY/h*100):0;
    line.style.width=pct+'%';
  },{passive:true});
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SKILLS SECTION â€” FLOW LINES CANVAS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const c=document.getElementById('skills-flow');
  if(!c)return;
  const ctx=c.getContext('2d');
  if(!ctx)return;
  if(prefersReducedMotion)return;
  let W=0,H=0,running=true,raf;

  function resize(){
    const section=document.getElementById('skills');
    if(!section)return;
    W=c.width=section.offsetWidth||0;
    H=c.height=section.offsetHeight||0;
  }
  resize();
  window.addEventListener('load',()=>{setTimeout(resize,50);});
  window.addEventListener('resize',()=>setTimeout(resize,200),{passive:true});

  /* minimal Perlin noise */
  const P=(()=>{
    const p=Array.from({length:256},(_,i)=>i);
    for(let i=255;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]];}
    return[...p,...p];
  })();
  const fade=t=>t*t*t*(t*(6*t-15)+10);
  const lerp=(a,b,t)=>a+t*(b-a);
  const grad=(h,x,y)=>((h&1)?-x:x)+((h&2)?-y:y);
  function noise(x,y){
    const X=Math.floor(x)&255,Y=Math.floor(y)&255;
    const xf=x-Math.floor(x),yf=y-Math.floor(y);
    const u=fade(xf),v=fade(yf);
    return lerp(
      lerp(grad(P[P[X]+Y]&15,xf,yf),grad(P[P[X+1]+Y]&15,xf-1,yf),u),
      lerp(grad(P[P[X]+Y+1]&15,xf,yf-1),grad(P[P[X+1]+Y+1]&15,xf-1,yf-1),u),
      v
    );
  }

  /* Flow line class */
  class FLine{
    constructor(){this.reset(true);}
    reset(init){
      this.pts=[];
      if(!W||!H){
        this.x=0;this.y=0;this.life=0;this.max=1;this.nx=0;this.ny=0;this.speed=0;this.alpha=0;
        return;
      }
      this.x=Math.random()*W;
      this.y=init?(Math.random()*H):(Math.random()<.5?-10:H+10);
      this.life=0;
      this.max=120+Math.random()*200;
      this.nx=Math.random()*60;
      this.ny=Math.random()*60;
      this.speed=0.55+Math.random()*0.5;
      this.alpha=0.04+Math.random()*0.05;
    }
    tick(){
      this.life++;
      const ang=noise(this.nx,this.ny)*Math.PI*3;
      this.x+=Math.cos(ang)*this.speed;
      this.y+=Math.sin(ang)*this.speed;
      this.nx+=.004;this.ny+=.003;
      this.pts.push({x:this.x,y:this.y});
      if(this.pts.length>50)this.pts.shift();
      if(this.life>this.max||this.x<-60||this.x>W+60||this.y<-60||this.y>H+60)this.reset(false);
    }
    draw(){
      if(this.pts.length<3)return;
      const prog=Math.sin((this.life/this.max)*Math.PI);
      const a=this.alpha*prog;
      ctx.beginPath();
      ctx.moveTo(this.pts[0].x,this.pts[0].y);
      for(let i=1;i<this.pts.length-1;i++){
        const mx=(this.pts[i].x+this.pts[i+1].x)/2;
        const my=(this.pts[i].y+this.pts[i+1].y)/2;
        ctx.quadraticCurveTo(this.pts[i].x,this.pts[i].y,mx,my);
      }
      ctx.strokeStyle=`rgba(255,255,255,${a})`;
      ctx.lineWidth=.8;
      ctx.stroke();
    }
  }

  /* Soft blob for background warmth */
  class FBlob{
    constructor(){
      if(!W||!H){
        this.x=0;this.y=0;this.r=0;this.nx=0;this.ny=0;this.nz=0;this.s=0;
        return;
      }
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.r=100+Math.random()*180;
      this.nx=Math.random()*40;this.ny=Math.random()*40;this.nz=Math.random()*40;
      this.s=0.0003+Math.random()*0.0002;
    }
    tick(){
      this.nx+=this.s;this.ny+=this.s*.7;this.nz+=this.s*.5;
      this.x+=noise(this.nx,this.nz)*.4;
      this.y+=noise(this.ny,this.nz+30)*.4;
      if(this.x<-this.r)this.x=W+this.r;
      if(this.x>W+this.r)this.x=-this.r;
      if(this.y<-this.r)this.y=H+this.r;
      if(this.y>H+this.r)this.y=-this.r;
    }
    draw(){
      if(
        !Number.isFinite(this.x)||
        !Number.isFinite(this.y)||
        !Number.isFinite(this.r)||
        this.r<=0
      )return;
      const a=0.008+noise(this.nz*1.5,this.nz)*0.005;
      const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
      g.addColorStop(0,`rgba(255,255,255,${Math.max(0,a)})`);
      g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=g;ctx.fill();
    }
  }

  const lines=Array.from({length:22},()=>new FLine());
  const blobs=Array.from({length:3},()=>new FBlob());
  lines.forEach(l=>{l.life=Math.floor(Math.random()*l.max);});

  let last=0;
  function frame(ts){
    if(!running){raf=requestAnimationFrame(frame);return;}
    if(ts-last<33){raf=requestAnimationFrame(frame);return;}
    last=ts;
    if(!W||!H){raf=requestAnimationFrame(frame);return;}
    ctx.clearRect(0,0,W,H);
    blobs.forEach(b=>{b.tick();b.draw();});
    lines.forEach(l=>{l.tick();l.draw();});
    raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  document.addEventListener('visibilitychange',()=>{
    running=!document.hidden;
    if(!document.hidden)raf=requestAnimationFrame(frame);
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   JOURNEY VERTICAL LINE â€” grows downward
   as the section scrolls into view
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const rows=document.getElementById('jrn-rows');
  if(!rows)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        rows.classList.add('line-active');
        obs.unobserve(rows);
      }
    });
  },{threshold:0.08});
  obs.observe(rows);
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SKILLS LINE ANIMATION â€” each row's
   horizontal line shoots across leftâ†’right
   with a staggered delay per item
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const cols=document.querySelectorAll('.sk-col');
  if(!cols.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const col=e.target;
        const items=col.querySelectorAll('.sk-item');
        items.forEach((item,i)=>{
          const fill=item.querySelector('.sk-line-fill');
          if(!fill)return;
          setTimeout(()=>{fill.style.width='100%';},i*90);
        });
        obs.unobserve(col);
      }
    });
  },{threshold:0.2});
  cols.forEach(col=>obs.observe(col));
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MOUSE SPOTLIGHT â€” soft radial glow that
   follows cursor across the whole page
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const c=document.getElementById('spotlight');
  const ctx=c.getContext('2d');
  let W,H,mx=window.innerWidth/2,my=window.innerHeight/2;
  let tx=mx,ty=my,raf;
  if(prefersReducedMotion)return;

  function resize(){
    W=c.width=window.innerWidth;
    H=c.height=window.innerHeight;
  }
  resize();
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});

  function draw(){
    ctx.clearRect(0,0,W,H);
    // lerp toward mouse
    tx+=(mx-tx)*0.07;
    ty+=(my-ty)*0.07;

    // outer very soft glow
    const g1=ctx.createRadialGradient(tx,ty,0,tx,ty,480);
    g1.addColorStop(0,'rgba(255,255,255,0.028)');
    g1.addColorStop(0.4,'rgba(255,255,255,0.012)');
    g1.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g1;
    ctx.fillRect(0,0,W,H);

    // tighter inner bloom
    const g2=ctx.createRadialGradient(tx,ty,0,tx,ty,160);
    g2.addColorStop(0,'rgba(255,255,255,0.04)');
    g2.addColorStop(0.5,'rgba(255,255,255,0.01)');
    g2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g2;
    ctx.fillRect(0,0,W,H);

    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)cancelAnimationFrame(raf);
    else raf=requestAnimationFrame(draw);
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CURSOR GLOW TRAIL â€” soft orbs that fade
   behind the mouse as it moves
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const c=document.getElementById('trail-canvas');
  const ctx=c.getContext('2d');
  let W,H,raf;
  if(prefersReducedMotion)return;

  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',resize,{passive:true});

  const head={x:W/2,y:H/2,tx:W/2,ty:H/2,vx:0,vy:0};
  const trail=[];
  const MAX=22;
  let active=false,idleTimer;

  document.addEventListener('mousemove',e=>{
    head.tx=e.clientX;
    head.ty=e.clientY;
    active=true;
    clearTimeout(idleTimer);
    idleTimer=setTimeout(()=>{active=false;},90);
  },{passive:true});

  function addPoint(){
    const dx=head.tx-head.x;
    const dy=head.ty-head.y;
    head.vx=dx*0.16;
    head.vy=dy*0.16;
    head.x+=head.vx;
    head.y+=head.vy;

    const speed=Math.min(24,Math.hypot(dx,dy));
    trail.unshift({
      x:head.x,
      y:head.y,
      size:10+speed*0.9,
      alpha:0.22+Math.min(0.12,speed*0.008)
    });
    if(trail.length>MAX)trail.length=MAX;
  }

  function drawRibbon(){
    if(trail.length<2)return;

    for(let i=trail.length-1;i>=0;i--){
      const p=trail[i];
      p.alpha*=0.93;
      p.size*=0.987;
    }

    ctx.beginPath();
    ctx.moveTo(trail[0].x,trail[0].y);
    for(let i=1;i<trail.length-1;i++){
      const midX=(trail[i].x+trail[i+1].x)/2;
      const midY=(trail[i].y+trail[i+1].y)/2;
      ctx.quadraticCurveTo(trail[i].x,trail[i].y,midX,midY);
    }

    const glow=ctx.createLinearGradient(trail[0].x,trail[0].y,trail[trail.length-1].x,trail[trail.length-1].y);
    glow.addColorStop(0,'rgba(255,255,255,0.22)');
    glow.addColorStop(0.35,'rgba(255,255,255,0.1)');
    glow.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=glow;
    ctx.lineWidth=2.2;
    ctx.lineCap='round';
    ctx.lineJoin='round';
    ctx.stroke();

    for(let i=0;i<trail.length;i++){
      const p=trail[i];
      const fade=(1-i/trail.length);
      const r=p.size*fade;
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      g.addColorStop(0,`rgba(255,255,255,${p.alpha*fade})`);
      g.addColorStop(0.45,`rgba(255,255,255,${p.alpha*0.28*fade})`);
      g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(p.x,p.y,r,0,Math.PI*2);
      ctx.fillStyle=g;
      ctx.fill();
    }

    for(let i=trail.length-1;i>=0;i--){
      if(trail[i].alpha<0.01||trail[i].size<1.4)trail.splice(i,1);
    }
  }

  function frame(){
    ctx.clearRect(0,0,W,H);

    const dist=Math.abs(head.tx-head.x)+Math.abs(head.ty-head.y);
    if(active||dist>0.35||trail.length){
      addPoint();
      drawRibbon();
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)cancelAnimationFrame(raf);
    else raf=requestAnimationFrame(frame);
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SECTION GLOW LINES + HEADING SHIMMER
   â€” triggers as sections scroll into view
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  // Section in-view for top glow line
  const secObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in-view');
    });
  },{threshold:0.05});
  document.querySelectorAll('section').forEach(s=>secObs.observe(s));

  // Heading shimmer â€” fires once when title enters view
  const titleObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el=e.target;
        // slight delay so reveal animation finishes first
        setTimeout(()=>{
          el.classList.add('shimmer-go');
          // reset after animation so it can re-trigger on revisit
          setTimeout(()=>el.classList.remove('shimmer-go'),1800);
        },400);
      }
    });
  },{threshold:0.5});
  document.querySelectorAll('.s-title').forEach(t=>titleObs.observe(t));
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAGNETIC BUTTONS â€” subtle pull toward cursor
   on nav links and project arrows
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const isMob=window.innerWidth<640;
  if(isMob)return; // skip on mobile
  document.querySelectorAll('.proj-arrow,.nav-btn-wrap a,.f-btn').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const cx=r.left+r.width/2,cy=r.top+r.height/2;
      const dx=e.clientX-cx,dy=e.clientY-cy;
      el.style.transform=`translate(${dx*0.22}px,${dy*0.22}px)`;
    });
    el.addEventListener('mouseleave',()=>{
      el.style.transform='';
    });
  });

  // proj-arrows specifically
  document.querySelectorAll('.proj-arrow').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const cx=r.left+r.width/2,cy=r.top+r.height/2;
      const dx=e.clientX-cx,dy=e.clientY-cy;
      el.style.transform=`rotate(0deg) translate(${dx*0.3}px,${dy*0.3}px)`;
    });
    el.addEventListener('mouseleave',()=>{
      el.style.transform='rotate(-45deg)';
    });
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   HERO H1 GLOW â€” each word lights up
   slightly on scroll for the parallax feel
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function(){
  const h1=document.querySelector('.hero-h1');
  if(!h1)return;
  window.addEventListener('scroll',()=>{
    const p=Math.min(1,window.scrollY/window.innerHeight);
    // as we scroll, hero text fades and glows white briefly
    if(p<0.6){
      h1.style.textShadow=`0 0 ${60*p}px rgba(255,255,255,${0.12*p})`;
    } else {
      h1.style.textShadow='';
    }
  },{passive:true});
})();

