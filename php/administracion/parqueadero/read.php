<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $consultaSql = "SELECT p.id_parqueadero,p.parqueadero,p.plazas,p.direccion,p.latitud,p.longitud,p.valor,p.imagen FROM kparkingdb.parqueaderos p;";
    $coordenadas;
    $result = $mysqli->query($consultaSql);
    $idGeo;
    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idParqueadero:" . $myrow["id_parqueadero"] . ","
                . "parqueadero:'" . utf8_encode($myrow["parqueadero"]) . "',"
                . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                . "plazas:" . $myrow["plazas"] . ","
                . "valor:" . $myrow["valor"] . ","
                . "latitudS:'" . $myrow["latitud"] . "',"
                . "longitudS:'" . $myrow["longitud"] . "',"
                . "imagen:'" . utf8_encode($myrow["imagen"]) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
    $mysqli->close();
}

