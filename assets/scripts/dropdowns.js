let dropdown_Title = $(".dropdown__title");
let dropdown_OptionsContainer = $(".dropdown__options-container");

dropdown_Title.addEventListener("click", () => {
  dropdown_OptionsContainer.classList.toggle("hidden");
});
