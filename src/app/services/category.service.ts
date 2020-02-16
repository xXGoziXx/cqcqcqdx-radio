import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  linkUsed(text) {
    return text.replace(/\s/g, '-').toLowerCase();
  }
  constructor() {}
}
export const used = [
  {
    alt: 'accessories',
    src: '../../assets/img/used-equipment/accessories.jpg',
    text: `USED ACCESSORIES FOR AMATEUR RADIO`
  },
  {
    alt: 'amplifiers',
    src: '../../assets/img/used-equipment/amplifiers.jpg',
    text: `USED RF AMPLIFIERS`
  },
  {
    alt: 'analyzers',
    src: '../../assets/img/used-equipment/analyzers.jpg',
    text: `USED ANALYZERS & SWR METERS`
  },
  {
    alt: 'Antenna Rotators',
    src: '../../assets/img/used-equipment/antenna-rotators.jpg',
    text: `USED ANTENNA ROTATORS`
  },
  {
    alt: 'Antenna Tuners',
    src: '../../assets/img/used-equipment/antenna-tuners.jpg',
    text: `USED ANTENNA TUNERS`
  },
  {
    alt: 'Antennas',
    src: '../../assets/img/used-equipment/antennas.jpg',
    text: `USED AMATEUR ANTENNA`
  },
  {
    alt: 'Baluns',
    src: '../../assets/img/used-equipment/baluns.jpg',
    text: `USED BALUNS & ANTENNA PARTS`
  },
  {
    alt: 'CB Radios',
    src: '../../assets/img/used-equipment/CB-Radios.jpg',
    text: `USED CB RADIO TRANSCEIVERS`
  },
  {
    alt: 'DAB Radios',
    src: '../../assets/img/used-equipment/DAB-Radios.jpg',
    text: `USED DAB/FM RADIO`
  },
  {
    alt: 'Data Comms',
    src: '../../assets/img/used-equipment/data-comms.gif',
    text: `USED DATA MODE INTERFACES`
  },
  {
    alt: 'Dongles',
    src: '../../assets/img/used-equipment/dongles.jpg',
    text: `USED COMMUNICATION DONGLES`
  },
  {
    alt: 'Duplexer Triplexer',
    src: '../../assets/img/used-equipment/duplexer-triplexer.jpg',
    text: `USED DUPLEXER & TRIPLEXER`
  },
  {
    alt: 'Filters',
    src: '../../assets/img/used-equipment/filters.jpg',
    text: `USED HAM RADIO FILTERS & EXTRA'S`
  },
  {
    alt: 'Frequency Counter Finder',
    src: '../../assets/img/used-equipment/frequency-counter-finder.jpg',
    text: `USED FREQUENCY COUNTER AND RF FINDERS`
  },
  {
    alt: 'Handheld Transceivers',
    src: '../../assets/img/used-equipment/handheld-transceivers.jpg',
    text: `USED HANDHELD TRANSCEIVERS`
  },
  {
    alt: 'HF Transceivers',
    src: '../../assets/img/used-equipment/hf-transceivers.jpg',
    text: `USED HF TRANSCEIVERS`
  },
  {
    alt: 'Marine Transceivers',
    src: '../../assets/img/used-equipment/marine-transceivers.jpg',
    text: `USED MARINE TRANSCEIVERS`
  },
  {
    alt: 'Mast',
    src: '../../assets/img/used-equipment/mast.png',
    text: `USED MASTS TOWERS (BASE & PORTABLE)`
  },
  {
    alt: 'Mics & Speakers',
    src: '../../assets/img/used-equipment/mics-and-speakers.jpg',
    text: `USED MICROPHONES AND SPEAKERS`
  },
  {
    alt: 'Morse Keys/Tutors',
    src: '../../assets/img/used-equipment/morse-keys-tutors.jpg',
    text: `USED MORSE KEYS, TUTORS & KEYERS`
  },
  {
    alt: 'Power Supplies',
    src: '../../assets/img/used-equipment/power-supplies.jpg',
    text: `USED POWER SUPPLIES - LINEAR & SWITCH MODE`
  },
  {
    alt: 'Receivers',
    src: '../../assets/img/used-equipment/receivers.jpg',
    text: `USED COMMUNICATIONS RECEIVER`
  },
  {
    alt: 'Scanners',
    src: '../../assets/img/used-equipment/scanners.jpg',
    text: `USED RADIO SCANNERS`
  },
  {
    alt: 'Scopes',
    src: '../../assets/img/used-equipment/scopes.jpg',
    text: `USED SCOPES (OSCILLOSCOPE)`
  },
  {
    alt: 'Software Defined Radio',
    src: '../../assets/img/used-equipment/software-defined-radio.jpg',
    text: `USED SDR TRANSCEIVER & RECEIVERS`
  },
  {
    alt: 'VHF/UHF Transceivers',
    src: '../../assets/img/used-equipment/vhf-uhf-transceivers.jpg',
    text: `USED VHF/UHF TRANSCEIVERS`
  },
  {
    alt: 'Virtual Radars',
    src: '../../assets/img/used-equipment/virtual-radars.gif',
    text: `USED VIRTUAL RADARS`
  }
];
export const brandNew = [
  {
    alt: 'accessories',
    src: '../../assets/img/used-equipment/accessories.jpg',
    text: `USED ACCESSORIES FOR AMATEUR RADIO`
  }
];
export const manufacturers = [
  {
    alt: 'accessories',
    src: '../../assets/img/used-equipment/accessories.jpg',
    text: `USED ACCESSORIES FOR AMATEUR RADIO`
  }
];
