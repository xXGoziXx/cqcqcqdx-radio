import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  AngularFirestore
} from '@angular/fire/firestore';
import firebase from '@firebase/app';
import '@firebase/firestore'; // If using Firebase database
import { Subscription, Observable } from 'rxjs';
import { Address } from '../interfaces/Address';
import { Order } from '../interfaces/Order';
import { User } from '../interfaces/User';
import { Product } from '../interfaces/Product';
import { Link } from '../interfaces/Link';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Manufacturer } from '../interfaces/Manufacturer';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, filter, isEmpty } from 'rxjs/operators';
import {
  ValidateDuplicateEntryManufacturer,
  ValidateDuplicateEntryProduct,
  ValidateDuplicateEntryLink
} from '../validators/duplicateEntry.validator';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  allOrders: Array<Observable<Order[]>> = [];
  allPercentage: Observable<any>;
  allUserDocs: AngularFirestoreDocument<User>[];
  allUserIds: Array<string> = [];
  allUsers$: Observable<User[]>;
  allUsersCollectionValue$: Subscription;
  allUsersCollectionValue: Observable<User[]>;
  allUsersOrderCollection: AngularFirestoreCollection<Order>[];
  categories = [...this.categoryService.used];
  collection = '';
  currOrderId = '';
  defaultImage = '../../assets/img/Spinner.svg';
  manufacturers = this.categoryService.manufacturers;
  orders$: Observable<Order[]>;
  manufacturerForm: FormGroup;
  orderForm: FormGroup;
  linkForm: FormGroup;
  productForm: FormGroup;
  products$: Array<Observable<Product[]>>;
  productCounter: number;
  uploads: any[];
  noOrders = true;
  uploadingImages = false;
  usersOrderCollection: AngularFirestoreCollection<Order>;
  productsRef = this.afs.collection<Product>('products', ref => ref.orderBy('name'));
  manufacturersRef = this.afs.collection<Manufacturer>('manufacturers', ref => ref.orderBy('name'));

  createForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required, ValidateDuplicateEntryProduct],
      manufacturer: ['', Validators.required],
      price: [0.0, Validators.required],
      stock: [1],
      condition: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.manufacturerForm = this.fb.group({
      name: ['', Validators.required, ValidateDuplicateEntryManufacturer.bind(this)],
      images: ['']
    });
    this.linkForm = this.fb.group({
      name: ['', Validators.required, ValidateDuplicateEntryLink],
      url: ['', Validators.required]
    });
    this.orderForm = this.fb.group({
      address1: ['', Validators.required],
      address2: [''],
      address3: [''],
      townCity: ['', Validators.required],
      country: ['', Validators.required],
      postcode: ['', Validators.required]
    });
  }
  isEmptyObservableArray = (allOrders: Observable<Order[]>[]) => {
    console.log('updated');

    let subscribeToResult;
    if (allOrders.length === 0) {
      return this.noOrders;
    } else {
      // let result = true;
      allOrders.forEach((order$: Observable<Order[]>) => {
        const result = order$.pipe(isEmpty());
        subscribeToResult = result.subscribe(res => {
          console.log('Is there an order?', !res);
          // console.log('test', order$);

          if (!res) {
            this.noOrders = false;
          }
          subscribeToResult.unsubscribe();
        });
      });
      return false;
    }
  };
  addProduct = productForm => {
    console.log(productForm);
    let adminListSub;
    return (adminListSub = this.afs
      .doc('users/adminList')
      .valueChanges()
      .subscribe(async doc => {
        // console.log(doc);
        this.productCounter = (doc as any).productCounter;
        // console.log('pc', this.productCounter);
        await this.productsRef.add({
          ...productForm,
          name: productForm.name.trim(),
          images: this.uploadsToImages(this.uploads),
          date_added: firebase.firestore.Timestamp.now(),
          id: this.productCounter.toString(),
          used: productForm.condition === 'New' ? false : true
        });
        adminListSub.unsubscribe();
      }));
  };
  addManufacturer = (manufacturerForm, images) => {
    // console.log({
    //   ...manufacturerForm,
    //   images
    // });
    return this.manufacturersRef.add({
      name: manufacturerForm.name.trim(),
      images
    });
  };
  addLinks = ({ name, url }) => {
    return this.afs.collection('links').add({
      name,
      url
    });
  };
  removeLink = name => {
    // console.log('removeLink', name);
    const linkDocIdsSub = this.afs
      .collection<Link>('links', ref => ref.where('name', '==', name))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Link;
            const id = a.payload.doc.id;
            // console.log({ id, ...data });
            return id;
          })
        )
      )
      .subscribe(ids => {
        ids.forEach(id => {
          this.afs.doc<Link>('links/' + id).delete();
        });
        linkDocIdsSub.unsubscribe();
      });
  };
  removeManufacturer = name => {
    // console.log('removeManufacturer', name);
    const manufacturerDocIdsSub = this.afs
      .collection<Manufacturer>('manufacturers', ref => ref.where('name', '==', name))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Manufacturer;
            const id = a.payload.doc.id;
            // console.log({ id, ...data });
            return id;
          })
        )
      )
      .subscribe(ids => {
        ids.forEach(id => {
          this.afs.doc<Manufacturer>('manufacturers/' + id).delete();
        });
        manufacturerDocIdsSub.unsubscribe();
      });
  };
  removeProduct = id => {
    // console.log('removeProduct', name);
    const productDocIdsSub = this.afs
      .collection<Product>('products', ref => ref.where('id', '==', id))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Product;
            const docId = a.payload.doc.id;
            // console.log({ docId, ...data });
            return docId;
          })
        )
      )
      .subscribe(ids => {
        ids.forEach(id => {
          this.afs.doc<Product>('products/' + id).delete();
        });
        productDocIdsSub.unsubscribe();
      });
  };
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
    // console.log(...ids);
    this.products$ = [];
    ids.forEach(id => {
      this.products$.push(
        this.afs
          .collection<Product>('products', ref => ref.where('id', '==', id).orderBy('name'))
          .valueChanges()
      );
    });
    this.currOrderId = this.currOrderId === i ? '' : i;
  };

  uploadsToImages = uploads => (uploads ? uploads.map(upload => upload.url) : ['']);
  uploadToStorage = async (event, id?) => {
    // if there's id then its going to update
    // reset the array
    const updateUploads = [];
    if (!id) {
      // if we're uploading images
      this.uploads = [];
    }

    const fileList = event.target.files;
    const allPercentage: Observable<number>[] = [];
    console.log(fileList);
    for (const file of fileList) {
      const path = `images/${new Date().getTime()}_${file.name}`;
      const ref = this.storage.ref(path);
      const task = this.storage.upload(path, file);
      const percentage$ = task.percentageChanges();
      allPercentage.push(percentage$);

      const uploadTrack = {
        fileName: file.name,
        percentage: percentage$,
        url: ''
      };
      // push each upload into the array
      id ? updateUploads.push(uploadTrack) : this.uploads.push(uploadTrack);
      // for every upload do whatever you want in firestore with the uploaded file
      const imageFile = await task;
      const url = await imageFile.ref.getDownloadURL();
      console.log('accountService>UploadStorage: ', url);
      console.log('ID: ', id);
      if (id) {
        updateUploads[updateUploads.length - 1].url = url;
        console.log('updateUploads:', updateUploads);
        switch (this.collection) {
          case 'manufacturers':
            this.afs.doc<Manufacturer>(`manufacturers/${id}`).update({ images: this.uploadsToImages(updateUploads) });
            break;
          case 'products':
            this.afs.doc<Product>(`products/${id}`).update({ images: this.uploadsToImages(updateUploads) });
            break;

          default:
            break;
        }
      } else {
        this.uploads[this.uploads.length - 1].url = url;
        console.log('uploads:', this.uploads);
      }
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
    const booleanValue = value.toLowerCase() === 'true';
    // this.afs.doc<User>(`users/${uid}`).update({
    //   admin: value
    // });
    const { emails } = this.authService.adminList;
    if (booleanValue && !emails.includes(email)) {
      // If its true and not in the adminList
      emails.push(email);
    } else if (!booleanValue && emails.includes(email)) {
      // If its false and in the adminList
      emails.splice(emails.indexOf(email), 1);
    }

    this.afs.doc<any>(`users/adminList`).update({
      emails
    });
  };
  deleteUser = (uid: string) => {
    this.afs.doc<any>(`users/${uid}`).delete();
  };
  deleteOrder = async (userId: string, orderId: string) => {
    console.log('userId: ', userId);
    console.log('orderId: ', orderId);
    await this.afs.doc<any>(`users/${userId}/orders/${orderId}`).delete();
    this.allOrders = this.allUsersOrderCollection.map(userOrderCollection =>
      userOrderCollection.valueChanges().pipe(filter(orders => orders.length > 0))
    );
    this.isEmptyObservableArray(
    this.allUsersOrderCollection.map(userOrderCollection =>
        userOrderCollection.valueChanges().pipe(filter(orders => orders.length > 0))
      )
    );
  };
  constructor(
    public authService: AuthService,
    public productService: ProductService,
    public categoryService: CategoryService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) {
    this.allUsers$ = this.afs
      .collection<User>('users', ref => ref.orderBy('firstName').orderBy('lastName'))
      .valueChanges();
  }
}
