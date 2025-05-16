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
    const { userId } = context.triggerData;
    const preferences = await getUserPreferences(userId);
    const existingRecommendations = await getExistingRecommendations(userId);
    return { preferences, existingRecommendations };
  },
});

// Step 2: Agent reasoning
const outputSchema = z.object({
  response: z.string(),
  places: z.array(z.any()),
});

const agentStep = new Step({
  id: "agentStep",
  outputSchema,
  execute: async ({ context }) => {
    const { prompt } = context.triggerData;
    const { preferences, existingRecommendations } = context.getStepResult(fetchUserData);
    const userPrompt = `${prompt}\nUser preferences: ${JSON.stringify(preferences)}\nExisting recommendations: ${JSON.stringify(existingRecommendations)}`;
    const result = await recommendationAgent.generate(
      [{ role: "user", content: userPrompt }],
      { experimental_output: outputSchema }
    );
    return result.object;
  },
});

// Step 3: Show map markers
const showMarkersStep = new Step({
  id: "showMarkersStep",
  execute: async ({ context }) => {
    const { places } = context.getStepResult(agentStep);
    await recommendationAgent.generate(
      [
        { role: "user", content: "Show these places on the map: " + JSON.stringify(places) }
      ],
      { maxSteps: 2 }
    );
    return {};
  },
});

// Step 4: Add recommendations to DB
const addRecommendationsStep = new Step({
  id: "addRecommendationsStep",
  execute: async ({ context }) => {
    const { places } = context.getStepResult(agentStep);
    const { userId } = context.triggerData;
    await addRecommendation(userId, places);
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
