/*
Working example:

curl "http://localhost:3000/api/maps/reviews?placeId=ChIJqdNaaBVbwokRLTafYrQlZI8"

*/

import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_API_KEY; // Store your API key in .env.local

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId parameter" }, { status: 400 });
  }

  const fields = [
    "name",
    "formatted_address",
    "rating",
    "reviews",
    "geometry/location",
    "business_status",
    "editorial_summary",
  ].join(",");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") {
    return NextResponse.json({ error: data.error_message || "Failed to fetch place details" }, { status: 500 });
  }

  // Fetch photoName from your own API
  let photoName = undefined;
  try {
    // Use absolute URL for local dev or deployment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const photoRes = await fetch(`${baseUrl}/api/maps/photo?placeId=${placeId}`);
    const photoData = await photoRes.json();
    if (photoData.photoName) {
      photoName = photoData.photoName;
    }
  } catch (e) {
    // Optionally log error
    photoName = undefined;
  }

  // Extract reviews and author attributions
  const reviews = data.result.reviews?.map((review: any) => ({
    author: {
      name: review.author_name,
      profileUrl: review.author_url,
      photoUrl: review.profile_photo_url,
    },
    rating: review.rating,
    text: review.text,
    time: review.relative_time_description,
    language: review.language,
  })) || [];

  return NextResponse.json({
    place: {
      name: data.result.name,
      address: data.result.formatted_address,
      rating: data.result.rating,
      lat: data.result.geometry?.location?.lat,
      lng: data.result.geometry?.location?.lng,
      businessStatus: data.result.business_status,
      description: data.result.editorial_summary?.overview,
      reviews,
      photoName,
    },
  });
}
