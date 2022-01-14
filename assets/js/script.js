var itemInputE1 = document.querySelector("#item-input");
var itemNameE1 = document.querySelector("#item-text");
var zipInputEl = document.querySelector("#zip-button");
var zipNameEl = document.querySelector("#zip-text");
var zipNameDisplayEl = document.querySelector(".city-name");

var bestbuyApiKey = "Ou7MZjAsEdRGa1vhKpsui9Xg";

var totalPriceE1 =document.querySelector('#total-price');
var searchHistoryItemArr = []
var searchHistoryPriceArr = []

var getLoc = function() {
  var search = zipNameEl.value;
  if (search === "") {
    return;
  }

  // update text to entered zip code
  changeZipText(search);

  var bestbuyapiUrl = "https://api.bestbuy.com/v1/stores(area(" + search + ",50))?&format=json&show=storeId,storeType,lat,lng,distance&apiKey=" + bestbuyApiKey;

  fetch(bestbuyapiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            createLocationArr(data);
          });
        };
      }
    );
};

// change the text to display searched zip code
var changeZipText = function(text) {
  zipNameDisplayEl.textContent = text;
}

// create array from store locations data
var createLocationArr = function(data) {
  var locationDataArr = [];
  length = data.stores.length;
  for (var i = 0; i < length; i++) {
    var lat = data.stores[i].lat;
    var lon = data.stores[i].lng;
    var storeType = data.stores[i].storeType;
    // make store name more user-friendly
    if (!storeType) {
      storeType = "Best Buy Outlet";
    }
    else if (storeType === "Big Box") {
      storeType = "Best Buy";
    }
    // creates an object with relevant data
    var storeInfo = {
      type: storeType,
      lat: lat,
      lon: lon,
    }
    locationDataArr.push(storeInfo);
  }
  addMapPushpin(locationDataArr);
}

var saveToLocationDataArr = function(){
  localStorage.setItem("Location Lat", JSON.stringify(locationDataArr))
  localStorage.setItem("Location Lng", JSON.stringify(locationDataArr))
} 

var getFromHistoryArr = function(){
  var localItem = JSON.parse(localStorage.getItem("Item History"));
  var localPrice = JSON.parse(localStorage.getItem("Price History"));
  for(var i= 0;i < localPrice.length; i++){
    searchHistoryPriceArr.push(localPrice[i])
    searchHistoryItemArr.push(localItem[i])
  }
  var totalPrice = 0;
  for(i = 0; i < searchHistoryPriceArr.length; i++){
    var price = searchHistoryPriceArr[i];
    var name = searchHistoryItemArr[i];
    displayProduct(name,price)
    totalPrice += price;
    totalPriceE1.textContent = ' $' + totalPrice;
  }
}
// function that adds Item and Price to their arrays and then adds them to the local storage
var saveToHistoryArr = function(){
  localStorage.setItem("Item History", JSON.stringify(searchHistoryItemArr))
  localStorage.setItem("Price History", JSON.stringify(searchHistoryPriceArr)) 
}

var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var itemName = itemNameE1.value.trim();

  if (itemName) {
    getProduct(itemName);

    // clear old content
    itemNameE1.value = "";
  } 

};


var getProduct = function(item) {
  // format the api url
  var apiUrl = "https://api.bestbuy.com/v1/products(name=" + item + "*)?&format=json&show=name,salePrice&pageSize=3&apiKey=" + bestbuyApiKey;

  // make a get request to url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          console.log(data);
          var productName = data.products[0].name;
          var productPrice = data.products[0].salePrice;

          displayProduct(productName, productPrice);
          updateArrays(productName, productPrice)
          
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to bestbuy");
    });

};
var deleteItem = function(Price) {
    var index = searchHistoryPriceArr.indexOf(Price)
    console.log(index)
    if(index > -1){
      searchHistoryPriceArr = searchHistoryPriceArr.splice(index +1)
      searchHistoryItemArr =  searchHistoryItemArr.splice(index +1)
    }
    console.log(searchHistoryItemArr)
    console.log(searchHistoryPriceArr)
    updateArrays()
}
var updateArrays = function(Item, Price){
  if(Item, Price){
  searchHistoryItemArr.push(Item);
  searchHistoryPriceArr.push(Price);
  }

  var totalPrice = 0;

  for(i = 0; i < searchHistoryPriceArr.length; i++){
    totalPrice += searchHistoryPriceArr[i];
    totalPriceE1.textContent = ' $' + Math.round(totalPrice * 100) /100;
  }
  if (!searchHistoryPriceArr[0]){
    totalPriceE1.textContent = ''
  }
  saveToHistoryArr();
}

var displayProduct = function(name,price) {
  var table = document.getElementById("myTableData");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);


    row.insertCell(0).innerHTML= name + '<br><input type="button" class="btn red darken-4" value = "Remove item" onClick="deleteRow(this)">';
    row.insertCell(1).innerHTML=  '$' + price;
}

function deleteRow(obj) {
  var index = obj.parentNode.parentNode.rowIndex;
  var table = document.getElementById("myTableData");
  table.deleteRow(index);
  var itemPrice = obj.parentNode.parentNode.getElementsByTagName("td")[1]
  var price = parseFloat(itemPrice.textContent.replace(/\$|,/g, ''))
  console.log(price)
  deleteItem(price)
}

// Modal asking users if they want to delete an item
// Get the modal
var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }

// initial map load
function loadMapScenario() {
  var placeholderLat = 44.86326725347792;
  var placeholderLon = -93.29279234302264;
  var map = new Microsoft.Maps.Map("#myMap", {
    center: new Microsoft.Maps.Location(placeholderLat, placeholderLon)
  });
  var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(44.86326725347792, -93.29279234302264), {title: "Best Buy"});
  map.entities.push(pushpin);
}

// add pushpins and center map to include them all
function addMapPushpin (arr) {
  // make new array of just the coordinates for bing api to center
  locationRange = [];
  arrLength = arr.length;
  for (var i = 0; i < arrLength; i++) {
    var lat = arr[i].lat;
    var lon = arr[i].lon;
    var currentLoc = new Microsoft.Maps.Location(lat, lon);
    locationRange.push(currentLoc);
  }

  // find center coordinates from array of locations
  var rect = Microsoft.Maps.LocationRect.fromLocations(locationRange);

  // create new map based on coordinates entered
  var map = new Microsoft.Maps.Map("#myMap", {
    bounds: rect,
    padding: 80
  });
  // add pushpins for nearest best buys
  for (var i = 0; i < arrLength; i++) {
    var lat = arr[i].lat;
    var lon = arr[i].lon;
    var title = arr[i].type;
    var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lon), {title: title});
    map.entities.push(pushpin);
  }
}

// event listeners
zipInputEl.addEventListener("click", getLoc);
itemInputE1.addEventListener("click", formSubmitHandler);
getFromHistoryArr();