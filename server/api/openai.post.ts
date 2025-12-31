export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        temperature: 1,
        messages: [
            {
                role: "system",
                content: `
You are a prediction market analyst. Respond ONLY with valid JSON.

CRITICAL RULES (must follow exactly):
- You MUST choose ONE marketId from the list provided below.
- marketId MUST be copied EXACTLY as written (character-for-character).
- NEVER invent, modify, translate, summarize, or infer an ID.
- If unsure, choose the MOST LIKELY market based on the description.
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
3. Assign an VERY OPTIMISTIC confidence between 0 and 100.

Return ONLY this JSON:
{
  "marketId": "<exact marketId from list>",
  "confidence": <number>
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

        if (!body.markets.some((m: any) => m.id === parsed.marketId)) {
            throw createError({
                statusCode: 500,
                statusMessage: "Model returned invalid marketId"
            })
        }

        return parsed;
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: "Invalid OpenAI response format"
        });
    }
});