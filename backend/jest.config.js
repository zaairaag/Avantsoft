module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '<rootDir>/tests/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/utils/database.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: 1,
  detectOpenHandles: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.cursor/',
    '/.kiro/',
    '/.trae/',
    '/.blackbox-editor/',
    '/AppData/',
    '/Local Sites/',
    '/plugins/',
    '/valia-bk-producao/'
  ],
  modulePathIgnorePatterns: [
    '/.cursor/',
    '/.kiro/',
    '/.trae/',
    '/.blackbox-editor/',
    '/AppData/',
    '/Local Sites/',
    '/plugins/',
    '/valia-bk-producao/'
  ]
};
