import { CountryCode, LanguageCode, DateRangeCode } from './searcher.constants';

export interface SearchQueryParams {
  query: string;
  country?: CountryCode;
  language?: LanguageCode;
  autocorrect?: boolean;
  dateRange?: DateRangeCode;
  page?: number;
}
