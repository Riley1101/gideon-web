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

/**
 * @returns Promise<{{ html: Map<string, RoutePath>, asset: Map<string, RoutePath> }}>
 **/
export async function fsRouter() {
  const routeMap = new Map();
  const assetMap = new Map();

  const appDir = `${baseDir}/${routePath}`;
  const htmlFiles = new Glob(appDir + "/**/*.html");
  const assetFiles = new Glob(appDir + "/**/*.{css,js}");

  for await (const asset of assetFiles.scan(".")) {
    const path = buildPath(asset);
    if (path) {
      const name = path.originalPath.slice(2);
      assetMap.set(name, path);
    }
  }

  for await (const route of htmlFiles.scan(".")) {
    const path = buildPath(route);
    if (path) {
      routeMap.set(path.name, path);
    }
  }

  return {
    html: routeMap,
    asset: assetMap,
  };
}
