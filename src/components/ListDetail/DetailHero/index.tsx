import Image from "next/image";
import Container from "../../Container";
import Icon from "../../Icon";
import Button from "../../Button";
import "./DetailHero.scss";

interface DetailHeroProps {
  title: string;
  tagline: string;
  heroDescription: string;
  schedule: string;
  venueName: string;
  image: { src: string; alt: string };
}

export default function DetailHero({
  title,
  tagline,
  heroDescription,
  schedule,
  venueName,
  image,
}: DetailHeroProps) {
  return (
    <header className="detail-hero">
      <div className="detail-hero__media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="detail-hero__image"
        />
      </div>

      <Container className="detail-hero__content">
        <div className="detail-hero__intro">
          <p className="detail-hero__tagline">
            <Icon name="verified" className="detail-hero__tagline-icon" />
            {tagline}
          </p>
          <h1 className="detail-hero__title">{title}</h1>
          <p className="detail-hero__desc">{heroDescription}</p>

          <div className="detail-hero__meta">
            <div className="detail-hero__meta-item">
              <span className="detail-hero__meta-label">VENUE</span>
              <span className="detail-hero__meta-value">{venueName}</span>
            </div>
            <span className="detail-hero__meta-divider" aria-hidden="true" />
            <div className="detail-hero__meta-item">
              <span className="detail-hero__meta-label">SCHEDULE</span>
              <span className="detail-hero__meta-value">{schedule}</span>
            </div>
          </div>
        </div>

        <div className="detail-hero__actions">
          <Button
            type="button"
            variant="ghost"
            className="detail-hero__action"
            aria-label="공유하기"
          >
            <Icon name="share" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="detail-hero__action"
            aria-label="찜하기"
          >
            <Icon name="favorite" />
          </Button>
        </div>
      </Container>
    </header>
  );
}
