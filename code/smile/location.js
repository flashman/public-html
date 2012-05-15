getLocation = function(){
	// Check to see if this browser supports geolocation.
	if (navigator.geolocation) {
	 		 		 
		// Get the location of the user's browser using the
		// native geolocation service.
		navigator.geolocation.getCurrentPosition(
			function(position){
				// Log that this is the initial position.
				return(position.coords);
			},
			function( error ){
				console.log( "Something went wrong: ", error );
			},
			{
				timeout: (5 * 1000),
				maximumAge: (1000 * 60 * 15),
				enableHighAccuracy: true
			}
		)
	}
}