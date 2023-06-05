import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "../utils/utils.js";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce project - Backend Course - Coderhouse",
      version: "1.0.0",
      description: "Comprehensive application documentation",
    },
  },
  apis: [path.join(__dirname, "../docs/*.yaml")],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);
export default swaggerSpecs;
