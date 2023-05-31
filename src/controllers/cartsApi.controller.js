import { cartsService, productsService, ticketsService, usersService } from "../dao/factory.js";
import { ServerError, instanceOfCustomError } from "../utils/errors.utils.js";

class CartsApiController {
  async getCart(req, res) {
    try {
      let result = await cartsService.getById(req.params.cid);
      if (result) {
        return res.status(200).send({ status: "success", result });
      } else {
        throw new ServerError("error trying to get cart");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async addProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let { qty } = req.body;
      let result = (await cartsService.updateProductQty(cid, pid, qty)) || (await cartsService.addProduct(cid, pid, qty));
      if (result) {
        return res.status(201).send({ status: "success", result: "Product add success" });
      } else {
        throw new ServerError("error trying to add product");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      let { cid, pid } = req.params;
      let result = await cartsService.deleteProduct(cid, pid);
      if (result) {
        return res.status(200).send({ status: "success", result: "Product delete success" });
      } else {
        throw new ServerError("error trying to delete product");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async deleteProducts(req, res) {
    try {
      let { cid } = req.params;
      let result = await cartsService.deleteProducts(cid);
      if (result) {
        return res.status(200).send({ status: "success", result: "Products delete success" });
      } else {
        throw new ServerError("error trying to delete products");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
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
      if (outOfStock.length) {
        return res.status(200).send({ status: "out of stock", outOfStock });
      }
      let nextOrder = req.body.lastOrder + 1;
      let order = {
        code: `${req.body.email}-${nextOrder}`,
        amount: cart.amount,
        purchaser: req.body.email,
        products: cart.products,
      };
      cart.products.forEach(async function (cartProduct) {
        await productsService.updateStockById(cartProduct.productId._id, cartProduct.quantity * -1);
      });
      let result = await ticketsService.send(order);
      if (result) {
        await usersService.updateByEmail(req.body.email, { lastOrder: nextOrder });
        await cartsService.deleteProducts(cart._id);
        return res.status(201).send({ status: "success", result: "Order send success" });
      } else {
        throw new ServerError("error trying to send order");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }
}

const cartsApiController = new CartsApiController();
export default cartsApiController;
