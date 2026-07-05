import Image from "next/image";
import Container from "../../Container";
import Button from "../../Button";
import "./GenreDetail.scss";

interface GenreDetailProps {
  number: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
}

export default function GenreDetail({
  number,
  title,
  description,
  image,
}: GenreDetailProps) {
  return (
    <article className="genre-detail">
      <header className="genre-detail__hero">
        <div className="genre-detail__media">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="genre-detail__image"
          />
        </div>

        <Container className="genre-detail__content">
          <p className="genre-detail__eyebrow">
            <span className="genre-detail__number">{number}</span>
            <span className="genre-detail__badge">CATEGORY</span>
          </p>
          <h1 className="genre-detail__title">{title}</h1>
          <p className="genre-detail__desc">{description}</p>
          <Button href="/list" variant="glass" className="genre-detail__cta">
            이 장르의 공연 보기
          </Button>
        </Container>
      </header>
    </article>
  );
}
