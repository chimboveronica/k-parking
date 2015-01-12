<?php

require_once('../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = 
	"SELECT ID_PLAZA, PLACA, ESTADO, FECHA, HORA_INGRESO, HORA_SALIDA, HORA_TOTAL, VALOR
    FROM PLAZAS
    WHERE ID_PARQUEADERO = $idParking
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{plazasAsig: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    
    $salida .= "{
            idPlaza:" . $fila["ID_PLAZA"] . ",
            placa:'" . $fila["PLACA"] . "',
            estado:" . $fila["ESTADO"] . ",
            fecha:'" . $fila["FECHA"] . "',
            horaIngreso:'" . $fila["HORA_INGRESO"] . "',
            horaSalida:'" . $fila["HORA_SALIDA"] . "',
            horaTotal:'" . $fila["HORA_TOTAL"] . "',
            valor:'" . $fila["VALOR"] . "'
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo utf8_encode($salida);
?>
