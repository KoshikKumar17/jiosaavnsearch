import { baseCss, navHtml, page } from './shared.js'
import { endpoints } from './docs-data.js'

const css =
  baseCss +
  `
.layout{display:grid;grid-template-columns:230px 1fr;gap:40px;max-width:1180px;margin:0 auto;padding:0 24px}
aside{position:sticky;top:64px;align-self:start;max-height:calc(100vh - 64px);overflow:auto;padding:28px 0}
aside h4{margin:18px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
aside a{display:block;padding:4px 10px;border-radius:6px;color:var(--text);font-size:14px}
aside a:hover{background:var(--panel2);text-decoration:none}
main{padding:28px 0 80px;min-width:0}
main h1{margin:0 0 6px;font-size:32px}
.lead{color:var(--muted);margin:0 0 22px}
.box{border:1px solid var(--border);background:var(--panel);border-radius:12px;padding:16px 18px;margin-bottom:14px}
.box h3{margin:0 0 6px;font-size:15px}.box p{margin:0;color:var(--muted);font-size:14.5px}
pre,.code{background:var(--code);border:1px solid var(--border);border-radius:10px;padding:14px;overflow:auto;font-size:13px;margin:8px 0 0;white-space:pre-wrap;word-break:break-word}
code.i{background:var(--panel2);padding:1px 6px;border-radius:5px;font-size:13px}
.grp{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:40px 0 12px}
.ep{border:1px solid var(--border);background:var(--panel);border-radius:14px;padding:20px;margin-bottom:18px;scroll-margin-top:76px}
.ep h3{margin:0 0 4px;font-size:18px}
.route{display:flex;gap:10px;align-items:center;margin:8px 0 10px;font-size:14px;word-break:break-all}
.m{background:color-mix(in srgb,var(--ok) 18%,transparent);color:var(--ok);font-weight:700;font-size:12px;padding:2px 8px;border-radius:6px}
.ep p.d{margin:0 0 12px;color:var(--muted);font-size:14.5px}
table{width:100%;border-collapse:collapse;font-size:13.5px;margin:6px 0 14px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--border);vertical-align:top}
th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.req{color:var(--accent2);font-size:11px;font-weight:700;margin-left:6px}
.tag{font-size:11px;color:var(--muted)}
.tryit{border-top:1px dashed var(--border);padding-top:14px}
.fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:10px}
.fields label{display:block;font-size:12px;color:var(--muted);margin-bottom:3px}
.fields input,.fields select{width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px}
.fields input:focus,.fields select:focus{outline:2px solid var(--accent);border-color:transparent}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.send{padding:8px 18px;border:0;border-radius:8px;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#fff;font-weight:600;cursor:pointer;font-size:13px}
.send:disabled{opacity:.6;cursor:wait}
.ghost{padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;font-size:13px}
.url{font-size:12px;color:var(--muted);word-break:break-all;flex:1;min-width:200px}
.res{display:none;margin-top:10px}
.res .st{font-size:12px;color:var(--muted);margin-bottom:4px}
.res pre{max-height:380px;margin:0}
@media(max-width:820px){.layout{grid-template-columns:1fr;gap:0}aside{position:static;max-height:none;padding:16px 0;border-bottom:1px solid var(--border)}}
`

const script = `
var EPS=window.__EPS__;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function slug(p){return p.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'root'}
var groups={},order=[];
EPS.forEach(function(e,i){e.i=i;if(!groups[e.group]){groups[e.group]=[];order.push(e.group)}groups[e.group].push(e)});

var side='<h4>Guide</h4><a href="#intro">Introduction</a><a href="#format">Response format</a><a href="#errors">Errors</a>';
order.forEach(function(g){side+='<h4>'+esc(g)+'</h4>'+groups[g].map(function(e){return '<a href="#'+slug(e.path)+'">'+esc(e.title)+'</a>'}).join('')});
document.getElementById('side').innerHTML=side;

function buildUrl(e,box){
  var path=e.path,qs=[];
  e.params.forEach(function(p){
    var el=box.querySelector('[data-n="'+p.name+'"]'),v=el?el.value.trim():'';
    if(p.in==='path'){path=path.replace('{'+p.name+'}',encodeURIComponent(v||('{'+p.name+'}')))}
    else if(v){qs.push(encodeURIComponent(p.name)+'='+encodeURIComponent(v))}
  });
  return path+(qs.length?'?'+qs.join('&'):'');
}

var html='';
order.forEach(function(g){
  html+='<div class="grp">'+esc(g)+'</div>';
  groups[g].forEach(function(e){
    html+='<section class="ep" id="'+slug(e.path)+'" data-i="'+e.i+'"><h3>'+esc(e.title)+'</h3>';
    html+='<div class="route"><span class="m">'+e.method+'</span><code>'+esc(e.path)+'</code></div><p class="d">'+esc(e.description)+'</p>';
    if(e.params.length){
      html+='<table><thead><tr><th>Parameter</th><th>In</th><th>Description</th></tr></thead><tbody>';
      e.params.forEach(function(p){
        html+='<tr><td><code class="i">'+esc(p.name)+'</code>'+(p.required?'<span class="req">REQUIRED</span>':'')+'</td><td class="tag">'+p.in+'</td><td>'+esc(p.description)+(p.default?' <span class="tag">Default: '+esc(p.default)+'</span>':'')+'</td></tr>';
      });
      html+='</tbody></table>';
    }
    html+='<div class="tryit"><div class="fields">';
    e.params.forEach(function(p){
      html+='<div><label>'+esc(p.name)+(p.required?' *':'')+'</label>';
      if(p.options){html+='<select data-n="'+esc(p.name)+'">'+p.options.map(function(o){return '<option value="'+esc(o)+'">'+(o||'(none)')+'</option>'}).join('')+'</select>'}
      else{html+='<input data-n="'+esc(p.name)+'" value="'+esc(p.example||'')+'" placeholder="'+esc(p.default||'')+'" autocomplete="off">'}
      html+='</div>';
    });
    html+='</div><div class="row"><button class="send">Send request</button><button class="ghost cp">Copy cURL</button><span class="url"></span></div>';
    html+='<div class="res"><div class="st"></div><pre></pre></div></div></section>';
  });
});
document.getElementById('eps').innerHTML=html;

document.querySelectorAll('.ep').forEach(function(box){
  var e=EPS[+box.getAttribute('data-i')],urlEl=box.querySelector('.url');
  function refresh(){urlEl.textContent=location.origin+buildUrl(e,box)}
  box.addEventListener('input',refresh);refresh();
  box.querySelector('.cp').addEventListener('click',function(ev){
    var b=ev.target,c='curl "'+location.origin+buildUrl(e,box)+'"';
    if(navigator.clipboard){navigator.clipboard.writeText(c).then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy cURL'},1200)})}
  });
  box.querySelector('.send').addEventListener('click',function(ev){
    var btn=ev.target,res=box.querySelector('.res'),st=res.querySelector('.st'),pre=res.querySelector('pre'),t0=performance.now();
    btn.disabled=true;res.style.display='block';st.textContent='Loading…';pre.textContent='';
    fetch(buildUrl(e,box)).then(function(r){
      return r.text().then(function(t){
        st.textContent=r.status+' '+r.statusText+' · '+Math.round(performance.now()-t0)+' ms';
        try{pre.textContent=JSON.stringify(JSON.parse(t),null,2)}catch(x){pre.textContent=t.slice(0,4000)}
      });
    }).catch(function(err){st.textContent='Request failed';pre.textContent=String(err)}).then(function(){btn.disabled=false});
  });
});
`

export const docsHtml = () =>
  page(
    'Docs · JioSaavn API',
    'Documentation for the unofficial JioSaavn API with live request tester.',
    css,
    `${navHtml('docs')}
<div class="layout">
  <aside id="side"></aside>
  <main>
    <h1 id="intro">API documentation</h1>
    <p class="lead">Every endpoint is a <code class="i">GET</code> request that returns JSON. CORS is open, no API key is needed. Use the <b>Send request</b> button under each endpoint to try it live.</p>

    <div class="box" id="format"><h3>Response format</h3>
      <p>Every response uses the same envelope.</p>
<pre>{
  "status": "SUCCESS" | "FAILED",
  "message": null | "error text",
  "data": { ... } | null
}</pre></div>

    <div class="box" id="errors"><h3>Errors</h3>
      <p><code class="i">400</code> invalid or missing parameters, <code class="i">404</code> not found, <code class="i">503</code> the JioSaavn upstream failed or blocked the request, <code class="i">500</code> unexpected error. Failed responses always have <code class="i">status: "FAILED"</code> and a readable <code class="i">message</code>.</p></div>

    <div class="box"><h3>Download qualities</h3>
      <p>Song objects contain <code class="i">downloadUrl</code>, an array of <code class="i">{ quality, link }</code> for 12kbps, 48kbps, 96kbps, 160kbps and 320kbps, and <code class="i">image</code> for 50x50, 150x150 and 500x500.</p></div>

    <div id="eps"></div>
  </main>
</div>
<script>window.__EPS__=${JSON.stringify(endpoints).replace(/</g, '\\u003c')};${script}</script>`
  )
