import { isEmptyMovie, type MovieReader } from '@get-subtext/lib.movie-reader';
import type { MovieWriter } from '@get-subtext/lib.movie-writer';
import { SyncMovieCommandRequestSchema } from '../schemas/SyncMovieCommandSchema';
import type * as T from './SyncMovieCommand.types';

export class SyncMovieCommand implements T.SyncMovieCommand {
  public constructor(
    private readonly movieReader: MovieReader,
    private readonly movieWriter: MovieWriter,
    private readonly tap?: T.SyncMovieCommandTap
  ) {}

  public async run(request: T.SyncMovieCommandRequest) {
    this.tap?.runStarted(request);

    try {
      const parsed = SyncMovieCommandRequestSchema.safeParse(request);
      if (!parsed.success) {
        const error = new Error(`[${SyncMovieCommand.name}] ${this.run.name} failed: could not parse response`, { cause: parsed.error });
        this.tap?.runFinished(request, null, [error]);
        return null;
      }

      const readRes = await this.movieReader.read(parsed.data);
      if (!isEmptyMovie(readRes.movie)) await this.movieWriter.write(readRes.movie!);

      this.tap?.runFinished(request, readRes.movie, readRes.errors);
      return readRes.movie;
    } catch (cause) {
      throw new Error(`[${SyncMovieCommand.name}] ${this.run.name} failed`, { cause });
    }
  }
}
