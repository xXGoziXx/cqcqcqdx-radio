import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  constructor(
    public accountService: AccountService,
    public productService: ProductService,
    public categoryService: CategoryService
  ) {}
  ngOnInit(): void {}
}
