<?php

require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = 
	"SELECT U.ID_USUARIO,P.CEDULA,P.NOMBRES,P.APELLIDOS,RU.ROL_USUARIO,U.USUARIO,U.CLAVE,PA.PARQUEADERO
    FROM USUARIOS U JOIN PERSONAS P ON U.ID_PERSONA = P.ID_PERSONA
    JOIN ROL_USUARIO RU ON U.ID_ROL_USUARIO = RU.ID_ROL_USUARIO    
    JOIN PARQUEADEROS PA ON U.ID_PARKING= PA.ID_PARQUEADERO
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{usuarios: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            idUsuario:".$fila["ID_USUARIO"].",
            cedula:'" . $fila["CEDULA"] . "',
            persona:'" . $fila["APELLIDOS"]." ".$fila["NOMBRES"] . "',
            idRol:'" . $fila["ROL_USUARIO"] . "',            
            usuario:'" . $fila["USUARIO"] . "',
            clave:'" . $fila["CLAVE"] . "',
            idParking:'" . $fila["PARQUEADERO"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>
