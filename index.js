import { createServer } from "./src/http";
import { fsRouter } from "./src/fs";
import { generate, createBuildDir } from "./src/ssg";
import { getConfig } from "./src/config";

async function main() {
  const config = await getConfig();
  await createBuildDir();
  await generate(config);
  const fs = await fsRouter();
  await createServer(config, fs);
  console.log("Server is running on http://localhost:3000\n");
}

main();
