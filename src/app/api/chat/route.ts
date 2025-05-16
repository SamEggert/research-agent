import { recommendationAgent } from '../../../mastra/agents';
import type { Message as AiMessageType } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "'messages' must be an array." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Accept both {role, content} and {sender, text} formats
    const aiMessages = messages.map((msg: any) => {
      if (msg.role && msg.content) {
        return { role: msg.role, content: msg.content };
      } else if (msg.sender && msg.text) {
        return { role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text };
      } else {
        throw new Error('Invalid message format');
      }
    });

    // Type assertion to AiMessageType[] to satisfy the linter
    const result = await recommendationAgent.generate(aiMessages as AiMessageType[]);
    console.log("Agent result:", result);

    let response = result.text ?? "No response.";

    return new Response(
      JSON.stringify({ text: response }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}