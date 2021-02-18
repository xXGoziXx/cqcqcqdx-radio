import { Timestamp } from '@firebase/firestore-types';
import { Rating } from './Rating';
export interface Product {
  condition: Condition;
  date_added: Timestamp;
  description: string;
  id: string;
  images: Array<string>;
  manufacturer: string;
  name: string;
  price: number;
  rating: Array<Rating>;
  stock: number;
  used: boolean;
  category: string;
}
export type Condition =
  | 'New'
  | 'Renewed'
  | 'Used - Open Box'
  | 'Used - Very Good'
  | 'Used - Good'
  | 'Used - Acceptable';
