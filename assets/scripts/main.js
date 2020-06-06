// SELECTOR FUNCTIONS
const $ = (arg) => {
  return document.querySelector(arg);
};

const $$ = (arg) => {
  return document.querySelectorAll(arg);
};

// WP API

//General information
const apiUrl = "http://nikrus.dreamhosters.com/wp-json/wp/v2/";
const apiKey = "P7yvPmPx0MVgfurtqB7Caxa2DTgJnbZM";

//Endpoints
let postEndPoint = "/";
let catEndPoint = "?categories=";
let tagEndPoint = "?tags=";

//IDs
const tagShop = 28;
const catMembership = 29;
const catService = 30;
const tagBenefit = 25;

function requestWP(endpoint, id, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText).reverse();
      data = acfParser(data);
      console.log(data);
      callback(data);
      // return data;
    }
  };
  xhttp.open("GET", `${apiUrl}posts${endpoint}${id}&per_page=100`, true);
  xhttp.setRequestHeader("Authorization", `Bearer ${apiKey}`);
  xhttp.send();
}

function acfParser(object) {
  let array = [];
  object.forEach((elem) => {
    array.push(elem.acf);
  });

  array = array.reverse();
  return array;
}

function parseFilter(string) {
  return string.split(":")[0];
}

const shopItems = requestWP(catEndPoint, catService, renderShop);

// renderShop(shopItems);

function renderShop(shopItems) {
  let exteriorContainer = $(".shop main #sectionExterior"),
    interiorContainer = $(".shop main #sectionInterior"),
    bundlesContainer = $(".shop main #sectionBundles"),
    membershipsContainer = $(".shop main #sectionMemberships");
  let shopContainer = $(".shop main");

  shopItems.forEach((item) => {
    // console.log(item);
    let filters = [];
    item.service_type_filter.forEach((filter) => {
      filters.push(parseFilter(filter));
    });
    console.log(filters);
    exteriorContainer.innerHTML += createShopCard(item);
  });
}

function createShopCard(shopItem) {
  return `<div class="col-12 col-lg-6 col-xl-4">
  <div
    class="card card--image card--button card--description card--price card--clickable"
  >
    <div class="card__image">
      <img
        src="${shopItem.imageafter}"
        alt=""
      />
    </div>
    <div class="card__content">
      <div class="card__label">
        <h4 class="card__title">
        ${shopItem.title}
        </h4>
        <h4>
          <a href="" class="card__link"
            ><i class="fas fa-arrow-right"></i
          ></a>
        </h4>
      </div>

      <p class="description_short">
        ${shopItem.description_short}
      </p>

      <div class="card__features">
        <h4 class="card__price">${shopItem.price}</h4>
        <button
          class="card__button button button--base-lg button--primary-light"
        >
          Add to cart
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    </div>
  </div>
</div>`;
}
