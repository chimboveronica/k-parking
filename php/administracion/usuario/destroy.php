<?php

require_once('../../../dll/conect.php');

extract($_POST);

$json = json_decode($usuarios, true);

$destroySql = 
    "DELETE FROM USUARIOS WHERE ID_USUARIO = ".$json["id"]
;

if (consulta($destroySql) == 1) {
    $salida = "{success:true, message:'Datos Eliminados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$destroySql'}";
}


echo $salida;
?>