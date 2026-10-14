// =========================================================
//  Swagger UI  —  the live API dashboard.
// =========================================================

import { openapiYaml } from './openapi.js';

export function swaggerHtmlPage(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>eCommerce API - Swagger</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.addEventListener('load', function () {
      if (!window.SwaggerUIBundle) {
        console.error('Swagger UI bundle failed to load.');
        return;
      }

      window.SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui'
      });
    });
  </script>
</body>
</html>`;
}

export { openapiYaml };