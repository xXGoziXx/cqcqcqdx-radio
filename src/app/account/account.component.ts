import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../interfaces/Order';
import { AuthService } from '../services/auth.service';
import { combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from '../services/product.service';
import { User } from '../interfaces/User';
import { CategoryService } from '../services/category.service';
import { map } from 'rxjs/operators';
import { Manufacturer } from '../interfaces/Manufacturer';
import { AccountService } from '../services/account.service';
import { Product } from '../interfaces/Product';
import { filter } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  tabPanels = [
    { id: 'myOrders', name: 'My Orders', collection: 'myOrders', adminOnly: false },
    {
      id: 'addProduct',
      name: this.authService.currentUserDoc.admin ? 'Add / Remove Product' : 'Add Product',
      collection: 'products',
      adminOnly: false
    },
    {
      id: 'addManufacturer',
      name: this.authService.currentUserDoc.admin ? 'Add / Remove Manufacturer' : 'Add Manufacturer',
      collection: 'manufacturer',
      adminOnly: true
    },
    { id: 'addOrder', name: 'Add Order', collection: 'addOrder', adminOnly: true },
    {
      id: 'viewAllOrders',
      name: this.authService.currentUserDoc.admin ? 'View / Remove Orders' : 'View Orders',
      collection: 'allOrders',
      adminOnly: false
    },
    { id: 'viewAllMembers', name: 'View All Members', collection: 'allMembers', adminOnly: true },
    {
      id: 'updateNews',
      name: this.authService.currentUserDoc.admin ? 'Update News / Rallies' : 'News/Rallies',
      collection: 'news',
      adminOnly: false
    },
    {
      id: 'addLinks',
      name: 'Add / Remove Links',
      collection: 'links',
      adminOnly: true
    }
    // { id: 'customCommands', name: 'Custom Commands', collection: 'commands', adminOnly: true }
  ].filter(tabPanel => (tabPanel.adminOnly && this.authService.currentUserDoc.admin) || !tabPanel.adminOnly);

  constructor(
    public authService: AuthService,
    public productService: ProductService,
    public categoryService: CategoryService,
    public accountService: AccountService,
    private afs: AngularFirestore
  ) {
    // console.log(this.accountService.categories);
    // Creates the form
    this.accountService.createForm();

    try {
      // stores the users collection of order Refs
      this.accountService.usersOrderCollection = this.authService.userRef.collection<Order>('orders', ref =>
        ref.orderBy('order_date')
      );
      // stores the users collection of order Document Data asynchronously
      this.accountService.orders$ = this.accountService.usersOrderCollection.valueChanges();

      // gets the user IDs and stores it in an array
      this.accountService.allUsersCollectionValue = this.afs.collection<User>('users').valueChanges();
      this.accountService.allUsersCollectionValue$ = this.accountService.allUsersCollectionValue.subscribe(docs => {
        this.accountService.allUserIds = docs
          .filter(({ uid }) => uid !== 'adminList')
          .map(({ uid }) => {
            return uid;
          });
        // console.log(this.accountService.allUserIds);
        // uses the ids to get all the user refs
        this.accountService.allUserDocs = this.accountService.allUserIds.map(id =>
          this.afs
            .collection<User>('users', ref => ref.orderBy('firstName').orderBy('lastName'))
            .doc<User>(id)
        );
        // gets all the orders from the user ord
        this.accountService.allUsersOrderCollection = this.accountService.allUserDocs.map(userRef =>
          userRef.collection<Order>('orders', ref => ref.orderBy('order_date'))
        );
        // console.log('allUserDocs', this.accountService.allUserDocs);
        this.accountService.allOrders = this.accountService.allUsersOrderCollection.map(userOrderCollection =>
          userOrderCollection.valueChanges().pipe(filter(orders => orders.length > 0))
        );
        this.accountService.isEmptyObservableArray(this.accountService.allOrders);
      });
    } catch (e) {
      console.log('No Orders');
      this.accountService.noOrders = true;
    }
    $(() => {
      $('#imgUpload').on('change', async event => {
        const $input = $(event);
        const $label = $('.inputfile-name');
        const labelVal = $label.val();
        console.log('imgUpload Activated: ', $label);
        let fileName = '';
        const imageList = (event.target as HTMLInputElement).files;
        if (imageList.length > 0) {
          fileName = Array.from(imageList)
            .map(({ name }) => name)
            .toString();
        } else {
          return null;
        }
        // console.log(fileName);
        if (fileName) {
          $label.val(fileName);
        } else {
          $label.html(labelVal.toString());
        }

        // Firefox bug fix

        $(document).on('focus', $input, () => {
          $input.addClass('has-focus');
        });
        $(document).on('blur', $input, () => {
          $input.removeClass('has-focus');
        });

        const { allPercentage } = await this.accountService.uploadToStorage(event);

        this.accountService.allPercentage = combineLatest(allPercentage).pipe(
          map(percentages => {
            let result = 0;
            for (const percentage of percentages) {
              result = result + percentage;
            }
            return result / percentages.length;
          })
          // tap(console.log)
        );
      });
    });
  }
  updateCollection = collection => {
    // console.log(`Now we're in ${collection}`);

    this.accountService.collection = collection;
  };

  ngOnInit(): void {}

  ngOnDestroy() {
    this.accountService.allUsersCollectionValue$.unsubscribe();
  }
}
