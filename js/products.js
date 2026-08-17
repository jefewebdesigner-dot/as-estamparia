/* ==========================================================================
   AS ESTAMPARIA — Catálogo de produtos
   -----------------------------------------------------------------------
   Fotos reais dos produtos ficam em /assets. Categorias sem foto própria
   ainda usam uma ilustração de marca (campo "icon") — troque por fotos
   reais assim que estiverem disponíveis.
   Nenhum preço final foi informado pela empresa: todos os produtos usam
   priceFrom = null e são exibidos como "Sob consulta".
   ========================================================================== */

window.AS_CATEGORIES = [
  { slug:"camisetas", name:"Camisetas Personalizadas", desc:"Fotos, frases, logotipos e artes exclusivas em algodão de qualidade.", icon:"tshirt", image:"assets/camiseta-brasil.webp" },
  { slug:"canecas", name:"Canecas Personalizadas", desc:"Uma lembrança especial para presentear ou usar todos os dias.", icon:"mug", image:"assets/caneca-papai.webp" },
  { slug:"copos", name:"Copos Personalizados", desc:"Nomes, frases e artes para festas, eventos e empresas.", icon:"cup" },
  { slug:"quadros", name:"Quadros e Placas", desc:"Fotos e mensagens transformadas em decoração cheia de significado.", icon:"frame", image:"assets/placa-vogue.webp" },
  { slug:"ecobags", name:"Ecobags Personalizadas", desc:"Práticas, bonitas e personalizadas do seu jeito.", icon:"bag" },
  { slug:"bones", name:"Bonés Personalizados", desc:"Leve sua marca, equipe ou estilo para todos os lugares.", icon:"cap" },
  { slug:"pet", name:"Produtos Pet", desc:"Seu pet também merece algo especial e só dele.", icon:"paw", image:"assets/caneca-ayla.webp" },
  { slug:"presentes", name:"Presentes Personalizados", desc:"Fotos, nomes e histórias transformadas em presentes únicos.", icon:"gift", image:"assets/presente.webp" },
  { slug:"empresas", name:"Personalizados para Empresas", desc:"Peças e brindes com a identidade visual da sua marca.", icon:"briefcase" }
];

window.AS_OCCASIONS = [
  { slug:"aniversario", name:"Aniversário", icon:"cake" },
  { slug:"dia-das-maes", name:"Dia das Mães", icon:"flower" },
  { slug:"dia-dos-pais", name:"Dia dos Pais", icon:"tie" },
  { slug:"dia-dos-namorados", name:"Dia dos Namorados", icon:"heart" },
  { slug:"natal", name:"Natal", icon:"snow" },
  { slug:"casamento", name:"Casamento", icon:"rings" },
  { slug:"formatura", name:"Formatura", icon:"cap-grad" },
  { slug:"amigo-secreto", name:"Amigo Secreto", icon:"tag" },
  { slug:"padrinhos", name:"Padrinhos e Madrinhas", icon:"star" },
  { slug:"professores", name:"Professores", icon:"book" }
];

window.AS_PRODUCTS = [
  {
    id:"camiseta-brasil", name:"Camiseta Brasil Coração", category:"camisetas",
    image:"assets/camiseta-brasil.webp", gallery:["assets/camiseta-brasil.webp"],
    shortDesc:"Camiseta personalizada com estampa exclusiva, ideal para torcer com estilo.",
    description:"Camiseta 100% personalizável: use como referência este modelo ou envie sua própria arte, frase ou time do coração. Estampa em silk de alta durabilidade, aplicada sobre malha 100% algodão.",
    featured:true, personalizable:true, occasions:["aniversario"], badges:["Personalizável"]
  },
  {
    id:"camiseta-arirang", name:"Camiseta Estampa Exclusiva", category:"camisetas",
    image:"assets/camiseta-arirang.webp", gallery:["assets/camiseta-arirang.webp"],
    shortDesc:"Estamparia autoral em silk sobre camiseta preta, com etiqueta personalizada AS Estamparia.",
    description:"Camiseta preta com arte exclusiva desenvolvida em silk. Perfeita para bandas, coletivos, grupos de amigos ou marcas que querem uma estampa com identidade própria.",
    featured:true, personalizable:true, occasions:["amigo-secreto"], badges:["Personalizável"]
  },
  {
    id:"camiseta-legado", name:"Camiseta Retrato Ilustrado", category:"camisetas",
    image:"assets/camiseta-legado.webp", gallery:["assets/camiseta-legado.webp"],
    shortDesc:"Sua foto transformada em uma ilustração exclusiva, estampada com frase personalizada.",
    description:"Transformamos uma foto especial em uma ilustração exclusiva para estampar na camiseta, acompanhada da frase que você escolher. Um presente cheio de significado para eternizar um momento.",
    featured:true, personalizable:true, occasions:["dia-dos-pais","aniversario"], badges:["Personalizável","Retrato"]
  },
  {
    id:"camiseta-sogro", name:"Camiseta \"Eu Amo Meu Sogro\"", category:"camisetas",
    image:"assets/camiseta-sogro.webp", gallery:["assets/camiseta-sogro.webp"],
    shortDesc:"Camiseta com ilustração personalizada e frase para presentear com bom humor.",
    description:"Modelo pensado para presentes cheios de humor e afeto: sua foto vira uma ilustração estilizada, acompanhada da frase que você escolher.",
    personalizable:true, occasions:["dia-dos-pais"], badges:["Personalizável","Retrato"]
  },
  {
    id:"caneca-ayla", name:"Caneca Retrato Pet", category:"canecas",
    image:"assets/caneca-ayla.webp", gallery:["assets/caneca-ayla.webp"],
    shortDesc:"Ilustração exclusiva do seu pet em traço fino, com o nome dele na caneca.",
    description:"Enviamos a foto do seu pet e criamos uma ilustração exclusiva em traço fino, aplicada em caneca de cerâmica branca 325ml, junto com o nome que você escolher.",
    featured:true, personalizable:true, tags:["pet"], occasions:["aniversario"], badges:["Personalizável","Pet"]
  },
  {
    id:"caneca-pai-bebe", name:"Caneca Momento Especial", category:"canecas",
    image:"assets/caneca-pai-bebe.webp", gallery:["assets/caneca-pai-bebe.webp"],
    shortDesc:"Uma foto marcante impressa em caneca de cerâmica, para lembrar todos os dias.",
    description:"Envie a foto que representa esse momento especial e nós preparamos a arte para impressão em caneca de cerâmica branca, com acabamento de alta durabilidade.",
    featured:true, personalizable:true, occasions:["dia-dos-pais","aniversario"], badges:["Personalizável"]
  },
  {
    id:"caneca-papai", name:"Caneca Pet & Pai/Mãe", category:"canecas",
    image:"assets/caneca-papai.webp", gallery:["assets/caneca-papai.webp"],
    shortDesc:"Caneca com a patinha e o nome do seu pet — para o \"pai\" ou \"mãe\" de quatro patas.",
    description:"Personalizamos com o nome do seu pet, uma pegadinha de pata e o texto que você quiser. Um presente carinhoso para tutores de pets.",
    personalizable:true, tags:["pet"], occasions:["dia-dos-pais","aniversario"], badges:["Personalizável","Pet"]
  },
  {
    id:"copo-personalizado", name:"Copo Personalizado", category:"copos",
    icon:"cup",
    shortDesc:"Nomes, frases, logotipos ou artes especiais no seu copo do jeito que você quiser.",
    description:"Ótima opção para presentes, festas, eventos, confraternizações e empresas. Consulte modelos e capacidades disponíveis com a nossa equipe.",
    featured:true, personalizable:true, occasions:["aniversario","amigo-secreto"], badges:["Personalizável"]
  },
  {
    id:"quadro-mind", name:"Quadro Poster Retrô", category:"quadros",
    image:"assets/placa-mind.webp", gallery:["assets/placa-mind.webp"],
    shortDesc:"Placa decorativa com arte estilo poster retrô, pronta para decorar qualquer ambiente.",
    description:"Placa decorativa em alta definição com acabamento premium. Use um dos nossos modelos de arte ou envie a sua para criarmos algo exclusivo.",
    personalizable:true, badges:["Personalizável"]
  },
  {
    id:"quadro-vogue", name:"Placa Decorativa Divertida", category:"quadros",
    image:"assets/placa-vogue.webp", gallery:["assets/placa-vogue.webp"],
    shortDesc:"Placas com pegada de humor e estilo — ótimas para presentear ou decorar.",
    description:"Transforme fotos, mensagens e momentos importantes (inclusive do seu pet!) em uma decoração cheia de personalidade.",
    featured:true, personalizable:true, tags:["pet"], occasions:["amigo-secreto"], badges:["Personalizável"]
  },
  {
    id:"ecobag-personalizada", name:"Ecobag Personalizada", category:"ecobags",
    icon:"bag",
    shortDesc:"Prática, sustentável e com a arte que você escolher.",
    description:"Ótima opção para uso pessoal, eventos, empresas, brindes e presentes. Personalizamos com frases, logotipos e artes exclusivas.",
    personalizable:true, occasions:["amigo-secreto"], badges:["Personalizável"]
  },
  {
    id:"bone-personalizado", name:"Boné Personalizado", category:"bones",
    icon:"cap",
    shortDesc:"Para quem quer levar sua marca, equipe ou estilo para todos os lugares.",
    description:"Personalização para bonés em diferentes modelos. Consulte com nossa equipe os modelos e possibilidades disponíveis no momento.",
    personalizable:true, badges:["Personalizável"]
  },
  {
    id:"pet-personalizado", name:"Produto Pet Personalizado", category:"pet",
    icon:"paw",
    shortDesc:"Coleiras, comedouros e acessórios com a cara do seu companheiro de quatro patas.",
    description:"Seu pet também merece algo especial! Criamos produtos e artes personalizadas com o nome, a raça ou até uma ilustração exclusiva do seu bichinho.",
    personalizable:true, tags:["pet"], occasions:["aniversario"], badges:["Personalizável","Pet"]
  },
  {
    id:"almofada-personalizada", name:"Almofada Personalizada", category:"presentes",
    image:"assets/almofada-vovo.webp", gallery:["assets/almofada-vovo.webp"],
    shortDesc:"Um mosaico de fotos e uma frase especial, transformados em uma almofada única.",
    description:"Reunimos várias fotos e uma mensagem escolhida por você em uma almofada personalizada — um presente afetivo para guardar momentos especiais.",
    personalizable:true, occasions:["dia-das-maes","aniversario"], badges:["Personalizável"]
  },
  {
    id:"kit-presente", name:"Kit Presente Personalizado", category:"presentes",
    image:"assets/presente.webp", gallery:["assets/presente.webp"],
    shortDesc:"Monte um kit com produtos personalizados, para presentear sem errar.",
    description:"Montamos kits combinando produtos personalizados (como canecas) com outros itens para presente. Fale com a nossa equipe para montar o kit ideal para a ocasião.",
    featured:true, personalizable:true, occasions:["aniversario","dia-dos-namorados","natal"], badges:["Personalizável","Kit"]
  },
  {
    id:"kit-empresarial", name:"Kit Empresarial Personalizado", category:"empresas",
    icon:"briefcase",
    shortDesc:"Camisetas, canecas, brindes e uniformes com a identidade da sua empresa.",
    description:"Produzimos peças com logotipo, identidade visual, frases e artes da sua empresa — em pedidos avulsos ou em quantidade para equipes e eventos.",
    personalizable:true, isBusiness:true, badges:["Para empresas"]
  }
];

/* Fotos reais de trabalhos já produzidos pela AS Estamparia — usadas na
   Galeria como portfólio (algumas contêm fotos e nomes de clientes,
   por isso ficam apenas na galeria e não como itens "à venda" no catálogo). */
window.AS_GALLERY = [
  { image:"assets/camiseta-legado.webp", caption:"Camiseta com ilustração personalizada" },
  { image:"assets/caneca-ayla.webp", caption:"Caneca retrato pet" },
  { image:"assets/camiseta-papa-vovo.webp", caption:"Camiseta personalizada em família" },
  { image:"assets/placa-vogue.webp", caption:"Placa decorativa personalizada" },
  { image:"assets/caneca-pai-bebe.webp", caption:"Caneca momento especial" },
  { image:"assets/camiseta-sogro.webp", caption:"Camiseta com retrato ilustrado" },
  { image:"assets/placa-mind.webp", caption:"Quadro decorativo estilo poster" },
  { image:"assets/caneca-papai.webp", caption:"Caneca personalizada pet" },
  { image:"assets/almofada-vovo.webp", caption:"Almofada com mosaico de fotos" },
  { image:"assets/camiseta-arirang.webp", caption:"Camiseta com estampa exclusiva" },
  { image:"assets/camiseta-brasil.webp", caption:"Camiseta personalizada" },
  { image:"assets/caneca-cafe.webp", caption:"Caneca personalizada com arte especial" },
  { image:"assets/presente.webp", caption:"Kit presente personalizado" }
];

function getProductById(id){ return window.AS_PRODUCTS.find(p=>p.id===id); }
function getCategory(slug){ return window.AS_CATEGORIES.find(c=>c.slug===slug); }
function productsByCategory(slug){ return window.AS_PRODUCTS.filter(p=>p.category===slug); }
function featuredProducts(){ return window.AS_PRODUCTS.filter(p=>p.featured); }
