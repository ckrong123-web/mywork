"use client";

import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "../Container";
import Icon from "../Icon";
import Button from "../Button";
import "./Header.scss";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems?: NavItem[];
}

const DEFAULT_NAV: NavItem[] = [
  { label: "MUSICAL", href: "/list?category=musical" },
  { label: "PLAY", href: "/list?category=play" },
  { label: "CONCERT", href: "/list?category=concert" },
  { label: "EXHIBIT", href: "/list?category=exhibit" },
];

function useActiveHref(): (href: string) => boolean {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const currentUrl = query ? `${pathname}?${query}` : pathname;
  return (href: string) => href === currentUrl;
}

function DesktopNav({ navItems }: { navItems: NavItem[] }) {
  const isActive = useActiveHref();

  return (
    <nav className="header__nav" aria-label="주 메뉴">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            isActive(item.href)
              ? "header__link header__link--active"
              : "header__link"
          }
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav({
  navItems,
  onLinkClick,
}: {
  navItems: NavItem[];
  onLinkClick: () => void;
}) {
  const isActive = useActiveHref();

  return (
    <nav className="header__mobile-nav" aria-label="모바일 메뉴">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            isActive(item.href)
              ? "header__mobile-link header__mobile-link--active"
              : "header__mobile-link"
          }
          aria-current={isActive(item.href) ? "page" : undefined}
          onClick={onLinkClick}
        >
          {item.label}
        </Link>
      ))}
      <Button type="button" variant="text" className="header__mobile-login">
        LOGIN
      </Button>
    </nav>
  );
}

function StaticNav({
  navItems,
  className,
  linkClassName,
}: {
  navItems: NavItem[];
  className: string;
  linkClassName: string;
}) {
  return (
    <nav className={className} aria-label="주 메뉴">
      {navItems.map((item) => (
        <Link key={item.label} href={item.href} className={linkClassName}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Header({ navItems = DEFAULT_NAV }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Container className="header__inner">
        <Link href="/" className="header__logo" aria-label="LOOOGOO 홈">
          LOOOGOO
        </Link>

        <Suspense
          fallback={
            <StaticNav
              navItems={navItems}
              className="header__nav"
              linkClassName="header__link"
            />
          }
        >
          <DesktopNav navItems={navItems} />
        </Suspense>

        <div className="header__actions">
          <Button type="button" variant="icon" aria-label="검색">
            <Icon name="search" />
          </Button>
          <span className="header__divider" aria-hidden="true" />
          <Button type="button" variant="text" className="header__login">
            LOGIN
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="header__ticket"
          >
            MY TICKET
          </Button>
          <Button
            type="button"
            variant="icon"
            className="header__hamburger"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </Button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        className={
          menuOpen
            ? "header__mobile header__mobile--open"
            : "header__mobile"
        }
        hidden={!menuOpen}
      >
        <Suspense
          fallback={
            <StaticNav
              navItems={navItems}
              className="header__mobile-nav"
              linkClassName="header__mobile-link"
            />
          }
        >
          <MobileNav
            navItems={navItems}
            onLinkClick={() => setMenuOpen(false)}
          />
        </Suspense>
      </div>
    </header>
  );
}
