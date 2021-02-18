import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-links',
  templateUrl: './add-links.component.html',
  styleUrls: ['./add-links.component.scss']
})
export class AddLinksComponent implements OnInit {
  links$: Observable<any>;

  constructor(private afs: AngularFirestore, public accountService: AccountService) {
    this.links$ = this.afs.collection('links', ref => ref.orderBy('name')).valueChanges();
  }

  ngOnInit(): void {}
}
