import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import {
  FileBlob,
  PresentationFile,
} from "/Users/yuhongsig/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ROOT = "/Users/yuhongsig/project/bx-cf/bx-cf-fe";
const WORK = "/private/tmp/bx-cf-executive-editorial";
const SOURCE = path.join(ROOT, "landing/assets/BX-CF.pptx");
const STARTER = path.join(WORK, "template-starter.pptx");
const OUTPUT = path.join(ROOT, "landing/assets/BX-CF_ExecutiveEditorial.pptx");
const INSPECT = path.join(WORK, "template-inspect/template-inspect.ndjson");
const FRAME_MAP = path.join(WORK, "template-frame-map.json");
const PREVIEW_DIR = path.join(WORK, "artifact-preview");
const FINAL_LAYOUT_DIR = path.join(WORK, "artifact-layout");

const FONT = "Malgun Gothic";
const COLORS = {
  canvas: "#F7F9FC",
  paper: "#FFFFFF",
  text: "#0F1B3D",
  cobalt: "#1F57F8",
  blue: "#3A83D8",
  paleBlue: "#DCE7FA",
  secondary: "#58657B",
  hairline: "#CBD8EF",
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

async function inspectFullSource() {
  const presentation = await PresentationFile.importPptx(await FileBlob.load(SOURCE));
  const snapshot = await presentation.inspect({
    kind: "slide,textbox,shape,image,table,chart",
    maxChars: 500_000,
  });
  if (snapshot.truncated) {
    throw new Error("Full source inspection is still truncated");
  }
  await fs.writeFile(INSPECT, snapshot.ndjson, "utf8");
  console.log(`Inspected ${presentation.slides.items.length} slides and ${snapshot.ndjson.length} characters`);
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
      throw new Error(`No inherited elements found on source slide ${sourceSlide}`);
    }

    return {
      outputSlide: sourceSlide,
      sourceSlide,
      narrativeRole,
      reuseMode: "duplicate-slide",
      editTargets: [{ action: "replace", sourceElementIds }],
    };
  });

  await fs.writeFile(
    FRAME_MAP,
    `${JSON.stringify({ outputSlides, omittedSourceSlides: [] }, null, 2)}\n`,
    "utf8",
  );
  console.log(`Prepared frame map for ${outputSlides.length} slides at ${FRAME_MAP}`);
}

async function loadLayouts() {
  return Promise.all(
    NARRATIVE_ROLES.map(async (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      const file = path.join(WORK, `template-starter-layout/starter-slide-${number}.layout.json`);
      return JSON.parse(await fs.readFile(file, "utf8"));
    }),
  );
}

function position(shape, box) {
  shape.position = {
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
  };
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

function textAt(slide, layout, order, options = {}) {
  const element = elementAt(layout, order);
  if (typeof element.text !== "string") throw new Error(`Expected text at order ${order}`);
  styleText(shapeAt(slide, order), element.text, options);
}

function setPositionAt(slide, order, box) {
  position(shapeAt(slide, order), box);
}

function paintAt(slide, order, fill = "none", lineFill = "none", lineWidth = 0) {
  paintShape(shapeAt(slide, order), fill, lineFill, lineWidth);
}

function setBaseStyle(slide, layout) {
  slide.background.fill = COLORS.canvas;
  if (slide.shapes.items.length !== layout.elements.length) {
    throw new Error(
      `Inherited object count mismatch: slide has ${slide.shapes.items.length}, layout has ${layout.elements.length}`,
    );
  }

  layout.elements.forEach((element, index) => {
    const shape = slide.shapes.items[index];
    if (typeof element.text === "string") {
      styleText(shape, element.text, { fontSize: 14.5, color: COLORS.secondary });
      return;
    }

    const isRule = element.bbox[3] <= 2;
    if (isRule) {
      const fill = element.fillColor === "#1F57F8" ? COLORS.cobalt : COLORS.hairline;
      paintShape(shape, fill, "none", 0);
      return;
    }

    if (element.fillColor === "#1F57F8") {
      paintShape(shape, COLORS.cobalt, COLORS.cobalt, 1);
      return;
    }

    if (element.fillColor === "#080B12") {
      paintShape(shape, COLORS.paper, COLORS.hairline, 1);
      return;
    }

    paintShape(shape, "none", "none", 0);
  });
}

function styleHeaderAndFooter(slide, layout, slideNumber) {
  setPositionAt(slide, 1, { left: 59.52, top: 44, width: 6, height: 24 });
  paintAt(slide, 1, COLORS.cobalt);
  textAt(slide, layout, 2, { fontSize: 12, bold: true, color: COLORS.cobalt });
  setPositionAt(slide, 2, { left: 78, top: 43, width: 760, height: 28 });
  textAt(slide, layout, 3, { fontSize: 38, bold: true, color: COLORS.text });
  setPositionAt(slide, 3, { left: 59.52, top: 78.72, width: 1160.93, height: 63.36 });

  const count = layout.elements.length;
  paintAt(slide, count - 2, COLORS.hairline);
  textAt(slide, layout, count - 1, { fontSize: 10.5, color: COLORS.secondary });
  textAt(slide, layout, count, { fontSize: 10.5, bold: true, color: COLORS.cobalt, alignment: "right" });
  if (elementAt(layout, count).text !== String(slideNumber).padStart(2, "0")) {
    throw new Error(`Unexpected footer page number on slide ${slideNumber}`);
  }
}

function styleSlide1(slide, layout) {
  setBaseStyle(slide, layout);

  setPositionAt(slide, 1, { left: 0, top: 0, width: 20, height: 720 });
  paintAt(slide, 1, COLORS.cobalt);
  textAt(slide, layout, 2, { fontSize: 13, bold: true, color: COLORS.cobalt });
  setPositionAt(slide, 2, { left: 78, top: 66, width: 320, height: 28 });

  textAt(slide, layout, 3, { fontSize: 56, bold: true, color: COLORS.text });
  setPositionAt(slide, 3, { left: 74, top: 154, width: 900, height: 92 });
  paintAt(slide, 4, COLORS.cobalt);
  setPositionAt(slide, 4, { left: 78, top: 306, width: 44, height: 2 });
  textAt(slide, layout, 5, { fontSize: 24, bold: true, color: COLORS.blue });
  setPositionAt(slide, 5, { left: 78, top: 256, width: 600, height: 44 });
  textAt(slide, layout, 6, { fontSize: 20, color: COLORS.secondary });
  setPositionAt(slide, 6, { left: 78, top: 326, width: 880, height: 38 });

  paintAt(slide, 7, COLORS.hairline);
  setPositionAt(slide, 7, { left: 78, top: 420, width: 1110, height: 1 });

  const metrics = [
    { label: 8, value: 9, left: 78, width: 300 },
    { label: 10, value: 11, left: 428, width: 190 },
    { label: 12, value: 13, left: 688, width: 500 },
  ];
  metrics.forEach(({ label, value, left, width }) => {
    textAt(slide, layout, label, { fontSize: 12, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, label, { left, top: 454, width, height: 24 });
    textAt(slide, layout, value, { fontSize: 21, bold: true, color: COLORS.text });
    setPositionAt(slide, value, { left, top: 490, width, height: 44 });
  });

  textAt(slide, layout, 14, { fontSize: 11.5, color: COLORS.secondary, alignment: "right" });
  setPositionAt(slide, 14, { left: 1030, top: 660, width: 158, height: 24 });
}

function styleSlide2(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 2);

  paintAt(slide, 4, COLORS.paleBlue, "none", 0);
  setPositionAt(slide, 4, { left: 59.52, top: 165.12, width: 1160.93, height: 150 });
  textAt(slide, layout, 5, { fontSize: 20, bold: true, color: COLORS.text });
  textAt(slide, layout, 6, { fontSize: 14.5, color: COLORS.secondary });

  [7, 10, 13].forEach((order) => paintAt(slide, order, COLORS.cobalt));
  [8, 11, 14].forEach((order) => textAt(slide, layout, order, { fontSize: 18, bold: true, color: COLORS.text }));
  [9, 12, 15].forEach((order) => textAt(slide, layout, order, { fontSize: 15.5, color: COLORS.secondary }));
}

function styleSlide3(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 3);
  textAt(slide, layout, 4, { fontSize: 16, color: COLORS.secondary });

  const rows = [
    { card: 5, number: 6, rule: 7, title: 8, body: 9, top: 204, fill: COLORS.paper },
    { card: 10, number: 11, rule: 12, title: 13, body: 14, top: 326, fill: COLORS.paleBlue },
    { card: 15, number: 16, rule: 17, title: 18, body: 19, top: 448, fill: COLORS.paper },
  ];

  rows.forEach(({ card, number, rule, title, body, top, fill }) => {
    paintAt(slide, card, fill, "none", 0);
    setPositionAt(slide, card, { left: 59.52, top, width: 1160.93, height: 104 });
    textAt(slide, layout, number, { fontSize: 26, bold: true, color: COLORS.cobalt });
    setPositionAt(slide, number, { left: 88, top: top + 26, width: 72, height: 46 });
    paintAt(slide, rule, COLORS.cobalt);
    setPositionAt(slide, rule, { left: 180, top: top + 50, width: 30, height: 2 });
    textAt(slide, layout, title, { fontSize: 19, bold: true, color: COLORS.text });
    setPositionAt(slide, title, { left: 236, top: top + 20, width: 280, height: 56 });
    textAt(slide, layout, body, { fontSize: 15, color: COLORS.secondary });
    setPositionAt(slide, body, { left: 536, top: top + 15, width: 632, height: 72 });
  });
}

function styleSlide4(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 4);

  [4, 39].forEach((order) => paintAt(slide, order, COLORS.paper, COLORS.hairline, 1));
  paintAt(slide, 24, COLORS.paleBlue, "none", 0);
  [7, 27, 42, 64].forEach((order) => paintAt(slide, order, COLORS.hairline));

  const innerPanels = [8, 10, 12, 14, 16, 18, 20, 22, 28, 30, 35, 37, 43, 45, 48, 50, 52, 54, 56, 58, 60];
  innerPanels.forEach((order) => paintAt(slide, order, COLORS.canvas, COLORS.hairline, 1));
  paintAt(slide, 32, COLORS.cobalt, COLORS.cobalt, 1);
  paintAt(slide, 62, COLORS.paleBlue, COLORS.cobalt, 1.5);

  [5, 25, 40].forEach((order) => textAt(slide, layout, order, { fontSize: 12.5, bold: true, color: COLORS.cobalt }));
  [6, 26, 41].forEach((order) => textAt(slide, layout, order, { fontSize: 10.5, color: COLORS.secondary, alignment: "right" }));
  [9, 11, 13, 15, 17, 19, 21, 23, 29, 31, 36, 38, 44, 46, 49, 51, 53, 55, 57, 59, 61].forEach((order) =>
    textAt(slide, layout, order, { fontSize: 11.5, color: COLORS.text, alignment: "center" }),
  );
  textAt(slide, layout, 47, { fontSize: 10, bold: true, color: COLORS.secondary });
  textAt(slide, layout, 33, { fontSize: 13, bold: true, color: COLORS.paper, alignment: "center" });
  textAt(slide, layout, 34, { fontSize: 10.5, color: COLORS.paper, alignment: "center" });
  textAt(slide, layout, 63, { fontSize: 13, bold: true, color: COLORS.cobalt });
  textAt(slide, layout, 65, { fontSize: 12.5, color: COLORS.text });
}

function styleSlide5(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 5);
  textAt(slide, layout, 4, { fontSize: 16, color: COLORS.secondary });

  [5, 14, 23].forEach((order) => paintAt(slide, order, "none", "none", 0));
  [8, 17, 26].forEach((order) => paintAt(slide, order, COLORS.cobalt));
  [11, 20, 29].forEach((order) => paintAt(slide, order, COLORS.hairline));
  [6, 15, 24].forEach((order) => textAt(slide, layout, order, { fontSize: 28, bold: true, color: COLORS.cobalt }));
  [7, 16, 25].forEach((order) => textAt(slide, layout, order, { fontSize: 12.5, bold: true, color: COLORS.secondary }));
  [9, 18, 27].forEach((order) => textAt(slide, layout, order, { fontSize: 19, bold: true, color: COLORS.text }));
  [10, 19, 28].forEach((order) => textAt(slide, layout, order, { fontSize: 15, color: COLORS.secondary }));
  [12, 21, 30].forEach((order) => textAt(slide, layout, order, { fontSize: 11.5, bold: true, color: COLORS.cobalt }));
  [13, 22, 31].forEach((order) => textAt(slide, layout, order, { fontSize: 13.5, bold: true, color: COLORS.text }));
}

function styleSlide6(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 6);
  textAt(slide, layout, 4, { fontSize: 16, color: COLORS.secondary });
  [5, 9, 13, 17, 21, 25].forEach((order) => paintAt(slide, order, "none", "none", 0));
  [6, 10, 14, 18, 22, 26].forEach((order) => paintAt(slide, order, COLORS.cobalt));
  [7, 11, 15, 19, 23, 27].forEach((order) => textAt(slide, layout, order, { fontSize: 17.5, bold: true, color: COLORS.text }));
  [8, 12, 16, 20, 24, 28].forEach((order) => textAt(slide, layout, order, { fontSize: 14.5, color: COLORS.secondary }));
}

function styleSlide7(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 7);
  textAt(slide, layout, 4, { fontSize: 17, bold: true, color: COLORS.cobalt });
  textAt(slide, layout, 17, { fontSize: 17, bold: true, color: COLORS.cobalt });
  [5, 7, 9, 11, 13, 15].forEach((order) => paintAt(slide, order, COLORS.cobalt));
  [6, 8, 10, 12, 14, 16].forEach((order) => textAt(slide, layout, order, { fontSize: 15.5, color: COLORS.text }));

  paintAt(slide, 18, COLORS.paper, COLORS.hairline, 1);
  paintAt(slide, 21, COLORS.paleBlue, "none", 0);
  paintAt(slide, 24, COLORS.cobalt, COLORS.cobalt, 1);
  paintAt(slide, 27, COLORS.paper, COLORS.hairline, 1);
  [19, 22, 28].forEach((order) => textAt(slide, layout, order, { fontSize: 15.5, bold: true, color: COLORS.text }));
  [20, 23, 29].forEach((order) => textAt(slide, layout, order, { fontSize: 13.5, color: COLORS.secondary }));
  textAt(slide, layout, 25, { fontSize: 15.5, bold: true, color: COLORS.paper });
  textAt(slide, layout, 26, { fontSize: 13.5, color: COLORS.paper });
}

function styleSlide8(slide, layout) {
  setBaseStyle(slide, layout);
  styleHeaderAndFooter(slide, layout, 8);
  textAt(slide, layout, 4, { fontSize: 16, color: COLORS.secondary });

  paintAt(slide, 5, COLORS.paper, "none", 0);
  paintAt(slide, 9, COLORS.paleBlue, "none", 0);
  paintAt(slide, 13, COLORS.paper, "none", 0);
  [6, 10, 14].forEach((order) => paintAt(slide, order, COLORS.cobalt));
  [7, 15].forEach((order) => textAt(slide, layout, order, { fontSize: 18, bold: true, color: COLORS.text }));
  textAt(slide, layout, 11, { fontSize: 18, bold: true, color: COLORS.cobalt });
  [8, 12, 16].forEach((order) => textAt(slide, layout, order, { fontSize: 15, color: COLORS.secondary }));
}

async function writeBlob(filePath, blob) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function buildDeck() {
  const layouts = await loadLayouts();
  const presentation = await PresentationFile.importPptx(await FileBlob.load(STARTER));
  if (presentation.slides.items.length !== 8) {
    throw new Error(`Expected 8 starter slides, got ${presentation.slides.items.length}`);
  }

  const stylers = [styleSlide1, styleSlide2, styleSlide3, styleSlide4, styleSlide5, styleSlide6, styleSlide7, styleSlide8];
  presentation.slides.items.forEach((slide, index) => stylers[index](slide, layouts[index]));

  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(FINAL_LAYOUT_DIR, { recursive: true });
  for (const [index, slide] of presentation.slides.items.entries()) {
    const number = String(index + 1).padStart(2, "0");
    await writeBlob(path.join(PREVIEW_DIR, `slide-${number}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    const layoutBlob = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(FINAL_LAYOUT_DIR, `slide-${number}.layout.json`), await layoutBlob.text(), "utf8");
  }
  await writeBlob(path.join(WORK, "artifact-contact-sheet.png"), await presentation.export({ format: "png", montage: true, scale: 0.45 }));
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
    const layoutBlob = await slide.export({ format: "layout" });
    const layout = JSON.parse(await layoutBlob.text());
    const texts = layout.elements
      .filter((element) => typeof element.text === "string")
      .map((element) => element.text);
    const outOfBounds = layout.elements.filter((element) => {
      const [left, top, width, height] = element.bbox;
      return left < -0.5 || top < -0.5 || left + width > 1280.5 || top + height > 720.5;
    });
    const nonMalgunRuns = layout.elements.flatMap((element) =>
      (element.paragraphs ?? []).flatMap((paragraph) =>
        (paragraph.runs ?? [])
          .filter((run) => run.text && run.typeface && run.typeface !== FONT)
          .map((run) => ({ order: element.order, text: run.text, typeface: run.typeface })),
      ),
    );
    slides.push({ index: index + 1, texts, outOfBounds, nonMalgunRuns });
  }
  return { slideCount: presentation.slides.items.length, slides };
}

async function verifyDeck() {
  const source = await inspectPresentationFile(SOURCE);
  const output = await inspectPresentationFile(OUTPUT);
  if (source.slideCount !== 8 || output.slideCount !== 8) {
    throw new Error(`Slide count mismatch: source=${source.slideCount}, output=${output.slideCount}`);
  }

  for (let index = 0; index < 8; index += 1) {
    const sourceTexts = source.slides[index].texts;
    const outputTexts = output.slides[index].texts;
    if (JSON.stringify(sourceTexts) !== JSON.stringify(outputTexts)) {
      throw new Error(
        `Visible text mismatch on slide ${index + 1}:\nsource=${JSON.stringify(sourceTexts)}\noutput=${JSON.stringify(outputTexts)}`,
      );
    }
    if (output.slides[index].outOfBounds.length > 0) {
      throw new Error(`Out-of-bounds elements on slide ${index + 1}: ${JSON.stringify(output.slides[index].outOfBounds)}`);
    }
    if (output.slides[index].nonMalgunRuns.length > 0) {
      throw new Error(`Unexpected typefaces on slide ${index + 1}: ${JSON.stringify(output.slides[index].nonMalgunRuns)}`);
    }
  }

  const report = {
    sourceSha256: await sha256(SOURCE),
    outputSha256: await sha256(OUTPUT),
    sourceSlideCount: source.slideCount,
    outputSlideCount: output.slideCount,
    exactVisibleTextMatch: true,
    outOfBoundsCount: 0,
    typeface: FONT,
  };
  await fs.writeFile(path.join(WORK, "verification.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
}

async function main() {
  const mode = process.argv[2];
  if (mode === "--inspect-full") {
    await inspectFullSource();
    return;
  }
  if (mode === "--prepare-map") {
    await prepareFrameMap();
    return;
  }
  if (mode === "--build") {
    await buildDeck();
    return;
  }
  if (mode === "--verify") {
    await verifyDeck();
    return;
  }

  throw new Error(
    `Unsupported mode: ${mode ?? "<none>"}. Source=${SOURCE} Starter=${STARTER} Output=${OUTPUT}`,
  );
}

await main();
