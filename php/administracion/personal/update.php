<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $setCedula = $setNombres = $setEmpleo = $setFechaNac = $setEmail = $setDireccion = $setCelular = "";
    if (isset($json["cedula"])) {
        $setCedula = "CEDULA='" . $json["cedula"] . "',";
    }

    if (isset($json["nombres"])) {
        $setNombres = "NOMBRES='" . $json["nombres"] . "',";
    }

    if (isset($json["apellidos"])) {
        $setApellidos = "APELLIDOS='" . $json["apellidos"] . "',";
    }

    if (isset($json["cbxEmpleo"])) {
        $setEmpleo = "ID_EMPLEO=" . $json["cbxEmpleo"] . ",";
    }

    if (isset($json["fecha_nacimiento"])) {
        $setFechaNac = "FECHA_NACIMIENTO='" . $json["fecha_nacimiento"] . "',";
    }

    if (isset($json["email"])) {
        $setEmail = "EMAIL='" . $json["email"] . "',";
    }

    if (isset($json["direccion"])) {
        $setDireccion = "DIRECCION='" . $json["direccion"] . "',";
    }

    if (isset($json["celular"])) {
        $setCelular = "CELULAR='" . $json["celular"] . "',";
    }

    $setId = "id_persona = " . $json["id"];

    $updateSql = "update personas "
            . "set $setCedula$setNombres$setEmpleo$setFechaNac$setEmail$setDireccion$setCelular$setId  "
            . "where id_persona = ?";

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