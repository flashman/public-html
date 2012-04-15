$(document).ready( function(){
    var m = Math;
	
	//initialize seed
	var l1 = 10;
	var l2 = l1 * 1.3
	var MASSGENE = 1; // mass
	var POINTGENE = [[l1,0], [-l1,0]]; // start point, end point 
	// control points for tob lobe, control points for bottom lob
	var SHAPEGENE = [[l1,l2], [-l1,l2], [l1,-l2], [-l1,-l2] ]; 
	var INITGENE = [MASSGENE,POINTGENE,SHAPEGENE ]; 	
	var GENEHISTORY = [INITGENE];
	var s = new SeedArray(INITGENE,'canvas',3,3,300,1,true,true);
	var ss = new SeedArray(INITGENE,'canvas-single-seed',1,1,300,0.01,false,false);
	
	$("#canvas-single-seed").click(function(){
		ss = new SeedArray(INITGENE,'canvas-single-seed',1,1,300,0.01,false,false);
		for(var n=0; n<100; n++){
			ss.mutate(0,0);
		}
	})
	

	//-------------USER INTERFACE-------------//
	$("#canvas").click(function(){
		coords = canvas.relMouseCoords(event);
		canvasX = coords.x;
		canvasY = coords.y;
		GENEHISTORY.push(s.getParentGene());
		s.mutate(canvasX, canvasY);
		$("#genval").text(s.getGeneration());
	});
	
	$("#save").click(function(){
		console.log(GENEHISTORY.printf());
		// save canvas image as data url (png format by default)
		var dataURL = canvas.toDataURL();
		window.open(dataURL);
	});

	$("#reset").click(function(){
		console.log(GENEHISTORY.printf());
		var s = new SeedArray(INITGENE,'canvas',3,3,300,1,true,true);
		$("#genval").text(s.getGeneration());
	});
	
});

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