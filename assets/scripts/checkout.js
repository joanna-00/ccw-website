const buttonBack = $("#buttonBack");
const buttonNext = $("#buttonNext");

let formSteps = $$(".form-step");

let currentStep = 0;
let totalSteps = 3;
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
  setUpStepForms(shoppingCartItems);
  initDropdowns();
  if (!$(".locationDate")) {
    setUpTotal(shoppingCartItems);
  }
}

function updateStepIcons() {
  processSteps.forEach((step) => {
    if (step.dataset.step <= currentStep - 3) {
      let icon = step.getElementsByTagName("i")[0];
      icon.className = "fas fa-check-circle completed";
    } else {
      let icon = step.getElementsByTagName("i")[0];
      icon.className = stepIcons[step.dataset.step];
    }
  });
}

function setUpTotal(shoppingCartItems) {
  let checkoutSummary = $(".checkout-total-card");
  let locationDate = { name: "locationDate" },
    timeData = { name: "timeData" },
    carModelData = { name: "carModelData" },
    carLicencePlateData = { name: "carLicencePlateData" };
  let checkoutElements = [
    // locationDate,
    // timeData,
    carModelData,
    carLicencePlateData,
  ];

  let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));

  shoppingCart.forEach((item) => {
    let locationDate = document.createElement("dl");
    locationDate.setAttribute("class", "choice-group timeData");
    checkoutSummary.insertBefore(locationDate, checkoutSummary.firstChild);

    // console.log(locationDate);
    let timeData = document.createElement("dl");
    timeData.setAttribute("class", "choice-group locationDate");
    checkoutSummary.insertBefore(timeData, checkoutSummary.firstChild);

    let bookingForLabel = document.createElement("h6");
    bookingForLabel.setAttribute("class", "bookingForLabel");
    checkoutSummary.insertBefore(bookingForLabel, checkoutSummary.firstChild);

    // console.log(timeData);
  });

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
  let currentForm = formSteps[currentStep - 1];

  if (currentForm.querySelector("h4")) {
    let bookingForLabelText = currentForm.querySelector("h4").innerHTML;
    let bookingForLabelContainers = $$(".bookingForLabel");
    for (let i = 0; i < bookingForLabelContainers.length; i++) {
      if (bookingForLabelContainers[i].innerHTML == "") {
        bookingForLabelContainers[i].innerHTML = bookingForLabelText;
        break;
      } else {
        continue;
      }
    }
  }

  if (currentForm.querySelector(".dropdownLocation")) {
    let location = currentForm.querySelector(".dropdownLocation").dataset.value;
    console.log(location);
    let locationDateContainers = $$(".locationDate");
    for (let i = 0; i < locationDateContainers.length; i++) {
      if (locationDateContainers[i].innerHTML == "") {
        locationDateContainers[i].innerHTML = `
            <dt class="choice-group__title">Location</dt>
            <dd class="choice-group__description">${location}</dd>
            `;
        break;
      } else {
        continue;
      }
    }
    // $$(".locationDate").forEach((locationDate) => {
    //   if (locationDate.innerHTML == "") {
    //     locationDate.innerHTML = `
    //     <dt class="choice-group__title">Location</dt>
    //     <dd class="choice-group__description">${location}</dd>
    //     `;
    //     break;
    //   } else {
    //     continue;
    //   }
    // });
  }

  if (
    currentForm.querySelector(".date-picker") &&
    currentForm.querySelector(".dropdownTime")
  ) {
    let date = currentForm.querySelector(".date-picker").dataset.value;
    console.log(currentForm.querySelector(".date-picker"));
    date = new Date(date);
    date = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
    console.log(date);
    let time = currentForm.querySelector(".dropdownTime").dataset.value;

    console.log(date, time);

    let timeDataContainers = $$(".timeData");
    for (let i = 0; i < timeDataContainers.length; i++) {
      if (timeDataContainers[i].innerHTML == "") {
        timeDataContainers[i].innerHTML = `
     <dt class="choice-group__title">Date and time</dt>
     <dd class="choice-group__description">${date}, ${time}</dd>
     `;
        break;
      } else {
        continue;
      }
    }

    // timeData.innerHTML = `
    // <dt class="choice-group__title">Date and time</dt>
    // <dd class="choice-group__description">${date}, ${time}</dd>
    // `;
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
  if (currentForm.querySelector(".date-picker").dataset.value === "") {
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
  if ($("form.current .dropdown")) {
    if (!validateDropdown("dropdownLocation")) {
      currentForm.querySelector(".dropdownLocation").classList.add("invalid");
      return false;
    }
    if (!validateDatePicker()) {
      currentForm.querySelector(".date-picker").classList.add("invalid");
      return false;
    }
    if (!validateDropdown("dropdownTime")) {
      currentForm.querySelector(".dropdownTime").classList.add("invalid");
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

function createTimeBookingForm(items, index) {
  let shoppingCartItems = JSON.parse(localStorage.getItem("shoppingCart"));
  let timeBookingForm = document.createElement("form");
  timeBookingForm.setAttribute("class", "row form-step");
  timeBookingForm.setAttribute("data-step", "");

  let searchedID = shoppingCartItems[index - 1];
  let searchedIDPost = items.filter((obj) => {
    return obj.id == searchedID;
  });
  console.log(searchedIDPost);
  let itemTitle =
    searchedIDPost[0].acf.title || searchedIDPost[0].acf.membership_title;

  let timeBookingFormBody = `
  <div class="col-12">
  <h4>Booking for: <span class="secondary">${itemTitle}</span> </h4>
</div>
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

  timeBookingForm.children[1].insertBefore(
    newDatePicker.date_picker_element,
    timeBookingForm.querySelector(`label[for="dropdownTime"]`)
  );

  return timeBookingForm;
}

function clearAnimationClasses(element) {
  element.classList.remove("moveOutLeft");
  element.classList.remove("moveOutRight");
  element.classList.remove("moveInLeft");
  element.classList.remove("moveInRight");
}

function setUpStepForms(items) {
  let shoppingCartItems = JSON.parse(localStorage.getItem("shoppingCart"));
  let checkoutFormStepsContainer = $(".checkout__form-steps");

  shoppingCartItems.forEach((item) => {
    totalSteps++;
    let newForm = createTimeBookingForm(items, totalSteps - 3);
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
      location.href = "#checkout";
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
  } else {
    location.href = "#checkout";
  }
});
