var lines;
var linesEdit;
var line;

/* Cargar las Capas con sus Estilos sobre el Mapa */
function loadLayers() {
    var styleParking = new OpenLayers.StyleMap({
        externalGraphic: "${img}",
        graphicWidth: 28,
        graphicHeight: 30,
        //fillOpacity : 1.4,
        //pointRadius: 8,
        idParking: "${idParking}",
        parking: "${parking}",
        plazas: "${plazas}",
        libres: "${libres}",
        ocupadas: "${ocupadas}",
        label: ".\t.\t${libres}",
        fontColor: "blue",
        //fillColor: "${color}", //#003DF5
        strokeColor: "#FFFFFF",
        //strokeOpacity: 0.7,
        fontSize: "16px",
        fontFamily: "Times New Roman",
        fontWeight: "bold",
        labelAlign: "left",
        labelOffset: new OpenLayers.Pixel(0, -20)
    });

    parkingCanvas = new OpenLayers.Layer.Vector('Parqueaderos', {
        eventListeners: {
            featureselected: function (evt) {
                onParkingSelect(evt);
            },
            featureunselected: function (evt) {
                onParkingUnselect(evt);
            }
        },
        styleMap: styleParking
    });

    parkingCanvas.id = 'parking_canvas';

    //Comportamiento de los Elementos de la Capa
    var selectFeatures = new OpenLayers.Control.SelectFeature(
            [parkingCanvas], {
        hover: false,
        autoActivate: true
    });
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
    line = new OpenLayers.Layer.Vector("Lines", {
        styleMap: new OpenLayers.StyleMap({
            pointRadius: 3,
            strokeColor: "#ff3300",
            strokeWidth: 3,
            fillOpacity: 0
        })
    });
    linesEdit = new OpenLayers.Layer.Vector("Lines", {
        styleMap: new OpenLayers.StyleMap({
            pointRadius: 3,
            strokeColor: "#ff3300",
            strokeWidth: 3,
            fillOpacity: 0
        })
    });

    drawLine = new OpenLayers.Control.DrawFeature(lines, OpenLayers.Handler.Polygon, {featureAdded: getDataZona});
    modifyLine = new OpenLayers.Control.ModifyFeature(lines, OpenLayers.Handler.Polygon, {featureAdded: drawPoligonoGeocerca,
        clickout: false,
        toggle: false,
        mode: OpenLayers.Control.ModifyFeature.RESHAPE});
    map.addLayers([
        parkingCanvas,
        lines,
        line,
        linesEdit
    ]);

    map.events.register('click', map, function (e) {
    }
    );
    map.addControl(selectFeatures);
    map.addControl(drawLine);
    map.addControl(modifyLine);
    selectFeatures.activate();
}

function onParkingSelect(evt) {
    var feature;
    if (evt.feature == undefined) {
        feature = evt;
    } else {
        feature = evt.feature;
    }

    var parking = feature.attributes.parking.toString();
    var plazas = feature.attributes.plazas.toString();
    var ocupadas = feature.attributes.ocupadas.toString();
    var libres = plazas - ocupadas;

    var contenidoAlternativo =
            "<section>" +
            "<strong>Parqueadero:</strong><br>" + parking + "<br>" +
            "<strong>Plazas: </strong>" + plazas + "<br>" +
            "<strong>Plazas Libres: </strong>" + libres + "<br>" +
            "<strong>Plazas Ocupadas: </strong>" + ocupadas +
            "</section>";

    var popup = new OpenLayers.Popup.AnchoredBubble("popup",
            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
            new OpenLayers.Size(150, 110),
            contenidoAlternativo,
            null,
            true, function () {
                map.removePopup(feature.popup);
                feature.attributes.poppedup = false;
            }
    );

    popup.setBackgroundColor('#dbe6f3');
    feature.popup = popup;
    feature.attributes.poppedup = true;
    map.addPopup(popup);
}

function onParkingUnselect(evt) {
    var feature;
    if (evt.feature == undefined) {
        feature = evt;
    } else {
        feature = evt.feature;
    }

    map.removePopup(feature.popup);
    feature.popup.destroy();
    feature.attributes.poppedup = false;
    feature.popup = null;
}
