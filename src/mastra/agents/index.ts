import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { placesWithReviewsTool, showMapMarkersTool, addRecommendationTool, updatePreferencesTool } from '../tools/index';

export const recommendationAgent = new Agent({
  name: 'Recommendation Agent',
  instructions: `
    You are a helpful assistant that provides recommendations based on user queries.
    Offer concise, relevant, and friendly suggestions for any topic the user asks about.
    If you recommend specific places, use the show-map-markers tool to display them on the map.
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
