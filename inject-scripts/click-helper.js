/* eslint-disable */
// click-helper.js
// This script is injected into the page to handle click operations

if (window.__CLICK_HELPER_INITIALIZED__) {
  // Already initialized, skip
} else {
  window.__CLICK_HELPER_INITIALIZED__ = true;

  // Reported on the ping reply so the background can detect a stale resident
  // copy of this script after an extension update (the ping-then-skip-injection
  // path would otherwise keep old handlers alive forever).
  const PROTOCOL_VERSION = 1;

  /**
   * Click on an element matching the selector or at specific coordinates
   * @param {string} selector - CSS selector for the element to click
   * @param {boolean} waitForNavigation - Whether to wait for navigation to complete after click
   * @param {number} timeout - Timeout in milliseconds for waiting for the element or navigation
   * @param {Object} coordinates - Optional coordinates for clicking at a specific position
   * @param {number} coordinates.x - X coordinate relative to the viewport
   * @param {number} coordinates.y - Y coordinate relative to the viewport
   * @returns {Promise<Object>} - Result of the click operation
   */
  async function clickElement(
    selector,
    waitForNavigation = false,
    timeout = 5000,
    coordinates = null,
    ref = null,
    double = false,
    options = {},
  ) {
    try {
      let element = null;
      let elementInfo = null;
      let clickX, clickY;

      if (ref && typeof ref === 'string') {
        // Resolve element from weak map
        let target = null;
        try {
          const map = window.__scalemaxElementMap;
          const weak = map && map[ref];
          target = weak && typeof weak.deref === 'function' ? weak.deref() : null;
        } catch (e) {
          // ignore
        }

        if (!target || !(target instanceof Element)) {
          return {
            error: `Element ref "${ref}" not found. Please call chrome_read_page first and ensure the ref is still valid.`,
          };
        }

        element = target;
        element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        await new Promise((resolve) => setTimeout(resolve, 80));

        const rect = element.getBoundingClientRect();
        clickX = rect.left + rect.width / 2;
        clickY = rect.top + rect.height / 2;
        elementInfo = {
          tagName: element.tagName,
          id: element.id,
          className: element.className,
          text: element.textContent?.trim().substring(0, 100) || '',
          href: element.href || null,
          type: element.type || null,
          isVisible: true,
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
          },
          clickMethod: 'ref',
          ref,
        };
      } else if (
        coordinates &&
        typeof coordinates.x === 'number' &&
        typeof coordinates.y === 'number'
      ) {
        clickX = coordinates.x;
        clickY = coordinates.y;

        element = document.elementFromPoint(clickX, clickY);

        if (element) {
          const rect = element.getBoundingClientRect();
          elementInfo = {
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            text: element.textContent?.trim().substring(0, 100) || '',
            href: element.href || null,
            type: element.type || null,
            isVisible: true,
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              left: rect.left,
            },
            clickMethod: 'coordinates',
            clickPosition: { x: clickX, y: clickY },
          };
        } else {
          elementInfo = {
            clickMethod: 'coordinates',
            clickPosition: { x: clickX, y: clickY },
            warning: 'No element found at the specified coordinates',
          };
        }
      } else {
        let deep=(sel)=>{
          try{ let e=document.querySelector(sel); if(e) return e; }catch(e){}
          const walk=(node)=>{
            if(!node) return null;
            if(node.shadowRoot){
              try{ let f=node.shadowRoot.querySelector(sel); if(f) return f; }catch(e){}
              for(const c of node.shadowRoot.children||[]){ const r=walk(c); if(r) return r; }
            }
            for(const c of node.children||[]){ const r=walk(c); if(r) return r; }
            return null;
          };
          return walk(document.documentElement||document.body);
        };
        element = document.querySelector(selector);
        if(!element) element=deep(selector);
        if(!element && selector && selector.includes('|>')){
          try{
            const parts=selector.split('|>').map(s=>s.trim());
            const fsel=parts[0]; const isel=parts.slice(1).join(' |> ');
            const f=document.querySelector(fsel);
            if(f && f.contentDocument){ try{ element=f.contentDocument.querySelector(isel); }catch(e){} if(!element) element=deep(isel, f.contentDocument); }
          }catch(e){}
        }
        if (!element) {
          return {
            error: `Element with selector "${selector}" not found`,
          };
        }

        const rect = element.getBoundingClientRect();
        elementInfo = {
          tagName: element.tagName,
          id: element.id,
          className: element.className,
          text: element.textContent?.trim().substring(0, 100) || '',
          href: element.href || null,
          type: element.type || null,
          isVisible: true,
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
          },
          clickMethod: 'selector',
        };

        // First sroll so that the element is in view, then check visibility.
        element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        await new Promise((resolve) => setTimeout(resolve, 100));
        elementInfo.isVisible = isElementVisible(element);
        if (!elementInfo.isVisible) {
          return {
            error: `Element with selector "${selector}" is not visible`,
            elementInfo,
          };
        }

        const updatedRect = element.getBoundingClientRect();
        clickX = updatedRect.left + updatedRect.width / 2;
        clickY = updatedRect.top + updatedRect.height / 2;
      }

      let navigationPromise;
      if (waitForNavigation) {
        navigationPromise = new Promise((resolve) => {
          const beforeUnloadListener = () => {
            window.removeEventListener('beforeunload', beforeUnloadListener);
            resolve(true);
          };
          window.addEventListener('beforeunload', beforeUnloadListener);

          setTimeout(() => {
            window.removeEventListener('beforeunload', beforeUnloadListener);
            resolve(false);
          }, timeout);
        });
      }

      if (
        element &&
        (elementInfo.clickMethod === 'selector' || elementInfo.clickMethod === 'ref')
      ) {
        if (double) {
          dispatchClickSequence(element, clickX, clickY, options, true);
        } else {
          dispatchClickSequence(element, clickX, clickY, options, false);
        }
      } else {
        if (double) simulateDoubleClick(clickX, clickY, options);
        else simulateClick(clickX, clickY, options);
      }

      // Wait for navigation if needed
      let navigationOccurred = false;
      if (waitForNavigation) {
        navigationOccurred = await navigationPromise;
      }

      return {
        success: true,
        message: 'Element clicked successfully',
        elementInfo,
        navigationOccurred,
      };
    } catch (error) {
      return {
        error: `Error clicking element: ${error.message}`,
      };
    }
  }

  /**
   * Simulate a mouse click at specific coordinates
   * @param {number} x - X coordinate relative to the viewport
   * @param {number} y - Y coordinate relative to the viewport
   */
  function simulateClick(x, y, options = {}) {
    const element = document.elementFromPoint(x, y);
    if (!element) return;
    dispatchClickSequence(element, x, y, options, false);
  }

  /**
   * Simulate a double click sequence at specific coordinates
   */
  function simulateDoubleClick(x, y, options = {}) {
    const element = document.elementFromPoint(x, y);
    if (!element) return;
    dispatchClickSequence(element, x, y, options, true);
  }

  /**
   * Simulate double click using element when available
   */
  function simulateDomDoubleClick(element, x, y, options) {
    dispatchClickSequence(element, x, y, options, true);
  }

  function normalizeMouseOpts(x, y, options = {}) {
    const bubbles = options.bubbles !== false; // default true
    const cancelable = options.cancelable !== false; // default true
    const altKey = !!(options.modifiers && options.modifiers.altKey);
    const ctrlKey = !!(options.modifiers && options.modifiers.ctrlKey);
    const metaKey = !!(options.modifiers && options.modifiers.metaKey);
    const shiftKey = !!(options.modifiers && options.modifiers.shiftKey);
    const btn = String(options.button || 'left');
    const button = btn === 'right' ? 2 : btn === 'middle' ? 1 : 0;
    const buttons = btn === 'right' ? 2 : btn === 'middle' ? 4 : 1;
    return {
      bubbles,
      cancelable,
      altKey,
      ctrlKey,
      metaKey,
      shiftKey,
      button,
      buttons,
      clientX: x,
      clientY: y,
      view: window,
    };
  }

  // Map (x,y) from the element's frame viewport to the nearest same-origin ancestor window
  // hosting the cursor overlay; null when a cross-origin boundary blocks the translation.
  function findMouseOverlay(element, x, y) {
    let w = (element && element.ownerDocument && element.ownerDocument.defaultView) || window;
    try {
      while (w) {
        if (w.__scalemaxMouse && typeof w.__scalemaxMouse.moveTo === 'function') return { m: w.__scalemaxMouse, x, y };
        if (w === w.top) return null;
        const fe = w.frameElement;
        if (!fe) return null;
        const r = fe.getBoundingClientRect();
        x += r.left + (fe.clientLeft || 0);
        y += r.top + (fe.clientTop || 0);
        w = w.parent;
      }
    } catch (e) {}
    return null;
  }

  function dispatchClickSequence(element, x, y, options = {}, isDouble = false) {
    try{ const mp=findMouseOverlay(element,x,y); if(mp){ mp.m.moveTo(mp.x,mp.y,{label:'click'}); if(typeof mp.m.clickEffect==='function') mp.m.clickEffect(mp.x,mp.y); } }catch(e){}
    try{ element.focus(); }catch(e){}
    const base = normalizeMouseOpts(x, y, options);
    const pbase={...base, pointerId:1, pointerType:'mouse', isPrimary:true, composed:true};
    try{ element.dispatchEvent(new PointerEvent('pointerover', pbase)); }catch(e){}
    try{ element.dispatchEvent(new MouseEvent('mouseover', base)); }catch(e){}
    try{ element.dispatchEvent(new PointerEvent('pointerenter', pbase)); }catch(e){}
    try{ element.dispatchEvent(new MouseEvent('mouseenter', base)); }catch(e){}
    try{ element.dispatchEvent(new PointerEvent('pointermove', pbase)); }catch(e){}
    try{ element.dispatchEvent(new MouseEvent('mousemove', base)); }catch(e){}
    try{ element.dispatchEvent(new PointerEvent('pointerdown', pbase)); }catch(e){}
    try{ element.dispatchEvent(new MouseEvent('mousedown', base)); }catch(e){}
    try{ element.dispatchEvent(new PointerEvent('pointerup', pbase)); }catch(e){}
    try{ element.dispatchEvent(new MouseEvent('mouseup', base)); }catch(e){}
    try{ element.dispatchEvent(new MouseEvent('click', base)); }catch(e){}
    if (base.button === 2) {
      try{ element.dispatchEvent(new MouseEvent('contextmenu', base)); }catch(e){}
    }
    if (isDouble) {
      setTimeout(() => {
        try{ element.dispatchEvent(new PointerEvent('pointerdown', pbase)); }catch(e){}
        try{ element.dispatchEvent(new MouseEvent('mousedown', {...base, detail:2})); }catch(e){}
        try{ element.dispatchEvent(new PointerEvent('pointerup', pbase)); }catch(e){}
        try{ element.dispatchEvent(new MouseEvent('mouseup', {...base, detail:2})); }catch(e){}
        try{ element.dispatchEvent(new MouseEvent('click', {...base, detail:2})); }catch(e){}
        try{ element.dispatchEvent(new MouseEvent('dblclick', base)); }catch(e){}
      }, 30);
    }
    try{ if(element.getAttribute&&element.getAttribute('role')==='button'){ element.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:'Enter',code:'Enter'})); }}catch(e){}
  }

  /**
   * Check if an element is visible
   * @param {Element} element - The element to check
   * @returns {boolean} - Whether the element is visible
   */
  function isElementVisible(element) {
    if (!element) return false;
    try{ if(element.checkVisibility) return element.checkVisibility({checkOpacity:true, checkVisibilityCSS:true}); }catch(e){}
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (parseFloat(style.opacity)===0) return false;
    const rect = element.getBoundingClientRect();
    if (element instanceof SVGElement){
      try{ const b=element.getBBox(); if(b.width===0&&b.height===0) return false; }catch(e){}
    } else if (rect.width === 0 || rect.height === 0) {
      if(element.tagName!=='A') return false;
    }
    if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) return false;
    const pts=[[0.5,0.5],[0.2,0.2],[0.8,0.2],[0.2,0.8],[0.8,0.8]];
    for(const [fx,fy] of pts){
      const x=rect.left+rect.width*fx, y=rect.top+rect.height*fy;
      try{ const at=document.elementFromPoint(x,y); if(at && (at===element||element.contains(at))) return true; }catch(e){}
      try{
        let cur=element;
        while(cur && cur.getRootNode && cur.getRootNode() instanceof ShadowRoot){
          const host=cur.getRootNode().host; const sr=host&&host.shadowRoot;
          if(sr&&sr.elementFromPoint){ const se=sr.elementFromPoint(x,y); if(se && (se===element||element.contains(se))) return true; }
          cur=host;
        }
      }catch(e){}
    }
    return false;
  }

  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'clickElement') {
      clickElement(
        request.selector,
        request.waitForNavigation,
        request.timeout,
        request.coordinates,
        request.ref,
        !!request.double,
        {
          button: request.button,
          bubbles: request.bubbles,
          cancelable: request.cancelable,
          modifiers: request.modifiers,
        },
      )
        .then(sendResponse)
        .catch((error) => {
          sendResponse({
            error: `Unexpected error: ${error.message}`,
          });
        });
      return true; // Indicates async response
    } else if (request.action === 'chrome_click_element_ping') {
      sendResponse({ status: 'pong', v: PROTOCOL_VERSION, script: 'click-helper' });
      return false;
    }
  });
}
