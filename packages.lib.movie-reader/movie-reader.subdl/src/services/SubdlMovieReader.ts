import type * as T from '@get-subtext/lib.movie-reader';
import * as U from '@get-subtext/lib.movie-reader';
import type { Movie, Subdl, Subtitle } from '@get-subtext/lib.subdl';
import AdmZip from 'adm-zip';
import { join, map, toPairs } from 'lodash-es';
import path from 'path';
import type { MovieReaderTap, SubdlSanitisedSubtitleFile } from './SubdlMovieReader.types';

const origin = 'Subdl';
const type = U.SourceTypeEnum.ZipFile;

export class SubdlMovieReader implements T.MovieReader {
  public constructor(
    private readonly zipUrlBase: string,
    private readonly subdl: Subdl,
    private readonly tap?: MovieReaderTap
  ) {}

  public async read(request: T.MovieRequest): Promise<T.MovieResponse> {
    try {
      const errors: Error[] = [];
      this.tap?.readStarted(request);

      const subdlMovie = await this.subdl.getMovie(request.imdbId);
      if (subdlMovie === null) {
        this.tap?.readFinished(request, null, errors);
        return { movie: null, errors };
      }

      const [subdlSubtitleFile, getSubtitleFileErrors] = await this.getSubtitleFile(subdlMovie.subtitles);
      errors.push(...getSubtitleFileErrors);

      const movie = this.toMovie(subdlMovie);
      movie.imdbId = request.imdbId;
      movie.subtitleFiles = this.toSubtitleFiles(subdlSubtitleFile);

      this.tap?.readFinished(request, movie, errors);
      return { movie, errors };
    } catch (cause) {
      console.log(cause);
      const error = new Error(`[${SubdlMovieReader.name}] ${this.read.name} failed: unexpected error`, { cause });
      this.tap?.readFinished(request, null, [error]);
      throw error;
    }
  }

  private toMovie(subdlMovie: Movie): T.Movie {
    const movie = U.defaultMovie();
    movie.title = U.sanitiseTitle(subdlMovie.title);
    movie.releaseDate = subdlMovie.releaseDate;
    movie.releaseYear = subdlMovie.releaseYear;
    return movie;
  }

  private toSubtitleFiles(subdlSubtitleFiles: SubdlSanitisedSubtitleFile[]): T.SubtitleFile[] {
    const subtitleFiles: T.SubtitleFile[] = [];
    for (let i = 0; i < subdlSubtitleFiles.length; i++) {
      const subdlSubtitleFile = subdlSubtitleFiles[i];
      const subtitleFilePairs = toPairs(subdlSubtitleFile.subtitleFiles);
      for (let i = 0; i < subtitleFilePairs.length; i++) {
        const [textFileName, subtitles] = subtitleFilePairs[i];
        const ext = path.parse(path.basename(textFileName)).ext;
        if (ext === '.srt') {
          const { url, author } = subdlSubtitleFile;
          const zipFileName = path.basename(url);
          const subtitleFileId = U.generateHash(join(subtitles, '\n'));
          subtitleFiles.push({ subtitleFileId, source: { origin, type, author, url, zipFileName, textFileName }, subtitles });
        }
      }
    }

    return U.compactSubtitleFiles(subtitleFiles);
  }

  private async getSubtitleFile(apiSubtitles: Subtitle[]): Promise<[SubdlSanitisedSubtitleFile[], Error[]]> {
    const errors: Error[] = [];
    const subdlSubtitleFile: SubdlSanitisedSubtitleFile[] = [];

    const downloadFilePromises = map(apiSubtitles, (s) => this.subdl.downloadFile(s.baseUrl));
    const downloadFileResults = await Promise.allSettled(downloadFilePromises);
    for (let i = 0; i < downloadFileResults.length; i++) {
      const downloadFileRes = downloadFileResults[i];
      const { baseUrl, author } = apiSubtitles[i];
      if (downloadFileRes.status === 'fulfilled') {
        try {
          const [subtitleFiles, getSubtitlesErrors] = this.getSubtitleFiles(downloadFileRes.value);
          errors.push(...getSubtitlesErrors);
          subdlSubtitleFile.push({ url: `${this.zipUrlBase}${baseUrl}`, author, subtitleFiles });
        } catch (cause) {
          const error = new Error(`[${SubdlMovieReader.name}] ${this.getSubtitleFile.name} failed`, { cause });
          errors.push(error);
        }
      } else {
        errors.push(downloadFileRes.reason);
      }
    }

    return [subdlSubtitleFile, errors];
  }

  private getSubtitleFiles(arrayBuffer: ArrayBuffer): [Record<string, string[]>, Error[]] {
    const errors: Error[] = [];
    const subdlSubtitles: Record<string, string[]> = {};

    try {
      const files = this.extractZip(arrayBuffer);
      const filePairs = toPairs(files);
      for (let i = 0; i < filePairs.length; i++) {
        const [textFileName, text] = filePairs[i];
        const ext = path.parse(path.basename(textFileName)).ext;
        if (ext === '.srt') {
          try {
            subdlSubtitles[textFileName] = U.toSubtitles(text);
          } catch (cause) {
            const error = new Error(`[${SubdlMovieReader.name}] ${this.getSubtitleFiles.name} failed`, { cause });
            errors.push(error);
          }
        }
      }
    } catch (cause) {
      const error = new Error(`[${SubdlMovieReader.name}] ${this.getSubtitleFiles.name} failed`, { cause });
      errors.push(error);
    }

    return [subdlSubtitles, errors];
  }

  private extractZip(arrayBuffer: ArrayBuffer): Record<string, string> {
    const data: Record<string, string> = {};
    const zip = new AdmZip(Buffer.from(new Uint8Array(arrayBuffer)));
    const entries = zip.getEntries();
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      data[entry.entryName] = entry.getData().toString();
    }

    return data;
  }
}
