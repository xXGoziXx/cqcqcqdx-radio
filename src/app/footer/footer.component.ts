import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  date = Date.now();
  links$: Observable<any>;
  constructor(private afs: AngularFirestore, public authService: AuthService) {
    this.links$ = this.afs.collection('links', ref => ref.orderBy('name')).valueChanges();
  }

  ngOnInit() {}
}
