// `images.unoptimized: true` 상태의 next/image는 basePath를 자동으로 붙이지 않으므로
// `public/` 하위 정적 에셋 경로에는 이 헬퍼로 직접 basePath를 붙여야 한다.
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
