import type { Config } from 'jest'
const config: Config = {
  watchman: false, preset: 'ts-jest', testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: { '\\.(css|svg)$': '<rootDir>/tests/styleMock.cjs' },
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { target: 'ES2022', module: 'CommonJS', jsx: 'react-jsx', esModuleInterop: true, verbatimModuleSyntax: false, types: ['jest', 'node', '@testing-library/jest-dom'], ignoreDeprecations: '6.0' }, diagnostics: false }] },
  collectCoverageFrom: ['src/features/**/*.{ts,tsx}'],
  coverageThreshold: { './src/features/': { statements: 70 } },
}
export default config
