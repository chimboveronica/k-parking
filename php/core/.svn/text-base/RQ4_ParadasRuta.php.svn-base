<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);

$consultaSql = "SELECT RP.ID_PARADA, LON,LAT,DIRECCION,REFERENCIA, DIR_IMG, RP.ORDEN
    FROM RUTA_PARADA RP, RUTAS R, PARADAS P
    WHERE RP.ID_RUTA = R.ID_RUTA
    AND RP.ID_PARADA = P.ID_PARADA
    AND RP.ID_RUTA=" . $id_ruta . " AND R.TIPO = '" . $tipo . "'";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{failure:true}";
if (count($resulset) >= 1) {
    $datos = "";
    for ($i = 0; $i < count($resulset); $i++) {

        $fila = $resulset[$i];
        $datos .= $fila["ID_PARADA"] . "%"
                . $fila["LON"] . "%"
                . $fila["LAT"] . "%"
                . utf8_encode ( $fila["DIRECCION"] ). "%"
                . utf8_encode ( $fila["REFERENCIA"] ). "%"
                . $fila["DIR_IMG"] . "%"
                . $fila["ORDEN"] . "#";
    }
    $salida = "{success:true,datos: { coordenadas: '$datos' }}";
}
echo $salida;
?>
