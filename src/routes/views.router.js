import { Router } from "express";
import productManagerDB from "../dao/productManagerDB.js";
import { cartsModel } from "../dao/models/carts.model.js";
import { messagesModel } from "../dao/models/messages.model.js";
import passport from "passport";
import { authUser } from "../middlewares/auth.middlewares.js";
import { passportCall } from "../helpers/utils.js";

const router = Router();
const pm = new productManagerDB;

router.get("/logup", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("logup");
});

router.get("/login", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login")
})

router.get("/products", passportCall("jwt"), authUser("user"), async (req, res) => {
  let products = await pm.getProducts(req);
  let user = req.user;
  res.render("products", { products, user, styles: "products.css" });
});

router.get("/carts/:cid", passportCall("jwt"), authUser("user"), async (req, res) => {
  let cart = await cartsModel.findById(req.params.cid).populate("products.productId");
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", passportCall("jwt"), authUser("admin"), async (req, res) => {
  let products = await pm.getProducts(req);
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", passportCall("jwt"), authUser("user"), async (req, res) => {
  let messages = await messagesModel.find();
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;
