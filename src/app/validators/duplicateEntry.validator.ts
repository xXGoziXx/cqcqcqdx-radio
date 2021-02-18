import { AbstractControl } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
export async function ValidateDuplicateEntryManufacturer(control: AbstractControl) {
  let manufacturerNames: Array<string>;
  const manufacturers$ = await firebase
    .firestore()
    .collection('manufacturers')
    .get();
  manufacturerNames = manufacturers$.docs.map(manufacturer => manufacturer.data().name.toLowerCase());
  // console.log(manufacturerNames);
  return !manufacturerNames.includes(control.value.toLowerCase()) ? null : { duplicateEntry: true };
}
export async function ValidateDuplicateEntryProduct(control: AbstractControl) {
  let productNames: Array<string>;
  const products$ = await firebase
    .firestore()
    .collection('products')
    .get();
  productNames = products$.docs.map(product => product.data().name.toLowerCase());
  // console.log(productNames);
  return !productNames.includes(control.value.toLowerCase()) ? null : { duplicateEntry: true };
}
export async function ValidateDuplicateEntryLink(control: AbstractControl) {
  let linkNames: Array<string>;
  const links$ = await firebase
    .firestore()
    .collection('links')
    .get();
  linkNames = links$.docs.map(link => link.data().name.toLowerCase());
  // console.log(linkNames);
  return !linkNames.includes(control.value.toLowerCase()) ? null : { duplicateEntry: true };
}
