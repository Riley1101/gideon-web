import { ssgHandler } from "../ssg";
import { startHMR, watchChanges } from "../hmr";

const clients = new Set();

/**
 * @param { import("../config").AppConfig } AppConfig
 */
export async function createServer(config) {
  const port = config.port || 3000;
  watchChanges(config);
  Bun.serve({
    port,
    /**
     * @param {Request} request
     */
    routes: {
      "/favicon.ico": new Response("", {
        headers: {
          "Content-Type": "image/x-icon",
        },
      }),
      "/__hmr": (req, server) => startHMR(req, server),
      "/*": (req) => ssgHandler(req),
    },

    websocket: {
      async open(ws) {
        clients.add(ws);
        ws.send("HMR connected!");
      },
    },
  });
}

export function broadcastHMR(message) {
  for (const client of clients) {
    client.send(message);
  }
}
