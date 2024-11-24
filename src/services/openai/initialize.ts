import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Initialize Firebase Functions
export const functions = getFunctions();

// Connect to the emulator if needed
if (process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functions, "localhost", 5001); // Use the appropriate emulator port
}
