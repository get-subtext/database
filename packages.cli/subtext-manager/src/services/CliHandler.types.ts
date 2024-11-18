export interface HandleHelpDeskInput {
  issueNumber: string;
}

export interface RemoveInput {
  userId: string;
  imdbId: string;
  dir: string;
}

export interface FlagInput {
  userId: string;
  imdbId: string;
  subtitleId: string;
  reason: string;
}

export interface IndexQueriesInput {
  userId: string;
}
