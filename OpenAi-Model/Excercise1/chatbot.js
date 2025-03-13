require("dotenv").config();
const express = require("express");
const path = require("path");
const { OpenAI } = require("openai");
const cors = require("cors");

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ status: "error", error: "Message is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    });

    const chatbotResponse = response.choices[0].message.content.trim();

    res.json({
      status: 200,
      userMessage: message,
      chatbotResponse: chatbotResponse,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "An error occurred while processing your request",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
