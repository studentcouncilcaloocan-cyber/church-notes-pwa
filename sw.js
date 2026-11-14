const CACHE="mcgi-notes-v1-5-0-ui-20261115";
const ASSETS=["./","./index.html","./styles.css","./app.js","./smart-format.js","./passage.js","./bible-api.js","./offline-bible.js","./bible-companion.js","./backup.js","./manifest.webmanifest","./icon.svg","./favicon-32.png","./favicon-48.png","./apple-touch-icon.png","./icon-192.png","./icon-512.png","./splash.js","./mcgi-notes-logo.png","./mcgi-notes-brand.png"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET"||new URL(req.url).origin!==self.location.origin)return;
 // Always check the network first for navigation and versioned assets; use cache offline.
 if(req.mode==="navigate"||new URL(req.url).searchParams.has("v")){
  event.respondWith(fetch(req).then(response=>{if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,clone)))}return response}).catch(()=>caches.match(req,{ignoreSearch:true}).then(hit=>hit||caches.match("./index.html"))));
  return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,clone)))}return response})));
});
