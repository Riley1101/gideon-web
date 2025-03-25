import { readdir, mkdir, rm } from "node:fs/promises";
import { fsRouter, getFile } from "../fs";
import { buildTemplate } from "../template";

const DEFAULT_BUILD_DIR = ".gideon";
const DEFAULT_SITEMAP = "siteMap.json";

async function isDirectory(path) {
  try {
    const stat = await readdir(path);
    return Array.isArray(stat);
  } catch (error) {
    return false;
  }
}

async function createDirectory(path) {
  try {
    const isDir = await isDirectory(path);
    console.log("Creating build directory...");

    if (isDir) {
      await rm(path, { recursive: true, force: true });
      return true;
    }
    await mkdir(DEFAULT_BUILD_DIR);

    return true;
  } catch (error) {
    console.error("Error creating build directory", error);
    return false;
  }
}

async function writeFile(path, content) {
  try {
    await Bun.write(path, content);
  } catch (error) {
    console.error("Error writing file", error);
  }
}

/**
 * @description route bundle
 * @typedef {Object} RouteBundle
 * @property {string} html - Name of the route
 * @property {string} js - Name of the asset
 * @property {string} css - Name of the asset
 *
 * @typedef {Map<string, RouteBundle>} RouteBundleMap
 */
export async function generate() {
  const defaultBuildDir = ".gideon";
  const buildDir = await createDirectory(defaultBuildDir);
  if (!buildDir) {
    console.error("Error creating build directory");
    return;
  }
  const { html, asset } = await fsRouter();
  const siteMap = new Map();

  for (const [name, path] of html) {
    let bundle = {};
    const htmlPath = path.originalPath;
    bundle["html"] = htmlPath;
    const jsPath = `${name}/index.js`;
    if (asset.has(jsPath)) {
      bundle["js"] = jsPath;
    }
    siteMap.set(name, bundle);
  }

  await ssg(siteMap);
}

export async function ssg(siteMap) {
  const ssgMeta = new Map();
  for (const [name, bundle] of siteMap) {
    const dirHash = Bun.hash(name);
    ssgMeta.set(name, dirHash.toString());
    const path = `${DEFAULT_BUILD_DIR}/${dirHash}`;
    console.log(`Generating SSR for route ${name}`);

    const htmlTemplate = bundle["html"];
    const jsTemplate = bundle["js"];

    const html = await getFile(htmlTemplate);
    if (html) {
      const jsPath = jsTemplate ?? "";
      const content = buildTemplate(html, jsPath.replace("routes/", ""));
      await writeFile(`${path}/index.html`, content);
    }
    if (jsTemplate) {
      const jsContent = await getFile(`./${jsTemplate}`);
      await writeFile(`${path}/index.js`, jsContent);
    }
  }

  // write  ssgMeta to json
  const obj = Object.fromEntries(ssgMeta);
  console.log("Saving SSG Meta...");
  await writeFile(
    `${DEFAULT_BUILD_DIR}/${DEFAULT_SITEMAP}`,
    JSON.stringify(obj, null, 2),
  );
}

function buildRoute(requestRoute) {
  switch (requestRoute) {
    case "/":
    case "/index.js":
      return "routes";
    default:
      return `routes${requestRoute}`;
  }
}
export async function readSSGFiles(path) {
  const DEFAULT_META = `${DEFAULT_BUILD_DIR}/${DEFAULT_SITEMAP}`;
  const meta = await Bun.file(DEFAULT_META).json();
  const resolvedPath = buildRoute(path);
  const resolvedDir = meta[resolvedPath];
  if (!resolvedDir) {
    return;
  }
  return {
    html: `${DEFAULT_BUILD_DIR}/${resolvedDir}/index.html`,
    js: `${DEFAULT_BUILD_DIR}/${resolvedDir}/index.js`,
  };
}

/**
 * @param {Request} request
 */
export async function ssgHandler(request) {
  const path = new URL(request.url);
  const isJs = path.pathname.endsWith(".js");

  const pathName = path.pathname;

  const resolvedAssets = await readSSGFiles(pathName);

  if (!resolvedAssets) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (isJs) {
    const js = await getFile(resolvedAssets.js);
    return new Response(js, {
      status: 200,
      headers: {
        "Content-Type": "text/javascript",
      },
    });
  }

  const html = await getFile(resolvedAssets.html);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
