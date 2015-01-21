<?php

require_once('../../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    function coneccion() {
        if (!$mysqli = getConectionDb()) {
            
        } else {
            return $mysqli;
        }
    }

    $existeSql = "select parqueadero from kparkingdb.parqueaderos where parqueadero='" . $json["parqueadero"] . "'";
    $result = $mysqli->query($existeSql);
    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'Los datos para este parqueadero ya esta en uso.',state: false}";
        } else {

            $insertSql = "insert into kparkingdb.parqueaderos(parqueadero,plazas,direccion,latitud,longitud,valor)
                   values(?,?,?,?,?,?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("sisssi", $json["parqueadero"], $json["plazas"], utf8_decode($json["direccion"]), $json["latitudS"], $json["longitudS"], $json["valor"]);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Parqueadero Creado Correctamente.',state: true}";
                    	
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