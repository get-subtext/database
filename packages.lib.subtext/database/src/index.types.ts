import type { SubText } from '@get-subtext/lib.subtext';
import type { DatabaseTap } from './services/Database.types';

export interface DatabaseOptions {
  api: SubText;
  tap?: DatabaseTap;
}
