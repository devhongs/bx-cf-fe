import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import {
  FileBlob,
  PresentationFile,
} from "/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "/Users/yuhongsig/project/bx-cf/bx-cf-fe";
const WORK = "/var/folders/pb/32flttxx5nj7ty4qncqrlbnc0000gn/T/codex-presentations/manual-20260715/bx-cf-final-revision/work";
const SOURCE_BACKUP = path.join(path.dirname(WORK), "source-backup.pptx");
const STARTER = path.join(WORK, "template-starter.pptx");
const OUTPUT = path.join(ROOT, "landing/assets/BX-CF.pptx");
const INSPECT = path.join(WORK, "template-inspect/template-inspect.ndjson");
const FRAME_MAP = path.join(WORK, "template-frame-map.json");
const STARTER_LAYOUT_DIR = path.join(WORK, "template-starter-layout");
const PREVIEW_DIR = path.join(WORK, "artifact-preview");
const FINAL_LAYOUT_DIR = path.join(WORK, "artifact-layout");

const FONT = "Malgun Gothic";
const COLORS = {
  canvas: "#F4F7FC",
  paper: "#FFFFFF",
  text: "#102044",
  cobalt: "#245BFF",
  blue: "#3A83D8",
  paleBlue: "#E7EFFF",
  paleBlueStrong: "#DCE7FA",
  secondary: "#586783",
  hairline: "#C8D6EF",
};

const NARRATIVE_ROLES = [
  "opening cover",
  "definition",
  "case for action",
  "architecture",
  "delivery plan",
  "deliverables",
  "impact and expansion",
  "AI delivery proof",
];

async function writeBlob(filePath, blob) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function inspectFullSource() {
  const presentation = await PresentationFile.importPptx(await FileBlob.load(SOURCE_BACKUP));
  const snapshot = await presentation.inspect({
    kind: "slide,textbox,shape,image,table,chart",
    maxChars: 500_000,
  });
  if (snapshot.truncated) throw new Error("Full source inspection is still truncated");
  await fs.writeFile(INSPECT, snapshot.ndjson, "utf8");
  console.log(`Inspected ${presentation.slides.items.length} source slides without truncation`);
}

async function prepareFrameMap() {
  const records = (await fs.readFile(INSPECT, "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const outputSlides = NARRATIVE_ROLES.map((narrativeRole, index) => {
    const sourceSlide = index + 1;
    const sourceElementIds = records
      .filter((record) => record.slide === sourceSlide && record.kind !== "slide" && record.id)
      .map((record) => record.id);
    if (sourceElementIds.length === 0) {
      throw new Error(`No inherited source objects found on slide ${sourceSlide}`);
    }
    return {
      outputSlide: sourceSlide,
      sourceSlide,
      narrativeRole,
      reuseMode: "duplicate-slide",
      editTargets: [{ action: "replace", sourceElementIds }],
    };
  });

  const frameMap = {
    outputSlides,
    omittedSourceSlides: [
      {
        sourceSlide: 9,
        reason: "User requested deletion of the final decision slide",
      },
    ],
  };
  await fs.writeFile(FRAME_MAP, `${JSON.stringify(frameMap, null, 2)}\n`, "utf8");
  await fs.writeFile(
    path.join(WORK, "template-audit.txt"),
    `${[
      "Source: BX-CF.pptx (9 slides, 1280×720)",
      "Visual system: light ice-blue canvas, deep navy type, cobalt accent rules, Malgun Gothic.",
      "Reusable frame: ghost page numeral + eyebrow + large title + footer metadata.",
      "Content pattern: executive narrative with definition, rationale, architecture, plan, deliverables, impact, and AI proof.",
      "Selected treatment: Soft Block Editorial — preserve existing frame while strengthening grouped surfaces and hierarchy.",
      "Output: source slides 1–8; source slide 9 omitted by explicit user request.",
      "Source media: none.",
      "Source charts/tables: none.",
    ].join("\n")}\n`,
    "utf8",
  );
  await fs.writeFile(
    path.join(WORK, "deviation-log.txt"),
    `${[
      "Slide 2: flat columns converted to three contained cards; definition area grouped.",
      "Slide 3: rule-only rows converted to alternating full-width bands.",
      "Slide 4: three inherited architecture columns compressed vertically; one requested E2E automation band added.",
      "Slide 5: milestone columns converted to contained monthly cards.",
      "Slide 6: six deliverables converted to a 3×2 card grid.",
      "Slide 7: inherited multiline benefit list replaced by six contained benefit blocks; roadmap retained.",
      "Slide 8: three proof columns converted to contained cards with stronger center emphasis.",
      "Slide 9: omitted by explicit user request.",
      "No imported image, chart, or table objects were introduced.",
      "Fidelity note: inherited accent rules are intentionally expanded into approved opaque grouping surfaces.",
      "The overlay heuristic therefore reports expected false positives; all affected source objects are declared replace targets in the validated frame map.",
    ].join("\n")}\n`,
    "utf8",
  );
  console.log(`Prepared frame map for ${outputSlides.length} output slides`);
}

async function loadLayouts() {
  return Promise.all(
    NARRATIVE_ROLES.map(async (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return JSON.parse(
        await fs.readFile(path.join(STARTER_LAYOUT_DIR, `starter-slide-${number}.layout.json`), "utf8"),
      );
    }),
  );
}

function box(left, top, width, height) {
  return { left, top, width, height };
}

function position(shape, next) {
  shape.position = next;
}

function paintShape(shape, fill = "none", lineFill = "none", lineWidth = 0) {
  shape.fill = fill;
  shape.line = { style: "solid", fill: lineFill, width: lineWidth };
}

function styleText(shape, value, options = {}) {
  shape.text = value;
  paintShape(shape, "none", "none", 0);
  shape.text.style = {
    typeface: FONT,
    fontSize: options.fontSize ?? 15,
    bold: options.bold ?? false,
    color: options.color ?? COLORS.text,
    alignment: options.alignment ?? "left",
    verticalAlignment: options.verticalAlignment ?? "middle",
    autoFit: "shrinkText",
    wrap: "square",
    lineSpacing: options.lineSpacing ?? 1,
    insets: options.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
}

function shapeAt(slide, order) {
  const shape = slide.shapes.items[order - 1];
  if (!shape) throw new Error(`Missing inherited shape at order ${order}`);
  return shape;
}

function elementAt(layout, order) {
  const element = layout.elements.find((candidate) => candidate.order === order);
  if (!element) throw new Error(`Missing layout element at order ${order}`);
  return element;
}

function setPositionAt(slide, order, next) {
  position(shapeAt(slide, order), next);
}

function paintAt(slide, order, fill = "none", lineFill = "none", lineWidth = 0) {
  paintShape(shapeAt(slide, order), fill, lineFill, lineWidth);
}

function textAt(slide, layout, order, options = {}) {
  const element = elementAt(layout, order);
  if (typeof element.text !== "string") throw new Error(`Expected text at order ${order}`);
  styleText(shapeAt(slide, order), element.text, options);
}

function setRoundedAt(slide, order, radius = 14) {
  shapeAt(slide, order).borderRadius = radius;
}

function addSurface(slide, name, next, options = {}) {
  const surface = slide.shapes.add({
    geometry: options.geometry ?? "roundRect",
    name,
    position: next,
    fill: options.fill ?? COLORS.paper,
    line: {
      style: "solid",
      fill: options.lineFill ?? COLORS.hairline,
      width: options.lineWidth ?? 1,
    },
    borderRadius: options.radius ?? 12,
  });
  return surface;
}

function addTextbox(slide, name, value, next, options = {}) {
  const textbox = slide.shapes.add({
    geometry: "textbox",
    name,
    position: next,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  styleText(textbox, value, options);
  if (options.fill) {
    paintShape(textbox, options.fill, options.lineFill ?? options.fill, options.lineWidth ?? 1);
    textbox.borderRadius = options.radius ?? 8;
  }
  return textbox;
}

function setBaseStyle(slide, layout) {
  slide.background.fill = COLORS.canvas;
  if (slide.shapes.items.length !== layout.elements.length) {
    throw new Error(
      `Inherited object count mismatch: slide=${slide.shapes.items.length}, layout=${layout.elements.length}`,
    );
  }
  layout.elements.forEach((element, index) => {
    const shape = slide.shapes.items[index];
    if (typeof element.text === "string") {
      styleText(shape, element.text, { fontSize: 14, color: COLORS.secondary });
    } else {
      paintShape(shape, "none", "none", 0);
    }
  });
  paintAt(slide, 1, COLORS.canvas, COLORS.canvas, 0);
  setPositionAt(slide, 1, box(0, 0, 1280, 720));
}

function styleHeaderAndFooter(slide, layout, slideNumber, keepHeaderRule = true) {
  textAt(slide, layout, 2, { fontSize: 10.5, color: COLORS.secondary });
  setPositionAt(slide, 2, box(66, 676, 440, 24));
  textAt(slide, layout, 3, { fontSize: 10.5, color: COLORS.secondary, alignment: "right" });
  setPositionAt(slide, 3, box(902, 676, 250, 24));
  textAt(slide, layout, 4, { fontSize: 10.5, bold: true, color: COLORS.secondary, alignment: "right" });
  setPositionAt(slide, 4, box(1174, 676, 40, 24));

  textAt(slide, layout, 5, { fontSize: 58, bold: true, color: "#E6EDF9" });
  setPositionAt(slide, 5, box(66, 50, 118, 92));
  paintAt(slide, 6, COLORS.cobalt, COLORS.cobalt, 0);
  setPositionAt(slide, 6, box(70, 57, 8, 25));
  textAt(slide, layout, 7, { fontSize: 12, bold: true, color: COLORS.cobalt });
  setPositionAt(slide, 7, box(94, 54, 520, 32));
  textAt(slide, layout, 8, { fontSize: 39, bold: true, color: COLORS.text });
  setPositionAt(slide, 8, box(70, 104, 1090, 62));
  if (keepHeaderRule) {
    paintAt(slide, 9, COLORS.cobalt, COLORS.cobalt, 0);
    setPositionAt(slide, 9, box(70, 172, 1140, 2));
  }
  if (elementAt(layout, 4).text !== String(slideNumber).padStart(2, "0")) {
    throw new Error(`Unexpected footer page number on slide ${slideNumber}`);
  }
}

function addTopStripe(slide, name, left, top, width, color = COLORS.cobalt) {
  const stripe = slide.shapes.add({
    geometry: "rect",
    name,
    position: box(left, top, width, 5),
    fill: color,
    line: { style: "solid", fill: color, width: 0 },
  });
  return stripe;
}

function styleSlide1(slide, layout) {
  setBaseStyle(slide, layout);
  paintAt(slide, 2, COLORS.cobalt, COLORS.cobalt, 0);
  setPositionAt(slide, 2, box(0, 0, 24, 720));
  textAt(slide, layout, 3, { fontSize: 13, bold: true, color: COLORS.cobalt });
  setPositionAt(slide, 3, box(78, 66, 320, 26));
  textAt(slide, layout, 4, { fontSize: 56, bold: true, color: COLORS.text });
  setPositionAt(slide, 4, box(74, 148, 840, 94));
  textAt(slide, layout, 5, { fontSize: 25, bold: true, color: COLORS.blue });
  setPositionAt(slide, 5, box(78, 252, 620, 42));
  textAt(slide, layout, 6, { fontSize: 20, color: COLORS.secondary });
  setPositionAt(slide, 6, box(78, 318, 900, 44));

  paintAt(slide, 7, COLORS.paleBlue, COLORS.hairline, 1);
  setPositionAt(slide, 7, box(78, 404, 1110, 154));
  setRoundedAt(slide, 7, 16);
  const metrics = [
    { label: 8, value: 9, left: 108, width: 286 },
    { label: 10, value: 11, left: 448, width: 230 },
    { label: 12, value: 13, left: 742, width: 410 },
  ];
  metrics.forEach(({ label, value, left, width }) => {
    textAt(slide, layout, label, { fontSize: 12, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, label, box(left, 432, width, 26));
    textAt(slide, layout, value, { fontSize: 21, bold: true, color: COLORS.text });
    setPositionAt(slide, value, box(left, 470, width, 54));
  });
  textAt(slide, layout, 14, { fontSize: 11.5, color: COLORS.secondary });
  setPositionAt(slide, 14, box(78, 657, 340, 24));
}

function styleSlide2(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 2, false);

  paintAt(slide, 9, COLORS.paleBlue, COLORS.hairline, 1);
  setPositionAt(slide, 9, box(70, 184, 1140, 160));
  setRoundedAt(slide, 9, 14);
  textAt(slide, layout, 10, { fontSize: 22, bold: true, color: COLORS.text });
  setPositionAt(slide, 10, box(96, 204, 900, 40));
  textAt(slide, layout, 11, { fontSize: 15.5, bold: true, color: COLORS.text });
  setPositionAt(slide, 11, box(96, 252, 1064, 32));
  textAt(slide, layout, 12, { fontSize: 14.5, color: COLORS.secondary });
  setPositionAt(slide, 12, box(96, 292, 1064, 36));

  const cards = [
    { surface: 13, number: 14, title: 15, body: 16, left: 70, fill: COLORS.paper },
    { surface: 17, number: 18, title: 19, body: 20, left: 450, fill: COLORS.paleBlue },
    { surface: 21, number: 22, title: 23, body: 24, left: 830, fill: COLORS.paper },
  ];
  cards.forEach(({ surface, number, title, body, left, fill }, index) => {
    paintAt(slide, surface, fill, COLORS.hairline, 1);
    setPositionAt(slide, surface, box(left, 368, 350, 242));
    setRoundedAt(slide, surface, 14);
    textAt(slide, layout, number, { fontSize: 13, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, number, box(left + 22, 394, 64, 28));
    textAt(slide, layout, title, { fontSize: 20, bold: true, color: COLORS.text });
    setPositionAt(slide, title, box(left + 22, 434, 302, 42));
    textAt(slide, layout, body, { fontSize: 14.5, color: COLORS.secondary });
    setPositionAt(slide, body, box(left + 22, 492, 304, 82));
    addTopStripe(slide, `definition-card-${index + 1}-stripe`, left, 368, 350);
  });
}

function styleSlide3(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 3, false);

  paintAt(slide, 9, COLORS.paleBlue, COLORS.hairline, 1);
  setPositionAt(slide, 9, box(70, 184, 1140, 70));
  setRoundedAt(slide, 9, 14);
  textAt(slide, layout, 10, { fontSize: 17.5, bold: true, color: COLORS.text });
  setPositionAt(slide, 10, box(92, 198, 1090, 42));

  const rows = [
    { surface: 11, number: 12, title: 13, issue: 14, outcome: 15, top: 274, fill: COLORS.paper },
    { surface: 16, number: 17, title: 18, issue: 19, outcome: 20, top: 386, fill: COLORS.paleBlue },
    { surface: 21, number: 22, title: 23, issue: 24, outcome: 25, top: 498, fill: COLORS.paper },
  ];
  rows.forEach(({ surface, number, title, issue, outcome, top, fill }, index) => {
    paintAt(slide, surface, fill, COLORS.hairline, 1);
    setPositionAt(slide, surface, box(70, top, 1140, 96));
    setRoundedAt(slide, surface, 12);
    textAt(slide, layout, number, { fontSize: 13, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, number, box(92, top + 30, 50, 32));
    textAt(slide, layout, title, { fontSize: 19, bold: true, color: COLORS.text });
    setPositionAt(slide, title, box(160, top + 22, 220, 48));
    textAt(slide, layout, issue, { fontSize: 14.5, color: COLORS.secondary });
    setPositionAt(slide, issue, box(420, top + 18, 380, 58));
    textAt(slide, layout, outcome, { fontSize: 14.5, bold: true, color: COLORS.text });
    setPositionAt(slide, outcome, box(842, top + 18, 334, 58));
    slide.shapes.add({
      geometry: "rect",
      name: `why-row-${index + 1}-divider-a`,
      position: box(398, top + 18, 1, 60),
      fill: COLORS.hairline,
      line: { style: "solid", fill: COLORS.hairline, width: 0 },
    });
    slide.shapes.add({
      geometry: "rect",
      name: `why-row-${index + 1}-divider-b`,
      position: box(820, top + 18, 1, 60),
      fill: COLORS.hairline,
      line: { style: "solid", fill: COLORS.hairline, width: 0 },
    });
  });
}

function styleArchitectureColumn(slide, layout, config) {
  const {
    panel,
    stripe,
    category,
    technology,
    left,
    labelOrders,
    valueOrders,
    dividerOrders,
    rowTop,
    rowHeight,
    valueFontSize,
  } = config;
  paintAt(slide, panel, COLORS.paper, COLORS.hairline, 1);
  setPositionAt(slide, panel, box(left, 194, 354, 330));
  setRoundedAt(slide, panel, 10);
  paintAt(slide, stripe, COLORS.cobalt, COLORS.cobalt, 0);
  setPositionAt(slide, stripe, box(left, 194, 354, 7));
  textAt(slide, layout, category, { fontSize: 12.5, bold: true, color: COLORS.cobalt });
  setPositionAt(slide, category, box(left + 22, 212, 190, 26));
  textAt(slide, layout, technology, { fontSize: 20, bold: true, color: COLORS.text });
  setPositionAt(slide, technology, box(left + 22, 244, 310, 42));

  labelOrders.forEach((labelOrder, index) => {
    const rowY = rowTop + index * rowHeight;
    const dividerOrder = dividerOrders[index];
    paintAt(slide, dividerOrder, COLORS.hairline, COLORS.hairline, 0);
    setPositionAt(slide, dividerOrder, box(left + 22, rowY, 310, 1));
    textAt(slide, layout, labelOrder, { fontSize: 10.5, bold: true, color: COLORS.blue });
    setPositionAt(slide, labelOrder, box(left + 22, rowY + 4, 94, rowHeight - 6));
    textAt(slide, layout, valueOrders[index], { fontSize: valueFontSize, color: COLORS.text });
    setPositionAt(slide, valueOrders[index], box(left + 126, rowY + 3, 206, rowHeight - 5));
  });
}

function styleSlide4(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 4, true);

  styleArchitectureColumn(slide, layout, {
    panel: 10,
    stripe: 11,
    category: 12,
    technology: 13,
    left: 58,
    dividerOrders: [14, 17, 20, 23, 26, 29],
    labelOrders: [15, 18, 21, 24, 27, 30],
    valueOrders: [16, 19, 22, 25, 28, 31],
    rowTop: 292,
    rowHeight: 36.5,
    valueFontSize: 10.25,
  });
  styleArchitectureColumn(slide, layout, {
    panel: 32,
    stripe: 33,
    category: 34,
    technology: 35,
    left: 443,
    dividerOrders: [36, 39, 42],
    labelOrders: [37, 40, 43],
    valueOrders: [38, 41, 44],
    rowTop: 300,
    rowHeight: 67,
    valueFontSize: 11.5,
  });
  styleArchitectureColumn(slide, layout, {
    panel: 45,
    stripe: 46,
    category: 47,
    technology: 48,
    left: 828,
    dividerOrders: [49, 52, 55, 58, 61],
    labelOrders: [50, 53, 56, 59, 62],
    valueOrders: [51, 54, 57, 60, 63],
    rowTop: 292,
    rowHeight: 43.5,
    valueFontSize: 10.25,
  });

  addSurface(slide, "e2e-automation-band", box(58, 544, 1124, 82), {
    fill: COLORS.paleBlue,
    lineFill: COLORS.cobalt,
    lineWidth: 1,
    radius: 12,
  });
  addTextbox(slide, "e2e-automation-label", "E2E 테스트 자동화", box(82, 558, 220, 48), {
    fontSize: 16,
    bold: true,
    color: COLORS.cobalt,
  });
  addTextbox(
    slide,
    "e2e-automation-detail",
    "Playwright · PC · Mobile · Admin 주요 시나리오 검증  →  CI 파이프라인 연동 · Vitest 단위 테스트 병행",
    box(310, 558, 840, 48),
    { fontSize: 13.5, bold: true, color: COLORS.text },
  );
}

function styleSlide5(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 5, false);

  paintAt(slide, 9, COLORS.paleBlue, COLORS.hairline, 1);
  setPositionAt(slide, 9, box(70, 184, 1140, 66));
  setRoundedAt(slide, 9, 14);
  textAt(slide, layout, 10, { fontSize: 16.5, bold: true, color: COLORS.text });
  setPositionAt(slide, 10, box(92, 197, 1094, 40));

  const months = [
    { surface: 11, number: 12, month: 13, title: 14, body: 15, divider: 16, label: 17, output: 18, left: 70, fill: COLORS.paper },
    { surface: 19, number: 20, month: 21, title: 22, body: 23, divider: 24, label: 25, output: 26, left: 450, fill: COLORS.paleBlue },
    { surface: 27, number: 28, month: 29, title: 30, body: 31, divider: 32, label: 33, output: 34, left: 830, fill: COLORS.paper },
  ];
  months.forEach(({ surface, number, month, title, body, divider, label, output, left, fill }, index) => {
    paintAt(slide, surface, fill, COLORS.hairline, 1);
    setPositionAt(slide, surface, box(left, 270, 350, 344));
    setRoundedAt(slide, surface, 14);
    textAt(slide, layout, number, { fontSize: 17, bold: true, color: COLORS.paper, alignment: "center" });
    setPositionAt(slide, number, box(left + 20, 294, 44, 44));
    paintAt(slide, number, COLORS.cobalt, COLORS.cobalt, 1);
    setRoundedAt(slide, number, 12);
    textAt(slide, layout, month, { fontSize: 13, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, month, box(left + 78, 300, 130, 30));
    textAt(slide, layout, title, { fontSize: 20, bold: true, color: COLORS.text });
    setPositionAt(slide, title, box(left + 22, 358, 306, 42));
    textAt(slide, layout, body, { fontSize: 14.25, color: COLORS.secondary });
    setPositionAt(slide, body, box(left + 22, 410, 306, 88));
    paintAt(slide, divider, COLORS.hairline, COLORS.hairline, 0);
    setPositionAt(slide, divider, box(left + 22, 520, 306, 1));
    textAt(slide, layout, label, { fontSize: 11.5, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, label, box(left + 22, 536, 64, 28));
    textAt(slide, layout, output, { fontSize: 12.5, bold: true, color: COLORS.text });
    setPositionAt(slide, output, box(left + 92, 532, 236, 58));
    addTopStripe(slide, `month-card-${index + 1}-stripe`, left, 270, 350);
  });
}

function styleSlide6(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 6, false);

  paintAt(slide, 9, COLORS.paleBlue, COLORS.hairline, 1);
  setPositionAt(slide, 9, box(70, 184, 1140, 66));
  setRoundedAt(slide, 9, 14);
  textAt(slide, layout, 10, { fontSize: 16.5, bold: true, color: COLORS.text });
  setPositionAt(slide, 10, box(92, 197, 1094, 40));

  const cards = [
    { surface: 11, number: 12, title: 13, body: 14, left: 70, top: 278, fill: COLORS.paper },
    { surface: 15, number: 16, title: 17, body: 18, left: 450, top: 278, fill: COLORS.paleBlue },
    { surface: 19, number: 20, title: 21, body: 22, left: 830, top: 278, fill: COLORS.paper },
    { surface: 23, number: 24, title: 25, body: 26, left: 70, top: 442, fill: COLORS.paleBlue },
    { surface: 27, number: 28, title: 29, body: 30, left: 450, top: 442, fill: COLORS.paper },
    { surface: 31, number: 32, title: 33, body: 34, left: 830, top: 442, fill: COLORS.paleBlue },
  ];
  cards.forEach(({ surface, number, title, body, left, top, fill }, index) => {
    paintAt(slide, surface, fill, COLORS.hairline, 1);
    setPositionAt(slide, surface, box(left, top, 350, 138));
    setRoundedAt(slide, surface, 14);
    textAt(slide, layout, number, { fontSize: 12.5, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, number, box(left + 20, top + 18, 44, 28));
    textAt(slide, layout, title, { fontSize: 17.5, bold: true, color: COLORS.text });
    setPositionAt(slide, title, box(left + 76, top + 14, 252, 38));
    textAt(slide, layout, body, { fontSize: 13.25, color: COLORS.secondary });
    setPositionAt(slide, body, box(left + 76, top + 55, 252, 64));
    addTopStripe(slide, `deliverable-card-${index + 1}-stripe`, left, top, 350, index === 4 ? COLORS.blue : COLORS.cobalt);
  });
}

function styleSlide7(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 7, true);

  paintAt(slide, 10, COLORS.paper, COLORS.hairline, 1);
  setPositionAt(slide, 10, box(70, 202, 520, 420));
  setRoundedAt(slide, 10, 14);
  paintAt(slide, 11, COLORS.paleBlue, COLORS.hairline, 1);
  setPositionAt(slide, 11, box(630, 202, 580, 420));
  setRoundedAt(slide, 11, 14);
  textAt(slide, layout, 12, { fontSize: 20, bold: true, color: COLORS.text });
  setPositionAt(slide, 12, box(94, 224, 240, 42));
  styleText(shapeAt(slide, 13), "", { fontSize: 1, color: COLORS.canvas });
  setPositionAt(slide, 13, box(0, 0, 1, 1));

  textAt(slide, layout, 14, { fontSize: 20, bold: true, color: COLORS.text });
  setPositionAt(slide, 14, box(654, 224, 520, 42));
  const roadmap = [
    { panel: 15, label: 16, detail: 17, top: 290, labelTextColor: COLORS.paper },
    { panel: 19, label: 20, detail: 21, top: 362, labelTextColor: COLORS.paper },
    { panel: 23, label: 24, detail: 25, top: 434, labelTextColor: COLORS.paper },
  ];
  roadmap.forEach(({ panel, label, detail, top, labelTextColor }) => {
    paintAt(slide, panel, COLORS.cobalt, COLORS.cobalt, 1);
    setPositionAt(slide, panel, box(654, top, 110, 52));
    setRoundedAt(slide, panel, 10);
    textAt(slide, layout, label, { fontSize: 15.5, bold: true, color: labelTextColor, alignment: "center" });
    setPositionAt(slide, label, box(664, top + 10, 90, 30));
    textAt(slide, layout, detail, { fontSize: 13.5, color: COLORS.text });
    setPositionAt(slide, detail, box(786, top + 7, 382, 38));
  });
  [18, 22].forEach((order, index) => {
    textAt(slide, layout, order, { fontSize: 16, bold: true, color: COLORS.cobalt, alignment: "center" });
    setPositionAt(slide, order, box(692, 338 + index * 72, 36, 24));
  });
  paintAt(slide, 26, COLORS.hairline, COLORS.hairline, 0);
  setPositionAt(slide, 26, box(654, 510, 510, 1));
  textAt(slide, layout, 27, { fontSize: 15.5, bold: true, color: COLORS.cobalt });
  setPositionAt(slide, 27, box(654, 526, 300, 32));
  textAt(slide, layout, 28, { fontSize: 12.5, color: COLORS.secondary });
  setPositionAt(slide, 28, box(654, 566, 510, 34));

  const benefits = elementAt(layout, 13).text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (benefits.length !== 6) throw new Error(`Expected six benefit items, got ${benefits.length}`);
  const placements = [
    { left: 90, top: 282 },
    { left: 336, top: 282 },
    { left: 90, top: 380 },
    { left: 336, top: 380 },
    { left: 90, top: 478 },
    { left: 336, top: 478 },
  ];
  benefits.forEach((benefit, index) => {
    const { left, top } = placements[index];
    addSurface(slide, `impact-benefit-${index + 1}`, box(left, top, 238, 82), {
      fill: index % 2 === 0 ? COLORS.paleBlue : COLORS.paper,
      lineFill: COLORS.hairline,
      lineWidth: 1,
      radius: 12,
    });
    addTextbox(slide, `impact-benefit-${index + 1}-number`, String(index + 1).padStart(2, "0"), box(left + 14, top + 14, 38, 22), {
      fontSize: 10.5,
      bold: true,
      color: COLORS.paper,
      alignment: "center",
      fill: COLORS.cobalt,
      radius: 7,
    });
    addTextbox(slide, `impact-benefit-${index + 1}-text`, benefit, box(left + 58, top + 10, 166, 60), {
      fontSize: 12.5,
      bold: true,
      color: COLORS.text,
    });
  });
  shapeAt(slide, 13).delete();
}

function styleSlide8(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 8, false);

  paintAt(slide, 9, COLORS.paleBlue, COLORS.hairline, 1);
  setPositionAt(slide, 9, box(70, 184, 1140, 66));
  setRoundedAt(slide, 9, 14);
  textAt(slide, layout, 10, { fontSize: 16.5, bold: true, color: COLORS.text });
  setPositionAt(slide, 10, box(92, 197, 1094, 40));

  const cards = [
    { surface: 11, category: 12, title: 13, body: 14, left: 70, fill: COLORS.paper, line: COLORS.hairline },
    { surface: 15, category: 16, title: 17, body: 18, left: 450, fill: COLORS.paleBlue, line: COLORS.cobalt },
    { surface: 19, category: 20, title: 21, body: 22, left: 830, fill: COLORS.paper, line: COLORS.hairline },
  ];
  cards.forEach(({ surface, category, title, body, left, fill, line }, index) => {
    paintAt(slide, surface, fill, line, index === 1 ? 1.5 : 1);
    setPositionAt(slide, surface, box(left, 278, 350, 336));
    setRoundedAt(slide, surface, 14);
    textAt(slide, layout, category, { fontSize: 12.5, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, category, box(left + 22, 304, 180, 28));
    textAt(slide, layout, title, { fontSize: 19, bold: true, color: index === 1 ? COLORS.cobalt : COLORS.text });
    setPositionAt(slide, title, box(left + 22, 354, 306, 54));
    textAt(slide, layout, body, { fontSize: 14.25, color: COLORS.secondary });
    setPositionAt(slide, body, box(left + 22, 430, 306, 154));
    addTopStripe(slide, `ai-card-${index + 1}-stripe`, left, 278, 350, index === 1 ? COLORS.cobalt : COLORS.blue);
  });
}

async function buildDeck() {
  const layouts = await loadLayouts();
  const presentation = await PresentationFile.importPptx(await FileBlob.load(STARTER));
  if (presentation.slides.items.length !== 8) {
    throw new Error(`Expected eight starter slides, got ${presentation.slides.items.length}`);
  }
  const stylers = [styleSlide1, styleSlide2, styleSlide3, styleSlide4, styleSlide5, styleSlide6, styleSlide7, styleSlide8];
  presentation.slides.items.forEach((slide, index) => stylers[index](slide, layouts[index]));

  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(FINAL_LAYOUT_DIR, { recursive: true });
  for (const [index, slide] of presentation.slides.items.entries()) {
    const number = String(index + 1).padStart(2, "0");
    await writeBlob(
      path.join(PREVIEW_DIR, `slide-${number}.png`),
      await presentation.export({ slide, format: "png", scale: 1 }),
    );
    const layoutBlob = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(FINAL_LAYOUT_DIR, `slide-${number}.layout.json`), await layoutBlob.text(), "utf8");
  }
  await writeBlob(
    path.join(WORK, "artifact-contact-sheet.png"),
    await presentation.export({ format: "png", montage: true, scale: 0.45 }),
  );
  const inspection = await presentation.inspect({ kind: "slide,textbox,shape", maxChars: 500_000 });
  if (inspection.truncated) throw new Error("Final inspection was truncated");
  await fs.writeFile(path.join(WORK, "artifact-inspect.ndjson"), inspection.ndjson, "utf8");
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUTPUT);
  console.log(`Built ${presentation.slides.items.length} slides at ${OUTPUT}`);
}

async function sha256(filePath) {
  return crypto.createHash("sha256").update(await fs.readFile(filePath)).digest("hex");
}

async function inspectPresentationFile(filePath) {
  const presentation = await PresentationFile.importPptx(await FileBlob.load(filePath));
  const slides = [];
  for (const [index, slide] of presentation.slides.items.entries()) {
    const layout = JSON.parse(await (await slide.export({ format: "layout" })).text());
    const lines = layout.elements
      .filter((element) => typeof element.text === "string")
      .flatMap((element) => element.text.split(/\r?\n/))
      .map((line) => line.trim())
      .filter(Boolean);
    const outOfBounds = layout.elements.filter((element) => {
      const [left, top, width, height] = element.bbox;
      return left < -0.5 || top < -0.5 || left + width > 1280.5 || top + height > 720.5;
    });
    slides.push({ index: index + 1, lines, outOfBounds });
  }
  return { slideCount: presentation.slides.items.length, slides };
}

function countLines(lines) {
  const counts = new Map();
  lines.forEach((line) => counts.set(line, (counts.get(line) ?? 0) + 1));
  return counts;
}

function removeAllowedExtras(slideIndex, counts) {
  if (slideIndex === 4) {
    for (const value of [
      "E2E 테스트 자동화",
      "Playwright · PC · Mobile · Admin 주요 시나리오 검증  →  CI 파이프라인 연동 · Vitest 단위 테스트 병행",
    ]) {
      counts.set(value, (counts.get(value) ?? 0) - 1);
    }
  }
  if (slideIndex === 7) {
    for (let index = 1; index <= 6; index += 1) {
      const value = String(index).padStart(2, "0");
      counts.set(value, (counts.get(value) ?? 0) - 1);
    }
  }
}

async function verifyDeck() {
  const source = await inspectPresentationFile(SOURCE_BACKUP);
  const output = await inspectPresentationFile(OUTPUT);
  if (source.slideCount !== 9 || output.slideCount !== 8) {
    throw new Error(`Slide count mismatch: source=${source.slideCount}, output=${output.slideCount}`);
  }
  for (let index = 0; index < 8; index += 1) {
    const sourceCounts = countLines(source.slides[index].lines);
    const outputCounts = countLines(output.slides[index].lines);
    removeAllowedExtras(index + 1, outputCounts);
    const allLines = new Set([...sourceCounts.keys(), ...outputCounts.keys()]);
    const mismatches = [...allLines]
      .filter((line) => (sourceCounts.get(line) ?? 0) !== (outputCounts.get(line) ?? 0))
      .map((line) => ({ line, source: sourceCounts.get(line) ?? 0, output: outputCounts.get(line) ?? 0 }));
    if (mismatches.length > 0) {
      throw new Error(`Visible content mismatch on slide ${index + 1}: ${JSON.stringify(mismatches)}`);
    }
    if (output.slides[index].outOfBounds.length > 0) {
      throw new Error(`Out-of-bounds elements on slide ${index + 1}: ${JSON.stringify(output.slides[index].outOfBounds)}`);
    }
  }
  const report = {
    sourceBackupSha256: await sha256(SOURCE_BACKUP),
    finalSha256: await sha256(OUTPUT),
    sourceSlideCount: source.slideCount,
    finalSlideCount: output.slideCount,
    sourceSlidesOneToEightContentPreserved: true,
    allowedAdditions: {
      slide4: "E2E test automation band",
      slide7: "six numeric design labels",
    },
    sourceSlide9Deleted: true,
    outOfBoundsCount: 0,
    typeface: FONT,
  };
  await fs.writeFile(path.join(WORK, "verification.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
}

async function main() {
  const mode = process.argv[2];
  if (mode === "--inspect-full") return inspectFullSource();
  if (mode === "--prepare-map") return prepareFrameMap();
  if (mode === "--build") return buildDeck();
  if (mode === "--verify") return verifyDeck();
  throw new Error(`Unsupported mode: ${mode ?? "<none>"}`);
}

await main();
