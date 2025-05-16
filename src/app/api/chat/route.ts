import { mastra } from "../../../mastra";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const agent = mastra.getAgent("recommendationAgent");
    const result = await agent.stream(message);
    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}