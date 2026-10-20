/* Aplica db/schema.sql e dá ao usuário do site (DATABASE_URL) acesso às tabelas.
   Uso: node db/migrate.mjs   (precisa de MIGRATIONS_DATABASE_URL e DATABASE_URL) */
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";

const owner = neon(process.env.MIGRATIONS_DATABASE_URL);
const app = neon(process.env.DATABASE_URL);
const schema = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

for(const stmt of schema.split(/;\s*\n/).map(s => s.replace(/^\s*--.*$/gm, "").trim()).filter(Boolean)){
  await owner.query(stmt);
}
const [{ current_user: role }] = await app`select current_user`;
const [{ current_user: ownerRole }] = await owner`select current_user`;
if(role !== ownerRole){
  await owner.query(`grant select, insert, update, delete on as_kv, as_files, as_leads, as_customers to "${role}"`);
  await owner.query(`grant usage, select on sequence as_leads_id_seq, as_customers_id_seq to "${role}"`);
}
console.log("Migração aplicada. Usuário do site:", role);
