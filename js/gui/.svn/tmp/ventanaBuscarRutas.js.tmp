/* 
 * Permite desplegar la venta para buscar la ruta de los buses de la UTPL
 */

var contBuscarRutas;
var winBuscarRutas;
var radioTipo = 'B';
var phpComboRutas = "core/php/gui/comboRutas.php";
var urlBuscarRutas = phpComboRutas+"?op="+radioTipo;

Ext.onReady(function(){

    contBuscarRutas = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        labelWidth:60,
        width: 500,

        items: [{
            columnWidth:1,
            layout: 'form',
            items: [{
                xtype: 'radiogroup',
                fieldLabel: 'Tipo de recorrido',
                items: [
                {
                    boxLabel: 'Baja de la UTPL',
                    name: 'rbTipo',
                    inputValue: 'B',
                    //checked: true,
                    listeners: {
                        check: function (ctl, val) {
                            recargarComboRutas();
                        }
                    }
                },{
                    boxLabel: 'Sube a la UTPL',
                    name: 'rbTipo',
                    inputValue: 'R',
                    listeners: {
                        check: function (ctl, val) {
                            recargarComboRutas();
                        }
                    }
                },{
                    boxLabel: 'Sube y baja de la UTPL',
                    name: 'rbTipo',
                    inputValue: 'BR',
                    listeners: {
                        check: function (ctl, val) {
                            recargarComboRutas();
                        }
                    }
                }
                ]
            }
            ]
        },{
            layout: 'form',
            items: [
            cbxBuscarRutas
            ]
        }
        ],

        buttons: [{
            text: 'Graficar Ruta',
            handler: function() {
                contBuscarRutas.getForm().submit({
                    url : 'core/php/core/RQ2_TrazadoRutas.php',
                    method:'POST',
                    waitMsg : 'Comprobando Datos...',
                    params:{
                        id_ruta: id_ruta,
                        tipo: radioTipo
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

                        //Limpia las capas antes de hacer una nueva consulta
                        limpiarCapas();

                        //dibujar la ruta en el mapa
                        dibujarTrazado(resultado.datos.coordenadas);

                        //dibujar las paradas en esa ruta
                        buscarParadas(id_ruta,radioTipo);

                        //Limpia los datos del formulario y lo oculta
                        limpiar_datos_rutas();
                    }
                });
            }
        },{
            text: 'Cancelar',
            handler: limpiar_datos_rutas
        }]
    });
});

function buscarParadas(id_ruta,radioTipo){
    /**
     * Peticion de las paradas segun una ruta seleccionada
     */    
    Ext.Ajax.request({
        url: 'core/php/core/RQ4_ParadasRuta.php',
        method: 'POST',
        success: function (result) {
            var r = Ext.util.JSON.decode(result.responseText);
            if(typeof r.datos != "undefined"){
                /**
                * Dibuja las paradas en el mapa
                */
                lienzosRecorridoHistorico(r.datos.coordenadas);
            }
        },
        timeout: 1000,
        params: {
            id_ruta: id_ruta,
            tipo: radioTipo
        }
    });
}

/**
* Permite recargar el combo de nombres de rutas con nueva informacion
* segun los parametros que se le envie en la url a traves de GET
*/
function recargarComboRutas(){
    cbxBuscarRutas.reset();
    radioTipo =  contBuscarRutas.getForm().getValues()['rbTipo'];

    if(typeof radioTipo!="undefined"){
        urlBuscarRutas = phpComboRutas +"?op="+ radioTipo;
        storeBuscarRutas.proxy.conn.url = urlBuscarRutas;
        storeBuscarRutas.load();
    }
}

/* oculta la venta y limpia los datos no guardados */
function limpiar_datos_rutas(){
    contBuscarRutas.getForm().reset();
    winBuscarRutas.hide();
}

/**
 * Obtine el id y el nombre de las rutas de la BD
 */
var storeBuscarRutas = new Ext.data.JsonStore({
    autoDestroy: true,
    url: urlBuscarRutas,
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
    //'<h3><span>{id}</span></h3>',
    '{name}',
    '</div></tpl>'
    );

/**
 * Carga el combo con las rutas
 */
var cbxBuscarRutas = new Ext.form.ComboBox({
    store: storeBuscarRutas,
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
    id_ruta = cbxBuscarRutas.getValue();
}

/**
 * Muestra la ventana para buscar una ruta
 * @return NO retorna valor
 */
function ventanaBuscarRutas(){
    if(!winBuscarRutas){
        winBuscarRutas = new Ext.Window({
            layout:'fit',
            title:'Buscar Ruta',
            resizable : false,
            width:500,
            height:180,
            closeAction:'hide',
            plain: false,
            items: [contBuscarRutas]
        });
    }
    winBuscarRutas.show(this);
}
