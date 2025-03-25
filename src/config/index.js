const configFile = "app.config.json";

/**
 * @typedef {Object} AppConfig
 * @property {number} port - Application port number
 * @property {string} baseDir - Application base directory
 * @property {string} routeDir - Application route path
 */

/**
 * @description Get application configuration
 * @returns {Promise<AppConfig>}
 */
export async function getConfig() {
  const c = Bun.file(configFile, { type: "application/json" });
  return await c.json().catch(() => ({}));
}
