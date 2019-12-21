import { Component, OnInit, HostBinding, Host } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  radios = [
    {
      src: '../../assets/radio1.png',
      alt: 'radio1'
    },
    {
      src: '../../assets/radio2.png',
      alt: 'radio2'
    },
    {
      src: '../../assets/radio3.png',
      alt: 'radio3'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
