import { mastra } from "../../../mastra";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Received messages:", messages);
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "'messages' must be an array." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Ensure each message has the required structure
    const formattedMessages = messages.map((msg) => {
      if (typeof msg === "string") {
        return { role: "user", content: msg };
      }
      if (msg && typeof msg === "object" && msg.role && msg.content) {
        return { role: msg.role, content: msg.content };
      }
      // fallback: treat as user message
      return { role: "user", content: String(msg) };
    });
    console.log("Formatted messages:", formattedMessages);
    const agent = mastra.getAgent("recommendationAgent");
    const result = await agent.stream(formattedMessages);
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}