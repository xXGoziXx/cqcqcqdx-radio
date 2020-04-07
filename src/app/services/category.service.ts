import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Manufacturer } from '../interfaces/Manufacturer';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements OnDestroy {
  manufacturersRef: AngularFirestoreCollection<Manufacturer>;
  manufacturersRefSub: Subscription;
  used = [
    {
      alt: 'accessories',
      src: '../../assets/img/used-equipment/accessories.jpg',
      text: `Used Accessories For Amateur Radio`
    },
    {
      alt: 'amplifiers',
      src: '../../assets/img/used-equipment/amplifiers.jpg',
      text: `Used Rf Amplifiers`
    },
    {
      alt: 'analyzers',
      src: '../../assets/img/used-equipment/analyzers.jpg',
      text: `Used Analyzers & Swr Meters`
    },
    {
      alt: 'Antenna Rotators',
      src: '../../assets/img/used-equipment/antenna-rotators.jpg',
      text: `Used Antenna Rotators`
    },
    {
      alt: 'Antenna Tuners',
      src: '../../assets/img/used-equipment/antenna-tuners.jpg',
      text: `Used Antenna Tuners`
    },
    {
      alt: 'Antennas',
      src: '../../assets/img/used-equipment/antennas.jpg',
      text: `Used Amateur Antenna`
    },
    {
      alt: 'Baluns',
      src: '../../assets/img/used-equipment/baluns.jpg',
      text: `Used Baluns & Antenna Parts`
    },
    {
      alt: 'CB Radios',
      src: '../../assets/img/used-equipment/CB-Radios.jpg',
      text: `Used Cb Radio Transceivers`
    },
    {
      alt: 'DAB Radios',
      src: '../../assets/img/used-equipment/DAB-Radios.jpg',
      text: `Used Dab/Fm Radio`
    },
    {
      alt: 'Data Comms',
      src: '../../assets/img/used-equipment/data-comms.gif',
      text: `Used Data Mode Interfaces`
    },
    {
      alt: 'Dongles',
      src: '../../assets/img/used-equipment/dongles.jpg',
      text: `Used Communication Dongles`
    },
    {
      alt: 'Duplexer Triplexer',
      src: '../../assets/img/used-equipment/duplexer-triplexer.jpg',
      text: `Used Duplexer & Triplexer`
    },
    {
      alt: 'Filters',
      src: '../../assets/img/used-equipment/filters.jpg',
      text: `Used Ham Radio Filters & Extra'S`
    },
    {
      alt: 'Frequency Counter Finder',
      src: '../../assets/img/used-equipment/frequency-counter-finder.jpg',
      text: `Used Frequency Counter And Rf Finders`
    },
    {
      alt: 'Handheld Transceivers',
      src: '../../assets/img/used-equipment/handheld-transceivers.jpg',
      text: `Used Handheld Transceivers`
    },
    {
      alt: 'HF Transceivers',
      src: '../../assets/img/used-equipment/hf-transceivers.jpg',
      text: `Used Hf Transceivers`
    },
    {
      alt: 'Marine Transceivers',
      src: '../../assets/img/used-equipment/marine-transceivers.jpg',
      text: `Used Marine Transceivers`
    },
    {
      alt: 'Mast',
      src: '../../assets/img/used-equipment/mast.png',
      text: `Used Masts Towers (Base & Portable)`
    },
    {
      alt: 'Mics & Speakers',
      src: '../../assets/img/used-equipment/mics-and-speakers.jpg',
      text: `Used Microphones And Speakers`
    },
    {
      alt: 'Morse Keys/Tutors',
      src: '../../assets/img/used-equipment/morse-keys-tutors.jpg',
      text: `Used Morse Keys, Tutors & Keyers`
    },
    {
      alt: 'Power Supplies',
      src: '../../assets/img/used-equipment/power-supplies.jpg',
      text: `Used Power Supplies - Linear & Switch Mode`
    },
    {
      alt: 'Receivers',
      src: '../../assets/img/used-equipment/receivers.jpg',
      text: `Used Communications Receiver`
    },
    {
      alt: 'Scanners',
      src: '../../assets/img/used-equipment/scanners.jpg',
      text: `Used Radio Scanners`
    },
    {
      alt: 'Scopes',
      src: '../../assets/img/used-equipment/scopes.jpg',
      text: `Used Scopes (Oscilloscope)`
    },
    {
      alt: 'Software Defined Radio',
      src: '../../assets/img/used-equipment/software-defined-radio.jpg',
      text: `Used Sdr Transceiver & Receivers`
    },
    {
      alt: 'VHF/UHF Transceivers',
      src: '../../assets/img/used-equipment/vhf-uhf-transceivers.jpg',
      text: `Used Vhf/Uhf Transceivers`
    },
    {
      alt: 'Virtual Radars',
      src: '../../assets/img/used-equipment/virtual-radars.gif',
      text: `Used Virtual Radars`
    }
  ];
  manufacturers = [];
  linkUsed(text) {
    return text.replace(/\s/g, '-');
  }

  constructor(private afs: AngularFirestore) {
    this.manufacturersRef = this.afs.collection<Manufacturer>('manufacturers');
    this.manufacturersRefSub = this.manufacturersRef.valueChanges().subscribe(docs => {
      // console.log(docs);
      this.manufacturers = docs
        .filter(doc => !(Object.keys(doc).length === 0 && doc.constructor === Object))
        .map(doc => {
          return { alt: doc.name.toLowerCase(), src: doc.images[0], text: doc.name };
        });
    });
  }
  ngOnDestroy() {
    this.manufacturersRefSub.unsubscribe();
  }
}
