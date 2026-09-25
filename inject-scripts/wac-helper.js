/* eslint-disable */
if(window.__WAC_HELPER_INITIALIZED__){}else{
window.__WAC_HELPER_INITIALIZED__=true;
// Reported on the ping reply so the background can detect a stale resident copy
// of this script after an extension update.
const PROTOCOL_VERSION = 1;
const WAC_FRAME_SELECTORS=['iframe[name="WACViewPanel"]','iframe[id*="WacFrame"]','iframe[src*="word-edit"]','iframe[src*="WopiFrame"]','iframe[class*="WACViewPanel"]','iframe[class*="WordDocument"]','iframe[title*="Document"]','iframe'];
const WAC_INNER_SELECTORS=['[contenteditable="true"][role="textbox"]','div[contenteditable="true"]','div[contenteditable=""]','#WACViewPanel_EditingElement[contenteditable]','.WordDocument [contenteditable]','[data-wa-editable="true"]','div[contenteditable="true"].OutlineElement'];
function isVisible(el){
 if(!el)return false;
 const s=window.getComputedStyle(el);
 if(s.display==='none'||s.visibility==='hidden')return false;
 const r=el.getBoundingClientRect();
 if(r.width===0||r.height===0)return false;
 return true;
}
function findWacInDocument(doc){
 for(const sel of WAC_INNER_SELECTORS){
  try{
   const el=doc.querySelector(sel);
   if(el && (el.isContentEditable || el.getAttribute('contenteditable')!==null) && isVisible(el)) return {element:el,selector:sel,doc};
  }catch(e){}
 }
 try{
  const ce=doc.querySelector('[contenteditable="true"],[contenteditable=""]');
  if(ce && (ce.isContentEditable || ce.getAttribute('contenteditable')!==null) && isVisible(ce)) return {element:ce,selector:'[contenteditable]',doc};
 }catch(e){}
 return null;
}
function findWacContext(){
 const direct=findWacInDocument(document);
 if(direct) return {frame:null,frameSelector:null,innerSelector:direct.selector,element:direct.element,compositeSelector:direct.selector,isWac:true,confidence:'direct'};
 for(const fsel of WAC_FRAME_SELECTORS){
  let frames=[];
  try{ frames=Array.from(document.querySelectorAll(fsel)); }catch(e){ continue; }
  for(const f of frames){
   if(!(f instanceof HTMLIFrameElement)) continue;
   try{
    const doc=f.contentDocument || (f.contentWindow && f.contentWindow.document);
    if(!doc) continue;
    const inner=findWacInDocument(doc);
    if(inner) return {frame:f,frameSelector:fsel,innerSelector:inner.selector,element:inner.element,compositeSelector:fsel+' |> '+inner.selector,isWac:true,confidence:'frame-direct',frameElement:f};
   }catch(e){}
  }
 }
 return null;
}
async function detectWacAsync(){
 const sync=findWacContext();
 if(sync) return sync;
 return new Promise((resolve)=>{
  let done=false;
  const reqId='wac_probe_'+Date.now()+'_'+Math.random().toString(36).slice(2);
  const results=[];
  const timer=setTimeout(()=>{
   if(done) return; done=true; window.removeEventListener('message',onMsg);
   const direct=findWacContext();
   if(direct) resolve(direct);
   else resolve({isWac:false,reason:'not found'});
  },600);
  function onMsg(ev){
   if(!ev.data || ev.data.type!=='wac_probe_result' || ev.data.reqId!==reqId) return;
   if(ev.data.isWac){
    if(!done){ done=true; clearTimeout(timer); window.removeEventListener('message',onMsg);
     let frameEl=null;
     try{
      const frames=Array.from(document.querySelectorAll('iframe'));
      for(const f of frames){ if(f.contentWindow===ev.source){ frameEl=f; break; } }
     }catch(e){}
     resolve({frame:frameEl,frameSelector:ev.data.frameSelector||null,innerSelector:ev.data.innerSelector,compositeSelector:ev.data.compositeSelector,element:null,isWac:true,confidence:'probe',frameElement:frameEl});
    }
   }
  }
  window.addEventListener('message',onMsg);
  let frames=[];
  try{
   frames=Array.from(document.querySelectorAll('iframe'));
   for(const f of frames){ try{ f.contentWindow.postMessage({type:'wac_probe',reqId},'*'); }catch(e){} }
  }catch(e){}
  if(frames.length===0){ clearTimeout(timer); window.removeEventListener('message',onMsg); resolve({isWac:false,reason:'no iframe'}); }
 });
}
async function wacFill(value, selector, ref){
 let ctx=null;
 if(selector && selector.includes('|>')){
  const parts=selector.split('|>').map(s=>s.trim());
  const fsel=parts[0]; const isel=parts.slice(1).join(' |> ');
  try{
   const f=document.querySelector(fsel);
   if(f && f.contentDocument){
    const doc=f.contentDocument;
    const el=doc.querySelector(isel) || doc.querySelector('[contenteditable]');
    if(el){
     ctx={frame:f,frameSelector:fsel,innerSelector:isel,element:el,isWac:true};
    }
   }
  }catch(e){}
 }
 if(!ctx) ctx=await detectWacAsync();
 let targetEl=null;
 let targetDoc=document;
 if(ctx && ctx.frame && ctx.frame.contentDocument){
  targetDoc=ctx.frame.contentDocument;
  try{ targetEl=targetDoc.querySelector(ctx.innerSelector) || targetDoc.querySelector('[contenteditable]'); }catch(e){}
  if(!targetEl) targetEl=ctx.element;
 }
 else if(ctx && ctx.element){ targetEl=ctx.element; }
 else {
  const direct=findWacInDocument(document);
  if(direct) targetEl=direct.element;
 }
 if(!targetEl){
  if(ref && window.__claudeElementMap){
   try{ const w=window.__claudeElementMap[ref]; targetEl=w && w.deref ? w.deref() : null; }catch(e){}
  }
  if(!targetEl && selector){
   try{ targetEl=document.querySelector(selector); }catch(e){}
  }
 }
 if(!targetEl) return {error:'WAC target not found. Open Word Online document and ensure editor is loaded.',isWac:!!(ctx&&ctx.isWac)};
 try{
  const el=targetEl;
  el.scrollIntoView({behavior:'auto',block:'center',inline:'center'});
  await new Promise(r=>setTimeout(r,80));
  el.focus();
  await new Promise(r=>setTimeout(r,40));
  try{
   const sel=targetDoc.getSelection ? targetDoc.getSelection() : window.getSelection();
   const range=targetDoc.createRange();
   range.selectNodeContents(el);
   if(sel){ sel.removeAllRanges(); sel.addRange(range); }
  }catch(e){}
  const text=String(value ?? '');
  let inserted=false;
  try{ inserted=targetDoc.execCommand('insertText',false,text); }catch(e){}
  if(!inserted){
   try{
    const sel2=targetDoc.getSelection ? targetDoc.getSelection() : window.getSelection();
    if(sel2 && sel2.rangeCount>0){
     const r=sel2.getRangeAt(0);
     r.deleteContents();
     r.insertNode(targetDoc.createTextNode(text));
     r.collapse(false);
     sel2.removeAllRanges(); sel2.addRange(r);
    } else el.textContent=(el.textContent||'')+text;
    inserted=true;
   }catch(e){}
  }
  try{ el.dispatchEvent(new InputEvent('beforeinput',{bubbles:true,inputType:'insertText',data:text})); }catch(e){}
  try{ el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:text})); }catch(e){}
  try{ el.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true})); el.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true})); }catch(e){}
  try{ el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
  try{ el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:text})); }catch(e){}
  return {success:true,message:'WAC filled successfully',isWac:true,value:text,selector:ctx&&ctx.compositeSelector||selector};
 }catch(e){
  return {error:'WAC fill error: '+e.message};
 }
}
chrome.runtime.onMessage.addListener((request,_sender,sendResponse)=>{
 if(request.action==='wacDetect'){
  detectWacAsync().then(r=>sendResponse({success:true,...r})).catch(e=>sendResponse({success:false,error:e.message}));
  return true;
 }
 if(request.action==='wacFill' || request.action==='chrome_wac_fill'){
  wacFill(request.value,request.selector,request.ref).then(sendResponse).catch(e=>sendResponse({error:e.message}));
  return true;
 }
 if(request.action==='fillElement'){
  findWacContext();
  const ctx=findWacContext();
  if(ctx && ctx.isWac){
   wacFill(request.value,request.selector,request.ref).then(sendResponse).catch(e=>sendResponse({error:e.message}));
   return true;
  }
  return false;
 }
 if(request.action==='chrome_wac_ping' || request.action==='wac_ping'){
  sendResponse({status:'pong',isWac:!!findWacContext(),v:PROTOCOL_VERSION,script:'wac-helper'});
  return false;
 }
});
window.addEventListener('message',(ev)=>{
 if(!ev.data || ev.data.type!=='wac_probe') return;
 const found=findWacInDocument(document);
 if(found){
  try{ ev.source.postMessage({type:'wac_probe_result',reqId:ev.data.reqId,isWac:true,innerSelector:found.selector,compositeSelector:found.selector},'*'); }catch(e){}
 } else {
  try{ ev.source.postMessage({type:'wac_probe_result',reqId:ev.data.reqId,isWac:false},'*'); }catch(e){}
 }
});
}
