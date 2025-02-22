# Architectural Overview of Fork-Off

## Tech Stack:

1. **Frontend**:

   - **React**: Provides a dynamic user interface for room management, voting, and displaying story progression.
   - **Axios**: Handles API requests, including communication with Firebase Functions and OpenAI for story generation.

2. **Backend**:

   - **Firebase Firestore**: Stores game state, including rooms, story branches, votes, and player details.
   - **Firebase Realtime Database/Listeners**: Enables real-time updates for game state synchronization.
   - **Firebase Functions**: Handles secure API calls to OpenAI for text generation and encapsulates backend logic (e.g., preventing client-side exposure of sensitive keys).

3. **External APIs**:

   - **OpenAI GPT**: Generates story forks based on player-provided input and the current story context.

4. **Hosting**:
   - **Firebase Hosting**: Serves the frontend React application.

---

## Key Features:

### 1. Room Management

- **Room Creation**:

  - Players can create a room with configurable settings:
    - **Number of forks per round** (default: 3).
    - **Variance level** (scale: 1–10).
  - A unique room ID is generated for joining.
  - Room creator manages room settings and game state.

- **Room Joining**:
  - Players can join using the unique room ID.
  - Players are identified by nicknames provided during joining.

---

### 2. Story and Fork Management

- **Initial Round**:

  - Each player submits a phrase to influence the starting story.
  - Then Fork-Off combines the submissions to generate an origin sentence and the number of forks specified.

- **Subsequent Rounds**:

  - Players have 120 seconds to vote on their favorite forks and submit a phrase for the next round.
    - Once all players have voted and submitted or time is up, the round ends.
    - Players have **3 votes**, which can be distributed across multiple forks or used on a single fork.
    - Players submit a phrase to influence the next story iteration.
  - Fork-Off generates new forks based on:
    - Persisted forks from the previous round.
    - Combined player input for the current round.

- **Variance Handling**:

  - Variance influences the creativity/randomness of the forks:
    - **Low Variance**: Subtle changes (e.g., modifying objects or actions).
    - **High Variance**: Dramatic shifts (e.g., genre changes or fantastical elements).

- **Fork Pruning**:

  - If fewer forks are selected than the configured maximum, Fork-Off generates additional forks per persisted story path.
  - Tied forks are persisted beyond the maximum if needed and are pruned in subsequent rounds when possible.

---

### 3. Voting System

- **Real-Time Voting**:

  - Players vote on forks in real-time, and votes are aggregated in Firestore.
  - Voting concludes when:
    - All players submit their votes, or
    - A time limit (default: 5 minutes) is reached.

- **Tiebreakers**:
  - If ties occur and exceed the maximum number of forks, all tied forks persist to the next round.

---

### 4. Real-Time Updates

- **Firestore listeners** propagate updates to all players in a room:
  - Synchronizes story progression, forks, and voting results.
  - Ensures seamless UI updates as the game progresses.

---

### 5. Game Flow

- **Round Progression**:

  - Players read through the current forks.
  - Players vote and submit suggestions for the next round.
  - Fork-Off processes the inputs and generates new forks for the next round.

- **Ending the Game**:
  - The game ends when:
    - The game organizer ends it
    - A maximum step count (configurable) is reached.

---

### 6. Frontend UI

- **Dynamic Components**:

  - **Story Display**: Shows the full narrative progression (`story.join(" ")`).
  - **Fork Display**: Shows the current forks with vote counts.
  - **Room Settings**: Allows the room creator to adjust fork count and variance mid-game.

- **Player Input**:

  - Text input for nicknames and suggestion phrases.
  - Voting buttons with real-time updates.

- **Navigation**:
  - Persistent access to the full story tree for review.

---

## Progress Summary:

### Initial Setup:

- React project created and hosted on Firebase Hosting.
- Firebase Firestore and Functions configured.
- OpenAI API integrated securely using Firebase Functions.

---

### Core Functionality:

- Room creation and joining implemented.
- Basic story progression and fork generation operational.
- Voting system synchronized in real time.

---

### Game Logic:

- Variance settings control fork creativity and coherence.
- Handles ties and additional fork generation when necessary.
- Prunes forks dynamically to maintain game balance.

---

### UI/UX:

- Responsive, intuitive UI for room management, voting, and story exploration.
- Real-time feedback for voting and story updates.

---

## Next Steps:

### Optimizations:

- Enhance performance of Firestore queries for large groups or long story trees.

### Future Features:

- Visualize story progression with branching diagrams.
- Implement persistent room states for players to rejoin mid-game.

### Open AI Response Tuning:

- Determine what data we need to pass to open ai at each step to get good responses
- This is going to be crucial to get right in order to make the game enjoyable

# Technical Implementation Status

## Core Features (✓ = Done)

- Authentication & Room Management

  - ✓ Room creation/joining
  - ✓ Nickname-based player tracking
  - ✓ Host management & transfer
  - ✓ Room configuration

- Game Flow
  - ✓ Lobby system
  - ✓ Game phases (writing, forking, voting, results)
  - ✓ Round timer implementation
  - Basic story engine (WIP)

## Tech Stack

- React (Frontend)
- Firebase (Backend)
- No AI integration yet

## Next Steps

1. Story engine integration
2. Multi-round implementation
3. Scoring system
4. Results sharing
