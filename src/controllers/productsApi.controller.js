import { productsService } from "../dao/factory.js";
import { BadRequestError, ForbiddenError, NotFoundError, ServerError, instanceOfCustomError } from "../utils/errors.utils.js";

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
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
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
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async addProduct(req, res) {
    try {
      let codeExists = await productsService.getByCode(req.body.code);
      if (codeExists) throw new BadRequestError("Code already exists");
      if (req.user.role !== "admin") req.body.owner = req.user._id;
      let result = await productsService.create(req.body);
      if (result) {
        return res.status(201).send({ status: "success", result: "Product add success" });
      } else {
        throw new ServerError("error trying to add product");
      }
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async updateProduct(req, res) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let product = await productsService.getById(req.params.pid);
      if (product) {
        if (req.user.role !== "admin" && req.user._id !== product.owner) throw new ForbiddenError("cannot update not own product");
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
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async deleteProduct(req, res) {
    try {
      let product = await productsService.getById(req.params.pid);
      if (!product) throw new NotFoundError("product not found");
      if (req.user.role !== "admin" && req.user._id !== product.owner) throw new ForbiddenError("cannot delete not own product");
      let result = await productsService.deleteById(req.params.pid);
      if (!result) throw new ServerError("error trying to delete product");
      return res.status(200).send({ status: "success", result: `Product delete success` });
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).send({ status: "error", error: error.message });
      return res.status(500).send({ status: "error", error: "server error" });
    }
  }
}

const productsApiController = new ProductsApiController();
export default productsApiController;
