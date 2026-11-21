import { baseCss, navHtml, page } from './shared.js'

const css =
  baseCss +
  `
.hero{padding:88px 0 40px;text-align:center}
.hero h1{font-size:clamp(36px,7vw,64px);line-height:1.08;margin:0 0 16px;letter-spacing:-.02em}
.grad{background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{color:var(--muted);font-size:18px;max-width:640px;margin:0 auto 28px}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn{padding:11px 22px;border-radius:10px;font-weight:600;font-size:15px;border:1px solid var(--border);color:var(--text);background:var(--panel)}
.btn:hover{text-decoration:none;border-color:var(--accent)}
.btn.primary{background:linear-gradient(90deg,var(--accent),var(--accent2));color:#fff;border:0}
.try{margin:36px auto 0;max-width:640px;text-align:left}
.try form{display:flex;gap:8px}
.try input{flex:1;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:var(--panel);color:var(--text);font-size:15px;min-width:0}
.try input:focus{outline:2px solid var(--accent);border-color:transparent}
.try button{padding:0 18px;border-radius:10px;border:0;background:var(--accent);color:#fff;font-weight:600;cursor:pointer}
#results{margin-top:14px;display:grid;gap:8px}
.song{display:flex;gap:12px;align-items:center;padding:10px;border:1px solid var(--border);border-radius:12px;background:var(--panel)}
.song img{width:52px;height:52px;border-radius:8px;object-fit:cover;background:var(--panel2)}
.song .t{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.song .s{color:var(--muted);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.song .m{min-width:0;flex:1}.song a{font-size:13px}
.msg{color:var(--muted);font-size:14px;padding:6px 2px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:56px 0}
.card{padding:22px;border:1px solid var(--border);border-radius:14px;background:var(--panel)}
.card h3{margin:0 0 6px;font-size:17px}.card p{margin:0;color:var(--muted);font-size:14.5px}
.card .ic{font-size:24px;margin-bottom:8px}
h2{font-size:24px;margin:48px 0 14px}
pre{background:var(--code);border:1px solid var(--border);border-radius:12px;padding:16px;overflow:auto;font-size:13.5px;margin:0}
.eps{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:8px;margin-bottom:28px}
.ep{padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--panel);font-size:13.5px;display:flex;gap:10px}
.get{color:var(--ok);font-weight:700}
footer{border-top:1px solid var(--border);padding:28px 0;color:var(--muted);font-size:13.5px;text-align:center;margin-top:48px}
`

const script = `
var form=document.getElementById('f'),q=document.getElementById('q'),out=document.getElementById('results');
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
form.addEventListener('submit',function(e){
  e.preventDefault();
  var v=q.value.trim(); if(!v) return;
  out.innerHTML='<div class="msg">Searching…</div>';
  fetch('/search/songs?limit=5&query='+encodeURIComponent(v)).then(function(r){return r.json()}).then(function(j){
    if(j.status!=='SUCCESS'){out.innerHTML='<div class="msg">'+esc(j.message)+'</div>';return}
    var list=(j.data&&j.data.results)||[];
    if(!list.length){out.innerHTML='<div class="msg">No results.</div>';return}
    out.innerHTML=list.map(function(s){
      var img=(s.image&&s.image[1]&&s.image[1].link)||'';
      var dl=(s.downloadUrl&&s.downloadUrl[4]&&s.downloadUrl[4].link)||(s.downloadUrl&&s.downloadUrl[0]&&s.downloadUrl[0].link)||'';
      var artists=(s.primaryArtists)||'';
      return '<div class="song"><img src="'+esc(img)+'" alt="" loading="lazy"><div class="m"><div class="t">'+esc(s.name)+'</div><div class="s">'+esc(artists)+(s.album&&s.album.name?' · '+esc(s.album.name):'')+'</div></div>'+(dl?'<a href="'+esc(dl)+'" target="_blank" rel="noopener">320kbps</a>':'')+'</div>';
    }).join('');
  }).catch(function(err){out.innerHTML='<div class="msg">Request failed: '+esc(err.message)+'</div>'});
});
`

export const homeHtml = () =>
  page(
    'JioSaavn API',
    'Unofficial JioSaavn API: search songs, albums, artists and playlists, get 320kbps links and lyrics.',
    css,
    `${navHtml('home')}
<main class="wrap">
  <section class="hero">
    <h1>The <span class="grad">JioSaavn</span> API,<br/>self-hosted anywhere.</h1>
    <p>Search songs, albums, artists and playlists. Get lyrics and download links up to 320kbps. Runs on Cloudflare, Vercel, Netlify, Render or Docker.</p>
    <div class="btns">
      <a class="btn primary" href="/docs">Read the docs</a>
      <a class="btn" href="/search/songs?query=arijit&limit=3">Try an endpoint</a>
    </div>
    <div class="try">
      <form id="f"><input id="q" placeholder="Search a song, e.g. Kesariya" autocomplete="off" /><button type="submit">Search</button></form>
      <div id="results"></div>
    </div>
  </section>

  <section class="grid">
    <div class="card"><div class="ic">🔎</div><h3>Search everything</h3><p>Songs, albums, artists and playlists with pagination.</p></div>
    <div class="card"><div class="ic">🎧</div><h3>Up to 320kbps</h3><p>Every song comes with links for 12, 48, 96, 160 and 320kbps.</p></div>
    <div class="card"><div class="ic">📝</div><h3>Lyrics</h3><p>Fetch lyrics for supported songs by song id.</p></div>
    <div class="card"><div class="ic">☁️</div><h3>Deploy anywhere</h3><p>One codebase for Workers, Vercel, Netlify, Render and Docker.</p></div>
  </section>

  <h2>Endpoints</h2>
  <div class="eps">
    <div class="ep"><span class="get">GET</span><code>/search/all</code></div>
    <div class="ep"><span class="get">GET</span><code>/search/songs</code></div>
    <div class="ep"><span class="get">GET</span><code>/search/albums</code></div>
    <div class="ep"><span class="get">GET</span><code>/search/artists</code></div>
    <div class="ep"><span class="get">GET</span><code>/search/playlists</code></div>
    <div class="ep"><span class="get">GET</span><code>/songs</code></div>
    <div class="ep"><span class="get">GET</span><code>/albums</code></div>
    <div class="ep"><span class="get">GET</span><code>/artists</code></div>
    <div class="ep"><span class="get">GET</span><code>/playlists</code></div>
    <div class="ep"><span class="get">GET</span><code>/lyrics</code></div>
    <div class="ep"><span class="get">GET</span><code>/modules</code></div>
  </div>

  <h2>Quick start</h2>
<pre>curl "/search/songs?query=kesariya&amp;limit=1"

{
  "status": "SUCCESS",
  "message": null,
  "data": { "total": 1, "start": 1, "results": [ ... ] }
}</pre>
  <footer>Unofficial project, not affiliated with JioSaavn. For personal and educational use.<p></p><a href="/docs"><b>Docs</b></a> • <a href="https://github.com/KoshikKumar17/jiosaavnsearch"><b>GitHub</b></a> • <a href="https://koshik.pages.dev"><b>Contact</b></a></footer>
</main>
<script>${script}</script>`
  )
