const redirectServiceID = sessionStorage.getItem("redirectServiceID");

const shopItems = requestWP(
  postEndPoint,
  redirectServiceID,
  renderIndividualService
);

//  Individual page rendering

function renderIndividualService() {
  return ``;
}
