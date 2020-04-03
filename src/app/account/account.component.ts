import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../interfaces/Order';
import { Product } from '../interfaces/Product';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentChangeAction,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProductService } from '../services/product.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../interfaces/User';
import { CategoryService } from '../services/category.service';
import { ValidateDuplicateEntry } from '../validators/duplicateEntry.validator';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  defaultImage = '../../assets/img/Spinner.svg';
  usersOrderCollection: AngularFirestoreCollection<Order>;
  allUsersOrderCollection: AngularFirestoreCollection<Order>[];
  allUsersCollectionSnapshot$: Subscription;
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
  categories = [...this.categoryService.used];
  manufacturers = this.categoryService.manufacturers;
  uploads: any[];
  allPercentage: Observable<any>;
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
      images: ['']
    });
    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required, ValidateDuplicateEntry.bind(this)],
      images: ['']
    });
  }

  constructor(
    public authService: AuthService,
    public productService: ProductService,
    public categoryService: CategoryService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) {
    console.log(this.categories);
  }

  uploadsToImages = uploads => uploads.map(upload => upload.url);
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
        this.allUsersCollectionSnapshot$ = this.allUsersCollectionSnapshot.subscribe(docs => {
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
    $(document).on('change', '#imgUpload', event => {
      console.log('This is actually working');
      const $input = $(event);
      const $label = $('.inputfile-name');
      const labelVal = $label.val();
      console.log($input);
      console.log('change');
      let fileName = '';

      if (event.target.files && event.target.files.length > 1) {
        fileName = (event.target.getAttribute('data-multiple-caption') || '').replace(
          '{count}',
          event.target.files.length
        );
      } else if (event.target.value) {
        fileName = event.target.value.split('\\').pop();
      }
      console.log(fileName);
      if (fileName) {
        $label.val(fileName);
      } else {
        $label.html(labelVal.toString());
      }

      // Firefox bug fix

      $(document).on('focus', $input, () => {
        $input.addClass('has-focus');
      });
      $(document).on('blur', $input, () => {
        $input.removeClass('has-focus');
      });

      // reset the array
      this.uploads = [];
      const fileList = event.target.files;
      const allPercentage: Observable<number>[] = [];
      console.log(fileList);
      for (const file of fileList) {
        const path = `images/${new Date().getTime()}_${file.name}`;
        const ref = this.storage.ref(path);
        const task = this.storage.upload(path, file);
        const percentage$ = task.percentageChanges();
        allPercentage.push(percentage$);

        // create composed object with different information. ADAPT THIS ACCORDING YOUR NEED
        const uploadTrack = {
          fileName: file.name,
          percentage: percentage$
        };
        // push each upload into the array
        this.uploads.push(uploadTrack);
        // for every upload do whatever you want in firestore with the uploaded file
        const t = task.then(async imageFile => {
          const url = await imageFile.ref.getDownloadURL();
          this.uploads[this.uploads.length - 1].url = url;
          console.log(this.uploads);
          return this.uploads;
        });
      }

      this.allPercentage = combineLatest(allPercentage).pipe(
        map(percentages => {
          let result = 0;
          for (const percentage of percentages) {
            result = result + percentage;
          }
          return result / percentages.length;
        }),
        tap(console.log)
      );
    });
  }

  ngOnDestroy() {
    this.allUsersCollectionSnapshot$.unsubscribe();
  }
}
