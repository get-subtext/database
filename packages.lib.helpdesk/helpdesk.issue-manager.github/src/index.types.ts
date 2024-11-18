export interface GitHubIssueManagerConfig {
  apiToken: string;
  apiUrlBase: string;
  dataSeparator: string;
  botLabel: string;
}

export interface GitHubIssueManagerOptions {
  config: GitHubIssueManagerConfig;
  fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
}
