let currentStep = 3;
const processSteps = $$(".process-steps__step");

// for (let i = 0; i < currentStep; i++) {
processSteps.forEach((step) => {
  if (step.dataset.step <= currentStep) {
    step.getElementsByTagName("i")[0].remove();
    let checkmark = document.createElement("i");
    checkmark.setAttribute("class", "fas fa-check-circle completed");
    // step.appendChild(checkmark);
    step.insertBefore(checkmark, step.firstChild);
  }
});
// }
