<?php

require_once('../../../dll/conect.php');

extract($_POST);

$salida = "{success:false, message:'No se pudo actualizar los Datos'}";
$setCedula = $setNombres = $setApellidos = $setEmpleo = $setFechaNac = $setDireccion = $setEmail = $setCelular = "";

$json = json_decode($personas, true);

if (isset($json["cedula"])) {
    $setCedula = "CEDULA='".$json["cedula"]."',";
}

if (isset($json["nombres"])) {
    $setNombres = "NOMBRES='".$json["nombres"]."',";
}

if (isset($json["apellidos"])) {
    $setApellidos = "APELLIDOS='".$json["apellidos"]."',";
}

if (isset($json["cbxEmpleo"])) {
    $setEmpleo = "ID_EMPLEO=".$json["cbxEmpleo"].",";
}

if (isset($json["fecha_nacimiento"])) {
    $setFechaNac = "FECHA_NACIMIENTO='".$json["fecha_nacimiento"]."',";
}

if (isset($json["email"])) {
    $setEmail = "EMAIL='".$json["email"]."',";
}

if (isset($json["direccion"])) {
    $setDireccion = "DIRECCION='".$json["direccion"]."',";
}

if (isset($json["celular"])) {
    $setCelular = "CELULAR='".$json["celular"]."',";
}

$setId = "ID_PERSONA = ".$json["id"];

$updateSql = 
    "UPDATE PERSONAS 
    SET $setCedula$setNombres$setApellidos$setEmpleo$setFechaNac$setDireccion$setEmail$setCelular$setId
    WHERE ID_PERSONA = ".$json["id"]
;

$updateSql = utf8_decode($updateSql);

if (consulta($updateSql) == 1) {
    $salida = "{success:true, message:'Datos Actualizados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$updateSql'}";
}

echo $salida;
?>