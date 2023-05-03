import { productsModel } from "../models/products.model.js";

class ProductsApiController {
  async getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      console.log(req.query);
      let products = await productsModel.find({},{},req.query);
      return res.status(200).json({ products });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let product = await productsModel.findOne({ _id: req.params.pid });
      if (product) {
        return res.status(200).json({ product });
      } else {
        return res.status(400).json({ error: "Product not found." });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async addProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let product = await productsModel.findOne({ code: code });
      if (product) {
        return res.status(400).json({ error: "Product not added. Error: Code already exists." });
      } else {
        await productsModel.create({
          title: title,
          description: description,
          code: code,
          price: price,
          status: status,
          stock: stock,
          category: category,
          thumbnails: thumbnails,
        });
        return res.status(201).json({ message: `Product added successfully` });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async updateProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let product = await productsModel.findOne({ _id: req.params.pid });
      if (product) {
        status === false && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { status: false } }));
        status === true && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { status: true } }));
        title && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { title: title } }));
        description && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { description: description } }));
        code && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { code: code } }));
        price && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { price: price } }));
        stock && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { stock: stock } }));
        category && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { category: category } }));
        thumbnails && (await productsModel.updateOne({ _id: req.params.pid }, { $set: { thumbnails: thumbnails } }));
        return res.status(201).json({ message: "Product updated successfully" });
      } else {
        return res.status(400).json({ error: "Product not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async deleteProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let product = await productsModel.findOne({ _id: req.params.pid });
      if (product) {
        await productsModel.deleteOne({ _id: req.params.pid });
        return res.status(201).json({ message: `Product deleted successfully` });
      } else {
        return res.status(400).json({ error: "Product not found." });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async deleteProductSocket(id) {
    try {
      let product = await productsModel.findOne({ _id: id });
      if (product) {
        await productsModel.deleteOne({ _id: id });
        return {
          success: true,
          message: "Product deleted successfully",
        };
      } else {
        return {
          success: false,
          message: "Product not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Server error",
      };
    }
  }

  async addProductSocket(product) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails } = product;
      let productDB = await productsModel.findOne({ code: code });
      if (productDB) {
        return {
          success: false,
          message: `Product not added. Errors:${productExists ? " Product already exists." : ""}${
            aFieldIsEmpty ? " Must complete all required fields." : ""
          }`,
        };
      } else {
        price = Number(price);
        stock = Number(stock);
        status === "false" ? (status = false) : (status = true);
        await productsModel.create({
          title: title,
          description: description,
          code: code,
          price: price,
          status: status,
          stock: stock,
          category: category,
          thumbnails: thumbnails,
        });
        return {
          success: true,
          message: "Product added successfully",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Server error",
      };
    }
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;
