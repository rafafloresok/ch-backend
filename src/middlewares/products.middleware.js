import { BadRequestError, instanceOfCustomError } from "../utils/errors.utils.js";

// Verify and parse data before add or update product
export const verifyProductProperties = (req, res, next) => {
  try {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (req.method === "POST") {
      let emptyField = !(title && description && code && price && stock && category);
      if (emptyField) {
        throw new BadRequestError("incomplete required properties");
      }
    }
    if (title || title === "") {
      let regex = /.+/;
      if (!regex.test(title)) {
        throw new BadRequestError("invalid title value");
      }
    }
    if (description || description === "") {
      let regex = /(.|\s)+/;
      if (!regex.test(description)) {
        throw new BadRequestError("invalid description value");
      }
    }
    if (code || code === "") {
      let regex = /.+/;
      if (!regex.test(code)) {
        throw new BadRequestError("invalid code value");
      }
    }
    if (price || price === "") {
      let regex = /^\d+\.?\d{0,2}$/;
      if (regex.test(price)) {
        req.body.price = Number(price);
      } else {
        throw new BadRequestError("invalid price value");
      }
    }
    if (status === "false" || status === false) {
      req.body.status = false;
    } else {
      if (status === "true" || status === true) {
        req.body.status = true;
      } else {
        if (!status) {
          if (req.method === "POST") req.body.status = true;
        } else {
          throw new BadRequestError("invalid status value");
        }
      }
    }
    if (stock || stock === "") {
      let regex = /^\d+$/;
      if (regex.test(stock)) {
        req.body.stock = Number(stock);
      } else {
        throw new BadRequestError("invalid stock value");
      }
    }
    if (category || category === "") {
      let regex = /.+/;
      if (!regex.test(category)) {
        throw new BadRequestError("invalid price value");
      }
    }
    if (thumbnails) {
      thumbnails.forEach((el) => {
        let regex = /^[\w\.\_\-\/\\]+$/;
        if (!regex.test(el)) {
          throw new BadRequestError("invalid thumbnail value");
        }
      });
    }
    next();
  } catch (error) {
    return instanceOfCustomError(error)
      ? res.status(error.code).send({ status: "error", error: error.message })
      : res.status(500).send({ status: "error", error: "server error" });
  }
};
