//General information
const apiUrl = 'http://nikrus.dreamhosters.com/wp-json/wp/v2/';
const apiKey = 'P7yvPmPx0MVgfurtqB7Caxa2DTgJnbZM';

//Endpoints
let postEndPoint = '/';
let catEndPoint = '?categories=';
let tagEndPoint = '?tags=';

//IDs
const tagShop = 28;
const catMembership = 29;
const catService = 30;
const tagBenefit = 25;

function requestWP(storageName, endpoint, id){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const storageName = JSON.parse(this.responseText).reverse();
            console.log(storageName)
            //render(storageName);
        }
    }
    xhttp.open('GET', `${apiUrl}posts${endpoint}${id}&per_page=100`, true);
    xhttp.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    xhttp.send();
}

requestWP('Benefits', tagEndPoint, tagBenefit);