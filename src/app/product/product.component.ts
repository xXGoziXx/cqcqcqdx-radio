import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { Product } from '../interfaces/Product';
import { ProductService } from '../services/product.service';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  id: number;
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
    this.route.paramMap.subscribe(params => {
      // console.log(params.get('category'));
      // 'category' is the variable name from 'app-routing'
      this.id = parseInt(params.get('id'), 10);
      this.isProductId = !Number.isNaN(this.id);
      this.isProductId ? console.log(true, this.id) : console.log(false, this.id);
      if (this.isProductId) {
        this.products$ = this.afs
          .collection<Product>('products', ref => ref.where('id', '==', this.id.toString()))
          .valueChanges();
        // there should only be one product for this
        const productsSub = this.products$.subscribe(products => {
          products.forEach(product => {
            product.images.forEach(image => {
              console.log(image);
              $('.slick-carousel').slick('unslick');
              $('.slick-carousel').slick(this.slickOptions);
              $('.slick-carousel').slick(
                'slickAdd',
                `<div>
                <figure class="orbit-figure">
                <img class="orbit-image" src="${image.toString()}" alt="${product.name}" />
                </figure>
                </div>`
              );
            });
          });
          // productsSub.unsubscribe();
        });
      } else {
        // there should be all of them
        this.products$ = this.afs.collection<Product>('products').valueChanges();
      }
    });
  }
}
