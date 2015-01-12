/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var winAddZona;
var contenedorZona
var formRecordsZona;
var gridRecordsZona;
var vertPolygonos = "";
var trazar = 0;
var gridStoreGeocercas;
var drawRoute=true;
var geometria;
var id_empresageos = 0;
var areaEdit;
var coordenadasEdit = '';
Ext.onReady(function () {
    //Fenera campos de array para usar en el inicio del store por defecto
    Ext.define('DataObjectZona', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idZona'},
            {name: 'nombre'},
            {name: 'horario'},
            {name: 'color'},
            {name: 'tiempo'},
            {name: 'tiempoFraccion'},
            {name: 'descripcion'},
        ]
    });

    // crea los datos del store
    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataObjectZona',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/zona/read.php',
                create: 'php/admin/zona/create.php',
                update: 'php/admin/zona/update.php',
                destroy: 'php/admin/zona/destroy.php'
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

    // Column Model shortcut array
    var columns = [
        {header: "Id", flex: 10, sortable: true, dataIndex: 'id', filterable: true},
        {header: "Zona", width: 100, sortable: true, dataIndex: 'nombre', filter: {type: 'string'}},
        {header: "Horario", width: 200, sortable: true, dataIndex: 'horario', filter: {type: 'string'}},
        {header: "Costo", width: 100, sortable: true, dataIndex: 'costo', filter: {type: 'list', store: storeRolUserList}},
        {header: "Descripción", width: 100, sortable: true, dataIndex: 'descripcion', filter: {type: 'string'}},
    ];

    // declare the source Grid
    gridRecordsZona = Ext.create('Ext.grid.Panel', {
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
        height: 380,
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect: true}),
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

    var formPanelGrid = Ext.create('Ext.form.Panel', {
        width: '45%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        items: [gridRecordsZona]
    });


    formRecordsZona = Ext.create('Ext.form.Panel', {
        id: 'panel-datos-user',
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
                                name: 'areaGeocerca',
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
                                                        geometria = lines.features[0].geometry; //figura
                                                        var linearRing = new OpenLayers.Geometry.LinearRing(geometria.getVertices());
                                                        var polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing]));
                                                        areaEdit = polygonFeature.geometry.getArea() / 1000;
                                                        areaEdit = Math.round(areaEdit * 100) / 100;
                                                        Ext.getCmp('numberfield-point-route').setValue(areaEdit + ' km2');
                                                        modifyLine.deactivate();
                                                        var nuevosVertces = geometria.getVertices();

                                                        for (var i = 0; i < nuevosVertces.length; i++) {
                                                            nuevosVertces[i] = nuevosVertces[i].transform(new OpenLayers.Projection('EPSG:900913'),
                                                                    new OpenLayers.Projection('EPSG:4326'));
                                                            coordenadasEdit += nuevosVertces[i].x + ',' + nuevosVertces[i].y;
                                                            if (i != nuevosVertces.length - 1) {
                                                                coordenadasEdit += ';';
                                                            }
                                                        }
                                                        console.log("Nuevas Cordenadas editadas  " + coordenadasEdit);
                                                        winAddZona.show();
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
                        handler: onResetUser
                    }, {
                        iconCls: 'icon-cancelar',
                        text: 'Cancelar',
                        tooltip: 'Cancelar',
                        scope: this,
                        handler: clearWinUser
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
        winAddZona = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Añadir Zonas',
            id: 'vtnAddZona',
            iconCls: 'icon-user',
            resizable: false,
            width: 780,
            height: 460,
            closeAction: 'hide',
            plain: false,
            items: [contenedorZona],
            listeners: {
                close: function (panel, eOpts) {
                    onResetUser();
                }
            }
        });
    }
    contenedorZona.getForm().reset();
    winAddZona.show();

    //Esto se asegurará de que sólo caera al contenedor
    var formPanelDropTargetElUser = document.getElementById('panel-datos-user');

    var formPanelDropTargetUser = Ext.create('Ext.dd.DropTarget', formPanelDropTargetElUser, {
        ddGroup: 'grid-to-form',
        notifyEnter: function (ddSource, e, data) {

            // Añadir un poco de brillo al momento de entrar al contenedor
            formRecordsZona.body.stopAnimation();
            formRecordsZona.body.highlight();
        },
        notifyDrop: function (ddSource, e, data) {

            // Referencia el record (seleccion simple) para facilitar lectura
            var selectedRecord = ddSource.dragData.records[0];

            setActiveRecordUser(selectedRecord || null);

            // Carga los registro en el form            
            formRecordsZona.getForm().loadRecord(selectedRecord);


            formRecordsZona.down('#saveZona').enable();
            formRecordsZona.down('#deleteZona').enable();

            // Elimina el registro desde los registros. No es relamente Requerido
            //ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
}

function setActiveRecordUser(record) {
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
    if (form.isValid()) {
        form.updateRecord(active);
        onResetUser();
    }
}

function onCreateZona() {
    var form = formRecordsZona.getForm();

    if (form.isValid()) {
        formRecordsZona.fireEvent('create', formRecordsZona, form.getValues());
        formRecordsZona.down('#saveZona').disable();
        form.reset();
    }
}

function onResetUser() {
    setActiveRecordUser(null);
    formRecordsZona.down('#deleteZona').disable();
    formRecordsZona.getForm().reset();
}

function clearWinUser() {
    onResetUser();
    winAddZona.hide();
}

function onDeleteClickZona() {
    var selection = gridRecordsZona.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridRecordsZona.store.remove(selection);
        formRecordsZona.down('#deleteZona').disable();
    }
}
