<?php
require_once('../../dll/conect.php');
    $consultaParking = 
        "SELECT id_parqueadero, parqueadero, plazas, latitud, longitud
        FROM  kparkingdb.parqueaderos"
    ;

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