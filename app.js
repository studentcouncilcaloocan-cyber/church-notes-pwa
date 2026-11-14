(()=>{"use strict";
const $=s=>document.querySelector(s);
const ICONS={home:'house',notes:'notebook-pen',calendar:'calendar-days',bookmarks:'bookmark',categories:'folders',bible:'book-open',songs:'music-2',prayer:'hand-heart',settings:'settings',backup:'download',wisdom:'messages-square',save:'save',duplicate:'copy',delete:'trash-2',rename:'pencil'};
const PATHS={house:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>', 'notebook-pen':'<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M8 6h5M8 10h3M8 14h4"/><path d="m15 5 4-4 4 4-9 9-4 1 1-4z"/>','calendar-days':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"/>',bookmark:'<path d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-5-7 5z"/>',folders:'<path d="M3 7V5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2"/><rect x="2" y="8" width="20" height="13" rx="2"/>','book-open':'<path d="M12 7c-3-2-6-2-10-2v15c4 0 7 0 10 2 3-2 6-2 10-2V5c-4 0-7 0-10 2zM12 7v15"/>','music-2':'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>','hand-heart':'<path d="M12 21s-8-4.5-8-10a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 11c0 5.5-8 10-8 10z"/><path d="M2 19l4 2M22 19l-4 2"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19 13a7 7 0 0 0 0-2l2-1-2-4-2 1a7 7 0 0 0-2-1l-1-3h-4l-1 3a7 7 0 0 0-2 1L5 6l-2 4 2 1a7 7 0 0 0 0 2l-2 1 2 4 2-1a7 7 0 0 0 2 1l1 3h4l1-3a7 7 0 0 0 2-1l2 1 2-4z"/>','messages-square':'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.4 8.4 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z"/><path d="M8 10h8M8 14h5"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',save:'<path d="M4 3h14l3 3v15H3V3zM7 3v7h10V3M7 21v-8h10v8"/>',copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>','trash-2':'<path d="M3 6h18M8 6V4h8v2M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',pencil:'<path d="m4 20 4-.8L20 7a2 2 0 0 0-3-3L5 16zM14 7l3 3"/>'};
function lineIcon(name){return `<svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[ICONS[name]||name]||PATHS.house}</svg>`}
const pages=[["home","⌂ Home"],["notes","▤ All Notes"],["calendar","▦ Calendar"],["bookmarks","☆ Bookmarks"],["categories","◈ Categories"],["bible","📖 Bible"],["songs","♫ Songs of Faith"],["prayer","♡ Community Prayer"],["wisdom","Words of Wisdom"],["settings","⚙ Settings"],["backup","⇩ Backup & Restore"]];
let db,notes=[],categories=[],activeId=null,dirty=false,saveTimer=null,renderToken=0,month=new Date().getMonth(),year=new Date().getFullYear(),selectedDay=null,installPrompt=null;
const defaultCats=["Thanksgiving","Worship Service","Prayer Meeting","Bible Exposition","Other"];
const id=()=>crypto.randomUUID?crypto.randomUUID():"n"+Date.now()+Math.random().toString(36).slice(2);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const textOf=html=>{const d=document.createElement("div");d.innerHTML=html||"";return d.textContent||""};
const dateStr=d=>{const x=new Date(d);return [x.getFullYear(),String(x.getMonth()+1).padStart(2,"0"),String(x.getDate()).padStart(2,"0")].join("-")};
const today=()=>dateStr(new Date());
const formatDate=s=>s?new Date(s+"T12:00:00").toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):"";
const tx=(store,mode="readonly")=>db.transaction(store,mode).objectStore(store);
const request=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
const all=store=>request(tx(store).getAll());
const put=(store,v)=>request(tx(store,"readwrite").put(v));
const del=(store,k)=>request(tx(store,"readwrite").delete(k));
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open("church-notes",2);r.onupgradeneeded=()=>{const d=r.result;for(const s of ["notes","categories","settings","bibleVersions"])if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:s==="settings"?"key":"id"})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
async function init(){try{db=await openDB();notes=await all("notes");categories=await all("categories");if(!categories.length){for(const name of defaultCats){const c={id:id(),name};await put("categories",c);categories.push(c)}}$("#status").textContent="● Local database ready";render()}catch(e){$("#status").textContent="Database unavailable";$("#content").innerHTML='<section class="card">IndexedDB unavailable. Enable browser storage to use notes.</section>';console.error(e)}}
function theme(){let p=localStorage.getItem("cn-theme")||"system";document.body.dataset.theme=p==="system"?(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):p;return p}
function setTheme(v){localStorage.setItem("cn-theme",v);theme();render()}
function closeDrawer(){document.body.classList.remove("drawer-open");$("#overlay").hidden=true;$("#menuBtn").setAttribute("aria-expanded","false")}
$("#menuBtn").onclick=()=>{const v=!document.body.classList.contains("drawer-open");document.body.classList.toggle("drawer-open",v);$("#overlay").hidden=!v;$("#menuBtn").setAttribute("aria-expanded",String(v))};$("#overlay").onclick=closeDrawer;addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawer()});
$("#themeBtn").onclick=()=>setTheme(document.body.dataset.theme==="light"?"dark":"light");
matchMedia("(prefers-color-scheme:dark)").addEventListener("change",()=>{if((localStorage.getItem("cn-theme")||"system")==="system"){theme();render()}});
function current(){return [...pages.map(p=>p[0]),"editor"].includes(location.hash.slice(1).split("/")[0])?location.hash.slice(1).split("/")[0]:"home"}
function route(p){closeDrawer();if(location.hash==="#"+p)render();else location.hash=p}
function nav(){const p=current();$("#nav").replaceChildren();for(const [key,label] of pages){const b=document.createElement("button");b.innerHTML=lineIcon(key)+`<span>${escapeHTML(label.replace(/^[^A-Za-z]+/,""))}</span>`;b.className=key===p?"active":"";b.onclick=()=>route(key);$("#nav").append(b)}}
function shell(title,subtitle){$("#content").innerHTML=`<h1>${title}</h1><p class="muted lead">${subtitle}</p>`}
function noteList(arr,empty="No notes yet."){const wrap=document.createElement("section");wrap.className="card";if(!arr.length){wrap.innerHTML=`<p class="muted">${empty}</p>`;return wrap}for(const n of arr){const row=document.createElement("div");row.className="note-row";const btn=document.createElement("button");btn.className="open-note";btn.innerHTML=`<strong>${escapeHTML(n.title||"Untitled note")}</strong><p class="muted">${escapeHTML(textOf(n.body).slice(0,115)||"Empty note")}</p><span class="meta">${formatDate(n.date)} · ${escapeHTML(catName(n.categoryId))}${n.bookmarked?" · ★ Bookmarked":""}</span>`;btn.onclick=()=>openNote(n.id);row.append(btn);const star=document.createElement("button");star.textContent=n.bookmarked?"★":"☆";star.setAttribute("aria-label",n.bookmarked?"Remove bookmark":"Add bookmark");star.onclick=async()=>{n.bookmarked=!n.bookmarked;n.updatedAt=Date.now();await put("notes",n);render()};row.append(star);wrap.append(row)}return wrap}
function catName(cid){return categories.find(c=>c.id===cid)?.name||"Uncategorized"}
function sorted(arr){return [...arr].sort((a,b)=>b.updatedAt-a.updatedAt)}
function home(){
  // The Home heading is an independent sibling of #content; Bible card rendering cannot erase it.
  const content=$("#content");
  content.replaceChildren();
  try{window.ChurchNotesBible?.companion("share",content)}
  catch(error){console.error("Bible share card failed to mount",error);const warning=document.createElement("p");warning.className="muted";warning.textContent="Bible card temporarily unavailable. Your notes are safe.";content.append(warning)}
  const recent=document.createElement("h2");recent.textContent="Recent notes";recent.style.marginTop="28px";
  content.append(recent,noteList(sorted(notes).slice(0,5)));
}
function library(bookmarks=false){shell(bookmarks?"Bookmarks":"All Notes",bookmarks?"Your pinned notes.":"Find, filter and organize your notes.");const filters=document.createElement("div");filters.className="filters";const search=document.createElement("input");search.placeholder="Search title, text, or category";search.setAttribute("aria-label","Search notes");const select=document.createElement("select");select.innerHTML='<option value="">All categories</option>'+categories.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)}</option>`).join("");const sort=document.createElement("select");sort.innerHTML='<option value="recent">Recently edited</option><option value="date">Gathering date</option><option value="title">Title A–Z</option>';const newBtn=document.createElement("button");newBtn.textContent="+ New Note";newBtn.className="primary";newBtn.onclick=createNote;filters.append(search,select,sort,newBtn);$("#content").append(filters);const holder=document.createElement("div");$("#content").append(holder);function update(){const q=search.value.trim().toLocaleLowerCase();let list=notes.filter(n=>(!bookmarks||n.bookmarked)&&(!select.value||n.categoryId===select.value)&&(!q||[n.title,textOf(n.body),catName(n.categoryId)].some(s=>s.toLocaleLowerCase().includes(q))));list=[...list].sort((a,b)=>sort.value==="title"?(a.title||"").localeCompare(b.title||""):sort.value==="date"?(b.date||"").localeCompare(a.date||""):b.updatedAt-a.updatedAt);holder.replaceChildren(noteList(list,"No matching notes."))}search.oninput=select.onchange=sort.onchange=update;update()}
async function createNote(){if(!db)return;const n={id:id(),title:"",body:"",date:today(),categoryId:categories[0]?.id||"",bookmarked:false,createdAt:Date.now(),updatedAt:Date.now()};await put("notes",n);notes.push(n);openNote(n.id)}
function openNote(nid){activeId=nid;route("editor/"+nid)}
function cleanHTML(html){const t=document.createElement("template");t.innerHTML=html;const allowed=new Set(["P","DIV","BR","B","STRONG","I","EM","U","S","H1","H2","H3","UL","OL","LI","BLOCKQUOTE","A"]);function walk(node){for(const child of [...node.childNodes]){if(child.nodeType===8){child.remove();continue}if(child.nodeType!==1)continue;if(!allowed.has(child.tagName)){const fragment=document.createDocumentFragment();while(child.firstChild)fragment.append(child.firstChild);child.replaceWith(fragment);walk(node);continue}for(const a of [...child.attributes]){if(child.tagName==="A"&&a.name==="href"&&/^https?:\/\//i.test(a.value))continue;child.removeAttribute(a.name)}if(child.tagName==="A"){child.setAttribute("rel","noopener noreferrer");child.setAttribute("target","_blank")}walk(child)}}walk(t.content);return t.innerHTML}
async function persist(n,controls){n.title=controls.title.value.trim();n.body=cleanHTML(controls.body.innerHTML);n.date=controls.date.value||today();n.categoryId=controls.category.value;n.bookmarked=controls.bookmark.checked;n.updatedAt=Date.now();await put("notes",n);dirty=false;controls.status.textContent="Saved locally · "+new Date().toLocaleTimeString();return n}
async function flush(){if(!dirty)return;clearTimeout(saveTimer);const n=notes.find(n=>n.id===activeId);if(n&&editorControls)await persist(n,editorControls)}
let editorControls=null;
function editor(){const nid=location.hash.split("/")[1]||activeId;const n=notes.find(n=>n.id===nid);if(!n){shell("Notes Editor","Create a note to start writing.");const b=document.createElement("button");b.className="primary";b.textContent="+ Create Note";b.onclick=createNote;$("#content").append(b);return}activeId=n.id;shell("Notes Editor","Changes save automatically to this device.");const c=document.createElement("section");c.className="card";c.innerHTML=`<input class="note-title" id="noteTitle" aria-label="Note title" placeholder="Note title"><div class="filters"><div class="field"><label for="noteDate">Gathering date</label><input type="date" id="noteDate"></div><div class="field"><label for="noteCat">Category</label><select id="noteCat"></select></div><label class="field"><span>Bookmark</span><input type="checkbox" id="noteStar"></label></div><div class="toolbar" aria-label="Formatting toolbar"><button data-cmd="bold" title="Bold"><b>B</b></button><button data-cmd="italic" title="Italic"><i>I</i></button><button data-cmd="underline" title="Underline"><u>U</u></button><button data-cmd="insertUnorderedList" title="Bulleted list">• List</button><button data-cmd="insertOrderedList" title="Numbered list">1. List</button><select id="blockFormat" aria-label="Text format"><option value="p">Paragraph</option><option value="h2">Heading</option><option value="blockquote">Quote</option></select><button data-cmd="undo" title="Undo">↶</button><button data-cmd="redo" title="Redo">↷</button></div><div id="noteBody" class="editor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Note content" data-placeholder="Write your church notes here…"></div><div class="actions"><span id="saveStatus" class="statusline" role="status">Saved locally</span><button id="saveNow" class="compact-icon" title="Save now" aria-label="Save now">${lineIcon("save")}</button><button id="duplicate" class="compact-icon" title="Duplicate note" aria-label="Duplicate note">${lineIcon("duplicate")}</button><button id="deleteNote" class="compact-icon danger" title="Delete note" aria-label="Delete note">${lineIcon("delete")}</button></div><p class="muted">Type a Bible reference (e.g., Kawikaan 22:6) to see an inline suggestion.</p>`;$("#content").append(c);
const controls={title:$("#noteTitle"),body:$("#noteBody"),date:$("#noteDate"),category:$("#noteCat"),bookmark:$("#noteStar"),status:$("#saveStatus")};editorControls=controls;controls.title.value=n.title;controls.body.innerHTML=cleanHTML(n.body);window.ChurchNotesBible?.editorReferences(controls.body);window.MCGISmartFormat?.install(controls.body);controls.date.value=n.date;controls.category.innerHTML=categories.map(x=>`<option value="${escapeHTML(x.id)}">${escapeHTML(x.name)}</option>`).join("");controls.category.value=n.categoryId;controls.bookmark.checked=!!n.bookmarked;
function schedule(){dirty=true;controls.status.textContent="Unsaved changes…";clearTimeout(saveTimer);const target=n.id;saveTimer=setTimeout(async()=>{if(activeId===target&&editorControls===controls){try{await persist(n,controls)}catch(e){controls.status.textContent="Save failed — retry";console.error(e)}}},500)}
for(const el of [controls.title,controls.body,controls.date,controls.category,controls.bookmark]){el.addEventListener(el.tagName==="SELECT"||el.type==="date"||el.type==="checkbox"?"change":"input",schedule)}
for(const b of c.querySelectorAll("[data-cmd]"))b.onclick=()=>{controls.body.focus();document.execCommand(b.dataset.cmd,false,null);schedule()};
$("#blockFormat").onchange=e=>{controls.body.focus();document.execCommand("formatBlock",false,e.target.value);schedule()};
$("#saveNow").onclick=async()=>{clearTimeout(saveTimer);try{await persist(n,controls)}catch(e){controls.status.textContent="Save failed";console.error(e)}};
$("#duplicate").onclick=async()=>{await flush();const copy={...n,id:id(),title:(n.title||"Untitled")+" (copy)",createdAt:Date.now(),updatedAt:Date.now()};await put("notes",copy);notes.push(copy);openNote(copy.id)};
$("#deleteNote").onclick=async()=>{if(!confirm("Permanently delete this note? Backups are not available until Phase 4."))return;clearTimeout(saveTimer);dirty=false;await del("notes",n.id);notes=notes.filter(x=>x.id!==n.id);editorControls=null;activeId=null;route("notes")};
}
function calendar(){
 shell("Calendar","Watch out and keep updated with upcoming MCGI Events");
 const section=document.createElement("section");section.className="card official-calendar";
 section.innerHTML=`<h2>MCGI Events Calendar</h2><p class="muted">Official MCGI calendar (Asia/Manila). Events and updates require an internet connection.</p><iframe title="Official MCGI events calendar" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" src="https://calendar.google.com/calendar/embed?ctz=Asia%2FManila&amp;src=kv7ussft926ovggir3n9b2stb4%40group.calendar.google.com"></iframe><div class="actions"><a href="https://mcgi.org/event-calendar/" target="_blank" rel="noopener noreferrer">View official MCGI calendar</a><a href="https://www.facebook.com/MCGI.org" target="_blank" rel="noopener noreferrer">MCGI Facebook announcements</a></div><p class="muted">For the latest announcements, verify details on the official channels. The embedded calendar may not display when offline.</p>`;
 $("#content").append(section);
}
function categoryScreen(){shell("Categories","Use preset gatherings or add your own.");const form=document.createElement("form");form.className="filters";form.innerHTML='<input name="category" required maxlength="60" placeholder="New category name" aria-label="New category name"><button class="primary" type="submit">Add category</button>';form.onsubmit=async e=>{e.preventDefault();const name=form.elements.category.value.trim();if(!name||categories.some(c=>c.name.toLowerCase()===name.toLowerCase())){alert("Enter a unique category name.");return}const c={id:id(),name};await put("categories",c);categories.push(c);render()};$("#content").append(form);const list=document.createElement("section");list.className="card";for(const c of categories){const row=document.createElement("div");row.className="note-row";const label=document.createElement("span");label.textContent=c.name+" · "+notes.filter(n=>n.categoryId===c.id).length+" notes";const actions=document.createElement("div");actions.className="actions";const rename=document.createElement("button");rename.innerHTML=lineIcon("rename");rename.className="compact-icon";rename.title="Rename category";rename.setAttribute("aria-label","Rename category");rename.onclick=async()=>{const name=prompt("New category name:",c.name)?.trim();if(!name||categories.some(x=>x.id!==c.id&&x.name.toLowerCase()===name.toLowerCase()))return;c.name=name;await put("categories",c);render()};const remove=document.createElement("button");remove.innerHTML=lineIcon("delete");remove.className="compact-icon danger";remove.title="Delete category";remove.setAttribute("aria-label","Delete category");remove.onclick=async()=>{if(!confirm("Delete category? Its notes will remain Uncategorized."))return;for(const n of notes.filter(n=>n.categoryId===c.id)){n.categoryId="";await put("notes",n)}await del("categories",c.id);categories=categories.filter(x=>x.id!==c.id);render()};actions.append(rename,remove);row.append(label,actions);list.append(row)}$("#content").append(list)}
function settings(){shell("Settings","Personalize the offline application.");$("#content").insertAdjacentHTML("beforeend",`<section class="card"><h2>Appearance</h2><label for="themeSelect">Color theme</label> <select id="themeSelect"><option value="system">Follow system</option><option value="light">Light</option><option value="dark">Dark</option></select><p class="muted">Database: IndexedDB (this device only).</p><p class="muted">Notes are not synchronized across devices. Use Backup & Restore to export a portable JSON backup regularly.</p></section>`);$("#themeSelect").value=theme();$("#themeSelect").onchange=e=>setTheme(e.target.value);window.ChurchNotesBible?.companion("settings",$("#content"));window.MCGIOfflineBible?.render($("#content"),"settings")}
function bible(){shell("Bible","Read and search your downloaded Bible translations, even without internet.");window.MCGIOfflineBible?.render($("#content"),"combined")}
// Keep a single iframe alive when navigating, so a user-initiated mini-player continues playback.
let videoSession=null;
function stopVideo(){if(videoSession){videoSession.wrap.remove();videoSession=null}}
function videoPage(title,videoId,link){shell(title,title==="Songs of Faith"?"Listen to heavenly songs of faith in MCGI 24/7 Songs of Faith":"Offer thanksgiving to God and seek his guidance through MCGI Community Prayer");
 const section=document.createElement("section");section.className="card";section.id="videoPageCard";
 const dock=document.createElement("div");dock.className="video-dock";
 if(videoSession&&videoSession.videoId!==videoId)stopVideo();
 if(!videoSession){const wrap=document.createElement("div");wrap.className="video-session";const frame=document.createElement("div");frame.className="video-frame";const iframe=document.createElement("iframe");iframe.src=`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&controls=1`;iframe.title=title;iframe.referrerPolicy="strict-origin-when-cross-origin";iframe.allow="autoplay; encrypted-media; picture-in-picture; fullscreen";iframe.allowFullscreen=true;frame.append(iframe);
 const grip=document.createElement("div");grip.className="video-drag-handle";grip.textContent=title+" · Drag to move";grip.title="Drag floating player to move";wrap.append(grip);
 const controls=document.createElement("div");controls.className="video-session-controls";
 const minimize=document.createElement("button");minimize.textContent="Minimize / Floating Player";minimize.onclick=()=>{wrap.classList.add("is-floating");wrap.style.left="";wrap.style.top="";wrap.style.right="16px";wrap.style.bottom="16px";document.body.append(wrap);minimize.hidden=true;restore.hidden=false};
 const restore=document.createElement("button");restore.textContent="Restore player";restore.hidden=true;restore.onclick=()=>{wrap.classList.remove("is-floating");wrap.style.left="";wrap.style.top="";wrap.style.right="";wrap.style.bottom="";wrap.style.width="";wrap.style.height="";minimize.hidden=false;restore.hidden=true;const page=videoId==="TESSciFLbHI"?"songs":"prayer";if(current()!==page)route(page);setTimeout(()=>{const target=document.querySelector(".video-dock");if(target)target.append(wrap)},50)};
 const close=document.createElement("button");close.textContent="Close player";close.onclick=stopVideo;
 controls.append(minimize,restore,close);wrap.append(frame,controls);videoSession={videoId,wrap,restore,minimize};
 let drag=null;grip.addEventListener("pointerdown",e=>{if(!wrap.classList.contains("is-floating")||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:wrap.getBoundingClientRect().left,top:wrap.getBoundingClientRect().top};grip.setPointerCapture(e.pointerId);e.preventDefault()});
 grip.addEventListener("pointermove",e=>{if(!drag)return;const x=Math.max(0,Math.min(innerWidth-wrap.offsetWidth,drag.left+e.clientX-drag.x));const y=Math.max(0,Math.min(innerHeight-wrap.offsetHeight,drag.top+e.clientY-drag.y));wrap.style.left=x+"px";wrap.style.top=y+"px";wrap.style.right="auto";wrap.style.bottom="auto"});
 const finish=()=>{drag=null};grip.addEventListener("pointerup",finish);grip.addEventListener("pointercancel",finish);
 window.addEventListener("resize",()=>{if(!wrap.isConnected||!wrap.classList.contains("is-floating"))return;const r=wrap.getBoundingClientRect();if(r.right>innerWidth)wrap.style.left=Math.max(0,innerWidth-r.width-8)+"px";if(r.bottom>innerHeight)wrap.style.top=Math.max(0,innerHeight-r.height-8)+"px"});}
 if(videoSession.wrap.classList.contains("is-floating")){document.body.append(videoSession.wrap)}else dock.append(videoSession.wrap);
 section.append(dock);const note=document.createElement("p");note.className="muted";note.textContent="Playback requires internet. Browsers may block autoplay with sound; press Play to enable audio. Floating mode works inside MCGI Notes.";
 const a=document.createElement("a");a.href=link;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Open on YouTube";section.append(note,a);$("#content").append(section)}
function songs(){videoPage("Songs of Faith","TESSciFLbHI","https://www.youtube.com/live/TESSciFLbHI?si=hWGZ1LHFHNY30uXJ")}
function prayer(){videoPage("Community Prayer","IrrOMNqtkfo","https://www.youtube.com/live/IrrOMNqtkfo?si=j-nrqx28Z-8JxpN_")}


// Catalog is generated by scripts/update-wisdom-catalog.py in GitHub Actions.
const wisdomPlaylists=[
 {id:"PLmJ3Bi1uP3W4s9lwVghZVLwWRSlTofKM-",label:"Playlist 1"},
 {id:"PLmZPI_PuH8feJeC89b7z0q2jrAjZnOl2w",label:"Playlist 2"}
];
let wisdomCatalogCache=null;
async function loadWisdomCatalog(){
 try{
  const response=await fetch("./videos.json",{cache:"no-store"});
  if(!response.ok)throw Error("catalog unavailable");
  const json=await response.json();
  if(!Array.isArray(json.playlists))throw Error("invalid catalog");
  wisdomCatalogCache=json;return json;
 }catch(error){return wisdomCatalogCache||{playlists:[]}}
}
function wisdom(){
 shell("Words of Wisdom","Listen to the preachings of Brother Eli Soriano and Brother Daniel Razon");
 const section=document.createElement("section");section.className="card wisdom-library";
 const heading=document.createElement("h2");heading.textContent="Watch in MCGI Notes";
 const tabs=document.createElement("div");tabs.className="wisdom-tabs";
 const player=document.createElement("div");player.className="wisdom-player";
 const frame=document.createElement("iframe");frame.title="Words of Wisdom video player";frame.loading="lazy";frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";frame.allowFullscreen=true;frame.referrerPolicy="strict-origin-when-cross-origin";
 const playerCaption=document.createElement("p");playerCaption.className="muted";player.append(frame,playerCaption);
 const search=document.createElement("input");search.type="search";search.className="wisdom-search";search.placeholder="Search videos by title...";search.setAttribute("aria-label","Search Words of Wisdom video titles");
 const carouselHeader=document.createElement("div");carouselHeader.className="wisdom-carousel-heading";
 const label=document.createElement("h3");label.textContent="Available videos";
 const arrows=document.createElement("div");arrows.className="wisdom-carousel-arrows";
 const prev=document.createElement("button");prev.type="button";prev.textContent="‹";prev.setAttribute("aria-label","Previous videos");
 const next=document.createElement("button");next.type="button";next.textContent="›";next.setAttribute("aria-label","Next videos");arrows.append(prev,next);carouselHeader.append(label,arrows);
 const track=document.createElement("div");track.className="wisdom-video-track";track.setAttribute("aria-label","Playlist videos");
 prev.onclick=()=>track.scrollBy({left:-Math.max(260,track.clientWidth*.8),behavior:"smooth"});next.onclick=()=>track.scrollBy({left:Math.max(260,track.clientWidth*.8),behavior:"smooth"});
 const notice=document.createElement("p");notice.className="muted wisdom-notice";
 const links=document.createElement("div");links.className="actions";
 for(const item of wisdomPlaylists){const link=document.createElement("a");link.href="https://www.youtube.com/playlist?list="+encodeURIComponent(item.id);link.target="_blank";link.rel="noopener noreferrer";link.textContent="Open "+item.label+" on YouTube";links.append(link)}
 section.append(heading,tabs,player,search,carouselHeader,track,notice,links);$("#content").append(section);
 let active=wisdomPlaylists[0],catalog={playlists:[]},selectedId="";
 function items(){return catalog.playlists.find(p=>p.id===active.id)?.videos||[]}
 function play(item){
  selectedId=item?.id||"";
  // The YouTube playlist embed handles automatic next-video playback within the playlist.
  // autoplay=1 is best-effort; browsers may require a user gesture before audio starts.
  frame.src=item?.id
   ?"https://www.youtube-nocookie.com/embed/"+encodeURIComponent(item.id)+"?list="+encodeURIComponent(active.id)+"&autoplay=1&rel=0"
   :"https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(active.id)+"&autoplay=1&rel=0";
  playerCaption.textContent=item?.title||active.label;
  for(const b of track.querySelectorAll("button[data-video-id]"))b.setAttribute("aria-pressed",String(b.dataset.videoId===selectedId));
 }
 function renderVideos(){
  track.replaceChildren();const q=search.value.trim().toLocaleLowerCase();const all=items();const shown=all.filter(v=>v.title.toLocaleLowerCase().includes(q));
  for(const video of shown){
   const btn=document.createElement("button");btn.type="button";btn.className="wisdom-video-card";btn.dataset.videoId=video.id;btn.setAttribute("aria-pressed",String(video.id===selectedId));
   const img=document.createElement("img");img.loading="lazy";img.alt="";img.src=video.thumbnail||"https://i.ytimg.com/vi/"+encodeURIComponent(video.id)+"/hqdefault.jpg";
   const text=document.createElement("span");text.textContent=video.title;btn.append(img,text);btn.onclick=()=>play(video);track.append(btn);
  }
  if(!shown.length){const empty=document.createElement("p");empty.className="muted";empty.textContent=all.length?"No videos match your search.":"The video catalog has not been populated yet. You can still play the full YouTube playlist above.";track.append(empty)}
  notice.textContent=all.length?`${shown.length} of ${all.length} videos · Playback requires internet. Autoplay may be restricted by your browser.`:"Playlist playback is available above. Video thumbnails and title search will appear after the automated catalog refresh succeeds.";
 }
 function choose(item){
  active=item;search.value="";for(const b of tabs.querySelectorAll("button"))b.setAttribute("aria-pressed",String(b.dataset.playlist===item.id));
  play(null);renderVideos();
 }
 for(const item of wisdomPlaylists){const btn=document.createElement("button");btn.type="button";btn.textContent=item.label;btn.dataset.playlist=item.id;btn.onclick=()=>choose(item);tabs.append(btn)}
 search.addEventListener("input",renderVideos);choose(active);
 loadWisdomCatalog().then(data=>{catalog=data;if(!section.isConnected)return;renderVideos()});
}

function render(){if(!db)return;nav();const p=current();if(videoSession&&!videoSession.wrap.classList.contains("is-floating")&&p!=="songs"&&p!=="prayer")stopVideo();$("#homeTop").hidden=p!=="home";if(p!=="editor"){activeId=null;editorControls=null;dirty=false}({home,notes:()=>library(false),editor,calendar,bookmarks:()=>library(true),categories:categoryScreen,bible,songs,prayer,wisdom,settings,backup:()=>window.ChurchNotesBackup?.render()}[p]||home)()}
addEventListener("hashchange",async()=>{await flush();render()});
addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush().catch(console.error)});
addEventListener("pagehide",()=>{flush().catch(console.error)});
addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue=""}});
addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").hidden=false});$("#installBtn").onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installBtn").hidden=true};
if("serviceWorker"in navigator&&location.protocol!=="file:")addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
window.ChurchNotesInsertVerse=async text=>{if(current()!=="editor"||!editorControls){alert("Open a note before inserting a verse.");return}const editor=editorControls.body;editor.focus();const p=document.createElement("p");p.textContent=text;editor.append(p);dirty=true;clearTimeout(saveTimer);saveTimer=setTimeout(()=>flush().catch(console.error),500);editor.dispatchEvent(new Event("input",{bubbles:true}))};
$("#homeCreateNote").addEventListener("click",createNote);
window.ChurchNotesStorage={all,flush,db:()=>db};theme();init();
})();