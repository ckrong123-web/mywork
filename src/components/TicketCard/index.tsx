import Image from "next/image";
import Link from "next/link";
import Icon from "../Icon";
import Button from "../Button";
import type { ShowDetail } from "../ListDetail/types";
import "./TicketCard.scss";

export type BadgeTone = "primary" | "tertiary";

export interface TicketItem {
  slug: string;
  badge: string;
  badgeTone: BadgeTone;
  datetime: string;
  title: string;
  genre: string;
  description: string;
  image: { src: string; alt: string };
  reminderHref?: string;
  detail?: ShowDetail;
}

type TicketCardProps = TicketItem;

export default function TicketCard({
  slug,
  badge,
  badgeTone,
  datetime,
  title,
  description,
  image,
}: TicketCardProps) {
  const href = `/list/${slug}`;

  return (
    <article className="ticket-card">
      <Link href={href} className="ticket-card__poster" aria-label={`${title} 보기`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="128px"
          className="ticket-card__image"
        />
      </Link>
      <div className="ticket-card__body">
        <div className="ticket-card__meta">
          <span className={`ticket-card__badge ticket-card__badge--${badgeTone}`}>
            {badge}
          </span>
          <span className="ticket-card__date">
            <Icon name="calendar_today" className="ticket-card__date-icon" />
            {datetime}
          </span>
        </div>
        <h3 className="ticket-card__title">
          <Link href={href} className="ticket-card__title-link">
            {title}
          </Link>
        </h3>
        <p className="ticket-card__desc">{description}</p>
        <Button type="button" variant="link">
          SET REMINDER
        </Button>
      </div>
    </article>
  );
}
