<?php

require_once('../../dll/conect.php');

extract($_POST);

$consultaSql = "SELECT MAX(ID_PARQUEADERO) AS MAX FROM PARQUEADEROS";
consulta($consultaSql);
$data = unicaFila();
$idParking = $data["MAX"]+1;
    
$insertSql = "INSERT INTO PARQUEADEROS (ID_PARQUEADERO, PARQUEADERO, PLAZAS, LATITUD, LONGITUD)
	VALUES('$idParking', '$parking', '$plazas', '$latitud', '$longitud')";

if (consulta($insertSql) == 1) {
	for ($i=1; $i <= $plazas; $i++) { 

		$insertSql = 
			"INSERT INTO PLAZAS (ID_PARQUEADERO, ID_PLAZA, ESTADO)
			VALUES ($idParking, $i, 0)";
	}
	$salida = "{success:true}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>
