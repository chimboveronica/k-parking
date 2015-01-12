<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $consultaSql = "SELECT id_zona,nombre,horario,color,descripcion,tiempo,tiempo_fraccion FROM kparkingdb.zonas;";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idZona:" . $myrow["id_zona"] . ","
                . "nombre:'" . utf8_encode($myrow["nombre"]) . "',"
                . "horario:'" . utf8_encode($myrow["horario"]) . "',"
                . "color:'" . utf8_encode($myrow["color"]) . "',"
                . "tiempo:'" . $myrow["tiempo"] . "',"
                . "tiempoFraccion:'" . $myrow["tiempo_fraccion"] . "',"
                . "descripcion:'" . utf8_encode($myrow["descripcion"]) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}

