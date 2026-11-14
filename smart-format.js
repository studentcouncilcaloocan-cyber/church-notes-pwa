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
function listFromMarker(ctx){const match=/^([1-9]\d*\.|-)\s$/.exec(ctx.before);if(!match||ctx.before!==ctx.text)return false;
  const ordered=match[1]!=='-';if(!removePrefix(ctx,ctx.before.length))return false;
  // Put caret inside the now-empty block before issuing the native list command.
  const range=document.createRange();range.selectNodeContents(ctx.block);range.collapse(true);selection().removeAllRanges();selection().addRange(range);
  document.execCommand(ordered?'insertOrderedList':'insertUnorderedList',false,null);
  if(ordered){const li=selection().anchorNode?.parentElement?.closest('li')||editor.querySelector('li:last-child');const ol=li?.closest('ol');if(ol)ol.start=parseInt(match[1],10);}
  changed();return true;
}
function trySpace(e){if(composing)return;const ctx=context();if(!ctx||ctx.block.matches?.('li,blockquote'))return;
  // beforeinput happens before the space is inserted; keydown is a fallback.
  if(ctx.before!==ctx.text||!/^([1-9]\d*\.|-)$/.test(ctx.before))return;
  e.preventDefault();
  // Convert the marker without relying on a synthetic input event from mobile keyboards.
  const marker=ctx.before+' ';const r=selection().getRangeAt(0).cloneRange();r.setStart(ctx.block,0);r.deleteContents();
  const range=document.createRange();range.selectNodeContents(ctx.block);range.collapse(true);selection().removeAllRanges();selection().addRange(range);
  const ordered=ctx.before!=='-';document.execCommand(ordered?'insertOrderedList':'insertUnorderedList',false,null);
  if(ordered){let node=selection().anchorNode;node=node?.nodeType===1?node:node?.parentElement;const ol=node?.closest?.('ol')||editor.querySelector('ol:last-child');if(ol)ol.start=parseInt(ctx.before,10);}
  changed();
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
