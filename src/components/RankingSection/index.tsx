import Container from "../Container";
import Icon from "../Icon";
import Button from "../Button";
import RankCard, { type RankItem } from "../RankCard";
import "./RankingSection.scss";

interface RankingSectionProps {
  items: RankItem[];
  viewAllHref: string;
}

export default function RankingSection({
  items,
  viewAllHref,
}: RankingSectionProps) {
  return (
    <section className="ranking" aria-labelledby="ranking-title">
      <Container className="ranking__header">
        <div className="ranking__heading">
          <h2 id="ranking-title" className="ranking__title">
            WEEKLY TOP 10
            <span className="ranking__title-line" aria-hidden="true" />
          </h2>
          <p className="ranking__subtitle">
            이번 주 가장 사랑받은 화제의 공연 랭킹
          </p>
        </div>
        <Button
          href={viewAllHref}
          variant="text"
          className="ranking__view-all"
          aria-label="전체 랭킹 보기"
        >
          VIEW ALL
          <span className="ranking__view-all-icon" aria-hidden="true">
            <Icon name="arrow_forward" />
          </span>
        </Button>
      </Container>

      <div className="ranking__scroller-wrap">
        <ul className="ranking__scroller no-scrollbar">
          {items.map((item) => (
            <li key={item.rank} className="ranking__item">
              <RankCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
