import { readdir, mkdir } from "node:fs/promises";
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
    if (!isDir) {
      console.log("Creating build directory...");
      await mkdir(DEFAULT_BUILD_DIR);
      return true;
    }
    return true;
  } catch (error) {
    console.error("Error creating build directory", error);
    return false;
  }
}

async function writeFile(path, content) {
  try {
    console.log(`Writing file to ${path}`);
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

  // write siteMap to json
  // const obj = Object.fromEntries(siteMap);
  // console.log("Writing siteMap to file...");
  // console.log(JSON.stringify(obj, null, 2));
  //
  // await writeFile(
  //   `${DEFAULT_BUILD_DIR}/${DEFAULT_SITEMAP}`,
  //   JSON.stringify(obj, null, 2),
  // );

  await ssg(siteMap);
}

export async function ssg(siteMap) {
  for (const [name, bundle] of siteMap) {
    const dirHash = Bun.hash(name);
    const path = `${DEFAULT_BUILD_DIR}/${dirHash}`;
    const createDir = await createDirectory(path);
    if (!createDir) {
      console.error("Error generating SSR for routel ", name);
      return;
    }

    console.log(`Generating SSR for route ${name}`);
    const htmlTemplate = bundle["html"];
    const html = await getFile(htmlTemplate);
    if (html) {
      const content = buildTemplate(html);
      await writeFile(`${path}/index.html`, content);
    }

    // const js = bundle["js"];
    // if (js) {
    //   console.log(`Generating SSR for asset ${js}`);
    //   const jsContent = await getFile(js);
    //   await writeFile(`${path}/index.js`, jsContent);
    // }
  }
}
