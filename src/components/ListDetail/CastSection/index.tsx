import Image from "next/image";
import type { CastMember } from "../types";
import "./CastSection.scss";

interface CastSectionProps {
  cast: CastMember[];
}

export default function CastSection({ cast }: CastSectionProps) {
  return (
    <section className="cast" aria-labelledby="cast-heading">
      <h2 id="cast-heading" className="cast__heading">
        Cast &amp; Creatives
      </h2>

      <ul className="cast__grid">
        {cast.map((member) => (
          <li key={`${member.name}-${member.role}`} className="cast__item">
            {member.image ? (
              <article className="cast__card cast__card--photo">
                <div className="cast__photo">
                  <Image
                    src={member.image.src}
                    alt={member.image.alt}
                    fill
                    sizes="(min-width:768px) 25vw, 50vw"
                    className="cast__photo-image"
                  />
                </div>
                <h4 className="cast__name">{member.name}</h4>
                <p className="cast__role">{member.role}</p>
              </article>
            ) : (
              <article className="cast__card cast__card--creative">
                <h4 className="cast__name">{member.name}</h4>
                <p className="cast__role">{member.role}</p>
                {member.bio ? <p className="cast__bio">{member.bio}</p> : null}
              </article>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
