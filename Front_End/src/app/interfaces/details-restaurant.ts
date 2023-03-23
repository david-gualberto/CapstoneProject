export interface DetailsRestaurant {
  location_id: string;
  name: string;
  latitude: string;
  longitude: string;
  num_reviews: string;
  timezone: string;
  location_string: string;
  awards: any[];
  doubleclick_zone: string;
  preferred_map_engine: string;
  raw_ranking: string;
  ranking_geo: string;
  ranking_geo_id: string;
  ranking_position: string;
  ranking_denominator: string;
  ranking_category: string;
  ranking: string;
  distance: null;
  distance_string: null;
  bearing: null;
  rating: string;
  is_closed: boolean;
  open_now_text: string;
  is_long_closed: boolean;
  price_level: string;
  price: string;
  neighborhood_info: neighborhood[];
  description: string;
  web_url: string;
  write_review: string;
  ancestors: any[];
  category: {};
  subcategory: any[];
  parent_display_name: string;
  is_jfy_enabled: boolean;
  nearest_metro_station: any[];
  phone: string;
  website: string;
  email: string;
  address_obj: address;
  address: string;
  hours: any;
  is_candidate_for_contact_info_suppression: boolean;
  cuisine: cuisine[];
  dietary_restrictions: restrictions[];
  photo: photoRestaurant;
  tags: null;
  display_hours: any;
}

export interface address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  postalcode: string;
}

export interface cuisine {
  key: string;
  name: string;
}

export interface restrictions {
  key: string;
  name: string;
}

export interface photoRestaurant {
  id: string;
  caption: string;
  published_date: string;
  helpful_votes: string;
  is_blessed: boolean;
  uploaded_date: string;
  images: sizeImage;
}

export interface sizeImage {
  small: image;
  thumbnail: image;
  original: image;
  large: image;
  medium: image;
}

export interface image {
  url: string;
  width: string;
  height: string;
}

export interface neighborhood {
  location_id: string;
  name: string;
}
