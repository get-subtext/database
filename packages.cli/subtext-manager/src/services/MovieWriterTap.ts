import type * as T from '@get-subtext/lib.movie-writer';
import type { SubTextMovieWriterTap } from '@get-subtext/lib.movie-writer.subtext';
import type { Logger } from '@studio-75/lib.logging';
import { blue, cyan, gray, green, red } from 'colorette';
import path from 'path';
import { ensureForwardSlash } from '../utils/ensureForwardSlash';

const quote = (value: string) => `'${value}'`;

export class MovieWriterTap implements SubTextMovieWriterTap {
  public constructor(
    private readonly verbose: boolean,
    private readonly movieWriterName: string,
    private readonly logger: Logger
  ) {}

  public writeStarted(movie: T.Movie) {
    const action = 'write movie started';
    const prefix = this.getMsgPrefix(movie.imdbId);
    const message = `${prefix} ${action}`;

    if (this.verbose) {
      const { imdbId, title } = movie;
      this.logger.info(message, { imdbId, title });
    } else {
      this.logger.info(`${message}`);
    }
  }

  public movieIndexSaved(imdbId: string, filePath: string) {
    this.fileSaved(imdbId, 'movie index', filePath);
  }

  public posterIndexSaved(imdbId: string, filePath: string) {
    this.fileSaved(imdbId, 'poster index', filePath);
  }

  public posterImageSaved(imdbId: string, filePath: string) {
    this.fileSaved(imdbId, 'poster image', filePath);
  }

  public subtitleFileIndexSaved(imdbId: string, filePath: string) {
    this.fileSaved(imdbId, 'subtitle file index', filePath);
  }

  public writeFinished(movie: T.Movie, filePaths: string[]) {
    const action = 'write movie finished';
    const prefix = this.getMsgPrefix(movie.imdbId);
    const message = `${prefix} ${action}`;

    const imdbId = movie.imdbId;
    const fileCount = filePaths.length;
    if (this.verbose) {
      this.logger.info(message, { imdbId, fileCount });
    } else {
      const fileP11n = fileCount === 1 ? 'file' : 'files';
      const filePart = fileCount === 0 ? `${red('no')} ${fileP11n}` : `${green(fileCount)} ${fileP11n} saved`;
      this.logger.info(`${message}: ${filePart}`);
    }
  }

  private fileSaved(imdbId: string, fileDesc: string, filePath: string) {
    const action = 'file saved';
    const prefix = this.getMsgPrefix(imdbId);
    const message = `${prefix} ${action}`;

    if (this.verbose) {
      this.logger.debug(message, { imdbId, fileDesc, filePath: this.formatPath(filePath) });
    } else {
      this.logger.debug(`${message}: ${this.formatPath(filePath)}`);
    }
  }

  private formatPath(fileOrDir: string) {
    return blue(quote(ensureForwardSlash(path.relative(process.cwd(), fileOrDir))));
  }

  private getMsgPrefix(imdbId: string) {
    return `${gray('[' + this.movieWriterName + ']')} ${cyan(imdbId)}`;
  }
}
