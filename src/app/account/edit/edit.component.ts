import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../interfaces/User';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  form: FormGroup;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer
  ) {}
  createForm() {
    this.form = this.fb.group({
      firstName: [this.authService.currentUserDoc.firstName, Validators.required],
      lastName: [this.authService.currentUserDoc.lastName, Validators.required],
      email: [this.authService.currentUserDoc.email, [Validators.required, Validators.email]],
      password: [''],
      telephone: [this.authService.currentUserDoc.telephone, Validators.required],
      address1: [this.authService.currentUserDoc.address.address_lines[0], Validators.required],
      address2: [this.authService.currentUserDoc.address.address_lines[1]],
      address3: [this.authService.currentUserDoc.address.address_lines[2]],
      townCity: [this.authService.currentUserDoc.address.townCity, Validators.required],
      postcode: [this.authService.currentUserDoc.address.postcode, Validators.required],
      country: [this.authService.currentUserDoc.address.country, Validators.required]
    });
  }
  ngOnInit() {
    this.createForm();
  }
}
