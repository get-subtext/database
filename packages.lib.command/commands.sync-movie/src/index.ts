import type { SyncMovieCommandOptions } from './index.types';
import { SyncMovieCommand as MovieSyncImpl } from './services/SyncMovieCommand';
import type { SyncMovieCommand } from './services/SyncMovieCommand.types';

export type * from './index.types';
export type * from './services/SyncMovieCommand.types';

export class SyncMovieCommandFactory {
  private constructor() {}

  public static create({ movieReader, movieWriter, tap }: SyncMovieCommandOptions): SyncMovieCommand {
    return new MovieSyncImpl(movieReader, movieWriter, tap);
  }
}
