import { Router } from "express";
import productManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import { messagesModel } from "../dao/models/messages.model.js";
import { authHomeMid } from "../middlewares/session.middlewares.js";
import { authLoginMid } from "../middlewares/session.middlewares.js";

const router = Router();
const pm = new productManagerDB;
const cm = new CartManagerDB;

router.get("/logup", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("logup")
})

router.get("/login", authLoginMid, async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login")
})

router.get("/products", authHomeMid, async (req, res) => {
  let products = await pm.getProducts(req);
  let carts = await cm.getCarts();
  let user = req.session.user;
  console.log(user);
  res.render("products", { products, carts, user, styles: "products.css" });
});

router.get("/carts/:cid", async (req, res) => {
  let cart = await cm.getCartView(req, res);
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await pm.getProducts(req);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;
