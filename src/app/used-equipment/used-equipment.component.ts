import { Component, OnInit } from '@angular/core';
import { used, CategoryService } from '../services/category.service';
@Component({
  selector: 'app-used-equipment',
  templateUrl: './used-equipment.component.html',
  styleUrls: ['./used-equipment.component.scss']
})
export class UsedEquipmentComponent implements OnInit {
  categories = used;
  constructor(public categoryService: CategoryService) {}

  ngOnInit() {}
}
