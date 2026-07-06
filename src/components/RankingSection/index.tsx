"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Container from "../Container";
import Icon from "../Icon";
import Button from "../Button";
import RankCard, { type RankItem } from "../RankCard";
import "swiper/css";
import "./RankingSection.scss";

const WEEKLY_TOP_LIMIT = 10;
const REVEAL_RANK_LIMIT = 4;

interface RankingSectionProps {
  items: RankItem[];
  viewAllHref: string;
}

export default function RankingSection({
  items,
  viewAllHref,
}: RankingSectionProps) {
  const displayItems = items.slice(0, WEEKLY_TOP_LIMIT);

  return (
    <section className="ranking" aria-labelledby="ranking-title">
      <Container
        className="ranking__header"
        data-scroll
        data-scroll-offset="15%, 0%"
      >
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

      <div
        className="ranking__scroller-wrap"
        data-scroll
        data-scroll-offset="20%, 0%"
      >
        <Swiper
          className="ranking__swiper"
          loop
          loopAdditionalSlides={4}
          slidesPerGroup={1}
          slidesPerView={1.4}
          spaceBetween={16}
          breakpoints={{
            768: { slidesPerView: 2.4, spaceBetween: 24 },
            1024: { slidesPerView: 3.5, spaceBetween: 32 },
          }}
        >
          {displayItems.map((item) => {
            const rank = Number(item.rank);
            const isEven = rank % 2 === 0;
            const isReveal = rank <= REVEAL_RANK_LIMIT;
            const className = [
              "ranking__item",
              isEven && "ranking__item--even",
              isReveal && "ranking__item--reveal",
              isReveal && `ranking__item--reveal-${rank}`,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <SwiperSlide key={item.rank} className={className}>
                <RankCard {...item} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
