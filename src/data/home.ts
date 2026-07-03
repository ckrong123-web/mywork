import type { RankItem } from "../components/RankCard";
import type { TicketItem } from "../components/TicketCard";
import type { GenreItem } from "../components/GenreCard";
import type {
  MembershipData,
  NoticeItem,
} from "../components/NoticePromotion";

export const RANK_ITEMS: RankItem[] = [
  {
    rank: "01",
    title: "Wicked",
    genre: "MUSICAL",
    venue: "BLUE SQUARE",
    percent: "8.5%",
    image: { src: "/images/rank-01-wicked.jpg", alt: "Wicked 공연 포스터" },
    offset: "down",
    href: "#",
  },
  {
    rank: "02",
    title: "Hamilton",
    genre: "MUSICAL",
    venue: "SEJONG CENTER",
    percent: "7.2%",
    image: { src: "/images/rank-02-hamilton.jpg", alt: "Hamilton 공연 포스터" },
    offset: "up",
    href: "#",
  },
  {
    rank: "03",
    title: "Les Misérables",
    genre: "MUSICAL",
    venue: "HANNAM HALL",
    percent: "6.9%",
    image: {
      src: "/images/rank-03-lesmiserables.jpg",
      alt: "Les Misérables 공연 포스터",
    },
    offset: "down",
    href: "#",
  },
  {
    rank: "04",
    title: "The Play",
    genre: "PLAY",
    venue: "SEOUL ARTS CENTER",
    percent: "5.5%",
    image: { src: "/images/rank-04-theplay.jpg", alt: "The Play 공연 포스터" },
    offset: "up",
    href: "#",
  },
];

export const TICKET_ITEMS: TicketItem[] = [
  {
    badge: "D-3",
    badgeTone: "primary",
    datetime: "2024.11.20 14:00",
    title: "CHICAGO: The Musical",
    description:
      "열정적인 재즈와 매혹적인 퍼포먼스의 귀환. 브로드웨이 최장기 공연의 매력을 경험하세요.",
    image: { src: "/images/ticket-chicago.jpg", alt: "CHICAGO: The Musical 포스터" },
    reminderHref: "#",
  },
  {
    badge: "D-7",
    badgeTone: "tertiary",
    datetime: "2024.11.24 10:00",
    title: "Beethoven Symphony No. 9",
    description:
      "연말을 장식하는 장엄한 선율의 대서사시. 환희의 송가가 울려 퍼지는 감동의 순간.",
    image: {
      src: "/images/ticket-beethoven.jpg",
      alt: "Beethoven Symphony No. 9 포스터",
    },
    reminderHref: "#",
  },
];

export const GENRE_ITEMS: GenreItem[] = [
  {
    number: "01",
    title: "Musical",
    description: "음악과 춤이 어우러진 화려한 감동의 무대를 확인하세요.",
    image: { src: "/images/genre-musical.jpg", alt: "Musical 장르 이미지" },
    offset: false,
    href: "#",
  },
  {
    number: "02",
    title: "Play",
    description: "배우들의 숨소리까지 느껴지는 깊이 있는 스토리텔링.",
    image: { src: "/images/genre-play.jpg", alt: "Play 장르 이미지" },
    offset: true,
    href: "#",
  },
  {
    number: "03",
    title: "Concert",
    description: "전율이 느껴지는 사운드와 아티스트의 환상적인 라이브.",
    image: { src: "/images/genre-concert.jpg", alt: "Concert 장르 이미지" },
    offset: false,
    href: "#",
  },
];

export const MEMBERSHIP: MembershipData = {
  label: "MEMBERSHIP ONLY",
  titleLead: "StageHub",
  titleItalic: "Gold Pass",
  titleTail: "Membership",
  description: "선예매 권한과 멤버십 전용 20% 할인을 가장 먼저 만나보세요.",
  cta: { label: "JOIN NOW", href: "#" },
};

export const NOTICES: NoticeItem[] = [
  { date: "2024.11.15", title: "시스템 정기 점검 안내 (11/25)", href: "#" },
  { date: "2024.11.12", title: "겨울 시즌 뮤지컬 조기예매 이벤트", href: "#" },
  { date: "2024.11.10", title: "티켓 취소 및 환불 규정 변경 안내", href: "#" },
];
