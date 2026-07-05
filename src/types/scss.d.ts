// next/types/global.d.ts 는 CSS Modules(*.module.css, *.module.scss)만 선언하므로,
// 이 프로젝트처럼 전역(non-module) *.scss 를 side-effect import(`import "./Foo.scss"`)로
// 쓰는 경우 TypeScript가 모듈을 찾지 못해 에러를 낸다. 빌드는 webpack 로더가 처리하므로
// 문제 없지만, 타입체크가 통과하도록 앰비언트 선언을 추가한다.
declare module "*.scss";
declare module "*.css";
