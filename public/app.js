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
      };
      var detailObject = findDetail(selected);
      loadDetails(detailObject);
    }
  };

var loadDetails = function(data){
  detailDiv = document.querySelector("#details");
  if (detailDiv.childNodes.length > 0){
    while (detailDiv.childNodes.length > 0){ 
      detailDiv.removeChild(detailDiv.childNodes[0]);
    };
  };
  var image = document.createElement("img");
  image.src = data.sprites.front_default; 
 
  var table = document.createElement("table");
  table.className = "detail-table";
  detailDiv.appendChild(table);
  var tableRow;
  var tableData;
  for (var i = 0;i<8;i++){
    tableRow = document.createElement("tr");
    table.appendChild(tableRow);
    tableData = document.createElement("td");
    tableRow.appendChild(tableData);
    tableData = document.createElement("td");
    tableRow.appendChild(tableData);
  }
  //for each parameter add a new row
  console.log(data);
  console.log(table.rows[0]);
  table.rows[0].cells[0].innerText = data.name;
  table.rows[0].cells[1].appendChild(image)
  table.rows[1].cells[0].innerText = "Abilities";
  if (data.abilities.length >0){
  var detailText = "";
  for (var i=0;i<data.abilities.length;i++){
    if (detailText != ""){detailText += "\n"};
    detailText += data.abilities[i].ability.name;
    };
  };
  table.rows[1].cells[1].innerText = detailText;
  table.rows[2].cells[0].innerText = "Forms";
  detailText = "";
  if (data.forms.length >0){
   for (var i=0;i<data.forms.length;i++){
     if (detailText != ""){detailText += "\n"};
     detailText += data.forms[i].name;
     };
   };
  table.rows[2].cells[1].innerText = detailText;
  table.rows[2].cells[0].innerText = "Height";
  table.rows[2].cells[1].innerText = data.height;
  table.rows[3].cells[0].innerText = "Held items"
  detailText = "";
  if (data.held_items.length >0){
   for (var i=0;i<data.held_items.length;i++){
     if (detailText != ""){detailText += "\n"};
     detailText += data.held_items[i].name;
     };
   };

  table.rows[3].cells[1].innerText = detailText;
  table.rows[4].cells[0].innerText = "Moves";
  detailText = "";
  if (data.moves.length >0){
   for (var i=0;i<data.moves.length;i++){
     if (detailText != ""){detailText += "\n"};
     detailText += data.moves[i].move.name;
     };
   };
    table.rows[4].cells[1].innerText = detailText;
    table.rows[5].cells[0].innerText = "Stats";
    detailText = "";
    if (data.stats.length >0){
     for (var i=0;i<data.stats.length;i++){
       if (detailText != ""){detailText += "\n"};
       detailText += data.stats[i].stat.name;
       };
     };
    

    table.rows[5].cells[1].innerText = detailText;
    table.rows[6].cells[0].innerText = "Types";
    detailText = "";
    if (data.types.length >0){
     for (var i=0;i<data.types.length;i++){
       if (detailText != ""){detailText += "\n"};
       detailText += data.types[i].type.name;
       };
     };
    table.rows[6].cells[1].innerText = detailText;
    table.rows[7].cells[0].innerText = "Weight";
    table.rows[7].cells[1].innerText = data.weight;
  
}

var loadSprites = function(){
  var table = document.querySelector("table");
  for (var i= 0; i< pokemonDetails.length;i++){
   var row = Math.floor(i/3);
   var col = i % 3;
   var spriteUrl = pokemonDetails[i].sprites.front_default;
   table.rows[row].cells[col].firstElementChild.src = spriteUrl;
  }
}

var findDetail = function(name){
  if (pokemonDetails.length > 0){
    for (var i=0; i< pokemonDetails.length; i++){
      if (pokemonDetails[i].name == name){
        return pokemonDetails[i];
      }
    }
  }
  return null;
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


