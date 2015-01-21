/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var winAddParkingS;
var contenedorParkingS
var formRecordsParkingS;
var gridRecordsParkingS;
var vertPolygonos = "";
var trazar = 0;
var gridStoreGeocercas;
var drawRoute = true;
var geometria;
var id_empresageos = 0;
var areaEdit;
var coordenadasEdit = '';
Ext.onReady(function () {
    //Fenera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectParkingS', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idParqueadero'},
            {name: 'idZona'},
            {name: 'id_zona'},
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

    // crea los datos del store
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
                if (operation.success) {
                    Ext.example.msg("Mensaje", operation._resultSet.message);
                    gridStore.reload();
                    if (operation.state) {
                        formRecordsParkingS.getForm().reset();

                    }
                }
            }
        }
    });

    // Column Model shortcut array
    var columns = [
        {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
        {header: "Parqueadero", width: 100, sortable: true, dataIndex: 'parqueadero', filter: {type: 'string'}},
        {header: "Dirección", width: 200, sortable: true, dataIndex: 'direccion', filter: {type: 'string'}},
        {header: "Plazas", width: 100, sortable: true, dataIndex: 'plazas'},
    ];

    // declare the source Grid
    gridRecordsParkingS = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'grid-to-form',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store: gridStore,
        columns: columns,
        enableDragDrop: true,
        stripeRows: true,
        height: 390,
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
        features: [filters],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordParking(selected[0]) ;
                var record = selected[0];
                lines.destroyFeatures();
                drawPoligonoGeocerca(record.data.coordenadas);
                drawRoute = false;
                formRecordsParkingS.down('#saveParqueaderoS').enable();
                formRecordsParkingS.down('#deleteParqueaderoS').enable();
                formRecordsParkingS.down('#createParqueaderoS').disable();

            }
        }
    });

    var formPanelGrid = Ext.create('Ext.form.Panel', {
        width: '45%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        items: [gridRecordsParkingS]
    });


    formRecordsParkingS = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos de la Zona',
        activeRecord: null,
        bodyStyle: 'padding: 10px; background-color: #DFE8F6',
        labelWidth: 100,
        margins: '0 0 0 3',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 75
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
                        xtype: 'combobox',
                        fieldLabel: 'Zona',
                        afterLabelTextTpl: required,
                        name: 'id_zona',
                        store: storeZonas,
                        valueField: 'id_zona',
                        displayField: 'nombre',
                        queryMode: 'local',
                        allowBlank: false,
                        editable: false,
                        emptyText: 'Escoja la Zona...',
                        listConfig: {
                            minWidth: 320
                        }
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
                        fieldLabel: 'Latitud:',
                        emptyText: 'Latitud..',
                        allowBlank: false
                    }, {
                        name: 'longitudS',
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
                    winAddParkingS.hide();
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
                        itemId: 'saveParqueaderoS',
                        text: 'Actualizar',
                        disabled: true,
                        scope: this,
                        tooltip: 'Actualizar Datos',
                        handler: onSaveParqueaderoS
                    }, {
                        iconCls: 'icon-user-add',
                        text: 'Crear',
                        itemId: 'createParqueaderoS',
                        scope: this,
                        tooltip: 'Crear Zona',
                        handler: onCreateParqueaderoS
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'deleteParqueaderoS',
                        scope: this,
                        tooltip: 'Eliminar Parqueadero',
                        handler: onDeleteClickParqueaderoS
                    }, {
                        iconCls: 'icon-reset',
                        text: 'Limpiar',
                        scope: this,
                        tooltip: 'Limpiar Campos',
                        handler: onResetParqueaderoS
                    }, {
                        iconCls: 'icon-cancelar',
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        scope: this,
                        handler: clearWinParqueaderoS
                    }]
            }]
    });

    contenedorParkingS = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 5,
        items: [
            formPanelGrid,
            formRecordsParkingS
        ]
    });
});

function ventAddParkingS() {
    if (!winAddParkingS) {
        winAddParkingS = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Añadir Parqueaderos',
            iconCls: 'icon-user',
            resizable: false,
            width: 780,
            height: 380,
            closeAction: 'hide',
            plain: false,
            items: [contenedorParkingS],
            listeners: {
                close: function (panel, eOpts) {
                    onResetParqueaderoS();
                }
            }
        });
    }
    contenedorParkingS.getForm().reset();
    winAddParkingS.show();


}

function setActiveRecordParking(record) {
    formRecordsParkingS.activeRecord = record;
    if (record) {
        formRecordsParkingS.down('#saveParqueaderoS').enable();
        formRecordsParkingS.getForm().loadRecord(record);
    } else {
        formRecordsParkingS.down('#saveParqueaderoS').disable();
        formRecordsParkingS.getForm().reset();
    }
}

function onSaveParqueaderoS() {
    var active = formRecordsParkingS.activeRecord,
            form = formRecordsParkingS.getForm();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
        onResetParqueaderoS();
    }
}

function onCreateParqueaderoS() {
    var form = formRecordsParkingS.getForm();

    if (form.isValid()) {
        formRecordsParkingS.fireEvent('create', formRecordsParkingS, form.getValues());
        formRecordsParkingS.down('#saveParqueaderoS').disable();
        form.reset();
    }
}   

function onResetParqueaderoS() {
    setActiveRecordParking(null);
    formRecordsParkingS.down('#saveParqueaderoS').disable();
    formRecordsParkingS.down('#deleteParqueaderoS').disable();
    formRecordsParkingS.down('#createParqueaderoS').enable();
    formRecordsParkingS.getForm().reset();
}

function clearWinParqueaderoS() {
    onResetParqueaderoS();
    winAddParkingS.hide();
}

function onDeleteClickParqueaderoS() {
    var selection = gridRecordsParkingS.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecordsParkingS.store.remove(selection);
        formRecordsParkingS.down('#deleteParqueaderoS').disable();
    }
}
