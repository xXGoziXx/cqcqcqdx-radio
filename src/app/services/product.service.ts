import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from 'src/app/interfaces/Product';
import { Manufacturer } from 'src/app/interfaces/Manufacturer';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Cart } from '../interfaces/Cart';
import firebase from 'firebase/app';
import 'firebase/database'; // If using Firebase database

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  checkoutCart = {
    transactions: [
      {
        amount: {
          total: '0.00',
          currency: 'EUR'
        }
      }
    ]
  };
  cart: Cart[] = [];
  object = Object.keys;
  productsRef = this.afs.collection<Product>('products');
  manufacturersRef = this.afs.collection<Manufacturer>('manufacturers');
  productCounter: number;

  addProduct = productForm => {
    console.log(productForm);
    return this.afs
      .doc('users/adminList')
      .valueChanges()
      .subscribe(doc => {
        console.log(doc);
        this.productCounter = (doc as any).productCounter;
        console.log('pc', this.productCounter);
        this.productsRef
          .add({
            ...productForm,
            date_added: firebase.firestore.FieldValue.serverTimestamp(),
            id: this.productCounter,
            used: productForm.condition === 'New' ? false : true
          })
          .then(() => {
            this.afs.doc('users/adminList').update({ productCounter: this.productCounter++ });
          });
      });
  };
  addManufacturer = manufacturerForm => {
    console.log({
      ...manufacturerForm,
      image: ['']
    });
    return this.manufacturersRef.add({
      ...manufacturerForm,
      image: ['']
    });
  };
  removeItemFromCart = (product: Cart) => {
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
        .reduce((total, price) => total + price, 0.0)
        .toString();
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
      .reduce((total, price) => total + price, 0.0)
      .toString();
    console.log('Cart(after): ', this.cart);
    console.log('product Key: ', product.id);
    console.log('Checkout Cart: ', JSON.stringify(this.checkoutCart));
  };
  constructor(private afs: AngularFirestore) {}
}
