//------------SEED ARRAY CLASS------//
function SeedArray(gene,canvasID,nx,ny,binsize,nsteps, stats){
	//dependencies
	var random = new Alea(Math.random());//a better random number generator

	//Seed array variables
	var parentGene = gene;
	var history = [parentGene];
	var seeds = [];
	var generation = 0;
	
	var canvas = document.getElementById(canvasID);
	var context = canvas.getContext('2d');

	//Seed array display constants
	var NX = nx, NY = ny; //odd to keep the parent centered
	var BINSIZE = binsize;
	var NSTEPSPERMUTATION= nsteps;
	var ALPHA = 1;
	var SHOWSTATS = stats;
	var CLEAR = true;
	var SHOWSEEDMASS=true;
	var DRAW = true;
	var CONTOUR = false;
	
	canvas.setAttribute('width', ''+NX*BINSIZE);
	canvas.setAttribute('height', ''+NY*BINSIZE);
	
	draw();
	
	//---------EXTERNAL METHODS-------//
	this.reset = function(newGene){
		parentGene = newGene;
		history = [parentGene];
		//generation ++;
		generation = 0;
		draw();
	}
	this.draw = function(){ draw() };
	this.mutate = function(x,y){ 
		var i = Math.floor(x/BINSIZE);
		var j = Math.floor(y/BINSIZE);
		mutate(i,j);
	}
	this.clear = function(){ clear() };
	this.log = function(){ log() };
	this.alert = function() { alertLog() };
	this.getParentGene = function(){ return parentGene; }
	this.getGeneration = function(){ return generation; }
	this.getHistory = function(){ return history; }
	this.getNStepsPerMutation = function() { return NSTEPSPERMUTATION; }
	this.setParentGene = function(newGene) { parentGene = newGene; }
	this.setClear = function(newClear){ CLEAR = newClear; }
	this.setAlpha = function(newAlpha){ ALPHA = newAlpha; }
	this.setNStepsPerMutation = function(newSteps){ NSTEPSPERMUTATION =newSteps; }
	this.setShowSeedMass = function(showM){ SHOWSEEDMASS = showM; }
	this.setDraw = function(draw){ DRAW = draw; }
	this.setContour = function(newContour) { CONTOUR = newContour; } 
			
	//---------INTERNAL METHODS-------//
	function draw(){
		for(var i=0; i<NX; i++){
			seeds[i]=[];
			for(var j=0; j<NY; j++){
				seeds[i][j] = new Seed(i,j,parentGene);
				seeds[i][j].mutate(NSTEPSPERMUTATION);
				DRAW ? seeds[i][j].draw(SHOWSTATS,ALPHA): null;
			}
		}
	}
	
	function clear(){
		for(var i=0; i<NX; i++){
			for(var j=0; j<NY; j++){
				seeds[i][j].clear();
			}
		}
	}
	
	//create new family of seeds from mutations of the parent seed
	function mutate(i,j){
		parentGene = seeds[i][j].g;
		history.push(parentGene);
		generation +=1;
		draw();
	}
	
	function log(){
		for(var i=0; i<NX; i++){
			for(var j=0; j<NY; j++){
				console.log( generation + ',' + (seeds[i][j].g.flatten()).toString() + ',' + seeds[i][j].area);
			}
		}
	}
	
	function alertLog(){
		s = '';
		for(var i=0; i<NX; i++){
			for(var j=0; j<NY; j++){
				s += generation + ',' + seeds[i][j].g.flatten().toString() + ',' + seeds[i][j].area + '\n';
			}
		}
		alert(s);
	}
	
	
	//------------SEED ClASS------------//	
	function Seed(i,j,gene){
		this.i = i;
		this.j = j;
		this.g = gene.clone();
		this.area;

		var x = BINSIZE*(i+1/2); //center
		var y = BINSIZE*(j+1/2); //center
		var hue = ( 200*random()+ 200*( ( i+1 + j*NX)/(NX * NY)) ) % 255  ;
		
		//------------SEED MEHTHODS------------//
		this.clear = function(){clear(); }
		this.draw = function(showStats,alpha){
			CLEAR ? clear() : null;
			
			//draw border
			context.globalAlpha = 1;
			context.beginPath();
        	context.rect(x-BINSIZE/2, y-BINSIZE/2, BINSIZE, BINSIZE);
        	context.lineWidth = 1;
        	context.strokeStyle = 'black';
        	context.stroke();
			
			context.globalAlpha = alpha;
			//Draw seed wing using the parameters stored in gene 
			drawSeedCurve(this.g[1][0],this.g[2][0],this.g[2][1],this.g[1][1]);
			drawSeedCurve(this.g[1][0],this.g[2][2],this.g[2][3],this.g[1][1]);	
			
			//draw seed mass 
			if(SHOWSEEDMASS){
				drawSeedMass(this.g[0], this.g[1]);
				context.textAlign = "middle";
				// textBaseline aligns text vertically relative to font style
				context.textBaseline = "bottom";
				context.fillStyle = "black";
			}
    		
    		//update area of seed 
    		this.area = area(this.i,this.j);
			
    		//Display seed statistics
    		if(showStats){
    			context.fillText('GEN: ' + generation, x-BINSIZE/2, y+BINSIZE/2 - 40);
				context.fillText('MASS: ' + this.g[0], x-BINSIZE/2, y+BINSIZE/2 - 30);
				context.fillText('AREA: ' + this.area, x-BINSIZE/2, y+BINSIZE/2 - 20);
				context.fillText('P1,P2: ' + this.g[1].flatten().printf(), x-BINSIZE/2, y+BINSIZE/2 - 10);
				context.fillText('Q1,Q2,Q3,Q4: ' + this.g[2].flatten().printf(), x-BINSIZE/2, y+BINSIZE/2 - 0);
			}			
		}
		
		
		//mutate seed genes randomly via a random walk  
		this.mutate = function(step){
			for(var i=0; i< step; i++){
				//mutate mass
				this.g[0] = random()<0.05 ? Math.max( this.g[0] + Math.round(2*(random() - 0.5)), 1): this.g[0]   ;
				
				if(random()>1/2){
					//mutate primary coordinates
					var index = Math.floor( (this.g[1].length) * random());
					if(index == 0){
						this.g[1][index][0] = Math.max(this.g[1][index][0] + Math.round(10* (random() - 1/2)), 1);	
					}
					else{
						this.g[1][index][0] = Math.min(this.g[1][index][0] + Math.round(10* (random() - 1/2)),-1);	
					}
				}
				else{
				// or mutate control parameters  
				//Restrict each parameter to one sector 
					var index = Math.floor( (this.g[2].length) * random()) ;
					for(var j=0; j<2; j++){
						if (this.g[2][index][j]>0){
							this.g[2][index][j] = Math.max(this.g[2][index][j] + Math.round(25* (random() - 1/2)), 1);
						}
						else{
							this.g[2][index][j] = Math.min(this.g[2][index][j] + Math.round(25* (random() - 1/2)), -1);
						}
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
			if(CONTOUR){
				context.strokeStyle = "black"; // line color
				context.stroke();
			}
			else{
				context.strokeStyle = "grey"; // line color
				context.stroke();
				context.fillStyle = 'hsl(' + hue + ', 50%, 50%)';
				//context.fillStyle = "grey"; // fill color
				context.fill();
			}
		}
		
		function drawSeedMass(mass,pointGenes){
			context.beginPath();
			context.arc(x , y , mass, 0, 2*Math.PI,true);
			context.strokeStyle = "black"; // line color
			context.stroke();
			context.fillStyle = "black"; // line color
			context.fill();
		}
		
		function clear(){
			context.clearRect(x-BINSIZE/2, y-BINSIZE/2,BINSIZE,BINSIZE)
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