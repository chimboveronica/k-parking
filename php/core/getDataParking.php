<?php
include('../login/isLogin.php');
require_once('../../dll/conect.php');

$idRol = $_SESSION["ID_ROL"];
$idParking = $_SESSION["ID_PARKING"];

if ($idRol == 2) {
    $consultaSql = 
        "SELECT id_parqueadero, parqueadero, plazas, latitud, longitud
        FROM kparkingdb.parqueaderos WHERE id_parqueadero = $idParking"
    ;
} else {
    $consultaSql = 
        "SELECT id_parqueadero, parqueadero, plazas, latitud, longitud
        FROM kparkingdb.parqueaderos"
    ;
}

consulta($consultaSql);
$resulset = variasFilas();

if (count($resulset) > 0) {
    $json = "{puntos: [";

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $idParking = $fila["id_parqueadero"];

        $json .= "{
            idParking:'".$idParking."',            
            parking:'" . $fila["parqueadero"] . "',
            latitud:'" . $fila["latitud"] . "',
            longitud:'" . $fila["longitud"] . "',
            plazas:'" . $fila["plazas"] . "',";

        $ocupadosSql = "SELECT COUNT(*) AS OCUPADAS FROM PLAZAS WHERE ID_parqueadero =$idParking AND ESTADO = 1";
        consulta($ocupadosSql);
        $data = unicaFila();

        $json .= "ocupadas:'" . $data["OCUPADAS"] . "'}";


        if ($i != count($resulset) - 1) {
            $json .= ",";
        }
    }        

    $json .="]}";
            
    $json = preg_replace("[\n|\r|\n\r]", "", utf8_encode($json));        

    $salida = "{success:true, string: ".json_encode($json)."}"; 
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>
