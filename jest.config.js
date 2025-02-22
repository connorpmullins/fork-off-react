const baseConfig = {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
};

module.exports = {
  projects: [
    {
      ...baseConfig,
      displayName: "react",
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
      testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
      moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
          "<rootDir>/__mocks__/fileMock.js",
      },
    },
    {
      ...baseConfig,
      displayName: "firestore",
      testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
    },
  ],
};
