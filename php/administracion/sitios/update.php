<?php

require_once('../../../dll/conect.php');


if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
   
       
            $setNombre = $setDireccion = $setLatitud = $setLongitud = $setImg =$setDescripcion= "";

            if (isset($json["nombre"])) {
                $setNombre = "nombre='" . utf8_decode($json["nombre"]) . "',";
            }
            if (isset($json["direccion"])) {
                $setDireccion = "direccion='" . utf8_decode($json["direccion"]) . "',";
            }
            if (isset($json["longitudSitio"])) {
               $setLongitud = "longitud=" . $json["longitudSitio"] . ",";
            }
            if (isset($json["latitudSitio"])) {
                $setLatitud = "latitud=" . $json["latitudSitio"] . ",";
            }
            if (isset($json["img"])) {
                $setImg = "img='" . $json["img"] . "',";
            }
            if (isset($json["descripcion"])) {
                $setDescripcion= "descripcion='" .utf8_decode($json["descripcion"]) . "',";
            }

            $setId = "id_sitio = " . $json["id"];

            $updateSql = "update sitios "
                    . "set $setNombre$setDireccion$setLatitud$setLongitud$setImg$setDescripcion$setId  "
                    . "where id_sitio = ?";

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