# Blog Pessoal

Blog pessoal bilíngue (pt/en), construído com Next.js, Nextra (`nextra-theme-blog`) e shadcn/ui, publicado no GitHub Pages via GitHub Actions.

Site: https://ermerson.github.io

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000 — a raiz redireciona para `/pt/`.

## Build de produção (export estático)

```bash
pnpm build
```

Gera o site estático em `out/`.

## Como escrever um novo post

1. Crie um arquivo `.mdx` em `content/pt/posts/` (português) e, se for traduzir, outro em `content/en/posts/` (inglês). Os nomes de arquivo não precisam ser iguais entre os dois idiomas.
2. Adicione o front matter no topo do arquivo:

   ```mdx
   ---
   title: Título do post
   date: 2026-07-05
   description: Uma frase descrevendo o post.
   tags: [tag1, tag2]
   ---
   ```

3. Escreva o conteúdo em Markdown/MDX abaixo do front matter. Use `<Note>...</Note>` para destacar um trecho em um card.
4. Rode `pnpm dev` para conferir localmente, depois abra um Pull Request — o workflow de CI roda lint e build automaticamente.

Se um post ainda não tem tradução, ele simplesmente não aparece na listagem daquele idioma (não há fallback automático).

## Deploy

Todo push em `main` dispara o workflow `.github/workflows/deploy.yml`, que builda o site e publica em `https://ermerson.github.io`.

**Configuração necessária no GitHub (uma única vez):** em Settings → Pages, defina "Build and deployment source" como **GitHub Actions**.
