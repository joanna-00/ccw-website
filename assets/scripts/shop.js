if (window.location.pathname.includes("shop.html")) {
  const shopItems = requestWP(tagEndPoint, tagShop, renderShop);
}

// Shop redirect to individual page

// let shopCard;

// shopCard.addEventListener("click", () => {
//   sessionStorage.setItem("redirectServiceID", shopCard.id);
// });

// Shop rendering

function renderShop(shopItems) {
  const containerExterior = $(".shop main #sectionExterior"),
    containerInterior = $(".shop main #sectionInterior"),
    containerBundles = $(".shop main #sectionBundles"),
    containerMemberships = $(".shop main #sectionMemberships");

  shopItems.forEach((item) => {
    let filter = item.acf.service_type_filter[0];

    filter = parseFilter(filter);

    switch (filter) {
      case "memberships":
        containerMemberships.innerHTML += createMembershipCard(item);
        break;
      case "exterior":
        containerExterior.innerHTML += createShopCard(item);
        break;
      case "interior":
        containerInterior.innerHTML += createShopCard(item);
        break;
      case "bundles":
        containerBundles.innerHTML += createShopCard(item);
        break;
    }
  });

  addToggleToCheckbox(checkboxExterior, containerExterior);
  addToggleToCheckbox(checkboxInterior, containerInterior);
  addToggleToCheckbox(checkboxBundles, containerBundles);
  addToggleToCheckbox(checkboxMemberships, containerMemberships);

  const serviceCards = $$(".shop__service-card.card--clickable");

  serviceCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      let serviceID = card.querySelector(".card__button").id;
      localStorage.setItem("redirectServiceID", serviceID);
      location.href = "individual_service.html";
    });
  });

  const serviceButtons = $$(".shop__service-card .card__button");
  const membershipButtons = $$(".shop__membership-card .card__button");

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      addToShoppingCart(event);
    });
  });
}

function createMembershipCard(shopItem) {
  shopItem = shopItem.acf;
  return `        <div class="col-12 col-sm-6 col-xl-3">
  <div class="shop__membership-card card card--membership card--image">
    <div class="card__image">
      <img src="${shopItem.membership_icon}" alt="" />
    </div>
    <div class="card__content">
      <h4 class="card__title">${shopItem.membership_title}</h4>
      <p class="card__description">
        ${shopItem.membership_description}
      </p>
      <button
        class="button button--base-lg button--secondary button--filled"
      >
        Buy now
      </button>
    </div>
  </div>
</div>`;
}

function createShopCard(shopItem) {
  let post = shopItem;
  shopItem = shopItem.acf;
  // console.log(shopItem.isavailable);
  if (shopItem.isavailable) {
    return `<div class="col-12 col-sm-6 col-xl-4">
  <div
    class="shop__service-card card card--image card--button card--description card--price card--clickable"
  >
    <div class="card__image">
      <img
        src="${shopItem.thumbnail_image.url}"
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
        <h4 class="card__price">${shopItem.price},-</h4>
        <button
          class="card__button button button--base-lg button--primary-light"
          id="${post.id}"
        >
          Add to cart
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    </div>
  </div>
</div>`;
  } else {
    return `<div class="col-12 col-sm-6 col-xl-4">
  <div
    class="shop__service-card card card--image card--button card--description card--price card--disabled"
  >
    <div class="card__image">
      <img
        src="${shopItem.thumbnail_image.url}"
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
        <h4 class="card__price">${shopItem.price},-</h4>
        <button
          class="card__button button button--base-lg button--disabled"
          id="${post.id}"
        >
          Add to cart
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    </div>
  </div>
</div>`;
  }
}

// Filtering

const checkboxExterior = $("#checkboxExterior"),
  checkboxInterior = $("#checkboxInterior"),
  checkboxBundles = $("#checkboxBundles"),
  checkboxMemberships = $("#checkboxMemberships");

function addToggleToCheckbox(checkbox, container) {
  checkbox.addEventListener("change", () => {
    container.classList.toggle("hidden");
  });
}

// SHOPPING CART

function addToShoppingCart(e) {
  let serviceID = e.target.id;

  if (!localStorage.getItem("shoppingCart")) {
    let currentShoppingCart = [];
    currentShoppingCart.push(serviceID);
    localStorage.setItem("shoppingCart", JSON.stringify(currentShoppingCart));
  } else {
    let currentShoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
    currentShoppingCart.push(serviceID);
    localStorage.setItem("shoppingCart", JSON.stringify(currentShoppingCart));
  }
}

localStorage.getItem("redirectServiceID");
