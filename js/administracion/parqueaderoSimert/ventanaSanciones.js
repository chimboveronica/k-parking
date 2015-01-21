var winAdminSanciones;
var formAdminSanciones;
var gridAdminSanciones;
var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
Ext.onReady(function () {
    Ext.define('DataSanciones', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idSancion'},
            {name: 'motivo'},
            {name: 'valor'},
            {name: 'descripcion'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataSanciones',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/sanciones/read.php',
                create: 'php/administracion/sanciones/create.php',
                update: 'php/administracion/sanciones/update.php',
                destroy: 'php/administracion/sanciones/destroy.php'
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
                onResetSancion();

            }
        }
    });

    gridAdminSanciones = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Motivo", width: 100, sortable: true, dataIndex: 'motivo', filter: {type: 'string'}, align: 'center'},
            {header: "Valor", width: 100, sortable: true, dataIndex: 'valor', filter: {type: 'string'}},
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
                if (selected.length > 0) {
                    setActiveRecordSanciones(selected[0]);
                    formAdminSanciones.down('#delete').enable();

                } else {
                    formAdminSanciones.down('#create').enable();
                    formAdminSanciones.down('#update').disable();
                }
            }
        }
    });

    formAdminSanciones = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos de Sanciones',
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
                title: '<b>Datos de la Sanción</b>',
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        fieldLabel: '<b>Motivo</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'motivo',
                        allowBlank: false,
                        emptyText: 'Ingresar motivo',
                    }, {
                        fieldLabel: '<b>Valor</b>',
                        afterLabelTextTpl: required,
                        blankText: 'Este campo es obligatorio',
                        name: 'valor',
                        allowBlank: false,
                        emptyText: 'Ingresar Valor...',
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: '<b>Descripción</b>',
                        name: 'descripcion',
                        height: 60,
                        emptyText: 'Ingresar Descripción...'
                    }
                  
                ]
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
                        handler: onUpdateSancion
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateSancion
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        tooltip: 'Eliminar Sanción',
                        handler: onDeleteSancion
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetSancion
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminSanciones.hide();
                        }
                    }]
            }]
    });
});
function showWinAdminSancion() {
    if (!winAdminSanciones) {
        winAdminSanciones = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Sitios de Recaudo',
            iconCls: 'icon-person',
            resizable: false,
            width: 700,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminSanciones,
                        formAdminSanciones
                    ]
                }]
        });
    }
    onResetSancion();
    winAdminSanciones.show();
}

function setActiveRecordSanciones(record) {
    formAdminSanciones.activeRecord = record;
    formAdminSanciones.down('#update').enable();
    formAdminSanciones.down('#create').disable();
    formAdminSanciones.getForm().loadRecord(record);
}

function onUpdateSancion() {
    var active = formAdminSanciones.activeRecord,
            form = formAdminSanciones.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateSancion() {
    var form = formAdminSanciones.getForm();
    if (form.isValid()) {
        formAdminSanciones.fireEvent('create', formAdminSanciones, form.getValues());
        formAdminSanciones.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetSancion() {
    formAdminSanciones.getForm().reset();
    formAdminSanciones.down('#delete').disable();
    gridAdminSanciones.getView().deselect(gridAdminSanciones.getSelection());
}

function onDeleteSancion() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la Sancion', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminSanciones.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminSanciones.store.remove(selection);
                formAdminSanciones.down('#delete').disable();
                formAdminSanciones.down('#create').enable();
            }
        }
    });
}