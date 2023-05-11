import { cartsService } from "../dao/factory.js";

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
}

const cartsApiController = new CartsApiController();
export default cartsApiController;
