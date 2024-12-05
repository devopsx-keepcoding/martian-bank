
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],  
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  // Agrega otras configuraciones necesarias
};



  
  