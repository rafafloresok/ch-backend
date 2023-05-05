import { cartsDao } from "../dao/factory.js";

class CartsApiController {
  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let cart = await cartsDao.getCart(req.params.cid);
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
      let cart = await cartsDao.getCart(cid);
      if (cart) {
        let productIndex = cart.products.findIndex((item) => item.productId._id == pid);
        if (productIndex !== -1) {
          await cartsDao.updateProductQty(cid, pid, qty);
        } else {
          await cartsDao.addProduct(cid, pid, qty);
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
      await cartsDao.deleteProduct(cid, pid);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async deleteProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let { cid } = req.params;
      await cartsDao.deleteProducts(cid);
      return res.status(200).json({ message: "Products deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

const cartsApiController = new CartsApiController();
export default cartsApiController;
