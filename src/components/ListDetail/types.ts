export interface CastMember {
  name: string;
  role: string;
  image?: { src: string; alt: string };
  bio?: string;
}

export interface VenueLocation {
  name: string;
  address: string;
  subway: string;
  phone: string;
  map?: { src: string; alt: string };
}

export interface ShowDetail {
  tagline: string;
  heroDescription: string;
  heroImage?: { src: string; alt: string };
  schedule: string;
  runtime: string;
  ageRating: string;
  priceRange: string;
  synopsis: string[];
  synopsisImage?: { src: string; alt: string };
  cast: CastMember[];
  sessions: string[];
  bookingStatus: string;
  bookingFee: string;
  location: VenueLocation;
}
