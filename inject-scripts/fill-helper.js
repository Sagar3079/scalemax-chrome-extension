/* eslint-disable */
// fill-helper.js
// This script is injected into the page to handle form filling operations

if (window.__FILL_HELPER_INITIALIZED__) {
  // Already initialized, skip
} else {
  window.__FILL_HELPER_INITIALIZED__ = true;

  // Reported on the ping reply so the background can detect a stale resident
  // copy of this script after an extension update.
  const PROTOCOL_VERSION = 1;

  /**
   * Fill an input element with the specified value
   * @param {string} selector - CSS selector for the element to fill
   * @param {string} value - Value to fill into the element
   * @returns {Promise<Object>} - Result of the fill operation
   */
  async function fillElement(selector, value, ref = null) {
    try {
      // Find the element
      let element = null;
      if (ref && typeof ref === 'string') {
        try {
          const map = window.__scalemaxElementMap;
          const weak = map && map[ref];
          element = weak && typeof weak.deref === 'function' ? weak.deref() : null;
        } catch (e) {
          // ignore
        }
        if (!element || !(element instanceof Element)) {
          return {
            error: `Element ref "${ref}" not found. Please call chrome_read_page first and ensure the ref is still valid.`,
          };
        }
      } else {
        element = document.querySelector(selector);
      }
      if (!element) {
        return {
          error: selector
            ? `Element with selector "${selector}" not found`
            : `Element for ref not found`,
        };
      }

      // Get element information
      const rect = element.getBoundingClientRect();
      const elementInfo = {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        type: element.type || null,
        isVisible: isElementVisible(element),
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
      };

      // Check if element is visible
      if (!elementInfo.isVisible) {
        return {
          error: `Element with selector "${selector}" is not visible`,
          elementInfo,
        };
      }

      const isContentEditableEl = (el) => { if(!el) return false; if(el.isContentEditable) return true; try{ const ce=el.getAttribute && el.getAttribute('contenteditable'); if(ce!==null && ce!=='false') return true; if(el.closest && el.closest('[contenteditable]')) return true; if(el.matches && el.matches('.ProseMirror,.ql-editor,[data-slate-editor],[role="textbox"],[role="searchbox"]')) return true; const p=el.closest && el.closest('.ProseMirror,.ql-editor,[data-slate-editor]'); if(p) return true; }catch(e){} return false; };
      const isContentEditable = isContentEditableEl(element);
      // Check if element is an input, textarea, or select
      // Keep a permissive list to allow type-specific branches below to handle behavior
      const validInputTypes = [
        'text',
        'email',
        'password',
        'number',
        'search',
        'tel',
        'url',
        'date',
        'datetime-local',
        'month',
        'time',
        'week',
        'color',
        'checkbox',
        'radio',
        'range',
      ];

      if (!validTags.includes(element.tagName) && !isContentEditable) {
        // If the element is a custom element with open shadow root, try to find a fillable inner control
        try {
          const anyEl = /** @type {any} */ (element);
          const sr = anyEl && anyEl.shadowRoot ? anyEl.shadowRoot : null;
          if (sr) {
            // Search common fillable targets inside shadow root (breadth-first)
            const queue = Array.from(sr.children || []);
            const isFillable = (el) =>
              !!el &&
              (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isContentEditableEl(el));
            while (queue.length) {
              const cur = queue.shift();
              if (!cur) continue;
              if (isFillable(cur)) {
                element = cur;
                break;
              }
              try {
                const children = cur.children || [];
                for (let i = 0; i < children.length; i++) queue.push(children[i]);
                const innerSr = /** @type {any} */ (cur).shadowRoot;
                if (innerSr && innerSr.children) {
                  for (let i = 0; i < innerSr.children.length; i++) queue.push(innerSr.children[i]);
                }
              } catch (_) {}
            }
            if (!validTags.includes(element.tagName) && !isContentEditableEl(element)) {
              return {
                error: `Element with selector "${selector}" is not a fillable element (must be INPUT, TEXTAREA, SELECT or contenteditable)`,
                elementInfo,
              };
            }
          } else if (element.querySelector) {
            const ce = element.querySelector('[contenteditable="true"], [contenteditable=""]');
            if (ce) { element = ce; }
            else {
              return {
                error: `Element with selector "${selector}" is not a fillable element (must be INPUT, TEXTAREA, SELECT or contenteditable)`,
                elementInfo,
              };
            }
          } else {
            return {
              error: `Element with selector "${selector}" is not a fillable element (must be INPUT, TEXTAREA, SELECT or contenteditable)`,
              elementInfo,
            };
          }
        } catch (_) {
          return {
            error: `Element with selector "${selector}" is not a fillable element (must be INPUT, TEXTAREA, SELECT or contenteditable)`,
            elementInfo,
          };
        }
      }

      // For input elements, check if the type is valid (allow type-specific branches below)
      if (
        element.tagName === 'INPUT' &&
        !validInputTypes.includes(element.type) &&
        element.type !== null
      ) {
        return {
          error: `Input element with selector "${selector}" has type "${element.type}" which is not fillable`,
          elementInfo,
        };
      }

      // Scroll element into view
      element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Focus the element
      element.focus();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const ceCheck = isContentEditableEl(element);
      if (ceCheck) {
        try {
          element.focus();
          const sel = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(element);
          range.collapse(false);
          if (sel) { sel.removeAllRanges(); sel.addRange(range); }
        } catch(e) {}
        const text = String(value ?? '');
        let inserted = false;
        try { inserted = document.execCommand('insertText', false, text); } catch(e) {}
        if (!inserted) {
          try {
            const before = element.textContent || '';
            if (before.length === 0) element.textContent = text;
            else {
              const sel2 = window.getSelection();
              if (sel2 && sel2.rangeCount > 0) {
                const r = sel2.getRangeAt(0);
                r.deleteContents();
                r.insertNode(document.createTextNode(text));
                r.collapse(false);
                sel2.removeAllRanges(); sel2.addRange(r);
              } else element.textContent = (element.textContent || '') + text;
            }
            inserted = true;
          } catch(e) {}
        }
        element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
        element.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: text }));
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        try { element.dispatchEvent(new ClipboardEvent('paste', { bubbles: true })); } catch(e) {}
        return { success: true, message: 'Contenteditable filled successfully', elementInfo: { ...elementInfo, value: element.innerText || element.textContent, isContentEditable: true } };
      }

      // Type-specific handling for tricky inputs first
      if (element.tagName === 'INPUT' && element.type === 'checkbox') {
        // Accept boolean or string-like boolean
        let checkedVal;
        if (typeof value === 'boolean') {
          checkedVal = value;
        } else if (typeof value === 'string') {
          const v = value.trim().toLowerCase();
          if (['true', '1', 'yes', 'on'].includes(v)) checkedVal = true;
          else if (['false', '0', 'no', 'off'].includes(v)) checkedVal = false;
        }
        if (typeof checkedVal !== 'boolean') {
          return {
            error:
              'Checkbox requires a boolean (true/false) or a boolean-like string ("true"/"false"/"on"/"off").',
            elementInfo,
          };
        }
        const previous = element.checked;
        element.checked = checkedVal;
        element.focus();
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        return {
          success: true,
          message: `Checkbox set to ${element.checked}`,
          elementInfo: { ...elementInfo, checked: element.checked, previousChecked: previous },
        };
      }

      if (element.tagName === 'INPUT' && element.type === 'radio') {
        // For radios, the selector/ref should target the specific input to select
        const previous = element.checked;
        element.checked = true;
        element.focus();
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        return {
          success: true,
          message: 'Radio selected',
          elementInfo: {
            ...elementInfo,
            checked: element.checked,
            previousChecked: previous,
            name: element.name || null,
          },
        };
      }

      if (element.tagName === 'INPUT' && element.type === 'range') {
        const numericValue = typeof value === 'number' ? value : Number(value);
        if (Number.isNaN(numericValue)) {
          return { error: 'Range input requires a numeric value', elementInfo };
        }
        const previous = element.value;
        element.value = String(numericValue);
        element.focus();
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        return {
          success: true,
          message: `Set range to ${element.value} (min: ${element.min}, max: ${element.max})`,
          elementInfo: { ...elementInfo, value: element.value },
        };
      }

      if (element.tagName === 'INPUT' && element.type === 'number') {
        if (value !== '' && value !== null && value !== undefined && Number.isNaN(Number(value))) {
          return { error: 'Number input requires a numeric value', elementInfo };
        }
        const previous = element.value;
        element.value = String(value ?? '');
        element.focus();
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        return {
          success: true,
          message: `Set number input to ${element.value} (previous: ${previous})`,
          elementInfo: { ...elementInfo, value: element.value },
        };
      }

      // Fill the element based on its type
      if (element.tagName === 'SELECT') {
        // For select elements, find the option with matching value or text
        let optionFound = false;
        for (const option of element.options) {
          if (option.value === value || option.text === value) {
            element.value = option.value;
            optionFound = true;
            break;
          }
        }

        if (!optionFound) {
          return {
            error: `No option with value or text "${value}" found in select element`,
            elementInfo,
          };
        }

        // Trigger change event
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        // For input and textarea elements
        // Clear the current value then set new value
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));

        element.value = String(value);

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Blur the element
      element.blur();

      return {
        success: true,
        message: 'Element filled successfully',
        elementInfo: {
          ...elementInfo,
          value: element.value, // Include the final value in the response
        },
      };
    } catch (error) {
      return {
        error: `Error filling element: ${error.message}`,
      };
    }
  }

  /**
   * Check if an element is visible
   * @param {Element} element - The element to check
   * @returns {boolean} - Whether the element is visible
   */
  function isElementVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }

    // Check if element is within viewport
    if (
      rect.bottom < 0 ||
      rect.top > window.innerHeight ||
      rect.right < 0 ||
      rect.left > window.innerWidth
    ) {
      return false;
    }

    // Check if element is actually visible at its center point
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const elementAtPoint = document.elementFromPoint(centerX, centerY);
    if (!elementAtPoint) return false;

    return element === elementAtPoint || element.contains(elementAtPoint);
  }

  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'fillElement') {
      fillElement(request.selector, request.value, request.ref)
        .then(sendResponse)
        .catch((error) => {
          sendResponse({
            error: `Unexpected error: ${error.message}`,
          });
        });
      return true; // Indicates async response
    } else if (request.action === 'chrome_fill_or_select_ping') {
      sendResponse({ status: 'pong', v: PROTOCOL_VERSION, script: 'fill-helper' });
      return false;
    }
  });
}
