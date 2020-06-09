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
          data-id="${post.id}"
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
    class="shop__service-card card card--image card--button card--description card--price"
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

// Shopping cart

function addToShoppingCart(e) {
  let serviceID = e.target.dataset.id;

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
}

function renderShoppingCart(shoppingCartItems) {
  let shoppingCartItemsContainer = $(".shoping-cart__items-container");
  let checkoutCardContainer = $(".checkout-card__container");

  let itemsToRender = JSON.parse(localStorage.getItem("itemsToRender"));
  // itemsToRender = JSON.parse(localStorage.getItem("itemsToRender"));

  shoppingCartItems.forEach((item) => {
    shoppingCartItemsContainer.innerHTML += createShopppingCartCard(
      item,
      itemsToRender
    );
  });

  checkoutCardContainer.innerHTML = createCheckoutSummary(
    shoppingCartItems,
    itemsToRender
  );

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

function createCheckoutSummary(shoppingCartItems, itemsToRender) {
  console.log(shoppingCartItems);
  let output = "";
  let totalPrice = 0;
  shoppingCartItems.forEach((item) => {
    let ID = item.id;
    item = item.acf;
    totalPrice += Number(item.price);
    console.log(totalPrice);
    output += `
    <div class="checkout-card__item">
      <p class="checkout-card__item-name">${item.title}</p>
      <p class="checkout-card__item-price">${item.price}</p>
    </div>`;
    // return output;
  });

  let checkoutSummary = "";
  checkoutSummary += `<div class="card checkout-card">`;
  checkoutSummary += output;
  // const renderItems = (itemsToRender) => {
  //   let output = "";
  //   for (const ID in itemsToRender) {
  //     output += `
  //   <div class="checkout-card__item">
  //     <p class="checkout-card__item-name">a</p>
  //     <p class="checkout-card__item-price">aa</p>
  //   </div>`;
  //   }
  //   return output;
  // };

  // checkoutSummary += renderItems(itemsToRender);
  checkoutSummary += `

  <div class="checkout-card__coupon">
  <p class="checkout-card__coupon-label">Coupon</p>

  <input
    type="text"
    name=""
    id="coupon"
    class="checkout-card__coupon-input text-input__input"
  />
</div>


  <div class="checkout-card__total">
    <h6>Total:</h6>
    <h6 class="checkout-card__total-price">${totalPrice}</h6>
  </div>


  <div class="checkout-card__buttons">
    <button
      class="checkout-card__button button button--base-lg button--primary-light button--filled"
    >
      Proceed to checkout
    </button>
  </div>
</div>`;
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

// function changeAmount(type, event) {
//   console.log(event.target.parentElement.dataset.id);
//   let currentID = event.target.parentElement.dataset.id;
//   let currentItemAmount = JSON.parse(localStorage.getItem("itemsToRender"))[
//     `${currentID}`
//   ];
//   if (type == "decrease") {
//     currentItemAmount--;
//   } else if (type == "increase") {
//     currentItemAmount++;
//   }

//   const cardAmountDisplay = event.target.parentElement.querySelector(
//     ".card__amount--display"
//   );
//   updateDisplay(currentID, currentItemAmount, itemsToRender, cardAmountDisplay);
// }

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
  removeAllButton.addEventListener("click", deleteAllItems);
}

function deleteAllItems() {
  localStorage.removeItem("itemsToRender");
  localStorage.removeItem("shoppingCart");
  location.reload();
}

function updateTotal() {}
