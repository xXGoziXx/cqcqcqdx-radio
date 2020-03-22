import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import * as paypal from 'paypal-checkout';

import { AuthService } from '../services/auth.service';
import { used, manufacturers, brandNew, CategoryService } from '../services/category.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  usedCategories = used;
  brandNewCategories = brandNew;
  manufacturerCategories = manufacturers;
  productionKey: string;
  sandboxKey: string;
  PayPalSecretsDoc: AngularFirestoreDocument;
  APIKeys;
  // paypal button
  createPaypalButton = checkoutCart => {
    paypal.Button.render(
      {
        // Pass the client ids to use to create your transaction on sandbox and production environments
        env: 'sandbox',
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

        payment(data, actions) {
          console.log('This basket is', checkoutCart);
          return actions.payment.create(checkoutCart);
        },

        // Display a "Pay Now" button rather than a "Continue" button

        commit: true,

        // Pass a function to be called when the customer completes the payment

        onAuthorize(data, actions) {
          return actions.payment.execute().then(response => {
            
            console.log('The payment was completed!');
          });
        },

        // Pass a function to be called when the customer cancels the payment

        onCancel(data) {
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
    private afs: AngularFirestore
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
        console.log('Testing!!');
        if (this.productService.cart.length !== 0) {
          $('#basketCheckout').html('');
          this.createPaypalButton(this.productService.checkoutCart);
        }
      });
    });
  }
}
