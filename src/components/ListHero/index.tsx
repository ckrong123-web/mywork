import Image from "next/image";
import Container from "../Container";
import { withBasePath } from "../../lib/basePath";
import "./ListHero.scss";

interface ListHeroProps {
  title?: string;
  subtitle?: string;
  image?: { src: string; alt: string };
}

const DEFAULT_IMAGE = {
  src: withBasePath("/images/list-hero.jpg"),
  alt: "공연장 내부 전경",
};

export default function ListHero({
  title = "ALL SHOWS",
  subtitle = "지금 무대 위, 랭킹부터 티켓 오픈까지 한눈에.",
  image = DEFAULT_IMAGE,
}: ListHeroProps) {
  return (
    <section className="list-hero" aria-labelledby="list-hero-title">
      <div className="list-hero__media" aria-hidden="true">
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="list-hero__image"
        />
      </div>

      <Container className="list-hero__content">
        <h1 id="list-hero-title" className="list-hero__title">
          {title}
        </h1>
        <p className="list-hero__subtitle">{subtitle}</p>
      </Container>
    </section>
  );
}
