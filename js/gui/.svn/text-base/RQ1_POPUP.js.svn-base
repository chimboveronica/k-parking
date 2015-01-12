var RQ2PopUpPanel;
var RQ2PopUpWin;

/**
 * Render Hora
 */
function formatHora(horaF) {
    return '<center>' + horaF.substring(0,5) + '</center>';
}

/**
 * Render Sentido
 */
function formatSentido(sentidoLetra) {
    if (sentidoLetra == 'B') {
       return '<center>Baja</center>'
    }else if (sentidoLetra == 'R') {
        return '<center>Sube</center>'
    }else if (sentidoLetra == 'BR') {
        return '<center>Baja-Sube</center>'
    }else {
        return '<center>No Ex</center>'
    }
}

/*
 * Limpia la Ventana
 */
function RQ2_PopUP_limpiar_win(){
    RQ2PopUpPanel.getForm().reset();
    RQ2PopUpWin.hide();
}

/*
 * Muestra la ventana 
 */
function RQ2_PopUP_getWin(idP){

    //carga store con los datos
    strInfoParada.proxy= new Ext.data.HttpProxy({
        url: 'core/php/core/RQ1_infoParada.php?idparada='+idP
    });
    strInfoParada.load();

    if(!RQ2PopUpWin){
        RQ2PopUpWin = new Ext.Window({
            layout:'fit',
            title:'<center>Informacion Parada</center>',
            resizable : true,
            width : 425,
            height : 200,
            closeAction : 'hide',
            plain : false,
            items : [RQ2PopUpPanel]
        });
    }
    RQ2PopUpWin.show(this);
}

Ext.onReady(function(){
    
    //Define los campos
    var metadataInfoParada = Ext.data.Record.create([
    {
        name: 'TIPO'
    },{
        name: 'NOMBRE'
    },{
        name: 'HORA'
    }
    ]);

    //Define Store
    strInfoParada = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'php/monitoreo/infoParada.php',
            method: 'POST'
        }),
        reader: new Ext.data.JsonReader({},metadataInfoParada),
        remoteSort: false
    });

    // Crear Grid
    var grdInfoParada = new Ext.grid.GridPanel({
        store: strInfoParada,
        columns: [
        {
            id:'tipoPopUp',
            header: 'SENTIDO',
            width: 52,
            //sortable: true,
            renderer: formatSentido,
            dataIndex: 'TIPO'
        },
        {
            header: '<center>RUTA</center>',
            width: 247,
            //sortable: true,
            dataIndex: 'NOMBRE'
        },
        {
            header: '<center>HORA</center>',
            width: 75,
            //sortable: true,
            renderer: formatHora,
            dataIndex: 'HORA'
        }
        ],
        stripeRows: true,
        height: 150,
        width: 400,
        stateful: true,
        stateId: 'grdInfoParada'
    });
    
    RQ2PopUpPanel = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        bodyStyle:'padding: 0px 0px 0 0px',  //bodyStyle:'padding:5px 5px 0 ',
        labelWidth:150,
        items: [
        grdInfoParada
        ]
    });
    
});
