import { productsService } from "../dao/factory.js";
import { createFakeProduct } from "../utils/utils.js";

class ProductsApiController {
  async getProducts(req, res) {
    let result = await productsService.getPaginated(req.query);
    if (result) {
      return res.status(200).send({ status: "success", result });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async getProduct(req, res) {
    let result = await productsService.getById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "success", result });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async addProduct(req, res) {
    let codeExists = await productsService.getByCode(req.body.code);
    if (codeExists) {
      return res.status(400).send({ status: "error", error: "Product not added. Code already exists" });
    }
    let result = await productsService.create(req.body);
    if (result) {
      return res.status(201).send({ status: "success", result: "Product added successfully" });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async updateProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let productExists = await productsService.getById(req.params.pid);
    if (productExists) {
      let update = {};
      status === false && (update.status = status);
      status === true && (update.status = status);
      title && (update.title = title);
      description && (update.description = description);
      code && (update.code = code);
      price && (update.price = price);
      stock && (update.stock = stock);
      category && (update.category = category);
      thumbnails && (update.thumbnails = thumbnails);
      let result = await productsService.updateById(req.params.pid, update);
      if (result) {
        return res.status(200).send({ status: "success", result: "Product updated successfully" });
      } else {
        return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
      }
    } else {
      return res.status(400).send({ status: "error", error: "Product not found" });
    }
  }

  async deleteProduct(req, res) {
    let result = await productsService.deleteById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "success", result: `Product deleted successfully` });
    } else {
      return res.status(500).send({ status: "error", error: "Something went wrong, try again later" });
    }
  }

  async deleteProductSocket(productId) {
    try {
      let product = await productsService.deleteById(productId);
      if (product) {
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

  async addProductSocket(productData) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails } = productData;
      let emptyField = !(title && description && code && price && stock && category);
      if (emptyField) {
        return {
          success: false,
          message: "Product not added. Error: must complete all required fields",
        };
      }
      let productExists = await productsService.getByCode(code);
      if (productExists) {
        return {
          success: false,
          message: "Product not added. Error: Product already exists",
        };
      }
      price = Number(price);
      stock = Number(stock);
      status === "false" ? (status = false) : (status = true);
      await productsService.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });
      return {
        success: true,
        message: "Product added successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Server error",
      };
    }
  }

  async getMockingProducts(req, res) {
    let products = [];
    let limit = req.query.qty || 100;

    for (let i = 0; i < limit; i++) {
      products.push(createFakeProduct());
    }

    return res.status(200).send({ status: "success", products });
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;
