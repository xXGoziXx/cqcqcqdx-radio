import { Timestamp } from '@firebase/firestore-types';
export interface Rating {
  date: Timestamp;
  name: string;
  review: string;
  stars: number;
}
