<?php

require_once('../../dll/conect.php');

extract($_POST);

if ($estado == 1) {
    $updateSql = 
		"UPDATE PLAZAS SET 
		PLACA = '$placa',
		ESTADO = $estado
		WHERE ID_PARKEADERO = $idParking
		AND ID_PLAZA = $idPlaza";
} else {
	$updateSql = 
		"UPDATE PLAZAS SET 		
		ESTADO = $estado
		WHERE ID_PARQUEADERO = $idParking
		AND ID_PLAZA = $idPlaza";
}

if (consulta($updateSql) == 1) {
	$salida = "{success:true}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>
