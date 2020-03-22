import { Component, OnInit } from '@angular/core';
import { Order } from '../interfaces/Order';
import { Product } from '../interfaces/Product';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentChangeAction,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { ProductService } from '../services/product.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../interfaces/User';
import { used, brandNew, manufacturers } from '../services/category.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  usersOrderCollection: AngularFirestoreCollection<Order>;
  allUsersOrderCollection: AngularFirestoreCollection<Order>[];
  allUserDocs: AngularFirestoreDocument<User>[];
  allUsersCollectionSnapshot: Observable<DocumentChangeAction<User>[]>;
  orders$: Observable<Order[]>;
  allOrders: Array<Observable<Order[]>> = [];
  allUserIds: Array<string> = [];
  allUsers: Array<User> = [];
  products$: Array<Observable<Product[]>>;
  currOrderId = '';
  productForm: FormGroup;
  manufacturerForm: FormGroup;
  categories = [...used, ...brandNew];
  manufacturers = manufacturers;

  tabPanels = [
    { id: 'myOrders', name: 'My Orders' },
    { id: 'addProduct', name: 'Add Product' },
    { id: 'addManufacturer', name: 'Add Manufacturer' },
    { id: 'viewAllOrders', name: 'View All Orders' }
  ];
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
  createForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      price: [0.0, Validators.required],
      stock: [1],
      condition: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required],
      image: ['']
    });
  }
  constructor(
    public authService: AuthService,
    public productService: ProductService,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) {
    console.log(this.categories);
  }

  ngOnInit(): void {
    // Creates the form
    this.createForm();

    try {
      // stores the users collection of order Refs
      this.usersOrderCollection = this.authService.userRef.collection<Order>('orders');
      // stores the users collection of order Document Data asynchronously
      this.orders$ = this.usersOrderCollection.valueChanges();
      // allows admins to get all user orders
      if (this.authService.currentUserDoc.admin) {
        // gets the user IDs and stores it in an array
        this.allUsersCollectionSnapshot = this.afs.collection<User>('users').snapshotChanges();
        this.allUsersCollectionSnapshot.subscribe(docs => {
          this.allUserIds = docs
            .filter(doc => doc.payload.doc.id !== 'adminList')
            .map(doc => {
              return doc.payload.doc.id;
            });
          console.log(this.allUserIds);
          // uses the ids to get all the user refs
          this.allUserDocs = this.allUserIds.map(id => this.afs.collection<User>('users').doc<User>(id));
          // gets all the orders from the user ord
          this.allUsersOrderCollection = this.allUserDocs.map(userRef => userRef.collection<Order>('orders'));
          console.log('allUserDocs', this.allUserDocs);
          this.allOrders = this.allUsersOrderCollection.map(userOrderCollection => userOrderCollection.valueChanges());
        });
      }
    } catch (e) {
      console.log('No Orders');
    }
  }
}
