const options = {
    openapi: "OpenAPI 3",
    language: "es-MX",
    disableLogs: false,
    autoHeaders: false,
    autoQuery: false,
    autoBody: false,
  };
  const generateSwagger = require("swagger-autogen")();
  
  const swaggerDocument = {
    info: {
      version: "1.0.0",
      title: "Apis ANAM Mesa Central",
      description: "API para integración de proveedores con la mesa central, Nota: Todas las fechas estan en la zona horaria +00:00 (Etc/GMT) es necesario convertir a tu zona horaria local"
    },
    host: "apimc.anam.gob.mx:3007",
    basePath: "/",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {},
    definitions: {
      todoResponse: {
        success: true,
        message: "Success",
        JsonData: [{idTicket:1, solicitante: "Nombre"}],
        count: 1
      },
      "errorResponse.400": {
        success: false,
        message: "Error en el consumo, valide la documentación.",
      },
      "errorResponse.401": {
        code: 401,
        message: "Authentication failed or user lacks proper authorization.",
      },
      "errorResponse.403": {
        code: 403,
        message: "You do not have permission to access this resource.",
      },
      "errorResponse.404": {
        code: "404",
        message: "The requested resource could not be found on the server.",
      },
      "errorResponse.500": {
        code: 500,
        message:
        "An unexpected error occurred on the server. Please try again later.",
      },
    },
  };
  const swaggerFile= "./docs/swagger.json";
  const apiRouteFile= ["./src/routes/web.js"];
  generateSwagger(swaggerFile, apiRouteFile, swaggerDocument);