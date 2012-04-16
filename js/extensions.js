Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } 
    else newObj[i] = this[i]
  } 
  return newObj;
}

Array.prototype.printf = function() {
	var newString = '[';
	for (var i=0; i< this.length; i++){
		if(this[i] && typeof this[i] == "object"){
			newString += this[i].printf();	
		}
		else { newString +=  (this[i]).toFixed(0) ; }
		if(i+1 < this.length){newString+= ','; }
	}
	newString +=']';
	return newString;
}
