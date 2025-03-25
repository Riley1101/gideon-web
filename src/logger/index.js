/**
 * @param {Request} request
 */
export function createRequestLogger(request) {
  const method = request.method;
  const url = request.url;
  return {
    info: (message) => {
      console.info(`[${method}] [${url}] ${message}`);
    },
  };
}
