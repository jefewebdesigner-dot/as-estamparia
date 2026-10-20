/* Login e troca de senha do painel administrativo.
   POST { action:"login", password }        → { ok, token }
   POST { action:"senha", current, next }   → { ok, token } */
import { send, fail, checkPassword, setPassword } from "./_lib.js";

export default async function handler(req, res){
  try {
    if(req.method !== "POST"){
      res.setHeader("Allow", "POST");
      return send(res, 405, { ok:false, error:"Método não permitido." });
    }
    const b = req.body || {};

    if(b.action === "login"){
      const token = await checkPassword(b.password || "");
      if(!token) return send(res, 401, { ok:false, error:"Senha incorreta. Verifique e tente novamente." });
      return send(res, 200, { ok:true, token });
    }

    if(b.action === "senha"){
      if(!(await checkPassword(b.current || ""))) return send(res, 401, { ok:false, error:"Senha atual incorreta." });
      const next = String(b.next || "").trim();
      if(next.length < 4) return send(res, 400, { ok:false, error:"A nova senha deve ter pelo menos 4 caracteres." });
      return send(res, 200, { ok:true, token: await setPassword(next) });
    }

    send(res, 400, { ok:false, error:"Ação inválida." });
  } catch(err) {
    fail(res, err);
  }
}
