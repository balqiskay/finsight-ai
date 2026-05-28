const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.scanReceipt =
async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Receipt image is required",
      });
    }

    const imageBase64 =
      req.file.buffer.toString("base64");

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              `You are a receipt scanner for a finance app.
              Extract receipt details and return ONLY valid JSON.
              Format:
              {
                "merchant": "",
                "amount": 0,
                "date": "",
                "category": "",
                "description": ""
              }`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Extract merchant, total amount, date, category, and short description from this receipt.",
              },
              {
                type: "image_url",
                image_url: {
                  url:
                    `data:${req.file.mimetype};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      });

    const extractedText =
    completion.choices[0].message.content;

    const cleanedText =
    extractedText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    const extractedData =
    JSON.parse(cleanedText);

    res.status(200).json(extractedData);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Failed to scan receipt",
    });

  }

};