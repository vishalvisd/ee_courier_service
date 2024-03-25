module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    testMatch: [
        '<rootDir>/test/*.test.js',
        '<rootDir>/test/*.test.ts'
    ]
}