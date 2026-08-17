# AS Estamparia — Site / E-commerce

Site institucional + e-commerce em HTML, CSS e JavaScript puro (sem build,
sem dependências de servidor) para a **AS Estamparia**, com identidade
visual baseada na paleta da logo (roxo `#6D2C91`, turquesa `#46C5BE`).

## Como visualizar

Não precisa instalar nada. Duas opções:

1. **Abrir direto:** dê duplo clique em `index.html`.
2. **Com servidor local (recomendado, evita bloqueios do navegador):**
   ```bash
   # dentro da pasta do projeto
   python -m http.server 8080
   # depois acesse http://localhost:8080
   ```

## ⚠️ Antes de publicar — o que falta preencher

Nenhum dado de contato, preço final, forma de pagamento ou política de
entrega foi inventado. Tudo isso precisa ser preenchido em **um único
lugar**:

➡️ **`js/config.js`**

```js
whatsappNumber: "",   // ex: "5511999998888"
email: "",
instagram: "",
address: "",
hours: "",
paymentMethods: "",
deliveryInfo: "",
```

Enquanto esses campos estiverem vazios, o site mostra automaticamente
placeholders visíveis (`[WhatsApp a definir]`, etc.) em vez de inventar
informação. Os botões de WhatsApp mostram um aviso ("configure o número")
até que `whatsappNumber` seja preenchido.

Também vale revisar:
- `sitemap.xml` e `robots.txt` — trocar `SEUDOMINIO.com.br` pela URL real.
- Preços: como a AS Estamparia trabalha com personalização sob orçamento,
  o site mostra **"Sob consulta"** em vez de valores inventados. Se um dia
  vocês definirem uma tabela de preços "a partir de", é só ajustar
  `productCardHTML()`/`price-block` em `js/ui.js` e `produto.html`.

## Estrutura do projeto

```
index.html          Home
produtos.html        Catálogo com filtro por categoria/busca
produto.html          Página de produto + fluxo de personalização
presentes.html        Presentes por ocasião
empresas.html          Para empresas + formulário de orçamento
personalize.html        "Criamos sua arte" + envio de ideia
sobre.html               Institucional
contato.html              Fale conosco + FAQ completo
galeria.html               Portfólio de trabalhos reais
carrinho.html                Carrinho (localStorage)
checkout.html                  Finalização de pedido → WhatsApp
favoritos.html                  Lista de favoritos (localStorage)
conta.html                       Login/cadastro + pedidos (localStorage)
admin/index.html                  Painel administrativo (protótipo)

css/style.css        Sistema de design (cores, tipografia, componentes)
js/config.js           Dados de contato da empresa (edite aqui)
js/products.js           Catálogo de produtos e categorias
js/store.js                Carrinho, favoritos, conta, pedidos, cupons (localStorage)
js/ui.js                     Ícones, header, cards, toasts, helpers de UI

assets/               Logo + fotos reais dos produtos já fornecidas (as que
                         o site usa em todas as páginas, com o ambiente/fundo
                         original das fotos)
assets/clean/           Versão opcional das mesmas fotos com fundo removido e
                         recolocadas sobre fundo branco — gerada mas não usada
                         no site no momento (veja nota abaixo)
Foto dos produtos/     Fotos originais (maior resolução) — não usadas diretamente no site
```

## Versão opcional com fundo branco (`assets/clean/`)

Existe uma versão alternativa de 12 fotos com o produto recortado e
recolocado sobre fundo branco (visual mais "e-commerce"), gerada por remoção
de fundo automática. O site **não usa essa versão atualmente** — foi testada
e o fundo original das fotos foi mantido por preferência. Os arquivos
continuam em `assets/clean/` caso queira reativá-los depois; para isso, troque
os caminhos `assets/arquivo.webp` por `assets/clean/arquivo.webp` em
`js/products.js` (dentro de `AS_CATEGORIES` e `AS_PRODUCTS` — não em
`AS_GALLERY`) e em `index.html`/`sobre.html`.

Se quiser reprocessar (por exemplo, ao adicionar fotos novas), o fundo foi
removido com a biblioteca Python `rembg` (modelo `u2net`) + um recorte do
maior componente conectado para descartar objetos que "vazam" atrás do
produto (outras canecas na prateleira, molduras, etc.). Não há script
pronto salvo no projeto — foi um processo pontual; para repetir, use
`rembg` diretamente sobre a foto original e recorte o resultado no editor
de imagem de preferência.

## Sobre o carrinho, conta e painel admin (importante)

Este é um **protótipo front-end completo**: carrinho, favoritos, login,
pedidos e cupons funcionam de verdade no navegador (gravunder em
`localStorage`), o que já permite demonstrar toda a jornada de compra —
mas os dados ficam **gravados apenas no navegador** (não são
compartilhados entre dispositivos/pessoas nem salvos em um banco de dados
real).

Para produção de verdade (pagamentos, estoque, múltiplos usuários vendo o
mesmo painel admin, envio de e-mail, etc.), é necessário conectar um
backend/plataforma de e-commerce (ex.: Nuvemshop, Shopify, WooCommerce, ou
uma API própria) no lugar de `js/store.js`. O restante do site (visual,
copy, estrutura) pode ser reaproveitado.

O checkout não processa pagamento: ele monta um resumo do pedido e abre o
WhatsApp configurado em `js/config.js`, como pedido no briefing (foco em
contato rápido pelo WhatsApp).

## Fotos usadas

As fotos em `/assets` são fotos reais de produtos já feitos pela AS
Estamparia. Categorias sem foto própria (Copos, Ecobags, Bonés, Produtos
Pet genérico, Empresas) usam uma ilustração de linha na paleta da marca —
troque por fotos reais assim que estiverem disponíveis, editando o campo
`image` em `js/products.js`.

Algumas fotos (com rostos e nomes de clientes reais) aparecem apenas na
**Galeria** (portfólio), não como itens "à venda" no catálogo.

## SEO básico já incluído
- Meta title/description por página, Open Graph na home, `robots.txt`,
  `sitemap.xml`, JSON-LD (`Store`) na home, e páginas de conta/carrinho
  marcadas como `noindex`.
