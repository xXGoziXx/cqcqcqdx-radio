import { Timestamp } from '@firebase/firestore-types';
export interface Message {
  date: Timestamp;
  email: string;
  html: string;
  message: string;
  name: string;
  telephone: string;
}
