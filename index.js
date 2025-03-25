import { createServer } from "./src/http";

function main() {
  const port = 3000;
  createServer(port);
  console.log("Server is running on http://localhost:3000");
}

main();
