import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import redis from '../../lib/redis'; // adjust path as needed

// In-memory store for latest markers
let latestMarkers: any[] = [];

export const showMapMarkersTool = createTool({
  id: 'show-map-markers',
  description: 'Show specific places as markers on the map in the UI.',
  inputSchema: z.object({
    places: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
        description: z.string().optional(),
        businessStatus: z.string().optional(),
        rating: z.number().optional(),
      })
    ),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().optional(),
  }),
  execute: async ({ context }) => {
    console.log('showMapMarkersTool', context);
    // Clear previous markers
    await redis.del('latest-map-markers');
    // Store markers globally (or per session if you want)
    await redis.set('latest-map-markers', JSON.stringify(context.places));
    return { success: true, message: "Markers stored in Redis" };
  },
});

// Export a getter for the latest markers
export async function getLatestMarkers() {
  const data = await redis.get('latest-map-markers');
  return data ? JSON.parse(data) : [];
}
