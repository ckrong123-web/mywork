import Icon from "../Icon";
import Button from "../Button";
import "./NoticePromotion.scss";

export interface NoticeItem {
  date: string;
  title: string;
  href: string;
}

export interface MembershipData {
  label: string;
  titleLead: string;
  titleItalic: string;
  titleTail: string;
  description: string;
  cta: { label: string; href: string };
}

interface NoticePromotionProps {
  membership: MembershipData;
  notices: NoticeItem[];
}

export default function NoticePromotion({
  membership,
  notices,
}: NoticePromotionProps) {
  return (
    <section className="notice-promo" aria-labelledby="notice-promo-title">
      <h2 id="notice-promo-title" className="notice-promo__sr-title">
        멤버십 및 공지사항
      </h2>
      <div className="notice-promo__grid">
        {/* 멤버십 배너 */}
        <div className="membership">
          <div className="membership__content">
            <p className="membership__label">
              <span className="membership__label-line" aria-hidden="true" />
              {membership.label}
            </p>
            <h3 className="membership__title">
              {membership.titleLead}{" "}
              <em className="membership__title-em">{membership.titleItalic}</em>{" "}
              {membership.titleTail}
            </h3>
            <p className="membership__desc">{membership.description}</p>
            <Button href={membership.cta.href} variant="white">
              {membership.cta.label}
            </Button>
          </div>
        </div>

        {/* NOTICE 패널 */}
        <div className="notice">
          <div className="notice__header">
            <h3 className="notice__heading">NOTICE</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="notice__more"
              aria-label="공지 더보기"
            >
              <Icon name="add" />
            </Button>
          </div>
          <ul className="notice__list">
            {notices.map((item) => (
              <li key={item.date} className="notice__item">
                <a href={item.href} className="notice__link">
                  <span className="notice__date">{item.date}</span>
                  <span className="notice__title">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
