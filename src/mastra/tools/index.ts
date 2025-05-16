import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

  const response = await fetch(weatherUrl);
  const data = (await response.json()) as WeatherResponse;

  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
};

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return conditions[code] || 'Unknown';
}

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
        name: z.string(),
        address: z.string(),
        rating: z.number().optional(),
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
          name: place.displayName?.text || '',
          address: place.formattedAddress || '',
          rating: place.rating,
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
        name: detailsData.result.name,
        address: detailsData.result.formatted_address,
        rating: detailsData.result.rating,
        reviews,
      };
    })
  );

  return { places: results };
};
