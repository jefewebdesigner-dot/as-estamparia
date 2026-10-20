/* ==========================================================================
   AS ESTAMPARIA — Camada de dados, sincronização e painel administrativo
   ========================================================================== */

const AS_KEYS = {
  cart: "as_cart",
  favorites: "as_favorites",
  account: "as_account",
  users: "as_users",
  orders: "as_orders",
  coupons: "as_coupons",
  customProducts: "as_custom_products",
  deletedProducts: "as_deleted_products",
  productOverrides: "as_product_overrides",
  customGallery: "as_custom_gallery",
  customConfig: "as_custom_config",
  adminPass: "as_admin_pass",
  adminSession: "as_admin_session"
};

function readLS(key, fallback){
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch(e) {
    return fallback;
  }
}
function writeLS(key, value){
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch(e) {
    console.error("Erro ao salvar no localStorage (" + key + "):", e);
  }
}

/* ---------------------------------- API (servidor) -------------------------- */
const ADMIN_TOKEN_KEY = "as_admin_token";
const USER_TOKEN_KEY = "as_user_token";
const Api = {
  async request(path, { method = "GET", body, admin = false, timeout = 20000 } = {}){
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    const headers = {};
    if(body !== undefined) headers["Content-Type"] = "application/json";
    if(admin) headers["x-admin-token"] = sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
    const userToken = localStorage.getItem(USER_TOKEN_KEY);
    if(userToken) headers["x-user-token"] = userToken;
    let res, data;
    try {
      res = await fetch("/api/" + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, signal: ctrl.signal, cache: "no-store" });
      data = await res.json().catch(() => ({}));
    } catch(e) {
      throw new Error(e.name === "AbortError" ? "O servidor demorou para responder. Tente novamente." : "Sem conexão com o servidor. Verifique sua internet.");
    } finally {
      clearTimeout(timer);
    }
    if(res.status === 401 && admin){
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      document.dispatchEvent(new CustomEvent("as:admin-unauthorized"));
    }
    if(!res.ok || data.ok === false) throw new Error(data.error || "Erro ao comunicar com o servidor (" + res.status + ").");
    return data;
  }
};

/* Dados compartilhados (config, catálogo, galeria, cupons) vivem no servidor.
   O localStorage funciona só como cache para o site abrir rápido. */
const SHARED_KEYS = {
  customConfig: AS_KEYS.customConfig,
  customProducts: AS_KEYS.customProducts,
  deletedProducts: AS_KEYS.deletedProducts,
  productOverrides: AS_KEYS.productOverrides,
  customGallery: AS_KEYS.customGallery,
  coupons: AS_KEYS.coupons
};
const ServerSync = {
  loaded: false,
  serverKeys: [],
  localBefore: {}, // cópia do que este navegador tinha antes de sincronizar (usada na migração do painel)
  apply(state){
    ServerSync.serverKeys = Object.keys(state);
    Object.entries(SHARED_KEYS).forEach(([name, lsKey]) => {
      ServerSync.localBefore[name] = readLS(lsKey, null);
      if(name in state) writeLS(lsKey, state[name]);
      else localStorage.removeItem(lsKey);
    });
    ServerSync.loaded = true;
    if(window.refreshCatalog) window.refreshCatalog();
    if(window.refreshConfig) window.refreshConfig();
  },
  async load(){
    const fresh = location.pathname.includes("/admin") ? "?t=" + Date.now() : "";
    const data = await Api.request("estado" + fresh, { timeout: 8000 });
    ServerSync.apply(data.state || {});
  },
  /* Envia uma chave para o servidor (somente painel). Retorna Promise. */
  push(name){
    const value = readLS(SHARED_KEYS[name], null);
    return Api.request("estado", { method: "PUT", admin: true, body: { key: name, value } });
  }
};
window.AS_READY = (location.protocol === "file:" ? Promise.resolve() : ServerSync.load())
  .catch(err => console.warn("Usando dados em cache:", err.message))
  .then(() => document.dispatchEvent(new CustomEvent("as:data-synced")));

/* Envio de arquivos (artes, fotos). Imagens grandes são reduzidas antes. */
const FileUpload = {
  MAX_BYTES: 3 * 1024 * 1024,
  TYPES: { jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", webp:"image/webp", svg:"image/svg+xml", pdf:"application/pdf" },
  readAsDataURL(blob){
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
      r.readAsDataURL(blob);
    });
  },
  async uploadDataURL(dataUrl, name){
    const [head, data] = String(dataUrl).split(",");
    const type = (head.match(/^data:([^;]+)/) || [])[1] || "";
    const res = await Api.request("arquivos", { method: "POST", body: { name, type, data }, timeout: 60000 });
    return res.file;
  },
  async upload(file){
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    let type = FileUpload.TYPES[ext];
    if(!type) throw new Error("Formato não aceito: " + file.name + " (use JPG, PNG, PDF ou SVG).");
    let dataUrl;
    if(file.size > FileUpload.MAX_BYTES && ["image/jpeg","image/png","image/webp"].includes(type)){
      dataUrl = await ImageOptimizer.compressFile(file, 2400, 2400, 0.9);
    } else if(file.size > FileUpload.MAX_BYTES){
      throw new Error("Arquivo muito grande (máx. 3 MB): " + file.name + ". Envie pelo WhatsApp.");
    } else {
      dataUrl = await FileUpload.readAsDataURL(file);
      dataUrl = dataUrl.replace(/^data:[^;,]*/, "data:" + type);
    }
    return FileUpload.uploadDataURL(dataUrl, file.name);
  }
};

/* Registros enviados pelos clientes (contato, ideia, pedido). */
const Leads = {
  create(record){ return Api.request("registros", { method: "POST", body: record }); }
};

/* ---------------------------------- Carrinho ------------------------------- */
const Cart = {
  get(){ return readLS(AS_KEYS.cart, []); },
  save(items){ writeLS(AS_KEYS.cart, items); document.dispatchEvent(new CustomEvent("as:cart-changed")); },
  add(item){
    const items = Cart.get();
    const existing = items.find(i=>i.key===item.key);
    if(existing){ existing.qty += item.qty; }
    else{ items.push(item); }
    Cart.save(items);
  },
  updateQty(key, qty){
    let items = Cart.get();
    items = items.map(i=> i.key===key ? {...i, qty:Math.max(1,qty)} : i);
    Cart.save(items);
  },
  remove(key){ Cart.save(Cart.get().filter(i=>i.key!==key)); },
  clear(){ Cart.save([]); },
  count(){ return Cart.get().reduce((n,i)=>n+i.qty,0); }
};

/* ---------------------------------- Favoritos ------------------------------ */
const Favorites = {
  get(){ return readLS(AS_KEYS.favorites, []); },
  has(id){ return Favorites.get().includes(id); },
  toggle(id){
    let list = Favorites.get();
    if(list.includes(id)) list = list.filter(x=>x!==id);
    else list.push(id);
    writeLS(AS_KEYS.favorites, list);
    document.dispatchEvent(new CustomEvent("as:favorites-changed"));
    return list.includes(id);
  },
  count(){ return Favorites.get().length; }
};

/* ---------------------------------- Conta / Usuários ------------------------
   As contas ficam no servidor; o navegador guarda só o token da sessão e o
   nome/e-mail para exibir. */
const Account = {
  currentUser(){ return localStorage.getItem(USER_TOKEN_KEY) ? readLS(AS_KEYS.account, null) : null; },
  isLoggedIn(){ return !!Account.currentUser(); },
  _start(res){
    localStorage.setItem(USER_TOKEN_KEY, res.token);
    writeLS(AS_KEYS.account, res.user);
    return { ok:true, user:res.user };
  },
  async register(name, email, password, phone){
    try { return Account._start(await Api.request("contas", { method:"POST", body:{ action:"cadastro", name, email, password, phone } })); }
    catch(e) { return { ok:false, error:e.message }; }
  },
  async login(email, password){
    try { return Account._start(await Api.request("contas", { method:"POST", body:{ action:"login", email, password } })); }
    catch(e) { return { ok:false, error:e.message }; }
  },
  /* Dados e pedidos do cliente logado, direto do servidor. */
  async fetchAccount(){
    try {
      const res = await Api.request("contas");
      writeLS(AS_KEYS.account, res.user);
      return res;
    } catch(e) {
      if(/sess|Entre novamente/i.test(e.message)) Account.logout();
      throw e;
    }
  },
  logout(){ localStorage.removeItem(AS_KEYS.account); localStorage.removeItem(USER_TOKEN_KEY); }
};
// Contas antigas (salvas só no navegador, com senha em texto) não são mais usadas.
localStorage.removeItem(AS_KEYS.users);

/* ---------------------------------- Pedidos --------------------------------- */
const Orders = {
  all(){ return readLS(AS_KEYS.orders, []); },
  mine(){
    const user = Account.currentUser();
    if(!user) return [];
    return Orders.all().filter(o=>o.userId===user.id);
  },
  create(order){
    const orders = Orders.all();
    const user = Account.currentUser();
    const record = {
      id:"AS"+Date.now().toString().slice(-8),
      userId: user ? user.id : null,
      customerName: order.customerName || (user ? user.name : "Convidado"),
      date: new Date().toISOString(),
      items: order.items,
      notes: order.notes || "",
      status: "recebido",
      ...order
    };
    orders.unshift(record);
    writeLS(AS_KEYS.orders, orders);
    return record;
  },
  updateStatus(id, status){
    const orders = Orders.all().map(o=> o.id===id ? {...o, status} : o);
    writeLS(AS_KEYS.orders, orders);
  },
  delete(id){
    const orders = Orders.all().filter(o=>o.id!==id);
    writeLS(AS_KEYS.orders, orders);
  }
};
const ORDER_STAGES = ["recebido","producao","pronto","enviado"];
const ORDER_LABELS = {recebido:"Pedido recebido", producao:"Em produção", pronto:"Pronto", enviado:"Enviado / Entregue"};

/* ---------------------------------- Cupons ----------------------------------- */
const Coupons = {
  all(){ return readLS(AS_KEYS.coupons, []); },
  save(list){ writeLS(AS_KEYS.coupons, list); return ServerSync.push("coupons"); },
  add(code, percent){
    const list = Coupons.all();
    list.push({code:code.toUpperCase(), percent:Number(percent), active:true});
    return Coupons.save(list);
  },
  remove(code){ return Coupons.save(Coupons.all().filter(c=>c.code!==code)); },
  find(code){ return Coupons.all().find(c=>c.code===String(code).toUpperCase() && c.active); }
};

/* ---------------------------------- Autenticação do Admin --------------------
   A senha fica no servidor (com hash). O navegador guarda só um token de sessão. */
const AdminAuth = {
  async login(password){
    try {
      const res = await Api.request("admin", { method: "POST", body: { action: "login", password } });
      sessionStorage.setItem(ADMIN_TOKEN_KEY, res.token);
      return { ok: true };
    } catch(e) {
      return { ok: false, error: e.message };
    }
  },
  isAuthenticated(){
    return !!sessionStorage.getItem(ADMIN_TOKEN_KEY);
  },
  logout(){
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  },
  async changePassword(currentPass, newPass){
    if(!newPass || newPass.trim().length < 4){
      return { ok: false, error: "A nova senha deve ter pelo menos 4 caracteres." };
    }
    try {
      const res = await Api.request("admin", { method: "POST", body: { action: "senha", current: currentPass, next: newPass.trim() } });
      sessionStorage.setItem(ADMIN_TOKEN_KEY, res.token);
      return { ok: true };
    } catch(e) {
      return { ok: false, error: e.message };
    }
  }
};

/* ---------------------------------- Catálogo e Produtos (Admin) -------------- */
const CatalogStore = {
  getAll(includeHidden = true){
    if(window.refreshCatalog) window.refreshCatalog(includeHidden);
    return window.AS_PRODUCTS || [];
  },
  getById(id){
    if(window.refreshCatalog) window.refreshCatalog(true);
    return (window.AS_PRODUCTS || []).find(p=>p.id===id);
  },
  save(productData){
    const customList = readLS(AS_KEYS.customProducts, []);
    const deletedList = readLS(AS_KEYS.deletedProducts, []);
    const isEdit = !!productData.id;

    let id = productData.id;
    if(!id){
      // Gera ID limpo e amigável baseado no nome
      const baseSlug = (productData.name || "produto")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      id = baseSlug + "-" + Date.now().toString().slice(-4);
      productData.id = id;
      productData.createdAt = new Date().toISOString();
    }
    productData.updatedAt = new Date().toISOString();

    // Se estava na lista de deletados, remove de lá
    const newDeleted = deletedList.filter(dId => dId !== id);
    writeLS(AS_KEYS.deletedProducts, newDeleted);

    // Se já existe na lista customizada, atualiza; senão, adiciona
    const index = customList.findIndex(p => p.id === id);
    if(index >= 0){
      customList[index] = { ...customList[index], ...productData };
    } else {
      // Se é uma edição de um produto padrão do sistema, adiciona como custom
      customList.push(productData);
    }
    writeLS(AS_KEYS.customProducts, customList);

    if(window.refreshCatalog) window.refreshCatalog(true);
    document.dispatchEvent(new CustomEvent("as:catalog-changed", { detail: { id } }));
    return Promise.all([ServerSync.push("customProducts"), ServerSync.push("deletedProducts")]).then(() => productData);
  },
  delete(id){
    // Remove da lista de customizados
    let customList = readLS(AS_KEYS.customProducts, []);
    customList = customList.filter(p => p.id !== id);
    writeLS(AS_KEYS.customProducts, customList);

    // Adiciona à lista de deletados
    const deletedList = readLS(AS_KEYS.deletedProducts, []);
    if(!deletedList.includes(id)){
      deletedList.push(id);
      writeLS(AS_KEYS.deletedProducts, deletedList);
    }

    if(window.refreshCatalog) window.refreshCatalog(true);
    document.dispatchEvent(new CustomEvent("as:catalog-changed", { detail: { id, deleted: true } }));
    return Promise.all([ServerSync.push("customProducts"), ServerSync.push("deletedProducts")]);
  },
  toggleVisibility(id){
    const overrides = readLS(AS_KEYS.productOverrides, {});
    const p = CatalogStore.getById(id);
    if(!p) return;
    const currentHidden = overrides[id]?.hidden ?? !!p.hidden;
    overrides[id] = { ...(overrides[id] || {}), hidden: !currentHidden };
    writeLS(AS_KEYS.productOverrides, overrides);
    if(window.refreshCatalog) window.refreshCatalog(true);
    return ServerSync.push("productOverrides").then(() => !currentHidden);
  },
  toggleFeatured(id){
    const overrides = readLS(AS_KEYS.productOverrides, {});
    const p = CatalogStore.getById(id);
    if(!p) return;
    const currentFeatured = overrides[id]?.featured ?? !!p.featured;
    overrides[id] = { ...(overrides[id] || {}), featured: !currentFeatured };
    writeLS(AS_KEYS.productOverrides, overrides);
    if(window.refreshCatalog) window.refreshCatalog(true);
    return ServerSync.push("productOverrides").then(() => !currentFeatured);
  },
  duplicate(id){
    const original = CatalogStore.getById(id);
    if(!original) return null;
    const copy = JSON.parse(JSON.stringify(original));
    delete copy.id;
    copy.name = original.name + " (Cópia)";
    copy.featured = false;
    return CatalogStore.save(copy);
  },
  resetToDefaults(){
    localStorage.removeItem(AS_KEYS.customProducts);
    localStorage.removeItem(AS_KEYS.deletedProducts);
    localStorage.removeItem(AS_KEYS.productOverrides);
    if(window.refreshCatalog) window.refreshCatalog(true);
    document.dispatchEvent(new CustomEvent("as:catalog-changed", { detail: { reset: true } }));
    return Promise.all(["customProducts","deletedProducts","productOverrides"].map(ServerSync.push));
  }
};

/* ---------------------------------- Galeria / Portfólio (Admin) --------------- */
const GalleryStore = {
  getAll(){
    if(window.refreshCatalog) window.refreshCatalog(true);
    return window.AS_GALLERY || [];
  },
  add(item){
    const current = GalleryStore.getAll().slice();
    current.unshift(item);
    writeLS(AS_KEYS.customGallery, current);
    if(window.refreshCatalog) window.refreshCatalog(true);
    return ServerSync.push("customGallery");
  },
  remove(index){
    const current = GalleryStore.getAll().slice();
    current.splice(index, 1);
    writeLS(AS_KEYS.customGallery, current);
    if(window.refreshCatalog) window.refreshCatalog(true);
    return ServerSync.push("customGallery");
  },
  resetToDefaults(){
    localStorage.removeItem(AS_KEYS.customGallery);
    if(window.refreshCatalog) window.refreshCatalog(true);
    return ServerSync.push("customGallery");
  }
};

/* ---------------------------------- Configurações da Loja (Admin) ------------- */
const ConfigStore = {
  get(){
    if(window.refreshConfig) window.refreshConfig();
    return window.AS_CONFIG || {};
  },
  save(customConfig){
    writeLS(AS_KEYS.customConfig, customConfig);
    if(window.refreshConfig) window.refreshConfig();
    if(typeof applyContactInfo === "function") applyContactInfo();
    return ServerSync.push("customConfig").then(() => window.AS_CONFIG);
  },
  resetToDefaults(){
    localStorage.removeItem(AS_KEYS.customConfig);
    if(window.refreshConfig) window.refreshConfig();
    if(typeof applyContactInfo === "function") applyContactInfo();
    return ServerSync.push("customConfig");
  }
};

/* ---------------------------------- Compressor de Imagens --------------------- */
const ImageOptimizer = {
  compressFile(file, maxWidth = 1000, maxHeight = 1000, quality = 0.82){
    return new Promise((resolve, reject) => {
      if(!file || !file.type.startsWith("image/")){
        return reject(new Error("O arquivo selecionado não é uma imagem válida."));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Gera data URL comprimido em WebP ou JPEG
          let dataUrl;
          try {
            dataUrl = canvas.toDataURL("image/webp", quality);
            if(dataUrl.indexOf("data:image/webp") !== 0){
              dataUrl = canvas.toDataURL("image/jpeg", quality);
            }
          } catch(err) {
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Falha ao processar a imagem."));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Erro ao ler o arquivo de imagem."));
      reader.readAsDataURL(file);
    });
  }
};

/* ---------------------------------- Backup e Exportação ----------------------- */
const DataBackup = {
  exportFullJSON(){
    CatalogStore.getAll(true);
    const data = {
      exportDate: new Date().toISOString(),
      brand: "AS Estamparia",
      config: readLS(AS_KEYS.customConfig, {}),
      products: readLS(AS_KEYS.customProducts, []),
      deletedProducts: readLS(AS_KEYS.deletedProducts, []),
      productOverrides: readLS(AS_KEYS.productOverrides, []),
      gallery: readLS(AS_KEYS.customGallery, []),
      coupons: readLS(AS_KEYS.coupons, []),
      orders: readLS(AS_KEYS.orders, [])
    };
    return JSON.stringify(data, null, 2);
  },
  importFullJSON(jsonString){
    try {
      const data = JSON.parse(jsonString);
      if(data.config) writeLS(AS_KEYS.customConfig, data.config);
      if(data.products) writeLS(AS_KEYS.customProducts, data.products);
      if(data.deletedProducts) writeLS(AS_KEYS.deletedProducts, data.deletedProducts);
      if(data.productOverrides) writeLS(AS_KEYS.productOverrides, data.productOverrides);
      if(data.gallery) writeLS(AS_KEYS.customGallery, data.gallery);
      if(data.coupons) writeLS(AS_KEYS.coupons, data.coupons);
      if(data.orders) writeLS(AS_KEYS.orders, data.orders);

      if(window.refreshCatalog) window.refreshCatalog(true);
      if(window.refreshConfig) window.refreshConfig();
      return Promise.all(Object.keys(SHARED_KEYS).map(ServerSync.push)).then(() => ({ ok: true }));
    } catch(e) {
      return { ok: false, error: "Arquivo de backup inválido ou corrompido: " + e.message };
    }
  },
  generateProductsJS(){
    const products = CatalogStore.getAll(false);
    const gallery = GalleryStore.getAll();
    const categories = window.AS_DEFAULT_CATEGORIES || [];
    const occasions = window.AS_DEFAULT_OCCASIONS || [];

    return `/* Catálogo exportado em ${new Date().toLocaleString("pt-BR")} */\n` +
      `window.AS_DEFAULT_CATEGORIES = ${JSON.stringify(categories, null, 2)};\n` +
      `window.AS_CATEGORIES = window.AS_DEFAULT_CATEGORIES.slice();\n\n` +
      `window.AS_DEFAULT_OCCASIONS = ${JSON.stringify(occasions, null, 2)};\n` +
      `window.AS_OCCASIONS = window.AS_DEFAULT_OCCASIONS.slice();\n\n` +
      `window.AS_DEFAULT_PRODUCTS = ${JSON.stringify(products, null, 2)};\n\n` +
      `window.AS_DEFAULT_GALLERY = ${JSON.stringify(gallery, null, 2)};\n\n` +
      `window.refreshCatalog = function(includeHidden = false){\n` +
      `  try {\n` +
      `    const customList = JSON.parse(localStorage.getItem("as_custom_products") || "[]");\n` +
      `    const deletedList = JSON.parse(localStorage.getItem("as_deleted_products") || "[]");\n` +
      `    const overrides = JSON.parse(localStorage.getItem("as_product_overrides") || "{}");\n` +
      `    const productMap = new Map();\n` +
      `    window.AS_DEFAULT_PRODUCTS.forEach(p => { if (!deletedList.includes(p.id)) productMap.set(p.id, { ...p, ...(overrides[p.id]||{}) }); });\n` +
      `    customList.forEach(cp => { if (!deletedList.includes(cp.id)) productMap.set(cp.id, { ...cp, ...(overrides[cp.id]||{}) }); });\n` +
      `    let merged = Array.from(productMap.values());\n` +
      `    if (!includeHidden) merged = merged.filter(p => !p.hidden);\n` +
      `    window.AS_PRODUCTS = merged;\n` +
      `    const customGallery = JSON.parse(localStorage.getItem("as_custom_gallery") || "null");\n` +
      `    window.AS_GALLERY = customGallery || window.AS_DEFAULT_GALLERY.slice();\n` +
      `  } catch(e) {\n` +
      `    window.AS_PRODUCTS = window.AS_DEFAULT_PRODUCTS.slice();\n` +
      `    window.AS_GALLERY = window.AS_DEFAULT_GALLERY.slice();\n` +
      `  }\n` +
      `};\n` +
      `window.refreshCatalog();\n` +
      `function getProductById(id){ return window.AS_PRODUCTS.find(p=>p.id===id); }\n` +
      `function getCategory(slug){ return window.AS_CATEGORIES.find(c=>c.slug===slug); }\n` +
      `function productsByCategory(slug){ return window.AS_PRODUCTS.filter(p=>p.category===slug); }\n` +
      `function featuredProducts(){ return window.AS_PRODUCTS.filter(p=>p.featured); }\n`;
  },
  generateConfigJS(){
    const cfg = ConfigStore.get();
    return `/* Configuração exportada em ${new Date().toLocaleString("pt-BR")} */\n` +
      `window.AS_DEFAULT_CONFIG = ${JSON.stringify(cfg, null, 2)};\n` +
      `function refreshConfig(){\n` +
      `  try {\n` +
      `    const custom = JSON.parse(localStorage.getItem("as_custom_config") || "{}");\n` +
      `    window.AS_CONFIG = { ...window.AS_DEFAULT_CONFIG, ...custom };\n` +
      `  } catch(e) { window.AS_CONFIG = { ...window.AS_DEFAULT_CONFIG }; }\n` +
      `}\n` +
      `refreshConfig();\n` +
      `function waLink(message){\n` +
      `  const num = (window.AS_CONFIG && window.AS_CONFIG.whatsappNumber ? window.AS_CONFIG.whatsappNumber : "").replace(/\\D/g,"");\n` +
      `  const text = encodeURIComponent(message || (window.AS_CONFIG && window.AS_CONFIG.waDefaultMessage) || "Olá!");\n` +
      `  if(!num) return null;\n` +
      `  return "https://wa.me/" + num + "?text=" + text;\n` +
      `}\n` +
      `function formatPlaceholder(value, label){\n` +
      `  return value && value.trim() ? value : "[" + label + " a definir]";\n` +
      `}\n`;
  }
};

