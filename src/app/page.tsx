import Header from "../components/Header";
import Hero from "../components/Hero";
import RankingSection from "../components/RankingSection";
import TicketOpen from "../components/TicketOpen";
import GenreExplore from "../components/GenreExplore";
import NoticePromotion from "../components/NoticePromotion";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import {
  HERO_SLIDES,
  RANK_ITEMS,
  TICKET_ITEMS,
  GENRE_ITEMS,
  MEMBERSHIP,
  NOTICES,
} from "../data/home";

export default function Home() {
  return (
    <>
      <Header />
      <SmoothScroll>
        <main>
          <Hero slides={HERO_SLIDES} />
          <div className="hero-transition" aria-hidden="true" />
          <RankingSection items={RANK_ITEMS} viewAllHref="#" />
          <TicketOpen items={TICKET_ITEMS} />
          <GenreExplore items={GENRE_ITEMS} />
          <NoticePromotion membership={MEMBERSHIP} notices={NOTICES} />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
