import { Address } from './Address';
export interface User {
  address: Address;
  admin: boolean;
  email: string;
  firstName: string;
  lastName: string;
  telephone: number;
}
