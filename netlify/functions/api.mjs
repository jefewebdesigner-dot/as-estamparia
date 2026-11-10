/* Adaptador Netlify: reaproveita os handlers de /api (formato Vercel req/res) sem alterá-los. */
import admin from "../../api/admin.js";
import arquivos from "../../api/arquivos.js";
import contas from "../../api/contas.js";
import estado from "../../api/estado.js";
import registros from "../../api/registros.js";

const routes = { admin, arquivos, contas, estado, registros };

export default async function (request){
  const url = new URL(request.url);
  const name = url.pathname.replace(/^\/(\.netlify\/functions\/)?api\/?/, "").split("/")[0];
  const handler = routes[name];
  if(!handler) return Response.json({ ok:false, error:"Rota não encontrada." }, { status:404 });

  const headers = {};
  request.headers.forEach((v, k) => { headers[k] = v; });
  let body;
  if(!["GET", "HEAD"].includes(request.method)){
    const text = await request.text();
    try { body = text ? JSON.parse(text) : undefined; } catch { body = text; }
  }
  const req = { method: request.method, headers, query: Object.fromEntries(url.searchParams), body, url: url.pathname + url.search };

  return new Promise((resolve, reject) => {
    let status = 200;
    const outHeaders = new Headers();
    const res = {
      status(code){ status = code; return res; },
      setHeader(k, v){ outHeaders.set(k, String(v)); return res; },
      getHeader(k){ return outHeaders.get(k); },
      send(data){ resolve(new Response(data == null ? null : data, { status, headers: outHeaders })); return res; },
      json(data){ outHeaders.set("Content-Type", "application/json; charset=utf-8"); return res.send(JSON.stringify(data)); },
      end(data){ return res.send(data); },
    };
    Promise.resolve(handler(req, res)).catch(reject);
  });
}

export const config = { path: "/api/*" };
