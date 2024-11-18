import * as fs from 'fs';
import * as path from 'path';

export const getPkgMeta = (rootDir: string) => JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf8'));
