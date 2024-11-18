import type { Movie, MovieRequest } from '@get-subtext/lib.movie-reader';
import type { MovieReaderTap as CompositeMovieReaderTap } from '@get-subtext/lib.movie-reader.composite';
import type { MovieReaderTap as OmdbMovieReaderTap } from '@get-subtext/lib.movie-reader.omdb';
import type { MovieReaderTap as OpenSubtitlesMovieReaderTap } from '@get-subtext/lib.movie-reader.open-subtitles';
import type { MovieReaderTap as SubdlMovieReaderTap } from '@get-subtext/lib.movie-reader.subdl';
import type { Logger } from '@studio-75/lib.logging';
import { cyan, gray, green, red, yellow } from 'colorette';

export class MovieReaderTap implements CompositeMovieReaderTap, OmdbMovieReaderTap, OpenSubtitlesMovieReaderTap, SubdlMovieReaderTap {
  public constructor(
    private readonly verbose: boolean,
    private readonly movieReaderName: string,
    private readonly logger: Logger
  ) {}

  public readStarted(request: MovieRequest) {
    const action = 'read movie started';
    const prefix = this.getMsgPrefix(request.imdbId);
    const message = `${prefix} ${action}`;
    if (this.verbose) {
      this.logger.info(message, request);
    } else {
      this.logger.info(message);
    }
  }

  public readFinished(request: MovieRequest, movie: Movie | null, errors: Error[]) {
    const action = 'read movie finished';
    const prefix = this.getMsgPrefix(request.imdbId);
    const message = `${prefix} ${action}`;

    const imdbId = request.imdbId;
    const subtitleFileCount = movie?.subtitleFiles.length ?? 0;

    if (this.verbose) {
      this.logger.info(message, { imdbId, subtitleFileCount, errors });
    } else {
      const errorP11n = errors.length === 1 ? 'error' : 'errors';
      const errorPart = errors.length === 0 ? '' : ` (${red(errors.length + ' ' + errorP11n)})`;
      if (this.movieReaderName === 'OmdbMovieReader') {
        this.logger.info(`${message}${errorPart}`);
      } else {
        const fileP11n = subtitleFileCount === 1 ? 'file' : 'files';
        const subtitlePart = `${subtitleFileCount === 0 ? yellow('no') : green(subtitleFileCount)} valid subtitle ${fileP11n}`;
        this.logger.info(`${message}: ${subtitlePart}${errorPart}`);
      }
    }
  }

  private getMsgPrefix(imdbId: string) {
    return `${gray('[' + this.movieReaderName + ']')} ${cyan(imdbId)}`;
  }
}
