import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../interfaces/Product';
import { Manufacturer } from '../interfaces/Manufacturer';
import { map } from 'rxjs/operators';
import { Item } from '../interfaces/Item';
import { AuthService } from './auth.service';
import { User } from '../interfaces/User';

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
      this.updateCart();
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
    this.updateCart();
    this.checkoutCart.transactions[0].amount.total = this.cart
      .map(item => item.quantity * item.price)
      .reduce((total, price) => +(total + price).toFixed(2), 0.0);
    // console.log('Cart(after): ', this.cart);
    // console.log('product Key: ', product.id);
    // console.log('Checkout Cart: ', JSON.stringify(this.checkoutCart));
  };
  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.initializeCart();
      }
    });
  }
  initializeCart = async () => {
    const userRefSnapshot = await this.authService.userRef.get().toPromise();
    this.cart = (userRefSnapshot.data() as User).cart;
  };
  updateCart = () => {
    const userRefSnapshot = this.authService.userRef.update({
      cart: this.cart
    });
  };
}
