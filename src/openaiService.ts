import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

// Initialize Firebase Functions
const functions = getFunctions();
connectFunctionsEmulator(functions, "localhost", 5001); // Use the appropriate emulator port

// Define the callable function
const generateForksCallable = httpsCallable(functions, "generateStoryForks");

/**
 * Calls the Firebase Function to generate story forks.
 * @param context The story so far (text).
 * @param tone The tone of the generated forks (default: "funny").
 * @returns A promise that resolves to an array of story forks.
 */
export const generateStoryForks = async (
  context: string,
  tone: string = "funny",
): Promise<string[]> => {
  try {
    const response = await generateForksCallable({ context, tone });
    console.log();
    const data = response.data as { forks: string[] };
    return data.forks;
  } catch (error) {
    console.error("Error generating story forks:", error);
    throw error;
  }
};
