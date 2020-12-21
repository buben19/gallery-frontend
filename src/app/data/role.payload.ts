export interface Role {
  id: number;
  name: string;
  privileges: number[];
  users: number[];
}
