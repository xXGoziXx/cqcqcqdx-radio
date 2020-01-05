export interface User {
  admin: boolean;
  email: string;
  firstName: string;
  lastName: string;
  telephone: number;
  address: Array<string>;
  townCity: string;
  postcode: string;
  country: string;
}
