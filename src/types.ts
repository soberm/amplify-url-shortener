import type { Schema } from '../amplify/data/resource';

export type UrlType = Schema['Url']['type'];

export interface UrlShortenerProps {
  signOut: () => void;
  user: any;
}
