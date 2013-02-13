$(document).ready( function(){
    var m = Math;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var t; // timeout for animation
    var random = new Alea(m.random()); //a better random number generator

    
    //model variables
    var TIME=0;
    var FLIP=0;
    var DENSITY = 0.5;
    var NX = 100, NY = 100, SD= 5;
    var X= NX*SD, Y = NY*SD;
    
    //size canvas element
    canvas.setAttribute('width', ''+X);
    canvas.setAttribute('height', ''+Y);
    $("#body").width(X);
    $("body").width(X);
	
    //initialize ising model
    life = new Life();
   
    //----------------Simulation Interface----------------//	
    $('#start').click(function(){
	console.log("START");
	life.run();
    });
    
    $('#stop').click(function(){
	console.log("STOP");
	clearTimeout(t);
    });
	
    $('#reset').click(function(){
	console.log("RESET");
	clearTimeout(t);
	life.reset();
    });

    $('#clear').click(function(){
	console.log("CLEAR");
	clearTimeout(t);
	life.clear();
    });

    $('#display').click(function() {
	$('#display').hide();
	$('#input').show();
    });

    $('#input').keypress(function(event) {
	//user presses 'return'
	if(event.which==13){
	    var v = parseFloat($('input[type="val"]').val());
	    DENSITY = ( v >= 0 ) ? v : DENSITY;
	    $('#display').text('INITIAL DENSITY=' + DENSITY);
	    $('#input').hide();
	    $('#display').show();
	    life.reset();
	    life.run();
	}
    });


    //--------------------Manage Time-------------------//
    function incrementTime(){
	TIME += 1;
	FLIP = (FLIP+1) % 2;
    }


    //--------------------Life Class--------------------//
    function Life(){    
	cells = [];
	reset();
    
	//--------Ising Interface----------//
	this.run = function(){ run(); }
	this.reset = function(){ reset(); }
	this.clear = function(){ clear(); }
	
	//--------Ising Class functions--------//
	function clear(){
	    TIME = 0;
	    FLIP = 0;
	    ctx.clearRect(0, 0, X, Y);
	}
	
	function reset(){
	    clear();
	    if (cells.length == 0){
		for (var i=0;i<NY;i++) {
		    cells[i] = [];
		    for(var j=0;j<NX;j++){
			a = ( (DENSITY-random()) > 0 ? 1 : 0)
			cells[i][j] = new Cell(i,j,a);
			cells[i][j].draw();
		    }		
		}
	    }
	    else {
		for (var i=0;i<NY;i++) {
		    for(var j=0;j<NX;j++){
			a = ( (DENSITY-random()) > 0 ? 1 : 0)
			cells[i][j].reset(a);
			cells[i][j].draw();	
		    }
		}
	    }
	}
		
	function run(){
            update();
	    t = setTimeout(run,10);
	}
        
	function update(){
	    for (var i = 0; i<NY; i++){
		for (var j = 0; j<NX; j++){
		    cells[i][j].update(); 
		}
	    }
	    incrementTime();
	    draw();
	}

	function draw(){
	    ctx.clearRect(0, 0, X, Y);
	    for(var i=0;i<NY;i++){
		for(var j=0;j<NX;j++){
		    cells[i][j].draw();
		}
	    }
	}

	//-----------------Cell Class--------------------//
	
	function Cell(ii,jj,ss){
	    var i = ii; // vertical index 
	    var j = jj; // horizontal index
	    var s = [ss,0];
	    
	    //interface
	    this.getI = function() {return i};
	    this.getJ = function() {return j};
	    this.clear = function() { clear(); }
	    this.reset = function(ss) { reset(ss); }
	    this.alive = function() { return alive(); }
	    this.die = function() { die(); } 
	    this.live = function() { live(); } 
	    this.update = function() { update(); }
	    this.draw = function() { draw(); }
	    
	    //methods
	    function clear(){
		s = [0,0];
	    }
	    
	    function reset(ss){
		s = [ss,0];
	    }
	    
	    function alive(){
		return s[FLIP];
	    }
	    
	    function die(){
		s[(FLIP+1)%2] = 0;
	    }
	    
	    function live(){ 
		s[(FLIP+1)%2] = 1; 
	    } 
	    
	    function update(){
		var ls = getLocalState();
		if (alive()) {
		    if (ls == 1 || ls == 4 ){
			die();
		    }
		    else {
			live();
		    }
		}
		else {
		    if ( ls == 2 ){
			live();
		    }
		    else {
			die();
		    }
		}
	    }
	    
	    function getLocalState(){
		return cells[(i-1+NY) % NY][j].alive() 
		    + cells[ (i+1) % NY][j].alive() 
		    + cells[i][ (j-1+NX) % NX].alive() 
		    + cells[i][ (j+1) % NX].alive() ;
	    }		
	    
	    function draw(){
		if (s[FLIP] == 1 ){
		    ctx.fillStyle = "#000000"; 
		    ctx.fillRect(SD * j ,SD * i ,SD, SD);
		}
		else{
		    ctx.fillStyle = "#ffffff"; 
		    ctx.fillRect(SD * j ,SD * i ,SD, SD);
		}
	    }
	}	
    }
});
