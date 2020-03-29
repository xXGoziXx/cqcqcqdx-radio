import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Product } from '../interfaces/Product';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shop-now',
  templateUrl: './shop-now.component.html',
  styleUrls: ['./shop-now.component.scss']
})
export class ShopNowComponent implements OnInit {
  // categories = this.categoryService.brandNew;
  products$: Observable<Product[]>;
  constructor(public categoryService: CategoryService, private afs: AngularFirestore) {}

  ngOnInit() {
    this.products$ = this.afs.collection<Product>('products').valueChanges();
  }
}
