import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from 'src/app/interfaces/Product';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-used-category',
  templateUrl: './used-category.component.html',
  styleUrls: ['./used-category.component.scss']
})
export class UsedCategoryComponent implements OnInit {
  category = {
    route: '',
    banner: ''
  };
  products$: Observable<Product[]>;
  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // console.log(params.get('category'));
      // 'category' is the variable name from 'app-routing'
      this.category.route = params.get('category');
      this.category.banner = params.get('category').replace(/-/g, ' ');
      this.products$ = this.afs
        .collection<Product>('products', ref => ref.where('category', '==', this.category.banner))
        .valueChanges();
    });
    // console.log(this.category);
  }
}
