# Grimório do Narrador

**Plataforma web para gerenciamento de campanhas de RPG — Feiticeiros & Maldições**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aplicação full-stack para mestres de RPG de mesa, com foco no sistema brasileiro **Feiticeiros & Maldições**. Centraliza o gerenciamento de campanhas, NPCs, missões, facções, locais e sessões de jogo, além de contar com um **assistente de IA** integrado para geração de conteúdo via OpenAI.

### Funcionalidades

- Gerenciamento completo de campanhas com status (Ativa, Pausada, Concluída)
- Sistema de sessões com resumo, eventos e hooks futuros
- Catálogo de NPCs com perfis detalhados e relacionamentos
- Workflow de missões: Disponível → Em Andamento → Concluída → Falha
- Facções com influência, recursos e relações
- Locais com suporte a dados cartográficos e linha do tempo
- Wiki integrada por campanha com slugs personalizados
- Assistente de IA para gerar NPCs, missões e arcos narrativos (OpenAI)
- Autenticação via email/senha ou Google OAuth
- Editor de texto rico com Tiptap
- Modo escuro/claro

### Tech Stack

| Frontend | Backend & Database | DevOps |
|---|---|---|
| Next.js 16 | Next.js API Routes | Vercel |
| React 19 | Prisma 7 + PostgreSQL | Supabase |
| Tailwind CSS 4 | NextAuth.js 5 | ESLint + Prettier |
| shadcn/ui | OpenAI SDK | |

### Instalação

```bash
git clone https://github.com/VGameleira/grimorio-narrador.git
cd grimorio-narrador
npm install
cp .env.example .env.local
npx prisma generate && npx prisma db push
npm run dev
```

---

MIT License — Veja [LICENSE](LICENSE).

**Vinícius dos Santos Gameleira** — [@VGameleira](https://github.com/VGameleira)
