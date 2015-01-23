<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title>K-Parking</title>
        <link rel="shortcut icon" href="img/k.png" type="image/x-icon">
        <!--Vuelve a la visualizacion del viewport adaptable al tamaño del dispositivo--> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <!--<meta name="apple-mobile-web-app-capable" content="yes">-->
        <link rel="shortcut icon" href="img/k.png" type="image/x-icon">
                  <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/options-toolbar.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/include-ext.js"></script>

        <!--<link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/packages/ext-theme-gray/build/resources/ext-theme-gray-all.css">-->
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/css/ItemSelector.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">

        <link rel="stylesheet" type="text/css" href="openLayers/theme/default/style.css">
        <link rel="stylesheet" type="text/css" href="openLayers/theme/default/google.css">
        <link rel="stylesheet" type="text/css" href="css/principal.css">

        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/ext-all.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/examples.js"></script>
        
        <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
        <script src="openLayers/OpenLayers.js"></script>

        <script type="text/javascript">
            <?php            
            echo "                
                var id_rol = 3;                
                ";
            ?>
        </script>        

        <script type="text/javascript" src="js/requerid/stores.js"></script>
        <script type="text/javascript" src="js/requerid/functions.js"></script>
        
        <script type="text/javascript" src="js/googleMapa.js"></script>        
        <script type="text/javascript" src="js/roles/usuarios.js"></script>
        <script type="text/javascript" src="js/mapa.js"></script>
        <script type="text/javascript" src="js/mapaGoogle.js"></script>

        <script type="text/javascript" src="js/core/cargarCapas.js"></script>
        <script type="text/javascript" src="js/core/trazarRuta.js"></script>
        <script type="text/javascript" src="js/core/limpiarCapas.js"></script>
        <script type="text/javascript" src="js/core/lienzoCapas.js"></script>
        <script type="text/javascript" src="js/core/obtenerPos.js"></script>
        
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