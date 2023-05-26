let sendOrderBtn = document.getElementById("sendOrderBtn");

sendOrderBtn.addEventListener("click", async () => {
  let res = await fetch("/api/sessions/current");
  let json = await res.json();
  let user = json.result;
  let body = JSON.stringify(user);
  let url = sendOrderBtn.dataset.href;

  try {
    let response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
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
