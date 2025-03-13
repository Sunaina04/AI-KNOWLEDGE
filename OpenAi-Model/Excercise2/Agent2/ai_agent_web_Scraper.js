require("dotenv").config();
const { OpenAI } = require("openai");
const readlineSync = require("readline-sync");
const axios = require("axios");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchWebpageContent(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching webpage:", error.message);
    return null;
  }
}

async function callOpenAIWithRetry(prompt, retries = 3, delay = 60000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      if (error.status === 429) {
        console.warn(
          `🚨 Rate limit hit! Retrying in ${delay / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("❌ OpenAI API error:", error.message);
        return null;
      }
    }
  }
  console.error("⏳ Max retries reached. Please try again later.");
  return null;
}

async function extractInformationFromWebpage(url, query) {
  console.log("\n⏳ Fetching webpage content...");
  const webpageContent = await fetchWebpageContent(url);
  if (!webpageContent) {
    console.error("⚠️ Failed to retrieve webpage content.");
    return;
  }

  const truncatedContent = webpageContent.substring(0, 2000);

  const prompt = `Extract **detailed** information related to the user query from the webpage content. Preserve specific details, examples, and key facts.

  ### User Query:
  ${query}
  
  ### Webpage Content:
  ${truncatedContent}
  
  🔹 **Important:** Do not oversimplify. Extract specific information with proper context.`;

  console.log("\n🤖 Asking AI...");
  const response = await callOpenAIWithRetry(prompt);
  if (response) {
    console.log("\n💬 Chatbot Response:", response);
  }
}

const url = readlineSync.question("🌐 Enter the webpage URL: ");
const query = readlineSync.question("🔍 Enter your search query: ");
extractInformationFromWebpage(url, query);
