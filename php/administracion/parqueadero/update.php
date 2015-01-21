<?php

require_once('../../../dll/conect.php');
if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $setIdZona = $setDireccion = $setPlazas = $setValor = $setLatitud = $setLongitud = $setParqueadero = "";
    if (isset($json["parqueadero"])) {
        $setParqueadero = "parqueadero='" . utf8_decode($json["parqueadero"]) . "',";
    }
    if (isset($json["id_zona"])) {
        $setIdZona = "id_zona=" . $json["id_zona"] . ",";
    }
    if (isset($json["direccion"])) {
        $setDireccion = "direccion='" . utf8_decode($json["direccion"]) . "',";
    }
    if (isset($json["plazas"])) {
        $setPlazas = "plazas=" . $json["plazas"] . ",";
    }
    if (isset($json["valor"])) {
        $setValor = "valor=" . $json["valor"] . ",";
    }
    if (isset($json["latitudS"])) {
        $setLatitud = "latitud=" . $json["latitudS"] . ",";
    }
    if (isset($json["longitudS"])) {
        $setLongitud = "longitud=" . $json["longitudS"] . ",";
    }

    $setId = "id_parqueadero= " . $json["id"];
    $updateSql = "update parqueaderos set $setIdZona$setDireccion$setPlazas$setValor$setLatitud$setLongitud$setParqueadero$setId where id_parqueadero = ?;";

    $stmt = $mysqli->prepare($updateSql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
        } else {
            echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
        }
        $stmt->close();
    } else {
        echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
    }

    $mysqli->close();
}