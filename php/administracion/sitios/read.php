<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $consultaSql = "SELECT id_sitio,nombre,direccion,latitud,longitud, img, descripcion FROM kparkingdb.sitios;";
    $coordenadas;
    $result = $mysqli->query($consultaSql);
    $idGeo;
    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idSitio:" . $myrow["id_sitio"] . ","
                . "nombre:'" . utf8_encode($myrow["nombre"]) . "',"
                . "direccion:'" . utf8_encode($myrow["direccion"]) . "',"
                . "img:'" . $myrow["img"] . "',"
                . "longitudSitio:'" . $myrow["longitud"] . "',"
                . "latitudSitio:'" . $myrow["latitud"] . "',"
                . "descripcion:'" . utf8_encode($myrow["descripcion"]) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
    $mysqli->close();
}

