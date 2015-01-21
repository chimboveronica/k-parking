<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $idRol = $_SESSION["ID_ROL"];
    $idParking = $_SESSION["ID_PARKING"];

    if ($idRol == 2) {
        $consultaSql = "SELECT id_parqueadero, parqueadero, plazas, latitud, longitud
        FROM kparkingdb.parqueaderos WHERE id_parqueadero = $idParking"
        ;
    } else {
        $consultaSql = "SELECT id_parqueadero, parqueadero, plazas, latitud, longitud
        FROM kparkingdb.parqueaderos"
        ;
    }

    function coneccion() {
        if (!$mysqli = getConectionDb()) {
            
        } else {
            return $mysqli;
        }
    }

    function obtenercant($idParking) {
        $ocupadosSql = "SELECT COUNT(*) AS OCUPADAS FROM PLAZAS WHERE ID_parqueadero =$idParking AND ESTADO = 1";
        consulta($ocupadosSql);
        $data = unicaFila();
        return $data["OCUPADAS"];
    }

    $result = $mysqli->query($consultaSql);
    $objJson = "data: [";

    while ($myrow = $result->fetch_assoc()) {
        $idParking = $myrow["id_parqueadero"];
        $libres = $myrow["plazas"] - obtenercant($idParking);
        $objJson .= "{"
                . "idParking:" . $myrow["id_parqueadero"] . ","
                . "parking:'" . utf8_encode($myrow["parqueadero"]) . "',"
                . "latitud:'" . $myrow["latitud"] . "',"
                . "longitud:'" . $myrow["longitud"] . "',"
                . "plazasLibres:" . $libres . ","
                . "plazasOcupadas:" . obtenercant($idParking) . ","
                . "plazas:" . $myrow["plazas"] . "},";
    }
    $objJson .= "]";
    echo "{success: true,$objJson}";

    $mysqli->close();
}

