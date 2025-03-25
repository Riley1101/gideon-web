import { createRequestLogger } from "../logger";
import { notFound, getTemplate, getAsset } from "../template";

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
  const { html, asset } = fs;
  const logger = createRequestLogger(request);
  logger.info("");

  const path = new URL(request.url);
  const isJs = path.pathname.endsWith(".js");
  const isCss = path.pathname.endsWith(".css");
  const isAsset = isJs || isCss;

  if (!isAsset) {
    const route = buildRoute(path.pathname);
    const fsRoute = html.get(route);
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

  if (isAsset) {
    const route = buildRoute(path.pathname);
    const fsRoute = asset.get(route);

    if (!fsRoute) {
      return new Response(notFound(), {
        status: 404,
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    const contents = await getAsset(fsRoute);
    return new Response(contents, {
      status: 200,
      headers: {
        "Content-Type": isJs ? "text/javascript" : "text/css",
      },
    });
  }

  return new Response(notFound(), {
    status: 404,
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
    routes: {
      "/favicon.ico": new Response("", {
        headers: {
          "Content-Type": "image/x-icon",
        },
      }),
      "/*": (req) => fetchHandler(req, fs),
    },
  });
}
