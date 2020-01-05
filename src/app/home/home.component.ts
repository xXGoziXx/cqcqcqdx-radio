import { Component, SecurityContext, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import { Orbit } from 'foundation-sites/js/foundation';
import $ from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  myInterval = 3000;
  activeSlideIndex = 0;
  radios = [
    {
      alt: 'ICOM IC-7851',
      src: '../../assets/img/home/radio1.png',
      caption: 'ICOM IC-7851'
    },
    {
      alt: 'Kenwood TS-990',
      src: '../../assets/img/home/radio2.png',
      caption: 'Kenwood TS-990'
    },
    {
      alt: 'Yaesu FTDX9000D',
      src: '../../assets/img/home/radio3.png',
      caption: 'Yaesu FTDX9000D'
    }
  ];
  constructor(sanitizer: DomSanitizer) {
    this.radios = this.radios.map((radio: any) => ({
      src: radio.src,
      alt: radio.alt,
      caption: sanitizer.sanitize(SecurityContext.HTML, radio.caption)
    }));
  }

  ngOnInit() {}
}
