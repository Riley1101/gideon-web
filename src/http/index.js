import { fsRouter } from "../fs";

/**
 * @param {Request} request
 */
async function fetchHandler(request) {
  if (request.url === "http://localhost:3000/favicon.ico") {
    return new Response(null, {
      status: 204,
    });
  }

  const fs = await fsRouter();

  return new Response("File, World!", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

/**
 * @param { number } port
 */
export function createServer(port) {
  Bun.serve({
    port,
    /**
     * @param {Request} request
     */
    fetch: fetchHandler,
  });
}
