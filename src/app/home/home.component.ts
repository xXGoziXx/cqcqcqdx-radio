import { Component, OnInit, HostBinding, Host } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  radios = [
    {
      alt: 'radio1',
      src: '../../assets/img/home/radio1.png'
    },
    {
      alt: 'radio2',
      src: '../../assets/img/home/radio2.png'
    },
    {
      alt: 'radio3',
      src: '../../assets/img/home/radio3.png'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
