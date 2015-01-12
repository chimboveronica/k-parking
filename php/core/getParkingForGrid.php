<?php

require_once('../../dll/conect.php');

$consultaSql = 
    "SELECT ID_PARQUEADERO, PARQUEADERO, PLAZAS, LATITUD, LONGITUD
        FROM PARQUEADEROS";

consulta($consultaSql);
$resulset = variasFilas();

if (count($resulset) > 0) {
    $salida = "{puntos: [";

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $salida .= "{
                idParking:'" . $fila["ID_PARQUEADERO"] . "',
                parking:'" . $fila["PARQUEADERO"] . "',
                latitud:'" . $fila["LATITUD"] . "',
                longitud:'" . $fila["LONGITUD"] . "'
            }";
        if ($i != count($resulset) - 1) {
            $salida .= ",";
        }
    }

    $salida .="]}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>