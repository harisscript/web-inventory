# Web Inventory

PWA inventory management app — responsive, offline-capable, modular architecture.

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 3** + **shadcn/ui** (new-york style)
- **React Router 7** for routing
- **Zustand** for client state (auth)
- **TanStack Query v5** for server state / data fetching
- **react-hook-form** + **Zod** for forms & validation
- **i18next** for i18n (EN + ID)
- **vite-plugin-pwa** for installable PWA + Workbox service worker
- **next-themes** for dark mode
- **sonner** for toasts
- **lucide-react** for icons

## Scripts

```bash
npm install            # install deps
npm run dev            # start dev server (http://localhost:5173)
npm run build          # type-check + production build
npm run preview        # preview production build
npm run lint           # run ESLint
npm run lint:fix       # run ESLint with --fix
npm run format         # format with Prettier
npm run typecheck      # tsc --noEmit
npm run icons:generate # regenerate PWA icons from public/favicon.svg
```

## Architecture: Feature-Based / Module-Based

Each feature in `src/features/` is a **self-contained module** with its own components, hooks, services, store, schemas, types, locales, and barrel export. Cross-feature imports go only through barrel `index.ts` or shared code in `src/shared/`.

```
src/
├── app/              # App-level composition (providers, router)
├── features/         # Self-contained feature modules
│   ├── auth/         # Authentication: login, register, protected routes
│   └── inventory/    # Inventory: product CRUD with localStorage mock
├── shared/           # Cross-feature code
│   ├── components/   # UI components (shadcn + layout + theme/lang/install)
│   ├── hooks/        # useDebounce, useMediaQuery, useLocalStorage
│   ├── lib/          # utils (cn), api client, storage helpers
│   ├── config/       # constants
│   └── types/        # common types
├── i18n/             # i18next setup + common namespace
├── styles/           # Tailwind + shadcn CSS variables
└── main.tsx          # Entry point
```

## Adding a new feature

```bash
mkdir -p src/features/my-feature/{components,hooks,pages,services,store,schemas,types,locales}
```

Create the same internal folder structure as `auth/` or `inventory/`. Export only through `index.ts` (barrel) so other features import via `import { ... } from '@/features/my-feature'`.

## Demo data

The inventory feature seeds 10 mock products on first load and persists all CRUD operations to `localStorage`. To reset, clear the `inventory.products` key from DevTools → Application → Local Storage.

Auth uses `localStorage` too. Register any new account on `/register` to log in.

## PWA

- Manifest configured in `vite.config.ts` (VitePWA plugin)
- Auto-generated icons (`pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png`) are generated from `public/favicon.svg` via `npm run icons:generate`
- Installable on mobile (Add to Home Screen) and desktop (Chrome install button)
- Workbox runtime caching for fonts and `/api/*` requests

## Responsive

- Mobile-first with Tailwind breakpoints (`sm` 640 / `md` 768 / `lg` 1024)
- Inventory list: **card view** on mobile, **table view** on `md+`
- Layout: **bottom nav** on mobile, **sidebar** on `lg+`
- Product form uses **Sheet** (bottom drawer) on mobile, **Dialog** on `md+`
