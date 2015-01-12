var winAddPesonal;
var contenedorPersonal;
var formRecords;
var gridRecords;

Ext.onReady(function(){    
    //Genera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            //Id importante para hacer updates
            //debe ir con mapping para obtener los valores
            //ya que al pasarlos el id queda predeterminado
            {name: 'id', mapping : 'id_persona'},
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
        model  : 'DataObject',
        proxy : {
            type: 'ajax',
            api: {
                read: 'php/administracion/personal/read.php',
                create: 'php/administracion/personal/create.php',
                update: 'php/administracion/personal/update.php',
                destroy: 'php/administracion/personal/destroy.php'
            },            
            reader : {
                type: 'json',
                successProperty: 'success',
                root: 'personas',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                encode : true,
                writeAllFields: false,
                root: 'personas'
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
                    storePersonas.reload();
                }
            }
        },
        listeners: {
            write: function ( store, operation, eOpts ){                
                if (operation.action == 'destroy') {                    
                    setActiveRecord(null);
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
                storePersonas.reload();
            }
        }
    });

    // Column Model shortcut array
    var columns = [
        {header: "Cedula", width: 80, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
        {header: "Apellidos", width: 100, sortable: true, dataIndex: 'apellidos', filter: {type: 'string'}},
        {header: "Nombres", width: 100, sortable: true, dataIndex: 'nombres', filter: {type: 'string'}},
        {header: "Empleo", width: 80, sortable: true, dataIndex: 'cbxEmpleo', filter: {type: 'string'}},
        {header: "Fec. Nac", width: 80, sortable: true, xtype: 'datecolumn', format: 'Y-m-d', dataIndex: 'fecha_nacimiento', filter: true, renderer: Ext.util.Format.dateRenderer('m/d/Y')},
        {header: "Dirección", width: 80, sortable: true, dataIndex: 'direccion', filter: {type: 'string'}}, 
        {header: "Email", width: 120, sortable: true, dataIndex: 'email', filter: {type: 'string'}},   
        {header: "Celular", width: 80, sortable: true, dataIndex: 'celular', filter: {type: 'string'}}
    ];

    // declare the source Grid
    gridRecords = Ext.create('Ext.grid.Panel', {
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
        width : '50%',
        margins : '0 2 0 0',
        region : 'west',
        title : 'Registros',
        selModel : Ext.create('Ext.selection.RowModel', {singleSelect : true}),
        features: [filters]
        //Para cuando de click a una de las filas se pasen los datos
        /*listeners: {
            selectionchange: function ( thisObject, selected, eOpts ){
                //console.log(selected[0]);
                setActiveRecord(selected[0] || null);
            },

            itemmousedown: function( thisObject, record, item, index, e, eOpts ){
                //console.log('mouse sobre item');
            }
        }*/
    });

    var storeEmpleos = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy : {
            type : 'ajax',
            url:'php/gui/combobox/comboEmpleos.php',
            reader : {
                type : 'json',
                root: 'empleos'
            }
        },
        fields : ['id', 'nombre']
    });

    formRecords = Ext.create('Ext.form.Panel', {
        id : 'panel-datos',
        region : 'center',
        title : 'Ingresar Datos de la Persona',
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
            title: 'Datos Personales',
            defaultType: 'textfield',
            collapsed: false,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                fieldLabel: 'Cedula',
                afterLabelTextTpl: required,
                name: 'cedula',
                vtype : 'cedulaValida',
                allowBlank:false,
                emptyText : '0123456789 (10 digitos)',
            },{
                fieldLabel: 'Nombres',
                afterLabelTextTpl: required,
                name: 'nombres',
                allowBlank:false,
                emptyText : 'Ingresar Nombres...',
            },{
                fieldLabel: 'Apellidos',
                afterLabelTextTpl: required,
                name: 'apellidos',
                allowBlank:false,
                emptyText : 'Ingresar Apellidos...',
            },{
                xtype : 'combobox',
                fieldLabel : 'Empleo:',
                name : 'cbxEmpleo',
                afterLabelTextTpl: required,
                store : storeEmpleos,
                valueField : 'id',
                displayField : 'nombre',
                queryMode : 'local',                
                allowBlank : false,
                editable : false,
                emptyText : 'Seleccionar Empleo...'
            }, {
                fieldLabel: 'Fecha de Nacimiento',
                name: 'fecha_nacimiento',
                xtype: 'datefield',
                format: 'Y-m-d',
                emptyText : 'Ingresar Fecha...'
            }]
        },{
            xtype:'fieldset',
            title: 'Direccion y Telefono',
            collapsible: true,
            defaultType: 'textfield',
            layout: 'anchor',            
            defaults: {
                anchor: '100%'
            },
            items :[{
                fieldLabel: 'Direccion',
                name: 'direccion',
                emptyText : 'Ingresar Direccion...'
            },{
                fieldLabel: 'Email',                
                name: 'email',
                vtype:'email',
                emptyText : 'kradac@kradac.com'                
            },{
                fieldLabel: 'Celular',
                name: 'celular',
                emptyText : '0991540427 (10 digitos)'
            },{
                xtype: "filefield",
                name: 'icon',
                emptyText: "Máximo 2MB",
                fieldLabel: "Fotografía",                
                buttonText: "Examinar"                
            },{
                xtype: 'image',
                name: 'foto',
                src: 'img/fotos/sin_img.png',
                height : 100,
                anchor : '65%',
                margin: '0 0 0 120px',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                }
            }]
        }],
        listeners: {
            create: function(form, data){
                gridStore.insert(0, data);
                gridStore.reload();
                storePersonas.reload();
            }
        },
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                iconCls: 'icon-save',
                itemId: 'save',
                text: 'Actualizar',
                disabled: true,
                scope: this,
                tooltip : 'Actualizar Datos',
                handler: onSave
            },{
                iconCls: 'icon-user-add',
                text: 'Crear',
                scope: this,
                tooltip : 'Crear Persona',
                handler: onCreate
            },{
                iconCls: 'icon-delete',
                text: 'Eliminar',
                disabled: true,
                itemId: 'delete',
                scope: this,
                tooltip : 'Eliminar Persona',
                handler: onDeleteClick
            },{
                iconCls: 'icon-reset',
                text: 'Limpiar',
                tooltip : 'Limpiar Campos',
                scope: this,
                handler: onReset
            },{
                iconCls: 'icon-cancelar',
                text: 'Cancelar',
                tooltip : 'Cancelar',
                scope: this,
                handler: clearWinPerson
            }]
        }]
    });

    contenedorPersonal = Ext.create('Ext.form.Panel', {        
        layout   : 'border',        
        bodyPadding: 5,
        items: [
            gridRecords,
            formRecords
        ]
    });    
});

function ventAddPersonal(){
	if(!winAddPesonal){
        winAddPesonal = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Añadir Personal',
            iconCls : 'icon-personal',
            id : 'vtnAdd',
            resizable : false,
            width : 780,
            height : 550,
            closeAction : 'hide',
            plain : false,
            items : [contenedorPersonal],
            listeners : {
                close : function( panel, eOpts ){
                    onReset();
                }
            }
        });        
    }
    contenedorPersonal.getForm().reset();
    winAddPesonal.show();

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetEl =  document.getElementById('panel-datos');

    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
        ddGroup: 'grid-to-form',
        notifyEnter: function(ddSource, e, data) {

            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecords.body.stopAnimation();
            formRecords.body.highlight();
        },
        notifyDrop  : function(ddSource, e, data){

            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];
            
            setActiveRecord(selectedRecord || null);

            // Carga los registro en el form            
            formRecords.getForm().loadRecord(selectedRecord);            
            formRecords.down('[name=foto]').setSrc(selectedRecord.data.icon); 

            formRecords.down('#save').enable();
            formRecords.down('#delete').enable();

            // Elimina el registro desde los registros. No es relamente Requerido
            //ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
}

function setActiveRecord(record){
    formRecords.activeRecord = record;
    if (record) {
        formRecords.down('#save').enable();
        formRecords.getForm().loadRecord(record);
    } else {
        formRecords.down('#save').disable();
        formRecords.getForm().reset();
    }
}

function onSave(){
    var active = formRecords.activeRecord,
    form = formRecords.getForm();
                    
    if (!active) {
        return;
    }
    if (form.isValid()) {                        
        form.updateRecord(active);
        onReset();
    }
}

function onCreate(){
    var form = formRecords.getForm();    

    if (form.isValid()) {        
        formRecords.fireEvent('create', formRecords, form.getValues());
        formRecords.down('#save').disable();        
        form.reset();
    }
}

function onReset(){
    setActiveRecord(null);
    formRecords.down('#delete').disable();
    formRecords.getForm().reset();
}

function clearWinPerson(){
    onReset();
    winAddPesonal.hide();
}

function onDeleteClick(){
    var selection = gridRecords.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecords.store.remove(selection);
        formRecords.down('#delete').disable();
    }
}