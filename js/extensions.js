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

Array.prototype.flatten = function flatten(){
   var flat = [];
   for (var i = 0, l = this.length; i < l; i++){
       var type = Object.prototype.toString.call(this[i]).split(' ').pop().split(']').shift().toLowerCase();
       if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten.call(this[i]) : this[i]); }
   }
   return flat;
};

String.prototype.toMultiArray = function() {
	var newArray = [];
//	for (var i=0; i<this.length; i++){
	i=0;
	if (this[i] && this[i]=='['){
		if(this[i+1] && this[i+1] == '[' ){
			lastIndex = this.lastIndexOf(']',i);
			newString = this.substring(i+1, lastIndex - i-1);
			newArray.push(newString.toMultiArray());
		}
		else if(this[i+1] && this[i+1].match(/[0-9]/)){
			closingIndex = this.indexOf(']',i);
			newString = this.substring(i+1,closingIndex-1);
			subArray = newString.split(',');
			newArray.push(subArray);			
		}		
	return newArray;
	}
}

// String.prototype.parseToArray = function() {
// 	var newArray = [];
// 	var _local = this.clone();
// //	for (var i=0; i<this.length; i++){
// 	var depth = 0;
// 	for(var i =0; i< _local.length; i++){
// 		if (this[i] && this[i]=='['){
// 			depth ++;
// 		}
// 	}
// 	if(depth>1){
// 		lastIndex = this.lastIndexOf(']',i);
// 		newString = this.substring(i+1, lastIndex - i-1);
// 		newArray.push(newString.toMultiArray());
// 	}
// 	if (this[i] && this[i]=='['){
// 		if(this[i+1] && this[i+1] == '[' ){
// 		}
// 		else if(this[i+1] && this[i+1].match(/[0-9]/)){
// 			closingIndex = this.indexOf(']',i);
// 			newString = this.substring(i+1,closingIndex-1);
// 			subArray = newString.split(',');
// 			newArray.push(subArray);			
// 		}		
// 	return newArray;
// 	}
// }