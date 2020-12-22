export interface User {
  id: number;
  firstName: string;
  lastName: string;
  login: string;

  /**
   * User password in plaintext. It should be in most cases null. 
   * Used only while creating or modifying user.
   */
  password: string;
  email: string;
  created: Date;
  enabled: boolean;
  roles: number[];
}
