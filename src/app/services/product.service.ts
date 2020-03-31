import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from 'src/app/interfaces/Product';
import { Manufacturer } from 'src/app/interfaces/Manufacturer';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Item } from '../interfaces/Item';
import * as firebase from 'firebase/app';
import 'firebase/firestore'; // If using Firebase database

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
    return (adminListSub = this.afs
      .doc('users/adminList')
      .valueChanges()
      .subscribe(async doc => {
        console.log(doc);
        this.productCounter = (doc as any).productCounter;
        console.log('pc', this.productCounter);
        await this.productsRef.add({
          ...productForm,
          name: productForm.value.name.trim(),
          images: productForm.value.image.split(','),
          date_added: firebase.firestore.FieldValue.serverTimestamp(),
          id: this.productCounter.toString(),
          used: productForm.condition === 'New' ? false : true
        });
        adminListSub.unsubscribe();
      }));
  };
  addManufacturer = manufacturerForm => {
    console.log({
      ...manufacturerForm,
      images: ['']
    });
    return this.manufacturersRef.add({
      name: manufacturerForm.value.name.trim(),
      images: manufacturerForm.value.image.split(',')
    });
  };
  removeItemFromCart = (product: Item) => {
    const productID = this.cart.map(x => x.id).indexOf(product.id);
    console.log('RIFC Product: ', product);
    if (this.cart[productID]) {
      console.log('No. of products: ', this.cart[productID].quantity);
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
    console.log('Cart(after removal): ', this.cart);
  };
  addItemToCart = (product, quantity) => {
    const productID = this.cart.map(x => x.id).indexOf(product.id);
    console.log('Cart(before): ', this.cart);
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
    console.log('Cart(after): ', this.cart);
    console.log('product Key: ', product.id);
    console.log('Checkout Cart: ', JSON.stringify(this.checkoutCart));
  };
  get cartGetter() {
    return this.cart;
  }
  get checkoutCartGetter() {
    return this.checkoutCart;
  }
  constructor(private afs: AngularFirestore) {}
}
