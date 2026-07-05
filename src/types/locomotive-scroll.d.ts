// locomotive-scroll 는 자체 타입 선언을 배포하지 않고, react-locomotive-scroll 의
// module/*.d.ts 가 기대하는 LocomotiveScrollOptions/Scroll/ScrollInstance 명명된
// export 는 react-locomotive-scroll 패키지 안의 lib/@types/locomotive-scroll.d.ts 에만
// 정의되어 있다(타입 경로가 자동으로 로드되지 않는 패키징 누락). 그 선언을 그대로 옮겨
// module 해석이 실패하지 않도록 한다.
declare module "locomotive-scroll" {
  export type Vector2 = {
    x: number;
    y: number;
  };

  export interface LocomotiveScrollOptions {
    el?: Element;
    elMobile?: Element;
    name?: string;
    offset?: number;
    repeat?: boolean;
    smooth?: boolean;
    smoothMobile?: boolean;
    direction?: string;
    inertia?: number;
    class?: string;
    scrollbarClass?: string;
    scrollingClass?: string;
    draggingClass?: string;
    smoothClass?: string;
    initClass?: string;
    getSpeed?: boolean;
    getDirection?: boolean;
  }

  export type ScrollInstance = {
    scroll: Vector2;
    limit: number;
  };

  export default class LocomotiveScroll implements LocomotiveScrollOptions {
    el?: Element;
    elMobile?: Element;
    name?: string;
    offset?: number;
    repeat?: boolean;
    smooth?: boolean;
    smoothMobile?: boolean;
    direction?: string;
    inertia?: number;
    class?: string;
    scrollbarClass?: string;
    scrollingClass?: string;
    draggingClass?: string;
    smoothClass?: string;
    initClass?: string;
    getSpeed?: boolean;
    getDirection?: boolean;

    isMobile: boolean;
    options: LocomotiveScrollOptions;

    constructor(options?: LocomotiveScrollOptions);

    init(): void;
    update(): void;
    start(): void;
    stop(): void;
    scrollTo(
      target: Node | string | number,
      options?: {
        offset?: number;
        callback?: () => void;
        duration?: number;
        easing?: [number, number, number, number];
        disableLerp?: boolean;
      }
    ): void;
    setScroll(x: number, y: number): void;
    on(event: "call" | "scroll", func: (data: string | string[]) => void): void;
    destroy(): void;
  }

  export { LocomotiveScroll as Scroll };
}
