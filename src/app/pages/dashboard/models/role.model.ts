import { Menu } from './menu.model';

export interface Role {
  id: number;
  name: string;
  menuId: number;
  menu: Menu;
}
