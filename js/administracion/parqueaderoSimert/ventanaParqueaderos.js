var winAdminParkings;
var formRecordsParkingS;
var gridAdminParkings;
var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
Ext.onReady(function () {
    Ext.define('DataObjectParkingS', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idParqueadero'},
            {name: 'parqueadero'},
            {name: 'direccion'},
            {name: 'plazas'},
            {name: 'latitudS'},
            {name: 'longitudS'},
            {name: 'imagen'},
            {name: 'coordenadas'},
            {name: 'valor'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataObjectParkingS',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/parqueadero/read.php',
                create: 'php/administracion/parqueadero/create.php',
                update: 'php/administracion/parqueadero/update.php',
                destroy: 'php/administracion/parqueadero/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'data',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function (store, operation, eOpts) {
                                gridStore.reload();

                Ext.example.msg("Mensaje", operation.getResultSet().message);
                onResetParking();

            }
        }
    });

    gridAdminParkings = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
            {header: "Parqueadero", width: 100, sortable: true, dataIndex: 'parqueadero', filter: {type: 'string'}},
            {header: "Dirección", width: 200, sortable: true, dataIndex: 'direccion', filter: {type: 'string'}},
            {header: "Plazas", width: 100, sortable: true, dataIndex: 'plazas'},
        ],
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (selected.length > 0) {
                    setActiveRecordParkings(selected[0]);
                    var record = selected[0];
                    formRecordsParkingS.down('#update').enable();
                    formRecordsParkingS.down('#delete').enable();
                    formRecordsParkingS.down('#create').disable();

                }
            }
        }
    });

    formRecordsParkingS = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos del Parqueadero',
        activeRecord: null,
        bodyPadding: '10 10 10 10',
        margin: '0 0 0 3',
        autoScroll: true,
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: 'Datos del Parqueadero',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        fieldLabel: 'Parqueadero',
                        afterLabelTextTpl: required,
                        name: 'parqueadero',
                        allowBlank: false,
                        emptyText: 'Ingresar Parqueadero...',
                    },
                    {
                        fieldLabel: 'Dirección',
                        afterLabelTextTpl: required,
                        name: 'direccion',
                        allowBlank: false,
                        emptyText: 'Ingresar Dirección...',
                    },
                   
                    {
                        xtype: 'numberfield',
                        afterLabelTextTpl: required,
                        name: 'plazas',
                        fieldLabel: 'Plazas',
                        editable: false,
                        allowBlank: false,
                        emptyText: 'Numero de Plazas...',
                        maxValue: 20,
                        minValue: 6
                    },
                    {
                        xtype: 'numberfield',
                        afterLabelTextTpl: required,
                        name: 'valor',
                        fieldLabel: 'Valor',
                        editable: false,
                        allowBlank: false,
                        emptyText: 'Numero de Plazas...',
                        maxValue: 20,
                        minValue: 0.20
                    }
                    ,
                    {
                        name: 'latitudS',
                        id: 'latitudS',
                        fieldLabel: 'Latitud:',
                        emptyText: 'Latitud..',
                        allowBlank: false
                    }, {
                        name: 'longitudS',
                        id: 'longitudS',
                        fieldLabel: 'Longitud:',
                        emptyText: 'Longitud..',
                        allowBlank: false
                    },
                ]
            }], buttons: [{
                text: 'Ubicar',
                iconCls: 'icon-obtener-coord',
                handler: function () {
                    obtenerParqueadero = true;
                    winAdminParkings.hide();
                }
            }],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-save',
                        itemId: 'update',
                        text: 'Actualizar',
                        disabled: true,
                        scope: this,
                        tooltip: 'Actualizar Datos',
                        handler:onUpdateParking
                    }, {
                        iconCls: 'icon-user-add',
                        text: 'Crear',
                        itemId: 'create',
                        scope: this,
                        tooltip: 'Crear Zona',
                        handler: onCreateParking
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        scope: this,
                        tooltip: 'Eliminar Parqueadero',
                        handler: onDeleteParking
                    }, {
                        iconCls: 'icon-reset',
                        text: 'Limpiar',
                        scope: this,
                        tooltip: 'Limpiar Campos',
                        handler: onResetParking
                    }, {
                        iconCls: 'icon-cancelar',
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        scope: this,
                        handler: clearWinParking
                    }]
            }]
    });
});
function showWinAdminParking() {
    if (!winAdminParkings) {
        winAdminParkings = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Parqueaderos Privados',
            iconCls: 'icon-parqueo',
            resizable: false,
            width: 785,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminParkings,
                        formRecordsParkingS
                    ]
                }]
        });
    }
    onResetParking();
    winAdminParkings.show();
}

function setActiveRecordParkings(record) {
    formRecordsParkingS.activeRecord = record;
    formRecordsParkingS.down('#update').enable();
    formRecordsParkingS.down('#create').disable();
    formRecordsParkingS.getForm().loadRecord(record);
}

function onUpdateParking() {
    var active = formRecordsParkingS.activeRecord,
   form = formRecordsParkingS.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateParking() {
    var form = formRecordsParkingS.getForm();
    if (form.isValid()) {
        formRecordsParkingS.fireEvent('create', formRecordsParkingS, form.getValues());
        formRecordsParkingS.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetParking() {
    formRecordsParkingS.getForm().reset();
    formRecordsParkingS.down('#delete').disable();
    formRecordsParkingS.down('#create').enable();
    formRecordsParkingS.down('#update').disable();
    gridAdminParkings.getView().deselect(gridAdminParkings.getSelection());
}
function clearWinParking() {
    onResetParking();
    winAdminParkings.hide();
}
function onDeleteParking() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar este Parqueadero', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminParkings.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminParkings.store.remove(selection);
                formRecordsParkingS.down('#delete').disable();
                formRecordsParkingS.down('#create').enable();
            }
        }
    });
}