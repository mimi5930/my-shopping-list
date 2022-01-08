//

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