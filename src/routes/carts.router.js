import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import {
  authorizeUser,
  passportCall,
} from "../middlewares/sessions.middleware.js";

const router = Router();

router.get("/:cid", passportCall("jwt"), cartsController.getCart);

router.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.addProduct
);

router.delete(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.deleteProduct
);

router.delete(
  "/:cid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.deleteProducts
);

router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  cartsController.sendOrder
);

export default router;
