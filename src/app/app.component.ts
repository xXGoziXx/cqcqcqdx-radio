import { Component, HostBinding, Host, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cqcqcqdx-radio';
  slickOptions = {
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'ease-in-out'
  };
  currentSlide = 0;
  onActivate(event) {
    $(() => {
      console.log('hello');
      $(document).foundation();
      const carousel = $('.slick-carousel').slick(this.slickOptions);
      $('.orbit-next').on('click', () => {
        carousel.slick('slickNext');
      });
      $('.orbit-previous').on('click', () => {
        carousel.slick('slickPrev');
      });
      $('.orbit-bullets>button').on('click', event => {
        carousel.slick('slickGoTo', $(event.target).attr('data-slide'));
      });
      $('.slick-carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        this.currentSlide = currentSlide;
        $('[data-slide=' + currentSlide + ']').removeClass('is-active');
        $('[data-slide=' + nextSlide + ']').addClass('is-active');
      });
    });
  }
  ngOnInit() {}
}
