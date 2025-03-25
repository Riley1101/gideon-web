import { readdir, mkdir } from "node:fs/promises";
import { fsRouter } from "../fs";

const buildDir = ".gideon";

async function isDirectory(path) {
  try {
    const stat = await readdir(path);
    return Array.isArray(stat);
  } catch (error) {
    return false;
  }
}

async function createBuildDir() {
  try {
    const isDir = await isDirectory(buildDir);
    if (!isDir) {
      console.log("Creating build directory...");
      await mkdir(".gideon");
      return true;
    }
    return true;
  } catch (error) {
    console.error("Error creating build directory", error);
    return false;
  }
}

export async function generate() {
  console.log("Generating static site...");
  const buildDir = await createBuildDir();
  if (!buildDir) {
    console.error("Error creating build directory");
    return;
  }
  const { html, js } = await fsRouter();
  console.log(html);
}
