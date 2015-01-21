<?php

require_once('../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {


    function coneccion() {
        if (!$mysqli = getConectionDb()) {
            
        } else {
            return $mysqli;
        }
    }

    function obtenerPuntosGepocerca($idGeo) {
        $consultaSql2 = "SELECT latitud, longitud FROM puntos_zonas where id_zona='$idGeo' ORDER BY orden;";
        $result2 = coneccion()->query($consultaSql2);
        $haveData = false;
        if ($result2->num_rows > 0) {
            $haveData = true;
            $objJson = "";
            while ($myrow = $result2->fetch_assoc()) {
                $objJson .= ""
                        . $myrow["longitud"] . ","
                        . $myrow["latitud"] . ";";
            }
            $objJson .= "";
        }
        if ($haveData) {
            return $objJson;
        }
    }

    $consultaSql = "SELECT id_zona,area,nombre,horario,color,descripcion,tiempo,tiempo_fraccion FROM kparkingdb.zonas;";
    $coordenadas;
    $result = $mysqli->query($consultaSql);
    $idGeo;
    $objJson = "data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idZona:" . $myrow["id_zona"] . ","
                . "nombre:'" . utf8_encode($myrow["nombre"]) . "',"
                . "horario:'" . utf8_encode($myrow["horario"]) . "',"
                . "color:'" . utf8_encode($myrow["color"]) . "',"
                . "tiempo:'" . $myrow["tiempo"] . "',"
                . "coordenadas:'" . obtenerPuntosGepocerca($myrow["id_zona"]) . "',"
                . "area:" . $myrow["area"] . ","
                . "tiempoFraccion:'" . $myrow["tiempo_fraccion"] . "',"
                . "descripcion:'" . utf8_encode($myrow["descripcion"]) . "'},";
    }
    $objJson .= "]";
    echo "{success: true,$objJson}";

    $mysqli->close();
}

