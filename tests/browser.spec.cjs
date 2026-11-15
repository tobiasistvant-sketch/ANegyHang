const { test, expect } = require('@playwright/test');
const content = require('../js/content.js');
const KEY = require('../js/state.js').STORAGE_KEY;
const versionLabel = 'v' + require('../package.json').version;
const active = page => page.locator('#main-content');
const next = page => page.locator('[data-action="next"]');
const finish = page => page.locator('[data-action="finish"]');
const start = page => page.locator('[data-action="start"]');
const value = page => page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), KEY);
const progress = async page => { const state = await value(page); return state.stories[state.storyId]; };
const otherStory = story => content.stories.find(item => item.id !== story.id);
const picker = (page, id) => page.locator(`[data-action="select-story"][data-story="${id}"]`);
async function phase(page, name, story) {
  await expect(active(page)).toHaveAttribute('data-step', name);
  if (story) await expect(active(page)).toHaveAttribute('data-story-id', story.id);
  await expect(page.locator('#chapters li')).toHaveCount(7);
  await expect(page.locator('#progress')).toHaveAttribute('aria-valuemax', '7');
}
async function scene(page, id, imagesAvailable = true, scope = active(page)) {
  const frame = scope.locator(`[data-illustration="${id}"]`).first();
  const image = frame.locator('img');
  await expect(image).toHaveAttribute('src', `assets/illustrations/${id}.png`);
  await expect(image).toHaveAttribute('alt', /\S+/);
  await image.evaluate(img => { img.loading = 'eager'; });
  if (imagesAvailable) {
    await expect(frame).toBeVisible();
    await expect.poll(() => image.evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual([1280, 720]);
  } else {
    await expect(frame).toBeHidden();
  }
}
async function select(page, story, imagesAvailable = true) {
  await phase(page, 'start');
  await expect(page.locator('[data-action="select-story"]')).toHaveCount(2);
  for (const item of content.stories) {
    await expect(picker(page, item.id)).toContainText(item.title);
    await scene(page, item.images.hero, imagesAvailable, picker(page, item.id).locator('..'));
  }
  await picker(page, story.id).click();
  await phase(page, 'start', story);
  await expect(picker(page, story.id)).toHaveAttribute('aria-pressed', 'true');
  await expect(picker(page, otherStory(story).id)).toHaveAttribute('aria-pressed', 'false');
  await scene(page, story.images.hero, imagesAvailable, page.locator('.hero-art'));
  for (const paragraph of story.start.intro) await expect(page.locator('.hero')).toContainText(paragraph);
}
async function initial(page, story, letter, imagesAvailable = true, navigate = true) {
  if (navigate) await page.goto('/');
  await select(page, story, imagesAvailable);
  await expect(page.locator('[data-app-version]')).toHaveText([versionLabel, versionLabel]);
  await expect(page.locator('.hero [data-app-version]')).toBeVisible();
  await expect(page.locator('.app-footer [data-app-version]')).toBeVisible();
  await expect(start(page)).toHaveText(story.start.button);
  await start(page).click();
  await phase(page, 'situation', story);
  await scene(page, story.images.opening, imagesAvailable);
  for (const paragraph of story.intro) await expect(page.locator('.story-text')).toContainText(paragraph);
  await expect(page.locator('.story-text')).not.toContainText(otherStory(story).intro[0]);
  await next(page).click();
  await phase(page, 'initial', story);
  await scene(page, story.images.opening, imagesAvailable);
  await expect(next(page)).toBeDisabled();
  await expect(next(page)).toHaveText(story.initialButton || 'Megnézem a négy nézőpontot');
  await expect(page.locator('.choice-copy')).toHaveText(story.choices.map(c => c.text));
  await page.locator('#initial-' + letter).check();
  await next(page).click();
}
async function voices(page, story, imagesAvailable = true) {
  for (const [i, speech] of story.voices.entries()) {
    const voice = content.voices.find(item => item.id === speech.id);
    await phase(page, 'voices', story);
    await scene(page, story.images.voices, imagesAvailable);
    await expect(page.locator('#screen-title')).toHaveText('Négy nézőpont – mit érdemes mérlegelned?');
    await expect(page.locator('.screen-heading .lead')).toHaveText('Olvasd végig a négy szempontot, majd gondold át újra a döntésedet.');
    await expect(page.locator('.voice-title')).toHaveText(voice.name);
    await expect(page.locator('.voice-description')).toHaveText(speech.description);
    await expect(page.locator('.voice-speech')).toContainText(speech.speech);
    await expect(page.locator('.voice-speech')).not.toContainText(otherStory(story).voices[i].speech);
    expect((await progress(page)).voiceIndex).toBe(i);
    await next(page).click();
  }
  await phase(page, 'final', story);
  await expect(page.locator('.choice-copy')).toHaveText(story.choices.map(c => c.text));
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
  if (story.finalIntro) for (const paragraph of story.finalIntro) await expect(active(page)).toContainText(paragraph);
  await expect(next(page)).toHaveText(story.finalButton || 'Ez az átgondolt döntésem');
}
async function ending(page, story, letter, imagesAvailable = true) {
  await expect(next(page)).toBeDisabled();
  await page.locator('#final-' + letter).check();
  await next(page).click();
  await phase(page, 'continuation', story);
  await scene(page, story.images.endings[letter], imagesAvailable);
  const branch = story.endings[letter];
  await expect(page.locator('#screen-title')).toHaveText(branch.title);
  for (const paragraph of branch.paragraphs) await expect(page.locator('.story-text')).toContainText(paragraph);
  if (branch.lastThought) {
    await expect(active(page)).toContainText(branch.lastThought);
    await expect(active(page).locator('input, textarea')).toHaveCount(0);
  }
  if (story.id === 'wallet' && letter === 'B') await expect(page.locator('.notice-card')).toContainText('A héten kellene kiváltanom őket.');
  await next(page).click();
  await phase(page, 'biblical', story);
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
  if (branch.teaching) await expect(page.locator('.teaching-text')).toHaveText(branch.teaching);
  else await expect(page.locator('.teaching-text')).toHaveCount(0);
  await expect(page.locator('.bible-quote')).toHaveText('„' + branch.scripture.quote + '”');
  await expect(page.locator('.scripture-reference').first()).toContainText(branch.scripture.reference);
  await expect(page.locator('.scripture-short p')).toHaveText(branch.scripture.short);
  await expect(page.locator('.branch-question')).toContainText(branch.question);
  const common = page.locator('[data-common-teaching]');
  await expect(common).toBeVisible();
  await expect(common).toContainText(story.commonTeaching.title);
  await expect(common.locator('.story-text p')).toHaveText(story.commonTeaching.paragraphs);
  await expect(common.locator('.highlight-quote')).toHaveText('„' + story.commonTeaching.highlight + '”');
  await expect(common).toContainText(story.commonTeaching.highlightReference);
  await expect(common).not.toContainText(otherStory(story).commonTeaching.title);
  const toggle = page.locator('[data-action="toggle-explanation"]');
  await expect(toggle).toHaveAccessibleName('Bővebben');
  const panel = page.locator('#' + await toggle.getAttribute('aria-controls'));
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  const before = await value(page);
  await toggle.focus(); await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveText('Kevesebb');
  await expect(toggle).toBeFocused();
  await expect(panel).toBeVisible();
  await expect(panel.locator('p')).toHaveText(branch.scripture.more);
  await expect(common).toBeVisible();
  await expect(page.locator('.branch-question')).toBeVisible();
  await toggle.click();
  await expect(panel).toBeHidden();
  await expect(toggle).toHaveText('Bővebben');
  await phase(page, 'biblical', story);
  expect(await value(page)).toEqual(before);
  for (const source of content.stories) for (const [id, other] of Object.entries(source.endings)) {
    if (source.id !== story.id || id !== letter) await expect(active(page)).not.toContainText(other.scripture.short[0]);
  }
  for (const marker of ['Szerkesztői megjegyzés', 'SZERKESZTŐI MEGJEGYZÉS', 'FEJLESZTÉSI MEGJEGYZÉS', 'MEGVALÓSÍTÁSI MEGJEGYZÉS', 'TARTALMILAG KIDOLGOZOTT SZERKESZTŐI VÁLTOZAT']) await expect(active(page)).not.toContainText(marker);
}
async function noClosingQuestions(page) {
  await expect(active(page).locator('input, textarea, .decision-pair, .summary-list')).toHaveCount(0);
  await expect(active(page).locator('[data-action="next"]')).toHaveCount(0);
  for (const removed of ['Melyik hang befolyásolt leginkább?', 'Összegzés megtekintése', content.reflectionQuestion, content.takeawayQuestion]) await expect(active(page)).not.toContainText(removed);
}
async function complete(page, story) {
  await phase(page, 'biblical', story);
  await noClosingQuestions(page);
  await expect(finish(page)).toHaveText('Befejeztem a történetet');
  await expect(finish(page)).toBeEnabled();
  await finish(page).click();
  await phase(page, 'biblical', story);
  await expect(active(page)).toHaveAttribute('data-completed', 'true');
  await expect(page.locator('#screen-title')).toHaveText('A döntés a Biblia fényében');
  await expect(page.locator('#completion-feedback')).toHaveText(story.completionMessage);
  await expect(page.locator('#completion-feedback')).toBeFocused();
  await expect(page.locator('#progress')).toHaveAttribute('aria-valuenow', '7');
  await expect(finish(page)).toHaveCount(0);
  await expect(active(page).getByRole('button', { name: 'Újrajátszom a történetet' })).toBeVisible();
  await expect(active(page).getByRole('button', { name: 'Másik történetet választok' })).toBeVisible();
  await noClosingQuestions(page);
}

for (const story of content.stories) for (const [index, letter] of ['A', 'B', 'C', 'D'].entries()) {
  test(story.id + ' / ' + letter + ': saját hangok, teljes befejezés, bibliai ág és helyben lezárás', async ({ page }) => {
    const errors = [], outside = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) outside.push(request.url()); });
    const first = ['B', 'A', 'D', 'C'][index];
    await initial(page, story, first); await voices(page, story);
    await expect(page.locator('.previous-choice')).toContainText(story.choices.find(c => c.id === first).text);
    await ending(page, story, letter);
    await expect(page.locator('#chapters li').last()).toHaveAttribute('aria-current', 'step');
    await noClosingQuestions(page);
    await page.reload(); await phase(page, 'biblical', story);
    await expect(active(page)).toHaveAttribute('data-completed', 'false');
    await expect(finish(page)).toBeEnabled();
    await expect(page.locator('#completion-feedback')).toHaveCount(0);
    await complete(page, story);
    const state = await value(page);
    expect(state.version).toBe(4); expect(state.storyId).toBe(story.id); expect(state.selectingStory).toBe(false);
    expect(state.stories[story.id]).toEqual({ storyId: story.id, step: 'biblical', voiceIndex: 3,
      initialChoice: first, finalChoice: letter, decisionChanged: true, completed: true });
    await page.reload(); await phase(page, 'biblical', story);
    await expect(page.locator('#completion-feedback')).toHaveText(story.completionMessage);
    await expect(page.locator('[data-common-teaching]')).toBeVisible();
    await expect(page.locator('.bible-quote')).toHaveText('„' + story.endings[letter].scripture.quote + '”');
    await expect(active(page).getByRole('button', { name: 'Újrajátszom a történetet' })).toBeVisible();
    await expect(active(page).locator('[data-action="finish"], [download]')).toHaveCount(0);
    await noClosingQuestions(page);
    expect(await value(page)).toEqual(state);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(errors).toEqual([]); expect(outside).toEqual([]);
  });
}

const wallet = content.stories.find(story => story.id === 'wallet');
const teacher = content.stories.find(story => story.id === 'teacher');
test('Mindkét történet megmarad; az újrajátszás csak a kiválasztott történetet törli', async ({ page }) => {
  await initial(page, wallet, 'A'); await voices(page, wallet); await ending(page, wallet, 'A'); await complete(page, wallet);
  const walletSave = await progress(page);
  expect(walletSave.decisionChanged).toBe(false);
  await page.evaluate(() => sessionStorage.setItem('other_project_marker', 'preserve'));
  await page.locator('[data-action="choose-story"]').click();
  await initial(page, teacher, 'D', true, false); await voices(page, teacher); await ending(page, teacher, 'C'); await complete(page, teacher);
  const teacherSave = await progress(page);
  expect((await value(page)).stories.wallet).toEqual(walletSave);
  await page.reload(); expect((await value(page)).stories.wallet).toEqual(walletSave);
  await page.locator('[data-action="choose-story"]').click(); await select(page, wallet);
  await expect(start(page)).toHaveText('Megnézem a lezárt történetet');
  await start(page).click(); await phase(page, 'biblical', wallet);
  await expect(page.locator('#completion-feedback')).toHaveText(wallet.completionMessage);
  expect((await value(page)).stories.teacher).toEqual(teacherSave);
  await active(page).getByRole('button', { name: 'Újrajátszom a történetet' }).click();
  await page.getByRole('button', { name: 'Még folytatom' }).click(); await phase(page, 'biblical', wallet);
  expect((await progress(page)).completed).toBe(true);
  await active(page).getByRole('button', { name: 'Újrajátszom a történetet' }).click();
  await page.getByRole('button', { name: 'Újrakezdem', exact: true }).click();
  await phase(page, 'start', wallet);
  expect((await value(page)).stories.wallet).toEqual({ storyId: 'wallet', step: 'start', voiceIndex: 0,
    initialChoice: null, finalChoice: null, decisionChanged: null, completed: false });
  expect((await value(page)).stories.teacher).toEqual(teacherSave);
  expect(await page.evaluate(() => sessionStorage.getItem('other_project_marker'))).toBe('preserve');
});

test('Folyamatban levő történet váltás és újratöltés után ugyanott folytatódik', async ({ page }) => {
  await initial(page, teacher, 'C');
  await next(page).click();
  const saved = await progress(page);
  await page.locator('[data-action="choose-story"]').click(); await select(page, wallet); await start(page).click();
  await phase(page, 'situation', wallet);
  await page.locator('[data-action="choose-story"]').click(); await select(page, teacher);
  await expect(start(page)).toHaveText('Folytatom a történetet');
  await page.reload(); await phase(page, 'start', teacher);
  await start(page).click(); await phase(page, 'voices', teacher);
  expect(await progress(page)).toEqual(saved);
  await expect(page.locator('.voice-speech')).toContainText(teacher.voices[1].speech);
});

for (const story of content.stories) {
  test(story.id + ': az egyenkénti hangok és a kiválasztás újratöltés után folytathatók', async ({ page }) => {
    await initial(page, story, 'C');
    for (let i = 0; i < 4; i++) {
      await page.reload(); await phase(page, 'voices', story);
      expect((await progress(page)).voiceIndex).toBe(i);
      await expect(page.locator('.voice-title')).toHaveText(content.voices.find(v => v.id === story.voices[i].id).name);
      await expect(page.locator('.voice-speech')).toContainText(story.voices[i].speech);
      await next(page).click();
    }
    await expect(page.locator('.previous-choice')).toContainText(story.choices.find(c => c.id === 'C').text);
  });
}

test('Sérült mentés és tiltott tároló mellett is megnyitható', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(key => sessionStorage.setItem(key, '{invalid'), KEY);
  await page.reload(); await phase(page, 'start');
  await expect(page.locator('#storage-note')).toContainText('Új munkamenetet');
  const isolated = await context.newPage();
  await isolated.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } }));
  await isolated.goto('/');
  await expect(isolated.locator('#storage-note')).toContainText('nem tudjuk menteni');
  await picker(isolated, teacher.id).click(); await start(isolated).click();
  await phase(isolated, 'situation', teacher);
  await isolated.close();
});

test('Billentyűzetes történetválasztás, fókusz és megerősítő párbeszédablak', async ({ page }) => {
  await page.goto('/');
  await picker(page, teacher.id).focus(); await page.keyboard.press('Enter');
  await expect(picker(page, teacher.id)).toHaveAttribute('aria-pressed', 'true');
  await start(page).focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#screen-title')).toBeFocused();
  await next(page).focus(); await page.keyboard.press('Enter');
  await page.locator('#initial-A').focus(); await page.keyboard.press('Space');
  await expect(next(page)).toBeEnabled();
  await page.locator('.restart-button').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#reset-dialog')).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement.closest('#reset-dialog'))).toBeTruthy();
  }
  await page.keyboard.press('Escape'); await expect(page.locator('#reset-dialog')).not.toBeVisible();
  await phase(page, 'initial', teacher); await expect(page.locator('#initial-A')).toBeChecked();
});

function fixture(story, step, options = {}) {
  const index = ['start', 'situation', 'initial', 'voices', 'final', 'continuation', 'biblical'].indexOf(step);
  return { storyId: story.id, step, voiceIndex: index > 3 ? 3 : 0,
    initialChoice: index > 2 ? 'B' : null, finalChoice: index > 4 ? 'D' : null,
    decisionChanged: index > 4 ? true : null, completed: false, ...options };
}
async function restoreCurrent(page, story, state, selectingStory = false) {
  const wrapper = { version: 4, storyId: story.id, selectingStory, stories: { [story.id]: state } };
  await page.evaluate(({ key, state }) => sessionStorage.setItem(key, JSON.stringify(state)), { key: KEY, state: wrapper });
  await page.reload(); await phase(page, selectingStory ? 'start' : state.step, story);
  expect(await value(page)).toEqual(wrapper);
}

test('Mind a tizenhárom illusztráció WebP-hibája a megfelelő PNG-re vált', async ({ page }) => {
  await page.route('**/assets/illustrations/*.webp', route => route.abort());
  await page.goto('/');
  const seen = new Set();
  for (const story of content.stories) {
    const screens = [ ['start', story.images.hero], ['situation', story.images.opening], ['voices', story.images.voices],
      ...['A', 'B', 'C', 'D'].map(letter => ['continuation', story.images.endings[letter], letter]) ];
    for (const [step, id, letter] of screens) {
      if (seen.has(id)) continue;
      const state = fixture(story, step, letter ? { finalChoice: letter, decisionChanged: letter !== 'B' } : {});
      await restoreCurrent(page, story, state, step === 'start');
      await scene(page, id);
      const image = active(page).locator(`[data-illustration="${id}"] img`).first();
      await expect.poll(() => image.evaluate((img, sceneId) => img.currentSrc.endsWith('/' + sceneId + '.png'), id)).toBe(true);
      seen.add(id);
    }
  }
  expect(seen.size).toBe(13);
});

for (const story of content.stories) for (const [index, letter] of ['A', 'B', 'C', 'D'].entries()) {
  test(story.id + ' / ' + letter + ': képek nélkül is végigjátszható és lezárható', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/assets/illustrations/*', route => route.abort());
    const first = ['B', 'A', 'D', 'C'][index];
    await initial(page, story, first, false); await voices(page, story, false); await ending(page, story, letter, false); await complete(page, story);
    expect(await progress(page)).toMatchObject({ initialChoice: first, finalChoice: letter, decisionChanged: true, completed: true, step: 'biblical' });
    await expect(page.locator('.app-footer [data-app-version]')).toHaveText(versionLabel);
    expect(errors).toEqual([]);
  });
}

async function restoreLegacy(page, state, step, completed) {
  await page.evaluate(({ key, state }) => sessionStorage.setItem(key, JSON.stringify(state)), { key: KEY, state });
  await page.reload(); await phase(page, step, wallet);
  expect(await value(page)).toEqual({ version: 4, storyId: 'wallet', selectingStory: step === 'start', stories: { wallet: {
    storyId: 'wallet', step, voiceIndex: state.voiceIndex, initialChoice: state.initialChoice, finalChoice: state.finalChoice,
    decisionChanged: state.finalChoice === null ? null : state.initialChoice !== state.finalChoice, completed } } });
}

test('A v0.3.1 kezdeti, folyamatban levő és lezárt pénztárcás mentései megmaradnak', async ({ page }) => {
  await page.goto('/');
  const base = { version: 3, storyId: 'wallet', voiceIndex: 3, initialChoice: 'A', finalChoice: 'D', decisionChanged: true, completed: false };
  await restoreLegacy(page, { ...base, step: 'start', voiceIndex: 0, initialChoice: null, finalChoice: null, decisionChanged: null }, 'start', false);
  await restoreLegacy(page, { ...base, step: 'voices', voiceIndex: 2, finalChoice: null, decisionChanged: null }, 'voices', false);
  await expect(page.locator('.voice-speech')).toContainText(wallet.voices[2].speech);
  await restoreLegacy(page, { ...base, step: 'biblical' }, 'biblical', false);
  await expect(finish(page)).toBeEnabled();
  await restoreLegacy(page, { ...base, step: 'biblical', completed: true }, 'biblical', true);
  await expect(page.locator('#completion-feedback')).toHaveText(wallet.completionMessage);
  await page.locator('[data-action="choose-story"]').click(); await select(page, teacher); await start(page).click();
  expect((await value(page)).stories.wallet.completed).toBe(true);
  await phase(page, 'situation', teacher);
});

test('A régebbi megszüntetett képernyők biztonságosan az új szerkezetbe kerülnek', async ({ page }) => {
  await page.goto('/');
  const base = { version: 2, storyId: 'wallet', voiceIndex: 3, initialChoice: 'B', finalChoice: 'D',
    influence: null, reflection: null, takeaway: '', completed: false };
  await restoreLegacy(page, { ...base, step: 'influence' }, 'continuation', false);
  await expect(page.locator('#screen-title')).toHaveText(wallet.endings.D.title);
  const oldReflection = { ...base, step: 'reflection', influence: 'mixed', reflection: 'different',
    takeaway: '</textarea><img src=x onerror="window.testInjection=1"> Régi gondolat.' };
  await restoreLegacy(page, oldReflection, 'biblical', false);
  await expect(page.locator('[data-common-teaching]')).toBeVisible(); await noClosingQuestions(page);
  await restoreLegacy(page, { ...oldReflection, completed: true }, 'biblical', true);
  await expect(page.locator('#completion-feedback')).toHaveText(wallet.completionMessage);
  const v1 = { ...oldReflection, version: 1, step: 'summary' }; delete v1.completed;
  await restoreLegacy(page, v1, 'biblical', true);
  await expect(finish(page)).toHaveCount(0); await noClosingQuestions(page);
  expect(await page.evaluate(() => window.testInjection)).toBeUndefined();
});
