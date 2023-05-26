import { productsService, usersService } from "../dao/factory.js";
import { createFakeProduct } from "../utils/utils.js";

class ProductsApiController {
  async getProducts(req, res) {
    let result = await productsService.getPaginated(req.query);
    if (result) {
      return res.status(200).send({ status: "success", result });
    } else {
      req.logger.debug("error trying to get products");
      return res.status(500).send({ status: "error", error: "error trying to get products" });
    }
  }

  async getProduct(req, res) {
    let result = await productsService.getById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "success", result });
    } else {
      req.logger.debug("error trying to get product");
      return res.status(500).send({ status: "error", error: "error trying to get product" });
    }
  }

  async addProduct(req, res) {
    let codeExists = await productsService.getByCode(req.body.code);
    if (codeExists) {
      req.logger.debug("Product not added. Code already exists");
      return res.status(400).send({ status: "error", error: "Product not added. Code already exists" });
    }
    let result = await productsService.create(req.body);
    if (result) {
      return res.status(201).send({ status: "success", result: "Product added successfully" });
    } else {
      req.logger.debug("error trying to add product");
      return res.status(500).send({ status: "error", error: "error trying to add product" });
    }
  }

  async updateProduct(req, res) {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let product = await productsService.getById(req.params.pid);
    if (product) {
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
        req.logger.debug("error trying to update product");
        return res.status(500).send({ status: "error", error: "error trying to update product" });
      }
    } else {
      req.logger.debug("Product not found");
      return res.status(400).send({ status: "error", error: "Product not found" });
    }
  }

  async deleteProduct(req, res) {
    let result = await productsService.deleteById(req.params.pid);
    if (result) {
      return res.status(200).send({ status: "success", result: `Product deleted successfully` });
    } else {
      req.logger.debug("error trying to delete product");
      return res.status(500).send({ status: "error", error: "error trying to delete product" });
    }
  }

  async deleteProductSocket(productId, user) {
    try {
      let product = await productsService.getById(productId);
      if (!product) return { success: false, message: "Product not found" };
      if (user.role === "premium" && user.id !== product.owner)
        return { success: false, message: "premium user cannot delete not own products" };
      let result = await productsService.deleteById(productId);
      if (result) {
        return {
          success: true,
          message: "Product deleted successfully",
        };
      } else {
        return {
          success: false,
          message: "error trying to delete product",
        };
      }
    } catch (error) {
      req.logger.debug("error trying to delete product");
      return {
        success: false,
        message: "Server error",
      };
    }
  }

  async addProductSocket(productData) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails, owner } = productData;
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
        owner,
      });
      return {
        success: true,
        message: "Product added successfully",
      };
    } catch (error) {
      req.logger.debug("error trying to add product");
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
