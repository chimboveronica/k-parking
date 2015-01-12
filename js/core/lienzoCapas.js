/**
 * Grafica de Perimetro
 */
function drawPerimeter(m, ypos, xpos) {

    var puntosRuta = new Array();

    var factorLAT = m / (1852 * 60);
    var factorLON = ((m * 0.00001) / 0.000111 ) / 10000;

    var lat1 = ypos - factorLAT;
    var lat2 = ypos + factorLAT;
    var lon1 = xpos - factorLON;
    var lon2 = xpos + factorLON;


    var pt = new OpenLayers.Geometry.Point(lon1,lat2);
    pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon2,lat2);
    pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon2,lat1);
    pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon1,lat1);
    pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
    puntosRuta.push(pt);
    pt = new OpenLayers.Geometry.Point(lon1,lat2);
    pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
        new OpenLayers.Projection( "EPSG:900913" ) );
    puntosRuta.push(pt);

    var ruta = new OpenLayers.Geometry.LineString(puntosRuta);
    //Estilo de Linea de Recorrido
    var style = {
        strokeColor: '#003DF5',
        strokeOpacity: 0.7,
        strokeWidth: 5
    };
    var lineFeature = new OpenLayers.Feature.Vector(ruta, null, style);
    parkingCanvas.addFeatures(lineFeature);
}


/* Añade Datos a la Capa */
function addParkingToCanvas(coordPuntos){    
    for (i = 0; i < coordPuntos.length; i++ ) {
        var dataParking = coordPuntos[i];        
        var idParking = dataParking.idParking;
        var parkingFeature = null;

        parkingFeature = parkingCanvas.getFeatureById(idParking);        

        if (parkingFeature == null) {
            var pt = new OpenLayers.Geometry.Point(dataParking.longitud, dataParking.latitud);
            pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
                new OpenLayers.Projection( "EPSG:900913" ) );

            var libres = dataParking.plazas - dataParking.ocupadas;
            var img = null;

            if (libres > 10) {
                img = "img/icon_parking_mapa_verde.png";
            } else if (libres > 5) {
                img = "img/icon_parking_mapa_naranja.png";
            } else {
                img = "img/icon_parking_mapa_rojo.png";
            }

            var parkingFeature = new OpenLayers.Feature.Vector( pt, {
                idParking : idParking,
                parking : dataParking.parking,
                plazas : dataParking.plazas,
                libres : libres,
                ocupadas : dataParking.ocupadas,
                img : img,
                poppedup : false
            });

            parkingFeature.id = idParking;
        
            parkingCanvas.addFeatures(parkingFeature);
        } else {

            var poppedup = false;
            poppedup = parkingFeature.attributes.poppedup;

            var newPoint = new OpenLayers.LonLat( dataParking.longitud, dataParking.latitud );
            newPoint.transform( new OpenLayers.Projection( "EPSG:4326" ),
            new OpenLayers.Projection( "EPSG:900913" ) );
            // Movemos el vehiculo
            parkingFeature.move( newPoint );

            if (poppedup) {
                onParkingUnselect(parkingFeature);

                var libres = dataParking.plazas - dataParking.ocupadas;

                var img = null;

                if (libres > 10) {
                    img = "img/icon_parking_mapa_verde.png";
                } else if (libres > 5) {
                    img = "img/icon_parking_mapa_naranja.png";
                } else {
                    img = "img/icon_parking_mapa_rojo.png";
                }

                parkingFeature.attributes.libres = libres;
                parkingFeature.attributes.ocupadas = dataParking.ocupadas;
                parkingFeature.attributes.img = img;
                parkingFeature.attributes.label = libres;
                parkingFeature.attributes.img = img;

                onParkingSelect(parkingFeature);
            } else {
                var libres = dataParking.plazas - dataParking.ocupadas;

                var img = null;

                if (libres > 10) {
                    img = "img/icon_parking_mapa_verde.png";
                } else if (libres > 5) {
                    img = "img/icon_parking_mapa_naranja.png";
                } else {
                    img = "img/icon_parking_mapa_rojo.png";
                }

                parkingFeature.attributes.libres = libres;
                parkingFeature.attributes.ocupadas = dataParking.ocupadas;
                parkingFeature.attributes.img = img;
                parkingFeature.attributes.label = libres;
                parkingFeature.attributes.img = img;
            }

            /*else {
                var libres = dataParking.plazas - dataParking.ocupadas;
                if (parkingFeature.attributes.libres != libres) {
                    parkingCanvas.destroyFeatures();
                }                
            }*/
        }
    }
}

/* Añade Datos a la Capa */
function addParkingToCanvasGoogle(coordPuntos){    

    for (i = 0; i < coordPuntos.length; i++ ) {
        var dataParking = coordPuntos[i];

        if (dataParking.longitud != "") {
            var pt = new google.maps.LatLng(dataParking.latitud, dataParking.longitud);

            var img = null;

            if (dataParking.ocupadas == 20) {
                img = "#FF0000";
            } else if (dataParking.ocupadas > 5 && dataParking.ocupadas < 20) {
                img = "#FF6600";
            } else {
                img = "#003DF5";
            }

            var puntoMap = {
                strokeColor: '#FFFFFF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: img, //'#FF0000'
                fillOpacity: 0.35,
                map: mapGoogle,
                center: pt,
                radius: 40
            }

            parkingCircle = new google.maps.Circle(puntoMap);
        }
    }    
}