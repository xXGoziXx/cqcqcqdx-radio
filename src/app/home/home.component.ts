import { Component, SecurityContext, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  news: string;
  adminListSub: Subscription;
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
  constructor(sanitizer: DomSanitizer, public afs: AngularFirestore) {
    this.radios = this.radios.map((radio: any) => ({
      src: radio.src,
      alt: radio.alt,
      caption: sanitizer.sanitize(SecurityContext.HTML, radio.caption)
    }));
    this.adminListSub = this.afs
      .doc<any>('users/adminList')
      .valueChanges()
      .subscribe(adminList => {
        this.news = adminList.news;
      });
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.adminListSub.unsubscribe();
  }
}
