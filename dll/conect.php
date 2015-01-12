<?php

$Conexion_ID = 0;
$Consulta_ID = 0;

/* numero de error y texto error */
$Errno = 0;
$Error = "";
$BaseDatos = "kparkingdb";
$Servidor = "localhost";
$Usuario = "root";
$Clave = "";

//$pss = md5($Clave);
$pss = $Clave;

// Conectamos al servidor
$Conexion_ID = mysql_connect($Servidor, $Usuario, $pss);

function getConectionDb() {
    /* DATOS DE MI SERVIDOR */
//    $db_name = "kbusdb";
//    $db_host = "172.16.57.11";
//    $db_user = "chimboveronica";
//    $db_password = "chimboveronicades2";

    $db_name = "kparkingdb";
    $db_host = "localhost";
    $db_user = "root";
    $db_password = "";

    @$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    return ($mysqli->connect_errno) ? false : $mysqli;
}

if (!$Conexion_ID) {
    $Error = "Ha fallado la conexión.";
    echo $Error;
}else{
    $_SESSION["idBD"] = $Conexion_ID;
}

//seleccionamos la base de datos
if (!@mysql_select_db($BaseDatos, $Conexion_ID)) {
    $Error = "Imposible abrir " . $BaseDatos;
    echo $Error;
}


/* Ejecuta un consulta */
function consulta($sql) {
    if ($sql == "") {
        $Error = "No ha especificado una consulta SQL";
        return 0;
    }
    //ejecutamos la consulta
   @$_SESSION["idSQL"] = mysql_query($sql, $_SESSION["idBD"]);
    if (!$_SESSION["idSQL"]) {
        $Errno = mysql_errno();
        $Error = mysql_error();
        return 0;
    }else{
        return 1;
    }
}

/*
 * Consulta JSON
 *
 */
function consultaJSON($sql){
    return mysql_query($sql, $_SESSION["idBD"]);
}

/*
 * Devuelve todas las filas de la Consulta
 * de forma que es un Array dentro de otro.
 * (nombres de campos en MAYUSCULAS)
 *
 */
function variasFilas() {
    $vector = null;
    $pos = 0;

    while ($row = @mysql_fetch_row($_SESSION["idSQL"])) {
        $fila = "";
        for ($i = 0; $i < count($row); $i++) {
            $nCampo = @mysql_field_name($_SESSION["idSQL"], $i);
            $fila[$nCampo] = $row[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}

/*
 * Devuelve la primer fila de la consulta
 * (nombres de campos en MAYUSCULAS)
 */
function unicaFila() {

    $fila = "";
    while ($row = mysql_fetch_row($_SESSION["idSQL"])) {
        for ($i = 0; $i < count($row); $i++) {
            $nCampo = mysql_field_name($_SESSION["idSQL"], $i);
            $fila[$nCampo] = $row[$i];
        }        
        return $fila;
    }
}

/*
 * Se termina la conexi�n esto por cada sesi�n.
 */
function cerrarConexion() {
    @mysql_close($_SESSION["idBD"]);
}

?>
