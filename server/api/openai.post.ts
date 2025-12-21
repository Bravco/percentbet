import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const completion = await openai.chat.completions.create({
        model: "gpt-5-mini",
        temperature: 1,
        messages: [
            {
                role: "system",
                content: "You are a prediction market analyst. Respond ONLY with valid JSON."
            },
            {
                role: "user",
                content: `
Prediction market title: ${body.title}
Description: ${body.description}
End date: ${body.endDate}
Total volume: ${body.volume}
Choices: ${body.markets.map((m: any) => ({
    index: m.index,
    title: m.title
}))}

Rules:
- Index MUST correspond to the selected choice index
- Confidence must be optimistic, between 0 and 100

Return ONLY this JSON:
{
  "index": number,
  "confidence": number
}
`
            }
        ]
    });

    const raw = completion.choices[0].message.content;

    if (!raw) throw createError({
        statusCode: 500,
        statusMessage: "OpenAI API returned empty response"
    });

    try {
        return JSON.parse(raw);
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: "Invalid OpenAI response format"
        });
    }
});