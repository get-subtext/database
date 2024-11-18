export interface IssueHandler<T = any> {
  handle: (issueNumber: string, request: T) => Promise<void>;
}
