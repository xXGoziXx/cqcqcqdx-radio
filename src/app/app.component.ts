import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare var $: any;
declare let gtag: (config: string, id: string, options?: any) => void;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cqcqcqdx-radio';
  router$: Subscription;
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
    unescape(word.replace(new RegExp(searchValue, 'g'), replaceValue));

  constructor(router: Router) {
    this.router$ = router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((res: NavigationEnd) => {
        gtag('config', 'G-4WJ82MYLW6', {
          page_path: res.urlAfterRedirects
        });
        this.breadcrumbs = res.urlAfterRedirects.split('/');
        this.breadcrumbs.shift();
        // if (this.breadcrumbs[0] === 'product') {
        //   console.log('breadcrumb found');
        // }
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
  ngOnDestroy() {
    this.router$.unsubscribe();
  }
}
