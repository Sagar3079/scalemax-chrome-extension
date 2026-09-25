/* eslint-disable */
if(window.__MOUSE_HELPER_INITIALIZED__){}else{
window.__MOUSE_HELPER_INITIALIZED__=true;
// Reported on the ping reply so the background can detect a stale resident copy
// of this script after an extension update instead of skipping injection.
const PROTOCOL_VERSION = 1;
const HOST_ID='__scalemax_mouse_host__';
const MOUSE_SVG=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="white" stroke="black" stroke-width="1.2" stroke-linejoin="round"/><circle cx="5" cy="5" r="1.2" fill="black"/></svg>`;
let host=null, shadow=null, cursor=null, trail=null, label=null;
let pos={x: -100, y: -100};
let visible=false;
function ensureMouse(){
 if(host && host.isConnected) return;
 host=document.createElement('div');
 host.id=HOST_ID;
 host.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:2147483645;overflow:visible;';
 const sh=host.attachShadow({mode:'open'});
 shadow=sh;
 const style=document.createElement('style');
 style.textContent=`
  .mc{position:fixed;left:0;top:0;width:22px;height:22px;transform:translate(-2px,-2px);transition: left 0.2s cubic-bezier(0.2,0,0,1), top 0.2s cubic-bezier(0.2,0,0,1), opacity 0.3s ease;will-change:left,top,opacity;filter: drop-shadow(0 1px 4px rgba(0,0,0,0.35));pointer-events:none;opacity:0.96;}
  .mc.clicking{transform:translate(-2px,-2px) scale(0.85);}
  .dot{position:fixed;width:10px;height:10px;border-radius:50%;background:rgba(239,68,68,0.85);border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.4);transform:translate(-50%,-50%);pointer-events:none;opacity:0;transition: opacity 0.15s;}
  .dot.on{opacity:1;}
  .lbl{position:fixed;transform:translate(14px,14px);background:rgba(15,23,42,0.92);color:white;font:600 11px/1 Inter,system-ui;padding:4px 7px;border-radius:999px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.15s;max-width:220px;overflow:hidden;text-overflow:ellipsis;}
  .lbl.on{opacity:1;}
 `;
 sh.appendChild(style);
 cursor=document.createElement('div');
 cursor.className='mc';
 cursor.innerHTML=MOUSE_SVG;
 sh.appendChild(cursor);
 trail=document.createElement('div');
 trail.className='dot';
 sh.appendChild(trail);
 label=document.createElement('div');
 label.className='lbl';
 sh.appendChild(label);
 document.documentElement.appendChild(host);
 visible=true;
}
function moveTo(x,y, opts={}){
 ensureMouse();
 pos={x,y};
 cursor.style.left=x+'px';
 cursor.style.top=y+'px';
 trail.style.left=x+'px';
 trail.style.top=y+'px';
 if(opts.label){
  label.textContent=opts.label;
  label.style.left=x+'px';
  label.style.top=y+'px';
  label.classList.add('on');
  clearTimeout(label._t);
  label._t=setTimeout(()=>label.classList.remove('on'), 900);
 }
 cursor.style.display='block';
 cursor.style.opacity='1';
 trail.style.display='block';
 clearTimeout(moveTo._hide);
 moveTo._hide=setTimeout(()=>{ try{ cursor.style.opacity='0'; cursor.style.display='none'; trail.style.display='none'; }catch(e){} }, 1400);
}
function clickEffect(x,y){
 ensureMouse();
 moveTo(x,y);
 cursor.classList.add('clicking');
 trail.classList.add('on');
 setTimeout(()=>{ cursor.classList.remove('clicking'); }, 160);
 setTimeout(()=>{ trail.classList.remove('on'); }, 420);
 // ripple
 const rip=document.createElement('div');
 rip.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:12px;height:12px;border:2px solid rgba(99,102,241,0.9);border-radius:50%;transform:translate(-50%,-50%) scale(0.3);pointer-events:none;transition: transform 0.45s ease, opacity 0.45s ease;z-index:2147483646;`;
 shadow.appendChild(rip);
 requestAnimationFrame(()=>{
  rip.style.transform='translate(-50%,-50%) scale(2.6)';
  rip.style.opacity='0';
 });
 setTimeout(()=>{ try{rip.remove();}catch(e){} }, 500);
}
function hide(){
 if(cursor) cursor.style.display='none';
 if(trail) trail.style.display='none';
 if(label) label.classList.remove('on');
}
function show(){ ensureMouse(); cursor.style.display='block'; }
let queue=Promise.resolve();
function enqueueMove(x,y,labelText){
 queue=queue.then(()=> new Promise(res=>{
  moveTo(x,y,{label:labelText});
  setTimeout(res, 240);
 }));
 return queue;
}
chrome.runtime.onMessage.addListener((req,_s,sendResponse)=>{
 if(req.action==='mouse_move' || req.action==='chrome_mouse_move'){
  const x=Number(req.x||req.clientX||0), y=Number(req.y||req.clientY||0);
  enqueueMove(x,y, req.label||'').then(()=> sendResponse({success:true, x,y}));
  return true;
 }
 if(req.action==='mouse_click' || req.action==='chrome_mouse_click'){
  const x=Number(req.x||req.clientX||req.coordinates&&req.coordinates.x||0), y=Number(req.y||req.clientY||req.coordinates&&req.coordinates.y||0);
  enqueueMove(x,y, req.label||'click').then(()=>{
   clickEffect(x,y);
   setTimeout(()=> sendResponse({success:true, x,y}), 180);
  });
  return true;
 }
 if(req.action==='mouse_hide'){ hide(); sendResponse({success:true}); return false; }
 if(req.action==='mouse_show'){ show(); sendResponse({success:true}); return false; }
 if(req.action==='mouse_ping'){ sendResponse({status:'pong', v:PROTOCOL_VERSION, script:'mouse-helper'}); return false; }
 // auto hook for universalClick / clickElement to show mouse
 if(req.action==='clickElement' || req.action==='universalClick'){
  const cx= req.coordinates ? Number(req.coordinates.x) : null;
  const cy= req.coordinates ? Number(req.coordinates.y) : null;
  if(typeof cx==='number' && typeof cy==='number'){
   enqueueMove(cx,cy, 'click');
  } else if(req.selector||req.ref){
   // will resolve after element found, but we can still show at center as fallback
   setTimeout(()=>{
    const ref = req.ref ? String(req.ref) : '';
    const selector = req.selector ? String(req.selector) : '';
    let el = null;
    if(ref){
     try{
      const map = window.__claudeElementMap;
      const weak = map && map[ref];
      el = weak && typeof weak.deref === 'function' ? weak.deref() : null;
     }catch(e){
      el = null;
      console.warn('[scalemax-mouse] error resolving ref "'+ref+'":', e);
     }
     if(!el){
      console.warn('[scalemax-mouse] ref "'+ref+'" did not resolve (stale ref or element removed). Falling back to selector "'+selector+'", which may match a DIFFERENT element.');
     }
    }
    if(!el && selector){
     try{
      el = document.querySelector(selector);
     }catch(e){
      el = null;
      console.warn('[scalemax-mouse] invalid selector "'+selector+'":', e);
     }
     if(!el){
      console.warn('[scalemax-mouse] selector "'+selector+'" matched no element.');
     }
    }
    if(!el){
     console.warn('[scalemax-mouse] could not locate a target for the cursor overlay (ref="'+ref+'", selector="'+selector+'"); skipping cursor move.');
     return;
    }
    try{
     const r=el.getBoundingClientRect();
     enqueueMove(r.left+r.width/2, r.top+r.height/2, 'click');
    }catch(e){
     console.warn('[scalemax-mouse] failed to move the cursor overlay (ref="'+ref+'", selector="'+selector+'"):', e);
    }
   }, 60);
  }
 }
 return false;
});
// auto move on any universal click dispatched via dispatchUniversalClick hook
const origDispatch = window.dispatchUniversalClick;
window.addEventListener('mousemove', (e)=>{
 // keep pos updated for trail if needed
}, {passive:true});

// expose for other helpers
window.__scalemaxMouse={ moveTo, clickEffect, enqueueMove, ensureMouse, hide, show };
}
