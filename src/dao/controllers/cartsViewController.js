import { cartsModel } from "../models/carts.model.js";

class CartsViewController {
  async getCart(cid) {
    try {
      let cart = await cartsModel.findOne({ _id: cid }).populate("products.productId");
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
}

const cartsViewController = new CartsViewController();
export default cartsViewController;
