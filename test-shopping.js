const { chromium } = require('playwright');
const path = require('path');

const FILE_URL = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  function pass(name, detail = '') { results.push({ ok: true,  name, detail }); }
  function fail(name, detail = '') { results.push({ ok: false, name, detail }); }

  await page.goto(FILE_URL);

  // ─── 1. 初期状態 ────────────────────────────────────────────
  const emptyMsg = await page.locator('.empty-msg').textContent();
  if (emptyMsg.includes('アイテムがありません')) pass('初期状態：空メッセージ表示');
  else fail('初期状態：空メッセージ表示', `got: "${emptyMsg}"`);

  // ─── 2. アイテム追加（ボタン） ───────────────────────────────
  await page.fill('#new-item', 'りんご');
  await page.click('#add-btn');
  let items = await page.locator('.item').count();
  if (items === 1) pass('アイテム追加（ボタン）');
  else fail('アイテム追加（ボタン）', `item count: ${items}`);

  // ─── 3. アイテム追加（Enterキー） ────────────────────────────
  await page.fill('#new-item', 'バナナ');
  await page.press('#new-item', 'Enter');
  items = await page.locator('.item').count();
  if (items === 2) pass('アイテム追加（Enter）');
  else fail('アイテム追加（Enter）', `item count: ${items}`);

  // ─── 4. 件数表示 ─────────────────────────────────────────────
  const count = await page.locator('#item-count').textContent();
  if (count.trim() === '2 件') pass('件数表示', count.trim());
  else fail('件数表示', `got: "${count.trim()}"`);

  // ─── 5. 空入力を無視 ─────────────────────────────────────────
  await page.fill('#new-item', '   ');
  await page.click('#add-btn');
  items = await page.locator('.item').count();
  if (items === 2) pass('空入力を無視');
  else fail('空入力を無視', `item count: ${items}`);

  // ─── 6. チェック機能 ─────────────────────────────────────────
  await page.locator('.item').first().locator('.check-btn').click();
  const isChecked = await page.locator('.item').first().evaluate(el => el.classList.contains('checked'));
  if (isChecked) pass('チェック ON');
  else fail('チェック ON');

  const strikethrough = await page.locator('.item.checked .item-text').evaluate(el =>
    getComputedStyle(el).textDecorationLine
  );
  if (strikethrough.includes('line-through')) pass('チェック済み：取り消し線表示');
  else fail('チェック済み：取り消し線表示', `decoration: ${strikethrough}`);

  // ─── 7. チェック解除 ─────────────────────────────────────────
  await page.locator('.item').first().locator('.check-btn').click();
  const isUnchecked = await page.locator('.item').first().evaluate(el => !el.classList.contains('checked'));
  if (isUnchecked) pass('チェック OFF（再クリックで解除）');
  else fail('チェック OFF（再クリックで解除）');

  // ─── 8. フィルター：完了 ─────────────────────────────────────
  await page.locator('.item').first().locator('.check-btn').click(); // りんごをチェック
  await page.locator('.filter-btn[data-filter="checked"]').click();
  items = await page.locator('.item').count();
  if (items === 1) pass('フィルター：完了のみ表示');
  else fail('フィルター：完了のみ表示', `item count: ${items}`);

  // ─── 9. フィルター：未完了 ───────────────────────────────────
  await page.locator('.filter-btn[data-filter="unchecked"]').click();
  items = await page.locator('.item').count();
  if (items === 1) pass('フィルター：未完了のみ表示');
  else fail('フィルター：未完了のみ表示', `item count: ${items}`);

  // ─── 10. フィルター：すべて ───────────────────────────────────
  await page.locator('.filter-btn[data-filter="all"]').click();
  items = await page.locator('.item').count();
  if (items === 2) pass('フィルター：すべて表示');
  else fail('フィルター：すべて表示', `item count: ${items}`);

  // ─── 11. 個別削除 ─────────────────────────────────────────────
  await page.locator('.item').last().locator('.delete-btn').click();
  items = await page.locator('.item').count();
  if (items === 1) pass('個別削除');
  else fail('個別削除', `item count: ${items}`);

  // ─── 12. 完了済みをまとめて削除 ───────────────────────────────
  // step11 でりんご(未チェック)を削除済み → バナナ(チェック済み)が残っている
  const clearBtn = page.locator('#clear-checked');
  const isEnabledNow = await clearBtn.isEnabled();
  if (isEnabledNow) pass('完了済み削除ボタン：チェックあり時は有効');
  else fail('完了済み削除ボタン：チェックあり時は有効');

  await clearBtn.click();
  items = await page.locator('.item').count();
  const empty2 = await page.locator('.empty-msg').count();
  if (items === 0 && empty2 === 1) pass('完了済みをまとめて削除');
  else fail('完了済みをまとめて削除', `item count: ${items}`);

  // 全削除後はボタンが無効になること
  const isDisabledAfter = await clearBtn.isDisabled();
  if (isDisabledAfter) pass('完了済み削除ボタン：チェックなし時は無効');
  else fail('完了済み削除ボタン：チェックなし時は無効');

  // ─── 13. localStorage 永続化 ──────────────────────────────────
  await page.fill('#new-item', 'みかん');
  await page.press('#new-item', 'Enter');
  await page.reload();
  items = await page.locator('.item').count();
  if (items === 1) pass('localStorage 永続化（リロード後も保持）');
  else fail('localStorage 永続化（リロード後も保持）', `item count: ${items}`);

  // ─── スクリーンショット ────────────────────────────────────────
  await page.screenshot({ path: 'test-result.png', fullPage: true });

  await browser.close();

  // ─── 結果出力 ──────────────────────────────────────────────────
  console.log('\n===== テスト結果 =====');
  let passed = 0, failed = 0;
  for (const r of results) {
    const mark = r.ok ? '✅' : '❌';
    const detail = r.detail ? `  (${r.detail})` : '';
    console.log(`${mark} ${r.name}${detail}`);
    r.ok ? passed++ : failed++;
  }
  console.log(`\n合計: ${passed + failed} 件 ／ ✅ ${passed} 件合格 ／ ❌ ${failed} 件失敗`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => { console.error(err); process.exit(1); });
