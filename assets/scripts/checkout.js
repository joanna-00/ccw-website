const buttonBack = $("#buttonBack");
const buttonNext = $("#buttonNext");

const formSteps = $$(".form-step");

let currentStep = 1;
const processSteps = $$(".process-steps__step");

const stepIcons = [
  "far fa-calendar",
  "fas fa-user",
  "fas fa-car",
  "far fa-credit-card",
];

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

updateStepIcons();

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
  if (currentStep < 4) {
    currentStep++;
    console.log(formSteps[currentStep - 1]);
    formSteps[currentStep - 1].classList.add("moveOutLeft");
    showForm("moveInRight");
    updateStepIcons();
  }
});
