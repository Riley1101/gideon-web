import { Glob } from "bun";

/**
 * @typedef {Object} RoutePath
 * @property {string} originalPath - Original path
 * @property {string} name - Name of the path
 **/

const baseDir = "./";
const routePath = "routes";

function isValidPath(_path) {
  // TODO! to check dynamic slug duplications
  return true;
}

/**
 * @param {string} path
 * @returns {RoutePath | null}
 */
export function buildPath(path) {
  if (!isValidPath(path)) {
    return null;
  }

  let name = path.split("/").slice(1, -1).join("/");

  return {
    originalPath: path,
    name,
  };
}

export async function fsRouter() {
  const appDir = `${baseDir}/${routePath}`;
  const routes = new Glob(appDir + "/**/*.html");
  const routeMap = new Map();
  for await (const route of routes.scan(".")) {
    const path = buildPath(route);
    if (path) {
      routeMap.set(path.name, path);
    }
  }
  return routeMap;
}
