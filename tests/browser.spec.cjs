const { test, expect } = require('@playwright/test');
const content = require('../js/content.js');
const KEY = require('../js/state.js').STORAGE_KEY;
const versionLabel = 'v' + require('../package.json').version;
const active = page => page.locator('#main-content');
const next = page => page.locator('[data-action="next"]');
const value = page => page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), KEY);
async function phase(page, name) { await expect(active(page)).toHaveAttribute('data-step', name); }
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
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
  await expect(page.locator('label[for="final-D"]')).toContainText('Visszateszem oda, ahol találtam, és továbbmegyek.');
}
async function ending(page, letter, influence = 'mixed', imagesAvailable = true) {
  await expect(next(page)).toBeDisabled();
  await page.locator('#final-' + letter).check();
  await next(page).click();
  await phase(page, 'influence');
  await expect(next(page)).toBeDisabled();
  await page.locator('#influence-' + influence).check();
  await next(page).click();
  await phase(page, 'continuation');
  await scene(page, endingImages[letter], imagesAvailable);
  await expect(page.locator('#screen-title')).toHaveText(content.stories[0].endings[letter].title);
  if (letter === 'B') {
    await expect(active(page)).toContainText('ELVESZETT PÉNZTÁRCA');
    await expect(active(page)).toContainText('A pénzt édesanyám gyógyszereire tettem félre.');
    await expect(active(page)).toContainText('Eszedbe jut az új fejhallgatód. A pénzt már elköltötted.');
  }
  await next(page).click();
  await phase(page, 'biblical');
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
}
async function reflection(page) {
  await next(page).click();
  await phase(page, 'teaching');
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
  await expect(active(page)).toContainText('A lelkiismeret azonban nem tévedhetetlen.');
  await expect(active(page)).toContainText('Róma 2,15');
  await expect(page.locator('.highlight-quote')).toHaveText('„de mindent vizsgáljatok meg: a jót tartsátok meg”');
  await expect(page.locator('.teaching-panel .scripture-reference')).toHaveText('1Thesszalonika 5,21 – RÚF 2014, részlet');
  await next(page).click();
  await phase(page, 'reflection');
  await expect(active(page).locator('[data-illustration]')).toHaveCount(0);
  await expect(next(page)).toBeDisabled();
}

for (const [index, letter] of ['A', 'B', 'C', 'D'].entries()) {
  test('A második döntés szerinti ' + letter + ' befejezés, biztonságos mentés és összesítés', async ({ page }) => {
    const errors = [], outside = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) outside.push(request.url()); });
    const first = ['B', 'A', 'D', 'C'][index];
    const influence = ['conscience', 'mixed', 'fear', 'others'][index];
    await initial(page, first); await voices(page);
    await expect(page.locator('.previous-choice')).toContainText(content.stories[0].choices.find(c => c.id === first).text);
    await ending(page, letter, influence);
    await expect(active(page)).toContainText(content.stories[0].endings[letter].teaching);
    await expect(active(page)).toContainText(content.stories[0].endings[letter].question);
    if (letter === 'B') {
      await expect(active(page)).toContainText('Lukács 19,1–10');
      await expect(page.locator('.scripture-reference').first()).toHaveText('2Mózes 20,15 – RÚF 2014');
      await expect(page.locator('.scripture-note h2').first()).toHaveText('„Ne lopj!”');
    }
    for (const note of await page.locator('.scripture-note').all()) {
      await expect(note).toContainText('Magyarázat:');
    }
    if (letter === 'D') await expect(active(page)).toContainText('nem azonosítjuk a pénz eltulajdonításával');
    await reflection(page);
    const answer = '</textarea><img src=x onerror="window.testInjection=1"> Árvíztűrő tükörfúrógép.\nEzt viszem magammal.';
    await page.locator('#takeaway').fill(answer);
    await page.locator('#reflection-uncertain').check();
    await page.reload();
    await phase(page, 'reflection');
    await expect(page.locator('#takeaway')).toHaveValue(answer);
    await expect(page.locator('#reflection-uncertain')).toBeChecked();
    await next(page).click(); await phase(page, 'summary');
    await expect(page.locator('#takeaway-summary')).toHaveText(answer);
    await expect(page.locator('main img')).toHaveCount(0);
    expect(await page.evaluate(() => window.testInjection)).toBeUndefined();
    const state = await value(page);
    expect(state.initialChoice).toBe(first); expect(state.finalChoice).toBe(letter); expect(state.influence).toBe(influence);
    await page.reload(); await phase(page, 'summary');
    await expect(page.locator('#takeaway-summary')).toHaveText(answer);
    await expect(page.locator('.reflection-answer')).toContainText('Nem tudom biztosan. Elgondolkodtatott.');
    await expect(page.locator('.summary-note')).toHaveText('Az első történet végére értél.');
    await expect(active(page).getByRole('button')).toHaveCount(1);
    await expect(active(page).getByRole('button', { name: 'Újrajátszom a történetet' })).toBeVisible();
    await expect(active(page).locator('[data-action="edit-reflection"], [download]')).toHaveCount(0);
    await expect(page.locator('.decision-box').first()).toContainText(content.stories[0].choices.find(c => c.id === first).text);
    await expect(page.locator('.decision-box').last()).toContainText(content.stories[0].choices.find(c => c.id === letter).text);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    expect(errors).toEqual([]); expect(outside).toEqual([]);
  });
}

test('A változatlan döntés megőrzése, újrakezdés és megszakítás', async ({ page }) => {
  await initial(page, 'A'); await voices(page); await ending(page, 'A', 'desire'); await reflection(page);
  await page.locator('#reflection-same').check(); await next(page).click();
  await expect(page.locator('.summary-list')).toContainText('Nem.');
  await page.evaluate(() => sessionStorage.setItem('other_project_marker', 'preserve'));
  await page.locator('.restart-button').click();
  await page.getByRole('button', { name: 'Még folytatom' }).click(); await phase(page, 'summary');
  await page.locator('.restart-button').click();
  await page.getByRole('button', { name: 'Újrakezdem', exact: true }).click();
  await phase(page, 'start');
  await expect(page.locator('[data-app-version]')).toHaveText([versionLabel, versionLabel]);
  const state = await value(page);
  expect(state.initialChoice).toBeNull(); expect(state.finalChoice).toBeNull(); expect(state.reflection).toBeNull(); expect(state.takeaway).toBe('');
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
  test('Képek nélkül is végigjátszható a ' + letter + ' befejezés és a reflexió', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/assets/illustrations/*', route => route.abort());
    const first = ['B', 'A', 'D', 'C'][index];
    await initial(page, first, false);
    await voices(page, false);
    await ending(page, letter, 'mixed', false);
    await reflection(page);
    await page.locator('#reflection-uncertain').check();
    await page.locator('#takeaway').fill('Képek nélkül is megmarad a saját gondolatom.');
    await next(page).click();
    await phase(page, 'summary');
    await expect(page.locator('#takeaway-summary')).toHaveText('Képek nélkül is megmarad a saját gondolatom.');
    const state = await value(page);
    expect(state.initialChoice).toBe(first);
    expect(state.finalChoice).toBe(letter);
    expect(state.reflection).toBe('uncertain');
    await expect(page.locator('.app-footer [data-app-version]')).toHaveText(versionLabel);
    expect(errors).toEqual([]);
  });
}
