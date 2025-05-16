import { z } from "zod";
import { Workflow, Step } from "@mastra/core";
import { recommendationAgent } from "../agents";
import { getUserPreferences, getExistingRecommendations, addRecommendation } from "../db/neonApi";
import { showMapMarkersTool } from "../tools";

export const recommendationWorkflow = new Workflow({
  name: "recommendation-workflow",
  triggerSchema: z.object({
    userId: z.string(),
    prompt: z.string(),
  }),
});

// Step 1: Fetch user data
const fetchUserData = new Step({
  id: "fetchUserData",
  outputSchema: z.object({
    preferences: z.any(),
    existingRecommendations: z.any(),
  }),
  execute: async ({ context }) => {
    // const { userId } = context.triggerData;
    const preferences = await getUserPreferences();
    const existingRecommendations = await getExistingRecommendations();
    return { preferences, existingRecommendations };
  },
});

// Step 2: Agent reasoning
const outputSchema = z.object({
  response: z.string(),
  places: z.array(z.unknown()).optional(),
});

const agentStep = new Step({
  id: "agentStep",
  outputSchema,
  execute: async ({ context }) => {
    const { prompt } = context.triggerData;
    const { preferences, existingRecommendations } = context.getStepResult(fetchUserData);
    const userPrompt = `You are a recommendation agent.\nUser prompt: ${prompt}\nUser preferences: ${JSON.stringify(preferences)}\nExisting recommendations: ${JSON.stringify(existingRecommendations)}\n\nPlease recommend places for the user. Respond ONLY in the following JSON format (no explanation outside the JSON):\\n{\\n  \"places\": [ { \"name\": \"Place Name\", \"address\": \"Address or details\" }, ... ],\\n  \"response\": \"A short summary or explanation for the user.\"\\n}`;
    console.log("Prompt sent to LLM:", userPrompt); // Debug prompt
    const result = await recommendationAgent.generate(
      [{ role: "user", content: userPrompt }]
    );
    console.log("LLM result:", result); // Debug LLM result
    let response = result.text ?? "";
    let places = [];
    try {
      // Remove Markdown code block if present
      response = response.trim();
      if (response.startsWith("```json")) {
        response = response.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (response.startsWith("```")) {
        response = response.replace(/^```/, "").replace(/```$/, "").trim();
      }
      // Attempt to parse JSON from the LLM response
      const parsed = JSON.parse(response);
      response = parsed.response || response;
      places = parsed.places || [];
    } catch (e) {
      // If parsing fails, fallback to plain text and empty places
      console.warn("Failed to parse LLM response as JSON", e);
    }
    return {
      response,
      places,
    };
  },
});

// Step 3: Show map markers
const showMarkersStep = new Step({
  id: "showMarkersStep",
  execute: async ({ context, runtimeContext }: any) => {
    const { places } = context.getStepResult(agentStep);
    // Type guard for places
    const safePlaces = Array.isArray(places) ? places : [];
    // Extract place IDs from the places array
    const placeIds = safePlaces.map((p: any) => p.place_id || p.id).filter(Boolean);
    if (placeIds.length === 0) return {};
    // Call the tool directly
    await showMapMarkersTool.execute({ context: { placeIds }, runtimeContext });
    return {};
  },
});

// Step 4: Add recommendations to DB
const addRecommendationsStep = new Step({
  id: "addRecommendationsStep",
  execute: async ({ context }) => {
    const { places } = context.getStepResult(agentStep);
    if (!places || places.length === 0) {
      // Nothing to add, skip
      return {};
    }
    await addRecommendation(places);
    return {};
  },
});

// Link steps and commit
recommendationWorkflow
  .step(fetchUserData)
  .then(agentStep)
  .then(showMarkersStep)
  .then(addRecommendationsStep)
  .commit();
