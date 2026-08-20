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

## Painel Administrativo do Lojista (`/admin`)

O site inclui um **Painel de Gestão Completo e Autônomo** para o cliente gerenciar todo o site sem precisar mexer em código:

* **URL de acesso:** `/admin/index.html` ou pelo link "Acesso Administrativo" na página `conta.html`.
* **Senha padrão:** `admin123` (pode ser alterada a qualquer momento na aba Configurações).
* **Funcionalidades incluídas:**
  1. **Gestão de Produtos (CRUD Completo):**
     * Cadastrar novos produtos com foto (upload direto com compressão inteligente no navegador).
     * Editar produtos existentes (nome, categoria, preço fixo ou sob consulta, descrições, tags).
     * Destacar ou ocultar produtos da vitrine da Home.
     * Duplicar produtos e excluir.
  2. **Configurações da Loja:**
     * Alterar número de WhatsApp, e-mail, Instagram, horários, endereço e formas de pagamento com prévia em tempo real do link `wa.me`.
  3. **Galeria de Trabalhos:**
     * Adicionar e remover fotos de trabalhos reais com legendas.
  4. **Pedidos e Cupons:**
     * Acompanhar pedidos recebidos pelo checkout e criar cupons de desconto.
  5. **Backup & Exportação:**
     * Download de backup completo em JSON em 1 clique.
     * Restauração de backup JSON.
     * Exportação dos arquivos físicos `products.js` e `config.js`.

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
