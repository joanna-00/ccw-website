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

function requestWP(endpoint, id) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText).reverse();
      data = acfParser(data);
      console.log(data);
      return data;
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

const shopItems = requestWP(catEndPoint, catService);

function renderShop(data, outputContainer, filters) {
  data.forEach((service) => {
    `<div class="col-4">
    <div
      class="card card--image card--button card--description card--price"
    >
      <div class="card__image">
        <img
          src="../../assets/images/photos/steering-wheel-wash.jpg"
          alt=""
        />
      </div>
      <div class="card__content">
        <div class="card__label">
          <h4 class="card__title">
            Card title
          </h4>
          <h4>
            <a href="" class="card__link"
              ><i class="fas fa-arrow-right"></i
            ></a>
          </h4>
        </div>

        <p class="card__description">
          card teext text textcard teext text textcard teext text
          textcard teext text textcard teext text text
        </p>

        <div class="card__features">
          <h4 class="card__price">175</h4>
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
  });
}
