import { Timestamp } from '@firebase/firestore-types';
import { Address } from './Address';
import { Item } from './Item';
export interface User {
  address: Address;
  admin: boolean;
  createdOn: Timestamp;
  email: string;
  firstName: string;
  lastLoggedIn: Timestamp;
  lastName: string;
  telephone: number;
  uid: string;
  cart: Array<Item>;
}
