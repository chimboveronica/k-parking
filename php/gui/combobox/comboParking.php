<?php
include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

$idRol = $_SESSION["ID_ROL"];
$idParking = $_SESSION["ID_PARKING"];

$salida = "{failure:true}";

if ($idRol == 2) {
    $consultaSql = 
        "SELECT ID_PARQUEADERO, PARQUEADERO
        FROM PARQUEADEROS WHERE ID_PARQUEADERO = $idParking"
    ;
} else {
    $consultaSql = 
        "SELECT ID_PARQUEADERO, PARQUEADERO
        FROM PARQUEADEROS"
    ;
}

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{parking: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            id:" . $fila["ID_PARQUEADERO"] . ",
            nombre:'".$fila["ID_PARQUEADERO"] ."::". $fila["PARQUEADERO"]. "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>