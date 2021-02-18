import firebase from 'firebase/app';
import 'firebase/firestore'; // If using Firebase database
import $ from 'jquery';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OnDestroy, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../interfaces/User';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from './google-analytics.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  error: string;
  status = 'Signed Out!';
  user$: Observable<User>;
  userSub: Subscription;
  userRef: AngularFirestoreDocument;
  currentUserDoc: User;
  adminList$: Observable<any>;
  adminList: any;
  adminSub: Subscription;
  authUser: firebase.User;

  countryList = [
    { abbr: 'AF', name: 'Afghanistan' },
    { abbr: 'AX', name: 'Åland Islands' },
    { abbr: 'AL', name: 'Albania' },
    { abbr: 'DZ', name: 'Algeria' },
    { abbr: 'AS', name: 'American Samoa' },
    { abbr: 'AD', name: 'Andorra' },
    { abbr: 'AO', name: 'Angola' },
    { abbr: 'AI', name: 'Anguilla' },
    { abbr: 'AQ', name: 'Antarctica' },
    { abbr: 'AG', name: 'Antigua and Barbuda' },
    { abbr: 'AR', name: 'Argentina' },
    { abbr: 'AM', name: 'Armenia' },
    { abbr: 'AW', name: 'Aruba' },
    { abbr: 'AU', name: 'Australia' },
    { abbr: 'AT', name: 'Austria' },
    { abbr: 'AZ', name: 'Azerbaijan' },
    { abbr: 'BS', name: 'Bahamas' },
    { abbr: 'BH', name: 'Bahrain' },
    { abbr: 'BD', name: 'Bangladesh' },
    { abbr: 'BB', name: 'Barbados' },
    { abbr: 'BY', name: 'Belarus' },
    { abbr: 'BE', name: 'Belgium' },
    { abbr: 'BZ', name: 'Belize' },
    { abbr: 'BJ', name: 'Benin' },
    { abbr: 'BM', name: 'Bermuda' },
    { abbr: 'BT', name: 'Bhutan' },
    { abbr: 'BO', name: 'Bolivia, Plurinational State of' },
    { abbr: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
    { abbr: 'BA', name: 'Bosnia and Herzegovina' },
    { abbr: 'BW', name: 'Botswana' },
    { abbr: 'BV', name: 'Bouvet Island' },
    { abbr: 'BR', name: 'Brazil' },
    { abbr: 'IO', name: 'British Indian Ocean Territory' },
    { abbr: 'BN', name: 'Brunei Darussalam' },
    { abbr: 'BG', name: 'Bulgaria' },
    { abbr: 'BF', name: 'Burkina Faso' },
    { abbr: 'BI', name: 'Burundi' },
    { abbr: 'KH', name: 'Cambodia' },
    { abbr: 'CM', name: 'Cameroon' },
    { abbr: 'CA', name: 'Canada' },
    { abbr: 'CV', name: 'Cape Verde' },
    { abbr: 'KY', name: 'Cayman Islands' },
    { abbr: 'CF', name: 'Central African Republic' },
    { abbr: 'TD', name: 'Chad' },
    { abbr: 'CL', name: 'Chile' },
    { abbr: 'CN', name: 'China' },
    { abbr: 'CX', name: 'Christmas Island' },
    { abbr: 'CC', name: 'Cocos (Keeling) Islands' },
    { abbr: 'CO', name: 'Colombia' },
    { abbr: 'KM', name: 'Comoros' },
    { abbr: 'CG', name: 'Congo' },
    { abbr: 'CD', name: 'Congo, the Democratic Republic of the' },
    { abbr: 'CK', name: 'Cook Islands' },
    { abbr: 'CR', name: 'Costa Rica' },
    { abbr: 'CI', name: `Côte d'Ivoire` },
    { abbr: 'HR', name: 'Croatia' },
    { abbr: 'CU', name: 'Cuba' },
    { abbr: 'CW', name: 'Curaçao' },
    { abbr: 'CY', name: 'Cyprus' },
    { abbr: 'CZ', name: 'Czech Republic' },
    { abbr: 'DK', name: 'Denmark' },
    { abbr: 'DJ', name: 'Djibouti' },
    { abbr: 'DM', name: 'Dominica' },
    { abbr: 'DO', name: 'Dominican Republic' },
    { abbr: 'EC', name: 'Ecuador' },
    { abbr: 'EG', name: 'Egypt' },
    { abbr: 'SV', name: 'El Salvador' },
    { abbr: 'GQ', name: 'Equatorial Guinea' },
    { abbr: 'ER', name: 'Eritrea' },
    { abbr: 'EE', name: 'Estonia' },
    { abbr: 'ET', name: 'Ethiopia' },
    { abbr: 'FK', name: 'Falkland Islands (Malvinas)' },
    { abbr: 'FO', name: 'Faroe Islands' },
    { abbr: 'FJ', name: 'Fiji' },
    { abbr: 'FI', name: 'Finland' },
    { abbr: 'FR', name: 'France' },
    { abbr: 'GF', name: 'French Guiana' },
    { abbr: 'PF', name: 'French Polynesia' },
    { abbr: 'TF', name: 'French Southern Territories' },
    { abbr: 'GA', name: 'Gabon' },
    { abbr: 'GM', name: 'Gambia' },
    { abbr: 'GE', name: 'Georgia' },
    { abbr: 'DE', name: 'Germany' },
    { abbr: 'GH', name: 'Ghana' },
    { abbr: 'GI', name: 'Gibraltar' },
    { abbr: 'GR', name: 'Greece' },
    { abbr: 'GL', name: 'Greenland' },
    { abbr: 'GD', name: 'Grenada' },
    { abbr: 'GP', name: 'Guadeloupe' },
    { abbr: 'GU', name: 'Guam' },
    { abbr: 'GT', name: 'Guatemala' },
    { abbr: 'GG', name: 'Guernsey' },
    { abbr: 'GN', name: 'Guinea' },
    { abbr: 'GW', name: 'Guinea-Bissau' },
    { abbr: 'GY', name: 'Guyana' },
    { abbr: 'HT', name: 'Haiti' },
    { abbr: 'HM', name: 'Heard Island and McDonald Islands' },
    { abbr: 'VA', name: 'Holy See (Vatican City State)' },
    { abbr: 'HN', name: 'Honduras' },
    { abbr: 'HK', name: 'Hong Kong' },
    { abbr: 'HU', name: 'Hungary' },
    { abbr: 'IS', name: 'Iceland' },
    { abbr: 'IN', name: 'India' },
    { abbr: 'ID', name: 'Indonesia' },
    { abbr: 'IR', name: 'Iran, Islamic Republic of' },
    { abbr: 'IQ', name: 'Iraq' },
    { abbr: 'IE', name: 'Ireland' },
    { abbr: 'IM', name: 'Isle of Man' },
    { abbr: 'IL', name: 'Israel' },
    { abbr: 'IT', name: 'Italy' },
    { abbr: 'JM', name: 'Jamaica' },
    { abbr: 'JP', name: 'Japan' },
    { abbr: 'JE', name: 'Jersey' },
    { abbr: 'JO', name: 'Jordan' },
    { abbr: 'KZ', name: 'Kazakhstan' },
    { abbr: 'KE', name: 'Kenya' },
    { abbr: 'KI', name: 'Kiribati' },
    { abbr: 'KP', name: `Korea, Democratic People's Republic of` },
    { abbr: 'KR', name: 'Korea, Republic of' },
    { abbr: 'KW', name: 'Kuwait' },
    { abbr: 'KG', name: 'Kyrgyzstan' },
    { abbr: 'LA', name: `Lao People's Democratic Republic` },
    { abbr: 'LV', name: 'Latvia' },
    { abbr: 'LB', name: 'Lebanon' },
    { abbr: 'LS', name: 'Lesotho' },
    { abbr: 'LR', name: 'Liberia' },
    { abbr: 'LY', name: 'Libya' },
    { abbr: 'LI', name: 'Liechtenstein' },
    { abbr: 'LT', name: 'Lithuania' },
    { abbr: 'LU', name: 'Luxembourg' },
    { abbr: 'MO', name: 'Macao' },
    { abbr: 'MK', name: 'Macedonia, the former Yugoslav Republic of' },
    { abbr: 'MG', name: 'Madagascar' },
    { abbr: 'MW', name: 'Malawi' },
    { abbr: 'MY', name: 'Malaysia' },
    { abbr: 'MV', name: 'Maldives' },
    { abbr: 'ML', name: 'Mali' },
    { abbr: 'MT', name: 'Malta' },
    { abbr: 'MH', name: 'Marshall Islands' },
    { abbr: 'MQ', name: 'Martinique' },
    { abbr: 'MR', name: 'Mauritania' },
    { abbr: 'MU', name: 'Mauritius' },
    { abbr: 'YT', name: 'Mayotte' },
    { abbr: 'MX', name: 'Mexico' },
    { abbr: 'FM', name: 'Micronesia, Federated States of' },
    { abbr: 'MD', name: 'Moldova, Republic of' },
    { abbr: 'MC', name: 'Monaco' },
    { abbr: 'MN', name: 'Mongolia' },
    { abbr: 'ME', name: 'Montenegro' },
    { abbr: 'MS', name: 'Montserrat' },
    { abbr: 'MA', name: 'Morocco' },
    { abbr: 'MZ', name: 'Mozambique' },
    { abbr: 'MM', name: 'Myanmar' },
    { abbr: 'NA', name: 'Namibia' },
    { abbr: 'NR', name: 'Nauru' },
    { abbr: 'NP', name: 'Nepal' },
    { abbr: 'NL', name: 'Netherlands' },
    { abbr: 'NC', name: 'New Caledonia' },
    { abbr: 'NZ', name: 'New Zealand' },
    { abbr: 'NI', name: 'Nicaragua' },
    { abbr: 'NE', name: 'Niger' },
    { abbr: 'NG', name: 'Nigeria' },
    { abbr: 'NU', name: 'Niue' },
    { abbr: 'NF', name: 'Norfolk Island' },
    { abbr: 'MP', name: 'Northern Mariana Islands' },
    { abbr: 'NO', name: 'Norway' },
    { abbr: 'OM', name: 'Oman' },
    { abbr: 'PK', name: 'Pakistan' },
    { abbr: 'PW', name: 'Palau' },
    { abbr: 'PS', name: 'Palestinian Territory, Occupied' },
    { abbr: 'PA', name: 'Panama' },
    { abbr: 'PG', name: 'Papua New Guinea' },
    { abbr: 'PY', name: 'Paraguay' },
    { abbr: 'PE', name: 'Peru' },
    { abbr: 'PH', name: 'Philippines' },
    { abbr: 'PN', name: 'Pitcairn' },
    { abbr: 'PL', name: 'Poland' },
    { abbr: 'PT', name: 'Portugal' },
    { abbr: 'PR', name: 'Puerto Rico' },
    { abbr: 'QA', name: 'Qatar' },
    { abbr: 'RE', name: 'Réunion' },
    { abbr: 'RO', name: 'Romania' },
    { abbr: 'RU', name: 'Russian Federation' },
    { abbr: 'RW', name: 'Rwanda' },
    { abbr: 'BL', name: 'Saint Barthélemy' },
    { abbr: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
    { abbr: 'KN', name: 'Saint Kitts and Nevis' },
    { abbr: 'LC', name: 'Saint Lucia' },
    { abbr: 'MF', name: 'Saint Martin (French part)' },
    { abbr: 'PM', name: 'Saint Pierre and Miquelon' },
    { abbr: 'VC', name: 'Saint Vincent and the Grenadines' },
    { abbr: 'WS', name: 'Samoa' },
    { abbr: 'SM', name: 'San Marino' },
    { abbr: 'ST', name: 'Sao Tome and Principe' },
    { abbr: 'SA', name: 'Saudi Arabia' },
    { abbr: 'SN', name: 'Senegal' },
    { abbr: 'RS', name: 'Serbia' },
    { abbr: 'SC', name: 'Seychelles' },
    { abbr: 'SL', name: 'Sierra Leone' },
    { abbr: 'SG', name: 'Singapore' },
    { abbr: 'SX', name: 'Sint Maarten (Dutch part)' },
    { abbr: 'SK', name: 'Slovakia' },
    { abbr: 'SI', name: 'Slovenia' },
    { abbr: 'SB', name: 'Solomon Islands' },
    { abbr: 'SO', name: 'Somalia' },
    { abbr: 'ZA', name: 'South Africa' },
    { abbr: 'GS', name: 'South Georgia and the South Sandwich Islands' },
    { abbr: 'SS', name: 'South Sudan' },
    { abbr: 'ES', name: 'Spain' },
    { abbr: 'LK', name: 'Sri Lanka' },
    { abbr: 'SD', name: 'Sudan' },
    { abbr: 'SR', name: 'Suriname' },
    { abbr: 'SJ', name: 'Svalbard and Jan Mayen' },
    { abbr: 'SZ', name: 'Swaziland' },
    { abbr: 'SE', name: 'Sweden' },
    { abbr: 'CH', name: 'Switzerland' },
    { abbr: 'SY', name: 'Syrian Arab Republic' },
    { abbr: 'TW', name: 'Taiwan, Province of China' },
    { abbr: 'TJ', name: 'Tajikistan' },
    { abbr: 'TZ', name: 'Tanzania, United Republic of' },
    { abbr: 'TH', name: 'Thailand' },
    { abbr: 'TL', name: 'Timor-Leste' },
    { abbr: 'TG', name: 'Togo' },
    { abbr: 'TK', name: 'Tokelau' },
    { abbr: 'TO', name: 'Tonga' },
    { abbr: 'TT', name: 'Trinidad and Tobago' },
    { abbr: 'TN', name: 'Tunisia' },
    { abbr: 'TR', name: 'Turkey' },
    { abbr: 'TM', name: 'Turkmenistan' },
    { abbr: 'TC', name: 'Turks and Caicos Islands' },
    { abbr: 'TV', name: 'Tuvalu' },
    { abbr: 'UG', name: 'Uganda' },
    { abbr: 'UA', name: 'Ukraine' },
    { abbr: 'AE', name: 'United Arab Emirates' },
    { abbr: 'GB', name: 'United Kingdom' },
    { abbr: 'US', name: 'United States' },
    { abbr: 'UM', name: 'United States Minor Outlying Islands' },
    { abbr: 'UY', name: 'Uruguay' },
    { abbr: 'UZ', name: 'Uzbekistan' },
    { abbr: 'VU', name: 'Vanuatu' },
    { abbr: 'VE', name: 'Venezuela, Bolivarian Republic of' },
    { abbr: 'VN', name: 'Viet Nam' },
    { abbr: 'VG', name: 'Virgin Islands, British' },
    { abbr: 'VI', name: 'Virgin Islands, U.S.' },
    { abbr: 'WF', name: 'Wallis and Futuna' },
    { abbr: 'EH', name: 'Western Sahara' },
    { abbr: 'YE', name: 'Yemen' },
    { abbr: 'ZM', name: 'Zambia' },
    { abbr: 'ZW', name: 'Zimbabwe' }
  ];
  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        this.authUser = user;
        // console.log('User: ', this.authUser);
        // Checks if user is logged in
        if (user && user.emailVerified) {
          // Stores the User's Doc Reference
          this.userRef = this.afs.doc<User>(`users/${user.uid}`);
          console.log(user.displayName + ' just signed in!');
          // Stores the User's Entry Collection Reference
          // console.log('Entry Collection', this.userRef.collection('entries'));
          // console.log(user.getIdTokenResult());
          const createdOnDate = parseInt((user.metadata as any).a, 10);
          const lastLoggedInDate = parseInt((user.metadata as any).b, 10);
          // console.log('createdOn', createdOnDate);
          // console.log('lastLoggedIn', lastLoggedInDate);
          this.afs.doc<User>(`users/${user.uid}`).update({
            uid: user.uid,
            lastLoggedIn: firebase.firestore.Timestamp.fromMillis(lastLoggedInDate),
            createdOn: firebase.firestore.Timestamp.fromMillis(createdOnDate)
          });
          this.router.navigate(['/']);
          return this.userRef.valueChanges();
        } else {
          return of(null);
        }
      })
    );
    this.adminList$ = this.afs.doc('users/adminList').valueChanges();
    this.userSub = this.user$.subscribe(userDoc => {
      // console.log('User Docs: ', userDoc);
      this.currentUserDoc = userDoc;
    });
    this.adminSub = this.adminList$.subscribe(adminDoc => {
      // console.log('Admin List: ', adminDoc);
      this.adminList = adminDoc;
      // console.log(this.adminList);
    });
  }

  // sends a reset password verification email
  resetPassword({ value: { email } }): Promise<void> {
    // destructs email from value from form
    return this.afAuth.sendPasswordResetEmail(email);
  }
  // signs the user in with email and password
  signIn({ email, password }) {
    // console.log('Attempting Email: ', email);
    // console.log('Attempting Password: ', password);
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(userObj => {
        if (userObj.user.emailVerified) {
          // console.log('User Sign In: ', userObj);

          // this.afs.doc<User>(`users/${userObj.user.uid}`).update({ admin: true });
          this.error = '';
          this.status = 'Signed In!';

          console.log('Signed In!');
          this.googleAnalyticsService.eventEmitter('login', 'engagement', 'click');
        } else {
          this.signOut();
          throw {
            message: `This user's email has not been verified. The user must verify the email address before signing in.`
          };
        }
      })
      .catch(err => {
        this.error = err.message;
        console.log(`An error ocurred. Can't sign In! ${this.error}`);
      });
  }
  // Signs the User out
  signOut() {
    this.afAuth
      .signOut()
      .then(() => {
        this.status = 'Signed Out!';
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.log(err);
      });
  }
  // Creates an account for the User
  signUp({
    email,
    password,
    firstName,
    lastName,
    telephone,
    address1,
    address2,
    address3,
    townCity,
    postcode,
    country
  }) {
    // console.log('Name: ', firstName, lastName);
    // console.log('Email: ', email);
    // console.log('Password: ', password);
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(userObj => {
        // Update displayName
        // console.log('User Sign Up:', userObj);
        userObj.user
          .updateProfile({
            displayName: `${firstName} ${lastName}`
          })
          .then(
            () => {
              // Success
              // email verification
              userObj.user
                .sendEmailVerification()
                .then(() => {
                  console.log('Email verification sent');
                  const newUser: User = {
                    uid: userObj.user.uid,
                    address: {
                      address_lines: [address1, address2, address3],
                      country,
                      postcode,
                      townCity
                    },
                    admin: false,
                    email: email.toLowerCase(),
                    firstName,
                    lastName,
                    telephone,
                    lastLoggedIn: firebase.firestore.Timestamp.now(),
                    createdOn: firebase.firestore.Timestamp.now(),
                    cart: []
                  };
                  this.afs
                    .doc<User>(`users/${userObj.user.uid}`)
                    .set(newUser, { merge: true })
                    .then(() => {
                      this.signOut();
                      this.router.navigate(['/login']);
                    });
                })
                .catch(err => {
                  console.log('Error: ', err);
                });
              // console.log(userObj.user.email);
              this.error = '';
              this.status = 'Signed Up!';
              this.googleAnalyticsService.eventEmitter('sign_up', 'engagement', 'click');
            },
            error => {
              // Error
              console.log('Error: ' + error);
            }
          );
      })
      .catch(err => {
        console.log('An error ocurred! ', err.message);
        this.error = err.message;
      });
    // console.log('Signed Up!');
  }
  async updateAccount({
    email,
    firstName,
    lastName,
    password,
    telephone,
    address1,
    address2,
    address3,
    townCity,
    postcode,
    country
  }) {
    const updatedDetails: Partial<User> = {
      address: {
        address_lines: [address1, address2, address3],
        country,
        postcode,
        townCity
      },
      admin: this.currentUserDoc.admin,
      email,
      firstName,
      lastName,
      telephone
    };
    if (password || password.trim().length !== 0) {
      try {
        await (await this.afAuth.currentUser).updatePassword(password);
        console.log('Update Successful!');
      } catch (err) {
        console.log('Error: ', err);
      }
    }
    try {
      await this.afs.doc<User>(`users/${this.authUser.uid}`).update(updatedDetails);
      $('.callout.success').show();
    } catch (err) {
      $('.callout.alert').show();
      $('span.error').html(err);
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.adminSub.unsubscribe();
  }
}
