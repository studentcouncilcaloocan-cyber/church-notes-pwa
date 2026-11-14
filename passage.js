/* MCGI Notes 1.4.2: shared compound-reference parser. */
(()=>{'use strict';
function parse(ref){const m=/^(.+?)\s+(\d{1,3})\s*:\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?((?:\s*[,;]\s*(?:(?:\d{1,3}\s*:\s*)?\d{1,3}(?:\s*[-–]\s*\d{1,3})?))*)$/.exec(String(ref||'').trim());if(!m)return null;
const book=m[1].trim(),parts=[];let chapter=Number(m[2]);
function add(ch,a,b){ch=Number(ch);a=Number(a);b=Number(b??a);if(!Number.isInteger(ch)||ch<1||ch>150||a<1||b<a||b>176||b-a>=30)return false;for(let v=a;v<=b;v++)parts.push({chapter:ch,verse:v});return parts.length<=100}
if(!add(chapter,m[3],m[4]))return null;
let suffix=m[5]||'';const group=/\s*([,;])\s*(?:(\d{1,3})\s*:\s*)?(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?/gy;let pos=0,segment=0;
while(pos<suffix.length){group.lastIndex=pos;const x=group.exec(suffix);if(!x)return null;if(x[2])chapter=Number(x[2]);if(x[1]===';'&&!x[2])return null;if(!add(chapter,x[3],x[4]))return null;pos=group.lastIndex;if(++segment>100)return null}
const unique=[];const seen=new Set();for(const part of parts){const key=part.chapter+':'+part.verse;if(!seen.has(key)){unique.push(part);seen.add(key)}}
const display=book+' '+m[2]+':'+m[3]+(m[4]?'-'+m[4]:'')+suffix.replace(/\s*([,;])\s*/g,'$1 ').replace(/\s*:\s*/g,':').replace(/\s*[-–]\s*/g,'-').trimEnd();
return {book,parts:unique.map(x=>({...x,ref:book+' '+x.chapter+':'+x.verse})),reference:display};}
function format(ref,version,books){const p=parse(ref);if(!p)return ref;const b=books.find(b=>b.some(x=>x.toLowerCase()===p.book.toLowerCase()));if(!b)return ref;return (version==='tagalog'?(b[1]||b[0]):b[0])+p.reference.slice(p.book.length)}
window.MCGIPassage={parse,format};
})();
