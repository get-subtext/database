import type * as T from '@get-subtext/lib.movie-writer';
import type { StMovieIndex, StPosterImage, StPosterIndex, StSubtitleFileIndex, SubText } from '@get-subtext/lib.subtext';
import { map } from 'lodash-es';
import path from 'path';
import type { SubTextMovieWriterTap } from './SubTextMovieWriter.types';

export class SubTextMovieWriter implements T.MovieWriter {
  public constructor(
    private readonly SubText: SubText,
    private readonly tap?: SubTextMovieWriterTap
  ) {}

  public async write(movie: T.Movie) {
    this.tap?.writeStarted(movie);

    const { subtitleFiles, posters, ...rest } = movie;
    const filePaths: string[] = [];

    const posterIds = map(posters, (p) => p.posterId);
    const subtitleFileIds = map(subtitleFiles, (s) => s.subtitleFileId);
    const fmMovieIndex: StMovieIndex = { ...rest, posterIds, subtitleFileIds, isAvailable: true };
    const movieIndexFilePath = await this.SubText.writeMovieIndex(fmMovieIndex);
    filePaths.push(movieIndexFilePath);
    this.tap?.movieIndexSaved(movie.imdbId, movieIndexFilePath);

    const imdbId = rest.imdbId;
    for (let i = 0; i < posters.length; i++) {
      const { posterId, origin, url } = posters[i];
      const fileName = `poster${this.getPosterFileExt(url)}`;

      const fmPosterIndex: StPosterIndex = { imdbId, posterId, source: { origin, url }, fileName };
      const posterIndexFilePath = await this.SubText.writePosterIndex(fmPosterIndex);
      filePaths.push(posterIndexFilePath);
      this.tap?.posterIndexSaved(movie.imdbId, posterIndexFilePath);

      const fmPosterImage: StPosterImage = { imdbId, posterId, url, fileName };
      const fmPosterImageFilePath = await this.SubText.writePosterImage(fmPosterImage);
      filePaths.push(fmPosterImageFilePath);
      this.tap?.posterImageSaved(movie.imdbId, fmPosterImageFilePath);
    }

    for (let i = 0; i < subtitleFiles.length; i++) {
      const fmSubtitleFileIndex = { imdbId, ...subtitleFiles[i] } as unknown as StSubtitleFileIndex;
      const subtitleFileIndexFilePath = await this.SubText.writeSubtitleFileIndex(fmSubtitleFileIndex);
      filePaths.push(subtitleFileIndexFilePath);
      this.tap?.subtitleFileIndexSaved(movie.imdbId, subtitleFileIndexFilePath);
    }

    this.tap?.writeFinished(movie, filePaths);
  }

  private getPosterFileExt(url: string) {
    return path.parse(path.basename(url)).ext;
  }
}
