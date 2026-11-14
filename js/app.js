/* UI for the single-story prototype. Student text only enters value/textContent. */
(() => {
  'use strict';
  const content = window.NegyHangContent;
  const engine = window.NegyHangState;
  const illustrations = window.NegyHangIllustrations || {};
  const version = window.NegyHangVersion;
  const versionLabel = version && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version.version) ? `v${version.version}` : '';
  const main = document.getElementById('main-content');
  if (!content || !engine) {
    main.textContent = 'A történet egyik fájlja nem töltődött be. Kérjük, frissítsd az oldalt.';
    return;
  }
  let storage = null;
  try { storage = window.sessionStorage; } catch (_) { /* A memory-only session still works. */ }
  const loaded = engine.load(storage, content);
  let state = loaded.state;
  let storageAvailable = loaded.storageAvailable;
  let recovered = loaded.recovered;
  const dialog = document.getElementById('reset-dialog');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const story = () => content.stories.find(item => item.id === state.storyId);
  const choice = value => story().choices.find(item => item.id === value);
  const influence = () => content.influences.find(item => item.id === state.influence);
  const tints = { desire: '#F8EEE7', others: '#F4EDF4', fear: '#EEF3F7', conscience: '#EAF5F4', mixed: '#F0F2F3' };
  const paths = {
    flame: '<path d="M13 3c1 5 6 7 6 12a7 7 0 0 1-14 0c0-3 2-5 4-7 0 3 1 4 2 4 2-2 2-5 2-9Z"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Z"/><path d="M12 8v5M12 17h.01"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    exchange: '<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
    notes: '<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>',
    mixed: '<circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/><path d="m8 8 8 8M8 16l8-8"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.notes}</svg>`;
  const heading = (eyebrow, title, lead = '') => `<header class="screen-heading"><p class="eyebrow">${escape(eyebrow)}</p><h1 id="screen-title" tabindex="-1">${escape(title)}</h1>${lead ? `<p class="lead">${escape(lead)}</p>` : ''}</header>`;
  const button = (label, action = 'next', disabled = false, secondary = false) => `<button type="button" class="btn ${secondary ? 'btn-secondary' : 'btn-primary'}" data-action="${action}" ${disabled ? 'disabled' : ''}>${escape(label)}${secondary ? '' : icon('arrow')}</button>`;
  const paragraphs = items => items.map(item => `<p>${escape(item)}</p>`).join('');
  const scripture = item => `<section class="scripture-note"><p class="scripture-reference">${escape(item.reference)}${item.translation ? ` – ${escape(item.translation)}` : ''}</p><h2>${escape(item.label)}</h2><p><strong>Magyarázat:</strong> ${escape(item.explanation)}</p></section>`;
  const voiceStyle = voice => `--voice-color:${voice.color};--voice-tint:${tints[voice.id]}`;
  const endingScenes = { A: 'wallet-ending-return-full', B: 'wallet-ending-keep-money', C: 'wallet-ending-return-documents', D: 'wallet-ending-walk-away' };
  function scene(id, className = '', eager = false) {
    const image = illustrations[id];
    if (!image) return '';
    return `<figure class="scene-figure ${className}" data-illustration="${id}"><picture><source srcset="${escape(image.webp)}" type="image/webp"><img src="${escape(image.png)}" alt="${escape(image.alt)}" width="${image.width}" height="${image.height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${eager ? 'fetchpriority="high"' : ''} data-scene-image></picture></figure>`;
  }


  function canAdvance() {
    return state.step === 'initial' ? !!state.initialChoice : state.step === 'final' ? !!state.finalChoice : state.step === 'influence' ? !!state.influence : state.step === 'reflection' ? !!state.reflection : true;
  }
  function choices(name, items, selected) {
    return `<div class="choice-list">${items.map(item => `<label class="choice-card" for="${name}-${item.id}"><input id="${name}-${item.id}" type="radio" name="${name}" value="${item.id}" ${selected === item.id ? 'checked' : ''}><span class="choice-letter" aria-hidden="true">${escape(item.letter || item.id)}</span><span class="choice-copy">${escape(item.text)}</span></label>`).join('')}</div>`;
  }
  function decisionPair() {
    return `<div class="decision-pair"><section class="decision-box"><h2>Első megérzésed</h2><p><strong>${state.initialChoice}</strong> · ${escape(choice(state.initialChoice).text)}</p></section><section class="decision-box"><h2>Átgondolt döntésed</h2><p><strong>${state.finalChoice}</strong> · ${escape(choice(state.finalChoice).text)}</p></section></div><dl class="summary-list"><div><dt>Változtattál?</dt><dd>${state.initialChoice === state.finalChoice ? 'Nem.' : 'Igen.'}</dd></div><div><dt>Ami leginkább hatott rád</dt><dd>${escape(influence().text)}</dd></div></dl>`;
  }
  function renderStart() {
    return `<section class="hero"><div class="hero-copy"><p class="eyebrow">Interaktív döntéstörténet · XI. osztály</p><h1 class="hero-title" id="screen-title" tabindex="-1">A NÉGY HANG</h1><h2 class="hero-subtitle">${escape(content.subtitle)}</h2><p class="lead">Először az első megérzésedre hallgatsz. Aztán négy nézőpontot ismersz meg. A végső döntést te hozod meg.</p><p class="story-label">A megtalált pénztárca</p><div class="actions">${button('Kezdjük a történetet', 'start')}</div><p class="session-note">A haladásod ezen a böngészőlapon újratöltés után is megmarad. A lap bezárásakor a munkamenet véget ér.</p><p class="app-version" data-app-version hidden></p></div><div class="hero-art">${scene('hero-four-paths', 'hero-scene', true)}<div class="voice-roster">${content.voices.map(voice => `<div class="voice-mini" style="${voiceStyle(voice)}"><span class="voice-mini-icon">${icon(voice.icon)}</span><span>${escape(voice.name)}</span></div>`).join('')}</div></div></section><div class="feature-grid"><section class="feature-card">${icon('exchange')}<h2>Két döntés</h2><p>Az első megérzésed és az átgondolt választásod külön is megmarad.</p></section><section class="feature-card">${icon('mixed')}<h2>Négy nézőpont</h2><p>Figyeld meg, mi befolyásol, amikor választanod kell!</p></section><section class="feature-card">${icon('notes')}<h2>Saját felismerés</h2><p>Nincs pontozás. A történet a személyes mérlegelésedet segíti.</p></section></div>`;
  }
  function renderSituation() {
    return `${heading('A történet kezdete', story().title)}<div class="content-grid"><article class="story-card"><div class="story-text">${paragraphs(story().intro)}</div><p class="story-question">${escape(story().question)}</p><div class="actions">${button('Meghozom az első döntésem')}</div></article><aside class="context-card">${scene('wallet-scene-opening', 'context-scene')}<p class="eyebrow">Hazafelé · A buszmegálló</p><ul class="context-facts"><li><strong>500 lej</strong> a pénztárcában</li><li>Személyi igazolvány és két bankkártya</li><li>Néhány perc a busz érkezéséig</li></ul></aside></div>`;
  }
  function renderDecision(final) {
    const name = final ? 'final' : 'initial';
    const panel = `<section class="panel"><fieldset class="choice-fieldset"><legend>${escape(story().question)}</legend>${choices(name, story().choices, final ? state.finalChoice : state.initialChoice)}</fieldset><p class="selection-hint">A továbblépéshez válassz egy lehetőséget.</p><div class="actions">${button(final ? 'Ez az átgondolt döntésem' : 'Megnézem a négy nézőpontot', 'next', !canAdvance())}</div></section>`;
    return `${heading(final ? 'A hangok után' : 'Az első megérzésed', final ? 'Az átgondolt döntésed' : 'Most mit választanál?', final ? 'Megtarthatod vagy megváltoztathatod az első választásodat.' : 'Válaszd ki, mit tennél ebben a helyzetben!')}${final ? `<aside class="previous-choice"><span>Az első döntésed</span><p><strong>${state.initialChoice}</strong> · ${escape(choice(state.initialChoice).text)}</p></aside>${panel}` : `<div class="decision-layout">${scene('wallet-scene-opening', 'decision-scene')}${panel}</div>`}`;
  }
  function renderVoice() {
    const voice = content.voices[state.voiceIndex];
    return `${heading('Négy nézőpont', 'Négy nézőpont – mit érdemes mérlegelned?', 'Olvasd végig a négy szempontot, majd gondold át újra a döntésedet.')}<ol class="voice-steps" aria-label="A négy hang sorrendje">${content.voices.map((item, i) => `<li class="${i === state.voiceIndex ? 'active' : i < state.voiceIndex ? 'done' : ''}" ${i === state.voiceIndex ? 'aria-current="step"' : ''} style="${voiceStyle(item)}"><span class="voice-mini-icon">${icon(item.icon)}</span>${escape(item.label)}</li>`).join('')}</ol><div class="voice-context">${scene('wallet-scene-voices', 'voice-backdrop')}<section class="voice-stage" style="${voiceStyle(voice)}"><div class="voice-avatar">${icon(voice.icon)}</div><article class="voice-card"><p class="voice-kicker">${state.voiceIndex + 1} / 4 hang</p><h2 class="voice-title">${escape(voice.name)}</h2><p class="voice-description">${escape(voice.description)}</p><blockquote class="voice-speech">„${escape(voice.speech)}”</blockquote></article></section></div>${state.voiceIndex === content.voices.length - 1 ? `<p class="voice-closing">${escape(content.voicesClosing)}</p>` : ''}<div class="actions">${button(state.voiceIndex === content.voices.length - 1 ? 'Átgondolom a döntésemet' : 'Következő hang')}</div>`;
  }
  function renderInfluence() {
    return `${heading('A döntésed mögött', content.influenceQuestion, 'Válaszd azt, ami legjobban leírja a saját mérlegelésedet!')}<section class="panel"><fieldset class="choice-fieldset"><legend class="sr-only">${escape(content.influenceQuestion)}</legend><div class="influence-list">${content.influences.map(item => {
      const voice = content.voices.find(v => v.id === item.id) || { id: 'mixed', color: '#5A6E7B', icon: 'mixed' };
      return `<label class="influence-card" for="influence-${item.id}" style="${voiceStyle(voice)}"><input id="influence-${item.id}" type="radio" name="influence" value="${item.id}" ${state.influence === item.id ? 'checked' : ''}><span class="voice-mini-icon">${icon(voice.icon)}</span><span>${escape(item.text)}</span></label>`;
    }).join('')}</div></fieldset><div class="actions">${button('Nézzük, hogyan folytatódik!', 'next', !canAdvance())}</div></section>`;
  }
  function renderContinuation() {
    const ending = engine.getEnding(state, content);
    const prose = state.storyId === 'wallet' && state.finalChoice === 'B'
      ? `${paragraphs(ending.paragraphs.slice(0, 2))}<aside class="notice-card" aria-label="A buszmegállóban olvasott hirdetés">${paragraphs(ending.paragraphs.slice(2, 4))}</aside>${paragraphs(ending.paragraphs.slice(4))}`
      : paragraphs(ending.paragraphs);
    return `${heading('A történet folytatása', ending.title)}<article class="story-card"><p class="outcome-tag">A második döntésed: ${state.finalChoice}</p>${scene(endingScenes[state.finalChoice], 'ending-scene')}<div class="story-text">${prose}</div><div class="actions">${button('A bibliai nézőpont')}</div></article>`;
  }
  function renderBiblical() {
    const ending = engine.getEnding(state, content);
    return `${heading('Bibliai reflexió', 'A döntés a Biblia fényében')}<section class="reflection-panel"><h2 class="panel-title">Mit mutat meg ez a választás?</h2><p class="teaching-text">${escape(ending.teaching)}</p></section>${scripture(ending.scripture)}${ending.additionalScriptures.map(scripture).join('')}<section class="panel branch-question"><p class="eyebrow">Gondold tovább!</p><p>${escape(ending.question)}</p></section><div class="actions">${button('Mit tanít a lelkiismeret?')}</div>`;
  }
  function renderTeaching() {
    const teaching = content.commonTeaching;
    return `${heading('Közös útravaló', teaching.title)}<article class="teaching-panel"><div class="story-text">${paragraphs(teaching.paragraphs)}</div><blockquote class="highlight-quote">„${escape(teaching.highlight)}”</blockquote><p class="scripture-reference">${escape(teaching.highlightReference)}</p></article>${scripture(teaching.scripture)}<section class="reflection-panel"><p class="teaching-text">${escape(teaching.closing)}</p></section><div class="actions">${button('A saját gondolataim')}</div>`;
  }
  function renderReflection() {
    return `${heading('A saját felismerésed', 'Nézz vissza a döntésedre!')}<section class="summary-card">${decisionPair()}</section><section class="panel"><fieldset class="choice-fieldset"><legend>${escape(content.reflectionQuestion)}</legend>${choices('reflection', content.finalReflections.map((item, i) => ({ ...item, letter: i + 1 })), state.reflection)}</fieldset><label class="takeaway-label" for="takeaway">${escape(content.takeawayQuestion)} <span>(nem kötelező)</span></label><textarea id="takeaway" rows="4" placeholder="Ide írhatod a saját gondolatodat…"></textarea><div class="actions">${button('Összegzés megtekintése', 'next', !canAdvance())}</div></section>`;
  }
  function renderSummary() {
    const reflection = content.finalReflections.find(item => item.id === state.reflection);
    return `${heading('Személyes összegzés', 'A te döntéstörténeted', story().title)}<article class="summary-card">${decisionPair()}<section class="reflection-answer"><h2>Ahogyan most látod</h2><p>${escape(reflection.text)}</p></section><section class="takeaway"><h2>A gondolat, amelyet magaddal viszel</h2><p id="takeaway-summary"></p></section><p class="summary-note">Az első történet végére értél.</p></article><div class="actions">${button('Újrajátszom a történetet', 'restart', false, true)}</div>`;
  }

  function updateProgress() {
    const chapters = ['A helyzet', 'A hangok', 'A döntésed', 'Útravaló', 'Reflexió'];
    const chapterMap = { start: 0, situation: 0, initial: 0, voices: 1, final: 2, influence: 2, continuation: 2, biblical: 3, teaching: 3, reflection: 4, summary: 4 };
    const current = chapterMap[state.step];
    document.getElementById('chapters').innerHTML = chapters.map((label, i) => `<li class="${i === current ? 'current' : i < current ? 'done' : ''}" ${i === current ? 'aria-current="step"' : ''}><span class="chapter-number">${i + 1}</span><span class="chapter-label">${label}</span></li>`).join('');
    const value = engine.STEPS.indexOf(state.step) + (state.step === 'voices' ? state.voiceIndex / 4 : 0);
    const progress = document.getElementById('progress');
    progress.setAttribute('aria-valuenow', String(value));
    progress.setAttribute('aria-valuetext', `${chapters[current]}${state.step === 'voices' ? ', ' + (state.voiceIndex + 1) + '. hang a négyből' : ''}`);
    document.getElementById('progress-fill').style.width = `${value * 10}%`;
  }
  function updateNotice() {
    const note = document.getElementById('storage-note');
    note.hidden = storageAvailable && !recovered;
    note.textContent = !storageAvailable ? 'Ebben a böngészőben most nem tudjuk menteni a haladásodat. Újratöltéskor a munkamenet elveszhet.' : recovered ? 'A korábbi mentés nem volt olvasható. Új munkamenetet indítottunk.' : '';
  }
  function persist() {
    storageAvailable = engine.save(storage, state);
    updateNotice();
  }
  function dispatch(action, repaint = true) {
    state = engine.transition(state, action, content);
    if (state.step !== 'start') recovered = false;
    persist();
    if (repaint) render();
    else {
      const advance = main.querySelector('[data-action="next"]');
      if (advance) advance.disabled = !canAdvance();
    }
  }
  function render(moveFocus = true) {
    const screens = { start: renderStart, situation: renderSituation, initial: () => renderDecision(false), voices: renderVoice, final: () => renderDecision(true), influence: renderInfluence, continuation: renderContinuation, biblical: renderBiblical, teaching: renderTeaching, reflection: renderReflection, summary: renderSummary };
    main.innerHTML = screens[state.step]();
    main.dataset.step = state.step;
    document.querySelectorAll('[data-app-version]').forEach(label => {
      label.textContent = versionLabel;
      label.hidden = !versionLabel;
      label.setAttribute('aria-label', `Alkalmazás verziója: ${versionLabel}`);
    });
    const takeaway = document.getElementById('takeaway');
    if (takeaway) takeaway.value = state.takeaway;
    const summary = document.getElementById('takeaway-summary');
    if (summary) summary.textContent = state.takeaway.trim() || 'Most nem írtál külön gondolatot.';
    document.querySelector('.restart-button').hidden = state.step === 'start';
    updateProgress();
    updateNotice();
    if (moveFocus) {
      const title = document.getElementById('screen-title');
      title.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  // A failed WebP retries its local PNG; a missing scene never blocks the story.
  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.matches('[data-scene-image]')) return;
    const picture = image.closest('picture');
    const sources = picture ? picture.querySelectorAll('source') : [];
    if (sources.length) {
      sources.forEach(source => source.remove());
      return;
    }
    const frame = image.closest('[data-illustration]');
    if (frame) frame.hidden = true;
  }, true);
  document.addEventListener('click', event => {
    const control = event.target.closest('[data-action]');
    if (!control) return;
    const action = control.dataset.action;
    if (action === 'restart') {
      if (!dialog.open) { dialog.returnValue = 'cancel'; dialog.showModal(); }
    }
    else if (action === 'start') dispatch({ type: 'START' });
    else if (action === 'next') dispatch({ type: 'NEXT' });
  });
  document.addEventListener('change', event => {
    const type = { initial: 'SELECT_INITIAL', final: 'SELECT_FINAL', influence: 'SELECT_INFLUENCE', reflection: 'SELECT_REFLECTION' }[event.target.name];
    if (type) dispatch({ type, value: event.target.value }, false);
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'takeaway') dispatch({ type: 'SET_TAKEAWAY', value: event.target.value }, false);
  });
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'restart') dispatch({ type: 'RESTART' });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const buttons = dialog.querySelectorAll('button:not([disabled])');
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  render(false);
})();
