$(document).ready( function(){
    var m = Math;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var t; // timeout 
    var X = 512, Y = 512, d = 1;
    canvas.setAttribute('width', ''+X)
    canvas.setAttribute('height', ''+Y)
    
	var states = 3;
    var nbhd = 3; //odd
	var ruleCount = m.pow(states,nbhd);
	var totalRules = m.pow(states, ruleCount);
	var hist = [], hPos=-1;

//-----------------ViewModel------------------------//
    $('#next').click(function(){
			var r=[0];
			if ( hPos<0 || hPos >= hist.length-1 ){
				hPos+=1;
				r = [m.round(m.random() * totalRules)-1];
				hist.push(r);
			}
			else if ( hPos>=0 && hPos < hist.length-1){
				hPos+=1;
				r = hist[hPos]
			}
			$('input[type="val"]').val(r.join(","))
			$('#message').text('Rule ' + r.join(","));
			$('#input').hide();
			$('#message').show();
			CA(r); 
		});
		
		$('#prev').click(function(){
			if (hist.length>1){
				hPos-=1;
				var r = hist[hPos];
				$('#message').text('Rule ' + r.join(","));
				$('input[type="val"]').val(r.join(","));
				$('#input').hide();
				$('#message').show();				
				CA(r);
			}
		});
		
		$('#message').click(function() {
			$('#message').hide();
			$('#input').show();
		});
		
		$('#input').keypress(function(event) {
			if(event.which==13){
				hPos+=1;
				var r = $('input[type="val"]').val()
				r = r.split(",");
				$.each(r, function(i,v){
					r[i] = parseInt(v)
					if(r[i] > -1 || r[i] < 1){
						if(r[i] <0 || r[i]>=totalRules){
							r[i] = m.ceil(m.random() * totalRules)-1;
						}					
					}
					else{
						r[i] = "random";
					}
				});
				hist.push(r);
				$('#message').text('Rule ' + r.join(","));
				$('#input').hide();
				$('#message').show();
				CA(r); 
			}
		});
		
		$('#canvas').click(function() {
			var r = hist[hPos];
			CA(r); 
		});

	//--------------------CA Class--------------------//
    function CA(n){
        ctx.clearRect(0, 0, X*d, Y*d);
        //var rn = (n == "random" ? m.ceil(m.random() * totalRules)-1 : n );
        var j=0, cellRow = [];
        var rules = new MultiRule(n,nbhd) ;
        cellRow[j] = new CellRow(X,j);
        cellRow[j].draw();
        draw();

        function draw(){
        	var j = 1;
        	while(j<Y){
				j = rules.apply(cellRow,j);
            }
        }

        function animate(){
            j=j+1;
            cellRow[j] = rule.apply(cellRow[j-1]);
            cellRow[j].draw();
            (j < Y ? t = setTimeout(animate,1) : clearTimeout(t) );
        }
    }
    
    //-----------------Multi Rule Class--------------------//
    function MultiRule(nArray,nbhd){
    	$this = this;
    	this.nArray = nArray;
    	this.nRules = nArray.length;
    	this.nbhd = nbhd;
    	this.rules = new Array;
    	for(i=0;i<this.nRules;i++){
			this.rules[i] = new Rule(this.nArray[i],this.nbhd);	
    	}
    	this.apply = function(rowContainer,currentPos){
    		$.each(this.rules, function(i,rule){
    			rowContainer[currentPos] = rule.apply(rowContainer[currentPos-1]);
    			rowContainer[currentPos].draw();
				currentPos += 1;
    		});
    		return currentPos;
    	}
    }
    

    //-----------------Cell Row Rules Class----------------//
    
    function Rule(num,nbhd){
    	$this = this;
        this.n = num;
        this.nbhd = nbhd;
        this.bin = n2bin(num);
        this.rule = generateRule();

        this.apply = function(row){        	
			var n=row.x,i,j;
			var rr = (nbhd-1)/2;
			var newRow = new CellRow(row.x,row.y +1) ;
			if(this.n=="random"){
				this.rule = generateRule();
			}			
			for (i=0;i<row.x;i++){
				var sum = 0;
				for (j=-rr; j<= rr ;j++){
					var jj=i+j;
					if(jj<0){ 
						jj = n+j; 
					}
					else if(jj>=n){ 
						jj= -1+j; 
					}
					sum += row.cell[jj].v * m.pow(states, -j+rr);
				}
				newRow.cell[i].v = $this.rule[sum]; 
			}
			return newRow
        	
        }
        
        this.disp = function($container){
        		
        }

		//----------Rule Helper Functions---------//
		function n2bin(n){
			var bin = n.toString(states);
			while(bin.length < ruleCount){
				bin = '0' + bin ;
        	}
        	return bin;
		}
		
		function generateRule(){
			var bin = $this.bin;
			if($this.n=="random"){
				n = m.ceil(m.random() * totalRules)-1;
				bin = n2bin(n)
			}
			var rule = bin.split('').reverse();
			$.each(rule,function(i,val){
				rule[i] = parseInt(val);
			});
			return rule;
		}
    }
        
    
    //-----------------Cell Row Class----------------------//

    function CellRow(x,y){
        this.cell = [];
        this.x=x;
        this.y=y;

        var i;  
        for(i=0;i<this.x;i++){
            this.cell[i] = new Cell(i*d,d*this.y,d);
        }

        this.draw = function() {
            var j;  
            for(j=0;j<this.x;j++){
                this.cell[j].draw('square');
            }
        }
    }

    //-----------------Cell Class--------------------//

    function Cell(x,y,d){
        this.x = x;
        this.y = y;
        this.d = d;
        this.v = m.round((states-1)*0.95*m.random());

        this.draw = function(shape) {
			if(shape=='circle'){
				ctx.strokeStyle = 'black'; 
				ctx.beginPath();  
				ctx.arc(this.x + d/2,this.y + d/2,this.d/2,0,Math.PI*2,true);
				ctx.stroke();  
				if (this.v > 0 ){
					ctx.fillStyle = 'rgb(' + 255*(1-this.v) +',' + 255*(1-this.v) + ',' + 255*(1-this.v) + ')'; 
					ctx.fill() ;
				}
			}
			else if(shape=='square'){
				if (this.v > 0 ){
                	ctx.fillStyle = "rgb(" + m.floor(255*(1-(this.v/(states-1)))) +"," + m.floor(255*(1-(this.v/(states-1)))) + "," + m.floor(255*(1-(this.v/(states-1)))) + ")"; 
                	ctx.fillRect(this.x ,this.y ,this.d,this.d);
            	}
			}
        }
    } 
})

