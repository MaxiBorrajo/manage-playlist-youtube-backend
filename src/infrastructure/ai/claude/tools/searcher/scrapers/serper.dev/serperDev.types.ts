export interface SerperDevVideoSearchParameters {
  q: string;
  gl?: string;
  hl?: string;
  type?: string;
  num?: number;
  autocorrect?: boolean;
  page?: number;
  tbs?: string;
  engine?: string;
}

export interface SerperDevVideo {
  title: string;
  link: string;
  snippet?: string;
  imageUrl?: string;
  videoUrl?: string;
  duration?: string;
  source?: string;
  channel?: string;
  date?: string;
  position: number;
}

export interface SerperDevVideoSearchResponse {
  searchParameters: SerperDevVideoSearchParameters;
  videos: SerperDevVideo[];
  credits?: number;
}
