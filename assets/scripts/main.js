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
