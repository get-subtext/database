import { DatabaseOptions } from './index.types';
import { Database as DatabaseImpl } from './services/Database';
import type { Database } from './services/Database.types';

export type * from './index.types';
export type * from './services/Database.types';

export class DatabaseFactory {
  private constructor() {}

  public static create({ api, tap }: DatabaseOptions): Database {
    return new DatabaseImpl(api, tap);
  }
}
