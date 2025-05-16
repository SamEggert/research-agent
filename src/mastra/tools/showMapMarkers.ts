import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// In-memory store for latest markers
let latestMarkers: any[] = [];

export const showMapMarkersTool = createTool({
  id: 'show-map-markers',
  description: 'Show specific places as markers on the map in the UI.',
  inputSchema: z.object({
    places: z.array(
      z.object({
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
        description: z.string().optional(),
      })
    ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().optional(),
  }),
  execute: async ({ context }) => {
    console.log('showMapMarkersTool', context);
    // Store the latest markers in memory
    latestMarkers = context.places;
    return { success: true, message: "Markers stored in memory" };
  },
});

// Export a getter for the latest markers
export function getLatestMarkers() {
  return latestMarkers;
}
