<?php

include('../login/isLogin.php');
require_once('../../dll/conect.php');

$idRol = $_SESSION["ID_ROL"];
$idParking = $_SESSION["ID_PARKING"];

if ($idRol == 2) {
    $consultaParking = "SELECT id_sitio,nombre,direccion,latitud,longitud, img, descripcion FROM kparkingdb.sitios WHERE id_sitio = $idParking"
    ;
} else {
    $consultaParking = "SELECT id_sitio,nombre,direccion,latitud,longitud, img, descripcion FROM kparkingdb.sitios"
    ;
}

consulta($consultaParking);
$resulset = variasFilas();
$objJson = "[";
for ($i = 0; $i < count($resulset); $i++) {
    $filas = $resulset[$i];
    $idPunto = $filas["id_sitio"];
    $nombrePunto = $filas["nombre"];
    $latitud = $filas["latitud"];
    $longitud = $filas["longitud"];
    $objJson.="{'text':'" . $idPunto . ":: " . $nombrePunto . "',
        'iconCls':'icon-parking',
        'id':'" . $idPunto . "',
        'longitud':'" . $longitud . "',
        'latitud':'" . $latitud . "',
        'leaf':true}";

    if ($i < (count($resulset) - 1)) {
        $objJson .= ",";
    }
}

$objJson .= "]";

echo utf8_encode($objJson);
?>