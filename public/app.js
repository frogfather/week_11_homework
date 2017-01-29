var offset = 0;
var pokemon = [];
var searchResults = [];
var pokemonDetails = [];
var limit;

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
  parsedJSON =JSON.parse(jsonString);
  if (parsedJSON.results === undefined){
    console.log(parsedJSON);
    pokemonDetails.push(parsedJSON);
    if (pokemonDetails.length == searchResults.length){
      sortDetails(pokemonDetails);
      loadSprites();
      }
    } else
    {
    pokemon = parsedJSON.results;  
    sortPokemon(pokemon);
    listPokemon(searchResults);
    };
  };

var sortPokemon = function(data){
  data.sort(function(a,b){
    return a.name.localeCompare(b.name);
  });
}

var sortDetails = function(data){
  data.sort(function(a,b){
    return a.name.localeCompare(b.name);
  });
}

var clearTable = function(){
  var pokemonDiv = document.querySelector("#pokemon-list");
  var table = document.createElement("table");
  table.removeEventListener('click',tableClick);
  if (pokemonDiv.childNodes.length > 0){
    while (pokemonDiv.childNodes.length > 0){ 
      pokemonDiv.removeChild(pokemonDiv.childNodes[0]);
    };
  }
}  

var listPokemon = function(data){
  clearTable();
  if (data.length > 0){
    createTableHeadings();
    var shortArray = [];
    limit = 21;
    if (offset+limit >= data.length){
      limit = data.length - offset;
    } 
    for (var i=0+offset;i<limit+offset;i++){
      shortArray.push(data[i]);
      if ((shortArray.length == 3) || (i == data.length-1)){
        addNewRow(shortArray);
        shortArray.length = 0;
      };
    };
  }; 
};

var addNewRow = function(pokemonArray){
  addTableRow();
  var table = document.querySelector("table");
  var lastRow = table.rows.length-1;
  for (var i = 0; i< pokemonArray.length; i++){
    var image = document.createElement("img");
    var detailUrl = pokemonArray[i].url; 
    setRequestParameters(detailUrl);
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
      var detailLink =  findLink(selected);
      console.log("detail link below");
      console.log(detailLink);
      }
      detailDiv = document.querySelector("#details");
      detailDiv.innerText = selected;
    }
  };

var loadSprites = function(){
  console.log(pokemonDetails);
  var table = document.querySelector("table");
  console.log(table.rows[0].cells[1].innerHTML);
  for (var i= 0; i< pokemonDetails.length;i++){
   var row = Math.floor(i/3);
   var col = i % 3;
   console.log("i "+i);
   console.log("row "+row);
   console.log("col "+col);
   var spriteUrl = pokemonDetails[i].sprites.front_default;
   table.rows[row].cells[col].firstElementChild.src = spriteUrl;
  }
}

var findLink = function(name){
  for (var i=0; i<pokemon.length;i++){
     if (pokemon[i].name == name){
      return pokemon[i].url;
    }
  }
  return "";
}


window.onload = init;

var getNext = function(){
// this is going to show the next of the searched pokemon
if (offset + 21 < pokemon.length - 1){
    offset +=21;
    pokemonDetails = [];
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
pokemonDetails = [];  
listPokemon(pokemon);
};

var getSearch = function(){
  var searchQuery = document.querySelector("#search-query");
  //maybe some filtering here so we can
  //search on other parameters than name?
  searchResults = [];
  pokemonDetails = [];
  searchResults = pokemon.filter(function(obj){
    return obj.name.includes(searchQuery.value);
  })
  listPokemon(searchResults);
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


