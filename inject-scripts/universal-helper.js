/* eslint-disable */
if(window.__UNIVERSAL_HELPER_INITIALIZED__){}else{
window.__UNIVERSAL_HELPER_INITIALIZED__=true;
// Reported on the ping reply so the background can detect a stale resident copy
// of this script after an extension update.
const PROTOCOL_VERSION = 1;
function deepQuery(selector, root=document){
 try{ const el=root.querySelector(selector); if(el) return el; }catch(e){}
 const walker=(node)=>{
  if(!node) return null;
  if(node.shadowRoot){
   try{ const f=node.shadowRoot.querySelector(selector); if(f) return f; }catch(e){}
   for(const c of node.shadowRoot.children||[]){ const r=walker(c); if(r) return r; }
  }
  for(const c of node.children||[]){ const r=walker(c); if(r) return r; }
  return null;
 };
 return walker(root.documentElement||root.body||root);
}
function deepQueryAll(selector, root=document, out=[]){
 try{ out.push(...root.querySelectorAll(selector)); }catch(e){}
 const walk=(node)=>{
  if(node.shadowRoot){
   try{ out.push(...node.shadowRoot.querySelectorAll(selector)); }catch(e){}
   for(const c of node.shadowRoot.children||[]) walk(c);
  }
  for(const c of node.children||[]) walk(c);
 };
 walk(root.documentElement||root.body||root);
 return out;
}
function resolveComposite(selector){
 if(!selector||!selector.includes('|>')) return null;
 const p=selector.split('|>').map(s=>s.trim());
 const fsel=p[0]; const isel=p.slice(1).join(' |> ');
 try{
  const f=document.querySelector(fsel);
  if(f && f.contentDocument){
   const doc=f.contentDocument;
   let el=null;
   try{ el=doc.querySelector(isel); }catch(e){}
   if(!el) el=deepQuery(isel, doc);
   if(el) return {frame:f,frameSelector:fsel,innerSelector:isel,element:el,doc,composite:selector};
  }
 }catch(e){}
 return null;
}
function resolveUniversal(selector, ref){
 if(ref && window.__scalemaxElementMap){
  try{ const w=window.__scalemaxElementMap[ref]; const el=w&&w.deref?w.deref():null; if(el) return {element:el, method:'ref'}; }catch(e){}
 }
 if(selector && selector.includes('|>')){
  const c=resolveComposite(selector);
  if(c) return {element:c.element, method:'composite', frame:c.frame};
 }
 if(selector){
  try{ let el=document.querySelector(selector); if(el) return {element:el,method:'query'}; }catch(e){}
  let d=deepQuery(selector);
  if(d) return {element:d, method:'deep'};
  // try all frames
  for(const f of document.querySelectorAll('iframe')){
   try{
    const doc=f.contentDocument; if(!doc) continue;
    let el=null; try{ el=doc.querySelector(selector);}catch(e){}
    if(!el) el=deepQuery(selector, doc);
    if(el) return {element:el, method:'iframe', frame:f, doc};
   }catch(e){}
  }
 }
 // contenteditable fallback search
 const ce=document.querySelector('[contenteditable="true"],[contenteditable=""],.ProseMirror,[role="textbox"],.ql-editor,[data-slate-editor]');
 if(ce) return {element:ce, method:'ce-fallback'};
 return null;
}
function isVisibleUniversal(el){
 if(!el) return false;
 try{ if(el.checkVisibility) return el.checkVisibility({checkOpacity:true, checkVisibilityCSS:true}); }catch(e){}
 const s=window.getComputedStyle(el);
 if(s.display==='none'||s.visibility==='hidden') return false;
 if(parseFloat(s.opacity)===0) return false;
 let r;
 try{ r=el.getBoundingClientRect(); }catch(e){ return false;}
 if(el instanceof SVGElement){
  try{ const b=el.getBBox(); if(b.width===0&&b.height===0) return false; }catch(e){}
 } else if(r.width===0||r.height===0){
  // allow A with zero rect but has href
  if(el.tagName!=='A') return false;
 }
 // 9-point grid check for unobscured
 const pts=[[0.5,0.5],[0.2,0.2],[0.8,0.2],[0.2,0.8],[0.8,0.8],[0.5,0.2],[0.5,0.8],[0.2,0.5],[0.8,0.5]];
 for(const [fx,fy] of pts){
  const x=r.left+r.width*fx, y=r.top+r.height*fy;
  try{ const at=document.elementFromPoint(x,y); if(at && (at===el||el.contains(at))) return true; }catch(e){}
  // shadow piercing
  try{
   let cur=el;
   while(cur && cur.getRootNode && cur.getRootNode() instanceof ShadowRoot){
    const host=cur.getRootNode().host; if(!host) break;
    const sr=host.shadowRoot; if(!sr) break;
    const sat=sr.elementFromPoint ? sr.elementFromPoint(x,y) : null;
    if(sat && (sat===el||el.contains(sat))) return true;
    cur=host;
   }
  }catch(e){}
 }
 return false;
}
function getClickablePoint(el){
 const r=el.getBoundingClientRect();
 const pts=[[0.5,0.5],[0.3,0.3],[0.7,0.3],[0.3,0.7],[0.7,0.7],[0.5,0.25],[0.5,0.75]];
 for(const [fx,fy] of pts){
  const x=r.left+r.width*fx, y=r.top+r.height*fy;
  const at=document.elementFromPoint(x,y);
  if(at && (at===el||el.contains(at))) return {x,y};
 }
 return {x:r.left+r.width/2, y:r.top+r.height/2};
}
// Map (x,y) from el's frame viewport to the nearest same-origin ancestor window that
// hosts the cursor overlay; null when a cross-origin boundary blocks the translation.
function findMouseOverlay(el, x, y){
 let w=(el&&el.ownerDocument&&el.ownerDocument.defaultView)||window;
 try{
  while(w){
   if(w.__scalemaxMouse&&typeof w.__scalemaxMouse.moveTo==='function') return {m:w.__scalemaxMouse,x,y};
   if(w===w.top) return null;
   const fe=w.frameElement; if(!fe) return null;
   const r=fe.getBoundingClientRect();
   x+=r.left+(fe.clientLeft||0); y+=r.top+(fe.clientTop||0);
   w=w.parent;
  }
 }catch(e){}
 return null;
}
function dispatchUniversalClick(el, x, y, opts={}, isDouble=false){
 if(x===undefined||y===undefined){ const p=getClickablePoint(el); x=p.x; y=p.y; }
 try{ const mp=findMouseOverlay(el,x,y); if(mp) mp.m.moveTo(mp.x,mp.y,{label:'click'}); }catch(e){}
 try{ el.focus(); }catch(e){}
 // hover pre-steps
 const base={bubbles:true, cancelable:true, composed:true, view:window, clientX:x, clientY:y, screenX:x, screenY:y, button:opts.button==='right'?2:opts.button==='middle'?1:0, buttons:opts.button==='right'?2:opts.button==='middle'?4:1, altKey:!!opts.altKey, ctrlKey:!!opts.ctrlKey, metaKey:!!opts.metaKey, shiftKey:!!opts.shiftKey, pointerId:1, pointerType:'mouse', isPrimary:true};
 try{ el.dispatchEvent(new PointerEvent('pointerover', base)); }catch(e){}
 try{ el.dispatchEvent(new MouseEvent('mouseover', base)); }catch(e){}
 try{ el.dispatchEvent(new PointerEvent('pointerenter', base)); }catch(e){}
 try{ el.dispatchEvent(new MouseEvent('mouseenter', base)); }catch(e){}
 try{ el.dispatchEvent(new PointerEvent('pointermove', base)); }catch(e){}
 try{ el.dispatchEvent(new MouseEvent('mousemove', base)); }catch(e){}
 // down/up/click
 try{ el.dispatchEvent(new PointerEvent('pointerdown', base)); }catch(e){}
 try{ el.dispatchEvent(new MouseEvent('mousedown', base)); }catch(e){}
 try{ el.dispatchEvent(new PointerEvent('pointerup', base)); }catch(e){}
 try{ el.dispatchEvent(new MouseEvent('mouseup', base)); }catch(e){}
 try{ el.dispatchEvent(new MouseEvent('click', base)); }catch(e){}
 if(base.button===2){ try{ el.dispatchEvent(new MouseEvent('contextmenu', base)); }catch(e){} }
 if(isDouble){
  setTimeout(()=>{
   try{ el.dispatchEvent(new PointerEvent('pointerdown', base)); }catch(e){}
   try{ el.dispatchEvent(new MouseEvent('mousedown', {...base, detail:2})); }catch(e){}
   try{ el.dispatchEvent(new PointerEvent('pointerup', base)); }catch(e){}
   try{ el.dispatchEvent(new MouseEvent('mouseup', {...base, detail:2})); }catch(e){}
   try{ el.dispatchEvent(new MouseEvent('click', {...base, detail:2})); }catch(e){}
   try{ el.dispatchEvent(new MouseEvent('dblclick', base)); }catch(e){}
  },30);
 }
 // keyboard activation for role=button
 try{ if(el.getAttribute&&el.getAttribute('role')==='button'){ el.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:'Enter',code:'Enter'})); } }catch(e){}
}
function isEditable(el){
 if(!el) return false;
 if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.tagName==='SELECT') return true;
 if(el.isContentEditable) return true;
 const ce=el.getAttribute && el.getAttribute('contenteditable');
 if(ce!==null && ce!==undefined && ce!=='false') return true;
 if(el.closest && el.closest('[contenteditable]')) return true;
 if(el.matches && el.matches('.ProseMirror,.ql-editor,[data-slate-editor],[role="textbox"],[role="searchbox"]')) return true;
 return false;
}
function findEditableNear(el){
 if(isEditable(el)) return el;
 try{
  let c=el.querySelector('[contenteditable],input,textarea,select,.ProseMirror,.ql-editor,[role="textbox"]');
  if(c) return c;
  c=deepQuery('input,textarea,select,[contenteditable]', el);
  if(c) return c;
 }catch(e){}
 if(el.shadowRoot){
  try{ const q=el.shadowRoot.querySelector('input,textarea,select,[contenteditable]'); if(q) return q; }catch(e){}
 }
 return null;
}
async function typeUniversal(el, text){
 const target=findEditableNear(el) || el;
 target.scrollIntoView({behavior:'auto',block:'center',inline:'center'});
 await new Promise(r=>setTimeout(r,80));
 try{ target.focus(); }catch(e){}
 await new Promise(r=>setTimeout(r,40));
 const tDoc=target.ownerDocument||document;
 // contenteditable / rich editor path
 if(target.isContentEditable || (target.getAttribute&&target.getAttribute('contenteditable')!==null) || target.matches&&target.matches('.ProseMirror,.ql-editor,[role="textbox"]') || target.closest&&target.closest('[contenteditable]')){
  let editable=target;
  if(!editable.isContentEditable && editable.closest) { const p=editable.closest('[contenteditable]'); if(p) editable=p; }
  try{
   const sel=tDoc.getSelection(); const range=tDoc.createRange();
   range.selectNodeContents(editable);
   if(sel){ sel.removeAllRanges(); sel.addRange(range); }
  }catch(e){}
  let inserted=false;
  try{ inserted=tDoc.execCommand('insertText',false,String(text)); }catch(e){}
  if(!inserted){
   try{
    const sel=tDoc.getSelection();
    if(sel&&sel.rangeCount>0){
     const r=sel.getRangeAt(0); r.deleteContents(); r.insertNode(tDoc.createTextNode(String(text))); r.collapse(false); sel.removeAllRanges(); sel.addRange(r);
    } else editable.textContent=(editable.textContent||'')+String(text);
    inserted=true;
   }catch(e){}
  }
  try{ editable.dispatchEvent(new InputEvent('beforeinput',{bubbles:true,inputType:'insertText',data:String(text)})); }catch(e){}
  try{ editable.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:String(text)})); }catch(e){}
  try{ editable.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true})); editable.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true})); }catch(e){}
  try{ editable.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
  return true;
 }
 if(target.tagName==='INPUT'||target.tagName==='TEXTAREA'){
  const type=(target.type||'').toLowerCase();
  if(type==='checkbox' || type==='radio'){ target.checked=!!text; target.dispatchEvent(new Event('input',{bubbles:true})); target.dispatchEvent(new Event('change',{bubbles:true})); return true; }
  if(type==='range'||type==='number'){ target.value=String(text); target.dispatchEvent(new Event('input',{bubbles:true})); target.dispatchEvent(new Event('change',{bubbles:true})); return true; }
  target.value=''; target.dispatchEvent(new Event('input',{bubbles:true}));
  target.value=String(text); target.dispatchEvent(new Event('input',{bubbles:true})); target.dispatchEvent(new Event('change',{bubbles:true}));
  return true;
 }
 if(target.tagName==='SELECT'){
  for(const o of target.options){ if(o.value===text||o.text===text){ target.value=o.value; target.dispatchEvent(new Event('change',{bubbles:true})); return true; } }
  return false;
 }
 // fallback: keyboard typing via key events + insert
 for(const ch of String(text)){
  try{
   const data=ch;
   target.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:data,code:'Key'+data.toUpperCase()}));
   try{ tDoc.execCommand('insertText',false,data); }catch(e){}
   target.dispatchEvent(new InputEvent('beforeinput',{bubbles:true,inputType:'insertText',data}));
   target.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data}));
   target.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true,key:data,code:'Key'+data.toUpperCase()}));
  }catch(e){}
 }
 return true;
}
// Never expose secrets (passwords, OTP codes) in page snapshots sent to the LLM.
function isSensitiveInput(el){
 try{
  if(!el||el.tagName!=='INPUT') return false;
  if(String(el.type||'').toLowerCase()==='password') return true;
  const ac=String(el.getAttribute('autocomplete')||'').toLowerCase();
  return /(^|\s)(current-password|new-password|one-time-code)(\s|$)/.test(ac);
 }catch(e){ return false; }
}
function safeValue(el){
 if(!el||el.value===undefined||el.value===null) return el?el.value:undefined;
 if(isSensitiveInput(el)) return el.value?'••••':'';
 return el.value;
}
function getEyesSnapshot(maxNodes=800){
 const out=[];
 const seen=new Set();
 let truncated=false;
 const queue=[document.documentElement||document.body];
 const isInteractive=(el)=>{
  if(!el||!el.tagName) return false;
  const tag=el.tagName.toLowerCase();
  if(['a','button','input','select','textarea'].includes(tag)) return true;
  if(el.isContentEditable||el.getAttribute('contenteditable')!==null) return true;
  if(el.getAttribute('role')==='button'||el.getAttribute('role')==='textbox'||el.getAttribute('role')==='link'||el.getAttribute('role')==='tab') return true;
  if(el.hasAttribute('onclick')||el.hasAttribute('tabindex')) return true;
  const s=window.getComputedStyle(el);
  if(s.cursor==='pointer') return true;
  if(el.matches&&el.matches('.ProseMirror,.ql-editor,[data-slate-editor],canvas,[draggable="true"]')) return true;
  return false;
 };
 const getLabel=(el)=>{
  let l=el.getAttribute('aria-label')||el.getAttribute('alt')||el.getAttribute('placeholder')||el.getAttribute('title')||'';
  if(!l) l=(el.innerText||el.textContent||'').trim().slice(0,120);
  if(!l && el.getAttribute('aria-labelledby')){
   try{ const ids=el.getAttribute('aria-labelledby').split(/\s+/); l=ids.map(id=>{const e=document.getElementById(id); return e?e.textContent.trim():'';}).join(' ').slice(0,120);}catch(e){}
  }
  return l.replace(/\s+/g,' ').slice(0,120);
 };
 const addNode=(el, depth)=>{
  if(!el||seen.has(el)||out.length>=maxNodes) { if(out.length>=maxNodes) truncated=true; return; }
  seen.add(el);
  try{
   const rect=el.getBoundingClientRect();
   const vis=isVisibleUniversal(el);
   const role=el.getAttribute('role')||el.tagName.toLowerCase();
   let label=getLabel(el);
   if(!label && (el.isContentEditable || (el.getAttribute&&el.getAttribute('contenteditable')!==null) || (el.getAttribute&&el.getAttribute('role')==='textbox'))) label='(empty editable)';
   const state={
    disabled:el.disabled||el.getAttribute('aria-disabled')==='true',
    checked:el.checked||el.getAttribute('aria-checked')==='true',
    expanded:el.getAttribute('aria-expanded'),
    selected:el.getAttribute('aria-selected'),
    required:el.required||el.getAttribute('aria-required')==='true',
    readonly:el.readOnly||el.getAttribute('readonly')!==null,
    level:el.getAttribute('aria-level'),
    valuemin:el.getAttribute('aria-valuemin'),
    valuemax:el.getAttribute('aria-valuemax'),
    valuenow:el.getAttribute('aria-valuenow')||safeValue(el),
    invalid:el.getAttribute('aria-invalid'),
    placeholder:el.getAttribute('placeholder')||el.getAttribute('aria-placeholder'),
    href:el.href||el.getAttribute('href'),
    type:el.type||el.getAttribute('type'),
    tag:el.tagName
   };
   // shadow / iframe flags
   const inShadow=!!(el.getRootNode&&el.getRootNode() instanceof ShadowRoot);
   const host=inShadow?el.getRootNode().host:null;
   out.push({ref:null, role, label, text:label, tag:el.tagName, id:el.id||'', className:(el.className&&el.className.toString?el.className.toString():'' ).slice(0,80), rect:{x:Math.round(rect.x),y:Math.round(rect.y),w:Math.round(rect.width),h:Math.round(rect.height), centerX:Math.round(rect.x+rect.width/2), centerY:Math.round(rect.y+rect.height/2)}, visible:vis, interactive:isInteractive(el), state, inShadow, hostTag:host?host.tagName:'', depth, selector:''});
  }catch(e){}
 };
 // BFS walk + shadow + iframe (efficient, no querySelectorAll duplication)
 const bfs=[document.body];
 const visited=new Set();
 while(bfs.length && out.length<maxNodes){
  const cur=bfs.shift(); if(!cur||visited.has(cur)) continue; visited.add(cur);
  if(cur!==document.body) addNode(cur,0);
  // shadow
  if(cur.shadowRoot){
   for(const c of cur.shadowRoot.children) if(!visited.has(c)) bfs.push(c);
  }
  for(const c of (cur.children||[])) if(!visited.has(c)) bfs.push(c);
  // iframes
  if(cur.tagName==='IFRAME'){
   try{
    const doc=cur.contentDocument; if(doc&&doc.body && !visited.has(doc.body)) bfs.push(doc.body);
    else if(!cur.contentDocument) out.push({role:'iframe', label:'cross-origin iframe src='+(cur.src||'').slice(0,60), tag:'IFRAME', rect:cur.getBoundingClientRect(), visible:true, interactive:false, crossOrigin:true, selector:'iframe'});
   }catch(e){
    out.push({role:'iframe', label:'cross-origin iframe src='+(cur.src||'').slice(0,60), tag:'IFRAME', rect:cur.getBoundingClientRect(), visible:true, interactive:false, crossOrigin:true, selector:'iframe'});
   }
  }
 }
 return {nodes:out, truncated, total:out.length, viewport:{w:window.innerWidth,h:window.innerHeight}, url:location.href, title:document.title, pageText:((document.body&&(document.body.innerText||document.body.textContent))||"").slice(0,30000)};
}
async function universalClick(selector, ref, coords, opts){
 if(coords && typeof coords.x==='number'){
  const el=document.elementFromPoint(coords.x, coords.y);
  if(el){ dispatchUniversalClick(el, coords.x, coords.y, opts); return {success:true, method:'coords', element:el.tagName}; }
  // shadow fallback
  for(const host of document.querySelectorAll('*')){
   if(host.shadowRoot && host.shadowRoot.elementFromPoint){
    try{ const se=host.shadowRoot.elementFromPoint(coords.x, coords.y); if(se){ dispatchUniversalClick(se, coords.x, coords.y, opts); return {success:true, method:'shadow-coords'}; } }catch(e){}
   }
  }
 }
 let resolved=resolveUniversal(selector, ref);
 if(!resolved && coords){ return {error:'no element at coords'}; }
 if(!resolved) return {error:'element not found: '+(selector||ref)};
 let el=resolved.element;
 if(resolved.doc && resolved.doc!==document) { /* iframe doc */ }
 el.scrollIntoView({behavior:'auto',block:'center',inline:'center'});
 await new Promise(r=>setTimeout(r,90));
 const p=getClickablePoint(el);
 dispatchUniversalClick(el, p.x, p.y, opts);
  // awaited click
 return {success:true, method:resolved.method, tag:el.tagName, rect:el.getBoundingClientRect()};
}
// Cross-frame probes go through the background (chrome.runtime), never window.postMessage:
// the page (or any embedded frame) can neither trigger probes nor spoof replies.
// Only the top frame fans out; the background already iterates frames explicitly for sub-frames.
function relayToFrames(action, payload, mode, timeoutMs){
 return new Promise(res=>{
  if(window!==window.top) return res([]);
  try{
   chrome.runtime.sendMessage({type:'scalemax_universal_relay', action, payload, mode, timeoutMs:timeoutMs||900}, (resp)=>{
    try{ void chrome.runtime.lastError; }catch(e){}
    res(resp&&resp.ok&&Array.isArray(resp.results)?resp.results.filter(r=>r&&r.response&&typeof r.response==='object'):[]);
   });
  }catch(e){ res([]); }
 });
}
async function probeTypeInFrames(text, selector, ref){
 const results=await relayToFrames('universal_type_probe', {text, selector, ref}, 'first-success', 900);
 const hit=results.find(r=>r.response.success);
 return hit?{...hit.response, frameId:hit.frameId}:null;
}
// A frame whose whole ancestor chain is same-origin is already walked by the top frame's snapshot.
function coveredByTop(){
 try{ let w=window; while(w!==w.top){ w=w.parent; void w.document.body; } return true; }catch(e){ return false; }
}
async function handleProbe(req){
 if(req.action==='universal_type_probe'){
  let target=null;
  if(req.selector||req.ref){ const r=resolveUniversal(req.selector, req.ref); if(r) target=r.element; }
  if(!target) target=document.querySelector('[contenteditable]:not([contenteditable="false"]),.ProseMirror,[role="textbox"]');
  if(!target) return {success:false};
  const ok=await typeUniversal(target, typeof req.text==='string'?req.text:String(req.text==null?'':req.text));
  return {success:!!ok, method:ok?'iframe-probe':''};
 }
 if(req.action==='universal_eyes_probe'){
  if(coveredByTop()) return {snapshot:{nodes:[], total:0, truncated:false, covered:true}};
  const n=Math.max(1, Math.min(Number(req.maxNodes)||400, 2000));
  return {snapshot:getEyesSnapshot(n)};
 }
 if(req.action==='universal_probe'){
  return {found:!!(typeof req.selector==='string'&&req.selector&&deepQuery(req.selector, document))};
 }
 return null;
}
async function universalType(selector, ref, text){
 let resolved=resolveUniversal(selector, ref);
 let el=resolved?resolved.element:null;
 if(!el){
  // try wac / ce fallback already in resolveUniversal
  if(!selector && !ref){
   const ce=document.querySelector('[contenteditable],.ProseMirror,input,textarea');
   if(ce) el=ce;
  }
 }
 if(!el){
  // try cross-origin probe first
  try{
   const probed=await probeTypeInFrames(text, selector, ref);
   if(probed && probed.success) return probed;
  }catch(e){}
  // fallback for Word/Office: try center of viewport or iframe center
  try{
   const cx=window.innerWidth/2, cy=window.innerHeight/2;
   let maybe=document.elementFromPoint(cx,cy);
   if(maybe){
    if(maybe.tagName==='IFRAME'){
     try{
      const doc=maybe.contentDocument;
      if(doc){
       const inner=doc.querySelector('[contenteditable],.ProseMirror,[role="textbox"]')||doc.body;
       if(inner) el=inner;
      }
     }catch(e){}
     if(!el) el=maybe;
    } else el=maybe;
   }
   if(!el) el=document.body;
  }catch(e){}
  if(!el) return {error:'editable target not found'};
 }
 const ok=await typeUniversal(el, text);
 return ok?{success:true, tag:el.tagName}:{error:'type failed'};
}
chrome.runtime.onMessage.addListener((req,_s,sendResponse)=>{
 if(req.action==='universalClick'){
  universalClick(req.selector, req.ref, req.coordinates, {button:req.button, altKey:req.modifiers&&req.modifiers.altKey, ctrlKey:req.modifiers&&req.modifiers.ctrlKey, metaKey:req.modifiers&&req.modifiers.metaKey, shiftKey:req.modifiers&&req.modifiers.shiftKey}).then(sendResponse).catch(e=>sendResponse({error:e.message}));
  return true;
 }
 if(req.action==='universalType' || req.action==='universalFill'){
  universalType(req.selector, req.ref, req.value||req.text).then(sendResponse).catch(e=>sendResponse({error:e.message}));
  return true;
 }
 if(req.action==='universalEyes' || req.action==='universal_read_page'){
  (async()=>{
   try{
    let snap=getEyesSnapshot(req.maxNodes||800);
    // cross-origin iframe probe (via background relay)
    try{
     if(window===window.top && document.querySelector('iframe')){
      const max=req.maxNodes||800;
      const results=await relayToFrames('universal_eyes_probe', {maxNodes:Math.floor(max/2)}, 'all', 900);
      const extra=[];
      for(const r of results){
       const sn=r.response.snapshot;
       if(sn && Array.isArray(sn.nodes)) for(const nd of sn.nodes){ if(nd&&typeof nd==='object') extra.push({...nd, frameId:r.frameId}); }
      }
      if(extra.length>0){
       snap.nodes=snap.nodes.concat(extra).slice(0, max);
       snap.total=snap.nodes.length;
       snap.truncated=snap.truncated||extra.length>=max/2;
      }
     }
    }catch(e){}
    sendResponse({success:true, snapshot:snap});
   }catch(e){ sendResponse({error:e.message}); }
  })();
  return true;
 }
 if(req.action==='universal_type_probe' || req.action==='universal_eyes_probe' || req.action==='universal_probe'){
  handleProbe(req).then(r=>sendResponse(r||{success:false})).catch(e=>sendResponse({success:false, error:e&&e.message}));
  return true;
 }
 if(req.action==='universal_ping'){ sendResponse({status:'pong', v:PROTOCOL_VERSION, script:'universal-helper'}); return false; }
});
}
