export const productPropertiesErrorInfo = (product) => {
  return `Incomplete or not valid properties:
    - title: must be String, received ${product.title}.
    - description: must be String, received ${product.description}.
    - code: must be String, received ${product.code}.
    - price: must be Number, received ${product.price}.
    - status: must be Boolean, received ${product.status}.
    - stock: must be Number, received ${product.stock}.
    - category: must be String, received ${product.category}.`;
};

export const serverErrorInfo = (result) => {
  return `Internal server error. Obtained ${result} when expected other result`
}