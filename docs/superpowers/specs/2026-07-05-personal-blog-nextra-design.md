# Blog Pessoal com Nextra — Design

**Data:** 2026-07-05
**Status:** Aprovado para planejamento de implementação

## Objetivo

Criar um blog pessoal, hospedado gratuitamente no GitHub Pages, para publicar conteúdos de aprendizado sobre programação em geral. O conteúdo é escrito em Markdown/MDX via Nextra, com deploy automatizado via GitHub Actions.

## Decisões principais

| Item | Decisão |
|---|---|
| Repositório | `Ermerson/Ermerson.github.io` (user page — publica na raiz, sem `basePath`) |
| Framework | Next.js 15 (App Router) |
| Motor de conteúdo | Nextra 4 + `nextra-theme-blog` |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 + shadcn/ui |
| Gerenciador de pacotes | pnpm |
| Idiomas | Português (`pt`, padrão) e Inglês (`en`) |
| Hospedagem | GitHub Pages, via export estático (`output: 'export'`) |
| CI/CD | GitHub Actions (build+lint em PRs, deploy em push para `main`) |

## 1. Stack & Tooling

- **Next.js 15** (App Router) + **Nextra 4** + `nextra-theme-blog`.
- **TypeScript** em todo o projeto, para compatibilidade total com shadcn/ui.
- **Tailwind CSS v4**, importado em `app/globals.css` junto com `nextra-theme-blog/style.css` (combinação suportada oficialmente pela documentação do Nextra).
- **shadcn/ui** inicializado via CLI (`components.json`, `lib/utils.ts`, componentes copiados para `components/ui/`).
- **pnpm** como gerenciador de pacotes.
- **ESLint + Prettier** com configuração básica, rodando no CI (lint obrigatório antes do deploy).

## 2. Estrutura de conteúdo & i18n

> **Nota de implementação:** a documentação oficial do Nextra afirma que o roteamento i18n nativo (`i18n: { locales, defaultLocale }`) é "specifically available when using the nextra-theme-docs theme" — não há suporte documentado nem exemplo oficial combinando `nextra-theme-blog` com essa config. Por isso, **não usamos a config `i18n` nativa do Nextra**. Em vez disso, o multi-idioma é implementado manualmente duplicando a árvore de rotas no App Router.

- Duas árvores de rota independentes no App Router: `app/pt/` e `app/en/`, cada uma com seu próprio `layout.tsx` (Navbar, Footer, ThemeSwitch do `nextra-theme-blog`) e seu próprio catch-all `[[...mdxPath]]/page.tsx`.
- Conteúdo em `content/pt/posts/` e `content/en/posts/`, cada árvore de conteúdo completamente independente (cada uma com seus próprios arquivos `.mdx`, sem sufixo de locale no nome — o idioma já é definido pela pasta).
- Um post que ainda não tem tradução simplesmente não existe naquela pasta de idioma — **sem fallback automático** entre idiomas, para manter o comportamento simples e previsível.
- Um seletor de idioma manual (componente shadcn `Select`/`DropdownMenu`) faz link direto entre `/pt/...` e `/en/...` (link estático para a home de cada idioma, já que não há mapeamento garantido 1:1 entre slugs traduzidos).
- Sem taxonomia fixa de categorias: usamos o sistema de **tags livres** já embutido no `nextra-theme-blog` (front-matter `tags: [...]` em cada post), com uma página `/pt/tags/:id` e `/en/tags/:id` independente por idioma.
- Páginas por idioma: `/pt/posts` e `/en/posts` (lista cronológica), `/pt/tags/:id` e `/en/tags/:id` (filtro por tag), `/pt/rss.xml` e `/en/rss.xml` (feed RSS) — cada uma gerada a partir da árvore de conteúdo daquele idioma.
- A raiz do site (`/`) redireciona (via página estática simples, já que não há middleware em export estático) para `/pt` — o idioma padrão.

## 3. Estilização & uso do shadcn/ui

- **Casca do site** (fora do conteúdo MDX): Navbar customizada, `ThemeSwitch` (dark/light), seletor de idioma, badges de tag e cards de listagem de posts — todos construídos com primitivas shadcn/ui (`button`, `badge`, `card`, `select`, `dropdown-menu`).
- **Dentro dos posts (MDX)**: via `mdx-components.tsx`, componentes shadcn selecionados (ex: `Callout`-like para avisos, `Card` para destaques) ficam disponíveis para uso direto no Markdown. A tipografia principal do corpo do texto continua controlada pelo estilo "prose" padrão do `nextra-theme-blog`, para não conflitar com a leitura já otimizada do tema.
- **Tema de cores**: variáveis CSS do shadcn (`--background`, `--primary`, etc.) compartilham a mesma classe `.dark` na raiz usada pelo `ThemeSwitch` do Nextra, garantindo que os dois sistemas de dark mode fiquem sincronizados.
- **Páginas customizadas**: Home (`/`) e "Sobre" são páginas React (não MDX) construídas com shadcn/ui, para dar uma identidade de "site pessoal" além da lista de posts.

## 4. Deploy, GitHub Pages & CI/CD

- Repositório de *user page* `Ermerson.github.io` publica direto em `https://ermerson.github.io`, sem necessidade de `basePath`/`assetPrefix`.
- Configuração do GitHub Pages: "Build and deployment source" = **GitHub Actions** (não a branch `gh-pages`).
- **Workflow de deploy** (`.github/workflows/deploy.yml`), disparado em push para `main`:
  1. Checkout do código.
  2. Setup de pnpm + Node, com cache de dependências.
  3. `pnpm install --frozen-lockfile`.
  4. `pnpm lint` e `pnpm build` (o build já gera o export estático em `out/`, via `output: 'export'`).
  5. `actions/upload-pages-artifact` apontando para `out/`.
  6. `actions/deploy-pages` para publicar.
- **Workflow de CI** (`.github/workflows/ci.yml`): roda lint + build em Pull Requests para `main`, sem deploy — garante que nada quebrado seja mergeado.
- `next.config`: `images: { unoptimized: true }` (obrigatório em export estático, já que o GitHub Pages não roda otimização de imagem em servidor).

## Fora de escopo (YAGNI)

- Comentários em posts (ex: Giscus/Utterances) — pode ser adicionado depois se necessário.
- Busca full-text avançada além do que o tema já oferece.
- Domínio customizado — usa o domínio padrão `ermerson.github.io` por enquanto.
- Fallback automático de tradução entre idiomas.
