let sendOrderBtn = document.getElementById("sendOrderBtn");

sendOrderBtn.addEventListener("click", async () => {
  let url = sendOrderBtn.dataset.href;

  try {
    let res = await fetch(url, { method: "POST" });
    let jsonRes = await res.json();
    if (res.status === 201) {
      alert(`Orden enviada! \n Código: ${jsonRes.result}`);
      location.reload();
    } else {
      alert("Error. Orden no enviada. Vuelva a intentarlo.");
    }
  } catch (error) {
    console.log(error);
    alert("Error. Orden no enviada. Vuelva a intentarlo.");
  }
});
