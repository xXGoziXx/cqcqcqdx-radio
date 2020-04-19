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

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const _ = require('lodash');

// Your organisation name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Cloud Storage for CQCQCQDX Radio Firebase';

exports.deleteUser = functions.firestore.document('users/{userId}').onDelete(async (snap, context) => {
  console.log('snap: ', snap);
  console.log('context: ', context);
  console.log('data: ', snap.data());
  const uid = snap.data().uid;
  try {
    const sub = await admin
      .firestore()
      .collection(`users/${uid}/orders`)
      .get();
    console.log('Users orders successfully deleted!');
    if (sub.docs.length > 0) {
      sub.docs.forEach(doc => {
        doc.ref.delete();
      });
    }
  } catch (error) {
    console.log('User has no orders!');
  }
  try {
    await admin.auth().deleteUser(uid);
    return console.log('Successfully deleted user');
  } catch (error) {
    return console.log('Error deleting user:', error);
  }
});
exports.updateUserDetails = functions.firestore.document('users/adminList').onUpdate(async (snap, context) => {
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
    let uid;
    const users = await admin
      .firestore()
      .collection('users')
      .where('email', '==', emails[0])
      .get();
    users.forEach(user => {
      user.ref.update({
        admin: value
      });
    });
    console.log('Users: ', users);
    return emails[0];
  }
  return 'The admin list of emails did not change!';
});

exports.onUpdateManufacturers = functions.firestore
  .document('manufacturers/{manufacturerId}')
  .onUpdate(async (snap, context) => {
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
    products.forEach(async product => {
      await product.ref.update({
        manufacturer: after.data().name
      });
    });
    return products;
  });

exports.sendContactMessage = functions.firestore.document('messages/{pushKey}').onCreate((snap, context) => {
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
  mailTransport0.sendMail(mailOptions, (err, data) => {
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
  mailTransport1.sendMail(mailOptions, (err, data) => {
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
  mailTransport1.sendMail(mailOptions, (err, data) => {
    err ? console.log('3. Error Occurs:', err) : console.log('3. Email Sent:', data);
  });
  return console.log(`Mail successfully sent to ${val.name}<${val.email}>!`);
});

exports.incrementOrderCounter = functions.firestore
  .document('users/{userId}/orders/{orderId}')
  .onCreate(async (snap, context) => {
    console.log('snap: ', snap);
    console.log('context: ', context);
    await snap.ref.update({ order_uid: snap.ref.id });
    let orderCounter = 1;
    try {
      const doc = await admin
        .firestore()
        .doc('users/adminList')
        .get();
      if (doc.exists) {
        console.log('Document data:', doc.data());
        orderCounter += doc.data().orderCounter;
        console.log('Order Counter:', orderCounter);
        admin
          .firestore()
          .doc('users/adminList')
          .update({ orderCounter });
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
    return orderCounter;
  });

exports.incrementProductCounter = functions.firestore
  .document('products/{productId}')
  .onCreate(async (snap, context) => {
    let productCounter = 1;
    try {
      const doc = await admin
        .firestore()
        .doc('users/adminList')
        .get();
      if (doc.exists) {
        console.log('Document data:', doc.data());
        productCounter += doc.data().productCounter;
        admin
          .firestore()
          .doc('users/adminList')
          .update({ productCounter });
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
    return productCounter;
  });

exports.updateStockFromOrder = functions.firestore
  .document('users/{userId}/orders/{orderId}')
  .onCreate(async (snap, context) => {
    const orderDoc = snap.data();
    console.log(orderDoc);
    let orderProductIds = [];
    let currId = 0;
    let currPosition = -1;
    orderDoc.product_ids.sort().forEach(id => {
      if (currId === id) {
        orderProductIds[currPosition].push(currId);
      } else {
        currId = id;
        orderProductIds.push([currId]);
        currPosition++;
      }
    });
    console.log('orderProductIds:', orderProductIds);
    orderProductIds.forEach(async (id, index) => {
      let stock = -orderProductIds[index].length;
      try {
        const querySnapshot = await admin
          .firestore()
          .collection('products')
          .where('id', '==', id)
          .get();
        const doc = querySnapshot[0];
        if (doc.exists) {
          console.log('Document data:', doc.data());
          stock += doc.data().stock;
          admin
            .firestore()
            .doc(`products/${doc.id}`)
            .update({ stock });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      } catch (error) {
        console.log('Error getting document:', error);
      }
      return stock;
    });
  });
