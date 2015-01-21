
/*Obtengo Parqueaderos */
function getDataParking() {
//	Ext.create('Ext.data.JsonStore', {
//        autoDestroy : true,
//        autoLoad : true,                    
//        proxy: {
//            type: 'ajax',
//            url: 'php/core/getDataParking.php',
//            reader: {
//                type: 'json'
//            }
//        },
//        fields : ['string'],
//        listeners : {
//            load : function(thisObject, records, successful, eOpts){
//                var resultado = records[0].data;
//                var puntos = Ext.JSON.decode(resultado.string).puntos;
//                addParkingToCanvas(puntos);
//            }
//        }
//    });


    var formParking = Ext.create('Ext.form.Panel', {});
    var form = formParking.getForm();
    form.submit({
        url: 'php/extra/getParking.php',
        success: function (form, action) {
//            console.log(action.result.data);
            addVehiculosToCanvas(action.result.data);
        },
        failure: function (form, action) {
        }
    });
    setTimeout(function () {
        getDataParking();
    }
    , 3 * 1000);
}

function getDataParkingUser() {
    Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/core/getDataParkingUser.php',
            reader: {
                type: 'json'
            }
        },
        fields: ['string'],
        listeners: {
            load: function (thisObject, records, successful, eOpts) {
                var resultado = records[0].data;
                var puntos = Ext.JSON.decode(resultado.string).puntos;
                addParkingToCanvas(puntos);
            }
        }
    });

    setTimeout(function () {
        getDataParkingUser();
    }
    , 3 * 1000);
}

function getDataParkingGoogle() {
    Ext.create('Ext.data.JsonStore', {
        autoDestroy: true,
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/core/getDataParking.php',
            reader: {
                type: 'json'
            }
        },
        fields: ['string'],
        listeners: {
            load: function (thisObject, records, successful, eOpts) {
                var resultado = records[0].data;
                var puntos = Ext.JSON.decode(resultado.string).puntos;
                addParkingToCanvasGoogle(puntos);
            }
        }
    });

    setTimeout(function () {
        getDataParkingGoogle();
    }
    , 3 * 1000);
}