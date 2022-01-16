var itemInputE1 = document.querySelector("#item-input");
var itemNameE1 = document.querySelector("#item-text");
var zipInputEl = document.querySelector("#zip-button");
var zipNameEl = document.querySelector("#zip-text");
var zipNameDisplayEl = document.querySelector(".zip-name");
var modalContainerE1 = document.querySelector(".modal")

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
    totalPriceE1.textContent = ' $' + totalPrice.toFixed(2);
  }
}
// function that adds Item and Price to their arrays and then adds them to the local storage
var saveToHistoryArr = function(){
  localStorage.setItem("Item History", JSON.stringify(searchHistoryItemArr))
  localStorage.setItem("Price History", JSON.stringify(searchHistoryPriceArr)) 
}

var formSubmitHandler = function(event) {
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
  var apiUrl = "https://api.bestbuy.com/v1/products(name=" + item + "*)?&format=json&show=name,salePrice&pageSize=5&apiKey=" + bestbuyApiKey;

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
          for(var i =0; i < data.products.length; i++) {
            if(searchHistoryItemArr[i] === productName){
              productName = data.products[i + 1].name
              productPrice = data.products[i +1].salePrice
            }
          }
          displayProduct(productName, productPrice);
          updateArrays(productName, productPrice)
          
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      // Handle error for bad request
      function myMessage() {
        M.toast({
          html:'Invalid Item, Please Enter item again',
          classes:'blue darken-4',
          displayLength:1500,
          InDuration: 2000,
          outDuration: 3000
        });
          
      }
      myMessage();
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
    
    totalPriceE1.textContent = ' $' + totalPrice.toFixed(2);

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

    row.insertCell(0).innerHTML= name + '<br><input type="button" data-target="modal1" class="btn red darken-4 modal-trigger" value = "Remove item" onClick=deleteRow(this)>';
    row.insertCell(1).innerHTML=  '$' + price;
}


//Function to delete rows
function deleteRow(obj) {
  var index = obj.parentNode.parentNode.rowIndex;
  var table = document.getElementById("myTableData");  
  var itemPrice = obj.parentNode.parentNode.getElementsByTagName("td")[1]
  var price = parseFloat(itemPrice.textContent.replace(/\$|,/g, ''))


  var modalContent = '<div class="modal-content"><h4>Delete Item</h4><p>Do you want to delete this item from your shopping list?</p>'+
                '</div><div class="modal-footer">'+
                '<div class="modal-footer">'+
                '<a href="#!" id="modal1_noBtn" class="modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>'+
                '<a href="#!" id="modal1_yesBtn" class="modal-action modal-close waves-effect waves-green btn-flat">Yes</a></div>';
  
  $('.modal').append(modalContent);
  $('.modal').modal({ dismissible: false});

  //cancel button modal click event
  $('#modal1_noBtn').click(() => { 
    $('#modal1').modal('close');
    modalContainerE1.textContent = "";
  });

  //yes button modal click event
  $('#modal1_yesBtn').click(() => {

    $('#modal1').modal('close');
    table.deleteRow(index);
    console.log(price)
    deleteItem(price)
    modalContainerE1.textContent = "";   
  });  

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
  if (arrLength > 1) {
    var map = new Microsoft.Maps.Map("#myMap", {
    bounds: rect,
    padding: 80
  });
  // if only one location is returned
  } else {
    var lat = arr[0].lat;
    var lon = arr[0].lon;
    var map = new Microsoft.Maps.Map("#myMap", {
      center: new Microsoft.Maps.Location(lat, lon)
    });
  };

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
$("#zip-text").on("keypress", function(event) {
  if (event.which == 13) {
    event.preventDefault();
    getLoc();
  }
});
itemInputE1.addEventListener("click", formSubmitHandler);
$("#item-text").on("keypress", function(event) {
  if (event.which == 13) {
    event.preventDefault();
    formSubmitHandler();
  }
});
getFromHistoryArr();
