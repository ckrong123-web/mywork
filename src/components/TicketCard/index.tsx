import Image from "next/image";
import Icon from "../Icon";
import Button from "../Button";
import "./TicketCard.scss";

export type BadgeTone = "primary" | "tertiary";

export interface TicketItem {
  badge: string;
  badgeTone: BadgeTone;
  datetime: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  reminderHref?: string;
}

type TicketCardProps = TicketItem;

export default function TicketCard({
  badge,
  badgeTone,
  datetime,
  title,
  description,
  image,
}: TicketCardProps) {
  return (
    <article className="ticket-card">
      <div className="ticket-card__poster">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="128px"
          className="ticket-card__image"
        />
      </div>
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
        <h3 className="ticket-card__title">{title}</h3>
        <p className="ticket-card__desc">{description}</p>
        <Button type="button" variant="link">
          SET REMINDER
        </Button>
      </div>
    </article>
  );
}
