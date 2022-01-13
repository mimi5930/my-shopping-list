var itemInputE1 = document.querySelector("#item-input");
var itemNameE1 = document.querySelector("#item-text");
var zipInputEl = document.querySelector("#zip-button");
var zipNameEl = document.querySelector("#zip-text");

var bestbuyApiKey = "Ou7MZjAsEdRGa1vhKpsui9Xg";

var totalPriceE1 =document.querySelector('#total-price');
var searchHistoryItemArr = []
var searchHistoryPriceArr = []

var getLoc = function() {
  console.log("function ran");
  var search = zipNameEl.value;
  if (search === "") {
    return;
  }

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

var createLocationArr = function(data) {
  var locationDataArr = []
  length = data.stores.length;
  for (var i = 0; i < length; i++) {
    var lat = data.stores[i].lat;
    var lon = data.stores[i].lng;
    var storeType = data.stores[i].storeType;
    if (!storeType) {
      storeType = "";
    }
    else if (storeType === "Big Box") {
      storeType = "Best Buy";
    }
    var storeInfo = {
      type: storeType,
      lat: lat,
      lon: lon,
    }
    locationDataArr.push(storeInfo);
    addMapPushpin(locationDataArr);
  }

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

var updateArrays = function(Item, Price){
  searchHistoryItemArr.push(Item);
  searchHistoryPriceArr.push(Price);
  

  var totalPrice = 0;
  for(i = 0; i < searchHistoryPriceArr.length; i++){
  
    totalPrice += searchHistoryPriceArr[i];
    totalPriceE1.textContent = ' $' + totalPrice;
    
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
  
}

// TODO: Insert Nate's coordinates into the Bing Maps API functions below
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
  // !Check favorites to find link in documentation to expand the view for all points
  var map = new Microsoft.Maps.Map("#myMap", {
    center: new Microsoft.Maps.Location(arr[0].lat, arr[0].lon)
  });
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    var lat = arr[i].lat;
    var lon = arr[i].lon;
    var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lon), null);
    map.entities.push(pushpin);
  }
}

// event listeners
zipInputEl.addEventListener("click", getLoc);
itemInputE1.addEventListener("click", formSubmitHandler);
getFromHistoryArr();