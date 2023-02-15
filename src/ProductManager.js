import fs from "fs";
import { v4 as createID } from "uuid";

class Product {
  constructor(id, title, description, price, thumbnail, code, stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    let fileExists = fs.existsSync(this.path);
    if (fileExists) {
      let data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    let products = await this.getProducts();
    let productExists = products.findIndex((product) => product.code === code) !== -1;
    let aFieldIsEmpty = !(title && description && price && thumbnail && code && stock);
    if (productExists || aFieldIsEmpty) {
      console.log(`Product not added.\nErrors:${productExists ? "\nProduct already exists." : ""} ${aFieldIsEmpty ? "\nMust complete all fields." : ""}`);
    } else {
      let id = createID();
      let newProduct = new Product(id, title, description, price, thumbnail, code, stock);
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      console.log(`Product ${title} added with ID ${id}`);
    }
  }

  async getProductById(id) {
    let products = await this.getProducts();
    let product = products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.log("Product not found.");
    }
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products[productIndex].title = title;
      products[productIndex].description = description;
      products[productIndex].price = price;
      products[productIndex].thumbnail = thumbnail;
      products[productIndex].code = code;
      products[productIndex].stock = stock;
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      console.log(`Product ${title} with ID ${id} updated successfully`);
    } else {
      console.log("Product not found.");
    }
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    let productIndex = products.findIndex((product) => product.id === id);
    let productExists = productIndex !== -1;
    if (productExists) {
      products.splice(productIndex,1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      console.log(`Product with ID ${id} deleted successfully`);
    } else {
      console.log("Product not found.");
    }
  }
}

//let pm = new ProductManager("./files/products.json");
//pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc132", 25);
//pm.getProducts().then(products => console.log(products));
//pm.getProductById("78a1a5cf-9cde-4dff-bb9e-0db7953fb1b1").then((product) => console.log(product));
//pm.updateProduct("78a1a5cf-9cde-4dff-bb9e-0db7953fb1b1", "producto prueba modificado", "Este es un producto prueba modificado", 300, "Sin imagen modificado", "abc131", 36);
//pm.deleteProduct("52832796-30a9-45ca-a333-a28c0793b01e");
