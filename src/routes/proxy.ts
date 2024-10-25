import type { APIEvent } from "@solidjs/start/server";
import axios from "axios";

export async function GET(e: APIEvent) {
  const url = new URL(e.request.url);

  const proxy_to = url.searchParams.get("url");
  if (!proxy_to) {
    return new Response("url param not found", { status: 400 });
  }
  const response = await axios.get(proxy_to, { responseType: "stream" });
  return new Response(response.data, {
    status: response.status,
  });
}
