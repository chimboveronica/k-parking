<?php

require_once('../../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    function coneccion() {if (!$mysqli = getConectionDb()) {} else {return $mysqli;}}

    $existeSql = "select motivo from sanciones where motivo='" . $json["motivo"] . "'";
    $result = $mysqli->query($existeSql);
    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'Los datos para esta sanción ya esta en uso.',state: false}";
        } else {

            $insertSql = "insert into sanciones (motivo,valor,descripcion)"
                    . "values(?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("sss", utf8_decode($json["motivo"]), utf8_decode($json["valor"]),utf8_decode($json["descripcion"]));
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Sancion Creada Correctamente.',state: true}";
                } else {
                    echo "{success:true, message: 'Problemas al Ingresar los Datos.',state: false}";
                }
                $stmt->close();
            } else {
                echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
            }
        }
        $mysqli->close();
    } else {
        echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
    }
}