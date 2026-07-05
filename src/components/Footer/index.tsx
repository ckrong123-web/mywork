import Link from "next/link";
import Icon from "../Icon";
import Button from "../Button";
import "./Footer.scss";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  columns?: FooterColumn[];
  intro?: string;
  newsletterDesc?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "SERVICES",
    links: [
      { label: "Musical", href: "#" },
      { label: "Theater", href: "#" },
      { label: "Concert", href: "#" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Notice", href: "#" },
      { label: "Q&A", href: "#" },
    ],
  },
];

const DEFAULT_INTRO =
  "프리미엄 공연 예매 플랫폼 LOOOGOO. 공연의 감동을 가장 특별하게 전달합니다.";
const DEFAULT_NEWSLETTER_DESC = "공연 오픈 소식을 가장 빠르게 받아보세요.";

export default function Footer({
  columns = DEFAULT_COLUMNS,
  intro = DEFAULT_INTRO,
  newsletterDesc = DEFAULT_NEWSLETTER_DESC,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__grid">
        {/* 브랜드 */}
        <div className="footer__brand">
          <Link href="/" aria-label="LOOOGOO 홈" className="footer__logo">
            LOOOGOO
          </Link>
          <p className="footer__intro">{intro}</p>
          <div className="footer__social">
            <Button
              type="button"
              variant="ghost"
              className="footer__social-btn"
              aria-label="웹사이트"
            >
              <Icon name="public" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="footer__social-btn"
              aria-label="공유"
            >
              <Icon name="share" />
            </Button>
          </div>
        </div>

        {/* 링크 컬럼 */}
        {columns.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={col.title}>
            <h3 className="footer__col-title">{col.title}</h3>
            <ul className="footer__links">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* 뉴스레터 */}
        <div className="footer__newsletter">
          <h3 className="footer__col-title">NEWSLETTER</h3>
          <p className="footer__newsletter-desc">{newsletterDesc}</p>
          <form className="footer__form">
            <label htmlFor="footer-email" className="footer__sr-only">
              이메일 주소
            </label>
            <input
              id="footer-email"
              type="email"
              className="footer__input"
              placeholder="your@email.com"
              aria-label="이메일 주소"
            />
            <Button
              type="submit"
              variant="icon"
              className="footer__submit"
              aria-label="구독"
            >
              <Icon name="arrow_forward" />
            </Button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">© 2026 LOOOGOO ALL RIGHTS RESERVED.</p>
        <div className="footer__legal">
          <Link href="#" className="footer__legal-link">
            Privacy Policy
          </Link>
          <span className="footer__legal-sep" aria-hidden="true">
            ·
          </span>
          <Link href="#" className="footer__legal-link">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
