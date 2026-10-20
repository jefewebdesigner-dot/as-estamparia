/* Contas de clientes (página "Minha conta").
   POST { action:"cadastro", name, email, password, phone? } → { ok, token, user }
   POST { action:"login", email, password }                  → { ok, token, user }
   GET  (header x-user-token)                                → { ok, user, orders }  (só os pedidos do próprio cliente)
   GET  ?lista=1 (header x-admin-token)                      → { ok, items }         (painel: clientes cadastrados) */
import crypto from "node:crypto";
import { sql, send, fail, clip, requireAdmin, customerHash, customerToken, customerFromRequest } from "./_lib.js";

const publicUser = u => ({ id:Number(u.id), name:u.name, email:u.email, phone:u.phone || "" });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res){
  try {
    if(req.method === "POST"){
      const b = req.body || {};
      const email = clip(b.email, 160).toLowerCase();
      const password = String(b.password || "");

      if(b.action === "cadastro"){
        const name = clip(b.name, 120);
        if(!name) return send(res, 400, { ok:false, error:"Informe seu nome." });
        if(!EMAIL_RE.test(email)) return send(res, 400, { ok:false, error:"Informe um e-mail válido." });
        if(password.length < 6) return send(res, 400, { ok:false, error:"A senha precisa ter pelo menos 6 caracteres." });
        const salt = crypto.randomBytes(16).toString("hex");
        const rows = await sql`insert into as_customers (name, email, phone, salt, hash)
          values (${name}, ${email}, ${clip(b.phone, 40)}, ${salt}, ${customerHash(password, salt)})
          on conflict (email) do nothing returning *`;
        if(!rows.length) return send(res, 409, { ok:false, error:"Já existe uma conta com este e-mail. Use \"Entrar\"." });
        return send(res, 200, { ok:true, token: await customerToken(rows[0].id), user: publicUser(rows[0]) });
      }

      if(b.action === "login"){
        const rows = await sql`select * from as_customers where email = ${email}`;
        const u = rows[0];
        if(!u || customerHash(password, u.salt) !== u.hash){
          return send(res, 401, { ok:false, error:"E-mail ou senha inválidos." });
        }
        return send(res, 200, { ok:true, token: await customerToken(u.id), user: publicUser(u) });
      }

      return send(res, 400, { ok:false, error:"Ação inválida." });
    }

    if(req.method === "GET"){
      if(req.query.lista){
        if(!(await requireAdmin(req, res))) return;
        const items = await sql`select c.id, c.name, c.email, c.phone, c.created_at,
            (select count(*) from as_leads l where l.customer_id = c.id and l.kind = 'pedido') as pedidos
          from as_customers c order by c.created_at desc limit 1000`;
        return send(res, 200, { ok:true, items: items.map(i => ({ ...i, id:Number(i.id), pedidos:Number(i.pedidos) })) });
      }

      const id = await customerFromRequest(req);
      if(!id) return send(res, 401, { ok:false, error:"Sua sessão expirou. Entre novamente." });
      const users = await sql`select * from as_customers where id = ${id}`;
      if(!users.length) return send(res, 401, { ok:false, error:"Conta não encontrada. Entre novamente." });
      const orders = await sql`select id, subject, data, status, created_at from as_leads
        where customer_id = ${id} and kind = 'pedido' order by created_at desc limit 100`;
      return send(res, 200, { ok:true, user: publicUser(users[0]), orders: orders.map(o => ({
        id: (o.data && o.data.orderId) || ("#" + o.id),
        date: o.created_at,
        status: o.status,
        items: (o.data && o.data.items) || []
      })) });
    }

    res.setHeader("Allow", "GET, POST");
    send(res, 405, { ok:false, error:"Método não permitido." });
  } catch(err) {
    fail(res, err);
  }
}
