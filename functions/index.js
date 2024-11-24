const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { https } = require("firebase-functions");
const { getFirestore } = require("firebase-admin/firestore");
const OpenAI = require("openai");

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
  },
  async (data, context) => {
    const { storyContext, tone = "funny", forksCount = 5 } = data;

    // Input validation
    if (!storyContext || typeof storyContext !== "string") {
      throw new https.HttpsError(
        "invalid-argument",
        "The 'context' must be a non-empty string.",
      );
    }

    if (tone && !["funny", "dramatic", "absurd"].includes(tone)) {
      throw new https.HttpsError(
        "invalid-argument",
        "The 'tone' must be one of 'funny', 'dramatic', or 'absurd'.",
      );
    }

    const MAX_CONTEXT_LENGTH = 500;
    const truncatedStoryContext =
      storyContext.length > MAX_CONTEXT_LENGTH
        ? storyContext.slice(-MAX_CONTEXT_LENGTH)
        : storyContext;

    try {
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a story generator assistant." },
          {
            role: "user",
            content: `Story so far: ${truncatedStoryContext}\nGenerate a ${tone} next sentence.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
        n: forksCount,
      });

      const forks = completion.choices.map((choice) =>
        choice.message.content.trim(),
      );

      const db = getFirestore();
      // Update Firestore for multiplayer
      const roomRef = db.collection("rooms").doc(context.auth.token.roomId);
      await roomRef.update({
        forks,
        votes: forks.reduce((acc, _, index) => {
          acc[index] = 0; // Initialize vote counts
          return acc;
        }, {}),
      });

      return { forks };
    } catch (error) {
      console.error("Error generating story forks:", error);
      throw new https.HttpsError(
        "internal",
        `Failed to generate story forks: ${error.message}`,
      );
    }
  },
);
