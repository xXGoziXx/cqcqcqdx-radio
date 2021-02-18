import * as admin from 'firebase-admin';
import { Address } from './Address';
export interface Order {
  delivery_address: Address;
  order_date: admin.firestore.Timestamp;
  order_id: string;
  order_uid: string;
  product_ids: Array<string>;
  total: number;
  status: Status;
  user_uid: string;
}
export type Status = 'Pending' | 'Sold';
