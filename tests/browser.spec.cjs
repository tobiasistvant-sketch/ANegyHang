const { test, expect } = require('@playwright/test');
const content = require('../js/content.js');
const KEY = require('../js/state.js').STORAGE_KEY;
const versionLabel = 'v' + require('../package.json').version;
const active = page => page.locator('#main-content');
const next = page => page.locator('[data-action="next"]');
const finish = page => page.locator('[data-action="finish"]');
const value = page => page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), KEY);
async function phase(page, name) { await expect(active(page)).toHaveAttribute('data-step', name); await expect(page.locator('#chapters li')).toHaveCount(7); await expect(page.locator('#progress')).toHaveAttribute('aria-valuemax', '7'); }
const endingImages = { A: 'wallet-ending-return-full', B: 'wallet-ending-keep-money', C: 'wallet-ending-return-documents', D: 'wallet-ending-walk-away' };
async function scene(page, id, imagesAvailable = true) {
  const frame = active(page).locator(`[data-illustration="${id}"]`);
  await expect(active(page).locator('[data-illustration]')).toHaveCount(1);
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
async function initial(page, letter, imagesAvailable = true) {
  await page.goto('/');
  await phase(page, 'start');
  await scene(page, 'hero-four-paths', imagesAvailable);
  await expect(page.locator('[data-app-version]')).toHaveText([versionLabel, versionLabel]);
  await expect(page.locator('.hero [data-app-version]')).toBeVisible();
  await expect(page.locator('.app-footer [data-app-version]')).toBeVisible();
  await page.getByRole('button', { name: 'Kezdjük a történetet' }).click();
  await expect(page.locator('.app-footer [data-app-version]')).toHaveText(versionLabel);
  await phase(page, 'situation');
  await scene(page, 'wallet-scene-opening', imagesAvailable);
  await next(page).click();
  await phase(page, 'initial');
  await scene(page, 'wallet-scene-opening', imagesAvailable);
  await expect(next(page)).toBeDisabled();
  await expect(next(page)).toHaveText('Megnézem a négy nézőpontot');
  await expect(page.locator('.choice-copy')).toHaveText(content.stories[0].choices.map(c => c.text));
  await expect(page.locator('label[for="initial-D"]')).toContainText('Visszateszem oda, ahol találtam, és továbbmegyek.');
  await page.locator('#initial-' + letter).check();
  await next(page).click();
}
async function voices(page, imagesAvailable = true) {
  for (const [i, voice] of content.voices.entries()) {
    await phase(page, 'voices');
    await scene(page, 'wallet-scene-voices', imagesAvailable);
    await expect(page.locator('#screen-title')).toHaveText('Négy nézőpont – mit érdemes mérlegelned?');
    await expect(page.locator('.screen-heading .lead')).toHaveText('Olvasd végig a négy szempontot, majd gondold át újra a döntésedet.');
    await expect(page.locator('.voice-title')).toHaveText(voice.name);
    await expect(page.locator('.voice-speech')).toContainText(voice.speech);
    expect((await value(page)).voiceIndex).toBe(i);
    await next(page).click();
  }
  await phase(page, 'final');
  await expect(page.locator('.choice-copy')).toHaveText(content.stories[0].choices.map(c => c.text));
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
  await expect(page.locator('label[for="final-D"]')).toContainText('Visszateszem oda, ahol találtam, és továbbmegyek.');
}
async function ending(page, letter, imagesAvailable = true) {
  await expect(next(page)).toBeDisabled();
  await page.locator('#final-' + letter).check();
  await next(page).click();
  await phase(page, 'continuation');
  await scene(page, endingImages[letter], imagesAvailable);
  const branch = content.stories[0].endings[letter];
  await expect(page.locator('#screen-title')).toHaveText(branch.title);
  for (const paragraph of branch.paragraphs) await expect(page.locator('.story-text')).toContainText(paragraph);
  if (letter === 'B') await expect(page.locator('.notice-card')).toContainText('A héten kellene kiváltanom őket.');
  await next(page).click();
  await phase(page, 'biblical');
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
  await expect(page.locator('.teaching-text')).toHaveText(branch.teaching);
  await expect(page.locator('.bible-quote')).toHaveText('„' + branch.scripture.quote + '”');
  await expect(page.locator('.scripture-reference').first()).toContainText(branch.scripture.reference);
  await expect(page.locator('.scripture-short p')).toHaveText(branch.scripture.short);
  await expect(page.locator('.branch-question')).toContainText(branch.question);
  const common = page.locator('[data-common-teaching]');
  await expect(common).toBeVisible();
  await expect(common.locator('.story-text p')).toHaveText(content.commonTeaching.paragraphs);
  await expect(common.locator('.highlight-quote')).toHaveText('„' + content.commonTeaching.highlight + '”');
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
  await phase(page, 'biblical');
  expect(await value(page)).toEqual(before);
  for (const [id, other] of Object.entries(content.stories[0].endings)) {
    if (id !== letter) await expect(active(page)).not.toContainText(other.scripture.short[0]);
  }
  for (const marker of ['SZERKESZTŐI MEGJEGYZÉS', 'FEJLESZTÉSI MEGJEGYZÉS', 'MEGVALÓSÍTÁSI MEGJEGYZÉS']) await expect(active(page)).not.toContainText(marker);
}
async function noClosingQuestions(page) {
  await expect(active(page).locator('input, textarea, .decision-pair, .summary-list')).toHaveCount(0);
  await expect(active(page).locator('[data-action="next"]')).toHaveCount(0);
  for (const removed of ['Melyik hang befolyásolt leginkább?', 'Összegzés megtekintése', content.reflectionQuestion, content.takeawayQuestion]) {
    await expect(active(page)).not.toContainText(removed);
  }
}
async function complete(page) {
  await phase(page, 'biblical');
  await noClosingQuestions(page);
  await expect(finish(page)).toHaveText('Befejeztem a történetet');
  await expect(finish(page)).toBeEnabled();
  await finish(page).click();
  await phase(page, 'biblical');
  await expect(active(page)).toHaveAttribute('data-completed', 'true');
  await expect(page.locator('#screen-title')).toHaveText('A döntés a Biblia fényében');
  await expect(page.locator('#completion-feedback')).toHaveText('Az első történet végére értél.');
  await expect(page.locator('#completion-feedback')).toBeFocused();
  await expect(page.locator('#progress')).toHaveAttribute('aria-valuenow', '7');
  await expect(finish(page)).toHaveCount(0);
  await expect(active(page).getByRole('button', { name: 'Újrajátszom a történetet' })).toBeVisible();
  await noClosingQuestions(page);
}

for (const [index, letter] of ['A', 'B', 'C', 'D'].entries()) {
  test('A második döntés után közvetlenül a ' + letter + ' ág és a hetedik oldali lezárás', async ({ page }) => {
    const errors = [], outside = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) outside.push(request.url()); });
    const first = ['B', 'A', 'D', 'C'][index];
    await initial(page, first); await voices(page);
    await expect(page.locator('.previous-choice')).toContainText(content.stories[0].choices.find(c => c.id === first).text);
    await ending(page, letter);
    await expect(page.locator('#chapters li').last()).toHaveAttribute('aria-current', 'step');
    await noClosingQuestions(page);
    await page.reload(); await phase(page, 'biblical');
    await expect(active(page)).toHaveAttribute('data-completed', 'false');
    await expect(finish(page)).toBeEnabled();
    await expect(page.locator('#completion-feedback')).toHaveCount(0);
    await complete(page);
    const state = await value(page);
    expect(state).toEqual({ version: 3, storyId: 'wallet', step: 'biblical', voiceIndex: 3,
      initialChoice: first, finalChoice: letter, decisionChanged: true, completed: true });
    await page.reload(); await phase(page, 'biblical');
    await expect(page.locator('#completion-feedback')).toHaveText('Az első történet végére értél.');
    await expect(page.locator('[data-common-teaching]')).toBeVisible();
    await expect(page.locator('.bible-quote')).toHaveText('„' + content.stories[0].endings[letter].scripture.quote + '”');
    await expect(active(page).getByRole('button', { name: 'Újrajátszom a történetet' })).toBeVisible();
    await expect(active(page).locator('[data-action="finish"], [download]')).toHaveCount(0);
    await noClosingQuestions(page);
    expect(await value(page)).toEqual(state);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(errors).toEqual([]); expect(outside).toEqual([]);
  });
}

test('A változatlan döntés megőrzése, újrajátszás és megszakítás', async ({ page }) => {
  await initial(page, 'A'); await voices(page); await ending(page, 'A'); await complete(page);
  expect((await value(page)).decisionChanged).toBe(false);
  await page.evaluate(() => sessionStorage.setItem('other_project_marker', 'preserve'));
  await active(page).getByRole('button', { name: 'Újrajátszom a történetet' }).click();
  await page.getByRole('button', { name: 'Még folytatom' }).click(); await phase(page, 'biblical');
  expect((await value(page)).completed).toBe(true);
  await active(page).getByRole('button', { name: 'Újrajátszom a történetet' }).click();
  await page.getByRole('button', { name: 'Újrakezdem', exact: true }).click();
  await phase(page, 'start');
  await expect(page.locator('[data-app-version]')).toHaveText([versionLabel, versionLabel]);
  expect(await value(page)).toEqual({ version: 3, storyId: 'wallet', step: 'start', voiceIndex: 0,
    initialChoice: null, finalChoice: null, decisionChanged: null, completed: false });
  expect(await page.evaluate(() => sessionStorage.getItem('other_project_marker'))).toBe('preserve');
  await page.getByRole('button', { name: 'Kezdjük a történetet' }).click();
  await next(page).click(); await page.locator('#initial-B').check();
  await page.locator('.restart-button').click(); await page.keyboard.press('Escape');
  await phase(page, 'initial'); await expect(page.locator('#initial-B')).toBeChecked();
});

test('A kiválasztás és az egyenkénti hangok újratöltés után folytathatók', async ({ page }) => {
  await initial(page, 'C');
  for (let i = 0; i < 4; i++) {
    await page.reload();
    expect((await value(page)).voiceIndex).toBe(i);
    await expect(page.locator('.voice-title')).toHaveText(content.voices[i].name);
    await next(page).click();
  }
  await expect(page.locator('.previous-choice')).toContainText('az iratokat');
});

test('Sérült mentés és tiltott tároló mellett is megnyitható', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(key => sessionStorage.setItem(key, '{invalid'), KEY);
  await page.reload(); await phase(page, 'start');
  await expect(page.locator('#storage-note')).toContainText('Új munkamenetet');
  const isolated = await context.newPage();
  await isolated.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('blocked'); } }));
  await isolated.goto('/');
  await expect(isolated.locator('#storage-note')).toContainText('nem tudjuk menteni');
  await isolated.getByRole('button', { name: 'Kezdjük a történetet' }).click();
  await expect(isolated.locator('#main-content')).toHaveAttribute('data-step', 'situation');
  await isolated.close();
});

test('Billentyűzet, fókusz és natív megerősítő párbeszédablak', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Kezdjük a történetet' }).focus(); await page.keyboard.press('Enter');
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
  await phase(page, 'initial');
});

test('WebP-betöltési hiba esetén a helyi PNG is használható', async ({ page }) => {
  await page.route('**/assets/illustrations/*.webp', route => route.abort());
  await page.goto('/');
  await scene(page, 'hero-four-paths');
  await expect.poll(() => page.locator('[data-scene-image]').evaluate(img => img.currentSrc.endsWith('/hero-four-paths.png'))).toBe(true);
  await page.getByRole('button', { name: 'Kezdjük a történetet' }).click();
  await scene(page, 'wallet-scene-opening');
  await expect.poll(() => page.locator('[data-scene-image]').evaluate(img => img.currentSrc.endsWith('/wallet-scene-opening.png'))).toBe(true);
});

for (const [index, letter] of ['A', 'B', 'C', 'D'].entries()) {
  test('Képek nélkül is végigjátszható és lezárható a ' + letter + ' ág', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/assets/illustrations/*', route => route.abort());
    const first = ['B', 'A', 'D', 'C'][index];
    await initial(page, first, false);
    await voices(page, false);
    await ending(page, letter, false);
    await complete(page);
    expect(await value(page)).toMatchObject({ initialChoice: first, finalChoice: letter,
      decisionChanged: true, completed: true, step: 'biblical' });
    await expect(page.locator('.app-footer [data-app-version]')).toHaveText(versionLabel);
    expect(errors).toEqual([]);
  });
}

async function restore(page, state, step, completed) {
  await page.evaluate(({ key, state }) => sessionStorage.setItem(key, JSON.stringify(state)), { key: KEY, state });
  await page.reload(); await phase(page, step);
  expect(await value(page)).toEqual({ version: 3, storyId: 'wallet', step, voiceIndex: 3,
    initialChoice: state.initialChoice, finalChoice: state.finalChoice,
    decisionChanged: state.initialChoice !== state.finalChoice, completed });
}

test('A megszüntetett v0.3.0 képernyőkről is folytatható a történet', async ({ page }) => {
  await page.goto('/');
  const base = { version: 2, storyId: 'wallet', voiceIndex: 3, initialChoice: 'B', finalChoice: 'D',
    influence: null, reflection: null, takeaway: '', completed: false };
  await restore(page, { ...base, step: 'influence' }, 'continuation', false);
  await expect(page.locator('#screen-title')).toHaveText(content.stories[0].endings.D.title);
  await next(page).click(); await phase(page, 'biblical');
  await noClosingQuestions(page); await expect(finish(page)).toBeEnabled();
  const oldReflection = { ...base, step: 'reflection', influence: 'mixed', reflection: 'different',
    takeaway: '</textarea><img src=x onerror="window.testInjection=1"> Megőrzött korábbi gondolat.' };
  await restore(page, oldReflection, 'biblical', false);
  await expect(page.locator('[data-common-teaching]')).toBeVisible();
  await expect(page.locator('#completion-feedback')).toHaveCount(0);
  await expect(finish(page)).toBeEnabled(); await noClosingQuestions(page);
  await restore(page, { ...oldReflection, completed: true }, 'biblical', true);
  await expect(page.locator('#completion-feedback')).toHaveText('Az első történet végére értél.');
  await expect(finish(page)).toHaveCount(0); await noClosingQuestions(page);
  expect(await page.evaluate(() => window.testInjection)).toBeUndefined();
});

test('A v0.2.2 közös tanítása és lezárt összegzése a hetedik oldalon áll helyre', async ({ page }) => {
  await page.goto('/');
  const base = { version: 1, storyId: 'wallet', voiceIndex: 3, initialChoice: 'B', finalChoice: 'D',
    influence: 'mixed', reflection: null, takeaway: '' };
  await restore(page, { ...base, step: 'teaching' }, 'biblical', false);
  await expect(page.locator('.scripture-reference').first()).toContainText('Lukács 10,31–32');
  await expect(page.locator('[data-common-teaching]')).toBeVisible();
  await expect(finish(page)).toBeEnabled(); await noClosingQuestions(page);
  await restore(page, { ...base, step: 'summary', reflection: 'different', takeaway: 'Korábbi gondolat.' }, 'biblical', true);
  await expect(page.locator('#completion-feedback')).toHaveText('Az első történet végére értél.');
  await expect(finish(page)).toHaveCount(0);
  await expect(active(page).getByRole('button', { name: 'Újrajátszom a történetet' })).toBeVisible();
  await noClosingQuestions(page);
});
