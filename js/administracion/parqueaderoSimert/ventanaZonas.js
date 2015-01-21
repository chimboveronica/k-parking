var winAdminZonas;
var formAdminZonas;
var gridAdminZonas;
var vertPolygonos = "";
var trazar = 0;
var drawRoute;
var geometria;
var id_empresageos = 0;
var areaEdit;
var coordenadasEdit = '';
Ext.onReady(function () {
    Ext.define('DataZona', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idZona'},
            {name: 'nombre'},
            {name: 'horario'},
            {name: 'color'},
            {name: 'tiempo'},
            {name: 'tiempoFraccion'},
            {name: 'descripcion'},
            {name: 'area'},
            {name: 'coordenadas'},
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataZona',
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
                Ext.example.msg("Mensaje", operation.getResultSet().message);
                onResetZonas();

            }
        }
    });

    gridAdminZonas = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
            {header: "Zona", width: 100, sortable: true, dataIndex: 'nombre', filter: {type: 'string'}},
            {header: "Horario", width: 200, sortable: true, dataIndex: 'horario', filter: {type: 'string'}},
            {header: "Costo", width: 100, sortable: true, dataIndex: 'costo', filter: {type: 'list', store: storeRolUserList}},
            {header: "Descripción", width: 100, sortable: true, dataIndex: 'descripcion', filter: {type: 'string'}},
        ],
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordZonas(selected[0]);
                formAdminZonas.getForm().loadRecord(selected[0]);
                var record = selected[0];
                lines.destroyFeatures();
                console.log(record.data.coordenadas);
                drawPoligonoGeocerca(record.data.coordenadas);
                formAdminZonas.down('#update').enable();
                formAdminZonas.down('#create').disable();
                formAdminZonas.down('#delete').enable();

            }
        }
    });

    formAdminZonas = Ext.create('Ext.form.Panel', {
        region: 'center',
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
                checkboxToggle: true,
                title: 'Datos de la zona',
                defaultType: 'textfield',
                collapsed: false,
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
                        fieldLabel: 'Tiempo máximo',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'tiempo',
                        allowBlank: false,
                        format: 'H:i:s',
                        invalidText: 'Formato ingresado incorrecto',
                        value: '00:00:00',
                        minValue: '00:00:00',
                        maxValue: '1:59:00',
                        emptyText: '00:15:00'
                    },
                    {
                        xtype: 'timefield',
                        fieldLabel: 'Tiempo de fracción',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'tiempoFraccion',
                        allowBlank: false,
                        format: 'H:i:s',
                        invalidText: 'Formato ingresado incorrecto',
                        value: '00:00:00',
                        minValue: '00:00:00',
                        maxValue: '00:59:00',
                        emptyText: '00:15:00'
                    },
//        {
//                xtype: 'numberfield',
//                name: 'costo',
//                fieldLabel: 'Costo/min:',
//                emptyText: 'Numero de Plazas..',
//                allowBlank: false,
//                maxValue: 20,
//                minValue: 6
//            },

                    {
                        fieldLabel: 'Zona',
                        name: 'coordenadas',
                        id: 'coordenadas'
//                                                hidden:true

                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: 'Descripción',
                        name: 'descripcion',
//                labelWidth: 20,
                        height: 100,
                        emptyText: 'Ingresar Descripción...'
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
                                            floating: true, // usually you want this set to True (default)
                                            renderTo: 'map', // usually rendered by it's containing componen
                                            items: [{
                                                    iconCls: 'icon-valid',
                                                    text: 'Terminar',
                                                    handler: function () {

//                                                                        console.log('terminar');
//                                                                        var areaGeoce = lines.features[0].geometry.getArea();
//                                                                        console.log(areaGeoce);
//                                                                        Ext.getCmp('numberfield-point-route').setValue(lines.features[0].geometry.components.length);
//                                                                        modifyLine.deactivate();
//                                                                        winAddGeocerca.show();
                                                        geometria = lines.features[0].geometry; //figura
                                                        console.log(geometria + 'geometria');
                                                        var area = geometria.getArea() / 1000;
                                                        area = Math.round(area * 100) / 100;
                                                        console.log(area);
                                                        Ext.getCmp('numberfield-point-route').setValue(area + ' km2');
                                                        modifyLine.deactivate();
                                                        winAdminZonas.show();
                                                        drawRoute = true;
                                                    }
                                                }]
                                        }).show();
                                        geosVertice = true;
                                    }
                                    winAdminZonas.hide();
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
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'Actualizar',
                        disabled: true,
                        tooltip: 'Actualizar',
                        handler: onUpdateZonas
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateZonas
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        tooltip: 'Eliminar Sitio',
                        handler: onDeleteZonas
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetZonas
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminZonas.hide();
                        }
                    }]
            }]
    });
});
function showWinAdminZonas() {
    if (!winAdminZonas) {
        winAdminZonas = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Zonas',
            iconCls: 'icon-person',
            resizable: false,
            width: 780,
            height: 480,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminZonas,
                        formAdminZonas
                    ]
                }]
        });
    }
    onResetZonas();
    winAdminZonas.show();
}

function setActiveRecordZonas(record) {
    formAdminZonas.activeRecord = record;
    formAdminZonas.down('#update').enable();
    formAdminZonas.down('#create').disable();
    formAdminZonas.getForm().loadRecord(record);
}

function onUpdateZonas() {
    var active = formAdminZonas.activeRecord,
            form = formAdminZonas.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateZonas() {
    var form = formAdminZonas.getForm();
    if (form.isValid()) {
        formAdminZonas.fireEvent('create', formAdminZonas, form.getValues());
        formAdminZonas.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetZonas() {
    formAdminZonas.getForm().reset();
    formAdminZonas.down('#delete').disable();

    gridAdminZonas.getView().deselect(gridAdminZonas.getSelection());
}

function onDeleteZonas() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar Zona', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminZonas.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminZonas.store.remove(selection);
                formAdminZonas.down('#delete').disable();
                formAdminZonas.down('#create').enable();
            }
        }
    });
}