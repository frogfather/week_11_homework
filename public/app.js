var offset = 0;
var pokemon;
var searchResults;
var details = false;

var init = function(){
 // get all the pokemon
 setRequestParameters("http://pokeapi.co/api/v2/pokemon/?limit=80");
  var event = document.createEvent("KeyboardEvent");
  window.addEventListener(onkeydown,function(e){
      e.preventDefault();
      canvas.fillText(e.keyCode,150,150);
    });
  var upButton = document.querySelector("#up-button");
  var downButton = document.querySelector("#down-button");
  var searchButton = document.querySelector("#search-button");
  upButton.onclick = getPrev;
  downButton.onclick = getNext;
  searchButton.onclick = getSearch;
  };

var setRequestParameters = function(address){
  url = address;
  makeRequest(url,requestComplete);  
}

var makeRequest = function(url,callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
};

var requestComplete = function(){
  if (this.status !==200) return;
  var jsonString = this.responseText;
  if (details){
    //returned data is to do with individual
    //pokemon details
    } else
    {
    pokemon = JSON.parse(jsonString).results;
    sortPokemon(pokemon);
    listPokemon(pokemon);
    };
  };

var sortPokemon = function(data){
  data.sort(function(a,b){
    return a.name.localeCompare(b.name);
  })
}

var clearTable = function(){
  var pokemonDiv = document.querySelector("#pokemon-list");
  if (pokemonDiv.childNodes.length > 0){
    while (pokemonDiv.childNodes.length > 0){ 
      pokemonDiv.removeChild(pokemonDiv.childNodes[0]);
    };
  }
}  

var listPokemon = function(data){
  clearTable();
  createTableHeadings();
  var shortArray = [];
  var limit = 21;
  if (offset+limit >= data.length){
    limit = data.length - offset;
  } 
  for (var i=0+offset;i<limit+offset;i++){
    shortArray.push(data[i]);
    if ((shortArray.length == 3) || (i == data.length-1)){
      addNewRow(shortArray);
      shortArray.length = 0;
    };
  } 
}

var addNewRow = function(pokemonArray){
  addTableRow();
  var table = document.querySelector("table");
  var lastRow = table.rows.length-1;
  for (var i = 0; i< pokemonArray.length; i++){
    var image = document.createElement("img");
    image.src = "https://nerdburglars.net/wp-content/uploads/2016/07/pokemon-egg.jpg";
    table.rows[lastRow].cells[i].innerText =  pokemonArray[i].name;
    table.rows[lastRow].cells[i].appendChild(image);

  };
};

var createTableHeadings = function(){
  var pokemonDiv = document.querySelector("#pokemon-list");
  var table = document.createElement("table");
  table.className = "center";
  pokemonDiv.appendChild(table);
  table.addEventListener('click',tableClick);
  //why does this work?!
}

var addTableRow = function(){
  var table = document.querySelector("table");
  var tableRow = document.createElement("tr");
  table.appendChild(tableRow);
  for (var i=0; i<3; i++){
  var cell = document.createElement("td");
  // var cellText = document.createTextNode("");
  // cell.appendChild(cellText);
  tableRow.appendChild(cell);
  };
}

var tableClick = function(event){
    if ((event.target.tagName === "TD")||(event.target.tagName === "IMG")){
      console.log(event.path[0].innerText);
      console.log(event);
      var selected; 
      if (event.target.tagName === "TD"){
        selected = event.target.innerText;  
      } else
      {
        selected = event.target.parentElement.innerText;
      }
      detailDiv = document.querySelector("#details");
      detailDiv.innerText = selected;
    }
  }

window.onload = init;

var getNext = function(){
// this is going to show the next of the searched pokemon
if (offset + 21 < pokemon.length - 1){
    offset +=21;
    listPokemon(pokemon);
  }; 
} 

var getPrev = function(){
//this is going to show the previous of the searched pokemon
if (offset > 20){
  offset -= 21;
  } 
  else
  {
  offset = 0;
  };
listPokemon(pokemon);
};

var getSearch = function(){

}
var hideTable = function(){
  // table = document.querySelector("#pokemon-list");
  // table.style.display = "none";
}


window.onkeydown = function(event){
  switch (event.keyCode){
    case 38:
    getPrev();
    break;
    case 40:
    getNext();
    break;
  };
};


