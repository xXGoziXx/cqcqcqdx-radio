import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../../interfaces/Product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manufacturer-products',
  templateUrl: './manufacturer-products.component.html',
  styleUrls: ['./manufacturer-products.component.scss']
})
export class ManufacturerProductsComponent implements OnInit, OnDestroy {
  manufacturer = {
    route: '',
    banner: ''
  };
  products$: Observable<Product[]>;
  routeParams: any;
  searchText: string;
  defaultImage = '../../assets/img/Spinner.svg';

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}
  ngOnInit() {
    this.routeParams = this.route.paramMap.subscribe(params => {
      // console.log(params.get('manufacturer'));
      // 'manufacturer' is the variable name from 'app-routing'
      this.manufacturer.route = params.get('manufacturer');
      this.manufacturer.banner = params.get('manufacturer').replace(/-/g, ' ');
      this.products$ = this.afs
        .collection<Product>('products', ref =>
          ref.where('manufacturer', '==', this.manufacturer.banner).orderBy('name')
        )
        .valueChanges();
    });
    // console.log(this.manufacturer);
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.routeParams.unsubscribe();
  }
}
