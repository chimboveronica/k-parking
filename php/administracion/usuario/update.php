<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $setPersona = $setRol = $setUsuario = $setClave = $setIdParking = "";
    if (isset($json["persona"])) {
        $setPersona = "ID_PERSONA=" . $json["persona"] . ",";
    }

    if (isset($json["idRol"])) {
        $setRol = "ID_ROL_USUARIO=" . $json["idRol"] . ",";
    }

    if (isset($json["usuario"])) {
        $setUsuario = "USUARIO='" . $json["usuario"] . "',";
    }

    if (isset($json["clave"])) {
        $partes = $json["clave"];
        $clave = $partes[0];
        $salt = "KR@D@C";
        $encriptClave = md5(md5(md5($clave) . md5($salt)));

        $setClave = "CLAVE='$encriptClave',";
    }

    if (isset($json["idParking"])) {
        $setRol = "ID_PARKING=" . $json["idParking"] . ",";
    }

    $setId = "ID_USUARIO = " . $json["id"];


    $updateSql = "update usuarios "
            . "set $setPersona$setRol$setUsuario$setClave$setIdParking$setId "
            . "where id_usuario = ?";

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
?>