var winEditParking;
var gridParking;

Ext.onReady(function(){    

    gridParking = Ext.create('Ext.grid.GridPanel', {
        store: storeParkingGrid,
        columns: [
            {header : 'Id', width : 30, dataIndex : 'idParking'},
            {header : 'Parqueadero', flex : 12, dataIndex : 'parking'},
            {header : 'Latitud', flex : 8, dataIndex : 'latitud'},
            {header : 'Longitud', flex : 8, dataIndex : 'longitud'}
        ],        
        buttons: [{
            text    : 'Guardar',
            iconCls: 'icon-save',
            handler: function() {
                Ext.Ajax.request({
                    url : 'php/core/updateParking.php',
                    success : function (result) {
                        var r = Ext.JSON.decode(result.responseText);
                        winEditParking.hide();
                        //limpiarCapas();
                        activarArrastrePuntos(false);
                        storeParkingGrid.commitChanges();
                    },        
                    params : {
                        puntos  : getJsonOfStore(storeParkingGrid)
                    }
                });
            }
        },{
            text: 'Cancelar',
            iconCls: 'icon-cancelar',
            handler : clearEditParking
        }]
    });
});

function clearEditParking() {
    if (winEditParking) {
        activarArrastrePuntos(false);
        winEditParking.hide();
    }
}

function windowEditParking(){
    if(!winEditParking){
        winEditParking = Ext.create('Ext.window.Window', {
            layout : 'fit',
            title : 'Editar Puntos',
            iconCls : 'icon-editar-parking',
            resizable : true,
            width : 500,
            height : 300,
            closeAction : 'hide',
            plain  : false,
            items  : gridParking,
            listeners : {
                close : function( panel, eOpts ){
                    clearEditParking();
                }
            }
        });
        permitirArrastrarPuntosRutas();
    }
    activarArrastrePuntos(true);    
    winEditParking.show();
}
