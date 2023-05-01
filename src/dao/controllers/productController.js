import { productsModel } from "../models/products.model.js";

class ProductController {
  async getProducts(req) {
    try {
      let { category, status, limit, page, sort } = req.query;
      let query = {};
      let options = { limit: 10, page: 1 };
      let params = [];
      let response = {};
      if (category) {
        query.category = category;
        params.push(`category=${category}`);
      }
      if (status) {
        query.status = status;
        params.push(`status=${status}`);
      }
      if (limit) {
        options.limit = limit;
        params.push(`limit=${limit}`);
      }
      if (page) {
        options.page = page;
      }
      if (sort) {
        options.sort = { price: sort };
        params.push(`sort=${sort}`);
      }
      let products = await productsModel.paginate(query, options);
      let { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = products;
      page = products.page;
      response.status = "success";
      response.payload = docs;
      response.totalPages = totalPages;
      response.prevPage = prevPage;
      response.nextPage = nextPage;
      response.page = page;
      response.hasPrevPage = hasPrevPage;
      response.hasNextPage = hasNextPage;
      if (hasPrevPage) {
        response.prevLink = `/products/?page=${prevPage}`;
        if (params.length) {
          for (let i = 0; i < params.length; i++) {
            response.prevLink += `&${params[i]}`;
          }
        }
      } else {
        response.prevLink = null;
      }
      if (hasNextPage) {
        response.nextLink = `/products/?page=${nextPage}`;
        if (params.length) {
          for (let i = 0; i < params.length; i++) {
            response.nextLink += `&${params[i]}`;
          }
        }
      } else {
        response.nextLink = null;
      }
      return response;
    } catch (error) {
      response.status = "error";
      return response;
    }
  }

  async getProductById(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let product = await productsModel.find({ _id: req.params.pid });
      if (product.length) {
        return res.status(200).json({ product });
      } else {
        return res.status(400).json({ error: "Product not found." });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let product = await productsModel.find({ code: code });
      if (product.length) {
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
      console.log(error);
    }
  }

  async updateProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { title, description, code, price, status, stock, category, thumbnails } = req.body;
      let product = await productsModel.find({ _id: req.params.pid });
      if (product.length) {
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
      console.log(error);
    }
  }

  async deleteProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let product = await productsModel.find({ _id: req.params.pid });
      if (product.length) {
        await productsModel.deleteOne({ _id: req.params.pid });
        return res.status(201).json({ message: `Product deleted successfully` });
      } else {
        return res.status(400).json({ error: "Product not found." });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductSocket(id) {
    try {
      let product = await productsModel.find({ _id: id });
      if (product.length) {
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
      console.log(error);
    }
  }

  async addProductSocket(product) {
    try {
      let { title, description, code, price, status, stock, category, thumbnails } = product;
      let productDB = await productsModel.find({ code: code });
      if (productDB.length) {
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
      console.log(error);
    }
  }
}

const productController = new ProductController();
export default productController;
