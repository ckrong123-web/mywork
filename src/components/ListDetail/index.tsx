import Container from "../Container";
import type { ListItem } from "../../data/home";
import type { ShowDetail } from "./types";
import DetailHero from "./DetailHero";
import InfoCards from "./InfoCards";
import SynopsisSection from "./SynopsisSection";
import CastSection from "./CastSection";
import BookingWidget from "./BookingWidget";
import VenueSection from "./VenueSection";
import GenreDetail from "./GenreDetail";
import "./ListDetail.scss";

interface ListDetailProps {
  item: ListItem;
}

interface RichItem {
  title: string;
  image: { src: string; alt: string };
  detail: ShowDetail;
}

function RichDetail({ title, image, detail }: RichItem) {
  const heroImage = detail.heroImage ?? {
    src: image.src,
    alt: `${title} 공연 무대 장면`,
  };
  const synopsisImage = detail.synopsisImage ??
    detail.heroImage ?? {
      src: image.src,
      alt: `${title} 시놉시스 장면`,
    };

  return (
    <article className="list-detail">
      <DetailHero
        title={title}
        tagline={detail.tagline}
        heroDescription={detail.heroDescription}
        schedule={detail.schedule}
        venueName={detail.location.name}
        image={heroImage}
      />

      <Container className="list-detail__body">
        <div className="list-detail__grid">
          <div className="list-detail__main">
            <InfoCards
              runtime={detail.runtime}
              ageRating={detail.ageRating}
              priceRange={detail.priceRange}
            />
            <SynopsisSection
              paragraphs={detail.synopsis}
              image={synopsisImage}
            />
            <CastSection cast={detail.cast} />
          </div>

          <div className="list-detail__aside">
            <BookingWidget
              sessions={detail.sessions}
              bookingStatus={detail.bookingStatus}
              bookingFee={detail.bookingFee}
              priceRange={detail.priceRange}
            />
          </div>
        </div>
      </Container>

      <VenueSection location={detail.location} />
    </article>
  );
}

export default function ListDetail({ item }: ListDetailProps) {
  if (item.kind === "genre") {
    return (
      <GenreDetail
        number={item.number}
        title={item.title}
        description={item.description}
        image={item.image}
      />
    );
  }

  if (!item.detail) {
    return (
      <article className="list-detail">
        <DetailHero
          title={item.title}
          tagline=""
          heroDescription=""
          schedule=""
          venueName=""
          image={item.image}
        />
      </article>
    );
  }

  return (
    <RichDetail title={item.title} image={item.image} detail={item.detail} />
  );
}
