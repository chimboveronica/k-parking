<?php

require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_EMPRESA, EMPRESA
    FROM EMPRESAS
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "[";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "[
            '" . utf8_encode($fila["EMPRESA"]) . "',
            '" . utf8_encode($fila["EMPRESA"]) . "'
        ]";

    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]";

echo $salida;
?>
