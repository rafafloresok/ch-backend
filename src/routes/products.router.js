import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import ProductManager from "../managers/ProductManager.js";
import { addProductMid, updateProductMid } from "../middlewares/products.middlewares.js";
import path from "path";

const router = Router();
const pm = new ProductManager(path.join(__dirname, "../files/products.json"));

router.get("/", async (req, res) => {
  let products = await pm.getProducts(req.query.limit);
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ products });
});

router.get("/:pid", (req, res) => pm.getProductById(req, res));

router.post("/", addProductMid, (req, res) => pm.addProduct(req, res));

router.put("/:pid", updateProductMid, (req, res) => pm.updateProduct(req, res));

router.delete("/:pid", (req, res) => pm.deleteProduct(req, res));

export default router;
