/* MCGI Notes: mobile/desktop editor smart formatting. No storage schema changes. */
(()=>{'use strict';
function install(editor){if(!editor||editor.dataset.smartFormat)return;editor.dataset.smartFormat='1';
let composing=false;
const selection=()=>window.getSelection();
function context(){const s=selection();if(!s||!s.rangeCount||!s.isCollapsed||!editor.contains(s.anchorNode))return null;let node=s.anchorNode.nodeType===1?s.anchorNode:s.anchorNode.parentNode;let block=node;while(block&&block!==editor&&!block.matches?.('p,div,li,blockquote,h1,h2,h3'))block=block.parentNode;if(!block) return null;const r=s.getRangeAt(0).cloneRange();r.selectNodeContents(block);r.setEnd(s.anchorNode,s.anchorOffset);return {block,text:block.textContent||'',before:r.toString()};}
function changed(){editor.dispatchEvent(new Event('input',{bubbles:true}));}
function removePrefix(ctx,count){const r=selection().getRangeAt(0).cloneRange();r.setStart(ctx.block,0); // prefix is the entire current block before the cursor
  if(ctx.before.length!==count)return false;
  r.deleteContents();return true;
}
function setCaretAtStart(el){const r=document.createRange();r.selectNodeContents(el);r.collapse(true);const sel=selection();sel.removeAllRanges();sel.addRange(r);}
function convertList(ctx,marker){
 const ordered=marker!=='-';const start=ordered?parseInt(marker,10):1;
 // Replace the current paragraph in place instead of running execCommand,
 // which can move the current line to the top of a surrounding list.
 let block=ctx.block;
 if(block===editor){const p=document.createElement('p');const r=selection().getRangeAt(0).cloneRange();r.selectNodeContents(editor);r.deleteContents();editor.appendChild(p);block=p;}
 const list=document.createElement(ordered?'ol':'ul');
 if(ordered&&start!==1)list.start=start;
 const li=document.createElement('li');li.appendChild(document.createElement('br'));list.appendChild(li);
 const y=window.scrollY;
 block.replaceWith(list);
 setCaretAtStart(li);
 // Keep the viewport steady when the editor is far down a long note.
 if(Math.abs(window.scrollY-y)>2)window.scrollTo({top:y,behavior:'instant'});
 changed();return true;
}
function listFromMarker(ctx){const match=/^([1-9]\d*\.|-)\s$/.exec(ctx.before);if(!match||ctx.before!==ctx.text||ctx.block.matches?.('li,blockquote'))return false;return convertList(ctx,match[1]);}
function trySpace(e){if(composing)return;const ctx=context();if(!ctx||ctx.block.matches?.('li,blockquote'))return;
 if(ctx.before!==ctx.text||!/^([1-9]\d*\.|-)$/.test(ctx.before))return;
 if(e.cancelable===false)return;
 e.preventDefault();convertList(ctx,ctx.before);
}
editor.addEventListener('compositionstart',()=>composing=true);
editor.addEventListener('compositionend',()=>composing=false);
editor.addEventListener('beforeinput',e=>{if(composing)return;
 if(e.inputType==='insertText'&&e.data===' '){trySpace(e);return;}
 if(e.inputType==='insertText'&&e.data==='"'){const ctx=context();if(!ctx)return;
  if(ctx.block.matches?.('blockquote')&&ctx.before===ctx.text){e.preventDefault();document.execCommand('insertParagraph',false,null);document.execCommand('formatBlock',false,'p');changed();}
  else if(!ctx.text.trim()&&!ctx.before.length){e.preventDefault();document.execCommand('formatBlock',false,'blockquote');changed();}
 }
});
editor.addEventListener('keydown',e=>{if(composing)return;
 if(e.key===' '){trySpace(e);return;}
 const ctx=context();if(!ctx)return;
 if(e.key==='Enter'&&ctx.block.matches?.('li')&&!ctx.text.trim()){
  e.preventDefault();document.execCommand(ctx.block.closest('ol')?'insertOrderedList':'insertUnorderedList',false,null);changed();return;
 }
 if(e.key==='Backspace'&&ctx.block.matches?.('li,blockquote')&&!ctx.text.trim()&&ctx.before.length===0){
  e.preventDefault();if(ctx.block.matches('li'))document.execCommand(ctx.block.closest('ol')?'insertOrderedList':'insertUnorderedList',false,null);else document.execCommand('formatBlock',false,'p');changed();
 }
});
// Fallback for keyboards that insert spaces without emitting cancelable beforeinput.
editor.addEventListener('input',e=>{if(composing||e.isComposing||e.inputType==='insertFromPaste')return;const ctx=context();if(ctx&&!ctx.block.matches?.('li,blockquote'))listFromMarker(ctx);});
}
window.MCGISmartFormat={install};
})();
