export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,jsx}'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/main.jsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  transform: {
    '^.+\\.jsx?$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
