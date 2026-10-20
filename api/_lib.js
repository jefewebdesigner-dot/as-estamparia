/* Utilitários compartilhados das funções da API (não é uma rota: começa com "_"). */
import { neon } from "@neondatabase/serverless";
import crypto from "node:crypto";

export const sql = neon(process.env.DATABASE_URL);

const DEFAULT_ADMIN_PASS = "admin123";

export function send(res, status, body){
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(body));
}

export function fail(res, err){
  console.error(err);
  send(res, 500, { ok:false, error:"Erro no servidor. Tente novamente em instantes." });
}

function hashPassword(password, salt){
  return crypto.scryptSync(String(password), salt, 32).toString("hex");
}

async function getAdminAuth(){
  const rows = await sql`select value from as_kv where key = 'admin_auth'`;
  if(rows.length) return rows[0].value;
  // Primeiro acesso: grava a senha padrão para o token ficar estável entre requisições.
  const salt = crypto.randomBytes(16).toString("hex");
  const auth = { salt, hash: hashPassword(DEFAULT_ADMIN_PASS, salt) };
  await sql`insert into as_kv (key, value) values ('admin_auth', ${JSON.stringify(auth)}::jsonb) on conflict (key) do nothing`;
  const saved = await sql`select value from as_kv where key = 'admin_auth'`;
  return saved[0].value;
}

function tokenFor(auth){
  return crypto.createHmac("sha256", auth.hash).update("as-admin-session").digest("hex");
}

export async function checkPassword(password){
  const auth = await getAdminAuth();
  const ok = hashPassword(password, auth.salt) === auth.hash;
  return ok ? tokenFor(auth) : null;
}

export async function setPassword(password){
  const salt = crypto.randomBytes(16).toString("hex");
  const auth = { salt, hash: hashPassword(password, salt) };
  await sql`insert into as_kv (key, value, updated_at) values ('admin_auth', ${JSON.stringify(auth)}::jsonb, now())
            on conflict (key) do update set value = excluded.value, updated_at = now()`;
  return tokenFor(auth);
}

/* Confere o token do painel. Responde 401 e retorna false se inválido. */
export async function requireAdmin(req, res){
  const token = String(req.headers["x-admin-token"] || "");
  const expected = tokenFor(await getAdminAuth());
  const ok = token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  if(!ok) send(res, 401, { ok:false, error:"Sessão do painel expirada. Entre novamente." });
  return ok;
}

export function clip(value, max){
  if(value === undefined || value === null) return "";
  return String(value).trim().slice(0, max);
}
