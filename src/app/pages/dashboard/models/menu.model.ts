import { Link } from './link.model';

export interface Menu {
  id: number;
  name: string;
  links: Link[];
}
