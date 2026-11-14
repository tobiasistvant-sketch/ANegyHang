const { test, expect } = require('@playwright/test');
const content = require('../js/content.js');
const KEY = require('../js/state.js').STORAGE_KEY;
const active = page => page.locator('#main-content');
const next = page => page.locator('[data-action="next"]');
const value = page => page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), KEY);
async function phase(page, name) { await expect(active(page)).toHaveAttribute('data-step', name); }
async function initial(page, letter) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Kezdjük a történetet' }).click();
  await phase(page, 'situation');
  await next(page).click();
  await phase(page, 'initial');
  await expect(next(page)).toBeDisabled();
  await page.locator('#initial-' + letter).check();
  await next(page).click();
}
async function voices(page) {
  for (const [i, voice] of content.voices.entries()) {
    await phase(page, 'voices');
    await expect(page.locator('.voice-title')).toHaveText(voice.name);
    await expect(page.locator('.voice-speech')).toContainText(voice.speech);
    expect((await value(page)).voiceIndex).toBe(i);
    await next(page).click();
  }
  await phase(page, 'final');
}
async function ending(page, letter, influence = 'mixed') {
  await expect(next(page)).toBeDisabled();
  await page.locator('#final-' + letter).check();
  await next(page).click();
  await phase(page, 'influence');
  await expect(next(page)).toBeDisabled();
  await page.locator('#influence-' + influence).check();
  await next(page).click();
  await phase(page, 'continuation');
  await expect(page.locator('#screen-title')).toHaveText(content.stories[0].endings[letter].title);
  await next(page).click();
  await phase(page, 'biblical');
}
async function reflection(page) {
  await next(page).click();
  await phase(page, 'teaching');
  await expect(active(page)).toContainText('A lelkiismeret azonban nem tévedhetetlen.');
  await expect(active(page)).toContainText('Róma 2,15');
  await next(page).click();
  await phase(page, 'reflection');
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
    if (letter === 'B') await expect(active(page)).toContainText('Lukács 19,1–10');
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
    await page.getByRole('button', { name: 'Reflexió átnézése' }).click();
    await expect(page.locator('#takeaway')).toHaveValue(answer);
    await expect(page.locator('#reflection-uncertain')).toBeChecked();
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
