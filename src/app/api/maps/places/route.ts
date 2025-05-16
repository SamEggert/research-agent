/* Working example
based on: https://developers.google.com/maps/documentation/javascript/place-search

curl -X POST "http://localhost:3000/api/maps/places" \
  -H "Content-Type: application/json" \
  -d '{
    "textQuery": "pizza near New York",
    "fields": [
      "places.id",
      "places.displayName",
      "places.location",
      "places.businessStatus"
    ],
    "includedType": "restaurant",
    "locationBias": {
      "circle": {
        "center": {
          "latitude": 40.7128,
          "longitude": -74.0060
        },
        "radius": 5000
      }
    },
    "language": "en-US",
    "maxResultCount": 8,
    "minRating": 3.2,
    "region": "us"
  }'
  
*/


import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Set this in your .env.local

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      textQuery,
      fields = ['places.id', 'places.displayName', 'places.location', 'places.businessStatus'],
      includedType,
      locationBias,
      isOpenNow,
      language = 'en-US',
      maxResultCount = 8,
      minRating,
      region = 'us',
      useStrictTypeFiltering = false,
    } = body;

    if (!textQuery) {
      return NextResponse.json({ error: 'Missing textQuery' }, { status: 400 });
    }

    const requestBody: any = {
      textQuery,
      includedType,
      locationBias: {
        circle: {
          center: {
            latitude: 40.7128,
            longitude: -74.0060
          },
          radius: 5000
        }
      },
      maxResultCount,
      minRating,
    };

    // Transform fields for REST API
    if (language) requestBody.languageCode = language;
    if (region) requestBody.regionCode = region;

    // Remove undefined values
    Object.keys(requestBody).forEach(
      (key) => requestBody[key] === undefined && delete requestBody[key]
    );

    const response = await fetch(`${GOOGLE_PLACES_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': fields.join(','),
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Google Places API error' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
