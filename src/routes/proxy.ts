import type { APIEvent } from "@solidjs/start/server";
import axios from "axios";

export async function GET(e: APIEvent) {
  const url = new URL(e.request.url);

  const proxy_to = url.searchParams.get("url");
  if (!proxy_to) {
    return new Response("url param not found", { status: 400 });
  }

  try {
    // Make the request with axios and receive the streamed response
    const response = await axios.get(proxy_to, { responseType: "stream" });

    // Create a readable stream to pipe the axios response data
    const stream = new ReadableStream({
      start(controller) {
        response.data.on("data", (chunk: any) => {
          controller.enqueue(chunk);
        });

        response.data.on("end", () => {
          controller.close();
        });

        response.data.on("error", (err: any) => {
          console.error("Stream error:", err);
          controller.error(err);
        });
      },
    });

    return new Response(stream, {
      status: response.status,
      headers: { "Content-Type": response.headers["content-type"] || "application/octet-stream" },
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response("Failed to fetch the proxied URL", { status: 500 });
  }
}
