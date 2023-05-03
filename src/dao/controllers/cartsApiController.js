import { cartsModel } from "../models/carts.model.js";

class CartsApiController {
  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let cart = await cartsModel.findOne({ _id: req.params.cid }).populate("products.productId");
      if (cart) {
        return res.status(200).json({ cart });
      } else {
        return res.status(400).json({ error: "Cart not found." });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let { cid, pid } = req.params;
      let { qty } = req.body;
      let cart = await cartsModel.findOne({_id: cid});
      if (cart) {
        let productIndex = cart.products.findIndex((item) => item.productId == pid);
        if (productIndex !== -1) {
          await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $inc: { "products.$.quantity": qty } });
        } else {
          await cartsModel.updateOne({ _id: cid }, { $push: { products: { productId: pid, quantity: qty } } });
        }
        return res.status(201).json({ message: "Product added successfully" });
      } else {
        return res.status(400).json({ error: "Cart not found." });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let { cid, pid } = req.params;
      await cartsModel.updateOne({ _id: cid }, { $pull: { products: { productId: pid } } });
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async deleteProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let { cid } = req.params;
      await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
      return res.status(200).json({ message: "Products deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

const cartsApiController = new CartsApiController();
export default cartsApiController;
