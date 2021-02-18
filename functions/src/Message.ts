import * as admin from 'firebase-admin';
export interface Message {
  date: admin.firestore.Timestamp;
  email: string;
  html: string;
  message: string;
  name: string;
  telephone: string;
}
