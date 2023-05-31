import { cartsService } from "../dao/factory.js";

class CartsViewController {
  async getCart(cartId) {
    try {
      let result = await cartsService.getById(cartId);
      if (result) {
        return result;
      } else {
        return { status: "error", error: "error trying to get cart" };
      }
    } catch (error) {
      return { status: "error", error: "error trying to get cart" };
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;
