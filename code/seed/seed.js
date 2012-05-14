$(document).ready( function(){
    var m = Math;
	
	//initialize seed params
	var MUTSPERGEN = 50;
	var l1 = 45;
	var l2 = l1 * 1.3
	var GENESTRUCTURE = "gen, mass,p1x,p1y,p2x,p2y,q1x,q1y,q2x,q2y,q3x,q3y,q4x,q4y,area";
	var GENEARRAY = [1,l1,0,-l1,0,l1,l2,-l1,l2,l1,-l2,-l1,-l2];

	var INITGENE = arrayToGene(GENEARRAY); 
	var s = new SeedArray(INITGENE,'canvas',3,3,250,MUTSPERGEN, true);
	console.log(GENESTRUCTURE);
	s.log();

	var ss = new SeedArray(INITGENE,'canvas-single-seed',1,1,500,MUTSPERGEN,false);
	
	$('#mut_rate_display #disp-val').text( MUTSPERGEN );	
	$('#gene_display #disp-val').text('[' + GENEARRAY.toString() + ']');


	//-------------USER INTERFACE-------------//
	$("#canvas").click(function(){
		coords = canvas.relMouseCoords(event);
		canvasX = coords.x;
		canvasY = coords.y;
		s.mutate(canvasX, canvasY);
		$("#genval").text(s.getGeneration());
		s.log();
	});
	
	$("#save").click(function(){		
		// save canvas image as data url (png format by default)
		var dataURL = canvas.toDataURL();
		window.open(dataURL);
	});

	$("#reset").click(function(){
		s.reset(INITGENE);
		$("#genval").text(s.getGeneration());
		s.log();
		//s.alert();
	});
	
	$('#mut_rate_display').click(function() {
		$('#mut_rate_display').hide();
		$('#mut_rate_input').show();
	});

	
	$('#mut_rate_input').keypress(function(event) {
		//user presses 'return'
		if(event.which==13){
			var v = parseInt($('#mut_rate_input input[type="val"]').val());
			MUTSPERGEN = ( v >= 0 ) ? v : s.getNStepsPerMutation();
			s.setNStepsPerMutation(MUTSPERGEN);
			ss.setNStepsPerMutation(MUTSPERGEN);
			$('#mut_rate_display #disp-val').text(MUTSPERGEN );
			$('#mut_rate_input').hide();
			$('#mut_rate_display').show();
		}
	});
	
	$('#gene_display').click(function() {
		$('#gene_display').hide();
		$('#gene_input').show();
		$('#gene_input input').val('' + INITGENE.flatten().toString());
	});
	
	$('#gene_input').keypress(function(event) {
		//user presses 'return'
		if(event.which==13){
			var g = ($('#gene_input input').val()).split(",");
			for(var i = 0; i< g.length; i++){
				g[i] = parseInt(g[i]);
			}
			INITGENE = arrayToGene(g);		
			$('#gene_display #disp-val').text('[' + g.toString() + ']');
			$('#gene_input').hide();
			$('#gene_display').show();
		}
	});

	//Display distribution of random walks from given initial gene
	ss.setAlpha(0.01);
	ss.setClear(false);
	ss.setShowSeedMass(false);
	$("#canvas-single-seed").click(function(){
		ss.clear();
		for(var m=0; m< 100; m++){
			ss.setDraw(false);
			ss.reset(INITGENE);
			ss.setNStepsPerMutation(100 * MUTSPERGEN );
			ss.mutate(0,0);
			ss.setDraw(true);
			ss.setNStepsPerMutation(1);
			ss.mutate(0,0);
		}
	})
	
	//initialize random walk display	
	$("#canvas-single-seed").trigger('click');

	function arrayToGene(geneArray){
		g = []
		var M = geneArray[0]; 
		var P = [geneArray.slice(1,1+2), geneArray.slice(3,1+4)];  
		var Q = [geneArray.slice(5,1+6), geneArray.slice(7,1+8), 			
					geneArray.slice(9,1+10), geneArray.slice(11,1+12)]; 
		g.push(M);
		g.push(P);
		g.push(Q);
		return g;
	}
});
