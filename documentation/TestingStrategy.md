# Testing Strategy for Fork-Off

This document outlines the testing approach for Fork-Off, covering both unit tests and end-to-end testing strategies.

## Testing Infrastructure

### Project Structure

```
fork-off/
├── src/
│   ├── components/
│   │   └── __tests__/          # React component tests
│   └── setupTests.ts           # React testing setup
├── tests/
│   └── rules/                  # Firestore rules tests
├── __mocks__/                  # Jest mocks for static assets
├── jest.config.js              # Jest configuration
└── tsconfig.test.json         # TypeScript config for tests
```

### Testing Tools

#### Frontend Testing

- **Jest**: Primary test runner (v29+)
- **React Testing Library**: Component testing (v16+)
- **@testing-library/jest-dom**: DOM assertions (v6+)
- **@testing-library/user-event**: User interaction simulation (v14+)

#### Backend Testing

- **@firebase/rules-unit-testing**: Firestore rules testing
- **Firebase Emulator Suite**: Local Firebase environment

### Configuration Files

#### Jest Configuration (jest.config.js)

```javascript
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
```

#### TypeScript Test Configuration (tsconfig.test.json)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  },
  "include": ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"]
}
```

## Unit Testing Examples

### 1. React Component Tests

```typescript
// src/components/__tests__/RoomManager.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoomManager } from "../RoomManager";

describe("RoomManager", () => {
  const mockOnCreateRoom = jest.fn();
  const mockOnJoinRoom = jest.fn();
  const mockSetNickname = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nickname input and room buttons", () => {
    render(
      <RoomManager
        onCreateRoom={mockOnCreateRoom}
        onJoinRoom={mockOnJoinRoom}
        nickname=""
        setNickname={mockSetNickname}
      />
    );

    expect(screen.getByPlaceholderText("Enter nickname")).toBeInTheDocument();
    expect(screen.getByText("Create Room")).toBeInTheDocument();
    expect(screen.getByText("Join Room")).toBeInTheDocument();
  });

  // Additional test cases...
});
```

### 2. Firestore Rules Tests

```typescript
// tests/rules/firestore.rules.test.ts
import {
  assertSucceeds,
  assertFails,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

describe("Firestore Security Rules", () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    const rules = fs.readFileSync(
      path.resolve(__dirname, "../../firebase/firestore.rules"),
      "utf8",
    );

    testEnv = await initializeTestEnvironment({
      projectId: "demo-fork-off",
      firestore: {
        rules,
        host: "127.0.0.1",
        port: 9150,
      },
    });
  });

  // Test cases for room creation, reading, etc...
});
```

## Running Tests

### Available Scripts

```bash
# Run React component tests
npm run test:react

# Run Firestore rules tests (requires Firebase emulator)
npm run test:rules

# Run all tests (using react-scripts)
npm test
```

### Test Coverage Goals

- Frontend Components: 80% coverage
- Firestore Rules: 100% coverage

## Best Practices

### React Component Testing

1. Use React Testing Library's queries in this order:

   - getByRole (most preferred)
   - getByLabelText
   - getByPlaceholderText
   - getByText
   - getByDisplayValue
   - getByTestId (least preferred)

2. Test user interactions using `fireEvent` or `userEvent`
3. Test component behavior, not implementation
4. Mock external dependencies and services

### Firestore Rules Testing

1. Test both successful and failed operations
2. Test with different user contexts (authenticated, unauthenticated)
3. Clean up data between tests
4. Use the Firebase Emulator Suite

## Future Improvements

1. **Integration Tests**

   - Add tests for Firebase Functions
   - Test component integration with Firestore
   - Add API mocking with MSW

2. **E2E Testing with Cypress**

   - Implement full game flow tests
   - Test multiplayer interactions
   - Test real-time updates

3. **Performance Testing**

   - Add load tests for concurrent users
   - Test large story tree performance
   - Monitor Firebase quota usage

4. **Accessibility Testing**
   - Add jest-axe for accessibility testing
   - Implement keyboard navigation tests
   - Add screen reader compatibility tests
