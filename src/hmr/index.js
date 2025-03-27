import { watch } from "fs/promises";
import { broadcastHMR } from "../http";
import { generate } from "../ssg";
import { fileURLToPath } from "url";
import path from "path";

export async function startHMR(req, server) {
  const success = server.upgrade(req);
  if (success) {
    // Bun automatically returns a 101 Switching Protocols
    // if the upgrade succeeds
    return undefined;
  }
  return new Response("Web Socket Started", {
    status: 404,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

/**
 * @param { import("../config").AppConfig } AppConfig
 */
export async function watchChanges(config) {
  const baseDir = fileURLToPath(import.meta.url);
  const rootDir = path.dirname(path.dirname(path.dirname(baseDir)));

  console.log(`Watching for changes in ${rootDir}`);
  const watcher = watch(rootDir, { recursive: true });
  for await (const event of watcher) {
    switch (event.eventType) {
      case "rename":
      case "change":
        await generate(config);
        broadcastHMR("reload");
        break;
      default:
        break;
    }
  }
}

export function injectHMR() {
  const script = `
  <script>
    const ws = new WebSocket("ws://localhost:3000/__hmr");
    ws.onmessage = (event) => {
      if (event.data === "reload") {
        window.location.reload();
      }
    };
  </script>
  `;
  return script;
}
