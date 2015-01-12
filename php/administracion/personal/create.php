<?php

require_once('../../../dll/conect.php');

extract($_POST);

$salida = "{success:false, message:'No se pudo insertar los Datos'}";

$json = json_decode($personas, true);

$existeSql = 
    "SELECT COUNT(CEDULA) AS C FROM PERSONAS WHERE CEDULA='".$json["cedula"]."'"
;

consulta($existeSql);

$resultados = unicaFila();

if ($resultados["C"] >= 1) {
    $salida = "{success:false, message:'Cedula Repetida'}";
} else {
    if ($json["fecha_nacimiento"] == '') {
        $json["fecha_nacimiento"] = '0000-00-00';
    }
    if ($json["cbxEmpleo"] == 0) {
        $json["cbxEmpleo"] = 4; //Porque si esta vacio viene a ser una persona natural
    }
    $insertSql = 
    "INSERT INTO PERSONAS (CEDULA,ID_EMPLEO,NOMBRES,APELLIDOS,EMAIL,FECHA_NACIMIENTO,DIRECCION,CELULAR)
    VALUES('".$json["cedula"]."',".$json["cbxEmpleo"].",'".$json["nombres"]."','".$json["apellidos"]."','".$json["email"]."','".$json["fecha_nacimiento"]."','".$json["direccion"]."','".$json["celular"]."')"
    ;
    $insertSql = utf8_decode($insertSql);

    if (consulta($insertSql) == 1) {
        $salida = "{success:true, message:'Datos Insertados Correctamente.'}";
    } else {
        $salida = "{success:false, message:'$insertSql'}";
    }
}

echo $salida;
?>