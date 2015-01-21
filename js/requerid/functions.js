/*Funciones para guardar Geolocalizacion de Usuario*/
function getLocationUser() {
    if (navigator.geolocation) {
        var position = navigator.geolocation.getCurrentPosition(showPositionUser, showError);
    } else {
        //x.innerHTML="Geolocation is not supported by this browser.";
        Ext.example.msg('Error', 'Geolocalizacion no es soportada por este navegador.');
    }
}

function showPositionUser(position) {    
    lonPos = position.coords.longitude;
    latPos = position.coords.latitude;

    document.getElementById("longitud").value = lonPos;
    document.getElementById("latitud").value = latPos;
}

/*Funciones para realizar Geolocalización*/
function getLocation() {
    if (navigator.geolocation) {
        var position = navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        //x.innerHTML="Geolocation is not supported by this browser.";
        Ext.example.msg('Error', 'Geolocalizacion no es soportada por este navegador.');
    }
}

function showPosition(position) {
    //x.innerHTML="Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;     
    searchDirection(position.coords.longitude, position.coords.latitude, 17);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            //x.innerHTML="User denied the request for Geolocation."
            Ext.example.msg('Error', 'User denied the request for Geolocation.');
        break;
        case error.POSITION_UNAVAILABLE:
            //x.innerHTML="Location information is unavailable."
            Ext.example.msg('Error', 'Location information is unavailable.');
        break;
        case error.TIMEOUT:
            //x.innerHTML="The request to get user location timed out."
            Ext.example.msg('Error', 'The request to get user location timed out.');
        break;
        case error.UNKNOWN_ERROR:
            //x.innerHTML="An unknown error occurred."
            Ext.example.msg('Error', 'An unknown error occurred.');
        break;
    }
}

function checkVideo() {
    if(!!document.createElement('video').canPlayType) {
        var vidTest = document.createElement("video");
        oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');

        if (!oggTest) {
            h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

            if (!h264Test) {
                document.getElementById("checkVideoResult").innerHTML="Sorry. No video support."
            } else {
                if (h264Test=="probably") {
                    document.getElementById("checkVideoResult").innerHTML="Yeah! Full support!";
                } else {
                    document.getElementById("checkVideoResult").innerHTML="Meh. Some support.";
                }
            }
        } else {
            if (oggTest=="probably") {
                document.getElementById("checkVideoResult").innerHTML="Yeah! Full support!";
            } else {
                document.getElementById("checkVideoResult").innerHTML="Meh. Some support.";
            }
        }
    } else {
        document.getElementById("checkVideoResult").innerHTML="Sorry. No video support."
    }
}

//Obtener Resolucion de Panatalla del Equipo
function getResolution(){
    var height=0; var width=0;
    if (self.screen) {     // for NN4 and IE4
        width = screen.width;
        height = screen.height
    } else if (self.java) {   // for NN3 with enabled Java
        var jkit = java.awt.Toolkit.getDefaultToolkit();
        var scrsize = jkit.getScreenSize();
        width = scrsize.width;
        height = scrsize.height; 
    }
    var whRes = new Array();
    whRes.push(width);
    whRes.push(height);
    return whRes;
}

/**
 * Convierte en json lo que este almacenado en un store
 */
function getJsonOfStore(store){    
    var datar = new Array();
    var jsonDataEncode = "";
    //var records = store.getRange();
    var records = store.getModifiedRecords();
    //console.info(records);
    for (var i = 0; i < records.length; i++) {
        datar.push(records[i].data);
    }    
    jsonDataEncode = Ext.JSON.encode(datar);

    return jsonDataEncode;
}

function formatoFecha(date){
    var año = date.getFullYear();
    var mes = date.getMonth()+1;
    if (mes < 10) {
        mes = "0"+mes;
    }
    var dia = date.getDate();
    if (dia < 10) {
        dia = "0"+dia;
    }
    return año+'-'+mes+'-'+dia;
}

function formatoHora(time){
    var hora = time.getHours();
    if (hora < 10) {
        hora = "0"+hora;
    }
    var minuto = time.getMinutes();
    if (minuto < 10) {
        minuto = "0"+minuto;
    }
    var segundo = time.getSeconds();
    if (segundo < 10) {
        segundo = "0"+segundo;
    }
    return hora+':'+minuto+':'+segundo;
}

function check_cedula(b){
    var h = b.split("");
    var c = h.length;
    if (c == 10) {
        var f = 0;
        var a = (h[9]*1);
        for(i = 0; i <(c-1); i++){
            var g = 0;
            if ((i%2)!=0){
                f = f+(h[i]*1)
            } else {
                g = h[i]*2;
                if(g>9){
                    f = f+(g-9)
                }else{
                    f = f+g
                }
            }
        }
        var e = f/10;
        e = Math.floor(e);
        e = (e+1)*10;
        var d = (e-f);
        if((d==10&&a==0)||(d==a)){
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function connectionMap() {
    if (typeof OpenLayers !== 'undefined') {
        return true;
    } else {
        Ext.example.msg('Mensaje', 'El mapa se encuentra deshabilitado.');
        return false;
    }
}