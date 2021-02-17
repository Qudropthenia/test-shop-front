import { Goods } from './goods';

export interface Order {
  id?: number;
  client?: string;
  date?: Date;
  address?: string;
  goods?: Goods[];
}
