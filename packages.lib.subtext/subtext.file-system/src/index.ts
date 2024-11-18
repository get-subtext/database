import type { SubText } from '@get-subtext/lib.subtext';
import type { SubTextOptions } from './index.types';
import { SubText as SubTextImpl } from './services/SubText';

export type * from './index.types';

export class SubTextFactory {
  private constructor() {}

  public static create({ config }: SubTextOptions): SubText {
    return new SubTextImpl(config.rootDir);
  }
}
