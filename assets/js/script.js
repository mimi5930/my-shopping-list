//
var searchHistoryItemArr = ["test"]
var searchHistoryPriceArr = ["test"]
// bestbuy api - request to find a departmentstores with area codes
fetch("https://api.bestbuy.com/v1/products(name=iphone*)?show=salePrice&apiKey=Ou7MZjAsEdRGa1vhKpsui9Xg")
 .then(function(response) {
  response.json().then(function(data) {
    console.log(data);
  });
});

//bingmaps api - request to find a departmentstores with area codes 
fetch("https://dev.virtualearth.net/REST/v1/LocalSearch/?type=DepartmentStores&Locations?postalCode=22003&key=AlhvFsP11Bn7teegeVUFvdrw312hORJoNPDjnSGs5qZk5S9lwrAspUQw5wk9wi9I")
 .then(function(response) {
  response.json().then(function(data) {
    console.log(data);
  });
});

//best api - request to find a stores with postal code with in 10 mile raduis 
fetch("https://api.bestbuy.com/v1/stores(area(55423,10))?show=storeId,name,hours,distance&apiKey=Ou7MZjAsEdRGa1vhKpsui9Xg")
 .then(function(response) {
    response.json().then(function(data) {
      console.log(data);
    });
});


// function that adds Item and Price to their arrays and then adds them to the local storage
var saveToHistoryArr = function(Item, Price){
  for(var i = 0; i < searchHistoryItemArr.length; i++){
  localStorage.setItem("Item: " + i, Item)
  console.log(searchHistoryItemArr)
}
  for(var i = 0; i < searchHistoryPriceArr.length; i++){
  localStorage.setItem("Price: " + i, Price)
  console.log(searchHistoryPriceArr)
}
}
saveToHistoryArr("TV", "20")

var bestbuyApiKey = "Ou7MZjAsEdRGa1vhKpsui9Xg";

var itemInputE1 = document.querySelector("#item-input");
var itemNameE1 = document.querySelector("#item-text");

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
  var apiUrl = "https://api.bestbuy.com/v1/products(name=" + item + "*)?&format=json&show=name,salePrice&pageSize=1&apiKey=" + bestbuyApiKey;

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
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to connect to bestbuy");
    });
};


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


itemInputE1.addEventListener("click", formSubmitHandler);
