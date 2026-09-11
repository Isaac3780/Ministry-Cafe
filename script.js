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
  { keys:["2-year","trainee","intern","hire","job","salary","pay","work","earn","study","curriculum"], reply:"🎓 2-Year Traineeship! Café shifts + English, Math, entrepreneurship + discipleship. Weekly fellowship. Allowance + meals + certificate → chef/leader/village café partner. Apply on Traineeship page!" },
  { keys:["grow"], reply:"🌱 GROW = Guide (faith), Raise (skills), Operate (real café shifts), Walk (graduate to leader/founder). That's the rough model from the Academy deck!" },
  { keys:["singapore","siem reap","cambodia","hq","location","where","address","hour","open"], reply:"🇸🇬 Singapore (SG) HQ (admin/curriculum) + 🇰🇭 Siem Reap (KH) training café idea (mini hotpots + church outreach). Café daily 11am–10pm, Fri/Sat till 12am!" },
  { keys:["john","bible","verse","sheep","feed","discipleship","fellowship","church"], reply:"❤️ John 21:15-17 — 'Feed My sheep.' We feed physically (hotpot jobs) + spiritually (discipleship). Weekly fellowship compulsory for trainees!" },
  { keys:["pray","prayer","bless","struggle","need help"], reply:'🙏 We\'d love to pray for you! Drop it in our <a href="https://forms.gle/M6q2qT2wRfyZ9fyo7" target="_blank" rel="noopener">prayer form</a> — our team prays weekly. Or see the <a href="contact.html">Contact page</a>.' },
  { keys:["contact","message","whatsapp","phone","talk","email","reach","cater"], reply:'📞 Easiest: the <a href="contact.html">Contact page</a> — <a href="https://forms.gle/yKgfLnRqDMRPCcc16" target="_blank" rel="noopener">contact form</a> for anything, <a href="https://forms.gle/M6q2qT2wRfyZ9fyo7" target="_blank" rel="noopener">prayer form</a> for prayer. We reply in 3 working days!' },
  { keys:["graduate","pathway","future","founder","partner","village","mission","broad vision","echo"], reply:"🚀 Graduate → job / leader / chef / BroadVision café partner — launch village cafés, create jobs, make disciples. We're a sub-ministry of Echo From Above!" },
  { keys:["mala","spicy","challenge","level"], reply:"🌶️ Mala 0–5. New? Start 1–2. Pro? 4–5. Level 5 = free drink if you finish!" },
  { keys:["laksa","recommend","best","first","try","broth"], reply:"🦐 First-timer? Laksa + mee kia + prawn. Comfort? Tomato Collagen. Light? Mushroom Herbal. Build it on Menu page — base $6.90!" },
  { keys:["veg","vegetarian","halal","bento"], reply:"🥬 Mushroom + vermicelli + veg! First 3 veg FREE in builder. Bento value meals from $5.90. Halal-friendly options — ask staff." },
  { keys:["price","cost","cheap","budget"], reply:"💰 Base $6.90 (broth+noodles+3 free veg). Most $9–12. Feast for Two $19.90. Community bowl $4.90 ❤️" },
  { keys:["noodle","ramen","udon","mee","topping"], reply:"🍜 5 noodles: ramen, mee kia, vermicelli, udon, knife-cut. 20+ toppings $0.80–$2.50. Mix two noodles if torn!" },
  { keys:["hi","hello","hey"], reply:"Hi! I'm Slurpy 🍲 DIY bowl help or 2-Year Traineeship info?" },
  { keys:["thank"], reply:"Slurp you later! 🍜❤️" },
];
const CHAT_FALLBACK = "I know DIY bowls + the 2-Year GROW Traineeship 🎓 Try 'mala level 3', 'how long is training?' or 'GROW'.";
function botReply(text){
  const t = text.toLowerCase();
  for (const item of CHAT_QA) {
    if (item.keys.some(k => t.includes(k))) return item.reply;
  }
  return CHAT_FALLBACK;
}
// Guided suggestions (Singtel-style): tap a chip to lead the chat.
// ★ To change chips, edit QUICK below: { label (button), ask (question sent) } ★
const QUICK = [
  { label:"🍜 Build a bowl", ask:"What do you recommend for first-timers?" },
  { label:"🎓 Traineeship", ask:"Tell me about the 2-Year Traineeship" },
  { label:"📍 Locations", ask:"Where are you located?" },
  { label:"🙏 Prayer", ask:"I want to request prayer" },
  { label:"📞 Contact", ask:"How do I contact you?" },
];
function initChat(){
  const f=$("#chatFab"), b=$("#chatbox"); if(!f||!b) return;
  f.onclick=()=>b.classList.toggle("open");
  const log=$("#chatlog");
  // build chips once, above the input
  if(!$("#quickReplies")){
    const bar=document.createElement("div");
    bar.className="quick-replies"; bar.id="quickReplies";
    bar.innerHTML=QUICK.map((q,i)=>`<button data-q="${i}">${q.label}</button>`).join("");
    b.insertBefore(bar, b.querySelector(".chatinput"));
    bar.addEventListener("click",e=>{
      const btn=e.target.closest("button"); if(!btn) return;
      if(!b.classList.contains("open")) b.classList.add("open");
      say(QUICK[+btn.dataset.q].ask);
    });
  }
  const say=(v)=>{
    v=(v||"").trim(); if(!v) return;
    log.insertAdjacentHTML("beforeend",`<div class="msg user">${v.replace(/</g,"&lt;")}</div>`);
    log.scrollTop=log.scrollHeight;
    setTimeout(()=>{ log.insertAdjacentHTML("beforeend",`<div class="msg bot">${botReply(v)}</div>`); log.scrollTop=log.scrollHeight; },350);
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
  }));
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
