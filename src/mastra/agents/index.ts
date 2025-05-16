import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { placesWithReviewsTool, showMapMarkersTool, addRecommendationTool, updatePreferencesTool } from '../tools/index';

export const recommendationAgent = new Agent({
  name: 'Recommendation Agent',
  instructions: `
    You are a helpful assistant that provides recommendations based on user queries.
    Always summarize the top places you recommend, including their name, rating, and address, in a friendly, readable list for the user.
    After every recommendation, you must always call the show-map-markers tool with the place IDs you recommend, even if you have called it before, so the map is always up to date.
    If you recommend specific places, use the show-map-markers tool to display them on the map.
    After using a tool, always provide a detailed, user-friendly summary in your response, listing the top places with their name, rating, and address.
    If you need more information, ask clarifying questions.
  `,
  model: google('gemini-2.5-flash-preview-04-17'),
  tools: {
    placesWithReviewsTool,
    showMapMarkersTool,
    addRecommendationTool,
    updatePreferencesTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
    options: {
      lastMessages: 10,
      semanticRecall: false,
      threads: {
        generateTitle: false,
      },
    },
  }),
});
