var winAdminSitio;
var formAdminSitio;
var gridAdminSitio;
var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
Ext.onReady(function () {
    Ext.define('DataSitio', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idSitio'},
            {name: 'nombre'},
            {name: 'direccion', type: 'string'},
            {name: 'latitudSitio'},
            {name: 'longitudSitio'},
            {name: 'descripcion'},
            {name: 'img'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataSitio',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/sitios/read.php',
                create: 'php/administracion/sitios/create.php',
                update: 'php/administracion/sitios/update.php',
                destroy: 'php/administracion/sitios/destroy.php'
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
                onResetSitio();

            }
        }
    });

    gridAdminSitio = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Sitio", width: 100, sortable: true, dataIndex: 'nombre', filter: {type: 'string'}, align: 'center'},
            {header: "Dirección", width: 150, sortable: true, dataIndex: 'direccion', filter: {type: 'string'}},
            {header: "Descripción", width: 150, sortable: true, dataIndex: 'descripcion', filter: {type: 'string'}},
            {header: "Latitud", width: 100, sortable: true, dataIndex: 'latitudSitio', filter: {type: 'string'}},
            {header: "Longitud", width: 110, sortable: true, dataIndex: 'longitudSitio', filter: {type: 'string'}}
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
                    setActiveRecordSitios(selected[0]);

                    formAdminSitio.down('[name=labelImage]').setSrc('img/fotos/' + selected[0].data.img);
                    formAdminSitio.down('[name=imageFile]').setRawValue(selected[0].data.img);
                    formAdminSitio.down('#delete').enable();

                } else {
                    formAdminSitio.down('#create').enable();
                    formAdminSitio.down('#update').disable();
                }
            }
        }
    });

    formAdminSitio = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos del Sitio de Recaudo',
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
                title: '<b>Datos del Sitio</b>',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                        name: 'img',
                        hidden: true
                    },
                    
                    {
                        xtype: 'filefield',
                        name: 'imageFile',
                        emptyText: "Máximo 2MB",
                        fieldLabel: "<b>Fotografía</b>",
                        buttonConfig: {
                            iconCls: 'icon-upload',
                            text: '',
                            tooltip: 'Escoger imagen'
                        },
                        listeners: {
                            change: function (thisObj, value, eOpts) {
                                var form = formAdminSitio.getForm();
                                form.submit({
                                    url: 'php/administracion/sitios/upload.php',
                                    success: function (form, action) {
                                        formAdminSitio.down('[name=labelImage]').setSrc('img/fotos/' + action.result['img']);
                                        formAdminSitio.down('[name=img]').setValue(action.result['img']);
                                        thisObj.setRawValue(action.result['img']);
                                    },
                                    failure: function (form, action) {
                                        Ext.Msg.alert('Error', 'El formtao de la imagen es inválida');
                                    }
                                });
                            }
                        }
                    }, {
                        xtype: 'image',
                        name: 'labelImage',
                        src: 'img/fotos/sitio.jpg',
                        height: 100,
                        border: 2,
                        margin: '0 0 0 115',
                        anchor: '70%',
                        style: {
                            borderColor: '#157fcc',
                            borderStyle: 'solid'
                        }
                    },
                    {
                        fieldLabel: '<b>Sitio</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'nombre',
                        allowBlank: false,
                        emptyText: 'Ingresar nombre',
                    }, {
                        fieldLabel: '<b>Dirección</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'direccion',
                        allowBlank: false,
                        emptyText: 'Ingresar Dirección...',
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: '<b>Descripción</b>',
                        name: 'descripcion',
                        height: 60,
                        emptyText: 'Ingresar Descripción...'
                    },
                    {
                        name: 'latitudSitio',
                        id: 'latitudSitio',
                        fieldLabel: '<b>Latitud:</b>',
                        emptyText: 'Latitud..',
                        allowBlank: false
                    }, {
                        name: 'longitudSitio',
                        id: 'longitudSitio',
                        fieldLabel: '<b>Longitud:</b>',
                        emptyText: 'Longitud..',
                        allowBlank: false
                    }
                ]
            }],
        buttons: [{
                text: 'Ubicar',
                iconCls: 'icon-obtener-coord',
                handler: function () {
                    obtenerLatLon = true;
                    winAdminSitio.hide();
                }
            }],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
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
                        handler: onUpdateSitio
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateSitio
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        tooltip: 'Eliminar Sitio',
                        handler: onDeleteSitio
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetSitio
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminSitio.hide();
                        }
                    }]
            }]
    });
});
function showWinAdminSitios() {
    if (!winAdminSitio) {
        winAdminSitio = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Sitios de Recaudo',
            iconCls: 'icon-ico',
            resizable: false,
            width: 790,
            height: 530,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminSitio,
                        formAdminSitio
                    ]
                }]
        });
    }
    onResetSitio();
    winAdminSitio.show();
}

function setActiveRecordSitios(record) {
    
    
    formAdminSitio.activeRecord = record;
    formAdminSitio.down('#update').enable();
    formAdminSitio.down('#create').disable();
    formAdminSitio.getForm().loadRecord(record);
}

function onUpdateSitio() {
    var active = formAdminSitio.activeRecord,
            form = formAdminSitio.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateSitio() {
    var form = formAdminSitio.getForm();
    if (form.isValid()) {
        formAdminSitio.fireEvent('create', formAdminSitio, form.getValues());
        formAdminSitio.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetSitio() {
    formAdminSitio.getForm().reset();
    formAdminSitio.down('[name=labelImage]').setSrc('img/fotos/sitio.jpg');
    formAdminSitio.down('#delete').disable();

    gridAdminSitio.getView().deselect(gridAdminSitio.getSelection());
}

function onDeleteSitio() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la Sitio', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminSitio.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminSitio.store.remove(selection);
                formAdminSitio.down('#delete').disable();
                formAdminSitio.down('#create').enable();
            }
        }
    });
}