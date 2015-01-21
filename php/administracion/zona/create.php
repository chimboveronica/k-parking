<?php

require_once('../../../dll/conect.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    function coneccion() {if (!$mysqli = getConectionDb()) {} else {return $mysqli;}}

    $existeSql = "select nombre from zonas where nombre='" . $json["nombre"] . "'";
    $coord = $json["coordenadas"];
    $result = $mysqli->query($existeSql);
    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'Los datos para esta zona ya esta en uso.',state: false}";
        } else {

            $insertSql = "insert into zonas (nombre,horario,color,descripcion,tiempo,tiempo_fraccion,area)"
                    . "values(?, ?, ?, ?, ?,?,?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("ssssssd", utf8_decode($json["nombre"]), $json["horario"], $json["color"], utf8_decode($json["descripcion"]), $json["tiempo"], $json["tiempo_fraccion"],$json["area"]);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Zona Creada Correctamente.',state: true}";
                    $sql = "SELECT MAX(ID_ZONA) AS M FROM ZONAS";
                    $result1 = coneccion()->query($sql);
                    $myrow = $result1->fetch_assoc();
                        $coord = explode(";", $json["coordenadas"]);

                    $idGeo = $myrow["M"];

                    for ($i = 0; $i < count($coord); $i++) {
                        $xy = explode(",", $coord[$i]);
                   
                        $consultaSql4 = "INSERT INTO puntos_zonas(id_zona,orden ,latitud, longitud)
                VALUES($idGeo," . ($i + 1) . " ,$xy[1], $xy[0])";
                        coneccion()->query($consultaSql4);
                    }
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