/**
 * Limpia la capa de Parqueaderos
 */

function clearLayer(){    
    clearLayerParking();
    activarArrastrePuntos(false);
    storeParking.rejectChanges();
}

function clearLayerParking() {
    parkingCanvas.destroyFeatures();      
    //Comprobar si existe algun popUp abierto
    if (map.popups.length == 1) {
        map.removePopup(map.popups[0]);
    }
}