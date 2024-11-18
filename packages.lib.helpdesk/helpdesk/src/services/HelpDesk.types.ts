export interface HelpDesk {
  processIssue: (issueNumber: string) => Promise<void>;
}

export interface HelpDeskTap {
  processIssueStarted: (issueNumber: string) => void;
  processIssueFinishedIgnoredNoBotLabel: (issueNumber: string, label: string) => void;
  processIssueFinishedNoDataError: (issueNumber: string) => void;
  processIssueFinishedParseError: (issueNumber: string, rawData: string) => void;
  processIssueFinishedNoTypeError: (issueNumber: string, data: any) => void;
  processIssueFinishedInvalidTypeError: (issueNumber: string, data: any, type: string) => void;
  processIssueFinished: (issueNumber: string, data: any, type: string) => void;
}
