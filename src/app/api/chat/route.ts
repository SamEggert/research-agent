import { recommendationWorkflow } from "../../../mastra/workflow/recommendationWorkflow";

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "'messages' must be an array." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Compose the prompt from the chat history
    const prompt = messages.map((msg: any) => msg.content).join("\n");

    // You may want to get userId from session/auth if not provided
    // fallback: anonymous or error
    // if (!userId) {
    //   return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
    // }

    // Start the workflow
    const { runId, start } = recommendationWorkflow.createRun();
    const result = await start({ triggerData: { userId: userId || "anonymous", prompt } }) as any;
    console.log("Full workflow result:", JSON.stringify(result, null, 2));

    // Try to get the response from agentStep (check both .results and .steps)
    let response = result.results?.agentStep?.output?.response
      || result.steps?.agentStep?.output?.response;

    // Fallback: search all nested steps for a non-empty .text
    if (!response) {
      // Try .results first
      const stepsObj = result.results || result.steps || {};
      let foundText = null;
      for (const key of Object.keys(stepsObj)) {
        const step = stepsObj[key];
        if (step?.output?.response && typeof step.output.response === 'string' && step.output.response.trim()) {
          foundText = step.output.response;
          break;
        }
        if (step?.text && typeof step.text === 'string' && step.text.trim()) {
          foundText = step.text;
          break;
        }
      }
      response = foundText || "No response.";
    }

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