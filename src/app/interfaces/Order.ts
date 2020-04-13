import { Timestamp } from '@firebase/firestore-types';
import { Address } from './Address';
export interface Order {
  delivery_address: Address;
  order_date: Timestamp;
  order_id: string;
  product_ids: Array<string>;
  total: number;
  status: Status;
}
export type Status = 'Pending' | 'Sold';
