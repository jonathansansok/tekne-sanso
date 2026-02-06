import swaggerJSDoc from "swagger-jsdoc"

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tekne Policies API",
      version: "1.0.0",
    },
  },
  apis: [
    "src/app.ts",
    "src/modules/**/*.routes.ts",
    "src/modules/**/*.controller.ts",
  ],
})
