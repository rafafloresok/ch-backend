let formResetPassInit = document.getElementById("formResetPassInit");
let inputEmail = document.getElementById("inputEmail");

const submittingForm = (status) => {
  let btnSubmit = document.getElementById("btnSubmit");
  let btnSubmitText = document.getElementById("btnSubmitText");
  let btnSubmitSpinner = document.getElementById("btnSubmitSpinner");
  if (status) {
    btnSubmit.classList.add("disabled");
    btnSubmitText.innerText = "Enviando...";
    btnSubmitSpinner.classList.remove("visually-hidden");
  } else {
    btnSubmit.classList.remove("disabled");
    btnSubmitText.innerText = "Enviar";
    btnSubmitSpinner.classList.add("visually-hidden");
  }
};

const showModal = (title, body) => {
  const modal = new bootstrap.Modal("#staticBackdrop");
  const modalTitle = document.getElementById("staticBackdropLabel");
  const modalBody = document.getElementById("staticBackdropBody");
  modalTitle.innerText = title;
  modalBody.innerText = body;
  modal.show();
};

inputEmail.addEventListener("change", (event) => {
  event.target.value = event.target.value.trim();
});

formResetPassInit.addEventListener(
  "submit",
  async (event) => {
    try {
      event.preventDefault();
      formResetPassInit.classList.add("was-validated");
      if (formResetPassInit.checkValidity()) {
        submittingForm(true);
        let formData = new URLSearchParams(new FormData(event.target));
        let res = await fetch("/api/sessions/passwordresetinit", {
          method: "POST",
          body: formData,
        });
        formResetPassInit.reset();
        formResetPassInit.classList.remove("was-validated");
        submittingForm(false);
        switch (res.status) {
          case 201:
            showModal(
              "¡Enlace enviado!",
              "Revisa la bandeja de entrada (o la carpeta de spam) de tu correo."
            );
            break;
          case 404:
            showModal(
              "Error",
              "El usuario no fue encontrado. Por favor, revisa el correo ingresado y vuelve a intentarlo."
            );
            break;
          default:
            showModal(
              "Error",
              "Ocurrió un error. Por favor, vuelve a intentarlo."
            );
            break;
        }
      }
    } catch (error) {
      showModal("Error", "Ocurrió un error. Por favor, vuelve a intentarlo.");
    }
  },
  false
);
