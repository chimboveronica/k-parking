<?php
include("php/login/isLogin.php");
?>
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title>K-Parking</title>
        <link rel="shortcut icon" href="img/k.png" type="image/x-icon">
        <!--Vuelve a la visualizacion del viewport adaptable al tamaño del dispositivo--> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="shortcut icon" href="img/k.png" type="image/x-icon">

        <!--<link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/packages/ext-theme-gray/build/resources/ext-theme-gray-all.css">-->
                <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/options-toolbar.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/include-ext.js"></script>

        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/css/ItemSelector.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">
        <!--<link rel="stylesheet" type="text/css" href="openLayers/theme/default/style.css">-->
        <!--<link rel="stylesheet" type="text/css" href="openLayers/theme/default/google.css">-->
        <link rel="stylesheet" type="text/css" href="css/principal.css">

        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/ext-all.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/examples.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/packages/ext-charts/build/ext-charts.js"></script>

        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/example-data.js"></script>


        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>
<!--        <script src="openLayers/OpenLayers.js"></script>-->

        <script type="text/javascript">
<?php
echo "
                var usuario = '" . $_SESSION["USUARIO"] . "';
                var id_rol = " . $_SESSION["ID_ROL"] . ";
                var nom_ape_us = '" . $_SESSION["NOM_APE"] . "';                
                ";
?>
        </script>        

        <script type="text/javascript" src="js/requerid/stores.js"></script>
        <script type="text/javascript" src="js/requerid/functions.js"></script>                        

        <script type="text/javascript" src="js/roles/kradac.js"></script>
        <script type="text/javascript" src="js/mapa_1.js"></script>
        <!--<script type="text/javascript" src="js/mapaGoogle.js"></script>-->

        <!--<script type="text/javascript" src="js/core/cargarCapas.js"></script>-->
<!--        <script type="text/javascript" src="js/core/trazarRuta.js"></script>
        <script type="text/javascript" src="js/core/limpiarCapas.js"></script>
        <script type="text/javascript" src="js/core/lienzoCapas.js"></script>-->
        <script type="text/javascript" src="js/core/obtenerPos.js"></script>

        <script type="text/javascript" src="js/gui/ventanaEditarPuntos.js"></script>

        <script type="text/javascript" src="js/gui/estadisticas/ventanaGraficasOcupados.js"></script>
        <script type="text/javascript" src="js/gui/estadisticas/ventanaGraficasDiario.js"></script>

        <script type="text/javascript" src="js/administracion/ventanaPersonas.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaUsuarios.js"></script>
        <script type="text/javascript" src="js/administracion/parqueaderoSimert/ventanaSanciones.js"></script>
        <script type="text/javascript" src="js/administracion/parqueaderoSimert/ventanaSitios.js"></script>
        <script type="text/javascript" src="js/administracion/parqueaderoSimert/ventanazona.js"></script>
        <script type="text/javascript" src="js/administracion/parqueaderoSimert/ventanaParqueaderos.js"></script>

        <script type="text/javascript" src="js/extra/ventanaDireccion.js"></script>

    </head>
    <body oncontextmenu = "return false">        
        <header></header>
        <nav></nav>
        <section id = 'icono'>
            <a href='http://www.kradac.com'>
                <img alt="www.kradac.com"  src='img/credits.png'/>
            </a>
        </section>        
        <footer>            
        </footer>
    </body>
</html>