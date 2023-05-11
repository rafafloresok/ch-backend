import { cartsService } from "../dao/factory.js";

class CartsViewController {
  async getCart(cartId) {
    let result = await cartsService.getById(cartId);
    if (result) {
      return result;
    } else {
      return {
        status: "error",
        error: "Something went wrong, try again later",
      };
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;
