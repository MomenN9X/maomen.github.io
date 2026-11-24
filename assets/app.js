(function(){
"use strict";
var WA = "https://wa.me/201008281567?text=" + encodeURIComponent("أهلاً مؤمن، شفت موقعك وعندي مشروع محتاج هوية بصرية.");
document.querySelectorAll("[data-wa]").forEach(function(a){ a.href = WA; });
document.getElementById("year").textContent = new Date().getFullYear();

var ROLE = {
  Branding: "تصميم الهوية البصرية كاملة: الشعار، النظام البصري، الألوان والخطوط، والتطبيقات.",
  Packaging: "تصميم الهوية البصرية والتغليف.",
  UI: "تصميم الهوية وواجهة الاستخدام.",
  Web: "تصميم واجهة الموقع وتجربته."
};
var OUT = {
  Branding: ["الشعار","النظام البصري","الألوان والخطوط","تطبيقات الهوية"],
  Packaging: ["الشعار","النظام البصري","تصميم العبوة","المطبوعات"],
  UI: ["الشعار","واجهة الاستخدام","تجربة المستخدم"],
  Web: ["تصميم الواجهات","تجربة المستخدم","نظام بصري للموقع"]
};
var ROLE_SHORT = {
  Branding: "تصميم هوية بصرية",
  Packaging: "تصميم هوية وتغليف",
  UI: "تصميم هوية وواجهات",
  Web: "تصميم موقع"
};
function byId(id){ return PROJECTS.find(function(p){ return p.id===id; }); }
function esc(s){ var d=document.createElement("div"); d.textContent=s; return d.innerHTML; }

/* featured cards */
var fg = document.getElementById("featuredGrid");
fg.innerHTML = FEATURED.map(function(id){
  var p = byId(id); if(!p) return "";
  return '<article class="card rev" data-p="'+p.id+'" tabindex="0" role="button" aria-label="شاهد مشروع '+esc(p.short)+'">'
    +'<div class="card-img"><img src="assets/'+p.cover+'" alt="مشروع '+esc(p.name)+'" loading="lazy" decoding="async"/></div>'
    +'<div class="card-body"><div class="card-top"><span class="card-name">'+esc(p.short)+'</span><span class="tag">'+p.catAr+'</span></div>'
    +(p.idea?'<p class="card-idea">'+p.idea+'</p>':'')
    +'<p class="card-role">الدور: '+ROLE_SHORT[p.cat]+'</p>'
    +'<span class="card-link">شاهد المشروع <span class="arr">←</span></span></div></article>';
}).join("");

/* archive grid */
var ag = document.getElementById("archiveGrid");
ag.innerHTML = PROJECTS.map(function(p){
  return '<article class="mini rev" data-p="'+p.id+'" data-cat="'+p.cat+'" tabindex="0" role="button" aria-label="شاهد مشروع '+esc(p.short)+'">'
    +'<div class="mini-img"><img src="assets/'+p.mini+'" alt="مشروع '+esc(p.name)+'" loading="lazy" decoding="async"/></div>'
    +'<div class="mini-body"><span class="mini-name">'+esc(p.short)+'</span><span class="mini-cat">'+p.catAr+'</span></div></article>';
}).join("");

/* filters */
document.getElementById("filters").addEventListener("click", function(e){
  var b = e.target.closest(".chip"); if(!b) return;
  document.querySelectorAll("#filters .chip").forEach(function(c){ c.classList.toggle("on", c===b); });
  var f = b.dataset.f;
  document.querySelectorAll("#archiveGrid .mini").forEach(function(m){
    m.classList.toggle("hide", f!=="all" && m.dataset.cat!==f);
  });
});

/* modal */
var modal = document.getElementById("modal"), mBody = document.getElementById("modalBody"), lastFocus=null;
function openProject(id){
  var p = byId(id); if(!p) return;
  var chips = (OUT[p.cat]||[]).map(function(c){ return "<span>"+c+"</span>"; }).join("");
  var gal = p.imgs.map(function(im){ return '<img src="assets/'+im+'" alt="من مشروع '+esc(p.short)+'" loading="lazy" decoding="async"/>'; }).join("");
  mBody.innerHTML =
    '<div class="m-hero"><img src="assets/'+p.cover+'" alt="غلاف مشروع '+esc(p.short)+'"/></div>'
    +'<div class="m-info"><div class="m-top"><span class="m-title" id="mTitle">'+esc(p.short)+'</span><span class="tag">'+p.catAr+'</span><span class="mini-cat">'+esc(p.label)+'</span></div>'
    +(p.idea?'<p class="m-idea">'+p.idea+'</p>':'')
    +'<div class="m-block"><h4>دوري في المشروع</h4><p>'+ROLE[p.cat]+'</p></div>'
    +'<div class="m-block"><h4>المخرجات</h4><div class="m-chips">'+chips+'</div></div>'
    +'<div class="m-actions"><a class="btn btn-solid btn-sm" href="'+p.url+'" target="_blank" rel="noopener">دراسة الحالة كاملة على Behance ↗</a></div></div>'
    +'<div class="m-gal">'+gal+'</div>';
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-x").focus();
}
function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = "";
  if(lastFocus && lastFocus.focus) lastFocus.focus();
}
document.addEventListener("click", function(e){
  var card = e.target.closest("[data-p]");
  if(card){ openProject(card.dataset.p); return; }
  if(e.target.closest("[data-close]")) closeModal();
});
document.addEventListener("keydown", function(e){
  if(e.key==="Escape" && !modal.hidden) closeModal();
  if((e.key==="Enter"||e.key===" ") && e.target.matches("[data-p]")){ e.preventDefault(); openProject(e.target.dataset.p); }
});


/* deep link: #p-<id> opens the project */
if(location.hash.indexOf("#p-")===0){
  var pid = location.hash.slice(3);
  if(byId(pid)) openProject(pid);
}

/* mobile menu */
var menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
menuBtn.addEventListener("click", function(){
  var open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
});
nav.addEventListener("click", function(e){
  if(e.target.tagName==="A"){ nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false"); }
});

/* reveal on scroll */
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
},{threshold:.12, rootMargin:"0px 0px -6% 0px"});
document.querySelectorAll(".rev").forEach(function(el){ io.observe(el); });
})();
