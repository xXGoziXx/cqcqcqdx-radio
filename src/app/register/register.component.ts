import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/User';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer
  ) {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      address3: [''],
      townCity: ['', Validators.required],
      postcode: ['', Validators.required],
      country: ['IE', Validators.required]
    });
  }
  ngOnInit() {}
}
