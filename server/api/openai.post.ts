export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        temperature: 0.1,
        messages: [
            {
                role: "system",
                content: `
You are a prediction market analyst. Respond ONLY with valid JSON.

CRITICAL RULES (must follow exactly):
- You MUST choose ONE marketId from the list provided below as outcomeMarketId.
- marketId MUST be copied EXACTLY as written (character-for-character).
- NEVER invent, modify, translate, summarize, or infer an ID.
- If unsure, choose the MOST LIKELY market based on the description.
- For predictions: include ALL markets provided.
- chance for predictions must be a number between 0 and 100.
- Output MUST be valid JSON only. No explanations, no markdown.
`
            },
            {
                role: "user",
                content: `
Prediction market title: ${body.title}
Description: ${body.description}${body.endDate ? `\nEnd Date: ${body.endDate}` : ""}

AVAILABLE MARKETS (THESE ARE THE ONLY VALID IDS):
${body.markets.map((m: any) => `- marketId: "${m.id}" | title: "${m.title}"`).join("\n")}

TASK:
1. Decide which ONE market is most likely to resolve YES.
2. Copy its marketId EXACTLY as shown above.
3. Assign an VERY OPTIMISTIC confidence for the chosen market (outcomeConfidence) between 0 and 100.
4. Provide an AI probability estimate for EACH market.
5. Assign an VERY OPTIMISTIC confidence for the full predictions array (predictionConfidence) between 0 and 100.

Return ONLY this JSON:
{
  "outcomeMarketId": "<exact marketId from list>",
  "outcomeConfidence": <number>,
  "predictionConfidence": <number>,
  "predictions": [
    { "marketId": "<exact marketId>", "chance": <number> }
  ]
}
`.trim()
            }
        ]
    });

    const raw = completion.choices[0].message.content;

    if (!raw) throw createError({
        statusCode: 500,
        statusMessage: "OpenAI API returned empty response"
    });

    try {
        const parsed = JSON.parse(raw);

        if (!body.markets.some((m: any) => m.id === parsed.outcomeMarketId)) {
            throw createError({
                statusCode: 500,
                statusMessage: "Model returned invalid outcomeMarketId"
            });
        }

        if (typeof parsed.outcomeConfidence !== "number" || parsed.outcomeConfidence < 0 || parsed.outcomeConfidence > 100) {
            throw createError({
                statusCode: 500,
                statusMessage: "Invalid outcomeConfidence"
            });
        }

        if (typeof parsed.predictionConfidence !== "number" || parsed.predictionConfidence < 0 || parsed.predictionConfidence > 100) {
            throw createError({
                statusCode: 500,
                statusMessage: "Invalid predictionConfidence"
            });
        }

        if (!Array.isArray(parsed.predictions)) {
            throw createError({
                statusCode: 500,
                statusMessage: "Missing predictions array"
            });
        }

        for (const p of parsed.predictions) {
            if (
                !body.markets.some((m: any) => m.id === p.marketId) ||
                typeof p.chance !== "number" ||
                p.chance < 0 ||
                p.chance > 100
            ) {
                throw createError({
                    statusCode: 500,
                    statusMessage: "Invalid prediction entry"
                });
            }
        }

        return parsed;
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: "Invalid OpenAI response format"
        });
    }
});