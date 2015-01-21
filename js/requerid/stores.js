var showCoopMap = new Array();
var menuCoop;

var storeParking = Ext.create('Ext.data.JsonStore', {
    autoDestroy : true,
    autoLoad : true,
    proxy : {
        type : 'ajax',
        url:'php/gui/combobox/comboParking.php',
        reader : {
            type : 'json',
            root: 'parking'
        }
    },
    fields : ['id', 'nombre']
});

var storePersonas = Ext.create('Ext.data.JsonStore', {
    autoDestroy : true,
    autoLoad : true,
    proxy : {
        type : 'ajax',
        url:'php/gui/combobox/comboPersonas.php',
        reader : {
            type : 'json',
            root: 'personas'
        }
    },
    fields : ['id', 'nombre']
});
var storeZonas = Ext.create('Ext.data.JsonStore', {
    autoDestroy : true,
    autoLoad : true,
    proxy : {
        type : 'ajax',
        url:'php/gui/combobox/comboZonas.php',
        reader : {
            type : 'json',
            root: 'data'
        }
    },
    fields : ['id_zona', 'zona'],
        listeners: {
        load: function (thisObject, records, successful, eOpts) {
            for (var i = 0; i < records.length; i++) {
                var dataCoop = records[i].data;
                showCoopMap[i] = [dataCoop.id_zona, dataCoop.zona, false];
            }
             for (var i = 0; i < showCoopMap.length; i++) {
                if (typeof menuCoop !== 'undefined') {
                    menuCoop.add({itemId: showCoopMap[i][0], text: showCoopMap[i][1], checked: showCoopMap[i][2]});
                }
            }
        }
    }
});

var storeRolUserList = Ext.create('Ext.data.Store', {
    autoDestroy : true,
    autoLoad : true,
    proxy : {
        type : 'ajax',
        url:'php/listFilters/listRolUser.php',
        reader : {
            type : 'array'
        }
    },
    fields : ['id', 'text']
}); 

var storeParkingGrid = Ext.create('Ext.data.JsonStore', {
    autoDestroy : true,
    autoLoad : true,
    proxy : {
        type : 'ajax',
        url : "php/core/getParkingForGrid.php",
        reader : {
            type : 'json',
            root : 'puntos'
        }
    },
    fields  : [
        {name: 'idParking'},
        {name: 'parking'},
        {name: 'latitud', type: 'float'},
        {name: 'longitud', type: 'float'}
    ]
});