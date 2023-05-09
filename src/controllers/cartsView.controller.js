import { cartsService } from "../dao/factory.js";

class CartsViewController {
  async getCart(cartId) {
    try {
      let cart = await cartsService.getById(cartId);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;
