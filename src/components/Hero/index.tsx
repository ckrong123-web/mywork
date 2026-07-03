import Image from "next/image";
import Container from "../Container";
import Button from "../Button";
import "./Hero.scss";

interface CtaLink {
  label: string;
  href: string;
}

interface HeroProps {
  label: string;
  titleLines: [string, string];
  description: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  image: { src: string; alt: string };
}

export default function Hero({
  label,
  titleLines,
  description,
  primaryCta,
  secondaryCta,
  image,
}: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="hero__image"
        />
        <div className="hero__scrim" aria-hidden="true" />
      </div>

      <Container className="hero__content">
        <p className="hero__label">
          <span className="hero__label-line" aria-hidden="true" />
          {label}
        </p>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__title-line">{titleLines[0]}</span>
          <span className="hero__title-line hero__title-line--indent">
            {titleLines[1]}
          </span>
        </h1>

        <p className="hero__description">{description}</p>

        <div className="hero__actions">
          <Button
            href={primaryCta.href}
            variant="primary"
            size="lg"
            className="hero__cta"
          >
            {primaryCta.label}
          </Button>
          <Button href={secondaryCta.href} variant="glass" size="lg">
            {secondaryCta.label}
          </Button>
        </div>
      </Container>

      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-text">SCROLL</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
