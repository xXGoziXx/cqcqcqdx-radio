import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import * as paypal from 'paypal-checkout';

import { AuthService } from '../services/auth.service';
import { used, manufacturers, brandNew, CategoryService } from '../services/category.service';
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
          sandbox: 'AdxeiunfE1Pi2lYB8jFgnBk-zd6Cz4aa4pGE91btkpdex8m10TI5uNUvgRmaJvg2W4DR3yKXGe3IGvMu',
          // from https://developer.paypal.com/developer/applications/
          production: 'AYXfqQHYPkCgH5ZpLf3NfvZGzbbnidPxO2Nk47fiKPA029JC3t_qO5VV8Fi55GN6k4Qf9vgBhnp8VAJL'
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
          return actions.payment.execute().then(function(response) {
            console.log('The payment was completed!');
          });
        },

        // Pass a function to be called when the customer cancels the payment

        onCancel(data) {
          console.log('The payment was cancelled!');
        }
      },
      '#modalCheckout'
    );
  };
  constructor(
    public authService: AuthService,
    public categoryService: CategoryService,
    public productService: ProductService
  ) {
    $('.reveal').on('open.zf.reveal', () => {
      if (this.productService.cart.length !== 0) {
        $('#modalCheckout').html('');
        this.createPaypalButton(this.productService.checkoutCart);
      }
    });
  }

  ngOnInit() {}
}
