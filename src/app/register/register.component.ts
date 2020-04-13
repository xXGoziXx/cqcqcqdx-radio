import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateAccessCode } from '../validators/accessCode.validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(public authService: AuthService, private fb: FormBuilder) {
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
      accessCode: ['', Validators.required, ValidateAccessCode.bind(this)],
      country: ['IE', Validators.required]
    });
  }
  ngOnInit() {}
}
