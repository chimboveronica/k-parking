<?php

require_once('../../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
        function coneccion() {if (!$mysqli = getConectionDb()) {} else {return $mysqli;}}

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $destroySql = "delete from zonas where id_zona = ?";
    $stmt = $mysqli->prepare($destroySql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $id=$json["id"];
              $consultaSql4 = "delete from puntos_zonas where id_zona=$id";
                        coneccion()->query($consultaSql4);
            echo "{success:true, message:'Datos Eliminados Correctamente.',state: true}";
                     
        } else {
            echo "{success:true, message: 'No se puede eliminar esta Zona.',state: false}";
        }
        $stmt->close();
    } else {
        echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
    }
    $mysqli->close();
}