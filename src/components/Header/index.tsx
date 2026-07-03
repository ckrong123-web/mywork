"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "../Container";
import Icon from "../Icon";
import Button from "../Button";
import "./Header.scss";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  navItems?: NavItem[];
}

const DEFAULT_NAV: NavItem[] = [
  { label: "MUSICAL", href: "#", active: true },
  { label: "PLAY", href: "#" },
  { label: "CONCERT", href: "#" },
  { label: "EXHIBIT", href: "#" },
];

export default function Header({ navItems = DEFAULT_NAV }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Container className="header__inner">
        <Link href="/" className="header__logo" aria-label="STAGEHUB 홈">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="STAGEHUB" width={160} height={40} />
        </Link>

        <nav className="header__nav" aria-label="주 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active ? "header__link header__link--active" : "header__link"
              }
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

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
        <nav className="header__mobile-nav" aria-label="모바일 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.active
                  ? "header__mobile-link header__mobile-link--active"
                  : "header__mobile-link"
              }
              aria-current={item.active ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button type="button" variant="text" className="header__mobile-login">
            LOGIN
          </Button>
        </nav>
      </div>
    </header>
  );
}
