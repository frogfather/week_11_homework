var pokemon;
var searchResults;

var init = function(){
 // get all the pokemon
 setRequestParameters("http://pokeapi.co/api/v2/pokemon/?limit=20");
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
  pokemon = JSON.parse(jsonString).results;
  sortPokemon(pokemon);
  console.log(pokemon);
  // clearTable();
  // createTableHeadings();
  // listPokemon(pokemon.results);
  };

var sortPokemon = function(data){
  data.sort(function(a,b){
    return a.name.localeCompare(b.name);
  })
}

var clearTable = function(){
  var pokemonDiv = document.querySelector("#pokemon-list");
  if (pokemonDiv.childElementCount > 0){
    pokemonDiv.removeChild(pokemonDiv.childNodes[0]);
  }
}  

var listPokemon = function(data){
  var shortArray = [];
  var lastItem = data[data.length - 1];

  data.forEach(function(result){
    shortArray.push(result);
    if ((shortArray.length == 3) || (result === lastItem)){
      addNewRow(shortArray);
      shortArray.length = 0;
    };
  });
}

var addNewRow = function(pokemonArray){
  addTableRow();
  var table = document.querySelector("table");
  var lastRow = table.rows.length-1;
  for (var i = 0; i< pokemonArray.length; i++){
    table.rows[lastRow].cells[i].textContent =  pokemonArray[i].name;
   };
};

var createTableHeadings = function(){
  var pokemonDiv = document.querySelector("#pokemon-list");
  var table = document.createElement("table");
  pokemonDiv.appendChild(table);

  table.addEventListener('click',function(event){
    if (event.target.tagName === "TD"){
      // fetch the one we've clicked on
      console.log(event.path[0].innerText);
      window.location.href="details.html"
    }
  });
}

var addTableRow = function(){
  var table = document.querySelector("table");
  var tableRow = document.createElement("tr");
  table.appendChild(tableRow);
  for (var i=0; i<3; i++){
  var cell = document.createElement("td");
  var cellText = document.createTextNode("");
  cell.appendChild(cellText);
  tableRow.appendChild(cell);
  }
}


window.onload = init;

var getNext = function(){
// this is going to show the next of the searched pokemon
} 

var getPrev = function(){
//this is going to show the previous of the searched pokemon
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


