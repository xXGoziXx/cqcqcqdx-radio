import { Timestamp } from '@firebase/firestore-types';
import { Url } from 'url';
import { Rating } from './Rating';
export interface Product {
  condition: string;
  date_added: Timestamp;
  description: string;
  id: string;
  images: Array<Url>;
  manufacturer: string;
  name: string;
  price: number;
  rating: Array<Rating>;
  stock: number;
  used: boolean;
}
