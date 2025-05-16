export async function getUserPreferences(userId: string) {
  const res = await fetch(`${process.env.NEON_API_URL}/preferences?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch preferences");
  return res.json();
}

export async function getExistingRecommendations(userId: string) {
  const res = await fetch(`${process.env.NEON_API_URL}/recommendations?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

export async function addRecommendation(userId: string, recommendations: any) {
  const res = await fetch(`${process.env.NEON_API_URL}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, recommendations }),
  });
  if (!res.ok) throw new Error("Failed to add recommendations");
  return res.json();
}
