import type { ElementType, ReactNode } from "react";
import "./Container.scss";

interface ContainerProps {
  /** 렌더링할 태그 (기본 div) */
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * 공용 레이아웃 컨테이너.
 * max-width 1280 + 가운데 정렬 + 좌우 패딩(모바일 24 / 데스크톱 80)을 한 곳에서 관리.
 */
export default function Container({
  as: Tag = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={className ? `container ${className}` : "container"}>
      {children}
    </Tag>
  );
}
