import { Router } from "express";
import cartController from "../dao/controllers/cartController.js";

const router = Router();

router.get("/:cid", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let cart = await cartController.getCart(req, res);
  if (cart) {
    return res.status(200).json({ cart });
  } else {
    return res.status(400).json({ error: "Cart not found." });
  }
});

router.post("/", (req, res) => cartController.addCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cartController.addProduct(req, res));

router.put("/:cid", (req, res) => cartController.addProducts(req, res));

router.delete("/:cid/product/:pid", (req, res) => cartController.deleteProduct(req, res));

router.delete("/:cid", (req, res) => cartController.deleteProducts(req, res));

export default router;
