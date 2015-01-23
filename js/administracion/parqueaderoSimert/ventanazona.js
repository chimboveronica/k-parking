
var winAddZona;
var contenedorZona
var formRecordsZona;
var gridRecordsZona;
var vertPolygonos = "";
var trazar = 0;
var gridStoreGeocercas;
var drawRoute = true;
var geometria;
var id_empresageos = 0;
var areaEdit;
var coordenadasEdit = '';
Ext.onReady(function () {
    Ext.define('DataObjectZona', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idZona'},
            {name: 'nombre'},
            {name: 'horario'},
            {name: 'color'},
            {name: 'descripcion'},
            {name: 'area'},
            {name: 'coordenadas'},
            {name: 'tiempo', type: 'date', dateFormat: 'H:i:s'},
            {name: 'tiempoFraccion', type: 'date', dateFormat: 'H:i:s'},
        ]
    });
    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataObjectZona',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/zona/read.php',
                create: 'php/administracion/zona/create.php',
                update: 'php/administracion/zona/update.php',
                destroy: 'php/administracion/zona/destroy.php'
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
                        formRecordsZona.getForm().reset();
                    }
                }
            }
        }
    });
    var columns = [
        {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
        {header: "Zona", width: 100, sortable: true, dataIndex: 'nombre', filter: {type: 'string'}},
        {header: "Horario", width: 200, sortable: true, dataIndex: 'horario', filter: {type: 'string'}},
        {header: "Costo", width: 100, sortable: true, dataIndex: 'costo', filter: {type: 'list', store: storeRolUserList}},
        {header: "Descripción", width: 100, sortable: true, dataIndex: 'descripcion', filter: {type: 'string'}},
    ];
    gridRecordsZona = Ext.create('Ext.grid.Panel', {
        width: '45%',
        margins: '0 2 0 0',
        region: 'west',
        store: gridStore,
        columns: columns,
        stripeRows: true,
        height: 380,
        features: [filters],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (selected.length > 0) {
                    setActiveRecordZona(selected[0]);
                    var record = selected[0];
                    lines.destroyFeatures();
                    drawRoute = false;
                    cargaZonas();
                    drawPoligonoGeocerca(record.data.coordenadas);
                    formRecordsZona.down('#saveZona').enable();
                    formRecordsZona.down('#createZona').disable();
                    formRecordsZona.down('#deleteZona').enable();
                }
            }
        }
    });

    var formPanelGrid = Ext.create('Ext.form.Panel', {
        width: '45%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        items: [gridRecordsZona]
    });


    formRecordsZona = Ext.create('Ext.form.Panel', {
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
                title: 'Datos de la zona',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                        fieldLabel: 'Zona',
                        afterLabelTextTpl: required,
                        name: 'nombre',
                        allowBlank: false,
                        emptyText: 'Ingresar Zona...',
                    }, {
                        fieldLabel: 'Horario',
                        afterLabelTextTpl: required,
                        name: 'horario',
                        allowBlank: false,
                        emptyText: 'Ingresar Horario...',
                    },
                    {
                        xtype: 'timefield',
                        name: 'tiempo',
                        fieldLabel: 'Tiempo máximo',
                        blankText: 'Este campo es obligatorio',
                        format: 'H:i:s',
                        value: '00:00:00',
                        minValue: '00:00:00',
                        maxValue: '1:59:00',
                        emptyText: '00:15:00',
                        invalidText: 'El formato de la hora no es válido',
                        increment: 15},
                    {
                        xtype: 'timefield',
                        name: 'tiempoFraccion',
                        fieldLabel: 'Tiempo de fracción',
                        blankText: 'Este campo es obligatorio',
                        format: 'H:i:s',
                        minValue: '00:00:00',
                        maxValue: '00:59:00',
                        emptyText: '00:00:00',
                        invalidText: 'El formato de la hora no es válido',
                        increment: 15},
                    {
                        fieldLabel: 'Zona',
                        name: 'coordenadas',
                        id: 'coordenadas',
//                        hidden: true

                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: 'Descripción',
                        name: 'descripcion',
                        height: 100,
                        emptyText: 'Ingresar Descripción...'
                    },
                    {
                        fieldLabel: 'Color de Zona',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'color',
                        allowBlank: false,
                        inputType: 'color',
                        anchor: '55%'
                    },
                    {
                        xtype: 'panel',
                        layout: 'hbox',
                        baseCls: 'x-plain',
                        defaults: {
                            margin: '0 5 20 0'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                afterLabelTextTpl: required,
                                id: 'numberfield-point-route',
                                name: 'area',
                                fieldLabel: '<b>Area<b>',
                                editable: false,
                                allowBlank: false,
                                emptyText: 'Area de la Geocerca...',
                            }
                            , {
                                id: 'btn-draw-edit-route',
                                iconCls: 'icon-add',
                                xtype: 'button',
                                value: 0,
                                handler: function () {
                                    if (drawRoute === true) {
                                        drawLine.activate();
                                        geosArea = true;
                                        geosVertice = true;
                                    } else {
                                        geosArea = true;
                                        geosVertice = true;
                                        modifyLine.activate();
                                        modifyLine.activate();
                                        Ext.create('Ext.menu.Menu', {
                                            width: 100,
                                            floating: true,
                                            renderTo: 'map',
                                            items: [{
                                                    iconCls: 'icon-valid',
                                                    text: 'Terminar',
                                                    handler: function () {
                                                        geometria = lines.features[0].geometry;
                                                        console.log(geometria + 'geometria');
                                                        var area = geometria.getArea() / 1000;
                                                        area = Math.round(area * 100) / 100;
                                                        console.log(area);
                                                        Ext.getCmp('numberfield-point-route').setValue(area);
                                                        modifyLine.deactivate();
                                                        winAddZona.show();
                                                        drawRoute = true;
                                                    }
                                                }]
                                        }).show();
                                        geosVertice = true;
                                    }
                                    winAddZona.hide();
                                }
                            }, {
                                id: 'btn-delete-route',
                                iconCls: 'icon-delete',
                                xtype: 'button',
                                disabled: true,
                                handler: function () {
                                    lines.destroyFeatures();
                                    Ext.getCmp('numberfield-point-route').reset();
                                    Ext.getCmp('btn-delete-route').disable();
                                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-add");
                                    drawRoute = true;
                                }
                            }]
                    },
                ]
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
                        itemId: 'saveZona',
                        text: 'Actualizar',
                        disabled: true,
                        scope: this,
                        tooltip: 'Actualizar Datos',
                        handler: onSaveZona
                    }, {
                        iconCls: 'icon-user-add',
                        text: 'Crear',
                        itemId: 'createZona',
                        scope: this,
                        tooltip: 'Crear Zona',
                        handler: onCreateZona
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'deleteZona',
                        scope: this,
                        tooltip: 'Eliminar Zona',
                        handler: onDeleteClickZona
                    }, {
                        iconCls: 'icon-reset',
                        text: 'Limpiar',
                        scope: this,
                        tooltip: 'Limpiar Campos',
                        handler: onResetZona
                    }, {
                        iconCls: 'icon-cancelar',
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        scope: this,
                        handler: clearWinZona
                    }]
            }]
    });

    contenedorZona = Ext.create('Ext.form.Panel', {
        layout: 'border',
        bodyPadding: 5,
        items: [
            formPanelGrid,
            formRecordsZona
        ]
    });

});

function ventAddZona() {
    if (!winAddZona) {
        winAddZona =
                Ext.create('Ext.window.Window', {
                    layout: 'fit',
                    title: 'Administración de Zonas',
                    iconCls: 'icon-person',
                    resizable: false,
                    width: 795,
                    height: 550,
                    closeAction: 'hide',
                    plain: false,
                    items: [{
                            layout: 'border',
                            bodyPadding: 5,
                            items: [
                                gridRecordsZona,
                                formRecordsZona
                            ]
                        }]
                });

    }
    contenedorZona.getForm().reset();
    winAddZona.show();


}

function setActiveRecordZona(record) {
    formRecordsZona.activeRecord = record;
    if (record) {
        formRecordsZona.down('#saveZona').enable();
        formRecordsZona.getForm().loadRecord(record);
    } else {
        formRecordsZona.down('#saveZona').disable();
        formRecordsZona.getForm().reset();
    }
}

function onSaveZona() {
    var active = formRecordsZona.activeRecord,
            form = formRecordsZona.getForm();

    if (!active) {
        return;
    }
    form.updateRecord(active);
    onResetZona;
}

function onCreateZona() {
    var form = formRecordsZona.getForm();

    if (form.isValid()) {
        formRecordsZona.fireEvent('create', formRecordsZona, form.getValues());
        formRecordsZona.down('#saveZona').disable();
        form.reset();
    }
}

function onResetZona() {
    setActiveRecordZona(null);
    formRecordsZona.down('#deleteZona').disable();
    formRecordsZona.getForm().reset();
}

function clearWinZona() {
    onResetZona();
    winAddZona.hide();
}

function onDeleteClickZona() {
    var selection = gridRecordsZona.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecordsZona.store.remove(selection);
        formRecordsZona.down('#deleteZona').disable();
    }
}
