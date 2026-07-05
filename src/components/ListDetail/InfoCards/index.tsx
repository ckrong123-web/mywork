import Icon from "../../Icon";
import "./InfoCards.scss";

interface InfoCardsProps {
  runtime: string;
  ageRating: string;
  priceRange: string;
}

const CARDS = [
  { icon: "schedule", label: "러닝타임", key: "runtime" },
  { icon: "person", label: "관람연령", key: "ageRating" },
  { icon: "confirmation_number", label: "티켓가격", key: "priceRange" },
] as const;

export default function InfoCards({
  runtime,
  ageRating,
  priceRange,
}: InfoCardsProps) {
  const values = { runtime, ageRating, priceRange };

  return (
    <section className="info-cards" aria-label="공연 정보">
      {CARDS.map((card) => (
        <div key={card.key} className="info-cards__card">
          <Icon name={card.icon} className="info-cards__icon" />
          <h3 className="info-cards__label">{card.label}</h3>
          <p className="info-cards__value">{values[card.key]}</p>
        </div>
      ))}
    </section>
  );
}
