/* Contatos, ideias de personalização e pedidos enviados pelos clientes.
   POST                 → público: cadastra um registro
   GET ?kind=           → painel: lista registros
   PATCH { id, status } → painel: atualiza status
   DELETE ?id=          → painel: remove */
import { sql, send, fail, requireAdmin, clip, customerFromRequest } from "./_lib.js";

const KINDS = ["contato", "ideia", "produto", "pedido"];

function cleanFiles(files){
  if(!Array.isArray(files)) return [];
  return files.slice(0, 10).map(f => ({ name:clip(f && f.name, 160), url:clip(f && f.url, 200) }))
    .filter(f => f.url.startsWith("/api/arquivos?id="));
}

export default async function handler(req, res){
  try {
    if(req.method === "POST"){
      const b = req.body || {};
      if(b.website) return send(res, 200, { ok:true }); // honeypot anti-spam
      const kind = KINDS.includes(b.kind) ? b.kind : "contato";
      const name = clip(b.name, 120);
      const phone = clip(b.phone, 40);
      if(!name || !phone) return send(res, 400, { ok:false, error:"Informe nome e WhatsApp/telefone." });
      const data = b.data && typeof b.data === "object" ? b.data : {};
      const dataJson = JSON.stringify(data);
      if(dataJson.length > 20000) return send(res, 400, { ok:false, error:"Dados do pedido muito longos." });

      const customerId = await customerFromRequest(req); // pedido feito com a conta logada
      const rows = await sql`insert into as_leads (kind, name, phone, email, subject, message, data, files, customer_id)
        values (${kind}, ${name}, ${phone}, ${clip(b.email, 160)}, ${clip(b.subject, 160)}, ${clip(b.message, 4000)},
                ${dataJson}::jsonb, ${JSON.stringify(cleanFiles(b.files))}::jsonb, ${customerId})
        returning id, created_at`;
      return send(res, 200, { ok:true, id: Number(rows[0].id), createdAt: rows[0].created_at });
    }

    if(!(await requireAdmin(req, res))) return;

    if(req.method === "GET"){
      const kind = clip(req.query.kind, 20);
      const rows = KINDS.includes(kind)
        ? await sql`select * from as_leads where kind = ${kind} order by created_at desc limit 500`
        : await sql`select * from as_leads order by created_at desc limit 500`;
      return send(res, 200, { ok:true, items: rows.map(r => ({ ...r, id:Number(r.id) })) });
    }

    if(req.method === "PATCH"){
      const { id, status } = req.body || {};
      await sql`update as_leads set status = ${clip(status, 30)} where id = ${Number(id)}`;
      return send(res, 200, { ok:true });
    }

    if(req.method === "DELETE"){
      await sql`delete from as_leads where id = ${Number(req.query.id)}`;
      return send(res, 200, { ok:true });
    }

    res.setHeader("Allow", "GET, POST, PATCH, DELETE");
    send(res, 405, { ok:false, error:"Método não permitido." });
  } catch(err) {
    fail(res, err);
  }
}
