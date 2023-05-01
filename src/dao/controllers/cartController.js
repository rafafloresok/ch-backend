import { cartsModel } from "../models/carts.model.js";

class CartController {
  async getCarts() {
    try {
      let carts = await cartsModel.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async addCart(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      await cartsModel.create({ alias: req.query.alias });
      return res.status(201).json({ message: "Cart created successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async getCart(req, res) {
    try {
      let cart = await cartsModel.findOne({ _id: req.params.cid }).populate("products.productId");
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
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
      console.log(error);
    }
  }

  async deleteProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { cid, pid } = req.params;
      await cartsModel.updateOne({ _id: cid }, { $pull: { products: { productId: pid } } });
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async addProducts(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { cid } = req.params;
      let { products } = req.body;
      let cart = await cartsModel.findOne({_id: cid});
      if (cart) {
        for (let i = 0; i < products.length; i++) {
          let { productId: pid, quantity: qty } = products[i];
          let productIndex = cart.products.findIndex((item) => item.productId === pid);
          if (productIndex !== -1) {
            await cartsModel.updateOne({ _id: cid, "products.productId": pid }, { $inc: { "products.$.quantity": qty } });
          } else {
            await cartsModel.updateOne({ _id: cid }, { $push: { products: { productId: pid, quantity: qty } } });
          }
        }
        return res.status(200).json({ message: "Products added seccessfully" });
      } else {
        return res.status(400).json({ error: "Cart not found." });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProducts(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { cid } = req.params;
      await cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
      return res.status(200).json({ message: "Products deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }
}

const cartController = new CartController();
export default cartController;
