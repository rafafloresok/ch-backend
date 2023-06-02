const socket = io();

let addProductForm = document.getElementById("addProductForm");
let deleteProductForm = document.getElementById("deleteProductForm");
let toast = document.getElementById("toast");

deleteProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let productId = e.target[0].value.trim();
  await fetch(`/api/products/${productId}`, {method: "DELETE"});
  socket.emit("productsCollectionUpdated");
  e.target.reset();
});

addProductForm.addEventListener("submit", async (e) => {
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
  await fetch("/api/products/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product) });
  socket.emit("productsCollectionUpdated");
  e.target.reset();
});

const showToast = (message) => {
  toast.innerHTML = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
};

showToast("Lista actualizada!");

socket.on("productsCollectionUpdated", () => {
  location.reload();
});
