import { z } from 'zod';
import { IssueSchema, LabelSchema } from '../schemas/GitHubSchemas';

export type Issue = z.infer<typeof IssueSchema>;
export type Label = z.infer<typeof LabelSchema>;

export interface GitHub {
  getIssue: (issueNumber: number) => Promise<Issue | null>;
  addIssueLabels: (issueNumber: number, labels: string[]) => Promise<void>;
  addIssueComment: (issueNumber: number, comment: string) => Promise<void>;
  closeIssue: (issueNumber: number) => Promise<void>;
}
