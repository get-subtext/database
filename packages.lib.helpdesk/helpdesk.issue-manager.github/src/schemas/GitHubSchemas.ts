import { z } from 'zod';

export const LabelSchema = z.object({
  name: z.string(),
});

export const IssueSchema = z.object({
  number: z.number().optional().nullable(),
  title: z.string().optional().nullable(),
  labels: z.array(LabelSchema).optional(),
  body: z.string().optional().nullable(),
});
