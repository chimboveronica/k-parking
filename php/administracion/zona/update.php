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

    $setNombre = $setColor = $setHorario = $setArea = $setTiempo = $setTiempoFraccion = $setDescripc = "";
    if (isset($json["nombre"])) {
        $setNombre = "nombre='" . utf8_decode($json["nombre"]) . "',";
    }
    if (isset($json["horario"])) {
        $setHorario = "horario='" . utf8_decode($json["horario"]) . "',";
    }
    if (isset($json["color"])) {
        $setColor = "color='" . utf8_decode($json["color"]) . "',";
    }
    if (isset($json["area"])) {
        $setArea = "area='" . $json["area"] . "',";
    }
    if (isset($json["tiempo"])) {
        $setTiempo = "tiempo='" . $json["tiempo"] . "',";
    }
    if (isset($json["tiempoFraccion"])) {
        $setTiempoFraccion = "tiempo_fraccion='" . $json["tiempoFraccion"] . "',";
    }
    if (isset($json["descripcion"])) {
        $setDescripc = "descripcion='" . utf8_decode($json["descripcion"]) . "',";
    }



    $setId = "id_zona= " . $json["id"];
    $updateSql = "update zonas set $setNombre$setColor$setHorario$setArea$setTiempo$setTiempoFraccion$setDescripc$setId where id_zona = ?;";
    $stmt = $mysqli->prepare($updateSql);
    if ($stmt) {
        $stmt->bind_param("i", $json["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            if (isset($json["coordenadas"])) {
                $coord = explode(";", $json["coordenadas"]);
                $idGeo = $json["id"];
                
                $consultaSql = "delete from puntos_zonas where id_zona = $idGeo";
                coneccion()->query($consultaSql);
                
//                for ($i = 0; $i < count($coord); $i++) {
//                    $xy = explode(",", $coord[$i]);
//                    $consultaSql4 = "INSERT INTO puntos_zonas(id_zona,orden ,latitud, longitud)
//                VALUES($idGeo," . ($i + 1) . " ,$xy[1], $xy[0])";
//                    coneccion()->query($consultaSql4);
//                }
            }
            
            echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
        } else {
            echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
        }
        $stmt->close();
    } else {
        echo "{success:true, message: 'sssssssss.',state: false}";
    }

    $mysqli->close();
}