<?php
include('isLogin.php');
require_once('../../dll/conect.php');

$id_user = $_SESSION["ID_USUARIO"];

$updateSql = 
	"UPDATE ACCESOS SET CONECT = 0 WHERE ID_USUARIO = $id_user";

if (consulta($updateSql)) {
	cerrarConexion();

	session_destroy();
	header('Location: ../../index.php');
}
?>