import type { NextConfig } from "next";

// GitHub Pages(프로젝트 사이트: https://ckrong123-web.github.io/mywork/)에
// 배포할 때만 basePath/assetPrefix를 붙인다. GitHub Actions 워크플로우에서
// `GITHUB_PAGES=true npm run build` 로 빌드할 때만 true가 되고,
// 로컬 `npm run dev` / 일반 `npm run build`에는 영향을 주지 않는다.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/mywork";

const nextConfig: NextConfig = {
  // 순수 정적 콘텐츠(API 라우트/미들웨어/서버 액션 없음)이므로 static export 사용.
  output: "export",
  ...(isGithubPages && {
    basePath: repoBasePath,
    assetPrefix: `${repoBasePath}/`,
  }),
  // images.unoptimized 상태의 next/image는 src에 basePath를 자동으로 붙이지 않으므로,
  // public/ 하위 정적 이미지 경로에 수동으로 붙일 수 있게 클라이언트에 노출한다.
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? repoBasePath : "",
  },
  // static export는 기본 Image Optimization API(서버)를 사용할 수 없으므로 비활성화.
  images: {
    unoptimized: true,
  },
  // GitHub Pages는 각 라우트를 `폴더/index.html` 형태로 서빙할 때 가장 안정적으로
  // 동작하므로, export 결과물도 `route/index.html` 구조로 생성되도록 설정한다.
  trailingSlash: true,
};

export default nextConfig;
