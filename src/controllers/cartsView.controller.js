import { cartsService } from "../dao/factory.js";
import { logger } from "../utils/logger.js";

class CartsViewController {
  async getCart(cartId) {
    let result = await cartsService.getById(cartId);
    if (result) {
      return result;
    } else {
      logger.debug("error trying to get cart");
      return {
        status: "error",
        error: "error trying to get cart",
      };
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;
