const buttonBack = $("#buttonBack");
const buttonNext = $("#buttonNext");

const formSteps = $$(".form-step");

let currentStep = 1;
const processSteps = $$(".process-steps__step");

function updateStepIcons() {
  processSteps.forEach((step) => {
    if (step.dataset.step <= currentStep) {
      step.getElementsByTagName("i")[0].remove();
      let checkmark = document.createElement("i");
      checkmark.setAttribute("class", "fas fa-check-circle completed");
      // step.appendChild(checkmark);
      step.insertBefore(checkmark, step.firstChild);
    }
  });
}

updateStepIcons();

function showForm(animationDirection) {
  formSteps.forEach((formStep) => {
    if (formStep.dataset.step == currentStep) {
      clearAnimationClasses(formStep);

      formStep.classList.add(animationDirection);

      formStep.classList.add("current");
    } else if (formStep.classList.contains("current")) {
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
    formSteps[currentStep - 2].classList.add("moveOutRight");
    showForm("moveInLeft");
  }
});

buttonNext.addEventListener("click", () => {
  if (currentStep < 4) {
    currentStep++;
    console.log(formSteps[currentStep - 1]);
    formSteps[currentStep - 1].classList.add("moveOutLeft");
    showForm("moveInRight");
  }
});
