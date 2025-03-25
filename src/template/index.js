const defaultHead = `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
`;

const baseTemplate = `
<html lang="en">
  <--@head-->
  <--@body-->
  <--@script-->
  <--@importmaps-->
</html>
`;

const defaultScript = `
  <script type="module" src="$$path"></script>
`;

export function buildTemplate(
  body,
  scripts = "",
  head = defaultHead,
  importmaps = "",
) {
  return baseTemplate
    .replace("<--@head-->", head)
    .replace(
      "<--@script-->",
      scripts !== "" ? defaultScript.replace("$$path", scripts) : "",
    )
    .replace("<--@body-->", body)
    .replace("<--@importmaps-->", importmaps);
}

/**
 * @param {import("../fs").RoutePath} route
 */
export async function getTemplate(route) {
  const contents = await Bun.file(route.originalPath).text();
  return buildTemplate(contents);
}

/**
 * @param {import("../fs").RoutePath} route
 */
export async function getAsset(route) {
  const contents = await Bun.file(route.originalPath).text();
  return contents;
}

/**
 * @param {import("../fs").RoutePath} route
 */
export async function getApp(route) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App</title>
  </head>
  <body>
    <h1>
      ${route.name}
    </h1>
  </body>
</html>
  `;
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
