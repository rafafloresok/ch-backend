import { Router } from "express";
import ordersController from "../controllers/orders.controller.js";
import {
  authorizeUser,
  passportCall,
} from "../middlewares/sessions.middleware.js";

const ordersRouter = Router();

ordersRouter.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authorizeUser(["user", "premium", "admin"]),
  ordersController.sendOrder
);

//PUT OTHER PATHS

export default ordersRouter;
