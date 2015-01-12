<?php

require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_EMPLEO, EMPLEO
    FROM EMPLEOS;
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'empleos': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':'" . $fila["ID_EMPLEO"] . "',
            'nombre':'" . $fila["EMPLEO"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>
