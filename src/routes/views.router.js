import { Router } from "express";
import productsViewController from "../dao/controllers/productsViewController.js";
import cartsViewController from "../dao/controllers/cartsViewController.js";
import messagesController from "../dao/controllers/messagesController.js";
import { authUser } from "../middlewares/auth.middlewares.js";
import { passportCall } from "../utils/utils.js";

const router = Router();

router.get("/logup", (req, res) => {
  if (req.cookies.idToken) return res.redirect("/products");
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("logup", { styles: "logup.css" });
});

router.get("/login", (req, res) => {
  if (req.cookies.idToken) return res.redirect("/products");
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("login", { styles: "login.css" });
});

router.get("/products", passportCall("jwt"), authUser(["user", "admin"]), async (req, res) => {
  let products = await productsViewController.getProducts(req.query);
  let user = req.user;
  res.setHeader("Content-Type", "text/html");
  res.render("products", { products, user, styles: "products.css" });
});

router.get("/carts/:cid", passportCall("jwt"), authUser(["user", "admin"]), async (req, res) => {
  let cart = await cartsViewController.getCart(req.params.cid);
  res.setHeader("Content-Type", "text/html");
  res.render("cart", { cart, styles: "cart.css" });
});

router.get("/realtimeproducts", passportCall("jwt"), authUser(["admin"]), async (req, res) => {
  let products = await productsViewController.getProducts(req.query);
  res.setHeader("Content-Type", "text/html");
  res.render("realTimeProducts", { products, styles: "realTimeProducts.css" });
});

router.get("/chat", passportCall("jwt"), authUser(["user", "admin"]), async (req, res) => {
  let messages = await messagesController.getMessages();
  res.setHeader("Content-Type", "text/html");
  res.render("chat", { messages, styles: "chat.css" });
});

export default router;
