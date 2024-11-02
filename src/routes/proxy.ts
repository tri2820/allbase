import type { APIEvent } from "@solidjs/start/server";

export async function GET(e: APIEvent) {
  const url = new URL(e.request.url);
  const proxy_to = url.searchParams.get("url");

  if (!proxy_to) {
    return new Response("url param not found", { status: 400 });
  }

  try {
    // Fetch the proxied URL using the native Fetch API
    const fetchResponse = await fetch(proxy_to);

    if (!fetchResponse.ok) {
      // Handle response errors
      return new Response("Failed to fetch the proxied URL", { status: fetchResponse.status });
    }

    // Create a new Response to forward the fetched data
    const response = new Response(fetchResponse.body, {
      status: fetchResponse.status,
      headers: fetchResponse.headers,
    });

    return response;

  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response("Failed to fetch the proxied URL", { status: 500 });
  }
}
