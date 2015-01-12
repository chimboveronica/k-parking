<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
extract($_GET);

$salida = "{failure:true}";

$consultaSql = "
    SELECT  R.ID_RUTA, R.NOMBRE
    FROM RUTAS R, RUTA_HORA RH
    WHERE R.ID_RUTA = RH.ID_RUTA
    AND RH.HORA BETWEEN SUBTIME('" . $hora . "','0:15') AND ADDTIME('" . $hora . "','0:15')
    AND R.TIPO = '" . $op . "'
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