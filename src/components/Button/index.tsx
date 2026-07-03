import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import "./Button.scss";

export type ButtonVariant =
  | "primary" // 채움(primary-container): MY TICKET / Book Now(+CTA 보정)
  | "glass" // 유리질감: Learn More
  | "white" // 흰 배경: JOIN NOW
  | "link" // 밑줄 텍스트 링크: SET REMINDER
  | "text" // 순수 텍스트: LOGIN 등
  | "icon" // 아이콘 전용(형태 없음): search / hamburger / 뉴스레터 제출
  | "ghost"; // 원형 보더 아이콘: NOTICE add / footer social

export type ButtonSize = "sm" | "md" | "lg";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

function buildClass(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return ["btn", `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(" ");
}

/**
 * 공통 버튼. variant/size 로 스타일을 통일하고,
 * href 가 주어지면 <a>, 아니면 <button> 으로 렌더한다.
 * 아이콘 전용(variant="icon"/"ghost")은 호출부에서 aria-label 을 반드시 넘길 것.
 */
export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = buildClass(variant, size, className);

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
