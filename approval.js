// Approval window for high-risk agent tool calls (approvalMode "confirm-high").
// The background worker opens this page and waits for a decision; closing the
// window or letting it time out denies the call.
(function () {
  const id = new URLSearchParams(location.search).get('id') || '';
  const $ = (sel) => document.getElementById(sel);
  const buttons = ['deny', 'allow-run', 'allow-once'].map($);

  const WHY = {
    chrome_javascript: 'Runs arbitrary JavaScript inside a page, with access to everything that page can see.',
    chrome_network_request: 'Sends an HTTP request using your browser cookies and logged-in sessions.',
    chrome_agent_dispatch: 'Opens additional tabs and starts more agents working in them.',
  };

  function setStatus(text) {
    $('status').textContent = text;
  }

  function disable() {
    buttons.forEach((b) => { b.disabled = true; });
  }

  function decide(approved, scope) {
    disable();
    chrome.runtime.sendMessage({ type: 'scalemax_approval_decide', id, approved, scope }, (res) => {
      if (chrome.runtime.lastError || !res || !res.ok) {
        setStatus('This request is no longer pending. You can close this window.');
        return;
      }
      window.close();
    });
  }

  chrome.runtime.sendMessage({ type: 'scalemax_approval_get', id }, (res) => {
    if (chrome.runtime.lastError || !res || !res.ok) {
      disable();
      $('tool').textContent = 'Request expired';
      setStatus('This request is no longer pending. You can close this window.');
      return;
    }
    const req = res.request || {};
    $('tool').textContent = req.tool || 'unknown tool';
    $('risk').textContent = (req.risk || 'high') + ' risk';
    if (WHY[req.tool]) $('why').textContent = WHY[req.tool];
    $('task').textContent = req.task || '(no task text)';
    let args = '';
    try { args = JSON.stringify(req.args || {}, null, 2); } catch (_) { args = String(req.args); }
    $('args').textContent = args;

    const deadline = (req.requestedAt || Date.now()) + (res.timeoutMs || 120000);
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setStatus(`Denied automatically in ${left}s if you do not respond.`);
      if (left > 0) setTimeout(tick, 1000);
    };
    tick();
  });

  $('deny').addEventListener('click', () => decide(false, 'once'));
  $('allow-once').addEventListener('click', () => decide(true, 'once'));
  $('allow-run').addEventListener('click', () => decide(true, 'run'));
})();
