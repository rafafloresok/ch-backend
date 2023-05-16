import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import productsApiController from "../controllers/productsApi.controller.js";
import { addProductMid, updateProductMid } from "../middlewares/products.middlewares.js";

const router = Router();

router.get("/mockingproducts", productsApiController.getMockingProducts);

router.get("/:pid", productsApiController.getProduct);

router.get("/", productsApiController.getProducts);

router.post("/", addProductMid, productsApiController.addProduct);

router.put("/:pid", updateProductMid, productsApiController.updateProduct);

router.delete("/:pid", productsApiController.deleteProduct);

export default router;
