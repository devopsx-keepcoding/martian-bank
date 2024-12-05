// jest.config.mjs
export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.m?[tj]s$': 'babel-jest', // Transforma archivos .js, .mjs, .ts y .mts
    },
    testMatch: [
      '**/__tests__/**/*.[jt]s?(x)', // Archivos .js, .jsx, .ts, .tsx en __tests__
      '**/__tests__/**/*.mjs',       // Archivos .mjs en __tests__
      '**/?(*.)+(spec|test).[tj]s?(x)', // Archivos .spec.js, .test.js, etc.
      '**/?(*.)+(spec|test).mjs',       // Archivos .spec.mjs, .test.mjs
    ],
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],

    // Opciones de cobertura
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text'],
  };
  
  