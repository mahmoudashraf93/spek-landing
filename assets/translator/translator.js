(() => {
  'use strict';
  const tool = document.querySelector('[data-translator]');
  if (!tool) return;
  const byId = (id) => document.getElementById(id);
  const source = byId('source-language'), target = byId('target-language');
  const input = byId('source-text'), output = byId('translated-text');
  const button = byId('translate-button'), status = byId('translation-status');
  const copy = byId('copy-translation'), counter = byId('character-count');
  let widgetId, token = '', ready = false, busy = false, config, wasOverLimit = false;
  source.value = tool.dataset.source;
  target.value = tool.dataset.target;

  function tell(message, error = false) { status.textContent = message; status.dataset.error = String(error); }
  function update() {
    const length = Array.from(input.value).length;
    counter.textContent = `${length} / 500`;
    const invalid = length > 500;
    input.setAttribute('aria-invalid', String(invalid));
    button.disabled = !ready || busy || !token || !input.value.trim() || invalid;
    byId('swap-languages').disabled = busy;
    source.disabled = busy;
    target.disabled = busy;
    input.readOnly = busy;
    byId('clear-text').disabled = busy;
    if (invalid && !busy) tell('Please shorten your text to 500 characters.', true);
    else if (wasOverLimit && !busy) tell(ready ? (token ? 'Ready when you are.' : 'Complete the security check, then translate your message.') : 'The translator is being prepared. Please try again soon.');
    wasOverLimit = invalid;
  }
  function invalidateOutput() {
    output.value = '';
    copy.disabled = true;
    copy.textContent = 'Copy translation';
    byId('output-label').textContent = 'Translation';
  }
  input.addEventListener('input', () => { invalidateOutput(); update(); });
  source.addEventListener('change', () => {
    if (source.value === target.value || (source.value !== 'en' && target.value !== 'en')) target.value = source.value === 'en' ? 'es' : 'en';
    invalidateOutput(); update();
  });
  target.addEventListener('change', () => {
    if (source.value === target.value || (source.value !== 'en' && target.value !== 'en')) source.value = target.value === 'en' ? 'es' : 'en';
    invalidateOutput(); update();
  });
  byId('swap-languages').addEventListener('click', () => {
    const original = input.value;
    const result = output.value;
    [source.value, target.value] = [target.value, source.value];
    input.value = result || original;
    invalidateOutput(); update(); input.focus();
  });
  byId('clear-text').addEventListener('click', () => {
    input.value = ''; invalidateOutput(); update(); input.focus();
  });
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(output.value); copy.textContent = 'Copied'; }
    catch { output.focus(); output.select(); tell('Select and copy the translation using your browser.'); }
  });
  byId('translation-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    busy = true; button.querySelector('span').textContent = 'Translating…';
    invalidateOutput(); tell('Translating your message…'); update();
    try {
      const response = await fetch('/api/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
        body: JSON.stringify({ text: input.value, source: source.value, target: target.value, token, requestId: crypto.randomUUID() }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to translate. Please try again later.');
      output.value = result.translation;
      output.lang = target.value;
      copy.disabled = false;
      byId('output-label').textContent = target.selectedOptions[0].textContent;
      tell(`Translation ready. ${result.remaining} ${result.remaining === 1 ? 'translation' : 'translations'} left today.`);
      output.focus();
    } catch (error) {
      tell(error.name === 'TimeoutError' ? 'Translation took too long. Please try again later.' : error.message, true);
    } finally {
      busy = false; token = ''; button.querySelector('span').textContent = 'Translate';
      if (window.turnstile && widgetId !== undefined) window.turnstile.reset(widgetId);
      update();
    }
  });

  async function initialize() {
    try {
      const response = await fetch('/api/config', { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error();
      config = await response.json();
      if (!config.ready) { tell('The translator is being prepared. Please try again soon.'); return; }
      ready = true;
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.addEventListener('load', () => {
        try {
          widgetId = window.turnstile.render('#turnstile-container', {
            sitekey: config.siteKey, action: 'translate', theme: 'light', size: 'flexible',
            callback(value) { token = value; if (!busy && !output.value) tell('Ready when you are.'); update(); },
            'expired-callback'() { token = ''; update(); },
            'error-callback'() { token = ''; tell('The security check could not load. Check your connection and reload the page.', true); update(); },
          });
          tell('Complete the security check, then translate your message.');
        } catch { tell('The security check could not start. Please reload the page.', true); }
      });
      script.addEventListener('error', () => tell('The security check could not load. Check your connection and reload the page.', true));
      document.head.append(script);
    } catch { tell('The translator is temporarily unavailable. Please try again later.', true); }
    update();
  }
  update(); initialize();
})();
