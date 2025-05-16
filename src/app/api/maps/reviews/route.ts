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
  ].join(",");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") {
    return NextResponse.json({ error: data.error_message || "Failed to fetch place details" }, { status: 500 });
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
      reviews,
    },
  });
}
