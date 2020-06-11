import * as admin from 'firebase-admin';

import { Address } from './Address';
export interface User {
  address: Address;
  admin: boolean;
  createdOn: admin.firestore.Timestamp;
  email: string;
  firstName: string;
  lastLoggedIn: admin.firestore.Timestamp;
  lastName: string;
  telephone: number;
  uid: string;
}
