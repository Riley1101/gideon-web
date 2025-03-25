import { createServer } from "./src/http";
import { getConfig } from "./src/config";
import { fsRouter } from "./src/fs";
import { generate } from "./src/ssg";

async function main() {
  const config = await getConfig();
  generate();
  const fs = await fsRouter();
  await createServer(config, fs);
  console.log("Server is running on http://localhost:3000\n");
}

await main();
