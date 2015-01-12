<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title>K-Parking</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="img/k.png" type="image/x-icon">
        <link href="bootstrap/bootstrap.css" rel="stylesheet">
        <link href="bootstrap/bootstrap-responsive.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="css/css_index.css">
        <script type="text/javascript" src="js/requerid/functions.js"></script>
    </head>
    <body>
        <nav>            
            <ul class="breadcrumb">
              <li><a href="http://www.kradac.com">Informacion</a> <span class="divider">/</span></li>
              <li><a href="#">Contactos</a> <span class="divider">/</span></li>
              <li class="active">Data</li>
            </ul>           
        </nav>

        <header>
            <img src="img/k-parking.png" alt="logo_kradac">
        </header>
        
        <section>            
            <form class="form-horizontal" action = "php/login/login.php" method = "post">
              <div class="control-group">
                <label class="control-label" for="inputEmail"><strong>Usuario</strong></label>
                <div class="controls">
                  <input name = "us" type="text" placeholder="Usuario", onclick="getLocationUser()">
                </div>
              </div>

              <div class="control-group">
                <label class="control-label" for="inputPassword"><strong>Contraseña</strong></label>
                <div class="controls">
                  <input name = "ps" type="password" id="inputPassword" placeholder="Contraseña">
                </div>
              </div>

              <div class="geolocalizacion">                
                  <input name = "latitud" type="text" id="latitud">
                  <input name = "longitud" type="text" id="longitud">
              </div>

              <div class="control-group">
                <div class="controls">                  
                  <button class = "btn btn-primary" type="submit" class="btn">Ingresar</button>
                </div>
              </div>
            </form>          
        </section>

        <footer>
          
        </footer>
    </body>
</html>