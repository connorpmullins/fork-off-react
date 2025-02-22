const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { https } = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const OpenAI = require("openai");

// Initialize Firebase Admin
admin.initializeApp({
  projectId: process.env.GCLOUD_PROJECT,
});

const openaiApiKey = defineSecret("OPENAI_API_KEY");

let openaiClient;
require("firebase-functions/v2/core").onInit(() => {
  openaiClient = new OpenAI({ apiKey: openaiApiKey.value() });
});

exports.generateStoryForks = onCall(
  {
    secrets: [openaiApiKey],
    rateLimits: {
      maxCallsPerSecond: 5,
      maxConcurrentCalls: 10,
    },
    enforceAppCheck: false,
  },
  async (request) => {
    // Log the raw request first to debug what's being received
    console.log("[generateStoryForks] Raw request received:", {
      requestType: typeof request,
      requestKeys: Object.keys(request),
      dataType: typeof request.data,
      dataKeys: Object.keys(request.data),
    });

    // Extract data from the payload
    const {
      storyContext,
      tone = "funny",
      temperature = 0.7,
      maxTokens = 100,
      forksCount = 5,
    } = request.data;

    console.log("[generateStoryForks] Extracted data:", {
      storyLength: storyContext?.length,
      tone,
      forksCount,
      temperature,
      maxTokens,
    });

    // Input validation
    if (
      !storyContext ||
      typeof storyContext !== "string" ||
      !storyContext.trim()
    ) {
      console.error("[generateStoryForks] Invalid storyContext:", {
        storyContextType: typeof storyContext,
        storyContextLength: storyContext?.length,
      });
      throw new https.HttpsError(
        "invalid-argument",
        "The story context must be a non-empty string.",
      );
    }

    try {
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a creative writing assistant. Generate ${forksCount} different variations of how the story could continue. Each variation should be unique and interesting, maintaining a ${tone} tone. Keep each variation concise, around ${maxTokens} words.`,
          },
          {
            role: "user",
            content: `Here's the story so far:\n\n${storyContext}\n\nGenerate ${forksCount} different ways this story could continue:`,
          },
        ],
        temperature: temperature,
        max_tokens: maxTokens * forksCount,
        n: 1,
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new https.HttpsError(
          "internal",
          "No story variations were generated.",
        );
      }

      // Parse the response to extract individual forks
      const content = completion.choices[0].message.content;
      const forks = content
        .split(/\d+\.\s+/)
        .filter((fork) => fork.trim().length > 0)
        .map((fork) => fork.trim());

      if (forks.length === 0) {
        throw new https.HttpsError(
          "internal",
          "Failed to parse story variations.",
        );
      }

      console.log("[generateStoryForks] Successfully generated forks:", {
        count: forks.length,
        lengths: forks.map((f) => f.length),
      });

      return { forks };
    } catch (error) {
      console.error("[generateStoryForks] Error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw new https.HttpsError(
        "internal",
        `Failed to generate story variations: ${error.message}`,
      );
    }
  },
);
