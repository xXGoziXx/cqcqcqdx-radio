import firebase from 'firebase/app';
import 'firebase/firestore';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  constructor(
    public accountService: AccountService,
    public productService: ProductService,
    public authService: AuthService,
    public categoryService: CategoryService
  ) {}
  addOrder = ({ address1, address2, address3, townCity, postcode, country }) => {
    const orderCounter = this.authService.adminList.orderCounter;
    // console.log('oc', orderCounter);
    // console.log(
    //   'product_ids',
    //   this.productService.cart.map(item => Array(item.quantity).fill(item.id)).flat(Infinity)
    // );
    this.authService.userRef
      .collection('orders')
      .add({
        delivery_address: {
          address_lines: [address1, address2, address3],
          country,
          postcode,
          townCity
        },
        order_date: firebase.firestore.Timestamp.now(),
        order_id: orderCounter.toString(),
        product_ids: this.productService.cart.map(item => Array(item.quantity).fill(item.id)).flat(Infinity),
        user_uid: this.authService.currentUserDoc.uid,
        total: this.productService.cart
          .map(item => item.price * item.quantity)
          .reduce((x, y) => +(x + y).toFixed(2), 0.0),
        status: 'Pending'
      })
      .then(() => {
        this.productService.cart = [];
        this.productService.checkoutCart = {
          transactions: [
            {
              amount: {
                total: 0.0,
                currency: 'EUR'
              }
            }
          ]
        };
      });
  };

  ngOnInit(): void {}
}
