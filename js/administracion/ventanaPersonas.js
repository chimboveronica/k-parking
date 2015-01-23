var winAdminPersonas;
var formAdminPersonas;
var gridAdminPersonas;
var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
Ext.onReady(function () {
    Ext.define('DataPersonas', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'id_persona'},
            {name: 'cedula'},
            {name: 'nombres'},
            {name: 'apellidos'},
            {name: 'email'},
            {name: 'cbxEmpleo'},
            {name: 'fecha_nacimiento'},
            {name: 'direccion'},
            {name: 'celular'},
            {name: 'icon'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataPersonas',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/personal/read.php',
                create: 'php/administracion/personal/create.php',
                update: 'php/administracion/personal/update.php',
                destroy: 'php/administracion/personal/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'personas',
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
                storePersonas.reload();
                onResetPersonas();
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    gridAdminPersonas = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            {header: "Cedula", width: 80, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
            {header: "Apellidos", width: 150, sortable: true, dataIndex: 'apellidos', filter: {type: 'string'}},
            {header: "Nombres", width: 150, sortable: true, dataIndex: 'nombres', filter: {type: 'string'}},
            {header: "Empleo", width: 80, sortable: true, dataIndex: 'cbxEmpleo', filter: {type: 'string'}},
            {header: "Fec. Nac", width: 80, sortable: true, xtype: 'datecolumn', format: 'Y-m-d', dataIndex: 'fecha_nacimiento', filter: true, renderer: Ext.util.Format.dateRenderer('m/d/Y')},
            {header: "Dirección", width: 80, sortable: true, dataIndex: 'direccion', filter: {type: 'string'}},
            {header: "Email", width: 120, sortable: true, dataIndex: 'email', filter: {type: 'string'}},
            {header: "Celular", width: 80, sortable: true, dataIndex: 'celular', filter: {type: 'string'}}
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
                    setActiveRecordPersonas(selected[0]);

                    formAdminPersonas.down('[name=labelImage]').setSrc('img/fotos/' + selected[0].data.icon);
                    formAdminPersonas.down('[name=imageFile]').setRawValue(selected[0].data.icon);
                    formAdminPersonas.down('#delete').enable();

                } else {
                    formAdminPersonas.down('#create').enable();
                    formAdminPersonas.down('#update').disable();
                }
            }
        }
    });
    var storeEmpleos = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax', url: 'php/gui/combobox/comboEmpleos.php',
            reader: {
                type: 'json',
                root: 'empleos'
            }
        },
        fields: ['id', 'nombre']
    });
    formAdminPersonas = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos de Persona',
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
        items: [
            {
                xtype: 'fieldset',
                checkboxToggle: true,
                title: 'Datos Personales',
                defaultType: 'textfield',
                collapsed: false,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        fieldLabel: 'Cedula',
                        afterLabelTextTpl: required,
                        name: 'cedula',
                        vtype: 'cedulaValida',
                        allowBlank: false,
                        emptyText: '0123456789 (10 digitos)',
                    }, {
                        fieldLabel: 'Nombres',
                        afterLabelTextTpl: required,
                        name: 'nombres',
                        allowBlank: false,
                        emptyText: 'Ingresar Nombres...',
                    }, {
                        fieldLabel: 'Apellidos',
                        afterLabelTextTpl: required,
                        name: 'apellidos',
                        allowBlank: false,
                        emptyText: 'Ingresar Apellidos...',
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Empleo:',
                        name: 'cbxEmpleo',
                        afterLabelTextTpl: required,
                        store: storeEmpleos,
                        valueField: 'id',
                        displayField: 'nombre',
                        queryMode: 'local',
                        allowBlank: false,
                        editable: false,
                        emptyText: 'Seleccionar Empleo...'
                    }, {
                        fieldLabel: 'Fecha de Nacimiento',
                        name: 'fecha_nacimiento',
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        emptyText: 'Ingresar Fecha...'
                    }]
            },
            {
                xtype: 'fieldset',
                title: 'Direccion y Telefono',
                collapsible: true,
                defaultType: 'textfield',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                        fieldLabel: 'Direccion',
                        name: 'direccion',
                        emptyText: 'Ingresar Direccion...'
                    }, {
                        fieldLabel: 'Email',
                        name: 'email',
                        vtype: 'email',
                        emptyText: 'kradac@kradac.com'
                    }, {
                        fieldLabel: 'Celular',
                        name: 'celular',
                        emptyText: '0991540427 (10 digitos)'
                    },
                    {
                        name: 'icon',
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
                                var form = formAdminPersonas.getForm();
                                form.submit({
                                    url: 'php/administracion/sitios/upload.php',
                                    success: function (form, action) {
                                        formAdminPersonas.down('[name=labelImage]').setSrc('img/fotos/' + action.result['img']);
                                        formAdminPersonas.down('[name=icon]').setValue(action.result['img']);
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
                        src: 'img/fotos/sin_img.png',
                        height: 100,
                        border: 2,
                        margin: '0 0 0 115',
                        anchor: '70%',
                        style: {
                            borderColor: '#157fcc',
                            borderStyle: 'solid'
                        }
                    }
                ]
            }


        ],
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
                        handler: onUpdatePersonas
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreatePersonas
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        tooltip: 'Eliminar Persona',
                        handler: onDeletePersonas
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetPersonas
                    }, {
                        iconCls: 'icon-cancel', tooltip: 'Cancelar',
                        handler: function () {
                            winAdminPersonas.hide();
                        }
                    }]
            }]
    });
});
function showWinAdminPersonas() {
    if (!winAdminPersonas) {
        winAdminPersonas = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Personas',
            iconCls: 'icon-ico',
            resizable: false,
            width: 790,
            height: 550,
            closeAction: 'hide',
            plain: false, items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminPersonas,
                        formAdminPersonas
                    ]
                }]
        });
    }
    onResetPersonas();
    winAdminPersonas.show();
}

function setActiveRecordPersonas(record) {
    formAdminPersonas.activeRecord = record;
    formAdminPersonas.down('#update').enable();
    formAdminPersonas.down('#create').disable();
    formAdminPersonas.getForm().loadRecord(record);
}

function onUpdatePersonas() {
    var active = formAdminPersonas.activeRecord,
            form = formAdminPersonas.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreatePersonas() {
    var form = formAdminPersonas.getForm();
    if (form.isValid()) {
        formAdminPersonas.fireEvent('create', formAdminPersonas, form.getValues());
        formAdminPersonas.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetPersonas() {
    formAdminPersonas.getForm().reset();
    formAdminPersonas.down('[name=labelImage]').setSrc('img/fotos/sin_img.png');
    formAdminPersonas.down('#delete').disable();

    gridAdminPersonas.getView().deselect(gridAdminPersonas.getSelection());
}

function onDeletePersonas() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar Persona', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminPersonas.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminPersonas.store.remove(selection);
                formAdminPersonas.down('#delete').disable();
                formAdminPersonas.down('#create').enable();
            }
        }
    });
}