<?php

require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = 
	"SELECT id_parqueadero
    FROM parqueaderos
";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{cantParking: [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $idParking = $fila["id_parqueadero"];
    
    $salida .= "{
            idParking:" . $idParking . ",";

    $historicoSql = "SELECT COUNT(*) AS TOTAL FROM PLAZAS_HISTORICO WHERE FECHA = '$fecha' AND id_parking = $idParking";
    consulta($historicoSql);
    $data = unicaFila();

    $salida .= "total:" . $data["TOTAL"] . "}";

    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>
