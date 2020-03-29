import { AbstractControl } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
export async function ValidateAccessCode(control: AbstractControl) {
  let accessCode: string;
  const adminList$ = await firebase
    .firestore()
    .doc('users/adminList')
    .get();
  accessCode = adminList$.data().accessCode[0];
  // console.log(accessCode);
  return control.value === accessCode ? null : { invalidAccessCode: true };
}
