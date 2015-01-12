/*
 * Permite desplegar la venta para buscar las paradas de los buses de la UTPL
 * segun la ruta que se elija.
 */

var contLocParadas;
var winLocParadaHorSec;
var radioTipo = 'B';
var hora = '6:30';
var phpComboRutasHora = "core/php/gui/comboRutasHora.php";
var urlRutas = phpComboRutasHora+"?op="+radioTipo+"&hora="+hora;
var spin;
var id_ruta=0;
var op='';

Ext.onReady(function(){

    spin = new Ext.ux.form.Spinner({
        fieldLabel: 'Hora de Recorrido',
        name: 'hora',
        value: '06:30',
        strategy: new Ext.ux.form.Spinner.TimeStrategy({
            minValue:'06:30',
            maxValue:'21:00',
            incrementValue: 30
        }),
        allowBlank:false,
        emptyText:'Hora de recorrido...',
        anchor:'98%',
        listeners: {
            'spinUp': {
                fn:function(){
                    recargarComboRutasParadas();
                }
            },
            'spinDown': {
                fn:function(){
                    recargarComboRutasParadas();
                }
            },
            'spin':{
                fn:function(){
                    recargarComboRutasParadas();
                }
            }
        }
    });
    
    contLocParadas = new Ext.FormPanel({
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        width: 500,

        items: [{
            columnWidth:1,
            layout: 'form',
            labelWidth:105,
            items: [
            spin
            ]
        },{
            columnWidth:1,
            layout: 'form',
            labelAlign: 'top',
            labelWidth:60,
            items: [{
                xtype: 'radiogroup',
                fieldLabel: 'Tipo de recorrido',
                items: [
                {
                    boxLabel: 'Baja de la UTPL',
                    name: 'rbTipo',
                    inputValue: 'B',
                    listeners: {
                        check: function (ctl, val) {
                            recargarComboRutasParadas();
                        }
                    }
                },{
                    boxLabel: 'Sube a la UTPL',
                    name: 'rbTipo',
                    inputValue: 'R',
                    listeners: {
                        check: function (ctl, val) {
                            recargarComboRutasParadas();
                        }
                    }
                },{
                    boxLabel: 'Sube y baja de la UTPL',
                    name: 'rbTipo',
                    inputValue: 'BR',
                    listeners: {
                        check: function (ctl, val) {
                            recargarComboRutasParadas();
                        }
                    }
                }
                ]
            }
            ]
        },{
            layout:'column',
            items:[{
                columnWidth:1,
                layout: 'form',
                labelWidth: 60,
                labelAlign: 'top',
                items: [
                comboRutas
                ]
            }]
        }
        ],

        buttons: [{
            text: 'Graficar Paradas',
            handler: function() {
                contLocParadas.getForm().submit({
                    url : 'core/php/core/RQ2_TrazadoRutas.php',
                    method:'POST',
                    waitMsg : 'Comprobando Datos...',
                    params:{
                        id_ruta: id_ruta,
                        tipo: op
                    },
                    failure: function (form, action) {
                        Ext.MessageBox.show({
                            title: 'Error...',
                            msg: 'Ups... Datos no encontrados',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    },
                    success: function (form, action) {
                        var resultado = Ext.util.JSON.decode(action.response.responseText);

                        limpiarCapas();

                        //dibujar la ruta en el mapa
                        dibujarTrazado(resultado.datos.coordenadas);

                        // Dibujar las paradas en el mapa
                        buscarParadas(id_ruta, op);

                        //Limpia los datos del formulario y lo oculta
                        limpiar_datos_paradas();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: limpiar_datos_paradas
        }]
    });
});

/**
 * Obtiene la hora del spinner de las horas
 */
function getHora(){
    hora = spin.getValue();
    return hora;
}

/**
 * Permite controlar que no se haga una doble llamada al cambiar de opcion
 * al escojer una ruta
 */
var i=0;

/**
* Recarga el combo de rutas para la ventana de Localizar Paradas
*/
function recargarComboRutasParadas(){
    comboRutas.reset();
    var radioTipo =  contLocParadas.getForm().getValues()['rbTipo'];
    urlRutas = phpComboRutasHora +"?op="+ radioTipo+"&hora="+getHora();
    op = radioTipo;
    if(i==0){
        storeRutas.proxy.conn.url = urlRutas;
        storeRutas.load();
        i++;
    }else{
        i=0;
    }
}

/* oculta la venta y limpia los datos no guardados */
function limpiar_datos_paradas(){
    contLocParadas.getForm().reset();
    winLocParadaHorSec.hide();
}

/**
* Obtine el id y el nombre de las rutas
*/
var storeRutas = new Ext.data.JsonStore({
    autoDestroy: true,
    url: urlRutas,
    method:'POST',
    root: 'rutas',
    fields: ['id', 'name'],
    failure: function (form, action) {
        Ext.MessageBox.show({
            title: 'Error...',
            msg: 'No a ingresado correctamente vuelva a ingresar al sistema...',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
});

/**
 * permite ponerle una plantilla en la presentación del combo de rutas
 * las clases de la hoja de estilos es "css/style.css"
 */
var resultadoTplRutas = new Ext.XTemplate(
    '<tpl for="."><div class="search-item">',
    '{name}',
    '</div></tpl>'
    );

/**
* Carga el combo con las rutas
*/
var comboRutas = new Ext.form.ComboBox({
    store: storeRutas,
    fieldLabel: 'Rutas',
    hiddenName: 'idRutas',
    valueField: 'id',
    displayField: 'name',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    tpl: resultadoTplRutas,
    itemSelector: 'div.search-item',
    emptyText:'Seleccionar ruta...',
    allowBlank:false,
    resizable:true,
    minListWidth:300,
    selectOnFocus:true,
    width: 455,
    listeners:{
        'select': seleccionarRuta
    }
});

function seleccionarRuta(){
    id_ruta = comboRutas.getValue();
}

/**
* Muestra la ventana para buscar una ruta
* @return NO retorna valor
*/
function ventanaLocalizarParadaHora(){
    if(!winLocParadaHorSec){
        winLocParadaHorSec = new Ext.Window({
            layout:'fit',
            title:'Buscar paradas por hora y sector',
            resizable : false,
            width:500,
            height:205,
            closeAction:'hide',
            plain: false,
            items: [contLocParadas]
        });
    }
    winLocParadaHorSec.show(this);
}
