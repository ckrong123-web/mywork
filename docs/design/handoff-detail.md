# LOOOGOO 상세 페이지(`/list/[slug]`) — 퍼블리셔 핸드오프 스펙

> 출처: `docs/design/LOOOGOO-detail-source.html` (Google Stitch export, Tailwind 기반) — 사용자 확정 디자인.
> 대상: publisher 에이전트 (React 19 + Next.js 15 App Router + SASS) + frontend-engineer(데이터 필드 추가).
> 토큰: `src/styles/tokens.scss` (CSS 변수). **Tailwind 절대 금지, 하드코딩 금지 — 토큰 참조.**
> 테마: **항상 다크 단일 테마** (라이트 분기 없음).
> 데이터: `src/data/home.ts` 의 `LIST_ITEMS`(`ListItem` 판별 유니언), `getListItemBySlug(slug)`.

---

## 0. 목업 대비 처리 원칙 (매우 중요 — 데이터 갭 큼)

목업은 "The Phantom of the Opera" 단일 쇼 기준으로 **전부 하드코딩**돼 있고, 실제 데이터(RankItem/TicketItem/GenreItem)엔 러닝타임/관람연령/가격/시놉시스/캐스트/예매/지도 필드가 **하나도 없다.** 아래 원칙으로 처리한다.

1. **누락 데이터 = 포트폴리오용 플레이스홀더 콘텐츠로 채운다.** 실제 예매 백엔드가 없으므로 예매 위젯(캘린더/세션/좌석/Book Now)은 **시각적 UI 데모 + 로컬 상태(선택 표시)만**, 결제/서버 연동은 없다(§2-5). 캐스트/시놉시스/지도도 예시 콘텐츠로 채우되 **실존 인물·실제 전화번호처럼 보이지 않게** — 더미 배우명 + 가상 주소 톤 + "(예시)" 표기 + 명백한 더미 번호(`1588-0000`). §3에 6개 아이템 전부의 실제 채울 값을 표로 제공(frontend-engineer가 `home.ts`에 그대로 이식).
2. **kind별 템플릿 분기**:
   - **rank / ticket → "풍부한 상세" 템플릿**(§2, §3): 히어로 + 정보카드 + 시놉시스 + 캐스트 + 예매위젯 + 지도.
   - **genre → 간소 레이아웃**(§4): 풀블리드 히어로 + 카테고리명 + 설명. 캐스트/예매/지도 없음. 근거: Musical/Play/Concert 카테고리는 실제 공연이 아니라 러닝타임·좌석·지도가 의미 없음.
3. **ticket 의 venue 갭**: TicketItem 에는 `venue` 필드가 없다(리스트 핸드오프에서 확인). **결정: ticket top-level 에 `venue` 를 새로 추가하지 않고, 상세 전용 `detail.location.name`(placeholder)으로 히어로 venue 를 채운다.**
   - **근거**: (1) 목록 카드에는 ticket venue 가 불필요(리스트 §5-2에서 위치줄 생략 확정) → top-level 에 올리면 카드/타입이 불필요하게 오염됨. (2) venue 는 상세에서만 필요하고, 상세의 지도 섹션(주소/지하철/전화)과 같은 `location` 오브젝트에 함께 두는 게 응집도가 높음. → rank 도 hero venue 를 `detail.location.name`(정식 명칭)에서 읽어 일관 처리(기존 `venue` 축약 필드는 목록 카드용으로 유지).
   - 팀리드가 권장한 "ticket 에도 placeholder venue 추가"를 **위치만 `detail` 안으로** 조정해 반영한 것.
4. **Header/Footer/Container/Button/Icon 은 기존 공용 컴포넌트 재사용.** 목업의 간소 nav(LOOOGOO 로고만)·footer 마크업은 참고만 하고 구현하지 않는다.

---

## 1. 전역 규칙 & 페이지 구조

`docs/design/handoff-main.md` 0절 준수(폰트/Container/스크롤바 등). 이 페이지 특이사항:

- **브레이크포인트**: 기존 `md`(768)/`lg`(1024) mixin만 사용(sm/xl 미사용 — 리스트 페이지와 동일 정책).
- fixed `Header`(높이 `--header-height` 80px) 위에 히어로가 전면 배경으로 깔린다(히어로 콘텐츠 하단 정렬이라 헤더와 충돌 없음).
- 라우팅: `src/app/list/[slug]/page.tsx`(서버). `getListItemBySlug(slug)` → 없으면 `notFound()`. `generateStaticParams` 로 `LIST_ITEMS` slug 프리렌더 권장.

### 컴포넌트 트리

```
/list/[slug]  (src/app/list/[slug]/page.tsx — 서버 컴포넌트)
├─ <Header />                              ← 기존 재사용
├─ <main>
│  └─ <ListDetail item={item} />          ← kind 분기 (props: { item: ListItem })
│     ├─ kind rank|ticket → 풍부한 상세 (§2)
│     │   ├─ DetailHero          §2-1
│     │   ├─ (main 2단 그리드: lg 8 / 4)
│     │   │   ├─ 좌 8: InfoCards §2-2 / SynopsisSection §2-3 / CastSection §2-4
│     │   │   └─ 우 4: BookingWidget (sticky, 'use client') §2-5
│     │   └─ VenueSection        §2-6
│     └─ kind genre → GenreDetail (간소) §4
└─ <Footer />                              ← 기존 재사용
```

- `ListDetail` 자체는 서버 컴포넌트 가능. **예매 위젯(BookingWidget)만 `'use client'`**(세션/날짜 선택 로컬 상태). 공유/찜 버튼도 동작시키려면 해당 버튼만 client.

---

## 2. rank/ticket 공용 "풍부한 상세" 템플릿

모든 색/치수는 목업을 기존 토큰에 매핑(§6). 반복되는 어두운 유리 패널은 **`--glass-panel-bg` + `--glass-panel-blur` + 보더 `--color-hairline-strong`**(목업 `.glass-panel`).

### 2-1. DetailHero (풀블리드 히어로)

- 태그: `<header>`(상세 히어로) relative, `height: clamp(560px, 90vh, 921px)`(목업 921px), `overflow:hidden`, flex `align-items:flex-end`.
- **배경 레이어**(절대 `inset:0`, `z-index:0`):
  - 배경 이미지: `detail.heroImage`(가로형). 없으면 `item.image`(포스터) 재사용. `<Image fill sizes="100vw" priority style={{objectFit:'cover'}}>`. `alt = heroImage.alt`(예: "<제목> 공연 무대 장면").
  - **하단 mask 그라디언트**(꾸밈 `::after`): `background: linear-gradient(to top, var(--color-background) 0%, transparent 100%)`.
  - **좌측 side 그라디언트**(꾸밈, `md` 이상만): `background: linear-gradient(to right, var(--color-background) 0%, transparent 100%)`. (텍스트 가독성)
- **콘텐츠**(`Container`, `z-index:10`, `padding-bottom: var(--space-xl)`, flex column / `md` row `justify-content:space-between; align-items:flex-end`, gap `var(--space-xl)`):
  - 좌측 블록(`max-width: 42rem`):
    - **태그 라벨**: inline-flex gap `var(--space-xs)`, `color: var(--color-primary)`, 하단 margin `var(--space-sm)`. 아이콘 `verified`(18px, `aria-hidden`) + `detail.tagline`(예: "Masterpiece Performance") `--font-size-label`(12~14px), `text-transform:uppercase`, `letter-spacing: var(--letter-spacing-wide)`.
    - `<h1>` 제목(`item.title`): `--font-display`, **italic**, `font-size: clamp(40px, 8vw, 64px)`(목업 display-lg 64 / mobile 40), `line-height:1`, `color: var(--color-white)`, `text-shadow: var(--text-glow)`, 하단 margin `var(--space-md)`.
    - `<p>` 설명(`detail.heroDescription`): `--font-body`, `--font-size-body-lg`(18px), `color: var(--color-on-surface-variant)`, `max-width: 32rem`, 하단 margin `var(--space-lg)`.
    - **메타 행**(flex wrap gap `var(--space-md)` align-center):
      - Venue: 세로 flex — 라벨 "VENUE"(`--font-size-label-xs`, uppercase, `--color-on-surface-variant`) + 값 `detail.location.name`(`--font-size-ticket-title`~headline, `--color-on-surface`).
      - 세로 구분선(`md` 이상): `width:1px; height:40px; background: var(--color-outline-variant)` 30%.
      - Schedule: 라벨 "SCHEDULE" + 값 `detail.schedule`(예: "2026.12.05 — 2025.03.30").
  - 우측 액션 버튼 2개(flex gap `var(--space-md)`): 원형 `56px`, `--glass-panel`, `color: var(--color-primary)`, hover `background: var(--color-hairline-strong)`, `:active scale(.9)`. 아이콘 `share` / `favorite`. **`aria-label` "공유하기" / "찜하기"**. `Button variant="ghost"` 활용 가능(원형 아이콘 버튼). 실제 동작 없으면 시각적/로컬 토글만.

### 2-2. InfoCards (정보 카드 3개)

- 태그: `<section aria-label="공연 정보">`, `grid`, 모바일 1열 / `md` 3열, gap `var(--space-md)`.
- 카드 ×3: `--glass-panel`, 패딩 `var(--space-md)`, `border-radius: var(--radius-xl)`.
  - 아이콘(`--color-primary`, 하단 margin `var(--space-sm)`, `aria-hidden`) + `<h3>` 라벨(`--font-size-body`, `--color-on-surface-variant`) + `<p>` 값(`--font-size-body`, `--color-on-surface`).
    | 아이콘 | 라벨 | 값 필드 |
    |--------|------|---------|
    | `schedule` | 러닝타임 | `detail.runtime` |
    | `person` | 관람연령 | `detail.ageRating` |
    | `confirmation_number` | 티켓가격 | `detail.priceRange` |

### 2-3. SynopsisSection

- 태그: `<section aria-labelledby="synopsis-heading">`, 세로 gap `var(--space-lg)`.
- `<h2 id="synopsis-heading">` "Synopsis": `--font-display`, `--font-size-section-sm`(32~36px, 목업 headline-lg 32px), **italic**, 좌측 보더 `border-left: 4px solid var(--color-primary-container)`, `padding-left: var(--space-md)`.
- 이미지: `detail.synopsisImage`(16:9). 없으면 heroImage/poster 재사용. `border-radius: var(--radius-xl)`, `overflow:hidden`, `aspect-ratio: 16/9`, group-hover `scale(1.05)` 700ms. 하단 그라디언트 오버레이(`::after`, `from background`, opacity .6).
- 본문: `detail.synopsis`(문단 배열, 보통 2문단) → 각 `<p>`, `--font-body`, `--font-size-body-lg`, `color: var(--color-on-surface-variant)`, `line-height` 여유, 문단 간 gap `var(--space-md)`.

### 2-4. CastSection

- 태그: `<section aria-labelledby="cast-heading">`, 세로 gap `var(--space-lg)`.
- `<h2 id="cast-heading">` "Cast & Creatives": Synopsis 헤딩과 동일 스타일.
- 그리드: 모바일 2열 / `md` 4열, gap `var(--space-md)`. `detail.cast` 배열 렌더.
- **캐스트 카드 2종**:
  - **사진 있는 배우**(`cast[].image` 존재): 이미지 `aspect-ratio: 3/4`, `border-radius: var(--radius-xl)`, `overflow:hidden`, group-hover `scale(1.1)` 500ms + primary-container 20% 오버레이(`::after`, opacity 0→1). 하단 `<h4>` 이름(`--font-size-ticket-title`~headline-md 24px, `--color-on-surface`) + `<p>` 배역(`detail.role`, `--font-size-label-xs`, `--color-primary`, uppercase).
  - **사진 없는 크리에이티브**(`image` 없음, `bio` 존재): 같은 3:4 자리에 `--glass-panel` 박스로 대체 — 안에 `<h4>` 이름 + `<p>` 역할(role) + `<p>` `bio`(작게, `--color-on-surface-variant`). (목업 4번째 "작곡가 소개" 케이스)

### 2-5. BookingWidget (우측 sticky 예매 위젯) — `'use client'`

> **UI 데모. 실제 좌석 예매/결제 백엔드 없음.** 세션·날짜 선택은 로컬 state 로 "선택됨" 표시만.

- 컨테이너: `<aside class="lg:col-span-4">` 안 `sticky`, `top: calc(var(--header-height) + var(--space-md))`(≈104px), `--glass-panel`, `border-radius: var(--radius-xl)`, 패딩 `var(--space-lg)`, 세로 gap `var(--space-lg)`.
- **헤더 줄**: flex space-between baseline — `<h3>` "Booking Info"(`--font-size-ticket-title`, `--color-on-surface`) + 상태 배지 `detail.bookingStatus`(예: "Opening Soon"/"Booking Open") `--font-size-label-xs`, `color: var(--color-primary)`, 패딩 2px 8px, `border-radius: var(--radius-lg)`, `background: color-mix(in srgb, var(--color-primary-container) 10%, transparent)`. 아래 구분선 `1px` `--color-outline-variant` 30%.
- **Select Date(미니 캘린더)**: 라벨 "Select Date"(`--font-size-label-xs`, `--color-on-surface-variant`). 아래 `grid-cols-7` 날짜 버튼.
  - **데이터 없음** → 현재 월 기준 클라이언트 생성. 일부 날짜를 "예매 가능"으로 하이라이트하는 건 **컴포넌트 내부 로직/장식**(예: 오늘 이후 주말 강조)으로 처리 — 실제 회차 데이터 아님. 선택된 날짜: `background: var(--color-primary-container)`, `color: var(--color-white)`. 오늘: `--color-primary` 링. 비활성일: `--color-on-surface-variant` opacity 낮게. 키보드 접근 가능.
- **Session**: 라벨 "Session" + `detail.sessions` 버튼들(flex gap `var(--space-sm)`). 각 `flex:1`, 패딩 8px, `border-radius: var(--radius-lg)`.
  - 선택됨: `border:1px solid var(--color-primary)`, `color: var(--color-primary)`. 미선택: `border:1px solid var(--color-outline-variant)`, `color: var(--color-on-surface-variant)`, hover `border-color: color-mix(..primary 50%..)`. 단일 선택 상태(로컬).
- **좌석/가격 요약 박스**: `background: var(--color-surface-container-low)`, 패딩 `var(--space-md)`, `border-radius: var(--radius-xl)`, 세로 gap `var(--space-sm)`.
  - "Selected Seat" — 값(예시 고정 "A Section, Row 12", `--color-on-surface`). "Price" — 값(`--color-primary`, bold). **좌석은 데모용 고정 표시**(실 좌석맵 없음).
- **Book Now 버튼**: `Button variant="primary"` 풀폭, 패딩 `var(--space-md)`, `--font-size-ticket-title`, `border-radius: var(--radius-xl)`, `box-shadow` primary 20%, hover 글로우 `--btn-glass-shadow-hover`, `:active scale(.95)`. 텍스트 "Book Now" + `arrow_forward_ios` 아이콘. **클릭 시 실제 예매 없음** — 토스트/alert 또는 "준비 중" 처리(로컬).
- 하단 안내 `<p>`: `detail.bookingFee`(예: "※ 예매 수수료는 장당 1,000원입니다."), 중앙정렬, `--font-size-label-xs`, `--color-on-surface-variant`.

### 2-6. VenueSection (지도 섹션)

- 태그: `<section aria-labelledby="venue-heading">` 풀폭, `background: var(--color-surface-container-lowest)`, 세로 패딩 `var(--space-xl)`, 상단 margin `var(--space-xl)`.
- `Container` 안 `<h2 id="venue-heading">` "Venue Location"(Synopsis 헤딩 스타일, 하단 margin `var(--space-lg)`).
- 그리드: 모바일 1열 / `md` 3열(지도 2 / 정보 1), gap `var(--space-xl)`, `align-items:center`.
  - **지도 패널**(`md` col-span-2): `--glass-panel`, `border-radius: var(--radius-xl)`, `overflow:hidden`, `height:400px`, relative. 지도 이미지 `detail.location.map`(없으면 공용 placeholder `/images/detail/map-placeholder.jpg`), `object-fit:cover`, `filter:grayscale(1)`, `opacity:.6`. 중앙 핀: 원형 48px `--color-primary-container`, 아이콘 `location_on`(white), `animation: bounce`(장식, `prefers-reduced-motion` 존중). **실제 지도 API 연동 없음 — 정적 이미지 플레이스홀더**.
  - **정보 블록**: 세로 gap `var(--space-md)`.
    - `<h4>` `detail.location.name` + `<p>` `detail.location.address`(`--color-on-surface-variant`).
    - Subway 행: 아이콘 `directions_subway`(primary) + "Subway"(block, `--color-on-surface`) + `detail.location.subway`(`--color-on-surface-variant`).
    - Call 행: 아이콘 `call`(primary) + "Call" + `detail.location.phone`(더미).
    - "Get Directions" 버튼: `Button` 아웃라인풍(`border --color-outline-variant`, hover `border --color-primary`), 풀폭, `border-radius: var(--radius-lg)`. 실제 길찾기 링크 없으면 `#`/비활성.

---

## 3. 데이터: `ShowDetail` 스키마 + 예시 콘텐츠

> **스코프 조정(사용자 지시)**: 9개 아이템 전부의 콘텐츠 문구 표는 **작성하지 않는다**(팀리드가 직접 채워 frontend-engineer 에게 넘김). 여기서는 **필드 스키마**(§5 타입과 동일)와 **톤/형식 참고용 예시 1~2개**만 제공한다.

### 3-1. 채울 필드 목록 (스키마 요약 — 상세 타입은 §5)

`RankItem`/`TicketItem` 에 `detail?: ShowDetail` 추가. `ShowDetail` 이 담는 값:

- `tagline`(히어로 라벨) / `heroDescription`(히어로 설명문) / `schedule`(공연 기간 문자열)
- `runtime` / `ageRating` / `priceRange` (정보카드 3개)
- `synopsis: string[]`(문단 배열, 보통 2문단) + `synopsisImage?`
- `cast: CastMember[]`(배우 name/role/image, 사진 없는 크리에이티브는 image 생략 + `bio`)
- `sessions: string[]`(예매 위젯 세션 시간, 2~3개) / `bookingStatus` / `bookingFee`
- `location: { name, address, subway, phone, map? }`(지도 섹션 + 히어로 venue)
- `heroImage?`(가로형 히어로 배경, 없으면 `item.image` 폴백)

**작성 지침**: 모두 포트폴리오용 예시. 배우명·주소·전화는 **더미**(실존 인물/실번호 금지). 전화는 `1588-0000` 류, 주소는 "(예시)" 표기 권장. rank 는 기존 축약 `venue` 와 정합되게 `location.name` 을 정식 명칭으로. ticket 은 top-level venue 가 없으므로 `location.name` 이 유일한 venue 출처(§0-3).

### 3-2. 예시 콘텐츠 (톤/형식 참고용 — 대표 2개)

**예시 A — rank: `wicked` (Wicked, MUSICAL)**

```ts
detail: {
  tagline: "Blockbuster Musical",
  heroDescription:
    "초록 피부의 소녀 엘파바와 인기 많은 글린다, 두 마녀의 우정과 엇갈린 운명. 『오즈의 마법사』 뒤에 숨겨진 놀라운 이야기.",
  schedule: "2026.12.05 — 2025.03.30",
  runtime: "165분 (인터미션 20분 포함)",
  ageRating: "7세 이상 관람 가능",
  priceRange: "VIP 170,000 ~ B석 60,000",
  synopsis: [
    "마법 학교 시즈 대학에 입학한 엘파바는 초록빛 피부 탓에 외면받지만 남다른 마법 재능을 지녔습니다. 화려한 인기를 누리는 글린다와 룸메이트가 되며 둘은 예상치 못한 우정을 쌓아갑니다.",
    "오즈의 마법사의 진실을 알게 된 엘파바는 신념을 지키기 위해 '서쪽의 사악한 마녀'라는 오명을 감수합니다. 우정과 정의, 선택에 관한 감동의 대서사가 무대 위에 펼쳐집니다.",
  ],
  cast: [
    { name: "서하은", role: "Elphaba", image: { src: "/images/detail/wicked-cast-1.jpg", alt: "서하은 — Elphaba" } },
    { name: "김도연", role: "Glinda", image: { src: "/images/detail/wicked-cast-2.jpg", alt: "김도연 — Glinda" } },
    { name: "박시우", role: "Fiyero", image: { src: "/images/detail/wicked-cast-3.jpg", alt: "박시우 — Fiyero" } },
    { name: "이레인", role: "Music Director", bio: "국내외 대형 뮤지컬을 다수 지휘한 음악감독. 이번 프로덕션의 편곡과 오케스트라를 총괄합니다." },
  ],
  sessions: ["14:00", "19:30"],
  bookingStatus: "Booking Open",   // rank=상영 중
  bookingFee: "※ 예매 수수료는 장당 1,000원입니다.",
  location: {
    name: "블루스퀘어 신한카드홀",
    address: "서울 용산구 이태원로 294 (예시 주소)",
    subway: "6호선 한강진역 2번 출구 도보 5분",
    phone: "1588-0000 (예시)",
  },
}
```

**예시 B — ticket: `chicago-the-musical` (CHICAGO: The Musical)** — venue 없는 kind, `location.name` 으로 최초 제공

```ts
detail: {
  tagline: "Broadway Sensation",
  heroDescription: "재즈와 스캔들, 그리고 쇼비즈니스. 브로드웨이 최장기 공연 뮤지컬의 매혹적인 귀환.",
  schedule: "2026.12.20 — 2025.02.16",
  runtime: "150분 (인터미션 15분 포함)",
  ageRating: "만 14세 이상 관람 가능",
  priceRange: "VIP 160,000 ~ B석 60,000",
  synopsis: [
    "1920년대 시카고, 스타를 꿈꾸던 록시 하트는 우발적 살인으로 감옥에 갇힙니다. 그곳에서 화려한 스타 벨마 켈리를 만나 세간의 이목을 다투게 됩니다.",
    "언론과 재판마저 하나의 '쇼'가 되는 세상. 매혹적인 재즈 넘버와 관능적인 안무가 인간의 욕망과 위선을 날카롭게 풍자합니다.",
  ],
  cast: [
    { name: "유가은", role: "Roxie Hart", image: { src: "/images/detail/chicago-cast-1.jpg", alt: "유가은 — Roxie Hart" } },
    { name: "남지오", role: "Velma Kelly", image: { src: "/images/detail/chicago-cast-2.jpg", alt: "남지오 — Velma Kelly" } },
    { name: "표한결", role: "Billy Flynn", image: { src: "/images/detail/chicago-cast-3.jpg", alt: "표한결 — Billy Flynn" } },
    { name: "서린", role: "Choreographer", bio: "재즈 안무에 정통한 안무감독. 상징적인 군무 장면들을 재구성했습니다." },
  ],
  sessions: ["14:00", "19:30"],
  bookingStatus: "Opening Soon",   // ticket=오픈 예정
  bookingFee: "※ 예매 수수료는 장당 1,000원입니다.",
  location: {
    name: "디큐브 링크아트홀",
    address: "서울 구로구 경인로 662 (예시 주소)",
    subway: "1호선 신도림역 1번 출구 도보 3분",
    phone: "1588-0000 (예시)",
  },
}
```

- `bookingStatus` 톤 참고: rank → "Booking Open", ticket → "Opening Soon".
- 나머지 4개(hamilton / les-miserables / the-play / beethoven-symphony-no-9)는 위 형식으로 팀리드가 채운다. (genre 3개는 detail 없음 — §4)

### 3-3. 이미지 필드 (플레이스홀더 — 애셋 부담 최소화)

전용 애셋이 없으면 아래 폴백 허용(문서에 명시된 대체). alt 는 패턴대로.
| 필드 | 경로 제안 | 폴백 | alt 패턴 |
|------|-----------|------|----------|
| `detail.heroImage` | `/images/detail/{slug}-hero.jpg` (가로) | `item.image`(포스터) | "<제목> 공연 무대 장면" |
| `detail.synopsisImage` | `/images/detail/{slug}-synopsis.jpg` (16:9) | heroImage/poster | "<제목> 시놉시스 장면" |
| `cast[].image` | `/images/detail/{slug}-cast-{n}.jpg` (3:4) | 없으면 크리에이티브(bio) 카드로 렌더 | "<배우명> — <배역>" |
| `location.map` | `/images/detail/{slug}-map.jpg` | 공용 `/images/detail/map-placeholder.jpg` | "<venue명> 위치 지도(예시)" |

---

## 4. genre kind 전용 간소 레이아웃 — `GenreDetail`

genre(Musical/Play/Concert 카테고리)는 실제 공연이 아니므로 캐스트/예매/지도 **없음**. 풀블리드 히어로 + 카테고리명 + 설명만.

- 태그: `<article>` → `DetailHero` 축약형(풀블리드 히어로, `height: clamp(480px, 80vh, 720px)`).
  - 배경: `item.image`(장르 이미지, 가로형). mask/side 그라디언트 재사용(§2-1).
  - 콘텐츠(`Container`, 하단 정렬):
    - 번호 라벨 `item.number`(예 "01") + "CATEGORY" 배지(중립 톤, 리스트 핸드오프 `--badge-ended-*` 재사용 가능).
    - `<h1>` `item.title`(Musical/Play/Concert): `--font-display`, italic, `clamp(48px, 9vw, 72px)`, `--color-white`, `text-shadow: var(--text-glow)`.
    - `<p>` `item.description`: `--font-body`, `--font-size-body-lg`, `--color-on-surface-variant`, `max-width: 36rem`, 좌측 보더 `2px var(--btn-glass-border)` + `padding-left: var(--space-md)`(선택).
- 하단 CTA(선택): `Button variant="glass"` "이 장르의 공연 보기" → `/list`(해당 장르 필터로 진입 여지). genre 는 개별 예매 대상이 아니므로 목록 회귀가 자연스러움.
- **접근성/반응형**: 단일 `<h1>`, 배경 장식 `aria-hidden`/`alt=""`, md/lg mixin.

---

## 5. Props 타입 제안

`ListDetail` 은 기존대로 `{ item: ListItem }` 하나만 받고 내부에서 `item.kind` 분기. rank/ticket 이 필요로 하는 추가 필드는 **`RankItem`/`TicketItem` 인터페이스에 `detail?: ShowDetail` 옵셔널로 추가**(GenreItem 엔 추가하지 않음).

```ts
// src/components/RankCard/index.tsx, TicketCard/index.tsx (또는 공용 타입 파일)에 추가
export interface CastMember {
  name: string;
  role: string; // 배역/직책 (예: "The Phantom", "Music Director")
  image?: { src: string; alt: string }; // 없으면 텍스트형 크리에이티브 카드로 렌더
  bio?: string; // image 없을 때 소개문(작곡가/연출 등)
}
export interface VenueLocation {
  name: string;
  address: string;
  subway: string;
  phone: string; // 더미(예시) 번호
  map?: { src: string; alt: string }; // 없으면 공용 placeholder
}
export interface ShowDetail {
  tagline: string; // 히어로 상단 라벨
  heroDescription: string;
  heroImage?: { src: string; alt: string }; // 없으면 item.image 재사용
  schedule: string; // "2026.12.05 — 2025.03.30"
  runtime: string;
  ageRating: string;
  priceRange: string;
  synopsis: string[]; // 문단 배열
  synopsisImage?: { src: string; alt: string };
  cast: CastMember[];
  sessions: string[]; // ["14:00","19:30"] — 예매 위젯 데모용
  bookingStatus: string; // "Booking Open" / "Opening Soon"
  bookingFee: string;
  location: VenueLocation;
}

// RankItem, TicketItem 각각에 추가:
//   detail?: ShowDetail;
// GenreItem: 추가 없음(간소 레이아웃).
```

- `ListDetail` 구현: `switch(item.kind)` → `rank`/`ticket` 은 `item.detail` 로 풍부한 템플릿(§2). detail 이 없으면(방어) 최소 히어로만. `genre` 는 `GenreDetail`(§4).
- **ticket venue**: TicketItem top-level 에 `venue` 를 추가하지 않고 `detail.location.name` 으로 히어로/지도 venue 를 채운다(§0-3 근거).

---

## 6. 토큰 (색상 매핑 & 신규)

### 6-1. 목업 색상 → 기존 토큰 매핑

| 목업 색/역할                                   | 목업 값                 | 사용 토큰                                    |
| ---------------------------------------------- | ----------------------- | -------------------------------------------- |
| background (페이지/그라디언트 끝색)            | `#12121d`               | `--color-background`                         |
| surface (nav bg 60%)                           | `#12121d`               | `--color-background`                         |
| surface-container-lowest (지도/footer 섹션 bg) | `#0d0d17`               | `--color-surface-container-lowest`           |
| surface-container-low (예매 요약 박스)         | `#1b1b25`               | `--color-surface-container-low`              |
| primary (아이콘/라벨/강조)                     | `#c8bfff`               | `--color-primary`                            |
| primary-container (버튼/보더/핀)               | `#6a5acd`               | `--color-primary-container`                  |
| on-surface (본문 값)                           | `#e4e1f0`               | `--color-on-surface`                         |
| on-surface-variant (보조 텍스트)               | `#c9c4d5`               | `--color-on-surface-variant`                 |
| outline-variant (구분선/보더)                  | `#474553`               | `--color-outline-variant`                    |
| white (제목/버튼 텍스트)                       | `#ffffff`               | `--color-white`                              |
| glass-panel border                             | `rgba(255,255,255,0.1)` | `--color-hairline-strong`                    |
| text-glow                                      | `rgba(200,191,255,0.3)` | `--text-glow`                                |
| btn-glow hover                                 | `rgba(106,90,205,0.4)`  | `--btn-glass-shadow-hover`(0.3, 근사 재사용) |

- 투명도 합성(`primary-container/10`, `outline-variant/30` 등)은 `color-mix(in srgb, var(--color-*) N%, transparent)` 로.

### 6-2. 신규 토큰 (tokens.scss 에 추가함 — designer 소유)

| 토큰                 | 값                   | 용도                                                   |
| -------------------- | -------------------- | ------------------------------------------------------ |
| `--glass-panel-bg`   | `rgba(22,22,37,0.6)` | 상세페이지 강한 유리 패널(정보카드/예매위젯/지도) 배경 |
| `--glass-panel-blur` | `20px`               | 위 패널 backdrop-filter blur                           |

- 그 외(보더 `--color-hairline-strong`, hover 글로우 `--btn-glass-shadow-hover`, `--text-glow`, radius/폰트/spacing, `--header-height`)는 **기존 토큰 재사용**. 예매 위젯 캘린더 활성일/세션 선택 색은 기존 `--color-primary-container`/`--color-primary`/`--color-outline-variant` 로 충분 → 신규 없음.

---

## 7. 접근성 & 반응형

### 접근성

- 랜드마크: `<header>`(히어로)·`<main>`·`<footer>`. 각 섹션 `<section>` + `aria-labelledby` 로 `<h2>` 연결. 페이지 대표 제목은 히어로 `<h1>` 하나.
- heading 위계: h1(쇼 제목) → h2(Synopsis / Cast & Creatives / Venue Location) → h3(정보카드 라벨 / Booking Info) → h4(캐스트 이름 / venue명).
- 모든 이미지 `alt`(§3-3 패턴). 배경/지도 장식은 `alt=""` 또는 `aria-hidden`.
- 아이콘 전용 버튼(share/favorite/map pin)은 `aria-label`. 예매 위젯: 세션/날짜 버튼은 `aria-pressed`/`aria-selected` 로 선택 상태 전달, 캘린더는 키보드 이동 가능.
- **동작 없는 데모 요소 명시**: Book Now/Get Directions 등은 실제 기능이 없으므로 `disabled` 또는 "준비 중" 안내 — 스크린리더에 오해 없게.
- `animate-bounce`(지도 핀) 등 모션은 `@media (prefers-reduced-motion: reduce)` 에서 정지.

### 반응형 (md 768 / lg 1024 만)

- 히어로: `< md` 세로 스택(텍스트 위, 액션 버튼 아래), side 그라디언트 숨김. 제목 `clamp` 축소.
- 본문 그리드: `< lg` 1열(예매 위젯이 캐스트 아래로 내려옴, sticky 해제). `lg` 12컬럼(좌 8 / 우 4), 위젯 sticky.
- 정보카드 `< md` 1열 / `md` 3열. 캐스트 `< md` 2열 / `md` 4열. 지도 `< md` 1열 / `md` (2/1).

---

## 8. 퍼블리셔 주의사항 & 확인 필요

### SCSS 컨벤션(재확인)

- Tailwind 금지. 색/폰트/효과 토큰 참조(하드코딩 금지). 길이는 변수화 제외 가능(단 sticky offset 은 `--header-height` 사용).
- 네스팅 최대 3depth. 꾸밈 요소(히어로 그라디언트, 캐스트 hover 오버레이, 지도 핀, 유리 패널 등)는 `::before`/`::after` 우선.
- hover 노출 요소는 `opacity`/`max-height`(스크린리더 유지).
- `next/image` `fill` + `object-fit:cover`. 히어로 배경은 LCP → `priority`.
- 공용 컴포넌트(`Header`/`Footer`/`Container`/`Button`/`Icon`) 재사용. 목업 nav/footer 마크업 구현 안 함.
- 제안 컴포넌트 위치: `src/components/ListDetail/`(스텁 존재, kind 분기 진입점) 하위 또는 형제로 `DetailHero`/`InfoCards`/`SynopsisSection`/`CastSection`/`BookingWidget`(client)/`VenueSection`/`GenreDetail`. 각 `.scss` 동반.

### 확인 필요 (미결)

1. **콘텐츠 문구는 팀리드가 채움**: 9개 아이템 전체 값 표는 이 문서에서 스킵(사용자 지시). §3-2 예시 2개는 톤/형식 참고용. 배우명·주소·전화는 더미로("(예시)" 표기 + `1588-0000`) — 팀리드가 채울 때도 실존 인물/실번호처럼 보이지 않게 유지 권장.
2. **이미지 애셋**: §3-3 경로는 아직 없는 플레이스홀더. 전용 컷 생성 vs 기존 포스터 재사용(폴백) 중 무엇으로 갈지 확인 필요. 최소한 공용 `map-placeholder.jpg` 1장은 필요.
3. **예매 위젯 상호작용 범위**: "선택됨 로컬 표시"까지만 할지, Book Now 클릭 시 별도 안내(모달/토스트)까지 만들지 범위 확인. (백엔드 없음은 확정)
4. **genre 하단 CTA "이 장르의 공연 보기"**: `/list` 로 보낼 때 장르 프리필터를 걸지(리스트 필터 상태 연동) 단순 이동인지 — 리스트 필터가 kind 기반이라 장르 프리필터는 별도 설계 필요. 우선 단순 `/list` 이동 제안.
