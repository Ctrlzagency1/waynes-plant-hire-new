// Static site generator for Wayne's Plant Hire World ("the fleet register").  Run: node build/build.mjs
import {mkdirSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {FLEET,CATS,GROUPS,slug} from './fleet.mjs';

const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..');
const SITE='https://waynesplanthireworld.co.za';
const V=Date.now().toString(36); /* cache-buster for CSS, JS and hero images on each build */
const WA='27832970639';
const MAIL='zee@waynesplanthireworld.co.za';
const HELLO='Hello, I am interested in your plant equipment hire services.';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const out=(p,html)=>{const f=join(ROOT,p);mkdirSync(dirname(f),{recursive:true});writeFileSync(f,html);};
const url=f=>`/equipment/${slug(f)}/`;
const no=f=>'WPH-'+String(FLEET.indexOf(f)+1).padStart(2,'0');
const byId=Object.fromEntries(FLEET.map(f=>[f.id,f]));
const part=v=>{if(!v)return null;const m=v.replace(/\s*\(.*?\)/,'').match(/^([\d.,]+)\s*(.*)$/);return m?{b:m[1],u:m[2]}:{b:v,u:''};};
/* image refs: a bare name is /img/<name>.jpg; anything with an extension (e.g. site/x.webp) is used as given */
const src=n=>/\./.test(n)?'/img/'+n:'/img/'+n+'.jpg';
const AR='<span class="ar" aria-hidden="true">→</span>';
const wa=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

/* Delivery distances from the yard (46 Steyr Street). Approximate road km, to confirm with Wayne. */
const TOWNS=[['Randfontein',0],['Toekomsrus',6],['Mohlakeng',7],['Azaadville',13],['Krugersdorp',16],['Kagiso',18],['Westonaria',20],['Bekkersdal',23],['Roodepoort',30],['Muldersdrift',32],['Soweto',38],['Magaliesburg',45],['Johannesburg CBD',45],['Lanseria',48],['Carletonville',50],['Fochville',62]];

/* ---------- shared pieces ---------- */
const head=({title,desc,path,img='/img/komatsu-d85a-dozer.jpg',ld=''})=>`<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Wayne's Plant Hire World">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}${img}">
<meta name="theme-color" content="#EEF3FB">
<link rel="icon" href="/img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<!--
  TRACKING (disabled in this concept so demo visits don't pollute the client's analytics).
  Re-enable on launch. IDs from the live site:
  GTM GTM-MBTGFM3W | GA4 G-9SSDZRN18E | Google Ads AW-18143384715 | Meta Pixel 828652826523731 | Clarity wsz13hzbuz
  Quote and contact forms push dataLayer event "generate_lead" and fire fbq('track','Lead') when present.
-->
<link rel="stylesheet" href="/assets/css/wph.css?v=${V}">
${ld}
</head>`;

const NAV=[['/','Home'],['/equipment/','Equipment'],['/about/','About'],['/contact/','Contact']];
const header=(page,path)=>`<body data-page="${page}">
<div class="prog" id="prog" aria-hidden="true"></div>
<div class="site-h" id="siteh">
<div class="topbar">
  <span>Need help? Talk to the yard: <a href="tel:+27832970639">083 297 0639</a> · <a href="mailto:${MAIL}">${MAIL}</a></span>
  <span class="yard" data-yard><i></i><span>Mon to Fri, 07:30 to 17:00</span></span>
</div>
<header class="nav" id="nav">
  <a class="brand" href="/" aria-label="Wayne's Plant Hire World, home"><img src="/img/logo.png" alt="" width="48" height="48"><span>Wayne's<em> Plant Hire</em><small>Randfontein, West Rand</small></span></a>
  <nav aria-label="Main"><ul>
    ${NAV.map(([h,l])=>`<li><a href="${h}"${path===h?' aria-current="page"':''}>${l}</a></li>`).join('\n    ')}
  </ul></nav>
  <a class="tel" href="tel:+27832970639">083 297 0639</a>
  <a class="btn" href="/quote/">Get a quote<span class="qc" data-qc hidden>0</span></a>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span><span></span><span></span></button>
</header>
</div>
<div class="menu" id="menu">
  <nav aria-label="Mobile">
    ${NAV.map(([h,l],i)=>`<a href="${h}"${path===h?' aria-current="page"':''}><span class="mn-i">${String(i+1).padStart(2,'0')}</span>${l}</a>`).join('\n    ')}
  </nav>
  <a class="mn-cta" href="/quote/">Get a quote${AR}</a>
  <div class="mf">
    <span class="yard" data-yard><i></i><span>Mon to Fri, 07:30 to 17:00</span></span>
    <div class="mf-row"><a href="tel:+27832970639">083 297 0639</a><a href="tel:+27832663871">083 266 3871</a></div>
    <a class="mf-wa" href="${wa(HELLO)}">WhatsApp us${AR}</a>
  </div>
</div>
<main id="top">`;

const footer=()=>`</main>
<footer>
  <div class="top">
    <div class="fb">
      <img src="/img/logo.png" alt="" width="72" height="72" loading="lazy">
      <p>A one-stop plant equipment hire business offering professional, reliable, well-maintained machinery for construction needs.</p>
      <span class="yard" data-yard><i></i><span>Mon to Fri, 07:30 to 17:00</span></span>
    </div>
    <div class="col c1">
      <h3>Explore</h3>
      <a href="/equipment/">Equipment</a>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
      <a href="/quote/">Get a quote</a>
      <a href="/privacy-policy/">Privacy policy</a>
    </div>
    <div class="col c2">
      <h3>The yard</h3>
      <a href="tel:+27832970639">+27 83 297 0639</a>
      <a href="tel:+27832663871">+27 83 266 3871</a>
      <a href="mailto:${MAIL}">${MAIL}</a>
      <span>46 Steyr Street, Randfontein, Gauteng.<br>Mon to Fri, 07:30 to 17:00. WhatsApp and email answered 24 hours.</span>
    </div>
  </div>
  <div class="legal"><span>© 2026 Wayne's Plant Hire World. All rights reserved.</span><span>Home page machine photography: Unsplash (user, Troy Mortier).</span><span>Reliability in every move.</span></div>
  <div class="mark" aria-hidden="true">WAYNE'S</div>
</footer>
<a class="wa" href="${wa(HELLO)}" aria-label="WhatsApp Wayne's Plant Hire"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.8 2 6.8L3 29l6.6-1.9c1.9 1 4 1.6 6.3 1.6 7.2 0 13-5.8 13-12.9S23.2 3 16 3zm0 23.6c-2 0-3.9-.6-5.5-1.6l-.4-.2-3.9 1.1 1.1-3.8-.3-.4c-1.2-1.7-1.8-3.6-1.8-5.7C5.2 9.9 10 5.2 16 5.2s10.8 4.7 10.8 10.6S22 26.6 16 26.6zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.9-.9-3.2-1.7-4.4-3.8-.3-.6.3-.5.9-1.6.1-.2.1-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7 2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5 0-.2-.3-.3-.6-.4z"/></svg></a>
<nav class="mbar" aria-label="Quick actions">
  <a href="tel:+27832970639"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>Call</a>
  <a class="w" href="${wa(HELLO)}"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.8 2 6.8L3 29l6.6-1.9c1.9 1 4 1.6 6.3 1.6 7.2 0 13-5.8 13-12.9S23.2 3 16 3zm5.9 15.7c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.9-.9-3.2-1.7-4.4-3.8-.3-.6.3-.5.9-1.6.1-.2.1-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7 2 .8 2.8.9 3.8.7.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5 0-.2-.3-.3-.6-.4z"/></svg>WhatsApp</a>
  <a class="q" href="/quote/">Quote<span class="qc" data-qc hidden>0</span></a>
</nav>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="peek" id="peek" aria-hidden="true"><img alt=""></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="/assets/js/fleet.js?v=${V}"></script>
<script src="/assets/js/app.js?v=${V}"></script>
</body>
</html>
`;

const crumb=list=>`<nav class="crumb" aria-label="Breadcrumb"><ol>${list.map(([h,l],i)=>i<list.length-1?`<li><a href="${h}">${esc(l)}</a></li>`:`<li aria-current="page">${esc(l)}</li>`).join('')}</ol></nav>`;
const pageHead=({h1,lead,img,pos='50% 50%',crumbs})=>img?`<section class="ph-head dark" aria-labelledby="h1" data-dark-top>
  <div class="ph-bg" aria-hidden="true"><img class="ph" src="${img}" alt="" style="object-position:${pos}" fetchpriority="high" data-par></div>
  <h1 id="h1">${h1.map(l=>`<span class="hl"><span>${esc(l)}</span></span>`).join('')}</h1>
  <div class="row"><p data-fade>${esc(lead)}</p>${crumb(crumbs)}</div>
</section>`:`<section class="ph-head" aria-labelledby="h1">
  <h1 id="h1">${h1.map(l=>`<span class="hl"><span>${esc(l)}</span></span>`).join('')}</h1>
  <div class="row"><p data-fade>${esc(lead)}</p>${crumb(crumbs)}</div>
</section>`;

const specs=f=>[part(f.hp),part(f.w)].map(p=>p?`<span class="sp num">${p.b}<small>${esc(p.u.split(' ')[0])}</small></span>`:'<span class="sp" aria-hidden="true"></span>').join('');
const num=v=>{const p=part(v);return p?parseFloat(p.b.replace(/,/g,''))||0:0;};
const SPECS=[['Power','hp'],['Weight','w'],['Speed','s']];
const gUrl=g=>`/equipment/?g=${encodeURIComponent(g.n)}`;
const tree=()=>`<div class="tree" id="chips" role="group" aria-label="Filter by type">
  <button class="chip" type="button" data-cat="All" aria-pressed="true">All equipment <i>${FLEET.length}</i></button>
  ${CATS.map(c=>{const gs=GROUPS.filter(g=>g.p===c.n);return `<button class="chip par" type="button" data-cat="${c.n}" aria-pressed="false">${c.n} <i>${FLEET.filter(f=>f.c===c.n).length}</i></button>${gs.length>1?gs.map(g=>`<button class="chip sub" type="button" data-cat="${esc(g.n)}" aria-pressed="false">${esc(g.n)} <i>${g.ids.length}</i></button>`).join(''):''}`;}).join('\n  ')}
</div>`;
const machineOptions=()=>GROUPS.map(g=>`<optgroup label="${esc(g.n)}">${g.ids.map(id=>`<option value="${id}">${esc(byId[id].n)}</option>`).join('')}</optgroup>`).join('');
const row=f=>`<li class="mc" data-i="${FLEET.indexOf(f)}" data-hp="${num(f.hp)}" data-w="${num(f.w)}" data-cat="${esc(f.g)}" data-par="${f.c}" data-name="${esc((f.n+' '+f.t+' '+f.g+' '+f.c+' '+no(f)).toLowerCase())}">
  <div class="mc-fig"><a class="mc-img" href="${url(f)}" tabindex="-1" aria-hidden="true"><img class="ph" src="${src(f.img)}" alt="" loading="lazy" style="object-position:${f.pos}"></a><button class="mc-cat" type="button" data-filter="${esc(f.g)}">${esc(f.g)}</button></div>
  <div class="mc-b">
    <h3 class="nm"><a href="${url(f)}">${esc(f.n)}</a></h3>
    <p class="mc-t">${esc(f.t)} · ${no(f)}</p>
    <dl class="mc-s">${SPECS.map(([l,k])=>{const p=part(f[k]);return `<div><dt>${l}</dt><dd class="num">${p?`${p.b}<small>${esc(p.u.split(' ')[0])}</small>`:'–'}</dd></div>`;}).join('')}</dl>
    <div class="mc-a"><a class="btn" href="${url(f)}">View details</a><button class="tog add" type="button" data-add="${f.id}" data-on="Added ✓" data-off="+ Quote" aria-pressed="false" aria-label="Add ${esc(f.n)} to quote">+ Quote</button></div>
  </div>
</li>`;

const cta=({h,p})=>`<section class="cta" aria-labelledby="cta-h">
  <h2 id="cta-h" data-split>${esc(h)}</h2>
  <div class="bar">
    <p>${esc(p)}</p>
    <div class="row"><a class="btn" href="/quote/">Get a quote${AR}</a><a class="btn ghost" href="tel:+27832970639">Call 083 297 0639</a></div>
  </div>
</section>`;

const REASONS=[
 {h:'Well-maintained, reliable machinery',p:'Regular, rigorous maintenance for maximum uptime.',img:'site/d85a-sky.webp',pos:'50% 40%'},
 {h:'Experienced and certified operators',p:'Machines come with skilled, experienced operators: Dawid on the D85A, Tsebo on the CAT 422E, Norman on the Ace Phantom.',img:'site/ace-operator.webp',pos:'55% 50%'},
 {h:'Competitive daily and monthly rates',p:'Flexible rental terms, available for a day or a year.',img:'site/tlb-front.webp',pos:'50% 60%'},
 {h:'Rapid delivery across the West Rand',p:'Delivery to Randfontein and the West Rand using our own lowbeds and tippers.',img:'site/d85a-lowbed-tall.webp',pos:'50% 60%'},
 {h:'24/7 breakdown support and service',p:'Downtime on a construction project is lost money, so when something stops, we pick up the phone.',img:'site/crane-container-2.webp',pos:'55% 50%'}
];
const why=(title)=>`<section class="sec" aria-labelledby="why-h">
  <div class="shead"><h2 id="why-h" class="h2" data-split>${esc(title)}</h2><p class="mute rv">Five things contractors on the West Rand tell us they need from a hire yard.</p></div>
  <div class="why">
    <div class="fig" aria-hidden="true">${REASONS.map((r,i)=>`<img class="ph${i?'':' on'}" src="${src(r.img)}" alt="" loading="lazy" style="object-position:${r.pos}">`).join('')}</div>
    <ol>${REASONS.map((r,i)=>`<li class="rv"><h3><button type="button" data-why="${i}" aria-current="${i===0}">${esc(r.h)}</button></h3><p>${esc(r.p)}</p></li>`).join('')}</ol>
  </div>
</section>`;

const mosaic=(title,imgs)=>`<section class="sec" aria-labelledby="mo-h" style="padding-top:0">
  <div class="shead"><h2 id="mo-h" class="h2" data-split>${esc(title)}</h2><p class="mute rv">Our own machines, on our own trucks, on West Rand sites.</p></div>
  <div class="mosaic">${imgs.map(([n,cls,c,pos,fid])=>`<figure class="${cls} rv"><img class="ph" src="${src(n)}" alt="${esc(c)}" loading="lazy" style="object-position:${pos||'50% 50%'}"><figcaption class="cap">${fid?`<b>${no(byId[fid])}</b>`:''}${esc(c)}</figcaption></figure>`).join('')}</div>
</section>`;

const ldBusiness=`<script type="application/ld+json">${JSON.stringify({
 '@context':'https://schema.org','@type':'LocalBusiness',name:"Wayne's Plant Hire World",url:SITE,telephone:'+27832970639',email:MAIL,image:SITE+'/img/komatsu-d85a-dozer.jpg',
 description:'Plant equipment hire in Randfontein: excavators, dozers, TLBs, tippers and lowbeds, delivered across the West Rand with an experienced operator.',
 address:{'@type':'PostalAddress',streetAddress:'46 Steyr Street',addressLocality:'Randfontein',addressRegion:'Gauteng',addressCountry:'ZA'},
 areaServed:'Randfontein and the West Rand',openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens:'07:30',closes:'17:00'}]
})}</script>`;

const FAQ=[
 ['Do your machines come with an operator?','Yes. Our machines come with skilled, experienced operators, so you hire the machine and the person who knows it.'],
 ['Where do you deliver?','From our yard at 46 Steyr Street, Randfontein, to sites across Randfontein and the surrounding West Rand, on our own lowbeds and tippers.'],
 ['How long can I hire for?','Rental terms are flexible: a day, a month or a year. Tell us the job and we will work out the best rate.'],
 ['What happens if a machine breaks down?','We offer 24/7 breakdown support and service. Downtime costs you money, so we pick up the phone.'],
 ['How do I get a rate?','Add the machines you need to a quote, tell us the site and start date, and send it on WhatsApp or email. We reply with availability and a rate.'],
 ['When are you open?','Monday to Friday, 07:30 to 17:00. WhatsApp and email enquiries are answered 24 hours.']
];
const ldFaq=`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:FAQ.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))})}</script>`;

const pages=[];
const add=(path,html)=>{pages.push(path);out(path.endsWith('/')?path+'index.html':path,html);};

/* ---------- HOME: search first, then browse by type (structure after yellowlista.co.za) ---------- */
{
const BENEFITS=[
 ['Operator included','Every machine comes with a skilled, experienced operator.'],
 ['Delivered on our own trucks','Our lowbeds and tippers deliver across Randfontein and the West Rand.'],
 ['A day, a week or a month','Flexible rental terms and competitive daily and monthly rates.'],
 ['24/7 breakdown support','Downtime costs you money, so when something stops we pick up the phone.']
];
const html=head({title:"Wayne's Plant Hire World | Plant equipment hire in Randfontein, West Rand",desc:'Excavators, dozers, TLBs, tippers and lowbeds for hire in Randfontein. Delivered across the West Rand with an experienced operator. Get a quote on WhatsApp.',path:'/',ld:ldBusiness+ldFaq})
+header('home','/')+`
<section class="hs" id="hs" aria-labelledby="h1" data-dark-top>
  <div class="hx-bg" aria-hidden="true"><video class="hx-vid" muted loop playsinline preload="metadata" poster="/media/hero-aerial.webp" data-autoplay><source src="/media/hero-aerial.mp4" type="video/mp4"></video></div>
  <div class="hs-in">
    <h1 id="h1"><span class="hl"><span>Plant hire in Randfontein.</span></span></h1>
    <p class="hs-sub" data-fade>Excavators, dozers, TLBs, tippers and lowbeds, delivered across the West Rand with an experienced operator.</p>
    <form class="finder" id="finder" action="/equipment/" method="get" data-fade>
      <label><span>What are you looking for?</span><select name="m" id="fm"><option value="">Any machine</option>${machineOptions()}</select></label>
      <label><span>Type</span><select name="g" id="fg"><option value="">All types</option>${GROUPS.map(g=>`<option>${esc(g.n)}</option>`).join('')}</select></label>
      <label><span>Start date</span><input type="date" name="date" id="fd"></label>
      <button class="btn" type="submit">Search</button>
    </form>
    <p class="hs-alt" data-fade>Or browse <a href="/equipment/">all ${FLEET.length} machines</a>, or call the yard on <a href="tel:+27832970639">083 297 0639</a>.</p>
  </div>
  <img class="hs-m" src="/img/hero/excavator.webp?v=${V}" alt="" aria-hidden="true" fetchpriority="high">
  <ul class="hx-stats">
    <li><b>10+</b><span>Years on site</span></li>
    <li><b>50+</b><span>Fleet machines</span></li>
    <li><b>24/7</b><span>Support</span></li>
    <li class="yd"><span class="yard" data-yard><i></i><span>Mon to Fri, 07:30 to 17:00</span></span><a href="tel:+27832970639">083 297 0639</a></li>
  </ul>
</section>

<section class="sec" aria-labelledby="cat-h">
  <div class="shead"><h2 id="cat-h" class="h2">Browse by type</h2><a class="arl" href="/equipment/">All equipment</a></div>
  <ul class="gtiles">
    ${GROUPS.map(g=>`<li><a class="gt rv" href="${gUrl(g)}"><span class="gt-img"><img class="ph" src="${src(g.img)}" alt="" loading="lazy" style="object-position:${g.pos}"></span><strong>${esc(g.n)}</strong><span>${g.ids.length} ${g.ids.length===1?'machine':'machines'}</span></a></li>`).join('\n    ')}
  </ul>
</section>

<section class="sec benefits" aria-labelledby="ben-h">
  <div class="shead"><h2 id="ben-h" class="h2">Why hire from Wayne's</h2><p class="mute">Over 10 years supplying contractors and developers across the West Rand from our yard at 46 Steyr Street, Randfontein.</p></div>
  <ul class="ben">${BENEFITS.map(([h,p])=>`<li class="rv"><h3>${h}</h3><p>${p}</p></li>`).join('')}</ul>
</section>

<section class="sec" aria-labelledby="reg-h" style="padding-top:0">
  <div class="shead"><h2 id="reg-h" class="h2">Featured rentals</h2><a class="arl" href="/equipment/">View all ${FLEET.length} machines</a></div>
  <ol class="cards" id="reg">
    ${['d85a','komatsu-20t','hyundai-22t','wa420','cat428f','phantom','ud-lowbed','axor'].map(i=>row(byId[i])).join('\n    ')}
  </ol>
</section>

<section class="sec navy" aria-labelledby="how-h">
  <div class="shead"><h2 id="how-h" class="h2">How it works</h2><p class="mute">From our yard to your site, usually in three calls or fewer.</p></div>
  <ol class="how">
    <li class="rv"><b>1</b><h3>Find the machine</h3><p>Search by machine or type, or call and we'll size the right machine with you.</p></li>
    <li class="rv"><b>2</b><h3>Send your request</h3><p>Add machines to your quote, tell us the site and start date, and send it on WhatsApp or email.</p></li>
    <li class="rv"><b>3</b><h3>We deliver it</h3><p>We confirm a rate and bring it to site on our own trucks, with an experienced operator.</p></li>
  </ol>
  <div class="live rv">
    <div class="dist">
      <h3>How far is your site?</h3>
      <label class="vh" for="town">Your town</label>
      <select id="town">${TOWNS.map(([t,k],i)=>`<option value="${k}"${i===4?' selected':''}>${t}</option>`).join('')}</select>
      <p class="out" id="dist-out" aria-live="polite">About 16 km</p>
      <p class="note" id="dist-note">from our yard in Randfontein. Delivery on our own lowbeds and tippers.</p>
    </div>
    <div class="yd">
      <span class="yard" data-yard><i></i><span>Mon to Fri, 07:30 to 17:00</span></span>
      <p>WhatsApp and email enquiries are answered 24 hours.</p>
      <a class="btn" href="/quote/">Get a quote${AR}</a>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="faq-h">
  <div class="faq">
    <div class="fh"><h2 id="faq-h" class="h2">Questions</h2><p class="mute">The questions we answer most. Anything else, the yard is a phone call away.</p><a class="btn dark" href="tel:+27832970639">Call 083 297 0639</a></div>
    <div class="qs">${FAQ.map(([q,a],i)=>`<details${i===0?' open':''}><summary>${esc(q)}<i aria-hidden="true"></i></summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>

${cta({h:'Need it on site tomorrow?',p:"Tell us the machine and the site. We'll tell you if we can be there."})}
`+footer();
add('/',html);
}

/* ---------- EQUIPMENT: sidebar shop ---------- */
{
const html=head({title:"Equipment to hire: dozers, excavators, tippers | Wayne's Plant Hire World",desc:`Browse ${FLEET.length} machines for hire in Randfontein and the West Rand: excavators, dozers, TLBs, loaders, rollers, lowbeds, tippers, loggers and tractors.`,path:'/equipment/'})
+header('equipment','/equipment/')
+pageHead({h1:['Equipment for hire'],lead:'Every machine comes with an experienced operator and is delivered from Randfontein across the West Rand.',img:'/img/site/excavator-loading-2.webp',pos:'50% 32%',crumbs:[['/','Home'],['/equipment/','Equipment']]})+`
<section class="shop" aria-label="Equipment">
  <aside class="side">
    <label class="search"><span class="vh">Search equipment</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/></svg><input type="search" id="q" placeholder="Search equipment" autocomplete="off"></label>
    <h2>Equipment types</h2>
    ${tree()}
    <div class="help">
      <h2>Not sure what you need?</h2>
      <p>Tell us the job and we'll size the right machine.</p>
      <a href="tel:+27832970639">083 297 0639</a>
      <a href="${wa(HELLO)}">WhatsApp the yard</a>
    </div>
  </aside>
  <div class="list">
    <div class="bar">
      <p class="count" id="count" aria-live="polite">Showing all ${FLEET.length} machines</p>
      <label class="sort"><span class="vh">Sort by</span><select id="sort"><option value="i">Sort: default</option><option value="hp">Sort: most power</option><option value="w">Sort: heaviest</option><option value="n">Sort: name A to Z</option></select></label>
    </div>
    <ol class="cards" id="reg">
      ${FLEET.map(row).join('\n      ')}
    </ol>
    <p class="empty" id="empty" hidden>No machines match that search. Call us on <a href="tel:+27832970639">083 297 0639</a>, we may still have what you need.</p>
  </div>
</section>
`+footer();
add('/equipment/',html);
}

/* ---------- MACHINE SHEETS ---------- */
FLEET.forEach((f,i)=>{
  const rel=[...FLEET.filter(x=>x.g===f.g&&x.id!==f.id),...FLEET.filter(x=>x.c===f.c&&x.g!==f.g),...FLEET.filter(x=>x.c!==f.c)].slice(0,4);
  const tiles=[['Power',part(f.hp)],['Weight',part(f.w)],['Top speed',part(f.s)]].filter(t=>t[1]).map(([l,p])=>`<div><b class="num">${p.b}</b><span>${l}${p.u?', '+esc(p.u):''}</span></div>`).join('');
  const msg=`Hi Wayne's, I'm interested in hiring the ${f.n} (${no(f)}). Please can you advise on availability and rates?`;
  const html=head({title:`${f.n} for hire in Randfontein | Wayne's Plant Hire World`,desc:`${f.n} (${f.t.toLowerCase()}) for hire in Randfontein and the West Rand${f.hp?`, ${f.hp.replace(/\s*\(.*?\)/,'')}`:''}. Experienced operator included. Get a quote from Wayne's Plant Hire World.`,path:url(f),img:`${src(f.img)}`})
  +header('machine','/equipment/')+`
<section class="sheet" aria-labelledby="h1">
  <figure class="pic"><img class="ph" src="${src(f.img)}" alt="${esc(f.n)}" style="object-position:${f.pos}" fetchpriority="high"><span class="plate">${no(f)}</span></figure>
  <div class="info">
    ${crumb([['/','Home'],['/equipment/','Equipment'],[url(f),f.n]])}
    <h1 id="h1"><span class="hl"><span>${esc(f.n)}</span></span></h1>
    <p class="sub" data-fade>${esc(f.t)}, for hire with ${f.op?`${esc(f.op)}, an experienced operator`:'an experienced operator'}. Delivered from Randfontein across the West Rand.</p>
    <div class="rates">
      <div><h2>Hire</h2><p>Daily, weekly or monthly</p><b>Rate on request</b></div>
      <div><h2>Operator</h2><p>Experienced operator</p><b>Included</b></div>
    </div>
    <div class="acts">
      <button class="btn" type="button" data-add="${f.id}" data-on="Added to your quote ✓" data-off="Add to quote" aria-pressed="false">Add to quote</button>
      <a class="btn dark" href="${wa(msg)}">Ask on WhatsApp</a>
      <a class="btn ghost" href="tel:+27832970639">Call the yard</a>
    </div>
    <h2 class="sh">Specifications</h2>
    <div class="specs">${tiles}</div>
    <dl class="dl rv">
      <dt>Fleet no.</dt><dd>${no(f)}</dd>
      <dt>Type</dt><dd>${esc(f.t)}</dd>
      <dt>Category</dt><dd><a href="${gUrl(GROUPS.find(g=>g.n===f.g))}">${esc(f.g)}</a> · ${f.c}</dd>
      ${f.e?`<dt>Engine</dt><dd>${esc(f.e)}</dd>`:''}
      <dt>Operator</dt><dd>${f.op?esc(f.op)+', experienced operator':'Experienced operator included'}</dd>
      <dt>Rates</dt><dd>Confirmed per job, daily or monthly</dd>
    </dl>
  </div>
</section>
<section class="sec" aria-labelledby="rel-h" style="padding-top:0">
  <div class="shead"><h2 id="rel-h" class="h2">Related equipment</h2><a class="arl rv" href="/equipment/">All equipment</a></div>
  <ol class="cards">${rel.map(row).join('')}</ol>
</section>
${cta({h:'Ready to hire?',p:'Add machines, tell us where and when. We reply with availability and a rate.'})}
`+footer();
  add(url(f),html);
});

/* ---------- ABOUT ---------- */
{
const html=head({title:"About Wayne's Plant Hire World | Randfontein plant hire for 10+ years",desc:"Wayne's Plant Hire World provides well-maintained construction and earthmoving equipment to contractors and developers across the West Rand. 10+ years, 50+ fleet machines.",path:'/about/',ld:ldBusiness})
+header('about','/about/')
+pageHead({h1:["About","Wayne's."],lead:'A reliable plant equipment hire partner serving Randfontein and the surrounding West Rand areas.',img:'/img/site/ace-operator.webp',pos:'55% 38%',crumbs:[['/','Home'],['/about/','About']]})+`
<section class="sec" aria-labelledby="story-h">
  <h2 id="story-h" class="vh">Our story</h2>
  <div class="story">
    <div class="t">
      <p class="rv">Wayne's Plant Hire World was founded to provide well-maintained construction and earthmoving equipment to contractors and developers across the West Rand.</p>
      <p class="rv">We know downtime on a construction project is lost money. Based in Randfontein, we're positioned to deliver equipment quickly to your site. Our fleet has grown to include dozers, excavators, graders and specialised trucks.</p>
      <p class="rv"><strong>Reliability in every move.</strong></p>
      <div class="rv"><a class="btn" href="/equipment/">See the fleet${AR}</a></div>
    </div>
    <figure class="rv"><img class="ph" src="/img/site/crane-container-2.webp" alt="A Wayne's Plant Hire World crane truck on a delivery" loading="lazy" style="object-position:50% 45%"><figcaption class="cap">On a delivery, West Rand</figcaption></figure>
  </div>
</section>
<section class="navy" aria-label="Wayne's in one sentence">
  <div class="state">
    <p class="big l rv"><em>10+ years.</em> <em>50+ machines.</em></p>
    <p class="mute rv">Breakdown support and service 24/7. Expert operators, fast delivery, a maintained fleet and flexible rental: a day or a year.</p>
  </div>
</section>
${why('Why choose us?')}
${mosaic('The fleet at work.',[['site/ud-tipper.webp','a','Our UD tipper','50% 55%'],['site/skid-steer.webp','b','Bobcat skid steer'],['site/crane-container-2.webp','c','Crane truck on a delivery'],['site/tlb-rear.webp','d','TLB ready for the next job','50% 55%'],['site/logo-door.webp','e',"Wayne's Plant Hire World, on every machine",'50% 45%'],['site/ace-trench-air.webp','f','Ace Phantom trenching, from the air','50% 50%','phantom']])}
${cta({h:'Ready to start your project?',p:'Get in touch for a competitive quote.'})}
`+footer();
add('/about/',html);
}

/* ---------- CONTACT ---------- */
{
const html=head({title:"Contact Wayne's Plant Hire World | Randfontein, 083 297 0639",desc:"Call, WhatsApp or email Wayne's Plant Hire World. 46 Steyr Street, Randfontein. Mon to Fri 07:30 to 17:00, WhatsApp and email 24 hours.",path:'/contact/',ld:ldBusiness})
+header('contact','/contact/')
+pageHead({h1:['Talk to','the yard.'],lead:'Questions about equipment or a custom quote? Call, WhatsApp or send us a message.',img:'/img/site/ud-truck-operator.webp',pos:'50% 35%',crumbs:[['/','Home'],['/contact/','Contact']]})+`
<section class="cwrap" aria-labelledby="c-h">
  <div class="cinfo">
    <h2 id="c-h" class="vh">Contact details</h2>
    <span class="yard rv" data-yard data-long><i></i><span>Mon to Fri, 07:30 to 17:00</span></span>
    <div class="big rv"><span class="lbl">Call the yard</span><a href="tel:+27832970639">083 297 0639</a><a href="tel:+27832663871">083 266 3871</a><span>Mon to Fri, 07:30 to 17:00.</span></div>
    <div class="big rv"><span class="lbl">WhatsApp</span><a href="${wa(HELLO)}">Message us on WhatsApp</a><span>Answered 24 hours.</span></div>
    <div class="big rv"><span class="lbl">Email</span><a href="mailto:${MAIL}">${MAIL}</a><span>Answered 24 hours.</span></div>
    <div class="big addr rv"><span class="lbl">Visit the yard</span><b>46 Steyr Street, Randfontein</b><span>Gauteng. Serving Randfontein and surrounding West Rand areas.</span></div>
  </div>
  <form id="cf" class="card rv" novalidate>
    <h2>Send a message.</h2>
    <label>Full name<input type="text" id="c-name" autocomplete="name" placeholder="Your name"></label>
    <div class="two">
      <label>Email address<input type="email" id="c-mail" autocomplete="email" placeholder="you@company.co.za"></label>
      <label>Phone number<input type="tel" id="c-phone" autocomplete="tel" inputmode="tel" placeholder="082 000 0000"></label>
    </div>
    <label>Subject<input type="text" id="c-sub" placeholder="e.g. 20T excavator for two weeks"></label>
    <label>Message<textarea id="c-msg" placeholder="Tell us about the job and where the site is."></textarea></label>
    <div class="acts"><button class="btn" type="submit">Send on WhatsApp${AR}</button><a class="btn ghost" id="c-mailto" href="mailto:${MAIL}">Email it instead</a></div>
    <p class="note" id="c-note">We reply as soon as we can. WhatsApp and email are answered 24 hours.</p>
  </form>
</section>
<div class="map rv"><iframe title="Map: 46 Steyr Street, Randfontein" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=46%20Steyr%20Street%2C%20Randfontein%2C%20Gauteng&amp;z=14&amp;output=embed"></iframe></div>
`+footer();
add('/contact/',html);
}

/* ---------- QUOTE ---------- */
{
const html=head({title:"Get a quote | Wayne's Plant Hire World",desc:"Pick your machines, tell us where and when, and send the request to Wayne's on WhatsApp or email. We reply with availability and a rate.",path:'/quote/'})
+header('quote','/quote/')
+pageHead({h1:['Get a quote.'],lead:'Pick the machines, tell us where and when. It lands on our WhatsApp with everything listed, and we reply with availability and a rate.',img:'/img/site/crane-container.webp',pos:'50% 45%',crumbs:[['/','Home'],['/quote/','Get a quote']]})+`
<section class="job" aria-labelledby="qp-h">
  <div class="pick">
    <h2 id="qp-h" data-split>Pick your machines.</h2>
    <div class="tools">
      <div class="chips" id="chips" role="group" aria-label="Filter by type">
        <button class="chip" type="button" data-cat="All" aria-pressed="true">All ${FLEET.length}</button>
        ${CATS.map(c=>`<button class="chip" type="button" data-cat="${c.n}" aria-pressed="false">${c.n}</button>`).join('\n        ')}
      </div>
      <div class="right"><label class="search"><span class="vh">Search equipment</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="M15 15l6 6"/></svg><input type="search" id="q" placeholder="Search equipment" autocomplete="off"></label></div>
    </div>
    <ul class="picks" id="picks">
      ${FLEET.map(f=>`<li data-cat="${f.c}" data-name="${esc((f.n+' '+f.t+' '+no(f)).toLowerCase())}"><img class="ph" src="${src(f.img)}" alt="" loading="lazy" style="object-position:${f.pos}"><a href="${url(f)}"><strong>${esc(f.n)}</strong><span>${no(f)} · ${esc(f.t)}</span></a><button class="tog" type="button" data-add="${f.id}" aria-pressed="false" aria-label="Add ${esc(f.n)} to quote">Add</button></li>`).join('\n      ')}
    </ul>
  </div>
  <form id="qf" class="card" novalidate>
    <h2>Your request.</h2>
    <div><span style="font-weight:600;display:block;margin-bottom:8px">Machines</span><div class="sel" id="sel-box" role="list" aria-live="polite"></div></div>
    <div class="two">
      <label>Start date<input type="date" id="f-date"></label>
      <label>Site or town<input type="text" id="f-site" placeholder="Randfontein, Mohlakeng…" autocomplete="off"></label>
    </div>
    <div class="two">
      <label>Your name<input type="text" id="f-name" autocomplete="name" placeholder="Name"></label>
      <label>Phone<input type="tel" id="f-phone" autocomplete="tel" inputmode="tel" placeholder="082 000 0000"></label>
    </div>
    <label>Anything else?<textarea id="f-note" placeholder="How long you need it, access to site, operator needs…"></textarea></label>
    <div class="acts"><button class="btn" type="submit">Send on WhatsApp${AR}</button><a class="btn ghost" id="send-mail" href="mailto:${MAIL}">Email it instead</a></div>
    <p class="note" id="q-note">Open Mon to Fri, 07:30 to 17:00. WhatsApp and email are answered 24 hours.</p>
  </form>
</section>
${mosaic('Out on site.',[['site/excavator-loading.webp','a','Excavator loading a tipper'],['site/d85a-lowbed.webp','b','Komatsu D85A Dozer on our lowbed','50% 60%','d85a'],['site/tlb-rollback-sunrise.webp','c','TLB on the rollback at sunrise','50% 55%'],['site/excavator-branded.webp','d','Excavator on a West Rand site'],['site/ud-truck-operator.webp','e','Our UD truck and operator','50% 55%'],['site/ace-operator.webp','f','Ace Phantom and its operator','55% 50%','phantom']])}
`+footer();
add('/quote/',html);
}

/* ---------- PRIVACY ---------- */
{
const html=head({title:"Privacy Policy | Wayne's Plant Hire World",desc:"How Wayne's Plant Hire World collects and uses information, including analytics and advertising.",path:'/privacy-policy/'})
+header('privacy','/privacy-policy/')
+pageHead({h1:['Privacy policy.'],lead:'Last updated 13 July 2026.',crumbs:[['/','Home'],['/privacy-policy/','Privacy policy']]})+`
<section class="prose" aria-label="Privacy policy">
  <h2>Analytics and advertising</h2>
  <p>We use Google Analytics and Google Ads to improve our website and deliver relevant advertising. By using this site, you acknowledge this use for performance and advertising purposes.</p>
  <h2>Information collection</h2>
  <p>We collect information when you provide it directly, for example through a contact form, a quote request or other communication. This may include your name, email address, phone number and any other information you choose to give us.</p>
  <h2>Use of information</h2>
  <p>We use the information we collect to respond to enquiries, provide the equipment hire services you request, and communicate with you about your project. We do not sell or share your personal information with third parties for their direct marketing.</p>
  <h2>Contact us</h2>
  <p>Questions about this policy? Email <a href="mailto:${MAIL}">${MAIL}</a> or call <a href="tel:+27832970639">083 297 0639</a>.</p>
</section>
`+footer();
add('/privacy-policy/',html);
}

/* ---------- 404, sitemap, robots, data ---------- */
out('404.html',head({title:"Page not found | Wayne's Plant Hire World",desc:'This page could not be found.',path:'/404.html'})+header('404','')
+pageHead({h1:['Wrong turn.'],lead:"That page doesn't exist. The equipment page and the quote page are the best places to start.",crumbs:[['/','Home'],['/404.html','Not found']]})
+`<div class="wrap" style="padding-bottom:var(--gap);display:flex;gap:16px;flex-wrap:wrap"><a class="btn" href="/equipment/">See the fleet${AR}</a><a class="btn ghost" href="/quote/">Get a quote</a></div>`+footer());
out('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`  <url><loc>${SITE}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
out('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
out('assets/js/fleet.js','window.FLEET='+JSON.stringify(FLEET.map(f=>({id:f.id,n:f.n,c:f.c,t:f.t,no:no(f),img:f.img,url:url(f)})))+';\n');
console.log('built',pages.length,'pages');
