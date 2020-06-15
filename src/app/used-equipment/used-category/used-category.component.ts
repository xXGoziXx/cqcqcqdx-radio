import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../../interfaces/Product';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-used-category',
  templateUrl: './used-category.component.html',
  styleUrls: ['./used-category.component.scss']
})
export class UsedCategoryComponent implements OnInit, OnDestroy {
  category = {
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
      // console.log(params.get('category'));
      // 'category' is the variable name from 'app-routing'
      this.category.route = params.get('category');
      this.category.banner = params.get('category').replace(/-/g, ' ');
      console.log(this.category.banner);
      this.products$ = this.afs
        .collection<Product>('products', ref => ref.where('category', '==', this.category.banner.toLowerCase()))
        .valueChanges();
    });
    // console.log(this.category);
  }
  ngOnDestroy() {
    this.routeParams.unsubscribe();
  }
}
