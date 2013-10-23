$(document).ready( function(){
    var m = Math;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var t; // timeout for animation
	var random = new Alea(m.random());//a better random number generator

    
    //model variables
	var BETA = 0;
	var THERMTIME= Infinity, TIME=0;  //measured in metropolis sweeps
	var SAMPLE = false;
	var NX = 100, NY = 100, SD= 5;
    var X= NX*SD, Y = NY*SD;
    
    //size canvas element
    canvas.setAttribute('width', ''+X);
    canvas.setAttribute('height', ''+Y);
    $("#body").width(X);
	$("body").width(X);

	
	//initialize ising model
	i = new ising();
	
	
	//----------------Simulation Interface----------------//	
	 $('#start').click(function(){
		console.log("START");
		i.run();
	})
	
	$('#stop').click(function(){
		console.log("STOP");
		clearTimeout(t);
		i.print();
	})
	
	$('#reset').click(function(){
		clearTimeout(t);
		$('#magval').text('?');
		i.reset();
	})
	
	$('#display').click(function() {
		$('#display').hide();
		$('#input').show();
	});
	
	$('#input').keypress(function(event) {
		//user presses 'return'
		if(event.which==13){
			var v = parseFloat($('input[type="val"]').val());
			BETA = ( v >= 0 ) ? v : BETA;
			$('#display').text('BETA=' + BETA);
			$('#input').hide();
			$('#display').show();
		}
	});
	
	//Start sampling 
	$('#mag').click(function() {
		THERMTIME=TIME;
	});	
	
	
	//--------------------Ising Class--------------------//
    function ising(){    
		var cells = [];
		var M = [];//M[i], the sum of spins over all cells at T=i 
		reset();
	    
	    //--------Ising Interface----------//
	    this.run = function(){ run(); }
	    this.reset = function(){ reset(); }
	    this.print = function(){ printM(); }
		
		//--------Ising Class functions--------//
		function reset(){
			TIME = 0;
			THERMTIME=Infinity;
			ctx.clearRect(0, 0, X, Y);
	
			for (var i=0;i<NY;i++) {
				cells[i] = [];
				for(var j=0;j<NX;j++){
					s = ( (random()-1/2) > 0 ? 1 : -1)
					cells[i][j] = new Cell(i,j,s);
					cells[i][j].draw();
				}		
			}
		}
		
		//update ising model
        function run(){
        	sweep();
			t = setTimeout(run,1);
			if(TIME>THERMTIME+99){ clearTimeout(t); printM(); }
        }
        
        //draw all cells
		function draw(){
			ctx.clearRect(0, 0, X, Y);
			for(var i=0;i<NY;i++){
				for(var j=0;j<NX;j++){
					cells[i][j].draw();
				}
			}
		}

		//--------Ising Class Simulation Helpers------//
		
		//Perform a Metropolis Sweep at BETA = 1/k_B*TEMP
		function sweep(){		

			//randomly select cell elements NX*NY times
			for(var k = 1; k<NX*NY; k++){
				var i = m.floor(NY*random());
				var j = m.floor(NX*random());
				var dH = deltaH(i,j);
				//flip the state of the selected element if it decreases the hamiltonian
				if (dH<=0){
					cells[i][j].s = -cells[i][j].s;
				}
				else {
					if (random() < m.exp(- BETA * dH)){
						cells[i][j].s = -cells[i][j].s;
					}
				}
			}
			draw();
			updateM();
			
			//wait until model has thermalized before sampling magnetization			
			if(TIME >= THERMTIME){ 
				updateMagnetization();
			}

			//increment time
			TIME = TIME +1;

		}

		//compute change in energy do to flipping the state of cell(i,j)
		function deltaH(i,j){
			return  2*cells[i][j].s * (cells[ (i-1+NY) % NY][j].s 
					+ cells[ (i+1) % NY][j].s + cells[i][ (j-1+NX) % NX].s 
					+ cells[i][ (j+1) % NX].s );
		}
		
		//computation average magnetization over all spin states of current model configuration
		function updateM(){
			var mag = 0;
			for(var i=0;i<NY;i++){
				for(var j=0;j<NX;j++){
					mag = mag + cells[i][j].s;
				}
			}
			M[TIME] = mag/(NX*NY);
		}
				
		//estimate magnetization and update the display
		function updateMagnetization(){
			var sum=0;
			for(var i=THERMTIME; i<=TIME; i++ ) { sum += M[i]; }
			avgmag= sum/(TIME-THERMTIME+1);
			$('#magval').text(''+(m.pow(avgmag,2)).toFixed(8));
		}

		function printM(){
			console.log("Magnetization^2 Time Series:");
			M2 = $.map(M,function(el, i){ return (m.pow(el,2)).toFixed(8)});
			console.log(M2.join(", "));
		}	
	}
    
    //-----------------Cell Class--------------------//

    function Cell(ii,jj,s){
        this.i = ii; // vertical index 
        this.j = jj; // horizontal index
        this.s = s; // spin state (+1 or -1)

		//converts cell position in matrix to spatial coordinates
		//black for spin up (+1), white for spin down (-1)
        this.draw = function() {
			if (this.s == 1 ){
				ctx.fillStyle = "#000000"; 
				ctx.fillRect(SD * this.j ,SD * this.i ,SD, SD);
			}
			else{
				ctx.fillStyle = "#ffffff"; 
				ctx.fillRect(SD * this.j ,SD * this.i ,SD, SD);
			}

        }
    } 
})

