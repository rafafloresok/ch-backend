import { cartsService, productsService, ticketsService, usersService } from "../dao/factory.js";

class CartsApiController {
  async getCart(req, res) {
    let result = await cartsService.getById(req.params.cid);
    if (result) {
      return res.status(200).send({ status: "success", result });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async addProduct(req, res) {
    let { cid, pid } = req.params;
    let { qty } = req.body;
    let result = (await cartsService.updateProductQty(cid, pid, qty)) || (await cartsService.addProduct(cid, pid, qty));
    if (result) {
      return res.status(201).send({ status: "success", result: "Product added successfully" });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async deleteProduct(req, res) {
    let { cid, pid } = req.params;
    let result = await cartsService.deleteProduct(cid, pid);
    if (result) {
      return res.status(200).send({ status: "success", result: "Product deleted successfully" });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async deleteProducts(req, res) {
    let { cid } = req.params;
    let result = await cartsService.deleteProducts(cid);
    if (result) {
      return res.status(200).send({ status: "success", result: "Products deleted successfully" });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async sendOrder(req, res) {
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
    cart.products.forEach(async function(cartProduct) {
      await productsService.updateStockById(cartProduct.productId._id, cartProduct.quantity * -1);
    });
    let result = await ticketsService.send(order);
    if (result) {
      await usersService.updateByEmail(req.body.email, {lastOrder: nextOrder});
      await cartsService.deleteProducts(cart._id);
      return res.status(201).send({ status: "success", result: "Products deleted successfully" });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }
}

const cartsApiController = new CartsApiController();
export default cartsApiController;
