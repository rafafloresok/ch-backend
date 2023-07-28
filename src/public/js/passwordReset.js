let formPasswordReset = document.getElementById("formPasswordReset");
let inputPassword = document.getElementById("inputPassword");
let inputRepeatPassword = document.getElementById("inputRepeatPassword");
let closeModalBtn = document.getElementById("closeModalBtn");

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

Array.from(formPasswordReset.elements).forEach((element) => {
  if (element.type !== "submit") {
    element.addEventListener("change", (event) => {
      event.target.value = event.target.value.trim();
      if (event.target.id === "inputPassword") {
        inputRepeatPassword.pattern = event.target.value.trim();
      }
    });
  }
});
closeModalBtn.href = "/passwordresetinit";
console.dir(closeModalBtn.href)
formPasswordReset.addEventListener(
  "submit",
  async (event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      formPasswordReset.classList.add("was-validated");
      if (formPasswordReset.checkValidity()) {
        submittingForm(true);
        let formData = new URLSearchParams(new FormData(event.target));
        let res = await fetch("/api/sessions/passwordresetend", {
          method: "POST",
          body: formData,
        });
        let resJson = await res.json();
        if (res.status !== 200) {
          switch (resJson.error) {
            case "link expired":
              closeModalBtn.dataset["bsDismiss"] = null;
              closeModalBtn.href = "/forgotPassword";
              showModal(
                "Error",
                "El enlace ha expirado. Vuelva a ingresar su correo electrónico y le enviaremos un nuevo enlace."
              );
              break;
            case "same password":
              showModal(
                "Error",
                "La nueva contraseña debe ser distinta de la anterior."
              );
              break;
            default:
              closeModalBtn.dataset["bsDismiss"] = null;
              closeModalBtn.href = "/forgotPassword";
              showModal(
                "Error",
                "Hubo un error. Vuelva a ingresar su correo electrónico y le enviaremos un nuevo enlace."
              );
              break;
          }
        } else {
          closeModalBtn.dataset["bsDismiss"] = null;
          closeModalBtn.href = "/login"
          showModal(
            "¡Contraseña restablecida!",
            "Ya puedes ingresar con tu nueva contraseña."
          );
        }
        inputPassword.value = "";
        inputRepeatPassword.value = "";
        formPasswordReset.classList.remove("was-validated");
        submittingForm(false);
      }
    } catch (error) {
      closeModalBtn.dataset["bsDismiss"] = null;
      closeModalBtn.href = "/forgotPassword";
      showModal(
        "Error",
        "Hubo un error. Vuelva a ingresar su correo electrónico y le enviaremos un nuevo enlace."
      );
    }
  },
  false
);

// ****************************************

/* let passwordResetForm = document.getElementById("passwordResetForm");

passwordResetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = e.target[0].value;
  let token = e.target[1].value;
  let newPassword = e.target[2].value;
  let url = "/api/sessions/passwordresetend";
  let data = { email, token, newPassword };
  try {
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let json = await res.json();
    if (json.status === "success") {
      alert("Contraseña restablecida");
      window.location.href = "http://localhost:8080/login";
    } else {
      switch (json.error) {
        case "link expired":
          alert(
            "El enlace ha expirado. Vuelva a ingresar su correo electrónico para enviarle un nuevo enlace."
          );
          window.location.href = "http://localhost:8080/forgotPassword";
          break;
        case "same password":
          alert("La nueva contraseña debe ser distinta de la anterior");
          window.location.reload();
          break;
        default:
          alert(
            "Hubo un error. Vuelva a ingresar su correo electrónico para enviarle un nuevo enlace."
          );
          window.location.href = "http://localhost:8080/forgotPassword";
          break;
      }
    }
  } catch (error) {
    console.log(error);
    alert(
      "Hubo un error. Vuelva a ingresar su correo electrónico para enviarle un nuevo enlace."
    );
    window.location.href = "http://localhost:8080/forgotPassword";
  }
  e.target.reset();
});
 */