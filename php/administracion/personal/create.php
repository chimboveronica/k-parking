<?php

require_once('../../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $existeSql = "select cedula from personas  where cedula='" . $json["cedula"] . "'";
    $result = $mysqli->query($existeSql);
    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'La persona ya se encuentra registrada.',state: false}";
        } else {

            $insertSql = "insert into personas (CEDULA,ID_EMPLEO,NOMBRES,APELLIDOS,EMAIL,FECHA_NACIMIENTO,DIRECCION,CELULAR)"
                    . "values(?, ?, ?, ?, ?,?,?,?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("sissssss", $json["cedula"], $json["cbxEmpleo"], utf8_decode($json["nombres"]), utf8_decode($json["apellidos"]), utf8_decode($json["email"]), utf8_decode($json["fecha_nacimiento"]), utf8_decode($json["direccion"]), $json["celular"]);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Persona Creada Correctamente.',state: true}";
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