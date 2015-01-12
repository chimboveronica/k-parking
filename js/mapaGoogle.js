var mapGoogle;
var infoWindowPoligon;
var parkingCircle;

Ext.onReady(function(){
	// Constructor Base
	var mapOptions = {
		zoom: 15,
		center: new google.maps.LatLng(- 3.9992, - 79.19833),
		mapTypeId: google.maps.MapTypeId.HYBRID
	};

	//mapGoogle = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	//getDataParkingGoogle();
});