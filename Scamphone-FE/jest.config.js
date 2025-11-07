module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^@/components/ui/(.*)$': '<rootDir>/src/__mocks__/ui/$1',
    '^@radix-ui/(.*)': '<rootDir>/src/__mocks__/ui/index.tsx',
    '@radix-ui/react-slot': '<rootDir>/src/__mocks__/ui/index.tsx',
    '@radix-ui/react-dialog': '<rootDir>/src/__mocks__/ui/index.tsx',
    'class-variance-authority': '<rootDir>/src/__mocks__/class-variance-authority.ts',
    'lucide-react': '<rootDir>/src/__mocks__/lucide-react.tsx'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleDirectories: ['node_modules', 'src']
};