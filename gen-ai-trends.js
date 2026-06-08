const pptxgen = require("pptxgenjs");

const BG      = "0D1B2A";
const CARD_BG = "162235";
const WHITE   = "FFFFFF";
const LIGHT   = "CADCFC";

const TRENDS = [
  {
    num: "01", color: "4F8EF7",
    title: "大規模言語モデル (LLM)",
    desc:  "GPT-4o・Claude 3・Gemini 1.5など推論・コーディング・多言語対応が飛躍的に向上。コンテキスト長も数百万トークンへ拡大。",
    tags:  ["GPT-4o", "Claude 3", "Gemini 1.5"],
  },
  {
    num: "02", color: "2ECC71",
    title: "マルチモーダルAI",
    desc:  "テキスト・画像・音声・動画を統合処理。リアルタイム音声会話や画像理解・生成が実用レベルに到達。",
    tags:  ["DALL-E 3", "Sora", "Gemini Vision"],
  },
  {
    num: "03", color: "F39C12",
    title: "AIエージェント",
    desc:  "ツール使用・Web操作・コード実行を自律的に組み合わせ、複雑タスクを人間の介入なしに遂行する自律型AIが実用化。",
    tags:  ["Claude Code", "AutoGPT", "Devin"],
  },
  {
    num: "04", color: "A855F7",
    title: "オープンソースAI",
    desc:  "Meta Llama・Mistral・Gemmaなどが商用モデルに迫る性能を達成。ローカル実行・ファインチューニングが急速に普及。",
    tags:  ["Llama 3", "Mistral", "Gemma 2"],
  },
];

const makeShadow = () => ({
  type: "outer", blur: 10, offset: 4, angle: 135, color: "000000", opacity: 0.35
});

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "AI技術トレンド 2025";

const slide = pres.addSlide();
slide.background = { color: BG };

// ── ヘッダー背景 ──────────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.12,
  fill: { color: "111E30" }, line: { color: "111E30" },
});

// ヘッダー下アクセントライン
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 1.1, w: 10, h: 0.05,
  fill: { color: "1E3A5A" }, line: { color: "1E3A5A" },
});

// ── タイトル ──────────────────────────────────────────────
slide.addText("AI 技術トレンド", {
  x: 0.55, y: 0.1, w: 5.5, h: 0.55,
  fontSize: 30, bold: true, color: WHITE, fontFace: "Calibri", margin: 0,
});
slide.addText("2025年 注目すべき主要技術の最新動向", {
  x: 0.55, y: 0.68, w: 7, h: 0.32,
  fontSize: 12, color: LIGHT, fontFace: "Calibri", margin: 0,
});

// 年バッジ
slide.addShape(pres.shapes.RECTANGLE, {
  x: 8.85, y: 0.32, w: 0.75, h: 0.44,
  fill: { color: "4F8EF7" }, line: { color: "4F8EF7" },
});
slide.addText("2025", {
  x: 8.85, y: 0.32, w: 0.75, h: 0.44,
  fontSize: 13, bold: true, color: WHITE,
  align: "center", valign: "middle", fontFace: "Calibri", margin: 0,
});

// ── カード ────────────────────────────────────────────────
const CW = 4.45;   // card width
const CH = 1.88;   // card height
const c1 = 0.4;    // col 1 x
const c2 = 5.15;   // col 2 x
const r1 = 1.25;   // row 1 y
const r2 = 3.27;   // row 2 y

const POS = [
  { x: c1, y: r1 }, { x: c2, y: r1 },
  { x: c1, y: r2 }, { x: c2, y: r2 },
];

TRENDS.forEach((t, i) => {
  const { x, y } = POS[i];

  // カード背景
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: CW, h: CH,
    fill: { color: CARD_BG },
    line: { color: "1E3A5A", width: 0.75 },
    shadow: makeShadow(),
  });

  // 左アクセントバー
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.09, h: CH,
    fill: { color: t.color }, line: { color: t.color },
  });

  // 番号バッジ
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + 0.22, y: y + 0.2, w: 0.38, h: 0.38,
    fill: { color: t.color, transparency: 15 }, line: { color: t.color },
  });
  slide.addText(t.num, {
    x: x + 0.22, y: y + 0.2, w: 0.38, h: 0.38,
    fontSize: 10, bold: true, color: WHITE,
    align: "center", valign: "middle", fontFace: "Calibri", margin: 0,
  });

  // カードタイトル
  slide.addText(t.title, {
    x: x + 0.73, y: y + 0.18, w: CW - 0.85, h: 0.44,
    fontSize: 13, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0, valign: "middle",
  });

  // 区切り線
  slide.addShape(pres.shapes.LINE, {
    x: x + 0.22, y: y + 0.72, w: CW - 0.32, h: 0,
    line: { color: "1E3A5A", width: 0.75 },
  });

  // 説明文
  slide.addText(t.desc, {
    x: x + 0.22, y: y + 0.78, w: CW - 0.32, h: 0.75,
    fontSize: 9.5, color: "A8C0D6",
    fontFace: "Calibri", margin: 0, wrap: true,
  });

  // タグ
  t.tags.forEach((tag, j) => {
    const tx = x + 0.22 + j * 1.38;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: y + 1.58, w: 1.22, h: 0.22,
      fill: { color: t.color, transparency: 78 },
      line: { color: t.color, transparency: 40, width: 0.5 },
    });
    slide.addText(tag, {
      x: tx, y: y + 1.58, w: 1.22, h: 0.22,
      fontSize: 8, color: t.color,
      align: "center", valign: "middle",
      fontFace: "Calibri", margin: 0,
    });
  });
});

// ── フッター ──────────────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.5, w: 10, h: 0.125,
  fill: { color: "111E30" }, line: { color: "111E30" },
});
slide.addText("Powered by AI Research  |  2025年版", {
  x: 0.4, y: 5.5, w: 9.2, h: 0.125,
  fontSize: 7.5, color: "4A6A8A",
  align: "center", valign: "middle", fontFace: "Calibri", margin: 0,
});

pres.writeFile({ fileName: "ai-trends-2025.pptx" });
console.log("✅ ai-trends-2025.pptx を生成しました");
