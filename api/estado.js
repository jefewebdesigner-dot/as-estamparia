/* Dados compartilhados do site: configurações, catálogo, galeria e cupons.
   GET  → público (lido por todas as páginas)
   PUT  → painel administrativo ({ key, value }) */
import { sql, send, fail, requireAdmin } from "./_lib.js";

const KEYS = ["customConfig", "customProducts", "deletedProducts", "productOverrides", "customGallery", "coupons"];

export default async function handler(req, res){
  try {
    if(req.method === "GET"){
      const rows = await sql`select key, value from as_kv where key = any(${KEYS})`;
      const state = {};
      rows.forEach(r => { state[r.key] = r.value; });
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=5, stale-while-revalidate=10");
      return send(res, 200, { ok:true, state });
    }

    if(req.method === "PUT"){
      if(!(await requireAdmin(req, res))) return;
      const { key, value } = req.body || {};
      if(!KEYS.includes(key)) return send(res, 400, { ok:false, error:"Chave inválida." });
      if(value === null || value === undefined){
        await sql`delete from as_kv where key = ${key}`;
      } else {
        await sql`insert into as_kv (key, value, updated_at) values (${key}, ${JSON.stringify(value)}::jsonb, now())
                  on conflict (key) do update set value = excluded.value, updated_at = now()`;
      }
      return send(res, 200, { ok:true });
    }

    res.setHeader("Allow", "GET, PUT");
    send(res, 405, { ok:false, error:"Método não permitido." });
  } catch(err) {
    fail(res, err);
  }
}
