const pptxgen = require('pptxgenjs');
const pptx = new pptxgen();

// Set presentation layout to 16:9 widescreen
pptx.layout = 'LAYOUT_16x9';

// Define Global Styles
const FONT_FAMILY = '맑은 고딕';

/**
 * Helper to add header, divider line, lead text, and footer to content slides
 */
function addHeaderAndFooter(slide, titleText, leadText, pageNum) {
  // Title
  slide.addText(titleText, {
    x: 0.6, y: 0.4, w: 12.13, h: 0.5,
    fontFace: FONT_FAMILY, fontSize: 20, bold: true, color: '0F172A',
    valign: 'middle'
  });
  
  // Accent divider line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 0.95, w: 12.13, h: 0.02,
    fill: { color: '6366F1' },
    line: { width: 0 }
  });
  
  // Lead text
  slide.addText(leadText, {
    x: 0.6, y: 1.05, w: 12.13, h: 0.4,
    fontFace: FONT_FAMILY, fontSize: 12, color: '475569',
    valign: 'middle'
  });
  
  // Footer left
  slide.addText("Google Cloud | 채널 파운데이션 개발 기획서", {
    x: 0.6, y: 7.0, w: 6.0, h: 0.3,
    fontFace: FONT_FAMILY, fontSize: 9, color: '94A3B8',
    valign: 'middle'
  });
  
  // Footer right (Page number)
  slide.addText(String(pageNum), {
    x: 11.73, y: 7.0, w: 1.0, h: 0.3,
    fontFace: FONT_FAMILY, fontSize: 9, color: '94A3B8',
    align: 'right', valign: 'middle'
  });
}

// ==========================================
// SLIDE 1: Cover Page (Dark Theme)
// ==========================================
{
  let slide = pptx.addSlide();
  slide.background = { color: '0F172A' }; // slate-900
  
  // Accent vertical line on the left
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 2.2, w: 0.08, h: 2.6,
    fill: { color: '6366F1' }, // Indigo-500
    line: { width: 0 }
  });
  
  // Category Tag
  slide.addText("PROJECT PROPOSAL", {
    x: 0.8, y: 2.1, w: 10, h: 0.3,
    fontFace: FONT_FAMILY, fontSize: 11, bold: true, color: '818CF8'
  });
  
  // Main Title
  slide.addText("google 채널 파운데이션 개발 기획", {
    x: 0.8, y: 2.4, w: 11.5, h: 1.2,
    fontFace: FONT_FAMILY, fontSize: 34, bold: true, color: 'FFFFFF',
    valign: 'middle'
  });
  
  // Subtitle
  slide.addText("AI 기반 고효율 개발 및 프로젝트 수행 표준화 방안", {
    x: 0.8, y: 3.7, w: 11.5, h: 0.5,
    fontFace: FONT_FAMILY, fontSize: 16, color: '94A3B8'
  });
  
  // Meta Info
  slide.addText("작성일: 2026. 06. 17\n작성자: Antigravity", {
    x: 0.8, y: 5.6, w: 5, h: 0.8,
    fontFace: FONT_FAMILY, fontSize: 11, color: '64748B',
    lineSpacing: 18
  });
}

// ==========================================
// SLIDE 2: 추진 배경 및 필요성 (Light Theme)
// ==========================================
{
  let slide = pptx.addSlide();
  slide.background = { color: 'F8FAFC' };
  
  addHeaderAndFooter(
    slide,
    "01. 추진 배경 및 필요성",
    "AX(Agentic AI) 코딩 패러다임 선제 대응과 대용량 프로젝트 전체 분석을 위한 유료 요금제 도입 필요",
    2
  );
  
  // Left Card: Limits of Free Plan
  slide.addText([
    { text: "범용 무료 및 기본 요금제의 한계\n\n", options: { bold: true, fontSize: 14, color: "EF4444" } },
    { text: "• 대화형 AI(무료/일반)는 컨텍스트 윈도우(Context Window)가 협소하여 단발성 질의응답 수준에 머무름\n\n", options: { fontSize: 11, color: "475569" } },
    { text: "• PC·Mobile·Admin을 아우르는 모노레포 구조 및 공유 패키지 의존성을 한 번에 파악하기 불가능\n\n", options: { fontSize: 11, color: "475569" } },
    { text: "• 개발 도중 잦은 사용량 초과로 토큰 제한이 발생하여 개발 흐름 및 작업의 연속성이 단절됨", options: { fontSize: 11, color: "475569" } }
  ], {
    x: 0.6, y: 1.7, w: 5.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 20, 20, 20],
    fontFace: FONT_FAMILY
  });
  
  // Right Card: Value of Paid Plan
  slide.addText([
    { text: "유료 개발자 요금제 도입 시 기대 효과\n\n", options: { bold: true, fontSize: 14, color: "15803D" } },
    { text: "• 프로젝트 전체 소스코드의 의존성 관계를 파악하는 대용량 토큰(컨텍스트 유지) 환경 구축\n\n", options: { fontSize: 11, color: "475569" } },
    { text: "• 아키텍처 정합성을 정교하게 반영한 소스코드 자동 생성 및 실시간 오류 진단 가능\n\n", options: { fontSize: 11, color: "475569" } },
    { text: "• AI 기반 개발 방식에 대한 조직 역량을 축적하고, 개발 생산성을 획기적으로 향상시킵니다.", options: { fontSize: 11, color: "475569" } }
  ], {
    x: 6.9, y: 1.7, w: 5.8, h: 5.0,
    fill: { color: "F0FDF4" }, // soft green
    line: { color: "BBF7D0", width: 1 },
    valign: "top",
    margin: [20, 20, 20, 20],
    fontFace: FONT_FAMILY
  });
}

// ==========================================
// SLIDE 3: 채널 파운데이션 정의 및 목적 (Light Theme)
// ==========================================
{
  let slide = pptx.addSlide();
  slide.background = { color: 'F8FAFC' };
  
  addHeaderAndFooter(
    slide,
    "02. 채널 파운데이션 정의 및 개발 목적",
    "신규 채널 프로젝트에 즉각 투입 가능한 경량 Boilerplate 세트와 MVP 데모 자산 구축",
    3
  );
  
  // Card 1: Boilerplate
  slide.addText([
    { text: "경량형 프로젝트 Starter Kit\n\n", options: { bold: true, fontSize: 13, color: "0F172A" } },
    { text: "• 백엔드(BE)와 프론트엔드(FE) 공통 표준 부재로 인한 초기 구성 공수 낭비 차단\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "• 인프라, 통신, 공통 인증 등 기반 구조를 표준화한 스타터 패키지 배포\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "• 신규 프로젝트 착수 시 개발 세팅 시간을 대폭 단축하여 비즈니스 개발에 집중", options: { fontSize: 10.5, color: "475569" } }
  ], {
    x: 0.6, y: 1.7, w: 3.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 15, 20, 15],
    fontFace: FONT_FAMILY
  });
  
  // Card 2: R&D Coexistence
  slide.addText([
    { text: "기존 제품팀과의 R&D 시너지\n\n", options: { bold: true, fontSize: 13, color: "0F172A" } },
    { text: "• 회사의 핵심 표준 제품군(BXUI 등)을 대체하거나 충돌하려는 목적이 아님\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "• 예산 및 일정이 극도로 제한된 소규모 커스텀 프로젝트에 경량 엔진으로 선투입\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "• 자잘한 현장 요구로 본사 표준 R&D 리소스가 분산되는 현상을 효과적으로 방어", options: { fontSize: 10.5, color: "475569" } }
  ], {
    x: 4.8, y: 1.7, w: 3.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 15, 20, 15],
    fontFace: FONT_FAMILY
  });
  
  // Card 3: Pre-sales Asset
  slide.addText([
    { text: "Pre-sales 경쟁력 확보 (MVP)\n\n", options: { bold: true, fontSize: 13, color: "0F172A" } },
    { text: "• 대기 인력의 가용 리소스를 활용하여 회사의 재사용 가능한 공통 자산을 적극 내재화\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "• 제안 및 영업 단계에서 신속한 데모 시연 및 현장 특화 커스터마이징 가능\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "• MVP 수준의 결과물을 세일즈 시 데모 환경으로 활용하여 수주 제안 성공률 제고", options: { fontSize: 10.5, color: "475569" } }
  ], {
    x: 9.0, y: 1.7, w: 3.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 15, 20, 15],
    fontFace: FONT_FAMILY
  });
}

// ==========================================
// SLIDE 4: BXUI 대비 포지셔닝 및 차별성 (Light Theme)
// ==========================================
{
  let slide = pptx.addSlide();
  slide.background = { color: 'F8FAFC' };
  
  addHeaderAndFooter(
    slide,
    "03. BXUI 대비 포지셔닝 및 차별성",
    "비용과 기민성, 타깃 시장 포지셔닝에 따른 차별성으로 상호 보완적 이원화 전략 수행",
    4
  );
  
  // Table columns widths (Total: 12.13)
  const colW = [2.2, 4.96, 4.96];
  
  const headerOptions = { bold: true, color: "FFFFFF", fill: { color: "1E293B" }, align: "center", valign: "middle", fontFace: FONT_FAMILY, fontSize: 11 };
  const sideHeaderOptions = { bold: true, color: "0F172A", fill: { color: "F1F5F9" }, align: "center", valign: "middle", fontFace: FONT_FAMILY, fontSize: 11 };
  
  const bodyTextOptions = { fontSize: 10, color: "334155", fontFace: FONT_FAMILY, margin: 8, valign: "middle" };
  
  const tableData = [
    // Header Row
    [
      { text: "구분", options: headerOptions },
      { text: "BXUI (기제품)", options: headerOptions },
      { text: "채널 파운데이션 (신규)", options: headerOptions }
    ],
    // Row 1
    [
      { text: "비용 구조", options: sideHeaderOptions },
      {
        text: [
          { text: "• 라이선스 비용 및 추가 프로젝트 비용 수반\n", options: { bold: true } },
          { text: "• 예산이 부족한 중소형 현장 프로젝트에서는 채택이 불가능함" }
        ],
        options: bodyTextOptions
      },
      {
        text: [
          { text: "• 추가 라이선스 비용 없이 즉시 투입 가능\n", options: { bold: true, color: "2563EB" } },
          { text: "• 저예산 소규모 현장의 비용 장벽을 완벽히 해결" }
        ],
        options: bodyTextOptions
      }
    ],
    // Row 2
    [
      { text: "현장 기민성", options: sideHeaderOptions },
      {
        text: [
          { text: "• 표준 패키지 관리 정책으로 기민한 대응 한계\n", options: { bold: true } },
          { text: "• 현장 맞춤형 긴급 변경 및 즉각 배포가 구조적으로 어려움" }
        ],
        options: bodyTextOptions
      },
      {
        text: [
          { text: "• 현장 개발자가 즉각 수정 가능한 오픈 뼈대\n", options: { bold: true, color: "2563EB" } },
          { text: "• 고객 요구사항 실시간 반영 및 유연한 커스터마이징" }
        ],
        options: bodyTextOptions
      }
    ],
    // Row 3
    [
      { text: "포지셔닝", options: sideHeaderOptions },
      {
        text: [
          { text: "• 완성형 '제품(Product)' 판매 모델\n", options: { bold: true } },
          { text: "• 독립적인 솔루션 패키지 비즈니스" }
        ],
        options: bodyTextOptions
      },
      {
        text: [
          { text: "• 프로젝트 성공률을 높이기 위한 '개발 도구'\n", options: { bold: true, color: "2563EB" } },
          { text: "• 초기 착수 속도 단축을 돕는 Starter Kit 역할" }
        ],
        options: bodyTextOptions
      }
    ]
  ];
  
  // Add Table
  slide.addTable(tableData, {
    x: 0.6, y: 1.7, w: 12.13, h: 3.8,
    colW: colW,
    border: { type: "solid", color: "CBD5E1", width: 1 }
  });
  
  // Summary Callout Box at the bottom
  slide.addText([
    { text: "💡 이원화 전략: ", options: { bold: true, color: "1E40AF" } },
    { text: "본사 주도의 대형 표준 사업은 완성형 제품인 'BXUI'가 주도하고, 비용과 실시간 커스터마이징이 핵심인 애자일 현장형 사업에는 오픈 뼈대인 '채널 파운데이션'를 선제적으로 매핑하여 프로젝트 리스크를 분산합니다.", options: { color: "1E40AF" } }
  ], {
    x: 0.6, y: 5.7, w: 12.13, h: 0.9,
    fill: { color: "EFF6FF" }, // light blue
    line: { color: "BFDBFE", width: 1 },
    valign: "middle",
    align: "left",
    margin: [10, 15, 10, 15],
    fontFace: FONT_FAMILY,
    fontSize: 10.5
  });
}

// ==========================================
// SLIDE 5: 개발 계획 및 상세 마일스톤 (Light Theme)
// ==========================================
{
  let slide = pptx.addSlide();
  slide.background = { color: 'F8FAFC' };
  
  addHeaderAndFooter(
    slide,
    "04. 1단계 개발 계획 및 마일스톤",
    "총 2명의 인원으로 3개월 동안 비즈니스 로직을 제외한 공통 코어 아키텍처 및 템플릿 개발",
    5
  );
  
  // 1 Month Card
  slide.addText([
    { text: "1개월차: 기반 아키텍처 세팅\n\n", options: { bold: true, fontSize: 13, color: "4F46E5" } },
    { text: "■ 모노레포 구조 설계 및 공통 패키지(@bx/shared) 세팅\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "■ 빌드 시스템, 패키지 번들러 구성 및 CI/CD 배포 파이프라인 검증\n\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "주요 산출물:\n", options: { bold: true, fontSize: 10.5, color: "0F172A" } },
    { text: "- 공통 뼈대 아키텍처 설계서\n- 기본 모노레포 소스코드", options: { fontSize: 10, color: "4F46E5", bold: true } }
  ], {
    x: 0.6, y: 1.7, w: 3.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 15, 20, 15],
    fontFace: FONT_FAMILY
  });
  
  // 2 Month Card
  slide.addText([
    { text: "2개월차: 코어 인프라 구현\n\n", options: { bold: true, fontSize: 13, color: "4F46E5" } },
    { text: "■ Envelope 처리 및 공통 통신 모듈(HTTP Client) 개발\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "■ JWT Auto-refresh 등 표준 보안/인증 토큰 갱신 로직 구현 및 라우팅 설계\n\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "주요 산출물:\n", options: { bold: true, fontSize: 10.5, color: "0F172A" } },
    { text: "- API 통신/보안 인증 코어 모듈\n- 공통 UI 레이아웃 뼈대", options: { fontSize: 10, color: "4F46E5", bold: true } }
  ], {
    x: 4.8, y: 1.7, w: 3.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 15, 20, 15],
    fontFace: FONT_FAMILY
  });
  
  // 3 Month Card
  slide.addText([
    { text: "3개월차: 템플릿 검증 & 문서화\n\n", options: { bold: true, fontSize: 13, color: "4F46E5" } },
    { text: "■ PC·Mobile·Admin 스켈레톤(Skeleton) 앱 연동 및 안정성 검증\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "■ 개발자 가이드 문서화 및 스타터 패키지 공식 릴리즈\n\n\n", options: { fontSize: 10.5, color: "475569" } },
    { text: "주요 산출물:\n", options: { bold: true, fontSize: 10.5, color: "0F172A" } },
    { text: "- 3대 채널 스타터 템플릿 세트\n- 표준 개발 가이드 문서", options: { fontSize: 10, color: "4F46E5", bold: true } }
  ], {
    x: 9.0, y: 1.7, w: 3.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 15, 20, 15],
    fontFace: FONT_FAMILY
  });
}

// ==========================================
// SLIDE 6: 기대 효과 및 향후 로드맵 (Light Theme)
// ==========================================
{
  let slide = pptx.addSlide();
  slide.background = { color: 'F8FAFC' };
  
  addHeaderAndFooter(
    slide,
    "05. 기대 효과 및 향후 로드맵",
    "초기 구축 공수 단축과 AI 기술력 내재화로 비즈니스 생산성을 확보하고 파생 사업으로의 연속적 확장",
    6
  );
  
  // Left Card: Expected Benefits
  slide.addText([
    { text: "기대 효과 및 가치 극대화\n\n", options: { bold: true, fontSize: 14, color: "0F172A" } },
    
    { text: "1. 초기 인프라 셋업 리소스 감소\n", options: { bold: true, fontSize: 11, color: "1E3A8A" } },
    { text: "• 신규 프로젝트 착수 시 백엔드/프론트엔드 공통 모듈 구성 시간 및 초기 시행착오 비용을 획기적으로 차단\n\n", options: { fontSize: 10.5, color: "475569" } },
    
    { text: "2. 품질 표준화 및 안정성 확보\n", options: { bold: true, fontSize: 11, color: "1E3A8A" } },
    { text: "• 검증된 공통 API Envelope 처리, JWT 인증 흐름 사용으로 아키텍처 결함 및 보안 취약점 사전 방지\n\n", options: { fontSize: 10.5, color: "475569" } },
    
    { text: "3. AI 활용 생산성 향상 경험 자산화\n", options: { bold: true, fontSize: 11, color: "1E3A8A" } },
    { text: "• 최신 AX(Agentic AI) 개발 도구를 적용한 고속 개발 노하우를 조직 자산으로 축적하여 향후 개발 트렌드 선도", options: { fontSize: 10.5, color: "475569" } }
  ], {
    x: 0.6, y: 1.7, w: 5.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 20, 20, 20],
    fontFace: FONT_FAMILY
  });
  
  // Right Card: Future Roadmap
  slide.addText([
    { text: "1단계 완료 이후의 확장 계획\n\n", options: { bold: true, fontSize: 14, color: "0F172A" } },
    
    { text: "■ 1단계 (Core Standard) : 3개월 간 경량 뼈대 완성\n", options: { bold: true, fontSize: 11, color: "4F46E5" } },
    { text: "• BE/FE 통신 모듈, 공통 보안인증, PC·모바일·어드민 스켈레톤 스타터 킷 확보 및 안정적 배포 체계 마련\n\n", options: { fontSize: 10.5, color: "475569" } },
    
    { text: "■ 2단계 (Solution Extension) : 파생 모듈 개발\n", options: { bold: true, fontSize: 11, color: "4F46E5" } },
    { text: "• 완성된 뼈대 위에서 실시간 채널 상태 모니터링/관제 및 운영 지원을 제공하는 '채널 헬스-체커(Channel Health Checker)' 등 독립 파생 솔루션 구축 진행\n\n", options: { fontSize: 10.5, color: "475569" } },
    
    { text: "■ 시너지 모델 구축\n", options: { bold: true, fontSize: 11, color: "4F46E5" } },
    { text: "• 뼈대 아키텍처 위에 마일스톤 형태로 파생 프로젝트를 애자일하게 추가하여 지속적인 세일즈 기회와 추가 영업 모멘텀 창출", options: { fontSize: 10.5, color: "475569" } }
  ], {
    x: 6.9, y: 1.7, w: 5.8, h: 5.0,
    fill: { color: "FFFFFF" },
    line: { color: "E2E8F0", width: 1 },
    valign: "top",
    margin: [20, 20, 20, 20],
    fontFace: FONT_FAMILY
  });
}

// Save the Presentation
const OUTPUT_FILE = 'google_채널_파운데이션_개발_기획.pptx';
pptx.writeFile({ fileName: OUTPUT_FILE })
  .then(name => {
    console.log(`Success: PowerPoint presentation generated as: ${name}`);
  })
  .catch(err => {
    console.error(`Error generating PowerPoint:`, err);
  });
