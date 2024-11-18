const fs = require('fs');
const { pathsToModuleNameMapper } = require('ts-jest');

const tsConfig = JSON.parse(fs.readFileSync('../../tsconfig.json', 'utf-8')) ?? {};
const compilerOptions = tsConfig.compilerOptions ?? {};

process.env.TZ = 'GMT';

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testRegex: '/__tests__/.*\\.(test|spec)?\\.(ts|tsx)$',
  verbose: true,
  coveragePathIgnorePatterns: ['__tests__'],
  collectCoverage: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, { prefix: '<rootDir>/../../' }),
};
