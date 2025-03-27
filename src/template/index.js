import { createLanguageService } from "typescript";

const defaultHead = `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
`;

const baseTemplate = `
<html lang="en">
  <--@head-->
  <body>
    <--@body-->
    <--@script-->
    <--@importmaps-->
  </body>
</html>
`;

const defaultScript = `
  <script type="module" src="$$path"></script>
`;

export class TemplateBuilder {
  constructor(content) {
    this.contents = content || "";
  }

  getTemplate() {
    return this.contents;
  }

  withHead(head) {
    this.contents = baseTemplate.replace("<--@head-->", head);
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
    this.contents = this.contents.replace("<--@importmaps-->", importmaps);
    return this;
  }

  build() {
    return this.contents;
  }
}

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
