<?php

session_start();
require_once('../../../dll/php/conexionBD.php');
extract($_POST);
extract($_GET);

$factorLAT = $meters / (1852 * 60);
$factorLON = (($meters * 0.00001) / 0.000111 ) / 10000;

$lat1 = $y - $factorLAT;
$lat2 = $y + $factorLAT;
$lon1 = $x - $factorLON;
$lon2 = $x + $factorLON;

$consultaSql = " SELECT ID_PARADA, DIRECCION, LAT, LON, REFERENCIA, DIR_IMG FROM
PARADAS WHERE ( LON >= $lon1 AND LON <= $lon2 ) AND ( LAT >= $lat1 AND LAT <= $lat2)";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{failure:true}";
$orden = 1;
if (count($resulset) >= 1) {
    $datos = "";
    for ($i = 0; $i < count($resulset); $i++) {

        $fila = $resulset[$i];
        $datos .= $fila["ID_PARADA"] . "%"
                . $fila["LON"] . "%"
                . $fila["LAT"] . "%"
                . $fila["DIRECCION"] . "%"
                . $fila["REFERENCIA"] . "%"
                . $fila["DIR_IMG"] . "%"
                . $orden . "#";
        $orden = $orden + 1;
    }
    $salida = "{success:true,datos: { coordenadas: '$datos' }}";
}
echo $salida;
?>
