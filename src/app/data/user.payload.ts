export interface User {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  created: Date;
  enabled: boolean;
  roles: string[];
  privileges: string[];
}
