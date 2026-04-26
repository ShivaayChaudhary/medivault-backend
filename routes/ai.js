const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Explain medical report using Claude AI
router.post('/explain', auth, async (req, res) => {
  try {
    const { reportText } = req.body;
    if (!reportText) return res.status(400).json({ message: 'Report text is required' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are a helpful medical assistant. A patient has shared their medical report. 
Explain it in very simple language that a common person (not a doctor) can understand.
Highlight any abnormal values and explain what they mean.
Keep your explanation friendly, clear, and in simple English.
Also mention if they should consult a doctor urgently.

Medical Report:
${reportText}`
        }]
      })
    });

    const data = await response.json();
    const explanation = data.content[0].text;
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ message: 'AI explanation failed', error: err.message });
  }
});

module.exports = router;
