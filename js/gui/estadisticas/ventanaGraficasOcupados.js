var winGrafOcup;
var chartGrafOcup;

Ext.onReady(function(){
    var storeGrafOcup = Ext.create('Ext.data.JsonStore', {
        autoDestroy : true,
        autoLoad : true,
        proxy: {
            type: 'ajax',
            url: 'php/gui/estadisticas/getDataGrafOcup.php',
            reader: {
                type: 'json',
                root: 'cantParking'
            }
        },
        fields:['idParking', 'total']
    });

    chartGrafOcup = Ext.create('Ext.chart.Chart', {
        animate: true,
        shadow: true,
        store: storeGrafOcup,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['total'],
            title: 'Ocupados',
            grid: true,
            minimum: 0,
            maximum: 30
        }, {
            type: 'Numeric',
            position: 'bottom',
            fields: ['idParking'],
            title: 'Parqueaderos',            
            minimum: 1,
            maximum: 20,
            minorTickSteps: 1,
        }],
        series: [{
            type: 'column',
            axis: 'left',
            gutter: 80,
            xField: 'idParking',
            yField: ['total'],
            tips: {
                trackMouse: true,
                width: 74,
                height: 38,
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get('idParking'));
                    this.update('Total:'+storeItem.get('total'));
                }
            },
            style: {
                fill: '#38B8BF'
            }
        }]
    });
});

function windowGraficasOcupados() {
	if (!winGrafOcup) {
		winGrafOcup = Ext.create('Ext.window.Window', {
			layout: 'fit',
            title: 'Grafica de Parqueaderos Ocupados por Dia',
            iconCls: 'icon-estadistica',
            maximizable: true,            
            width: 630,
            height: 400,
            closeAction: 'hide',
            plain: false,
            tbar: [{
                text: 'Descargar',
                iconCls : 'icon-save-img',
                handler: function() {
                    Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chartGrafOcup as an image?', function(choice){
                        if(choice == 'yes'){
                            chartGrafOcup.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
                text: 'Hoy',
                iconCls : 'icon-today',
                handler: function() {
                    chartGrafOcup.getStore().load({
                        params : {
                            fecha : Ext.Date.format(new Date(), 'Y-m-d')
                        }
                    });
                }
            },{
                xtype: 'datefield',                
                format: 'Y-m-d',
                name: 'fecha',
                allowBlank: false,
                emptyText:'Fecha Inicial...',
                listeners : {
                    change: function( thisObject, newValue, oldValue, eOpts ) {                        
                        chartGrafOcup.getStore().load({
                            params : {
                                fecha : Ext.Date.format(newValue, 'Y-m-d')
                            }
                        });
                    }
                }
            }],
            items: chartGrafOcup
		});
	}	
	winGrafOcup.show();
}