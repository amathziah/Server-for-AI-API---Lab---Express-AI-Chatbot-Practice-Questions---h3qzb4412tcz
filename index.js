const express = require("express");
const dotenv = require("dotenv")
const app = express();
const axios = require("axios");
const port = 3000;

dotenv.config()
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
      return res.status(200).json({ response: aiResponse });
  } catch (error) {
      console.error("Error generating content:", error);
      return res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});
const generateContentFromGemini = async (prompt) => {
  const apiKey = "AIzaSyAEjwFqomefefkQuZYyxf7bFexEzlKbY64"
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
      const response = await axios.post(url, {
          contents: [{ parts: [{ text: prompt }] }]
      }, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          }
      });

      return response.data; 
  } catch (error) {
      throw new Error("Failed to call Gemini API");
  }
};

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = {app}
