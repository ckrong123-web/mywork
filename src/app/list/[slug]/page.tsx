import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ListDetail from "../../../components/ListDetail";
import SmoothScroll from "../../../components/SmoothScroll";
import { LIST_ITEMS, getListItemBySlug } from "../../../data/home";

export function generateStaticParams() {
  return LIST_ITEMS.map((item) => ({ slug: item.slug }));
}

interface ListDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ListDetailPage({ params }: ListDetailPageProps) {
  const { slug } = await params;
  const item = getListItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <SmoothScroll>
        <main className="list-detail-page">
          <ListDetail item={item} />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
