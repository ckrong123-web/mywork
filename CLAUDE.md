## 개발 환경

- Node.js: 22.22.3

## 기술 스택

- 프레임워크: Next.js 15 (App Router) — https://nextjs.org/docs
- 라이브러리: React 19 — https://react.dev/reference/react
- 언어: TypeScript — https://www.typescriptlang.org/docs/
- CSS: SASS (Tailwind 절대로 사용 금지) — https://sass-lang.com/documentation/

### 애니메이션 / 인터랙션 라이브러리

- 스크롤 인터랙션: react-locomotive-scroll — https://github.com/antoinelin/react-locomotive-scroll#readme
- 애니메이션: framer-motion — https://www.npmjs.com/package/framer-motion
- 슬라이더/캐러셀: Swiper — https://swiperjs.com/demos

### 문서 기반 작성 원칙 (필수)

- 위 기술 스택으로 코드를 작성/수정할 때는 반드시 **최신 공식 문서의 지침에 근거**해서 작성한다. 기억이나 관행에 의존해 추측하지 않는다.
- 특히 버전에 민감한 API(Next.js App Router의 서버/클라이언트 컴포넌트·라우트 핸들러·`next.config`, React 19의 훅/`use`/액션, TypeScript 설정, SASS 모듈 문법 등)는 구현 전에 해당 공식 문서를 확인한다.
- 최신 문서 확인이 필요하면 **context7 MCP**(`resolve-library-id` → `query-docs`)로 해당 라이브러리 문서를 조회한 뒤 작성한다. 훈련 데이터가 최신 변경을 반영하지 못할 수 있으므로, 잘 안다고 생각되는 경우에도 확인을 우선한다.
- 문서와 어긋나는 방식(예: deprecated API, 구버전 패턴)을 발견하면 그대로 두지 말고 최신 문서 기준으로 바로잡는다.

## 디렉토리 구조 (App Router, src 디렉토리 사용)

- `src/app/` — 라우팅(페이지/레이아웃). 파일 기반 라우팅을 따릅니다.
- `src/components/` — 재사용 React 컴포넌트 + 대응하는 `.scss`
- `src/styles/` — 전역 스타일 및 디자인 토큰(`src/styles/tokens.scss`)

## dev 서버 작업 규칙 (필수)

- 이 프로젝트는 사용자가 별도 터미널에서 직접 `npm run dev`를 띄워 3000번 포트로 확인하는 경우가 많다. 확인 목적으로 dev 서버를 실행했다면(백그라운드 포함) **확인이 끝나는 즉시 반드시 프로세스를 종료**한다. 켜둔 채로 방치하면 사용자 쪽 dev 서버와 포트/`.next` 파일이 충돌해 3001로 밀리거나 EPERM 에러가 발생한다.
- 코드 수정 작업 후에는 반드시 dev 서버(또는 빌드)를 통해 **실제로 정상 동작하는지, 에러가 없는지 직접 확인**한 뒤에 작업 완료로 보고한다. 타입체크만으로 끝내지 않는다.

## 언어 및 커뮤니케이션 규칙

- any 타입 사용 금지
- 컴포넌트 분리 및 재사용
- sass 사용 시 중복 코드 최소화를 위해 변수 및 함수 사용 권장 (단 길이는 제외)
- 네스팅 깊이: 최대 3depth까지
- style 작업 시 꾸밈 요소는 ::after 와 ::before 같은 가상 선택자로 작업
- 디자인 토큰은 `src/styles/tokens.scss`에 CSS 변수로 정의하고, 컴포넌트 SCSS에서 하드코딩 대신 이 변수를 참조
