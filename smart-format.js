/* MCGI Notes smart formatting: editor-only, no database changes. */
(()=>{'use strict';
function install(editor){if(!editor||editor.dataset.smartFormat)return;editor.dataset.smartFormat='1';
let composing=false;
function block(){const s=getSelection();if(!s||!s.rangeCount||!s.isCollapsed||!editor.contains(s.anchorNode))return null;let n=s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentNode;while(n&&n!==editor){if(n.matches?.('p,div,blockquote,li,h1,h2,h3'))return n;n=n.parentNode}return editor}
function offset(b){const s=getSelection(),r=s.getRangeAt(0).cloneRange();r.selectNodeContents(b);r.setEnd(s.anchorNode,s.anchorOffset);return r.toString().length}
function fire(){editor.dispatchEvent(new Event('input',{bubbles:true}))}
function selectPrefix(b,length){const s=getSelection(),r=document.createRange();let left=length;const w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);let n,first=null,last=null;while(n=w.nextNode()){if(!first)first=n;if(left<=n.length){last=n;break}left-=n.length}if(!first)return false;r.setStart(first,0);r.setEnd(last||first,last?left:0);s.removeAllRanges();s.addRange(r);return true}
editor.addEventListener('compositionstart',()=>composing=true);editor.addEventListener('compositionend',()=>composing=false);
editor.addEventListener('beforeinput',e=>{if(composing||e.inputType!=='insertText'||e.data!=='"')return;const b=block();if(!b)return;const text=b.textContent||'',pos=offset(b);if(b.matches?.('blockquote')){if(pos!==text.length)return;e.preventDefault();document.execCommand('insertParagraph',false,null);document.execCommand('formatBlock',false,'p');fire();return}if(!text.trim()&&pos===0){e.preventDefault();document.execCommand('formatBlock',false,'blockquote');fire()}});
editor.addEventListener('input',e=>{if(composing||e.isComposing||e.inputType==='insertFromPaste')return;const b=block();if(!b||b.matches?.('li,blockquote'))return;const text=b.textContent||'',pos=offset(b);if(pos!==text.length)return;const m=/^(\s*)(-|([1-9]\d*)\.) $/.exec(text);if(!m)return;const marker=m[0].length;if(!selectPrefix(b,marker))return;document.execCommand('delete',false,null);document.execCommand(m[3]?'insertOrderedList':'insertUnorderedList',false,null);if(m[3]){const li=block();const ol=li?.closest('ol');if(ol&&Number(m[3])!==1)ol.setAttribute('start',m[3])}fire()});
editor.addEventListener('keydown',e=>{if(composing||e.key!=='Backspace')return;const b=block();if(!b||!b.matches?.('li,blockquote')||b.textContent?.trim())return;if(offset(b)!==0)return;e.preventDefault();if(b.matches('li'))document.execCommand(b.closest('ol')?'insertOrderedList':'insertUnorderedList',false,null);else document.execCommand('formatBlock',false,'p');fire()});
}
window.MCGISmartFormat={install};
})();
