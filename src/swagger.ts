// =========================================================
//  Swagger UI  —  the live API dashboard.
// =========================================================

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

export function openapiYaml(): string {
  return `openapi: 3.0.0
info:
  title: eCommerce API
  version: 1.0.0
  description: Demo eCommerce API — auth plus product CRUD
servers:
  - url: http://localhost:3000
    description: Local dev
tags:
  - name: Health
    description: Server and DB status
  - name: Auth
    description: Register and login
  - name: Products
    description: Product CRUD
paths:
  /:
    get:
      tags: [Health]
      summary: API root
      responses:
        "200": { description: OK }
  /health:
    get:
      tags: [Health]
      summary: Health check
      responses:
        "200": { description: OK }
  /api/auth/register:
    post:
      tags: [Auth]
      summary: Register a new user
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:     { type: string }
                email:    { type: string }
                password: { type: string }
                role:     { type: string }
      responses:
        "200": { description: Registered }
  /api/auth/login:
    post:
      tags: [Auth]
      summary: Login and get a token
      responses:
        "200": { description: Token issued }
  /api/product:
    get:
      tags: [Products]
      summary: List products (paginated, isAuth)
      responses:
        "200": { description: OK }
    post:
      tags: [Products]
      summary: Create product (isAdmin)
      responses:
        "201": { description: Created }
  /api/product/{id}:
    get:
      tags: [Products]
      summary: Get one product (isAuth)
      responses:
        "200": { description: OK }
    put:
      tags: [Products]
      summary: Update product (isAdmin)
      responses:
        "200": { description: Updated }
    delete:
      tags: [Products]
      summary: Remove product, soft delete (isAdmin)
      responses:
        "200": { description: Removed }
`;
}