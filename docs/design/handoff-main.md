# LOOOGOO 메인 페이지 — 퍼블리셔 핸드오프 스펙

> 출처: `docs/design/LOOOGOO-source.html` (Google Stitch export, Tailwind 기반)
> 대상: publisher 에이전트 (React 19 + Next.js 15 App Router + SASS)
> 토큰: `src/styles/tokens.scss` (CSS 변수). **Tailwind 절대 금지, 하드코딩 금지 — 토큰 참조.**
> 테마: **항상 다크 단일 테마** (라이트 분기 없음).

---

## 0. 전역 규칙 (Global)

### 0-1. 폰트 로드 (구현 방법 명시만, 코드는 퍼블리셔가)

- 제목: **Libre Caslon Text** (400/700, italic 사용) → 토큰 `--font-display`
- 본문: **Hanken Grotesk** (300/400/500/600/700/900) → 토큰 `--font-body`
- 아이콘: **Material Symbols Outlined** → 토큰 `--font-icon`
- 권장: `next/font/google` 로 Libre Caslon Text / Hanken Grotesk 로드 후 CSS 변수(`--font-display`, `--font-body`)에 연결. Material Symbols 는 next/font 미지원 케이스가 많으므로 `app/layout.tsx` 의 `<link>` 또는 `globals.scss` `@import url(...)` 로 로드.
  - Material Symbols 폰트 세팅: `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;`
- 아이콘 사용 시 `.material-symbols-outlined` 유틸 클래스(또는 컴포넌트)로 감싸고, 아이콘은 장식이면 `aria-hidden="true"`.

### 0-2. body / 전역 스타일 (`globals.scss` 또는 `app/layout.tsx`)

- `background: var(--color-background)`, `color: var(--color-on-surface)`, `overflow-x: hidden`.
- **노이즈 텍스처 오버레이(장식)**: `body::before` 로 재현. `position: fixed; inset:0; pointer-events:none; z-index:9999; opacity: var(--noise-opacity)`. 원본은 외부 transparenttextures p6.png 사용 → 외부 의존 피하려면 로컬 노이즈 PNG(`/images/`) 또는 SVG data-uri 사용 권장. **없으면 생략 가능**(장식).
- **커스텀 스크롤바**: `::-webkit-scrollbar { width:6px; height:6px }`, track `var(--scrollbar-track)`, thumb `var(--scrollbar-thumb)` radius 10px.
- `.no-scrollbar` 유틸: 가로 스크롤 영역에서 스크롤바 숨김(`scrollbar-width:none`, `::-webkit-scrollbar{display:none}`).

### 0-3. 레이아웃 컨테이너

- 최대 폭 `var(--container-max)` = 1280px, 가운데 정렬(`margin-inline:auto`).
- 좌우 패딩: 모바일 `var(--space-md)`(24px), 데스크톱(`lg` 이상) `var(--space-xl)`(80px).
- **공용 `Container` 컴포넌트 권장** — 위 규칙을 한 곳에서 관리(반복 패딩 방지).

### 0-4. 반응형 브레이크포인트 (원본 Tailwind 기준)

| 이름 | 최소폭 | 용도                                          |
| ---- | ------ | --------------------------------------------- |
| `md` | 768px  | 데스크톱 메뉴 노출, 그리드 다열화 시작        |
| `lg` | 1024px | 컨테이너 패딩 80px, LOGIN 노출, 12컬럼 그리드 |

- SCSS 에서 `@media (min-width: 768px)` / `(min-width: 1024px)` 로 구현. mixin(`respond-md`, `respond-lg`)으로 중복 최소화 권장.

### 0-5. 공통 접근성

- 랜드마크: `<header>`, `<main>`, `<footer>`, 섹션은 `<section>` + 각 섹션에 시각적 제목(`<h2>`)을 aria로 연결(`aria-labelledby`).
- 모든 `<img>`: 의미 있는 `alt` 필수(아래 각 컴포넌트에 값 명시). 순수 장식 배경 이미지는 CSS background 또는 `alt=""`.
- 아이콘 전용 버튼(search, add, arrow)은 `aria-label` 제공.
- hover 로만 노출되는 텍스트(장르 설명 등)는 DOM 에 항상 존재시키고 시각적으로만 접힘 처리(스크린리더 접근성 유지). `display:none` 대신 `max-height`/`opacity` 사용.

---

## 1. Header (`src/components/Header/`)

고정 상단바.

- 태그: `<header>` fixed, `top:0`, `width:100%`, `z-index:50`, 하단 보더 `1px var(--color-hairline)`.
- 배경: glass. 실제로는 `::before` 또는 내부 절대배치 레이어에 `background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)); border` + `opacity:0.8`. (꾸밈은 가상선택자 규칙 준수 → `header::before` 로 glass 레이어 구현 권장)
- 내부: `Container` 로 flex, `justify-content:space-between; align-items:center`, 세로 패딩 20px.
- **로고**: `<img src="/images/logo.png" alt="LOOOGOO" />` height 40px, width auto. 홈 링크(`<a href="/">` 또는 `next/link`)로 감싸기.
- **데스크톱 메뉴**(`<nav>`, `md` 미만 `display:none`): 항목 gap 40px, `letter-spacing: var(--letter-spacing-wide)`, 폰트 `--font-body` size `--font-size-label`.
  - `MUSICAL` = 활성: `color: var(--color-primary)`, 밑줄 `::after`(`bottom:-8px; height:1px; width:100%; background: var(--color-primary)`).
  - `PLAY` / `CONCERT` / `EXHIBIT` = 기본 `var(--color-on-surface-variant)`, hover `var(--color-primary)`.
- **우측 액션** flex gap 24px:
  - search 아이콘 버튼(`aria-label="검색"`), 기본 `--color-on-surface`, hover primary.
  - 세로 구분선: `width:1px; height:16px; background: var(--color-hairline-strong)`.
  - `LOGIN` 텍스트 버튼: `lg` 미만 `display:none`. 색 `--color-on-surface-variant`, hover primary.
  - `MY TICKET` 버튼: 배경 `--color-primary-container`, 텍스트 `--color-on-primary-container`, `border-radius: var(--radius-full)`, 패딩 8px 24px, `:active { transform: scale(.95) }`.

### Props

```ts
interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}
interface HeaderProps {
  navItems?: NavItem[]; // 기본값: MUSICAL(active)/PLAY/CONCERT/EXHIBIT
}
```

- 데이터가 고정이면 컴포넌트 내부 상수로 두고 props 생략 가능. 재사용/확장 대비 위 타입 권장.

### 반응형

- `< md`: `<nav>` 숨김(모바일 메뉴 토글은 기획서에 없음 → 미구현, 아래 "확인 필요" 참고).
- `< lg`: LOGIN 숨김.

### 접근성

- `<header>` + `<nav aria-label="주 메뉴">`. 활성 항목 `aria-current="page"`.

---

## 2. Hero (`src/components/Hero/`)

- 태그: `<section>` relative, `height:800px; max-height:90vh`, `overflow:hidden`, flex `align-items:center`.
- **배경 이미지**: `/images/hero-phantom.jpg`, 절대배치 `inset:0`, `object-fit:cover`. `alt` = "The Phantom of the Opera 무대 장면". (장식 성격이면 CSS background 로 처리해도 되나, 원본은 `<img>` 사용)
- **scrim 오버레이**: 이미지 위 절대배치 레이어 `background: var(--hero-scrim)`, `z-index` 로 이미지보다 위/콘텐츠보다 아래.
- **콘텐츠**(`Container`, `z-index:20`, `max-width: 48rem`(3xl) 좌측 정렬, gap 24px):
  1. **라벨 줄**: flex align-center gap 12px. 앞 짧은 가로선 `width:32px; height:1px; background: var(--color-primary)`. 텍스트 "Now Playing — Charlotte Theater" `color: var(--color-primary)`, `--font-size-label`(12px), `letter-spacing: var(--letter-spacing-hero)`(0.3em), `text-transform:uppercase`.
  2. **대형 제목** `<h1>`: `--font-display`, italic, `font-weight:700`, `--font-size-hero`(72px), `line-height:0.95`, `color: var(--color-white)`, `text-shadow: var(--text-glow)`. 2줄 구성:
     - 1줄: `THE PHANTOM`
     - 2줄: `OF THE OPERA` — 좌측 들여쓰기 `padding-left:64px`(원본 pl-16).
     - 줄바꿈은 `<br>` 대신 2개의 `<span>` 블록 권장(반응형/의미 유지). 스크린리더용으로는 자연스러운 한 문장으로 읽히게.
  3. **설명문** `<p>`: `--font-body`, `color: var(--color-on-surface-variant)`(약 90% opacity), `max-width: 32rem`, `line-height` 여유, **좌측 보더** `border-left: 2px solid` (primary 30% → `rgba(200,191,255,0.3)`; 토큰 `--btn-glass-border` 재사용 가능), `padding-left:24px`, 세로 margin 16px.
     - 문구: "가면 속에 숨겨진 전설적인 사랑 이야기. 샤롯데씨어터에서 펼쳐지는 황홀한 고딕 로맨스의 정수를 경험하세요. 세계적인 제작진이 선보이는 압도적인 무대 메커니즘을 만나보실 수 있습니다."
  4. **버튼 2개** flex gap 20px, 패딩 16px 48px, `border-radius: var(--radius-full)`:
     - `Book Now`(primary): 배경 `--color-primary-container`, 텍스트 white, `box-shadow: var(--shadow-primary)`, hover 배경 `--color-inverse-primary`, `:active scale(.95)`.
     - `Learn More`(glass): `background: var(--btn-glass-bg)`, `backdrop-filter: blur(var(--btn-glass-blur))`, `border:1px solid var(--btn-glass-border)`, `box-shadow: var(--btn-glass-shadow)`. hover: bg `--btn-glass-bg-hover`, border `--btn-glass-border-hover`, shadow `--btn-glass-shadow-hover`.
- **SCROLL 인디케이터**: 절대배치 하단 중앙(`bottom:40px; left:50%; translateX(-50%)`), `opacity:0.5`, 세로 flex gap 16px. 텍스트 "SCROLL" `--font-size-scroll`(10px) `letter-spacing: var(--letter-spacing-wide)`. 아래 세로 라인 `width:1px; height:48px; background: linear-gradient(to bottom, var(--color-primary), transparent)`.
- Hero 하단에는 **섹션 전환 블러**(`.section-transition-blur` 대체): height 150px, `background: var(--section-transition)`, `margin-top:-150px`, `z-index:10`. Hero 와 Ranking 사이 배치. (별도 요소 또는 Ranking `::before`)

### Props

```ts
interface HeroProps {
  label: string; // "Now Playing — Charlotte Theater"
  titleLines: [string, string]; // ["THE PHANTOM", "OF THE OPERA"]
  description: string;
  primaryCta: { label: string; href: string }; // Book Now
  secondaryCta: { label: string; href: string }; // Learn More
  image: { src: string; alt: string };
}
```

- 고정 콘텐츠면 내부 상수화 가능. 향후 "Now Playing" 교체 대비 props 권장.

### 반응형

- 제목 72px 는 모바일에서 과대 → 원본은 동일 72px 유지. 모바일 가독성 위해 `clamp(40px, 12vw, 72px)` 적용 제안(원본과 차이, 아래 "확인 필요" 참고).
- 설명문 `max-width` 는 모바일에서 컨테이너 폭 따름.

### 접근성

- 하나의 `<h1>` 만 존재(페이지 대표 제목). scrim/글로우는 장식.

---

## 3. RankingSection (`src/components/RankingSection/`) + `RankCard`

- 태그: `<section>` relative, 세로 패딩 96px, 배경 `var(--color-background)`.
- **glow accent 장식**: 절대배치 요소(`width:400px;height:400px;background:var(--glow-accent);filter:blur(60px);border-radius:50%`) 좌상단(`top:-160px;left:-160px`). `pointer-events:none`. → `section::before` 로 구현 권장.
- **헤더 영역**(`Container`, 하단 margin 80px): flex `justify-content:space-between; align-items:center`.
  - 좌측: `<h2>` "WEEKLY TOP 10" — `--font-display`, `--font-size-section`(48px), color white, 옆에 짧은 라인 `width:48px;height:1px;background: var(--color-hairline-20)`. 아래 `<p>` "이번 주 가장 사랑받은 화제의 공연 랭킹" `color: var(--color-on-surface-variant)`, `letter-spacing: var(--letter-spacing-wide)`, `font-weight:300`.
  - 우측: `VIEW ALL` 버튼(group) — 텍스트 primary + 원형 화살표. 원 `width:32px;height:32px;border-radius:full;border:1px solid rgba(200,191,255,0.3)`, hover 시 배경 primary + 아이콘색 `--color-on-primary`. 아이콘 `arrow_forward`. `aria-label="전체 랭킹 보기"`.
- **카드 리스트**: 가로 스크롤 컨테이너 `.no-scrollbar`, `overflow-x:auto`, flex gap 48px, 세로 패딩 48px, 좌우 패딩은 컨테이너 규칙(24/80). `align-items:center`.
  - **지그재그 배치**: 홀수(1,3번째) 카드 `margin-top:64px`, hover `translateY(-16px)`. 짝수(2,4번째) 카드 `margin-top:-64px`, hover `translateY(16px)`. → RankCard 에 `offset: 'down' | 'up'` prop 으로 제어.
  - 원본의 `horizontal-scroll-mask`(좌우 페이드 마스크)를 리스트 컨테이너에 적용 가능: `mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent)`. (선택, 장식)

### `RankCard` (재사용)

- 폭 280px 고정(`flex-shrink:0`). group hover.
- **배경 랭킹 숫자**: 절대배치(`top:-64px; left:-32px`), `--font-display` italic, `--font-size-rank-number`(180px), `color: var(--color-primary)`, `opacity:0.08`, `line-height:0.8`, `pointer-events:none`. (`ranking-number` 재현) → `::before` 로 구현하고 `content: attr(data-rank)` 활용 가능.
- **프레임**: `border-radius: var(--radius-lg)`, `overflow:hidden`, `border:1px solid var(--color-hairline)`, 배경 `var(--color-surface-container-low)`, 패딩 12px, `box-shadow: var(--shadow-card)`.
- **포스터**: `aspect-ratio: 2/3`, `overflow:hidden`, `border-radius: var(--radius-default)`. `<img>` `object-fit:cover`, group-hover `scale(1.1)` transition 700ms.
- **본문**(패딩 8px, 상단 margin 16px):
  - `<h3>` 제목: `--font-display`, `--font-size-card-title`(22px), color white, group-hover primary.
  - 하단 flex `justify-content:space-between`: 좌 "장르 | 장소" `--font-size-label-xs`(11px) `--color-on-surface-variant`, 우 퍼센트 `--font-size-label-xs` `--color-primary`.

```ts
interface RankItem {
  rank: string; // "01"
  title: string;
  genre: string; // "MUSICAL"
  venue: string; // "BLUE SQUARE"
  percent: string; // "8.5%"
  image: { src: string; alt: string };
  offset: "up" | "down"; // 지그재그
}
interface RankingSectionProps {
  items: RankItem[];
  viewAllHref: string;
}
```

**데이터 (4개, alt 는 "<제목> 공연 포스터")**
| rank | title | genre \| venue | percent | image | offset |
|------|-------|----------------|---------|-------|--------|
| 01 | Wicked | MUSICAL \| BLUE SQUARE | 8.5% | /images/rank-01-wicked.jpg | down |
| 02 | Hamilton | MUSICAL \| SEJONG CENTER | 7.2% | /images/rank-02-hamilton.jpg | up |
| 03 | Les Misérables | MUSICAL \| HANNAM HALL | 6.9% | /images/rank-03-lesmiserables.jpg | down |
| 04 | The Play | PLAY \| SEOUL ARTS CENTER | 5.5% | /images/rank-04-theplay.jpg | up |

### 접근성

- 가로 스크롤 영역은 키보드 접근 가능하게(`tabindex` 또는 포커스 가능한 카드 링크). 카드 전체를 `<a>`/`next/link` 로 감싸는 것을 권장.
- 배경 랭킹 숫자는 `aria-hidden`(장식) — 순위 정보는 제목/구조로 전달.

---

## 4. TicketOpen (`src/components/TicketOpen/`) + `TicketCard`

- 태그: `<section>` 배경 `var(--color-surface-container-lowest)`, 세로 패딩 96px, 상하 보더 `1px var(--color-hairline)`.
- glow accent 장식(우하단, `opacity:0.5`) — `section::before` 권장.
- **헤더**(`Container`, 하단 margin 64px): flex align-center gap 24px.
  - `<h2>` "Ticket Open" `--font-display`, `--font-size-section-sm`(36px), color white, `text-transform:uppercase`, `letter-spacing: var(--letter-spacing-tight)`.
  - 이어지는 그라디언트 라인: `flex-grow:1; height:1px; background: linear-gradient(to right, rgba(200,191,255,0.3), transparent)`.
- **그리드**: `grid`, 모바일 1열 / `md` 2열, gap 40px.

### `TicketCard` (재사용)

- group, flex gap 32px, 패딩 4px.
- **포스터**: `width:128px; height:176px`(w128 h176), `border-radius: var(--radius-default)`, `overflow:hidden`, `box-shadow`(md), group-hover `scale(1.05)`. `<img>` cover. `alt`="<제목> 포스터".
- **본문**(flex column, 세로 가운데):
  - **뱃지 + 날짜 줄**(flex gap 12px, 하단 margin 12px):
    - D-day 뱃지: pill(`border-radius:full`), 패딩 2px 12px, `--font-size-scroll`~11px, `letter-spacing: var(--letter-spacing-wide)`.
      - `tone='primary'`(D-3): 배경 `rgba(200,191,255,0.2)`(primary/20), 텍스트 `var(--color-primary)`, 보더 `var(--btn-glass-border)`.
      - `tone='tertiary'`(D-7): 배경 `rgba(199,196,217,0.2)`(tertiary/20), 텍스트 `var(--color-tertiary)`, 보더 tertiary 30%.
    - 날짜: `calendar_today` 아이콘(14px) + 텍스트, `--color-on-surface-variant`, `opacity:0.6`, `--font-size-label-xs`.
  - `<h4>`(또는 `<h3>`) 제목: `--font-display`, `--font-size-ticket-title`(24px), white, group-hover primary. 하단 margin 8px.
  - `<p>` 설명: `--font-body`, `--font-size-body`(14px), `--color-on-surface-variant`, 하단 margin 16px.
  - `SET REMINDER` 링크 버튼: `width:fit-content`, 11px, `letter-spacing: var(--letter-spacing-wide)`, `color: var(--color-primary)`, 하단 보더 `1px rgba(200,191,255,0.2)` hover 시 solid primary.

```ts
type BadgeTone = "primary" | "tertiary";
interface TicketItem {
  badge: string; // "D-3"
  badgeTone: BadgeTone;
  datetime: string; // "2026.11.20 14:00"
  title: string;
  description: string;
  image: { src: string; alt: string };
  reminderHref?: string;
}
interface TicketOpenProps {
  items: TicketItem[];
}
```

**데이터 (2개)**
| badge(tone) | datetime | title | description | image |
|-------------|----------|-------|-------------|-------|
| D-3 (primary) | 2026.11.20 14:00 | CHICAGO: The Musical | 열정적인 재즈와 매혹적인 퍼포먼스의 귀환. 브로드웨이 최장기 공연의 매력을 경험하세요. | /images/ticket-chicago.jpg |
| D-7 (tertiary) | 2026.11.24 10:00 | Beethoven Symphony No. 9 | 연말을 장식하는 장엄한 선율의 대서사시. 환희의 송가가 울려 퍼지는 감동의 순간. | /images/ticket-beethoven.jpg |

### 접근성

- 날짜 아이콘 `aria-hidden`. 날짜 텍스트는 그대로 읽히게. `SET REMINDER` 는 실제 동작 없으면 `<button>` 로 두고 후속 기능 연결.

---

## 5. GenreExplore (`src/components/GenreExplore/`) + `GenreCard`

- 태그: `<section>` `Container`, 세로 패딩 128px, `overflow:hidden`.
- **헤더**(가운데 정렬):
  - `<h2>` "EXPERIENCE THE STAGE" `--font-display`, `--font-size-section`(48px 근사, 원본 40px), italic, white, `letter-spacing: var(--letter-spacing-tight)`. (원본 40px 이므로 `--font-size-membership`(42px) 또는 별도 지정 — 아래 "확인 필요")
  - `<p>` "CHOOSE YOUR GENRE" `--color-on-surface-variant`, `letter-spacing: var(--letter-spacing-genre-sub)`(0.4em), 11px, `opacity:0.6`, 하단 margin 80px.
- **그리드**: 모바일 1열 / `md` 3열, gap 48px. **가운데 카드(Play)만 `md` 이상에서 `margin-top:48px`**(mt-12) 오프셋 → `offset` prop 제어.

### `GenreCard` (재사용)

- relative, `height:600px`, `border-radius: var(--radius-default)`, group, cursor pointer, `overflow:hidden`, `box-shadow`(2xl).
- **배경 이미지**: 절대 `inset:0`, cover, group-hover `scale(1.05)` transition 1000ms. `alt`="<장르> 장르 이미지".
- **하단 그라디언트**: 절대 `inset:0`, `background: linear-gradient(to top, var(--color-background), transparent)`, `opacity:0.9` → hover 1.
- **안쪽 얇은 보더**(장식): `::before` — 절대 `inset:16px`(m-4), `border:1px solid var(--color-hairline)`. (꾸밈 = 가상선택자 규칙 준수)
- **본문**(절대 하단, 패딩 40px, 전체폭):
  - 번호 `<span>`: `--font-size-scroll`(10px), primary, `letter-spacing: var(--letter-spacing-wide)`, 기본 `opacity:0` + `translateY(16px)`, group-hover `opacity:1; translateY(0)`.
  - `<h3>` 제목: `--font-display`, `--font-size-section`(48px), white, `line-height:1`, 하단 margin 16px.
  - **확장 밑줄**: `height:1px; width:0`, group-hover `width:100%`, `background: var(--color-primary)`, transition 700ms.
  - `<p>` 설명: 14px, `--color-on-surface-variant`. 기본 접힘(`max-height:0; opacity:0; overflow:hidden`), group-hover 펼침(`max-height:5rem; opacity:1`) transition 700ms. (DOM 유지 → 스크린리더 접근성)

```ts
interface GenreItem {
  number: string; // "01"
  title: string; // "Musical"
  description: string;
  image: { src: string; alt: string };
  offset?: boolean; // 가운데 카드 md 오프셋
  href: string;
}
interface GenreExploreProps {
  items: GenreItem[];
}
```

**데이터 (3개)**
| number | title | description | image | offset |
|--------|-------|-------------|-------|--------|
| 01 | Musical | 음악과 춤이 어우러진 화려한 감동의 무대를 확인하세요. | /images/genre-musical.jpg | false |
| 02 | Play | 배우들의 숨소리까지 느껴지는 깊이 있는 스토리텔링. | /images/genre-play.jpg | true |
| 03 | Concert | 전율이 느껴지는 사운드와 아티스트의 환상적인 라이브. | /images/genre-concert.jpg | false |

### 접근성

- 카드 전체를 `<a>`/`next/link` 로 감싸고 `aria-label="<장르> 공연 보기"`. hover 로만 보이는 설명도 DOM 존재.

---

## 6. NoticePromotion (`src/components/NoticePromotion/`)

- 태그: `<section>` `Container`, 하단 패딩 128px.
- **그리드**: 모바일 1열 / `lg` 12컬럼(`grid-template-columns: repeat(12, 1fr)`), gap 40px.

### 6-1. 멤버십 배너 (`lg` col-span-8)

- relative, `height:400px`, `border-radius: var(--radius-xl)`, `overflow:hidden`, glass(`--glass-bg`/`--glass-border`/blur), 보더는 primary 20% 톤 강조 가능. flex column center, 좌우 패딩 64px, group cursor pointer.
- 장식 발광: 우하단 큰 원 `background: rgba(106,90,205,0.1)` blur(100px), group-hover 강해짐 → `::after` 로 구현.
- 내용(`z-index:10`):
  - 라벨 줄: 짧은 라인 `width:40px;height:1px;background:primary` + "MEMBERSHIP ONLY" primary, 12px, `letter-spacing: var(--letter-spacing-label)`(0.2em).
  - `<h3>` "LOOOGOO / Gold Pass Membership": `--font-display`, `--font-size-membership`(42px), white, `line-height:1.15`. **"Gold Pass" 부분만 italic** `<span>` 처리. 줄바꿈은 반응형 고려해 `<span>` 블록 권장.
  - `<p>` "선예매 권한과 멤버십 전용 20% 할인을 가장 먼저 만나보세요." `--font-body`, `--font-size-body-lg`(18px), `--color-on-surface-variant`, max-width 28rem.
  - `JOIN NOW` 버튼: 배경 `var(--color-white)`, 텍스트 `var(--color-primary-container)`, pill, 패딩 16px 40px, hover `scale(1.05)` + shadow, `:active scale(.95)`.

### 6-2. NOTICE 패널 (`lg` col-span-4)

- glass, `border-radius: var(--radius-xl)`, 패딩 40px, flex column.
- 헤더: flex space-between, 하단 margin 40px.
  - `<h3>` "NOTICE" white, 16px(`--font-size-notice`), `letter-spacing: var(--letter-spacing-wide)`.
  - add 아이콘 버튼: 원형 `32px`, 보더 `--color-hairline-strong`, hover 배경 white + 아이콘 black. `aria-label="공지 더보기"`, 아이콘 `add`.
- 공지 리스트: 3건. 각 항목 group:
  - 날짜 `<span>`: primary, 10px, `letter-spacing: var(--letter-spacing-wide)`, `opacity:0.6`, 하단 margin 8px, block.
  - 제목 `<p>`: `--color-on-surface`, `font-weight:500`, group-hover primary, 하단 보더 `1px var(--color-hairline)` + 패딩.

```ts
interface NoticeItem {
  date: string; // "2026.11.15"
  title: string;
  href: string;
}
interface NoticePromotionProps {
  membership: {
    label: string; // "MEMBERSHIP ONLY"
    titleLead: string; // "LOOOGOO"
    titleItalic: string; // "Gold Pass"
    titleTail: string; // "Membership"
    description: string;
    cta: { label: string; href: string }; // JOIN NOW
  };
  notices: NoticeItem[];
}
```

**공지 데이터 (3건)**
| date | title |
|------|-------|
| 2026.11.15 | 시스템 정기 점검 안내 (11/25) |
| 2026.11.12 | 겨울 시즌 뮤지컬 조기예매 이벤트 |
| 2026.11.10 | 티켓 취소 및 환불 규정 변경 안내 |

### 접근성

- 공지 각 항목은 `<a>`/`next/link`. 멤버십 배너 전체가 클릭 가능하면 내부 링크 하나만 접근 가능하게(중첩 링크 금지) — CTA 버튼을 실제 링크로.

---

## 7. Footer (`src/components/Footer/`)

- 태그: `<footer>` 배경 `var(--color-footer-bg)`(#08080E), 상단 보더 `1px var(--color-hairline)`, 세로 패딩 80px, `overflow:hidden`.
- **상단 그리드**(`Container`): 모바일 1열 / `md` 12컬럼, gap 64px.
  - **브랜드 (col-span-4)**: 로고 `<img src="/images/logo.png" alt="LOOOGOO" height=48>`. 소개문 `<p>` "프리미엄 공연 예매 플랫폼 LOOOGOO. 공연의 감동을 가장 특별하게 전달합니다." `--font-body`, 14px, `--color-on-surface-variant`, `opacity:0.7`, max-width 20rem. 소셜 아이콘 2개: `public`, `share`(Material Symbols), 버튼 `aria-label` 각각 "웹사이트"/"공유".
  - **SERVICES (col-span-?)**: 제목 + 링크 Musical / Theater / Concert.
  - **SUPPORT**: 제목 + 링크 FAQ / Notice / Q&A.
  - **NEWSLETTER**: 제목 + 설명 "공연 오픈 소식을 가장 빠르게 받아보세요." + 이메일 input + 화살표 제출 버튼.
    - input: `type="email"`, `aria-label="이메일 주소"`, placeholder 권장. 하단 보더 스타일. 화살표 버튼 `arrow_forward`, `aria-label="구독"`.
  - 각 컬럼 제목: `--color-on-surface-variant` 또는 흐린 톤, `letter-spacing: var(--letter-spacing-wide)`, 소제목 크기 소형. 링크 hover primary.
- **하단바**(그리드 아래, 상단 보더 `--color-hairline`, 세로 패딩): flex space-between(모바일 column):
  - 좌: "© 2026 LOOOGOO ALL RIGHTS RESERVED." `--color-on-surface-variant`, 소형, `letter-spacing`.
  - 우: "Privacy Policy" · "Terms of Service" 링크(가운데 점 구분).

```ts
interface FooterLink {
  label: string;
  href: string;
}
interface FooterColumn {
  title: string;
  links: FooterLink[];
}
interface FooterProps {
  columns?: FooterColumn[]; // SERVICES / SUPPORT
  intro?: string;
  newsletterDesc?: string;
}
```

- 콘텐츠 고정이면 내부 상수화 가능.

### 반응형

- `< md`: 1열 스택. 하단바 세로 정렬.

### 접근성

- `<footer>` 랜드마크. 컬럼 제목은 `<h2>`/`<h3>`, 링크 목록은 `<ul>`. 뉴스레터는 `<form>` + label 연결.

---

## 8. 페이지 조립 (`src/app/page.tsx`)

순서: `Header` → `main`{ `Hero` → (전환 블러) → `RankingSection` → `TicketOpen` → `GenreExplore` → `NoticePromotion` } → `Footer`.

- `Header` 는 fixed 이므로 `main` 상단 여백 불필요(Hero 가 배경 전면). 단 fixed 헤더가 Hero 콘텐츠를 가리지 않는지 확인.
- 서버 컴포넌트로 렌더 가능(정적 콘텐츠). hover/스크롤 인터랙션은 CSS 로 처리하므로 대부분 `'use client'` 불필요. (search/뉴스레터 등 상태가 생기면 해당 컴포넌트만 client)

---

## 9. 토큰 사용 요약 (빠른 참조)

| 용도             | 토큰                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| 페이지 배경      | `--color-background`                                                     |
| Ticket Open 배경 | `--color-surface-container-lowest`                                       |
| 랭크 카드 프레임 | `--color-surface-container-low`                                          |
| 주요 버튼 배경   | `--color-primary-container` / 텍스트 `--color-on-primary-container`      |
| 버튼 hover       | `--color-inverse-primary`                                                |
| 강조 텍스트/라인 | `--color-primary`                                                        |
| 기본 텍스트      | `--color-on-surface` / 보조 `--color-on-surface-variant`                 |
| 구분선/보더      | `--color-hairline`, `--color-hairline-strong`, `--color-outline-variant` |
| Footer 배경      | `--color-footer-bg`                                                      |
| glass 패널       | `--glass-bg` / `--glass-border` / `--glass-blur`                         |
| glass 버튼       | `--btn-glass-*`                                                          |
| Hero 제목 글로우 | `--text-glow`                                                            |
| Hero scrim       | `--hero-scrim`                                                           |
| 섹션 발광        | `--glow-accent`                                                          |
| 제목 폰트        | `--font-display` / 본문 `--font-body` / 아이콘 `--font-icon`             |
| pill/뱃지        | `--radius-full`                                                          |
| 패널 radius      | `--radius-xl`                                                            |

---

## 10. 퍼블리셔 주의사항 (SCSS 컨벤션)

- **Tailwind 금지** — 위 모든 클래스는 SCSS 로 재작성. 하드코딩 색/폰트 금지, 토큰 변수 참조.
- **네스팅 최대 3depth**. 초과 시 셀렉터 평탄화.
- **꾸밈 요소는 `::before`/`::after`** — glass 레이어, glow accent, 안쪽 보더, 배경 랭킹 숫자, 노이즈 오버레이 등.
- **길이 값은 변수화 제외** 가능(컨벤션). 색/폰트/효과만 토큰. 반복 색은 이미 토큰화됨.
- 반응형은 `md`(768) / `lg`(1024) mixin 으로 통일.
- 이미지는 `next/image` 사용 시 `fill` + `object-fit` 조합 고려(Hero/포스터). LCP 대상(Hero)에는 `priority`.
