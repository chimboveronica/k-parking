var winAdminUsuarios;
var formAdminUsuarios;
var gridAdminUsuarios;
var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
Ext.onReady(function () {
    Ext.define('DataUsuarios', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUsuario'},
            {name: 'cedula'},
            {name: 'persona'},
            {name: 'idRol'},
            {name: 'usuario'},
            {name: 'clave'},
            {name: 'idParking'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataUsuarios',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/usuario/read.php',
                create: 'php/administracion/usuario/create.php',
                update: 'php/administracion/usuario/update.php',
                destroy: 'php/administracion/usuario/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'usuarios',
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
            }
        }
    });

    gridAdminUsuarios = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            {header: "Cedula", width: 100, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
            {header: "Persona", width: 200, sortable: true, dataIndex: 'persona', filter: {type: 'string'}},
            {header: "Rol", width: 180, sortable: true, dataIndex: 'idRol', filter: {type: 'list', store: storeRolUserList}},
            {header: "Usuario", width: 180, sortable: true, dataIndex: 'usuario', filter: {type: 'string'}},
            {header: "Parqueadero", width: 180, sortable: true, dataIndex: 'idParking', filter: {type: 'string'}}
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
                    setActiveRecordUsuarios(selected[0]);
                    formAdminUsuarios.down('#delete').enable();
                } else {
                    formAdminUsuarios.down('#create').enable();
                    formAdminUsuarios.down('#update').disable();
                }
            }
        }
    });
    var storeRoles = Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/gui/combobox/comboRoles.php',
            reader: {
                type: 'json',
                root: 'rol_usuario'
            }
        },
        fields: ['id', 'nombre']
    });

    formAdminUsuarios = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos de Usuario',
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
                title: 'Datos del Usuario',
                defaultType: 'textfield',
                collapsed: false,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                        xtype: 'combobox',
                        fieldLabel: 'Persona',
                        afterLabelTextTpl: required,
                        name: 'persona',
                        store: storePersonas,
                        valueField: 'id',
                        displayField: 'nombre',
                        queryMode: 'local',
                        allowBlank: false,
                        editable: false,
                        emptyText: 'Escoja la Persona...',
                        listConfig: {
                            minWidth: 320
                        }
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Rol de Usuario',
                        afterLabelTextTpl: required,
                        name: 'idRol',
                        store: storeRoles,
                        valueField: 'id',
                        displayField: 'nombre',
                        queryMode: 'local',
                        allowBlank: false,
                        editable: false,
                        emptyText: 'Elija el Rol de Usuario...',
                    }, {
                        fieldLabel: 'Usuario',
                        afterLabelTextTpl: required,
                        name: 'usuario',
                        allowBlank: false,
                        emptyText: 'Ingresar Usuario...',
                    }, {
                        fieldLabel: 'Contraseña',
                        afterLabelTextTpl: required,
                        name: 'clave',
                        itemId: 'pass',
                        allowBlank: false,
                        inputType: 'password',
                        emptyText: 'Ingresar Contraseña...',
                    }, {
                        fieldLabel: 'Confirmar Contraseña',
                        afterLabelTextTpl: required,
                        name: 'clave',
                        allowBlank: false,
                        inputType: 'password',
                        emptyText: 'Ingresar Contraseña Nuevamente...',
                        vtype: 'password',
                        initialPassField: 'pass'
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'Parqueadero',
                        afterLabelTextTpl: required,
                        name: 'idParking',
                        store: storeParking,
                        valueField: 'id',
                        displayField: 'nombre',
                        queryMode: 'local',
                        allowBlank: false,
                        editable: false,
                        emptyText: 'Elija el Rol de Usuario...',
                    }]
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
                        handler: onUpdateUsuarios
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateUsuarios
                    }, {
                        iconCls: 'icon-delete',
                        text: 'Eliminar',
                        disabled: true,
                        itemId: 'delete',
                        tooltip: 'Eliminar Usuario',
                        handler: onDeleteUsuarios
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetUsuarios
                    }, {
                        iconCls: 'icon-cancel', tooltip: 'Cancelar',
                        handler: function () {
                            winAdminUsuarios.hide();
                        }
                    }]
            }]
    });
});
function showWinAdminUsuarios() {
    if (!winAdminUsuarios) {
        winAdminUsuarios = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Usuarios',
            iconCls: 'icon-ico',
            resizable: false,
            width: 790,
            height: 400,
            closeAction: 'hide',
            plain: false, items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminUsuarios,
                        formAdminUsuarios
                    ]
                }]
        });
    }
    onResetUsuarios();
    winAdminUsuarios.show();
}

function setActiveRecordUsuarios(record) {
    formAdminUsuarios.activeRecord = record;
    formAdminUsuarios.down('#update').enable();
    formAdminUsuarios.down('#create').disable();
    formAdminUsuarios.getForm().loadRecord(record);
}

function onUpdateUsuarios() {
    var active = formAdminUsuarios.activeRecord,
            form = formAdminUsuarios.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateUsuarios() {
    var form = formAdminUsuarios.getForm();
    if (form.isValid()) {
        formAdminUsuarios.fireEvent('create', formAdminUsuarios, form.getValues());
        formAdminUsuarios.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetUsuarios() {
    formAdminUsuarios.getForm().reset();
    formAdminUsuarios.down('#delete').disable();

    gridAdminUsuarios.getView().deselect(gridAdminUsuarios.getSelection());
}

function onDeleteUsuarios() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar Usuario', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminUsuarios.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminUsuarios.store.remove(selection);
                formAdminUsuarios.down('#delete').disable();
                formAdminUsuarios.down('#create').enable();
            }
        }
    });
}