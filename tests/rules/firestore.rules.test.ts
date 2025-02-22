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
    // Read the rules file
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

  afterAll(async () => {
    await testEnv?.cleanup();
  });

  beforeEach(async () => {
    await testEnv?.clearFirestore();
  });

  it("allows creating a room", async () => {
    const context = testEnv.unauthenticatedContext();

    const roomData = {
      createdAt: new Date().toISOString(),
      name: "Test Room",
      maxPlayers: 5,
      forksPerRound: 3,
      variance: 5,
    };

    await assertSucceeds(
      setDoc(doc(context.firestore(), "rooms", "room1"), roomData),
    );
  });

  it("allows reading room data", async () => {
    const context = testEnv.unauthenticatedContext();

    await assertSucceeds(getDoc(doc(context.firestore(), "rooms", "room1")));
  });

  it("allows creating a player in a room", async () => {
    const context = testEnv.unauthenticatedContext();

    const playerData = {
      nickname: "TestPlayer",
      joinedAt: new Date().toISOString(),
    };

    await assertSucceeds(
      setDoc(
        doc(context.firestore(), "rooms/room1/players", "player1"),
        playerData,
      ),
    );
  });

  it("allows creating votes in a room", async () => {
    const context = testEnv.unauthenticatedContext();

    const voteData = {
      playerId: "player1",
      forkId: "fork1",
      votedAt: new Date().toISOString(),
    };

    await assertSucceeds(
      setDoc(doc(context.firestore(), "rooms/room1/votes", "vote1"), voteData),
    );
  });
});
