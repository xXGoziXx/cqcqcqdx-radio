import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../interfaces/Message';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private afs: AngularFirestore, private sanitizer: DomSanitizer) {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  onSubmit() {
    const { name, email, telephone, message } = this.form.value;
    const date = new Date();
    const html = `
      <div>${this.sanitizer.sanitize(SecurityContext.HTML, message.replace(/(?:\r\n|\r|\n)/g, '<br>'))}
      </div>
      <br>
      <hr>
      <div>
        <p>
          Message from: ${name.trim()} <a href="mailto:${email.trim()}">&lt;${email.trim()}&gt;</a>
          <br>
          Sent on: ${date}
          <br>
          Phone: <a href="tel:${telephone.trim()}">${telephone.trim()}</a>
        </p>
      </div>
    `;
    const formRequest: Message = {
      name: name.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
      message,
      date: firebase.firestore.Timestamp.fromDate(date),
      html
    };
    this.afs.collection('messages').add(formRequest);
    this.form.reset();
  }

  ngOnInit() {}
}
