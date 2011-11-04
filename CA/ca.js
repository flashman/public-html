$(document).ready( function(){
    var m = Math;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var t; // timeout 
    var X = 256, Y = 256, d = 4;
	var states = 2;
    var ruleLength = 3; //odd
	var ruleCount = m.pow(states,ruleLength);
	var totalRules = m.pow(states, ruleCount);
	var hist = [], hPos=-1;

//-----------------ViewModel------------------------//
    $('#next').click(function(){
			var r=0;
			if ( hPos<0 || hPos >= hist.length-1 ){
				hPos+=1;
				r = m.round(m.random() * totalRules)-1;
				hist.push(r);
			}
			else if ( hPos>=0 && hPos < hist.length-1){
				hPos+=1;
				r = hist[hPos]
			}
			$('input[type="val"]').val(r)
			$('#message').text('Rule ' + r);
			$('#input').hide();
			$('#message').show();
			ca(r); 
		});
		
		$('#prev').click(function(){
			if (hist.length>1){
				hPos-=1;
				var r = hist[hPos];
				$('#message').text('Rule ' + r);
				$('input[type="val"]').val(r);
				$('#input').hide();
				$('#message').show();				
				ca(r);
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
				r = parseInt(r);
				if(r > -1 || r < 1){
					if(r<0 || r>=totalRules){
						r = m.ceil(m.random() * totalRules)-1;
					}
				}
				else{
					r = "random";
				}
				hist.push(r);
				$('#message').text('Rule ' + r);
				$('#input').hide();
				$('#message').show();
				ca(r); 
			}
		});
		
		$('#canvas').click(function() {
			var r = hist[hPos];
			ca(r); 
		});

	//--------------------CA Class--------------------//
    function ca(n){
        ctx.clearRect(0, 0, X*d, Y*d);
        var rn = (n == "random" ? m.ceil(m.random() * totalRules)-1 : n );
        var j=0, cellRow = [], rule = new Rule(rn,ruleLength) ;
        cellRow[j] = new CellRow(X,j);
        cellRow[j].draw();
        draw();
        
        function draw(){
            for(j=1;j<Y;j++){
            	if(n=="random"){
            		rn = m.ceil(m.random() * totalRules)-1;
	            	rule = new Rule(rn,ruleLength);
            	}
                cellRow[j] = rule.apply(cellRow[j-1]);
                cellRow[j].draw();
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
    	$this.this;
    	this.nArray = nArray;
    	this.nRules = this.nArray.length;
    	this.nbhd = nbhd;
    	this.rules = [];
    	$.each(this.nArray,function(i,val){
    		this.rules[i] = new Rule(val,this.nbhd);		
    	});
    	
    	this.apply = function(rowContainer,currentPos){
    		$.each($this.rules, function(i,rule){
    			rowConainter[currentPos+1] = rule.apply(rowContainer[i]);
    			currentPos += 1;
    			rowContainer[currentPos].draw();
    		});
    		return currentPos;
    	}
    }
    

    //-----------------Cell Row Rules Class----------------//
    
    function Rule(num,nbhd){
    	$this = this;
        this.n = num;
        this.nbhd = nbhd;
        this.bin = this.n.toString(states);
        while(this.bin.length < ruleCount){
            this.bin = '0' + this.bin ;
        }
        this.rule = generateRule();

        this.apply = function(row){        	
			var n=row.x,i,j;
			var rr = (ruleLength-1)/2;
			var newRow = new CellRow(row.x,row.y +1) ;
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
		function generateRule(){
			var a = $this.bin;
			var rule = a.split('').reverse();
			$.each(rule,function(i,val){
				rule[i] = parseInt(val);
			});
			console.log(rule);
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

