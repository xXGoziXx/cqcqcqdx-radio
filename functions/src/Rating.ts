import * as admin from 'firebase-admin';

export interface Rating {
  date: admin.firestore.Timestamp;
  name: string;
  review: string;
  stars: number;
}
