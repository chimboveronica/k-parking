//Con Extjs
var mapwin;
Ext.onReady(function(){        
    mapwin = Ext.create('Ext.ux.GMapPanel', {
        title : "Mapa Google",
        iconCls : 'icon-mapa',
        center: {
            geoCodeAddr: '4 Yawkey Way, Boston, MA, 02215-3409, USA',
            marker: {title: 'Fenway Park'}
        },
        markers: [{
            lat: 42.339641,
            lng: -71.094224,
            title: 'Boston Museum of Fine Arts',
            listeners: {
                click: function(e){
                    Ext.Msg.alert('It\'s fine', 'and it\'s art.');
                }
            }
        },{
            lat: - 3.9992,
            lng: - 79.19833,
            title: 'Northeastern University'
        }]        
    });
 });

//Google
/*
var mapGoogle;
var infoWindowPoligon;

Ext.onReady(function(){
    // Constructor Base
    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(37.09024, -95.712891),
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    mapGoogle = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Circle Layer
    var citymap = {};
    citymap['chicago'] = {
      center: new google.maps.LatLng(41.878113, -87.629798),
      population: 2842518
    };
    citymap['newyork'] = {
      center: new google.maps.LatLng(40.714352, -74.005973),
      population: 8143197
    };
    citymap['losangeles'] = {
      center: new google.maps.LatLng(34.052234, -118.243684),
      population: 3844829
    }
    var cityCircle;

    for (var city in citymap) {
        // Construct the circle for each value in citymap. We scale population by 20.
        var populationOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: mapGoogle,
            center: citymap[city].center,
            radius: citymap[city].population / 20
        };
        cityCircle = new google.maps.Circle(populationOptions);
    }

    //IconMarker
    var image = 'img/bus_rojo.png';
    var myLatLngIcon = new google.maps.LatLng(29.09024, -88.712891);
    var beachMarker = new google.maps.Marker({
        position: myLatLngIcon,
        map: mapGoogle,
        icon: image
    });

    //IconMarkerComplex
    var beaches = [
        ['Bondi Beach', 26.09024, -76.712891, 4],
        ['Coogee Beach', 27.09024, -77.712891, 5],
        ['Cronulla Beach', 28.09024, -78.712891, 3],
        ['Manly Beach', 29.09024, -79.712891, 2],
        ['Maroubra Beach', 30.09024, -75.712891, 1]
    ];

    setMarkers(mapGoogle, beaches);

    //InfoWindow
    var myLatlngInfo = new google.maps.LatLng(32.09024, -91.712891);
    var contentString = "<section><h3>Información</h3></section>";

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });

    var markerInfo = new google.maps.Marker({
        position: myLatlngInfo,
        map: mapGoogle,
        title: 'Uluru (Ayers Rock)'
    });
    google.maps.event.addListener(markerInfo, 'click', function() {
        infowindow.open(mapGoogle, markerInfo);
    });

    //Simple Marker
    var myLatlng = new google.maps.LatLng(37.09024, -95.712891);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: mapGoogle,
        title: 'Hello World!'
    });

    //Marker Animation
    var parliament = new google.maps.LatLng(31.09024, -92.712891);
    markerAnim = new google.maps.Marker({
        map: mapGoogle,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: parliament
    });

    google.maps.event.addListener(markerAnim, 'click', toggleBounce);

    function toggleBounce() {
        if (markerAnim.getAnimation() != null) {
            markerAnim.setAnimation(null);
        } else {
            markerAnim.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    //Marker with Animation SetTimeOut
    var neighborhoods = [
        new google.maps.LatLng(41.878113, -87.629798),
        new google.maps.LatLng(32.888123, -88.729788),
        new google.maps.LatLng(38.898133, -89.829778),
        new google.maps.LatLng(43.858143, -86.929768)
    ];

    var markers = [];
    var iterator = 0;
    
    for (var i = 0; i < neighborhoods.length; i++) {
        setTimeout(function() {
            addMarker();
        }, i * 200);
    }
    
    function addMarker() {
        markers.push(new google.maps.Marker({
            position: neighborhoods[iterator],
            map: mapGoogle,
            draggable: false,
            animation: google.maps.Animation.DROP
        }));
        iterator++;
    }

    //SimplePoligon
    var bermudaTriangle;
    var triangleCoords = [
        new google.maps.LatLng(25.774252, -80.190262),
        new google.maps.LatLng(18.466465, -66.118292),
        new google.maps.LatLng(32.321384, -64.75737),
        new google.maps.LatLng(25.774252, -80.190262)
    ];

    // Construct the polygon
    bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    });

    bermudaTriangle.setMap(mapGoogle);

    // Add a listener for the click event
    google.maps.event.addListener(bermudaTriangle, 'click', showArrays);

    infoWindowPoligon = new google.maps.InfoWindow();
});

function setMarkers(map, locations) {
    // Add markers to the map

    // Marker sizes are expressed as a Size of X,Y
    // where the origin of the image (0,0) is located
    // in the top left of the image.

    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.
    var image = {
        url: 'img/bus_azul.png',
        // This marker is 20 pixels wide by 32 pixels tall.
        size: new google.maps.Size(20, 32),
        // The origin for this image is 0,0.
        origin: new google.maps.Point(0,0),
        // The anchor for this image is the base of the flagpole at 0,32.
        anchor: new google.maps.Point(0, 32)
    };

    var shadow = {
        url: 'img/bus_rojo.png',
        // The shadow image is larger in the horizontal dimension
        // while the position and offset are the same as for the main image.
        size: new google.maps.Size(37, 32),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0, 32)
    };
      // Shapes define the clickable region of the icon.
      // The type defines an HTML &lt;area&gt; element 'poly' which
      // traces out a polygon as a series of X,Y points. The final
      // coordinate closes the poly by connecting to the first
      // coordinate.
    var shape = {
        coord: [1, 1, 1, 20, 18, 20, 18 , 1],
        type: 'poly'
    };

    for (var i = 0; i < locations.length; i++) {
        var beach = locations[i];
        var myLatLngComplexIcon = new google.maps.LatLng(beach[1], beach[2]);
        var marker = new google.maps.Marker({
            position: myLatLngComplexIcon,
            map: mapGoogle,
            shadow: shadow,
            icon: image,
            shape: shape,
            title: beach[0],
            zIndex: beach[3]
        });
    }
}

function showArrays(event) {

    // Since this Polygon only has one path, we can call getPath()
    // to return the MVCArray of LatLngs
    var vertices = this.getPath();

    var contentString = '<b>Bermuda Triangle Polygon</b><br>';
    contentString += 'Clicked Location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() + '<br>';

    // Iterate over the vertices.
    for (var i =0; i < vertices.getLength(); i++) {
        var xy = vertices.getAt(i);
        contentString += '<br>' + 'Coordinate: ' + i + '<br>' + xy.lat() +',' + xy.lng();
    }

    // Replace our Info Window's content and position
    infoWindowPoligon.setContent(contentString);
    infoWindowPoligon.setPosition(event.latLng);

    infoWindowPoligon.open(mapGoogle);
}*/