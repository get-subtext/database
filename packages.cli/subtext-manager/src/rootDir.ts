import * as path from 'path';

// Note, this is deliberately in the root of the src directory.
// It will work when running locally (as the root is one level up from src)
// and when running built version (as the root is one level up from dist)
// If this wasn't in the root of src directory, and the build minified the
// code, the `rootDir` may not be what is expected.
export const rootDir = path.resolve(__dirname, '..');
