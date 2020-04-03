import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-shop-by-manufacturer',
  templateUrl: './shop-by-manufacturer.component.html',
  styleUrls: ['./shop-by-manufacturer.component.scss']
})
export class ShopByManufacturerComponent implements OnInit {
  defaultImage = '../../assets/img/Spinner.svg';

  constructor(public categoryService: CategoryService) {}

  ngOnInit() {}
}
