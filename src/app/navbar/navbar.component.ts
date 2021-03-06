import firebase from 'firebase/app';
import 'firebase/firestore';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import * as paypal from 'paypal-checkout';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Order } from '../interfaces/Order';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  productionKey: string;
  sandboxKey: string;
  PayPalSecretsDoc: AngularFirestoreDocument;
  APIKeys: Observable<firebase.firestore.DocumentData>;
  productCounter: number;
  usersOrderCollection: AngularFirestoreCollection<Order>;
  // paypal button
  createPaypalButton = (checkoutCart: any) => {
    paypal.Button.render(
      {
        // Pass the client ids to use to create your transaction on sandbox and production environments
        env: 'production',
        style: {
          size: 'medium',
          color: 'black',
          shape: 'rect',
          label: 'checkout'
        },
        client: {
          // from https://developer.paypal.com/developer/applications/
          sandbox: this.sandboxKey,
          // from https://developer.paypal.com/developer/applications/
          production: this.productionKey
        },

        // Pass the payment details for your transaction
        // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters

        payment(_data: any, actions: { payment: { create: (arg0: any) => any; }; }) {
          // console.log('This basket is', checkoutCart);
          return actions.payment.create(checkoutCart);
        },

        // Display a "Pay Now" button rather than a "Continue" button

        commit: true,

        // Pass a function to be called when the customer completes the payment

        onAuthorize: async (_data: any, actions: { payment: { execute: () => Promise<any>; }; }) => {
          await actions.payment.execute();
          console.log('The payment was completed!');
          // console.log('This:', this);
          const orderCounter = this.authService.adminList.orderCounter;
          // console.log('oc', orderCounter);
          // console.log(
          //   'product_ids',
          //   this.productService.cart.map(item => Array(item.quantity).fill(item.id)).flat(Infinity)
          // );
          this.authService.userRef
            .collection('orders')
            .add({
              delivery_address: this.authService.currentUserDoc.address,
              order_date: firebase.firestore.Timestamp.now(),
              order_id: orderCounter.toString(),
              product_ids: this.productService.cart.map(item => Array(item.quantity).fill(item.id)).flat(Infinity),
              total: this.productService.cart
                .map(item_1 => item_1.price * item_1.quantity)
                .reduce((x, y) => +(x + y).toFixed(2), 0),
              status: 'Pending',
              user_uid: this.authService.currentUserDoc.uid
            })
            .then(() => {
              this.productService.cart = [];
              this.productService.checkoutCart = {
                transactions: [
                  {
                    amount: {
                      total: 0,
                      currency: 'EUR'
                    }
                  }
                ]
              };
            });
        },

        // Pass a function to be called when the customer cancels the payment

        onCancel(_data: any) {
          console.log('The payment was cancelled!');
        }
      },
      '#basketCheckout'
    );
  };

  constructor(
    public authService: AuthService,
    public categoryService: CategoryService,
    public productService: ProductService,
    public afs: AngularFirestore
  ) {
    this.PayPalSecretsDoc = this.afs.doc('PayPalSecrets/' + 'APIKeys');
    this.APIKeys = this.PayPalSecretsDoc.valueChanges(); // Observable of Secret Data
    const APIKeys$: Subscription = this.APIKeys.subscribe(e => {
      // stores access_token from firestore
      this.sandboxKey = e.sandbox;
      this.productionKey = e.production;
      // console.log(this.access_token);
      APIKeys$.unsubscribe();
    });
  }

  ngOnInit() {
    $(() => {
      $('#basketModal').on('open.zf.reveal', () => {
        if (this.productService.cart.length !== 0) {
          $('#basketCheckout').html('');
          this.createPaypalButton(this.productService.checkoutCart);
          // console.log('cart:', this.productService.cart);
        }
      });
    });
  }
}
