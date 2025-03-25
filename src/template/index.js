/**
 * @param {import("../fs").RoutePath} route
 */
export async function getTemplate(route) {
  const contents = await Bun.file(route.originalPath).text();
  return contents;
}

export function notFound() {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Not Found</title>
  </head>
  <body>
    <h1>404 not found</h1>
  </body>
</html>
`;
}
