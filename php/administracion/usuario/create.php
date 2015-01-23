<?php

require_once('../../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $clave = $json["clave"];
    $clave = $clave[0];

    $salt = "KR@D@C";
    $encriptClave = md5(md5(md5($clave) . md5($salt)));

    $existeSql = "select usuario from usuarios  where usuario='" . $json["usuario"] . "'";
    $result = $mysqli->query($existeSql);
    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'El usuario ya se encuentra registrado.',state: false}";
        } else {

            $insertSql = "insert into usuarios(ID_ROL_USUARIO,ID_PERSONA,USUARIO,CLAVE,ID_PARKING)"
                    . "values(?, ?, ?, ?,?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("iissi", $json["idRol"], $json["persona"], utf8_decode($json["usuario"]), $encriptClave, $json["idParking"]);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Usuario Creado Correctamente.',state: true}";
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