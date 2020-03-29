import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';

import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/User';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  reset = false;
  onSubmit(f: NgForm) {
    console.log(f.value);

  }
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {}
}
