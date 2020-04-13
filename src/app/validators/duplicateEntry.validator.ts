import { AbstractControl } from '@angular/forms';
import firebase from '@firebase/app';
import '@firebase/firestore';
export async function ValidateDuplicateEntry(control: AbstractControl) {
  let manufacturerNames: Array<string>;
  const manufacturers$ = await firebase
    .firestore()
    .collection('manufacturers')
    .get();
  manufacturerNames = manufacturers$.docs.map(manufacturer => manufacturer.data().name.toLowerCase());
  // console.log(manufacturerNames);
  return !manufacturerNames.includes(control.value.toLowerCase()) ? null : { duplicateEntry: true };
}
