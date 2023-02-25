const socket = io();

let productsList = document.getElementById("productsList");
let addProductForm = document.getElementById("addProductForm");
let deleteProductForm = document.getElementById("deleteProductForm");

deleteProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = e.target[0].value.trim();
  socket.emit("deleteProduct", id);
  e.target.reset();
});

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let product = {
    title: e.target[0].value.trim(),
    description: e.target[1].value.trim(),
    code: e.target[2].value.trim(),
    price: e.target[3].value.trim(),
    status: e.target[4].value.trim(),
    stock: e.target[5].value.trim(),
    category: e.target[6].value.trim(),
    thumbnails: [e.target[7].value.trim(), e.target[8].value.trim()],
  };
  socket.emit("addProduct", product);
  e.target.reset();
});

socket.on("products", (products) => {
  let divContent = products.map((el) => `<h2>${el.title}</h2>`).join("");
  productsList.innerHTML = divContent;
});

socket.on("addProductRes", (response) => {
  alert(response);
});

socket.on("deleteProductRes", (response) => {
  alert(response);
});
