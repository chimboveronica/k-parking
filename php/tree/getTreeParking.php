<?php
include('../login/isLogin.php');
require_once('../../dll/conect.php');

$idRol = $_SESSION["ID_ROL"];
$idParking = $_SESSION["ID_PARKING"];

if ($idRol == 2) {
    $consultaParking = 
        "SELECT id_parqueadero, parqueadero, plazas, latitud, longitud
        FROM  kparkingdb.parqueaderos WHERE id_parqueadero = $idParking"
    ;
} else {
    $consultaParking = 
        "SELECT id_parqueadero, parqueadero, plazas, latitud, longitud
        FROM  kparkingdb.parqueaderos"
    ;
}

consulta($consultaParking);
$resulset = variasFilas();
$objJson = "[";
for ($i = 0; $i < count($resulset); $i++) {
    $filas = $resulset[$i];        
    $idPunto = $filas["id_parqueadero"];
    $nombrePunto = $filas["parqueadero"];    

    $objJson.="{'text':'".$idPunto. ":: " . $nombrePunto . "',
        'iconCls':'icon-parking',
        'id':'" . $idPunto . "',
        'leaf':true}";

    if ($i < (count($resulset) - 1)) {
        $objJson .= ",";
    }
}

$objJson .= "]";

echo utf8_encode($objJson);
?>