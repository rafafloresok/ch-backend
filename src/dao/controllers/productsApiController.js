import { productsService } from "../factory.js";

class ProductsApiController {
  async getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let { category, status, limit, page, sort } = req.query;
      let query = {};
      let options = { limit: 10, page: 1 };

      if (category) {
        query.category = category;
      }
      if (status) {
        query.status = status;
      }
      if (limit) {
        options.limit = limit;
      }
      if (page) {
        options.page = page;
      }
      if (sort) {
        options.sort = { price: sort };
      }

      let products = await productsService.getProducts(query, options)
      return res.status(200).json({ products });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let product = await productsService.getProduct(req.params.pid);
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
      let product = await productsService.getProductByCode(code);
      if (product) {
        return res.status(400).json({ error: "Product not added. Error: Code already exists." });
      } else {
        await productsService.createProduct({
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
      let pid = req.params.pid;
      let product = await productsService.getProduct(pid);
      if (product) {
        status === false && (await productsService.updateProduct(pid, "status", status));
        status === true && (await productsService.updateProduct(pid, "status", status));
        title && (await productsService.updateProduct(pid, "title", title));
        description && (await productsService.updateProduct(pid, "description", description));
        code && (await productsService.updateProduct(pid, "code", code));
        price && (await productsService.updateProduct(pid, "price", price));
        stock && (await productsService.updateProduct(pid, "stock", stock));
        category && (await productsService.updateProduct(pid, "category", category));
        thumbnails && (await productsService.updateProduct(pid, "thumbnails", thumbnails));
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
      let product = await productsService.getProduct(req.params.pid);
      if (product) {
        await productsService.deleteProduct(req.params.pid);
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
      let product = await productsService.getProduct(req.params.pid);
      if (product) {
        await productsService.deleteProduct(id);
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
      let productDB = await productsService.getProductByCode(code);
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
        await productsService.createProduct({
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
