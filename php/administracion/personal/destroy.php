<?php

require_once('../../../dll/conect.php');

extract($_POST);

$json = json_decode($personas, true);

$destroySql = 
    "DELETE FROM PERSONAS WHERE ID_PERSONA = ".$json["id"]
;

if (consulta($destroySql) == 1) {
    $salida = "{success:true, message:'Datos Eliminados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$destroySql'}";
}


echo $salida;
?>