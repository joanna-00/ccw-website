sessionStorage.setItem("shopping-cart", []);

function addToShoppingCart(e) {
  let serviceID = e.target.dataset.itemID;
  sessionStorage.getItem("shopping-cart").push(serviceID);
}
