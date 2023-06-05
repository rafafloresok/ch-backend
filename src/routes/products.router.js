import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import productsController from "../controllers/products.controller.js";
import { verifyProductProperties } from "../middlewares/products.middleware.js";
import {
  authorizeUser,
  passportCall,
} from "../middlewares/sessions.middleware.js";
import { imgUploader } from "../utils/multer.utils.js";

const router = Router();

router.get(
  "/:pid",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  productsController.getProduct
);

router.get(
  "/",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  productsController.getProducts
);

router.post(
  "/",
  passportCall("jwt"),
  authorizeUser(["premium", "admin"]),
  imgUploader.single("image"),
  verifyProductProperties,
  productsController.addProduct
);

router.put(
  "/:pid",
  passportCall("jwt"),
  authorizeUser(["premium", "admin"]),
  imgUploader.single("image"),
  verifyProductProperties,
  productsController.updateProduct
);

router.delete(
  "/:pid",
  passportCall("jwt"),
  authorizeUser(["premium", "admin"]),
  productsController.deleteProduct
);

export default router;
