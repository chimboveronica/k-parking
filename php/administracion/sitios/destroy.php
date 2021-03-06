<?php
require_once('../../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $destroySql = "delete from sitios where id_sitio= ?";
    $stmt = $mysqli->prepare($destroySql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Datos Eliminados Correctamente.',state: true}";
        } else {
            echo "{success:true, message: 'No se puede eliminar esta Sitio.',state: false}";
        }
        $stmt->close();
    } else {
        echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
    }
    $mysqli->close();
}