<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
extract($_GET);

$salida = "{failure:true}";

$consultaSql = "
            SELECT ID_RECORRIDO,NOMBRE
            FROM RECORRIDOS
            ORDER BY NOMBRE
            ";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"recorridos\": [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            \"id\":\"" . $fila["ID_RECORRIDO"] . "\",
            \"name\":\"" . utf8_encode($fila["NOMBRE"]) . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>