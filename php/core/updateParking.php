<?php

require_once('../../dll/conect.php');

extract($_POST);

$json = json_decode($puntos, true);

if (count($json) > 0) {
    for ($i = 0; $i < count($json); $i++) {
        $sql = "UPDATE PUNTOS SET 
            LATITUD=" . $json[$i]["latitud"] . ", 
            LONGITUD=" . $json[$i]["longitud"] . " 
            WHERE ID_PT='" . $json[$i]["idParking"]."'";
        consulta($sql);
    }
    $salida = "{success:true}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>
