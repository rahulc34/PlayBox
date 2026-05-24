# Deploy PlayBox on Render (monorepo)

This repo contains **Frontend/** and **Backend/** in one Git repository. Render deploys both with a single **Web Service** (recommended): the API serves the built React app on the same URL, so login cookies work without extra CORS setup.

## Prerequisites

1. [Render](https://render.com) account  
2. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster  
3. [Cloudinary](https://cloudinary.com) account (uploads)  
4. Gmail app password (or other SMTP) for verification / reset emails  

## 1. Push code to GitHub

```bash
git add .
git commit -m "Add Render deployment config"
git push origin main
```

## 2. Create the service from Blueprint

1. Render Dashboard → **New** → **Blueprint**  
2. Connect your GitHub repo (`PlayBox`)  
3. Render reads [`render.yaml`](./render.yaml) and creates the **playbox** web service  

## 3. Set environment variables

In the service → **Environment**, add secrets (copy from your local `Backend/.env`):

| Variable | Notes |
|----------|--------|
| `MONGODB_URI` | Atlas URI, e.g. `mongodb+srv://user:pass@cluster.mongodb.net` |
| `ACCESS_TOKEN_SECRET` | Long random string |
| `REFRESH_TOKEN_SECRET` | Long random string |
| `RESET_PASSWORD_SECRET` | Long random string |
| `EMAIL_VERIFY_SECRET` | Long random string |
| `CLOUDINARY_*` | Cloud name, API key, secret |
| `NODEMAILER_EMAIL` | Sender email |
| `NODEMAILER_APP_PASSWORD` | Gmail app password |
| `CLIENT_ORIGIN` | **`https://playbox.onrender.com`** (your Render URL, no trailing slash) |

These are already set in `render.yaml` (do not change unless you know why):

- `NODE_ENV=production`  
- `SERVE_FRONTEND=true`  
- Token expiry defaults  

**Do not set `VITE_API_URL`** for the single-service setup (frontend uses relative `/api` paths).

### MongoDB Atlas

- **Network Access** → allow `0.0.0.0/0` (or Render’s outbound IPs if you restrict)  
- Database name is defined in code (`DB_NAME` in `Backend/src/constants.js`)  

## 4. Deploy

Render runs:

```bash
npm ci --prefix Frontend && npm run build --prefix Frontend
npm ci --prefix Backend --omit=dev
npm start --prefix Backend
```

When the deploy succeeds, open your service URL (e.g. `https://playbox.onrender.com`).

Update `CLIENT_ORIGIN` to match that URL exactly if you change the service name.

## Local production-style test

```bash
cd Frontend && npm run build
cd ../Backend
SERVE_FRONTEND=true CLIENT_ORIGIN=http://localhost:3000 npm start
```

Open `http://localhost:3000`.

---

## Alternative: two Render services (API + static site)

Use this only if you want the frontend on a separate URL (e.g. static site + API). You must set `VITE_API_URL` at **build time** and configure CORS + `sameSite: none` cookies.

**API service** (`rootDir: Backend`):

- Build: `npm install`  
- Start: `npm start`  
- `SERVE_FRONTEND` = unset or `false`  
- `CLIENT_ORIGIN` = `https://your-frontend.onrender.com`  

**Static site** (`rootDir: Frontend`):

- Build: `npm install && npm run build`  
- Publish: `dist`  
- Env: `VITE_API_URL=https://your-api.onrender.com`  

Add a rewrite rule `/*` → `/index.html` for client-side routing.

---

## Troubleshooting

| Issue | Fix |
|--------|-----|
| Build fails on `npm ci` | Ensure `package-lock.json` is committed in `Frontend/` and `Backend/` |
| `Cannot find package '@vitejs/plugin-react'` | Frontend build needs devDependencies; `render.yaml` uses `npm ci --prefix Frontend --include=dev` |
| DB connection failed | Check `MONGODB_URI` and Atlas IP allowlist |
| Login works locally, not on Render | Set `CLIENT_ORIGIN` to the exact public URL; for single-service, keep `SERVE_FRONTEND=true` |
| 404 on refresh | Single-service serves `index.html` for non-API routes; static-only deploy needs SPA rewrite |
| Email links go to localhost | Set `CLIENT_ORIGIN` in Render env |
