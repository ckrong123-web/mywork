import Image from "next/image";
import Container from "../../Container";
import Icon from "../../Icon";
import { withBasePath } from "../../../lib/basePath";
import type { VenueLocation } from "../types";
import "./VenueSection.scss";

interface VenueSectionProps {
  location: VenueLocation;
}

const MAP_PLACEHOLDER = withBasePath("/images/detail/map-placeholder.jpg");

export default function VenueSection({ location }: VenueSectionProps) {
  const map = location.map ?? {
    src: MAP_PLACEHOLDER,
    alt: `${location.name} 위치 지도(예시)`,
  };

  return (
    <section className="venue" aria-labelledby="venue-heading">
      <Container>
        <h2 id="venue-heading" className="venue__heading">
          Venue Location
        </h2>

        <div className="venue__grid">
          <div className="venue__map">
            <Image
              src={map.src}
              alt=""
              fill
              sizes="(min-width:768px) 66vw, 100vw"
              className="venue__map-image"
            />
            <span className="venue__pin" aria-hidden="true">
              <Icon name="location_on" className="venue__pin-icon" />
            </span>
          </div>

          <div className="venue__info">
            <div className="venue__info-head">
              <h4 className="venue__name">{location.name}</h4>
              <p className="venue__address">{location.address}</p>
            </div>

            <p className="venue__row">
              <Icon name="directions_subway" className="venue__row-icon" />
              <span className="venue__row-body">
                <span className="venue__row-label">Subway</span>
                <span className="venue__row-value">{location.subway}</span>
              </span>
            </p>

            <p className="venue__row">
              <Icon name="call" className="venue__row-icon" />
              <span className="venue__row-body">
                <span className="venue__row-label">Call</span>
                <span className="venue__row-value">{location.phone}</span>
              </span>
            </p>

            <button type="button" className="venue__directions" disabled>
              Get Directions
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
