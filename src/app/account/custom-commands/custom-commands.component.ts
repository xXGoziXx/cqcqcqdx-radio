import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import _ from 'lodash';

@Component({
  selector: 'app-custom-commands',
  templateUrl: './custom-commands.component.html',
  styleUrls: ['./custom-commands.component.scss']
})
export class CustomCommandsComponent implements OnInit {
  constructor() {}
  removeUnusedImages = async () => {
    // Get a list of all images used in firestore
    // from the products and manufacturers collection
    let fsImageList = [];
    const products$ = await firebase
      .firestore()
      .collection('products')
      .orderBy('name')
      .get();
    const manufacturers$ = await firebase
      .firestore()
      .collection('manufacturers')
      .orderBy('name')
      .get();
    const productImages = products$.docs.map(doc => doc.data().images);
    const manufacturerImages = manufacturers$.docs.map(doc => doc.data().images);
    const images = [...productImages, ...manufacturerImages];
    images.forEach(image => {
      fsImageList = [...fsImageList, ...image];
    });
    fsImageList = fsImageList.map(image => firebase.storage().refFromURL(image).fullPath);
    console.log('These are all the images being used: ', fsImageList);

    // Get a list of all images in the cloud storage
    let csImageList = [];
    // Create a reference under which you want to list
    const listRef = firebase
      .storage()
      .ref()
      .child('images');

    // Find all the prefixes and items.
    const res = await listRef.listAll();
    try {
      res.items.forEach(itemRef => {
        // All the items under listRef.
        csImageList = [...csImageList, itemRef.fullPath];
      });
      // console.log('These are all the images in cloud storage: ', csImageList);
    } catch (err) {
      // Uh-oh, an error occurred!
      console.log('"Error: ', err);
    }
    const filesToBeDeleted = _.difference(csImageList, fsImageList);
    console.log('These are the files to be deleted: ', filesToBeDeleted);
    filesToBeDeleted.forEach(async filePath => {
      await firebase
        .storage()
        .ref()
        .child(filePath)
        .delete();
    });
  };
  ngOnInit(): void {}
}
