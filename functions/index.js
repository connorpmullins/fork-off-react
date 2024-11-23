// Import required Firebase Functions modules
const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { https } = require("firebase-functions");

// Define the OpenAI API key as a secret
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// Import the OpenAI library
const OpenAI = require("openai");

// Initialize OpenAI client (global variable to avoid reinitialization)
let openaiClient;
require("firebase-functions/v2/core").onInit(() => {
  console.log("openaiApiKey.value(): ", openaiApiKey.value());
  openaiClient = new OpenAI({ apiKey: openaiApiKey.value() });
});

// Define the Cloud Function
exports.generateStoryForks = onCall(
  { secrets: [openaiApiKey] }, // Specify that this function needs the OpenAI API key secret
  async (data, context) => {
    const { context: storyContext, tone = "funny" } = data;

    try {
      // Call the OpenAI API to generate story forks
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini", // Replace with your preferred model
        messages: [
          { role: "system", content: "You are a story generator assistant." },
          {
            role: "user",
            content: `Story so far: ${storyContext}\nGenerate 5 ${tone} next sentences.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
        n: 5,
      });

      // Extract and return the results
      const forks = completion.choices.map((choice) =>
        choice.message.content.trim(),
      );
      return { forks };
    } catch (error) {
      console.error("Error generating story forks:", error);
      throw new https.HttpsError(
        "internal",
        `Failed to generate story forks: ${error}`,
      );
    }
  },
);
