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

Ext.onReady(function () {
    Ext.apply(Ext.form.field.VTypes, {
        daterange: function (val, field) {
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
        password: function (val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val == pwd.getValue());
            }
            return true;
        },
        passwordText: 'Passwords do not match',
        cedulaValida: function (val, field) {
            if (val.length != 10) {
                return false;
            }

            if (val.length == 10) {
                if (check_cedula(val)) {
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

    var graficas = Ext.create('Ext.button.Button', {
        text: 'Graficas',
        scope: this,
        iconCls: 'icon-estadistica',
        menu: [
            {text: 'Ocupados', iconCls: 'icon-grafica-por-dia', handler: function () {
                    windowGraficasOcupados();
                }},
            {text: 'Diario', iconCls: 'icon-grafica-por-dia', handler: function () {
                    windowGraficasDiario();
                }}
        ]
    });
    var administracion = Ext.create('Ext.button.Button', {
        text: 'Administración',
        iconCls: 'icon-Administracion',
        scope: this,
        menu: [
            {text: 'Usuarios', iconCls: 'icon-user', handler: function () {
                    showWinAdminUsuarios();
                }},
            {text: 'Personal', iconCls: 'icon-personal', handler: function () {
                    showWinAdminPersonas();
                }},
            {text: 'Zonas', iconCls: 'icon-direccion', handler: function () {
                    ventAddZona();
                }},
            {text: 'Parqueaderos', iconCls: 'icon-parqueo', handler: function () {
                    showWinAdminParking();
                }},
            {text: 'Sitios Recaudo', iconCls: 'icon-ico', handler: function () {
                    showWinAdminSitios();
                }},
            {text: 'Sanciones', iconCls: 'icon-pos-des-coop', handler: function () {
                    showWinAdminSancion();
                }},
        ]
    });
    var salir = Ext.create('Ext.button.Button', {
        text: 'Salir',
        scope: this,
        icon: 'img/salir.png',
        handler: function () {
            window.location = 'php/login/logout.php';
        }
    });
    var limpiar = Ext.create('Ext.button.Button', {
        text: 'Limpiar Mapa',
        scope: this,
        icon: 'img/clean.png',
        handler: function () {
            lienzoLocalizar.destroyFeatures();
            var lat = -3.9992;
            var lon = -79.19833;
            var zoom = 15;
            centrarMapa(lon, lat, zoom);
        }
    });

    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        items: [
            graficas,
            administracion,
            salir,
        ]
    });

    var panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        deferreRender: false,
        activeTab: 0,
        items: [{
                height: 25,
                html: '<section id="panelNorte">' +
                        '<h1>SISTEMA DE MONITOREO DE PARQUEADERO</h1>' +
                        '</section>'
            },
            barraMenu]
    });

    Ext.define('siteModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'text'},
            {name: 'iconCls'},
            {name: 'id'},
            {name: 'leaf'},
            {name: 'latitud'},
            {name: 'longitud'}
        ],
        proxy: {
            type: 'ajax',
            url: 'php/tree/getTreeSite.php',
            format: 'json'
        },
    });
    Ext.define('parkingModel', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'text'},
            {name: 'iconCls'},
            {name: 'id'},
            {name: 'leaf'},
            {name: 'latitud'},
            {name: 'longitud'}
        ],
        proxy: {
            type: 'ajax',
            url: 'php/tree/getTreeParking.php',
            format: 'json'
        },
    });

    var storeTreeParking = Ext.create('Ext.data.TreeStore', {
        model: 'parkingModel'
    });
    var storeTreeSite = Ext.create('Ext.data.TreeStore', {
        model: 'siteModel'
    });

    var panelEste = Ext.create('Ext.form.Panel', {
        region: 'west',
        id: 'west_panel',
        title: 'Localizacion',
        frame: true,
        width: 220,
        height: 10,
        split: true,
        collapsible: true,
        collapsed: true,
        layout: 'accordion',
        border: false,
        layoutConfig: {
            animate: false
        },
        items: [{
                xtype: 'treepanel',
                id: 'puntos-tree',
                title: 'Parqueaderos',
                autoScroll: true,
                iconCls: 'icon-parqueo',
                store: storeTreeParking,
                rootVisible: false,
                tools: [{
                        type: 'help',
                        handler: function () {
                        }
                    }, {
                        type: 'refresh',
                        itemId: 'refresh_puntos',
                        tooltip: 'Refresh form Data',
                        hidden: true,
                        handler: function () {
                            var tree = Ext.getCmp('puntos-tree');
                            tree.body.mask('Loading', 'x-mask-loading');
                            storeTreeParking.reload();
                            Ext.example.msg('Mensaje', 'Parqueaderos Recargados..');
                            tree.body.unmask();
                        }
                    }, {
                        type: 'search',
                        handler: function (event, target, owner, tool) {
                            owner.child('#refresh_puntos').show();
                        }
                    }],
                root: {
                    dataIndex: 'text',
                    expanded: true
                },
                listeners: {
                    itemclick: function (thisObject, record, item, index, e, eOpts) {
                        localizarDireccion(record.data.longitud, record.data.latitud, 17);
                    }
                }
            },
            {
                xtype: 'treepanel',
                id: 'sitios-tree',
                title: 'Sitios Recaudo',
                autoScroll: true,
                iconCls: 'icon-parqueo',
                store: storeTreeSite,
                rootVisible: false,
                tools: [{
                        type: 'help',
                        handler: function () {
                        }
                    }, {
                        type: 'refresh',
                        itemId: 'refresh_puntos',
                        tooltip: 'Refresh form Data',
                        hidden: true,
                        handler: function () {
                            var tree = Ext.getCmp('puntos-tree');
                            tree.body.mask('Loading', 'x-mask-loading');
                            storeTreeSite.reload();
                            Ext.example.msg('Mensaje', 'Parqueaderos Recargados..');
                            tree.body.unmask();
                        }
                    }, {
                        type: 'search',
                        handler: function (event, target, owner, tool) {
                            owner.child('#refresh_puntos').show();
                        }
                    }],
                root: {
                    dataIndex: 'text',
                    expanded: true
                },
                listeners: {
                    itemclick: function (thisObject, record, item, index, e, eOpts) {
                        localizarDireccion(record.data.longitud, record.data.latitud, 17);
                    }
                }
            }
        ]
    });

    Ext.define("direcciones", {
        extend: 'Ext.data.Model',
        proxy: {
            type: 'ajax',
            url: 'php/extra/getDirecciones.php',
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

    var panelCentral = Ext.create('Ext.form.Panel', {
        id: 'panel-map',
        frame: true,
        region: 'center',
        html: '<div id="map"><div>'
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, panelEste, panelCentral]
    });

    loadMap();
    cargaZonas();
});

function cargaZonas() {
    var formZonas = Ext.create('Ext.form.Panel', {});
    var form = formZonas.getForm();
    form.submit({
        url: 'php/extra/getZonas.php',
        success: function (form, action) {
            for (var i = 0; i < action.result.data.length; i++) {
                drawPoligonoGeocerca1(action.result.data[i].coordenadas, action.result.data[i].nombre, action.result.data[i].color);
            }
        },
        failure: function (form, action) {
        }
    });
}