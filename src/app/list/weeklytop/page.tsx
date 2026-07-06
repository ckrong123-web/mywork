import { Suspense } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ListHero from "../../../components/ListHero";
import ListExplorer from "../../../components/ListExplorer";
import SmoothScroll from "../../../components/SmoothScroll";
import { RANK_ITEMS, type ListItem } from "../../../data/home";

const WEEKLY_TOP_ITEMS: ListItem[] = RANK_ITEMS.map((item) => ({
  kind: "rank",
  ...item,
}));

export default function WeeklyTopPage() {
  return (
    <>
      <Header />
      <SmoothScroll>
        <main>
          <ListHero
            title="WEEKLY TOP 10"
            subtitle="이번 주, 가장 사랑받은 무대를 인기 순으로 확인하세요."
          />
          <Suspense fallback={null}>
            <ListExplorer
              items={WEEKLY_TOP_ITEMS}
              hideControls
              defaultSort="popular"
            />
          </Suspense>
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
