import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../interfaces/Product';
import { Manufacturer } from '../interfaces/Manufacturer';
import { map } from 'rxjs/operators';

import { Item } from '../interfaces/Item';
import firebase from '@firebase/app';
import '@firebase/firestore'; // If using Firebase database

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  checkoutCart = {
    transactions: [
      {
        amount: {
          total: 0.0,
          currency: 'EUR'
        }
      }
    ]
  };
  cart: Item[] = [];
  object = Object.keys;
  productsRef = this.afs.collection<Product>('products');
  manufacturersRef = this.afs.collection<Manufacturer>('manufacturers');
  productCounter: number;

  addProduct = productForm => {
    console.log(productForm);
    let adminListSub;
    const images = productForm.image ? productForm.image.split(',') : [''];
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
          images,
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
  removeItemFromCart = (product: Item) => {
    const productID = this.cart.map(x => x.id).indexOf(product.id);
    // console.log('RIFC Product: ', product);
    if (this.cart[productID]) {
      // console.log('No. of products: ', this.cart[productID].quantity);
      // Removes item from shopping cart if it's only there once
      // Otherwise decreases the quantity
      if (this.cart[productID].quantity === 1) {
        this.cart.splice(productID, 1);
      } else {
        this.cart[productID].quantity--;
      }
      this.checkoutCart.transactions[0].amount.total = this.cart
        .map(item => item.quantity * item.price)
        .reduce((total, price) => +(total + price).toFixed(2), 0.0);
    }
    // console.log('Cart(after removal): ', this.cart);
  };
  addItemToCart = (product, quantity) => {
    const productID = this.cart.map(x => x.id).indexOf(product.id);
    // console.log('Cart(before): ', this.cart);
    if (productID !== -1) {
      this.cart[productID].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity
      });
    }
    this.checkoutCart.transactions[0].amount.total = this.cart
      .map(item => item.quantity * item.price)
      .reduce((total, price) => +(total + price).toFixed(2), 0.0);
    // console.log('Cart(after): ', this.cart);
    // console.log('product Key: ', product.id);
    // console.log('Checkout Cart: ', JSON.stringify(this.checkoutCart));
  };
  get cartGetter() {
    return this.cart;
  }
  get checkoutCartGetter() {
    return this.checkoutCart;
  }
  constructor(private afs: AngularFirestore) {}
}
