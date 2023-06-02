import { cartsService, productsService, ticketsService, usersService } from "../dao/factory.js";
import { ServerError, instanceOfCustomError } from "../utils/errors.utils.js";
import { createCode } from "../utils/utils.js";

class CartsApiController {
  async getCart(req, res) {
    try {
      let result = await cartsService.getById(req.params.cid);
      if (!result) throw new ServerError("error trying to get cart");
      return res.status(200).send({ status: "success", result });
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async addProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let { qty } = req.body;
      req.logger.debug(cid, pid, qty)
      let result = (await cartsService.updateProductQty(cid, pid, qty)) || (await cartsService.addProduct(cid, pid, qty));
      if (!result) throw new ServerError("error trying to add product");
      return res.status(201).send({ status: "success", result: "Product add success" });
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let result = await cartsService.deleteProduct(cid, pid);
      if (!result) throw new ServerError("error trying to delete product");
      return res.status(200).send({ status: "success", result: "Product delete success" });
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async deleteProducts(req, res) {
    try {
      let { cid } = req.params;
      let result = await cartsService.deleteProducts(cid);
      if (!result) throw new ServerError("error trying to delete products");
      return res.status(200).send({ status: "success", result: "Products delete success" });
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async sendOrder(req, res) {
    try {
      let cart = await cartsService.getById(req.params.cid);
      let outOfStock = [];
      cart.products.forEach(async (cartProduct) => {
        let dbProduct = await productsService.getById(cartProduct.productId._id);
        if (cartProduct.qty > dbProduct.stock) {
          outOfStock.push(cartProduct.productId._id);
        }
      });
      if (outOfStock.length) return res.status(200).send({ status: "out of stock", result: outOfStock });
      //let nextOrder = req.body.lastOrder + 1;
      let orderCode = createCode();
      let order = {
        //code: `${req.body.email}-${nextOrder}`,
        code: `${req.user.email}-${orderCode}`,//new
        amount: cart.amount,
        //purchaser: req.body.email,
        purchaser: req.user.email,//new
        products: cart.products,
      };
      cart.products.forEach(async (cartProduct) => {
        await productsService.updateStockById(cartProduct.productId._id, cartProduct.quantity * -1);
      });
      let result = await ticketsService.send(order);
      if (!result) throw new ServerError("error trying to send order");
      //await usersService.updateByEmail(req.body.email, { lastOrder: nextOrder });
      await cartsService.deleteProducts(cart._id);
      return res.status(201).send({ status: "success", result: orderCode });
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }
}

const cartsApiController = new CartsApiController();
export default cartsApiController;
