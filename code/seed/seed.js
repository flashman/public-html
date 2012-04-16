$(document).ready( function(){
    var m = Math;
	
	//initialize seed
	var l1 = 40;
	var l2 = l1 * 1.3
	// mass
	var MASSGENE = 1; 
	// start point, end point
	var POINTGENE = [[l1,0], [-l1,0]];  
	// control points for tob lobe, control points for bottom lob
	var SHAPEGENE = [[l1,l2], [-l1,l2], [l1,-l2], [-l1,-l2] ]; 
	var MUTSPERGEN = 20;

/*  MANUALLY SET INITIAL VALUE
	var MASSGENE = 1; // mass
	var POINTGENE = [[14,0], [-13,0]]; // start point, end point 
	// control points for tob lobe, control points for bottom lob
	var SHAPEGENE = [[36,1], [-22,20], [17,-29], [-10,-29] ]; 
*/

	var INITGENE = [MASSGENE,POINTGENE,SHAPEGENE ]; 
	var s = new SeedArray(INITGENE,'canvas',3,3,300,MUTSPERGEN, true);
	var ss = new SeedArray(INITGENE,'canvas-single-seed',1,1,500,MUTSPERGEN,false);
	$('#display #disp-val').text( MUTSPERGEN );	


	//-------------USER INTERFACE-------------//
	$("#canvas").click(function(){
		coords = canvas.relMouseCoords(event);
		canvasX = coords.x;
		canvasY = coords.y;
		s.mutate(canvasX, canvasY);
		$("#genval").text(s.getGeneration());
	});
	
	$("#save").click(function(){
		console.log(s.getHistory().printf());
		
		// save canvas image as data url (png format by default)
		var dataURL = canvas.toDataURL();
		window.open(dataURL);
	});

	$("#reset").click(function(){
		console.log(s.getHistory().printf());
		s.reset(INITGENE);
		$("#genval").text(s.getGeneration());
	});
	
	$('#display').click(function() {
		$('#display').hide();
		$('#input').show();
	});

	
	$('#input').keypress(function(event) {
		//user presses 'return'
		if(event.which==13){
			var v = parseInt($('input[type="val"]').val());
			var MUTSPERGEN = ( v >= 0 ) ? v : s.getNStepsPerMutation();
			s.setNStepsPerMutation(MUTSPERGEN);
			ss.setNStepsPerMutation(MUTSPERGEN);
			$('#display #disp-val').text(MUTSPERGEN );
			$('#input').hide();
			$('#display').show();
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
	//initialize display 
	$("#canvas-single-seed").trigger('click');


	
});
