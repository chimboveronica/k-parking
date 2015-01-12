var winGrafDiario;
var formGraficGeneral;

function createGrafic(idParking){

    var storeGrafDiario = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy: {
            type: 'ajax',
            url: 'php/gui/estadisticas/getDataGrafDiario.php?idParking='+idParking+"&fecha="+Ext.Date.format(new Date(), 'Y-m-d'),
            reader: {
                type: 'json',
                root: 'cantParkingDiario'
            }
        },
        fields:['idParking', 'parking', {name: 'hora', type : 'date'}]
    });

    console.log(getJsonOfStore(storeGrafDiario));

    var chartGrafDiario = Ext.create('Ext.chart.Chart', {
        animated: true,
        shadow : true,
        width : 325,
        height: 275,
        store: storeGrafDiario,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['idParking'],
            title: 'Parqueadero: '+idParking,
            grid: true,
            minimum: 0,
            maximum: 20
        }, {
            title: 'Hora',
            type: 'Time',
            position: 'bottom',
            fields: ['hora'],
            dateFormat: 'G:ia',            
            minorTickSteps: 24
        }],
        series: [{
            type: 'line',
            xField: 'hora',
            yField: ['idParking'],
            tips : {
                trackMouse: true,
                width : 200,
                height : 50,
                renderer : function (storeItem, item) {
                    this.setTitle("Cantidad: "+storeItem.get('idParking')+"<br>Hora: "+Ext.Date.format(storeItem.get('hora'), 'G:i'));
                }
            }
        }]
    });

    var formGrafic = Ext.create('Ext.form.Panel', {        
        items : chartGrafDiario,
        tbar: [{
            text: 'Descargar',
            iconCls : 'icon-save-img',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chartGrafDiario as an image?', function(choice){
                    if(choice == 'yes'){
                        chartGrafDiario.save({
                            type: 'image/png'
                        });
                    }
                });
            }
        },{
            text: 'Hoy',
            iconCls : 'icon-today',
            handler: function() {
                chartGrafDiario.getStore().load({
                    params : {
                        fecha : Ext.Date.format(new Date(), 'Y-m-d')
                    }
                });
            }
        },{
            xtype: 'datefield',                
            format: 'Y-m-d',
            name: 'fecha',
            value : new Date(),
            allowBlank: false,
            emptyText:'Fecha Inicial...',
            listeners : {
                change: function( thisObject, newValue, oldValue, eOpts ) {                        
                    chartGrafDiario.getStore().load({
                        params : {
                            fecha : Ext.Date.format(newValue, 'Y-m-d')
                        }
                    });
                }
            }
        }]
    });

    /*setTimeout( function(){        
        storeGrafDiario.reload();
    }
    , 5 * 1000 );*/

    return formGrafic;
}

function dinamiGrafic() {
    for (var i = 1; i <= 20; i++) {
        formGraficGeneral.add(createGrafic(i));
    }
}

function windowGraficasDiario() {
	if (!winGrafDiario) {
        formGraficGeneral = Ext.create('Ext.form.Panel', {            
            layout : {
                type : 'table',
                columns : 2
            },
            padding : '5 5 5 5',
            defaults : {
                padding : '5 5 5 5'
            },
            autoScroll : true
        });

        dinamiGrafic();

		winGrafDiario = Ext.create('Ext.window.Window', {
			layout: 'fit',
            title: 'Grafica de Parqueaderos Ocupados por Dia',
            iconCls: 'icon-estadistica',
            maximizable: true,            
            width: 720,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: [formGraficGeneral]
		});
	}	
	winGrafDiario.show();
}

function getJsonOfStore(store){    
    var datar = new Array();
    var jsonDataEncode = "";
    var records = store.getRange();    
    for (var i = 0; i < records.length; i++) {
        datar.push(records[i].data);
    }    
    jsonDataEncode = Ext.JSON.encode(datar);

    return jsonDataEncode;
}