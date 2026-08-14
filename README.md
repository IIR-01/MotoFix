# MotoFix

CSE471 Group 10 — integrated web platform for vehicle owners: spare parts marketplace, roadside assistance dispatch, and AI-assisted customization.

## Stack
MERN (MongoDB, Express, React, Node) + Tailwind CSS. See `Assignment 01` for the full functional requirements.

## Project structure
```
MotoFix/
├── server/     Express API
└── client/     React app (Vite)
```

## First-time setup (everyone, once)

1. Clone the repo and pull `main`.
2. Backend:
   ```
   cd server
   npm install
   cp .env.example .env
   ```
   Fill in `.env` with a MongoDB Atlas connection string and a JWT secret (ask in the group chat for the shared dev cluster string, or create your own free Atlas cluster).
3. Frontend:
   ```
   cd client
   npm install
   ```
4. Run both at once (two terminals):
   ```
   cd server && npm run dev      # http://localhost:5000
   cd client && npm run dev      # http://localhost:5173
   ```

## Branch workflow

`main` holds the shared foundation (auth, roles, navbar, theme) plus merged, evaluated features. Nobody commits feature work directly to `main`.

Each member works on their own long-lived branch:
- `raad-dev`
- `hafizur-dev`
- `shihab-dev`

```
git checkout main
git pull
git checkout -b <your-name>-dev   # first time only
```

Before starting each new module, sync with main so you have everyone's merged work:
```
git checkout main
git pull
git checkout <your-name>-dev
git merge main
```

When a module's feature is complete and demoed in lab, open a Pull Request into `main` so the rest of the team gets it on their next sync.

## Shared conventions (don't duplicate these per feature)
- Auth: use `useAuth()` from `client/src/context/AuthContext.jsx` — don't write a second login system.
- API calls: use `apiFetch()` from `client/src/api/client.js` — it already attaches the JWT.
- Protected backend routes: use `protect` + `requireRole()` from `server/middleware/authMiddleware.js`.
- Theme colors: `bg-primary-red`, `bg-dark-red`, `bg-light-red-bg` (Tailwind classes, defined in `client/src/index.css`). Don't hardcode hex values in components.
- Navbar: reuse `client/src/components/Navbar.jsx`, pass your page name as the `active` prop.
