import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import productsApiController from "../controllers/productsApi.controller.js";
import { verifyProductProperties } from "../middlewares/products.middleware.js";
import { passportCall } from "../middlewares/sessions.middleware.js";

const router = Router();

router.get("/:pid", passportCall("jwt"), productsApiController.getProduct);

router.get("/", passportCall("jwt"), productsApiController.getProducts);

router.post("/", passportCall("jwt"), verifyProductProperties, productsApiController.addProduct);

router.put("/:pid", passportCall("jwt"), verifyProductProperties, productsApiController.updateProduct);

router.delete("/:pid", passportCall("jwt"), productsApiController.deleteProduct);

export default router;
