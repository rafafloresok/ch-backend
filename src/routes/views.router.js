import { Router } from "express";
import { __dirname } from "../helpers/utils.js";
import ProductManager from "../managers/ProductManager.js";
import path from "path";
import { messagesModel } from "../dao/models/messages.model.js";

const router = Router();
const pm = new ProductManager(path.join(__dirname, "../files/products.json"));

router.get("/", async (req, res) => {
  let products = await pm.getProducts(req.query.limit);
  res.render("home", { products, styles: "home.css" });
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await pm.getProducts(req.query.limit);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", async (req, res) => {
  let messages = await messagesModel.find().lean();
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;
