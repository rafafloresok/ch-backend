import {
  cartsService,
  productsService,
  ticketsService,
} from "../dao/factory.js";
import { ServerError, handleCaughtError } from "../utils/errors.utils.js";
import { createCode } from "../utils/utils.js";

class CartsController {
  async getCart(req, res) {
    try {
      let result = await cartsService.getById(req.params.cid);
      if (!result) throw new ServerError("error trying to get cart");
      return res.status(200).json({ status: "success", result });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async addProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let { qty } = req.body;
      let result =
        (await cartsService.updateProductQty(cid, pid, qty)) ||
        (await cartsService.addProduct(cid, pid, qty));
      if (!result) throw new ServerError("error trying to add product");
      return res
        .status(201)
        .json({ status: "success", result: "Product add success" });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async deleteProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let result = await cartsService.deleteProduct(cid, pid);
      if (!result) throw new ServerError("error trying to delete product");
      return res
        .status(200)
        .json({ status: "success", result: "Product delete success" });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async deleteProducts(req, res) {
    try {
      let { cid } = req.params;
      let result = await cartsService.deleteProducts(cid);
      if (!result) throw new ServerError("error trying to delete products");
      return res
        .status(200)
        .json({ status: "success", result: "Products delete success" });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }

  async sendOrder(req, res) {
    try {
      let cart = await cartsService.getById(req.params.cid);
      let outOfStock = [];
      cart.products.forEach(async (cartProduct) => {
        let dbProduct = await productsService.getById(
          cartProduct.productId._id
        );
        if (cartProduct.qty > dbProduct.stock) {
          outOfStock.push(cartProduct.productId._id);
        }
      });
      if (outOfStock.length)
        return res
          .status(200)
          .json({ status: "out of stock", result: outOfStock });
      let orderCode = createCode();
      let order = {
        code: `${req.user.email}-${orderCode}`,
        amount: cart.amount,
        purchaser: req.user.email,
        products: cart.products,
      };
      cart.products.forEach(async (cartProduct) => {
        await productsService.updateStockById(
          cartProduct.productId._id,
          cartProduct.quantity * -1
        );
      });
      let result = await ticketsService.send(order);
      if (!result) throw new ServerError("error trying to send order");
      await cartsService.deleteProducts(cart._id);
      return res.status(201).json({ status: "success", result: orderCode });
    } catch (error) {
      handleCaughtError(res, error);
    }
  }
}

const cartsController = new CartsController();
export default cartsController;
