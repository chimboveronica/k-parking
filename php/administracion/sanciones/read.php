<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $consultaSql = "SELECT id_sancion,motivo,valor,descripcion FROM kparkingdb.sanciones;";
    $coordenadas;
    $result = $mysqli->query($consultaSql);
    $idGeo;
    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idSancion:" . $myrow["id_sancion"] . ","
                . "motivo:'" . $myrow["motivo"] . "',"
                . "valor:'" . $myrow["valor"] . "',"
                . "descripcion:'" . utf8_encode($myrow["descripcion"]) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
    $mysqli->close();
}

