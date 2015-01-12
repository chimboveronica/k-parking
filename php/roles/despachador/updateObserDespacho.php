<?php

include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_POST);

$updateSql = 
    "UPDATE DESPACHOS 
    SET OBSERVACION = '$observacion'
    WHERE ID_DESPACHO = $idDespacho"
;

if (consulta($updateSql) == 1) {
	$salida = '{success:true}';
} else {
	$salida = "{failure:true}";
}

echo $salida;
?>