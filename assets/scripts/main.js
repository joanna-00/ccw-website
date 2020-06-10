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
let noEndPoint = "";

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
      let parsedData = acfParser(data);
      console.log(parsedData);
      console.log(data);
      callback(data);
    }
  };
  xhttp.open("GET", `${apiUrl}posts${endpoint}${id}&per_page=100`, true);
  xhttp.setRequestHeader("Authorization", `Bearer ${apiKey}`);
  xhttp.send();
}

function requestPostWP(endpoint, id, callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText);
      console.log(data);
      callback(data);
    }
  };
  xhttp.open("GET", `${apiUrl}posts${endpoint}${id}`, true);
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

// Mobile navigation
if ($(".hamburger")) {
  $(".hamburger").addEventListener("click", function () {
    $(".hamburger").classList.toggle("is-active");
    $("#links-container").classList.toggle("hidden");
    $("#buttons-container").classList.toggle("hidden");
  });
}

// Notifications

const notificationCloseButtons = $$(".notification__close-button");

if (notificationCloseButtons) {
  notificationCloseButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.parentElement.classList.add("fade-out");
      setTimeout(() => {
        e.target.parentElement.remove();
      }, 500);
    });
  });
}

function displayNotification(type, hasIcon, size, title, description) {
  const notificationBody = `<i class="notification__close-button fas fa-times"></i>
  <div class="notification__icon">
    <i class="far fa-envelope icon--alert"></i>
    <i class="fas fa-check-circle icon--success"></i>
    <i class="fas fa-exclamation-circle icon--warning"></i>
    <i class="far fa-bell icon--new"></i>
  </div>
  <div class="notification__content">
      <h4 class="notification__title">${title}</h4>
    <p class="notification__description">
      ${description}
    </p>
  </div>`;

  let newNotification = document.createElement("div");
  newNotification.setAttribute("class", "notification");

  switch (type) {
    case "alert":
      newNotification.classList.add("notification--alert");
      break;
    case "success":
      newNotification.classList.add("notification--success");
      break;
    case "warning":
      newNotification.classList.add("notification--warning");
      break;
    case "new":
      newNotification.classList.add("notification--new");
      break;
  }

  if (hasIcon === true) {
    newNotification.classList.add("notification--icon");
  }

  switch (size) {
    case "sm":
      newNotification.classList.add("notification--sm");
      break;
    case "md":
      break;
  }

  newNotification.innerHTML += notificationBody;

  $("body").appendChild(newNotification);
  setTimeout(() => {
    newNotification.classList.add("fade-out");
    setTimeout(() => {
      newNotification.remove();
    }, 500);
  }, 5000);
}

function playAnimation(className, duration, element) {
  console.log("playing animation");
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

const onScroll =
  window.requestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

const queryTablet = window.matchMedia(
  "(min-width: 421px) and (max-width: 780px)"
);
const queryMobile = window.matchMedia("(max-width: 420px)");

function isElementInViewport(element) {
  let rect = element.getBoundingClientRect();
  if (queryMobile.matches) {
    return rect.top <= 650;
  } else if (queryTablet.matches) {
    return rect.top <= 600;
  } else {
    return rect.top <= 700;
  }
}

// let elemsToShow = document.querySelectorAll(".show-on-scroll");

function checkPosition(elemsToShow, callback) {
  // if (!elemsToShow.length === undefined) {
  //   elemsToShow.forEach(function (elem) {
  //     if (isElementInViewport(elem)) {
  //       callback();
  //     }
  //   });
  //   onScroll(checkPosition);
  // } else {
  if (isElementInViewport(elemsToShow)) {
    callback();
    return;
  }
  onScroll(() => checkPosition(elemsToShow, callback));
  // }
}

// checkPosition();

// SHOP

if (window.location.pathname.includes("shop.html")) {
  const shopItems = requestWP(tagEndPoint, tagShop, renderShop);
}

function renderShop(shopItems) {
  const containerExterior = $(".shop main #sectionExterior"),
    containerInterior = $(".shop main #sectionInterior"),
    containerBundles = $(".shop main #sectionBundles"),
    containerMemberships = $(".shop main #sectionMemberships");

  // Render cards
  shopItems.forEach((item) => {
    let filter = item.acf.service_type_filter[0];
    filter = parseFilter(filter);

    switch (filter) {
      case "memberships":
        containerMemberships.innerHTML += createMembershipCard(item, "shop");
        break;
      case "exterior":
        containerExterior.innerHTML += createShopCard(item, "shop");
        break;
      case "interior":
        containerInterior.innerHTML += createShopCard(item, "shop");
        break;
      case "bundles":
        containerBundles.innerHTML += createShopCard(item, "shop");
        break;
    }
  });

  // Set up filter checkboxes
  addToggleToCheckbox(checkboxExterior, containerExterior);
  addToggleToCheckbox(checkboxInterior, containerInterior);
  addToggleToCheckbox(checkboxBundles, containerBundles);
  addToggleToCheckbox(checkboxMemberships, containerMemberships);

  // Get service IDs to redirect to on card click
  const serviceCards = $$(".shop__service-card.card--clickable");

  serviceCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!event.target.matches(".card__button")) {
        let serviceID = card.querySelector(".card__button").dataset.id;
        localStorage.setItem("redirectServiceID", serviceID);
        location.href = "individual_service.html";
      }
    });
  });

  // Add 'add to cart' functionality to buttons
  const serviceButtons = $$(".shop__service-card .card__button");
  const membershipButtons = $$(".shop__membership-card .card__button");

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      addToShoppingCart(event);
    });
  });
}

function createMembershipCard(shopItem, type) {
  shopItem = shopItem.acf;
  if (type == "homepage") {
    return `        <div class="col-12 col-sm-6 col-lg-3">
  <div class="shop__membership-card card card--membership card--image">
    <div class="card__image">
      <img src="${shopItem.membership_icon}" alt="" />
    </div>
    <div class="card__content">
      <h4 class="card__title">${shopItem.membership_title}</h4>
      <p class="card__description">
        ${shopItem.membership_description}
      </p>
      <h4 class="card__price">${shopItem.price},-</h4>
      <button
        class="button button--base-lg button--secondary button--filled"
      >
        Buy now
      </button>
    </div>
  </div>
</div>`;
  }

  if (type == "shop") {
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
      <h4 class="card__price">${shopItem.price},-</h4>
      <button
        class="button button--base-lg button--secondary button--filled"
      >
        Buy now
      </button>
    </div>
  </div>
</div>`;
  }
}

function createShopCard(shopItem, type) {
  let post = shopItem;
  shopItem = shopItem.acf;
  // console.log(shopItem.isavailable);

  if (type == "recommended") {
    return `<div class="col-xl-3 col-sm-6 col-12">
    <div
      class="card shop-item card--image card--button card--description card--price card--clickable"
    >
      <div class="card__image">
      <div class="card__memberships-badge">
                <span class="card__memberships-badge--platinum"></span>
                <span class="card__memberships-badge--gold"></span>
                <span class="card__memberships-badge--silver"></span>
                <span class="card__memberships-badge--bronze"></span>
              </div>
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
              ><i class="fas fa-arrow-right" aria-hidden="true"></i
            ></a>
          </h4>
        </div>

        <p class="card__description">
        ${shopItem.description_short}
        </p>

        <div class="card__features">
          <h4 class="card__price">${shopItem.price},-</h4>
          <button
            class="card__button button button--base-lg button--primary-light"
            data-id="${post.id}"
          >
            Add to cart
            <i class="fas fa-cart-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
  }

  if (type == "homepage") {
    return `   <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
<div
    class="card shop-item card--image card--button card--description card--price card--clickable">
    <div class="card__image">
        <div class="card__memberships-badge">
                <span class="card__memberships-badge--platinum"></span>
                <span class="card__memberships-badge--gold"></span>
                <span class="card__memberships-badge--silver"></span>
                <span class="card__memberships-badge--bronze"></span>
          </div>
        <img src="${shopItem.thumbnail_image.url}" alt="">
    </div>
    <div class="card__content">
        <div class="card__label">
            <h4 class="card__title">
            ${shopItem.title}
            </h4>
            <h4>
                <a href="" class="card__link"><i class="fas fa-arrow-right"
                        aria-hidden="true"></i></a>
            </h4>
        </div>

        <p class="card__description">
        ${shopItem.description_short}
        </p>

        <div class="card__features">
            <h4 class="card__price">${shopItem.price},-</h4>
            <button class="card__button button button--base-lg button--primary-light"
            data-id="${post.id}">
                Add to cart
                <i class="fas fa-cart-plus" aria-hidden="true"></i>
            </button>
        </div>
    </div>
</div>
</div>`;
  }

  if (type == "shop" && shopItem.isavailable) {
    return `<div class="col-12 col-sm-6 col-xl-4">
  <div
    class="shop__service-card card card--image card--button card--description card--price card--clickable"
  >
    <div class="card__image">
        <div class="card__memberships-badge">
                <span class="card__memberships-badge--platinum"></span>
                <span class="card__memberships-badge--gold"></span>
                <span class="card__memberships-badge--silver"></span>
                <span class="card__memberships-badge--bronze"></span>
              </div>
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
          data-id="${post.id}"
        >
          Add to cart
          <i class="fas fa-cart-plus"></i>
        </button>
      </div>
    </div>
  </div>
</div>`;
  } else if (type == "shop") {
    return `<div class="col-12 col-sm-6 col-xl-4">
  <div
    class="shop__service-card card card--image card--button card--description card--price"
  >
    <div class="card__image">
        <div class="card__memberships-badge">
                <span class="card__memberships-badge--platinum"></span>
                <span class="card__memberships-badge--gold"></span>
                <span class="card__memberships-badge--silver"></span>
                <span class="card__memberships-badge--bronze"></span>
              </div>
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

      </div>

      <p class="description_short">
        ${shopItem.description_short}
      </p>

      <div class="card__features">
        <h4 class="card__price">${shopItem.price},-</h4>
        <button
          class="card__button button button--base-lg button--primary-light"
          data-id="${post.id}"
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
let shoppingCartIcon = $(".nav__shopping-cart--desktop");
const totalCartAmountDot = $("#totalCartAmountDot");

if (localStorage.getItem("shoppingCart")) {
  totalCartAmountDot.classList.remove("hidden");
  let totalCartAmount = JSON.parse(localStorage.getItem("shoppingCart")).length;
  totalCartAmountDot.innerText = totalCartAmount;
} else {
  totalCartAmountDot.classList.add("hidden");
}

// console.log(totalCartAmount);

function addToShoppingCart(e) {
  let serviceID = e.target.dataset.id;

  if (!localStorage.getItem("shoppingCart")) {
    let currentShoppingCart = [];
    if (serviceID) {
      currentShoppingCart.push(serviceID);
    }

    localStorage.setItem("shoppingCart", JSON.stringify(currentShoppingCart));

    playAnimation("shoppingCartAdd", 300, shoppingCartIcon);
    totalCartAmountDot.classList.remove("hidden");
    totalCartAmount = JSON.parse(localStorage.getItem("shoppingCart")).length;
    totalCartAmountDot.textContent = totalCartAmount;
  } else {
    let currentShoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
    if (serviceID) {
      currentShoppingCart.push(serviceID);
    }
    localStorage.setItem("shoppingCart", JSON.stringify(currentShoppingCart));
    playAnimation("shoppingCartAdd", 300, shoppingCartIcon);
    totalCartAmount = JSON.parse(localStorage.getItem("shoppingCart")).length;
    totalCartAmountDot.innerText = totalCartAmount;
  }
}

const stepsContainer = $(".main-homepage__steps__step");

function showStepsProcess() {
  let steps = stepsContainer.children;

  steps = Array.from(steps);
  for (let i = 1; i <= steps.length; i++) {
    setTimeout(() => {
      playAnimation("showStep", 700, steps[i - 1]);
      steps[i - 1].classList.remove("hidden");
    }, 700 * i);
  }
}

if (window.location.pathname.includes("shopping_cart.html")) {
  if (localStorage.getItem("shoppingCart")) {
    let currentShoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));

    // Parse the IDs in the shopping cart to reflect quantity
    let itemsToRender = currentShoppingCart.reduce(function (IDs, ID) {
      if (ID in IDs) {
        IDs[ID]++;
      } else {
        IDs[ID] = 1;
      }
      return IDs;
    }, {});
    console.log(itemsToRender);
    localStorage.setItem("itemsToRender", JSON.stringify(itemsToRender));
    // } else {
    // itemsToRender = JSON.parse(localStorage.getItem("itemsToRender"));

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
    let shoppingCartItems = requestWP(
      noEndPoint,
      requestString,
      renderShoppingCart
    );
  }

  if (localStorage.getItem("notification") == "bookedSuccess") {
    let newTitle = "Your appointment was successfully booked!",
      newDesc =
        'You can see it under "calendar" in your profile or in your e-mail.';

    displayNotification("success", true, "sm", newTitle, newDesc);
    localStorage.removeItem("notification");
  }
}

function renderShoppingCart(shoppingCartItems) {
  let shoppingCartItemsContainer = $(".shoping-cart__items-container");
  let checkoutCardContainer = $(".checkout-card__container");

  let itemsToRender = JSON.parse(localStorage.getItem("itemsToRender"));

  shoppingCartItems.forEach((item) => {
    shoppingCartItemsContainer.innerHTML += createShopppingCartCard(
      item,
      itemsToRender
    );
  });

  checkoutCardContainer.innerHTML = createCheckoutSummary(
    shoppingCartItems,
    itemsToRender,
    "shoppingCart"
  );

  const proceedToCheckoutButton = $("#proceedToCheckoutButton");
  proceedToCheckoutButton.addEventListener("click", () => {
    let coupon = $("#coupon").value;
    localStorage.setItem("coupon", coupon);
  });

  // Set up increase/decrease logic
  const cardAmountIncrease = $$(".card__amount--increase"),
    cardAmountDecrease = $$(".card__amount--decrease"),
    cardAmountDisplay = $$(".card__amount--display");

  cardAmountIncrease.forEach((element) => {
    element.addEventListener("click", (event) => {
      console.log(event.target.parentElement.dataset.id);
      let currentID = event.target.parentElement.dataset.id;
      let currentItemAmount = JSON.parse(localStorage.getItem("itemsToRender"))[
        `${currentID}`
      ];

      currentItemAmount++;

      const cardAmountDisplay = event.target.parentElement.querySelector(
        ".card__amount--display"
      );
      updateDisplay(
        currentID,
        currentItemAmount,
        itemsToRender,
        cardAmountDisplay
      );

      updateShoppingCartLS(itemsToRender);
    });
  });

  cardAmountDecrease.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(event.target.parentElement.dataset.id);
      let currentID = event.target.parentElement.dataset.id;
      let currentItemAmount = JSON.parse(localStorage.getItem("itemsToRender"))[
        `${currentID}`
      ];

      if (currentItemAmount > 0) {
        currentItemAmount--;
      } else if (currentItemAmount == 0) {
        delete itemsToRender[`${currentID}`];
      }

      const cardAmountDisplay = event.target.parentElement.querySelector(
        ".card__amount--display"
      );
      updateDisplay(
        currentID,
        currentItemAmount,
        itemsToRender,
        cardAmountDisplay
      );

      updateShoppingCartLS(itemsToRender);
    });
  });

  // Set up item removal logic
  const removeItemLinks = $$(".card__link");

  removeItemLinks.forEach((item) => {
    item.addEventListener("click", () => {
      console.log("removing");
      let currentID = item.dataset.id;
      console.log(currentID);
      deleteItem(currentID, itemsToRender);
    });
  });
}

function createShopppingCartCard(shopItem, itemsToRender) {
  let currentID = shopItem.id;
  let currentItemAmount = itemsToRender[`${currentID}`];

  shopItem = shopItem.acf;
  if (!currentItemAmount == 0) {
    return `<div class="col-12">
    <div class="card card--horizontal card--image card--price" data-id="${currentID}">
      <div class="card__image">
        <img
          src="${shopItem.thumbnail_image.url}"
          alt=""
        />
      </div>
      <div class="card__content">
        <div class="card__label">
          <h4 class="card__title">  ${shopItem.title}</h4>
          <h4 class="card__link" data-id="${currentID}"><i class="fas fa-trash-alt button--warning icon--right"></i></h4>
        </div>
  
        <p class="card__description">
        ${shopItem.description_short}
        </p>
  
        <div class="card__features">
          <h4 class="card__price">${shopItem.price},-</h4>
          <div class="card__amount" data-id="${currentID}">
            <div class="card__amount--decrease">-</div>
            <div class="card__amount--display">${currentItemAmount}</div>
            <div class="card__amount--increase">+</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  } else {
    return "";
  }
}

function createCheckoutSummary(shoppingCartItems, itemsToRender, type) {
  console.log(shoppingCartItems);
  let output = "";
  let totalPrice = 0;

  shoppingCartItems.forEach((item) => {
    let ID = item.id;
    let itemAmount = itemsToRender[`${ID}`];
    item = item.acf;
    totalPrice += Number(item.price) * itemAmount;
    console.log(totalPrice);
    output += `
    <div class="checkout-card__item">
      <p class="checkout-card__item-name">${itemAmount}x ${item.title}</p>
      <p class="checkout-card__item-price">${itemAmount * item.price}</p>
    </div>`;
  });

  let checkoutSummary = "";
  checkoutSummary += `<div class="card checkout-card">`;
  checkoutSummary += output;

  for (const ID in itemsToRender) {
    output += `
    <div class="checkout-card__item">
      <p class="checkout-card__item-name">a</p>
      <p class="checkout-card__item-price">aa</p>
    </div>`;
  }

  if (type == "shoppingCart") {
    checkoutSummary += `  <div class="checkout-card__coupon">
    <p class="checkout-card__coupon-label">Coupon</p>
  
    <input
      type="text"
      name=""
      id="coupon"
      class="checkout-card__coupon-input text-input__input"
    />
  </div>`;
  }

  if (type == "checkout") {
    checkoutSummary += `  <div class="checkout-card__coupon">
    <p class="checkout-card__coupon-label">Coupon</p>
  
    <p
      id="coupon"
      class="checkout-card__coupon-input">
      ${
        localStorage.getItem("coupon") ? localStorage.getItem("coupon") : "none"
      }
    </p>
  </div>`;
  }

  checkoutSummary += `
  <div class="checkout-card__total">
    <h6>Total:</h6>
    <h6 class="checkout-card__total-price">${totalPrice}</h6>
  </div>`;

  if (type == "shoppingCart") {
    checkoutSummary += `<div class="checkout-card__buttons">
    <a href="checkout.html"
      class="checkout-card__button button button--base-lg button--primary-light button--filled"
      id="proceedToCheckoutButton"
    >
      Proceed to checkout
    </a>
  </div>
</div>`;
  }
  return checkoutSummary;
}

function updateShoppingCartLS(itemsToRender) {
  const updatedShoppingCart = [];
  for (const ID in itemsToRender) {
    console.log(ID);
    console.log(itemsToRender[`${ID}`]);
    for (let i = 0; i < itemsToRender[`${ID}`]; i++) {
      updatedShoppingCart.push(ID);
    }
  }
  console.log(updatedShoppingCart);
  localStorage.setItem("shoppingCart", JSON.stringify(updatedShoppingCart));
}

function updateDisplay(currentID, newAmount, itemsToRender, displayElement) {
  itemsToRender[`${currentID}`] = newAmount;
  displayElement.innerHTML = newAmount;
  console.log(itemsToRender[`${currentID}`]);

  localStorage.setItem("itemsToRender", JSON.stringify(itemsToRender));
}

function deleteItem(ID, itemsToRender) {
  $(`.card[data-id='${ID}']`).remove();
  console.log(itemsToRender[`${ID}`]);
  console.log(itemsToRender);
  delete itemsToRender[`${ID}`];
  console.log(itemsToRender);
  localStorage.setItem("itemsToRender", JSON.stringify(itemsToRender));
}

const removeAllButton = $("#removeAllButton");

if (removeAllButton) {
  removeAllButton.addEventListener("click", () => {
    deleteAllItems(true);
  });
}

function deleteAllItems(shouldRefresh) {
  localStorage.removeItem("itemsToRender");
  localStorage.removeItem("shoppingCart");
  if (shouldRefresh === true) {
    location.reload();
  }
}

function updateTotal() {}

if (
  !localStorage.getItem("shoppingCart") &&
  !localStorage.getItem("itemsToRender") &&
  window.location.pathname.includes("shopping_cart.html")
) {
  $(".shoping-cart__items-container").classList.add("empty");
}

// HOMEPAGE

if (window.location.pathname.includes("index.html")) {
  let requestString = "?include[]=635&include[]=626&include[]=598";

  const stepsContainer = $(".main-homepage__steps__step");

  checkPosition(stepsContainer, showStepsProcess);

  const services = requestWP(noEndPoint, requestString, renderHomepageServices);
  const memberships = requestWP(
    catEndPoint,
    catMembership,
    renderHomepageMemberships
  );
}

function renderHomepageServices(services) {
  let servicesContainer = $(".main-homepage__services__cards");
  services.forEach((item) => {
    servicesContainer.innerHTML += createShopCard(item, "homepage");
  });
}

function renderHomepageMemberships(memberships) {
  let membershipsContainer = $(".main-homepage__memberships__cards");
  memberships.forEach((item) => {
    membershipsContainer.innerHTML += createMembershipCard(item, "homepage");
  });
}

// MEMBERSHIPS

if (window.location.pathname.includes("memberships.html")) {
  let requestString = "?include[]=635&include[]=626&include[]=598";

  const memberships = requestWP(catEndPoint, catMembership, renderMemberships);
  const services = requestWP(
    noEndPoint,
    requestString,
    renderMembershipsServices
  );
}

function renderMemberships(memberships) {
  let membershipsContainer = $(".main-memberships__memberships__cards");
  memberships.forEach((item) => {
    membershipsContainer.innerHTML += createMembershipCard(item, "homepage");
  });
}

function renderMembershipsServices(services) {
  let servicesContainer = $(".main-memberships__services-container");
  services.forEach((item) => {
    servicesContainer.innerHTML += createShopCard(item, "homepage");
  });
}
