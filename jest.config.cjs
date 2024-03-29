module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': ['ts-jest', {
            "useESM": true
        }]
    },
    moduleNameMapper: {
        "(.+)\\.js": "$1"
    },
    extensionsToTreatAsEsm: [".ts"],
    testMatch: [
        '<rootDir>/test/*.test.js',
        '<rootDir>/test/*.test.ts'
    ]
}