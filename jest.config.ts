import { type Config } from 'jest';

const config: Config = {
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/e2e', '<rootDir>/tests/k6'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,vue}'],
  testEnvironment: 'jsdom', // verbose: true,
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.(t|j)sx?$': '@swc/jest',

    // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css|scss|md)$': '<rootDir>/fileTransformer.js',
    '\\.(md$|graphql)': '@glen/jest-raw-loader',
  },
};

export default config;
