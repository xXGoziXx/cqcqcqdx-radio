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
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const { id, secret, refresh_token, email } = functions.config().client;
const oauth2Client = new OAuth2(
  id, // ClientID
  secret, // Client Secret
  'https://developers.google.com/oauthplayground' // Redirect URL
);
oauth2Client.setCredentials({
  refresh_token: refresh_token
});
const emails = email.split(',');
const accessToken = oauth2Client.getAccessToken();
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: emails[0],
    clientId: id,
    clientSecret: secret,
    refreshToken: refresh_token,
    accessToken: accessToken
  }
});
const mailTransport2 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: emails[1],
    clientId: id,
    clientSecret: secret,
    refreshToken: refresh_token,
    accessToken: accessToken
  }
});

// Your organisation name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Cloud Storage for CQCQCQDX Radio Firebase';

exports.sendContactMessage = functions.firestore.document('messages/{pushKey}').onCreate((snap, context) => {
  const val = snap.data();
  console.log('Data: ', val);
  let mailOptions = {
    to: email,
    from: `"${val.name}" <${val.email}>`,
    sender: `"${val.name}" <${val.email}>`,
    replyTo: `"${val.name}" ${val.email}`,
    subject: `Message from "${val.name}"`,
    html: val.html
  };
  return () => {
    mailTransport
      .sendMail(mailOptions)
      .then(() => {
        mailOptions = {
          to: val.email,
          from: `"CQCQCQDX Radio" <${email}>`,
          sender: `"CQCQCQDX Radio" <${email}>`,
          replyTo: `"CQCQCQDX Radio" <${email}>`,
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
        return mailTransport.sendMail(mailOptions);
      })
      .then(() => {
        return console.log(`Mail successfully sent to ${val.name}<${val.email}>!`);
      })
      .catch();
    return mailTransport2
      .sendMail(mailOptions)
      .then(() => {
        mailOptions = {
          to: val.email,
          from: `"CQCQCQDX Radio" <${email}>`,
          sender: `"CQCQCQDX Radio" <${email}>`,
          replyTo: `"CQCQCQDX Radio" <${email}>`,
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
        return mailTransport.sendMail(mailOptions);
      })
      .then(() => {
        return console.log(`Mail successfully sent to ${val.name}<${val.email}>!`);
      });
  };
});

exports.incrementOrderCounter = functions.firestore
  .document('users/{userId}/orders/{orderId}')
  .onCreate((snap, context) => {
    return admin
      .firestore()
      .doc('users/adminList')
      .get()
      .then(doc => {
        let orderCounter = 0;
        if (doc.exists) {
          console.log('Document data:', doc.data());
          orderCounter = doc.data().orderCounter++;
          admin
            .firestore()
            .doc('users/adminList')
            .update({ orderCounter });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
        return orderCounter;
      })
      .catch(error => {
        console.log('Error getting document:', error);
      });
  });
exports.incrementProductCounter = functions.firestore.document('products/{productId}').onCreate((snap, context) => {
  return admin
    .firestore()
    .doc('users/adminList')
    .get()
    .then(doc => {
      let productCounter = 0;
      if (doc.exists) {
        console.log('Document data:', doc.data());
        productCounter = doc.data().productCounter++;
        admin
          .firestore()
          .doc('users/adminList')
          .update({ productCounter });
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
      return productCounter;
    })
    .catch(error => {
      console.log('Error getting document:', error);
    });
});
