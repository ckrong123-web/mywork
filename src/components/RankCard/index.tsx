import Image from "next/image";
import Link from "next/link";
import type { ShowDetail } from "../ListDetail/types";
import "./RankCard.scss";

export interface RankItem {
  slug: string;
  rank: string;
  title: string;
  genre: string;
  percent: string;
  image: { src: string; alt: string };
  href: string;
  detail?: ShowDetail;
}

type RankCardProps = RankItem;

export default function RankCard({
  rank,
  title,
  genre,
  image,
  href,
  detail,
}: RankCardProps) {
  const venue = detail?.location.name ?? "";

  return (
    <Link href={href} className="rank-card" data-rank={rank}>
      <div className="rank-card__frame">
        <div className="rank-card__poster">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 70vw"
            className="rank-card__image"
          />
        </div>
        <div className="rank-card__body">
          <h3 className="rank-card__title">{title}</h3>
          <div className="rank-card__meta">
            <span className="rank-card__genre">
              {genre} | {venue}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
