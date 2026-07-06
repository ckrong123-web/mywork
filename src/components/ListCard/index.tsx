import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "../Icon";
import type { ListItem } from "../../data/home";
import "./ListCard.scss";

interface ListCardProps {
  item: ListItem;
}

export default function ListCard({ item }: ListCardProps) {
  let badge: ReactNode = null;
  let meta: ReactNode = null;

  switch (item.kind) {
    case "rank":
      badge = (
        <span className="list-card__badge list-card__badge--ongoing">
          NOW PLAYING
        </span>
      );
      meta = (
        <div className="list-card__meta">
          <span className="list-card__meta-row">
            <Icon name="location_on" className="list-card__meta-icon" />
            {item.detail?.location.name}
          </span>
          <span className="list-card__meta-row">
            <Icon name="trending_up" className="list-card__meta-icon" />
            {item.genre} ·{" "}
            <span className="list-card__accent">{item.percent}</span>
          </span>
        </div>
      );
      break;
    case "ticket":
      badge = (
        <span
          className={`list-card__badge list-card__badge--${item.badgeTone}`}
        >
          {item.badge}
        </span>
      );
      meta = (
        <div className="list-card__meta">
          <span className="list-card__meta-row">
            <Icon name="calendar_today" className="list-card__meta-icon" />
            {item.datetime}
          </span>
        </div>
      );
      break;
    case "genre":
      meta = <p className="list-card__desc">{item.description}</p>;
      break;
  }

  return (
    <Link href={`/list/${item.slug}`} className={`list-card list-card--${item.kind}`}>
      <article className="list-card__frame">
        <div className="list-card__media">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
            className="list-card__image"
          />
          {badge}
        </div>
        <div className="list-card__body">
          <h3 className="list-card__title">{item.title}</h3>
          {meta}
        </div>
      </article>
    </Link>
  );
}
