import { productsService } from "../dao/factory.js";

class ProductsApiController {
  async getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let products = await productsService.getPaginated(req.query);
      return res.status(200).json({ products });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async getProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
      let product = await productsService.getById(req.params.pid);
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
      let product = await productsService.getByCode(code);
      if (product) {
        return res.status(400).json({ error: "Product not added. Error: Code already exists." });
      } else {
        await productsService.create({
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
      let product = await productsService.getById(pid);
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
        await productsService.updateById(pid, update);
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
      let product = await productsService.deleteById(req.params.pid);
      if (product) {
        return res.status(201).json({ message: `Product deleted successfully` });
      } else {
        return res.status(400).json({ error: "Product not found." });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
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
