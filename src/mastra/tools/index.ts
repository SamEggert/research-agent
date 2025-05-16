import { createTool } from '@mastra/core/tools';
import { z } from 'zod';


export const placesWithReviewsTool = createTool({
  id: 'get-places-with-reviews',
  description: 'Get a list of places and their reviews for a given text query (e.g., "pizza near New York")',
  inputSchema: z.object({
    textQuery: z.string().describe('A search query, e.g., "pizza near New York"'),
    maxResults: z.number().min(1).max(10).default(5).optional(),
  }),
  outputSchema: z.object({
    places: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
        rating: z.number().optional(),
        businessStatus: z.string().optional(),
        description: z.string().optional(),
        location: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        reviews: z.array(
          z.object({
            author: z.object({
              name: z.string(),
              profileUrl: z.string().optional(),
              photoUrl: z.string().optional(),
            }),
            rating: z.number(),
            text: z.string(),
            time: z.string(),
            language: z.string().optional(),
          })
        ).optional(),
      })
    ),
  }),
  execute: async ({ context }) => {
    return await getPlacesWithReviews(context.textQuery, context.maxResults);
  },
});

const getPlacesWithReviews = async (textQuery: string, maxResults: number = 5) => {
  console.log('getPlacesWithReviews', textQuery, maxResults);
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not set');

  // 1. Search for places
  const placesRes = await fetch('https://places.googleapis.com/v1/places:searchText?key=' + GOOGLE_API_KEY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.formattedAddress,places.rating',
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: maxResults,
      languageCode: 'en',
      regionCode: 'us',
    }),
  });
  const placesData = await placesRes.json();
  if (!placesData.places || !Array.isArray(placesData.places)) {
    throw new Error('No places found');
  }

  // 2. For each place, get reviews
  const results = await Promise.all(
    placesData.places.slice(0, maxResults).map(async (place: any) => {
      const placeId = place.id;
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,reviews&key=${GOOGLE_API_KEY}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();
      if (detailsData.status !== 'OK') {
        return {
          id: place.id,
          name: place.displayName?.text || '',
          address: place.formattedAddress || '',
          rating: place.rating,
          businessStatus: place.businessStatus,
          description: place.editorial_summary?.overview,
          location: {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
          },
          lat: place.location.latitude,
          lng: place.location.longitude,
          reviews: [],
        };
      }
      const reviews = (detailsData.result.reviews || []).map((review: any) => ({
        author: {
          name: review.author_name,
          profileUrl: review.author_url,
          photoUrl: review.profile_photo_url,
        },
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
        language: review.language,
      }));
      return {
        id: place.id,
        name: detailsData.result.name,
        address: detailsData.result.formatted_address,
        rating: detailsData.result.rating,
        businessStatus: place.businessStatus,
        description: detailsData.result.editorial_summary?.overview,
        location: {
          latitude: place.location.latitude,
          longitude: place.location.longitude,
        },
        lat: place.location.latitude,
        lng: place.location.longitude,
        reviews,
      };
    })
  );

  return { places: results };
};

export * from './showMapMarkers';
