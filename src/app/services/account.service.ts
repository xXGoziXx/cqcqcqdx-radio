import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  AngularFirestore
} from '@angular/fire/firestore';
import { Order } from '../interfaces/Order';
import { Subscription, Observable } from 'rxjs';
import { User } from '../interfaces/User';
import { Product } from '../interfaces/Product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Manufacturer } from '../interfaces/Manufacturer';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { ValidateDuplicateEntry } from '../validators/duplicateEntry.validator';
import { Address } from '../interfaces/Address';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  defaultImage = '../../assets/img/Spinner.svg';
  usersOrderCollection: AngularFirestoreCollection<Order>;
  allUsersOrderCollection: AngularFirestoreCollection<Order>[];
  allUsersCollectionSnapshot$: Subscription;
  allUserDocs: AngularFirestoreDocument<User>[];
  allUsersCollectionSnapshot: Observable<DocumentChangeAction<User>[]>;
  orders$: Observable<Order[]>;
  allOrders: Array<Observable<Order[]>> = [];
  allUserIds: Array<string> = [];
  allUsers$: Observable<User[]>;

  products$: Array<Observable<Product[]>>;
  currOrderId = '';
  productForm: FormGroup;
  manufacturerForm: FormGroup;
  categories = [...this.categoryService.used];
  manufacturers = this.categoryService.manufacturers;
  uploads: any[];
  allPercentage: Observable<any>;
  collection = '';

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
  addressFormatter = (values: Address) => {
    return this.cleanAddress(
      `${values.address_lines.toString()}, ${values.townCity}, ${values.postcode}, ${values.country}`
    );
  };
  cleanAddress = address => {
    const result = address
      .replace(/(,{2,})/g, ',')
      .replace(/(\s{2,})/g, ' ')
      .replace(/(^\s*,\s*)*(\s+,)*(,{2,})*(\s*,\s*$)*/g, '');
    return address === result ? address : this.cleanAddress(result);
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

  uploadsToImages = uploads => (uploads ? uploads.map(upload => upload.url) : ['']);
  uploadToStorage = (event, id?) => {
    // reset the array
    const updateUploads = [];
    if (!id) {
      this.uploads = [];
    }

    const fileList = event.target.files;
    const allPercentage: Observable<number>[] = [];
    // console.log(fileList);
    for (const file of fileList) {
      const path = `images/${new Date().getTime()}_${file.name}`;
      const ref = this.storage.ref(path);
      const task = this.storage.upload(path, file);
      const percentage$ = task.percentageChanges();
      allPercentage.push(percentage$);

      const uploadTrack = {
        fileName: file.name,
        percentage: percentage$
      };
      // push each upload into the array
      id ? updateUploads.push(uploadTrack) : this.uploads.push(uploadTrack);
      // for every upload do whatever you want in firestore with the uploaded file
      const t = task.then(async imageFile => {
        const url = await imageFile.ref.getDownloadURL();
        id ? (updateUploads[updateUploads.length - 1].url = url) : (this.uploads[this.uploads.length - 1].url = url);
        // id ? console.log('updateUploads:', updateUploads) : console.log('uploads:', this.uploads);
        switch (this.collection) {
          case 'manufacturers':
            this.afs.doc<Manufacturer>(`manufacturers/${id}`).update({ images: updateUploads.map(image => image.url) });
            break;
          case 'products':
            this.afs.doc<Product>(`products/${id}`).update({ images: updateUploads.map(image => image.url) });
            break;

          default:
            break;
        }

        return this.uploads;
      });
    }

    return { allPercentage, updateUploads };
  };

  updateOrderStatus = event => {
    // console.log(event);
    const { id: orderId, value } = event.target;
    // gets the order that is wanted by filtering it by the order id
    const orderDocIdSub = this.usersOrderCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions
            .map(a => {
              const docData = a.payload.doc.data() as Order;
              const docId = a.payload.doc.id;
              // console.log({ docId, ...docData });
              return { docId, ...docData };
            })
            .filter(doc => doc.order_id === orderId)
        )
      )
      .subscribe(ids => {
        // there should only be one order with the id with the one being looked for
        // so it has to be the first one
        const id = ids[0];
        // console.log('updateOrderStatus > id:', ids);
        this.afs.doc<Order>(`users/${this.authService.authUser.uid}/orders/${id.docId}`).update({ status: value });

        orderDocIdSub.unsubscribe();
      });
  };
  updateAdminStatus = (event, email) => {
    // console.log(event);
    const { id: uid, value } = event.target;
    // console.log(`users/${uid}` + ' ' + event.target.value);
    // this.afs.doc<User>(`users/${uid}`).update({
    //   admin: value
    // });
    const adminListSub = this.afs
      .doc<any>(`users/adminList`)
      .valueChanges()
      .subscribe(adminList => {
        const { emails } = adminList;
        if (emails.includes(email)) {
          value ? emails.push(email) : emails.splice(emails.indexOf(email), 1);
        }
        this.afs.doc<any>(`users/adminList`).update({
          emails
        });
        adminListSub.unsubscribe();
      });
  };
  constructor(
    public authService: AuthService,
    public productService: ProductService,
    public categoryService: CategoryService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) {
    this.allUsers$ = this.afs.collection<User>('users').valueChanges();
  }
}
