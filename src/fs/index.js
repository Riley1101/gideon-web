import { Glob } from "bun";

const routePath = "./routes";

function isValidPath(_path) {
  // TODO! to check dynamic slug duplications
  return true;
}

/**
 * @param {string} path
 */
export function buildPath(path) {
  if (!isValidPath(path)) {
    return null;
  }

  let name = path.split("/").slice(0, -1).join("/");

  return {
    originalPath: path,
    name,
  };
}

export async function fsRouter() {
  const routes = new Glob(routePath + "/**/*.html");
  const routeMap = new Map();
  for await (const route of routes.scan(".")) {
    const path = buildPath(route);
    if (path) {
      routeMap.set(path.name, path);
    }
  }
  return routeMap;
}
