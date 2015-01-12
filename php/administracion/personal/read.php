<?php

require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = 
	"SELECT P.ID_PERSONA,P.CEDULA,P.NOMBRES,P.APELLIDOS,P.EMAIL,E.EMPLEO,
    P.FECHA_NACIMIENTO,P.DIRECCION,P.CELULAR, P.ICON
    FROM PERSONAS P JOIN EMPLEOS E
    ON P.ID_EMPLEO = E.ID_EMPLEO
    ORDER BY P.APELLIDOS
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{personas: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            id_persona:".$fila["ID_PERSONA"].",
            cedula:'" . $fila["CEDULA"] . "',
            nombres:'" . $fila["NOMBRES"] . "',
            apellidos:'" . $fila["APELLIDOS"] . "',            
            email:'" . $fila["EMAIL"] . "',
            cbxEmpleo:'" . $fila["EMPLEO"] . "',
            fecha_nacimiento:'" . $fila["FECHA_NACIMIENTO"] . "',
            direccion:'" . $fila["DIRECCION"] . "',
            celular:'" .$fila["CELULAR"] . "',
            icon:'" .$fila["ICON"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>
