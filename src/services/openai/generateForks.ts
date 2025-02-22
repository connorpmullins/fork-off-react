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
    tone: string;
    temperature: number;
    maxTokens: number;
    forksCount: number;
  }
): Promise<string[]> => {
  const { tone, temperature, maxTokens, forksCount } = options;
  console.log("[generateForks] Starting fork generation:", {
    contextLength: context?.length,
    options,
  });

  // Validate input
  if (!context || typeof context !== "string" || !context.trim()) {
    console.error("[generateForks] Invalid context:", { context });
    throw new Error("Story context must be a non-empty string");
  }

  console.log("[generateForks] Using options:", {
    tone,
    temperature,
    maxTokens,
    forksCount,
  });

  // Validate options
  if (temperature < 0 || temperature > 1) {
    console.error("[generateForks] Invalid temperature:", { temperature });
    throw new Error("Temperature must be between 0 and 1");
  }

  if (forksCount < 1) {
    console.error("[generateForks] Invalid forksCount:", { forksCount });
    throw new Error("Must generate at least one fork");
  }

  try {
    const payload = {
      storyContext: context.trim(),
      tone,
      temperature,
      maxTokens,
      forksCount,
    };
    console.log(
      "[generateForks] Calling Firebase function with payload:",
      JSON.stringify(payload, null, 2)
    );

    const response = await generateForksCallable(payload);
    console.log(
      "[generateForks] Firebase function response received: ",
      JSON.stringify(response, null, 2)
    );

    // Ensure the response contains valid data
    const data = response.data as { forks: string[] };
    if (!Array.isArray(data.forks) || data.forks.length === 0) {
      console.error("[generateForks] Invalid response data:", { data });
      throw new Error("Invalid response: no forks generated.");
    }

    console.log("[generateForks] Successfully generated forks:", {
      count: data.forks.length,
      lengths: data.forks.map((f) => f.length),
    });

    return data.forks;
  } catch (error: any) {
    console.error("[generateForks] Error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    if (error.code === "invalid-argument") {
      throw new Error("Please provide a valid story to generate variations.");
    }
    throw new Error(`Failed to generate story forks: ${error.message}`);
  }
};
