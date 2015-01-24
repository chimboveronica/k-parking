var map;
var obtener = false;
var obtenerLatLon = false;
var obtenerParqueadero = false;
                    
// coordenadas para centrar Loja
var lat = -3.9992;
var lon = -79.19833;
var zoom = 15;

var parkingCanvas;
var lines;
var time;

//var capturarPosicion;
var markerInicioFin;
var dragFeature;
var toMercator = OpenLayers.Projection.transforms['EPSG:900913']['EPSG:4326'];

var lienzoLocalizar = new OpenLayers.Layer.Vector('Direcciones');
var styleLocalizacion = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
};
//para geocercas

var drawLine;
var modifyLine;
Ext.onReady(function () {
    //capturarPosicion = false;

    /*OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
     defaultHandlerOptions: {
     'single': true,
     'double': false,
     'pixelTolerance': 0,
     'stopSingle': false,
     'stopDouble': false
     },
     
     initialize: function(options) {
     this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
     OpenLayers.Control.prototype.initialize.apply(this, arguments);
     this.handler = new OpenLayers.Handler.Click(this, {
     'click': this.trigger
     }, this.handlerOptions);
     },
     
     trigger: function(e) {        
     //Capturar Punto de Referencia
     if (capturarPosicion) {
     var coord = map.getLonLatFromViewPortPx(e.xy);
     var aux =  new OpenLayers.Geometry.Point( coord.lon, coord.lat );
     aux.transform( new OpenLayers.Projection( "EPSG:900913" ),
     new OpenLayers.Projection( "EPSG:4326" ) );
     xpos = aux.x;
     ypos = aux.y;
     capturarPosicion = false;
     RQ3_getWin();
     }               
     }
     });*/

    //Limitar navegabilidad en el mapa
    /*var extent = new OpenLayers.Bounds();
     extent.extend(new OpenLayers.LonLat(-80.84441,-3.03400));
     extent.extend(new OpenLayers.LonLat(-78.18123,-4.54600));
     
     extent.transform( new OpenLayers.Projection( "EPSG:4326" ),
     new OpenLayers.Projection( "EPSG:900913" ));*/

    /*var options = {
     controls : [
     new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
     new OpenLayers.Control.PanZoomBar(),
     new OpenLayers.Control.KeyboardDefaults(),
     new OpenLayers.Control.LayerSwitcher()
     ],
     units: 'm',
     numZoomLevels : 19,
     maxResolution : 'auto'/*,
     restrictedExtent : extent,
     maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
     20037508.34, 20037508.34)
     };*/

    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: new OpenLayers.Projection("EPSG:900913"),
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}}),
            new OpenLayers.Control.KeyboardDefaults(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Google("Google Streets", {numZoomLevels: 20}),
            new OpenLayers.Layer.Google(
                    "Google Hybrid",
                    {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20})
        ]
    });
    /*map = new OpenLayers.Map('map');
     map.addControl(new OpenLayers.Control.LayerSwitcher());
     map.addControl(new OpenLayers.Control.Zoom());
     
     // Mapa sobre el que se trabaja
     var osm = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
     transitionEffect: 'resize'
     });
     var gmap = new OpenLayers.Layer.Google("Google Streets", {numZoomLevels: 20});
     var ghyb = new OpenLayers.Layer.Google(
     "Google Hybrid",
     {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
     );
     
     map.addLayers([osm, gmap,ghyb]);*/
    map.addLayer(lienzoLocalizar);

    // Centrar el Mapa
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject());
    map.setCenter(lonLat, zoom);

    //Restringe la posibilidad de hacer zoom mas alla
    //de la zona de Loja
    /*map.events.register('zoomend', this, function() {
     if (map.getZoom() < 7){
     map.zoomTo(7);
     }
     });*/
    lines = new OpenLayers.Layer.Vector("Lines", {
        styleMap: new OpenLayers.StyleMap({
               pointRadius: 3,
            strokeColor: "${color}",
            label: "${zona}",
            fontSize: "20px",
            fontFamily: "Times New Roman",
            fontWeight: "bold",
            fontColor: "${color}",
            strokeWidth: 3,
            fillOpacity: 0.3,
        })
    });
    map.events.register('click', map, function (e) {
        if (obtener) {
            var coord = map.getLonLatFromViewPortPx(e.xy);
            var aux = new OpenLayers.Geometry.Point(coord.lon, coord.lat);
            aux.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
            formParking.down('[name=latitud]').setValue(aux.y);
            formParking.down('[name=longitud]').setValue(aux.x);
            winParking.show();

            //console.log("[Latitud: "+aux.y+"::"+coord.lon+"] ; [Longitud: "+aux.x+"::"+coord.lat+"]");
        }
        if (obtenerLatLon) {
            var coord = map.getLonLatFromViewPortPx(e.xy);
            var aux = new OpenLayers.Geometry.Point(coord.lon, coord.lat);
            aux.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
            formAdminSitio.down('[name=latitudSitio]').setValue(aux.y);
            formAdminSitio.down('[name=longitudSitio]').setValue(aux.x);
            winAdminSitio.show();

            //console.log("[Latitud: "+aux.y+"::"+coord.lon+"] ; [Longitud: "+aux.x+"::"+coord.lat+"]");
        }
        if (obtenerParqueadero) {
            var coord = map.getLonLatFromViewPortPx(e.xy);
            var aux = new OpenLayers.Geometry.Point(coord.lon, coord.lat);
            aux.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
            formRecordsParkingS.down('[name=latitudS]').setValue(aux.y);
            formRecordsParkingS.down('[name=longitudS]').setValue(aux.x);
            winAdminParkings.show();

    
            //console.log("[Latitud: "+aux.y+"::"+coord.lon+"] ; [Longitud: "+aux.x+"::"+coord.lat+"]");
        }
    });
    
    drawLine = new OpenLayers.Control.DrawFeature(lines, OpenLayers.Handler.Polygon, {featureAdded: getDataZona});
    modifyLine = new OpenLayers.Control.ModifyFeature(lines, OpenLayers.Handler.Polygon, {featureAdded: drawPoligonoGeocerca});

    map.addControl(drawLine);
    map.addControl(modifyLine);


    //map.zoomToMaxExtent();    
    loadLayers();

    if (id_rol == 1 || id_rol == 2) {
        getDataParking();
    } else {
        getDataParkingUser();
    }
    //getDataParkingGoogle();
});

function showParking(numPunto) {
    var lienzoP = map.getLayer('parking_canvas');

    if (lienzoP == null) {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'Parametros no validos',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
        return null;
    } else {
        if (lienzoP.getVisibility()) {
            var parada = lienzoP.getFeatureById(numPunto);
            if (parada == null) {
                Ext.MessageBox.show({
                    title: 'Error...',
                    msg: '<center>Parqueadero no Encontrado<br>Verifique que los puntos esten en el Mapa.<center>',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
                return null;
            } else {
                //onFeatureSelect(vehiculo); //Activar Globo                
                //centerMap(parada.geometry.x,parada.geometry.y, 17);
                var aux = new OpenLayers.Geometry.Point(parada.geometry.x, parada.geometry.y);
                aux.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                searchDirection(aux.x, aux.y, 17);
            }
        } else {
            Ext.MessageBox.show({
                title: 'Capa Desactivada',
                msg: 'Debe activar primero la capa <br>en la parte derecha (+)',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return null;
        }
    }
}

function centerMap(ln, lt, zoom) {
    //zoom max = 18
    var nivelZoom = zoom;
    var lonlatCenter = new OpenLayers.LonLat(ln, lt);
    map.setCenter(lonlatCenter, nivelZoom);
}

function searchDirection(ln, lt, zoom) {
    var punto = new OpenLayers.Geometry.Point(ln, lt);
    punto.transform(new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject());
    map.setCenter(punto, zoom);

    var pulsate = function (feature) {
        var point = feature.geometry.getCentroid(),
                bounds = feature.geometry.getBounds(),
                radius = Math.abs((bounds.right - bounds.left) / 2),
                count = 0,
                grow = 'up';

        var resize = function () {
            if (count > 16) {
                clearInterval(window.resizeInterval);
            }
            var interval = radius * 0.03;
            var ratio = interval / radius;
            switch (count) {
                case 4:
                case 12:
                    grow = 'down';
                    break;
                case 8:
                    grow = 'up';
                    break;
            }
            if (grow !== 'up') {
                ratio = -Math.abs(ratio);
            }
            feature.geometry.resize(1 + ratio, point);
            lienzoLocalizar.drawFeature(feature);
            count++;
        };
        window.resizeInterval = window.setInterval(resize, 50, point, radius);
    };

    lienzoLocalizar.removeAllFeatures();
    var circle = new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(punto.x, punto.y),
                    50,
                    40,
                    0
                    ),
            {},
            styleLocalizacion
            );
    lienzoLocalizar.addFeatures([
        new OpenLayers.Feature.Vector(
                punto,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
        ),
        circle
    ]);
    map.zoomToExtent(lienzoLocalizar.getDataExtent());
    pulsate(circle);
}

/**
 * Activa el control para arrastrar los puntos de una ruta para editarlos de 
 * forma manual
 */
function permitirArrastrarPuntosRutas() {
    //--Add a drag feature control to move features around.
    dragFeature = new OpenLayers.Control.DragFeature(parkingCanvas, {
        // onStart: iniciarArrastre,
        onDrag: arrastrar,
        onComplete: finalizarArrastre
    });
    map.addControl(dragFeature);
}

/**
 * Bloquea el arrastre de los puntos
 */
function activarArrastrePuntos(activar) {
    if (dragFeature != undefined) {
        if (activar) {
            dragFeature.activate();
            //console.info('activar');
        } else {
            dragFeature.deactivate();
            //console.info('desactivar');
        }
    }
}

/**
 * Captura el movimiento del feature de un punto de la ruta dibujada
 */
function arrastrar(feature, pixel) {
    var aux = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
    aux.transform(new OpenLayers.Projection("EPSG:900913"),
            new OpenLayers.Projection("EPSG:4326"));
    storeParkingGrid.getAt(storeParkingGrid.find('idParking', feature.id)).set('latitud', aux.y);
    storeParkingGrid.getAt(storeParkingGrid.find('idParking', feature.id)).set('longitud', aux.x);
}

/**
 * Se ejecuta al finalizar el movimiento del feature seleccionado
 */
function finalizarArrastre(feature, pixel) {
//storeParkingGrid.commitChanges();
}

function getDataZona(fig) {
    var vert = fig.geometry.getVertices();
    var areaGeocerca = fig.geometry.getArea() / 1000;
    if (geosArea) {
        console.log(fig.geometry.getVertices());
        areaGeocerca = Math.round(areaGeocerca * 100) / 100;
        Ext.getCmp('numberfield-point-route').setValue(areaGeocerca + ' km2');
        drawRoute = false;
        Ext.getCmp('btn-draw-edit-route').setIconCls("icon-update");
        Ext.getCmp('btn-delete-route').enable();
        modifyLine.activate();
        modifyLine.activate();
        drawLine.deactivate();
        geosArea = false;
        winAddZona.show();
    }
    if (geosVertice) {
        coordenadasGeos = '';
        for (var i = 0; i < vert.length; i++) {
            vert[i] = vert[i].transform(new OpenLayers.Projection('EPSG:900913'),
                    new OpenLayers.Projection('EPSG:4326'));
            coordenadasGeos += vert[i].x + ',' + vert[i].y;
            if (i != vert.length - 1) {
                coordenadasGeos += ';';
            }
        }

    }

    figs = fig;
    var vert = fig.geometry.getVertices();
    var coordP = '';
    for (var i = 0; i < vert.length; i++) {
        vert[i] = vert[i].transform(new OpenLayers.Projection('EPSG:900913'),
                new OpenLayers.Projection('EPSG:4326'));
        coordP += vert[i].x + ',' + vert[i].y;
        if (i != vert.length - 1) {
            coordP += ';';
        }
    }
    vertPolygon = coordP;

    drawLine.deactivate();
    winAddZona.show();
    lines.destroyFeatures();

}
var geosArea = false;
var geosVertice = false;
function drawPoligonoGeocerca(dataRoute) {
    
//    geosArea = true;
    geosVertice = true;
    modifyLine.activate();
    modifyLine.activate();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-update");
    var puntosRuta = new Array();
    var json = dataRoute.split(";");
    var i = 0;
    for (i = 0; i < json.length - 1; i++) {
        var dataRuta = json[i].split(",");
        var pt = new OpenLayers.Geometry.Point(dataRuta[0], dataRuta[1]);
        pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        puntosRuta.push(pt);
    }
    console.log(puntosRuta);
    console.log('dibujar');
    var linearRing = new OpenLayers.Geometry.LinearRing(puntosRuta);
    var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
    lines.addFeatures([polygonFeature]);
    drawRoute = false;
}

function drawZonas(dataRoute,zona,color) {
    
    var puntosRuta = new Array();
    var json = dataRoute.split(";");
    var i = 0;
    for (i = 0; i < json.length - 1; i++) {
        var dataRuta = json[i].split(",");
        var pt = new OpenLayers.Geometry.Point(dataRuta[0], dataRuta[1]);
        pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        puntosRuta.push(pt);
    }
    var linearRing = new OpenLayers.Geometry.LinearRing(puntosRuta);
    var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]), {
                color: color,
                zona: zona
            });
    lines.addFeatures([polygonFeature]);
    drawRoute = false;
}
function drawZona(dataRoute) {
    
    var puntosRuta = new Array();
    var json = dataRoute.split(";");
    var i = 0;
    for (i = 0; i < json.length - 1; i++) {
        var dataRuta = json[i].split(",");
        var pt = new OpenLayers.Geometry.Point(dataRuta[0], dataRuta[1]);
        pt.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        puntosRuta.push(pt);
    }
    var linearRing = new OpenLayers.Geometry.LinearRing(puntosRuta);
    var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
    lines.addFeatures([polygonFeature]);
    drawRoute = false;
}
