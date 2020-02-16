import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cqcqcqdx-radio';
  routeTitle: any;
  slickOptions = {
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'ease-in-out'
  };
  breadcrumbs = [];
  currBreadcrumb = (currIndex: number) =>
    this.breadcrumbs
      .filter((_, i) => {
        return i <= currIndex;
      })
      .join('/');
  replace = (word: string, searchValue: RegExp | string, replaceValue: string) =>
    word.replace(new RegExp(searchValue, 'g'), replaceValue);

  constructor(router: Router) {
    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: NavigationEnd) => {
      this.breadcrumbs = res.urlAfterRedirects.split('/');
      this.breadcrumbs.shift();
    });
  }
  onActivate(_: any) {
    $(() => {
      $(document).foundation();
      $('#accordion').foundation('hideAll');
      const carousel = $('.slick-carousel').slick(this.slickOptions);
      $('.orbit-next').on('click', () => {
        carousel.slick('slickNext');
      });
      $('.orbit-previous').on('click', () => {
        carousel.slick('slickPrev');
      });
      $('.orbit-bullets>button').on('click', (e: { target: any }) => {
        carousel.slick('slickGoTo', $(e.target).attr('data-slide'));
      });
      $('.slick-carousel').on('beforeChange', (_: any, __: any, currentSlide: string, nextSlide: string) => {
        $('[data-slide=' + currentSlide + ']').removeClass('is-active');
        $('[data-slide=' + nextSlide + ']').addClass('is-active');
      });
    });
  }
  ngOnInit() {}
}
