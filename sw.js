/* Calendar: keeps the app itself on the device so it opens without internet. Data is handled by the page (local storage + GitHub sync). */
const V="calendar-20261030182356";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./config.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const timeout=(p,ms)=>new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error("timeout")),ms);p.then(r=>{clearTimeout(t);res(r)},e=>{clearTimeout(t);rej(e)})});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);
  if(u.origin===self.location.origin){
    e.respondWith(timeout(fetch(req),4000).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(req,cp))}return r})
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match("./index.html"))));return}
  if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(req,cp));return res}).catch(()=>new Response("",{status:504}))))}
});
