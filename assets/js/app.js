/* Wayne's Plant Hire World: shared behaviour for every page */
(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const G=window.gsap, ST=window.ScrollTrigger;
const plain=/[?&]plain/.test(location.search);   /* ?plain = layout-only QA view, no motion */
const ANIM=!!(G&&ST&&!rm&&!plain);
const F=window.FLEET||[], byId=Object.fromEntries(F.map(f=>[f.id,f]));
const WA='27832970639', MAIL='zee@waynesplanthireworld.co.za';
const page=document.body.dataset.page, qs=new URLSearchParams(location.search);
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(_){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(_){}}};

/* ---------- quote list, shared across pages ---------- */
const KEY='wph.quote';
let chosen=new Set(store.get(KEY,[]).filter(i=>byId[i]));
const subs=[];
let tt;
function toast(html){const t=$('#toast');if(!t)return;t.innerHTML=html;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),3200);}
function paint(){
  $$('[data-add]').forEach(b=>{
    const on=chosen.has(b.dataset.add),f=byId[b.dataset.add];
    b.setAttribute('aria-pressed',on);
    if(b.dataset.on)b.textContent=on?b.dataset.on:b.dataset.off;
    else if(b.classList.contains('tog'))b.textContent=on?'Added':'Add';
    if(b.classList.contains('tog')&&f)b.setAttribute('aria-label',(on?'Remove ':'Add ')+f.n+(on?' from quote':' to quote'));
  });
  $$('[data-qc]').forEach(q=>{q.textContent=chosen.size;q.hidden=!chosen.size;});
  subs.forEach(fn=>fn());
}
function toggle(id,quiet){
  const on=!chosen.has(id);on?chosen.add(id):chosen.delete(id);
  store.set(KEY,[...chosen]);paint();
  if(!quiet&&byId[id])toast(on?`${byId[id].n} added. <a href="/quote/">View quote</a>`:`${byId[id].n} removed.`);
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b){e.preventDefault();e.stopPropagation();toggle(b.dataset.add,page==='quote');}});
addEventListener('storage',e=>{if(e.key===KEY){chosen=new Set(store.get(KEY,[]));paint();}});
paint();
const lead=method=>{(window.dataLayer=window.dataLayer||[]).push({event:'generate_lead',method});if(window.fbq)try{fbq('track','Lead')}catch(_){}};

/* ---------- nav + menu ---------- */
const nav=$('#nav');
const onS=()=>nav.classList.toggle('solid',scrollY>40);
addEventListener('scroll',onS,{passive:true});onS();
const burger=$('#burger'),menu=$('#menu');
const setMenu=o=>{menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.documentElement.style.overflow=o?'hidden':'';};
burger.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false);});
addEventListener('resize',()=>{if(innerWidth>1100)setMenu(false);});

/* ---------- live yard status (South African time) ---------- */
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function yardNow(){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Johannesburg',weekday:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  const d=DAYS.indexOf(p.weekday),m=+p.hour*60+ +p.minute,wk=d>=1&&d<=5;
  const open=wk&&m>=450&&m<1020;
  let short,long;
  if(open){const left=1020-m,h=Math.floor(left/60),mn=left%60;short='Yard open now, closes 17:00';long=`The yard is open. Closes at 17:00, in ${h?h+' h ':''}${mn} min.`;}
  else{
    const when=wk&&m<450?'today':(d>=1&&d<=4?'tomorrow':'Monday');
    short=`Yard closed, opens ${when} 07:30`;long=`The yard is closed. Opens ${when} at 07:30. WhatsApp is answered 24 hours.`;
  }
  $$('[data-yard]').forEach(el=>{el.classList.toggle('open',open);el.lastElementChild.textContent='dataLong' in el.dataset||el.hasAttribute('data-long')?long:short;});
}
yardNow();setInterval(yardNow,30000);

/* ---------- delivery distance ---------- */
const town=$('#town'),dout=$('#dist-out');
if(town){
  const show=()=>{const k=+town.value;dout.textContent=k===0?'In town':`About ${k} km`;$('#dist-note').textContent=k===0?'Our yard is in Randfontein, so your site is on our doorstep.':'from our yard in Randfontein. Delivery on our own lowbeds and tippers.';
    if(ANIM)G.fromTo(dout,{y:16,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'});};
  town.addEventListener('change',show);
}

/* ---------- nav sits light-on-dark over a dark top section until you scroll past it ---------- */
const darkTop=$('[data-dark-top]');
if(darkTop){const onD=()=>nav.classList.toggle('ondark',scrollY<darkTop.offsetHeight-70);addEventListener('scroll',onD,{passive:true});onD();}

/* ---------- home hero: machine switcher ---------- */
const hx=$('#hx');
if(hx){
  const ms=$$('.mach',hx),bs=$$('.pick button',hx),cap=$('#hxcap'),data=JSON.parse($('#hm-data').textContent);
  let cur=0,timer,hold=false;
  const next=()=>{clearTimeout(timer);if(!rm&&!hold)timer=setTimeout(()=>{if(document.hidden){next();return;}go((cur+1)%ms.length);},6500);};
  const go=i=>{
    if(i===cur){next();return;}
    const prev=ms[cur];prev.classList.remove('on');prev.classList.add('out');setTimeout(()=>prev.classList.remove('out'),1100);
    cur=i;ms[i].classList.add('on');
    bs.forEach((b,k)=>b.setAttribute('aria-pressed',k===i));cap.textContent=data[i].cap;cap.href=data[i].href;next();
  };
  bs.forEach((b,i)=>b.addEventListener('click',()=>go(i)));
  const pk=$('.pick',hx);
  pk.addEventListener('mouseenter',()=>{hold=true;hx.classList.add('paused');clearTimeout(timer);});
  pk.addEventListener('mouseleave',()=>{hold=false;hx.classList.remove('paused');next();});
  next();
}

/* ---------- background videos: play only while on screen; poster only for reduced motion or data saver ---------- */
const saveData=navigator.connection&&navigator.connection.saveData;
const vids=$$('video[data-autoplay]');
if(vids.length&&!rm&&!saveData&&'IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){v.play().catch(()=>{});}else v.pause();}),{threshold:.15});
  vids.forEach(v=>io.observe(v));
}

/* ---------- why list ---------- */
const wb=$$('[data-why]'),wi=$$('.why .fig img');
if(wb.length){
  const set=i=>{wb.forEach((b,j)=>b.setAttribute('aria-current',i===j));wi.forEach((m,j)=>m.classList.toggle('on',i===j));};
  wb.forEach((b,i)=>['mouseenter','focus','click'].forEach(ev=>b.addEventListener(ev,()=>set(i))));
}

/* ---------- register: photo peek on hover (desktop) ---------- */
const peek=$('#peek');
if(peek&&fine){
  const pim=$('img',peek);let on=false,x=0,y=0,cx=0,cy=0;
  const loop=()=>{cx+=(x-cx)*.18;cy+=(y-cy)*.18;peek.style.left=cx+'px';peek.style.top=cy+'px';if(on)requestAnimationFrame(loop);};
  document.addEventListener('pointerover',e=>{
    const r=e.target.closest('.reg:not(.grid) .rrow');
    if(r&&innerWidth>1100){
      if(pim.getAttribute('src')!==r.dataset.img)pim.src=r.dataset.img;
      if(!on){on=true;cx=x;cy=y;requestAnimationFrame(loop);}
      peek.classList.add('on');
    }else if(!e.target.closest('.reg')){on=false;peek.classList.remove('on');}
  });
  document.addEventListener('pointermove',e=>{x=e.clientX+28;y=e.clientY-130;if(x+360>innerWidth)x=e.clientX-368;});
  document.addEventListener('pointerout',e=>{if(e.target.closest('.reg')&&!e.relatedTarget?.closest?.('.reg .rrow')){on=false;peek.classList.remove('on');}});
}

/* ---------- home finder: a machine goes straight to its page, otherwise to the filtered list; the date rides along to the quote ---------- */
const finder=$('#finder');
if(finder)finder.addEventListener('submit',e=>{
  e.preventDefault();
  const m=$('#fm').value,g=$('#fg').value,d=$('#fd').value;
  if(d)store.set('wph.date',d);
  location.href=m&&byId[m]?byId[m].url:'/equipment/'+(g?'?g='+encodeURIComponent(g):'');
});
if(page==='equipment'){
  const m=qs.get('m');if(m&&byId[m]){location.replace(byId[m].url);}
  if(qs.get('date'))store.set('wph.date',qs.get('date'));
}

/* ---------- filters (equipment + quote) ---------- */
const chips=$('#chips'),q=$('#q');
if(chips&&q){
  const items=$$('#reg>li, #picks>li'),count=$('#count'),empty=$('#empty');
  let cat='All',term='';
  const run=()=>{
    let n=0;
    items.forEach(el=>{const ok=(cat==='All'||el.dataset.cat===cat||el.dataset.par===cat)&&(!term||el.dataset.name.includes(term));el.hidden=!ok;if(ok)n++;});
    if(count)count.textContent=cat==='All'&&!term?`Showing all ${n} machines`:`Showing ${n} ${n===1?'machine':'machines'}${cat==='All'?'':': '+cat}`;
    if(empty)empty.hidden=n>0;
    if(ANIM)ST.refresh();
  };
  chips.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;cat=b.dataset.cat;$$('.chip',chips).forEach(c=>c.setAttribute('aria-pressed',c===b));run();});
  q.addEventListener('input',()=>{term=q.value.trim().toLowerCase();run();});
  const c0=qs.get('g')||qs.get('cat');if(c0){const b=$$('.chip',chips).find(x=>x.dataset.cat===c0);if(b)b.click();}
}

/* ---------- sort ---------- */
const sortSel=$('#sort');
if(sortSel){
  const list=$('#reg');
  sortSel.addEventListener('change',()=>{
    const k=sortSel.value,lis=$$(':scope>li',list);
    lis.sort((a,b)=>k==='n'?a.querySelector('.nm').textContent.localeCompare(b.querySelector('.nm').textContent):k==='i'?a.dataset.i-b.dataset.i:b.dataset[k]-a.dataset[k]);
    lis.forEach(l=>list.appendChild(l));
    if(ANIM){G.fromTo(lis.filter(l=>!l.hidden).slice(0,8),{y:18,opacity:0},{y:0,opacity:1,duration:.45,stagger:.03,ease:'power3.out',overwrite:true});ST.refresh();}
  });
}

/* ---------- list / photo view ---------- */
const views=$$('[data-view]'),reg=$('#reg');
if(views.length&&reg){
  const setV=v=>{reg.classList.toggle('grid',v==='grid');views.forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===v));store.set('wph.view',v);if(ANIM)ST.refresh();};
  views.forEach(b=>b.addEventListener('click',()=>setV(b.dataset.view)));
  setV(store.get('wph.view','list'));
}

/* ---------- quote page ---------- */
if(page==='quote'){
  if(byId[qs.get('add')]&&!chosen.has(qs.get('add')))toggle(qs.get('add'),true);
  const box=$('#sel-box'),note=$('#q-note'),g=id=>$(id).value.trim();
  const msg=()=>{
    const ms=F.filter(f=>chosen.has(f.id)).map(f=>`${f.n} (${f.no})`).join(', ')||'(not sure yet, please advise)';
    return `Hi Wayne's, I'd like a quote.\nMachines: ${ms}\nStart date: ${g('#f-date')||'flexible'}\nSite: ${g('#f-site')||'-'}\nName: ${g('#f-name')||'-'}\nPhone: ${g('#f-phone')||'-'}\nNotes: ${g('#f-note')||'-'}`;
  };
  const mail=()=>{$('#send-mail').href='mailto:'+MAIL+'?subject='+encodeURIComponent('Plant hire quote request')+'&body='+encodeURIComponent(msg());};
  const render=()=>{
    box.innerHTML='';
    const sel=F.filter(f=>chosen.has(f.id));
    if(!sel.length)box.innerHTML='<span class="none">None yet. Add machines from the list.</span>';
    sel.forEach(f=>{const s=document.createElement('span');s.className='tag';s.setAttribute('role','listitem');s.append(f.n);
      const x=document.createElement('button');x.type='button';x.setAttribute('aria-label','Remove '+f.n);x.textContent='×';x.onclick=()=>toggle(f.id,true);s.appendChild(x);box.appendChild(s);});
    mail();
  };
  subs.push(render);render();
  const d0=store.get('wph.date','');if(d0&&!$('#f-date').value)$('#f-date').value=d0;
  ['#f-date','#f-site','#f-name','#f-phone','#f-note'].forEach(s=>$(s).addEventListener('input',mail));
  $('#qf').addEventListener('submit',e=>{
    e.preventDefault();
    if(!g('#f-phone')){note.textContent='Add a phone number so we can reply.';$('#f-phone').focus();return;}
    lead('whatsapp_quote');window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg()),'_blank','noopener');
  });
}

/* ---------- contact page ---------- */
if(page==='contact'){
  const g=id=>$(id).value.trim();
  const msg=()=>`Hi Wayne's, ${g('#c-sub')||'I have an enquiry'}.\n${g('#c-msg')}\nName: ${g('#c-name')||'-'}\nPhone: ${g('#c-phone')||'-'}\nEmail: ${g('#c-mail')||'-'}`;
  const mail=()=>{$('#c-mailto').href='mailto:'+MAIL+'?subject='+encodeURIComponent(g('#c-sub')||'Website enquiry')+'&body='+encodeURIComponent(msg());};
  ['#c-name','#c-mail','#c-phone','#c-sub','#c-msg'].forEach(s=>$(s).addEventListener('input',mail));
  $('#cf').addEventListener('submit',e=>{
    e.preventDefault();
    if(!g('#c-name')||(!g('#c-phone')&&!g('#c-mail'))){$('#c-note').textContent='Add your name and a phone number or email so we can reply.';$('#c-name').focus();return;}
    lead('whatsapp_contact');window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg()),'_blank','noopener');
  });
}

/* ---------- motion ---------- */
if(!ANIM)return;
G.registerPlugin(ST);
document.documentElement.classList.add('anim');

if(window.Lenis&&fine){
  const lenis=new Lenis({duration:1.1,smoothWheel:true});
  lenis.on('scroll',ST.update);G.ticker.add(t=>lenis.raf(t*1000));G.ticker.lagSmoothing(0);
}

/* page entrance: title lines rise, then supporting copy */
const intro=G.timeline({defaults:{ease:'power4.out'}})
  .to('.hl>span',{y:0,duration:.9,stagger:.09})
  .to('[data-fade]',{opacity:1,duration:.8,stagger:.08},'-=.55');
/* failsafe: never leave the title hidden if frames are throttled */
setTimeout(()=>{if(intro.progress()<1)intro.progress(1);},2500);
/* if animation frames barely run (very slow device), drop the hidden states entirely */
setTimeout(()=>{if(G.ticker.time<1){document.documentElement.classList.remove('anim');G.set('.rv,.w>span,[data-fade],.hl>span,.cards li,.hx-stats li,.hx-m,.hx-bg',{clearProps:'all'});}},3000);

/* split section headings into masked words */
$$('[data-split]').forEach(el=>{
  const t=el.textContent.trim();el.setAttribute('aria-label',t);
  el.innerHTML=t.split(/\s+/).map(w=>`<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' ');
  ST.create({trigger:el,start:'top 88%',once:true,onEnter:()=>G.to($$('.w>span',el),{y:0,duration:1,ease:'power4.out',stagger:.06})});
});

/* reveals */
ST.batch('.rv',{start:'top 94%',once:true,onEnter:b=>G.to(b,{opacity:1,y:0,duration:1,ease:'power3.out',stagger:.08})});
$$('.cards').forEach(r=>G.from($$('li',r),{y:36,opacity:0,duration:.8,ease:'power3.out',stagger:.05,scrollTrigger:{trigger:r,start:'top 88%',once:true}}));

/* hero: machine drives in, stats rise; on scroll the machine pushes forward and the title lifts away */
if(hx){
  intro.from('.hx-m',{x:160,opacity:0,duration:1.4,ease:'power3.out'},.15)
       .from('.hx-bg',{scale:1.18,duration:2,ease:'power2.out'},0)
       .to('.hx-stats li',{opacity:1,y:0,duration:.7,stagger:.08},'-=1');
  if(innerWidth>900){
    const st={trigger:hx,start:'top top',end:'bottom top',scrub:true};
    G.to('.hx-m',{yPercent:10,scale:1.08,ease:'none',scrollTrigger:st});
    G.to('.hx-t',{yPercent:-45,ease:'none',scrollTrigger:st});
    G.to('.hx-bg',{yPercent:16,ease:'none',scrollTrigger:st});
    if(fine){
      const mx=G.quickTo('.hx-m','x',{duration:1,ease:'power3.out'}),bx=G.quickTo('.hx-bg','x',{duration:1.2,ease:'power3.out'});
      hx.addEventListener('pointermove',e=>{const k=e.clientX/innerWidth-.5;mx(k*-26);bx(k*16);});
    }
  }
}

/* parallax on framed photos */
$$('[data-par]').forEach(im=>G.fromTo(im,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:im.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));

/* machine sheet: photo settles in, spec numbers count up */
const pic=$('.sheet .pic img');
if(pic)G.from(pic,{scale:1.12,duration:1.6,ease:'power3.out'});
$$('.specs b').forEach(b=>{
  const raw=b.textContent,end=parseFloat(raw.replace(/,/g,'')),dec=(raw.split('.')[1]||'').length,o={v:0};
  if(isNaN(end))return;
  const fmt=v=>v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  b.textContent=fmt(0);
  G.to(o,{v:end,duration:1.6,delay:.3,ease:'power2.out',onUpdate:()=>{b.textContent=fmt(o.v)},onComplete:()=>{b.textContent=raw}});
});

/* footer wordmark rises */
G.from('footer .mark',{yPercent:40,ease:'none',scrollTrigger:{trigger:'footer',start:'top bottom',end:'bottom bottom',scrub:true}});

/* progress */
G.to('#prog',{scaleX:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:.2}});
addEventListener('load',()=>ST.refresh());
})();
