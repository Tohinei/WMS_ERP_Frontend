export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  menuId: number;
  createdAt: Date;
  updatedAt?: Date;
}
