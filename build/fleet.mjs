// Wayne's Plant Hire World: fleet data, taken from the live site (waynesplanthireworld.co.za/equipment)
// Fields: id, n name, c category, t type, tag chips, img file in /img, pos object-position,
// op operator first name (live site), hp power, w weight, s speed, e engine
export const FLEET=[
 {id:'komatsu-20t',n:'20T Komatsu Excavator',c:'Earthmoving',t:'20 ton excavator',tag:['Heavy duty'],img:'komatsu-20t-excavator',pos:'50% 38%',hp:'148 hp (110 kW)',w:'20,010 kg',s:'5.5 km/h',e:'Komatsu SAA6D107E-1'},
 {id:'hyundai-22t',n:'22T Hyundai Excavator',c:'Earthmoving',t:'22 ton excavator',tag:['Heavy duty'],img:'hyundai-22t-excavator',pos:'50% 45%',hp:'143 hp (107 kW)',w:'21,900 kg',s:'5.7 km/h',e:'Hyundai HM 5.9 (Tier 2)'},
 {id:'d85a',n:'Komatsu D85A Dozer',c:'Earthmoving',t:'Bulldozer',tag:['Heavy duty','6-cylinder'],img:'site/d85a-lowbed.webp',pos:'50% 60%',op:'Dawid',hp:'228 hp',w:'23,610 kg',s:'11.2 km/h',e:'6-cylinder, 14.0 L (14,011 cc)'},
 {id:'wa420',n:'Komatsu WA420-3 Front Loader',c:'Earthmoving',t:'Wheel loader',tag:['6-cylinder'],img:'komatsu-wa420',pos:'55% 55%',hp:'217 hp (162 kW)',w:'18,220 kg',s:'34 km/h',e:'Komatsu S6D108'},
 {id:'cat428f',n:'CAT 428F Backhoe Loader',c:'Earthmoving',t:'TLB',tag:['4-cylinder'],img:'cat-428f',pos:'50% 62%',hp:'101 hp (74.5 kW)',w:'8,529 kg',s:'40 km/h',e:'Cat C4.4 ACERT'},
 {id:'cat422e',n:'CAT 422E Backhoe Loader',c:'Earthmoving',t:'TLB',tag:['4-cylinder'],img:'cat-422e',pos:'50% 60%',op:'Tsebo',hp:'76 hp (56 kW)',w:'10,200 kg',s:'40 km/h',e:'4-cylinder, 56 kW'},
 {id:'phantom',n:'Ace Phantom Backhoe Loader',c:'Earthmoving',t:'TLB',tag:['4-cylinder'],img:'site/ace-trench.webp',pos:'50% 50%',op:'Norman',hp:'96 hp',w:'8,040 kg',s:'40 km/h',e:'4.0 L (4,000 cc), 4-cylinder'},
 {id:'bobcat135',n:'Bobcat 135',c:'Earthmoving',t:'Mini excavator',tag:['Compact','4-cylinder'],img:'bobcat-135',pos:'50% 50%',op:'Stanford',hp:'100 hp',w:'3,770 kg',s:'11 km/h',e:'4-cylinder'},
 {id:'bomag',n:'Bomag BW 212 P Roller',c:'Earthmoving',t:'Compactor roller',tag:['4-cylinder'],img:'bomag-roller',pos:'50% 50%',op:'David',hp:'120.7 hp (98 kW)',w:'11,490 kg',s:'5 km/h',e:'4-cylinder, 98 kW'},
 {id:'ud-lowbed',n:'36-Ton UD Lowbed',c:'Trucks',t:'Heavy transport',tag:['36 ton'],img:'ud-lowbed-36t',pos:'50% 60%',hp:'490 hp (360 kW)',w:'65,000 kg GCM',s:'80 km/h',e:'UD GH13, 13-litre turbo diesel (governed speed)'},
 {id:'actros',n:'Mercedes Actros Lowbed',c:'Trucks',t:'Heavy transport',tag:['6-cylinder'],img:'actros-lowbed',pos:'50% 50%',op:'Norman',hp:'400 hp (295 kW)',w:'26,000 kg',s:'90 km/h',e:'6-cylinder, 295 kW'},
 {id:'axor',n:'Mercedes Axor 30-Ton Side Tipper',c:'Trucks',t:'Side tipper',tag:['30 ton','6-cylinder'],img:'axor-tipper',pos:'50% 50%',op:'Franki',hp:'400 hp',w:'30,000 kg',s:'90 km/h',e:'11.97 L'},
 {id:'ud390',n:'UD 390 Tipper',c:'Trucks',t:'Heavy duty tipper',tag:['Heavy duty'],img:'ud-390-tipper',pos:'50% 50%',op:'David',hp:'290 hp',w:'26,000 kg',s:'80 km/h',e:'UD GH11'},
 {id:'isuzu',n:'Isuzu 2300 Tipper',c:'Trucks',t:'Light duty tipper',tag:['Light duty','4-cylinder'],img:'isuzu-tipper',pos:'50% 50%',op:'Solly',hp:'148 hp',w:'2,900 kg',s:'110 km/h',e:'5.2 L, 4-cylinder'},
 {id:'crane',n:'Rigid Crane Truck',c:'Trucks',t:'Crane truck',tag:['Rigid','6-cylinder'],img:'crane-truck',pos:'50% 50%',op:'Norman',hp:'162 hp',w:'18,000 kg',s:'90 km/h',e:'7.6 L, 6-cylinder'},
 {id:'bell220',n:'Bell 220 Logger',c:'Loggers',t:'Forestry logger',tag:['Forestry','4-cylinder'],img:'bell-220',pos:'50% 50%',op:'Stanford',hp:'100 hp',w:'',s:'11 km/h',e:'3.3 L, 4-cylinder'},
 {id:'bell225',n:'Bell 225 Logger',c:'Loggers',t:'Forestry logger',tag:['Forestry','4-cylinder'],img:'bell-225',pos:'50% 50%',op:'Tsebo',hp:'100 hp',w:'6,727 kg',s:'11.2 km/h',e:'3.3 L, 4-cylinder'},
 {id:'fiat',n:'Fiat 70-56 Tractor',c:'Tractors',t:'Agricultural tractor',tag:['Agricultural','4-cylinder'],img:'fiat-tractor',pos:'50% 50%',op:'Fanki',hp:'70 hp',w:'2,950 kg',s:'30 km/h',e:'Fiat 8045.06'},
 {id:'massey',n:'Massey Ferguson 165 with Slasher',c:'Tractors',t:'Tractor, slasher and mower combo',tag:['Agricultural'],img:'massey-165',pos:'50% 50%',hp:'58 hp',w:'2,270 kg',s:'30 km/h',e:'Perkins AD4.203 diesel'}
];
export const CATS=[
 {n:'Earthmoving',d:'Excavators, dozers, TLBs, loaders and rollers.',img:'site/excavator-loading-2.webp',pos:'50% 50%'},
 {n:'Trucks',d:'Lowbeds, tippers and a crane truck.',img:'site/ud-tipper.webp',pos:'12% 55%'},
 {n:'Loggers',d:'Bell forestry loggers.',img:'site/logger-sunset.webp',pos:'50% 60%'},
 {n:'Tractors',d:'Agricultural tractors and a slasher combo.',img:'massey-165',pos:'50% 50%'}
];
export const slug=f=>f.n.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
/* Machine types, the way a contractor searches. p = parent category (CATS), img = tile photo */
export const GROUPS=[
 {n:'Excavators',p:'Earthmoving',ids:['komatsu-20t','hyundai-22t','bobcat135'],img:'hyundai-22t-excavator',pos:'50% 45%'},
 {n:'Dozers',p:'Earthmoving',ids:['d85a'],img:'site/d85a-sky.webp',pos:'50% 45%'},
 {n:'TLBs',p:'Earthmoving',ids:['cat428f','cat422e','phantom'],img:'cat-428f',pos:'50% 62%'},
 {n:'Loaders & rollers',p:'Earthmoving',ids:['wa420','bomag'],img:'komatsu-wa420',pos:'55% 55%'},
 {n:'Tippers',p:'Trucks',ids:['axor','ud390','isuzu'],img:'site/ud-tipper.webp',pos:'20% 55%'},
 {n:'Lowbeds & cranes',p:'Trucks',ids:['ud-lowbed','actros','crane'],img:'ud-lowbed-36t',pos:'50% 60%'},
 {n:'Loggers',p:'Loggers',ids:['bell220','bell225'],img:'site/logger-sunset.webp',pos:'50% 60%'},
 {n:'Tractors',p:'Tractors',ids:['fiat','massey'],img:'massey-165',pos:'50% 50%'}
];
for(const g of GROUPS)for(const id of g.ids)FLEET.find(f=>f.id===id).g=g.n;
