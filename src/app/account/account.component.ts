import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../interfaces/Order';
import { AuthService } from '../services/auth.service';
import { combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from '../services/product.service';
import { User } from '../interfaces/User';
import { CategoryService } from '../services/category.service';
import { tap, map } from 'rxjs/operators';
import { Manufacturer } from '../interfaces/Manufacturer';
import { AccountService } from '../services/account.service';
import { Product } from '../interfaces/Product';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  tabPanels = [
    { id: 'myOrders', name: 'My Orders', collection: 'myOrders', adminOnly: false },
    { id: 'addProduct', name: 'Add / Remove Product', collection: 'products', adminOnly: false },
    { id: 'addManufacturer', name: 'Add / Remove Manufacturer', collection: 'manufacturer', adminOnly: false },
    { id: 'viewAllOrders', name: 'View All Orders', collection: 'allOrders', adminOnly: false },
    { id: 'viewAllMembers', name: 'View All Members', collection: 'allMembers', adminOnly: true }
  ].filter(tabPanel => (tabPanel.adminOnly && this.authService.currentUserDoc.admin) || !tabPanel.adminOnly);

  constructor(
    public authService: AuthService,
    public productService: ProductService,
    public categoryService: CategoryService,
    public accountService: AccountService,
    private afs: AngularFirestore
  ) {
    console.log(this.accountService.categories);
    // Creates the form
    this.accountService.createForm();

    try {
      // stores the users collection of order Refs
      this.accountService.usersOrderCollection = this.authService.userRef.collection<Order>('orders');
      // stores the users collection of order Document Data asynchronously
      this.accountService.orders$ = this.accountService.usersOrderCollection.valueChanges();

      // gets the user IDs and stores it in an array
      this.accountService.allUsersCollectionSnapshot = this.afs.collection<User>('users').snapshotChanges();
      this.accountService.allUsersCollectionSnapshot$ = this.accountService.allUsersCollectionSnapshot.subscribe(
        docs => {
          this.accountService.allUserIds = docs
            .filter(doc => doc.payload.doc.id !== 'adminList')
            .map(doc => {
              return doc.payload.doc.id;
            });
          // console.log(this.accountService.allUserIds);
          // uses the ids to get all the user refs
          this.accountService.allUserDocs = this.accountService.allUserIds.map(id =>
            this.afs.collection<User>('users').doc<User>(id)
          );
          // gets all the orders from the user ord
          this.accountService.allUsersOrderCollection = this.accountService.allUserDocs.map(userRef =>
            userRef.collection<Order>('orders')
          );
          // console.log('allUserDocs', this.accountService.allUserDocs);
          this.accountService.allOrders = this.accountService.allUsersOrderCollection.map(userOrderCollection =>
            userOrderCollection.valueChanges()
          );
        }
      );
    } catch (e) {
      console.log('No Orders');
    }
    $(document).on('change', '#imgUpdate', event => {
      // console.log(event);
      switch (this.accountService.collection) {
        case 'manufacturers':
          const manufacturerDocIdsSub = this.afs
            .collection<Manufacturer>('manufacturers', ref => ref.where('name', '==', event.target.name))
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
                this.accountService.uploadToStorage(event, id);
              });
              manufacturerDocIdsSub.unsubscribe();
            });
          break;
        case 'products':
          const productDocIdsSub = this.afs
            .collection<Product>('products', ref => ref.where('name', '==', event.target.name))
            .snapshotChanges()
            .pipe(
              map(actions =>
                actions.map(a => {
                  const data = a.payload.doc.data() as Product;
                  const id = a.payload.doc.id;
                  // console.log({ id, ...data });
                  return id;
                })
              )
            )
            .subscribe(ids => {
              ids.forEach(id => {
                this.accountService.uploadToStorage(event, id);
              });
              productDocIdsSub.unsubscribe();
            });
          break;

        default:
          break;
      }
    });
    $(document).on('change', '#imgUpload', event => {
      const $input = $(event);
      const $label = $('.inputfile-name');
      const labelVal = $label.val();
      // console.log($input);
      let fileName = '';

      if (event.target.files && event.target.files.length > 1) {
        fileName = (event.target.getAttribute('data-multiple-caption') || '').replace(
          '{count}',
          event.target.files.length
        );
      } else if (event.target.value) {
        fileName = event.target.value.split('\\').pop();
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

      const { allPercentage } = this.accountService.uploadToStorage(event);

      this.accountService.allPercentage = combineLatest(allPercentage).pipe(
        map(percentages => {
          let result = 0;
          for (const percentage of percentages) {
            result = result + percentage;
          }
          return result / percentages.length;
        }),
        // tap(console.log)
      );
    });
  }
  updateCollection = collection => {
    // console.log(`Now we're in ${collection}`);

    this.accountService.collection = collection;
  };

  ngOnInit(): void {}

  ngOnDestroy() {
    this.accountService.allUsersCollectionSnapshot$.unsubscribe();
  }
}
