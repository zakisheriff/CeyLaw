# CeyLaw MVP

A production-quality MVP web application for a **Sri Lankan Law Library & AI Legal Research Assistant**. Built with Next.js App Router, TypeScript, and regular modern CSS modules.

## Features Included

- **Laws Library**: Browse, search, and filter Acts and Ordinances.
- **Law Reader**: Clean interface with Table of Contents for deep reading of complex documents.
- **AI Legal Assistant**: Ask questions and get cited answers based on legal contexts.
- **Advanced Search**: Global search crossing laws and sections.
- **Admin Console**: Minimal scaffold to manage legal content.

## Design Philosophy

- **Premium Legal-Tech Aesthetic**: Uses standard CSS modules with a palette consisting of Deep Navy (`#0B1F3A`) and Legal Gold (`#C9A227`).
- **Web-First & Mobile Responsive**: Designed to look like a mature platform interface.
- **Authoritative & Calm**: Avoiding startup gimmicks by keeping shadows subtle, borders refined, and utilizing robust serif (Merriweather) and sans-serif (Inter) typography.

## Architecture

- **Next.js 14+ (App Router)** for fast frontend delivery, static generation, API routes, and SEO optimization.
- **TypeScript** natively integrated for safe, maintainable application scaling.
- **Supabase**: Data models and components pre-structured for Postgres/Supabase deployment.
- **AI Abstraction**: `lib/ai/retrieval.ts` prepares standard pipelines for connecting the **Gemini 2.5 Flash** model with context-injected prompts (RAG configuration) for fast, cost-effective processing.

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
   
2. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Folder Structure

\`\`\`
├── app/
│   ├── admin/           # Admin console
│   ├── ask/             # AI Legal Assistant chat
│   ├── laws/            # Laws Library and single law reader
│   ├── search/          # Global search results
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Premium Homepage
│   └── globals.css      # Core CSS tokens and resets
├── components/          # Reusable shared components
├── lib/
│   ├── ai/              # Retrieval helpers & prompt definitions
│   ├── mockData.ts      # Seed legal definitions (mocked for MVP)
│   └── supabase.ts      # Client configuration for Supabase
├── supabase/
│   └── schema.sql       # Database table defs for Postgres
├── public/              # Static assets
└── .env.example         # Required env keys
\`\`\`

The platform is configured to be **open and accessible to the public**. No account registration is required to read, search, or research the laws.

## Disclaimers for Deployment

CeyLaw provides legal information, legal text access, and AI-assisted research support for general informational purposes only. It does not constitute professional legal advice, legal representation, or a guaranteed legal opinion.
