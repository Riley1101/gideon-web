import { injectHMR } from "../hmr";

const defaultHead = `
  <meta charset="UTF-8" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
`;

const baseTemplate = () => {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return `
<html lang="en">
  <--@head-->
  <body>
    <--@body-->
    <--@importmaps-->
    <--@script-->
  </body>
</html>
`;
  }
  return `
<html lang="en">
  <--@head-->
  <body>
    <--@body-->
    <--@importmaps-->
    <--@script-->
    ${injectHMR()}
  </body>
</html>
`;
};

const defaultScript = `
  <script type="module" src="$$path"></script>
`;

export class TemplateBuilder {
  constructor() {
    this.contents = baseTemplate();
  }

  getTemplate() {
    return this.contents;
  }

  withHead(head = defaultHead) {
    this.contents = this.contents.replace("<--@head-->", head);
    return this;
  }

  withBody(body) {
    this.contents = this.contents.replace("<--@body-->", body);
    return this;
  }

  withData(data) {
    if (!data.default) {
      return this;
    }
    const { default: module } = data;
    let tmp = this.contents;
    for (const key in module) {
      tmp = tmp.replace(`@${key}`, module[key]);
    }
    this.contents = tmp;
    return this;
  }

  withScript(script) {
    this.contents = this.contents.replace(
      "<--@script-->",
      script !== "" ? defaultScript.replace("$$path", script) : "",
    );
    return this;
  }

  withImportmaps(importmaps) {
    this.contents = this.contents.replace(
      "<--@importmaps-->",
      importmaps || "",
    );
    return this;
  }

  build() {
    return this.contents;
  }
}

/**
 * @param {import("../fs").RoutePath} route
 */
export async function getAsset(route) {
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
