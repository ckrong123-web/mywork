import Image from "next/image";
import "./SynopsisSection.scss";

interface SynopsisSectionProps {
  paragraphs: string[];
  image: { src: string; alt: string };
}

export default function SynopsisSection({
  paragraphs,
  image,
}: SynopsisSectionProps) {
  return (
    <section className="synopsis" aria-labelledby="synopsis-heading">
      <h2 id="synopsis-heading" className="synopsis__heading">
        Synopsis
      </h2>

      <figure className="synopsis__figure">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width:1024px) 60vw, 100vw"
          className="synopsis__image"
        />
      </figure>

      <div className="synopsis__body">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="synopsis__paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
