const buttonBack = $("#buttonBack");
const buttonNext = $("#buttonNext");

let formSteps = $$(".form-step");

let currentStep = 0;
let totalSteps = 4;
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

if ($("body").id === "checkout") {
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
  if (!$("#locationDate")) {
    setUpTotal();
  }
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

function setUpTotal() {
  let checkoutSummary = $(".checkout-total-card");
  let locationDate = { name: "locationDate" },
    timeData = { name: "timeData" },
    carModelData = { name: "carModelData" },
    carLicencePlateData = { name: "carLicencePlateData" };
  let checkoutElements = [
    locationDate,
    timeData,
    carModelData,
    carLicencePlateData,
  ];

  checkoutElements.reverse().forEach((element) => {
    let name = element.name;
    element = document.createElement("dl");
    element.setAttribute("class", "choice-group");
    element.setAttribute("id", name);
    checkoutSummary.insertBefore(element, checkoutSummary.firstChild);
    console.log(element);
  });
}

function updateTotal() {
  let checkoutSummary = $(".checkout-total-card");
  let currentForm = formSteps[currentStep];
  console.log(currentForm);

  let location = currentForm.querySelector(".dropdownLocation").dataset.value;
  if (location) {
    console.log(location);
    $("#locationDate").innerHTML = `
    <dt class="choice-group__title">Location</dt>
    <dd class="choice-group__description">${location}</dd>
    `;
  }

  let date = currentForm.querySelector(".date-picker").dataset.value;
  console.log(date);
  date = new Date(date);
  date = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
  console.log(date);
  let time = currentForm.querySelector(".dropdownTime").dataset.value;
  if (date && time) {
    console.log(date, time);
    timeData.innerHTML = `
    <dt class="choice-group__title">Date and time</dt>
    <dd class="choice-group__description">${date}, ${time}</dd>
    `;
  }

  let carBrand = $("#carBrand").value;
  let carModel = $("#carModel").value;
  if (carModel) {
    console.log(carModel);
    carModelData.innerHTML = `
    <dt class="choice-group__title">Your car</dt>
    <dd class="choice-group__description">${carBrand} ${carModel}</dd>
    `;
  }

  let carLicencePlate = $("#licensePlateNumber").value;
  if (carLicencePlate) {
    console.log(carLicencePlate);
    carLicencePlateData.innerHTML = `
    <dt class="choice-group__title">License plate number</dt>
    <dd class="choice-group__description">${carLicencePlate}</dd>
    `;
  }
}

function validateDropdown(dropdownToValidate) {
  let currentForm = formSteps[currentStep];
  if (
    currentForm.querySelector(`.${dropdownToValidate}`).dataset.value === ""
  ) {
    console.log("validateDropdown: false ");
    return false;
  } else {
    console.log("validateDropdown: true ");
    return true;
  }
}
function validateDatePicker() {
  let currentForm = formSteps[currentStep];
  if (currentForm.querySelector("date-picker").dataset.value === "") {
    console.log("validateDatePicker: false ");
    return false;
  } else {
    console.log("validateDatePicker: true ");
    return true;
  }
}

function validateForm() {
  let currentForm = formSteps[currentStep];
  console.log(currentForm);
  if ($("form.current dropdown")) {
    if (!validateDropdown("dropdownLocation")) {
      dropdownLocation.classList.add("invalid");
      return false;
    }
    if (!validateDatePicker()) {
      date_picker_element.classList.add("invalid");
      return false;
    }
    if (!validateDropdown("dropdownTime")) {
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
      createValidationError(field);
    });
  } else {
    invalidFields.forEach((field) => {
      field.classList.remove("invalid");
      field.parentElement.querySelector("span").remove();
    });
    invalidFields = currentForm.querySelectorAll(":invalid");
    invalidFields.forEach((field) => {
      field.classList.add("invalid");
      createValidationError(field);
    });
  }
}

function createValidationError(field) {
  let fieldName = field.parentElement.querySelector("label").textContent;
  let errorMessage = `The ${fieldName.toLowerCase()} you entered is invalid`;
  let errorMessageElement = document.createElement("span");
  errorMessageElement.classList.add("invalid");
  errorMessageElement.textContent = errorMessage;
  field.parentElement.appendChild(errorMessageElement);
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

function createTimeBookingForm() {
  let timeBookingForm = document.createElement("form");
  timeBookingForm.setAttribute("class", "row form-step");
  timeBookingForm.setAttribute("data-step", "");

  let timeBookingFormBody = `
  <div class="col-12 col-lg-6">
    <label for="dropdownLocation" class="text-input__label">
      Choose a location</label
    >
    <div class="dropdown dropdownLocation" data-value="">
      <div class="dropdown__title">
        Choose a location
        <i class="fas fa-chevron-down"></i>
      </div>
      <ul class="dropdown__options-container hidden">
        <li class="dropdown__option">Aalborg</li>
        <li class="dropdown__option">Aarhus</li>
      </ul>
    </div>

    <label for="dropdownTime" class="text-input__label hidden mt-5">
      Choose a time</label
    >
    <div class="dropdown hidden dropdownTime" data-value="">
      <div class="dropdown__title">
        Choose a time
        <i class="fas fa-chevron-down"></i>
      </div>
      <ul class="dropdown__options-container hidden">
        <li class="dropdown__option">08:00 - 09:00</li>
        <li class="dropdown__option">09:00 - 10:00</li>
        <li class="dropdown__option">10:15 - 11:15</li>
        <li class="dropdown__option">11:15 - 12:15</li>
        <li class="dropdown__option">12:45 - 13:45</li>
        <li class="dropdown__option">13:45 - 14:45</li>
        <li class="dropdown__option">15:00 - 16:00</li>
        <li class="dropdown__option">16:00 - 17:00</li>
      </ul>
    </div>
  </div>
  `;
  timeBookingForm.innerHTML += timeBookingFormBody;

  let newDatePicker = new DatePicker();
  newDatePicker.setUpDatePicker();
  newDatePicker.date_picker_element.classList.add("hidden");

  timeBookingForm.children[0].insertBefore(
    newDatePicker.date_picker_element,
    timeBookingForm.querySelector("label")
  );

  return timeBookingForm;
}

function clearAnimationClasses(element) {
  element.classList.remove("moveOutLeft");
  element.classList.remove("moveOutRight");
  element.classList.remove("moveInLeft");
  element.classList.remove("moveInRight");
}

function setUpStepForms() {
  let shoppingCartItems = JSON.parse(localStorage.getItem("shoppingCart"));
  let checkoutFormStepsContainer = $(".checkout__form-steps");

  shoppingCartItems.forEach((item) => {
    totalSteps++;
    let newForm = createTimeBookingForm();
    checkoutFormStepsContainer.insertBefore(
      newForm,
      $(".checkout__form-steps form")
    );
  });

  formSteps = $$(".form-step");
  for (let i = 0; i < formSteps.length; i++) {
    if (i === 0) {
      formSteps[i].classList.add("current");
    }
    formSteps[i].dataset.step = i;
  }
}

setUpStepForms();

buttonBack.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    console.log(formSteps[currentStep]);
    formSteps[currentStep].classList.add("moveOutRight");
    showForm("moveInLeft");
    updateStepIcons();

    if (currentStep < 4) {
      buttonNext.textContent = "Next";
      buttonNext.classList.add("button--primary-light");
      buttonNext.classList.remove("button--secondary");
    }
  }
});

buttonNext.addEventListener("click", () => {
  if (currentStep < totalSteps && validateForm()) {
    // if () {
    currentStep++;
    if (currentStep < totalSteps) {
      // if (currentStep == 1) {
      //   setUpTotal();
      //   updateTotal();
      // }
      updateTotal();
      console.log(formSteps[currentStep]);
      formSteps[currentStep - 1].classList.add("moveOutLeft");

      showForm("moveInRight");
      updateStepIcons();

      if (currentStep == totalSteps - 1) {
        buttonNext.textContent = "Accept and pay";
        buttonNext.classList.remove("button--primary-light");
        buttonNext.classList.add("button--secondary");
      }
    } else {
      localStorage.setItem("notification", "bookedSuccess");
      location.href = "shopping_cart.html";
      deleteAllItems(false);
    }
  }
});
