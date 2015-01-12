var winAddUser;
var contenedorUser;
var formRecordsUser;
var gridRecordsUser;

Ext.onReady(function(){    
    //Fenera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectUser', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping : 'idUsuario'},
            {name: 'cedula'},
            {name: 'persona'},            
            {name: 'idRol'},            
            {name: 'usuario'},
            {name: 'clave'},
            {name: 'idParking'}
        ]
        //No combiene mucho utilizar ya que no se guarda
        //en a base si ingreso un valor fuera de los requerimientos
        //Mejor validar con Vtype en cada campo como con email
        /*,
        validations: [
            {type: 'length', field: 'cedula', min: 10, max: 10},            
            {type: 'length', field: 'nombres', min: 3},
            {type: 'length', field: 'apellidos', min: 3},
            {type: 'length', field: 'email', min: 5}            
        ]*/
    });

    // crea los datos del store
    var gridStore = Ext.create('Ext.data.Store', {        
        autoLoad : true,
        autoSync : true,
        model  : 'DataObjectUser',
        proxy : {
            type: 'ajax',
            api: {
                read: 'php/administracion/usuario/read.php',
                create: 'php/administracion/usuario/create.php',
                update: 'php/administracion/usuario/update.php',
                destroy: 'php/administracion/usuario/destroy.php'
            },            
            reader : {
                type: 'json',
                successProperty: 'success',
                root: 'usuarios',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                encode : true,
                writeAllFields: false,
                root: 'usuarios'
            },
            listeners: {
                exception: function(proxy, response, operation){
                    if (operation.action == 'create') {
                        if (operation.success) {                            
                            Ext.example.msg("Mensaje", operation.resultSet.message);                            
                        } else {                            
                            Ext.MessageBox.show({
                                title: 'ERROR',
                                msg: operation.getError(),
                                icon: Ext.MessageBox.ERROR,
                                buttons: Ext.Msg.OK
                            });                            
                        }
                    } else {
                        Ext.MessageBox.show({
                            title: 'REMOTE EXCEPTION',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                    gridStore.reload();                    
                }
            }
        },
        listeners: {
            write: function ( store, operation, eOpts ){                
                if (operation.action == 'destroy') {                    
                    setActiveRecordUser(null);
                    if (operation.success) {
                        Ext.example.msg("Mensaje", operation.resultSet.message);
                    } else {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    } 
                }

                if (operation.action == 'update' || operation.action == 'create') {
                    if (operation.success) {
                        Ext.example.msg("Mensaje", operation.resultSet.message);
                    } else {
                        Ext.MessageBox.show({
                            title: 'ERROR',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }                    
                }

                gridStore.reload();
            }
        }
    });

    // Column Model shortcut array
    var columns = [
        {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
        {header: "Cedula", width: 100, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
        {header: "Persona", width: 200, sortable: true, dataIndex: 'persona', filter: {type: 'string'}},
        {header: "Rol", width: 100, sortable: true, dataIndex: 'idRol', filter: {type: 'list', store: storeRolUserList}},
        {header: "Usuario", width: 100, sortable: true, dataIndex: 'usuario', filter: {type: 'string'}},
        {header: "Parqueadero", width: 150, sortable: true, dataIndex: 'idParking', filter: {type: 'string'}}
    ];

    // declare the source Grid
    gridRecordsUser = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'grid-to-form',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },        
        store : gridStore,
        columns : columns,
        enableDragDrop : true,
        stripeRows : true,
        height : 300,
        selModel : Ext.create('Ext.selection.RowModel', {singleSelect : true}),
        features: [filters]
        //Para cuando de click a una de las filas se pasen los datos
        /*listeners: {
            selectionchange: function ( thisObject, selected, eOpts ){
                //console.log(selected[0]);
                setActiveRecordUser(selected[0] || null);
            },

            itemmousedown: function( thisObject, record, item, index, e, eOpts ){
                //console.log('mouse sobre item');
            }
        }*/
    });

    var formPanelGrid = Ext.create('Ext.form.Panel',{
        width : '45%',        
        margins : '0 2 0 0',
        region : 'west',
        title : 'Registros',
        items : [gridRecordsUser]
    });

    var storeRoles = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            url:'php/gui/combobox/comboRoles.php',
            reader : {
                type : 'json',
                root: 'rol_usuario'
            }
        },
        fields : ['id', 'nombre']
    });

    formRecordsUser = Ext.create('Ext.form.Panel', {
        id : 'panel-datos-user',
        region : 'center',
        title : 'Ingresar Datos del Usuario',
        activeRecord: null,
        bodyStyle : 'padding: 10px; background-color: #DFE8F6',
        labelWidth : 100,
        margins    : '0 0 0 3',
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 75
        },
        defaults: {
            anchor: '100%'
        },
        items: [{
            xtype:'fieldset',
            checkboxToggle:true,
            title: 'Datos del Usuario',
            defaultType: 'textfield',
            collapsed: false,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                xtype : 'combobox',
                fieldLabel: 'Persona',
                afterLabelTextTpl: required,
                name: 'persona',
                store : storePersonas,
                valueField : 'id',
                displayField : 'nombre',                
                queryMode : 'local',                
                allowBlank : false,
                editable : false,
                emptyText : 'Escoja la Persona...',
                listConfig: {
                    minWidth : 320
                }
            },{
                xtype : 'combobox',
                fieldLabel: 'Rol de Usuario',
                afterLabelTextTpl: required,
                name: 'idRol',
                store : storeRoles,
                valueField : 'id',
                displayField : 'nombre',                
                queryMode : 'local',                
                allowBlank : false,
                editable : false,
                emptyText : 'Elija el Rol de Usuario...',
            },{
                fieldLabel: 'Usuario',
                afterLabelTextTpl: required,
                name: 'usuario',                
                allowBlank : false,                
                emptyText : 'Ingresar Usuario...',
            },{                
                fieldLabel: 'Contraseña',
                afterLabelTextTpl: required,
                name: 'clave',
                itemId: 'pass',
                allowBlank : false,
                inputType : 'password',
                emptyText : 'Ingresar Contraseña...',
            },{                
                fieldLabel: 'Confirmar Contraseña',
                afterLabelTextTpl: required,
                name: 'clave',                
                allowBlank : false,
                inputType : 'password',
                emptyText : 'Ingresar Contraseña Nuevamente...',
                vtype: 'password',
                initialPassField: 'pass'
            },{
                xtype : 'combobox',
                fieldLabel: 'Parqueadero',
                afterLabelTextTpl: required,
                name: 'idParking',
                store : storeParking,
                valueField : 'id',
                displayField : 'nombre',                
                queryMode : 'local',                
                allowBlank : false,
                editable : false,
                emptyText : 'Elija el Rol de Usuario...',
            }]
        }],
        listeners: {
            create: function(form, data){
                gridStore.insert(0, data);
                gridStore.reload();
            }
        },
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                icon : 'img/user_suit.gif',
                scope : this,
                tooltip : 'Ingresar Nueva Persona',
                handler : ventAddPersonal
            },{
                iconCls: 'icon-save',
                itemId: 'saveUser',
                text: 'Actualizar',
                disabled: true,
                scope: this,
                tooltip : 'Actualizar Datos',
                handler: onSaveUser
            },{
                iconCls : 'icon-user-add',
                text: 'Crear',
                scope: this,
                tooltip : 'Crear Usuario',
                handler: onCreateUser
            },{
                iconCls: 'icon-delete',
                text: 'Eliminar',
                disabled: true,
                itemId: 'deleteUser',
                scope: this,
                tooltip : 'Eliminar Usuario',
                handler: onDeleteClickUser
            },{
                iconCls: 'icon-reset',
                text: 'Limpiar',
                scope: this,
                tooltip : 'Limpiar Campos',
                handler: onResetUser
            },{
                iconCls: 'icon-cancelar',
                text: 'Cancelar',
                tooltip : 'Cancelar',
                scope: this,
                handler: clearWinUser
            }]
        }]
    });

    contenedorUser = Ext.create('Ext.form.Panel', {        
        layout   : 'border',        
        bodyPadding: 5,
        items: [
            formPanelGrid,
            formRecordsUser
        ]
    });    
});

function ventAddUser(){
	if(!winAddUser){
        winAddUser = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Añadir Usuario',
            id : 'vtnAddUser',
            iconCls : 'icon-user',
            resizable : false,
            width : 780,
            height : 360,
            closeAction : 'hide',
            plain : false,
            items : [contenedorUser],
            listeners : {
                close : function( panel, eOpts ){
                    onResetUser();
                }
            }
        });
    }
    contenedorUser.getForm().reset();
    winAddUser.show();

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElUser =  document.getElementById('panel-datos-user');

    var formPanelDropTargetUser = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElUser, {
        ddGroup: 'grid-to-form',
        notifyEnter: function(ddSource, e, data) {

            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecordsUser.body.stopAnimation();
            formRecordsUser.body.highlight();
        },
        notifyDrop  : function(ddSource, e, data){

            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            
            setActiveRecordUser(selectedRecord || null);

            // Carga los registro en el form            
            formRecordsUser.getForm().loadRecord(selectedRecord);
            

            formRecordsUser.down('#saveUser').enable();
            formRecordsUser.down('#deleteUser').enable();

            // Elimina el registro desde los registros. No es relamente Requerido
            //ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
}

function setActiveRecordUser(record){
    formRecordsUser.activeRecord = record;
    if (record) {
        formRecordsUser.down('#saveUser').enable();
        formRecordsUser.getForm().loadRecord(record);
    } else {
        formRecordsUser.down('#saveUser').disable();
        formRecordsUser.getForm().reset();
    }
}

function onSaveUser(){
    var active = formRecordsUser.activeRecord,
    form = formRecordsUser.getForm();
                    
    if (!active) {
        return;
    }
    if (form.isValid()) {                        
        form.updateRecord(active);        
        onResetUser();
    }
}

function onCreateUser(){
    var form = formRecordsUser.getForm();    

    if (form.isValid()) {        
        formRecordsUser.fireEvent('create', formRecordsUser, form.getValues());
        formRecordsUser.down('#saveUser').disable();        
        form.reset();
    }
}

function onResetUser(){
    setActiveRecordUser(null);
    formRecordsUser.down('#deleteUser').disable();
    formRecordsUser.getForm().reset();
}

function clearWinUser(){
    onResetUser();
    winAddUser.hide();
}

function onDeleteClickUser(){
    var selection = gridRecordsUser.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecordsUser.store.remove(selection);
        formRecordsUser.down('#deleteUser').disable();
    }
}