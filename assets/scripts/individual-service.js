const redirectServiceID = localStorage.getItem("redirectServiceID");

const individualService = requestPostWP(
  postEndPoint,
  redirectServiceID,
  renderIndividualService
);

//  Individual page rendering

function renderIndividualService(individualService) {
  individualService = individualService.acf;
  console.log("rendering page");
  $(".breadcrumbs__item--active").textContent = individualService.title;
  let descriptions = $$(".main-service__info__description-text p");
  descriptions[0].textContent = individualService.description_long_text1;
  descriptions[1].textContent = individualService.description_long_text2;
  descriptions[2].textContent = individualService.description_long_text3;
  let titles = $$(".main-service__info__description-text h3");
  titles[0].textContent = individualService.description_long_title1;
  titles[1].textContent = individualService.description_long_title2;
  titles[2].textContent = individualService.description_long_title3;
  $(".service-info-card__title").textContent = individualService.title;
  $(".service-info-card__price-value").textContent = individualService.price;
  $(
    ".service-info-card__time-value"
  ).textContent = `${individualService.est_time} - ${individualService.est_time_max} hr`;
  $(
    ".main-service__info__image"
  ).style.backgroundImage = `url(${individualService.imageafter})`;
  // return ``;
}
