import { Component, OnInit } from '@angular/core';
import { Order } from '../interfaces/Order';
import { Product } from '../interfaces/Product';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  usersOrderCollection: AngularFirestoreCollection<Order>;
  orders$: Observable<Order[]>;
  products$: Array<Observable<Product[]>>;
  currOrderId = '';
  objectFlattener = (values: object) => {
    let result = '';
    let counter = 3;
    const valuesTracker = { ...values };
    while (Object.keys(valuesTracker).length) {
      // console.log('Values: ', valuesTracker);
      Object.keys(valuesTracker).forEach(prop => {
        const value = valuesTracker[prop];
        if (value instanceof Object && value.constructor === Object) {
          result += this.objectFlattener(value) + ', ';
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if ((item instanceof Object && item.constructor === Object) || Array.isArray(item)) {
              result += this.objectFlattener(item) + ', ';
            } else {
              result += item + ', ';
            }
          }
        } else {
          result += value + ', ';
        }
        delete valuesTracker[prop];
      });
      counter--;
    }
    // console.log('Result: ', result);
    // console.log('Values: ', valuesTracker);
    // remove excess commas
    return result.replace(/(^\s*,\s*)*(\s+,)*(\s*,\s*$)*/g, '');
  };

  showOrder = (ids, i) => {
    console.log(...ids);
    this.products$ = [];
    ids.forEach(id => {
      this.products$.push(
        this.afs
          .collection<Product>('products', ref => ref.where('id', '==', id))
          .valueChanges()
      );
    });
    this.currOrderId = this.currOrderId === i ? '' : i;
  };
  constructor(public authService: AuthService, public productService: ProductService, private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.usersOrderCollection = this.authService.userRef.collection<Order>('orders');
    this.orders$ = this.usersOrderCollection.valueChanges();
  }
}
