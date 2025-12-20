
export interface Artwork {
  id: string;
  url: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  description?: string;
}

export interface CuratorResponse {
  critique: string;
  mood: string;
  historicalContext: string;
}
