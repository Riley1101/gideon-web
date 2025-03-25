import { createServer } from "./src/http";
import { getConfig } from "./src/config";
import { fsRouter } from "./src/fs";

async function main() {
  const defaultPort = 3000;
  const config = await getConfig();
  const fs = await fsRouter();
  await createServer(config, fs);
  console.log("Server is running on http://localhost:3000");
}

await main();
