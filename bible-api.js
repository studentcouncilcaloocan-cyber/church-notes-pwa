/* Church Notes Phase 5 — Bible API integration. No API keys or remote HTML. */
(()=>{'use strict';
const BASE='https://bible-api.com';
const KEY='cn-phase5-api-verse-cache-v3'; // isolate older mislabelled verse caches
const VERSION_KEY='cn-phase5-api-version';
const CATALOG=[['tagalog','Ang Dating Biblia (1905)'],['kjv','King James Version'],['web','World English Bible'],['asv','American Standard Version'],['bbe','Bible in Basic English'],['bsb','Berean Standard Bible'],['darby','Darby Bible'],['dra','Douay-Rheims'],['oeb-us','Open English Bible (US)'],['webbe','World English Bible (British)'],['rv1909','Reina Valera 1909']];
const ids=new Set(CATALOG.map(x=>x[0]));
function version(){const v=localStorage.getItem(VERSION_KEY);return ids.has(v)?v:'tagalog'}
function setVersion(v){if(!ids.has(v))throw Error('Unsupported Bible translation');localStorage.setItem(VERSION_KEY,v)}
function label(v){return CATALOG.find(x=>x[0]===v)?.[1]||v}
function key(ref,v){return v+'|'+ref}
function readCache(){try{const c=JSON.parse(localStorage.getItem(KEY)||'{}');return c&&typeof c==='object'&&!Array.isArray(c)?c:{}}catch{return {}}}
function cached(ref,v=version()){const value=readCache()[key(ref,v)]||null;return value&&v==='tagalog'&&!looksTagalog(value.text)?null:value}
function saveCache(ref,v,data){try{const c=readCache();c[key(ref,v)]={...data,savedAt:Date.now()};const keys=Object.keys(c).sort((a,b)=>(c[b].savedAt||0)-(c[a].savedAt||0));for(const k of keys.slice(120))delete c[k];localStorage.setItem(KEY,JSON.stringify(c))}catch(e){console.warn('Bible cache unavailable',e)}}
function normalize(ref){const match=/^(.+?)\s+(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?$/.exec(ref||'');if(!match)throw Error('Invalid Bible reference');const start=+match[3],end=+(match[4]||match[3]);if(end-start>29)throw Error('Please look up 30 verses or fewer at a time.');return match[1]+' '+match[2]+':'+start+(match[4]?'-'+end:'')}
const BOOKS='Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation'.split('|');
function looksTagalog(text){
 const t=' '+String(text).toLowerCase().replace(/[^a-záéíóúñ]+/g,' ')+' ';
 const tl=(t.match(/\b(ang|ng|mga|sa|ay|na|at|kaniyang|kaniya|dios|diyos|sapagkat|sinomang|sinumang|upang|hindi|kayo|inyong|ninyo|niya|siya|kung|ito|sila|niyang)\b/g)||[]).length;
 const en=(t.match(/\b(the|and|that|which|whosoever|god|shall|for|with|his|him|unto|have|world|believed|begotten|everlasting|love|loved)\b/g)||[]).length;
 return tl>=2 && tl>en;
}
async function adbFallback(ref,signal){
 const m=/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/.exec(ref);
 if(!m)throw Error('Invalid reference');
 const book=BOOKS.findIndex(x=>x.toLowerCase()===m[1].toLowerCase())+1;
 if(!book)throw Error('Unknown book');
 const chapter=+m[2],first=+m[3],last=+(m[4]||m[3]);
 const response=await fetch(`https://api.getbible.net/v2/tagalog/${book}/${chapter}.json`,{signal,cache:'no-store'});
 if(!response.ok)throw Error('ADB provider failed ('+response.status+')');
 const data=await response.json();
 const verses=data.chapter?.verses||data.verses||data.chapter;
 if(!verses)throw Error('ADB provider response format unsupported');
 const list=Array.isArray(verses)?verses:Object.entries(verses).map(([number,x])=>({verse:+number,...(typeof x==='object'?x:{text:x})}));
 const text=list.filter(x=>+(x.verse||x.number)>=first&&+(x.verse||x.number)<=last).map(x=>String(x.text||x.verse_text||'').trim()).filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
 if(!text)throw Error('ADB passage not found');
 if(!looksTagalog(text))throw Error('ADB provider returned text that could not be verified as Tagalog. English text was blocked; try again later or use an authorized manual excerpt.');
 return {text,reference:ref,translation:'tagalog',translationName:'Ang Dating Biblia (1905)',provider:'getBible.net'};
}
const pending=new Map();
async function lookup(ref,v=version(),options={}){if(!ids.has(v))throw Error('Unsupported translation');const normalized=normalize(ref),existing=cached(normalized,v);if(existing&&!options.refresh)return {...existing,offline:true};if(!navigator.onLine){if(existing)return {...existing,offline:true};throw Error('Offline: this reference is not cached yet. Connect to the internet once to save it for offline reading.')}
const k=key(normalized,v);if(pending.has(k))return pending.get(k);
const job=(async()=>{const url=BASE+'/'+encodeURIComponent(normalized)+'?translation='+encodeURIComponent(v);const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);try{if(v==='tagalog'){const data=await adbFallback(normalized,controller.signal);saveCache(normalized,v,data);return {...data,offline:false}}const res=await fetch(url,{signal:controller.signal,headers:{Accept:'application/json'},cache:'no-store'});if(!res.ok&&v==='tagalog'&&res.status===404){const data=await adbFallback(normalized,controller.signal);saveCache(normalized,v,data);return {...data,offline:false}}if(!res.ok)throw Error(res.status===429?'Bible API rate limit reached. Please try again shortly.':'Bible API request failed ('+res.status+').');const raw=await res.json();if(raw.error||!Array.isArray(raw.verses)||!raw.verses.length)throw Error(raw.error||'No verses returned for this reference.');const returned=(raw.translation_id||'').toLowerCase();if(returned&&returned!==v)throw Error('API returned an unexpected translation.');const text=raw.verses.map(x=>String(x.text||'').trim()).filter(Boolean).join(' ').replace(/\s+/g,' ').trim();if(!text)throw Error('No verse text returned.');const data={text,reference:normalized,translation:v,translationName:raw.translation_name||label(v),provider:'bible-api.com'};saveCache(normalized,v,data);return {...data,offline:false}}catch(e){if(existing)return {...existing,offline:true,stale:true};if(e.name==='AbortError')throw Error('Bible API timed out. Please try again.');throw e}finally{clearTimeout(timer)}})();pending.set(k,job);try{return await job}finally{pending.delete(k)}}
function copy(text){return navigator.clipboard?.writeText(text).catch(()=>fallback(text))||fallback(text)}
function fallback(text){const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();document.execCommand('copy');t.remove()}
function button(text,handler){const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=handler;return b}
function selector(onchange){const s=document.createElement('select');s.setAttribute('aria-label','Bible translation');for(const [id,name] of CATALOG){const o=document.createElement('option');o.value=id;o.textContent=name;s.append(o)}s.value=version();s.onchange=()=>{setVersion(s.value);onchange?.(s.value)};return s}
function resultUI(ref,host,{insert,card}={}){host.replaceChildren();const title=document.createElement('h3');title.textContent='Automatic Bible lookup';const controls=document.createElement('div');controls.className='actions';const sel=selector(()=>load());const refresh=button('Refresh verse',()=>load(true));controls.append(sel,refresh);const status=document.createElement('p');status.className='muted';status.setAttribute('role','status');const quote=document.createElement('blockquote');quote.className='verse-quote';const actions=document.createElement('div');actions.className='actions';host.append(title,controls,status,quote,actions);let seq=0;
async function load(force=false){const mine=++seq;status.textContent='Loading '+label(version())+'…';quote.textContent='';actions.replaceChildren();try{const data=await lookup(ref,version(),{refresh:force});if(mine!==seq||!host.isConnected)return;quote.textContent=data.text;status.textContent=localized+' · '+data.translationName+' · '+data.provider+(data.offline?' · saved offline':'');const localized=window.ChurchNotesBible?.formatReference(ref,version())||ref;const citation=localized+' — '+data.translationName;actions.append(button('Copy verse + citation',()=>copy(data.text+'\n'+citation)),button('Copy citation',()=>copy(citation)));if(typeof insert==='function')actions.append(button('Insert into note',()=>insert(data.text+'\n'+citation)));if(typeof card==='function')actions.append(button('Create share card',()=>card(localized,data.text,data.translationName)));}catch(e){if(mine!==seq||!host.isConnected)return;status.textContent=e.message+' You can still use your saved manual excerpt below.'}}load();return {load}}
function fillCard(ref,text,translation){location.hash='bible';setTimeout(()=>{const r=document.getElementById('verseRef'),q=document.getElementById('verseText'),c=document.getElementById('verseCitation');if(!r||!q||!c)return;r.value=ref;q.value=text;c.value=translation;for(const el of [r,q,c])el.dispatchEvent(new Event('input',{bubbles:true}));document.getElementById('shareSection')?.scrollIntoView({behavior:'smooth'})},80)}
window.ChurchNotesBibleAPI={CATALOG,version,setVersion,label,lookup,cached,resultUI,selector,fillCard,copy};
})();
