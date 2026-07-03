import Image from "next/image";
import Link from "next/link";
import "./GenreCard.scss";

export interface GenreItem {
  number: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  offset?: boolean;
  href: string;
}

type GenreCardProps = GenreItem;

export default function GenreCard({
  number,
  title,
  description,
  image,
  offset = false,
  href,
}: GenreCardProps) {
  return (
    <Link
      href={href}
      className={offset ? "genre-card genre-card--offset" : "genre-card"}
      aria-label={`${title} 공연 보기`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="genre-card__image"
      />
      <span className="genre-card__gradient" aria-hidden="true" />
      <div className="genre-card__body">
        <span className="genre-card__number">{number}</span>
        <h3 className="genre-card__title">{title}</h3>
        <span className="genre-card__underline" aria-hidden="true" />
        <p className="genre-card__desc">{description}</p>
      </div>
    </Link>
  );
}
