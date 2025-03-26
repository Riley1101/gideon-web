import { ssgHandler } from "../ssg";

/**
 * @param { import("../config").AppConfig } AppConfig
 */
export async function createServer(config) {
  const port = config.port || 3000;
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
      "/*": (req) => ssgHandler(req),
    },
  });
}
