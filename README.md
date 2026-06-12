# Nümtema AI Shell

Template **Next.js + shadcn/ui-like + Tailwind CSS + Vercel-ready** pour créer un dashboard IA moderne inspiré des interfaces ChatGPT, Gemini et Claude, sans les copier.

## Ce qui est inclus

- Next.js App Router
- Interface responsive
- Sidebar rétractable
- Composer IA central premium
- Actions rapides
- Panneau droit de contexte projet
- Mode clair / sombre avec `next-themes`
- Composants UI type shadcn dans `components/ui`
- Route API `/api/chat` en streaming mock
- Base prête pour déploiement Vercel

## Installation locale

```bash
npm install
npm run dev
```

Ouvre ensuite :

```bash
http://localhost:3000
```

## Build production

```bash
npm run build
npm run start
```

## Déploiement Vercel

1. Pousse ce dossier sur GitHub.
2. Va sur Vercel.
3. Clique sur **Add New Project**.
4. Importe le repo.
5. Framework détecté : **Next.js**.
6. Build command : `npm run build`.
7. Output : automatique.
8. Déploie.

Aucun `vercel.json` n'est nécessaire : Vercel détecte Next.js automatiquement.

## Où modifier quoi ?

```txt
app/page.tsx                              Page principale
app/api/chat/route.ts                     Route streaming mock
components/shell/ai-workspace.tsx         Layout principal
components/shell/app-sidebar.tsx          Sidebar gauche
components/shell/right-context-panel.tsx  Panneau contexte droit
components/composer/prompt-composer.tsx   Zone de prompt
components/composer/quick-actions.tsx     Boutons rapides
components/ui/*                           Composants shadcn-like
app/globals.css                           Thème, tokens, couleurs, effets
```

## Prochaines évolutions logiques

- Brancher un vrai provider IA dans `/api/chat`
- Ajouter upload fichier réel
- Ajouter persistance projets/conversations
- Ajouter preview d'artifacts HTML/React
- Ajouter sélection multi-agent
- Ajouter export ZIP
- Ajouter base de données Neon/Supabase

## Note technique

Le template utilise des dépendances `latest` pour rester compatible avec l'écosystème actuel Next.js/Vercel. Pour un projet client en production stricte, il est préférable de verrouiller les versions après un premier `npm install` validé.
