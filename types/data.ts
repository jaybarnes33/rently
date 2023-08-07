export interface Listings {
  listing: any;
  has_user_bookmarked: boolean;
  covered_amenities: [];
  owner: {
    address: string;
    city: string;
    date_joined: string;
    email: string;
    first_name: string;
    gender: string;
    id: number;
    image: string;
    last_name: string;
    role: string;
    telephone: string | null;
    verified: boolean;
  };
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt?: string;
  location: string;
  type?: string;
  rating?: number;
  numberOfReviews?: number;
  occupants?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  total_reviews?: number;
}
