import { generateHash } from '@get-subtext/lib.movie-reader';
import type * as T from '@get-subtext/lib.open-subtitles';
import { compact, isNil, map } from 'lodash-es';
import path from 'path';
import type { FetchOpenSubtitlesInternal, Movie, RelatedLink } from './FetchOpenSubtitlesInternal.types';

const origin = 'OpenSubtitles';

export class FetchOpenSubtitles implements T.OpenSubtitles {
  public constructor(private readonly fetchOpenSubtitlesInternal: FetchOpenSubtitlesInternal) {}

  public async getMovies(imdbId: string, page: number): Promise<T.MoviePage> {
    const response = await this.fetchOpenSubtitlesInternal.getSubtitles(imdbId, page);
    const movie = map(response.data, (d) => this.toMovie(d));
    return { totalPages: response.total_pages ?? 0, movies: compact(movie) };
  }

  public async getSrtUrl(fileId: number): Promise<string | null> {
    const { link } = await this.fetchOpenSubtitlesInternal.getDownloadMeta(fileId);
    const ext = isNil(link) ? null : path.parse(path.basename(link)).ext;
    return !isNil(link) && ext === '.srt' ? link : null;
  }

  public async downloadSrtFile(srtUrl: string): Promise<string> {
    return await this.fetchOpenSubtitlesInternal.downloadFile(srtUrl);
  }

  private toMovie(movie: Movie): T.Movie | null {
    if (movie.type !== 'subtitle' || movie.attributes?.language !== 'en') return null;

    return {
      title: movie.attributes?.feature_details?.title ?? null,
      releaseYear: movie.attributes?.feature_details?.year ?? null,
      posters: this.getPosterLink(movie.attributes?.related_links ?? []),
      author: movie.attributes?.uploader?.name ?? null,
      files: map(movie.attributes?.files ?? [], (f) => ({ id: f.file_id ?? 0, name: f.file_name ?? '<Unknown File Name>' })),
    };
  }

  private getPosterLink(relatedLinks: RelatedLink[]) {
    const posters: T.Poster[] = [];
    for (let j = 0; j < relatedLinks.length; j++) {
      const relatedLink = relatedLinks[j];
      const url = relatedLink.img_url;
      if (!isNil(url)) posters.push({ posterId: generateHash(url), origin, url });
    }

    return posters;
  }
}
