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