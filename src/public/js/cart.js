let sendOrderBtn = document.getElementById("sendOrderBtn");

sendOrderBtn.addEventListener("click", async () => {
  let url = sendOrderBtn.dataset.href;

  try {
    let response = await fetch(url, { method: "POST" } );
    if (response.status === 201) {
      alert("Orden enviada!");
      location.reload();
    } else {
      alert("Error. Orden no enviada. Vuelva a intentarlo.");
    }
  } catch (error) {
    console.log(error);
    alert("Error. Orden no enviada. Vuelva a intentarlo.");
  }
});
