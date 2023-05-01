import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import productController from "../dao/controllers/productController.js";
import { addProductMid, updateProductMid } from "../middlewares/products.middlewares.js";

const router = Router();

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let response = await productController.getProducts(req);
  if (response.status === "success") {
    res.status(200).json(response);
  } else {
    res.status(500).json(response);
  }
});

router.get("/:pid", (req, res) => productController.getProductById(req, res));

router.post("/", addProductMid, (req, res) => productController.addProduct(req, res));

router.put("/:pid", updateProductMid, (req, res) => productController.updateProduct(req, res));

router.delete("/:pid", (req, res) => productController.deleteProduct(req, res));

export default router;
