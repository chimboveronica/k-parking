/**
 * Grafica de Perimetro
 */
function dibujarPerimetro(m) {

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
    lienzoParadas.addFeatures(lineFeature);
}

/**
 * Paradas 
 */
function lienzosRecorridoHistorico(coordPuntos){
    var features = new Array();

    //Recuperar posiciones del recorrido
    var fil = coordPuntos.split("#");

    for ( i=0; i<fil.length-1; i++ ) {

        var col = fil[i].split("%");
        var pt = new OpenLayers.Geometry.Point(col[1],col[2]);
        pt.transform( new OpenLayers.Projection( "EPSG:4326" ),
            new OpenLayers.Projection( "EPSG:900913" ) );

        //    0          1       2    3        4         5       6
        //ID_PARADA, DIRECCION, LAT, LON, REFERENCIA, DIR_IMG, ORDEN

        var puntoMap = new OpenLayers.Feature.Vector( pt, {
            idBD : col[0],
            idOrd: col[6],
            lat : col[2],
            lon : col[1],
            dir : col[3],
            ref : col[4],
            img : col[5],
            poppedup : false
        });

        features.push(puntoMap);
    }
    lienzoParadas.addFeatures(features);
}