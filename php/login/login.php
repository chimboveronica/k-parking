<?php
include ('../../dll/conect.php');
extract($_POST);

$salt = "KR@D@C";
$encriptClave = md5(md5(md5($ps) . md5($salt)));
$consultaSql = 
    "SELECT U.ID_USUARIO, U.USUARIO, U.ID_ROL_USUARIO, U.CLAVE, P.CEDULA,
    P.NOMBRES, P.APELLIDOS, U.ID_PARKING
    FROM USUARIOS U, PERSONAS P
    WHERE U.ID_PERSONA = P.ID_PERSONA    
    AND U.USUARIO = '" . $us . "' 
    AND U.CLAVE = '" . $encriptClave . "'
    "
;

consulta($consultaSql);
$registro = unicaFila();

if ($registro["CLAVE"] == $encriptClave && $registro["USUARIO"] == $us) {        
    // Deteccion de la ip y del proxy
    if (isset($HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"])) {
        $ip = $HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"];
        $array = split(",", $ip);
        $ip_proxy = $array[0];
        $host = @gethostbyaddr($ip_proxy);
        $ip_proxy = $HTTP_SERVER_VARS["REMOTE_ADDR"];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
        $host = @gethostbyaddr($ip);
    }

    $idUser = $registro["ID_USUARIO"];
    //$fecha = @date("Y-m-d");
    //$hora = @date("H:i:s");

    $consultaSql = 
        "INSERT INTO ACCESOS_HISTORICO (IP,HOST,ID_USUARIO,FECHA,HORA,LONGITUD,LATITUD)
        VALUES ('$ip','$host',$idUser,DATE(NOW()),TIME(NOW()),'$longitud','$latitud')
        "
    ;    

    consulta($consultaSql);    

    session_start();
    $_SESSION["INI"] = 'http://localhost/k-parking/';        
    $_SESSION["ID_USUARIO"] = $registro["ID_USUARIO"];
    $_SESSION["USUARIO"] = utf8_encode($registro["USUARIO"]);
    $_SESSION["ID_ROL"] = $registro["ID_ROL_USUARIO"];
    $_SESSION["ID_PARKING"] = $registro["ID_PARKING"];
    $_SESSION["NOM_APE"] = utf8_encode($registro["NOMBRES"]." ".$registro["APELLIDOS"]);
    $_SESSION["SESION"] = true;    

    switch ($registro["ID_ROL_USUARIO"]) {
        case 1:            
            echo "<script type='text/javascript'>location.href='../../index_kradac.php'</script>";
            break;
        case 2:            
            echo "<script type='text/javascript'>location.href='../../index_controlador.php'</script>";
            break;
    }    
} else {    
    echo "<script>alert('Ingrese Nuevamente');</script>";    
    echo "<script>location.href='../../index.php'</script>";
    //header('Location: ../../index.php');
}
?>
