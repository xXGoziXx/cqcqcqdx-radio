import { Component, OnInit } from '@angular/core';
import { Order } from '../interfaces/Order';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  usersOrderCollection: AngularFirestoreCollection<Order>;
  orders$: Observable<Order[]>;

  constructor(public authService: AuthService, private afs: AngularFirestore) {
    this.usersOrderCollection = authService.userRef.collection<Order>('orders');
    this.orders$ = this.usersOrderCollection.valueChanges();
  }

  ngOnInit(): void {}
}
