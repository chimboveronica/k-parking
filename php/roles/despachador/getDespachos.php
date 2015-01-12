<?php

include('../../login/isLogin.php');
require_once('../../../dll/conect.php');

extract($_GET);

$salida = "{failure:true}";

$consultaSql = 
    "SELECT D.ID_DESPACHO,P.NOMBRES, P.APELLIDOS, R.NOMBRE_RUTA, 
    B.REG_MUNICIPAL, D.FECHA, D.HORA_INI, D.HORA_REG,
    D.PAR_RUTA, D.PAR_RUTA_ATRAV,D.HORA_FIN_PROG,
    D.HORA_FIN_REAL,D.ATRASO,TS.TIPO_SANCION, D.ESTADO_SANCION,
    B.ID_EMPRESA, B.ID_EQUIPO, R.ID_RUTA, D.OBSERVACION
    FROM DESPACHOS D JOIN USUARIOS U
    ON D.ID_USUARIO = U.ID_USUARIO JOIN PERSONAS P
    ON P.ID_PERSONA = U.ID_PERSONA JOIN RUTAS R
    ON D.ID_RUTA = R.ID_RUTA JOIN BUSES B
    ON B.ID_EQUIPO = D.ID_EQUIPO JOIN TIPO_SANCION TS
    ON D.ID_TIPO_SANCION = TS.ID_TIPO_SANCION
    WHERE U.USUARIO = '".$_SESSION["USUARIO"]."'
    AND D.FECHA = DATE(NOW())
    ORDER BY D.ID_DESPACHO DESC"
;

consulta($consultaSql);
$resulset = variasFilas();

if (count($resulset) >= 1) {
    $salida = "{despachos: [";

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $salida .= "{
                idDespacho : " . $fila["ID_DESPACHO"] . ",
                despachador:'" . $fila["NOMBRES"]." ".$fila["APELLIDOS"]."',
                ruta:'" . $fila["NOMBRE_RUTA"] . "',
                reg_municipal:'" . $fila["REG_MUNICIPAL"] ."',
                fecha_hora:'" . $fila["FECHA"] . " " .$fila["HORA_INI"]."',
                hora_reg:'". $fila["HORA_REG"] . "',
                par_ruta:'". $fila["PAR_RUTA"] . "',
                par_ruta_atrav:'". $fila["PAR_RUTA_ATRAV"] . "',
                hora_fin_prog:'". $fila["HORA_FIN_PROG"] . "',
                hora_fin_real:'". $fila["HORA_FIN_REAL"] . "',
                atraso:'". $fila["ATRASO"] . "',
                sancion:'". $fila["TIPO_SANCION"] . "',
                estado_sancion:'". $fila["ESTADO_SANCION"] . "',
                id_eqp:'". $fila["ID_EQUIPO"] . "',
                id_emp:'". $fila["ID_EMPRESA"] . "',
                id_ruta:". $fila["ID_RUTA"] . ",
                observacion:'". $fila["OBSERVACION"] . "'
            }";
        if ($i != count($resulset) - 1) {
            $salida .= ",";
        }
    }

    $salida .="]}";
}

echo utf8_encode($salida);
?>