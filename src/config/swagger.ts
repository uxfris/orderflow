import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Order API",
      version: "1.0.0",
      description: "REST API Documentation",
    },

    servers: [
      {
        url: "http://localhost:3001",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
        // bearerAuth: {
        //   type: "http",
        //   scheme: "bearer",
        //   bearerFormat: "JWT",
        // },
      },

      schemas: {
        Product: {
          type: "object",

          properties: {
            id: {
              type: "integer",
            },

            name: {
              type: "string",
            },

            price: {
              type: "number",
            },

            stock: {
              type: "integer",
            },
          },
        },

        CreateProductRequest: {
          type: "object",

          required: ["name", "price", "stock"],

          properties: {
            name: {
              type: "string",
            },

            price: {
              type: "number",
              minimum: 0,
            },

            stock: {
              type: "integer",
              minimum: 0,
            },
          },
        },

        ErrorResponse: {
          type: "object",

          properties: {
            success: {
              type: "boolean",
            },

            message: {
              type: "string",
            },
          },
        },
      },
    },

    security: [
      {
        cookieAuth: [],
        // bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
};

export default swaggerJsdoc(options);
