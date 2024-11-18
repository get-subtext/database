export enum ReadOutputCodeEnum {
  NotAutomated = 'NotAutomated',
  Automated = 'Automated',
  AutomatedNoData = 'AutomatedNoData',
  AutomatedParseError = 'AutomatedParseError',
}

export interface IssueNotAutomated {
  code: ReadOutputCodeEnum.NotAutomated;
}

export interface IssueAutomated {
  code: ReadOutputCodeEnum.Automated;
  data: any;
}

export interface IssueAutomatedNoData {
  code: ReadOutputCodeEnum.AutomatedNoData;
}

export interface IssueAutomatedParseError {
  code: ReadOutputCodeEnum.AutomatedParseError;
  rawData: string;
}

export type Issue = IssueNotAutomated | IssueAutomated | IssueAutomatedNoData | IssueAutomatedParseError;

export interface IssueManager {
  readIssue: (issueNumber: string) => Promise<Issue>;
  closeIssue: (issueNumber: string, comment: string, labels: string[]) => Promise<void>;
}
