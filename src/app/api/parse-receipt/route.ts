import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ items: [] });
    }

const prompt = `
Extract items from receipt.

Return ONLY JSON:

{
  "items": [
    { "name": "string", "qty": number, "price": number }
  ]
}

Rules:
- Extract item name, quantity, and price
- If quantity not found → qty = 1
- Ignore TOTAL, CASH, CHANGE
- Fix OCR mistakes
- No explanation

Receipt:
${text}
`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    const raw = data?.content?.[0]?.text || "";

    console.log("AI RAW:", raw);

    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) {
      return NextResponse.json({ items: [] });
    }

    const parsed = JSON.parse(match[0]);

    return NextResponse.json({
      items: parsed.items || [],
    });
  } catch (err) {
    console.error("PARSE ERROR:", err);
    return NextResponse.json({ items: [] });
  }
}
