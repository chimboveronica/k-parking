<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
extract($_GET);

$salida = "{failure:true}";

$consultaSql = "
            SELECT ID_RUTA,NOMBRE
            FROM RUTAS
            WHERE TIPO = '".$op."'
            ";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"rutas\": [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            \"id\":\"" . $fila["ID_RUTA"] . "\",
            \"name\":\"" . utf8_encode($fila["NOMBRE"]) . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>