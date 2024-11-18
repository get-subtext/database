import * as S from '../schemas/GitHubSchemas';
import type * as T from './GitHub.types';

export class FetchGitHub implements T.GitHub {
  public constructor(
    private readonly apiToken: string,
    private readonly apiUrlBase: string,
    private readonly fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>
  ) {}

  public async getIssue(issueNumber: number): Promise<T.Issue | null> {
    const url = `${this.apiUrlBase}/issues/${issueNumber}`;
    const headers = this.getHeaders();
    const response = await this.fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) return null;

      const errorDetails = await response.text();
      throw new Error(`[${FetchGitHub.name}] ${this.getIssue.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }

    const parsed = S.IssueSchema.safeParse(await response.json());
    if (!parsed.success) throw new Error(`[${FetchGitHub.name}] ${this.getIssue.name} failed: could not parse response`, { cause: parsed.error });

    return parsed.data;
  }

  public async addIssueLabels(issueNumber: number, labels: string[]): Promise<void> {
    const url = `${this.apiUrlBase}/issues/${issueNumber}/labels`;
    const headers = this.getHeaders();
    const response = await this.fetch(url, { method: 'POST', headers, body: JSON.stringify(labels) });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchGitHub.name}] ${this.addIssueLabels.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }
  }

  public async addIssueComment(issueNumber: number, comment: string): Promise<void> {
    const url = `${this.apiUrlBase}/issues/${issueNumber}/comments`;
    const headers = this.getHeaders();
    const response = await this.fetch(url, { method: 'POST', headers, body: JSON.stringify({ body: comment }) });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchGitHub.name}] ${this.addIssueComment.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }
  }

  public async closeIssue(issueNumber: number): Promise<void> {
    const url = `${this.apiUrlBase}/issues/${issueNumber}`;
    const headers = this.getHeaders();
    const response = await this.fetch(url, { method: 'PATCH', headers, body: JSON.stringify({ state: 'closed' }) });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchGitHub.name}] ${this.closeIssue.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }
  }

  private getHeaders() {
    const headers = { Authorization: `token ${this.apiToken}`, Accept: 'application/vnd.github.v3+json' };
    return headers;
  }
}
