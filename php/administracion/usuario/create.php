<?php

require_once('../../../dll/conect.php');

extract($_POST);

$salida = "{success:false, message:'No se pudo insertar los Datos'}";

$json = json_decode($usuarios, true);

$clave = $json["clave"];
$clave = $clave[0];

$salt = "KR@D@C";
$encriptClave = md5(md5(md5($clave) . md5($salt)));

$queryMaxId = "SELECT MAX(ID_USUARIO) AS ID_USER FROM USUARIOS";
consulta($queryMaxId);
$data = unicaFila();
$id_user = $data["ID_USER"]+1;

$insertSql = 
    "INSERT INTO USUARIOS (ID_USUARIO,ID_ROL_USUARIO,ID_PERSONA,USUARIO,CLAVE,ID_PARKING)
    VALUES($id_user,".$json["idRol"].",".$json["persona"].",'".$json["usuario"]."','$encriptClave',".$json["idParking"].")"
;
$insertSql = utf8_decode($insertSql);

if (consulta($insertSql) == 1) {
    $salida = "{success:true, message:'Datos Insertados Correctamente.'}";
} else {
    $salida = "{success:false, message:'$insertSql'}";
}


echo $salida;
?>