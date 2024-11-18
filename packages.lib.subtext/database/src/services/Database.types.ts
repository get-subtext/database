export interface MovieIndexRaw {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
}

export interface QueryIndex {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  imdbIds: string[];
}

export interface Database {
  indexQueries: (userId: string) => Promise<void>;
}

export interface DatabaseTap {
  indexQueriesStarted: () => void;
  indexQueriesFinished: () => void;
}
