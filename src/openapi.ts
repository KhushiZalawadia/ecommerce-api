// =========================================================
//  OpenAPI 3.0.0 Schema — the API contract
// =========================================================

export function openapiYaml(): string {
  return `openapi: 3.0.0
info:
  title: eCommerce API
  version: 1.0.0
  description: Demo eCommerce API — auth plus product CRUD
servers:
  - url: http://localhost:3000
    description: Local dev

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

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
        "200":
          description: OK

  /health:
    get:
      tags: [Health]
      summary: Health check
      responses:
        "200":
          description: OK

  /api/auth/register:
    post:
      tags: [Auth]
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, email, password]
              properties:
                name:
                  type: string
                  example: John Doe
                email:
                  type: string
                  format: email
                  example: john@example.com
                password:
                  type: string
                  format: password
                  example: "123456"
                role:
                  type: string
                  enum: [user, admin]
                  example: user
      responses:
        "200":
          description: Registered

  /api/auth/login:
    post:
      tags: [Auth]
      summary: Login and get a token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                  format: email
                  example: john@example.com
                password:
                  type: string
                  format: password
                  example: "123456"
      responses:
        "200":
          description: Token issued

  /api/product:
    get:
      tags: [Products]
      summary: List products (paginated, isAuth)
      security:
        - BearerAuth: []
      parameters:
        - in: query
          name: page
          schema:
            type: integer
            default: 1
        - in: query
          name: limit
          schema:
            type: integer
            default: 10
      responses:
        "200":
          description: OK
        "401":
          description: Unauthorized

    post:
      tags: [Products]
      summary: Create product (isAdmin)
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, description, price, stock]
              properties:
                name:
                  type: string
                  example: Wireless Mouse
                description:
                  type: string
                  example: Ergonomic wireless mouse
                price:
                  type: number
                  format: float
                  example: 29.99
                stock:
                  type: integer
                  example: 25
                image_url:
                  type: string
                  nullable: true
                  example: https://example.com/mouse.jpg
      responses:
        "201":
          description: Created
        "401":
          description: Unauthorized
        "403":
          description: Forbidden

  /api/product/{id}:
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: integer
        description: Product ID

    get:
      tags: [Products]
      summary: Get one product (isAuth)
      security:
        - BearerAuth: []
      responses:
        "200":
          description: OK
        "401":
          description: Unauthorized

    put:
      tags: [Products]
      summary: Update product (isAdmin)
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  example: Updated Mouse
                description:
                  type: string
                  example: Updated description
                price:
                  type: number
                  format: float
                  example: 35.5
                stock:
                  type: integer
                  example: 15
                image_url:
                  type: string
                  nullable: true
                  example: https://example.com/updated-mouse.jpg
      responses:
        "200":
          description: Updated
        "401":
          description: Unauthorized
        "403":
          description: Forbidden

    delete:
      tags: [Products]
      summary: Remove product, soft delete (isAdmin)
      security:
        - BearerAuth: []
      responses:
        "200":
          description: Removed
        "401":
          description: Unauthorized
        "403":
          description: Forbidden
`;
}