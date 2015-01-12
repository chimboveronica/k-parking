var winParking;
var formParking;

Ext.onReady(function () {

    formParking = Ext.create('Ext.form.Panel', {
        frame: true,
        padding: '5 5 5 5',
        defaultType: 'textfield',
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 100,
            anchor: '100%'
        },
        items: [{
                name: 'parking',
                fieldLabel: 'Parqueadero:',
                emptyText: 'Dirección del Parqueadero...',
                allowBlank: false
            }, {
                xtype: 'numberfield',
                name: 'plazas',
                fieldLabel: 'Plazas:',
                emptyText: 'Numero de Plazas..',
                allowBlank: false,
                maxValue: 20,
                minValue: 6
            }, {
                name: 'latitud',
                fieldLabel: 'Latitud:',
                emptyText: 'Latitud..',
                allowBlank: false
            }, {
                name: 'longitud',
                fieldLabel: 'Longitud:',
                emptyText: 'Longitud..',
                allowBlank: false
            }],
        buttons: [{
                text: 'Ubicar',
                iconCls: 'icon-obtener-coord',
                handler: function () {
                    obtener = true;
                     winParking.hide();
                }
            }, {
                text: 'Guardar',
                iconCls: 'icon-save',
                handler: function () {
                    if (formParking.getForm().isValid()) {
                        formParking.getForm().submit({
                            url: 'php/gui/insertParking.php',
                            failure: function (form, action) {
                                Ext.MessageBox.show({
                                    title: 'Error...',
                                    msg: 'No se Pudo Guardar los Datos...',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            },
                            success: function (form, action) {
                                getDataParking();
                                Ext.example.msg('Mensaje', 'Datos Guardados Correctamente...')
                            }
                        });
                    }
                }
            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancelar',
                handler: clearParking
            }]
    });
});

function clearParking() {
    if (winParking) {
        obtener = false;
        formParking.getForm().reset();
        winParking.hide();
    }
}

function windowParking() {
    if (!winParking) {
        winParking = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Parqueaderos',
            iconCls: 'icon-parqueo',
            resizable: false,
            width: 350,
            height: 350,
            closeAction: 'hide',
            plain: false,
            items: formParking,
            listeners: {
                close: function (panel, eOpts) {
                    clearParking();
                }
            }
        });
    }
    winParking.show();
}