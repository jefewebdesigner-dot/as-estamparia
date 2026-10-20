/* Upload e download de arquivos (artes dos clientes, fotos de produtos).
   POST { name, type, data(base64) } → { ok, file:{ id, name, url } }
   GET  ?id=...                      → conteúdo do arquivo */
import crypto from "node:crypto";
import { sql, send, fail, clip } from "./_lib.js";

export const MAX_BYTES = 3 * 1024 * 1024; // limite do corpo da função na Vercel é 4,5 MB (base64 incluso)
const ALLOWED = {
  "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp",
  "image/svg+xml":"svg", "application/pdf":"pdf"
};

export default async function handler(req, res){
  try {
    if(req.method === "GET"){
      const id = clip(req.query.id, 64);
      const rows = id ? await sql`select name, mime, data from as_files where id = ${id}` : [];
      if(!rows.length) return send(res, 404, { ok:false, error:"Arquivo não encontrado." });
      const f = rows[0];
      res.setHeader("Content-Type", f.mime);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(f.name)}`);
      res.setHeader("X-Content-Type-Options", "nosniff");
      if(f.mime === "image/svg+xml") res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox");
      return res.status(200).send(Buffer.from(f.data));
    }

    if(req.method === "POST"){
      const { name, type, data } = req.body || {};
      if(!ALLOWED[type]) return send(res, 400, { ok:false, error:"Formato não aceito. Envie JPG, PNG, WebP, PDF ou SVG." });
      const buf = Buffer.from(String(data || ""), "base64");
      if(!buf.length) return send(res, 400, { ok:false, error:"Arquivo vazio." });
      if(buf.length > MAX_BYTES) return send(res, 413, { ok:false, error:"Arquivo muito grande (máx. 3 MB)." });

      const id = crypto.randomBytes(12).toString("hex") + "." + ALLOWED[type];
      const fileName = clip(name, 160) || ("arquivo." + ALLOWED[type]);
      await sql`insert into as_files (id, name, mime, size, data) values (${id}, ${fileName}, ${type}, ${buf.length}, ${buf})`;
      return send(res, 200, { ok:true, file:{ id, name:fileName, url:"/api/arquivos?id=" + id, size:buf.length, type } });
    }

    res.setHeader("Allow", "GET, POST");
    send(res, 405, { ok:false, error:"Método não permitido." });
  } catch(err) {
    fail(res, err);
  }
}
