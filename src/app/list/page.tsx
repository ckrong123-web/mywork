import { Suspense } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ListHero from "../../components/ListHero";
import ListPageHero from "../../components/ListPageHero";
import ListExplorer from "../../components/ListExplorer";
import SmoothScroll from "../../components/SmoothScroll";
import { LIST_ITEMS } from "../../data/home";

export default function ListPage() {
  return (
    <>
      <Header />
      <SmoothScroll>
        <main>
          <Suspense fallback={<ListHero />}>
            <ListPageHero />
          </Suspense>
          <Suspense fallback={null}>
            <ListExplorer items={LIST_ITEMS} />
          </Suspense>
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
