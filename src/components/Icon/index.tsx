interface IconProps {
  /** Material Symbols 아이콘 이름 (예: "search", "arrow_forward") */
  name: string;
  className?: string;
}

/**
 * Material Symbols Outlined 아이콘 래퍼.
 * 아이콘은 장식 요소이므로 항상 aria-hidden 처리한다.
 * (의미 전달이 필요한 경우 감싸는 버튼/링크에 aria-label 을 부여할 것)
 */
export default function Icon({ name, className }: IconProps) {
  return (
    <span
      className={
        className
          ? `material-symbols-outlined ${className}`
          : "material-symbols-outlined"
      }
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
