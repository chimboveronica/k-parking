<?php

require_once('../../../dll/conect.php');

extract($_POST);

$salida = "{success:false, message:'No se pudo actualizar los Datos'}";
$setPersona = $setRol = $setUsuario = $setClave = $setIdParking = "";

$json = json_decode($usuarios, true);

if (isset($json["persona"])) {
    $setPersona = "ID_PERSONA=".$json["persona"].",";
}

if (isset($json["idRol"])) {
    $setRol = "ID_ROL_USUARIO=".$json["idRol"].",";
}

if (isset($json["usuario"])) {
    $setUsuario = "USUARIO='".$json["usuario"]."',";
}

if (isset($json["clave"])) {
    $partes = $json["clave"];
    $clave = $partes[0];
    $salt = "KR@D@C";
    $encriptClave = md5(md5(md5($clave) . md5($salt)));

    $setClave = "CLAVE='$encriptClave',";
}

if (isset($json["idParking"])) {
    $setRol = "ID_PARKING=".$json["idParking"].",";
}

$setId = "ID_USUARIO = ".$json["id"];

$updateSql = 
    "UPDATE USUARIOS 
    SET $setPersona$setRol$setUsuario$setClave$setIdParking$setId
    WHERE ID_USUARIO = ".$json["id"]
;

$updateSql = utf8_decode($updateSql);

if (consulta($updateSql) == 1) {
    $salida = "{success:true, message:'Datos Actualizados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$updateSql'}";
}

echo $salida;
?>