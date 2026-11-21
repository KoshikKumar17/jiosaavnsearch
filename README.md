# JioSaavn API

Unofficial JioSaavn API (search, songs, albums, artists, playlists, lyrics, up to 320kbps links).
One codebase (Hono + fetch), deployable on Cloudflare Workers, Vercel, Netlify, Render or Docker.

- Homepage: `/`
- Documentation with a live request tester: `/docs`
- Health check: `/health`

## Local development

```sh
npm install
npm run dev        # http://localhost:3000
npm run dev:cf     # same app on the Workers runtime (wrangler)
```

## Deploy

| Platform | How |
| --- | --- |
| **Cloudflare** | Connect the repo as a Worker. Build command: *(empty)*. Deploy command: `npx wrangler deploy`. Or run `npm run deploy:cf`. |
| **Vercel** | Import the repo. No build command, no framework preset. `vercel.json` routes everything to `api/index.ts`. |
| **Netlify** | Import the repo. No build command. `netlify.toml` and `netlify/functions/api.mts` handle every path. |
| **Render** | New Blueprint from the repo (uses `render.yaml`), or a Web Service with build `npm install` and start `npm start`. |
| **Docker / VPS / Railway / Fly** | `docker build -t jiosaavnsearch . && docker run -p 3000:3000 jiosaavnsearch` |

## Layout

- `src/app.ts`: the whole app (routes), platform independent
- `src/index.ts`: Cloudflare Workers entry
- `src/node.ts`: Node server entry (Render, Docker, local)
- `api/index.ts`: Vercel entry
- `netlify/functions/api.mts`: Netlify entry
- `src/pages/`: homepage and docs

## Note

JioSaavn may block or geo-restrict requests coming from some hosting providers' IP ranges. If every
data endpoint returns 503 ("upstream returned ..."), try another platform or region.

Unofficial project, not affiliated with JioSaavn. MIT licensed.

## Credits 

This is a lightweight fork/clone of [jiosaavn-api](https://github.com/sumitkolhe/jiosaavn-api) by [@sumitkolhe](https://github.com/sumitkolhe).

---
