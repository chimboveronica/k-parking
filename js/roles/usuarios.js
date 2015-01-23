Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.form.*',
    'Ext.layout.container.HBox',
    'Ext.dd.DropTarget',
    'Ext.util.*',
    'Ext.Action',
    'Ext.tab.*',
    'Ext.button.*',    
    'Ext.state.*',
    'Ext.form.*',
    'Ext.layout.container.Card',
    'Ext.layout.container.Border',
    'Ext.ajax.*',
    'Ext.ux.PreviewPlugin',
    'Ext.ux.grid.FiltersFeature'
   
]);

var panelMapa;

var drawControls;
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

var latPos;
var lonPos;

var filters = {
    ftype: 'filters',
    encode: false, 
    local: true,  
    filters: [{
        type: 'boolean',
        dataIndex: 'visible'
    }]
};

Ext.onReady(function() {
    Ext.apply(Ext.form.field.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        },

        daterangeText: 'Start date must be less than end date',

        password: function(val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val == pwd.getValue());
            }
            return true;
        },

        passwordText: 'Passwords do not match',

        cedulaValida: function(val, field) {
            if (val.length != 10) {
                return false;
            }

            if (val.length==10){
                if (check_cedula(val)){
                    return true
                } else {
                    return false
                }
            }
            return true
        },

        cedulaValidaText: 'Numero de Cedula Invalida'
    });
    
    Ext.tip.QuickTipManager.init();

    var login = Ext.create('Ext.button.Button',{
        text : 'Login',
        scope : this,
        iconCls : 'icon-user',
        handler : function() {
            location.href = "index_login.php";
        }
    });
    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {        
        width : '100%',        
        items : [login]
    });   

    var panelMenu = Ext.create('Ext.form.Panel', {        
        region : 'north',
        deferreRender: false,
        activeTab: 0,                
        items : [{            
            height : 25,
            html : '<section id="panelNorte">'+
                        '<h1>SISTEMA DE MONITOREO DE PARQUEADERO</h1>'+
                    '</section>'
        },
        barraMenu]
    });

    Ext.define('parkingModel', {
        extend : 'Ext.data.Model',
        fields : [
            {name : 'text'},
            {name : 'iconCls'},
            {name : 'id'},
            {name : 'leaf'}            
        ],
        proxy : {
            type : 'ajax',
            url : 'php/tree/getTreeParkingUser.php',
            format : 'json'
        },
    });

    var storeTreeParking = Ext.create('Ext.data.TreeStore', {        
        model: 'parkingModel'        
    });

    var panelEste = Ext.create('Ext.form.Panel', {
        region: 'west',
        id : 'west_panel',
        title : 'Localizacion',
        frame : true,
        width: 220,        
        split : true,
        collapsible: true,
        collapsed : true,
        layout:'accordion',
        border:false,
        
        layoutConfig: {
            animate:false
        },
        items : [{
            xtype: 'treepanel',
            id : 'puntos-tree',
            title: 'Parqueaderos',
            autoScroll: true,
            iconCls : 'icon-parqueo',
            store : storeTreeParking,
            rootVisible: false,
            tools:[{
                type: 'help',
                handler: function(){
                    // show help here
                }
            },{
                type:'refresh',
                itemId: 'refresh_puntos',
                tooltip: 'Refresh form Data',
                hidden: true,
                handler : function(){
                    var tree = Ext.getCmp('puntos-tree');
                    tree.body.mask('Loading', 'x-mask-loading');
                    storeTreeParking.reload();
                    Ext.example.msg('Mensaje', 'Parqueaderos Recargados..');
                    tree.body.unmask(); 
                }                
            },{
                type: 'search',
                handler: function(event, target, owner, tool){
                    owner.child('#refresh_puntos').show();
                }
            }],            
            root: {
                dataIndex: 'text',
                expanded: true                
            },            
            listeners: {
                itemclick : function(thisObject, record, item, index, e, eOpts){
                    var aux = record.internalId;
                        var idEquipo = record.data.id;                        
                        showParking(idEquipo);                        
                    }                    
                
            }
        }]
    });

    Ext.define("direcciones", {
        extend: 'Ext.data.Model',
        proxy: {
            type: 'ajax',
            url : 'php/extra/getDirecciones.php',
            reader: {
                type: 'json',
                root: 'direccion'                
            }
        },

        fields: [
            {name: 'todo'},
            {name: 'pais'},
            {name: 'ciudad'},
            {name: 'barrio'},
            {name: 'avenidaP'},
            {name: 'avenidaS'},
            {name: 'latitud'},
            {name: 'longitud'}
        ]
    });

    var storeDirecciones = Ext.create('Ext.data.Store', {
        pageSize: 10,
        model: 'direcciones'
    });

    var direcciones = Ext.create('Ext.form.Panel',{
        frame : true,
        region : 'north',
        layout : 'column',        
        items : [{
            layout : 'fit',
            baseCls:'x-plain',
            bodyStyle:'padding:3px 5px 0 3px',
            width : 400,
            items : [{
                xtype: 'combo',
                store: storeDirecciones,
                fieldLabel : 'Direccion',                    
                displayField: 'todo',
                labelWidth : 60,
                typeAhead: false,
                hideTrigger:true,
                anchor : '100%',
                
                emptyText : 'Ciudad,Barrio,Avenida Principal,Avenida Secundaria',

                listConfig: {
                    loadingText: 'Buscando...',
                    emptyText: 'No ha encontrado resultados parecidos.',
                    getInnerTpl: function() {
                        return '<b>{pais} , {ciudad}:</b><br>{barrio} , {avenidaP} , {avenidaS}';
                    }
                },

                listeners : {
                    select: function( thisObject, record, eOpts ){                            
                        var longitud = record[0].data.longitud;
                        var latitud = record[0].data.latitud;                            
                        var zoom = 18;
                        searchDirection(longitud, latitud, zoom);
                    }
                },
                pageSize: 10
            }]
        },{ 
            baseCls:'x-plain',
            bodyStyle:'padding:3px 0 0 5px',
            items : [{
                xtype : 'button',            
                iconCls : 'icon-localizame',
                tooltip : 'Localizame',
                handler : getLocation
            }]            
        }]
    });

    var panelCentral = Ext.create('Ext.form.Panel',{
        frame : true,
        region : 'center',
        html : '<div id="map"><div>'
    });    

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, panelEste, panelCentral]
    });  var formRutas = Ext.create('Ext.form.Panel', {});
    var form = formRutas.getForm();
    form.submit({
        url: 'php/extra/getZonas.php',
        success: function (form, action) {
            for (var i = 0; i < action.result.data.length; i++) {
                drawZonas(action.result.data[i].coordenadas, action.result.data[i].nombre, action.result.data[i].color);
                
            }
        },
        failure: function (form, action) {
        }
    });
    
});