export async function getUserPreferences() {
  const res = await fetch(`${process.env.NEON_API_URL}/preferences`);
  if (!res.ok) throw new Error("Failed to fetch preferences");
  return res.json();
}

export async function getExistingRecommendations() {
  const res = await fetch(`${process.env.NEON_API_URL}/recommendations`);
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

export async function addRecommendation(recommendations: any) {
  const res = await fetch(`${process.env.NEON_API_URL}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recommendations }),
  });
  if (!res.ok) throw new Error("Failed to add recommendations");
  return res.json();
}
