// Kingdom Academy — DIY Hotpot Cafe logic (front-end demo)

const BROTHS = [
  { id:"mala", name:"Fiery Mala 🌶️", price:6.9, emoji:"🌶️", desc:"Numbing & spicy" },
  { id:"laksa", name:"Laksa Lemak 🦐", price:7.9, emoji:"🦐", desc:"Coconut local fave" },
  { id:"tomato", name:"Tomato Collagen 🍅", price:6.9, emoji:"🍅", desc:"Sweet-sour" },
  { id:"mushroom", name:"Mushroom Herbal 🍄", price:6.9, emoji:"🍄", desc:"Light & veg" },
  { id:"tomyum", name:"Tom Yum 🔥", price:7.5, emoji:"🔥", desc:"Thai sour-spicy" },
  { id:"collagen", name:"Chicken Collagen 🍗", price:7.5, emoji:"🍗", desc:"Rich & silky" },
];
const NOODLES = [
  { id:"ramen", name:"Ramen", emoji:"🍜" },
  { id:"meekia", name:"Mee Kia", emoji:"🍜" },
  { id:"vermi", name:"Vermicelli", emoji:"🍝" },
  { id:"udon", name:"Udon", emoji:"🍲" },
  { id:"knife", name:"Knife-Cut", emoji:"🔪" },
];
const TOPPINGS = [
  { id:"beef", name:"Beef slices", price:2.5, emoji:"🥩" },
  { id:"prawn", name:"Prawn x3", price:2.5, emoji:"🦐" },
  { id:"lunch", name:"Luncheon", price:1.5, emoji:"🍖" },
  { id:"fishcake", name:"Fish cake", price:1.2, emoji:"🍥" },
  { id:"quail", name:"Quail egg x3", price:1.2, emoji:"🥚" },
  { id:"enoki", name:"Enoki", price:1.0, emoji:"🍄", veg:true },
  { id:"lotus", name:"Lotus root", price:1.0, emoji:"🥔", veg:true },
  { id:"nai", name:"Nai bai", price:0.8, emoji:"🥬", veg:true },
  { id:"corn", name:"Sweet corn", price:0.8, emoji:"🌽", veg:true },
  { id:"tofu", name:"Tofu puff", price:0.8, emoji:"🧈", veg:true },
  { id:"crab", name:"Crab stick x2", price:1.2, emoji:"🦀" },
  { id:"sausage", name:"Cheese sausage", price:1.5, emoji:"🌭" },
];
const MENU = [
  { id:101, name:"Mala Buddy Set", price:9.9, cat:"set", emoji:"🌶️", desc:"Mala + ramen + beef + enoki + egg.", tags:["popular"] },
  { id:102, name:"Laksa First-Timer", price:10.9, cat:"set", emoji:"🦐", desc:"Laksa + mee kia + prawn + tofu puff.", tags:["ai"] },
  { id:103, name:"Veg Comfort Bowl", price:8.9, cat:"set", emoji:"🍄", desc:"Mushroom + vermicelli + 4 veg.", tags:["veg"] },
  { id:104, name:"Feast For Two", price:19.9, cat:"set", emoji:"🍲", desc:"Any 2 broths + 6 toppings. Share!", tags:["share"] },
  { id:105, name:"Iced Barley / Teh O", price:2.0, cat:"side", emoji:"🥤", desc:"Cool the spice.", tags:[] },
  { id:106, name:"Fried Mantou x4", price:3.5, cat:"side", emoji:"🥖", desc:"Dip in broth. Elite move.", tags:["popular"] },
  { id:107, name:"Seaweed Snack", price:1.5, cat:"side", emoji:"🌿", desc:"Crunchy side.", tags:[] },
  { id:108, name:"Extra Noodles", price:1.5, cat:"side", emoji:"🍜", desc:"Because one portion is never enough.", tags:[] },
];

const $ = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
function toast(m){ const t=$("#toast"); if(!t) return; t.textContent=m; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2600); }

// nav
(function(){ const h=$(".hamburger"), l=$(".nav-links"); if(h&&l) h.addEventListener("click",()=>l.classList.toggle("open")); })();

// sticky header: transparent over hero, cream once scrolled
(function(){
  const nav=document.querySelector(".navbar"); if(!nav) return;
  const onScroll=()=>{ if(window.scrollY>40) nav.classList.add("scrolled"); else nav.classList.remove("scrolled"); };
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();
})();

// cart: {key: {label, price, qty}}
let cart={};
function cartCount(){ return Object.values(cart).reduce((a,b)=>a+b.qty,0); }
function cartTotal(){ return Object.values(cart).reduce((s,i)=>s+i.price*i.qty,0); }
function saveCart(){ try{localStorage.setItem("slurp_cart",JSON.stringify(cart));}catch(e){} }
function loadCart(){ try{cart=JSON.parse(localStorage.getItem("slurp_cart")||"{}");}catch(e){cart={};} }
function renderCart(){
  const box=$("#cartItems"); if(!box) return;
  const ks=Object.keys(cart);
  box.innerHTML = ks.length ? ks.map(k=>{ const i=cart[k]; return `<div class="cart-row"><span>${i.label} × ${i.qty}</span><span>$${(i.price*i.qty).toFixed(2)} <button data-rm="${k}">✕</button></span></div>`; }).join("") : "<p>Empty. Build a bowl!</p>";
  const t=$("#cartTotal"); if(t) t.textContent="$"+cartTotal().toFixed(2);
  const c=$("#cartCountTop"); if(c) c.textContent=cartCount();
  $$("#cartItems [data-rm]").forEach(b=>b.onclick=()=>{ delete cart[b.dataset.rm]; saveCart(); renderCart(); });
}
function openCart(){ $("#cartDrawer")?.classList.add("open"); $("#overlay")?.classList.add("show"); }
function closeCart(){ $("#cartDrawer")?.classList.remove("open"); $("#overlay")?.classList.remove("show"); }
function addToCart(label,price){ const k=label; cart[k]=cart[k]||{label,price,qty:0}; cart[k].qty++; saveCart(); renderCart(); toast("Added 🧺 "+label); }

// bowl builder
let bowl={ broth:BROTHS[0], noodle:NOODLES[0], tops:new Set(), spice:1 };
function bowlPrice(){
  let p=bowl.broth.price;
  let vegCount=[...bowl.tops].filter(id=>TOPPINGS.find(t=>t.id===id)?.veg).length;
  let freeVeg=Math.min(3,vegCount);
  [...bowl.tops].forEach(id=>{ const t=TOPPINGS.find(x=>x.id===id); if(!t) return; if(t.veg && freeVeg>0){ freeVeg--; return; } p+=t.price; });
  return p;
}
function renderBuilder(){
  const bg=$("#brothGrid"); if(!bg) return;
  bg.innerHTML=BROTHS.map(b=>`<div class="opt ${bowl.broth.id===b.id?'sel':''}" data-b="${b.id}"><div class="e">${b.emoji}</div><b>${b.name}</b><small>$${b.price.toFixed(2)} base</small></div>`).join("");
  $$("#brothGrid .opt").forEach(o=>o.onclick=()=>{ bowl.broth=BROTHS.find(b=>b.id===o.dataset.b); renderBuilder(); });
  const ng=$("#noodleGrid");
  ng.innerHTML=NOODLES.map(n=>`<div class="opt ${bowl.noodle.id===n.id?'sel':''}" data-n="${n.id}"><div class="e">${n.emoji}</div><b>${n.name}</b><small>incl.</small></div>`).join("");
  $$("#noodleGrid .opt").forEach(o=>o.onclick=()=>{ bowl.noodle=NOODLES.find(n=>n.id===o.dataset.n); renderBuilder(); });
  const tg=$("#toppingGrid");
  tg.innerHTML=TOPPINGS.map(t=>`<div class="opt ${bowl.tops.has(t.id)?'sel':''}" data-t="${t.id}"><div class="e">${t.emoji}</div><b>${t.name}</b><small>$${t.price.toFixed(2)}${t.veg?' • veg':''}</small></div>`).join("");
  $$("#toppingGrid .opt").forEach(o=>o.onclick=()=>{ const id=o.dataset.t; bowl.tops.has(id)?bowl.tops.delete(id):bowl.tops.add(id); renderBuilder(); });
  const spiceNames=["No Spice 😌","Mild Kick 🌶️","Medium 🔥","Extra Spicy 🥵","Dragon 🌋","MALA CHALLENGE 💀"];
  $("#spiceLabel").textContent=bowl.spice+" – "+spiceNames[bowl.spice];
  const tn=[...bowl.tops].map(id=>TOPPINGS.find(t=>t.id===id)?.name).filter(Boolean).join(", ")||"no toppings yet";
  $("#bowlSummary").textContent=`${bowl.broth.name} + ${bowl.noodle.name} + ${tn} • spice ${bowl.spice}`;
  $("#bowlTotal").textContent="$"+bowlPrice().toFixed(2);
}

// menu grid
function renderMenu(f="all"){
  const g=$("#menuGrid"); if(!g) return;
  g.innerHTML=MENU.filter(m=>f==="all"||m.cat===f).map(m=>`<div class="menu-item"><div class="top">${m.emoji}</div><div class="body"><h3>${m.name}<span>$${m.price.toFixed(2)}</span></h3><p>${m.desc}</p><div>${(m.tags||[]).map(t=>`<span class="tag ${t==='ai'?'ai':''}">${t}</span>`).join("")}</div><div style="height:8px"></div><button class="add-btn" data-add="${m.id}">Add +</button></div></div>`).join("");
  $$("#menuGrid [data-add]").forEach(b=>b.onclick=()=>{ const m=MENU.find(x=>x.id==b.dataset.add); addToCart(m.emoji+" "+m.name,m.price); });
}

// quiz
function initQuiz(){
  if(!$("#quiz")) return;
  const ans={};
  $$("#quiz .q").forEach(q=>{ $$("button",q).forEach(b=>b.onclick=()=>{ $$("button",q).forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); ans[q.dataset.q]=b.dataset.v; }); });
  $("#quizGo").onclick=()=>{
    let b="Laksa Lemak 🦐";
    if(ans.mood==="spicy") b="Fiery Mala 🌶️";
    else if(ans.mood==="light") b="Mushroom Herbal 🍄";
    else if(ans.mood==="comfort"&&ans.diet==="veg") b="Mushroom Herbal 🍄";
    else if(ans.mood==="comfort") b="Tomato Collagen 🍅";
    const box=$("#quizResult"); box.classList.add("show");
    box.innerHTML=`🤖 <strong>Slurpy recommends: ${b}</strong><br/><span style="font-size:.88rem;">Go to builder above & tap it — add beef if feast mode, keep veg if light.</span>`;
    box.scrollIntoView({behavior:"smooth",block:"nearest"});
  };
}

// chat — Slurpy the AI buddy (rule-based demo)
// ★ ADD MORE IDEAS HERE: copy one { keys:[...], reply:"..." } block,
// put trigger words in keys, answer in reply. First match wins,
// so keep specific topics ABOVE general ones. ★
const CHAT_QA = [
  // PAGE NAVIGATION — ask about a page → short description + link to go there
  { keys:["menu page","menu.html","see menu","view menu","show menu","what's on the menu","what is on the menu","what do you sell","bowl builder","build your own bowl","what pages","what page"], reply:'🍜 <b>Menu page</b> — browse every set, the Build-a-Bowl builder, sides & prices. Tap a set to add it, or build your own. → <a href="menu.html">Open Menu</a>' },
  { keys:["traineeship page","internship page","apply page","interns.html","trainee page"], reply:'🎓 <b>Traineeship page</b> — the 2-Year GROW traineeship explained: what you study, allowance, meals, and the big application form. → <a href="interns.html">Open Traineeship</a>' },
  { keys:["about page","about.html","about us","who are you","who we are","our story","our mission"], reply:'💛 <b>About page</b> — who Kingdom Livelihood Academy is, our mission, and the Singapore + Siem Reap story behind the café. → <a href="about.html">Open About</a>' },
  { keys:["contact page","reach us page","message page"], reply:'📞 <b>Contact page</b> — contact form, prayer form, WhatsApp, catering & how to find us. → <a href="contact.html">Open Contact</a>' },
  { keys:["home page","go home","index.html","back to home","main page","landing page"], reply:'🏠 <b>Home</b> — the café intro, our story, and quick links to Menu, Traineeship, About & Contact. → <a href="index.html">Back to Home</a>' },
  { keys:["echo from above","echofromabove","echo","parent ministry","broad vision","broadvision","christian mission","sub-ministry"], reply:'🌏 Echo From Above — our parent ministry! We\'re the Kingdom Livelihood Academy café side of it. See the charity & missions site: <a href="https://isaac3780.github.io/echofromabove/charity-site/index.html" target="_blank" rel="noopener">↩ Broad Vision / Echo From Above</a>' },
  { keys:["vision","mission","transform lives","purpose","why do you exist","why this cafe","mission statement"], reply:"🌟 Vision — to transform lives through vocational training, entrepreneurship, discipleship + sustainable livelihoods. We exist to raise people, not just run cafés!" },
  { keys:["phase","phases","timeline","roadmap","months","budget","launch","plan to start"], reply:"🗓️ Phase 1 (Months 1–3): Singapore HQ, curriculum, handbook, SOPs, registration, admin, partnerships. Phase 2 (M4–6): Siem Reap café secured, renovated, equipped, staff trained, trial ops. Phase 3 (M7–12): recruit via local churches, first intake, programme launched!" },
  { keys:["business","business model","revenue","income","money","profit","franchise","affordable meals","community partnerships","funding","funded"], reply:"💼 Business model — affordable meals + training income + community partnerships, with future franchise / partner cafés as graduates mature." },
  { keys:["2-year","trainee","intern","hire","job","salary","pay","earn","study","curriculum","subject"], reply:"🎓 2-Year Traineeship! Study English, Math, Customer Service, Café Operations, Inventory, Administration, Entrepreneurship, Leadership + Biblical Discipleship. Weekly fellowship is compulsory. Allowance + meals + certificate → chef / leader / village café partner. Apply on the <a href=\"interns.html\">Traineeship page</a>!" },
  { keys:["grow","guide","raise","operate","walk","stages"], reply:"🌱 G.R.O.W. — Guide (faith, mentoring & discipleship), Raise (life skills, entrepreneurship, leadership), Operate (hands-on real café shifts), Walk (mature into leaders, disciple-makers, future café owners). All 4 stages for every trainee!" },
  { keys:["singapore hq","headquarters","hq","administration","admin","certificates","student records","quality assurance","handbook","sop"], reply:"🇸🇬 Singapore HQ = the sending & equipping centre. Runs administration, curriculum & handbook, student records, certificates, finance & partnerships, and quality assurance." },
  { keys:["siem reap cafe","siem reap café","training cafe","training café","first operational","chef","floor staff","community outreach","mini hotpot","bento"], reply:"🇰🇭 Siem Reap Training Café = our first operational café: DIY mini hotpot sets + bento value meals, practical chef & floor-staff training, community outreach, and a local church partner." },
  { keys:["vs","versus"], reply:"🇸🇬 Singapore HQ = headquarters & equipping base. 🇰🇭 Siem Reap Training Café = training café academy." },
  { keys:["singapore","siem reap","cambodia","location","where","address","hour","open"], reply:"Café daily 11am–10pm, Fri/Sat till 12am! 🇰🇭 Siem Reap Training Café" },
  { keys:["john","bible","verse","sheep","feed","discipleship","fellowship","church"], reply:"❤️ John 21:15-17 — 'Do you love Me?... Feed My sheep.' We feed people physically through livelihoods + spiritually through discipleship. Weekly fellowship compulsory for trainees!" },
  { keys:["pray","prayer","bless","struggle","need help"], reply:'🙏 We\'d love to pray for you! Drop it in our <a href="https://forms.gle/M6q2qT2wRfyZ9fyo7" target="_blank" rel="noopener">prayer form</a> — our team prays weekly. Or see the <a href="contact.html">Contact page</a>.' },
  { keys:["contact","message","whatsapp","phone","talk","email","reach","cater"], reply:'📞 Easiest: the <a href="contact.html">Contact page</a> — <a href="https://forms.gle/yKgfLnRqDMRPCcc16" target="_blank" rel="noopener">contact form</a> for anything, <a href="https://forms.gle/M6q2qT2wRfyZ9fyo7" target="_blank" rel="noopener">prayer form</a> for prayer. We reply in 3 working days!' },
  { keys:["graduate","grad","pathway","future","founder","partner","village","restaurant leader"], reply:"🚀 Graduate pathway — employment, restaurant leader, chef, or BroadVision café partner: launch new cafés in villages & churches, create jobs, make disciples. We're a sub-ministry of Echo From Above!" },
  { keys:["business","business model","revenue","income","money","profit","franchise","affordable meals","community partnerships","funding","funded"], reply:"💼 Business model — affordable meals + training income + community partnerships, with future franchise / partner cafés as graduates mature." },
  { keys:["long term","long-term","raise people","raise disciples","equipping","sending","kingdom","restore","expand"], reply:"🌟 Long-term — Cambodia is our first mission field. As graduates mature, they launch BroadVision cafés in their own villages, towns or regions — creating jobs, strengthening churches, making disciples. All guided by 'Feed My sheep.' (John 21:15-17)" },
  { keys:["mala","spicy","challenge","level"], reply:"🌶️ Mala 0–5. New? Start 1–2. Pro? 4–5. Level 5 = free drink if you finish!" },
  { keys:["laksa","recommend","best","first","try","broth"], reply:"🦐 First-timer? Laksa + mee kia + prawn. Comfort? Tomato Collagen. Light? Mushroom Herbal. Build it on the <a href=\"menu.html\">Menu page</a> — base $6.90!" },
  { keys:["veg","vegetarian","halal","bento"], reply:"🥬 Mushroom + vermicelli + veg! First 3 veg FREE in builder. Bento value meals from $5.90. Halal-friendly options — ask staff." },
  { keys:["price","cost","cheap","budget"], reply:"💰 Base $6.90 (broth+noodles+3 free veg). Most $9–12. Feast for Two $19.90. Community bowl $4.90 ❤️" },
  { keys:["noodle","ramen","udon","mee","topping"], reply:"🍜 5 noodles: ramen, mee kia, vermicelli, udon, knife-cut. 20+ toppings $0.80–$2.50. Mix two noodles if torn!" },
  { keys:["hi","hello","hey"], reply:"Hi! I'm Slurpy 🍲 DIY bowl help or 2-Year Traineeship info?" },
  { keys:["thank"], reply:"Slurp you later! 🍜❤️" },
];
const CHAT_FALLBACK = "🤔 Hmm, that's beyond my bowl-brain for now — still learning! You can still send a message at <a href=\"https://wa.me/6582683372\" target=\"_blank\" rel=\"noopener\">WhatsApp +65 82683372</a> and we'll reply to you as soon as possible 💬";
function botReply(text){
  const t = text.toLowerCase();
  for (const item of CHAT_QA) {
    if (item.keys.some(k => t.includes(k))) return item.reply;
  }
  return CHAT_FALLBACK;
}
// Guided suggestions (Singtel-style): tap a chip to lead the chat.
// Each chip can reveal follow-up chips (options), deepening the guided flow.
// ★ To change chips, edit QUICK below: { label (button), ask (question sent), options (follow-up chips) } ★
const QUICK = [
  { label:"🍜 Build a bowl", ask:"What do you recommend for first-timers?", options:[
    { label:"Which broth?", ask:"Which broth is good?" },
    { label:"Noodles & toppings", ask:"What noodles and toppings are there?" },
    { label:"Spice levels", ask:"How spicy is Mala?" },
    { label:"↩ Main menu" },
  ]},
  { label:"🎓 Traineeship", ask:"Tell me about the 2-Year Traineeship", options:[
    { label:"What is GROW?", ask:"What is GROW?" },
    { label:"Salary & allowance", ask:"How much salary and allowance?" },
    { label:"Apply now", ask:"How do I apply for the traineeship?" },
    { label:"↩ Main menu" },
  ]},
  { label:"🌟 Mission & plan", ask:"What's the Academy's vision?", options:[
    { label:"Vision", ask:"What is the academy's vision?" },
    { label:"Roadmap / phases", ask:"What are the phases and timeline?" },
    { label:"After graduation", ask:"What happens after graduation?" },
    { label:"Business model", ask:"How does the business model work?" },
    { label:"Echo From Above", ask:"What is Echo From Above?" },
    { label:"↩ Main menu" },
  ]},
  { label:"📍 Locations", ask:"Where are you located?", options:[
    { label:"Singapore HQ", ask:"What does the Singapore HQ do?" },
    { label:"Siem Reap Training Café", ask:"What is the Siem Reap training café like?" },
    { label:"Hours", ask:"What are your opening hours?" },
    { label:"Singapore vs Siem Reap", ask:"Singapore vs Siem Reap?" },
    { label:"↩ Main menu" },
  ]},
  { label:"🙏 Prayer", ask:"I want to request prayer", options:[
    { label:"Prayer form", ask:"Where is the prayer form?" },
    { label:"↩ Main menu" },
  ]},
  { label:"📞 Contact", ask:"How do I contact you?", options:[
    { label:"Contact page", ask:"Where is the contact page?" },
    { label:"Catering", ask:"Do you cater events?" },
    { label:"↩ Main menu" },
  ]},
];
function initChat(){
  const f=$("#chatFab"), b=$("#chatbox"); if(!f||!b) return;
  f.onclick=()=>b.classList.toggle("open");
  const log=$("#chatlog");
  // build chips bar once, above the input
  let bar=$("#quickReplies");
  if(!bar){
    bar=document.createElement("div");
    bar.className="quick-replies"; bar.id="quickReplies";
    b.insertBefore(bar, b.querySelector(".chatinput"));
  }
  const render=(list)=>{
    bar.innerHTML=list.map((q,i)=>`<button data-q="${i}">${q.label}</button>`).join("");
    bar._list=list;
  };
  render(QUICK);
  bar.addEventListener("click",e=>{
    const btn=e.target.closest("button"); if(!btn) return;
    const q=bar._list[+btn.dataset.q]; if(!q) return;
    if(!b.classList.contains("open")) b.classList.add("open");
    if(!q.ask){ render(QUICK); return; }
    say(q.ask, q.options);
  });
  const typing=()=>{
    const t=document.createElement("div"); t.className="msg bot typing"; t.textContent="…";
    log.appendChild(t); log.scrollTop=log.scrollHeight; return t;
  };
  const say=(v, options)=>{
    v=(v||"").trim(); if(!v) return;
    log.insertAdjacentHTML("beforeend",`<div class="msg user">${v.replace(/</g,"&lt;")}</div>`);
    log.scrollTop=log.scrollHeight;
    const dots=typing();
    setTimeout(()=>{
      dots.remove();
      log.insertAdjacentHTML("beforeend",`<div class="msg bot">${botReply(v)}</div>`);
      log.scrollTop=log.scrollHeight;
      if(options && options.length){ const bar=$("#quickReplies"); if(bar && bar._list) render(options); }
    },450);
  };
  const send=()=>{ const i=$("#chatText"); say(i.value); i.value=""; };
  $("#chatSend").onclick=send; $("#chatText").addEventListener("keydown",e=>{ if(e.key==="Enter") send(); });
}
function initInternForm(){
  const f=$("#internForm"); if(!f) return;
  f.addEventListener("submit",e=>{ e.preventDefault(); const d=Object.fromEntries(new FormData(f).entries()); try{ const a=JSON.parse(localStorage.getItem("slurp_apps")||"[]"); a.push({...d,at:new Date().toISOString()}); localStorage.setItem("slurp_apps",JSON.stringify(a)); }catch(err){} toast("Application received! Reply in 3 days 🎓"); f.reset(); });
}

document.addEventListener("DOMContentLoaded",()=>{
  loadCart(); renderCart(); renderBuilder(); renderMenu(); initQuiz(); initChat(); initInternForm();
  const spiceEl=$("#spice"); if(spiceEl) spiceEl.addEventListener("input",e=>{ bowl.spice=+e.target.value; renderBuilder(); });
  $("#resetBowl") && ($("#resetBowl").onclick=()=>{ bowl={broth:BROTHS[0],noodle:NOODLES[0],tops:new Set(),spice:1}; $("#spice").value=1; renderBuilder(); });
  $("#aiSuggest") && ($("#aiSuggest").onclick=()=>{
    bowl.broth=BROTHS[Math.floor(Math.random()*BROTHS.length)];
    bowl.noodle=NOODLES[Math.floor(Math.random()*NOODLES.length)];
    bowl.tops=new Set(["beef","enoki","quail"].sort(()=>Math.random()-.5).slice(0,2+Math.floor(Math.random()*2)));
    bowl.spice=1+Math.floor(Math.random()*3); $("#spice").value=bowl.spice; renderBuilder(); toast("AI picked your bowl ✨");
  });
  $("#addBowl") && ($("#addBowl").onclick=()=>{
    const label=`🍲 ${bowl.broth.name.split(" ")[0]}+${bowl.noodle.name}(S${bowl.spice}) x${bowl.tops.size}top`;
    addToCart(label,bowlPrice()); openCart();
  });
  const filterBar=$("#filterBar"); if(filterBar) filterBar.addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b) return; $$("#filterBar button").forEach(x=>x.classList.remove("active")); b.classList.add("active"); renderMenu(b.dataset.f); });
  $("#openCartTop") && ($("#openCartTop").onclick=openCart);
  $("#closeCart") && ($("#closeCart").onclick=closeCart);
  $("#overlay") && ($("#overlay").onclick=closeCart);
  $("#checkoutBtn") && ($("#checkoutBtn").onclick=()=>{ if(!cartCount()) return toast("Tray empty!"); toast("Demo checkout $"+cartTotal().toFixed(2)+" — connect payment later!"); });
});
