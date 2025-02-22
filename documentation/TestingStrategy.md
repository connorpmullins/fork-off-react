# Testing Strategy for Fork-Off

This document outlines the testing approach for Fork-Off, covering both unit tests and end-to-end testing strategies.

## Testing Tools & Framework

### Frontend Testing

- **Jest**: Primary test runner and assertion library
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking
- **Firebase Emulator**: Local Firebase environment

### Backend Testing

- **Jest**: For Firebase Functions testing
- **Firebase Testing**: For Firestore rules and security testing
- **Supertest**: HTTP assertions for API testing

### E2E Testing

- **Cypress**: End-to-end testing framework
- **Firebase Emulator Suite**: Local Firebase environment

## Unit Testing Structure

### 1. Frontend Components (`/src/components/__tests__`)

#### Room Management Tests

```typescript
// RoomCreation.test.tsx
describe("RoomCreation", () => {
  test("creates room with valid settings", async () => {
    // Test room creation with default settings
  });

  test("validates fork count input", () => {
    // Test input validation
  });

  test("validates variance level input", () => {
    // Test variance bounds (1-10)
  });
});

// RoomJoining.test.tsx
describe("RoomJoining", () => {
  test("joins room with valid room ID", async () => {
    // Test room joining flow
  });

  test("handles invalid room IDs", () => {
    // Test error handling
  });
});
```

#### Story Management Tests

```typescript
// StoryDisplay.test.tsx
describe("StoryDisplay", () => {
  test("renders story progression correctly", () => {
    // Test story rendering
  });

  test("updates when new forks are added", () => {
    // Test real-time updates
  });
});

// ForkDisplay.test.tsx
describe("ForkDisplay", () => {
  test("displays correct number of forks", () => {
    // Test fork rendering
  });

  test("shows vote counts accurately", () => {
    // Test vote display
  });
});
```

#### Voting System Tests

```typescript
// VotingSystem.test.tsx
describe("VotingSystem", () => {
  test("allows multiple votes per user", () => {
    // Test vote distribution
  });

  test("prevents exceeding max votes", () => {
    // Test vote limit enforcement
  });
});
```

### 2. Backend Functions (`/functions/__tests__`)

#### Story Generation Tests

```typescript
// storyGeneration.test.ts
describe("Story Generation", () => {
  test("generates appropriate number of forks", async () => {
    // Test fork generation
  });

  test("respects variance settings", async () => {
    // Test variance influence
  });
});
```

#### Firebase Functions Tests

```typescript
// roomManagement.test.ts
describe("Room Management Functions", () => {
  test("creates room with correct structure", async () => {
    // Test room document creation
  });

  test("handles concurrent joins correctly", async () => {
    // Test race conditions
  });
});
```

### 3. Firestore Rules Tests (`/tests/rules`)

```typescript
// firestore.rules.test.ts
describe("Firestore Security Rules", () => {
  test("allows authenticated users to create rooms", async () => {
    // Test room creation permissions
  });

  test("prevents unauthorized vote modifications", async () => {
    // Test vote security
  });
});
```

## End-to-End Testing

### 1. Game Flow Tests (`/cypress/integration/gameFlow`)

```typescript
// completeGame.spec.ts
describe("Complete Game Flow", () => {
  it("completes a full game cycle", () => {
    // Create room
    // Join with multiple players
    // Submit initial phrases
    // Vote on forks
    // Verify story progression
    // End game
  });
});

// roomInteraction.spec.ts
describe("Room Interaction", () => {
  it("handles multiple users in real-time", () => {
    // Test concurrent user interactions
  });
});
```

### 2. Edge Case Tests (`/cypress/integration/edgeCases`)

```typescript
// errorHandling.spec.ts
describe("Error Handling", () => {
  it("handles network disconnections gracefully", () => {
    // Test offline behavior
  });

  it("recovers from Firebase emulator restarts", () => {
    // Test service recovery
  });
});
```

## Test Coverage Goals

- Frontend Components: 80% coverage
- Backend Functions: 90% coverage
- Firestore Rules: 100% coverage
- E2E Critical Paths: 100% coverage

## CI/CD Integration

1. **Pull Request Checks**

   - Run unit tests
   - Run Firestore rules tests
   - Run critical path E2E tests

2. **Deployment Checks**
   - Run full E2E test suite
   - Verify Firebase emulator tests
   - Check test coverage thresholds

## Local Development Testing

1. **Setup Instructions**

```bash
# Install dependencies
npm install

# Start Firebase emulators
firebase emulators:start

# Run unit tests
npm test

# Run E2E tests
npm run cypress:open
```

2. **Watch Mode Development**

```bash
# Frontend tests
npm test -- --watch

# Backend tests
npm run test:functions -- --watch
```

## Best Practices

1. **Test Organization**

   - Group tests by feature
   - Use descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

2. **Mocking Strategy**

   - Mock external services (OpenAI)
   - Use Firebase emulator for Firestore
   - Implement MSW for API mocking

3. **Data Management**
   - Reset test data between runs
   - Use factories for test data
   - Maintain test isolation

## Future Improvements

1. **Performance Testing**

   - Implement load tests for concurrent users
   - Monitor Firebase quota usage
   - Test large story tree performance

2. **Visual Testing**

   - Add visual regression tests
   - Implement accessibility testing
   - Test responsive layouts

3. **Security Testing**
   - Penetration testing suite
   - API fuzzing tests
   - Rate limiting tests
