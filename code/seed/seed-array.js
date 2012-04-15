//------------SEED ARRAY CLASS------//
function SeedArray(gene,canvasID,nx,ny,binsize,alpha,stats,clear){
	//dependencies
	var random = new Alea(Math.random());//a better random number generator

	//gene
	var parentGene = gene;
	var geneHistory = [parentGene];
	var seeds = [];
	var generation = 0;
	
	var canvas = document.getElementById(canvasID);
	var context = canvas.getContext('2d');

	//setup canvas and bin size
	var NX = nx, NY = ny; //odd to keep the parent centered
	var BINSIZE = binsize;
	var MUTATIONRATE = 20;
	var ALPHA = alpha;
	var SHOWSTATS = stats;
	var CLEAR =clear;
	
	canvas.setAttribute('width', ''+NX*BINSIZE);
	canvas.setAttribute('height', ''+NY*BINSIZE);
	
	
	reset();
	
	//---------EXTERNAL METHODS-------//
	this.reset = function(){ reset() };
	this.mutate = function(x,y){ 
		var i = Math.floor(x/BINSIZE);
		var j = Math.floor(y/BINSIZE);
		mutate(i,j);
	}
	this.getParentGene = function(){ return parentGene; }
	this.setParentGene = function(newGene) { parentGene = newGene; }
	this.getGeneration = function(){ return generation; }
			
	//---------INTERNAL METHODS-------//
	function reset(){
		for(var i=0; i<NX; i++){
			seeds[i]=[];
			for(var j=0; j<NY; j++){
				seeds[i][j] = new Seed(i,j,parentGene);
				//if(i != (NX-1)/2 || j != (NY-1)/2){
					seeds[i][j].mutate(MUTATIONRATE);
				//}
				seeds[i][j].draw(SHOWSTATS,ALPHA);
			}
		}
	}
	//create new family of seeds from mutations of the parent seed
	function mutate(i,j){
		parentGene = seeds[i][j].g;
		reset();
		generation +=1;
	}
	
	
	//------------SEED ClASS------------//	
	function Seed(i,j,gene){
		this.i = i;
		this.j = j;
		this.g = gene.clone();
		this.area;

		var x = BINSIZE*(i+1/2); //center
		var y = BINSIZE*(j+1/2); //center
		
		
		//------------SEED MEHTHODS------------//
		this.draw = function(showStats,alpha){
			clear ? context.clearRect(BINSIZE* this.i, BINSIZE* this.j,BINSIZE,BINSIZE): null;
			
			context.globalAlpha = alpha;
			//Draw seed wing using the parameters stored in gene 
			drawSeedCurve(this.g[1][0],this.g[2][0],this.g[2][1],this.g[1][1]);
			drawSeedCurve(this.g[1][0],this.g[2][2],this.g[2][3],this.g[1][1]);	
			
			//draw seed mass 
			drawSeedMass(this.g[0], this.g[1]);
			context.textAlign = "middle";
    		// textBaseline aligns text vertically relative to font style
   			context.textBaseline = "bottom";
    		context.fillStyle = "black";
    		
    		//update area of seed 
    		this.area = area(this.i,this.j);
			
    		//Display seed statistics
    		if(showStats){
    			context.fillText('GEN: ' + generation, x-BINSIZE/2, y+BINSIZE/2 - 40);
				context.fillText('MASS: ' + this.g[0], x-BINSIZE/2, y+BINSIZE/2 - 30);
				context.fillText('AREA: ' + this.area, x-BINSIZE/2, y+BINSIZE/2 - 20);
				context.fillText('ANCHORS: ' + this.g[1].printf(), x-BINSIZE/2, y+BINSIZE/2 - 10);
				context.fillText('CONTROLS: ' + this.g[2].printf(), x-BINSIZE/2, y+BINSIZE/2 - 0);
			}			
		}
		
		
		//mutate seed genes randomly via a random walk  
		this.mutate = function(step){
			for(var i=0; i< step; i++){
				//mutate mass
				this.g[0] = random()<0.01 ? Math.max( this.g[0] + Math.round(2*(random() - 0.5)), 1): this.g[0]   ;
				
				//mutate primary coordinates
				var index = Math.floor( (this.g[1].length) * random());
				if(index == 0){
					this.g[1][index][0] = Math.max(this.g[1][index][0] + Math.round(5* (random() - 1/2)), 1);	
				}
				else{
					this.g[1][index][0] = Math.min(this.g[1][index][0] + Math.round(5* (random() - 1/2)),-1);	
				}
				
				//mutate control parameters  
				//Restrict each parameter to one sector 
				index = Math.floor( (this.g[2].length) * random()) ;
				for(var j=0; j<2; j++){
					if (this.g[2][index][j]>0){
						this.g[2][index][j] = Math.max(this.g[2][index][j] + Math.round(10* (random() - 1/2)), 1);
					}
					else{
						this.g[2][index][j] = Math.min(this.g[2][index][j] + Math.round(10* (random() - 1/2)), -1);
					}
				}
			}
		}
		//---------------CLASS HELPER METHODS----------------//		
		function drawSeedCurve(start, control1, control2, end){
			context.beginPath();
			context.moveTo(x+start[0], y + start[1]);
			context.bezierCurveTo(
				x+control1[0], y+control1[1], x+control2[0], y+control2[1], 
				x+end[0], y + end[1]);
			context.lineWidth = 3;
			context.strokeStyle = "grey"; // line color
			context.stroke();
			context.fillStyle = "grey"; // line color
			context.fill();
		}
		
		function drawSeedMass(mass,pointGenes){
			context.beginPath();
			context.arc(x , y , mass, 0, 2*Math.PI,true);
			context.strokeStyle = "black"; // line color
			context.stroke();
			context.fillStyle = "black"; // line color
			context.fill();
		}

		function area(i,j){
			var imgd = context.getImageData(BINSIZE* i, BINSIZE*j, BINSIZE, BINSIZE);
			var pix = imgd.data;
			var area = 0;
			//count pixels that are not white, the pixel area
			for (var i = 0, n = pix.length; i < n; i += 4) {
				if( pix[i  ] >0 ) { area += 1; } 
			}
			return area;
		}
	}
}