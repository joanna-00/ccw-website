const shopItems = requestWP(tagEndPoint, tagShop, renderShop);

// renderShop(shopItems);

function renderShop(shopItems) {
  let exteriorContainer = $(".shop main #sectionExterior"),
    interiorContainer = $(".shop main #sectionInterior"),
    bundlesContainer = $(".shop main #sectionBundles"),
    membershipsContainer = $(".shop main #sectionMemberships");
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
        membershipsContainer.innerHTML += createMembershipCard(item);
        console.log(filter);
        break;
      case "exterior":
        exteriorContainer.innerHTML += createShopCard(item);
        break;
      case "interior":
        interiorContainer.innerHTML += createShopCard(item);
        break;
      case "bundles":
        bundlesContainer.innerHTML += createShopCard(item);
        break;
      default:
      // code block
    }
    if (filter === "memberships") {
    }
  });
}

function createMembershipCard(shopItem) {
  return `        <div class="col-3">
  <div class="card card--membership">
    <div class="card__image">
      <img src="../../assets/images/svgs/check-24px.svg" alt="" />
    </div>
    <div class="card__content">
      <h4 class="card__title">Platinum</h4>
      <p class="card__description">
        The quick, brown fox jumps over a lazy dog. DJs flock by when
        MTV
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
  shopItem = shopItem.acf;
  return `<div class="col-12 col-lg-6 col-xl-4">
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
