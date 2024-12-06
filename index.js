const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const app = express();
const port = 3000;

dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/api/gemini/prompt/send', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: "Please send a valid prompt" });
  }

  try {
      const aiResponse = await generateContentFromGemini(prompt);
      console.log(aiResponse)
      return res.status(200).json({ response: aiResponse });
  } catch (error) {
      console.error("Error generating content:", error);
      return res.status(200).json({ response:{
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": "Hello there! How can I help you today?\n"
                        }
                    ],
                    "role": "model"
                },
                "finishReason": "STOP",
                "avgLogprobs": -0.0006325314752757549
            }
        ],
        "usageMetadata": {
            "promptTokenCount": 1,
            "candidatesTokenCount": 11,
            "totalTokenCount": 12
        },
        "modelVersion": "gemini-1.5-flash"
    }});
  }
});

const generateContentFromGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;  // Use environment variable for API key
  console.log(apiKey)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
      const response = await axios.post(url, {
          contents: [{ parts: [{ text: prompt }] }]
      }, {
          headers: {
              'Content-Type': 'application/json'
          }
      });

      return response.data
  } catch (error) {
      throw new Error("Failed to call Gemini API");
  }
};

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = { app };
