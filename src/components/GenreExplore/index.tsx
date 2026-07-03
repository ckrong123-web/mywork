import GenreCard, { type GenreItem } from "../GenreCard";
import "./GenreExplore.scss";

interface GenreExploreProps {
  items: GenreItem[];
}

export default function GenreExplore({ items }: GenreExploreProps) {
  return (
    <section className="genre-explore" aria-labelledby="genre-explore-title">
      <h2 id="genre-explore-title" className="genre-explore__title">
        EXPERIENCE THE STAGE
      </h2>
      <p className="genre-explore__subtitle">CHOOSE YOUR GENRE</p>
      <div className="genre-explore__grid">
        {items.map((item) => (
          <GenreCard key={item.number} {...item} />
        ))}
      </div>
    </section>
  );
}
