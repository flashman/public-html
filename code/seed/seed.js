$(document).ready( function(){
    var m = Math;
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
	var random = new Alea(Math.random());//a better random number generator

    //setup canvas and bin size
    var NX = 3, NY = 3; //odd to keep the parent centered
    var BINSIZE = 200;
    canvas.setAttribute('width', ''+NX*BINSIZE);
    canvas.setAttribute('height', ''+NY*BINSIZE);

	
	//initialize seed
	var l1 = 30;
	var l2 = l1 * 1.3
	var GENE = [[1,1],[l1,l1],[l1,l2],[l1,l2],[l1,l2],[l1,l2]]; 	
	var GENEHISTORY = [GENE];
	var GENERATION = 0;
	var s = new SeedArray(GENE);
	
	
	//-------------USER INTERFACE-------------//
	$("#canvas").click(function(){
		coords = canvas.relMouseCoords(event);
		canvasX = coords.x;
		canvasY = coords.y;
		s.mutate(canvasX, canvasY)
		GENERATION += 1;
		$("#genval").text(GENERATION);
	})
	
	$("#save").click(function(){
		// save canvas image as data url (png format by default)
		var dataURL = canvas.toDataURL();
		window.open(dataURL);
	})

	$("#reset").click(function(){
		console.log(GENE);
		s.parentGene = GENE;
		s.reset();
		GENERATION = 0;
		$("#genval").text(GENERATION);
	})
	
	//------------SEED ARRAY CLASS------//
	function SeedArray(gene){
		var parentGene = gene;
		var seeds = [];
		
		reset();
		
		//---------EXTERNAL METHODS-------//
		
		this.reset = function(){ reset() };
		this.draw = function(){ draw() };
		this.mutate = function(x,y){ 
			var i = Math.floor(x/BINSIZE);
			var j = Math.floor(y/BINSIZE);
			mutate(i,j);
		}
		
		this.mutate2 = function(x,y){
			var i = Math.floor(x/BINSIZE);
			var j = Math.floor(y/BINSIZE);
			seeds[i][j].mutate(40);
			seeds[i][j].draw();
		}
		
		//---------INTERNAL METHODS-------//
		function reset(){
			for(var i=0; i<NX; i++){
				seeds[i]=[];
				for(var j=0; j<NY; j++){
					seeds[i][j] = new Seed(i,j,parentGene);
					if(i != (NX-1)/2 || j != (NY-1)/2){
						seeds[i][j].mutate(60);
					}
					seeds[i][j].draw();
				}
			}
		}

		function mutate(i,j){
			parentGene = seeds[i][j].g;
			reset();
		}
	}
	
	//------------SEED ClASS------------//	
	function Seed(i,j,gene){
		this.i = i;
		this.j = j;
		this.x = BINSIZE*(i+1/2); //center
		this.y = BINSIZE*(j+1/2); //center
		this.g = [];
		
		//create local copy of gene
		for(var m in gene){
			this.g[m]=[]
			for(var n in gene[m]){
				this.g[m][n]=gene[m][n];
			}
		}
		
		//------------SEED MEHTHODS------------//
		this.draw = function(){
			context.clearRect(BINSIZE* this.i, BINSIZE* this.j,BINSIZE,BINSIZE);
			
			//Draw seed wing using the parameters stored in gene 
			context.beginPath();
			context.moveTo(this.x-this.g[1][0],this.y);
			context.lineTo(this.x+this.g[1][1],this.y);
			context.bezierCurveTo(
				this.x+this.g[1][1], this.y+this.g[2][1], 				this.x-this.g[3][0],this.y+this.g[3][1], 
				this.x-this.g[1][0], this.y);
			context.lineTo(this.x,this.y);
			context.lineTo(this.x+this.g[1][1],this.y)
			context.bezierCurveTo(
				this.x+this.g[1][1], this.y-this.g[4][1], 				this.x-this.g[5][0],this.y-this.g[5][1], 
				this.x-this.g[1][0], this.y);
			context.lineTo(this.x,this.y);
			context.lineWidth = 3;
			context.strokeStyle = "black"; // line color
			context.stroke();
			
			//draw seed 
			context.beginPath();
			context.arc(this.x, this.y, this.g[0][0], 0, 2*Math.PI,true);
			context.stroke();
			context.fill();
		}
		
		this.mutate = function(step){
			for(var i=0; i< step; i++){
				var p1 = Math.floor(this.g.length * random());
				var p2 = Math.round(random());
				var s = (p1>0 ? 5 : 2);
				var delta = s*(random()-1/2);
				this.g[p1][p2] = Math.abs(this.g[p1][p2] + delta);   
			}
		}	
	}
});