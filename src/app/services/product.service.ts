import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from 'src/app/interfaces/Product';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Cart } from '../interfaces/Cart';

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
  removeItemFromCart(product: Cart) {
    const productID = this.cart.map(x => x.id).indexOf(product.id);
    console.log('RIFC product: ', product);
    if (this.cart[productID]) {
      console.log('No. of products: ', this.cart[productID].quantity);
      // Removes item from shopping cart if it's only there once
      // Otherwise decreases the quantity
      if (this.cart[productID].quantity === 1) {
        this.cart.splice(productID, 1);
      } else {
        this.cart[productID].quantity--;
      }
    }
    console.log('Cart(after removal): ', this.cart);
  }
  addItemToCart(product, quantity) {
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
  }
  constructor(private afs: AngularFirestore) {}
}
