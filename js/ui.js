/* ==========================================================================
   AS ESTAMPARIA — Componentes de interface compartilhados
   ========================================================================== */

const Icons = {
  heart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`,
  heartFill:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`,
  cart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 2.5h3l2.7 12.9a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6l1.3-7.4H6.2"/></svg>`,
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  user:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.6-4 5-6 8-6s6.4 2 8 6"/></svg>`,
  menu:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  close:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  whatsapp:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5S9.4 7.8 9.2 7.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.6-.3Z"/><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>`,
  upload:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 5 5L20 6"/></svg>`,
  trash:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-.8 12.2A2 2 0 0 1 16.2 21H7.8a2 2 0 0 1-2-1.8L5 7"/></svg>`,
  star:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l3 6.3 6.8.9-5 4.8 1.3 6.8L12 17.9 5.9 21.3l1.3-6.8-5-4.8 6.8-.9Z"/></svg>`,
  pin:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  mail:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  spark:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>`,
  brush:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 14.5 3 21l1-6L17.5 1.5a2.1 2.1 0 0 1 3 3L9.5 15Z"/></svg>`,
  chat:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1-5.3a8.4 8.4 0 0 1-.9-3.8A8.4 8.4 0 0 1 12 2a8.5 8.5 0 0 1 9 8.5Z"/></svg>`,
  truck:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h13v13H1zM14 8h4l4 4v4h-8z"/><circle cx="5.5" cy="18.5" r="1.7"/><circle cx="17.5" cy="18.5" r="1.7"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5Z"/></svg>`,
  file:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>`,
  gift:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 9h18M12 9v12"/><path d="M12 9C9 9 7.5 7.8 7.5 6.2 7.5 4.9 8.5 4 9.7 4 11.3 4 12 6.5 12 9Zm0 0c3 0 4.5-1.2 4.5-2.8C16.5 4.9 15.5 4 14.3 4 12.7 4 12 6.5 12 9Z"/></svg>`
};

/* Ilustrações de categoria (quando não há foto real do produto) */
const CategoryArt = {
  tshirt:`<path d="M31 20 47 12l6 8 8-4 12 12-9 8v29H27V36l-9-8 12-12 6 4Z"/>`,
  mug:`<path d="M22 27h34v25a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10V27Z"/><path d="M56 33h6a8 8 0 0 1 0 16h-6"/><path d="M32 20h14"/>`,
  cup:`<path d="M27 22h30l-4 40a4 4 0 0 1-4 3.6H35a4 4 0 0 1-4-3.6Z"/><path d="M27 22h30"/><path d="M33 33h18"/>`,
  frame:`<rect x="20" y="16" width="44" height="52" rx="3"/><path d="M28 54l10-12 8 8 10-14 8 18" fill="none"/><circle cx="34" cy="30" r="4"/>`,
  bag:`<path d="M25 30h34l-4 38H29Z"/><path d="M32 30v-6a10 10 0 0 1 20 0v6"/>`,
  cap:`<path d="M18 44a24 24 0 0 1 48 0Z"/><path d="M66 44c8 1 12 4 12 7-8 3-38 3-46 0-6-2-10-4-10-4"/><circle cx="42" cy="30" r="2.6"/>`,
  paw:`<circle cx="30" cy="30" r="6"/><circle cx="54" cy="30" r="6"/><circle cx="22" cy="46" r="5.5"/><circle cx="62" cy="46" r="5.5"/><path d="M42 44c10 0 16 8 16 15 0 6-5 9-11 9-4 0-6-2-9-2s-5 2-9 2c-6 0-11-3-11-9 0-7 6-15 16-15Z"/>`,
  gift:`<rect x="18" y="34" width="48" height="34" rx="2"/><path d="M18 46h48"/><path d="M42 34v34"/><path d="M42 34c-4-10-24-10-20-1 2 4 12 3 20 1Zm0 0c4-10 24-10 20-1-2 4-12 3-20 1Z"/>`,
  briefcase:`<rect x="16" y="30" width="52" height="34" rx="4"/><path d="M32 30v-6a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v6"/><path d="M16 44h52"/><rect x="36" y="40" width="12" height="8" rx="1"/>`
};
function categoryArtSVG(key, size=84){
  const path = CategoryArt[key] || CategoryArt.gift;
  return `<svg width="${size}" height="${size}" viewBox="0 0 84 84" fill="none" stroke="var(--roxo-escuro)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <circle cx="42" cy="42" r="40" fill="var(--turquesa-claro)" stroke="none" opacity=".55"/>
    <g fill="var(--branco)">${path}</g>
  </svg>`;
}

const OccasionIcon = {
  cake:`<path d="M4 21h16v-7H4Z"/><path d="M4 14v-3h16v3"/><path d="M8 11V7M12 11V6M16 11V7"/><circle cx="12" cy="3.2" r="1"/>`,
  flower:`<circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm14 0a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"/>`,
  tie:`<path d="M9 4h6l1 4-4 3-4-3Z"/><path d="M10 11h4l3 8-5 3-5-3Z"/>`,
  heart:`<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>`,
  snow:`<path d="M12 2v20M4.2 7l15.6 10M4.2 17 19.8 7"/>`,
  rings:`<circle cx="9" cy="13" r="5"/><circle cx="15" cy="13" r="5"/>`,
  "cap-grad":`<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>`,
  tag:`<path d="M20.6 12.7 12.7 20.6a2 2 0 0 1-2.8 0l-7.5-7.5a2 2 0 0 1 0-2.8L10.3 2.4 20.6 9.9Z"/><circle cx="8.5" cy="7.5" r="1.5"/>`,
  star:Icons.star.match(/<path[^>]*>/)[0],
  book:`<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 0-2 2Z"/><path d="M12 3h6a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2h-6Z"/>`
};
function occasionIconSVG(key){
  const path = OccasionIcon[key] || OccasionIcon.star;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

/* ---------------------------------- Toast ------------------------------------ */
function toast(message, type=""){
  let stack = document.getElementById("toast-stack");
  if(!stack){
    stack = document.createElement("div");
    stack.id = "toast-stack";
    document.body.appendChild(stack);
  }
  const el = document.createElement("div");
  el.className = "toast" + (type ? " " + type : "");
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transition="opacity .3s"; setTimeout(()=>el.remove(),300); }, 2800);
}

/* ---------------------------------- WhatsApp helper --------------------------- */
function goToWhatsApp(message){
  const link = waLink(message);
  if(!link){
    toast("Configure o número de WhatsApp em js/config.js para ativar este botão.");
    return;
  }
  window.open(link, "_blank");
}

/* ---------------------------------- Header / Nav ------------------------------ */
function initHeader(){
  const hamburger = document.querySelector("[data-hamburger]");
  const nav = document.querySelector("[data-main-nav]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  function closeNav(){ nav?.classList.remove("open"); backdrop?.classList.remove("open"); }
  hamburger?.addEventListener("click", ()=>{
    nav?.classList.toggle("open"); backdrop?.classList.toggle("open");
  });
  backdrop?.addEventListener("click", closeNav);
  document.querySelectorAll("[data-main-nav] a").forEach(a=>a.addEventListener("click", closeNav));

  const searchBtn = document.querySelector("[data-search-toggle]");
  const searchPanel = document.querySelector("[data-search-panel]");
  searchBtn?.addEventListener("click", ()=>{
    searchPanel?.classList.toggle("open");
    if(searchPanel?.classList.contains("open")) searchPanel.querySelector("input")?.focus();
  });
  const searchForm = document.querySelector("[data-search-form]");
  searchForm?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const q = searchForm.querySelector("input").value.trim();
    window.location.href = "produtos.html" + (q ? "?busca=" + encodeURIComponent(q) : "");
  });

  updateHeaderCounts();
  document.addEventListener("as:cart-changed", updateHeaderCounts);
  document.addEventListener("as:favorites-changed", updateHeaderCounts);

  // active link highlight
  const page = document.body.getAttribute("data-page");
  if(page){
    document.querySelectorAll("[data-main-nav] a[data-nav]").forEach(a=>{
      if(a.getAttribute("data-nav")===page) a.classList.add("active");
    });
  }

  initBackToTop();
}

function updateHeaderCounts(){
  document.querySelectorAll("[data-cart-count]").forEach(el=>{
    const n = Cart.count(); el.textContent = n; el.style.display = n>0 ? "flex":"none";
  });
  document.querySelectorAll("[data-fav-count]").forEach(el=>{
    const n = Favorites.count(); el.textContent = n; el.style.display = n>0 ? "flex":"none";
  });
}

function initBackToTop(){
  const btn = document.getElementById("back-top");
  if(!btn) return;
  window.addEventListener("scroll", ()=>{
    btn.classList.toggle("show", window.scrollY > 600);
  });
  btn.addEventListener("click", ()=>window.scrollTo({top:0, behavior:"smooth"}));
}

/* ---------------------------------- Cards ------------------------------------- */
function productMediaHTML(p, size=84){
  if(p.image) return `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
  return `<div class="cat-icon-wrap">${categoryArtSVG(p.icon, size)}</div>`;
}

function productCardHTML(p){
  const cat = getCategory(p.category);
  const isFav = Favorites.has(p.id);
  const hasPrice = p.price !== undefined && p.price !== null && p.price !== "" && !isNaN(p.price) && Number(p.price) > 0;
  const priceHTML = hasPrice
    ? `A partir de R$ ${Number(p.price).toFixed(2).replace('.', ',')}<small>Valor base personalizável</small>`
    : `Sob consulta<small>Valor calculado conforme personalização</small>`;

  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-media">
      <button class="fav-toggle ${isFav?'active':''}" data-fav="${p.id}" aria-label="Favoritar">${isFav?Icons.heartFill:Icons.heart}</button>
      <a href="produto.html?id=${p.id}">${productMediaHTML(p,90)}</a>
      ${p.featured ? `<span class="badge-featured" title="Destaque">★</span>` : ""}
    </div>
    <div class="product-body">
      <span class="product-cat">${cat?cat.name:''}</span>
      <h3><a href="produto.html?id=${p.id}">${p.name}</a></h3>
      <div class="product-price">${priceHTML}</div>
      <div class="product-actions">
        <a class="btn btn-sm btn-block" href="produto.html?id=${p.id}">Personalizar</a>
      </div>
    </div>
  </article>`;
}

function categoryCardHTML(c){
  const media = c.image ? `<img src="${c.image}" alt="${c.name}" loading="lazy">` : `<div class="cat-icon-wrap">${categoryArtSVG(c.icon,96)}</div>`;
  return `
  <article class="cat-card">
    <a class="cat-media" href="produtos.html?categoria=${c.slug}">${media}</a>
    <div class="cat-body">
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <a class="link-arrow" href="produtos.html?categoria=${c.slug}">Ver produtos →</a>
    </div>
  </article>`;
}

function renderGrid(container, items, htmlFn){
  if(!container) return;
  if(!items.length){
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="ic">${Icons.search}</div>
      <h3>Nada por aqui ainda</h3>
      <p>Tente outra categoria ou fale com a gente pelo WhatsApp.</p>
    </div>`;
    return;
  }
  container.innerHTML = items.map(htmlFn).join("");
}

function wireFavButtons(root=document){
  root.querySelectorAll("[data-fav]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.preventDefault(); e.stopPropagation();
      const id = btn.getAttribute("data-fav");
      const active = Favorites.toggle(id);
      btn.classList.toggle("active", active);
      btn.innerHTML = active ? Icons.heartFill : Icons.heart;
      toast(active ? "Adicionado aos favoritos" : "Removido dos favoritos");
    });
  });
}

/* ---------------------------------- FAQ accordion ------------------------------ */
function initFaq(root=document){
  root.querySelectorAll(".faq-item").forEach(item=>{
    const q = item.querySelector(".faq-q");
    q?.addEventListener("click", ()=>{
      const wasOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item").forEach(i=>i.classList.remove("open"));
      if(!wasOpen) item.classList.add("open");
    });
  });
}

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {day:"2-digit", month:"short", year:"numeric"});
}

/* ---------------------------------- Dados de contato / footer ------------------ */
function applyContactInfo(){
  const c = window.AS_CONFIG;
  const map = {
    address: formatPlaceholder(c.address, "Endereço"),
    whatsapp: c.whatsappNumber ? "Fale conosco" : "[WhatsApp a definir]",
    email: formatPlaceholder(c.email, "E-mail"),
    hours: formatPlaceholder(c.hours, "Horário de atendimento"),
    instagram: formatPlaceholder(c.instagram, "Instagram"),
    payment: formatPlaceholder(c.paymentMethods, "Formas de pagamento"),
    delivery: formatPlaceholder(c.deliveryInfo, "Entrega")
  };
  document.querySelectorAll("[data-info]").forEach(el=>{
    const key = el.getAttribute("data-info");
    if(map[key]) el.textContent = map[key];
  });
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const igLink = document.querySelector("[data-instagram-link]");
  if(igLink && c.instagram){ igLink.href = "https://instagram.com/" + c.instagram.replace(/^@/, ""); }

  document.querySelectorAll("[data-wa-btn]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      if(btn.tagName==="A") e.preventDefault();
      goToWhatsApp(btn.getAttribute("data-wa-msg") || undefined);
    });
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  initHeader();
  wireFavButtons();
  initFaq();
  applyContactInfo();
});
