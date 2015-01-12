<?php

include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

if (isset($horaIniC)) {
    $horaIni = $horaIniC;
}

extract($_POST);
$consultaSql = 
	"SELECT ID_USUARIO FROM USUARIOS WHERE USUARIO = '".$_SESSION["USUARIO"]."'"
;

consulta($consultaSql);
$resultSet = unicaFila();
$id_Us = $resultSet["ID_USUARIO"];

$consultaSql = 
	"SELECT COUNT(*) AS 'C' FROM PUNTOS_RUTA WHERE ID_RUTA = $ruta"
;

consulta($consultaSql);
$resultSet = unicaFila();
$cantParRutas = $resultSet["C"];

$consultaSql = 
    "INSERT INTO DESPACHOS (ID_USUARIO,ID_RUTA,ID_EQUIPO,FECHA,HORA_INI,HORA_REG,PAR_RUTA,PAR_RUTA_ATRAV,ID_TIPO_SANCION,ESTADO_SANCION)
    VALUES($id_Us,$ruta,'$cbxBuses','$fecha','$horaIni','$hora_reg',$cantParRutas,0,0,0)"
;

$ingreso = consulta($consultaSql);

$salida = "{failure:true}";
if ($ingreso == 1) {
	$salida = '{success:true}';
}

echo $salida;
?>