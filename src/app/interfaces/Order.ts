import { Timestamp } from '@firebase/firestore-types';
import { Address } from './Address';
export interface Order {
  delivery_address: Address;
  order_date: Timestamp;
  order_id: string;
  order_uid: string;
  product_ids: Array<string>;
  total: number;
  status: Status;
  user_uid: string;
}
export type Status = 'Pending' | 'Sold';
