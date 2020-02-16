import { Component, OnInit } from '@angular/core';
import { brandNew, CategoryService } from '../services/category.service';

@Component({
  selector: 'app-shop-now',
  templateUrl: './shop-now.component.html',
  styleUrls: ['./shop-now.component.scss']
})
export class ShopNowComponent implements OnInit {
  categories = brandNew;
  constructor(public categoryService: CategoryService) {}

  ngOnInit() {}
}
