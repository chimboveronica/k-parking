var RQ3Panel;
var RQ3Win;
var validMeters;

Ext.apply(Ext.form.VTypes, {
    validador: function(value, field)
    {
        if (value>1000) {
            validMeters = false;
        }else{
            validMeters = true;
        }
        return validMeters;
    },
    validadorText: 'Valor demaciado alto'
});


Ext.onReady(function(){

    var etiqueta = new Ext.form.Label({
        html : 'metros',
        width:30
    });

    var RQ3_meters = new Ext.ux.form.Spinner({
        id: 'meters',
        value: 100,
        width:60,
        labelSeparator: '', // Elimina los dos puntos delante de la etiqueta
        strategy: new Ext.ux.form.Spinner.NumberStrategy({
            minValue:100,
            maxValue:1000,
            incrementValue:100
        }),
        vtype:'validador'
    });

    RQ3Panel = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        bodyStyle:'padding:1px 0px 0 60px',  //bodyStyle:'padding:5px 5px 0 ',
        labelWidth:150,
        items: [
        RQ3_meters,
        etiqueta
        ],
        buttonAlign: 'center',
        buttons: [{
            text: 'Localizar',
            handler: function() {

                var cantMeters = RQ3_meters.getValue();

                if (validMeters) {

                    limpiarCapas();

                    RQ3Panel.getForm().submit({
                        url : 'core/php/core/RQ3_paradas_cercanas.php?x='+xpos+'&y='+ypos,
                        method:'POST',
                        waitMsg : 'Buscando...',
                        failure: function (form, action) {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Ups... Datos no encontrados',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success: function (form, action) {

                            var resultado = Ext.util.JSON.decode(action.response.responseText);
                            var datos = resultado.datos.coordenadas;
                            lienzosRecorridoHistorico(datos);
                            RQ3_limpiar_win();
                            dibujarPerimetro(cantMeters);
                        }
                    });
                }else {
                    Ext.MessageBox.show({
                        title: 'Revise la distancia',
                        msg: 'El valor máximo permitido <br /> es 1000 metros',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        },{
            text: 'Cancelar',
            handler: RQ3_limpiar_win
        }]
    });
});

/**
* Oculta la venta y limpia
* los datos no guardados
**/
function RQ3_limpiar_win(){
    RQ3Panel.getForm().reset();
    RQ3Win.hide();
}

function RQ3_getWin(){
    if(!RQ3Win){
        RQ3Win = new Ext.Window({
            layout:'fit',
            title:'Parada mas Cercana',
            resizable : true,
            width:195,
            height:155,
            closeAction:'hide',
            plain: false,
            items: [RQ3Panel]
        });
    }
    RQ3Win.show(this);
}

/**
 * Capturar punto de referencia
 * para realizar calculo
 */
function capturarPuntoReferencia() {
    Ext.MessageBox.show({
        title: 'Ubicacion',
        msg: 'Presiona OK y Selecciona <br />un punto en el mapa ',
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.INFO
    });
    capturarPosicion = true;
}

