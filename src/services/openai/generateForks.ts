import { httpsCallable } from "firebase/functions";
import { functions } from "./initialize";

// Define the callable function
const generateForksCallable = httpsCallable(functions, "generateStoryForks");

/**
 * Calls the Firebase Function to generate story forks.
 * @param context The story so far (text).
 * @param options Options for story generation, including tone, temperature, maxTokens, and forksCount.
 * @returns A promise that resolves to an array of story forks.
 */
export const generateForks = async (
  context: string,
  options: {
    tone?: string;
    temperature?: number;
    maxTokens?: number;
    forksCount?: number;
  } = {},
): Promise<string[]> => {
  // Set default values for options
  const {
    tone = "funny",
    temperature = 0.7,
    maxTokens = 100,
    forksCount = 5,
  } = options;

  try {
    const response = await generateForksCallable({
      context,
      tone,
      temperature,
      maxTokens,
      forksCount,
    });

    // Ensure the response contains valid data
    const data = response.data as { forks: string[] };
    if (!Array.isArray(data.forks) || data.forks.length === 0) {
      throw new Error("Invalid response: no forks generated.");
    }

    return data.forks;
  } catch (error) {
    // Log the error for debugging
    console.error("Error generating story forks:", error);

    // Provide a user-friendly error message
    throw new Error(
      "Failed to generate story forks. Please check your input and try again.",
    );
  }
};
