var winAsigPlazas;
var formAsigPlazas;

Ext.onReady(function(){

    var comprobar = 0;
    var placa = null;
    var estado = -1;

    var storePlazasAsig = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,        
        proxy: {
            type: 'ajax',
            url: 'php/gui/getPlazasAsig.php',
            reader: {
                type: 'json',
                root: 'plazasAsig'
            }
        },
        fields:[{name: 'id', mapping: 'idPlaza'}, 'placa','estado', 'fecha', 'horaIngreso', 'horaSalida', 'horaTotal', 'valor']
    });

    var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1,
        listeners : {
            edit : function( editor, e, eOpts ) {                
                if (e.originalValue != e.value && e.colIdx == 1) {
                    comprobar++;
                    placa = e.value;
                }

                if (e.originalValue != e.value && e.colIdx == 2) {
                    estado = e.value;
                    if (estado == 0) {
                        comprobar = 2;                        
                    } else {
                        comprobar++;
                    }
                }

                if (comprobar == 2) {
                    Ext.Ajax.request({
                        url : 'php/gui/updatePlazasAsig.php',
                        success : function (result) {
                            //storePlazasAsig.commitChanges();
                            storePlazasAsig.reload();                            
                            comprobar = 0;
                        },        
                        params : {
                            placa  : placa,
                            estado  : estado,
                            idPlaza : e.record.internalId,
                            idParking : formAsigPlazas.down('[name=cbxParking]').getValue()
                        }
                    });
                }
            }
        }
    });

	formAsigPlazas = Ext.create('Ext.form.Panel', {
		frame: true,
		padding: '5 5 5 5',		
        layout : 'border',		
        items : [{
            region : 'north',
        	xtype : 'combobox',
            fieldLabel: 'Parqueadero',            
            name: 'cbxParking',
            store : storeParking,
            valueField : 'id',
            displayField : 'nombre',                
            queryMode : 'local',                
            allowBlank : false,
            editable : false,
            emptyText : 'Escoger Parqueadero...',
            listeners : {
                select : function( combo, records, eOpts ) {
                    storePlazasAsig.load({
                        params : {
                            idParking : records[0].data.id
                        }
                    });
                }
            }
        },{
            xtype : 'grid',
            region : 'center',            
            title: '<center>Plazas</center>',
            padding : '10 0 0 0',
            store: storePlazasAsig,
            plugins: cellEditing,
            columns: [
                { text: 'Plaza', flex: 1, dataIndex: 'id', align : 'center'},
                { text: 'Placa', width: 75, dataIndex: 'placa', align : 'center', editor: {xtype: 'textfield', allowBlank: false, minLength : 7, maxLength : 7}},
                { 
                    text: 'Estado', 
                    dataIndex: 'estado', 
                    width: 70,
                    renderer : formatState,                
                    editor: Ext.create('Ext.form.field.ComboBox', {
                        editable : false,
                        typeAhead: true,
                        triggerAction: 'all',
                        store: [
                            [0, 'Libre'],
                            [1, 'Ocupada']
                        ]
                    })
                },
                {text: 'Fecha', width: 80, dataIndex: 'fecha', align : 'center'},
                {text: 'Hora Ingreso', width: 80, dataIndex: 'horaIngreso', align : 'center'},
                {text: 'Hora Salida',  width: 80, dataIndex: 'horaSalida', align : 'center'},
                {text: 'Tiempo',  width: 80, dataIndex: 'horaTotal', align : 'center'},
                {text: 'Valor',  width: 80, dataIndex: 'valor', align : 'center'}
            ]
        }]
	});

    storePlazasAsig.load({
        params : {
            idParking : id_parking
        }
    });

    formAsigPlazas.down('[name=cbxParking]').setValue(id_parking);
});

function clearAsigPlazas() {
	if (winAsigPlazas) {		
		formAsigPlazas.getForm().reset();
		winAsigPlazas.hide();
	}
}

function windowAsigPlazas() {
	if (!winAsigPlazas) {
		winAsigPlazas = Ext.create('Ext.window.Window', {
			layout: 'fit',
            title: 'Asignar Plazas',
            iconCls: 'icon-asignar-plazas',
            resizable: false,
            width: 630,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: formAsigPlazas,
            listeners: {
            	close: function( panel, eOpts ) {
            		clearAsigPlazas();
            	}
            }
		});
	}	
	winAsigPlazas.show();
}

function formatState(val){
    if (val == 1){
        return '<span style="color:red;">Ocupada</span>';
    }else{
        return '<span style="color:green;">Libre</span>';
    }
}