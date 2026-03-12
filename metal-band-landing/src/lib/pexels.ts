export async function fetchPexelsVideo(query: string, orientation = 'landscape') {
  try {
    const response = await fetch(`/api/pexels?type=video&query=${encodeURIComponent(query)}&orientation=${orientation}`);
    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error("Error fetching Pexels video:", error);
    return null;
  }
}

export async function fetchPexelsImage(query: string, orientation = 'landscape') {
  try {
    const response = await fetch(`/api/pexels?type=image&query=${encodeURIComponent(query)}&orientation=${orientation}`);
    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error("Error fetching Pexels image:", error);
    return null;
  }
}
