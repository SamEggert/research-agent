import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import redis from '../../lib/redis'; // adjust path as needed

// In-memory store for latest markers
let latestMarkers: any[] = [];

export const showMapMarkersTool = createTool({
  id: 'show-map-markers',
  description: 'Show specific places as markers on the map in the UI.',
  inputSchema: z.object({
    placeIds: z.array(z.string()),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { placeIds } = context;
    // Fetch details for each placeId (from your API or Google Places, etc.)
    const places = await Promise.all(
      placeIds.map(async (id) => {
        // Replace this with your actual fetch logic
        const res = await fetch(`http://localhost:3000/api/maps/reviews?placeId=${id}`);
        const data = await res.json();
        return {
          id,
          ...data.place, // or whatever structure you want
        };
      })
    );
    // Store or use the places array as needed
    await redis.set('latest-map-markers', JSON.stringify(places));
    return { success: true, message: "Markers stored in Redis" };
  },
});

// Export a getter for the latest markers
export async function getLatestMarkers() {
  const data = await redis.get('latest-map-markers');
  return data ? JSON.parse(data) : [];
}
