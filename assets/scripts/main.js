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
