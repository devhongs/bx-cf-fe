const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const FA = require("react-icons/fa");

// ---------- fresh palette ----------
const INK   = "2A3346";
const BRAND  = "4C6FFF";
const BRANDD = "3856E0";
const MINT   = "14C3A2";
const MINTD  = "0E9E84";
const CORAL  = "FF7A85";
const AMBER  = "FFB02E";
const DARK   = "2B3568";
const DARK2  = "3A4789";
const SCREEN = "212A55";
const LIGHT  = "F5F8FE";
const CARD   = "FFFFFF";
const WHITE  = "FFFFFF";
const ICE    = "C9D6FF";
const GRAY   = "6A7491";
const LINE   = "E6ECF8";
const T_BLUE = "EEF2FF";
const T_MINT = "E2F7F1";
const T_CORAL= "FFEDEE";
const T_AMBER= "FFF1DC";

const HEAD = "Malgun Gothic";
const BODY = "Malgun Gothic";

const ROT = [BRAND, MINT, CORAL];
const TINT = [T_BLUE, T_MINT, T_CORAL];

async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "채널유닛";
pres.title = "채널 파운데이션 구축 제안";
const W = 13.33, H = 7.5;

const sh = () => ({ type: "outer", color: "26305E", blur: 13, offset: 4, angle: 135, opacity: 0.14 });

function header(slide, kicker, title, pageNo) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 0.64, w: 0.17, h: 0.58, fill: { color: BRAND }, rectRadius: 0.07, line: { type: "none" } });
  slide.addText(kicker, { x: 1.0, y: 0.58, w: 9, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: MINTD, charSpacing: 2, margin: 0 });
  slide.addText(title, { x: 0.98, y: 0.83, w: 11.4, h: 0.56, fontFace: HEAD, fontSize: 27, bold: true, color: INK, margin: 0 });
  slide.addText([{ text: "채널 파운데이션 (Channel Foundation)", options: { color: GRAY } }, { text: "   ·   ", options: { color: LINE } }, { text: String(pageNo).padStart(2, "0"), options: { color: MINTD, bold: true } }],
    { x: 0.7, y: 7.04, w: 12, h: 0.3, fontFace: BODY, fontSize: 9.5, align: "left", margin: 0 });
}

(async () => {
  const ic = {
    layers: await icon(FA.FaLayerGroup, "#FFFFFF"),
    hour:   await icon(FA.FaHourglassHalf, "#FFFFFF"),
    robot:  await icon(FA.FaRobot, "#FFFFFF"),
    teach:  await icon(FA.FaChalkboardTeacher, "#FFFFFF"),
    toolbox:await icon(FA.FaToolbox, "#FFFFFF"),
    target: await icon(FA.FaBullseye, "#FFFFFF"),
    chart:  await icon(FA.FaChartLine, "#FFFFFF"),
    coins:  await icon(FA.FaCoins, "#FFFFFF"),
    memory: await icon(FA.FaMemory, "#FFFFFF"),
    bolt:   await icon(FA.FaBolt, "#FFFFFF"),
    heart:  await icon(FA.FaHeartbeat, "#FFFFFF"),
    exchange: await icon(FA.FaExchangeAlt, "#FFFFFF"),
    arrowdown: await icon(FA.FaArrowDown, "#" + AMBER),
    lightbulb: await icon(FA.FaLightbulb, "#" + AMBER),
    check:  await icon(FA.FaCheckCircle, "#" + MINT),
    // deliverables (colored on tint)
    fe:   await icon(FA.FaLaptopCode, "#" + BRANDD),
    be:   await icon(FA.FaServer, "#" + MINTD),
    key:  await icon(FA.FaKey, "#" + CORAL),
    ui:   await icon(FA.FaThLarge, "#" + BRANDD),
    plug: await icon(FA.FaPlug, "#" + MINTD),
    git:  await icon(FA.FaGithub, "#" + CORAL),
  };

  function circleIcon(slide, data, x, y, d, bg) {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg } });
    const pad = d * 0.27;
    slide.addImage({ data, x: x + pad, y: y + pad, w: d - pad * 2, h: d - pad * 2 });
  }
  function rcard(slide, x, y, w, h, fill) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill || CARD }, rectRadius: 0.11, line: { color: LINE, width: 1 }, shadow: sh() });
  }

  // ===================================================== SLIDE 1 — TITLE
  let s = pres.addSlide();
  s.background = { color: DARK };
  s.addShape(pres.shapes.OVAL, { x: 9.3, y: -2.7, w: 7.6, h: 7.6, fill: { color: DARK2 } });
  s.addShape(pres.shapes.OVAL, { x: 11.4, y: 3.9, w: 4.4, h: 4.4, fill: { color: MINT, transparency: 78 } });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.55, w: 0.8, h: 0.16, fill: { color: MINT }, rectRadius: 0.08, line: { type: "none" } });

  s.addText("PROPOSAL   ·   CHANNEL UNIT", { x: 0.72, y: 1.85, w: 9, h: 0.35, fontFace: BODY, fontSize: 13, bold: true, color: MINT, charSpacing: 3, margin: 0 });
  s.addText("채널 파운데이션", { x: 0.67, y: 2.3, w: 11, h: 1.2, fontFace: HEAD, fontSize: 60, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("Channel Foundation", { x: 0.7, y: 3.5, w: 11, h: 0.6, fontFace: HEAD, fontSize: 25, color: ICE, margin: 0 });
  s.addText("채널 프로젝트 수행을 위한 공통 기반(Backend · Frontend) 구축 제안", { x: 0.72, y: 4.35, w: 10.5, h: 0.5, fontFace: BODY, fontSize: 16, color: "AEBCEA", margin: 0 });

  const chips = [["기간", "3개월 · 1단계"], ["인원", "2명"], ["산출물", "스타터 키트 + MVP"]];
  chips.forEach(([k, v], i) => {
    const cx = 0.72 + i * 3.7;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: 5.35, w: 3.45, h: 0.62, fill: { color: DARK2 }, rectRadius: 0.1, line: { type: "none" } });
    s.addText([{ text: k + "   ", options: { color: MINT, bold: true } }, { text: v, options: { color: "FFFFFF" } }],
      { x: cx + 0.28, y: 5.35, w: 3.1, h: 0.62, fontFace: BODY, fontSize: 13, valign: "middle", margin: 0 });
  });
  s.addText("2026.06   |   채널유닛", { x: 0.72, y: 6.5, w: 6, h: 0.3, fontFace: BODY, fontSize: 12, color: "8B96C9", margin: 0 });

  // ===================================================== SLIDE 2 — 배경
  s = pres.addSlide(); s.background = { color: LIGHT };
  header(s, "WHY NOW  ·  추진 배경", "채널 파운데이션이 필요한 이유", 2);
  const bg = [
    [ic.layers, "공통 기반이 없음", "신규 채널 프로젝트를 시작할 때마다 BE · FE 기초를 새로 잡는 탓에 초기 작업 시간이 매번 낭비됨"],
    [ic.hour, "지금이 적기", "차기(Next) 투입 일정이 비어 있는 지금, 가용 인력으로 두고두고 쓸 공통 자산을 확보해 둘 적기임"],
    [ic.teach, "팀의 AI 개발 역량 키우기", "AI 도구를 쓰면 개발 속도가 크게 빨라지지만, 경험이 없으면 제대로 활용하기 어려움. 이번 프로젝트로 팀이 AI 개발을 직접 체득해 둠"],
  ];
  bg.forEach(([data, t, d], i) => {
    const x = 0.7 + i * 4.07, y = 1.85, cw = 3.85, ch = 4.55;
    rcard(s, x, y, cw, ch);
    circleIcon(s, data, x + 0.45, y + 0.5, 1.05, ROT[i]);
    s.addText("0" + (i + 1), { x: x + cw - 1.2, y: y + 0.5, w: 0.95, h: 0.8, fontFace: HEAD, fontSize: 34, bold: true, color: TINT[i], align: "right", margin: 0 });
    s.addText(t, { x: x + 0.45, y: y + 1.85, w: cw - 0.8, h: 0.7, fontFace: HEAD, fontSize: 18.5, bold: true, color: INK, margin: 0 });
    s.addText(d, { x: x + 0.45, y: y + 2.6, w: cw - 0.8, h: 1.8, fontFace: BODY, fontSize: 13, color: GRAY, lineSpacingMultiple: 1.28, margin: 0 });
  });

  // ===================================================== SLIDE 3 — 정의
  s = pres.addSlide(); s.background = { color: LIGHT };
  header(s, "DEFINITION  ·  무엇인가", "경량형 프로젝트 스타터 키트", 3);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.85, w: 4.5, h: 4.55, fill: { color: DARK }, rectRadius: 0.11, line: { type: "none" }, shadow: sh() });
  circleIcon(s, ic.toolbox, 1.1, 2.25, 1.1, MINT);
  s.addText("채널 파운데이션이란?", { x: 1.1, y: 3.5, w: 3.8, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: MINT, margin: 0 });
  s.addText("신규 채널 프로젝트를 위한\nBackend · Frontend\n공통 뼈대", { x: 1.1, y: 3.78, w: 3.8, h: 1.2, fontFace: HEAD, fontSize: 19, bold: true, color: "FFFFFF", lineSpacingMultiple: 1.12, margin: 0 });
  s.addText("회사 기제품을 도입하기 어려운 상황에서도 채널 프로젝트를 성공적으로 수행하기 위한 스타터 키트 + MVP 세트", { x: 1.1, y: 5.05, w: 3.8, h: 1.1, fontFace: BODY, fontSize: 12.5, color: ICE, lineSpacingMultiple: 1.28, margin: 0 });

  const rx = 5.55, rw = 7.05;
  const isList = [
    [ic.toolbox, "공통 뼈대 & 표준", "즉시 투입 가능한 경량 스타터 키트와 개발 표준을 제공해 기초 작업 시간을 없앱니다."],
    [ic.target, "표준 제품의 사각지대 보완", "예산 · 일정이 빠듯해 표준 제품 도입이 어려운 소규모 · 커스텀 현장에 유연하게 선투입할 수 있습니다."],
    [ic.chart, "영업적 부가가치", "MVP 수준의 파운데이션으로 Pre-sales 단계에서 빠른 데모 · 즉시 커스터마이징이 가능해 수주 경쟁력을 강화합니다."],
  ];
  isList.forEach(([data, t, d], i) => {
    const y = 1.95 + i * 1.52;
    rcard(s, rx, y, rw, 1.32);
    circleIcon(s, data, rx + 0.32, y + 0.34, 0.66, ROT[i]);
    s.addText(t, { x: rx + 1.2, y: y + 0.2, w: rw - 1.5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: INK, margin: 0 });
    s.addText(d, { x: rx + 1.2, y: y + 0.6, w: rw - 1.5, h: 0.62, fontFace: BODY, fontSize: 12.5, color: GRAY, lineSpacingMultiple: 1.18, margin: 0 });
  });

  // ===================================================== SLIDE 4 — 구성도 (architecture)
  s = pres.addSlide(); s.background = { color: LIGHT };
  header(s, "ARCHITECTURE  ·  구성", "채널 파운데이션 구성도", 4);

  const pill = (x, y, w, h, text, fill, tc, fs, bold, ln) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, rectRadius: Math.min(0.09, h / 2), line: ln ? { color: ln, width: 1 } : { type: "none" } });
    s.addText(text, { x: x + 0.03, y, w: w - 0.06, h, fontFace: BODY, fontSize: fs, bold: !!bold, color: tc, align: "center", valign: "middle", margin: 0 });
  };
  const bline = (x, y, w, label, val, dot) => {
    s.addShape(pres.shapes.OVAL, { x, y: y + 0.085, w: 0.08, h: 0.08, fill: { color: dot }, line: { type: "none" } });
    s.addText([{ text: label + "  ", options: { bold: true, color: INK } }, { text: val, options: { color: GRAY } }], { x: x + 0.18, y: y - 0.02, w: w - 0.18, h: 0.3, fontFace: BODY, fontSize: 9.5, valign: "middle", margin: 0 });
  };

  const py = 1.78, ph = 5.12;
  // ---- FE panel ----
  const fx = 0.7, fw = 4.55;
  rcard(s, fx, py, fw, ph);
  pill(fx + 0.25, py + 0.2, 1.65, 0.38, "FRONTEND", BRAND, WHITE, 11, true);
  s.addText("React 19 · 모노레포 (Turbo + pnpm)", { x: fx + 0.25, y: py + 0.66, w: fw - 0.5, h: 0.3, fontFace: BODY, fontSize: 9.5, color: GRAY, margin: 0 });
  s.addText("앱 3종", { x: fx + 0.25, y: py + 1.0, w: 2, h: 0.25, fontFace: BODY, fontSize: 9, bold: true, color: BRANDD, margin: 0 });
  ["PC Web", "Mobile Web", "Admin Portal"].forEach((a, i) => pill(fx + 0.25 + i * 1.37, py + 1.28, 1.28, 0.4, a, T_BLUE, BRANDD, 9.5, true));
  const sb = { x: fx + 0.25, y: py + 1.85, w: fw - 0.5, h: 2.45 };
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: sb.x, y: sb.y, w: sb.w, h: sb.h, fill: { color: "F2F5FC" }, rectRadius: 0.08, line: { color: LINE, width: 1 } });
  s.addText("@bx/shared 공통 패키지", { x: sb.x + 0.18, y: sb.y + 0.1, w: sb.w - 0.36, h: 0.28, fontFace: BODY, fontSize: 10, bold: true, color: INK, margin: 0 });
  [
    ["라우팅", "TanStack Router · 상태 Zustand"],
    ["데이터", "TanStack Query + Axios"],
    ["인증", "JWT 저장 · 401 자동 재발급"],
    ["UI", "Radix UI + Tailwind v4"],
    ["도메인", "auth·user·account·menu·product"],
    ["유틸", "i18n·날짜·포맷·검증·암호화"],
  ].forEach(([l, v], i) => bline(sb.x + 0.2, sb.y + 0.5 + i * 0.31, sb.w - 0.35, l, v, ROT[i % 3]));
  s.addText([{ text: "빌드·품질  ", options: { bold: true, color: BRANDD } }, { text: "Vite 8 · Biome · Vitest · React Compiler", options: { color: GRAY } }], { x: fx + 0.25, y: py + 4.45, w: fw - 0.4, h: 0.3, fontFace: BODY, fontSize: 9, valign: "middle", margin: 0 });

  // ---- center band ----
  const cx = 5.7, cw = 1.95;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: py, w: cw, h: ph, fill: { color: DARK }, rectRadius: 0.1, line: { type: "none" }, shadow: sh() });
  s.addText("API 연계", { x: cx, y: py + 0.25, w: cw, h: 0.3, fontFace: HEAD, fontSize: 12.5, bold: true, color: WHITE, align: "center", margin: 0 });
  s.addImage({ data: ic.exchange, x: cx + cw / 2 - 0.22, y: py + 0.7, w: 0.44, h: 0.44 });
  s.addText("HTTPS · Envelope", { x: cx + 0.1, y: py + 1.3, w: cw - 0.2, h: 0.26, fontFace: BODY, fontSize: 9, color: ICE, align: "center", margin: 0 });
  s.addText("JWT 인증 헤더", { x: cx + 0.1, y: py + 1.56, w: cw - 0.2, h: 0.26, fontFace: BODY, fontSize: 9, color: ICE, align: "center", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: cx + 0.25, y: py + 2.0, w: cw - 0.5, h: 0, line: { color: DARK2, width: 1 } });
  s.addText("타입 계약", { x: cx, y: py + 2.13, w: cw, h: 0.3, fontFace: HEAD, fontSize: 12, bold: true, color: AMBER, align: "center", margin: 0 });
  s.addText("BE OpenAPI (type-bridge)", { x: cx + 0.08, y: py + 2.48, w: cw - 0.16, h: 0.45, fontFace: BODY, fontSize: 8.5, color: WHITE, align: "center", lineSpacingMultiple: 1.0, margin: 0 });
  s.addImage({ data: ic.arrowdown, x: cx + cw / 2 - 0.09, y: py + 3.0, w: 0.18, h: 0.18 });
  s.addText("openapi-typescript", { x: cx + 0.06, y: py + 3.26, w: cw - 0.12, h: 0.3, fontFace: BODY, fontSize: 8.5, color: WHITE, align: "center", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx + 0.22, y: py + 3.78, w: cw - 0.44, h: 0.95, fill: { color: "20305A" }, rectRadius: 0.08, line: { color: MINT, width: 1 } });
  s.addText("FE·BE 타입\n자동 일치", { x: cx + 0.22, y: py + 3.83, w: cw - 0.44, h: 0.85, fontFace: HEAD, fontSize: 10.5, bold: true, color: MINT, align: "center", valign: "middle", lineSpacingMultiple: 1.0, margin: 0 });

  // ---- BE panel ----
  const bx = cx + cw + 0.45, bw = 12.63 - (cx + cw + 0.45);
  rcard(s, bx, py, bw, ph);
  pill(bx + 0.25, py + 0.2, 1.55, 0.38, "BACKEND", MINT, WHITE, 11, true);
  s.addText("Spring Cloud MSA · Java 21 · Boot 3", { x: bx + 0.25, y: py + 0.66, w: bw - 0.5, h: 0.3, fontFace: BODY, fontSize: 9.5, color: GRAY, margin: 0 });
  s.addText("Infra", { x: bx + 0.25, y: py + 1.0, w: 2, h: 0.25, fontFace: BODY, fontSize: 9, bold: true, color: MINTD, margin: 0 });
  pill(bx + 0.25, py + 1.28, 2.0, 0.4, "API Gateway", T_MINT, MINTD, 9.5, true);
  pill(bx + 0.25 + 2.1, py + 1.28, 1.88, 0.4, "Discovery·Eureka", T_MINT, MINTD, 9, true);
  s.addText("Services", { x: bx + 0.25, y: py + 1.78, w: 2, h: 0.25, fontFace: BODY, fontSize: 9, bold: true, color: MINTD, margin: 0 });
  pill(bx + 0.25, py + 2.04, 2.0, 0.4, "auth-svc", T_CORAL, CORAL, 9.5, true);
  pill(bx + 0.25 + 2.1, py + 2.04, 1.88, 0.4, "product-svc(샘플)", T_CORAL, CORAL, 9, true);
  const lb = { x: bx + 0.25, y: py + 2.62, w: bw - 0.5, h: 1.65 };
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: lb.x, y: lb.y, w: lb.w, h: lb.h, fill: { color: "EBF8F3" }, rectRadius: 0.08, line: { color: LINE, width: 1 } });
  s.addText("공통 라이브러리 (libs)", { x: lb.x + 0.18, y: lb.y + 0.1, w: lb.w - 0.36, h: 0.28, fontFace: BODY, fontSize: 10, bold: true, color: INK, margin: 0 });
  [
    ["common", "Web · JPA · AOP · Actuator"],
    ["auth-core", "OAuth2 · Security · JWT"],
    ["type-bridge", "OpenAPI 스펙 자동 생성"],
  ].forEach(([l, v], i) => bline(lb.x + 0.2, lb.y + 0.52 + i * 0.34, lb.w - 0.35, l, v, ROT[i % 3]));
  s.addText([{ text: "공통기능  ", options: { bold: true, color: MINTD } }, { text: "인증/인가 · 모니터링(Actuator) · 서비스 등록/발견", options: { color: GRAY } }], { x: bx + 0.25, y: py + 4.45, w: bw - 0.4, h: 0.3, fontFace: BODY, fontSize: 9, valign: "middle", margin: 0 });

  // ---- connecting arrows ----
  s.addShape(pres.shapes.LINE, { x: fx + fw, y: py + 2.4, w: cx - (fx + fw), h: 0, line: { color: "8A93AE", width: 1.5, dashType: "dash", beginArrowType: "triangle", endArrowType: "triangle" } });
  s.addShape(pres.shapes.LINE, { x: cx + cw, y: py + 2.4, w: bx - (cx + cw), h: 0, line: { color: "8A93AE", width: 1.5, dashType: "dash", beginArrowType: "triangle", endArrowType: "triangle" } });

  // ===================================================== SLIDE 5 — 개발 계획 (dark)
  s = pres.addSlide(); s.background = { color: DARK };
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 0.64, w: 0.17, h: 0.58, fill: { color: MINT }, rectRadius: 0.07, line: { type: "none" } });
  s.addText("PLAN  ·  개발 계획", { x: 1.0, y: 0.58, w: 8, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: MINT, charSpacing: 2, margin: 0 });
  s.addText("2명 · 3개월 — 1단계 마일스톤", { x: 0.98, y: 0.83, w: 11, h: 0.56, fontFace: HEAD, fontSize: 27, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("실 프로젝트 진행을 위한 뼈대(인프라 · 통신 · 인증 · 모듈 구조)에 집중하고, 개별 프로젝트에 종속되는 비즈니스 로직은 철저히 배제합니다.", { x: 0.98, y: 1.45, w: 11.5, h: 0.4, fontFace: BODY, fontSize: 13.5, color: ICE, margin: 0 });
  const months = [
    ["1개월차", "기반 구축", "모노레포 구조화 및 공통 패키지(@bx/shared) 세팅, 번들러 · 빌드 / 배포 검증", "아키텍처 설계서 · 공통 뼈대 소스코드"],
    ["2개월차", "코어 기능", "HTTP 통신 모듈(Envelope 처리), 공통 인증 흐름(JWT Auto-refresh), 기본 라우팅 · 공통 레이아웃 설계", "라우팅 / 인증 코어 모듈"],
    ["3개월차", "검증 & 가이드", "PC · Mobile · Admin 스켈레톤 앱 연동 검증 및 개발 가이드 문서화", "스타터 템플릿 · 개발자 가이드 문서"],
  ];
  s.addShape(pres.shapes.LINE, { x: 1.6, y: 2.55, w: 10.0, h: 0, line: { color: DARK2, width: 2 } });
  months.forEach(([m, t, d, out], i) => {
    const x = 0.85 + i * 4.05, cw = 3.75, y = 2.75;
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 2.32, w: 0.46, h: 0.46, fill: { color: MINT }, line: { color: DARK, width: 3 } });
    s.addText(String(i + 1), { x: x + 0.35, y: 2.32, w: 0.46, h: 0.46, fontFace: HEAD, fontSize: 16, bold: true, color: DARK, align: "center", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: 3.45, fill: { color: DARK2 }, rectRadius: 0.08, line: { type: "none" } });
    s.addText(m, { x: x + 0.32, y: y + 0.3, w: cw - 0.6, h: 0.35, fontFace: BODY, fontSize: 12.5, bold: true, color: MINT, charSpacing: 1, margin: 0 });
    s.addText(t, { x: x + 0.32, y: y + 0.62, w: cw - 0.6, h: 0.5, fontFace: HEAD, fontSize: 21, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(d, { x: x + 0.32, y: y + 1.25, w: cw - 0.6, h: 1.4, fontFace: BODY, fontSize: 12.5, color: ICE, lineSpacingMultiple: 1.25, margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.32, y: y + 2.8, w: cw - 0.64, h: 0, line: { color: "4A5599", width: 1 } });
    s.addText([{ text: "산출물  ", options: { color: AMBER, bold: true } }, { text: out, options: { color: "E7EDF8" } }],
      { x: x + 0.32, y: y + 2.88, w: cw - 0.6, h: 0.5, fontFace: BODY, fontSize: 11.5, lineSpacingMultiple: 1.1, margin: 0 });
  });
  s.addText("05", { x: 12.4, y: 7.04, w: 0.6, h: 0.3, fontFace: BODY, fontSize: 9.5, color: MINT, bold: true, align: "right", margin: 0 });

  // ===================================================== SLIDE 6 — 산출물
  s = pres.addSlide(); s.background = { color: LIGHT };
  header(s, "DELIVERABLES  ·  산출물", "1단계 주요 산출물", 6);
  s.addText("개별 고객의 비즈니스 로직은 제외하고, 여러 파생 프로젝트가 올라설 공통 기반을 먼저 확보합니다.", { x: 0.7, y: 1.78, w: 12, h: 0.35, fontFace: BODY, fontSize: 14, color: GRAY, italic: true, margin: 0 });
  const deliv = [
    [ic.fe,  "Frontend 개발 가이드", "PC · Mobile · Admin 스켈레톤 + 가이드"],
    [ic.be,  "Backend 개발 가이드", "공통 모듈 · 표준 레이아웃 + 가이드"],
    [ic.key, "인증 / 권한 기본 체계", "JWT Auto-refresh 공통 인증 흐름"],
    [ic.ui,  "공통 UI · 화면 템플릿", "기본 라우팅 및 공통 레이아웃"],
    [ic.plug,"API 연계 표준 구조", "HTTP 통신 모듈 · Envelope 처리"],
    [ic.git, "프로젝트 관리 · WBS", "GitHub Project 기반 WBS · 일정 관리"],
  ];
  deliv.forEach(([data, t, d], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.7 + col * 4.07, y = 2.35 + row * 2.18, cw = 3.85, ch = 1.95;
    const k = i % 3;
    rcard(s, x, y, cw, ch);
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.35, w: 0.85, h: 0.85, fill: { color: TINT[k] } });
    s.addImage({ data, x: x + 0.57, y: y + 0.57, w: 0.41, h: 0.41 });
    s.addText(t, { x: x + 1.4, y: y + 0.42, w: cw - 1.6, h: 0.45, fontFace: HEAD, fontSize: 15, bold: true, color: INK, valign: "middle", margin: 0 });
    s.addText(d, { x: x + 0.4, y: y + 1.3, w: cw - 0.75, h: 0.5, fontFace: BODY, fontSize: 12, color: GRAY, lineSpacingMultiple: 1.1, margin: 0 });
  });

  // ===================================================== SLIDE 7 — 기대효과 & 로드맵
  s = pres.addSlide(); s.background = { color: LIGHT };
  header(s, "IMPACT  ·  기대효과 & 로드맵", "기대효과와 향후 확장 계획", 7);
  s.addText("기대효과", { x: 0.7, y: 1.9, w: 6, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true, color: INK, margin: 0 });
  const eff = [
    "채널 프로젝트 초기 구축 기간 단축",
    "개발 표준화 및 품질 향상",
    "반복 개발 비용 절감",
    "AI 기반 개발 방식에 대한 조직 경험 축적",
    "향후 영업 · 제안 활동 지원",
  ];
  eff.forEach((t, i) => {
    const y = 2.5 + i * 0.82;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y, w: 6.0, h: 0.66, fill: { color: CARD }, rectRadius: 0.09, line: { color: LINE, width: 1 } });
    s.addImage({ data: ic.check, x: 0.95, y: y + 0.16, w: 0.34, h: 0.34 });
    s.addText(t, { x: 1.45, y, w: 5.1, h: 0.66, fontFace: BODY, fontSize: 13.5, bold: true, color: INK, valign: "middle", margin: 0 });
  });

  // roadmap panel with monitoring illustration
  const px = 7.05, pw = 5.58;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: 1.9, w: pw, h: 4.5, fill: { color: DARK }, rectRadius: 0.1, line: { type: "none" }, shadow: sh() });
  s.addText("향후 로드맵", { x: px + 0.4, y: 2.18, w: pw - 0.8, h: 0.35, fontFace: BODY, fontSize: 12.5, bold: true, color: AMBER, charSpacing: 1, margin: 0 });
  s.addText([{ text: "채널 상태 모니터링 도구", options: { color: "FFFFFF" } }], { x: px + 0.4, y: 2.5, w: pw - 0.8, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, margin: 0 });
  s.addText("채널 상태를 실시간 감시하는 관제 · 운영 지원 도구", { x: px + 0.4, y: 2.98, w: pw - 0.8, h: 0.35, fontFace: BODY, fontSize: 12.5, color: ICE, margin: 0 });

  // ---- mini 관제 dashboard ----
  const mx = px + 0.4, my = 3.5, mw = pw - 0.8, mh = 2.6;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mx, y: my, w: mw, h: mh, fill: { color: SCREEN }, rectRadius: 0.07, line: { color: "3C4880", width: 1 } });
  // window dots
  [CORAL, AMBER, MINT].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: mx + 0.28 + i * 0.22, y: my + 0.26, w: 0.13, h: 0.13, fill: { color: c }, line: { type: "none" } }));
  s.addShape(pres.shapes.OVAL, { x: mx + mw - 1.15, y: my + 0.26, w: 0.13, h: 0.13, fill: { color: MINT }, line: { type: "none" } });
  s.addText("LIVE", { x: mx + mw - 0.95, y: my + 0.16, w: 0.8, h: 0.3, fontFace: BODY, fontSize: 10, bold: true, color: MINT, charSpacing: 1, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: mx + 0.25, y: my + 0.62, w: mw - 0.5, h: 0, line: { color: "3C4880", width: 1 } });

  // status rows (left)
  const statuses = [["PC 채널", "정상", MINT], ["Mobile", "정상", MINT], ["Admin", "점검", AMBER]];
  statuses.forEach(([lbl, st, c], i) => {
    const ry = my + 0.82 + i * 0.46;
    s.addShape(pres.shapes.OVAL, { x: mx + 0.3, y: ry + 0.05, w: 0.15, h: 0.15, fill: { color: c }, line: { type: "none" } });
    s.addText(lbl, { x: mx + 0.58, y: ry - 0.04, w: 1.7, h: 0.32, fontFace: BODY, fontSize: 12, bold: true, color: "EAEFFF", valign: "middle", margin: 0 });
    s.addText(st, { x: mx + 1.9, y: ry - 0.04, w: 0.9, h: 0.32, fontFace: BODY, fontSize: 11, bold: true, color: c, valign: "middle", margin: 0 });
  });
  // mini bar chart (right)
  const bars = [0.32, 0.5, 0.4, 0.66, 0.52, 0.78];
  const bx0 = mx + mw - 2.0, baseY = my + 2.05, maxBar = 0.92;
  bars.forEach((v, i) => {
    const bxX = bx0 + i * 0.3, bh = v * maxBar;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bxX, y: baseY - bh, w: 0.18, h: bh, fill: { color: i === bars.length - 1 ? MINT : "5566B5" }, rectRadius: 0.03, line: { type: "none" } });
  });
  s.addText("응답속도 · 모니터링", { x: bx0, y: baseY + 0.06, w: 2.0, h: 0.25, fontFace: BODY, fontSize: 9, color: "9AA6DC", margin: 0 });
  // uptime stat
  s.addText([{ text: "가동률 ", options: { color: ICE } }, { text: "99.9%", options: { color: MINT, bold: true } }], { x: mx + 0.3, y: my + 2.18, w: 2.3, h: 0.32, fontFace: HEAD, fontSize: 13, margin: 0 });

  // ===================================================== SLIDE 8 — AI 유료 요금제 (moved to end)
  s = pres.addSlide(); s.background = { color: LIGHT };
  header(s, "ENABLER  ·  개발 환경", "AI 유료 요금제 필요성", 8);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.95, w: 4.45, h: 4.4, fill: { color: DARK }, rectRadius: 0.11, line: { type: "none" }, shadow: sh() });
  s.addText("핵심은", { x: 1.05, y: 2.35, w: 3.8, h: 0.4, fontFace: BODY, fontSize: 14, color: ICE, margin: 0 });
  s.addText("토큰 · 컨텍스트", { x: 1.02, y: 2.7, w: 4, h: 0.7, fontFace: HEAD, fontSize: 30, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("기능 차이가 아닌\n사용량(Capacity)의 차이", { x: 1.05, y: 3.45, w: 3.8, h: 0.9, fontFace: BODY, fontSize: 14, color: MINT, bold: true, lineSpacingMultiple: 1.15, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 1.05, y: 4.5, w: 3.0, h: 0, line: { color: DARK2, width: 1.5 } });
  s.addText("무료 · 기본 요금제는 단발성 질의에 적합하나, 파운데이션 수준의 모노레포(PC · Mobile · Admin + 공유 패키지)를 한 번에 다루기엔 한계가 큽니다.", { x: 1.05, y: 4.65, w: 3.85, h: 1.6, fontFace: BODY, fontSize: 12.5, color: ICE, lineSpacingMultiple: 1.32, margin: 0 });
  const aiList = [
    [ic.memory, "대용량 컨텍스트 유지", "프로젝트 전체 소스의 의존성을 유지한 채 분석 → 아키텍처 정합성에 맞는 코드 생성과 정확한 오류 진단이 가능합니다."],
    [ic.bolt, "연속 작업 보장", "대규모 코드 생성 · 리팩토링 · 문서화가 토큰 한도에 끊기지 않고 이어져, 실질적인 개발 생산성을 확보합니다."],
    [ic.coins, "목적에 부합", "단순 질의응답이 아닌 파운데이션 설계 · 구현이 목표이므로, 충분한 사용량이 보장되는 유료 요금제가 전제됩니다."],
  ];
  aiList.forEach(([data, t, d], i) => {
    const x = 5.5, y = 1.95 + i * 1.5, w = 7.1;
    rcard(s, x, y, w, 1.3);
    circleIcon(s, data, x + 0.35, y + 0.33, 0.64, ROT[i]);
    s.addText(t, { x: x + 1.2, y: y + 0.18, w: w - 1.5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: INK, margin: 0 });
    s.addText(d, { x: x + 1.2, y: y + 0.58, w: w - 1.5, h: 0.65, fontFace: BODY, fontSize: 12.5, color: GRAY, lineSpacingMultiple: 1.18, margin: 0 });
  });

  // ===================================================== SLIDE 9 — CLOSING
  s = pres.addSlide(); s.background = { color: DARK };
  s.addShape(pres.shapes.OVAL, { x: -2.5, y: 3.6, w: 7, h: 7, fill: { color: DARK2 } });
  s.addShape(pres.shapes.OVAL, { x: 9.7, y: -3, w: 6.5, h: 6.5, fill: { color: DARK2 } });
  s.addShape(pres.shapes.OVAL, { x: 11.0, y: 4.6, w: 3.2, h: 3.2, fill: { color: MINT, transparency: 80 } });
  s.addImage({ data: ic.lightbulb, x: 0.72, y: 1.55, w: 0.95, h: 0.95 });
  s.addText("AI 기반 고효율 개발 프로세스 — 선제적 대응", { x: 0.72, y: 2.7, w: 11, h: 0.45, fontFace: BODY, fontSize: 16, bold: true, color: MINT, margin: 0 });
  s.addText("단순한 파운데이션 하나를 넘어,\nAI 활용 개발 방식에 대한\n조직의 경험을 자산화합니다.", { x: 0.68, y: 3.15, w: 11.6, h: 1.7, fontFace: HEAD, fontSize: 31, bold: true, color: "FFFFFF", lineSpacingMultiple: 1.12, margin: 0 });
  s.addText("MVP 수준의 채널 파운데이션 확보 → 영업 · 제안 단계의 데모 환경 구성 → 신규 사업 기회 발굴", { x: 0.72, y: 5.05, w: 11, h: 0.5, fontFace: BODY, fontSize: 15, color: ICE, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.72, y: 5.85, w: 2.4, h: 0.08, fill: { color: MINT }, rectRadius: 0.04, line: { type: "none" } });
  s.addText("감사합니다.   |   채널유닛  ·  2026.06", { x: 0.72, y: 6.1, w: 10, h: 0.4, fontFace: BODY, fontSize: 14, color: ICE, margin: 0 });

  await pres.writeFile({ fileName: "채널_파운데이션_제안_v2.pptx" });
  console.log("DONE");
})();
