/* ==========================================================================
   AS ESTAMPARIA — Configuração do site
   -----------------------------------------------------------------------
   Preencha os dados reais da empresa aqui ou utilize o Painel Administrativo.
   Tudo que estiver como "" (vazio) é exibido no site como um placeholder
   visível (ex: "[WhatsApp a definir]").
   ========================================================================== */

window.AS_DEFAULT_CONFIG = {
  brand: "AS Estamparia",
  slogan: "Personalizamos suas ideias. Criamos algo só seu.",
  sloganAlt: "Sua ideia. Seu estilo. Do seu jeito.",

  // Apenas dígitos, com código do país. Ex: "5511999998888".
  whatsappNumber: "",

  email: "",
  instagram: "",
  facebook: "",
  address: "",       // Ex: "Rua Exemplo, 123 — Cidade/UF"
  hours: "",         // Ex: "Seg a Sex, 9h às 18h"
  paymentMethods: "", // Ex: "Pix, cartão de crédito e dinheiro"
  deliveryInfo: "",   // Ex: "Retirada no local e envio pelos Correios"

  // Texto padrão enviado ao abrir o WhatsApp sem contexto extra
  waDefaultMessage: "Olá! Vim pelo site da AS Estamparia e gostaria de fazer um orçamento."
};

// Carrega configurações dinâmicas mescladas
function refreshConfig(){
  try {
    const custom = JSON.parse(localStorage.getItem("as_custom_config") || "{}");
    window.AS_CONFIG = { ...window.AS_DEFAULT_CONFIG, ...custom };
  } catch(e) {
    window.AS_CONFIG = { ...window.AS_DEFAULT_CONFIG };
  }
}
refreshConfig();

/* Monta um link wa.me. Se o número não estiver configurado, retorna null
   e a interface deve avisar o visitante / lojista. */
function waLink(message){
  const num = (window.AS_CONFIG && window.AS_CONFIG.whatsappNumber ? window.AS_CONFIG.whatsappNumber : "").replace(/\D/g,"");
  const text = encodeURIComponent(message || (window.AS_CONFIG && window.AS_CONFIG.waDefaultMessage) || "Olá!");
  if(!num) return null;
  return `https://wa.me/${num}?text=${text}`;
}

function formatPlaceholder(value, label){
  return value && value.trim() ? value : `[${label} a definir]`;
}

