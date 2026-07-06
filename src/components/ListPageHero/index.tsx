"use client";

import { useSearchParams } from "next/navigation";
import ListHero from "../ListHero";
import { withBasePath } from "../../lib/basePath";

const CATEGORY_TITLES: Record<string, string> = {
  musical: "MUSICAL",
  play: "PLAY",
  concert: "CONCERT",
  exhibit: "EXHIBIT",
};

const CATEGORY_IMAGES: Record<string, { src: string; alt: string }> = {
  musical: {
    src: withBasePath("/images/list-hero-musical.jpg"),
    alt: "뮤지컬 공연장 전경",
  },
  play: {
    src: withBasePath("/images/list-hero-play.jpg"),
    alt: "연극 공연장 전경",
  },
  concert: {
    src: withBasePath("/images/list-hero-concert.jpg"),
    alt: "콘서트 공연장 전경",
  },
};

export default function ListPageHero() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category")?.toLowerCase() ?? null;
  const title = (category && CATEGORY_TITLES[category]) || "ALL SHOWS";
  const image = (category && CATEGORY_IMAGES[category]) || undefined;

  return <ListHero title={title} image={image} />;
}
