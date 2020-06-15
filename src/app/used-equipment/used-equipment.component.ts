import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
@Component({
  selector: 'app-used-equipment',
  templateUrl: './used-equipment.component.html',
  styleUrls: ['./used-equipment.component.scss']
})
export class UsedEquipmentComponent implements OnInit {
  defaultImage = '../../assets/img/Spinner.svg';
  searchText: string;
  categories = this.categoryService.used;
  constructor(public categoryService: CategoryService) {}

  ngOnInit() {}
}
