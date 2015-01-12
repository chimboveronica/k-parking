<?php

require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = "SELECT ID_ROL_USUARIO, ROL_USUARIO
    FROM ROL_USUARIO
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{rol_usuario: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            id:" . $fila["ID_ROL_USUARIO"] . ",
            nombre:'" . $fila["ROL_USUARIO"]. "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>
