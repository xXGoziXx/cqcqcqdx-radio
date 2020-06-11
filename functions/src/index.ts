import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
import * as nodemailer from 'nodemailer';
import * as _ from 'lodash';
import { Order } from './Order';
import { Product } from './Product';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Your organisation name to include in the emails
// const APP_NAME = 'Cloud Storage for CQCQCQDX Radio Firebase';

export const deleteUser = functions.firestore
  .document('users/{userId}')
  .onDelete(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    console.log('snap: ', snap);
    console.log('context: ', context);
    console.log('data: ', snap.data());
    const uid = snap.data().uid;
    try {
      const userOrders = await admin
        .firestore()
        .collection(`users/${uid}/orders`)
        .get();
      console.log('Users orders successfully deleted!');
      if (userOrders.docs.length > 0) {
        userOrders.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
          doc.ref.delete().catch((err: Error) => {
            console.error(err);
          });
        });
      }
    } catch (error) {
      console.log('User has no orders!, error');
    }
    try {
      await admin.auth().deleteUser(uid);
      console.log('Successfully deleted user');
      return 'Success';
    } catch (error) {
      console.log('Error deleting user:', error);
      return 'Error';
    }
  });
export const updateUserDetails = functions.firestore
  .document('users/adminList')
  .onUpdate(
    async (snap: functions.Change<functions.firestore.QueryDocumentSnapshot>, context: functions.EventContext) => {
      console.log('snap: ', snap);
      console.log('context: ', context);
      const { before, after } = snap;
      console.log('Before: ', before.data());
      console.log('After: ', after.data());
      let value = false;
      let emails = _.difference(before.data().emails, after.data().emails);
      if (!emails.length) {
        value = true;
        emails = _.difference(after.data().emails, before.data().emails);
      }
      if (emails.length) {
        console.log('Email Difference: ', emails[0], value);
        // let uid;
        const users = await admin
          .firestore()
          .collection('users')
          .where('email', '==', emails[0])
          .get();
        users.forEach((user: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
          user.ref
            .update({
              admin: value
            })
            .catch(err => {
              console.error(err);
            });
        });
        console.log('Users: ', users);
        return emails[0];
      }
      return 'The admin list of emails did not change!';
    }
  );

export const onUpdateManufacturers = functions.firestore
  .document('manufacturers/{manufacturerId}')
  .onUpdate(
    async (snap: functions.Change<functions.firestore.QueryDocumentSnapshot>, context: functions.EventContext) => {
      console.log('snap: ', snap);
      console.log('context: ', context);
      const { before, after } = snap;
      console.log('Before: ', before.data());
      console.log('After: ', after.data());
      const products = await admin
        .firestore()
        .collection('products')
        .where('manufacturer', '==', before.data().name)
        .get();
      products.forEach(async (product: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
        await product.ref.update({
          manufacturer: after.data().name
        });
      });
      return products;
    }
  );

export const sendContactMessage = functions.firestore
  .document('messages/{pushKey}')
  .onCreate((snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const { email, password } = functions.config().client;
    const emails = email.split(',');
    const passwords = password.split(',');
    console.log(emails, passwords);
    const mailTransport0 = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emails[0],
        pass: passwords[0]
      }
    });
    const mailTransport1 = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emails[1],
        pass: passwords[1]
      }
    });

    const val = snap.data();
    console.log('Data: ', val);
    let mailOptions = {
      to: emails[0],
      from: `"${val.name}" <${val.email}>`,
      sender: `"${val.name}" <${val.email}>`,
      replyTo: `"${val.name}" ${val.email}`,
      subject: `Message from "${val.name}"`,
      html: val.html
    };
    // email sent to nosarobo@gmail.com
    mailTransport0.sendMail(mailOptions, (err: Error | null, data: any) => {
      err ? console.log('1. Error Occurs:', err) : console.log('1. Email Sent:', data);
    });

    mailOptions = {
      to: emails[1],
      from: `"${val.name}" <${val.email}>`,
      sender: `"${val.name}" <${val.email}>`,
      replyTo: `"${val.name}" ${val.email}`,
      subject: `Message from "${val.name}"`,
      html: val.html
    };
    // email sent to myradiogear@gmail.com
    mailTransport1.sendMail(mailOptions, (err: Error | null, data: any) => {
      err ? console.log('2. Error Occurs:', err) : console.log('2. Email Sent:', data);
    });

    console.log('Mail Options: ', mailOptions);
    // for user from myradiogear@gmail.com
    mailOptions = {
      to: val.email,
      from: `"CQCQCQDX Radio" <${emails[1]}>`,
      sender: `"CQCQCQDX Radio" <${emails[1]}>`,
      replyTo: `"CQCQCQDX Radio" <${emails[1]}>`,
      subject: `Message from "CQCQCQDX Radio"`,
      html: `<div>
            <div>
              <p>Hi ${val.name},<br>
                <br>
                CQCQCQDX Radio has successfully received your message.<br>
                We will try to respond to
                you as soon as we can.<br>
                <br>
                <br>
                Kind Regards,<br>
                CQCQCQDX Radio
              </p>
            </div>
            <hr>
            <div>
              <p>
                <b><i>Important Info:</i></b><br>
                <i>We do take time to read each and every single message sent to us.<br>
                So, if you're not the one that sent a message to us on our website, please reply to this email and alert us immediately.</i>
              </p>
            </div>
          </div>`
    };
    mailTransport1.sendMail(mailOptions, (err: Error | null, data: any) => {
      err ? console.log('3. Error Occurs:', err) : console.log('3. Email Sent:', data);
    });
    return `Mail successfully sent to ${val.name}<${val.email}>!`;
  });

export const incrementOrderCounter = functions.firestore
  .document('users/{userId}/orders/{orderId}')
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    console.log('snap: ', snap);
    console.log('context: ', context);
    await snap.ref.update({ order_uid: snap.ref.id });
    let orderCounter = 1;
    try {
      const doc = await admin
        .firestore()
        .doc('users/adminList')
        .get();
      const docData = doc.data();
      console.log('Does the order doc exists?', doc.exists);
      if (doc.exists && docData) {
        console.log('Document data:', docData);
        orderCounter += docData.orderCounter;
        console.log('Order Counter:', orderCounter);
        admin
          .firestore()
          .doc('users/adminList')
          .update({ orderCounter })
          .catch((err: Error | null) => {
            console.error(err);
          });
      } else {
        // docData will be undefined in this case
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
    return orderCounter;
  });

export const incrementProductCounter = functions.firestore
  .document('products/{productId}')
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    let productCounter = 1;
    try {
      const doc = await admin
        .firestore()
        .doc('users/adminList')
        .get();
      const docData = doc.data();
      console.log('Does the order doc exists?', doc.exists);
      if (doc.exists && docData) {
        console.log('Document data:', docData);
        productCounter += docData.productCounter;
        admin
          .firestore()
          .doc('users/adminList')
          .update({ productCounter })
          .catch((err: Error | null) => {
            console.error(err);
          });
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
    return productCounter;
  });

export const updateStockFromOrder = functions.firestore
  .document('users/{userId}/orders/{orderId}')
  .onCreate(async (snap, context) => {
    const orderDoc: Order = snap.data() as Order;
    console.log('Order Doc:', orderDoc);
    // Sample Order of products: [30,50,50,60]
    // Result: [[30],[50,50],[60]]
    const orderProductIds: Array<Array<string>> = [];
    let currId = '0';
    let currPosition = 0;
    orderDoc.product_ids.sort().forEach(id => {
      // check for duplicates and add them to the productid array of the last item
      if (currId === id) {
        orderProductIds[currPosition - 1].push(id);
      } else {
        currId = id; // keep track of what product we're on
        orderProductIds.push([currId]);
        currPosition++;
      }
    });
    console.log('orderProductIds:', orderProductIds);
    orderProductIds.forEach(async (id, index) => {
      // Sets the stock to the quantity bought in this order
      let stock = -orderProductIds[index].length;
      try {
        const querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await admin
          .firestore()
          .collection('products')
          .where('id', '==', id)
          .get();
        console.log('Query Snapshot:', querySnapshot);
        console.log('Query Snapshot Docs:', querySnapshot.docs[0]);
        console.log('Document data:', querySnapshot.docs[0].data());
        let doc: Product;
        if (!querySnapshot.empty) {
          doc = querySnapshot.docs[0].data() as Product;
          console.log('Document data:', doc);
          stock += doc.stock;
          admin
            .firestore()
            .doc(`products/${doc.id}`)
            .update({ stock })
            .catch((err: Error | null) => {
              console.error(err);
            });
        } else {
          // doc.data() will be undefined in this case
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
      return stock;
    });
  });
