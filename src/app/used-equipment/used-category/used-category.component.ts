import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // console.log(params.get('category'));
      this.category.route = params.get('category');
      this.category.banner = params.get('category').replace(/-/g, ' ');
    });
    // console.log(this.category);
  }
}
