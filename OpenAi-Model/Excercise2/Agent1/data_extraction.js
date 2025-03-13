require("dotenv").config();
const { OpenAI } = require("openai");
const readlineSync = require("readline-sync");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractDetailsFromAgreement(agreementText) {
  const prompt = `
  Extract the following details from the legal agreement and return a JSON object in **valid JSON format only** (no extra text). 

  ### Required Fields:
  - parties (array of strings)
  - paymentAmount (string)
  - paymentMethod (string)
  - paymentDate (string)
  - description (string, max 2 lines)

  ### JSON Output Format:
  {
    "parties": ["Party 1", "Party 2"],
    "paymentAmount": "Amount",
    "paymentMethod": "Method",
    "paymentDate": "Date",
    "description": "Brief description"
  }

  Do **not** include any explanations, only return the JSON response.

  Legal Agreement:
  ${agreementText}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // console.log("Raw API Response:", JSON.stringify(response, null, 2));
    let chatbotResponse = response.choices[0].message.content.trim();
    chatbotResponse = chatbotResponse.replace(/```json|```/g, "").trim();

    try {
      const extractedData = JSON.parse(chatbotResponse);
      console.log("Extracted Data:", extractedData);
      fs.writeFileSync(
        "extracted_data.json",
        JSON.stringify(extractedData, null, 2)
      );
      console.log("Extracted data saved to extracted_data.json.");
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } catch (error) {
    console.error("Error extracting data:", error);
  }
}

const agreementText = fs.readFileSync("legal_agreement.txt", "utf-8");

const proceed = readlineSync.keyInYNStrict(
  "Do you want to extract details from the legal agreement?"
);

if (proceed) {
  extractDetailsFromAgreement(agreementText);
}
