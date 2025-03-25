import { createRequestLogger } from "../logger";
import { notFound, getTemplate } from "../template";

/**
 * @param {string} requestRoute
 */
function buildRoute(requestRoute) {
  switch (requestRoute) {
    case "/":
      return "routes";
    default:
      return `routes${requestRoute}`;
  }
}

/**
 * @param {Request} request
 * @param {Map<string, import("../fs").RoutePath>} fs
 */
async function fetchHandler(request, fs) {
  const logger = createRequestLogger(request);
  logger.info("");
  if (request.url === "http://localhost:3000/favicon.ico") {
    return new Response(null, {
      status: 204,
    });
  }

  const path = new URL(request.url);
  const route = buildRoute(path.pathname);
  const fsRoute = fs.get(route);

  if (!fsRoute) {
    return new Response(notFound(), {
      status: 404,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  const contents = await getTemplate(fsRoute);
  return new Response(contents, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

/**
 * @param { import("../config").AppConfig } AppConfig
 * @param {Map<string, import("../fs").RoutePath>} fs
 */
export async function createServer(config, fs) {
  const port = config.port || 3000;
  Bun.serve({
    port,
    /**
     * @param {Request} request
     */
    fetch: async (request) => {
      return fetchHandler(request, fs);
    },
  });
}
