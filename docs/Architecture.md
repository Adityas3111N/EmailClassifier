Describe system design:

High-level diagram (frontend ↔ backend ↔ APIs).

Tools used and why.

Data flow (login → fetch emails → classify).

Key decisions (no DB, using LangChain, etc.).

Short, diagram-based is ideal.

Project's file Structure


email-classifier/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth config
│   │   │   ├── emails/fetch/route.ts        # Gmail API integration
│   │   │   └── emails/classify/route.ts     # OpenAI classification
│   │   ├── dashboard/
│   │   │   └── page.tsx                     # Main dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx                         # Landing/login page
│   ├── components/
│   │   ├── EmailList.tsx
│   │   ├── EmailCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── OpenAIKeyModal.tsx
│   │   └── Header.tsx
│   ├── lib/
│   │   ├── gmail.ts                         # Gmail API helpers
│   │   ├── langchain.ts                     # Langchain setup
│   │   └── types.ts                         # TypeScript types
│   └── utils/
│       └── localStorage.ts                  # Storage helpers
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md