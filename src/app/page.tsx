import Header from "../components/Header";
import Hero from "../components/Hero";
import RankingSection from "../components/RankingSection";
import TicketOpen from "../components/TicketOpen";
import GenreExplore from "../components/GenreExplore";
import NoticePromotion from "../components/NoticePromotion";
import Footer from "../components/Footer";
import {
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
      <main>
        <Hero
          label="Now Playing — Charlotte Theater"
          titleLines={["THE PHANTOM", "OF THE OPERA"]}
          description="가면 속에 숨겨진 전설적인 사랑 이야기. 샤롯데씨어터에서 펼쳐지는 황홀한 고딕 로맨스의 정수를 경험하세요. 세계적인 제작진이 선보이는 압도적인 무대 메커니즘을 만나보실 수 있습니다."
          primaryCta={{ label: "Book Now", href: "#" }}
          secondaryCta={{ label: "Learn More", href: "#" }}
          image={{
            src: "/images/hero-phantom.jpg",
            alt: "The Phantom of the Opera 무대 장면",
          }}
        />
        <div className="hero-transition" aria-hidden="true" />
        <RankingSection items={RANK_ITEMS} viewAllHref="#" />
        <TicketOpen items={TICKET_ITEMS} />
        <GenreExplore items={GENRE_ITEMS} />
        <NoticePromotion membership={MEMBERSHIP} notices={NOTICES} />
      </main>
      <Footer />
    </>
  );
}
