"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "../Container";
import Icon from "../Icon";
import ListCard from "../ListCard";
import type { ListItem } from "../../data/home";
import "./ListExplorer.scss";

type TabKey = "all" | "ongoing" | "upcoming" | "ended";
type SortKey = "latest" | "popular" | "closing";

type RankItemU = Extract<ListItem, { kind: "rank" }>;
type TicketItemU = Extract<ListItem, { kind: "ticket" }>;
type GenreItemU = Extract<ListItem, { kind: "genre" }>;

interface ListExplorerProps {
  items: ListItem[];
  hideControls?: boolean;
  defaultSort?: SortKey;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "upcoming", label: "Upcoming" },
  { key: "ended", label: "Ended" },
];

function deriveStatus(item: ListItem): TabKey | null {
  switch (item.kind) {
    case "rank":
      return "ongoing";
    case "ticket":
      return "upcoming";
    case "genre":
      return null;
  }
}

function ddayNumber(badge: string): number {
  return Number(badge.replace(/[^0-9]/g, ""));
}

function sortVisible(items: ListItem[], sortKey: SortKey): ListItem[] {
  const ranks = items.filter((i): i is RankItemU => i.kind === "rank");
  const tickets = items.filter((i): i is TicketItemU => i.kind === "ticket");
  const genres = items.filter((i): i is GenreItemU => i.kind === "genre");

  const ranksByOriginal = [...ranks].sort(
    (a, b) => Number(a.rank) - Number(b.rank)
  );

  switch (sortKey) {
    case "popular": {
      const ranksByPercent = [...ranks].sort(
        (a, b) => parseFloat(b.percent) - parseFloat(a.percent)
      );
      return [...ranksByPercent, ...tickets, ...genres];
    }
    case "closing": {
      const ticketsByClosing = [...tickets].sort(
        (a, b) => ddayNumber(a.badge) - ddayNumber(b.badge)
      );
      return [...ticketsByClosing, ...ranksByOriginal, ...genres];
    }
    case "latest":
    default: {
      const ticketsByDatetime = [...tickets].sort((a, b) =>
        b.datetime.localeCompare(a.datetime)
      );
      return [...ticketsByDatetime, ...ranksByOriginal, ...genres];
    }
  }
}

export default function ListExplorer({
  items,
  hideControls = false,
  defaultSort = "latest",
}: ListExplorerProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category")?.toLowerCase() ?? null;

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>(defaultSort);

  const visible = useMemo(() => {
    const byCategory = category
      ? items.filter(
          (item) =>
            item.kind !== "genre" && item.genre.toLowerCase() === category
        )
      : items;
    const filtered =
      activeTab === "all"
        ? byCategory
        : byCategory.filter((item) => deriveStatus(item) === activeTab);
    return sortVisible(filtered, sortKey);
  }, [items, category, activeTab, sortKey]);

  return (
    <section className="list-explorer">
      {!hideControls && (
        <div className="list-explorer__bar">
          <Container className="list-explorer__bar-inner">
            <div
              className="list-explorer__tabs"
              role="tablist"
              aria-label="공연 상태 필터"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  className={
                    activeTab === tab.key
                      ? "list-explorer__tab list-explorer__tab--active"
                      : "list-explorer__tab"
                  }
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="list-explorer__sort">
              <Icon name="sort" className="list-explorer__sort-icon" />
              <select
                aria-label="정렬 기준"
                className="list-explorer__select"
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
              >
                <option value="latest">Latest Release</option>
                <option value="popular">Most Popular</option>
                <option value="closing">Closing Soon</option>
              </select>
            </div>
          </Container>
        </div>
      )}

      <Container className="list-explorer__results">
        {visible.length > 0 ? (
          <ul className="list-explorer__grid">
            {visible.map((item) => (
              <li key={item.slug} className="list-explorer__item">
                <ListCard item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="list-explorer__empty" aria-live="polite">
            해당 데이터가 없습니다.
          </p>
        )}
      </Container>
    </section>
  );
}
