<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
   
       
            $setMotivo= $setValor =$setDescripcion= "";

            if (isset($json["motivo"])) {
                $setMotivo = "motivo='" . utf8_decode($json["motivo"]) . "',";
            }
            if (isset($json["valor"])) {
                $setValor = "valor='" . utf8_decode($json["valor"]) . "',";
            }
            if (isset($json["descripcion"])) {
                $setDescripcion= "descripcion='" .utf8_decode($json["descripcion"]) . "',";
            }

            $setId = "id_sancion = " . $json["id"];

            $updateSql = "update sanciones "
                    . "set $setMotivo$setValor$setDescripcion$setId  "
                    . "where id_sancion = ?";

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