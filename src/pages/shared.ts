export const baseCss = `
:root{--bg:#0b0b10;--panel:#14141c;--panel2:#1b1b26;--border:#272736;--text:#ececf3;--muted:#9a9ab0;--accent:#c084fc;--accent2:#f472b6;--ok:#4ade80;--code:#0f0f16}
@media (prefers-color-scheme:light){:root{--bg:#f7f7fb;--panel:#fff;--panel2:#f0f0f7;--border:#e1e1ec;--text:#16161f;--muted:#5d5d73;--accent:#9333ea;--accent2:#db2777;--ok:#16a34a;--code:#f3f3f9}}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
code,pre,input,select,button{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.nav{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:20px;padding:14px 24px;background:color-mix(in srgb,var(--bg) 85%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
.brand{font-weight:800;font-size:18px;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.nav a.link{color:var(--muted);font-size:14px}.nav a.link:hover{color:var(--text);text-decoration:none}.spacer{flex:1}
.badge{font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:6px;background:var(--panel2);color:var(--muted);border:1px solid var(--border)}
.wrap{max-width:1000px;margin:0 auto;padding:0 24px}
`

export const navHtml = (active: 'home' | 'docs') => `
<nav class="nav">
  <a class="brand" href="/">JioSaavn API</a><span class="badge">Unofficial</span>
  <span class="spacer"></span>
  <a class="link" href="/" ${active === 'home' ? 'style="color:var(--text)"' : ''}>Home</a>
  <a class="link" href="/docs" ${active === 'docs' ? 'style="color:var(--text)"' : ''}>Docs</a>
</nav>`

export const page = (title: string, description: string, css: string, body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta name="color-scheme" content="dark light" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8E%B5%3C/text%3E%3C/svg%3E" />
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>`
