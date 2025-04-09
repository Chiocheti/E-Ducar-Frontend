import { RegistrationType } from './RegistrationTypes';

export type StudentType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  lastLogin: string;
  registrations?: RegistrationType[];
};
