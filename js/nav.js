$(document).ready( function(){
	page = null;
	page = getHashAndOpen();	
	$(".tab").each(function(){
		$(this).click(function(){ open(this.id); }); 
	});
	
	$(window).bind( 'hashchange', function(e){
		page = getHashAndOpen();	
	});

//-----------HELPERS--------------//	
	function getHashAndOpen(){
		hp = getHashParams();
		if(hp["p"] && hp["p"].length > 0){
			open(hp["p"]);
			return hp["p"];
		}
		else{
			open("home")
			return "home";
		}
	}
	
	function open(newPage){
		$(".selected").each(function(){$(this).removeClass("selected"); });
		$("#" + newPage).addClass("selected");
		$("#body").load( "pages/" + newPage + ".html", function(){ 
		    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		});
		location.hash = "p=" + newPage;
		//use something more like this when you adopt html5 standards 
		//window.history.pushState("change page", newPage, newPage)
	}
	
	function getHashParams() {
		var hashParams = {};
		var e,
			a = /\+/g,  // Regex for replacing addition symbol with a space
			r = /([^&;=]+)=?([^&;]*)/g,
			d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
			q = window.location.hash.substring(1);
		while (e = r.exec(q))
		   hashParams[d(e[1])] = d(e[2]);
		return hashParams;
	}
})
