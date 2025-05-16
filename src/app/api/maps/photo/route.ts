import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(req: NextRequest) {
    /* log the request */
    console.log("Request received");
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId parameter" }, { status: 400 });
  }

  // New Places API endpoint
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,photos&key=${GOOGLE_PLACES_API_KEY}`;

  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": "id,displayName,photos",
    },
  });
  const data = await res.json();

  // Debug: log the full Google Places API response
  console.log("[PHOTO API] Google Places API response:", JSON.stringify(data, null, 2));

  if (!data.photos || !data.photos.length) {
    console.log("[PHOTO API] No photo found for this place");
    return NextResponse.json({ error: "No photo found for this place" }, { status: 404 });
  }

  const response = {
    photoName: data.photos[0].name, // e.g. "places/PLACE_ID/photos/PHOTO_RESOURCE"
    widthPx: data.photos[0].widthPx,
    heightPx: data.photos[0].heightPx,
    authorAttributions: data.photos[0].authorAttributions,
  };

  // Debug: log the final response
  console.log("[PHOTO API] Response to client:", JSON.stringify(response, null, 2));

  return NextResponse.json(response);
}
