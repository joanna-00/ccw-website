const shopItems = requestWP(tagEndPoint, tagShop, renderShop);

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
  let shopContainer = $(".shop main");
  shopItems.forEach((item) => {
    // let filters = [];
    // item.acf.service_type_filter.forEach((filter) => {
    //   filters.push(parseFilter(filter));
    // });
    // console.log(filters);
    let filter = item.acf.service_type_filter[0];
    // console.log(filter);
    filter = parseFilter(filter);

    switch (filter) {
      case "memberships":
        containerMemberships.innerHTML += createMembershipCard(item);
        console.log(filter);
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
      default:
      // code block
    }
  });

  addToggleToCheckbox(checkboxExterior, containerExterior);
  addToggleToCheckbox(checkboxInterior, containerInterior);
  addToggleToCheckbox(checkboxBundles, containerBundles);
  addToggleToCheckbox(checkboxMemberships, containerMemberships);
}

function createMembershipCard(shopItem) {
  shopItem = shopItem.acf;
  return `        <div class="col-12 col-sm-6 col-xl-3">
  <div class="card card--membership card--image">
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
  return `<div class="col-12 col-sm-6 col-xl-4">
  <div
    class="card card--image card--button card--description card--price card--clickable"
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
}

// Filtering

const checkboxExterior = $("#checkboxExterior"),
  checkboxInterior = $("#checkboxInterior"),
  checkboxBundles = $("#checkboxBundles"),
  checkboxMemberships = $("#checkboxMemberships");

console.log(checkboxExterior);

function addToggleToCheckbox(checkbox, container) {
  checkbox.addEventListener("change", () => {
    container.classList.toggle("hidden");
    console.log("changed");
  });
}
