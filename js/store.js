/* ==========================================================================
   AS ESTAMPARIA — Camada de dados local (protótipo front-end)
   -----------------------------------------------------------------------
   Carrinho, favoritos, conta, pedidos e cupons ficam salvos no
   localStorage do navegador. Isso é suficiente para demonstrar todo o
   fluxo da loja, mas para produção real (pagamentos, estoque, múltiplos
   dispositivos) é necessário conectar um backend/e-commerce de verdade.
   ========================================================================== */

const AS_KEYS = {
  cart:"as_cart", favorites:"as_favorites", account:"as_account",
  users:"as_users", orders:"as_orders", coupons:"as_coupons"
};

function readLS(key, fallback){
  try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch(e){ return fallback; }
}
function writeLS(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

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

/* ---------------------------------- Conta / usuários ------------------------ */
const Account = {
  currentUser(){ return readLS(AS_KEYS.account, null); },
  isLoggedIn(){ return !!Account.currentUser(); },
  register(name, email, password){
    const users = readLS(AS_KEYS.users, []);
    if(users.some(u=>u.email===email)){ return {ok:false, error:"Já existe uma conta com este e-mail."}; }
    const user = {id:"u_"+Date.now(), name, email, password};
    users.push(user);
    writeLS(AS_KEYS.users, users);
    writeLS(AS_KEYS.account, {id:user.id, name, email});
    return {ok:true};
  },
  login(email, password){
    const users = readLS(AS_KEYS.users, []);
    const user = users.find(u=>u.email===email && u.password===password);
    if(!user) return {ok:false, error:"E-mail ou senha inválidos."};
    writeLS(AS_KEYS.account, {id:user.id, name:user.name, email:user.email});
    return {ok:true};
  },
  logout(){ localStorage.removeItem(AS_KEYS.account); }
};

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
  }
};
const ORDER_STAGES = ["recebido","producao","pronto","enviado"];
const ORDER_LABELS = {recebido:"Pedido recebido", producao:"Em produção", pronto:"Pronto", enviado:"Enviado / Entregue"};

/* ---------------------------------- Cupons ----------------------------------- */
const Coupons = {
  all(){ return readLS(AS_KEYS.coupons, []); },
  save(list){ writeLS(AS_KEYS.coupons, list); },
  add(code, percent){
    const list = Coupons.all();
    list.push({code:code.toUpperCase(), percent:Number(percent), active:true});
    Coupons.save(list);
  },
  remove(code){ Coupons.save(Coupons.all().filter(c=>c.code!==code)); },
  find(code){ return Coupons.all().find(c=>c.code===String(code).toUpperCase() && c.active); }
};
