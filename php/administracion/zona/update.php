<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $existeSql = "select empresa from empresas where acronimo='" . $json["acronymCompany"] . "' or empresa='" . $json["companyCompany"] . "'";

    $result = $mysqli->query($existeSql);
    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'Los datos para esta empresa ya esta en uso.',state: false}";
        } else {
            $setEmpresa = $setAcronimo = $setDireccion = $setTelefono = $setCorreo = "";

            if (isset($json["companyCompany"])) {
                $setEmpresa = "empresa='" . utf8_decode($json["companyCompany"]) . "',";
            }
            if (isset($json["acronymCompany"])) {
                $setAcronimo = "acronimo='" . utf8_decode($json["acronymCompany"]) . "',";
            }
            if (isset($json["addressCompany"])) {
                $setDireccion = "direccion='" . utf8_decode($json["addressCompany"]) . "',";
            }
            if (isset($json["cellCompany"])) {
                $setTelefono = "telefono='" . $json["cellCompany"] . "',";
            }
            if (isset($json["emailCompany"])) {
                $setCorreo = "correo='" . $json["emailCompany"] . "',";
            }

            $setId = "id_empresa = " . $json["id"];

            $updateSql = "update empresas "
                    . "set $setAcronimo$setEmpresa$setDireccion$setTelefono$setCorreo$setId  "
                    . "where id_empresa = ?";

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
    }
} 