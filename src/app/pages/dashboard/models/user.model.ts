import { Role } from './role.model';

export interface User {
  [x: string]: any;
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: boolean;
  createdAt: string;
  lastModified: string;
  email: string;
  password: string;
  roleId: number;
  role: Role;
  isSelected?: boolean;
}
