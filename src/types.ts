export type Page =
  | "home"
  | "apartments"
  | "offers"
  | "gallery"
  | "contact"
  | "admin"
  | "applications"
  | "five-star"
  | "healthy"
  | "easy"
  | "solo"
  | "studio"
  | "soho";

export interface DBImage {
  id: number;
  url: string;
  category: string;
  alt: string;
  created_at: string;
}
