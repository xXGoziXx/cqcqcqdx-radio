import { Timestamp } from '@firebase/firestore-types';
import { Address } from './Address';
export interface Order {
  delivery_address: Address;
  order_date: Timestamp;
  order_id: string;
  product_id: string;
  total: number;
  status: string;
}
