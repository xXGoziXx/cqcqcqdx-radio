import { Country } from './Country';
export interface Address {
  address_lines: Array<string>;
  country: Country;
  postcode: string;
  townCity: string;
}
