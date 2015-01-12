<?php

require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = 
	"SELECT COUNT(PH.FECHA) AS CANTIDAD, PH.FECHA, PH.HORA_INGRESO, P.PARQUEADERO
    FROM PLAZAS_HISTORICO PH, PARQUEADEROS P
    WHERE PH.iD_PARKING= P.ID_PARQUEADERO
    AND PH.FECHA = '$fecha' 
    AND PH.ID_PARKING = $idParking
    GROUP BY HOUR(PH.HORA_INGRESO)";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{cantParkingDiario: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $idParking = $fila["CANTIDAD"];
    
    $salida .= "{
            idParking:" . $idParking . ",
            parking:'" . $fila["PARQUEADERO"] . "',
            hora:'".$fila["FECHA"] ." ". $fila["HORA_INGRESO"] . "'
        }";

    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
