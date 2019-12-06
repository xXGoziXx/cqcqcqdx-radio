import { Component, OnInit, HostBinding, Host } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @HostBinding('class.app-home') appHome: Host = true;

  constructor () { }

  ngOnInit () {
  }

}
