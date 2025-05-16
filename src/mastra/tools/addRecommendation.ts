import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const addRecommendationTool = createTool({
  id: 'add-recommendation',
  description: 'Add a new recommendation to the database.',
  inputSchema: z.object({
    preferences_id: z.number(),
    place_id: z.string(),
    display_name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    business_status: z.string().optional(),
    rating: z.number().optional(),
    user_total_rating: z.number().optional(),
    address: z.string().optional(),
    google_maps_uri: z.string().optional(),
    api_response_data: z.any().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    recommendation: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const res = await fetch('/api/neon/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });
    if (!res.ok) {
      return { success: false, error: await res.text() };
    }
    const recommendation = await res.json();
    return { success: true, recommendation };
  },
});
