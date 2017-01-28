function increment(value){
  var val = 50;
  var result = callback(value,val2);  
  return result;
};

var callback = function(val1, val2){
    var return val3 = 100;
    return val1 + val2 + val3;
}

console.log(increment(50,callback));