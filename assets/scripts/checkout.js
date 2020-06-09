const buttonBack = $("#buttonBack");
const buttonNext = $("#buttonNext");

const formSteps = $$(".form-step");

let currentStep = 1;
const processSteps = $$(".process-steps__step");

const dropdownLocation = $("#dropdownLocation");
const dropdownTime = $("#dropdownTime");

const stepIcons = [
  "far fa-calendar",
  "fas fa-user",
  "fas fa-car",
  "far fa-credit-card",
];

updateStepIcons();

if (window.location.pathname.includes("checkout.html")) {
  let itemsToRender = JSON.parse(localStorage.getItem("itemsToRender"));
  console.log(itemsToRender);

  let requestString = "?include[]=";
  let i = 0;

  for (const ID in itemsToRender) {
    if (i == 0) {
      console.log(ID);
      requestString += ID;
      i++;
    } else {
      requestString += `&include[]=${ID}`;
    }
  }

  console.log(requestString);
  let shoppingCartItems = requestWP(noEndPoint, requestString, renderTotal);
}

function renderTotal(shoppingCartItems) {
  console.log(shoppingCartItems);
  let checkoutCardContainer = $(".checkout-card__container");
  let itemsToRender = JSON.parse(localStorage.getItem("itemsToRender"));

  checkoutCardContainer.innerHTML = createCheckoutSummary(
    shoppingCartItems,
    itemsToRender,
    "checkout"
  );
}

function updateStepIcons() {
  processSteps.forEach((step) => {
    if (step.dataset.step < currentStep) {
      let icon = step.getElementsByTagName("i")[0];
      icon.className = "fas fa-check-circle completed";
    } else {
      let icon = step.getElementsByTagName("i")[0];
      icon.className = stepIcons[step.dataset.step - 1];
    }
  });
}

function validateDropdown(dropdownToValidate) {
  if (dropdownToValidate.dataset.value === "") {
    console.log("validateDropdown: false ");
    return false;
  } else {
    console.log("validateDropdown: true ");
    return true;
  }
}
function validateDatePicker() {
  if (date_picker_element.dataset.value === "") {
    console.log("validateDatePicker: false ");
    return false;
  } else {
    console.log("validateDatePicker: true ");
    return true;
  }
}

function validateForm() {
  let currentForm = formSteps[currentStep - 1];
  console.log(currentForm);
  if (currentStep == 1) {
    if (!validateDropdown(dropdownLocation)) {
      dropdownLocation.classList.add("invalid");
      return false;
    }
    if (!validateDatePicker()) {
      date_picker_element.classList.add("invalid");
      return false;
    }
    if (!validateDropdown(dropdownTime)) {
      dropdownTime.classList.add("invalid");
      return false;
    }
    return true;
  } else {
    let validationResult = currentForm.checkValidity();
    console.log(validationResult);
    highlightInvalidFields(currentForm);
    return validationResult;
  }
}

let invalidFields;

function highlightInvalidFields(currentForm) {
  if (invalidFields === undefined) {
    invalidFields = currentForm.querySelectorAll(":invalid");
    invalidFields.forEach((field) => {
      field.classList.add("invalid");
      // console.log(field);
    });
  } else {
    invalidFields.forEach((field) => {
      field.classList.remove("invalid");
      // console.log(field);
    });
    invalidFields = currentForm.querySelectorAll(":invalid");
    invalidFields.forEach((field) => {
      field.classList.add("invalid");
      // console.log(field);
    });
  }
}

function showForm(animationDirection) {
  formSteps.forEach((formStep) => {
    if (formStep.dataset.step == currentStep) {
      clearAnimationClasses(formStep);

      formStep.classList.add(animationDirection);

      formStep.classList.add("current");
    } else if (formStep.classList.contains("current")) {
      clearAnimationClasses(formStep);
      formStep.classList.remove("current");
    }
  });
}

function clearAnimationClasses(element) {
  element.classList.remove("moveOutLeft");
  element.classList.remove("moveOutRight");
  element.classList.remove("moveInLeft");
  element.classList.remove("moveInRight");
}

buttonBack.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    console.log(formSteps[currentStep - 1]);
    formSteps[currentStep - 1].classList.add("moveOutRight");
    showForm("moveInLeft");
    updateStepIcons();
  }
});

buttonNext.addEventListener("click", () => {
  if (currentStep < 5 && validateForm()) {
    // if () {
    currentStep++;
    if (currentStep < 5) {
      console.log(formSteps[currentStep - 1]);
      formSteps[currentStep - 1].classList.add("moveOutLeft");

      showForm("moveInRight");
      updateStepIcons();
    } else {
      location.href = "shopping_cart.html";
      deleteAllItems(false);

      let newTitle = "Your appointment was successfully booked!",
        newDesc =
          'You can see it under "calendar" in your profile or in your e-mail.';

      displayNotification("success", true, "sm", newTitle, newDesc);
    }
    // }
  }

  // if (currentStep == 4) {
  //   if (validateForm()) {
  //     console.log("current step is 4");
  //     currentStep++;
  //   }
  // }
  // if (currentStep == 5) {
  //   if (validateForm()) {
  //     location.href = "shopping_cart.html";
  //     deleteAllItems();
  //   }
  // }
});
