import type * as T from '@get-subtext/lib.movie-reader';
import * as U from '@get-subtext/lib.movie-reader';
import type { Movie, MoviePage, OpenSubtitles } from '@get-subtext/lib.open-subtitles';
import { concat, isNil, join, map, range } from 'lodash-es';
import type { MovieReaderTap, OsSanitisedFile } from './OpenSubtitlesMovieReader.types';

type Nullable<T> = T | null;

const origin = 'OpenSubtitles';
const type = U.SourceTypeEnum.StandaloneFile;

export class OpenSubtitlesMovieReader implements T.MovieReader {
  public constructor(
    private readonly openSubtitles: OpenSubtitles,
    private readonly tap?: MovieReaderTap
  ) {}

  public async read(request: T.MovieRequest): Promise<T.MovieResponse> {
    try {
      const errors: Error[] = [];
      this.tap?.readStarted(request);

      const [moviesOs, getMoviesErrors] = await this.getMovies(request.imdbId);
      errors.push(...getMoviesErrors);

      const movies = map(moviesOs, (m) => this.toMovie(m));
      const movie = U.reduceMovies(movies);
      if (movie !== null) {
        const subtitleFiles = this.toSubtitleFiles(moviesOs);
        const [subtitlePacks, getSubtitlePacksErrors] = await this.getSubtitleFiles(subtitleFiles);
        errors.push(...getSubtitlePacksErrors);
        movie.imdbId = request.imdbId;
        movie.subtitleFiles = U.compactSubtitleFiles(subtitlePacks);
      }

      this.tap?.readFinished(request, movie, errors);
      return { movie, errors };
    } catch (cause) {
      const error = new Error(`[${OpenSubtitlesMovieReader.name}] ${this.read.name} failed: unexpected error`, { cause });
      this.tap?.readFinished(request, null, [error]);
      throw error;
    }
  }

  private toMovie(osMovie: Movie): T.Movie {
    const movie = U.defaultMovie();
    movie.title = U.sanitiseTitle(osMovie.title);
    movie.releaseYear = osMovie.releaseYear;
    movie.posters = osMovie.posters;
    return movie;
  }

  private toSubtitleFiles(osMovies: Movie[]): OsSanitisedFile[] {
    const subtitleFile: OsSanitisedFile[] = [];

    for (let i = 0; i < osMovies.length; i++) {
      const apiMovie = osMovies[i];
      for (let j = 0; j < apiMovie.files.length; j++) {
        const file = apiMovie.files[j];
        subtitleFile.push({ id: file.id, name: file.name, author: apiMovie.author });
      }
    }

    return subtitleFile;
  }

  private async getMovies(imdbId: string): Promise<[Movie[], Error[]]> {
    const errors: Error[] = [];
    const osMovies: Movie[] = [];

    const [moviesPagesFirst, moviesPagesErrors] = await this.getMoviesPage(imdbId, [1]);
    errors.push(...moviesPagesErrors);
    if (moviesPagesFirst.length === 0 || isNil(moviesPagesFirst[0])) return [[], errors];

    const totalPages = moviesPagesFirst[0].totalPages ?? 1;
    const remainingPages = range(2, totalPages + 1);
    const [moviesPagesRest, moviesPagesRestErrors] = await this.getMoviesPage(imdbId, remainingPages);
    errors.push(...moviesPagesRestErrors);

    const allPages = concat(moviesPagesFirst, moviesPagesRest);
    for (let i = 0; i < allPages.length; i++) {
      osMovies.push(...allPages[i].movies);
    }

    return [osMovies, errors];
  }

  private async getMoviesPage(imdbId: string, pages: number[]): Promise<[MoviePage[], Error[]]> {
    const errors: Error[] = [];
    const osMoviePages: MoviePage[] = [];

    const getMoviesPromises = map(pages, (p) => this.openSubtitles.getMovies(imdbId, p));
    const getMoviesResults = await Promise.allSettled(getMoviesPromises);

    for (let i = 0; i < getMoviesResults.length; i++) {
      const readCurrentRes = getMoviesResults[i];
      if (readCurrentRes.status === 'fulfilled') {
        if (readCurrentRes.value === null) continue;
        osMoviePages.push(readCurrentRes.value);
      } else {
        errors.push(readCurrentRes.reason);
      }
    }

    return [osMoviePages, errors];
  }

  private async getSubtitleFiles(osFiles: OsSanitisedFile[]): Promise<[T.SubtitleFile[], Error[]]> {
    const errors: Error[] = [];
    const subtitleFiles: T.SubtitleFile[] = [];

    const [srtUrls, getSrtUrlsErrors] = await this.getSrtUrls(osFiles);
    errors.push(...getSrtUrlsErrors);

    const [srtSubtitleFiles, getSrtSubtitleFilesErrors] = await this.getSrtSubtitleFiles(srtUrls);
    errors.push(...getSrtSubtitleFilesErrors);

    for (let i = 0; i < osFiles.length; i++) {
      const srtUrl = srtUrls[i];
      const srtSubtitleFile = srtSubtitleFiles[i];
      if (!isNil(srtUrl) && !isNil(srtSubtitleFile)) {
        try {
          const author = osFiles[i].author;
          const textFileName = osFiles[i].name;
          const subtitles = U.toSubtitles(srtSubtitleFile);
          const subtitleFileId = U.generateHash(join(subtitles, '\n'));
          subtitleFiles.push({ subtitleFileId, source: { origin, type, author, url: srtUrl, textFileName }, subtitles });
        } catch (cause) {
          const error = new Error(`[${OpenSubtitlesMovieReader.name}] ${this.getSubtitleFiles.name} failed: could not parse SRT file`, { cause });
          errors.push(error);
        }
      }
    }

    return [subtitleFiles, errors];
  }

  private async getSrtUrls(osFiles: OsSanitisedFile[]): Promise<[Nullable<string>[], Error[]]> {
    const errors: Error[] = [];
    const srtUrls: Nullable<string>[] = [];

    const getSrtUrlPromises = map(osFiles, (f) => this.openSubtitles.getSrtUrl(f.id));
    const getSrtUrlResults = await Promise.allSettled(getSrtUrlPromises);
    for (let i = 0; i < getSrtUrlResults.length; i++) {
      const getSrtUrlRes = getSrtUrlResults[i];
      // Ensure the `srtUrls` array has a corresponding entry for each item in `files`,
      // adding either the `this.api.getSrtUrl` value
      // or null if `this.api.getSrtUrl` fails.
      if (getSrtUrlRes.status === 'fulfilled') {
        srtUrls.push(getSrtUrlRes.value);
      } else {
        srtUrls.push(null);
        errors.push(getSrtUrlRes.reason);
      }
    }

    return [srtUrls, errors];
  }

  private async getSrtSubtitleFiles(srtUrls: (string | null)[]): Promise<[Nullable<string>[], Error[]]> {
    const errors: Error[] = [];
    const subtitleFiles: Nullable<string>[] = [];

    const downloadSrtFilePromises = map(srtUrls, (u) => (u === null ? Promise.resolve(null) : this.openSubtitles.downloadSrtFile(u)));
    const downloadSrtFileResults = await Promise.allSettled(downloadSrtFilePromises);
    for (let i = 0; i < downloadSrtFileResults.length; i++) {
      const downloadSrtFileRes = downloadSrtFileResults[i];
      // Ensure the `subtitleFiles` array has a corresponding entry for each item in `urls`,
      // adding either the `this.api.downloadSrtFile` value
      // or null if `this.api.downloadSrtFile` fails.
      if (downloadSrtFileRes.status === 'fulfilled') {
        subtitleFiles.push(downloadSrtFileRes.value);
      } else {
        subtitleFiles.push(null);
        errors.push(downloadSrtFileRes.reason);
      }
    }

    return [subtitleFiles, errors];
  }
}
