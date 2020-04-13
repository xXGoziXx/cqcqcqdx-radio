import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { Product } from '../interfaces/Product';
import { ProductService } from '../services/product.service';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  id: number;
  routeParams: Subscription;
  isProductId = !Number.isNaN(this.id);
  myInterval = 3000;
  activeSlideIndex = 0;
  quantity = 1;
  products$: Observable<Product[]>;
  slickOptions = {
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'ease-in-out',
    slidesToShow: 1
  };
  arrNum = num =>
    Array(num)
      .fill(0)
      .map((val, i) => i);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore,

    public productService: ProductService
  ) {
    // this.radios = this.radios.map((radio: any) => ({
    //   src: radio.src,
    //   alt: radio.alt,
    //   caption: sanitizer.sanitize(SecurityContext.HTML, radio.caption)
    // }));
  }
  ngOnInit(): void {
    this.routeParams = this.route.paramMap.subscribe(params => {
      // console.log(params.get('category'));
      // 'category' is the variable name from 'app-routing'
      this.id = parseInt(params.get('id'), 10);
      // console.log(params.get('id'));
      this.isProductId = !Number.isNaN(this.id);
      // this.isProductId ? console.log(true, this.id) : console.log(false, this.id);
      if (this.isProductId) {
        this.products$ = this.afs
          .collection<Product>('products', ref => ref.where('id', '==', this.id.toString()))
          .valueChanges();
      } else {
        this.router.navigate(['/shop-now']);
      }
    });
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.routeParams.unsubscribe();
  }
}
