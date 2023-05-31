import { productsService } from "../dao/factory.js";
import { BadRequestError, NotFoundError, ServerError, instanceOfCustomError } from "../utils/errors.utils.js";

class ProductsApiController {
  async getProducts(req, res) {
    try {
      let result = await productsService.getPaginated(req.query);
      if (result) {
        return res.status(200).send({ status: "success", result });
      } else {
        throw new ServerError("error trying to get products");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async getProduct(req, res) {
    try {
      let result = await productsService.getById(req.params.pid);
      if (result) {
        return res.status(200).send({ status: "success", result });
      } else {
        throw new ServerError("error trying to get product");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
    
  }

  async addProduct(req, res) {
    try {
      let codeExists = await productsService.getByCode(req.body.code);
      if (codeExists) {
        throw new BadRequestError("Code already exists");
      }
      let result = await productsService.create(req.body);
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

  async updateProduct(req, res) {
    try {
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
          return res.status(200).send({ status: "success", result: "Product update success" });
        } else {
          throw new ServerError("error trying to update product");
        }
      } else {
        throw new NotFoundError("Product not found");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      let result = await productsService.deleteById(req.params.pid);
      if (result) {
        return res.status(200).send({ status: "success", result: `Product delete success` });
      } else {
        throw new ServerError("error trying to delete product");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
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
          message: "Product delete success",
        };
      } else {
        return {
          success: false,
          message: "error trying to delete product",
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
        message: "Product add success",
      };
    } catch (error) {
      req.logger.debug("error trying to add product");
      return {
        success: false,
        message: "Server error",
      };
    }
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;
