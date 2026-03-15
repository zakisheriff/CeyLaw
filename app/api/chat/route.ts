import { NextResponse } from 'next/server';
import { retrieveLegalContext, constructLegalPrompt } from '@/lib/ai/retrieval';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { message, lawSlug } = await req.json();

    // 1. Retrieve Context from Astra DB
    const { context, citations } = await retrieveLegalContext(message, lawSlug);

    // 2. Construct Prompt
    const prompt = constructLegalPrompt(message, context);

    // 3. Generate response with Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      content: text,
      citations
    });

  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
