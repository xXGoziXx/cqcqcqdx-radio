import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/User';
import { AuthService } from '../services/auth.service';
import { used, manufacturers, brandNew, CategoryService } from '../services/category.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  usedCategories = used;
  brandNewCategories = brandNew;
  manufacturerCategories = manufacturers;
  constructor(public authService: AuthService, public categoryService: CategoryService) {}

  ngOnInit() {}
}
