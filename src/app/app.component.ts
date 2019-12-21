import { Component, HostBinding, Host, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cqcqcqdx-radio';
  ngOnInit() {
    $(document).foundation();
  }
}
