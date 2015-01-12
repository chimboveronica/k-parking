<?php

require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = 
	"SELECT ID_PERSONA, NOMBRES, APELLIDOS
    FROM PERSONAS ORDER BY APELLIDOS
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{'personas': [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            'id':'" . $fila["ID_PERSONA"] . "',
            'nombre':'" . $fila["APELLIDOS"]." ".$fila["NOMBRES"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>
