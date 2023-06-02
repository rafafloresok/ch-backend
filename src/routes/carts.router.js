import { Router } from "express";
import cartsApiController from "../controllers/cartsApi.controller.js";
import { passportCall } from "../middlewares/sessions.middleware.js";

const router = Router();

router.get("/:cid", passportCall("jwt"), cartsApiController.getCart);

router.post("/:cid/product/:pid", passportCall("jwt"), cartsApiController.addProduct);

router.delete("/:cid/product/:pid", passportCall("jwt"), cartsApiController.deleteProduct);

router.delete("/:cid", passportCall("jwt"), cartsApiController.deleteProducts);

router.post("/:cid/purchase", passportCall("jwt"), cartsApiController.sendOrder);

export default router;
