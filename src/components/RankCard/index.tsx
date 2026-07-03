import Image from "next/image";
import Link from "next/link";
import "./RankCard.scss";

export interface RankItem {
  rank: string;
  title: string;
  genre: string;
  venue: string;
  percent: string;
  image: { src: string; alt: string };
  offset: "up" | "down";
  href: string;
}

type RankCardProps = RankItem;

export default function RankCard({
  rank,
  title,
  genre,
  venue,
  percent,
  image,
  offset,
  href,
}: RankCardProps) {
  return (
    <Link
      href={href}
      className={`rank-card rank-card--${offset}`}
      data-rank={rank}
    >
      <div className="rank-card__frame">
        <div className="rank-card__poster">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="280px"
            className="rank-card__image"
          />
        </div>
        <div className="rank-card__body">
          <h3 className="rank-card__title">{title}</h3>
          <div className="rank-card__meta">
            <span className="rank-card__genre">
              {genre} | {venue}
            </span>
            <span className="rank-card__percent">{percent}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
