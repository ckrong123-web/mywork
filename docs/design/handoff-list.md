# LOOOGOO 목록 페이지(`/list`) — 퍼블리셔 핸드오프 스펙

> 출처: `docs/design/LOOOGOO-list-source.html` (Google Stitch export, Tailwind 기반) — 사용자 확정 디자인.
> 대상: publisher 에이전트 (React 19 + Next.js 15 App Router + SASS)
> 토큰: `src/styles/tokens.scss` (CSS 변수). **Tailwind 절대 금지, 하드코딩 금지 — 토큰 참조.**
> 테마: **항상 다크 단일 테마** (라이트 분기 없음).
> 데이터: `src/data/home.ts` 의 `LIST_ITEMS`(판별 유니언 `ListItem`, 9개: rank4 + ticket2 + genre3).
>
> **스코프**: 이 문서는 **`/list` 목록 페이지(히어로 + 필터/정렬 + 그리드)까지만** 확정한다.
> `/list/[slug]` 상세 페이지 디자인은 사용자가 아직 전달하지 않았으므로 **§9에서 "추후 확정 예정"으로만 표시**한다.

---

## 0. 목업 대비 확정/변경 사항 (반드시 반영 — 근거 포함)

사용자 확정 사항과 데이터 모델 불일치를 아래 기준으로 매핑했다. **목업을 그대로 옮기지 말 것.**

1. **상단 네비게이션·Footer는 목업 마크업을 쓰지 않고 기존 `Header`/`Footer` 컴포넌트를 그대로 재사용**한다. 근거: "페이지별로 비슷한 구조가 있으면 반드시 컴포넌트로 재사용" 지침. 목업의 nav(Musical/Play/Concert/Classic/Family, My Ticket/Join)와 목업 footer(What's On/Venues/Rental…)는 **참고만** 하고 구현에 넣지 않는다.
2. **필터 탭 + 정렬 드롭다운은 실제로 동작**해야 한다(클라이언트 필터링/정렬). 장식용 비활성 UI 아님. → 목록 영역을 `'use client'` 컴포넌트로 분리(§7).
3. **페이지네이션 제외**. 데이터가 9개뿐이라 불필요 → 목업의 페이지네이션 마크업/스펙은 **핸드오프에 포함하지 않는다**(의도적 누락).
4. **장르 카드는 "All" 탭에서만 노출**. Ongoing/Upcoming/Ended 선택 시 숨김. 근거: 장르(Musical/Play/Concert 카테고리)는 공연 일정 개념이 없어 상태값 자체가 없음.
5. **색상**: 목업 hex가 기존 토큰과 미세하게 다르다(예: 목업 `background #12121d` vs 기존 `--color-background #0b0b15`). **새 팔레트를 만들지 않고 기존 `--color-*` 에 최근접 매핑**한다(§8-1 매핑표).
6. **카드 코너 배지**: 목업은 solid `primary-container` 배지였으나, 기존 D-day(D-3/D-7) 배지의 "반투명 배경 + 컬러 텍스트 + 컬러 보더" 패턴에 맞춰 **상태별 배지 톤**으로 재구성(§8-2 신규 토큰).

---

## 1. 페이지 구조 & 컴포넌트 트리

```
/list  (src/app/list/page.tsx — 서버 컴포넌트)
├─ <Header />                         ← 기존 컴포넌트 재사용
├─ <main>
│  ├─ ListHero        (page hero — §3)         ← 정적, 서버 렌더 가능
│  └─ <ListExplorer items={LIST_ITEMS} />      ← 'use client' (필터/정렬 상태) §4~6
│     ├─ 필터/정렬 바 (sticky)  §4
│     └─ 카드 그리드
│        └─ <ListCard item={...} /> × N        ← 프레젠테이션(서버 안전) §5
└─ <Footer />                         ← 기존 컴포넌트 재사용
```

- `page.tsx` 는 `LIST_ITEMS` 를 `ListExplorer` 에 넘기는 정적 서버 컴포넌트.
- **`ListExplorer`** = 필터 탭 + 정렬 + 그리드를 감싸는 client 컴포넌트(상태 보유). 목록 인터랙션의 소유자.
- **`ListCard`** = 카드 1개 프레젠테이션. `item.kind` 로 내용만 분기(상태 없음 → 서버 안전, `ListExplorer` 가 client 여도 카드 자체는 순수).

---

## 2. 전역 규칙 (메인과 공유)

`docs/design/handoff-main.md` 0절을 그대로 따른다. 요약 + 이 페이지 특이사항:

- 폰트: 제목 `--font-display`(Libre Caslon Text), 본문 `--font-body`(Hanken Grotesk), 아이콘 `--font-icon`(Material Symbols) → `Icon` 컴포넌트 재사용.
- `Container` 컴포넌트 재사용(max-width 1280px, 좌우 패딩 모바일 24px / lg 80px).
- **fixed 헤더 회피**: `Header` 는 fixed 이므로 `<main>`(또는 ListHero) 최상단이 헤더에 가리지 않게 처리. 단 이 페이지는 **ListHero 가 배경 전면 히어로**라서 메인 홈처럼 헤더가 히어로 위에 겹쳐도 자연스럽다(히어로 콘텐츠는 하단 정렬이므로 상단 헤더와 충돌 없음).
- **브레이크포인트**: **기존 `md`(768)/`lg`(1024) mixin만 사용**(사용자 확정 — sm/xl 추가하지 않음). 그리드는 모바일 1열 / md 2열 / lg 3열(§6).
- `--header-height`(신규 토큰, 80px)를 sticky 필터바 offset에 사용(§4).

---

## 3. ListHero (페이지 히어로) — `src/components/ListHero/`

목업의 `<header>` 히어로. 배경 이미지 + scrim + 중앙 하단 타이틀.

- 태그: `<section>`(페이지 인트로) relative, `height: clamp(420px, 60vh, 614px)`(목업 614px), `overflow: clip`, flex `align-items: flex-end; justify-content: center`.
- **배경 레이어**(절대 `inset:0`, `z-index:0`):
  - 배경 이미지: `<Image fill sizes="100vw" priority className="list-hero__image" style={{objectFit:'cover'}}>`. 애셋 필요 → `/images/list-hero.jpg`(웅장한 극장 인테리어). `alt`는 장식 배경이므로 `alt=""`(제목이 텍스트로 존재) 또는 의미부여 시 "공연장 내부 전경". (목업 data-alt: "A grand, cinematic interior of an opulent Broadway theater before a performance.")
  - **blur 오버레이**(꾸밈): `::before` 절대 `inset:0`, `background: var(--color-background)` 40% + `backdrop-filter: blur(2px)`. (목업 `bg-background/40 backdrop-blur-[2px]`)
  - **scrim 그라디언트**(꾸밈): `::after` 절대 `inset:0`, `background: linear-gradient(to top, var(--color-surface-container-lowest) 0%, transparent 100%)`. (목업 `.scrim-gradient` = `rgba(13,13,23,*)` ≈ `--color-surface-container-lowest #0d0d17`)
- **콘텐츠**(`Container`, `z-index:10`, `padding-bottom: var(--space-xl)`(80px), `text-align:center`):
  - `<h1>` 타이틀 = **"ALL SHOWS"**(사용자 확정). `--font-display`, `color: var(--color-white)`, `font-size: clamp(40px, 7vw, 64px)`(목업 display-lg 64px / mobile 40px), `line-height: 1.1`, `letter-spacing: var(--letter-spacing-tight)`, 하단 margin `var(--space-xs)`. **텍스트 글로우 선택**: `text-shadow: var(--text-glow)`(목업 `.text-glow`).
    - 근거: 목업은 단일 장르 페이지라 "MUSICAL"이었으나, `/list` 는 전체 9개(랭킹+티켓+장르 혼합) 통합 목록이라 "ALL SHOWS"로 확정. props 기본값으로 두되 교체 가능하게.
  - `<p>` 서브카피: `--font-body`, `--font-size-body-lg`(18px), `color: var(--color-primary-fixed-dim)`, `max-width: 42rem`(2xl), `margin-inline:auto`, `opacity: 0.8`. 문구 제안(전체 목록에 맞게): **"지금 무대 위, 랭킹부터 티켓 오픈까지 한눈에."** (목업 영문 카피는 musical 한정이라 대체)

### Props

```ts
interface ListHeroProps {
  title: string; // 기본 "ALL SHOWS"
  subtitle: string;
  image?: { src: string; alt: string }; // 기본 /images/list-hero.jpg
}
```

### 접근성

- 페이지 대표 제목 `<h1>` 하나(이 히어로). 배경 이미지는 장식(`alt=""`) — 텍스트 제목이 의미 전달.
- scrim/blur 는 장식(가상선택자, `aria` 불필요).

---

## 4. 필터 & 정렬 바 (sticky) — `ListExplorer` 상단

목업의 `<section class="sticky top-[64px]">`. **동작 필수.**

- 태그: `<div>`(또는 `<section aria-label="공연 필터 및 정렬">`), `position: sticky`, `top: var(--header-height)`(=80px, 목업의 64px는 목업 nav 높이 기준 → 우리 Header 실측 높이로 교체), `z-index: 40`.
- 배경(꾸밈 glass): `background: color-mix(in srgb, var(--color-background) 80%, transparent)` + `backdrop-filter: blur(12px)`, 하단 보더 `1px solid var(--color-outline-variant)`(목업 `border-outline-variant/30` → 약하게: `rgba(71,69,83,0.3)` 로 표현 가능). (목업 `bg-background/80 backdrop-blur-md`)
- 내부: `Container`, flex — 모바일 column / `md` row, `justify-content: space-between; align-items:center`, `gap: var(--space-md)`, 세로 패딩 `var(--space-md)`.

### 4-1. 필터 탭 (All / Ongoing / Upcoming / Ended)

- 컨테이너: flex, `background: var(--color-surface-container)`, `border-radius: var(--radius-full)`, 패딩 4px. 모바일 `width:100%`(탭 `flex:1` 균등분할) / `md` `width:auto`.
- 각 탭 버튼(`role="tab"` 또는 단순 `<button>`): 패딩 `var(--space-xs) var(--space-lg)`, `border-radius: var(--radius-full)`, `font-family: var(--font-body)`, `font-size: var(--font-size-body)`(14px, 목업 label-md), `font-weight: var(--font-weight-medium)`.
  - **활성 탭**: `background: var(--color-primary-container)`, `color: var(--color-on-primary-container)`.
  - **비활성 탭**: `color: var(--color-on-surface-variant)`, hover `color: var(--color-white)`.
- 상태: `activeTab: 'all' | 'ongoing' | 'upcoming' | 'ended'` (기본 `'all'`).
- 접근성: 탭 그룹은 `role="tablist"` + 각 버튼 `role="tab"` `aria-selected`, 또는 라디오 시맨틱(`role="radiogroup"`). 활성 탭 `aria-selected="true"`. 키보드 좌우 이동 지원 권장.

### 4-2. 정렬 드롭다운 (Latest Release / Most Popular / Closing Soon)

- 컨테이너: flex align-center gap `var(--space-base)`, `color: var(--color-on-surface-variant)`. 모바일 `width:100%; justify-content:flex-end`.
- `sort` 아이콘(`Icon name="sort"`, 20px, `aria-hidden`) + `<select>`(네이티브).
  - `<select>`: `background: transparent`, `border: none`, `color: var(--color-on-surface-variant)`, `font-family: var(--font-body)`, `font-size: var(--font-size-body)`, `cursor:pointer`. `aria-label="정렬 기준"`. focus 링 제거 대신 접근 가능한 포커스 표시 유지.
  - `<option>`: 값 `latest`(Latest Release) / `popular`(Most Popular) / `closing`(Closing Soon).
- 상태: `sortKey: 'latest' | 'popular' | 'closing'` (기본 `'latest'`).
- **주의**: 네이티브 `<option>` 은 다크 배경 커스터마이즈가 브라우저별로 제한적 → 옵션 목록 색은 OS 기본을 따를 수 있음(허용). 커스텀 드롭다운은 과설계 → 네이티브 `<select>` 유지.

---

## 5. `ListCard` — `src/components/ListCard/`

목업 카드(article: 이미지 + 코너 배지 + 제목 + 2줄 메타)를 **kind별로 채운다**. 없는 필드는 지어내지 말고 줄 생략/실제 필드 대체.

### 5-1. 카드 공통 골격 (kind 무관)

- 루트: `<article class="list-card list-card--{kind}">` 를 `<Link href={/list/${item.slug}}>` 로 감싸기(카드 전체 클릭). group hover.
- **프레임(glass-card)**: `border-radius: var(--radius-xl)`(8px), `overflow:hidden`, flex column, `background: var(--glass-card-bg)`, `border: 1px solid var(--glass-border)`, `backdrop-filter: blur(var(--glass-blur))`, `transition: all .3s cubic-bezier(.4,0,.2,1)`.
  - hover: `border-color: var(--color-primary)`, `box-shadow: var(--glass-card-glow)`, `transform: translateY(-4px)`. (목업 `.glass-card:hover`)
- **이미지 영역**: `position:relative`, `aspect-ratio: 3 / 4`(목업 `aspect-[3/4]`), `overflow:hidden`. `<Image fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="list-card__image">`, `object-fit:cover`. group-hover `transform: scale(1.1)` transition 500ms. `alt = item.image.alt`(데이터 값).
  - **코너 배지**: 절대 `top: var(--space-sm); right: var(--space-sm)`, `border-radius: var(--radius-lg)`, 패딩 `var(--space-xs) var(--space-sm)`, `font-family: var(--font-body)`, `font-size: var(--font-size-label)`(12px 근사, 목업 label-md 14px 도 허용), `font-weight: var(--font-weight-medium)`, `box-shadow: var(--shadow-card)` 약하게. 내용/톤은 kind별(§5-2).
- **본문**: 패딩 `var(--space-md)`, flex column, `flex-grow:1`.
  - `<h3>` 제목: `--font-display`, `--font-size-ticket-title`(24px, 목업 headline-md), `color: var(--color-white)`, 한 줄 말줄임(`overflow:hidden; text-overflow:ellipsis; white-space:nowrap`), 하단 margin `var(--space-xs)`. group-hover `color: var(--color-primary)`.
  - **메타 영역**: `margin-top:auto`(카드 하단 고정), flex column gap `var(--space-xs)`. 각 메타 행 = flex align-center gap `var(--space-xs)`, `color: var(--color-on-surface-variant)`, `font-size: var(--font-size-label)`(12px, 목업 label-sm), 앞에 18px 아이콘(`Icon`, `aria-hidden`). 내용은 kind별(§5-2).

### 5-2. kind별 채움 (핵심 — 없는 필드는 생략/대체)

| kind       | 코너 배지                                                                                         | 제목                          | 메타 1행 (location_on)        | 메타 2행 (calendar_today)                                                                                                                     | 비고                                                     |
| ---------- | ------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **rank**   | `NOW PLAYING`(ongoing 톤, `--badge-ongoing-*`)                                                    | `title`                       | `venue`                       | **날짜 없음** → 2행을 `{genre} · {percent}` 로 대체(아이콘 `local_activity` 또는 `trending_up`, percent 부분만 `color: var(--color-primary)`) | rank 필드에 date 없음. percent=인기 지표                 |
| **ticket** | `badge`(D-day) — **기존 D-day 배지 스타일 재사용**(`badgeTone` primary/tertiary, handoff-main §4) | `title`                       | **venue 없음** → **1행 생략** | `datetime`(단일 오픈 일시, "~기간" 아님)                                                                                                      | ticket 필드에 venue 없음. 지어내지 말 것                 |
| **genre**  | 없음(또는 중립 `CATEGORY` pill, ended 톤 `--badge-ended-*`)                                       | `title`(Musical/Play/Concert) | **없음**                      | **없음** → 메타 대신 `description`(2줄 말줄임, `-webkit-line-clamp:2`, 아이콘 없음)                                                           | genre=카테고리, 일정/장소 개념 없음. "All" 탭에서만 노출 |

- **rank 코너 배지 문구**: "NOW PLAYING"(상영 중)로 통일. 랭킹 순위(rank "01")는 배지 대신 제목/구조로 전달하거나 필요 시 배지에 "#01" 병기 가능(선택).
- **ticket 코너 배지**: 목업 "D-5"처럼 `item.badge` 값 그대로. 스타일은 신규 status 토큰이 아니라 **메인 사이트 D-day 배지(TicketCard)** 를 재사용해 톤 일관성 유지.
- **genre**: 코너 배지는 생략 권장(상태값 없음). 카드 구분이 필요하면 중립 "CATEGORY" pill만.

### 5-3. Props (판별 유니언)

```ts
import type { ListItem } from "@/data/home";
// ListItem =
//   | ({ kind: "rank" }   & RankItem)    // slug,rank,title,genre,venue,percent,image,offset,href
//   | ({ kind: "ticket" } & TicketItem)  // slug,badge,badgeTone,datetime,title,description,image,reminderHref (venue 없음)
//   | ({ kind: "genre" }  & GenreItem)   // slug,number,title,description,image,offset,href (venue/date 없음)
interface ListCardProps {
  item: ListItem;
}
```

- 구현: `switch(item.kind)` 로 내로잉 후 §5-2 표대로 채움. 골격(프레임/이미지/제목)은 공통, 배지·메타만 분기.

---

## 6. 카드 그리드 & 빈 상태

- 컨테이너: `<main>`(또는 그리드 래퍼) `Container`, 세로 패딩 `var(--space-xl)`(80px). 목업 `<ul>`/`<li>` 시맨틱 권장(list-style 제거) — 각 `<li>` 안에 `ListCard`.
- 레이아웃: `display:grid`, `gap: var(--space-lg)`(48px, 목업 `gap-lg`).
  - 열 수(**사용자 확정 — 기존 md/lg mixin만으로 단순화**. 목업의 sm/xl 4열은 채택하지 않음):
    | 화면폭 | 열 |
    |--------|----|
    | 모바일(<768) | 1 |
    | `md` ≥768 | 2 |
    | `lg` ≥1024 | 3 |
  - 근거: 데이터가 9개라 4열이 필수가 아니고, 프로젝트 mixin 체계(md/lg)에 맞춰 단순화. 목업의 `sm`(640)/`xl`(1280) 분기는 구현하지 않는다.
- **빈 상태**(필터 결과 0건 — 특히 **Ended 탭은 현재 해당 데이터가 없어 항상 빈 상태**): 그리드 대신 중앙 정렬 안내. 텍스트 "해당 상태의 공연이 없습니다." `--font-body`, `--font-size-body-lg`, `color: var(--color-on-surface-variant)`, 세로 패딩 넉넉히. `aria-live="polite"` 권장(필터 전환 시 스크린리더 알림).

---

## 7. 필터/정렬 동작 사양 (`ListExplorer`, `'use client'`)

데이터에 `status` 필드가 **없으므로** `kind` 로부터 상태를 파생한다.

### 7-1. 상태 파생 (kind → status)

| kind   | 파생 status | 근거                                     |
| ------ | ----------- | ---------------------------------------- |
| rank   | `ongoing`   | 현재 주간 랭킹에 있는 = 상영 중으로 간주 |
| ticket | `upcoming`  | D-day 카운트다운 = 오픈 예정             |
| genre  | (없음)      | 카테고리라 상태 개념 없음                |

- **"ended" 에 해당하는 실제 데이터는 현재 없음** → Ended 탭은 UI로 지원하되 항상 빈 상태(§6). 향후 데이터/필드 확장 시 재매핑.

### 7-2. 탭별 필터 규칙

| 탭       | 표시 대상                       |
| -------- | ------------------------------- |
| All      | 전체 9개(rank + ticket + genre) |
| Ongoing  | rank 4개                        |
| Upcoming | ticket 2개                      |
| Ended    | 없음 → 빈 상태                  |

- **장르 카드는 "All" 탭에서만 노출**(다른 탭에서 항상 제외). 상태값이 없기 때문. → 필터 로직: `tab==='all' ? 전체 : items.filter(i => deriveStatus(i)===tab)` (genre 는 status 없음 → all 외 탭에서 자동 제외됨).

### 7-3. 정렬 규칙 (kind별 실제 필드 기반 — 근거 명시)

데이터가 kind별로 정렬 가능한 필드가 다르므로, **각 kind에 존재하는 필드로만 정렬하고 genre는 항상 뒤로 고정**한다(장르는 정렬 의미가 약함).

| 정렬 키                            | 규칙                                                                                                            | 근거                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Latest Release**(`latest`, 기본) | ticket: `datetime` 내림차순(최신 오픈 먼저) → rank: `rank` 오름차순(원본 순위) → genre: 뒤로 고정               | rank/genre엔 릴리즈 날짜 필드가 없어 완전 정렬 불가 → 날짜 있는 ticket만 날짜로, 나머지는 안정적 원본순. 실무적 매핑임을 명시 |
| **Most Popular**(`popular`)        | rank: `percent` 내림차순(예매 점유율=인기) → ticket: 원본순 → genre: 뒤로 고정                                  | rank의 `percent`가 유일한 인기 지표. ticket/genre엔 인기 필드 없음                                                            |
| **Closing Soon**(`closing`)        | ticket: D-day 오름차순(`badge` D-3 < D-7, 임박 먼저) 또는 `datetime` 오름차순 → rank: 원본순 → genre: 뒤로 고정 | "마감 임박"은 오픈 임박 티켓에만 의미. `badge`에서 숫자 파싱(`D-3`→3) 또는 `datetime` 비교                                    |

- **genre 항상 뒤로 고정** 근거: 카테고리는 날짜/인기/마감 개념이 없어 어떤 정렬에도 자연 순서가 없음. "All" 탭에서 실제 공연 카드 뒤에 카테고리 진입점으로 배치되는 게 UX상 자연스러움.
- 구현: `useMemo(() => sortAndFilter(items, activeTab, sortKey), [activeTab, sortKey])`. 정렬은 kind 그룹 우선(비-genre 먼저, genre 뒤) → 그룹 내 위 규칙. `D-day` 파싱은 `Number(badge.replace(/[^0-9]/g,''))`.

### Props

```ts
import type { ListItem } from "@/data/home";
interface ListExplorerProps {
  items: ListItem[]; // LIST_ITEMS
}
```

---

## 8. 토큰 (색상 매핑 & 신규)

### 8-1. 목업 색상 → 기존 토큰 매핑 (새 팔레트 금지, 최근접 매핑)

| 목업 색/역할                                   | 목업 hex                 | 사용 토큰                                    |
| ---------------------------------------------- | ------------------------ | -------------------------------------------- |
| background / surface (페이지·히어로·필터바 bg) | `#12121d`                | `--color-background` (기존 #0b0b15)          |
| scrim 하단색                                   | `rgba(13,13,23,*)`       | `--color-surface-container-lowest` (#0d0d17) |
| surface-container (탭 트랙)                    | `#1f1f29`                | `--color-surface-container` (일치)           |
| primary (텍스트/보더/활성)                     | `#c8bfff`                | `--color-primary` (일치)                     |
| primary-container (활성 탭 bg)                 | `#6a5acd`                | `--color-primary-container` (일치)           |
| on-primary-container (활성 탭 텍스트)          | `#f0ebff`                | `--color-on-primary-container` (일치)        |
| on-surface-variant (보조 텍스트)               | `#c9c4d5`                | `--color-on-surface-variant` (일치)          |
| primary-fixed-dim (히어로 서브카피)            | `#c8bfff`                | `--color-primary-fixed-dim` (일치)           |
| outline-variant (필터바 하단 보더)             | `#474553`                | `--color-outline-variant` (일치)             |
| white (히어로 제목)                            | `#ffffff`                | `--color-white` (일치)                       |
| glass-card border                              | `rgba(255,255,255,0.08)` | `--glass-border` (일치)                      |

- **투명도 합성**이 필요한 곳(예: `bg-background/80`, `border-outline-variant/30`)은 `color-mix(in srgb, var(--color-*) N%, transparent)` 로 표현(하드코딩 rgba 지양). SASS 지원 브라우저 타깃에서 `color-mix` 가용.

### 8-2. 신규 토큰 (tokens.scss에 추가함 — designer 소유)

상태 배지(§5) + 카드 유리질감(§5) + 헤더 높이(§4). 기존 D-day 배지의 "반투명 bg + 컬러 텍스트 + 컬러 보더" 패턴 승계.

| 토큰                                      | 값                                                           | 용도                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `--badge-ongoing-bg` / `-fg` / `-border`  | `rgba(200,191,255,.16)` / `#c8bfff` / `rgba(200,191,255,.3)` | rank 카드 "NOW PLAYING" 배지 (primary 톤)                                               |
| `--badge-upcoming-bg` / `-fg` / `-border` | `rgba(69,55,150,.45)` / `#b6abff` / `rgba(182,171,255,.35)`  | upcoming 상태 배지 (secondary-container 톤). ※ticket 코너는 기존 D-day 배지 재사용 가능 |
| `--badge-ended-bg` / `-fg` / `-border`    | `rgba(52,52,63,.6)` / `#c9c4d5` / `rgba(71,69,83,.8)`        | ended/중립(빈 상태·CATEGORY pill) muted 톤                                              |
| `--glass-card-bg`                         | `rgba(31,31,41,.4)` (=surface-container @40%)                | ListCard 프레임 배경                                                                    |
| `--glass-card-glow`                       | `0 0 20px rgba(200,191,255,.15)`                             | ListCard hover box-shadow                                                               |
| `--header-height`                         | `80px`                                                       | sticky 필터바 `top` offset (Header 실측 높이)                                           |

- 기존 `--glass-border`, `--glass-blur`(12px), `--shadow-card`, radius/폰트 토큰은 그대로 재사용.
- **주의**: 이전(잠정본)에 있던 `--badge-rank-*` / `--badge-ticket-*` / `--badge-genre-*` 는 롤백되어 없음. 이번 상태 기반 토큰(`--badge-ongoing/upcoming/ended-*`)이 정식이다.

---

## 9. `/list/[slug]` 상세 페이지 — **추후 확정 예정**

사용자가 상세 페이지 디자인 파일을 아직 전달하지 않았다. **이 문서에서는 상세 스펙을 확정하지 않는다.**

- `ListDetail` 컴포넌트(`src/components/ListDetail/`, `{ item: ListItem }` prop 스텁 존재)는 유지하되, 레이아웃/스타일은 **디자인 파일 수령 후 별도 핸드오프로 확정**.
- 데이터 진입점은 이미 준비됨: `getListItemBySlug(slug)`(`src/data/home.ts`), `LIST_ITEMS` 의 각 `href = /list/{slug}`.
- 목록 카드(`ListCard`)는 `/list/{slug}` 로 링크만 걸어두면 됨(상세 미완성이어도 라우팅 뼈대는 성립).

---

## 10. 퍼블리셔 주의사항 (SCSS 컨벤션 — 재확인)

- **Tailwind 금지**. 목업의 모든 유틸 클래스는 SCSS로 재작성. 색/폰트/효과는 토큰 참조(하드코딩 금지). 길이 값은 변수화 제외 가능(단 sticky offset은 `--header-height` 사용).
- **네스팅 최대 3depth**. 초과 시 셀렉터 평탄화.
- **꾸밈 요소는 `::before`/`::after`**: 히어로 blur/scrim 오버레이, 필터바 glass 배경, 카드 hover 글로우 등.
- hover로만 노출되는 요소는 `display:none` 대신 `opacity`/`max-height`(스크린리더 접근성). 단 이 페이지는 요약을 기본 노출하므로 해당 적음.
- 반응형: **기존 `md`(768)/`lg`(1024) mixin만 사용**(sm/xl 미사용). 그리드 모바일 1 / md 2 / lg 3열. §6 참고.
- 이미지는 `next/image` `fill` + `object-fit:cover`. 히어로 배경·상단 카드 이미지는 LCP 후보 → `priority` 고려.
- **컴포넌트 재사용 필수**: `Header`/`Footer`/`Container`/`Button`/`Icon` 은 기존 것 사용. 목업의 nav/footer 마크업은 구현하지 않음.
- 컴포넌트 위치: `src/components/ListHero/`, `src/components/ListExplorer/`(client), `src/components/ListCard/`(스텁 존재) — 각 폴더에 대응 `.scss` 동반.
