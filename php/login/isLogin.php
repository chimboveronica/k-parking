<?php
//Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
    session_start();
}

$rutaPrincipal = "http://localhost/k-parking/";

//Comprobar si esta logeado
if (!isset($_SESSION["ID_USUARIO"]) || 
	!isset($_SESSION["USUARIO"]) || 
	!isset($_SESSION["SESION"])) {    
    header("Location: $rutaPrincipal");
	exit();
}
?>

