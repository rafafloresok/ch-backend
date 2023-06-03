import { Router } from "express";
import { authorizeUser, passportCall } from "../middlewares/sessions.middleware.js";
import viewsController from "../controllers/views.controller.js";

const router = Router();

router.get("/logup", viewsController.logup);

router.get("/login", viewsController.login);

router.get("/forgotPassword", viewsController.forgotPassword)

router.get("/passwordreset/:email/:token", viewsController.passwordReset)

router.get("/products", passportCall("jwt"), authorizeUser(["user", "premium", "admin"]), viewsController.products);

router.get("/carts/:cid", passportCall("jwt"), authorizeUser(["user", "premium", "admin"]), viewsController.cart);

router.get("/realtimeproducts", passportCall("jwt"), authorizeUser(["premium", "admin"]), viewsController.realTimeProducts);

router.get("/chat", passportCall("jwt"), authorizeUser(["user", "premium", "admin"]), viewsController.chat);

export default router;
